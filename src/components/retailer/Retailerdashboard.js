import React, { Component,Fragment } from 'react';
import { ToastContainer, toast } from "react-toastify";
import $ from "jquery";
import Httpconfig from '../helpers/HttpconfigRetailer';
import Constant from '../../constants';
import { MDBDataTable } from 'mdbreact';
import { Link } from "react-router-dom";
import RetailerCss from "../../public/css/retailer/retailer_style.css";
import RetailerHeader from "../retailer/RetailerHeader";
import RetailerSideMenu from "../retailer/RetailerSideMenu";
import Footer from "../patient/Patientfooter";
import { reactLocalStorage } from 'reactjs-localstorage';
import * as CurrencyFormat from 'react-currency-format';
const moment = require("moment");


export default class Viewretailers extends Component {
   constructor(props) {
      super(props);
      this.state={
        currentHome:"nav-item nav-link active",
        prescriptionHome:"nav-item nav-link",
        shippedHome:"nav-item nav-link",
        deliverHome:"nav-item nav-link",
        cancelHome:"nav-item nav-link",
        processedHome:"nav-item nav-link",
        currentHomePanel:"tab-pane fade show active",
        prescriptionHomePanel:"tab-pane fade",
        processedHomePanel:"tab-pane fade",
        shippedHomePanel:"tab-pane fade",
        deliverHomePanel:"tab-pane fade",
        cancelHomePanel:"tab-pane fade",
        showOrderDetailsProcess:" pharmacy-tab collapse-hide",
        showOrdersGrid:"row showorder-list collapse-show",
        showRejectReasons:"collapse-hide",
        ordereditems:"",
        startDate:"",
        endDate:"",
        retailerRejectList:"",
        orderId:"",
        invoiceDiv:"collapse-hide",
        invoicePDFPreview:"collapse-hide",
        retailerOrderMedicineInvoiceDetailsView:"",
        totalpaid:"",
      }
      
    this.getTemplateRow=this.getTemplateRow.bind(this);
    this.caliculateInvoiceAmountsNewRows=this.caliculateInvoiceAmountsNewRows.bind(this);
   }
   // To get detais after first render
   componentDidMount = () => {
    let userData=reactLocalStorage.getObject("retuserObj");
    if(userData){
        if(userData!=""){
            this.setState({
               retailerId:userData.retailer_id,
               retailerCurrency:userData.currency,
            }); 
            this.forceUpdate();
        }
        } else{
            window.location.href = "/login";
        }
        
      this.retailerOrderDetails(userData.retailer_id,1);
      this.getAllDashboardDetails(userData.retailer_id);
   }

   componentDidUpdate=()=>{
    var batchList=document.getElementsByClassName("newrowsselect");
    for (let i = 0; i < batchList.length; i++) {
        batchList[i].addEventListener("click", function(event) {
            var options = batchList[i].querySelectorAll("option");
            var count = options.length;
            if(typeof(count) === "undefined" || count < 2)
            {
                this.getBatches(event.target.id);
            }
     }.bind(this),false);
     
    }
    var batchList=document.getElementsByClassName("batches-list");
    for (let i = 0; i < batchList.length; i++) {
        batchList[i].addEventListener("change", function(event) {
            
                let data=document.getElementById(event.target.id).value;
                data=data.split("~");    
                
            let availbelQuantity=data[2];
            let mrp=data[4];
            let discount=data[6];
            let meddata=event.target.id.split("-");
            let search=event.target.id.search("~");
            if(search>0){
                let newRow=meddata[0].split("#");
                let RowId=newRow[0]+"#"; 

                document.getElementById(RowId+'new~medaqty-'+meddata[1]).value=availbelQuantity;
                document.getElementById(RowId+'new~medmrp-'+meddata[1]).value=mrp;
                document.getElementById(RowId+'new~meddiscount-'+meddata[1]).value=discount;
            }else{
                document.getElementById('medaqty-'+meddata[1]).value=availbelQuantity;
                document.getElementById('medmrp-'+meddata[1]).value=mrp;
                document.getElementById('meddiscount-'+meddata[1]).value=discount;
            }
            this.caliculateInvoiceAmountsNewRows(event.target.id);
           
     }.bind(this),false);
     
    }



   var sort=document.getElementsByClassName("newrows");
    
    for (let i = 0; i < sort.length; i++) {
     sort[i].addEventListener("blur", function(event) {
        this.caliculateInvoiceAmountsNewRows(event.target.id);
        }.bind(this));
     
    }

    var rmvbatch=document.getElementsByClassName("removebatch");
    
    for (let i = 0; i < rmvbatch.length; i++) {
        rmvbatch[i].addEventListener("click", function(event) {
    // alert(event.target.id);
    this.removeBatch(event.target.id);
     }.bind(this));
    }

    //  var getbatch=document.getElementsByClassName("getbatches");
    
    // for (let i = 0; i < getbatch.length; i++) {
    //     getbatch[i].addEventListener("click", function(event) {
    // // alert(event.target.id);
    // this.getBatchesNewRows(event.target.id);
    //  }.bind(this));
     
    // } 
}


   handleClick=(event)=>{
    let id=event.currentTarget.id;
    this.state.currentHome="nav-item nav-link";
    this.state.prescriptionHome="nav-item nav-link";
    this.state.processedHome="nav-item nav-link";
    this.state.shippedHome="nav-item nav-link";
    this.state.deliverHome="nav-item nav-link";
    this.state.cancelHome="nav-item nav-link";
    this.state.currentHomePanel="tab-pane fade";
    this.state.shippedHomePanel="tab-pane fade";
    this.state.deliverHomePanel="tab-pane fade";
    this.state.cancelHomePanel="tab-pane fade";
    this.state.showOrderDetailsProcess="pharmacy-tab collapse-hide";
    this.state.showRejectReasons="collapse-hide";
    this.state.showOrdersGrid="row showorder-list collapse-show";
    

    if(id=='current_home-tab'){
        this.state.currentHome="nav-item nav-link active";
        this.state.currentHomePanel="tab-pane fade show active";
        this.retailerOrderDetails(this.state.retailerId,1);
    }
    if(id=='prescription_home-tab'){
        this.state.prescriptionHome="nav-item nav-link active";
        this.state.prescriptionPanel="tab-pane fade show active";
        this.retailerOrderDetails(this.state.retailerId,2);
    
    }
    if(id=='processed_home-tab'){
        this.state.processedHome="nav-item nav-link active";
        this.state.processedHomePanel="tab-pane fade show active";
        this.retailerOrderDetails(this.state.retailerId,3);
    }
    if(id=='shipped_home-tab'){
        this.state.shippedHome="nav-item nav-link active";
        this.state.shippedHomePanel="tab-pane fade show active";
        this.retailerOrderDetails(this.state.retailerId,4);
    }
    if(id=='deliver_home-tab'){
        this.state.deliverHome="nav-item nav-link active";
        this.state.deliverHomePanel="tab-pane fade show active";
        this.retailerOrderDetails(this.state.retailerId,5);
    }
    if(id=='cancel_home-tab'){
        this.state.cancelHome="nav-item nav-link active";
        this.state.cancelHomePanel="tab-pane fade show active";
        this.retailerOrderDetails(this.state.retailerId,6);
    }
    
    this.forceUpdate();
}


// Get the Order Dashboard Details
getAllDashboardDetails=(retailerId)=>{    
Httpconfig.httptokenget(Constant.siteurl + "api/OM/orderProcess/getOrderDashboardDetails/"+retailerId,)
.then((response) => { 
  if(response.data.status=200){
     this.setState({
        pendingOrder:response.data.data[0].pendingOrder,
        shippedOrder:response.data.data[0].shippedOrder,
        cancelledOrder:response.data.data[0].cancelledOrder,
        deliveredOrder:response.data.data[0].deliveredOrder,
        PrescriptionVerifiedOrder:response.data.data[0].previewOrder,
        processingOrder:response.data.data[0].processingOrder,
         
     })
     this.forceUpdate();
  }
 })
.catch((error) => {
   toast.error(error);
});
}

// order details list

retailerOrderDetails=(retailerId,status)=>{
    let startDate="";
    let endDate="";
    let finalorderarray=[];

    startDate=this.state.startDate;
    endDate=this.state.endDate;

        Httpconfig.httptokenpost(Constant.siteurl + "api/OM/orderProcess/retailerOrders",
        {"retailer_id":retailerId,"start_date":startDate,"end_date":endDate,"status":status}
    )
           .then((response) => { 
             if(response.data.status=200){
                 
                    if(Object.keys(response.data.data).length>0){
                        
                        const retailerFinalOrderMedicineDetailsView= response.data.data.map((finalLoadedData,num)=>{ 
                            if(finalLoadedData.order_status==status){
                            //if(finalLoadedData.order_status==1 || finalLoadedData.order_status==2) {
                                if(response.data.data.cart_prescriptions_tbl){
                               // alert((response.data.data.cart_prescriptions_tbl).length);
                                }
                            return(
                             <tr>                                <td>{num+1}</td>
                                <td>{finalLoadedData.patient_tbl.name.charAt(0).toUpperCase() +finalLoadedData.patient_tbl.name.slice(1)} <h6>{finalLoadedData.patient_tbl.phone_number}</h6></td>
                                <td>{finalLoadedData.id}</td>
                                <td>{finalLoadedData.order_date}</td>
                                <td class="presc_field">
                                     {finalLoadedData.cart_prescriptions_tbl  ? 

                                        finalLoadedData.cart_prescriptions_tbl.medical_document.map((presImages, num) => {
                                        return(
                                        <a  href={presImages ?  Constant.imgurl+presImages: ""} target="_blank"> 
                                        <img class="presc_img" src="../images/retailer/Invoice.svg" />
                                        </a>
                                        )
                                    })  
                                : "--"}
                                </td>
                                <td>{Object.keys(finalLoadedData.order_processing_tbls).length}</td>
                                <td>{this.state.retailerCurrency} {parseInt(finalLoadedData.payable_amount).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')}</td>
                                {finalLoadedData.order_status!=1 ?

                                <td>
                                    {finalLoadedData.invoice!=null ? 
                                    <a href={finalLoadedData.invoice!=null ? Constant.imgurl+finalLoadedData.invoice :""} target="_blank"> <img class="presc_img" src="../images/retailer/RxFile.svg"  /></a>  : "--" }
                                </td>
                                :<td>--</td> }
                                
                                
                             {finalLoadedData.order_status==1 ?
                                 <td class="pending_td">  <a class="pending_box" href="#" id={finalLoadedData.id} onClick={this.showOrderdetails}>Pending   <img  src="https://cdn0.iconfinder.com/data/icons/navigation-set-arrows-part-one/32/ChevronRight-512.png"  /></a> </td>
                                : ""}
                                {finalLoadedData.order_status==2 ?
                                 <td class="pending_td">  <a class="presc_box" href="#" id={finalLoadedData.id} onClick={this.showOrderdetails}>Prescription Verified   <img  src="https://cdn0.iconfinder.com/data/icons/navigation-set-arrows-part-one/32/ChevronRight-512.png"  /></a> </td>
                                : ""}
                              {finalLoadedData.order_status==3 ?
                                 <td class="pending_td">  <a class="process_box" href="#" id={finalLoadedData.id} onClick={this.ChangeOrderStatus.bind(this, finalLoadedData.id,'4','Gokada')}>Processed   <img  src="https://cdn0.iconfinder.com/data/icons/navigation-set-arrows-part-one/32/ChevronRight-512.png"  /></a> </td>
                                : ""}  
                                {finalLoadedData.order_status=="4" ? 
                                <td class="pending_td dropdown" >  <a class="shipped_box" href="#" id={finalLoadedData.id}>Shipped  <img  src="https://cdn0.iconfinder.com/data/icons/navigation-set-arrows-part-one/32/ChevronRight-512.png" /></a>
                                <div class="dropdown-menu" aria-labelledby="dropdownMenuButton">
                                                                <a href="#" id={finalLoadedData.id} onClick={this.ChangeOrderStatus.bind(this, finalLoadedData.id,'5',"")}><img src="https://cdn4.iconfinder.com/data/icons/text-editor/154/additional-vertical-menu-dots-512.png" />Delivered</a>
                                                                <a href="#" id={finalLoadedData.id} onClick={this.ChangeOrderStatus.bind(this, finalLoadedData.id,'6',finalLoadedData.delivery_agent)}><img src="https://cdn4.iconfinder.com/data/icons/text-editor/154/additional-vertical-menu-dots-512.png" />Cancel</a>
                                </div>
                                 </td>
                                : "" }
                                {finalLoadedData.order_status==5 ?
                                <td class="pending_td">  <a class="delivery_box" href="#" id ={finalLoadedData.id}>Delivered   <img  src="https://cdn0.iconfinder.com/data/icons/navigation-set-arrows-part-one/32/ChevronRight-512.png" /></a> </td>
                                :"" }
                                {finalLoadedData.order_status==6 ?
                                <td class="pending_td">  <a class="cancelled_box" href="#" id={finalLoadedData.id}>Cancelled   <img  src="https://cdn0.iconfinder.com/data/icons/navigation-set-arrows-part-one/32/ChevronRight-512.png" /></a> </td>
                                : "" }
                            </tr>
                            )
                        }
                        })
                        
                        this.state.retailerFinalOrderMedicineDetailsView=retailerFinalOrderMedicineDetailsView;
                        this.state.finalorderarray=finalorderarray;
                        
                    }else{
                        this.state.retailerFinalOrderMedicineDetailsView="";
                    }
                    this.forceUpdate();
             }
            })
           .catch((error) => {
              toast.error(error);
           });
    
    
    }

    // show order details for process

    showOrderdetails=(event)=>{
        
        let orderId=event.currentTarget.id;
        let retailerId=this.state.retailerId;
        this.hidegridpendingorders();
        this.state.orderId=orderId;
       
        Httpconfig.httptokenget(Constant.siteurl + "api/OM/orderProcess/getOrderDetails/"+retailerId+"/"+orderId,)
        .then((response) => { 
        if(response.data.status=200){
            
        if(Object.keys(response.data.data).length>0){
            const retailerOrderMedicineDetailsView= response.data.data.map((finalLoadedData,num)=>{ 
                this.state.customerName=finalLoadedData.patient_tbl.name.charAt(0).toUpperCase() +finalLoadedData.patient_tbl.name.slice(1);
                this.state.customermobile=finalLoadedData.patient_tbl.phone_number;
                this.state.amount=finalLoadedData.payable_amount;
                this.state.itemsCount=Object.keys(finalLoadedData.order_processing_tbls).length;
                this.state.customerId=finalLoadedData.patient_tbl.id;

            return(

                <React.Fragment>
                   { Object.keys(finalLoadedData.order_processing_tbls).length>0 ?
                     finalLoadedData.order_processing_tbls.map((subData,num)=>{ 
                         return(
                             <React.Fragment>
                    <tr>
                    <td class="check_bar"><input type="checkbox" class="medidinesList" name="medidinesList" id={subData.products_master_tbl.id+"-"+subData.products_master_tbl.medicinename}/></td>
                    <td>{subData.products_master_tbl.medicinename} <h6>{subData.products_master_tbl.manufacturer}</h6></td>
                    
                    <td> 
                        <div class="qty ">
                        {/* <span class="minus bg-dark" id={finalLoadedData.order_id+ "-" + finalLoadedData.id } onClick={this.qtyIncrement}>-</span> */}
                        <input type="number" class="count" name="qty" id={"txt"+ "-" + finalLoadedData.id } defaultValue={subData.quantity}/>
                        {/* <span class="plus bg-dark" id={finalLoadedData.order_id+ "-" + finalLoadedData.id } onClick={this.qtyDecrement}>+</span> */}
                        </div>
                    {/* <h5>35 Strips Available</h5> */}
                    </td>
                    <td>{this.state.retailerCurrency} {subData.amount}</td>
                    </tr>
                    </React.Fragment> 
                         )
                        })
                         :"" }
                        
                         </React.Fragment>
                )
                
            })

            const retailerPrescriptionDetailsView= response.data.data.map((finalLoadedData,num)=>{ 
                return(
                    <React.Fragment>
                {finalLoadedData.cart_prescriptions_tbl  ? 

                    finalLoadedData.cart_prescriptions_tbl.medical_document.map((presImages, num) => {
                    return(
                    <a  href={presImages ?  Constant.imgurl+presImages: ""} target="_blank"> 
                    <img class="presc_img" src="../images/retailer/RxFile.svg" />
                    </a>
                    )
                })  
                : "Prescription not available"}
                </React.Fragment>
            )
            })


            this.state.ordereditems=retailerOrderMedicineDetailsView;
            this.state.retailerPrescriptionDetailsView=retailerPrescriptionDetailsView;
                this.forceUpdate();

        }
     
            }
            })
            .catch((error) => {
            toast.error(error);
            });

    }

    // shortage book quanatity decrement

qtyDecrement=(event)=>{
    
    let data=event.currentTarget.id.split("-");
    let id=data[0];
    let orderId=data[1];
    let qty=$('#txt-'+id).val();
        
    if(qty>0){
        qty=qty-1;
        $('#txt-'+id).val(qty);
      //  this.updateShortagebookQuantity(id,medicineId,qty);
    }

}

// shortage book quanatity Increment
qtyIncrement=(event)=>{

    let data=event.currentTarget.id.split("-");
    let id=data[0];
    let orderId=data[1];
    let qty=$('#txt-'+orderId).val();
    
    
    if(qty>=0){
        qty=parseInt(qty)+1;
        $('#txt-'+orderId).val(qty);
      //  this.updateShortagebookQuantity(id,medicineId,qty);
    }

}

// End date selection

startDate=(event)=>{
let startDate=event.target.value;
this.state.startDate=moment(startDate).format("YYYY-MM-DD");;
this.forceUpdate();
}

// Start date selection
endDate=(event)=>{
    let endDate=event.target.value;
    this.state.endDate=moment(endDate).format("YYYY-MM-DD");
    this.forceUpdate();
}

showOrderbyDates=()=>{
    let start_date=$('#start_date').val();
    let end_date=$('#end_date').val();

    if(start_date!="" && end_date!=""){
    let id=$(".p_nav").find(".active").attr('id');
    
    if(id=='current_home-tab'){
        this.retailerOrderDetails(this.state.retailerId,1);
        this.showgridpendingorders();
    }
    if(id=='shipped_home-tab'){
        this.retailerOrderDetails(this.state.retailerId,3);
        this.showgridpendingorders();
    }
    if(id=='deliver_home-tab'){
        this.retailerOrderDetails(this.state.retailerId,4);
        this.showgridpendingorders();
    }
    if(id=='cancel_home-tab'){
        this.retailerOrderDetails(this.state.retailerId,5);
        this.showgridpendingorders();
    }
}else{
    toast.error("Please select dates");
}
   

} 

// show grid and hide pending order details

showgridpendingorders=()=>{
    this.state.showOrderDetailsProcess="pharmacy-tab collapse-hide";
    this.state.showOrdersGrid="row showorder-list collapse-show";
    this.state.showRejectReasons="collapse-hide";
    this.state.invoiceDiv="collapse-hide";
    this.state.invoicePDFPreview='collapse-hide';
    this.forceUpdate();
}

// hide grid and show pending order details

hidegridpendingorders=()=>{
    
    this.state.showOrderDetailsProcess="pharmacy-tab collapse-show";
    this.state.showOrdersGrid="row showorder-list collapse-hide";
    this.state.showRejectReasons="collapse-hide";
    this.forceUpdate();
}

//back button show grid and hide pending order details

back=()=>{
    this.showgridpendingorders();
}

// update the cancellation reaon

cancelReason=(event)=>{
    let id=event.currentTarget.id;
    if(document.getElementById(id).checked == true){
        this.state.cancelleReason=id;
    }else{
        this.state.cancelleReason=""; 
    }

}
// reject order show div

rejectOrderShow=()=>{
    this.state.showOrderDetailsProcess="pharmacy-tab collapse-hide";
    this.state.showOrdersGrid="row showorder-list collapse-hide";
    this.state.showRejectReasons="collapse-show";
    this.getRejectionResonslist();
    this.forceUpdate();


}
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
            console.log(retailerRejectList);
            this.forceUpdate();

        }
     
            }
            })
            .catch((error) => {
            toast.error(error);
            });


}

