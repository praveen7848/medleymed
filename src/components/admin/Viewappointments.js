import React, { Component,useState } from "react";
import { ToastContainer } from "react-toastify";
import $ from "jquery";
import toast from "../helpers/toast";
import Httpconfig from "../helpers/HttpconfigAdmin";
import Constant from "../../constants";
import { Form, Button, Dropdown, Grid, Header } from "semantic-ui-react";
import ReactExport from "react-data-export";
import { Link } from "react-router-dom";

const ExcelFile = ReactExport.ExcelFile;
const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;
const ExcelColumn = ReactExport.ExcelFile.ExcelColumn;
const moment = require("moment");

export default class Viewappointments extends Component {
  constructor(props) {
    super(props);
    this.state={
        DoctorsListData:"",
        selectedStatus:"",
        selectedRetailerId:"",
        selectedStartDate:"",
        selectedEndDate:"",
        searchString:"",
        orderDetailsView:"collapse-hide",
        orderListView:"container-fluid",
        loadshow:"load_sec collapse-hide",
        pageNumber:1,
        ordersView:[],
        currentOrders:[],
        selectedStatus:1,
        
    };
    this.getAllOrders=this.getAllOrders.bind(this);
   
  }

  // To get detais after first render
  componentDidMount = () => {
    this.orderStatusCount();
    this.fetchDoctorInfo();
    this.getAllOrders();
    this.getRejectionResonslist();

  };

//   componentWillMount(){
//     window.addEventListener('scroll', this.loadMore);
//   }
  
//   componentWillUnmount(){
//       window.removeEventListener('scroll', this.loadMore);
//   }
  
//   loadMore(){
//       if (window.innerHeight + document.documentElement.scrollTop === document.scrollingElement.scrollHeight) {
//           // Do load more content here!
//           alert(document.scrollingElement.scrollHeight);
//       }
//   }

  
  orderStatusCount=()=> {
    let doctorId=this.state.selectedRetailerId;
    let startDate=this.state.selectedStartDate;
    let endDate=this.state.selectedEndDate;
    let orderStatus=this.state.selectedStatus;
    let searched=this.state.searchString;

    Httpconfig.httptokenpost(Constant.siteurl + "api/PatientAppointment/getAdminPatientAppointDetails",
    {
        "appointmentid":searched,
        "appointmentStatus":orderStatus,
        "start_date":startDate,
        "end_date":endDate,
        "doctorid":doctorId,
        "page_number":1,

        // "retailer_id":retailerId,
        // "start_date":startDate,
        // "end_date":endDate,
        // "order_status":orderStatus,
        // "order_search_id":searched,
    }
).then((response) => {
        //let listData=response.data.data;
        this.state.all=response.data.data[0].all;
        this.state.pending=response.data.data[0].pending;
        this.state.reviewed=response.data.data[0].reviewed;
        this.state.processing=response.data.data[0].processing;
        this.state.shipping=response.data.data[0].shipping;
        this.state.delivered=response.data.data[0].delivered;
        this.state.cancelled=response.data.data[0].cancelled;
 
         this.forceUpdate();
      
    }).catch((error) => {
       console.log(error);
    });
 }

  // Get the retailers list
  fetchDoctorInfo() {
    Httpconfig.httptokenget(Constant.siteurl + "api/Doctor/getAllDoctors").then((response) => {
        let listData=response.data.data;
        let DoctorsListData = listData.map((item, index) => ({
            key: item.id,
            text: item.doctor_name,
            value: item.id,
          }));
          //console.log(retailersListData);
        
         this.state.DoctorsListData=DoctorsListData;
         
         this.forceUpdate();
      
    }).catch((error) => {
       console.log(error);
    });
 }
 // On retalier selection
 onDoctorListChange = (event, data) => {
    let selectedDoctorValue = data.value;

    if (selectedDoctorValue != "") {
      const keys = data.options.find((data) => data.value === selectedDoctorValue);
      const selectedretailer = {
        id: keys.key,
        doctorName: keys.text,
        doctorName: keys.value,
      };
      //this.state.retalierSelected = selectedretailer
      this.state.selectedDoctorName = keys.text;
      this.state.selectedDoctorId = selectedDoctorValue; //keys.key;
      this.forceUpdate();
      this.getAllOrders(); 
    }
    
  };

