import React, { Component, useState } from "react";
import $ from "jquery";
import { ToastContainer, toast } from "react-toastify";
import { Redirect } from "react-router-dom";
import { Link } from "react-router-dom";
import Httpconfig from "../helpers/Httpconfig";
import Constant from "../../constants";
import { FormattedMessage, IntlProvider } from "react-intl"; // Backup Way to Convert
import { I18nPropvider, LOCALES } from "../../i18nProvider";
import translate from "../../i18nProvider/translate";
import Patnewcss from "../../public/css/patient/style-new.css";
import PatientHeader from "../patient/Patientheader";
import PatientFooter from "../patient/Patientfooter";
import { Dropdown } from "semantic-ui-react";
import { Multiselect } from "multiselect-react-dropdown";
import { reactLocalStorage } from "reactjs-localstorage";

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const moment = require("moment");

export default class AvailableDoctors extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fields: {},
      errors: {},
      files: [],
      langOptions: [],
      genderOptions: [],
      experienceOptions: [],
      specalities:[],
      modeOptions: [],
      ratingOptions: [],
      viewProfileOpen: false,
      viewAppointmentOpen: false,
      doc_data: [],
      selectedtime:"",
      sorting:"experience",
      problem:"Choose Specialist",
      processlater:"col-md-12 collapse-hide",
      specalitesClass:'select_d collapse-hide',
      sendNotification:"",
      
  };
    this.viewDocProfile = this.viewDocProfile.bind(this);
    this.bookDocAppointment = this.bookDocAppointment.bind(this);
    this.consultLater = this.consultLater.bind(this);

    this.consultNow = this.consultNow.bind(this);
    this.openMap = this.openMap.bind(this);
    this.onSortingChange=this.onSortingChange.bind(this);
    //this.handleSpecalityChange=this.handleSpecalityChange.bind(this);

  }

  componentDidUpdate = () => {
    var lang = localStorage.getItem("Language_selected");
    if (lang != null) {
      if (this.state.Language != lang) {
        this.state.Language = lang;
        console.log("notnull " + this.state.Language);
        this.forceUpdate();
      }
    } else {
      this.state.Language = "en-us";
      console.log(this.state.Language);
    }
    var sort=document.getElementsByClassName("specality");
    let selectedProblem="";
    for (let i = 0; i < sort.length; i++) {
      sort[i].addEventListener("click",function(event) {
     //sort[i].addEventListener("click", function(event) {
      // alert(event.currentTarget.id);
      // console.log(event.currentTarget.id);
     //alert(event.target.id);
     if(event.target.id!=""){
        selectedProblem=document.getElementById(event.currentTarget.id).innerText;
     }else{
      selectedProblem="Choose Specialist";
     }
     
     //alert($("#"+event.target.id).html());
       this.setState({
         specalities:[event.currentTarget.id],
         problem:selectedProblem
       })
       this.forceUpdate();
       this.onFilterChange();
     }.bind(this),true)
     
   }
 
   
  };

  // To get detais after first render
  componentDidMount = () => {
    window.addEventListener("popstate", function(e) 
    {   
        window.location.reload();
    });
    var specal=document.getElementsByClassName("spec");
    for (let i = 0; i < specal.length; i++) {
      specal[i].addEventListener("click", function(event) {
       // alert("in");
        this.onLoadSpecalities();
     }.bind(this))
     
   }
    var retrievedObject = localStorage.getItem("userObj");
    var patient_id=localStorage.getItem('SelectedPatientId');
    if (retrievedObject != null || retrievedObject != null) {
    let userData = JSON.parse(retrievedObject);
    var seletectePatient=localStorage.getItem('SelectedPatientId');
    this.state.clinicId=userData.clinic_id;
    //alert(this.state.clinicId);
    //this.state.clinicId=2;
    this.forceUpdate();
    if(patient_id!=null || patient_id!=""){
//      alert("in");
      userData.patient_id=patient_id;
    }
    if(seletectePatient){
      this.getPatientRelations(seletectePatient);
    }
    this.onLoadSpecalities();
    if (retrievedObject != null || retrievedObject != null) {
      this.setState({
        name: userData.name,
        user_mobile: userData.mobile_number,
        email_id: userData.email,
        token: userData.accessToken,
        patient_id: userData.patient_id,
        profile_image: "",
      });
      this.forceUpdate();
      /*get the doctor details */
      
    
      Httpconfig.httptokenpost(Constant.siteurl + "api/Doctor/DoctorIsavailablefilters",
      {
        "gender": this.state.genderOptions,
        "sortting": this.state.sorting,
        "experience": this.state.experienceOptions,
        "languages":this.state.langOptions,
        "specalities":this.state.specalities,
        "clinic_id":this.state.clinicId
      }
    ).then(

      //Httpconfig.httptokenget(Constant.siteurl + "api/Doctor/"+this.state.clinicId).then(
        (response) => {
          //console.log(response.data.data);
          this.setState({
            doc_data: response.data.data,
          });
        }
      );
      // console.log("Rakesh"+this.state.doc_data);
    } else {
      window.location.href = "/";
    }}else{
      window.location.href = "/";
    }
    this.onSortingChange();
    this.getLanuages();
    //this.onLoadSpecalities();
    const interval = setInterval(() => {
      let patientId="";
      var retrievedObject = localStorage.getItem("userObj");
      if(retrievedObject!=null){
      let userData = JSON.parse(retrievedObject);
       patientId=userData.patient_id;
      this.setState({
        patientId:userData.patient_id,
      })    
        
      if(patientId!=null){
        this.getNotifications(patientId);
      }
      }
       }, 10000); 
  };


  openMap = (lat,lang) => {
    window.open("https://maps.google.com?q="+lat+","+lang);
    
    // var lat="";
    // var lang="";
    // if(latlangs!=""){
    //   var str=latlangs;
    //   if(str.indexOf(',')!=-1){
    //   var coordinates=str.split(",");
    //   if(coordinates[0]!=""){
    //     lat=coordinates[0];
    //   }
    //   if(coordinates[1]!=""){
    //     lang=coordinates[1];
    //   }
    //   window.open("https://maps.google.com?q="+lat+","+lang+",_blank");
    //   }

    // }
    
  };


  getPatientRelations=(patientId)=>{ 
    Httpconfig.httptokenget(Constant.siteurl + "api/Patients/findpatientrealtives/"+patientId, {
    
    })
       .then((response) => { 
           /* Assiging consulation purpose to the state */
          let PatientName="";
           response.data.data.map((data, index) => (
            data.id==patientId ?
            data.gender.toLowerCase()=="male"? PatientName="Mr."+data.name : PatientName="Mrs."+data.name
             
             :""
             
          
          ))
         // alert(PatientName);
        //  alert(stateRelationsOptions[0].value);
          this.setState({
            PatientName:PatientName
          })
          

          
        })
       .catch((error) => {
          toast.error(error);
       });
}

  getUserSelectedDate = (value) => {
    let date = new Date(value);
    let selectedDate =
      date.getFullYear() +
      "-" +
      Number(date.getMonth() + 1) +
      "-" +
      date.getDate();
    
    // alert(
    //   date.getDate() +
    //     "/" +
    //     Number(date.getMonth() + 1) +
    //     "/" +
    //     date.getFullYear()
    // );
   
    ///console.log("selectedDate " + selectedDate);
    // this.setState({ start_date: selectedDate });
    // console.clear();
    // console.log(this.state.start_date);
    this.fetchUserSelectedSlots(selectedDate);
  };
  getLanuages=()=>{
    
    Httpconfig.httptokenget(Constant.siteurl +"api/Clinic/getClinicLanguages/"+this.state.clinicId,)
      .then((response) => {
        if (response.data.status == "200" && response.data.error == false) {
          //this.state.doc_data=response.data.data;
       //this.forceUpdate();
       const languages= response.data.data.map((lang,num)=>{ 
        //for(let count=0;count<specalitiesCount;count++){
          
          return (
            <label>
            <input
              id={lang.id}
              type="checkbox"
              name={lang.name}
              value={lang.id}
              onChange={this.onLanguageChange.bind(this)}
            />{" "}
            <span className="label-text">{translate(lang.name)}</span>
          </label>
          )
          
        })
        
        this.state.lanuagesList=languages;
       // alert(this.state.lanuagesList);
        this.forceUpdate();
        } 
      })
      .catch((error) => {
        toast.error(error);
      });
  }

  onLanguageChange = (event) => {

    var langArr = [...this.state.langOptions];
    const value = event.target.value;
    const index = langArr.findIndex((day) => day === value);
    if (index > -1) {
      langArr = [...langArr.slice(0, index), ...langArr.slice(index + 1)];
    } else {
      langArr.push(value);
    }
    this.state.langOptions = langArr;
    this.onFilterChange();
    console.clear();
    console.log("lang Options " + this.state.langOptions);
    
  };

  onGenderChange = (event) => {
    var genderArr = [...this.state.genderOptions];
    const value = event.target.value;
    const index = genderArr.findIndex((day) => day === value);
    if (index > -1) {
      genderArr = [...genderArr.slice(0, index), ...genderArr.slice(index + 1)];
    } else {
      genderArr.push(value);
    }
    this.state.genderOptions = genderArr;
    this.onFilterChange();
    console.log("gender Options " + this.state.genderOptions);
  };

  onExperienceChange = (event) => {
    var expArr = [...this.state.experienceOptions];
    const value = event.target.value;
    const index = expArr.findIndex((day) => day === value);
    if (index > -1) {
      expArr = [...expArr.slice(0, index), ...expArr.slice(index + 1)];
    } else {
      expArr.push(value);
    }
    this.state.experienceOptions = expArr;
    this.onFilterChange();
    console.log("Experience Options " + this.state.experienceOptions);
  };
  handlePay = (e) => {
    reactLocalStorage.setObject("DoctorSelected", e.target.id);
    setTimeout(
      () => this.props.history.push("/Patientconfirmappointment"),
      2000
    );
  };

  consultLaterPay = (event) => {
    let clickedId=event.currentTarget.id;
   // alert(clickedId);

    if(clickedId!=""){
      reactLocalStorage.setObject("DoctorSelected",clickedId);
      setTimeout(
        () => this.props.history.push("/Patientconfirmappointment"),
        2000
      );

    }
   
  };

  onFilterChange=()=>{
   // alert(this.state.specalities);
    Httpconfig.httptokenpost(
      Constant.siteurl +
        "api/Doctor/DoctorIsavailablefilters/",//+this.state.clinicId,
      {
        "gender": this.state.genderOptions,
        "sortting": this.state.sorting,
        "experience": this.state.experienceOptions,
        "languages":this.state.langOptions,
        "specalities":this.state.specalities,
        "rating":this.state.ratingOptions,
      }
    )
      .then((response) => {
        if (response.data.status == "200" && response.data.error == false) {
          this.state.doc_data=response.data.data;
       this.forceUpdate();
        } 
      })
      .catch((error) => {
        toast.error(error);
      });
  }

  onRatingChange = (event) => {
    var ratingArr = [...this.state.ratingOptions];
    const value = parseInt(event.target.value);
    const index = ratingArr.findIndex((day) => day === value);
    if (index > -1) {
      ratingArr = [...ratingArr.slice(0, index), ...ratingArr.slice(index + 1)];
    } else {
      ratingArr.push(value);
    }
    this.state.ratingOptions = ratingArr;
    this.onFilterChange();
    // console.log("Rating Options " + this.state.ratingOptions);
    // console.log(this.state);
  };
  onLoadSpecalities=()=>{
    
    Httpconfig.httptokenget(Constant.siteurl +"api/Category/2",)
      .then((response) => {
        if (response.data.status == "200" && response.data.error == false) {
         // let specalitiesList="";
          let specalitiesCount= Object.keys(response.data.data).length;
          
          if(specalitiesCount>0){
            const specalities= response.data.data.map((specalitiesData,num)=>{ 
            //for(let count=0;count<specalitiesCount;count++){
              let imgPath="";
              if(specalitiesData.category_image!=null){
               imgPath=Constant.imgurl+specalitiesData.category_image;
              }
              return (
               <React.Fragment>
                 {num==0 ?
                   <h3 class="clr_txt" onClick={this.clear}>Clear</h3> : ""}
              <div class="dropbar_content">
            
                {/* <div className="hlth_prb">
                  <h2>{translate('Common Health Problems')}</h2>
                  <h5>{translate('Select your specialist')}</h5>
                </div> */}
              <li onClick={this.handleSpecalityChange.bind(this,specalitiesData.id,specalitiesData.category)}>
                {/* class="specality" */}
                              <a   id={specalitiesData.id} >
                              {imgPath ? <img src={imgPath} /> : ""}
                                <p>{specalitiesData.category}</p>
                              </a>
                            </li>
                            </div>
                            </React.Fragment>
                            
              )
              
            })
           // this.state.specalitesClass='select_d collapse-show';
            this.state.specalitiesList=specalities;
            this.forceUpdate();
            
          }
        }
           
         
      })
      .catch((error) => {
        toast.error(error);
      });
  }
  handleSpecalityChange =(id,name)=>{
    
  //  alert(event.currentTarget.id);
     this.state.specalities=[id];//[event.currentTarget.id];
     this.state.specalitesClass='select_d collapse-hide';
     this.state.problem=name;
     this.onFilterChange();
     this.forceUpdate();
    
  }
  onModeChange = (event) => {
    var modeArr = [...this.state.modeOptions];
    const value = event.target.value;
    const index = modeArr.findIndex((day) => day === value);
    if (index > -1) {
      modeArr = [...modeArr.slice(0, index), ...modeArr.slice(index + 1)];
    } else {
      modeArr.push(value);
    }
    this.state.modeOptions = modeArr;
    console.clear();
    console.log("Mode Options " + this.state.modeOptions);
  };

  onSortingChange=()=>{
   // alert(event.currentTarget.value);
    // var sort=document.getElementById("dd");
    // sort.addEventListener("change", function(event) {

    //   alert(this.innerText);
    // //  alert(event.currentTarget.value);
    // });
    let i=0;
    let selected="";
    var sort=document.getElementsByClassName("sort");
         for (i = 0; i < sort.length; i++) {
          sort[i].addEventListener("click", function(event) {
          
            this.setState({
              sorting:event.target.id,
            })
            this.onFilterChange();
          }.bind(this))
          
        }
       
        
  }


  onUserClearall = (event) => {
    var clearAll = document.getElementsByTagName("input");
    for (var i = 0; i < clearAll.length; i++) {
      if (clearAll[i].type == "checkbox") {
        clearAll[i].checked = false;
      }
    }
    this.state.langOptions = [];
    this.state.genderOptions = [];
    this.state.experienceOptions = [];
    this.state.modeOptions = [];
    this.state.ratingOptions = [];
    this.state.sorting = [];
    this.state.specalities = [];
    this.state.problem="Choose Specialist";
    console.clear();
    console.log(this.state);
    this.onFilterChange();
  };
  handleLanguage = (langValue) => {
    this.setState({ Language: langValue });
  };
  viewDocProfile = (e) => {
    if (this.state.viewProfileOpen != e.target.id) {
      this.setState({
        viewProfileOpen: e.target.id,
      });
    } else {
      this.setState({
        viewProfileOpen: "",
      });
    }
  };
  bookDocAppointment = (e) => {
    if (this.state.viewAppointmentOpen != e.target.id) {
      localStorage.removeItem("seletedSlot_time")
      $('.timings').removeClass('highlet_button');
      this.setState({
        viewAppointmentOpen: e.target.id,
      });
    } else {
      this.setState({
        viewAppointmentOpen: "",
      });
    }
  };
  getNotifications=(patientId)=>{

    Httpconfig.httptokenget(Constant.siteurl +"api/PatientAppointment/getPatientConsultNowAppointments/"+patientId,)
    .then((response) => {
      
      if(response.data.status=="200" && response.data.error==false){
        if(response.data.data.length>0){
          for(let count=0;count<response.data.data.length;count++){
            if(response.data.data[count].status==2 ||response.data.data[count].status==3 ){
              var dateTime=response.data.data[count].appointment_date+" "+response.data.data[count].appointment_time;
              var mindiff=(moment().diff(dateTime, 'minutes'));
             // alert(mindiff);
              if(mindiff < 7){ 
                if (this.state.sendNotification != response.data.data[count]['doctor_id']) {
                  this.setState({
                    sendNotification: response.data.data[count]['doctor_id'],
                    showSlots: "",
                    docConfirmed: response.data.data[count]['doctor_id'],
                    sendNotification: "",
                  });
                  this.forceUpdate();
                }else{
                  this.setState({
                  sendNotification: "",
                  docConfirmed: "",
                  })
                  this.forceUpdate();
                }
                }
            }
          }
        }
          
      }

    })
    .catch((error) => {
      toast.error(error);
    });
    
   }
  checkRequestStatus=(id)=>{
    localStorage.removeItem("seletedSlot_time");
    $('.timings').removeClass('highlet_button');
    let doctorName="";
    let doctorId = id;
    var retrievedObject = localStorage.getItem("userObj");
    let appointmentId = localStorage.getItem("appointmentId");
    var patient_id=localStorage.getItem('SelectedPatientId');
    let userData = JSON.parse(retrievedObject);
    let masterPatientId=userData.patient_id;

    if(patient_id!=null || patient_id!=""){
      //alert("in");
      userData.patient_id=patient_id;
   }
    let PatientName = this.state.PatientName;////userData.name;
    let PatientId = userData.patient_id;
    let consultationTime = moment().format("HH:mm");
    //let consultationTime = moment().add(5, "minutes").format("HH:mm:ss");
    let consultationDateTime = moment().format("YYYY-MM-DD");

    //alert(id);
   // alert(this.state.sendNotification);
    //alert(doctorId);
    if (this.state.sendNotification != doctorId) {
      this.setState({
        sendNotification: doctorId,
        showSlots: "",
      });
//alert("calling");
      Httpconfig.httptokenpost(
        Constant.siteurl +
          "api/PatientAppointment/ConsultNowDoctorConfirmation/",
        {
          doctor_id: doctorId,
          doctor_name: doctorName,
          patient_id: PatientId,
          master_patient_id:masterPatientId,
          patient_age: "",
          patient_name: PatientName,
          appointment_id: parseInt(appointmentId),
          appointment_time: consultationTime,
          appointment_date: consultationDateTime,
        }
      )
        .then((response) => {
          if (response.data.status == "200" && response.data.error == false) {
            // toast.warn("Hi Doctor, you status as changed to Unavailable", {
            //     position: "bottom-center",
            //   });
           // alert("response.data.requestStatus"+response.data.requestStatus);
            if (response.data.requestStatus == 2 || response.data.requestStatus == 3) {
              this.setState({
                docConfirmed: doctorId,
                sendNotification: "",
              });
              this.forceUpdate();
            }
            toast.success(response.data.message, {
              position: "top-center",
            });
          } else {
            // toast.warn("Sorry we cannot update the Availibility status at this moment", {
            //     position: "bottom-center",
            //   });
          }
        })
        .catch((error) => {
          toast.error(error);
        });
      // setTimeout(() => this.setState({
      //   docConfirmed: doctorId,
      //   sendNotification:"",
      // }), 2000);
    } else {
      this.setState({
        sendNotification: "",
        docConfirmed: "",
      });
    }

  }
  consultNow = (e) => {
    let id = e.target.id;
    localStorage.removeItem("seletedSlot_time");
    $('.timings').removeClass('highlet_button');
    let doctordata = id.split("-");
    let doctorName = doctordata[1];
    let doctorId = doctordata[0];
    var retrievedObject = localStorage.getItem("userObj");
    let appointmentId = localStorage.getItem("appointmentId");
    var patient_id=localStorage.getItem('SelectedPatientId');
    let userData = JSON.parse(retrievedObject);
    let masterPatientId=userData.patient_id;

    if(patient_id!=null || patient_id!=""){
      //alert("in");
      userData.patient_id=patient_id;
   }
    let PatientName = this.state.PatientName;////userData.name;
    let PatientId = userData.patient_id;
    let consultationTime = moment().format("HH:mm");
    //let consultationTime = moment().add(5, "minutes").format("HH:mm:ss");
    let consultationDateTime = moment().format("YYYY-MM-DD");

    //alert(id);
    if (this.state.sendNotification != doctorId) {
      this.setState({
        sendNotification: doctorId,
        showSlots: "",
      });

      Httpconfig.httptokenpost(
        Constant.siteurl +
          "api/PatientAppointment/ConsultNowDoctorConfirmation/",
        {
          doctor_id: doctorId,
          doctor_name: doctorName,
          patient_id: PatientId,
          master_patient_id:masterPatientId,
          patient_age: "",
          patient_name: PatientName,
          appointment_id: parseInt(appointmentId),
          appointment_time: consultationTime,
          appointment_date: consultationDateTime,
        }
      )
        .then((response) => {
          if (response.data.status == "200" && response.data.error == false) {
            // toast.warn("Hi Doctor, you status as changed to Unavailable", {
            //     position: "bottom-center",
            //   });
            if (response.data.requestStatus == 2 || response.data.requestStatus == 3) {
              this.setState({
                docConfirmed: doctorId,
                sendNotification: "",
              });
            }
            // toast.success(response.data.message, {
            //   position: "top-center",
            // });
          } else {
            // toast.warn("Sorry we cannot update the Availibility status at this moment", {
            //     position: "bottom-center",
            //   });
          }
        })
        .catch((error) => {
         // toast.error(error);
        });
      // setTimeout(() => this.setState({
      //   docConfirmed: doctorId,
      //   sendNotification:"",
      // }), 2000);
    } else {
      this.setState({
        sendNotification: "",
        docConfirmed: "",
      });
    }
  };
  consultLater = (e) => {

    localStorage.removeItem("seletedSlot_time");
    $('.timings').removeClass('highlet_button');
    if (this.state.showSlots != e.target.id) {
      
      this.setState({
        showSlots: e.target.id,
        sendNotification: "",
        docConfirmed: "",
      });
    } else {
      this.setState({
        showSlots: "",
      });
    }
  };
  goBack = () => {
    window.location.href = "/Patientmedicalhistory";
  };

  fetchUserSelectedSlots(selectedDate) {
    
    let doctorId=this.state.showSlots;
    Httpconfig.httptokenpost(
      Constant.siteurl + "api/telemedicine/patientAppointmentSlots",
      {
        doctor_id: doctorId,
        consultation_date: selectedDate,
        module_type: "telemedicine-app",
      }
    ).then((response) => {
      if (response.status == 200) {
        console.clear();
        console.log(response);
        let resultCount=Object.keys( response.data.result).length;
        let slotsCount=Object.keys( response.data.result).length;
         // return false;
          if(resultCount>0){
        const morningSlots = response.data.result[0];
        const afternoonSlots = response.data.result[1];
        const eveningSlots = response.data.result[2];
        const nightSlots = response.data.result[3];
        $('#'+doctorId).addClass('collapse-show');


        this.setState({
          morningSlotsLabel: morningSlots.Label,
          morningSlots: morningSlots.time_slots,
          afternoonLabel: afternoonSlots.Label,
          afternoonSlots: afternoonSlots.time_slots,
          eveningSlotsLabel: eveningSlots.Label,
          eveningSlots: eveningSlots.time_slots,
          nightSlotsLabel: nightSlots.Label,
          nightSlots: nightSlots.time_slots,
          slotsCount:slotsCount,
        });
        var i=0;
        var time=document.getElementsByClassName("timings");
         for (i = 0; i < time.length; i++) {
          time[i].addEventListener("click", function(event) {
          var selelcedT=this.innerHTML;
          
         // this.state.selectedtime=selelcedT;=
         let sTime=moment(selelcedT,["h:mm A"]).format('HH:mm:ss');
        // alert(sTime);
         let seldate=selectedDate+" "+sTime;
         
         let seletedSlot_time= moment(seldate,["YYYY-MM-DD HH:mm A"]).format('YYYY-MM-DD HH:mm:ss');
        // alert(seletedSlot_time);return
        //  selectedDate+" "+selelcedT
         reactLocalStorage.setObject("seletedSlot_time", seletedSlot_time);
        // alert(selectedDate);
         var lang = localStorage.getItem("seletedSlot_time");
         // alert(selelcedT);
          $('.timings').removeClass('highlet_button');
          $(this).addClass('highlet_button');
          
            });
          }
   
      }else{
        toast.error("Slots not Available");
        //alert("No Solts Available");
        this.setState({
          morningSlotsLabel: "",
          morningSlots: "",
          afternoonLabel: "",
          afternoonSlots: "",
          eveningSlotsLabel: "",
          eveningSlots: "",
          nightSlotsLabel: "",
          nightSlots: "",
          slotsCount:"",
        });
        this.forceUpdate();
      }
    }
    });
  
  }
  // show the dropdown list of specalistes
  showList=()=>{
    this.state.specalitesClass='select_d collapse-show';
  }
  clear=()=>{
    this.state.specalitesClass='select_d collapse-hide';
    this.state.specalities="";
    this.state.problem="Choose Specialist";
    this.onFilterChange();
  }


  render() {
    const {
      fields,
      errors,
      files,
      langOptions,
      genderOptions,
      experienceOptions,
      modeOptions,
      ratingOptions,
      viewProfileOpen,
      viewAppointmentOpen,
    } = this.state;

    var currentDate = new Date();
    var numberOfDaysToAdd = 45;
    const daysHighlighted = new Array(numberOfDaysToAdd).fill(currentDate);

    var slotsMorningArray = [];
    var slotsNoonArray = [];
    var slotsEveningArray = [];
    var slotsNightArray = [];
    var morningArr = this.state.morningSlots;
    var afternoonArr = this.state.afternoonSlots;
    var eveningArr = this.state.eveningSlots;
    var nightArr = this.state.nightSlots;

    if (morningArr) {
      var nightLength = morningArr.length;
      var mrng = "";
      mrng += '<div class="sch_time">';
      for (var i = 0; i < nightLength; i++) {
        if(i==0){
          mrng += '<h3>Morning</h3>';
        }
        mrng += "<p class='timings'>" + morningArr[i] + "</p>";
      }
      mrng += "</div>";
      slotsMorningArray=mrng;
      //slotsMorningArray.push(mrng);
      this.state.processlater="col-md-12 collapse-show";
      
    }

    if (afternoonArr) { 
      var noonLength = afternoonArr.length;
      var noon = "";
      noon += '<div class="sch_time">';
      for (var i = 0; i < noonLength; i++) {
        if(i==0){
          noon += '<h3>After noon</h3>';
        }
        noon += "<p class='timings'>" + afternoonArr[i] + "</p>";
      }
      noon += "</div>";
      slotsNoonArray=noon;
      //slotsNoonArray.push(noon);
      this.state.processlater="col-md-12 collapse-show";
    }

    if (eveningArr) {
      var evngLength = eveningArr.length;
      var evng = "";
      evng += '<div class="sch_time">';
      for (var i = 0; i < evngLength; i++) {
        if(i==0){
          evng += '<h3>Evening</h3>';
        }
        evng += "<p class='timings'>" +eveningArr[i] + "</p>";
      }
      evng += "</div>";
      slotsEveningArray=evng;
     // slotsEveningArray.push(evng);
     this.state.processlater="col-md-12 collapse-show";
    }

    if (nightArr) {
      var nightLength = nightArr.length;
      var night = "";
      night += '<div class="sch_time">';
      for (var i = 0; i < nightLength; i++) {
        if(i==0){
          night += '<h3>Night</h3>';
        }
        night += "<p class='timings'>" + nightArr[i] + "</p>";
      }
      night += "</div>";
      slotsNightArray=night;
      //slotsNightArray.push(night);
      this.state.processlater="col-md-12 collapse-show";
    }

    return (
      <main id="main">
        <PatientHeader onSelectLanguage={this.handleLanguage} />
        <I18nPropvider locale={this.state.Language}>
          <section id="availavle_doc">
            <div className="container">
              <div className="row av_box">
                <div className="col-lg-6 col-md-12 col-sm-12">
                  <div className="available_heading">
                    <h4>
                      <img
                        src="../images/patient/img/Doctors_List/View Profile/Back.svg"
                        onClick={this.goBack}
                      />
                      {translate("Patient Details")}
                    </h4>
                    <h2>{translate("Patient Intake Process")}</h2>
                  </div>
                </div>
                <div className="col-lg-6 col-md-12 col-sm-12">
                  <div className="row available_sort">
                    <div className="col-md-6 no_padding">
                      <div className="wrap-select">
                        <div id="dd" className="wrapper-dropdown-3" >
                          <span class="choose_txt">{translate("Sorting")} 
                         
                          </span>
                          <div class="drop_img"><img  src="../images/patient/img/Homepage/Dropdown.svg" /></div>
                          <ul className="dropdown" > 
                            <li >
                              <a href="#"  class="sort"  id="rating">
                                <input type="radio" value="rating"  />
                                {translate('Rating')}
                              </a>
                            </li>
                            <li>
                              <a href="#" class="sort" id="low to high">
                                <input type="radio" value="low to high"  />
                                {translate('Price - Low to high')}
                              </a>
                            </li>
                            <li>
                              <a href="#" class="sort" id="high to low">
                                <input type="radio" value="high to low" />
                                {translate('Price - High to low')}
                              </a>
                            </li>
                            <li>
                              <a href="#" class="sort" id="experience">
                                <input type="radio" value="experience"/>
                                {translate('Experience')}
                              </a>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-6 no_padding">
                    <div class="doc_spc">
                    <div class="drop_sec">
                    {/* <span>{translate(this.state.problem)}</span> */}
                  
                    <div id="dd2" className="wrapper-dropdown-3 spec" >
                    <div class="choose_txt" onClick={this.showList}>{translate(this.state.problem)}
                    <div class="drop_img"><img  src="../images/patient/img/Homepage/Dropdown.svg" /></div>
                    </div>
                   
                            <div class={this.state.specalitesClass}>{this.state.specalitiesList ? this.state.specalitiesList :""} 
                         
                            </div>
                          
                   
                    </div>
                    </div>
                      <div className="wrap-select">
                      
                        {/* <div id="dd2" className="wrapper-dropdown-3 spec" onClick={this.onLoadSpecalities}> */}
                         
                          {/* <ul className="dropdown doc_spc">
                            <div className="hlth_prb">
                              <h2>{translate('Common Health Problems')}</h2>
                              <h5>{translate('Select your specialist')}</h5>
                            </div> */}
                             
                             {/* <li>
                              <a href="#">
                                <img
                                  src="../images/patient/img/Doctors_List/View Profile/ambulance.svg" //onClick={this.handleSortingChange }
                                />
                                <p>Weight Issue</p>
                              </a>
                            </li> */}
                           {/* <li>
                              <a href="#">
                                <img src="../images/patient/img/Doctors_List/View Profile/syringe.svg" />
                                <p>Cold & cough</p>
                              </a>
                            </li>
                            <li>
                              <a href="#">
                                <img src="../images/patient/img/Doctors_List/View Profile/medicine.svg" />
                                <p>Weight Issue</p>
                              </a>
                            </li>
                            <li>
                              <a href="#">
                                <img src="../images/patient/img/Doctors_List/View Profile/ambulance.svg" />
                                <p>Weight Issue</p>
                              </a>
                            </li>
                            <li>
                              <a href="#">
                                <img src="../images/patient/img/Doctors_List/View Profile/syringe.svg" />
                                <p>Cold & cough</p>
                              </a>
                            </li>
                            <li>
                              <a href="#">
                                <img src="../images/patient/img/Doctors_List/View Profile/medicine.svg" />
                                <p>Weight Issue</p>
                              </a>
                            </li>
                            <li>
                              <a href="#">
                                <img src="../images/patient/img/Doctors_List/View Profile/ambulance.svg" />
                                <p>Weight Issue</p>
                              </a>
                            </li>
                            <li>
                              <a href="#">
                                <img src="../images/patient/img/Doctors_List/View Profile/syringe.svg" />
                                <p>Cold & cough</p>
                              </a>
                            </li>
                            <li>
                              <a href="#">
                                <img src="../images/patient/img/Doctors_List/View Profile/medicine.svg" />
                                <p>Weight Issue</p>
                              </a>
                            </li>
                            <li>
                              <a href="#">
                                <img src="../images/patient/img/Doctors_List/View Profile/syringe.svg" />
                                <p>Cold & cough</p>
                              </a>
                            </li> */}
                          {/* </ul> */}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="available_section">
                <div className="row">
                  <div className="col-lg-3 col-md-12 col-sm-12">
                    <div className="sort_box">
                      <h2>{translate("Filters")}</h2>
                      <a href="#" onClick={this.onUserClearall.bind(this)}>
                        <p>{translate("Clear all")}</p>
                      </a>

                      <div>
                        {/* <h5>{translate("Languages")}</h5> */}
                        
                        {/* <div className="form-check"> */}
                        {/* {this.state.lanuagesList} */}
                          {/*<label>
                             <input
                              type="checkbox"
                              name="English"
                              value="English"
                              onChange={this.onLanguageChange.bind(this)}
                            />{" "}
                            <span className="label-text">English</span>
                          </label>
                          <label>
                            <input
                              type="checkbox"
                              name="Japaneese"
                              value="Japaneese"
                              onChange={this.onLanguageChange.bind(this)}
                            />{" "}
                            <span className="label-text">Japaneese</span>
                          </label>
                          <label>
                            <input
                              type="checkbox"
                              name="Hindi"
                              value="Hindi"
                              onChange={this.onLanguageChange.bind(this)}
                            />{" "}
                            <span className="label-text">Hindi</span>
                          </label>
                          <label>
                            <input
                              type="checkbox"
                              name="Spanish"
                              value="Spanish"
                              onChange={this.onLanguageChange.bind(this)}
                            />{" "}
                            <span className="label-text">Spanish</span>
                          </label> */}
                        {/* </div> */}
                      </div>
                      <div>
                        <h5>{translate("Gender")}</h5>
                        <div className="form-check">
                          <label>
                            <input
                              type="checkbox"
                              name="gender"
                              value="Male"
                              onChange={this.onGenderChange.bind(this)}
                            />{" "}
                            <span className="label-text">{translate("Male")}</span>
                          </label>
                          <label>
                            <input
                              type="checkbox"
                              name="gender"
                              value="Female"
                              onChange={this.onGenderChange.bind(this)}
                            />{" "}
                            <span className="label-text">{translate("Female")}</span>
                          </label>
                        </div>
                      </div>

                      <div>
                        <h5>{translate("Experience")}</h5>
                        <div className="form-check">
                          <label>
                            <input
                              type="checkbox"
                              name="experience"
                              value="1-4"
                              onChange={this.onExperienceChange.bind(this)}
                            />{" "}
                            <span className="label-text">1 to 4 {translate("years")}</span>
                          </label>
                          <label>
                            <input
                              type="checkbox"
                              name="experience"
                              value="4-8"
                              onChange={this.onExperienceChange.bind(this)}
                            />{" "}
                            <span className="label-text">4 to 8 {translate("years")}</span>
                          </label>
                          <label>
                            <input
                              type="checkbox"
                              name="experience"
                              value="8-12"
                              onChange={this.onExperienceChange.bind(this)}
                            />{" "}
                            <span className="label-text">8 to 12 {translate("years")}</span>
                          </label>
                          <label>
                            <input
                              type="checkbox"
                              name="experience"
                              value="12-16"
                              onChange={this.onExperienceChange.bind(this)}
                            />{" "}
                            <span className="label-text">12 to 16 {translate("years")}</span>
                          </label>
                          <label>
                            <input
                              type="checkbox"
                              name="experience"
                              value="16-18"
                              onChange={this.onExperienceChange.bind(this)}
                            />{" "}
                            <span className="label-text">16 to 18 {translate("years")}</span>
                          </label>
                          <label>
                            <input
                              type="checkbox"
                              name="experience"
                              value="18 >"
                              onChange={this.onExperienceChange.bind(this)}
                            />{" "}
                            <span className="label-text">{translate("Above")} 18 {translate("years")}</span>
                          </label>
                        </div>
                      </div>
                      {/*
        <div>
        <h5>{translate("Mode")}</h5>
        <div className="form-check">
        <label>
        <input
        type="checkbox"
        name="mode"
        value="video"
        onChange={this.onModeChange.bind(this)}
        />{" "}
        <span className="label-text">Video</span>
        </label>
        <label>
        <input
        type="checkbox"
        name="mode"
        value="audio"
        onChange={this.onModeChange.bind(this)}
        />{" "}
        <span className="label-text">Audio</span>
        </label>
        </div>
        </div>
      */}
                      {/* <div>
                        <h5>{translate("Ratings")}</h5>
                        <div className="form-check">
                          <label>
                            <input
                              type="checkbox"
                              name="rating"
                              value="5"
                              onChange={this.onRatingChange.bind(this)}
                            />
                            <span className="label-text">
                              <img src="../images/patient/img/Doctors_List/Filters/Rating_color.svg" />
                            </span>
                            <span className="label-text">
                              <img src="../images/patient/img/Doctors_List/Filters/Rating_color.svg" />
                            </span>
                            <span className="label-text">
                              <img src="../images/patient/img/Doctors_List/Filters/Rating_color.svg" />
                            </span>
                            <span className="label-text">
                              <img src="../images/patient/img/Doctors_List/Filters/Rating_color.svg" />
                            </span>
                            <span className="label-text">
                              <img src="../images/patient/img/Doctors_List/Filters/Rating_color.svg" />
                            </span>
                          </label>
                          <label>
                            <input
                              type="checkbox"
                              name="rating"
                              value="4"
                              onChange={this.onRatingChange.bind(this)}
                            />
                            <span className="label-text">
                              <img src="../images/patient/img/Doctors_List/Filters/Rating_color.svg" />
                            </span>
                            <span className="label-text">
                              <img src="../images/patient/img/Doctors_List/Filters/Rating_color.svg" />
                            </span>
                            <span className="label-text">
                              <img src="../images/patient/img/Doctors_List/Filters/Rating_color.svg" />
                            </span>
                            <span className="label-text">
                              <img src="../images/patient/img/Doctors_List/Filters/Rating_color.svg" />
                            </span>
                            <span className="label-text">
                              <img src="../images/patient/img/Doctors_List/Filters/rating_grey.svg" />
                            </span>
                          </label>
                          <label>
                            <input
                              type="checkbox"
                              name="rating"
                              value="3"
                              onChange={this.onRatingChange.bind(this)}
                            />
                            <span className="label-text">
                              <img src="../images/patient/img/Doctors_List/Filters/Rating_color.svg" />
                            </span>
                            <span className="label-text">
                              <img src="../images/patient/img/Doctors_List/Filters/Rating_color.svg" />
                            </span>
                            <span className="label-text">
                              <img src="../images/patient/img/Doctors_List/Filters/Rating_color.svg" />
                            </span>
                            <span className="label-text">
                              <img src="../images/patient/img/Doctors_List/Filters/rating_grey.svg" />
                            </span>
                            <span className="label-text">
                              <img src="../images/patient/img/Doctors_List/Filters/rating_grey.svg" />
                            </span>
                          </label>
                          <label>
                            <input
                              type="checkbox"
                              name="rating"
                              value="2"
                              onChange={this.onRatingChange.bind(this)}
                            />
                            <span className="label-text">
                              <img src="../images/patient/img/Doctors_List/Filters/Rating_color.svg" />
                            </span>
                            <span className="label-text">
                              <img src="../images/patient/img/Doctors_List/Filters/Rating_color.svg" />
                            </span>
                            <span className="label-text">
                              <img src="../images/patient/img/Doctors_List/Filters/rating_grey.svg" />
                            </span>
                            <span className="label-text">
                              <img src="../images/patient/img/Doctors_List/Filters/rating_grey.svg" />
                            </span>
                            <span className="label-text">
                              <img src="../images/patient/img/Doctors_List/Filters/rating_grey.svg" />
                            </span>
                          </label>
                          <label>
                            <input
                              type="checkbox"
                              name="rating"
                              value="1"
                              onChange={this.onRatingChange.bind(this)}
                            />
                            <span className="label-text">
                              <img src="../images/patient/img/Doctors_List/Filters/Rating_color.svg" />
                            </span>
                            <span className="label-text">
                              <img src="../images/patient/img/Doctors_List/Filters/rating_grey.svg" />
                            </span>
                            <span className="label-text">
                              <img src="../images/patient/img/Doctors_List/Filters/rating_grey.svg" />
                            </span>
                            <span className="label-text">
                              <img src="../images/patient/img/Doctors_List/Filters/rating_grey.svg" />
                            </span>
                            <span className="label-text">
                              <img src="../images/patient/img/Doctors_List/Filters/rating_grey.svg" />
                            </span>
                          </label>
                        </div>
                      </div> */}
                    </div>
                  </div>

                  <div className="col-lg-9 col-md-12 col-sm-12">
                    {this.state.doc_data.map((doctor) => (
                      <div className="doc_box">
                        <div className="row">
                          <div className="col-md-2 col-sm-12">
                            <div className="doc_img">
                            {doctor.gender=="Male" ? (
                              <img
                                src={
                                  doctor.profile_pic != ""
                                    ? Constant.imgurl+doctor.profile_pic
                                    : "../images/patient/img/Profile/Male_doctor.svg"
                                }
                              /> ) : (
                                <img
                                src={
                                  doctor.profile_pic != ""
                                    ? Constant.imgurl+doctor.profile_pic
                                    : "../images/patient/img/Profile/Female_doctor.svg"
                                }
                              />

                              ) }
                              {doctor.is_available == 1 ? (
                                <p className="online">
                                  <img src="../images/patient/img/Profile/available.svg" />
                                </p>
                              ) : (
                                <p className="online">
                                  <img src="../images/patient/img/Profile/busy.svg" />
                                </p>
                              )}
                              {doctor.is_available == 1 ? (
                                <h5 class="doc_available">
                                  {translate("Doctor is Available now")}
                                </h5>
                              ) : (
                                <h5 class="doc_busy">
                                  {translate("Doctor is busy now")}
                                </h5>
                              )}
                            </div>
                          </div>

                          <div className="col-md-5 col-sm-12">
                            <div className="doc_info">
                              <h2>
                                Dr.{" "}
                                {doctor.doctor_name.charAt(0).toUpperCase() +
                                  doctor.doctor_name.slice(1)}
                              </h2>
                              <h5>
                                 {doctor.education},{doctor.speciality_name}
                              </h5>
                              <h5>{doctor.experience} {translate("years experience")}</h5>
                              <p>
                                {/* <span>
                                  <img src="../images/patient/img/Doctors_List/View Profile/1.svg" />
                                  80%
                                </span>
                                <span>
                                  <img src="../images/patient/img/Doctors_List/Filters/Rating_color.svg" />
                                  250 {translate("reviews")}
                                </span> */}
                                <span>{doctor.currency_symbol}{doctor.fees}</span>
                              </p>
                            </div>
                          </div>

                          <div className="col-md-5 col-sm-12">
                            <div className="doc_directions">
                            
                            {doctor.clinic_tbl ?
                            doctor.clinic_tbl.clinic_logo==null ?<img src="./images/patient/img/Profile/hospital.svg" />:<img src={Constant.imgurl+doctor.clinic_tbl.clinic_logo} /> 
                            :<img src="./images/patient/img/Profile/hospital.svg" />
                              
                            }
                            {doctor.clinic_tbl ?
                              <h5>{doctor.clinic_tbl.clinic_name}</h5>
                              :""
                            }
                              <h5>
                              
                                {doctor.address}
                              </h5>
                              {doctor.clinic_tbl ?
                              <p id={doctor.lat_long} onClick={this.openMap.bind(this,doctor.clinic_tbl.latitude!=null ? doctor.clinic_tbl.latitude :"" ,doctor.clinic_tbl.longitude!=null ? doctor.clinic_tbl.longitude : "")}>
                              
                                <img
                                  className="loc_img"
                                  id={doctor.lat_long}
                                  src="../images/patient/img/Doctors_List/Directions.svg"
                                />{" "}
                                {translate("Directions")}
                              </p>
                              :""}
                            </div>
                          </div>
                        </div>
                        <div className="row">
                          <div className="col-md-12">
                            <div className="acc_view">
                              <a
                                className="btn profile_btn"
                                //href="#"
                                id={doctor.id}
                                role="button"
                                aria-expanded="false"
                                aria-controls="viewprofilecollapse"
                                // onClick={function () {
                                //   this.setState({
                                //     viewProfileOpen: !this.state.viewProfileOpen,
                                //   });
                                // }.bind(this)}
                                onClick={this.viewDocProfile}
                              >
                                {translate("View Profile")}
                              </a>
                              <a
                                className="btn appoint_btn"
                                // data-toggle="collapse"
                                //href="#"
                                role="button"
                                id={doctor.id}
                                // onClick={function () {
                                //   this.setState({
                                //     viewAppointmentOpen: !this.state
                                //       .viewAppointmentOpen,
                                //   });
                                // }.bind(this)}
                                onClick={this.bookDocAppointment}
                              >
                                {translate("Book an Appointment")}
                              </a>
                            </div>
                            <div className="row">
                              <div className="col acc_box">
                                {/* Collapse 1 Starts here */}
                                <div
                                  className={
                                    this.state.viewProfileOpen == doctor.id
                                      ? "multi-collapse in"
                                      : "collapse multi-collapse"
                                  }
                                  id={"viewprofilecollapse_" + doctor.id}
                                >
                                  <div className="card card-body">
                                    <div className="panel">
                                      <h4>
                                        <img src="../images/patient/img/Doctors_List/View Profile/View Profile.svg" />{" "}
                                        {translate("View Profile")}
                                      </h4>
                                      <div className="row">
                                        <div className="col-md-6 col-sm-6 doc_set">
                                          <div className="doc_details">
                                            <img src="../images/patient/img/Doctors_List/View Profile/Registration_no.svg" />
                                          </div>
                                          <div className="doc_nums">
                                            <p>
                                              {translate("Registration No")}
                                            </p>
                                            <h5>{doctor.registraion_no}</h5>
                                          </div>
                                        </div>
                                        <div className="col-md-6 col-sm-6 doc_set">
                                          <div className="doc_details">
                                            <img src="../images/patient/img/Doctors_List/View Profile/Fees.svg" />
                                          </div>
                                          <div className="doc_nums">
                                            <p>{translate("Fees")}</p>
                                            <h5>{doctor.currency_symbol} {doctor.fees}</h5>
                                          </div>
                                        </div>
                                      </div>
                                      <div className="row">
                                        <div className="col-md-6 col-sm-6 doc_set">
                                          <div className="doc_details">
                                            <img src="../images/patient/img/Doctors_List/View Profile/Education.svg" />
                                          </div>
                                          <div className="doc_nums">
                                            <p>{translate("Education")}</p>
                                            <h5>{doctor.education}</h5>
                                          </div>
                                        </div>
                                        <div className="col-md-6 col-sm-6 doc_set">
                                          <div className="doc_details">
                                            <img src="../images/patient/img/Doctors_List/View Profile/Can_speak.svg" />
                                          </div>
                                          <div className="doc_nums">
                                            <p>{translate("I can speak")}</p>
                                            <h5>{doctor.languages}</h5>
                                          </div>
                                        </div>
                                      </div>
                                      <div className="row">
                                        <div className="col-md-6 col-sm-6 doc_set">
                                          <div className="doc_details">
                                            <img src="../images/patient/img/Doctors_List/View Profile/Practise.svg" />
                                          </div>
                                          <div className="doc_nums">
                                            <p>{translate("Practice")}</p>
                                            <h5>{doctor.practice}</h5>
                                          </div>
                                        </div>
                                        {/* <div className="col-md-6 col-sm-6 doc_set">
                                          <div className="doc_details">
                                            <img src="../images/patient/img/Doctors_List/View Profile/Feedback.svg" />
                                          </div>
                                          <div className="doc_nums">
                                            <p>{translate("Feedback")}</p>
                                            <h5>
                                              {" "}
                                              <span>
                                                <img src="../images/patient/img/Doctors_List/View Profile/1.svg" />
                                                80%
                                              </span>
                                              <span>
                                                <img src="../images/patient/img/Doctors_List/Filters/Rating_color.svg" />
                                                250 reviews
                                              </span>
                                            </h5>
                                          </div>
                                        </div> */}
                                      </div>
                                      <div className="row">
                                        <div className="col-md-6 col-sm-6 doc_set">
                                          <div className="doc_details">
                                            <img src="../images/patient/img/Doctors_List/View Profile/My_Area_of_expertise.svg" />
                                          </div>
                                          <div className="doc_nums">
                                            <p>
                                              {translate(
                                                "My Area of expertise"
                                              )}
                                            </p>
                                            <h5>{doctor.speciality_name}</h5>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                {/* Collapse 1 Ends here */}
                                {/* Multi Collapse Starts */}
                                <div
                                  //   className="collapse multi-collapse"
                                  //   id="multiCollapseExample2"
                                  className={
                                    this.state.viewAppointmentOpen == doctor.id
                                      ? "multi-collapse in"
                                      : "collapse multi-collapse"
                                  }
                                  id={"viewAppointmentOpen" + doctor.id}
                                >
                                  <div className="card card-body">
                                    <div className="panel">
                                      <div className="doc_book">
                                        <div className="row doc_row">
                                          <div className="col-md-3">
                                            <h3>
                                              {translate(
                                                "When do you want to consult a doctor"
                                              )}
                                              ?
                                            </h3>
                                          </div>
                                          <div className="col-md-9">
                                          {doctor.is_available==1 ?
                                            <a
                                             // href="#"
                                              id={
                                                doctor.id +
                                                "-" +
                                                doctor.doctor_name
                                              }
                                              onClick={this.consultNow}
                                            >
                                              <p
                                                className="consult_btn"
                                                id={
                                                  doctor.id +
                                                  "-" +
                                                  doctor.doctor_name
                                                }
                                              >
                                                {translate("Consult now")}
                                              </p>
                                            </a> : ""
                                            }
                                            { doctor.is_available ? <h5 className="or_btn">Or</h5> : ""}
                                            <a
                                             // href="#"
                                              onClick={this.consultLater}
                                            >
                                              <p
                                                className="consult_btn"
                                                id={doctor.id}
                                              >
                                                {translate("Consult later")}
                                              </p>
                                            </a>
                                          </div>
                                        </div>

                                        <div
                                          className={
                                            this.state.sendNotification ==
                                            doctor.id
                                              ? "row doc_row collapse-show"
                                              : "row doc_row collapse-hide"
                                          }
                                        >
                                          <div className="doc_lt ">
                                            <img
                                              className="doc_confirm_img"
                                              src="../images/patient/img/Doctors_List/View Profile/Doctor_confirmation.svg"
                                            />
                                          </div>
                                          <div className="doc_txt ">
                                            <h2 className="doc_confirm">
                                              {translate(
                                                "Please wait for doctor confirmation"
                                              )}
                                            </h2>
                                            <p className="short_txt">
                                              {translate(
                                                "Doctor will confirm shortly"
                                              )}
                                            </p>
                                          </div>
                                        </div>

                                        <div
                                          className={
                                            this.state.docConfirmed == doctor.id
                                              ? "row doc_row collapse-show"
                                              : "row doc_row collapse-hide"
                                          }
                                        >
                                          <div className="col-md-6 col-sm-6">
                                            <h2 className="doc_confirm">
                                              {translate("Doctor confirmed")}
                                            </h2>
                                            <p className="short_txt">
                                              {translate(
                                                "Please proceed to pay for the consultation"
                                              )}
                                            </p>
                                          </div>
                                          <div className="col-md-6 col-sm-6">
                                            <a >
                                              {" "}
                                              <button
                                                className="pay_now"
                                                id={doctor.id}
                                                onClick={this.handlePay}
                                              >
                                                {translate("Proceed")}
                                              </button>
                                            </a>
                                          </div>
                                        </div>
                                      </div>

                                      <div
                                        id={doctor.id}
                                        className={
                                          this.state.showSlots == doctor.id
                                            ? "doc_calendar collapse-show"
                                            : "doc_calendar collapse-hide"
                                        }
                                      >
                                        <h2 className="sch_appoint">
                                          <img src="../images/patient/img/Doctors_List/View Profile/Schedule_appointment.svg" />{" "}
                                          {translate(
                                            "Schedule your appointment"
                                          )}
                                        </h2>
                                        <div class="row">
                                          <div class="col-lg-6 col-md-6">
                                            <div className="wrapper">
                                              <DatePicker
                                                name="start_date"
                                                autoComplete="off"
                                                id={doctor.id}
                                                className="dateInput"
                                                placeholderText="Start Date"
                                                selected={this.state.start_date}
                                                onChange={
                                                  this.getUserSelectedDate
                                                }
                                                dateFormat="d-MM-yyyy"
                                                highlightDates={[
                                                  {
                                                    "react-datepicker__day--highlighted": new Array(
                                                      numberOfDaysToAdd
                                                    )
                                                      .fill()
                                                      .map((_, i) => {
                                                        const d = new Date();
                                                        d.setDate(
                                                          d.getDate() + i
                                                        );
                                                        return d;
                                                      }),
                                                  },
                                                ]}
                                                inline
                                                calendarIcon
                                                minDate={new Date()}
                                                maxDate={moment().add(
                                                  5,
                                                  "days"
                                                )}
                                              />
                                            </div>
                                          </div>
                                          <div class="col-lg-6 col-md-6">
                                          
                                         
                                          {/* <div dangerouslySetInnerHTML={__html: getSlots()} /> */}
                                          {/* <div className="sch_time"><h3>{translate("Morning")}</h3></div> */}
                                          <div dangerouslySetInnerHTML={{ __html: slotsMorningArray }} />
                                        
                                          {/* <div className="sch_time"><h3>{translate("Afternoon")}</h3></div> */}
                                          <div dangerouslySetInnerHTML={{ __html: slotsNoonArray }} />
                                        
                                          {/* <div className="sch_time"><h3>{translate("Evening")}</h3></div> */}
                                          <div dangerouslySetInnerHTML={{ __html: slotsEveningArray }} />
                                        
                                          {/* <div className="sch_time"></div> */}
                                          <div dangerouslySetInnerHTML={{ __html: slotsNightArray }} />

                                          

                                            {/* <div className="sch_time"><h3>{translate("Morning")}</h3></div><div className="sch_time"><h3>{translate("Afternoon")}</h3></div><div className="sch_time"><h3>{translate("Evening")}</h3><p>04:15 PM</p><p>04:30 PM</p><p>04:45 PM</p><p>05:00 PM</p><p>05:15 PM</p><p>05:30 PM</p><p>05:45 PM</p><p>06:00 PM</p><p>06:15 PM</p><p>06:30 PM</p><p>06:45 PM</p><p>07:00 PM</p><p>07:15 PM</p></div><div className="sch_time"><h3>{translate("Night")}</h3><p>08:00 PM</p><p>08:15 PM</p><p>08:30 PM</p><p>08:45 PM</p><p>09:00 PM</p><p>09:15 PM</p><p>09:30 PM</p><p>09:45 PM</p><p>10:00 PM</p><p>10:15 PM</p><p>10:30 PM</p><p>10:45 PM</p><p>11:00 PM</p><p>11:15 PM</p></div> */}
                                            
                                          </div>
                                          
                                          <div className={this.state.processlater}>
                                            <div className="next_btn text-right ">
                                              <button
                                                type="submit"
                                                onClick={this.consultLaterPay}
                                                id={doctor.id }
                                                className="btn btn-default Next_btn_profile prof_btn"
                                              >
                                                {translate("Proceed")}
                                              </button>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>{" "}
                                {/* Multi Collapse 2 Ends */}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </section>

          <ToastContainer />
          <PatientFooter />
        </I18nPropvider>
      </main>
    );
  }
}
