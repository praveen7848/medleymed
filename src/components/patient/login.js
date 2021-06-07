import React, { Component, useState } from "react";
import $ from "jquery";
import { ToastContainer } from "react-toastify";
import toast from "../helpers/toast";
import { Link } from "react-router-dom";
import Httpconfig from "../helpers/Httpconfig";
import { Carousel } from "react-responsive-carousel";
import styles from "react-responsive-carousel/lib/styles/carousel.min.css";
import Patcss from "../../public/css/patient/style_pat.css";
import Constant from "../../constants";
//import Boot from "../../public/css/patient/bootstrap.min.css";
// import Boo from "../../public/bootstrap/css/bootstrap.min.css";
import { FormattedMessage } from "react-intl"; // Backup Way to Convert
import { I18nPropvider, LOCALES } from "../../i18nProvider";
import translate from "../../i18nProvider/translate";
import PatientHeader from "../patient/Patientheader";
import PatientMenu from "../patient/Patientmenu";
import PatientFooter from "../patient/Patientfooter";
import { reactLocalStorage } from "reactjs-localstorage";

import Facebook from "../Facebook";
import GoogleBtn from "../GoogleBtn";

export default class home extends Component {
  constructor(props) {
    super(props);
    //const [locale, setLocale] = useState(LOCALES.ENGLISH);
    this.showDiv = this.showDiv.bind(this);
    this.showemail = this.showemail.bind(this);
    this.showmobile = this.showmobile.bind(this);
    this.otpvalidate = this.otpvalidate.bind(this);

    this.state = {
      showlogin: true,
      showsignup: false,
      Language: "",
      otp: "",
      id: "",
      otp_expiry: "",

      googleName: "",
      googleEmail: "",
      isSocialObject: false,

      controller_count: 0,
      controller_total: 0,
      module_count: 0,
      module_total: 0,
      fields: {},
      errors: {},
      languages_data: "",
    };
  }
  componentDidUpdate = () => {
    
    var lang = localStorage.getItem("Language_selected");
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
  };


  handleLangChange = (field, event) => {
    let fields = this.state.fields;
    fields[field] = event.target.value;
    this.setState({ fields });
  };

  // To get detais after first render
  componentDidMount = () => {
    var lang = localStorage.getItem("Language_selected");
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
    let clinic_id=window.location.pathname.split('/');
    //alert(clinic_id[2]);
    
    if(clinic_id[2]){
   if(clinic_id[2]!="" ){
    //alert(clinic_id[2]);
     
    localStorage.setItem("clinic_id",clinic_id[2]);
    this.state.clinicId=clinic_id[2];
    this.forceUpdate();
   }else{
    this.state.clinicId=2;
    localStorage.setItem("clinic_id",2);
   }
  }else{
    this.state.clinicId=2;
    localStorage.setItem("clinic_id",2);
  }
   //alert(this.state.clinicId);
   //this.showemail();
    this.fetchlanguagesdata();
    document.getElementById("login_email").style.display = "block";
    document.getElementById("confirm_otp").style.display = "none";
    document.getElementById("phone_confirm_otp").style.display = "none";

    let isSocialObject = reactLocalStorage.getObject("isSocialObject");
    if (Object.keys(isSocialObject).length != 0) {
      this.state.googleName = isSocialObject.name;
      this.state.googleEmail = isSocialObject.email;
      this.state.isSocialObject = true;
    }
  };
  // When value changes of the fields
  handleChange = (field, event) => {
    let fields = this.state.fields;
    fields[field] = event.target.value;
    this.setState({ fields });
  };
  fetchlanguagesdata() {
    Httpconfig.httptokenget(Constant.siteurl + "api/Languages/")
      .then((response) => {
        this.setState({
          languages_data: response.data,
        });
        // console.log("Hai");
        // console.log(this.state);
      })
      .catch((error) => {
        console.log(error);
      });
  }
  otpvalidate = (e) => {
    //const buttonId = e.target.id;
    var otp = document.getElementById("otp").value;
    
    //alert(otp);
    //alert(this.state.otp);
   // alert(this.state.otp +"=="+ otp);
    if (this.state.otp == otp) {
      let generatedUserobj = this.state.userObj;
     // reactLocalStorage.setObject("userObj", generatedUserobj);
      toast.success("Registration Completed Successfully .Please Login");
      document.getElementById("otp").value="";
      window.location.reload();
      // setTimeout(
      //     () =>
      //      // this.props.history.push("/patientLogin", {
           
      //       }),
      //     1000
      //   );

    } else {
      toast.warn("Incorrect OTP");
    }
    //document.getElementById("login_phone").style.display = "none";
  };
  showemail = (e) => {
    //const buttonId = e.target.id;
    document.getElementById("login_email").style.display = "block";
    document.getElementById("login_phone").style.display = "none";
  };
  showmobile = (e) => {
    //const buttonId = e.target.id;
    document.getElementById("login_email").style.display = "none";
    document.getElementById("login_phone").style.display = "block";
  };