  // get all the orders
  getAllOrders(){
     //alert(this.state.SelectedEndDate);
      let doctorId=this.state.selectedDoctorId;
      let startDate=this.state.selectedStartDate;
      let endDate=this.state.selectedEndDate;
      let orderStatus=this.state.selectedStatus;
      let searched=this.state.searchString;
      let pageNumber=this.state.pageNumber;
      let PaidAmount="";
      let finalordersarray=[];


      Httpconfig.httptokenpost(Constant.siteurl + "api/PatientAppointment/getAdminPatientAppointDetails",
      {
          "appointmentid":searched,
          "appointmentStatus":orderStatus,
          "start_date":startDate,
          "end_date":endDate,
          "doctorid":doctorId,
          "page_number":1,
            
      }  

    
).then((response) => {
        this.state.currentOrders=response.data.data;
        let PaidAmount="0.00";
        if(Object.keys(response.data.data).length>=20){
            this.state.loadshow="load_sec collapse-show";
            this.forceUpdate();
        }else{
            this.state.loadshow="load_sec collapse-hide";
            this.forceUpdate();
        }
        const ordersView= response.data.data.map((LoadedData,num)=>{

            //alert(LoadedData.TotPaidAmount);
            if(LoadedData.TotPaidAmount!=null){
                
              PaidAmount=parseFloat(LoadedData.TotPaidAmount);
              //alert(PaidAmount);
              PaidAmount=PaidAmount.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
           
            }
            
            
            let hoursDiff=moment(LoadedData.appointment_datetime, 'YYYY-MM-DD hh:mm:ss').fromNow();

            //alert(hoursDiff);
            // finalordersarray.push({
            //     "Customer Name":LoadedData.patient_tbl.name.charAt(0).toUpperCase() + LoadedData.patient_tbl.name.slice(1) +","+LoadedData.patient_tbl.phone_number,
            //     "Retailer":LoadedData.doctor_tbl.doctor_name+","+LoadedData.doctor_tbl.doctor_name+","+LoadedData.tbl_user.email+","+LoadedData.tbl_user.mobile_number,
            //     "Order Id":LoadedData.appointment_confirm_id,
            //     "Order Date":LoadedData.appointment_datetime,
            //     "Amount":PaidAmount,
            //     // "Items":Object.keys(LoadedData.order_processing_tbls).length,
            //     "Order Status": LoadedData.order_status_tbl.status,
    
            // })
            return (
                <tr>
                <td>{num+1}</td>
                <td>{LoadedData.patient_tbl.name ? LoadedData.patient_tbl.name.charAt(0).toUpperCase() + LoadedData.patient_tbl.name.slice(1) :"--"} <h6 class="td_down">{LoadedData.patient_tbl.phone_number ? LoadedData.patient_tbl.phone_number :"--"}</h6></td>
                <td >
                  <div class="dropdown">
                      <p class="dropbtn">Dr. {LoadedData.doctor_tbl.doctor_name ? LoadedData.doctor_tbl.doctor_name : "--"} </p>
                       <h6 class="caret"><img src="https://static.thenounproject.com/png/427197-200.png" /></h6>
                  <div class="dropdown-content">
                  {/*   <h3>{LoadedData.doctor_tbl.doctor_name ? LoadedData.doctor_tbl.doctor_name : "--"}</h3> */}
                     <p>{ }{LoadedData.doctor_tbl.mobile_no ? LoadedData.doctor_tbl.mobile_no : ""}</p>
                     <p>{" "}{LoadedData.doctor_tbl.email ? LoadedData.doctor_tbl.email : ""}</p>
                    
                      </div>
                      </div>
                </td>
                <td><p onClick={this.orderDetailsView.bind(this,LoadedData.appointment_confirm_id)}>{LoadedData.appointment_confirm_id}</p></td>
                <td>
                {hoursDiff}
                
                </td>
                <td class="presc_field">
                
                {/* {LoadedData.cart_prescriptions_tbl  ? 
                    LoadedData.cart_prescriptions_tbl.medical_document.map((presImages, num) => {
                    return(
                    <a  href={presImages ?  Constant.imgurl+presImages: ""} target="_blank"> 
                    <img class="presc_img" src="https://cdn.onlinewebfonts.com/svg/img_491633.png" />
                    </a>
                    )
                })  
                : "--"} */}

              </td>
              {/* <td>{Object.keys(LoadedData.TotPaidAmount).length}</td> */}
              <td>
              {/* {LoadedData.retailer_registration_tbl.currency}  */}
              {PaidAmount ? PaidAmount :"--"}</td>
              <td >
              {LoadedData.status<4 ?
                  <div class="dropdown">
                      {/* <p class="dropbtn"><h6 class="td_down">{hoursDiff}</h6></p> */}
                      {/* <h6 class="caret"><img src="https://static.thenounproject.com/png/427197-200.png" /></h6> */}
                  
                  {/* <div class="dropdown-content"> */}
                  
                    {LoadedData.status==1 ?
                      <React.Fragment>
                      <a href="#" onClick={this.ChangeOrderStatus.bind(this,LoadedData.id,1)}>Upcoming</a>
                      </React.Fragment>
                      :""}
                    {LoadedData.status==2 ?
                     <React.Fragment>
                      <a href="#" onClick={this.ChangeOrderStatus.bind(this,LoadedData.id,2)}>Ongoing</a>
                      </React.Fragment>
                      :""}
                    {LoadedData.status==3 ?
                     <React.Fragment>
                      <a href="#" onClick={this.ChangeOrderStatus.bind(this,LoadedData.id,3)}>Completed</a>
                      
                      </React.Fragment>
                      :""}
                      {/* </div> */}
                      </div>
                      :<p class="">{LoadedData.status} <h6 class="td_down"></h6></p>}
                </td>
              <td>
                  {LoadedData.status==4 ?
                  <React.Fragment>
                  <p data-toggle="modal" data-target="#reject_reason" onClick={this.handleSelectedOrderId.bind(this,LoadedData.id)}>Cancel</p>
                  </React.Fragment>
                  :"--"}
                  </td>
              </tr>
            )

        })
        this.state.ordersView=ordersView;
        //this.state.finalordersarray=finalordersarray;
        this.forceUpdate();
      
    }).catch((error) => {
       console.log(error);
    });

  }

  
  // Handle Selected status
  handleSelectedStatus=(status)=>{
      this.state.selectedStatus=status;
      $('.stat').removeClass("active");
      $('.status-'+status).addClass("active");
      this.forceUpdate();
      this.getAllOrders();
  }
  // Handle searched string
  handleSearchedString=(event)=>{
    let searched=event.target.value;
    this.state.searchString=searched;
    this.forceUpdate();
  }

  
/* change order status */

ChangeOrderStatus=(orderId,status)=>{
    // orderId=event.currentTarget.id;
 
     Httpconfig.httptokenput(Constant.siteurl + "api/OM/orderProcess/retailerOrderStatus/"+orderId,
     {"order_status":status}
 )
     .then((response) => { 
       if(response.data.status=200){
           toast.success(response.data.message);
           this.getAllOrders();
          
           
       }
      })
     .catch((error) => {
        toast.error(error);
     });
 
 }
// Reject Order list

getRejectionResonslist=()=>{
    Httpconfig.httptokenget(Constant.siteurl + "api/OM/cancellationReason/",)
        .then((response) => { 
        if(response.data.status=200){
            
        if(Object.keys(response.data.data).length>0){
            const retailerRejectList= response.data.data.map((finalLoadedData,num)=>{ 
            //alert(finalLoadedData.reason);
                return(
                    <p><input type="checkbox" class="rej_check" name="cancelReasons" id={finalLoadedData.id} onChange={this.cancelReason}/> {finalLoadedData.reason}</p>
                )
               
            })
            this.state.retailerRejectList=retailerRejectList;
           // console.log(retailerRejectList);
            this.forceUpdate();

        }
     
            }
            })
            .catch((error) => {
            toast.error(error);
            });


}

// update the cancellation reaon

cancelReason=(event)=>{
    let id=event.currentTarget.id;
    if(document.getElementById(id).checked == true){
        this.state.cancelleReason=id;
    }else{
        this.state.cancelleReason=""; 
    }
    this.forceUpdate();

}

// Reject order
rejectOrder=()=>{
    let cancelReasonsCheckedCount=$('input[name="cancelReasons"]:checked').length;
    let otherReason=$('#otherReason').val();
    let orderId=this.state.selectedCancelOrderId;
    if(cancelReasonsCheckedCount==0 && otherReason==""){
        toast.error("Select Reason for Cancellation");
        return
    }else{
    let cancelledReason=this.state.cancelleReason;
    //alert(cancelledReason);
    Httpconfig.httptokenpost(Constant.siteurl + "api/OM/cancellationReason/orderDetails/"+orderId,
    {"order_status":"6","cancelled_reason":cancelledReason}
)
    .then((response) => { 
      if(response.data.status=200){
          toast.success(response.data.message);
          $('#reject_reason').hide();
          $('input[name="cancelReasons"]:checked').prop('checked','');
          $('#otherReason').val('');
          this.state.cancelleReason="";
          this.state.selectedCancelOrderId="";
          this.forceUpdate();
          this.getAllOrders();

          
      }
     })
    .catch((error) => {
       toast.error(error);
    });
}
}  
// Order details view

orderDetailsView=(orderId)=>{
    this.state.orderDetailsView="collapse-show";
    this.state.orderListView="container-fluid collapse-hide";
    this.forceUpdate();
Httpconfig.httptokenget(Constant.siteurl + "api/OM/orderProcess/getAdminOrderDetail/"+orderId,
)
    .then((response) => { 
      if(response.data.status=200){
         // toast.success(response.data.message);
        //  window.location.reload();
      }
     })
    .catch((error) => {
       toast.error(error);
    });
}

showListView=()=>{
    this.state.orderDetailsView="collapse-hide";
    this.state.orderListView="container-fluid collapse-show";
    this.forceUpdate();

}
startDate=(event)=>{
    let startDate=event.target.value;
    this.state.selectedStartDate=moment(startDate).format("YYYY-MM-DD");
    this.forceUpdate();
    if(this.state.selectedEndDate!="" && this.state.selectedStartDate!=""){
        this.getAllOrders();
    }
}
    
