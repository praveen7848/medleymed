import React, { PropTypes, Component, useState } from "react";
import $ from "jquery";
import { ToastContainer, toast } from 'react-toastify';
import { Redirect } from "react-router-dom";
import { Link } from "react-router-dom";
import Httpconfig from "../helpers/Httpconfig";
import Constant from "../../constants";
import { FormattedMessage } from "react-intl"; // Backup Way to Convert
import { I18nPropvider, LOCALES } from "../../i18nProvider";
import translate from "../../i18nProvider/translate";
import Patnewcss from "../../public/css/patient/style-new.css";
import PatientHeader from "../patient/Patientheader";
import PatientFooter from "../patient/Patientfooter";
import { reactLocalStorage } from "reactjs-localstorage";

import PatientpaymentGateway from "../patient/PatientPaymentGateway";
import { wrap } from "module";
const moment = require("moment");


export default class PatientConfirmAppointment extends Component {
  constructor(props) {
    super(props);
    
    this.state = {
      showlogin: true,
      showsignup: false,
      Language: "",
      date: new Date(),
      name: "",
      user_mobile: "",
      email_id: "",
      token: "",
      userId: "",
      profile_image: "",
      fields: {},
      errors: {},
      checked: "",
      termsconditions: "",
      coupon: "",
      code: "",
      amount: "",
      response:"",
      patientMedicalDocument:"",
      confirm:"",
    };

    this.openCheckout = this.openCheckout.bind(this);
    this.checkTermsConditions = this.checkTermsConditions.bind(this);
    this.handleUpdate = this.handleUpdate.bind(this);
    this.checkCoupon = this.checkCoupon.bind(this);
    this.handleCode = this.handleCode.bind(this);
    this.showDirections=this.showDirections.bind(this);
   // this.updateTransaction=this.updateTransaction.bind(this);

  }
  
//On Load of the Component
  componentDidUpdate = () => {
    var lang = localStorage.getItem("Language_selected");
    if (lang != null) {
      if (this.state.Language != lang) {
        this.state.Language = lang;
       // console.log("notnull " + this.state.Language);
        this.forceUpdate();
      }
      //
    } else {
      this.state.Language = "en-us";
    //  console.log(this.state.Language);
    }
    var sort=document.getElementsByClassName("upload_img");
      for (let i = 0; i < sort.length; i++) {
       sort[i].addEventListener("click", function(event) {
       this.setState({
        zoomimage:event.currentTarget.src,
      })
       
       }.bind(this))
       
     }
  };
  // To get detais after first render
  componentDidMount = () => {
    let appointmentId="";
    var patient_id=null;
    var retrievedObject = localStorage.getItem("userObj");
    
    let doctorId = localStorage.getItem("DoctorSelected");
        appointmentId = localStorage.getItem("appointmentId");
    let consultationMonth=moment().format('MMMM');
    let consultationDate=moment().format('DD');
    let consultationTime=moment().add(5, 'minutes').format('hh:mm A');
    let consultationDateTime=moment().add(5, 'minutes').format('YYYY-MM-DD hh:mm A');
   // alert(appointmentId);
   if(appointmentId==null){
     
      toast.warn("Please enter purpose of consultation", {
              });
    setTimeout(
      () => this.props.history.push("/Patientconsultationpurpose"),
      2000
    );
    


   }
   if( localStorage.getItem('seletedSlot_time')!=null){
      consultationDateTime = reactLocalStorage.getObject('seletedSlot_time');
      consultationTime= moment(consultationDateTime).format("Do-MM-YYYY h:mm A");
   }
   if(retrievedObject==null){
    window.location.href = "/";
   }
    let userData = JSON.parse(retrievedObject);
     patient_id=localStorage.getItem('SelectedPatientId');
    if(patient_id!=null || patient_id!=""){
      userData.patient_id=patient_id;
  }
    this.setState({
      name: userData.name,
      user_mobile: userData.mobile_number,
      email_id: userData.email,
      token: userData.accessToken,
      patient_id:userData.patient_id,
      profile_image: "",
      appointmentId:appointmentId,
      doctorId:doctorId,
    })
     Httpconfig.httptokenget(Constant.siteurl + "api/Doctor/DoctorProfiler/"+JSON.parse(doctorId),)
      .then((responseData) => {
        

        if(responseData.data.status=="200" && responseData.data.error==false){
          let profile_pic="";
          if(responseData.data.data[0].profile_pic!=""){
           // alert(profile_pic);
            profile_pic= Constant.imgurl+responseData.data.data[0].profile_pic;
           // alert(profile_pic);
           }else{
             if(responseData.data.data[0].gender.toLowerCase()=="male"){
             profile_pic='../images/patient/img/Profile/Male_patient.svg';
             }else{
              profile_pic='../images/patient/img/Profile/Female_patient.svg';
             }
           }
          this.setState({
            doctorName:responseData.data.data[0].tbl_user.name.charAt(0).toUpperCase() + responseData.data.data[0].tbl_user.name.slice(1),
            patient_id:userData.patient_id,
            speciality:responseData.data.data[0].speciality_name,
            address:responseData.data.data[0].address,
            fees:responseData.data.data[0].fees,
            experience:responseData.data.data[0].experience,
            profile_pic:profile_pic,//responseData.data.data[0].profile_pic,
            is_available:responseData.data.data[0].is_available,
            languages:responseData.data.data[0].languages,
            lat_long:responseData.data.data[0].lat_long,
            consultationMonth:consultationMonth,
            consultationDate:consultationDate,
            consultationTime:consultationTime,
            consultationDateTime:consultationDateTime,
            currencySymbol:responseData.data.data[0].currency_symbol,
            education:responseData.data.data[0].education,
          })
        } 
      })
      .catch((error) => {
        toast.error(error);
      });
      appointmentId=JSON.parse(appointmentId);
      let postData=[
        {"appointment_id":appointmentId,"patient_id":userData.patient_id}
      ]
      Httpconfig.httptokenpost(Constant.siteurl + "api/Patients/getMedicalDetails/",{"appointment_id":appointmentId,"patient_id":JSON.parse(userData.patient_id)})
      .then((response) => {

        let patientCurrentMedication="";
        let patientDrugAllergies="";
        let symptoms_tbls="";
        let patientMedicalDocument=[];
        let imagedata=[];
        let patientAge="";
        let chornicDiseases_list="";
        let relatedMedication="";
        let drugAllergies="";
        let symptoms="";
        let bloodPressureSystolic="";
        let bloodPressureDiastolic="";
        let height="";
        let weight="";
        let bmi="";
        let pulse_rate="";
        let respiratory_rate="";
        let skip_blood_pressure="";
        let temperature="";
        let patientName=response.data.data[0].name.charAt(0).toUpperCase() + response.data.data[0].name.slice(1);
        let gender=response.data.data[0].gender;
        let profile_pic="";
        let blood_sugar="";
        let pastillness="";
        if(response.data.data[0].dob!=null){
          let dob=response.data.data[0].dob.split("T");
          let age=dob[0];
          let ageYears=moment().diff(age, 'years');
          let ageMonths=moment().diff(age, 'months');
          let ageDays=moment().diff(age, 'days');
          if(ageYears>0){
              patientAge=ageYears+" Years";
          }else if(ageMonths!=""){
              patientAge=ageMonths +" Months";
          }else if(ageDays!=""){
              patientAge=ageDays+" Days";
          }
      }
      if(response.data.data[0].profile_pic!=null){
        profile_pic= Constant.imgurl+response.data.data[0].profile_pic;
        //alert(profile_pic);
       }else{
         if(gender.toLowerCase()=="male"){
         profile_pic='../images/patient/img/Profile/Male_patient.svg';
         }else{
           
          profile_pic='../images/patient/img/Profile/Female_patient.svg';
         }
       }
            this.state.patientName=patientName;
            this.state.gender=gender;
            this.state.dob=patientAge;
            this.state.profilePics=profile_pic;
            this.state.relation=response.data.data[0].master_relationship.relation_name;
            if(Object.keys(response.data.data[0].patient_past_histories).length>0){
        let pastLength=response.data.data[0].patient_past_histories[0]['patient_current_medication'].length;
        if(pastLength>0){
          for(var past=0;past<pastLength;past++){
            
            patientCurrentMedication=patientCurrentMedication+","+response.data.data[0].patient_past_histories[0]['patient_current_medication'][past]['medicinename'];

          }
        }
      }
        
        if(Object.keys(response.data.data[0].patient_past_histories).length>0){
          if(response.data.data[0].patient_past_histories[0]['past_history']!=null){
          pastillness=pastillness+","+response.data.data[0].patient_past_histories[0]['past_history'];
          }
        let drugAllergiesLength=response.data.data[0].patient_past_histories[0]['patient_drug_allergies'].length;
        if(drugAllergiesLength>0){
          
          for(var past=0;past<drugAllergiesLength;past++){
            if(response.data.data[0].patient_past_histories[0]['patient_drug_allergies'][past]['medicinename']!=null){
             patientDrugAllergies=patientDrugAllergies+","+response.data.data[0].patient_past_histories[0]['patient_drug_allergies'][past]['medicinename'];
            }
          }
        }
      }
     // alert(pastillness);

      if(Object.keys(response.data.data[0].drug_allergies).length>0){
        let drugAllergiesLength=response.data.data[0].drug_allergies.length;
        if(drugAllergiesLength>0){
          for(var past=0;past<drugAllergiesLength;past++){
            patientDrugAllergies=patientDrugAllergies+","+response.data.data[0].drug_allergies[past].medicinename;
          }
        }
      }
        
      
        if(Object.keys(response.data.data[0].symptoms_tbls).length>0){
          if(response.data.data[0].symptoms_tbls[0].add_more_symptoms!=null){
           symptoms_tbls= response.data.data[0].symptoms_tbls[0].add_more_symptoms;
          }
          //alert(symptoms_tbls);
        let symptomsLength=response.data.data[0].symptoms_tbls[0]['symptoms'].length;
        if(symptomsLength>0){
          for(var past=0;past<symptomsLength;past++){
            
            symptoms_tbls=symptoms_tbls+","+response.data.data[0].symptoms_tbls[0]['symptoms'][past]['description'];

          }
        }
      }
      
      
        let documentsLength=response.data.data[0].patient_past_histories.length;
        if(documentsLength>0){ 
          for(var pastdoc=0;pastdoc<documentsLength;pastdoc++){
            for(let doc=0;doc<response.data.data[0].patient_past_histories[pastdoc]['patient_medical_document'].length;doc++) {            
              patientMedicalDocument[doc]=response.data.data[0].patient_past_histories[pastdoc]['patient_medical_document'][doc].replace("jpeg", "jpg");
            imagedata[doc]='<div class="med_upload_box"><a href="#" class="thumbnail" data-toggle="modal" data-target="#lightbox"> <img class="upload_img" src='+Constant.imgurl+patientMedicalDocument[doc]+'><p>Health record '+(doc+1)+'</a></p></div>';
            }
          }
        }
     
        if(response.data.data[0].chornic_diseases_list!=null){
          if(Object.keys(response.data.data[0].chornic_diseases_list).length>0){
          chornicDiseases_list=response.data.data[0].chornic_diseases_list;
          }
        }
         if(response.data.data[0].related_medication!=null){
          if(Object.keys(response.data.data[0].related_medication).length>0){
            relatedMedication=response.data.data[0].related_medication;
          }
         }
       
        if(Object.keys(response.data.data[0].vital_informations).length>0){
          bloodPressureSystolic=response.data.data[0].vital_informations[0].blood_pressure_systolic;
          bloodPressureDiastolic=response.data.data[0].vital_informations[0].blood_pressure_diastolic;

          
          var realFeet = ((response.data.data[0].vital_informations[0].height*0.393700) / 12);
          var feet = Math.floor(realFeet);
          var inches = Math.round((realFeet - feet) * 12);
          feet= feet+ "'," + inches + '"';
          response.data.data[0].vital_informations[0].height=feet;

 
          height=response.data.data[0].vital_informations[0].height;
          weight=response.data.data[0].vital_informations[0].weight;
          bmi=response.data.data[0].vital_informations[0].bmi;
          pulse_rate=response.data.data[0].vital_informations[0].pulse_rate;
          respiratory_rate=response.data.data[0].vital_informations[0].respiratory_rate;
          skip_blood_pressure= response.data.data[0].vital_informations[0].skip_blood_pressure;
          temperature=response.data.data[0].vital_informations[0].temperature;
          blood_sugar=response.data.data[0].vital_informations[0].blood_sugar;
          if(response.data.data[0].chornic_diseases_list!=null){
            pastillness=pastillness+","+response.data.data[0].chornic_diseases_list;
          }
         // pastillness=pastillness+","+response.data.data[0].patient_past_histories;
        }
      if( symptoms_tbls.indexOf(',') > -1 && response.data.data[0].symptoms_tbls[0].add_more_symptoms==null){
       symptoms_tbls=symptoms_tbls.substr(1);
      }
       if( patientDrugAllergies.indexOf(',') > -1){
        patientDrugAllergies=patientDrugAllergies.substr(1);
       }
       if( pastillness.indexOf(',') > -1){
        pastillness=pastillness.substr(1);
       }
       
       
       
          this.setState({
            
            chornicDiseases_list:chornicDiseases_list,
            relatedMedication:relatedMedication,
            drugAllergies:patientDrugAllergies,
            symptoms:symptoms_tbls,
            bloodPressureSystolic:bloodPressureSystolic,
            bloodPressureDiastolic:bloodPressureDiastolic,
            height:height,
            weight:weight,
            bmi:bmi,
            pulse_rate:pulse_rate,
            respiratory_rate:respiratory_rate,
            skip_blood_pressure: skip_blood_pressure,
            temperature:temperature,
            patientMedicalDocument:patientMedicalDocument,
            imagedata:imagedata,
            problem:response.data.data[0].problem_tbls[0].problem,
            blood_sugar:blood_sugar,
            pastillness:pastillness,
          });
          this.forceUpdate();
         
      })
      .catch((error) => {
        toast.error(error);
      });
      
   
  };
  //check/Update for the  Terms and conditions 
  handleUpdate = () => {
    this.setState({ checked: !this.state.checked });
    if (this.state.checked) {
      this.setState({ termsconditions: "" });
    } else {
      this.setState({ termsconditions: "" });
    }
  };

