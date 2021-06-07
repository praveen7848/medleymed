import React, { Component, useState } from 'react';
import $ from "jquery";
import { ToastContainer } from "react-toastify";
import toast from "../helpers/toast";
import { Link } from "react-router-dom";
import Httpconfig from "../helpers/Httpconfig";
import { reactLocalStorage } from 'reactjs-localstorage';
import Constant from "../../constants";

// For Translator Starts
import { FormattedMessage } from "react-intl"; // Backup Way to Convert
import { I18nPropvider, LOCALES } from '../../i18nProvider';
import translate from "../../i18nProvider/translate";
import PatientHeader from "../patient/Sanarheader";
import Patcss from "../../public/css/patient/order-medicine.css";
// import PatientMenu from "../patient/Patientmenu";

import PatientFooter from "../patient/Patientfooter";
import PatientGetLocations from "../patient/PatientGetLocaitons";

import PlacesAutocomplete, {
  geocodeByAddress,
  getLatLng,
} from "react-places-autocomplete";

import OwlCarousel from 'react-owl-carousel';  
import 'owl.carousel/dist/assets/owl.carousel.css';  
import 'owl.carousel/dist/assets/owl.theme.default.css'; 
const moment = require("moment"); 


export default class SanarOrderMedicineHome extends Component {
  
  constructor(props) {
    super(props);
    this.state = {
      Language: "ENGLISH",
      specalitiesList:[],
      fields: {},
      errors: {},
      patientId:"",
      medicineOptions:"",
      medicineProductsView:"",
      home:"collapse-show",
      searchproductslist:"collapse-hide",
      
      search_address: "",
      detected_address: "",
      
      cartId:"",
      cartItemsCount:"0",
      cartDetailsPopup:"",
      cartDetailsPage:"",
      cartDetailsPageSection:"collapse-hide",
      mostOrderProducts:"",
      suggestedProducts:"",
      ordersView:"",
      manufacturers:"",
      brandOptions:[],
      formOptions:[],
      downloadSection:"collapse-show",
      
    }
    this.handleChange =this.handleChange.bind(this);
    this.fetchmedicinedata=this.fetchmedicinedata.bind(this);
    // window.initMap = this.initMap.bind(this);
    
  }
  componentDidUpdate = () => {     
    var lang = localStorage.getItem('Language_selected');
    if (lang != null) {
     // console.log(this.state.Language +"!="+ lang);
      
      if (this.state.Language != lang) {
        this.state.Language = lang;
        console.log("notnull " + this.state.Language);
        this.forceUpdate();
      } 
      
    } else {
      this.state.Language = "en-us";
     // console.log(this.state.Language); 
    }
    
  }
  
  componentDidMount =()=>  {
    this.getCurrentLocation();
    let userData="";
    userData=reactLocalStorage.getObject("userObj");
    let cartData="";
    let savedmedicinesRedirect="";
    cartData=localStorage.getItem("cartId");
    
    if(userData){
      if(Object.keys(userData).length>0){
        
        this.state.patientId=userData.patient_id;
        this.forceUpdate();
        this.getLasterOrderDetails(userData.patient_id);
      }
    }else{
      window.location.href = "/login";
    }

    //get cart id
      if(cartData!=""){
        this.state.cartId=cartData;
        this.forceUpdate();
      }
      savedmedicinesRedirect=localStorage.getItem("savedMedicinesRedirect");
      //alert(savedmedicinesRedirect);
      if(savedmedicinesRedirect==1)
      {
       // alert("in");
        this.miniCart();
        localStorage.removeItem("savedMedicinesRedirect");
      }
    
    
    this.getCartDetails();
    this.mostOrderProducts();
    this.suggestedProducts();
    this.getManufacturers();
    this.getBrands();
    this.getMedicineForm();

    var lang = localStorage.getItem("Language_selected");
    
    let clinic_id=window.location.pathname.split('/');
    if(clinic_id[2]!=""){
      localStorage.setItem("clinic_id",clinic_id[2]);
      this.setState.clinicId=clinic_id[2];
    }
    
    if (lang != null) {
      if (this.state.Language != lang) {
        this.state.Language = lang;
        console.log("notnull " + this.state.Language);
        this.forceUpdate();
      }
      
    } else {
      this.state.Language = "en-us";
    }

    const script = document.createElement('script')
    script.async = true
    script.defer = true
    script.src = "https://maps.googleapis.com/maps/api/js?key=AIzaSyCuMJ3dhADqNoE4tGuWTI3_NlwBihj5BtE&callback=initMap"
    document.head.appendChild(script)
    
    
  }
   
  // add lanuage  
  handleLanguage=(langValue)=>{
    this.setState({Language: langValue});
  }
  
  // add to cart
  addToCart=(event)=>{
    
    let medicineId = event.currentTarget.id;
    let quantity = $('#qty-' + medicineId).val();
    let cartId="";
    let cartItemsCount=this.state.cartItemsCount;
    if(quantity==0){
      toast.error("Quantity should not be Zero");
      return false;
    }
    if(this.state.cartId){
      cartId=this.state.cartId;
      // alert(cartId);
    }
    if(quantity>50){
      toast.error("Quantity should not be more than 50");
      return false;
    }
    if(cartItemsCount>=30){
      toast.error("You can add medicines upto 30 only for an order");
      return false;
    }
    
    Httpconfig.httptokenpost(Constant.siteurl + "api/OM/Cart", {
      "cart_id": cartId,
      "shop_id": "",
      "patient_id": this.state.patientId,
      "medicine_id": medicineId,
      "quantity": quantity,
    })
    .then((response) => {
      if (response.data.status == "200" && response.data.error == false) {
        // alert(this.state.cartId);
        if (cartId == "") {
          this.state.cartId = response.data.cart_id;
          this.state.cartItemsCount=response.data.cart_items;
          this.forceUpdate();
          //alert(response.data.cart_id)
          localStorage.setItem("cartId",response.data.cart_id);
          
        }else{
          if(this.state.cartId!=response.data.cart_id){
            this.state.cartId = response.data.cart_id;
            this.state.cartItemsCount=response.data.cart_items;
            localStorage.setItem("cartId",response.data.cart_id);
            this.forceUpdate();
          }
        }
        this.getCartDetails();
        toast.success(response.data.message, {
          position: "bottom-center",
        });
      }
    })
    .catch((error) => {
      toast.error(error);
    });
    
    
    var x = document.getElementById("order_pro_toast");
    x.className = "show";
    setTimeout(function () {
      x.className = x.className.replace("show", "");
    }, 3000);
  }
  
  // get cart items details
  
  getCartDetails=()=>{
    let cartId="";
    cartId=this.state.cartId;
    //alert(this.state.cartId);
    //alert(cartId);
    let total=0;
    
    Httpconfig.httptokenget(Constant.siteurl + "api/OM/Cart/findAllCartDetails/"+cartId, )
    .then((response) => {
      if (response.data.status == "200" && response.data.error == false) {
        this.state.cartItemsCount=response.data.cart_count;
        this.forceUpdate();
        const cartDetailsView= response.data.data.map((LoadedData,num)=>{ 
          total=parseInt(total)+(LoadedData.products_master_tbl.mrp*LoadedData.quantity);
          
          return(
            
            <React.Fragment>
            <p>{LoadedData.products_master_tbl.medicinename} <span>Qty: {LoadedData.quantity}</span></p>
            </React.Fragment>
          
            
          )
        })
        this.state.cartTotal=total;
        this.state.cartDetailsPopup=cartDetailsView;
        this.forceUpdate();
        
      }
    })
    .catch((error) => {
      toast.error(error);
    });
    
  } 
  

