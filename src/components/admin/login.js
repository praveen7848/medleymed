import React, { Component, useState } from "react";
import $ from "jquery";
import { ToastContainer, toast } from 'react-toastify';
import { Link } from "react-router-dom";
import Httpconfig from "../helpers/HttpconfigAdmin";
import Constant from "../../constants";
import { FormattedMessage, IntlProvider } from "react-intl"; // Backup Way to Convert
import { I18nPropvider, LOCALES } from "../../i18nProvider";
import translate from "../../i18nProvider/translate";
import Patnewcss from "../../public/css/doctor/doctor.css";
import PatientHeader from "../patient/Patientheader";
import PatientFooter from "../patient/Patientfooter";
import { reactLocalStorage } from "reactjs-localstorage";


export default class Doctorlogin extends Component {
    constructor(props) {
      super(props);
      this.state = {
        fields: {},
        errors: {},
        files: [],  
        type:"password",  
        img:"../images/doctor-img/Login screens/hide_icon.svg",
      };
      this.showPassword=this.showPassword.bind(this);
    }    
    handleChange = (field, event) => {
      
      let fields = this.state.fields;
      fields[field] = event.target.value;
      this.setState({ fields });
    }
    checkSubmit(event) {
      
      event.preventDefault();
      const { handle } = this.props.match.params;
      if (this.handleValidation() && handle) {
        // this.updatePatient(event);
      } else if (this.handleValidation() && handle == undefined) {
        this.checkLogin(event);
      } else {
        toast.warn("Form has errors.");
      }
    }
    handleValidation() {
      let fields = this.state.fields;
      let errors = {};
      let formIsValid = true;
      var pattern = /^[a-zA-Z0-9]{3,20}$/g;
      var numbers = /^[0-9]+$/;
      
      if (!fields["username"]) {
        formIsValid = false;
        errors["username"] = "User name cannot be empty";
      } else if (typeof fields["username"] !== "undefined" && fields["username"].lastIndexOf("@")>0) {
        let lastAtPos = fields["username"].lastIndexOf("@");
        let lastDotPos = fields["username"].lastIndexOf(".");
        if (
          !(
            lastAtPos < lastDotPos &&
            lastAtPos > 0 &&
            fields["username"].indexOf("@@") == -1 &&
            lastDotPos > 2 &&
            fields["username"].length - lastDotPos > 2
          )
        ) {
          formIsValid = false;
          errors["username"] = "Email is invalid";
        }

      } else if (!/^[0-9]+$/g.exec(fields["username"])) {
        formIsValid = false;
        errors["username"] = "Invalid Username / Special characters not allowed";
        
      } else if (fields["username"].length < 10) {
        formIsValid = false;
        errors["username"] = "Phone number invalid";
      }else {
        errors["username"]="";
      }
      if(!fields['pwd']) {
        
        formIsValid = false;
        errors["pwd"] = "password cannot be empty";

     }else{
      errors["pwd"] = "";
     } 
      
      this.setState({ errors: errors });
      return formIsValid;
    }

    
   checkLogin = (event) => {
    event.preventDefault();
    var handle = this.props.match.params.handle;
    const { fields, errors } = this.state;
    // console.log(fields);
    // console.log(Constant.siteurl);
    if(fields["username"].lastIndexOf("@")>0){
      var post_data={
      email:fields["username"],
      role:"admin",
      password:fields["pwd"],
      }
    }else{
      var post_data={
      phone :fields["username"],
      role:"admin",
      password:fields["pwd"],
      }
    }

   Httpconfig.httptokenpost(Constant.siteurl + "api/Users/login", post_data)
      .then((response) => {
        if(response.data.data==""){
          toast.error(response.data.message);
          return
        }
        if(response.data.loginOutput.data!=""){
          //alert(response.data.loginOutput.data.userobj);
       // console.log(response.data.loginOutput.data.userobj);
        reactLocalStorage.setObject("AdminUserObj", response.data.loginOutput.data.userobj);
        localStorage.setItem("AdminToken", response.data.loginOutput.data.userobj.accessToken);
        // localStorage.removeItem("doctorToken");
        // reactLocalStorage.setObject("doctorToken", response.data.loginOutput.data.userobj.accessToken);
        toast.success(response.data.loginOutput.notification.message);
        setTimeout(() => this.props.history.push("/admin"), 2000);
        }
      })
      .catch((error) => {
        toast.error(error);
      });
  };
  componentDidMount=()=>{
    var AdminObject = localStorage.getItem("AdminUserObj");
    if(AdminObject!=null){
      setTimeout(() => this.props.history.push("/admin"), 2000);
    }
  } 
  
  showPassword(){
    let type=this.state.type;
    if(this.state.type){
    if(this.state.type=='input'){
      this.state.type='password';
      this.state.img="../images/doctor-img/Login screens/hide_icon.svg";
    }else{
      this.state.type='input';
      this.state.img="../images/doctor-img/Login screens/unhide_icon.svg";
    }
  }
   this.forceUpdate();   
  }
    render() {
        return (
            
<main id="main">
{/* <PatientHeader onSelectLanguage={this.handleLanguage}/> */}
        <I18nPropvider locale={this.state.Language}>
       
    <section id="doctor_login">
  <div class="container">
    <div class="row">
      <div class="col-md-6 doc_img_mid">
    <div class="doc_login_img">
    {/* <img src="../images/doctor-img/Login screens/Logo.png" /> */}
    <img src="../images/patient/img/logo.png" />
    </div>

</div>
<div class="col-md-6 doc_form_mid">
    <div class="doc_login_form">
        <h2>Login to Administrator</h2>
        <form  onSubmit={this.checkSubmit.bind(this)}>
            <div class="form-group">
             <label>Mobile or Email</label>
              <input type="text" class="form-control log_input" name="username" id="username" placeholder="Mobile or Email" onChange={this.handleChange.bind(this,"username")} />
             
            </div>
            <span className="cRed">
                                {this.state.errors["username"]}
              </span>
            <div class="form-group">
            <label>Password</label>
              <input type={this.state.type}  class="form-control log_input" name="pwd" id="pwd" placeholder="Password" onChange={this.handleChange.bind(this,"pwd")} />
              <img class="password_ico" onClick={ this.showPassword }  src={this.state.img} />
            </div>
            <span className="cRed">
                  {this.state.errors["pwd"]}
              </span>
            
            <button type="submit" class="btn btn-default doc_log_btn">Login</button>
            {/* <p class="fgt_pwd">Forgot Password ?</p> */}
          </form>
          
    </div>

</div>
</div>
</div>
</section>
<ToastContainer />
</I18nPropvider>
        <PatientFooter/>
  
  </main>


        );
    }
}