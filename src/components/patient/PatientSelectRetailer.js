import React, { Component, useState } from 'react';
import $ from "jquery";
import { ToastContainer } from "react-toastify";
import toast from "../helpers/toast";
import { Link } from "react-router-dom";
import Httpconfig from "../helpers/Httpconfig";
import { reactLocalStorage } from 'reactjs-localstorage';
import Constant from "../../constants";
import { usePaystackPayment, PaystackButton, PaystackConsumer } from 'react-paystack';

// For Translator Starts
import { FormattedMessage } from "react-intl"; // Backup Way to Convert
import { I18nPropvider, LOCALES } from '../../i18nProvider';
import translate from "../../i18nProvider/translate";
import PatientHeader from "../patient/Sanarheader";
import Patcss from "../../public/css/patient/order-medicine.css";
import PatientFooter from "../patient/Patientfooter";
import PatientGetLocations from "../patient/PatientGetLocaitons";
import paymentGateway from "../patient/paymentGateway";
import FileBase64 from "react-file-base64";
import OwlCarousel from 'react-owl-carousel';  
import 'owl.carousel/dist/assets/owl.carousel.css';  
import 'owl.carousel/dist/assets/owl.theme.default.css'; 

const moment = require("moment"); 


export default class PatientSelectRetailer extends Component {
    
    constructor(props) {
        super(props);
        // let fields = this.state.fields;
        this.state = {
            fields: {},
            errors: {},
            total:"0.00",
            deliveryCharges:"0.00",
            toBePaid:"0.00",
            relativeId:"",
            seletedRetaielId:"",
            confirm:"",
            addressId:"",
            prescriptionImage:"",
            AddressList:"",
            deliveryAddress:"",
            selectedAddressId:"",
            addressSelectionSection:"collapse-show",
            retailerSelectionSection:"collapse-hide",
            add_address_form:"add_address_form collapse-hide",
        };
        
        
        this.addfamily=this.addfamily.bind(this);
        this.caliculateTotals=this.caliculateTotals.bind(this);
    }


   
    
    // To get detais after first render
    componentDidMount = () => {
        //let userData="";
        
        let userData=reactLocalStorage.getObject('userObj');
        let cartData="";
        cartData=localStorage.getItem("cartId");
        //cartData=reactLocalStorage.getObject("cartId");
        if(userData){
            if(userData!=""){
                this.setState({
                    name: userData.name,
                    user_mobile:userData.mobile_number,
                    email_id:userData.email,
                    token:userData.accessToken,
                    patientId:userData.patient_id,
                    profile_image:"", 
                    
                });
                this.forceUpdate(); 
                this.getPatientRelations(userData.patient_id);
                this.getAllAddresses(userData.patient_id);
                this.getaddressInfo(userData.patient_id);
                
                
            }
            
        } else{
            window.location.href = "/login";
        }
        // alert(Object.keys(cartData).length>0);
        if(cartData!=""){
            this.state.cartId=cartData;
            //this.getRetailerList();
        }
        
    }
    
    // Get relatives
    getPatientRelations = (patientId) => {
        Httpconfig.httptokenget(
            Constant.siteurl + "api/Patients/findpatientrealtives/" + patientId,
            
        )
        .then((response) => {
            let profile_pic = "";
            if (Object.keys(response.data.data).length > 0) {
                const stateRelationsOptions = response.data.data.map((data, index) => {
                    
                    return(
                        <div class="radio">
                        <label><input type="radio" name="optradio" defaultValue={data.name.charAt(0).toUpperCase() + data.name.slice(1) + " (" + data.master_relationship.relation_name + ")"} id={data.id} onClick={this.updateSelectedRelatives} />{data.name.charAt(0).toUpperCase() + data.name.slice(1) + " (" + data.master_relationship.relation_name + ")"}</label>
                        </div>
                    )
                    
                });
                
                this.setState({
                    stateRelationsOptions: stateRelationsOptions,
                    defaultValue: patientId, //stateRelationsOptions[0].value,
                });
            }
        })
        .catch((error) => {
            toast.error(error);
        });
    };
    
    
    //Add family member
    addfamily =() =>{      
        this.props.history.push("./Patientadd");
    }
    // select relatives for the order
    updateSelectedRelatives=(event)=>{
        let relativeId= event.currentTarget.id;
        this.state.relativeId=relativeId;
        this.state.selectedRelative=event.target.defaultValue;
        this.forceUpdate();
    }
    
    // Get all the Delivery Addresses
    
    getAllAddresses=(patientId)=>{
        Httpconfig.httptokenget(
            Constant.siteurl + "api/OM/deliveryAddress/findAllDeliveryAddress/" + patientId,)
            .then((response) => {
                let profile_pic = "";
                if (Object.keys(response.data.data).length > 0) {
                    const deliveryAddresses = response.data.data.map((data, index) => {
                        
                        return(
                            <div class="save_add_box" id={data.id} onClick={this.selectedAddress}>
                            <div class="row">
                            <div class="col-md-8">
                            <div class="save_name">
                            
                            <input type="radio" name="address" id={data.id}  onChange={this.handleAddress} checked={this.state.selectedAddressId===data.id ? "checked" :""} />{" "}
                            <h2>{data.name.charAt(0).toUpperCase() + data.name.slice(1) } <span>({data.address_type})</span></h2>
                            <p>{data.mobile_no}</p>
                            <h6 id={"address-"+data.id}>{data.address}</h6>
                            </div > 
                            </div>
                            <div class="col-md-4">
                            <div class="set_edit">
                            <a href="#" id={data.id} onClick={this.addAddress}> <p><img class="search_img" src="https://www.pngfind.com/pngs/m/275-2755033_edit-png-file-on-phone-svg-edit-icon.png" />Edit</p></a>
                            <a href="#" id={data.id} onClick={this.setDefaultAddress}> <p><img class="search_img" src="https://www.pikpng.com/pngl/m/418-4180575_file-symbol-rain-wikimedia-commons-open-3-dots.png" />Set as default</p></a>
                            </div>
                            </div>
                            </div>
                            
                            </div>
                        )
                        
                    });
                    
                    this.setState({
                        deliveryAddresses: deliveryAddresses,
                    });
                }
            })
            .catch((error) => {
                toast.error(error);
            });
            
            
        }  
        
        // Selected Address
        selectedAddress=(event)=>{
            let selectedAddressId=event.currentTarget.id;
            $('#navbardrop').html($('#address-'+selectedAddressId).html());
            $('.showdropdown').hide();
            this.state.addressId=selectedAddressId;
            this.forceUpdate();
        }
        //show address dropdown
        showAddress=()=>{
            $('.showdropdown').show();
        }
        
