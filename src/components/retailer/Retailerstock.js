import React, { Component,useState } from 'react';
import $ from "jquery";
import { ToastContainer } from "react-toastify";
import toast from "../helpers/toast";
import Httpconfig from '../helpers/HttpconfigRetailer';
import Constant from '../../constants';
import { MDBDataTable } from 'mdbreact';
import { Link } from "react-router-dom";
import RetailerCss from "../../public/css/retailer/retailer_style.css";
import RetailerHeader from "../retailer/RetailerHeader";
import RetailerSideMenu from "../retailer/RetailerSideMenu";
import Footer from "../patient/Patientfooter";
import { Multiselect } from "multiselect-react-dropdown";
import { reactLocalStorage } from 'reactjs-localstorage';
import ReactExport from "react-data-export";

const ExcelFile = ReactExport.ExcelFile;
const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;
const ExcelColumn = ReactExport.ExcelFile.ExcelColumn;

export default class Viewretailers extends Component {
   constructor(props) {
      super(props);
      this.state={
        fields: {},
        errors: {},
        availableHome:"nav-item nav-link active",
        runningHome:"nav-item nav-link",
        outHome:"nav-item nav-link",
        expireHome:"nav-item nav-link",
        orderHome:"nav-item nav-link order_book_item ord_med_btn",
    
        currentHomePanel:"tab-pane fade",
        availableHomePanel:"tab-pane fade",
        runningHomePanel:"tab-pane fade show",
        outHomePanel:"tab-pane fade",
        expireHomePanel:"tab-pane fade",
        selelcteMedicineId:"",
        medicineOptions:"",
        medicineArray: [],
        selectedMedicineList: {},
        selectedMedicineValue: [],
        addMedicineSection:"collapse-hide",
        requestbtn:"request_btn collapse-hide",
        updatebtn:"update_btn collapse-show",
        showfields:"col-md-12 collapse-show",
        finalOrder:"collapse-hide",
        retailerCurrentMedicineDetailsView:"",
        retailerLowStockCurrentMedicineDetailsView:"",
        retailerNoStockCurrentMedicineDetailsView:"",
        retailerExpiredStockCurrentMedicineDetailsView:"",
        retailerShortagebookProductsList:"",
        retailerFinalOrderMedicineDetailsView:"",
        shortageBookItemsCount:"0",

        totalAvailableStock:"0",
        totalLowStock:"0",
        totalOutofStock:"0",
        totalExpiredStock:"0",
        totalShortagebookStock:"0",
        showFinalOrderButton:"total_items collapse-hide",
        exportproductsarray:[],
        search:"",
        alphabetListView:"",
        searchType:"medicine_search",
        
      }
      this.fetchmedicinedata=this.fetchmedicinedata.bind(this);
      this.retailerProductsList=this.retailerProductsList.bind(this);
      this.retailerLowStockProductsList=this.retailerLowStockProductsList.bind(this);
      this.retailerExpiredStockProductsList=this.retailerExpiredStockProductsList.bind(this);
      this.retailerShortagebookProductsList=this.retailerShortagebookProductsList.bind(this);
      this.addFinalList=this.addFinalList.bind(this);
    
   }
   // To get detais after first render
   componentDidMount = () => {
    let userData=reactLocalStorage.getObject("retuserObj");
    if(userData){
        if(userData!=""){
            this.setState({
               retailerId:userData.retailer_id,
            }); 
            this.forceUpdate();
        }
        } else{
            window.location.href = "/login";
        }
        this.retailerProductsList(userData.retailer_id);
        this.getAllDashboardDetails(userData.retailer_id);
        this.alphabetList('available_home-li');
        
   }
// print alphabets 
alphabetList =(id)=>{
//var letters =[];
//letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const letters =[..."ABCDEFGHIJKLMNOPQRSTUVWXYZ"];
//$("#"+id).html("");
//console.log(letters);

const alphaDetailsView= letters.map((finalLoadedData,num)=>{ 
    return(
        <li class="alpha-list" id={finalLoadedData} onClick={this.searchProduct}>{finalLoadedData}</li>
       
    )
});
this.state.alphabetLists=alphaDetailsView;
// for (var i = 0;i<letters.length; i++) {
//   var nextChar = letters.charAt(i);
//   var letter = "<li>"+nextChar+"</li>";
  
//   $("#"+id).append(letter);

// }
}

   // Get the Stock Details
   getAllDashboardDetails=(retailerId)=>{
    
    Httpconfig.httptokenget(Constant.siteurl + "api/OM/retailerProduct/dashboardStockDetails/"+retailerId,)
       .then((response) => { 
         if(response.data.status=200){
            this.setState({
                totalAvailableStock:response.data.data[0].availiableStock,
                totalLowStock:response.data.data[0].runningLow,
                totalOutofStock:response.data.data[0].outOfStock,
                totalExpiredStock:response.data.data[0].expiredStock,
                totalShortagebookStock:response.data.data[0].orderBookedStock,
                
            })
            this.forceUpdate();
         }
        })
       .catch((error) => {
          toast.error(error);
       });
   }
//    Cliking on the tab
   handleClick=(event)=>{
    let id=event.currentTarget.id;
    let retailerId=this.state.retailerId;
    this.state.availableHome="nav-item nav-link ";
    this.state.runningHome="nav-item nav-link";
    this.state.outHome="nav-item nav-link";
    this.state.expireHome="nav-item nav-link";
    this.state.orderHome="nav-item nav-link order_book_item ord_med_btn";

    this.state.currentHomePanel="tab-pane fade";
    this.state.availableHomePanel="tab-pane fade";
    this.state.runningHomePanel="tab-pane fade show";
    this.state.outHomePanel="tab-pane fade";
    this.state.expireHomePanel="tab-pane fade";

    this.state.addMedicineSection="collapse-hide";
    this.state.otherSection='tab-content collapse-show';
    this.state.finalOrder="collapse-hide";

    if(id=='available_home-tab'){
        this.state.availableHome="nav-item nav-link active";
        this.state.availableHomePanel="tab-pane fade show active";
        this.retailerProductsList(retailerId);
        this.alphabetList('available_home-li');
        this.state.searchType="medicine_search";
    }
    if(id=='running_home-tab'){
        this.state.runningHome="nav-item nav-link active";
        this.state.runningHomePanel="tab-pane fade show active";
        this.retailerLowStockProductsList(retailerId);
        this.alphabetList('running_home-li');
        this.state.searchType="low_stock";
        
    }
    if(id=='Expire_home-tab'){
        this.state.expireHome="nav-item nav-link active";
        this.state.expireHomePanel="tab-pane fade show active";
        this.retailerExpiredStockProductsList(retailerId);
        this.alphabetList('Expire_home-li');
        this.state.searchType="expiry_stock";

    }
    if(id=='out_home-tab'){
        this.state.outHome="nav-item nav-link active";
        this.state.outHomePanel="tab-pane fade show active";
        this.retailerOutStockProductsList(retailerId);
        this.alphabetList('out_home-li');
        this.state.searchType="empty_stock";
    }
    
    if(id=='order_home-tab'){
        this.state.orderHome="nav-item nav-link order_book_item ord_med_btn active ";
        this.state.orderHomePanel="tab-pane fade show active";
        this.retailerShortagebookProductsList(retailerId);
        this.alphabetList('order_home-li');
    }
    
    this.forceUpdate();
}
// add medicine tabs show/hide
showAddMedicine=()=>{
    this.state.addMedicineSection="collapse-show";
    this.state.otherSection='tab-content collapse-hide';
    this.state.availableHome="nav-item nav-link ";
    this.state.runningHome="nav-item nav-link";
    this.state.outHome="nav-item nav-link";
    this.state.expireHome="nav-item nav-link";
    this.state.orderHome="nav-item nav-link order_book_item ord_med_btn";
    
}

//  fetch master medicine data on search
fetchmedicinedata(event) {
    let search=event.target.value;
    let medicinesList=[];
    this.state.requestbtn="request_btn collapse-hide";
    this.state.updatebtn="update_btn collapse-show";
    this.state.showfields="col-md-12 collapse-show";
    this.state.search=search;
    if(search!=""){
    Httpconfig.httptokenget(
      Constant.siteurl + "api/OM/retailerProduct/medicine/"+search
    ).then((response) => {
    if(Object.keys(response.data.data).length>0){
    const medicineDetailsView= response.data.data.map((finalLoadedData,num)=>{ 
        return(
            <li id={finalLoadedData.id} onClick={this.handleChange} >{finalLoadedData.medicineName}</li>
        )
    });
    this.state.medicineOptions=medicineDetailsView;
    this.forceUpdate();
}else{
    this.state.requestbtn="request_btn collapse-show";
    this.state.updatebtn="update_btn collapse-hide";
    this.state.showfields="col-md-12 collapse-hide";
    this.state.medicineOptions="";
    this.forceUpdate();

}
    });
    }else{
        this.state.medicineOptions="";
        this.forceUpdate();
    }
}
//  onchanges on master search
  handleChange = (event) => {
    let searched = event.currentTarget.id;
    let medicineName=event.currentTarget.innerText;
    this.state.selelcteMedicineId=searched;
    this.state.selelcteMedicineName=medicineName;
    this.state.medicineOptions="";
    $('#medicineList').val('');
    $('#medicineList').val(medicineName);
    this.forceUpdate();
  };

// input changes  handle
  
