import React, { Component, useState } from 'react';
import $ from "jquery";
import { ToastContainer } from "react-toastify";
import toast from "../helpers/toast";
import { Link } from "react-router-dom";
import Httpconfig from "../helpers/Httpconfig";
import { Carousel } from "react-responsive-carousel";
// import styles from "react-responsive-carousel/lib/styles/carousel.min.css";
import Patnewcss from "../../public/css/patient/style-new.css";
import Constant from "../../constants";
import { FormattedMessage } from "react-intl"; // Backup Way to Convert
import { I18nPropvider, LOCALES } from '../../i18nProvider';
import translate from "../../i18nProvider/translate";
import PatientHeader from "../patient/Patientheader";
import PatientMenu from "../patient/Patientmenu";
import PatientFooter from "../patient/Patientfooter";
import { reactLocalStorage } from "reactjs-localstorage";
import Patcss from "../../public/css/patient/order-medicine.css";
import PatientSideMenu from "../patient/Patientsidemenu";
import FileBase64 from "react-file-base64";
import { target } from 'glamor';
const moment = require("moment");



const upComingDetailsView=[];
const pastAppointmentsDetailsView=[];
export default class patientdashboard extends Component {
    
    constructor(props) {
        super(props);
        this.state = {
            showlogin: true,
            showsignup: false,
            Language: "",
            name:"",
            user_mobile:"",
            email_id:"",
            token:"",
            userId:"",
            profile_image:'',
            upComing:[],
            patientProfileImage:"",
            rating:"",
            
        };

        
        this.addPatient = this.addPatient.bind(this);
        this.navigate = this.navigate.bind(this);
        this.getAppointmentDetails=this.getAppointmentDetails.bind(this);
        this.openMap=this.openMap.bind(this);
        
        
    }
    componentDidUpdate = () => {
        var lang = localStorage.getItem('Language_selected');
        if (lang != null) {
            if (this.state.Language != lang) {
                this.state.Language = lang;
               // console.log("notnull " + this.state.Language);
                this.forceUpdate();
            }
            //
        } else {
            this.state.Language = "en-us";
           // console.log(this.state.Language);
        }
        
    }
    openMap = (event) => {
        // alert(event.currentTarget.id);
        //alert(this.state.lat_long);
       window.open("https://maps.google.com?q=17.3529,78.5357",'_blank' );
     };
    
