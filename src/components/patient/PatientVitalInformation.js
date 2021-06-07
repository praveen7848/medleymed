import React, { Component, useState } from "react";
import { Slider } from "react-semantic-ui-range";

import $ from "jquery";
import { ToastContainer } from "react-toastify";
import { Redirect } from "react-router-dom";
import toast from "../../helpers/toast";
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
// import SpeechRecognition, {
//   useSpeechRecognition,
// } from "react-speech-recognition";
import speech from "../patient/Speech";
import { Multiselect } from "multiselect-react-dropdown";


export default class PatientVitalInformation extends Component {
  constructor(props) {
    super(props);
    const appointmentId = localStorage.getItem("appointment_id");
    this.state = {
      isHeightChecked: true,
      isWeightChecked: true,
      isBmiChecked: true,
      isTemparatureChecked: true,
      isPulseChecked: true,
      isBloodSugarChecked: true,

      // isHeightSkipped: true,
      // isWeightSkipped: true,
      // isBmiSkipped: true,
      // isTemparatureSkipped: true,
      // isPulseSkipped: true,
      // isBloodSugarSkipped: true,
      // isRespiratorySkipped: true,
      // isBPSkipped: true,

      isParentChecked: true,
      isDisabled: false,
      disabledRequired: false,
      fields: {},
      errors: {},
      status: true,

      bmiColor: "green_hr",
      bmiDisplayText: "Normal",

      tempColor: "green_hr",
      tempDisplayText: "Normal",

      pulseColor: "green_hr",
      pulseDisplayText: "Normal",

      bloodsugarColor: "green_hr",
      bloodsugarDisplayText: "Normal",

      respiratoryColor: "green_hr",
      respiratoryDisplayText: "Normal",

      respiratoryColor: "green_hr",
      respiratoryDisplayText: "Normal",

      systolicColor: "green_hr",
      systolicDisplayText: "Normal",

      diastolicColor: "green_hr",
      diastolicDisplayText: "Normal",

      isHeightDisabled: true,
      isWeightDisabled: true,
      isBMIDisabled: true,
      isTempDisabled: true,
      isPulseDisabled: true,
      isBloodSugarDisabled: true,
      isRespiratoryDisabled: true,
      isBPDisabled: true,
      appointmentId: appointmentId,
      checked:true,
    };
    this.onFormSubmit = this.onFormSubmit.bind(this);
  }

  onFormSubmit(event) {
    event.preventDefault();
    // alert(" Vitals Form Submit Called");
    const { handle } = this.props.match.params;
    // alert(handle + " handle " + this.handleValidation());
   // alert($("#main_check").is(":checked"));
    let checkboxLength = $(".blue_check").length;
    let checkboxCheckedLength = $(".blue_check:checked").length;
    //alert(checkboxCheckedLength);
    //if($("#main_check").is(":checked")==false){
      if(checkboxCheckedLength==0){
      window.location.href = "./"+this.state.nextPage;
    }else{
    // alert("in");
    
    if (this.handleValidation() && handle) {
    } else if (this.handleValidation() && handle == undefined) {
      this.createPatientVitals(event);
    } else {
      toast.warn("Form has errors.");
    }
  }
  }

  createPatientVitals = (event) => {
    event.preventDefault();
    var handle = this.props.match.params.handle;
    const { fields, errors } = this.state;
    // console.clear();
    // console.log(this.state.fields);
    // return;
  //alert(this.state.fields.bloodsugar);//return
    let url_path = "api/VitalInformation/";
    Httpconfig.httptokenpost(Constant.siteurl + url_path, {
      patient_id: this.state.patient_id,
      pulse_rate: this.state.fields.pulse,
      skip_pulse: this.state.fields.skip_pulse,
      temperature: this.state.fields.temparature,
      skip_temperature: this.state.fields.skip_temparature,
      blood_pressure_systolic: this.state.fields.systolic,
      blood_pressure_diastolic: this.state.fields.diastolic,
      skip_blood_pressure: this.state.fields.skip_bloodsugar,
      blood_sugar:this.state.fields.bloodsugar,
      respiratory_rate: this.state.fields.respiratoryrate,
      skip_respiratory_rate: this.state.fields.skip_respiratoryrate,
      height: this.state.fields.height,
      // roundHeight: Math.round(this.state.fields.height),
      // ftHeight: this.state.fields.ftHeight,
      // inHeight: this.state.fields.inHeight,
      skip_height: this.state.fields.skip_height,
      weight: this.state.fields.weight,
      skip_weight: this.state.fields.skip_weight,
      bmi: this.state.fields.bmi,
      // module_type: "telemedicine-app",
      appointment_id: this.state.appointmentId,
      clinic_id:this.state.clinicId,
    }).then((response) => {

      if (response.status == 200) {
          let next_page = response.data.nextpage.web_reference_page_name;
          toast.success("👌 Vitals Saved succesfully", {
            position: "bottom-center",
          });
          setTimeout(() => this.props.history.push("/" + next_page), 2000);
        }
        // let next_page = response.data.nextPage.pageName;
        // alert("Vitals Saved succesfully");
        // setTimeout(
        //   () => this.props.history.push("/Patientmedicalhistory"),
        //   500
        // );
      }).catch((error) => {
        console.log(error);
        toast.error(error);
      });
  };

  handleValidation() {
    let fields = this.state.fields;
    let errors = {};
    let formIsValid = true;
    //alert(this.state.isHeightDisabled);
    if(!fields["inHeight"]){
      fields["inHeight"]=0;
    }
    if(!fields["ftHeight"]){
      fields["ftHeight"]=0;
    }
    // if (!fields["ftHeight"] &&  this.state.isHeightDisabled ==false) {
    //   formIsValid = false;
    //   errors["ftHeight"] = "ftHeight cannot be empty";
    // }
    // if (!fields["inHeight"] && this.state.isHeightDisabled ==false) {
    //   formIsValid = false;
    //   errors["inHeight"] = "inHeight cannot be empty";
    // }
    if (!fields["weight"] && this.state.isWeightDisabled ==false) {
      formIsValid = false;
      errors["weight"] = "Weight cannot be empty";
    }
    if (!fields["temparature"] && this.state.isTempDisabled == false) {
      formIsValid = false;
      errors["temparature"] = "Temparature cannot be empty";
    }
    if (!fields["pulse"] && this.state.isPulseDisabled == false) {
      formIsValid = false;
      errors["pulse"] = "Pulse cannot be empty";
    }
    if (!fields["bloodsugar"] && this.state.isBloodSugarDisabled == false) {
      formIsValid = false;
      errors["bloodsugar"] = "Bloodsugar cannot be empty";
    }
    if (!fields["respiratoryrate"] && this.state.isRespiratoryDisabled == false) {
      formIsValid = false;
      errors["respiratoryrate"] = "Respiratoryrate cannot be empty";
    }
    if (!fields["systolic"] && this.state.isBPDisabled == false) {
      formIsValid = false;
      errors["systolic"] = "Systolic cannot be empty";
    }
    if (!fields["diastolic"] && this.state.isBPDisabled == false) {
      formIsValid = false;
      errors["diastolic"] = "Diastolic cannot be empty";
    }
    this.setState({ errors: errors });
    return formIsValid;
  }

  componentDidUpdate = () => {
    var lang = localStorage.getItem("Language_selected");
   
    if (lang != null) {
      if (this.state.Language != lang) {
        this.state.Language = lang;
       // console.log("notnull " + this.state.Language);
        this.forceUpdate();
      }
    } else {
      this.state.Language = "en-us";
      //console.log(this.state.Language);
    }
  };

  // To get detais after first render
  componentDidMount = () => {

    this.setState({ 
      isDisabled: false,
      disabledRequired: false,
    });

    var retrievedObject = localStorage.getItem("userObj");
    var appointmentId=localStorage.getItem('appointmentId');
    var patient_id=localStorage.getItem('SelectedPatientId');
    this.state.appointmentId=appointmentId;
    let userData = JSON.parse(retrievedObject);
    if(patient_id!=null || patient_id!=""){
     // alert("in");
      userData.patient_id=patient_id;
  }
    if (retrievedObject != null || retrievedObject != null) {
      this.setState({
        name: userData.name,
        user_mobile: userData.mobile_number,
        email_id: userData.email,
        token: userData.accessToken,
        patient_id: userData.patient_id,
        profile_image: "",
        bmiDefault:"",
      });

      let appointmentId = this.state.appointmentId;
      let patientId = userData.patient_id;
      this.state.clinicId=userData.clinic_id;
     // alert(this.state.clinicId);
      //this.state.clinicId=1;
      this.getVitalsInfo(patientId, appointmentId);
      this.getPatientRelations(userData.patient_id);

    } else {
      window.location.href = "/";
    }
  };

//   getPatientRelations=(patientId)=>{
//     Httpconfig.httptokenget(Constant.siteurl + "api/Patients/findpatientrealtives/"+patientId, {
    
//     })
//        .then((response) => {  
//         let profile_pic="";
//         let patientName="";
//         if(Object.keys(response.data.data).length>0){
//            patientName=response.data.data[0].name; 
//         if(response.data.data[0].profile_pic!=null){
          
//           profile_pic=Constant.imgurl+response.data.data[0].profile_pic;
//        }else{ 
//         let gender=response.data.data[0].gender;
        
//          if(gender=="Male"){
//            profile_pic= "../images/patient/img/Profile/Male_patient.svg";
//          }else{
//            profile_pic= "../images/patient/img/Profile/Female_patient.svg";
           
//          }
//        }
//       }
//         const stateRelationsOptions = response.data.data.map((data, index) =>
//            (

//             {
//               key:  data.id,
//               text: data.name+" ("+data.master_relationship.relation_name+")",
//               value: data.relation_patient_id,
//               image: profile_pic,
//               }

//           ))
//          // alert(stateRelationsOptions);
//           this.setState({
//             stateRelationsOptions:stateRelationsOptions,
//             defaultValue:patientId,//stateRelationsOptions[0].value,
//             patientName:patientName,
//           })
//          // alert(this.state.patientName);
          
//         })
//        .catch((error) => {
//           toast.error(error);
//        });
// }