  // show cart popup
miniCart=()=>{
  
  let cartId=this.state.cartId;
  let total=0;
  
  
  Httpconfig.httptokenget(Constant.siteurl + "api/OM/Cart/findAllCartDetails/"+cartId, )
  .then((response) => {
    if (response.data.status == "200" && response.data.error == false) {
       //alert(response.data.cart_count);
      this.state.cartItemsCount=response.data.cart_count;
      this.forceUpdate();
      
      const cartDetailsPage= response.data.data.map((LoadedData,num)=>{ 
        total=parseFloat(total)+(LoadedData.products_master_tbl.mrp*LoadedData.quantity);
        
        return(
          
          <div class="cart_list_box">
          <div class="row">
            <div class="col-md-2">
              <div class="cart_img">
                <img src={this.getProductImage(LoadedData.products_master_tbl.form)} />
                </div>
            </div>
            <div class="col-md-10">
              <div class="cart_item_det">
                <h2>{LoadedData.products_master_tbl.medicinename + " "+ LoadedData.products_master_tbl.strength}</h2>
                <p> <span class="mrp">
                 MRP:₦ {LoadedData.products_master_tbl.mrp}
                </span> 
                {/* <span class="off">
                 4% off 
                </span> */}
                <span>₦ {total.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')}</span>
                  
                  </p>
                <h4>{LoadedData.products_master_tbl.size}</h4>
                <h6>{LoadedData.products_master_tbl.manufacturer}</h6>
                {/* <h6><span>1 Strips</span><span>10 Tablets</span></h6> */}
               
                <div class="input-group number-spinner">
                    <div class="input-group-btn">
                        <button class="btn btn-default minus_btn" data-dir="dwn" id={"minus-"+LoadedData.medicine_id} onClick={this.qtyDecrementUpdate.bind(this,LoadedData.medicine_id,LoadedData.id)} ><i class="fa fa-minus"></i></button>
                    </div>
                    <input type="text" class="form-control text-center" readOnly="readOnly" value={LoadedData.quantity} id={"qty-"+LoadedData.medicine_id} />
                    <div class="input-group-btn">
                        <button class="btn btn-default plus_btn" data-dir="up" id={"plus-"+LoadedData.medicine_id} onClick={this.qtyIncrementUpdate.bind(this,LoadedData.medicine_id,LoadedData.id)}><i class="fa fa-plus"></i></button>
                    </div>
                </div>
                   </div>
            </div>
          </div>
         <div class="cart_item_btm">
       <a href="#" id={LoadedData.id} onClick={this.removeItem.bind(this,LoadedData.id)}><p><img src="https://img.favpng.com/4/19/3/computer-icons-png-favpng-uG7WtzViA53eMMNhaakEueT6W_t.jpg" /> Remove</p></a> 
       <a href="#" id={LoadedData.medicine_id} onClick={this.saveForLater}><h3> <img src="../images/patient/img/Ordermedicine/saveforLater.svg" /> Save For Later</h3></a> 
         </div>
        </div>
        
          
        )
      })
      this.state.cartDetailsPageSection='collapse-show';
      this.state.home="collapse-hide";
      this.state.downloadSection="collapse-hide";
      this.state.searchproductslist="collapse-hide";
      this.state.cartTotal=total;
      this.state.cartDetailsPage=cartDetailsPage;
      this.forceUpdate();
      
    }
  })
  .catch((error) => {
    toast.error(error);
  });

}
  
  
  
  
  //  fetch master medicine data on search
  fetchmedicinedata(event) {
    //alert("in");
    let search=event.target.value;
    
    //alert(search.length);
    let medicinesList=[];
    
    //this.state.search=search;
    if(search.length>2 ){
      Httpconfig.httptokenpost(

        //api/productMaster/fetchdata/1054
        Constant.siteurl + "api/OM/MedicineDetails/MedicineSearchDetails",
        {"medicine_name":search,"patient_id":this.state.patientId}
        //Constant.siteurl + "api/OM/retailerProduct/medicine/"+search
      ).then((response) => {
        this.state.searchCount=Object.keys(response.data.result).length;
        this.state.search=search;
        if(Object.keys(response.data.result).length>0){
          const medicineDetailsView= response.data.result.map((finalLoadedData,num)=>{ 
            return(
              <li id={finalLoadedData.id} onClick={this.handleChange} > {finalLoadedData.medicinename +" "+finalLoadedData.strength +" "+ finalLoadedData.size}</li>
            )
          });
          
          // const medicineProductsView= response.data.result.map((LoadedData,num)=>{ 
          //   let productimg="";
          //   if(LoadedData.form!=""){
          //     productimg=this.getProductImage(LoadedData.form);
          //   }else{
          //      productimg="http://placehold.it/250x250";
          //   }
    
          //   return(
          //     <div class="col-lg-3 col-md-6">
          //     <div class="order_list_box">
          //     <img src={productimg} alt="Image" />
          //     <div class="order_list_content">
          //     <h2>{LoadedData.medicinename}</h2>
          //     <p>{LoadedData.size}</p>
          //     <h5></h5> 
          //     <span></span>
          //     <div class="total_box">
          //     <p class="total_price" >₦ <span id={"total-"+LoadedData.id}>{LoadedData.mrp}</span> </p>
            
          //     <div class="input-group number-spinner">
          //     <div class="input-group-btn">
          //     <button class="btn btn-default minus_btn" data-dir="dwn" id={"minus-"+LoadedData.id} onClick={this.qtyDecrement}><i class="fa fa-minus"></i></button>
          //     </div>
          //     <input type="text" class="form-control text-center" defaultValue="1" id={"qty-"+LoadedData.id} />
          //     <div class="input-group-btn">
          //     <button class="btn btn-default plus_btn" data-dir="up" id={"plus-"+LoadedData.id} onClick={this.qtyIncrement}><i class="fa fa-plus"></i></button>
          //     </div>
          //     </div>

          //     <div class="add_btn_sec">
          //     <a href="javascript:void(0)"><p id={LoadedData.id} onClick={this.addToCart} class="add_btn">Add</p></a>
          //       </div>
          //     </div>
          //     </div>
          //     </div>
          //     </div>
          //   )
          // });
          // this.setState({
          //   medicineOptions:medicineDetailsView,
          //  medicineProductsView:medicineProductsView,
          // });
          
          this.state.medicineOptions="";
          this.state.medicineOptions=medicineDetailsView;
          this.forceUpdate();
        }else{
          this.state.medicineOptions="";
          this.state.medicineProductsView="";
        //  this.forceUpdate();
          
        }
      });
    }else{
      this.state.medicineOptions="";
      this.state.medicineProductsView="";
      this.state.search=search;
      this.state.searchCount=0;
      this.forceUpdate();
    }
  }
  
  
  //  onchanges on master search
  handleChange = (event) => {
    
    let searched = event.currentTarget.id;
    this.getProductDetailsById(searched);
    let medicineName=event.currentTarget.innerText;
    this.state.selelcteMedicineName=medicineName;
    this.state.home="collapse-hide";
    this.state.searchproductslist="collapse-show";
    this.state.cartDetailsPageSection='collapse-hide';
    this.state.downloadSection="collapse-hide";
    
    $('#medicineList').val(medicineName);
    this.state.search=medicineName;
    //$('#searchResult').html('');
    this.state.medicineOptions="";
    this.forceUpdate();
    
    //return;
    // let medicineName=event.currentTarget.innerText;
    // this.state.selelcteMedicineId=searched;
    // this.state.selelcteMedicineName=medicineName;
    // this.state.medicineOptions="";
    // $('#medicineList').val('');
    // $('#medicineList').val(medicineName);
    // this.state.search=medicineName;
    // this.state.home="collapse-hide";
    // this.state.searchproductslist="collapse-show";
    // this.state.cartDetailsPageSection='collapse-hide';
    // this.forceUpdate();
  };
  
  //  quanatity decrement
  
  qtyIncrement=(event)=>{
    
    let data=event.currentTarget.id.split("-");
    let id=data[0];
    let orderId=data[1];
    let qty=$('#qty-'+orderId).val();
    
    if(qty>=0 && qty<50){
      qty=parseInt(qty)+1;
      $('#qty-'+orderId).val(qty);
      
    }else{
      if(qty>=50){
        toast.error('Qunatity should not be more that 50');
        return false;
      }
    }
    
  }
  
  // quanatity Increment
  qtyDecrement=(event)=>{
    let data=event.currentTarget.id.split("-");
    let id=data[0];
    let orderId=data[1];
    let qty=$('#qty-'+orderId).val();
    if(qty>0){
      qty=parseInt(qty)-1;
      $('#qty-'+orderId).val('');
      $('#qty-'+orderId).val(qty);
     
    }
    
  }
  
  // Remove items from cart
  removeItem=(id)=>{
    let cartId=this.state.cartId;
    let productId=id;//event.currentTarget.id;
    Httpconfig.httptokendelete(Constant.siteurl + "api/OM/Cart/"+productId, )
    .then((response) => {
      if (response.data.status == "200" && response.data.error == false) {
        toast.success(response.data.message);
        this.miniCart();
        
      }
    })
    .catch((error) => {
      toast.error(error);
    });

  }

  saveForLater=(event)=>{
    let cartId=this.state.cartId;
    let productId=event.currentTarget.id;
    let quanatity=$('#qty-'+productId).val();
    Httpconfig.httptokenpost(Constant.siteurl + "api/OM/Cart/wishlist",
    {"cart_id":JSON.parse(cartId),"patient_id":this.state.patientId,"medicine_id":JSON.parse(productId),"quantity":JSON.parse(quanatity)}
  )
    .then((response) => {
      if (response.data.status == "200" && response.data.error == false) {
        toast.success(response.data.message);
        this.miniCart();
       //this.removeItem(productId);
        
      }
    })
    .catch((error) => {
      toast.error(error);
    });

  }
  
  // Update quantity
  updateQuantity=(productId,rowId)=>{

    let cartId=this.state.cartId;
   // let productId=event.currentTarget.id;
    let quanatity=$('#qty-'+productId).val();
    Httpconfig.httptokenput(Constant.siteurl + "api/OM/Cart/"+rowId,
    {"cart_id":cartId,"patient_id":this.state.patientId,"medicine_id":productId,"quantity":quanatity,"shop_id":""}
  )
    .then((response) => {
      if (response.data.status == "200" && response.data.error == false) {
       // toast.success(response.data.message);
        this.miniCart();
        
      }
    })
    .catch((error) => {
      toast.error(error);
    });


  }
  //  quanatity decrement
  
  qtyIncrementUpdate=(prodcutId,rowId)=>{
    //alert("in");
    // let data=event.currentTarget.id.split("-");
    // let id=data[0];
    // let orderId=data[1];
    let qty=$('#qty-'+prodcutId).val();
    //alert(qty);
    if(qty>=0 && qty<50){

      qty=parseInt(qty)+1;
      //alert(qty);
      $('#qty-'+prodcutId).val('');
      $('#qty-'+prodcutId).val(qty);
      //alert($('#qty-'+prodcutId).val());
      this.updateQuantity(prodcutId,rowId);
      //  this.updateShortagebookQuantity(id,medicineId,qty);
    }
    
    if(qty>=50){
      toast.error("Quantity should not be more than 50");
      return false;
    }

    
  }
  
  // quanatity Increment
  qtyDecrementUpdate=(prodcutId,rowId)=>{
    // alert("in1");
    // let data=event.currentTarget.id.split("-");
    // let id=data[0];
    // let orderId=data[1];
       let qty=$('#qty-'+prodcutId).val();
       //alert(qty);
    if(qty>1){
      qty=parseInt(qty)-1;
      $('#qty-'+prodcutId).val('');
      $('#qty-'+prodcutId).val(qty);
      this.updateQuantity(prodcutId,rowId);
      //  this.updateShortagebookQuantity(id,medicineId,qty);
    }
    
  }

  // get the laster order status
  getLasterOrderDetails=(patientId)=>{
   // let patientId= this.state.patientId;
    //Httpconfig.httptokenget(Constant.siteurl + "api/OM/orderProcess/getPatientOrderDetails/"+patientId,)
    
    
    



    Httpconfig.httptokenget(Constant.siteurl + "api/OM/MedicineDetails/patientLastOrderDetails/"+patientId,)
    .then((response) => {
      if (response.data.status == "200" && response.data.error == false) {
       // toast.success(response.data.message);
        //this.miniCart();
        
        const ordersView= response.data.data.map((LoadedData,num)=>{
          var startdate= LoadedData.order_date;
          var setdeliverydays=LoadedData.retailer_registration_tbl.set_delivery_days;
          var new_date = moment(startdate, "YYYY/MM/DD");
          var deliveryDate = new_date.add(setdeliverydays, 'days').format("dddd, MMMM Do YYYY");//.format('DD/MM/YYYY');
         // alert(num); 
          if(num==0){
         // alert(LoadedData.order_status);

         let progressBar = "";
        //  if (LoadedData.order_status === 1) {
        //    progressBar +=
   
        //      '<div class="stepwizard-row setup-panel"><div class="stepwizard-step"><a href="javascript:void(0)" type="button" class="btn btn-primary btn-circle"><img src="../images/patient/img/Patient Intake Process/tickmark.svg" /></a><p class="p_dark">Order Placed</p></div><div class="stepwizard-step"><a href="javascript:void(0)" type="button" class="btn btn-default btn-circle">2</a> <p class="p_light">Prescription Verified </p></div><div class="stepwizard-step"><a href="javascript:void(0)" type="button" class="btn btn-default btn-circle">3</a><p class="p_light">Processed </p></div><div class="stepwizard-step"><a href="javascript:void(0)" type="button" class="btn btn-default btn-circle">4</a><p class="p_light">Shipped</p></div><div class="stepwizard-step"><a href="javascript:void(0)" type="button" class="btn btn-default btn-circle">5</a><p class="p_light">Delivered</p></div></div>';
        //  } else if (LoadedData.order_status === 2) {
        //    progressBar +=
        //      '<div class="stepwizard-row setup-panel"><div class="stepwizard-step"><a href="javascript:void(0)" type="button" class="btn btn-primary btn-circle"><img src="../images/patient/img/Patient Intake Process/tickmark.svg" /></a><p class="p_dark">Order Placed</p></div><div class="stepwizard-step"><a href="javascript:void(0)" type="button" class="btn btn-primary btn-circle"><img src="../images/patient/img/Patient Intake Process/tickmark.svg" /></a><p class="p_dark">Prescription Verified </p></div><div class="stepwizard-step"><a href="javascript:void(0)" type="button" class="btn btn-primary btn-circle"><img src="../images/patient/img/Patient Intake Process/tickmark.svg" /></a><p class="p_dark">Processed </p></div><div class="stepwizard-step"><a href="javascript:void(0)" type="button" class="btn btn-default btn-circle">3</a><p class="p_light">Shipped</p></div><div class="stepwizard-step"><a href="javascript:void(0)" type="button" class="btn btn-default btn-circle">4</a><p class="p_light">Delivered</p></div></div>';
        //  } else if (LoadedData.order_status === 3) {
        //    progressBar +=
        //      '<div class="stepwizard-row setup-panel"><div class="stepwizard-step"><a href="javascript:void(0)" type="button" class="btn btn-primary btn-circle"><img src="../images/patient/img/Patient Intake Process/tickmark.svg" /></a><p class="p_dark">Order Placed</p></div><div class="stepwizard-step"><a href="javascript:void(0)" type="button" class="btn btn-primary btn-circle"><img src="../images/patient/img/Patient Intake Process/tickmark.svg" /></a><p class="p_dark">Prescription Verified </p></div><div class="stepwizard-step"><a href="javascript:void(0)" type="button" class="btn btn-primary btn-circle"><img src="../images/patient/img/Patient Intake Process/tickmark.svg" /></a><p class="p_dark">Processed </p></div><div class="stepwizard-step"><a href="javascript:void(0)" type="button" class="btn btn-default btn-circle"></a><p class="p_light">Shipped</p></div><div class="stepwizard-step"><a href="javascript:void(0)" type="button" class="btn btn-default btn-circle">4</a><p class="p_light">Delivered</p></div></div>';
        //  } else if (LoadedData.order_status === 4) {
        //    progressBar +=
        //      '<div class="stepwizard-row setup-panel"><div class="stepwizard-step"><a href="javascript:void(0)" type="button" class="btn btn-primary btn-circle"><img src="../images/patient/img/Patient Intake Process/tickmark.svg" /></a><p class="p_dark">Order Placed</p></div><div class="stepwizard-step"><a href="javascript:void(0)" type="button" class="btn btn-primary btn-circle"><img src="../images/patient/img/Patient Intake Process/tickmark.svg" /></a><p class="p_dark">Prescription Verified </p></div><div class="stepwizard-step"><a href="javascript:void(0)" type="button" class="btn btn-primary btn-circle"><img src="../images/patient/img/Patient Intake Process/tickmark.svg" /></a><p class="p_dark">Processed </p></div><div class="stepwizard-step"><a href="javascript:void(0)" type="button" class="btn btn-primary btn-circle"><img src="../images/patient/img/Patient Intake Process/tickmark.svg" /></a><p class="p_dark">Shipped</p></div><div class="stepwizard-step"><a href="javascript:void(0)" type="button" class="btn btn-default btn-circle"></a><p class="p_light">Delivered</p></div></div>';
        //  }else if (LoadedData.order_status === 5) {
        //    progressBar +=
        //      '<div class="stepwizard-row setup-panel"><div class="stepwizard-step"><a href="javascript:void(0)" type="button" class="btn btn-primary btn-circle"><img src="../images/patient/img/Patient Intake Process/tickmark.svg" /></a><p class="p_dark">Order Placed</p></div><div class="stepwizard-step"><a href="javascript:void(0)" type="button" class="btn btn-primary btn-circle"><img src="../images/patient/img/Patient Intake Process/tickmark.svg" /></a><p class="p_dark">Prescription Verified </p></div><div class="stepwizard-step"><a href="javascript:void(0)" type="button" class="btn btn-primary btn-circle"><img src="../images/patient/img/Patient Intake Process/tickmark.svg" /></a><p class="p_dark">Processed </p></div><div class="stepwizard-step"><a href="javascript:void(0)" type="button" class="btn btn-primary btn-circle"><img src="../images/patient/img/Patient Intake Process/tickmark.svg" /></a><p class="p_dark">Shipped</p></div><div class="stepwizard-step"><a href="javascript:void(0)" type="button" class="btn btn-primary btn-circle"><img src="../images/patient/img/Patient Intake Process/tickmark.svg" /></a><p class="p_dark">Delivered</p></div></div>';
        //  }else if (LoadedData.order_status === 6) {
        //    progressBar +=
        //      '<div class="stepwizard-row setup-panel"><div class="stepwizard-step"><a href="javascript:void(0)" type="button" class="btn btn-primary btn-circle"><img src="../images/patient/img/Patient Intake Process/tickmark.svg" /></a><p class="p_dark">Order Placed</p></div><div class="stepwizard-step"><a href="javascript:void(0)" type="button" class="btn btn-primary btn-circle"><img src="../images/patient/img/Patient Intake Process/tickmark.svg" /></a><p class="p_light">Cancelled </p></div></div>';
        //  }
         
          return(
            
<div class="row">
      <div class="col-md-4">
      </div>
      <div class="col-md-8">
      <div class="expect_head">
      <h4>Your Order:{LoadedData.id} expected delivery by <span>{deliveryDate}</span></h4>
      </div>
      <div class="expect_content">
      <div class="stepwizard">
      <div class="stepwizard-row setup-panel">
      <div class="stepwizard-step">

      
      {/* <div dangerouslySetInnerHTML={{ __html:progressBar }} /> */}
      
      {LoadedData.order_status=='1' ?
      <div class="stepwizard-row setup-panel"><div class="stepwizard-step"><a href="javascript:void(0)" type="button" class="btn btn-primary btn-circle"><img src="../images/patient/img/Patient Intake Process/tickmark.svg" /></a><p class="p_dark">Order Placed</p></div><div class="stepwizard-step"><a href="javascript:void(0)" type="button" class="btn btn-default btn-circle">2</a> <p class="p_light">Prescription Verified </p></div><div class="stepwizard-step"><a href="javascript:void(0)" type="button" class="btn btn-default btn-circle">3</a><p class="p_light">Processed </p></div><div class="stepwizard-step"><a href="javascript:void(0)" type="button" class="btn btn-default btn-circle">4</a><p class="p_light">Shipped</p></div><div class="stepwizard-step"><a href="javascript:void(0)" type="button" class="btn btn-default btn-circle">5</a><p class="p_light">Delivered</p></div></div>
      :LoadedData.order_status=='2'?
      <div class="stepwizard-row setup-panel"><div class="stepwizard-step"><a href="javascript:void(0)" type="button" class="btn btn-primary btn-circle"><img src="../images/patient/img/Patient Intake Process/tickmark.svg" /></a><p class="p_dark">Order Placed</p></div><div class="stepwizard-step"><a href="javascript:void(0)" type="button" class="btn btn-primary btn-circle"><img src="../images/patient/img/Patient Intake Process/tickmark.svg" /></a><p class="p_dark">Prescription Verified </p></div><div class="stepwizard-step"><a href="javascript:void(0)" type="button" class="btn btn-primary btn-circle"><img src="../images/patient/img/Patient Intake Process/tickmark.svg" /></a><p class="p_dark">Processed </p></div><div class="stepwizard-step"><a href="javascript:void(0)" type="button" class="btn btn-default btn-circle">3</a><p class="p_light">Shipped</p></div><div class="stepwizard-step"><a href="javascript:void(0)" type="button" class="btn btn-default btn-circle">4</a><p class="p_light">Delivered</p></div></div>
      :LoadedData.order_status=='3' ?
      <div class="stepwizard-row setup-panel"><div class="stepwizard-step"><a href="javascript:void(0)" type="button" class="btn btn-primary btn-circle"><img src="../images/patient/img/Patient Intake Process/tickmark.svg" /></a><p class="p_dark">Order Placed</p></div><div class="stepwizard-step"><a href="javascript:void(0)" type="button" class="btn btn-primary btn-circle"><img src="../images/patient/img/Patient Intake Process/tickmark.svg" /></a><p class="p_dark">Prescription Verified </p></div><div class="stepwizard-step"><a href="javascript:void(0)" type="button" class="btn btn-primary btn-circle"><img src="../images/patient/img/Patient Intake Process/tickmark.svg" /></a><p class="p_dark">Processed </p></div><div class="stepwizard-step"><a href="javascript:void(0)" type="button" class="btn btn-default btn-circle"></a><p class="p_light">Shipped</p></div><div class="stepwizard-step"><a href="javascript:void(0)" type="button" class="btn btn-default btn-circle">4</a><p class="p_light">Delivered</p></div></div>
      :LoadedData.order_status=='4' ?
      <div class="stepwizard-row setup-panel"><div class="stepwizard-step"><a href="javascript:void(0)" type="button" class="btn btn-primary btn-circle"><img src="../images/patient/img/Patient Intake Process/tickmark.svg" /></a><p class="p_dark">Order Placed</p></div><div class="stepwizard-step"><a href="javascript:void(0)" type="button" class="btn btn-primary btn-circle"><img src="../images/patient/img/Patient Intake Process/tickmark.svg" /></a><p class="p_dark">Prescription Verified </p></div><div class="stepwizard-step"><a href="javascript:void(0)" type="button" class="btn btn-primary btn-circle"><img src="../images/patient/img/Patient Intake Process/tickmark.svg" /></a><p class="p_dark">Processed </p></div><div class="stepwizard-step"><a href="javascript:void(0)" type="button" class="btn btn-primary btn-circle"><img src="../images/patient/img/Patient Intake Process/tickmark.svg" /></a><p class="p_dark">Shipped</p></div><div class="stepwizard-step"><a href="javascript:void(0)" type="button" class="btn btn-default btn-circle"></a><p class="p_light">Delivered</p></div></div>
      :LoadedData.order_status=='5' ?
      <div class="stepwizard-row setup-panel"><div class="stepwizard-step"><a href="javascript:void(0)" type="button" class="btn btn-primary btn-circle"><img src="../images/patient/img/Patient Intake Process/tickmark.svg" /></a><p class="p_dark">Order Placed</p></div><div class="stepwizard-step"><a href="javascript:void(0)" type="button" class="btn btn-primary btn-circle"><img src="../images/patient/img/Patient Intake Process/tickmark.svg" /></a><p class="p_dark">Prescription Verified </p></div><div class="stepwizard-step"><a href="javascript:void(0)" type="button" class="btn btn-primary btn-circle"><img src="../images/patient/img/Patient Intake Process/tickmark.svg" /></a><p class="p_dark">Processed </p></div><div class="stepwizard-step"><a href="javascript:void(0)" type="button" class="btn btn-primary btn-circle"><img src="../images/patient/img/Patient Intake Process/tickmark.svg" /></a><p class="p_dark">Shipped</p></div><div class="stepwizard-step"><a href="javascript:void(0)" type="button" class="btn btn-primary btn-circle"><img src="../images/patient/img/Patient Intake Process/tickmark.svg" /></a><p class="p_dark">Delivered</p></div></div>
      :LoadedData.order_status=='6' ?
      <div class="stepwizard-row setup-panel"><div class="stepwizard-step"><a href="javascript:void(0)" type="button" class="btn btn-primary btn-circle"><img src="../images/patient/img/Patient Intake Process/tickmark.svg" /></a><p class="p_dark">Order Placed</p></div><div class="stepwizard-step"><a href="javascript:void(0)" type="button" class="btn btn-primary btn-circle"><img src="../images/patient/img/Patient Intake Process/tickmark.svg" /></a><p class="p_light">Cancelled </p></div></div>
      :""
      }
      </div>




      
      </div>
      </div>
      {/* <a href="#"><p class="cancel_txt">Cancel Item</p></a>  */}
      </div>
      </div>
      </div>
          )
        }
        });
      
        this.state.ordersView=ordersView;
      }
    })
    .catch((error) => {
      toast.error(error);
    });
  }


  
  handleAddressChange = (search_address) => {
    this.setState({ search_address });
  };

  setSearchAddressLatLong = (latLng) => {
    let search_address_latitude = latLng.lat;
    let search_address_longitude = latLng.lng;
    this.setState({
      search_latitude: search_address_latitude,
      search_longitude: search_address_longitude,
    });
    localStorage.setItem("search_latitude", search_address_latitude);
    localStorage.setItem("search_longitude", search_address_longitude);

    if (this.state.detected_address) {
      console.clear();
      // console.log(this.state.detected_address);
      // console.log("Detected_address_lat >> " + this.state.search_latitude);
      // console.log("Detected_address_long >> " + this.state.search_longitude);
    }
  };
 
  handleAddressSelect = (search_address) => {
    geocodeByAddress(search_address)
      .then((results) => getLatLng(results[0]))
      .then((latLng) => this.setSearchAddressLatLong(latLng))
      .catch((error) => console.error("Error", error));
  };


  //get current location
  getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(function (position) {
        // var positionInfo = "Your current position is (" + "Latitude: " + position.coords.latitude + ", " + "Longitude: " + position.coords.longitude + ")";
        var url =
          "https://maps.googleapis.com/maps/api/geocode/json?latlng=" +
          position.coords.latitude +
          "," +
          position.coords.longitude +
          "&key=AIzaSyDf9nNe-DZ5ICYu1tIPqRVfOaAMz16mNfw";
        $.getJSON(url, function (data, textStatus) {
          var streetaddress = data.results[0].formatted_address;
          localStorage.setItem("detected_address", streetaddress);
          // console.clear();
          // console.log(streetaddress);
          
          //alert(streetaddress);
          //return streetaddress;
        });
      });

      let detected_address = localStorage.getItem('detected_address');
      if(detected_address){
        this.setState({ detected_address: detected_address });
        this.handleAddressSelect(this.state.detected_address);
        setTimeout(function(){ localStorage.removeItem("detected_address"); }, 3000);
      }
    }
  };
  
