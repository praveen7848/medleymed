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
import PatientSideMenu from "../patient/Patientsidemenu";
const moment = require("moment");


export default class Patientappointment extends Component {

   constructor(props) {
      super(props);

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
componentDidMount =() =>{
    var retrievedObject = localStorage.getItem("userObj");
    // alert(retrievedObject);
     if(retrievedObject=="" || retrievedObject==null ){
         window.location.href = "/Patientlogin";
     }
    var appointmentId = localStorage.getItem('PatientselectedAppointment');
    //appointmentId="95272";
    Httpconfig.httptokenget(Constant.siteurl + "api/PatientAppointment/PatientAppointmentDetails/"+appointmentId.replace(/"/g,''),)
    .then((response) => {
       // let doctorDOBData=response.data.data[0].dob.split("T");
        //alert(response.data.data.doctor_education_tbls)
      if(response.data.status=="200" && response.data.error==false){
        let doctorImage="";
        let patientImage="";
        if(response.data.data[0].patient_tbl.profile_pic!=null){
            patientImage=Constant.imgurl+response.data.data[0].patient_tbl.profile_pic;
         }else{
             if(response.data.data[0].patient_tbl.gender.toLowerCase()=="male"){
                patientImage="../images/patient/img/Profile/Male_patient.svg";
             }else{
                patientImage="../images/patient/img/Profile/Female_patient.svg";
             }
         }
         if(response.data.data[0].doctor_tbl.profile_pic!=""){
            doctorImage=Constant.imgurl+response.data.data[0].doctor_tbl.profile_pic;
         }else{
             if(response.data.data[0].doctor_tbl.gender.toLowerCase()=="male"){
                doctorImage="../images/patient/img/Profile/Male_doctor.svg";
             }else{
                doctorImage="../images/patient/img/Profile/Female_doctor.svg";
             }
         }
          this.setState({
              "patientName":response.data.data[0].patient_tbl.name,
              "appointmentDate":moment(response.data.data[0].appointment_datetime).format("Do MM YYYY "),
              "patientImage":patientImage,
              "gender":response.data.data[0].gender,
              "doctorName":response.data.data[0].doctor_tbl.tbl_user.name,
              "doctorSpeciality":response.data.data[0].doctor_tbl.speciality,
              "doctorImage":doctorImage,

            // patientName:"rakesh",
            // appointmentDate:moment(responseData.data.appointment_datetime).format("Do MM YYYY "),
            // profileImage:responseData.data.profile_pic,
            // gender:"Male"

          })
      }else{
          toast.warn("Sorry we cannot update the Availibility status at this moment", {
              position: "bottom-center",
            });
      }
    })
    .catch((error) => {
      toast.error(error);
    });


}
navigate=()=>{
    this.props.history.push("/Patientvideocall");
  }
  handleLanguage=(langValue)=>{
       
    this.setState({Language: langValue});
}
    
render() {
   
    return (
<main id="main">
        <PatientHeader onSelectLanguage={this.handleLanguage}/>
        <I18nPropvider locale={this.state.Language} >
        
        <section id="ceras_hlth">
<div class="container-fluid">
    <div class="row">
        <div class="col-md-12">
        <div class="ceras_wait_room">
            <h2>Waiting Room</h2>
         
        </div>
    </div>
    </div>
    <div class="ceras_main">
    <div class="row">
        <div class="col-md-12">
           
            <div class="col-md-6 ceras_col">
            <div class="ceras_ptnt_dtls">
                <div class="row">
                    <div class="col-md-3 text-center">
                       <div class="ceras_pat_img">
                           <img src={this.state.patientImage} alt="" />
                       </div>
                    </div>
                    <div class="col-md-9 ">
                    <div class="cr_dtls">
                        <h5>Hello,</h5>
                        <h2>Mr. {this.state.patientName}</h2>
                        <p>Your appointment with</p>
                    </div>
                    {/* <div class="prv_camera">
                       <a href="#"><p><i class="fa fa-video-camera" aria-hidden="true"></i>Preview Camera</p></a> 
                    </div> */}
                    </div>
                </div>
            </div>
            </div>
            <div class="col-md-6 ceras_col">
              <div class="doctor_dtls text-center">
                  <div class="doctor_img">
                      <img src={this.state.doctorImage}/>
                   <h2>Dr.{this.state.doctorName}</h2>
                   <h5>{this.state.doctorSpeciality}</h5>
                    </div>

                    </div>
              </div>
            </div>
        </div>
        </div>
        <div class="ceras_video_app text-center">
          <div class="row">
            <div class="col-md-12">
            <p><i class="fa fa-video-camera" aria-hidden="true"></i></p>
          </div>
        </div>
        </div>
        <div class="row">
            <div class="col-md-12">
            <div class="consult_start text-center">
              {/* <h3>Your consultation will be start at 20:00</h3> */}
            <a href="#">
              <div class="join_btn">
             <div class="row">
                 <div class="col-md-12">
                 <div class="col-md-2 col-sm-2 col-xs-2 join_center">
                    <p><i class="fa fa-video-camera" aria-hidden="true"></i></p>
                 </div>
                 <div class="col-md-8 col-sm-8 col-xs-8 ">
                    <div class="join" onClick={this.navigate}>
                  
                        <h2>Join Now</h2>
                        <h5>Join the video call</h5>
                      
                     </div> 
                 </div>
                 <div class="col-md-2 col-sm-2 col-xs-2 join_right">
                    <p><i class="fa fa-arrow-right" aria-hidden="true"></i></p>
                 </div>
             </div>
            </div>
        </div>
      </a>
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