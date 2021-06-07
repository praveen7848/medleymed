import React, { Component, useState } from 'react';
import $ from "jquery";
import { ToastContainer, toast } from 'react-toastify';
import { Link } from "react-router-dom";
import Httpconfig from "../helpers/Httpconfig";
import { Carousel } from "react-responsive-carousel";
import styles from "react-responsive-carousel/lib/styles/carousel.min.css";
import Patcss from "../../public/css/patient/style_pat.css";
import Constant from "../../constants";
//import Boot from "../../public/css/patient/bootstrap.min.css";
// import Boo from "../../public/bootstrap/css/bootstrap.min.css";
import { I18nPropvider, LOCALES } from '../../i18nProvider';
import translate from "../../i18nProvider/translate";
import { reactLocalStorage } from 'reactjs-localstorage';
import { Dropdown } from 'semantic-ui-react';
// import Facebook from "../Facebook";
const moment = require("moment");
//const imgurl='http://3.7.234.106:8100';


export default class Patientheader extends Component {

   constructor(props) {
      super(props);
      //const [locale, setLocale] = useState(LOCALES.ENGLISH);
      const userData = reactLocalStorage.getObject('userObj');
     // alert(userData);
     // alert(Object.keys(userData).length);
     // alert(Object.size(userData));
      // if(Object.keys(userData).length>0 ){
      //   toast.error("Please login to book an appointment", {
      //     //  position: "bottom-center",
      //     });
      //    // return;
      //   window.location.href = "/Patientlogin";
           
      // }
      this.state = {
         Language: "ENGLISH",
         Language_sel: "",
         userData: userData,
         showFacebookButton: true,
         userName: "",
         friendOptions : [
            {
              key: 'en-us',
              text: ' English ',
              value: 'ENGLISH',
              image: { avatar: true, src: 'https://icons.iconarchive.com/icons/icons-land/vista-flags/256/English-Language-Flag-1-icon.png' },
            },
            {
              key: 'fr-ca',
              text: ' German',
              value: 'GERMAN',
              image: { avatar: true, src: 'https://icons.iconarchive.com/icons/custom-icon-design/all-country-flag/256/Germany-Flag-icon.png' },
            },
            {
              key: 'de-de', 
              text: ' French',
              value: 'FRENCH',
              image: { avatar: true, src: 'https://icons.iconarchive.com/icons/custom-icon-design/all-country-flag/256/France-Flag-icon.png' },
            },
            {
              key: 'ja-jp',
              text: ' Japanese',
              value: 'JAPANESE',
              image: { avatar: true, src: 'https://icons.iconarchive.com/icons/custom-icon-design/flag/256/Japan-Flag-icon.png' },
            }
          ]
      }

      this.goHome=this.goHome.bind(this);
      this.getNotifications=this.getNotifications.bind(this);
      this.handleOnChange=this.handleOnChange.bind(this);
      
      if(Object.keys(userData).length > 0){
         this.state.userName = userData.name;
      }
      console.clear();
      console.log(userData);
     
   }

   removeLoggedSession = () => {

    var retrievedObject=localStorage.getItem('userObj');
        if(retrievedObject==null){
            window.location.href="./patientlogin";
        }
        let userData=JSON.parse(retrievedObject);

      let userId=userData.userID;
      Httpconfig.httptokenget(Constant.siteurl +"api/Users/logout/"+userId,)
      .then((response) => {

    localStorage.removeItem("userObj");
    localStorage.removeItem("SelectedPatientId");
    localStorage.removeItem("PatientselectedAppointment");
    localStorage.removeItem("DoctorSelected");
    localStorage.removeItem('patientToken');
    
    setTimeout(
       () => window.location.reload(),
       1000
    );
  })
  .catch((error) => {
    toast.error(error);
  });
 }


 
 validateToken=()=>{
   
  var retrievedObject=localStorage.getItem('userObj');
  if(retrievedObject==null){
      window.location.href="./Patientlogin";
  }
  let userData=JSON.parse(retrievedObject);
  let userId=userData.userID;
  if(localStorage.getItem("patientToken")){
    let token=localStorage.getItem("patientToken");
  
    Httpconfig.httptokenpost(Constant.siteurl +"api/Users/checkToken",{
      userid:userId,
      token:token,
      
    })
      .then((response) => {
        if(response.data.status=="200" && response.data.error===true){
          
          localStorage.removeItem("userObj");
          localStorage.removeItem("SelectedPatientId");
          localStorage.removeItem("PatientselectedAppointment");
          localStorage.removeItem("DoctorSelected");
          localStorage.removeItem('patientToken');
          toast.error(response.data.data);

          setTimeout(
            () => window.location.href="./Patientlogin",
            3000
         );
         return
        }
      })
      .catch((error) => {
        toast.error(error);
      });

  }else{
    if(retrievedObject!=null){
      localStorage.removeItem("userObj");
      localStorage.removeItem("SelectedPatientId");
      localStorage.removeItem("PatientselectedAppointment");
      localStorage.removeItem("DoctorSelected");
      localStorage.removeItem('patientToken');
      toast.error("Your Session has timed out.Please Relogin");
      setTimeout(
        () => window.location.reload(),
        1000
    );
  }
    
  }  
 }