// select retailer
selectRetailer=()=>{
  let patientId=this.state.patientId;
  if(patientId){
    window.location.href = "./selectretailer";
  }
}

// Redirec to login page

loginRedirect=()=>{
  localStorage.setItem("ordermedicineredirect",'1');
    window.location.href = "./PatientLogin";
  
}


// Trending Products
mostOrderProducts=()=>{
    
  Httpconfig.httptokenget(Constant.siteurl +"api/OM/MedicineDetails/getMostOrderedMedicines",)
  .then((response) => {
    console.clear();
    console.log(response);
    if (response.data.status == "200" && response.data.error == false) {
      this.state.mostOrderProducts=response.data.data;
     // console.log(this.state.mostOrderProducts);
      this.forceUpdate();
      
      
    }
  })
  .catch((error) => {
    toast.error(error);
  });
}

viewAllMostOrderedProdcuts=()=>{
  this.state.home="collapse-hide";
  this.state.searchproductslist="collapse-show";
  this.state.cartDetailsPageSection='collapse-hide';
  this.state.downloadSection='collapse-hide';
  this.forceUpdate();

  Httpconfig.httptokenget(Constant.siteurl +"api/OM/MedicineDetails/getMostOrderedMedicines",)
  .then((response) => {
    console.clear();
    console.log(response);
    if (response.data.status == "200" && response.data.error == false) {
     // this.state.mostOrderProducts=response.data.data;
     // console.log(this.state.mostOrderProducts);
     if(Object.keys(response.data.data).length>0){
      // const medicineDetailsView= response.data.result.map((finalLoadedData,num)=>{ 
      //   return(
      //     <li id={finalLoadedData.id} onClick={this.handleChange} > {finalLoadedData.medicinename +" "+finalLoadedData.strength +" "+ finalLoadedData.size}</li>
      //   )
      // });
      alert("in");
      
      const medicineProductsView= response.data.data.map((LoadedData,num)=>{ 
        return(
          <div class="col-lg-4 col-md-6">
          <div class="order_list_box">
          <img src={this.getProductImage(LoadedData.products_master_tbl.form)} alt="Image" />
          <div class="order_list_content">
          <h2>{LoadedData.products_master_tbl.medicinename}</h2>
          <p>{LoadedData.products_master_tbl.size}</p>
          <h5></h5> 
          <span></span>
          <div class="total_box">
          <p class="total_price" >₦ <span id={"total-"+LoadedData.products_master_tbl.id}>{LoadedData.products_master_tbl.mrp}</span> </p>
        
          <div class="input-group number-spinner">
          <div class="input-group-btn">
          <button class="btn btn-default minus_btn" data-dir="dwn" id={"minus-"+LoadedData.id} onClick={this.qtyDecrement}><i class="fa fa-minus"></i></button>
          </div>
          <input type="text" class="form-control text-center" maxLenght={2} defaultValue="1" id={"qty-"+LoadedData.products_master_tbl.id}  readOnly="readOnly"/>
          <div class="input-group-btn">
          <button class="btn btn-default plus_btn" data-dir="up" id={"plus-"+LoadedData.products_master_tbl.id} onClick={this.qtyIncrement}><i class="fa fa-plus"></i></button>
          </div>
          </div>

          <div class="add_btn_sec">
          <a href="javascript:void(0)"><p id={LoadedData.products_master_tbl.id} onClick={this.addToCart} class="add_btn">Add</p></a>
            </div>
          </div>
          </div>
          </div>
          </div>
        )
      });
      this.setState({
       // medicineOptions:medicineDetailsView,
        medicineProductsView:medicineProductsView,
      });
      this.forceUpdate();
    }else{
      this.state.medicineOptions="";
      this.state.medicineProductsView="";
      this.forceUpdate();
      
    }
      
      
    }
  })
  .catch((error) => {
    toast.error(error);
  });
}
  