  showDiv = (e) => {
    const buttonId = e.target.id;
    // console.log(buttonId);
    if (buttonId == "nav-home-tab") {
      this.setState({
        showlogin: true,
        showsignup: false,
      });

      var element = document.getElementById("login_home");
      element.classList.add("show");
      var element = document.getElementById("login_home");
      element.classList.add("active");
      var element = document.getElementById("signup_home");
      element.classList.remove("show");
      var element = document.getElementById("signup_home");
      element.classList.remove("active");
      var element = document.getElementById(buttonId);
      element.classList.add("show");
      var element = document.getElementById(buttonId);
      element.classList.add("active");
      var element = document.getElementById("nav-profile-tab");
      element.classList.remove("show");
      var element = document.getElementById("nav-profile-tab");
      element.classList.remove("active");
    }
    if (buttonId == "nav-profile-tab") {
      this.setState({
        showlogin: false,
        showsignup: true,
      });

      var element = document.getElementById("signup_home");
      element.classList.add("active");
      var element = document.getElementById("signup_home");
      element.classList.add("show");
      var element = document.getElementById("login_home");
      element.classList.remove("show");
      var element = document.getElementById("login_home");
      element.classList.remove("active");
      var element = document.getElementById(buttonId);
      element.classList.add("show");
      var element = document.getElementById(buttonId);
      element.classList.add("active");
      var element = document.getElementById("nav-home-tab");
      element.classList.remove("show");
      var element = document.getElementById("nav-home-tab");
      element.classList.remove("active");
    }
    //some logic
  };
  //   showDiv(id){
  //   alert(id);
  //   console.log(id);
  //   }

  // Patient Login using Mobile Functionality Start

  // When value changes of the login Mogile Fields
  loginHandleMobileChange = (field, event) => {
    let fields = this.state.fields;
    fields[field] = event.target.value;
    this.setState({ fields });
  };

  validateOTP = (field, event) => {
    let fields = this.state.fields;
    fields[field] = event.target.value;
    this.setState({ fields });
    return;
  };

