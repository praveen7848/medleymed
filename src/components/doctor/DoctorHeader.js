import React, { Component, useState } from "react";
import $ from "jquery";
import { ToastContainer, toast } from 'react-toastify';
import { Redirect } from "react-router-dom";
import { Link } from "react-router-dom";
import Httpconfig from "../helpers/HttpconfigDoctor";
import Constant from "../../constants";
import { FormattedMessage, IntlProvider } from "react-intl"; // Backup Way to Convert
import { I18nPropvider, LOCALES } from "../../i18nProvider";
import translate from "../../i18nProvider/translate";
import Patnewcss from "../../public/css/doctor/doctor.css";
import { Dropdown } from "semantic-ui-react";
import Dialog from 'react-bootstrap-dialog';
const moment = require("moment");



export default class DoctorHeader extends Component {
    constructor(props) {
      super(props);
      this.state = {
        fields: {},
        errors: {},
        files: [],
        activeNotificationsCount:0,
        notifyid:"",

        
      };
      this.doctorAvailableStatus=this.doctorAvailableStatus.bind(this);
      this.confirmAppointment=this.confirmAppointment.bind(this);
      this.getNotifications=this.getNotifications.bind(this);
      this.decline=this.decline.bind(this);
      this.autoDecline=this.autoDecline.bind(this);
      
    } 
    doctorAvailableStatus=(event)=>{
        if(event.target.value==1){   
            this.state.doctorAvailable=0;
            this.state.availableStatus=false;
            
        }
        if(event.target.value==0){   
            this.state.doctorAvailable=1;
            this.state.availableStatus=true;
                   }
        var post_data={
            is_available:this.state.doctorAvailable
        }   
        this.forceUpdate();   
       // alert(this.state.doctorAvailable);
        Httpconfig.httptokenput(Constant.siteurl + "api/Doctor/Doctoravailable/"+this.state.doctor_id, post_data)
      .then((response) => {

        if(response.data.status=="200" && response.data.error==false){
            
            // toast.warn("Hi Doctor, you status as changed to Unavailable", {
            //     position: "bottom-center",
            //   });
        // toast.success(response.data.message, {
        //     position: "top-center",
        //   });
        }else{
            // toast.warn("Sorry we cannot update the Availibility status at this moment", {
            //     position: "bottom-center",
            //   });
        } 
      })
      .catch((error) => {
        toast.error(error);
      });

    }
    decline=(event)=>{
        let appointmentId=event.currentTarget.id;
        this.state.notifyid=appointmentId;
        
        var element = document.getElementById(appointmentId);
        element.classList.remove("collapse-show");
        element.classList.add("collapse-hide");
        let notifycount=this.state.activeNotificationsCount;
        if(notifycount>0){
        this.state.activeNotificationsCount=notifycount-1;
        }
        Httpconfig.httptokenput(Constant.siteurl +"api/PatientAppointment/ConsultNowDoctorConfirmation/"+appointmentId, {status:1})
      .then((response) => {
        if(response.data.status=="200" && response.data.error=="false"){
            toast.warn("Declined Successfully", {
                position: "bottom-center",
              });
        }else{
            
        }
      })
      .catch((error) => {
        toast.error(error);
      });
      

    }
    autoDecline=(appointmentId)=>{
       // let appointmentId=event.currentTarget.id;
     //  alert(appointmentId);
       if(appointmentId!=null){
        Httpconfig.httptokenput(Constant.siteurl +"api/PatientAppointment/ConsultNowDoctorConfirmation/"+appointmentId, {status:1})
      .then((response) => {
        if(response.data.status=="200" && response.data.error=="false"){
            // toast.warn("Declined Successfully", {
            //     position: "bottom-center",
            //   });
        }else{
            
        }
      })
      .catch((error) => {
        toast.error(error);
      });
    }

    }
    confirmAppointment=(event) =>{
        let appointmentId=event.currentTarget.id;
        this.state.notifyid=appointmentId;
        var element = document.getElementById(appointmentId);
        element.classList.remove("collapse-show");
        element.classList.add("collapse-hide");
        let notifycount=this.state.activeNotificationsCount;
        if(notifycount>0){
        this.state.activeNotificationsCount=notifycount-1;
        }
        Httpconfig.httptokenput(Constant.siteurl +"api/PatientAppointment/ConsultNowDoctorConfirmation/"+appointmentId, {status:2})
      .then((response) => {
        if(response.data.status=="200" && response.data.error=="false"){
            toast.warn("Confirmed Successfully", {
                position: "bottom-center",
              });
        }
      })
      .catch((error) => {
        toast.error(error);
      });
      

    }
    getNotifications=(doctorId)=>{
        var activeNotificationsCount=0;
        Httpconfig.httptokenget(Constant.siteurl + "api/PatientAppointment/getConsultNowAppointments/"+doctorId,)
        .then((response) => {
          if(response.data.status=="200" && response.data.error==false){
              if(response.data.data[0].is_available==1){
            }
            if(response.data.data[0].status==0){
                  
                let notificationCount=response.data.data.length;
                
                if(notificationCount>0){
                    
                const requestNotification= response.data.data.map((notifcation)=>{ 
                   var time= notifcation.appointment_time;
                   var date= notifcation.appointment_date;
                   var dateTime=date+"T"+time;
                   var datediff=(moment().diff(date, 'days'));
                   var mindiff=(moment().diff(dateTime, 'minutes'));
                   //alert(mindiff);
                   // alert(notifcation.appointment_id);
// if(mindiff<0){
    activeNotificationsCount=activeNotificationsCount+1;
    //alert(activeNotificationsCount);
    toast.warn("New Appointment request came from "+notifcation.patient_name, {
      //  position: "bottom-center",
      });
                  return(  
                <div class={ this.state.notifyid==notifcation.appointment_id ? 'container collapse-hide' :  'container collapse-show' } id={notifcation.appointment_id} >
                <div class="row">
                  <div class="col-md-12 no_padding">
                    <div class="call_box">
                    <img src="../images/doctor-img/Homepage/consultnow.svg" />
                      <p class="consult_person"> {notifcation.patient_name.charAt(0).toUpperCase() + notifcation.patient_name.slice(1)} wants to consult now</p>
                      <div class="call_btns">
                       <a href="#" id={notifcation.appointment_id} onClick={this.decline}><p class="decline_btn">Decline</p></a> 
                       <a href="#" id={notifcation.appointment_id} onClick={this.confirmAppointment}> <p class="confirm_btn">Yes, Confirm</p></a> 
                      </div>
                    </div>
                  </div>
                  </div>
                </div>
                  )
                 
                // }else{
                //   //  this.autoDecline(notifcation.appointment_id);
                // }
                })
                this.setState({
                    notifcationRequest:requestNotification,
                    activeNotificationsCount:activeNotificationsCount,
                    notifyid:"",
                  })
        
            }
            }
          }else{
            //   toast.warn("Sorry we cannot update the Availibility status at this moment", {
            //       position: "bottom-center",
            //     });
          }
        })
        .catch((error) => {
          toast.error(error);
        });
  

    }
    componentDidMount=()=>{

        var retrievedObject=localStorage.getItem('DocuserObj');
        if(retrievedObject==null){
            window.location.href="./login";
        }
        let userData=JSON.parse(retrievedObject)
        
        this.setState({
            doctor_id: userData.doctor_id,
            date:moment().format('Do MMMM , YYYY')
        })
        
        //this.state.doctorAvailable=1; //1 is available , 0 Unavailable
        if(userData.doctor_id!=""){
          this.validateToken();
        }
        this.getNotifications(userData.doctor_id); 
       // this.validateToken();
        const interval = setInterval(() => {
            this.getNotifications(userData.doctor_id); 
           }, 10000);
        
        Httpconfig.httptokenget(Constant.siteurl + "api/Doctor/DoctorIsavailablecheck/"+userData.doctor_id,)
        .then((response) => {
          if(response.data.status=="200" && response.data.error==false){
              if(response.data.data[0].is_available==1){
              this.setState({
                doctorAvailable:response.data.data[0].is_available,
                availableStatus:true,
              })
            }
            if(response.data.data[0].is_available==0){
                this.setState({
                    doctorAvailable:response.data.data[0].is_available,
                    availableStatus:false,
                  })

            }
          }else{
            //   toast.warn("Sorry we cannot update the Availibility status at this moment", {
            //       position: "bottom-center",
            //     });
          }
        })
        .catch((error) => {
          toast.error(error);
        });
  
    }