// Patient suggested Products
suggestedProducts=()=>{
  Httpconfig.httptokenget(Constant.siteurl +"api/OM/orderProcess/lastOrderDetails",)
  .then((response) => {
    if (response.data.status == "200" && response.data.error == false) {
      this.state.suggestedProducts=response.data.data;
      //console.log(this.state.mostOrderProducts);
      this.forceUpdate();
    }
  })
  .catch((error) => {
    toast.error(error);
  });

}  
getManufacturers=()=>{
  Httpconfig.httptokenget(Constant.siteurl +"api/OM/MedicineDetails/getManufacturerDetails",)
  .then((response) => {
    if (response.data.status == "200" && response.data.error == false) {
      this.state.manufacturers=response.data.data;
      //console.log(this.state.mostOrderProducts);
      this.forceUpdate();
    }
  })
  .catch((error) => {
    toast.error(error);
  });

}

productDetails=(event)=>{
  let searched= event.currentTarget.id;
  let searchedData=searched.split("-");
  let search=searchedData[1];

  let medicineName=searchedData[0];
  this.state.selelcteMedicineId=search;
  this.state.selelcteMedicineName=medicineName;
  this.state.medicineOptions="";
  $('#medicineList').val('');
  $('#medicineList').val(medicineName);
  this.state.search=medicineName;
  this.state.home="collapse-hide";
  this.state.searchproductslist="collapse-show";
  this.state.cartDetailsPageSection='collapse-hide';
  this.state.downloadSection='collapse-hide';
  this.forceUpdate();


  if(search!=""){
    Httpconfig.httptokenget(
     // Constant.siteurl + "api/OM/MedicineDetails/MedicineSearchDetails",
     Constant.siteurl + "api/productMaster/fetchdata/"+search,
     // {"medicine_name":search,"patient_id":this.state.patientId}
      //Constant.siteurl + "api/OM/retailerProduct/medicine/"+search
    ).then((response) => {
      this.state.searchCount=Object.keys(response.data.data).length;
      this.state.search=search;
      if(Object.keys(response.data.data).length>0){
        // const medicineDetailsView= response.data.result.map((finalLoadedData,num)=>{ 
        //   return(
        //     <li id={finalLoadedData.id} onClick={this.handleChange} > {finalLoadedData.medicinename +" "+finalLoadedData.strength +" "+ finalLoadedData.size}</li>
        //   )
        // });
        
        const medicineProductsView= response.data.data.map((LoadedData,num)=>{ 
          return(
            <div class="col-lg-4 col-md-6">
            <div class="order_list_box">
            <img src={this.getProductImage(LoadedData.form)} alt="Image" />
            <div class="order_list_content">
            <h2>{LoadedData.medicinename}</h2>
            <p>{LoadedData.size}</p>
            <h5></h5> 
            <span></span>
            <div class="total_box">
            <p class="total_price" >₦ <span id={"total-"+LoadedData.id}>{LoadedData.mrp}</span> </p>
          
            <div class="input-group number-spinner">
            <div class="input-group-btn">
            <button class="btn btn-default minus_btn" data-dir="dwn" id={"minus-"+LoadedData.id} onClick={this.qtyDecrement}><i class="fa fa-minus"></i></button>
            </div>
            <input type="text" class="form-control text-center" maxLenght={2} defaultValue="1" id={"qty-"+LoadedData.id}  readOnly="readOnly"/>
            <div class="input-group-btn">
            <button class="btn btn-default plus_btn" data-dir="up" id={"plus-"+LoadedData.id} onClick={this.qtyIncrement}><i class="fa fa-plus"></i></button>
            </div>
            </div>

            <div class="add_btn_sec">
            <a href="javascript:void(0)"><p id={LoadedData.id} onClick={this.addToCart} class="add_btn">Add</p></a>
              </div>
            </div>
            </div>
            </div>
            </div>
          )
        });
        this.setState({
         // medicineOptions:medicineDetailsView,
          medicineProductsView:medicineProductsView,
        });
        this.forceUpdate();
      }else{
        this.state.medicineOptions="";
        this.state.medicineProductsView="";
        this.forceUpdate();
        
      }
    });
  }else{
    this.state.medicineOptions="";
    this.state.medicineProductsView="";
    this.forceUpdate();
  }
}

