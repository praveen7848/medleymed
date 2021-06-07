import React, { Component, useState } from 'react';
import $ from "jquery";
import { ToastContainer, toast } from 'react-toastify';

import { Link } from "react-router-dom";
import Httpconfig from "../helpers/Httpconfig";


import Patnewcss from "../../public/css/patient/style-new.css";
import { Multiselect } from "multiselect-react-dropdown";
import Constant from "../../constants";
import { FormattedMessage } from "react-intl"; // Backup Way to Convert
import { I18nPropvider, LOCALES } from '../../i18nProvider';
import translate from "../../i18nProvider/translate";
import PatientHeader from "../patient/Patientheader";
import PatientMenu from "../patient/Patientmenu";
import PatientFooter from "../patient/Patientfooter";
const moment = require("moment");

export default class Patientadd extends Component {

   constructor(props) {
      super(props);

      this.state = {
         showlogin: true,
         showsignup: false,
         Language: localStorage.getItem("Language_selected"),

         chronic: '',
         medicineOptions: [],
         medicineArray: [],
         selectedMedicineList: {},
         selectedMedicineValue: [],

         drugAllergiesOptions: [],
         drugAllergiesArray: [],
         selectedDrugList: {},
         selectedDrugValue: [],
         
         patientId:"",
         pageNumber: 1,

      };
      this.addPatient = this.addPatient.bind(this);
      this.goBack = this.goBack.bind(this);
      this.skipPage = this.skipPage.bind(this);
      this.fetchduserdata=this.fetchduserdata.bind(this);
      

   }
   fetchduserdata=(patientId)=>{
     
    if(patientId!=""){
      let url_path="api/Patients/"+patientId;
      Httpconfig.httptokenget(Constant.siteurl + url_path, {
      })
         .then((response) => {
          if(response.data.status==200 && response.data.error==false){
            
             let patientName=response.data.data[0].name;
             let patientMobile=response.data.data[0].phone_number;
             let PatientGender=response.data.data[0].gender;
             let patientProfileImage=response.data.data[0].profile_pic;
             let patientDob=response.data.data[0].dob;
             let chronic=response.data.data[0].chornic_diseases_list;
             var memberId = localStorage.getItem('currentMemberId');
              this.setState({
                  patientName:patientName,
                  patientMobile:patientMobile,
                  checked:PatientGender,
                  patientProfileImage:patientProfileImage,
                  patientDob:moment(patientDob).format('DD/MM/YYYY'),
                  chronic:chronic,
                  patientId:patientId,
                  selectedMedicineValue:response.data.data[0].related_medication,
                  selectedDrugValue:response.data.data[0].drug_allergies,
                  // patientId:patientId,
              })
          }
         })
         .catch((error) => {
          this.props.history.push("/patienthealthprofile");
            console.log(error);
           toast.error(error);
         });
        }
   }
   componentDidUpdate = () => {
      var lang = localStorage.getItem('Language_selected');
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
   }
   

   // To get detais after first render
   componentDidMount = () => {
    var retrievedObject=localStorage.getItem('userObj');
    let userData=JSON.parse(retrievedObject)
    //alert(retrievedObject);
    if(retrievedObject!=null || retrievedObject!=null ){

       let patientId=userData.patient_id;
        this.setState({
           patientId:patientId,
        })
     
      // this.fetchduserdata(patientId);
      this.fetchduserdata(patientId);
      this.fetchmedicinedata(this.state.pageNumber);
      this.fetchdrugdata();
      
    }else{
      window.location.href = "/";
    }
    
    
     
   }

   handleScroll = (e) => {
      const bottom =
        Number((e.target.scrollHeight - e.target.scrollTop).toFixed(0)) - e.target.clientHeight < 50;
      let page = this.state.page;
      if (bottom) {
        let page = this.state.pageNumber;
        this.setState({ pageNumber: page + 1 });
        this.fetchmedicinedata(this.state.pageNumber);
      }
    };


   // fetchmedicinedata() {
   //    Httpconfig.httptokenget(Constant.siteurl + "api/Healthosmedicine/1").then((response) => {
   //       this.setState({
   //          medicineOptions: response.data,
   //          medicineArray: response.data
   //       })
   //    });
   // }