  // skip payment gateway
  skipPayment=()=>{
    let patientId=this.state.patient_id;
    let doctorFees=this.state.fees;
    var doctorId=JSON.parse(this.state.doctorId);
    //doctorId=doctorId.replace(/"/g,'');
    let consultationDateTime=this.state.consultationDateTime;
    let appointmentId=this.state.appointmentId;
    let time=(moment(consultationDateTime, 'HH:mm:ss').format('HH:mm:ss'));
    let consultationDate=consultationDateTime.split(" ");
    let cDateTime=consultationDate[0]+" "+moment(time).format('YYYY-MM-DD HH:mm');
    cDateTime=moment().add(5, 'minutes').format('YYYY-MM-DD HH:mm:ss');

    if( localStorage.getItem('seletedSlot_time')!=null){
      cDateTime = reactLocalStorage.getObject('seletedSlot_time');
    }
    if(doctorFees==null){
    this.state.fees=100;
  }
    let transactionId=Math.floor(100000 + Math.random() * 900000);
      let postData=
        {
          "patient_id":patientId,
          "doctor_id":JSON.parse(doctorId),
          "appointment_datetime":cDateTime,
          "appointment_id":parseInt(appointmentId),
          "transaction_id":transactionId,
          "status":"1",
          "consultation_fee":doctorFees
        }
   
      Httpconfig.httptokenpost(Constant.siteurl + "api/PatientAppointment/", postData)
  .then((response) => {

    if(response.data.status=="200" && response.data.error==false){
      reactLocalStorage.remove("appointmentId");
      localStorage.removeItem("appointmentId");
      reactLocalStorage.remove("SelectedPatientId");
        toast.success("Thank you for booking appointment, you can view your appointment details", {
            position: "bottom-center",
          });
    // toast.success(response.data.message, {
    //     position: "top-center",
    //   });
      setTimeout(() => window.location.href="/Patientdashboard" ,2000);
      
    } 
  })
  .catch((error) => {
    toast.error(error);
  });
  }
  //check for the Terms and conditions checked/Unchecked
  