getProductDetailsById=(productId)=>{
  
  if(productId!=""){
    Httpconfig.httptokenget( 
      Constant.siteurl + "api/productMaster/fetchdata/"+productId,
    ).then((response) => {
      this.state.searchCount=Object.keys(response.data.data).length;
      //this.state.search=search;
      if(Object.keys(response.data.data).length>0){
        const medicineProductsView= response.data.data.map((LoadedData,num)=>{ 
          return(
            <div class="col-lg-4 col-md-6">
            <div class="order_list_box">
            <img src="http://placehold.it/250x250" alt="Image" />
            <div class="order_list_content">
            <h2>{LoadedData.medicinename}</h2>
            <p>{LoadedData.size}</p>
            <h5></h5> 
            <span></span>
            <div class="total_box">
            <p class="total_price" >₦ <span id={"total-"+LoadedData.id}>{LoadedData.mrp}</span> </p>
          
            <div class="input-group number-spinner">
            <div class="input-group-btn">
            <button class="btn btn-default minus_btn" data-dir="dwn" id={"minus-"+LoadedData.id} onClick={this.qtyDecrement}><i class="fa fa-minus"></i></button>
            </div>
            <input type="text" class="form-control text-center" defaultValue="1" id={"qty-"+LoadedData.id}  readOnly="readOnly"/>
            <div class="input-group-btn">
            <button class="btn btn-default plus_btn" data-dir="up" id={"plus-"+LoadedData.id} onClick={this.qtyIncrement}><i class="fa fa-plus"></i></button>
            </div>
            </div>

            <div class="add_btn_sec">
            <a href="javascript:void(0)"><p id={LoadedData.id} onClick={this.addToCart} class="add_btn">Add</p></a>
              </div>
            </div>
            </div>
            </div>
            </div>
          )
        });
        this.setState({
         // medicineOptions:medicineDetailsView,
          medicineProductsView:medicineProductsView,
        });
        this.forceUpdate();
      }else{
        this.state.medicineOptions="";
        this.state.medicineProductsView="";
        this.forceUpdate();
        
      }
    });
  }else{
    this.state.medicineOptions="";
    this.state.medicineProductsView="";
    this.forceUpdate();
  }

}

getProductImage=(form)=>{
 let productimg="";
 let images=[
    {"name":"capsule","image":"med_img_capsul_strip.png"},
    {"name":"capsule bottle","image":"med_img_capsulBottle.png"},
    {"name":"condom","image":"med_img_condom.png"},
    {"name":"cream","image":"med_img_cream.png"},
    {"name":"eardrops","image":"med_img_earDrop.png"},
    {"name":"eyedrops","image":"med_img_eyeDrop.png"},
    {"name":"facewash","image":"med_img_facewash.png"},
    {"name":"inhelar","image":"med_img_inhelar.png"},
    {"name":"injection","image":"med_img_injection.png"},
    {"name":"oil","image":"med_img_oil.png"},
    {"name":"powder","image":"med_img_powder.png"},
    {"name":"soap","image":"med_img_soap.png"},
    {"name":"sprey","image":"med_img_spery.png"},
    {"name":"syrup","image":"med_img_syrup.png"},
    {"name":"tablet","image":"med_img_tablet.png"},
    {"name":"condoms","image":"001-condom.svg"},
    {"name":"toothbrush","image":"002-toothbrush.svg"},
    {"name":"skin","image":"003-skin.svg"},
    {"name":"lotion","image":"004-lotion.svg"},
    {"name":"spray","image":"005-spray.svg"},
    {"name":"lipbalm","image":"007-lip-balm.svg"},
    {"name":"soap","image":"008-soap.svg"},
    {"name":"oral powder","image":"med_img_powder.png"},
    {"name":"Tablet Oral Suspension","image":"med_img_syrup.png"},
    {"name":"Oral Suspension","image":"med_img_syrup.png"},
    {"name":"handwash","image":"handwash.svg"},
    
    
    
    
    
  ]
  const result = images.filter(images => images.name.toLowerCase().trim()==form.toLowerCase().trim()).map(filteredImage => {
    return filteredImage.image;
  })
  
  if(result!=""){
    productimg="../images/productimages/"+result;
  }else{
    productimg="http://placehold.it/250x250";
  }
return productimg; 
}
// redirect to Myorder page
myOrders=()=>{
  window.location.href = "./myOrders";
}

// Get all the Manafacturers list
getBrands=()=>{
  
  
    Httpconfig.httptokenget( 
      Constant.siteurl + "api/OM/MedicineDetails/getManufacturerDetails",
    ).then((response) => {
      this.state.searchCount=Object.keys(response.data.data).length;
      //this.state.search=search;
      this.state.brandsList=response.data.data;
      if(Object.keys(response.data.data).length>0){
        const medicineBrandsView= response.data.data.map((LoadedData,num)=>{ 
          return(
          <React.Fragment>
             <p><input type="checkbox" name={LoadedData.manufacturer} class="filter_check" id={LoadedData.id} value={LoadedData.manufacturer} onChange={this.handleBrandChange}/>{LoadedData.manufacturer}</p>
            </React.Fragment>
          )
        });
        this.setState({
         // medicineOptions:medicineDetailsView,
          medicineBrandsView:medicineBrandsView,
          medicineBrandsViewOri:medicineBrandsView,
        });
        this.forceUpdate();
      }else{
        this.state.medicineBrandsView="";
        this.forceUpdate();
        
      }
    });
  

}

// Get all the Manafacturers list
getMedicineForm=()=>{
  
  
  Httpconfig.httptokenget( 
    Constant.siteurl + "api/OM/MedicineDetails/getFormDetails",
  ).then((response) => {
    this.state.searchCount=Object.keys(response.data.data).length;
    this.state.drugFormList=response.data.data;
    if(Object.keys(response.data.data).length>0){
      
      const medicineFormView= response.data.data.map((LoadedData,num)=>{ 
        return(
        <React.Fragment>
           <p><input type="checkbox" class="filter_check" name={LoadedData.manufacturer} id={LoadedData.id} value={LoadedData.form} onChange={this.handleFormChange}/>{LoadedData.form}</p>
          </React.Fragment>
        )
      });
      this.setState({
       medicineFormView:medicineFormView,
      });
      this.forceUpdate();
    }else{
      this.state.medicineFormView="";
      this.forceUpdate();
      
    }
  });


}
// Handle Brand changes
handleBrandChange=(event)=>{
  $('#medicineList').val('');
 var brandArr = [...this.state.brandOptions];
    const value = event.target.value;
    const index = brandArr.findIndex((brand) => brand === value);
    if (index > -1) {
      brandArr = [...brandArr.slice(0, index), ...brandArr.slice(index + 1)];
    } else {
      brandArr.push(value);
    }
    this.state.brandOptions = brandArr;
    this.state.search="";//brandArr;
    this.state.searchCount=0;
    this.forceUpdate();
    this.renderFilter();

}