   fetchmedicinedata(pageNumber) {
      Httpconfig.httptokenget(
      //   Constant.siteurl + "api/productMaster/" + pageNumber
      Constant.siteurl + "api/productMaster"
      ).then((response) => {
        console.clear();
        
        let finalLoadedData = response.data.data;
        // let currentDataArray = this.state.medicineOptions;
        // if (pageNumber > 1) {
        //    finalLoadedData = currentDataArray.concat(finalLoadedData);
        // }
        console.log(finalLoadedData);
        this.setState({
          medicineOptions: finalLoadedData,
          medicineArray: finalLoadedData,




          
        });
        // console.log(finalLoadedData.length);
      });
    }

   fetchdrugdata() {
         Httpconfig.httptokenget(Constant.siteurl + "api/productMaster").then((response) => {
         // Httpconfig.httptokenget(Constant.siteurl + "api/Category?category_type=Drug%20Type").then((response) => {
         this.setState({
            drugAllergiesOptions: response.data.data,
            drugAllergiesArray: response.data.data
         })
      });
   }

   addPatient = () => {
      this.props.history.push("/Patientadd");
   }
   

   // When value changes of the fields
   handleChronicChange = (event) => {
      this.setState({ chronic: event.target.value })
   };

   handleChange = (field, event) => {
      let fields = this.state.fields;
      fields[field] = event.target.value;
      this.setState({ fields });
   };

   handleChronicBlur = (field, event) => {
      console.clear();
      console.log('finished typing:', this.state.chronic)
   }

   onMedicineSelect = (selectedMedicineListdata, selectedItem) => {
      // let medicineNames = selectedMedicineListdata.map(function (obj) {
      //    obj['id'] = obj.id; // Assign new key 
      //    obj['name'] = obj.medicinename;
      //    delete obj.medicineid; // Delete old key 
      //    return obj;
      // });
      this.setState({
         selectedMedicineList: selectedMedicineListdata,
      });
   };

   onMedicineRemove = (deselectedMedicineList, removedItem) => {
      this.setState({
         selectedMedicineList: deselectedMedicineList.map((x) => x.id),
      });
      console.log(Object.assign({}, this.state.selectedMedicineList))
   };

   // For Drug Allergies Select
   onDrugMedicineSelect = (selectedDrugMedicineListdata, selectedItem) => {
      // let drugNames = selectedDrugMedicineListdata.map(function (obj) {
      //    obj['id'] = obj.id; // Assign new key 
      //    obj['name'] = obj.medicinename;
      //    delete obj.medicineid; // Delete old key 
      //    return obj;
      // });
      this.setState({
         selectedDrugList: selectedDrugMedicineListdata
      });

   };
   // Ends


   // For Drug Allergies Remove
   onDrugMedicineRemove = (deselectedDrugMedicineList, removedItem) => {
      this.setState({
         selectedDrugList: deselectedDrugMedicineList.map((x) => x.id),
      });
      console.log(Object.assign({}, this.state.selectedDrugList))
   };
   // Ends

   // onChronicChange(e) {
   //    this.setState({
   //       chronic: e.target.value
   //    });
   // }

   updateChronicText(text) {
     if(this.state.chronic){
      this.setState({
         chronic: `${this.state.chronic},${text}`
      });
    }else{
      this.setState({
        chronic: `${text}`
     });
    }
   }

   // create or update   
   checkhealthProfileSubmit(event) {
      event.preventDefault();
      const { handle } = this.props.match.params;
      // if (this.handleHealthProfileValidation() && handle == undefined) {
      this.createPatientProfile(event);
      // } else {
      //    toast.warn("Form has errors.");
      // }
   }

   createPatientProfile = (event) => {
      event.preventDefault();
      var currentId="";
      var patientId="";
      const { fields, errors } = this.state;
      currentId=localStorage.getItem('currentMemberId');
      if(currentId!=""){
        patientId=currentId;
      }else{
        patientId=this.state.patientId;
      }
      // alert("patient Id "+this.state.patientId);
      // return;
      

      Httpconfig.httptokenput(
         Constant.siteurl + "api/Patients/updatepatient/"+patientId, //+ handle,
         {
            chornic_diseases_list: this.state.chronic,
            related_medication: this.state.selectedMedicineList,
            drug_allergies: this.state.selectedDrugList,
            page_type : "advance_info",
         }
      ).then((response) => {
         localStorage.removeItem("currentMemberId");
         toast.success('👌 Successfully Updated Patient Health Profile', {
          position: "bottom-center"
         });
         setTimeout(() => this.props.history.push("/Patientconsultationpurpose"), 2000);
         
      }).catch((error) => {
         toast.error("Sorry unable to update the Health profile data "+error, {
          position: "bottom-center"
         });
      });
    //  return;
   }
   handleLanguage=(langValue)=>{
       
    this.setState({Language: langValue});
}
goBack =() =>{      
  this.props.history.push("/Patientprofile");
}
skipPage =() =>{      
  this.props.history.push("/Patientconsultationpurpose");
}