    // Start date selection
endDate=(event)=>{
        let endDate=event.target.value;
        this.state.selectedEndDate=moment(endDate).format("YYYY-MM-DD");
        this.forceUpdate();
        if(this.state.selectedStartDate!="" && this.state.selectedEndDate!=""){
            this.getAllOrders();
        }
        
}
handleScroll = (e) => {
    // alert("in");
    const bottom =
      Number((e.target.scrollHeight - e.target.scrollTop).toFixed(0)) -
        e.target.clientHeight < 2;
    let page = this.state.pageNumber;
    if (bottom) {
      let page = this.state.pageNumber;
      page=page+1;
      this.setState({ pageNumber: page});
     this.getAllOrdersbyPage(page);
      //this.fetchmedicinedata(this.state.pageNumber);
    }
};

handleSelectedOrderId=(orderId)=>{
 this.state.selectedCancelOrderId=orderId;
 this.forceUpdate();
 
}

handleClear=(id)=>{
    if(id=='start_date'){
        this.state.selectedStartDate="";
        $("#"+id).val("");
    }
    if(id=='end_date'){
        this.state.selectedEndDate="";
        $("#"+id).val("");
    }
    if(id=='input-search'){
        this.state.searchString="";
        $("#"+id).val("");
        
    }
    this.forceUpdate();
    this.getAllOrders();

}

// get all the orders
getAllOrdersbyPage(pageNumber){
    
     let retailerId=this.state.selectedRetailerId;
     let startDate=this.state.selectedStartDate;
     let endDate=this.state.selectedEndDate;
     let orderStatus=this.state.selectedStatus;
     let searched=this.state.searchString;
     pageNumber=pageNumber+1;
     this.state.pageNumber=pageNumber;
     let PaidAmount="";
     let finalordersarray=[];
     let orderViews=[];

   Httpconfig.httptokenpost(Constant.siteurl + "api/OM/orderProcess/getAdminOrderDashboardDetails",{
       "retailer_id":retailerId,
       "start_date":startDate,
       "end_date":endDate,
       "order_status":orderStatus,
       "order_search_id":searched,
       "page_number":pageNumber,
   }).then((response) => {
       if(Object.keys(response.data.data).length>0 && pageNumber>1){
        orderViews = this.state.currentOrders.concat(response.data.data);
        this.state.currentOrders=orderViews;
        this.forceUpdate();
       }else{
         if(Object.keys(response.data.data).length>0){
            orderViews=response.data.data;
            this.state.currentOrders=orderViews;
            this.forceUpdate();
        }
       }
      if(Object.keys(orderViews).length>0){
        if(Object.keys(orderViews).length>=20){
            this.state.loadshow="load_sec collapse-show";
        }else{
            this.state.loadshow="load_sec collapse-hide";
        }
       const ordersView= orderViews.map((LoadedData,num)=>{
           PaidAmount=parseInt(LoadedData.payable_amount);
           if(LoadedData.payable_amount){
             PaidAmount=PaidAmount.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
           }
           finalordersarray.push({
               "Customer Name":LoadedData.patient_tbl.name.charAt(0).toUpperCase() + LoadedData.patient_tbl.name.slice(1) +","+LoadedData.patient_tbl.phone_number,
               "Retailer":LoadedData.retailer_registration_tbl.storename+","+LoadedData.retailer_registration_tbl.address+","+LoadedData.retailer_registration_tbl.email+","+LoadedData.retailer_registration_tbl.mobile_number,
               "Order Id":LoadedData.id,
               "Order Date":LoadedData.order_date,
               "Amount":PaidAmount,
               "Items":Object.keys(LoadedData.order_processing_tbls).length,
               "Order Status": LoadedData.order_status_tbl.status,
   
           })
           return (
               <tr>
               <td>{num+1}</td>
               <td>{LoadedData.patient_tbl.name ? LoadedData.patient_tbl.name.charAt(0).toUpperCase() + LoadedData.patient_tbl.name.slice(1) :"--"} <h6 class="td_down">{LoadedData.patient_tbl.phone_number ? LoadedData.patient_tbl.phone_number :"--"}</h6></td>
               <td >
                 <div class="dropdown">
                     <p class="dropbtn">{LoadedData.retailer_registration_tbl.storename ? LoadedData.retailer_registration_tbl.storename : "--"} </p>
                     <h6 class="caret"><img src="https://static.thenounproject.com/png/427197-200.png" /></h6>
                 <div class="dropdown-content">
                    <h3>{LoadedData.retailer_registration_tbl.storename ? LoadedData.retailer_registration_tbl.storename : "--"}</h3>
                    <p>{ }{LoadedData.retailer_registration_tbl.address ? LoadedData.retailer_registration_tbl.address : ""}</p>
                    <p>{" "}{LoadedData.retailer_registration_tbl.email ? LoadedData.retailer_registration_tbl.email : ""}</p>
                    <p>{" "}{LoadedData.retailer_registration_tbl.mobile_number ? LoadedData.retailer_registration_tbl.mobile_number : ""}</p>
                     </div>
                     </div>
               </td>
               <td><p onClick={this.orderDetailsView.bind(this,LoadedData.id)}>{LoadedData.id}</p></td>
               <td>{LoadedData.order_date}</td>
               <td class="presc_field">
               
               {    LoadedData.cart_prescriptions_tbl ?
                   Object.keys(LoadedData.cart_prescriptions_tbl).length>0  ? 
                   LoadedData.cart_prescriptions_tbl.medical_document.map((presImages, num) => {
                   return(
                   <a  href={presImages ?  Constant.imgurl+presImages: ""} target="_blank"> 
                   <img class="presc_img" src="https://cdn.onlinewebfonts.com/svg/img_491633.png" />
                   </a>
                   )
               })  
               : "--" : "--"}

             </td>
             <td>{Object.keys(LoadedData.order_processing_tbls).length}</td>
             <td>{LoadedData.retailer_registration_tbl.currency} {LoadedData.payable_amount ? PaidAmount :"--"}</td>
             <td >
             {LoadedData.order_status<5 ?
                 <div class="dropdown">
                     <p class="dropbtn">{LoadedData.order_status_tbl.status} <h6 class="td_down">2 hrs</h6></p>
                     <h6 class="caret"><img src="https://static.thenounproject.com/png/427197-200.png" /></h6>
                 
                 <div class="dropdown-content">
                 
                   {LoadedData.order_status==1 ?
                     <React.Fragment>
                     <a href="#" onClick={this.ChangeOrderStatus.bind(this,LoadedData.id,2)}>Prescription Review</a>
                     {/* <a href="#">Processing</a>
                     <a href="#">Shipped</a>
                     <a href="#">Delivered</a> */}
                     </React.Fragment>
                     :""}
                   {LoadedData.order_status==2 ?
                    <React.Fragment>
                     <a href="#" onClick={this.ChangeOrderStatus.bind(this,LoadedData.id,3)}>Processing</a>
                     {/* <a href="#">Shipped</a>
                     <a href="#">Delivered</a> */}
                     </React.Fragment>
                     :""}
                   {LoadedData.order_status==3 ?
                    <React.Fragment>
                     <a href="#" onClick={this.ChangeOrderStatus.bind(this,LoadedData.id,4)}>Shipped</a>
                     {/* <a href="#">Delivered</a> */}
                     </React.Fragment>
                     :""}
                   {LoadedData.order_status==4 ?
                    <React.Fragment>
                     <a href="#" onClick={this.ChangeOrderStatus.bind(this,LoadedData.id,5)}>Delivered</a>
                     </React.Fragment>
                     :""}
                     </div>
                     </div>
                     :<p class="">{LoadedData.order_status_tbl.status} <h6 class="td_down"></h6></p>}
               </td>
             <td>
                 {LoadedData.order_status!=6 ?
                 <React.Fragment>
                 <p data-toggle="modal" data-target="#reject_reason" onClick={this.handleSelectedOrderId.bind(this,LoadedData.id)}>Cancel</p>
                 </React.Fragment>
                 :"--"}
                 </td>
             </tr>
           )

       })
       this.state.ordersView=ordersView;
       this.state.finalordersarray=finalordersarray;
       this.forceUpdate();
       
    }else{
        this.state.loadshow="load_sec collapse-hide";
        this.forceUpdate();
    }
     
   }).catch((error) => {
      console.log(error);
   });

 }