  checkTermsConditions = () => {
    if (this.state.checked) {
      this.setState({ termsconditions: "" });
      this.state.amount = 100 / 100;
      this.skipPayment();
      //this.openCheckout();
     //this.paySlackCheckout();
      this.state.confirm=1;
    } else {
      this.setState({ termsconditions: "Please check the Terms & Conditions" });
    }
  };
// Language Change handler
  handleLanguage = (langValue) => {
    this.setState({ Language: langValue });
  };
// Coupon validate handler
  checkCoupon = () => {
    if (!this.state.coupon) {
      this.setState({ code: "Enter the Coupon Code" });
    } else {
      this.setState({ code: "" });
    }
  };
// Verify Coupon Code
  handleCode = (event) => {
    this.setState({ coupon: event.target.value });
    if (event.target.value != "") {
      this.setState({ code: "" });
    }
  };
  // Checkout for the payment
  openCheckout = (e) => {
    let patientId=this.state.patient_id;
    let doctorFees=this.state.fees;
    var doctorId=this.state.doctorId;
    doctorId=doctorId.replace(/"/g,'');
    let consultationDateTime=this.state.consultationDateTime;
    let appointmentId=this.state.appointmentId;
    let time=(moment(consultationDateTime, 'HH:mm:ss').format('HH:mm:ss'));
    let consultationDate=consultationDateTime.split(" ");
    let cDateTime=consultationDate[0]+" "+moment(time).format('YYYY-MM-DD HH:mm');
    cDateTime=moment().add(5, 'minutes').format('YYYY-MM-DD HH:mm:ss');

    if( localStorage.getItem('seletedSlot_time')!=null){
      cDateTime = reactLocalStorage.getObject('seletedSlot_time');
    }
    if(doctorFees==null){
    this.state.fees=100;
  }
  
    let options = {
      key: "rzp_test_aAAD0kSwxE5hUz",
      amount: this.state.fees*100, //this.state.amount, // 2000 paise = INR 20, amount in paisa
      name: "MedleyMed",
      //currency:"NGN",
      description: "Consultation booking",
      image: "https://medleymed.com/img/logo.png",
      handler: function (response) {
    
      let transactionId=response.razorpay_payment_id;
      let postData=
        {
          "patient_id":patientId,
          "doctor_id":JSON.parse(doctorId),
          "appointment_datetime":cDateTime,
          "appointment_id":parseInt(appointmentId),
          "transaction_id":transactionId,
          "status":"1",
          "consultation_fee":doctorFees
        }
   
      Httpconfig.httptokenpost(Constant.siteurl + "api/PatientAppointment/", postData)
  .then((response) => {

    if(response.data.status=="200" && response.data.error==false){
      reactLocalStorage.remove("appointmentId");
      reactLocalStorage.remove("SelectedPatientId");
        toast.success("Thank you for booking an appointment, you can view your appointment details", {
            position: "bottom-center",
          });
    toast.success(response.data.message, {
        position: "top-center",
      });
      setTimeout(() => window.location.href="/Patientdashboard" ,2000);
      
    } 
  })
  .catch((error) => {
    toast.error(error);
  });
      },
      modal: {
        ondismiss: function(){
        }
      },
      prefill: {
        name: "Rakesh",
        email: "rakesh.n@medleymed.com",
        phone: "9652726606",
      },
      notes: {
        address: this.state.address,
      },
      theme: {
        color: "#555AB9",
      },
    };
    let rzp = new window.Razorpay(options);
    //  let rzp = new Razorpay(options);
    rzp.open();

  };
  // Previous page Handler
 goBack=()=>{
  window.location.href = "/availabledoctors";
 }
 // Show the Map Directions
 showDirections = () => {
   
  window.open("https://maps.google.com?q=17.3529,78.5357",'_blank' );
};

// Checkout for the payment payslack
paySlackCheckout = (e) => {
  let patientId=this.state.patient_id;
  let doctorFees=this.state.fees;
  var doctorId=this.state.doctorId;
      doctorId=doctorId.replace(/"/g,'');
  let consultationDateTime=this.state.consultationDateTime;
  let appointmentId=this.state.appointmentId;
  let time=(moment(consultationDateTime, 'HH:mm:ss').format('HH:mm:ss'));
  let consultationDate=consultationDateTime.split(" ");
  let cDateTime=consultationDate[0]+" "+moment(time).format('YYYY-MM-DD HH:mm');
  cDateTime=moment().add(5, 'minutes').format('YYYY-MM-DD HH:mm:ss');

  if( localStorage.getItem('seletedSlot_time')!=null){
    cDateTime = reactLocalStorage.getObject('seletedSlot_time');
  }
  if(doctorFees==null){
  this.state.fees=100;
  }
    let postData=
      {
        "patient_id":patientId,
        "doctor_id":JSON.parse(doctorId),
        "appointment_datetime":cDateTime,
        "appointment_id":parseInt(appointmentId),
        "transaction_id":"",
        "status":"1",
        "email":this.state.email_id,
        "consultation_fee":doctorFees
      }
      this.state.appointmentDetails=postData;
      //console.log(postData);
      this.forceUpdate();
}

render() {
    return (
      <main id="main">
        {/* ja-jp */}
        {/* en-us */}
        {/* de-de */}
        {/* fr-ca */}
        <PatientHeader onSelectLanguage={this.handleLanguage} />

        <I18nPropvider locale={this.state.Language}>
          <section id="availavle_doc">
            <div class="container">
              <div class="row av_box">
                <div class="col-lg-6 col-md-12 col-sm-12">
                  <div class="available_heading">
                    <h4>
                      <img src="../images/patient/img/Doctors_List/View Profile/Back.svg" onClick={this.goBack} />
                      {translate("Select Doctor")}
                    </h4>
                    <h2>{translate("Available Doctors for Telemedicine")}</h2>
                  </div>
                </div>
                <div class="col-lg-6 col-md-12 col-sm-12"></div>
              </div>
            </div>
          </section>

          <section id="pay_now">
            <div class="container">
              <div class="row">
                <div class="col-lg-8 col-md-12 col-sm-12">
                  <div class="pay_appoint_box">
                    <div class="row">
                      <div class="col-lg-2 col-md-2 col-sm-12">
                        <div class="pay_avtar">
                          <img
                            src={this.state.profile_pic ? this.state.profile_pic : '../images/patient/img/Profile/Male_doctor.svg'}
                            alt=""
                          />
                        </div>
                      </div>
                      <div class="col-lg-6 col-md-7 col-sm-12">
                        <div class="doc_info">
                          <h2>{translate("Dr")}. {this.state.doctorName}</h2>
                          <h5>{this.state.education ? this.state.education :"--"},{this.state.speciality ? this.state.speciality : "--"}</h5>
                          <h5>{this.state.experience ? this.state.experience : "1" } {translate("years experience")}</h5>
                          <p>
                            {/* <span>
                              <img src="../images/patient/img/Doctors_List/View Profile/1.svg" />
                              80%
                            </span>
                            <span>
                              <img src="../images/patient/img/Doctors_List/Filters/Rating_color.svg" />
                              250 {translate("reviews")}
                            </span> */}
                            <span>{this.state.currencySymbol} {this.state.fees}</span>
                          </p>
                        </div>
                      </div>
                      <div class="col-lg-4 col-md-3 col-sm-12">
                        {/* <div class="doc_directions" style={{overflowWrap:"break-word"}}>
                          
                          <h5>
                           {this.state.address}
                          </h5>
                          <p onClick={this.showDirections}>
                            <img
                              class="loc_img"
                              src="../images/patient/img/Doctors_List/Directions.svg"
                            />{" "}
                            {translate("Directions")}
                          </p>
                        </div> */}
                      </div>
                    </div>
                    <div class="row">
                      <div class="col-md-12">
                        <p class="subtitle">
                          <span>{translate("appointment with")}</span>
                        </p>
                      </div>
                    </div>
                    <div class="row">
                      <div class="col-lg-2 col-md-2 col-sm-12">
                        <div class="pay_avtar">
                        
                          <img
                            src={this.state.profilePics!=null ? this.state.profilePics : '../images/patient/img/Profile/Male_patient.svg'}
                            alt=""
                          />
                        </div>
                      </div>
                      <div class="col-lg-10 col-md-10 col-sm-12">
                        <div class="doc_info">
                          <h2>
                            {this.state.patientName} <span>({this.state.relation})</span>
                          </h2>
                          <h5>
                           {this.state.gender ? translate(this.state.gender) :""}, <span>{this.state.dob ? this.state.dob : "--"}</span>
                          </h5>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="consult_box">
                    <div class="row c_row">
                      <div class="col-lg-2 col-md-3 col-sm-3">
                        <div class="date_time">
                          <p>{this.state.consultationMonth}</p>
                          <h3>{this.state.consultationDate}</h3>
                        </div>
                      </div>
                      <div class="col-lg-10 col-md-9 col-sm-9">
                        <div class="consult_text">
                          <h1>{translate("Consultation Time")}</h1>
                          <p>
                            {translate("Your appointment will be start at")}{" "}
                            <span>{this.state.consultationTime}</span>
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="consult_box">
                    <div class="row c_row">
                      <div class="col-lg-2 col-md-3 col-sm-3">
                        <div class="date_time">
                          <h3><input
                          type="checkbox"
                          class="patientConsent"
                          defaultChecked="true"
                         // onClick={this.patientConsent}
                        />{" "}
                        </h3>
                        </div>
                      </div>
                      <div class="col-lg-10 col-md-9 col-sm-9">
                        <div class="consult_text">
                          <h1>{translate("Consent to view health details")}</h1>
                          <p>
                            {translate("Uncheck if you do not want to allow the doctor to see your health details")}{" "}
                            
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="medical_box">
                    <div class="row c_row">
                      <div class="col-lg-1 col-md-3 col-sm-3">
                        <div class="medical_img">
                          <img src="../images/patient/img/In_person_visit/Medical_details.svg" />
                        </div>
                      </div>
                      <div class="col-lg-11 col-md-9 col-sm-9">
                        <div class="medical_text">
                          <h1>{translate("Consultation Time")}</h1>
                          <p>
                            {translate("Your appointment will be start at")}{" "}
                            <span>{this.state.consultationTime}</span>
                          </p>
                        </div>
                      </div>
                    </div>
                    <div class="row">
                      <div class="col-lg-6 col-md-6">
                        <div class="medical_head">
                          <h1>{translate("Purpose of visit")}</h1>
                          <p>{this.state.problem}</p>
                        </div>
                      </div>
                      <div class="col-lg-6 col-md-6">
                        <div class="medical_head">
                          <h1>{translate("Symptoms")}</h1>
                          <p>{this.state.symptoms ? this.state.symptoms: "--"}</p>
                        </div>
                      </div>
                    </div>
                    <div class="medical_hr"></div>
                    <div class="row">
                      <div class="col-lg-12 col-md-12">
                        <div class="medical_head">
                          <h1>{translate("Vital Informations")}</h1>
                          <p>
                            {translate("Blood pressure")} <span>{this.state.bloodPressureSystolic ? this.state.bloodPressureSystolic : "--"} mmHg , {this.state.bloodPressureDiastolic ? this.state.bloodPressureDiastolic : "--"} mmHg</span>
                          </p>
                          
                          <p>
                          {translate('Pulse Rate')} <span>{this.state.pulse_rate ? this.state.pulse_rate : "--"} , Breaths per Minute</span>
                          </p>
                          <p>
                          {translate('Temperature')} <span>{this.state.temperature ? this.state.temperature: "--"} , fahrenheit</span>
                          </p>
                          <p>
                          {translate('Respiratory Rate')} <span>{this.state.respiratory_rate ? this.state.respiratory_rate : "--"} , Breaths per Minute</span>
                          </p>
                          <p>
                          {translate('Blood Sugar')} <span>{this.state.blood_sugar ? this.state.blood_sugar :" --"} , mg/dL</span>
                          </p>
                          <p>
                          {translate('Height')} <span>{this.state.height ? this.state.height :"--"} feet.Inch</span>
                          </p>
                          <p>
                          {translate('Weight')} <span>{this.state.weight ? this.state.weight :"--"} Kg</span>
                          </p>
                          <p>
                          {translate('Body Mass Index')} <span>{this.state.bmi? this.state.bmi: "--"} , kg/M2 </span>
                          </p>
                        </div>
                      </div>
                    </div>

                    <div class="medical_hr"></div>
                    <div class="row">
                      <div class="col-lg-6 col-md-6">
                        <div class="medical_head">
                          <h1>{translate("Social History")}</h1>
                          <p>{this.state.pastillness ? this.state.pastillness :"--"}</p>
                        </div>
                      </div>
                      <div class="col-lg-6 col-md-6">
                        <div class="medical_head">
                          <h1>{translate("Patient Drug Allergies")}</h1>
                          <p>{this.state.drugAllergies ? this.state.drugAllergies : "--"}</p>
                        </div>
                      </div>
                    </div>
                    <div class="medical_hr"></div>
                    <div class="row">
                      <div class="col-lg-12 col-md-12">
                        <div class="medical_head">
                          <h1>{translate("Uploaded Document")}</h1>
                          
                          { this.state.imagedata!="" ? <div dangerouslySetInnerHTML={{ __html: this.state.imagedata }} /> :"--"}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="col-lg-4 col-md-12 col-sm-12">
                  <div class="fee_box">
                    {/* <h2>{translate("Fee Details")}</h2> */}
                    {/* <div>
                      <p>{translate("consultation Fees")}</p>
                      <h5>{this.state.currencySymbol} {this.state.fees}</h5>
                    </div> */}
                    {/* <p>{translate("Have a Coupon Code")}?</p> */}
                    {/* <div class="form-group">
                      <div class="input-group">
                        <FormattedMessage id="Enter Your Code">
                          {(placeholder) => (
                            <input
                              type="text"
                              class="form-control code_input"
                              value={this.state.coupon}
                              placeholder={placeholder}
                              onChange={this.handleCode}
                            />
                          )}
                        </FormattedMessage>
                        <span
                          class="input-group-addon app_btn"
                          onClick={this.checkCoupon}
                        >
                          <span>{translate("Apply")}</span>
                        </span>
                      </div>
                      <span className="cRed">{this.state.code}</span>
                    </div> */}
                    {/* <div class="fees_hr"></div> */}
                    {/* <div>
                      <h2>{translate("Net Payable Amount")}</h2>
                      <h5> {this.state.fees}</h5>
                    </div> */}
                    <div class="fee_terms">
                      <p>
                        <input
                          type="checkbox"
                          class="fee_check"
                          defaultChecked={this.state.checked}
                          onClick={this.handleUpdate}
                        />{" "}
                        {translate("Accept Terms and conditions")}
                      </p>
                      <span className="cRed">{this.state.termsconditions}</span>
     
    {this.state.confirm=="" ?
                      <button
                        type="button"
                        class="fee_book"
                        onClick={this.checkTermsConditions}
                      >
                        {translate("Book Now")}
                      </button>
                      : "" //PatientpaymentGateway(this.state.appointmentDetails) 
                    }
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
          <ToastContainer />
          <PatientFooter />
        </I18nPropvider>
      </main>
    );
  }
}
