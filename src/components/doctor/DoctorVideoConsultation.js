import React, { Component, useState } from "react";
import { Slider } from "react-semantic-ui-range";

import $ from "jquery";
import { ToastContainer, toast } from "react-toastify";
import { Redirect } from "react-router-dom";
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
import VideoConference from "../../VideoConference";
import { reactLocalStorage } from "reactjs-localstorage";
import { Animated } from "react-animated-css";
import { Multiselect } from "multiselect-react-dropdown";
import { Form, Button, Dropdown, Grid, Header } from "semantic-ui-react";
import FileBase645 from "react-file-base64";
import ReactDOM from "react-dom";
const moment = require("moment");

//const imgurl = "http://3.7.234.106:8100";

export default class DoctorVideoConsultation extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fields: {},
      default:{},
      errors: {},
      files: [],
      doctorData: [],
      showtxt: "collapse-hide",
      showdata: "collapse-show",
      showHistorydata: "collapse-show",
      showHistorytxt: "collapse-hide",
      showDrugdata: "collapse-show",
      showDrugtxt: "collapse-hide",
      showCurrentMedicationdata: "collapse-show",
      showCurrentMedicationtxt: "collapse-hide",
      selectedDrugList: {},
      drugAllergiesOptions: [],
      drugAllergiesArray: [],
      diagnosticsArray: [],
      selectedMedicineList: {},
      selectedMedicineValue: [],
      pageNumber: 1,
      drugChange: false,
      medicineChange: false,
      historyChange: false,
      medicineChange: false,
      drugChange: false,
      diagnosticsOptions: [],
      selectedDrugList: {},
      diagnosticsArray: [],
      stateOptions: [],
      frequencyData: [],
      dosageData: [],
      medicinesSelected: [],
      symptomsShow: "add_pat_section collapse-show",
      showprescription: "prescription collapse-hide",
      medicineselectedId: "",
      selectedRouteId: "",
      symptomsOptions: [],
      patientMedicinesArray: [],
      medPlaceHolder: "Select Medicine",
      stateFrequency: "",
      morning: "",
      day: "",
      night: "",
      food: "",
      next_appointment_datetime: "",
      stateFinalDiagnosis: "",
      otherfrequency: "",
      handleOtherFrequencyData: "",
      selectedDiagnosticsList: "",
      shownextbuttons:"epresc_btm_btns collapse-show",
      symptoms_section:"active",
      prescription_section:"",
      todayTelemedicinePatientCount:"0",
      selectedSymptomsList:"",
 
    };

    this.problem = this.problem.bind(this);
    this.updateProblem = this.updateProblem.bind(this);
    this.pastMedicalHistoryedit = this.pastMedicalHistoryedit.bind(this);
    this.createPatientSymptoms = this.createPatientSymptoms.bind(this);
    this.getMedicinedetails = this.getMedicinedetails.bind(this);
    this.saveAdvice = this.saveAdvice.bind(this);
    this.handleAdviceChange = this.handleAdviceChange.bind(this);
    this.pop = this.pop.bind(this);
    this.finalDiagnosis = this.finalDiagnosis.bind(this);
    this.endConsulationGeneratePDF = this.endConsulationGeneratePDF.bind(this);
    this.savePulse = this.savePulse.bind(this);
    this.saveTemparature = this.saveTemparature.bind(this);
    this.saveRespiratory = this.saveRespiratory.bind(this);
    
    this.saveBloodPressure = this.saveBloodPressure.bind(this);
    this.saveHeight = this.saveHeight.bind(this);
    this.saveWeight = this.saveWeight.bind(this);
    this.saveBloodSugar = this.saveBloodSugar.bind(this);
    
    // this.currentMedication=this.currentMedication.bind(this);
  }

  saveBloodSugar = () => {
    
    this.bsPop();
    Httpconfig.httptokenput(Constant.siteurl + "api/VitalInformation/"+this.state.patientId +"/" +this.state.appointmentId,
      {
        blood_sugar: this.state.fields.bloodsugar,
      }
    ).then((response) => {
      if ((response.data.status = 200)) {
            toast.success("👌" + response.data.message, {
        });
      }
      });
  }
  bsPop() {
    var bsPopup = document.getElementById("bstog_Popup");
    bsPopup.classList.toggle("show");
  }



  saveWeight = () => {
    
    this.wtPop();
    Httpconfig.httptokenput(Constant.siteurl + "api/VitalInformation/"+this.state.patientId +"/" +this.state.appointmentId,
      {
        weight: this.state.fields.weight,
        bmi: this.state.fields.weight,
      }
    ).then((response) => {
      if ((response.data.status = 200)) {
            toast.success("👌" + response.data.message, {
        });
      }
      });
  }
  wtPop() {
    var wtPopup = document.getElementById("wttog_Popup");
    wtPopup.classList.toggle("show");
  }

  saveHeight = () => {
    this.htPop();
    if(this.state.fields["inHeight"]!="" && this.state.fields["ftHeight"] !=""){
      let weight="";
      if(this.state.fields.weight){
        weight=this.state.fields.weight;
      }else{
        weight=this.state.weight;
      }
      
    let feetInchesMerge = this.state.fields["ftHeight"] + "." + this.state.fields["inHeight"];
    //alert(feetInchesMerge);
      let height = feetInchesMerge / 0.032808;
      //alert(height);
      let bmiHeight = Math.round(height);
      //alert(bmiHeight);
      this.state.fields.height = bmiHeight;
      let heightConver = bmiHeight / 100;
      
      let weightconver = weight;
      let bmi = heightConver * weightconver;
      bmi = weightconver / bmi;
      bmi = bmi.toFixed(1);
      // console.log(ftHeight + " ftHeight ");
      // console.log(inHeight + " inHeight ");
      this.state.bmi = bmi;
      this.forceUpdate();
      
    }
    Httpconfig.httptokenput(Constant.siteurl + "api/VitalInformation/"+this.state.patientId +"/" +this.state.appointmentId,
      {
        height: this.state.fields.height,
        bmi: this.state.bmi,//this.state.fields.weight,
      }
    ).then((response) => {
      if ((response.data.status = 200)) {



        
            toast.success("👌" + response.data.message, {
        });
      }
    });
  }
  htPop() {
    var htPopup = document.getElementById("httog_Popup");
    htPopup.classList.toggle("show");
  }



  saveBloodPressure = () => {
  //  console.clear();
  //  console.log("BloodPressure Value "+this.state.fields.respiratoryrate);
  //alert(this.state.fields.respiratoryrate);
    this.bpPop();
    Httpconfig.httptokenput(Constant.siteurl + "api/VitalInformation/"+this.state.patientId +"/" +this.state.appointmentId,
      {
        blood_pressure_systolic: this.state.fields.diastolic,
        blood_pressure_diastolic: this.state.fields.systolic
      }
    ).then((response) => {
      if ((response.data.status = 200)) {
            toast.success("👌" + response.data.message, {
        });
      }
      });
  }
  bpPop() {
    var bpPopup = document.getElementById("bptog_Popup");
    bpPopup.classList.toggle("show");
  }
  
  saveRespiratory = () => {
  //  console.clear();
 //   console.log("Respiratory Value "+this.state.fields.respiratoryrate);
    //this.tempPop();
    
    Httpconfig.httptokenput(Constant.siteurl + "api/VitalInformation/"+this.state.patientId +"/" +this.state.appointmentId,
      {
        respiratory_rate: this.state.fields.respiratoryrate
      }
    ).then((response) => {
      if ((response.data.status = 200)) {
            toast.success("👌" + response.data.message, {
        });
        $('#resptog_Popup').removeClass('show');
      }
      });
  }
  respPop() {
    var respPopup = document.getElementById("resptog_Popup");
    respPopup.classList.toggle("show");
  }

  saveTemparature = () => {
    
    this.tempPop();
    Httpconfig.httptokenput(Constant.siteurl + "api/VitalInformation/"+this.state.patientId +"/" +this.state.appointmentId,
      {
        temperature: this.state.fields.temparature
      }
    ).then((response) => {
      if ((response.data.status = 200)) {
            toast.success("👌" + response.data.message, {
        });
      }
      });
  }
  tempPop() {
    var tempPopup = document.getElementById("temptog_Popup");
    tempPopup.classList.toggle("show");
  }


  savePulse = () => {
    
    this.pop();
    Httpconfig.httptokenput(Constant.siteurl + "api/VitalInformation/"+this.state.patientId +"/" +this.state.appointmentId,
      {
        pulse_rate: this.state.fields.pulse
      }
    ).then((response) => {
      if ((response.data.status = 200)) {
            toast.success("👌" + response.data.message, {
        });
      }
      });
  }
  popupCancel =(event)=>{
    let id=event.currentTarget.id;
    let popupId=id.split("_");
    //alert(popupId[0]+"_"+popupId[1]); 
    $('#'+popupId[0]+"_"+popupId[1]).removeClass('show');
    let defaultstate=popupId[2]+"_default";
    //tog_Popup_revert
    //this.state.fields["pulse"]
    //alert(this.state.default['pulse_default']);
   // alert(popupId[2]);
      //console.log(this.state.default);
    if(popupId[2]=='bp'){
      this.state.fields['systolic']=this.state.default['systolic_default'];
      this.state.fields['diastolic']=this.state.default["diastolic_default"];  

    }
    if(popupId[2]=='Height'){
      this.state.fields['ftHeight']=this.state.default['ftHeight_defalult'];
      this.state.fields['inHeight']=this.state.default["inHeight_default"]; 
      this.state.fields['height']=this.state.default.height;

    }
    this.state.fields[popupId[2]]=this.state.default[popupId[2]+"_default"];
    this.forceUpdate();
    //$('#'+popupId[0]+"_demo").val(this.state.default[popupId[2]+"_default"]);
    //   alert(this.state.default.defaultstate);
    // console.log(this.state.default);
    // alert();
    // alert(this.state.fields[popupId[2]]);
    // //$('#'+popupId[0]+"_demo").val(this.this.state.fields[popupId[2]]);
    //temptog_demo
    


  }


  endConsulationGeneratePDF = () => {
    //alert("in");
    Httpconfig.httptokenget(
      Constant.siteurl +
        "api/PatientAppointment/PatientPrescriptiongen/" +
        this.state.appointmentId +
        "/" +
        this.state.patientId
    )
      //Httpconfig.httptokenget(Constant.siteurl + "api/PatientAppointment/PatientPrescriptiongen/"+JSON.parse(this.state.appointmentId)+"/"+JSON.parse(this.state.patient_id), {})
      .then((response) => {
        //  alert(response);
        if ((response.data.status = 200)) {
        //  alert(imgurl + response.data.pdfURL);
          toast.success("👌" + response.data.message, {
            //  position: "bottom-center"
          });
          const interval = setInterval(() => {
          window.location.href = "./Doctordashboard";
        }, 10000); 
        }
      })
      .catch((error) => {
        toast.error(error);
      });
  };

  // Callback~
  getFiless = (files) => {
    // alert("in");
    // var file = $('#file-upload').attr("files")[0];
    // alert
    //alert(files);
    this.setState({ files: files });
    this.uploadDoctorPrescritpion();
    //  console.log(this.state.files);
    // console.log(this.state.files);
  };
  writePresc = () => {
    $("#upload_img_presc").attr("src", "");
    $(".preview_btn").attr("data-target", "#presc_prev_Modal");
    $("#add_med_section").show().delay(1000);
    $('loadPrescription').hide();
  };

  uploadDoctorPrescritpion = (event) => {
    
    // event.preventDefault();
    const { fields, errors } = this.state;
    // alert(this.state.files);

    let medicaldoc_pic = this.state.files;
    //console.log(medicaldoc_pic);
    //this

    let data = {
      patient_id: JSON.parse(this.state.patientId),
      status: 2,
      appointment_id: JSON.parse(this.state.appointmentId),
      medicaldoc_pic: this.state.files[0]["base64"],
    };
    //alert(medicaldoc_pic);
    let imagePath = $("#upload_img_presc").attr("src", this.state.base64);
    $(".preview_btn").attr("data-target", "#upload_presc_prev_Modal");
    
    
    Httpconfig.httptokenpost(
      Constant.siteurl + "api/PatientAppointment/uploadDoctorPrescription",
      {
        patient_id: JSON.parse(this.state.patientId),
        status: 2,
        appointment_id: JSON.parse(this.state.appointmentId),
        medicaldoc_pic: this.state.files[0]["base64"],
      }
    )
      .then((response) => {
        // alert("in");
        if (response.data.status == 200 && response.data.error == false) {
          //let uploadedImage='http://3.7.234.106:8100/uploads/patient/medicaldocument/1603478129823.png';
          let imagePath =Constant.imgurl + response.data.imagePath.replace("jpeg", "jpg");
          // alert(imagePath);
          $(".preview_btn").attr("data-target", "#upload_presc_prev_Modal");
          $("#upload_img_presc").attr("src", imagePath);
          alert("in");
          $("#add_med_section").hide().delay(1000);
          toast.success("👌" + response.data.message, {});
        }
      })
      .catch((error) => {
        toast.error(error);
      });
  };
  ImageClick = (event) => {
    var array = this.state.files;
    var foundValue = array.filter((obj) => obj.name != event.target.id);
    this.setState({ files: foundValue });
  };
  problem = (e) => {
    this.setState({
      showdata: "collapse-hide",
      showtxt: "collapse-show",
    });
  };
  updateProblem = () => {
    if (!this.state.problem) {
      toast.error("Problem should not be empty");
      return false;
    }

    // let patientId=7;
    let url_path = "api/problem/";
    Httpconfig.httptokenpost(Constant.siteurl + url_path, {
      patient_id: JSON.parse(this.state.patientId),
      problem: this.state.problem,
      appointmentId: JSON.parse(this.state.appointmentId),
      clinic_id:JSON.parse(this.state.clinicId),
    })
      .then((response) => {
        if ((response.data.status = 200)) {
          toast.success("👌" + response.data.message, {
            position: "bottom-center",
          });
          this.setState({
            showtxt: "collapse-hide",
            showdata: "collapse-show",
          });
        }
      })
      .catch((error) => {
        toast.error(error);
      });
  };

  switchVisible=()=> {
    if (document.getElementById('mail_front')) {

        if (document.getElementById('mail_front').style.display == 'none') {
            document.getElementById('mail_front').style.display = 'block';
            document.getElementById('mail_back').style.display = 'none';
        }
        else {
            document.getElementById('mail_front').style.display = 'none';
            document.getElementById('mail_back').style.display = 'block';
        }
    }
}

femaleswitch=()=>{
  
  if (document.getElementById('female_front')) {

      if (document.getElementById('female_front').style.display == 'none') {
          document.getElementById('female_front').style.display = 'block';
          document.getElementById('female_back').style.display = 'none';
      }
      else {
          document.getElementById('female_front').style.display = 'none';
          document.getElementById('female_back').style.display = 'block';
      }
  }
}

  /* past medical history */
  pastMedicalHistoryedit = (e) => {
    this.setState({
      showHistorydata: "collapse-hide",
      showHistorytxt: "collapse-show",
    });
  };
  handleHistoryChange = (event) => {
    //alert(event.currentTarget.value);
    this.setState({
      pastHistoryName: event.currentTarget.value,
      historyChange: true,
    });
  };
  updatePastMedicalHistory = () => {
    if (!this.state.pastHistoryName) {
      toast.error("Past Medical history should not be empty");
      return false;
    }

    // let patientId=7;
    let url_path = "api/problem/";
    Httpconfig.httptokenpost(Constant.siteurl + url_path, {
      patient_id: this.state.patientId,
      problem: this.state.problem,
      appointmentId: this.state.appointmentId,
    })
      .then((response) => {
        if ((response.data.status = 200)) {
          toast.success("👌" + response.data.message, {
            position: "bottom-center",
          });
          this.setState({
            showtxt: "collapse-hide",
            showdata: "collapse-show",
          });
        }

        //setTimeout(() => this.props.history.push("/"+next_page), 2000);
      })
      .catch((error) => {
        toast.error(error);
      });
    //alert(this.state.problem);
  };
  handleChangeProblem = (event) => {
    //alert(event.currentTarget.value);
    this.setState({
      problem: event.currentTarget.value,
    });
  };

  pastDrugAllergiesedit = () => {
    this.setState({
      showDrugdata: "collapse-hide",
      showDrugtxt: "collapse-show",
    });
  };
  currentMedicationedit = () => {
    this.setState({
      showCurrentMedicationdata: "collapse-hide",
      showCurrentMedicationtxt: "collapse-show",
    });
  };

  componentWillMount = () => {
    var appointment = localStorage.getItem("DoctorSelectedConsultation");
    let appointmentId = JSON.parse(appointment);
    this.setState({
      meetingId: appointmentId,
    });
    // alert(this.state.meetingId);
  };
  componentDidUpdate = () => {
  var sort=document.getElementsByClassName("upload_img");
      for (let i = 0; i < sort.length; i++) {
       sort[i].addEventListener("click", function(event) {
       this.state.zoomimage=event.currentTarget.src;
       //alert(event.currentTarget.src);
       //$('#uploadedImg').prop('src',event.currentTarget.src);
      this.forceUpdate();
       
       }.bind(this))
       
     }
     var container = document.querySelector("#contentContainer");

     container.addEventListener("click", function (event) {
       var theThing = document.querySelector("#thing");
       // console.clear();
       // console.log(theThing);
       if (theThing) {
         if (
           theThing.clientWidth > 0 &&
           theThing.clientWidth != null &&
           theThing.clientHeight > 0 &&
           theThing.clientHeight != null
         ) {
           // console.log(theThing.clientWidth + ">> Client Width");
           // console.log(theThing.clientHeight + ">>  Client Height");
           var xPosition =
             event.clientX -
             container.getBoundingClientRect().left -
             theThing.clientWidth / 2;
           var yPosition =
             event.clientY -
             container.getBoundingClientRect().top -
             theThing.clientHeight / 2;
           theThing.style.left = xPosition + "px";
           theThing.style.top = yPosition + "px";
         }
       }
     });
 
     // Fetch Data after Click on it Starts
     // var batchList = document.getElementsByClassName("icdBodyCode");
     // for (let i = 0; i < batchList.length; i++) {
     //   console.log("Hai didupdate >> " + i);
     //   batchList[i].addEventListener("click", function (event) {
     //     alert("Hai");
     //     let data = document.getElementById(event.target.id);
     //     console.clear();
     //     console.log(data);
     //   });
     // }
 
     // Ends here
   
    }
    getDoctorDetails=(doctorId)=>{
      Httpconfig.httptokenget(Constant.siteurl + "api/Doctor/DoctorProfiler/"+JSON.parse(doctorId),)
      .then((responseData) => {
        

        if(responseData.data.status=="200" && responseData.data.error==false){
          let profile_pic="";
          if(responseData.data.data[0].profile_pic!=""){
           // alert(profile_pic);
            profile_pic= Constant.imgurl+responseData.data.data[0].profile_pic;
           // alert(profile_pic);
           }else{
             if(responseData.data.data[0].gender.toLowerCase()=="male"){
             profile_pic='../images/patient/img/Profile/Male_patient.svg';
             }else{
              profile_pic='../images/patient/img/Profile/Female_patient.svg';
             }
           }
           
          this.setState({
            signature_pic:responseData.data.data[0].signature_pic,
          })
         // alert(this.state.signature_pic);
        } 
      })
      .catch((error) => {
        toast.error(error);
      });
    }
  componentDidMount = () => {
    var appointmentId = localStorage.getItem("DoctorSelectedConsultation");
    var patientId = localStorage.getItem("DoctorSelectedPatientId");
    //alert(patientId);
    var DocuserObj = localStorage.getItem("DocuserObj");
    let userData = JSON.parse(DocuserObj);
    this.state.clinicId=userData.clinic_id;
    //this.state.clinicId=1;

    this.setState({
      patientId: JSON.parse(patientId),
      doctorName:
        userData.name.charAt(0).toUpperCase() + userData.name.slice(1),
      appointmentId: JSON.parse(appointmentId),
      doctorId: JSON.parse(userData.doctor_id),
    });
    this.state.appointmentId = JSON.parse(appointmentId);
    this.getTodayAppointment();
    this.fetchdrugdata();
    this.fetchmedicinedata(this.state.pageNumber);
    this.getPatientSavedHpiInfo(
      JSON.parse(patientId),
      JSON.parse(appointmentId)
    );
    this.fetchdignosticsdata();
    this.fetchroutedata();
    this.fetchSymptomsdata();
    this.getPatientSavedSymptomsInfo(
      JSON.parse(patientId),
      JSON.parse(appointmentId)
    );
    this.getMedicinedetails(JSON.parse(appointmentId));
    this.getAdvice();
    this.getFollowUp();
    this.getfinalDiagnosis();
    this.getsavedDiagnosis();
    this.getVitalsInfo(JSON.parse(patientId), JSON.parse(appointmentId));
    this.getDoctorDetails(userData.doctor_id);
    

    Httpconfig.httptokenpost(
      Constant.siteurl + "api/Patients/getMedicalDetails/",
      {
        appointment_id: JSON.parse(appointmentId),
        patient_id: JSON.parse(patientId),
      }
    )
      .then((response) => {
        if (response.data.status == "200" && response.data.error == false) {
          let currentMedication = "";
          let drugAllergies = "";
          let drugAllergiesArrays = [];
          let sympotms = "";
          let curretMedicineList = [];
          let patientMedicalDocument = [];
          let imagedata = [];
          
          let pastLength =
            response.data.data[0].patient_past_histories[0][
              "patient_current_medication"
            ].length;
            
          if (pastLength > 0) {
            for (var past = 0; past < pastLength; past++) {
              currentMedication =
                currentMedication +
                "," +
                response.data.data[0].patient_past_histories[0][
                  "patient_current_medication"
                ][past]["medicinename"];
            }
            curretMedicineList = response.data.data[0].patient_past_histories;
          }
          if(response.data.data[0].drug_allergies!=null){
          let drugAllergiesLength =response.data.data[0].drug_allergies.length;
          if (drugAllergiesLength > 0) {
            for (var past = 0; past < drugAllergiesLength; past++) {
              drugAllergies =
                drugAllergies +
                "," +
                response.data.data[0].drug_allergies[past]["medicinename"];
            }
           // drugAllergiesArrays = response.data.data[0].drug_allergies;
           // drugAllergiesArrays = response.data.data[0].patient_drug_allergies[0].medicinename;
            
          } 
        }
          
          //alert(currentMedication);
          // let drugAllergiesLength =
          //   response.data.data[0].patient_past_histories[0][
          //     "patient_drug_allergies"
          //   ].length;
          // if (drugAllergiesLength > 0) {
          //   for (var past = 0; past < drugAllergiesLength; past++) {
          //     drugAllergies =
          //       drugAllergies +
          //       "," +
          //       response.data.data[0].patient_past_histories[0][
          //         "patient_drug_allergies"
          //       ][past]["category"];
          //   }
          //   drugAllergiesArrays = response.data.data[0].patient_past_histories;
          // }
          // alert(drugAllergiesArray);
          if(Object.keys(response.data.data[0].symptoms_tbls).length>0){
          let symptomsLength =
            response.data.data[0].symptoms_tbls[0]["symptoms"].length;
          if (symptomsLength > 0) {
            for (var past = 0; past < symptomsLength; past++) {
              sympotms =
                sympotms +
                "," +
                response.data.data[0].symptoms_tbls[0]["symptoms"][past][
                  "category"
                ];
            }
          }
        }
        
          // let documentsLength=response.data.data[0].patient_past_histories.length;
          // if(documentsLength>0){
          //   for(var pastdoc=0;pastdoc<documentsLength;pastdoc++){

          //     patientMedicalDocument[pastdoc]=response.data.data[0].patient_past_histories[pastdoc]['patient_medical_document'][pastdoc]['imageData'];
          // //  alert(patientMedicalDocument);
          //   }
          // }
          let documentsLength =
            response.data.data[0].patient_past_histories.length;
          if (documentsLength > 0) {
            for (var pastdoc = 0; pastdoc < documentsLength; pastdoc++) {
              for (
                let doc = 0;
                doc <
                response.data.data[0].patient_past_histories[pastdoc][
                  "patient_medical_document"
                ].length;
                doc++
              ) {
                patientMedicalDocument[
                  doc
                ] = response.data.data[0].patient_past_histories[pastdoc][
                  "patient_medical_document"
                ][doc].replace("jpeg", "jpg");
                //  alert(patientMedicalDocument);
                imagedata[doc]='<div class="med_upload_box"><a href="#" class="thumbnail" data-toggle="modal" data-target="#lightbox"> <img class="upload_img" src='+Constant.imgurl+patientMedicalDocument[doc]+'><p>Health record '+(doc+1)+'</a></p></div>';
                // imagedata[doc] =
                //   '<div class="med_upload_box"><img src=' +
                //   imgurl +
                //   patientMedicalDocument[doc] +
                //   "></div>";
              }
            }
          }
          
          let patientAge = "";
          let chornicDiseases_list="";
          let relatedMedication="";
        //  let drugAllergies="";
          let symptoms="";
          let bloodPressureSystolic="";
          let bloodPressureDiastolic="";
          let height="";
          let weight="";
          let bmi="";
          let pulse_rate="";
          let respiratory_rate="";
          let skip_blood_pressure="";
          let temperature="";
          let problem="";
          let blood_sugar="";
          
         // alert(response.data.data[0].dob);
          if (response.data.data[0].dob != null) {
            let dob = response.data.data[0].dob.split("T");
            let age = dob[0];
            let ageYears = moment().diff(age, "years");
            let ageMonths = moment().diff(age, "months");
            let ageDays = moment().diff(age, "days");
            //let patientAge = "";
            if (ageYears > 0) {
              patientAge = ageYears + " Years";
            }
            if (ageMonths > 0 && patientAge=="") {
              patientAge = ageMonths + " Months";
            }
            if (ageDays && patientAge=="") {
              patientAge = ageDays + " Days";
            }
            //alert(patientAge);

          }
          
          if(response.data.data[0].chornic_diseases_list!=null){
            chornicDiseases_list=response.data.data[0].chornic_diseases_list;
          }
          if(response.data.data[0].related_medication!=null){
            relatedMedication=response.data.data[0].related_medication;
          }
          if(Object.keys(response.data.data[0].vital_informations).length>0){

            if(response.data.data[0].vital_informations[0].height!=""){
              var realFeet = ((response.data.data[0].vital_informations[0].height*0.393700) / 12);
              var feet = Math.floor(realFeet);
              var inches = Math.round((realFeet - feet) * 12);
              feet= feet+ "'," + inches + '"';
              response.data.data[0].vital_informations[0].height=feet;
            }
            

            bloodPressureSystolic=response.data.data[0].vital_informations[0].blood_pressure_systolic;
            bloodPressureDiastolic=response.data.data[0].vital_informations[0].blood_pressure_diastolic;
            height=response.data.data[0].vital_informations[0].height;
            weight=response.data.data[0].vital_informations[0].weight;
            bmi=response.data.data[0].vital_informations[0].bmi;
            pulse_rate=response.data.data[0].vital_informations[0].pulse_rate;
            respiratory_rate=response.data.data[0].vital_informations[0].respiratory_rate;
            blood_sugar= response.data.data[0].vital_informations[0].blood_sugar;
            temperature=response.data.data[0].vital_informations[0].temperature;
            
  
          }
          if(response.data.data[0].problem_tbls[0].problem!=null){
            problem=response.data.data[0].problem_tbls[0].problem;
          }
          this.setState({
            patientName:response.data.data[0].name.charAt(0).toUpperCase() +response.data.data[0].name.slice(1),
            gender: response.data.data[0].gender,
            dob: patientAge,
            profilePic: response.data.data[0].profile_pic,
            relation: "",
            chornicDiseases_list:chornicDiseases_list,
            relatedMedication:relatedMedication,
            pastHistoryName:response.data.data[0].patient_past_histories[0].past_history,
            loadedpastHistoryName: response.data.data[0].patient_past_histories[0].past_history,
          //  drugAllergiesArrays: drugAllergiesArrays,
            currentMedication: currentMedication,
            selectedMedicineList: curretMedicineList,
            symptoms: sympotms,
            temperature:  temperature,
            bmi: bmi,
            respiratory:respiratory_rate,
            pulse_rate: pulse_rate,
            bloodPressureSystolic:bloodPressureSystolic,
            bloodPressureDiastolic:bloodPressureDiastolic,
            height: height,
            weight: weight,
            patientDrugAllergies: drugAllergies,
            patientMedicalDocument: patientMedicalDocument,
            imagedata: imagedata,
            problem: problem,
            blood_sugar:blood_sugar,
          });
          // toast.warn("Hi Doctor, you status as changed to Unavailable", {
        } else {
          toast.warn(
            "Sorry we cannot update the Availibility status at this moment",
            {
              position: "bottom-center",
            }
          );
        }
      })
      .catch((error) => {
        toast.error(error);
      });
    this.setState({
      modal: true,
    });

    // var slider = document.getElementById("tog_myRange");
    // var output = document.getElementById("tog_demo");
    // output.innerHTML = slider.value;

    // slider.oninput = function() {
    // output.innerHTML = this.value;
    // }
    $("#thing").hide();
  };

  
  // Start
  attributeSymptomTag = (event) => {
    let attributeName = event.currentTarget.getAttribute("body_part");
    let attributeGender = event.currentTarget.getAttribute("gender");
    this.setState({ lower_leg: attributeName });
    // console.clear();
    // console.log(event);
    // console.log(event.currentTarget.getAttribute("body_part"));
    // alert(attributeName + " >> attributeName >>> Gender " + attributeGender);
    this.fetchSymptomsICDCodedata(attributeName, attributeGender);
  };
  // Ends

  fetchSymptomsICDCodedata(search_data, gender) {
    let url_path = "api/Symptoms/getSymptomsICDListBodyPart";
    Httpconfig.httptokenpost(Constant.siteurl + url_path, {
      search_data: search_data,
      gender: gender,
    }).then((response) => {
      if (response.data.status === 200) {
        this.setState({
          icd_code_data: response.data.result,
          lower_leg: "lower_leg collapse-show",
        });
        $("#thing").show();
      }
      this.forceUpdate();
     // console.log(response.data.result);
    });
  }

  // To get all the ResponderInfo
  getVitalsInfo(patientId, appointmentId) {
    // Testing Service Starts
    
    Httpconfig.httptokenget(
      Constant.siteurl +
        "api/VitalInformation/getVitals/" +
        patientId +
        "/" +
        appointmentId+"/2"//+this.state.clinicId
    )
      .then((response) => {
       // console.clear();
       // console.log(response);
        // return;
        // console.log(response.data.result[0].height);
        if (response.status == 200) {
         // alert(response.data.data[0].pulse_rate);
          let previousPage = response.data.previousPage["pageName"];
          let nextPage = response.data.nextPage["pageName"];
          let responseLog = response;
          this.state.previousPage = previousPage;
          this.state.nextPage = nextPage;


          if(response.data.data[0].height!=""){
            var realFeet = ((response.data.data[0].vital_informations[0].height*0.393700) / 12);
            var feet = Math.floor(realFeet);
            var inches = Math.round((realFeet - feet) * 12);
            feet= feet+ "'," + inches + '"';
            response.data.data[0].height=feet;
          }


          // let height = response.data.data[0].height;
          // var realFeet = (height * 0.3937) / 12;
          // var feet = Math.floor(realFeet);
          // var inches = Math.round((realFeet - feet) * 12);

          // console.log(feet+" feet ");
          // console.log(inches+" inches ");
          // return;

          //alert(responseLog.data.result[0].bmi);
          
          this.setState({
            fields: {
              height: responseLog.data.data[0].height,
              ftHeight: feet,
              inHeight: inches,
              skip_height: responseLog.data.data[0].skip_height,
              skip_weight: responseLog.data.data[0].skip_weight,
              skip_temparature: responseLog.data.data[0].skip_temparature,
              skip_pulse: responseLog.data.data[0].skip_pulse,
              skip_respiratoryrate:
                responseLog.data.data[0].skip_respiratoryrate,
              skip_systolic: responseLog.data.data[0].skip_blood_pressure,
              skip_bloodsugar: responseLog.data.data[0].skip_bloodsugar,
              weight: responseLog.data.data[0].weight,
              bmi: responseLog.data.data[0].bmi,
              temparature: responseLog.data.data[0].temperature,
              pulse: responseLog.data.data[0].pulse_rate,
              bloodsugar: responseLog.data.data[0].blood_sugar,
              respiratoryrate: responseLog.data.data[0].respiratory_rate,
              systolic: responseLog.data.data[0].blood_pressure_systolic,
              diastolic: responseLog.data.data[0].blood_pressure_diastolic,

              
              
            },
          });
          this.state.default.weight_default= responseLog.data.data[0].weight;
          this.state.default.bmi_default= responseLog.data.data[0].bmi;
          this.state.default.temparature_default= responseLog.data.data[0].temperature;
          this.state.default.pulse_default= responseLog.data.data[0].pulse_rate;
          this.state.default.bloodsugar_default= responseLog.data.data[0].blood_sugar;
          this.state.default.respiratoryrate_default= responseLog.data.data[0].respiratory_rate;
          this.state.default.systolic_default= responseLog.data.data[0].blood_pressure_systolic;
          this.state.default.diastolic_default= responseLog.data.data[0].blood_pressure_diastolic;
          this.state.default.ftHeight_default= feet;
          this.state.default.inHeight_default= inches;
          this.state.default.height= responseLog.data.data[0].height;
          this.forceUpdate();
          
        }
      })
      .catch((error) => {
        console.log(error);
      });
    // Ends here
   

    const ftHeight = this.state.fields.ftHeight;
    const inHeight = this.state.fields.inHeight;
    let feetInchesMerge = ftHeight + "." + inHeight;
    let height = feetInchesMerge / 0.032808;
    this.state.fields.height = height.toFixed(2);
  }

  pop() {
    var popup = document.getElementById("tog_Popup");
    popup.classList.toggle("show");
  }

  // To get all the MedicalInfo
  getPatientSavedHpiInfo(patientId, appointmentId) {
    
    Httpconfig.httptokenget(
      Constant.siteurl + "api/hpi/" + patientId + "/" + appointmentId+"/2"
    )
      .then((response) => {

        if (response.status == 200) {
          let drugAllergiesArrays="";
          let responseLog = response;
          let patientCurrentMedication =
            response.data.data[0].patient_current_medication;
          let pastHistory = response.data.data[0].past_history;
          let medicalDocument = response.data.data[0].patient_medical_document;
          let patientDrugAllergies ="";
            //response.data.data[0].patient_drug_allergies;
          let drugAllergies="";
        //  console.log(patientCurrentMedication);
          let allergyMedicineNames = "";
          // patientDrugAllergies.map((allergymedicinedetails) => {
          //   allergyMedicineNames =
          //     allergyMedicineNames + "," + allergymedicinedetails.medicinename;
          // });
          let currentMedicineNames = "";
          patientCurrentMedication.map((currentmedicinedetails) => {
            currentMedicineNames =
              currentMedicineNames + "," + currentmedicinedetails.medicinename;
          });
          // alert(medicineNames);
          // alert(currentMedicineNames);
 if(response.data.data[0].patient_drug_allergies!=null){
          let drugAllergiesLength =response.data.data[0].patient_drug_allergies.length;
          //alert(drugAllergiesLength);
          if (drugAllergiesLength > 0) {
            for (var past = 0; past < drugAllergiesLength; past++) {
            //  alert(response.data.data[0].patient_drug_allergies[past]["medicinename"]);
              drugAllergies =
                drugAllergies +
                "," +
                response.data.data[0].patient_drug_allergies[past]["medicinename"];
            }
            
            drugAllergiesArrays = response.data.data[0].patient_drug_allergies;
            allergyMedicineNames = drugAllergies;//response.data.data[0].patient_drug_allergies[0].medicinename;
            
          } 
        }


          this.setState({
            fields: {
              past_medical_history: pastHistory,
            },
            loadedMedicineValue: patientCurrentMedication,
            loadedDrugValue: patientDrugAllergies,
            selectedMedicineValue: patientCurrentMedication,
            selectedDrugValue: patientDrugAllergies,
            patientDrugAllergiesNames: allergyMedicineNames,
            currentMedication: currentMedicineNames,
            drugAllergiesArrays:drugAllergiesArrays,
          });
          this.forceUpdate();
          // console.clear();
          // console.log(this.state.selectedMedicineList);
          // console.log(Constant.siteurl + medicalDocument);
          // return;
          if (Object.keys(response.data.data).length == 0) {
            let previousPage = response.data.previousPage["pageName"];
            let nextPage = response.data.nextPage["pageName"];
  
            this.setState({
              previousPage: previousPage,
              nextPage: nextPage,
            });
          }
        }
      })
      .catch((error) => {
       // console.log(error);
      });
  }

  handleScroll = (e) => {
    const bottom =
      Number((e.target.scrollHeight - e.target.scrollTop).toFixed(0)) -
        e.target.clientHeight <
      50;
    let page = this.state.page;
    if (bottom) {
      let page = this.state.pageNumber;
      this.setState({ pageNumber: page + 1 });
      this.fetchmedicinedata(this.state.pageNumber);
    }
  };
  fetchmedicinedata(pageNumber) {
    Httpconfig.httptokenget(
      //Constant.siteurl + "api/Healthosmedicine/" + pageNumber
      Constant.siteurl + "api/productMaster/" + pageNumber
      
    ).then((response) => {
      // console.clear();
      let finalLoadedData = response.data.data;
      let medicinesListData ="";
      let currentDataArray = this.state.medicineOptions;
      if (pageNumber > 1) {
        finalLoadedData = currentDataArray.concat(finalLoadedData);
      }
      if(finalLoadedData){
       medicinesListData = finalLoadedData.map((data, index) => ({
        key: data.id,
        text: data.medicinename,
        value: data.medicineid,
      }));
    }
      this.setState({
        medicineOptions: finalLoadedData,
        medicineArray: finalLoadedData,
        medicinesListOptions: medicinesListData,
      });
      // console.log(finalLoadedData.length);
    });
  }

  fetchdrugdata() {
    // Httpconfig.httptokenget(Constant.siteurl + "api/Healthosmedicine/1").then((response) => {
    Httpconfig.httptokenget(
      Constant.siteurl + "api/productMaster/"
      //Constant.siteurl + "api/Category?category_type=Drug%20Type"
    ).then((response) => {
      this.setState({
        drugAllergiesOptions: response.data.data,
        drugAllergiesArray: response.data.data,
      });
    });
  }
  fetchroutedata() {
    // Httpconfig.httptokenget(Constant.siteurl + "api/Healthosmedicine/1").then((response) => {
    let frequency = "";
    Httpconfig.httptokenget(
      Constant.siteurl + "api/PatientAppointment/getRouteDetails"
    ).then((response) => {
     // console.log(response);
      //return;

      let defaultRoutesData = "";

      let stateOptionsData = response.data.data.route.map((data, index) => ({
        key: data.id,
        text: data.medicine_type_name,
        value: data.category_id,
      }));

      this.setState({
        routesOptions: response.data.data.route,
        routesArray: response.data.data.route,
        stateOptions: stateOptionsData,
        defaultRoutesData: defaultRoutesData,
        frequencyData: response.data.data.frequency,
        dosageData: response.data.data.dosage,
      });
    });
  }

  fetchdignosticsdata() {
    // Httpconfig.httptokenget(Constant.siteurl + "api/Healthosmedicine/1").then((response) => {
    Httpconfig.httptokenget(
      Constant.siteurl + "api/PatientAppointment/diagnostics/1"
    ).then((response) => {
      this.setState({
        diagnosticsOptions: response.data.data,
        diagnosticsArray: response.data.data,
      });
      // alert("in");
      console.log(this.state.diagnosticsOptions);
    });
  }

  getMedicinedetails = (appointmentId) => {
    // alert(this.state.appointmentId);
    Httpconfig.httptokenget(
      Constant.siteurl +
        "api/PatientAppointment/PatientMedicineList/" +
        appointmentId
    ).then((response) => {
      //&& response.error==false
      if (response.status == 200) {
        // alert('Pin');
        this.setState({
          patientMedicinesArray: response.data.data,
        });
      }
      // alert(this.state.patientMedicinesArray.length);
      // console.clear();
      //console.log(this.state.patientMedicinesArray);
    });
  };

  handleChange = (field, event) => {
    //   alert(field);
    let fields = this.state.fields;
    fields[field] = event.target.value;
    this.setState({ fields });
  };
  // For Drug Allergies Select
  onDrugMedicineSelect = (selectedDrugMedicineListdata, selectedItem) => {
    this.setState({
      selectedDrugList: selectedDrugMedicineListdata,
      drugChange: true,
    });
  };
  // Ends

  // For Drug Allergies Remove
  onDrugMedicineRemove = (deselectedDrugMedicineList, removedItem) => {
    this.setState({
      selectedDrugList: deselectedDrugMedicineList.map((x) => x.id),
      drugChange: true,
    });
   // console.log(Object.assign({}, this.state.selectedDrugList));
  };
  // Ends
  onMedicineSelect = (selectedMedicineListdata, selectedItem) => {
    this.setState({
      selectedMedicineList: selectedMedicineListdata,
      medicineChange: true,
    });
  };

  onMedicineRemove = (deselectedMedicineList, removedItem) => {
    this.setState({
      selectedMedicineList: deselectedMedicineList.map((x) => x.id),
      medicineChange: true,
    });
   // console.log(Object.assign({}, this.state.selectedMedicineList));
  };

  onDiagnosticsRemove = (deselectedDiagnosticsList, removedItem) => {
    this.setState({
      selectedDiagnosticsList: deselectedDiagnosticsList.map((x) => x.id),
      // diagnosticsChange:true
    });
   // console.log(Object.assign({}, this.state.selectedDrugList));
  };

  onDiagnosticsSelect = (selectedDiagnosticsdata, selectedItem) => {
    // alert(selectedDiagnosticsdata.labtest_name);
    // alert(selectedItem.labtest_name);
    this.setState({
      selectedDiagnosticsList: selectedDiagnosticsdata,
      //  diagnosticsChange:true,
    });
    // alert(this.state.selectedDiagnosticsList);
    // console.log(selectedDiagnosticsdata);
    // console.log(selectedItem);
  };

  saveDiagnosis = () => {
    //alert(Object.keys(this.state.selectedDiagnosticsList).length);
    let findLength = this.state.selectedDiagnosticsList;
    // alert(findLength);
    let patient_lab_tests = [];

    patient_lab_tests.push({
      patient_lab_tests: this.state.selectedDiagnosticsList,
      appointment_id: this.state.appointmentId,
    });

   // console.log(patient_lab_tests); //return;

    Httpconfig.httptokenput(
      Constant.siteurl +
        "api/Symptoms/updatePatientLabTest/" +
        this.state.appointmentId,
      {
        patient_lab_tests: this.state.selectedDiagnosticsList,
        appointment_id: this.state.appointmentId,
      }
    )
      .then((response) => {
        if (response.data.status == 200 && response.data.error == false) {
         // console.log(response);
          toast.success("👌" + response.data.message, {
            //  position: "bottom-center",
          });
          this.getsavedDiagnosis();
        } else {
          toast.error(response.data.message, {
            //  position: "bottom-center",
          });
        }
      })
      .catch((error) => {
        toast.error(error);
      });
  };

  getsavedDiagnosis = () => {
    Httpconfig.httptokenget(
      Constant.siteurl +
        "api/Symptoms/getPatientLabTest/" +
        this.state.appointmentId
    )
      .then((response) => {
        if (response.data.status == 200 && response.data.error == false) {
          //console.log(response);
          let testCount=Object.keys(response.data.data).length;
          let testName="";
          this.state.diagnosticsArrays =
            response.data.data[0].patient_lab_tests;
            //alert(testCount);
           // console.log(this.state.diagnosticsArrays);

            for(let test=0;test<testCount;test++){
              let labTestNamesCoun=Object.keys(response.data.data[test].patient_lab_tests).length;
             // alert(labTestNamesCoun);
              for(let names=0;names<labTestNamesCoun;names++){
                testName=testName+","+response.data.data[test].patient_lab_tests[names].labtest_name;
              }
            }
           // alert(testName);

            this.state.labtest_names=testName.substr(1);
            this.forceUpdate();
          // toast.success("👌"+ response.data.message, {
          // //  position: "bottom-center",
          // });
        } else {
          toast.error(response.data.message, {
            //  position: "bottom-center",
          });
        }
      })
      .catch((error) => {
        toast.error(error);
      });
  };

  createPatientMedicalProfile = (event) => {
    event.preventDefault();
    const { fields, errors } = this.state;
    // console.clear();
    let userMedicineList = [];
    let userDrugAllergies = [];
    let patient_current_medication = [];
    let patient_drug_allergies = [];
    let pastHistoryName = "";
    let currentMedicineNames="";

    if (Object.keys(this.state.selectedMedicineList).length != 0) {
      userMedicineList = this.state.selectedMedicineList;
    }
    //alert(this.state.selectedDrugList);
    if (Object.keys(this.state.selectedDrugList).length != 0) {
      userDrugAllergies = this.state.selectedDrugList;
    }

    // console.clear();
    // console.log(userMedicineList);
    // console.log(userDrugAllergies);
    let url_path = "api/hpi/";

    if (this.state.drugChange == true) {
      patient_drug_allergies = this.state.selectedDrugList;
    }
    if (this.state.drugChange == false) {
      patient_drug_allergies = this.state.loadedDrugValue;
    }
    if (this.state.medicineChange == false) {
      patient_current_medication = this.state.loadedMedicineValue;
    }
    if (this.state.medicineChange == true) {
      patient_current_medication = this.state.selectedMedicineList;
    }

    if (this.state.historyChange == true) {
      pastHistoryName = this.state.pastHistoryName;
    }
    if (this.state.historyChange == false) {
      pastHistoryName = this.state.loadedpastHistoryName;
    }
    //console.log(patient_current_medication); //return;
    let allergyMedicineNames = "";
    if(patient_drug_allergies!=null){
    if(Object.keys(patient_drug_allergies).length>0){
    
    patient_drug_allergies.map((allergymedicinedetails) => {
      
      allergyMedicineNames =
        allergyMedicineNames + "," + allergymedicinedetails.medicinename;
    });
  }}
  
  //if(patient_current_medication!=null){
    if(Object.keys(patient_current_medication).length>0){
    
    patient_current_medication.map((currentmedicinedetails) => {
      currentMedicineNames =
        currentMedicineNames + "," + currentmedicinedetails.medicinename;
    });
  }
//}
  
    Httpconfig.httptokenpost(Constant.siteurl + url_path, {
      patient_id: this.state.patientId,
      appointment_id: this.state.appointmentId,
      symptoms: this.state.selectedSymptomsList,
      past_history: pastHistoryName,
      patient_current_medication: patient_current_medication,
      patient_drug_allergies: patient_drug_allergies,
      medicaldoc_pic: "",
      clinic_id:this.state.clinicId,
      // "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAASwAAAEsCAIAAAD2HxkiAAADl0lEQVR4nO3ZMYrDQBREwR7j+19Zip0JHLxAVWy0IHDyaJh/tmu7zu/ftvPon/Otb33757efAanvTv0T4N1ECDERQkyEEBMhxLyOQswSQkyEEBMhxEQIMRFCTIQQc6KAmCWEmAghJkKIiRBiIoSYCCHmRAExSwgxEUJMhBATIcRECDGvoxCzhBATIcRECDERQkyEEBMhxJwoIGYJISZCiIkQYiKEmAghJkKIOVFAzBJCTIQQEyHERAgxEULM6yjELCHERAgxEUJMhBATIcRECDEnCohZQoiJEGIihJgIISZCiIkQYk4UELOEEBMhxEQIMRFCTIQQ8zoKMUsIMRFCTIQQEyHERAgxEULMiQJilhBiIoSYCCEmQoiJEGIihJgTBcQsIcRECDERQkyEEBMhxLyOQswSQkyEEBMhxEQIMRFCTIQQc6KAmCWEmAghJkKIiRBiIoSYCCHmRAExSwgxEUJMhBATIcRECDGvoxCzhBATIcRECDERQkyEEBMhxJwoIGYJISZCiIkQYiKEmAghJkKIOVFAzBJCTIQQEyHERAgxEULM6yjELCHERAgxEUJMhBATIcRECDEnCohZQoiJEGIihJgIISZCiIkQYk4UELOEEBMhxEQIMRFCTIQQ8zoKMUsIMRFCTIQQEyHERAgxEULMiQJilhBiIoSYCCEmQoiJEGIihJgTBcQsIcRECDERQkyEEBMhxLyOQswSQkyEEBMhxEQIMRFCTIQQc6KAmCWEmAghJkKIiRBiIoSYCCHmRAExSwgxEUJMhBATIcRECDGvoxCzhBATIcRECDERQkyEEBMhxJwoIGYJISZCiIkQYiKEmAghJkKIOVFAzBJCTIQQEyHERAgxEULM6yjELCHERAgxEUJMhBATIcRECDEnCohZQoiJEGIihJgIISZCiIkQYk4UELOEEBMhxEQIMRFCTIQQ8zoKMUsIMRFCTIQQEyHERAgxEULMiQJilhBiIoSYCCEmQoiJEGIihJgTBcQsIcRECDERQkyEEBMhxLyOQswSQkyEEBMhxEQIMRFCTIQQc6KAmCWEmAghJkKIiRBiIoSYCCHmRAExSwgxEUJMhBATIcRECDGvoxCzhBATIcRECDERQkyEEBMhxJwoIGYJISZCiIkQYiKEmAghJkKIOVFAzBJCTIQQEyHERAgxEULM6yjELCHERAgxEUJMhBATIcRECDEnCohZQoiJEGIihJgIISZCiN0HtAVfIctU0QAAAABJRU5ErkJggg==",
    })
      .then((response) => {
        
        if (Object.keys(response.data.data).length > 0) {
          this.setState({
            showHistorydata: "collapse-show",
            showHistorytxt: "collapse-hide",
            showDrugdata: "collapse-show",
            showDrugtxt: "collapse-hide",
            showCurrentMedicationdata: "collapse-show",
            showCurrentMedicationtxt: "collapse-hide",
            pastHistoryName: pastHistoryName,
            patientDrugAllergies: allergyMedicineNames,
            currentMedication: currentMedicineNames,
          });
          this.forceUpdate();
         // alert("in");
          toast.success("👌 Saved past medical history succesfully", {
            //  position: "bottom-center",
          });
          let next_page = response.data.nextPage.pageName;
          // toast.success("👌 HPI Saved succesfully", {
          //   position: "bottom-center",
          // });
          //  setTimeout(() => this.props.history.push("/" + next_page), 2000);
        }
      })
      .catch((error) => {
        toast.error(error);
      });
  };
  onMedicineListChange = (event, data) => {
    let selectedMedValue = data.value;

    if (selectedMedValue != "") {
      const keys = data.options.find((data) => data.value === selectedMedValue);
      const selectedmed = {
        id: keys.key,
        medicineid: keys.text,
        medicinename: keys.value,
      };
      this.state.medicinesSelected = selectedmed;
      this.state.medicinevalue = keys.text;
      this.state.medicineselectedId = selectedMedValue; //keys.key;
    }
  };
  OnRouteListChange = (event, data) => {
    let selectedRouteValue = data.value;
//alert(selectedRouteValue);
    if (selectedRouteValue != "") {
      const keys = data.options.find(
        (data) => data.value === selectedRouteValue
      );
      const selectedrout = {
        id: keys.key,
        medicine_type_name: keys.text,
        category_id: keys.value,
      };
      //alert(keys.text);
      this.state.selectedRoute = selectedrout;
      this.state.selectedRouteValue = keys.text;
      this.state.selectedRouteId = keys.key;
    }
  };
  onFrequencySelect = (event) => {
    $(".frequency").removeClass("highlet_button");
    $("#" + event.currentTarget.id).addClass("highlet_button");
    if (event.currentTarget.id == "AsdirectedbythePhysician") {
      //alert("in");
      this.state.otherfrequency = "collapse-show";
      $("#freq_div").addClass("collapse-show");
    } else {
      this.state.otherfrequency = "collapse-hide";
      $("#freq_div").removeClass("collapse-show");
      $("#freq_div").addClass("collapse-hide");
    }
    this.state.stateFrequency = event.currentTarget.id;
  };
  handleOtherFrequencyData = (event) => {
    this.state.stateFrequency = event.currentTarget.value;
  };

  onDosageTimingSelect = (event) => {
    $(".dosagetiming").removeClass("highlet_button");
    $("#" + event.currentTarget.id).addClass("highlet_button");
    this.state.stateDosageTiming = event.currentTarget.id;
  };
  ondayPartSelect = (event) => {
    let selected = event.currentTarget.id;
    let commonseleted = "";
    let checked = $("#" + selected).is(":checked");
    if (selected == "Morning" && checked == true) {
      this.state.morning = selected;
    }

    if (selected == "Morning" && checked == false) {
      this.state.morning = "";
    }
    if (selected == "Day" && checked == true) { 
      this.state.day = selected;
    }
    if (selected == "Day" && checked == false) {
      this.state.day = "";
    }

    if (selected == "Night" && checked == true) {
      this.state.night = selected;
    }
    if (selected == "Night" && checked == false) {
      this.state.night = "";
    }
    this.state.daypart =
      this.state.morning + "," + this.state.day + "," + this.state.night;
  };
  onRefillSelect = (event) => {
    let selected = event.currentTarget.id;
    let checked = $("#" + selected).is(":checked");
    if (selected == "Night" && checked == true) {
      this.state.refill = selected;
    } else {
      this.state.refill = "";
    }
  };

  quantityselect = (event) => {
    let quantity = event.target.value;
    this.setState({
      quantity: quantity,
    });
  };
  dayschange = (event) => {
    let days = event.target.value;
    let value = 0;
    let Frequency = this.state.stateFrequency;
    if (Frequency == "OnceDaily") {
      value = 1;
    }
    if (Frequency == "TwiceDaily") {
      value = 2;
    }
    if (Frequency == "ThriceDaily") {
      value = 3;
    }

    $("#quantity").val(value * days);
    this.state.quantity = value * days;

    this.setState({
      days: days,
    });
  };
  addMedicines = () => {
    let error = 0;
    let count=0;
    if (this.state.medicineselectedId == "") {
      error = error + 1;
      toast.error("Select Medicine", {
        // position: "bottom-center",
      });
    }
    if (this.state.selectedRouteId == "") {
      error = error + 1;
      toast.error("Select Route", {
        // position: "bottom-center",
      });
    }
    if (
      this.state.morning == "" &&
      this.state.day == "" &&
      this.state.night == "" &&
      this.state.food == ""
    ) {
      error = error + 1;
      toast.error("Select Dosage Details", {
        // position: "bottom-center",
      });
    }else{
      if(this.state.morning != ""){
        count=count+1;
      }
      if(this.state.day != ""){
        count=count+1;
      }
      if(this.state.night != ""){
        count=count+1;
      }

    }

    if (this.state.stateFrequency == "") {
      error = error + 1;
      toast.error("Select Frequency", {
        // position: "bottom-center",
      });
    }else{
      if(this.state.stateFrequency=="OnceDaily"){
        if(count>1){
          toast.error("Select Proper Dosage Details");
        }
      }
      if(this.state.stateFrequency=="TwiceDaily"){
        if(count>2){
          toast.error("Select Proper Dosage Details");
        }
        if(count==1){
          toast.error("Select Proper Dosage Details");
        }
      }
      if(this.state.stateFrequency=="ThriceDaily"){
        if(count<3){
          toast.error("Select Proper Dosage Details");
        }
       
      }
      if(this.state.stateFrequency=="QuarterDaily"){
        if(count<3){
          toast.error("Select Proper Dosage Details");
        }
       
      }
      
    }

   // alert(this.state.stateFrequency);
    // if(this.state.morning=="Morning"){

    // }
   
    if (error > 0) {
      toast.warn("Required Fields missing", {
        position: "bottom-center",
      });
      return false;
    }
    if (this.state.onRefillSelect != "") {
      this.state.onRefillSelect = 1;
    } else {
      this.state.onRefillSelect = 0;
    }
    let url_path = "api/PatientAppointment/PatientMedicinecreate";
    Httpconfig.httptokenpost(Constant.siteurl + url_path, {
      patient_id: JSON.parse(this.state.patientId),
      doctor_id: JSON.parse(this.state.doctorId),
      appointmentid: JSON.parse(this.state.appointmentId),
      //"medicinename": this.state.medicinesSelected,
      medicineid: this.state.medicineselectedId,
      routeid: this.state.selectedRouteId,
      medicinename: this.state.medicinevalue,
      //"route":this.state.selectedRoute,
      route: this.state.selectedRouteValue,
      frequency: this.state.stateFrequency,
      shift_one: this.state.morning,
      shift_two: this.state.day,
      shift_three: this.state.night,
      food: this.state.stateDosageTiming,
      dosage: this.state.daypart, //"Morning, After food"
      qty: this.state.quantity,
      duration: this.state.days,
      refill: this.state.onRefillSelect,
    })
      .then((response) => {
        if (response.status == 200) {
          //$('#meddata').refresh();
          this.state.medicineselectedId="";
          this.state.selectedRouteId="";
          $("#routes >.divider").html("Select Route");
          $("#medicines >.divider").html("Select Medicine");
          this.resetFormData();
          this.getMedicinedetails(JSON.parse(this.state.appointmentId));
          toast.success("👌 Added Medicines succesfully", {});
        }
      })
      .catch((error) => {
        toast.error(error);
      });
  };
  resetFormData = () => {
    $(".frequency").removeClass("highlet_button");
    $(".dosagetiming").removeClass("highlet_button");
    $("#days").val("");
    $("#quantity").val("");
    var inputs = document.querySelectorAll(".d_check");
    for (var i = 0; i < inputs.length; i++) {
      inputs[i].checked = false;
    }
  };

  handleClick = (event) => {
    this.setState({
      symptomsShow: "add_pat_section collapse-hide",
      showprescription: "prescription collapse-show",
      shownextbuttons:"epresc_btm_btns collapse-hide",
      symptoms_section:"",
      prescription_section:"active",
    });
  };
  goPrevious = () => {
    this.setState({
      symptomsShow: "add_pat_section collapse-show",
      showprescription: "prescription collapse-hide",
      shownextbuttons:"epresc_btm_btns collapse-show",
      symptoms_section:"active",
      prescription_section:"",



    });
  };
  fetchSymptomsdata() {
    Httpconfig.httptokenget(Constant.siteurl + "api/Symptoms").then(
      (response) => {
        this.setState({
          symptomsOptions: response.data.result,
          symptomsArray: response.data,
          
        });
      }
    );
  }

  onSymptomsSelect = (selectedSymptomsListdata, selectedItem) => {
    this.setState({
      selectedSymptomsList: selectedSymptomsListdata,
      selectedLeftSymptomsList: selectedSymptomsListdata,
    });
  };

  onSymptomsRemove = (deselectedSymptomsList, removedItem) => {
    this.setState({
      selectedSymptomsList: deselectedSymptomsList.map((x) => x.id),
    });
  };
  handleChange = (field, event) => {
    let fields = this.state.fields;
    fields[field] = event.target.value;
    this.setState({ fields });
  };

  handleValidation() {
    let fields = this.state.fields;
    let errors = {};
    let formIsValid = true;

    this.setState({ errors: errors });
    return formIsValid;
  }
  // To get all the ResponderInfo
  getPatientSavedSymptomsInfo(patientId, appointmentId) {
    //+this.state.clinicId
    Httpconfig.httptokenget(
      Constant.siteurl + "api/Symptoms/" + patientId + "/" + appointmentId+"/2",
    )
      .then((response) => {
        // alert(Object.keys(response.data.data).length);
        //alert(response.data.previousPage['pageName']);
        if (Object.keys(response.data.data).length == 0) {
          let previousPage = response.data.previousPage["pageName"];
          let nextPage = response.data.nextPage["pageName"];

          this.setState({
            previousPage: previousPage,
            nextPage: nextPage,
          });
        }

        if (response.status == 200) {
          let responseLog = response;
          let userSavedData = response.data.data[0].symptoms;
          let previousPage = response.previousPage;
          //alert(previousPage);
          this.setState({
            selectedSymptomsValue: userSavedData,
            selectedLeftSymptomsList: userSavedData,
            addedSymptoms:response.data.data[0].add_more_symptoms,
            previousPage: previousPage,
          });
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }

  getAdvice = () => {
    if (this.state.appointmentId != "") {
      Httpconfig.httptokenget(
        Constant.siteurl +
          "api/PatientAppointment/doctorAdvice/" +
          this.state.appointmentId
      )
        .then((response) => {
          if ((response.data.status = 200 && response.data.error == false)) {
            this.state.stateadvice = response.data.data[0]["doctor_advice"];
          }
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };
  saveAdvice = (event) => {
    if (this.state.stateadvice != "" && this.state.stateadvice != "") {
      Httpconfig.httptokenput(
        Constant.siteurl +
          "api/PatientAppointment/doctorAdvice/" +
          this.state.appointmentId,
        {
          doctor_advice: this.state.stateadvice,
        }
      )
        .then((response) => {
          //  alert(response);
          toast.success("👌 Advice saved succesfully", {});
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
      toast.success("Advice Should not be empty", {
        // position: "bottom-center",
      });
    }
  };
  handleAdviceChange = (event) => {
    let advicedata = event.target.value;
    this.setState({
      stateadvice: advicedata,
    });
  };

  
  clickBodyCode = (ev) => {
    let bodyId = ev.target.id;
    let description = ev.target.dataset.description;
    let code = ev.target.dataset.code;
    let arrayCode = {
       id : parseInt(bodyId),
       description : description,
       code : code,
    }
    let finalData = [];
    finalData.push(arrayCode);

    var initialData = this.state.selectedLeftSymptomsList;
    var newData  = finalData;

    var ids = new Set(initialData.map(d => d.id));
    var merged = [...initialData, ...newData.filter(d => !ids.has(d.id))];

    this.setState({
      selectedLeftSymptomsList: merged,
      selectedSymptomsList : merged,
      selectedSymptomsValue:merged
    });
    this.forceUpdate();
  };


  getFollowUp = () => {
    if (this.state.appointmentId != "") {
      Httpconfig.httptokenget(
        Constant.siteurl +
          "api/PatientAppointment/nextAppointmentDateTime/" +
          this.state.appointmentId
      )
        .then((response) => {
          if ((response.data.status = 200 && response.data.error == false)) {
            //alert(response.data.data[0]['next_appointment_datetime']);
            this.state.next_appointment_datetime =
              response.data.data[0]["next_appointment_datetime"];
          }
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

  saveFollowUp = (event) => {
    if (
      this.state.next_appointment_datetime != "" &&
      this.state.next_appointment_datetime != ""
    ) {
      //alert(this.state.next_appointment_datetime);
      //let nextAppointmentDate= moment(this.state.next_appointment_datetime,"YYYY-MM-DD");
      let nextAppointmentDate=moment(moment(this.state.next_appointment_datetime, 'DD-MM-YYYY')).format('YYYY-MM-DD')
     // alert(nextAppointmentDate);
      Httpconfig.httptokenput(
        Constant.siteurl +
          "api/PatientAppointment/nextAppointmentDateTime/" +
          this.state.appointmentId,
        {
          next_appointment_datetime:nextAppointmentDate,
          
        }
      )
        .then((response) => {
          //  alert(response);
          toast.success("👌 Follow up date saved succesfully", {});
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
      toast.success("Appointment date should not be empty", {
        // position: "bottom-center",
      });
    }
  };
  handleFollowup = (event) => {
    let followupDate = event.target.value;
    this.setState({
      next_appointment_datetime: moment(followupDate).format('DD-MM-YYYY'),
    });
  };

  getTodayAppointment=()=>{
    var retrievedObject=localStorage.getItem('DocuserObj');
  
     if(retrievedObject==null){
       window.location.href = "doctor/login";
     }
      let userData=JSON.parse(retrievedObject);
      this.setState({
        doctor_id: userData.doctor_id,
      })
      //alert(moment().format('YYYY-MM-DD')    );
      var post_data={
        doctorId:userData.doctor_id,
        consultationDate:moment().format('YYYY-MM-DD')    
      }
      //console.log(post_data);
    Httpconfig.httptokenpost(Constant.siteurl + "api/PatientAppointment/getTodayAppointmentCount", post_data)
    .then((response) => {
      if(response.data.status=="200" && response.data.error== false){
      
      this.setState({
        doctor_id: userData.doctor_id,
        todayDate: moment().format('YYYY-MM-DD'),
        todayTelemedicinePatientCount:response.data.data.telemedicine[0].todayPatientCount,
      })
     
      }else{
          toast.warn("Sorry we cannot update the Availibility status at this moment", {
              position: "bottom-center",
            });
      }
    })
    .catch((error) => {
      toast.error(error);
    });

  }
  getfinalDiagnosis = () => {
    if (this.state.appointmentId != "") {
      Httpconfig.httptokenget(
        Constant.siteurl +
          "api/PatientAppointment/finalDiagnosis/" +
          this.state.appointmentId
      )
        .then((response) => {
          // alert(response.data.status);
          // alert(response.data.error);
          if (response.data.status == 200 && response.data.error == false) {
            //alert(response.data.data[0]['final_diagnosis']);
            this.state.stateFinalDiagnosis =
              response.data.data[0]["final_diagnosis"];
          }
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
      toast.success("Diagnosis should not be empty", {
        // position: "bottom-center",
      });
    }
  };

  finalDiagnosis = (event) => {
    // alert(this.state.stateFinalDiagnosis);
    if (
      this.state.stateFinalDiagnosis != "" &&
      this.state.stateFinalDiagnosis != ""
    ) {
      Httpconfig.httptokenput(
        Constant.siteurl +
          "api/PatientAppointment/finalDiagnosis/" +
          this.state.appointmentId,
        {
          final_diagnosis: this.state.stateFinalDiagnosis,
        }
      )
        .then((response) => {
          //  alert(response);
          toast.success("👌 Diagnosis saved succesfully");
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
      toast.success("Diagnosis should not be empty", {
        // position: "bottom-center",
      });
    }
  };
  handleFinalDiagnosis = (event) => {
    // alert("in");
    let finalDiagnosisData = event.target.value;
    this.setState({
      stateFinalDiagnosis: finalDiagnosisData,
    });
  };
  showMedicinesPrescriptions =(event)=>{
    let divid=event.currentTarget.id;
    if(divid=='loadPrescription'){
      $('#loadPrescription').show();
      $('#add_med_section').hide();
      
    }
    if(divid=='writePrescription'){
      $('#loadPrescription').hide();
      $('#writePrescription').show();
    }

    
  }

  createPatientSymptoms = (event) => {
    event.preventDefault();
    let url_path = "api/Symptoms/";
    let userSymptoms = [];
    if (Object.keys(this.state.selectedSymptomsList).length != 0) {
      userSymptoms = this.state.selectedSymptomsList;
    }
    var post_data = {
      patient_id: JSON.parse(this.state.patientId),
      appointment_id: this.state.appointmentId,
      symptoms: userSymptoms,
      
    };

    Httpconfig.httptokenpost(Constant.siteurl + url_path, {
      patient_id: JSON.parse(this.state.patientId),
      appointment_id: parseInt(this.state.appointmentId),
      symptoms: userSymptoms,
      clinic_id:this.state.clinicId,
      add_more_symptoms:this.state.newsymptoms,
    })
      .then((response) => {
        if (response.status == 200) {
         // let next_page = response.data.nextPage.pageName;
          toast.success("👌 Symptoms Saved succesfully", {
            position: "bottom-center",
          });

          //  this.setState({
          //   symptomsShow:'add_pat_section collapse-hide',
          //   showprescription:"prescription collapse-show",
          // })
        }
      })
      .catch((error) => {
        toast.error(error);
      });
  };
  getMedicineselected = (event) => {
    let selectedId = event.currentTarget.id;

    let medData = this.state.patientMedicinesArray;
    let routeData = this.state.stateOptions;
    this.state.updateselectedId = selectedId;
    for (
      let count = 0;
      count < this.state.patientMedicinesArray.length;
      count++
    ) {
      if (medData[count]["id"] == selectedId) {
        // alert(medData[count]['quantity']);
        this.state.medicineselectedId = medData[count]["medicine_id"];
        this.state.selectedRouteId = medData[count]["route"];
        this.state.medicinevalue = medData[count]["medicine_name"];
        //"route":this.state.selectedRoute,
        //this.state.selectedRouteValue= medData[count]['id']
        this.state.Frequency = medData[count]["frequency"];
        this.state.morning = medData[count]["shift_one"];
        this.state.day = medData[count]["shift_two"];
        this.state.night = medData[count]["shift_three"];
        this.state.stateDosageTiming = medData[count]["food"];
        this.state.daypart = medData[count]["id"]; //"Morning, After food"
        this.state.quantityselect = medData[count]["quantity"];
        this.state.onRefillSelect = medData[count]["refill"];
        this.state.duration = medData[count]["duration"];
      }
      //$('select.dropdown').dropdown({placeholder:this.state.medicinevalue});
      this.state.medPlaceHolder = this.state.medicinevalue;
    }
    //alert(this.state.stateOptions.length);
    for (
      let routecount = 0;
      routecount < this.state.stateOptions.length;
      routecount++
    ) {
      //alert(this.state.selectedRouteId);

      if (this.state.selectedRouteId == routeData[routecount]["key"]) {
        this.state.routeName = routeData[routecount]["text"];
        this.state.defaultRoutesData = routeData[routecount]["value"];
      }
    }
    //alert(this.state.routeName);
    $("#routes >.divider").html(this.state.routeName);
    $("#medicines >.divider").html(this.state.medicinevalue);
    if (this.state.day) {
      $("#" + this.state.day).prop("checked", true);
    }
    if (this.state.morning) {
      $("#" + this.state.morning).prop("checked", true);
    }
    if (this.state.night) {
      $("#" + this.state.night).prop("checked", true);
    }
    if (this.state.stateDosageTiming) {
      $("#" + this.state.stateDosageTiming).addClass("highlet_button");
    }
    if (
      this.state.Frequency == "OnceDaily" ||
      this.state.Frequency == "TwiceDaily" ||
      this.state.Frequency == "ThriceDaily" ||
      this.state.Frequency == "QuarterDaily"
    ) {
      $("#" + this.state.Frequency).addClass("highlet_button");
    } else {
      $("#AsdirectedbythePhysician").addClass("highlet_button");
      $("#freq_div").addClass("collapse-show");
      //alert(this.state.Frequency);
      $("#otherfrequency").val(this.state.Frequency);
    }

    if (this.state.quantityselect != "") {
      $("#quantity").val(this.state.quantityselect);
    }
    if (this.state.duration != "") {
      $("#days").val(this.state.duration);
    }
    if (this.state.onRefillSelect == 1) {
      $("#Refill").prop("checked", true);
    }
    $("#updatemedicine").addClass("collapse-show");
    $("#addmedicine").removeClass("collapse-show").addClass("collapse-hide");
  };
  updateMedicineSelected = () => {
    if (this.state.updateselectedId != "") {
      let url_path =
        "api/PatientAppointment/PatientMedicineUpdate/" +
        this.state.updateselectedId;
      Httpconfig.httptokenput(Constant.siteurl + url_path, {
        patient_id: JSON.parse(this.state.patientId),
        doctor_id: JSON.parse(this.state.doctorId),
        appointmentid: JSON.parse(this.state.appointmentId),
        //"medicinename": this.state.medicinesSelected,
        medicineid: this.state.medicineselectedId,
        routeid: this.state.selectedRouteId,
        medicinename: this.state.medicinevalue,
        //"route":this.state.selectedRoute,
        route: this.state.selectedRouteValue,
        frequency: this.state.stateFrequency,
        shift_one: this.state.morning,
        shift_two: this.state.day,
        shift_three: this.state.night,
        food: this.state.stateDosageTiming,
        dosage: this.state.daypart, //"Morning, After food"
        qty: this.state.quantity,
        duration: this.state.days,
        refill: this.state.onRefillSelect,
      })
        .then((response) => {
         // console.log(response);
          if (response.status == 200) {
            this.state.medicineselectedId="";
            this.state.selectedRouteId="";
            $("#routes >.divider").html("Select Route");
            $("#medicines >.divider").html("Select Medicine");
            this.getMedicinedetails(JSON.parse(this.state.appointmentId));
            $("#updatemedicine")
              .removeClass("collapse-show")
              .addClass("collapse-hide");
            $("#addmedicine")
              .removeClass("collapse-hide")
              .addClass("collapse-show");
            this.resetFormData();
            toast.success("👌 Medicine update succesfully", {
              //position: "bottom-center",
            });
            // setTimeout(() => this.props.history.push("/" + next_page), 2000);
          }
        })
        .catch((error) => {
          toast.error(error);
        });
      $("#addmedicine").removeClass("collapse-hide").addClass("collapse-show");
      $("#updatemedicine")
        .removeClass("collapse-show")
        .addClass("collapse-hide");
    }
  };
  deleteMedicine = (event) => {
    let selectedId = event.currentTarget.id;
    Httpconfig.httptokendelete(
      Constant.siteurl + "api/PatientAppointment/PatientMedicine/" + selectedId
    )
      .then((response) => {
        // alert(response.data);
        // this.state.patientMedicinesArray=response.data.data;
        this.getMedicinedetails(JSON.parse(this.state.appointmentId));
      })
      .catch((error) => {
        toast.error(error);
      });
  };

  myFunction = (id) => {
    //alert("in");
    //let id = "patient1";
    
    if(id=='patient1'){
    var x = document.getElementById(id);
    if (x.className.indexOf("pat_show") == -1) {
      x.className += " pat_show";
      x.className = x.className.replace(" pat-hide", "");
    } else {
      x.className = x.className.replace(" pat_show", " pat-hide");
    }
  }

    //alert("in");
    //let id1 = "Diagnosis1";
    if(id=='Diagnosis1'){
    var x = document.getElementById(id);
    if (x.className.indexOf("diag_show") == -1) {
      x.className += " diag_show";
    } else {
      x.className = x.className.replace(" diag_show", "");
    }
  }
  };

  onleftSymptomsRemove = (event) => {
    let array = this.state.selectedLeftSymptomsList;
    let foundValue = array.filter((obj) => obj.description != event.target.id);
    this.setState({ selectedLeftSymptomsList: foundValue });
    this.setState({ selectedSymptomsValue: foundValue });
  };

  handleNewSymptoms =(event) =>{
    let newsymptoms=event.target.value;
    this.state.newsymptoms=newsymptoms;
    this.forceUpdate();
  }
  ImageClick = (event) => {
    var array = this.state.files;
    var foundValue = array.filter((obj) => obj.name != event.target.id);
    this.setState({ files: foundValue });
    
  };
  ImageZoomClick=(event)=>{
  this.setState({
    zoomimage:event.currentTarget.src,
  })
  }
  removeImageOnClick=(event)=>{
    let imageName=event.currentTarget.id.replace("img_","");
    $('#'+imageName).remove();
    $('.'+imageName).remove();
   // $("#upload_img_presc").attr("src", "");
    //// // // console.log("State values");
    //// // // console.log(this.state.files);
    var array = [...this.state.files]; // make a separate copy of the array
    // // // console.log("array values");
  //var index = array.indexOf(imageName);
  var index = array.findIndex((item) => item.name === imageName);
  //alert(index);
  //// // // console.log(array);
  if (index !== -1) {
    array.splice(index, 1);
    this.setState({files: array});
  }
this.forceUpdate();
    // this.setState({
    //   zoomimage:'',
    // })
    }

  render() {
    var symptomsRelated = [];
    let arr = this.state.selectedLeftSymptomsList;
    if (arr != undefined) {
      for (var i = 0; i < arr.length; i++) {
        symptomsRelated.push(
          <p value={arr[i].id} id={arr[i].id}>
            {" "}
            {arr[i].description}{" "}
            <img
              src="../images/patient/img/Patient Intake Process/cross.svg"
              id={arr[i].description}
              onClick={this.onleftSymptomsRemove}
            />{" "}
          </p>
        );
      }
    }

    // const medicinesData= this.state.patientMedicinesArray.map((data,index) =>{
    // let data=this.state.data.duration.split(",")
    let medicineslistarray = [];
    let medicinepreviewlistarray = [];
    let MedCount = this.state.patientMedicinesArray.length;
    let medList = this.state.patientMedicinesArray;
    // alert(this.state.patientMedicinesArray.length);
    for (let med = 0; med < MedCount; med++) {
      // alert("in");
      // alert(medList[med]['medicine_name']);
     // console.log(medList[med]["medicine_name"]);
      medicineslistarray.push(
        <tr>
          <td>{medList[med]["medicine_name"]}</td>
          <td>
            <p class="dos_value">{medList[med]["shift_one"] ? "1" : "0"}</p>
            <h5 class="dos_time">{medList[med]["food"]}</h5>
          </td>
          <td>
            <p class="dos_value">{medList[med]["shift_two"] ? "1" : "0"}</p>
            <h5 class="dos_time">{medList[med]["food"]}</h5>
          </td>
          <td>
            <p class="dos_value">{medList[med]["shift_three"] ? "1" : "0"}</p>
            <h5 class="dos_time">{medList[med]["food"]}</h5>
          </td>
          <td>
            {medList[med]["frequency"]} {medList[med]["days"]}
          </td>
          <td>
            <p
              class="tab_edit"
              id={medList[med]["id"]}
              onClick={this.getMedicineselected}
            >
              <img src="../images/doctor-img/Eprescription video 3/Write Prescription/Edit.svg" />
              Edit
            </p>
            <p
              class="tab_del"
              id={medList[med]["id"]}
              onClick={this.deleteMedicine}
            >
              <img src="../images/doctor-img/Eprescription video 3/Write Prescription/Delete.svg" />
              Delete
            </p>
          </td>
        </tr>
      );
      medicinepreviewlistarray.push(
        <tr>
          <td>{medList[med]["medicine_name"]}</td>
          <td>
            <p class="dos_value">{medList[med]["shift_one"] ? "1" : "0"}</p>
            <h5 class="dos_time">{medList[med]["food"]}</h5>
          </td>
          <td>
            <p class="dos_value">{medList[med]["shift_two"] ? "1" : "0"}</p>
            <h5 class="dos_time">{medList[med]["food"]}</h5>
          </td>
          <td>
            <p class="dos_value">{medList[med]["shift_three"] ? "1" : "0"}</p>
            <h5 class="dos_time">{medList[med]["food"]}</h5>
          </td>
          <td>
            {medList[med]["frequency"]} {medList[med]["days"]}
          </td>
        </tr>
      );
    }

    const pulseSettings = {
      start: this.state.pulse_rate,
      min: 20,
      max: 200,
      step: 1,
      onChange: (value) => {
        this.setState({
          fields: {
            height: this.state.fields.height,
            roundHeight: Math.round(this.state.fields.height),
            ftHeight: this.state.fields.ftHeight,
            inHeight: this.state.fields.inHeight,
            weight: this.state.fields.weight,
            skip_height: this.state.fields.skip_height,
            skip_weight: this.state.fields.skip_weight,
            bmi: this.state.fields.bmi,
            temparature: this.state.fields.temparature,
            skip_temparature: this.state.fields.skip_temparature,
            pulse: value,
            bloodsugar: this.state.fields.bloodsugar,
            skip_pulse: this.state.fields.skip_pulse,
            skip_bloodsugar: this.state.fields.skip_bloodsugar,
            respiratoryrate: this.state.fields.respiratoryrate,
            skip_respiratoryrate: this.state.fields.skip_respiratoryrate,
            skip_systolic: this.state.fields.skip_systolic,
            systolic: this.state.fields.systolic,
            diastolic: this.state.fields.diastolic,
          },
        });
      },
    };

    const temparatureSettings = {
      start: 70,
      min: 70,
      max: 130,
      step: 1,
      onChange: (value) => {
        this.setState({
          fields: {
            height: this.state.fields.height,
            roundHeight: Math.round(this.state.fields.height),
            ftHeight: this.state.fields.ftHeight,
            inHeight: this.state.fields.inHeight,
            weight: this.state.fields.weight,
            skip_height: this.state.fields.skip_height,
            skip_weight: this.state.fields.skip_weight,
            bmi: this.state.fields.bmi,
            temparature: value,
            skip_temparature: this.state.fields.skip_temparature,
            pulse: this.state.fields.pulse,
            skip_pulse: this.state.fields.skip_pulse,
            skip_bloodsugar: this.state.fields.skip_bloodsugar,
            bloodsugar: this.state.fields.bloodsugar,
            respiratoryrate: this.state.fields.respiratoryrate,
            skip_respiratoryrate: this.state.fields.skip_respiratoryrate,
            skip_systolic: this.state.fields.skip_systolic,
            systolic: this.state.fields.systolic,
            diastolic: this.state.fields.diastolic,
          },
        });
      },
    };

    const respiratorySettings = {
      start: 5,
      min: 5,
      max: 100,
      step: 1,
      onChange: (value) => {
        this.setState({
          fields: {
            height: this.state.fields.height,
            roundHeight: Math.round(this.state.fields.height),
            ftHeight: this.state.fields.ftHeight,
            inHeight: this.state.fields.inHeight,
            weight: this.state.fields.weight,
            skip_height: this.state.fields.skip_height,
            skip_weight: this.state.fields.skip_weight,
            bmi: this.state.fields.bmi,
            temparature: this.state.fields.temparature,
            skip_temparature: this.state.fields.skip_temparature,
            pulse: this.state.fields.pulse,
            skip_pulse: this.state.fields.skip_pulse,
            skip_bloodsugar: this.state.fields.skip_bloodsugar,
            bloodsugar: this.state.fields.bloodsugar,
            respiratoryrate: value,
            skip_systolic: this.state.fields.skip_systolic,
            skip_respiratoryrate: this.state.fields.skip_respiratoryrate,
            systolic: this.state.fields.systolic,
            diastolic: this.state.fields.diastolic,
          },
        });
      },
    };

    const systolicSettings = {
      start: 20,
      min: 20,
      max: 250,
      step: 1,
      onChange: (value) => {
        this.setState({
          fields: {
            height: this.state.fields.height,
            roundHeight: Math.round(this.state.fields.height),
            ftHeight: this.state.fields.ftHeight,
            inHeight: this.state.fields.inHeight,
            weight: this.state.fields.weight,
            skip_height: this.state.fields.skip_height,
            skip_weight: this.state.fields.skip_weight,
            bmi: this.state.fields.bmi,
            temparature: this.state.fields.temparature,
            skip_temparature: this.state.fields.skip_temparature,
            pulse: this.state.fields.pulse,
            skip_pulse: this.state.fields.skip_pulse,
            skip_bloodsugar: this.state.fields.skip_bloodsugar,
            bloodsugar: this.state.fields.bloodsugar,
            respiratoryrate: this.state.fields.respiratoryrate,
            skip_respiratoryrate: this.state.fields.skip_respiratoryrate,
            skip_systolic: this.state.fields.skip_systolic,
            systolic: value,
            diastolic: this.state.fields.diastolic,
          },
        });
      },
    };

    const diastolicSettings = {
      start: 20,
      min: 20,
      max: 250,
      step: 1,
      onChange: (value) => {
        this.setState({
          fields: {
            height: this.state.fields.height,
            roundHeight: Math.round(this.state.fields.height),
            ftHeight: this.state.fields.ftHeight,
            inHeight: this.state.fields.inHeight,
            weight: this.state.fields.weight,
            skip_height: this.state.fields.skip_height,
            skip_weight: this.state.fields.skip_weight,
            bmi: this.state.fields.bmi,
            temparature: this.state.fields.temparature,
            skip_temparature: this.state.fields.skip_temparature,
            pulse: this.state.fields.pulse,
            skip_pulse: this.state.fields.skip_pulse,
            skip_bloodsugar: this.state.fields.skip_bloodsugar,
            bloodsugar: this.state.fields.bloodsugar,
            respiratoryrate: this.state.fields.respiratoryrate,
            skip_respiratoryrate: this.state.fields.skip_respiratoryrate,
            skip_systolic: this.state.fields.skip_systolic,
            systolic: this.state.fields.systolic,
            diastolic: value,
          },
        });
      },
    };

    const heightFeetSettings = {
      start: 1,
      min: 1,
      max: 9,
      step: 1,
      onChange: (feetvalue) => {
        // Calculation from feet Inches to Cm
        const ftHeight = feetvalue;
        const inHeight = this.state.fields.inHeight;
        let feetInchesMerge = ftHeight + "." + inHeight;
        let height = feetInchesMerge / 0.032808;
        this.state.fields.height = height.toFixed(2);
        // Ends
        this.setState({
          fields: {
            height: this.state.fields.height,
            roundHeight: Math.round(this.state.fields.height),
            ftHeight: feetvalue,
            inHeight: this.state.fields.inHeight,
            weight: this.state.fields.weight,
            skip_height: this.state.fields.skip_height,
            skip_weight: this.state.fields.skip_weight,
            bmi: this.state.fields.bmi,
            temparature: this.state.fields.temparature,
            skip_temparature: this.state.fields.skip_temparature,
            pulse: this.state.fields.pulse,
            bloodsugar: this.state.fields.bloodsugar,
            skip_pulse: this.state.fields.skip_pulse,
            skip_bloodsugar: this.state.fields.skip_bloodsugar,
            respiratoryrate: this.state.fields.respiratoryrate,
            skip_respiratoryrate: this.state.fields.skip_respiratoryrate,
            skip_systolic: this.state.fields.skip_systolic,
            systolic: this.state.fields.systolic,
            diastolic: this.state.fields.diastolic,
          },
        });
      },
    };

    const heightInchSettings = {
      start: 1,
      min: 1,
      max: 9,
      step: 1,
      onChange: (inchvalue) => {
        // Calculation from feet Inches to Cm
        const ftHeight = this.state.fields.ftHeight;
        const inHeight = inchvalue;
        let feetInchesMerge = ftHeight + "." + inHeight;
        let height = feetInchesMerge / 0.032808;
        this.state.fields.height = height.toFixed(2);

        // Ends
        this.setState({
          fields: {
            height: Math.round(this.state.fields.height),
            roundHeight: Math.round(this.state.fields.height),
            ftHeight: this.state.fields.ftHeight,
            inHeight: inchvalue,
            weight: this.state.fields.weight,
            skip_height: this.state.fields.skip_height,
            skip_weight: this.state.fields.skip_weight,
            bmi: this.state.fields.bmi,
            temparature: this.state.fields.temparature,
            skip_temparature: this.state.fields.skip_temparature,
            pulse: this.state.fields.pulse,
            bloodsugar: this.state.fields.bloodsugar,
            skip_pulse: this.state.fields.skip_pulse,
            skip_bloodsugar: this.state.fields.skip_bloodsugar,
            respiratoryrate: this.state.fields.respiratoryrate,
            skip_respiratoryrate: this.state.fields.skip_respiratoryrate,
            skip_systolic: this.state.fields.skip_systolic,
            systolic: this.state.fields.systolic,
            diastolic: this.state.fields.diastolic,
          },
        });
      },
    };

    const weightSettings = {
      start: 20,
      min: 20,
      max: 300,
      step: 1,
      onChange: (weightvalue) => {
        this.setState({
          fields: {
            height: this.state.fields.height,
            roundHeight: Math.round(this.state.fields.height),
            ftHeight: this.state.fields.ftHeight,
            inHeight: this.state.fields.inHeight,
            weight: weightvalue,
            skip_height: this.state.fields.skip_height,
            skip_weight: this.state.fields.skip_weight,
            bmi: this.state.fields.bmi,
            temparature: this.state.fields.temparature,
            skip_temparature: this.state.fields.skip_temparature,
            pulse: this.state.fields.pulse,
            bloodsugar: this.state.fields.bloodsugar,
            skip_pulse: this.state.fields.skip_pulse,
            skip_bloodsugar: this.state.fields.skip_bloodsugar,
            respiratoryrate: this.state.fields.respiratoryrate,
            skip_respiratoryrate: this.state.fields.skip_respiratoryrate,
            skip_systolic: this.state.fields.skip_systolic,
            systolic: this.state.fields.systolic,
            diastolic: this.state.fields.diastolic,
          },
        });
      },
    };

    const bloodsugarSettings = {
      start: 60,
      min: 60,
      max: 80,
      step: 1,
      onChange: (value) => {
        this.setState({
          fields: {
            height: this.state.fields.height,
            roundHeight: Math.round(this.state.fields.height),
            ftHeight: this.state.fields.ftHeight,
            inHeight: this.state.fields.inHeight,
            weight: this.state.fields.weight,
            skip_height: this.state.fields.skip_height,
            skip_weight: this.state.fields.skip_weight,
            bmi: this.state.fields.bmi,
            temparature: this.state.fields.temparature,
            skip_temparature: this.state.fields.skip_temparature,
            pulse: this.state.fields.pulse,
            skip_pulse: this.state.fields.skip_pulse,
            skip_bloodsugar: this.state.fields.skip_bloodsugar,
            bloodsugar: value,
            respiratoryrate: this.state.fields.respiratoryrate,
            skip_respiratoryrate: this.state.fields.skip_respiratoryrate,
            skip_systolic: this.state.fields.skip_systolic,
            systolic: this.state.fields.systolic,
            diastolic: this.state.fields.diastolic,
          },
        });
      },
    };
    let documentsRelated = [];
    let imageArray = this.state.files;
    //alert(imageArray.length);
   // // // // console.log(imageArray);
    if (imageArray.length > 0) {
      for (var i = 0; i < imageArray.length; i++) {
        //alert(imageArray[i].name.split("."));
        
        let img=imageArray[i].name.split(".");
        //alert(img[0]);
        //alert(img);
        let imgName=img[0];
        let imageName = imageArray[i].name;
        let imagebase64 = imageArray[i].base64;
        let imageType = imageArray[i].type;
        let imageSize = imageArray[i].size;
        let imageId = imageArray[i];
        this.state.base64=imagebase64;
       // // // // console.log(imageId);
        documentsRelated.push(
          <div class={"upload_presc_img "+imgName}>
                <a href="#" class="thumbnail" data-toggle="modal" data-target="#lightbox"> 
                <img
            src={imagebase64}
            id={imgName}
            value={imageName}
            alt={imageName}
            name={imageName}
            // onClick={this.ImageClick.bind(this)}
             onClick={this.ImageZoomClick.bind(this)}
            
          />
                </a>
                <div class="upload_top_img">
                  <a href="#" class="thumbnail" data-toggle="modal" data-target="#lightbox" >
                {/* <img class="fl_img" src="https://www.iconninja.com/files/924/926/503/fullscreen-icon.png"  /> */}
              </a>
               <img class="del_img" id={"img_"+imageArray[i].name} onClick={this.removeImageOnClick} src="https://icons.iconarchive.com/icons/danieledesantis/playstation-flat/512/playstation-cross-black-and-white-icon.png" />
              </div>
              </div>

         
        );
      }
    }
  



    // )}}
    return (
      <main id="main">
        {/* <DoctorHeader onSelectLanguage={this.handleLanguage}/> */}
        <I18nPropvider locale={this.state.Language}>
          <ToastContainer />

          <section id="epresc_navbar">
            <div class="">
              <div class="row">
                <div class="col-lg-3 col-md-12">
                  <div class="today_section">
                    <p>
                      Today's Patient <span>{this.state.todayTelemedicinePatientCount}</span>
                    </p>
                  </div>
                </div> 

                <div class="col-lg-5 col-md-12">
                  <div class="symptoms_section">
                    <p class={this.state.symptoms_section}> 
                      <img src="img/Patient Intake Process/tickmark.svg" />
                      Symptoms & Diagnosis
                    </p>
                  </div>
                </div>
                <div class="col-lg-4 col-md-12">
                  <div class="prescription_section">
                    <p class={this.state.prescription_section}>Prescription</p>
                  </div>
                </div>
              </div>
            </div>
            <section id="doctor_bar">
              <div class="row">
                <div class="doc_consult">
                  <h2>
                    {this.state.patientName} -{" "}
                    <span>
                      {this.state.dob} ,{this.state.gender}
                    </span>
                  </h2>
                  <p>Dr. {this.state.doctorName}</p>
                </div>
              </div>
            </section>
          </section>

            
  

          <section id="video_bar">
            <div class="container-fluid">
              <div class="row">
                <div class="col-lg-3 no_padding">
                  <div class="video_call">
                    <div class="main_video">{this.state.meetingId}
                      <VideoConference meetingid={this.state.meetingId}/>

                      <p class="user_name">Dr.{this.state.doctorName}</p>
                    </div>
                  </div>
                </div>
                <div class="col-lg-9">
               


                  <div class="Final_diagnosis_section">
                    <div class="diagnosis_head"  onClick={this.myFunction.bind(this,'patient1')}>
                      <h2>Patient Information <img src="../images/doctor-img/Eprescription video 3/Dropdown-circle.svg" /></h2>
                    </div>
                    {/* Permsission popup for view Vitals start */}
                   {/* <div class="ask_patient_section">
                   <img src="../images/doctor-img/Medical information locked/Medical_information.svg" />
     <h5>Medical Information Locked</h5>
     <p>Ask Patient's Consent</p>
     <h6>Seek Permission for the detailed Information of the Patient</h6>
  </div>  */}
                    {/* Permsission popup for view Vitals end */}
                    {/* <div id="diagnosis_bar" class="collapse"> */}
                    <div id="patient1" class="pat-cont pat-hide">
                      <div class="diagnosis_set">
                        <div class="row">
                          <div class="col-lg-3 col-md-3">
                            <div class="diagnosis_content">
                              <h6>Pulse Rate</h6>
                              <p href="#" id="tog_Popup_revert" onClick={this.pop}>
                                {this.state.fields["pulse"]
                                  ? this.state.fields["pulse"] + " BPM"
                                  : this.state.pulse_rate ? this.state.pulse_rate + " BPM": "--"}{" "}
                                <img src="../images/doctor-img/Eprescription video 3/Dropdown-circle.svg" />
                              </p>

                              <div class="popup">
                                <span class="popuptext" id="tog_Popup">
                                  <div class="slidecontainer">
                                    <h1>Pulse Rate</h1>
                                    <p class="tog_value">
                                      <span id="tog_demo_revert"></span>BPM
                                    </p>
                                    {/* <input type="range" min="1" max="100" value="20" class="slider" id="tog_myRange" /> */}
{this.state.fields["pulse"]
? this.state.fields["pulse"] 
: this.state.pulse_rate ? this.state.pulse_rate : "--"}

                                    <Slider
                                      value={90}
// value={this.state.fields["pulse"]
//                                       ? parseInt(this.state.fields["pulse"])
//                                       : parseInt(this.state.pulse_rate) ? parseInt(this.state.pulse_rate) : 0}
                                      color="blue"
                                      settings={pulseSettings}
                                    />

                                    <div class="tog_btns text-right">
                                      <h5 class="cal_btn " id="tog_Popup_pulse_cancel" onClick={this.popupCancel}>Cancel</h5>
                                      <h5 class="save_btn" onClick={this.savePulse}>Save</h5>
                                    </div>
                                  </div>
                                </span>
                              </div>
                            </div>
                          </div>


                          {/* <div class="col-lg-3 col-md-3">
                            <div class="diagnosis_content">
                              <h6>Blood Pressure</h6>
                              <p>
                                {this.state.blood_pressure_diastolic
                                  ? this.state.blood_pressure_diastolic
                                  : "--"}
                                -{" "}
                                {this.state.blood_pressure_systolic
                                  ? this.state.blood_pressure_systolic + " mmhg"
                                  : "--"}{" "}
                                <img src="img/dropdown.svg" />
                              </p>
                            </div>
                          </div> */}


                      <div class="col-lg-3 col-md-3">
                          <div class="diagnosis_content">
                            <h6>Blood Pressure</h6>
                            <p href="#" onClick={this.bpPop}>
                              {this.state.fields["systolic"]
                                ? this.state.fields["systolic"] + " Breaths / minute"
                                : this.state.bloodPressureSystolic ? <p>{this.state.bloodPressureSystolic + " Breaths / minute"}</p>: "--"}{" "}
                                {this.state.fields["diastolic"]
                                ? this.state.fields["diastolic"] + " Breaths / minute"
                                : this.state.bloodPressureDiastolic ? <p> {this.state.bloodPressureDiastolic+" Breaths / minute"} </p>: "--"}{" "}
                              <img src="../images/doctor-img/Eprescription video 3/Dropdown-circle.svg" />
                            </p>

                            <div class="popup">
                              <span class="popuptext" id="bptog_Popup">
                                <div class="slidecontainer">
                                  <h1>Blood Pressure</h1>
                                  <p class="bptog_value">
                                    <span id="bptog_demo"></span>Breaths / minute
                                  </p>
                                  {/* <input type="range" min="1" max="100" value="20" class="slider" id="tog_myRange" /> */}
                                  <p class="bptog_value">
                                    <span id="bptog_demo">Systolic</span>
                                  </p>
                                  <Slider
                                    value={this.state.fields["systolic"]}
                                    color="blue"
                                    settings={systolicSettings}
                                  />
                                  <p class="bptog_value">
                                    <span id="bptog_demo">Diastolic</span>
                                  </p>
                                  <Slider
                                    value={this.state.fields["diastolic"]}
                                    color="blue"
                                    settings={diastolicSettings}
                                  />

                                  <div class="tog_btns text-right">
                                    <h5 class="cal_btn" id="bptog_Popup_bp_cancel" onClick={this.popupCancel} >Cancel</h5>
                                    <h5 class="save_btn" onClick={this.saveBloodPressure}>Save</h5>
                                  </div>
                                </div>
                              </span>
                            </div>
                          </div>
                        </div>



                          
                          {/* <div class="col-lg-3 col-md-3">
                            <div class="diagnosis_content">
                              <h6>Temperature</h6>
                              <p>
                                {this.state.fields["temparature"]
                                  ? this.state.fields["temparature"] + " of"
                                  : "--"}{" "}
                                <img src="img/dropdown.svg" />
                              </p>
                            </div>
                            <Slider
                              value={this.state.fields["temparatureSettings"]}
                              color="blue"
                              settings={temparatureSettings}
                            />
                          </div> */}


                        <div class="col-lg-3 col-md-3">
                          <div class="diagnosis_content">
                            <h6>Temperature</h6>
                            <p href="#" onClick={this.tempPop}>
                              {this.state.fields["temparature"]
                                ? this.state.fields["temparature"] + " F"
                                : this.state.temperature ? this.state.temperature + " F" : "--"}{" "}
                             <img src="../images/doctor-img/Eprescription video 3/Dropdown-circle.svg" />
                            </p>

                            <div class="popup">
                              <span class="popuptext" id="temptog_Popup">
                                <div class="slidecontainer">
                                  <h1>Temparature</h1>
                                  <p class="temptog_value">
                                    <span id="temptog_demo"></span>F
                                  </p>
                                  {/* <input type="range" min="1" max="100" value="20" class="slider" id="tog_myRange" /> */}
                                  <Slider
                                    value={this.state.fields["temparature"]}
                                    color="blue"
                                    settings={temparatureSettings}
                                  />
                                  <div class="tog_btns text-right">
                                    <h5 class="cal_btn" id="temptog_Popup_temparature_cancel" onClick={this.popupCancel}>Cancel</h5>
                                    <h5 class="save_btn" onClick={this.saveTemparature}>Save</h5>
                                  </div>
                                </div>
                              </span>
                            </div>
                          </div>
                        </div>


                          {/* <div class="col-lg-3 col-md-3">
                            <div class="diagnosis_content">
                              <h6>Respiratory Rate</h6>
                              <p>
                                {this.state.fields["respiratoryrate"]
                                  ? this.state.fields["respiratoryrate"] +
                                    " Breaths / minute"
                                  : "--"}{" "}
                                <img src="img/dropdown.svg" />
                              </p>
                            </div>
                            <Slider
                              value={this.state.fields["respiratoryrate"]}
                              color="blue"
                              settings={respiratorySettings}
                            />
                          </div> */}

                        <div class="col-lg-3 col-md-3">
                          <div class="diagnosis_content">
                            <h6>Respiratory Rate</h6>
                            <p href="#" onClick={this.respPop}>
                              {this.state.fields["respiratoryrate"]
                                ? this.state.fields["respiratoryrate"] + " Breaths / minute"
                                : this.state.respiratory ? this.state.respiratory+ " Breaths / minute" : "--"}{" "}
                              <img src="../images/doctor-img/Eprescription video 3/Dropdown-circle.svg" />
                            </p>

                            <div class="popup">
                              <span class="popuptext" id="resptog_Popup">
                                <div class="slidecontainer">
                                  <h1>Respiratory Rate</h1>
                                  <p class="resptog_value">
                                    <span id="resptog_demo"></span>Breaths / minute
                                  </p>
                                  {/* <input type="range" min="1" max="100" value="20" class="slider" id="tog_myRange" /> */}
                                  <Slider
                                    value={this.state.fields["respiratoryrate"]}
                                    color="blue"
                                    settings={respiratorySettings}
                                  />
                                  <div class="tog_btns text-right">
                                    <h5 class="cal_btn" id="resptog_Popup_respiratoryrate_cancel" onClick={this.popupCancel} >Cancel</h5>
                                    <h5 class="save_btn" onClick={this.saveRespiratory}>Save</h5>
                                  </div>
                                </div>
                              </span>
                            </div>
                          </div>
                        </div>
                        



                        </div>
                        <div class="row">
                          {/* <div class="col-lg-3 col-md-3">
                            <div class="diagnosis_content">
                              <h6>Blood Glucose</h6>
                              <p>
                                {this.state.glucose
                                  ? this.state.glucose + " mg/ DL"
                                  : "--"}{" "}
                                <img src="img/dropdown.svg" />
                              </p>
                            </div>
                          </div> */}

                        <div class="col-lg-3 col-md-3">
                          <div class="diagnosis_content">
                            <h6>Blood Sugar</h6>
                            <p href="#" onClick={this.bsPop}>
                              {this.state.fields["bloodsugar"]
                                ? this.state.fields["bloodsugar"] + " mg/dL"
                                : this.state.blood_sugar ? this.state.blood_sugar + " mg/dL":"--"}{" "}
                              <img src="../images/doctor-img/Eprescription video 3/Dropdown-circle.svg" />
                            </p>

                            <div class="popup">
                              <span class="popuptext" id="bstog_Popup">
                                <div class="slidecontainer">
                                  <h1>Blood Sugar</h1>
                                  <p class="bstog_value">
                                    <span id="bstog_demo"></span>mg/dL
                                  </p>
                                  {/* <input type="range" min="1" max="100" value="20" class="slider" id="tog_myRange" /> */}
                                  <Slider
                                    value={this.state.fields["bloodsugar"]  }
                                    color="blue"
                                    settings={bloodsugarSettings}
                                  />
                                  <div class="tog_btns text-right">
                                    <h5 class="cal_btn" id="bstog_Popup_bloodsugar_cancel" onClick={this.popupCancel} >Cancel</h5>
                                    <h5 class="save_btn" onClick={this.saveBloodSugar}>Save</h5>
                                  </div>
                                </div>
                              </span>
                            </div>
                          </div>
                        </div>


                          {/* <div class="col-lg-3 col-md-3">
                            <div class="diagnosis_content">
                              <h6>Height</h6>
                              <p>
                                {this.state.height
                                  ? this.state.height + "Ft. inch"
                                  : "--"}{" "}
                                <img src="img/dropdown.svg" />
                              </p>
                            </div>
                          </div> */}

<div class="col-lg-3 col-md-3">
                          <div class="diagnosis_content">
                            <h6>Height</h6>
                           
                            <p href="#" onClick={this.htPop}>
                              {!isNaN(this.state.fields["height"])
                                ? this.state.fields["height"] + " cm"
                                : this.state.height ? this.state.height + " Feet" : "--"}{" "}
                                {/* {this.state.fields["inHeight"]
                                ? this.state.fields["inHeight"] + " Breaths / minute"
                                : "--"}{" "} */}
                              <img src="../images/doctor-img/Eprescription video 3/Dropdown-circle.svg" />
                            </p>

                            <div class="popup">
                              <span class="popuptext" id="httog_Popup">
                                <div class="slidecontainer">
                                  <h1>Height</h1>
                                  <p class="httog_value">
                                    <span id="httog_demo"></span>cm
                                  </p>
                                  {/* <input type="range" min="1" max="100" value="20" class="slider" id="tog_myRange" /> */}
                                  <Slider
                                    value={this.state.fields["ftHeight"]}
                                    color="blue"
                                    settings={heightFeetSettings}
                                  />

                                  <Slider
                                    value={this.state.fields["inHeight"]}
                                    color="blue"
                                    settings={heightInchSettings}
                                  />

                                  ({this.state.fields.height} cm)
                                  
                                  <div class="tog_btns text-right">
                                    <h5 class="cal_btn" id="httog_Popup_Height_cancel" onClick={this.popupCancel}>Cancel</h5>
                                    <h5 class="save_btn" onClick={this.saveHeight}>Save</h5>
                                  </div>
                                </div>
                              </span>
                            </div>
                          </div>
                        </div>



                          {/* <div class="col-lg-3 col-md-3">
                            <div class="diagnosis_content">
                              <h6>Weight</h6>
                              <p>
                                {this.state.weight
                                  ? this.state.weight + " kg"
                                  : "--"}{" "}
                                <img src="img/dropdown.svg" />
                              </p>
                            </div>
                          </div> */}

                        <div class="col-lg-3 col-md-3">
                          <div class="diagnosis_content">
                            <h6>Weight</h6>
                            <p href="#" onClick={this.wtPop}>
                              {this.state.fields["weight"]
                                ? this.state.fields["weight"] + " Kg"
                                : this.state.weight ? this.state.weight + " Kg": "--"}{" "}
                             <img src="../images/doctor-img/Eprescription video 3/Dropdown-circle.svg" />
                            </p>

                            <div class="popup">
                              <span class="popuptext" id="wttog_Popup">
                                <div class="slidecontainer">
                                  <h1>Weight</h1>
                                  <p class="wttog_value">
                                    <span id="wttog_demo"></span>Kg
                                  </p>
                                  {/* <input type="range" min="1" max="100" value="20" class="slider" id="tog_myRange" /> */}
                                  <Slider
                                    value={this.state.fields["weight"]}
                                    color="blue"
                                    settings={weightSettings}
                                  />
                                  <div class="tog_btns text-right">
                                    <h5 class="cal_btn" id="wttog_Popup_weight_cancel" onClick={this.popupCancel} >Cancel</h5>
                                    <h5 class="save_btn" onClick={this.saveWeight}>Save</h5>
                                  </div>
                                </div>
                              </span>
                            </div>
                          </div>
                        </div>




                          <div class="col-lg-3 col-md-3">
                            <div class="diagnosis_content">
                              <h6>BMI</h6>
                              <p>
                                {this.state.bmi
                                  ? this.state.bmi + " kg/M2"
                                  : "--"}{" "}
                                 <img src="../images/doctor-img/Eprescription video 3/Dropdown-circle.svg" />
                              </p>
                            </div>
                          </div>



                        </div>
                      </div>
                      <div class="diagnosis_details_box">
                        <div class="diagnosis_details">
                          <p class={this.state.showdata}>
                            Problem: <span>{this.state.problem}</span>{" "}
                            <span class="diag_edit" onClick={this.problem}>
                            <img src="../images/doctor-img/Eprescription video 3/Edit.svg" />
                              edit
                            </span>
                          </p>
                          <p class={this.state.showtxt}>
                            Problem:
                            <span>
                              <input
                                type="text"
                                name="problem"
                                value={this.state.problem}
                                class="form-control diag_input"
                                placeholder="Write Here"
                                required
                                onChange={this.handleChangeProblem}
                              />
                            </span>
                            <button
                              class="save_button save_txt"
                              onClick={this.updateProblem}
                            >
                              Save
                            </button>
                          </p>
                        </div>
                        <div class="diagnosis_details">
                          <p class={this.state.showHistorydata}>
                            Past Medical History:{" "}
                            <span>{this.state.pastHistoryName}</span>{" "}
                            <span
                              class="diag_edit"
                              onClick={this.pastMedicalHistoryedit}
                            >
                               <img src="../images/doctor-img/Eprescription video 3/Edit.svg" />
                              edit
                            </span>
                          </p>
                          <p class={this.state.showHistorytxt}>
                            Past Medical History::
                            <span>
                              <input
                                type="text"
                                name="pastHistoryName"
                                value={this.state.pastHistoryName}
                                class="form-control diag_input"
                                placeholder="Write Here"
                                required
                                onChange={this.handleHistoryChange}
                              />
                            </span>
                            <button
                              class="save_button save_txt"
                              onClick={this.createPatientMedicalProfile}
                            >
                              Save
                            </button>
                          </p>
                        </div>
                        
                        <div class="diagnosis_details">
                          <p class={this.state.showDrugdata}>
                            Drug Allergies:{" "}
                            <span>{this.state.patientDrugAllergiesNames}</span>{" "}
                            <span
                              class="diag_edit"
                              onClick={this.pastDrugAllergiesedit}
                            >
                               <img src="../images/doctor-img/Eprescription video 3/Edit.svg" />
                              edit
                            </span>
                          </p>

                          <p class={this.state.showDrugtxt}>
                            Drug Allergies:
                            <span>
                              <Multiselect
                                onChange={this.handleChange.bind(
                                  this,
                                  "drug_allergies"
                                )}
                                name="drug_allergies"
                                options={this.state.drugAllergiesOptions} // Options to display in the dropdown
                               // value={this.state.selectedDrugList || ""}
                                selectedValues={this.state.drugAllergiesArrays} // Preselected value to persist in dropdown
                                onSelect={this.onDrugMedicineSelect} // Function will trigger on select event
                                placeholder="Select Drug"
                                onRemove={this.onRemove} // Function will trigger on remove event
                                displayValue="medicinename" // Property name to display in the dropdown options
                              />
                            </span>
                            <button
                              class="save_button save_txt"
                              onClick={this.createPatientMedicalProfile}
                            >
                              Save
                            </button>
                          </p>
                        </div>
                        <div class="diagnosis_details">
                          <p class={this.state.showCurrentMedicationdata}>
                            Current Medication:{" "}
                            <span>{this.state.currentMedication}</span>{" "}
                            <span
                              class="diag_edit"
                              onClick={this.currentMedicationedit}
                            >
                              <img src="../images/doctor-img/Eprescription video 3/Edit.svg" />
                              edit
                            </span>
                          </p>
                          <p class={this.state.showCurrentMedicationtxt}>
                            Current Medication:{" "}
                            <span>
                              <Multiselect
                                onChange={this.handleChange.bind(
                                  this,
                                  "current_medication"
                                )}
                                name="current_medication"
                                options={this.state.medicineOptions} // Options to display in the dropdown
                                value={this.state.selectedMedicineList || ""}
                                selectedValues={
                                  this.state.selectedMedicineValue
                                } // Preselected value to persist in dropdown
                                onSelect={this.onMedicineSelect} // Function will trigger on select event
                                placeholder="Select Medicine"
                                onRemove={this.onMedicineRemove} // Function will trigger on remove event
                                displayValue="medicinename" // Property name to display in the dropdown options
                              />
                            </span>
                            {/* <button>Cancel</button> */}
                            <button
                              class="save_button save_txt"
                              onClick={this.createPatientMedicalProfile}
                            >
                              Save
                            </button>
                          </p>
                        </div>
                        <div class="diagnosis_details">
                          {/* <span class="diag_edit"><img src="https://www.flaticon.com/svg/static/icons/svg/61/61456.svg"/>edit</span> */}
                          <p>Past Medical Records: </p>
                          <div class="med_span"
                            dangerouslySetInnerHTML={{
                              __html: this.state.imagedata,
                            }}
                          />
                          {/* <div class="med_upload_box"><img src={imgurl+this.state.patientMedicalDocument} /></div> */}
                        </div>

                        
                      </div>
                    </div>
                  </div>

                   <div class="Final_diagnosis_section">
                    <div class="diagnosis_head" onClick={this.myFunction.bind(this,'Diagnosis1')}>
                      <h2>Final Diagnostics<img src="../images/doctor-img/Eprescription video 3/Dropdown-circle.svg" /></h2>
                    </div>
                    <div id="Diagnosis1" class="diag_cont diag_hide">

<div class="diagnosis_details">
                          <p>
                            Final Diagnosis:{" "}
                            <span>
                              <input
                                type="text"
                                class="form-control diag_input"
                                placeholder="Write Here"
                                onChange={this.handleFinalDiagnosis}
                                value={this.state.stateFinalDiagnosis}
                              />
                            </span>
                            <button
                              class="save_button save_txt"
                              onClick={this.finalDiagnosis}
                            >
                              Save
                            </button>
                          </p>
                        </div>
                    </div>

                    </div>
                  <div class={this.state.symptomsShow}>
                    <div>
                      <div class="add_pat_head">
                        <h2>Add Patient symptoms</h2>
                      </div>
                      <div class="add_pat_details">
                        <div class="row">
                          <div class="col-lg-4 col-md-4 add_sidemenu">
                            <div class="add_specify_head">
                              <h2>Specify Symptoms</h2>
                            </div>

                            <div class="add_specify_details">
                              <h4>
                                Symptoms related to <span>"headache"</span>
                              </h4>
                              <div>{symptomsRelated}</div>
                              {/* <p>Abnormal Pain  <img src="../images/doctor-img/Eprescription video 3/cancel.svg" /></p>
        <p>Abnormal Pain  <img src="../images/doctor-img/Eprescription video 3/cancel.svg" /></p>  */}
                            </div>
                          </div>
                          <div class="col-lg-8 col-md-8">
                            <div class="panel with-nav-tabs panel-default specify_tabs">
                              <div class="panel-heading">
                                <ul class="nav nav-tabs">
                                  <li >
                                    <a class="active"
                                     
                                      href="#searchsymptom"
                                      data-toggle="tab"
                                    >
                                      Search symptom
                                    </a>
                                  </li>

                                  <li>
                                    <a href="#selectsymptom" data-toggle="tab">
                                      Select symptom from body
                                    </a>
                                  </li>
                                </ul>
                              </div>
                            </div>

                            {/* <form onSubmit={this.onFormSubmit.bind(this)}> */}
                            <div class="panel-body">
                              <div class="tab-content">
                                <div class="tab-pane active" id="searchsymptom">
                                  <div class="main_symp_details">
                                    <h2>What is your main symptom ?</h2>
                                  </div>
                                  <div class="main_symp_box">
                                    <div id="custom-search-input">
                                      <div class="input-group">
                                        {/* <input type="text" class=" search-query form-control" placeholder="Search" /> */}
                                        <Multiselect
                                          onChange={this.handleChange.bind(
                                            this,
                                            "symptoms"
                                          )}
                                          name="symptoms"
                                          options={this.state.symptomsOptions} // Options to display in the dropdown
                                          value={
                                            this.state.selectedSymptomsList ||
                                            ""
                                          }
                                          selectedValues={
                                            this.state.selectedSymptomsValue
                                          } // Preselected value to persist in dropdown
                                          onSelect={this.onSymptomsSelect} // Function will trigger on select event
                                          placeholder="Search Symptom"
                                          onRemove={this.onSymptomsRemove} // Function will trigger on remove event
                                          displayValue="description" // Property name to display in the dropdown options
                                        />

                                        <span class="input-group-btn">
                                          {/* <button class="btn btn-primary" type="button">
                                    <span><i class="fa fa-search"></i></span>
                                </button> */}
                                        </span>
                                      </div>
                                    </div>
                                    {/* <p>Abdominal Pain</p>
                                    <p>Lump in Abdomen</p>
                                    <p>Bloating</p>
                                    <p>Diarrhea</p>
                                    <p>Abdominal Pain</p>
                                    <p>Lump in Abdomen</p>
                                    <p>Bloating</p>
                                    <p>Diarrhea</p> */}
                                  </div>
                                  <div class="main_symp_details">
                                    <h2>Add new symptoms ( optional )</h2>
                                  </div>
                                  <div class="add_new_symp">
                                    <input
                                      type="text"
                                      class="form-control"
                                      placeholder="write symptoms"
                                      defaultValue={this.state.addedSymptoms}
                                      onKeyUp={this.handleNewSymptoms}
                                    />
                                  </div>
                                </div> 


                                <div class="tab-pane" id="selectsymptom">
                                  {/* <div class="symptom_body_img">
                                    <img src="img/Patient Intake Process/man_img.png" />
                                    <p>click on the body modal</p>
                                  </div>
                                  <div class="rotate_modal">
                                    <img src="img/Patient Intake Process/rotatemodel.svg" />
                                    <span> Rotate modal</span>
                                  </div> */}
                                  <div class="col-md-8 col-sm-8">
                                    <div id="contentContainer">
                                    <div id="thing">
                                        <ul class="list-group">
                                          {this.state.icd_code_data
                                            ? this.state.icd_code_data.map(
                                                (icdarr, num) => {
                                                  return (
                                                    <li
                                                      class="list-group-item lower_leg icdBodyCode"
                                                      id={icdarr.id}
                                                      data-description = {icdarr.description}
                                                      data-code = {icdarr.code}
                                                      onClick={this.clickBodyCode}
                                                    >
                                                      {icdarr.description}{" "}
                                                    </li>
                                                  );
                                                }
                                              )
                                            : ""}
                                        </ul>
                                      </div>
                                  {this.state.gender=='male' ? (
                                    <div
                                          class="symptoms_part"
                                          id="men_body"
                                        >
                                          <div class="symptom_body_img">
                                            <div class="man_img">
                                              <div id="svg_figure">
                                                {/* <!--front body--> */}
                                                <svg
                                                  class="male-front-s"
                                                  id="mail_front"
                                                  viewBox="0 0 168 320"
                                                  xmlns="http://www.w3.org/2000/svg"
                                                  fill-rule="evenodd"
                                                  stroke-linejoin="round"
                                                  stroke-miterlimit="1.414"
                                                >
                                                  <g>
                                                    <path d="M83.153 168.24l-.024.407a107.793 107.793 0 0 1-.768 7.98 88.015 88.015 0 0 1-.604 3.788c-.402 2.208-.901 4.396-1.434 6.575a378.692 378.692 0 0 1-1.221 4.828c-.606 2.342-1.223 4.682-1.83 7.024-.27 1.062-.528 2.126-.773 3.194a152.9 152.9 0 0 0-1.681 8.512 171.51 171.51 0 0 0-1.185 8.14c-.078.647-.152 1.294-.219 1.941-.018.168-.037.336-.052.505-.016.19-.031.38-.05.569-.023.195-.048.388-.075.581-.255 1.708-.739 3.371-1.299 5-.614 1.786-1.318 3.54-1.997 5.302-.15.396-.3.791-.447 1.187a58.83 58.83 0 0 0-.582 1.636c-.14.416-.279.834-.399 1.256-.099.348-.186.699-.263 1.052-.195.89-.329 1.793-.425 2.699a36.487 36.487 0 0 0-.183 2.881 44.62 44.62 0 0 0 .127 4.706l.002.059c-.072 2.704-.185 5.409-.451 8.102a49.904 49.904 0 0 1-.418 3.249 27.916 27.916 0 0 1-.755 3.371c-.269.905-.602 1.79-.99 2.651-.465 1.032-1.003 2.03-1.511 3.042l-.258.523a38.13 38.13 0 0 0-1.071 2.422c-.332.834-.63 1.68-.908 2.533-.22.676-.428 1.357-.623 2.041a50.528 50.528 0 0 0-1.54 7.373 35.57 35.57 0 0 0-.314 4.623c.002.537.019 1.074.061 1.61.038.477.096.953.196 1.421.049.208.107.413.161.621.08.304.158.608.235.912.267 1.074.527 2.155.696 3.248.057.36.105.724.115 1.088.005.216 0 .441-.066.648a.885.885 0 0 1-.059.147c-.025.048-.056.093-.081.142a3.198 3.198 0 0 0-.062.146 13.53 13.53 0 0 0-.412 1.295 52.98 52.98 0 0 0-.456 1.763l.034.303c.155 1.57.22 3.158-.045 4.721a15.53 15.53 0 0 1-.189.927c-.031.134-.076.318-.106.44a.827.827 0 0 1-.054.154 1.404 1.404 0 0 1-.173.282c-.093.113-.195.221-.283.338a1.225 1.225 0 0 0-.152.268 1.509 1.509 0 0 0-.096.528c-.006.257.027.514.077.766.019.101.042.201.067.301.039.154.082.306.13.458.056.181.118.359.175.54a8.365 8.365 0 0 1 .225.926c.12.671.145 1.367.005 2.038a3.548 3.548 0 0 1-.333.942 2.54 2.54 0 0 1-.256.395c-.045.056-.096.105-.145.157-.044.046-.051.055-.097.109a6.13 6.13 0 0 0-.189.237c-.296.403-.552.832-.785 1.273-.123.233-.236.47-.352.707-.049.094-.049.094-.1.186a3.822 3.822 0 0 1-.6.78c-.13.129-.271.247-.419.354-.696.503-1.544.739-2.391.811a7.201 7.201 0 0 1-.465.024c-.175.004-.35.004-.522-.021a2.012 2.012 0 0 1-.593-.188c-.328-.166-.6-.42-.834-.701a7.913 7.913 0 0 1-.532-.736c-.232.28-.47.556-.711.828a2.085 2.085 0 0 1-.342.272c-.357.232-.778.372-1.208.344-.493-.033-.932-.289-1.267-.644a2.682 2.682 0 0 1-.131-.149l-.022.02c-.371.327-.903.355-1.369.284a3.384 3.384 0 0 1-.611-.155.779.779 0 0 1-.23-.198 1.963 1.963 0 0 1-.275-.422c-.019-.04-.036-.081-.053-.122-.072.017-.145.03-.217.04-.168.026-.338.04-.506.05-.161.01-.323.017-.483-.006a1.07 1.07 0 0 1-.741-.431 1.336 1.336 0 0 1-.163-.293l-.014.002a.997.997 0 0 1-.197.008c-.343-.022-.634-.231-.869-.469a3.098 3.098 0 0 1-.217-.242 1.995 1.995 0 0 1-.215-.302 2.402 2.402 0 0 1-.248-.709 5.1 5.1 0 0 1-.09-1.076 9.997 9.997 0 0 1 .216-1.896c.059-.284.127-.567.212-.845.065-.212.138-.423.228-.626.117-.262.269-.508.423-.748.181-.281.372-.556.568-.829a62.215 62.215 0 0 1 1.862-2.452l.126-.159c.04-.05.08-.102.121-.15.019-.023.042-.045.062-.067a7.28 7.28 0 0 0 .375-.45c.39-.514.726-1.067 1.031-1.635.287-.533.547-1.08.791-1.633a38.105 38.105 0 0 0 1.142-2.961 16.12 16.12 0 0 1-.263-1.43 13.473 13.473 0 0 1-.113-1.946c.014-1.108.159-2.212.349-3.302.177-1.02.386-2.034.594-3.049.068-.329.138-.659.203-.989.021-.119.041-.239.058-.359.092-.694.13-1.393.15-2.092.019-.617.022-1.236.015-1.854a115.45 115.45 0 0 0-.206-5.39 241.084 241.084 0 0 0-.501-6.738c-.223-2.576-.477-5.15-.757-7.72l-.025-.229c-.411-4.537-.637-9.1-.456-13.655a62.65 62.65 0 0 1 .427-5.335c.214-1.704.509-3.399.916-5.067a34.865 34.865 0 0 1 1.874-5.594c.196-.461.399-.918.594-1.378.067-.161.133-.323.197-.484.387-1.017.673-2.07.902-3.133.292-1.352.49-2.72.668-4.09.103-.814.201-1.629.304-2.443.036-.284.077-.568.111-.852.134-1.182.204-2.373.265-3.561.084-1.635.136-3.27.165-4.906.026-1.474.033-2.948.008-4.421a54.546 54.546 0 0 0-.15-3.454c-.04-.494-.098-.986-.154-1.479-.166-1.415-.343-2.828-.512-4.243a264.138 264.138 0 0 1-.654-6.156 235.162 235.162 0 0 1-.666-9.151 282.026 282.026 0 0 1-.161-3.436c-.036-.911-.07-1.821-.086-2.733a89.552 89.552 0 0 1 .001-3.278c.058-3.229.28-6.453.627-9.663.211-1.964.474-3.921.764-5.874.186-1.225.385-2.45.568-3.677.042-.285.084-.571.116-.858.016-.148.033-.297.033-.447-.001-.039-.005-.08-.007-.119v-.128c.022-.415.094-.828.163-1.239.084-.51.178-1.02.274-1.528.292-1.544.608-3.084.93-4.622a991.211 991.211 0 0 1 2.913-13.412l.185-.829a335 335 0 0 1 .067-4.074c.022-.904.046-1.809.086-2.713.018-.419.04-.84.07-1.259.019-.26.04-.521.079-.779.031-.201.087-.397.132-.595.039-.185.076-.37.113-.555a62.18 62.18 0 0 0 .542-3.46 87.047 87.047 0 0 0 .602-6.594c.033-.609.062-1.217.062-1.827 0-.693-.032-1.387-.091-2.078-.235-2.765-.903-5.467-1.616-8.142-.323-1.2-.655-2.398-.981-3.598-.256-.95-.508-1.901-.744-2.857-.11-.444-.223-.888-.318-1.336a26.016 26.016 0 0 1-.107-.543l-1.339 2.793a1002.303 1002.303 0 0 0-3.618 7.634c-.331.71-.66 1.42-.986 2.131a47.141 47.141 0 0 0-.882 2.026 32.287 32.287 0 0 0-1.47 4.668l-.031.138-.021.096c-.039.294-.079.588-.122.882-.172 1.155-.377 2.31-.796 3.405-.313.821-.735 1.593-1.17 2.355-.434.758-.88 1.509-1.319 2.264-.29.503-.58 1.008-.867 1.513-.285.506-.566 1.014-.848 1.521-.125.222-.252.442-.379.664-1.198 2.053-2.49 4.048-3.824 6.016a234.013 234.013 0 0 1-4.788 6.767c-1.111 1.521-2.241 3.028-3.355 4.547-.182.252-.361.506-.545.756-.306.409-.624.809-.932 1.218a11.35 11.35 0 0 0-1.238 2.053c-.394.851-.68 1.749-.902 2.659a27.073 27.073 0 0 0-.551 3.134c-.066.541-.116 1.084-.175 1.626l-.075.65c-.267 2.119-.646 4.224-1.197 6.289a32.84 32.84 0 0 1-.615 2.051 21.042 21.042 0 0 1-.644 1.691l-.07.145a29.264 29.264 0 0 0-.639 1.672c-.05.147-.098.295-.141.443-.02.072-.044.147-.058.221-.019.12-.022.243-.027.363-.007.185-.01.371-.012.556-.005.519.001 1.037.006 1.555.021 1.49.056 2.98.076 4.471.004.396.008.791.006 1.186-.002.288 0 .581-.029.87a3.919 3.919 0 0 1-.095.524c-.047.187-.11.372-.2.544a1.467 1.467 0 0 1-.396.485c-.142.111-.306.19-.48.24a1.583 1.583 0 0 1-.484.064 1.074 1.074 0 0 1-.219-.034c-.424-.112-.726-.473-.935-.84a3.552 3.552 0 0 1-.195-.404l-.026-.066c-.015-.043-.03-.08-.04-.126-.006-.026-.007-.051-.01-.076l-.378-7.678a3.853 3.853 0 0 0-.012-.415 2.262 2.262 0 0 0-.066-.385.856.856 0 0 0-.084-.208.582.582 0 0 0-.054.079c-.127.219-.193.468-.246.713l-.012.061c-.02.119-.031.239-.047.357-.02.146-.027.187-.048.333-.035.227-.072.455-.111.681-.503 2.827-1.317 5.586-2.123 8.338-.055.191-.11.382-.167.574-.05.165-.102.331-.159.494-.042.12-.086.24-.135.357-.174.426-.4.861-.775 1.143a1.532 1.532 0 0 1-.622.276 2.3 2.3 0 0 1-.543.034 2.507 2.507 0 0 1-.275-.023 1.108 1.108 0 0 1-.36-.124 1.219 1.219 0 0 1-.467-.493 2.181 2.181 0 0 1-.223-.792 5.153 5.153 0 0 1 .026-1.197l.005-.032 1.664-9.862c.034-.135.079-.269.116-.403.032-.123.061-.247.085-.371l.002-.011a7.647 7.647 0 0 0-.382.633c-.145.264-.281.535-.41.808a34.488 34.488 0 0 0-.855 1.975 88.333 88.333 0 0 0-1.68 4.616c-.143.424-.284.847-.425 1.272-.096.292-.19.586-.291.877-.032.09-.067.18-.103.268a3.346 3.346 0 0 1-.526.876 2.22 2.22 0 0 1-.57.474 2.382 2.382 0 0 1-1.251.295 2.4 2.4 0 0 1-.478-.048 1.13 1.13 0 0 1-.615-.381c-.283-.338-.361-.802-.368-1.232a4.482 4.482 0 0 1 .031-.571c.014-.131.036-.261.061-.391l.005-.026c.144-.556.338-1.098.509-1.646a3638.822 3638.822 0 0 1 2.205-7.083c.17-.544.339-1.09.516-1.633.017-.051.018-.051.038-.099.057-.117.11-.237.164-.355l.063-.15.031-.074c-.103.125-.201.252-.298.382-.47.625-.908 1.274-1.336 1.929a110.062 110.062 0 0 0-1.78 2.856c-.259.446-.509.896-.756 1.349-.015.029-.023.061-.035.092l-.059.138-.127.273c-.197.387-.421.764-.718 1.084-.18.192-.386.362-.623.478-.195.096-.41.152-.628.153a1.493 1.493 0 0 1-.774-.222 1.461 1.461 0 0 1-.391-.335c-.2-.252-.3-.565-.334-.882a3.313 3.313 0 0 1 .022-.79c.05-.363.14-.719.248-1.069.22-.717.515-1.41.824-2.093.183-.404.375-.804.555-1.208.064-.148.122-.298.185-.446.334-.756.723-1.488 1.116-2.215a45.43 45.43 0 0 1 1.287-2.248c.097-.157.2-.31.3-.464.022-.039.041-.077.061-.117.116-.257.201-.527.281-.798.089-.302.167-.608.24-.914.193-.81.351-1.629.475-2.452-.157.193-.311.39-.467.586-.449.576-.892 1.159-1.349 1.732l-.192.231c-.253.277-.58.474-.922.621-.743.319-1.606.421-2.39.2a2.895 2.895 0 0 1-.51-.198 1.79 1.79 0 0 1-.31-.193 1.074 1.074 0 0 1-.396-.78c-.016-.356.128-.698.305-1 .157-.264.345-.51.542-.745.264-.313.547-.608.834-.899.223-.225.449-.447.669-.673.072-.077.144-.153.212-.233.181-.222.311-.479.436-.737.181-.384.346-.776.524-1.162.255-.541.54-1.074.936-1.526a4.48 4.48 0 0 1 .516-.487 11.9 11.9 0 0 1 .619-.48 40.722 40.722 0 0 1 1.962-1.332 86.388 86.388 0 0 1 1.577-.987l.5-.304c.067-.04.133-.081.202-.121.103-.057.213-.105.32-.155.199-.091.4-.174.604-.251a8.26 8.26 0 0 1 1.595-.423 5.18 5.18 0 0 1 .173-.361c.241-.47.511-.924.78-1.379.711-1.193 1.436-2.379 2.147-3.572 1.926-3.243 3.774-6.538 5.342-9.971a54.565 54.565 0 0 0 1.61-3.885 36.739 36.739 0 0 0 1.13-3.592c.187-.735.346-1.478.467-2.227.077-.484.133-.971.203-1.457a34.97 34.97 0 0 1 1.156-5.133 33.135 33.135 0 0 1 5.133-10.082c.224-.298.452-.594.683-.887.206-.263.417-.523.621-.789l.191-.257c.204-.26.424-.506.645-.751l.471-.528c.142-.164.284-.328.423-.494a14.99 14.99 0 0 0 1.302-1.814c.499-.833.895-1.727 1.163-2.661.128-.45.228-.907.298-1.37.049-.329.081-.66.12-.99.03-.234.061-.467.094-.701a47.275 47.275 0 0 1 1.042-4.951 74.743 74.743 0 0 1 1.209-4.095c.194-.591.393-1.181.599-1.768.123-.351.253-.701.373-1.052.052-.154.1-.308.147-.461.05-.175.099-.351.129-.531.005-.029.005-.029.008-.06v-.001l-.021-.077a55.636 55.636 0 0 1-.357-2.793 45.986 45.986 0 0 1-.164-2.134 41.233 41.233 0 0 1-.057-1.793c-.033-3.501.407-7.05 1.68-10.329.169-.436.352-.866.552-1.289.305-.65.645-1.284 1.02-1.897a18.616 18.616 0 0 1 1.812-2.478 19.054 19.054 0 0 1 2.042-2.026 21.792 21.792 0 0 1 1.677-1.292c1.428-.996 2.981-1.846 4.665-2.312a11.532 11.532 0 0 1 3.082-.405c.879-.001 1.756.087 2.633.139.159.008.318.015.478.02.64.013 1.287-.013 1.911-.168.263-.066.518-.16.769-.264.318-.132.628-.282.933-.442a24.631 24.631 0 0 0 2.312-1.396 45.377 45.377 0 0 0 2.636-1.915 48.993 48.993 0 0 0 2.496-2.075 34.618 34.618 0 0 0 1.48-1.387c.34-.339.672-.686.986-1.05.214-.249.421-.504.601-.778.057-.086.11-.174.157-.265a.946.946 0 0 0 .082-.204c.008-.032.01-.067.012-.1.008-.096.011-.192.013-.288.005-.219 0-.44-.007-.659-.021-.66-.071-1.32-.125-1.979-.168-2.019-.404-4.033-.651-6.043l-.051-.408-.03-.233a3.501 3.501 0 0 1-.347-.682 2.752 2.752 0 0 1-.188-.923v.008l-.39-3.009-.061.003a2.406 2.406 0 0 1-.723-.114 3.174 3.174 0 0 1-.72-.325c-.229-.14-.456-.317-.602-.546a3.257 3.257 0 0 1-.295-.67 17.65 17.65 0 0 1-.342-1.128 38.729 38.729 0 0 1-.714-3.206 4.663 4.663 0 0 1-.06-.454c-.019-.277-.039-.554-.05-.831a9.72 9.72 0 0 1 .015-1.017 6.056 6.056 0 0 1 .068-.528c.073-.385.212-.791.485-1.078-.026-.257-.048-.515-.07-.772a106.275 106.275 0 0 1-.277-4.219 66.016 66.016 0 0 1-.075-3.359c.005-.882.03-1.765.105-2.644.065-.747.16-1.499.373-2.22.074-.236.154-.471.234-.704.219-.634.452-1.267.762-1.861.291-.558.661-1.08 1.162-1.469.32-.249.681-.436 1.061-.574.511-.188 1.045-.292 1.582-.377l.079-.052c1.08-.698 2.246-1.266 3.443-1.736A21.897 21.897 0 0 1 82.235.169a21.556 21.556 0 0 1 2.858-.168c1.713.026 3.432.242 5.081.716 1.213.348 2.387.845 3.46 1.513a11.474 11.474 0 0 1 2.218 1.796c.915.958 1.653 2.08 2.169 3.299.201.475.37.965.497 1.466.079.308.145.621.181.938.028.25.016.5.005.752-.014.323-.033.647-.053.969-.059.947-.126 1.893-.194 2.839-.184 2.526-.384 5.051-.584 7.577l-.032.396a3.613 3.613 0 0 1 .12.61 6.96 6.96 0 0 1 .046.824c0 .184-.005.367-.013.551-.013.248-.03.496-.048.742l-.017.158a22.855 22.855 0 0 1-.328 1.716 34.06 34.06 0 0 1-.539 2.154c-.085.295-.175.589-.284.876a2.438 2.438 0 0 1-.277.569 1.69 1.69 0 0 1-.403.384 3.06 3.06 0 0 1-.51.29 3.327 3.327 0 0 1-.371.141 3.372 3.372 0 0 1-.191.051c-.15.035-.31.06-.469.063-.259 2.537-.49 4.578-.513 2.998a2.503 2.503 0 0 1-.007.151c-.007.074-.007.074-.017.148a3.363 3.363 0 0 1-.422 1.161l-.003.079c-.065.432-.128.863-.191 1.296-.26 1.834-.509 3.671-.692 5.514a37.075 37.075 0 0 0-.147 1.825c-.011.231-.02.463-.019.695 0 .154.003.309.02.464a.505.505 0 0 0 .012.053c.034.098.081.189.133.277.072.123.153.241.238.355.26.352.553.678.853.996.46.485.944.947 1.437 1.397a51.095 51.095 0 0 0 4.26 3.442 37.794 37.794 0 0 0 2.488 1.664c.603.368 1.222.718 1.863 1.018.457.213.93.408 1.425.507.901.181 1.824.127 2.732.054a88.02 88.02 0 0 1 1.033-.083l.543-.032a15.86 15.86 0 0 1 1.154-.009c.605.021 1.21.088 1.805.207 2.011.399 3.86 1.367 5.532 2.529.582.404 1.146.833 1.686 1.293a18.921 18.921 0 0 1 4.437 5.522 20.998 20.998 0 0 1 1.473 3.533c.647 2.048 1.002 4.181 1.151 6.321.212 3.063.001 6.137-.426 9.173l-.02.074c.011.113.042.226.071.336.041.157.09.312.141.467.17.519.371 1.028.557 1.542a77.661 77.661 0 0 1 1.779 5.598c.318 1.164.605 2.338.84 3.521.124.626.234 1.255.323 1.888.048.336.084.674.131 1.012.02.137.042.276.066.413.091.485.21.966.363 1.436.238.727.555 1.429.937 2.093.495.856 1.097 1.639 1.747 2.381.351.394.711.779 1.061 1.174.079.094.159.187.236.285.064.08.123.164.187.244l.187.222c.344.389.694.772 1.036 1.163a32.042 32.042 0 0 1 2.803 3.707 30.154 30.154 0 0 1 3.078 6.318c.422 1.205.77 2.436 1.045 3.683.14.635.256 1.274.366 1.914.044.242.044.241.091.481.084.41.174.819.274 1.226a40.66 40.66 0 0 0 1.266 4.107 65.684 65.684 0 0 0 1.595 3.959c1.366 3.11 2.923 6.135 4.554 9.114.984 1.798 2.005 3.574 3.003 5.365.135.242.268.486.4.73.105.199.211.397.311.598.067.134.133.271.193.409.119.026.239.052.358.082a8.954 8.954 0 0 1 1.804.683c.235.14.468.282.702.423a65.61 65.61 0 0 1 2.92 1.88c.336.232.668.469.99.72.31.242.611.495.86.801.595.73.928 1.624 1.315 2.47.048.102.097.204.148.304.087.164.177.329.29.478.078.104.17.197.259.292.263.27.532.535.797.804.264.272.526.548.767.842.174.213.34.434.481.673.177.3.321.644.304 1a1.062 1.062 0 0 1-.396.779 1.651 1.651 0 0 1-.31.192 2.845 2.845 0 0 1-.583.218c-.725.185-1.508.099-2.2-.172a3.036 3.036 0 0 1-.85-.488c-.144-.121-.261-.267-.38-.412-.457-.571-.899-1.155-1.349-1.731l-.035-.043a36.91 36.91 0 0 0 .878 2.325c.141.339.287.68.464 1.004.048.09.105.173.161.257.06.09.084.13.144.223.115.185.228.372.341.56.39.661.765 1.331 1.128 2.007a34.2 34.2 0 0 1 .889 1.75c.061.132.121.264.176.398.044.107.086.215.132.321.181.404.371.805.556 1.208.237.53.468 1.063.663 1.609.126.355.239.715.322 1.083.112.494.183 1.03.062 1.532-.053.22-.147.43-.288.608a1.415 1.415 0 0 1-.391.336c-.26.155-.56.24-.865.218a1.539 1.539 0 0 1-.68-.227 2.584 2.584 0 0 1-.673-.629 5.524 5.524 0 0 1-.746-1.357c-.021-.056-.058-.107-.086-.159-.039-.069-.076-.139-.113-.208-.146-.263-.151-.271-.304-.543-.11-.194-.22-.388-.334-.579-.134-.226-.273-.449-.411-.672a98.037 98.037 0 0 0-.982-1.57c-.308-.48-.62-.957-.942-1.427a22.532 22.532 0 0 0-.982-1.339l-.015-.019c.082.202.171.4.266.596.065.168.126.337.188.506 1.006 2.755 2.004 5.512 3.004 8.269l.58 1.601c.045.158.067.322.086.485a4.98 4.98 0 0 1 .031.572c-.007.452-.095.943-.415 1.283a1.091 1.091 0 0 1-.353.255 1.291 1.291 0 0 1-.366.1c-.111.01-.11.01-.221.017a2.837 2.837 0 0 1-.801-.068 2.163 2.163 0 0 1-.744-.344c-.501-.366-.802-.924-1.01-1.497-.165-.48-.33-.96-.5-1.44-.673-1.894-1.376-3.78-2.181-5.622a28.854 28.854 0 0 0-.884-1.864c-.238-.455-.491-.912-.815-1.313l-.003-.005c.041.173.09.344.135.516l.031.13c.793 3.523 1.537 7.058 2.304 10.586.014.096.025.192.034.289.032.373.037.751-.026 1.121a1.96 1.96 0 0 1-.231.679c-.146.247-.37.441-.645.525a1.92 1.92 0 0 1-.523.061 2.032 2.032 0 0 1-.544-.06 1.513 1.513 0 0 1-.565-.287c-.367-.298-.591-.744-.759-1.177a8.74 8.74 0 0 1-.161-.445 16.143 16.143 0 0 1-.16-.516c-.06-.209-.122-.416-.186-.622-.276-.895-.56-1.787-.836-2.682a79.31 79.31 0 0 1-1.165-4.116c-.26-1.047-.491-2.103-.624-3.174a1.565 1.565 0 0 0-.065-.145 1.145 1.145 0 0 0-.224-.315l-.009-.008-.005-.005c-.014.065-.023.13-.033.195-.03.262-.037.526-.029.789l-.118 7.794c-.003.027-.003.056-.008.084-.018.097-.064.193-.103.283a3.515 3.515 0 0 1-.127.262c-.21.39-.521.783-.969.901-.071.019-.145.03-.219.034a1.599 1.599 0 0 1-.901-.258 1.398 1.398 0 0 1-.379-.395 2.217 2.217 0 0 1-.278-.681c-.093-.376-.121-.76-.146-1.145-.025-.38-.046-.76-.067-1.139-.081-1.549-.152-3.099-.232-4.646-.025-.473-.052-.945-.08-1.417-.03-.475-.057-.951-.11-1.423a3.664 3.664 0 0 0-.021-.146 3.019 3.019 0 0 0-.118-.386 11.233 11.233 0 0 0-.191-.489 25.367 25.367 0 0 0-.677-1.472c-.029-.058-.059-.118-.091-.176a5.435 5.435 0 0 1-.105-.183c-.057-.105-.056-.105-.111-.211-.559-1.111-.972-2.294-1.312-3.488a35.214 35.214 0 0 1-1.022-5.056 42.063 42.063 0 0 1-.151-1.279c-.031-.309-.061-.619-.097-.929a21.409 21.409 0 0 0-.722-3.579 17.304 17.304 0 0 0-1.213-3.026 19.073 19.073 0 0 0-1.092-1.835c-.376-.563-.775-1.108-1.161-1.664-.135-.198-.263-.399-.399-.596-.48-.679-1.007-1.324-1.528-1.972-.66-.819-1.323-1.635-1.983-2.455-.384-.479-.769-.96-1.151-1.442-2.269-2.876-4.468-5.815-6.419-8.918a49.443 49.443 0 0 1-1.514-2.571c-.352-.642-.686-1.294-1.031-1.939-.191-.353-.384-.705-.578-1.058-.582-1.047-1.182-2.085-1.772-3.129-.111-.2-.221-.399-.33-.6a19.644 19.644 0 0 1-.496-.983c-.19-.41-.358-.832-.501-1.261-.371-1.122-.561-2.292-.723-3.459l-.027-.206a32.365 32.365 0 0 0-.751-2.438 39.37 39.37 0 0 0-1.099-2.84 51.662 51.662 0 0 0-.841-1.801c-.457-.941-.924-1.877-1.394-2.813a684.038 684.038 0 0 0-4.547-8.854c-.033.183-.07.365-.108.547-.095.448-.207.892-.318 1.336-.185.747-.38 1.491-.577 2.235-.378 1.409-.768 2.813-1.149 4.221-.689 2.585-1.337 5.195-1.591 7.865a24.724 24.724 0 0 0-.116 2.494c.006.748.049 1.496.094 2.242a86.75 86.75 0 0 0 .728 7.183c.077.529.161 1.056.252 1.582.074.432.153.861.246 1.289.031.145.068.288.102.432.016.081.016.08.029.163.065.452.091.91.116 1.366.034.598.057 1.195.076 1.793.059 1.791.088 3.582.108 5.373l.003.306c.513 2.946 1.048 5.89 1.615 8.828.223 1.16.453 2.32.692 3.477.23 1.105.465 2.208.729 3.305.128.535.272 1.067.411 1.601.066.259.131.517.194.775.423 1.768.798 3.548 1.158 5.329a292.3 292.3 0 0 1 1.176 6.164c.361 1.998.702 3.998 1.01 6.005.112.736.22 1.472.318 2.21.094.703.181 1.408.248 2.114.061.651.095 1.304.132 1.957.046.821.086 1.642.12 2.464a202 202 0 0 1 .171 7.784c.009 3.194-.048 6.389-.174 9.581a177.761 177.761 0 0 1-.435 7.476c-.037.451-.076.903-.12 1.354-.034.359-.073.717-.108 1.075a32 32 0 0 0-.051.629c-.134 1.921-.137 3.851-.076 5.776.058 1.831.17 3.664.361 5.487.063.612.145 1.221.226 1.831.099.745.196 1.491.297 2.236.258 1.904.538 3.808.892 5.697.151.8.314 1.598.506 2.389.149.61.312 1.219.515 1.813.06.177.123.353.194.526.138.337.292.665.449.994.222.469.45.937.671 1.408a44.91 44.91 0 0 1 1.359 3.175c.454 1.189.85 2.399 1.191 3.625.901 3.234 1.424 6.567 1.685 9.911.272 3.483.261 6.985.06 10.472a103.37 103.37 0 0 1-.257 3.425c0 .807.002 1.615.006 2.424.024 4.374.082 8.75.246 13.122.06 1.586.134 3.173.246 4.756.046.656.1 1.311.166 1.966.06.602.134 1.203.24 1.8.07.371.15.74.226 1.109.11.536.219 1.072.326 1.609.257 1.32.505 2.648.589 3.992.049.798.038 1.598-.05 2.392-.044.413-.109.825-.191 1.232-.031.16-.066.32-.103.479l-.004.02c.456 1.348.973 2.677 1.601 3.953.237.479.488.95.767 1.404.304.494.638.967 1.034 1.391.204.256.407.513.609.77a57.838 57.838 0 0 1 1.623 2.165c.185.265.367.531.538.805.11.174.214.352.302.538.081.173.147.354.207.536.088.269.16.543.221.819.159.708.257 1.439.255 2.167-.001.33-.023.66-.09.984a2.408 2.408 0 0 1-.249.708c-.061.11-.135.207-.214.303-.07.083-.141.164-.217.241-.262.264-.606.499-.995.468-.028-.003-.057-.006-.085-.011a1.295 1.295 0 0 1-.192.332 1.095 1.095 0 0 1-.713.394c-.194.027-.392.012-.586-.002a3.943 3.943 0 0 1-.621-.083 1.864 1.864 0 0 1-.245.443 1.186 1.186 0 0 1-.233.252.836.836 0 0 1-.278.113 3.895 3.895 0 0 1-.34.078c-.45.077-.963.074-1.351-.202a1.192 1.192 0 0 1-.111-.091 2.095 2.095 0 0 1-.132.149c-.334.355-.773.612-1.266.644-.43.027-.851-.113-1.208-.345a2.056 2.056 0 0 1-.322-.25l-.021-.022a35.106 35.106 0 0 1-.71-.827c-.034.051-.067.103-.102.153-.338.496-.715 1.007-1.265 1.284a1.964 1.964 0 0 1-.593.188 3.044 3.044 0 0 1-.523.021 7.17 7.17 0 0 1-.464-.024c-.936-.079-1.876-.363-2.604-.978a3.68 3.68 0 0 1-.857-1.058c-.09-.167-.167-.341-.251-.51a28.626 28.626 0 0 0-.222-.427 9.295 9.295 0 0 0-.757-1.195 4.25 4.25 0 0 0-.2-.244c-.051-.056-.106-.108-.157-.165a2.692 2.692 0 0 1-.104-.135c-.602-.877-.694-2.005-.549-3.032a8.11 8.11 0 0 1 .265-1.171c.056-.181.118-.359.175-.54.036-.115.07-.232.102-.349.094-.364.172-.737.173-1.115 0-.221-.029-.448-.124-.65-.097-.208-.265-.37-.408-.546a1.334 1.334 0 0 1-.214-.386c-.045-.161-.081-.326-.119-.49a15.338 15.338 0 0 1-.189-.926 12.248 12.248 0 0 1-.15-1.268c-.085-1.254.001-2.512.137-3.76l-.15-.614a42.444 42.444 0 0 0-.431-1.59 14.42 14.42 0 0 0-.169-.535c-.053-.154-.107-.312-.179-.46-.023-.049-.053-.095-.079-.142-.02-.04-.02-.04-.037-.079-.108-.307-.099-.639-.077-.959.032-.425.098-.847.173-1.266.184-1.028.428-2.046.685-3.057.057-.226.117-.453.175-.678.05-.187.105-.373.148-.561.016-.076.015-.076.03-.153a8.422 8.422 0 0 0 .102-1.53 18.807 18.807 0 0 0-.109-1.76 33.43 33.43 0 0 0-.354-2.461 51.08 51.08 0 0 0-.546-2.652 81.392 81.392 0 0 0-1.691-6.097c-.482-1.528-.985-3.049-1.606-4.527a39.735 39.735 0 0 0-1.24-2.654c-.469-.92-.966-1.827-1.447-2.741l-.283-.546a35.13 35.13 0 0 1-1.022-2.17 27.759 27.759 0 0 1-.991-2.723c-.518-1.696-.881-3.438-1.156-5.189-.329-2.094-.53-4.205-.678-6.318l.005-.114c.026-.168.049-.336.071-.506.03-.229.03-.229.057-.458.225-2.01.314-4.04.177-6.059a21.143 21.143 0 0 0-.293-2.394 13.803 13.803 0 0 0-.484-1.902c-.14-.411-.31-.808-.487-1.205a41.192 41.192 0 0 0-.513-1.109c-.616-1.284-1.276-2.547-1.921-3.818-.19-.377-.379-.754-.566-1.132-.619-1.268-1.21-2.55-1.682-3.881a17.382 17.382 0 0 1-.778-2.878 13.208 13.208 0 0 1-.149-1.157l-.006-.078a544.562 544.562 0 0 0-1.576-7.031 607.166 607.166 0 0 0-2.218-9.303 469.515 469.515 0 0 0-1.056-4.204 233.304 233.304 0 0 0-.834-3.189 107.966 107.966 0 0 0-1.099-3.778 103.733 103.733 0 0 0-1.811-5.283c-.572-1.539-1.179-3.064-1.767-4.598-.126-.334-.25-.669-.373-1.005a33.746 33.746 0 0 1-.849-2.638 21.036 21.036 0 0 1-.464-2.167c-.069-.448-.136-.897-.201-1.346a64.078 64.078 0 0 1-.386-3.152 23.848 23.848 0 0 1-.078-1.068 7.434 7.434 0 0 1-.007-.804l-.001.015-.248-4.552h-.79zm9.242-131.096c-.194.142-.397.27-.605.386a8.376 8.376 0 0 1-.995.461c-.383.154-.77.296-1.16.429a26.908 26.908 0 0 1-3.943 1.016c-.428.076-.858.141-1.29.194-.222.027-.445.053-.668.07a9.618 9.618 0 0 1-1.53-.011c-.173-.018-.346-.042-.519-.065-.344-.047-.687-.1-1.028-.159a28.819 28.819 0 0 1-3.566-.843c-.381-.117-.76-.243-1.134-.378a15.743 15.743 0 0 1-1.164-.463 6.872 6.872 0 0 1-.609-.315 5.962 5.962 0 0 1-.439-.283c.233 1.934.456 3.872.606 5.815.049.643.093 1.286.103 1.93.004.216.004.433-.009.649a1.846 1.846 0 0 1-.064.437c-.084.284-.241.545-.407.788-.236.347-.505.67-.783.983-.41.462-.845.9-1.289 1.328a42.177 42.177 0 0 1-1.847 1.666 52.862 52.862 0 0 1-2.355 1.895 43.091 43.091 0 0 1-2.945 2.057c-.637.403-1.29.784-1.968 1.117-.533.261-1.088.501-1.67.634a7.836 7.836 0 0 1-1.747.181c-.794.001-1.586-.079-2.377-.129a15.327 15.327 0 0 0-1.592-.023c-.552.025-1.101.092-1.642.205-1.87.391-3.581 1.324-5.128 2.421a19.058 19.058 0 0 0-3.269 2.912 18.263 18.263 0 0 0-3.255 5.326c-1.374 3.438-1.774 7.195-1.668 10.874.037 1.304.139 2.606.29 3.902.053.459.113.917.179 1.375l.04.279c.01.064.018.129.029.193.004.022.017.042.024.064l.012.053c.028.183.004.366-.033.547a5.708 5.708 0 0 1-.134.53c-.181.61-.411 1.206-.622 1.806a75.98 75.98 0 0 0-1.698 5.541 49.982 49.982 0 0 0-.787 3.459c-.115.609-.216 1.22-.296 1.835-.043.337-.075.677-.119 1.015a12.379 12.379 0 0 1-.449 2.025 12.235 12.235 0 0 1-1.177 2.602 15.02 15.02 0 0 1-1.023 1.483c-.259.332-.532.654-.809.972-.291.328-.588.652-.875.984-.068.081-.136.161-.201.246-.084.108-.164.221-.246.33-.295.377-.595.749-.887 1.128a33.97 33.97 0 0 0-2.31 3.403 32.085 32.085 0 0 0-3.14 7.233 32.86 32.86 0 0 0-.853 3.653c-.109.63-.195 1.262-.278 1.895-.036.253-.036.253-.076.506-.07.427-.149.854-.24 1.279a33.303 33.303 0 0 1-1.03 3.667 51.698 51.698 0 0 1-1.661 4.232c-1.399 3.172-3.047 6.23-4.788 9.226-1.014 1.745-2.072 3.464-3.104 5.198a30.049 30.049 0 0 0-.647 1.129h.186a8.099 8.099 0 0 1 2.7.528c.44.168.866.373 1.265.625l.055.035a.572.572 0 0 1 .212.227.511.511 0 0 1-.362.716.512.512 0 0 1-.26-.02c-.088-.03-.168-.094-.247-.144a9.006 9.006 0 0 0-.271-.154 6.952 6.952 0 0 0-4.424-.698 7.71 7.71 0 0 0-1.987.659l-.076.038A67.761 67.761 0 0 0 7 153.953c-.364.247-.723.5-1.073.768-.278.213-.558.432-.781.705-.24.295-.428.631-.597.972-.209.421-.387.858-.584 1.286-.054.114-.108.227-.165.339a4.132 4.132 0 0 1-.423.675c-.153.195-.33.369-.504.545-.198.199-.397.398-.595.599-.125.128-.124.127-.247.257-.308.331-.622.672-.853 1.063a1.585 1.585 0 0 0-.136.285.364.364 0 0 0-.029.169c.002.009.006.013.012.02.011.01.023.019.036.027a2.018 2.018 0 0 0 .48.197c.49.125 1.021.066 1.494-.102.231-.081.466-.191.655-.35.094-.079.167-.18.243-.274.534-.669 1.049-1.351 1.579-2.021.273-.343.547-.687.843-1.01.105-.113.212-.227.334-.321a.665.665 0 0 1 .216-.123c.116-.031.116-.026.235-.029l.007.001c.044.007.097.013.137.034.105.055.106.053.194.131.022.02.037.046.055.069a.57.57 0 0 1 .097.235c.023.114.027.23.025.347a5.61 5.61 0 0 1-.025.409 15.99 15.99 0 0 1-.09.723 28.951 28.951 0 0 1-.495 2.559c-.094.395-.197.789-.319 1.178a5.007 5.007 0 0 1-.306.801c-.087.173-.203.328-.306.491-.111.177-.22.356-.327.536-.418.711-.82 1.431-1.209 2.159-.286.539-.57 1.081-.821 1.638-.065.144-.123.292-.184.439-.058.136-.058.136-.119.271-.164.36-.332.718-.496 1.078-.095.21-.095.21-.188.422-.248.577-.485 1.16-.654 1.766-.096.345-.177.706-.177 1.067.001.164.015.349.102.492a.377.377 0 0 0 .124.124c.116.073.245.115.378.075a.632.632 0 0 0 .113-.049.886.886 0 0 0 .127-.086c.187-.147.335-.343.463-.542.182-.281.335-.586.452-.9l.029-.064c.257-.473.517-.944.788-1.408.163-.279.334-.554.504-.83.376-.613.756-1.222 1.146-1.825.367-.569.741-1.133 1.133-1.685a16.3 16.3 0 0 1 .849-1.111c.13-.154.266-.304.414-.442.131-.12.274-.236.44-.305.252-.105.557-.098.776.076a.664.664 0 0 1 .178.213.847.847 0 0 1 .088.287c.037.283-.04.578-.124.846a7.962 7.962 0 0 1-.453 1.113c-.049.138-.1.312-.14.435l-.372 1.185-2.203 7.079-.491 1.577a3.878 3.878 0 0 0-.068.589c-.005.149-.002.3.021.447a.905.905 0 0 0 .069.24.223.223 0 0 0 .078.099.267.267 0 0 0 .048.015c.153.021.311.025.465.011.123-.011.245-.035.36-.08.41-.157.658-.551.822-.939.029-.07.056-.141.082-.212.099-.285.19-.572.285-.858.14-.427.283-.853.426-1.278.406-1.196.822-2.388 1.271-3.569.301-.793.615-1.583.956-2.36.267-.608.549-1.211.877-1.789.232-.41.489-.819.832-1.148l.041-.037c.021-.016.042-.033.064-.048a.75.75 0 0 1 .19-.083.843.843 0 0 1 .747.124.92.92 0 0 1 .318.488c.058.205.049.424.025.633a5.936 5.936 0 0 1-.243 1.055c-1.019 3.168-1.178 6.552-1.664 9.843a4.83 4.83 0 0 0-.04.624c.002.169.012.341.047.506a.955.955 0 0 0 .082.245c.017.032.039.073.075.088.012.004.023.005.035.007.183.015.393.035.566-.044a.71.71 0 0 0 .28-.266c.142-.21.24-.448.327-.684a7.87 7.87 0 0 0 .095-.271c.043-.131.056-.175.097-.31.261-.888.521-1.777.776-2.668a84.62 84.62 0 0 0 1.061-4.052c.255-1.115.479-2.238.619-3.375a4.724 4.724 0 0 1 .224-.83c.149-.379.391-.773.797-.912a.927.927 0 0 1 .45-.037c.126.02.246.066.353.133.127.08.235.188.319.31.127.182.205.392.256.606a3.9 3.9 0 0 1 .096.926l-.001.049.372 7.561c.025.062.052.123.081.182.067.134.142.265.242.375a.457.457 0 0 0 .092.084c.012.009.029.022.046.024a.675.675 0 0 0 .271-.07c.132-.079.192-.247.235-.384a2.64 2.64 0 0 0 .101-.497c.018-.179.019-.362.022-.541.002-.159.003-.33.003-.489l-.003-.586-.008-.662c-.022-1.377-.053-2.754-.071-4.132a75.335 75.335 0 0 1-.007-1.577c.002-.196.005-.391.013-.586.007-.165.013-.333.042-.495.024-.143.067-.283.11-.422.061-.202.128-.403.199-.602.171-.487.355-.969.555-1.443.057-.136.122-.268.182-.403l.155-.379a30.664 30.664 0 0 0 1.142-3.677c.38-1.521.671-3.064.892-4.617a54.31 54.31 0 0 0 .195-1.558c.048-.439.09-.879.138-1.318.038-.315.036-.315.077-.63.266-1.975.657-3.966 1.5-5.785.216-.468.463-.921.739-1.355.19-.301.395-.591.606-.877.307-.408.625-.807.931-1.217.119-.162.234-.325.351-.488.149-.207.256-.353.409-.561.9-1.221 1.807-2.439 2.706-3.662a261.866 261.866 0 0 0 4.709-6.608 122.642 122.642 0 0 0 3.26-4.978c.411-.668.814-1.34 1.202-2.021.296-.518.581-1.041.872-1.561.252-.447.506-.892.76-1.336.527-.912 1.063-1.819 1.589-2.732.111-.195.221-.39.329-.585.183-.338.362-.678.523-1.028.162-.355.305-.719.424-1.091.183-.572.311-1.161.416-1.753.11-.615.195-1.235.277-1.856.035-.163.071-.324.11-.486a34.108 34.108 0 0 1 1.47-4.619c.345-.864.736-1.709 1.125-2.554.442-.963.89-1.922 1.341-2.88 1.567-3.329 3.155-6.649 4.749-9.966l.26-.539.03-.048a45.457 45.457 0 0 1-.245-3.317 84.5 84.5 0 0 1-.048-5.034c.036-2.13.13-4.257.261-6.383.116-1.899.263-3.797.447-5.691l.018-.183c.051-.163.044-.226.183-.341.052-.041.116-.061.175-.093l.196-.018.188.058.153.125.093.174.018.196a170.952 170.952 0 0 0-.58 7.975c-.091 1.878-.15 3.757-.156 5.637a69.191 69.191 0 0 0 .135 4.884c.095 1.438.245 2.877.553 4.288.087.38.18.759.273 1.139.538 2.155 1.143 4.292 1.722 6.436.129.484.258.97.382 1.457.619 2.441 1.147 4.915 1.307 7.434.044.675.06 1.351.048 2.028-.01.575-.043 1.15-.075 1.724a88.079 88.079 0 0 1-.54 5.973 68.242 68.242 0 0 1-.469 3.185c-.067.387-.137.773-.217 1.158l-.072.327c-.024.107-.055.212-.076.32a5.145 5.145 0 0 0-.03.212 22.96 22.96 0 0 0-.102 1.437 86.907 86.907 0 0 0-.07 1.839c-.05 1.654-.076 3.308-.095 4.961l-.003.345-.012.105c-.24 1.072-.478 2.142-.716 3.214a864.743 864.743 0 0 0-2.585 11.995 197.36 197.36 0 0 0-.796 4.011c-.087.469-.172.938-.247 1.409-.03.194-.059.388-.083.582a3.572 3.572 0 0 0-.026.291c-.002.033.001.065.003.099.004.052.004.105.003.158-.002.077-.007.155-.012.233-.035.391-.089.781-.147 1.17-.059.398-.12.794-.183 1.192-.129.829-.259 1.657-.385 2.487-.074.497-.146.992-.216 1.488a134.86 134.86 0 0 0-.643 5.309c-.326 3.248-.518 6.51-.535 9.774-.005.892.003 1.785.025 2.678a274.36 274.36 0 0 0 .204 4.979 234.142 234.142 0 0 0 1.345 15.794c.167 1.416.345 2.83.511 4.246.041.355.081.711.118 1.067.132 1.419.177 2.844.197 4.268.023 1.6.01 3.201-.024 4.801a153.767 153.767 0 0 1-.127 3.721c-.033.716-.073 1.432-.12 2.148a46.6 46.6 0 0 1-.141 1.708c-.041.402-.097.803-.149 1.204-.116.923-.227 1.846-.347 2.768-.187 1.403-.4 2.805-.715 4.187-.202.888-.444 1.77-.753 2.628-.101.28-.213.556-.327.831-.229.536-.463 1.069-.69 1.604a41.302 41.302 0 0 0-.703 1.798 31.92 31.92 0 0 0-.826 2.642 42.354 42.354 0 0 0-1.06 5.456 61.857 61.857 0 0 0-.454 5.522c-.11 2.761-.067 5.527.073 8.286a126.562 126.562 0 0 0 .378 5.228c.029.286.063.57.094.856.037.333.071.666.107 1l.209 2.067c.247 2.543.476 5.087.665 7.635.129 1.745.242 3.493.32 5.242.068 1.483.115 2.968.1 4.453a36.06 36.06 0 0 1-.055 1.738 14.725 14.725 0 0 1-.185 1.677c-.146.744-.305 1.485-.455 2.228a53.463 53.463 0 0 0-.446 2.449 17.832 17.832 0 0 0-.23 2.63 12.57 12.57 0 0 0 .118 1.745l.033-.006c.059-.003.059-.003.118 0a.506.506 0 0 1 .427.646 40.072 40.072 0 0 1-1.19 3.364 28.101 28.101 0 0 1-.919 2.042c-.252.503-.524.997-.824 1.472a9.289 9.289 0 0 1-1.032 1.368c-.195.243-.387.486-.579.731-.544.698-1.082 1.4-1.592 2.124-.175.249-.346.501-.507.759-.096.153-.19.309-.263.474-.156.351-.256.73-.34 1.103-.106.475-.18.959-.212 1.446-.021.316-.026.636.004.953.014.149.036.298.074.443.027.104.062.208.115.302.044.081.106.149.167.218.057.066.117.131.184.188.03.026.063.054.099.074a2.834 2.834 0 0 1 .006-.332c.032-.403.139-.8.262-1.184.125-.391.274-.774.433-1.151a27.942 27.942 0 0 1 .948-1.985c.03-.056.059-.112.091-.167a.512.512 0 0 1 .39-.235c.034-.002.034-.002.067-.001a.552.552 0 0 1 .196.051.51.51 0 0 1 .221.693c-.089.163-.175.329-.261.495-.142.282-.281.565-.414.852-.106.229-.209.458-.307.689-.17.405-.329.815-.454 1.236-.08.273-.154.556-.168.842-.003.07 0 .139.003.209.002.057.006.113.011.17a.501.501 0 0 1 .017.15c.007.047.015.096.026.143a.64.64 0 0 0 .088.234.05.05 0 0 0 .021.02.358.358 0 0 0 .126.016c.067.002.134-.003.201-.007.197-.012.399-.025.591-.075a.501.501 0 0 0 .055-.017h.002c.025-.359.118-.717.239-1.05.039-.111.082-.22.129-.327a7.42 7.42 0 0 1 .358-.72 11.079 11.079 0 0 1 1.203-1.729c.02-.023.02-.023.042-.045a.55.55 0 0 1 .278-.129c.031-.003.062-.004.094-.003a.547.547 0 0 1 .207.058.51.51 0 0 1 .263.522.52.52 0 0 1-.078.202c-.045.065-.1.125-.149.186a10.336 10.336 0 0 0-1.026 1.52 5.174 5.174 0 0 0-.456 1.073c-.019.067-.028.106-.045.174-.069.303-.095.648.033.94.028.063.063.121.103.177l.005.005c.179.048.367.082.554.075.081-.003.183-.01.251-.061a.085.085 0 0 0 .021-.025c.082-.153.157-.308.238-.461l.137-.247c.025-.115.059-.228.099-.34.113-.323.271-.629.447-.922.277-.459.6-.89.943-1.301.406-.489.842-.955 1.298-1.397.033-.032.032-.032.067-.062a.533.533 0 0 1 .296-.116c.032-.001.032-.001.064.001a.509.509 0 0 1 .355.823c-.058.066-.127.126-.19.189-.091.089-.18.179-.269.27-.551.573-1.08 1.175-1.522 1.837a5.816 5.816 0 0 0-.374.636c-.026.053-.052.106-.076.161a.523.523 0 0 1-.032.327c-.021.042-.045.079-.069.119a8.055 8.055 0 0 0-.076.128.75.75 0 0 0 .014.291c.031.112.112.197.189.28.158.168.36.314.598.329.251.017.494-.105.689-.254l.043-.034.016-.014c.362-.434.714-.878 1.082-1.307.05-.304.19-.599.344-.857a5.456 5.456 0 0 1 .326-.475c.099-.129.202-.256.308-.378.126-.145.257-.286.39-.424a14.573 14.573 0 0 1 1.158-1.073l.034-.028a.49.49 0 0 1 .401-.109.51.51 0 0 1 .358.751c-.026.047-.037.056-.073.097-.053.049-.108.094-.163.141a12.578 12.578 0 0 0-1.283 1.242c-.199.225-.39.461-.551.714-.025.041-.05.081-.073.123a2.47 2.47 0 0 0-.11.22.501.501 0 0 1-.037.396c.105.17.218.337.331.503.128.184.259.368.412.532.119.131.254.252.413.333a.951.951 0 0 0 .343.097c.098.01.197.006.295.004.171-.003.341-.013.51-.03.713-.075 1.435-.292 1.98-.777.102-.09.196-.188.282-.293.109-.133.204-.278.286-.429.085-.158.159-.322.237-.483.078-.153.157-.305.238-.457.253-.458.523-.91.842-1.327.08-.104.164-.206.251-.304.048-.055.104-.103.15-.16.023-.028.043-.056.063-.086.338-.526.424-1.18.394-1.793a5.273 5.273 0 0 0-.099-.794 7.128 7.128 0 0 0-.14-.577c-.064-.221-.141-.438-.211-.656-.04-.132-.04-.132-.078-.265a7.75 7.75 0 0 1-.166-.712c-.106-.599-.13-1.243.117-1.812.075-.172.173-.329.286-.477a5.89 5.89 0 0 1 .158-.19c.048-.056.099-.11.14-.171a.16.16 0 0 0 .013-.022c.052-.184.09-.372.134-.558.052-.242.103-.483.144-.726.066-.386.112-.776.138-1.167.081-1.215-.007-2.433-.142-3.641l-.002-.02a67.96 67.96 0 0 0-.052-.447l-.003-.062a.607.607 0 0 1 .032-.178.514.514 0 0 1 .224-.26c.159-.627.324-1.255.518-1.872.069-.217.14-.432.225-.643.05-.127.105-.253.177-.369a.662.662 0 0 0 .015-.11 4.294 4.294 0 0 0-.047-.792c-.052-.401-.122-.8-.2-1.196a49.9 49.9 0 0 0-.588-2.56c-.103-.402-.213-.803-.316-1.204l-.056-.252a13.735 13.735 0 0 1-.216-1.82 25.128 25.128 0 0 1-.035-1.779c.022-1.65.174-3.297.408-4.93.344-2.39.871-4.752 1.541-7.071.453-1.57.962-3.128 1.575-4.644a37.3 37.3 0 0 1 1.03-2.312c.404-.834.837-1.653 1.252-2.48l.23-.468c.188-.397.372-.796.54-1.202.238-.577.45-1.165.632-1.763.339-1.112.582-2.252.772-3.398.19-1.149.327-2.305.437-3.464.23-2.435.337-4.879.408-7.324l.011-.395c-.02-.219-.035-.438-.05-.657a45.057 45.057 0 0 1 .018-6.084c.097-1.283.259-2.565.535-3.824.081-.373.173-.745.278-1.112.125-.438.267-.871.413-1.303.27-.799.563-1.591.86-2.381.429-1.122.867-2.241 1.297-3.363.532-1.405 1.051-2.816 1.467-4.26.38-1.318.676-2.663.777-4.033.038-.382.078-.763.12-1.145.339-3.032.766-6.055 1.268-9.065a157.39 157.39 0 0 1 1.77-9.027c.247-1.077.508-2.149.78-3.22.607-2.343 1.224-4.683 1.831-7.026.412-1.603.823-3.207 1.217-4.815.528-2.16 1.023-4.328 1.421-6.516.226-1.243.427-2.491.597-3.744a97.55 97.55 0 0 0 .5-4.448c.124-1.366.224-2.733.297-4.102l.011-.229c.01-.051.013-.103.03-.151a.508.508 0 0 1 .323-.307c.049-.016.101-.017.152-.024h1.749c.051.007.103.008.152.024a.501.501 0 0 1 .322.305c.018.047.021.099.032.149l.276 5.068c-.002.095-.007.19-.008.285.001.117.004.235.008.352.028.627.086 1.251.154 1.875.073.658.158 1.314.249 1.97.06.423.121.844.185 1.267.054.349.106.699.172 1.046.08.421.175.839.282 1.254.377 1.463.908 2.879 1.448 4.288.363.94.729 1.878 1.091 2.817.427 1.121.845 2.244 1.241 3.376a102.131 102.131 0 0 1 1.48 4.589c.452 1.52.861 3.053 1.259 4.589.455 1.758.899 3.52 1.335 5.283a618.51 618.51 0 0 1 3.808 16.397l.01.069a12.03 12.03 0 0 0 .093.853c.264 1.745.874 3.414 1.586 5.021.777 1.755 1.679 3.451 2.546 5.162.189.376.377.752.563 1.13.256.526.507 1.052.744 1.586.138.306.273.615.391.929.122.324.228.654.323.988.216.767.368 1.551.476 2.341.13.955.195 1.918.217 2.883a34.706 34.706 0 0 1-.068 3.043c-.058.906-.148 1.81-.274 2.71l-.016.109-.005.032c.023.338.048.676.074 1.012.161 1.987.375 3.971.717 5.935.323 1.864.761 3.711 1.4 5.494a28.2 28.2 0 0 0 1.136 2.696c.578 1.196 1.224 2.357 1.84 3.531l.297.575c.23.455.457.911.673 1.373.319.684.619 1.377.896 2.079.291.737.554 1.483.805 2.233.227.681.449 1.366.662 2.051.691 2.213 1.309 4.451 1.796 6.717.183.854.348 1.71.484 2.571.125.791.226 1.586.287 2.385.043.571.066 1.145.05 1.718a7.42 7.42 0 0 1-.166 1.447c-.045.18-.095.359-.143.538-.079.3-.156.6-.232.9a42.42 42.42 0 0 0-.61 2.755c-.056.309-.105.62-.14.933a3.585 3.585 0 0 0-.024.663l.008.056.003.016c.024.037.044.075.065.113.099.2.176.411.248.623.082.238.154.481.225.723.138.473.263.948.383 1.425a.51.51 0 0 1 .24.316c.015.062.015.12.011.182l-.049.417a.332.332 0 0 1-.01.085l-.034.323c-.142 1.428-.211 2.874.011 4.298.054.342.123.682.202 1.02.011.046.021.093.034.139.022.095.025.198.07.284.011.019.025.037.038.055.089.109.183.212.27.322a2.317 2.317 0 0 1 .311.537c.235.59.192 1.251.072 1.863-.022.117-.05.235-.078.351a9.152 9.152 0 0 1-.146.515c-.055.178-.117.355-.174.533l-.069.245a5.628 5.628 0 0 0-.194 1.065c-.043.494-.015 1.003.143 1.475.069.207.163.417.3.588.028.035.061.064.091.095.059.064.117.129.172.196.451.549.814 1.168 1.139 1.799.097.189.188.38.281.57.036.07.035.07.073.139.123.205.263.396.434.564.553.545 1.319.788 2.076.867.17.017.34.027.51.03.196.005.387.005.571-.07.189-.077.346-.215.482-.363.175-.189.325-.402.469-.615l.173-.263c.034-.051.076-.099.106-.153l-.002-.004a.522.522 0 0 1-.039-.395 3.143 3.143 0 0 0-.36-.599 8.15 8.15 0 0 0-.791-.9 12.947 12.947 0 0 0-.987-.901l-.045-.041c-.034-.042-.045-.051-.072-.098a.503.503 0 0 1 .357-.75.49.49 0 0 1 .183.004c.098.02.177.07.253.132a15.557 15.557 0 0 1 .902.815c.153.151.305.306.452.465a9.205 9.205 0 0 1 .561.673c.057.077.113.156.165.237.053.079.103.16.15.241.134.236.25.501.296.773.368.429.72.874 1.083 1.31.048.043.102.083.157.118.196.128.435.219.672.174a.686.686 0 0 0 .171-.056c.116-.054.218-.134.308-.223a1.79 1.79 0 0 0 .117-.129.506.506 0 0 0 .11-.19.69.69 0 0 0 .019-.235l-.006-.059-.028-.046c-.033-.057-.068-.112-.102-.169l-.026-.056a.53.53 0 0 1-.019-.301 4.64 4.64 0 0 0-.17-.338 7.01 7.01 0 0 0-.406-.642 13.785 13.785 0 0 0-1.285-1.537 15.426 15.426 0 0 0-.38-.387c-.057-.055-.115-.108-.17-.165l-.041-.049a.574.574 0 0 1-.087-.209.51.51 0 0 1 .429-.586.795.795 0 0 1 .097-.004c.112.01.208.048.296.116.092.082.178.17.266.257.44.442.861.902 1.252 1.388.286.355.556.725.79 1.115.177.293.335.6.448.923.039.111.073.224.099.34a14.453 14.453 0 0 1 .308.577c.014.027.045.108.078.145a.125.125 0 0 0 .042.03.677.677 0 0 0 .264.041c.172 0 .343-.031.509-.075a1.12 1.12 0 0 0 .069-.105c.182-.338.14-.745.049-1.105a3.025 3.025 0 0 0-.078-.262 5.868 5.868 0 0 0-.449-.985 10.332 10.332 0 0 0-.773-1.17c-.109-.143-.225-.281-.337-.421-.019-.026-.019-.026-.035-.053a.508.508 0 0 1 .471-.755c.13.012.239.063.332.154.075.083.144.171.214.258.349.443.672.906.954 1.396.212.365.4.746.543 1.143.122.335.214.692.24 1.051.025.01.052.017.08.024.126.03.254.044.384.055.116.01.233.018.351.02.037 0 .074-.001.111-.005.018-.003.041-.004.056-.016.014-.013.023-.029.032-.045.053-.105.079-.223.095-.341a.596.596 0 0 1 .016-.158c.011-.125.02-.252.014-.378a3.449 3.449 0 0 0-.144-.759c-.127-.45-.297-.888-.478-1.317a23.214 23.214 0 0 0-.66-1.423c-.082-.161-.163-.321-.248-.481a3.684 3.684 0 0 1-.087-.164l-.025-.063a.506.506 0 0 1 .422-.647c.034-.003.067-.004.101-.003a.517.517 0 0 1 .39.235c.063.108.119.221.177.331.187.363.369.729.541 1.099.141.301.274.605.4.913.166.407.32.821.439 1.245.084.294.153.595.177.901.008.11.009.22.005.33l.021-.012c.078-.053.147-.12.21-.19.062-.067.122-.136.176-.209.017-.021.03-.044.044-.067.12-.228.165-.491.189-.746.044-.46.017-.927-.037-1.385a9.51 9.51 0 0 0-.209-1.171 5.61 5.61 0 0 0-.302-.947 4.509 4.509 0 0 0-.35-.611c-.21-.327-.434-.644-.662-.96a65.388 65.388 0 0 0-1.833-2.396l-.097-.121a9.07 9.07 0 0 1-.42-.493 12.942 12.942 0 0 1-1.083-1.675 23.779 23.779 0 0 1-.916-1.87 36.088 36.088 0 0 1-.893-2.243 34.763 34.763 0 0 1-.652-1.965l-.014-.056a.577.577 0 0 1 0-.176.514.514 0 0 1 .272-.363.598.598 0 0 1 .168-.049c.059-.005.059-.005.117 0l.033.005c.079-.579.121-1.16.12-1.745-.003-1.217-.18-2.426-.395-3.621-.223-1.233-.491-2.456-.736-3.683-.024-.132-.048-.264-.07-.396a36.69 36.69 0 0 1-.31-2.767 102.27 102.27 0 0 1-.201-3.133 253.777 253.777 0 0 1-.258-7.706 471.61 471.61 0 0 1-.102-8.559c-.002-.613-.008-1.226-.003-1.839.002-.184.031-.366.047-.549l.043-.497.076-.98c.076-1.092.14-2.184.18-3.279.118-3.182.065-6.376-.237-9.547-.279-2.923-.771-5.831-1.56-8.661a40.407 40.407 0 0 0-1.644-4.743 47.962 47.962 0 0 0-.847-1.899c-.252-.537-.513-1.072-.767-1.61-.091-.194-.09-.194-.18-.389-.102-.232-.205-.464-.293-.703a20.567 20.567 0 0 1-.656-2.23 49.724 49.724 0 0 1-.56-2.673c-.528-2.862-.894-5.751-1.273-8.635l-.075-.635a77.537 77.537 0 0 1-.386-5.429 62.947 62.947 0 0 1 .007-5.461c.025-.514.06-1.03.107-1.543.041-.441.09-.882.132-1.323.042-.466.083-.932.12-1.399.315-4.06.481-8.132.55-12.204.069-4.07.031-8.142-.138-12.209a188.164 188.164 0 0 0-.195-3.677c-.015-.224-.015-.224-.033-.447-.135-1.509-.352-3.012-.581-4.511-.305-1.997-.646-3.99-1.005-5.978a291.528 291.528 0 0 0-1.172-6.143 142.79 142.79 0 0 0-1.15-5.291c-.132-.548-.279-1.092-.422-1.638a80.205 80.205 0 0 1-.183-.741c-.483-2.027-.894-4.071-1.293-6.116a482.462 482.462 0 0 1-1.556-8.417l-.112-.636-.094-.544-.009-.082c-.006-.627-.014-1.253-.023-1.881-.012-.744-.027-1.488-.043-2.233-.022-.897-.047-1.795-.086-2.691-.018-.411-.04-.821-.069-1.231a8.188 8.188 0 0 0-.07-.699c-.013-.084-.034-.163-.054-.246-.029-.116-.039-.167-.066-.287-.04-.193-.08-.386-.117-.579a61.485 61.485 0 0 1-.553-3.521 90.358 90.358 0 0 1-.609-6.671 35.659 35.659 0 0 1-.063-1.88c0-.722.033-1.445.094-2.164.24-2.826.919-5.584 1.647-8.318.325-1.201.656-2.4.983-3.6.254-.943.503-1.887.739-2.835.107-.434.216-.868.309-1.305.101-.475.182-.955.25-1.436a50.082 50.082 0 0 0 .079-.603c.137-1.14.214-2.286.262-3.431a85.1 85.1 0 0 0 .047-4.976 140.99 140.99 0 0 0-.26-6.336 159.65 159.65 0 0 0-.444-5.655l-.018-.181c.006-.066 0-.133.02-.196.051-.174.113-.191.244-.299l.188-.058.197.018c.173.093.175.094.3.246l.057.188c.17 1.688.302 3.38.415 5.074.147 2.231.255 4.465.302 6.7a87.486 87.486 0 0 1-.039 5.517 45.742 45.742 0 0 1-.252 3.388c.479.917.957 1.836 1.434 2.753a634.11 634.11 0 0 1 4.071 7.961c.369.737.735 1.475 1.095 2.217.294.608.588 1.218.858 1.838.352.808.671 1.632.968 2.462.34.951.652 1.913.913 2.887l.029.108.012.06c.029.227.06.452.093.678.164 1.093.366 2.187.756 3.225.298.792.698 1.54 1.112 2.276.411.735.835 1.464 1.25 2.197a126.504 126.504 0 0 1 1.422 2.594c.205.389.407.778.615 1.164.131.24.263.478.398.717 1.161 2.039 2.46 3.996 3.826 5.903a129.29 129.29 0 0 0 3.948 5.203c1.067 1.343 2.151 2.67 3.225 4.007.195.245.39.491.583.738.224.289.447.578.655.877.117.166.225.338.338.505.32.47.654.929.979 1.396.437.641.856 1.293 1.227 1.976.535.981.975 2.013 1.319 3.077.366 1.128.625 2.289.8 3.462.099.667.16 1.339.232 2.009l.074.624c.234 1.825.568 3.638 1.086 5.405.17.584.362 1.163.579 1.732.18.47.377.935.605 1.384.069.134.145.263.218.393.082.158.159.318.237.479.214.445.422.894.609 1.352.119.294.237.595.31.905.036.148.049.3.064.451.022.234.04.469.056.704.048.675.083 1.35.12 2.025.086 1.655.16 3.31.25 4.964l.033.566c.009.144.019.306.03.452.009.128.015.193.027.315a4.011 4.011 0 0 0 .062.381c.029.131.066.262.128.381a.448.448 0 0 0 .137.168c.043.03.094.049.144.06a.887.887 0 0 0 .101.017c.014.001.028.005.042.003.016-.004.031-.015.046-.024a.873.873 0 0 0 .196-.219c.086-.127.152-.266.211-.406l.003-.008.117-7.683c-.003-.084-.003-.168-.003-.252.002-.115.004-.23.011-.346a4.89 4.89 0 0 1 .055-.492c.052-.304.153-.643.411-.837a.875.875 0 0 1 .163-.094.75.75 0 0 1 .373-.048c.101.011.2.03.297.064.379.133.662.443.854.787a2.723 2.723 0 0 1 .188.418c.009.035.015.068.023.103l.063.471c.199 1.271.503 2.525.839 3.766.299 1.099.625 2.19.963 3.277.266.857.54 1.711.8 2.569.074.246.145.492.221.738.04.125.053.167.096.29.094.269.199.543.355.784a.772.772 0 0 0 .284.289c.132.067.292.068.436.061.056-.003.114-.004.168-.014a.077.077 0 0 0 .031-.016.329.329 0 0 0 .074-.116 1.09 1.09 0 0 0 .076-.275c.059-.348.04-.711-.006-1.058-.524-3.557-1.504-7.032-2.294-10.539-.048-.203-.105-.404-.156-.607l-.041-.183a1.78 1.78 0 0 1-.027-.253c-.011-.359.108-.771.446-.95a.846.846 0 0 1 .518-.081c.157.023.304.083.442.157l.029.018c.028.019.056.038.082.059.048.038.091.083.134.127.078.081.151.167.221.255.16.202.303.418.438.638.412.672.757 1.387 1.085 2.105.417.913.8 1.841 1.168 2.775.373.945.729 1.897 1.074 2.852.151.42.301.841.448 1.261l.161.467c.058.168.112.336.174.501.026.068.055.134.084.201.07.147.148.291.247.422.067.091.145.175.233.247.053.043.11.082.17.114.285.155.616.161.931.13.021-.003.043-.006.063-.015a.186.186 0 0 0 .075-.084.793.793 0 0 0 .072-.224c.025-.132.031-.269.03-.403a4.148 4.148 0 0 0-.062-.62l-.007-.035c-1.188-3.278-2.376-6.556-3.571-9.831-.053-.148-.107-.3-.164-.447a9.586 9.586 0 0 1-.318-.725 4.672 4.672 0 0 1-.233-.755 1.397 1.397 0 0 1-.021-.55.759.759 0 0 1 .255-.439c.208-.162.488-.178.73-.093.245.085.445.274.622.456.265.272.501.572.73.876.309.408.602.83.889 1.254a86.779 86.779 0 0 1 2.293 3.629 49.76 49.76 0 0 1 .786 1.407c.028.053.047.11.068.164.025.062.053.122.08.183.038.083.078.165.119.247.127.238.265.472.44.678a1.4 1.4 0 0 0 .335.303c.118.072.246.106.38.061a.528.528 0 0 0 .12-.057.401.401 0 0 0 .137-.122.812.812 0 0 0 .107-.398 2.342 2.342 0 0 0-.025-.481c-.073-.539-.249-1.065-.44-1.572-.307-.814-.687-1.596-1.048-2.386-.049-.11-.099-.221-.144-.334l-.105-.258c-.058-.131-.118-.26-.178-.39a41.201 41.201 0 0 0-1.003-1.936c-.347-.632-.7-1.262-1.075-1.879a14.956 14.956 0 0 0-.222-.356c-.063-.098-.13-.194-.192-.293a5.065 5.065 0 0 1-.114-.204 17.722 17.722 0 0 1-.754-1.725 37.186 37.186 0 0 1-.861-2.427 17.642 17.642 0 0 1-.124-.409 7.974 7.974 0 0 1-.152-.59c-.034-.163-.065-.335-.037-.501a.646.646 0 0 1 .053-.159c.033-.079.085-.122.145-.182l.005-.004c.061-.041.061-.041.128-.073l.006-.002c.044-.015.098-.037.146-.035.116.003.116-.001.228.031.027.007.052.02.077.032a.869.869 0 0 1 .182.123c.176.148.329.326.479.499l.205.242a42.832 42.832 0 0 1 .686.856c.159.201.316.402.472.604.265.343.53.685.798 1.025.081.101.161.205.248.3.152.157.353.264.551.35a2.73 2.73 0 0 0 1.468.209c.182-.028.361-.08.529-.158.059-.029.121-.057.174-.097.008-.009.019-.016.022-.028a.215.215 0 0 0-.005-.087.763.763 0 0 0-.056-.167 2.604 2.604 0 0 0-.297-.493 8.329 8.329 0 0 0-.658-.772c-.343-.363-.702-.71-1.05-1.068a7.21 7.21 0 0 1-.222-.239c-.281-.331-.479-.717-.663-1.108-.16-.351-.311-.706-.473-1.056-.214-.453-.448-.907-.78-1.286a3.182 3.182 0 0 0-.335-.322 10.776 10.776 0 0 0-.459-.364 26.13 26.13 0 0 0-1.206-.85 73.189 73.189 0 0 0-2.935-1.855l-.167-.1a7.775 7.775 0 0 0-1.734-.63 7.67 7.67 0 0 0-.435-.084 6.956 6.956 0 0 0-4.197.653c-.179.09-.355.188-.52.302l-.118.059c-.043.009-.086.024-.129.027a.495.495 0 0 1-.368-.121.51.51 0 0 1-.054-.712.835.835 0 0 1 .196-.153 7.58 7.58 0 0 1 1.965-.856 7.889 7.889 0 0 1 2.523-.285 21.763 21.763 0 0 0-.322-.604c-.245-.452-.498-.9-.75-1.347-.532-.947-1.067-1.891-1.598-2.838-.312-.559-.622-1.119-.93-1.679-1.734-3.178-3.393-6.402-4.825-9.729a62.132 62.132 0 0 1-1.578-4.02 41.048 41.048 0 0 1-1.042-3.418 29.815 29.815 0 0 1-.349-1.527c-.081-.407-.147-.815-.22-1.223a31.486 31.486 0 0 0-1.382-5.103 29.021 29.021 0 0 0-5.157-8.851 38.611 38.611 0 0 0-.753-.867c-.25-.281-.505-.559-.752-.843a8.876 8.876 0 0 1-.196-.239c-.06-.08-.119-.159-.182-.236a5.577 5.577 0 0 0-.158-.187c-.347-.395-.707-.779-1.056-1.171-.122-.141-.244-.281-.364-.424a15.772 15.772 0 0 1-1.319-1.816 12.207 12.207 0 0 1-1.297-2.888c-.146-.491-.26-.99-.342-1.494-.054-.338-.09-.679-.134-1.017a39.402 39.402 0 0 0-.098-.677 45.972 45.972 0 0 0-1.071-4.831 71.601 71.601 0 0 0-1.234-4.026 73.112 73.112 0 0 0-.609-1.739c-.128-.354-.262-.705-.388-1.061-.043-.128-.087-.256-.128-.384a7.109 7.109 0 0 1-.176-.639c-.043-.197-.071-.397-.027-.597l.009-.031.013-.035a53.18 53.18 0 0 0 .374-3.452 40.998 40.998 0 0 0 .105-3.773c-.076-3.635-.705-7.318-2.326-10.598a17.782 17.782 0 0 0-2.641-3.947 19.09 19.09 0 0 0-3.421-3.013c-1.383-.96-2.889-1.788-4.525-2.222a10.37 10.37 0 0 0-2.635-.341c-.921-.003-1.837.102-2.755.166-.169.011-.339.019-.508.027-.763.023-1.537-.005-2.28-.199-.64-.168-1.251-.447-1.838-.746a26.002 26.002 0 0 1-2.421-1.428 50.924 50.924 0 0 1-5.284-4.02 36.63 36.63 0 0 1-1.537-1.411 19.278 19.278 0 0 1-1.195-1.264 6.88 6.88 0 0 1-.637-.853 2.283 2.283 0 0 1-.291-.635 2.35 2.35 0 0 1-.053-.487 10.43 10.43 0 0 1 .003-.685c.025-.732.091-1.463.164-2.191.182-1.836.427-3.667.689-5.494zM43.87 317.467v0zm85.933-.533v-.001.001zm-72.32-2.19v0zm58.707-.531l-.001-.002.001.002zm-60.189-83.459a.564.564 0 0 1 .249.096c.037.029.07.061.104.093.053.048.107.094.161.14 1.032.848 2.306 1.431 3.642 1.561.338.032.678.036 1.016.011.157-.012.311-.036.468-.053h.067c.114.01.22.049.307.126a.51.51 0 0 1-.046.792.54.54 0 0 1-.219.086 7.05 7.05 0 0 1-1.917.019 7.845 7.845 0 0 1-3.072-1.123 7.966 7.966 0 0 1-.894-.643 4.633 4.633 0 0 1-.196-.172.735.735 0 0 1-.154-.171.512.512 0 0 1 .162-.685.545.545 0 0 1 .255-.079c.034 0 .033 0 .067.002zm58.457-1.022c.076.01.148.029.214.068.2.12.294.368.224.59a.555.555 0 0 1-.115.194l-.174.177a5.534 5.534 0 0 1-.513.43c-.903.665-1.989 1.049-3.076 1.282a13.15 13.15 0 0 1-.755.138c-.327.049-.654.088-.984.116a14.34 14.34 0 0 1-1.988.041c-.038-.004-.037-.004-.075-.01a.53.53 0 0 1-.261-.143.511.511 0 0 1 .041-.74.505.505 0 0 1 .276-.115c.042-.004.084-.001.128.001.13.007.261.01.391.012 1.154.005 2.318-.099 3.437-.389.779-.201 1.553-.497 2.212-.966.146-.104.286-.217.417-.34.075-.069.144-.145.218-.217.028-.024.028-.023.059-.047a.613.613 0 0 1 .211-.079c.038-.003.073-.004.113-.003zm-47.657-80.961c.043.004.043.004.086.012.074.02.073.021.145.044.18.063.357.132.53.213.498.236.957.55 1.38.904a11.47 11.47 0 0 1 1.572 1.635c.908 1.13 1.669 2.377 2.348 3.656.364.687.704 1.385 1.023 2.094.227.505.446 1.016.644 1.534l.014.042a.528.528 0 0 1-.024.344.51.51 0 0 1-.744.214.552.552 0 0 1-.172-.197c-.036-.081-.065-.165-.098-.247-.062-.157-.072-.18-.14-.346a35.085 35.085 0 0 0-1.619-3.376 22.418 22.418 0 0 0-1.721-2.699 11.975 11.975 0 0 0-1.404-1.589 6.336 6.336 0 0 0-1.241-.926 4.242 4.242 0 0 0-.501-.237c-.098-.038-.199-.068-.297-.104l-.04-.018a.538.538 0 0 1-.192-.178.51.51 0 0 1 .12-.672.54.54 0 0 1 .243-.099c.043-.004.043-.004.088-.004zm32.097-.529a.524.524 0 0 1 .276.127.511.511 0 0 1 .062.681.548.548 0 0 1-.207.159c-.071.027-.143.048-.214.073a4.517 4.517 0 0 0-.417.18 5.844 5.844 0 0 0-1.245.866c-.524.463-.99.991-1.419 1.542-.849 1.092-1.562 2.287-2.2 3.511a33.496 33.496 0 0 0-1.511 3.311l-.017.041a.523.523 0 0 1-.419.282.51.51 0 0 1-.526-.382.536.536 0 0 1 .005-.261c.029-.088.065-.173.098-.259.326-.811.681-1.609 1.065-2.394.348-.711.72-1.412 1.12-2.095a22.91 22.91 0 0 1 1.272-1.957c.406-.555.842-1.089 1.322-1.581.587-.602 1.248-1.151 2.003-1.529a4.97 4.97 0 0 1 .525-.226c.111-.04.221-.082.339-.093.044 0 .044 0 .088.004zm-15.782-24.1a.513.513 0 0 1 .487.525.558.558 0 0 1-.047.192c-.248.54-.494 1.08-.738 1.622l-.008.017a.818.818 0 0 1 .099-.048.694.694 0 0 1 .226-.04c.111-.005.222 0 .331.018.157.026.308.08.446.16.088.05.169.112.24.182.537.519.54 1.44.077 2.007a1.362 1.362 0 0 1-.265.249 1.42 1.42 0 0 1-.976.233 1.792 1.792 0 0 1-.544-.138 1.507 1.507 0 0 1-.631-.514c-.282-.401-.361-.917-.308-1.397.013-.115.034-.23.064-.342.032-.119.077-.23.125-.342.118-.274.241-.546.363-.818l.457-1.002c.045-.099.089-.198.136-.295a.524.524 0 0 1 .41-.268l.056-.001zm.145 3.279c.044.055.099.1.147.151a.529.529 0 0 1 .122.394l-.002.017a.635.635 0 0 0 .021-.094c.021-.143-.003-.333-.133-.42a.298.298 0 0 0-.118-.043l-.024-.004c-.005 0-.015-.004-.013-.001zm-3.717-29.089a.509.509 0 0 1 .422.743.523.523 0 0 1-.195.201c-.127.066-.26.125-.387.185l-.404.197a52.24 52.24 0 0 0-3.372 1.812 25.058 25.058 0 0 0-2.398 1.581c-.432.328-.856.677-1.22 1.08a3.394 3.394 0 0 0-.333.424c-.064.098-.121.2-.163.31-.027.071-.038.144-.053.22l-.027.077a.52.52 0 0 1-.285.275.506.506 0 0 1-.684-.513c.007-.088.028-.177.052-.263.067-.234.179-.454.313-.658.16-.246.353-.473.557-.686a9.12 9.12 0 0 1 .809-.739c.429-.352.88-.676 1.34-.986a32.593 32.593 0 0 1 1.778-1.11c.679-.396 1.37-.773 2.067-1.137a50.203 50.203 0 0 1 1.945-.965c.038-.016.038-.016.076-.029.041-.01.04-.01.08-.016.04-.003.04-.003.082-.003zm7.448.003a.795.795 0 0 1 .119.029c.199.083.393.185.588.279a50.732 50.732 0 0 1 4.06 2.196c.529.322 1.051.656 1.556 1.012.414.291.818.597 1.2.928.29.251.569.517.818.81.182.215.35.447.476.699.072.144.13.295.168.451.02.086.038.178.031.267a.509.509 0 0 1-.605.454.5.5 0 0 1-.378-.337c-.021-.059-.026-.124-.042-.186a1.36 1.36 0 0 0-.039-.112c-.157-.355-.428-.654-.701-.924-.461-.455-.98-.851-1.509-1.223-.973-.684-2-1.291-3.041-1.865a50.03 50.03 0 0 0-2.973-1.517l-.071-.041a.545.545 0 0 1-.161-.18.511.511 0 0 1 .125-.628.543.543 0 0 1 .258-.111.699.699 0 0 1 .121-.001zm-5.07-23.888c.058.009.073.009.129.03a.507.507 0 0 1 .325.522c-.02.198-.042.394-.065.591a34.945 34.945 0 0 1-.321 2.063 27.545 27.545 0 0 1-.36 1.66c-.091.362-.19.723-.3 1.08-.088.286-.183.57-.287.85-.089.241-.184.479-.288.714a9.724 9.724 0 0 1-.428.851 6.877 6.877 0 0 1-.214.347c-.398.601-.926 1.163-1.618 1.416a2.393 2.393 0 0 1-.362.099c-.245.044-.493.072-.738.105-1.503.201-3.007.381-4.513.544-1.232.131-2.467.253-3.702.353-.98.08-1.963.148-2.947.188-.769.031-1.542.052-2.311.006a5.816 5.816 0 0 1-1.342-.227c-.921-.278-1.748-.799-2.453-1.447a9.675 9.675 0 0 1-.943-1.009c-.084-.102-.165-.205-.247-.308l-.12-.154-.044-.053-.032-.038a.052.052 0 0 1-.006-.007l.011.01.004.003-.051-.043-.044-.049-.038-.054a.51.51 0 0 1 .431-.763.52.52 0 0 1 .34.125c.038.031.072.067.107.104.082.096.159.194.236.293l.235.293c.096.116.194.231.293.345.605.67 1.311 1.261 2.149 1.616a4.4 4.4 0 0 0 1.016.296c.233.038.469.054.704.065.343.016.688.018 1.032.014a52.981 52.981 0 0 0 3.426-.174c1.902-.144 3.802-.339 5.697-.56.744-.086 1.487-.176 2.23-.272.47-.061.94-.119 1.409-.191.042-.008.083-.016.124-.027.087-.026.171-.057.25-.097.249-.125.459-.315.641-.523.362-.41.628-.901.853-1.397.198-.434.363-.884.51-1.338.195-.608.356-1.224.495-1.847a30.609 30.609 0 0 0 .574-3.551l.012-.066c.017-.055.019-.072.046-.123a.514.514 0 0 1 .299-.246c.057-.017.072-.016.131-.021l.065.002zm2.255.004a.508.508 0 0 1 .409.384c.021.09.022.186.032.278l.042.354a34.413 34.413 0 0 0 .385 2.387c.096.476.203.95.326 1.42.09.344.188.686.297 1.024.166.517.356 1.026.59 1.514.177.367.378.725.628 1.048.292.378.673.735 1.16.821.34.052.683.095 1.023.141 1.546.202 3.095.385 4.644.547 1.222.127 2.445.242 3.669.335 1.008.077 2.018.142 3.029.167.424.01.85.014 1.274-.001.326-.011.651-.03.972-.091.414-.08.816-.22 1.192-.41.305-.155.594-.341.866-.549a7.6 7.6 0 0 0 1.099-1.053c.21-.243.403-.5.606-.749l.085-.096c.05-.049.1-.096.162-.13a.506.506 0 0 1 .505.005.511.511 0 0 1 .178.693.589.589 0 0 1-.131.146l.003-.003.011-.009c-.073.078-.137.168-.202.251l-.247.308a11.13 11.13 0 0 1-.577.651 7.623 7.623 0 0 1-1.261 1.062 5.76 5.76 0 0 1-2.17.889 7.468 7.468 0 0 1-1.056.096c-.445.015-.89.011-1.335 0a63.576 63.576 0 0 1-3.598-.209 157.834 157.834 0 0 1-5.701-.579c-.717-.085-1.433-.174-2.149-.269-.352-.047-.705-.091-1.055-.146a2.333 2.333 0 0 1-.582-.178c-.642-.293-1.127-.846-1.5-1.43a8.294 8.294 0 0 1-.453-.82 12.043 12.043 0 0 1-.535-1.322c-.111-.32-.21-.642-.302-.967a22.66 22.66 0 0 1-.324-1.288 30.25 30.25 0 0 1-.311-1.587 30.41 30.41 0 0 1-.284-2.087l-.002-.066c.005-.058.004-.074.022-.13a.507.507 0 0 1 .5-.358l.066.006zM40.132 84.52l.036.03.003.002-.066-.068.027.036zm86.088-.265l.004-.003.035-.031.026-.035c-.022.023-.044.045-.065.069zM83.051 5.659c-.069.003-.138.006-.207.011a16.03 16.03 0 0 0-1.755.283 41 41 0 0 0-2.224.521 42.28 42.28 0 0 0-3.175.954c-.451.157-.897.321-1.339.5-.219.088-.439.178-.654.277a2.29 2.29 0 0 0-.129.069c-.488.3-.792.825-1.007 1.341a6.716 6.716 0 0 0-.279.818 9.533 9.533 0 0 0-.159.668c-.06.289-.108.58-.149.872-.111.8-.164 1.607-.189 2.414-.029 1.01-.01 2.021.039 3.03.051 1.095.14 2.189.255 3.281.084.804.183 1.607.305 2.407l.005.058a.579.579 0 0 1-.023.171.545.545 0 0 1-.081.155.637.637 0 0 1-.081.083c-.186.152-.45.13-.67.086a1.748 1.748 0 0 1-.031-.006c.032.141.059.285.081.428l.004.044a.54.54 0 0 1-.048.25.51.51 0 0 1-.765.183.53.53 0 0 1-.191-.326 6.113 6.113 0 0 0-.301-1.162 3.254 3.254 0 0 0-.22-.476 5.752 5.752 0 0 1-.125-.18l-.026-.043-.045-.052a.77.77 0 0 0-.15-.129.412.412 0 0 0-.105-.047.265.265 0 0 0-.073-.012c-.077-.002-.128.028-.176.087a.592.592 0 0 0-.045.07 1.4 1.4 0 0 0-.132.367 3.274 3.274 0 0 0-.058.34c-.009.083-.018.165-.023.249a8.697 8.697 0 0 0-.007.836c.007.215.023.429.038.643.004.071.008.141.015.211.052.439.144.874.234 1.307a42.415 42.415 0 0 0 .447 1.898c.084.321.173.639.272.954.06.188.122.377.197.56.019.046.039.091.06.136.014.029.029.064.049.088.101.12.246.208.382.279.1.052.205.098.312.134.131.046.276.085.418.09l-.54-4.16-.004-.065a.577.577 0 0 1 .038-.194.512.512 0 0 1 .337-.295c.057-.015.072-.013.131-.017l.066.005c.057.011.072.011.127.035.122.05.222.15.273.274.022.054.022.069.034.127l1.068 8.213c.005.064.004.128.011.193.007.054.016.109.026.162.07.314.207.601.386.859l.008.01c.269.383.638.704 1.031.956.122.079.247.152.377.22.143.076.29.147.438.212a22.142 22.142 0 0 0 1.622.603c1.199.392 2.429.693 3.671.916.334.06.67.114 1.005.162.226.032.451.064.678.088a8.547 8.547 0 0 0 1.353.009 21.91 21.91 0 0 0 1.645-.215 26.073 26.073 0 0 0 4.454-1.171c.295-.108.588-.222.879-.341.191-.079.378-.166.561-.263.641-.34 1.245-.818 1.588-1.47.091-.172.162-.355.207-.544.023-.097.039-.198.041-.299l.001-.05c.258-2.761.712-5.5 1.069-8.25l.013-.065a.53.53 0 0 1 .13-.226.509.509 0 0 1 .758.047.507.507 0 0 1 .1.242c.009.059.004.074.001.132-.123.951-.285 2.566-.444 4.151a1.87 1.87 0 0 0 .513-.156c.175-.078.349-.177.483-.316a.213.213 0 0 0 .028-.033c.061-.103.105-.218.147-.329.055-.146.104-.295.152-.444.12-.384.226-.773.325-1.163.16-.624.304-1.252.432-1.881.046-.224.089-.448.128-.673.028-.156.054-.313.069-.471.018-.234.034-.469.046-.703.013-.32.019-.639-.003-.958a3.853 3.853 0 0 0-.094-.64 1.28 1.28 0 0 0-.12-.315.602.602 0 0 0-.045-.071c-.048-.059-.1-.089-.177-.087a.38.38 0 0 0-.176.059.736.736 0 0 0-.122.101c-.06.061-.112.129-.16.2l-.047.077-.013.02c-.09.153-.16.317-.223.481a6.162 6.162 0 0 0-.25.88c-.022.108-.038.217-.058.325l-.012.042a.547.547 0 0 1-.139.214.509.509 0 0 1-.777-.118.522.522 0 0 1-.064-.331 7.43 7.43 0 0 1 .176-.815l-.265.113a.628.628 0 0 1-.17.04.511.511 0 0 1-.48-.276.573.573 0 0 1-.055-.226c.005-.106.009-.105.021-.21l.073-.74c.031-.336.06-.672.086-1.007a62.16 62.16 0 0 0 .207-5.389c-.014-1.339-.075-2.686-.28-4.011-.112-.721-.262-1.449-.535-2.127a3.767 3.767 0 0 0-.352-.69 1.88 1.88 0 0 0-.34-.394c-.161-.139-.354-.216-.547-.304a20.174 20.174 0 0 0-.958-.403 32.765 32.765 0 0 0-3.841-1.207 37.758 37.758 0 0 0-2.508-.553c-.32-.057-.64-.111-.962-.154a6.522 6.522 0 0 0-.723-.068zm.415 25.545c.462.011.935.055 1.367.232a.393.393 0 0 1 .192.19.378.378 0 1 1-.439.523c-.063-.015-.122-.042-.183-.061a2.85 2.85 0 0 0-.202-.052 4.453 4.453 0 0 0-.985-.073 8.12 8.12 0 0 0-1.342.153c-.073.014-.145.033-.218.043-.022.001-.042.002-.064.001a.38.38 0 0 1-.076-.744c.115-.028.234-.048.352-.07.44-.076.882-.125 1.329-.141.135-.002.135-.002.269-.001zm-.242-1.849c.647.02 1.287.164 1.91.329.735.194 1.459.43 2.171.696.033.014.032.013.063.031.05.032.092.07.124.121a.383.383 0 0 1-.146.541.4.4 0 0 1-.272.028c-.076-.024-.074-.026-.148-.054l-.311-.111a21.714 21.714 0 0 0-2.001-.601 9.335 9.335 0 0 0-.792-.161 4.496 4.496 0 0 0-.614-.061c-.249-.006-.5.024-.748.06-.337.05-.672.12-1.005.198-.82.193-1.631.435-2.43.705-.034.01-.033.01-.069.016a.402.402 0 0 1-.172-.015.384.384 0 0 1-.228-.513.408.408 0 0 1 .193-.194c.101-.039.206-.071.309-.104a27.62 27.62 0 0 1 2.224-.633 10.113 10.113 0 0 1 1.64-.272c.101-.005.201-.007.302-.006zm-1.251-1.259c.156.01.308.03.459.073.041.013.082.026.122.041.045.017.087.036.133.049.041.011.083.019.125.025.199.024.401.023.6.007.123-.009.247-.025.366-.053.052-.012.102-.029.151-.044l.077-.021c.105-.022.21-.04.318-.047.288-.019.58.022.859.096.413.109.806.289 1.178.498a7.787 7.787 0 0 1 1.052.71c.026.024.025.024.049.05a.397.397 0 0 1 .079.154.385.385 0 0 1-.212.436.399.399 0 0 1-.136.033.393.393 0 0 1-.26-.085 6.738 6.738 0 0 0-.231-.178c-.438-.315-.906-.601-1.413-.789-.274-.102-.568-.179-.864-.171a1.253 1.253 0 0 0-.243.031c-.077.019-.152.046-.229.065a3.277 3.277 0 0 1-.202.039 4.333 4.333 0 0 1-.692.045 2.703 2.703 0 0 1-.459-.043 1.445 1.445 0 0 1-.217-.058c-.054-.02-.107-.045-.162-.062-.04-.011-.08-.02-.121-.027-.38-.056-.765.032-1.125.156a6.905 6.905 0 0 0-1.404.69c-.118.074-.235.151-.352.231l-.122.086c-.031.016-.03.016-.064.029a.39.39 0 0 1-.335-.038.382.382 0 0 1-.131-.493.4.4 0 0 1 .114-.131c.099-.076.204-.144.308-.212.169-.11.342-.215.516-.315.319-.18.647-.344.988-.477a4.037 4.037 0 0 1 1.311-.301c.085-.001.084-.001.169.001zm3.64-3.851a.403.403 0 0 1 .222.089.383.383 0 0 1-.079.631 8.275 8.275 0 0 1-1.228.491c-.341.104-.701.191-1.06.183-.215-.005-.418-.064-.623-.126a9.624 9.624 0 0 1-.843-.305 13.771 13.771 0 0 1-.394-.171c-.086-.039-.183-.073-.253-.14a.378.378 0 0 1 .424-.616c.133.062.268.122.402.179.356.149.717.285 1.089.387.035.009.071.018.107.025.119.016.241.008.359-.008a3.18 3.18 0 0 0 .388-.081c.316-.084.625-.199.924-.329.135-.057.265-.122.398-.182a.93.93 0 0 1 .07-.021.527.527 0 0 1 .097-.006zm11.301-3.074c.096-1.212.191-2.423.285-3.635.123-1.617.247-3.233.358-4.85.037-.553.075-1.106.107-1.659.018-.323.037-.646.042-.97 0-.039 0-.079-.003-.118a5.803 5.803 0 0 0-.196-1.019 9.448 9.448 0 0 0-.521-1.44 10.063 10.063 0 0 0-2.985-3.765 11.635 11.635 0 0 0-2.963-1.645c-1.264-.484-2.598-.774-3.941-.931-3.109-.362-6.3.052-9.233 1.136-.861.317-1.702.684-2.513 1.11-.349.184-.694.378-1.027.588l.65 1.662-.942.368-.651-1.662c-.593.106-1.207.248-1.719.58-.562.365-.919.946-1.197 1.542-.178.379-.327.77-.468 1.163-.111.315-.218.631-.318.949a4.38 4.38 0 0 0-.063.224c-.182.74-.257 1.505-.306 2.264a37.39 37.39 0 0 0-.066 2.636c.006 1.184.049 2.369.112 3.552.069 1.293.163 2.584.279 3.874a1.25 1.25 0 0 1 .44.112c.366.163.637.47.841.812.1.131.208.252.333.36l.017.015c-.04-.297-.076-.594-.112-.89a61.258 61.258 0 0 1-.323-3.735 38.224 38.224 0 0 1-.027-4.132c.054-1.03.16-2.063.394-3.069a9.519 9.519 0 0 1 .281-.984c.261-.744.645-1.493 1.27-1.997.126-.103.262-.194.406-.271.158-.084.323-.15.487-.219.335-.141.672-.274 1.012-.401a40.862 40.862 0 0 1 3.601-1.137 41.68 41.68 0 0 1 2.917-.683c.334-.065.668-.124 1.003-.174.273-.039.548-.073.824-.084h.087c.276.01.55.041.823.077.337.045.673.101 1.008.163.925.167 1.844.376 2.753.612 1.281.332 2.551.719 3.783 1.2.34.133.675.273 1.008.424.157.07.317.139.467.227.129.076.251.166.362.265.43.385.718.909.93 1.439.321.798.495 1.654.619 2.505.103.703.166 1.412.207 2.121.049.854.067 1.708.062 2.561a67.272 67.272 0 0 1-.298 5.818l-.004.05.45-.193c.233-.345.544-.641.953-.752.099-.026.2-.039.303-.044.045-.002.044-.002.09 0 .106.005.21.02.312.05zm-19.758-2.774a2.19 2.19 0 0 0-1.479 1.177c-.019.042-.034.086-.055.127l-.031.046a.396.396 0 0 1-.231.142.383.383 0 0 1-.445-.427c.013-.091.06-.179.1-.26.087-.173.192-.337.311-.489A2.991 2.991 0 0 1 76.83 17.7a3.74 3.74 0 0 1 .91-.138h.202c.124.003.248.007.373.017.673.054 1.373.236 1.913.661a2.435 2.435 0 0 1 .548.592c.014.025.014.024.025.049a.397.397 0 0 1 .024.218.385.385 0 0 1-.457.299.382.382 0 0 1-.17-.089c-.069-.062-.116-.146-.174-.217a1.728 1.728 0 0 0-.315-.294c-.335-.239-.736-.365-1.143-.427a.85.85 0 0 1-.304 1.246 6.65 6.65 0 0 0 .792-.136c.064-.015.128-.037.193-.05a.38.38 0 0 1 .188.732c-.066.023-.137.039-.205.055-.156.037-.314.07-.473.096a6.468 6.468 0 0 1-1.578.08 4.498 4.498 0 0 1-.886-.159 2.584 2.584 0 0 1-.149-.048.547.547 0 0 1-.182-.087.404.404 0 0 1-.086-.098.384.384 0 0 1 .1-.502.397.397 0 0 1 .245-.073c.021.002.042.004.064.009.036.009.068.022.104.034.058.02.117.037.177.054.324.085.658.124.991.129a.852.852 0 0 1-.401-1.256zm10.675-.026c-.393.061-.784.181-1.113.408-.117.08-.224.174-.317.281-.058.066-.105.14-.161.208-.018.021-.017.02-.037.04a.389.389 0 0 1-.414.065.383.383 0 0 1-.193-.49c.029-.069.084-.133.129-.193.11-.144.236-.277.375-.394.629-.524 1.46-.7 2.26-.732a3.763 3.763 0 0 1 1.209.136 2.988 2.988 0 0 1 1.839 1.551.641.641 0 0 1 .079.266.395.395 0 0 1-.025.136.383.383 0 0 1-.528.2.383.383 0 0 1-.157-.152c-.028-.051-.047-.108-.072-.161a2.293 2.293 0 0 0-.394-.545 2.24 2.24 0 0 0-1.07-.598.854.854 0 0 1-.287 1.201 3.17 3.17 0 0 0 .406-.091c.073-.022.145-.051.22-.071a.462.462 0 0 1 .065-.009h.043c.08.007.155.035.217.086.169.14.183.402.031.558a.407.407 0 0 1-.146.092 7.873 7.873 0 0 1-.217.072c-.62.175-1.266.207-1.906.151a7.014 7.014 0 0 1-1.193-.21.615.615 0 0 1-.082-.029.412.412 0 0 1-.134-.108.384.384 0 0 1 .19-.597.395.395 0 0 1 .213-.001 6.284 6.284 0 0 0 1.557.214.855.855 0 0 1-.387-1.284zm.396.49a.3.3 0 0 1 .301-.298.3.3 0 1 1 0 .598.3.3 0 0 1-.301-.3zm-10.355.3a.299.299 0 1 1-.002-.598.299.299 0 0 1 .002.598zm11.613-4.211c.369.007.738.023 1.104.079.24.036.483.089.709.181.09.035.177.079.259.13.137.088.262.197.384.305.306.265.58.568.802.906.064.096.122.194.177.295l.136.266c.017.018.016.019.03.038a.398.398 0 0 1 .065.218.383.383 0 0 1-.417.372.397.397 0 0 1-.242-.12.742.742 0 0 1-.093-.129c-.057-.109-.111-.22-.171-.328a3.503 3.503 0 0 0-.565-.741 4.982 4.982 0 0 0-.484-.421.675.675 0 0 0-.09-.055c-.22-.107-.471-.15-.711-.181a8.556 8.556 0 0 0-1.153-.058c-.994.006-1.986.101-2.972.225-.26.033-.52.068-.779.107-.084.012-.168.027-.252.037-.033.001-.032.001-.066-.001a.407.407 0 0 1-.209-.091.382.382 0 0 1-.014-.559.396.396 0 0 1 .171-.095c.171-.034.346-.054.518-.079a31.358 31.358 0 0 1 3.193-.294c.223-.006.447-.009.67-.007zm-12.457-.001c1.292.014 2.579.155 3.856.34l.226.034c.1.02.187.069.247.152a.383.383 0 0 1-.17.577.409.409 0 0 1-.196.02 33.884 33.884 0 0 0-2.661-.308 17.449 17.449 0 0 0-1.68-.054 6.72 6.72 0 0 0-.971.083 1.764 1.764 0 0 0-.545.165c-.057.031-.108.073-.159.114-.085.068-.169.14-.249.213-.238.218-.45.462-.622.734-.096.152-.172.314-.256.472a.827.827 0 0 1-.061.093.399.399 0 0 1-.406.146.383.383 0 0 1-.264-.492.38.38 0 0 1 .074-.126c.056-.106.109-.214.166-.319.248-.436.57-.819.947-1.148.123-.108.248-.217.386-.305.08-.051.168-.095.257-.131.228-.092.47-.144.712-.18.321-.049.647-.067.972-.077.133-.002.264-.003.397-.003zm-3.815 2.139l-.004.005c.004-.004.009-.009.004-.005zm19.826.005c-.009-.01-.009-.009-.019-.017l.019.017z"></path>
                                                  </g>
                                                  <g class="body-parts">
                                                    <path
                                                      d="M70.441 17.651l-.416-.2a6.092 6.092 0 0 0-.79-.262l-.89-.121-.037-.565a66.016 66.016 0 0 1-.075-3.359c.005-.882.03-1.765.105-2.644.065-.747.16-1.499.373-2.22.074-.236.154-.471.234-.704.219-.634.452-1.267.762-1.861.291-.558.661-1.08 1.162-1.469.32-.249.681-.436 1.061-.574.511-.188 1.045-.292 1.582-.377l.079-.052c1.08-.698 2.246-1.266 3.443-1.736A21.897 21.897 0 0 1 82.235.169a21.556 21.556 0 0 1 2.858-.168c1.713.026 3.432.242 5.081.716 1.213.348 2.387.845 3.46 1.513a11.474 11.474 0 0 1 2.218 1.796c.915.958 1.653 2.08 2.169 3.299.201.475.37.965.497 1.466.079.308.145.621.181.938.028.25.016.5.005.752-.014.323-.033.647-.053.969-.059.947-.126 1.893-.194 2.839l-.209 2.712h-.093a6.09 6.09 0 0 0-2.18.45l-.038.019-.224-.349a7.873 7.873 0 0 0-1.283-1.225 11.174 11.174 0 0 0-2.389-1.382c-1.224-.53-2.522-.881-3.835-1.114a24.305 24.305 0 0 0-2.065-.274 32.387 32.387 0 0 0-2.625-.125h-.515c-.877.009-1.752.045-2.625.125-.692.063-1.382.152-2.067.274-1.266.225-2.519.56-3.707 1.058-.864.363-1.694.813-2.443 1.376a8.093 8.093 0 0 0-1.368 1.286l-.35.531z"
                                                      class="body-area hover_body body-area-head"
                                                      title="Head"
                                                      data-toggle="popover"
                                                      data-container="body"
                                                      data-placement="right"
                                                      type="button"
                                                      data-html="true"
                                                      href="#"
                                                      body_part="Head"
                                                      id="body-area-head"
                                                      onClick={
                                                        this.attributeSymptomTag
                                                      }
                                                      gender="male"
                                                    ></path>
                                                    <path
                                                      d="M77.5 15c2.484 0 4.5 1.456 4.5 3.25s-2.016 3.25-4.5 3.25-4.5-1.456-4.5-3.25S75.016 15 77.5 15zm11.25 0c2.346 0 4.25 1.456 4.25 3.25s-1.904 3.25-4.25 3.25-4.25-1.456-4.25-3.25S86.404 15 88.75 15z"
                                                      class="body-area hover_body body-area-eyes "
                                                      body_part="Eyes"
                                                      title="Eyes"
                                                      data-toggle="popover"
                                                      data-container="body"
                                                      data-placement="right"
                                                      type="button"
                                                      data-html="true"
                                                      href="#"
                                                      id="body-area-eyes"
                                                      onClick={
                                                        this.attributeSymptomTag
                                                      }
                                                      gender="male"
                                                    ></path>
                                                    <path
                                                      d="M98.171 18.001l-.298 3.865-.032.396a3.613 3.613 0 0 1 .12.61 6.96 6.96 0 0 1 .046.824c0 .184-.005.367-.013.551-.013.248-.03.496-.048.742l-.017.158a22.855 22.855 0 0 1-.328 1.716 34.06 34.06 0 0 1-.539 2.154c-.085.295-.175.589-.284.876a2.438 2.438 0 0 1-.277.569 1.69 1.69 0 0 1-.403.384 3.06 3.06 0 0 1-.51.29 3.327 3.327 0 0 1-.371.141 3.372 3.372 0 0 1-.191.051c-.15.035-.31.06-.469.063l-.108.952a7.685 7.685 0 0 1-1.439-1.99c-.699-1.372-1.025-2.921-1.009-4.458.015-1.587.398-3.182 1.18-4.568.733-1.297 1.841-2.429 3.245-2.979.216-.085.438-.155.664-.21a5.112 5.112 0 0 1 1.081-.137zm-29.76.074l.574.082c.225.058.446.132.661.22 1.371.561 2.452 1.675 3.173 2.95.783 1.386 1.164 2.981 1.18 4.568.016 1.536-.31 3.086-1.009 4.458a7.743 7.743 0 0 1-1.239 1.784l-.097-.749-.061.003a2.406 2.406 0 0 1-.723-.114 3.174 3.174 0 0 1-.72-.325c-.229-.14-.456-.317-.602-.546a3.257 3.257 0 0 1-.295-.67 17.65 17.65 0 0 1-.342-1.128 38.729 38.729 0 0 1-.714-3.206 4.663 4.663 0 0 1-.06-.454c-.019-.277-.039-.554-.05-.831a9.72 9.72 0 0 1 .015-1.017 6.056 6.056 0 0 1 .068-.528c.073-.385.212-.791.485-1.078-.026-.257-.048-.515-.07-.772l-.174-2.647z"
                                                      class="body-area hover_body body-area-ears "
                                                      title="Ears"
                                                      data-toggle="popover"
                                                      data-container="body"
                                                      data-placement="right"
                                                      type="button"
                                                      data-html="true"
                                                      href="#"
                                                      body_part="ears"
                                                      id="body-area-ears"
                                                      onClick={
                                                        this.attributeSymptomTag
                                                      }
                                                      gender="male"
                                                    ></path>
                                                    <path
                                                      d="M83.259 19.144c1.557-.02 1.97 1.742 2 1.957l1 4.493a2.042 2.042 0 0 1-.139.755 1.983 1.983 0 0 1-.261.457 1.689 1.689 0 0 1-1.305.676c-.879.012-1.758.034-2.635-.001a1.716 1.716 0 0 1-.389-.069 1.75 1.75 0 0 1-.872-.606 1.944 1.944 0 0 1-.4-1.227c.257-1.58.731-2.9 1.001-4.478.061-.307.442-1.938 2-1.957z"
                                                      fill-rule="nonzero"
                                                      class="body-area hover_body body-area-nose "
                                                      id="body-area-nose"
                                                      title="Nose"
                                                      data-toggle="popover"
                                                      data-container="body"
                                                      data-placement="right"
                                                      type="button"
                                                      data-html="true"
                                                      href="#"
                                                      body_part="Nose"
                                                      onClick={
                                                        this.attributeSymptomTag
                                                      }
                                                      gender="male"
                                                    ></path>
                                                    <path
                                                      d="M74.117 30.178l.157.24.022-.014c.445-.283.915-.527 1.393-.752a17.735 17.735 0 0 1 1.913-.765 17.499 17.499 0 0 1 4.731-.898 16.276 16.276 0 0 1 3.765.26c1.126.213 2.229.547 3.287.987a18.545 18.545 0 0 1 2.36 1.194l.142-.241.186.527c.534 1.076 1.281 2.066 2.239 2.831l-.085.758-.169.226-.014-.142a2.503 2.503 0 0 1-.007.151l-.003.023c-.786 1.13-1.961 1.963-3.22 2.54-.383.175-.775.329-1.174.464-.514.174-1.038.317-1.568.435-.611.136-1.23.238-1.851.314-.802.098-1.61.152-2.417.174-.954.025-1.91.008-2.862-.056-1.245-.084-2.489-.251-3.698-.56-.428-.11-.852-.238-1.268-.389a11.006 11.006 0 0 1-.94-.39 9.007 9.007 0 0 1-.795-.422 7.954 7.954 0 0 1-.576-.38 7.035 7.035 0 0 1-.488-.388c-.436-.382-.823-.826-1.097-1.339l-.036-.177v.008l-.136-1.052c.847-.708 1.525-1.632 2.019-2.629l.19-.538z"
                                                      class="body-area hover_body body-area-oral_cavity "
                                                      id="body-area-oral_cavity"
                                                      title="Oral Cavity"
                                                      data-toggle="popover"
                                                      data-container="body"
                                                      data-placement="right"
                                                      type="button"
                                                      data-html="true"
                                                      href="#"
                                                      body_part="oral_cavity"
                                                      onClick={
                                                        this.attributeSymptomTag
                                                      }
                                                      gender="male"
                                                    ></path>
                                                    <path
                                                      d="M93.499 36.583l-.095.641c-.26 1.834-.509 3.671-.692 5.514a37.075 37.075 0 0 0-.147 1.825c-.011.231-.02.463-.019.695 0 .154.003.309.02.464a.505.505 0 0 0 .012.053c.034.098.081.189.133.277.072.123.153.241.238.355.26.352.553.678.853.996.46.485.944.947 1.437 1.397.537.488 1.086.961 1.646 1.422l2.309 1.784a38.184 38.184 0 0 1-5.444 1.84 39.964 39.964 0 0 1-9.483 1.236c-3.641.04-7.284-.395-10.826-1.237a46.702 46.702 0 0 1-5.191-1.555l-1.119-.474.485-.353a48.993 48.993 0 0 0 2.496-2.075 34.618 34.618 0 0 0 1.48-1.387c.34-.339.672-.686.986-1.05.214-.249.421-.504.601-.778.057-.086.11-.174.157-.265a.946.946 0 0 0 .082-.204c.008-.032.01-.067.012-.1.008-.096.011-.192.013-.288.005-.219 0-.44-.007-.659-.021-.66-.071-1.32-.125-1.979l-.638-5.917c.421.378.908.701 1.415.975.353.192.717.361 1.089.513.476.194.964.357 1.459.497 1.301.365 2.645.565 3.991.668a31.4 31.4 0 0 0 3.203.075 26.368 26.368 0 0 0 2.512-.18 20.232 20.232 0 0 0 2.146-.376c.613-.144 1.218-.32 1.808-.537 1.164-.427 2.286-1.021 3.203-1.813z"
                                                      class="body-area hover_body body-area-neck_or_throat "
                                                      id="body-area-neck_or_throat"
                                                      title="Neck or Throat "
                                                      data-toggle="popover"
                                                      data-container="body"
                                                      data-placement="right"
                                                      type="button"
                                                      data-html="true"
                                                      href="#"
                                                      body_part="neck_or_throat"
                                                      onClick={
                                                        this.attributeSymptomTag
                                                      }
                                                      gender="male"
                                                    ></path>
                                                    <path
                                                      d="M55.469 83.872l.201-4.26c.159-2.794.346-5.587.577-8.376.209-2.52.453-5.038.765-7.548.202-1.626.431-3.25.717-4.863l.694-3.205.154.008c.159.008.318.015.478.02.64.013 1.287-.013 1.911-.168.263-.066.518-.16.769-.264.318-.132.628-.282.933-.442a24.631 24.631 0 0 0 2.312-1.396l1.168-.848 1.129.464a47.26 47.26 0 0 0 5.933 1.824c3.555.845 7.209 1.288 10.864 1.265a41.017 41.017 0 0 0 9.925-1.268c1.951-.5 3.864-1.15 5.717-1.939l.427-.203 1.844 1.233c.603.368 1.222.718 1.863 1.018.457.213.93.408 1.425.507.901.181 1.824.127 2.732.054l.94-.076 1.022 3.457c.458 2.038.733 4.116.897 6.197a59.88 59.88 0 0 1 .159 6.312c-.007.204-.015.408-.025.613v10.875c-.521.973-1.43 1.73-2.4 2.294-.354.206-.721.389-1.096.555a14.81 14.81 0 0 1-1.339.51c-1.327.436-2.704.713-4.087.904a42.295 42.295 0 0 1-4.915.363 48.41 48.41 0 0 1-4.587-.102c-1.242-.092-2.483-.244-3.702-.507a17.497 17.497 0 0 1-1.256-.32 12.84 12.84 0 0 1-.924-.31c-.227-.087-.452-.18-.672-.282a8.713 8.713 0 0 1-.57-.29 6.446 6.446 0 0 1-.475-.293c-.392-.265-.761-.578-1.048-.957a2.337 2.337 0 0 1-.403-.782 2.466 2.466 0 0 1-.024-.118c-.006-.057-.003-.057-.004-.141l-.283-.626-.6.073-.114.614-.002.066v.006c-.014.14-.066.278-.125.405a2.657 2.657 0 0 1-.458.659c-.3.326-.66.596-1.037.828a9.148 9.148 0 0 1-1.613.763c-.315.116-.634.22-.956.313-.429.125-.864.232-1.302.325a25.2 25.2 0 0 1-1.544.277c-1.574.234-3.165.344-4.754.389a53.51 53.51 0 0 1-3.538-.013 37.416 37.416 0 0 1-3.491-.288 24.79 24.79 0 0 1-2.936-.559c-1.362-.352-2.711-.844-3.902-1.603a6.346 6.346 0 0 1-1.374-1.144z"
                                                      class="body-area hover_body body-area-chest "
                                                      id="body-area-chest"
                                                      title="Chest"
                                                      data-toggle="popover"
                                                      data-container="body"
                                                      data-placement="right"
                                                      type="button"
                                                      data-html="true"
                                                      href="#"
                                                      body_part="chest"
                                                      onClick={
                                                        this.attributeSymptomTag
                                                      }
                                                      gender="male"
                                                    ></path>
                                                    <path
                                                      d="M118.438 107.185l-.814-1.744c-.457-.941-.924-1.877-1.394-2.813L112 94.391V72.012l.007-.147c.041-.997.05-1.994.035-2.991a62.101 62.101 0 0 0-.123-3.111c-.156-2.389-.448-4.778-.974-7.116a25.425 25.425 0 0 0-.951-3.28l.743-.006c.605.021 1.21.088 1.805.207 2.011.399 3.86 1.367 5.532 2.529.582.404 1.146.833 1.686 1.293a18.921 18.921 0 0 1 4.437 5.522 20.998 20.998 0 0 1 1.473 3.533c.647 2.048 1.002 4.181 1.151 6.321.212 3.063.001 6.137-.426 9.173l-.02.074c.011.113.042.226.071.336.041.157.09.312.141.467.17.519.371 1.028.557 1.542a77.661 77.661 0 0 1 1.779 5.598c.318 1.164.605 2.338.84 3.521.124.626.234 1.255.323 1.888.048.336.084.674.131 1.012.02.137.042.276.066.413.091.485.21.966.363 1.436l.688 1.537-.545.411a33.88 33.88 0 0 1-8.473 4.081 30.541 30.541 0 0 1-3.245.84l-.633.09zm-82.461-6.845l.017-.046c.128-.45.228-.907.298-1.37.049-.329.081-.66.12-.99.03-.234.061-.467.094-.701a47.275 47.275 0 0 1 1.042-4.951 74.743 74.743 0 0 1 1.209-4.095c.194-.591.393-1.181.599-1.768.123-.351.253-.701.373-1.052.052-.154.1-.308.147-.461.05-.175.099-.351.129-.531.005-.029.005-.029.008-.06v-.001l-.021-.077a55.636 55.636 0 0 1-.357-2.793 45.986 45.986 0 0 1-.164-2.134 41.233 41.233 0 0 1-.057-1.793c-.033-3.501.407-7.05 1.68-10.329.169-.436.352-.866.552-1.289.305-.65.645-1.284 1.02-1.897a18.616 18.616 0 0 1 1.812-2.478 19.054 19.054 0 0 1 2.042-2.026 21.792 21.792 0 0 1 1.677-1.292c1.428-.996 2.981-1.846 4.665-2.312a11.532 11.532 0 0 1 3.082-.405l1.44.076-.017.057a51.035 51.035 0 0 0-.695 3.443c-.149.874-.283 1.75-.406 2.628a153.186 153.186 0 0 0-.785 6.858 272.913 272.913 0 0 0-.619 7.876c-.411 6.299-.664 12.609-.816 18.921l-.586 1.223a1002.303 1002.303 0 0 0-3.618 7.634l-.894 1.934-.699-.082a34.627 34.627 0 0 1-2.938-.607c-1.893-.481-3.754-1.141-5.472-2.078-1.141-.622-2.22-1.37-3.158-2.272l-.704-.76z"
                                                      class="body-area hover_body body-area-upper_arm "
                                                      id="body-area-upper_arm"
                                                      title="Upper Arm "
                                                      data-toggle="popover"
                                                      data-container="body"
                                                      data-placement="right"
                                                      type="button"
                                                      data-html="true"
                                                      href="#"
                                                      body_part="upper_arm"
                                                      onClick={
                                                        this.attributeSymptomTag
                                                      }
                                                      gender="male"
                                                    ></path>
                                                    <path
                                                      d="M111 84.53V96h.169l-.489 1.892c-.378 1.409-.768 2.813-1.149 4.221-.495 1.858-.969 3.729-1.276 5.887H58.22c-.257-1.982-.752-3.942-1.271-5.888-.323-1.2-.655-2.398-.981-3.598-.256-.95-.508-1.901-.744-2.857l-.157-.659.197-6.767.143-3.041c.651.559 1.417 1.014 2.207 1.384.251.117.505.227.762.329.276.11.555.211.837.306 1.308.438 2.665.723 4.03.918 1.67.239 3.359.344 5.045.369 1.109.016 2.218 0 3.326-.05a39.49 39.49 0 0 0 3.778-.335 24.815 24.815 0 0 0 2.539-.485 15.111 15.111 0 0 0 2.197-.716c.951-.4 1.874-.931 2.573-1.703.047-.053.092-.107.137-.161.054-.068.106-.137.156-.208l.023.034c.61.877 1.52 1.494 2.471 1.95.195.093.393.18.593.261.219.089.441.172.665.249.297.101.597.193.9.276.396.109.796.204 1.199.287.524.109 1.053.198 1.583.271.607.085 1.217.15 1.828.199.789.064 1.58.102 2.371.121.987.024 1.974.021 2.96-.007a43.906 43.906 0 0 0 3.988-.28c1.581-.189 3.157-.477 4.678-.955a15.882 15.882 0 0 0 1.839-.7c.177-.082.353-.167.526-.257.872-.451 1.706-1.021 2.382-1.757z"
                                                      class="body-area hover_body body-area-upper_abdomen "
                                                      id="body-area-upper_abdomen"
                                                      title="Upper Abdomen "
                                                      data-toggle="popover"
                                                      data-container="body"
                                                      data-placement="right"
                                                      type="button"
                                                      data-html="true"
                                                      href="#"
                                                      body_part="upper_abdomen"
                                                      onClick={
                                                        this.attributeSymptomTag
                                                      }
                                                      gender="male"
                                                    ></path>
                                                    <path
                                                      d="M35.594 101.399l.291.321c1.025 1.009 2.214 1.842 3.475 2.53 1.791.977 3.731 1.668 5.705 2.169a35.38 35.38 0 0 0 3.023.625l.438.051-.552 1.267a32.287 32.287 0 0 0-1.47 4.668l-.031.138-.021.096c-.039.294-.079.588-.122.882-.172 1.155-.377 2.31-.796 3.405-.313.821-.735 1.593-1.17 2.355-.434.758-.88 1.509-1.319 2.264-.29.503-.58 1.008-.867 1.513-.285.506-.566 1.014-.848 1.521-.125.222-.252.442-.379.664-1.198 2.053-2.49 4.048-3.824 6.016a234.013 234.013 0 0 1-4.788 6.767c-1.111 1.521-2.241 3.028-3.355 4.547-.182.252-.361.506-.545.756-.306.409-.624.809-.932 1.218a11.35 11.35 0 0 0-1.238 2.053c-.394.851-.68 1.749-.902 2.659l-.054.31-.837-.1c-2.807-.495-5.546-1.482-7.933-3.056a14.013 14.013 0 0 1-1.659-1.266l.57-.95c1.926-3.243 3.774-6.538 5.342-9.971a54.565 54.565 0 0 0 1.61-3.885 36.739 36.739 0 0 0 1.13-3.592c.187-.735.346-1.478.467-2.227.077-.484.133-.971.203-1.457a34.97 34.97 0 0 1 1.156-5.133 33.135 33.135 0 0 1 5.133-10.082c.224-.298.452-.594.683-.887.206-.263.417-.523.621-.789l.191-.257c.204-.26.424-.506.645-.751l.471-.528c.142-.164.284-.328.423-.494a14.99 14.99 0 0 0 1.302-1.814 9.692 9.692 0 0 0 .763-1.556zm96.214 1.26c.437.732.962 1.402 1.522 2.041.351.394.711.779 1.061 1.174.079.094.159.187.236.285.064.08.123.164.187.244l.187.222c.344.389.694.772 1.036 1.163a32.042 32.042 0 0 1 2.803 3.707 30.154 30.154 0 0 1 3.078 6.318c.422 1.205.77 2.436 1.045 3.683.14.635.256 1.274.366 1.914.044.242.044.241.091.481.084.41.174.819.274 1.226a40.66 40.66 0 0 0 1.266 4.107 65.684 65.684 0 0 0 1.595 3.959c1.366 3.11 2.923 6.135 4.554 9.114l1.489 2.661a30.18 30.18 0 0 1-7.78 3.83l-2.635.701a16.651 16.651 0 0 0-1.163-2.881 19.073 19.073 0 0 0-1.092-1.835c-.376-.563-.775-1.108-1.161-1.664-.135-.198-.263-.399-.399-.596-.48-.679-1.007-1.324-1.528-1.972-.66-.819-1.323-1.635-1.983-2.455-.384-.479-.769-.96-1.151-1.442-2.269-2.876-4.468-5.815-6.419-8.918a49.443 49.443 0 0 1-1.514-2.571c-.352-.642-.686-1.294-1.031-1.939-.191-.353-.384-.705-.578-1.058-.582-1.047-1.182-2.085-1.772-3.129-.111-.2-.221-.399-.33-.6a19.644 19.644 0 0 1-.496-.983c-.19-.41-.358-.832-.501-1.261-.371-1.122-.561-2.292-.723-3.459l-.027-.206a32.365 32.365 0 0 0-.751-2.438l-.749-1.937 3.128-.731a34.69 34.69 0 0 0 9.184-4.265l.681-.49z"
                                                      class="body-area hover_body body-area-forearm "
                                                      id="body-area-forearm"
                                                      title="Forearm"
                                                      data-toggle="popover"
                                                      data-container="body"
                                                      data-placement="right"
                                                      type="button"
                                                      data-html="true"
                                                      href="#"
                                                      body_part="forearm"
                                                      onClick={
                                                        this.attributeSymptomTag
                                                      }
                                                      gender="male"
                                                    ></path>
                                                    <path
                                                      d="M108.096 109l-.156.978a24.724 24.724 0 0 0-.116 2.494c.006.748.049 1.496.094 2.242a86.75 86.75 0 0 0 .728 7.183c.077.529.161 1.056.252 1.582.074.432.153.861.246 1.289.031.145.068.288.102.432.016.081.016.08.029.163.065.452.091.91.116 1.366.034.598.057 1.195.076 1.793.059 1.791.088 3.582.108 5.373l.003.306.258 1.409-3.246.477c-2.9.389-5.805.737-8.716 1.032-2.61.264-5.224.488-7.843.647-2.341.141-4.686.234-7.031.234-2.137 0-4.274-.077-6.407-.196a194.55 194.55 0 0 1-7.965-.621 283.67 283.67 0 0 1-8.48-.959l-3.582-.507.152-.7.185-.829a335 335 0 0 1 .067-4.074c.022-.904.046-1.809.086-2.713.018-.419.04-.84.07-1.259.019-.26.04-.521.079-.779.031-.201.087-.397.132-.595.039-.185.076-.37.113-.555a62.18 62.18 0 0 0 .542-3.46 87.047 87.047 0 0 0 .602-6.594c.033-.609.062-1.217.062-1.827 0-.693-.032-1.387-.091-2.078L58.373 109h49.723z"
                                                      class="body-area hover_body body-area-mid_abdomen "
                                                      id="body-area-mid_abdomen"
                                                      title="Mid Abdomen "
                                                      data-toggle="popover"
                                                      data-container="body"
                                                      data-placement="right"
                                                      type="button"
                                                      data-html="true"
                                                      href="#"
                                                      body_part="mid_abdomen"
                                                      onClick={
                                                        this.attributeSymptomTag
                                                      }
                                                      gender="male"
                                                    ></path>
                                                    <path
                                                      d="M110.016 136.591l1.177 6.438.051.256c-2.979.37-5.914 1.13-8.617 2.428a21.89 21.89 0 0 0-3.244 1.908 20.7 20.7 0 0 0-4.524 4.404c-2.053 2.719-3.424 5.908-4.164 9.23-.772-1.058-1.706-1.939-2.801-2.592a8.52 8.52 0 0 0-.935-.483 8.068 8.068 0 0 0-1.213-.423 8.082 8.082 0 0 0-1.875-.256h-.242a8.082 8.082 0 0 0-1.875.256c-.414.108-.82.25-1.213.423a8.52 8.52 0 0 0-.935.483c-1.564.933-2.799 2.329-3.665 3.953l-.293-1.07c-1.246-3.765-3.172-7.353-5.893-10.261-.421-.45-.861-.884-1.319-1.298-.663-.6-1.364-1.16-2.098-1.673a21.295 21.295 0 0 0-3.35-1.911c-2.005-.913-4.145-1.51-6.322-1.83l-1.991-.153 1.678-7.724 3.668.52c2.832.362 5.669.686 8.51.962 2.664.258 5.333.475 8.006.624 2.152.12 4.308.198 6.463.198 2.145 0 4.289-.077 6.43-.198 2.423-.136 4.842-.33 7.257-.561 2.641-.253 5.278-.552 7.911-.885l5.418-.765z"
                                                      class="body-area hover_body body-area-lower_abdomen "
                                                      id="body-area-lower_abdomen"
                                                      title="Lower Abdomen "
                                                      data-toggle="popover"
                                                      data-container="body"
                                                      data-placement="right"
                                                      type="button"
                                                      data-html="true"
                                                      href="#"
                                                      body_part="lower_abdomen"
                                                      onClick={
                                                        this.attributeSymptomTag
                                                      }
                                                      gender="male"
                                                    ></path>
                                                    <path
                                                      d="M14.388 146.596l1.479 1.194c2.463 1.652 5.292 2.706 8.199 3.246l1.075.133-.325 1.849c-.066.541-.116 1.084-.175 1.626l-.075.65c-.267 2.119-.646 4.224-1.197 6.289a32.84 32.84 0 0 1-.615 2.051 21.042 21.042 0 0 1-.644 1.691l-.07.145a29.264 29.264 0 0 0-.639 1.672c-.05.147-.098.295-.141.443-.02.072-.044.147-.058.221-.019.12-.022.243-.027.363-.007.185-.01.371-.012.556-.005.519.001 1.037.006 1.555.021 1.49.056 2.98.076 4.471.004.396.008.791.006 1.186-.002.288 0 .581-.029.87a3.919 3.919 0 0 1-.095.524c-.047.187-.11.372-.2.544a1.467 1.467 0 0 1-.396.485c-.142.111-.306.19-.48.24a1.583 1.583 0 0 1-.484.064 1.074 1.074 0 0 1-.219-.034c-.424-.112-.726-.473-.935-.84a3.552 3.552 0 0 1-.195-.404l-.026-.066c-.015-.043-.03-.08-.04-.126-.006-.026-.007-.051-.01-.076l-.378-7.678a3.853 3.853 0 0 0-.012-.415 2.262 2.262 0 0 0-.066-.385.856.856 0 0 0-.084-.208.582.582 0 0 0-.054.079c-.127.219-.193.468-.246.713l-.012.061c-.02.119-.031.239-.047.357-.02.146-.027.187-.048.333-.035.227-.072.455-.111.681-.503 2.827-1.317 5.586-2.123 8.338-.055.191-.11.382-.167.574-.05.165-.102.331-.159.494-.042.12-.086.24-.135.357-.174.426-.4.861-.775 1.143a1.532 1.532 0 0 1-.622.276 2.3 2.3 0 0 1-.543.034 2.507 2.507 0 0 1-.275-.023 1.108 1.108 0 0 1-.36-.124 1.219 1.219 0 0 1-.467-.493 2.181 2.181 0 0 1-.223-.792 5.153 5.153 0 0 1 .026-1.197l.005-.032 1.664-9.862c.034-.135.079-.269.116-.403.032-.123.061-.247.085-.371l.002-.011a7.647 7.647 0 0 0-.382.633c-.145.264-.281.535-.41.808a34.488 34.488 0 0 0-.855 1.975 88.333 88.333 0 0 0-1.68 4.616c-.143.424-.284.847-.425 1.272-.096.292-.19.586-.291.877-.032.09-.067.18-.103.268a3.346 3.346 0 0 1-.526.876 2.22 2.22 0 0 1-.57.474 2.382 2.382 0 0 1-1.251.295 2.4 2.4 0 0 1-.478-.048 1.13 1.13 0 0 1-.615-.381c-.283-.338-.361-.802-.368-1.232a4.482 4.482 0 0 1 .031-.571c.014-.131.036-.261.061-.391l.005-.026c.144-.556.338-1.098.509-1.646a3638.822 3638.822 0 0 1 2.205-7.083c.17-.544.339-1.09.516-1.633.017-.051.018-.051.038-.099.057-.117.11-.237.164-.355l.063-.15.031-.074c-.103.125-.201.252-.298.382-.47.625-.908 1.274-1.336 1.929a110.062 110.062 0 0 0-1.78 2.856c-.259.446-.509.896-.756 1.349-.015.029-.023.061-.035.092l-.059.138-.127.273c-.197.387-.421.764-.718 1.084-.18.192-.386.362-.623.478-.195.096-.41.152-.628.153a1.493 1.493 0 0 1-.774-.222 1.461 1.461 0 0 1-.391-.335c-.2-.252-.3-.565-.334-.882a3.313 3.313 0 0 1 .022-.79c.05-.363.14-.719.248-1.069.22-.717.515-1.41.824-2.093.183-.404.375-.804.555-1.208.064-.148.122-.298.185-.446.334-.756.723-1.488 1.116-2.215a45.43 45.43 0 0 1 1.287-2.248c.097-.157.2-.31.3-.464.022-.039.041-.077.061-.117.116-.257.201-.527.281-.798.089-.302.167-.608.24-.914.193-.81.351-1.629.475-2.452-.157.193-.311.39-.467.586-.449.576-.892 1.159-1.349 1.732l-.192.231c-.253.277-.58.474-.922.621-.743.319-1.606.421-2.39.2a2.895 2.895 0 0 1-.51-.198 1.79 1.79 0 0 1-.31-.193 1.074 1.074 0 0 1-.396-.78c-.016-.356.128-.698.305-1 .157-.264.345-.51.542-.745.264-.313.547-.608.834-.899.223-.225.449-.447.669-.673.072-.077.144-.153.212-.233.181-.222.311-.479.436-.737.181-.384.346-.776.524-1.162.255-.541.54-1.074.936-1.526a4.48 4.48 0 0 1 .516-.487 11.9 11.9 0 0 1 .619-.48 40.722 40.722 0 0 1 1.962-1.332 86.388 86.388 0 0 1 1.577-.987l.5-.304c.067-.04.133-.081.202-.121.103-.057.213-.105.32-.155.199-.091.4-.174.604-.251a8.26 8.26 0 0 1 1.595-.423 5.18 5.18 0 0 1 .173-.361c.241-.47.511-.924.78-1.379l1.081-1.798zm138.702-.759l1.022 1.825c.135.242.268.486.4.73.105.199.211.397.311.598.067.134.133.271.193.409.119.026.239.052.358.082a8.954 8.954 0 0 1 1.804.683c.235.14.468.282.702.423a65.61 65.61 0 0 1 2.92 1.88c.336.232.668.469.99.72.31.242.611.495.86.801.595.73.928 1.624 1.315 2.47.048.102.097.204.148.304.087.164.177.329.29.478.078.104.17.197.259.292.263.27.532.535.797.804.264.272.526.548.767.842.174.213.34.434.481.673.177.3.321.644.304 1a1.062 1.062 0 0 1-.396.779 1.651 1.651 0 0 1-.31.192 2.845 2.845 0 0 1-.583.218c-.725.185-1.508.099-2.2-.172a3.036 3.036 0 0 1-.85-.488c-.144-.121-.261-.267-.38-.412-.457-.571-.899-1.155-1.349-1.731l-.035-.043a36.91 36.91 0 0 0 .878 2.325c.141.339.287.68.464 1.004.048.09.105.173.161.257.06.09.084.13.144.223.115.185.228.372.341.56.39.661.765 1.331 1.128 2.007a34.2 34.2 0 0 1 .889 1.75c.061.132.121.264.176.398.044.107.086.215.132.321.181.404.371.805.556 1.208.237.53.468 1.063.663 1.609.126.355.239.715.322 1.083.112.494.183 1.03.062 1.532-.053.22-.147.43-.288.608a1.415 1.415 0 0 1-.391.336c-.26.155-.56.24-.865.218a1.539 1.539 0 0 1-.68-.227 2.584 2.584 0 0 1-.673-.629 5.524 5.524 0 0 1-.746-1.357c-.021-.056-.058-.107-.086-.159-.039-.069-.076-.139-.113-.208-.146-.263-.151-.271-.304-.543-.11-.194-.22-.388-.334-.579-.134-.226-.273-.449-.411-.672a98.037 98.037 0 0 0-.982-1.57c-.308-.48-.62-.957-.942-1.427a22.532 22.532 0 0 0-.982-1.339l-.015-.019c.082.202.171.4.266.596.065.168.126.337.188.506 1.006 2.755 2.004 5.512 3.004 8.269l.58 1.601c.045.158.067.322.086.485a4.98 4.98 0 0 1 .031.572c-.007.452-.095.943-.415 1.283a1.091 1.091 0 0 1-.353.255 1.291 1.291 0 0 1-.366.1c-.111.01-.11.01-.221.017a2.837 2.837 0 0 1-.801-.068 2.163 2.163 0 0 1-.744-.344c-.501-.366-.802-.924-1.01-1.497-.165-.48-.33-.96-.5-1.44-.673-1.894-1.376-3.78-2.181-5.622a28.854 28.854 0 0 0-.884-1.864c-.238-.455-.491-.912-.815-1.313l-.003-.005c.041.173.09.344.135.516l.031.13c.793 3.523 1.537 7.058 2.304 10.586.014.096.025.192.034.289.032.373.037.751-.026 1.121a1.96 1.96 0 0 1-.231.679c-.146.247-.37.441-.645.525a1.92 1.92 0 0 1-.523.061 2.032 2.032 0 0 1-.544-.06 1.513 1.513 0 0 1-.565-.287c-.367-.298-.591-.744-.759-1.177a8.74 8.74 0 0 1-.161-.445 16.143 16.143 0 0 1-.16-.516c-.06-.209-.122-.416-.186-.622-.276-.895-.56-1.787-.836-2.682a79.31 79.31 0 0 1-1.165-4.116c-.26-1.047-.491-2.103-.624-3.174a1.565 1.565 0 0 0-.065-.145 1.145 1.145 0 0 0-.224-.315l-.009-.008-.005-.005c-.014.065-.023.13-.033.195-.03.262-.037.526-.029.789l-.118 7.794c-.003.027-.003.056-.008.084-.018.097-.064.193-.103.283a3.515 3.515 0 0 1-.127.262c-.21.39-.521.783-.969.901-.071.019-.145.03-.219.034a1.599 1.599 0 0 1-.901-.258 1.398 1.398 0 0 1-.379-.395 2.217 2.217 0 0 1-.278-.681c-.093-.376-.121-.76-.146-1.145-.025-.38-.046-.76-.067-1.139-.081-1.549-.152-3.099-.232-4.646-.025-.473-.052-.945-.08-1.417-.03-.475-.057-.951-.11-1.423a3.664 3.664 0 0 0-.021-.146 3.019 3.019 0 0 0-.118-.386 11.233 11.233 0 0 0-.191-.489 25.367 25.367 0 0 0-.677-1.472c-.029-.058-.059-.118-.091-.176a5.435 5.435 0 0 1-.105-.183c-.057-.105-.056-.105-.111-.211-.559-1.111-.972-2.294-1.312-3.488a35.214 35.214 0 0 1-1.022-5.056 42.063 42.063 0 0 1-.151-1.279c-.031-.309-.061-.619-.097-.929a33.895 33.895 0 0 0-.095-.713l-.451-2.063 2.237-.546c3-.92 5.861-2.293 8.444-4.054z"
                                                      class="body-area hover_body body-area-hand "
                                                      id="body-area-hand"
                                                      title="Hand"
                                                      data-toggle="popover"
                                                      data-container="body"
                                                      data-placement="right"
                                                      type="button"
                                                      data-html="true"
                                                      href="#"
                                                      body_part="hand"
                                                      onClick={
                                                        this.attributeSymptomTag
                                                      }
                                                      gender="male"
                                                    ></path>
                                                    <path
                                                      d="M82.097 178.284l-.869-.261a7.41 7.41 0 0 1-.748-.342c-1.716-.902-3.038-2.438-3.869-4.172-.746-1.557-1.111-3.285-1.111-5.009 0-1.762.381-3.53 1.162-5.113.848-1.722 2.185-3.239 3.91-4.116.275-.139.558-.262.848-.365a6.948 6.948 0 0 1 2.225-.405h.21a6.948 6.948 0 0 1 2.225.405c.29.103.573.226.848.365 1.725.877 3.062 2.394 3.91 4.116.781 1.583 1.162 3.351 1.162 5.113 0 1.724-.365 3.452-1.111 5.009-.831 1.734-2.153 3.27-3.869 4.172a7.124 7.124 0 0 1-1.827.666l-.441.047-.089-.593a64.078 64.078 0 0 1-.386-3.152 23.848 23.848 0 0 1-.078-1.068 7.434 7.434 0 0 1-.007-.804l-.001.015-.248-4.552h-.79l-.024.407a107.793 107.793 0 0 1-.768 7.98l-.264 1.657z"
                                                      class="body-area hover_body body-area-sexual_organs "
                                                      id="body-area-sexual_organs"
                                                      title="Sexual Organs "
                                                      data-toggle="popover"
                                                      data-container="body"
                                                      data-placement="right"
                                                      type="button"
                                                      data-html="true"
                                                      href="#"
                                                      body_part="sexual_organs"
                                                      onClick={
                                                        this.attributeSymptomTag
                                                      }
                                                      gender="male"
                                                    ></path>
                                                    <path
                                                      d="M54.462 145.401c1.745.061 3.483.344 5.169.829a20.803 20.803 0 0 1 5.024 2.182 20.154 20.154 0 0 1 3.883 3.052c2.939 2.944 4.972 6.701 6.24 10.639l.54 1.934-.144.334a12.539 12.539 0 0 0-.511 2.063c-.509 3.184.167 6.597 2.066 9.229.262.362.547.708.853 1.034.408.435.855.834 1.338 1.186a8.668 8.668 0 0 0 1.837 1.028l1.183.354-.183 1.15c-.402 2.208-.901 4.396-1.434 6.575a378.692 378.692 0 0 1-1.221 4.828c-.606 2.342-1.223 4.682-1.83 7.024-.27 1.062-.528 2.126-.773 3.194a152.9 152.9 0 0 0-1.681 8.512l-1.178 8.09c-2.778-2.231-6.127-3.671-9.569-4.558a35.272 35.272 0 0 0-1.9-.434c-.7-.141-1.404-.261-2.111-.364a43.064 43.064 0 0 0-2.73-.304 47.377 47.377 0 0 0-4.16-.143l-.455.02.004-2.341a54.546 54.546 0 0 0-.15-3.454c-.04-.494-.098-.986-.154-1.479-.166-1.415-.343-2.828-.512-4.243a264.138 264.138 0 0 1-.654-6.156 235.162 235.162 0 0 1-.666-9.151 282.026 282.026 0 0 1-.161-3.436c-.036-.911-.07-1.821-.086-2.733a89.552 89.552 0 0 1 .001-3.278c.058-3.229.28-6.453.627-9.663.211-1.964.474-3.921.764-5.874.186-1.225.385-2.45.568-3.677.042-.285.084-.571.116-.858.016-.148.033-.297.033-.447-.001-.039-.005-.08-.007-.119v-.128c.022-.415.094-.828.163-1.239.084-.51.178-1.02.274-1.528.292-1.544.608-3.084.93-4.622l.657-3.028zm56.981-1.117l.442 2.222c.23 1.105.465 2.208.729 3.305.128.535.272 1.067.411 1.601.066.259.131.517.194.775.423 1.768.798 3.548 1.158 5.329a292.3 292.3 0 0 1 1.176 6.164c.361 1.998.702 3.998 1.01 6.005.112.736.22 1.472.318 2.21.094.703.181 1.408.248 2.114.061.651.095 1.304.132 1.957.046.821.086 1.642.12 2.464a202 202 0 0 1 .171 7.784c.009 3.194-.048 6.389-.174 9.581a177.761 177.761 0 0 1-.435 7.476c-.037.451-.076.903-.12 1.354-.034.359-.073.717-.108 1.075a32 32 0 0 0-.051.629c-.134 1.921-.137 3.851-.076 5.776l.008.126-1.087-.226a27.306 27.306 0 0 0-4.675-.372 26.274 26.274 0 0 0-4.924.522 27.23 27.23 0 0 0-8.032 3.041l-2.246 1.441-.297-1.325a607.166 607.166 0 0 0-2.218-9.303 469.515 469.515 0 0 0-1.056-4.204 233.304 233.304 0 0 0-.834-3.189 107.966 107.966 0 0 0-1.099-3.778 103.733 103.733 0 0 0-1.811-5.283c-.572-1.539-1.179-3.064-1.767-4.598-.126-.334-.25-.669-.373-1.005a33.746 33.746 0 0 1-.849-2.638l-.413-1.928a6.756 6.756 0 0 0 1.828-.475 8.668 8.668 0 0 0 1.837-1.028c.45-.328.869-.697 1.255-1.098.31-.322.598-.664.863-1.023 1.955-2.643 2.654-6.104 2.139-9.328-.112-.7-.282-1.391-.511-2.063a10.41 10.41 0 0 0-.853-1.891l.116-.739c.786-3.6 2.321-7.065 4.696-9.903a19.671 19.671 0 0 1 2.354-2.371 20.494 20.494 0 0 1 4.232-2.761c2.689-1.323 5.623-2.08 8.572-2.422z"
                                                      class="body-area hover_body body-area-thigh "
                                                      id="body-area-thigh"
                                                      title="Thigh"
                                                      data-toggle="popover"
                                                      data-container="body"
                                                      data-placement="right"
                                                      type="button"
                                                      data-html="true"
                                                      href="#"
                                                      body_part="thigh"
                                                      onClick={
                                                        this.attributeSymptomTag
                                                      }
                                                      gender="male"
                                                    ></path>
                                                    <path
                                                      d="M52.713 213.848l.134-.008a45.145 45.145 0 0 1 3.945.1 42.68 42.68 0 0 1 2.624.263 38.027 38.027 0 0 1 4.14.778c3.443.858 6.802 2.272 9.597 4.491l.355.322-.094.835c-.018.168-.037.336-.052.505-.016.19-.031.38-.05.569-.023.195-.048.388-.075.581-.255 1.708-.739 3.371-1.299 5-.614 1.786-1.318 3.54-1.997 5.302-.15.396-.3.791-.447 1.187a58.83 58.83 0 0 0-.582 1.636c-.14.416-.279.834-.399 1.256l-.089.356c-2.581.001-5.155-.16-7.698-.549a35.573 35.573 0 0 1-3.769-.776 25.28 25.28 0 0 1-3.363-1.136 17.91 17.91 0 0 1-2.436-1.246l-.566-.421.606-2.106c.292-1.352.49-2.72.668-4.09.103-.814.201-1.629.304-2.443.036-.284.077-.568.111-.852.134-1.182.204-2.373.265-3.561.084-1.635.136-3.27.165-4.906l.002-1.087zm43.157 3.853l2.677-1.735a26.367 26.367 0 0 1 6.772-2.657 24.962 24.962 0 0 1 6.61-.663c1.373.046 2.742.205 4.091.468l.644.153.285 4.325c.063.612.145 1.221.226 1.831.099.745.196 1.491.297 2.236.258 1.904.538 3.808.892 5.697.151.8.314 1.598.506 2.389.149.61.312 1.219.515 1.813l.022.061-1.034.637c-.275.138-.555.267-.837.391-.435.19-.878.365-1.325.526-1.081.392-2.19.708-3.309.973a44.167 44.167 0 0 1-3.641.696 59.457 59.457 0 0 1-4.058.46l-3.118.141-.072-.156c-.616-1.284-1.276-2.547-1.921-3.818-.19-.377-.379-.754-.566-1.132-.619-1.268-1.21-2.55-1.682-3.881a17.382 17.382 0 0 1-.778-2.878 13.208 13.208 0 0 1-.149-1.157l-.006-.078-1.041-4.642z"
                                                      class="body-area hover_body body-area-knee "
                                                      id="body-area-knee"
                                                      title="Knee"
                                                      data-toggle="popover"
                                                      data-container="body"
                                                      data-placement="right"
                                                      type="button"
                                                      data-html="true"
                                                      href="#"
                                                      body_part="knee"
                                                      onClick={
                                                        this.attributeSymptomTag
                                                      }
                                                      gender="male"
                                                    ></path>
                                                    <path
                                                      d="M125.812 290h-11.284l.075-1.128a18.807 18.807 0 0 0-.109-1.76 33.43 33.43 0 0 0-.354-2.461 51.08 51.08 0 0 0-.546-2.652 81.392 81.392 0 0 0-1.691-6.097c-.482-1.528-.985-3.049-1.606-4.527a39.735 39.735 0 0 0-1.24-2.654c-.469-.92-.966-1.827-1.447-2.741l-.283-.546a35.13 35.13 0 0 1-1.022-2.17 27.759 27.759 0 0 1-.991-2.723c-.518-1.696-.881-3.438-1.156-5.189-.329-2.094-.53-4.205-.678-6.318l.005-.114c.026-.168.049-.336.071-.506.03-.229.03-.229.057-.458.225-2.01.314-4.04.177-6.059a21.143 21.143 0 0 0-.293-2.394 13.803 13.803 0 0 0-.484-1.902l-.468-1.158.79-.019a63.63 63.63 0 0 0 4.634-.397 48.74 48.74 0 0 0 4.665-.793 32.115 32.115 0 0 0 3.918-1.12c.39-.141.777-.292 1.159-.454.732-.31 1.451-.661 2.097-1.07l.22.488c.222.469.45.937.671 1.408a44.91 44.91 0 0 1 1.359 3.175c.454 1.189.85 2.399 1.191 3.625.901 3.234 1.424 6.567 1.685 9.911.272 3.483.261 6.985.06 10.472a103.37 103.37 0 0 1-.257 3.425c0 .807.002 1.615.006 2.424.024 4.374.082 8.75.246 13.122.06 1.586.134 3.173.246 4.756.046.656.1 1.311.166 1.966.06.602.134 1.203.24 1.8l.171.838zm-66.764 0H47.972l.038-.185c.021-.119.041-.239.058-.359.092-.694.13-1.393.15-2.092.019-.617.022-1.236.015-1.854a115.45 115.45 0 0 0-.206-5.39 241.084 241.084 0 0 0-.501-6.738c-.223-2.576-.477-5.15-.757-7.72l-.025-.229c-.411-4.537-.637-9.1-.456-13.655a62.65 62.65 0 0 1 .427-5.335c.214-1.704.509-3.399.916-5.067a34.865 34.865 0 0 1 1.874-5.594c.196-.461.399-.918.594-1.378l.189-.466 2.523 1.372c1.089.486 2.218.881 3.364 1.208 1.337.382 2.7.67 4.072.891 2.637.425 5.31.604 7.956.604l-.378 2.403a36.487 36.487 0 0 0-.183 2.881 44.62 44.62 0 0 0 .127 4.706l.002.059c-.072 2.704-.185 5.409-.451 8.102a49.904 49.904 0 0 1-.418 3.249 27.916 27.916 0 0 1-.755 3.371c-.269.905-.602 1.79-.99 2.651-.465 1.032-1.003 2.03-1.511 3.042l-.258.523a38.13 38.13 0 0 0-1.071 2.422c-.332.834-.63 1.68-.908 2.533-.22.676-.428 1.357-.623 2.041a50.528 50.528 0 0 0-1.54 7.373 35.57 35.57 0 0 0-.314 4.623c.002.537.019 1.074.061 1.61l.055.398z"
                                                      class="body-area hover_body body-area-lower_leg "
                                                      id="body-area-lower_leg"
                                                      title="Lower Leg"
                                                      data-toggle="popover"
                                                      data-container="body"
                                                      data-placement="right"
                                                      type="button"
                                                      data-html="true"
                                                      href="#"
                                                      body_part="lower_leg"
                                                      onClick={
                                                        this.attributeSymptomTag
                                                      }
                                                      gender="male"
                                                    ></path>
                                                    <path
                                                      d="M59.185 291l.004.023c.049.208.107.413.161.621.08.304.158.608.235.912.267 1.074.527 2.155.696 3.248.057.36.105.724.115 1.088.005.216 0 .441-.066.648a.885.885 0 0 1-.059.147c-.025.048-.056.093-.081.142a3.198 3.198 0 0 0-.062.146 13.53 13.53 0 0 0-.412 1.295 52.98 52.98 0 0 0-.456 1.763l.034.303c.155 1.57.22 3.158-.045 4.721a15.53 15.53 0 0 1-.189.927c-.031.134-.076.318-.106.44a.827.827 0 0 1-.054.154 1.404 1.404 0 0 1-.173.282c-.093.113-.195.221-.283.338a1.225 1.225 0 0 0-.152.268 1.509 1.509 0 0 0-.096.528c-.006.257.027.514.077.766.019.101.042.201.067.301.039.154.082.306.13.458.056.181.118.359.175.54a8.365 8.365 0 0 1 .225.926c.12.671.145 1.367.005 2.038a3.548 3.548 0 0 1-.333.942 2.54 2.54 0 0 1-.256.395c-.045.056-.096.105-.145.157-.044.046-.051.055-.097.109a6.13 6.13 0 0 0-.189.237c-.296.403-.552.832-.785 1.273-.123.233-.236.47-.352.707-.049.094-.049.094-.1.186a3.822 3.822 0 0 1-.6.78c-.13.129-.271.247-.419.354-.696.503-1.544.739-2.391.811a7.201 7.201 0 0 1-.465.024c-.175.004-.35.004-.522-.021a2.012 2.012 0 0 1-.593-.188c-.328-.166-.6-.42-.834-.701a7.913 7.913 0 0 1-.532-.736c-.232.28-.47.556-.711.828a2.085 2.085 0 0 1-.342.272c-.357.232-.778.372-1.208.344-.493-.033-.932-.289-1.267-.644a2.682 2.682 0 0 1-.131-.149l-.022.02c-.371.327-.903.355-1.369.284a3.384 3.384 0 0 1-.611-.155.779.779 0 0 1-.23-.198 1.963 1.963 0 0 1-.275-.422c-.019-.04-.036-.081-.053-.122-.072.017-.145.03-.217.04-.168.026-.338.04-.506.05-.161.01-.323.017-.483-.006a1.07 1.07 0 0 1-.741-.431 1.336 1.336 0 0 1-.163-.293l-.014.002a.997.997 0 0 1-.197.008c-.343-.022-.634-.231-.869-.469a3.098 3.098 0 0 1-.217-.242 1.995 1.995 0 0 1-.215-.302 2.402 2.402 0 0 1-.248-.709 5.1 5.1 0 0 1-.09-1.076 9.997 9.997 0 0 1 .216-1.896c.059-.284.127-.567.212-.845.065-.212.138-.423.228-.626.117-.262.269-.508.423-.748.181-.281.372-.556.568-.829a62.215 62.215 0 0 1 1.862-2.452l.126-.159c.04-.05.08-.102.121-.15.019-.023.042-.045.062-.067a7.28 7.28 0 0 0 .375-.45c.39-.514.726-1.067 1.031-1.635.287-.533.547-1.08.791-1.633a38.105 38.105 0 0 0 1.142-2.961 16.12 16.12 0 0 1-.263-1.43 13.473 13.473 0 0 1-.113-1.946c.014-1.108.159-2.212.349-3.302l.556-2.853h11.416zm64.151 26.934l-.026.038c-.338.496-.715 1.007-1.265 1.284a1.964 1.964 0 0 1-.593.188 3.044 3.044 0 0 1-.523.021 7.17 7.17 0 0 1-.464-.024c-.936-.079-1.876-.363-2.604-.978a3.68 3.68 0 0 1-.857-1.058c-.09-.167-.167-.341-.251-.51a28.626 28.626 0 0 0-.222-.427 9.295 9.295 0 0 0-.757-1.195 4.25 4.25 0 0 0-.2-.244c-.051-.056-.106-.108-.157-.165a2.692 2.692 0 0 1-.104-.135c-.602-.877-.694-2.005-.549-3.032a8.11 8.11 0 0 1 .265-1.171c.056-.181.118-.359.175-.54.036-.115.07-.232.102-.349.094-.364.172-.737.173-1.115 0-.221-.029-.448-.124-.65-.097-.208-.265-.37-.408-.546a1.334 1.334 0 0 1-.214-.386c-.045-.161-.081-.326-.119-.49a15.338 15.338 0 0 1-.189-.926 12.248 12.248 0 0 1-.15-1.268c-.085-1.254.001-2.512.137-3.76l-.15-.614a42.444 42.444 0 0 0-.431-1.59 14.42 14.42 0 0 0-.169-.535c-.053-.154-.107-.312-.179-.46-.023-.049-.053-.095-.079-.142-.02-.04-.02-.04-.037-.079-.108-.307-.099-.639-.077-.959.032-.425.098-.847.173-1.266.184-1.028.428-2.046.685-3.057.057-.226.117-.453.175-.678l.031-.116h11.661l.178.88c.257 1.32.505 2.648.589 3.992.049.798.038 1.598-.05 2.392-.044.413-.109.825-.191 1.232-.031.16-.066.32-.103.479l-.004.02c.456 1.348.973 2.677 1.601 3.953.237.479.488.95.767 1.404.304.494.638.967 1.034 1.391.204.256.407.513.609.77a57.838 57.838 0 0 1 1.623 2.165c.185.265.367.531.538.805.11.174.214.352.302.538.081.173.147.354.207.536.088.269.16.543.221.819.159.708.257 1.439.255 2.167-.001.33-.023.66-.09.984a2.408 2.408 0 0 1-.249.708c-.061.11-.135.207-.214.303-.07.083-.141.164-.217.241-.262.264-.606.499-.995.468-.028-.003-.057-.006-.085-.011a1.295 1.295 0 0 1-.192.332 1.095 1.095 0 0 1-.713.394c-.194.027-.392.012-.586-.002a3.943 3.943 0 0 1-.621-.083 1.864 1.864 0 0 1-.245.443 1.186 1.186 0 0 1-.233.252.836.836 0 0 1-.278.113 3.895 3.895 0 0 1-.34.078c-.45.077-.963.074-1.351-.202a1.192 1.192 0 0 1-.111-.091 2.095 2.095 0 0 1-.132.149c-.334.355-.773.612-1.266.644-.43.027-.851-.113-1.208-.345a2.056 2.056 0 0 1-.322-.25l-.021-.022a35.106 35.106 0 0 1-.71-.827l-.025.039-.051.076z"
                                                      class="body-area hover_body body-area-foot "
                                                      id="body-area-foot"
                                                      title="Foot"
                                                      data-toggle="popover"
                                                      data-container="body"
                                                      data-placement="right"
                                                      type="button"
                                                      data-html="true"
                                                      href="#"
                                                      body_part="foot"
                                                      onClick={
                                                        this.attributeSymptomTag
                                                      }
                                                      gender="male"
                                                    ></path>
                                                  </g>
                                                </svg>
                                                {/* <!--front--> */}
                                                {/* <!--back body--> */}
                                                <svg
                                                  class="male-back-s"
                                                  id="mail_back"
                                                  viewBox="0 0 168 320"
                                                  xmlns="http://www.w3.org/2000/svg"
                                                  fill-rule="evenodd"
                                                  stroke-linejoin="round"
                                                  stroke-miterlimit="1.414"
                                                >
                                                  <g>
                                                    <path d="M160.549 164.267c.09.495.197.987.313 1.478.123.522.26 1.042.39 1.564l.191.806c.181.787.353 1.574.513 2.365a86.453 86.453 0 0 1 .754 4.348 33.325 33.325 0 0 1 .175 1.377c.017.163.033.325.044.488.009.117.013.233.011.35 0 .084-.004.168-.01.253-.043.533-.223 1.102-.662 1.441-.057.044-.12.082-.185.116l-.02.009c-.025.008-.047.019-.072.026a1.32 1.32 0 0 1-.536-.004c-.497-.111-.88-.491-1.168-.891a5.322 5.322 0 0 1-.437-.731 8.646 8.646 0 0 1-.258-.552 13.134 13.134 0 0 1-.293-.742 20.106 20.106 0 0 1-.31-.926l-.019-.059c.102 1.055.205 2.111.327 3.163.063.546.138 1.09.205 1.634l.046.448c.017.222.032.444.038.667a7.376 7.376 0 0 1-.04 1.068 5.552 5.552 0 0 1-.053.339 3.712 3.712 0 0 1-.069.295c-.122.441-.349.916-.78 1.127l-.027.012c-.037.01-.072.024-.109.031-.095.016-.198.003-.293-.007a2.424 2.424 0 0 1-.96-.311c-.699-.406-1.143-1.151-1.324-1.923-.025-.123-.039-.249-.057-.373a136.58 136.58 0 0 0-.185-1.199c-.343-2.113-.738-4.221-1.323-6.282l-.027-.091.26 7.879-.005-.02a8.4 8.4 0 0 1 .187 1.129c.035.381.044.773-.021 1.152a1.887 1.887 0 0 1-.297.774 1.188 1.188 0 0 1-.491.408c-.116.051-.24.083-.363.111-.431.096-.89.075-1.282-.146-.374-.209-.635-.564-.814-.946-.27-.572-.378-1.2-.471-1.821a73.294 73.294 0 0 1-.23-1.74 321.062 321.062 0 0 1-.685-6.193l-.045-.44a50.106 50.106 0 0 0-.387 2.031c-.124.716-.24 1.435-.319 2.157-.026.236-.039.473-.057.711-.012.141-.012.14-.028.281a8.74 8.74 0 0 1-.44 1.951c-.06.164-.13.324-.21.478-.095.18-.207.354-.349.5a1.215 1.215 0 0 1-.301.233c-.326.173-.727.144-1.058.005a1.82 1.82 0 0 1-.519-.333 2.133 2.133 0 0 1-.648-1.087c-.078-.337-.037-.684-.008-1.024.042-.491.096-.981.151-1.47.15-1.315.317-2.629.514-3.937.034-.222.068-.444.104-.665.039-.235.082-.47.119-.705l.039-.288c.036-.329.064-.66.04-.991a1.929 1.929 0 0 0-.032-.252.585.585 0 0 0-.038-.136l.011.018-.053-.108c-.042-.122-.081-.244-.121-.367a25.7 25.7 0 0 1-.69-2.965 58.57 58.57 0 0 1-.463-3.062 112.91 112.91 0 0 1-.687-7.573 109.98 109.98 0 0 1-.1-1.986c-.016-.387-.024-.774-.045-1.16a13.042 13.042 0 0 0-.029-.394c-.13-1.342-.477-2.648-.946-3.909-.36-.967-.79-1.907-1.261-2.824a42.561 42.561 0 0 0-1.93-3.347 71.976 71.976 0 0 0-2.499-3.676c-.367-.506-.739-1.009-1.111-1.511a60.424 60.424 0 0 1-2.258-3.318 62.962 62.962 0 0 1-2.574-4.501 87.302 87.302 0 0 1-1.497-3.039c-.541-1.152-1.063-2.315-1.596-3.471-.145-.309-.29-.618-.437-.926a36.878 36.878 0 0 0-.877-1.7c-.295-.535-.607-1.06-.911-1.59a21.513 21.513 0 0 1-.273-.495 9.765 9.765 0 0 1-.423-.896 7.48 7.48 0 0 1-.346-1.114 11.481 11.481 0 0 1-.251-2.015c-.016-.3-.019-.601-.029-.901a15.553 15.553 0 0 0-.025-.381c-.098-1.044-.325-2.072-.587-3.086a49.916 49.916 0 0 0-1.019-3.386 82.558 82.558 0 0 0-1.556-4.227 74.576 74.576 0 0 0-1.443-3.398c-.234-.508-.484-1.009-.729-1.511-.168-.35-.334-.701-.5-1.052a388.969 388.969 0 0 1-3.277-7.24 61.528 61.528 0 0 1-.295 1.861 65.684 65.684 0 0 1-1.024 4.77 100.786 100.786 0 0 1-1.071 3.863c-.392 1.308-.798 2.613-1.192 3.921a53.35 53.35 0 0 0-.798 2.913c-.104.438-.193.879-.278 1.322-.091.474-.178.949-.258 1.426a30.12 30.12 0 0 0-.341 2.71 20.75 20.75 0 0 0-.046 2.217c.042 1.279.206 2.551.425 3.812.12.695.261 1.385.401 2.076.113.558.224 1.116.334 1.674l.197 1.029c.119.638.236 1.276.341 1.916.064.383.125.768.167 1.154l.006.076a396.211 396.211 0 0 0 .126 3.429c.08 1.765.174 3.528.304 5.288.086 1.164.183 2.328.329 3.487.086.689.19 1.376.297 2.062.123.796.254 1.592.387 2.387.389 2.346.801 4.687 1.215 7.027.756 4.258 1.523 8.515 2.279 12.772.268 1.526.535 3.051.788 4.579.031.198.061.397.09.595.237 1.753.322 3.524.331 5.291a84.82 84.82 0 0 1-.18 5.615c-.31 4.981-.906 9.939-1.435 14.9-.09.859-.179 1.719-.266 2.579-.632 6.283-1.171 12.577-1.469 18.886a224 224 0 0 0-.163 4.336c-.019.707-.038 1.416-.043 2.125-.006.74.003 1.48.028 2.22.07 2.105.275 4.207.654 6.279a39.117 39.117 0 0 0 1.711 6.26 64.65 64.65 0 0 0 1.21 3.056c.291.692.593 1.379.884 2.072.055.133.108.268.16.403.344.922.619 1.866.865 2.818.264 1.021.493 2.051.701 3.085.5 2.482.889 4.988 1.196 7.5.24 1.961.43 3.929.538 5.903.044.84.075 1.682.076 2.523a21.68 21.68 0 0 1-.088 2.207c-.02.212-.046.424-.079.635-.036.222-.081.444-.12.667-.037.228-.073.457-.107.687-.306 2.105-.508 4.225-.703 6.343l-.056.19-.039.052c.05.054.089.118.113.187.026.081.021.104.025.186-.047.931-.095 1.863-.144 2.793-.213 3.966-.445 7.93-.666 11.896-.054.978-.107 1.958-.157 2.937a167 167 0 0 0-.08 1.731c-.024.636-.036 1.27-.005 1.905.039.787.132 1.573.288 2.345.14.694.321 1.378.544 2.049.083.253.171.504.265.753.064.172.129.345.201.515.068.16.143.317.218.473.178.358.368.709.546 1.065.144.296.281.596.391.906.138.39.234.794.277 1.207.024.237.034.475.016.713-.033.448-.14.89-.269 1.32-.168.561-.369 1.112-.549 1.668-.046.146-.091.292-.134.439-.08.289-.15.581-.183.88-.025.241-.026.486.033.723.053.199.109.398.161.597.173.677.323 1.361.375 2.058a6.396 6.396 0 0 1-.256 2.392 7.687 7.687 0 0 1-.192.553 3.685 3.685 0 0 1-.206.452c-.144.255-.33.485-.541.685a4.287 4.287 0 0 1-1.191.775c-.57.26-1.181.428-1.797.541-.737.136-1.491.193-2.241.18a7.996 7.996 0 0 1-1.457-.136 5.943 5.943 0 0 1-2.165-.912 5.108 5.108 0 0 1-1.068-.965 3.77 3.77 0 0 1-.765-1.499 3.27 3.27 0 0 1-.083-.893c.011-.195.042-.388.061-.582.01-.117.018-.234.025-.35.025-.487.029-.975.023-1.463l-.037-.004a5.658 5.658 0 0 1-.502-.086 4.624 4.624 0 0 1-.985-.338 4.614 4.614 0 0 1-2.194-2.246c-.015-.034-.014-.034-.026-.068-.038-.135-.065-.273-.094-.411-.04-.197-.074-.395-.103-.594-.167-1.164-.125-2.404.393-3.479.07-.146.149-.288.236-.424a3.93 3.93 0 0 1 1.891-1.563c.128-.05.263-.101.399-.127a10.38 10.38 0 0 1-.144-1.041 6.696 6.696 0 0 1 .138-2.06c.074-.312.173-.618.296-.915.06-.147.134-.287.195-.433.02-.052.038-.104.055-.157.077-.267.116-.543.139-.821.025-.298.03-.597.027-.896-.01-.86-.096-1.719-.205-2.571a53.637 53.637 0 0 0-.624-3.72 83.262 83.262 0 0 0-.897-3.975l-.029-.114-.005-.027a67.105 67.105 0 0 0-.264-.977 98.078 98.078 0 0 0-1.874-5.869 158.202 158.202 0 0 0-2.15-5.738c-.304-.771-.614-1.539-.93-2.306-.232-.566-.474-1.127-.703-1.694-.08-.203-.159-.407-.235-.613-1.084-2.93-1.735-6.01-2.093-9.111a43.97 43.97 0 0 1-.259-3.264 21.078 21.078 0 0 1-.001-2.177c.024-.324.053-.647.077-.971.191-2.729.201-5.477-.087-8.2-.231-2.182-.654-4.357-1.429-6.415-.433-1.121-.876-2.238-1.312-3.359-1.002-2.595-1.997-5.21-2.644-7.921a29.697 29.697 0 0 1-.481-2.475c-.064-.429-.114-.859-.167-1.288a307.478 307.478 0 0 0-.382-2.939c-.47-3.446-.981-6.887-1.566-10.315a163.854 163.854 0 0 0-.849-4.611 66.852 66.852 0 0 0-.873-3.854 29.142 29.142 0 0 0-.271-.973c-.115-.385-.241-.767-.357-1.152a83.522 83.522 0 0 1-.25-.854 137.288 137.288 0 0 1-1.39-5.37 235.819 235.819 0 0 1-1.881-8.521 88.085 88.085 0 0 1-.256-1.342c-.075-.413-.152-.828-.196-1.246-.041-.542-.089-1.083-.13-1.625a54.828 54.828 0 0 1-.133-2.563 16.266 16.266 0 0 1 .035-1.834l.005-.051c-.097-2.544-.204-5.089-.317-7.632a16.563 16.563 0 0 1-.201-.848 5.04 5.04 0 0 1-.028.131l-.026.113c-.006.293-.007.311-.017.637a44.287 44.287 0 0 1-.172 2.601 39.213 39.213 0 0 1-.822 5.027 38.01 38.01 0 0 1-.648 2.425c-.174.578-.37 1.148-.552 1.724-.019.064-.04.127-.053.191-.025.142-.043.286-.065.428-.039.228-.039.228-.082.455a45.5 45.5 0 0 1-.876 3.587 111.378 111.378 0 0 1-1.188 3.923c-.466 1.45-.954 2.894-1.458 4.332a156.975 156.975 0 0 1-1.478 4.055c-.172.454-.346.906-.526 1.356-.078.196-.158.391-.235.587-.089.234-.089.234-.176.469a73.85 73.85 0 0 0-.976 2.964c-.31 1.006-.608 2.015-.901 3.025a332.594 332.594 0 0 0-2.301 8.38 262.942 262.942 0 0 0-1.441 5.722 95.884 95.884 0 0 0-.448 1.963c-.104.482-.208.966-.279 1.454-.026.18-.034.361-.054.541-.017.137-.034.274-.054.409a38.327 38.327 0 0 1-.603 3.058 50.864 50.864 0 0 1-1.013 3.736 27.826 27.826 0 0 1-.853 2.373c-.252.601-.53 1.203-.898 1.745a3.862 3.862 0 0 1-.28.37c-.09.104-.19.199-.28.304a4.522 4.522 0 0 0-.136.174 7.03 7.03 0 0 0-.681 1.223 16.98 16.98 0 0 0-.617 1.597c-.26.769-.482 1.549-.683 2.335-.198.77-.373 1.546-.529 2.326-.03.157.014.319.022.477.017.348.032.697.047 1.045.176 4.601.131 9.22-.379 13.8-.374 3.366-.997 6.722-2.057 9.942a33.286 33.286 0 0 1-2.294 5.369c-.222.419-.451.834-.673 1.254-.07.135-.138.271-.205.407a55.21 55.21 0 0 0-.792 1.85 97.47 97.47 0 0 0-1.122 2.88c-.948 2.552-1.802 5.139-2.498 7.771l-.057.134-.054.067a.495.495 0 0 1 .013.115c0 .068-.007.084-.022.15-.092.297-.185.593-.275.89-.395 1.331-.733 2.68-.938 4.055-.148.982-.234 1.983-.17 2.975.022.318.059.634.12.947.029.152.067.301.103.451.038.152.072.304.107.456.041.189.08.378.116.568.145.767.252 1.545.256 2.327.002.436-.02.886-.146 1.307a5.033 5.033 0 0 1-.072.193c-.057.149-.112.299-.167.449-.078.219-.153.438-.226.659.291.074.581.158.871.238.355.108.69.269.997.479a3.797 3.797 0 0 1 1.051 1.086c.094.148.178.302.251.461.524 1.137.498 2.448.267 3.654-.04.208-.085.417-.136.623l-.044.15a3.938 3.938 0 0 1-.288.683 3.486 3.486 0 0 1-1.257 1.336 3.491 3.491 0 0 1-.77.342 4.066 4.066 0 0 1-.458.11l.01.117c.038.481.009.969-.099 1.44a4.182 4.182 0 0 1-.802 1.666 3.313 3.313 0 0 1-.566.569 3.862 3.862 0 0 1-.826.467 7.958 7.958 0 0 1-1.122.379c-.593.157-1.199.264-1.807.34-.672.083-1.349.125-2.025.129a15.24 15.24 0 0 1-2.757-.221 11.16 11.16 0 0 1-.659-.138 3.3 3.3 0 0 1-.402-.117 2.217 2.217 0 0 1-.709-.439c-.369-.34-.628-.772-.817-1.233-.252-.618-.385-1.28-.469-1.94a17.706 17.706 0 0 1-.12-2.457c.013-1.105.093-2.209.207-3.308.074-.726.168-1.451.246-2.177.007-.073.014-.147.016-.22-.002-.139-.026-.276-.048-.413-.047-.26-.098-.52-.145-.78a8.96 8.96 0 0 1-.128-1.201 6.22 6.22 0 0 1 .536-2.734c.079-.177.17-.347.253-.522.039-.083.038-.083.075-.165.23-.55.393-1.121.518-1.703.105-.482.185-.969.249-1.46.083-.629.14-1.262.177-1.895.032-.539.053-1.079.05-1.619l.002-.021-.002-.008.056-1.134c.147-3.551.177-7.107.131-10.661a261.319 261.319 0 0 0-.354-10.586c-.079-1.495-.171-2.99-.275-4.484-.049-.699-.104-1.398-.152-2.096-.023-.36-.023-.36-.043-.721a48.728 48.728 0 0 1-.037-3.586c.097-3.448.554-6.882 1.263-10.256a76.97 76.97 0 0 1 2.993-10.409 81.796 81.796 0 0 1 2.462-6.036c.123-.272.254-.544.373-.819.027-.065.049-.13.073-.195.166-.512.281-1.04.39-1.567.146-.708.273-1.42.394-2.133.294-1.729.548-3.464.801-5.2l.436-3.049c.101-.71.21-1.419.307-2.13.151-1.175.238-2.356.286-3.54.039-.978.053-1.958.048-2.937a68.332 68.332 0 0 0-.297-6.154c-.058-.602-.132-1.199-.206-1.798-.026-.231-.026-.231-.049-.463-.1-1.086-.16-2.176-.211-3.265a203.282 203.282 0 0 1-.117-3.025 492.27 492.27 0 0 1-.194-9.011 534.943 534.943 0 0 1-.052-7.277c.001-.674.003-1.349.009-2.022.005-.5.008-.999.027-1.498.026-.704.077-1.407.14-2.109a77.47 77.47 0 0 1 .343-3.079c.161-1.247.345-2.491.543-3.732.448-2.816.97-5.622 1.568-8.41.124-.58.254-1.158.388-1.736.103-.437.209-.874.309-1.311.078-.344.155-.689.229-1.033.238-1.11.456-2.224.665-3.339.311-1.668.603-3.339.911-5.007a99.04 99.04 0 0 1 .771-3.815c.154-.682.325-1.36.5-2.037.054-.221.054-.221.106-.444.438-1.985.644-4.01.832-6.03.128-1.436.246-2.871.373-4.307.171-1.875.363-3.748.634-5.612.081-.566.17-1.131.268-1.695.096-.557.201-1.113.296-1.67a54.645 54.645 0 0 0 .658-5.616 45.374 45.374 0 0 0-.224-8.221c-.031-.273-.061-.548-.103-.821-.132-.873-.336-1.735-.542-2.593a176.916 176.916 0 0 0-.835-3.28c-.454-1.721-.916-3.442-1.37-5.164-.411-1.573-.823-3.146-1.18-4.732a39.944 39.944 0 0 1-.33-1.603 13.149 13.149 0 0 1-.156-1.05c-.134.47-.277.937-.43 1.401-.424 1.285-.922 2.556-1.584 3.738-.161.288-.332.571-.518.844-.134.199-.278.389-.415.585-.081.118-.159.237-.237.357-.396.631-.75 1.289-1.083 1.955a49.457 49.457 0 0 0-1.072 2.299 85.585 85.585 0 0 0-2.333 5.954 62.29 62.29 0 0 0-.949 2.894c-.113.379-.221.761-.315 1.146-.055.226-.113.457-.135.689-.005.049-.002.096-.001.146.002.069.001.088 0 .158a5.332 5.332 0 0 1-.012.251c-.035.443-.107.881-.196 1.317-.09.441-.198.879-.319 1.313-.16.581-.344 1.155-.557 1.718-.182.483-.386.96-.632 1.415a6.405 6.405 0 0 1-.269.452c-.083.127-.174.249-.259.375-.077.121-.154.244-.228.367-.275.462-.533.935-.785 1.409-.289.546-.57 1.095-.85 1.645-.752 1.486-1.487 2.98-2.234 4.468-.236.467-.473.933-.712 1.397-.203.387-.402.775-.622 1.153a36.615 36.615 0 0 1-1.331 2.086c-.631.931-1.282 1.848-1.941 2.759a273.59 273.59 0 0 1-4.519 6.031c-.388.507-.777 1.011-1.167 1.517-.289.374-.581.748-.866 1.125-.094.126-.187.255-.278.385-.576.833-1.085 1.71-1.578 2.594-.43.775-.844 1.558-1.273 2.333-.142.255-.284.508-.438.755-.073.115-.154.225-.227.34a3.465 3.465 0 0 0-.1.18c-.189.376-.316.78-.418 1.187-.115.459-.197.925-.263 1.393-.156 1.125-.217 2.263-.239 3.398-.008.392-.008.785-.012 1.178-.004.214-.004.213-.01.426-.074 1.735-.346 3.453-.706 5.149a48.463 48.463 0 0 1-1.127 4.326l-.026.078c-.298.796-.596 1.591-.896 2.385-.082.22-.223.546-.306.821-.013.045-.022.091-.031.137-.064.367-.069.741-.072 1.112-.004.392 0 .784-.002 1.177-.002.157-.005.314-.01.47l-.014.326c-.002.119-.002.119-.002.239.011.645.065 1.288.121 1.93.055.646.117 1.291.174 1.936l.048.633c.011.198.021.394.018.591a6.885 6.885 0 0 1-.272 1.764 3.597 3.597 0 0 1-.249.637c-.08.152-.174.298-.293.421a1.129 1.129 0 0 1-.525.304c-.571.15-1.184-.096-1.57-.524a2.101 2.101 0 0 1-.462-.884 3.039 3.039 0 0 1-.08-.454c-.016-.197-.023-.395-.038-.593-.078-1.002-.216-2-.328-2.998-.017-.17-.035-.338-.049-.508-.01-.138-.02-.276-.022-.414-.001-.093.006-.186.008-.279a5.09 5.09 0 0 0-.009-.248 29.03 29.03 0 0 0-.223-2.123c-.1.785-.202 1.569-.307 2.354-.048.355-.097.709-.149 1.063a9.696 9.696 0 0 1-.05.305c-.016.073-.033.147-.047.221-.039.211-.074.422-.11.632-.183 1.107-.361 2.214-.548 3.321-.061.352-.123.705-.188 1.058a6.266 6.266 0 0 1-.213.851c-.212.613-.563 1.2-1.083 1.601-.07.054-.142.104-.218.15-.455.278-1.043.425-1.548.199a1.25 1.25 0 0 1-.265-.159 1.485 1.485 0 0 1-.304-.324 1.765 1.765 0 0 1-.228-.473l-.005-.018c-.017-.098-.017-.098-.015-.198l.398-3.335c.027-.755.043-1.512.072-2.266.007-.148.017-.294.027-.441.07-.855.222-1.698.343-2.546.03-.233.059-.465.086-.699.066-.594.121-1.189.166-1.784l-.01.019c-.026.054-.037.078-.066.132-.021.042-.048.083-.066.127-.026.065-.046.131-.067.198-.137.449-.25.906-.365 1.363-.136.549-.268 1.1-.4 1.651-.318 1.34-.627 2.681-.949 4.021-.054.224-.11.449-.166.674-.065.246-.129.49-.226.726-.051.126-.111.25-.176.369-.29.532-.727 1.025-1.304 1.247a1.683 1.683 0 0 1-.827.101c-.463-.052-.913-.268-1.191-.649a1.41 1.41 0 0 1-.228-.49c-.03-.128-.04-.26-.031-.391.003-.054.01-.093.017-.146.032-.204.067-.407.103-.61.261-1.46.536-2.918.81-4.376l.268-2.363-.02.048c-.321.653-.646 1.305-.98 1.951-.169.326-.339.651-.519.97a7.061 7.061 0 0 1-.178.303 1.34 1.34 0 0 1-.233.301c-.03.027-.067.05-.101.073a3.085 3.085 0 0 1-.206.128c-.33.187-.727.31-1.103.189a.968.968 0 0 1-.414-.267 1.174 1.174 0 0 1-.191-.283 1.611 1.611 0 0 1-.147-.491c-.042-.32-.014-.652.019-.973.05-.498.13-.994.217-1.488a71.4 71.4 0 0 1 .523-2.58l.148-.681c.018-.079.05-.233.069-.332.013-.068.025-.135.041-.203.018-.07.019-.069.038-.138.054-.167.117-.332.182-.495.139-.34.281-.678.419-1.019.301-.755.568-1.522.79-2.305a30.25 30.25 0 0 0 .392-1.577l.047-.21c-.141.148-.284.293-.432.435-.374.358-.775.703-1.225.964-.304.176-.635.309-.99.325a1.695 1.695 0 0 1-.363-.021c-.627-.107-1.124-.573-1.412-1.12a2.285 2.285 0 0 1-.102-.219 1.484 1.484 0 0 1-.128-.548c0-.087.011-.184.048-.265.011-.025.021-.053.037-.076.058-.086.126-.16.193-.24.14-.174.278-.348.415-.525.351-.458.694-.923 1.007-1.408.115-.177.226-.356.327-.542.067-.123.133-.248.176-.381.018-.057.023-.118.035-.179.014-.059.014-.058.03-.116.114-.336.323-.621.536-.901.188-.238.38-.472.568-.711.288-.372.561-.756.776-1.177.065-.128.124-.26.177-.395.03-.075.055-.153.087-.227a1.92 1.92 0 0 1 .065-.128c.19-.321.454-.593.719-.853.363-.352.747-.683 1.139-1.001.611-.5 1.239-.98 1.875-1.446.495-.363.995-.721 1.505-1.061l.075-.048c.133-.248.251-.503.37-.758.155-.329.306-.661.456-.993.415-.915.821-1.833 1.223-2.752.066-.131.143-.254.214-.382l.187-.332a62.41 62.41 0 0 0 1.218-2.321c1.658-3.342 3.009-6.836 4.09-10.406.29-.959.561-1.924.807-2.896.18-.706.344-1.418.517-2.127.125-.508.251-1.017.378-1.524a513.151 513.151 0 0 1 2.068-7.934c.397-1.469.796-2.938 1.216-4.402.052-.177.107-.354.163-.531.627-1.903 1.532-3.701 2.573-5.409 1.253-2.058 2.704-3.985 4.244-5.835.26-.314.52-.628.785-.938.249-.289.507-.57.758-.857.1-.119.199-.237.296-.359a7.79 7.79 0 0 0 .68-1.013c.431-.771.734-1.61.982-2.456.255-.873.453-1.764.624-2.657.071-.373.135-.748.202-1.121.054-.293.054-.293.11-.585.136-.67.285-1.336.451-1.999a51.859 51.859 0 0 1 1.245-4.153c.296-.865.611-1.724.935-2.578.247-.653.5-1.303.746-1.956.073-.196.145-.392.213-.589.065-.192.136-.388.17-.588.017-.099.019-.201.023-.3.011-.248.018-.497.023-.745.011-.616.013-1.233.014-1.85a466.82 466.82 0 0 0-.04-6.034l-.013-1.069-.006-.419c.009-.161.02-.321.032-.481.045-.513.113-1.024.205-1.531.443-2.44 1.406-4.77 2.608-6.928.4-.717.829-1.418 1.284-2.101.454-.682.934-1.347 1.441-1.992.336-.428.681-.852 1.066-1.237a11.019 11.019 0 0 1 1.561-1.282 17.3 17.3 0 0 1 2.842-1.548c.94-.412 1.909-.764 2.89-1.066a39.668 39.668 0 0 1 3.912-.982 39.296 39.296 0 0 1 2.915-.47l.023-.003 11.341-6.021c.134-.063.271-.119.405-.182.712-.339 1.403-.738 2.014-1.239.382-.315.737-.674.983-1.108.059-.104.111-.215.147-.33.037-.117.06-.24.078-.361a5.82 5.82 0 0 0 .047-.51c.032-.563.013-1.129-.02-1.693l-.005-.073a1.357 1.357 0 0 1-.191-.125 1.905 1.905 0 0 1-.303-.297 2.705 2.705 0 0 1-.197-.276 4.012 4.012 0 0 1-.37-.776 8.22 8.22 0 0 1-.323-1.143 15.238 15.238 0 0 1-.222-1.377 26.803 26.803 0 0 1-.165-2.386c-.026-.832-.022-1.664-.036-2.496l-.001-.093a.913.913 0 0 1-.371.021c-.399-.058-.708-.362-.934-.676a4.366 4.366 0 0 1-.333-.55 7.502 7.502 0 0 1-.207-.434 10.6 10.6 0 0 1-.62-1.905c-.036-.173-.059-.348-.091-.522a18.277 18.277 0 0 0-.106-.518 65.662 65.662 0 0 0-.732-2.955 53.99 53.99 0 0 0-.264-.954c-.039-.136-.078-.271-.115-.407a5.566 5.566 0 0 1-.045-.195c-.063-.341-.088-.73.136-1.022a.704.704 0 0 1 .321-.241.868.868 0 0 1 .337-.048c.237.024.469.127.636.301.039.04.063.071.094.118.008.013.02.04.033.056.041.048.084.093.126.138.091.091.182.181.275.268l-.017-.039c-.13-1.614-.257-3.226-.382-4.839a596.417 596.417 0 0 1-.391-5.329c-.033-.51-.067-1.02-.094-1.53a23.405 23.405 0 0 1-.023-.511 3.96 3.96 0 0 1-.002-.327c.006-.151.028-.302.053-.451.117-.71.336-1.401.607-2.066a10.963 10.963 0 0 1 2.999-4.14 12.05 12.05 0 0 1 2.708-1.746c1.247-.59 2.583-.982 3.94-1.223A20.938 20.938 0 0 1 84.912 0c.775.009 1.548.055 2.317.148a21.87 21.87 0 0 1 5.375 1.362 19.444 19.444 0 0 1 3.445 1.737l.038.025a10.447 10.447 0 0 1 .804.147c.584.132 1.159.317 1.664.648.167.108.324.232.47.367.667.624 1.063 1.48 1.388 2.318.07.179.136.359.199.538.107.303.208.607.308.911.028.089.028.089.054.179.183.712.219 1.453.21 2.185a24.301 24.301 0 0 1-.205 2.681 52.62 52.62 0 0 1-.664 3.942 79.706 79.706 0 0 1-.788 3.484c.479.085.922.392 1.187.796.136.208.227.445.265.691.034.228.024.461-.02.687-.033.172-.089.339-.134.509-.04.153-.077.306-.112.46-.326 1.491-.514 3.007-.73 4.516-.01.066-.024.13-.038.194-.083.34-.198.671-.326.997-.134.339-.283.673-.447.999a8.818 8.818 0 0 1-.505.88 4.47 4.47 0 0 1-.59.733c-.265.259-.609.477-.992.48a.88.88 0 0 1-.17-.013c-.026-.004-.051-.01-.077-.016a153.15 153.15 0 0 0-.205 2.555c-.018.265-.036.532-.057.797-.017.191-.037.381-.058.572a12.22 12.22 0 0 1-.249 1.447 5.463 5.463 0 0 1-.325.977 2.209 2.209 0 0 1-.364.582.861.861 0 0 1-.253.2l-.034.014c.046.373.104.745.187 1.111.036.146.077.291.116.437.059.217.116.433.172.651.079.311.157.624.223.938.047.228.091.457.113.688l.001.018c.592.5 1.21.973 1.838 1.427.76.55 1.539 1.074 2.328 1.581 1.915 1.229 3.892 2.358 5.895 3.436 1.502.806 3.021 1.581 4.55 2.333.351.173.703.344 1.055.515l.486.236.172.085c.046.023.095.052.145.072.033.013.067.022.101.032.16.04.321.068.482.093.454.069.908.133 1.361.206.57.095 1.137.203 1.698.337.615.145 1.222.319 1.822.516 2.077.68 4.04 1.694 5.838 2.928.422.289.834.589 1.237.902.323.25.644.503.949.774.369.329.715.682 1.038 1.056 1.385 1.602 2.343 3.538 3.039 5.526a29.89 29.89 0 0 1 1.179 4.554c.311 1.71.503 3.442.595 5.177.05.924.072 1.85.06 2.777-.006.464-.022.93-.049 1.393-.025.414-.058.826-.114 1.236-.032.24-.087.475-.133.712a8.535 8.535 0 0 0-.125 2.162c.027.358.077.715.16 1.065l.01.034.549 1.341.483 1.212c.487 1.244.969 2.491 1.385 3.761.139.424.272.852.379 1.285.067.271.135.552.124.833.053.343.109.685.167 1.027.5 2.875 1.178 5.776 2.56 8.368.308.577.649 1.136 1.012 1.679.704 1.052 1.484 2.051 2.232 3.072.147.203.294.405.438.608.901 1.275 1.758 2.586 2.51 3.956.491.893.935 1.813 1.328 2.754.822 1.974 1.426 4.032 1.948 6.102.437 1.74.817 3.495 1.175 5.254.198.971.386 1.945.581 2.917.098.478.196.955.298 1.432.629 2.934 1.343 5.85 2.185 8.729a89.92 89.92 0 0 0 1.473 4.595c.249.708.511 1.412.785 2.111.165.42.341.838.51 1.258.109.278.216.557.322.837.113.305.224.611.335.918.361 1.008.712 2.019 1.073 3.027.069.191.137.382.211.571.04.105.079.21.128.311.143.292.331.563.551.802.14.152.292.29.449.424.158.129.322.252.482.38.541.443 1.062.91 1.582 1.377a98.368 98.368 0 0 1 1.939 1.774l.081.077.019.025c.054.055.107.11.162.164.206.202.414.403.617.608.323.327.636.663.903 1.038.186.26.351.541.459.843.046.131.082.266.104.403.012.081.016.164.03.246.009.046.021.092.033.138.067.233.16.459.262.68.101.22.212.436.328.648.317.584.669 1.149 1.037 1.702l.056.083c.08.091.159.183.235.276.056.071.111.142.164.214a4.682 4.682 0 0 1 .33.516c.032.057.06.116.087.175.16.354.254.782.096 1.154a.877.877 0 0 1-.276.372.888.888 0 0 1-.163.097 2.534 2.534 0 0 1-.83.238 2.556 2.556 0 0 1-.799-.044 3.45 3.45 0 0 1-1.211-.545c-.514-.351-.956-.801-1.346-1.285a7.565 7.565 0 0 1-.594-.839c-.05-.058-.1-.113-.151-.169zm-.385-6.121a137.398 137.398 0 0 0-2.17-1.978c-.408-.363-.817-.729-1.241-1.073-.124-.101-.253-.197-.378-.296-.097-.08-.192-.159-.286-.242a5.176 5.176 0 0 1-.477-.483 4.302 4.302 0 0 1-.617-.933c-.082-.168-.146-.344-.212-.519a47.587 47.587 0 0 1-.299-.824c-.259-.732-.515-1.466-.775-2.198-.137-.385-.276-.77-.417-1.154a50.252 50.252 0 0 0-.396-1.038c-.132-.332-.272-.663-.407-.996l-.219-.558a85.519 85.519 0 0 1-2.366-7.17 120.452 120.452 0 0 1-1.709-6.748c-.211-.94-.412-1.884-.602-2.828-.166-.817-.323-1.635-.486-2.451-.121-.601-.246-1.2-.371-1.801-.373-1.743-.767-3.483-1.238-5.202-.561-2.05-1.238-4.073-2.163-5.99a31.777 31.777 0 0 0-1.944-3.42 47.105 47.105 0 0 0-1.025-1.523c-.672-.955-1.383-1.881-2.071-2.825a26.16 26.16 0 0 1-1.246-1.841 19.147 19.147 0 0 1-.965-1.775c-.889-1.866-1.461-3.867-1.891-5.883a49.7 49.7 0 0 1-.389-2.029c-.039-.22-.075-.442-.111-.663l-.071-.457c-.005-.041-.004-.082-.005-.123l.007-.028c-.001-.042-.008-.084-.014-.124a3.406 3.406 0 0 0-.053-.267c-.048-.21-.105-.42-.166-.627a31.64 31.64 0 0 0-.547-1.662c-.638-1.794-1.354-3.56-2.077-5.321-.015-.039-.015-.039-.026-.078a7.271 7.271 0 0 1-.206-1.304 9.39 9.39 0 0 1 .139-2.427c.029-.157.067-.312.096-.469l.029-.193c.108-.829.142-1.668.153-2.505a40.478 40.478 0 0 0-.067-2.894 40.013 40.013 0 0 0-.61-5.074c-.294-1.559-.691-3.103-1.244-4.591a18.267 18.267 0 0 0-1.428-3.019 12.328 12.328 0 0 0-1.666-2.202 9.73 9.73 0 0 0-.624-.595 26.422 26.422 0 0 0-1.866-1.432c-2.021-1.408-4.254-2.511-6.628-3.178a21.998 21.998 0 0 0-2.137-.483c-.595-.105-1.195-.182-1.792-.279a7.846 7.846 0 0 1-.299-.056 2.351 2.351 0 0 1-.471-.144c-.76-.376-1.524-.745-2.285-1.121a128.764 128.764 0 0 1-6.772-3.59 71.035 71.035 0 0 1-4.634-2.875 38.196 38.196 0 0 1-2.663-1.97 17.986 17.986 0 0 1-.399-.332c-.074-.062-.168-.133-.224-.217a.552.552 0 0 1-.061-.13c-.038-.123-.02-.159-.004-.284l.008-.019a2.847 2.847 0 0 0-.054-.357c-.037-.198-.08-.396-.127-.591-.119-.502-.258-.998-.39-1.497-.029-.119-.029-.118-.055-.236a15.81 15.81 0 0 1-.244-1.69c-.046-.483-.08-.967-.106-1.451a69.687 69.687 0 0 1-.091-3.852l.002-.288-.001-.127c-.209-.04-.418-.077-.628-.112-.12-.02-.238.043-.357.066l-.457.084-1.307.236c-.194.033-.386.066-.58.097l-.118.017c-.071.007-.07.007-.141.009-.22-.032-.438-.064-.658-.092-.307-.038-.614-.07-.922-.084a3.846 3.846 0 0 0-.492.001 4.145 4.145 0 0 0-.457.075c-.21.044-.419.095-.628.147-.57.145-1.135.306-1.703.453l-.3.072c-.127.025-.256.055-.386.052-.048-.002-.063-.005-.111-.011-.128-.021-.253-.045-.38-.069a43.568 43.568 0 0 1-1.798-.393c-.195-.047-.39-.096-.583-.151a2.52 2.52 0 0 1-.46-.164c-.079-.004-.158-.004-.237-.005-.783.008-1.567.069-2.349.126l-.367.029-.128.01-2.422.291-.42-.018.007.019a78.964 78.964 0 0 1 .664 4.536c.102.878.185 1.761.222 2.645.02.473.027.947.002 1.419-.021.375-.058.76-.172 1.121a2.775 2.775 0 0 1-.203.472c-.285.535-.709.988-1.169 1.378-.369.313-.77.593-1.187.842-.479.288-.977.546-1.491.767l-.015.006-11.406 6.056-.088.037-.094.019-.444.054a41.684 41.684 0 0 0-3.508.628c-1.095.246-2.18.536-3.247.884-.941.308-1.87.661-2.769 1.08-.734.342-1.451.729-2.125 1.179-.549.367-1.071.777-1.539 1.244-.356.357-.674.75-.985 1.146a30.808 30.808 0 0 0-2.636 3.959c-.213.383-.417.77-.612 1.161-.963 1.938-1.708 4.014-1.997 6.166-.05.378-.084.758-.106 1.137.013.996.025 1.992.035 2.987.013 1.505.025 3.01.023 4.515a159.33 159.33 0 0 1-.009 1.545 27.99 27.99 0 0 1-.034 1.195l-.012.169a3.705 3.705 0 0 1-.193.795c-.08.243-.169.484-.259.725-.293.784-.599 1.563-.895 2.347-.155.417-.309.835-.46 1.254-.646 1.814-1.227 3.652-1.672 5.527a36.683 36.683 0 0 0-.36 1.682c-.089.47-.168.944-.256 1.416-.051.259-.103.519-.157.779a24.312 24.312 0 0 1-.718 2.695 11.178 11.178 0 0 1-.969 2.165 9.06 9.06 0 0 1-.708 1.01c-.325.401-.678.778-1.015 1.167-.329.387-.654.777-.978 1.168-1.599 1.945-3.103 3.974-4.363 6.157-.914 1.585-1.702 3.25-2.22 5.008-.213.742-.417 1.487-.623 2.23a474.495 474.495 0 0 0-2.65 10.068c-.182.723-.361 1.446-.536 2.17-.093.385-.182.77-.276 1.154-.058.228-.115.457-.175.686a72.202 72.202 0 0 1-2.702 8.245 63.847 63.847 0 0 1-2.692 5.915 60.703 60.703 0 0 1-1.096 2.004c-.273.624-.549 1.246-.825 1.868-.282.627-.563 1.254-.853 1.876-.096.206-.193.411-.295.613-.07.14-.139.285-.237.408-.017.023-.053.054-.065.067-.046.04-.095.063-.144.095-.094.059-.186.122-.278.184a52.19 52.19 0 0 0-1.7 1.223c-.582.435-1.155.88-1.709 1.35-.311.262-.616.532-.898.823a3.975 3.975 0 0 0-.287.322.942.942 0 0 0-.132.201 8.112 8.112 0 0 1-.099.259c-.186.444-.426.86-.702 1.256-.289.414-.617.8-.929 1.198l-.127.168c-.089.126-.194.261-.241.412-.012.036-.014.073-.019.109-.013.066-.013.065-.029.129a3.376 3.376 0 0 1-.307.686 11.12 11.12 0 0 1-.423.684 24.787 24.787 0 0 1-1.399 1.886l-.019.023a1.476 1.476 0 0 0 .418.62c.06.049.125.091.195.122a.71.71 0 0 0 .128.042c.268.057.527-.072.75-.207.056-.034.111-.07.165-.108.058-.039.115-.081.171-.124.08-.06.157-.124.234-.188a9.03 9.03 0 0 0 .631-.588 15.518 15.518 0 0 0 1.01-1.136l.019-.024c.102-.095.122-.136.262-.175a.014.014 0 0 1 .006-.002c.248-1.273.47-2.551.668-3.833l.012-.058c.016-.05.018-.063.044-.11a.52.52 0 0 1 .262-.23c.05-.019.063-.019.115-.03.059-.005.059-.005.119-.003.06.01.115.021.17.047a.516.516 0 0 1 .286.539 105.696 105.696 0 0 1-.864 4.824c-.209 1.016-.43 2.03-.723 3.024a24.083 24.083 0 0 1-.625 1.838c-.188.484-.395.96-.588 1.443a7.308 7.308 0 0 0-.091.247 1.963 1.963 0 0 0-.051.177c-.017.075-.029.151-.044.226l-.053.252c-.128.593-.258 1.185-.383 1.779-.181.884-.362 1.772-.468 2.668a6.88 6.88 0 0 0-.052.673c-.003.15-.004.318.073.453l.003.004a.502.502 0 0 0 .151-.043c.089-.038.173-.089.254-.142.052-.077.098-.156.144-.236.251-.441.484-.892.715-1.344.251-.49.496-.982.74-1.474l.059-.122c.264-.647.53-1.294.799-1.94.186-.446.373-.891.563-1.336.177-.412.352-.824.545-1.229.04-.084.065-.135.108-.217l.024-.045a27.678 27.678 0 0 0 .193-1.678c.025-.291.045-.582.055-.874l.005-.056c.011-.05.011-.063.029-.111a.518.518 0 0 1 .269-.283.63.63 0 0 1 .167-.042c.057-.001.056-.001.114.004.057.013.11.026.162.053.119.063.21.172.251.3a.622.622 0 0 1 .022.211c-.009.189-.02.378-.032.567-.05.673-.123 1.346-.218 2.016l.002.026a.493.493 0 0 1-.039.225 26.005 26.005 0 0 1-.928 3.992l-.037.114-.362 3.189a1155.9 1155.9 0 0 0-.604 3.24c-.087.484-.176.967-.261 1.452-.019.118-.044.24-.056.361-.008.187.152.322.312.386a.848.848 0 0 0 .19.051c.07.011.144.017.214.01.18-.018.343-.115.479-.228.309-.258.522-.631.653-1.008.073-.211.123-.429.177-.646l.116-.465c.375-1.571.738-3.144 1.114-4.715.123-.51.247-1.019.378-1.527.081-.313.165-.626.262-.934.023-.07.022-.069.047-.139.018-.047.029-.078.051-.124.04-.088.091-.174.135-.262.168-.347.323-.7.486-1.05.084-.174.168-.349.263-.517.081-.141.169-.278.281-.396l.021-.021.013-.012.007-.157.005-.148c.007-.044.009-.089.021-.132a.52.52 0 0 1 .249-.301.515.515 0 0 1 .69.21c.056.106.048.141.059.257a48.69 48.69 0 0 1-.035.857 59.87 59.87 0 0 1-.285 3.739c-.087.76-.213 1.513-.321 2.27a14.555 14.555 0 0 0-.13 1.346c-.024.603-.037 1.207-.057 1.811l-.017.489-.389 3.257a.665.665 0 0 0 .075.126.38.38 0 0 0 .084.086c.12.086.286.045.415 0 .271-.095.498-.291.673-.515.065-.082.123-.167.175-.257.072-.123.134-.25.188-.382a3.5 3.5 0 0 0 .17-.538c.05-.213.087-.429.125-.644.07-.382.135-.767.199-1.152.179-1.067.348-2.136.529-3.203a14.26 14.26 0 0 1 .121-.642c.027-.161.05-.322.074-.485.182-1.299.347-2.602.512-3.905l.099-.783c.022-.095.021-.124.074-.209a.844.844 0 0 1 .193-.198c.226-.181.531-.274.81-.169.23.086.387.284.473.508.083.221.106.463.141.694a53.361 53.361 0 0 1 .287 2.248c.039.37.077.741.085 1.113.002.121-.006.242-.006.363.001.081.005.162.01.241.03.386.074.771.12 1.155.052.434.104.869.154 1.303.031.278.06.556.086.833.013.16.027.319.037.478.009.139.014.279.025.417.006.052.013.103.021.154.059.312.203.645.514.779.08.035.169.054.257.045.028-.002.063-.006.086-.026a.362.362 0 0 0 .056-.067c.077-.111.132-.236.179-.363.077-.208.134-.423.179-.641.073-.351.116-.709.123-1.068a8.085 8.085 0 0 0-.037-.794 94.142 94.142 0 0 0-.091-1.057c-.049-.534-.098-1.069-.143-1.603a49.93 49.93 0 0 1-.056-.771c-.019-.326-.038-.652-.035-.98.001-.192.015-.384.021-.576.003-.111.005-.224.006-.335.002-.392 0-.784.002-1.176.002-.153.004-.306.009-.459.015-.373.039-.751.148-1.111.095-.286.215-.577.318-.85l.886-2.361c.15-.469.287-.944.418-1.419.209-.758.401-1.519.575-2.286.337-1.489.61-2.997.745-4.519.036-.411.062-.821.072-1.233.01-.398.005-.796.011-1.194.005-.31.014-.62.025-.931.042-1.056.117-2.115.285-3.161.077-.475.172-.946.304-1.409.102-.358.224-.713.388-1.048.064-.128.133-.254.21-.374.052-.081.11-.159.163-.239.062-.097.121-.196.18-.295.089-.153.177-.308.262-.462.385-.697.759-1.4 1.141-2.097.633-1.144 1.284-2.283 2.063-3.333.289-.381.583-.757.875-1.136.618-.801 1.234-1.603 1.848-2.407 1.546-2.029 3.082-4.067 4.559-6.148a79.588 79.588 0 0 0 1.484-2.15c.444-.67.877-1.348 1.26-2.055.168-.321.336-.643.502-.965l.536-1.053c.747-1.49 1.484-2.984 2.235-4.47.334-.657.669-1.312 1.018-1.962.249-.461.502-.922.78-1.367.059-.094.119-.188.182-.28.066-.097.135-.192.2-.289.046-.07.09-.143.134-.215.284-.497.508-1.025.706-1.562a19.126 19.126 0 0 0 .849-3.074 7.49 7.49 0 0 0 .127-1.011c.003-.092 0-.183-.002-.275a3.11 3.11 0 0 1 .008-.167c.036-.341.118-.677.203-1.008.128-.502.275-.999.428-1.493a77.428 77.428 0 0 1 1.263-3.699 85.111 85.111 0 0 1 1.92-4.796 51.52 51.52 0 0 1 1.093-2.347c.313-.623.641-1.239 1.004-1.835.125-.203.253-.403.389-.599.115-.168.239-.33.356-.497.074-.108.145-.217.216-.326a15.35 15.35 0 0 0 1.111-2.184c.261-.623.493-1.258.705-1.9.286-.869.535-1.749.758-2.638.195-.782.369-1.569.519-2.36-.061-1.89-.13-3.78-.2-5.67-.118-3.243-.244-6.487-.37-9.73l-.029-.727.032-.197.103-.17c.16-.116.162-.117.355-.163l.197.031.169.104.118.161.045.194c.116 2.915.227 5.83.337 8.747.082 2.212.163 4.425.237 6.639a.5.5 0 0 1 .114.275c.005.044-.003.089-.004.134a18.1 18.1 0 0 1-.082.455l.016.482c.023.72.045 1.44.061 2.16.006.265.005.532.015.798.005.095.014.191.023.286.082.759.241 1.508.404 2.252.208.95.44 1.896.679 2.839.621 2.442 1.282 4.872 1.925 7.307.179.684.357 1.368.531 2.053.176.699.349 1.396.508 2.099.137.605.268 1.215.361 1.829.042.284.074.569.107.854.079.682.146 1.365.197 2.049.222 2.975.138 5.963-.194 8.926a59.118 59.118 0 0 1-.39 2.819c-.109.67-.235 1.337-.352 2.005-.056.334-.111.668-.164 1.001a84.176 84.176 0 0 0-.473 3.639c-.227 2.097-.392 4.198-.574 6.297a171.67 171.67 0 0 1-.164 1.76c-.146 1.431-.315 2.863-.59 4.276-.062.32-.131.64-.207.958-.089.375-.191.747-.285 1.121-.073.299-.145.598-.214.897a103.158 103.158 0 0 0-.815 4.003c-.276 1.499-.54 2.999-.816 4.498a131.4 131.4 0 0 1-.765 3.877c-.21.975-.447 1.943-.668 2.914-.088.388-.174.777-.258 1.166a163.178 163.178 0 0 0-1.668 9.044c-.204 1.32-.39 2.643-.549 3.969a62.033 62.033 0 0 0-.304 3.162c-.027.402-.048.803-.059 1.205-.012.414-.015.828-.019 1.242-.008.931-.009 1.862-.007 2.793.004 2.84.033 5.681.08 8.519.039 2.32.091 4.639.164 6.957.035 1.132.079 2.264.135 3.396.042.86.09 1.721.166 2.58.049.557.125 1.112.189 1.667.032.281.061.561.088.842.218 2.326.314 4.665.302 7.001a58.142 58.142 0 0 1-.084 2.952 37.167 37.167 0 0 1-.316 3.315c-.288 1.953-.559 3.906-.844 5.858a155.47 155.47 0 0 1-.81 5.079 42.071 42.071 0 0 1-.356 1.786c-.058.257-.12.514-.192.769-.06.216-.127.429-.212.638-.073.171-.153.34-.23.508-.15.326-.297.653-.444.98-1.79 4.043-3.272 8.227-4.375 12.51-.964 3.739-1.639 7.562-1.883 11.418a46.79 46.79 0 0 0-.073 4.541c.039 1.169.14 2.334.223 3.5.052.759.101 1.518.149 2.278.345 5.721.534 11.453.499 17.186a183.149 183.149 0 0 1-.1 5.136c-.021.611-.047 1.221-.077 1.832-.013.28.001.355-.027.525v.003c.001.21-.003.42-.007.631a28.405 28.405 0 0 1-.293 3.483c-.133.867-.314 1.735-.614 2.562a7.667 7.667 0 0 1-.251.607c-.064.134-.133.264-.197.398l-.091.204a5.11 5.11 0 0 0-.392 1.598c-.04.506.002 1.007.078 1.506.051.309.112.614.167.921.033.196.064.393.063.592-.001.175-.024.352-.044.527-.045.398-.093.796-.139 1.194-.07.62-.134 1.24-.183 1.861a34.882 34.882 0 0 0-.093 1.649c-.011.399-.015.799-.007 1.199a14.1 14.1 0 0 0 .154 1.915c.075.464.179.929.357 1.366.168.41.418.839.825 1.051.079.042.164.072.251.096l.292.07c.568.123 1.141.205 1.72.25.487.039.978.052 1.468.044a14.755 14.755 0 0 0 3.161-.369 7.82 7.82 0 0 0 1.139-.354c.235-.097.47-.208.675-.359.133-.097.248-.217.354-.34.232-.271.414-.582.54-.914.09-.237.151-.484.184-.735a4.067 4.067 0 0 0-.032-1.231 5.97 5.97 0 0 0-.342-1.185c-.088-.221-.19-.435-.291-.649-.052-.117-.052-.116-.101-.232a6.58 6.58 0 0 1-.274-.843c-.204-.811-.251-1.656-.199-2.489.067-1.078.295-2.142.598-3.176a26.022 26.022 0 0 1 .623-1.841c.037-.096.041-.094.063-.169.012-.045.021-.09.03-.136.082-.478.069-.97.033-1.452a14.717 14.717 0 0 0-.292-1.914c-.071-.33-.157-.656-.229-.985a10.305 10.305 0 0 1-.063-.351c-.184-1.202-.122-2.43.036-3.632.171-1.298.461-2.581.812-3.842.132-.476.277-.948.424-1.421l.065-.206c.024-.063.027-.081.065-.137a.332.332 0 0 1 .037-.047c-.022-.09-.008-.132.006-.241.085-.323.172-.645.262-.967a90.681 90.681 0 0 1 2.567-7.699c.345-.906.702-1.806 1.076-2.701.226-.539.451-1.079.715-1.602.282-.544.58-1.08.866-1.622.275-.529.541-1.063.79-1.605a32.27 32.27 0 0 0 .925-2.245 38.998 38.998 0 0 0 1.473-5.096c.396-1.797.687-3.616.9-5.443.602-5.159.602-10.372.339-15.554l.008-.122c.139-.719.301-1.434.478-2.143.198-.797.416-1.588.667-2.369.205-.638.431-1.27.699-1.884.218-.5.463-.994.772-1.444.097-.141.2-.277.313-.405.077-.088.162-.17.239-.258a4.83 4.83 0 0 0 .138-.175 6.12 6.12 0 0 0 .486-.822c.138-.278.267-.561.387-.848.343-.819.629-1.662.891-2.51.372-1.205.692-2.425.974-3.654.208-.911.401-1.828.535-2.754.024-.161.045-.323.062-.487.013-.127.021-.256.036-.384.015-.118.016-.117.034-.234.11-.66.253-1.314.4-1.966.193-.858.397-1.712.606-2.565a327.714 327.714 0 0 1 1.686-6.553c.617-2.299 1.25-4.595 1.918-6.879.289-.993.585-1.984.893-2.971.246-.787.498-1.572.773-2.349.091-.255.183-.508.28-.76.131-.338.27-.674.402-1.011.121-.308.24-.618.359-.927a172.311 172.311 0 0 0 3.129-9.005c.369-1.167.723-2.34 1.05-3.521.27-.982.526-1.97.726-2.97.044-.219.086-.439.122-.659.025-.152.043-.304.069-.454.012-.058.012-.057.027-.114.03-.11.064-.22.098-.329.112-.341.225-.681.334-1.022a40.74 40.74 0 0 0 .555-1.907 37.364 37.364 0 0 0 1.029-5.702l-.037.065a8.71 8.71 0 0 1-1.208 1.658 8.44 8.44 0 0 1-.806.753c-1.494 1.22-3.353 1.875-5.198 2.35-1.724.444-3.498.712-5.28.74-2.388.037-4.789-.366-6.998-1.288-.84-.35-1.65-.774-2.409-1.275a9.712 9.712 0 0 1-1.376-1.072l-.021-.02c-.016-.019-.035-.036-.05-.057a.535.535 0 0 1-.092-.208.515.515 0 0 1 .442-.604.516.516 0 0 1 .296.055c.022.011.043.026.064.039.1.086.194.178.293.264.456.388.949.728 1.461 1.037.606.367 1.247.68 1.902.948 2.048.833 4.266 1.194 6.472 1.16 1.702-.027 3.395-.284 5.042-.708.288-.074.575-.153.859-.238 1.439-.426 2.87-1.006 4.03-1.982.191-.162.375-.332.55-.513a7.61 7.61 0 0 0 1.138-1.541c.568-1.005.929-2.116 1.18-3.238.313-1.402.461-2.837.535-4.27a48.4 48.4 0 0 0 .061-2.8 43.44 43.44 0 0 0-.032-1.573 25.463 25.463 0 0 0-.135-1.745 24.965 24.965 0 0 0-1.656-6.57 22.335 22.335 0 0 0-1.098-2.327 13.51 13.51 0 0 0-.917-1.481l-.04-.065a.603.603 0 0 1-.058-.22.517.517 0 0 1 .309-.485.574.574 0 0 1 .224-.041l.075.008c.025.008.05.013.074.021a.5.5 0 0 1 .192.122c.017.018.032.039.049.059.059.079.115.161.171.243.791 1.183 1.431 2.465 1.965 3.784a25.747 25.747 0 0 1 1.373 4.589c.034-.487.071-.974.114-1.461.07-.801.154-1.602.276-2.397.044-.286.092-.571.148-.854.053-.272.111-.541.189-.807.146-.505.349-.995.602-1.457a5.85 5.85 0 0 1 .653-.966c.153-.18.321-.354.524-.475l.027-.015c.022-.01.044-.021.066-.029.061-.023.079-.022.142-.031l.073.001c.024.003.048.005.072.01a.515.515 0 0 1 .193.909c-.031.023-.065.04-.095.062-.033.028-.063.058-.094.087-.241.249-.439.54-.611.84a6.178 6.178 0 0 0-.552 1.281 8.703 8.703 0 0 0-.212.917c-.08.418-.143.84-.198 1.263-.063.472-.113.944-.157 1.417a85.802 85.802 0 0 0-.164 2.087c-.102 1.551-.184 3.102-.283 4.653-.036.551-.078 1.104-.112 1.655a28.47 28.47 0 0 0-.048 2.434c.012.495.038.989.083 1.481a18.872 18.872 0 0 0 .259 1.85c.335 1.71.965 3.409 2.109 4.748a7.12 7.12 0 0 0 1.617 1.403 7.77 7.77 0 0 0 1.777.822c1.014.326 2.074.457 3.135.481a58.88 58.88 0 0 0 3.841-.099 38.755 38.755 0 0 0 2.044-.177c.53-.06 1.058-.133 1.584-.222.365-.063.729-.134 1.092-.216.92-.207 1.836-.48 2.685-.894.599-.292 1.168-.663 1.628-1.15.243-.259.447-.549.627-.857l.041-.06c.016-.017.031-.037.05-.053a.513.513 0 0 1 .851.277.513.513 0 0 1-.029.287c-.009.022-.021.042-.032.065a5.62 5.62 0 0 1-.767 1.041c-.631.671-1.43 1.16-2.269 1.528-1.13.497-2.342.796-3.555 1.012-1.854.329-3.741.46-5.623.513-.474.015-.948.022-1.423.025-.307.002-.615.005-.921-.003-.471-.013-.94-.049-1.406-.111a10.22 10.22 0 0 1-2.784-.764 8.272 8.272 0 0 1-3.201-2.508 9.334 9.334 0 0 1-.688-1.027l.053 1.261c.04.964.079 1.928.116 2.892l.025.65c-.002.078-.011.153-.018.231a7.403 7.403 0 0 0-.016.26c-.005.096-.008.191-.011.286-.027 1.331.061 2.664.163 3.99.032.407.068.812.099 1.218.009.085.02.169.032.253.065.436.145.87.226 1.302.126.667.259 1.334.396 1.999.313 1.52.644 3.037.988 4.551a202.17 202.17 0 0 0 1.275 5.314 81.314 81.314 0 0 0 1.254 4.476c.055.175.108.35.16.524.417 1.447.745 2.916 1.047 4.39.343 1.672.647 3.352.935 5.034a303.868 303.868 0 0 1 1.892 12.802c.058.451.11.904.169 1.356a30.294 30.294 0 0 0 .67 3.39c.424 1.633.97 3.233 1.553 4.817.709 1.925 1.476 3.827 2.215 5.74.056.149.111.299.164.449.701 2.009 1.103 4.109 1.327 6.223.214 2.023.267 4.063.207 6.095a52.048 52.048 0 0 1-.158 2.806c-.014.176-.031.352-.042.528a19.17 19.17 0 0 0-.014.415c-.016.939.025 1.88.093 2.817.079 1.098.199 2.192.358 3.281.418 2.874 1.103 5.724 2.207 8.415l.578 1.391c1.424 3.475 2.767 6.985 3.934 10.555.321.979.627 1.962.912 2.951a61.156 61.156 0 0 1 .431 1.58c.08.312.155.623.232.935.332 1.402.639 2.81.9 4.227.216 1.174.405 2.355.527 3.544.081.776.136 1.558.117 2.338-.013.526-.055 1.063-.208 1.568a2.457 2.457 0 0 1-.118.324c-.04.09-.085.178-.125.268-.041.094-.041.094-.08.19a5.224 5.224 0 0 0-.262.942c-.11.631-.095 1.276-.008 1.909.102.75.305 1.48.471 2.216.023.106.045.211.064.316.101.578.168 1.161.229 1.744.072.687.131 1.374.182 2.062.065.867.116 1.736.146 2.605.028.771.043 1.545.015 2.316-.008.221-.02.443-.04.663-.014.168-.042.335-.055.503a2.24 2.24 0 0 0 .046.608c.155.706.64 1.298 1.201 1.732a4.597 4.597 0 0 0 .698.447c.414.216.858.377 1.316.47.213.043.429.068.647.085.28.024.562.033.843.032a10.104 10.104 0 0 0 2.046-.209c.425-.09.844-.211 1.243-.382.3-.129.591-.287.847-.491.183-.147.349-.319.472-.518.077-.122.131-.253.183-.387.081-.206.152-.416.21-.63a5.43 5.43 0 0 0 .181-1.12 6.511 6.511 0 0 0-.061-1.208 12.23 12.23 0 0 0-.295-1.416c-.051-.199-.108-.398-.162-.597l-.031-.14a3.02 3.02 0 0 1-.045-.378c-.035-.646.129-1.29.317-1.901.058-.19.12-.379.184-.567.104-.306.209-.612.31-.919.046-.145.092-.291.135-.438.106-.376.202-.761.21-1.153a3.105 3.105 0 0 0-.02-.397 4.307 4.307 0 0 0-.245-1.03c-.214-.583-.526-1.125-.807-1.678a19.324 19.324 0 0 1-.185-.382 16.431 16.431 0 0 1-.616-1.613 17.707 17.707 0 0 1-.874-4.528 18.43 18.43 0 0 1-.029-1.127c.004-.6.034-1.199.062-1.799.059-1.297.13-2.594.203-3.892.163-2.961.335-5.921.502-8.881.081-1.482.161-2.962.238-4.444.024-.452.046-.904.069-1.357l.013-.093c.01-.03.017-.061.03-.09a.508.508 0 0 1 .051-.087l-.018-.016-.095-.175-.021-.198c.055-.593.11-1.185.168-1.777.155-1.543.316-3.087.541-4.621.043-.29.089-.58.139-.869.029-.166.062-.331.09-.498.017-.11.032-.22.046-.331.089-.778.111-1.564.109-2.347a49.546 49.546 0 0 0-.099-2.884 92.328 92.328 0 0 0-.692-6.843 91.728 91.728 0 0 0-1.176-6.853 51.73 51.73 0 0 0-.655-2.72 22.434 22.434 0 0 0-.836-2.543c-.291-.691-.59-1.377-.883-2.066-.58-1.389-1.138-2.786-1.614-4.214a39.252 39.252 0 0 1-1.369-5.315c-.415-2.266-.625-4.567-.684-6.868-.041-1.644.004-3.288.056-4.931.074-2.27.183-4.538.32-6.805.296-4.89.714-9.772 1.2-14.645.304-3.053.644-6.102.969-9.153.086-.808.169-1.616.251-2.424.333-3.372.631-6.751.72-10.139a61.061 61.061 0 0 0 0-3.529 34.52 34.52 0 0 0-.361-4.211c-.076-.475-.157-.949-.237-1.425-.415-2.42-.846-4.838-1.278-7.255-.525-2.932-1.051-5.865-1.572-8.797-.248-1.404-.494-2.808-.737-4.212-.257-1.493-.51-2.986-.751-4.481a71.026 71.026 0 0 1-.471-3.278c-.212-1.864-.338-3.736-.445-5.608-.12-2.072-.207-4.146-.267-6.22-.007-.071-.016-.141-.024-.211-.1-.746-.232-1.486-.367-2.225-.173-.942-.356-1.881-.545-2.818-.11-.549-.224-1.097-.331-1.645a76.166 76.166 0 0 1-.167-.911 32.441 32.441 0 0 1-.374-2.844 21.884 21.884 0 0 1-.058-2.722c.056-1.315.235-2.622.463-3.918.114-.65.233-1.302.374-1.947.086-.394.181-.787.282-1.178.241-.936.516-1.862.797-2.786.282-.934.571-1.865.854-2.798.151-.503.299-1.004.446-1.508.343-1.19.669-2.386.961-3.591a59.649 59.649 0 0 0 1.353-7.602c0-.012.002-.024.004-.037l.004-.033c.063-.557.119-1.116.176-1.673.174-1.705.328-3.41.468-5.116.329-3.981.589-7.969.791-11.959l.023-.455.048-.193.118-.16.17-.103.197-.029c.065.015.129.032.193.048l.16.119.103.17.03.197a378.167 378.167 0 0 1-.96 14.143 250.008 250.008 0 0 1-.326 3.441c-.054.528-.107 1.055-.165 1.581.362.822.727 1.644 1.091 2.465a368.434 368.434 0 0 0 2.862 6.304c.163.348.327.695.495 1.041.164.339.333.676.496 1.016.111.232.219.466.326.701a80 80 0 0 1 1.592 3.801 80.754 80.754 0 0 1 1.46 4.033c.345 1.043.666 2.096.941 3.161.239.922.448 1.856.568 2.803.031.256.057.512.071.771.016.277.016.556.026.834.007.16.015.319.025.479.058.783.168 1.564.439 2.304.186.506.44.98.705 1.448.206.363.418.722.627 1.084.149.265.297.529.443.796.358.666.69 1.343 1.013 2.026.525 1.124 1.034 2.256 1.555 3.381a92.032 92.032 0 0 0 1.699 3.472 61.323 61.323 0 0 0 2.351 4.138c.558.898 1.141 1.78 1.749 2.645.504.716 1.029 1.414 1.546 2.12.215.297.43.596.643.895 1.487 2.103 2.907 4.265 4.085 6.559.871 1.698 1.618 3.481 2.034 5.349.138.614.238 1.237.291 1.865.041.497.048.999.067 1.497l.044.947c.155 2.944.39 5.889.774 8.813.142 1.079.303 2.155.51 3.222.169.876.365 1.75.65 2.596l.009.026-.02-.032c.028.052.028.052.053.105.146.353.168.747.163 1.124a8.16 8.16 0 0 1-.099 1.103c-.046.31-.104.617-.154.925-.036.228-.071.456-.104.683-.176 1.219-.335 2.44-.474 3.663-.041.365-.08.729-.116 1.094-.029.297-.06.595-.066.894 0 .04.004.079.01.117.05.26.207.504.418.661a.53.53 0 0 0 .329.125c.006 0 .015 0 .02-.003a.733.733 0 0 0 .18-.23c.097-.169.17-.351.233-.534a7.549 7.549 0 0 0 .347-1.608c.024-.213.035-.425.05-.638l.033-.35c.13-1.122.32-2.237.533-3.346.1-.519.206-1.039.327-1.554.077-.323.156-.648.262-.964.046-.137.096-.274.17-.399a.623.623 0 0 1 .135-.171.465.465 0 0 1 .125-.088 1.75 1.75 0 0 1 .087-.037.496.496 0 0 1 .169-.029.536.536 0 0 1 .138.011.604.604 0 0 1 .13.038c.126.057.229.14.307.254.089.126.141.274.177.423.057.239.075.486.083.73.002.129.023.257.035.384l.103 1.008c.14 1.347.282 2.693.433 4.038.108.965.219 1.929.345 2.891a37.98 37.98 0 0 0 .171 1.215c.026.159.052.319.086.476a4.295 4.295 0 0 0 .206.682c.021.053.045.106.07.158.099.2.24.417.462.492a.781.781 0 0 0 .369.021c.06-.009.119-.023.178-.038.036-.01.077-.018.111-.037a.213.213 0 0 0 .047-.043.597.597 0 0 0 .096-.202c.04-.136.058-.28.066-.421a4.462 4.462 0 0 0-.029-.749 7.345 7.345 0 0 0-.151-.869l-.007-.025-.014-.107-.333-10.066c.008-.101.002-.13.043-.223a.594.594 0 0 1 .209-.241.782.782 0 0 1 .573-.138.888.888 0 0 1 .199.064.857.857 0 0 1 .364.349c.04.066.07.136.1.207.033.092.06.186.091.279.093.278.189.554.28.833.436 1.365.766 2.761 1.048 4.166.303 1.502.55 3.015.773 4.532.013.053.027.105.042.157.155.478.444.949.918 1.163.119.054.246.088.375.108a.978.978 0 0 0 .057-.094c.085-.167.136-.349.171-.534a4.42 4.42 0 0 0 .073-.678 9.611 9.611 0 0 0-.059-1.388c-.04-.367-.094-.734-.141-1.1a114 114 0 0 1-.231-2.068c-.123-1.204-.235-2.41-.36-3.613-.053-.501-.106-1.002-.176-1.5a10.52 10.52 0 0 0-.086-.532 2.087 2.087 0 0 0-.097-.383l-.029-.117c-.001-.106-.012-.135.025-.238a.514.514 0 0 1 .227-.271c.191-.11.437-.087.63.006.133.064.248.162.343.275.118.139.209.299.286.464.136.296.222.61.303.925.118.466.231.933.352 1.398.076.287.154.573.234.859.158.543.326 1.084.525 1.614.162.431.343.856.567 1.259.13.233.28.464.469.653a.768.768 0 0 0 .33.214l.011.002a.87.87 0 0 0 .174-.357c.065-.248.069-.512.051-.766a14.322 14.322 0 0 0-.062-.639 46.265 46.265 0 0 0-.08-.651c-.035-.259-.072-.517-.109-.776a79.805 79.805 0 0 0-1.499-7.545c-.099-.392-.2-.782-.294-1.176a43.182 43.182 0 0 1-.16-.713c-.24-1.135-.439-2.287-.473-3.447a9.29 9.29 0 0 1 .01-.783c.009-.153.025-.305.033-.458l.001-.029c.019-.116.013-.151.075-.253a.515.515 0 0 1 .805-.086.508.508 0 0 1 .126.232c.011.043.01.089.015.133-.005.203-.031.406-.041.611-.018.484.005.968.053 1.449.033.023.064.046.095.07.132.102.255.217.375.334.169.163.33.334.489.506.083.09.169.177.244.273.03.04.054.085.081.126.044.071.09.139.136.209a7.86 7.86 0 0 0 .568.732 5.96 5.96 0 0 0 .563.56c.068.059.137.115.209.169.448.338 1.007.611 1.581.503.113-.02.222-.055.326-.1v-.011c-.008-.16-.089-.318-.165-.455a4.138 4.138 0 0 0-.418-.59c-.064-.077-.132-.151-.196-.228-.064-.089-.124-.182-.185-.274a22.565 22.565 0 0 1-1.082-1.806 9.92 9.92 0 0 1-.377-.785 4.812 4.812 0 0 1-.216-.603 2.668 2.668 0 0 1-.064-.292c-.012-.081-.016-.162-.031-.242a1.15 1.15 0 0 0-.036-.143 2.619 2.619 0 0 0-.406-.721 8.943 8.943 0 0 0-.732-.823c-.28-.28-.567-.553-.846-.835-.031-.034-.044-.045-.061-.063zM52.794 306.283a14.208 14.208 0 0 0-.405 1.99c-.103.826-.117 1.673.04 2.494.06.315.146.626.261.925.09.235.204.459.308.689.065.149.065.148.126.299a8.97 8.97 0 0 1 .262.777c.244-.045.483-.115.707-.223.163-.08.317-.178.458-.292.358-.293.621-.692.78-1.124.058-.158.094-.318.13-.482a8.111 8.111 0 0 0 .191-1.256c.059-.877-.059-1.811-.576-2.545a2.78 2.78 0 0 0-.297-.352 2.811 2.811 0 0 0-.501-.395 2.405 2.405 0 0 0-.628-.279c-.286-.07-.571-.148-.856-.226zm57.928-1.426l-.106.028a2.995 2.995 0 0 0-1.26.834 3.12 3.12 0 0 0-.256.335c-.549.835-.644 1.88-.554 2.852a9.772 9.772 0 0 0 .207 1.237c.005.02.028.058.036.075.017.036.036.071.054.107a3.602 3.602 0 0 0 1.916 1.657c.209.075.425.13.644.168l.096.015a71.724 71.724 0 0 0-.292-4.291 27.466 27.466 0 0 0-.235-1.898c-.046-.27-.111-.535-.174-.801l-.076-.318zM86.279 66.568c.033.014.067.025.099.042a.513.513 0 0 1 .249.332c.008.034.009.07.013.105.012.724.022 1.448.031 2.172.042 4.553.018 9.105-.008 13.658-.028 4.276-.061 8.551-.088 12.825-.034 5.929-.062 11.86-.002 17.788.023 2.367.061 4.732.132 7.097.06 1.979.141 3.958.287 5.932l.023.286c-.001.036.002.072-.002.107a.522.522 0 0 1-.218.354.519.519 0 0 1-.6-.015.52.52 0 0 1-.178-.261c-.009-.034-.013-.07-.02-.105-.022-.296-.045-.593-.065-.89-.138-2.064-.214-4.13-.269-6.197a388.733 388.733 0 0 1-.111-6.297c-.053-5.208-.035-10.417-.01-15.624.032-5.678.079-11.355.111-17.034.022-4.361.039-8.721-.022-13.082l-.011-.697c.008-.094.003-.119.041-.208a.513.513 0 0 1 .303-.283c.09-.031.117-.024.211-.025l.104.02zm47.356 26.461c-.006.032-.007.031-.011.064v.003c.011-.053.028-.118.011-.067zM95.577 61.038c.067.013.129.03.189.064.116.067.203.18.238.31.015.058.013.073.017.132v15.433c.017.319.065.639.125.952.092.491.222.976.393 1.445a7.07 7.07 0 0 0 .934 1.78c.277.377.601.72.968 1.01a4.792 4.792 0 0 0 1.262.723c1.249.486 2.638.458 3.938.218.239-.044.477-.095.713-.153.293-.072.583-.153.871-.243.397-.124.789-.264 1.177-.413l.107-.041 4.976-2.382.062-.024a.55.55 0 0 1 .264-.014.514.514 0 0 1 .376.669.516.516 0 0 1-.15.218c-.045.039-.06.044-.111.072l-5.011 2.398c-.378.148-.759.289-1.145.414a15.642 15.642 0 0 1-1.618.439c-1.513.319-3.127.384-4.607-.129a5.806 5.806 0 0 1-1.631-.869 6.197 6.197 0 0 1-1.111-1.09 7.802 7.802 0 0 1-1.147-2.034 9.984 9.984 0 0 1-.448-1.487c-.1-.457-.173-.92-.205-1.387-.27-5.161-.002-10.337-.002-15.505a.626.626 0 0 1 .038-.196.518.518 0 0 1 .34-.297c.057-.015.073-.014.132-.017l.066.004zm-20.406 0c.058.011.074.011.128.035a.511.511 0 0 1 .316.471v15.453a8.273 8.273 0 0 1-.118 1.111c-.09.544-.221 1.082-.399 1.605a7.884 7.884 0 0 1-1.02 2.039c-.319.45-.695.86-1.122 1.208-.283.23-.588.433-.909.605a6.117 6.117 0 0 1-.66.299c-1.464.558-3.084.511-4.599.204a14.629 14.629 0 0 1-.666-.153 16.68 16.68 0 0 1-.936-.269 20.647 20.647 0 0 1-1.12-.397l-.143-.056-5.119-2.397-.058-.031a.558.558 0 0 1-.179-.195.518.518 0 0 1 .109-.613.51.51 0 0 1 .434-.125c.058.01.071.019.127.04l5.088 2.382c.387.152.776.293 1.171.419a14.335 14.335 0 0 0 1.594.414c1.333.258 2.77.302 4.047-.223a4.58 4.58 0 0 0 1.175-.696c.329-.268.621-.581.873-.922a6.716 6.716 0 0 0 .916-1.772 9.047 9.047 0 0 0 .493-2.475c.156-5.149 0-10.303 0-15.455a.627.627 0 0 1 .039-.196.515.515 0 0 1 .34-.297c.057-.015.072-.014.131-.017l.067.004zm20.02-17.589l-.017.025c.015-.019.035-.041.017-.025zm.089-.084l-.034.032.085-.058-.051.026zm.193-.077l-.003.001.003-.001zm-20.726-8.211c.035.745.089 1.488.194 2.226.08.555.185 1.11.356 1.644a74.352 74.352 0 0 0-.55-3.87zm20.293-1.122l-.001.385c.006 1.246.03 2.493.109 3.736l.005.08c.083-.256.148-.519.2-.783.198-.987.237-1.994.313-2.995l.016-.213-.451.926-.191-1.136zm-13.631-.28l.005.004c-.004-.004-.009-.01-.005-.004zm16.846-12.149c.335-1.246.629-2.504.899-3.765.328-1.535.618-3.083.812-4.641.112-.89.195-1.785.198-2.682.002-.622-.025-1.258-.196-1.859-.069-.225-.145-.447-.22-.67a24.035 24.035 0 0 0-.239-.665c-.059-.156-.12-.312-.185-.466-.243-.575-.533-1.165-.996-1.597a2.468 2.468 0 0 0-.453-.335c-.465-.269-.998-.395-1.52-.494l-.048-.009-.199.553c-.073.195-.146.389-.221.582-.607 1.543-1.295 3.071-2.224 4.45l-.081.115-.078.111-.832-.592c.076-.105.149-.211.222-.318.072-.112.144-.223.214-.335.434-.707.81-1.444 1.154-2.198.37-.813.701-1.643 1.004-2.484l.077-.22c-1.123-.703-2.331-1.262-3.573-1.721-2.875-1.063-5.997-1.482-9.048-1.157-1.876.2-3.746.659-5.427 1.535-.851.443-1.647.992-2.351 1.645a9.931 9.931 0 0 0-2.436 3.501 9.374 9.374 0 0 0-.471 1.469c-.033.149-.063.3-.085.451a2.464 2.464 0 0 0-.029.257c-.003.052-.001.104 0 .157.005.193.015.386.025.579.085 1.537.201 3.073.315 4.608.161 2.16.33 4.32.503 6.48l.033.408 1.979 4.463.2 2.583c-.01.86-.021 1.721-.034 2.582l-.006.363c0 .028-.008.126-.003.183l.014.074c.074.253.213.487.35.709l.713.03 2.358-.283c.349-.029.699-.054 1.048-.079.548-.036 1.097-.073 1.646-.087.187-.004.374-.008.56.003a.954.954 0 0 1 .322.062c.03.013.059.031.088.046l.026.019c.139.052.285.089.428.127a33.064 33.064 0 0 0 2.396.525l.029.005c.137-.021.273-.056.408-.09.569-.147 1.134-.307 1.704-.453.264-.067.528-.131.796-.182a4.2 4.2 0 0 1 .503-.072c.249-.016.502-.007.751.01.46.031.917.089 1.374.157l.021.003c.292-.041.581-.095.871-.146l1.509-.275.53-.099.419.071c.431.075.863.155 1.288.261.195-1.07.384-2.142.58-3.212.069-.377.139-.755.213-1.132.046-.229.092-.46.151-.688l.014-.049c.028-.077.03-.076.066-.15l.007-.009c.091-.296.154-.601.221-.904.107-.48.208-.962.307-1.443l.017-.079c.003-.056.011-.11.018-.165.012-.071.026-.14.042-.211.125-.508.341-.99.572-1.458.107-.216.221-.431.337-.642l-.045-.029c.219-.346.439-.692.668-1.032zm-1.317 9.96l.025-.017a.865.865 0 0 0 .071.089.317.317 0 0 0 .045.035.276.276 0 0 0 .092-.038c.055-.032.105-.073.153-.115a3.04 3.04 0 0 0 .492-.603c.313-.474.565-.989.782-1.513.08-.193.155-.388.223-.586a4.16 4.16 0 0 0 .148-.527c.026-.158.045-.318.068-.476.059-.43.119-.86.182-1.289.132-.895.27-1.791.46-2.677.048-.226.1-.451.159-.675.035-.132.076-.264.11-.398a.916.916 0 0 0 .003-.47c-.073-.263-.302-.463-.559-.54l-.004-.001c-.077.103-.15.21-.222.316a19.182 19.182 0 0 0-.544.907c-.239.427-.47.861-.661 1.312-.134.312-.262.638-.285.98-.074.362-.149.724-.227 1.085.004.029.005.056.007.086-.008.135-.013.134-.03.298l-.074.686c-.058.548-.114 1.096-.17 1.644-.084.829-.165 1.657-.244 2.487zm-24.537-7.727l-.324.369c-.191-.167-.38-.336-.569-.507a30.26 30.26 0 0 1-.527-.49l-.032-.034a103.7 103.7 0 0 1 .506 1.861c.23.896.462 1.794.641 2.701.034.176.062.354.091.53.021.105.021.105.044.209.091.375.203.745.337 1.109.099.267.208.531.336.785.085.17.179.339.29.494.065.088.135.177.223.242l.008.005a.57.57 0 0 0 .056-.064l.014-.021.02-.027.131.09-.004-.13a38.251 38.251 0 0 0-.095-1.792 13.425 13.425 0 0 0-.094-.872 3.68 3.68 0 0 0-.129-.596c-.045-.134-.122-.251-.185-.379a2.414 2.414 0 0 1-.047-.118 1.02 1.02 0 0 1-.065-.322.512.512 0 0 1 .441-.498c.044-.005.05-.005.085-.005-.329-.867-.744-1.703-1.152-2.54zm-1.896-1.18v.001a.049.049 0 0 0-.003-.007l.003.006z"></path>
                                                  </g>
                                                  <g class="body-parts">
                                                    <path
                                                      on-evidence-select="bodyModelEvidenceSelected(evidence)"
                                                      d="M71.376 17.117l-.353-4.81c-.033-.51-.067-1.02-.094-1.53a23.405 23.405 0 0 1-.023-.511 3.96 3.96 0 0 1-.002-.327c.006-.151.028-.302.053-.451.117-.71.336-1.401.607-2.066a10.963 10.963 0 0 1 2.999-4.14 12.05 12.05 0 0 1 2.708-1.746c1.247-.59 2.583-.982 3.94-1.223A20.938 20.938 0 0 1 84.912 0c.775.009 1.548.055 2.317.148a21.87 21.87 0 0 1 5.375 1.362 19.444 19.444 0 0 1 3.445 1.737l.038.025a10.447 10.447 0 0 1 .804.147c.584.132 1.159.317 1.664.648.167.108.324.232.47.367.667.624 1.063 1.48 1.388 2.318.07.179.136.359.199.538.107.303.208.607.308.911.028.089.028.089.054.179.183.712.219 1.453.21 2.185a24.301 24.301 0 0 1-.205 2.681l-.569 3.377-1.288.251a8.21 8.21 0 0 0-1.361.599 8.959 8.959 0 0 0-1.715 1.236c-1.502 1.368-2.545 3.168-3.271 5.049-.129.336-.249.675-.36 1.018-.15.461-.284.927-.404 1.396a27.194 27.194 0 0 0-.407 1.87c-.172.942-.3 1.891-.393 2.843l-.088 1.615h-1.702l-.203.066-.149.047c-.397.123-.795.24-1.196.349-.353.096-.707.186-1.064.266-.24.054-.481.104-.723.147-.52.093-1.044.155-1.572.109a3.161 3.161 0 0 1-.77-.155 1.808 1.808 0 0 1-.607-.336.889.889 0 0 1-.191-.219l-.155-.306-2.888.289-.039-1.086a37.85 37.85 0 0 0-.328-2.929 28.94 28.94 0 0 0-.426-2.223 24.042 24.042 0 0 0-.413-1.538 17.933 17.933 0 0 0-.706-1.934c-.796-1.844-1.954-3.591-3.621-4.755a7.603 7.603 0 0 0-.814-.498 7.225 7.225 0 0 0-1.304-.536l-.876-.141z"
                                                      class="body-area hover_body body-area-head "
                                                      title="Head"
                                                      data-toggle="popover"
                                                      data-container="body"
                                                      data-placement="right"
                                                      type="button"
                                                      data-html="true"
                                                      href="#"
                                                      body_part="Head"
                                                      id="body-area-head"
                                                      onClick={
                                                        this.attributeSymptomTag
                                                      }
                                                      gender="male"
                                                    ></path>
                                                    <path
                                                      on-evidence-select="bodyModelEvidenceSelected(evidence)"
                                                      d="M71.454 18.141l1.149.306a6.754 6.754 0 0 1 1.401.815c1.374 1.034 2.338 2.521 3.024 4.078a17.19 17.19 0 0 1 .751 2.061c.205.683.375 1.377.517 2.077.188.921.328 1.852.433 2.786l.181 2.592-5.218.522-.018-1.246-.001-.093a.913.913 0 0 1-.371.021c-.399-.058-.708-.362-.934-.676a4.366 4.366 0 0 1-.333-.55 7.502 7.502 0 0 1-.207-.434 10.6 10.6 0 0 1-.62-1.905c-.036-.173-.059-.348-.091-.522a18.277 18.277 0 0 0-.106-.518 65.662 65.662 0 0 0-.732-2.955 53.99 53.99 0 0 0-.264-.954c-.039-.136-.078-.271-.115-.407a5.566 5.566 0 0 1-.045-.195c-.063-.341-.088-.73.136-1.022a.704.704 0 0 1 .321-.241.868.868 0 0 1 .337-.048c.237.024.469.127.636.301.039.04.063.071.094.118.008.013.02.04.033.056.041.048.084.093.126.138.091.091.182.181.275.268l-.017-.039-.342-4.334zM97.512 32.5h-5.396l.039-.952c.084-1.006.205-2.009.375-3.004.131-.761.29-1.517.486-2.264.117-.444.246-.885.391-1.321.107-.322.222-.64.346-.955.685-1.739 1.662-3.41 3.077-4.655.212-.186.432-.362.661-.525.274-.196.561-.374.858-.532a7.149 7.149 0 0 1 1.273-.528l.585-.097-.68 3.005c.479.085.922.392 1.187.796.136.208.227.445.265.691.034.228.024.461-.02.687-.033.172-.089.339-.134.509-.04.153-.077.306-.112.46-.326 1.491-.514 3.007-.73 4.516-.01.066-.024.13-.038.194-.083.34-.198.671-.326.997-.134.339-.283.673-.447.999a8.818 8.818 0 0 1-.505.88 4.47 4.47 0 0 1-.59.733c-.162.158-.353.3-.565.366z"
                                                      class="body-area hover_body body-area-ears "
                                                      title="Ears"
                                                      data-toggle="popover"
                                                      data-container="body"
                                                      data-placement="right"
                                                      type="button"
                                                      data-html="true"
                                                      href="#"
                                                      body_part="Ears"
                                                      id="body-area-ears"
                                                      onClick={
                                                        this.attributeSymptomTag
                                                      }
                                                      gender="male"
                                                    ></path>
                                                    <path
                                                      on-evidence-select="bodyModelEvidenceSelected(evidence)"
                                                      d="M96.76 33.5l-.02.236c-.039.467-.074.935-.107 1.404-.018.265-.036.532-.057.797-.017.191-.037.381-.058.572a12.22 12.22 0 0 1-.249 1.447 5.463 5.463 0 0 1-.325.977 2.209 2.209 0 0 1-.364.582.861.861 0 0 1-.253.2l-.034.014c.046.373.104.745.187 1.111.036.146.077.291.116.437.059.217.116.433.172.651L96 43H75.5l-.014-1.919-.005-.073a1.357 1.357 0 0 1-.191-.125 1.905 1.905 0 0 1-.303-.297 2.705 2.705 0 0 1-.197-.276 4.012 4.012 0 0 1-.37-.776 8.22 8.22 0 0 1-.323-1.143 15.238 15.238 0 0 1-.222-1.377 26.803 26.803 0 0 1-.165-2.386l-.004-.246 8.554-.856c.069.079.141.153.22.221.608.531 1.441.724 2.229.75.184.007.367.004.551-.008.178-.011.356-.031.533-.055.221-.03.44-.068.659-.11.321-.061.64-.132.958-.21a32.947 32.947 0 0 0 1.751-.483l.418-.131h7.181z"
                                                      class="body-area hover_body body-area-neck_or_throat "
                                                      title="Neck or Throat "
                                                      data-toggle="popover"
                                                      data-container="body"
                                                      data-placement="right"
                                                      type="button"
                                                      data-html="true"
                                                      href="#"
                                                      body_part="neck_or_throat "
                                                      id="body-area-neck_or_throat"
                                                      onClick={
                                                        this.attributeSymptomTag
                                                      }
                                                      gender="male"
                                                    ></path>
                                                    <path
                                                      on-evidence-select="bodyModelEvidenceSelected(evidence)"
                                                      d="M96 44s1.315.545 1.943.999c.76.55 1.539 1.074 2.328 1.581 1.915 1.229 3.892 2.358 5.895 3.436C107.668 50.822 111 53 111 53H92.5l-.299-.511c-1.165-1.177-2.523-2.227-4.115-2.746a6.687 6.687 0 0 0-1.931-.329c-.13-.001-.13-.001-.26.002a6.535 6.535 0 0 0-1.23.159c-1.141.265-2.189.844-3.089 1.586a10.193 10.193 0 0 0-1.109 1.082L80 53H60.5l11.332-6.496c.134-.063.271-.119.405-.182.712-.339 1.403-.738 2.014-1.239A70.547 70.547 0 0 0 75.5 44H96z"
                                                      class="body-area hover_body body-area-nape_of_neck "
                                                      title="Nape of Neck "
                                                      data-toggle="popover"
                                                      data-container="body"
                                                      data-placement="right"
                                                      type="button"
                                                      data-html="true"
                                                      href="#"
                                                      body_part="nape_of_neck"
                                                      id="body-area-nape_of_neck"
                                                      onClick={
                                                        this.attributeSymptomTag
                                                      }
                                                      gender="male"
                                                    ></path>
                                                    <path
                                                      on-evidence-select="bodyModelEvidenceSelected(evidence)"
                                                      d="M80.5 54l.559-.908a8.264 8.264 0 0 1 1.281-1.262 6.959 6.959 0 0 1 1.705-1.011 5.501 5.501 0 0 1 1.35-.362 5.333 5.333 0 0 1 1.656.049c1.431.271 2.699 1.09 3.77 2.047.177.158.348.321.517.487L92 54h21.893l.625-.412c.57.095 1.137.203 1.698.337.615.145 1.222.319 1.822.516l1.259.523-.895 3.724c-.451 2.323-.787 4.667-1.064 7.016-.335 2.839-.58 5.689-.771 8.541-.214 3.19-.36 6.385-.452 9.582l-.09 6.867-.197 1.243a65.684 65.684 0 0 1-1.024 4.77 100.786 100.786 0 0 1-1.071 3.863c-.392 1.308-.798 2.613-1.192 3.921a53.35 53.35 0 0 0-.798 2.913c-.104.438-.193.879-.278 1.322-.091.474-.178.949-.258 1.426a30.12 30.12 0 0 0-.341 2.71 20.75 20.75 0 0 0-.046 2.217l.18.921H60c.039-1.316.076-3.136-.022-4.452-.05-.67-.115-1.339-.193-2.007-.031-.273-.061-.548-.103-.821-.132-.873-.336-1.735-.542-2.593a176.916 176.916 0 0 0-.835-3.28c-.454-1.721-.916-3.442-1.37-5.164l-.931-3.732.008-7.349c-.05-3.854-.161-7.708-.358-11.558a188.114 188.114 0 0 0-.719-9.637c-.27-2.618-.605-5.232-1.09-7.818a54.318 54.318 0 0 0-.479-2.295l-.285-1.107.56-.207L55.5 54h25z"
                                                      class="body-area hover_body body-area-back "
                                                      title="Back"
                                                      data-toggle="popover"
                                                      data-container="body"
                                                      data-placement="right"
                                                      type="button"
                                                      data-html="true"
                                                      href="#"
                                                      body_part="back"
                                                      id="body-area-back"
                                                      onClick={
                                                        this.attributeSymptomTag
                                                      }
                                                      gender="male"
                                                    ></path>
                                                    <path
                                                      on-evidence-select="bodyModelEvidenceSelected(evidence)"
                                                      d="M52.106 54.546l.8 3.463c.455 2.483.775 4.99 1.034 7.5.29 2.813.496 5.633.655 8.456.182 3.249.3 6.502.367 9.755l.043 7.438-.166.541c-.424 1.285-.922 2.556-1.584 3.738-.161.288-.332.571-.518.844-.134.199-.278.389-.415.585-.081.118-.159.237-.237.357-.396.631-.75 1.289-1.083 1.955a49.457 49.457 0 0 0-1.072 2.299 85.585 85.585 0 0 0-2.333 5.954l-.511 1.556c-2.179-1.872-4.877-3.051-7.642-3.768a27.838 27.838 0 0 0-1.507-.346 31.1 31.1 0 0 0-1.739-.298 34.913 34.913 0 0 0-2.393-.258l-2.143-.083.637-.76c.249-.289.507-.57.758-.857.1-.119.199-.237.296-.359a7.79 7.79 0 0 0 .68-1.013c.431-.771.734-1.61.982-2.456.255-.873.453-1.764.624-2.657.071-.373.135-.748.202-1.121.054-.293.054-.293.11-.585.136-.67.285-1.336.451-1.999a51.859 51.859 0 0 1 1.245-4.153c.296-.865.611-1.724.935-2.578.247-.653.5-1.303.746-1.956.073-.196.145-.392.213-.589.065-.192.136-.388.17-.588.017-.099.019-.201.023-.3.011-.248.018-.497.023-.745.011-.616.013-1.233.014-1.85a466.82 466.82 0 0 0-.04-6.034l-.013-1.069-.006-.419c.009-.161.02-.321.032-.481.045-.513.113-1.024.205-1.531.443-2.44 1.406-4.77 2.608-6.928.4-.717.829-1.418 1.284-2.101.454-.682.934-1.347 1.441-1.992.336-.428.681-.852 1.066-1.237a11.019 11.019 0 0 1 1.561-1.282 17.3 17.3 0 0 1 2.842-1.548l1.355-.5zm68.087.79c1.293.531 2.522 1.236 3.683 2.033.422.289.834.589 1.237.902.323.25.644.503.949.774.369.329.715.682 1.038 1.056 1.385 1.602 2.343 3.538 3.039 5.526a29.89 29.89 0 0 1 1.179 4.554c.311 1.71.503 3.442.595 5.177.05.924.072 1.85.06 2.777-.006.464-.022.93-.049 1.393-.025.414-.058.826-.114 1.236-.032.24-.087.475-.133.712a8.535 8.535 0 0 0-.125 2.162c.027.358.077.715.16 1.065l.01.034.549 1.341.483 1.212c.487 1.244.969 2.491 1.385 3.761.139.424.272.852.379 1.285.067.271.135.552.124.833.053.343.109.685.167 1.027.5 2.875 1.178 5.776 2.56 8.368l.03.05a24.757 24.757 0 0 0-12.275 4.716l-1.235 1.043-.261-.869a82.558 82.558 0 0 0-1.556-4.227 74.576 74.576 0 0 0-1.443-3.398c-.234-.508-.484-1.009-.729-1.511-.168-.35-.334-.701-.5-1.052l-2.389-5.278.022-4.71c.062-3.465.18-6.929.371-10.389.157-2.833.362-5.663.642-8.486.271-2.732.612-5.456 1.078-8.162.272-1.577.593-3.149.995-4.698l.074-.257z"
                                                      class="body-area hover_body body-area-upper_arm "
                                                      body_part="upper_arm "
                                                      id="body-area-upper_arm"
                                                      title="Upper Arm "
                                                      data-toggle="popover"
                                                      data-container="body"
                                                      data-placement="right"
                                                      type="button"
                                                      data-html="true"
                                                      href="#"
                                                      onClick={
                                                        this.attributeSymptomTag
                                                      }
                                                      gender="male"
                                                    ></path>
                                                    <path
                                                      on-evidence-select="bodyModelEvidenceSelected(evidence)"
                                                      d="M30.886 105.211l2.844.103c.778.058 1.554.14 2.327.251.645.092 1.287.204 1.924.338.488.103.973.218 1.453.348 2.542.686 5.019 1.784 7.038 3.501l.279.259-.103.314c-.113.379-.221.761-.315 1.146-.055.226-.113.457-.135.689-.005.049-.002.096-.001.146.002.069.001.088 0 .158a5.332 5.332 0 0 1-.012.251c-.035.443-.107.881-.196 1.317-.09.441-.198.879-.319 1.313-.16.581-.344 1.155-.557 1.718-.182.483-.386.96-.632 1.415a6.405 6.405 0 0 1-.269.452c-.083.127-.174.249-.259.375-.077.121-.154.244-.228.367-.275.462-.533.935-.785 1.409-.289.546-.57 1.095-.85 1.645l-.065.132-.629.025a36.28 36.28 0 0 1-1.582-.014c-3.483-.109-6.994-.754-10.157-2.258-.474-.225-.939-.47-1.393-.733a18.134 18.134 0 0 1-1.742-1.15 13.936 13.936 0 0 1-2.148-1.961l.16-.58c.052-.177.107-.354.163-.531.627-1.903 1.532-3.701 2.573-5.409 1.077-1.768 2.299-3.439 3.616-5.036zm107.086-1.646l.409.678c.704 1.052 1.484 2.051 2.232 3.072.147.203.294.405.438.608.901 1.275 1.758 2.586 2.51 3.956.491.893.935 1.813 1.328 2.754l.222.616a21.15 21.15 0 0 1-3.629 2.71 23.012 23.012 0 0 1-4.962 2.183c-1.969.606-4.012.96-6.067 1.087-.875.054-1.753.067-2.629.037l-.41-.035-.833-1.453a21.513 21.513 0 0 1-.273-.495 9.765 9.765 0 0 1-.423-.896 7.48 7.48 0 0 1-.346-1.114 11.481 11.481 0 0 1-.251-2.015c-.016-.3-.019-.601-.029-.901a15.553 15.553 0 0 0-.025-.381c-.098-1.044-.325-2.072-.587-3.086l-.438-1.454 1.792-1.508a23.825 23.825 0 0 1 8.566-3.845 22.66 22.66 0 0 1 3.405-.518z"
                                                      class="body-area hover_body body-area-elbow "
                                                      body_part="elbow "
                                                      id="body-area-elbow"
                                                      title="Elbow"
                                                      data-toggle="popover"
                                                      data-container="body"
                                                      data-placement="right"
                                                      type="button"
                                                      data-html="true"
                                                      href="#"
                                                      onClick={
                                                        this.attributeSymptomTag
                                                      }
                                                      gender="male"
                                                    ></path>
                                                    <path
                                                      on-evidence-select="bodyModelEvidenceSelected(evidence)"
                                                      d="M111.026 117l.219 1.891c.12.695.261 1.385.401 2.076.113.558.224 1.116.334 1.674l.197 1.029c.119.638.236 1.276.341 1.916.064.383.125.768.167 1.154l.006.076a396.211 396.211 0 0 0 .126 3.429c.08 1.765.174 3.528.304 5.288.086 1.164.183 2.328.329 3.487.086.689.19 1.376.297 2.062l.146.903a42.432 42.432 0 0 0-3.031-.538 103.65 103.65 0 0 0-5.827-.668c-2.452-.22-4.91-.381-7.368-.507a243.623 243.623 0 0 0-7.449-.268l-.468-.008c-.182.247-.361.495-.553.734a9.759 9.759 0 0 1-.759.836 6.346 6.346 0 0 1-.271.247c-.54.465-1.194.868-1.921.925a2.264 2.264 0 0 1-.8-.085 2.781 2.781 0 0 1-.721-.334 4.25 4.25 0 0 1-.845-.721 6.527 6.527 0 0 1-.904-1.266c-.058-.11-.113-.222-.169-.332l-.671.001-.363.001c-5.362.04-10.718.405-16.045 1.017-2.912.335-5.818.739-8.71 1.259.396-1.852.587-3.736.762-5.616.128-1.436.246-2.871.373-4.307.171-1.875.363-3.748.634-5.612.081-.566.17-1.131.268-1.695.096-.557.201-1.113.296-1.67a54.645 54.645 0 0 0 .658-5.616L60 117h51.026z"
                                                      class="body-area hover_body body-area-lower_back "
                                                      title="Lower Back"
                                                      data-toggle="popover"
                                                      data-container="body"
                                                      data-placement="right"
                                                      type="button"
                                                      data-html="true"
                                                      href="#"
                                                      body_part="lower_back"
                                                      id="body-area-lower_back"
                                                      onClick={
                                                        this.attributeSymptomTag
                                                      }
                                                      gender="male"
                                                    ></path>
                                                    <path
                                                      on-evidence-select="bodyModelEvidenceSelected(evidence)"
                                                      d="M145.474 116.257c.56 1.472.983 2.972 1.363 4.478.437 1.74.817 3.495 1.175 5.254.198.971.386 1.945.581 2.917.098.478.196.955.298 1.432.629 2.934 1.343 5.85 2.185 8.729a89.92 89.92 0 0 0 1.473 4.595c.249.708.511 1.412.785 2.111l.425 1.047-.645.555c-2.236 1.691-4.781 2.991-7.506 3.673l-1.567.264-.509-1.631c-.36-.967-.79-1.907-1.261-2.824a42.561 42.561 0 0 0-1.93-3.347 71.976 71.976 0 0 0-2.499-3.676c-.367-.506-.739-1.009-1.111-1.511a60.424 60.424 0 0 1-2.258-3.318 62.962 62.962 0 0 1-2.574-4.501 87.302 87.302 0 0 1-1.497-3.039c-.541-1.152-1.063-2.315-1.596-3.471-.145-.309-.29-.618-.437-.926l-.43-.833 2.768-.02a26.887 26.887 0 0 0 6.819-1.347 23.567 23.567 0 0 0 5.786-2.894 19.32 19.32 0 0 0 2.162-1.717zm-121.41 1.632l1.188 1.113c.693.571 1.428 1.09 2.196 1.555.501.303 1.016.584 1.543.843 3.407 1.674 7.216 2.377 10.99 2.474l1.533.005-1.658 3.315c-.236.467-.473.933-.712 1.397-.203.387-.402.775-.622 1.153a36.615 36.615 0 0 1-1.331 2.086c-.631.931-1.282 1.848-1.941 2.759a273.59 273.59 0 0 1-4.519 6.031c-.388.507-.777 1.011-1.167 1.517-.289.374-.581.748-.866 1.125-.094.126-.187.255-.278.385-.576.833-1.085 1.71-1.578 2.594-.43.775-.844 1.558-1.273 2.333-.142.255-.284.508-.438.755-.073.115-.154.225-.227.34a3.465 3.465 0 0 0-.1.18l-.144.41-2.783-.679c-1.732-.516-3.428-1.192-4.986-2.113a12.273 12.273 0 0 1-1.807-1.279l.374-.712c1.658-3.342 3.009-6.836 4.09-10.406.29-.959.561-1.924.807-2.896.18-.706.344-1.418.517-2.127.125-.508.251-1.017.378-1.524a513.151 513.151 0 0 1 2.068-7.934l.746-2.7z"
                                                      class="body-area hover_body body-area-forearm "
                                                      body_part="forearm "
                                                      id="body-area-forearm"
                                                      title="Forearm"
                                                      data-toggle="popover"
                                                      data-container="body"
                                                      data-placement="right"
                                                      type="button"
                                                      data-html="true"
                                                      href="#"
                                                      onClick={
                                                        this.attributeSymptomTag
                                                      }
                                                      gender="male"
                                                    ></path>
                                                    <path
                                                      on-evidence-select="bodyModelEvidenceSelected(evidence)"
                                                      d="M52.533 164.288l.536-2.874c.124-.58.254-1.158.388-1.736.103-.437.209-.874.309-1.311.078-.344.155-.689.229-1.033.238-1.11.456-2.224.665-3.339.311-1.668.603-3.339.911-5.007a99.04 99.04 0 0 1 .771-3.815l.453-1.846 1.958-.349a170.9 170.9 0 0 1 7.089-.966c3.188-.366 6.386-.644 9.59-.816a130.75 130.75 0 0 1 6.773-.196l.002.005a8.118 8.118 0 0 0 .668.96c.672.821 1.561 1.536 2.63 1.728.178.032.358.05.538.051.29.003.579-.034.859-.106a4.148 4.148 0 0 0 1.098-.469c.823-.493 1.49-1.201 2.082-1.947.084-.108.084-.107.167-.217 2.457.05 4.913.14 7.367.265 2.446.126 4.89.286 7.33.505 1.845.165 3.689.363 5.523.625 1.201.172 2.4.369 3.597.652l.068.417c.389 2.346.801 4.687 1.215 7.027.756 4.258 1.523 8.515 2.279 12.772l.121.706-1.551 2.939a17.471 17.471 0 0 1-2.288 2.841 17.094 17.094 0 0 1-2.042 1.748 17.8 17.8 0 0 1-1.702 1.097c-.431.245-.872.472-1.321.682-2.976 1.391-6.259 2.013-9.524 2.175-.607.03-1.214.044-1.821.044-.783 0-1.567-.033-2.347-.11a18.363 18.363 0 0 1-1.808-.267 14.585 14.585 0 0 1-1.542-.396l-.147-.057c.548-1.152.816-2.43.842-3.71.031-1.529-.28-3.071-.954-4.447-.682-1.391-1.748-2.621-3.13-3.346a5.756 5.756 0 0 0-2.841-.664 5.785 5.785 0 0 0-2.487.664c-1.382.725-2.448 1.956-3.13 3.346-.659 1.344-.971 2.848-.955 4.342a9.697 9.697 0 0 0 .91 4.036l-.716.34c-1.353.558-2.787.901-4.237 1.088a22.967 22.967 0 0 1-4.374.133 20.045 20.045 0 0 1-3.232-.485 20 20 0 0 1-3.649-1.243 21.732 21.732 0 0 1-3.453-1.967c-1.955-1.36-3.696-3.017-5.21-4.853a29.127 29.127 0 0 1-1.65-2.208l-.857-1.408z"
                                                      class="body-area hover_body body-area-buttocks "
                                                      body_part="buttocks "
                                                      id="body-area-buttocks"
                                                      title="Buttocks"
                                                      data-toggle="popover"
                                                      data-container="body"
                                                      data-placement="right"
                                                      type="button"
                                                      data-html="true"
                                                      href="#"
                                                      onClick={
                                                        this.attributeSymptomTag
                                                      }
                                                      gender="male"
                                                    ></path>
                                                    <path
                                                      on-evidence-select="bodyModelEvidenceSelected(evidence)"
                                                      d="M84.725 177.882l-.653-.197c-1.39-.537-2.468-1.683-3.143-2.989-.642-1.241-.943-2.647-.928-4.041.014-1.386.341-2.777 1.006-3.998.666-1.222 1.692-2.289 2.999-2.816.198-.079.401-.146.608-.199a4.762 4.762 0 0 1 1.354-.137c.334.019.664.068.987.155.206.056.408.126.605.209 1.276.535 2.278 1.587 2.933 2.788.65 1.193.977 2.549 1.005 3.903.029 1.398-.259 2.81-.889 4.062-.61 1.211-1.558 2.289-2.788 2.891a4.769 4.769 0 0 1-1.213.406l-.217.019.007-.387.005-.051c-.097-2.544-.204-5.089-.317-7.632a16.563 16.563 0 0 1-.201-.848 5.04 5.04 0 0 1-.028.131l-.026.113c-.006.293-.007.311-.017.637a44.287 44.287 0 0 1-.172 2.601 39.213 39.213 0 0 1-.822 5.027l-.095.353z"
                                                      class="body-area hover_body body-area-anus "
                                                      body_part="anus"
                                                      id="body-area-anus"
                                                      title="Anus"
                                                      data-toggle="popover"
                                                      data-container="body"
                                                      data-placement="right"
                                                      type="button"
                                                      data-html="true"
                                                      href="#"
                                                      onClick={
                                                        this.attributeSymptomTag
                                                      }
                                                      gender="male"
                                                    ></path>
                                                    <path
                                                      on-evidence-select="bodyModelEvidenceSelected(evidence)"
                                                      d="M154.137 147.795l.029.073c.113.305.224.611.335.918.361 1.008.712 2.019 1.073 3.027.069.191.137.382.211.571.04.105.079.21.128.311.143.292.331.563.551.802.14.152.292.29.449.424.158.129.322.252.482.38.541.443 1.062.91 1.582 1.377a98.368 98.368 0 0 1 1.939 1.774l.081.077.019.025c.054.055.107.11.162.164.206.202.414.403.617.608.323.327.636.663.903 1.038.186.26.351.541.459.843.046.131.082.266.104.403.012.081.016.164.03.246.009.046.021.092.033.138.067.233.16.459.262.68.101.22.212.436.328.648.317.584.669 1.149 1.037 1.702l.056.083c.08.091.159.183.235.276.056.071.111.142.164.214a4.682 4.682 0 0 1 .33.516c.032.057.06.116.087.175.16.354.254.782.096 1.154a.877.877 0 0 1-.276.372.888.888 0 0 1-.163.097 2.534 2.534 0 0 1-.83.238 2.556 2.556 0 0 1-.799-.044 3.45 3.45 0 0 1-1.211-.545c-.514-.351-.956-.801-1.346-1.285a7.565 7.565 0 0 1-.594-.839l-.151-.169.313 1.478c.123.522.26 1.042.39 1.564l.191.806c.181.787.353 1.574.513 2.365a86.453 86.453 0 0 1 .754 4.348 33.325 33.325 0 0 1 .175 1.377c.017.163.033.325.044.488.009.117.013.233.011.35 0 .084-.004.168-.01.253-.043.533-.223 1.102-.662 1.441-.057.044-.12.082-.185.116l-.02.009c-.025.008-.047.019-.072.026a1.32 1.32 0 0 1-.536-.004c-.497-.111-.88-.491-1.168-.891a5.322 5.322 0 0 1-.437-.731 8.646 8.646 0 0 1-.258-.552 13.134 13.134 0 0 1-.293-.742 20.106 20.106 0 0 1-.31-.926l-.019-.059c.102 1.055.205 2.111.327 3.163.063.546.138 1.09.205 1.634l.046.448c.017.222.032.444.038.667a7.376 7.376 0 0 1-.04 1.068 5.552 5.552 0 0 1-.053.339 3.712 3.712 0 0 1-.069.295c-.122.441-.349.916-.78 1.127l-.027.012c-.037.01-.072.024-.109.031-.095.016-.198.003-.293-.007a2.424 2.424 0 0 1-.96-.311c-.699-.406-1.143-1.151-1.324-1.923-.025-.123-.039-.249-.057-.373a136.58 136.58 0 0 0-.185-1.199c-.343-2.113-.738-4.221-1.323-6.282l-.027-.091.26 7.879-.005-.02a8.4 8.4 0 0 1 .187 1.129c.035.381.044.773-.021 1.152a1.887 1.887 0 0 1-.297.774 1.188 1.188 0 0 1-.491.408c-.116.051-.24.083-.363.111-.431.096-.89.075-1.282-.146-.374-.209-.635-.564-.814-.946-.27-.572-.378-1.2-.471-1.821a73.294 73.294 0 0 1-.23-1.74 321.062 321.062 0 0 1-.685-6.193l-.045-.44a50.106 50.106 0 0 0-.387 2.031c-.124.716-.24 1.435-.319 2.157-.026.236-.039.473-.057.711-.012.141-.012.14-.028.281a8.74 8.74 0 0 1-.44 1.951c-.06.164-.13.324-.21.478-.095.18-.207.354-.349.5a1.215 1.215 0 0 1-.301.233c-.326.173-.727.144-1.058.005a1.82 1.82 0 0 1-.519-.333 2.133 2.133 0 0 1-.648-1.087c-.078-.337-.037-.684-.008-1.024.042-.491.096-.981.151-1.47.15-1.315.317-2.629.514-3.937.034-.222.068-.444.104-.665.039-.235.082-.47.119-.705l.039-.288c.036-.329.064-.66.04-.991a1.929 1.929 0 0 0-.032-.252.585.585 0 0 0-.038-.136l.011.018-.053-.108c-.042-.122-.081-.244-.121-.367a25.7 25.7 0 0 1-.69-2.965 58.57 58.57 0 0 1-.463-3.062 112.91 112.91 0 0 1-.687-7.573 109.98 109.98 0 0 1-.1-1.986c-.016-.387-.024-.774-.045-1.16a13.042 13.042 0 0 0-.029-.394l-.219-1.256 1.294-.244c2.889-.675 5.596-2.012 7.974-3.775l.61-.52zM8.548 182.982h-.437c-.463-.052-.913-.268-1.191-.649a1.41 1.41 0 0 1-.228-.49c-.03-.128-.04-.26-.031-.391.003-.054.01-.093.017-.146.032-.204.067-.407.103-.61.261-1.46.536-2.918.81-4.376l.268-2.363-.02.048c-.321.653-.646 1.305-.98 1.951-.169.326-.339.651-.519.97a7.061 7.061 0 0 1-.178.303 1.34 1.34 0 0 1-.233.301c-.03.027-.067.05-.101.073a3.085 3.085 0 0 1-.206.128c-.33.187-.727.31-1.103.189a.968.968 0 0 1-.414-.267 1.174 1.174 0 0 1-.191-.283 1.611 1.611 0 0 1-.147-.491c-.042-.32-.014-.652.019-.973.05-.498.13-.994.217-1.488a71.4 71.4 0 0 1 .523-2.58l.148-.681c.018-.079.05-.233.069-.332.013-.068.025-.135.041-.203.018-.07.019-.069.038-.138.054-.167.117-.332.182-.495.139-.34.281-.678.419-1.019.301-.755.568-1.522.79-2.305.147-.521.155-1.494.007-1.352-.374.358-.775.703-1.225.964-.304.176-.635.309-.99.325a1.695 1.695 0 0 1-.363-.021c-.627-.107-1.124-.573-1.412-1.12a2.285 2.285 0 0 1-.102-.219 1.484 1.484 0 0 1-.128-.548c0-.087.011-.184.048-.265.011-.025.021-.053.037-.076.058-.086.126-.16.193-.24.14-.174.278-.348.415-.525.351-.458.694-.923 1.007-1.408.115-.177.226-.356.327-.542.067-.123.133-.248.176-.381.018-.057.023-.118.035-.179.014-.059.014-.058.03-.116.114-.336.323-.621.536-.901.188-.238.38-.472.568-.711.288-.372.561-.756.776-1.177.065-.128.124-.26.177-.395.03-.075.055-.153.087-.227a1.92 1.92 0 0 1 .065-.128c.19-.321.454-.593.719-.853.363-.352.747-.683 1.139-1.001.611-.5 1.239-.98 1.875-1.446.495-.363.995-.721 1.505-1.061l.075-.048c.133-.248.251-.503.37-.758.155-.329.306-.661.456-.993.415-.915.821-1.833 1.223-2.752.066-.131.143-.254.214-.382l.187-.332.362-.691a14.85 14.85 0 0 0 1.639 1.137c1.597.965 3.339 1.68 5.12 2.225l2.991.748-.229 1.213c-.156 1.125-.217 2.263-.239 3.398-.008.392-.008.785-.012 1.178-.004.214-.004.213-.01.426-.074 1.735-.346 3.453-.706 5.149a48.463 48.463 0 0 1-1.127 4.326l-.026.078c-.298.796-.596 1.591-.896 2.385-.082.22-.223.546-.306.821-.013.045-.022.091-.031.137-.064.367-.069.741-.072 1.112-.004.392 0 .784-.002 1.177-.002.157-.005.314-.01.47l-.014.326c-.002.119-.002.119-.002.239.011.645.065 1.288.121 1.93.055.646.117 1.291.174 1.936l.048.633c.011.198.021.394.018.591a6.885 6.885 0 0 1-.272 1.764 3.597 3.597 0 0 1-.249.637c-.08.152-.174.298-.293.421a1.129 1.129 0 0 1-.525.304c-.571.15-1.184-.096-1.57-.524a2.101 2.101 0 0 1-.462-.884 3.039 3.039 0 0 1-.08-.454c-.016-.197-.023-.395-.038-.593-.078-1.002-.216-2-.328-2.998-.017-.17-.035-.338-.049-.508-.01-.138-.02-.276-.022-.414-.001-.093.006-.186.008-.279a5.09 5.09 0 0 0-.009-.248 29.03 29.03 0 0 0-.223-2.123c-.1.785-.202 1.569-.307 2.354-.048.355-.097.709-.149 1.063a9.696 9.696 0 0 1-.05.305c-.016.073-.033.147-.047.221-.039.211-.074.422-.11.632-.183 1.107-.361 2.214-.548 3.321-.061.352-.123.705-.188 1.058a6.266 6.266 0 0 1-.213.851c-.212.613-.563 1.2-1.083 1.601-.07.054-.142.104-.218.15-.455.278-1.043.425-1.548.199a1.25 1.25 0 0 1-.265-.159 1.485 1.485 0 0 1-.304-.324 1.765 1.765 0 0 1-.228-.473l-.005-.018c-.017-.098-.017-.098-.015-.198l.398-3.335c.027-.755.043-1.512.072-2.266.007-.148.017-.294.027-.441.07-.855.222-1.698.343-2.546.03-.233.059-.465.086-.699.066-.594.121-1.189.166-1.784l-.01.019c-.026.054-.037.078-.066.132-.021.042-.048.083-.066.127-.026.065-.046.131-.067.198-.137.449-.25.906-.365 1.363-.136.549-.268 1.1-.4 1.651-.318 1.34-.627 2.681-.949 4.021-.054.224-.11.449-.166.674-.065.246-.129.49-.226.726-.051.126-.111.25-.176.369-.29.532-.727 1.025-1.304 1.247l-.39.101z"
                                                      class="body-area hover_body body-area-hand "
                                                      body_part="hand "
                                                      id="body-area-hand"
                                                      title="Hand"
                                                      data-toggle="popover"
                                                      data-container="body"
                                                      data-placement="right"
                                                      type="button"
                                                      data-html="true"
                                                      href="#"
                                                      onClick={
                                                        this.attributeSymptomTag
                                                      }
                                                      gender="male"
                                                    ></path>
                                                    <path
                                                      on-evidence-select="bodyModelEvidenceSelected(evidence)"
                                                      d="M52.254 165.782l.059.1c.6.923 1.256 1.809 1.956 2.658 1.517 1.84 3.255 3.506 5.2 4.89 1.979 1.408 4.173 2.513 6.504 3.205 1.17.347 2.371.591 3.584.728a22.3 22.3 0 0 0 2.991.131 23.93 23.93 0 0 0 2.056-.127c1.762-.187 3.511-.586 5.143-1.283l.641-.346c.647 1.07 1.566 2.002 2.698 2.595.228.12.465.226.707.315l.677.189-.298 1.117c-.174.578-.37 1.148-.552 1.724-.019.064-.04.127-.053.191-.025.142-.043.286-.065.428-.039.228-.039.228-.082.455a45.5 45.5 0 0 1-.876 3.587 111.378 111.378 0 0 1-1.188 3.923c-.466 1.45-.954 2.894-1.458 4.332a156.975 156.975 0 0 1-1.478 4.055c-.172.454-.346.906-.526 1.356-.078.196-.158.391-.235.587-.089.234-.089.234-.176.469a73.85 73.85 0 0 0-.976 2.964c-.31 1.006-.608 2.015-.901 3.025a332.594 332.594 0 0 0-2.301 8.38 262.942 262.942 0 0 0-1.441 5.722 95.884 95.884 0 0 0-.448 1.963c-.104.482-.208.966-.279 1.454-.026.18-.034.361-.054.541-.017.137-.034.274-.054.409a38.327 38.327 0 0 1-.603 3.058 50.864 50.864 0 0 1-1.013 3.736l-.306.852-1.327-.151c-4.43-.599-8.826-1.487-13.124-2.717a74.558 74.558 0 0 1-4.703-1.51l-.058-.024.593-3.85.436-3.049c.101-.71.21-1.419.307-2.13.151-1.175.238-2.356.286-3.54.039-.978.053-1.958.048-2.937a68.332 68.332 0 0 0-.297-6.154c-.058-.602-.132-1.199-.206-1.798-.026-.231-.026-.231-.049-.463-.1-1.086-.16-2.176-.211-3.265a203.282 203.282 0 0 1-.117-3.025 492.27 492.27 0 0 1-.194-9.011 534.943 534.943 0 0 1-.052-7.277c.001-.674.003-1.349.009-2.022.005-.5.008-.999.027-1.498.026-.704.077-1.407.14-2.109a77.47 77.47 0 0 1 .343-3.079c.161-1.247.345-2.491.543-3.732l.753-4.042zm65.792-.086l.37 2.151c.031.198.061.397.09.595.237 1.753.322 3.524.331 5.291a84.82 84.82 0 0 1-.18 5.615c-.31 4.981-.906 9.939-1.435 14.9-.09.859-.179 1.719-.266 2.579-.632 6.283-1.171 12.577-1.469 18.886a224 224 0 0 0-.163 4.336c-.019.707-.038 1.416-.043 2.125-.006.74.003 1.48.028 2.22a37.32 37.32 0 0 0 .43 4.694 128.54 128.54 0 0 1-12.283 2.892c-2.168.398-4.347.739-6.549 1.002a41.558 41.558 0 0 1-1.362-4.469 29.697 29.697 0 0 1-.481-2.475c-.064-.429-.114-.859-.167-1.288a307.478 307.478 0 0 0-.382-2.939c-.47-3.446-.981-6.887-1.566-10.315a163.854 163.854 0 0 0-.849-4.611 66.852 66.852 0 0 0-.873-3.854 29.142 29.142 0 0 0-.271-.973c-.115-.385-.241-.767-.357-1.152a83.522 83.522 0 0 1-.25-.854 137.288 137.288 0 0 1-1.39-5.37 235.819 235.819 0 0 1-1.881-8.521 88.085 88.085 0 0 1-.256-1.342c-.075-.413-.152-.828-.196-1.246-.041-.542-.089-1.083-.13-1.625a54.828 54.828 0 0 1-.133-2.563l.008-.448.593-.07a5.79 5.79 0 0 0 1.45-.534c1.188-.623 2.142-1.619 2.798-2.772a12.87 12.87 0 0 0 2.134.581c.346.065.694.12 1.043.166.452.06.907.104 1.362.135a27.95 27.95 0 0 0 2.067.056 38.232 38.232 0 0 0 1.552-.044c3.47-.172 6.958-.852 10.104-2.366.468-.225.927-.468 1.375-.729a18.725 18.725 0 0 0 1.776-1.173 18.042 18.042 0 0 0 2.133-1.869 18.432 18.432 0 0 0 2.381-3.021l.907-1.601z"
                                                      class="body-area hover_body body-area-thigh "
                                                      body_part="thigh "
                                                      id="body-area-thigh"
                                                      title="Thigh"
                                                      data-toggle="popover"
                                                      data-container="body"
                                                      data-placement="right"
                                                      type="button"
                                                      data-html="true"
                                                      href="#"
                                                      onClick={
                                                        this.attributeSymptomTag
                                                      }
                                                      gender="male"
                                                    ></path>
                                                    <path
                                                      on-evidence-select="bodyModelEvidenceSelected(evidence)"
                                                      d="M121 297h-9.5l-.496-2.036a53.637 53.637 0 0 0-.624-3.72 83.262 83.262 0 0 0-.897-3.975l-.029-.114-.005-.027a67.105 67.105 0 0 0-.264-.977 98.078 98.078 0 0 0-1.874-5.869 158.202 158.202 0 0 0-2.15-5.738c-.304-.771-.614-1.539-.93-2.306-.232-.566-.474-1.127-.703-1.694-.08-.203-.159-.407-.235-.613-1.084-2.93-1.735-6.01-2.093-9.111a43.97 43.97 0 0 1-.259-3.264 21.078 21.078 0 0 1-.001-2.177c.024-.324.053-.647.077-.971.191-2.729.201-5.477-.087-8.2-.231-2.182-.654-4.357-1.429-6.415-.433-1.121-.876-2.238-1.312-3.359l-.925-2.49c2.157-.261 4.27-.594 6.373-.98a128.683 128.683 0 0 0 12.243-2.879l.083.588a39.117 39.117 0 0 0 1.711 6.26 64.65 64.65 0 0 0 1.21 3.056c.291.692.593 1.379.884 2.072.055.133.108.268.16.403.344.922.619 1.866.865 2.818.264 1.021.493 2.051.701 3.085.5 2.482.889 4.988 1.196 7.5.24 1.961.43 3.929.538 5.903.044.84.075 1.682.076 2.523a21.68 21.68 0 0 1-.088 2.207c-.02.212-.046.424-.079.635-.036.222-.081.444-.12.667-.037.228-.073.457-.107.687-.306 2.105-.508 4.225-.703 6.343l-.056.19-.039.052c.05.054.089.118.113.187.026.081.021.104.025.186-.047.931-.095 1.863-.144 2.793-.213 3.966-.445 7.93-.666 11.896-.054.978-.107 1.958-.157 2.937a167 167 0 0 0-.08 1.731c-.024.636-.036 1.27-.005 1.905L121 297zm-68 0H42.5l-.137-.556c.032-.539.053-1.079.05-1.619l.002-.021-.002-.008.056-1.134c.147-3.551.177-7.107.131-10.661a261.319 261.319 0 0 0-.354-10.586c-.079-1.495-.171-2.99-.275-4.484-.049-.699-.104-1.398-.152-2.096-.023-.36-.023-.36-.043-.721a48.728 48.728 0 0 1-.037-3.586c.097-3.448.554-6.882 1.263-10.256a76.97 76.97 0 0 1 2.993-10.409 81.796 81.796 0 0 1 2.462-6.036c.123-.272.254-.544.373-.819.027-.065.049-.13.073-.195.166-.512.281-1.04.39-1.567.146-.708.273-1.42.394-2.133l.058-.375 3.39 1.153c4.428 1.344 8.969 2.315 13.547 2.979l2.08.255-.202.561c-.252.601-.53 1.203-.898 1.745a3.862 3.862 0 0 1-.28.37c-.09.104-.19.199-.28.304a4.522 4.522 0 0 0-.136.174 7.03 7.03 0 0 0-.681 1.223 16.98 16.98 0 0 0-.617 1.597c-.26.769-.482 1.549-.683 2.335-.198.77-.373 1.546-.529 2.326-.03.157.014.319.022.477.017.348.032.697.047 1.045.176 4.601.131 9.22-.379 13.8-.374 3.366-.997 6.722-2.057 9.942a33.286 33.286 0 0 1-2.294 5.369c-.222.419-.451.834-.673 1.254-.07.135-.138.271-.205.407a55.21 55.21 0 0 0-.792 1.85 97.47 97.47 0 0 0-1.122 2.88c-.948 2.552-1.802 5.139-2.498 7.771l-.057.134-.054.067a.495.495 0 0 1 .013.115c0 .068-.007.084-.022.15-.092.297-.185.593-.275.89-.395 1.331-.733 2.68-.938 4.055-.127.844-.212 1.202-.172 2.034z"
                                                      class="body-area hover_body body-area-lower_leg "
                                                      body_part="lower_leg  "
                                                      id="body-area-lower_leg"
                                                      title="Lower Leg "
                                                      data-toggle="popover"
                                                      data-container="body"
                                                      data-placement="right"
                                                      type="button"
                                                      data-html="true"
                                                      href="#"
                                                      onClick={
                                                        this.attributeSymptomTag
                                                      }
                                                      gender="male"
                                                    ></path>
                                                    <path
                                                      on-evidence-select="bodyModelEvidenceSelected(evidence)"
                                                      d="M121.5 298l-.014 1.054c.14.694.321 1.378.544 2.049.083.253.171.504.265.753.064.172.129.345.201.515.068.16.143.317.218.473.178.358.368.709.546 1.065.144.296.281.596.391.906.138.39.234.794.277 1.207.024.237.034.475.016.713-.033.448-.14.89-.269 1.32-.168.561-.369 1.112-.549 1.668-.046.146-.091.292-.134.439-.08.289-.15.581-.183.88-.025.241-.026.486.033.723.053.199.109.398.161.597.173.677.323 1.361.375 2.058a6.396 6.396 0 0 1-.256 2.392 7.687 7.687 0 0 1-.192.553 3.685 3.685 0 0 1-.206.452c-.144.255-.33.485-.541.685a4.287 4.287 0 0 1-1.191.775c-.57.26-1.181.428-1.797.541-.737.136-1.491.193-2.241.18a7.996 7.996 0 0 1-1.457-.136 5.943 5.943 0 0 1-2.165-.912 5.108 5.108 0 0 1-1.068-.965 3.77 3.77 0 0 1-.765-1.499 3.27 3.27 0 0 1-.083-.893c.011-.195.042-.388.061-.582.01-.117.018-.234.025-.35.025-.487.029-.975.023-1.463l-.037-.004a5.658 5.658 0 0 1-.502-.086 4.624 4.624 0 0 1-.985-.338 4.614 4.614 0 0 1-2.194-2.246c-.015-.034-.014-.034-.026-.068-.038-.135-.065-.273-.094-.411-.04-.197-.074-.395-.103-.594-.167-1.164-.125-2.404.393-3.479.07-.146.149-.288.236-.424a3.93 3.93 0 0 1 1.891-1.563c.128-.05.263-.101.399-.127a10.38 10.38 0 0 1-.144-1.041 6.696 6.696 0 0 1 .138-2.06c.074-.312.173-.618.296-.915.06-.147.134-.287.195-.433.02-.052.038-.104.055-.157L111.5 298h10zM53 298l.122.888c.029.152.067.301.103.451.038.152.072.304.107.456.041.189.08.378.116.568.145.767.252 1.545.256 2.327.002.436-.02.886-.146 1.307a5.033 5.033 0 0 1-.072.193c-.057.149-.112.299-.167.449-.078.219-.153.438-.226.659.291.074.581.158.871.238.355.108.69.269.997.479a3.797 3.797 0 0 1 1.051 1.086c.094.148.178.302.251.461.524 1.137.498 2.448.267 3.654-.04.208-.085.417-.136.623l-.044.15a3.938 3.938 0 0 1-.288.683 3.486 3.486 0 0 1-1.257 1.336 3.491 3.491 0 0 1-.77.342 4.066 4.066 0 0 1-.458.11l.01.117c.038.481.009.969-.099 1.44a4.182 4.182 0 0 1-.802 1.666 3.313 3.313 0 0 1-.566.569 3.862 3.862 0 0 1-.826.467 7.958 7.958 0 0 1-1.122.379c-.593.157-1.199.264-1.807.34-.672.083-1.349.125-2.025.129a15.24 15.24 0 0 1-2.757-.221 11.16 11.16 0 0 1-.659-.138 3.3 3.3 0 0 1-.402-.117 2.217 2.217 0 0 1-.709-.439c-.369-.34-.628-.772-.817-1.233-.252-.618-.385-1.28-.469-1.94a17.706 17.706 0 0 1-.12-2.457c.013-1.105.093-2.209.207-3.308.074-.726.168-1.451.246-2.177.007-.073.014-.147.016-.22-.002-.139-.026-.276-.048-.413-.047-.26-.098-.52-.145-.78a8.96 8.96 0 0 1-.128-1.201 6.22 6.22 0 0 1 .536-2.734c.079-.177.17-.347.253-.522.039-.083.038-.083.075-.165.23-.55.393-1.121.518-1.703L42.5 298H53z"
                                                      class="body-area hover_body body-area-foot "
                                                      body_part="foot  "
                                                      id="body-area-foot"
                                                      title="Foot"
                                                      data-toggle="popover"
                                                      data-container="body"
                                                      data-placement="right"
                                                      type="button"
                                                      data-html="true"
                                                      href="#"
                                                      onClick={
                                                        this.attributeSymptomTag
                                                      }
                                                      gender="male"
                                                    ></path>
                                                  </g>
                                                </svg>
                                              </div>
                                              {/* <img src="../images/patient/img/Patient Intake Process/man_img.png" /> */}
                                              <p>
                                                {translate(
                                                  "Click on the body model"
                                                )}
                                              </p>
                                            </div>{" "}
                                            <div
                                              class="rotate_model"
                                              value="Click"
                                              onClick={this.switchVisible}
                                            >
                                              <img src="../images/patient/img/Patient Intake Process/rotatemodel.svg" />
                                              <p>{translate("Rotate Model")}</p>
                                            </div>
                                          </div>
                                        </div>
                                             )
                                  : (
<div
                                          class="symptoms_part"
                                          id="fem_body"
                                        >
                                          <div class="symptom_body_img">
                                            <div class="man_img">
                                              <div id="svg_figure">
                                                {/* <!--front body--> */}
                                                <svg
                                                  xmlns="http://www.w3.org/2000/svg"
                                                  class="female-front-s"
                                                  id="female_front"
                                                  fill-rule="evenodd"
                                                  stroke-linejoin="round"
                                                  stroke-miterlimit="1.414"
                                                  viewBox="0 0 168 320"
                                                >
                                                  <g>
                                                    <path d="M 79.422 2.089 a 3.09 3.09 0 0 1 0.187 -0.143 c 0.383 -0.272 0.812 -0.48 1.243 -0.665 a 19.026 19.026 0 0 1 2.28 -0.792 c 0.244 -0.07 0.489 -0.137 0.735 -0.201 c 0.216 -0.057 0.434 -0.112 0.653 -0.154 a 8.094 8.094 0 0 1 1.212 -0.131 c 0.149 -0.003 0.149 -0.003 0.3 -0.003 a 8.8 8.8 0 0 1 1.179 0.097 c 1.005 0.152 1.979 0.477 2.899 0.905 c 1.233 0.575 2.376 1.333 3.434 2.183 c 0.366 0.294 0.722 0.601 1.068 0.918 a 21.416 21.416 0 0 1 1.826 1.876 l 0.044 0.052 c 0.092 0.08 0.091 0.08 0.182 0.162 c 0.105 0.099 0.105 0.098 0.208 0.198 c 0.309 0.306 0.601 0.627 0.871 0.968 c 0.814 1.027 1.439 2.193 1.931 3.404 c 0.769 1.896 1.221 3.912 1.512 5.933 a 45.14 45.14 0 0 1 0.41 4.912 a 65.096 65.096 0 0 1 -0.034 4.9 c -0.147 3.394 -0.51 6.779 -1.032 10.135 c -0.121 0.774 -0.252 1.545 -0.389 2.316 l -0.012 0.12 a 0.912 0.912 0 0 1 -0.064 0.224 l -0.031 0.055 l -0.001 0.001 c -0.018 0.023 -0.035 0.048 -0.055 0.069 a 0.512 0.512 0 0 1 -0.714 0.028 c -0.058 -0.053 -0.065 -0.073 -0.107 -0.138 v -0.001 c -0.032 -0.074 -0.045 -0.093 -0.055 -0.173 c -0.012 -0.1 0.009 -0.196 0.026 -0.293 c 0.001 -0.068 -0.005 -0.136 -0.01 -0.203 l -0.004 -0.046 c -0.035 0.182 -0.072 0.364 -0.109 0.545 a 40.857 40.857 0 0 1 -1.278 4.588 c -0.034 0.1 -0.076 0.214 -0.114 0.314 c -0.027 0.07 -0.055 0.142 -0.089 0.21 c -0.016 0.034 -0.037 0.06 -0.058 0.092 l -0.003 0.004 c -0.053 0.059 -0.053 0.059 -0.115 0.11 l -0.003 0.001 c -0.062 0.036 -0.076 0.049 -0.146 0.069 a 0.518 0.518 0 0 1 -0.321 -0.013 c -0.025 -0.01 -0.049 -0.023 -0.074 -0.035 l -0.001 -0.001 c -0.023 -0.016 -0.049 -0.031 -0.07 -0.049 a 0.503 0.503 0 0 1 -0.149 -0.204 c -0.01 -0.027 -0.017 -0.054 -0.025 -0.082 l -0.001 -0.003 c -0.007 -0.056 -0.015 -0.107 -0.008 -0.163 c 0.009 -0.075 0.031 -0.147 0.042 -0.222 c 0.005 -0.049 0.008 -0.097 0.009 -0.146 a 3.993 3.993 0 0 0 -0.104 -0.85 c -0.09 0.241 -0.19 0.477 -0.298 0.708 c -0.098 0.206 -0.205 0.41 -0.325 0.604 a 3.032 3.032 0 0 1 -0.37 0.496 c -0.226 0.245 -0.528 0.446 -0.875 0.428 a 0.852 0.852 0 0 1 -0.358 -0.103 a 0.957 0.957 0 0 1 -0.207 -0.155 a 1.36 1.36 0 0 1 -0.234 -0.318 c -0.097 -0.179 -0.157 -0.372 -0.223 -0.565 c -0.053 -0.156 -0.068 -0.196 -0.124 -0.353 c -0.064 -0.176 -0.13 -0.351 -0.197 -0.526 a 34.88 34.88 0 0 0 -0.74 -1.735 c -0.005 0.168 -0.007 0.237 -0.009 0.399 c -0.001 0.068 -0.001 0.134 -0.005 0.201 c -0.011 0.099 -0.018 0.198 -0.026 0.297 c -0.043 0.779 -0.005 1.563 0.102 2.335 c 0.212 1.546 0.705 3.058 1.503 4.401 c 0.549 0.923 1.238 1.76 2.038 2.477 c 0.939 0.842 2.021 1.513 3.171 2.028 c 0.599 0.27 1.217 0.494 1.844 0.689 c 0.059 0.023 0.119 0.044 0.179 0.064 c 0.707 0.232 1.445 0.371 2.183 0.463 c 1.124 0.142 2.261 0.169 3.392 0.115 c 0.269 -0.013 0.538 -0.03 0.806 -0.053 c 0.219 -0.017 0.436 -0.041 0.655 -0.058 a 8.434 8.434 0 0 1 1.782 0.076 c 1.754 0.27 3.387 1.093 4.784 2.168 c 0.385 0.296 0.755 0.614 1.106 0.951 c 0.225 0.215 0.445 0.438 0.648 0.675 c 0.286 0.336 0.545 0.696 0.792 1.061 c 0.376 0.555 0.721 1.129 1.041 1.718 a 22.374 22.374 0 0 1 2.336 6.736 c 0.206 1.178 0.311 2.37 0.331 3.567 c 0.006 0.753 0.01 1.506 0.019 2.26 c 0.018 1.367 0.043 2.735 0.111 4.1 c 0.051 1.032 0.124 2.065 0.27 3.088 c 0.093 0.65 0.219 1.295 0.359 1.937 c 0.195 0.883 0.407 1.761 0.624 2.638 c 0.457 1.832 0.932 3.66 1.425 5.482 c 0.507 1.874 1.03 3.745 1.597 5.603 c 0.222 0.726 0.452 1.453 0.698 2.172 c 0.189 0.55 0.384 1.103 0.622 1.635 c 0.133 0.298 0.281 0.59 0.429 0.88 c 0.218 0.426 0.444 0.847 0.673 1.266 c 0.522 0.959 1.061 1.91 1.603 2.857 c 1.504 2.626 3.055 5.225 4.579 7.839 c 0.145 0.25 0.29 0.5 0.429 0.752 c 0.03 0.057 0.062 0.114 0.086 0.173 c 0.058 0.142 0.107 0.292 0.157 0.436 c 0.094 0.271 0.192 0.561 0.282 0.831 c 0.249 0.747 0.491 1.495 0.729 2.245 a 158.78 158.78 0 0 1 1.566 5.233 c 0.13 0.466 0.258 0.933 0.382 1.4 c 0.122 0.457 0.237 0.917 0.359 1.376 c 0.063 0.233 0.128 0.466 0.194 0.699 a 71.464 71.464 0 0 0 1.566 4.728 c 0.427 1.164 0.874 2.32 1.336 3.469 c 0.467 1.162 0.95 2.317 1.447 3.465 c 0.37 0.86 0.745 1.718 1.149 2.563 a 72.947 72.947 0 0 0 1.56 3.051 a 101.7 101.7 0 0 0 1.88 3.35 c 0.053 0.089 0.106 0.178 0.161 0.266 l 0.03 0.049 l 0.004 0.009 c 0.776 0.107 1.529 0.351 2.243 0.667 c 0.341 0.15 0.67 0.32 0.999 0.493 c 0.571 0.3 1.138 0.61 1.693 0.94 c 0.561 0.334 1.117 0.685 1.629 1.093 c 0.347 0.275 0.69 0.586 0.92 0.97 c 0.063 0.106 0.117 0.217 0.157 0.333 c 0.024 0.072 0.039 0.145 0.06 0.219 l 0.047 0.155 c 0.026 0.072 0.051 0.145 0.08 0.216 c 0.148 0.366 0.339 0.71 0.58 1.024 c 0.108 0.141 0.23 0.266 0.352 0.393 c 0.091 0.096 0.182 0.192 0.271 0.289 c 0.186 0.204 0.186 0.204 0.371 0.41 c 0.428 0.484 0.846 0.976 1.261 1.472 l 0.16 0.193 c 0.055 0.067 0.056 0.065 0.103 0.137 a 1.3 1.3 0 0 1 0.128 0.269 c 0.122 0.328 0.152 0.695 0.019 1.024 c -0.07 0.175 -0.183 0.33 -0.325 0.455 c -0.327 0.292 -0.778 0.416 -1.204 0.465 a 2.607 2.607 0 0 1 -0.459 0.016 c -0.89 -0.038 -1.709 -0.49 -2.35 -1.088 a 4.789 4.789 0 0 1 -0.436 -0.465 l -0.018 -0.023 l -0.042 -0.062 a 19.09 19.09 0 0 0 -0.164 -0.283 l -0.182 -0.29 l -0.038 -0.057 c 0.122 0.487 0.27 0.972 0.467 1.436 c 0.128 0.303 0.284 0.593 0.429 0.888 c 0.622 1.277 1.228 2.561 1.845 3.84 c 0.38 0.78 0.76 1.56 1.153 2.334 c 0.258 0.506 0.519 1.01 0.795 1.504 c 0.095 0.17 0.192 0.338 0.293 0.504 c 0.069 0.112 0.141 0.221 0.208 0.334 c 0.049 0.087 0.049 0.086 0.096 0.173 a 3.7 3.7 0 0 1 0.211 0.498 c 0.123 0.377 0.166 0.786 0.072 1.176 c -0.104 0.438 -0.38 0.829 -0.76 1.07 c -0.16 0.102 -0.343 0.181 -0.533 0.201 a 1.376 1.376 0 0 1 -0.718 -0.142 a 2.692 2.692 0 0 1 -0.606 -0.396 a 5.263 5.263 0 0 1 -0.636 -0.648 c -0.427 -0.508 -0.788 -1.071 -1.121 -1.645 c -0.19 -0.328 -0.368 -0.663 -0.552 -0.995 c -0.134 -0.237 -0.134 -0.237 -0.27 -0.473 a 26.482 26.482 0 0 0 -1.607 -2.455 l -0.066 -0.086 c 0.276 0.827 0.539 1.658 0.818 2.483 c 0.113 0.334 0.228 0.667 0.349 0.997 c 0.047 0.125 0.093 0.249 0.143 0.374 c 0.035 0.086 0.069 0.175 0.113 0.257 c 0.02 0.038 0.045 0.072 0.066 0.108 c 0.024 0.047 0.048 0.094 0.07 0.142 c 0.11 0.244 0.203 0.496 0.296 0.747 c 0.09 0.245 0.178 0.492 0.263 0.74 c 0.187 0.536 0.368 1.073 0.549 1.611 c 0.147 0.437 0.288 0.879 0.445 1.312 c 0.014 0.036 0.015 0.035 0.033 0.074 c 0.04 0.105 0.064 0.217 0.084 0.328 a 3.775 3.775 0 0 1 0.056 0.602 c 0.006 0.535 -0.109 1.115 -0.502 1.506 a 1.388 1.388 0 0 1 -0.544 0.333 a 1.313 1.313 0 0 1 -0.445 0.062 a 1.486 1.486 0 0 1 -0.487 -0.105 c -0.39 -0.153 -0.717 -0.442 -0.989 -0.756 a 5.308 5.308 0 0 1 -1.029 -1.889 c -0.032 -0.104 -0.059 -0.208 -0.093 -0.311 a 13.351 13.351 0 0 0 -0.09 -0.26 c -0.238 -0.646 -0.5 -1.283 -0.772 -1.915 a 60.473 60.473 0 0 0 -0.783 -1.742 a 41.239 41.239 0 0 0 -0.853 -1.726 a 18.322 18.322 0 0 0 -0.86 -1.496 c 0.018 0.119 0.043 0.25 0.065 0.368 c 0.042 0.218 0.042 0.217 0.086 0.434 c 0.095 0.443 0.194 0.886 0.293 1.328 c 0.446 1.972 0.908 3.939 1.377 5.906 c 0.027 0.084 0.052 0.171 0.076 0.256 c 0.136 0.5 0.241 1.014 0.25 1.534 c 0.006 0.311 -0.022 0.628 -0.129 0.921 a 1.451 1.451 0 0 1 -0.246 0.435 a 1.195 1.195 0 0 1 -0.229 0.215 c -0.36 0.258 -0.85 0.305 -1.267 0.175 a 1.702 1.702 0 0 1 -0.575 -0.319 c -0.35 -0.289 -0.597 -0.688 -0.79 -1.094 c -0.233 -0.491 -0.395 -1.014 -0.535 -1.539 c -0.075 -0.288 -0.141 -0.578 -0.214 -0.867 c -0.069 -0.258 -0.14 -0.516 -0.211 -0.773 c -0.441 -1.562 -0.898 -3.12 -1.346 -4.68 c -0.14 -0.494 -0.28 -0.989 -0.417 -1.484 c -0.055 -0.211 -0.111 -0.422 -0.163 -0.635 l -0.001 -0.004 a 4.274 4.274 0 0 0 -0.096 0.615 c -0.015 0.246 -0.024 0.493 -0.034 0.739 c -0.055 1.445 -0.101 2.89 -0.154 4.335 c -0.017 0.433 -0.034 0.867 -0.058 1.3 c -0.011 0.184 -0.017 0.37 -0.047 0.552 c -0.06 0.357 -0.197 0.714 -0.444 0.982 c -0.129 0.14 -0.286 0.25 -0.463 0.318 a 1.207 1.207 0 0 1 -1.045 -0.105 c -0.238 -0.15 -0.406 -0.385 -0.524 -0.636 c -0.169 -0.357 -0.252 -0.751 -0.309 -1.139 a 10.31 10.31 0 0 1 -0.089 -1.022 c -0.014 -0.329 -0.011 -0.661 -0.013 -0.991 c -0.003 -0.717 -0.005 -1.434 -0.012 -2.152 c -0.005 -0.4 -0.012 -0.801 -0.021 -1.201 a 36.17 36.17 0 0 0 -0.089 -1.889 c -0.016 -0.2 -0.036 -0.4 -0.064 -0.599 a 2.19 2.19 0 0 0 -0.084 -0.408 c -0.016 -0.048 -0.04 -0.094 -0.061 -0.138 c -0.152 -0.313 -0.321 -0.617 -0.48 -0.925 a 18.31 18.31 0 0 1 -0.865 -1.993 c -0.491 -1.368 -0.811 -2.796 -1.003 -4.237 a 27.028 27.028 0 0 1 -0.196 -2.165 c -0.025 -0.492 -0.033 -0.985 -0.051 -1.478 c -0.011 -0.276 -0.011 -0.275 -0.025 -0.55 c -0.063 -1.092 -0.167 -2.184 -0.385 -3.256 c -0.157 -0.767 -0.369 -1.532 -0.708 -2.242 a 5.582 5.582 0 0 0 -0.428 -0.752 c -0.147 -0.215 -0.309 -0.419 -0.46 -0.632 c -0.042 -0.062 -0.081 -0.126 -0.121 -0.19 c -0.25 -0.413 -0.496 -0.829 -0.743 -1.244 c -0.932 -1.573 -1.859 -3.148 -2.787 -4.722 c -1.083 -1.84 -2.165 -3.679 -3.245 -5.518 l -10.169 -17.514 a 14.712 14.712 0 0 1 -0.682 -1.529 c -0.3 -0.776 -0.549 -1.574 -0.722 -2.389 a 12.477 12.477 0 0 1 -0.131 -0.72 c -0.023 -0.157 -0.038 -0.314 -0.063 -0.471 a 4.734 4.734 0 0 0 -0.052 -0.264 a 13.79 13.79 0 0 0 -0.336 -1.163 a 38.824 38.824 0 0 0 -0.45 -1.295 c -0.43 -1.179 -0.893 -2.344 -1.365 -3.506 a 299.407 299.407 0 0 0 -2.958 -6.986 c -0.45 -1.032 -0.905 -2.06 -1.354 -3.092 c -0.218 -0.511 -0.427 -1.027 -0.64 -1.541 l -1.423 -3.456 a 82.428 82.428 0 0 0 -0.645 3.515 c -0.164 1.085 -0.314 2.171 -0.468 3.258 c -0.301 2.138 -0.6 4.276 -0.88 6.418 a 245.649 245.649 0 0 0 -0.442 3.524 c -0.078 0.654 -0.151 1.309 -0.217 1.964 c -0.038 0.379 -0.074 0.759 -0.1 1.139 c -0.11 1.6 -0.135 3.209 -0.023 4.809 c 0.055 0.783 0.142 1.564 0.283 2.336 c 0.125 0.692 0.29 1.379 0.531 2.04 c 0.092 0.249 0.194 0.495 0.311 0.734 c 0.126 0.259 0.267 0.51 0.401 0.765 a 67.526 67.526 0 0 1 3.304 7.593 c 0.834 2.294 1.543 4.637 2.045 7.028 c 0.163 0.774 0.303 1.554 0.416 2.337 c 0.104 0.722 0.182 1.448 0.265 2.172 c 0.119 1.032 0.233 2.066 0.343 3.1 c 0.365 3.419 0.69 6.842 0.986 10.267 a 541.12 541.12 0 0 1 0.788 10.334 c 0.044 0.675 0.09 1.349 0.123 2.024 c 0.02 0.401 0.035 0.804 0.047 1.206 c 0.033 1.126 0.047 2.251 0.053 3.378 c 0.008 1.26 0.006 2.52 -0.001 3.779 a 710.654 710.654 0 0 1 -0.112 8.882 c -0.111 6.065 -0.261 12.129 -0.43 18.193 c -0.085 3.082 -0.185 6.165 -0.259 9.247 c -0.007 0.402 -0.006 0.805 -0.008 1.208 c -0.004 3.069 0.021 6.138 0.121 9.206 c 0.036 1.127 0.083 2.256 0.151 3.382 c 0.049 0.785 0.104 1.57 0.191 2.353 c 0.054 0.476 0.121 0.951 0.199 1.424 c 0.278 1.688 0.702 3.348 1.204 4.982 c 0.397 1.292 0.85 2.564 1.283 3.844 c 0.085 0.254 0.167 0.506 0.247 0.76 c 0.117 0.386 0.221 0.775 0.335 1.162 l 0.512 1.713 c 0.245 0.831 0.484 1.664 0.707 2.503 c 0.958 3.595 1.679 7.28 1.797 11.007 c 0.022 0.847 0.045 1.695 0.069 2.542 c 0.164 5.596 0.344 11.193 0.511 16.789 c 0.055 1.862 0.108 3.723 0.159 5.585 c 0.053 2.009 0.104 4.018 0.144 6.027 c 0.026 1.366 0.054 2.733 0.046 4.099 c -0.002 0.241 -0.004 0.482 -0.012 0.723 c -0.005 0.158 -0.013 0.318 -0.017 0.477 l 0.002 0.288 c 0.011 0.318 0.034 0.636 0.08 0.952 c 0.096 0.674 0.278 1.333 0.525 1.967 c 0.144 0.371 0.311 0.732 0.488 1.088 c 0.141 0.282 0.291 0.559 0.432 0.841 c 0.037 0.078 0.075 0.157 0.11 0.236 c 0.056 0.134 0.104 0.269 0.132 0.412 c 0.018 0.136 0.026 0.274 0.037 0.411 c 0.053 0.669 0.103 1.339 0.141 2.01 c 0.024 0.457 0.045 0.915 0.049 1.373 c 0.001 0.126 0.001 0.251 -0.002 0.377 c -0.003 0.095 -0.01 0.189 -0.011 0.285 c 0 0.062 0.003 0.123 0.007 0.184 c 0.043 0.474 0.149 0.941 0.263 1.402 a 26.8 26.8 0 0 0 0.495 1.726 c 0.23 0.72 0.482 1.434 0.755 2.139 c 0.211 0.543 0.437 1.081 0.663 1.619 c 0.438 1.042 0.887 2.079 1.324 3.12 c 0.094 0.226 0.186 0.452 0.276 0.68 c 0.064 0.165 0.128 0.329 0.18 0.497 c 0.027 0.088 0.047 0.177 0.073 0.265 c 0.082 0.266 0.164 0.532 0.244 0.798 c 0.238 0.828 0.452 1.68 0.485 2.546 c 0.02 0.486 -0.018 0.998 -0.226 1.445 a 1.602 1.602 0 0 1 -0.624 0.711 a 1.214 1.214 0 0 1 -0.5 0.177 c -0.13 0.025 -0.261 0.041 -0.394 0.045 a 1.477 1.477 0 0 1 -0.458 -0.053 c -0.03 0.025 -0.062 0.047 -0.094 0.069 c -0.411 0.288 -0.916 0.489 -1.424 0.401 a 1.3 1.3 0 0 1 -0.202 -0.051 c -0.197 0.327 -0.474 0.606 -0.838 0.737 a 1.33 1.33 0 0 1 -0.252 0.064 c -0.19 0.03 -0.386 0.025 -0.576 -0.005 a 1.977 1.977 0 0 1 -0.562 -0.179 c -0.25 0.351 -0.598 0.657 -1.036 0.717 a 1.47 1.47 0 0 1 -0.403 -0.005 a 1.812 1.812 0 0 1 -0.453 -0.125 a 1.9 1.9 0 0 1 -0.945 -0.869 a 2.162 2.162 0 0 1 -0.068 -0.156 c -0.039 0.054 -0.08 0.107 -0.122 0.159 a 2.38 2.38 0 0 1 -0.855 0.68 c -0.278 0.123 -0.58 0.175 -0.882 0.168 c -0.163 -0.003 -0.323 -0.03 -0.484 -0.039 c -0.062 -0.002 -0.123 -0.003 -0.185 -0.007 a 5.012 5.012 0 0 1 -0.893 -0.145 c -0.607 -0.157 -1.219 -0.443 -1.609 -0.953 a 1.884 1.884 0 0 1 -0.224 -0.373 c -0.046 -0.103 -0.08 -0.21 -0.121 -0.314 l -0.068 -0.152 c -0.133 -0.27 -0.304 -0.515 -0.461 -0.771 c -0.042 -0.071 -0.041 -0.07 -0.082 -0.143 a 2.713 2.713 0 0 1 -0.195 -0.461 a 2.835 2.835 0 0 1 -0.104 -0.88 c 0.021 -0.62 0.055 -1.24 0.085 -1.859 c 0.039 -0.752 0.075 -1.505 0.127 -2.256 c 0.01 -0.153 0.022 -0.316 0.035 -0.47 c 0.012 -0.131 0.025 -0.262 0.034 -0.394 a 3.3 3.3 0 0 0 -0.036 -0.727 a 3.759 3.759 0 0 0 -0.249 -0.81 a 5.884 5.884 0 0 0 -0.213 -0.446 c -0.049 -0.094 -0.101 -0.185 -0.148 -0.28 a 1.884 1.884 0 0 1 -0.056 -0.13 c -0.135 -0.357 -0.201 -0.737 -0.253 -1.112 a 17.775 17.775 0 0 1 -0.134 -1.492 a 41.769 41.769 0 0 1 -0.059 -2.001 c -0.006 -0.674 0 -1.348 0.016 -2.022 a 24.474 24.474 0 0 0 -0.124 -0.536 a 15.449 15.449 0 0 0 -0.232 -0.857 a 5.122 5.122 0 0 0 -0.237 -0.659 c -0.031 -0.07 -0.07 -0.135 -0.107 -0.202 l -0.031 -0.065 a 2.557 2.557 0 0 1 -0.144 -0.731 a 8.884 8.884 0 0 1 -0.021 -0.711 c 0.003 -0.758 0.06 -1.516 0.129 -2.269 l 0.016 -0.166 l 0.011 -0.112 a 22.569 22.569 0 0 0 -0.014 -0.448 a 46.056 46.056 0 0 0 -0.468 -4.555 a 59.46 59.46 0 0 0 -0.24 -1.473 c -0.054 -0.31 -0.111 -0.616 -0.18 -0.922 a 30.105 30.105 0 0 0 -0.387 -1.503 a 78.373 78.373 0 0 0 -0.611 -2.06 c -0.513 -1.65 -1.057 -3.29 -1.617 -4.924 c -0.775 -2.26 -1.57 -4.512 -2.383 -6.758 a 428.154 428.154 0 0 0 -1.617 -4.397 c -0.216 -0.577 -0.439 -1.152 -0.659 -1.728 a 75.64 75.64 0 0 1 -0.277 -0.763 c -0.91 -2.611 -1.605 -5.296 -2.174 -8.001 a 78.076 78.076 0 0 1 -0.635 -3.384 a 48.365 48.365 0 0 1 -0.446 -3.372 c -0.081 -0.945 -0.149 -1.891 -0.225 -2.836 a 68.754 68.754 0 0 0 -0.228 -2.17 c -0.12 -0.981 -0.243 -1.962 -0.371 -2.942 a 35.377 35.377 0 0 0 -0.538 -3.154 a 19.362 19.362 0 0 0 -0.576 -2.033 c -0.609 -1.765 -1.488 -3.419 -2.318 -5.086 l -0.186 -0.392 a 21.571 21.571 0 0 1 -0.565 -1.353 a 21.896 21.896 0 0 1 -0.982 -3.469 a 19.15 19.15 0 0 1 -0.361 -2.834 c -0.005 -0.164 -0.041 -0.327 -0.063 -0.49 l -0.175 -1.326 a 791.24 791.24 0 0 1 -0.996 -7.859 c -0.126 -1.057 -0.25 -2.115 -0.359 -3.174 c -0.034 -0.335 -0.068 -0.67 -0.097 -1.004 c -0.028 -0.316 -0.048 -0.632 -0.078 -0.949 a 56.596 56.596 0 0 0 -0.088 -0.817 c -0.147 -1.263 -0.32 -2.521 -0.498 -3.78 a 403.19 403.19 0 0 0 -0.747 -5.01 a 367.68 367.68 0 0 0 -0.75 -4.663 c -0.16 -0.947 -0.319 -1.896 -0.509 -2.837 l -0.05 -0.233 c -0.18 -0.777 -0.364 -1.553 -0.544 -2.331 c -0.928 -4.018 -1.849 -8.038 -2.771 -12.057 l -0.536 -2.337 c -0.023 -0.116 -0.046 -0.232 -0.067 -0.349 c -0.176 -1.034 -0.214 -2.083 -0.289 -3.127 c -0.018 -0.213 -0.036 -0.426 -0.057 -0.638 a 7.954 7.954 0 0 0 -0.189 -1.116 a 3 3 0 0 0 -0.265 -0.703 a 1.528 1.528 0 0 0 -0.153 -0.235 c -0.077 -0.1 -0.163 -0.192 -0.241 -0.29 c -0.063 -0.079 -0.123 -0.161 -0.184 -0.242 c -0.518 -0.726 -0.957 -1.503 -1.372 -2.291 a 4.61 4.61 0 0 1 -0.058 0.224 a 6.816 6.816 0 0 1 -0.696 1.56 c -0.251 0.421 -0.532 0.821 -0.798 1.233 a 4.387 4.387 0 0 0 -0.14 0.239 c -0.022 0.044 -0.044 0.087 -0.059 0.133 c -0.011 0.044 -0.001 0.091 -0.001 0.137 l -0.003 0.198 c -0.003 0.232 -0.005 0.28 -0.011 0.52 c -0.02 0.681 -0.048 1.361 -0.105 2.04 c -0.023 0.268 -0.05 0.537 -0.087 0.803 a 5.029 5.029 0 0 1 -0.1 0.529 a 1.804 1.804 0 0 1 -0.07 0.227 c -0.013 0.035 -0.031 0.069 -0.043 0.105 c -0.021 0.074 -0.038 0.149 -0.057 0.224 c -0.133 0.588 -0.244 1.18 -0.356 1.772 c -0.186 0.988 -0.364 1.978 -0.539 2.968 a 580.174 580.174 0 0 0 -1.161 6.836 c -0.387 2.36 -0.764 4.721 -1.115 7.087 c -0.148 0.988 -0.291 1.977 -0.424 2.968 c -0.11 0.818 -0.217 1.637 -0.293 2.459 c -0.054 0.578 -0.09 1.157 -0.126 1.737 c -0.056 0.911 -0.104 1.821 -0.149 2.733 c -0.131 2.646 -0.238 5.294 -0.345 7.942 c -0.156 4.01 -0.304 8.021 -0.46 12.032 c -0.039 0.937 -0.068 1.872 -0.167 2.804 a 19.992 19.992 0 0 1 -0.89 4.205 a 16.794 16.794 0 0 1 -0.93 2.241 c -0.132 0.266 -0.272 0.528 -0.417 0.788 c -0.126 0.229 -0.256 0.456 -0.379 0.688 c -0.065 0.126 -0.121 0.256 -0.181 0.384 c -0.18 0.384 -0.346 0.772 -0.482 1.175 a 14.648 14.648 0 0 0 -0.494 1.947 c -0.139 0.724 -0.24 1.456 -0.323 2.189 c -0.199 1.767 -0.285 3.546 -0.327 5.323 c -0.019 0.813 -0.021 1.625 -0.034 2.438 a 63.38 63.38 0 0 1 -0.032 1.153 c -0.139 3.67 -0.571 7.326 -1.231 10.939 a 80.644 80.644 0 0 1 -0.881 4.21 a 55.441 55.441 0 0 1 -0.813 3.076 c -0.066 0.221 -0.134 0.44 -0.207 0.658 c -0.057 0.172 -0.118 0.342 -0.174 0.513 c -0.097 0.305 -0.192 0.611 -0.286 0.917 a 380.057 380.057 0 0 0 -2.026 6.943 a 418.828 418.828 0 0 0 -2.357 8.622 a 142.41 142.41 0 0 0 -0.716 2.862 a 40.344 40.344 0 0 0 -0.45 2.064 a 28.397 28.397 0 0 0 -0.433 3.608 c -0.04 0.737 -0.051 1.478 -0.02 2.216 c 0.011 0.233 0.025 0.465 0.045 0.696 c 0.008 0.084 0.015 0.162 0.026 0.245 c 0.003 0.034 0.005 0.067 0.012 0.1 c 0.029 0.151 0.06 0.301 0.088 0.452 c 0.039 0.21 0.076 0.421 0.111 0.632 c 0.071 0.455 0.135 0.912 0.164 1.371 c 0.014 0.213 0.02 0.429 0.009 0.644 c -0.01 0.174 -0.032 0.35 -0.089 0.515 c -0.034 0.1 -0.088 0.187 -0.137 0.278 a 3.5 3.5 0 0 0 -0.074 0.166 c -0.188 0.479 -0.3 0.988 -0.392 1.492 l -0.001 0.01 l 0.011 0.506 c 0.005 0.286 0.008 0.572 0.011 0.858 a 52.355 52.355 0 0 1 -0.069 3.243 c -0.025 0.424 -0.059 0.849 -0.114 1.272 c -0.044 0.34 -0.098 0.684 -0.201 1.014 c -0.03 0.092 -0.064 0.185 -0.106 0.274 c -0.05 0.105 -0.11 0.207 -0.158 0.314 a 3.966 3.966 0 0 0 -0.094 0.235 a 4.383 4.383 0 0 0 -0.233 1.226 a 4.233 4.233 0 0 0 -0.006 0.298 c 0.001 0.051 -0.003 0.114 0.007 0.165 c 0.038 0.195 0.081 0.389 0.118 0.585 c 0.054 0.286 0.054 0.285 0.105 0.572 c 0.147 0.889 0.264 1.787 0.279 2.69 c 0.004 0.234 0 0.469 -0.013 0.703 c -0.009 0.168 -0.026 0.335 -0.037 0.503 c -0.005 0.045 -0.005 0.045 -0.014 0.092 c -0.048 0.216 -0.136 0.42 -0.219 0.625 c -0.145 0.349 -0.294 0.696 -0.437 1.046 c -0.079 0.198 -0.158 0.397 -0.232 0.598 l -0.098 0.272 c -0.03 0.07 -0.03 0.069 -0.061 0.137 c -0.067 0.128 -0.144 0.25 -0.236 0.362 c -0.439 0.531 -1.119 0.808 -1.777 0.947 a 4.554 4.554 0 0 1 -0.463 0.075 c -0.095 0.011 -0.189 0.02 -0.284 0.025 c -0.047 0.002 -0.095 0.001 -0.143 0.004 c -0.11 0.01 -0.22 0.022 -0.331 0.031 c -0.12 0.007 -0.24 0.01 -0.36 0.001 a 2.007 2.007 0 0 1 -0.567 -0.125 c -0.377 -0.145 -0.695 -0.408 -0.95 -0.719 a 2.55 2.55 0 0 1 -0.112 -0.145 l -0.006 0.015 a 2.108 2.108 0 0 1 -0.127 0.251 a 1.89 1.89 0 0 1 -1.329 0.872 a 1.51 1.51 0 0 1 -0.403 0.006 c -0.439 -0.061 -0.785 -0.366 -1.036 -0.718 a 1.98 1.98 0 0 1 -0.817 0.201 a 1.533 1.533 0 0 1 -0.621 -0.101 c -0.34 -0.137 -0.603 -0.403 -0.79 -0.717 a 1.284 1.284 0 0 1 -0.201 0.05 c -0.535 0.094 -1.064 -0.132 -1.486 -0.444 l -0.033 -0.025 a 1.246 1.246 0 0 1 -0.401 0.053 c -0.152 0 -0.303 -0.018 -0.452 -0.046 a 1.68 1.68 0 0 1 -0.295 -0.075 a 1.355 1.355 0 0 1 -0.205 -0.103 a 1.617 1.617 0 0 1 -0.624 -0.71 c -0.238 -0.517 -0.255 -1.114 -0.212 -1.671 c 0.056 -0.726 0.224 -1.441 0.421 -2.14 c 0.099 -0.351 0.213 -0.696 0.314 -1.046 l 0.03 -0.117 c 0.128 -0.43 0.309 -0.844 0.48 -1.257 c 0.437 -1.042 0.886 -2.079 1.325 -3.12 c 0.225 -0.536 0.453 -1.07 0.658 -1.614 c 0.345 -0.922 0.641 -1.864 0.888 -2.817 c 0.122 -0.471 0.232 -0.947 0.321 -1.426 c 0.064 -0.343 0.122 -0.689 0.142 -1.038 c 0.015 -0.235 -0.008 -0.471 -0.018 -0.706 a 59.83 59.83 0 0 1 -0.014 -2.993 c 0.004 -0.196 0.009 -0.39 0.019 -0.584 c 0.008 -0.168 0.015 -0.336 0.066 -0.497 c 0.054 -0.17 0.144 -0.326 0.236 -0.478 c 0.096 -0.156 0.197 -0.31 0.293 -0.467 a 5.206 5.206 0 0 0 0.582 -1.327 c 0.185 -0.666 0.235 -1.356 0.227 -2.045 c -0.011 -0.398 -0.035 -0.796 -0.052 -1.192 l -0.059 -1.381 c -0.184 -4.465 -0.354 -8.931 -0.508 -13.398 c -0.151 -4.353 -0.287 -8.707 -0.387 -13.062 c -0.033 -1.412 -0.06 -2.825 -0.078 -4.238 a 128.627 128.627 0 0 1 -0.004 -3.622 c 0.019 -1.055 0.059 -2.109 0.114 -3.162 c 0.082 -1.608 0.201 -3.214 0.361 -4.817 c 0.137 -1.375 0.304 -2.748 0.516 -4.115 c 0.153 -0.978 0.323 -1.957 0.567 -2.918 c 0.213 -0.807 0.438 -1.611 0.653 -2.417 c 0.55 -2.093 1.061 -4.196 1.477 -6.318 c 0.313 -1.588 0.578 -3.189 0.74 -4.8 c 0.103 -1.022 0.157 -2.05 0.184 -3.076 c 0.028 -1.068 0.027 -2.137 0.008 -3.206 c -0.024 -1.335 -0.077 -2.67 -0.152 -4.004 c -0.049 -0.88 -0.107 -1.76 -0.182 -2.638 a 1981.39 1981.39 0 0 0 -1.012 -13.872 c -0.169 -2.183 -0.337 -4.367 -0.546 -6.547 c -0.053 -0.554 -0.119 -1.107 -0.177 -1.66 c -0.062 -0.621 -0.122 -1.241 -0.181 -1.861 c -0.228 -2.46 -0.441 -4.921 -0.642 -7.384 a 645.483 645.483 0 0 1 -0.581 -7.608 c -0.138 -1.954 -0.266 -3.91 -0.365 -5.865 c -0.039 -0.77 -0.073 -1.54 -0.097 -2.31 a 35.844 35.844 0 0 1 -0.02 -1.704 c 0.013 -0.742 0.069 -1.483 0.134 -2.222 c 0.086 -0.977 0.193 -1.951 0.308 -2.925 c 0.285 -2.409 0.618 -4.811 0.955 -7.212 c 0.41 -2.888 0.831 -5.774 1.24 -8.661 c 0.2 -1.424 0.398 -2.847 0.584 -4.274 c 0.087 -0.674 0.163 -1.351 0.255 -2.025 c 0.033 -0.24 0.069 -0.48 0.106 -0.719 c 0.398 -2.447 1.033 -4.848 1.813 -7.198 a 66.32 66.32 0 0 1 2.532 -6.443 a 59.08 59.08 0 0 1 1.491 -3.065 c 0.073 -0.138 0.148 -0.274 0.217 -0.414 c 0.035 -0.074 0.068 -0.147 0.1 -0.222 a 6.66 6.66 0 0 0 0.411 -1.638 c 0.074 -0.57 0.097 -1.145 0.097 -1.718 a 30.4 30.4 0 0 0 -0.135 -2.579 c -0.081 -0.937 -0.183 -1.872 -0.271 -2.809 c -0.051 -0.58 -0.092 -1.16 -0.144 -1.74 a 120.78 120.78 0 0 0 -0.392 -3.5 c -0.149 -1.216 -0.309 -2.43 -0.472 -3.642 a 632.295 632.295 0 0 0 -0.716 -5.18 c -0.144 -1.02 -0.288 -2.04 -0.437 -3.058 a 54.152 54.152 0 0 0 -0.132 -0.822 a 92.854 92.854 0 0 0 -0.482 -2.578 c -1.256 2.937 -2.514 5.874 -3.764 8.814 a 384.597 384.597 0 0 0 -2.749 6.607 c -0.278 0.689 -0.551 1.379 -0.814 2.071 a 31.77 31.77 0 0 0 -0.278 0.763 c -0.056 0.162 -0.112 0.324 -0.155 0.49 c -0.018 0.067 -0.028 0.131 -0.04 0.199 c -0.018 0.104 -0.027 0.151 -0.047 0.255 l -0.089 0.445 a 76.903 76.903 0 0 1 -0.613 2.67 a 55.17 55.17 0 0 1 -0.605 2.266 c -0.021 0.066 -0.021 0.066 -0.045 0.131 a 9.503 9.503 0 0 1 -0.249 0.553 c -0.137 0.279 -0.276 0.557 -0.417 0.834 c -0.422 0.823 -0.856 1.639 -1.292 2.453 a 647.622 647.622 0 0 1 -3.539 6.497 c -3.39 6.16 -6.82 12.298 -10.226 18.449 a 595.729 595.729 0 0 0 -1.822 3.316 a 15.22 15.22 0 0 0 -0.606 1.229 a 10.429 10.429 0 0 0 -0.707 2.401 a 7.924 7.924 0 0 0 -0.116 1.356 c 0.001 0.094 0.01 0.178 0.02 0.273 c 0.016 0.148 0.02 0.191 0.034 0.34 a 22.694 22.694 0 0 1 0.086 2.73 a 20.933 20.933 0 0 1 -0.866 5.37 a 18.402 18.402 0 0 1 -0.626 1.765 a 14.167 14.167 0 0 1 -0.801 1.649 l -0.002 0.004 c 0.009 0.908 0.015 1.817 0.021 2.725 c 0.002 0.562 0.004 1.123 0.004 1.685 c -0.001 0.587 0 1.174 -0.017 1.761 c -0.004 0.158 -0.013 0.316 -0.021 0.475 c -0.012 0.246 -0.024 0.492 -0.042 0.738 a 7.886 7.886 0 0 1 -0.153 1.156 a 3.035 3.035 0 0 1 -0.297 0.828 c -0.14 0.249 -0.337 0.469 -0.594 0.599 a 1.267 1.267 0 0 1 -0.512 0.133 a 1.288 1.288 0 0 1 -0.992 -0.362 c -0.309 -0.313 -0.427 -0.758 -0.45 -1.187 c -0.008 -0.303 -0.016 -0.6 -0.026 -0.907 c -0.061 -1.888 -0.121 -3.776 -0.191 -5.664 a 8.203 8.203 0 0 0 -0.021 -0.31 a 2.177 2.177 0 0 0 -0.119 -0.58 l -0.016 -0.037 a 0.311 0.311 0 0 0 -0.077 0.106 c -0.039 0.071 -0.068 0.146 -0.101 0.219 l -0.015 0.034 c -0.032 0.11 -0.061 0.218 -0.089 0.329 c -0.128 0.498 -0.249 0.997 -0.372 1.497 c -0.467 1.925 -0.925 3.85 -1.393 5.774 c -0.099 0.409 -0.2 0.817 -0.304 1.225 c -0.039 0.152 -0.08 0.305 -0.126 0.457 c -0.042 0.14 -0.089 0.278 -0.14 0.416 c -0.131 0.35 -0.294 0.693 -0.509 1 a 2.365 2.365 0 0 1 -0.537 0.561 a 1.663 1.663 0 0 1 -1.125 0.325 a 1.54 1.54 0 0 1 -0.368 -0.074 a 1.064 1.064 0 0 1 -0.486 -0.361 c -0.255 -0.333 -0.322 -0.776 -0.334 -1.185 a 6.51 6.51 0 0 1 0.122 -1.335 c 0.04 -0.207 0.086 -0.411 0.128 -0.617 l 0.17 -0.822 l 0.384 -1.869 c 0.24 -1.182 0.48 -2.364 0.709 -3.548 c 0.072 -0.375 0.144 -0.752 0.212 -1.128 c 0.05 -0.279 0.1 -0.557 0.136 -0.838 l 0.005 -0.048 c -0.248 0.415 -0.473 0.843 -0.69 1.274 c -0.246 0.492 -0.482 0.989 -0.711 1.488 a 99.293 99.293 0 0 0 -2.227 5.267 c -0.074 0.192 -0.142 0.385 -0.219 0.574 c -0.041 0.096 -0.084 0.19 -0.128 0.284 c -0.319 0.641 -0.787 1.268 -1.473 1.541 c -0.189 0.075 -0.39 0.12 -0.594 0.124 a 1.537 1.537 0 0 1 -0.815 -0.209 a 1.155 1.155 0 0 1 -0.313 -0.296 c -0.266 -0.374 -0.292 -0.863 -0.238 -1.304 a 3.243 3.243 0 0 1 0.117 -0.577 c 0.149 -0.495 0.324 -0.981 0.485 -1.471 l 1.057 -3.192 c 0.281 -0.842 0.56 -1.685 0.843 -2.527 c 0.246 -0.735 0.489 -1.472 0.748 -2.204 c 0.022 -0.062 0.044 -0.125 0.07 -0.186 a 18.72 18.72 0 0 0 -0.539 0.712 c -0.271 0.374 -0.538 0.752 -0.8 1.134 c -0.606 0.882 -1.196 1.777 -1.779 2.674 c -0.331 0.507 -0.656 1.018 -0.991 1.521 l -0.132 0.188 c -0.285 0.378 -0.615 0.744 -1.053 0.946 a 1.621 1.621 0 0 1 -0.761 0.147 c -0.2 -0.01 -0.397 -0.059 -0.583 -0.132 a 1.691 1.691 0 0 1 -0.295 -0.147 a 1.022 1.022 0 0 1 -0.396 -0.511 c -0.113 -0.308 -0.099 -0.648 -0.045 -0.967 c 0.042 -0.257 0.113 -0.509 0.199 -0.757 c 0.092 -0.271 0.202 -0.537 0.325 -0.795 c 0.056 -0.115 0.116 -0.228 0.174 -0.342 l 0.418 -0.818 l 0.943 -1.832 c 0.709 -1.373 1.413 -2.75 2.149 -4.109 c 0.099 -0.182 0.198 -0.365 0.301 -0.544 c 0.048 -0.084 0.102 -0.164 0.149 -0.248 c 0.024 -0.047 0.044 -0.095 0.063 -0.143 c 0.086 -0.223 0.153 -0.452 0.216 -0.68 c 0.067 -0.246 0.128 -0.492 0.187 -0.739 c 0.18 -0.756 0.332 -1.518 0.479 -2.28 l 0.018 -0.091 c -0.183 0.203 -0.283 0.456 -0.405 0.697 a 7.253 7.253 0 0 1 -0.142 0.258 a 5.025 5.025 0 0 1 -0.554 0.744 c -0.526 0.581 -1.184 1.028 -1.877 1.386 c -0.162 0.083 -0.325 0.161 -0.49 0.236 a 3.141 3.141 0 0 1 -0.358 0.143 c -0.254 0.078 -0.521 0.11 -0.786 0.101 a 2.533 2.533 0 0 1 -0.993 -0.24 a 1.988 1.988 0 0 1 -0.513 -0.344 a 1.4 1.4 0 0 1 -0.293 -0.382 a 1.03 1.03 0 0 1 0.068 -1.068 c 0.07 -0.101 0.154 -0.186 0.246 -0.268 c 0.086 -0.068 0.177 -0.13 0.264 -0.197 c 0.266 -0.214 0.509 -0.455 0.745 -0.702 c 0.321 -0.338 0.626 -0.691 0.922 -1.051 c 0.329 -0.4 0.648 -0.808 0.953 -1.226 c 0.186 -0.254 0.371 -0.513 0.532 -0.783 c 0.077 -0.128 0.14 -0.265 0.21 -0.396 c 0.044 -0.077 0.087 -0.154 0.133 -0.23 c 0.092 -0.144 0.188 -0.286 0.293 -0.422 c 0.441 -0.573 0.992 -1.059 1.553 -1.511 c 0.239 -0.191 0.481 -0.377 0.728 -0.559 c 0.201 -0.148 0.402 -0.298 0.611 -0.435 c 0.19 -0.124 0.388 -0.236 0.591 -0.339 c 0.873 -0.447 1.826 -0.731 2.781 -0.937 c 0.498 -0.108 1 -0.197 1.505 -0.266 a 0.443 0.443 0 0 1 0.017 -0.114 c 0.024 -0.091 0.045 -0.114 0.084 -0.18 c 0.033 -0.056 0.059 -0.107 0.089 -0.164 c 0.076 -0.142 0.149 -0.286 0.222 -0.429 a 201.717 201.717 0 0 0 2.183 -4.487 c 0.364 -0.769 0.725 -1.541 1.08 -2.315 c 0.284 -0.617 0.563 -1.237 0.83 -1.861 a 112.785 112.785 0 0 0 2.25 -5.778 c 0.733 -2.031 1.425 -4.08 2.031 -6.154 c 0.139 -0.476 0.274 -0.953 0.401 -1.432 c 0.121 -0.457 0.236 -0.915 0.356 -1.373 l 0.25 -0.919 a 140.928 140.928 0 0 1 1.651 -5.469 c 0.34 -1.049 0.688 -2.097 1.062 -3.134 c 0.025 -0.068 0.05 -0.137 0.078 -0.204 c 0.183 -0.395 0.387 -0.784 0.583 -1.174 c 0.992 -1.957 1.989 -3.91 2.981 -5.867 a 502.238 502.238 0 0 0 2.179 -4.34 c 0.395 -0.799 0.793 -1.597 1.161 -2.408 l 0.096 -0.225 c 0.291 -0.71 0.54 -1.437 0.778 -2.166 c 0.253 -0.776 0.491 -1.558 0.723 -2.341 a 208.645 208.645 0 0 0 1.678 -6.018 c 0.408 -1.536 0.805 -3.075 1.184 -4.617 c 0.178 -0.719 0.349 -1.439 0.507 -2.163 c 0.176 -0.804 0.327 -1.614 0.424 -2.433 c 0.137 -1.145 0.199 -2.297 0.242 -3.449 c 0.049 -1.298 0.07 -2.598 0.082 -3.897 c 0.005 -0.599 0.004 -1.197 0.014 -1.797 a 22.815 22.815 0 0 1 0.358 -3.543 a 22.33 22.33 0 0 1 2.307 -6.569 c 0.318 -0.589 0.665 -1.163 1.041 -1.718 c 0.247 -0.364 0.506 -0.724 0.793 -1.06 c 0.202 -0.238 0.421 -0.461 0.647 -0.676 c 0.314 -0.302 0.642 -0.587 0.985 -0.856 c 1.285 -1.013 2.771 -1.813 4.378 -2.165 a 8.28 8.28 0 0 1 1.85 -0.192 c 0.441 0.004 0.88 0.058 1.319 0.092 c 0.2 0.014 0.4 0.026 0.6 0.037 c 1.533 0.066 3.082 0.005 4.586 -0.314 a 9.82 9.82 0 0 0 1.048 -0.283 c 0.04 -0.014 0.079 -0.032 0.12 -0.045 l 0.249 -0.078 c 1.794 -0.578 3.504 -1.469 4.895 -2.756 a 10.531 10.531 0 0 0 1.984 -2.488 a 11.35 11.35 0 0 0 1.133 -2.786 c 0.027 -0.103 0.054 -0.206 0.078 -0.311 l -0.02 0.025 a 0.596 0.596 0 0 1 -0.595 0.182 c -0.232 -0.057 -0.423 -0.227 -0.588 -0.392 a 4.946 4.946 0 0 1 -0.398 -0.458 a 8.58 8.58 0 0 1 -0.489 -0.694 a 10.171 10.171 0 0 1 -0.306 -0.512 l 0.001 0.026 a 0.546 0.546 0 0 1 -0.109 0.352 a 0.518 0.518 0 0 1 -0.811 0.013 a 1.108 1.108 0 0 1 -0.166 -0.304 c -0.071 -0.168 -0.132 -0.34 -0.193 -0.512 a 47.446 47.446 0 0 1 -0.555 -1.699 a 97.383 97.383 0 0 1 -0.94 -3.211 a 4.214 4.214 0 0 0 -0.047 0.793 l 0.003 0.035 c 0.005 0.051 0.026 0.102 0.04 0.152 l 0.007 0.032 c 0.011 0.061 0.01 0.06 0.013 0.122 v 0.003 c -0.003 0.027 -0.003 0.055 -0.008 0.082 a 0.555 0.555 0 0 1 -0.055 0.154 c -0.124 0.224 -0.404 0.321 -0.64 0.224 a 0.528 0.528 0 0 1 -0.139 -0.086 c -0.021 -0.018 -0.038 -0.039 -0.058 -0.059 l -0.001 -0.002 c -0.014 -0.019 -0.029 -0.037 -0.041 -0.058 a 0.965 0.965 0 0 1 -0.113 -0.338 a 84.142 84.142 0 0 1 -1.862 -7.559 a 62.681 62.681 0 0 1 -0.713 -4.432 a 42.806 42.806 0 0 1 -0.323 -4.395 a 25.952 25.952 0 0 1 0.188 -3.78 c 0.091 -0.69 0.225 -1.374 0.384 -2.051 a 31.737 31.737 0 0 1 3.108 -8.055 c 0.331 -0.595 0.682 -1.178 1.058 -1.745 c 0.29 -0.438 0.594 -0.867 0.913 -1.283 c 0.27 -0.351 0.551 -0.694 0.844 -1.026 c 0.203 -0.228 0.412 -0.451 0.626 -0.668 c 0.21 -0.21 0.424 -0.415 0.647 -0.611 c 1.116 -0.99 2.441 -1.827 3.925 -2.108 c 0.271 -0.052 0.545 -0.082 0.822 -0.095 c 0.1 -0.003 0.2 -0.004 0.301 -0.003 a 5.395 5.395 0 0 1 1.807 0.349 l 0.064 0.025 Z m 12.43 35.572 a 8.452 8.452 0 0 1 -0.678 0.5 c -0.347 0.23 -0.706 0.443 -1.078 0.629 c -0.564 0.282 -1.154 0.511 -1.752 0.707 a 20.371 20.371 0 0 1 -4.34 0.903 a 8.224 8.224 0 0 1 -0.888 0.043 c -0.58 -0.007 -1.161 -0.08 -1.733 -0.173 a 19.434 19.434 0 0 1 -2.25 -0.501 c -0.881 -0.252 -1.75 -0.565 -2.567 -0.981 c -0.299 -0.152 -0.59 -0.318 -0.872 -0.496 a 9.064 9.064 0 0 1 -0.877 -0.627 c 0.107 0.685 0.182 1.375 0.237 2.066 c 0.053 0.675 0.091 1.352 0.094 2.029 c 0.012 0.107 0.019 0.215 0.027 0.323 c 0.045 0.808 0.01 1.62 -0.094 2.422 c -0.251 1.94 -0.911 3.831 -2.007 5.457 a 11.778 11.778 0 0 1 -2.631 2.775 a 13.841 13.841 0 0 1 -3.112 1.764 a 16.325 16.325 0 0 1 -1.39 0.503 c -0.069 0.021 -0.069 0.019 -0.122 0.04 a 8.016 8.016 0 0 1 -0.261 0.089 c -0.789 0.247 -1.606 0.399 -2.427 0.496 a 20.617 20.617 0 0 1 -3.229 0.112 a 21.418 21.418 0 0 1 -1.044 -0.064 c -0.213 -0.017 -0.427 -0.039 -0.641 -0.057 a 7.349 7.349 0 0 0 -1.558 0.068 c -1.585 0.244 -3.057 0.999 -4.318 1.969 a 12.38 12.38 0 0 0 -1.022 0.878 a 8.421 8.421 0 0 0 -0.578 0.602 c -0.205 0.241 -0.394 0.498 -0.576 0.757 a 17.83 17.83 0 0 0 -0.846 1.327 a 21.357 21.357 0 0 0 -2.492 6.787 a 21.778 21.778 0 0 0 -0.341 3.381 c -0.006 0.364 -0.006 0.728 -0.008 1.092 c -0.003 0.45 -0.008 0.9 -0.013 1.349 c -0.019 1.38 -0.044 2.76 -0.112 4.139 a 34.588 34.588 0 0 1 -0.28 3.181 a 26.905 26.905 0 0 1 -0.372 2.01 c -0.195 0.893 -0.41 1.781 -0.631 2.668 a 281.008 281.008 0 0 1 -1.431 5.501 a 178.034 178.034 0 0 1 -1.606 5.635 a 68.879 68.879 0 0 1 -0.709 2.204 c -0.17 0.496 -0.346 0.989 -0.548 1.473 c -0.089 0.213 -0.187 0.423 -0.285 0.633 c -0.18 0.383 -0.364 0.763 -0.549 1.143 c -0.49 1.004 -0.989 2.003 -1.491 3.001 c -1.462 2.907 -2.95 5.803 -4.415 8.709 c -0.091 0.183 -0.184 0.365 -0.269 0.55 c -0.053 0.122 -0.096 0.255 -0.139 0.379 c -0.088 0.246 -0.183 0.522 -0.268 0.767 a 136.906 136.906 0 0 0 -2.207 7.065 c -0.17 0.604 -0.334 1.209 -0.493 1.816 c -0.1 0.385 -0.198 0.77 -0.301 1.155 c -0.088 0.324 -0.179 0.648 -0.271 0.971 a 107.95 107.95 0 0 1 -2.309 6.973 c -0.354 0.966 -0.719 1.93 -1.095 2.888 a 84.683 84.683 0 0 1 -1.139 2.777 a 73.355 73.355 0 0 1 -0.692 1.543 a 245.36 245.36 0 0 1 -2.6 5.47 c -0.273 0.557 -0.545 1.117 -0.834 1.667 c 0.313 -0.026 0.627 -0.044 0.94 -0.056 l 0.056 -0.001 c 0.116 0.011 0.15 0.004 0.255 0.061 a 0.512 0.512 0 0 1 -0.096 0.935 c -0.043 0.012 -0.088 0.013 -0.132 0.02 a 19.717 19.717 0 0 0 -3.756 0.491 c -0.774 0.183 -1.546 0.422 -2.256 0.785 a 5.378 5.378 0 0 0 -0.499 0.288 c -0.192 0.125 -0.377 0.263 -0.562 0.4 a 22.42 22.42 0 0 0 -0.694 0.534 c -0.263 0.211 -0.521 0.431 -0.766 0.664 a 5.734 5.734 0 0 0 -0.673 0.746 a 4.03 4.03 0 0 0 -0.286 0.447 c -0.06 0.111 -0.115 0.224 -0.173 0.335 c -0.057 0.098 -0.057 0.098 -0.116 0.193 a 20.331 20.331 0 0 1 -1.378 1.871 a 23.95 23.95 0 0 1 -0.828 0.971 c -0.278 0.308 -0.567 0.61 -0.877 0.887 a 4.94 4.94 0 0 1 -0.315 0.26 c -0.058 0.045 -0.12 0.085 -0.177 0.13 c -0.024 0.022 -0.047 0.042 -0.065 0.069 l -0.004 0.007 c 0.006 0.02 0.019 0.037 0.031 0.055 a 0.889 0.889 0 0 0 0.349 0.249 c 0.298 0.13 0.648 0.167 0.964 0.081 a 1.83 1.83 0 0 0 0.282 -0.11 c 0.076 -0.034 0.15 -0.069 0.224 -0.104 c 0.781 -0.377 1.538 -0.869 2.057 -1.577 c 0.112 -0.153 0.211 -0.313 0.298 -0.48 c 0.06 -0.117 0.111 -0.238 0.171 -0.356 a 2.643 2.643 0 0 1 0.403 -0.58 c 0.226 -0.244 0.519 -0.438 0.85 -0.496 c 0.195 -0.034 0.399 -0.021 0.583 0.054 a 0.704 0.704 0 0 1 0.318 0.247 a 0.604 0.604 0 0 1 0.083 0.169 a 0.75 0.75 0 0 1 0.024 0.216 c -0.008 0.096 -0.032 0.194 -0.048 0.288 a 57.73 57.73 0 0 1 -0.584 2.831 a 20.64 20.64 0 0 1 -0.246 0.949 a 5.73 5.73 0 0 1 -0.253 0.734 c -0.062 0.14 -0.147 0.267 -0.224 0.399 c -0.098 0.173 -0.193 0.347 -0.289 0.521 c -0.481 0.895 -0.952 1.798 -1.42 2.7 a 769.104 769.104 0 0 0 -2.079 4.039 c -0.054 0.106 -0.11 0.213 -0.162 0.319 c -0.18 0.38 -0.338 0.779 -0.422 1.191 a 1.965 1.965 0 0 0 -0.041 0.325 c -0.002 0.07 0 0.144 0.023 0.21 l 0.006 0.015 a 0.927 0.927 0 0 0 0.225 0.088 a 0.643 0.643 0 0 0 0.214 0.023 c 0.219 -0.015 0.407 -0.164 0.558 -0.312 l 0.1 -0.106 a 3.57 3.57 0 0 0 0.211 -0.263 c 0.092 -0.125 0.177 -0.256 0.263 -0.386 c 0.461 -0.708 0.92 -1.418 1.384 -2.124 c 0.475 -0.721 0.953 -1.44 1.446 -2.148 c 0.375 -0.539 0.756 -1.076 1.164 -1.592 c 0.082 -0.105 0.167 -0.208 0.252 -0.309 c 0.12 -0.143 0.244 -0.283 0.377 -0.412 c 0.129 -0.124 0.27 -0.246 0.438 -0.313 a 0.735 0.735 0 0 1 0.245 -0.047 c 0.043 0 0.043 0.003 0.098 0.008 a 0.857 0.857 0 0 1 0.519 0.316 c 0.032 0.044 0.061 0.09 0.084 0.138 c 0.183 0.374 0.068 0.814 -0.073 1.182 a 6.1 6.1 0 0 1 -0.094 0.221 c -0.036 0.083 -0.078 0.165 -0.112 0.247 c -0.058 0.152 -0.11 0.307 -0.163 0.46 c -0.69 2.023 -1.359 4.052 -2.031 6.081 c -0.322 0.97 -0.642 1.942 -0.963 2.913 l -0.001 0.005 c -0.02 0.071 -0.037 0.141 -0.052 0.212 a 1.836 1.836 0 0 0 -0.037 0.6 a 0.594 0.594 0 0 0 0.035 0.144 a 0.18 0.18 0 0 0 0.047 0.069 c 0.023 0.019 0.056 0.028 0.084 0.036 a 0.566 0.566 0 0 0 0.192 0.023 a 0.688 0.688 0 0 0 0.199 -0.043 c 0.091 -0.033 0.176 -0.082 0.256 -0.139 c 0.153 -0.112 0.284 -0.253 0.397 -0.404 c 0.182 -0.244 0.318 -0.517 0.433 -0.798 c 0.093 -0.238 0.181 -0.478 0.273 -0.717 a 103.77 103.77 0 0 1 1.98 -4.694 c 0.265 -0.586 0.537 -1.168 0.821 -1.743 c 0.24 -0.485 0.487 -0.965 0.761 -1.43 c 0.14 -0.235 0.285 -0.467 0.453 -0.682 c 0.127 -0.164 0.271 -0.326 0.454 -0.429 a 0.81 0.81 0 0 1 0.235 -0.082 c 0.069 -0.013 0.132 -0.007 0.202 -0.001 a 0.604 0.604 0 0 1 0.285 0.132 a 0.775 0.775 0 0 1 0.15 0.168 c 0.066 0.102 0.11 0.216 0.139 0.333 c 0.036 0.143 0.05 0.291 0.054 0.438 c 0.006 0.204 -0.007 0.406 -0.028 0.608 c -0.028 0.262 -0.073 0.523 -0.117 0.783 a 224.53 224.53 0 0 1 -0.673 3.479 c -0.223 1.108 -0.45 2.216 -0.678 3.323 l -0.171 0.823 c -0.04 0.198 -0.085 0.396 -0.124 0.595 c -0.02 0.115 -0.038 0.23 -0.055 0.345 c -0.042 0.334 -0.075 0.677 -0.033 1.013 c 0.011 0.085 0.026 0.172 0.056 0.253 a 0.31 0.31 0 0 0 0.063 0.119 a 0.029 0.029 0 0 0 0.013 0.008 c 0.052 0.012 0.106 0.02 0.159 0.021 c 0.302 0.003 0.533 -0.23 0.696 -0.461 a 2.86 2.86 0 0 0 0.189 -0.317 a 4.825 4.825 0 0 0 0.24 -0.569 c 0.058 -0.165 0.106 -0.333 0.153 -0.501 c 0.069 -0.267 0.135 -0.536 0.202 -0.804 c 0.567 -2.31 1.112 -4.625 1.677 -6.934 c 0.089 -0.358 0.176 -0.715 0.269 -1.07 c 0.029 -0.104 0.055 -0.21 0.095 -0.311 c 0.046 -0.1 0.088 -0.2 0.137 -0.299 a 1.53 1.53 0 0 1 0.267 -0.381 c 0.2 -0.196 0.479 -0.319 0.761 -0.309 c -0.026 0 -0.025 0.004 -0.063 0.013 c 0.042 -0.008 0.041 -0.008 0.084 -0.014 l 0.05 -0.002 a 0.792 0.792 0 0 1 0.399 0.108 c 0.321 0.188 0.475 0.556 0.557 0.902 c 0.012 0.054 0.025 0.108 0.034 0.162 c 0.015 0.08 0.027 0.161 0.037 0.241 c 0.014 0.115 0.024 0.231 0.032 0.347 c 0.015 0.294 0.023 0.59 0.034 0.884 l 0.033 0.945 c 0.045 1.332 0.088 2.664 0.131 3.996 l 0.026 0.803 c 0.001 0.051 0 0.102 0.004 0.152 c 0.005 0.049 0.012 0.097 0.021 0.145 c 0.007 0.034 0.008 0.045 0.017 0.077 c 0.025 0.093 0.067 0.216 0.158 0.267 a 0.27 0.27 0 0 0 0.107 0.028 a 0.516 0.516 0 0 0 0.111 -0.004 a 0.229 0.229 0 0 0 0.134 -0.077 a 0.801 0.801 0 0 0 0.144 -0.231 c 0.103 -0.23 0.155 -0.483 0.195 -0.731 c 0.064 -0.402 0.087 -0.809 0.107 -1.215 c 0.012 -0.228 0.026 -0.457 0.033 -0.685 c 0.016 -0.577 0.016 -1.154 0.016 -1.731 c 0.001 -0.92 -0.004 -1.84 -0.011 -2.759 c -0.004 -0.595 -0.01 -1.19 -0.016 -1.786 l 0.008 -0.094 c 0.009 -0.031 0.014 -0.062 0.025 -0.092 c 0.023 -0.058 0.044 -0.087 0.074 -0.136 c 0.037 -0.061 0.047 -0.08 0.086 -0.148 c 0.076 -0.136 0.149 -0.273 0.22 -0.412 c 0.528 -1.05 0.93 -2.16 1.232 -3.296 c 0.452 -1.708 0.67 -3.476 0.662 -5.242 a 21.869 21.869 0 0 0 -0.145 -2.372 a 5.771 5.771 0 0 1 -0.007 -0.263 a 9.507 9.507 0 0 1 0.182 -1.741 c 0.156 -0.808 0.402 -1.599 0.724 -2.354 c 0.228 -0.538 0.505 -1.05 0.782 -1.563 c 0.391 -0.716 0.783 -1.431 1.176 -2.145 c 2.805 -5.075 5.63 -10.138 8.44 -15.211 c 0.768 -1.389 1.535 -2.778 2.3 -4.168 a 701.295 701.295 0 0 0 3.534 -6.487 c 0.374 -0.698 0.746 -1.397 1.111 -2.1 c 0.156 -0.303 0.312 -0.606 0.462 -0.911 c 0.109 -0.22 0.216 -0.439 0.312 -0.664 l 0.035 -0.09 c 0.074 -0.226 0.134 -0.457 0.196 -0.686 c 0.14 -0.515 0.274 -1.032 0.402 -1.55 c 0.24 -0.97 0.468 -1.946 0.664 -2.927 c 0.034 -0.174 0.064 -0.348 0.096 -0.522 l 0.031 -0.132 c 0.08 -0.29 0.18 -0.573 0.281 -0.856 c 0.106 -0.291 0.215 -0.581 0.327 -0.87 c 0.282 -0.735 0.575 -1.465 0.872 -2.194 a 423.633 423.633 0 0 1 2.775 -6.649 l 0.184 -0.429 l 3.933 -9.204 a 13.863 13.863 0 0 1 -0.438 -1.715 c -0.358 -1.873 -0.377 -3.832 0.17 -5.671 c 0.215 -0.728 0.518 -1.43 0.905 -2.083 l 0.001 -0.099 l -0.003 -0.354 c -0.044 -2.049 -0.411 -4.082 -0.956 -6.053 a 32.17 32.17 0 0 0 -0.704 -2.235 a 22.755 22.755 0 0 0 -0.521 -1.344 l -0.016 -0.043 a 0.512 0.512 0 0 1 0.436 -0.665 c 0.046 -0.002 0.046 -0.002 0.092 0 a 0.623 0.623 0 0 1 0.133 0.03 a 0.526 0.526 0 0 1 0.269 0.234 c 0.045 0.093 0.082 0.189 0.122 0.284 a 31.877 31.877 0 0 1 1.482 4.693 c 0.324 1.386 0.555 2.798 0.643 4.218 c 0.136 -0.151 0.277 -0.297 0.426 -0.437 c 0.167 -0.156 0.339 -0.305 0.525 -0.438 l 0.015 -0.01 a 0.577 0.577 0 0 1 0.173 -0.079 c 0.056 -0.013 0.07 -0.011 0.127 -0.013 l 0.064 0.005 a 0.513 0.513 0 0 1 0.406 0.671 a 0.564 0.564 0 0 1 -0.139 0.21 c -0.064 0.051 -0.129 0.098 -0.192 0.148 a 6.473 6.473 0 0 0 -1.037 1.094 c -0.14 0.185 -0.271 0.378 -0.394 0.575 l -0.012 0.019 l -0.013 0.022 a 7.995 7.995 0 0 0 -0.649 1.323 c -0.67 1.752 -0.721 3.676 -0.409 5.51 c 0.058 0.338 0.127 0.675 0.209 1.008 c 0.2 0.814 0.478 1.612 0.866 2.356 a 7.316 7.316 0 0 0 1.712 2.187 a 6.85 6.85 0 0 0 1.152 0.789 c 1.095 0.596 2.328 0.884 3.561 0.991 a 11.07 11.07 0 0 0 2.795 -0.081 a 11.96 11.96 0 0 0 4.294 -1.545 a 12.884 12.884 0 0 0 2.554 -2.003 a 15.208 15.208 0 0 0 1.942 -2.416 c 0.276 -0.42 0.529 -0.852 0.77 -1.292 l 0.034 -0.054 c 0.037 -0.043 0.044 -0.056 0.087 -0.093 a 0.51 0.51 0 0 1 0.833 0.392 a 0.564 0.564 0 0 1 -0.063 0.245 c -0.087 0.157 -0.174 0.314 -0.263 0.47 c -0.261 0.446 -0.535 0.883 -0.83 1.308 a 15.918 15.918 0 0 1 -2.1 2.461 a 13.715 13.715 0 0 1 -2.766 2.042 a 12.964 12.964 0 0 1 -4.694 1.541 a 12.77 12.77 0 0 1 -3.008 0.005 a 10.918 10.918 0 0 1 -2.152 -0.447 a 8.316 8.316 0 0 1 -2.154 -1.043 a 7.588 7.588 0 0 1 -1.601 -1.462 c 0.099 0.533 0.191 1.066 0.276 1.603 c 0.166 1.088 0.314 2.18 0.469 3.269 c 0.331 2.347 0.658 4.695 0.964 7.045 c 0.22 1.704 0.439 3.409 0.603 5.12 c 0.051 0.536 0.089 1.073 0.133 1.611 c 0.031 0.341 0.062 0.683 0.096 1.024 c 0.059 0.59 0.118 1.179 0.174 1.769 c 0.032 0.358 0.062 0.716 0.089 1.074 c 0.07 0.99 0.113 1.984 0.052 2.975 c -0.044 0.724 -0.142 1.45 -0.352 2.145 c -0.08 0.268 -0.178 0.531 -0.295 0.784 c -0.082 0.176 -0.176 0.345 -0.268 0.516 l -0.145 0.278 c -0.141 0.275 -0.281 0.55 -0.418 0.826 a 66.415 66.415 0 0 0 -2.72 6.335 c -0.806 2.18 -1.499 4.407 -2.008 6.678 a 35.872 35.872 0 0 0 -0.491 2.621 c -0.061 0.409 -0.111 0.82 -0.162 1.23 c -0.046 0.38 -0.095 0.758 -0.143 1.137 a 426.793 426.793 0 0 1 -0.585 4.285 c -0.409 2.887 -0.83 5.773 -1.24 8.66 a 334.1 334.1 0 0 0 -0.952 7.189 c -0.1 0.856 -0.195 1.711 -0.275 2.569 a 37.86 37.86 0 0 0 -0.155 2.256 c -0.019 0.626 -0.004 1.252 0.016 1.876 c 0.026 0.908 0.07 1.814 0.117 2.721 c 0.115 2.163 0.262 4.325 0.418 6.486 c 0.207 2.868 0.434 5.735 0.676 8.599 c 0.186 2.203 0.377 4.405 0.594 6.605 c 0.066 0.658 0.142 1.315 0.209 1.973 c 0.045 0.45 0.086 0.899 0.127 1.348 c 0.185 2.118 0.351 4.237 0.513 6.357 c 0.182 2.394 0.359 4.789 0.532 7.183 c 0.072 0.989 0.142 1.979 0.213 2.968 l 0.145 2.055 c 0.02 0.283 0.037 0.565 0.06 0.848 c 0.033 0.39 0.061 0.783 0.089 1.174 c 0.146 2.169 0.243 4.342 0.254 6.516 c 0.01 1.949 -0.044 3.901 -0.264 5.838 a 55.06 55.06 0 0 1 -0.699 4.387 a 95.33 95.33 0 0 1 -1.188 5.205 c -0.212 0.836 -0.435 1.669 -0.661 2.501 c -0.108 0.397 -0.22 0.793 -0.321 1.192 a 20.68 20.68 0 0 0 -0.138 0.598 c -0.204 0.965 -0.362 1.94 -0.501 2.916 a 80.125 80.125 0 0 0 -0.441 3.781 a 100.413 100.413 0 0 0 -0.419 7.375 c -0.028 1.571 -0.006 3.143 0.02 4.714 c 0.03 1.946 0.076 3.891 0.128 5.837 c 0.09 3.44 0.201 6.88 0.319 10.32 c 0.134 3.864 0.279 7.728 0.434 11.592 c 0.043 1.059 0.087 2.117 0.133 3.176 c 0.015 0.352 0.033 0.704 0.048 1.057 c 0.004 0.157 0.004 0.157 0.006 0.316 a 9.6 9.6 0 0 1 -0.047 1.004 a 6.671 6.671 0 0 1 -0.477 1.924 a 6.432 6.432 0 0 1 -0.362 0.718 c -0.13 0.223 -0.276 0.438 -0.409 0.658 c -0.025 0.046 -0.05 0.09 -0.072 0.137 c -0.009 0.022 -0.019 0.045 -0.024 0.069 c -0.008 0.072 -0.01 0.146 -0.015 0.219 c -0.022 0.472 -0.027 0.945 -0.029 1.418 c -0.003 0.605 0.001 1.211 0.017 1.818 c 0.005 0.187 0.009 0.295 0.018 0.479 c 0.004 0.105 0.012 0.208 0.014 0.313 c 0 0.088 -0.002 0.175 -0.006 0.264 c -0.031 0.457 -0.107 0.911 -0.196 1.362 a 23.561 23.561 0 0 1 -0.361 1.529 a 29.158 29.158 0 0 1 -0.859 2.688 c -0.209 0.556 -0.441 1.103 -0.672 1.651 c -0.438 1.04 -0.887 2.076 -1.324 3.117 c -0.09 0.218 -0.18 0.437 -0.267 0.658 c -0.055 0.142 -0.111 0.285 -0.157 0.43 c -0.025 0.084 -0.046 0.169 -0.069 0.253 c -0.081 0.264 -0.164 0.528 -0.242 0.793 a 13.26 13.26 0 0 0 -0.377 1.623 a 4.781 4.781 0 0 0 -0.062 1.108 a 2.14 2.14 0 0 0 0.05 0.324 c 0.038 0.151 0.097 0.308 0.21 0.419 a 0.38 0.38 0 0 0 0.162 0.1 c 0.049 0.011 0.099 0.02 0.147 0.029 l 0.123 0.015 l 0.01 0.001 a 12.862 12.862 0 0 1 -0.01 -0.34 c 0 -0.107 0.001 -0.213 0.004 -0.319 c 0.025 -0.538 0.096 -1.087 0.318 -1.582 c 0.047 -0.102 0.1 -0.2 0.159 -0.296 c 0.133 -0.203 0.27 -0.402 0.404 -0.606 c 0.102 -0.157 0.203 -0.314 0.306 -0.47 c 0.038 -0.054 0.037 -0.054 0.076 -0.107 c 0.051 -0.063 0.104 -0.119 0.167 -0.171 l 0.023 -0.017 l 0.178 -0.086 l 0.198 -0.012 c 0.187 0.066 0.189 0.067 0.335 0.198 l 0.086 0.179 l 0.012 0.198 l -0.065 0.187 c -0.067 0.074 -0.069 0.072 -0.13 0.148 c -0.074 0.1 -0.139 0.206 -0.206 0.311 c -0.098 0.151 -0.196 0.302 -0.297 0.452 c -0.082 0.124 -0.17 0.245 -0.248 0.372 c -0.025 0.045 -0.048 0.09 -0.071 0.137 c -0.125 0.287 -0.181 0.6 -0.21 0.911 c -0.032 0.339 -0.029 0.68 -0.003 1.017 a 0.12 0.12 0 0 0 0.012 0.011 c 0.039 0.03 0.078 0.06 0.118 0.088 c 0.039 0.028 0.051 0.036 0.091 0.061 c 0.19 0.118 0.442 0.234 0.666 0.144 l 0.007 -0.004 c 0 -0.153 0.005 -0.306 0.011 -0.458 c 0.008 -0.137 0.017 -0.272 0.028 -0.407 a 5.86 5.86 0 0 1 0.141 -0.873 a 2.54 2.54 0 0 1 0.167 -0.474 a 2.1 2.1 0 0 1 0.242 -0.372 c 0.066 -0.085 0.134 -0.168 0.205 -0.25 c 0.293 -0.337 0.609 -0.658 0.942 -0.957 a 0.694 0.694 0 0 1 0.067 -0.051 a 0.548 0.548 0 0 1 0.237 -0.077 c 0.027 -0.002 0.027 -0.002 0.056 -0.001 a 0.532 0.532 0 0 1 0.214 0.057 c 0.213 0.112 0.32 0.365 0.252 0.596 a 0.532 0.532 0 0 1 -0.128 0.215 c -0.111 0.105 -0.224 0.208 -0.335 0.315 a 9.201 9.201 0 0 0 -0.708 0.778 c -0.037 0.048 -0.077 0.095 -0.106 0.148 a 1.184 1.184 0 0 0 -0.1 0.251 a 3.442 3.442 0 0 0 -0.089 0.415 c -0.05 0.323 -0.07 0.649 -0.077 0.975 c -0.002 0.087 -0.002 0.165 -0.002 0.252 l 0.001 0.083 l 0.028 0.083 c 0.022 0.054 0.047 0.106 0.073 0.156 c 0.069 0.126 0.156 0.256 0.283 0.329 a 0.484 0.484 0 0 0 0.261 0.05 a 0.97 0.97 0 0 0 0.604 -0.235 l 0.003 -0.003 a 10.406 10.406 0 0 1 0.026 -0.854 c 0.049 -0.529 0.147 -1.071 0.454 -1.516 c 0.163 -0.217 0.336 -0.429 0.503 -0.64 c 0.331 -0.414 0.662 -0.828 0.994 -1.24 c 0.069 -0.086 0.137 -0.172 0.209 -0.256 l 0.044 -0.044 a 0.553 0.553 0 0 1 0.285 -0.119 l 0.062 -0.002 a 0.553 0.553 0 0 1 0.211 0.054 c 0.2 0.101 0.313 0.329 0.272 0.55 a 0.547 0.547 0 0 1 -0.086 0.2 c -0.066 0.086 -0.137 0.171 -0.206 0.256 l -0.448 0.558 l -0.541 0.675 l -0.251 0.318 c -0.074 0.093 -0.161 0.197 -0.234 0.301 a 1.274 1.274 0 0 0 -0.061 0.109 a 2.142 2.142 0 0 0 -0.157 0.567 a 5.532 5.532 0 0 0 -0.058 0.76 c -0.003 0.157 0.001 0.315 -0.004 0.472 a 0.56 0.56 0 0 1 -0.035 0.182 c 0.026 0.043 0.052 0.085 0.081 0.127 c 0.054 0.075 0.113 0.149 0.184 0.211 a 0.427 0.427 0 0 0 0.142 0.089 c 0.026 0.009 0.052 0.008 0.08 0.007 a 0.839 0.839 0 0 0 0.74 -0.553 c 0.04 -0.142 0.076 -0.286 0.117 -0.43 c 0.025 -0.086 0.035 -0.125 0.063 -0.212 c 0.021 -0.068 0.044 -0.137 0.068 -0.204 c 0.079 -0.219 0.18 -0.457 0.389 -0.581 l 0.03 -0.015 c 0.08 -0.186 0.188 -0.36 0.312 -0.52 c 0.122 -0.158 0.261 -0.297 0.398 -0.441 c 0.026 -0.03 0.05 -0.062 0.074 -0.093 a 2.92 2.92 0 0 0 0.264 -0.485 c 0.085 -0.193 0.16 -0.387 0.225 -0.586 l 0.013 -0.042 c 0.024 -0.047 0.041 -0.099 0.071 -0.142 a 0.504 0.504 0 0 1 0.41 -0.213 a 0.514 0.514 0 0 1 0.512 0.506 c 0 0.092 -0.029 0.176 -0.058 0.261 a 6.39 6.39 0 0 1 -0.139 0.38 c -0.135 0.34 -0.294 0.683 -0.517 0.975 c -0.104 0.135 -0.23 0.25 -0.345 0.376 c -0.035 0.042 -0.071 0.084 -0.105 0.128 c -0.12 0.158 -0.23 0.338 -0.246 0.542 c -0.018 0.22 0.083 0.427 0.207 0.601 c 0.156 0.219 0.359 0.427 0.615 0.525 c 0.129 0.05 0.267 0.066 0.405 0.063 c 0.157 -0.003 0.311 -0.029 0.468 -0.039 c 0.071 -0.001 0.141 -0.003 0.211 -0.008 a 3.76 3.76 0 0 0 0.409 -0.057 a 3.5 3.5 0 0 0 0.54 -0.145 c 0.346 -0.125 0.703 -0.323 0.867 -0.669 c 0.024 -0.055 0.042 -0.111 0.062 -0.168 c 0.048 -0.134 0.061 -0.165 0.12 -0.322 c 0.208 -0.537 0.439 -1.064 0.656 -1.598 c 0.035 -0.092 0.072 -0.182 0.101 -0.276 c 0.004 -0.015 0.004 -0.014 0.005 -0.029 c 0.011 -0.151 0.027 -0.301 0.036 -0.452 a 12.162 12.162 0 0 0 -0.083 -1.982 a 25.621 25.621 0 0 0 -0.394 -2.335 l -0.009 -0.069 a 5.376 5.376 0 0 1 0.015 -0.897 c 0.039 -0.401 0.119 -0.798 0.249 -1.18 c 0.057 -0.168 0.124 -0.333 0.203 -0.492 c 0.04 -0.085 0.09 -0.164 0.127 -0.251 l 0.037 -0.106 c 0.093 -0.313 0.141 -0.636 0.178 -0.959 c 0.055 -0.456 0.085 -0.915 0.109 -1.374 c 0.066 -1.339 0.062 -2.683 0.033 -4.023 l -0.006 -0.255 l 0.007 -0.101 c 0.022 -0.119 0.044 -0.238 0.069 -0.357 c 0.093 -0.444 0.198 -0.891 0.359 -1.317 c 0.043 -0.112 0.09 -0.222 0.145 -0.329 c 0.013 -0.026 0.026 -0.053 0.041 -0.078 c 0.003 -0.007 0.031 -0.047 0.04 -0.07 a 0.598 0.598 0 0 0 0.018 -0.084 c 0.027 -0.181 0.025 -0.366 0.015 -0.548 a 9.43 9.43 0 0 0 -0.06 -0.693 a 21.589 21.589 0 0 0 -0.297 -1.786 a 7.015 7.015 0 0 1 -0.038 -0.321 a 21.368 21.368 0 0 1 -0.046 -3.015 c 0.064 -1.303 0.22 -2.602 0.457 -3.885 c 0.171 -0.933 0.394 -1.856 0.62 -2.775 c 0.316 -1.291 0.651 -2.577 0.994 -3.862 a 507.565 507.565 0 0 1 3.279 -11.684 c 0.266 -0.904 0.534 -1.807 0.813 -2.708 c 0.067 -0.214 0.134 -0.429 0.205 -0.643 c 0.067 -0.202 0.14 -0.404 0.205 -0.607 c 0.076 -0.243 0.149 -0.486 0.22 -0.732 c 0.31 -1.078 0.585 -2.166 0.836 -3.26 c 0.273 -1.192 0.518 -2.39 0.737 -3.593 a 77.378 77.378 0 0 0 1.125 -8.999 c 0.058 -0.9 0.098 -1.8 0.117 -2.7 c 0.014 -0.606 0.015 -1.21 0.023 -1.814 c 0.007 -0.423 0.016 -0.846 0.027 -1.271 c 0.053 -1.757 0.144 -3.515 0.353 -5.26 c 0.079 -0.672 0.178 -1.342 0.304 -2.006 c 0.119 -0.623 0.263 -1.244 0.453 -1.849 c 0.106 -0.336 0.225 -0.668 0.364 -0.991 c 0.112 -0.258 0.234 -0.51 0.348 -0.766 c 0.029 -0.061 0.058 -0.12 0.089 -0.18 c 0.157 -0.296 0.324 -0.587 0.486 -0.881 a 15.966 15.966 0 0 0 0.794 -1.658 c 0.276 -0.668 0.504 -1.356 0.689 -2.056 c 0.257 -0.972 0.43 -1.964 0.537 -2.964 c 0.045 -0.422 0.076 -0.844 0.101 -1.267 c 0.044 -0.953 0.078 -1.906 0.115 -2.86 c 0.112 -2.912 0.221 -5.826 0.332 -8.738 c 0.074 -1.878 0.148 -3.756 0.227 -5.634 c 0.082 -1.894 0.165 -3.789 0.269 -5.682 c 0.033 -0.617 0.07 -1.236 0.11 -1.853 c 0.032 -0.484 0.068 -0.967 0.116 -1.448 c 0.077 -0.753 0.173 -1.504 0.274 -2.253 c 0.134 -0.995 0.277 -1.988 0.426 -2.982 c 0.404 -2.719 0.84 -5.434 1.289 -8.146 c 0.368 -2.214 0.744 -4.428 1.139 -6.638 c 0.163 -0.908 0.329 -1.817 0.503 -2.722 c 0.095 -0.493 0.187 -0.989 0.316 -1.475 l 0.028 -0.098 c 0.021 -0.058 0.049 -0.114 0.068 -0.173 c 0.019 -0.066 0.035 -0.133 0.048 -0.2 c 0.046 -0.237 0.075 -0.476 0.099 -0.716 c 0.034 -0.331 0.058 -0.663 0.078 -0.995 a 41.95 41.95 0 0 0 0.069 -2.157 l 0.002 -0.059 c 0.008 -0.066 0.018 -0.13 0.036 -0.194 c 0.065 -0.23 0.194 -0.438 0.319 -0.639 c 0.175 -0.273 0.359 -0.54 0.537 -0.813 c 0.373 -0.582 0.717 -1.194 0.879 -1.873 a 3.55 3.55 0 0 0 0.094 -0.65 l 0.032 -0.15 c 0.026 -0.044 0.044 -0.093 0.075 -0.134 a 0.512 0.512 0 0 1 0.249 -0.172 c 0.049 -0.015 0.101 -0.015 0.152 -0.023 h 0.54 a 5.2 5.2 0 0 0 0.139 0.019 c 0.042 0.02 0.088 0.033 0.129 0.058 c 0.108 0.067 0.118 0.105 0.187 0.207 c 0.089 0.182 0.182 0.362 0.274 0.542 c 0.377 0.717 0.77 1.431 1.236 2.095 c 0.088 0.126 0.18 0.25 0.277 0.37 c 0.069 0.083 0.141 0.163 0.208 0.247 c 0.045 0.059 0.045 0.059 0.088 0.119 c 0.073 0.111 0.141 0.223 0.201 0.341 c 0.184 0.362 0.3 0.757 0.383 1.154 c 0.11 0.536 0.16 1.083 0.204 1.628 c 0.038 0.532 0.069 1.065 0.109 1.598 c 0.042 0.514 0.095 1.026 0.187 1.535 l 0.02 0.102 c 0.168 0.813 0.368 1.618 0.554 2.427 l 1.208 5.27 c 0.595 2.589 1.189 5.177 1.789 7.764 a 444.087 444.087 0 0 0 0.344 1.478 c 0.1 0.477 0.187 0.956 0.273 1.436 c 0.129 0.72 0.251 1.443 0.371 2.165 a 407.413 407.413 0 0 1 1.495 9.77 c 0.166 1.192 0.329 2.386 0.457 3.582 c 0.055 0.509 0.089 1.018 0.135 1.528 l 0.079 0.811 c 0.197 1.861 0.423 3.717 0.655 5.573 c 0.302 2.418 0.616 4.834 0.938 7.249 c 0.012 0.142 0.015 0.285 0.024 0.427 c 0.067 0.885 0.199 1.765 0.384 2.634 a 20.81 20.81 0 0 0 0.946 3.198 c 0.168 0.435 0.355 0.863 0.553 1.287 c 0.291 0.603 0.599 1.198 0.897 1.798 c 0.394 0.804 0.781 1.611 1.123 2.44 c 0.274 0.665 0.516 1.342 0.717 2.033 c 0.349 1.193 0.579 2.417 0.761 3.645 c 0.094 0.64 0.174 1.283 0.256 1.924 c 0.16 1.257 0.322 2.515 0.439 3.777 c 0.09 1.049 0.163 2.099 0.253 3.148 c 0.087 0.946 0.213 1.887 0.36 2.825 a 77.027 77.027 0 0 0 1.403 6.843 a 59.62 59.62 0 0 0 1.09 3.812 c 0.166 0.513 0.341 1.023 0.527 1.528 c 0.191 0.521 0.396 1.037 0.593 1.556 c 0.253 0.673 0.503 1.348 0.753 2.022 a 405.855 405.855 0 0 1 3.708 10.445 c 0.458 1.357 0.907 2.717 1.331 4.084 c 0.361 1.163 0.711 2.331 0.99 3.516 c 0.116 0.49 0.201 0.986 0.286 1.482 c 0.082 0.487 0.158 0.973 0.228 1.46 c 0.115 0.8 0.213 1.602 0.29 2.407 c 0.072 0.759 0.128 1.52 0.15 2.282 l 0.003 0.128 l -0.003 0.062 l -0.048 0.51 c -0.06 0.704 -0.113 1.412 -0.106 2.119 c 0.002 0.178 0.007 0.357 0.023 0.534 c 0.006 0.067 0.015 0.134 0.026 0.199 a 0.743 0.743 0 0 0 0.036 0.155 c 0.009 0.023 0.033 0.055 0.044 0.075 c 0.043 0.083 0.043 0.082 0.083 0.166 c 0.142 0.323 0.249 0.658 0.347 0.997 c 0.117 0.411 0.216 0.826 0.31 1.242 l 0.017 0.083 l 0.011 0.12 c -0.007 0.29 -0.011 0.581 -0.015 0.87 c -0.011 1.225 -0.004 2.454 0.092 3.676 c 0.03 0.394 0.069 0.788 0.139 1.178 c 0.021 0.117 0.044 0.234 0.075 0.349 c 0.027 0.107 0.06 0.215 0.112 0.312 c 0.059 0.107 0.115 0.214 0.17 0.322 c 0.114 0.23 0.22 0.463 0.307 0.705 c 0.127 0.354 0.214 0.721 0.244 1.096 c 0.017 0.201 0.018 0.403 0.005 0.604 c -0.012 0.211 -0.035 0.422 -0.052 0.632 a 75.37 75.37 0 0 0 -0.053 0.812 c -0.046 0.779 -0.086 1.557 -0.122 2.335 l -0.029 0.608 c -0.009 0.202 -0.021 0.405 -0.024 0.608 c -0.001 0.068 0.001 0.136 0.006 0.203 c 0.014 0.15 0.044 0.295 0.102 0.434 c 0.052 0.126 0.124 0.243 0.197 0.358 a 7.37 7.37 0 0 1 0.346 0.564 c 0.066 0.126 0.128 0.254 0.183 0.386 c 0.039 0.094 0.07 0.191 0.11 0.285 c 0.014 0.03 0.029 0.06 0.046 0.088 c 0.144 0.23 0.373 0.385 0.615 0.497 c 0.342 0.157 0.72 0.242 1.095 0.279 c 0.108 0.011 0.216 0.011 0.323 0.018 c 0.123 0.011 0.245 0.026 0.367 0.033 c 0.114 0.004 0.228 0 0.339 -0.027 c 0.305 -0.076 0.541 -0.311 0.719 -0.559 c 0.137 -0.192 0.24 -0.421 0.196 -0.661 a 0.998 0.998 0 0 0 -0.148 -0.349 c -0.125 -0.192 -0.29 -0.35 -0.447 -0.515 c -0.052 -0.059 -0.051 -0.059 -0.101 -0.121 c -0.314 -0.419 -0.524 -0.911 -0.699 -1.403 l -0.016 -0.046 c -0.025 -0.138 -0.048 -0.177 -0.005 -0.315 a 0.512 0.512 0 0 1 0.634 -0.337 a 0.514 0.514 0 0 1 0.257 0.181 c 0.055 0.073 0.076 0.148 0.106 0.229 l 0.052 0.142 c 0.039 0.098 0.08 0.194 0.121 0.291 c 0.1 0.22 0.205 0.443 0.353 0.636 c 0.047 0.06 0.102 0.112 0.156 0.167 c 0.048 0.049 0.095 0.1 0.143 0.152 a 2.995 2.995 0 0 1 0.391 0.541 c 0.027 0.049 0.051 0.098 0.073 0.148 c 0.24 0.108 0.358 0.373 0.443 0.609 a 7.822 7.822 0 0 1 0.162 0.523 c 0.031 0.115 0.055 0.232 0.092 0.345 c 0.014 0.035 0.029 0.067 0.046 0.1 a 0.9 0.9 0 0 0 0.419 0.368 c 0.074 0.03 0.153 0.051 0.234 0.059 c 0.029 0.002 0.06 0.006 0.089 0.002 c 0.086 -0.012 0.166 -0.088 0.223 -0.147 c 0.082 -0.085 0.151 -0.183 0.211 -0.285 a 0.872 0.872 0 0 1 -0.034 -0.155 c -0.008 -0.123 -0.003 -0.248 -0.004 -0.372 c 0 -0.119 -0.002 -0.147 -0.005 -0.27 a 4.48 4.48 0 0 0 -0.097 -0.842 a 1.373 1.373 0 0 0 -0.187 -0.468 c -0.071 -0.097 -0.148 -0.19 -0.222 -0.285 c -0.173 -0.22 -0.347 -0.438 -0.522 -0.656 c -0.239 -0.299 -0.479 -0.596 -0.719 -0.894 c -0.069 -0.086 -0.14 -0.169 -0.206 -0.257 c -0.017 -0.026 -0.017 -0.025 -0.033 -0.053 a 0.51 0.51 0 0 1 0.492 -0.748 a 0.538 0.538 0 0 1 0.33 0.162 c 0.071 0.084 0.139 0.171 0.208 0.257 c 0.332 0.412 0.664 0.825 0.994 1.239 c 0.169 0.212 0.342 0.423 0.504 0.641 c 0.032 0.045 0.061 0.091 0.089 0.139 c 0.155 0.277 0.246 0.579 0.302 0.891 c 0.08 0.443 0.089 0.891 0.089 1.34 a 0.928 0.928 0 0 0 0.371 0.201 a 0.9 0.9 0 0 0 0.425 0.019 a 0.52 0.52 0 0 0 0.228 -0.17 c 0.086 -0.103 0.15 -0.223 0.199 -0.347 c 0.01 -0.027 0.02 -0.053 0.028 -0.079 l 0.002 -0.088 c 0 -0.114 0 -0.13 -0.002 -0.251 a 7.315 7.315 0 0 0 -0.093 -1.065 a 2.629 2.629 0 0 0 -0.085 -0.361 a 1.097 1.097 0 0 0 -0.087 -0.216 a 2.65 2.65 0 0 0 -0.191 -0.251 a 8.052 8.052 0 0 0 -0.456 -0.505 a 8.247 8.247 0 0 0 -0.313 -0.307 c -0.069 -0.066 -0.144 -0.128 -0.21 -0.199 a 0.465 0.465 0 0 1 -0.051 -0.066 a 0.548 0.548 0 0 1 -0.071 -0.182 a 0.517 0.517 0 0 1 0.217 -0.513 a 0.545 0.545 0 0 1 0.318 -0.085 a 0.54 0.54 0 0 1 0.304 0.129 c 0.091 0.081 0.178 0.164 0.266 0.246 c 0.254 0.248 0.502 0.502 0.729 0.773 c 0.123 0.145 0.249 0.295 0.343 0.46 c 0.155 0.276 0.233 0.591 0.288 0.9 c 0.08 0.452 0.103 0.912 0.11 1.371 v 0.041 c 0.17 0.077 0.366 0.017 0.524 -0.059 a 1.606 1.606 0 0 0 0.24 -0.143 a 1.84 1.84 0 0 0 0.13 -0.098 l 0.011 -0.142 c 0.005 -0.103 0.008 -0.206 0.009 -0.31 a 4.89 4.89 0 0 0 -0.088 -1.004 a 1.99 1.99 0 0 0 -0.236 -0.64 c -0.132 -0.199 -0.266 -0.397 -0.397 -0.596 l -0.224 -0.35 l -0.069 -0.103 l -0.023 -0.035 l -0.016 -0.021 l -0.005 -0.007 l 0.007 0.007 l -0.131 -0.145 l -0.066 -0.187 c 0.008 -0.171 -0.014 -0.231 0.094 -0.377 c 0.04 -0.054 0.099 -0.089 0.148 -0.133 l 0.187 -0.067 l 0.198 0.01 l 0.179 0.085 c 0.091 0.068 0.163 0.151 0.231 0.243 c 0.119 0.172 0.229 0.35 0.343 0.525 c 0.131 0.204 0.269 0.403 0.402 0.605 c 0.207 0.338 0.328 0.714 0.398 1.102 c 0.08 0.453 0.094 0.914 0.077 1.373 l -0.003 0.062 c 0.094 -0.006 0.188 -0.024 0.28 -0.044 c 0.02 -0.005 0.02 -0.004 0.038 -0.012 c 0.269 -0.141 0.345 -0.476 0.376 -0.754 c 0.006 -0.052 0.011 -0.107 0.013 -0.159 a 5.187 5.187 0 0 0 -0.082 -1.126 a 13.064 13.064 0 0 0 -0.362 -1.523 c -0.086 -0.295 -0.182 -0.588 -0.267 -0.883 a 4.999 4.999 0 0 0 -0.045 -0.164 a 8.634 8.634 0 0 0 -0.201 -0.544 c -0.115 -0.288 -0.235 -0.574 -0.354 -0.858 c -0.396 -0.935 -0.797 -1.868 -1.191 -2.803 c -0.229 -0.546 -0.459 -1.093 -0.674 -1.646 a 37.05 37.05 0 0 1 -0.991 -2.898 a 23.189 23.189 0 0 1 -0.391 -1.486 a 8.54 8.54 0 0 1 -0.196 -1.169 a 3.456 3.456 0 0 1 -0.011 -0.269 c 0.001 -0.138 0.012 -0.276 0.014 -0.413 c 0.001 -0.167 -0.001 -0.334 -0.004 -0.502 a 50.236 50.236 0 0 0 -0.125 -2.295 c -0.018 -0.25 -0.038 -0.499 -0.058 -0.749 c -0.008 -0.109 -0.013 -0.221 -0.027 -0.331 c -0.008 -0.033 -0.02 -0.064 -0.031 -0.096 a 5.487 5.487 0 0 0 -0.241 -0.501 l -0.308 -0.599 a 26.38 26.38 0 0 1 -0.216 -0.449 a 11.875 11.875 0 0 1 -0.478 -1.185 a 9.607 9.607 0 0 1 -0.454 -2.029 a 8.613 8.613 0 0 1 -0.054 -0.937 c -0.002 -0.287 0.014 -0.574 0.022 -0.86 c 0.004 -0.263 0.007 -0.525 0.008 -0.788 a 273.468 273.468 0 0 0 -0.095 -6.008 c -0.051 -2.178 -0.111 -4.356 -0.172 -6.533 c -0.186 -6.545 -0.403 -13.088 -0.594 -19.631 c -0.017 -0.563 -0.032 -1.126 -0.047 -1.689 c -0.01 -0.39 -0.018 -0.779 -0.033 -1.169 c -0.142 -3.367 -0.775 -6.697 -1.618 -9.953 a 90.668 90.668 0 0 0 -0.713 -2.574 c -0.234 -0.799 -0.478 -1.594 -0.713 -2.392 c -0.074 -0.257 -0.143 -0.515 -0.218 -0.771 a 34.547 34.547 0 0 0 -0.271 -0.844 c -0.247 -0.727 -0.5 -1.451 -0.746 -2.178 a 64.456 64.456 0 0 1 -0.79 -2.507 a 37.67 37.67 0 0 1 -0.992 -4.3 c -0.081 -0.491 -0.15 -0.983 -0.205 -1.476 a 47.771 47.771 0 0 1 -0.213 -2.699 a 135.095 135.095 0 0 1 -0.173 -4.409 c -0.047 -1.805 -0.07 -3.609 -0.08 -5.413 c -0.005 -0.846 -0.007 -1.691 -0.005 -2.536 c 0.001 -0.361 0 -0.721 0.007 -1.081 c 0.006 -0.394 0.018 -0.787 0.028 -1.181 c 0.093 -3.277 0.188 -6.553 0.277 -9.83 c 0.182 -6.756 0.35 -13.513 0.445 -20.271 c 0.034 -2.501 0.061 -5.001 0.059 -7.503 a 224.163 224.163 0 0 0 -0.026 -3.381 a 79.41 79.41 0 0 0 -0.088 -2.803 c -0.035 -0.6 -0.074 -1.199 -0.112 -1.799 a 527.617 527.617 0 0 0 -1.856 -21.354 a 271.347 271.347 0 0 0 -0.448 -3.918 a 32.421 32.421 0 0 0 -0.096 -0.697 c -0.449 -2.961 -1.265 -5.856 -2.271 -8.673 a 66.86 66.86 0 0 0 -3.037 -7.14 c -0.218 -0.437 -0.445 -0.868 -0.673 -1.301 c -0.066 -0.132 -0.066 -0.131 -0.129 -0.264 a 9.3 9.3 0 0 1 -0.289 -0.701 a 12.785 12.785 0 0 1 -0.514 -1.873 c -0.161 -0.8 -0.265 -1.609 -0.332 -2.421 c -0.147 -1.766 -0.127 -3.545 -0.005 -5.311 c 0.038 -0.542 0.093 -1.083 0.15 -1.623 c 0.092 -0.885 0.198 -1.77 0.307 -2.653 c 0.175 -1.426 0.362 -2.85 0.557 -4.272 c 0.336 -2.48 0.688 -4.958 1.043 -7.437 c 0.04 -0.274 0.083 -0.549 0.127 -0.823 c 0.066 -0.394 0.135 -0.787 0.207 -1.181 a 7.733 7.733 0 0 1 -2.19 1.828 a 8.706 8.706 0 0 1 -1.827 0.757 c -0.775 0.225 -1.576 0.353 -2.38 0.413 c -0.78 0.059 -1.563 0.055 -2.342 -0.03 a 12.93 12.93 0 0 1 -4.655 -1.446 a 13.638 13.638 0 0 1 -2.666 -1.868 a 16.002 16.002 0 0 1 -2.697 -3.17 a 19.272 19.272 0 0 1 -0.725 -1.202 c -0.012 -0.022 -0.09 -0.158 -0.113 -0.215 a 0.502 0.502 0 0 1 0.001 -0.374 a 0.511 0.511 0 0 1 0.504 -0.321 a 0.516 0.516 0 0 1 0.338 0.16 c 0.039 0.042 0.045 0.055 0.075 0.103 a 18.86 18.86 0 0 0 1.125 1.814 a 14.82 14.82 0 0 0 1.878 2.178 c 0.744 0.706 1.57 1.326 2.462 1.834 a 11.952 11.952 0 0 0 4.261 1.455 c 0.449 0.063 0.903 0.099 1.357 0.106 c 0.474 0.007 0.951 -0.018 1.424 -0.064 c 1.325 -0.131 2.644 -0.481 3.779 -1.193 a 6.738 6.738 0 0 0 1.635 -1.446 a 7.915 7.915 0 0 0 1.061 -1.727 c 0.174 -0.379 0.323 -0.77 0.449 -1.168 v -0.001 l 0.001 -0.002 c 0.094 -0.3 0.178 -0.604 0.25 -0.91 c 0.469 -2.004 0.537 -4.157 -0.141 -6.122 a 8.018 8.018 0 0 0 -0.757 -1.603 l -0.013 -0.023 a 7.283 7.283 0 0 0 -0.897 -1.17 a 5.162 5.162 0 0 0 -0.639 -0.579 l -0.032 -0.023 a 0.565 0.565 0 0 1 -0.166 -0.191 a 0.513 0.513 0 0 1 0.201 -0.667 a 0.568 0.568 0 0 1 0.242 -0.069 l 0.064 0.003 c 0.056 0.009 0.071 0.009 0.124 0.029 c 0.063 0.023 0.117 0.06 0.17 0.099 a 6.434 6.434 0 0 1 0.909 0.846 c 0.115 -1.842 0.465 -3.667 0.956 -5.443 c 0.214 -0.777 0.457 -1.546 0.728 -2.306 c 0.168 -0.473 0.345 -0.944 0.544 -1.405 l 0.021 -0.041 a 0.526 0.526 0 0 1 0.269 -0.234 a 0.61 0.61 0 0 1 0.133 -0.03 c 0.046 -0.002 0.046 -0.002 0.092 0 a 0.513 0.513 0 0 1 0.435 0.665 c -0.035 0.092 -0.075 0.181 -0.112 0.271 l -0.111 0.274 a 31.603 31.603 0 0 0 -1.417 4.682 c -0.351 1.609 -0.569 3.252 -0.561 4.901 a 9.45 9.45 0 0 1 1.122 2.952 c 0.33 1.634 0.253 3.329 -0.076 4.959 c -0.085 0.424 -0.19 0.847 -0.315 1.265 c 0.846 2.055 1.689 4.111 2.541 6.162 c 0.24 0.564 0.491 1.124 0.737 1.684 l 0.921 2.112 c 0.276 0.636 0.55 1.273 0.824 1.909 c 0.924 2.164 1.84 4.334 2.691 6.529 c 0.303 0.779 0.598 1.562 0.871 2.353 c 0.109 0.32 0.216 0.642 0.314 0.965 c 0.088 0.289 0.17 0.581 0.233 0.876 c 0.052 0.24 0.077 0.483 0.111 0.725 c 0.024 0.148 0.049 0.295 0.076 0.442 c 0.165 0.837 0.412 1.655 0.719 2.449 c 0.183 0.474 0.386 0.939 0.617 1.391 l 0.008 0.014 c 3.385 5.832 6.767 11.664 10.156 17.493 c 0.674 1.16 1.36 2.313 2.039 3.47 c 1.452 2.467 2.902 4.935 4.364 7.395 c 0.144 0.239 0.283 0.484 0.434 0.718 c 0.126 0.186 0.268 0.362 0.399 0.544 a 6.927 6.927 0 0 1 0.542 0.91 c 0.374 0.757 0.617 1.573 0.795 2.396 c 0.254 1.177 0.377 2.38 0.442 3.582 c 0.032 0.582 0.041 1.164 0.062 1.747 c 0.013 0.281 0.013 0.281 0.03 0.563 c 0.039 0.603 0.093 1.204 0.172 1.805 c 0.182 1.368 0.485 2.725 0.953 4.025 c 0.207 0.577 0.449 1.141 0.72 1.691 c 0.178 0.36 0.372 0.711 0.554 1.069 c 0.029 0.058 0.056 0.116 0.082 0.175 c 0.142 0.329 0.184 0.691 0.221 1.044 c 0.051 0.468 0.076 0.938 0.096 1.408 c 0.045 1.086 0.054 2.173 0.06 3.259 c 0.003 0.577 0.001 1.154 0.009 1.73 a 8.777 8.777 0 0 0 0.098 1.229 c 0.031 0.187 0.069 0.374 0.128 0.554 c 0.037 0.115 0.082 0.232 0.151 0.333 c 0.021 0.032 0.05 0.074 0.086 0.09 a 0.25 0.25 0 0 0 0.085 0.016 c 0.02 0 0.037 -0.002 0.054 -0.009 a 0.174 0.174 0 0 0 0.045 -0.029 a 0.559 0.559 0 0 0 0.127 -0.187 a 1.31 1.31 0 0 0 0.093 -0.336 c 0.01 -0.087 0.015 -0.172 0.021 -0.258 c 0.028 -0.476 0.047 -0.952 0.065 -1.428 c 0.059 -1.568 0.104 -3.138 0.17 -4.707 c 0.007 -0.161 0.013 -0.322 0.027 -0.483 c 0.031 -0.347 0.1 -0.692 0.204 -1.023 c 0.038 -0.122 0.082 -0.243 0.132 -0.36 a 0.861 0.861 0 0 1 0.295 -0.392 a 0.773 0.773 0 0 1 0.449 -0.153 c 0.06 0.001 0.119 0.007 0.177 0.023 c 0.045 0.01 0.088 0.025 0.129 0.044 c 0.272 0.123 0.439 0.388 0.548 0.654 c 0.083 0.205 0.133 0.418 0.186 0.631 l 0.078 0.304 l 0.169 0.615 c 0.491 1.745 1.003 3.486 1.501 5.231 c 0.106 0.372 0.21 0.744 0.311 1.118 c 0.092 0.343 0.171 0.689 0.259 1.032 c 0.036 0.132 0.072 0.263 0.111 0.393 c 0.113 0.37 0.239 0.739 0.416 1.085 c 0.1 0.194 0.217 0.386 0.37 0.544 a 0.938 0.938 0 0 0 0.212 0.17 a 0.579 0.579 0 0 0 0.181 0.066 a 0.538 0.538 0 0 0 0.216 -0.009 c 0.095 -0.025 0.149 -0.094 0.186 -0.181 a 0.605 0.605 0 0 0 0.033 -0.099 c 0.043 -0.157 0.05 -0.322 0.047 -0.483 a 3.957 3.957 0 0 0 -0.058 -0.586 a 6.288 6.288 0 0 0 -0.231 -0.947 c -0.199 -0.835 -0.397 -1.67 -0.594 -2.506 c -0.268 -1.151 -0.536 -2.301 -0.795 -3.454 c -0.134 -0.597 -0.273 -1.194 -0.386 -1.795 a 9.986 9.986 0 0 1 -0.165 -1.128 a 2.62 2.62 0 0 1 0.006 -0.56 c 0.028 -0.21 0.131 -0.438 0.33 -0.537 a 0.728 0.728 0 0 1 0.192 -0.066 a 0.33 0.33 0 0 1 0.121 -0.005 c 0.031 0.004 0.062 0.005 0.092 0.013 c 0.081 0.023 0.161 0.055 0.236 0.094 c 0.199 0.107 0.363 0.275 0.51 0.445 c 0.223 0.262 0.415 0.551 0.598 0.844 c 0.311 0.497 0.592 1.013 0.861 1.533 c 0.334 0.645 0.65 1.301 0.953 1.961 c 0.314 0.68 0.615 1.366 0.903 2.058 c 0.195 0.471 0.387 0.944 0.556 1.425 c 0.04 0.115 0.08 0.23 0.115 0.347 c 0.026 0.091 0.051 0.183 0.081 0.275 c 0.031 0.089 0.064 0.177 0.1 0.264 c 0.174 0.414 0.4 0.812 0.695 1.154 c 0.15 0.175 0.325 0.347 0.534 0.448 a 0.59 0.59 0 0 0 0.149 0.053 a 0.343 0.343 0 0 0 0.106 0.004 c 0.195 -0.027 0.294 -0.222 0.34 -0.393 a 1.553 1.553 0 0 0 0.051 -0.405 a 2.534 2.534 0 0 0 -0.033 -0.456 c -0.009 -0.058 -0.015 -0.123 -0.036 -0.179 c -0.004 -0.011 -0.011 -0.021 -0.015 -0.033 c -0.021 -0.05 -0.029 -0.076 -0.049 -0.129 c -0.149 -0.424 -0.289 -0.851 -0.432 -1.278 l -0.407 -1.202 c -0.13 -0.374 -0.259 -0.75 -0.396 -1.122 a 10.273 10.273 0 0 0 -0.266 -0.675 c -0.013 -0.027 -0.024 -0.056 -0.041 -0.082 a 1.142 1.142 0 0 1 -0.069 -0.116 c -0.035 -0.067 -0.034 -0.067 -0.066 -0.136 a 13.493 13.493 0 0 1 -0.359 -0.933 a 76.71 76.71 0 0 1 -0.37 -1.084 c -0.232 -0.691 -0.455 -1.386 -0.683 -2.079 c -0.065 -0.196 -0.134 -0.392 -0.197 -0.588 a 5.408 5.408 0 0 1 -0.069 -0.24 c -0.091 -0.367 -0.15 -0.75 -0.102 -1.128 l 0.005 -0.032 c 0.029 -0.101 0.029 -0.131 0.091 -0.216 a 0.5 0.5 0 0 1 0.524 -0.197 c 0.07 0.016 0.135 0.049 0.197 0.085 a 1.788 1.788 0 0 1 0.312 0.229 a 6.736 6.736 0 0 1 0.523 0.531 c 0.42 0.48 0.796 0.999 1.153 1.527 a 29.85 29.85 0 0 1 1.206 1.945 c 0.211 0.369 0.411 0.745 0.619 1.116 c 0.084 0.145 0.168 0.29 0.255 0.432 c 0.211 0.343 0.432 0.68 0.68 0.997 c 0.169 0.215 0.348 0.422 0.548 0.607 c 0.135 0.125 0.282 0.244 0.445 0.33 c 0.07 0.037 0.15 0.072 0.23 0.076 a 0.42 0.42 0 0 0 0.083 -0.039 a 0.74 0.74 0 0 0 0.253 -0.261 c 0.175 -0.304 0.096 -0.678 -0.034 -0.984 a 3.155 3.155 0 0 0 -0.196 -0.376 c -0.072 -0.116 -0.146 -0.23 -0.217 -0.347 a 31.33 31.33 0 0 1 -0.253 -0.439 c -0.52 -0.937 -1 -1.898 -1.473 -2.859 c -0.794 -1.617 -1.558 -3.249 -2.346 -4.869 c -0.117 -0.238 -0.241 -0.474 -0.354 -0.714 a 10.138 10.138 0 0 1 -0.524 -1.465 a 16.455 16.455 0 0 1 -0.412 -1.919 c -0.011 -0.075 -0.024 -0.145 -0.016 -0.222 a 0.511 0.511 0 0 1 0.271 -0.399 c 0.1 -0.053 0.132 -0.046 0.242 -0.058 c 0.039 0.001 0.038 0.001 0.075 0.004 c 0.345 0.037 0.625 0.262 0.858 0.503 c 0.19 0.197 0.359 0.413 0.517 0.636 c 0.209 0.291 0.399 0.595 0.58 0.906 l 0.027 0.048 c 0.119 0.145 0.25 0.278 0.389 0.402 c 0.453 0.403 1.02 0.732 1.638 0.758 c 0.142 0.006 0.283 -0.005 0.423 -0.028 a 1.707 1.707 0 0 0 0.402 -0.12 c 0.071 -0.036 0.156 -0.087 0.181 -0.169 a 0.3 0.3 0 0 0 0.005 -0.123 a 0.735 0.735 0 0 0 -0.068 -0.216 l -0.006 -0.012 a 52.058 52.058 0 0 0 -1.605 -1.872 a 31.19 31.19 0 0 0 -0.352 -0.382 c -0.099 -0.104 -0.202 -0.208 -0.3 -0.315 c -0.057 -0.064 -0.111 -0.13 -0.165 -0.196 a 5.283 5.283 0 0 1 -0.897 -1.705 c -0.026 -0.089 -0.043 -0.181 -0.075 -0.269 a 0.891 0.891 0 0 0 -0.049 -0.104 a 1.813 1.813 0 0 0 -0.284 -0.357 a 4.796 4.796 0 0 0 -0.353 -0.316 a 12.055 12.055 0 0 0 -1.349 -0.925 a 29.944 29.944 0 0 0 -1.256 -0.719 a 50.164 50.164 0 0 0 -0.944 -0.501 a 8.745 8.745 0 0 0 -2.037 -0.779 a 5.086 5.086 0 0 0 -1.485 -0.139 a 3.362 3.362 0 0 0 -1.096 0.249 c -0.189 0.08 -0.372 0.181 -0.53 0.313 l -0.014 0.013 l -0.016 0.014 l -0.106 0.077 c -0.042 0.016 -0.082 0.038 -0.124 0.048 a 0.514 0.514 0 0 1 -0.264 -0.008 a 0.514 0.514 0 0 1 -0.287 -0.754 a 0.871 0.871 0 0 1 0.199 -0.203 c 0.167 -0.135 0.351 -0.247 0.542 -0.342 a 4.218 4.218 0 0 1 1.573 -0.417 a 109.912 109.912 0 0 1 -1.924 -3.452 a 72.553 72.553 0 0 1 -1.421 -2.795 a 72.487 72.487 0 0 1 -1.003 -2.221 c -0.49 -1.125 -0.965 -2.254 -1.427 -3.389 a 123.52 123.52 0 0 1 -1.539 -3.975 a 75.514 75.514 0 0 1 -1.297 -3.818 a 45.031 45.031 0 0 1 -0.491 -1.696 c -0.123 -0.458 -0.239 -0.919 -0.36 -1.378 c -0.082 -0.308 -0.165 -0.617 -0.249 -0.924 a 162.435 162.435 0 0 0 -2.687 -8.712 c -0.044 -0.126 -0.087 -0.252 -0.135 -0.377 c -0.022 -0.05 -0.052 -0.098 -0.077 -0.146 c -0.125 -0.222 -0.251 -0.44 -0.378 -0.66 c -0.976 -1.675 -1.964 -3.342 -2.942 -5.013 a 263.86 263.86 0 0 1 -2.851 -4.976 a 71.25 71.25 0 0 1 -0.986 -1.824 a 17.5 17.5 0 0 1 -0.59 -1.208 a 22.14 22.14 0 0 1 -0.619 -1.639 a 59.5 59.5 0 0 1 -0.617 -1.904 a 162.186 162.186 0 0 1 -1.513 -5.252 a 279.27 279.27 0 0 1 -1.615 -6.184 a 97.387 97.387 0 0 1 -0.631 -2.667 a 27.178 27.178 0 0 1 -0.408 -2.264 c -0.145 -1.111 -0.215 -2.23 -0.263 -3.349 a 127.54 127.54 0 0 1 -0.101 -4.373 c -0.006 -0.595 -0.004 -1.19 -0.014 -1.784 a 21.913 21.913 0 0 0 -0.371 -3.538 a 21.416 21.416 0 0 0 -0.587 -2.344 a 21.121 21.121 0 0 0 -1.874 -4.287 a 18.16 18.16 0 0 0 -0.846 -1.327 a 10.06 10.06 0 0 0 -0.576 -0.757 a 8.017 8.017 0 0 0 -0.579 -0.602 a 12.199 12.199 0 0 0 -0.909 -0.791 c -1.238 -0.975 -2.683 -1.744 -4.244 -2.025 a 7.214 7.214 0 0 0 -1.444 -0.112 c -0.315 0.008 -0.628 0.044 -0.942 0.071 c -0.213 0.017 -0.424 0.032 -0.636 0.044 c -1.43 0.074 -2.869 0.041 -4.286 -0.183 a 13.74 13.74 0 0 1 -1.285 -0.264 a 7.17 7.17 0 0 1 -0.772 -0.238 a 16.337 16.337 0 0 1 -2.544 -1.017 a 12.841 12.841 0 0 1 -3.093 -2.162 a 11.617 11.617 0 0 1 -2.194 -2.88 c -0.747 -1.384 -1.211 -2.914 -1.412 -4.473 a 13.33 13.33 0 0 1 -0.113 -1.808 a 8.15 8.15 0 0 1 0.047 -0.938 a 31.507 31.507 0 0 1 0.212 -3.23 c 0.036 -0.29 0.075 -0.579 0.12 -0.868 Z m 19.555 194.274 a 0.527 0.527 0 0 1 0.251 0.08 a 0.515 0.515 0 0 1 0.204 0.597 a 0.647 0.647 0 0 1 -0.153 0.226 a 5.762 5.762 0 0 1 -2.67 1.606 a 6.134 6.134 0 0 1 -1.634 0.224 c -0.117 0 -0.234 -0.003 -0.349 -0.012 c -0.094 -0.006 -0.189 -0.012 -0.277 -0.05 a 0.512 0.512 0 0 1 -0.105 -0.875 a 0.524 0.524 0 0 1 0.274 -0.101 c 0.048 -0.003 0.093 0.005 0.14 0.009 a 4.129 4.129 0 0 0 0.412 0.011 c 0.248 -0.007 0.494 -0.029 0.739 -0.069 a 4.904 4.904 0 0 0 1.947 -0.768 a 4.767 4.767 0 0 0 0.744 -0.63 c 0.04 -0.043 0.079 -0.088 0.123 -0.127 a 0.52 0.52 0 0 1 0.354 -0.121 Z m -51.653 0 c 0.1 0.01 0.194 0.041 0.274 0.102 c 0.039 0.031 0.072 0.067 0.107 0.104 c 0.048 0.053 0.06 0.063 0.12 0.124 a 4.664 4.664 0 0 0 0.916 0.708 c 0.6 0.353 1.278 0.568 1.968 0.646 a 4.967 4.967 0 0 0 0.836 0.023 c 0.05 -0.004 0.1 -0.011 0.151 -0.013 c 0.03 0.001 0.058 0.005 0.088 0.009 a 0.52 0.52 0 0 1 0.377 0.301 a 0.513 0.513 0 0 1 -0.351 0.695 c -0.063 0.015 -0.129 0.018 -0.192 0.022 a 5.968 5.968 0 0 1 -1.101 -0.036 a 5.885 5.885 0 0 1 -3.11 -1.357 a 4.957 4.957 0 0 1 -0.508 -0.496 a 0.535 0.535 0 0 1 -0.113 -0.27 a 0.511 0.511 0 0 1 0.228 -0.482 a 0.553 0.553 0 0 1 0.31 -0.08 Z m 94.532 -59.207 l 0.01 0.019 c -0.008 -0.016 -0.014 -0.031 -0.01 -0.019 Z m 0.909 -0.456 l -0.007 -0.012 l 0.007 0.012 Z m -130.61 -7.107 a 0.436 0.436 0 0 0 0.072 -0.005 l 0.016 -0.003 a 2.614 2.614 0 0 0 -0.088 0.008 Z m 43.722 -13.767 a 0.634 0.634 0 0 1 0.141 0.03 c 0.109 0.044 0.108 0.048 0.234 0.108 c 0.806 0.392 1.589 0.831 2.343 1.32 c 2.64 1.715 4.904 3.977 6.793 6.487 c 0.587 0.782 1.14 1.59 1.654 2.423 a 25.16 25.16 0 0 1 1.138 2.028 l 0.047 0.099 a 0.553 0.553 0 0 1 0.05 0.234 a 0.512 0.512 0 0 1 -0.641 0.477 a 0.529 0.529 0 0 1 -0.302 -0.227 c -0.044 -0.081 -0.081 -0.165 -0.123 -0.247 c -0.079 -0.158 -0.092 -0.181 -0.18 -0.349 a 30.228 30.228 0 0 0 -2.636 -4.063 a 28.718 28.718 0 0 0 -1.996 -2.342 c -1.398 -1.474 -2.96 -2.8 -4.685 -3.875 c -0.673 -0.42 -1.37 -0.796 -2.086 -1.135 l -0.043 -0.024 a 0.538 0.538 0 0 1 -0.171 -0.168 a 0.514 0.514 0 0 1 0.104 -0.658 a 0.545 0.545 0 0 1 0.262 -0.115 c 0.049 -0.004 0.048 -0.004 0.097 -0.003 Z m 30.251 0.003 a 0.553 0.553 0 0 1 0.263 0.115 a 0.514 0.514 0 0 1 -0.067 0.826 c -0.109 0.058 -0.11 0.054 -0.227 0.11 c -0.16 0.077 -0.2 0.099 -0.359 0.177 c -0.699 0.359 -1.378 0.752 -2.033 1.186 c -2.553 1.692 -4.733 3.916 -6.547 6.375 a 30.264 30.264 0 0 0 -1.539 2.293 a 21.206 21.206 0 0 0 -1.022 1.851 l -0.024 0.043 a 0.548 0.548 0 0 1 -0.169 0.17 a 0.514 0.514 0 0 1 -0.624 -0.073 a 0.506 0.506 0 0 1 -0.117 -0.536 c 0.03 -0.074 0.031 -0.073 0.066 -0.144 c 0.344 -0.695 0.729 -1.369 1.137 -2.028 a 32.14 32.14 0 0 1 1.654 -2.423 c 1.929 -2.564 4.251 -4.869 6.964 -6.597 c 0.76 -0.483 1.549 -0.914 2.362 -1.3 l 0.045 -0.018 a 0.61 0.61 0 0 1 0.141 -0.03 c 0.049 -0.001 0.049 -0.001 0.096 0.003 Z m 48.641 12.778 l 0.029 0.017 l 0.008 0.004 c -0.03 -0.017 -0.064 -0.041 -0.037 -0.021 Z m -63.662 -41.596 a 0.512 0.512 0 0 1 0.39 0.765 c -0.032 0.05 -0.069 0.096 -0.106 0.143 l -0.184 0.256 c -0.14 0.205 -0.276 0.413 -0.403 0.626 a 9.3 9.3 0 0 0 -0.292 0.527 a 5.822 5.822 0 0 0 -0.42 1.051 c -0.02 0.078 -0.038 0.155 -0.053 0.232 c -0.079 0.398 -0.089 0.863 0.194 1.185 c 0.084 0.097 0.187 0.171 0.295 0.236 l 0.022 0.013 c 0.155 -0.013 0.311 -0.037 0.461 -0.079 c 0.103 -0.028 0.204 -0.065 0.299 -0.116 a 0.658 0.658 0 0 0 0.198 -0.149 c 0.132 -0.156 0.103 -0.375 0.049 -0.556 a 2.014 2.014 0 0 0 -0.179 -0.423 a 4.41 4.41 0 0 0 -0.109 -0.189 c -0.05 -0.081 -0.103 -0.157 -0.153 -0.237 l -0.03 -0.057 a 0.511 0.511 0 0 1 0.699 -0.654 a 0.53 0.53 0 0 1 0.17 0.142 c 0.05 0.069 0.096 0.14 0.142 0.213 c 0.261 0.419 0.492 0.887 0.519 1.389 c 0.008 0.147 -0.002 0.295 -0.036 0.439 a 1.376 1.376 0 0 1 -0.221 0.493 c -0.304 0.426 -0.813 0.642 -1.311 0.741 a 3.68 3.68 0 0 1 -0.455 0.06 c -0.096 0.006 -0.195 0.013 -0.289 -0.013 a 1.124 1.124 0 0 1 -0.215 -0.097 a 2.122 2.122 0 0 1 -0.621 -0.485 a 1.963 1.963 0 0 1 -0.422 -0.813 a 2.471 2.471 0 0 1 -0.067 -0.747 c 0.028 -0.556 0.202 -1.099 0.422 -1.606 c 0.181 -0.414 0.398 -0.813 0.637 -1.197 c 0.192 -0.309 0.397 -0.61 0.619 -0.899 l 0.043 -0.048 a 0.536 0.536 0 0 1 0.407 -0.146 Z m -3.717 -21.117 a 0.533 0.533 0 0 1 0.237 0.072 a 0.514 0.514 0 0 1 0.082 0.808 c -0.047 0.041 -0.098 0.076 -0.147 0.113 l -0.119 0.094 a 9.788 9.788 0 0 0 -1.428 1.457 a 9.513 9.513 0 0 0 -1.128 1.783 a 8.633 8.633 0 0 0 -0.375 0.906 c -0.052 0.149 -0.095 0.302 -0.144 0.451 c -0.013 0.03 -0.012 0.03 -0.026 0.058 a 0.523 0.523 0 0 1 -0.334 0.262 a 0.513 0.513 0 0 1 -0.62 -0.423 a 0.534 0.534 0 0 1 0.016 -0.218 c 0.047 -0.156 0.047 -0.156 0.096 -0.31 c 0.151 -0.447 0.327 -0.882 0.538 -1.304 a 10.804 10.804 0 0 1 2.765 -3.451 c 0.075 -0.061 0.152 -0.121 0.23 -0.179 a 0.594 0.594 0 0 1 0.143 -0.085 a 0.56 0.56 0 0 1 0.152 -0.034 h 0.062 Z m 6.793 0.001 a 0.546 0.546 0 0 1 0.151 0.036 a 0.602 0.602 0 0 1 0.141 0.087 c 0.076 0.058 0.15 0.118 0.223 0.179 a 10.867 10.867 0 0 1 2.818 3.722 c 0.13 0.286 0.247 0.578 0.35 0.874 c 0.056 0.164 0.111 0.327 0.155 0.494 c 0.007 0.032 0.007 0.032 0.011 0.062 a 0.529 0.529 0 0 1 -0.048 0.275 a 0.512 0.512 0 0 1 -0.795 0.16 a 0.553 0.553 0 0 1 -0.128 -0.176 c -0.027 -0.067 -0.044 -0.136 -0.065 -0.205 a 9.532 9.532 0 0 0 -0.462 -1.185 a 9.88 9.88 0 0 0 -2.603 -3.336 c -0.048 -0.037 -0.099 -0.073 -0.143 -0.114 c -0.023 -0.023 -0.023 -0.022 -0.043 -0.046 a 0.514 0.514 0 0 1 0.137 -0.76 a 0.545 0.545 0 0 1 0.239 -0.069 l 0.062 0.002 Z M 83.57 57.883 l 0.078 0.003 c 0.297 -0.005 0.584 -0.099 0.852 -0.222 c 0.345 -0.158 0.663 -0.37 0.961 -0.602 c 0.17 -0.132 0.331 -0.276 0.499 -0.411 c 0.096 -0.073 0.095 -0.073 0.193 -0.144 c 0.281 -0.197 0.575 -0.371 0.887 -0.514 a 6.317 6.317 0 0 1 1.935 -0.53 a 7.686 7.686 0 0 1 0.937 -0.042 c 0.15 0.005 0.3 0.012 0.449 0.031 l 0.042 0.007 l 0.04 0.01 c 0.096 0.032 0.188 0.071 0.283 0.106 c 0.121 0.045 0.242 0.088 0.364 0.132 c 2.102 0.724 4.312 1.102 6.522 1.289 a 36.77 36.77 0 0 0 4.592 0.101 l 0.061 0.001 a 0.547 0.547 0 0 1 0.282 0.108 c 0.181 0.144 0.242 0.4 0.146 0.611 a 0.516 0.516 0 0 1 -0.373 0.289 c -0.044 0.007 -0.097 0.009 -0.14 0.011 a 37.738 37.738 0 0 1 -6.348 -0.291 c -1.904 -0.253 -3.791 -0.666 -5.59 -1.346 l -0.063 -0.024 a 4.915 4.915 0 0 0 -0.955 0.005 a 5.19 5.19 0 0 0 -2.083 0.621 a 4.263 4.263 0 0 0 -0.553 0.37 c -0.142 0.112 -0.277 0.232 -0.417 0.345 a 6.632 6.632 0 0 1 -1.034 0.687 c -0.366 0.191 -0.76 0.342 -1.17 0.398 c -0.21 0.028 -0.422 0.031 -0.629 -0.005 l -0.039 0.006 a 2.176 2.176 0 0 1 -0.702 -0.017 a 3.584 3.584 0 0 1 -0.856 -0.277 a 5.943 5.943 0 0 1 -1.075 -0.658 c -0.203 -0.153 -0.392 -0.321 -0.589 -0.479 c -0.077 -0.06 -0.077 -0.059 -0.155 -0.117 a 4.7 4.7 0 0 0 -0.641 -0.38 c -0.834 -0.406 -1.791 -0.566 -2.714 -0.506 l -0.049 0.004 l -0.03 0.003 c -0.149 0.057 -0.298 0.112 -0.448 0.165 c -2.147 0.758 -4.404 1.162 -6.666 1.368 c -0.905 0.082 -1.812 0.132 -2.72 0.15 c -0.723 0.015 -1.445 0.011 -2.168 -0.022 l -0.078 -0.004 a 0.57 0.57 0 0 1 -0.232 -0.071 a 0.514 0.514 0 0 1 -0.101 -0.795 a 0.51 0.51 0 0 1 0.207 -0.127 c 0.052 -0.016 0.066 -0.016 0.12 -0.022 c 0.075 -0.001 0.15 0.004 0.226 0.007 c 0.156 0.007 0.313 0.011 0.47 0.016 a 36.828 36.828 0 0 0 5.603 -0.303 c 1.868 -0.248 3.723 -0.655 5.483 -1.336 l 0.039 -0.013 c 0.041 -0.01 0.041 -0.01 0.083 -0.017 c 0.088 -0.011 0.176 -0.018 0.264 -0.023 c 0.137 -0.007 0.273 -0.01 0.411 -0.01 c 0.265 0.005 0.529 0.02 0.792 0.054 a 6.152 6.152 0 0 1 2.249 0.722 c 0.239 0.135 0.468 0.287 0.683 0.457 c 0.145 0.113 0.281 0.235 0.424 0.35 c 0.073 0.058 0.146 0.115 0.222 0.171 c 0.387 0.28 0.81 0.539 1.277 0.659 c 0.127 0.033 0.258 0.054 0.389 0.054 c 0.025 0 0.049 0 0.075 -0.002 a 0.543 0.543 0 0 1 0.238 -0.045 c 0.036 -0.002 0.053 -0.003 0.098 0.003 c 0.05 0.006 0.097 0.021 0.142 0.041 Z m -9.392 -15.039 a 15.01 15.01 0 0 0 -0.175 0.869 c -0.038 0.23 -0.07 0.463 -0.086 0.696 c -0.01 0.157 -0.015 0.316 0.002 0.473 c 0.008 0.065 0.022 0.13 0.034 0.194 a 0.672 0.672 0 0 1 0.004 0.031 c 0.141 -0.746 0.216 -1.505 0.221 -2.263 Z m 22.774 -2.098 l 0.125 0.35 c 0.056 0.167 0.11 0.334 0.162 0.502 l 0.036 0.117 l 0.014 0.048 c 0.072 -0.249 0.143 -0.498 0.212 -0.747 c 0.29 -1.064 0.55 -2.137 0.724 -3.226 c 0.066 -0.413 0.119 -0.828 0.148 -1.245 a 6.41 6.41 0 0 0 -0.01 -1.159 l -0.008 -0.059 l -0.009 -0.062 l -0.005 -0.089 c 0.004 -0.03 0.005 -0.06 0.011 -0.09 a 0.53 0.53 0 0 1 0.066 -0.166 a 0.513 0.513 0 0 1 0.711 -0.154 a 0.498 0.498 0 0 1 0.175 0.2 c 0.014 0.026 0.023 0.056 0.033 0.083 c 0.075 0.26 0.147 0.52 0.218 0.781 l 0.045 0.172 l 0.114 -0.779 c 0.533 -3.808 0.884 -7.649 0.896 -11.497 a 52.6 52.6 0 0 0 -0.166 -4.51 a 36.506 36.506 0 0 0 -0.511 -3.855 a 26.876 26.876 0 0 0 -0.312 -1.427 c -0.337 -1.369 -0.789 -2.719 -1.429 -3.979 c -0.451 -0.886 -0.998 -1.727 -1.669 -2.464 a 9.34 9.34 0 0 0 -0.741 -0.721 l -0.055 -0.057 a 17.265 17.265 0 0 0 -0.657 -0.735 a 22.355 22.355 0 0 0 -1.462 -1.41 a 19.115 19.115 0 0 0 -2.211 -1.686 a 13.556 13.556 0 0 0 -2.2 -1.17 c -1.127 -0.464 -2.343 -0.746 -3.567 -0.688 a 6.739 6.739 0 0 0 -0.919 0.109 c -0.381 0.074 -0.756 0.181 -1.129 0.286 c -0.653 0.184 -1.304 0.388 -1.937 0.635 a 8.484 8.484 0 0 0 -1.161 0.539 a 3.58 3.58 0 0 0 -0.345 0.225 c -0.04 0.031 -0.08 0.063 -0.118 0.098 c -0.013 0.013 -0.026 0.025 -0.038 0.039 c -0.003 0.003 -0.022 0.027 -0.007 0.006 l 0.002 -0.003 l -0.052 0.073 l -0.063 0.062 c -0.025 0.016 -0.048 0.035 -0.073 0.049 a 0.504 0.504 0 0 1 -0.597 -0.071 c -0.016 -0.001 -0.031 -0.004 -0.048 -0.007 c -0.027 -0.005 -0.054 -0.015 -0.081 -0.023 a 4.503 4.503 0 0 0 -1.165 -0.287 a 4.422 4.422 0 0 0 -0.609 -0.019 c -1.14 0.045 -2.214 0.535 -3.139 1.177 a 10.704 10.704 0 0 0 -0.974 0.771 c -0.248 0.219 -0.487 0.449 -0.718 0.686 c -0.283 0.292 -0.554 0.597 -0.814 0.91 c -0.314 0.376 -0.611 0.766 -0.895 1.165 A 23.748 23.748 0 0 0 69.7 9.06 a 28.382 28.382 0 0 0 -1.571 3.054 a 31.18 31.18 0 0 0 -1.832 5.426 c -0.151 0.646 -0.28 1.296 -0.366 1.953 a 24.243 24.243 0 0 0 -0.182 3.407 c 0.013 1.28 0.102 2.559 0.24 3.833 c 0.153 1.407 0.365 2.808 0.62 4.2 a 80.41 80.41 0 0 0 1.306 5.824 l 0.017 0.064 c 0.045 -0.218 0.094 -0.436 0.145 -0.653 a 40.78 40.78 0 0 1 -0.388 -1.738 a 15.817 15.817 0 0 1 -0.276 -1.801 l -0.005 -0.074 a 0.509 0.509 0 0 1 0.472 -0.542 c 0.047 -0.001 0.046 -0.001 0.093 0.002 a 0.565 0.565 0 0 1 0.136 0.034 a 0.517 0.517 0 0 1 0.307 0.389 c 0.014 0.108 0.02 0.218 0.031 0.327 c 0.073 0.639 0.194 1.271 0.328 1.901 c 0.096 0.449 0.2 0.896 0.309 1.342 l 0.007 0.026 a 0.356 0.356 0 0 1 0.01 0.047 l 0.123 0.492 c 0.365 1.442 0.77 2.874 1.203 4.297 a 0.499 0.499 0 0 1 0.145 -0.316 a 0.512 0.512 0 0 1 0.696 -0.022 a 0.525 0.525 0 0 1 0.154 0.248 c 0.022 0.091 0.032 0.186 0.048 0.28 a 6.459 6.459 0 0 0 0.258 0.931 l 0.001 0.007 c 0.098 0.274 0.213 0.543 0.34 0.806 c 0.232 0.481 0.504 0.939 0.813 1.373 l 0.031 0.041 c 0.01 -0.103 0.021 -0.208 0.034 -0.312 c 0.016 -0.121 0.034 -0.241 0.054 -0.361 c 0.111 -0.637 0.26 -1.265 0.433 -1.888 a 24.463 24.463 0 0 1 0.277 -0.926 a 0.523 0.523 0 0 1 0.371 -0.315 a 28.2 28.2 0 0 0 -0.156 -1.765 a 19.674 19.674 0 0 0 -0.439 -2.446 a 6.08 6.08 0 0 1 -0.108 -0.17 c -0.647 -1.06 -0.959 -2.28 -1.169 -3.491 c -0.08 -0.482 -0.151 -0.967 -0.227 -1.449 a 9.39 9.39 0 0 0 -0.025 -0.165 l -0.028 0.009 c -0.399 0.119 -0.815 -0.039 -1.163 -0.23 a 3.618 3.618 0 0 1 -1.05 -0.901 a 4.935 4.935 0 0 1 -0.833 -1.501 c -0.015 -0.045 -0.024 -0.09 -0.034 -0.137 l -0.044 -0.196 c -0.025 -0.109 -0.042 -0.177 -0.069 -0.287 c -0.042 -0.173 -0.042 -0.173 -0.087 -0.345 c -0.098 -0.363 -0.195 -0.734 -0.348 -1.08 c -0.032 -0.074 -0.073 -0.143 -0.11 -0.214 c -0.043 -0.085 -0.043 -0.085 -0.083 -0.173 a 5.571 5.571 0 0 1 -0.23 -0.67 a 6.648 6.648 0 0 1 -0.189 -0.972 a 4.819 4.819 0 0 1 -0.029 -0.515 c 0.003 -0.519 0.113 -1.084 0.503 -1.455 c 0.07 -0.067 0.149 -0.123 0.231 -0.174 a 9.75 9.75 0 0 1 0.391 -0.208 c 0.34 -0.167 0.69 -0.315 1.072 -0.333 h 0.098 a 1.283 1.283 0 0 1 0.538 0.141 v -0.291 a 0.526 0.526 0 0 1 -0.067 -0.318 c 0.016 -0.098 0.018 -0.097 0.04 -0.196 c 0.069 -0.302 0.148 -0.601 0.238 -0.897 a 17.475 17.475 0 0 1 1.223 -2.939 a 27.987 27.987 0 0 1 1.921 -3.14 a 40.678 40.678 0 0 1 2.798 -3.545 a 37.734 37.734 0 0 1 2.093 -2.214 a 0.514 0.514 0 0 1 0.2 -0.387 a 0.57 0.57 0 0 1 0.263 -0.101 c 0.057 -0.002 0.057 -0.002 0.114 0.003 l 0.056 0.012 c 0.105 0.033 0.104 0.035 0.207 0.075 c 1.993 0.766 3.968 1.582 5.92 2.447 c 1.987 0.879 3.956 1.809 5.86 2.858 c 0.469 0.259 0.931 0.526 1.387 0.806 c 0.502 0.308 0.995 0.631 1.47 0.98 c 0.334 0.246 0.66 0.506 0.964 0.79 c 0.203 0.189 0.399 0.39 0.569 0.608 a 0.526 0.526 0 0 1 0.113 0.325 a 0.509 0.509 0 0 1 0.25 0.365 c 0.014 0.121 0.022 0.244 0.031 0.366 a 39.89 39.89 0 0 1 0.068 4.374 a 1.328 1.328 0 0 1 0.449 -0.119 c 0.049 -0.003 0.098 -0.004 0.146 -0.003 c 0.349 0.016 0.675 0.14 0.986 0.291 c 0.163 0.077 0.322 0.161 0.479 0.25 a 1.25 1.25 0 0 1 0.29 0.234 c 0.375 0.416 0.458 1.002 0.442 1.542 a 5.583 5.583 0 0 1 -0.149 1.077 a 6.332 6.332 0 0 1 -0.178 0.623 a 3.64 3.64 0 0 1 -0.16 0.401 c -0.04 0.083 -0.087 0.162 -0.128 0.244 a 3.616 3.616 0 0 0 -0.078 0.18 c -0.177 0.471 -0.303 0.961 -0.419 1.45 c -0.035 0.144 -0.063 0.291 -0.1 0.435 c -0.022 0.073 -0.05 0.145 -0.077 0.216 a 5.97 5.97 0 0 1 -0.17 0.384 a 4.85 4.85 0 0 1 -0.208 0.382 c -0.393 0.652 -0.946 1.243 -1.651 1.557 a 1.662 1.662 0 0 1 -0.621 0.166 a 1.081 1.081 0 0 1 -0.36 -0.051 l -0.025 0.156 c -0.075 0.482 -0.146 0.966 -0.225 1.448 c -0.026 0.146 -0.052 0.293 -0.08 0.438 a 12.577 12.577 0 0 1 -0.403 1.563 a 7.395 7.395 0 0 1 -0.788 1.658 l -0.052 0.205 a 21.95 21.95 0 0 0 -0.476 3.06 c 0.112 0.042 0.201 0.12 0.264 0.222 c 0.067 0.124 0.127 0.252 0.189 0.379 c 0.406 0.838 0.787 1.688 1.124 2.557 c 0.095 0.243 0.185 0.487 0.271 0.734 c 0.059 0.165 0.108 0.336 0.175 0.5 c 0.01 0.025 0.022 0.048 0.034 0.072 l 0.003 0.006 c 0.027 -0.026 0.052 -0.053 0.077 -0.081 c 0.259 -0.31 0.44 -0.686 0.599 -1.055 a 8.915 8.915 0 0 0 0.549 -1.793 c 0.01 -0.051 0.018 -0.102 0.026 -0.153 a 0.492 0.492 0 0 1 0.062 -0.182 a 0.496 0.496 0 0 1 0.354 -0.249 a 0.506 0.506 0 0 1 0.411 0.106 l 0.007 0.007 a 0.43 0.43 0 0 1 0.049 0.046 c 0.04 0.046 0.072 0.098 0.095 0.154 l 0.007 0.019 Z M 79.511 8.814 l -0.002 0.002 c -0.065 0.069 -0.134 0.133 -0.202 0.199 l -0.281 0.281 a 43.937 43.937 0 0 0 -2.942 3.322 a 34.632 34.632 0 0 0 -2.169 3.021 a 23.54 23.54 0 0 0 -1.359 2.427 c -0.366 0.76 -0.683 1.546 -0.92 2.355 c -0.045 0.152 -0.085 0.306 -0.123 0.459 c 0.002 0.224 -0.003 0.452 -0.003 0.676 c 0.003 0.442 0.006 0.885 0.031 1.326 a 6.432 6.432 0 0 0 0.032 0.35 c 0.065 0.161 0.126 0.325 0.182 0.49 c 0.082 0.245 0.157 0.492 0.222 0.742 c 0.016 0.058 0.016 0.057 0.029 0.115 a 0.526 0.526 0 0 1 -0.144 0.488 a 0.513 0.513 0 0 1 -0.705 -0.006 a 0.561 0.561 0 0 1 -0.129 -0.206 l -0.079 -0.302 a 9.63 9.63 0 0 0 -0.332 -0.974 a 7.29 7.29 0 0 0 -0.226 -0.492 c -0.039 -0.076 -0.078 -0.153 -0.123 -0.226 a 1.29 1.29 0 0 0 -0.105 -0.149 a 0.5 0.5 0 0 0 -0.138 -0.121 c -0.104 -0.052 -0.234 -0.02 -0.337 0.012 a 2.062 2.062 0 0 0 -0.111 0.037 c -0.09 0.034 -0.176 0.073 -0.262 0.114 a 5.462 5.462 0 0 0 -0.229 0.117 c -0.055 0.03 -0.125 0.063 -0.183 0.099 a 0.3 0.3 0 0 0 -0.048 0.04 a 0.672 0.672 0 0 0 -0.133 0.286 a 1.92 1.92 0 0 0 -0.044 0.428 a 4.3 4.3 0 0 0 0.124 0.989 a 4.1 4.1 0 0 0 0.267 0.816 c 0.026 0.056 0.058 0.108 0.086 0.162 c 0.04 0.078 0.04 0.078 0.076 0.158 c 0.144 0.337 0.251 0.687 0.349 1.039 c 0.098 0.352 0.182 0.708 0.262 1.064 l 0.01 0.043 c 0.131 0.368 0.313 0.718 0.545 1.031 c 0.161 0.22 0.347 0.422 0.56 0.591 c 0.134 0.106 0.279 0.198 0.436 0.269 c 0.071 0.03 0.144 0.062 0.221 0.075 l 0.01 0.001 a 0.596 0.596 0 0 0 0.065 -0.203 c 0.024 -0.14 0.024 -0.279 0.019 -0.42 a 240.86 240.86 0 0 0 -0.368 -2.289 l -0.006 -0.066 a 0.554 0.554 0 0 1 0.06 -0.256 a 0.515 0.515 0 0 1 0.564 -0.256 a 0.519 0.519 0 0 1 0.347 0.286 c 0.024 0.054 0.025 0.071 0.038 0.127 c 0.117 0.714 0.231 1.428 0.345 2.142 l 0.03 0.192 l 0.271 1.719 c 0.074 0.479 0.144 0.958 0.223 1.435 c 0.032 0.182 0.065 0.364 0.102 0.545 c 0.175 0.834 0.415 1.668 0.831 2.412 a 0.543 0.543 0 0 1 0.185 0.178 c 0.049 0.08 0.069 0.171 0.093 0.26 l 0.003 0.011 l 0.025 0.036 c 0.451 0.632 1.045 1.138 1.693 1.557 c 0.658 0.425 1.363 0.764 2.097 1.037 c 0.934 0.346 1.903 0.602 2.883 0.784 c 0.393 0.073 0.789 0.134 1.186 0.177 c 0.291 0.032 0.583 0.057 0.876 0.057 c 0.242 0 0.485 -0.017 0.726 -0.04 a 15.4 15.4 0 0 0 0.774 -0.09 a 20.642 20.642 0 0 0 2.351 -0.474 c 0.892 -0.236 1.777 -0.529 2.604 -0.943 c 0.271 -0.136 0.533 -0.287 0.789 -0.449 c 0.528 -0.334 1.026 -0.719 1.441 -1.187 c 0.133 -0.151 0.257 -0.31 0.372 -0.474 l 0.001 -0.002 c 0.025 -0.091 0.043 -0.179 0.093 -0.26 a 0.503 0.503 0 0 1 0.179 -0.173 c 0.534 -0.952 0.784 -2.045 0.96 -3.115 c 0.168 -1.067 0.332 -2.135 0.502 -3.202 c 0.096 -0.593 0.191 -1.186 0.288 -1.778 l 0.059 -0.361 c 0.014 -0.057 0.014 -0.072 0.038 -0.127 a 0.508 0.508 0 0 1 0.48 -0.298 l 0.066 0.007 a 0.613 0.613 0 0 1 0.186 0.069 a 0.518 0.518 0 0 1 0.237 0.383 c 0.006 0.059 0.002 0.074 -0.004 0.133 c -0.118 0.71 -0.232 1.421 -0.347 2.133 l -0.024 0.154 l -0.001 0.026 c -0.002 0.044 -0.002 0.088 -0.002 0.132 c 0.001 0.06 0.005 0.118 0.011 0.178 a 0.812 0.812 0 0 0 0.074 0.288 l 0.003 0.005 c 0.068 -0.007 0.133 -0.036 0.196 -0.062 c 0.144 -0.06 0.281 -0.141 0.407 -0.233 c 0.194 -0.143 0.366 -0.315 0.517 -0.502 c 0.257 -0.314 0.454 -0.669 0.607 -1.046 l 0.028 -0.074 l 0.017 -0.049 c 0.04 -0.184 0.084 -0.368 0.127 -0.551 c 0.072 -0.287 0.146 -0.572 0.231 -0.855 c 0.066 -0.221 0.138 -0.443 0.227 -0.657 c 0.034 -0.082 0.072 -0.164 0.113 -0.243 c 0.028 -0.054 0.06 -0.106 0.087 -0.161 l 0.056 -0.13 a 5.18 5.18 0 0 0 0.312 -1.277 a 2.97 2.97 0 0 0 0.007 -0.653 a 1.149 1.149 0 0 0 -0.084 -0.338 a 0.358 0.358 0 0 0 -0.132 -0.165 c -0.109 -0.061 -0.221 -0.118 -0.332 -0.175 a 2.875 2.875 0 0 0 -0.447 -0.188 a 0.583 0.583 0 0 0 -0.274 -0.033 c -0.101 0.019 -0.177 0.106 -0.235 0.184 a 0.975 0.975 0 0 0 -0.053 0.078 c -0.02 0.03 -0.04 0.063 -0.057 0.095 c -0.032 0.059 -0.055 0.1 -0.085 0.16 a 7.887 7.887 0 0 0 -0.493 1.24 a 9.455 9.455 0 0 0 -0.092 0.317 c -0.019 0.071 -0.035 0.142 -0.054 0.212 c -0.015 0.039 -0.015 0.038 -0.033 0.075 a 0.521 0.521 0 0 1 -0.268 0.241 a 0.513 0.513 0 0 1 -0.675 -0.351 a 0.553 0.553 0 0 1 -0.002 -0.243 c 0.024 -0.1 0.052 -0.2 0.079 -0.3 a 10.842 10.842 0 0 1 0.351 -1.033 c 0.013 -0.139 0.025 -0.277 0.036 -0.416 a 37.937 37.937 0 0 0 0.028 -5.141 a 37.032 37.032 0 0 0 -0.035 -0.478 c -0.005 -0.066 -0.011 -0.132 -0.014 -0.199 V 17 a 0.747 0.747 0 0 1 -0.104 -0.076 c -0.054 -0.06 -0.103 -0.123 -0.156 -0.184 a 7.382 7.382 0 0 0 -1.011 -0.916 c -0.304 -0.234 -0.62 -0.454 -0.941 -0.666 c -1.068 -0.704 -2.192 -1.322 -3.327 -1.907 c -1.788 -0.922 -3.621 -1.759 -5.468 -2.558 a 126.665 126.665 0 0 0 -4.585 -1.879 Z m 3.596 24.703 c 0.269 0.009 0.536 0.04 0.794 0.12 c 0.052 0.017 0.103 0.034 0.153 0.053 a 0.387 0.387 0 0 1 0.165 0.651 a 0.38 0.38 0 0 1 -0.355 0.092 c -0.064 -0.016 -0.125 -0.046 -0.188 -0.066 a 1.764 1.764 0 0 0 -0.177 -0.045 a 2.927 2.927 0 0 0 -1.076 0.018 a 3.75 3.75 0 0 0 -0.264 0.06 c -0.05 0.013 -0.098 0.031 -0.148 0.04 a 0.399 0.399 0 0 1 -0.28 -0.065 a 0.385 0.385 0 0 1 -0.014 -0.614 a 0.536 0.536 0 0 1 0.177 -0.08 l 0.157 -0.041 c 0.285 -0.069 0.576 -0.107 0.87 -0.121 l 0.186 -0.002 Z m -3.84 -1.713 a 0.235 0.235 0 0 1 0.054 0.01 c 0.092 0.034 0.181 0.074 0.272 0.108 c 0.714 0.258 1.456 0.431 2.207 0.529 c 1.131 0.148 2.284 0.124 3.406 -0.086 a 10.483 10.483 0 0 0 1.695 -0.47 c 0.073 -0.028 0.145 -0.059 0.22 -0.084 l 0.054 -0.008 a 0.256 0.256 0 0 1 0.242 0.363 a 0.272 0.272 0 0 1 -0.113 0.117 c -0.107 0.048 -0.218 0.086 -0.328 0.125 c -0.577 0.206 -1.168 0.367 -1.772 0.475 c -1.236 0.22 -2.509 0.225 -3.749 0.032 a 11.29 11.29 0 0 1 -1.287 -0.276 a 8.368 8.368 0 0 1 -0.977 -0.329 c -0.036 -0.015 -0.036 -0.014 -0.069 -0.032 a 0.268 0.268 0 0 1 -0.097 -0.095 a 0.258 0.258 0 0 1 0.042 -0.306 a 0.295 0.295 0 0 1 0.118 -0.067 a 0.378 0.378 0 0 1 0.082 -0.006 Z m 2.28 -1.55 c 0.144 0.005 0.287 0.018 0.426 0.058 c 0.111 0.031 0.219 0.079 0.328 0.117 c 0.064 0.021 0.129 0.041 0.193 0.06 c 0.236 0.062 0.475 0.097 0.717 0.075 c 0.203 -0.018 0.401 -0.069 0.593 -0.135 c 0.09 -0.031 0.179 -0.066 0.268 -0.099 c 0.06 -0.018 0.059 -0.018 0.12 -0.033 c 0.435 -0.091 0.885 -0.02 1.312 0.084 a 9.378 9.378 0 0 1 1.633 0.578 c 0.031 0.015 0.03 0.015 0.059 0.033 a 0.4 0.4 0 0 1 0.154 0.22 a 0.383 0.383 0 0 1 -0.493 0.455 c -0.117 -0.046 -0.23 -0.099 -0.345 -0.148 c -0.473 -0.189 -0.957 -0.364 -1.46 -0.455 a 2.584 2.584 0 0 0 -0.439 -0.046 a 0.914 0.914 0 0 0 -0.325 0.046 c -0.08 0.03 -0.159 0.06 -0.238 0.087 a 3.54 3.54 0 0 1 -0.694 0.165 a 2.624 2.624 0 0 1 -0.834 -0.037 a 3.569 3.569 0 0 1 -0.466 -0.128 c -0.098 -0.032 -0.191 -0.074 -0.29 -0.105 a 1.19 1.19 0 0 0 -0.086 -0.018 c -0.3 -0.039 -0.611 0.021 -0.902 0.092 a 7.792 7.792 0 0 0 -1.029 0.329 c -0.117 0.046 -0.176 0.069 -0.289 0.116 c -0.072 0.031 -0.142 0.064 -0.214 0.093 l -0.066 0.016 a 0.424 0.424 0 0 1 -0.17 -0.013 a 0.387 0.387 0 0 1 -0.233 -0.525 a 0.401 0.401 0 0 1 0.161 -0.173 c 0.074 -0.037 0.15 -0.068 0.227 -0.101 c 0.388 -0.161 0.782 -0.307 1.188 -0.42 a 4.679 4.679 0 0 1 1.07 -0.187 l 0.124 -0.001 Z m 2.83 -3.979 c 0.194 0.011 0.376 0.075 0.551 0.158 c 0.174 0.082 0.34 0.182 0.5 0.291 c 0.082 0.055 0.163 0.112 0.241 0.171 c 0.033 0.025 0.069 0.049 0.095 0.083 a 0.246 0.246 0 0 1 0.056 0.181 a 0.257 0.257 0 0 1 -0.378 0.2 c -0.048 -0.029 -0.09 -0.067 -0.135 -0.099 c -0.075 -0.055 -0.082 -0.059 -0.163 -0.115 a 2.996 2.996 0 0 0 -0.543 -0.3 c -0.085 -0.034 -0.19 -0.074 -0.283 -0.058 c -0.004 0.001 -0.01 0.001 -0.013 0.004 c -0.017 0.019 -0.031 0.039 -0.05 0.055 a 0.275 0.275 0 0 1 -0.18 0.058 a 0.257 0.257 0 0 1 -0.227 -0.32 a 0.287 0.287 0 0 1 0.057 -0.106 a 0.495 0.495 0 0 1 0.229 -0.167 a 0.65 0.65 0 0 1 0.243 -0.036 Z m -2.065 0.002 a 0.706 0.706 0 0 1 0.122 0.02 a 0.507 0.507 0 0 1 0.311 0.241 a 0.253 0.253 0 1 1 -0.424 0.274 c -0.006 -0.008 -0.011 -0.019 -0.02 -0.023 c -0.017 -0.005 -0.035 -0.005 -0.052 -0.005 a 0.985 0.985 0 0 0 -0.35 0.109 a 3.69 3.69 0 0 0 -0.523 0.313 c -0.04 0.028 -0.089 0.065 -0.129 0.095 c -0.026 0.02 -0.051 0.04 -0.079 0.058 a 0.344 0.344 0 0 1 -0.067 0.026 a 0.27 0.27 0 0 1 -0.12 -0.001 a 0.257 0.257 0 0 1 -0.103 -0.441 a 6.458 6.458 0 0 1 0.415 -0.293 c 0.273 -0.172 0.574 -0.339 0.901 -0.373 c 0.04 -0.002 0.078 -0.002 0.118 0 Z m 1.67 -5.118 a 0.258 0.258 0 0 1 0.219 0.185 c 0.237 0.978 0.505 1.955 0.61 2.955 a 0.267 0.267 0 0 1 -0.044 0.162 a 0.255 0.255 0 0 1 -0.454 -0.075 c -0.237 -0.978 -0.506 -1.955 -0.61 -2.956 a 0.296 0.296 0 0 1 0.008 -0.084 c 0.03 -0.11 0.126 -0.18 0.236 -0.188 l 0.035 0.001 Z m 4.44 -1.022 a 3.332 3.332 0 0 0 -0.522 0.154 c -0.237 0.092 -0.47 0.212 -0.663 0.38 a 1.173 1.173 0 0 0 -0.168 0.177 c -0.034 0.046 -0.062 0.096 -0.096 0.141 c -0.02 0.022 -0.02 0.022 -0.041 0.042 a 0.39 0.39 0 0 1 -0.261 0.095 a 0.385 0.385 0 0 1 -0.33 -0.555 c 0.043 -0.085 0.102 -0.164 0.162 -0.238 c 0.142 -0.173 0.317 -0.318 0.504 -0.442 c 0.233 -0.152 0.488 -0.269 0.75 -0.36 a 4.393 4.393 0 0 1 1.173 -0.228 c 0.092 -0.004 0.183 -0.005 0.274 -0.004 c 0.347 0.013 0.686 0.068 1.004 0.214 c 0.113 0.058 0.226 0.116 0.341 0.172 c 0.322 0.152 0.65 0.287 0.985 0.406 c 0.251 0.088 0.506 0.164 0.758 0.248 a 0.75 0.75 0 0 1 0.077 0.034 a 0.384 0.384 0 0 1 -0.006 0.683 c -0.023 0.011 -0.048 0.019 -0.071 0.03 c -0.055 0.027 -0.108 0.059 -0.161 0.089 c -0.192 0.118 -0.376 0.248 -0.563 0.373 c -0.074 0.046 -0.148 0.093 -0.224 0.136 c -0.117 0.064 -0.236 0.12 -0.363 0.16 c -0.18 0.058 -0.368 0.085 -0.556 0.094 c -0.129 0.007 -0.272 0.031 -0.395 -0.025 a 0.364 0.364 0 0 1 -0.116 -0.08 a 0.387 0.387 0 0 1 -0.013 -0.519 a 0.396 0.396 0 0 1 0.248 -0.129 c 0.104 -0.006 0.21 -0.006 0.315 -0.014 a 1.33 1.33 0 0 0 0.312 -0.063 c 0.166 -0.058 0.314 -0.159 0.459 -0.255 l 0.056 -0.039 a 13.445 13.445 0 0 1 -0.761 -0.299 c -0.14 -0.062 -0.278 -0.125 -0.414 -0.192 c -0.09 -0.045 -0.18 -0.095 -0.271 -0.138 a 1.315 1.315 0 0 0 -0.105 -0.038 l -0.087 -0.025 a 0.789 0.789 0 1 1 -1.231 0.015 Z m -11.408 -0.016 c -0.066 0.018 -0.13 0.039 -0.193 0.064 c -0.127 0.059 -0.25 0.128 -0.376 0.189 c -0.347 0.162 -0.699 0.305 -1.059 0.435 l -0.011 0.004 c 0.193 0.133 0.393 0.274 0.625 0.327 c 0.171 0.039 0.344 0.035 0.519 0.045 l 0.056 0.011 a 0.389 0.389 0 0 1 0.209 0.139 a 0.385 0.385 0 0 1 -0.122 0.566 a 0.408 0.408 0 0 1 -0.162 0.045 c -0.087 0.001 -0.172 -0.004 -0.258 -0.008 a 2.212 2.212 0 0 1 -0.604 -0.11 a 2.533 2.533 0 0 1 -0.449 -0.222 c -0.16 -0.103 -0.314 -0.213 -0.473 -0.317 a 4.68 4.68 0 0 0 -0.32 -0.193 c -0.037 -0.019 -0.077 -0.032 -0.114 -0.051 l -0.046 -0.031 a 0.385 0.385 0 0 1 -0.051 -0.552 a 0.463 0.463 0 0 1 0.189 -0.123 c 0.201 -0.067 0.404 -0.128 0.605 -0.195 c 0.321 -0.112 0.638 -0.231 0.947 -0.371 c 0.181 -0.081 0.356 -0.17 0.533 -0.26 c 0.057 -0.026 0.056 -0.026 0.114 -0.05 c 0.287 -0.109 0.584 -0.153 0.889 -0.164 h 0.136 c 0.469 0.011 0.936 0.094 1.378 0.256 c 0.281 0.102 0.552 0.237 0.795 0.414 c 0.163 0.118 0.311 0.256 0.433 0.417 a 0.797 0.797 0 0 1 0.153 0.264 a 0.386 0.386 0 0 1 -0.304 0.47 a 0.38 0.38 0 0 1 -0.358 -0.131 c -0.037 -0.044 -0.063 -0.095 -0.097 -0.141 a 1.62 1.62 0 0 0 -0.076 -0.089 a 2.046 2.046 0 0 0 -0.703 -0.447 a 3.266 3.266 0 0 0 -0.575 -0.176 a 0.789 0.789 0 1 1 -1.23 -0.015 Z m 0.608 0.781 a 0.279 0.279 0 0 1 0 -0.557 a 0.278 0.278 0 1 1 0 0.557 Z m 11.142 -0.279 a 0.279 0.279 0 1 1 0.279 0.279 a 0.278 0.278 0 0 1 -0.279 -0.279 Z m 0.865 -3.77 c 0.239 0.007 0.476 0.026 0.712 0.066 a 5.168 5.168 0 0 1 2.361 1.069 c 0.031 0.028 0.062 0.054 0.086 0.088 a 0.385 0.385 0 0 1 -0.14 0.569 a 0.379 0.379 0 0 1 -0.372 -0.022 c -0.035 -0.021 -0.064 -0.05 -0.095 -0.075 l -0.091 -0.073 c -0.073 -0.054 -0.149 -0.104 -0.224 -0.155 a 4.471 4.471 0 0 0 -1.558 -0.632 a 4.05 4.05 0 0 0 -1.756 0.052 a 4.672 4.672 0 0 0 -0.803 0.284 c -0.142 0.065 -0.277 0.142 -0.417 0.212 c -0.025 0.012 -0.025 0.012 -0.051 0.02 a 0.394 0.394 0 0 1 -0.296 -0.034 a 0.385 0.385 0 0 1 -0.172 -0.458 a 0.397 0.397 0 0 1 0.176 -0.207 a 5.781 5.781 0 0 1 1.237 -0.52 a 5 5 0 0 1 1.276 -0.185 l 0.127 0.001 Z m -12.463 -0.001 c 0.481 0.008 0.957 0.083 1.417 0.227 a 5.86 5.86 0 0 1 1.142 0.507 a 0.447 0.447 0 0 1 0.107 0.127 a 0.387 0.387 0 0 1 -0.226 0.542 a 0.393 0.393 0 0 1 -0.272 -0.019 c -0.096 -0.049 -0.191 -0.102 -0.287 -0.151 a 4.561 4.561 0 0 0 -1.507 -0.448 a 4.23 4.23 0 0 0 -2.738 0.683 a 4.149 4.149 0 0 0 -0.276 0.195 l -0.112 0.093 l -0.046 0.029 a 0.395 0.395 0 0 1 -0.243 0.042 a 0.385 0.385 0 0 1 -0.288 -0.531 a 0.379 0.379 0 0 1 0.078 -0.114 c 0.062 -0.062 0.135 -0.116 0.205 -0.168 a 5.213 5.213 0 0 1 1.987 -0.905 c 0.226 -0.049 0.456 -0.079 0.687 -0.098 a 6.6 6.6 0 0 1 0.372 -0.011 Z"></path>
                                                  </g>
                                                  <g class="body-parts">
                                                    <path
                                                      class="body-area body-area-head hover_body"
                                                      title=""
                                                      data-toggle="popover"
                                                      data-container="body"
                                                      data-placement="right"
                                                      type="button"
                                                      data-html="true"
                                                      href="#"
                                                      body_part="Head"
                                                      id="body-area-head"
                                                      data-original-title="Head"
                                                      d="M 65.637 17.549 l -0.38 0.031 l 0.05 -0.271 a 31.737 31.737 0 0 1 3.108 -8.055 c 0.331 -0.595 0.682 -1.178 1.058 -1.745 c 0.29 -0.438 0.594 -0.867 0.913 -1.283 c 0.27 -0.351 0.551 -0.694 0.844 -1.026 c 0.203 -0.228 0.412 -0.451 0.626 -0.668 c 0.21 -0.21 0.424 -0.415 0.647 -0.611 c 1.116 -0.99 2.441 -1.827 3.925 -2.108 c 0.271 -0.052 0.545 -0.082 0.822 -0.095 c 0.1 -0.003 0.2 -0.004 0.301 -0.003 a 5.395 5.395 0 0 1 1.807 0.349 l 0.064 0.025 a 3.09 3.09 0 0 1 0.187 -0.143 c 0.383 -0.272 0.812 -0.48 1.243 -0.665 a 19.026 19.026 0 0 1 2.28 -0.792 c 0.244 -0.07 0.489 -0.137 0.735 -0.201 c 0.216 -0.057 0.434 -0.112 0.653 -0.154 a 8.094 8.094 0 0 1 1.212 -0.131 c 0.149 -0.003 0.149 -0.003 0.3 -0.003 a 8.8 8.8 0 0 1 1.179 0.097 c 1.005 0.152 1.979 0.477 2.899 0.905 c 1.233 0.575 2.376 1.333 3.434 2.183 c 0.366 0.294 0.722 0.601 1.068 0.918 a 21.416 21.416 0 0 1 1.826 1.876 l 0.044 0.052 c 0.092 0.08 0.091 0.08 0.182 0.162 c 0.105 0.099 0.105 0.098 0.208 0.198 c 0.309 0.306 0.601 0.627 0.871 0.968 c 0.814 1.027 1.439 2.193 1.931 3.404 c 0.769 1.896 1.221 3.912 1.512 5.933 l 0.074 0.892 l -0.469 -0.039 h -0.227 a 8.657 8.657 0 0 0 -1.115 0.092 l -2.052 0.603 l -1.443 -0.772 a 32.367 32.367 0 0 0 -4.333 -1.762 a 29.19 29.19 0 0 0 -5.479 -1.209 a 28.849 28.849 0 0 0 -3.891 -0.193 c -1.04 0.025 -2.078 0.102 -3.109 0.239 a 28.46 28.46 0 0 0 -6.678 1.739 a 27.31 27.31 0 0 0 -2.316 1.043 l -1.432 0.822 l -1.737 -0.51 l -1.116 -0.092 h -0.226 Z"
                                                      onClick={
                                                        this.attributeSymptomTag
                                                      }
                                                      gender="female"
                                                    ></path>
                                                    <path
                                                      class="body-area body-area-eyes hover_body"
                                                      body_part="Eyes"
                                                      title=""
                                                      data-toggle="popover"
                                                      data-container="body"
                                                      data-placement="right"
                                                      type="button"
                                                      data-html="true"
                                                      href="#"
                                                      id="body-area-eyes"
                                                      data-original-title="Eyes"
                                                      d="M 77.128 16.572 c 2.405 0 4.358 1.574 4.358 3.513 c 0 1.939 -1.953 3.514 -4.358 3.514 c -2.406 0 -4.358 -1.575 -4.358 -3.514 c 0 -1.939 1.952 -3.513 4.358 -3.513 Z m 12.358 0 c 2.489 0 4.51 1.558 4.51 3.476 s -2.021 3.476 -4.51 3.476 c -2.488 0 -4.509 -1.558 -4.509 -3.476 s 2.021 -3.476 4.509 -3.476 Z"
                                                      onClick={
                                                        this.attributeSymptomTag
                                                      }
                                                      gender="female"
                                                    ></path>
                                                    <path
                                                      class="body-area body-area-ears hover_body"
                                                      title=""
                                                      data-toggle="popover"
                                                      data-container="body"
                                                      data-placement="right"
                                                      type="button"
                                                      data-html="true"
                                                      href="#"
                                                      body_part="ears"
                                                      id="body-area-ears"
                                                      data-original-title="Ears"
                                                      d="M 100.678 35.507 l -0.1 0.009 a 7.172 7.172 0 0 1 -2.551 -0.509 a 7.59 7.59 0 0 1 -2.043 -1.225 a 8.241 8.241 0 0 1 -1.505 -1.659 a 8.811 8.811 0 0 1 -1.228 -2.658 a 9.252 9.252 0 0 1 0.367 -5.937 a 8.725 8.725 0 0 1 0.975 -1.748 a 8.225 8.225 0 0 1 1.244 -1.372 a 7.664 7.664 0 0 1 1.926 -1.239 a 7.181 7.181 0 0 1 3.113 -0.618 l 0.468 0.042 l 0.252 3.015 a 65.096 65.096 0 0 1 -0.034 4.9 a 84.266 84.266 0 0 1 -0.884 8.999 Z M 65.85 18.549 l 0.978 0.081 a 7.186 7.186 0 0 1 1.836 0.539 c 0.7 0.312 1.35 0.734 1.926 1.239 c 0.49 0.43 0.926 0.92 1.301 1.452 a 8.783 8.783 0 0 1 1.257 2.639 a 9.26 9.26 0 0 1 -0.226 5.752 a 8.729 8.729 0 0 1 -1.031 1.953 a 8.188 8.188 0 0 1 -1.448 1.578 a 7.56 7.56 0 0 1 -2.132 1.259 a 5.97 5.97 0 0 1 -1.773 0.403 a 74.528 74.528 0 0 1 -0.767 -3.477 a 62.681 62.681 0 0 1 -0.713 -4.432 a 42.806 42.806 0 0 1 -0.323 -4.395 a 25.952 25.952 0 0 1 0.188 -3.78 l 0.143 -0.763 l 0.584 -0.048 h 0.2 Z"
                                                      onClick={
                                                        this.attributeSymptomTag
                                                      }
                                                      gender="female"
                                                    ></path>
                                                    <path
                                                      class="body-area body-area-nose hover_body"
                                                      id="body-area-nose"
                                                      title=""
                                                      data-toggle="popover"
                                                      data-container="body"
                                                      data-placement="right"
                                                      type="button"
                                                      data-html="true"
                                                      href="#"
                                                      body_part="Nose"
                                                      data-original-title="Nose"
                                                      fill-rule="nonzero"
                                                      d="M 83.299 20.048 c 1.557 -0.021 1.971 1.877 2 2.108 l 1 4.839 c -0.003 0.28 -0.041 0.556 -0.139 0.814 a 2.098 2.098 0 0 1 -0.261 0.491 a 1.759 1.759 0 0 1 -0.913 0.667 c -0.129 0.037 -0.26 0.056 -0.392 0.062 c -0.878 0.013 -1.757 0.036 -2.635 -0.002 a 1.628 1.628 0 0 1 -0.389 -0.073 a 1.763 1.763 0 0 1 -0.871 -0.654 a 2.098 2.098 0 0 1 -0.261 -0.491 a 2.19 2.19 0 0 1 -0.13 -0.58 a 3.459 3.459 0 0 1 -0.01 -0.25 c 0.257 -1.702 0.732 -3.123 1.001 -4.823 c 0.062 -0.33 0.443 -2.087 2 -2.108 Z"
                                                      onClick={
                                                        this.attributeSymptomTag
                                                      }
                                                      gender="female"
                                                    ></path>
                                                    <path
                                                      class="body-area body-area-oral_cavity hover_body"
                                                      id="body-area-oral_cavity"
                                                      title=""
                                                      data-toggle="popover"
                                                      data-container="body"
                                                      data-placement="right"
                                                      type="button"
                                                      data-html="true"
                                                      href="#"
                                                      body_part="oral_cavity"
                                                      data-original-title="Oral Cavity"
                                                      d="M 73.474 31.419 l 0.529 -0.223 a 27.239 27.239 0 0 1 8.268 -1.476 a 27.257 27.257 0 0 1 10.858 2.031 l 0.316 0.581 l -0.142 1.01 c -0.242 0.968 -0.666 1.895 -1.286 2.68 a 6.27 6.27 0 0 1 -1.396 1.295 a 6.714 6.714 0 0 1 -0.761 0.444 c -0.222 0.111 -0.451 0.21 -0.679 0.307 c -0.544 0.231 -1.096 0.44 -1.658 0.623 c -0.737 0.24 -1.489 0.436 -2.253 0.568 c -0.671 0.117 -1.35 0.184 -2.031 0.171 a 3.371 3.371 0 0 1 -0.469 -0.036 l -0.071 0.003 a 6.263 6.263 0 0 1 -0.698 -0.035 a 10.225 10.225 0 0 1 -0.78 -0.108 a 13.888 13.888 0 0 1 -2.403 -0.655 a 17.146 17.146 0 0 1 -2.921 -1.405 a 5.188 5.188 0 0 1 -0.553 -0.416 c -0.858 -0.739 -1.449 -1.738 -1.816 -2.801 a 9.027 9.027 0 0 1 -0.404 -1.702 l -0.018 -0.162 l 0.368 -0.694 Z"
                                                      onClick={
                                                        this.attributeSymptomTag
                                                      }
                                                      gender="female"
                                                    ></path>
                                                    <path
                                                      class="body-area body-area-neck_or_throat hover_body"
                                                      id="body-area-neck_or_throat"
                                                      title=""
                                                      data-toggle="popover"
                                                      data-container="body"
                                                      data-placement="right"
                                                      type="button"
                                                      data-html="true"
                                                      href="#"
                                                      body_part="neck_or_throat"
                                                      data-original-title="Neck or Throat "
                                                      d="M 91.889 37.556 l -0.054 0.249 a 28.695 28.695 0 0 0 -0.26 2.186 c -0.041 0.525 -0.068 1.05 -0.077 1.576 c -0.007 0.428 -0.003 0.857 0.015 1.285 c 0.097 2.401 0.603 4.856 1.877 6.922 a 9.881 9.881 0 0 0 1.367 1.743 l 0.486 0.394 l -3.424 0.831 c -4.872 0.92 -9.888 1.093 -14.805 0.434 a 41.283 41.283 0 0 1 -5.667 -1.157 l -0.112 -0.039 l 0.637 -0.499 c 0.278 -0.264 0.538 -0.547 0.779 -0.845 c 1.407 -1.741 2.114 -3.94 2.408 -6.133 a 21.951 21.951 0 0 0 0.172 -2.307 c 0.011 -0.56 0.002 -1.12 -0.024 -1.679 c -0.033 -0.701 -0.094 -1.4 -0.179 -2.096 l -0.134 -0.756 l 0.301 0.262 c 0.273 0.189 0.562 0.352 0.854 0.51 c 0.298 0.162 0.601 0.316 0.908 0.462 c 1.002 0.476 2.047 0.866 3.124 1.135 c 0.77 0.192 1.558 0.325 2.352 0.359 c 0.094 0.003 0.189 0.005 0.283 0.003 c 0.164 0.023 0.331 0.03 0.497 0.034 c 0.338 0.009 0.677 -0.004 1.015 -0.03 a 15.195 15.195 0 0 0 3.075 -0.594 c 0.701 -0.206 1.39 -0.453 2.065 -0.732 c 0.317 -0.131 0.633 -0.265 0.94 -0.419 c 0.302 -0.151 0.594 -0.321 0.874 -0.51 l 0.707 -0.589 Z"
                                                      onClick={
                                                        this.attributeSymptomTag
                                                      }
                                                      gender="female"
                                                    ></path>
                                                    <path
                                                      class="body-area body-area-chest hover_body"
                                                      id="body-area-chest"
                                                      title=""
                                                      data-toggle="popover"
                                                      data-container="body"
                                                      data-placement="right"
                                                      type="button"
                                                      data-html="true"
                                                      href="#"
                                                      body_part="chest"
                                                      data-original-title="Chest"
                                                      d="M 97.488 52.369 a 11.5 11.5 0 0 0 1.832 1.017 c 0.599 0.27 1.217 0.494 1.844 0.689 c 0.059 0.023 0.119 0.044 0.179 0.064 c 0.707 0.232 1.445 0.371 2.183 0.463 c 1.124 0.142 2.261 0.169 3.392 0.115 c 0.269 -0.013 0.538 -0.03 0.806 -0.053 c 0.219 -0.017 0.436 -0.041 0.655 -0.058 a 8.434 8.434 0 0 1 1.782 0.076 c 1.754 0.27 3.387 1.093 4.784 2.168 l 0.874 0.751 c -2.017 2.131 -3.606 4.642 -4.864 7.279 a 36.928 36.928 0 0 0 -0.79 1.773 a 41.389 41.389 0 0 0 -0.855 2.238 a 45.822 45.822 0 0 0 -0.888 2.827 a 48.497 48.497 0 0 0 -1.025 4.485 a 41.928 41.928 0 0 0 -0.248 1.542 a 11.418 11.418 0 0 0 -3.813 -3.109 a 10.632 10.632 0 0 0 -4.632 -1.135 h -0.285 c -0.428 0.009 -0.855 0.037 -1.28 0.093 a 12.378 12.378 0 0 0 -3.689 1.105 a 12.77 12.77 0 0 0 -3.676 2.62 a 10.49 10.49 0 0 0 -1.964 2.788 a 8.367 8.367 0 0 0 -0.738 2.427 l -0.031 0.466 H 79.52 l -0.031 -0.466 a 8.396 8.396 0 0 0 -0.737 -2.427 a 10.514 10.514 0 0 0 -1.964 -2.788 a 12.783 12.783 0 0 0 -3.676 -2.62 a 12.387 12.387 0 0 0 -3.689 -1.105 a 11.667 11.667 0 0 0 -1.28 -0.093 a 11.494 11.494 0 0 0 -1.408 0.075 c -0.683 0.082 -1.357 0.232 -2.011 0.445 c -0.599 0.195 -1.181 0.443 -1.737 0.738 a 11.429 11.429 0 0 0 -3.552 2.958 c -0.032 -0.4 -0.074 -0.8 -0.123 -1.197 a 32.605 32.605 0 0 0 -0.896 -4.549 a 34.262 34.262 0 0 0 -5.56 -11.475 a 29.264 29.264 0 0 0 -2.248 -2.687 l 0.008 -0.008 c 0.314 -0.302 0.642 -0.587 0.985 -0.856 c 1.285 -1.013 2.771 -1.813 4.378 -2.165 a 8.28 8.28 0 0 1 1.85 -0.192 c 0.441 0.004 0.88 0.058 1.319 0.092 c 0.2 0.014 0.4 0.026 0.6 0.037 c 1.533 0.066 3.082 0.005 4.586 -0.314 a 9.82 9.82 0 0 0 1.048 -0.283 c 0.04 -0.014 0.079 -0.032 0.12 -0.045 l 0.249 -0.078 c 1.205 -0.388 2.373 -0.918 3.412 -1.623 l 1.347 0.445 c 1.901 0.564 3.845 0.981 5.807 1.269 c 5.201 0.765 10.524 0.612 15.687 -0.363 a 51.602 51.602 0 0 0 5.484 -1.356 Z"
                                                      onClick={
                                                        this.attributeSymptomTag
                                                      }
                                                      gender="female"
                                                    ></path>
                                                    <path
                                                      class="body-area body-area-upper_arm hover_body"
                                                      id="body-area-upper_arm"
                                                      title=""
                                                      data-toggle="popover"
                                                      data-container="body"
                                                      data-placement="right"
                                                      type="button"
                                                      data-html="true"
                                                      href="#"
                                                      body_part="upper_arm"
                                                      data-original-title="Upper Arm "
                                                      d="M 49.923 58.538 a 28.63 28.63 0 0 1 2.13 2.555 a 33.26 33.26 0 0 1 5.339 10.924 c 0.365 1.315 0.65 2.652 0.844 4.003 c 0.146 1.012 0.245 2.034 0.264 3.057 c -0.192 0.329 -0.368 0.667 -0.527 1.015 a 10.806 10.806 0 0 0 -0.824 2.663 a 11.158 11.158 0 0 0 -0.105 2.81 c 0.107 1.277 0.415 2.546 0.949 3.711 c -0.02 0.52 -0.068 1.04 -0.14 1.555 l -0.137 0.576 l -3.245 7.599 a 384.597 384.597 0 0 0 -2.749 6.607 c -0.278 0.689 -0.551 1.379 -0.814 2.071 a 31.77 31.77 0 0 0 -0.278 0.763 c -0.056 0.162 -0.112 0.324 -0.155 0.49 c -0.018 0.067 -0.028 0.131 -0.04 0.199 c -0.018 0.104 -0.027 0.151 -0.047 0.255 l -0.089 0.445 a 76.903 76.903 0 0 1 -0.613 2.67 a 55.17 55.17 0 0 1 -0.605 2.266 c -0.021 0.066 -0.021 0.066 -0.045 0.131 a 9.503 9.503 0 0 1 -0.249 0.553 c -0.137 0.279 -0.276 0.557 -0.417 0.834 c -0.422 0.823 -0.856 1.639 -1.292 2.453 l -0.075 0.138 l -0.495 -0.016 c -2.304 -0.189 -4.575 -0.765 -6.661 -1.771 a 17.611 17.611 0 0 1 -5.039 -3.661 l -0.971 -1.163 l 2.565 -5.049 a 502.238 502.238 0 0 0 2.179 -4.34 c 0.395 -0.799 0.793 -1.597 1.161 -2.408 l 0.096 -0.225 c 0.291 -0.71 0.54 -1.437 0.778 -2.166 c 0.253 -0.776 0.491 -1.558 0.723 -2.341 a 208.645 208.645 0 0 0 1.678 -6.018 c 0.408 -1.536 0.805 -3.075 1.184 -4.617 c 0.178 -0.719 0.349 -1.439 0.507 -2.163 c 0.176 -0.804 0.327 -1.614 0.424 -2.433 c 0.137 -1.145 0.199 -2.297 0.242 -3.449 c 0.049 -1.298 0.07 -2.598 0.082 -3.897 c 0.005 -0.599 0.004 -1.197 0.014 -1.797 a 22.815 22.815 0 0 1 0.358 -3.543 a 22.33 22.33 0 0 1 2.307 -6.569 c 0.318 -0.589 0.665 -1.163 1.041 -1.718 l 0.747 -0.999 Z m 66.622 -0.222 l 0.154 0.16 c 0.286 0.336 0.545 0.696 0.792 1.061 c 0.376 0.555 0.721 1.129 1.041 1.718 a 22.374 22.374 0 0 1 2.336 6.736 c 0.206 1.178 0.311 2.37 0.331 3.567 c 0.006 0.753 0.01 1.506 0.019 2.26 c 0.018 1.367 0.043 2.735 0.111 4.1 c 0.051 1.032 0.124 2.065 0.27 3.088 c 0.093 0.65 0.219 1.295 0.359 1.937 c 0.195 0.883 0.407 1.761 0.624 2.638 c 0.457 1.832 0.932 3.66 1.425 5.482 c 0.507 1.874 1.03 3.745 1.597 5.603 c 0.222 0.726 0.452 1.453 0.698 2.172 c 0.189 0.55 0.384 1.103 0.622 1.635 c 0.133 0.298 0.281 0.59 0.429 0.88 c 0.218 0.426 0.444 0.847 0.673 1.266 c 0.522 0.959 1.061 1.91 1.603 2.857 l 3.904 6.684 c -1.897 1.93 -4.307 3.323 -6.834 4.308 c -0.445 0.173 -0.895 0.334 -1.349 0.484 c -0.557 0.184 -1.12 0.351 -1.686 0.502 c -0.745 0.199 -1.497 0.37 -2.255 0.515 l -1.642 0.211 l -1.098 -1.891 a 14.712 14.712 0 0 1 -0.682 -1.529 c -0.3 -0.776 -0.549 -1.574 -0.722 -2.389 a 12.477 12.477 0 0 1 -0.131 -0.72 c -0.023 -0.157 -0.038 -0.314 -0.063 -0.471 a 4.734 4.734 0 0 0 -0.052 -0.264 a 13.79 13.79 0 0 0 -0.336 -1.163 a 38.824 38.824 0 0 0 -0.45 -1.295 c -0.43 -1.179 -0.893 -2.344 -1.365 -3.506 a 299.407 299.407 0 0 0 -2.958 -6.986 c -0.45 -1.032 -0.905 -2.06 -1.354 -3.092 c -0.218 -0.511 -0.427 -1.027 -0.64 -1.541 l -1.242 -3.016 l -0.173 -0.841 a 0.417 0.417 0 0 1 -0.004 -0.035 l -0.006 0.001 c 0.601 -1.249 0.936 -2.626 1.037 -4.009 c 0.065 -0.894 0.036 -1.793 -0.115 -2.678 a 10.85 10.85 0 0 0 -0.825 -2.663 a 10.977 10.977 0 0 0 -0.584 -1.111 l 0.012 -0.116 c 0.117 -1.052 0.284 -2.097 0.486 -3.135 c 0.259 -1.334 0.574 -2.657 0.946 -3.964 c 0.243 -0.856 0.511 -1.705 0.805 -2.545 c 0.864 -2.466 1.952 -4.864 3.337 -7.084 c 0.85 -1.361 1.813 -2.655 2.955 -3.821 Z"
                                                      onClick={
                                                        this.attributeSymptomTag
                                                      }
                                                      gender="female"
                                                    ></path>
                                                    <path
                                                      class="body-area body-area-breasts hover_body"
                                                      id="body-area-breasts"
                                                      title=""
                                                      data-toggle="popover"
                                                      data-container="body"
                                                      data-placement="right"
                                                      type="button"
                                                      data-html="true"
                                                      href="#"
                                                      body_part="breasts"
                                                      data-original-title="Breast"
                                                      d="M 58.999 89.066 a 8.042 8.042 0 0 0 1.149 1.748 a 7.56 7.56 0 0 0 1.961 1.618 c 1.361 0.782 2.931 1.117 4.492 1.131 c 0.8 0.008 1.604 -0.061 2.391 -0.21 a 13.012 13.012 0 0 0 4.816 -1.997 a 12.013 12.013 0 0 0 2.906 -2.721 c 0.769 -1.02 1.356 -2.184 1.649 -3.431 c 0.122 -0.524 0.196 -1.06 0.199 -1.598 a 6.622 6.622 0 0 0 -0.063 -0.934 a 7.37 7.37 0 0 0 -0.651 -2.136 a 9.482 9.482 0 0 0 -1.778 -2.521 a 11.761 11.761 0 0 0 -3.269 -2.355 a 11.408 11.408 0 0 0 -3.379 -1.057 a 10.79 10.79 0 0 0 -1.164 -0.099 c -0.129 -0.003 -0.258 -0.004 -0.387 -0.003 a 9.587 9.587 0 0 0 -3.07 0.55 c -2.196 0.776 -4.076 2.335 -5.299 4.303 l -0.001 0.115 l -0.001 0.044 l -0.093 -0.003 c -0.46 0.771 -0.821 1.601 -1.061 2.47 a 9.507 9.507 0 0 0 -0.326 1.909 c -0.032 0.49 -0.025 0.982 0.011 1.472 c 0.091 1.256 0.392 2.507 0.938 3.643 H 59 l -0.001 0.062 Z m 39.434 -14.565 c -0.39 0.008 -0.778 0.034 -1.164 0.085 a 11.36 11.36 0 0 0 -3.389 1.016 a 11.81 11.81 0 0 0 -3.299 2.322 a 9.572 9.572 0 0 0 -1.815 2.504 a 7.428 7.428 0 0 0 -0.686 2.129 a 6.682 6.682 0 0 0 -0.08 1.049 c 0.003 0.575 0.086 1.148 0.225 1.706 c 0.301 1.206 0.875 2.333 1.622 3.323 a 12.05 12.05 0 0 0 2.906 2.721 a 13.007 13.007 0 0 0 4.817 1.997 c 0.74 0.14 1.493 0.208 2.246 0.211 c 1.57 0.004 3.156 -0.309 4.538 -1.076 a 7.546 7.546 0 0 0 2.059 -1.674 a 7.86 7.86 0 0 0 0.537 -0.696 c 0.96 -1.399 1.458 -3.074 1.581 -4.757 c 0.035 -0.49 0.043 -0.982 0.01 -1.472 a 9.453 9.453 0 0 0 -0.294 -1.792 c -0.838 -3.182 -3.282 -5.869 -6.37 -7.005 a 9.621 9.621 0 0 0 -3.058 -0.589 c -0.129 -0.002 -0.258 -0.003 -0.386 -0.002 Z"
                                                      onClick={
                                                        this.attributeSymptomTag
                                                      }
                                                      gender="female"
                                                    ></path>
                                                    <path
                                                      class="body-area body-area-upper_abdomen hover_body"
                                                      id="body-area-upper_abdomen"
                                                      title=""
                                                      data-toggle="popover"
                                                      data-container="body"
                                                      data-placement="right"
                                                      type="button"
                                                      data-html="true"
                                                      href="#"
                                                      body_part="upper_abdomen"
                                                      data-original-title="Upper Abdomen "
                                                      onClick={
                                                        this.attributeSymptomTag
                                                      }
                                                      d="M 87.048 84 l 0.177 1.432 c 0.335 1.423 1.01 2.751 1.9 3.905 a 13.079 13.079 0 0 0 3.07 2.849 a 14.028 14.028 0 0 0 5.189 2.15 c 0.8 0.151 1.615 0.225 2.429 0.228 c 1.302 0.004 2.611 -0.191 3.833 -0.65 a 8.816 8.816 0 0 0 2.055 -1.099 a 8.474 8.474 0 0 0 1.134 -0.981 a 8.843 8.843 0 0 0 0.873 -1.055 c 0.082 0.396 0.178 0.789 0.285 1.179 l 0.075 0.232 l -0.22 1.202 c -0.164 1.085 -0.314 2.171 -0.468 3.258 c -0.301 2.138 -0.6 4.276 -0.88 6.418 a 245.649 245.649 0 0 0 -0.442 3.524 l -0.1 0.908 H 60.701 l -0.227 -2.028 c -0.149 -1.216 -0.309 -2.43 -0.472 -3.642 a 632.295 632.295 0 0 0 -0.716 -5.18 c -0.144 -1.02 -0.288 -2.04 -0.437 -3.058 a 54.152 54.152 0 0 0 -0.132 -0.822 l -0.112 -0.596 l 0.209 -1.005 c 0.019 -0.124 0.037 -0.248 0.053 -0.372 a 8.702 8.702 0 0 0 1.994 2.018 a 8.816 8.816 0 0 0 2.055 1.099 c 1.222 0.459 2.531 0.654 3.833 0.65 a 13.374 13.374 0 0 0 2.429 -0.228 a 14.028 14.028 0 0 0 5.189 -2.15 a 13.118 13.118 0 0 0 3.07 -2.849 c 0.89 -1.155 1.565 -2.482 1.899 -3.905 L 79.513 84 h 7.535 Z"
                                                      gender="female"
                                                    ></path>
                                                    <path
                                                      class="body-area body-area-mid_abdomen hover_body"
                                                      body_part="mid_abdomen"
                                                      data-original-title="Mid Abdomen "
                                                      id="body-area-mid_abdomen"
                                                      title=""
                                                      data-toggle="popover"
                                                      data-container="body"
                                                      data-placement="right"
                                                      type="button"
                                                      data-html="true"
                                                      href="#"
                                                      d="M 105.847 108.5 l -0.006 0.056 c -0.038 0.379 -0.074 0.759 -0.1 1.139 c -0.11 1.6 -0.135 3.209 -0.023 4.809 c 0.055 0.783 0.142 1.564 0.283 2.336 c 0.125 0.692 0.29 1.379 0.531 2.04 c 0.092 0.249 0.194 0.495 0.311 0.734 c 0.126 0.259 0.267 0.51 0.401 0.765 a 67.526 67.526 0 0 1 3.304 7.593 c 0.803 2.207 1.49 4.462 1.974 6.745 l -6.834 0.598 c -2.885 0.234 -5.772 0.45 -8.661 0.64 c -2.319 0.152 -4.64 0.287 -6.962 0.389 c -2.021 0.088 -4.043 0.156 -6.065 0.156 c -1.821 0 -3.642 -0.056 -5.462 -0.131 a 292.311 292.311 0 0 1 -6.276 -0.332 c -5.531 -0.345 -11.055 -0.794 -16.575 -1.29 l -0.492 -0.045 c 0.342 -1.753 0.822 -3.44 1.373 -5.102 a 66.32 66.32 0 0 1 2.532 -6.443 a 59.08 59.08 0 0 1 1.491 -3.065 c 0.073 -0.138 0.148 -0.274 0.217 -0.414 c 0.035 -0.074 0.068 -0.147 0.1 -0.222 a 6.66 6.66 0 0 0 0.411 -1.638 c 0.074 -0.57 0.097 -1.145 0.097 -1.718 a 30.4 30.4 0 0 0 -0.135 -2.579 c -0.081 -0.937 -0.183 -1.872 -0.271 -2.809 c -0.051 -0.58 -0.092 -1.16 -0.144 -1.74 l -0.053 -0.472 h 45.034 Z"
                                                      onClick={
                                                        this.attributeSymptomTag
                                                      }
                                                      gender="female"
                                                    ></path>
                                                    <path
                                                      class="body-area body-area-lower_abdomen hover_body"
                                                      body_part="lower_abdomen "
                                                      data-original-title="Lower Abdomen "
                                                      id="body-area-lower_abdomen"
                                                      title=""
                                                      data-toggle="popover"
                                                      data-container="body"
                                                      data-placement="right"
                                                      type="button"
                                                      data-html="true"
                                                      href="#"
                                                      d="M 54.99 135.678 l 7.241 0.634 c 2.89 0.234 5.782 0.451 8.676 0.64 c 2.327 0.153 4.655 0.288 6.985 0.391 c 2.034 0.089 4.071 0.157 6.108 0.157 s 4.074 -0.068 6.108 -0.157 c 2.546 -0.112 5.089 -0.263 7.631 -0.433 c 3.051 -0.205 6.1 -0.438 9.148 -0.69 l 5.832 -0.516 l 0.29 1.633 c 0.104 0.722 0.182 1.448 0.265 2.172 c 0.119 1.032 0.233 2.066 0.343 3.1 l 0.07 0.735 l -1.807 0.69 a 83.213 83.213 0 0 0 -4.978 2.269 a 78.636 78.636 0 0 0 -4.966 2.684 a 69.026 69.026 0 0 0 -3.841 2.433 c -2.323 1.585 -4.552 3.325 -6.606 5.27 a 9.842 9.842 0 0 0 -0.887 -1.64 c -0.241 -0.36 -0.504 -0.706 -0.788 -1.032 a 9.437 9.437 0 0 0 -1.342 -1.271 a 8.565 8.565 0 0 0 -2.062 -1.186 a 7.893 7.893 0 0 0 -2.793 -0.56 h -0.234 a 7.893 7.893 0 0 0 -2.793 0.56 a 8.565 8.565 0 0 0 -2.062 1.186 a 9.437 9.437 0 0 0 -1.342 1.271 c -0.284 0.326 -0.547 0.672 -0.788 1.032 a 9.27 9.27 0 0 0 -0.977 1.88 c -3.736 -3.795 -8.011 -6.99 -12.59 -9.61 a 62.69 62.69 0 0 0 -6.137 -3.08 a 54.18 54.18 0 0 0 -2.515 -1.019 l -0.275 -0.095 l 0.49 -3.584 c 0.087 -0.674 0.163 -1.351 0.255 -2.025 c 0.033 -0.24 0.069 -0.48 0.106 -0.719 l 0.235 -1.12 Z"
                                                      onClick={
                                                        this.attributeSymptomTag
                                                      }
                                                      gender="female"
                                                    ></path>
                                                    <path
                                                      class="body-area body-area-forearm hover_body"
                                                      body_part="forearm"
                                                      data-original-title="Forearm"
                                                      id="body-area-forearm"
                                                      title=""
                                                      data-toggle="popover"
                                                      data-container="body"
                                                      data-placement="right"
                                                      type="button"
                                                      data-html="true"
                                                      href="#"
                                                      d="M 134.044 113.035 l 0.164 0.28 c 0.145 0.25 0.29 0.5 0.429 0.752 c 0.03 0.057 0.062 0.114 0.086 0.173 c 0.058 0.142 0.107 0.292 0.157 0.436 c 0.094 0.271 0.192 0.561 0.282 0.831 c 0.249 0.747 0.491 1.495 0.729 2.245 a 158.78 158.78 0 0 1 1.566 5.233 c 0.13 0.466 0.258 0.933 0.382 1.4 c 0.122 0.457 0.237 0.917 0.359 1.376 c 0.063 0.233 0.128 0.466 0.194 0.699 a 71.464 71.464 0 0 0 1.566 4.728 c 0.427 1.164 0.874 2.32 1.336 3.469 c 0.467 1.162 0.95 2.317 1.447 3.465 c 0.37 0.86 0.745 1.718 1.149 2.563 l 1.546 3.023 c -1.464 1.253 -3.158 2.227 -4.922 3.008 a 24.139 24.139 0 0 1 -3.471 1.24 l -0.421 -1.095 a 5.582 5.582 0 0 0 -0.428 -0.752 c -0.147 -0.215 -0.309 -0.419 -0.46 -0.632 c -0.042 -0.062 -0.081 -0.126 -0.121 -0.19 c -0.25 -0.413 -0.496 -0.829 -0.743 -1.244 c -0.932 -1.573 -1.859 -3.148 -2.787 -4.722 c -1.083 -1.84 -2.165 -3.679 -3.245 -5.518 l -8.513 -14.662 l 1.783 -0.292 a 31.11 31.11 0 0 0 3.555 -0.947 c 1.745 -0.577 3.44 -1.315 5.019 -2.258 c 1.222 -0.729 2.372 -1.584 3.362 -2.609 Z m -100.7 0.209 l 0.636 0.77 a 18.626 18.626 0 0 0 5.433 3.981 c 2.11 1.018 4.401 1.62 6.729 1.841 l 0.332 0.016 l -2.935 5.388 c -3.39 6.16 -6.82 12.298 -10.226 18.449 a 595.729 595.729 0 0 0 -1.822 3.316 l -0.212 0.431 l -1.754 -0.162 a 17.855 17.855 0 0 1 -7.245 -3.015 l -0.066 -0.053 l 0.635 -1.305 c 0.364 -0.769 0.725 -1.541 1.08 -2.315 c 0.284 -0.617 0.563 -1.237 0.83 -1.861 a 112.785 112.785 0 0 0 2.25 -5.778 c 0.733 -2.031 1.425 -4.08 2.031 -6.154 c 0.139 -0.476 0.274 -0.953 0.401 -1.432 c 0.121 -0.457 0.236 -0.915 0.356 -1.373 l 0.25 -0.919 a 140.928 140.928 0 0 1 1.651 -5.469 c 0.34 -1.049 0.688 -2.097 1.062 -3.134 c 0.025 -0.068 0.05 -0.137 0.078 -0.204 l 0.506 -1.018 Z"
                                                      onClick={
                                                        this.attributeSymptomTag
                                                      }
                                                      gender="female"
                                                    ></path>
                                                    <path
                                                      class="body-area body-area-hand hover_body"
                                                      body_part="hand "
                                                      data-original-title="Hand"
                                                      id="body-area-hand"
                                                      title=""
                                                      data-toggle="popover"
                                                      data-container="body"
                                                      data-placement="right"
                                                      type="button"
                                                      data-html="true"
                                                      href="#"
                                                      d="M 21.77 145.118 a 18.785 18.785 0 0 0 7.586 3.141 l 1.471 0.136 a 9.832 9.832 0 0 0 -0.649 2.24 a 7.924 7.924 0 0 0 -0.116 1.356 c 0.001 0.094 0.01 0.178 0.02 0.273 c 0.016 0.148 0.02 0.191 0.034 0.34 a 22.694 22.694 0 0 1 0.086 2.73 a 20.933 20.933 0 0 1 -0.866 5.37 a 18.402 18.402 0 0 1 -0.626 1.765 a 14.167 14.167 0 0 1 -0.801 1.649 l -0.002 0.004 c 0.009 0.908 0.015 1.817 0.021 2.725 c 0.002 0.562 0.004 1.123 0.004 1.685 c -0.001 0.587 0 1.174 -0.017 1.761 c -0.004 0.158 -0.013 0.316 -0.021 0.475 c -0.012 0.246 -0.024 0.492 -0.042 0.738 a 7.886 7.886 0 0 1 -0.153 1.156 a 3.035 3.035 0 0 1 -0.297 0.828 c -0.14 0.249 -0.337 0.469 -0.594 0.599 a 1.267 1.267 0 0 1 -0.512 0.133 a 1.288 1.288 0 0 1 -0.992 -0.362 c -0.309 -0.313 -0.427 -0.758 -0.45 -1.187 c -0.008 -0.303 -0.016 -0.6 -0.026 -0.907 c -0.061 -1.888 -0.121 -3.776 -0.191 -5.664 a 8.203 8.203 0 0 0 -0.021 -0.31 a 2.177 2.177 0 0 0 -0.119 -0.58 l -0.016 -0.037 a 0.311 0.311 0 0 0 -0.077 0.106 c -0.039 0.071 -0.068 0.146 -0.101 0.219 l -0.015 0.034 c -0.032 0.11 -0.061 0.218 -0.089 0.329 c -0.128 0.498 -0.249 0.997 -0.372 1.497 c -0.467 1.925 -0.925 3.85 -1.393 5.774 c -0.099 0.409 -0.2 0.817 -0.304 1.225 c -0.039 0.152 -0.08 0.305 -0.126 0.457 c -0.042 0.14 -0.089 0.278 -0.14 0.416 c -0.131 0.35 -0.294 0.693 -0.509 1 a 2.365 2.365 0 0 1 -0.537 0.561 a 1.663 1.663 0 0 1 -1.125 0.325 a 1.54 1.54 0 0 1 -0.368 -0.074 a 1.064 1.064 0 0 1 -0.486 -0.361 c -0.255 -0.333 -0.322 -0.776 -0.334 -1.185 a 6.51 6.51 0 0 1 0.122 -1.335 c 0.04 -0.207 0.086 -0.411 0.128 -0.617 l 0.17 -0.822 l 0.384 -1.869 c 0.24 -1.182 0.48 -2.364 0.709 -3.548 c 0.072 -0.375 0.144 -0.752 0.212 -1.128 c 0.05 -0.279 0.1 -0.557 0.136 -0.838 l 0.005 -0.048 c -0.248 0.415 -0.473 0.843 -0.69 1.274 c -0.246 0.492 -0.482 0.989 -0.711 1.488 a 99.293 99.293 0 0 0 -2.227 5.267 c -0.074 0.192 -0.142 0.385 -0.219 0.574 c -0.041 0.096 -0.084 0.19 -0.128 0.284 c -0.319 0.641 -0.787 1.268 -1.473 1.541 c -0.189 0.075 -0.39 0.12 -0.594 0.124 a 1.537 1.537 0 0 1 -0.815 -0.209 a 1.155 1.155 0 0 1 -0.313 -0.296 c -0.266 -0.374 -0.292 -0.863 -0.238 -1.304 a 3.243 3.243 0 0 1 0.117 -0.577 c 0.149 -0.495 0.324 -0.981 0.485 -1.471 l 1.057 -3.192 c 0.281 -0.842 0.56 -1.685 0.843 -2.527 c 0.246 -0.735 0.489 -1.472 0.748 -2.204 c 0.022 -0.062 0.044 -0.125 0.07 -0.186 a 18.72 18.72 0 0 0 -0.539 0.712 c -0.271 0.374 -0.538 0.752 -0.8 1.134 c -0.606 0.882 -1.196 1.777 -1.779 2.674 c -0.331 0.507 -0.656 1.018 -0.991 1.521 l -0.132 0.188 c -0.285 0.378 -0.615 0.744 -1.053 0.946 a 1.621 1.621 0 0 1 -0.761 0.147 c -0.2 -0.01 -0.397 -0.059 -0.583 -0.132 a 1.691 1.691 0 0 1 -0.295 -0.147 a 1.022 1.022 0 0 1 -0.396 -0.511 c -0.113 -0.308 -0.099 -0.648 -0.045 -0.967 c 0.042 -0.257 0.113 -0.509 0.199 -0.757 c 0.092 -0.271 0.202 -0.537 0.325 -0.795 c 0.056 -0.115 0.116 -0.228 0.174 -0.342 l 0.418 -0.818 l 0.943 -1.832 c 0.709 -1.373 1.413 -2.75 2.149 -4.109 c 0.099 -0.182 0.198 -0.365 0.301 -0.544 c 0.048 -0.084 0.102 -0.164 0.149 -0.248 c 0.024 -0.047 0.044 -0.095 0.063 -0.143 c 0.086 -0.223 0.153 -0.452 0.216 -0.68 c 0.067 -0.246 0.128 -0.492 0.187 -0.739 c 0.18 -0.756 0.332 -1.518 0.479 -2.28 l 0.018 -0.091 c -0.183 0.203 -0.283 0.456 -0.405 0.697 a 7.253 7.253 0 0 1 -0.142 0.258 a 5.025 5.025 0 0 1 -0.554 0.744 c -0.526 0.581 -1.184 1.028 -1.877 1.386 c -0.162 0.083 -0.325 0.161 -0.49 0.236 a 3.141 3.141 0 0 1 -0.358 0.143 c -0.254 0.078 -0.521 0.11 -0.786 0.101 a 2.533 2.533 0 0 1 -0.993 -0.24 a 1.988 1.988 0 0 1 -0.513 -0.344 a 1.4 1.4 0 0 1 -0.293 -0.382 a 1.03 1.03 0 0 1 0.068 -1.068 c 0.07 -0.101 0.154 -0.186 0.246 -0.268 c 0.086 -0.068 0.177 -0.13 0.264 -0.197 c 0.266 -0.214 0.509 -0.455 0.745 -0.702 c 0.321 -0.338 0.626 -0.691 0.922 -1.051 c 0.329 -0.4 0.648 -0.808 0.953 -1.226 c 0.186 -0.254 0.371 -0.513 0.532 -0.783 c 0.077 -0.128 0.14 -0.265 0.21 -0.396 c 0.044 -0.077 0.087 -0.154 0.133 -0.23 c 0.092 -0.144 0.188 -0.286 0.293 -0.422 c 0.441 -0.573 0.992 -1.059 1.553 -1.511 c 0.239 -0.191 0.481 -0.377 0.728 -0.559 c 0.201 -0.148 0.402 -0.298 0.611 -0.435 c 0.19 -0.124 0.388 -0.236 0.591 -0.339 c 0.873 -0.447 1.826 -0.731 2.781 -0.937 c 0.498 -0.108 1 -0.197 1.505 -0.266 a 0.443 0.443 0 0 1 0.017 -0.114 c 0.024 -0.091 0.045 -0.114 0.084 -0.18 c 0.033 -0.056 0.059 -0.107 0.089 -0.164 c 0.076 -0.142 0.149 -0.286 0.222 -0.429 l 1.104 -2.27 Z m 124.17 -0.509 l 1.39 2.477 c 0.053 0.089 0.106 0.178 0.161 0.266 l 0.03 0.049 l 0.004 0.009 c 0.776 0.107 1.529 0.351 2.243 0.667 c 0.341 0.15 0.67 0.32 0.999 0.493 c 0.571 0.3 1.138 0.61 1.693 0.94 c 0.561 0.334 1.117 0.685 1.629 1.093 c 0.347 0.275 0.69 0.586 0.92 0.97 c 0.063 0.106 0.117 0.217 0.157 0.333 c 0.024 0.072 0.039 0.145 0.06 0.219 l 0.047 0.155 c 0.026 0.072 0.051 0.145 0.08 0.216 c 0.148 0.366 0.339 0.71 0.58 1.024 c 0.108 0.141 0.23 0.266 0.352 0.393 c 0.091 0.096 0.182 0.192 0.271 0.289 c 0.186 0.204 0.186 0.204 0.371 0.41 c 0.428 0.484 0.846 0.976 1.261 1.472 l 0.16 0.193 c 0.055 0.067 0.056 0.065 0.103 0.137 a 1.3 1.3 0 0 1 0.128 0.269 c 0.122 0.328 0.152 0.695 0.019 1.024 c -0.07 0.175 -0.183 0.33 -0.325 0.455 c -0.327 0.292 -0.778 0.416 -1.204 0.465 a 2.607 2.607 0 0 1 -0.459 0.016 c -0.89 -0.038 -1.709 -0.49 -2.35 -1.088 a 4.789 4.789 0 0 1 -0.436 -0.465 l -0.018 -0.023 l -0.042 -0.062 a 19.09 19.09 0 0 0 -0.164 -0.283 l -0.182 -0.29 l -0.038 -0.057 c 0.122 0.487 0.27 0.972 0.467 1.436 c 0.128 0.303 0.284 0.593 0.429 0.888 c 0.622 1.277 1.228 2.561 1.845 3.84 c 0.38 0.78 0.76 1.56 1.153 2.334 c 0.258 0.506 0.519 1.01 0.795 1.504 c 0.095 0.17 0.192 0.338 0.293 0.504 c 0.069 0.112 0.141 0.221 0.208 0.334 c 0.049 0.087 0.049 0.086 0.096 0.173 a 3.7 3.7 0 0 1 0.211 0.498 c 0.123 0.377 0.166 0.786 0.072 1.176 c -0.104 0.438 -0.38 0.829 -0.76 1.07 c -0.16 0.102 -0.343 0.181 -0.533 0.201 a 1.376 1.376 0 0 1 -0.718 -0.142 a 2.692 2.692 0 0 1 -0.606 -0.396 a 5.263 5.263 0 0 1 -0.636 -0.648 c -0.427 -0.508 -0.788 -1.071 -1.121 -1.645 c -0.19 -0.328 -0.368 -0.663 -0.552 -0.995 c -0.134 -0.237 -0.134 -0.237 -0.27 -0.473 a 26.482 26.482 0 0 0 -1.607 -2.455 l -0.066 -0.086 c 0.276 0.827 0.539 1.658 0.818 2.483 c 0.113 0.334 0.228 0.667 0.349 0.997 c 0.047 0.125 0.093 0.249 0.143 0.374 c 0.035 0.086 0.069 0.175 0.113 0.257 c 0.02 0.038 0.045 0.072 0.066 0.108 c 0.024 0.047 0.048 0.094 0.07 0.142 c 0.11 0.244 0.203 0.496 0.296 0.747 c 0.09 0.245 0.178 0.492 0.263 0.74 c 0.187 0.536 0.368 1.073 0.549 1.611 c 0.147 0.437 0.288 0.879 0.445 1.312 c 0.014 0.036 0.015 0.035 0.033 0.074 c 0.04 0.105 0.064 0.217 0.084 0.328 a 3.775 3.775 0 0 1 0.056 0.602 c 0.006 0.535 -0.109 1.115 -0.502 1.506 a 1.388 1.388 0 0 1 -0.544 0.333 a 1.313 1.313 0 0 1 -0.445 0.062 a 1.486 1.486 0 0 1 -0.487 -0.105 c -0.39 -0.153 -0.717 -0.442 -0.989 -0.756 a 5.308 5.308 0 0 1 -1.029 -1.889 c -0.032 -0.104 -0.059 -0.208 -0.093 -0.311 a 13.351 13.351 0 0 0 -0.09 -0.26 c -0.238 -0.646 -0.5 -1.283 -0.772 -1.915 a 60.473 60.473 0 0 0 -0.783 -1.742 a 41.239 41.239 0 0 0 -0.853 -1.726 a 18.322 18.322 0 0 0 -0.86 -1.496 c 0.018 0.119 0.043 0.25 0.065 0.368 c 0.042 0.218 0.042 0.217 0.086 0.434 c 0.095 0.443 0.194 0.886 0.293 1.328 c 0.446 1.972 0.908 3.939 1.377 5.906 c 0.027 0.084 0.052 0.171 0.076 0.256 c 0.136 0.5 0.241 1.014 0.25 1.534 c 0.006 0.311 -0.022 0.628 -0.129 0.921 a 1.451 1.451 0 0 1 -0.246 0.435 a 1.195 1.195 0 0 1 -0.229 0.215 c -0.36 0.258 -0.85 0.305 -1.267 0.175 a 1.702 1.702 0 0 1 -0.575 -0.319 c -0.35 -0.289 -0.597 -0.688 -0.79 -1.094 c -0.233 -0.491 -0.395 -1.014 -0.535 -1.539 c -0.075 -0.288 -0.141 -0.578 -0.214 -0.867 c -0.069 -0.258 -0.14 -0.516 -0.211 -0.773 c -0.441 -1.562 -0.898 -3.12 -1.346 -4.68 c -0.14 -0.494 -0.28 -0.989 -0.417 -1.484 c -0.055 -0.211 -0.111 -0.422 -0.163 -0.635 l -0.001 -0.004 a 4.274 4.274 0 0 0 -0.096 0.615 c -0.015 0.246 -0.024 0.493 -0.034 0.739 c -0.055 1.445 -0.101 2.89 -0.154 4.335 c -0.017 0.433 -0.034 0.867 -0.058 1.3 c -0.011 0.184 -0.017 0.37 -0.047 0.552 c -0.06 0.357 -0.197 0.714 -0.444 0.982 c -0.129 0.14 -0.286 0.25 -0.463 0.318 a 1.207 1.207 0 0 1 -1.045 -0.105 c -0.238 -0.15 -0.406 -0.385 -0.524 -0.636 c -0.169 -0.357 -0.252 -0.751 -0.309 -1.139 a 10.31 10.31 0 0 1 -0.089 -1.022 c -0.014 -0.329 -0.011 -0.661 -0.013 -0.991 c -0.003 -0.717 -0.005 -1.434 -0.012 -2.152 c -0.005 -0.4 -0.012 -0.801 -0.021 -1.201 a 36.17 36.17 0 0 0 -0.089 -1.889 c -0.016 -0.2 -0.036 -0.4 -0.064 -0.599 a 2.19 2.19 0 0 0 -0.084 -0.408 c -0.016 -0.048 -0.04 -0.094 -0.061 -0.138 c -0.152 -0.313 -0.321 -0.617 -0.48 -0.925 a 18.31 18.31 0 0 1 -0.865 -1.993 c -0.491 -1.368 -0.811 -2.796 -1.003 -4.237 a 27.028 27.028 0 0 1 -0.196 -2.165 c -0.025 -0.492 -0.033 -0.985 -0.051 -1.478 c -0.011 -0.276 -0.011 -0.275 -0.025 -0.55 c -0.063 -1.092 -0.167 -2.184 -0.385 -3.256 l -0.039 -0.157 c 0.79 -0.22 1.591 -0.494 2.378 -0.798 a 25.886 25.886 0 0 0 4.024 -1.952 a 17.425 17.425 0 0 0 2.247 -1.587 Z"
                                                      onClick={
                                                        this.attributeSymptomTag
                                                      }
                                                      gender="female"
                                                    ></path>
                                                    <path
                                                      class="body-area body-area-sexual_organs hover_body"
                                                      body_part="sexual_organs_f"
                                                      data-original-title="Sexual Organs"
                                                      id="body-area-sexual_organs"
                                                      title=""
                                                      data-toggle="popover"
                                                      data-container="body"
                                                      data-placement="right"
                                                      type="button"
                                                      data-html="true"
                                                      href="#"
                                                      d="M 83.602 152.001 l 1.589 0.212 a 7.049 7.049 0 0 1 1.919 0.81 c 1.872 1.128 3.195 3.02 3.862 5.08 c 0.18 0.555 0.313 1.126 0.401 1.703 c 0.412 2.714 -0.173 5.61 -1.786 7.854 a 9.087 9.087 0 0 1 -0.738 0.899 a 8.375 8.375 0 0 1 -1.152 1.026 a 7.485 7.485 0 0 1 -1.565 0.887 l -0.615 0.188 l -0.17 -1.008 a 3 3 0 0 0 -0.265 -0.703 a 1.528 1.528 0 0 0 -0.153 -0.235 c -0.077 -0.1 -0.163 -0.192 -0.241 -0.29 c -0.063 -0.079 -0.123 -0.161 -0.184 -0.242 c -0.518 -0.726 -0.957 -1.503 -1.372 -2.291 a 4.61 4.61 0 0 1 -0.058 0.224 a 6.816 6.816 0 0 1 -0.696 1.56 c -0.251 0.421 -0.532 0.821 -0.798 1.233 a 4.387 4.387 0 0 0 -0.14 0.239 c -0.022 0.044 -0.044 0.087 -0.059 0.133 c -0.011 0.044 -0.001 0.091 -0.001 0.137 l -0.003 0.198 c -0.003 0.232 -0.005 0.28 -0.011 0.52 l -0.025 0.482 l -0.473 -0.145 a 7.485 7.485 0 0 1 -1.565 -0.887 a 8.262 8.262 0 0 1 -1.08 -0.95 a 8.94 8.94 0 0 1 -0.747 -0.889 c -1.659 -2.254 -2.267 -5.191 -1.849 -7.94 c 0.088 -0.577 0.221 -1.148 0.401 -1.703 c 0.666 -2.06 1.99 -3.952 3.862 -5.08 a 7.049 7.049 0 0 1 1.919 -0.81 l 1.589 -0.212 h 0.204 Z"
                                                      onClick={
                                                        this.attributeSymptomTag
                                                      }
                                                      gender="female"
                                                    ></path>
                                                    <path
                                                      class="body-area body-area-thigh hover_body"
                                                      body_part="thigh"
                                                      data-original-title="Thigh"
                                                      id="body-area-thigh"
                                                      title=""
                                                      data-toggle="popover"
                                                      data-container="body"
                                                      data-placement="right"
                                                      type="button"
                                                      data-html="true"
                                                      href="#"
                                                      d="M 53.765 144.135 l 0.063 0.022 a 52.19 52.19 0 0 1 2.468 1.001 a 61.236 61.236 0 0 1 6.038 3.031 c 4.651 2.66 8.983 5.922 12.706 9.751 c -1.012 3.243 -0.599 6.937 1.228 9.81 c 0.233 0.367 0.489 0.719 0.766 1.054 c 0.396 0.476 0.835 0.915 1.314 1.307 a 8.635 8.635 0 0 0 2.137 1.285 l 0.804 0.245 l -0.028 0.534 c -0.023 0.268 -0.05 0.537 -0.087 0.803 a 5.029 5.029 0 0 1 -0.1 0.529 a 1.804 1.804 0 0 1 -0.07 0.227 c -0.013 0.035 -0.031 0.069 -0.043 0.105 c -0.021 0.074 -0.038 0.149 -0.057 0.224 c -0.133 0.588 -0.244 1.18 -0.356 1.772 c -0.186 0.988 -0.364 1.978 -0.539 2.968 a 580.174 580.174 0 0 0 -1.161 6.836 c -0.387 2.36 -0.764 4.721 -1.115 7.087 c -0.148 0.988 -0.291 1.977 -0.424 2.968 c -0.11 0.818 -0.217 1.637 -0.293 2.459 c -0.054 0.578 -0.09 1.157 -0.126 1.737 c -0.056 0.911 -0.104 1.821 -0.149 2.733 c -0.131 2.646 -0.238 5.294 -0.345 7.942 l -0.361 9.433 c -1.759 -1.309 -3.846 -2.133 -5.965 -2.654 a 26.129 26.129 0 0 0 -1.205 -0.264 a 29.917 29.917 0 0 0 -3.527 -0.464 a 40.242 40.242 0 0 0 -3.702 -0.105 c -2.212 0.04 -4.423 0.218 -6.629 0.588 l -0.031 -0.814 c -0.049 -0.88 -0.107 -1.76 -0.182 -2.638 a 1981.39 1981.39 0 0 0 -1.012 -13.872 c -0.169 -2.183 -0.337 -4.367 -0.546 -6.547 c -0.053 -0.554 -0.119 -1.107 -0.177 -1.66 c -0.062 -0.621 -0.122 -1.241 -0.181 -1.861 c -0.228 -2.46 -0.441 -4.921 -0.642 -7.384 a 645.483 645.483 0 0 1 -0.581 -7.608 c -0.138 -1.954 -0.266 -3.91 -0.365 -5.865 c -0.039 -0.77 -0.073 -1.54 -0.097 -2.31 a 35.844 35.844 0 0 1 -0.02 -1.704 c 0.013 -0.742 0.069 -1.483 0.134 -2.222 c 0.086 -0.977 0.193 -1.951 0.308 -2.925 c 0.285 -2.409 0.618 -4.811 0.955 -7.212 l 1.195 -8.342 Z m 60.021 0.231 l 0.817 8.51 a 541.12 541.12 0 0 1 0.788 10.334 c 0.044 0.675 0.09 1.349 0.123 2.024 c 0.02 0.401 0.035 0.804 0.047 1.206 c 0.033 1.126 0.047 2.251 0.053 3.378 c 0.008 1.26 0.006 2.52 -0.001 3.779 a 710.654 710.654 0 0 1 -0.112 8.882 c -0.111 6.065 -0.261 12.129 -0.43 18.193 c -0.085 3.082 -0.185 6.165 -0.259 9.247 c -0.007 0.402 -0.006 0.805 -0.008 1.208 l 0.075 5.72 a 22.814 22.814 0 0 0 -2.786 -0.831 a 24.683 24.683 0 0 0 -5.332 -0.634 a 25.131 25.131 0 0 0 -3.973 0.294 a 26.151 26.151 0 0 0 -7.161 2.226 l -2.037 1.089 l -0.013 -0.101 c -0.205 -1.606 -0.408 -3.21 -0.601 -4.816 c -0.126 -1.057 -0.25 -2.115 -0.359 -3.174 c -0.034 -0.335 -0.068 -0.67 -0.097 -1.004 c -0.028 -0.316 -0.048 -0.632 -0.078 -0.949 a 56.596 56.596 0 0 0 -0.088 -0.817 c -0.147 -1.263 -0.32 -2.521 -0.498 -3.78 a 403.19 403.19 0 0 0 -0.747 -5.01 a 367.68 367.68 0 0 0 -0.75 -4.663 c -0.16 -0.947 -0.319 -1.896 -0.509 -2.837 l -0.05 -0.233 c -0.18 -0.777 -0.364 -1.553 -0.544 -2.331 c -0.928 -4.018 -1.849 -8.038 -2.771 -12.057 l -0.536 -2.337 c -0.023 -0.116 -0.046 -0.232 -0.067 -0.349 l -0.265 -2.863 l 0.898 -0.274 a 8.635 8.635 0 0 0 2.137 -1.285 a 9.66 9.66 0 0 0 1.314 -1.307 c 0.277 -0.335 0.533 -0.687 0.766 -1.054 c 1.867 -2.935 2.257 -6.727 1.153 -10.008 c 1.298 -1.307 2.723 -2.511 4.201 -3.64 a 59.862 59.862 0 0 1 2.572 -1.856 a 67.538 67.538 0 0 1 3.445 -2.195 a 77.16 77.16 0 0 1 5.243 -2.852 a 73.452 73.452 0 0 1 6.44 -2.833 Z"
                                                      onClick={
                                                        this.attributeSymptomTag
                                                      }
                                                      gender="female"
                                                    ></path>
                                                    <path
                                                      class="body-area body-area-knee hover_body"
                                                      body_part="knee "
                                                      data-original-title="Knee"
                                                      id="body-area-knee"
                                                      title=""
                                                      data-toggle="popover"
                                                      data-container="body"
                                                      data-placement="right"
                                                      type="button"
                                                      data-html="true"
                                                      href="#"
                                                      d="M 55.044 218.062 l 2.655 -0.327 a 49.796 49.796 0 0 1 3.704 -0.22 c 0.937 -0.02 1.875 -0.01 2.811 0.034 c 0.79 0.037 1.579 0.099 2.365 0.19 a 27.2 27.2 0 0 1 2.87 0.486 c 0.51 0.114 1.015 0.249 1.515 0.401 c 1.81 0.552 3.564 1.367 5.026 2.564 l -0.054 1.407 c -0.039 0.937 -0.068 1.872 -0.167 2.804 a 19.992 19.992 0 0 1 -0.89 4.205 a 16.794 16.794 0 0 1 -0.93 2.241 c -0.132 0.266 -0.272 0.528 -0.417 0.788 c -0.126 0.229 -0.256 0.456 -0.379 0.688 c -0.065 0.126 -0.121 0.256 -0.181 0.384 c -0.18 0.384 -0.346 0.772 -0.482 1.175 a 14.648 14.648 0 0 0 -0.494 1.947 c -0.139 0.724 -0.24 1.456 -0.323 2.189 l -0.048 0.788 a 49.049 49.049 0 0 1 -7.379 -1.043 c -2.36 -0.527 -4.688 -1.249 -6.884 -2.268 c -1.352 -0.628 -2.663 -1.369 -3.829 -2.287 l 0.663 -2.837 c 0.313 -1.588 0.578 -3.189 0.74 -4.8 c 0.103 -1.022 0.157 -2.05 0.184 -3.076 c 0.028 -1.068 0.027 -2.137 0.008 -3.206 l -0.084 -2.227 Z m 38.685 2.004 l 2.836 -1.496 a 25.069 25.069 0 0 1 6.377 -1.906 a 23.438 23.438 0 0 1 9.852 0.56 l 2.099 0.677 l 0.032 2.432 c 0.036 1.127 0.083 2.256 0.151 3.382 c 0.049 0.785 0.104 1.57 0.191 2.353 c 0.054 0.476 0.121 0.951 0.199 1.424 c 0.278 1.688 0.702 3.348 1.204 4.982 l 0.407 1.219 l -0.296 0.233 c -3.517 2.332 -7.654 3.594 -11.821 4.088 a 36.725 36.725 0 0 1 -5.176 0.237 l -0.79 -0.053 l -0.372 -1.315 c -0.609 -1.765 -1.488 -3.419 -2.318 -5.086 l -0.186 -0.392 a 21.571 21.571 0 0 1 -0.565 -1.353 a 21.896 21.896 0 0 1 -0.982 -3.469 a 19.15 19.15 0 0 1 -0.361 -2.834 c -0.005 -0.164 -0.041 -0.327 -0.063 -0.49 l -0.175 -1.326 l -0.243 -1.867 Z"
                                                      onClick={
                                                        this.attributeSymptomTag
                                                      }
                                                      gender="female"
                                                    ></path>
                                                    <path
                                                      class="body-area body-area-lower_leg hover_body"
                                                      body_part="lower_leg "
                                                      data-original-title="Lower Leg"
                                                      id="body-area-lower_leg"
                                                      title=""
                                                      data-toggle="popover"
                                                      data-container="body"
                                                      data-placement="right"
                                                      type="button"
                                                      data-html="true"
                                                      href="#"
                                                      d="M 61.807 291.5 H 51.573 l -0.029 -0.681 l -0.059 -1.381 c -0.184 -4.465 -0.354 -8.931 -0.508 -13.398 c -0.151 -4.353 -0.287 -8.707 -0.387 -13.062 c -0.033 -1.412 -0.06 -2.825 -0.078 -4.238 a 128.627 128.627 0 0 1 -0.004 -3.622 c 0.019 -1.055 0.059 -2.109 0.114 -3.162 c 0.082 -1.608 0.201 -3.214 0.361 -4.817 c 0.137 -1.375 0.304 -2.748 0.516 -4.115 c 0.153 -0.978 0.323 -1.957 0.567 -2.918 c 0.213 -0.807 0.438 -1.611 0.653 -2.417 l 0.569 -2.434 c 1.065 0.815 2.243 1.48 3.456 2.055 c 2.223 1.053 4.582 1.807 6.976 2.359 a 49.55 49.55 0 0 0 7.844 1.134 l -0.218 3.538 c -0.019 0.813 -0.021 1.625 -0.034 2.438 a 63.38 63.38 0 0 1 -0.032 1.153 c -0.139 3.67 -0.571 7.326 -1.231 10.939 a 80.644 80.644 0 0 1 -0.881 4.21 a 55.441 55.441 0 0 1 -0.813 3.076 c -0.066 0.221 -0.134 0.44 -0.207 0.658 c -0.057 0.172 -0.118 0.342 -0.174 0.513 c -0.097 0.305 -0.192 0.611 -0.286 0.917 a 380.057 380.057 0 0 0 -2.026 6.943 a 418.828 418.828 0 0 0 -2.357 8.622 a 142.41 142.41 0 0 0 -0.716 2.862 a 40.344 40.344 0 0 0 -0.45 2.064 l -0.332 2.764 Z m 60.874 0 h -10.669 l -0.226 -2.197 a 59.46 59.46 0 0 0 -0.24 -1.473 c -0.054 -0.31 -0.111 -0.616 -0.18 -0.922 a 30.105 30.105 0 0 0 -0.387 -1.503 a 78.373 78.373 0 0 0 -0.611 -2.06 c -0.513 -1.65 -1.057 -3.29 -1.617 -4.924 c -0.775 -2.26 -1.57 -4.512 -2.383 -6.758 a 428.154 428.154 0 0 0 -1.617 -4.397 c -0.216 -0.577 -0.439 -1.152 -0.659 -1.728 a 75.64 75.64 0 0 1 -0.277 -0.763 c -0.91 -2.611 -1.605 -5.296 -2.174 -8.001 a 78.076 78.076 0 0 1 -0.635 -3.384 a 48.365 48.365 0 0 1 -0.446 -3.372 c -0.081 -0.945 -0.149 -1.891 -0.225 -2.836 a 68.754 68.754 0 0 0 -0.228 -2.17 c -0.12 -0.981 -0.243 -1.962 -0.371 -2.942 l -0.485 -2.842 l 3.865 -0.043 a 36.93 36.93 0 0 0 1.962 -0.178 c 4.344 -0.515 8.652 -1.843 12.336 -4.305 l 0.539 1.616 c 0.085 0.254 0.167 0.506 0.247 0.76 c 0.117 0.386 0.221 0.775 0.335 1.162 l 0.512 1.713 c 0.245 0.831 0.484 1.664 0.707 2.503 c 0.958 3.595 1.679 7.28 1.797 11.007 c 0.022 0.847 0.045 1.695 0.069 2.542 c 0.164 5.596 0.344 11.193 0.511 16.789 c 0.055 1.862 0.108 3.723 0.159 5.585 c 0.053 2.009 0.104 4.018 0.144 6.027 c 0.026 1.366 0.054 2.733 0.046 4.099 c -0.002 0.241 -0.004 0.482 -0.012 0.723 c -0.005 0.158 -0.013 0.318 -0.017 0.477 l 0.002 0.288 c 0.011 0.318 0.034 0.636 0.08 0.952 l 0.148 0.555 Z"
                                                      onClick={
                                                        this.attributeSymptomTag
                                                      }
                                                      gender="female"
                                                    ></path>
                                                    <path
                                                      class="body-area body-area-foot hover_body"
                                                      body_part="foot "
                                                      data-original-title="Foot"
                                                      id="body-area-foot"
                                                      title=""
                                                      data-toggle="popover"
                                                      data-container="body"
                                                      data-placement="right"
                                                      type="button"
                                                      data-html="true"
                                                      href="#"
                                                      d="M 61.704 292.5 l -0.018 2.06 c 0.011 0.233 0.025 0.465 0.045 0.696 c 0.008 0.084 0.015 0.162 0.026 0.245 c 0.003 0.034 0.005 0.067 0.012 0.1 c 0.029 0.151 0.06 0.301 0.088 0.452 c 0.039 0.21 0.076 0.421 0.111 0.632 c 0.071 0.455 0.135 0.912 0.164 1.371 c 0.014 0.213 0.02 0.429 0.009 0.644 c -0.01 0.174 -0.032 0.35 -0.089 0.515 c -0.034 0.1 -0.088 0.187 -0.137 0.278 a 3.5 3.5 0 0 0 -0.074 0.166 c -0.188 0.479 -0.3 0.988 -0.392 1.492 l -0.001 0.01 l 0.011 0.506 c 0.005 0.286 0.008 0.572 0.011 0.858 a 52.355 52.355 0 0 1 -0.069 3.243 c -0.025 0.424 -0.059 0.849 -0.114 1.272 c -0.044 0.34 -0.098 0.684 -0.201 1.014 c -0.03 0.092 -0.064 0.185 -0.106 0.274 c -0.05 0.105 -0.11 0.207 -0.158 0.314 a 3.966 3.966 0 0 0 -0.094 0.235 a 4.383 4.383 0 0 0 -0.233 1.226 a 4.233 4.233 0 0 0 -0.006 0.298 c 0.001 0.051 -0.003 0.114 0.007 0.165 c 0.038 0.195 0.081 0.389 0.118 0.585 c 0.054 0.286 0.054 0.285 0.105 0.572 c 0.147 0.889 0.264 1.787 0.279 2.69 c 0.004 0.234 0 0.469 -0.013 0.703 c -0.009 0.168 -0.026 0.335 -0.037 0.503 c -0.005 0.045 -0.005 0.045 -0.014 0.092 c -0.048 0.216 -0.136 0.42 -0.219 0.625 c -0.145 0.349 -0.294 0.696 -0.437 1.046 c -0.079 0.198 -0.158 0.397 -0.232 0.598 l -0.098 0.272 c -0.03 0.07 -0.03 0.069 -0.061 0.137 c -0.067 0.128 -0.144 0.25 -0.236 0.362 c -0.439 0.531 -1.119 0.808 -1.777 0.947 a 4.554 4.554 0 0 1 -0.463 0.075 c -0.095 0.011 -0.189 0.02 -0.284 0.025 c -0.047 0.002 -0.095 0.001 -0.143 0.004 c -0.11 0.01 -0.22 0.022 -0.331 0.031 c -0.12 0.007 -0.24 0.01 -0.36 0.001 a 2.007 2.007 0 0 1 -0.567 -0.125 c -0.377 -0.145 -0.695 -0.408 -0.95 -0.719 a 2.55 2.55 0 0 1 -0.112 -0.145 l -0.006 0.015 a 2.108 2.108 0 0 1 -0.127 0.251 a 1.89 1.89 0 0 1 -1.329 0.872 a 1.51 1.51 0 0 1 -0.403 0.006 c -0.439 -0.061 -0.785 -0.366 -1.036 -0.718 a 1.98 1.98 0 0 1 -0.817 0.201 a 1.533 1.533 0 0 1 -0.621 -0.101 c -0.34 -0.137 -0.603 -0.403 -0.79 -0.717 a 1.284 1.284 0 0 1 -0.201 0.05 c -0.535 0.094 -1.064 -0.132 -1.486 -0.444 l -0.033 -0.025 a 1.246 1.246 0 0 1 -0.401 0.053 c -0.152 0 -0.303 -0.018 -0.452 -0.046 a 1.68 1.68 0 0 1 -0.295 -0.075 a 1.355 1.355 0 0 1 -0.205 -0.103 a 1.617 1.617 0 0 1 -0.624 -0.71 c -0.238 -0.517 -0.255 -1.114 -0.212 -1.671 c 0.056 -0.726 0.224 -1.441 0.421 -2.14 c 0.099 -0.351 0.213 -0.696 0.314 -1.046 l 0.03 -0.117 c 0.128 -0.43 0.309 -0.844 0.48 -1.257 c 0.437 -1.042 0.886 -2.079 1.325 -3.12 c 0.225 -0.536 0.453 -1.07 0.658 -1.614 c 0.345 -0.922 0.641 -1.864 0.888 -2.817 c 0.122 -0.471 0.232 -0.947 0.321 -1.426 c 0.064 -0.343 0.122 -0.689 0.142 -1.038 c 0.015 -0.235 -0.008 -0.471 -0.018 -0.706 a 59.83 59.83 0 0 1 -0.014 -2.993 c 0.004 -0.196 0.009 -0.39 0.019 -0.584 c 0.008 -0.168 0.015 -0.336 0.066 -0.497 c 0.054 -0.17 0.144 -0.326 0.236 -0.478 c 0.096 -0.156 0.197 -0.31 0.293 -0.467 a 5.206 5.206 0 0 0 0.582 -1.327 c 0.14 -0.502 0.202 -1.018 0.207 -1.556 h 10.128 Z m 61.244 0 l 0.11 0.412 c 0.144 0.371 0.311 0.732 0.488 1.088 c 0.141 0.282 0.291 0.559 0.432 0.841 c 0.037 0.078 0.075 0.157 0.11 0.236 c 0.056 0.134 0.104 0.269 0.132 0.412 c 0.018 0.136 0.026 0.274 0.037 0.411 c 0.053 0.669 0.103 1.339 0.141 2.01 c 0.024 0.457 0.045 0.915 0.049 1.373 c 0.001 0.126 0.001 0.251 -0.002 0.377 c -0.003 0.095 -0.01 0.189 -0.011 0.285 c 0 0.062 0.003 0.123 0.007 0.184 c 0.043 0.474 0.149 0.941 0.263 1.402 a 26.8 26.8 0 0 0 0.495 1.726 c 0.23 0.72 0.482 1.434 0.755 2.139 c 0.211 0.543 0.437 1.081 0.663 1.619 c 0.438 1.042 0.887 2.079 1.324 3.12 c 0.094 0.226 0.186 0.452 0.276 0.68 c 0.064 0.165 0.128 0.329 0.18 0.497 c 0.027 0.088 0.047 0.177 0.073 0.265 c 0.082 0.266 0.164 0.532 0.244 0.798 c 0.238 0.828 0.452 1.68 0.485 2.546 c 0.02 0.486 -0.018 0.998 -0.226 1.445 a 1.602 1.602 0 0 1 -0.624 0.711 a 1.214 1.214 0 0 1 -0.5 0.177 c -0.13 0.025 -0.261 0.041 -0.394 0.045 a 1.477 1.477 0 0 1 -0.458 -0.053 c -0.03 0.025 -0.062 0.047 -0.094 0.069 c -0.411 0.288 -0.916 0.489 -1.424 0.401 a 1.3 1.3 0 0 1 -0.202 -0.051 c -0.197 0.327 -0.474 0.606 -0.838 0.737 a 1.33 1.33 0 0 1 -0.252 0.064 c -0.19 0.03 -0.386 0.025 -0.576 -0.005 a 1.977 1.977 0 0 1 -0.562 -0.179 c -0.25 0.351 -0.598 0.657 -1.036 0.717 a 1.47 1.47 0 0 1 -0.403 -0.005 a 1.812 1.812 0 0 1 -0.453 -0.125 a 1.9 1.9 0 0 1 -0.945 -0.869 a 2.162 2.162 0 0 1 -0.068 -0.156 c -0.039 0.054 -0.08 0.107 -0.122 0.159 a 2.38 2.38 0 0 1 -0.855 0.68 c -0.278 0.123 -0.58 0.175 -0.882 0.168 c -0.163 -0.003 -0.323 -0.03 -0.484 -0.039 c -0.062 -0.002 -0.123 -0.003 -0.185 -0.007 a 5.012 5.012 0 0 1 -0.893 -0.145 c -0.607 -0.157 -1.219 -0.443 -1.609 -0.953 a 1.884 1.884 0 0 1 -0.224 -0.373 c -0.046 -0.103 -0.08 -0.21 -0.121 -0.314 l -0.068 -0.152 c -0.133 -0.27 -0.304 -0.515 -0.461 -0.771 c -0.042 -0.071 -0.041 -0.07 -0.082 -0.143 a 2.713 2.713 0 0 1 -0.195 -0.461 a 2.835 2.835 0 0 1 -0.104 -0.88 c 0.021 -0.62 0.055 -1.24 0.085 -1.859 c 0.039 -0.752 0.075 -1.505 0.127 -2.256 c 0.01 -0.153 0.022 -0.316 0.035 -0.47 c 0.012 -0.131 0.025 -0.262 0.034 -0.394 a 3.3 3.3 0 0 0 -0.036 -0.727 a 3.759 3.759 0 0 0 -0.249 -0.81 a 5.884 5.884 0 0 0 -0.213 -0.446 c -0.049 -0.094 -0.101 -0.185 -0.148 -0.28 a 1.884 1.884 0 0 1 -0.056 -0.13 c -0.135 -0.357 -0.201 -0.737 -0.253 -1.112 a 17.775 17.775 0 0 1 -0.134 -1.492 a 41.769 41.769 0 0 1 -0.059 -2.001 c -0.006 -0.674 0 -1.348 0.016 -2.022 a 24.474 24.474 0 0 0 -0.124 -0.536 a 15.449 15.449 0 0 0 -0.232 -0.857 a 5.122 5.122 0 0 0 -0.237 -0.659 c -0.031 -0.07 -0.07 -0.135 -0.107 -0.202 l -0.031 -0.065 a 2.557 2.557 0 0 1 -0.144 -0.731 a 8.884 8.884 0 0 1 -0.021 -0.711 c 0.003 -0.758 0.06 -1.516 0.129 -2.269 l 0.016 -0.166 l 0.011 -0.112 a 22.569 22.569 0 0 0 -0.014 -0.448 l -0.139 -1.358 h 10.833 Z"
                                                      onClick={
                                                        this.attributeSymptomTag
                                                      }
                                                      gender="female"
                                                    ></path>
                                                  </g>
                                                </svg>

                                                {/* <!--front--> */}
                                                {/* <!--back body--> */}
                                                <svg
                                                  xmlns="http://www.w3.org/2000/svg"
                                                  class="female-back-s"
                                                  id="female_back"
                                                  fill-rule="evenodd"
                                                  stroke-linejoin="round"
                                                  stroke-miterlimit="1.414"
                                                  viewBox="0 0 168 320"
                                                >
                                                  <g>
                                                    <path d="M 70.507 43.199 c -0.063 0.29 -0.116 0.589 -0.111 0.887 c 0.001 0.06 0.005 0.119 0.014 0.178 c 0.011 0.065 0.028 0.129 0.037 0.195 l 0.001 0.015 c 0.001 0.071 0.001 0.071 -0.008 0.142 l -0.001 0.004 c -0.008 0.028 -0.014 0.056 -0.024 0.084 a 0.507 0.507 0 0 1 -0.152 0.208 c -0.022 0.018 -0.048 0.033 -0.072 0.049 l -0.001 0.001 c -0.024 0.012 -0.049 0.025 -0.073 0.034 a 0.516 0.516 0 0 1 -0.318 0.011 c -0.069 -0.02 -0.083 -0.033 -0.145 -0.069 l -0.002 -0.002 c -0.06 -0.049 -0.06 -0.048 -0.112 -0.106 a 0.535 0.535 0 0 1 -0.087 -0.15 c -0.045 -0.098 -0.082 -0.202 -0.12 -0.303 a 38.817 38.817 0 0 1 -1.47 -5.405 a 3.057 3.057 0 0 0 -0.018 0.235 l -0.001 0.062 c 0.01 0.057 0.021 0.115 0.028 0.173 l 0.002 0.026 l -0.003 0.093 c -0.02 0.089 -0.02 0.089 -0.054 0.174 l -0.001 0.001 c -0.042 0.065 -0.049 0.085 -0.106 0.138 a 0.509 0.509 0 0 1 -0.711 -0.026 c -0.021 -0.021 -0.037 -0.046 -0.055 -0.069 l -0.001 -0.002 c -0.031 -0.056 -0.032 -0.055 -0.056 -0.114 a 1.001 1.001 0 0 1 -0.051 -0.287 a 100.994 100.994 0 0 1 -1.14 -8.301 a 82.473 82.473 0 0 1 -0.333 -5.328 a 60.055 60.055 0 0 1 0.048 -4.985 c 0.083 -1.59 0.239 -3.179 0.503 -4.751 c 0.095 -0.564 0.206 -1.125 0.332 -1.683 c 0.348 -1.53 0.822 -3.041 1.505 -4.456 c 0.501 -1.036 1.117 -2.022 1.881 -2.885 c 0.258 -0.291 0.533 -0.564 0.821 -0.824 l 0.076 -0.067 c 0.082 -0.099 0.167 -0.195 0.252 -0.292 a 23.917 23.917 0 0 1 1.801 -1.808 a 22.98 22.98 0 0 1 1.112 -0.934 a 16.805 16.805 0 0 1 3.137 -1.988 c 0.968 -0.463 1.996 -0.815 3.057 -0.977 c 0.395 -0.059 0.792 -0.09 1.191 -0.097 c 0.152 0 0.151 0 0.302 0.003 a 8.32 8.32 0 0 1 1.22 0.132 c 0.223 0.042 0.443 0.098 0.663 0.156 c 0.248 0.065 0.495 0.133 0.741 0.204 c 0.746 0.215 1.486 0.455 2.201 0.756 c 0.266 0.112 0.529 0.232 0.784 0.368 c 0.164 0.088 0.326 0.181 0.481 0.285 c 0.095 0.065 0.192 0.133 0.281 0.208 a 5.857 5.857 0 0 1 1.057 -0.299 a 5.406 5.406 0 0 1 1.82 -0.008 c 1.556 0.254 2.948 1.124 4.111 2.156 c 0.224 0.199 0.441 0.405 0.652 0.618 c 0.217 0.219 0.428 0.444 0.633 0.676 c 0.295 0.334 0.579 0.68 0.851 1.035 c 0.323 0.421 0.63 0.855 0.922 1.298 c 0.379 0.573 0.734 1.162 1.068 1.763 a 32.033 32.033 0 0 1 3.138 8.14 c 0.161 0.686 0.297 1.376 0.388 2.075 a 26.06 26.06 0 0 1 0.19 3.819 a 42.838 42.838 0 0 1 -0.326 4.442 a 64.28 64.28 0 0 1 -0.803 4.9 a 86.083 86.083 0 0 1 -1.657 6.738 l -0.082 0.284 l -0.057 0.196 l -0.025 0.119 a 0.88 0.88 0 0 1 -0.089 0.224 c -0.012 0.019 -0.027 0.038 -0.04 0.057 l -0.002 0.002 c -0.02 0.02 -0.037 0.042 -0.057 0.059 a 0.51 0.51 0 0 1 -0.832 -0.29 c -0.005 -0.027 -0.006 -0.055 -0.008 -0.081 l -0.001 -0.004 c 0.001 -0.021 0.001 -0.041 0.003 -0.061 c 0.008 -0.081 0.036 -0.159 0.057 -0.236 c 0.007 -0.057 0.008 -0.114 0.008 -0.172 a 5.82 5.82 0 0 0 -0.056 -0.722 l -0.121 0.441 a 99.43 99.43 0 0 1 -0.965 3.253 c -0.11 0.347 -0.222 0.692 -0.339 1.036 c -0.098 0.293 -0.199 0.586 -0.321 0.869 l -0.032 0.069 c -0.028 0.053 -0.033 0.064 -0.063 0.109 a 0.543 0.543 0 0 1 -0.223 0.194 a 0.514 0.514 0 0 1 -0.649 -0.189 c -0.02 -0.034 -0.026 -0.043 -0.043 -0.081 a 0.64 0.64 0 0 1 -0.041 -0.237 l 0.003 -0.056 c -0.084 0.151 -0.171 0.299 -0.262 0.445 c -0.265 0.426 -0.555 0.843 -0.902 1.206 c -0.168 0.176 -0.362 0.362 -0.599 0.438 a 0.64 0.64 0 0 1 -0.38 0.005 a 0.597 0.597 0 0 1 -0.399 -0.48 a 0.937 0.937 0 0 1 0.006 -0.299 c 0.009 -0.051 0.021 -0.101 0.029 -0.153 c 0.006 -0.047 0.01 -0.094 0.013 -0.14 c 0.018 -0.446 -0.061 -0.893 -0.153 -1.326 l -0.053 -0.243 c -0.001 0.091 0.003 0.181 0.018 0.269 c 0.011 0.063 0.032 0.122 0.051 0.183 l 0.01 0.051 a 0.538 0.538 0 0 1 -0.052 0.308 a 0.513 0.513 0 0 1 -0.634 0.238 a 5.449 5.449 0 0 0 0.071 0.975 c 0.222 1.341 0.936 2.551 1.811 3.568 a 12.97 12.97 0 0 0 1.051 1.073 a 16.054 16.054 0 0 0 2.141 1.621 a 19.27 19.27 0 0 0 2.713 1.437 c 0.763 0.331 1.548 0.615 2.35 0.84 c 0.644 0.182 1.299 0.327 1.961 0.419 c 0.344 0.048 0.689 0.081 1.035 0.095 c 0.343 0.015 0.686 0.009 1.03 0.015 c 0.207 0.005 0.415 0.012 0.622 0.02 c 1.169 0.054 2.344 0.166 3.484 0.442 c 0.369 0.09 0.735 0.196 1.09 0.334 c 0.231 0.089 0.461 0.192 0.671 0.325 l -0.013 -0.009 c 0.958 0.423 1.871 0.942 2.716 1.56 a 14.472 14.472 0 0 1 2.644 2.515 c 1.978 2.419 3.164 5.395 3.834 8.424 c 0.106 0.473 0.198 0.948 0.279 1.425 c 0.116 0.686 0.211 1.377 0.283 2.069 c 0.179 1.679 0.236 3.37 0.198 5.057 a 45.004 45.004 0 0 1 -0.1 2.168 c -0.01 0.161 -0.025 0.323 -0.028 0.483 c 0 0.06 0.004 0.12 0.008 0.179 c 0.022 0.256 0.055 0.51 0.092 0.765 c 0.048 0.339 0.104 0.677 0.162 1.015 a 81.2 81.2 0 0 0 0.449 2.383 c 0.459 2.276 0.98 4.54 1.549 6.791 c 0.644 2.549 1.35 5.086 2.185 7.578 c 0.315 0.94 0.648 1.874 1.016 2.795 c 0.374 0.938 0.784 1.863 1.27 2.749 c 0.158 0.279 0.322 0.554 0.484 0.831 c 0.326 0.558 0.651 1.117 0.974 1.677 c 0.937 1.637 1.845 3.289 2.669 4.986 a 53.41 53.41 0 0 1 2.363 5.644 a 51.852 51.852 0 0 1 1.71 6.056 c 0.142 0.652 0.273 1.308 0.393 1.965 c 0.11 0.602 0.207 1.207 0.314 1.809 a 95.84 95.84 0 0 0 0.914 4.42 c 0.602 2.58 1.31 5.135 2.088 7.666 c 0.448 1.462 0.921 2.916 1.41 4.366 c 0.401 1.194 0.814 2.385 1.219 3.579 c 0.086 0.257 0.172 0.514 0.256 0.77 c 0.087 0.265 0.17 0.532 0.259 0.797 c 0.328 0.947 0.712 1.876 1.176 2.764 c 0.297 0.568 0.624 1.123 1.007 1.636 c 0.385 0.197 0.769 0.398 1.153 0.599 c 0.35 0.185 0.701 0.372 1.049 0.563 c 0.265 0.147 0.531 0.294 0.791 0.451 c 0.264 0.159 0.524 0.33 0.777 0.506 c 0.35 0.245 0.69 0.506 1.007 0.793 c 0.27 0.245 0.526 0.511 0.739 0.808 c 0.153 0.214 0.285 0.445 0.368 0.693 c 0.03 0.093 0.054 0.186 0.071 0.281 c 0.012 0.071 0.016 0.142 0.025 0.214 l 0.026 0.126 c 0.06 0.227 0.147 0.444 0.242 0.657 c 0.109 0.242 0.23 0.48 0.357 0.713 c 0.315 0.58 0.665 1.141 1.03 1.691 l 0.056 0.083 c 0.079 0.09 0.157 0.182 0.233 0.275 a 4.705 4.705 0 0 1 0.49 0.724 c 0.031 0.058 0.06 0.116 0.086 0.175 c 0.159 0.351 0.252 0.777 0.095 1.147 a 0.967 0.967 0 0 1 -0.098 0.182 a 0.84 0.84 0 0 1 -0.175 0.187 a 0.89 0.89 0 0 1 -0.162 0.097 a 3.286 3.286 0 0 1 -0.253 0.105 a 2.428 2.428 0 0 1 -0.571 0.131 a 2.508 2.508 0 0 1 -0.792 -0.044 c -0.544 -0.116 -1.039 -0.396 -1.472 -0.739 a 5.542 5.542 0 0 1 -0.308 -0.263 c 0.089 0.338 0.185 0.675 0.285 1.01 c 0.471 1.573 1.039 3.116 1.641 4.643 c 0.168 0.426 0.339 0.851 0.511 1.277 c 0.145 0.356 0.293 0.711 0.433 1.07 a 7.005 7.005 0 0 1 0.248 0.788 c 0.13 0.53 0.188 1.08 0.139 1.624 a 3.458 3.458 0 0 1 -0.18 0.847 c -0.07 0.198 -0.163 0.399 -0.302 0.558 a 1.078 1.078 0 0 1 -0.245 0.196 a 1.063 1.063 0 0 1 -0.287 0.126 a 0.872 0.872 0 0 1 -0.209 0.03 c -0.439 0.012 -0.805 -0.284 -1.076 -0.601 a 5.448 5.448 0 0 1 -0.567 -0.829 c -0.294 -0.516 -0.578 -1.039 -0.862 -1.56 c -0.496 -0.907 -0.986 -1.817 -1.468 -2.731 l -0.018 -0.037 c 0.074 0.272 0.073 0.272 0.145 0.544 c 0.068 0.274 0.068 0.273 0.134 0.548 c 0.233 0.995 0.428 1.997 0.591 3.005 c 0.055 0.345 0.108 0.69 0.159 1.035 c 0.041 0.282 0.079 0.565 0.125 0.847 c 0.019 0.099 0.038 0.199 0.059 0.298 c 0.115 0.51 0.262 1.009 0.393 1.514 c 0.028 0.12 0.057 0.24 0.082 0.36 c 0.077 0.386 0.137 0.807 -0.007 1.185 a 1.046 1.046 0 0 1 -0.153 0.273 c -0.336 0.431 -0.968 0.497 -1.459 0.335 a 1.68 1.68 0 0 1 -0.298 -0.13 c -0.314 -0.172 -0.575 -0.427 -0.796 -0.706 c -0.369 -0.466 -0.636 -1.003 -0.852 -1.553 l -0.03 -0.082 c -0.063 -0.181 -0.118 -0.364 -0.177 -0.545 l -0.413 -1.306 c -0.294 -0.931 -0.583 -1.864 -0.866 -2.798 l -0.373 -1.242 c -0.067 -0.215 -0.066 -0.215 -0.136 -0.428 a 11.309 11.309 0 0 0 -0.391 -1.015 l -0.008 -0.017 c 0.035 0.896 0.115 1.79 0.208 2.681 c 0.11 1.039 0.243 2.076 0.404 3.108 c 0.054 0.342 0.111 0.683 0.172 1.023 c 0.039 0.22 0.082 0.44 0.119 0.661 l 0.047 0.312 c 0.069 0.529 0.114 1.066 0.062 1.6 c -0.033 0.349 -0.108 0.704 -0.276 1.014 c -0.079 0.147 -0.18 0.282 -0.303 0.395 a 1.218 1.218 0 0 1 -0.344 0.223 a 1.129 1.129 0 0 1 -0.732 0.049 c -0.382 -0.108 -0.663 -0.422 -0.87 -0.748 a 3.143 3.143 0 0 1 -0.119 -0.202 a 7.198 7.198 0 0 1 -0.505 -1.214 a 16.851 16.851 0 0 1 -0.407 -1.479 a 32.212 32.212 0 0 1 -0.568 -3.258 c -0.069 -0.557 -0.114 -1.115 -0.169 -1.673 c -0.02 -0.192 -0.042 -0.384 -0.065 -0.575 c -0.074 -0.584 -0.155 -1.174 -0.335 -1.737 l -0.027 -0.078 l -0.007 -0.018 a 5.073 5.073 0 0 0 -0.085 0.291 c -0.156 0.616 -0.245 1.247 -0.322 1.877 a 46.329 46.329 0 0 0 -0.196 2.068 c -0.026 0.35 -0.048 0.7 -0.075 1.05 c -0.014 0.163 -0.03 0.326 -0.048 0.488 c -0.062 0.526 -0.142 1.052 -0.305 1.557 c -0.094 0.293 -0.217 0.586 -0.412 0.827 a 1.202 1.202 0 0 1 -0.318 0.285 a 0.953 0.953 0 0 1 -0.309 0.123 a 0.878 0.878 0 0 1 -0.52 -0.052 c -0.043 -0.017 -0.044 -0.02 -0.081 -0.039 l -0.006 -0.003 l 0.006 0.003 l 0.001 0.001 c 0.001 0.003 -0.004 -0.001 -0.007 -0.003 c -0.019 -0.009 -0.038 -0.017 -0.056 -0.028 a 1.15 1.15 0 0 1 -0.319 -0.261 c -0.209 -0.245 -0.33 -0.559 -0.411 -0.868 a 7.294 7.294 0 0 1 -0.202 -1.308 a 17.792 17.792 0 0 1 -0.047 -1.366 c 0 -0.992 0.055 -1.985 0.13 -2.974 c 0.04 -0.524 0.092 -1.047 0.128 -1.573 c 0.01 -0.174 0.018 -0.349 0.022 -0.523 a 8.596 8.596 0 0 0 -0.011 -0.7 c -0.003 -0.055 -0.008 -0.106 -0.013 -0.159 c -0.004 -0.036 -0.005 -0.08 -0.015 -0.114 a 15.907 15.907 0 0 0 -0.048 -0.159 c -0.14 -0.454 -0.282 -0.906 -0.419 -1.36 a 32.52 32.52 0 0 1 -0.627 -2.419 a 23.135 23.135 0 0 1 -0.498 -3.878 a 21.453 21.453 0 0 1 0.086 -2.967 c 0.02 -0.193 0.042 -0.386 0.057 -0.578 c 0.008 -0.114 0.015 -0.227 0.02 -0.339 c 0.078 -2.057 -0.384 -4.101 -1.08 -6.025 a 24.198 24.198 0 0 0 -0.864 -2.072 a 18.33 18.33 0 0 0 -0.719 -1.384 c -2.025 -4.001 -4.051 -8.003 -6.078 -12.002 c -1.994 -3.93 -3.984 -7.86 -5.995 -11.779 c -0.263 -0.511 -0.525 -1.021 -0.793 -1.528 a 19.351 19.351 0 0 1 -0.212 -0.404 a 20.83 20.83 0 0 1 -0.216 -0.451 a 32.995 32.995 0 0 1 -0.848 -2.06 a 53.016 53.016 0 0 1 -0.657 -1.855 a 46.116 46.116 0 0 1 -0.556 -1.786 a 21.939 21.939 0 0 1 -0.38 -1.489 a 13.22 13.22 0 0 1 -0.075 -0.397 c -0.031 -0.193 -0.053 -0.387 -0.083 -0.581 a 9.9 9.9 0 0 0 -0.062 -0.344 a 8.649 8.649 0 0 0 -0.28 -1.002 c -0.212 -0.605 -0.44 -1.206 -0.654 -1.809 c -0.146 -0.415 -0.285 -0.832 -0.431 -1.246 c -0.072 -0.2 -0.145 -0.399 -0.219 -0.598 a 216.173 216.173 0 0 0 -1.32 -3.409 a 825.764 825.764 0 0 0 -1.647 -4.131 a 1993.32 1993.32 0 0 0 -3.836 -9.47 l -0.007 0.062 a 98.63 98.63 0 0 1 -0.181 1.329 a 333.4 333.4 0 0 1 -0.414 2.809 c -0.537 3.546 -1.092 7.089 -1.63 10.634 a 437.054 437.054 0 0 0 -0.581 3.951 c -0.163 1.162 -0.328 2.327 -0.418 3.499 a 36.414 36.414 0 0 0 -0.099 3.098 c 0.009 0.988 0.055 1.976 0.142 2.959 c 0.074 0.841 0.177 1.68 0.334 2.509 c 0.076 0.397 0.163 0.792 0.277 1.18 c 0.08 0.269 0.17 0.54 0.3 0.789 c 0.093 0.179 0.226 0.329 0.344 0.491 c 0.08 0.115 0.158 0.23 0.235 0.345 c 0.452 0.705 0.842 1.448 1.2 2.205 c 0.365 0.773 0.697 1.56 1.006 2.357 c 0.884 2.284 1.593 4.635 2.21 7.004 c 0.197 0.762 0.388 1.526 0.558 2.295 a 90.722 90.722 0 0 1 1.058 5.862 c 0.278 1.836 0.518 3.678 0.736 5.521 c 0.48 4.039 0.858 8.088 1.205 12.141 l 0.266 3.148 c 0.043 0.503 0.087 1.007 0.128 1.511 c 0.013 0.178 0.024 0.356 0.033 0.534 c 0.05 1.052 0.05 2.104 0.031 3.156 c -0.02 1.15 -0.061 2.3 -0.113 3.448 a 288.66 288.66 0 0 1 -0.574 9.016 a 706.382 706.382 0 0 1 -1.683 18.434 c -0.11 1.067 -0.221 2.134 -0.337 3.201 c -0.09 0.836 -0.184 1.672 -0.272 2.509 c -0.056 0.551 -0.111 1.103 -0.162 1.655 a 252.089 252.089 0 0 0 -0.553 7.367 a 315.123 315.123 0 0 0 -0.332 6.517 c -0.074 1.83 -0.133 3.66 -0.157 5.491 a 72.443 72.443 0 0 0 -0.003 2.032 c 0.006 0.503 0.016 1.009 0.063 1.51 c 0.04 0.415 0.102 0.827 0.171 1.237 c 0.075 0.451 0.161 0.899 0.251 1.346 c 0.223 1.119 0.476 2.234 0.73 3.347 c 0.478 2.075 0.969 4.148 1.449 6.224 c 0.413 1.805 0.821 3.612 1.201 5.424 c 0.25 1.189 0.499 2.38 0.702 3.579 a 51.15 51.15 0 0 1 0.465 3.464 c 0.24 2.381 0.317 4.777 0.286 7.17 c -0.025 1.804 -0.118 3.606 -0.188 5.408 c -0.011 0.32 -0.021 0.639 -0.027 0.958 c -0.002 0.168 -0.004 0.336 -0.003 0.504 c 0.001 0.222 0.008 0.444 0.009 0.668 c -0.001 0.232 -0.004 0.464 -0.009 0.698 a 154.689 154.689 0 0 1 -0.149 3.909 a 711.5 711.5 0 0 1 -0.305 5.832 c -0.186 3.327 -0.377 6.652 -0.562 9.979 c -0.054 0.992 -0.107 1.985 -0.154 2.978 c -0.047 1.002 -0.1 2.007 -0.042 3.01 c 0.069 1.207 0.274 2.402 0.608 3.562 a 19.686 19.686 0 0 0 0.726 2.057 c 0.213 0.48 0.472 0.94 0.707 1.409 l 0.118 0.247 c 0.107 0.237 0.21 0.476 0.293 0.723 c 0.124 0.366 0.21 0.745 0.251 1.129 c 0.021 0.205 0.031 0.41 0.022 0.615 c -0.021 0.446 -0.122 0.885 -0.245 1.312 c -0.152 0.531 -0.34 1.05 -0.515 1.574 a 24.98 24.98 0 0 0 -0.166 0.53 a 6.438 6.438 0 0 0 -0.187 0.811 c -0.041 0.281 -0.053 0.564 0.007 0.843 c 0.052 0.206 0.113 0.411 0.167 0.617 c 0.171 0.673 0.319 1.352 0.371 2.046 a 6.524 6.524 0 0 1 -0.445 2.927 a 3.418 3.418 0 0 1 -0.204 0.449 a 2.909 2.909 0 0 1 -0.537 0.682 a 4.314 4.314 0 0 1 -1.181 0.769 a 7.66 7.66 0 0 1 -1.785 0.538 c -0.732 0.135 -1.48 0.191 -2.225 0.178 a 7.676 7.676 0 0 1 -1.555 -0.158 a 5.895 5.895 0 0 1 -1.947 -0.822 a 5.03 5.03 0 0 1 -1.152 -1.021 a 3.707 3.707 0 0 1 -0.759 -1.489 a 3.117 3.117 0 0 1 -0.082 -0.887 c 0.009 -0.195 0.041 -0.386 0.059 -0.579 c 0.01 -0.116 0.018 -0.231 0.025 -0.348 c 0.024 -0.483 0.029 -0.968 0.023 -1.452 l -0.12 -0.017 c -0.201 -0.03 -0.4 -0.073 -0.594 -0.133 a 3.74 3.74 0 0 1 -1.894 -1.326 a 3.46 3.46 0 0 1 -0.444 -0.753 l -0.017 -0.051 a 7.296 7.296 0 0 1 -0.144 -0.715 c -0.156 -1.001 -0.126 -2.075 0.335 -2.996 a 3.237 3.237 0 0 1 0.616 -0.857 a 3.272 3.272 0 0 1 1.116 -0.734 a 2.35 2.35 0 0 1 0.358 -0.11 a 0.652 0.652 0 0 1 0.108 -0.006 l 0.033 0.003 v -0.003 c -0.027 -0.151 -0.027 -0.151 -0.05 -0.302 a 12.752 12.752 0 0 1 -0.103 -0.954 c -0.067 -0.946 -0.037 -1.897 0.03 -2.843 c 0.026 -0.384 0.061 -0.77 0.098 -1.154 c 0.021 -0.203 0.046 -0.407 0.061 -0.611 c 0.005 -0.087 0.008 -0.174 0.009 -0.262 c 0.002 -0.705 -0.085 -1.409 -0.185 -2.106 a 48.699 48.699 0 0 0 -0.434 -2.49 a 103.32 103.32 0 0 0 -0.787 -3.605 a 142.549 142.549 0 0 0 -0.89 -3.577 l -0.026 -0.101 c -0.707 -2.352 -1.411 -4.704 -2.115 -7.057 c -0.607 -2.033 -1.211 -4.066 -1.813 -6.101 c -0.414 -1.401 -0.825 -2.803 -1.236 -4.205 c -0.127 -0.441 -0.257 -0.883 -0.381 -1.325 c -0.358 -1.305 -0.594 -2.64 -0.791 -3.977 a 88.428 88.428 0 0 1 -0.574 -5.079 c -0.253 -2.886 -0.418 -5.778 -0.551 -8.672 c -0.08 -1.729 -0.145 -3.459 -0.219 -5.188 c -0.016 -0.333 -0.031 -0.667 -0.05 -1.001 a 24.278 24.278 0 0 0 -0.293 -2.522 a 26.109 26.109 0 0 0 -0.794 -3.297 a 35.939 35.939 0 0 0 -0.901 -2.553 c -0.217 -0.552 -0.448 -1.097 -0.678 -1.643 c -0.064 -0.157 -0.064 -0.157 -0.126 -0.315 a 20.93 20.93 0 0 1 -1.032 -3.923 a 27.31 27.31 0 0 1 -0.346 -2.993 l -0.003 -0.047 l -0.538 -9.668 c -0.064 -1.443 -0.132 -2.886 -0.199 -4.33 a 880.057 880.057 0 0 0 -0.439 -8.434 c -0.06 -1.034 -0.123 -2.069 -0.194 -3.102 c -0.049 -0.699 -0.098 -1.399 -0.177 -2.095 a 73.72 73.72 0 0 0 -0.437 -3.108 a 254.406 254.406 0 0 0 -0.742 -4.447 c -0.685 -3.934 -1.425 -7.857 -2.138 -11.786 c -0.082 -0.456 -0.163 -0.912 -0.242 -1.369 a 36.241 36.241 0 0 1 -0.467 -4.588 a 8.512 8.512 0 0 1 -1.742 -2.605 a 9.894 9.894 0 0 1 -0.601 -1.941 c -0.012 -0.058 -0.024 -0.116 -0.034 -0.175 l -0.01 0.05 a 9.973 9.973 0 0 1 -0.626 2.066 a 8.88 8.88 0 0 1 -0.641 1.217 c 0.04 0.182 0.056 0.372 0.065 0.559 c 0.02 0.438 -0.003 0.877 -0.035 1.315 a 32.637 32.637 0 0 1 -0.157 1.562 c -0.212 1.763 -0.503 3.517 -0.806 5.267 c -0.376 2.17 -0.783 4.335 -1.193 6.499 c -0.273 1.441 -0.548 2.881 -0.819 4.321 c -0.137 0.729 -0.271 1.458 -0.402 2.188 a 68.966 68.966 0 0 0 -0.33 1.976 c -0.106 0.718 -0.194 1.44 -0.278 2.161 c -0.09 0.78 -0.174 1.562 -0.253 2.344 c -0.19 1.877 -0.362 3.755 -0.525 5.634 a 892.182 892.182 0 0 0 -1.042 13.277 c -0.082 1.148 -0.164 2.297 -0.243 3.445 c -0.05 0.717 -0.098 1.433 -0.15 2.148 c -0.025 0.318 -0.05 0.635 -0.077 0.952 c -0.115 1.266 -0.254 2.53 -0.474 3.781 c -0.172 0.976 -0.391 1.948 -0.721 2.884 c -0.177 0.5 -0.386 0.988 -0.629 1.459 c -0.117 0.224 -0.237 0.445 -0.36 0.665 c -0.07 0.125 -0.143 0.249 -0.209 0.378 a 5.512 5.512 0 0 0 -0.097 0.222 c -0.142 0.362 -0.252 0.735 -0.354 1.111 c -0.136 0.5 -0.255 1.005 -0.367 1.513 a 72.43 72.43 0 0 0 -0.7 3.672 a 112.02 112.02 0 0 0 -0.633 4.308 a 98.359 98.359 0 0 0 -0.437 4.049 a 67.965 67.965 0 0 0 -0.14 1.908 c -0.036 0.602 -0.063 1.204 -0.095 1.806 l -0.073 1.188 a 157.238 157.238 0 0 1 -0.618 7.026 a 104.5 104.5 0 0 1 -0.317 2.559 c -0.1 0.727 -0.207 1.454 -0.342 2.175 c -0.092 0.483 -0.211 0.959 -0.332 1.436 c -0.144 0.575 -0.293 1.148 -0.442 1.721 c -0.429 1.646 -0.863 3.29 -1.3 4.933 a 2795.63 2795.63 0 0 1 -2.498 9.339 c -0.446 1.652 -0.888 3.307 -1.347 4.957 c -0.061 0.21 -0.123 0.42 -0.182 0.631 a 30.173 30.173 0 0 0 -0.851 4.232 c -0.127 1.04 -0.193 2.096 -0.107 3.142 c 0.026 0.317 0.068 0.634 0.13 0.947 c 0.03 0.152 0.068 0.301 0.104 0.45 a 21.617 21.617 0 0 1 0.222 1.018 c 0.152 0.81 0.264 1.635 0.253 2.461 a 5.39 5.39 0 0 1 -0.062 0.783 c -0.013 0.086 -0.03 0.173 -0.051 0.258 c -0.011 0.046 -0.021 0.092 -0.04 0.135 c -0.03 0.07 -0.068 0.134 -0.102 0.201 a 2.94 2.94 0 0 0 -0.084 0.192 a 7.209 7.209 0 0 0 -0.243 0.79 l -0.031 0.121 c 0.191 0.051 0.38 0.104 0.57 0.157 a 3.196 3.196 0 0 1 1.346 0.812 c 0.143 0.144 0.271 0.3 0.386 0.467 c 0.586 0.846 0.716 1.923 0.622 2.925 a 8.08 8.08 0 0 1 -0.126 0.849 l -0.044 0.201 c -0.016 0.07 -0.03 0.137 -0.059 0.203 c -0.113 0.26 -0.263 0.501 -0.432 0.727 a 3.762 3.762 0 0 1 -2.596 1.472 a 1.043 1.043 0 0 1 -0.209 0.011 c -0.163 -0.023 -0.325 -0.052 -0.488 -0.081 c -0.071 0.855 -0.134 1.713 -0.193 2.569 l -0.03 0.446 l -0.008 0.063 c -0.014 0.076 -0.03 0.15 -0.047 0.225 a 3.259 3.259 0 0 1 -0.279 0.713 a 3.192 3.192 0 0 1 -0.241 0.379 c -0.553 0.747 -1.396 1.221 -2.261 1.515 a 8.674 8.674 0 0 1 -1.037 0.273 a 10.364 10.364 0 0 1 -1.883 0.192 a 12.529 12.529 0 0 1 -3.078 -0.329 a 3.53 3.53 0 0 1 -0.352 -0.099 a 2.342 2.342 0 0 1 -1.016 -0.733 c -0.298 -0.364 -0.503 -0.797 -0.654 -1.24 c -0.231 -0.679 -0.344 -1.396 -0.408 -2.108 a 20.496 20.496 0 0 1 -0.057 -2.466 c 0.031 -1.067 0.121 -2.132 0.236 -3.194 c 0.064 -0.587 0.14 -1.172 0.202 -1.76 a 2.69 2.69 0 0 0 0.017 -0.219 c -0.002 -0.138 -0.026 -0.274 -0.048 -0.41 c -0.047 -0.259 -0.098 -0.516 -0.144 -0.775 a 8.713 8.713 0 0 1 -0.127 -1.194 a 6.15 6.15 0 0 1 0.532 -2.717 c 0.086 -0.193 0.187 -0.378 0.274 -0.569 c 0.041 -0.096 0.08 -0.191 0.116 -0.289 c 0.174 -0.474 0.294 -0.968 0.387 -1.464 c 0.089 -0.476 0.154 -0.956 0.204 -1.437 c 0.066 -0.628 0.105 -1.259 0.127 -1.892 c 0.03 -0.787 0.031 -1.575 0.007 -2.362 c -0.243 -6.029 -0.885 -12.034 -1.327 -18.051 a 188.909 188.909 0 0 1 -0.255 -4.188 c -0.242 -4.974 -0.268 -9.964 0.04 -14.936 c 0.148 -2.378 0.374 -4.752 0.702 -7.112 c 0.321 -2.308 0.74 -4.605 1.298 -6.868 a 49.913 49.913 0 0 1 1.091 -3.794 c 0.137 -0.412 0.28 -0.822 0.429 -1.23 c 0.136 -0.376 0.278 -0.752 0.412 -1.129 c 0.035 -0.104 0.069 -0.206 0.101 -0.311 c 0.262 -0.862 0.443 -1.748 0.597 -2.636 c 0.171 -0.989 0.306 -1.985 0.42 -2.983 a 87.62 87.62 0 0 0 0.279 -2.843 c 0.028 -0.355 0.054 -0.709 0.08 -1.063 c 0.017 -0.247 0.034 -0.494 0.04 -0.742 c 0.015 -0.646 0.001 -1.292 -0.016 -1.937 c -0.025 -0.964 -0.064 -1.927 -0.108 -2.889 a 433.545 433.545 0 0 0 -0.391 -7.121 a 866.807 866.807 0 0 0 -0.815 -11.728 a 690.223 690.223 0 0 0 -1.014 -12.097 a 313.397 313.397 0 0 0 -0.369 -3.728 c -0.094 -0.885 -0.193 -1.77 -0.284 -2.654 c -0.05 -0.511 -0.099 -1.021 -0.146 -1.531 c -0.355 -3.981 -0.576 -7.972 -0.605 -11.968 c -0.011 -1.453 0.004 -2.906 0.054 -4.358 c 0.038 -1.085 0.093 -2.169 0.19 -3.251 c 0.048 -0.551 0.115 -1.099 0.181 -1.647 l 0.491 -3.968 c 0.418 -3.432 0.828 -6.867 1.138 -10.312 c 0.074 -0.81 0.14 -1.623 0.198 -2.436 c 0.036 -0.513 0.062 -1.028 0.099 -1.541 c 0.011 -0.143 0.024 -0.285 0.036 -0.427 c 0.036 -0.389 0.078 -0.777 0.128 -1.165 c 0.189 -1.442 0.47 -2.871 0.812 -4.284 c 0.354 -1.463 0.774 -2.91 1.253 -4.337 a 48.622 48.622 0 0 1 1.429 -3.762 a 32.269 32.269 0 0 1 1.934 -3.843 a 16.717 16.717 0 0 0 0.984 -1.902 a 16.68 16.68 0 0 0 1.115 -3.703 c 0.086 -0.484 0.153 -0.973 0.191 -1.463 c 0.028 -0.345 0.048 -0.692 0.039 -1.038 c 0.002 -0.087 0.004 -0.086 0.01 -0.172 c 0.009 -0.125 0.014 -0.25 0.02 -0.374 c 0.038 -1.083 -0.025 -2.167 -0.127 -3.244 a 57.293 57.293 0 0 0 -0.507 -3.801 c -0.448 -2.745 -1.028 -5.468 -1.654 -8.178 c -0.164 -0.708 -0.331 -1.417 -0.501 -2.125 c -0.131 -0.55 -0.268 -1.1 -0.393 -1.653 c -0.03 -0.139 -0.057 -0.278 -0.082 -0.418 a 47.273 47.273 0 0 1 -0.311 -2.082 c -0.099 -0.747 -0.191 -1.495 -0.28 -2.244 c -0.116 -0.985 -0.228 -1.97 -0.336 -2.957 c -0.257 0.619 -0.515 1.236 -0.773 1.854 a 664.42 664.42 0 0 1 -3.305 7.78 a 253.336 253.336 0 0 1 -1.471 3.333 a 67.673 67.673 0 0 1 -0.946 2.024 c -0.185 0.377 -0.384 0.745 -0.577 1.117 c -0.095 0.19 -0.187 0.38 -0.278 0.57 c -0.83 1.771 -1.478 3.623 -2.025 5.498 l -0.059 0.206 l -0.034 0.126 c -0.015 0.199 -0.015 0.199 -0.032 0.397 a 19.28 19.28 0 0 1 -0.38 2.365 c -0.313 1.378 -0.776 2.718 -1.33 4.017 a 39.83 39.83 0 0 1 -1.078 2.292 c -0.375 0.741 -0.765 1.475 -1.145 2.213 l -0.36 0.722 a 860.791 860.791 0 0 0 -3.107 6.412 a 2832.19 2832.19 0 0 0 -6.93 14.514 c -0.786 1.661 -1.572 3.32 -2.336 4.99 c -0.082 0.183 -0.164 0.366 -0.242 0.551 a 5.587 5.587 0 0 0 -0.288 1.065 c -0.058 0.321 -0.099 0.645 -0.13 0.97 a 23.52 23.52 0 0 0 -0.069 3.096 l 0.004 0.083 c 0.032 0.09 0.061 0.18 0.09 0.269 c 0.037 0.117 0.07 0.234 0.103 0.352 c 0.396 1.528 0.395 3.136 0.204 4.696 c -0.253 2.07 -0.804 4.093 -1.51 6.052 l -0.065 0.175 l -0.089 0.241 c 0.025 0.797 0.057 1.596 0.086 2.394 c 0.056 1.499 0.129 2.996 0.165 4.496 c 0.008 0.518 -0.008 1.042 -0.114 1.551 c -0.065 0.314 -0.165 0.628 -0.343 0.898 a 1.23 1.23 0 0 1 -0.581 0.49 a 0.916 0.916 0 0 1 -0.498 0.05 a 1.168 1.168 0 0 1 -0.802 -0.481 a 2.373 2.373 0 0 1 -0.359 -0.744 a 6.84 6.84 0 0 1 -0.234 -1.203 c -0.024 -0.213 -0.041 -0.426 -0.06 -0.64 c -0.02 -0.233 -0.043 -0.464 -0.066 -0.696 a 88.24 88.24 0 0 0 -0.485 -3.8 c -0.038 0.341 -0.081 0.681 -0.122 1.022 a 302.81 302.81 0 0 1 -0.601 4.437 c -0.032 0.222 -0.066 0.444 -0.102 0.665 a 16.87 16.87 0 0 1 -0.275 1.334 a 7.63 7.63 0 0 1 -0.269 0.863 c -0.149 0.38 -0.344 0.768 -0.66 1.036 a 1.358 1.358 0 0 1 -0.816 0.324 a 1.577 1.577 0 0 1 -0.266 0.007 a 1.07 1.07 0 0 1 -0.407 -0.116 a 1.337 1.337 0 0 1 -0.584 -0.638 a 2.05 2.05 0 0 1 -0.16 -1.102 c 0.009 -0.082 0.024 -0.161 0.041 -0.24 c 0.014 -0.063 0.031 -0.125 0.043 -0.187 c 0.009 -0.044 0.016 -0.088 0.022 -0.132 c 0.058 -0.462 0.078 -0.927 0.099 -1.391 c 0.029 -0.735 0.055 -1.47 0.086 -2.204 c 0.025 -0.545 0.054 -1.09 0.099 -1.634 c 0.03 -0.357 0.07 -0.713 0.104 -1.069 l 0.029 -0.398 l 0.007 -0.128 l -0.047 0.176 a 80.302 80.302 0 0 0 -0.836 3.469 c -0.083 0.38 -0.159 0.763 -0.238 1.144 l -0.058 0.244 a 5.235 5.235 0 0 1 -0.433 1.12 c -0.34 0.625 -0.85 1.166 -1.5 1.467 a 2.728 2.728 0 0 1 -0.353 0.134 a 1.446 1.446 0 0 1 -0.245 0.054 c -0.146 0.016 -0.298 0 -0.438 -0.048 a 0.886 0.886 0 0 1 -0.359 -0.227 a 1.043 1.043 0 0 1 -0.177 -0.249 c -0.138 -0.268 -0.171 -0.578 -0.173 -0.876 c 0 -0.243 0.024 -0.486 0.056 -0.727 c 0.04 -0.298 0.094 -0.593 0.154 -0.888 c 0.056 -0.272 0.115 -0.542 0.169 -0.814 c 0.016 -0.091 0.033 -0.181 0.046 -0.273 c 0.013 -0.112 0.022 -0.224 0.034 -0.336 c 0.014 -0.118 0.03 -0.236 0.045 -0.353 c 0.085 -0.606 0.18 -1.21 0.287 -1.81 c 0.075 -0.424 0.153 -0.847 0.25 -1.266 l 0.034 -0.143 l -0.119 0.38 c -0.154 0.466 -0.318 0.929 -0.535 1.37 a 4.008 4.008 0 0 1 -0.651 0.976 a 3.49 3.49 0 0 1 -0.295 0.275 a 2.44 2.44 0 0 1 -0.619 0.395 a 1.012 1.012 0 0 1 -0.379 0.079 a 0.784 0.784 0 0 1 -0.623 -0.297 a 1.042 1.042 0 0 1 -0.194 -0.433 c -0.016 -0.073 -0.02 -0.146 -0.029 -0.22 l 0.001 0.025 a 2.8 2.8 0 0 1 -0.026 -0.177 a 6.417 6.417 0 0 1 0.025 -1.336 c 0.063 -0.605 0.168 -1.206 0.286 -1.802 c 0.257 -1.294 0.586 -2.573 0.942 -3.842 c 0.11 -0.395 0.225 -0.79 0.344 -1.183 l 0.098 -0.316 c 0.032 -0.103 0.067 -0.203 0.094 -0.307 c 0.025 -0.101 0.047 -0.204 0.069 -0.306 c 0.141 -0.722 0.255 -1.45 0.366 -2.176 l 0.086 -0.571 c -0.153 0.172 -0.31 0.338 -0.474 0.498 c -0.31 0.301 -0.642 0.581 -1.006 0.813 c -0.551 0.351 -1.195 0.596 -1.858 0.533 a 2.174 2.174 0 0 1 -0.673 -0.175 c -0.068 -0.029 -0.14 -0.059 -0.201 -0.103 a 0.971 0.971 0 0 1 -0.381 -0.722 c -0.02 -0.282 0.058 -0.563 0.172 -0.817 c 0.196 -0.433 0.494 -0.816 0.806 -1.17 a 37.582 37.582 0 0 0 1.15 -1.931 c 0.08 -0.146 0.158 -0.294 0.233 -0.442 c 0.043 -0.084 0.083 -0.17 0.127 -0.253 l 0.044 -0.072 c 0.102 -0.145 0.226 -0.272 0.353 -0.394 c 0.126 -0.121 0.256 -0.237 0.388 -0.351 c 0.373 -0.325 0.76 -0.636 1.149 -0.942 c 0.794 -0.626 1.603 -1.235 2.414 -1.838 c 0.359 -0.268 0.721 -0.534 1.082 -0.8 c 0.121 -0.09 0.246 -0.18 0.365 -0.274 a 1.855 1.855 0 0 0 0.312 -0.319 c 0.023 -0.031 0.053 -0.064 0.068 -0.099 c 0.011 -0.024 0.014 -0.051 0.021 -0.075 c 0.009 -0.033 0.022 -0.081 0.029 -0.115 c 0.035 -0.146 0.066 -0.292 0.105 -0.437 c 0.023 -0.085 0.048 -0.169 0.073 -0.253 c 0.186 -0.578 0.419 -1.14 0.655 -1.699 c 0.333 -0.788 0.686 -1.568 1.031 -2.35 c 0.085 -0.198 0.085 -0.198 0.167 -0.395 c 0.679 -1.677 1.199 -3.414 1.658 -5.162 a 78.94 78.94 0 0 0 1.188 -5.259 c 0.034 -0.18 0.063 -0.359 0.094 -0.539 c 0.072 -0.418 0.142 -0.837 0.215 -1.256 c 0.166 -0.966 0.334 -1.931 0.501 -2.897 c 0.366 -2.095 0.733 -4.19 1.118 -6.282 c 0.116 -0.632 0.234 -1.264 0.356 -1.896 a 43.313 43.313 0 0 1 0.702 -3.108 a 55.59 55.59 0 0 1 1.912 -5.851 a 53.376 53.376 0 0 1 3.406 -7.19 a 48.54 48.54 0 0 1 1.227 -2.028 c 0.253 -0.392 0.515 -0.78 0.775 -1.168 l 0.215 -0.334 c 0.664 -1.076 1.225 -2.209 1.728 -3.37 a 47.32 47.32 0 0 0 1.181 -3.037 a 72.46 72.46 0 0 0 1.269 -3.998 c 0.447 -1.555 0.853 -3.122 1.227 -4.695 a 128.842 128.842 0 0 0 1.531 -7.36 l 0.125 -0.722 c 0.023 -0.134 0.047 -0.267 0.066 -0.401 c 0.002 -0.013 0.001 -0.027 0.002 -0.04 l 0.01 -0.202 c 0.019 -0.35 0.022 -0.386 0.046 -0.77 c 0.026 -0.405 0.056 -0.809 0.086 -1.215 c 0.218 -2.748 0.525 -5.488 0.93 -8.214 c 0.097 -0.652 0.199 -1.302 0.309 -1.952 c 0.085 -0.509 0.169 -1.018 0.289 -1.52 c 0.167 -0.701 0.389 -1.389 0.665 -2.056 c 1.217 -2.949 3.463 -5.415 6.179 -7.058 a 14.08 14.08 0 0 1 1.987 -1.006 a 8.982 8.982 0 0 1 1.863 -0.552 c 0.529 -0.081 1.059 -0.151 1.589 -0.231 a 24.981 24.981 0 0 0 1.651 -0.309 a 24.058 24.058 0 0 0 2.157 -0.609 c 0.995 -0.33 1.973 -0.708 2.942 -1.109 a 79.048 79.048 0 0 0 2.179 -0.942 c 0.662 -0.296 1.325 -0.59 1.962 -0.938 c 1.722 -0.943 3.303 -2.248 4.266 -3.986 a 7.54 7.54 0 0 0 0.386 -0.806 c 0.192 -0.468 0.335 -0.957 0.418 -1.455 l 0.019 -0.12 a 0.927 0.927 0 0 1 -0.335 0.054 a 0.603 0.603 0 0 1 -0.584 -0.555 l -0.002 -0.029 a 1.65 1.65 0 0 1 -0.137 0.248 a 1.189 1.189 0 0 1 -0.275 0.291 a 0.867 0.867 0 0 1 -0.449 0.159 a 0.822 0.822 0 0 1 -0.157 -0.006 c -0.345 -0.047 -0.623 -0.293 -0.834 -0.554 a 4.243 4.243 0 0 1 -0.405 -0.621 a 8.046 8.046 0 0 1 -0.491 -1.101 Z m 21.002 -0.24 a 7.758 7.758 0 0 0 -0.718 -1.077 l -0.024 -0.028 a 24.995 24.995 0 0 1 -0.325 1.228 c -0.045 0.147 -0.09 0.294 -0.138 0.44 l -0.099 0.289 c -0.035 0.094 -0.069 0.188 -0.107 0.282 a 6.143 6.143 0 0 1 -0.192 0.442 a 0.504 0.504 0 0 1 -0.655 0.2 a 0.548 0.548 0 0 1 -0.187 -0.151 a 6.15 6.15 0 0 1 -0.951 -1.664 l -0.014 -0.042 c -0.229 0.42 -0.453 0.844 -0.65 1.279 c -0.066 0.146 -0.13 0.293 -0.185 0.443 c -0.041 0.11 -0.08 0.222 -0.1 0.337 c -0.006 0.033 -0.006 0.066 -0.009 0.099 l -0.007 0.043 c -0.02 0.08 -0.052 0.155 -0.085 0.23 c -0.044 0.096 -0.093 0.19 -0.161 0.27 a 0.596 0.596 0 0 1 -0.366 0.214 a 0.538 0.538 0 0 1 -0.488 -0.173 a 0.698 0.698 0 0 1 -0.083 -0.111 a 1.07 1.07 0 0 1 -0.116 -0.331 c -0.03 -0.135 -0.046 -0.273 -0.063 -0.411 c -0.04 -0.353 -0.073 -0.706 -0.114 -1.057 c -0.064 -0.528 -0.135 -1.067 -0.327 -1.567 l -0.017 -0.042 l -3.393 2.993 l -0.041 0.033 a 0.583 0.583 0 0 1 -0.189 0.083 a 0.511 0.511 0 0 1 -0.607 -0.427 c -0.013 -0.157 -0.014 -0.319 -0.02 -0.476 l -0.019 -0.422 l -0.002 -0.034 a 16.08 16.08 0 0 1 -0.339 0.351 c -0.419 0.417 -0.852 0.819 -1.295 1.211 l -0.099 0.086 a 0.534 0.534 0 0 1 -0.232 0.115 a 0.512 0.512 0 0 1 -0.58 -0.335 a 0.537 0.537 0 0 1 -0.018 -0.258 c 0.021 -0.085 0.048 -0.167 0.071 -0.251 a 7.79 7.79 0 0 0 0.065 -0.243 c 0.146 -0.57 0.277 -1.143 0.401 -1.719 a 40.812 40.812 0 0 0 -1.951 2.59 c -0.016 0.024 -0.025 0.067 -0.034 0.089 l -0.027 0.067 c -0.028 0.057 -0.036 0.077 -0.068 0.133 c -0.096 0.165 -0.252 0.335 -0.449 0.373 a 0.517 0.517 0 0 1 -0.616 -0.424 a 0.628 0.628 0 0 1 0.081 -0.377 c 0.056 -0.099 0.118 -0.194 0.181 -0.289 c 0.035 -0.139 0.055 -0.282 0.073 -0.424 c 0.01 -0.092 0.019 -0.183 0.026 -0.276 c -0.21 0.084 -0.412 0.183 -0.613 0.289 c -0.133 0.069 -0.263 0.141 -0.394 0.214 a 6.744 6.744 0 0 1 -0.155 1.193 c -0.029 0.135 -0.063 0.27 -0.099 0.404 a 9.585 9.585 0 0 1 -0.188 0.589 c -0.598 1.65 -1.714 3.062 -3.062 4.166 c -0.944 0.772 -1.997 1.394 -3.095 1.918 c -0.366 0.17 -0.734 0.335 -1.103 0.502 a 71.736 71.736 0 0 1 -3.613 1.513 a 30.538 30.538 0 0 1 -3.267 1.067 c -0.76 0.196 -1.531 0.345 -2.308 0.465 c -0.335 0.052 -0.67 0.099 -1.007 0.147 c -0.211 0.03 -0.425 0.058 -0.637 0.094 a 7.64 7.64 0 0 0 -0.328 0.068 a 9.828 9.828 0 0 0 -1.783 0.642 a 14.07 14.07 0 0 0 -1.995 1.142 c -2.142 1.462 -3.92 3.482 -4.97 5.865 a 12.859 12.859 0 0 0 -0.895 2.969 c -0.075 0.438 -0.149 0.876 -0.22 1.314 a 119.005 119.005 0 0 0 -1.146 9.763 a 65.957 65.957 0 0 0 -0.117 1.885 l -0.006 0.059 c -0.297 1.82 -0.65 3.632 -1.033 5.436 a 120.02 120.02 0 0 1 -1.591 6.614 c -0.558 2.045 -1.178 4.077 -1.911 6.067 c -0.567 1.543 -1.199 3.068 -1.968 4.523 c -0.241 0.458 -0.497 0.908 -0.771 1.347 c -0.251 0.4 -0.523 0.788 -0.782 1.184 c -0.143 0.218 -0.284 0.438 -0.423 0.658 a 51.486 51.486 0 0 0 -4.332 8.706 a 54.012 54.012 0 0 0 -1.931 5.953 a 39.3 39.3 0 0 0 -0.387 1.62 c -0.151 0.698 -0.282 1.399 -0.414 2.1 a 350.34 350.34 0 0 0 -0.485 2.646 c -0.554 3.079 -1.087 6.162 -1.613 9.245 a 79.184 79.184 0 0 1 -1.472 6.345 c -0.451 1.621 -0.962 3.228 -1.624 4.774 c -0.23 0.52 -0.463 1.038 -0.691 1.557 c -0.2 0.464 -0.401 0.928 -0.589 1.396 c -0.122 0.3 -0.24 0.602 -0.342 0.91 a 6.066 6.066 0 0 0 -0.104 0.356 c -0.04 0.163 -0.075 0.328 -0.117 0.492 l -0.022 0.076 c -0.025 0.089 -0.025 0.089 -0.061 0.175 c -0.013 0.029 -0.03 0.054 -0.046 0.081 a 2.9 2.9 0 0 1 -0.616 0.69 c -0.13 0.103 -0.266 0.2 -0.4 0.299 a 281.317 281.317 0 0 0 -1.533 1.137 a 99.324 99.324 0 0 0 -2.164 1.663 a 26.58 26.58 0 0 0 -0.885 0.731 a 8.648 8.648 0 0 0 -0.349 0.316 a 2.015 2.015 0 0 0 -0.214 0.229 c -0.023 0.031 -0.034 0.069 -0.052 0.103 c -0.057 0.118 -0.118 0.233 -0.179 0.349 c -0.083 0.157 -0.169 0.313 -0.255 0.47 c -0.33 0.582 -0.676 1.155 -1.034 1.721 l -0.044 0.069 l -0.046 0.062 a 8.038 8.038 0 0 0 -0.225 0.264 a 3.602 3.602 0 0 0 -0.406 0.606 a 0.935 0.935 0 0 0 -0.122 0.37 v 0.009 c 0.063 0.027 0.129 0.047 0.194 0.062 c 0.498 0.111 1.001 -0.117 1.408 -0.383 a 5.285 5.285 0 0 0 0.801 -0.658 a 10.232 10.232 0 0 0 0.914 -1.042 c 0.198 -0.257 0.384 -0.522 0.559 -0.795 l 0.004 -0.007 l 0.065 -0.472 l 0.01 -0.054 a 0.632 0.632 0 0 1 0.065 -0.151 a 0.524 0.524 0 0 1 0.252 -0.203 c 0.047 -0.016 0.059 -0.017 0.107 -0.026 c 0.054 -0.004 0.054 -0.004 0.109 -0.002 a 0.514 0.514 0 0 1 0.457 0.409 c 0.01 0.056 0.008 0.109 0.004 0.165 l -0.078 0.562 a 38.379 38.379 0 0 1 -0.714 4.624 c -0.045 0.232 -0.089 0.464 -0.159 0.688 c -0.076 0.232 -0.146 0.464 -0.216 0.696 a 65.813 65.813 0 0 0 -0.781 2.855 a 39.896 39.896 0 0 0 -0.488 2.214 a 16.78 16.78 0 0 0 -0.221 1.514 a 6.786 6.786 0 0 0 -0.031 0.604 c 0 0.16 0.007 0.319 0.033 0.477 l 0.002 0.008 c 0.145 -0.099 0.282 -0.209 0.402 -0.337 c 0.175 -0.188 0.313 -0.405 0.432 -0.632 a 7.15 7.15 0 0 0 0.309 -0.7 c 0.259 -0.682 0.444 -1.387 0.65 -2.087 c 0.062 -0.204 0.062 -0.203 0.126 -0.406 c 0.187 -0.568 0.389 -1.134 0.659 -1.669 c 0.082 -0.164 0.171 -0.325 0.272 -0.477 c 0.049 -0.073 0.099 -0.149 0.16 -0.214 l 0.034 -0.378 l 0.007 -0.047 a 0.51 0.51 0 0 1 0.469 -0.414 c 0.048 -0.001 0.048 -0.001 0.096 0.003 a 0.512 0.512 0 0 1 0.439 0.499 c -0.005 0.098 -0.007 0.098 -0.016 0.207 c -0.021 0.237 -0.043 0.475 -0.066 0.712 a 77.667 77.667 0 0 1 -0.209 1.986 c -0.055 0.454 -0.11 0.912 -0.208 1.359 c -0.029 0.137 -0.076 0.27 -0.111 0.405 c -0.035 0.14 -0.066 0.28 -0.096 0.421 a 36.678 36.678 0 0 0 -0.296 1.609 c -0.076 0.459 -0.146 0.917 -0.204 1.378 c -0.019 0.151 -0.031 0.303 -0.048 0.455 l -0.035 0.215 c -0.068 0.365 -0.15 0.726 -0.222 1.09 l -0.056 0.302 a 6.443 6.443 0 0 0 -0.101 0.843 a 1.49 1.49 0 0 0 0.041 0.489 l 0.005 0.014 c 0.183 -0.046 0.358 -0.134 0.514 -0.238 c 0.396 -0.266 0.686 -0.664 0.883 -1.094 c 0.059 -0.132 0.111 -0.267 0.157 -0.404 c 0.051 -0.159 0.093 -0.32 0.13 -0.483 c 0.06 -0.29 0.119 -0.581 0.18 -0.871 a 75.395 75.395 0 0 1 1.127 -4.6 c 0.127 -0.452 0.259 -0.901 0.41 -1.345 a 9.31 9.31 0 0 1 0.18 -0.482 c 0.046 -0.107 0.095 -0.216 0.156 -0.315 l -0.009 -0.092 l -0.009 -0.088 l 0.002 -0.133 c 0.033 -0.111 0.031 -0.147 0.105 -0.24 a 0.51 0.51 0 0 1 0.867 0.132 c 0.041 0.103 0.044 0.227 0.054 0.338 a 21.076 21.076 0 0 1 0.001 3.949 l -0.065 0.635 a 46.605 46.605 0 0 0 -0.105 1.582 c -0.044 0.939 -0.069 1.879 -0.114 2.818 c -0.021 0.367 -0.041 0.734 -0.09 1.099 c -0.013 0.099 -0.03 0.198 -0.052 0.296 c -0.015 0.064 -0.033 0.127 -0.044 0.191 a 2.012 2.012 0 0 0 -0.014 0.131 c -0.005 0.158 0.008 0.317 0.072 0.463 a 0.393 0.393 0 0 0 0.123 0.171 a 0.074 0.074 0 0 0 0.039 0.016 c 0.032 0 0.065 -0.003 0.097 -0.006 a 0.548 0.548 0 0 0 0.156 -0.032 a 0.402 0.402 0 0 0 0.153 -0.118 c 0.077 -0.087 0.136 -0.188 0.187 -0.292 c 0.119 -0.234 0.204 -0.486 0.277 -0.736 a 10.723 10.723 0 0 0 0.208 -0.853 a 19.533 19.533 0 0 0 0.225 -1.325 c 0.097 -0.675 0.191 -1.35 0.284 -2.025 c 0.132 -0.97 0.262 -1.939 0.378 -2.911 c 0.052 -0.426 0.1 -0.853 0.141 -1.281 c 0.025 -0.268 0.051 -0.538 0.051 -0.807 v -0.032 c -0.015 -0.035 -0.021 -0.071 -0.029 -0.108 a 0.565 0.565 0 0 1 0.112 -0.449 c 0.025 -0.035 0.057 -0.062 0.088 -0.089 c 0.133 -0.119 0.331 -0.154 0.502 -0.14 c 0.399 0.03 0.795 0.292 0.904 0.69 c 0.036 0.126 0.06 0.257 0.084 0.386 c 0.028 0.146 0.053 0.292 0.077 0.438 a 87.004 87.004 0 0 1 0.6 4.462 c 0.034 0.318 0.066 0.639 0.094 0.958 c 0.015 0.174 0.028 0.347 0.047 0.52 c 0.016 0.144 0.034 0.287 0.055 0.429 c 0.051 0.32 0.112 0.65 0.251 0.945 a 0.86 0.86 0 0 0 0.106 0.18 c 0.017 0.021 0.037 0.046 0.062 0.059 a 0.207 0.207 0 0 0 0.075 0.019 a 0.284 0.284 0 0 0 0.053 -0.051 c 0.064 -0.083 0.107 -0.179 0.142 -0.276 c 0.043 -0.12 0.073 -0.244 0.096 -0.368 c 0.086 -0.452 0.092 -0.917 0.08 -1.376 c -0.075 -2.215 -0.166 -4.43 -0.245 -6.646 c -0.005 -0.174 -0.012 -0.174 0.005 -0.345 c 0.003 -0.028 0.016 -0.056 0.024 -0.082 c 0.084 -0.233 0.171 -0.464 0.255 -0.696 a 29.91 29.91 0 0 0 1.083 -3.803 c 0.173 -0.833 0.303 -1.675 0.37 -2.523 c 0.093 -1.202 0.066 -2.439 -0.247 -3.61 a 7.675 7.675 0 0 0 -0.192 -0.609 l -0.021 -0.072 l -0.009 -0.074 a 26.133 26.133 0 0 1 0.034 -3.05 c 0.048 -0.658 0.129 -1.322 0.29 -1.963 a 5.59 5.59 0 0 1 0.404 -1.112 c 0.095 -0.214 0.193 -0.427 0.29 -0.64 c 0.296 -0.643 0.597 -1.286 0.898 -1.927 c 0.9 -1.919 1.809 -3.834 2.719 -5.748 c 1.809 -3.804 3.626 -7.603 5.451 -11.398 c 0.609 -1.264 1.218 -2.528 1.829 -3.79 c 0.494 -1.018 0.986 -2.038 1.491 -3.052 c 0.374 -0.747 0.769 -1.483 1.151 -2.227 l 0.303 -0.598 c 0.26 -0.528 0.514 -1.057 0.751 -1.595 c 0.382 -0.865 0.724 -1.746 1.006 -2.647 c 0.28 -0.894 0.5 -1.806 0.645 -2.732 c 0.075 -0.483 0.127 -0.969 0.162 -1.457 l 0.016 -0.096 c 0.218 -0.807 0.47 -1.606 0.74 -2.397 a 35.992 35.992 0 0 1 1.312 -3.347 c 0.139 -0.303 0.283 -0.603 0.433 -0.899 c 0.127 -0.248 0.26 -0.491 0.388 -0.739 c 0.095 -0.19 0.189 -0.38 0.282 -0.571 a 112.27 112.27 0 0 0 1.39 -3.036 a 346.151 346.151 0 0 0 1.539 -3.535 a 819.696 819.696 0 0 0 3.82 -9.07 l 0.254 -0.616 c 0.022 -0.037 0.04 -0.079 0.066 -0.115 l 0.014 -0.017 a 1409.91 1409.91 0 0 1 -1.806 -18.482 l 0.021 -0.197 l 0.094 -0.175 l 0.154 -0.125 l 0.189 -0.055 l 0.197 0.02 l 0.173 0.094 l 0.124 0.154 l 0.056 0.19 c 0.122 1.318 0.244 2.636 0.368 3.953 c 0.477 5.042 0.963 10.083 1.502 15.119 c 0.191 1.782 0.388 3.565 0.606 5.343 c 0.083 0.675 0.169 1.35 0.264 2.022 c 0.079 0.559 0.159 1.12 0.276 1.673 c 0.125 0.546 0.26 1.091 0.39 1.635 c 0.124 0.518 0.246 1.036 0.368 1.554 c 0.763 3.278 1.477 6.573 1.971 9.903 c 0.177 1.199 0.327 2.403 0.415 3.611 c 0.074 1.018 0.108 2.043 0.033 3.061 c 0.003 0.095 0.002 0.19 0.001 0.284 a 15.96 15.96 0 0 1 -0.337 2.865 a 17.603 17.603 0 0 1 -1.182 3.659 c -0.2 0.447 -0.421 0.885 -0.66 1.313 c -0.171 0.307 -0.356 0.606 -0.533 0.909 c -0.118 0.209 -0.118 0.208 -0.235 0.419 a 36.79 36.79 0 0 0 -1.849 3.99 a 51.634 51.634 0 0 0 -2.252 7.154 a 40.045 40.045 0 0 0 -0.679 3.584 a 30.847 30.847 0 0 0 -0.188 1.687 c -0.022 0.272 -0.036 0.544 -0.052 0.816 c -0.018 0.286 -0.037 0.572 -0.057 0.857 c -0.028 0.401 -0.06 0.802 -0.091 1.203 c -0.291 3.474 -0.685 6.94 -1.104 10.402 c -0.237 1.96 -0.486 3.919 -0.723 5.88 c -0.027 0.234 -0.052 0.467 -0.074 0.703 a 63.117 63.117 0 0 0 -0.222 3.985 a 107.46 107.46 0 0 0 -0.032 4.094 c 0.036 3.51 0.215 7.019 0.511 10.516 c 0.085 1.011 0.18 2.02 0.285 3.029 c 0.094 0.905 0.196 1.809 0.29 2.714 c 0.063 0.614 0.125 1.23 0.185 1.846 c 0.378 3.938 0.711 7.881 1.017 11.825 c 0.308 3.954 0.592 7.91 0.846 11.867 c 0.184 2.871 0.356 5.743 0.486 8.619 c 0.044 0.969 0.083 1.937 0.108 2.907 c 0.02 0.775 0.04 1.552 0.004 2.326 c -0.024 0.388 -0.054 0.777 -0.083 1.166 c -0.141 1.773 -0.317 3.546 -0.583 5.305 a 36.417 36.417 0 0 1 -0.387 2.176 a 16.202 16.202 0 0 1 -0.508 1.902 c -0.16 0.454 -0.331 0.903 -0.493 1.356 c -0.3 0.843 -0.579 1.692 -0.831 2.551 a 57.982 57.982 0 0 0 -1.426 6.173 a 82.584 82.584 0 0 0 -0.916 6.99 a 111.223 111.223 0 0 0 -0.408 7.678 c -0.062 3.123 -0.01 6.247 0.131 9.366 c 0.063 1.376 0.144 2.75 0.237 4.124 c 0.44 6.21 0.912 12.418 1.368 18.627 c 0.023 0.55 0.026 1.101 0.019 1.652 c -0.01 0.715 -0.038 1.429 -0.093 2.142 a 21.504 21.504 0 0 1 -0.218 1.861 a 11.254 11.254 0 0 1 -0.465 1.891 a 5.677 5.677 0 0 1 -0.197 0.486 c -0.063 0.135 -0.132 0.267 -0.196 0.401 c -0.047 0.102 -0.047 0.101 -0.09 0.203 a 4.994 4.994 0 0 0 -0.389 1.588 a 6.47 6.47 0 0 0 0.077 1.497 c 0.05 0.307 0.111 0.61 0.166 0.916 c 0.032 0.193 0.064 0.389 0.063 0.587 c -0.001 0.175 -0.026 0.35 -0.044 0.524 l -0.139 1.188 c -0.069 0.614 -0.133 1.23 -0.181 1.848 a 32.008 32.008 0 0 0 -0.092 1.639 a 23.68 23.68 0 0 0 -0.007 1.192 a 13.6 13.6 0 0 0 0.153 1.902 c 0.073 0.463 0.177 0.925 0.354 1.359 c 0.166 0.409 0.414 0.834 0.817 1.044 c 0.08 0.041 0.165 0.072 0.251 0.095 c 0.145 0.037 0.144 0.037 0.29 0.07 c 0.512 0.111 1.029 0.191 1.552 0.233 c 0.427 0.033 0.857 0.044 1.285 0.031 c 0.315 -0.01 0.63 -0.035 0.943 -0.073 c 0.251 -0.033 0.502 -0.073 0.749 -0.127 a 6.35 6.35 0 0 0 0.891 -0.255 a 5.12 5.12 0 0 0 0.31 -0.123 c 0.645 -0.283 1.268 -0.723 1.565 -1.383 a 2.26 2.26 0 0 0 0.143 -0.447 l 0.005 -0.028 c 0.026 -0.422 0.055 -0.843 0.086 -1.265 a 122.892 122.892 0 0 1 0.482 -5.209 c 0.1 -0.867 0.213 -1.732 0.352 -2.594 c 0.107 -0.66 0.226 -1.319 0.39 -1.967 c 0.114 -0.447 0.244 -0.899 0.466 -1.304 c 0.015 -0.06 0.026 -0.12 0.037 -0.181 c 0.067 -0.459 0.057 -0.926 0.022 -1.388 a 14.57 14.57 0 0 0 -0.289 -1.903 c -0.07 -0.327 -0.155 -0.651 -0.227 -0.977 a 10.493 10.493 0 0 1 -0.064 -0.346 c -0.193 -1.188 -0.166 -2.403 -0.049 -3.597 c 0.134 -1.374 0.39 -2.735 0.718 -4.075 c 0.084 -0.342 0.173 -0.682 0.268 -1.021 c 0.067 -0.235 0.136 -0.469 0.202 -0.704 c 0.289 -1.05 0.573 -2.101 0.857 -3.151 c 0.98 -3.631 1.956 -7.264 2.921 -10.899 c 0.374 -1.408 0.745 -2.815 1.114 -4.224 c 0.275 -1.052 0.551 -2.104 0.808 -3.162 c 0.025 -0.105 0.049 -0.212 0.072 -0.318 c 0.165 -0.807 0.285 -1.624 0.396 -2.439 c 0.138 -1.002 0.257 -2.005 0.367 -3.01 c 0.235 -2.163 0.42 -4.331 0.561 -6.502 c 0.065 -0.996 0.111 -1.993 0.168 -2.989 c 0.019 -0.318 0.041 -0.635 0.063 -0.953 c 0.147 -1.925 0.354 -3.846 0.61 -5.76 c 0.218 -1.638 0.47 -3.271 0.764 -4.897 c 0.208 -1.147 0.434 -2.293 0.713 -3.425 c 0.097 -0.393 0.2 -0.783 0.319 -1.17 a 6.43 6.43 0 0 1 0.391 -1.024 c 0.123 -0.228 0.253 -0.453 0.377 -0.68 c 0.117 -0.219 0.232 -0.438 0.337 -0.662 c 0.137 -0.287 0.259 -0.581 0.368 -0.881 c 0.209 -0.571 0.37 -1.159 0.503 -1.753 c 0.142 -0.633 0.255 -1.273 0.35 -1.915 c 0.219 -1.482 0.348 -2.973 0.452 -4.467 c 0.112 -1.64 0.227 -3.281 0.345 -4.921 c 0.321 -4.433 0.659 -8.865 1.043 -13.291 c 0.163 -1.884 0.336 -3.769 0.526 -5.65 c 0.135 -1.333 0.279 -2.666 0.459 -3.993 c 0.116 -0.858 0.26 -1.712 0.412 -2.564 c 0.132 -0.732 0.266 -1.465 0.404 -2.196 c 0.386 -2.06 0.783 -4.119 1.17 -6.178 c 0.174 -0.934 0.346 -1.868 0.516 -2.802 c 0.239 -1.332 0.473 -2.663 0.687 -3.999 c 0.161 -1.012 0.313 -2.025 0.437 -3.043 a 24.72 24.72 0 0 0 0.183 -2.087 c -0.063 0.068 -0.128 0.135 -0.192 0.201 c -0.215 0.216 -0.44 0.42 -0.676 0.612 c -1.724 1.408 -3.907 2.134 -6.08 2.469 a 22.045 22.045 0 0 1 -2.685 0.238 a 25.814 25.814 0 0 1 -4.657 -0.296 l -0.046 -0.008 a 0.578 0.578 0 0 1 -0.217 -0.095 a 0.514 0.514 0 0 1 0.015 -0.821 a 0.507 0.507 0 0 1 0.299 -0.091 c 0.027 0 0.053 0.005 0.079 0.007 c 0.159 0.029 0.318 0.052 0.478 0.074 a 24.714 24.714 0 0 0 4.348 0.204 a 20.065 20.065 0 0 0 2.583 -0.272 c 0.295 -0.052 0.589 -0.111 0.881 -0.179 c 1.624 -0.381 3.22 -1.037 4.5 -2.131 a 7.559 7.559 0 0 0 1.225 -1.331 c 0.319 -0.444 0.588 -0.924 0.803 -1.427 c 0.367 -0.85 0.578 -1.754 0.687 -2.671 c 0.018 -0.286 0.033 -0.571 0.049 -0.857 c 0.151 -3.055 0.195 -6.115 0.101 -9.172 a 71.552 71.552 0 0 0 -0.22 -3.902 a 45.39 45.39 0 0 0 -0.459 -3.749 a 25.274 25.274 0 0 0 -0.47 -2.232 a 14.75 14.75 0 0 0 -0.581 -1.804 a 8.238 8.238 0 0 0 -0.514 -1.072 a 4.338 4.338 0 0 0 -0.798 -1.029 l -0.054 -0.059 a 0.594 0.594 0 0 1 -0.099 -0.215 a 0.513 0.513 0 0 1 0.25 -0.542 a 0.576 0.576 0 0 1 0.227 -0.064 l 0.079 0.003 c 0.069 0.014 0.089 0.013 0.152 0.044 a 0.695 0.695 0 0 1 0.188 0.139 a 4.903 4.903 0 0 1 0.548 0.625 c 0.306 0.415 0.554 0.869 0.767 1.338 c 0.287 0.629 0.51 1.285 0.698 1.949 c 0.126 0.438 0.234 0.882 0.331 1.327 c 0.206 0.937 0.362 1.885 0.487 2.837 a 35.7 35.7 0 0 1 0.186 -1.455 c 0.082 -0.554 0.177 -1.107 0.292 -1.655 c 0.077 -0.37 0.163 -0.738 0.26 -1.103 a 12.79 12.79 0 0 1 0.745 -2.129 c 0.308 -0.662 0.696 -1.288 1.222 -1.797 l 0.056 -0.051 c 0.021 -0.017 0.04 -0.035 0.062 -0.05 a 0.507 0.507 0 0 1 0.222 -0.082 c 0.027 -0.003 0.053 -0.002 0.079 -0.003 l 0.079 0.009 a 0.508 0.508 0 0 1 0.3 0.812 c -0.075 0.08 -0.156 0.154 -0.232 0.233 c -0.423 0.462 -0.728 1.019 -0.974 1.592 c -0.352 0.821 -0.591 1.688 -0.781 2.56 c -0.291 1.326 -0.466 2.677 -0.59 4.029 a 65.05 65.05 0 0 0 -0.241 4.937 c -0.035 2.458 0.031 4.918 0.166 7.374 c 0.044 0.781 0.095 1.561 0.154 2.341 c 0.022 0.289 0.043 0.578 0.071 0.866 a 10.268 10.268 0 0 0 0.248 1.377 c 0.17 0.668 0.414 1.318 0.741 1.924 c 0.224 0.414 0.485 0.806 0.783 1.17 a 8.023 8.023 0 0 0 2.103 1.794 c 0.721 0.43 1.497 0.761 2.297 1.015 c 1.297 0.411 2.652 0.623 4.007 0.712 a 25.044 25.044 0 0 0 4.551 -0.138 c 0.26 -0.033 0.52 -0.068 0.777 -0.114 l 0.079 -0.007 c 0.026 0.001 0.054 0.001 0.08 0.004 a 0.496 0.496 0 0 1 0.333 0.198 a 0.513 0.513 0 0 1 -0.039 0.657 a 0.499 0.499 0 0 1 -0.2 0.127 c -0.025 0.009 -0.052 0.013 -0.077 0.021 c -0.171 0.03 -0.343 0.055 -0.514 0.08 a 26.403 26.403 0 0 1 -4.36 0.219 a 21.54 21.54 0 0 1 -2.515 -0.233 a 16.59 16.59 0 0 1 -0.933 -0.169 c -1.707 -0.358 -3.39 -0.987 -4.8 -2.031 l 0.002 0.034 c 0.069 0.969 0.167 1.934 0.31 2.894 c 0.046 0.321 0.103 0.64 0.159 0.959 c 0.09 0.513 0.183 1.024 0.276 1.537 c 0.418 2.283 0.84 4.563 1.255 6.846 c 0.416 2.298 0.828 4.597 1.211 6.901 c 0.167 1 0.329 2 0.477 3.003 c 0.115 0.776 0.224 1.554 0.307 2.335 c 0.087 0.816 0.138 1.636 0.192 2.454 c 0.088 1.318 0.164 2.637 0.237 3.956 c 0.198 3.601 0.37 7.204 0.534 10.806 l 0.025 0.563 c 0.182 3.28 0.362 6.561 0.547 9.842 a 26.462 26.462 0 0 0 0.429 3.313 c 0.148 0.763 0.332 1.519 0.563 2.26 c 0.112 0.353 0.234 0.703 0.371 1.047 c 0.079 0.199 0.165 0.396 0.248 0.593 c 0.116 0.274 0.138 0.33 0.251 0.605 c 0.083 0.202 0.164 0.403 0.244 0.606 a 50.4 50.4 0 0 1 0.568 1.533 c 0.327 0.938 0.611 1.891 0.842 2.855 c 0.226 0.946 0.401 1.904 0.517 2.869 c 0.065 0.534 0.109 1.07 0.141 1.608 c 0.022 0.444 0.042 0.89 0.062 1.335 c 0.053 1.304 0.105 2.608 0.162 3.912 c 0.023 0.526 0.047 1.051 0.073 1.577 c 0.159 3.194 0.348 6.388 0.676 9.568 c 0.113 1.096 0.242 2.191 0.401 3.281 c 0.147 0.997 0.316 1.993 0.542 2.976 c 0.123 0.533 0.274 1.057 0.424 1.581 c 0.323 1.11 0.648 2.218 0.973 3.326 c 1.442 4.888 2.903 9.771 4.369 14.653 a 137.71 137.71 0 0 1 1.275 5.239 c 0.215 0.968 0.419 1.939 0.599 2.913 c 0.15 0.81 0.286 1.624 0.382 2.442 c 0.077 0.651 0.139 1.314 0.088 1.969 c -0.034 0.344 -0.07 0.687 -0.101 1.031 c -0.1 1.167 -0.169 2.343 -0.071 3.511 c 0.023 0.289 0.057 0.576 0.104 0.862 c 0.036 0.221 0.084 0.441 0.123 0.662 l 0.048 0.306 c 0.175 1.245 0.285 2.499 0.371 3.752 c 0.06 0.859 0.106 1.719 0.131 2.58 a 30 30 0 0 1 0.002 1.944 c -0.009 0.22 -0.021 0.44 -0.04 0.659 c -0.015 0.167 -0.042 0.332 -0.055 0.499 a 3.076 3.076 0 0 0 -0.005 0.192 c 0.004 0.127 0.018 0.252 0.043 0.376 c 0.145 0.717 0.633 1.318 1.199 1.758 c 0.096 0.074 0.195 0.144 0.296 0.211 a 4.89 4.89 0 0 0 2.347 0.785 c 0.278 0.022 0.558 0.033 0.837 0.032 a 10.033 10.033 0 0 0 2.03 -0.208 a 6.508 6.508 0 0 0 1.235 -0.38 c 0.297 -0.128 0.586 -0.285 0.839 -0.488 c 0.182 -0.145 0.347 -0.315 0.469 -0.514 c 0.076 -0.122 0.13 -0.252 0.181 -0.385 a 6.04 6.04 0 0 0 0.208 -0.626 c 0.099 -0.363 0.16 -0.736 0.18 -1.113 a 6.2 6.2 0 0 0 -0.049 -1.123 c -0.09 -0.706 -0.278 -1.392 -0.463 -2.079 c -0.017 -0.069 -0.016 -0.069 -0.032 -0.139 a 3.162 3.162 0 0 1 -0.045 -0.376 c -0.034 -0.641 0.128 -1.281 0.315 -1.889 c 0.058 -0.189 0.119 -0.377 0.182 -0.563 c 0.103 -0.305 0.208 -0.608 0.308 -0.914 c 0.047 -0.145 0.091 -0.289 0.134 -0.435 c 0.099 -0.352 0.189 -0.712 0.206 -1.079 a 3.094 3.094 0 0 0 -0.018 -0.462 a 4.235 4.235 0 0 0 -0.242 -1.023 a 7.784 7.784 0 0 0 -0.321 -0.731 c -0.177 -0.355 -0.365 -0.705 -0.542 -1.06 a 14.433 14.433 0 0 1 -0.298 -0.659 a 38.343 38.343 0 0 1 -0.213 -0.564 a 20.344 20.344 0 0 1 -0.602 -1.941 a 17.173 17.173 0 0 1 -0.517 -4.316 c 0.004 -0.666 0.039 -1.332 0.07 -1.997 c 0.047 -0.995 0.101 -1.99 0.155 -2.985 c 0.202 -3.671 0.417 -7.342 0.619 -11.014 a 730.5 730.5 0 0 0 0.157 -2.974 c 0.058 -1.148 0.116 -2.297 0.163 -3.445 c 0.035 -0.833 0.068 -1.667 0.08 -2.5 c 0.007 -0.421 -0.004 -0.841 -0.005 -1.262 c 0.001 -0.244 0.005 -0.488 0.011 -0.732 c 0.034 -1.148 0.092 -2.296 0.138 -3.443 c 0.017 -0.458 0.032 -0.915 0.046 -1.373 c 0.033 -1.34 0.042 -2.682 0.006 -4.023 a 55.729 55.729 0 0 0 -0.484 -6.067 a 50.547 50.547 0 0 0 -0.338 -2.115 c -0.108 -0.592 -0.228 -1.183 -0.347 -1.773 c -0.187 -0.919 -0.382 -1.838 -0.581 -2.756 c -0.685 -3.15 -1.436 -6.286 -2.165 -9.427 c -0.141 -0.613 -0.28 -1.226 -0.419 -1.84 a 85.133 85.133 0 0 1 -0.601 -2.882 c -0.131 -0.704 -0.256 -1.414 -0.312 -2.13 a 24.446 24.446 0 0 1 -0.056 -1.691 c -0.007 -0.712 0 -1.425 0.011 -2.139 c 0.031 -2.026 0.102 -4.051 0.19 -6.075 c 0.102 -2.361 0.231 -4.72 0.386 -7.078 c 0.159 -2.41 0.347 -4.82 0.586 -7.224 c 0.068 -0.671 0.143 -1.342 0.216 -2.013 c 0.108 -0.988 0.213 -1.976 0.317 -2.964 c 0.416 -4.015 0.809 -8.032 1.172 -12.052 c 0.291 -3.229 0.558 -6.46 0.789 -9.695 c 0.19 -2.66 0.359 -5.323 0.459 -7.99 c 0.037 -0.988 0.065 -1.976 0.072 -2.964 a 35.923 35.923 0 0 0 -0.071 -2.843 c -0.041 -0.501 -0.084 -1.003 -0.127 -1.504 c -0.113 -1.337 -0.226 -2.675 -0.341 -4.012 c -0.374 -4.262 -0.778 -8.521 -1.313 -12.765 a 151.322 151.322 0 0 0 -0.693 -4.923 a 85.479 85.479 0 0 0 -0.811 -4.434 a 66.793 66.793 0 0 0 -1.008 -4.041 c -0.561 -2.011 -1.197 -4.006 -1.974 -5.945 a 31.293 31.293 0 0 0 -0.956 -2.172 a 17.174 17.174 0 0 0 -0.926 -1.683 a 8.756 8.756 0 0 0 -0.315 -0.463 c -0.064 -0.088 -0.134 -0.174 -0.198 -0.262 a 2.144 2.144 0 0 1 -0.089 -0.137 a 4.385 4.385 0 0 1 -0.37 -0.846 c -0.113 -0.34 -0.203 -0.688 -0.281 -1.037 c -0.245 -1.099 -0.381 -2.223 -0.473 -3.344 a 38.952 38.952 0 0 1 -0.025 -6.002 c 0.091 -1.193 0.26 -2.379 0.426 -3.563 c 0.227 -1.616 0.471 -3.229 0.715 -4.841 c 0.497 -3.252 1.005 -6.502 1.497 -9.754 c 0.169 -1.124 0.338 -2.248 0.492 -3.374 c 0.053 -0.382 0.104 -0.766 0.149 -1.15 c 0.027 -0.233 0.059 -0.468 0.066 -0.702 c 0.001 -0.038 -0.003 -0.075 -0.005 -0.114 l -0.006 -0.197 l -0.005 -0.439 v -0.378 a 265.646 265.646 0 0 1 0.477 -14.971 c 0.1 -1.658 0.218 -3.315 0.401 -4.967 c 0.054 -0.493 0.116 -0.985 0.189 -1.476 a 27.72 27.72 0 0 1 0.116 -0.697 c 0.019 -0.063 0.048 -0.123 0.072 -0.184 l 0.137 -0.143 c 0.18 -0.078 0.182 -0.079 0.379 -0.082 l 0.184 0.072 c 0.141 0.137 0.143 0.139 0.221 0.319 l 0.003 0.198 c -0.031 0.175 -0.061 0.35 -0.089 0.526 c -0.029 0.195 -0.058 0.391 -0.084 0.588 c -0.217 1.664 -0.35 3.337 -0.462 5.01 a 221.395 221.395 0 0 0 -0.288 5.579 a 329.418 329.418 0 0 0 -0.231 8.658 c -0.007 0.48 -0.012 0.959 -0.013 1.438 c 0.752 1.838 1.5 3.677 2.248 5.517 c 1.157 2.853 2.311 5.707 3.45 8.567 c 0.399 1.002 0.796 2.005 1.188 3.01 c 0.314 0.806 0.628 1.611 0.923 2.424 c 0.147 0.405 0.282 0.814 0.424 1.222 l 0.212 0.601 c 0.174 0.476 0.352 0.949 0.519 1.427 c 0.037 0.111 0.075 0.224 0.111 0.337 c 0.106 0.345 0.191 0.693 0.252 1.047 c 0.045 0.263 0.075 0.529 0.119 0.793 c 0.022 0.124 0.048 0.247 0.074 0.369 c 0.141 0.632 0.317 1.256 0.505 1.876 c 0.184 0.603 0.38 1.203 0.587 1.797 c 0.208 0.6 0.426 1.196 0.658 1.787 c 0.245 0.621 0.504 1.238 0.799 1.835 c 0.088 0.175 0.183 0.346 0.273 0.52 c 0.146 0.276 0.289 0.554 0.432 0.831 c 1.724 3.347 3.426 6.705 5.129 10.062 c 2.414 4.756 4.821 9.513 7.229 14.271 c 0.072 0.124 0.141 0.25 0.21 0.376 a 24.258 24.258 0 0 1 1.775 4.231 c 0.418 1.351 0.713 2.751 0.791 4.167 c 0.027 0.494 0.028 0.99 -0.004 1.483 c -0.02 0.32 -0.059 0.636 -0.089 0.955 l -0.034 0.45 a 21.34 21.34 0 0 0 -0.026 2.146 c 0.05 1.247 0.216 2.488 0.475 3.708 c 0.15 0.7 0.33 1.393 0.531 2.08 c 0.175 0.604 0.37 1.202 0.551 1.804 c 0.011 0.045 0.011 0.045 0.019 0.089 c 0.061 0.387 0.064 0.783 0.055 1.172 c -0.01 0.428 -0.046 0.855 -0.082 1.282 c -0.024 0.289 -0.049 0.579 -0.071 0.869 c -0.02 0.267 -0.039 0.535 -0.056 0.803 a 34.93 34.93 0 0 0 -0.071 2.243 c 0.003 0.508 0.022 1.017 0.08 1.521 c 0.038 0.315 0.086 0.638 0.196 0.938 c 0.026 0.075 0.058 0.149 0.1 0.216 c 0.018 0.03 0.039 0.062 0.067 0.084 c 0.021 -0.022 0.038 -0.047 0.056 -0.071 c 0.092 -0.141 0.155 -0.3 0.205 -0.459 c 0.076 -0.236 0.129 -0.48 0.172 -0.723 c 0.105 -0.593 0.143 -1.192 0.185 -1.79 c 0.021 -0.311 0.027 -0.375 0.05 -0.682 l 0.056 -0.637 c 0.067 -0.705 0.142 -1.409 0.255 -2.107 c 0.062 -0.378 0.133 -0.754 0.233 -1.124 c 0.021 -0.075 0.042 -0.149 0.065 -0.223 c 0.106 -0.335 0.251 -0.704 0.557 -0.906 a 0.734 0.734 0 0 1 0.317 -0.11 a 0.737 0.737 0 0 1 0.396 0.076 c 0.099 0.048 0.19 0.114 0.268 0.193 c 0.11 0.109 0.196 0.241 0.267 0.379 c 0.105 0.203 0.179 0.422 0.24 0.642 c 0.077 0.274 0.134 0.555 0.182 0.836 c 0.097 0.553 0.16 1.112 0.214 1.672 c 0.029 0.305 0.055 0.61 0.086 0.914 l 0.061 0.525 c 0.116 0.905 0.259 1.807 0.448 2.7 c 0.14 0.663 0.303 1.326 0.523 1.969 c 0.122 0.354 0.26 0.711 0.455 1.031 c 0.053 0.086 0.11 0.17 0.178 0.244 a 0.434 0.434 0 0 0 0.124 0.102 c 0.015 0.007 0.031 0.003 0.047 0.004 c 0.073 -0.011 0.129 -0.091 0.162 -0.149 a 0.71 0.71 0 0 0 0.056 -0.114 l 0.029 -0.077 a 1.567 1.567 0 0 0 0.051 -0.199 c 0.012 -0.063 0.022 -0.127 0.03 -0.191 c 0.037 -0.307 0.029 -0.619 0.005 -0.927 c -0.047 -0.602 -0.172 -1.192 -0.275 -1.785 a 62.324 62.324 0 0 1 -0.669 -5.425 c -0.038 -0.49 -0.069 -0.981 -0.079 -1.473 a 8.134 8.134 0 0 1 0.003 -0.518 c 0.005 -0.111 0.012 -0.223 0.034 -0.332 a 0.68 0.68 0 0 1 0.102 -0.265 c 0.033 -0.043 0.069 -0.097 0.116 -0.128 c 0.087 -0.055 0.084 -0.06 0.178 -0.095 c 0.271 -0.097 0.572 -0.017 0.795 0.148 c 0.199 0.147 0.349 0.353 0.474 0.562 c 0.225 0.374 0.39 0.783 0.539 1.19 c 0.074 0.204 0.143 0.41 0.21 0.617 c 0.102 0.325 0.198 0.652 0.296 0.977 a 234.794 234.794 0 0 0 1.427 4.59 c 0.053 0.171 0.104 0.342 0.164 0.511 a 5.969 5.969 0 0 0 0.282 0.646 c 0.05 0.097 0.103 0.193 0.157 0.287 a 3.79 3.79 0 0 0 0.387 0.54 c 0.034 0.037 0.069 0.075 0.105 0.11 c 0.19 0.182 0.451 0.357 0.726 0.281 a 0.088 0.088 0 0 0 0.027 -0.01 c 0.028 -0.055 0.025 -0.13 0.024 -0.188 a 2.33 2.33 0 0 0 -0.046 -0.382 c -0.042 -0.22 -0.1 -0.436 -0.157 -0.652 c -0.07 -0.257 -0.141 -0.513 -0.209 -0.77 c -0.041 -0.165 -0.081 -0.33 -0.118 -0.497 a 7.896 7.896 0 0 1 -0.067 -0.341 c -0.049 -0.291 -0.087 -0.581 -0.13 -0.872 c -0.054 -0.364 -0.065 -0.435 -0.122 -0.805 c -0.226 -1.419 -0.502 -2.83 -0.885 -4.215 a 24.636 24.636 0 0 0 -0.414 -1.356 c -0.067 -0.201 -0.141 -0.399 -0.211 -0.599 l -0.016 -0.054 a 1.106 1.106 0 0 1 -0.036 -0.375 a 0.796 0.796 0 0 1 0.485 -0.661 a 1.085 1.085 0 0 1 0.498 -0.078 c 0.084 0.01 0.164 0.028 0.242 0.061 a 0.772 0.772 0 0 1 0.156 0.088 c 0.289 0.205 0.4 0.552 0.516 0.871 c 0.029 0.08 0.06 0.16 0.091 0.24 c 0.036 0.085 0.075 0.168 0.115 0.251 c 0.334 0.679 0.693 1.346 1.051 2.013 a 230.697 230.697 0 0 0 1.686 3.087 c 0.053 0.092 0.106 0.184 0.162 0.275 c 0.111 0.175 0.226 0.349 0.365 0.503 c 0.07 0.078 0.147 0.159 0.241 0.208 l 0.005 0.003 l 0.027 -0.019 c 0.014 -0.022 0.026 -0.046 0.038 -0.069 c 0.129 -0.28 0.182 -0.593 0.194 -0.899 c 0.027 -0.649 -0.135 -1.289 -0.368 -1.889 c -0.257 -0.633 -0.515 -1.265 -0.768 -1.899 c -0.578 -1.455 -1.13 -2.921 -1.604 -4.414 a 28.86 28.86 0 0 1 -0.855 -3.246 a 12.471 12.471 0 0 1 -0.25 -2.065 a 8.598 8.598 0 0 1 -0.001 -0.359 a 0.647 0.647 0 0 1 0.078 -0.337 a 0.594 0.594 0 0 1 0.083 -0.103 a 0.513 0.513 0 0 1 0.794 0.129 a 0.636 0.636 0 0 1 0.058 0.333 a 5.93 5.93 0 0 0 0.011 0.557 c 0.021 0.335 0.058 0.668 0.108 0.998 c 0.032 0.053 0.039 0.062 0.077 0.121 l 0.118 0.174 c 0.126 0.174 0.254 0.345 0.392 0.51 c 0.091 0.107 0.185 0.213 0.282 0.315 a 5.136 5.136 0 0 0 0.593 0.535 c 0.424 0.321 0.949 0.584 1.495 0.511 a 1.49 1.49 0 0 0 0.378 -0.103 l 0.019 -0.008 a 0.631 0.631 0 0 0 -0.035 -0.182 a 1.828 1.828 0 0 0 -0.129 -0.281 a 4.71 4.71 0 0 0 -0.588 -0.788 l -0.04 -0.051 a 22.732 22.732 0 0 1 -1.154 -1.885 a 11.632 11.632 0 0 1 -0.391 -0.782 a 5.494 5.494 0 0 1 -0.261 -0.681 a 2.946 2.946 0 0 1 -0.085 -0.363 c -0.012 -0.076 -0.015 -0.153 -0.029 -0.23 a 1.045 1.045 0 0 0 -0.026 -0.096 a 1.999 1.999 0 0 0 -0.363 -0.595 a 5.223 5.223 0 0 0 -0.658 -0.647 a 11.295 11.295 0 0 0 -1.433 -1.013 c -0.5 -0.302 -1.016 -0.576 -1.532 -0.849 c -0.465 -0.247 -0.932 -0.49 -1.4 -0.73 l -0.099 -0.051 c -0.089 -0.058 -0.089 -0.058 -0.164 -0.134 a 5.818 5.818 0 0 1 -0.201 -0.267 a 14.566 14.566 0 0 1 -1.08 -1.815 a 19.985 19.985 0 0 1 -0.92 -2.107 c -0.218 -0.585 -0.402 -1.182 -0.599 -1.774 c -0.445 -1.329 -0.904 -2.651 -1.353 -3.978 c -0.488 -1.459 -0.966 -2.92 -1.418 -4.391 a 117.616 117.616 0 0 1 -2.002 -7.298 a 89.39 89.39 0 0 1 -1.108 -5.364 c -0.078 -0.449 -0.152 -0.9 -0.233 -1.349 a 53.179 53.179 0 0 0 -1.526 -6.246 a 50.635 50.635 0 0 0 -2.131 -5.611 c -0.82 -1.825 -1.744 -3.599 -2.721 -5.344 c -0.42 -0.751 -0.851 -1.497 -1.284 -2.241 c -0.244 -0.419 -0.491 -0.836 -0.735 -1.255 c -0.086 -0.151 -0.086 -0.151 -0.169 -0.303 c -0.574 -1.076 -1.051 -2.199 -1.484 -3.337 a 59.533 59.533 0 0 1 -1.177 -3.406 c -0.976 -3.093 -1.798 -6.234 -2.53 -9.392 a 123.564 123.564 0 0 1 -1.137 -5.38 a 55.146 55.146 0 0 1 -0.302 -1.758 a 23.616 23.616 0 0 1 -0.091 -0.65 a 6.391 6.391 0 0 1 -0.053 -0.617 c -0.002 -0.108 0.005 -0.216 0.012 -0.324 l 0.065 -1.06 c 0.053 -1.073 0.075 -2.148 0.051 -3.222 a 36.962 36.962 0 0 0 -0.15 -2.62 a 33.016 33.016 0 0 0 -0.244 -1.983 a 28.593 28.593 0 0 0 -0.564 -2.753 c -0.662 -2.546 -1.733 -5.028 -3.407 -7.077 a 13.978 13.978 0 0 0 -0.917 -1.014 a 13 13 0 0 0 -3.11 -2.31 a 14.375 14.375 0 0 0 -1 -0.484 c -0.066 -0.037 -0.13 -0.076 -0.196 -0.112 a 5.292 5.292 0 0 0 -0.902 -0.345 c -0.356 -0.105 -0.72 -0.187 -1.087 -0.254 a 19.649 19.649 0 0 0 -2.836 -0.286 c -0.439 -0.015 -0.879 -0.012 -1.318 -0.021 a 14.403 14.403 0 0 1 -0.415 -0.02 a 14.993 14.993 0 0 1 -3.105 -0.58 a 19.754 19.754 0 0 1 -2.323 -0.842 a 20.01 20.01 0 0 1 -3.422 -1.888 a 15.483 15.483 0 0 1 -2.413 -2.034 c -1.117 -1.168 -2.048 -2.578 -2.407 -4.173 a 6.32 6.32 0 0 1 -0.131 -1.957 l 0.004 -0.046 l -0.021 -1.298 Z M 62.03 306.42 a 41.28 41.28 0 0 0 -0.349 2.261 a 93.766 93.766 0 0 0 -0.382 3.464 l 0.47 0.088 c 0.341 -0.036 0.676 -0.132 0.982 -0.288 a 2.794 2.794 0 0 0 1.219 -1.233 l 0.014 -0.03 l 0.01 -0.02 a 6.847 6.847 0 0 0 0.178 -1.192 c 0.036 -0.695 -0.059 -1.448 -0.465 -2.033 a 2.225 2.225 0 0 0 -0.595 -0.597 a 2.249 2.249 0 0 0 -0.549 -0.272 c -0.171 -0.053 -0.354 -0.101 -0.533 -0.148 Z m 43.555 0.086 a 0.217 0.217 0 0 1 -0.035 0.015 c -0.065 0.027 -0.135 0.041 -0.202 0.063 a 3.905 3.905 0 0 0 -0.162 0.065 a 2.35 2.35 0 0 0 -0.524 0.333 a 2.212 2.212 0 0 0 -0.322 0.334 c -0.52 0.667 -0.611 1.559 -0.535 2.376 c 0.02 0.219 0.053 0.436 0.094 0.652 c 0.021 0.106 0.038 0.214 0.068 0.318 a 1.54 1.54 0 0 0 0.065 0.131 c 0.32 0.588 0.852 1.056 1.482 1.284 a 2.86 2.86 0 0 0 0.528 0.135 a 71.196 71.196 0 0 0 -0.29 -4.263 c -0.048 -0.481 -0.1 -0.963 -0.167 -1.443 Z m 33.385 -129.317 c -0.007 -0.005 -0.015 -0.008 -0.022 -0.011 l 0.022 0.011 Z M 83.398 73.692 c 0.032 0.013 0.066 0.023 0.098 0.039 a 0.51 0.51 0 0 1 0.256 0.323 c 0.024 0.092 0.015 0.117 0.009 0.211 c -0.031 0.191 -0.061 0.383 -0.087 0.576 a 35.83 35.83 0 0 0 -0.208 2.169 a 75.532 75.532 0 0 0 -0.124 2.561 a 175.601 175.601 0 0 0 -0.081 6.369 c 0.012 5.463 0.155 10.925 0.302 16.386 c 0.108 3.918 0.222 7.837 0.326 11.756 c 0.064 2.486 0.124 4.972 0.163 7.459 c 0.032 2.069 0.053 4.138 0.031 6.206 a 70.647 70.647 0 0 1 -0.111 3.653 c -0.026 0.412 -0.057 0.823 -0.101 1.233 c -0.02 0.17 -0.041 0.341 -0.066 0.509 c -0.013 0.089 -0.024 0.181 -0.045 0.269 a 0.522 0.522 0 0 1 -0.147 0.276 a 0.51 0.51 0 0 1 -0.75 -0.052 a 0.512 0.512 0 0 1 -0.108 -0.295 c -0.001 -0.035 0.005 -0.07 0.008 -0.106 c 0.025 -0.14 0.046 -0.28 0.065 -0.42 c 0.1 -0.773 0.144 -1.552 0.177 -2.33 c 0.038 -0.915 0.056 -1.832 0.065 -2.748 c 0.026 -2.392 -0.005 -4.786 -0.047 -7.178 a 940.694 940.694 0 0 0 -0.208 -8.733 c -0.108 -3.953 -0.224 -7.906 -0.328 -11.859 c -0.03 -1.182 -0.059 -2.363 -0.087 -3.545 c -0.099 -4.465 -0.186 -8.932 -0.142 -13.4 c 0.016 -1.675 0.05 -3.351 0.136 -5.024 c 0.065 -1.265 0.152 -2.533 0.349 -3.785 l 0.019 -0.115 c 0.026 -0.09 0.025 -0.116 0.077 -0.196 a 0.512 0.512 0 0 1 0.348 -0.222 c 0.034 -0.005 0.071 -0.003 0.105 -0.005 l 0.106 0.018 Z m 7.204 -4.773 a 0.52 0.52 0 0 1 0.385 0.304 c 0.019 0.047 0.02 0.06 0.031 0.11 c 0.009 0.079 0.013 0.157 0.018 0.236 l 0.043 0.517 a 42.04 42.04 0 0 0 0.461 3.423 c 0.148 0.844 0.326 1.684 0.533 2.515 c 0.161 0.636 0.339 1.268 0.54 1.892 c 0.163 0.504 0.342 1.004 0.539 1.496 c 0.17 0.424 0.355 0.842 0.555 1.252 c 0.141 0.285 0.29 0.567 0.448 0.842 a 12.13 12.13 0 0 0 0.752 1.153 c 0.726 0.974 1.649 1.835 2.789 2.29 c 0.248 0.1 0.504 0.179 0.765 0.237 a 5.48 5.48 0 0 0 1.271 0.121 l 0.056 0.003 c 0.05 0.007 0.063 0.007 0.111 0.024 c 0.09 0.03 0.171 0.085 0.231 0.159 a 0.512 0.512 0 0 1 -0.165 0.776 a 0.703 0.703 0 0 1 -0.321 0.055 l -0.207 -0.002 a 6.235 6.235 0 0 1 -1.195 -0.145 a 6.323 6.323 0 0 1 -2.402 -1.124 a 8.62 8.62 0 0 1 -1.625 -1.63 a 13.426 13.426 0 0 1 -1.416 -2.311 a 21.906 21.906 0 0 1 -1.212 -3.08 c -0.516 -1.64 -0.886 -3.324 -1.158 -5.02 a 42.426 42.426 0 0 1 -0.275 -2.007 a 31.06 31.06 0 0 1 -0.14 -1.555 l -0.001 -0.056 a 0.506 0.506 0 0 1 0.476 -0.48 c 0.057 -0.001 0.057 -0.001 0.113 0.005 Z m -15.928 -0.005 a 0.51 0.51 0 0 1 0.472 0.585 c -0.015 0.226 -0.034 0.453 -0.053 0.679 a 43.107 43.107 0 0 1 -0.473 3.507 a 36.786 36.786 0 0 1 -0.549 2.586 a 30.306 30.306 0 0 1 -0.558 1.958 c -0.17 0.526 -0.356 1.048 -0.563 1.561 a 19.42 19.42 0 0 1 -0.497 1.136 a 15.57 15.57 0 0 1 -0.468 0.909 c -0.813 1.463 -1.9 2.846 -3.374 3.685 a 6.14 6.14 0 0 1 -1.594 0.635 a 6.477 6.477 0 0 1 -1.599 0.167 l -0.057 -0.004 a 0.533 0.533 0 0 1 -0.3 -0.149 a 0.512 0.512 0 0 1 0.054 -0.755 a 0.535 0.535 0 0 1 0.26 -0.104 c 0.138 -0.006 0.276 -0.001 0.413 -0.006 a 5.007 5.007 0 0 0 1.898 -0.449 c 1.351 -0.615 2.366 -1.782 3.131 -3.028 a 15.345 15.345 0 0 0 0.805 -1.513 c 0.193 -0.417 0.37 -0.843 0.533 -1.272 c 0.188 -0.496 0.359 -0.998 0.514 -1.505 c 0.209 -0.684 0.392 -1.375 0.555 -2.072 c 0.201 -0.866 0.369 -1.738 0.511 -2.615 c 0.104 -0.65 0.193 -1.303 0.267 -1.958 c 0.056 -0.5 0.106 -1.001 0.136 -1.502 l 0.007 -0.057 a 0.603 0.603 0 0 1 0.056 -0.161 a 0.518 0.518 0 0 1 0.251 -0.222 c 0.047 -0.019 0.06 -0.02 0.108 -0.031 c 0.057 -0.006 0.057 -0.006 0.114 -0.005 Z M 87.984 3.09 a 0.506 0.506 0 0 1 -0.73 -0.033 c -0.02 -0.023 -0.036 -0.051 -0.054 -0.076 l 0.001 0.003 a 0.064 0.064 0 0 0 0.007 0.009 l -0.014 -0.016 c -0.024 -0.025 -0.047 -0.046 -0.071 -0.068 a 3.17 3.17 0 0 0 -0.491 -0.33 c -0.18 -0.1 -0.364 -0.191 -0.55 -0.276 a 15.318 15.318 0 0 0 -1.72 -0.641 a 29.435 29.435 0 0 0 -1.168 -0.34 a 10.265 10.265 0 0 0 -0.914 -0.214 a 6.662 6.662 0 0 0 -1.323 -0.09 c -1.195 0.033 -2.362 0.368 -3.446 0.859 c -0.762 0.345 -1.488 0.768 -2.179 1.239 A 20.22 20.22 0 0 0 73.1 4.895 a 19.566 19.566 0 0 0 -1.818 1.881 l -0.056 0.057 c -0.099 0.086 -0.098 0.086 -0.196 0.175 l -0.189 0.178 c -0.28 0.279 -0.546 0.572 -0.792 0.882 c -0.7 0.884 -1.249 1.879 -1.69 2.915 c -0.728 1.709 -1.174 3.533 -1.474 5.364 a 40.608 40.608 0 0 0 -0.444 4.118 a 57.316 57.316 0 0 0 -0.082 4.56 c 0.071 3.817 0.45 7.623 1.013 11.397 c 0.075 -0.285 0.153 -0.569 0.233 -0.851 c 0.018 -0.061 0.043 -0.164 0.074 -0.227 a 0.51 0.51 0 0 1 0.883 -0.045 a 0.514 0.514 0 0 1 0.077 0.255 c 0.001 0.06 -0.007 0.095 -0.015 0.152 a 4.923 4.923 0 0 0 -0.036 0.455 c -0.021 0.81 0.091 1.621 0.233 2.418 c 0.194 1.091 0.465 2.168 0.764 3.234 l 0.049 0.172 l 0.074 0.251 c 0.041 -0.137 0.082 -0.274 0.126 -0.411 c 0.047 -0.146 0.097 -0.292 0.147 -0.437 l 0.043 -0.116 c 0.014 -0.037 0.027 -0.079 0.045 -0.117 a 0.443 0.443 0 0 1 0.03 -0.062 l 0.001 -0.001 l 0.001 -0.001 a 0.516 0.516 0 0 1 0.381 -0.243 a 0.568 0.568 0 0 1 0.199 0.019 a 0.518 0.518 0 0 1 0.24 0.16 a 0.47 0.47 0 0 1 0.097 0.175 l 0.001 0.002 a 0.596 0.596 0 0 1 0.018 0.086 l 0.011 0.067 a 8.966 8.966 0 0 0 0.645 2.067 c 0.15 0.329 0.321 0.664 0.563 0.935 l 0.031 0.031 l 0.023 0.021 c 0.019 -0.037 0.036 -0.077 0.053 -0.116 c 0.036 -0.096 0.065 -0.193 0.099 -0.289 c 0.056 -0.163 0.074 -0.213 0.132 -0.376 a 34.4 34.4 0 0 1 0.208 -0.554 c 0.392 -0.999 0.827 -1.981 1.31 -2.94 c 0.017 -0.031 0.017 -0.03 0.036 -0.061 a 0.528 0.528 0 0 1 0.352 -0.214 a 0.578 0.578 0 0 1 0.242 0.028 a 0.512 0.512 0 0 1 0.328 0.498 c -0.014 0.179 -0.041 0.359 -0.062 0.537 c -0.13 1.032 -0.275 2.067 -0.513 3.081 l -0.006 0.025 c 0.178 -0.099 0.357 -0.199 0.536 -0.296 a 14.4 14.4 0 0 1 0.428 -0.22 c 0.268 -0.129 0.544 -0.249 0.831 -0.329 c 0 -0.35 -0.01 -0.7 -0.024 -1.05 c -0.008 -0.188 -0.023 -0.375 -0.029 -0.562 a 0.529 0.529 0 0 1 0.095 -0.299 a 0.51 0.51 0 0 1 0.914 0.237 c 0.011 0.116 0.015 0.235 0.022 0.354 c 0.02 0.436 0.032 0.873 0.034 1.311 l -0.001 0.201 c 0.158 -0.21 0.319 -0.416 0.48 -0.623 c 0.159 -0.202 0.159 -0.202 0.32 -0.403 c 0.317 -0.388 0.635 -0.782 0.999 -1.128 c 0.098 -0.095 0.205 -0.191 0.323 -0.263 l 0.009 -0.05 c 0.012 -0.046 0.013 -0.058 0.033 -0.1 a 0.484 0.484 0 0 1 0.162 -0.206 a 0.51 0.51 0 0 1 0.806 0.454 c -0.014 0.096 -0.016 0.095 -0.035 0.189 c -0.16 0.783 -0.322 1.565 -0.498 2.345 c 0.106 -0.104 0.21 -0.21 0.313 -0.317 c 0.164 -0.174 0.327 -0.349 0.475 -0.537 c 0.075 -0.094 0.156 -0.193 0.204 -0.305 c 0.006 -0.013 0.008 -0.028 0.011 -0.042 c 0.01 -0.041 0.01 -0.041 0.023 -0.081 l 0.024 -0.061 a 0.561 0.561 0 0 1 0.209 -0.236 a 0.522 0.522 0 0 1 0.725 0.204 c 0.081 0.149 0.095 0.328 0.114 0.493 c 0.032 0.295 0.048 0.591 0.066 0.888 l 0.002 0.034 l 3.016 -2.66 l 0.042 -0.033 a 0.486 0.486 0 0 1 0.25 -0.092 a 0.504 0.504 0 0 1 0.31 0.075 a 0.957 0.957 0 0 1 0.118 0.092 a 1.572 1.572 0 0 1 0.315 0.392 c 0.034 0.058 0.067 0.118 0.095 0.178 c 0.043 0.09 0.081 0.181 0.116 0.275 c 0.046 0.129 0.086 0.259 0.121 0.391 c 0.045 0.17 0.081 0.341 0.114 0.513 c 0.038 0.207 0.067 0.415 0.096 0.624 l 0.008 0.065 c 0.08 -0.168 0.165 -0.333 0.249 -0.499 c 0.108 -0.205 0.219 -0.411 0.33 -0.616 c 0.209 -0.377 0.423 -0.749 0.641 -1.119 l 0.075 -0.126 a 0.56 0.56 0 0 1 0.187 -0.182 a 0.511 0.511 0 0 1 0.657 0.144 a 0.53 0.53 0 0 1 0.097 0.295 c -0.003 0.075 -0.011 0.15 -0.014 0.225 c -0.007 0.552 0.182 1.072 0.433 1.557 l 0.031 0.058 c 0.256 -0.789 0.457 -1.598 0.619 -2.413 l 0.013 -0.051 a 0.578 0.578 0 0 1 0.102 -0.183 a 0.512 0.512 0 0 1 0.528 -0.152 c 0.103 0.031 0.191 0.1 0.276 0.165 c 0.234 0.179 0.443 0.391 0.632 0.616 c 0.304 0.359 0.561 0.755 0.799 1.16 l 0.059 -0.229 a 16.805 16.805 0 0 1 0.2 -0.649 c 0.141 -0.425 0.298 -0.843 0.472 -1.256 l 0.015 -0.034 c 0.02 -0.042 0.024 -0.054 0.052 -0.093 a 0.516 0.516 0 0 1 0.251 -0.187 c 0.044 -0.015 0.057 -0.015 0.103 -0.023 c 0.053 -0.003 0.053 -0.003 0.107 -0.001 c 0.07 0.011 0.136 0.027 0.2 0.063 a 0.513 0.513 0 0 1 0.235 0.593 c -0.038 0.105 -0.085 0.205 -0.126 0.308 c -0.058 0.145 -0.066 0.167 -0.115 0.293 c -0.066 0.175 -0.13 0.351 -0.191 0.529 l 0.036 0.107 c 0.16 0.486 0.309 0.975 0.432 1.472 c 0.12 0.478 0.219 0.961 0.272 1.451 l 0.003 0.042 a 9.277 9.277 0 0 0 1.21 -2.264 a 0.505 0.505 0 0 1 0.034 -0.097 a 5.968 5.968 0 0 0 0.228 -0.853 c 0.016 -0.086 0.026 -0.17 0.041 -0.255 a 0.516 0.516 0 0 1 0.526 -0.402 a 0.549 0.549 0 0 1 0.174 0.043 a 0.509 0.509 0 0 1 0.302 0.449 v 0.012 c 0.186 -0.61 0.365 -1.223 0.541 -1.838 c 0.263 -0.928 0.515 -1.861 0.748 -2.797 l 0.06 -0.242 a 40.378 40.378 0 0 0 0.421 -1.875 c 0.117 -0.583 0.225 -1.171 0.267 -1.766 l 0.005 -0.047 a 0.508 0.508 0 0 1 0.441 -0.422 c 0.048 -0.003 0.047 -0.003 0.095 -0.002 a 0.505 0.505 0 0 1 0.469 0.495 a 3.805 3.805 0 0 1 -0.02 0.283 c -0.088 0.871 -0.268 1.73 -0.461 2.583 c -0.062 0.28 -0.128 0.559 -0.195 0.837 c 0.043 0.185 0.085 0.372 0.126 0.558 l 0.027 0.127 c 0.088 -0.334 0.174 -0.671 0.259 -1.007 c 0.774 -3.108 1.404 -6.259 1.734 -9.448 c 0.126 -1.211 0.207 -2.428 0.22 -3.646 a 25.074 25.074 0 0 0 -0.159 -3.241 c -0.096 -0.8 -0.252 -1.591 -0.443 -2.375 a 29.815 29.815 0 0 0 -0.551 -1.977 a 31.82 31.82 0 0 0 -1.337 -3.504 a 28.649 28.649 0 0 0 -1.604 -3.068 a 23.324 23.324 0 0 0 -1.07 -1.618 a 18.913 18.913 0 0 0 -0.909 -1.163 a 15.682 15.682 0 0 0 -0.827 -0.903 a 13.364 13.364 0 0 0 -0.727 -0.681 c -0.16 -0.138 -0.324 -0.272 -0.491 -0.4 c -1.053 -0.808 -2.315 -1.45 -3.668 -1.466 a 4.241 4.241 0 0 0 -0.617 0.037 a 4.595 4.595 0 0 0 -1.055 0.276 l -0.08 0.023 l -0.051 0.007 Z"></path>
                                                  </g>
                                                  <g class="body-parts">
                                                    <path
                                                      class="body-area body-area-head hover_body "
                                                      body_part="head "
                                                      data-original-title="Head"
                                                      id="body-area-head"
                                                      title=""
                                                      data-toggle="popover"
                                                      data-container="body"
                                                      data-placement="right"
                                                      type="button"
                                                      data-html="true"
                                                      href="#"
                                                      onClick={
                                                        this.attributeSymptomTag
                                                      }
                                                      gender="female"
                                                      d="M 73.289 44.931 l -0.032 -0.119 l -0.002 -0.029 a 1.65 1.65 0 0 1 -0.137 0.248 a 1.189 1.189 0 0 1 -0.275 0.291 a 0.867 0.867 0 0 1 -0.449 0.159 a 0.822 0.822 0 0 1 -0.157 -0.006 c -0.345 -0.047 -0.623 -0.293 -0.834 -0.554 a 4.243 4.243 0 0 1 -0.405 -0.621 a 8.046 8.046 0 0 1 -0.432 -0.945 l -0.059 -0.156 l -0.111 0.887 c 0.001 0.06 0.005 0.119 0.014 0.178 c 0.011 0.065 0.028 0.129 0.037 0.195 l 0.001 0.015 c 0.001 0.071 0.001 0.071 -0.008 0.142 l -0.001 0.004 c -0.008 0.028 -0.014 0.056 -0.024 0.084 a 0.507 0.507 0 0 1 -0.152 0.208 c -0.022 0.018 -0.048 0.033 -0.072 0.049 l -0.001 0.001 c -0.024 0.012 -0.049 0.025 -0.073 0.034 a 0.516 0.516 0 0 1 -0.318 0.011 c -0.069 -0.02 -0.083 -0.033 -0.145 -0.069 l -0.002 -0.002 c -0.06 -0.049 -0.06 -0.048 -0.112 -0.106 a 0.535 0.535 0 0 1 -0.087 -0.15 c -0.045 -0.098 -0.082 -0.202 -0.12 -0.303 a 38.817 38.817 0 0 1 -1.47 -5.405 a 3.057 3.057 0 0 0 -0.018 0.235 l -0.001 0.062 c 0.01 0.057 0.021 0.115 0.028 0.173 l 0.002 0.026 l -0.003 0.093 c -0.02 0.089 -0.02 0.089 -0.054 0.174 l -0.001 0.001 c -0.042 0.065 -0.049 0.085 -0.106 0.138 a 0.509 0.509 0 0 1 -0.711 -0.026 c -0.021 -0.021 -0.037 -0.046 -0.055 -0.069 l -0.001 -0.002 c -0.031 -0.056 -0.032 -0.055 -0.056 -0.114 a 1.001 1.001 0 0 1 -0.051 -0.287 l -0.137 -0.785 l 1.456 -0.42 a 9.218 9.218 0 0 0 2.439 -1.431 a 10.022 10.022 0 0 0 1.734 -1.818 c 0.489 -0.659 0.899 -1.376 1.225 -2.129 c 1.322 -3.052 1.231 -6.674 -0.263 -9.648 a 10.738 10.738 0 0 0 -0.962 -1.565 a 10.16 10.16 0 0 0 -1.551 -1.666 a 9.297 9.297 0 0 0 -2.295 -1.446 a 8.73 8.73 0 0 0 -2.284 -0.653 l -0.471 -0.036 l 0.187 -1.768 c 0.095 -0.564 0.206 -1.125 0.332 -1.683 c 0.348 -1.53 0.822 -3.041 1.505 -4.456 c 0.501 -1.036 1.117 -2.022 1.881 -2.885 c 0.258 -0.291 0.533 -0.564 0.821 -0.824 l 0.076 -0.067 c 0.082 -0.099 0.167 -0.195 0.252 -0.292 a 23.917 23.917 0 0 1 1.801 -1.808 a 22.98 22.98 0 0 1 1.112 -0.934 a 16.805 16.805 0 0 1 3.137 -1.988 c 0.968 -0.463 1.996 -0.815 3.057 -0.977 c 0.395 -0.059 0.792 -0.09 1.191 -0.097 c 0.152 0 0.151 0 0.302 0.003 a 8.32 8.32 0 0 1 1.22 0.132 c 0.223 0.042 0.443 0.098 0.663 0.156 c 0.248 0.065 0.495 0.133 0.741 0.204 c 0.746 0.215 1.486 0.455 2.201 0.756 c 0.266 0.112 0.529 0.232 0.784 0.368 c 0.164 0.088 0.326 0.181 0.481 0.285 c 0.095 0.065 0.192 0.133 0.281 0.208 a 5.857 5.857 0 0 1 1.057 -0.299 a 5.406 5.406 0 0 1 1.82 -0.008 c 1.556 0.254 2.948 1.124 4.111 2.156 c 0.224 0.199 0.441 0.405 0.652 0.618 c 0.217 0.219 0.428 0.444 0.633 0.676 c 0.295 0.334 0.579 0.68 0.851 1.035 c 0.323 0.421 0.63 0.855 0.922 1.298 c 0.379 0.573 0.734 1.162 1.068 1.763 a 32.033 32.033 0 0 1 3.138 8.14 l 0.045 0.24 h -0.19 l -1.092 0.084 a 8.73 8.73 0 0 0 -2.284 0.653 a 9.316 9.316 0 0 0 -2.295 1.446 a 10.16 10.16 0 0 0 -1.551 1.666 a 10.738 10.738 0 0 0 -0.962 1.565 c -1.494 2.974 -1.585 6.596 -0.263 9.648 c 0.326 0.753 0.736 1.47 1.225 2.129 c 0.5 0.675 1.082 1.289 1.734 1.818 a 9.234 9.234 0 0 0 2.439 1.431 l 1.218 0.351 l -0.232 0.943 l -0.082 0.284 l -0.057 0.196 l -0.025 0.119 a 0.88 0.88 0 0 1 -0.089 0.224 c -0.012 0.019 -0.027 0.038 -0.04 0.057 l -0.002 0.002 c -0.02 0.02 -0.037 0.042 -0.057 0.059 a 0.51 0.51 0 0 1 -0.832 -0.29 c -0.005 -0.027 -0.006 -0.055 -0.008 -0.081 l -0.001 -0.004 c 0.001 -0.021 0.001 -0.041 0.003 -0.061 c 0.008 -0.081 0.036 -0.159 0.057 -0.236 c 0.007 -0.057 0.008 -0.114 0.008 -0.172 a 5.82 5.82 0 0 0 -0.056 -0.722 l -0.121 0.441 a 99.43 99.43 0 0 1 -0.965 3.253 c -0.11 0.347 -0.222 0.692 -0.339 1.036 c -0.098 0.293 -0.199 0.586 -0.321 0.869 l -0.032 0.069 c -0.028 0.053 -0.033 0.064 -0.063 0.109 a 0.543 0.543 0 0 1 -0.223 0.194 a 0.514 0.514 0 0 1 -0.649 -0.189 c -0.02 -0.034 -0.026 -0.043 -0.043 -0.081 a 0.64 0.64 0 0 1 -0.041 -0.237 l 0.003 -0.056 c -0.084 0.151 -0.171 0.299 -0.262 0.445 c -0.265 0.426 -0.555 0.843 -0.902 1.206 l -0.55 0.402 l -0.029 -0.011 c -0.635 -2.062 -0.584 -2.091 -1.624 -3.982 l -1.967 -2.11 l -0.327 0.075 l -0.774 2.493 l -0.936 -1.978 l -0.42 -0.006 l -1.418 2.794 l -0.723 -2.882 l -0.283 -0.091 l -3.616 3.059 l -0.266 -1.478 l -0.341 -0.116 l -1.518 1.378 l 0.6 -2.707 l -0.642 -0.301 l -2.643 3.422 l 0.038 -0.912 l -0.273 -0.177 l -3.24 1.607 l -0.416 0.553 Z"
                                                    ></path>
                                                    <path
                                                      class="body-area body-area-ears hover_body"
                                                      body_part="ears "
                                                      gender="female"
                                                      data-original-title="Ears"
                                                      id="body-area-ears"
                                                      title=""
                                                      data-toggle="popover"
                                                      data-container="body"
                                                      data-placement="right"
                                                      type="button"
                                                      data-html="true"
                                                      href="#"
                                                      onClick={
                                                        this.attributeSymptomTag
                                                      }
                                                      d="M 65.621 18.772 l 0.437 0.033 a 7.74 7.74 0 0 1 1.829 0.496 c 0.782 0.319 1.51 0.765 2.159 1.305 c 0.498 0.414 0.949 0.884 1.346 1.395 a 9.684 9.684 0 0 1 1.054 1.694 c 1.398 2.864 1.381 6.365 -0.05 9.213 c -0.249 0.497 -0.54 0.972 -0.871 1.418 a 9.054 9.054 0 0 1 -1.479 1.57 a 8.292 8.292 0 0 1 -2.062 1.265 l -1.435 0.445 l -0.853 -6.531 a 82.473 82.473 0 0 1 -0.333 -5.328 a 60.055 60.055 0 0 1 0.048 -4.985 l 0.21 -1.99 Z m 36.252 -0.041 h 0.219 l 0.146 0.011 l 0.154 0.824 a 26.06 26.06 0 0 1 0.19 3.819 a 42.838 42.838 0 0 1 -0.326 4.442 a 64.28 64.28 0 0 1 -0.803 4.9 l -1.188 4.833 l -1.284 -0.399 a 8.292 8.292 0 0 1 -2.062 -1.265 a 9.092 9.092 0 0 1 -1.479 -1.57 a 9.663 9.663 0 0 1 -0.871 -1.418 c -1.431 -2.848 -1.448 -6.349 -0.05 -9.213 a 9.684 9.684 0 0 1 1.054 -1.694 a 9.017 9.017 0 0 1 1.346 -1.395 a 8.273 8.273 0 0 1 2.159 -1.305 a 7.74 7.74 0 0 1 1.829 -0.496 l 0.966 -0.074 Z"
                                                    ></path>
                                                    <path
                                                      class="body-area body-area-nape_of_neck hover_body"
                                                      body_part="nape_of_neck "
                                                      data-original-title="Nape of Neck"
                                                      id="body-area-nape_of_neck"
                                                      title=""
                                                      data-toggle="popover"
                                                      data-container="body"
                                                      data-placement="right"
                                                      type="button"
                                                      data-html="true"
                                                      href="#"
                                                      onClick={
                                                        this.attributeSymptomTag
                                                      }
                                                      gender="female"
                                                      d="M 65.084 53.5 l 2.041 -0.882 c 0.662 -0.296 1.325 -0.59 1.962 -0.938 c 1.722 -0.943 3.303 -2.248 4.266 -3.986 a 7.54 7.54 0 0 0 0.386 -0.806 l 0.416 -1.445 l 0.206 -0.274 l 1.801 -0.893 l -0.071 1.695 l 0.563 0.205 l 2.217 -2.87 l -0.449 2.028 l 0.518 0.301 l 2.054 -1.863 l 0.259 1.439 l 0.318 0.114 l 3.67 -3.104 l 0.864 3.446 l 0.535 0.06 l 1.575 -3.1 l 1.058 2.236 l 0.521 -0.036 l 0.909 -2.931 l 0.935 1.003 l 0.795 1.446 l 0.126 0.409 l -0.045 -0.004 a 5.449 5.449 0 0 0 0.071 0.975 c 0.222 1.341 0.936 2.551 1.811 3.568 a 12.97 12.97 0 0 0 1.051 1.073 a 16.054 16.054 0 0 0 2.141 1.621 a 19.27 19.27 0 0 0 2.713 1.437 l 0.212 0.076 H 86.857 l -0.005 -0.012 a 3.264 3.264 0 0 0 -0.351 -0.602 a 3.361 3.361 0 0 0 -1.631 -1.146 a 5.078 5.078 0 0 0 -1.458 -0.238 c -0.142 -0.002 -0.142 -0.002 -0.285 0 a 5.23 5.23 0 0 0 -1.356 0.204 a 3.552 3.552 0 0 0 -1.457 0.843 a 3.314 3.314 0 0 0 -0.566 0.749 a 3.142 3.142 0 0 0 -0.099 0.202 H 65.084 Z"
                                                    ></path>
                                                    <path
                                                      class="body-area body-area-back hover_body"
                                                      body_part="back"
                                                      data-original-title="Back"
                                                      id="body-area-back"
                                                      title=""
                                                      data-toggle="popover"
                                                      data-container="body"
                                                      data-placement="right"
                                                      type="button"
                                                      data-html="true"
                                                      href="#"
                                                      onClick={
                                                        this.attributeSymptomTag
                                                      }
                                                      gender="female"
                                                      d="M 61.646 112.5 l -0.371 -2.781 c -0.448 -2.745 -1.028 -5.468 -1.654 -8.178 c -0.164 -0.708 -0.331 -1.417 -0.501 -2.125 c -0.131 -0.55 -0.268 -1.1 -0.393 -1.653 c -0.03 -0.139 -0.057 -0.278 -0.082 -0.418 a 47.273 47.273 0 0 1 -0.311 -2.082 c -0.099 -0.747 -0.191 -1.495 -0.28 -2.244 l -0.055 -0.483 l 0.503 -4.024 l -0.031 -0.403 l -0.079 -1 a 883.057 883.057 0 0 0 -1.074 -12.372 a 461.56 461.56 0 0 0 -1.017 -9.817 c -0.156 -1.35 -0.322 -2.7 -0.505 -4.047 a 94.42 94.42 0 0 0 -0.464 -3.092 l -0.296 -1.497 l 1.571 -0.466 c 0.529 -0.081 1.059 -0.151 1.589 -0.231 a 24.981 24.981 0 0 0 1.651 -0.309 a 24.058 24.058 0 0 0 2.157 -0.609 l 0.448 -0.169 H 80.39 l 0.099 -0.395 l 0.004 -0.014 c 0.041 -0.134 0.101 -0.263 0.172 -0.384 c 0.264 -0.447 0.687 -0.774 1.166 -0.964 c 0.249 -0.098 0.51 -0.161 0.774 -0.198 a 4.5 4.5 0 0 1 0.545 -0.044 c 0.761 -0.017 1.58 0.117 2.188 0.61 a 1.99 1.99 0 0 1 0.661 0.947 l 0.102 0.442 h 17.654 l 0.857 0.183 c 0.344 0.048 0.689 0.081 1.035 0.095 c 0.343 0.015 0.686 0.009 1.03 0.015 c 0.207 0.005 0.415 0.012 0.622 0.02 c 1.169 0.054 2.344 0.166 3.484 0.442 c 0.369 0.09 0.735 0.196 1.09 0.334 l 0.026 0.013 c -0.553 1.473 -0.95 3 -1.286 4.536 c -0.558 2.552 -0.944 5.139 -1.242 7.733 c -0.434 3.777 -0.675 7.575 -0.803 11.374 c -0.061 1.8 -0.095 3.601 -0.102 5.401 c -0.005 1.295 0.003 2.59 0.035 3.885 l 0.433 4.335 l -0.296 2.01 c -0.537 3.546 -1.092 7.089 -1.63 10.634 a 437.054 437.054 0 0 0 -0.581 3.951 l -0.363 3.039 H 61.646 Z"
                                                    ></path>
                                                    <path
                                                      class="body-area body-area-upper_arm hover_body"
                                                      body_part="upper_arm "
                                                      data-original-title="Upper Arm"
                                                      id="body-area-upper_arm"
                                                      title=""
                                                      data-toggle="popover"
                                                      data-container="body"
                                                      data-placement="right"
                                                      type="button"
                                                      data-html="true"
                                                      href="#"
                                                      onClick={
                                                        this.attributeSymptomTag
                                                      }
                                                      gender="female"
                                                      d="M 54.104 56.694 l 0.325 1.754 c 0.171 1.06 0.32 2.124 0.461 3.188 c 0.18 1.372 0.345 2.746 0.501 4.12 c 0.427 3.762 0.793 7.53 1.138 11.3 c 0.348 3.809 0.673 7.619 0.969 11.432 l -0.376 3.004 l -0.177 0.424 a 664.42 664.42 0 0 1 -3.305 7.78 a 253.336 253.336 0 0 1 -1.471 3.333 a 67.673 67.673 0 0 1 -0.946 2.024 c -0.185 0.377 -0.384 0.745 -0.577 1.117 c -0.095 0.19 -0.187 0.38 -0.278 0.57 l -0.797 1.93 a 35.822 35.822 0 0 1 -5.064 -1 a 25.495 25.495 0 0 1 -2.627 -0.872 a 16.936 16.936 0 0 1 -2.109 -1 a 10.864 10.864 0 0 1 -1.636 -1.121 l -0.896 -0.915 c 0.614 -1.003 1.134 -2.062 1.603 -3.146 a 47.32 47.32 0 0 0 1.181 -3.037 a 72.46 72.46 0 0 0 1.269 -3.998 c 0.447 -1.555 0.853 -3.122 1.227 -4.695 a 128.842 128.842 0 0 0 1.531 -7.36 l 0.125 -0.722 c 0.023 -0.134 0.047 -0.267 0.066 -0.401 c 0.002 -0.013 0.001 -0.027 0.002 -0.04 l 0.01 -0.202 c 0.019 -0.35 0.022 -0.386 0.046 -0.77 c 0.026 -0.405 0.056 -0.809 0.086 -1.215 c 0.218 -2.748 0.525 -5.488 0.93 -8.214 c 0.097 -0.652 0.199 -1.302 0.309 -1.952 c 0.085 -0.509 0.169 -1.018 0.289 -1.52 c 0.167 -0.701 0.389 -1.389 0.665 -2.056 c 1.217 -2.949 3.463 -5.415 6.179 -7.058 l 1.347 -0.682 Z m 58.685 -0.659 c 0.862 0.386 1.688 0.867 2.458 1.43 a 14.472 14.472 0 0 1 2.644 2.515 c 1.978 2.419 3.164 5.395 3.834 8.424 c 0.106 0.473 0.198 0.948 0.279 1.425 c 0.116 0.686 0.211 1.377 0.283 2.069 c 0.179 1.679 0.236 3.37 0.198 5.057 a 45.004 45.004 0 0 1 -0.1 2.168 c -0.01 0.161 -0.025 0.323 -0.028 0.483 c 0 0.06 0.004 0.12 0.008 0.179 c 0.022 0.256 0.055 0.51 0.092 0.765 c 0.048 0.339 0.104 0.677 0.162 1.015 a 81.2 81.2 0 0 0 0.449 2.383 c 0.459 2.276 0.98 4.54 1.549 6.791 c 0.644 2.549 1.35 5.086 2.185 7.578 c 0.315 0.94 0.648 1.874 1.016 2.795 c 0.374 0.938 0.784 1.863 1.27 2.749 l 0.41 0.705 c -0.605 0.478 -1.27 0.909 -1.961 1.292 c -2.862 1.589 -6.128 2.349 -9.386 2.454 l -1.886 -0.019 l -0.003 -0.009 c -0.072 -0.2 -0.145 -0.399 -0.219 -0.598 a 216.173 216.173 0 0 0 -1.32 -3.409 a 825.764 825.764 0 0 0 -1.647 -4.131 l -3.199 -7.897 l -0.378 -3.78 l -0.006 -0.247 l -0.006 -0.322 c -0.05 -3.081 -0.013 -6.164 0.102 -9.243 c 0.124 -3.325 0.338 -6.648 0.696 -9.956 c 0.266 -2.465 0.61 -4.924 1.097 -7.355 c 0.357 -1.784 0.79 -3.556 1.407 -5.311 Z"
                                                    ></path>
                                                    <path
                                                      class="body-area body-area-elbow hover_body"
                                                      body_part="elbow "
                                                      data-original-title="Elbow"
                                                      id="body-area-elbow"
                                                      title=""
                                                      data-toggle="popover"
                                                      data-container="body"
                                                      data-placement="right"
                                                      type="button"
                                                      onClick={
                                                        this.attributeSymptomTag
                                                      }
                                                      gender="female"
                                                      data-html="true"
                                                      href="#"
                                                      d="M 129.998 105.426 l 0.548 0.943 c 0.937 1.637 1.845 3.289 2.669 4.986 a 53.41 53.41 0 0 1 2.363 5.644 l 0.027 0.087 c -0.611 0.526 -1.231 0.987 -1.877 1.41 c -1.345 0.879 -2.8 1.59 -4.329 2.085 c -1.43 0.462 -2.92 0.734 -4.422 0.811 a 18.13 18.13 0 0 1 -3.724 -0.198 l -0.891 -0.187 l -0.074 -0.154 a 32.995 32.995 0 0 1 -0.848 -2.06 a 53.016 53.016 0 0 1 -0.657 -1.855 a 46.116 46.116 0 0 1 -0.556 -1.786 a 21.939 21.939 0 0 1 -0.38 -1.489 a 13.22 13.22 0 0 1 -0.075 -0.397 c -0.031 -0.193 -0.053 -0.387 -0.083 -0.581 a 9.9 9.9 0 0 0 -0.062 -0.344 a 8.649 8.649 0 0 0 -0.28 -1.002 c -0.212 -0.605 -0.44 -1.206 -0.654 -1.809 l -0.09 -0.259 l 1.744 0.035 c 3.131 -0.121 6.26 -0.825 9.063 -2.248 c 0.91 -0.463 1.783 -0.999 2.588 -1.632 Z m -93.313 -0.783 l 0.317 0.354 c 0.673 0.661 1.456 1.206 2.275 1.671 c 1.21 0.687 2.51 1.207 3.833 1.629 c 0.78 0.25 1.571 0.465 2.367 0.654 c 0.931 0.22 1.871 0.405 2.814 0.563 l 0.899 0.118 l -0.847 2.606 l -0.059 0.206 l -0.034 0.126 c -0.015 0.199 -0.015 0.199 -0.032 0.397 a 19.28 19.28 0 0 1 -0.38 2.365 c -0.313 1.378 -0.776 2.718 -1.33 4.017 l -0.75 1.595 l -1.452 -0.036 a 52.072 52.072 0 0 1 -3.156 -0.256 a 38.306 38.306 0 0 1 -2.384 -0.342 a 29.001 29.001 0 0 1 -2.02 -0.429 a 22.038 22.038 0 0 1 -1.49 -0.431 c -0.423 -0.14 -0.842 -0.295 -1.252 -0.469 a 12.89 12.89 0 0 1 -0.899 -0.421 a 10.346 10.346 0 0 1 -0.752 -0.43 a 8.801 8.801 0 0 1 -0.523 -0.359 a 6.942 6.942 0 0 1 -0.663 -0.562 l -0.398 -0.486 l 0.722 -2.017 a 53.376 53.376 0 0 1 3.406 -7.19 a 48.54 48.54 0 0 1 1.227 -2.028 l 0.561 -0.845 Z"
                                                    ></path>
                                                    <path
                                                      class="body-area body-area-lower_back hover_body"
                                                      body_part="lower_back "
                                                      data-original-title="Lower Back"
                                                      id="body-area-lower_back"
                                                      title=""
                                                      data-toggle="popover"
                                                      data-container="body"
                                                      data-placement="right"
                                                      type="button"
                                                      data-html="true"
                                                      href="#"
                                                      onClick={
                                                        this.attributeSymptomTag
                                                      }
                                                      gender="female"
                                                      d="M 54.094 141.902 l 0.028 -0.26 c 0.189 -1.442 0.47 -2.871 0.812 -4.284 c 0.354 -1.463 0.774 -2.91 1.253 -4.337 a 48.622 48.622 0 0 1 1.429 -3.762 a 32.269 32.269 0 0 1 1.934 -3.843 a 16.717 16.717 0 0 0 0.984 -1.902 a 16.68 16.68 0 0 0 1.115 -3.703 c 0.086 -0.484 0.153 -0.973 0.191 -1.463 c 0.028 -0.345 0.048 -0.692 0.039 -1.038 c 0.002 -0.087 0.004 -0.086 0.01 -0.172 c 0.009 -0.125 0.014 -0.25 0.02 -0.374 c 0.038 -1.083 -0.025 -2.167 -0.127 -3.244 l -0.003 -0.02 h 44.213 l -0.082 2.558 c 0.009 0.988 0.055 1.976 0.142 2.959 c 0.074 0.841 0.177 1.68 0.334 2.509 c 0.076 0.397 0.163 0.792 0.277 1.18 c 0.08 0.269 0.17 0.54 0.3 0.789 c 0.093 0.179 0.226 0.329 0.344 0.491 c 0.08 0.115 0.158 0.23 0.235 0.345 c 0.452 0.705 0.842 1.448 1.2 2.205 c 0.365 0.773 0.697 1.56 1.006 2.357 c 0.884 2.284 1.593 4.635 2.21 7.004 c 0.197 0.762 0.388 1.526 0.558 2.295 l 0.696 3.859 l -1.508 -0.5 a 93.951 93.951 0 0 0 -9.515 -2.348 a 96.884 96.884 0 0 0 -12.013 -1.531 a 103.526 103.526 0 0 0 -7.668 -0.198 a 102.51 102.51 0 0 0 -20.629 2.351 a 90.095 90.095 0 0 0 -6.652 1.713 l -1.133 0.364 Z"
                                                    ></path>
                                                    <path
                                                      class="body-area body-area-forearm hover_body"
                                                      body_part="forearm "
                                                      data-original-title="Forearm"
                                                      id="body-area-forearm"
                                                      title=""
                                                      data-toggle="popover"
                                                      data-container="body"
                                                      data-placement="right"
                                                      type="button"
                                                      data-html="true"
                                                      href="#"
                                                      onClick={
                                                        this.attributeSymptomTag
                                                      }
                                                      gender="female"
                                                      d="M 135.931 118.12 c 0.549 1.62 0.992 3.269 1.357 4.935 c 0.142 0.652 0.273 1.308 0.393 1.965 c 0.11 0.602 0.207 1.207 0.314 1.809 a 95.84 95.84 0 0 0 0.914 4.42 c 0.602 2.58 1.31 5.135 2.088 7.666 c 0.448 1.462 0.921 2.916 1.41 4.366 c 0.401 1.194 0.814 2.385 1.219 3.579 c 0.086 0.257 0.172 0.514 0.256 0.77 c 0.087 0.265 0.17 0.532 0.259 0.797 l 0.126 0.296 l -0.426 0.329 c -1.936 1.301 -4.152 2.152 -6.436 2.6 c -0.605 0.118 -1.215 0.209 -1.835 0.268 l -0.405 -1.447 a 24.198 24.198 0 0 0 -0.864 -2.072 a 18.33 18.33 0 0 0 -0.719 -1.384 c -2.025 -4.001 -4.051 -8.003 -6.078 -12.002 c -1.994 -3.93 -3.984 -7.86 -5.995 -11.779 l -0.564 -1.087 c 1.286 0.22 2.584 0.303 3.877 0.251 a 18.28 18.28 0 0 0 4.885 -0.868 a 19.165 19.165 0 0 0 4.812 -2.362 l 1.412 -1.05 Z m -105.539 -0.306 l 0.951 0.84 c 0.238 0.171 0.484 0.331 0.736 0.48 c 0.334 0.198 0.679 0.378 1.031 0.543 c 0.404 0.19 0.817 0.36 1.236 0.514 c 0.553 0.204 1.116 0.38 1.685 0.536 c 0.662 0.181 1.332 0.334 2.006 0.465 c 0.886 0.172 1.779 0.308 2.675 0.416 c 1.049 0.126 2.103 0.216 3.159 0.277 l 1.412 0.04 l -0.998 1.929 l -0.36 0.722 a 860.791 860.791 0 0 0 -3.107 6.412 a 2832.19 2832.19 0 0 0 -6.93 14.514 l -2.289 4.89 a 26.205 26.205 0 0 1 -3.032 -0.355 c -1.127 -0.2 -2.246 -0.476 -3.315 -0.889 c -0.696 -0.268 -1.376 -0.596 -1.991 -1.021 l -0.015 -0.014 l 0.334 -0.762 c 0.085 -0.198 0.085 -0.198 0.167 -0.395 c 0.679 -1.677 1.199 -3.414 1.658 -5.162 a 78.94 78.94 0 0 0 1.188 -5.259 c 0.034 -0.18 0.063 -0.359 0.094 -0.539 c 0.072 -0.418 0.142 -0.837 0.215 -1.256 c 0.166 -0.966 0.334 -1.931 0.501 -2.897 c 0.366 -2.095 0.733 -4.19 1.118 -6.282 c 0.116 -0.632 0.234 -1.264 0.356 -1.896 a 43.313 43.313 0 0 1 0.702 -3.108 l 0.813 -2.743 Z"
                                                    ></path>
                                                    <path
                                                      class="body-area body-area-buttocks hover_body"
                                                      body_part="buttocks "
                                                      data-original-title="Buttocks"
                                                      id="body-area-buttocks"
                                                      title=""
                                                      data-toggle="popover"
                                                      data-container="body"
                                                      data-placement="right"
                                                      type="button"
                                                      data-html="true"
                                                      href="#"
                                                      onClick={
                                                        this.attributeSymptomTag
                                                      }
                                                      gender="female"
                                                      d="M 53.979 142.986 l 0.451 -0.156 a 82.109 82.109 0 0 1 3.676 -1.066 a 97.803 97.803 0 0 1 10.825 -2.21 c 10.315 -1.517 20.874 -1.473 31.156 0.284 a 93.125 93.125 0 0 1 9.338 2.092 l 3.988 1.229 l 0.161 0.895 c 0.278 1.836 0.518 3.678 0.736 5.521 c 0.48 4.039 0.858 8.088 1.205 12.141 l 0.266 3.148 c 0.043 0.503 0.087 1.007 0.128 1.511 c 0.013 0.178 0.024 0.356 0.033 0.534 l 0.028 2.831 l -0.662 0.83 c -1.513 1.688 -3.271 3.165 -5.23 4.31 a 19.059 19.059 0 0 1 -8.924 2.606 a 30.34 30.34 0 0 1 -2.297 -0.015 a 47.701 47.701 0 0 1 -3.046 -0.197 a 29.305 29.305 0 0 1 -3.693 -0.581 l -2.464 -0.785 l 0.533 -0.921 a 9.012 9.012 0 0 0 0.119 -7.205 a 8.397 8.397 0 0 0 -0.948 -1.683 a 7.938 7.938 0 0 0 -1.209 -1.322 a 7.38 7.38 0 0 0 -1.798 -1.159 a 6.914 6.914 0 0 0 -2.754 -0.617 h -0.194 a 6.914 6.914 0 0 0 -2.754 0.617 a 7.38 7.38 0 0 0 -1.798 1.159 a 7.938 7.938 0 0 0 -1.209 1.322 a 8.397 8.397 0 0 0 -0.948 1.683 a 9.012 9.012 0 0 0 0.119 7.205 l 0.442 0.765 c -0.705 0.368 -1.471 0.628 -2.244 0.838 c -1.296 0.351 -2.627 0.561 -3.961 0.698 a 42.653 42.653 0 0 1 -3.427 0.201 c -0.746 0.015 -1.493 0.021 -2.238 -0.018 a 18.954 18.954 0 0 1 -3.057 -0.41 a 16.73 16.73 0 0 1 -5.083 -2.03 c -1.87 -1.137 -3.501 -2.649 -4.818 -4.394 l -0.804 -1.221 l 0.038 -3.027 c 0.038 -1.085 0.093 -2.169 0.19 -3.251 c 0.048 -0.551 0.115 -1.099 0.181 -1.647 l 0.491 -3.968 c 0.418 -3.432 0.828 -6.867 1.138 -10.312 c 0.074 -0.81 0.14 -1.623 0.198 -2.436 c 0.036 -0.513 0.062 -1.028 0.099 -1.541 l 0.021 -0.248 Z"
                                                    ></path>
                                                    <path
                                                      class="body-area body-area-anus hover_body"
                                                      body_part="anus "
                                                      data-original-title="Anus"
                                                      id="body-area-anus"
                                                      title=""
                                                      data-toggle="popover"
                                                      data-container="body"
                                                      data-placement="right"
                                                      type="button"
                                                      data-html="true"
                                                      href="#"
                                                      onClick={
                                                        this.attributeSymptomTag
                                                      }
                                                      gender="female"
                                                      d="M 81.669 178.183 l -0.387 -0.117 a 6.312 6.312 0 0 1 -1.65 -0.992 a 6.933 6.933 0 0 1 -1.182 -1.262 a 7.423 7.423 0 0 1 -0.656 -1.089 a 7.998 7.998 0 0 1 -0.037 -6.868 c 0.219 -0.459 0.485 -0.897 0.794 -1.301 c 0.3 -0.394 0.641 -0.756 1.018 -1.076 c 0.472 -0.4 0.999 -0.734 1.566 -0.982 a 5.915 5.915 0 0 1 2.614 -0.491 a 6.01 6.01 0 0 1 2.116 0.491 a 6.387 6.387 0 0 1 1.566 0.982 c 0.377 0.32 0.718 0.682 1.018 1.076 c 0.309 0.404 0.575 0.842 0.794 1.301 a 7.998 7.998 0 0 1 -0.037 6.868 a 7.423 7.423 0 0 1 -0.656 1.089 c -0.34 0.467 -0.737 0.894 -1.182 1.262 l -1.406 0.846 l -0.195 -1.562 a 36.241 36.241 0 0 1 -0.1 -1.644 a 8.512 8.512 0 0 1 -1.742 -2.605 a 9.894 9.894 0 0 1 -0.601 -1.941 c -0.012 -0.058 -0.024 -0.116 -0.034 -0.175 l -0.01 0.05 a 9.973 9.973 0 0 1 -0.626 2.066 a 8.88 8.88 0 0 1 -0.641 1.217 c 0.04 0.182 0.056 0.372 0.065 0.559 c 0.02 0.438 -0.003 0.877 -0.035 1.315 a 32.637 32.637 0 0 1 -0.157 1.562 l -0.217 1.421 Z"
                                                    ></path>
                                                    <path
                                                      class="body-area body-area-hand hover_body"
                                                      body_part="hand "
                                                      data-original-title="Hand"
                                                      id="body-area-hand"
                                                      title=""
                                                      data-toggle="popover"
                                                      data-container="body"
                                                      data-placement="right"
                                                      type="button"
                                                      data-html="true"
                                                      href="#"
                                                      onClick={
                                                        this.attributeSymptomTag
                                                      }
                                                      gender="female"
                                                      d="M 138.474 178.074 l 0.001 0.001 c 0.001 0.003 -0.004 -0.001 -0.007 -0.003 c -0.019 -0.009 -0.038 -0.017 -0.056 -0.028 a 1.15 1.15 0 0 1 -0.319 -0.261 c -0.209 -0.245 -0.33 -0.559 -0.411 -0.868 a 7.294 7.294 0 0 1 -0.202 -1.308 a 17.792 17.792 0 0 1 -0.047 -1.366 c 0 -0.992 0.055 -1.985 0.13 -2.974 c 0.04 -0.524 0.092 -1.047 0.128 -1.573 c 0.01 -0.174 0.018 -0.349 0.022 -0.523 a 8.596 8.596 0 0 0 -0.011 -0.7 c -0.003 -0.055 -0.008 -0.106 -0.013 -0.159 c -0.004 -0.036 -0.005 -0.08 -0.015 -0.114 a 15.907 15.907 0 0 0 -0.048 -0.159 c -0.14 -0.454 -0.282 -0.906 -0.419 -1.36 a 32.52 32.52 0 0 1 -0.627 -2.419 a 23.135 23.135 0 0 1 -0.498 -3.878 a 21.453 21.453 0 0 1 0.086 -2.967 c 0.02 -0.193 0.042 -0.386 0.057 -0.578 c 0.008 -0.114 0.015 -0.227 0.02 -0.339 a 12.418 12.418 0 0 0 -0.406 -3.619 l 1.522 -0.201 c 2.498 -0.46 4.925 -1.376 7.038 -2.796 l 0.272 -0.21 l 0.646 1.519 c 0.297 0.568 0.624 1.123 1.007 1.636 c 0.385 0.197 0.769 0.398 1.153 0.599 c 0.35 0.185 0.701 0.372 1.049 0.563 c 0.265 0.147 0.531 0.294 0.791 0.451 c 0.264 0.159 0.524 0.33 0.777 0.506 c 0.35 0.245 0.69 0.506 1.007 0.793 c 0.27 0.245 0.526 0.511 0.739 0.808 c 0.153 0.214 0.285 0.445 0.368 0.693 c 0.03 0.093 0.054 0.186 0.071 0.281 c 0.012 0.071 0.016 0.142 0.025 0.214 l 0.026 0.126 c 0.06 0.227 0.147 0.444 0.242 0.657 c 0.109 0.242 0.23 0.48 0.357 0.713 c 0.315 0.58 0.665 1.141 1.03 1.691 l 0.056 0.083 c 0.079 0.09 0.157 0.182 0.233 0.275 a 4.705 4.705 0 0 1 0.49 0.724 c 0.031 0.058 0.06 0.116 0.086 0.175 c 0.159 0.351 0.252 0.777 0.095 1.147 a 0.967 0.967 0 0 1 -0.098 0.182 a 0.84 0.84 0 0 1 -0.175 0.187 a 0.89 0.89 0 0 1 -0.162 0.097 a 3.286 3.286 0 0 1 -0.253 0.105 a 2.428 2.428 0 0 1 -0.571 0.131 a 2.508 2.508 0 0 1 -0.792 -0.044 c -0.544 -0.116 -1.039 -0.396 -1.472 -0.739 a 5.542 5.542 0 0 1 -0.308 -0.263 c 0.089 0.338 0.185 0.675 0.285 1.01 c 0.471 1.573 1.039 3.116 1.641 4.643 c 0.168 0.426 0.339 0.851 0.511 1.277 c 0.145 0.356 0.293 0.711 0.433 1.07 a 7.005 7.005 0 0 1 0.248 0.788 c 0.13 0.53 0.188 1.08 0.139 1.624 a 3.458 3.458 0 0 1 -0.18 0.847 c -0.07 0.198 -0.163 0.399 -0.302 0.558 a 1.078 1.078 0 0 1 -0.245 0.196 a 1.063 1.063 0 0 1 -0.287 0.126 a 0.872 0.872 0 0 1 -0.209 0.03 c -0.439 0.012 -0.805 -0.284 -1.076 -0.601 a 5.448 5.448 0 0 1 -0.567 -0.829 c -0.294 -0.516 -0.578 -1.039 -0.862 -1.56 c -0.496 -0.907 -0.986 -1.817 -1.468 -2.731 l -0.018 -0.037 c 0.074 0.272 0.073 0.272 0.145 0.544 c 0.068 0.274 0.068 0.273 0.134 0.548 c 0.233 0.995 0.428 1.997 0.591 3.005 c 0.055 0.345 0.108 0.69 0.159 1.035 c 0.041 0.282 0.079 0.565 0.125 0.847 c 0.019 0.099 0.038 0.199 0.059 0.298 c 0.115 0.51 0.262 1.009 0.393 1.514 c 0.028 0.12 0.057 0.24 0.082 0.36 c 0.077 0.386 0.137 0.807 -0.007 1.185 a 1.046 1.046 0 0 1 -0.153 0.273 c -0.336 0.431 -0.968 0.497 -1.459 0.335 a 1.68 1.68 0 0 1 -0.298 -0.13 c -0.314 -0.172 -0.575 -0.427 -0.796 -0.706 c -0.369 -0.466 -0.636 -1.003 -0.852 -1.553 l -0.03 -0.082 c -0.063 -0.181 -0.118 -0.364 -0.177 -0.545 l -0.413 -1.306 c -0.294 -0.931 -0.583 -1.864 -0.866 -2.798 l -0.373 -1.242 c -0.067 -0.215 -0.066 -0.215 -0.136 -0.428 a 11.309 11.309 0 0 0 -0.391 -1.015 l -0.008 -0.017 c 0.035 0.896 0.115 1.79 0.208 2.681 c 0.11 1.039 0.243 2.076 0.404 3.108 c 0.054 0.342 0.111 0.683 0.172 1.023 c 0.039 0.22 0.082 0.44 0.119 0.661 l 0.047 0.312 c 0.069 0.529 0.114 1.066 0.062 1.6 c -0.033 0.349 -0.108 0.704 -0.276 1.014 c -0.079 0.147 -0.18 0.282 -0.303 0.395 a 1.218 1.218 0 0 1 -0.344 0.223 a 1.129 1.129 0 0 1 -0.732 0.049 c -0.382 -0.108 -0.663 -0.422 -0.87 -0.748 a 3.143 3.143 0 0 1 -0.119 -0.202 a 7.198 7.198 0 0 1 -0.505 -1.214 a 16.851 16.851 0 0 1 -0.407 -1.479 a 32.212 32.212 0 0 1 -0.568 -3.258 c -0.069 -0.557 -0.114 -1.115 -0.169 -1.673 c -0.02 -0.192 -0.042 -0.384 -0.065 -0.575 c -0.074 -0.584 -0.155 -1.174 -0.335 -1.737 l -0.027 -0.078 l -0.007 -0.018 a 5.073 5.073 0 0 0 -0.085 0.291 c -0.156 0.616 -0.245 1.247 -0.322 1.877 a 46.329 46.329 0 0 0 -0.196 2.068 c -0.026 0.35 -0.048 0.7 -0.075 1.05 c -0.014 0.163 -0.03 0.326 -0.048 0.488 c -0.062 0.526 -0.142 1.052 -0.305 1.557 c -0.094 0.293 -0.217 0.586 -0.412 0.827 a 1.202 1.202 0 0 1 -0.318 0.285 a 0.953 0.953 0 0 1 -0.309 0.123 a 0.878 0.878 0 0 1 -0.52 -0.052 l -0.081 -0.039 Z M 22.839 149.041 c 0.382 0.26 0.782 0.478 1.19 0.671 c 1.166 0.552 2.416 0.916 3.677 1.178 c 1.158 0.241 2.331 0.394 3.518 0.471 l -0.202 0.747 c -0.058 0.321 -0.099 0.645 -0.13 0.97 a 23.52 23.52 0 0 0 -0.069 3.096 l 0.004 0.083 c 0.032 0.09 0.061 0.18 0.09 0.269 c 0.037 0.117 0.07 0.234 0.103 0.352 c 0.396 1.528 0.395 3.136 0.204 4.696 c -0.253 2.07 -0.804 4.093 -1.51 6.052 l -0.065 0.175 l -0.089 0.241 c 0.025 0.797 0.057 1.596 0.086 2.394 c 0.056 1.499 0.129 2.996 0.165 4.496 c 0.008 0.518 -0.008 1.042 -0.114 1.551 c -0.065 0.314 -0.165 0.628 -0.343 0.898 a 1.23 1.23 0 0 1 -0.581 0.49 a 0.916 0.916 0 0 1 -0.498 0.05 a 1.168 1.168 0 0 1 -0.802 -0.481 a 2.373 2.373 0 0 1 -0.359 -0.744 a 6.84 6.84 0 0 1 -0.234 -1.203 c -0.024 -0.213 -0.041 -0.426 -0.06 -0.64 c -0.02 -0.233 -0.043 -0.464 -0.066 -0.696 c -0.133 -1.27 -0.566 -3.119 -0.607 -2.778 a 302.81 302.81 0 0 1 -0.601 4.437 c -0.032 0.222 -0.066 0.444 -0.102 0.665 a 16.87 16.87 0 0 1 -0.275 1.334 a 7.63 7.63 0 0 1 -0.269 0.863 c -0.149 0.38 -0.344 0.768 -0.66 1.036 a 1.358 1.358 0 0 1 -0.816 0.324 a 1.577 1.577 0 0 1 -0.266 0.007 a 1.07 1.07 0 0 1 -0.407 -0.116 a 1.337 1.337 0 0 1 -0.584 -0.638 a 2.05 2.05 0 0 1 -0.16 -1.102 c 0.009 -0.082 0.024 -0.161 0.041 -0.24 c 0.014 -0.063 0.031 -0.125 0.043 -0.187 c 0.009 -0.044 0.016 -0.088 0.022 -0.132 c 0.058 -0.462 0.078 -0.927 0.099 -1.391 c 0.029 -0.735 0.055 -1.47 0.086 -2.204 c 0.025 -0.545 0.054 -1.09 0.099 -1.634 c 0.03 -0.357 0.07 -0.713 0.104 -1.069 l 0.029 -0.398 l 0.007 -0.128 l -0.047 0.176 a 80.302 80.302 0 0 0 -0.836 3.469 c -0.083 0.38 -0.159 0.763 -0.238 1.144 l -0.058 0.244 a 5.235 5.235 0 0 1 -0.433 1.12 c -0.34 0.625 -0.85 1.166 -1.5 1.467 a 2.728 2.728 0 0 1 -0.353 0.134 a 1.446 1.446 0 0 1 -0.245 0.054 c -0.146 0.016 -0.298 0 -0.438 -0.048 a 0.886 0.886 0 0 1 -0.359 -0.227 a 1.043 1.043 0 0 1 -0.177 -0.249 c -0.138 -0.268 -0.171 -0.578 -0.173 -0.876 c 0 -0.243 0.024 -0.486 0.056 -0.727 c 0.04 -0.298 0.094 -0.593 0.154 -0.888 c 0.056 -0.272 0.115 -0.542 0.169 -0.814 c 0.016 -0.091 0.033 -0.181 0.046 -0.273 c 0.013 -0.112 0.022 -0.224 0.034 -0.336 c 0.014 -0.118 0.03 -0.236 0.045 -0.353 c 0.085 -0.606 0.18 -1.21 0.287 -1.81 c 0.075 -0.424 0.153 -0.847 0.25 -1.266 l 0.034 -0.143 l -0.119 0.38 c -0.154 0.466 -0.318 0.929 -0.535 1.37 a 4.008 4.008 0 0 1 -0.651 0.976 a 3.49 3.49 0 0 1 -0.295 0.275 a 2.44 2.44 0 0 1 -0.619 0.395 a 1.012 1.012 0 0 1 -0.379 0.079 a 0.784 0.784 0 0 1 -0.623 -0.297 a 1.042 1.042 0 0 1 -0.194 -0.433 c -0.016 -0.073 -0.02 -0.146 -0.029 -0.22 l 0.001 0.025 a 2.8 2.8 0 0 1 -0.026 -0.177 a 6.417 6.417 0 0 1 0.025 -1.336 c 0.063 -0.605 0.168 -1.206 0.286 -1.802 c 0.257 -1.294 0.586 -2.573 0.942 -3.842 c 0.11 -0.395 0.225 -0.79 0.344 -1.183 l 0.098 -0.316 c 0.032 -0.103 0.067 -0.203 0.094 -0.307 c 0.025 -0.101 0.047 -0.204 0.069 -0.306 c 0.141 -0.722 0.255 -1.45 0.366 -2.176 l 0.086 -0.571 c -0.153 0.172 -0.31 0.338 -0.474 0.498 c -0.31 0.301 -0.642 0.581 -1.006 0.813 c -0.551 0.351 -1.195 0.596 -1.858 0.533 a 2.174 2.174 0 0 1 -0.673 -0.175 c -0.068 -0.029 -0.14 -0.059 -0.201 -0.103 a 0.971 0.971 0 0 1 -0.381 -0.722 c -0.02 -0.282 0.058 -0.563 0.172 -0.817 c 0.196 -0.433 0.494 -0.816 0.806 -1.17 a 37.582 37.582 0 0 0 1.15 -1.931 c 0.08 -0.146 0.158 -0.294 0.233 -0.442 c 0.043 -0.084 0.083 -0.17 0.127 -0.253 l 0.044 -0.072 c 0.102 -0.145 0.226 -0.272 0.353 -0.394 c 0.126 -0.121 0.256 -0.237 0.388 -0.351 c 0.373 -0.325 0.76 -0.636 1.149 -0.942 c 0.794 -0.626 1.603 -1.235 2.414 -1.838 c 0.359 -0.268 0.721 -0.534 1.082 -0.8 c 0.121 -0.09 0.246 -0.18 0.365 -0.274 a 1.855 1.855 0 0 0 0.312 -0.319 c 0.023 -0.031 0.053 -0.064 0.068 -0.099 c 0.011 -0.024 0.014 -0.051 0.021 -0.075 c 0.009 -0.033 0.022 -0.081 0.029 -0.115 c 0.035 -0.146 0.066 -0.292 0.105 -0.437 c 0.023 -0.085 0.048 -0.169 0.073 -0.253 c 0.186 -0.578 0.419 -1.14 0.655 -1.699 l 0.29 -0.66 Z"
                                                    ></path>
                                                    <path
                                                      class="body-area body-area-thigh hover_body "
                                                      body_part="thigh "
                                                      data-original-title="Thigh"
                                                      id="body-area-thigh"
                                                      title=""
                                                      data-toggle="popover"
                                                      data-container="body"
                                                      data-placement="right"
                                                      type="button"
                                                      data-html="true"
                                                      href="#"
                                                      onClick={
                                                        this.attributeSymptomTag
                                                      }
                                                      gender="female"
                                                      d="M 51.621 171.227 l 0.008 0.012 a 18.41 18.41 0 0 0 4.916 4.535 a 17.678 17.678 0 0 0 5.443 2.235 c 1.098 0.25 2.219 0.4 3.344 0.46 c 0.77 0.041 1.541 0.035 2.311 0.019 a 42.277 42.277 0 0 0 3.731 -0.229 a 29.678 29.678 0 0 0 2.036 -0.29 c 1.058 -0.19 2.108 -0.443 3.12 -0.808 c 0.45 -0.163 0.895 -0.347 1.306 -0.567 l 1.158 1.251 a 7.31 7.31 0 0 0 1.999 1.182 l 0.524 0.15 l -0.437 2.852 c -0.376 2.17 -0.783 4.335 -1.193 6.499 c -0.273 1.441 -0.548 2.881 -0.819 4.321 c -0.137 0.729 -0.271 1.458 -0.402 2.188 a 68.966 68.966 0 0 0 -0.33 1.976 c -0.106 0.718 -0.194 1.44 -0.278 2.161 c -0.09 0.78 -0.174 1.562 -0.253 2.344 c -0.19 1.877 -0.362 3.755 -0.525 5.634 a 892.182 892.182 0 0 0 -1.042 13.277 c -0.082 1.148 -0.164 2.297 -0.243 3.445 c -0.05 0.717 -0.098 1.433 -0.15 2.148 c -0.025 0.318 -0.05 0.635 -0.077 0.952 c -0.115 1.266 -0.254 2.53 -0.474 3.781 c -0.172 0.976 -0.391 1.948 -0.721 2.884 c -0.177 0.5 -0.386 0.988 -0.629 1.459 c -0.117 0.224 -0.237 0.445 -0.36 0.665 c -0.07 0.125 -0.143 0.249 -0.209 0.378 a 5.512 5.512 0 0 0 -0.097 0.222 c -0.142 0.362 -0.252 0.735 -0.354 1.111 l -0.355 1.465 a 74.161 74.161 0 0 1 -7.451 -0.457 a 53 53 0 0 1 -3.781 -0.561 a 35.15 35.15 0 0 1 -3.36 -0.789 a 22.003 22.003 0 0 1 -2.419 -0.848 l -1.375 -0.693 l 0.353 -1.56 c 0.171 -0.989 0.306 -1.985 0.42 -2.983 a 87.62 87.62 0 0 0 0.279 -2.843 c 0.028 -0.355 0.054 -0.709 0.08 -1.063 c 0.017 -0.247 0.034 -0.494 0.04 -0.742 c 0.015 -0.646 0.001 -1.292 -0.016 -1.937 c -0.025 -0.964 -0.064 -1.927 -0.108 -2.889 a 433.545 433.545 0 0 0 -0.391 -7.121 a 866.807 866.807 0 0 0 -0.815 -11.728 a 690.223 690.223 0 0 0 -1.014 -12.097 a 313.397 313.397 0 0 0 -0.369 -3.728 c -0.094 -0.885 -0.193 -1.77 -0.284 -2.654 c -0.05 -0.511 -0.099 -1.021 -0.146 -1.531 c -0.341 -3.825 -0.559 -7.66 -0.591 -11.488 Z m 64.311 0.113 l -0.072 2.173 a 288.66 288.66 0 0 1 -0.574 9.016 a 706.382 706.382 0 0 1 -1.683 18.434 c -0.11 1.067 -0.221 2.134 -0.337 3.201 c -0.09 0.836 -0.184 1.672 -0.272 2.509 c -0.056 0.551 -0.111 1.103 -0.162 1.655 a 252.089 252.089 0 0 0 -0.553 7.367 a 315.123 315.123 0 0 0 -0.332 6.517 c -0.074 1.83 -0.133 3.66 -0.157 5.491 a 72.443 72.443 0 0 0 -0.003 2.032 c 0.006 0.503 0.016 1.009 0.063 1.51 c 0.04 0.415 0.102 0.827 0.171 1.237 l 0.246 1.322 l -3.611 1.59 a 45.38 45.38 0 0 1 -5.604 1.674 a 54.947 54.947 0 0 1 -7.347 1.174 l -1.648 0.11 l -0.632 -1.79 c -0.217 -0.552 -0.448 -1.097 -0.678 -1.643 c -0.064 -0.157 -0.064 -0.157 -0.126 -0.315 a 20.93 20.93 0 0 1 -1.032 -3.923 a 27.31 27.31 0 0 1 -0.346 -2.993 l -0.003 -0.047 l -0.538 -9.668 c -0.064 -1.443 -0.132 -2.886 -0.199 -4.33 a 880.057 880.057 0 0 0 -0.439 -8.434 c -0.06 -1.034 -0.123 -2.069 -0.194 -3.102 c -0.049 -0.699 -0.098 -1.399 -0.177 -2.095 a 73.72 73.72 0 0 0 -0.437 -3.108 a 254.406 254.406 0 0 0 -0.742 -4.447 c -0.685 -3.934 -1.425 -7.857 -2.138 -11.786 c -0.082 -0.456 -0.163 -0.912 -0.242 -1.369 l -0.039 -0.318 a 7.117 7.117 0 0 0 1.911 -1.139 l 1.013 -1.095 l 2.708 0.879 c 0.536 0.128 1.077 0.235 1.62 0.327 c 0.707 0.12 1.418 0.214 2.131 0.289 c 1.112 0.117 2.228 0.187 3.345 0.226 c 0.79 0.027 1.581 0.046 2.371 0.014 a 20.56 20.56 0 0 0 3.362 -0.411 a 20.146 20.146 0 0 0 6.225 -2.447 a 22.242 22.242 0 0 0 5.151 -4.287 Z"
                                                    ></path>
                                                    <path
                                                      class="body-area body-area-lower_leg hover_body "
                                                      body_part="lower_leg "
                                                      data-original-title="Lower Leg"
                                                      id="body-area-lower_leg"
                                                      title=""
                                                      data-toggle="popover"
                                                      data-container="body"
                                                      data-placement="right"
                                                      type="button"
                                                      data-html="true"
                                                      href="#"
                                                      tabindex="0"
                                                      type="button"
                                                      onClick={
                                                        this.attributeSymptomTag
                                                      }
                                                      gender="female"
                                                      d="M 115.734 297.5 h -10.438 l -0.016 -0.188 a 48.699 48.699 0 0 0 -0.434 -2.49 a 103.32 103.32 0 0 0 -0.787 -3.605 a 142.549 142.549 0 0 0 -0.89 -3.577 l -0.026 -0.101 c -0.707 -2.352 -1.411 -4.704 -2.115 -7.057 c -0.607 -2.033 -1.211 -4.066 -1.813 -6.101 c -0.414 -1.401 -0.825 -2.803 -1.236 -4.205 c -0.127 -0.441 -0.257 -0.883 -0.381 -1.325 c -0.358 -1.305 -0.594 -2.64 -0.791 -3.977 a 88.428 88.428 0 0 1 -0.574 -5.079 c -0.253 -2.886 -0.418 -5.778 -0.551 -8.672 c -0.08 -1.729 -0.145 -3.459 -0.219 -5.188 c -0.016 -0.333 -0.031 -0.667 -0.05 -1.001 a 24.278 24.278 0 0 0 -0.293 -2.522 l -0.737 -3.059 c 2.956 -0.211 5.813 -0.612 8.619 -1.247 a 46.643 46.643 0 0 0 6.003 -1.775 a 32.128 32.128 0 0 0 3.482 -1.515 l 0.515 2.359 c 0.478 2.075 0.969 4.148 1.449 6.224 c 0.413 1.805 0.821 3.612 1.201 5.424 c 0.25 1.189 0.499 2.38 0.702 3.579 a 51.15 51.15 0 0 1 0.465 3.464 c 0.24 2.381 0.317 4.777 0.286 7.17 c -0.025 1.804 -0.118 3.606 -0.188 5.408 c -0.011 0.32 -0.021 0.639 -0.027 0.958 c -0.002 0.168 -0.004 0.336 -0.003 0.504 c 0.001 0.222 0.008 0.444 0.009 0.668 c -0.001 0.232 -0.004 0.464 -0.009 0.698 a 154.689 154.689 0 0 1 -0.149 3.909 a 711.5 711.5 0 0 1 -0.305 5.832 c -0.186 3.327 -0.377 6.652 -0.562 9.979 c -0.054 0.992 -0.107 1.985 -0.154 2.978 c -0.047 1.002 -0.1 2.007 -0.042 3.01 l 0.059 0.52 Z m -53.6 0 h -10.75 l 0.057 -0.852 c 0.03 -0.787 0.031 -1.575 0.007 -2.362 c -0.243 -6.029 -0.885 -12.034 -1.327 -18.051 a 188.909 188.909 0 0 1 -0.255 -4.188 c -0.242 -4.974 -0.268 -9.964 0.04 -14.936 c 0.148 -2.378 0.374 -4.752 0.702 -7.112 c 0.321 -2.308 0.74 -4.605 1.298 -6.868 a 49.913 49.913 0 0 1 1.091 -3.794 c 0.137 -0.412 0.28 -0.822 0.429 -1.23 c 0.136 -0.376 0.278 -0.752 0.412 -1.129 c 0.035 -0.104 0.069 -0.206 0.101 -0.311 l 0.018 -0.08 l 1.211 0.618 c 0.761 0.322 1.543 0.593 2.334 0.829 c 1.114 0.334 2.248 0.599 3.389 0.82 c 1.362 0.264 2.735 0.465 4.114 0.622 a 74.38 74.38 0 0 0 7.372 0.458 l -0.52 2.725 a 112.02 112.02 0 0 0 -0.633 4.308 a 98.359 98.359 0 0 0 -0.437 4.049 a 67.965 67.965 0 0 0 -0.14 1.908 c -0.036 0.602 -0.063 1.204 -0.095 1.806 l -0.073 1.188 a 157.238 157.238 0 0 1 -0.618 7.026 a 104.5 104.5 0 0 1 -0.317 2.559 c -0.1 0.727 -0.207 1.454 -0.342 2.175 c -0.092 0.483 -0.211 0.959 -0.332 1.436 c -0.144 0.575 -0.293 1.148 -0.442 1.721 c -0.429 1.646 -0.863 3.29 -1.3 4.933 a 2795.63 2795.63 0 0 1 -2.498 9.339 c -0.446 1.652 -0.888 3.307 -1.347 4.957 c -0.061 0.21 -0.123 0.42 -0.182 0.631 a 30.173 30.173 0 0 0 -0.851 4.232 c -0.104 0.848 -0.167 1.706 -0.116 2.573 Z"
                                                    ></path>
                                                    {/* <div id="lower_leg" className={this.state.lower_leg ? this.state.lower_leg : "" } >
                                                    <ul class="list-group">
                                                      {this.state.icd_code_data
                                                        ? this.state.icd_code_data.map(
                                                            (icdarr, num) => {
                                                              return (
                                                                <li
                                                                  class="list-group-item lower_leg"
                                                                  id={icdarr.id}
                                                                  data_value={
                                                                    icdarr
                                                                  }
                                                                >
                                                                  {
                                                                    icdarr.description
                                                                  }{" "}
                                                                </li>
                                                              );
                                                            }
                                                          )
                                                        : "No result Found"}
                                                    </ul>
                                                  </div>  */}

                                                    <path
                                                      class="body-area body-area-foot hover_body "
                                                      body_part="foot "
                                                      data-original-title="Foot"
                                                      id="body-area-foot"
                                                      title=""
                                                      data-toggle="popover"
                                                      onClick={
                                                        this.attributeSymptomTag
                                                      }
                                                      gender="female"
                                                      data-container="body"
                                                      data-placement="right"
                                                      type="button"
                                                      data-html="true"
                                                      href="#"
                                                      tabindex="0"
                                                      type="button"
                                                      d="M 115.848 298.5 c 0.088 0.67 0.24 1.362 0.435 2.042 a 19.686 19.686 0 0 0 0.726 2.057 c 0.213 0.48 0.472 0.94 0.707 1.409 l 0.118 0.247 c 0.107 0.237 0.21 0.476 0.293 0.723 c 0.124 0.366 0.21 0.745 0.251 1.129 c 0.021 0.205 0.031 0.41 0.022 0.615 c -0.021 0.446 -0.122 0.885 -0.245 1.312 c -0.152 0.531 -0.34 1.05 -0.515 1.574 a 24.98 24.98 0 0 0 -0.166 0.53 a 6.438 6.438 0 0 0 -0.187 0.811 c -0.041 0.281 -0.053 0.564 0.007 0.843 c 0.052 0.206 0.113 0.411 0.167 0.617 c 0.171 0.673 0.319 1.352 0.371 2.046 a 6.524 6.524 0 0 1 -0.445 2.927 a 3.418 3.418 0 0 1 -0.204 0.449 a 2.909 2.909 0 0 1 -0.537 0.682 a 4.314 4.314 0 0 1 -1.181 0.769 a 7.66 7.66 0 0 1 -1.785 0.538 c -0.732 0.135 -1.48 0.191 -2.225 0.178 a 7.676 7.676 0 0 1 -1.555 -0.158 a 5.895 5.895 0 0 1 -1.947 -0.822 a 5.03 5.03 0 0 1 -1.152 -1.021 a 3.707 3.707 0 0 1 -0.759 -1.489 a 3.117 3.117 0 0 1 -0.082 -0.887 c 0.009 -0.195 0.041 -0.386 0.059 -0.579 c 0.01 -0.116 0.018 -0.231 0.025 -0.348 c 0.024 -0.483 0.029 -0.968 0.023 -1.452 l -0.12 -0.017 c -0.201 -0.03 -0.4 -0.073 -0.594 -0.133 a 3.74 3.74 0 0 1 -1.894 -1.326 a 3.46 3.46 0 0 1 -0.444 -0.753 l -0.017 -0.051 a 7.296 7.296 0 0 1 -0.144 -0.715 c -0.156 -1.001 -0.126 -2.075 0.335 -2.996 a 3.237 3.237 0 0 1 0.616 -0.857 a 3.272 3.272 0 0 1 1.116 -0.734 a 2.35 2.35 0 0 1 0.358 -0.11 a 0.652 0.652 0 0 1 0.108 -0.006 l 0.033 0.003 v -0.003 c -0.027 -0.151 -0.027 -0.151 -0.05 -0.302 a 12.752 12.752 0 0 1 -0.103 -0.954 c -0.067 -0.946 -0.037 -1.897 0.03 -2.843 c 0.026 -0.384 0.061 -0.77 0.098 -1.154 c 0.021 -0.203 0.046 -0.407 0.061 -0.611 c 0.005 -0.087 0.008 -0.174 0.009 -0.262 l -0.081 -0.918 h 10.464 Z m -53.646 0 l 0.071 0.516 c 0.03 0.152 0.068 0.301 0.104 0.45 a 21.617 21.617 0 0 1 0.222 1.018 c 0.152 0.81 0.264 1.635 0.253 2.461 a 5.39 5.39 0 0 1 -0.062 0.783 c -0.013 0.086 -0.03 0.173 -0.051 0.258 c -0.011 0.046 -0.021 0.092 -0.04 0.135 c -0.03 0.07 -0.068 0.134 -0.102 0.201 a 2.94 2.94 0 0 0 -0.084 0.192 a 7.209 7.209 0 0 0 -0.243 0.79 l -0.031 0.121 c 0.191 0.051 0.38 0.104 0.57 0.157 a 3.196 3.196 0 0 1 1.346 0.812 c 0.143 0.144 0.271 0.3 0.386 0.467 c 0.586 0.846 0.716 1.923 0.622 2.925 a 8.08 8.08 0 0 1 -0.126 0.849 l -0.044 0.201 c -0.016 0.07 -0.03 0.137 -0.059 0.203 c -0.113 0.26 -0.263 0.501 -0.432 0.727 a 3.762 3.762 0 0 1 -2.596 1.472 a 1.043 1.043 0 0 1 -0.209 0.011 c -0.163 -0.023 -0.325 -0.052 -0.488 -0.081 c -0.071 0.855 -0.134 1.713 -0.193 2.569 l -0.03 0.446 l -0.008 0.063 c -0.014 0.076 -0.03 0.15 -0.047 0.225 a 3.259 3.259 0 0 1 -0.279 0.713 a 3.192 3.192 0 0 1 -0.241 0.379 c -0.553 0.747 -1.396 1.221 -2.261 1.515 a 8.674 8.674 0 0 1 -1.037 0.273 a 10.364 10.364 0 0 1 -1.883 0.192 a 12.529 12.529 0 0 1 -3.078 -0.329 a 3.53 3.53 0 0 1 -0.352 -0.099 a 2.342 2.342 0 0 1 -1.016 -0.733 c -0.298 -0.364 -0.503 -0.797 -0.654 -1.24 c -0.231 -0.679 -0.344 -1.396 -0.408 -2.108 a 20.496 20.496 0 0 1 -0.057 -2.466 c 0.031 -1.067 0.121 -2.132 0.236 -3.194 c 0.064 -0.587 0.14 -1.172 0.202 -1.76 a 2.69 2.69 0 0 0 0.017 -0.219 c -0.002 -0.138 -0.026 -0.274 -0.048 -0.41 c -0.047 -0.259 -0.098 -0.516 -0.144 -0.775 a 8.713 8.713 0 0 1 -0.127 -1.194 a 6.15 6.15 0 0 1 0.532 -2.717 c 0.086 -0.193 0.187 -0.378 0.274 -0.569 c 0.041 -0.096 0.08 -0.191 0.116 -0.289 c 0.174 -0.474 0.294 -0.968 0.387 -1.464 c 0.089 -0.476 0.154 -0.956 0.204 -1.437 l 0.003 -0.04 h 10.885 Z"
                                                    ></path>
                                                  </g>
                                                </svg>
                                                {/* <!--bcak-->  */}
                                              </div>
                                              <p>click on the body modal</p>
                                            </div>
                                            <div
                                              class="female_rotate_modal"
                                              value=""
                                              onClick={this.femaleswitch}
                                            >
                                              <img src="../images/patient/img/Patient Intake Process/rotatemodel.svg" />
                                              <p> Rotate modal</p>
                                            </div>
                                          </div>
                                        </div>                  
                                  )}

                                </div></div>
                                </div>


                              </div>
                            </div>
                            {/* </form> */}
                          </div>
                        </div>
                      </div>
                    </div>

                   
                  </div>
                  <div class={this.state.shownextbuttons}>
                      <button
                        type="button"
                        class="gen_btn"
                        href="#doctorvideo"
                        data-toggle="tab"
                        onClick={this.createPatientSymptoms}
                      >
                        {" "}
                        {translate("Save")}{" "}
                      </button>
                      &nbsp;
                      <button
                        type="button"
                        class="gen_btn"
                        href="#doctorvideo"
                        data-toggle="tab"
                        onClick={this.handleClick}
                      >
                        Next{" "}
                        <img src="../images/patient/img/Medical details/arrow.svg" />
                      </button>
                    </div>
                  <div class="next_btn"></div>

                  <div class={this.state.showprescription}>
                    <div class="diagnosis_test_section">
                      <div class="diagnosis_test_head">
                        <h2>Diagnosis Test </h2>
                      </div>
                      <div class="diagnosis_test_details">
                        
                        {/* <input type="text" class="form-control diag_test_input" placeholder="Enter Lab Test" /> */}
                        <Multiselect
                          onChange={this.handleChange.bind(this, "diagnostics")}
                          name="diagnostics"
                          options={this.state.diagnosticsOptions} // Options to display in the dropdown
                          //value={this.state.selectedDiagnosticsList || ""}
                          //selectedValues // Preselected value to persist in dropdown
                          selectedValues={this.state.diagnosticsArrays}
                          onSelect={this.onDiagnosticsSelect} // Function will trigger on select event
                          placeholder="Select Diagnosis test"
                          onRemove={this.onDiagnosticsRemove} // Function will trigger on remove event
                          displayValue="labtest_name" // Property name to display in the dropdown options
                        />
                        <button
                          class="save_button save_txt"
                          onClick={this.saveDiagnosis}
                        >
                          Save
                        </button>
                      </div>
                    </div>
                    <div class="write_presc_section">
                      <div class="write_presc_head">
                        <div class="panel with-nav-tabs panel-default">
                          <div class="panel-heading">
                            <ul class="nav nav-tabs">
                              <li   class="active">
                                <a
                                 id="writePrescripton"
                                  href="#tab1default"
                                  onClick={this.writePresc}
                                  data-toggle="tab"
                                >
                                  Write Prescription
                                </a>
                              </li>
                              <p>or</p>
                              <li>
                                <a href="#tab2default" data-toggle="tab" id="loadPrescription" onClick={this.showMedicinesPrescriptions}>
                                  Upload Prescription
                                </a>
                              </li>
                            </ul>
                          </div>
                        </div>
                      </div>
                      <div class="write_presc_details">
                        <div class="panel-body">
                          <div class="tab-content">
                            <div class="tab-pane active" id="tab1default">
                              <div class="table-responsive">
                                <table class="table ">
                                  <thead>
                                    <tr>
                                      <th>Drug Name</th>
                                      <th scope="col" colspan="3">
                                        Dosage
                                      </th>
                                      <th scope="col">Time and Duration</th>
                                      <th scope="col">Modify</th>
                                    </tr>
                                    <tr>
                                      <th scope="col"></th>
                                      <th scope="col">M</th>
                                      <th scope="col">D</th>
                                      <th scope="col">N</th>
                                      <th scope="col"></th>
                                      <th scope="col"></th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {medicineslistarray}

                                    {/* <tr>
                  <td>Dolo Tablet 650</td>
                  <td >1</td>
                  <td>
                    <p class="dos_value">0</p>
                  <h5 class="dos_time">After Food</h5>
                  </td>
                  <td>1</td>
                  <td>Daily 2 Months</td>
                  <td>
                    <p class="tab_edit"><img src="https://www.flaticon.com/svg/static/icons/svg/61/61456.svg"/>Edit</p>
                  <p class="tab_del"><img src="https://www.iconsdb.com/icons/preview/red/delete-xxl.png"/>Delete</p>
                  </td>
                </tr> */}
                                    {/* <tr>
                  <td>Dolo Tablet 650</td>
                  <td >1</td>
                  <td>
                    <p class="dos_value">0</p>
                  <h5 class="dos_time">After Food</h5>
                  </td>
                  <td>1</td>
                  <td>Daily 2 Months</td>
                  <td>
                    <p class="tab_edit"><img src="https://www.flaticon.com/svg/static/icons/svg/61/61456.svg"/>Edit</p>
                  <p class="tab_del"><img src="https://www.iconsdb.com/icons/preview/red/delete-xxl.png"/>Delete</p>
                  </td>
                </tr> */}
                                  </tbody>
                                </table>
                              </div>
                            </div>

                            <div class="tab-pane" id="tab2default">
                              <div class="upload_presc">

                                <div class="input-group">
                    <span class="input-group-btn">
                     <span class="btn btn-default btn-file">
                     <img src="../images/doctor-img/Eprescription video 3/Upload Prescription/Upload_Prescription.svg" /> 
                       Upload Prescription
                              <FileBase645
                                  multiple={true}
                                  onDone={this.getFiless.bind(this)}
                                />
                          </span>
                             </span>
                            </div>
                            {documentsRelated}
                                {/* <div class="custom-file-upload">
                                  <label
                                    for="file-upload"
                                    class="custom-file-upload1"
                                  >
                                    <img src="https://indimedo.com/public/assets/img/sample.png" />{" "}
                                    Upload Prescription
                                  </label>

                                  
                                </div> */}
                                <div class="upload_presc_img">
                            {/* <a href="#" class="thumbnail" data-toggle="modal" data-target="#lightbox"> 
                        <img src="https://indimedo.com/public/assets/img/sample.png" />
                                  </a> */}
                {/* <div class="upload_top_img">
                     <img class="del_img"  src="../images/doctor-img/Eprescription video 3/Upload Prescription/cancel.svg" />
               </div> */}
              </div>
                               
                                {/* <div class="upload_presc_img">
              <img src="https://indimedo.com/public/assets/img/sample.png" />
            </div> */}
                              </div>
                            </div>
                          </div>
                          <div class="add_med_section" id="add_med_section">
                            <form id="meddata" target="#">
                              <div class="add_med_head">
                                <h2>
                                 {" "}
                                Add  Medicine
                                </h2>
                              </div>
                              <div class="add_med_details">
                                <div class="row">
                                  <div class="col-lg-7">
                                    <label>Medicine Name</label>

                                    {/* <Multiselect
                                  onChange={this.handleChange.bind(
                                    this,
                                    "medication"
                                  )}
                                  name="medication"
                                  options={this.state.medicineOptions} // Options to display in the dropdown
                                  value={this.state.selectedMedicineList || ""}
                                  selectedValues={
                                    this.state.selectedMedicineValue
                                  } // Preselected value to persist in dropdown
                                  onSelect={this.onMedicineSelect} // Function will trigger on select event
                                  placeholder="Select Medicine"
                                  onRemove={this.onMedicineRemove} // Function will trigger on remove event
                                  displayValue="medicinename" // Property name to display in the dropdown options
                                  singleSelect="true"
                                  caseSensitiveSearch="true"
                                  onSearch={this.t}
                                  
                                />  */}

                                    <Dropdown
                                      id="medicines"
                                      placeholder={this.state.medPlaceHolder}
                                      fluid
                                      clearable
                                      search
                                      selection
                                      options={this.state.medicinesListOptions}
                                      defaultValue={
                                        this.state.medicineselectedId
                                      }
                                      onChange={this.onMedicineListChange}
                                    />
                                  </div>
                                  <div class="col-lg-5">
                                    <label>Route</label>
                                    {/* <select class="add_med_select">
              <option>Select Route</option>
              <option>1</option>
              <option>2</option>
              <option>3</option>
            </select> */}
                                    {/* <Form.Input
              label='test'
              min={100}
              max={2000}
              name='duration'
              //onChange={this.handleChange}
              step={100}
              type='range'
              value='100'
            /> */}
                                    {/* <Multiselect
                                  onChange={this.handleChange.bind(
                                    this,
                                    "medication"
                                  )}
                                  name="medication"
                                  options={this.state.routesOptions} // Options to display in the dropdown
                                  value={this.state.selectedMedicineList || ""}
                                  selectedValues={
                                    this.state.selectedMedicineValue
                                  } // Preselected value to persist in dropdown
                                  onSelect={this.onMedicineSelect} // Function will trigger on select event
                                  placeholder="Select Medicine"
                                  onRemove={this.onMedicineRemove} // Function will trigger on remove event
                                  displayValue="medicinename" // Property name to display in the dropdown options
                                  singleSelect="true"
                                  caseSensitiveSearch="true"
                                  onSearch={this.t}
                                  

                                />  */}
                                    <Dropdown
                                      id="routes"
                                      placeholder="Select Route"
                                      fluid
                                      clearable
                                      search
                                      selection
                                      options={this.state.stateOptions}
                                      defaultValue={
                                        this.state.defaultRoutesData
                                      }
                                      onChange={this.OnRouteListChange}
                                    />
                                  </div>
                                </div>
                              </div>
                              <div class="freq_details">
                                <label>Frequency Details</label>

                                {this.state.frequencyData.map((data, index) => (
                                  <p
                                    class="frequency"
                                    id={data.replaceAll(" ", "")}
                                    key={index}
                                    onClick={this.onFrequencySelect}
                                  >
                                    {data}
                                  </p>
                                ))}
                                <div
                                  class={
                                    this.state.otherfrequency
                                      ? this.state.otherfrequency
                                      : "collapse-hide"
                                  }
                                  id="freq_div"
                                >
                                  <input
                                    type="text"
                                    id="otherfrequency"
                                    name="otherfrequency"
                                    placeholder="write your direction"
                                    onChange={this.handleOtherFrequencyData}
                                    value={this.state.Frequency}
                                  />
                                  {/* <div class="save_btn">
              <p>Cancel</p>
              <p>Save</p>
            </div> */}
                                </div>
                              </div>
                              <div class="dosage_details">
                                <div class="row">
                                  <div class="col-lg-4 col-md-4">
                                    <label>Doasge Details</label>
                                    <div class="dosage_list">
                                      {this.state.dosageData.map(
                                        (data, index) =>
                                          data != "After Food" &&
                                          data != "Before Food" ? (
                                            <p>
                                              {data}{" "}
                                              <input
                                                type="checkbox"
                                                name="dayselect"
                                                id={data}
                                                class="d_check"
                                                onChange={this.ondayPartSelect}
                                              />
                                            </p>
                                          ) : (
                                            ""
                                          )
                                      )}
                                    </div>
                                  </div>
                                  <div class="col-lg-4 col-md-4">
                                    <div class="dosage_timings">
                                      {this.state.dosageData.map(
                                        (data, index) =>
                                          data == "After Food" ||
                                          data == "Before Food" ? (
                                            <p
                                              class="dosagetiming"
                                              id={data.replaceAll(" ", "")}
                                              onClick={
                                                this.onDosageTimingSelect
                                              }
                                            >
                                              {data}
                                            </p>
                                          ) : (
                                            ""
                                          )
                                      )}
                                    </div>
                                  </div>
                                  <div class="col-lg-4 col-md-4">
                                    <div class="dosage_sch">
                                      <p>
                                        <label>Days</label>
                                        <input
                                          type="text"
                                          placeholder="Enter"
                                          name="days"
                                          id="days"
                                          onChange={this.daychange}
                                          onKeyUp={this.dayschange}
                                        />
                                      </p>
                                      <p>
                                        <label>Qty</label>
                                        <input
                                          type="text"
                                          name="quantity"
                                          id="quantity"
                                          placeholder="Enter"
                                          onChange={this.quantityselect}
                                          onKeyPress={this.quantityselect}
                                        />
                                      </p>
                                      <p>
                                        <label>Refill</label>
                                        <input
                                          type="checkbox"
                                          id="Refill"
                                          class="d_check"
                                          onChange={this.onRefillSelect}
                                        />
                                      </p>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div
                                id="addmedicine"
                                class="add_med_btn collapse-show"
                               
                              >
                                <p  onClick={this.addMedicines}>Add Medicine</p>
                              </div>
                              <div
                                id="updatemedicine"
                                class="add_med_btn collapse-hide"
                               
                              >
                                <p  onClick={this.updateMedicineSelected}>Update Medicine</p>
                              </div>
                            </form>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div class="doc_advice_section">
                      <div class="doc_advice_head">
                        <h2>Next Follow up </h2>
                      </div>
                      <div class="consult_date_range">
                      <div class="row">
                      <div class="col-md-5">
                      <form>
                          <span class="advice_txt">Date :</span>{" "}
                          <input
                            type="date"
                            id="date1"
                            name="date1"
                            min={moment().format('YYYY-MM-DD')}
                            onChange={this.handleFollowup}
                          />
                        </form>
                      </div>
                      <div class="col-md-5 text_mid">
                      <div>
                          <p class="advice_txt">Selected Date:</p>
                          <span class="date_txt">{this.state.next_appointment_datetime}</span>
                        </div>
                        </div>
                        <div class="col-md-2">
                        <button class="save_txt" onClick={this.saveFollowUp}>Save</button>
                        </div>
                      </div>
                       
                       
                        {/* <input type="text" class="form-control advice_input" placeholder="Type Your Advice Here" onKeyPress={this.handleAdviceChange} /> */}
                      </div>
                     
                    </div>
                    <div class="doc_advice_section">
                      <div class="doc_advice_head">
                        <h2>Doctor Advice </h2>
                      </div>
                      <div class="advice_test_details">
                        <input
                          type="text"
                          class="form-control advice_input"
                          placeholder="Type Your Advice Here"
                          onChange={this.handleAdviceChange}
                          value={this.state.stateadvice}
                        />
                         <button class="save_txt" onClick={this.saveAdvice}>Save</button>
                      </div>
                     
                    </div>
                    <div class="epresc_btm_btns">
                      {" "}
                      <button
                        type="button"
                        class="preview_btn"
                        data-toggle="modal"
                        data-target="#presc_prev_Modal"
                      >
                        <img src="../images/doctor-img/Eprescription video 3/Preview.svg" />
                        Preview
                      
                      </button>
                      <button
                        type="button"
                        class="prev_btn"
                        onClick={this.goPrevious}
                      >
                       <img src="../images/doctor-img/Eprescription video 3/Previous.svg" />
                        Previous
                      </button>
                      <button
                        type="button"
                        class="gen_btn"
                        onClick={this.endConsulationGeneratePDF}
                      >
                        Generate{" "}
                        <img src="../images/doctor-img/Eprescription video 3/Generate.svg" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <div id="presc_prev_Modal" class="modal fade" role="dialog">
            <div class="modal-dialog modal-lg">
              <div class="modal-content">
                <div class="modal-header">
                  <button type="button" class="close" data-dismiss="modal">
                    &times;
                  </button>
                  <div class="row">
                    <div class="col-md-6 no_padding">
                      <div class="patient_content">
                        <h4>Mr.{this.state.patientName}</h4>
                        <p>
                          {this.state.gender}, {this.state.dob}
                        </p>
                        <p>
                          Patient UHID: <span>{this.state.patient_id}</span>
                        </p>
                      </div>
                    </div>
                    <div class="col-md-6 no_padding">
                      <div class="doc_content text-right">
                        <h6>
                          {moment().format("DD-MM-YY")} |{" "}
                          {moment().format("hh:mm A")}
                        </h6>
                        <h2>Dr. {this.state.doctorName}</h2>
                        <p>MBBS</p>
                        <h6>General Medicine</h6>
                        <h6>845621572</h6>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="modal-body">
                  <div class="vital_info">
                    <div class="vital_head">
                      <h2>vital information</h2>
                    </div>
                    
                    <div class="vital_table">
                    
                      <table class="table table-bordered">
                        <tbody>
                          <tr>
                            <td>
                              Pulse Rate:{" "}
                              <span>{this.state.pulse_rate} BPM</span>
                            </td>
                            <td>
                              Blood Pressure:{" "}
                              <span>
                                {this.state.bloodPressureSystolic} mmhg-{" "}
                                {this.state.bloodPressureDiastolic} mmhg
                              </span>
                            </td>
                            <td>
                              
                              Blood Sugar: <span>{this.state.blood_sugar ? this.state.blood_sugar : this.state.fields.blood_sugar ? this.state.fields.blood_sugar : "--"} mg/dl</span>
                            </td>
                          </tr>
                          <tr>
                            <td>
                              Temperature:{" "}
                              <span>{this.state.temperature}Fahrenheit </span>
                            </td>
                            <td>
                              Respiratory Rate:
                              <span>{this.state.respiratory} BPM</span>
                            </td>
                            <td></td>
                          </tr>
                          <tr>
                            <td>
                              Height: <span>{this.state.height} ft</span>
                            </td>
                            <td>
                              BMI :<span>{this.state.bmi} Kg</span>
                            </td>
                            <td>
                              Weight: <span>{this.state.weight} kg</span>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                    <div class="prev_det">
                      <h2>Purpose of Consultation</h2>
                      <p>{this.state.problem ? this.state.problem : "--"}</p>
                    </div>

                    <div class="prev_det">
                      <h2>Diagnosis</h2>
                      <p>{this.state.stateFinalDiagnosis ? this.state.stateFinalDiagnosis :"--"}</p>
                    </div>

                    <div class="prev_det">
                      <h2>Diagnosis Tests</h2>
                      <p>{this.state.labtest_names ? this.state.labtest_names: "--"}</p>
                    </div>
                    <div class="prev_det">
                      <h2>Medicines</h2>
                      <div class="table-responsive">
                        <table class="table ">
                          <thead>
                            <tr>
                              <th>Drug Name</th>
                              <th scope="col" colspan="3">
                                Dosage
                              </th>
                              <th scope="col">Time and Duration</th>
                            </tr>
                            <tr>
                              <th scope="col"></th>
                              <th scope="col">M</th>
                              <th scope="col">D</th>
                              <th scope="col">N</th>
                              <th scope="col"></th>
                            </tr>
                          </thead>
                          <tbody>
                            {/* <tr>
                    <td>Dolo Tablet 650</td>
                    <td >1</td>
                    <td>
                      <p class="dos_value">0</p>
                    <h5 class="dos_time">After Food</h5>
                    </td>
                    <td>1</td>
                    <td>Daily 2 Months</td>
                   
                  </tr> */}
                            {medicinepreviewlistarray}
                          </tbody>
                        </table>
                      </div>
                    </div>
                    <div class="prev_det">
                      <h2>Follow up date</h2>
                      <p>{this.state.next_appointment_datetime ? this.state.next_appointment_datetime : "--"}</p>
                    </div>
                    <div class="prev_det">
                      <h2>Advice</h2>
                      <p>{this.state.stateadvice? this.state.stateadvice :"--"}</p>
                    </div>
                    
                    <div class="prev_sign">
                      <img src={this.state.signature_pic ? Constant.imgurl+this.state.signature_pic :"../images/doctor-img/sample-signature.jpg" }/>
                      <p>Signature</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div id="upload_presc_prev_Modal" class="modal fade" role="dialog">
            <div class="modal-dialog modal-lg">
              <div class="modal-content">
                <div class="modal-header">
                <h2>Uploaded Prescription</h2>
                  <button type="button" class="close" data-dismiss="modal">
                    &times;
                  </button>
                  </div>
                  <div class="row">
                    <div class="col-md-12">
                      <div class="modal-body">
                        <div class="upload_info">
                          <img class="upload_modal_img" id="upload_img_presc" src="" />
                        </div>
                      </div>
                    </div>
                  </div>
                
              </div>
            </div>
          </div>
{/* <!-- modal for image gallery --> */}
           <div id="lightbox" class="modal fade" tabindex="-1" role="dialog" aria-labelledby="myLargeModalLabel" aria-hidden="true">
    <div class="modal-dialog">
        <button type="button" class="close hidden" data-dismiss="modal" aria-hidden="true">×</button>
        <div class="modal-content">
        
            <div class="modal-body">
                <img src={this.state.zoomimage} alt="Uploaded Images" id="uploadedImg" onerror="fixBrokenImage(this)"/>
            </div>
        </div>
    </div>
</div>
        </I18nPropvider>  
        <PatientFooter />
      </main>
    );
  }
}