    // To get detais after first render
    componentDidMount = () => {
        var lang = localStorage.getItem('Language_selected');
        if (lang != null) {
            if (this.state.Language != lang) {
                this.state.Language = lang;
                this.forceUpdate();
            }
        } else {
            this.state.Language = "en-us";
            
        }
        var retrievedObject=localStorage.getItem('userObj');
        let userObj=JSON.parse(retrievedObject);
        if(userObj==null){
        window.location.href="./patientLogin" ;
       }
        if(typeof(userObj)!=undefined){
           
        this.setState({
            name: userObj.name,
            user_mobile:userObj.mobile_number,
            email_id:userObj.email,
            token:userObj.accessToken,
            patientId:userObj.patient_id,
            profile_image:"",
          });
          this.forceUpdate();
        }
        
        //alert(this.state.patientId);
        this.getAppointmentDetails(userObj.patient_id);
        this.getProfileDetails(userObj.patient_id);
        const interval = setInterval(() => {
            this.getAppointmentDetails(userObj.patient_id);
           }, 10000);
        
    }
    getProfileDetails=(patientId)=>{
        if(patientId!=""){
       let url_path="api/Patients/"+patientId;
       let patientDob="";
       Httpconfig.httptokenget(Constant.siteurl + url_path, {
       })
          .then((response) => {
           let patientDob="";
           if(response.data.status==200 && response.data.error==false){
              let PatientGender=response.data.data[0].gender;
              let patientProfileImage="";
              if(response.data.data[0].profile_pic!=null){
               patientProfileImage=Constant.imgurl+response.data.data[0].profile_pic;
              }
             // alert(patientProfileImage);
               this.setState({
                   patientProfileImage:patientProfileImage,
                   PatientGender:PatientGender,
               })

             
           }
          })
       }

    }
    getAppointmentDetails=(patientId)=>{
      
        Httpconfig.httptokenget(Constant.siteurl + "api/PatientAppointment/displayupcomingappointments/"+patientId,)
  .then((response) => {
//console.log(response);

    if(response.data.status=="200" && response.data.error==false){
          let DocName="";
        
const upComingDetailsView= response.data.data.map((upComingDetails,num)=>{ 
if(upComingDetails.status==1 ||upComingDetails.status==2){
    if(upComingDetails.doctor_tbl.tbl_user.name!=null){
        DocName=upComingDetails.doctor_tbl.tbl_user.name.charAt(0).toUpperCase() + upComingDetails.doctor_tbl.tbl_user.name.slice(1);
    }
    
  // let DocName="";
    
let patientAge="";
if(upComingDetails.patient_tbl.dob!=null){
let dob=upComingDetails.patient_tbl.dob.split("T");
let age=dob[0];
let ageYears=moment().diff(age, 'years');
let ageMonths=moment().diff(age, 'months');
let ageDays=moment().diff(age, 'days');
if(ageYears>0){
    patientAge=ageYears+" Years";
}else if(ageMonths>0){
    patientAge=ageMonths +" Months";
}else if(ageDays>0){
    patientAge=ageDays+" Days";
}
}
var now = moment(new Date()); //todays date
var end = moment(upComingDetails.appointment_datetime); // another date
var duration = moment.duration(now.diff(end));
var days = duration.asDays();
var mindiff=(moment().diff(end, 'minutes'));
//alert(upComingDetails.appointment_datetime);
//alert(mindiff);
//if(mindiff<0){
let doctorImage="";
let doctorAvailable="";
let patientImage="";
let docpic="";


docpic=upComingDetails.doctor_tbl.profile_pic;

if(docpic!="") {
      doctorImage=Constant.imgurl+docpic;
}else{
    if(upComingDetails.doctor_tbl.gender=="Male"){
        doctorImage="../images/patient/img/Profile/Male_doctor.svg"; 
    }else{
        doctorImage="../images/patient/img/Profile/Female_doctor.svg";
    }  
}


if(upComingDetails.doctor_tbl.is_available!=null){
    doctorAvailable=upComingDetails.doctor_tbl.is_available;
}

if(upComingDetails.patient_tbl.profile_pic!=null) {
    patientImage=Constant.imgurl+upComingDetails.patient_tbl.profile_pic;
}else{
    if(upComingDetails.patient_tbl.gender.toLowerCase()=="male"){
        patientImage="../images/patient/img/Profile/Male_patient.svg";
    }else{
        patientImage="../images/patient/img/Profile/Female_patient.svg";
    }
}

  
        return ( 
<React.Fragment>
            <div class="schedule_box">
                <div class="appoint_bar">
                    <p>
{translate('Your appointment scheduled on')} <span><img src="../images/patient/img/Profile/Date.svg" />{moment(upComingDetails.appointment_datetime).format('dddd') } {  moment(upComingDetails.appointment_datetime).format('Do MMMM,YYYY')   }</span> <span><img src="../images/patient/img/Profile/Time.svg" />{moment(upComingDetails.appointment_datetime).format('LT')} </span>                       
                    </p>
                </div>
                <div class="appoint_main">
                   
                        <div class="doctor_content">
                <div class="doct_img">
                <img src={doctorImage} />
                </div>
                <div class="doct_det">
                  <h3>Dr. {DocName}</h3>
                  <p>{upComingDetails.doctor_tbl.speciality_name}</p>
                </div>
                        </div>
                        <div class="app_wth">
                            <img src="../images/patient/img/Ordermedicine/video.svg" />
                            <p>{translate('You have')} <br />{translate('appointment with')}</p>
                        </div>
                        <div class="pat_content">
                          <div class="pat_img">
                            <img src={patientImage} />
                            </div>
                            <div class="pat_det">
                              <h3>Mr. {upComingDetails.patient_tbl.name.charAt(0).toUpperCase() + upComingDetails.patient_tbl.name.slice(1)} <span>({upComingDetails.patient_tbl.master_relationship.relation_name})</span></h3>
                              <p>{patientAge}, {translate(upComingDetails.patient_tbl.gender)}</p>
                            </div>
                        </div>
                       
                      </div>
                      <div class="cancel_app">
                        {/* <p>{translate('Paid')} : <span>₦ {upComingDetails.consultation_fee}</span></p>
                        <p>{translate('Paid through')} <span>{translate('Online Payment')}</span></p> */}
                        <p>{translate('Medium')} : <span>{translate('Audio & Video')}</span></p>
                        <p class="cancel_btn" data-toggle="modal" data-target="#cancel_app" id={upComingDetails.appointment_confirm_id} onClick={this.handleClick} >{translate('Cancel Appointment')}</p>
                    </div>
                    
                    {upComingDetails.status==2 ?
    <div class="join_section" id={upComingDetails.appointment_confirm_id}  onClick={this.navigate}>
    <a href="#">
    {upComingDetails.status==2 ? 
    (<p id={upComingDetails.appointment_confirm_id}>{translate('Join Now')}</p>):
    (<p id={upComingDetails.appointment_confirm_id}>{translate('Please wait for Doctor to join')}</p>)
    }
    </a>
    
    </div> :
    <div class="join_section" id={upComingDetails.appointment_confirm_id}  >
    <a >
    <p id={upComingDetails.appointment_confirm_id}>{translate('Appointment Booked')}</p>
    </a>
    
    </div>
    }
                </div>
            
   
    </React.Fragment>
        )
}
        }),
    
        

/*Past Appointments */
 pastAppointmentsDetailsView= response.data.data.map((pastDetails)=>{ 
    let patientAge="";
    
     if(pastDetails.patient_tbl.dob!=null)  {
    let dob=pastDetails.patient_tbl.dob.split("T");
    let age=dob[0];
    let ageYears=moment().diff(age, 'years');
    let ageMonths=moment().diff(age, 'months');
    let ageDays=moment().diff(age, 'days');
    
    
    if(ageYears>0){
        patientAge=ageYears+" Years";
    } else if(ageMonths>0){
        patientAge=ageMonths +" Months";
    } else if(ageDays){
        patientAge=ageDays+" Days";
    }
}
    var now = moment(new Date()); //todays date
    var end = moment(pastDetails.appointment_datetime); // another date
    var duration = moment.duration(now.diff(end));
    var days = duration.asDays();

    var mindiff=(moment().diff(end, 'minutes'));
   // alert(mindiff);
//alert(days);
    if(pastDetails.status==3 || pastDetails.status==4   ) {
    //if(pastDetails.status==3 || pastDetails.status==4  || days>0  ) {
        DocName=pastDetails.doctor_tbl.tbl_user.name.charAt(0).toUpperCase() + pastDetails.doctor_tbl.tbl_user.name.slice(1);
        let doctorImage="";
        let doctorAvailable="";
        let patientImage="";
        let gender="";
        let docId=pastDetails.doctor_tbl.id;

        if(pastDetails.doctor_tbl){
            
        if(pastDetails.doctor_tbl.profile_pic!="") {
           let img=pastDetails.doctor_tbl.profile_pic;
              doctorImage=Constant.imgurl+img;
            }else{
              if(pastDetails.doctor_tbl.gender=='Male'){
                doctorImage="../images/patient/img/Profile/Male_doctor.svg";       
              }else{
                doctorImage="../images/patient/img/Profile/Female_doctor.svg";   
              }  
            }
         
        }else{
           if(pastDetails.doctor_tbl.gender=='Male'){
            doctorImage="../images/patient/img/Profile/Male_doctor.svg";       
          }else{
            doctorImage="../images/patient/img/Profile/Female_doctor.svg";   
          }  
        }
        
        if(pastDetails.doctor_tbl.is_available!=null){
            doctorAvailable=pastDetails.doctor_tbl.is_available;
        }
        
        if(pastDetails.patient_tbl.profile_pic!=null) {
            patientImage=Constant.imgurl+pastDetails.patient_tbl.profile_pic;
        }else{
            if(pastDetails.patient_tbl.gender.toLowerCase()=='male'){
            patientImage="../images/patient/img/Profile/Male_patient.svg";
            }else{
                patientImage="../images/patient/img/Profile/Female_patient.svg";
            }
        }
        
            return ( 
                <React.Fragment>
<div class="schedule_box">
                <div class="appoint_bar">
                    {/* <p>
{translate('Your appointment scheduled on')} <span><img src="../images/patient/img/Profile/Date.svg" />{moment(pastDetails.appointment_datetime).format('dddd') } {  moment(pastDetails.appointment_datetime).format('Do MMMM,YYYY')   }</span> <span><img src="../images/patient/img/Profile/Time.svg" />{moment(pastDetails.appointment_datetime).format('LT')} </span>                       
                    </p> */}
                    <p>
<span><img src="../images/patient/img/Profile/Date.svg" />{moment(pastDetails.appointment_datetime).format('dddd') } {  moment(pastDetails.appointment_datetime).format('Do MMMM,YYYY')   }</span> <span><img src="../images/patient/img/Profile/Time.svg" />{moment(pastDetails.appointment_datetime).format('LT')} </span>   
                    {pastDetails.status!=4 ?
                    <span class="result_text">{translate('Completed')}</span>    
                    :  
                    <span class="result_text">{translate('Cancelled')}</span>    
                    }              
                    </p>
                </div>
                <div class="appoint_main">
                   
                        <div class="doctor_content">
                <div class="doct_img">
                <img src={doctorImage} />
                </div>
                <div class="doct_det">
                  <h3>Dr. {DocName}</h3>
                  <p>{pastDetails.doctor_tbl.speciality_name}</p>
                </div>
                        </div>
                        <div class="app_wth">
                        <img src="../images/patient/img/Ordermedicine/video.svg" />
                            <p>{translate('You have')} <br />{translate('appointment with')}</p>
                        </div>
                        <div class="pat_content">
                          <div class="pat_img">
                            <img src={patientImage} />
                            </div>
                            <div class="pat_det">
                              <h3>Mr. {pastDetails.patient_tbl.name.charAt(0).toUpperCase() + pastDetails.patient_tbl.name.slice(1)} <span>({pastDetails.patient_tbl.master_relationship.relation_name})</span></h3>
                              <p>{patientAge}, {translate(pastDetails.patient_tbl.gender)}</p>
                            </div>
                        </div>
                       
                      </div>
                      {pastDetails.next_appointment_datetime!=null ?
                      <div class="book_sec" onClick={this.navigatepursose}>
                    <p>{translate('The doctor advised you for a followup appointment on ')} 
                    {/* {moment(pastDetails.next_appointment_datetime).format('dddd') } */}
                     {  moment(pastDetails.next_appointment_datetime).format('Do MMMM,YYYY')   }</p>
                    
                    <p class="book_btn">{translate('Book')}</p>
                </div>
                : ""}
                <div class="pro_sec_details">
                  <div class="row">
                  {pastDetails.status!=4 ?
                    <div class="col-md-6">
                 {/* <a href={Constant.imgurl+pastDetails.prescription_id} target="_blank">  <h4 data-toggle="modal" data-target="#presc_preview_Modal"><img src="../images/patient/img/Ordermedicine/upload_prescription.svg" />Prescription</h4></a> */}
                 <a href="#" onClick={this.showPrescription.bind(this,Constant.imgurl+pastDetails.prescription_id)}>  <h4 data-toggle="modal" data-target="#presc_preview_Modal" ><img src="../images/patient/img/Ordermedicine/upload_prescription.svg" />{translate('Prescription')}</h4></a>
                    </div>
                    :
                    <div class="col-md-6"></div>
                  }
                    {/* <div class="col-md-3">
                      <h4><img src="../images/patient/img/Ordermedicine/PastMedicalHistory.svg" />{translate('Past Medical History')}</h4>
                    </div> */}
                    {Object.keys(pastDetails.appointment_feedback_tbls).length>0 ?  <div class="col-md-6"> <h4><img src="../images/patient/img/Ordermedicine/feedback_icon.svg" /> Thank you for the feedback</h4> </div> :
                    <div class="col-md-6">
                      <h4   data-toggle="modal" data-target="#feedback_modal"  onClick={this.handleFeedback.bind(this,docId,pastDetails.id)} ><img src="../images/patient/img/Ordermedicine/feedback_icon.svg" />{translate('Feedback')}</h4> 
                    </div>
                    } 
                    {/* <div class="col-md-3">
                     <h4 data-toggle="collapse" href="#multiCollapseExample3" role="button" aria-expanded="false" aria-controls="multiCollapseExample1"><img src="../images/patient/img/Ordermedicine/My Appointment.svg" />Reschedule</h4>
                      
                    </div> */}

                  </div>
                
                    <div class="collapse multi-collapse" id="multiCollapseExample3">
                      <div class="">
                        <div class="order_pro_panel">
                          <div class="row">
                            <div class="col-md-6">
                              <div class="ord_calendar">
                                <h2><img src="img/My Appointment.svg" /> Schedule your Appointment</h2>
                                <div class="wrapper">
                                  <div id="calendari"></div>
                
                                </div>
                              </div>
                              </div>
                          
                              <div class="col-md-6">
 
                                <div class="sch_time">
                                  <h3>Afternoon</h3>
                                  <p class="active">2:30 pm</p>
                                  <p>3:30 pm</p>
                                  <p>4:00 pm</p>
                                  <p>4:30 pm</p>
                                </div>
                                <div class="sch_time">
                                  <h3>Evening</h3>
                                  <p>4:30 pm</p>
                                  <p>5:30 pm</p>
                                  <p class="active">6:00 pm</p>
                                  <p>6:30 pm</p>
                                </div>
                                <div class="sch_time">
                                  <h3>Night</h3>
                                  <p>7:30 pm</p>
                                  <p>8:30 pm</p>
                                  <p>9:00 pm</p>
                                  <p>10:30 pm</p>
                                </div>
                              </div>
                        </div>
                              </div>
                              </div>
                              </div>
                  </div>
                    {/* {pastDetails.status==3  ? <div class="join_section">
            <a href={Constant.imgurl+pastDetails.prescription_id} target="_blank">
            <p>{translate('View Prescription')}</p>
            </a>
        </div> :  <div class="join_section">
            <a href="#">
            <p>{translate('Cancelled')}</p>
            </a>
        </div> } */}
                </div>
        </React.Fragment>
            )
        }
            })

            if(upComingDetailsView==null){ 
                upComingDetailsView='<div>No Upcoming appointment</div>';
            }
    
    this.setState({
        upComingDetailsView:upComingDetailsView,
        pastAppointmentsDetailsView:pastAppointmentsDetailsView
    })
 
    }else{
        return false;
    } 
  })
  .catch((error) => {
    toast.error(error);
  });
  
    }
    addPatient=()=>{
        const userObj=({
        name: this.state.name,
        user_mobile:this.state.mobile_number,
        email_id:this.state.email,
        token:this.state.accessToken,
        patient_id:this.state.patient_id,
        profile_image:"",
      });
      this.props.history.push("/Patientprofile",{"userData":userObj});
        
    }
    navigate=(event)=>{
        
        let id=event.currentTarget.id;
        localStorage.setItem("PatientselectedAppointment",id);
        //reactLocalStorage.setObject("PatientselectedAppointment", event.target.id);
        this.props.history.push("/Patientchecksettings");
        
    }
     