   // handleHealthProfileValidation() {
   //    let fields = this.state.fields;
   //    let errors = {};
   //    let formIsValid = true;

   //    if (!fields["past_history"]) {
   //       formIsValid = false;
   //       errors["past_history"] = "Past history can't be Empty";
   //    }
   //    if (!this.state.current_medication) {
   //       formIsValid = false;
   //       errors["current_medication"] = "Current Medication cannot be empty";
   //    }
   //    if (!this.state.drug_allergies) {
   //       formIsValid = false;
   //       errors["drug_allergies"] = "Drug Allergies cannot be empty";
   //    }
   //    this.setState({ errors: errors });
   //    return formIsValid;
   // }

   render() {

      //const { controller_count, controller_total, module_count, module_total, pages } = this.state;
      const { languages_data } = this.state;
      const BLOCK = { diplay: 'block' }
      const NONE = { diplay: 'none' }
      const { fields, errors } = this.state;
      return (
         <main id="main">
            {/* ja-jp */}
            {/* en-us */}
            {/* de-de */}
            {/* fr-ca */}
            <PatientHeader onSelectLanguage={this.handleLanguage}/>
            <I18nPropvider locale={this.state.Language} >
            
               {/* <PatientMenu /> */}
               {/* <PatientMenu /> */}
               <section id="medical_details">
                  <div class="container">
                     <div class="row">
                        <div class="col-md-12">
                           <div class="medical_head">
                              <h2>{translate('Please keep your health profile updated for better consultation experience')}</h2>
                              <div class="row">
                                 <div class="col-md-6">
                                    <div class="progress">
                                       <div class="progress-bar progress-bar-success" role="progressbar" aria-valuenow="40"
                                          aria-valuemin="0" aria-valuemax="100" style={{ width: "75%" }}>
                                          75%
                                    </div>
                                    </div>
                                 </div>
                                 <div class="col-md-4">
                                    <p class="profile_complete">{translate('Profile Completed')}</p>
                                 </div>
                              </div>
                           </div>

                           <form onSubmit={this.checkhealthProfileSubmit.bind(this)}>
                              <div id="main_medical_box">

                                 <div class="row">
                                    <div class="col-md-4 col-sm-4">
                                       {/* onClick={this.addPatient} */}
                                       <div class="medical_patient_box">
                                          <h2>{translate('Who is the Patient')}?</h2>
                                          <p class="add_mem_btn1" onClick={this.addPatient}><img src="../images/patient/img/Profile/add_member_white.svg" />{translate('Add family Member')}</p>
                                       </div>
                                    </div>
                                    <div class="col-md-8 col-sm-8">

                                       <div class="help_info_box">
                                          <div class="help_info_content">
                                             <h2>{translate('Specify any long-term illness or chronic conditions present')} ({translate('If any')}) {this.state.patientId}</h2>
                                             <h6>{translate('Optional')}</h6>
                                             <div class="form-group medical_form col-md-12 no_padding">
                                                {/* <input type="text" value={this.state.title} onChange={(e) => this.onChronicChange(e)}  /> */}
                                                {/* <textarea name="past_history" class="form-control log-textarea" value={this.state.chronic} rows="4" placeholder="Type here eg. Diabetes" onChange={this.handleChronicChange.bind(this)} onBlur={this.handleChronicBlur.bind(this)} ></textarea> */}
                                                {/* onChange={(e) => this.onChronicChange(e)} */}
                                                <FormattedMessage id="Type here eg. Diabetes">
                                                   {
                                                      placeholder => <textarea class="form-control log-textarea" value={this.state.chronic}  rows="4"  placeholder={placeholder} 
                                                       onChange={this.handleChronicChange.bind(this) } onBlur={this.handleChronicBlur.bind(this)}>{this.state.chronic}</textarea>
                                                   }
                                                </FormattedMessage>
                                             </div>
                                             <div class="medical_conditions">

                                                
                                                <button type="button" onClick={() => this.updateChronicText('Diabetes')} > {translate('Diabetes')} </button>
                                                <button type="button" onClick={() => this.updateChronicText('Blood Pressure')} > {translate('Blood Pressure')} </button>
                                                <button type="button" onClick={() => this.updateChronicText('Headache')} > {translate('Headache')} </button>

                                                {/* <p onClick={this.appendData}  value="Diabetes">Diabetes</p>
                                             <p>Blood Pressure</p>
                                             <p>Diabetes</p>
                                             <p>Blood Pressure</p>
                                             <p>Diabetes</p>
                                             <p>Blood Pressure</p>
                                             <p>Diabetes</p>
                                             <p>Blood Pressure</p> */}
                                             </div>
                                          </div>


                                          <div class="help_info_content" onScroll={this.handleScroll}>
                                             <h2>{translate('Related medication')}({translate('if any')})- <span>{translate('Optional')}</span></h2>
                                             <div class="form-group medical_form col-md-12 no_padding">
                                                {/* <textarea class="form-control log-textarea" rows="4" placeholder="Type here eg. Diabetes"></textarea> */}
                                                
                                                <Multiselect
                                                   onChange={this.handleChange.bind(
                                                      this,
                                                      "current_medication"
                                                   )}
                                                   name="current_medication"
                                                   options={this.state.medicineOptions} // Options to display in the dropdown
                                                   value={this.state.selectedMedicineList || ""}
                                                   selectedValues={this.state.selectedMedicineValue} // Preselected value to persist in dropdown
                                                   onSelect={this.onMedicineSelect} // Function will trigger on select event
                                                   placeholder="Select Medicine"
                                                   onRemove={this.onMedicineRemove} // Function will trigger on remove event
                                                   displayValue="medicinename" // Property name to display in the dropdown options
                                                />
                                             </div>
                                          </div>


                                          <div class="help_info_content">
                                             <h2>{translate('Drug allergies present')} ({translate('if any')}) - <span>{translate('Optional')}</span></h2>
                                             <div class="form-group medical_form col-md-12 no_padding">
                                                {/* <textarea class="form-control log-textarea" rows="4" placeholder="Type here eg. Diabetes"></textarea> */}
                                                <Multiselect
                                                   onChange={this.handleChange.bind(
                                                      this,
                                                      "drug_allergies"
                                                   )}
                                                   name="drug_allergies"
                                                   options={this.state.drugAllergiesOptions} // Options to display in the dropdown
                                                   value={this.state.selectedDrugList || ""}
                                                   selectedValues={this.state.selectedDrugValue} // Preselected value to persist in dropdown
                                                   onSelect={this.onDrugMedicineSelect} // Function will trigger on select event
                                                   placeholder="Select Drug"
                                                   onRemove={this.onRemove} // Function will trigger on remove event
                                                   displayValue="medicinename" // Property name to display in the dropdown options
                                                />
                                             </div>
                                          </div>


                                       </div>
                                    </div>
                                 </div>
                              </div>
                              <div class="row">
                                 <div class="col-md-6">
                                    {/* <div class="back_btn">
                                       <p><img src="../images/patient/img/Profile/arrow_black.svg" />{translate('Back')}</p>
                                    </div> */}
                                    <div class="back_btn" onClick={this.goBack}>
                             <p><img src="../images/patient/img/Patient Intake Process/arrow_black.svg" />{translate('Back')}</p>
                            </div>
                                 </div>
                                 <div class="col-md-6 text-right" >
                                    <div class="do_btn" onClick={this.skipPage}>
                                       <p>{translate('Do it later')}</p>
                                    </div>
                                    {/* <div class="next_btn">
                                       <button
                                          type="submit"
                                          className="btn  btn-primary padTopCategorySave fright"                                      >
                                          {translate('Save')} & {translate('Next')}
                                       </button>
                                       {/* <p>{translate('Save')} & {translate('Next')}</p> */}
                                   {/*} </div> */}
                                    <div class="next_btn">
                                    {/* <p>Next<img src="../images/patient/img/Patient Intake Process/arrow.svg" /></p> */}
                                    <button type="submit" className="btn  btn-primary">{translate('Save & Next')}</button>
                                </div>
                                 </div>
                              </div>
                           </form>
                        </div>
                     </div>
                  </div>
               </section>
               <ToastContainer />
               <PatientFooter/>
            </I18nPropvider>
         </main>
      )
   }

}