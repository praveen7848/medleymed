import React, { Component, useState } from "react";
import $ from "jquery";
import { ToastContainer } from "react-toastify";
import toast from "../helpers/toast";
import { Link } from "react-router-dom";
import Httpconfig from "../helpers/Httpconfig";
import styles from "react-responsive-carousel/lib/styles/carousel.min.css";
import Constant from "../../constants";
import { FormattedMessage } from "react-intl"; // Backup Way to Convert
import { I18nPropvider, LOCALES } from "../../i18nProvider";
import translate from "../../i18nProvider/translate";
import PatientHeader from "../patient/Patientheader";
import Patcss from "../../public/css/patient/order-medicine.css";
import PatientMenu from "../patient/Patientmenu";
import PatientSideMenu from "../patient/Patientsidemenu";
import PatientFooter from "../patient/Patientfooter";
import { reactLocalStorage } from "reactjs-localstorage";
import FileBase64 from "react-file-base64";
const moment = require("moment");

const orderDetailsView = [];
const orderDetails = [];
const  documentsRelated = [];

export default class Vieworders extends Component {
  constructor(props) {
    super(props);
    this.state = {
      is_view_profile: true,
    };
  }

  // To get detais after first render
  componentDidMount = () => {
    var lang = localStorage.getItem("Language_selected");
    if (lang != null) {
      if (this.state.Language != lang) {
        this.state.Language = lang;
        this.forceUpdate();
      }
    } else {
      this.state.Language = "en-us";
    }
    var retrievedObject = localStorage.getItem("userObj");
    let userObj = JSON.parse(retrievedObject);
    if (userObj == null) {
      window.location.href = "./patientLogin";
    }
    if (typeof userObj != undefined) {
      this.setState({
        name: userObj.name,
        user_mobile: userObj.mobile_number,
        email_id: userObj.email,
        token: userObj.accessToken,
        patientId: userObj.patient_id,
        profile_image: "",
      });
      this.forceUpdate();
    }

    this.getOrderDetails(userObj.patient_id);
    this.getProfileDetails(userObj.patient_id);
    const interval = setInterval(() => {
      //userObj.patient_id = 7;
      this.getOrderDetails(userObj.patient_id);
    }, 10000);
  };

  getProfileDetails = (patientId) => {
    if (patientId != "") {
      let url_path = "api/Patients/" + patientId;
      let patientDob = "";
      Httpconfig.httptokenget(Constant.siteurl + url_path, {}).then(
        (response) => {
          let patientDob = "";
          if (response.data.status == 200 && response.data.error == false) {
            let PatientGender = response.data.data[0].gender;
            let patientProfileImage = "";
            if (response.data.data[0].profile_pic != null) {
              patientProfileImage =
                Constant.imgurl + response.data.data[0].profile_pic;
            }
            // alert(patientProfileImage);
            this.setState({
              patientProfileImage: patientProfileImage,
              PatientGender: PatientGender,
            });
          }
        }
      );
    }
  };

  cancelCurrentOrder = (e) => {
    const anchor = e.target.closest("a");
    let orderId = anchor.getAttribute("orderId");
    var isConfirm = window.confirm("Are you sure to Cancel the Order.");
    if (isConfirm) {
      Httpconfig.httptokenput(
        Constant.siteurl + "api/OM/orderProcess/retailerOrderStatus/" + orderId,
        {
          order_status: 6,
        }
      ).then((response) => {
        if (response.data.status == "200" && response.data.error == false) {
          toast.success("Order Cancelled Sucessfully.", {
            position: "bottom-center",
          });
          setTimeout(() => this.props.history.push("/patient/myOrders"), 2000);
        }
      });
    }
  };

  goBackPage = (e) => {
    $("#first_set").show();
    $('.profile_menu_sec1').show();
    this.setState({
      is_view_profile: true,
    });
    
    $("#second_set").hide();
  };

  // order_profile
  // order_view_det