 /* get the relations */ 
 getPatientRelations=(patientId)=>{
  Httpconfig.httptokenget(Constant.siteurl + "api/Patients/findpatientrealtives/"+patientId, {
  
  })
     .then((response) => { 
       
         /* Assiging consulation purpose to the state */
         this.state.patientName="Select Patient";
        let id="0";
        let pName="";
        let relationName=" (Self)";
        let relationShipId="0";
        let image="../images/patient/img/Profile/Male_patient.svg";
        let my_relatives="";
        let stateRelationsOptions=[];
        let selectedImage="";
        let selectedPatient="";
        let dataCount=Object.keys(response.data.data).length;
        for(let rel=0;rel<dataCount;rel++){
            if(response.data.data[rel].id!=""){
              id=response.data.data[rel].id;
             // alert(id);
            }
            if(response.data.data[rel].relation_patient_id!=null){
              relationShipId=response.data.data[rel].relation_patient_id;
            //  alert(relationShipId);
            }
            if(response.data.data[rel].name!=null){
              pName=response.data.data[rel].name;
            }
            if(response.data.data[rel].master_relationship!=null){
              relationName="("+response.data.data[rel].master_relationship.relation_name+")";
            }
            if(response.data.data[rel].profile_pic!=null){
                //alert(response.data.data[rel].profile_pic);
              image=Constant.imgurl+response.data.data[rel].profile_pic;
            }else{
              if(response.data.data[rel].gender.toLowerCase()=='male'){
                  image="../images/patient/img/Profile/Male_patient.svg";
              }else{
                  image="../images/patient/img/Profile/Female_patient.svg";
              }
            }
           // alert(id);
           if(patientId==id){
               selectedImage=image;
               selectedPatient=pName+relationName;
           }
            
            my_relatives ={
                  key:relationShipId ,
                  text: pName+relationName,
                  value: relationShipId,
                  image:  { avatar: true, src: image },
                 

            }
            stateRelationsOptions.push(my_relatives);
            
          
        }
        this.state.stateRelationsOptions=stateRelationsOptions;
        var patient_id=localStorage.getItem('SelectedPatientId');
        //alert(patient_id);
        if(patient_id!=null){
         // alert(patient_id);
         this.setState({
         // stateRelationsOptions:stateRelationsOptions,
          defaultValue:patient_id,
        })
      }else{

        this.state.selectedRelativeValue= stateRelationsOptions[0].value;
        this.setState({
         // stateRelationsOptions:stateRelationsOptions,
          defaultValue:stateRelationsOptions[0].value,
        })
        
      }
      //alert(selectedImage);
      //alert(selectedPatient);
      $('.purpose_select .divider').html('');
      $('.purpose_select .divider').html('<img src="'+selectedImage+'" class="ui avatar image"><span class="text">'+selectedPatient+'</span>');
      this.forceUpdate();
      
      })
     .catch((error) => {
        toast.error(error); 
     });
}

  handleToggle = () => {
    this.setState({ checked: !this.state.checked });
  };

  // Update the text for values
  updateRations=()=>{
    const {
      isDisabled,
      disabledRequired,
      isParentChecked,
      fields,
      tempDisplayText,
    } = this.state;
    let patient_id="";
    // systolic Starts here
    let systolic = this.state.fields.systolic;
    if (systolic >= 90 && systolic <= 199) {
      this.state.systolicColor = "green_hr";
      this.state.systolicDisplayText = "Normal";
    } else if (systolic >= 120 && systolic <= 139) {
      this.state.systolicColor = "yellow_hr";
      this.state.systolicDisplayText = "high";
    } else if (systolic >= 140) {
      this.state.systolicColor = "red_hr";
      this.state.systolicDisplayText = "Very high";
    }
    let systolicdisplayStatus = this.state.systolicDisplayText;
    // Ends

    // Diastolic Starts here
    let diastolic = this.state.fields.diastolic;
    if (diastolic >= 60 && diastolic <= 79) {
      this.state.diastolicColor = "green_hr";
      this.state.diastolicDisplayText = "Normal";
    } else if (diastolic >= 80 && diastolic <= 89) {
      this.state.diastolicColor = "yellow_hr";
      this.state.diastolicDisplayText = "high";
    } else if (diastolic > 89 && diastolic < 200) {
      this.state.diastolicColor = "red_hr";
      this.state.diastolicDisplayText = "Very high";
    }else if (diastolic > 200) {
      this.state.diastolicColor = "red_hr";
      this.state.diastolicDisplayText = "Very high";
    }
    let diastolicdisplayStatus = this.state.diastolicDisplayText;
    // Ends

    // Bloodsugar Starts here
    let bloodsugar = this.state.fields.bloodsugar;
    if (bloodsugar >= 20 && bloodsugar < 141) {
      this.state.bloodsugarColor = "green_hr";
      this.state.bloodsugarDisplayText = "Normal";
    } else if (bloodsugar >= 141 && bloodsugar < 180) {
      this.state.bloodsugarColor = "yellow_hr";
      this.state.bloodsugarDisplayText = "high";
    } else if (bloodsugar >= 180 && bloodsugar < 200) {
      this.state.bloodsugarColor = "red_hr";
      this.state.bloodsugarDisplayText = "Very high";
    }else if (bloodsugar > 200) {
      this.state.bloodsugarColor = "red_hr";
      this.state.bloodsugarDisplayText = "Very high";
    }
    let bloodsugardisplayStatus = this.state.bloodsugarDisplayText;
    // Ends

    // Respiratory Starts here
    let respiratory = this.state.fields.respiratoryrate;
    if (respiratory >= 15 && respiratory <= 20) {
      this.state.respiratoryColor = "green_hr";
      this.state.respiratoryDisplayText = "Normal";
    } else if (respiratory > 20 && respiratory <= 26) {
      this.state.respiratoryColor = "yellow_hr";
      this.state.respiratoryDisplayText = "high";
    } else if (respiratory > 26 && respiratory <= 100) {
      this.state.respiratoryColor = "red_hr";
      this.state.respiratoryDisplayText = "Very high";
    }else if (respiratory > 100) {
      this.state.respiratoryColor = "red_hr";
      this.state.respiratoryDisplayText = "Very high";
    }
    let respiratorydisplayStatus = this.state.respiratoryDisplayText;
    // Ends

    // Pulse Starts here
    let pulse = this.state.fields.pulse;
    if (pulse > 0 && pulse <= 80) {
      this.state.pulseColor = "green_hr";
      this.state.pulseDisplayText = "Normal";
    } else if (pulse > 80 && pulse <= 91) {
      this.state.pulseColor = "yellow_hr";
      this.state.pulseDisplayText = "high";
    } else if (pulse >= 91 && pulse <= 200) {
      this.state.pulseColor = "red_hr";
      this.state.pulseDisplayText = "Very high";
    }else if (pulse >= 200) {
      this.state.pulseColor = "red_hr";
      this.state.pulseDisplayText = "Very high";
    }

    let pulsedisplayStatus = this.state.pulseDisplayText;
    // Ends

    // BMI Starts
    const ftHeight = this.state.fields.ftHeight;
    const inHeight = this.state.fields.inHeight;
    const weight = this.state.fields.weight;

    if (ftHeight != "" && inHeight != "" && weight != "") {
      let hightFeetConvert=ftHeight*12;
      let hightIncehsConvert=parseFloat(hightFeetConvert)+parseFloat(inHeight);
      let heightCms=hightIncehsConvert*2.54;
      let bmi = (weight / ((heightCms/100 * heightCms/100) 
                          )).toFixed(2);
      // let hightFeetConvert=ftHeight*12;
      // let hightIncehsConvert=hightFeetConvert+inHeight;
      // let heightCms=hightIncehsConvert+2.54;
      // let bmi1 = (weight / ((heightCms * heightCms) 
      //                       / 10000)).toFixed(2);
      //                       alert(bmi1);
      // let feetInchesMerge = ftHeight + "." + inHeight;
      // let height = feetInchesMerge / 0.032808;
      // let bmiHeight = Math.round(height);
      // this.state.fields.height = height.toFixed(2);
      // let heightConver = bmiHeight / 100;
      // let weightconver = weight;
      // let bmi = heightConver * heightConver;
      // bmi = weightconver / bmi;
      // bmi = bmi.toFixed(1);
      this.state.fields.bmi = bmi;
    } else {
      this.state.fields.bmi = "0";
    }

    let bmi = this.state.fields.bmi;
    if (bmi < 18.5) {
      this.state.bmiColor = "green_hr";
      this.state.bmiDisplayText = "Underweight";
    } else if (18.5 <= bmi && bmi <= 24.9) {
      this.state.bmiColor = "green_hr";
      this.state.bmiDisplayText = "Normal weight";
    } else if (25 <= bmi && bmi <= 29.9) {
      this.state.bmiColor = "yellow_hr";
      this.state.bmiDisplayText = "Over weight";
    } else {
      this.state.bmiColor = "red_hr";
      this.state.bmiDisplayText = "Obese";
    }
    let bmidisplayStatus = this.state.bmiDisplayText;
    // BMI Ends

    // Temparature Starts here
    let temparature = this.state.fields.temparature;
    
   if (temparature > 0 && temparature <=80) {
    this.state.tempColor = "yellow_hr";
    this.state.tempDisplayText = "high";
    }
    else if (temparature > 80 && temparature < 97) {
      this.state.tempColor = "green_hr";
      this.state.tempDisplayText = "Normal";
    } else if (temparature > 97 && temparature < 100) {
      this.state.tempColor = "yellow_hr";
      this.state.tempDisplayText = "high";
    } else if (temparature > 100) {
      this.state.tempColor = "red_hr";
      this.state.tempDisplayText = "Very high";
    }
    let tempdisplayStatus = this.state.tempDisplayText;
    // Temparature Ends
    this.forceUpdate();

  }

