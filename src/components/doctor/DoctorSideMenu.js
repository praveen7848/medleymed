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

export default class DoctorSideMenu extends Component {
    constructor(props) {
      super(props);
      this.state = {
        Doctorprofile:"",
        Doctordashboard:"",
        Doctorviewslots:"",
        DoctorConsultationHistory:""
        
      
      };
      this.viewDoctorDashboard=this.viewDoctorDashboard.bind(this);
      this.viewDoctorSlots=this.viewDoctorSlots.bind(this);
      this.viewDoctorConsultationHistory=this.viewDoctorConsultationHistory.bind(this);
    }
    viewDoctorprofile=()=>{
        window.location.href="./Doctorprofile"

    }
    viewDoctorDashboard=()=>{
        window.location.href="./Doctordashboard"
    }
    viewDoctorSlots=()=>{
        window.location.href="./Doctorviewslots"
    }
    viewDoctorConsultationHistory=()=>{
        window.location.href="./DoctorConsultationHistory"
    }
    componentDidMount=()=>{
       let url_path=window.location.pathname;
       let pages=url_path.split("/");
       var page=pages[2];
       var obj={};
      //alert(page);
       obj[page]="active";
       this.setState(obj);
       var retrievedObject=localStorage.getItem('DocuserObj');
       let userData=JSON.parse(retrievedObject)
       Httpconfig.httptokenget(Constant.siteurl + "api/Doctor/DoctorProfiler/"+userData.doctor_id,)
       .then((response) => {
           
          if(response.status=='200' && response.data.error===false){
             this.setState({
                 doctorProfileImage:response.data.data[0].profile_pic,//response.data.data[0].profile_pic,
                 doctorGender:response.data.data[0].gender.toLowerCase(),
                
             })
           }
       })
       .catch((error) => {
         toast.error(error);
       });

       
    }
    render() {
        return (
          <div class="col-lg-2 col-md-3 no_padding">
    
    <div class="doctor_sidemenu">
        <ul>
    <li 
    className={
        this.state.Doctorprofile!=""
        ? "doc_pro_img active"
        : "doc_pro_img"
      }
    
    onClick={this.viewDoctorprofile}>
        

        {this.state.doctorProfileImage ?  
        <img src={Constant.imgurl+this.state.doctorProfileImage} /> :
        this.state.doctorGender=='male' ?
         <img src="../images/patient/img/Profile/Male_doctor.svg"/>
        : 
        <img src="../images/patient/img/Profile/Female_doctor.svg" />
        }
            <p>My Profile</p>
        
    </li>
    
    <li
    className={ this.state.Doctordashboard!="" ? "doc_side_box active" : "doc_side_box" } 
     onClick={this.viewDoctorDashboard}>
        <img src="../images/doctor-img/dashboard-icon.svg" />
        <p>Dashboard</p>
    </li>
    <li 
     className={
        this.state.Doctorviewslots!=""
        ? "doc_side_box active"
        : "doc_side_box"
      } 
    onClick={this.viewDoctorSlots}>
        <img src="../images/doctor-img/available-slot.svg" />
        <p>View Slot</p>
    </li>
    
    <li
     className={
        this.state.DoctorConsultationHistory!=""
        ? "doc_side_box active"
        : "doc_side_box"
      }  
      onClick={this.viewDoctorConsultationHistory}> 
        <img src="../images/doctor-img/consultationHistory-icon.svg" />
        <p>Consultation History</p>
    </li>
    {/* <li
     className={
        this.state.DoctorConsultationHistory!=""
        ? "doc_side_box active"
        : "doc_side_box"
      }  
      onClick={this.viewDoctorConsultationHistory}> 
        <img src="../images/doctor-img/consultationHistory-icon.svg" />
        <p>Logout</p>
    </li> */}
        </ul>
    </div>
       
    
    </div>
  

        );
    }
}