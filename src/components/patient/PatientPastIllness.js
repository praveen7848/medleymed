import React, { Component, useState } from "react";
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
import FileBase64 from "react-file-base64";


export default class PatientPastIllness extends Component {
  constructor(props) {
    super(props);
    const appointmentId = localStorage.getItem("appointment_id");
    this.state = {
      fields: {},
      errors: {},
      files: [],
      appointmentId: appointmentId,
      medicineOptions: [],

      pageNumber: 1,

      medicineArray: [],
      selectedMedicineList: {},
      selectedMedicineValue: [],

      drugAllergiesOptions: [],
      drugAllergiesArray: [],
      selectedDrugList: {},
      selectedDrugValue: [],
      diseases:"",
      medicines:"",
      drug:"",
    };
  // this.goBack=this.goBack.bind(this);
   //this.goBack = this.goBack.bind(this);
  }

  componentDidUpdate = () => {
    var lang = localStorage.getItem("Language_selected");
    if (lang != null) {
      if (this.state.Language != lang) {
        this.state.Language = lang;
       // // // // console.log("notnull " + this.state.Language);
        this.forceUpdate();
      }
    } else {
      this.state.Language = "en-us";
      // // // console.log(this.state.Language);
    }
    var imgs=document.getElementsByClassName("del_img");
    for (let i = 0; i < imgs.length; i++) {
     imgs[i].addEventListener("click", function(event) {
     //alert("in");
       // this.setState({
       //   sorting:[event.target.id],
       // })
      // alert(event.currentTarget.id);
       this.removeLoadedImageOnClick(event.currentTarget.id);
     }.bind(this))
     
   }
  };

  removeLoadedImageOnClick=(imageName)=>{
  $('.'+imageName).remove();
  let imagPath=$('.'+imageName).attr('id');
  //// // // console.log(this.state.medicalDocument);
  
  var array = this.state.medicalDocument; // make a separate copy of the array
  // // // console.log(array);
  //var index = array.indexOf(imagPath)
  var index = array.findIndex((item) => item.name === imageName);
  if (index !== -1) {
    array.splice(index, 1);
    this.setState({medicalDocument: array});
    this.forceUpdate();
  }


  }
  // To get detais after first render
  componentDidMount = () => {
    var retrievedObject = localStorage.getItem("userObj");
    var appointmentId=localStorage.getItem('appointmentId');
    var patient_id=localStorage.getItem('SelectedPatientId');
    this.state.appointmentId=appointmentId;
    this.fetchmedicinedata(this.state.pageNumber);
    //this.fetchdrugdata();

    let userData = JSON.parse(retrievedObject);
    if(patient_id!=null || patient_id!=""){
    //  alert("in");
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
      });