        getRetailerList=()=>{
            
            Httpconfig.httptokenpost(
                Constant.siteurl + "api/ProductSearch",{
                    "cart_id": this.state.cartId,
                    "lat_long":this.state.lat_long
                    
                })
                .then((response) => {
                    
                    if (Object.keys(response.data).length > 0) {
                        var  retailerList = response.data.retailerInfo;

                        var totalCartItems=Object.keys(response.data.cartData).length;
                       // alert(Object.keys(response.data.retailerInfo).length);
                        if(Object.keys(response.data.retailerInfo).length==1){
                          
                          let retatilerId=response.data.retailerInfo[0].retailerInfo.id;
                        //  alert(retatilerId);
                          this.setState({
                            retailerList: retailerList,
                            totalCartItems:totalCartItems,
                        });
                        this.forceUpdate();
                          this.selectedRetailer(retatilerId);
                        }
                        // const retailerList = response.data.retailerInfo.map((data, index) => {
                        //     let availableCount=Object.keys(data.retailer_stock_tbls).length;
                        //     return(
                        
                        //         <div class="item"> 
                        //         <div class="select_content">   
                        //         <p class="sl_no">{index+1}</p>
                        //         <h5 class="recomend_txt">Recommended</h5>
                        
                        //         <div class="ret_name">
                        //         <h2>{data.storename} <span class="ret_avail">{availableCount}/{Object.keys(response.data).length} <span>{data.is_active==1 ? "available" :""}</span></span></h2>
                        //         <p class="tot_amnt">₹ 140</p>
                        //         <h5 class="ret_loc">{data.address} <span class="ret_km">0.5km</span></h5>
                        //         </div>
                        //         </div>
                        //         </div>
                        
                        //     )
                        
                        // });
                        
                        this.setState({
                            retailerList: retailerList,
                            totalCartItems:totalCartItems,
                        });
                        this.forceUpdate();
                    }
                })
                .catch((error) => {
                    toast.error(error);
                });
                
            }
            
            selectedRetailer=(id)=>{
                var retailerData="";
                var nostock="";
                let total=0;
                let num=0;
                this.state.seletedRetaielId=id;//event.currentTarget.id;
                
                if (Object.keys(this.state.retailerList).length > 0 && this.state.seletedRetaielId!="") {
                this.state.retailerList.filter((item) => item.retailerInfo.id == this.state.seletedRetaielId).map((data,index) => {
                    this.state.deliveryCharges=data.retailerInfo.set_delivery_slab;
                    this.state.cartDiscount=data.retailerInfo.discount_slab;
                    this.state.currency=data.retailerInfo.currency;
                    this.state.retailerName=data.retailerInfo.storename;
                    this.state.retailerAddress=data.retailerInfo.address;
                    this.state.available=Object.keys(data.stockAvailable).length+"/"+this.state.totalCartItems;
                    this.state.distance=data.distance;
                    
               
                    
                    retailerData = data.stockAvailable.map((prodcutsList,index) => {
                        total=parseFloat(total)+parseFloat(prodcutsList.mrp*prodcutsList.status);
                        this.state.toBePaid=parseFloat(total)+parseFloat(this.state.deliveryCharges);
                        

                        return(  
                    <div class="med_name">
                    <h2>{num=num+1}. {prodcutsList.products_master_tbl.medicinename} <span class="mrp">{this.state.currency}{parseFloat(total).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')}</span><h4 class="sm_mrp">MRP:{this.state.currency}  <p class="sm-mrp">{parseFloat(prodcutsList.mrp).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')}</p></h4></h2>
                    <h6>{prodcutsList.products_master_tbl.manufacturer}</h6>
                    <p>{prodcutsList.products_master_tbl.size}</p>
                    <p>{prodcutsList.products_master_tbl.strength}</p>
                    <div class="input-group number-spinner">
                    <div class="input-group-btn">
                    <button class="btn btn-default minus_btn" data-dir="dwn" id={"minus-"+prodcutsList.medicine_id} onClick={this.qtyDecrementUpdateQty.bind(this,prodcutsList.medicine_id,prodcutsList.id,prodcutsList.mrp,prodcutsList.quantity)}><i class="fa fa-minus"></i></button>
                    </div>
                    <input type="text" class="form-control text-center" readOnly="readOnly" value={prodcutsList.status} id={"qty-"+prodcutsList.medicine_id} />
                    <div class="input-group-btn">
                    <button class="btn btn-default plus_btn" data-dir="up" id={"plus-"+prodcutsList.medicine_id} onClick={this.qtyIncrementUpdateQty.bind(this,prodcutsList.medicine_id,prodcutsList.id,prodcutsList.mrp,prodcutsList.quantity)}><i class="fa fa-plus"></i></button>
                    </div>
                  
                    
                    </div>
                    <h5>{prodcutsList.quantity} items available</h5>
                    </div>
                        )
                    })
                    //not avaiable medicines
                    nostock = data.stockNotAvailable.map((prodcutsList,index) => {
                      //  total=parseInt(total)+parseInt(prodcutsList.mrp*prodcutsList.quantity);
                       // this.state.toBePaid=parseInt(this.state.total)+parseInt(this.state.deliveryCharges);
                        
                        return(  
                    <div class="med_names">
                    <h2>{num=num+1}. {prodcutsList.products_master_tbl.medicinename} <span>{this.state.currency + "\t"} <span class="mrp"> { prodcutsList.mrp ? parseFloat(prodcutsList.mrp).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,') : "0.00"}</span></span></h2>
                    <h6>{prodcutsList.products_master_tbl.manufacturer}</h6>
                    <p>{prodcutsList.products_master_tbl.size}</p>
                    <p>{prodcutsList.products_master_tbl.strength}</p>
                    <div class="input-group number-spinner">
                    <div class="input-group-btn">
                    <button class="btn btn-default minus_btn" data-dir="dwn" id={"minus-"+prodcutsList.medicine_id} ><i class="fa fa-minus"></i></button>
                    </div>
                    <input type="text" class="form-control text-center" readOnly="readOnly" defaultValue={prodcutsList.quantity} id={"qty-"+prodcutsList.medicine_id} />
                    <div class="input-group-btn">
                    <button class="btn btn-default plus_btn" data-dir="up" id={"plus-"+prodcutsList.medicine_id} ><i class="fa fa-plus"></i></button>
                    </div>
                    {/* <h5>{parseInt(prodcutsList.quantity)!="" ? prodcutsList.quantity :"0"} items available</h5> */}
                   
                    </div>
                    <h5>Out of stock</h5>
                    
                    </div>
                        )
                    })
                })
            }
                this.state.total=total;
                this.state.retailerSelectedProcuctInfo=retailerData;
                this.state.retailerSelectedNostockProcuctInfo=nostock;
               // this.caliculateTotals();
                this.forceUpdate();
                
                
            }