    removeLoggedSession = () => {
      var retrievedObject=localStorage.getItem('DocuserObj');
        if(retrievedObject==null){
            window.location.href="./login";
        }
        let userData=JSON.parse(retrievedObject);

      let doctorId=userData.userID;
      Httpconfig.httptokenget(Constant.siteurl +"api/Users/logout/"+doctorId,)
      .then((response) => {
        if(response.data.status=="200" && response.data.error===false){
          localStorage.removeItem("DocuserObj");
          localStorage.removeItem("DoctorSelectedPatientId");
          localStorage.removeItem("DoctorSelectedConsultation");
          localStorage.removeItem('doctorToken');
          toast.success(response.data.message);
          setTimeout(
            () => window.location.reload(),
            1000
         );
        }
        
      })
      .catch((error) => {
        toast.error(error);
      });

      
   }

      
 validateToken=()=>{
   
  var retrievedObject=localStorage.getItem('DocuserObj');
  if(retrievedObject==null){
    localStorage.removeItem("doctorToken");
      window.location.href="./login";
  }
  
  let userData=JSON.parse(retrievedObject);
  let userId=userData.userID;
  if(localStorage.getItem("doctorToken")){
    let token=JSON.parse(localStorage.getItem("doctorToken"));
  
    Httpconfig.httptokenpost(Constant.siteurl +"api/Users/checkToken",{
      userid:userId,
      token:token,
      
    })
      .then((response) => {
        if(response.data.status=="200" && response.data.error===true){
            localStorage.removeItem("DocuserObj");
            localStorage.removeItem("DoctorSelectedPatientId");
            localStorage.removeItem("DoctorSelectedConsultation");
            localStorage.removeItem("doctorToken");
          setTimeout(
            () => window.location.reload(),
            1000
         );
        }
      })
      .catch((error) => {
        toast.error(error);
      });

  }else{
    toast.error("Your Session has timed out.Please Relogin");
    localStorage.removeItem("DocuserObj");
    localStorage.removeItem("DoctorSelectedPatientId");
    localStorage.removeItem("DoctorSelectedConsultation");
    localStorage.removeItem("doctorToken");
   // this.removeLoggedSession();
  //   setTimeout(
  //     () => window.location.reload(),
  //     1000
  //  );
  }  
 }
   
  
    render() {
        return (
            <main id="main">
            <header id="header" class="fixed-top">
    <div class="container-fluid">
    <div class="logo float-left">
        <a href="#"><img src="../images/doctor-img/logo.png" alt="" /></a>
     </div>
         <div class="float-left">
            
            <a href="#" class="doc_head_calendar"> <span><img src="../images/doctor-img/Homepage/Date.svg" /></span> {this.state.date}</a>
        </div>
        <nav class="main-nav float-right d-none d-lg-block">
            
            <ul class="doc_second_menu">
              <li class="first_li"><span>Your profile is now available to your patient </span> <label class="switch">
                <input class="doc_blue_check" type="checkbox" value={this.state.doctorAvailable} onChange={this.doctorAvailableStatus} checked={this.state.availableStatus} />
                <span class="slider round"></span>
              </label></li>
              <li class="second_li">
              <a href="#" class="log_out" onClick={this.removeLoggedSession}>
                  <img src="../images/doctor-img/logout_icon.svg" />
                 Logout
                  </a>
                <a href="#" class="notification">
                    <span><img class="notify-img" src="../images/doctor-img/Homepage/notification.svg" /></span>
                    <span class="badge">{this.state.activeNotificationsCount}</span>
                  </a>
              </li>
            </ul>
            
            </nav> 
        
    </div>
    <section id="doc_call_info">
  {this.state.notifcationRequest}
</section>
</header>

<ToastContainer />
<Dialog ref={(el) => { this.dialog = el }} />
       
  </main>

        );
    }
}