  // To get all the ResponderInfo
  getVitalsInfo(patientId, appointmentId) {

// Testing Service Starts
    Httpconfig.httptokenget(
      Constant.siteurl + "api/VitalInformation/getVitals/" + patientId + "/" + appointmentId+ "/"+this.state.clinicId
    ).then((response) => {
   
      // if(Object.keys(response.data.result).length==0){
      //   let previousPage=response.data.previouspage.web_reference_page_name;
      //   let nextPage=response.data.nextpage.web_reference_page_name;
        
      //   this.setState({
      //     previousPage:previousPage,
      //     nextPage:nextPage,
      //   });
      //   alert(nextPage);
      //   alert(this.state.nextpage);

      // }


        if (response.status == '200') {
          
          let previousPage=response.data.previouspage.web_reference_page_name;
          let nextPage=response.data.nextpage.web_reference_page_name;
          let responseLog = response;
          this.state.previousPage=previousPage;
          this.state.nextPage=nextPage;
          
          
          
          let height = response.data.data[0].height;
          //alert(responseLog.data.data[0].temperature);
          var realFeet = ((height*0.393700) / 12);
          var feet = Math.floor(realFeet);
          var inches = Math.round((realFeet - feet) * 12);
         // alert(height);
          if(height!="" && !height.isNaN==true){
            this.state.isHeightDisabled = false;
            $('input[name=skip_height]').prop('checked',true);
          }
          if(responseLog.data.data[0].weight){
            this.state.isWeightDisabled = false;
            $('input[name=skip_weight]').prop('checked',true);
            
          }
          if(responseLog.data.data[0].temperature){
            this.state.isTempDisabled = false;
            $('input[name=skip_temparature]').prop('checked',true);
          }
          if(responseLog.data.data[0].pulse_rate){
            this.state.isPulseDisabled  = false;
            $('input[name=skip_pulse]').prop('checked',true);
          }
          if(responseLog.data.data[0].blood_sugar){
            this.state.isBloodSugarDisabled  = false;
            $('input[name=skip_bloodsugar]').prop('checked',true);
          }
          if(responseLog.data.data[0].respiratory_rate){
            this.state.isRespiratoryDisabled  = false;
            $('input[name=skip_respiratoryrate]').prop('checked',true);
          }
          if(responseLog.data.data[0].blood_pressure_systolic){
            this.state.isBPDisabled  = false;
            $('input[name=skip_systolic]').prop('checked',true);
          }
          if(responseLog.data.data[0].blood_pressure_diastolic){
            this.state.isBPDisabled  = false;
            $('input[name=skip_systolic]').prop('checked',true);
          }
          this.setState({
            fields: {
              height: responseLog.data.data[0].height,
              ftHeight: feet,
              inHeight: inches,
              skip_height: responseLog.data.data[0].skip_height,
              skip_weight: responseLog.data.data[0].skip_weight,
              skip_temparature: responseLog.data.data[0].skip_temparature,
              skip_pulse: responseLog.data.data[0].skip_pulse,
              skip_respiratoryrate: responseLog.data.data[0].skip_respiratoryrate,
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
          this.forceUpdate();
        }
      }).catch((error) => {
        console.log(error);
      });
    // Ends here

    const ftHeight = this.state.fields.ftHeight;
    const inHeight = this.state.fields.inHeight;
    let feetInchesMerge = ftHeight + "." + inHeight;
    let height = feetInchesMerge / 0.032808;
    this.state.fields.height = height.toFixed(2);
  }

  // When value changes of the fields
  handleChange = (field, event) => {
    let fields = this.state.fields;
    fields[field] = event.target.value;
    let fieldName = event.target.name;
//alert(fields[field]);
    // console.clear();
    // console.log(fields);
    // console.log("fieldName " + fields[fieldName]);
    // console.log("fieldValue " + fields[field]);
    // console.log(fieldName);
    // console.log(this.state.fields.height + " Height");
    // console.log(this.state.fields.weight + " weight");
    //alert(fields[field]); 
    //return;
    if (fieldName == "skip_height" && $("input[name='"+fieldName+"']").is(":checked")==false) {
      this.state.fields.skip_height = 0;
      this.state.isHeightDisabled = true;
    } else if (fieldName == "skip_height" && $("input[name='"+fieldName+"']").is(":checked")==true) {
      this.state.fields.skip_height = 1;
      this.state.isHeightDisabled = false;
    }
    
    if(fieldName == "ftHeight") {
      
      if(!Number(fields[field])){
        if(fields[field]!=0){
           
          $("input[name="+fieldName+"]").val('');
          this.state.fields.ftHeight="0";
        }else{
        
          if(fields[field]==""){
          this.state.fields.ftHeight="0";
        }else{
          if(fields[field]>9){
             
            toast.error("Invalid Height");
            $("input[name="+fieldName+"]").val('');
            this.state.fields.ftHeight="0";

          }else{
            
          this.state.fields.ftHeight=fields[field];
          }
        }
         
        }
      }else{
        //alert(event.target.value);
        if(fields[field]==""){
        $("input[name="+fieldName+"]").val('');
        this.state.fields.ftHeight="0";
        }else{
          if(fields[field]>9){
           toast.error("Invalid Height");
           $("input[name="+fieldName+"]").val('');
           this.state.fields.ftHeight="0";
         }else{
          this.state.fields.ftHeight=fields[field];
         }
        }
   }
    }
    if(fieldName == "inHeight") {
      
      if(!Number(event.target.value)){
        if(event.target.value!=0){
          $("input[name="+fieldName+"]").val('');
          this.state.fields.inHeight="0";
        }else{
          if(fields[field]==""){
            $("input[name="+fieldName+"]").val('');
            this.state.fields.inHeight="0";
            }else{
              this.state.fields.inHeight=fields[field];
            }
         // this.state.fields.inHeight=event.target.value;
        }
      }else{
        if(event.target.value<=12){
        this.state.fields.inHeight=event.target.value;
        }else{
          toast.error("Invalid Intches");
          $("input[name="+fieldName+"]").val('');
          this.state.fields.inHeight="0";
          
        }
      }
    }
    // if (fieldName == "skip_height" && fields[field] == "0") {
    //   this.state.fields.skip_height = 0;
    //   this.state.isHeightDisabled = true;
    // } else if (fieldName == "skip_height" && fields[field] == "1") {
    //   this.state.fields.skip_height = 1;
    //   this.state.isHeightDisabled = false;
    // }
    if (fieldName == "skip_weight" && $("input[name='"+fieldName+"']").is(":checked")==false) {
      this.state.fields.skip_weight = 0;
      this.state.isWeightDisabled = true;
    } else if (fieldName == "skip_weight" && $("input[name='"+fieldName+"']").is(":checked")==true) {
      this.state.fields.skip_weight = 1;
      this.state.isWeightDisabled = false;
    }
    if(fieldName == "weight") {
      
      if(!Number(event.target.value)){
        if(event.target.value!=0){
          $("input[name="+fieldName+"]").val('');
          this.state.fields.weight="0";
        }else{
          this.state.fields.weight=event.target.value;
        }
      }else{
        if(event.target.value>500){
          toast.error("Invalid Weight");
          $("input[name="+fieldName+"]").val('');
          this.state.fields.weight="0";
          this.updateRations();
          return;
        }else{
        this.state.fields.weight=event.target.value;
        }
      }
    }
    // if (fieldName == "skip_weight" && fields[field] == "1") {
    //   this.state.fields.skip_weight = 0;
    //   this.state.isWeightDisabled = true;
    // } else if (fieldName == "skip_weight" && fields[field] == "0") {
    //   this.state.fields.skip_weight = 1;
    //   this.state.isWeightDisabled = false;
    // }
    if (fieldName == "skip_temparature" && $("input[name='"+fieldName+"']").is(":checked")==false) {
      this.state.fields.skip_temparature = 0;
      this.state.isTempDisabled = true;
    } else if (fieldName == "skip_temparature" && $("input[name='"+fieldName+"']").is(":checked")==true) {
      this.state.fields.skip_temparature = 1;
      this.state.isTempDisabled = false;
    }
    if (fieldName == "temparature") {
      this.state.temperature=event.target.value;
      if(!Number(event.target.value)){
        if(event.target.value!=0){
          $("input[name="+fieldName+"]").val('');
          this.state.fields.skip_temparature="0";
        }else{
          this.state.fields.temperature=event.target.value;
        }
      }else{
        if(event.target.value>130){
          toast.error("Invalid Temperature");
          $("input[name="+fieldName+"]").val('');
          this.state.fields.temparature="0";
          this.updateRations();
          return;
        }else{
        this.state.fields.temperature=event.target.value;
        }
      }
    } 
    if (fieldName == "skip_pulse" && $("input[name='"+fieldName+"']").is(":checked")==false) {
      this.state.fields.skip_pulse = 0;
      this.state.isPulseDisabled = true;
    } else if (fieldName == "skip_pulse" && $("input[name='"+fieldName+"']").is(":checked")==true) {
      this.state.fields.skip_pulse = 1;
      this.state.isPulseDisabled = false;
    }
    if (fieldName == "pulse") {
      
      if(!Number(event.target.value)){
        if(event.target.value!=0){
          $("input[name="+fieldName+"]").val('');
          this.state.fields.pulse="0";
        }else{
          this.state.fields.pulse=event.target.value;
        }
      }else{
        if(event.target.value>199){
          toast.error("Invalid Pulse");
          $("input[name="+fieldName+"]").val('');
          this.state.fields.pulse=0;
          this.updateRations();
          return;
        }else{
        this.state.fields.pulse=event.target.value;
        }
      }
    }
    // if (fieldName == "skip_pulse" && fields[field] == "1") {
    //   this.state.fields.skip_pulse = 0;
    //   this.state.isPulseDisabled = true;
    // } else if (fieldName == "skip_pulse" && fields[field] == "0") {
    //   this.state.fields.skip_pulse = 1;
    //   this.state.isPulseDisabled = false;
    // }
   
    if (fieldName == "skip_bloodsugar" &&  $("input[name='"+fieldName+"']").is(":checked")==false) {
      //skip_bloodsugar
     
      this.state.fields.skip_bloodsugar = 0;
      this.state.fields.bloodsugar=0;  
      this.state.isBloodSugarDisabled = true;
      
      this.forceUpdate();
      
    } else if (fieldName == "skip_bloodsugar" && $("input[name='"+fieldName+"']").is(":checked")==true) {
      this.state.fields.skip_bloodsugar = 1;
      this.state.isBloodSugarDisabled = false;
    }
    if (fieldName == "bloodsugar") {
      this.state.bloodsugar=event.target.value;
      if(!Number(event.target.value)){
        if(event.target.value!=0){
          $("input[name="+fieldName+"]").val('');
          this.state.fields.bloodsugar="0";
        }else{
          this.state.fields.bloodsugar=event.target.value;
        }
      }else{
        if(event.target.value>500){
          toast.error("Invalid Blood Sugar");
          $("input[name="+fieldName+"]").val('');
          this.state.fields.bloodsugar=0;
          this.updateRations();
          return;
        }else{
        this.state.fields.bloodsugar=event.target.value;
        }
      }
    }
    // if (fieldName == "skip_bloodsugar" && fields[field] == "1") {
    //   this.state.fields.skip_bloodsugar = 0;
    //   this.state.isBloodSugarDisabled = true;
    // } else if (fieldName == "skip_bloodsugar" && fields[field] == "0") {
    //   this.state.fields.skip_bloodsugar = 1;
    //   this.state.isBloodSugarDisabled = false;
    // }
    if (fieldName == "skip_respiratoryrate" && $("input[name='"+fieldName+"']").is(":checked")==false) {
      this.state.fields.skip_respiratoryrate = 0;
      this.state.isRespiratoryDisabled = true;
    } else if (fieldName == "skip_respiratoryrate" && $("input[name='"+fieldName+"']").is(":checked")==true) {
      this.state.fields.skip_respiratoryrate = 1;
      this.state.isRespiratoryDisabled = false;
    }
    if (fieldName == "respiratoryrate") {
      this.state.respiratoryrate=event.target.value;
      if(!Number(event.target.value)){
        if(event.target.value!=0){
          $("input[name="+fieldName+"]").val('');
          this.state.fields.respiratoryrate="0";
        }else{
          this.state.fields.respiratoryrate=event.target.value;
        }
      }else{
        if(event.target.value>100){
          toast.error("Invalid Resporatory");
          $("input[name="+fieldName+"]").val('');
          this.state.fields.respiratoryrate="0";
          this.updateRations();
          return;
        }else{
        this.state.fields.respiratoryrate=event.target.value;
        }
      }
    }

    
    // if (fieldName == "skip_respiratoryrate" && fields[field] == "0") {
    //   this.state.fields.skip_respiratoryrate = 0;
    //   this.state.isRespiratoryDisabled = true;
    // } else if (fieldName == "skip_respiratoryrate" && fields[field] == "1") {
    //   this.state.fields.skip_respiratoryrate = 1;
    //   this.state.isRespiratoryDisabled = false;
    // }
    if (fieldName == "skip_systolic" && $("input[name='"+fieldName+"']").is(":checked")==false) {
      this.state.fields.skip_systolic = 0;
      this.state.isBPDisabled = true;
    } else if (fieldName == "skip_systolic" && $("input[name='"+fieldName+"']").is(":checked")==true) {
      this.state.fields.skip_systolic = 1;
      this.state.isBPDisabled = false;
    }

    if (fieldName == "systolic") {
      this.state.systolic=event.target.value;
      if(!Number(event.target.value)){
        if(event.target.value!=0){
          $("input[name="+fieldName+"]").val('');
          this.state.fields.systolic="0";
        }else{
          this.state.fields.systolic=event.target.value;
        }
      }else{
        if(event.target.value>250){
          toast.error("Invalid systolic");
          $("input[name="+fieldName+"]").val('');
          this.state.fields.systolic="0";
          this.updateRations();
          return;
        }else{
        this.state.fields.systolic=event.target.value;
        }
      }
    }
    if (fieldName == "diastolic") {
      this.state.diastolic=event.target.value;
      if(!Number(event.target.value)){
        if(event.target.value!=0){
          $("input[name="+fieldName+"]").val('');
          this.state.fields.diastolic="0";
        }else{
          this.state.fields.diastolic=event.target.value;
        }
      }else{
        if(event.target.value>250){
          toast.error("Invalid diastolic");
          $("input[name="+fieldName+"]").val('');
          this.state.fields.diastolic="0";
          this.updateRations();
          return;
        }else{
        this.state.fields.diastolic=event.target.value;
        }
      }
    }
    
    
    // if (fieldName == "skip_systolic" && fields[field] == "1") {
    //   this.state.fields.skip_systolic = 0;
    //   this.state.isBPDisabled = true;
    // } else if (fieldName == "skip_systolic" && fields[field] == "0") {
    //   this.state.fields.skip_systolic = 1;
    //   this.state.isBPDisabled = false;
    // }



    const ftHeight = this.state.fields.ftHeight;
    const inHeight = this.state.fields.inHeight;
    const weight = this.state.fields.weight;
    if (ftHeight != "" && inHeight != "" && weight != "") {

      let hightFeetConvert=ftHeight*12;
      
      let hightIncehsConvert=parseFloat(hightFeetConvert)+parseFloat(inHeight);
      
      let heightCms=hightIncehsConvert*2.54;
      
      let bmi = (weight / ((heightCms/100 * heightCms/100) 
                          )).toFixed(2);
                          

      // let feetInchesMerge = ftHeight + "." + inHeight;
      // let height = feetInchesMerge / 0.032808;
      // let bmiHeight = Math.round(height);
      // this.state.fields.height = height;
      // let heightConver = bmiHeight / 100;
      // let weightconver = weight;
      // let bmi = heightConver * heightConver;
      // bmi = weightconver / bmi;
      // bmi = bmi.toFixed(1);
      // console.log(ftHeight + " ftHeight ");
      // console.log(inHeight + " inHeight ");
      
      if(isNaN(bmi)==true){
        this.state.fields.bmi="0";
      }else{
      this.state.fields.bmi = bmi;
      }
      this.forceUpdate();
      
    } else {
      this.state.fields.bmi = "0";
    }
    //alert(fields[field]); 
    //alert(fieldName);
    let checked=0;
    var checkedVals = $('.blue_check:checkbox:checked').map(function() {
     // alert(this.value);
      if(this.value==0){
        checked=checked+1;
      }
  }).get();
  //alert(checked);
  if(checked==0){
    $(".green_check").prop("checked", false);
  }
  if(checked>=6){
    $(".green_check").prop("checked", true);
  }
    this.setState({ fields });
    this.forceUpdate();
  }; 

  handleSelectAll = (e) => {
    let checkboxLength = $(".blue_check").length;
    let checkboxCheckedLength = $(".blue_check:checked").length;
    // alert("hai");
    if ($(".green_check").is(":checked")) {
      // alert("if");
      //alert(checkboxLength +"==="+ checkboxCheckedLength);
      if (checkboxLength === checkboxCheckedLength) {
        $(".blue_check").prop("checked", true);
        $(".green_check").prop("checked", true);
      } else {
        $(".blue_check").prop("checked", true);
        $(".green_check").prop("checked", true);

        this.state.isHeightDisabled = false;
        this.state.isWeightDisabled = false;
        this.state.isBMIDisabled = false;
        this.state.isTempDisabled = false;
        this.state.isPulseDisabled = false;
        this.state.isBloodSugarDisabled = false;
        this.state.isRespiratoryDisabled = false;
        this.state.isBPDisabled = false;
        this.state.isPulseDisabled = false;

        this.setState({
          fields: {
            height: this.state.fields.height,
            roundHeight: Math.round(this.state.fields.height),
            ftHeight: this.state.fields.ftHeight,
            inHeight: this.state.fields.inHeight,
            weight: this.state.fields.weight,
            skip_height: 0,
            skip_weight: 0,
            bmi: this.state.fields.bmi,
            temparature: this.state.fields.temparature,
            skip_temparature: 0,
            pulse: this.state.fields.pulse,
            bloodsugar: this.state.fields.bloodsugar,
            skip_pulse: 0,
            skip_bloodsugar: 0,
            respiratoryrate: this.state.fields.respiratoryrate,
            skip_respiratoryrate: this.state.fields.respiratory_rate,
            skip_systolic: 0,
            systolic: this.state.fields.systolic,
            diastolic: this.state.fields.diastolic,
          },
        });
        this.forceUpdate();
      }
    } else {
      //alert("in");
      $(".blue_check").prop("checked", false);
      $(".green_check").prop("checked", false);

      this.state.isHeightDisabled = true;
      this.state.isWeightDisabled = true;
      this.state.isBMIDisabled = true;
      this.state.isTempDisabled = true;
      this.state.isPulseDisabled = true;
      this.state.isBloodSugarDisabled = true;
      this.state.isRespiratoryDisabled = true;
      this.state.isBPDisabled = true;
      this.state.isPulseDisabled = true;

      this.setState({
        fields: {
          height: this.state.fields.height,
          roundHeight: Math.round(this.state.fields.height),
          ftHeight: this.state.fields.ftHeight,
          inHeight: this.state.fields.inHeight,
          weight: this.state.fields.weight,
          skip_height: 0,
          skip_weight: 0,
          bmi: this.state.fields.bmi,
          temparature: this.state.fields.temparature,
          skip_temparature: 0,
          pulse: this.state.fields.pulse,
          bloodsugar: this.state.fields.bloodsugar,
          skip_pulse: 0,
          skip_bloodsugar: 0,
          respiratoryrate: 0,
          skip_respiratoryrate: 0,
          skip_systolic: 0,
          systolic: this.state.fields.systolic,
          diastolic: this.state.fields.diastolic,
        },
      });
      this.forceUpdate();
     // alert(this.state.isHeightDisabled);
     // this.forceUpdate();
    }
  };
  handleLanguage = (langValue) => {
    this.setState({ Language: langValue });
  };
  goback=(event)=>{
    window.location.href = "./"+event.currentTarget.id;
  }

  render() {
    const {
      isDisabled,
      disabledRequired,
      isParentChecked,
      fields,
      tempDisplayText,
    } = this.state;
    let patient_id="";
    // systolic Starts here
    let systolic = this.state.fields.systolic;
    if (systolic >= 90 && systolic <= 199) {
      this.state.systolicColor = "green_hr";
      this.state.systolicDisplayText = "Normal";
    } else if (systolic >= 120 && systolic <= 139) {
      this.state.systolicColor = "yellow_hr";
      this.state.systolicDisplayText = "high";
    } else if (systolic >= 140) {
      this.state.systolicColor = "red_hr";
      this.state.systolicDisplayText = "Very high";
    }
    let systolicdisplayStatus = this.state.systolicDisplayText;
    // Ends

    // Diastolic Starts here
    let diastolic = this.state.fields.diastolic;
    if (diastolic >= 60 && diastolic <= 79) {
      this.state.diastolicColor = "green_hr";
      this.state.diastolicDisplayText = "Normal";
    } else if (diastolic >= 80 && diastolic <= 89) {
      this.state.diastolicColor = "yellow_hr";
      this.state.diastolicDisplayText = "high";
    } else if (diastolic > 89 && diastolic < 200) {
      this.state.diastolicColor = "red_hr";
      this.state.diastolicDisplayText = "Very high";
    }else if (diastolic > 200) {
      this.state.diastolicColor = "red_hr";
      this.state.diastolicDisplayText = "Very high";
    }
    let diastolicdisplayStatus = this.state.diastolicDisplayText;
    // Ends

    // Bloodsugar Starts here
    let bloodsugar = this.state.fields.bloodsugar;
    if (bloodsugar >= 20 && bloodsugar < 141) {
      this.state.bloodsugarColor = "green_hr";
      this.state.bloodsugarDisplayText = "Normal";
    } else if (bloodsugar >= 141 && bloodsugar < 180) {
      this.state.bloodsugarColor = "yellow_hr";
      this.state.bloodsugarDisplayText = "high";
    } else if (bloodsugar >= 180 && bloodsugar < 200) {
      this.state.bloodsugarColor = "red_hr";
      this.state.bloodsugarDisplayText = "Very high";
    }else if (bloodsugar > 200) {
      this.state.bloodsugarColor = "red_hr";
      this.state.bloodsugarDisplayText = "Very high";
    }
    let bloodsugardisplayStatus = this.state.bloodsugarDisplayText;
    // Ends

    // Respiratory Starts here
    let respiratory = this.state.fields.respiratoryrate;
    if (respiratory >= 15 && respiratory <= 20) {
      this.state.respiratoryColor = "green_hr";
      this.state.respiratoryDisplayText = "Normal";
    } else if (respiratory > 20 && respiratory <= 26) {
      this.state.respiratoryColor = "yellow_hr";
      this.state.respiratoryDisplayText = "high";
    } else if (respiratory > 26 && respiratory <= 100) {
      this.state.respiratoryColor = "red_hr";
      this.state.respiratoryDisplayText = "Very high";
    }else if (respiratory > 100) {
      this.state.respiratoryColor = "red_hr";
      this.state.respiratoryDisplayText = "Very high";
    }
    let respiratorydisplayStatus = this.state.respiratoryDisplayText;
    // Ends

    // Pulse Starts here
    let pulse = this.state.fields.pulse;
    if (pulse >= 10 && pulse <= 80) {
      this.state.pulseColor = "green_hr";
      this.state.pulseDisplayText = "Normal";
    } else if (pulse > 80 && pulse <= 91) {
      this.state.pulseColor = "yellow_hr";
      this.state.pulseDisplayText = "high";
    } else if (pulse >= 91 && pulse <= 200) {
      this.state.pulseColor = "red_hr";
      this.state.pulseDisplayText = "Very high";
    }else if (pulse >= 200) {
      this.state.pulseColor = "red_hr";
      this.state.pulseDisplayText = "Very high";
    }

    let pulsedisplayStatus = this.state.pulseDisplayText;
    // Ends

    // BMI Starts
    const ftHeight = this.state.fields.ftHeight;
    const inHeight = this.state.fields.inHeight;
    const weight = this.state.fields.weight;

    if (ftHeight != "" && inHeight != "" && weight != "") {
      
      let hightFeetConvert=ftHeight*12;
      console.log("====heightCms======"+hightFeetConvert);
      let hightIncehsConvert=parseFloat(hightFeetConvert)+parseFloat(inHeight);
      console.log("====heightCms======"+hightIncehsConvert);
      let heightCms=hightIncehsConvert*2.54;
      console.log("====heightCms======"+heightCms);
      let bmi = (weight / ((heightCms/100 * heightCms/100) 
                          )).toFixed(2);
      console.log("====heightCms======"+bmi);



      // let feetInchesMerge = ftHeight + "." + inHeight;
      // let height = feetInchesMerge / 0.032808;
      // let bmiHeight = Math.round(height);
      // this.state.fields.height = height.toFixed(2);
      // let heightConver = bmiHeight / 100;
      // let weightconver = weight;
      // let bmi = heightConver * heightConver;
      // bmi = weightconver / bmi;
      // bmi = bmi.toFixed(1);
      if(isNaN(bmi)==true){
      this.state.fields.bmi = "0";
      }else{
      this.state.fields.bmi = bmi;
      }
    } else {
      this.state.fields.bmi = "0";
    }
   // alert(weight);
//alert(this.state.fields.bmi);
    let bmi = this.state.fields.bmi;
    if (bmi < 18.5) {
      this.state.bmiColor = "green_hr";
      this.state.bmiDisplayText = "Underweight";
    } else if (18.5 <= bmi && bmi <= 24.9) {
      this.state.bmiColor = "green_hr";
      this.state.bmiDisplayText = "Normal weight";
    } else if (25 <= bmi && bmi <= 29.9) {
      this.state.bmiColor = "yellow_hr";
      this.state.bmiDisplayText = "Over weight";
    } else {
      this.state.bmiColor = "red_hr";
      this.state.bmiDisplayText = "Obese";
    }
    let bmidisplayStatus = this.state.bmiDisplayText;
    // BMI Ends

    // Temparature Starts here
    let temparature = this.state.fields.temparature;
    if (temparature > 0 && temparature <=80) {
      this.state.tempColor = "yellow_hr";
      this.state.tempDisplayText = "high";
    } else if (temparature > 80 && temparature < 97) {
      this.state.tempColor = "green_hr";
      this.state.tempDisplayText = "Normal";
    } else if (temparature > 97 && temparature < 100) {
      this.state.tempColor = "yellow_hr";
      this.state.tempDisplayText = "high";
    } else if (temparature > 100) {
      this.state.tempColor = "red_hr";
      this.state.tempDisplayText = "Very high";
    }
    let tempdisplayStatus = this.state.tempDisplayText;
    // Temparature Ends

    const heightFeetSettings = {
      start: 0,
      min: 0,
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
      start: 0,
      min: 0,
      max: 12,
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
            height: this.state.fields.height,
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
      start: 0,
      min: 0,
      max: 500,
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

    const systolicSettings = {
      start: 20,
      min: 0,
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
      min: 0,
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

    const temparatureSettings = {
      start: 70,
      min: 0,
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

    const pulseSettings = {
      start: 20,
      min: 0,
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

    const bloodsugarSettings = {
      start: 60,
      min: 0,
      max: 500,
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

    const respiratorySettings = {
      start: 5,
      min: 0,
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

    // console.clear();
    // console.log(this.state.fields["bmi"]+" BMI");

    var retrievedObject=localStorage.getItem('userObj');
    if(retrievedObject!=null){
      
    let userData=JSON.parse(retrievedObject);
    const patient_id=userData.patient_id
    }else{
      window.location.href = "/";
    }
    
    return (
      <main id="main">
        <PatientHeader onSelectLanguage={this.handleLanguage} />
        <I18nPropvider locale={this.state.Language}>
          <section id="purpose">
            <div className="container">
              <div className="row">
                <div className="col-md-6">
                  <div className="purpose_heading">
                    <h2>{translate("Patient Intake Process")}</h2>
                  </div>
                </div>
                <div className="col-md-6 text-right">
                  <div className="purpose_select">
                  
                    <h4>{translate("Enter the details for")}...</h4>
                    <Dropdown
                      placeholder={this.state.patientName}
                      openOnFocus={false}
                      selection
                      options={this.state.stateRelationsOptions}
                      defaultValue={this.state.defaultValue}
                      disabled={true}
                    />
                  
                  </div>
                </div> 
              </div>
              <div className="purpose_consult">
                <div className="row">
                  <div className="col-md-4">
                    <div className="stepwizard">
                      <div className="stepwizard-row setup-panel">
                        <div className="stepwizard-step">
                          <a
                            href="#step-1"
                            type="button"
                            className="btn  btn-green btn-circle"
                          >
                            <img src="../images/patient/img/Patient Intake Process/tickmark.svg" />
                          </a>
                          <p className="p_dark p_green">
                            {translate("Purpose of consultation")}
                          </p>
                        </div>
                        <div className="stepwizard-step">
                          <a
                            href="#step-2"
                            type="button"
                            className="btn  btn-primary btn-circle"
                            disabled="disabled"
                          >
                            <img src="../images/patient/img/Patient Intake Process/tickmark.svg" />
                          </a>
                          <p className="p_dark p_green">
                            {translate("Specify Symptoms")}
                          </p>
                        </div>
                        <div className="stepwizard-step">
                          <a
                            href="#step-3"
                            type="button"
                            className="btn btn-default btn-circle"
                          >
                            3
                          </a>
                          <p className="p_dark">
                            {translate("Provide Vital Informations")}
                          </p>
                        </div>
                        <div className="stepwizard-step">
                          <a
                            href="#step-4"
                            type="button"
                            className="btn btn-default btn-circle light_circle"
                            disabled="disabled"
                          >
                            4
                          </a>
                          <p className="p_light">
                            {translate("History of Past Illness")}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="col-md-8">
                    <div className="purpose_box">
                      <div className="row pupose_l">
                        <div className="col-md-8 col-sm-8">
                          <h2 className="specify_head">
                            {translate("Enter your vital information")}{" "}
                            <span>({translate("Optional")})</span>
                          </h2>
                        </div>
                        <div className="col-md-4 col-sm-4 text-right toggle_all">
                          <p>{translate("All")}</p>
                          <label className="switch">
                            <input
                            id="main_check"
                              className="green_check"
                              type="checkbox"
                              onChange={this.handleSelectAll}
                              defaultChecked={this.state.checked}
                            />
                            <span className="slider round"></span>
                          </label>
                        </div>
                      </div>

                      <form onSubmit={this.onFormSubmit.bind(this)}>
                        <div className="row vital_info">
                          <div className="col-lg-12 col-md-12 col-sm-12 no_padding">
                            <div className="row">
                              <div className="col-md-4 col-sm-4 vital_space">
                                <div className="vital_info_box">
                                  <div>
                                    <h5>
                                      {translate("Height")}
                                     
                                    </h5>
                                    <label className="switch1">
                                      <input
                                        name="skip_height"
                                        className="blue_check"
                                        type="checkbox"
                                        value={
                                          this.state.fields["skip_height"] ||
                                          "0"
                                        }
                                        onChange={this.handleChange.bind(
                                          this,
                                          "skip_height"
                                        )}
                                      //  defaultChecked={this.state.isHeightSkipped} 
                                      // checked="false"                                      
                                      />
                                     
                                      <span className="slider round_1"></span>
                                    </label>
                                  </div>
                                  <div className="vital_value">
                                    {/* <p className="green_num_txt">75 </p> */}
                                    {/* <p>{this.state.fields["ftHeight"]}</p> */}
                                    <input
                                      maxLength="2"
                                      name="ftHeight"
                                      className="green_num_txt"
                                      value={
                                        this.state.fields["ftHeight"] || " "
                                      }
                                      onChange={this.handleChange.bind(
                                        this,
                                        "ftHeight"
                                      )}
                                      onKeyPress={this.handleChange.bind(
                                        this,
                                        "ftHeight"
                                      )}
                                      // disabled={this.state.isDisabled}
                                      // required={this.state.disabledRequired}
                                      disabled={this.state.isHeightDisabled}
                                    />
                                    
                                    {this.state.isHeightDisabled}
                                   
                                    <h6 className="info_txt">
                                      {translate("Feet")}{" "}
                                      {/* {this.state.fields["ftHeight"]} */}
                                    </h6>
                                    <br />
                                  </div>
                                  <div>
                                  <span className="cRed">
                                      {this.state.errors["ftHeight"]}
                                    </span>
                                    </div>
                                  <Slider
                                    value={this.state.fields["ftHeight"]}
                                    color="blue"
                                    settings={heightFeetSettings}
                                    disabled={this.state.isHeightDisabled}
                                  />
                                  <div className="vital_value">
                                    {/* <p className="green_num_txt">75 </p> */}
                                    <input
                                    maxLength="2"
                                      name="inHeight"
                                      className="green_num_txt"
                                      value={
                                        this.state.fields["inHeight"] || ""
                                      }
                                      onChange={this.handleChange.bind(
                                        this,
                                        "inHeight"
                                      )}
                                      // disabled={this.state.isDisabled}
                                      // required={this.state.disabledRequired}
                                      disabled={this.state.isHeightDisabled}
                                    />
                                   
                                    <h6 className="info_txt">
                                      {translate("Inch")}{" "}
                                      {/* {this.state.fields["inHeight"]} */}
                                    </h6>
                                  </div>
                                  <div>
                                  <span className="cRed">
                                      {this.state.errors["inHeight"]}
                                    </span>
                                    </div>
                                  <Slider
                                    value={this.state.fields["inHeight"]}
                                    color="blue"
                                    settings={heightInchSettings}
                                    disabled={this.state.isHeightDisabled}
                                  />
                                  ({this.state.fields.height} cm)
                                </div>
                              </div>
                              <div className="col-md-4 col-sm-4 vital_space">
                                <div className="vital_info_box">
                                  <div>
                                    <h5>
                                      {translate("Weight")}{" "}
                                      {/* {this.state.fields["skip_weight"]}{" "} */}
                                    </h5>
                                    <label className="switch1">
                                      <input
                                        name="skip_weight"
                                        className="blue_check"
                                        type="checkbox"
                                        value={
                                          this.state.fields["skip_weight"] ||
                                          "0"
                                        }
                                        onChange={this.handleChange.bind(
                                          this,
                                          "skip_weight"
                                        )}
                                       // defaultChecked={this.state.isWeightSkipped}  
                                      />
                                      <span className="slider round_1"></span>
                                    </label>
                                  </div>
                                  <div className="vital_value">
                                    {/* <p className="green_num_txt">22 </p> */}
                                    <input
                                    maxLength="5"
                                     name="weight"
                                      className="green_num_txt"
                                      value={this.state.fields["weight"] || ""}
                                      onChange={this.handleChange.bind(
                                        this,
                                        "weight"
                                      )}
                                      // disabled={this.state.isDisabled}
                                      // required={this.state.disabledRequired}
                                      disabled={this.state.isWeightDisabled}
                                    />
                                   
                                    <h6 className="info_txt">
                                      {/* {translate("Breath Per Minute")} */}
                                      {translate("kg")}
                                    </h6>
                                  </div>
                                  <div>
                                  <span className="cRed">
                                      {this.state.errors["weight"]}
                                    </span>
                                    </div>
                                  <Slider
                                    value={this.state.fields["weight"]}
                                    color="blue"
                                    settings={weightSettings}
                                    disabled={this.state.isWeightDisabled}
                                  />
                                </div>
                              </div>

                              <div className="col-md-4 col-sm-4 vital_space">
                                <div className="vital_info_box">
                                  <div>
                                    <h5>{translate("BMI")}</h5>
                                  </div>
                                  <div className="vital_value">
                                    {/* <p className="green_num_txt">103 </p> */}
                                    <input
                                      className="green_num_txt" id="bmii"
                                      value={isNaN(this.state.fields["bmi"]==true) ? "" :this.state.fields["bmi"] || " "}
                                      onChange={this.handleChange.bind(
                                        this,
                                        "bmi"
                                      )}
                                      // disabled={this.state.isDisabled}
                                      // required={this.state.disabledRequired}
                                      disabled={this.state.isBMIDisabled}
                                    />
                                    

                                    <h6 className="info_txt">
                                      {translate("Kg/m2")}
                                    </h6>
                                  </div>
                                  <div>
                                  <span className="cRed">
                                      {this.state.errors["bmi"]}
                                    </span>
                                    </div>
                                  <div className="vital_degree">
                                    <p className={this.state.bmiColor}></p>
                                    <h6 className="info_txt">
                                      {translate(bmidisplayStatus)}
                                    </h6>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="row">
                              <div className="col-md-4 col-sm-4 vital_space">
                                <div className="vital_info_box">
                                  <div>
                                    <h5>{translate("Temperature")}</h5>
                                    <label className="switch1">
                                      <input
                                        name="skip_temparature"
                                        className="blue_check"
                                        type="checkbox"
                                        value={
                                          this.state.fields[
                                            "skip_temparature"
                                          ] || "0"
                                        }
                                        onChange={this.handleChange.bind(
                                          this,
                                          "skip_temparature"
                                        )}
                                        onClick={() => {
                                          this.setState({
                                            checked: !this.state.checked,
                                          });
                                        }}
                                      //  defaultChecked={this.state.isTemparatureSkipped}  
                                      />
                                      <span className="slider round_1"></span>
                                    </label>
                                  </div>
                                  <div className="vital_value">
                                    {/* <p className="green_num_txt">75 </p> */}
                                    <input
                                    maxLength={3}
                                      name="temparature"
                                      className="green_num_txt"
                                      value={
                                        this.state.fields["temparature"] || ""
                                      }
                                      onChange={this.handleChange.bind(
                                        this,
                                        "temparature"
                                      )}
                                      onKeyUp={this.handleChange.bind(
                                        this,
                                        "temparature"
                                      )}
                                      // disabled={this.state.isDisabled}
                                      // required={this.state.disabledRequired}
                                      disabled={this.state.isTempDisabled}
                                    />
                                  
                                    <h6 className="info_txt">
                                      {translate("F")}
                                    </h6>
                                  </div>
                                  <div>
                                  <span className="cRed">
                                      {this.state.errors["temparature"]}
                                    </span>
                                    </div>
                                  <div className="vital_degree">
                                    {/* <p className="green_hr"></p>
                                    <p class="yellow_hr"></p> */}
                                    <p className={this.state.tempColor}></p>
                                    <h6 className="info_txt">
                                      {translate(tempDisplayText)}
                                    </h6>
                                  </div>
                                  <Slider
                                    value={this.state.fields["temparature"]}
                                    color="blue"
                                    settings={temparatureSettings}
                                    disabled={this.state.isTempDisabled}
                                  />
                                </div>
                              </div>
                              <div className="col-md-4 col-sm-4 vital_space">
                                <div className="vital_info_box">
                                  <div>
                                    <h5>{translate("Pulse")}</h5>
                                    <label className="switch1">
                                      <input
                                        name="skip_pulse"
                                        className="blue_check"
                                        type="checkbox"
                                        value={
                                          this.state.fields["skip_pulse"] || "0"
                                        }
                                        onChange={this.handleChange.bind(
                                          this,
                                          "skip_pulse"
                                        )}
                                        onClick={() => {
                                          this.setState({
                                            checked: !this.state.checked,
                                          });
                                        }}
                                      //  defaultChecked={this.state.isPulseSkipped}  
                                      />
                                      <span className="slider round_1"></span>
                                    </label>
                                  </div>
                                  <div className="vital_value">
                                    {/* <p className="green_num_txt">32 </p> */}
                                    <input
                                    maxLength={3}
                                      name="pulse"
                                      className="green_num_txt"
                                      value={this.state.fields["pulse"] || ""}
                                      onChange={this.handleChange.bind(
                                        this,
                                        "pulse"
                                      )}
                                      // disabled={this.state.isDisabled}
                                      // required={this.state.disabledRequired}
                                      disabled={this.state.isPulseDisabled}
                                    />
                                   
                                    <h6 className="info_txt">
                                      {translate("bpm")}
                                    </h6>
                                  </div>
                                  <div>
                                  <span className="cRed">
                                      {this.state.errors["pulse"]}
                                    </span>
                                    </div>
                                  <div className="vital_degree">
                                    <p className={this.state.pulseColor}></p>
                                    <h6 className="info_txt">
                                      {translate(pulsedisplayStatus)}
                                    </h6>
                                  </div>
                                  <Slider
                                    value={this.state.fields["pulse"]}
                                    color="blue"
                                    settings={pulseSettings}
                                    disabled={this.state.isPulseDisabled}
                                  />
                                </div>
                              </div>
                              <div className="col-md-4 col-sm-4 vital_space">
                                <div className="vital_info_box">
                                  <div>
                                    <h5>{translate("Blood Sugar")}</h5>
                                    <label className="switch1">
                                      <input
                                        name="skip_bloodsugar"
                                        className="blue_check"
                                        type="checkbox"
                                        defaultValue={
                                          this.state.fields[
                                            "skip_bloodsugar"
                                          ] || "0"
                                        }
                                        onChange={this.handleChange.bind(
                                          this,
                                          "skip_bloodsugar"
                                        )}
                                        onClick={() => {
                                          this.setState({
                                            checked: !this.state.checked,
                                          });
                                        }}
                                      //  defaultChecked={this.state.isBloodSugarSkipped}  
                                      />
                                      <span className="slider round_1"></span>
                                    </label>
                                  </div>
                                  <div className="vital_value">
                                    {/* <p className="green_num_txt">6.0" </p> */}
                                    <input
                                     maxLength={3}
                                      name="bloodsugar"
                                      className="green_num_txt"
                                      value={
                                        this.state.fields["bloodsugar"] || ""
                                      }
                                      onChange={this.handleChange.bind(
                                        this,
                                        "bloodsugar"
                                      )}
                                      // disabled={this.state.isDisabled}
                                      // required={this.state.disabledRequired}
                                      disabled={this.state.isBloodSugarDisabled}
                                    />
                                   
                                    <h6 className="info_txt">
                                      {translate("mg/dL")}
                                    </h6>
                                  </div>
                                  <div>
                                  <span className="cRed">
                                      {this.state.errors["bloodsugar"]}
                                    </span>
                                    </div>
                                  <div className="vital_degree">
                                    {/* <p className="green_hr"></p>
                                    <p class="yellow_hr"></p> */}

                                    <p
                                      className={this.state.bloodsugarColor}
                                    ></p>
                                    <h6 className="info_txt">
                                      {translate(bloodsugardisplayStatus)}
                                    </h6>
                                  </div>
                                  
                                  <Slider
                                    value={this.state.fields["bloodsugar"]}
                                    color="blue"
                                    settings={bloodsugarSettings}
                                    disabled={this.state.isBloodSugarDisabled}
                                  />
                                </div>
                              </div>
                            </div>
                            <div className="row">
                              <div className="col-md-4 col-sm-4 vital_space">
                                <div className="vital_info_box">
                                  <div>
                                    <h5>{translate("Respiratory Rate")}</h5>
                                    <label className="switch1">
                                      <input
                                        name="skip_respiratoryrate"
                                        className="blue_check"
                                        type="checkbox"
                                        id="skip_respiratoryrate"
                                        value={
                                          this.state.fields[
                                            "skip_respiratoryrate"
                                          ] || "0"
                                        }
                                        onChange={this.handleChange.bind(
                                          this,
                                          "skip_respiratoryrate"
                                        )}
                                        onClick={() => {
                                          this.setState({
                                            checked: !this.state.checked,
                                          });
                                        }}
                                      //  defaultChecked={this.state.isRespiratorySkipped}  
                                      />
                                      <span className="slider round_1"></span>
                                    </label>
                                  </div>
                                  <div className="vital_value">
                                    {/* <p className="green_num_txt">75 </p> */}
                                    <input
                                    maxLength={3}
                                      name="respiratoryrate"
                                      className="green_num_txt"
                                      id="respiratoryrate"
                                      value={
                                        this.state.fields["respiratoryrate"] ||
                                        ""
                                      }
                                      onChange={this.handleChange.bind(
                                        this,
                                        "respiratoryrate"
                                      )}
                                      // disabled={this.state.isDisabled}
                                      // required={this.state.disabledRequired}
                                      disabled={
                                        this.state.isRespiratoryDisabled
                                      }
                                    />
                                   
                                    <h6 className="info_txt">
                                      {translate("Breath Per Minute")}
                                    </h6>
                                  </div>
                                  <div>
                                  <span className="cRed">
                                      {this.state.errors["respiratoryrate"]}
                                    </span>
                                    </div>
                                  <div className="vital_degree">
                                    {/* <p className="green_hr"></p>
                                    <p class="yellow_hr"></p> */}

                                    <p
                                      className={this.state.respiratoryColor}
                                    ></p>
                                    <h6 className="info_txt">
                                      {translate(respiratorydisplayStatus)}
                                    </h6>
                                  </div>
                                  <Slider
                                    value={this.state.fields["respiratoryrate"]}
                                    color="blue"
                                    settings={respiratorySettings}
                                    disabled={this.state.isRespiratoryDisabled}
                                  />
                                </div>
                              </div>
                              <div className="col-md-8 col-sm-8 vital_space">
                                <div className="vital_info_box">
                                  <div>
                                    <h5>{translate("Blood Pressure")}</h5>
                                    <label className="switch1">
                                      <input
                                        name="skip_systolic"
                                        className="blue_check"
                                        type="checkbox"
                                        value={
                                          this.state.fields["skip_systolic"] ||
                                          "0"
                                        }
                                        onChange={this.handleChange.bind(
                                          this,
                                          "skip_systolic"
                                        )}
                                        onClick={() => {
                                          this.setState({
                                            checked: !this.state.checked,
                                          });
                                        }}
                                      //  defaultChecked={this.state.isBPSkipped}
                                      />
                                      <span className="slider round_1"></span>
                                    </label>
                                  </div>
                                  <div className="row">
                                    <div className="col-md-6 col-sm-6 no_padding">
                                      <div className="vital_value">
                                        {/* <p className="green_num_txt">120 </p> */}
                                        <input
                                        maxLength={3}
                                          name="systolic"
                                          className="green_num_txt"
                                          value={
                                            this.state.fields["systolic"] || ""
                                          }
                                          onChange={this.handleChange.bind(
                                            this,
                                            "systolic"
                                          )}
                                          // disabled={this.state.isDisabled}
                                          // required={this.state.disabledRequired}
                                          disabled={this.state.isBPDisabled}
                                        />
                                       
                                        <h6 className="info_txt">
                                          {/* {translate("Breath Per Minute")} */}
                                          {translate("mmHG")}
                                        </h6>
                                      </div>
                                      <div>
                                      <span className="cRed">
                                          {this.state.errors["systolic"]}
                                        </span>
                                        </div>
                                      <h4 className="temp_txt">Systolic</h4>
                                      <div className="vital_degree">
                                        <p
                                          className={this.state.systolicColor}
                                        ></p>
                                        <h6 className="info_txt">
                                          {translate(systolicdisplayStatus)}
                                        </h6>
                                      </div>
                                      <Slider
                                        value={this.state.fields["systolic"]}
                                        color="blue"
                                        settings={systolicSettings}
                                        disabled={this.state.isBPDisabled}
                                      />
                                    </div>
                                    <div className="col-md-6 col-sm-6 no_padding">
                                      <div className="vital_value">
                                        {/* <p className="yellow_num_txt">80 </p> */}
                                        <input
                                        maxLength={3}
                                          name="diastolic"
                                          className="green_num_txt"
                                          value={
                                            this.state.fields["diastolic"] || ""
                                          }
                                          onChange={this.handleChange.bind(
                                            this,
                                            "diastolic"
                                          )}
                                          onKeyUp={this.handleChange.bind(
                                            this,
                                            "diastolic"
                                          )}
                                          // disabled={this.state.isDisabled}
                                          // required={this.state.disabledRequired}
                                          disabled={this.state.isBPDisabled}
                                        />
                                      
                                        <h6 className="info_txt">
                                          {/* {translate("Breath Per Minute")} */}
                                          {translate("mmHG")}
                                        </h6>
                                      </div>
                                      <div>
                                      <span className="cRed">
                                          {this.state.errors["diastolic"]}
                                        </span>
                                        </div>
                                      <h4 className="temp_txt">Diastolic</h4>
                                      <div className="vital_degree">
                                        <p
                                          className={this.state.diastolicColor}
                                        ></p>
                                        <h6 className="info_txt">
                                          {translate(diastolicdisplayStatus)}
                                        </h6>
                                      </div>
                                      <Slider
                                        value={this.state.fields["diastolic"]}
                                        color="blue"
                                        settings={diastolicSettings}
                                        disabled={this.state.isBPDisabled}
                                      />
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                          <ToastContainer />
                        </div>

                        <div className="row">
                          <div className="col-md-6 col-sm-6 col-xs-6 text-left">
                            {/* <div className="back_btn" id={this.state.previousPage} onClick={this.goBack}>
                              <a href="#">
                                {" "}
                                <button>
                                  <img src="../images/patient/img/Patient Intake Process/arrow_black.svg" />
                                  {translate("Back")}
                                </button>
                              </a>
                            </div> */}
                            
                            <div class="back_btn"  id={this.state.previousPage} onClick={this.goback} >
                              <p id={this.state.previousPage}>
                                <img src="../images/patient/img/Patient Intake Process/arrow_black.svg" id={this.state.previousPage}/>
                                {translate("Back")}
                              </p>
                            </div>
                          </div>

                          <div
                            class="col-md-6 col-sm-6 col-xs-6 text-right"
                            onCLick={this.onFormSubmit.bind(this)}
                          >
                            <div class="next_btn">
                              <button
                                type="submit"
                                className="btn btn-default Next_btn_profile"
                              >
                                {translate("Save")} & {translate("Next")}
                              </button>
                            </div>
                          </div>

                          {/* <div className="col-md-6 col-sm-6 col-xs-6 text-right">
                          <div className="next_btn">
                            <a href="#">
                              {" "}
                              <button>
                                {translate("Save")} & {translate("Next")}
                                <img src="../images/patient/img/Patient Intake Process/arrow.svg" />
                              </button>
                            </a>
                          </div>
                        </div> */}
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
          {/* <PatientFooter/> */}
        </I18nPropvider>
      </main>
    );
  }
}