  render() {
    
    return (
      <section id="main_dashboard" >
      <div class={this.state.orderListView} >
          <div class="row">
              <div class="col-md-12 no_padding">
           
              <div id="order_section">
                  <div class="container-fluid">
                 <div class="row">
                     <div class="col-lg-5 date_sec">
                          <h2>Select Date</h2>
                          <form>
                              <div class="form-group">
                                  {/* <input type="date" class="form-control" onChange={this.startDate} /> */}
                                  <input type="date" id="start_date" class="form-control"  placeholder="yyyy-mm-dd" onChange={this.startDate}/>
                                  <img class="remove_icon" src="https://www.flaticon.com/svg/static/icons/svg/59/59836.svg" onClick={this.handleClear.bind(this,'start_date')}/>
                              </div>
                              <p class="to_txt">To</p>
                              <div class="form-group">
                                  {/* <input type="date" class="form-control" /> */}
                                  <input type="date" id="end_date" class="form-control" onChange={this.endDate}/> 
                                  <img class="remove_icon" src="https://www.flaticon.com/svg/static/icons/svg/59/59836.svg" onClick={this.handleClear.bind(this,'end_date')} />
                              </div>
                          </form>
                     </div>
                     <div class="col-lg-5 select_ret_sec">
                             <div class="form-group">
                                 <label>
                                     Select Doctor
                                 </label>
                                 {this.state.DoctorsListData ?
                                 <Dropdown
                                      class="form-control"
                                      id="Doctors"
                                      placeholder={"Select Doctor"}
                                      fluid
                                      clearable
                                      search
                                      selection
                                      options={this.state.DoctorsListData}
                                      onChange={this.onDoctorListChange}
                                    />
                                    : "" } 
                             </div>
                             </div>
                  <div class="col-lg-2 generate_sec">
                  <ExcelFile element={ <a href="#"> <h2><img src="https://webstockreview.net/images/png-images-download-9.png" />Download XLS</h2></a>}>
                <ExcelSheet data={this.state.finalordersarray} name="Order Request">
                    <ExcelColumn label="Customer Name" value="Customer Name"/>
                    <ExcelColumn label="Retailer" value="Retailer"/>
                    <ExcelColumn label="Order Id" value="Order Id"/>
                    <ExcelColumn label="Order Date" value="Order Date"/>
                    <ExcelColumn label="Amount" value="Amount"/>
                    <ExcelColumn label="Items" value="Items"/>
                    <ExcelColumn label="Order Status" value="Order Status"/>
                    
                </ExcelSheet>
            </ExcelFile>
                {/* <a href="#"> <h2><img src="https://webstockreview.net/images/png-images-download-9.png" />Generate & Download</h2></a>  */}
                  </div>
                 </div>
              </div>
              </div>
  
              <div id="sorting_sec">
                  <div class="container-fluid">
                  <div class="row">
                      <div class="col-md-12 no_padding">
                          <div class="sorting_content">
                              <div class="sorting_head">
                          <h2>Sorting: </h2>
                           </div>
                          <ul>
                              <li class="stat status-0 active" onClick={this.handleSelectedStatus.bind(this,"")}>All ({this.state.all? this.state.all :"0"})</li>
                              <li class="stat status-3" onClick={this.handleSelectedStatus.bind(this,"0")}>Upcoming ({this.state.processing? this.state.processing :"0"})</li>
                              <li class="stat status-1" onClick={this.handleSelectedStatus.bind(this,"1")}>Ongoing ({this.state.pending? this.state.pending :"0"})</li>
                              <li class="stat status-2" onClick={this.handleSelectedStatus.bind(this,"2")}>Completed ({this.state.reviewed? this.state.reviewed :"0"})</li>
                              <li class="stat status-6" onClick={this.handleSelectedStatus.bind(this,"3")}>Cancelled ({this.state.cancelled? this.state.cancelled :"0"})</li>
                          </ul>
                      </div>
                  </div>
                  </div>
              </div>
              </div>
              <div id="search_order">
                  <div class="container-fluid">
                      <div class="row">
                          <div class="col-md-12 no_padding">
                              <form>
                                  <div class="form-group">
                                      <label>Seacrh Appointment</label>
                                      <div class="input-group" >
                                          <input type="text" id="input-search" class="form-control" placeholder="Search for Appointment Id, Phone number" onKeyUp={this.handleSearchedString} />
                                          <img class="remove_icon" src="https://www.flaticon.com/svg/static/icons/svg/59/59836.svg" onClick={this.handleClear.bind(this,"input-search")}/>
                                          <div class="input-group-btn">
                                              <div class="btn-group" role="group">
                                                
                                                  <button type="button" class="btn btn-primary" onClick={this.getAllOrders}>search</button>
                                              </div>
                                          </div>
                                      </div>
                                  </div>
                              </form>
                              </div>
                              </div>
                              </div>
                              
              </div>
  
               <div id="CMS_tab">
                  <div class="CMS_content">
                     <div class="container-fluid">
                        <div class="row">
                          <div class="col-md-12 no_padding">
                           <div id="reg_form">
                           {/* onScroll={this.handleScroll} */}
                              <div class="table-responsive dataTables_wrapper load_sec" >          
                                  <table class="table table-bordered table-sm table-striped load_sec"  >
                                    <thead>
                                      <tr>
                                        <th>Sl.NO</th>
                                        <th>Customer</th>
                                        <th>Doctor</th>
                                        <th>Appointment ID</th>
                                        <th>Appointment Date /Time</th>
                                        <th>Documents</th>
                                        <th>Amount</th>
                                        <th>Status</th>
                                        <th>Action</th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                        {Object.keys(this.state.ordersView).length>0 ? this.state.ordersView : 
                                        <React.Fragment>
                                        <td></td>
                                        <td></td>
                                        <td></td>
                                        <td></td>
                                        <td>No Appointments found</td>
                                        <td></td>
                                        <td></td>
                                        <td></td>
                                        <td></td>
                                        
                                        </React.Fragment>
                                            }
                                     </tbody>
                                 
                                  </table>
                                  {this.state.ordersView ?
                                  <div class={this.state.loadshow}  onClick={this.getAllOrdersbyPage.bind(this,this.state.pageNumber)}>
                                  <a id="loadMore">Load More <img src="https://static.thenounproject.com/png/427197-200.png" /></a>
                              </div>   
                              :""}
                              </div>
                             
                          </div>
                          </div>
                        </div>
                     </div>
                  </div>
                  <button onClick="topFunction()" id="myBtn" title="Go to top"><img src="https://i.pinimg.com/originals/c4/f0/4b/c4f04b83f93836a05b4f188180708e0e.png" /></button>
               </div>
                   
              </div>
          </div>
      </div>
     
   {/* </section> */}
   
 <div id="main_dashboard" class={this.state.orderDetailsView}>
 <div class="container-fluid">
     <div class="row">
         <div class="col-md-12 no_padding">
             <section id="retailer_invoice">
                 <div class="container-fluid">
                     <div class="row">
                         <div class="col-md-12">
                             <div class="ret_inv_section">
                                 <span class="ret_inv_back" onClick={this.showListView}> <a href="#"><img src="https://i.pinimg.com/736x/9e/b6/0e/9eb60ee1602cb5370382c2582ee2d0d1.jpg" />Back to Order</a>  </span><div class="ret_inv_head">
                                   
                                     <h2> Order Details</h2>
                                 </div>
                                 <div class="ret_pharm_det">
                                     <div class="row">
                                         <div class="col-md-8">
                                            <div class="pharm_add">
                                                <h2>New Pharmacy</h2>
                                                <h5>D NO. 131, Axis Bank, Madhapur, Hyderabad</h5>
                                                 </div>
                                         </div>
                                         <div class="col-md-4">
                                            <div class="pharm_order">
                                                <p>Order No: <span>524163</span></p>
                                                <p>Order Date: <span>14 Dec 2020</span></p>
                                                <p>Invoice Date: <span>14 Dec 2020 02:30 PM</span></p>
                                                <p>Invoice No: <span>5421525</span></p>
                                                </div>
                                         </div>
                                     </div>
                                    
                                    
                                 </div>
                                 <div class="ret_invoice_table" id="reg_form">
                                    <div class="table-responsive dataTables_wrapper">
                                        <table class="table table-bordered table-sm table-striped" >
                                            <thead>
                                                <tr>
                                                  <th>Sl.No</th>
                                                    <th>Product / Manufacturer</th>
                                                    <th>Batch / Expiry</th>
                                                    <th>MRP</th>
                                                    <th>Qty</th>
                                                    <th>Taxable Amnt</th>
                                                    <th>Vat %</th>
                                                    <th>Vat Amount</th>
                                                    <th>Discount</th>
                                                    <th>Total Amnt</th>
                                                </tr>
                                            </thead>
                                          <tbody>
                                            <tr>
                                                <td>1</td>
                                                  <td >Dolo 650 <h6>Micro Labs ltd</h6></td>
                                                  <td class="batch_inp">
                                                     <input type="text" class="form-control" value="88789- 23/5" />   
                                                 </td>
                                                 <td>₹ 400</td>
                                                 <td>2</td>
                                                 <td>₹ 400</td>
                                                 <td>5</td>
                                                 <td>₹ 55.32</td>
                                                 <td>10</td>
                                                 <td>₹ 75.30</td>
                                              </tr>

                                              <tr>
                                                 <td>2</td>
                                                   <td>Dolo 650 <h6>Micro Labs ltd</h6></td>
                                                   <td class="batch_inp">
                                                      <input type="text" class="form-control" value="88789- 23/5" />   
                                                  </td>
                                                  <td>₹ 400</td>
                                                  <td>2</td>
                                                  <td>₹ 400</td>
                                                  <td>5</td>
                                                  <td>₹ 55.32</td>
                                                  <td>10</td>
                                                  <td>₹ 75.30</td>
                                               </tr>
                                          </tbody>
                                        </table>
                                      </div>
                                  <div class="ret_inv_footer">
                                      <div class="row">
                                          <div class="col-md-offset-7 col-md-5 amount__right">
                                              <div class="total_tax">
                                                  <h5>Total Taxable Amount : <span>₹ 71.64</span></h5>
                                                  <h5>Total Taxes : <span>₹ 71.64</span></h5>
                                              </div>
                                              <div class="total_amnt">
                                                  <p>Sub Total : <span>₹ 71.64</span></p>
                                                  <p>Discount : <span> - ₹ 71.64</span></p>
                                                  <h3>Total Paid : <span>₹ 223.00</span></h3>
                                              </div>
                                          </div>
                                      </div>
                                  </div>
                                  <div class="ret_inv_pay">
                                      <div class="row">
                                          <div class="col-md-8">
                                            <div class="payment_mode">
                                                <p>Payment mode: <span>Card</span></p>
                                                <p>Address : <span>Madhapur, Hyderabad</span></p>
                                            </div>
                                          </div>
                                       
                                          <div class="col-md-4">
                                           <div class="ret_inv_btns">
                                            <p class="process_btn" data-toggle="modal" data-target="#reject_reason">Cancel Order</p>
                                           </div>
                                          </div>
                                      </div>
                                  </div>
                                 </div>
                             </div>
                         </div>
                     </div>
                 </div>
             </section>
             </div>
             </div>
             </div>
             </div>


 
  
  <div class="modal fade" id="reject_reason" role="dialog">
    <div class="modal-dialog">
    
      <div class="modal-content">
        <div class="modal-header">
          <button type="button" class="close" data-dismiss="modal">&times;</button>
          <h2 >Reason For Cancellation</h2>
        </div>
        <div class="modal-body">
            <div class="container">
                <div class="row">
                    <div class="col-md-12">
                           
                            <div class="reject_content">
                                <div class="rej_main">
                                {this.state.retailerRejectList}
                                    {/* <p><input type="checkbox" class="rej_check" /> All Items out of stock</p>
                                    <p><input type="checkbox" class="rej_check" /> All Items out of stock</p>
                                    <p><input type="checkbox" class="rej_check" /> All Items out of stock</p>
                                    <p><input type="checkbox" class="rej_check" /> Other Reason</p> */}
                                    <textarea class="form-control" rows="3" placeholder="Type Reason" id="otherReason"></textarea>
                                </div>
                        </div>
                        <div class="reject_bottom">
                            <div class="row">
                            <div class="col-md-4">
                                <button type="button" class="cancel_btn" data-dismiss="modal">Close</button>
                            </div>
                            <div class="col-md-8">
                                <button type="button" class="save_btn" onClick={this.rejectOrder}>Initiate Refund</button>
                            </div>
                        </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
       
      </div>
      <ToastContainer />
    </div>
  </div>
  </section>
   


    );
  }
}