  validateOTPRedirect(event) {
    event.preventDefault();
    const { handle } = this.props.match.params;
    if (this.handlePhoneOtpValidation() && handle == undefined) {
      const { fields, errors } = this.state;
      let generatedSessionOtp = this.state.loginOTP;
      let generatedToken = this.state.sessionAccessToken;
      let generatedUserobj = this.state.userObj;
      let enteredOtp = fields["validate_login_otp"];
      // console.log("Flow OKE");
      // console.log(this.state.loginOTP+" this.state.loginOTP ");
      // console.log(fields);
      //alert(generatedSessionOtp+ "=="+ enteredOtp);
      if (generatedSessionOtp == enteredOtp) {
        // console.log(generatedUserobj);
        //alert("in");
        let redirectStatus="";
        redirectStatus=localStorage.getItem('ordermedicineredirect');
        reactLocalStorage.setObject("userObj", generatedUserobj);
        let userObj=localStorage.getItem("userObj");

        if(redirectStatus==1){
          setTimeout(
            () =>
              this.props.history.push("/ordermedicinehome", {
                userObj: generatedUserobj,
              }),
            1000
          );
          localStorage.removeItem("ordermedicineredirect");
          return;
        }


        Httpconfig.httptokenget(Constant.siteurl + "api/problem/checkIsProfileUpdated/"+JSON.parse(generatedUserobj.patient_id),)
        .then((responseData) => {
          if(responseData.data.status=="200"){
            let healthProfileStatus=responseData.data.healthProfileStatus;
            if(healthProfileStatus==1){
            setTimeout(
              () =>
                this.props.history.push("/patientConsultationPurpose", {
                  userObj: generatedUserobj,
                }),
              1000
            );
          }
          if(healthProfileStatus==0){
            setTimeout(
              () =>
                this.props.history.push("/Patientprofile", {
                  userObj: generatedUserobj,
                }),
              1000
            );
          }

          }
        })
        .catch((error) => {
          toast.error(error);
        });

        
      }else{
        toast.error("Invalid OTP.");
      }
    } else {
      toast.warn("Validate OTP has errors.");
    }
  }

  handlePhoneOtpValidation() {
    let fields = this.state.fields;
    let errors = {};
    let formIsValid = true;
    if (!fields["validate_login_otp"]) {
      errors["validate_login_otp"] = "";
      formIsValid = false;
      errors["validate_login_otp"] = "OTP cannot be empty";
    }
    this.setState({ errors: errors });
    return formIsValid;
  }

  // Login Form Validation Action
  loginMobileCheckSubmit(event) {
    event.preventDefault();
    const { handle } = this.props.match.params;
    if (this.handleMobileLoginValidation() && handle == undefined) {
      this.createPatientLoginSession(event);
    } else {
      toast.warn("Form has errors.");
    }
  }

  loginEmailCheckSubmit(event) {
   // alert("in");
    event.preventDefault();
    const { handle } = this.props.match.params;
    if (this.handleEmailLoginValidation() && handle == undefined) {
      this.createEmailPatientLoginSession(event);
    } else {
      toast.warn("Form has errors.");
    }
  }
  createEmailPatientLoginSession = (event) => {

    event.preventDefault();
    const { fields, errors } = this.state;
    console.log(fields);
    Httpconfig.httptokenpost(Constant.siteurl + "api/Users/login", {
      email: fields["email_id"],
      role: "patient",
    })
      .then((response) => {
  //  alert(response.data.status);
  //  alert(response.data.error);
        if(response.data.status=="204" && response.data.error==true) {
          // alert(response.message);
          toast.error("Not registered with this email id");
         }
        if (response.data.loginOutput.notification.code==200 && response.data.loginOutput.notification.type=='Success' ) {
       //   if(response.data.status==204 && response.data.error==false) {
         //  alert("Before");
          document.getElementById("login_email").style.display = "none";
          document.getElementById("login_phone").style.display = "none";
          document.getElementById("phone_confirm_otp").style.display = "block";
          //alert(response.data.loginOutput.data.userobj.otp);
          let generatedOTP = response.data.loginOutput.data.userobj.otp;
          let generatedToken =  response.data.loginOutput.data.userobj.accessToken;
          let userId = response.data.loginOutput.data.userobj.userID;
          this.state.selectedUserId=response.data.loginOutput.data.userobj.userID;
          //alert(this.state.selectedUserId);
          this.state.loginOTP = generatedOTP;
          this.state.sessionAccessToken = generatedToken;
          this.state.userObj = response.data.loginOutput.data.userobj;
          this.forceUpdate();
          localStorage.setItem("patientToken", response.data.loginOutput.data.userobj.accessToken);
        } 
      
      })
      .catch((error) => {
        console.log(error);
        toast.error(error);
      });
    //  return;
  };
  // Login Form Submit Action
  createPatientLoginSession = (event) => {
    event.preventDefault();
    const { fields, errors } = this.state;
    console.log(fields);
    Httpconfig.httptokenpost(Constant.siteurl + "api/Users/login", {
      phone: fields["user_login_mobile_no"],
      role: "patient",
    })
      .then((response) => {
  //  alert(response.data.status);
  //  alert(response.data.error);
   if(response.data.status=="204" && response.data.error==true) {
    // alert(response.message);
    toast.error("Mobile Number not registered");
   }
       // alert(response.data.status);
       if (response.data.loginOutput.notification.code) {
      //    if(response.data.status==204 && response.data.error==false) {
          document.getElementById("login_phone").style.display = "none";
          document.getElementById("phone_confirm_otp").style.display = "block";
          //alert(response.data.loginOutput.data.userobj.otp);
          let generatedOTP = response.data.loginOutput.data.userobj.otp;
          let generatedToken =
            response.data.loginOutput.data.userobj.accessToken;
          let userId = response.data.loginOutput.data.userobj.userID;
          this.state.selectedUserId=response.data.loginOutput.data.userobj.userID;
          
          this.state.loginOTP = generatedOTP;
          this.state.sessionAccessToken = generatedToken;
          this.state.userObj = response.data.loginOutput.data.userobj;
          this.forceUpdate();

          localStorage.setItem("patientToken", response.data.loginOutput.data.userobj.accessToken);
         // alert("Token Set");

        } else {
         toast.error(response.data.message);
        }


        // toast.success("Succes Patient" + response);
      })
      .catch((error) => {
        console.log(error);
        toast.error(error);
      });
    return;
  };