    handleLanguage=(langValue)=>{
       
        this.setState({Language: langValue});
    }
   
    getFiles(files) {
        this.setState({ files: files });
        // console.log(this.state.files[0].base64);
        // console.log(this.state.files);
        //alert(this.state.files[0].base64);
        let  patientId=this.state.patientId;
        let patientProfileImage=this.state.files[0].base64; 
        this.state.patientProfileImage=patientProfileImage;
        this.forceUpdate();
        Httpconfig.httptokenput(Constant.siteurl + "api/Users/uploadimages/"+patientId, {
            "profile_pic": this.state.files[0].base64, 
         
        })
           .then((response) => {
               toast.success('👌 Profile Image Updated Successfully', {
                position: "bottom-center"
            });
           
           })
           .catch((error) => {
            this.props.history.push("/patienthealthprofile");
           //   console.log(error);
             toast.error(error);
           });
      }
    selectedReason=(event)=>{
        var reason=$("input[name='cancelappointment']:checked").val();
        if(reason=="other"){
            $('#otherCancellationReasons').removeClass('collapse-hide');
            $('#otherCancellationReasons').addClass('collapse-show');
        }else{
            $('#otherCancellationReasons').removeClass('collapse-show');
            $('#otherCancellationReasons').addClass('collapse-hide');   
        }
         

    } 
    cancelAppointment=(event)=>{
        var reason="";
        $('#otherCancellationReasons').removeClass('collapse-hide');
        //alert($("input[name='cancelappointment']:checked").val());
        if (!$("input[name='cancelappointment']:checked").val()) {
            $('#otherCancellationReasons').removeClass('collapse-show');
            $('#otherCancellationReasons').addClass('collapse-hide');  
            toast.error("select reason for cancellation");
             return false;
         }
         else {
           // alert($("input[name='cancelappointment']:checked").val());//return false; 
           reason=$("input[name='cancelappointment']:checked").val();
           
           if(reason=="other")
           if($('#otherCancellationReasons').val()!=""){
                reason=$('#otherCancellationReasons').val();
           }else{
            $('#otherCancellationReasons').removeClass('collapse-show');
            $('#otherCancellationReasons').addClass('collapse-hide');   
                toast.error("select reason for cancellation");
                return false; 
           }
         }
         if (reason!=""){
        $('#cancel_app').hide();
        let appointmentId=this.state.selectedAppointmentId;
        let patientId=this.state.patientId;
        Httpconfig.httptokenput(Constant.siteurl + "api/PatientAppointment/updateConsultationStatus/"+appointmentId, {
            "status":"4",
            "reason":reason
        })
        .then((response) => {
            this.getAppointmentDetails(patientId);
               toast.success('Appointment cancelled successfully', {
               // position: "bottom-center"
            });
           
        })
        .catch((error) => {
            this.props.history.push("/patienthealthprofile");
              //console.log(error);
             toast.error(error);
        });
    }else{
      //  toast.error("select reason for cancellation");
    }
    }
    handleClick=(event)=>{
        let appointmentId=event.currentTarget.id;
        this.state.selectedAppointmentId=appointmentId;
        $("input:radio[name='cancelappointment']").each(function(i) {
            this.checked = false;
        });
        this.forceUpdate();
    }
    closePopup=()=>{
        $('#cancel_app').hide();
    }
    showPrescription=(url)=>{
    //this.state.prescriptionUrl=url;
    $('#prescriptionImg').attr('src',url);
    this.forceUpdate();
    }
    feedBack=(event)=>{
        
        let id=event.currentTarget.id;
        if(id>0){
           

            for(let i=0;i<=id;i++){
                $('#'+i).addClass('active');
            }
            this.state.rating=id;
            this.forceUpdate();
        }else{
            this.state.rating=id;
            this.forceUpdate();
        }

    }
    saveFeedBack=()=>{
       var comment="";
       comment=this.state.feedbackComment;
       var rating="";
       rating=this.state.rating;
       let feedbackDoctorId=this.state.feedbackDoctorId;
       let patientId=this.state.patientId;
       let appointmentId=this.state.selectedFeedBackAppointmentId;
       if(rating==""){ 
           toast.error("Please give rating to submit");
           return false;
       }
       Httpconfig.httptokenpost(Constant.siteurl + "api/PatientAppointment/createAppointmentFeedback", {
        "doctor_id": feedbackDoctorId,
        "patient_id": patientId,
        "title": "",
        "feedback":comment,
        "rating":rating,
        "row_id":appointmentId,
    })
    .then((response) => {
           toast.success(response.data.message, {
           position: "bottom-center"
           });
           $('#feedback_modal').hide();
           this.state.feedbackComment="";
           this.state.rating="";
           $('#feedbackComment').val('');
           this.forceUpdate();
       
    })
    .catch((error) => {
        this.props.history.push("/patienthealthprofile");
          //console.log(error);
         toast.error(error);
    }); 

    }
    handleComment=(event)=>{
        this.state.feedbackComment=event.target.value;
        this.forceUpdate();
    }
    handleFeedback=(docId,appointmentid)=>{
        for(let i=0;i<=5;i++){
            $('#'+i).removeClass('active');
        }
        $('#feedbackComment').val('');
        this.state.selectedFeedBackAppointmentId=appointmentid;
        this.state.feedbackDoctorId=docId;
        this.forceUpdate();
    }