// seleted brand from homepage changes
handleSeletedBrandChange=(selectedBrand)=>{
  $('#medicineList').val('');
  this.state.home="collapse-hide";
  this.state.searchproductslist="collapse-show";
  this.state.cartDetailsPageSection='collapse-hide';
  this.state.downloadSection='collapse-hide';
 var brandArr = [...this.state.brandOptions];
 console.log(brandArr);
    const value = selectedBrand;//event.target.value;
    $(":checkbox[value='"+value+"']").prop("checked","true");
    const index = brandArr.findIndex((brand) => brand === value);
    if (index > -1) {
      brandArr = [...brandArr.slice(0, index), ...brandArr.slice(index + 1)];
    } else {
      brandArr.push(value);
    }
    this.state.brandOptions = brandArr;
    this.state.search="";//brandArr;
    this.state.searchCount=0;
    this.forceUpdate();
    this.renderFilter();

}
// Handle Drug form Changes
handleFormChange=(event)=>{
  $('#medicineList').val('');
  var formArr = [...this.state.formOptions];
    const value = event.target.value;
    const index = formArr.findIndex((form) => form === value);
    if (index > -1) {
      formArr = [...formArr.slice(0, index), ...formArr.slice(index + 1)];
    } else {
      formArr.push(value);
    }
    this.state.formOptions = formArr;
    this.forceUpdate();
    this.renderFilter();
}


// Filter the data
renderFilter=()=> {
  
    Httpconfig.httptokenpost(
    Constant.siteurl + "api/OM/MedicineDetails/getSearchFromProductMaster",
      {"manufacturer":this.state.brandOptions,"form":this.state.formOptions}
      
    ).then((response) => {
      this.state.searchCount=Object.keys(response.data.data).length;
      //this.state.search=search;
      this.state.prodcutsList=response.data.data;
      if(Object.keys(response.data.data).length>0){
        
        const medicineProductsView= response.data.data.map((LoadedData,num)=>{ 
          return(
            <div class="col-lg-4 col-md-6">
            <div class="order_list_box">
            <img src={this.getProductImage(LoadedData.form)} alt="Image" />
            <div class="order_list_content">
            <h2>{LoadedData.medicinename}</h2>
            <p>{LoadedData.size}</p>
            <p>{LoadedData.form}</p> 
            <span></span>
            <div class="total_box">
            <p class="total_price" >₦ <span id={"total-"+LoadedData.id}>{LoadedData.mrp}</span> </p>
          
            <div class="input-group number-spinner">
            <div class="input-group-btn">
            <button class="btn btn-default minus_btn" data-dir="dwn" id={"minus-"+LoadedData.id} onClick={this.qtyDecrement}><i class="fa fa-minus"></i></button>
            </div>
            <input type="text" class="form-control text-center" defaultValue="1" id={"qty-"+LoadedData.id} readOnly="readOnly"/>
            <div class="input-group-btn">
            <button class="btn btn-default plus_btn" data-dir="up" id={"plus-"+LoadedData.id} onClick={this.qtyIncrement}><i class="fa fa-plus"></i></button>
            </div>
            </div>

            <div class="add_btn_sec">
            <a href="javascript:void(0)"><p id={LoadedData.id} onClick={this.addToCart} class="add_btn">Add</p></a>
              </div>
            </div>
            </div>
            </div>
            </div>
          )
        });
        this.setState({
         // medicineOptions:medicineDetailsView,
          medicineProductsView:medicineProductsView,
        });
        this.forceUpdate();
      }else{
      //  this.state.medicineOptions="";
        this.state.medicineProductsView="";
        this.forceUpdate();
        
      }
    });
  
}

//Clear all filter
clearAllFilters=()=>{
  $('#medicineList').val('');
  this.state.brandOptions="";
  this.state.formOptions="";
  this.state.search="";
  this.state.searchCount=0;
  this.state.medicineProductsView="";
  var brandList=this.state.brandsList;
  var formList=this.state.drugFormList;
  
  $('.filter_check').prop("checked",false);
  $('#brandSearch').val('');
  $('#formSearch').val('');
  
  // clear and add orginal brands
  const medicineBrandsView= brandList.map((LoadedData,num)=>{ 
    return(
    <React.Fragment>
      <p><input type="checkbox" class="filter_check" id={LoadedData.id} value={LoadedData.manufacturer} onChange={this.handleBrandChange}/>{LoadedData.manufacturer}</p>
      </React.Fragment>
    )
  });
  this.setState({
    medicineBrandsView:medicineBrandsView,
  });
  // clear and add orginal form
  const medicineFormView= formList.map((LoadedData,num)=>{ 
    return(
    <React.Fragment>
       <p><input type="checkbox" class="filter_check" id={LoadedData.id} value={LoadedData.form} onChange={this.handleFormChange}/>{LoadedData.form}</p>
      </React.Fragment>
    )
  });
  this.setState({
   medicineFormView:medicineFormView,
  });

  this.forceUpdate();
}

// Sort by Low to High
sortLowToHigh=()=>{
 var products=this.state.prodcutsList;
 products=products.sort((a, b) => parseFloat(a.mrp) - parseFloat(b.mrp));
 
 const medicineProductsView= products.map((LoadedData,num)=>{ 
   return(
     <div class="col-lg-4 col-md-6">
     <div class="order_list_box">
     <img src={this.getProductImage(LoadedData.form)} alt="Image" />
     <div class="order_list_content">
     <h2>{LoadedData.medicinename}</h2>
     <p>{LoadedData.size}</p>
     <p>{LoadedData.form}</p> 
     <span></span>
     <div class="total_box">
     <p class="total_price" >₦ <span id={"total-"+LoadedData.id}>{LoadedData.mrp}</span> </p>
   
     <div class="input-group number-spinner">
     <div class="input-group-btn">
     <button class="btn btn-default minus_btn" data-dir="dwn" id={"minus-"+LoadedData.id} onClick={this.qtyDecrement}><i class="fa fa-minus"></i></button>
     </div>
     <input type="texxt" class="form-control text-center" defaultValue="1" id={"qty-"+LoadedData.id} readOnly="readOnly" />
     <div class="input-group-btn">
     <button class="btn btn-default plus_btn" data-dir="up" id={"plus-"+LoadedData.id} onClick={this.qtyIncrement}><i class="fa fa-plus"></i></button>
     </div>
     </div>
 
     <div class="add_btn_sec">
     <a href="javascript:void(0)"><p id={LoadedData.id} onClick={this.addToCart} class="add_btn">Add</p></a>
       </div>
     </div>
     </div>
     </div>
     </div>
   )
 });
 this.setState({
   medicineProductsView:medicineProductsView,
 });
 this.forceUpdate();
}

// Sort by High to low
sortHighToLow=()=>{
  
 // homes.sort((a, b) => parseFloat(.price) - parseFloat(b.price)); // Asc
 var products=this.state.prodcutsList;
 console.log(products);
 
products=products.sort((a, b) => parseFloat(b.mrp) - parseFloat(a.mrp));

const medicineProductsView= products.map((LoadedData,num)=>{ 
  return(
    <div class="col-lg-4 col-md-6">
    <div class="order_list_box">
    <img src={this.getProductImage(LoadedData.form)} alt="Image" />
    <div class="order_list_content">
    <h2>{LoadedData.medicinename}</h2>
    <p>{LoadedData.size}</p>
    <p>{LoadedData.form}</p> 
    <span></span>
    <div class="total_box">
    <p class="total_price" >₦ <span id={"total-"+LoadedData.id}>{LoadedData.mrp}</span> </p>
  
    <div class="input-group number-spinner">
    <div class="input-group-btn">
    <button class="btn btn-default minus_btn" data-dir="dwn" id={"minus-"+LoadedData.id} onClick={this.qtyDecrement}><i class="fa fa-minus"></i></button>
    </div>
    <input type="text" class="form-control text-center" defaultValue="1" id={"qty-"+LoadedData.id} readOnly="readOnly"/>
    <div class="input-group-btn">
    <button class="btn btn-default plus_btn" data-dir="up" id={"plus-"+LoadedData.id} onClick={this.qtyIncrement}><i class="fa fa-plus"></i></button>
    </div>
    </div>

    <div class="add_btn_sec">
    <a href="javascript:void(0)"><p id={LoadedData.id} onClick={this.addToCart} class="add_btn">Add</p></a>
      </div>
    </div>
    </div>
    </div>
    </div>
  )
});
this.setState({
 // medicineOptions:medicineDetailsView,
  medicineProductsView:medicineProductsView,
});
this.forceUpdate();

}
//Handle Sort
handleSort=(event)=>{
  let selected=event.target.value;
  if(selected=='Price- Low to High'){
    this.sortLowToHigh();
  }
  if(selected=='Price- High to Low'){
    this.sortHighToLow();
  }

}

filterBrands=(event)=>{
let searched=event.target.value;
var pilots=this.state.brandsList;
var brandList = pilots.filter(function (pilot) {
  return pilot.manufacturer.toLowerCase().includes(searched.toLowerCase());
});

const medicineBrandsView= brandList.map((LoadedData,num)=>{ 
  return(
  <React.Fragment>
     <p><input type="checkbox" class="filter_check" id={LoadedData.id} value={LoadedData.manufacturer} onChange={this.handleBrandChange}/>{LoadedData.manufacturer}</p>
    </React.Fragment>
  )
});
this.setState({
  medicineBrandsView:medicineBrandsView,
});
this.forceUpdate();
}


