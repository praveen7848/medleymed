import React, { Component } from "react";
import { ToastContainer } from "react-toastify";
import toast from "../helpers/toast";
import Httpconfig from "../helpers/HttpconfigAdmin";
import Constant from "../../constants";
import { Form, Button, Dropdown, Grid, Header } from "semantic-ui-react";
import ReactExport from "react-data-export";
import { Link } from "react-router-dom";
import $ from "jquery";


const moment = require("moment");
const ExcelFile = ReactExport.ExcelFile;
const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;
const ExcelColumn = ReactExport.ExcelFile.ExcelColumn;

export default class Viewrevenue extends Component {
  constructor(props) {
    super(props);
    this.state={
        retailersListData:"",
        selectedStatus:"",
        selectedRetailerId:"",
        selectedStartDate:"",
        selectedEndDate:"",
        searchString:"",
        loadshow:"load_sec collapse-show",
        pageNumber:1,
        ordersView:[],
        currentOrders:[],
        
    };
    this.getAllOrders=this.getAllOrders.bind(this);
   
  }

  // To get detais after first render
  componentDidMount = () => {
    this.fetchRetailerInfo();
    this.getAllOrders();
  };

  // Get the retailers list
  fetchRetailerInfo() {
    Httpconfig.httptokenget(Constant.siteurl + "api/retailer/").then((response) => {
        let listData=response.data.data;
        let retailersListData = listData.map((item, index) => ({
            key: item.id,
            text: item.storename,
            value: item.id,
          }));
          //console.log(retailersListData);
         this.state.retailersListData=retailersListData;
         
         this.forceUpdate();
      
    }).catch((error) => {
       console.log(error);
    });
 }

 // On retalier selection
 onRetailerListChange = (event, data) => {
    let selectedretailerValue = data.value;

    if (selectedretailerValue != "") {
      const keys = data.options.find((data) => data.value === selectedretailerValue);
      const selectedretailer = {
        id: keys.key,
        medicineid: keys.text,
        medicinename: keys.value,
      };
      //this.state.retalierSelected = selectedretailer
      this.state.selectedRetailerName = keys.text;
      this.state.selectedRetailerId = selectedretailerValue; //keys.key;
      this.forceUpdate();
      this.getAllOrders(); 
    }
    
  };