rejectOrder=()=>{
    let cancelReasonsCheckedCount=$('input[name="cancelReasons"]:checked').length;
    if(cancelReasonsCheckedCount==0){
        toast.error("Select Reason for Cancellation");
        return
    }else{
    let orderId=this.state.orderId;
    let cancelledReason=this.state.cancelleReason;
    //alert(cancelledReason);
    Httpconfig.httptokenpost(Constant.siteurl + "api/OM/cancellationReason/orderDetails/"+orderId,
    {"order_status":"6","cancelled_reason":cancelledReason}
)
    .then((response) => { 
      if(response.data.status=200){
          toast.success(response.data.message);
          window.location.reload();
      }
     })
    .catch((error) => {
       toast.error(error);
    });
}
}  

// Create Order in Gokada
createOrder=(orderId,deliveryAgent)=>{
    Httpconfig.httptokenget(Constant.siteurl + "api/OM/orderProcess/getOrderDetails/"+this.state.retailerId+"/"+orderId,)
    .then((response) => { 

      if(response.data.status=200){
          
            let pickupAddress=response.data.data[0].retailer_registration_tbl.address;
            let pickupLatitude=response.data.data[0].retailer_registration_tbl.latitude;
            let pickupLongitude=response.data.data[0].retailer_registration_tbl.longitude;
            let pickupName=response.data.data[0].retailer_registration_tbl.storename;
            let pickupPhone=response.data.data[0].retailer_registration_tbl.mobile_number;
            let pickupEmail="rakesh.n@medleymed.com";//response.data.data[0].retailer_registration_tbl.email;
            let deliveryAddress=response.data.data[0].patient_tbl.delivery_address_tbls[0].address;
            let deliveryLatitude=response.data.data[0].patient_tbl.delivery_address_tbls[0].latitude;
            let deliveryLongitude=response.data.data[0].patient_tbl.delivery_address_tbls[0].longitude;
            let deliveryName=response.data.data[0].patient_tbl.delivery_address_tbls[0].name;
            let deliveryPhone=response.data.data[0].patient_tbl.delivery_address_tbls[0].mobile_no;
            let deliveryEmail="rakesh.n@medleymed.com";//response.data.data[0].patient_tbl.delivery_address_tbls[0].name;
            let apiKey=Constant.gokadaApiKey;
           
            let  delivery={
                "api_key":apiKey,
                "pickup_address": pickupAddress,
                "pickup_latitude": pickupLatitude,
                "pickup_longitude": pickupLongitude,
                "delivery_address": deliveryAddress,
                "delivery_latitude": deliveryLatitude,
                "delivery_longitude": deliveryLongitude,
                "pickup_name": pickupName,
                "pickup_phone": "+234"+pickupPhone,
                "pickup_email": pickupEmail,
                "delivery_name": deliveryName,
                "delivery_phone": "+234"+deliveryPhone,
                "delivery_email": deliveryEmail,
                "description": orderId,
            }
          
          Httpconfig.httptokenpost("https://api.gokada.ng/api/developer/order_create",delivery)
          .then((response) => { 
           // alert(response);
            console.log(response);
           })
          .catch((error) => {
             toast.error(error);
          });
              

         // }
          
      }
     })
    .catch((error) => {
       toast.error(error);
    });

}

/* change order status */

ChangeOrderStatus=(orderId,status,deliveryAgent)=>{
   // orderId=event.currentTarget.id;

    Httpconfig.httptokenput(Constant.siteurl + "api/OM/orderProcess/retailerOrderStatus/"+orderId,
    {"order_status":status}
)
    .then((response) => { 
      if(response.data.status=200){
          toast.success(response.data.message);
          this.retailerOrderDetails(this.state.retailerId,1);
          this.getAllDashboardDetails(this.state.retailerId);
          if(deliveryAgent=='Gokada'){
              this.createOrder(orderId,deliveryAgent);

          }
          
      }
     })
    .catch((error) => {
       toast.error(error);
    });

}

addRow=(event)=>{

    let data=event.currentTarget.id;
    let rawData=data.split("-");
    let rowName=rawData[0];
    let rowId=rawData[1];
    let quantity=$('#medqty-'+rowId).val();
    let vat=$('#medvat-'+rowId).val();
    let dynamicadded=$('#medadded-'+rowId).val();
    dynamicadded=Number(dynamicadded)+1;
    $('#medadded-'+rowId).val(dynamicadded);
    let  medpname=$('#medpname-'+rowId).html();
    
    

    const newrow= (<tr id={dynamicadded+"#new-"+rowId}>
    <td></td>  
      <td class="item_inp" ><div class="collapse-hide">{medpname}</div></td>
      {/* <td>
        <select class="form-control batch_inp">
           <option>1</option>
           <option>1</option>
        </select>
          </td> */}
      <td class="batch_inp">
      <select class="form-control newrowsselect batches-list" id={dynamicadded+"#new~medbatch-"+rowId} onClick={this.getBatches.bind(this,"new~medbatch-"+rowId)}>
          <option>select batch</option>
          
      </select></td>
       <td class="oqty_inp">
        <input type="hidden" class="form-control newrows" id={dynamicadded+"#new~medqty-"+rowId} defaultValue={quantity} readOnly={true}/>   
        </td>
        <td class="aqty_inp">
        <input type="text" class="form-control newrows" id={dynamicadded+"#new~medaqty-"+rowId} defaultValue="0" readOnly="readOnly" onBlur={this.caliculateInvoiceAmounts}/>   
        </td>
        <td class="bqty_inp">
        <input type="text" class="form-control newrows" id={dynamicadded+"#new~medbqty-"+rowId} defaultValue="0" onBlur={this.caliculateInvoiceAmounts}/>   
        </td>
        
        <td class="tax_inp">{this.state.retailerCurrency}
        <input type="text" class="form-control newrows" id={dynamicadded+"#new~medtaxamt-"+rowId} defaultValue="0" readOnly={true}/>   
        </td>
        <td class="vat_inp">
        <input type="text" class="form-control newrows" id={dynamicadded+"#new~medvat-"+rowId } defaultValue={vat} onBlur={this.caliculateInvoiceAmounts}/>   
        </td>
        <td class="vatamt_inp">
        <input type="text" class="form-control newrows" id={dynamicadded+"#new~medvatamt-"+rowId } defaultValue="0" readOnly={true} />   
        </td>
        <td class="mrp_inp">{this.state.retailerCurrency}
       <input type="text " class="form-control newrows"  id={dynamicadded+"#new~medmrp-"+rowId} defaultValue=""  onBlur={this.caliculateInvoiceAmounts}/>   
       </td>
        <td class="disc_inp">
        <input type="text" class="form-control newrows" id={dynamicadded+"#new~meddiscount-"+rowId } defaultValue="0.00" onBlur={this.caliculateInvoiceAmounts}/>  </td>
        <td class="amount_inp">
         <input type="text" class="form-control newrows" id={dynamicadded+"#new~medamount-"+rowId } value="0" readOnly={true} /> 
        </td>
        <td class="amounts_inp">
        <img class="plus_img removebatch newrows" onClick={this.removeBatch} src="https://cdn1.iconfinder.com/data/icons/essential-free/48/12-Delete-512.png"  id={dynamicadded+"#new~medadd-"+rowId } />  
        </td>
  </tr>);




// this.setState({
//     retailerOrderMedicineInvoiceDetailsView :[...this.state.retailerOrderMedicineInvoiceDetailsView, newrow]
//   });
//   this.state.retailerOrderMedicineInvoiceDetailsView.concat(newrow);
//alert(this.state.retailerOrderMedicineInvoiceDetailsView);

  this.state.newRow=newrow;
  this.forceUpdate();
    let parentTR = $('#'+event.currentTarget.id).closest('tr');
    $('#newRow').children().clone(true,true).insertAfter(parentTR);
    }
    