      let appointmentId = this.state.appointmentId;
      let patientId = userData.patient_id;
      this.state.clinicId=userData.clinic_id;
      //this.state.clinicId=1;
      this.fetchpastillnessData(patientId);  
      this.getPatientSavedHpiInfo(patientId, appointmentId);
      this.getPatientRelations(patientId);
      let i=0;
      let selected="";
     
          
      
    } else {
      window.location.href = "/";
    }
  };

  getPatientRelations=(patientId)=>{ 
    Httpconfig.httptokenget(Constant.siteurl + "api/Patients/findpatientrealtives/"+patientId, {
    
    })
       .then((response) => { 
           /* Assiging consulation purpose to the state */

           let profile_pic="";
           if(Object.keys(response.data.data).length>0){
           if(response.data.data[0].profile_pic!=null){
             profile_pic=Constant.imgurl+response.data.data[0].profile_pic;
          }else{ 
           let gender=response.data.data[0].gender;
            if(gender.toLowerCase()=="male"){
              profile_pic= "../images/patient/img/Profile/Male_patient.svg";
            }else{
              profile_pic= "../images/patient/img/Profile/Female_patient.svg";
              
            }
          }
         }
          
           
           let stateRelationsOptions = response.data.data.map((data, index) => ({
            key: data.id,
            text: data.name+" ("+data.master_relationship.relation_name+")",
            value: data.relation_patient_id,
            image: profile_pic,
  
          }))
        //  alert(stateRelationsOptions[0].value);
          this.setState({
            stateRelationsOptions:stateRelationsOptions,
            defaultValue:stateRelationsOptions[0].value,
          })
          

          
        })
       .catch((error) => {
          toast.error(error);
       });
}


  // To get all the MedicalInfo
  getPatientSavedHpiInfo(patientId, appointmentId) {
    Httpconfig.httptokenget(
      Constant.siteurl + "api/hpi/" + patientId + "/" + appointmentId + "/"+this.state.clinicId
    )
      .then((response) => {
        // // // // console.clear();
        //// // // console.log(response);
       // alert(Object.keys(response.data.data).length);
        
//alert(response.status);
        if (response.status==200 ) {
          
           // alert(response.data.previouspage.web_reference_page_name);
            let previousPage=response.data.previouspage.web_reference_page_name;
            let nextPage=response.data.nextpage.web_reference_page_name;
            this.state.previousPage=previousPage;
            this.state.nextPage=nextPage;
          
          let responseLog = response;
          let patientCurrentMedication ="";
          let pastHistory ="";
          let medicalDocument = "";
          let patientDrugAllergies = "";
          
if(response.data.data!=""){
          if(Object.keys(response.data.data[0].patient_current_medication).length>0){
            patientCurrentMedication = response.data.data[0].patient_current_medication;
          }
          
          pastHistory = response.data.data[0].past_history;
          medicalDocument = response.data.data[0].patient_medical_document;
          patientDrugAllergies = response.data.data[0].patient_drug_allergies;
          
          
        }
        
        let imagedata=[];
          let documentsCount=Object.keys(medicalDocument).length;
          //alert(documentsCount);
          let Image="";
          //alert(documentsCount);
          // for(let count=0;count<documentsCount;count++){
          //   imagedata[count]='<div class="med_upload_box"><img src='+imgurl+medicalDocument[count].replace("jpeg",'jpg')+'></div>';
          // }
           
          for(let count=0;count<documentsCount;count++){
            Image="";
            let imageUrlRaw="upload_presc_img "+medicalDocument[count].replace("jpeg","").replaceAll("/","").replace(".","");
            Image=Image+'<div class="'+imageUrlRaw+'" id="'+medicalDocument[count].replace("jpeg","jpg")+'">';
            Image=Image+'<a href="#" class="thumbnail" data-toggle="modal" data-target="#lightbox" >'; 
            Image=Image+'<img src='+Constant.imgurl+medicalDocument[count].replace("jpeg",'jpg')+' /></a>';
            Image=Image+'<div class="upload_top_img"><a href="#" class="thumbnail" data-toggle="modal" data-target="#lightbox"></a>';
            Image=Image+'<img class="fl_img" src="https://www.iconninja.com/files/924/926/503/fullscreen-icon.png" /> <img class="del_img" id="'+medicalDocument[count].replace("jpeg",'').replaceAll("/",'').replace(".",'')+'" src="https://icons.iconarchive.com/icons/danieledesantis/playstation-flat/512/playstation-cross-black-and-white-icon.png" /></div></div>';
            imagedata[count]=Image;
          }
          
         // alert(patientCurrentMedication); 
          //// // // console.log(patientCurrentMedication);
          let objDrug=Object.keys(this.state.selectedDrugValue).length; 
         // alert(objDrug);
         
          let objMed=Object.keys(this.state.selectedDrugValue).length;
          
          let objHistory=Object.keys(this.state.past_medical_history).length;
          
          
          let objMedSaved=Object.keys(patientCurrentMedication).length;
          
          let objDrugSaved=Object.keys(patientDrugAllergies).length;
         // alert(objDrugSaved);
         
          if(objDrug>0 && objDrugSaved==0){
           this.state.selectedDrugValue=[...this.state.selectedDrugValue,...patientDrugAllergies];
           this.state.selectedDrugList=[...this.state.selectedDrugValue,...patientDrugAllergies];
          }else{
           this.state.selectedDrugValue=patientDrugAllergies;
           this.state.selectedDrugList=patientDrugAllergies;
          }
          
          if(objMed>0 && objMedSaved==0){
            this.state.selectedMedicineList=[...this.state.selectedMedicineValue,...patientCurrentMedication];
            this.state.selectedMedicineValue=[...this.state.selectedMedicineValue,...patientCurrentMedication];
            //this.state.selectedMedicineValue= this.state.selectedMedicineValue.concat([patientCurrentMedication]);
           // this.state.selectedMedicineValue.push(patientCurrentMedication);
          }else{
            this.state.selectedMedicineValue=patientCurrentMedication;
            this.state.selectedMedicineList=patientCurrentMedication;
          }
          //alert(objHistory);
          if(objHistory>0){
          this.setState({
            fields: {
              past_medical_history:pastHistory,
            },
           // selectedDrugValue: this.state.selectedDrugValue.concat([patientDrugAllergies]),
            
            
          //  selectedDrugList:this.state.selectedDrugValue.concat([patientDrugAllergies]),
          });
        }else{
          this.setState({
            fields: {
              past_medical_history:pastHistory,
            },
            
          });

        }
       // alert(imagedata);
        this.state.medicalDocument=imagedata;
        this.forceUpdate();
          //alert(this.state.medicalDocument);
          // // // // console.clear();
          // // // // console.log(this.state.selectedMedicineList);
          // // // // console.log(Constant.siteurl + medicalDocument);
          // return;
        }
        //else{alert("out");}
      })
      .catch((error) => {
        // // // console.log(error);
      });
  }

  fetchmedicinedata(pageNumber) {
    Httpconfig.httptokenget(
      // Constant.siteurl + "api/productMaster/" + pageNumber
      Constant.siteurl + "api/productMaster"
    ).then((response) => {
      // // // // console.clear();
      let finalLoadedData = response.data.data;
      // let currentDataArray = this.state.medicineOptions;
      // if (pageNumber > 1) {
      //   finalLoadedData = currentDataArray.concat(finalLoadedData);
      // }
      this.setState({
        medicineOptions: finalLoadedData,
        medicineArray: finalLoadedData,
        drugAllergiesOptions: finalLoadedData,
        drugAllergiesArray: finalLoadedData,
      });
      // // // // console.log(finalLoadedData.length);
    });
  }

  fetchdrugdata(event) {
    // alert("in");
    // Httpconfig.httptokenget(Constant.siteurl + "api/Healthosmedicine/1").then((response) => {
    let searched=event.target.value;
   
   //alert(event.currentTarget.value);
   //alert(searched);
    //alert
    Httpconfig.httptoken(
     // Constant.siteurl + "api/Category?category_type=Drug%20Type"
      // Constant.siteurl + "api/getDrugAllergies",{
        Constant.siteurl + "api/productMaster",{
        // med_name:searched,
      }
    ).then((response) => {
      this.setState({
        drugAllergiesOptions: response.data.data,
        drugAllergiesArray: response.data.data,
      });
    });
  }


  fetchpastillnessData(patiendId) {
    Httpconfig.httptokenget(
      Constant.siteurl + "api/Patients/"+patiendId
    ).then((response) => {
      let prevDrugLoadedData="";
      let prevMedicationLoadedData="";
      let diseases="";
      // // // // console.clear();
     // alert(Object.keys(response.data.data).length);
     // alert(response.data.data[0].chornic_diseases_list);
      if(Object.keys(response.data.data).length>0) {
      if(response.data.data[0].chornic_diseases_list){
      diseases=response.data.data[0].chornic_diseases_list;
      }
      let drug="";
      let medicines="";
      
      //alert(response.data.data[0].drug_allergies);
      //// // // console.log(response.data.data[0].drug_allergies);
      if(response.data.data[0].drug_allergies){
       prevDrugLoadedData = response.data.data[0].drug_allergies;
      }
      if(response.data.data[0].related_medication){
       prevMedicationLoadedData = response.data.data[0].related_medication;
      }
     // const interval = setInterval(() => {
       //alert("in");
       
       //// // // console.log(prevDrugLoadedData);
       //alert(prevDrugLoadedData);
        this.state.selectedMedicineValue=prevMedicationLoadedData;      
        this.state.selectedDrugValue=prevDrugLoadedData;
        this.state.past_medical_history=diseases;
        
     // }, 100);
     
      this.forceUpdate();
     //alert(prevDrugLoadedData);
      let diseasesLst="";
  //alert(diseases);
      if(diseases!=""){
      if(diseases.indexOf(",")!=-1){
      let dlist=diseases.split(",");
      
      for(let len=0;len<dlist.length;len++)
      {
        if(dlist[len]!=""){
          diseasesLst=diseasesLst+"<p>"+dlist[len]+"</p>";
        }
      }
      

  $('.hist_cts').html("<h4>Chronic conditions:</h4>" +diseasesLst);
  $('#past_medical_history').val(diseases);
    }else{
      $('.hist_cts').html("<h4>Chronic conditions:</h4>" +diseases);
      $('#past_medical_history').val(diseases);

    }
}

  }
  
    });
  }

  handleChange = (field, event) => {
    let fields = this.state.fields;
    fields[field] = event.target.value;
    this.setState({ fields });
   //alert(event.target.value);
  };

  onMedicineSelect = (selectedMedicineListdata, selectedItem) => {
    this.setState({
      selectedMedicineList: selectedMedicineListdata,
    });
  };

  onMedicineRemove = (deselectedMedicineList, removedItem) => {
    this.setState({
      selectedMedicineList: deselectedMedicineList.map((x) => x.id),
    });
    // // // console.log(Object.assign({}, this.state.selectedMedicineList));
  };

  // For Drug Allergies Select
  onDrugMedicineSelect = (selectedDrugMedicineListdata, selectedItem) => {
    this.setState({
      selectedDrugList: selectedDrugMedicineListdata,
    });
  };
  // Ends

  // For Drug Allergies Remove
  onDrugMedicineRemove = (deselectedDrugMedicineList, removedItem) => {
    this.setState({
      selectedDrugList: deselectedDrugMedicineList.map((x) => x.id),
    });
    // // // console.log(Object.assign({}, this.state.selectedDrugList));
  };
  // Ends

  // create or update
  checkPastPMedicalrofileSubmit(event) {
    event.preventDefault();
    const { handle } = this.props.match.params;
    // if (this.handleHealthProfileValidation() && handle == undefined) {
    this.createPatientMedicalProfile(event);
    // } else {
    //   toast.warn("Form has errors.");
    // }
  }

  // Callback~
  getFiles(files) {
    let objLen=(Object.keys(this.state.files).length);
    
    
    if(objLen>0){
      this.state.files=[...this.state.files,...files];
    }else{
      this.setState({ files: files });
    }
    this.forceUpdate();
    // // // // console.log(this.state.files[0].base64);
    // // // // console.log(this.state.files);
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
  goback=(event)=>{
   // alert(event.currentTarget.id);
    window.location.href = "./"+event.currentTarget.id;
  }
  

  createPatientMedicalProfile = (event) => {
    event.preventDefault();
    const { fields, errors } = this.state;
    // // // // console.clear();
    // // // // console.log(this.state.files);
    // // // // console.log(this.state);
    // // // // console.log(this.state.fields["past_medical_history"]);
    // // // // console.log(this.state.selectedDrugList);
    // // // // console.log(this.state.selectedMedicineList);
    // alert("Medical History submitted");
    // return;
    // setTimeout(() => this.props.history.push("/availabledoctors"), 2000);
    // Don't Delete Below Lines
    // medicaldoc_pic: fields["coupon_name"],
    // patient_id: "25",
    // patient_current_medication: this.state.selectedMedicineList,
    // patient_drug_allergies: this.state.selectedDrugList,
    // appointment_id: "254",
    // past_history: this.state.fields['past_medical_history'],

    let userMedicineList = [];
    let userDrugAllergies = [];
    if (Object.keys(this.state.selectedMedicineList).length != 0) {
      userMedicineList = this.state.selectedMedicineList;
    }

    if (Object.keys(this.state.selectedDrugList).length != 0) {
      userDrugAllergies = this.state.selectedDrugList;
    }
    //// // // console.clear();
    //// // // console.log(userMedicineList);
    //// // // console.log(userDrugAllergies);
    let url_path = "api/hpi/";
    Httpconfig.httptokenpost(Constant.siteurl + url_path, {
      patient_id: this.state.patient_id,
      appointment_id: this.state.appointmentId,
      symptoms: this.state.selectedSymptomsList,
      past_history: this.state.fields["past_medical_history"],
      patient_current_medication: userMedicineList,
      patient_drug_allergies: userDrugAllergies,
      medicaldoc_pic:this.state.files,
      clinic_id:this.state.clinicId,
      //this.state.files[0].base64,
       // "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAASwAAAEsCAIAAAD2HxkiAAADl0lEQVR4nO3ZMYrDQBREwR7j+19Zip0JHLxAVWy0IHDyaJh/tmu7zu/ftvPon/Otb33757efAanvTv0T4N1ECDERQkyEEBMhxLyOQswSQkyEEBMhxEQIMRFCTIQQc6KAmCWEmAghJkKIiRBiIoSYCCHmRAExSwgxEUJMhBATIcRECDGvoxCzhBATIcRECDERQkyEEBMhxJwoIGYJISZCiIkQYiKEmAghJkKIOVFAzBJCTIQQEyHERAgxEULM6yjELCHERAgxEUJMhBATIcRECDEnCohZQoiJEGIihJgIISZCiIkQYk4UELOEEBMhxEQIMRFCTIQQ8zoKMUsIMRFCTIQQEyHERAgxEULMiQJilhBiIoSYCCEmQoiJEGIihJgTBcQsIcRECDERQkyEEBMhxLyOQswSQkyEEBMhxEQIMRFCTIQQc6KAmCWEmAghJkKIiRBiIoSYCCHmRAExSwgxEUJMhBATIcRECDGvoxCzhBATIcRECDERQkyEEBMhxJwoIGYJISZCiIkQYiKEmAghJkKIOVFAzBJCTIQQEyHERAgxEULM6yjELCHERAgxEUJMhBATIcRECDEnCohZQoiJEGIihJgIISZCiIkQYk4UELOEEBMhxEQIMRFCTIQQ8zoKMUsIMRFCTIQQEyHERAgxEULMiQJilhBiIoSYCCEmQoiJEGIihJgTBcQsIcRECDERQkyEEBMhxLyOQswSQkyEEBMhxEQIMRFCTIQQc6KAmCWEmAghJkKIiRBiIoSYCCHmRAExSwgxEUJMhBATIcRECDGvoxCzhBATIcRECDERQkyEEBMhxJwoIGYJISZCiIkQYiKEmAghJkKIOVFAzBJCTIQQEyHERAgxEULM6yjELCHERAgxEUJMhBATIcRECDEnCohZQoiJEGIihJgIISZCiIkQYk4UELOEEBMhxEQIMRFCTIQQ8zoKMUsIMRFCTIQQEyHERAgxEULMiQJilhBiIoSYCCEmQoiJEGIihJgTBcQsIcRECDERQkyEEBMhxLyOQswSQkyEEBMhxEQIMRFCTIQQc6KAmCWEmAghJkKIiRBiIoSYCCHmRAExSwgxEUJMhBATIcRECDGvoxCzhBATIcRECDERQkyEEBMhxJwoIGYJISZCiIkQYiKEmAghJkKIOVFAzBJCTIQQEyHERAgxEULM6yjELCHERAgxEUJMhBATIcRECDEnCohZQoiJEGIihJgIISZCiN0HtAVfIctU0QAAAABJRU5ErkJggg==",
    })
      .then((response) => {
        if (response.status == 200) {
          let next_page = response.data.nextpage.web_reference_page_name;
          toast.success("👌 "+response.data.message, {
            position: "bottom-center",
          });
          
          setTimeout(() => window.location.href="/"+next_page
         // this.props.history.push("/" + next_page)
          , 2000);
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
  ImageZoomClick=(event)=>{
  this.setState({
    zoomimage:event.currentTarget.src,
  })
  }
  removeImageOnClick=(event)=>{
    let imageName=event.currentTarget.id.replace("img_","");
    $('#'+imageName).remove();
    $('.'+imageName).remove();
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
  handleLanguage = (langValue) => {
    this.setState({ Language: langValue });
  };
  
  render() {
    const { fields } = this.state;
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
    var retrievedObject=localStorage.getItem('userObj');
    let patient_id="";
    if(retrievedObject!=null){
    let userData=JSON.parse(retrievedObject);
     patient_id=userData.patient_id
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
                    <h4>{translate("Enter the details for")}…</h4>
                    <Dropdown
                      placeholder="I do not open on focus"
                      openOnFocus={false}
                      selection
                      options={this.state.stateRelationsOptions}
                      defaultValue={patient_id}
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
                            className="btn btn-primary btn-circle"
                            disabled="disabled"
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
                            className="btn btn-primary btn-circle"
                            disabled="disabled"
                          >
                            {" "}
                            <img src="../images/patient/img/Patient Intake Process/tickmark.svg" />
                          </a>
                          <p className="p_dark  p_green">
                            {translate("Specify Symptoms")}
                          </p>
                        </div>
                        <div className="stepwizard-step">
                          <a
                            href="#step-3"
                            type="button"
                            className="btn btn-primary btn-circle"
                            disabled="disabled"
                          >
                            <img src="../images/patient/img/Patient Intake Process/tickmark.svg" />
                          </a>
                          <p className="p_dark  p_green">
                            {translate("Provide Vital Informations")}
                          </p>
                        </div>
                        <div className="stepwizard-step">
                          <a
                            href="#step-4"
                            type="button"
                            className="btn btn-circle"
                          >
                            4
                          </a>
                          <p className="p_dark">
                            {translate("History of Past Illness")}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="col-md-8">
                    <form
                      onSubmit={this.checkPastPMedicalrofileSubmit.bind(this)}
                    >
                      <div className="purpose_box">
                        <div className="row pupose_l">
                          <div className="col-md-12 col-sm-12">
                            <h2 className="specify_head">
                              {translate("History of Past Illness")}
                              <span>({translate("Optional")})</span>
                            </h2>
                          </div>
                        </div>
                        <div className="history_box">
                          <div className="row ">
                            <div className="col-md-12">
                              <div className="history_head">
                                <h3>
                                  {translate("Past Medical History")} /{" "}
                                  {translate("Social History")}{" "}
                                  <span>({translate("Optional")})</span>
                                </h3>
                              </div>
                              <div className="hist_cts">
                              {/* {this.state.medicines} */}
                                <h4>{translate("Chronic conditions")}:</h4>
                                {/* <p>Diabetes</p> */}
                                {/* <p>{translate("Diabetes")}</p> */}
                                {/* {// // // console.log(this.state.diseases)}  */}    
                              </div>
                              <div className="history_input">
                                <FormattedMessage id="eg. I had jaundice 2 months back">
                                  {(placeholder) => (
                                    <textarea
                                      name="past_medical_history"
                                      id="past_medical_history"
                                      className="form-control"
                                      rows="2"
                                      value={
                                        this.state.fields[
                                          "past_medical_history"
                                        ] || ""
                                      }
                                      onChange={this.handleChange.bind(
                                        this,
                                        "past_medical_history"
                                      )}
                                      placeholder={placeholder}
                                      // placeholder="eg. I had jaundice 2 months back"
                                    ></textarea>
                                  )}
                                </FormattedMessage>

                                {/* <textarea
                                  name="past_medical_history"
                                  className="form-control"
                                  rows="2"
                                  value={
                                    this.state.fields["past_medical_history"] ||
                                    ""
                                  }
                                  onChange={this.handleChange.bind(
                                    this,
                                    "past_medical_history"
                                  )}
                                  // placeholder="eg. I had jaundice 2 months back"
                                ></textarea> */}
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="history_box">
                          <div className="row ">
                            <div className="col-md-12">
                              <div className="history_head">
                                <h3>
                                  {translate("Add Current Medication")}{" "}
                                  <span>({translate("Optional")})</span>
                                </h3>
                              </div>
                              {/* <div className="hist_cts">
                                <h4>{translate("Chronic conditions")}:</h4>
                              
                                <p>{translate("Diabetes")}</p>
                              </div> */}
                              <div
                                className="history_input"
                                onScroll={this.handleScroll}
                              >
                                {/* <p> */}
                                {/* Dolo 360{" "} */}
                                {/* <img src="img/Patient Intake Process/cross_circle.svg" /> */}
                                {/* </p> */}
                                {/* <input
                                  type="text"
                                  className="form-control"
                                  placeholder="eg.Abacavir- Oral"
                                /> */}
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
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="history_box">
                          <div className="row ">
                            <div className="col-md-12">
                              <div className="history_head">
                                <h3>
                                  {translate("Drug Allergies")}
                                  <span>({translate("Optional")})</span>
                                </h3>
                              </div>
                              {/* <div className="hist_cts">
                                <h4>{translate("Chronic conditions")}:</h4>
                                <p>{translate("Diabetes")}</p>
                              </div> */}
                              <div className="history_input">
                                {/* <p>
                                  Dolo 360{" "} */}
                                {/* <img src="img/Patient Intake Process/cross_circle.svg" /> */}
                                {/* </p> */}
                                {/* <input
                                  type="text"
                                  className="form-control"
                                  placeholder="eg.Abacavir- Oral"
                                /> */}

                                <Multiselect
                                onSearch={this.state.medicineOptions}
                                  onChange={this.handleChange.bind(
                                    this,
                                    "drug_allergies"
                                  )}
                                  name="drug_allergies"
                                  options={this.state.drugAllergiesOptions} // Options to display in the dropdown
                                  value={this.state.selectedDrugList || ""}
                                  selectedValues={
                                    this.state.selectedDrugValue
                                  } // Preselected value to persist in dropdown
                                  onSelect={this.onDrugMedicineSelect} // Function will trigger on select event
                                  placeholder="Select Drug"
                                  onRemove={this.onRemove} // Function will trigger on remove event
                                  displayValue="medicinename" // Property name to display in the dropdown options
                                />
                                {/* <Multiselect
                                //filter="false"
                                //onSearch={this.fetchdrugdata}
                                  onChange={this.handleChange.bind(
                                    this,
                                    "drug_allergies"
                                  )}
                                  
                                  onChange={this.fetchdrugdata}
                                  name="drug_allergies"
                                  options={this.state.drugAllergiesOptions} // Options to display in the dropdown
                                  value={this.state.selectedDrugList || ""}
                                  selectedValues={this.state.selectedDrugValue} // Preselected value to persist in dropdown
                                  onSelect={this.onDrugMedicineSelect} // Function will trigger on select event
                                  placeholder="Select Drug"
                                  onRemove={this.onRemove} // Function will trigger on remove event
                                 // displayValue="category" // Property name to display in the dropdown options
                                 displayValue="product_group_name"
                                /> */}
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="history_box">
                          <div className="row ">
                            <div className="col-md-12">
                              <div className="history_head">
                                <h3>{translate("Add Medical Document")}</h3>
                              </div>

                              <div className="Doc_img">
                              <div dangerouslySetInnerHTML={{ __html: this.state.medicalDocument }} />
                             {/* {medicalDocument} */}
                             
                                {documentsRelated}
                                {/* <div class="upload_presc_img">
                <a href="#" class="thumbnail" data-toggle="modal" data-target="#lightbox"> 
                <img src="https://indimedo.com/public/assets/img/sample.png" />
                </a>
                <div class="upload_top_img">
                  <a href="#" class="thumbnail" data-toggle="modal" data-target="#lightbox">
                <img class="fl_img" src="https://www.iconninja.com/files/924/926/503/fullscreen-icon.png" />
              </a>
               <img class="del_img" src="https://icons.iconarchive.com/icons/danieledesantis/playstation-flat/512/playstation-cross-black-and-white-icon.png" />
              </div>
              </div> */}
                                <div className="upload-group">
                                  <span className="btn-file">
                                    <img src="../images/patient/img/upload.svg" />
                                    {/* <input
                                      type="file"
                                      accept="image/png, image/jpeg, image/gif"
                                    /> */}
                 
                                    <FileBase64
                                      multiple={true}
                                      onDone={this.getFiles.bind(this)}
                                    />
                                    <p>{translate("Upload Document")}</p>
                                  </span>
                                </div>
                
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="row">
                          <div className="col-md-6 col-sm-6 col-xs-6 text-left">
                            <div class="col-md-6">
                            
                              <div class="back_btn" id={this.state.previousPage} onClick={this.goback} >
                                <p id={this.state.previousPage}>
                                  <img src="../images/patient/img/Profile/arrow_black.svg" id={this.state.previousPage}/>
                                  {translate("Back")}
                                </p>
                              </div>
                            </div>
                          </div>
                          <div className="col-md-6 col-sm-6 col-xs-6 text-right">
                            <div class="next_btn">
                              <button
                                type="submit"
                                className="btn btn-default Next_btn_profile"
                              >
                                {translate("Save")} & {translate("Next")}
                              </button>
                            </div>
                          </div>
                        </div>
                        {/* {this.state.files[0]} */}
                                  {/* <!-- modal for image gallery --> */}
  <div id="lightbox" class="modal fade" tabindex="-1" role="dialog" aria-labelledby="myLargeModalLabel" aria-hidden="true">
    <div class="modal-dialog">
        <button type="button" class="close hidden" data-dismiss="modal" aria-hidden="true">×</button>
        <div class="modal-content">
            <div class="modal-body">
                <img src={this.state.zoomimage} alt="" />
            </div>
        </div>
    </div>
</div>
                        <ToastContainer />
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </I18nPropvider>
        <PatientFooter />
      </main>
    );
  }
}
