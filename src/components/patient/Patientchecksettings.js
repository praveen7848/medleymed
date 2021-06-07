import React, { Component, useState } from 'react';
import $ from "jquery";
import { ToastContainer } from "react-toastify";
import toast from "../helpers/toast";
import { Link } from "react-router-dom";
import Httpconfig from "../helpers/Httpconfig";
import Constant from "../../constants";
import { FormattedMessage } from "react-intl"; // Backup Way to Convert
import { I18nPropvider, LOCALES } from '../../i18nProvider';
import translate from "../../i18nProvider/translate";
import PatientHeader from "../patient/Patientheader";
import PatientMenu from "../patient/Patientmenu";
import PatientFooter from "../patient/Patientfooter";
import Patnewcss from "../../public/css/patient/style_video_call.css";
import { reactLocalStorage } from "reactjs-localstorage";
const moment = require("moment");



export default class Patientchecksettings extends Component {

   constructor(props) {
      super(props);
      this.showPreview=this.showPreview.bind(this);
      this.closePreview=this.closePreview.bind(this);
      this.navigate=this.navigate.bind(this);
      
      
      this.state = {
         showlogin: true,
         showsignup: false,
         Language: localStorage.getItem("Language_selected"),

         chronic: '',
         medicineOptions: [],
         medicineArray: [],
         selectedMedicineList: {},
         selectedMedicineValue: [],

         drugAllergiesOptions: [],
         drugAllergiesArray: [],
         selectedDrugList: {},
         selectedDrugValue: [],
         Language:"",

      };
     

   }
   componentDidUpdate = () => {
    var lang = localStorage.getItem('Language_selected');
    if (lang != null) {
        if (this.state.Language != lang) {
            this.state.Language = lang;
            console.log("notnull " + this.state.Language);
            this.forceUpdate();
        }
        //
    } else {
        this.state.Language = "en-us";
        console.log(this.state.Language);
    }
}
componentDidMount= () =>{
    var appointmentId = localStorage.getItem('PatientselectedAppointment');
    //var retrievedObject="";    
    var retrievedObject = localStorage.getItem("userObj");
    //alert(retrievedObject);
    if(retrievedObject=="" || retrievedObject==null ){
      toast.error("Please login to book an appointment", {
        //  position: "bottom-center",
        });
        const interval = setInterval(() => {
          //alert("in");
          window.location.href = "/Patientlogin";
     }, 1000); 
     
         
    }
   // alert(appointmentId);
   // appointmentId=userData.;
    Httpconfig.httptokenget(Constant.siteurl + "api/PatientAppointment/PatientAppointmentDetails/"+JSON.parse(appointmentId),)
        .then((response) => {
          if(response.data.status=="200" && response.data.error==false){
              if(response.data.data[0].status==3){
                window.location.href = "/Patientdashboard";
              }
              if(response.data.data[0].status==4){
                window.location.href = "/Patientdashboard";
              }
             // alert("p");
              let patientImage="";
          //  alert(response.data.data[0].patient_tbl.name);
         let  appointmentTime=response.data.data[0].appointment_datetime.split(" ");
         if(response.data.data[0].patient_tbl.profile_pic!=null){
            patientImage=Constant.imgurl+response.data.data[0].patient_tbl.profile_pic;
         }else{
             if(response.data.data[0].patient_tbl.gender.toLowerCase()=="male"){
                patientImage="../images/patient/img/Profile/Male_patient.svg";
             }else{
                patientImage="../images/patient/img/Profile/Female_patient.svg";
             }
         }
         
//alert(appointmentTime);
               this.setState({
                   "patientName":response.data.data[0].patient_tbl.name,
                   "appointmentDate":moment(response.data.data[0].appointment_datetime).format("Do MM,YYYY "),
                   "appointmentTime":moment(response.data.data[0].appointment_datetime).format("HH:mm A") ,
                   "profileImage":patientImage,
                   "gender":response.data.data[0].gender,
            //     // patientName:"rakesh",
            //     // appointmentDate:moment(response.data.data[0].appointment_datetime).format("Do MM YYYY "),
            //     // profileImage:response.data.data[0].patient_tbl.profile_pic,
            //     // gender:response.data.data[0].patient_tbl.gender

               })
          }else{
              toast.warn("Sorry we cannot update the Availibility status at this moment", {
                  position: "bottom-center",
                });
          }
         // alert(this.state.patientName);
        })
        .catch((error) => {
          toast.error(error);
        });




}

    
    showPreview=()=>{
    var video = document.getElementById('video');
    document.getElementById('pateint_welcome').style.display = "none";
    document.getElementById('close_preview').style.display = "block";
    
    // // Get access to the camera!
    
    if(navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        // Not adding `{ audio: true }` since we only want video now
        navigator.mediaDevices.getUserMedia({ video: true }).then(function(stream) {
          //  video.src = window.URL.createObjectURL(stream);
            video.srcObject = stream;
            video.play();
        });
    }
    
    }

 closePreview=()=>{
    document.getElementById('pateint_welcome').style.display = "block";
    document.getElementById('close_preview').style.display = "none";
    
    //alert("in");
    var videoElem = document.getElementById('video');
    const stream = videoElem.srcObject;
    const tracks = stream.getTracks();
  
    tracks.forEach(function(track) {
      track.stop();
    });
  
    videoElem.srcObject = null;
  }
  navigate=()=>{
    this.props.history.push("/Patientappointment");
  }
  handleLanguage=(langValue)=>{
       
    this.setState({Language: langValue});
}
    
render() {
   
    return (
        <main id="main">
        
         <I18nPropvider locale={this.state.Language} >
         <PatientHeader onSelectLanguage={this.handleLanguage}/>
    <br/><br/>
        <section id="ceras_patient">
        
<div class="container-fluid">
    <div class="row">
        <div class="col-md-12">
        <div class="ceras_patient_head">
            <h2>Waiting Room</h2>
            {/* <!-- <p>16 April 2020, 05:00 PM, Thursday</p> --> */}
        </div>
    </div>
    </div>
   <div class="cr_block">
   <div class="row" id="pateint_welcome">
       <div class="col-md-3 text-center">
            <div class="ptnt_main">
                <img src={this.state.profileImage} alt="" />
            </div>
       </div>
       <div class="col-md-9">
     <div class="ptnt_dtls">
         <h5>Hello</h5>
         <h2>{this.state.gender=='Male'? "Mr. " : "Mrs. "} {this.state.patientName}</h2>
         <p>Your appointment is on <br />{this.state.appointmentDate} at {this.state.appointmentTime} with </p>
     </div>

     <div class="ptnt_prv_camera" onClick={this.showPreview}>
         <h5>We recommend please click on the button below to check setup</h5>
        <a href="#"><p><i class="fa fa-video-camera" aria-hidden="true"></i>Preview Camera</p></a> 
     </div>
    </div>
   </div>


      <div class="row" id="close_preview" style={{display:"none"}} onClick={this.closePreview}> 
      <div class="col-md-12">
     <div id="local-media" class="ptnt_dtls"> 
        <video id="video"></video>
     </div>
      <div class="ptnt_prv_camera1" align="center">
         <a href="#" id ="button-close" ><p >Close</p></a> 
      </div>
      </div>
  </div>


   </div>

   <div class="nxt_btn text-center">
       <div class="row">
           <div class="col-md-12">
              <a href="#" onClick={this.navigate}> <p>Next <i class="fa fa-arrow-right" aria-hidden="true" ></i></p></a>
           </div>
       </div>
   </div>
        </div>
      
    
</section>
<PatientFooter/>
</I18nPropvider>
</main>
    )
    
   
}
}