  handleChangeInput = (field, event) => {
     // alert(field);
    if(field=='expireDate'){
    let expDate=event.target.value;
    let count=expDate.search("-");
    if(count>0){
        let dateString=expDate.split("-");
        if(dateString[0].length!=4 ){
            toast.error("Invalid expired date");
            return;
        }
    }
    }
    let fields = this.state.fields;
    fields[field] = event.target.value;
    this.setState({ fields });
    this.state.errors[field]="";
  };

//  add medicine submit

  checkAddMedicineSubmit(event) {
    event.preventDefault();
    const { handle } = this.props.match.params;
    if (this.handleValidation() &&  handle == undefined) {
    this.AddMedicineDetails(event);
    } else {
    toast.warn("Form has errors.");
    }
  }

//  add medicine validation 

  handleValidation() {
    let fields = this.state.fields;
    let errors = {};
    let formIsValid = true;
    var pattern = /^[a-zA-Z0-9]{3,20}$/g;
    if (!fields["batchNumber"]) {
        errors["batchNumber"] = "";
        formIsValid = false;
        errors["batchNumber"] = "Enter batch number";
    }
    if (!fields["qty"]) {
        errors["qty"] = "";
        formIsValid = false;
        errors["qty"] = "Enter Quantity";
    }
    if (!fields["mrp"]) {
        errors["mrp"] = "";
        formIsValid = false;
        errors["mrp"] = "Enter MRP";
    }
    if (!fields["expireDate"]) {
        errors["expireDate"] = "";
        formIsValid = false;
        errors["expireDate"] = "Enter expiry date";
    }
    if (fields["expireDate"]!="") {
        let expDate=fields["expireDate"];
        //let count=expDate.match(/-/g);
        let count=expDate.match(/-/g);
        let error=0;
        let data="";
        
        if(count!=null){
            data=count.length;
        }
        
        if(data==2){
            let dateString=expDate.split("-");
            if(dateString[0].length!=4 ){
                error=error+1;
                
            }
            if(dateString[1].length>2){
                error=error+1;
            }
            if(dateString[1].length==0){
                error=error+1;
            }
            if(dateString[2].length>2){
                error=error+1;
            }
            if(dateString[2].length==0){
                error=error+1;
            }
            if(error>0){
                errors["expireDate"] = "Invalid expiry date";
            }
        }else{
            errors["expireDate"] = "Invalid expiry date";
        } 
    }
    if(this.state.selelcteMedicineId==""){
        errors["selectedMedicine"] = "";
        formIsValid = false;
        errors["selectedMedicine"] = "Select Medicine"; 

    }
    this.setState({ errors: errors });
    return formIsValid;

 }

 //  add medicine data

 AddMedicineDetails=()=>{

    Httpconfig.httptokenpost(Constant.siteurl + "api/OM/retailerProduct",
    
    {
        
        "retailer_id":this.state.retailerId,
        "medicine_id":this.state.selelcteMedicineId,
        "batch":this.state.fields['batchNumber'],
        "expiry_date":this.state.fields['expireDate'],
        "quantity":this.state.fields['qty'],
        "mrp":this.state.fields['mrp'],
        "discount":this.state.fields['discount'],
        "vat":"7",//this.state.fields['vat'],
        "commission":"0",
        "CGST":"0",
        "SGST":"0",
        "IGST":"0", 
      
    })
       .then((response) => { 
         if(response.data.status=200){
            document.getElementById("addMedicines").reset();
            toast.success(response.data.message);
         }
        })
       .catch((error) => {
          toast.error(error);
       });
    
 }

 //  clear all add medicine data

 clearAll=()=>{
    document.getElementById("addMedicines").reset();
 }

 clearSearch =()=>{
    $('#medicineList').val('');  
    this.state.selelcteMedicineId="";
    this.state.selelcteMedicineName=""; 
 }

//  preview shortage book data

 previewOrder=()=>{
     
    this.state.finalOrder="collapse-show";
    this.state.otherSection='tab-content collapse-hide';
    this.retailerFinalOrderDetails();
    this.forceUpdate();
 }

// Back show Order Book

showOrderBook=()=>{
    this.state.finalOrder="collapse-hide";
    this.state.otherSection='tab-content collapse-show';
    this.forceUpdate();

}

// final order details list

retailerFinalOrderDetails=()=>{
let retailerId=this.state.retailerId;
let finalorderarray=[];
    Httpconfig.httptokenget(Constant.siteurl + "api/OM/retailerProduct/retailer/finalorder/"+retailerId,)
       .then((response) => { 
         if(response.data.status=200){
                if(Object.keys(response.data.data).length>0){
                    const retailerFinalOrderMedicineDetailsView= response.data.data.map((finalLoadedData,num)=>{ 
                        finalorderarray.push({
                            name:finalLoadedData.products_master_tbl.medicinename,
                            manufacturer:finalLoadedData.products_master_tbl.manufacturer,
                            quantity:finalLoadedData.quantity,
                        })
                        return(
                            <div class="final_item">
                            <div class="row">
                                <div class="col-md-6">
                                    <div class="item_list">
                                <h4>{finalLoadedData.products_master_tbl.medicinename} {finalLoadedData.products_master_tbl.form}</h4>
                                <h6>{finalLoadedData.products_master_tbl.manufacturer}</h6>
                            </div>
                                </div>
                                <div class="col-md-6">
                                <div class="strip_list">
                                    <p>{finalLoadedData.quantity}</p>
                                </div>
                                </div>
                            </div>
                        </div>
                        )
                    })
                    
                    this.state.retailerFinalOrderMedicineDetailsView=retailerFinalOrderMedicineDetailsView;
                    this.state.finalorderarray=finalorderarray;
                    this.forceUpdate();
                }
         }
        })
       .catch((error) => {
          toast.error(error);
       });


}

// Retailers Mapped Products List

