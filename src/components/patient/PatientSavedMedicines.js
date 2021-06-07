import React, { Component, useState } from 'react';
import $ from "jquery";
import { ToastContainer, toast } from 'react-toastify';
import  { Redirect } from 'react-router-dom'

import { Link } from "react-router-dom";
import Httpconfig from "../helpers/Httpconfig";
import { Carousel } from "react-responsive-carousel";
import Patnewcss from "../../public/css/patient/style-new.css";
import Constant from "../../constants";
import { FormattedMessage } from "react-intl"; // Backup Way to Convert
import { I18nPropvider, LOCALES } from '../../i18nProvider';
import translate from "../../i18nProvider/translate";
import PatientHeader from "../patient/Patientheader";
import PatientMenu from "../patient/Patientmenu";
import PatientSideMenu from "../patient/Patientsidemenu";
import PatientFooter from "../patient/Patientfooter";
import Patcss from "../../public/css/patient/order-medicine.css";

import { Form } from "semantic-ui-react";

import { DateInput} from "semantic-ui-calendar-react";
import * as SecureLS from 'secure-ls';
const moment = require("moment");

var ls = new SecureLS({
    encodingType: 'aes',
    encryptionSecret:'medleymed'
});



export default class PatientSavedMedicines extends Component {
    
    constructor(props) {
        super(props);
       // let fields = this.state.fields;
        this.state = {
            showlogin: true,
            showsignup: false,
            Language: "",
            date: new Date(),
            name:"",
            user_mobile:"",
            email_id:"",
            token:"",
            userId:"",
            profile_image:'',
            fields: {},
            errors: {},
            PatientGender:"",
        };
       
       
    }
   
    // To get detais after first render
    componentDidMount = () => {
        var retrievedObject=localStorage.getItem('userObj');
        let userData=JSON.parse(retrievedObject);
        let cartData="";
        if(retrievedObject!=null || retrievedObject!=null ){
            this.getSavedMedicineDetails(userData.patient_id);
         this.setState({
            token:userData.accessToken,
            patientId:userData.patient_id
          }); 
        }else{
            window.location.href = "/";
        }
        cartData=localStorage.getItem("cartId");
        //get cart id
      if(cartData!=""){
        this.state.cartId=cartData;
        this.forceUpdate();
      }
    
        
    }
gotoCartPage=()=>{
    localStorage.setItem("savedMedicinesRedirect",1);
    window.location.href = "/ordermedicinehome";
}
    
  // show cart popup
getSavedMedicineDetails=(patientId)=>{
  
  
    Httpconfig.httptokenget(Constant.siteurl + "api/OM/Cart/findAllFavoriteDetails/"+patientId, )
    .then((response) => {
        console.log(response);
        if (response.data.status == "200" && response.data.error == false) {
            const SaveMedicinesList= response.data.data.map((LoadedData,num)=>{
            return(
            <div class="saved_med_box">
                <div class="row">
                    <div class="col-lg-2 col-md-2">
                          <div class="save_med_img">
                          {/* <img src="../images/patient/img/Profile/Date.svg" /> */}
                          <img src={this.getProductImage(LoadedData.products_master_tbl.form)} />
                            
                          </div>
                    </div>
                    <div class="col-lg-10 col-md-10">
                    <div class="save_med_details">
                      
                          <h2>{num+1}. {LoadedData.products_master_tbl.medicinename + " "+ LoadedData.products_master_tbl.strength}
                            </h2>
                          <div class="amount_details"><h5>MRP:₦ {LoadedData.products_master_tbl.mrp} 
                          
                          </h5><p>{"₦"} <span id={"mrp-"+LoadedData.medicine_id}>{LoadedData.products_master_tbl.mrp}</span></p></div>
                          <h4>{LoadedData.products_master_tbl.manufacturer}</h4>
                          <h6><span>{LoadedData.products_master_tbl.size}</span><span>10 tablets</span></h6>
                          <div>
                          <p class="save_txt">   <img src={this.getProductImage(LoadedData.products_master_tbl.form)} />saved</p>
                          <div class="add_btn">
                             <a href="#"><button type="button" onClick={this.updateQuantity.bind(this,LoadedData.medicine_id,LoadedData.id)} >Add</button></a> 
                          </div>
                       </div>
                            <div class=" add_cart_sec">
                              <div class="go_cart_btn">
                                <a href="#">  <button type="button" onClick={this.gotoCartPage} >Go to cart</button></a>
                                  
                              </div>
                              <div class="input-group number-spinner">
                                  <div class="input-group-btn">
                                      
                                      <button class="btn btn-default minus_btn" data-dir="dwn" id={"minus-"+LoadedData.medicine_id} onClick={this.qtyDecrementUpdate.bind(this,LoadedData.medicine_id,LoadedData.id,LoadedData.products_master_tbl.mrp)} ><i class="fa fa-minus"></i></button>
                                  </div>
                                  <input type="text" class="form-control text-center" readOnly="readOnly" value={LoadedData.quantity} id={"qty-"+LoadedData.medicine_id} />
                                  <div class="input-group-btn">
                                  <button class="btn btn-default plus_btn" data-dir="up" id={"plus-"+LoadedData.medicine_id} onClick={this.qtyIncrementUpdate.bind(this,LoadedData.medicine_id,LoadedData.id,LoadedData.products_master_tbl.mrp)}><i class="fa fa-plus"></i></button>
                                      
                                  </div>
                              </div>
                            </div>
                         
                    </div>
                    </div> 
                </div>
               </div>
            )
               })
               this.state.SaveMedicinesList=SaveMedicinesList;
              this.forceUpdate();
        }
    })
    .catch((error) => {
      toast.error(error);
    });
  
  }

// get images based on the form  
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