getTemplateRow=()=>{

let maxID = 0;
var x = document.getElementById("templateRow").cloneNode(true);
x.id = "";
x.style.display = "";
x.innerHTML = x.innerHTML.replace(/{​​​​​​​​id}​​​​​​​​/, ++maxID);
return x; 
}


// Approve order items
orderApprove=()=>{
    
    let deliveryAgentCheckedCount=$('input[name="medidinesList"]:checked').length;
    if(deliveryAgentCheckedCount==0){
        toast.error("Select Available Medicines");
    }else{
        //alert("in");
    let medicine_details=[];
    let rawData="";
    let medicineId="";
    let medicineName="";
        $("input[name='medidinesList']:checked").each(function() {
             rawData=$(this).attr('id').split("-");
             medicineId=rawData[0];
             medicineName=rawData[1];
             medicine_details.push({ "medicine_id":medicineId, "medicine_name":medicineName});

        });
        let data={
            "patient_id":this.state.customerId,
            "retailer_id":this.state.retailerId,
            "order_id":this.state.orderId,
            "medicine_details":medicine_details,
        }
        Httpconfig.httptokenpost(Constant.siteurl + "api/OM/orderProcess/updateOrderStatus",data)
        .then((response) => { 
          if(response.data.status=200){
              toast.success(response.data.message);
              this.state.invoiceDiv="collapse-show";
              this.state.invoicePDFPreview='collapse-hide';
              this.state.showOrderDetailsProcess="pharmacy-tab collapse-hide";
          
              this.showOrderdetailsInvoice(); 
          }
         })
        .catch((error) => {
           toast.error(error);
        });
    
        console.log(data);
        //return
   
    }
}


// show order details for Create Invoice process