 retailerProductsList=(retailerId)=>{
    let rowspan="";
    let subCount=0;
    let count=0;
    let exportproductsarray=[];
    Httpconfig.httptokenget(Constant.siteurl + "api/OM/retailerProduct/retailer/"+retailerId, {
      })
       .then((response) => {
        if (response.status == 200) {
        if(Object.keys(response.data.data).length>0){
            const retailerCurrentMedicineDetailsView= response.data.data.map((finalLoadedData,num)=>{ 
           
                return(
                    <React.Fragment>
                
                     
                                                   
                                                   { Object.keys(finalLoadedData.retailer_stock_tbls).length>0 ?
                                                   
                                                    finalLoadedData.retailer_stock_tbls.map((subData,num)=>{
                                                        exportproductsarray.push({
                                                            medicine_id:finalLoadedData.medicine_id,
                                                            medicinename:finalLoadedData.products_master_tbl.medicinename,
                                                            manufacturer:finalLoadedData.products_master_tbl.manufacturer,
                                                            form:finalLoadedData.products_master_tbl.form,
                                                            batch:subData.batch,
                                                            expiry_date:subData.expiry_date,
                                                            discount:subData.discount,
                                                            mrp:subData.mrp,
                                                            available_quantity:subData.quantity,
                                                            vat:subData.vat,
                                                            productId:subData.product_id,
                                                        })
                                                       return(
                                                        
                                                        <React.Fragment>
                                                            
                                                     <tr class="stock_row"> 
                                                    {num==0 ?
                       
                       <td rowspan={num==1 ? "2" :""}>{finalLoadedData.products_master_tbl.medicinename}  <h6>{finalLoadedData.products_master_tbl.manufacturer}</h6></td>
                      : <td rowspan=""> </td>}
                                                    <td><input type="text" class="form-control stock_inp" defaultValue={subData.batch} id={"batch_"+subData.id+"-"+subData.medicine_id} onBlur={this.handleUpdate}/></td>
                                                    <td><input type="text" class="form-control stock_inp" defaultValue={subData.expiry_date} id={"expirydate_"+subData.id+"-"+subData.medicine_id} onBlur={this.handleUpdate}/></td>
                                                    <td><input type="text" class="form-control stock_inp" defaultValue={subData.vat} id={"vat_"+subData.id+"-"+subData.medicine_id} onBlur={this.handleUpdate}/></td>
                                                    <td><input type="text" class="form-control stock_inp" defaultValue={subData.quantity} id={"quantity_"+subData.id+"-"+subData.medicine_id} onBlur={this.handleUpdate}/>Strips { (subData.quantity)< 5 ? <img class="strip_down" src="https://i.pinimg.com/736x/9e/b6/0e/9eb60ee1602cb5370382c2582ee2d0d1.jpg"/>:""}</td> 
                                                    <td><input type="text" class="form-control stock_inp" defaultValue={subData.mrp} id={"mrp_"+subData.id+"-"+subData.medicine_id} onBlur={this.handleUpdate}/></td>
                                                    <td><input type="text" class="form-control stock_inp" defaultValue={subData.discount} id={"discount_"+subData.id+"-"+subData.medicine_id} onBlur={this.handleUpdate}/></td>
                                                    {num==0 ?
                                                    <td rowspan={num==1 ? "2" :""}  class="input_td"><input type="checkbox" name={"med"+subData.id} id={subData.medicine_id+","+"0"+","+subData.id} onChange={this.addShortage}/></td>
                                                    : <td></td>}  
                                                    <td> 
                                                        <div class="dropdown">
                                                            <img onclick="myFunction()" class="edit_icon " src="../images/retailer/dottedMenu.svg" />
                                                            <div class="dropdown-menu" aria-labelledby="dropdownMenuButton">
                                                                <a href="#" id={finalLoadedData.products_master_tbl.id} onClick={this.getProductDetailsbyId}><img src="../images/retailer/addNewbatch.svg" />Add Batch</a>
                                                                <a href="#" id={subData.id} onClick={this.deleteproduct.bind(this,subData.id,subData.medicine_id)}><img src="../images/retailer/delete.svg" />Delete</a>
                                                                
                                                            </div>
                                                          </div>
                                                    </td>
                                                    </tr>
                                                    </React.Fragment>
                                                    
                                                    )
                                                    }) :"" }
                </React.Fragment>
                )

            });
            this.state.retailerCurrentMedicineDetailsView=retailerCurrentMedicineDetailsView;
            this.state.exportproductsarray=exportproductsarray;
            this.forceUpdate();   
        }
    }
       })
       .catch((error) => {
         toast.error(error);
       });

 }
// Retailer Low stock Prodcuts List
 retailerLowStockProductsList=(retailerId)=>{
    Httpconfig.httptokenget(Constant.siteurl + "api/OM/retailerProduct/retailer/lowStock/"+retailerId, {
      })
       .then((response) => {
        if (response.status == 200) {
            
        if(Object.keys(response.data.data).length>0){
            const retailerLowStockCurrentMedicineDetailsView= response.data.data.map((finalLoadedData,num)=>{ 
                if(Object.keys(finalLoadedData.retailer_stock_tbls).length>0) {
                return(
                    
                    <React.Fragment>
                                                            { Object.keys(finalLoadedData.retailer_stock_tbls).length>0 ?
                                                    finalLoadedData.retailer_stock_tbls.map((subData,num)=>{
                                                        //alert(Object.keys(finalLoadedData.retailer_stock_tbls).length);
                                                       return(
                                                        <React.Fragment>
                                                             <tr class="stock_row"> 
                                                             {num==0 ?
                       
                       <td rowspan={num==1 ? "2" :""}>{finalLoadedData.products_master_tbl.medicinename}  <h6>{finalLoadedData.products_master_tbl.manufacturer}</h6></td>
                      : <td rowspan=""> </td>}
                                                    <td><p>{subData.batch}</p></td>
                                                    <td><p>{subData.expiry_date}</p></td>
                                                    <td><p>{subData.hsn ? subData.hsn : "---"}</p></td>
                                                    <td><p>{subData.quantity} Strips { (subData.quantity)< 5 ? <img class="strip_down" src="https://i.pinimg.com/736x/9e/b6/0e/9eb60ee1602cb5370382c2582ee2d0d1.jpg"/>:""}</p></td>
                                                    <td><p>₹ {subData.mrp}</p></td>
                                                    {num==0 ?
                                                    <td rowspan={num==1 ? "2" :""}  class="input_td"><input type="checkbox" name={"med"+subData.id} id={subData.medicine_id+","+"0"+","+subData.id} onChange={this.addShortage}/></td>
                                                    : <td></td>}  
                                                    <td>
                                                        <div class="dropdown">
                                                            <img onclick="myFunction()" class="edit_icon " src="../images/retailer/dottedMenu.svg" />
                                                            <div class="dropdown-menu" aria-labelledby="dropdownMenuButton">
                                                                
                                                                <a href="#" id={subData.id} onClick={this.editproduct}><img src="../images/retailer/edit.svg" />Edit</a>
                                                                <a href="#" id={subData.medicine_id} onClick={this.deleteproduct}><img src="../images/retailer/delete.svg" />Delete</a>
                                                            </div>
                                                          </div>
                                                    </td>
                                                    </tr>
                                                    </React.Fragment>
                                                    
                                                    )
                                                    }) : "" }
                </React.Fragment>
                )
            }

            });
            this.state.retailerLowStockCurrentMedicineDetailsView=retailerLowStockCurrentMedicineDetailsView;
            //console.log(retailerLowStockCurrentMedicineDetailsView);
            this.forceUpdate();   
        }else{
            this.state.retailerLowStockCurrentMedicineDetailsView="";
        }
    }
       })
       .catch((error) => {
         toast.error(error);
       });

 }
 // Retailer Expire stock Prodcuts List
 retailerExpiredStockProductsList=(retailerId)=>{
    Httpconfig.httptokenget(Constant.siteurl + "api/OM/retailerProduct/retailer/expiryStock/"+retailerId, {
      })
       .then((response) => {
        if (response.status == 200) {
        if(Object.keys(response.data.data).length>0){
            const retailerExpireStockCurrentMedicineDetailsView= response.data.data.map((finalLoadedData,num)=>{ 
                return(
                    <React.Fragment>
                       { Object.keys(finalLoadedData.retailer_stock_tbls).length>0 ?
                                                    finalLoadedData.retailer_stock_tbls.map((subData,num)=>{
                                                    return(
                                                        <React.Fragment>
                                                    <tr class="stock_row"> 
                                                             {num==0 ?
                       
                       <td rowspan={num==1 ? "2" :""}>{finalLoadedData.products_master_tbl.medicinename}  <h6>{finalLoadedData.products_master_tbl.manufacturer}</h6></td>
                      : <td rowspan=""> </td>}
                                                    <td><p>{subData.batch}</p></td>
                                                    <td><p>{subData.expiry_date}</p></td>
                                                    <td><p>{subData.hsn ? subData.hsn : "---"}</p></td>
                                                    <td><p>{subData.quantity} Strips { (subData.quantity)< 5 ? <img class="strip_down" src="https://i.pinimg.com/736x/9e/b6/0e/9eb60ee1602cb5370382c2582ee2d0d1.jpg"/>:""}</p></td>
                                                    <td><p>₹ {subData.mrp}</p></td>
                                                    {num==0 ?
                                                    <td rowspan={num==1 ? "2" :""}  class="input_td"><input type="checkbox" name={"med"+subData.id} id={subData.medicine_id+","+"0"+","+subData.id} onChange={this.addShortage}/> <a href="#"><img class="return_icon" src="../images/retailer/return.svg" /></a></td>
                                                    : <td></td>} 
                                                    {/* <td>
                                                        <div class="dropdown">
                                                            <img onclick="myFunction()" class="edit_icon " src="https://cdn4.iconfinder.com/data/icons/text-editor/154/additional-vertical-menu-dots-512.png" />
                                                            <div class="dropdown-menu" aria-labelledby="dropdownMenuButton">
                                                                <a href="#" id={subData.id} onClick={this.editproduct}><img src="https://cdn4.iconfinder.com/data/icons/text-editor/154/additional-vertical-menu-dots-512.png" />Edit</a>
                                                                <a href="#" id={subData.medicine_id} onClick={this.deleteproduct}><img src="https://cdn4.iconfinder.com/data/icons/text-editor/154/additional-vertical-menu-dots-512.png" />Delete</a>
                                                            </div>
                                                          </div>
                                                    </td> */}
                                                    </tr>
                                                    </React.Fragment>
                                                    )
                                                    }) :"" }
                </React.Fragment>
                )

            });
            this.state.retailerExpireStockCurrentMedicineDetailsView=retailerExpireStockCurrentMedicineDetailsView;
            this.forceUpdate();   
        }
    }
       })
       .catch((error) => {
         toast.error(error);
       });

 }
// Retailer out of stock products list
 retailerOutStockProductsList=(retailerId)=>{
    Httpconfig.httptokenget(Constant.siteurl + "api/OM/retailerProduct/retailer/emptyStock/"+retailerId, {
      })
       .then((response) => {
        if (response.status == 200) {
        if(Object.keys(response.data.data).length>0){
            const retailerOutStockCurrentMedicineDetailsView= response.data.data.map((finalLoadedData,num)=>{ 
                return(
                    <React.Fragment>

                                                   { Object.keys(finalLoadedData.retailer_stock_tbls).length>0 ?
                                                    finalLoadedData.retailer_stock_tbls.map((subData,num)=>{
                                                       // alert(Object.keys(finalLoadedData.retailer_stock_tbls).length);
                                                       return(
                                                        <React.Fragment>
                                                             <tr class="stock_row"> 
                                                             {num==0 ?
                       
                       <td rowspan={num==1 ? "2" :""}>{finalLoadedData.products_master_tbl.medicinename}  <h6>{finalLoadedData.products_master_tbl.manufacturer}</h6></td>
                      : <td rowspan=""> </td>}
                                                    <td><p>{subData.batch}</p></td>
                                                    <td><p>{subData.expiry_date}</p></td>
                                                    <td><p>{subData.hsn ? subData.hsn : "---"}</p></td>
                                                    <td><p>{subData.quantity} Strips { (subData.quantity)< 5 ? <img class="strip_down" src="https://i.pinimg.com/736x/9e/b6/0e/9eb60ee1602cb5370382c2582ee2d0d1.jpg"/>:""}</p></td>
                                                    <td><p>₹ {subData.mrp}</p></td>
                                                    {num==0 ?
                                                    <td rowspan={num==1 ? "2" :""}  class="input_td"><input type="checkbox" name={"med"+subData.id} id={subData.medicine_id+","+"0"+","+subData.id} onChange={this.addShortage}/></td>
                                                    : <td></td>} 
                                                    <td>
                                                        <div class="dropdown">
                                                            <img onclick="myFunction()" class="edit_icon " src="../images/retailer/dottedMenu.svg" />
                                                            <div class="dropdown-menu" aria-labelledby="dropdownMenuButton">
                                                               
                                                                <a href="#" id={subData.id} onClick={this.editproduct}><img src="../images/retailer/edit.svg" />Edit</a>
                                                                <a href="#" id={subData.medicine_id} onClick={this.deleteproduct}><img src="../images/retailer/delete.svg" />Delete</a>
                                                            </div>
                                                          </div>
                                                    </td>
                                                    </tr>
                                                    </React.Fragment>
                                                    )
                                                    }) :"" }
               </React.Fragment>
                )

            });
            this.state.retailerNoStockCurrentMedicineDetailsView=retailerOutStockCurrentMedicineDetailsView;
            this.forceUpdate();   
        }
    }
       })
       .catch((error) => {
         toast.error(error);
       });

 }
// search products of retailer
 searchProduct=(event)=>{
    // alert(event.target.value);
     //alert(event.target.id);
    let searchString=event.target.value;
    let retailerId=this.state.retailerId;
    let searchType=this.state.searchType;

    if(event.target.value===0 && event.target.id!=""){
        searchString=event.target.id; 
        $('.alpha-list').removeClass('active');
        $('#'+searchString).addClass('active');
    }
    if(searchString!=""){
     
    // Httpconfig.httptokenget(Constant.siteurl + "api/OM/retailerProduct/search/"+retailerId+"/"+searchString, {
    // })
    Httpconfig.httptokenpost(Constant.siteurl + "api/OM/retailerProduct/search", {
        "retailerId":retailerId,"search_type":searchType,"medicineName":searchString
    })
     .then((response) => {
      if (response.status == 200) {
      if(Object.keys(response.data.data).length>0){
        //   const retailerCurrentMedicineDetailsView= response.data.data.map((finalLoadedData,num)=>{ 
        //       return(
        //        <tr class="stock_row">
        //                                           <td rowspan="2">{finalLoadedData.medicinename}  <h6>{finalLoadedData.manufacturer}</h6></td>
        //                                          { Object.keys(finalLoadedData.retailer_stock_tbls).length>0 ?
        //                                           finalLoadedData.retailer_stock_tbls.map((subData,num)=>{
        //                                              return(
        //                                                 <React.Fragment>
        //                                           <td><p>{subData.batch}</p></td>
        //                                           <td><p>{subData.expiry_date}</p></td>
        //                                           <td><p>{subData.hsn ? subData.hsn : "---"}</p></td>
        //                                           <td><p>{subData.quantity} Strips { (subData.quantity)< 5 ? <img class="strip_down" src="https://i.pinimg.com/736x/9e/b6/0e/9eb60ee1602cb5370382c2582ee2d0d1.jpg"/>:""}</p></td>
        //                                           <td><p>₹ {subData.mrp}</p></td>
        //                                           {num==0 ?
        //                                           <td rowspan="2" class="input_td"><input type="checkbox"/></td>
        //                                           :  <td rowspan="2" class="input_td"></td> }
        //                                           <td>
        //                                               <div class="dropdown">
        //                                                   <img onclick="myFunction()" class="edit_icon " src="https://cdn4.iconfinder.com/data/icons/text-editor/154/additional-vertical-menu-dots-512.png" />
        //                                                   <div class="dropdown-menu" aria-labelledby="dropdownMenuButton">
                                                              
        //                                                       <a href="#" id={subData.id} onClick={this.editproduct}><img src="https://cdn4.iconfinder.com/data/icons/text-editor/154/additional-vertical-menu-dots-512.png" />Edit</a>
        //                                                       <a href="#" id={subData.medicine_id} onClick={this.deleteproduct.bind(this,subData.id,subData.medicine_id)}><img src="https://cdn4.iconfinder.com/data/icons/text-editor/154/additional-vertical-menu-dots-512.png" />Delete</a>
        //                                                   </div>
        //                                                 </div>
        //                                           </td>
        //                                           </React.Fragment>
        //                                           )
        //                                           }) :"" }
        //       </tr>
        //       )

        //   });
        const retailerCurrentMedicineDetailsView= response.data.data.map((finalLoadedData,num)=>{ 
            return(
                <React.Fragment>

                                               { Object.keys(finalLoadedData.retailer_stock_tbls).length>0 ?
                                                finalLoadedData.retailer_stock_tbls.map((subData,num)=>{
                                                   // alert(Object.keys(finalLoadedData.retailer_stock_tbls).length);
                                                   return(
                                                    <React.Fragment>
                                                         <tr class="stock_row"> 
                                                         {num==0 ?
                   
                   <td rowspan={num==1 ? "2" :""}>{finalLoadedData.medicinename}  <h6>{finalLoadedData.manufacturer}</h6></td>
                  : <td rowspan=""> </td>}
                                                <td><p>{subData.batch}</p></td>
                                                <td><p>{subData.expiry_date}</p></td>
                                                <td><p>{subData.hsn ? subData.hsn : "---"}</p></td>
                                                <td><p>{subData.quantity} Strips { (subData.quantity)< 5 ? <img class="strip_down" src="https://i.pinimg.com/736x/9e/b6/0e/9eb60ee1602cb5370382c2582ee2d0d1.jpg"/>:""}</p></td>
                                                <td><p>₹ {subData.mrp}</p></td>
                                                {num==0 ?
                                                <td rowspan={num==1 ? "2" :""}  class="input_td"><input type="checkbox" name={"med"+subData.id} id={subData.medicine_id+","+"0"+","+subData.id} onChange={this.addShortage}/></td>
                                                : <td></td>} 
                                                <td>
                                                    <div class="dropdown">
                                                        <img onclick="myFunction()" class="edit_icon " src="../images/retailer/dottedMenu.svg" />
                                                        <div class="dropdown-menu" aria-labelledby="dropdownMenuButton">
                                                           
                                                            <a href="#" id={subData.id} onClick={this.editproduct}><img src="../images/retailer/edit.svg" />Edit</a>
                                                            <a href="#" id={subData.medicine_id} onClick={this.deleteproduct}><img src="../images/retailer/delete.svg" />Delete</a>
                                                        </div>
                                                      </div>
                                                </td>
                                                </tr>
                                                </React.Fragment>
                                                )
                                                }) :"" }
           </React.Fragment>
            )

        });
          if( this.state.availableHome=="nav-item nav-link active"){
            this.state.retailerCurrentMedicineDetailsView=retailerCurrentMedicineDetailsView;
            this.forceUpdate();   
          }
          if( this.state.runningHome=="nav-item nav-link active"){
            this.state.retailerLowStockCurrentMedicineDetailsView=retailerCurrentMedicineDetailsView;
            this.forceUpdate();   
          }
          if( this.state.expireHome=="nav-item nav-link active"){
            this.state.retailerExpireStockCurrentMedicineDetailsView=retailerCurrentMedicineDetailsView;
            this.forceUpdate();   
          }
          if( this.state.outHome=="nav-item nav-link active"){
            this.state.retailerOutStockCurrentMedicineDetailsView=retailerCurrentMedicineDetailsView;
            this.forceUpdate();   
          }
      }else{
         if( this.state.availableHome=="nav-item nav-link active"){
            this.state.retailerCurrentMedicineDetailsView="No Results found";
            this.forceUpdate();   
          }
          if( this.state.runningHome=="nav-item nav-link active"){
            this.state.retailerLowStockCurrentMedicineDetailsView="No Results found";
            this.forceUpdate();   
          }
          if( this.state.expireHome=="nav-item nav-link active"){
            this.state.retailerExpireStockCurrentMedicineDetailsView="No Results found";
            this.forceUpdate();   
          }
          if( this.state.outHome=="nav-item nav-link active"){
            this.state.retailerOutStockCurrentMedicineDetailsView="No Results found";
            this.forceUpdate();   
          }  
      }
  }
     })
     .catch((error) => {
       toast.error(error);
     });
    }else{
          if( this.state.availableHome=="nav-item nav-link active"){
            this.retailerProductsList(retailerId);
          }
          if( this.state.runningHome=="nav-item nav-link active"){
            this.retailerLowStockProductsList(retailerId);
          }
          if( this.state.expireHome=="nav-item nav-link active"){
            this.retailerExpiredStockProductsList(retailerId);
          }
          if( this.state.outHome=="nav-item nav-link active"){
            this.retailerOutStockProductsList(retailerId);
          } 
    }
 }