  // Form Validation Section
  handleMobileLoginValidation() {
    let fields = this.state.fields;

    let errors = {};
    let formIsValid = true;
    if (!fields["user_login_mobile_no"]) {
      errors["user_login_mobile_no"] = "";
      formIsValid = false;
      errors["user_login_mobile_no"] = "Phone number cannot be empty";
    } else if (fields["user_login_mobile_no"].length < 10) {
      formIsValid = false;
      errors["user_login_mobile_no"] = "Phone number invalid";
    }else if (fields["user_login_mobile_no"].length > 10) {
      formIsValid = false;
      errors["user_login_mobile_no"] = "Phone number invalid";
    }
    console.log(errors);
    this.setState({ errors: errors });
    return formIsValid;
  }
  // Ends here

  handleEmailLoginValidation() {
    let fields = this.state.fields;

    let errors = {};
    let formIsValid = true;
    if (!fields["email_id"]) {
      formIsValid = false;
      errors["user_login_email_id"] = "Email cannot be empty";
    } else if (typeof fields["email_id"] !== "undefined") {
      let lastAtPos = fields["email_id"].lastIndexOf("@");
      let lastDotPos = fields["email_id"].lastIndexOf(".");
      if (
        !(
          lastAtPos < lastDotPos &&
          lastAtPos > 0 &&
          fields["email_id"].indexOf("@@") == -1 &&
          lastDotPos > 2 &&
          fields["email_id"].length - lastDotPos > 2
        )
      ) {
        formIsValid = false;
        errors["user_login_email_id"] = "Email is invalid";
      }
    } else {
      errors["user_login_email_id"] = "";
    }
    console.log(errors);
    this.setState({ errors: errors });
    return formIsValid;
  }

  checkSubmit(event) {
    event.preventDefault();
    const { handle } = this.props.match.params;
    if (this.handleValidation() && handle) {
      // this.updatePatient(event);
    } else if (this.handleValidation() && handle == undefined) {
      this.createPatient(event);
    } else {
      toast.warn("Form has errors.");
    }
  }