   //  quanatity decrement
  
  qtyIncrementUpdate=(prodcutId,rowId,mrp)=>{
    let qty=$('#qty-'+prodcutId).val();
    if(qty>=0 && qty<50){

      qty=parseInt(qty)+1;
      $('#qty-'+prodcutId).val('');
      $('#qty-'+prodcutId).val(qty);
      let total=qty*mrp;
      $("#mrp-"+prodcutId).html(total.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,'));
    }
    
    if(qty>=50){
      toast.error("Quantity should not be more than 50");
      return false;
    }

    
  }
  
  // quanatity Increment
  qtyDecrementUpdate=(prodcutId,rowId,mrp)=>{
       let qty=$('#qty-'+prodcutId).val();
    if(qty>1){
      qty=parseInt(qty)-1;
      $('#qty-'+prodcutId).val('');
      $('#qty-'+prodcutId).val(qty);
      let total=qty*mrp;

      $("#mrp-"+prodcutId).html(total.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,'));
    }
    
  }
  // Update quantity
  updateQuantity=(productId,rowId)=>{

    let cartId=this.state.cartId;
    let quanatity=$('#qty-'+productId).val();
    Httpconfig.httptokenpost(Constant.siteurl + "api/OM/Cart",
    
    {"cart_id":cartId,"patient_id":this.state.patientId,"medicine_id":productId,"quantity":quanatity,"shop_id":""}
  )
    .then((response) => {
      if (response.data.status == "200" && response.data.error == false) {
       // this.miniCart();
        
      }
    })
    .catch((error) => {
      toast.error(error);
    });


  }
    
    render() {
        const { languages_data } = this.state;
        
        return (
            
            <main id="main_ord_nav">
            {/* ja-jp */}
            {/* en-us */}
            {/* de-de */}
            {/* fr-ca */}
            <PatientHeader onSelectLanguage={this.handleLanguage}/>
            <I18nPropvider locale={this.state.Language} >
            <section id="order_profile">
            <div class="pro_section">
            <div class="container">
            <div class="row">  
            <div class="col-lg-4 col-md-12 col-sm-12 col-xs-12">
<PatientSideMenu />
            </div>
            
 <div class="col-lg-8 col-md-12 col-sm-12 col-xs-12">
   <section id="saved_med_main">
   <div class="saved_med_sec">
       <div class="row">
           <div class="col-md-12">
               <div class="saved_head">
                   <h2>My Saved Medicine</h2>
               </div>
               <div class="saved_med_list">
               {this.state.SaveMedicinesList ?
               this.state.SaveMedicinesList :" No mediciens found"}
             
            </div>
           </div>
       </div>
   </div>
</section>
        </div>
        </div>
        </div>
        </div>
        </section>
            
            <ToastContainer />
            <PatientFooter/>
            </I18nPropvider>
            </main>
            
            
        )
    }
    
}