showOrderdetailsInvoice=(event)=>{
        
    let orderId="";//event.currentTarget.id;
    let retailerId=this.state.retailerId;
    let totaldiscount=0;
    let totalTaxableAmt=0;
    let subTotal=0;
    let deliveryCharges=0;
    orderId=this.state.orderId;
    
   
   
    Httpconfig.httptokenget(Constant.siteurl + "api/OM/orderProcess/getOrderDetails/"+retailerId+"/"+orderId,)
    .then((response) => { 
    if(response.data.status=200){
        
    if(Object.keys(response.data.data).length>0){
        const retailerOrderMedicineInvoiceDetailsView= response.data.data.map((finalLoadedData,count)=>{ 
            this.state.customerName=finalLoadedData.patient_tbl.name.charAt(0).toUpperCase() +finalLoadedData.patient_tbl.name.slice(1);
            this.state.customermobile=finalLoadedData.patient_tbl.phone_number;
            this.state.deliveryCharges=finalLoadedData.delivery_charges;
           // alert(finalLoadedData.delivery_charges);
            
            if(Object.keys(finalLoadedData.patient_tbl.delivery_address_tbls).length>0 ){

            this.state.customerAddress1=finalLoadedData.patient_tbl.delivery_address_tbls[0].location;
            this.state.customerAddress2=finalLoadedData.patient_tbl.delivery_address_tbls[0].address;
            this.state.customerLandmark=finalLoadedData.patient_tbl.delivery_address_tbls[0].landmark;
            }else{
            this.state.customerAddress1="";
            this.state.customerAddress2="";
            this.state.customerLandmark="";
            }
            this.state.orderId=finalLoadedData.id;
            this.state.orderDate=finalLoadedData.order_date;
            this.state.invoiceDateTime=moment().format("DD MM YYYY HH:mm:ss a");//moment().toDate().getTime();

            if(Object.keys(finalLoadedData.retailer_registration_tbl).length>0){
            this.state.storeName=finalLoadedData.retailer_registration_tbl.storename;
            this.state.storeAddress=finalLoadedData.retailer_registration_tbl.address;
            this.state.storeMobileNumber=finalLoadedData.retailer_registration_tbl.mobile_number;
            this.state.storeregistrationNumber=finalLoadedData.retailer_registration_tbl.registration_number;
            }else{
            this.state.storeName="";
            this.state.storeAddress="";
            this.state.storeMobileNumber="";
            this.state.storeregistrationNumber="";
            }
this.forceUpdate();

        return(

            <React.Fragment>
               { Object.keys(finalLoadedData.order_processing_tbls).length>0 ?
                 finalLoadedData.order_processing_tbls.map((subData,num)=>{ 
                     //let taxableamt=(((subData.quantity*subData.amount)*subData.vat)/100).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
                     //alert(subData.amount);
                     let amounttot=(subData.quantity*subData.amount);//.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
                     let netbill=(subData.amount)-(subData.discount);
                     let taxableamt=(netbill)/(1+(subData.vat));
                     let vatamount=netbill-taxableamt;
                      subTotal=subTotal+amounttot;
                     if(subData.discount==null){subData.discount=0;}
                      totaldiscount=(parseFloat(totaldiscount))+(parseFloat(subData.discount));
                      totalTaxableAmt=(totalTaxableAmt)+(taxableamt);
                      this.state.totaldiscount=totaldiscount.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
                      this.state.subTotal=subTotal.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
                      this.state.totalTaxableAmount=totalTaxableAmt.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
                      //this.state.deliveryCharges=finalLoadedData.deliveryCharges;
                      let totalpaid=Number(finalLoadedData.delivery_charges)+Number(subTotal);
                      this.state.totalpaid=totalpaid.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
                      this.forceUpdate();
                      this.state.totalTaxes=vatamount.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,'); 


                     return(
                         <React.Fragment>
                               <tr id={"tr-"+num+1} >
                                                    <td>{num+1}</td> 
                                                      <td class="item_inp"><div id={"medpname-"+subData.medicine_id}> {subData.products_master_tbl.medicinename} <h6>{subData.products_master_tbl.manufacturer}</h6></div></td>
                                                      {/* <td class="batch_inp">
                                                      <select class="form-control batches-list" id={"medbatch-"+subData.medicine_id}  onClick={this.getBatches.bind(this,"medbatch-"+subData.medicine_id)} >
                                                          <option value="select batch">select batch</option>
                                                          
                                                      </select></td> */}
                                                       <td class="batch_inp">
        <select class="form-control batches-list" id={"medbatch-"+subData.medicine_id}  onClick={this.getBatches.bind(this,"medbatch-"+subData.medicine_id)}>
        <option value="select batch">select batch</option>
           
        </select>
          </td>
                                                     
                                                       <td class="oqty_inp">
                                                        <input type="text" class="form-control" id={"medqty-"+subData.medicine_id} defaultValue={+subData.quantity} readOnly={true}/>   
                                                        </td>
                                                        <td class="aqty_inp">
                                                <input type="text" class="form-control" id={"medaqty-"+subData.medicine_id} defaultValue="0" readOnly="readOnly" onBlur={this.caliculateInvoiceAmounts}/>   
                                                        </td>
                                                        <td class="bqty_inp">
                                                        <input type="text" class="form-control" id={"medbqty-"+subData.medicine_id} defaultValue= {+subData.quantity} onBlur={this.caliculateInvoiceAmounts}/>   
                                                        </td>
                                                        
                                                        <td class="tax_inp">{this.state.retailerCurrency}
                                                        <input type="text" class="form-control" id={"medtaxamt-"+subData.medicine_id} defaultValue= {taxableamt.toFixed(2)} readOnly={true}/>   
                                                        </td>
                                                        <td class="vat_inp">
                                                        <input type="text" class="form-control" id={"medvat-"+subData.medicine_id } defaultValue={subData.vat} onBlur={this.caliculateInvoiceAmounts}/>   
                                                        </td>
                                                        <td class="vatamt_inp">
                                                        <input type="text" class="form-control" id={"medvatamt-"+subData.medicine_id } defaultValue={vatamount.toFixed(2)} readOnly={true} />   
                                                        </td>
                                                        <td class="mrp_inp">{this.state.retailerCurrency}
                                                       <input type="text" class="form-control"  id={"medmrp-"+subData.medicine_id} defaultValue={ subData.amount} readOnly={true}  onBlur={this.caliculateInvoiceAmounts}/>   
                                                       </td>
                                                        <td class="disc_inp">
                                                        <input type="text" class="form-control" id={"meddiscount-"+subData.medicine_id } defaultValue={subData.discount!=null ? subData.discount.toFixed(2) :"0.00"} onBlur={this.caliculateInvoiceAmounts}/>   
                                                        </td>
                                                        <td class="amount_inp">
                                                         <input type="text" class="form-control" id={"medamount-"+subData.medicine_id } value={(subData.quantity*subData.amount).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')} readOnly={true} /> 
                                                        </td>
                                                        <td class="amounts_inp">
                                                        <img class="plus_img" onClick={this.addRow} src="../images/retailer/addNewbatch.svg" id={"medadd-"+subData.medicine_id } />  
                                                        <input type="hidden" id={"medadded-"+subData.medicine_id} />
                                                        </td>
                                                        
                                                     
                                                     
                                                  </tr>
                
                </React.Fragment> 
                     )
                    })
                     :"" }
                    
                     </React.Fragment>
            )
            
        })
        this.state.retailerOrderMedicineInvoiceDetailsView=retailerOrderMedicineInvoiceDetailsView;
        
        this.forceUpdate();
        this.getTotals();

    }
 
        }
        })
        .catch((error) => {
        toast.error(error);
        });

}

// line wide and column wide 

caliculateInvoiceAmounts=(event)=>{

   
    let data=event.currentTarget.id;
    let rawData=data.split("-");
    let rowName=rawData[0];
    let rowId=rawData[1];
    let subTotal=0;
    let totaldiscount=0;
    let totalTaxableAmt=0;
    let search=data.search("~");
    let mrp="";
    let billedQty="";
    let taxamount="";
    let medvat="";
    let medvatamt="";
    let meddiscount="";
    let medamount="";
    let availableQty="";

    if(search>0){
        mrp= document.getElementById('new~medmrp-'+rowId).value;
        billedQty= document.getElementById('new~medbqty-'+rowId).value;
        taxamount= document.getElementById('new~medtaxamt-'+rowId).value;
        medvat= document.getElementById('new~medvat-'+rowId).value;
        medvatamt= document.getElementById('new~medvatamt-'+rowId).value;
        meddiscount= document.getElementById('new~meddiscount-'+rowId).value;
        medamount= document.getElementById('new~medamount-'+rowId).value;
        availableQty= document.getElementById('new~medaqty-'+rowId).value;
        if(parseInt(billedQty)>parseInt(availableQty)){
            toast.error('Billed Quantity should not greater than Available Quantity');
            return false;
        }
        
       
    }else{
        mrp= document.getElementById('medmrp-'+rowId).value;
        billedQty= document.getElementById('medbqty-'+rowId).value;
        taxamount= document.getElementById('medtaxamt-'+rowId).value;
        medvat= document.getElementById('medvat-'+rowId).value;
        medvatamt= document.getElementById('medvatamt-'+rowId).value;
        meddiscount= document.getElementById('meddiscount-'+rowId).value;
        medamount= document.getElementById('medamount-'+rowId).value;
        availableQty= document.getElementById('medaqty-'+rowId).value;
        //alert(billedQty+">"+availableQty);
        if(parseInt(billedQty)>parseInt(availableQty)){
            toast.error('Billed Quantity should not greater than Available Quantity');
            return false;
        }
    }

    //caliculations

   //caliculations
 //  let amounttot=((billedQty*mrp)-meddiscount/100);//.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
   let amt=mrp*billedQty;
       totaldiscount=parseInt(amt*meddiscount/100);
   let netbill=amt-parseInt(amt*meddiscount/100);
   let taxableamt=(netbill)/(1+(medvat/100));
   let vatamount=netbill-taxableamt;
   let amounttot=netbill;
       subTotal=subTotal+netbill;





    // let amounttot=((billedQty*mrp)-meddiscount/100);//.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
    
    // let netbill=(mrp)-(meddiscount);
    // let taxableamt=(netbill)/(1+(medvat));
    
    // let vatamount=netbill-taxableamt;
    //     subTotal=subTotal+amounttot;
    
    //    totaldiscount=(parseFloat(totaldiscount))+(parseFloat(meddiscount));
     //   totalTaxableAmt=(totalTaxableAmt)+(taxableamt);
      this.state.totaldiscount=totaldiscount.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
    //  this.state.subTotal=subTotal.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
    //  this.state.totalTaxableAmount=totalTaxableAmt.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
    //  this.state.deliveryCharges=0;//subData.deliveryCharges;
    
    if(search>0){
        document.getElementById('new~medtaxamt-'+rowId).value=vatamount.toFixed(2);
        document.getElementById('new~medvatamt-'+rowId).value=taxableamt.toFixed(2);
        document.getElementById('new~medamount-'+rowId).value=amounttot.toFixed(2);
      
    }else{
        
        document.getElementById('medtaxamt-'+rowId).value=vatamount.toFixed(2);
        document.getElementById('medvatamt-'+rowId).value=taxableamt.toFixed(2);
        document.getElementById('medamount-'+rowId).value=amounttot.toFixed(2);
    }
     this.getTotals();
     this.forceUpdate();



}


//caliculate dynamic values
caliculateInvoiceAmountsNewRows=(id)=>{
    
    let data=id;
    let rawData=data.split("-");
    let rowName=rawData[0];
    let rowId=rawData[1];
    let subTotal=0;
    let totaldiscount=0;
    let totalTaxableAmt=0;
    let search=data.search("~");
    let mrp="";
    let billedQty="";
    let taxamount="";
    let medvat="";
    let medvatamt="";
    let meddiscount="";
    let medamount="";
    let discountCaliculation="";
    let availableQty="0";

    if(search>0){
        let batchRow=rowName[0].split("#");
        let batchRowId=batchRow[0]+"#";
        meddiscount= document.getElementById(batchRowId+'new~meddiscount-'+rowId).value;
        discountCaliculation=document.getElementById('medmrp-'+rowId).value*meddiscount/100;
        mrp= document.getElementById(batchRowId+'new~medmrp-'+rowId).value;
        billedQty= document.getElementById(batchRowId+'new~medbqty-'+rowId).value;
        taxamount= document.getElementById(batchRowId+'new~medtaxamt-'+rowId).value;
        medvat= document.getElementById(batchRowId+'new~medvat-'+rowId).value;
        medvatamt= document.getElementById(batchRowId+'new~medvatamt-'+rowId).value;
        medamount= document.getElementById(batchRowId+'new~medamount-'+rowId).value;
        availableQty= document.getElementById(batchRowId+'new~medaqty-'+rowId).value;
        if(parseInt(billedQty)>parseInt(availableQty)){
            toast.error('Billed Quantity should not greater than Available Quantity');
            return false;
        }
  
    }else{
        meddiscount= document.getElementById('meddiscount-'+rowId).value;
        discountCaliculation=document.getElementById('medmrp-'+rowId).value*meddiscount/100;
        mrp= document.getElementById('medmrp-'+rowId).value-discountCaliculation;
        billedQty= document.getElementById('medbqty-'+rowId).value;
        taxamount= document.getElementById('medtaxamt-'+rowId).value;
        medvat= document.getElementById('medvat-'+rowId).value;
        medvatamt= document.getElementById('medvatamt-'+rowId).value;
        
        medamount= document.getElementById('medamount-'+rowId).value;
        availableQty= document.getElementById('medaqty-'+rowId).value;
        if(parseInt(billedQty)>parseInt(availableQty)){
            toast.error('Billed Quantity should not greater than Available Quantity');
            return false;
        }
    }

    //caliculations
   // let amounttot=((billedQty*mrp)-meddiscount/100);//.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
    let amt=mrp*billedQty;
        totaldiscount=parseInt(amt*meddiscount/100);
    let netbill=amt-parseInt(amt*meddiscount/100);
    let taxableamt=(netbill)/(1+(medvat/100));
    let vatamount=netbill-taxableamt;
    let amounttot=netbill;//((billedQty*mrp)-meddiscount/100);//.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
        subTotal=subTotal+netbill;
    
    //    totaldiscount=(parseFloat(totaldiscount))+(parseFloat(meddiscount));
     //   totalTaxableAmt=(totalTaxableAmt)+(taxableamt);
      this.state.totaldiscount=totaldiscount.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
    //  this.state.subTotal=subTotal.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
    //  this.state.totalTaxableAmount=totalTaxableAmt.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
    //  this.state.deliveryCharges=0;//subData.deliveryCharges;
    
    if(search>0){
        let batchRow=rowName[0].split("#");
        let batchRowId=batchRow[0]+"#";
        document.getElementById(batchRowId+'new~medtaxamt-'+rowId).value=vatamount.toFixed(2);
        document.getElementById(batchRowId+'new~medvatamt-'+rowId).value=taxableamt.toFixed(2);
        document.getElementById(batchRowId+'new~medamount-'+rowId).value=amounttot.toFixed(2);
    }else{
        document.getElementById('medtaxamt-'+rowId).value=vatamount.toFixed(2);
        document.getElementById('medvatamt-'+rowId).value=taxableamt.toFixed(2);
        document.getElementById('medamount-'+rowId).value=amounttot.toFixed(2);
    }
     this.getTotals();
     this.forceUpdate();



}

// get totals 
getTotals=()=>{

    let total=0; 
    let discount=0
    let taxamt=0;
    let vatamt=0;   
    let totalpaid=0;
    let discamt=0;
    let vatamts=0;
    //let billqty=0;

let totals= $(".amount_inp .form-control").map(function() {
        return $(this).val();
     }).get(); 
let taxamts= $(".tax_inp .form-control").map(function() {
        return $(this).val();
}).get(); 

 vatamts= $(".vatamt_inp .form-control").map(function() {
    return $(this).val();
}).get(); 
 

let discamts= $(".disc_inp .form-control").map(function() {
    return $(this).val();
}).get(); 

let mrpamts= $(".mrp_inp .form-control").map(function() {
    return $(this).val();
}).get();

let billqty= $(".bqty_inp .form-control").map(function() {
    return $(this).val();
}).get();


for(var i in totals) { total += parseFloat(totals[i].replace(",","")); }
for(var i in taxamts) { taxamt += parseFloat(taxamts[i].replace(",","")); }
// for(var i in vatamts) { vatamt += parseFloat(vatamts[i].replace(",","")); }
for(var i in vatamts) { vatamt += parseFloat(vatamts[i]); }

for(var i in discamts) { 
    if(mrpamts[i]>0 && billqty[i]>0){
    discamt +=  (parseFloat(mrpamts[i].replace(",","")) * parseFloat(billqty[i].replace(",","")))*parseFloat(discamts[i].replace(",","") /100);
    }
   // discamt += (parseFloat(discamts[i].replace(",","")) * parseFloat(mrpamts[i].replace(",",""))/100)
//    alert(discamt);
//    alert("mrp"+mrpamts[i]);
// alert("mrp"+billqty[i]);
// alert("mrp"+(discamts[i]/100));
 }
this.state.subTotal=total.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
totalpaid=Number(total)+Number(this.state.deliveryCharges);
this.state.totalpaid=totalpaid.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
this.state.totalTaxableAmount=taxamt.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
this.state.totalTaxes=vatamt.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
this.state.totaldiscount=discamt.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');

}

// Remove batch
removeBatch=(id)=>{
   
        let data=id.split("-");
        let dynamicadded=$('#medadded-'+data[1]).val();
        dynamicadded=Number(dynamicadded)-1;
        $('#medadded-'+data[1]).val(dynamicadded);
        $('#new-'+data[1]).html('');
        let rowData=data[0].split("#");
        let rowDataId=rowData[0]+"#";
       // document.getElementById(rowDataId+"new-"+data[1]).innerHTML="";   // Get the <ul> element with id="myList"
       if(document.getElementById(rowDataId+"new-"+data[1])){
        var myobj = document.getElementById(rowDataId+"new-"+data[1]);
            myobj.remove();
       }
        this.getTotals();
        this.forceUpdate(); 
    
}


getBatches=(id)=>{
   if(document.getElementById(id).options.length>2){  
       return
   }
   //alert(id);
    let reatailerId=this.state.retailerId;
    let data=id//event.currentTarget.id;
    let rawData=data.split("-");
    let rowName=rawData[0];
        rowName=rowName+"-";
    let rowId=rawData[1];
    let retailerbatchList="";
    let batcheCount=0; 
    //alert(rowName);
    Httpconfig.httptokenget(Constant.siteurl + "api/OM/retailerProduct/getBatchDetails/"+reatailerId+"/"+rowId,)
        .then((response) => { 
        if(response.data.status=200){
            batcheCount=Object.keys(response.data.data[0].retailer_stock_tbls).length;
        
        if(batcheCount>0){
           // alert(batcheCount);
           retailerbatchList='<option value="select batch">select batch</option>';
            for(let i=0;i<batcheCount;i++) {
            
                    retailerbatchList=retailerbatchList+"<option class='batchselect' id="+response.data.data[0].id +" value="+response.data.data[0].retailer_stock_tbls[i].batch+"~"+response.data.data[0].retailer_stock_tbls[i].expiry_date+"~"+response.data.data[0].retailer_stock_tbls[i].quantity+"~"+response.data.data[0].retailer_stock_tbls[i].id+"~"+response.data.data[0].retailer_stock_tbls[i].mrp+"~"+rowId+"~"+response.data.data[0].retailer_stock_tbls[i].discount+">"+response.data.data[0].retailer_stock_tbls[i].batch+"/"+response.data.data[0].retailer_stock_tbls[i].expiry_date +"</option>";
            
            }
         
        if($('#'+id+' option').length!=batcheCount+1){
           let search=id.search("~");
           if(search>0){
               document.getElementById(rowName+rowId).innerHTML = retailerbatchList;
               var e = document.getElementById(rowName+rowId);
               var strUser = e.value;
          
           }else{
              // alert("in");
              // alert(rowName+rowId);
           $("#"+rowName+rowId).html("");
           $("#"+rowName+rowId).append(retailerbatchList);
           }
        }
           this.state.retailerbatchList=retailerbatchList;
           this.forceUpdate();
        }
            }
            })
            .catch((error) => {
            toast.error(error);
            });

}




// get the new batches for new rows
getBatchesNewRows=(id)=>{
    let reatailerId=this.state.retailerId;
    let data=id;
    let rawData=data.split("-");
    let rowName=rawData[0];
    let rowId=rawData[2];
    Httpconfig.httptokenget(Constant.siteurl + "api/OM/retailerProduct/getBatchDetails/"+reatailerId+"/"+rowId,)
        .then((response) => { 
        if(response.data.status=200){
            
        if(Object.keys(response.data.data).length>0){
            const retailerbatchList= response.data.data.map((finalLoadedData,num)=>{ 

                return(
                    <option id={finalLoadedData.id} value={finalLoadedData.retailer_stock_tbls.batch+"/"+finalLoadedData.retailer_stock_tbls.expiry_date}>{finalLoadedData.retailer_stock_tbls.batch+"/"+finalLoadedData.retailer_stock_tbls.expiry_date} </option>
                )
                this.state.retailerbatchList=retailerbatchList;
                this.forceUpdate();
            })
        }
     
            }
            })
            .catch((error) => {
            toast.error(error);
            });

}

previewInvoice=()=>{
   // alert($("#theTable > tbody >tr").children.length);
   let productName="";
   let manafacturer="";
   let batchExpiry="";
   let mrp="";
   let oqty="";
   let aqty="";
   let bqty="";
   let taxableAmount="";
   let vat="";
   let vatAmount="";
   let discountAmount="";
   var lineAmounts="";
   let invoice="";
   let invoiceData="";
   let batch="";
   let expiredate="";
   let medicinestockid="";
   let medicineId="";
   let Invoicearray=[];
   let error=0;
  
   $('#theTable > tbody >tr').each(function(row,tr) {
        $(this).find("td").each(function(){
            let className=($(this).attr('class'));

            if(className=='item_inp'){
             productName=  $(this).text();
             manafacturer="";//manafacturer.replace("</h6>","");
            let search=productName.search("<h6>");
            if(search>0){
                productName=productName.replace("</h6>","").replace("<h6>","").replace("&amp;","&");
            }
             
             //alert(productName);
            }
 
            if(className=='batch_inp'){
             batchExpiry=  $(this).find('select').val();
           //alert(batchExpiry);
             if(batchExpiry!="select batch"){
                 batchExpiry=batchExpiry.split("~");
                 batch=batchExpiry[0];
                 expiredate=batchExpiry[1];
                 medicinestockid=batchExpiry[3];
                 medicineId=batchExpiry[5];
                 //alert(batchExpiry);
              // Batch20~2022-01-01~10~81~10~31
              
             }else{
                toast.error("Select batch for "+productName);
                error=error+1;
            }
             
            }
 
            if(className=='mrp_inp'){
             mrp=  $(this).find('.form-control').val();
            // alert(mrp);
            }
            
            if(className=='oqty_inp'){
             oqty=  $(this).find('.form-control').val();
             //alert(oqty);
            }
            if(className=='aqty_inp'){
             aqty= $(this).find('.form-control').val();
            // alert(aqty);
            }
            if(className=='bqty_inp'){
             bqty= $(this).find('.form-control').val();
             //alert(bqty);
            }
            if(className=='tax_inp'){
             taxableAmount=  $(this).find('.form-control').val();
            // alert(taxableAmount);
            }
            if(className=='vat_inp'){
             vat= $(this).find('.form-control').val();
             //alert(vat);
            }
            if(className=='vatamt_inp'){
             vatAmount=  $(this).find('.form-control').val();
             //alert(vatAmount);
            }
            if(className=='disc_inp'){
             discountAmount=  $(this).find('.form-control').val();
            // alert(discountAmount);
            }
            if(className=='amount_inp'){
             lineAmounts=  $(this).find('.form-control').val();
            }
            //alert(bqty+">"+aqty);
            if(className=='bqty_inp'){
                if(parseInt(bqty)>parseInt(aqty)){
                    toast.error('Billed Quantity should not greater than Available Quantity');
                    error=error+1;
                }
            }
        
           });
            invoiceData={
            "medicineId":medicineId,
            "medicinestockid":medicinestockid,
            "productName":productName,
            "manafacturer":manafacturer,
            "batchExpiry":batchExpiry,
            "batch":batch,
            'expiredate':expiredate,
            "mrp":mrp,
            "oqty":oqty,
            "bqty":bqty,
            "taxableAmount":taxableAmount,
            "vat":vat,
            "vatAmount":vatAmount,
            "discountAmount":discountAmount,
            "lineAmount":lineAmounts,
         }

         Invoicearray.push(invoiceData);
       // });
         
    });
    //alert(error);
    if(error>0){
        return false;
    }
    
    this.state.showOrderDetailsProcess="pharmacy-tab collapse-hide";
    this.state.showOrdersGrid="row showorder-list collapse-hide";
    this.state.showRejectReasons="collapse-hide";
    this.state.invoiceDiv="collapse-hide";
    this.state.invoicePDFPreview='collapse-show';
    this.state.invoiceRows=Invoicearray;
//this.forceUpdate();
}

showInvoicePage=()=>{
    
    this.state.showOrderDetailsProcess="pharmacy-tab collapse-hide";
    this.state.showOrdersGrid="row showorder-list collapse-hide";
    this.state.showRejectReasons="collapse-hide";
    this.state.invoiceDiv="collapse-show";
    this.state.invoicePDFPreview='collapse-hide'; 
    this.forceUpdate();

}
processOrder=()=>{

    let productName="";
    let manafacturer="";
    let batchExpiry="";
    let mrp="";
    let oqty="";
    let aqty="";
    let bqty="";
    let taxableAmount="";
    let vat="";
    let vatAmount="";
    let discountAmount="";
    var lineAmounts="";
    let invoice="";
    let invoiceData="";
    let batch="";
    let expiredate="";
    let medicinestockid="";
    let medicineId="";
    let Invoicearray=[];
    let error=0;

    //var atLeastOneIsChecked =
    let deliveryAgentCheckedCount=$('input[name="deliveryAgent"]:checked').length;
    if(deliveryAgentCheckedCount==0){
        toast.error("Select Delivery Agent");
    }

    $('#theTable > tbody >tr').each(function(row,tr) {
         $(this).find("td").each(function(){
             let className=($(this).attr('class'));
 
             if(className=='item_inp'){
            productName=  $(this).text();
             manafacturer="";//manafacturer.replace("</h6>","");
            let search=productName.search("<h6>");
            if(search>0){
                productName=productName.replace("</h6>","").replace("<h6>","").replace("&amp;","&");
            }
            
              //alert(productName); 
             }
  
             if(className=='batch_inp'){
              batchExpiry=  $(this).find('select').val();
            
              if(batchExpiry!="select batch"){
                  batchExpiry=batchExpiry.split("~");
                  batch=batchExpiry[0];
                  expiredate=batchExpiry[1];
                  medicinestockid=batchExpiry[3];
                  medicineId=batchExpiry[5];
                  //alert(batchExpiry);
               // Batch20~2022-01-01~10~81~10~31
               
            }else{
                toast.error("Select batch for "+productName);
                error=error+1;
            }
              
             }
  
             if(className=='mrp_inp'){
              mrp=  $(this).find('.form-control').val();
             // alert(mrp);
             }
             
             if(className=='oqty_inp'){
              oqty=  $(this).find('.form-control').val();
              //alert(oqty);
             }
             if(className=='aqty_inp'){
              aqty= $(this).find('.form-control').val();
             // alert(aqty);
             }
             if(className=='bqty_inp'){
              bqty= $(this).find('.form-control').val();
             // alert(bqty);
             }
             if(className=='tax_inp'){
              taxableAmount=  $(this).find('.form-control').val();
             // alert(taxableAmount);
             }
             if(className=='vat_inp'){
              vat= $(this).find('.form-control').val();
              //alert(vat);
             }
             if(className=='vatamt_inp'){
              vatAmount=  $(this).find('.form-control').val();
              //alert(vatAmount);
             }
             if(className=='disc_inp'){
              discountAmount=  $(this).find('.form-control').val();
             // alert(discountAmount);
             }
             if(className=='amount_inp'){
              lineAmounts=  $(this).find('.form-control').val();
             }
             if(className=='bqty_inp'){
                if(parseInt(bqty)>parseInt(aqty)){
                    toast.error('Billed Quantity should not greater than Available Quantity');
                    error=error+1;
                }
            }
         
            });

            

             invoiceData={
             "medicineId":medicineId,
             "medicinestockid":medicinestockid,
             "productName":productName,
             "manafacturer":manafacturer,
             "batchExpiry":batchExpiry,
             "batch":batch,
             'expiredate':expiredate,
             "mrp":mrp,
             "oqty":oqty,
             "bqty":bqty,
             "taxableAmount":taxableAmount,
             "vat":vat,
             "vatAmount":vatAmount,
             "discountAmount":discountAmount,
             "lineAmount":lineAmounts,
          }
 
          Invoicearray.push(invoiceData);
          
          
        // });
          
     });

     if(error>0){
        return false;
    }
    this.state.invoiceRows=Invoicearray;
    this.forceUpdate();
     
    
    let invoice_details=[];
    let stk_details=[];
    this.state.invoiceRows.map((itemsdata,num) =>{
       // alert(itemsdata.batchExpiry);
        let inv_detail={
        "retailer_id":this.state.retailerId,
        "order_id":this.state.orderId,
        "patient_id":this.state.customerId,
        "order_date":this.state.orderDate,
        "invoice_date":moment(this.state.invoiceDateTime).format("YYYY-MM-DD HH:mm:ss"),
        "medicine_id":itemsdata.medicineId,
        "batch":itemsdata.batch,
        "expiry":itemsdata.expiredate,
        "mrp":itemsdata.mrp.replace(",",""),
        "quantity":itemsdata.bqty,
        "taxable_rate":itemsdata.taxableAmount.replace(",",""),
        "vat":itemsdata.vat,
        "discount":itemsdata.discountAmount.replace(",",""),
        "amount":itemsdata.lineAmount.replace(",",""),
        
        }
        invoice_details.push(inv_detail);
        
    })
    this.state.invoiceRows.map((itemsdata,num) =>{
        // alert(itemsdata.batchExpiry);
         let stock_detail={
         "retailer_id":this.state.retailerId,
         "order_id":this.state.orderId,
         "patient_id":this.state.customerId,
         "order_date":this.state.orderDate,
         "invoice_date":moment(this.state.invoiceDateTime).format("YYYY-MM-DD HH:mm:ss"),
         "medicine_id":itemsdata.medicineId,
         "batch":itemsdata.batch,
         "expiry":itemsdata.expiredate,
         "mrp":itemsdata.mrp.replace(",",""),
         "quantity":itemsdata.bqty,
         "taxable_rate":itemsdata.taxableAmount.replace(",",""),
         "vat":itemsdata.vat,
         "discount":itemsdata.discountAmount.replace(",",""),
         "amount":itemsdata.lineAmount.replace(",",""),
         "id":itemsdata.medicinestockid,
         
         }
         stk_details.push(stock_detail);
         
     })
    let data={
        "retailer_id":this.state.retailerId,
        "order_id":this.state.orderId,
        "patient_id":this.state.customerId,
        "order_date":this.state.orderDate,
        "invoice_date":moment(this.state.invoiceDateTime).format("YYYY-MM-DD HH:mm:ss"),
        "payment_mode":"Card",
        "total_taxable_amount":this.state.totalTaxableAmount,
        "total_taxes":this.state.totalTaxes,
        "sub_total":this.state.subTotal,
        "discount":this.state.totaldiscount,
        "total_paid":this.state.totalpaid,
        "invoice_details":invoice_details,
        "stock_details":stk_details,
        "delivery_agent":this.state.deliveryAgent,
        
        }
        
    Httpconfig.httptokenpost(Constant.siteurl + "api/OM/orderInvoice/",data)
        .then((response) => { 
            if(response.invoiceId!=""){
                this.generatePDF();
            }
            
            
        })
            .catch((error) => {
            toast.error(error);
            });
}

generatePDF=()=>{
    let retailerId=this.state.retailerId;
    let orderId=this.state.orderId;
//alert("ub");
   
        Httpconfig.httptokenget(Constant.siteurl + "api/OM/orderInvoice/generatePDF/"+retailerId+"/"+orderId)
    .then((response) => { 
      //  alert(response);
        toast.success(response.message);
         
    })
        .catch((error) => {
        toast.error(error);
        });
        toast.success("Please wait invoice is generating...");
        // setTimeout(
        //     () => window.location.reload(),
        //     5000
        // );

}


checkdelivery=(event)=>{
let id=event.currentTarget.id;
    if(id=='retailerAgent'){
       if($('#' + id).is(":checked")==true)
        $('#Gokada').prop("checked",false);
    }else{
        if($('#' + id).is(":checked")==true)
        $('#retailerAgent').prop("checked",false);
    }

    this.state.deliveryAgent=id;
    
}
   

   render() {
      
      return (
            <main id="main">
                  <RetailerHeader />
                  <RetailerSideMenu/>
                  <section id="Pharmacy_dashboard">
                  <div class="container-fluid">
        <div class="row">
                 <div  class="col-lg-10 col-md-10 Pharma_Content">
                <section id="pharm_tabs" class="pharmacy-tab">
                    <div class="container">
                        <div class="row">
                        <div class="col-lg-6 col-md-12 p_schedule">
                            <label>Select Date</label>
                            <div class="manage_stck_form">
                             
                        <div class="form-group">
                            <input type="date" id="start_date" class="form-control"  placeholder="yyyy-mm-dd" onChange={this.startDate}/>
                            <p>To</p>

                             <input type="date" id="end_date" class="form-control" onChange={this.endDate}/> 
                        </div>
                        <div class="rgt_arrow_btn" onClick={this.showOrderbyDates}>
                           <p>find</p>
                        </div>
                    </div>
                        </div>
                            <div class="col-lg-6 col-md-12">
                                <nav class="p_nav">
                                    <div class="nav nav-tabs nav-fill" id="nav-tab" role="tablist">
                                        <a class={this.state.currentHome} id="current_home-tab" data-toggle="tab" href="#current_home" role="tab" aria-controls="current-home" aria-selected="true" onClick={this.handleClick}>Current<h6>(Pending)</h6><p>{this.state.pendingOrder}</p></a>
                                        <a class={this.state.prescriptionHome} id="prescription_home-tab" data-toggle="tab" href="#prescription_home" role="tab" aria-controls="prescription-home" aria-selected="true" onClick={this.handleClick}>Prescription <h6>(Verified)</h6><p>{this.state.PrescriptionVerifiedOrder}</p></a>
                                        <a class={this.state.processedHome} id="processed_home-tab" data-toggle="tab" href="#processed_home" role="tab" aria-controls="processed-home" aria-selected="true" onClick={this.handleClick}>Processed <h6>(Invoiced)</h6><p>{this.state.processingOrder}</p></a>
                                        <a class={this.state.shippedHome} id="shipped_home-tab" data-toggle="tab" href="#shipped_home" role="tab" aria-controls="shipped-home" aria-selected="true" onClick={this.handleClick}>Shipped<h6>(Pending)</h6><p>{this.state.shippedOrder}</p></a>
                                        <a class={this.state.deliverHome} id="deliver_home-tab" data-toggle="tab" href="#deliver_home" role="tab" aria-controls="deliver_home" aria-selected="false" onClick={this.handleClick}>Delivered<h6>(delivered 90%)</h6><p>{this.state.deliveredOrder}</p></a>
                                        <a class={this.state.cancelHome} id="cancel_home-tab" data-toggle="tab" href="#cancel_home" role="tab" aria-controls="cancel_home" aria-selected="false" onClick={this.handleClick}>Cancelled <p>{this.state.cancelledOrder}</p></a>
                                    </div>
                                </nav>
                                </div>
                                </div>
                                <div class={this.state.showOrdersGrid}>
                                <div class="col-md-12">
                                <div class="tab-content" id="nav-tabContent">
                                    <div class={this.state.currentHomePanel} id="current_home" role="tabpanel" aria-labelledby="current_home-tab">
                                        <div class="tableFixHead">
                                            <table>
                                                <thead>
                                                    <tr>
                                                        <th>NO</th>
                                                        <th>Customer</th>
                                                        <th>Order ID</th>
                                                        <th>Order Date</th>
                                                        <th>Prescription</th>
                                                        <th>Items</th>
                                                        <th>Amount</th>
                                                        <th>Invoice</th>
                                                        <th>Status</th>
                                                       
                                                    </tr>
                                                </thead>
                                              <tbody>
                                              {this.state.retailerFinalOrderMedicineDetailsView ? this.state.retailerFinalOrderMedicineDetailsView :  <React.Fragment><td></td><td></td><td></td><td></td><td>No Orders</td><td></td><td></td><td></td> </React.Fragment>}
                                             
                                              </tbody>
                                            </table>
                                          </div>
                                      
                                    </div>
                                    <div class={this.state.prescriptionHomePanel} id="prescription_home" role="tabpanel" aria-labelledby="prescription_home-tab">
                                        <div class="tableFixHead">
                                            <table>
                                                <thead>
                                                    <tr>
                                                        <th>NO</th>
                                                        <th>Customer</th>
                                                        <th>Order ID</th>
                                                        <th>Order Date</th>
                                                        <th>Prescription</th>
                                                        <th>Items</th>
                                                        <th>Amount</th>
                                                        <th>Invoice</th>
                                                        <th>Status</th>
                                                       
                                                    </tr>
                                                </thead>
                                              <tbody>
                                                  {this.state.retailerFinalOrderMedicineDetailsView ? this.state.retailerFinalOrderMedicineDetailsView :  <React.Fragment><td></td><td></td><td></td><td></td><td>No Orders</td><td></td><td></td><td></td> </React.Fragment>}
                                            
                                              </tbody>
                                            </table>
                                          </div>
                                      
                                    </div>
                                    <div class={this.state.processedHomePanel} id="processe_home" role="tabpanel" aria-labelledby="processed_home-tab">
                                        <div class="tableFixHead">
                                            <table>
                                                <thead>
                                                    <tr>
                                                        <th>NO</th>
                                                        <th>Customer</th>
                                                        <th>Order ID</th>
                                                        <th>Order Date</th>
                                                        <th>Prescription</th>
                                                        <th>Items</th>
                                                        <th>Amount</th>
                                                        <th>Invoice</th>
                                                        <th>Status</th>
                                                       
                                                    </tr>
                                                </thead>
                                              <tbody>
                                                  {this.state.retailerFinalOrderMedicineDetailsView ? this.state.retailerFinalOrderMedicineDetailsView :  <React.Fragment><td></td><td></td><td></td><td></td><td>No Orders</td><td></td><td></td><td></td> </React.Fragment>}
                                            
                                              </tbody>
                                            </table>
                                          </div>
                                      
                                    </div>
                                    <div class={this.state.shippedHomePanel} id="shipped_home" role="tabpanel" aria-labelledby="shipped_home-tab">
                                        <div class="tableFixHead">
                                            <table>
                                                <thead>
                                                    <tr>
                                                        <th>NO</th>
                                                        <th>Customer</th>
                                                        <th>Order ID</th>
                                                        <th>Order Date</th>
                                                        <th>Prescription</th>
                                                        <th>Items</th>
                                                        <th>Amount</th>
                                                        <th>Invoice</th>
                                                        <th>Status</th>
                                                       
                                                    </tr>
                                                </thead>
                                              <tbody>
                                                  {this.state.retailerFinalOrderMedicineDetailsView ? this.state.retailerFinalOrderMedicineDetailsView :  <React.Fragment><td></td><td></td><td></td><td></td><td>No Orders</td><td></td><td></td><td></td> </React.Fragment>}
                                            
                                              </tbody>
                                            </table>
                                          </div>
                                      
                                    </div>
                                    <div class={this.state.deliverHomePanel} id="deliver_home" role="tabpanel" aria-labelledby="deliver_home-tab">
                                        <div class="tableFixHead">
                                            <table>
                                                <thead>
                                                    <tr>
                                                        <th>NO</th>
                                                        <th>Customer</th>
                                                        <th>Order ID</th>
                                                        <th>Order Date</th>
                                                        <th>Prescription</th>
                                                        <th>Items</th>
                                                        <th>Amount</th>
                                                        <th>Invoice</th>
                                                        <th>Status</th>
                                                       
                                                    </tr>
                                                </thead>
                                              <tbody>
                                              {this.state.retailerFinalOrderMedicineDetailsView ? this.state.retailerFinalOrderMedicineDetailsView :  <React.Fragment><td></td><td></td><td></td><td></td><td>No Orders</td><td></td><td></td><td></td> </React.Fragment>}
                                            
                                              </tbody>
                                            </table>
                                          </div>
                                    </div>
                                    <div class={this.state.cancelHomePanel} id="cancel_home" role="tabpanel" aria-labelledby="cancel_home-tab">
                                        <div class="tableFixHead">
                                            <table>
                                                <thead>
                                                    <tr>
                                                        <th>NO</th>
                                                        <th>Customer</th>
                                                        <th>Order ID</th>
                                                        <th>Order Date</th>
                                                        <th>Prescription</th>
                                                        <th>Items</th>
                                                        <th>Amount</th>
                                                        <th>Invoice</th>
                                                        <th>Status</th>
                                                       
                                                    </tr>
                                                </thead>
                                              <tbody>
                                              {this.state.retailerFinalOrderMedicineDetailsView ? this.state.retailerFinalOrderMedicineDetailsView :  <React.Fragment><td></td><td></td><td></td><td></td><td>No Orders</td><td></td><td></td><td></td> </React.Fragment>}
                                              
                                                  
                                              </tbody>
                                            </table>
                                          </div>
                                    </div>
                                </div>
                            </div>
                      </div>

                    </div>
                </section>

                {/* code for pending items code */}

                  <section id="pharm_tabs" class={this.state.showOrderDetailsProcess} >
                    <div class="container">
                       
                        <div class="row">
                            <div class="col-md-12">
                                <div class="tab-content" id="nav-tabContent">
                                    <div class={this.state.currentHomePanel} id="current_home" role="tabpanel" aria-labelledby="current_home-tab">
                                       <div class="row">
                                       <div class="col-md-4">
                                       <div class="row">
                            <div class="col-md-12">
                        <a  onClick={this.back}> <h2 class="order_back"><img src="../images/retailer/back_arrow.svg"/>Back to Order's List</h2></a>  
                                </div>
                        </div>
                                           <div class="Prescription_bar">
                                               <div class="presc_head">
                                                   <h2>Prescription</h2>
                                               </div>
                                             <a href="#"> <p class="send_rqst_btn">Send Request</p></a> 
                                               <h6>Send a request to the customer to upload the Prescription</h6>
                                              <div class="prescription_img">
                                              {this.state.retailerPrescriptionDetailsView ? this.state.retailerPrescriptionDetailsView : "No Prescription Uploaded"}
                                                {/* <img  src="https://cdn.onlinewebfonts.com/svg/img_491633.png" /> */}
                                                {/* <img  src="https://cdn.onlinewebfonts.com/svg/img_491633.png" /> */}
                                              </div>
                                            </div>
                                        </div>
                                           <div class="col-md-8">
                                            <div class="tableFixHead_Order">
                                                <table>
                                                    <thead class="order_table">
                                                        <tr>
                                                            <th>{this.state.customerName} <h6> {this.state.customermobile}</h6></th>
                                                            <th>Order ID: <span>{this.state.orderId}</span></th>
                                                            <th>Items :<span>{this.state.itemsCount}</span></th>
                                                            <th>Price: <span>{this.state.retailerCurrency} {this.state.amount}</span></th>
                                                           
                                                           
                                                        </tr>
                                                    </thead>
                                                    {/* <thead class="order_second_table">
                                                        <tr>
                                                            <th class="check_bar">Select All</th>
                                                            <th>Medicine names</th>
                                                            <th>Quantity</th>
                                                            <th>Price</th>
                                                        </tr>
                                                    </thead> */}
                                                  <tbody>
                                                      {this.state.ordereditems}
                                                  </tbody>
                                                  {/* <tfoot class="footer_order">
                                                    <tr>              */}
                                                        
{/*                                                  
                                                    </tr>
                                                  </tfoot> */}
                                                </table>
                                                <div class="row">
                                                        <div class="col-md-6">
                                                        <div class="rej_btn">
                                                        <a href="#" onClick={this.rejectOrderShow}><img src="../images/retailer/close_reject.svg" />Reject</a> 
                                                        </div>
                                                        </div>
                                                        <div class="col-md-6">
                                                        <div class="app_btn">
                                                        <a href="#" onClick={this.orderApprove}><img src="../images/retailer/tick_approved.svg" />Approve</a>
                                                        </div>
                                                        </div>
                                                        </div>
                                              </div>
                                          
                                           </div>
                                          
                                       </div>
                                       
                                    </div>
                                    <div class={this.state.deliverHomePanel} id="deliver_home" role="tabpanel" aria-labelledby="deliver_home-tab">
                                        <div class="tableFixHead">
                                            <table>
                                                <thead class="order_table">
                                                    <tr>
                                                        <th>NO</th>
                                                        <th>Customer</th>
                                                        <th>Order ID</th>
                                                        <th>Order Date</th>
                                                        <th>Prescription</th>
                                                        <th>Items</th>
                                                        <th>Amount</th>
                                                        <th>Invoice</th>
                                                        <th>Status</th>
                                                       
                                                    </tr>
                                                </thead>
                                              <tbody>
                                                <tr>
                                                    <td>1</td>
                                                    <td>John <h6>9876542587</h6></td>
                                                    <td>0070859</td>
                                                    <td>20-05-2020</td>
                                                    <td>
                                                        <img class="presc_img" src="../images/retailer/RxFile.svg" />
                                                      <img class="presc_img" src="../images/retailer/RxFile.svg" />
                                                  </td>
                                                    <td>8</td>
                                                    <td>{this.state.retailerCurrency} 890</td>
                                                    <td class="pending_td">Delivered </td>
                                                    
                                                </tr>
                                                <tr>
                                                    <td>2</td>
                                                    <td>John <h6>9876542587</h6></td>
                                                    <td>0070859</td>
                                                    <td>20-05-2020</td>
                                                    <td>
                                                        <img class="presc_img" src="../images/retailer/RxFile.svg" />
                                                      <img class="presc_img" src="../images/retailer/RxFile.svg" />
                                                  </td>
                                                    <td>8</td>
                                                    <td>{this.state.retailerCurrency} 890</td>
                                                    <td class="pending_td">Delivered </td>
                                                    
                                                </tr>
                                                <tr>
                                                    <td>3</td>
                                                    <td>John <h6>9876542587</h6></td>
                                                    <td>0070859</td>
                                                    <td>20-05-2020</td>
                                                    <td>
                                                        <img class="presc_img" src="../images/retailer/RxFile.svg" />
                                                      <img class="presc_img" src="../images/retailer/RxFile.svg" />
                                                  </td>
                                                    <td>8</td>
                                                    <td>{this.state.retailerCurrency} 890</td>
                                                    <td class="pending_td">Delivered </td>
                                                    
                                                </tr>
                                              </tbody>
                                            </table>
                                          </div>
                                    </div>
                                    <div class={this.state.cancelHomePanel} id="cancel_home" role="tabpanel" aria-labelledby="cancel_home-tab">
                                        <div class="tableFixHead">
                                            <table>
                                                <thead class="order_table">
                                                    <tr>
                                                        <th></th>
                                                        <th>Customer</th>
                                                        <th>Order ID</th>
                                                        <th>Order Date</th>
                                                        <th>Prescription</th>
                                                        <th>Items</th>
                                                        <th>Amount</th>
                                                        <th>Status</th>
                                                       
                                                    </tr>
                                                </thead>
                                              <tbody>
                                                <tr>
                                                    <td>1</td>
                                                    <td>John <h6>9876542587</h6></td>
                                                    <td>0070859</td>
                                                    <td>20-05-2020</td>
                                                    <td>
                                                        <img class="presc_img" src="../images/retailer/RxFile.svg" />
                                                      <img class="presc_img" src="../images/retailer/RxFile.svg" />
                                                  </td>
                                                    <td>8</td>
                                                    <td>{this.state.retailerCurrency} 890</td>
                                                    <td class="pending_td">Cancelled </td>
                                                    
                                                </tr>
                                                <tr>
                                                    <td>2</td>
                                                    <td>John <h6>9876542587</h6></td>
                                                    <td>0070859</td>
                                                    <td>20-05-2020</td>
                                                    <td>
                                                        <img class="presc_img" src="../images/retailer/RxFile.svg" />
                                                      <img class="presc_img" src="../images/retailer/RxFile.svg" />
                                                  </td>
                                                    <td>8</td>
                                                    <td>{this.state.retailerCurrency} 890</td>
                                                    <td class="pending_td">Cancelled </td>
                                                    
                                                </tr>
                                                <tr>
                                                    <td>3</td>
                                                    <td>John <h6>9876542587</h6></td>
                                                    <td>0070859</td>
                                                    <td>20-05-2020</td>
                                                    <td>
                                                        <img class="presc_img" src="../images/retailer/RxFile.svg" />
                                                      <img class="presc_img" src="../images/retailer/RxFile.svg" />
                                                  </td>
                                                    <td>8</td>
                                                    <td>{this.state.retailerCurrency} 890</td>
                                                    <td class="pending_td">Cancelled </td>
                                                    
                                                </tr>
                                              </tbody>
                                            </table>
                                          </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

{/* code for reject Reason page */}

 <section id="reject_reason" class={this.state.showRejectReasons}>
                    <div class="container">
                    <div class="row">
                        <div class="col-md-8">
                                <div class="reject_back">
                                    <a href="#" onClick={this.back}> <h2 ><img src="https://i.pinimg.com/736x/9e/b6/0e/9eb60ee1602cb5370382c2582ee2d0d1.jpg" />Back to Order's List</h2></a>  
                                </div>
                                <div class="reject_head">
                                   <h2><img src="https://i.pinimg.com/736x/9e/b6/0e/9eb60ee1602cb5370382c2582ee2d0d1.jpg" onClick={this.hidegridpendingorders} /></h2>
                                </div>
                                <div class="reject_content">
                                    <div class="rej_main">
                                        <h2>Reasons For the rejection</h2>
                                        {this.state.retailerRejectList? this.state.retailerRejectList : "no"}
                                        
                                    </div>
                            </div>
                            <div class="reject_bottom">
                                <div class="submit_btn">
                                    <button type="button" onClick={this.rejectOrder}>Submit</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                  </section>


              {/* code for invoice     */}

                 <section id="retailer_invoice" class={this.state.invoiceDiv}>
                     <div class="container">
                         <div class="row">
                             <div class="col-md-12">
                                 <div class="ret_inv_section">
                                     <div class="ret_inv_head">
                                       
                                         <h2><h6 class="ret_inv_back"> <a href="#" onClick={this.showgridpendingorders}><img src="../images/retailer/back_arrow.svg" />Back to Order's List</a>  </h6>  Invoice</h2>
                                     </div>
                                     <div class="ret_pharm_det">
                                         <div class="row">
                                             <div class="col-md-8">
                                                <div class="pharm_add">
                                                    <h2>{this.state.storeName}</h2>
                                                    <h5>{this.state.storeAddress}</h5>
                                                     </div>
                                             </div>
                                             <div class="col-md-4">
                                                <div class="pharm_order">
                                                    <p>Order No: <span>{this.state.orderId}</span></p>
                                                    <p>Order Date: <span>{this.state.orderDate}</span></p>
                                                    <p>Invoice Date: <span>{this.state.invoiceDateTime}</span></p>
                                                    </div>
                                             </div>
                                         </div>
                                        
                                        
                                     </div>
                                     <div class="ret_invoice_table">
                                        <div class="table-responsive tableFixHead">
                                            <table class="table table-bordered" id="theTable">
                                                <thead>
                                                    <tr>
                                                      <th>Sl.no</th>
                                                        <th>Product</th>
                                                        <th>Batch & Expiry</th>
                                                        <th>O Qty</th>
                                                        <th>A Qty</th>
                                                        <th>B Qty</th>
                                                        <th>Vat Amt % {this.state.retailerCurrency}</th>
                                                        <th>Vat %</th>
                                                        <th>Taxable Amt {this.state.retailerCurrency}</th>
                                                        <th>MRP {this.state.retailerCurrency}</th>
                                                        <th>Discount %</th>
                                                        <th>Amount {this.state.retailerCurrency}</th>
                                                        <th></th>
                                                    </tr>
                                                </thead>
                                              <tbody>
                                                  {/* main tr */}
                                                  {this.state.retailerOrderMedicineInvoiceDetailsView}
                                               

                                                  {/* hidden tr */}

                                                  {/* <tr id="templateRow" style={{"display":"none"}}>
                    
                                                    <td></td>
                                                    <td ></td>
                                                    <td class="batch_inp">
                                                    <select class="form-control">
                                                        <option>88789- 23/5</option>
                                                        <option>88789- 23/5</option>
                                                        <option>88789- 23/5</option>
                                                    </select></td>
                                                    <td class="mrp_inp">
                                                     <input type="text" class="form-control" value="{this.state.retailerCurrency} 27.5" />   
                                                     </td>
                                                     <td class="qty_inp">
                                                      <input type="text" class="form-control" value="2" />   
                                                      </td>
                                                      <td class="tax_inp">
                                                          <input type="text" class="form-control" value="{this.state.retailerCurrency} 71.64" />   
                                                          </td>
                                                          <td class="vat_inp">
                                                            <input type="text" class="form-control" value="6.0" />   
                                                            </td>
                                                            <td class="amount_inp">
                                                                <input type="text" class="form-control" value="{this.state.retailerCurrency} 160" /> 
                                                                
                                                                </td>
                                                          <td></td>
                                                 
                                                  </tr> */}
                                               <div id="newRow" style={{"display":"none"}}>{this.state.newRow}</div>
                                                  
                                                 
                                              </tbody>
                                            </table>
                                          </div>
                                      <div class="ret_inv_footer">
                                          <div class="row">
                                              <div class="col-md-offset-7 col-md-5 amount__right">
                                                  <div class="total_tax">

                                                      <h5>Total Taxes : <span>{this.state.retailerCurrency} {this.state.totalTaxableAmount}</span></h5>
                                                      <h5>Total Taxable Amount : <span>{this.state.retailerCurrency} {this.state.totalTaxes}</span></h5>
                                                  </div>
                                                  <div class="total_amnt">
                                                      <p>Sub Total : <span>{this.state.retailerCurrency} {this.state.subTotal}
                                                          {/* <CurrencyFormat value={this.state.subTotal} displayType={'text'} thousandSeparator={true} prefix={'$'} /> */}
                                                      </span></p>
                                                      <p>Discount : <span> - {this.state.retailerCurrency} {this.state.totaldiscount}</span></p>
                                                      <p>Delivery Charges : <span> + {this.state.retailerCurrency} {this.state.deliveryCharges}</span></p>
                                                      <h3>Total Paid : <span>{this.state.retailerCurrency} {this.state.totalpaid}</span></h3>
                                                      
                                                  </div>
                                              </div>
                                          </div>
                                      </div>
                                      <div class="ret_inv_pay">
                                          <div class="row">
                                              <div class="col-md-4">
                                                <div class="payment_mode">
                                                    <p>Payment mode: <span>Card</span></p>
                                                    <p>Delivery Address : <span>{this.state.customerName}</span>
                                                    <span>{this.state.customerAddress1}</span>
                                                    <span>{this.state.customerAddress2}</span>
                                                    <span>{this.state.customerLandmark}</span>
                                                    <span>{this.state.customermobile}</span>
                                                    </p>
                                                </div>
                                              </div>
                                              <div class="col-md-4">
                                            <div class="delivery_agent">
                                                <h2>Select your Delivery agent</h2>
                                                <p><input type="checkbox" name="deliveryAgent" id="retailerAgent" onChange={this.checkdelivery} /> Retailer Agent</p>
                                                <p><input type="checkbox" name="deliveryAgent" id="Gokada" onChange={this.checkdelivery}/> Go Kada</p>
                                            </div>

                                              </div>
                                              <div class="col-md-4">
                                               <div class="ret_inv_btns">
                                                 <a href="#"> <p class="preview_btn" onClick={this.previewInvoice}>Preview</p></a> 
                                                 <a href="#"> <p class="processs_btn" onClick={this.processOrder} >Processed</p></a> 
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

                 <section id="invoicepdf" class={this.state.invoicePDFPreview}>
                 <div class="row">
                            <div class="col-md-12">
                        <a  onClick={this.showInvoicePage}> <h2 class="order_back"><img src="https://i.pinimg.com/736x/9e/b6/0e/9eb60ee1602cb5370382c2582ee2d0d1.jpg"/>Back to Order's List</h2></a>  
                                </div>
                        </div>
                 
      <div style={{margin: '10px', display: 'block'}}>
        <div>
          <h2 style={{fontSize: '24px', margin: '5px 0px', color: '#000', fontFamily: 'sans-serif'}}>{this.state.storeName}</h2>
        </div>
        <div style={{margin: '10px 0px', display: 'inline-block', width: '100%'}}>
          <div style={{width: '50%', float: 'left'}}>
            <h4 style={{letterSpacing: '0px', color: '#000000', fontSize: '16px', margin: '5px 0px', opacity: 1, fontFamily: 'sans-serif', fontWeight: 600, display: 'inline-block', marginRight: '20px'}}>Invoice number : <span style={{fontWeight: 300, fontSize: '15px', color: '#212121', fontFamily: 'sans-serif', letterSpacing: '0px', opacity: 1}}>5842158</span> </h4>
            <h4 style={{letterSpacing: '0px', color: '#000000', fontSize: '16px', margin: '5px 0px', opacity: 1, fontFamily: 'sans-serif', fontWeight: 600, display: 'inline-block', marginRight: '20px'}}>DL number : <span style={{fontWeight: 300, fontSize: '15px', color: '#212121', fontFamily: 'sans-serif', letterSpacing: '0px', opacity: 1}}>5842158AB6</span> </h4>
            <p style={{letterSpacing: '0px', color: '#000000', fontSize: '15px', margin: '5px 0px', opacity: 1, fontFamily: 'sans-serif', fontWeight: 300, lineHeight: '22px'}}>{this.state.storeAddress}</p>
          </div>
          <div style={{float: 'right', width: '50%', textAlign: 'right'}}>
            <p style={{letterSpacing: '0px', color: '#000000', fontSize: '15px', margin: '2px 0px', opacity: 1, fontFamily: 'sans-serif', fontWeight: 300, lineHeight: '22px'}}>Order NO: <span>{this.state.orderId}</span></p>
            <p style={{letterSpacing: '0px', color: '#000000', fontSize: '15px', margin: '2px 0px', opacity: 1, fontFamily: 'sans-serif', fontWeight: 300, lineHeight: '22px'}}>Order Date: <span>{this.state.orderDate}</span></p>
            <p style={{letterSpacing: '0px', color: '#000000', fontSize: '15px', margin: '2px 0px', opacity: 1, fontFamily: 'sans-serif', fontWeight: 300, lineHeight: '22px'}}>Invoice Date: <span>{this.state.invoiceDateTime}</span></p>
          </div>
        </div>
        <div style={{margin: '10px 0px 0px 0px'}}>
          <div className="table-responsive" style={{display: 'block', width: '100%', overflowX: 'auto'}}>
            <table className="table " style={{width: '100%', marginBottom: '0px', borderCollapse: 'collapse', backgroundColor: 'transparent', border: '1px solid #ddd'}}>
              <thead style={{background: '#3b3e82 0% 0% no-repeat padding-box', opacity: 1}}>
                <tr>
                  <th style={{borderBottom: 'none', padding: '14px 10px', color: '#fff', border: '1px solid #ddd', fontSize: '15px', fontWeight: 600, fontFamily: 'sans-serif', textAlign: 'left'}}>Sl.NO</th>
                  <th style={{borderBottom: 'none', padding: '14px 10px', color: '#fff', border: '1px solid #ddd', fontSize: '15px', fontWeight: 600, fontFamily: 'sans-serif', textAlign: 'left'}}>Product</th>
                  <th style={{borderBottom: 'none', padding: '14px 10px', color: '#fff', border: '1px solid #ddd', fontSize: '15px', fontWeight: 600, fontFamily: 'sans-serif', textAlign: 'left'}}>Batch &amp; Expiry</th>
                  <th style={{borderBottom: 'none', padding: '14px 10px', color: '#fff', border: '1px solid #ddd', fontSize: '15px', fontWeight: 600, fontFamily: 'sans-serif', textAlign: 'left'}}>MRP</th>
                  <th style={{borderBottom: 'none', padding: '14px 10px', color: '#fff', border: '1px solid #ddd', fontSize: '15px', fontWeight: 600, fontFamily: 'sans-serif', textAlign: 'left'}}>Qty.</th>
                  <th style={{borderBottom: 'none', padding: '14px 10px', color: '#fff', border: '1px solid #ddd', fontSize: '15px', fontWeight: 600, fontFamily: 'sans-serif', textAlign: 'left'}}>Taxable Amt.</th>
                  <th style={{borderBottom: 'none', padding: '14px 10px', color: '#fff', border: '1px solid #ddd', fontSize: '15px', fontWeight: 600, fontFamily: 'sans-serif', textAlign: 'left'}}>Vat %</th>
                  <th style={{borderBottom: 'none', padding: '14px 10px', color: '#fff', border: '1px solid #ddd', fontSize: '15px', fontWeight: 600, fontFamily: 'sans-serif', textAlign: 'left'}}>Vat Amt.</th>
                  <th style={{borderBottom: 'none', padding: '14px 10px', color: '#fff', border: '1px solid #ddd', fontSize: '15px', fontWeight: 600, fontFamily: 'sans-serif', textAlign: 'left'}}>Discount</th>
                  <th style={{borderBottom: 'none', padding: '14px 10px', color: '#fff', border: '1px solid #ddd', fontSize: '15px', fontWeight: 600, fontFamily: 'sans-serif', textAlign: 'left'}}>Total Amt.</th>
                </tr>
              </thead>
              <tbody>
              
                  {this.state.invoiceRows?  this.state.invoiceRows.map((itemsdata,num) =>(  
    <tr>
    <td style={{padding: '10px', fontSize: '15px', fontFamily: 'sans-serif', color: '#000', fontWeight: 600, letterSpacing: '0px', border: '1px solid #ddd'}}>{num+1}</td>
    <td style={{padding: '14px 10px', fontSize: '15px', fontFamily: 'sans-serif', color: '#000', fontWeight: 600, letterSpacing: '0px', border: '1px solid #ddd'}}>{itemsdata.productName}
      <p style={{fontSize: '15px', fontFamily: 'sans-serif', color: '#000', fontWeight: 500, letterSpacing: '0px', margin: '5px 0px 0px 0px'}}>{itemsdata.manafacturer}</p>
    </td>
    <td style={{padding: '10px', fontSize: '15px', fontFamily: 'sans-serif', color: '#000', fontWeight: 500, letterSpacing: '0px', border: '1px solid #ddd'}}>{itemsdata.batch}/{itemsdata.expiredate}</td>
    <td style={{padding: '10px', fontSize: '15px', fontFamily: 'sans-serif', color: '#000', fontWeight: 500, letterSpacing: '0px', border: '1px solid #ddd'}}>{this.state.retailerCurrency} {itemsdata.mrp}</td>
    <td style={{padding: '10px', fontSize: '15px', fontFamily: 'sans-serif', color: '#000', fontWeight: 500, letterSpacing: '0px', border: '1px solid #ddd'}}>{itemsdata.oqty}</td>
    <td style={{padding: '10px', fontSize: '15px', fontFamily: 'sans-serif', color: '#000', fontWeight: 500, letterSpacing: '0px', border: '1px solid #ddd'}}>{this.state.retailerCurrency} {itemsdata.taxableAmount}</td>
    <td style={{padding: '10px', fontSize: '15px', fontFamily: 'sans-serif', color: '#000', fontWeight: 500, letterSpacing: '0px', border: '1px solid #ddd'}}>{itemsdata.vat}</td>
    <td style={{padding: '10px', fontSize: '15px', fontFamily: 'sans-serif', color: '#000', fontWeight: 500, letterSpacing: '0px', border: '1px solid #ddd'}}>{this.state.retailerCurrency} {itemsdata.vatAmount}</td>
    <td style={{padding: '10px', fontSize: '15px', fontFamily: 'sans-serif', color: '#000', fontWeight: 500, letterSpacing: '0px', border: '1px solid #ddd'}}>{itemsdata.discountAmount}</td>
    <td style={{padding: '10px', fontSize: '15px', fontFamily: 'sans-serif', color: '#000', fontWeight: 500, letterSpacing: '0px', border: '1px solid #ddd'}}>{this.state.retailerCurrency} {itemsdata.lineAmount}</td>
  </tr>
  )) :""
 }
                {/* <tr>
                  <td style={{padding: '10px', fontSize: '15px', fontFamily: 'sans-serif', color: '#000', fontWeight: 600, letterSpacing: '0px', border: '1px solid #ddd'}}>1</td>
                  <td style={{padding: '14px 10px', fontSize: '15px', fontFamily: 'sans-serif', color: '#000', fontWeight: 600, letterSpacing: '0px', border: '1px solid #ddd'}}>Dolo Tablet 650
                    <p style={{fontSize: '15px', fontFamily: 'sans-serif', color: '#000', fontWeight: 500, letterSpacing: '0px', margin: '5px 0px 0px 0px'}}>Micro Labs Ltd</p>
                  </td>
                  <td style={{padding: '10px', fontSize: '15px', fontFamily: 'sans-serif', color: '#000', fontWeight: 500, letterSpacing: '0px', border: '1px solid #ddd'}}>555845 -5/22</td>
                  <td style={{padding: '10px', fontSize: '15px', fontFamily: 'sans-serif', color: '#000', fontWeight: 500, letterSpacing: '0px', border: '1px solid #ddd'}}>{this.state.retailerCurrency} 22.57</td>
                  <td style={{padding: '10px', fontSize: '15px', fontFamily: 'sans-serif', color: '#000', fontWeight: 500, letterSpacing: '0px', border: '1px solid #ddd'}}>3</td>
                  <td style={{padding: '10px', fontSize: '15px', fontFamily: 'sans-serif', color: '#000', fontWeight: 500, letterSpacing: '0px', border: '1px solid #ddd'}}>{this.state.retailerCurrency} 32.50</td>
                  <td style={{padding: '10px', fontSize: '15px', fontFamily: 'sans-serif', color: '#000', fontWeight: 500, letterSpacing: '0px', border: '1px solid #ddd'}}>5</td>
                  <td style={{padding: '10px', fontSize: '15px', fontFamily: 'sans-serif', color: '#000', fontWeight: 500, letterSpacing: '0px', border: '1px solid #ddd'}}>{this.state.retailerCurrency} 55.32</td>
                  <td style={{padding: '10px', fontSize: '15px', fontFamily: 'sans-serif', color: '#000', fontWeight: 500, letterSpacing: '0px', border: '1px solid #ddd'}}>10</td>
                  <td style={{padding: '10px', fontSize: '15px', fontFamily: 'sans-serif', color: '#000', fontWeight: 500, letterSpacing: '0px', border: '1px solid #ddd'}}>{this.state.retailerCurrency} 75.33</td>
                </tr> */}
                {/* <tr>
                  <td style={{padding: '10px', fontSize: '15px', fontFamily: 'sans-serif', color: '#000', fontWeight: 600, letterSpacing: '0px', border: '1px solid #ddd'}}>2</td>
                  <td style={{padding: '14px 10px', fontSize: '15px', fontFamily: 'sans-serif', color: '#000', fontWeight: 600, letterSpacing: '0px', border: '1px solid #ddd'}}>Dolo Tablet 650
                    <p style={{fontSize: '14px', fontFamily: 'sans-serif', color: '#000', fontWeight: 500, letterSpacing: '0px', margin: '5px 0px 0px 0px'}}>Micro Labs Ltd</p>
                  </td>
                  <td style={{padding: '10px', fontSize: '15px', fontFamily: 'sans-serif', color: '#000', fontWeight: 500, letterSpacing: '0px', border: '1px solid #ddd'}}>555845 -5/22</td>
                  <td style={{padding: '10px', fontSize: '15px', fontFamily: 'sans-serif', color: '#000', fontWeight: 500, letterSpacing: '0px', border: '1px solid #ddd'}}>{this.state.retailerCurrency} 22.57</td>
                  <td style={{padding: '10px', fontSize: '15px', fontFamily: 'sans-serif', color: '#000', fontWeight: 500, letterSpacing: '0px', border: '1px solid #ddd'}}>3</td>
                  <td style={{padding: '10px', fontSize: '15px', fontFamily: 'sans-serif', color: '#000', fontWeight: 500, letterSpacing: '0px', border: '1px solid #ddd'}}>{this.state.retailerCurrency} 32.50</td>
                  <td style={{padding: '10px', fontSize: '15px', fontFamily: 'sans-serif', color: '#000', fontWeight: 500, letterSpacing: '0px', border: '1px solid #ddd'}}>5</td>
                  <td style={{padding: '10px', fontSize: '15px', fontFamily: 'sans-serif', color: '#000', fontWeight: 500, letterSpacing: '0px', border: '1px solid #ddd'}}>{this.state.retailerCurrency} 55.32</td>
                  <td style={{padding: '10px', fontSize: '15px', fontFamily: 'sans-serif', color: '#000', fontWeight: 500, letterSpacing: '0px', border: '1px solid #ddd'}}>10</td>
                  <td style={{padding: '10px', fontSize: '15px', fontFamily: 'sans-serif', color: '#000', fontWeight: 500, letterSpacing: '0px', border: '1px solid #ddd'}}>{this.state.retailerCurrency} 75.33</td>
                </tr> */}
                {/* <tr>
                  <td style={{padding: '10px', fontSize: '15px', fontFamily: 'sans-serif', color: '#000', fontWeight: 600, letterSpacing: '0px', border: '1px solid #ddd'}}>3</td>
                  <td style={{padding: '14px 10px', fontSize: '15px', fontFamily: 'sans-serif', color: '#000', fontWeight: 600, letterSpacing: '0px', border: '1px solid #ddd'}}>Dolo Tablet 650
                    <p style={{fontSize: '15px', fontFamily: 'sans-serif', color: '#000', fontWeight: 500, letterSpacing: '0px', margin: '5px 0px 0px 0px'}}>Micro Labs Ltd</p>
                  </td>
                  <td style={{padding: '10px', fontSize: '15px', fontFamily: 'sans-serif', color: '#000', fontWeight: 500, letterSpacing: '0px', border: '1px solid #ddd'}}>555845 -5/22</td>
                  <td style={{padding: '10px', fontSize: '15px', fontFamily: 'sans-serif', color: '#000', fontWeight: 500, letterSpacing: '0px', border: '1px solid #ddd'}}>{this.state.retailerCurrency} 22.57</td>
                  <td style={{padding: '10px', fontSize: '15px', fontFamily: 'sans-serif', color: '#000', fontWeight: 500, letterSpacing: '0px', border: '1px solid #ddd'}}>3</td>
                  <td style={{padding: '10px', fontSize: '15px', fontFamily: 'sans-serif', color: '#000', fontWeight: 500, letterSpacing: '0px', border: '1px solid #ddd'}}>{this.state.retailerCurrency} 32.50</td>
                  <td style={{padding: '10px', fontSize: '15px', fontFamily: 'sans-serif', color: '#000', fontWeight: 500, letterSpacing: '0px', border: '1px solid #ddd'}}>5</td>
                  <td style={{padding: '10px', fontSize: '15px', fontFamily: 'sans-serif', color: '#000', fontWeight: 500, letterSpacing: '0px', border: '1px solid #ddd'}}>{this.state.retailerCurrency} 55.32</td>
                  <td style={{padding: '10px', fontSize: '15px', fontFamily: 'sans-serif', color: '#000', fontWeight: 500, letterSpacing: '0px', border: '1px solid #ddd'}}>10</td>
                  <td style={{padding: '10px', fontSize: '15px', fontFamily: 'sans-serif', color: '#000', fontWeight: 500, letterSpacing: '0px', border: '1px solid #ddd'}}>{this.state.retailerCurrency} 75.33</td>
                </tr> */}
              </tbody>
            </table>
          </div>
        </div>
        <div style={{margin: '10px 0px', float: 'right'}}>
          <div style={{display: 'inline-block', verticalAlign: 'top', marginRight: '25px'}}>
            <p style={{letterSpacing: '0px', color: '#000000', fontSize: '15px', fontWeight: 500, margin: '10px 0px', opacity: 1, fontFamily: 'sans-serif'}}>Total Taxable Amount: <span>{this.state.retailerCurrency} {this.state.totalTaxableAmount}</span></p>
            <p style={{letterSpacing: '0px', color: '#000000', fontSize: '15px', fontWeight: 500, margin: '10px 0px', opacity: 1, fontFamily: 'sans-serif'}}>Total Taxes: <span>{this.state.retailerCurrency} {this.state.totalTaxes}</span></p>
          </div>
          <div style={{display: 'inline-block', verticalAlign: 'top'}}>
            <p style={{letterSpacing: '0px', color: '#000000', fontSize: '15px', fontWeight: 500, margin: '10px 0px', opacity: 1, fontFamily: 'sans-serif'}}>Sub Total : <span>{this.state.retailerCurrency} {this.state.subTotal}</span></p>
            <p style={{letterSpacing: '0px', color: '#000000', fontSize: '15px', fontWeight: 500, margin: '10px 0px', opacity: 1, fontFamily: 'sans-serif'}}>Discount : <span>{this.state.retailerCurrency} {this.state.totaldiscount ? this.state.totaldiscount :"0.00"}</span></p>
            <p style={{letterSpacing: '0px', color: '#000000', fontSize: '15px', fontWeight: 500, margin: '10px 0px', opacity: 1, fontFamily: 'sans-serif'}}>Delivery Charges : <span>{this.state.retailerCurrency} {this.state.deliveryCharges}</span></p>
            <h2 style={{letterSpacing: '0px', color: '#000000', fontSize: '16px', fontWeight: 600, margin: '10px 0px', opacity: 1, fontFamily: 'sans-serif'}}>Total Paid: <span>{this.state.retailerCurrency} {this.state.totalpaid}</span></h2>
          </div>
        </div>
        <div style={{margin: '10px 0px', float: 'left', width: '100%', borderTop: '2px solid #000', borderBottom: '2px solid #000'}}>
          <div style={{display: 'inline-block', verticalAlign: 'top'}}>
            <h4 style={{letterSpacing: '0px', color: '#000000', fontSize: '16px', fontWeight: 600, margin: '10px 25px 10px 0px', opacity: 1, fontFamily: 'sans-serif'}}>Payment Mode : 
              <span style={{letterSpacing: '0px', color: '#000000', fontSize: '15px', fontWeight: 500, margin: '10px 0px', opacity: 1, fontFamily: 'sans-serif'}}>Card </span></h4>
          </div>
          <div style={{display: 'inline-block', width: '50%'}}>
            <h4 style={{letterSpacing: '0px', color: '#000000', fontSize: '16px', fontWeight: 600, margin: '10px 0px', opacity: 1, fontFamily: 'sans-serif'}}>Delivery Address:
              <span style={{display: 'block', letterSpacing: '0px', color: '#000000', fontSize: '15px', fontWeight: 500, margin: '10px 0px', opacity: 1, fontFamily: 'sans-serif', lineHeight: '22px'}}>{this.state.customerName}{this.state.customerAddress1}{this.state.customerAddress2}{this.state.customerLandmark}{this.state.customermobile}</span></h4>
          </div>
        </div>
        <div style={{marginBottom: '10px', width: '100%', float: 'left'}}>
          <div>
            <p style={{letterSpacing: '0px', color: '#000000', fontSize: '15px', fontWeight: 500, margin: '6px 0px', opacity: 1, fontFamily: 'sans-serif'}}>Terms and Conditions</p>
            <p style={{letterSpacing: '0px', color: '#000000', fontSize: '15px', fontWeight: 500, margin: '6px 0px', opacity: 1, fontFamily: 'sans-serif'}}>1. Exchange of goods NOT accepted after 72 hrs of PURCHASE. Bill is required for Exchange. Subject to Hyderabad Jurisdiction. </p>
            <p style={{letterSpacing: '0px', color: '#000000', fontSize: '15px', fontWeight: 500, margin: '6px 0px', opacity: 1, fontFamily: 'sans-serif'}}>2. Fridge items will not be taken back.</p>
            <p style={{letterSpacing: '0px', color: '#000000', fontSize: '15px', fontWeight: 500, margin: '6px 0px', opacity: 1, fontFamily: 'sans-serif'}}>3. No charge is payable on reverse charge basis.</p>
          </div>
        </div>
      </div>
   
                     </section>
                


            </div>
            </div>
            </div>
            <ToastContainer />
            </section>
            <Footer/>
         </main>
         
      )
   }
}