  getCompleteOrderDetails = (e) => {
    //alert("in");
    const anchor = e.target.closest("a");
    let retailerId = anchor.getAttribute("retailerId");
    let orderId = anchor.getAttribute("orderId");
    $('.profile_menu_sec').css("display","none");
    $("#first_set").hide();
    let orderedQuantity="";
    
    $('.profile_menu_sec1').hide();
    this.setState({
      is_view_profile: false,
    });

    $("#second_set").show();
    Httpconfig.httptokenget(
      Constant.siteurl +
        "api/OM/orderProcess/getOrderDetails/" +
        retailerId +
        "/" +
        orderId
    ).then((response) => {
      if (response.data.status == "200" && response.data.error == false) {
        console.log(response);

        const orderDetails = response.data.data.map((orderDetails, num) => {
          let orderDate = "N/A";
          let userOrderDate = "N/A";
          let total="";
          orderDate = orderDetails.order_date;
          let isPrescriptionImages="0";
          let isPrescriptionImagesList="0";
          if(orderDetails.cart_prescriptions_tbl){
          isPrescriptionImages = Object.keys(orderDetails.cart_prescriptions_tbl).length;
          if(isPrescriptionImages>0) {
            isPrescriptionImagesList = Object.keys(orderDetails.cart_prescriptions_tbl.medical_document).length;
          }
        }
        

          let expectedDelivery = "N/A";
          let isRetailerData = Object.keys(orderDetails.retailer_registration_tbl).length;
          if(isRetailerData > 0){
             let slabDate = orderDetails.retailer_registration_tbl.set_delivery_days;
             if(slabDate){
              // let orderDate = moment(orderDate).format("YYYY-MM-DD");
              var nowPlusOneDay = moment(orderDate).add('days', slabDate);
                  expectedDelivery = nowPlusOneDay.format('YYYY-MM-DD');
             }
          }
          

          let newdate = orderDate.split("-").reverse().join("-");
          userOrderDate = moment(orderDate).format("dddd, MMMM Do YYYY"); 
          expectedDelivery = moment(expectedDelivery).format("dddd, MMMM Do YYYY");
          var retailerCurrency = "N/A";
          if (orderDetails.retailer_registration_tbl.currency) {
            retailerCurrency = orderDetails.retailer_registration_tbl.currency;
          }
          let orderMedicinesLength = orderDetails.order_processing_tbls.length;

          let deliveryAddressLength =
            orderDetails.patient_tbl.delivery_address_tbls.length;
            let relation_name = "Self";
          let deliveryAddress = "N/A";
          
          if (orderMedicinesLength > 0) {

            const retailerOrderMedicineDetailsView = orderDetails.order_processing_tbls.map(
              (finalLoadedData, num) => {
                total=parseFloat(finalLoadedData.amount)*parseFloat(finalLoadedData.quantity);
               orderedQuantity= finalLoadedData.quantity
                //if(finalLoadedData.order_status==1 || finalLoadedData.order_status==2) {
                return (
                  <div class="med_list">
                    <div class="med_name">
                      <h2>
                        {num + 1}.{" "}
                        {finalLoadedData.products_master_tbl.medicinename}{" "}
                      
                        {/* <span>{retailerCurrency} {finalLoadedData.products_master_tbl.mrp}</span> */}
                        <span>{retailerCurrency} {total.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')}</span>
                        <h4 class="mrp">MRP:{retailerCurrency} {finalLoadedData.amount}</h4>
                      </h2>
                      <h6>
                        {finalLoadedData.products_master_tbl.manufacturer
                          ? finalLoadedData.products_master_tbl.manufacturer
                          : ""}
                      </h6>
                      <p>
                        {finalLoadedData.products_master_tbl.form
                          ? finalLoadedData.products_master_tbl.form
                          : ""}
                      </p>
                      <p>
                        {finalLoadedData.products_master_tbl.size
                          ? finalLoadedData.products_master_tbl.size
                          : ""}
                      </p>
                      <h6>
                        {orderedQuantity ? "Ordered Quantity: "+orderedQuantity : ""}
                      </h6>
                      {}
                    </div>
                  </div>
                );
              } 
            );
            this.setState({
              retailerOrderMedicineDetailsView: retailerOrderMedicineDetailsView,
            });
          }
          
          let progressBar = "";
        
          if (orderDetails.order_status === 1) {
            progressBar +=
    
              '<div class="stepwizard-row setup-panel"><div class="stepwizard-step"><a href="javascript:void(0)" type="button" class="btn btn-primary btn-circle"><img src="../images/patient/img/Patient Intake Process/tickmark.svg" /></a><p class="p_dark">Order Placed</p></div><div class="stepwizard-step"><a href="javascript:void(0)" type="button" class="btn btn-default btn-circle">2</a> <p class="p_light">Prescription Verified </p></div><div class="stepwizard-step"><a href="javascript:void(0)" type="button" class="btn btn-default btn-circle">3</a><p class="p_light">Processed </p></div><div class="stepwizard-step"><a href="javascript:void(0)" type="button" class="btn btn-default btn-circle">4</a><p class="p_light">Shipped</p></div><div class="stepwizard-step"><a href="javascript:void(0)" type="button" class="btn btn-default btn-circle">5</a><p class="p_light">Delivered</p></div></div>';
          } else if (orderDetails.order_status === 2) {
            progressBar +=
              '<div class="stepwizard-row setup-panel"><div class="stepwizard-step"><a href="javascript:void(0)" type="button" class="btn btn-primary btn-circle"><img src="../images/patient/img/Patient Intake Process/tickmark.svg" /></a><p class="p_dark">Order Placed</p></div><div class="stepwizard-step"><a href="javascript:void(0)" type="button" class="btn btn-primary btn-circle"><img src="../images/patient/img/Patient Intake Process/tickmark.svg" /></a><p class="p_dark">Prescription Verified </p></div><div class="stepwizard-step"><a href="javascript:void(0)" type="button" class="btn btn-primary btn-circle"><img src="../images/patient/img/Patient Intake Process/tickmark.svg" /></a><p class="p_dark">Processed </p></div><div class="stepwizard-step"><a href="javascript:void(0)" type="button" class="btn btn-default btn-circle">3</a><p class="p_light">Shipped</p></div><div class="stepwizard-step"><a href="javascript:void(0)" type="button" class="btn btn-default btn-circle">4</a><p class="p_light">Delivered</p></div></div>';
          } else if (orderDetails.order_status === 3) {
            progressBar +=
              '<div class="stepwizard-row setup-panel"><div class="stepwizard-step"><a href="javascript:void(0)" type="button" class="btn btn-primary btn-circle"><img src="../images/patient/img/Patient Intake Process/tickmark.svg" /></a><p class="p_dark">Order Placed</p></div><div class="stepwizard-step"><a href="javascript:void(0)" type="button" class="btn btn-primary btn-circle"><img src="../images/patient/img/Patient Intake Process/tickmark.svg" /></a><p class="p_dark">Prescription Verified </p></div><div class="stepwizard-step"><a href="javascript:void(0)" type="button" class="btn btn-primary btn-circle"><img src="../images/patient/img/Patient Intake Process/tickmark.svg" /></a><p class="p_dark">Processed </p></div><div class="stepwizard-step"><a href="javascript:void(0)" type="button" class="btn btn-default btn-circle"></a><p class="p_light">Shipped</p></div><div class="stepwizard-step"><a href="javascript:void(0)" type="button" class="btn btn-default btn-circle">4</a><p class="p_light">Delivered</p></div></div>';
          } else if (orderDetails.order_status === 4) {
            progressBar +=
              '<div class="stepwizard-row setup-panel"><div class="stepwizard-step"><a href="javascript:void(0)" type="button" class="btn btn-primary btn-circle"><img src="../images/patient/img/Patient Intake Process/tickmark.svg" /></a><p class="p_dark">Order Placed</p></div><div class="stepwizard-step"><a href="javascript:void(0)" type="button" class="btn btn-primary btn-circle"><img src="../images/patient/img/Patient Intake Process/tickmark.svg" /></a><p class="p_dark">Prescription Verified </p></div><div class="stepwizard-step"><a href="javascript:void(0)" type="button" class="btn btn-primary btn-circle"><img src="../images/patient/img/Patient Intake Process/tickmark.svg" /></a><p class="p_dark">Processed </p></div><div class="stepwizard-step"><a href="javascript:void(0)" type="button" class="btn btn-primary btn-circle"><img src="../images/patient/img/Patient Intake Process/tickmark.svg" /></a><p class="p_dark">Shipped</p></div><div class="stepwizard-step"><a href="javascript:void(0)" type="button" class="btn btn-default btn-circle"></a><p class="p_light">Delivered</p></div></div>';
          }else if (orderDetails.order_status === 5) {
            progressBar +=
              '<div class="stepwizard-row setup-panel"><div class="stepwizard-step"><a href="javascript:void(0)" type="button" class="btn btn-primary btn-circle"><img src="../images/patient/img/Patient Intake Process/tickmark.svg" /></a><p class="p_dark">Order Placed</p></div><div class="stepwizard-step"><a href="javascript:void(0)" type="button" class="btn btn-primary btn-circle"><img src="../images/patient/img/Patient Intake Process/tickmark.svg" /></a><p class="p_dark">Prescription Verified </p></div><div class="stepwizard-step"><a href="javascript:void(0)" type="button" class="btn btn-primary btn-circle"><img src="../images/patient/img/Patient Intake Process/tickmark.svg" /></a><p class="p_dark">Processed </p></div><div class="stepwizard-step"><a href="javascript:void(0)" type="button" class="btn btn-primary btn-circle"><img src="../images/patient/img/Patient Intake Process/tickmark.svg" /></a><p class="p_dark">Shipped</p></div><div class="stepwizard-step"><a href="javascript:void(0)" type="button" class="btn btn-primary btn-circle"><img src="../images/patient/img/Patient Intake Process/tickmark.svg" /></a><p class="p_dark">Delivered</p></div></div>';
          }else if (orderDetails.order_status === 6) {
            progressBar +=
              '<div class="stepwizard-row setup-panel"><div class="stepwizard-step"><a href="javascript:void(0)" type="button" class="btn btn-primary btn-circle"><img src="../images/patient/img/Patient Intake Process/tickmark.svg" /></a><p class="p_dark">Order Placed</p></div><div class="stepwizard-step"><a href="javascript:void(0)" type="button" class="btn btn-primary btn-circle"><img src="../images/patient/img/Patient Intake Process/tickmark.svg" /></a><p class="p_light">Cancelled </p></div></div>';
          }


          return (
            <div class="container-fluid">
              <div class="row">
                <div class="col-md-12">
                  <div class="back_head" onClick={this.goBackPage.bind(this)}>
                    <h2>
                      <img src="https://i.pinimg.com/736x/9e/b6/0e/9eb60ee1602cb5370382c2582ee2d0d1.jpg" />
                      Back to Order List
                    </h2>
                  </div>
                </div>
              </div>
              <div class="row">
                <div class="col-md-12">
                  <div class="order_det_list">
                    <div class="row">
                      <div class="col-md-12">
                        <div class="order_det_head">
                          <div class="presc_img">
                          {orderDetails.invoice ?
                          <a href={orderDetails.invoice ?  Constant.imgurl+orderDetails.invoice: ""} target="_blank"> 
                            <img src="../images/patient/img/Ordermedicine/OrderList.svg" />
                            </a>
                             : "" }
                          </div>
                          <div class="presc_det">
                            <h2>
                              Order ID: <span>{orderDetails.id}</span>
                            </h2>
                            <h2>
                              Order Date: <span>{userOrderDate}</span>
                            </h2>
                          </div>
                          {orderDetails.order_status==1 ?  <p class="verify_btn">Prescription verification pending..</p> :""}
                          {orderDetails.order_status==2 ?  <p class="verify_btn">Prescription verified</p> :""}
                          {orderDetails.order_status==3 ?  <p class="verify_btn">Processed</p> :""}
                          {orderDetails.order_status==4 ?  <p class="verify_btn">Shipped</p> :""}
                          {orderDetails.order_status==5 ?  <p class="verify_btn">Delivered</p> :""}
                          {orderDetails.order_status==6 ?  <p class="verify_btn">Cancelled</p> :""}
                                    {/* {orderDetails.order_status!=5 ?
                          orderDetails.invoice ? (
                            <p class="verify_btn">Invoice Generated</p>
                          ) : (
                            <p class="verify_btn">
                              Prescription verification pending..
                            </p>
                          ) : <p class="verify_btn">
                          Cancelled
                        </p>
                          } */}
                        </div>
                      </div>
                    </div>

                    <div class="row">
                    <div class="col-lg-6">
                        <div class="delivery_det">
                          <div class="expect_head">
                            <h2>Expected delivery by {expectedDelivery}</h2>
                            <h6>
                              You will received an invoice with order details
                              after verified the prescription by our pharmacy
                            </h6>
                          </div>
                          <div class="expect_wizard">
                            <div class="stepwizard">
                              <div
                                dangerouslySetInnerHTML={{
                                  __html: progressBar,
                                }}
                              />
                            </div>
                          </div>
                          <div class="delivery_address">
                            <h2>Delivery Address</h2>
                            { Object.keys(orderDetails.patient_tbl.delivery_address_tbls).lenght>0 ? 
                            <React.Fragment>
                            <h4>
                              {
                                orderDetails.patient_tbl
                                  .delivery_address_tbls[0].name ? orderDetails.patient_tbl
                                  .delivery_address_tbls[0].name :""
                              }
                            </h4>
                            <p>
                              {
                                orderDetails.patient_tbl
                                  .delivery_address_tbls[0].address ? orderDetails.patient_tbl
                                  .delivery_address_tbls[0].address :""
                              }
                              <br />
                              {
                                orderDetails.patient_tbl
                                  .delivery_address_tbls[0].location
                              }
                              <br />
                              {
                                orderDetails.patient_tbl
                                  .delivery_address_tbls[0].landmark
                              }
                            </p>
                            </React.Fragment>
                            : "" }
                          </div>
                          <div class="delivery_presc">
                            <div class="presc_head">
                              <div class="presc_img">
                              <img src="../images/patient/img/Ordermedicine/RX_Icon.svg" />
                              </div>
                              <div class="presc_det">
                                <h2>UPLOAD &amp; SEND PRESCRIPTION</h2>
                                <h6>You have one Rx medicine in the item</h6>
                              </div>
                            </div>
                            <div class="delivery_upload_img">
                            
           {isPrescriptionImagesList>0 ?
           orderDetails.cart_prescriptions_tbl.medical_document.map((presImages, num) => {
           return(
            <a href={presImages ?  Constant.imgurl+presImages: ""} target="_blank"> 
            <img src="https://icon-library.com/images/prescription-icon/prescription-icon-18.jpg" />
           </a>
           )
          })
          :""}
                              {/* <img src="https://icon-library.com/images/prescription-icon/prescription-icon-18.jpg" /> */}
                            </div>
                            <div class="delivery_upload_btn">
                              <div class="custom-file-upload">
                              <label >Upload
                              <p>or Drag &amp; Drop here</p>
                    <FileBase64
                    multiple={true}
                  onDone={this.getFiles.bind(this)}
                    />
                    </label>
                                {/* <label
                                  for="file-upload"
                                  class="custom-file-upload1"
                                >
                                  Upload
                                <p>or Drag &amp; Drop here</p>
                                 <input id="file-upload" type="file" /> 
                                <FileBase64
                    multiple={true}
                  onDone={this.getFiles.bind(this)}
                    />
                                </label> */}
                    
                    <div class="ret_upload_img">
                    {this.state.prescriptionImage ? 
                    <img src={this.state.prescriptionImage} />
                    :""
                    // <img src="https://icon-library.com/images/prescription-icon/prescription-icon-18.jpg" />
                    }
                    {documentsRelated ? documentsRelated : ""} 
                    
                    {this.state.uploadedImages ? this.state.uploadedImages: ""}
                    </div>
                              </div>
                            </div>
                           
                          </div>
                        </div>
                      </div>
                      <div class="col-lg-6">
                        <div class="payment_det">
                          <div class="pay_head">
                            <h2>Products & Payment details</h2>
                            <p>
                              Medicines for{" "}
                              <span>{orderDetails.patient_tbl.name.charAt(0).toUpperCase() +
                                  orderDetails.patient_tbl.name.slice(1)} ({relation_name})</span>
                            </p>
                          </div>
                          <div class="medicine_sec">
                            {this.state.retailerOrderMedicineDetailsView}
                          </div>
                          <div class="price_det_head">
                            <h2>Price details</h2>
                          </div>
                          <div class="pay_list">
                            <p>
                              {/* Total M.R.P. ({orderedQuantity} x {retailerCurrency} {orderDetails.amount}){" "} */}
                              Total M.R.P.{" "}
                              <span class="tot_amnt">
                              {retailerCurrency} {parseFloat(orderDetails.net_amount).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')}
                              </span>
                            </p>
                            <p>
                              Coupon code applied{" "}
                              <span>
                                - {retailerCurrency} {orderDetails.coupan_value
                                  ? orderDetails.coupan_value
                                  : "0.00"}
                              </span>
                            </p>
                            <p>
                              Shipping Charges
                              <span>
                                + {retailerCurrency} {orderDetails.delivery_charges
                                  ? parseFloat(orderDetails.delivery_charges).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')
                                  : "0.00"}
                              </span>
                            </p>
                          </div>
                         
                          <h4 class="total_payable">
                            Total Paid Amount{" "}
                            <span>
                              
                            {orderDetails.payable_amount
                                ? retailerCurrency+" "+parseFloat(orderDetails.payable_amount).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')
                                : "0.00"}
                            </span>
                          </h4>

                           { orderDetails.order_status > 2 ?  
                           <React.Fragment>
                           
                          <h4 class="total_payable">
                            Billed Amount{" "}
                            <span>
                              
                            {orderDetails.total_paid
                                ? retailerCurrency+" "+parseFloat(orderDetails.total_paid).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')
                                : "0.00"}
                            </span>
                          </h4>
                          <h4 class="total_payable">
                            Refund Amount{" "}
                            <span>
                             
                            {orderDetails.total_paid && orderDetails.payable_amount
                                ? (retailerCurrency+" "+( parseFloat(orderDetails.payable_amount)-parseFloat(orderDetails.total_paid)).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,'))
                                : ("0.00")}
                            </span>
                          </h4>
                          </React.Fragment>
                          : "" }

                          <div class="pay_mode">
                            <h2>Payament Mode</h2>
                            <h3>
                              Paid Through :
                              <span>
                                {orderDetails.payment_mode
                                  ? orderDetails.payment_mode
                                  : "Card"}
                              </span>
                            </h3>
                          </div>
                          <div>
                          <a
                              orderId={orderDetails.id}
                              retailerId={orderDetails.retailer_id}
                              href="javascript:void(0);"
                              onClick={this.cancelCurrentOrder.bind(this)}
                            >
                              {" "}
                              {orderDetails.order_status != 5 ?
                              <p class="cancel_txt">Cancel Order</p>
                              :""}
                            </a>
                            </div>
                        </div>
                      </div>
                     
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        });
        this.setState({
          orderDetails: orderDetails,
        });
      }
    });
  };

  getOrderDetails = (patientId) => {
  //  patientId = 7;
    Httpconfig.httptokenget(
      Constant.siteurl +
        "api/OM/orderProcess/getPatientOrderDetails/" +
        patientId
    ).then((response) => {
      if (response.data.status == "200" && response.data.error == false) {
        // console.clear();
        console.log(response);
        // this.setState({orderDetails: response.data.data });
        const orderDetailsView = response.data.data.map((orderDetails, num) => {
          let orderItemsLength = orderDetails.order_processing_tbls.length;
          let retailerCurrency =
            orderDetails.retailer_registration_tbl.currency;
          let total="";

          // var total_amount = 0;
          // if (orderItemsLength > 0) {
          //   orderDetails.order_processing_tbls.forEach((arg) => {
          //     total_amount += parseFloat(arg.amount);
          //   });
          // }
          // total_amount = total_amount.toFixed(2);

          let orderDate = "N/A";
          let userOrderDate = "N/A";
          let expectedDelivery = "N/A";
          orderDate = orderDetails.order_date;
          if (orderItemsLength > 0) {
            // orderDate = orderDetails.order_invoice_tbls[0].order_date;
            let newdate = orderDate.split("-").reverse().join("-");
            // userOrderDate = moment(newdate, "DD-MM-YYYY").format('LL');
            
            // userOrderDate = new Date(newdate[0], newdate[1] - 1, newdate[2]).toGMTString();
          }
          userOrderDate = moment(orderDate).format("dddd, MMMM Do YYYY");
          // alert("Order Date "+orderDetails.order_date);
          let isRetailerData = Object.keys(orderDetails.retailer_registration_tbl).length;
          if(isRetailerData > 0){
             let slabDate = orderDetails.retailer_registration_tbl.set_delivery_days;
             if(slabDate){
              // let orderDate = moment(orderDate).format("YYYY-MM-DD");
              var nowPlusOneDay = moment(orderDetails.order_date).add('days', slabDate);
                  expectedDelivery = nowPlusOneDay.format('YYYY-MM-DD');
             }
             expectedDelivery = moment(expectedDelivery).format("dddd, MMMM Do YYYY");
          }



          let progressBar = "";
          if (orderDetails.order_status === 1) {
            progressBar +=
    
              '<div class="stepwizard-row setup-panel"><div class="stepwizard-step"><a href="javascript:void(0)" type="button" class="btn btn-primary btn-circle"><img src="../images/patient/img/Patient Intake Process/tickmark.svg" /></a><p class="p_dark">Order Placed</p></div><div class="stepwizard-step"><a href="javascript:void(0)" type="button" class="btn btn-default btn-circle">2</a> <p class="p_light">Prescription Verified </p></div><div class="stepwizard-step"><a href="javascript:void(0)" type="button" class="btn btn-default btn-circle">3</a><p class="p_light">Processed </p></div><div class="stepwizard-step"><a href="javascript:void(0)" type="button" class="btn btn-default btn-circle">4</a><p class="p_light">Shipped</p></div><div class="stepwizard-step"><a href="javascript:void(0)" type="button" class="btn btn-default btn-circle">5</a><p class="p_light">Delivered</p></div></div>';
          } else if (orderDetails.order_status === 2) {
            progressBar +=
              '<div class="stepwizard-row setup-panel"><div class="stepwizard-step"><a href="javascript:void(0)" type="button" class="btn btn-primary btn-circle"><img src="../images/patient/img/Patient Intake Process/tickmark.svg" /></a><p class="p_dark">Order Placed</p></div><div class="stepwizard-step"><a href="javascript:void(0)" type="button" class="btn btn-primary btn-circle"><img src="../images/patient/img/Patient Intake Process/tickmark.svg" /></a><p class="p_dark">Prescription Verified </p></div><div class="stepwizard-step"><a href="javascript:void(0)" type="button" class="btn btn-primary btn-circle"><img src="../images/patient/img/Patient Intake Process/tickmark.svg" /></a><p class="p_dark">Processed </p></div><div class="stepwizard-step"><a href="javascript:void(0)" type="button" class="btn btn-default btn-circle">3</a><p class="p_light">Shipped</p></div><div class="stepwizard-step"><a href="javascript:void(0)" type="button" class="btn btn-default btn-circle">4</a><p class="p_light">Delivered</p></div></div>';
          } else if (orderDetails.order_status === 3) {
            progressBar +=
              '<div class="stepwizard-row setup-panel"><div class="stepwizard-step"><a href="javascript:void(0)" type="button" class="btn btn-primary btn-circle"><img src="../images/patient/img/Patient Intake Process/tickmark.svg" /></a><p class="p_dark">Order Placed</p></div><div class="stepwizard-step"><a href="javascript:void(0)" type="button" class="btn btn-primary btn-circle"><img src="../images/patient/img/Patient Intake Process/tickmark.svg" /></a><p class="p_dark">Prescription Verified </p></div><div class="stepwizard-step"><a href="javascript:void(0)" type="button" class="btn btn-primary btn-circle"><img src="../images/patient/img/Patient Intake Process/tickmark.svg" /></a><p class="p_dark">Processed </p></div><div class="stepwizard-step"><a href="javascript:void(0)" type="button" class="btn btn-default btn-circle"></a><p class="p_light">Shipped</p></div><div class="stepwizard-step"><a href="javascript:void(0)" type="button" class="btn btn-default btn-circle">4</a><p class="p_light">Delivered</p></div></div>';
          } else if (orderDetails.order_status === 4) {
            progressBar +=
              '<div class="stepwizard-row setup-panel"><div class="stepwizard-step"><a href="javascript:void(0)" type="button" class="btn btn-primary btn-circle"><img src="../images/patient/img/Patient Intake Process/tickmark.svg" /></a><p class="p_dark">Order Placed</p></div><div class="stepwizard-step"><a href="javascript:void(0)" type="button" class="btn btn-primary btn-circle"><img src="../images/patient/img/Patient Intake Process/tickmark.svg" /></a><p class="p_dark">Prescription Verified </p></div><div class="stepwizard-step"><a href="javascript:void(0)" type="button" class="btn btn-primary btn-circle"><img src="../images/patient/img/Patient Intake Process/tickmark.svg" /></a><p class="p_dark">Processed </p></div><div class="stepwizard-step"><a href="javascript:void(0)" type="button" class="btn btn-primary btn-circle"><img src="../images/patient/img/Patient Intake Process/tickmark.svg" /></a><p class="p_dark">Shipped</p></div><div class="stepwizard-step"><a href="javascript:void(0)" type="button" class="btn btn-default btn-circle"></a><p class="p_light">Delivered</p></div></div>';
          }else if (orderDetails.order_status === 5) {
            progressBar +=
              '<div class="stepwizard-row setup-panel"><div class="stepwizard-step"><a href="javascript:void(0)" type="button" class="btn btn-primary btn-circle"><img src="../images/patient/img/Patient Intake Process/tickmark.svg" /></a><p class="p_dark">Order Placed</p></div><div class="stepwizard-step"><a href="javascript:void(0)" type="button" class="btn btn-primary btn-circle"><img src="../images/patient/img/Patient Intake Process/tickmark.svg" /></a><p class="p_dark">Prescription Verified </p></div><div class="stepwizard-step"><a href="javascript:void(0)" type="button" class="btn btn-primary btn-circle"><img src="../images/patient/img/Patient Intake Process/tickmark.svg" /></a><p class="p_dark">Processed </p></div><div class="stepwizard-step"><a href="javascript:void(0)" type="button" class="btn btn-primary btn-circle"><img src="../images/patient/img/Patient Intake Process/tickmark.svg" /></a><p class="p_dark">Shipped</p></div><div class="stepwizard-step"><a href="javascript:void(0)" type="button" class="btn btn-primary btn-circle"><img src="../images/patient/img/Patient Intake Process/tickmark.svg" /></a><p class="p_dark">Delivered</p></div></div>';
          }else if (orderDetails.order_status === 6) {
            progressBar +=
              '<div class="stepwizard-row setup-panel"><div class="stepwizard-step"><a href="javascript:void(0)" type="button" class="btn btn-primary btn-circle"><img src="../images/patient/img/Patient Intake Process/tickmark.svg" /></a><p class="p_dark">Order Placed</p></div><div class="stepwizard-step"><a href="javascript:void(0)" type="button" class="btn btn-primary btn-circle"><img src="../images/patient/img/Patient Intake Process/tickmark.svg" /></a><p class="p_light">Cancelled </p></div></div>';
          }
          
          total=parseFloat(orderDetails.payable_amount).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');

          return (
            <div class="my_order_box">
              <div class="order_box_head">
                <div class="presc_img">
                {orderDetails.invoice ?
                <a href={orderDetails.invoice ?  Constant.imgurl+orderDetails.invoice: ""} target="_blank"> 
                <img src="../images/patient/img/Ordermedicine/OrderList.svg" />
                </a>
                :""}
                </div>
                <div class="presc_det">
                  <h2>
                    Order ID: <span>{orderDetails.id}</span>
                  </h2>
                  <h2>
                    Order Date: <span>{userOrderDate}</span>
                  </h2>
                </div>
                {orderDetails.order_status==1 ?  <p class="verify_btn">Prescription verification pending..</p> :""}
                {orderDetails.order_status==2 ?  <p class="verify_btn">Prescription verified</p> :""}
                {orderDetails.order_status==3 ?  <p class="verify_btn">Processed</p> :""}
                {orderDetails.order_status==4 ?  <p class="verify_btn">Shipped</p> :""}
                {orderDetails.order_status==5 ?  <p class="verify_btn">Delivered</p> :""}
                {orderDetails.order_status==6 ?  <p class="verify_btn">Cancelled</p> :""}
                {/* {orderDetails.order_status!=5 ?
                orderDetails.invoice ? (
                  <p class="verify_btn">Invoice Generated</p>
                ) : (
                  <p class="verify_btn">Prescription verification pending..</p>
                )
                : <p class="verify_btn">Cancelled</p>
              } */}
                {/* Prescription verification pending */}
              </div>
              <div class="expect_delivery">
                <h3>Expected delivery by {expectedDelivery}</h3>
                <h6>
                  You will received an invoice with order details after verified
                  the prescription by our pharmacy
                </h6>
                <div class="delivery_list">
                  <div class="item_amnt">
                    <p>{orderItemsLength} items</p>
                    <h2>
                    {retailerCurrency} {total}
                    </h2>
                  </div>

                  <div class="item_flow">
                    <div class="stepwizard">
                      <div dangerouslySetInnerHTML={{ __html: progressBar }} />
                    </div>
                  </div>
                   <div class="view_det_sec">
                  <div class="view_details_btn">
                    <a
                      orderId={orderDetails.id}
                      retailerId={orderDetails.retailer_id}
                      href="javascript:void(0);"
                      onClick={this.getCompleteOrderDetails.bind(this)}
                    >
                      <p>
                        view details{" "}
                      </p>
                    </a>
                  </div>
                  </div>
                </div>
              </div>
            </div>
          );
        });

        this.setState({
          orderDetailsView: orderDetailsView,
        });
      }
    });
  };

  // getFiles(files) {
  //   this.setState({ files: files });
  //   // console.log(this.state.files[0].base64);
  //   // console.log(this.state.files);
  //   //alert(this.state.files[0].base64);
  //   let patientId = this.state.patientId;
  //   let patientProfileImage = this.state.files[0].base64;
  //   this.state.patientProfileImage = patientProfileImage;
  //   this.forceUpdate();
  //   Httpconfig.httptokenput(
  //     Constant.siteurl + "api/Users/uploadimages/" + patientId,
  //     {
  //       profile_pic: this.state.files[0].base64,
  //     }
  //   )
  //     .then((response) => {
  //       toast.success("👌 Profile Image Updated Successfully", {
  //         position: "bottom-center",
  //       });
  //     })
  //     .catch((error) => {
  //       this.props.history.push("/patienthealthprofile");
  //       console.log(error);
  //       toast.error(error);
  //     });
  // }

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
    //var  documentsRelated = [];
    if(this.state.files){
    let imageArray = this.state.files;
   // alert(imageArray.length); 
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
     // alert(documentsRelated);
     $('#ret_upload_img').after(documentsRelated);
    }
    
    this.state.uploadedImages=documentsRelated;

    console.log(this.state.uploadedImages);
    //this.forceUpdate();
    
  }
    return (
      <main id="main_ord_nav">
        {/* ja-jp */}
        {/* en-us */}
        {/* de-de */}
        {/* fr-ca */}
        <PatientHeader onSelectLanguage={this.handleLanguage} />
        <I18nPropvider locale={this.state.Language}>
          {this.state.is_view_profile == true ? (
            <section id="order_profile">
              <div class="pro_section">
                <div class="container">
                  <div class="row">
                    <div class="col-lg-4 col-md-12 col-sm-12 col-xs-12">
                    <PatientSideMenu />
                      {/* <div class="profile_menu_sec1" id="pro_menu">
                        <div class="profile_box">
                          {this.state.patientProfileImage != "" ? (
                            <img src={this.state.patientProfileImage} />
                          ) : this.state.PatientGender == "Male" ? (
                            <img src="../images/patient/img/Profile/Male_patient.svg" />
                          ) : (
                            <img src="../images/patient/img/Profile/Female_patient.svg" />
                          )}
                          <a href="javascript:void(0)">
                            {" "}
                            <h2 class="edit_avtar">
                              <div class="input-group">
                                <span class="input-group-btn">
                                  <span class="btn btn-default btn-file">
                                    <img
                                      src="../images/patient/img/Profile/edit.svg"
                                      onClick={this.uploadProfilePic}
                                    />
                                    <FileBase64
                                      multiple={true}
                                      onDone={this.getFiles.bind(this)}
                                    />
                                  </span>
                                </span>
                              </div>
                            </h2>
                          </a>
                          <div class="profile_name_sec">
                            <p class="hello_word">{translate("Hello!")}</p>
                            <p class="doc_name">{this.state.name ? this.state.name.charAt(0).toUpperCase() +this.state.name.slice(1):""}</p>
                          </div>
                        </div>
                        <ul class="profile-menu-ul-1">
            <li class=""><a href="/Patientdashboard"><img src="../images/patient/img/Ordermedicine/myAppointment.svg" />{translate('My Appointment')} <span class="right_arrow"><img  src="../images/patient/img/Ordermedicine/rightIcon.svg" /></span></a></li>
            <li class="profile_li">
                          <a href="/patient/myOrders">
                            <img src="../images/patient/img/Ordermedicine/MyOrder.svg"/>
                            {translate("My Orders")}
                            <span class="right_arrow"><img  src="../images/patient/img/Ordermedicine/rightIcon.svg" /></span>
                          </a>
                        </li>
                        <li class=""><a href="#"><img src="../images/patient/img/Ordermedicine/MyProfile.svg" />My Saved Medicine  <span class="right_arrow"><img  src="../images/patient/img/Ordermedicine/rightIcon.svg" /></span></a></li>
            <li class="" onClick={this.addPatient}><a href="/patient/Patientprofile"><img src="../images/patient/img/Ordermedicine/MyProfile.svg" />{translate('My Profile')}  <span class="right_arrow"><img  src="../images/patient/img/Ordermedicine/rightIcon.svg" /></span></a></li>
          
          
                        <li class="">
                          <a href="/patient/manageAddress">
                            <img src="../images/patient/img/Ordermedicine/locationicon.svg" />
                            {translate("Manage Address")}
                            <span class="right_arrow"><img  src="../images/patient/img/Ordermedicine/rightIcon.svg" /></span>
                          </a>
                        </li>
                        <h2>Others</h2>
            <li class=""><a href="#"><img src="../images/patient/img/Ordermedicine/PrivacyPolicy.svg" />{translate('Privacy Policy')}
            <span class="right_arrow"><img  src="../images/patient/img/Ordermedicine/rightIcon.svg" /></span>
            </a></li>
            <li class=""><a href="#"><img src="../images/patient/img/Ordermedicine/T&C.svg" />{translate('Terms & Conditions')}
            <span class="right_arrow"><img  src="../images/patient/img/Ordermedicine/rightIcon.svg" /></span>
            </a></li>
            
            
            </ul>
                      </div> */}
                    </div>
                    {/* Side Menu Ends here */}

                    {/* Starts First Div 8 */}
                    <div
                      class="col-lg-8 col-md-12 col-sm-12 col-xs-12"
                      id="first_set"
                    >
                      <div class="my_orders">
                        <div class="order_head">
                          <h2>My Orders</h2>
                          <h5>Upcoming</h5>
                        </div>
                        <div class="my_order_list">
                          {/* Static Box Starts from here */}
                          {this.state.orderDetailsView}

                          {/* Static Block Ends */}
                        </div>
                      </div>
                    </div>
                    {/* Ends div 8 */}
                  </div>
                </div>
              </div>
            </section>
          ) : (
            <React.Fragment>
              {" "}
              <section id="order_view_det">
                <div class="pro_section">
                  <div class="container">
                    <div class="row">
                      {/* <div class="col-lg-4 col-md-12 col-sm-12 col-xs-12">
                        <div class="profile_menu_sec" id="pro_menu">
                          <div class="profile_box">
                            {this.state.patientProfileImage != "" ? (
                              <img src={this.state.patientProfileImage} />
                            ) : this.state.PatientGender == "Male" ? (
                              <img src="../images/patient/img/Profile/Male_patient.svg" />
                            ) : (
                              <img src="../images/patient/img/Profile/Female_patient.svg" />
                            )}
                            <a href="javascript:void(0)">
                              {" "}
                              <h2 class="edit_avtar">
                                <div class="input-group">
                                  <span class="input-group-btn">
                                    <span class="btn btn-default btn-file">
                                      <img
                                        src="../images/patient/img/Profile/edit.svg"
                                        onClick={this.uploadProfilePic}
                                      />
                                      <FileBase64
                                        multiple={true}
                                        onDone={this.getFiles.bind(this)}
                                      />
                                    </span>
                                  </span>
                                </div>
                              </h2>
                            </a>
                            <div class="profile_name_sec">
                              <p class="hello_word">{translate("Hello!")}</p>
                              <p class="doc_name">{this.state.name}</p>
                            </div>
                          </div>

                          <ul class="profile-menu-ul-1">
                            <li class="profile_li">
                              <a href="/Patientdashboard">
                                <img src="../images/patient/img/Profile/My Appointment.svg" />
                                {translate("My Appointment")}
                              </a>
                            </li>
                            <li class="" onClick={this.addPatient}>
                              <a href="javascript:void(0)">
                                <img src="../images/patient/img/Profile/My Profile.svg" />
                                {translate("My Profile")}
                              </a>
                            </li>
                            <li class="profile_li">
                              <a href="/patient/myOrders">
                                <img src="../images/patient/img/Profile/My Appointment.svg" />
                                {translate("My Orders")}
                              </a>
                            </li>
                            <li class="profile_li">
                              <a href="/patient/manageAddress">
                                <img src="../images/patient/img/Profile/My Appointment.svg" />
                                {translate("Manage Address")}
                              </a>
                            </li>
                            <li class="">
                              <a href="javascript:void(0)">
                                <img src="../images/patient/img/Profile/Privacy Policy.svg" />
                                {translate("Privacy Policy")}
                              </a>
                            </li>
                            <li class="">
                              <a href="javascript:void(0)">
                                <img src="../images/patient/img/Profile/Terms & Conditions.svg" />
                                {translate("Terms & Conditions")}
                              </a>
                            </li>
                          </ul>
                        </div>
                      </div> */}
                      {/* Side Menu Ends here */}
                      <div
                        class="col-lg-12 col-md-12 col-sm-12 col-xs-12"
                        id="second_set"
                      >
                        {/* <h3> Hai Avinash Iam second Div </h3> */}
                        {this.state.orderDetails}
                        {/* {this.state.uploadedImages} */}
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            </React.Fragment>
          )}
          <PatientFooter />
        </I18nPropvider>
      </main>
    );
  }
}
