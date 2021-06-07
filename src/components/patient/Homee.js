import React, { Component, useState } from 'react';
import $ from "jquery";
import { ToastContainer } from "react-toastify";
import toast from "../helpers/toast";
import { Link } from "react-router-dom";
import Httpconfig from "../helpers/Httpconfig";
import { reactLocalStorage } from 'reactjs-localstorage';
import Constant from "../../constants";

// For Translator Starts
import { FormattedMessage } from "react-intl"; // Backup Way to Convert
import { I18nPropvider, LOCALES } from '../../i18nProvider';
import translate from "../../i18nProvider/translate";
import PatientHeader from "../patient/Sanarheader";
import Patcss from "../../public/css/patient/order-medicine.css";
// import PatientMenu from "../patient/Patientmenu";
import PatientFooter from "../patient/Patientfooter";


import OwlCarousel from 'react-owl-carousel';  
import 'owl.carousel/dist/assets/owl.carousel.css';  
import 'owl.carousel/dist/assets/owl.theme.default.css'; 
const moment = require("moment"); 


export default class Homee extends Component {
  
  constructor(props) {
    super(props);
    this.state = {
      Language: "ENGLISH",
      specalitiesList:[],
      upComingDetailsView:[],
    }
    this.getAppointmentDetails=this.getAppointmentDetails.bind(this);
    
  }
  componentDidUpdate = () => {     
    var lang = localStorage.getItem('Language_selected');
    if (lang != null) {
      console.log(this.state.Language +"!="+ lang);
      
      if (this.state.Language != lang) {
        this.state.Language = lang;
        console.log("notnull " + this.state.Language);
        this.forceUpdate();
      } 
      
    } else {
      this.state.Language = "en-us";
      console.log(this.state.Language); 
    }
    
  }
  componentWillMount=()=>{
    this.onLoadSpecalities();
  }
  componentDidMount =()=>  {
    let userData="";
    userData=reactLocalStorage.getObject("userObj");
    if(userData){
      if(userData!=""){
        this.setState({
          patientId:userData.patient_id,
          
        }); 
        this.forceUpdate();
        this.getAppointmentDetails(userData.patient_id);
      }
    }
    
    
    var lang = localStorage.getItem("Language_selected");
    
    let clinic_id=window.location.pathname.split('/');
    if(clinic_id[2]!=""){
      localStorage.setItem("clinic_id",clinic_id[2]);
      this.setState.clinicId=clinic_id[2];
    }
    
    if (lang != null) {
      if (this.state.Language != lang) {
        this.state.Language = lang;
        this.forceUpdate();
      }
      
    } else {
      this.state.Language = "en-us";
    }
    //this.onLoadSpecalities();
    
  }
  handleLanguage=(langValue)=>{
    this.setState({Language: langValue});
  }
  onLoadSpecalities=()=>{
    
    Httpconfig.httptokenget(Constant.siteurl +"api/Category/1",)
    .then((response) => {
      if (response.data.status == "200" && response.data.error == false) {
        this.state.specalitiesList=response.data.data;
        this.forceUpdate();
        
        
      }
    })
    .catch((error) => {
      toast.error(error);
    });
  }
  
  
  getAppointmentDetails=(patientId)=>{
    
    Httpconfig.httptokenget(Constant.siteurl + "api/PatientAppointment/displayupcomingappointments/"+patientId,)
    .then((response) => {
      
      if(response.data.status=="200" && response.data.error==false){
        let DocName="";
        
        const upComingDetailsView= response.data.data.map((upComingDetails,num)=>{ 
          let upcomingStatus=[1,2];
        //  if(upcomingStatus.includes(upComingDetails.status)==true){
             if(upComingDetails.status=='1' ||upComingDetails.status=='2' ){
            
            if(upComingDetails.doctor_tbl.tbl_user.name!=null){
              DocName=upComingDetails.doctor_tbl.tbl_user.name.charAt(0).toUpperCase() + upComingDetails.doctor_tbl.tbl_user.name.slice(1);
            }
            
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
            
            let doctorImage="";
            let doctorAvailable="";
            let patientImage="";
            let docpic="";
            docpic=upComingDetails.doctor_tbl.profile_pic;
            let docGender=upComingDetails.doctor_tbl.gender;
            
            if(upComingDetails.doctor_tbl.profile_pic!=null) {
              let doctorImageData=upComingDetails.doctor_tbl.profile_pic;
              doctorImage=Constant.imgurl+doctorImageData;
              //doctorImage="../images/patient/img/Profile/Male_doctor.svg";   
              //alert(doctorImage);
            }else{
              if(docGender.toLowerCase()=="male"){
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
              if(upComingDetails.patient_tbl.gender){
              if(upComingDetails.patient_tbl.gender.toLowerCase()=="male"){
                patientImage="../images/patient/img/Profile/Male_patient.svg";
              }else{
                patientImage="../images/patient/img/Profile/Female_patient.svg";
              }
            }
            }
            
            
            return ( 
              
              <div class="row">
              <div class="col-md-12">
              <div class="upcoming_head">
              <h2>Your Upcoming Appointment</h2>
              <h4>Your appointment scheduled on <span><img src="../images/patient/img/Ordermedicine//Date.svg" />
              {moment(upComingDetails.appointment_datetime).format('dddd') } {  moment(upComingDetails.appointment_datetime).format('Do MMMM,YYYY')   } at {moment(upComingDetails.appointment_datetime).format('LT')}
              </span></h4>
              </div>
              <div class="schedule_app">
              <div class="doctor_content">
              <div class="doct_img">
              {/* <img src="img/doctor.png" /> */}
              <img src={doctorImage} alt="" />
              </div>
              <div class="doct_det">
              <h3>Dr. {DocName}</h3>
              <p>{upComingDetails.doctor_tbl.speciality}</p>
              <p>{upComingDetails.doctor_tbl.experience} {translate('years experience')}</p>
              </div>
              </div>
              <div class="app_wth">
              <img src="../images/patient/img/Ordermedicine/video.svg" /> 
              <p>You have <br />appointment with</p>
              </div>
              <div class="pat_content">
              <div class="pat_img">
              {/* <img src="img/doctor.png" /> */}
              {patientImage!="" ?  <img src={patientImage} alt="" /> : "" }
              </div>
              <div class="pat_det">
              <h3>{upComingDetails.patient_tbl.name.charAt(0).toUpperCase() + upComingDetails.patient_tbl.name.slice(1)} 
              {/* <span>({upComingDetails.patient_tbl.master_relationship.relation_name!=null ? upComingDetails.patient_tbl.master_relationship.relation_name :""})</span> */}
              </h3>
              <p>{patientAge}, {upComingDetails.patient_tbl.gender}</p>
              </div>
              </div>
              <div class="app_start">
              {/* <h5>Your appointment will be start on <span>5: 59</span></h5> */}
              <h5>
              {upComingDetails.status==2 ?
                <div class="join_section" id={upComingDetails.appointment_confirm_id}  onClick={this.navigate}>
                <a href="#">
                {upComingDetails.status==2 ? 
                  (<p id={upComingDetails.appointment_confirm_id}>{translate('Join Now')}</p>):
                  (<p id={upComingDetails.appointment_confirm_id}>{translate('Please wait for Doctor to join')}</p>)
                }
                </a>
                
                </div> :
                <div class="join_section" id={upComingDetails.appointment_confirm_id}  onClick={this.navigate}>
                <a href="#">
                <p id={upComingDetails.appointment_confirm_id}>{translate('Appointment Booked')}</p>
                </a>
                
                </div>
                
              }
              </h5>
              </div>
              </div>
              </div>
              </div>
              
              
            )
            
          }
      //  }
        })
        if(upComingDetailsView==null){ 
          upComingDetailsView='<div>No Upcoming appointment</div>';
        }else{
          this.state.upComingDetailsView=upComingDetailsView;
          this.forceUpdate();
        }
        
        // this.setState({
        //   upComingDetailsView:upComingDetailsView,
        
        // })
        
      }
    })
  }
  
  navigate=(event)=>{
    
    reactLocalStorage.setObject("PatientselectedAppointment", event.target.id);
    this.props.history.push("/Patientchecksettings");
  }
  redirect=()=>{
    if(this.state.patientId){
      this.props.history.push("/Patientconsultationpurpose");
    }else{
      this.props.history.push("/patientLogin"); 
    }
  }

  
  
  render() {
    const specalitiesListItems=this.state.specalitiesList;
    
    return (
      <main id="main_ord_nav">
      <PatientHeader/>
      <I18nPropvider locale={this.state.Language} >
      <section id="order_medicine_section">
      <div class="tab-content" id="nav-tabContent">
      <div class="tab-pane fade show active" id="nav-consult" role="tabpanel" aria-labelledby="nav-consult-tab">
      {/* <div class="consult_search">
      <div class="consult_input">
      <input type="text" class="form-control" placeholder="Search specialist, Doctor, Name, Cinic" />
      <span><img class="search_img" src="../images/patient/img/Ordermedicine/search.svg" /></span>
      </div>
      </div> */}
      <section id="order_med_banner">
      <div id="carouselExampleControls" class="carousel slide" data-ride="carousel">
      
      {/* <!-- The slideshow --> */} 
      <div class="carousel-inner">
      <OwlCarousel ref="cars" items={1}  
      className="owl-theme"  
      loop  
      nav 
      dots
      margin={8}>
      <div >
      <img src="../images/patient/img/Homepage/Banner-sa.svg" alt="" />
      </div>
      <div >
      <img src="../images/patient/img/Homepage/Banner-sa.svg" alt="" />
      </div> 
      <div >
      <img src="../images/patient/img/Homepage/Banner-sa.svg" alt="" />
      </div>
      </OwlCarousel>
      </div>
      
      </div>
      </section>

      {/* Upcoming appointment and show after login */}
      {this.state.patientId ? 
        <section id="order_upcoming_app">
        <div class="container">
        {this.state.upComingDetailsView}
       
      </div>
      </section>
      :"" }
      

     

 {/*Are you looking carousel */}
 {/* {specalitiesListItems.length>0 ?
        <section id="related_section">
        <div class="container">
        <div class="row">
        <div class="col-md-12">
        <div class="related_head">
        <h2>Are you looking for a physician related to pregnancy issue?</h2>
        <p>View All</p>
        <h5>Find your doctor</h5>
        </div>
        <div class="related_carousel">
        <div class="owl-carousel owl-theme">
        
        <OwlCarousel ref="cars" items={5}  
        className="owl-theme"  
        loop  
        
        margin={8}>
        { specalitiesListItems.map((spe,num) => (
          
          <div class="item"> 
          <img src={Constant.imgurl+spe.category_image} alt="Image" />
          <div class="rel_content">   
          <h2>Dr.Rakesh</h2>  
          <h5>Gynecologist</h5>
          <h5>14 years experience</h5>
          <a href="#rakesh"><p>Book</p></a> 
          </div>
          </div> 
        ))
      }
      </OwlCarousel>
      
      </div>
      </div>
      </div>
      </div>
      </div>
      </section>
      :""}     */}
      




      {/* common health problems carousel */}
      {specalitiesListItems.length>0 ?
        <section id="common_health">
        <div class="container">
        <div class="row">
        <div class="col-md-12">
        <div class="common_head">
        <h2>Common Health Concerns</h2>
        <h5>Consult doctors for an instant appointment</h5>
        </div>
        <div class="common_carousel">
        <div class="owl-carousel owl-theme">
        
        <OwlCarousel ref="cars" items={5}  
        className="owl-theme"  
        loop  
        
        margin={8}>
        { specalitiesListItems.map((spe,num) => (
          
          <div class="item"> 
          <img src={Constant.imgurl+spe.category_image} alt="Image" />
          <div class="common_content">   
          <h2>{spe.category}</h2>  
          <a href="#" onClick={this.redirect}><p>Consult now</p></a> 
          </div>
          </div> 
        ))
      }
      </OwlCarousel>
      
      </div>
      </div>
      </div>
      </div>
      </div>
      </section>
      :""}    
      


     

      
      {/* Specalities carousel */}
      {specalitiesListItems.length>0 ?
        <section id="consult_speciality">
        <div class="container">
        <div class="row">
        <div class="col-md-12">
        <div class="consult_head">
        <h2>Consult with top Specialities</h2>
        <h5>Consult doctors for an instant appointment</h5>
        </div>
        <div class="consult_carousel">
        <div class="owl-carousel owl-theme">
        
        <OwlCarousel ref="specialities" items={5}  
        className="owl-theme"  
        loop  
        
        margin={8}>
        { specalitiesListItems.map((spe,num) => (
          //  <div><img src={Constant.imgurl+spe.category_image} alt="The Last of us"/></div>
          <div class="item"> 
          <img src={Constant.imgurl+spe.category_image} alt="Image" />
          <div class="common_content">   
          <h2>{spe.category_type}</h2>  
          <a href="#" onClick={this.redirect}><p>Consult now</p></a> 
          </div>
          </div> 
        ))
      }
      </OwlCarousel>
      
      </div>
      </div>
      </div>
      </div>
      </div>
      </section>
      :"" }
      
      </div>
      
      
      {/* Order medicine div stars */}
      
      
      </div>
      
      </section>
      <PatientFooter/>
      </I18nPropvider>
      </main>
      
    )
  }
}
//export default Homee;