    navigatepursose=()=>{
        this.props.history.push("/Patientconsultationpurpose");
    }

    
    render() {
        const { languages_data } = this.state;
        const BLOCK = { diplay: 'block' }
        const NONE = { diplay: 'none' }
        return (
            
            <main id="main_ord_nav">
            {/* ja-jp */}
            {/* en-us */}
            {/* de-de */}
            {/* fr-ca */}
            <PatientHeader onSelectLanguage={this.handleLanguage}/>
            <I18nPropvider locale={this.state.Language} >
            
            {/* <PatientMenu /> */}
            {/* <PatientMenu /> */}
            <section id="order_profile">
            <div class="pro_section">
            <div class="container">
            <div class="row">  
            
            <div class="col-lg-4 col-md-12 col-sm-12 col-xs-12">
            <PatientSideMenu />
            {/* <div class="profile_menu_sec" id="pro_menu">
            <div class="profile_box">
            
            {this.state.patientProfileImage!="" ?
            (<img src={this.state.patientProfileImage} />) :
            this.state.PatientGender=="Male" ?
            <img src="../images/patient/img/Profile/Male_patient.svg" /> :
            <img src="../images/patient/img/Profile/Female_patient.svg" />
            }
            <a href="#"> <h2 class="edit_avtar">
            <div class="input-group">
            <span class="input-group-btn">
                <span class="btn btn-default btn-file">
                <img src="../images/patient/img/Profile/edit.svg" onClick={this.uploadProfilePic}/>
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
            <p class="hello_word">{translate('Hello!')}</p>
            <p class="doc_name">{this.state.name.charAt(0).toUpperCase() + this.state.name.slice(1)}</p>
            </div>
            </div>
            <ul class="profile-menu-ul-1">
            <li class="profile_li"><a href="/Patientdashboard"><img src="../images/patient/img/Ordermedicine/myAppointment.svg" />{translate('My Appointment')} <span class="right_arrow"><img  src="../images/patient/img/Ordermedicine/rightIcon.svg" /></span></a></li>
            <li class="">
                          <a href="/patient/myOrders">
                            <img src="../images/patient/img/Ordermedicine/MyOrder.svg"/>
                            {translate("My Orders")}
                            <span class="right_arrow"><img  src="../images/patient/img/Ordermedicine/rightIcon.svg" /></span>
                          </a>
                        </li>
                        <li class=""><a href="#"><img src="../images/patient/img/Ordermedicine/MyProfile.svg" />My Saved Medicine  <span class="right_arrow"><img  src="../images/patient/img/Ordermedicine/rightIcon.svg" /></span></a></li>
            <li class="" onClick={this.addPatient}><a href="#"><img src="../images/patient/img/Ordermedicine/MyProfile.svg" />{translate('My Profile')}  <span class="right_arrow"><img  src="../images/patient/img/Ordermedicine/rightIcon.svg" /></span></a></li>
          
          
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
            
            <div class="col-lg-8 col-md-12 col-sm-12 col-xs-12">
            {/* <nav>
            <div class="nav nav-tabs nav-fill" id="nav-tab" role="tablist">
            <a class="nav-item nav-link active" data-toggle="tab" href="#tele_med" role="tab"  aria-selected="true">{translate('Tele medicine')}</a>
            <a class="nav-item nav-link" data-toggle="tab" href="#in_person_tab" role="tab" aria-selected="false">{translate('In Person Visit')}</a>
            </div>
            </nav> */}
            <div class="tab-content" id="nav-tabContent">
            <div class="tab-pane show active" id="tele_med" role="tabpanel" aria-labelledby="nav-home-tab">
            <div id="appoint_box" class="appoint_box">
            
            <div class="row">
            <div class="col-md-12">
            <div class="schedule_heading">
            <h2>My Appointments</h2>
            <h4>{translate('Upcoming')}</h4>
            </div>
            {this.state.upComingDetailsView ? this.state.upComingDetailsView :"No Appointments"}
           

            </div>
            </div>
            <div class="row">
            <div class="col-md-12">
            <div class="schedule_heading">
            <h4>{translate('Past')}</h4>
            </div>
            {this.state.pastAppointmentsDetailsView ? this.state.pastAppointmentsDetailsView :"No Appointments"}
            {/* <div class="schedule_box">
            <div class="appoint_bar">
            <p>{translate('Your appointment scheduled on')} <span><img src="../images/patient/img/Profile/Date.svg" />Mon 16 June, 2019</span> <span><img src="../images/patient/img/Profile/Time.svg"/>03:30 PM</span></p>
            </div>
            <div class="appoint_main">
            <div class="row">
            <div class="col-md-3  col-sm-4 col-xs-12">
            <div class="appoint_avtar">
            <img src="../images/patient/img/Profile/doctor.png" alt="" />
            <p class="online">
            <img src="../images/patient/img/Profile/available.svg" />
            </p>
            <h5 class="doc_available">{translate('Doctor is Available now')}</h5>
            </div>
            </div>
            <div class="col-md-5 col-sm-4 col-xs-12">
            <div class="appoint_content">
            <h2>{translate('Dr. Carla Houston')}</h2>
            <p>{translate('Cardiologist, MD')}</p>
            <p>{translate('14 years experience')}</p>
            </div>
            </div>
            <div class="col-md-4 col-sm-4 col-xs-12 text-right">
            <div class="appoint_hosp">
            <img src="../images/patient/img/Profile/hospital.png" />
            <h5>{translate('Plot No:266,3rd Floor,Prakash Nilayam,Guttala Begumpet')}</h5>
            <p class="directions"><img src="../images/patient/img/Homepage/Direction.svg" />{translate('Directions')}</p>
            </div>
            </div>
            </div>
            <div class="row">
            <div class="col-md-12">
            <p class="subtitle appoint_txt"><span>{translate('appointment with')}</span></p>
            </div>
            </div>
            <div class="row">
            <div class="col-md-3 col-sm-4 col-xs-12">
            <div class="appoint_avtar">
            <img src="../images/patient/img/Profile/patient.png" alt="" />
            </div>
            </div>
            <div class="col-md-9 col-sm-8 col-xs-12">
            <div class="appoint_content">
            <h2>{translate('Samir Saxena')} <span>{translate('(Wife)')}</span></h2>
            <p>{translate('55 Female')}</p>
            
            </div>
            </div>
            </div>
            </div>
            <div class="join_section">
            <a href="#">
            <p>{translate('View Prescription')}</p>
            </a>
            </div>
            </div> */}
            </div>
            </div>
            </div>
            </div>
            <div class="tab-pane fade" id="in_person_tab" role="tabpanel" aria-labelledby="nav-profile-tab">
            <div id="appoint_box">
            
            <div class="row">
            <div class="col-md-12">
            <div class="schedule_heading">
            <h4>{translate('Upcoming')}</h4>
            </div>
            <div class="schedule_box">
            <div class="appoint_bar">
            <div class="row appoint_wait">
            <div class="col-md-1 app_1">
            <img src="../images/patient/img/Profile/Date.svg" />
            </div>
            <div class="col-md-11 app_11">
            <p>Mon, 16 June, 2020</p>
            <h4>{translate('Please wait for the call from clinic front desk')}</h4>
            <p>{translate('You will receive call from a clinics front desk and confirm your time slot')}</p>
            </div>
            </div>
            
            </div>
            <div class="appoint_main">
            <div class="row">
            <div class="col-md-3  col-sm-4 col-xs-12">
            <div class="appoint_avtar">
            <img src="../images/patient/img/Profile/doctor.png" alt="" />
            <p class="online">
            <img src="../images/patient/img/Profile/available.svg" />
            </p>
            <h5 class="doc_available">{translate('Doctor is Available now')}</h5>
            </div>
            </div>
            <div class="col-md-4 col-sm-4 col-xs-12">
            <div class="appoint_content">
            <h2>{translate('Dr. Srikar')}</h2>
            <p>{translate('Cardiologist, MD')}</p>
            <p>{translate('14 years experience')}</p>
            </div>
            </div>
            <div class="col-md-5 col-sm-4 col-xs-12 text-right">
            <div class="appoint_hosp">
            <img src="../images/patient/img/Profile/hospital.png" />
            <h5>{translate('Plot No:266,3rd Floor,Prakash Nilayam,Guttala Begumpet')}</h5>
            <p class="directions"><img src="../images/patient/img/Homepage/Direction.svg" />{translate('Directions')}</p>
            </div>
            </div>
            </div>
            <div class="row">
            <div class="col-md-12">
            <p class="subtitle appoint_txt"><span>{translate('appointment with')}</span></p>
            </div>
            </div>
            <div class="row">
            <div class="col-md-3 col-sm-4 col-xs-12">
            <div class="appoint_avtar">
            <img src="../images/patient/img/Profile/patient.png" alt="" />
            </div>
            </div>
            <div class="col-md-9 col-sm-8 col-xs-12">
            <div class="appoint_content">
            <h2>{translate('Samir Saxena')} <span>{translate('(Wife)')}</span></h2>
            <p>{translate('55 Female')}</p>
            
            </div>
            </div>
            </div>
            </div>
            
            </div>
            </div>
            </div>
            <div class="row">
            <div class="col-md-12">
            <div class="schedule_heading">
            <h4>{translate('Past')}</h4>
            </div>
            <div class="schedule_box">
            <div class="appoint_bar">
            <p>{translate('Your appointment scheduled on')} <span><img src="../images/patient/img/Profile/Date.svg" />Mon 16 June, 2019</span> <span><img src="../images/patient/img/Profile/Time.svg" />03:30 PM</span></p>
            </div>
            <div class="appoint_main">
            <div class="row">
            <div class="col-md-3  col-sm-4 col-xs-12">
            <div class="appoint_avtar">
            <img src="../images/patient/img/Profile/doctor.png" alt="" />
            <p class="online">
            <img src="../images/patient/img/Profile/available.svg" />
            </p>
            <h5 class="doc_available">{translate('Doctor is Available now')}</h5>
            </div>
            </div>
            <div class="col-md-4 col-sm-4 col-xs-12">
            <div class="appoint_content">
            <h2>{translate('Dr. Carla Houston')}</h2>
            <p>{translate('Cardiologist, MD')}</p>
            <p>{translate('14 years experience')}</p>
            </div>
            </div>
            <div class="col-md-5 col-sm-4 col-xs-12 text-right">
            <div class="appoint_hosp">
            <img src="../images/patient/img/Profile/hospital.png" />
            <h5>{translate('Plot No:266,3rd Floor,Prakash Nilayam,Guttala Begumpet')}</h5>
            <p class="directions"><img src="../images/patient/img/Homepage/Direction.svg" />{translate('Directions')}</p>
            </div>
            </div>
            </div>
            <div class="row">
            <div class="col-md-12">
            <p class="subtitle appoint_txt"><span>{translate('appointment with')}</span></p>
            </div>
            </div>
            <div class="row">
            <div class="col-md-3 col-sm-4 col-xs-12">
            <div class="appoint_avtar">
            <img src="../images/patient/img/Profile/patient.png" alt="" />
            </div>
            </div>
            <div class="col-md-9 col-sm-8 col-xs-12">
            <div class="appoint_content">
            <h2>{translate('Samir Saxena')} <span>{translate('(Wife)')}</span></h2>
            <p>{translate('55 Female')}</p>
            
            </div>
            </div>
            </div>
            </div>
            
            </div>
            </div>
            </div>
            </div>
            </div>  
            </div>
            
            </div>
            </div>
            
            
            
            
            </div>
            </div>
            </section>

              {/* <!-- Cancel Appointment modal --> */}
  <div class="modal fade" id="cancel_app" role="dialog">
    <div class="modal-dialog">
    
      <div class="modal-content">
        
        <div class="modal-body">
         <div class="cancel_head">
        <h2>{translate('Select Reason For Cancel')}</h2>  
        <button type="button" class="close" data-dismiss="modal">&times;</button>
        </div>
        <div class="cancel_body">
          <p><input type="radio" name="cancelappointment" class="c_radio" value="I am not available at this time" onChange  ={this.selectedReason}/>{translate('I am not available at this time')}</p>
          <p><input type="radio" name="cancelappointment" class="c_radio" value="something more important came up" onChange={this.selectedReason}/>{translate('Something more important came up')}</p>
          {/* <p><input type="radio" name="cancelappointment" class="c_radio" value="Reschedule later" onChange={this.selectedReason}/>{translate('Reschedule later')}</p> */}
          <p><input type="radio" name="cancelappointment" class="c_radio" value="other" onChange={this.selectedReason}/>{translate('Other')}</p>
          <FormattedMessage id="Write here">
        {
            placeholder =>  <textarea class="form-control collapse-hide" id="otherCancellationReasons" rows="3"  placeholder={placeholder}></textarea>
        }
        </FormattedMessage>
          
         <div class="cancel_btn" >
           <p onClick={this.cancelAppointment}>{translate('OK')}</p>&nbsp;
           <p onClick={this.closePopup}>{translate('Cancel')}</p>
         </div>
         <div class="cancel_btn" onClick={this.cancelAppointment}>
         
         </div>
        </div>
        </div>
      
      </div>
      
    </div>
  </div>

   {/* prescription preview modal */}
   <div id="presc_preview_Modal" class="modal fade" role="dialog">
  <div class="modal-dialog modal-lg">

    <div class="modal-content">
    <iframe width="800" height="600" src="" id="prescriptionImg"></iframe>
    </div>

  </div>
</div>


   {/* <!-- Feedback modal --> */}
  <div class="modal fade" id="feedback_modal" role="dialog">
    <div class="modal-dialog">
    
    
      <div class="modal-content">
        <div class="modal-header">
          <button type="button" class="close" data-dismiss="modal">&times;</button>
        </div>
        <div class="modal-body">
         <div class="feedback_head">
        <h2>{translate('Give Your Feedback')}</h2>  
        <h6>{translate('to this consultation')}</h6>
        <div class="rating_ico">
        <span><i class="fa fa-star" aria-hidden="true" id="1" onClick={this.feedBack}></i></span>
        <span><i class="fa fa-star" aria-hidden="true" id="2" onClick={this.feedBack}></i></span>
        <span><i class="fa fa-star" aria-hidden="true" id="3" onClick={this.feedBack}></i></span>
        <span><i class="fa fa-star" aria-hidden="true" id="4" onClick={this.feedBack}></i></span>
        <span><i class="fa fa-star" aria-hidden="true" id="5" onClick={this.feedBack}></i></span>
         </div>
       
        </div>
        <div class="feedback_body">
          <form>
          {/* <div class="form-group">
            <label>Title</label>
            <input type="text" class="form-control" placeholder="Type title" />
          </div> */}
          <div class="form-group">
            <label>{translate('Please comment on the consultation')}</label>
            <FormattedMessage id="Write here">
        {
            placeholder => <textarea class="form-control" rows="3" placeholder={placeholder} id="feedbackComment" onKeyUp={this.handleComment}></textarea>
        }
        </FormattedMessage>
            
          </div>
          <div class="submit_btn" onClick={this.saveFeedBack}>
            <p>{translate('Submit')}</p>
          </div>
        </form>
        </div>
     
        </div>
      
      </div>
      
    </div>
  </div>
            
            
            <PatientFooter/>
            </I18nPropvider>
            </main>
            
            
        )
    }
    
}