   selectedLanguage = (e) => {
     // console.log(e.target.value + " Selected Value");
     
      this.state.Language = e.target.value;
      
      if (e.target.value === "ENGLISH") {
         //  setLocale(LOCALES.ENGLISH)
         this.state.Language_sel = e.target.value;
         this.state.Language = 'en-us';
      } else if (e.target.value === "GERMAN") {
         this.state.Language = 'de-de';
         this.state.Language_sel = e.target.value;
      } else if (e.target.value === "FRENCH") {
         this.state.Language = 'fr-ca';
         this.state.Language_sel = e.target.value;
      } else if (e.target.value === "JAPANESE") {
         this.state.Language = 'ja-jp';
         this.state.Language_sel = e.target.value;
      }

      localStorage.setItem('Language_selected', this.state.Language);
   }
 ComponentWillMount=()=>{
  var retrievedObject = localStorage.getItem("userObj");
  if(retrievedObject==null){
      window.location.href="/";
      return false;
  }

 }
   componentDidMount() {
    let page="";
    let patientId="";
    let url_path=window.location.pathname;
    if(url_path=="/"){
      page="";
    }else{
      let page=url_path.split("/");
    }
    var retrievedObject="";
    retrievedObject = localStorage.getItem("userObj");
    if(retrievedObject==null ){
      toast.error("Please login to book an appointment", {
        });
        const interval = setInterval(() => {
          var retrievedObject1="";
           retrievedObject1 = localStorage.getItem("userObj");
          if(page!=""){
           if(retrievedObject1==null && page!=',Patientlogin'  ){
            window.location.href = "/Patientlogin";
          }}
    }, 30000); 
     
         
    }
    
   const interval = setInterval(() => {
    let patientId="";
    if(retrievedObject!=null){
    let userData = JSON.parse(retrievedObject);
     patientId=userData.patient_id;
    if(patientId!=null){
      this.getNotifications(patientId);
    }
    }
     }, 30000);
     if(retrievedObject!=null){
      let userData = JSON.parse(retrievedObject);
        patientId=userData.patient_id;
      if(patientId!=null){
       let patientId=userData.patient_id;
       this.validateToken();
      }
    }
    //
    this.getProfileDetails(patientId);
    var lang = localStorage.getItem('Language_selected');
    if(lang=='undefined'){
      localStorage.setItem('Language_selected', 'en-us');
      lang='en-us';
    }
    if(lang != undefined){
    if(lang== 'en-us')
    {
        this.state.Language_sel ='ENGLISH'

    }else if(lang== 'de-de')
    {
        this.state.Language_sel ='GERMAN'

    }
    else if(lang== 'fr-ca')
    {
        this.state.Language_sel ='FRENCH'

    }
    else if(lang== 'ja-jp')
    {
        this.state.Language_sel ='JAPANESE'

    }else{
        this.state.Language_sel ='ENGLISH'
    }
  }else{
    this.state.Language_sel ='ENGLISH'
    localStorage.setItem('Language_selected', 'en-us');
  }
    
    this.forceUpdate()
       
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
          let patientProfileImage="";
          let PatientGender=response.data.data[0].gender;
          if(response.data.data[0].profile_pic!=null){
            patientProfileImage=Constant.imgurl+response.data.data[0].profile_pic;
          }else{
            if(PatientGender=="Male"){
              patientProfileImage="../images/patient/img/Profile/Male_patient.svg";
            }else{
              patientProfileImage="../images/patient/img/Profile/Female_patient.svg";
            }
          }
         // let patientProfileImage=response.data.data[0].profile_pic;
           this.setState({
               patientProfileImage:patientProfileImage,
               PatientGender:PatientGender,
           })

         
       }
      })
   }

}
   getNotifications=(patientId)=>{

    Httpconfig.httptokenget(Constant.siteurl +"api/PatientAppointment/getPatientConsultNowAppointments/"+patientId,)
    .then((response) => {
      
      if(response.data.status=="200" && response.data.error==false){

        
        if(response.data.data.length>0){
        response.data.data.map((notifcation)=>{ 
          var dateTime=notifcation.appointment_date+" "+notifcation.appointment_time;
          var mindiff=(moment().diff(dateTime, 'minutes'));
        //alert(mindiff);
        
          if(mindiff < 0){ 
          if(notifcation.status==2 ||notifcation.status==3 ){
            toast.success("Dr."+notifcation.doctor_name.charAt(0).toUpperCase() + notifcation.doctor_name.slice(1)+" has accepted your request \n Continue booking of Appointment", {
             // position: "bottom-center",
             
            });
           // this.updateNotificationStatus(notifcation.appointment_id);

          }
          if(notifcation.status==1){
            toast.error("Dr."+notifcation.doctor_name.charAt(0).toUpperCase() + notifcation.doctor_name.slice(1)+" has declined your request \n Continue booking other Doctor", {
            //  position: "bottom-center",
            });
            this.updateNotificationStatus(notifcation.appointment_id);
          }
          if(notifcation.status==0){
              toast.warn("your Appointment request is in pending waiting for Dr."+notifcation.doctor_name.charAt(0).toUpperCase() + notifcation.doctor_name.slice(1)+" confirmation", {
             //   position: "bottom-center",
          });  
        }

          }else{
            if(notifcation.status!=3)
            this.updateNotificationStatus(notifcation.appointment_id);
          }


          })
        }
          
      }

    })
    .catch((error) => {
      toast.error(error);
    });
    
   }
   goHome=()=>{
    window.location.href = "/";
   }
   handleOnChange = (event, data) => {
    const { value } = data;
    const { key } = data.options.find(o => o.value === value);
    this.setState({ Language_sel:value}); 
    this.setState({ Language:key}); 
    this.props.onSelectLanguage(key);  
    localStorage.setItem('Language_selected', key);
    
 }
 updateNotificationStatus=(appointmentId)=>{
  // Httpconfig.httptokenput(Constant.siteurl +"api/PatientAppointment/ConsultNowDoctorConfirmation/"+appointmentId, {status:3})
  // .then((response) => {
  //   if(response.data.status=="200" && response.data.error=="false"){
  //       // toast.warn("Confirmed Successfully", {
  //       //     position: "bottom-center",
  //       //   });
  //   }
  // })
  // .catch((error) => {
  //   toast.error(error);
  // });
 }

 handleLogout = () =>
 {
    $("#myDropdown").toggle();
 }
 patientConsent=()=>{
  

 }

   render() {
      const isLoggedIn = Object.keys(this.state.userData).length;
      let displayButton = "";
      if (isLoggedIn == 0) {
         displayButton = <Link className="login_btn" to="/patientLogin">{translate('Login')}</Link>
         this.state.showFacebookButton = true;
      } else {
         // displayButton = <a href="#" className="login_btn" onClick={this.removeLoggedSession}>{translate('Logout')}</a>
         
         displayButton = <li class="log_li" onClick={this.handleLogout.bind(this) }><div id="pro_dropdown"><div class="dropdown"><button onclick="myFunction()" class="dropbtn">
             {this.state.patientProfileImage!=null ?
            (<img src={this.state.patientProfileImage} />) :
            this.state.PatientGender=="Male" ?
            <img class="user_img" src="../images/patient/img/Profile/Male_patient.svg" /> :
            <img class="user_img" src="../images/patient/img/Profile/Female_patient.svg" />
            }
         {/* <img class="user_img" src="../images/patient/img/Profile/Male_patient.svg" alt="" /> */}
         { this.state.userName ? this.state.userName : ""} <img class="drop_img" src="../images/patient/img/Homepage/Dropdown.svg"/></button>
                <div id="myDropdown" className="dropdown-content"><a href="/Patientdashboard">Profile</a><a href="#"  onClick={this.removeLoggedSession}>{translate('Logout')}</a></div></div></div></li>;

         this.state.showFacebookButton = false;
      }
      
      return (
         <div>
            {/* ja-jp */}
            {/* en-us */}
            {/* de-de */}
            {/* fr-ca */}
            <I18nPropvider locale={this.state.Language} >

               <section>
             

                  <header id="header" class="fixed-top">
                     <div class="container">
                        <div class="logo float-left" onClick={this.goHome}>

                           <a href="#" class="scrollto"><img src="./images/patient/img/logo.png" alt="" class="img-fluid" /></a>
                        </div>
                        <nav class="main-nav float-right d-none d-lg-block">

                           <ul class="second_menu">
                              {/* <li ><a href="#">
                                 <select class="form-control lang-control" value={this.state.Language_sel} onChange={this.selectedLanguage}>
                                    <option value="">Language</option>
                                    <option value="ENGLISH">English</option>
                                    <option value="GERMAN">German</option>
                                    <option value="FRENCH">French</option>
                                    <option value="JAPANESE">Japanese</option>
                                 </select>
                              </a>
                              </li> */}
                              {/* <div>Language &nbsp;</div> */}
                                       <Dropdown
      placeholder='Language'
      openOnFocus={false}
      selection
      search  
      options={this.state.friendOptions}
    //defaultValue={this.state.friendOptions[0].value} 
    //   defaultValue={this.state.Language_sel} 
      onChange={this.handleOnChange}
      onClick={this.selectedLanguage}
      
      value={this.state.Language_sel}
    />

                              {/* <li class="log_li" id="faceButton">
                                 {this.state.showFacebookButton ? <Facebook /> : ""}
                              </li> */}

                              {/* <li class="log_li">
                               { this.state.showFacebookButton ? "Welcome AVINASH" : "" } 
                              </li> */}

                              <li class="log_li">
                                 {displayButton}
                                 {/* {this.state.showFacebookButton ?  <h1 style={{ color: "green" }}>Hello, Welcome {this.state.username}</h1>  : ""} */}
                              </li>

                              <li>
                              </li>
                           </ul>

                        </nav>
                        {/* <!-- .main-nav --> */}
                     </div>
                  </header>
               </section>
               
            </I18nPropvider>
            <ToastContainer />
           

         </div>
         

      )
   }

}