  handleValidation() {
    let fields = this.state.fields;
    let errors = {};
    let formIsValid = true;
    var pattern = /^[a-zA-Z0-9]{3,20}$/g;
    if (!fields["name"]) {
      formIsValid = false;
      errors["name"] = "Enter your Name";
    } else if (!/^[a-zA-Z0-9\s]{3,20}$/g.exec(fields["name"])) {
      formIsValid = false;
      errors["name"] = "Special characters not allowed";
    } else {
      errors["name"] = "";
    }
    if (!fields["email_id"]) {
      formIsValid = false;
      errors["email_id"] = "Email cannot be empty";
    } else if (typeof fields["email_id"] !== "undefined") {
      let lastAtPos = fields["email_id"].lastIndexOf("@");
      let lastDotPos = fields["email_id"].lastIndexOf(".");
      if (
        !(
          lastAtPos < lastDotPos &&
          lastAtPos > 0 &&
          fields["email_id"].indexOf("@@") == -1 &&
          lastDotPos > 2 &&
          fields["email_id"].length - lastDotPos > 2
        )
      ) {
        formIsValid = false;
        errors["email_id"] = "Email is invalid";
      }
    } else {
      errors["email_id"] = "";
    }
    if (!fields["phone"]) {
      errors["phone"] = "";
      formIsValid = false;
      errors["phone"] = "Phone number cannot be empty";
    } else if (fields["phone"].length < 10) {
      formIsValid = false;
      errors["phone"] = "Phone number invalid";
    }
    this.setState({ errors: errors });
    return formIsValid;
  }
  createPatient = (event) => {
    
    event.preventDefault();
    var handle = this.props.match.params.handle;
    const { fields, errors } = this.state;
    //alert(this.state.clinicId);
    let clinicId=this.state.clinicId;
    // console.log(fields);
    // console.log(Constant.siteurl);//return;
    Httpconfig.httptokenpost(Constant.siteurl + "api/Users/", {
      clinic_id:clinicId,
      email: fields["email_id"],
      mobile_number: fields["phone"],
      user_type: "patient",
      name: fields["name"],
      selected_language: "en",
      is_fingerprint_required: false,
      
    })
      .then((response) => {
      //  alert(response);
        if(response.data.status=="200" && response.data.error==false){
        toast.success("Successfully Created Patient");
        document.getElementById("confirm_otp").style.display = "block";
        document.getElementById("signup_div").style.display = "none";
        
       // alert(response.data.data["otp"]);
        this.state.id = response.data.data.id;
        this.state.selectedUserId=response.data.data.id;
        this.state.otp = response.data.data.otp;
        this.state.otp_expiry = response.data.data.otp_expiry;
        //setTimeout(() => this.props.history.push("/admin/PatientRegistration"), 2000);
        //this.props.history.push('/SetDoNotDisturb/'+handle);
        //alert(this.state.otp);
        }else{
          toast.warn(response.data.message);
        }
      })
      .catch((error) => {
        console.log(error);
        toast.error(error);
      });
  };

  handleLanguage = (langValue) => {
    this.setState({ Language: langValue });
  };
  
  checklength=(event)=>{
    let number=event.target.value;
    if(number.length>10)
    {
     // alert(number.length);
     number = number.substring(0, 10);
     $('#phone').val(number);

    }
  }
  mobileLength=(event)=>{
    let number=event.target.value;
    if(number.length>10)
    {
     // alert(number.length);
     number = number.substring(0, 10);
     $('#user_login_mobile_no').val(number);

    }

  }
  resesndOTp=()=>{
    let selectedUser=this.state.selectedUserId;
    Httpconfig.httptokenget(Constant.siteurl + "api/Users/resendOTP/"+selectedUser, {
      
    })
      .then((response) => {
      
      this.state.loginOTP=response.data.data.otp;
      this.forceUpdate();

        
      toast.success(response.data.message);
        // if(response.data.message=="200" && response.data.error==false){
        // }else{
        
        // }
      })
      .catch((error) => {
        console.log(error);
       // toast.error(error);
      });
  }