  //  quanatity Increment
  
  qtyIncrementUpdate=(prodcutId,rowId,mrp)=>{
    let qty=$('#qty-'+prodcutId).val();
    if(qty>=0){
      qty=parseInt(qty)+1;
      $('#qty-'+prodcutId).val('');
      $('#qty-'+prodcutId).val(qty);
      this.updateQuantity(prodcutId,rowId);
      this.caliculateTotals();
    }
    
  }
  
  // quanatity decrement

  qtyDecrementUpdate = (prodcutId, rowId,mrp) => {
      let qty = $('#qty-' + prodcutId).val();
      if (qty >= 1) {
          qty = parseInt(qty) - 1;
          $('#qty-' + prodcutId).val('');
          $('#qty-' + prodcutId).val(qty);
          this.updateQuantity(prodcutId, rowId);
          this.caliculateTotals();
      }

  }


  
  //  quanatity Increment
  
  qtyIncrementUpdateQty=(prodcutId,rowId,mrp,aquantity)=>{
    let qty=$('#qty-'+prodcutId).val();
   // alert(aquantity);
    //alert(qty);
    if(parseInt(qty)>=parseInt(aquantity)){
      toast.error("Quantity should not availble Quantity");
      return false;
    }
    if(qty>=0){
      qty=parseInt(qty)+1;
      $('#qty-'+prodcutId).val('');
      $('#qty-'+prodcutId).val(qty);
      this.updateQuantity(prodcutId,rowId);
      this.caliculateTotals();
    }
    
  }
  
  // quanatity decrement

  qtyDecrementUpdateQty = (prodcutId, rowId,mrp,aquantity) => {
      let qty = $('#qty-' + prodcutId).val();
      if(parseInt(qty)>parseInt(aquantity)){
        toast.error("Quantity should not availble Quantity");
        return false;
      }
      if (qty >= 2) {
          qty = parseInt(qty) - 1;
          $('#qty-' + prodcutId).val('');
          $('#qty-' + prodcutId).val(qty);
          this.updateQuantity(prodcutId, rowId);
          this.caliculateTotals();
      }

  }

  // Update quantity

  updateQuantity = (productId, rowId) => {
      let cartId = this.state.cartId;
      let quanatity = $('#qty-' + productId).val();
      Httpconfig.httptokenpost(Constant.siteurl + "api/OM/Cart", {
              "cart_id": cartId,
              "patient_id": this.state.patientId,
              "medicine_id": productId,
              "quantity": quanatity,
              "shop_id": ""
          })
          .then((response) => {
              if (response.data.status == "200" && response.data.error == false) {
                  this.miniCart();

              }
          })
          .catch((error) => {
              toast.error(error);
          });
  }

