import React, { Component, useState } from 'react';
import $ from "jquery";
import { ToastContainer } from "react-toastify";
import toast from "../helpers/toast";
import { Link } from "react-router-dom";
import Httpconfig from "../helpers/Httpconfig";
import Patnewcss from "../../public/css/patient/style-new.css";
import  Constant from "../../constants";
import FileBase64 from "react-file-base64";
import { I18nPropvider, LOCALES } from '../../i18nProvider';
import translate from "../../i18nProvider/translate";







export default class Patientmenu extends Component {

	constructor(props) {
        super(props);
        
        const lang=localStorage.getItem('Language_selected');
        this.state={
            Language:""
        }
       
  }

  componentDidUpdate =() =>{
    var lang=localStorage.getItem('Language_selected');
    if(lang!=null) {
        if(this.state.Language!=lang){
    this.state.Language=lang;
    this.forceUpdate();
        }
    
    } else {
        this.state.Language="en-us";
    }

  }

  componentDidMount = () => {
    let url_path=window.location.pathname;
   
    let pages=url_path.split("/");
    var page=pages[1];
    var obj={};
   
    obj[page]="active";
    this.setState(obj);


    var lang=localStorage.getItem('Language_selected');
    if(lang!=null) {
    this.state.Language=lang;
    } else {
    this.state.Language=lang;
    }
    var retrievedObject=localStorage.getItem('userObj');
        let userData=JSON.parse(retrievedObject)
        if(retrievedObject!=null || retrievedObject!=null ){
         this.setState({
            token:userData.accessToken,
             patient_id:userData.patient_id,
             patientId:userData.patient_id,
          }); 
          this.getProfileDetails(userData.patient_id);
    
    }  
  } 

  getProfileDetails=(patientId)=>{
    if(patientId!=""){
   let url_path="api/Patients/"+patientId;
   let patientDob="";
   Httpconfig.httptokenget(Constant.siteurl + url_path, {
   })
      .then((response) => {
       this.state.selectedPatientId=patientId;
       if(response.data.status==200 && response.data.error==false){
          response.data.data.map((relationsList,num)=>{ 
            
            if(relationsList.profile_pic!=null){
             
           this.state.patientProfileImage=Constant.imgurl+relationsList.profile_pic;
            }else{
              this.state.patientProfileImage=null;
              // if(relationsList.gender!=null){
               
              //   if(relationsList.gender=='male'){
              //     this.state.patientProfileImage=Constant.imgurl+"../images/patient/img/Profile/Male_patient.svg";
              //   }else{
               
              //     this.state.patientProfileImage=Constant.imgurl+"../images/patient/img/Profile/Female_patient.svg";
              //   }
              // }else{
                
              //   this.state.patientProfileImage="";
              // }
            }
            
           this.state.name=relationsList.name;
       })
       this.forceUpdate();
       }
      })
      .catch((error) => {
        toast.error(error);
      });
   }

}
getFiles(files) {
  this.setState({ files: files });
  let patientId = this.state.patientId;
  let patientProfileImage = this.state.files[0].base64;
  this.state.patientProfileImage = patientProfileImage;
  this.forceUpdate();
 
  Httpconfig.httptokenput(
    Constant.siteurl + "api/Users/uploadimages/" + patientId,
    {
      profile_pic: this.state.files[0].base64,
    }
  )
    .then((response) => {
      toast.success("👌 Profile Image Updated Successfully", {
        position: "bottom-center",
      });
      location.reload();
    })
    .catch((error) => {
      this.props.history.push("/patienthealthprofile");
      console.log(error);
      toast.error(error);
    });
}

  
    
  
 
  render(){
   	return(

        
        <div > 
        {/* ja-jp */}
        {/* en-us */}
        {/* de-de */}
        {/* fr-ca */}  
        
        <I18nPropvider locale={this.state.Language} >
        
        {/* <section id="order_profile"> */}
            <div class="pro_section">
            <div class="profile_menu_sec" id="pro_menu">
            <div class="profile_box">
            
            {this.state.patientProfileImage!=null ?
            (<img src={this.state.patientProfileImage} />) :
            this.state.PatientGender=="Female" ?
            <img src="../images/patient/img/Profile/Female_patient.svg" /> :
            <img src="../images/patient/img/Profile/Male_patient.svg" />
            }
            <a href="#"> <h2 class="edit_avtar">
            <div class="input-group">
            <span class="input-group-btn"> 
            </span>
          </div>

            <span className="btn-file">
            <img src="../images/patient/img/Profile/edit.svg" />
            <FileBase64
                                    multiple={true}
                                    onDone={this.getFiles.bind(this)}
                                  />
            </span>
            </h2>
            
            </a>
            <div class="profile_name_sec">
            <p class="hello_word">{translate('Hello!')}</p>
            <p class="doc_name">{this.state.name ? this.state.name.charAt(0).toUpperCase() + this.state.name.slice(1) :""}</p>
            </div>  
            </div>
            <ul class="profile-menu-ul-1">
            <li class={this.state.Patientdashboard ? "profile_li" :"" }><a href="/Patientdashboard"><img src="../images/patient/img/Ordermedicine/myAppointment.svg" />{translate('My Appointment')} <span class="right_arrow"><img  src="../images/patient/img/Ordermedicine/rightIcon.svg" /></span></a></li>
            {/* <li class={this.state.myOrders ? "profile_li" :"" }>
                          <a href="/myOrders">
                            <img src="../images/patient/img/Ordermedicine/MyOrder.svg"/>
                            {translate("My Orders")}
                            <span class="right_arrow"><img  src="../images/patient/img/Ordermedicine/rightIcon.svg" /></span>
                          </a>
                        </li> */}
                        {/* <li class={this.state.PatientSavedMedicines ? "profile_li" :"" }><a href="/PatientSavedMedicines"><img src="../images/patient/img/Ordermedicine/MyProfile.svg" />{translate('My Saved Medicine')}  <span class="right_arrow"><img  src="../images/patient/img/Ordermedicine/rightIcon.svg" /></span></a></li> */}
            <li class={this.state.Patientprofile ? "profile_li" :"" } onClick={this.addPatient}><a href="/Patientprofile"><img src="../images/patient/img/Ordermedicine/MyProfile.svg" />{translate('My Profile')}  <span class="right_arrow"><img  src="../images/patient/img/Ordermedicine/rightIcon.svg" /></span></a></li>
          
          
                        {/* <li class={this.state.manageAddress ? "profile_li" :"" }>
                          <a href="/manageAddress">
                            <img src="../images/patient/img/Ordermedicine/locationIcon.svg" />
                            {translate("Manage Address")}
                            <span class="right_arrow"><img  src="../images/patient/img/Ordermedicine/rightIcon.svg" /></span>
                          </a>
                        </li> */}
                        <h2>Others</h2>
            <li class=""><a href="#"><img src="../images/patient/img/Ordermedicine/PrivacyPolicy.svg" />{translate('Privacy Policy')}
            <span class="right_arrow"><img  src="../images/patient/img/Ordermedicine/rightIcon.svg" /></span>
            </a></li>
            <li class=""><a href="#"><img src="../images/patient/img/Ordermedicine/T&C.svg" />{translate('Terms & Conditions')}
            <span class="right_arrow"><img  src="../images/patient/img/Ordermedicine/rightIcon.svg" /></span>
            </a></li>
            
            
            </ul>
            </div>
            </div>
            {/* </section> */}
            
 </I18nPropvider>
 
</div>

			
      )
  
    }
}