  // get all the orders
  getAllOrders(){
     
    let retailerId=this.state.selectedRetailerId;
    let startDate=this.state.selectedStartDate;
    let endDate=this.state.selectedEndDate;
    let orderStatus=5;//this.state.selectedStatus;
    let searched=this.state.searchString;
    let PaidAmount="";
    let ordersCount="";
    let totalOrdersAmount="";
    let totalCommission="";
    let finalordersarray=[];
  

  Httpconfig.httptokenpost(Constant.siteurl + "api/OM/orderProcess/getAdminOrderDashboardDetails",{
      "retailer_id":retailerId,
      "start_date":startDate,
      "end_date":endDate,
      "order_status":orderStatus,
      "order_search_id":searched,
      "page_number":1,
  }).then((response) => {
    if(Object.keys(response.data.data).length>=20){
        this.state.loadshow="load_sec collapse-show";
        this.forceUpdate();
    }else{
        this.state.loadshow="load_sec collapse-hide";
        this.forceUpdate();
    }
      const ordersView= response.data.data.map((LoadedData,num)=>{
            ordersCount=response.data.itemsCount;
            totalOrdersAmount=response.data.total_orders;
            totalCommission=response.data.total_commission;
            PaidAmount=parseFloat(LoadedData.total_paid);
           
          if(LoadedData.total_paid){
            PaidAmount=PaidAmount.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
          }
          let commission=parseFloat(LoadedData.retailer_registration_tbl.commission*(LoadedData.total_paid/100)).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')
          finalordersarray.push({
            "Customer Name":LoadedData.patient_tbl.name.charAt(0).toUpperCase() + LoadedData.patient_tbl.name.slice(1) +","+LoadedData.patient_tbl.phone_number,
            "Retailer":LoadedData.retailer_registration_tbl.storename+","+LoadedData.retailer_registration_tbl.address+","+LoadedData.retailer_registration_tbl.email+","+LoadedData.retailer_registration_tbl.mobile_number,
            "Order Id":LoadedData.id,
            "Order Date":LoadedData.order_date,
            "Amount":PaidAmount,
            "Commission Percent":LoadedData.retailer_registration_tbl.commission,
            "Commission Amount":commission,


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
              <td><p>{LoadedData.id}</p></td>
              <td>{LoadedData.order_date}</td>
              <td>{LoadedData.retailer_registration_tbl.currency} {LoadedData.total_paid ? PaidAmount :"--"}</td> 
           <td>{LoadedData.retailer_registration_tbl.commission}{" %"}</td>
           <td>{LoadedData.retailer_registration_tbl.currency+" "+commission}</td>
            
            </tr>
          )

      })
      this.state.ordersView=ordersView;
      this.state.totalOrdersAmount=totalOrdersAmount;
      this.state.totalCommission=totalCommission;
      this.state.finalordersarray=finalordersarray;
      this.forceUpdate();
    
  }).catch((error) => {
     console.log(error);
  });

}


// get all the orders by page
getAllOrdersbyPage(pageNumber){
     
    let retailerId=this.state.selectedRetailerId;
    let startDate=this.state.selectedStartDate;
    let endDate=this.state.selectedEndDate;
    let orderStatus=5;//this.state.selectedStatus;
    let searched=this.state.searchString;
    let PaidAmount="";
    let ordersCount="";
    let totalOrdersAmount="";
    let totalCommission="";
    let finalordersarray=[];
    pageNumber=pageNumber+1;
     this.state.pageNumber=pageNumber;
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
            ordersCount=response.data.itemsCount;
            totalOrdersAmount=response.data.total_orders;
            totalCommission=response.data.total_commission;
            PaidAmount=parseInt(LoadedData.total_paid);
           
          if(LoadedData.total_paid){
            PaidAmount=PaidAmount.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
          }
          let commission=parseFloat(LoadedData.retailer_registration_tbl.commission*(LoadedData.total_paid/100)).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')
          finalordersarray.push({
            "Customer Name":LoadedData.patient_tbl.name.charAt(0).toUpperCase() + LoadedData.patient_tbl.name.slice(1) +","+LoadedData.patient_tbl.phone_number,
            "Retailer":LoadedData.retailer_registration_tbl.storename+","+LoadedData.retailer_registration_tbl.address+","+LoadedData.retailer_registration_tbl.email+","+LoadedData.retailer_registration_tbl.mobile_number,
            "Order Id":LoadedData.id,
            "Order Date":LoadedData.order_date,
            "Amount":PaidAmount,
            "Commission Percent":LoadedData.retailer_registration_tbl.commission,
            "Commission Amount":commission,


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
              <td><p>{LoadedData.id}</p></td>
              <td>{LoadedData.order_date}</td>
              <td>{LoadedData.retailer_registration_tbl.currency} {LoadedData.total_paid ? PaidAmount :"--"}</td> 
           <td>{LoadedData.retailer_registration_tbl.commission}{" %"}</td>
           <td>{LoadedData.retailer_registration_tbl.currency+" "+commission}</td>
            
            </tr>
          )

      })
      this.state.ordersView=ordersView;
      this.state.totalOrdersAmount=totalOrdersAmount;
      this.state.totalCommission=totalCommission;
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

// Handle searched string
handleSearchedString=(event)=>{
    let searched=event.target.value;
    this.state.searchString=searched;
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
    this.getAllOrders();

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

  
  render() {
    
    return (
        <section id="main_dashboard">
        <div class="container-fluid">
            <div class="row">
                <div class="col-md-12 no_padding">
             
                <div id="order_section">
                    <div class="container-fluid">
                   <div class="row">
                      
                       <div class="col-lg-5 select_ret_sec">
                               <div class="form-group">
                                   <label>
                                       Select Retailer
                                   </label>
                                   {this.state.retailersListData ?
                                 <Dropdown
                                      class="form-control"
                                      id="medicines"
                                      placeholder={"Select retailer"}
                                      fluid
                                      clearable
                                      search
                                      selection
                                      options={this.state.retailersListData}
                                      onChange={this.onRetailerListChange}
                                    />
                                    : "" } 
                               </div>
                               </div>
                               <div class="col-lg-5 total_sec"> 
                                <p>Total Order <span>{this.state.totalOrdersAmount ? parseInt(this.state.totalOrdersAmount).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,') :"0.00"}</span></p>
                                <p>Total Commission <span>{this.state.totalCommission ? parseInt(this.state.totalCommission).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,') : "0.00" }</span></p>
                            </div>
                    <div class="col-lg-2 generate_sec">
                    <ExcelFile element={ <a href="#"> <h2><img src="https://webstockreview.net/images/png-images-download-9.png" />Download XLS</h2></a>}>
                <ExcelSheet data={this.state.finalordersarray} name="Order Request">
                    <ExcelColumn label="Customer Name" value="Customer Name"/>
                    <ExcelColumn label="Retailer" value="Retailer"/>
                    <ExcelColumn label="Order Id" value="Order Id"/>
                    <ExcelColumn label="Order Date" value="Order Date"/>
                    <ExcelColumn label="Amount" value="Amount"/>
                    <ExcelColumn label="Commission Percent" value="Commission Percent"/>
                    <ExcelColumn label="Commission Amount" value="Commission Amount"/>
                    
                </ExcelSheet>
            </ExcelFile>
                  {/* <a href="#"> <h2><img src="https://webstockreview.net/images/png-images-download-9.png" />Generate & Download</h2></a>  */}
                    </div>
                   </div>
                </div>
                </div>
                <div id="order_section">
                    <div class="container-fluid">
                   <div class="row">
                       <div class="col-lg-12 date_sec">
                            <h2>Select Date</h2>
                            <form>
                                <div class="form-group">
                                    {/* <input type="date" class="form-control" /> */}
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
                   </div>
                </div>
                </div>
               
                <div id="search_order">
                    <div class="container-fluid">
                        <div class="row">
                            <div class="col-md-12 no_padding">
                                <form>
                                    <div class="form-group">
                                        <label>Seacrh order</label>
                                        <div class="input-group" >
                                        {/* <input type="text" class="form-control" placeholder="Search for Order Id, Phone number" onKeyUp={this.handleSearchedString} /> */}
                                        <input type="text" id="input-search" class="form-control" placeholder="Search for Order Id, Phone number" onKeyUp={this.handleSearchedString} />
                                          <img class="remove_icon" src="https://www.flaticon.com/svg/static/icons/svg/59/59836.svg" onClick={this.handleClear.bind(this,"input-search")}/>
                                            <div class="input-group-btn">
                                                <div class="btn-group" role="group">
                                                  
                                                <button type="button" class="btn btn-primary" onClick={this.getAllOrders}>search</button>
                                                {/* <div class="btn-group ml-3 " role="group">
                                                <button type="button" class="btn btn-primary" onClick={this.hangleClear}>Clear Filters</button>
                                                </div> */}
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
                                <div class="table-responsive dataTables_wrapper load_sec">          
                                    <table class="table table-bordered table-sm table-striped">
                                      <thead>
                                        <tr>
                                          <th>Sl.NO</th>
                                          <th>Customer</th>
                                          <th>Retailer</th>
                                          <th>Order ID</th>
                                          <th>Order Date</th>
                                         
                                          <th>Amount</th>
                                          <th>Commission</th>
                                          <th>Commission Amount</th>
                                        </tr>
                                      </thead>
                                      <tbody>
                                      {this.state.ordersView ? this.state.ordersView : 
                                        <React.Fragment>
                                        <td></td>
                                        <td></td>
                                        <td></td>
                                        <td></td>
                                        <td></td>
                                        <td>No orders found</td>
                                        <td></td>
                                        <td></td>
                                        <td></td>
                                        <td></td>
                                        </React.Fragment>
                                            }
                                      </tbody>
                                   
                                    </table>
                                    <div class={this.state.loadshow} onClick={this.getAllOrdersbyPage.bind(this,this.state.pageNumber)}>
                                    <a href="#">Load More <img src="https://static.thenounproject.com/png/427197-200.png" /></a>
                                </div>   
                                </div>
                               
                            </div>
                            </div>
                          </div>
                       </div>
                    </div>
                    <button onclick="topFunction()" id="myBtn" title="Go to top"><img src="https://i.pinimg.com/originals/c4/f0/4b/c4f04b83f93836a05b4f188180708e0e.png" /></button>
                 </div>
                     
                </div>
            </div>
        </div>
       
     </section>
    
   


    );
  }
}