 showUpload=()=>{
    window.location.href = "./Retaileruploadstock";
 }
// delete products stock

deleteproduct=(productId,medicineId)=>{
//let productId=event.currentTarget.id;
let retailerId=this.state.retailerId;
Httpconfig.httptokendelete(Constant.siteurl + "api/OM/retailerProduct/"+retailerId+"/"+medicineId+"/"+productId,
    {
    })
       .then((response) => { 
         if(response.data.status=200){
            toast.success(response.data.message);
            if( this.state.availableHome=="nav-item nav-link active"){
                this.retailerProductsList(retailerId);
              }
              if( this.state.runningHome=="nav-item nav-link active"){
                this.retailerLowStockProductsList(retailerId);
              }
              if( this.state.expireHome=="nav-item nav-link active"){
                this.retailerExpiredStockProductsList(retailerId);
              }
              if( this.state.outHome=="nav-item nav-link active"){
                this.retailerOutStockProductsList(retailerId);
              } 
         }
        })
       .catch((error) => {
          toast.error(error);
       });
}
// Add medinces to Shortage book
addShortage=(event)=>{
    let retailerId=this.state.retailerId;
    let data=event.currentTarget.id;
    let result=data.split(",");
    let medicineId=result[0];
    let id=result[2];
    let qty=result[1];
    if(document.getElementById(event.currentTarget.id).checked==true){
    
    Httpconfig.httptokenpost(Constant.siteurl + "api/OM/retailerProduct/retailer/shortageBook",
    {
        "retailer_id":retailerId,
        "medicine_id":medicineId,
        "quantity":qty,
    })
       .then((response) => { 
         if(response.data.status==200){
            toast.success(response.data.message);
         }
         if(response.data.status==204){
            toast.error(response.data.message);
            document.getElementById(data).checked=false;
         }
        })
       .catch((error) => {
          toast.error(error);
       });
    }else{
        Httpconfig.httptokendelete(Constant.siteurl + "api/OM/retailerProduct/retailer/shortageBook/"+id,)
           .then((response) => { 
             if(response.data.status=200){
                
                toast.success(response.data.message);
             }
            })
           .catch((error) => {
              toast.error(error);
           });

    }

}
retailerShortagebookProductsList =(retailerId)=>{
    Httpconfig.httptokenget(Constant.siteurl + "api/OM/retailerProduct/shortageBook/retailer/"+retailerId,)
    .then((response) => { 
      if(response.data.status=200){
let shortageBookItemsCount=Object.keys(response.data.data).length;
            if(Object.keys(response.data.data).length>0){
                
                const retailerStortagebookMedicineDetailsView= response.data.data.map((finalLoadedData,num)=>{ 
                    return(
                        <tr>
                            <td>{finalLoadedData.products_master_tbl.medicinename} <h6>{finalLoadedData.products_master_tbl.manufacturer}</h6></td>
                            <td> 
                                <div class="qty">
                                    <span class="minus bg-dark" id={finalLoadedData.id+"-"+finalLoadedData.products_master_tbl.id} onClick={this.qtyDecrement}>-</span>
                                    <input type="number" class="count" name="qty" value={finalLoadedData.quantity ? finalLoadedData.quantity : "0" } id={"txt-"+finalLoadedData.products_master_tbl.id} onKeyUp={this.updateQty}/>
                                    <span class="plus bg-dark" id={finalLoadedData.id+"-"+finalLoadedData.products_master_tbl.id} onClick={this.qtyIncrement}>+</span>
                                </div>
                            </td>
                            <td><input type="checkbox" name={finalLoadedData.products_master_tbl.id} id={"shrt-"+finalLoadedData.products_master_tbl.id} onChange={this.addFinalList}/> Add</td>
                            <td class="delete_txt"><img src="../images/retailer/RedDeleteMedicine.svg" id={finalLoadedData.medicine_id} onClick={this.deleteShortageBook} /> Delete</td>
                        </tr>
                    )
                })
                this.state.retailerShortagebookProductsList=retailerStortagebookMedicineDetailsView;
                this.state.shortageBookItemsCount=shortageBookItemsCount;
                this.state.showFinalOrderButton="total_items collapse-show";
                this.forceUpdate();
            }else{
                this.state.retailerShortagebookProductsList="";
                this.state.shortageBookItemsCount="0";
                this.state.showFinalOrderButton="total_items collapse-hide";
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
    //let id=event.currentTarget.id;
    let data=event.currentTarget.id.split("-");
    let id=data[0];
    let medicineId=data[1];
    let qty=$('#txt-'+medicineId).val();
    //alert("in");
    
    if(qty>0){
        qty=qty-1;
        $('#txt-'+medicineId).val(qty);
        this.updateShortagebookQuantity(id,medicineId,qty);
    }
    //alert(qty);

}

// shortage book quanatity Increment
qtyIncrement=(event)=>{
    //let id=event.currentTarget.id;
    let data=event.currentTarget.id.split("-");
    let id=data[0];
    let medicineId=data[1];
    let qty=$('#txt-'+medicineId).val();
    //alert("in");
    
    if(qty>=0){
        qty=parseInt(qty)+1;
        $('#txt-'+medicineId).val(qty);
        this.updateShortagebookQuantity(id,medicineId,qty);
    }

}

// shortage book quanatity enter
updateQty=(event)=>{
    //alert(event.target.value);
    let data=event.currentTarget.id.split("-");
    let id=data[1];
    let qty=event.target.value;
   // this.updateShortagebookQuantity(id,qty);

}

// add shortage book to final order list

addFinalList=(event)=>{
    
    let data=event.currentTarget.id.split("-");
    let id=data[1];
    if(document.getElementById(event.currentTarget.id).checked==true){
    let qty=$('#txt-'+id).val();
        if(qty==0){
            document.getElementById(event.currentTarget.id).checked=false;
            toast.error("Quantity should not be zero");
        }else{
            this.updateFinalOrder(id,qty);
        }
    }else{
        alert("out");
    }
}

// add/update to theShortage book list
updateShortagebookQuantity=(id,medicineid,qty)=>{
    let retailerId=this.state.retailerId;
    Httpconfig.httptokenput(Constant.siteurl + "api/OM/retailerProduct/retailer/shortageBook/"+id,{
        
            retailer_id:retailerId,
            medicineid:medicineid,
            quantity:qty,
        
    })
    .then((response) => { 
      if(response.data.status=200){

      }
     })
    .catch((error) => {
       toast.error(error);
    });
}

// add/update to the final order list
updateFinalOrder=(medicineid,qty)=>{
    let retailerId=this.state.retailerId;
    Httpconfig.httptokenpost(Constant.siteurl + "api/OM/retailerProduct/retailer/finalorder",{
        "finalorder":[{
            retailer_id:retailerId, 
            medicine_id:medicineid,
            quantity:qty,
        },]
    })
    .then((response) => { 
      if(response.data.status=200){

      }
     })
    .catch((error) => {
       toast.error(error);
    });
}

// delte item from shortage book

deleteShortageBook=(event)=>{

    let id=event.currentTarget.id;
    Httpconfig.httptokendelete(Constant.siteurl + "api/OM/retailerProduct/retailer/shortageBook/"+this.state.retailerId+"/"+id,)
    .then((response) => { 
      if(response.data.status=200){
          this.retailerShortagebookProductsList(this.state.retailerId);
        toast.success(response.data.message);
      }
     })
    .catch((error) => {
       toast.error(error);
    });

}

//Order all products to shortage book

orderAllShortageBook=(event)=>{
    if(document.getElementById(event.currentTarget.id).checked==true){
        Httpconfig.httptokenpost(Constant.siteurl + "api/OM/retailerProduct/shortageBook/orderAll/retailer",{
            "retailer_id":this.state.retailerId,
        })
        .then((response) => { 
          if(response.data.status=200){
            //  this.retailerShortagebookProductsList(this.state.retailerId);
            toast.success(response.data.message);
          }
         })
        .catch((error) => {
           toast.error(error);
        });
    }else{
        Httpconfig.httptokendelete(Constant.siteurl + "api/OM/retailerProduct/deleteAllShortageBookFinalOrder/"+this.state.retailerId,)
    .then((response) => { 
      if(response.data.status=200){
          this.retailerShortagebookProductsList(this.state.retailerId);
        toast.success(response.data.message);
      }
     })
    .catch((error) => {
       toast.error(error);
    });
  }
}

// delete all items in the shortage book

deleteAllShortageBook =()=>{
    Httpconfig.httptokendelete(Constant.siteurl + "api/OM/retailerProduct/deleteAllShortageBookFinalOrder/"+this.state.retailerId,)
    .then((response) => { 
      if(response.data.status=200){
          this.retailerShortagebookProductsList(this.state.retailerId);
        toast.success(response.data.message);
      }
     })
    .catch((error) => {
       toast.error(error);
    });
}

// print shortage book div

printDiv=()=>{

var printContents = document.getElementById('final_ord_details').innerHTML;
			var originalContents = document.body.innerHTML;
			document.body.innerHTML = printContents;
			window.print();
			document.body.innerHTML = originalContents;

}

// add Product request
addProductRequest =()=>{

    let fields = this.state.fields;
    let errors = {};
    let formIsValid = true;
    
    if (!fields["manufacturer"]) {
        errors["manufacturer"] = "";
        formIsValid = false;
        errors["manufacturer"] = "Enter manufacturer name";
    }
    if (!fields["UOM"]) {
        errors["UOM"] = "";
        formIsValid = false;
        errors["UOM"] = "Enter Unit of Measurment";
    }
    // if (!fields["mrp"]) {
    //     errors["mrp"] = "";
    //     formIsValid = false;
    //     errors["mrp"] = "Enter MRP";
    // }
   
     this.setState({ errors: errors });
     if(formIsValid==true){

    Httpconfig.httptokenpost(Constant.siteurl + "api/OM/productRequest",
    {
        "clinic_id":"",
        "medicineid":"",
        "medicine_name":this.state.search,
        "medicine_main":fields["manufacturer"],
        "medicine_type":"",
        "uom":fields["UOM"],
        "description":"",
        "compositions":"",
        "retailer":this.state.retailerId,
    })
    .then((response) => { 
      if(response.data.status=200){
         // this.retailerShortagebookProductsList(this.state.retailerId);
        toast.success(response.data.message);
      }
     })
    .catch((error) => {
       toast.error(error);
    });
}else{
    toast.error("forms has erros");
}


}

//inline update the prodcuts,stock

handleUpdate=(event)=>{
let clickedId=event.currentTarget.id;
let ids=clickedId.split("_");
let batch=document.getElementById("batch_"+ids[1]).value;
let expiry_date=document.getElementById("expirydate_"+ids[1]).value;
let vat=document.getElementById("vat_"+ids[1]).value;
let quantity=document.getElementById("quantity_"+ids[1]).value;
let mrp=document.getElementById("mrp_"+ids[1]).value;
let discount=document.getElementById("discount_"+ids[1]).value;

let idData=ids[1].split("-");
let medicineId=idData[1];
let id=idData[0];

Httpconfig.httptokenput(Constant.siteurl + "api/OM/retailerProduct/stock/"+id,
{
    "retailer_id":this.state.retailerId,
    "medicine_id":medicineId,
    "batch":batch,
    "expiry_date":expiry_date,
    "quantity":quantity,
    "mrp":mrp,
    "discount":discount,
    "vat":vat,
    "commission":"0",
    "CGST":"0",
    "SGST":"0",
    "IGST":"0",
    }
)
    .then((response) => { 
      if(response.data.status=200){
         // this.retailerShortagebookProductsList(this.state.retailerId);
        //toast.success(response.data.message);
      }
     })
    .catch((error) => {
       toast.error(error);
    });


}
//Get Product details by Id
// editproduct=()=>{
    

//  } 

getProductDetailsbyId=(event)=>{
    let medicineId=event.currentTarget.id;
    this.state.selelcteMedicineId=medicineId;
    
Httpconfig.httptokenget(Constant.siteurl + "api/OM/retailerProduct/"+medicineId,)
    .then((response) => { 
      if(response.data.status=200){
        this.showAddMedicine(); 
         // alert(response.data.data[0].products_master_tbl.medicinename);
         let medicineName=response.data.data[0].products_master_tbl.medicinename;
         let manufacturer=response.data.data[0].products_master_tbl.manufacturer;
         let form=response.data.data[0].products_master_tbl.form;
         $('#medicineList').val(medicineName+" | "+form+" | "+manufacturer);
         
         

      }
     })
    .catch((error) => {
       toast.error(error);
    });


}
handleAll=(event)=>{
    let searchString=event.currentTarget.id;
    $('.alpha-list').removeClass('active');
    $('#'+searchString).addClass('active');
    this.retailerProductsList(this.state.retailerId);
    
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
                <section class="manage_section" >
                    <div class="container">
                       
                        <div class="row">
                            <div class="col-md-12">
                                <nav class="p_nav">
                                    <div class="nav nav-tabs nav-fill" id="nav-tab" role="tablist">
                                        <a class={ this.state.availableHome} id="available_home-tab" data-toggle="tab" href="#available_home" role="tab" aria-controls="available-home" aria-selected="true" onClick={this.handleClick}>Total Available in stock<p>{this.state.totalAvailableStock}</p></a>
                                        <a class={this.state.runningHome} id="running_home-tab" data-toggle="tab" href="#running_home" role="tab" aria-controls="running_home" aria-selected="false" onClick={this.handleClick}>Running Low<p>{this.state.totalLowStock}</p></a>
                                        <a class={this.state.outHome} id="out_home-tab" data-toggle="tab" href="#out_home" role="tab" aria-controls="out_home" aria-selected="false" onClick={this.handleClick}>Out of Stock <p>{this.state.totalOutofStock}</p></a>
                                        <a class={this.state.expireHome} id="Expire_home-tab" data-toggle="tab" href="#expire_home" role="tab" aria-controls="expire_home" aria-selected="false" onClick={this.handleClick}>Expired <p>{this.state.totalExpiredStock}</p></a>
                                        {/* <a class={this.state.orderHome} id="order_home-tab" data-toggle="tab" href="#order_home" role="tab" aria-controls="order_home" aria-selected="false" onClick={this.handleClick}>Order <br/>Book <h5>{this.state.totalShortagebookStock} added</h5></a> */}
                                           <div class={this.state.orderHome} id="order_home-tab" data-toggle="tab" href="#order_home" role="tab" aria-controls="order_home" aria-selected="false" onClick={this.handleClick}>
                                           <a href="#"><div class="ord_field" > <img src="../images/retailer/OrderBook.svg" /><p><span >{this.state.totalShortagebookStock} added</span> Order Book</p></div></a>   
                                           </div>
                                        <div class="add_med_btn">
                                       
                                         <a href="#"><button type="button" onClick={this.showAddMedicine}> <img src="../images/retailer/AddNewMedicine.svg" /> Add New Medicine</button></a>   
                                        </div>
                                    </div>
                                   
                                </nav>
                                <div id="bottom-section" class={this.state.otherSection}>
                            <div class="row">
                                <div class="col-md-12">
                                    <div class="manage_search">
                                        <div class="input-group col-md-8">
                                            <input type="text" class="form-control" placeholder="Search medicine by name"  onKeyUp={this.searchProduct}/>
                                            <div class="input-group-btn">
                                                <div class="btn-group" role="group">
                                                    <button class="btn btn-default">
                                                  <img src="../images/retailer/search.svg" />
                                                  </button>

                                                </div>
                                            </div>
                                        </div>
                                        <div class="col-md-4 download_xls">
                                            <a href="#"><p > <img src="../images/retailer/download.svg" />Download XLS</p></a> 
                                        </div>
                                </div>
                            </div>
                        </div>
                                <div class="tab-content" id="nav-tabContent">
                                    <div class="tab-pane fade show active" id="available_home" role="tabpanel" aria-labelledby="available_home-tab">
                                    <div class="container">
                                        <div class="row stock_body">
                                    <div class="col-md-1 no_padding">
                                               <div class="index_box">
                                                   <div class="index_head">
                                                       <h2>Index</h2>
                                                   </div>
                                                   <ul>
                                                       <li class="alpha-list active" id="all" onClick={this.handleAll} >All</li>
                                                       
                                                       <li id="available_home-li">
                                                       {this.state.alphabetLists}
                                                       </li>
                                                       
                                                       
                                                   </ul>
                                               </div>
                                           </div>
                                           
                                           <div class="col-md-11 no_padding">
                                        <div class="">
                                            <table>
                                                <thead>
                                                    <tr>
                                                       
                                                        <th>Medicine name</th>
                                                        <th>Batch</th>
                                                        <th>Expiry Date</th>
                                                        <th>VAT</th>
                                                        <th>Current Stock</th>
                                                        <th>Price</th>
                                                        <th>Discount</th>
                                                        <th>Reorder</th>
                                                        <th></th>
                                                       
                                                    </tr>
                                                </thead>
                                              <tbody >
                                                  {this.state.retailerCurrentMedicineDetailsView}
                                             
                                              </tbody>
                                            </table>
                                          </div>
                                      </div>
                                      </div>
                                      </div>
                                    </div>
                                    <div class="tab-pane fade" id="running_home" role="tabpanel" aria-labelledby="running_home-tab">
                                    <div class="container">
                                        <div class="row  stock_body">
                                    <div class="col-md-1 no_padding">
                                               <div class="index_box">
                                                   <div class="index_head">
                                                       <h2>Index</h2>
                                                   </div>
                                                   <ul>
                                                       <li class="active">All</li>
                                                       <li id="running_home-li" >
                                                       {this.state.alphabetLists}
                                                       </li>
                                                   </ul>
                                               </div>
                                           </div>
                                           <div class="col-md-11 no_padding">
                                        <div class="">
                                            <table>
                                                <thead>
                                                    <tr>
                                                     
                                                        <th>Customer</th>
                                                        <th>Batch</th>
                                                        <th>Expiry Date</th>
                                                        <th>VAT</th>
                                                        <th>Current Stock</th>
                                                        <th>Price</th>
                                                        <th class="input_td">Reorder</th>
                                                        <th></th>
                                                       
                                                    </tr>
                                                </thead>
                                              <tbody >
                                                  {this.state.retailerLowStockCurrentMedicineDetailsView ? this.state.retailerLowStockCurrentMedicineDetailsView : <React.Fragment><td></td><td></td><td></td><td>No Products</td><td></td><td></td><td></td></React.Fragment>}
                                              
                                       
                                              </tbody>
                                            </table>
                                          </div>
                                          </div>
                                          </div>
                                          </div>
                                   
                                    </div>
                                    <div class="tab-pane fade" id="out_home" role="tabpanel" aria-labelledby="out_home-tab">
                                 
                                    <div class="container">
                                        <div class="row  stock_body">
                                           <div class="col-md-1 no_padding">
                                               <div class="index_box">
                                                   <div class="index_head">
                                                       <h2>Index</h2>
                                                   </div>
                                                   <ul>
                                                       <li class="active">All</li>
                                                       <li id="out_home-li" >
                                                       {this.state.alphabetLists}
                                                       </li>
                                                   </ul>
                                               </div>
                                           </div>
                                           <div class="col-md-11 no_padding">
                                        <div class="">
                                            <table>
                                                <thead>
                                                    <tr>
                                                      
                                                        <th>Customer</th>
                                                        <th>Batch</th>
                                                        <th>Expiry Date</th>
                                                        <th>VAT</th>
                                                        <th>Current Stock</th>
                                                        <th>Price</th>
                                                        <th>Reorder</th>
                                                        <th></th>
                                                       
                                                    </tr>
                                                </thead>
                                              <tbody >
                                                  {this.state.retailerNoStockCurrentMedicineDetailsView ? this.state.retailerNoStockCurrentMedicineDetailsView : " No results found"  }
                                              
                                       
                                              </tbody>
                                            </table>
                                          </div>
                                          </div>
                                          </div>
                                          </div>
                                    </div>
                                    <div class="tab-pane fade" id="expire_home" role="tabpanel" aria-labelledby="order_home-tab">
                                    <div class="container">
                                        <div class="row  stock_body">
                                    <div class="col-md-1 no_padding">
                                               <div class="index_box">
                                                   <div class="index_head">
                                                       <h2>Index</h2>
                                                   </div>
                                                   <ul>
                                                       <li class="active">All</li>
                                                       <li id="Expire_home-li" >{this.state.alphabetLists}</li>
                                                   </ul>
                                               </div>
                                           </div>
                                           <div class="col-md-11 no_padding">
                                        <div class="">
                                            <table>
                                                <thead>
                                                    <tr>
                                                      
                                                        <th>Customer</th>
                                                        <th>Batch</th>
                                                        <th>Expiry Date</th>
                                                        <th>VAT</th>
                                                        <th>Current Stock</th>
                                                        <th>Price</th>
                                                        <th>Return</th>
                                                        <th></th>
                                                       
                                                    </tr>
                                                </thead>
                                              <tbody >
                                                 
                                                  {this.state.retailerExpireStockCurrentMedicineDetailsView!="" ? this.state.retailerExpireStockCurrentMedicineDetailsView : "No results found "}
                                               
                                              </tbody>
                                            </table>
                                          </div>
                                          </div>
                                          </div>
                                          </div>
                                    </div>
                                    <div class="tab-pane fade" id="order_home" role="tabpanel" aria-labelledby="order_home-tab">
                                    <div class="container">
                                        <div class="row  stock_body">
                                    <div class="col-md-1 no_padding">
                                               <div class="index_box">
                                                   <div class="index_head">
                                                       <h2>Index</h2>
                                                   </div>
                                                   <ul>
                                                       <li class="active">All</li>
                                                       <li id="order_home-li" >{this.state.alphabetLists}</li>
                                                   </ul>
                                               </div>
                                           </div>
                                           <div class="col-md-11 no_padding">
                                        <div class="">
                                            <table>
                                                <thead>
                                                    <tr>
                                                       
                                                        <th>Medicine</th>
                                                        <th>Add Quantity</th>
                                                        <th class="order_all"><input type="checkbox" id="orderAll" onChange={this.orderAllShortageBook} />Order All</th>
                                                        <th class="delete_head"><img src="../images/retailer/deleteAll.svg" onClick={this.deleteAllShortageBook} /> Delete All</th>
                                                        
                                                       
                                                    </tr>
                                                </thead>
                                              <tbody >
                                              {this.state.retailerShortagebookProductsList}
                                               
                                              </tbody>
                                            
                                            </table>
                                            <div class={this.state.showFinalOrderButton}>
                                                <p>Total {this.state.shortageBookItemsCount} items added <h5 onClick={this.previewOrder}><img src="../images/retailer/FinalOrder.svg" /> Final Order</h5></p>
                                            </div>
                                          </div>
                                          
                                          </div>
                                          </div>
                                          </div>
                                    </div>
                                    
                                    
                                </div>
                                </div> 
                                {/* bottomsection end */}
                            </div>
                        </div>
                    </div>
                </section>

                 <section id="add_medicine" class={this.state.addMedicineSection}>
                 <form onSubmit={this.checkAddMedicineSubmit.bind(this)} id="addMedicines">
                    <div class="add_med_content">
                    <div class="container">
                    <div class="row">
                        <div class="col-md-12">
                           
                                <div class="add_med_head">
                                    <h2>Add Medicine </h2>
                                    <div class="upload_items">
                                    <ExcelFile element={ <a href="#"> <p><img src="../images/retailer/download.svg" />Download Products XLS</p></a>}>
                <ExcelSheet data={this.state.exportproductsarray} name="Order Request">
                
                    <ExcelColumn label="MedicineId" value="medicine_id"/>
                    <ExcelColumn label="MedicineName" value="medicinename"/>
                    <ExcelColumn label="Manufacturer" value="manufacturer"/>
                    <ExcelColumn label="Form" value="form"/>
                    <ExcelColumn label="Quantity" value="available_quantity"/>
                    <ExcelColumn label="Batch" value="batch"/>
                    <ExcelColumn label="Expirydate" value="expiry_date"/>
                    <ExcelColumn label="Discount" value="discount"/>
                    <ExcelColumn label="MRP" value="mrp"/>
                    <ExcelColumn label="VAT" value="vat"/>
                    <ExcelColumn label="productId" value="productId"/>
                    
                    
                </ExcelSheet>
            </ExcelFile>
                                   
                                   
                                    </div>
                                    <div class="upload_items">
                                    <a href="#" onClick={this.showUpload}><p> <img src="../images/retailer/download.svg" />Upload XLS</p></a> 
                                   </div>
                                </div>
                            </div>
                        </div>
                  
                    <div class="add_med_form">
                    <div class="row">
                        <div class="col-md-12">
                        <div class="form-group add_group add_form product_field">
                        
                             <input type="text" class="form-control " autocomplete="off" name="product_name" id="medicineList" placeholder="Product name" onKeyUp={this.fetchmedicinedata}  />
                            <img class="search_cross" src="https://www.flaticon.com/svg/static/icons/svg/59/59836.svg" onClick={this.clearSearch} />
                            <ul id="searchResult">{this.state.medicineOptions}</ul>
                            <div className="cRed">
                                   {this.state.errors["selectedMedicine"]}
                                   </div>      
                        </div>
                    </div>
                    <div class={this.state.showfields}>
                    <div class="form-group add_group col-md-2">
                    
                        <input type="text" class="form-control" name="qty" placeholder="Quantity" onChange={this.handleChangeInput.bind(
                                        this,
                                        "qty"
                                      )}/>
                                  <div className="cRed">
        {this.state.errors["qty"]}
        </div>     
                    </div>
                    
                    <div class="form-group add_group col-md-2">
                        <input type="text" class="form-control" name="batchNumber" placeholder="Batch number" onChange={this.handleChangeInput.bind(
                                        this,
                                        "batchNumber"
                                      )}/>
                           <div className="cRed">
        {this.state.errors["batchNumber"]}
        </div>            
                    </div>
                    
                    <div class="form-group add_group col-md-2">
                        <input type="text" class="form-control" name="expireDate" placeholder="Expiry Date" onChange={this.handleChangeInput.bind(
                                        this,
                                        "expireDate"
                                      )}/>
                                     <div>Format:YYYY-MM-DD</div>
                                     <div className="cRed">
        {this.state.errors["expireDate"]}
        </div>      
                    </div>
                    
                    <div class="form-group add_group col-md-2">
                        <input type="text" class="form-control" name="mrp" placeholder="MRP" onChange={this.handleChangeInput.bind(
                                        this,
                                        "mrp"
                                      )}/>
                                     <div className="cRed">
        {this.state.errors["mrp"]}
        </div>
                    </div>
                    {/* <div class="form-group add_group col-md-2">
                        <input type="text" class="form-control" name="hsn" placeholder="HSN Number" onConChange={this.handleChangeInput.bind(
                                        this,
                                        "hsn"
                                      )}/>
                               <div className="cRed">
        {this.state.errors["hsn"]}
        </div>        
                    </div> */}
                    
                    <div class="form-group add_group col-md-2">
                        <input type="text" class="form-control" name="discount" placeholder="Discount" onChange={this.handleChangeInput.bind(
                                        this,
                                        "discount"
                                      )}/>
                                     <div className="cRed">
        {this.state.errors["discount"]}
        </div> 
                    </div>
                    
                </div>
            </div>
        </div>



<div class={this.state.requestbtn}>
<div class="row">
                    <div class="form-group add_group col-md-4">
                    
                        <input type="text" class="form-control" name="qty" placeholder="Manufacturer name" onChange={this.handleChangeInput.bind(
                                        this,
                                        "manufacturer"
                                      )}/>
                                  <div className="cRed">
        {this.state.errors["manufacturer"]}
        </div>     
                    </div>
                    
                    <div class="form-group add_group col-md-4">
                        <input type="text" class="form-control" name="batchNumber" placeholder="UOM" onChange={this.handleChangeInput.bind(
                                        this,
                                        "UOM"
                                      )}/>
                           <div className="cRed">
        {this.state.errors["UOM"]}
        </div>            
                    </div>
                    
                    <div class="form-group add_group col-md-4">
                        <input type="text" class="form-control" name="expireDate" placeholder="Price" onChange={this.handleChangeInput.bind(
                                        this,
                                        "MRP"
                                      )}/>
                                     
                                     <div className="cRed">
        {this.state.errors["MRP"]}
        </div>      
                    </div>
</div>
                    </div>












        <div class="add_med_btns">
            <div class="clear_btn">
               <a href="#"><button type="button" onClick={this.clearAll}>Clear All</button></a> 
            </div>
            <div class={this.state.updatebtn}>
                <a href="#">  <button type="submit">Update</button></a> 
            </div>
            <div class={this.state.requestbtn}>
                <a href="#">  <button type="button" onClick={this.addProductRequest}>Send Add Request</button></a> 
            </div>
        </div>
                    </div>
                    </div>
                    </form>
                </section>



                 <section id="final_order" class={this.state.finalOrder}>
                  <div class="final_content">
                      <div class="container">
                         
                          <div class="row">
                              <div class="col-md-12">
                                  <div class="final_back">
                                    <a href="#" onClick={this.showOrderBook}> <h2><img src="../images/retailer/back_arrow.svg" />Back to Order Book</h2></a>  
                                  </div>
                                  <div class="final_head">
                                      <h2>Final Order list</h2>
                                      
                                      <div class="final_ord_book">
                                      <ExcelFile element={ <a href="#"> <p><img src="../images/retailer/download.svg" />Download XLS</p></a>}>
                <ExcelSheet data={this.state.finalorderarray} name="Order Request">
                    <ExcelColumn label="Name" value="name"/>
                    <ExcelColumn label="Manufacturer" value="manufacturer"/>
                    <ExcelColumn label="Quantity" value="Quantity"/>
                </ExcelSheet>
            </ExcelFile>
                                         <a href="#" onClick={this.printDiv}> <p><img src="../images/retailer/print.svg" /> Print</p></a>
                                      </div>
                                  </div>
                              </div>
                          </div>
                          <div class="row">
                              <div class="col-md-12">
                                  <div class="final_ord_details" id="final_ord_details">
                                  {this.state.retailerFinalOrderMedicineDetailsView}
                                    </div>
                              </div>
                          </div>
                      </div>
                  </div>
              </section>
           
            </div>
    
        </div>
    </div>
    <ToastContainer />
</section>            <Footer/>
         </main>
         
      )
   }
}