filterDrugForm=(event)=>{
  let searched=event.target.value;
  var pilots=this.state.drugFormList;
  var formList = pilots.filter(function (pilot) {
    return pilot.form.toLowerCase().includes(searched.toLowerCase());
  });
  
  
  const medicineFormView= formList.map((LoadedData,num)=>{ 
    return(
    <React.Fragment>
       <p><input type="checkbox" class="filter_check" id={LoadedData.id} value={LoadedData.form} onChange={this.handleFormChange}/>{LoadedData.form}</p>
      </React.Fragment>
    )
  });
  this.setState({
   medicineFormView:medicineFormView,
  });
  this.forceUpdate();
  }

  handleClear=()=>{
    $('#medicineList').val('');
    this.state.search="";
    this.forceUpdate();
  }

  getManufacturerImage=(name)=>{
    let productimg="";
    let images=[
       {"name":"Adler Products Ltd","image":"Adler-Products.png"},
       {"name":"Biogenerics Nigeria Limite","image":"Biogenerics.png"},
       {"name":"Biomedicine Sckivs Pharma Nig. Ltd","image":"Biomedicine.png"},
       {"name":"Biosphere Pharmaceuticals Ltd","image":"bioSphere.png"},
       {"name":"Canopus West African Limited","image":"canopus.png"},
       {"name":"Carrot-Top Drugs Ltd","image":"Carrot-Top-Drugs.png"},
       {"name":"Ceemike Pharmaceutical co. Ltd","image":"Ceemike-Pharmaceutical.png"},
       {"name":"Chan Medi-Pharm Ltd","image":"Chan-Medi-Pharm.png"},
       {"name":"Dortemag Ventures Ltd","image":"Dortemag-Ventures.png"},
       {"name":"Faes Farma Nigeria Ltd","image":"Faes-Farma-Nigeria.png"},
       {"name":"Gentlehills Limited","image":"Gentlehills-Limited.png"},
       {"name":"Laider International (W.A) Ltd","image":"Laider-International.png"},
       {"name":"Miraflash Nigeria Ltd.","image":"Miraflash Nigeria Ltd.png"},
       {"name":"Mopson Pharmaceuticals Ltd","image":"Mopson-Pharmaceuticals.png"},
       {"name":"NCI Pharm Chem Ind. Ltd","image":"NCI-Pharm-Chem.png"},
       {"name":"Nectar Heathcare Ltd","image":"Nectar-Heathcare.png"},
       {"name":"Nigeria-German Chemicals Plc (NGC)","image":"Nigeria-German.png"},
       {"name":"Pacmai International Limited","image":"Pacmai.png"},
       {"name":"Pharmaplus  Nigeria Ltd","image":"Pharmaplus  Nigeria.png"},
       {"name":"Reals Pharmaceuticals Ltd","image":"Reals Pharmaceuticals.png"},
       {"name":"Servier International","image":"Servier International.png"},
       {"name":"SoftHealth Pharmaceuticals Ltd","image":"SoftHealth.png"},
       {"name":"Teta Pharmaceutical Nig. Ltd","image":"Teta-Pharmaceutical.png"},
       {"name":"Theodor Pharmaceutical Ltd","image":"Therapeutic-Laboratories.png"},
       {"name":"Vitahealth Ltd","image":"Vitahealth.png"},
       
       
       
       
     ]
     const result = images.filter(images => images.name.toLowerCase().trim()==name.toLowerCase().trim()).map(filteredImage => {
       return filteredImage.image;
     })
     
     if(result!=""){
       productimg="../images/manufacturerimages/"+result;
     }else{
       productimg="http://placehold.it/250x250";
     }
   return productimg; 
   }
   

   removeSelectedItems=(id)=>{
    // alert(id);
    //alert(id);
    $("input[name='"+id+"']").prop("checked",false);
   // $('#'+id).prop("checked",false);
    //$('#'+id).attr('checked', false);
    var brandArr = [...this.state.brandOptions];
    const value = id;//event.target.value;
    const index = brandArr.findIndex((brand) => brand === value);
    //alert(index);
    if (index > -1) {
      brandArr = [...brandArr.slice(0, index), ...brandArr.slice(index + 1)];
    } else {
      brandArr.push(value);
    }
    
    this.state.brandOptions = brandArr;
    this.state.search="";//brandArr;
    this.state.searchCount=0;
    this.forceUpdate();
    this.renderFilter();


   }




  
  render() {
    
    
    return (
      <main id="main_ord_nav">
      <PatientHeader/>
      <I18nPropvider locale={this.state.Language} >
      {/* Order medicine div stars */}
      <section id="order_medicine_section">
      <div class="tab-pane fade show active" id="nav-order" role="tabpanel" aria-labelledby="nav-order-tab">
      <div class="order_search">
      <div class="container">
      <div class="row">
      <div class="col-md-3">

      <div className="row">

                        <PlacesAutocomplete
                          value={
                            this.state.detected_address
                              ? this.state.detected_address
                              : this.state.search_address
                          }
                          onChange={this.handleAddressChange}
                          onSelect={this.handleAddressSelect}
                          // searchOptions={searchOptions}
                          shouldFetchSuggestions={
                            this.state.search_address.length > 4
                          }
                        >
                          {({
                            getInputProps,
                            suggestions,
                            getSuggestionItemProps,
                            loading,
                          }) => (
                            <div>
                              <input
                                {...getInputProps({
                                  placeholder: "Search Places ...",
                                  className: "location-search-input order_select",
                                })}
                              />
                              <div className="autocomplete-dropdown-container">
                                {loading && <div>Loading...</div>}
                                {suggestions.map((suggestion) => {
                                  const className = suggestion.active
                                    ? "suggestion-item--active"
                                    : "suggestion-item";
                                  // inline style for demonstration purpose
                                  const style = suggestion.active
                                    ? {
                                        backgroundColor: "#fafafa",
                                        cursor: "pointer",
                                      }
                                    : {
                                        backgroundColor: "#ffffff",
                                        cursor: "pointer",
                                      };
                                  return (
                                    <div
                                      {...getSuggestionItemProps(suggestion, {
                                        className,
                                        style,
                                      })}
                                    >
                                      <span>{suggestion.description}</span>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          )}
                        </PlacesAutocomplete>
                      </div>

                      {/* <PatientGetLocations/> */}




      {/* <PatientGetLocations/> */}


      
      {/* <select class="form-control order_select">
      <option>Hyderabad</option>
      <option>Agra</option>
      <option>Delhi</option>
      <option>Mumbai</option>
      </select> */}
      <div class="input-group-btn detect_btn">
      <button class="btn btn-default" type="button" onClick={this.getCurrentLocation}>
      <img class="det_img" src="../images/patient/img/Ordermedicine/detectLocation.svg"/>
      Detect
      </button>
      </div>
       <span class="loc_img"><img  src="../images/patient/img/Ordermedicine/locationIcon.svg" /></span> 
      </div>
      
      <div class="col-md-7">
      <div class="order_input">
      <input type="text" class="form-control" id="medicineList" placeholder="Search  1,50,000 + Medicines" onKeyUp={this.fetchmedicinedata}  autocomplete="off"/> 
      <img class="remove_icon" src="https://www.flaticon.com/svg/static/icons/svg/59/59836.svg" onClick={this.handleClear} />
      <span><img class="search_img" src="../images/patient/img/Ordermedicine/search.svg" /></span>
      <ul id="searchResult">{this.state.medicineOptions}</ul>
      
      </div>
      </div>
      <div class="col-md-2 order_cart">
      <a  href="#"  onClick={this.miniCart}>
      <img class="cart_ico" src="../images/patient/img/Ordermedicine/shopping-cart.svg" />
      <div class="cart_bar">{this.state.cartItemsCount}</div>
      <span>cart</span>
      </a>
      </div>
      </div> 
      </div>
      </div>
      
      <div class={this.state.home}>
      <section id="order_med_banner">
      <div id="carouselExampleControls1" class="carousel slide" data-ride="carousel">
      
      {/* <!-- The slideshow --> */}
      <div class="carousel-inner">
      
      <OwlCarousel ref="Banner" items={1}  
      className="owl-theme"  
      loop  
      nav 
      dots
      margin={8}>
      <div >
      <img src="https://www.medxplorer.com/images/slider5.jpg" alt="" />
      </div>
      <div >
      <img src="https://www.medxplorer.com/images/slider5.jpg" alt="" />
      </div> 
      <div >
      <img src="https://www.medxplorer.com/images/slider5.jpg" alt="" />
      </div>
      </OwlCarousel>
      </div>
      
      </div>
      </section>
      {this.state.patientId!="" && Object.keys(this.state.ordersView).length>0 ?
      <section id="recent_order">
      <div class="status_section">
      <div class="container">
      <div class="row">
      <div class="col-md-12">
      <div class="status_head">
      <h2>Your Recent Order Status</h2>
      <a onClick={this.myOrders}><p>My Orders</p></a> 
      </div>
      </div>
      </div>
      {this.state.ordersView}
      </div>
      </div>
      </section>
      :""}
      {this.state.mostOrderProducts ?
      
      <section id="trending_pro">
      <div class="container">
      <div class="row">
      <div class="col-md-12">
      <div class="trending_head">
      <h2>Trending Products</h2>
      <a href="#" onClick={this.viewAllMostOrderedProdcuts}><p>View All</p></a>
      </div>
      <div class="trending_carousel">
      <div class="owl-carousel owl-theme">
      
      <OwlCarousel ref="trendingproducts" items={5}  
        className="owl-theme"  
        loop  
        margin={8}>

        { this.state.mostOrderProducts.map((product,num) => (
          
          <div class="item" id={product.products_master_tbl.medicinename+"-"+product.products_master_tbl.id} onClick={this.productDetails}>
          <img src={this.getProductImage(product.products_master_tbl.form)} alt="Image" />
          {/* <img src="http://placehold.it/250x250" alt="Image" /> */}
          <div class="trending_content">   
          <h2>{product.products_master_tbl.medicinename ? product.products_master_tbl.medicinename : ""}</h2>  
          <div>{product.products_master_tbl.manufacturer ? product.products_master_tbl.manufacturer : ""}</div>
          <p><span>₦ {product.products_master_tbl.mrp ? product.products_master_tbl.mrp : ""}</span></p>  
          {/* <p>4% Off</p> */}
          </div>
          </div> 
        ))
      }
      </OwlCarousel>
     
      
      </div>
      </div>
      </div>
      </div>
      </div>
      </section>
      : "" }
      {this.state.patientId!="" && this.state.suggestedProducts ?
      <section id="suggested_you">
      <div class="container">
      <div class="row">
      <div class="col-md-12">
      <div class="suggest_head">
      <h2>Suggested For You</h2>
      <a href="#"><p>View All</p></a>
      </div>
      <div class="suggest_carousel">
      <div class="owl-carousel owl-theme">
      <OwlCarousel ref="trendingproducts" items={5}  
        className="owl-theme"  
        loop  
        margin={8}>

        { this.state.suggestedProducts.map((product,num) => (
          
          <div class="item" id={product.products_master_tbl.medicinename+"-"+product.products_master_tbl.id} onClick={this.productDetails}>
          <img src={this.getProductImage(product.products_master_tbl.form)} alt="Image" />
          {/* <img src="http://placehold.it/250x250" alt="Image" /> */}
          <div class="suggest_content">   
          <h2>{product.products_master_tbl.medicinename}</h2>  
          <div>{product.products_master_tbl.manufacturer}</div>
          <p> <span>₦ {product.products_master_tbl.mrp}</span></p>  
          {/* <p>4% Off</p>*/}
          </div>
          </div> 
        ))
      }
      </OwlCarousel>
      </div>
      </div>
      </div>
      </div>
      </div>
      </section>
      : "" }
      
      {this.state.manufacturers ?
      <section id="top_brands">
      <div class="container">
      <div class="row">
      <div class="col-md-12">
      <div class="top_brand_head">
      <h2>Top Brands</h2>
      <a href="#"><p>View All</p></a>
      </div>
      <div class="top_brand_carousel">
      <div class="owl-carousel owl-theme">
      <OwlCarousel ref="trendingproducts" items={5}  
        className="owl-theme"  
        loop  
        margin={8}>

        { this.state.manufacturers.map((product,num) => (
          <div class="item" onClick={this.handleSeletedBrandChange.bind(this,product.manufacturer)}> 
          {/* <img src="http://placehold.it/250x250" alt="Image" /> */}
          <img src={this.getManufacturerImage(product.manufacturer)} alt="Image" title={product.manufacturer} />
          
          <div class="suggest_content">
          <div>{product.manufacturer}</div>
          </div>
          </div> 
        ))
      }
      </OwlCarousel>
      </div>
      </div>
      </div>
      </div>
      </div>
      </section>
      :""}
      </div>
      


      
      <section id="order_pro_list" class={this.state.searchproductslist}>
      <div class="container-fluid">
      <div class="row">
      <div class="col-md-12">
      <div class="order_breadcrumb">
      <ul>
      <li> <a href="./ordermedicinehome">Home</a></li>  
      <span>/</span>
      <li>Product</li>
      </ul>
      </div>
     
      </div>
      </div>
      
      <div class="row">
      <div class="col-lg-3">
      <div class="product_seach_filter">
    <div class="filter_box">
      <div class="filter_head">
      <h2>Filter <a href="#" onClick={this.clearAllFilters}><span>Clear All</span></a></h2>
    </div>
    <div class="filter_content">
      <h2>Brands</h2>
      <input type="text" id="brandSearch"class="form-control search_filter" placeholder="search your brands" onKeyUp={this.filterBrands}/> 
      <span><img class="search_img" src="../images/patient/img/Ordermedicine/search.svg" /></span>
      <div class="filter_list">
      {this.state.medicineBrandsView ? this.state.medicineBrandsView :" No brands found"}
      </div>
    </div>
    </div>

    <div class="filter_box">
    <div class="filter_content">
      <h2>Drug Form</h2>
      <input type="text" class="form-control search_filter" id="formSearch" placeholder="search your drugs" onKeyUp={this.filterDrugForm}/> 
      <span><img class="search_img" src="../images/patient/img/Ordermedicine/search.svg" /></span>
      <div class="filter_list">
      {this.state.medicineFormView ? this.state.medicineFormView :" No drug form found"}
      </div>
    </div>
    </div>
  </div>
      </div>
      <div class="col-lg-9">
      <div class="order_list_head">
     
      <p>Showing <span>{this.state.searchCount}</span> search results for <span>{this.state.search ? '\"'+this.state.search+'"' :""}</span></p>
      <div class="search_rel">
        <select class="form-control" onChange={this.handleSort}>
          {/* <option>Relevance</option>
          <option>Popularity</option> */}
          <option>Price- Low to High</option>
          <option>Price- High to Low</option>
        </select>
      </div>
      <div class="search_products">
      {/* {console.log(this.state.brandOptions)} */}
      {this.state.brandOptions ?
      this.state.brandOptions.map((brand,num) => (
        <h5>{brand}<a href="#" onClick={this.removeSelectedItems.bind(this,brand)}><img class="cross_icon" src="https://www.flaticon.com/svg/static/icons/svg/59/59836.svg" /></a></h5>
      ))
      :""
      }
      </div>
      <h2>Products</h2>
      </div>
      <div class="order_list_sec">
      <div class="row">
      {this.state.medicineProductsView}
      </div>
      
      </div>
      </div>
      </div>

      
      </div>
      </section>
      
      
      {/* <!-- cart details popup Toast-bar code --> */}
      
       <div id="order_pro_toast" >
      <div class="order_toast_head">
      <h2>Order Summary</h2>
      <div class="toast_amnt">
      <h6>cart price</h6>
      <h3>₦ {this.state.cartTotal ? this.state.cartTotal.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,'):""}</h3>
      </div>
      </div>
      <div class="order_toast_content">
      {this.state.cartDetailsPopup }
      <h2>+<span>{this.state.cartItemsCount}</span>Items</h2>
      <div class="toast_cart_btn">
      <a href="#"  onClick={this.miniCart} ><p>Go to Cart</p></a> 
      </div>
      </div>
      
      </div> 

      {/* cart details section */}
       <section id="order_cart" class={this.state.cartDetailsPageSection}>
         <div class="order_cart_sec">
         <div class="container">
            <div class="row">
                <div class="col-md-12">
                   
                    <div class="order_cart_head">
                        <h2>Review Your Cart</h2>
                        {/* <p>Add patient and Upload prescription</p> */}
                    </div>
                </div>
            </div>
            <div class="order_cart_content">
           
              <div class="row">
                  <div class="col-lg-12">
                  <div class="price_head"><h2>Items</h2></div>
                  
                      {Object.keys(this.state.cartDetailsPage).length>0 ? this.state.cartDetailsPage :"No medicines found"}
                      {/* <div class="order_cart_presc">
                      <div class="presc_head">
                        <div class="presc_img">
                          <img src="img/Date.svg" />
                          </div>
                          <div class="presc_det">
                            <h2>
                              UPLOAD & SEND PRESCRIPTION</h2>
                            <h6>You have one Rx medicine in the item</h6>
                          </div>
                      </div>
                      <div class="order_upload_img">
                        <img src="https://icon-library.com/images/prescription-icon/prescription-icon-18.jpg" />
                        <img src="https://icon-library.com/images/prescription-icon/prescription-icon-18.jpg" />
                      </div>
                      <div class="order_upload_btn">
                        <div class="custom-file-upload">
                
                          <label for="file-upload" class="custom-file-upload1">
                           Upload
                          </label>
                          <p>or Drag & Drop here</p>
                          <input id="file-upload" type="file" />
                          </div>
                      </div>
                    </div> */}
                    {Object.keys(this.state.cartDetailsPage).length>0 ?
                    this.state.patientId ?
                    <div class="cart_ret_btn">
                  <a href="#" onClick={this.selectRetailer}><p>Select Retailer</p></a>
                   </div>
                   :
                   <div class="cart_ret_btn">
                   <a href="#" onClick={this.loginRedirect}><p>Login to Continue shopping</p></a>
                    </div>
                   : ""}
                  </div>
                   {/* <div class="col-lg-2"> */}
                  {/* <div class="order_cart_price">
                    <div class="price_head">
                      <h2>Price Details</h2>
                    </div>
                    <div class="price_box">
                      
                      <div class="price_det">
                        <p>Total price ({this.state.cartItemsCount} items)<span>₦ { this.state.cartTotal ? this.state.cartTotal.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,') :""}</span></p>
                         <p>Shipping charges<span>₦25</span></p>                       
                         </div>
                      <div class="net_amnt">
                        <h3>Net Amount<span>₦ {this.state.cartTotal ? this.state.cartTotal.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,'):"0.00"}</span></h3>
                         <p>Discount 5%<span>₦658 </span></p> 
                        <p>Vat %<span>₦ {this.state.cartTotal ?((this.state.cartTotal *7)/100).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,'):"0.00"}</span></p>
                      </div>
                      <div class="to_paid">
                        <h2>To be paid <span> <h6>Cart price</h6>₦ {this.state.cartTotal ?this.state.cartTotal.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,'):"0.00"}</span></h2>
                      </div>
                    
                    </div>
                  </div> */}
                  
                  {/* </div> */}
                </div>
              </div>
            </div>
           
         </div>
     </section> 
     
      
      
      
      
      </div>
      
      </section>
      
      <section id="order_download_app" class={this.state.downloadSection}>
  <div class="container">
    <div class="row">
      <div class="col-md-6">
        <div class="download_content">
          <h2>Download the Sanar app</h2>
          <h5>Book appointments and health checkups; Order medicines and consult doctors online</h5>
          <p>Get the link to download the app</p>
          <div class="form-group">
            <div class="input-group input-group-md">
              <span class="input-group-addon">+91</span>
              <div class="icon-addon addon-md">
                <input type="number" class="form-control" placeholder="Enter Mobile number" />
                <label for="email" rel="tooltip" title="email"></label>
              </div>
              <span class="input-group-btn">
                <button class="btn btn-default app_btn" type="button">Get App link</button>
              </span>
            </div>
          </div>
          <div class="play_store">
            <a href="#"><img src="../images/patient/img/Ordermedicine/googlepay_d.svg" /></a>
            <a href="#"><img src="../images/patient/img/Ordermedicine/Appstore_d.svg" /></a>
          </div>
        </div>
      </div>
      <div class="col-md-6">
        <div class="app_img">
          <img class="mobile_img" src="../images/patient/img/Ordermedicine/Download_App.png" />
          
        </div>
      </div>
    </div>
  </div>
  
  </section>
      {/* </div>  */}
      <PatientFooter/>
      </I18nPropvider>
      </main>
      
    )
  }
}
//export default Homee;