  render() {

    //const { controller_count, controller_total, module_count, module_total, pages } = this.state;
    const {
      languages_data,
      googleEmail,
      googleName,
      isSocialObject,
    } = this.state;
    const BLOCK = { diplay: "block" };
    const NONE = { diplay: "none" };
    const MNumber = translate("Mobile Number");


    // console.clear()
    // console.log(this.state.isSocialObject);


    return (
      <main id="main">
        {/* ja-jp */}
        {/* en-us */}
        {/* de-de */}
        {/* fr-ca */}
        <I18nPropvider locale={this.state.Language}>
        <PatientHeader onSelectLanguage={this.handleLanguage} />
          <section id="login-page">
            <div className="container">
              <div className="row">
                <div className="col-md-12 no_padding">
                  <nav>
                    <div
                      className="nav nav-tabs nav-fill"
                      id="nav-tab"
                      role="tablist"
                    >
                      <a
                        className="nav-item nav-link active"
                        id="nav-home-tab"
                        data-toggle="tab"
                        href="#login_home"
                        role="tab"
                        aria-controls="nav-home"
                        aria-selected="true"
                        onClick={this.showDiv}
                      >
                        {translate("Login")}
                      </a>
                      <a
                        className="nav-item nav-link"
                        id="nav-profile-tab"
                        data-toggle="tab"
                        href="#signup_home"
                        role="tab"
                        aria-controls="nav-profile"
                        aria-selected="false"
                        onClick={this.showDiv}
                      >
                        {translate("Signup")}
                      </a>
                    </div>
                  </nav>
                  <div className="tab-content" id="nav-tabContent">
                    <div
                      className="tab-pane fade show active"
                      id="login_home"
                      role="tabpanel"
                      aria-labelledby="nav-home-tab"
                      style={this.state.showlogin ? BLOCK : NONE}
                    >
                      <div className="login_content collapse-hide" id="login_phone">
                        <div className="login_box">
                          <div className="login_head">
                            <h5>
                              {translate(
                                "This number will be used for doctor consultation related information, new offers. We will send a code for verification to this email"
                              )}
                            </h5>
                          </div>
                          <form
                            onSubmit={this.loginMobileCheckSubmit.bind(this)}
                          >
                            <div className="form-group">
                              {/* {translate("Mobile Number")} */}
                              <FormattedMessage id="Enter Mobile number">
                                {(placeholder) => (
                                  <input
                                    type="number"
                                    id="user_login_mobile_no"
                                    name="user_login_mobile_no"
                                    class="form-control log-input"
                                    placeholder={placeholder}
                                    value={
                                      this.state.fields[
                                        "user_login_mobile_no"
                                      ] || ""
                                    }
                                    onChange={this.loginHandleMobileChange.bind(
                                      this,
                                      "user_login_mobile_no"
                                    )}
                                    onKeyUp={this.mobileLength}
                                  />
                                )}
                              </FormattedMessage>
                              <span className="cRed">
                                {this.state.errors["user_login_mobile_no"]}
                              </span>
                              {/* <input type="number" className="form-control log-input" id="number" placeholder={MNumber} /> */}
                            </div>

                            {/* onClick={(event) => event.preventDefault()} */}
                            {/* <a href="#" onClick={(event) => event.preventDefault()}> */}
                            <button
                              type="submit"
                              className="btn btn-default Next_btn"
                            >
                              {translate("Next")}
                            </button>
                            {/* </a> */}

                            <div className="use_btn" onClick={this.showemail}>
                              <a href="#">
                                <p className="use_btn">
                                  <img src="../images/patient/img/Login/blue_mail.svg" />
                                  {translate("Use Email ID")}
                                </p>
                              </a>
                              {/*  onClick={(event) => event.preventDefault()} */}
                            </div>
                            {/* <div class="next_login">
                  <p>Or login with (recommended)</p>
                  <div  className="G_login">
                    <a href="#"> <button type="button" ><img src="../images/patient/img/gmail.svg" />Login with Gmail</button></a>
                  </div>
                  <div className="fb_login">
                    <a href="#"><button type="button" ><img src="../images/patient/img/facebook.svg" />Login with Facebook</button></a>
                  </div>
                </div> */}
                          </form>
                        </div>
                      </div>

                      <div class="login_content" id="phone_confirm_otp">
                        <div class="login_box">
                          <div class="login_head">
                            <h5>{translate("Please enter your confirmation code")}</h5>
                          </div>
                          <form onSubmit={this.validateOTPRedirect.bind(this)}>
                            <div class="form-group">
                            <FormattedMessage id="Enter code">
                                {(placeholder) => (
                              <input
                                type="text"
                                name="validate_login_otp"
                                class="form-control log-input"
                                id="login_otp"
                                placeholder={placeholder}
                                onChange={this.validateOTP.bind(
                                  this,
                                  "validate_login_otp"
                                )}
                              />
                              )}
                              </FormattedMessage>
                              {/* <FormattedMessage id="Enter Mobile number">
                                                {
                                                   placeholder => <input type="number" name="user_login_mobile_no" class="form-control log-input" placeholder={placeholder} value={this.state.fields["user_login_mobile_no"] || ""} onChange={this.loginHandleMobileChange.bind(this, "user_login_mobile_no")} />
                                                }
                                             </FormattedMessage> */}
                              <span className="cRed">
                                {this.state.errors["validate_login_otp"]}
                              </span>
                              
                              <a>
                              <p class="log_account" onClick={this.resesndOTp}>Resend OTP</p>
                            </a>
                            </div>
                            {/* <a href="#"> */}
                            <button
                              type="submit"
                              class="btn btn-default Next_btn"
                            >
                              {translate("Continue")}
                            </button>
                            {/* </a> */}
                            {/* <a href="#"><p class="log_account">Resend OTP</p></a> */}
                          </form>
                        </div>
                      </div>

                      {/* <!-- code for login with email --> */}

                      {/* <!-- code for login with email --> */}

                      <div class="login_content" id="login_email">
                        <div class="login_box">
                          <div class="login_head">
                            <h5>
                              This email will be used for doctor consultation
                              related information, new offers. We will send a
                              code for verification to this email
                            </h5>
                          </div>
                           <form
                            onSubmit={this.loginEmailCheckSubmit.bind(this)}
                          >
                            <div class="form-group">
                              <FormattedMessage id="Enter email id">
                                {(placeholder) => (
                                  <input
                                    type="email"
                                    class="form-control log-input"
                                    placeholder={placeholder}
                                    onChange={this.handleChange.bind(this,"email_id")}
                                  />
                                )}
                              </FormattedMessage>
                              {/* <input type="email" class="form-control log-input" id="number" placeholder="Enter email id" /> */}
                            </div>
                            {this.state.errors["user_login_email_id"]}
                            {/* (event) => event.preventDefault() */}
                            <a
                              href=""
                              onClick={this.loginEmailCheckSubmit.bind(this)}
                            >
                              {" "}
                              {/* otp.html */}
                              <button
                                type="button"
                                class="btn btn-default Next_btn"
                              >
                                Next
                              </button>
                            </a>
                            {/* <div class="use_btn">
                              <a href="#">
                                <p class="mbl_btn" onClick={this.showmobile}>
                                  <img src="../images/patient/img/Login/Phone_number.svg" />
                                  Use Phone Number
                                </p>
                              </a>
                            </div> */}
                            {/* <div class="next_login">
                  <p>Or login with (recommended)</p>
                  <div className="G_login">
                    <a href="#"> <button type="button" ><img src="../images/patient/img/gmail.svg" />Login with Gmail</button></a>
                  </div>
                  <div className="fb_login">
                    <a href="#"><button type="button" ><img src="../images/patient/img/facebook.svg" />Login with Facebook</button></a>
                  </div>
                </div> */}
                          </form>
                        </div>
                      </div>

                      {/* <!-- code for otp --> */}
                    </div>

                    <div
                      className="tab-pane fade"
                      id="signup_home"
                      role="tabpanel"
                      aria-labelledby="nav-profile-tab"
                      style={this.state.showlogin ? BLOCK : NONE}
                    >
                      <div className="login_content" id="signup_div">
                        <div className="login_box">
                          <div className="login_head">
                            <h5>
                              {translate(
                                "We will send you an SMS with a confirmation code to this email"
                              )}
                            </h5>
                          </div>
                          {}
                          <form onSubmit={this.checkSubmit.bind(this)}>
                            <div className="form-group">
                              <FormattedMessage id="Name">
                                {(placeholder) => (
                                  <input
                                    type="text"
                                    className="form-control log-input"
                                    id="name"
                                    name="name"
                                    placeholder={placeholder}
                                    // value={this.state.fields["name"] || ""}
                                    //value={this.state.googleName ? this.state.googleName :"" } 
                                    onChange={this.handleChange.bind(this,"name")}
                                  />
                                )}
                              </FormattedMessage>
                              {/* <input type="text" className="form-control log-input" id="name" name="name" placeholder="Name" value={this.state.fields["name"] || ""} onChange={this.handleChange.bind(this, "name")} /> */}
                              <span className="cRed">
                                {this.state.errors["name"]}
                              </span>
                            </div>
                            <div className="form-group">
                              <FormattedMessage id="Email">
                                {(placeholder) => (
                                  <input
                                    type="email"
                                    className="form-control log-input"
                                    name="email_id"
                                    id="email_id"
                                    placeholder={placeholder}
                                    //value={this.state.fields["email_id"] || ""}
                                    //value={this.state.googleEmail || ""}
                                    onChange={this.handleChange.bind(
                                      this,
                                      "email_id"
                                    )}
                                  />
                                )}
                              </FormattedMessage>
                              {/* <input type="email" className="form-control log-input" name="email_id" id="email_id" placeholder="Email" value={this.state.fields["email_id"] || ""} onChange={this.handleChange.bind(this, "email_id")} /> */}
                              <span className="cRed">
                                {this.state.errors["email_id"]}
                              </span>
                            </div>
                            <div className="form-group">
                              <FormattedMessage id="Mobile Number">
                                {(placeholder) => (
                                  <input
                                    type="number"
                                    maxLength={12}  
                                    className="form-control log-input"
                                    id="phone"
                                    name="phone"
                                    value={this.state.fields["phone"] || ""}
                                    onChange={this.handleChange.bind(
                                      this,
                                      "phone"
                                    )}
                                    onKeyUp={this.checklength}
                                    placeholder={placeholder}
                                  />
                                )}
                              </FormattedMessage>
                              {/* <input type="number" className="form-control log-input" id="phone" name="phone" value={this.state.fields["phone"] || ""} onChange={this.handleChange.bind(this, "phone")} placeholder="Mobile Number" /> */}
                              <span className="cRed">
                                {this.state.errors["phone"]}
                              </span>
                            </div>

                            <a href="#">
                              <button
                                type="submit"
                                className="btn btn-default Next_btn"
                              >
                                {translate("Next")}
                              </button>
                            </a>


{/* //  <div class="next_login">
//                   <p>Or login with (recommended)</p>
//                   <div className="G_login">
//                     <a href="#"> <button type="button" ><img src="../images/patient/img/gmail.svg" />Login with Gmail</button></a>
//                   </div>
//                   <div className="fb_login">
//                     <a href="#"><button type="button" ><img src="../images/patient/img/facebook.svg" />Login with Facebook</button></a>
//                   </div>
//                 </div>

// <div className="row">
//                               <div className="col-md-6 ">
//                                 <Facebook />
//                               </div>
//                               <div className="col-md-6">
//                                 <GoogleBtn />
//                               </div>
//                             </div>
                              */}

                            




                          </form>
                        </div>
                      </div>

                      {/* <!-- code for otp --> */}

                      <div class="login_content" id="confirm_otp">
                        <div class="login_box">
                          <div class="login_head">
                            <h5>Please enter your confirmation code</h5>
                          </div>
                          <form>
                            <div class="form-group">
                              <input
                                type="text"
                                class="form-control log-input"
                                id="otp"
                                placeholder="Enter code"
                              />
                            </div>

                            <a href="#">
                              <button
                                type="button"
                                class="btn btn-default Next_btn"
                                onClick={this.otpvalidate}
                              >
                                Continue
                              </button>
                            </a>
                            <a href="#" onClick={this.resesndOTp}>
                              <p class="log_account">Resend OTP</p>
                            </a>
                          </form>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
          <PatientFooter />
        </I18nPropvider>
      </main>
    );
  }
}