  //Caliculate Totals

caliculateTotals=()=>{
    let total=0;
    let deliveryCharges="";
    let quantity="";
    let retailerId=this.state.seletedRetaielId;
    
    $('.medicine_sec .med_list .med_name').each(function() {
        let mrp= $(this).find(".sm-mrp").html();
        //alert(mrp);
        $(this).find(".form-control").each(function(){
        let className=($(this).attr('class'));
            if(className=='form-control text-center'){
                quantity=  $(this).val();
                
                
                if(quantity!=""){
                    total=parseFloat(total)+parseFloat(quantity*mrp);
                    
                }
            }
        })
        //alert(total);
        //$('#total-price'+retailerId).val(total);
        //this.state.total=total;
        
    });
    this.state.total=total;
    this.state.toBePaid=parseFloat(total)+parseFloat(this.state.deliveryCharges);
    $('#total-price-'+retailerId).html(this.state.toBePaid.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,'));
    $('.mrp').html(parseFloat(total).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,'));
    this.forceUpdate();
}


validate=()=>{

    let relativeId=this.state.relativeId;
    let addressId=this.state.selectedAddressId;
    let retailerId=this.state.seletedRetaielId;
    let toBePaid=this.state.toBePaid;
    let total=this.state.total;
    let prescriptionCount=0;
    let medicaldoc_pic=[];
    if(this.state.files){
      prescriptionCount=Object.keys(this.state.files).length;
    }
    let uploaded=prescriptionCount;
    let count=0;
    //alert(uploaded);
    if(relativeId==""){
        toast.error("Please select the patient");
        count=count+1;
    }
    if(addressId==""){
        toast.error("Please select the delivery address");
        count=count+1;
    }
    if(retailerId==""){
        toast.error("Please select the retailer");
        count=count+1;
    }
    // if(uploaded=="0"){
    //     toast.error("Please upload prescription");
    //     count=count+1;
    // }
    if(total=='0.00'){
        toast.error("Paid amount should not be zero");
        count=count+1;
    }
    if($('#terms').prop("checked") == false){
      toast.error("Please accept Terms & Conditions");
        count=count+1;
    }

    if(count>0){
        toast.warn("Form has erros");
    }else{
        let total=0;
       // let deliveryCharges="";
        let quantity="";
        let id="";
        let order_details=[];
        let productDetails=[];
        let data="";
        let medicineId="";
        let retailerId=this.state.seletedRetaielId;
        let patientId=this.state.patientId;
        let addressId=this.state.addressId;
        let relativeId=this.state.relativeId;
        let deliveryCharges=this.state.deliveryCharges;
        let totals=this.state.total;
        let toBePaid=this.state.toBePaid;
        let prescriptionImage=this.state.prescriptionImage;
        let cartId=this.state.cartId;
        let uploadedFiles=this.state.files;
        
        $('.medicine_sec .med_list .med_name').each(function() {
            let mrp= $(this).find(".sm-mrp").html();
            $(this).find(".form-control").each(function(){
            let className=($(this).attr('class'));
                if(className=='form-control text-center'){
                    quantity=  $(this).val();
                    data=$(this).attr('id');
                    data=data.split("-"); 
                    medicineId=data[1];
                    if(quantity!=""){
                        total=parseFloat(total)+parseFloat(quantity*mrp);
                        order_details={
                            "retailer_id":retailerId,
                            "patient_id":patientId,
                            "medicine_id":medicineId,
                            "quantity":quantity,
                            "amount":mrp,
                            "expiry_date":"",
                            "batch":"",
                            "vat":"7",
                            "CGST":"",
                            "SGST":"",
                            "IGST":""
                        }
                        
                    }
                }
                productDetails.push(order_details);
            })
             
            
        });
        //alert(toBePaid);
        data={
            "retailer_id":retailerId,
            "patient_id":patientId,
            "patient_address_id":addressId,
            "relative_id":relativeId,
            "cart_level_discount":"",
            "delivery_charges":deliveryCharges,
            "net_amount":total,
            "payable_amount":toBePaid,
            "coupan_name":"",
            "coupan_value":"",
            "transaction_id":"",
            "prescription":prescriptionImage,
            "order_details":productDetails,
            "delivery_agent":"",
            }       
            this.state.processedData=data;
            this.state.confirm=1;
            //console.log(this.state.processedData);
            //.map((data,index) => (
              if(uploaded==1){
              for(let uploadscount=0;uploadscount<uploadedFiles.length;uploadscount++){
               // console.log(uploadedFiles);
                medicaldoc_pic.push({
                "name": uploadedFiles[uploadscount].name,
                "base64" : uploadedFiles[uploadscount].base64,
                "type" : uploadedFiles[uploadscount].type,
                "size" : uploadedFiles[uploadscount].size,
                }
                )
                
              }
            
             // console.log(medicaldoc_pic);
             // return; 
            // const uploadedImages=this.state.files.map((fileDetails, num) => (
            // "name": "1.png",
            // "type": "image/png",
            // "size": "161 kB",
            // "base64":fileDetails.base64,
              
            // ))
            data={
            "patient_id": patientId,
            "cart_id": cartId,
            "medicaldoc_pic":medicaldoc_pic
            }
            
            
            Httpconfig.httptokenpost(Constant.siteurl + "api/OM/Cart/prescriptionImage",data)
          .then((response) => {
              if (response.data.status == "200" && response.data.error == false) {
                 //alert(response.data.message);

              }
          })
          .catch((error) => {
              toast.error(error);
          });
        }
          
    }
    

}
getFiles(files) {
    //this.setState({ files: files });
    // console.log(this.state.files[0].base64);
    // console.log(this.state.files);
    //alert(this.state.files[0].base64);
    // let  patientId=this.state.patientId;
    // let patientProfileImage=this.state.files[0].base64; 
    // this.state.prescriptionImage=this.state.files[0].base64; 
    // this.forceUpdate();
    var objLen=0;
    if(this.state.files){
    objLen=(Object.keys(this.state.files).length);
    }
    
    
    if(objLen>0){
      this.state.files=[...this.state.files,...files];
    }else{
      this.setState({ files: files });
    }
    this.forceUpdate();
    
   
}
addAddress=(event)=>{
    let id=event.currentTarget.id;
    if(id==0){
        window.location.href = "./patient/manageAddress";
    }else{ 
        window.location.href = "./patient/manageAddress/"+id;
    }
}
setDefaultAddress=(event)=>{
    let id=event.currentTarget.id;
    let patientId=this.state.patientId;
    Httpconfig.httptokenput(Constant.siteurl + "api/OM/deliveryAddress/"+patientId+"/"+id, )
    .then((response) => {
        if (response.data.status == "200" && response.data.error == false) {
            toast.success("Address updated as default address");
        }
    })
    .catch((error) => {
        toast.error(error);
    });

}

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
          //alert(streetaddress);
          localStorage.setItem("detected_address", streetaddress);
          
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
 
  removeAddressBox = (e) => {
    const anchor = e.target.closest("a");
    let clickValue = anchor.getAttribute("value");
    let clickName = anchor.getAttribute("name");
    var isConfirm = window.confirm("Are you sure to delete " + clickName + "?");
    if (isConfirm) {
      Httpconfig.httptokendelete(
        Constant.siteurl + "api/OM/deliveryAddress/" + clickValue
      )
        .then((response) => {
          toast.success("Successfully Deleted Manage Address");
          // setTimeout(() => window.location.reload(), 2000);
          this.getaddressInfo(this.state.patientId);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

  // this.state.patientId
  defaultAddressBox = (e) => {
    const anchor = e.target.closest("a");
    let rowId = anchor.getAttribute("value");
    let clickName = anchor.getAttribute("name");
    let patientId = this.state.patientId; //'7';//
    var isConfirm = window.confirm(
      "Are you sure to set Default address " + clickName + "?"
    );
    if (isConfirm) {
      Httpconfig.httptokenput(
        Constant.siteurl + "api/OM/deliveryAddress/" + patientId + "/" + rowId
      )
        .then((response) => {
          toast.success("Successfully updated the Default Address ");
          this.getaddressInfo(this.state.patientId);
          // setTimeout(() => window.location.reload(), 2000);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

  editAddressBox = (e) => {
    const anchor = e.target.closest("a");
    let clickValue = anchor.getAttribute("value");
    let clickName = anchor.getAttribute("name");
    Httpconfig.httptokenget(
      Constant.siteurl + "api/OM/deliveryAddress/" + clickValue
    )
      .then((response) => {
        console.clear();
        console.log(response);
        this.setState({
          fields: {
            patient_id: response.data.data[0].patient_id,
            username: response.data.data[0].name,
            mobile_no: response.data.data[0].mobile_no,
            location: response.data.data[0].location,
            address: response.data.data[0].address,
            landmark: response.data.data[0].landmark,
            latitude: response.data.data[0].latitude,
            longitude: response.data.data[0].longitude,
            address_type: response.data.data[0].address_type,
            isEdit: true,
            rowId: response.data.data[0].id,
          },
        });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  // Handle Address Changes

  handleAddress=(event)=>{
    let addressId=event.currentTarget.id;
    this.state.AddressList.filter((item) => item.id == addressId).map((data,index) => {
    this.state.selectedAddressId=data.id;
    //alert(this.state.selectedAddressId);
    let patientId=this.state.patientId;
    this.state.deliveryAddress=data.address;
    this.state.lat_long=data.latitude+","+data.longitude;
    $('.showdropdown').css('display','none');
    //$('input[name=address]').attr('checked',false);
    //$('#'+addressId).attr('checked','checked');
    //alert(addressId);
    
    this.getRetailerList();
    this.getAllAddresses(this.state.patientId);
    this.forceUpdate();
    
  })

  }

  ValidateSelectedAddress=()=>{
      let selectedAddress="";
      selectedAddress=this.state.selectedAddressId;
      if(selectedAddress==""){
          toast.error('Select Delivery Address');
          return;
      }else{
          this.showRetailerSelectionSection();
          this.getRetailerList();
      }
  }
  
  //show Retailer Selection Section
  showRetailerSelectionSection=()=>{
   this.state.retailerSelectionSection="collapse-show";
   this.state.addressSelectionSection="collapse-hide";
   this.forceUpdate();
  }
  //show Retailer Selection Section
  hideRetailerSelectionSection=()=>{
    this.state.retailerSelectionSection="collapse-hide";
    this.state.addressSelectionSection="collapse-show";
    this.forceUpdate();
   }

  // To get all the Patient Addresses
  getaddressInfo(patientId) {
    //patientId = this.state.patientId; //7;
    Httpconfig.httptokenget(
      Constant.siteurl +
        "api/OM/deliveryAddress/findAllDeliveryAddress/" +
        patientId
    )
      .then((response) => {
        console.log(response);
        this.state.AddressList=response.data.data;
        if (response.data.status == "200" && response.data.error == false) {
          const addressDetailsView = response.data.data.map(
            (addressDetails, num) => {
              return (
                <div className="add_address_box">
                  <div className="add_address_det">
                  <h5>{addressDetails.default_status==1 ? "Default" :""}</h5>
              
                    <h2>
                    <input type="radio" name="address1" id={addressDetails.id}  onChange={this.handleAddress}/>{" "}
                      {addressDetails.name}{" "}
                      <p>({addressDetails.address_type})</p>
                      <span>+{addressDetails.mobile_no}</span>
                    </h2>
                    <h6>
                      {addressDetails.address}
                      {addressDetails.landmark}
                    </h6>
                  </div>
                  {addressDetails.default_status!=1 ?
                  <div className="add_address_bar">
                    <li className="nav-item dropdown">
                      <a href="#" id="navbardrop" data-toggle="dropdown">
                        <img src="../images/patient/img/Ordermedicine/blueDottedMenu.svg" />
                      </a>
                      <div className="dropdown-menu">
                      
                        <a
                          className="dropdown-item"
                          name={addressDetails.name}
                          value={addressDetails.id}
                          href="javascript:void(0);"
                          onClick={this.editAddressBox.bind(this)}
                        >
                          Edit
                        </a>
                        <a
                          className="dropdown-item"
                          name={addressDetails.name}
                          value={addressDetails.id}
                          href="javascript:void(0);"
                          onClick={this.defaultAddressBox.bind(this)}
                        >
                          Set as Default
                        </a>
                        <a
                          className="dropdown-item"
                          name={addressDetails.name}
                          value={addressDetails.id}
                          href="javascript:void(0);"
                          onClick={this.removeAddressBox.bind(this)}
                        >
                          Delete
                        </a>
                        {/* onClick={() => this.deleteCoupon(addressDetails.id, addressDetails.coupon_name)} */}
                      </div>
                    </li>
                  </div>
                  :""}
                </div>
              );
            }
          );
           
          this.setState({
            addressDetailsView: addressDetailsView,
          });
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }

  

  checkSubmit(event) {
    event.preventDefault();
    let isEditEnabled = this.state.fields.isEdit;

    if (isEditEnabled) {
      this.updateAddressModule(event);
    } else {
      this.createAddressModule(event);
    }
  }

  // creates address Module
  createAddressModule = (event) => {
    event.preventDefault();
    const { fields, errors } = this.state;
    let enteredAddress = $('textarea[name="address"]').val();
    this.getLatLangfromAddress(enteredAddress);

    let address_latitude = localStorage.getItem('address_latitude');
    let address_longitude = localStorage.getItem('address_longitude');

    // console.clear();
    // console.log(this.state);
    // console.log(this.state.patientId);
    // return;

    Httpconfig.httptokenpost(Constant.siteurl + "api/OM/deliveryAddress", {
      patient_id: this.state.patientId,
      name: fields["username"],
      mobile_no: fields["mobile_no"],
      location: fields["location"] ? fields["location"] : "asdf",
      address: fields["address"],
      landmark: fields["landmark"],
      latitude: address_latitude ? address_latitude : "17.438976", //fields["latitude"] ? fields["latitude"] : "1",
      longitude: address_longitude ? address_longitude : "78.38905559999999", //fields["longitude"] ? fields["longitude"] : "2",
      address_type: fields["address_type"],
    })
      .then((response) => {
        console.log(response.data);
        if (response.data.status == 200 && response.data.error == false) {
          toast.success("Successfully Created Manage Address");
          this.getaddressInfo(this.state.patientId);
          // setTimeout(
          //   () => this.props.history.push("/patient/manageAddress"),
          //   2000
          // );
        } else {
          toast.error(response.data.message);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  // updates controller
  updateAddressModule = (event) => {
    event.preventDefault();
    const { handle } = this.props.match.params;
    const { fields, errors } = this.state;
    let rowId = this.state.fields.rowId;
    Httpconfig.httptokenput(
      Constant.siteurl + "api/OM/deliveryAddress/" + rowId,
      {
        patient_id: this.state.patientId,
        name: fields["username"],
        mobile_no: fields["mobile_no"],
        location: fields["location"] ? fields["location"] : "asdf",
        address: fields["address"],
        landmark: fields["landmark"],
        latitude: fields["latitude"] ? fields["latitude"] : "1",
        longitude: fields["longitude"] ? fields["longitude"] : "2",
        address_type: fields["address_type"],
      }
    )
      .then((response) => {
        if (response.data.status == 200 && response.data.error == false) {
          toast.success("Successfully Updated Manage Address");
          // setTimeout(
          //   () => this.props.history.push("/patient/manageAddress"),
          //   2000
          // );
          this.getaddressInfo(this.state.patientId);
        } else {
          toast.error(response.data.message);
        }
      })
      .catch((error) => {
        console.log(error);
        toast.error(error);
      });
  };

  getLatLangfromAddress = (enteredAddress) => {
    var latitude = "";
    var longitude = "";
    var url = "https://maps.googleapis.com/maps/api/geocode/json?address="+enteredAddress+"&key=AIzaSyDf9nNe-DZ5ICYu1tIPqRVfOaAMz16mNfw"
    $.getJSON(url, function (data, textStatus) {
      console.log(data);
      var responseStatus = data.status;
      if(responseStatus === 'OK'){
         latitude = data.results[0].geometry.location.lat;
         longitude = data.results[0].geometry.location.lng;
          localStorage.setItem("address_latitude", latitude);
          localStorage.setItem("address_longitude", longitude);
      }
    });
    
    let address_latitude = localStorage.getItem('address_latitude');
    let address_longitude = localStorage.getItem('address_longitude');
    if(address_latitude && address_longitude){
      console.log(address_latitude+" >> address_latitude ");
    console.log(address_longitude+" >> address_longitude ");
      this.setState({
        fields: {
          latitude: address_latitude,
          longitude: address_longitude,
        },
      });
      setTimeout(function(){ localStorage.removeItem("address_latitude"); localStorage.removeItem("address_longitude"); }, 2000);
    }
  };

  // When value changes of the fields
  handleChange = (field, event) => {
    let fields = this.state.fields;
    fields[field] = event.target.value;
    this.setState({ fields });
  };

  handleValidation() {
    let fields = this.state.fields;
    let errors = {};
    let formIsValid = true;

    if (!fields["username"]) {
      formIsValid = false;
      errors["username"] = "Name cannot be empty";
    }
    if (!fields["mobile_no"]) {
      formIsValid = false;
      errors["mobile_no"] = "Mobile No cannot be empty";
    }
    if (!fields["address"]) {
      formIsValid = false;
      errors["address"] = "Address cannot be empty";
    }
    if (!fields["address_type"]) {
      formIsValid = false;
      errors["address_type"] = "Address type cannot be empty";
    }

    this.setState({ errors: errors });
    return formIsValid;
  }    
  addNewAddress=()=>{
    this.state.add_address_form="add_address_form collapse-show";
  }
  
  ImageClick = (event) => {
    var array = this.state.files;
    var foundValue = array.filter((obj) => obj.name != event.target.id);
    this.setState({ files: foundValue });
    
  };
  ImageZoomClick=(event)=>{
  this.setState({
    zoomimage:event.currentTarget.src,
  })
  }
  removeImageOnClick=(event)=>{
    let imageName=event.currentTarget.id.replace("img_","");
    $('#'+imageName).remove();
    $('.'+imageName).remove();
    //// // // console.log("State values");
    //// // // console.log(this.state.files);
    var array = [...this.state.files]; // make a separate copy of the array
    // // // console.log("array values");
  //var index = array.indexOf(imageName);
  var index = array.findIndex((item) => item.name === imageName);
  //alert(index);
  //// // // console.log(array);
  if (index !== -1) {
    array.splice(index, 1);
    this.setState({files: array});
  }
this.forceUpdate();
    // this.setState({
    //   zoomimage:'',
    // })
    }
  


            render() {
                const { languages_data } = this.state;
                const { fields } = this.state;
                let documentsRelated = [];
                if(this.state.files){
                let imageArray = this.state.files;
                
                if (imageArray.length > 0) {
                  for (var i = 0; i < imageArray.length; i++) {
                    let img=imageArray[i].name.split(".");
                    let imgName=img[0];
                    let imageName = imageArray[i].name;
                    let imagebase64 = imageArray[i].base64;
                    let imageType = imageArray[i].type;
                    let imageSize = imageArray[i].size;
                    let imageId = imageArray[i];
                   
                    documentsRelated.push(
                      <div class={"upload_presc_img "+imgName}>
                            <a href="#" class="thumbnail" data-toggle="modal" data-target="#lightbox"> 
                            <img
                        src={imagebase64}
                        id={imgName}
                        value={imageName}
                        alt={imageName}
                        name={imageName}
                        
                         onClick={this.ImageZoomClick.bind(this)}
                        
                      />
                            </a>
                            <div class="upload_top_img">
                              <a href="#" class="thumbnail" data-toggle="modal" data-target="#lightbox" ></a>
                           <img class="delete_img" id={"img_"+imageArray[i].name} onClick={this.removeImageOnClick} src="https://icons.iconarchive.com/icons/danieledesantis/playstation-flat/512/playstation-cross-black-and-white-icon.png" />
                          </div>
                          </div>
            
                     
                    );
                  }
                }
              }
                return (
                    
                    <main id="main_ord_nav">
                    <PatientHeader/>
                    <I18nPropvider locale={this.state.Language} >
                    <section id="almost_section" class={this.state.addressSelectionSection}>
                    <div class="almost_main">
                    <div class="container">
                    <div class="row">
                    <div class="col-md-4">
                    <div class="almost_head">
                    <h2>You almost there!</h2>
                    <p>Please follow the process to place your order</p>
                    </div>
                    </div>
                    <div class="col-md-8">
                    <div class="almost_step">
                    <div class="stepwizard">
                    <div class="stepwizard-row setup-panel">
                    <div class="stepwizard-step">
                    <a href="#" type="button" class="btn btn-primary btn-circle"><img src="../images/patient/img/Ordermedicine/signIn_selected.svg" /></a>
                    <p class="p_dark">Sign In</p>
                    </div>
                    <div class="stepwizard-step">
                    <a href="#" type="button" class="btn btn-default btn-circle">
                    <img src="../images/patient/img/Ordermedicine/location.svg" /></a>
                       <p class="p_light">Delivery address</p>
                    </div>
                    <div class="stepwizard-step">
                    <a href="#" type="button" class="btn btn-default btn-circle" ><img src="../images/patient/img/Ordermedicine/retailer.svg" /></a>
                    <p class="p_light">Select Retailer </p>
                    </div>
                    <div class="stepwizard-step">
                    <a href="#" type="button" class="btn btn-default btn-circle" ><img src="../images/patient/img/Ordermedicine/payment.svg" /></a>
                    <p class="p_light">Make Payment</p>
                    </div>
                    </div>
                    </div>
                    </div>
                    </div>
                    
                    </div>
                    </div>
                    </div>
                    </section>
                    

{/* <section id="almost_section">
<div class="almost_main">
<div class="container">
<div class="row">
<div class="col-md-4">
<div class="almost_head">
<h2>You almost there!</h2>
<p>Please follow the process to place your order</p>
</div>
</div>
<div class="col-md-8">
<div class="almost_step">
<div class="stepwizard">
<div class="stepwizard-row setup-panel">
<div class="stepwizard-step">
<a href="#" type="button" class="btn btn-primary btn-circle">
<img src="../images/patient/img/Ordermedicine/signIn_selected.svg" /></a>
<p class="p_dark">Sign In</p>
</div>
<div class="stepwizard-step">
<a href="#" type="button" class="btn btn-default btn-circle">
<img src="../images/patient/img/Ordermedicine/location.svg" />
</a>
<p class="p_light">Delivery address</p>
</div>
<div class="stepwizard-step">
<a href="#" type="button" class="btn btn-default btn-circle">
<img src="../images/patient/img/Ordermedicine/retailer.svg" /></a>
<p class="p_light">Select Retailer </p>
</div>
<div class="stepwizard-step">
<a href="#" type="button" class="btn btn-default btn-circle">
<img src="../images/patient/img/Ordermedicine/payment.svg" />
</a>
<p class="p_light">Make Payment</p>
</div>
</div>
</div>
</div>
</div>
</div>
</div>
</div>
</section> */}
<section id="order_profile" class={this.state.addressSelectionSection}>
            <div className="appoint_section">
              <div className="container">
                <div className="row">
                  {/* <div className="col-lg-4 col-md-12 col-sm-12 col-xs-12">
                   
                  </div> */}
                  {/* Side Menu Ends here */}

                  <div className="col-lg-8 col-md-12 col-sm-12 col-xs-12">
                  
                    <section id="order_add_address">
                      <div className="container">
                        <div className="row">
                          <div className="col-md-12">
                            <div className="add_address_sec">
                              <div className="add_address_head">
                                <h2>Delivery Address</h2>
                              </div>
                              <a href="#" onClick={this.addNewAddress}>
                                <div className="add_address_btn">
                                  <p>Add New Address</p>
                                </div>
                              </a>

                              
                                <div className={this.state.add_address_form}>
                                <form onSubmit={this.checkSubmit.bind(this)}>
                                  <div className="form-group">
                                    <div className="row">
                                      <div className="col-md-7">
                                        <label>New User</label>
                                        <input
                                          type="text"
                                          name="username"
                                          value={this.state.fields.username}
                                          className="form-control"
                                          placeholder="Name"
                                          onChange={this.handleChange.bind(
                                            this,
                                            "username"
                                          )}
                                        />
                                        <span className="cRed">
                                          {this.state.errors["username"]}
                                        </span>
                                      </div>

                                      <div className="col-md-5 num_inp">
                                        <label>+91</label>
                                        <input
                                          type="number"
                                          name="mobile_no"
                                          value={
                                            this.state.fields["mobile_no"] || ""
                                          }
                                          className="form-control"
                                          placeholder="Mobile number"
                                          onChange={this.handleChange.bind(
                                            this,
                                            "mobile_no"
                                          )}
                                        />
                                        <span className="cRed">
                                          {this.state.errors["mobile_no"]}
                                        </span>
                                      </div>
                                    </div>
                                  </div>

                                  <div className="form-group">
                                    <label>Complete Address</label>
                                    <textarea
                                      className="form-control"
                                      rows="3"
                                      name="address"
                                      value={this.state.fields["address"] || ""}
                                      placeholder="Enter Full address"
                                      onChange={this.handleChange.bind(
                                        this,
                                        "address"
                                      )}
                                      onBlur={() => this.getLatLangfromAddress.bind(this)}
                                    ></textarea>
                                    <span className="cRed">
                                      {this.state.errors["address"]}
                                    </span>
                                  </div>
                                  <div className="form-group">
                                    <label>
                                      Land Mark<span>(Optional)</span>
                                    </label>
                                    <input
                                      type="text"
                                      className="form-control"
                                      name="landmark"
                                      value={
                                        this.state.fields["landmark"] || ""
                                      }
                                      placeholder="Enter Landmark"
                                      onChange={this.handleChange.bind(
                                        this,
                                        "landmark"
                                      )}
                                    />
                                    <span className="cRed">
                                      {this.state.errors["landmark"]}
                                    </span>
                                  </div>
                                  <div
                                    className="form-group"
                                    onChange={this.handleChange.bind(
                                      this,
                                      "address_type"
                                    )}
                                  >
                                    <label className="radio-inline">
                                      <input
                                        type="radio"
                                        name="address_type"
                                        value="Home"
                                        checked={
                                          this.state.fields["address_type"] ===
                                          "Home"
                                        }
                                      />
                                      Home
                                    </label>
                                    <label className="radio-inline">
                                      <input
                                        type="radio"
                                        name="address_type"
                                        value="Work"
                                        checked={
                                          this.state.fields["address_type"] ===
                                          "Work"
                                        }
                                      />
                                      Work
                                    </label>
                                    <label className="radio-inline">
                                      <input
                                        type="radio"
                                        name="address_type"
                                        value="Other"
                                        checked={
                                          this.state.fields["address_type"] ===
                                          "Other"
                                        }
                                      />
                                      Other
                                    </label>
                                    <span className="cRed">
                                      {this.state.errors["address_type"]}
                                    </span>
                                  </div>

                                  <div className="">
                                    <button
                                      type="submit"
                                      className="btn  btn-primary padTopCategorySave "
                                    >
                                      Save Address
                                    </button>{" "}
                                  </div>
                                  </form>
                                </div>
                             

                              {/* addressbox Code will come here */}
                              {this.state.addressDetailsView}
                              <a onClick={this.ValidateSelectedAddress} >
                                <div className="add_address_btn">
                                  <p>Continue</p>
                                </div>
                              </a>
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















                    
                    <section id="almost_section" class={this.state.retailerSelectionSection}>
                    <div class="almost_main">
                    <div class="container">
                    <div class="row">
                    <div class="col-md-4">
                    <div class="almost_head">
                    <h2>You almost there!</h2>
                    <p>Please follow the process to place your order</p>
                    </div>
                    </div>
                    <div class="col-md-8">
                    <div class="almost_step">
                    <div class="stepwizard">
                    <div class="stepwizard-row setup-panel">
                    <div class="stepwizard-step">
                    <a href="#" type="button" class="btn btn-primary btn-circle"><img src="../images/patient/img/Ordermedicine/signIn_selected.svg" /></a>
                    <p class="p_dark">Sign In</p>
                    </div>
                    <div class="stepwizard-step">
                    <a href="#" type="button" class="btn btn-primary btn-circle">
                    <img src="../images/patient/img/Ordermedicine/location_selected.svg" /></a>
          <p class="p_dark">Delivery address</p>
                    </div>
                    <div class="stepwizard-step">
                    <a href="#" type="button" class="btn btn-default btn-circle" ><img src="../images/patient/img/Ordermedicine/retailer.svg" /></a>
                    <p class="p_light">Select Retailer </p>
                    </div>
                    <div class="stepwizard-step">
                    <a href="#" type="button" class="btn btn-default btn-circle" ><img src="../images/patient/img/Ordermedicine/payment.svg" /></a>
                    <p class="p_light">Make Payment</p>
                    </div>
                    </div>
                    </div>
                    </div>
                    </div>
                    
                    </div>
                    </div>
                    </div>
                    </section>
                    <section id="select_retailer" class={this.state.retailerSelectionSection}>
                    <div class="select_main">
                    <div class="container">
                    <div class="row">
                    <div class="col-md-12">
                    <div class="sel_ret_head">
                    <h2>Select Preferred  Retailer <span>(optional)</span></h2>
                    </div>
                    </div>
                    </div>
                    <div class="row">
                    <div class="col-lg-4 select_ful">
                    <div class="presc_img"><img src="../images/patient/img/Ordermedicine/SelectPatient.svg" /></div>
                    <div class="sel_patient">
                    <h3>Select the patient</h3>
                    <a href="#" onClick={this.addfamily}><p>+ Add your family member</p></a> 
                    </div>
                    <div class="ret_form">
                    <form>
                    {/* get the relatives details */}
                    {this.state.stateRelationsOptions}
                    </form>
                    </div>
                    <div class="sel_ret_presc">
                    <div class="presc_head">
                    <div class="presc_img">
                    <img src="../images/patient/img/Ordermedicine/RX_Icon.svg" />
                    </div>
                    <div class="presc_det">
                    <h2>
                    UPLOAD &amp; SEND PRESCRIPTION</h2>
                    <h6>You have one Rx medicine in the item</h6>
                    </div>
                    </div>
                    <div class="ret_upload_btn">
                    <div class="custom-file-upload">
                    <label >Upload
                    <FileBase64
                    multiple={true}
                  onDone={this.getFiles.bind(this)}
                    />
                    </label>
                    {/* <label for="file-upload" class="custom-file-upload1">
                    Upload
                    </label> */}
                    {/* <p>or Drag &amp; Drop here</p> */}
                   
                    {/* <input id="file-upload" type="file" /> */}
                    </div>
                    </div>
                    <div class="ret_upload_img">
                    {this.state.prescriptionImage ? 
                    <img src={this.state.prescriptionImage} />
                    :""
                    // <img src="https://icon-library.com/images/prescription-icon/prescription-icon-18.jpg" />
                    }
                    {documentsRelated}
                    </div>
                   
                    
                    </div>
                    </div>
                    <div class="col-lg-8 ">
                    <div class="select_ret_dropdown" onClick={this.showAddress}>
                    <ul>
                    <li class="nav-item dropdown">
                    <a class="nav-link dropdown-toggle user_name" href="#" id="navbardrop" data-toggle="dropdown">
                    
                    {this.state.deliveryAddress!="" ? this.state.deliveryAddress :"Select Delivery Address"}
                    
                    </a>
                    <div class="dropdown-menu showdropdown">
                    {/* <a class="dropdown-item cur_loc" onClick={this.getCurrentLocation}><img class="cur_loc_img" src="https://listimg.pinclipart.com/picdir/s/485-4851736_free-png-search-icon-search-icon-free-download.png" />Use Current Location</a> */}
                    <a class="dropdown-item add_new" id="" onClick={this.hideRetailerSelectionSection}>+ Add New Address</a>
                    <div class="saved_address">
                    <div class="save_head">
                    <h2>Saved Address</h2>
                    </div> 
                    {/* Get Addresses */}
                    {this.state.deliveryAddresses}
                    </div>
                    </div>
                    <span><img class="search_img" src="https://listimg.pinclipart.com/picdir/s/485-4851736_free-png-search-icon-search-icon-free-download.png" /></span>
                    </li>
                    </ul>
                    </div>
                    <div class="select_carousel">
                <div class="container">
                <div class="row">
                <div class="col-md-12">
                <div class="select_caro_sec">
                {this.state.retailerList ? 
                <div class="owl-carousel owl-theme">
                    {/* Get Retilers carousel */}
                        <OwlCarousel ref="specialities" items={5}  
                        className="owl-theme"  
                        
                        margin={8}>
                        { this.state.retailerList.map((data,index) => (
                            
                            <div class="item" id={data.retailerInfo.id} onClick={this.selectedRetailer.bind(this,data.retailerInfo.id)}> 
                            <div class="select_content">   
                            <p class="sl_no">{index+1}</p>
                            {index==0 ? <h5 class="recomend_txt">Recommended</h5> :""}
                            
                            <div class="ret_name">
                            {/* {Object.keys(data.retailerInfo.stockAvailable).length} */}
                            
                            <h2>{data.retailerInfo.storename} <span class="ret_avail">{Object.keys(data.stockAvailable).length}/{this.state.totalCartItems} <span>{data.retailerInfo.is_active==1 ? "  available" :""}</span></span></h2>
                            <p class="tot_amnt">{data.retailerInfo.currency} <span id={"total-price-"+data.retailerInfo.id}>{parseFloat(data.cartTotal).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')}</span></p>
                           <h3> {data.retailerInfo.address}</h3>
                            <h5 class="ret_loc"> <span class="ret_km">{data.distance} km</span></h5>
                            <h3 class="ret_loc"> <span class="ret_km">Expected delivery by <span>{moment().add(data.retailerInfo.set_delivery_days, 'days').format("dddd, MMMM Do YYYY")}</span></span></h3>
                            
                            </div>
                            </div>
                            </div>
                            
                        ))
                    }
                    </OwlCarousel>  
                
              
               
    </div>:" Retailers not found to delivery in your location "
                }
    </div>
    </div>
    </div>
    </div>
    </div>
    {this.state.retailerName ?
    <div class="ret_det_box">
    <div class="ret_name">
    <h2>{this.state.retailerName ? this.state.retailerName :""} <span class="ret_avail">{this.state.available ? this.state.available : ""}<span> available</span> </span></h2>
    <h5 class="ret_loc">{this.state.retailerAddress} <span class="ret_km"> {this.state.distance} km</span></h5>
    </div>
    </div>
    : "" }
    {this.state.relativeId ? 
     <p class="med_for">Medicines for <span>{this.state.selectedRelative}</span></p> 
     : "" }
    <div class="medicine_sec">
    <div class="med_list">
    {this.state.retailerSelectedProcuctInfo ? this.state.retailerSelectedProcuctInfo :""}
    {this.state.retailerSelectedNostockProcuctInfo ? this.state.retailerSelectedNostockProcuctInfo :""}
    
    </div>
    </div>
    <div class="med_upload_sec">
    {/* <div class="presc_head">
    <div class="presc_img">
    <img src="img/Date.svg" />
    </div>
    <div class="presc_det">
    <h2>
    UPLOAD &amp; SEND PRESCRIPTION</h2>
    <h6>You have one Rx medicine in the item</h6>
    </div>
    </div> */}
    <div class="total_amnt_box">
    <div class="price_head">
    <h2>Price Details</h2>
    </div>
    <div class="price_details">
    <p>Total M.R.P. <span>{parseFloat(this.state.total).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')}</span></p>
    <p>Price Discount <span>- 0.00</span></p>
    <p>Shipping Charges <span>{parseFloat(this.state.deliveryCharges).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')}</span></p>
    </div>
    <div class="to_paid">
    <p>To Be Paid <span>{this.state.currency} {(parseFloat(this.state.total)+parseFloat(this.state.deliveryCharges)).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')}</span></p>
    <h6>Total savings 0.00</h6>
    </div>
    </div>
    
    <p class="terms"><input type="checkbox" name="terms" id="terms" /> Accept <a href="#"><span>Terms and Conditions</span></a></p>
    <div class="sel_ret_btn">
    {this.state.confirm=="" ?
    <a href="#" onClick={this.validate}><p>Proceed to Pay</p></a> 
    : paymentGateway(this.state.processedData) 
    }
    </div>
    </div>
    </div>
    </div>
    </div>
    </div>
    
    </section>
    <div id="lightbox" class="modal fade" tabindex="-1" role="dialog" aria-labelledby="myLargeModalLabel" aria-hidden="true">
    <div class="modal-dialog">
        <button type="button" class="close hidden" data-dismiss="modal" aria-hidden="true">×</button>
        <div class="modal-content">
            <div class="modal-body">
                <img src={this.state.zoomimage} alt="" />
            </div>
        </div>
    </div>
</div>
    
    {/* <paymentGateway /> */}
    <ToastContainer />
    {/* <PatientFooter/> */}
    </I18nPropvider>
    </main>
    
    
)
}

}