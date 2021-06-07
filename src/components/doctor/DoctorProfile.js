import React, { Component, useState } from "react";
import $ from "jquery";
import { ToastContainer } from "react-toastify";
import { Redirect } from "react-router-dom";
import toast from "../../helpers/toast";
import { Link } from "react-router-dom";
import Httpconfig from "../helpers/HttpconfigDoctor";
import Constant from "../../constants";
import { FormattedMessage, IntlProvider } from "react-intl"; // Backup Way to Convert
import { I18nPropvider, LOCALES } from "../../i18nProvider";
import translate from "../../i18nProvider/translate";
import Patnewcss from "../../public/css/doctor/doctor.css";
import DoctorHeader from "../doctor/DoctorHeader";
import DoctorSideMenu from "../doctor/DoctorSideMenu";
import PatientFooter from "../patient/Patientfooter";
const moment = require("moment");

export default class DoctorProfile extends Component {
    constructor(props) {
      super(props);
      this.state = {
        fields: {},
        errors: {},
        files: [],
        doctorData:[],
  
      
      };
      this.viewAllTelemedicineAppointment=this.viewAllTelemedicineAppointment.bind(this);
    }
    viewAllTelemedicineAppointment=()=>{
      window.location.href = "./Doctortelemedicineappointments";
    }
    componentDidMount=()=>{

        var retrievedObject=localStorage.getItem('DocuserObj');
        let userData=JSON.parse(retrievedObject)
        let doctorName=userData.name;

        this.setState({
            doctor_id: userData.doctor_id,
            doctorName: doctorName.charAt(0).toUpperCase() + doctorName.slice(1),
            doctorMobile: userData.mobile_number,

        })
        Httpconfig.httptokenget(Constant.siteurl + "api/Doctor/DoctorProfiler/"+userData.doctor_id,)
        .then((response) => {
           if(response.status=='200' && response.data.error===false){

              let doctorDOBData="";
              if(response.data.data[0].dob!=null){
                doctorDOBData=response.data.data[0].dob.split("T");
             }
           
              this.setState({
                  doctorData:response.data.data,
                  doctorDob:doctorDOBData[0],
              })
            }else{
              //toast.warn("Sorry we cannot update the Availibility status at this moment", {
                //  position: "bottom-center",
              //  });
          }
        })
        .catch((error) => {
          toast.error(error);
        });

    }
    

    render() {
        return (
            <main id="main">
            <DoctorHeader onSelectLanguage={this.handleLanguage}/>
        <I18nPropvider locale={this.state.Language}>
        <section id="doctor_dashboard">
  <div class="container-fluid">
    <div class="row">
     <DoctorSideMenu onSelectLanguage={this.handleLanguage}/> 
     
     {this.state.doctorData.map((doctorDetails) => (
         
    <div class="col-lg-10 col-md-9">
    {console.log(doctorDetails)}
 <section id="doc_profile_section">
     <div class="row">
      {/*<DoctorSideMenu onSelectLanguage={this.handleLanguage}/> */}
         <div class="col-md-12">
             <div class="profile_info">
                 <h2>Personal Information</h2>
                 <div class="profile_details">
                     <p>Name: <span>{doctorDetails.doctor_name? doctorDetails.doctor_name.charAt(0).toUpperCase() + doctorDetails.doctor_name.slice(1) :""}</span></p> 
                     <p>Phone: <span>{doctorDetails.mobile_no}</span></p>
                     <p>DOB: <span> {moment(this.state.doctorDob).format('Do MMMM , YYYY')}</span></p>
                     <p>Gender: <span>{doctorDetails.gender}</span></p>
                     <p>Country: <span>India</span></p> 
                     <p>Language: <span>{doctorDetails.selected_language_name }</span></p>
                 </div>
             </div>
             <div class="profile_info">
                <h2>Medical Qualification</h2>
                <div class="profile_details">
                    <p>Course Name: <span>{doctorDetails.education ? doctorDetails.education : "--" }</span></p>
                    <p>Medical Education Details: <span>{doctorDetails.medical_college_name ? doctorDetails.medical_college_name : "--" }</span></p>
                    <p>Registration Details: <span>{doctorDetails.registraion_no ? doctorDetails.registraion_no : "--" }</span></p>
                    <p>Professioanl Details: <span>{doctorDetails.speciality_name ? doctorDetails.speciality_name : "--" }</span></p>
                </div>
            </div>
            <div class="profile_info">
                <h2>Contact Information</h2>
                <div class="profile_details">
                    <p>Pincode: <span>{doctorDetails.zip_code ? doctorDetails.zip_code : "--" }</span></p>
                    <p>Area: <span>{doctorDetails.area ? doctorDetails.area : "--" }</span></p>
                    <p>City: <span>{doctorDetails.city ? doctorDetails.city : "--" }</span></p>
                    <p>State: <span>{doctorDetails.state ? doctorDetails.state : "--" }</span></p>
                    
                </div>
            </div>
            <div class="upload_info">
                
                <div class="upload_details">
                    <h2>Your Signature</h2>
                    <div  class="sign_img">
                   <img src={doctorDetails.signature_pic ? Constant.imgurl+doctorDetails.signature_pic : "" }  alt="" />
                </div>
                </div>
                 
                <div class="upload_details">
                    <h2>Your Picture</h2>
                    <div  class="user_img">
                    
                   <img src={doctorDetails.profile_pic!="" ? Constant.imgurl+doctorDetails.profile_pic : doctorDetails.gender.toLowerCase()=='male' ? "../images/patient/img/Profile/Male_patient.svg" :"../images/patient/img/Profile/Female_patient.svg"  }  alt="" />
                </div>
                </div>
            </div>
         </div>
     </div>
 </section>
 
</div>
      ))}
</div>
</div>
</section>


  
</I18nPropvider >
 <PatientFooter/>
  </main>

        );
    }
}