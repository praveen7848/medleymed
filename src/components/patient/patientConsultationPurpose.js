import React, { PropTypes,Component, useState } from 'react';
import $ from "jquery";
import { ToastContainer, toast } from 'react-toastify'; // for toast messages
import  { Redirect } from 'react-router-dom'
import { Link } from "react-router-dom";
import Httpconfig from "../helpers/Httpconfig"; //for apis
import Constant from "../../constants"; // tp get the const values
import { FormattedMessage } from "react-intl"; // Backup Way to Convert
import { I18nPropvider, LOCALES } from '../../i18nProvider'; // for language conversion
import translate from "../../i18nProvider/translate"; //for lanuage conversion
import Patnewcss from "../../public/css/patient/style-new.css";  //styles for the patient module
import PatientHeader from "../patient/Patientheader";  //patient header 
import PatientFooter from "../patient/Patientfooter"; //[atoemt footer
import { Dropdown } from 'semantic-ui-react'; // for relatives drop down
import { reactLocalStorage } from "reactjs-localstorage";


export default class Patientconsultationpurpose extends Component {
    
    constructor(props) {
        super(props); 
        this.state = { 
            showlogin: true,
            showsignup: false,
            Language: "",
            date: new Date(),
            name:"",
            user_mobile:"",
            email_id:"",
            token:"",
            userId:"",
            profile_image:'',
            fields: {},
            errors: {},
            selectedRelativeValue:"",
        };
       
        this.onFormSubmit = this.onFormSubmit.bind(this);
        this.addfamily=this.addfamily.bind(this);
       
      
    }

    componentDidUpdate = () => {
        /* get the local stored lanuage */
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
    /* on form submit validation */
    onFormSubmit(event) {

        event.preventDefault();
        const { handle } = this.props.match.params;
        if (this.handleValidation() && handle) {
           
        } else if (this.handleValidation() && handle == undefined) {
          this.createPatient(event);
         
        } else {
           toast.warn("Form has errors.");
        }
    }
    /* update the state for the consultation purpose */
    HandleConsulationPurposeChange = (field, event) => {
        let fields = this.state.fields;
        fields[field] = event.target.value;
        this.setState({ fields });
     };
    /* get the relations */ 
    getPatientRelations=(patientId)=>{
        Httpconfig.httptokenget(Constant.siteurl + "api/Patients/findpatientrealtives/"+patientId, {
        
        })
           .then((response) => { 
             
               /* Assiging consulation purpose to the state */
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
                  selectedPatient=localStorage.getItem('SelectedPatientId');
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
                 if(selectedPatient==id){
                     selectedImage=image;
                     selectedPatient=pName+relationName;
                 }
                  
                  my_relatives ={
                        key:relationShipId ,
                        text: pName+relationName,
                        value: id,
                        image:  { avatar: true, src: image },
                       

                  }
                  stateRelationsOptions.push(my_relatives);
                 
                
              }
              this.state.stateRelationsOptions=stateRelationsOptions;
              var patient_id=localStorage.getItem('SelectedPatientId');
              
              if(patient_id!=null){
                $('.purpose_select .divider').html('');
                $('.purpose_select .divider').html('<img src="'+selectedImage+'" class="ui avatar image"><span class="text">'+selectedPatient+'</span>');
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
            if(patient_id!=null){
            $('.purpose_select .divider').html('');
            $('.purpose_select .divider').html('<img src="'+selectedImage+'" class="ui avatar image"><span class="text">'+selectedPatient+'</span>');
            }
            this.forceUpdate();
            
            
            })
           .catch((error) => {
              toast.error(error);
           });
    }
    
    
    // To get detais after first render
    componentDidMount = () => {
        /* check user logged */
        var retrievedObject=localStorage.getItem('userObj');
        var patient_id=localStorage.getItem('SelectedPatientId');
      // alert(patient_id);
        
        var appointmentId="";
        appointmentId=localStorage.getItem('appointmentId');
        this.state.appointmentId=appointmentId;
        let userData=JSON.parse(retrievedObject)
        if(userData==null){
            window.location.href = "/Patientlogin";
        }
        
   
        if(retrievedObject!=null || retrievedObject!=null ){
            
         this.setState({
            name: userData.name,
            user_mobile:userData.mobile_number,
            email_id:userData.email,
            token:userData.accessToken,
            patient_id:userData.patient_id,
            profile_image:"", 
            
            
          }); 
          this.state.clinicId=userData.clinic_id;
         
          //this.state.clinicId=1;
          this.forceUpdate();
          if(userData.patient_id!=""){
            //let clinicId=userData.patient_id
          //  let clinicId=1;
           /* get the saved consultation purpose */  
           this.getPatientRelations(userData.patient_id);
           this. getPatientConsultaionPurposese(userData.patient_id,appointmentId);
        
          
          }
          this.state.userId=userData.patient_id;
        }else{
           /* redirect if user not logged in */
            window.location.href = "/";
         
        }
       
        
    }

     /* check valiation */
     handleValidation() {
        let fields = this.state.fields;
        let errors = {};
        let formIsValid = true;
        var pattern = /^[a-zA-Z0-9]{3,20}$/g;
        
        if (!fields["consultation_purpose"]) {
           errors["consultation_purpose"] = "";
           formIsValid = false;
           errors["consultation_purpose"] = "Enter the purpose of Consultation";
        //   toast.error(errors["consultation_purpose"]);
        } 
        this.setState({ errors: errors });
        return formIsValid;
  
     }
     /* get the consulation purpose by sending the patient id */
     getPatientConsultaionPurposese=(patient_id,appointmentId)=>{
        let url_path="";
        //appointmentId=1;
        var patient_ids=localStorage.getItem('SelectedPatientId');
        if(patient_ids!=null){
           // alert("in");
            patient_id=patient_ids;
            this.state.selectedRelativeValue=patient_id;
        }
        //alert(this.state.clinicId);
        let clinicId=this.state.clinicId;
        
        Httpconfig.httptokenget(Constant.siteurl + "api/problem/getPatientProblem/"+patient_id+"/"+appointmentId+"/"+clinicId, {
        
        })
           .then((response) => { 
               /* Assiging consulation purpose to the state */
              let  appointmentId=localStorage.getItem('appointmentId');
              //alert(appointmentId);
               if(appointmentId!=null){
                  
                this.setState({
                    fields:{
                        "consultation_purpose":response.data.data[0].problem
                    }
                })
                
            }
            })
           .catch((error) => {
              toast.error(error);
           });
     };
     /* Save patient consulation purpose */
     createPatient = (event) => {
       // var currentUser = $('.selection.dropdown').dropdown('get value');
        event.preventDefault();
        var handle = this.props.match.params.handle;
        const { fields, errors } = this.state;
        let url_path="api/problem/";
       // alert(this.state.selectedRelativeValue);
        var patient_id=localStorage.getItem('SelectedPatientId');
        //alert(patient_id);
        if(patient_id==null){
            toast.error("please select family member");
            return;
        }
       
        if(this.state.appointmentId!=null){
            var post_data={
                "patient_id": this.state.selectedRelativeValue, 
                "problem":this.state.fields['consultation_purpose'],
                "appointmentId":JSON.parse(this.state.appointmentId),
             
            }

        }else{
            var post_data={
                "patient_id": this.state.selectedRelativeValue, 
                "problem":this.state.fields['consultation_purpose']
             
            }
        }
        // var patient_id=localStorage.getItem('SelectedPatientId');
        // if(patient_id!=null){
        //    // alert("in");
        //     userData.patient_id=patient_id;
        // }
      
        Httpconfig.httptokenpost(Constant.siteurl + url_path,
        {
            
            "patient_id": JSON.parse(this.state.selectedRelativeValue), 
            "problem":this.state.fields['consultation_purpose'],
            "appointmentId":JSON.parse(this.state.appointmentId),
            "clinic_id":JSON.parse(this.state.clinicId),
  
        }
    )
           .then((response) => { 

             if(response.data.status=='200' && response.data.error==false){
                    let next_page=response.data.nextpage.web_reference_page_name;
                    let patientAppointmentId=response.data.data.appointment_id;
                        reactLocalStorage.setObject("appointmentId", patientAppointmentId);
                
                        toast.success('👌 Purpose of Consultaion Saved succesfully', {
                            position: "bottom-center"
                            
                        });
                    setTimeout(() => this.props.history.push("/"+next_page), 2000);
        }
           })
           .catch((error) => {
              toast.error(error);
           });
     };
     /* Adddin family members */
    addfamily =() =>{      
        this.props.history.push("/Patientadd");
    }
    /* set the selected lanuage to the state */
    handleLanguage=(langValue)=>{
       
        this.setState({Language: langValue});
    }
    onRelativeChange=(event,data)=>{

        let selectedRelativeValue=data.value;
       //alert(selectedRelativeValue);
        reactLocalStorage.setObject("SelectedPatientId", selectedRelativeValue);
        this.state.selectedRelativeValue=data.value;
        reactLocalStorage.remove("appointmentId");
        this.state.appointmentId=null;
        }
    
     
    
    
    render() {
        var retrievedObject=localStorage.getItem('userObj');
        let userData=JSON.parse(retrievedObject);
        if(userData==null){
            window.location.href = "/Patientlogin";
        }
        const patient_id=userData.patient_id
        const ueserId=this.state.userId;
        const name=this.state.name;
        const { transcript, resetTranscript, browserSupportsSpeechRecognition } = this.props;
        const { languages_data } = this.state;
//alert(name);
          
        
        return (
            
            <main id="main">
            {/* ja-jp */}
            {/* en-us */}
            {/* de-de */}
            {/* fr-ca */}
            <PatientHeader onSelectLanguage={this.handleLanguage}/>
            <I18nPropvider locale={this.state.Language} >
            <ToastContainer />
            <form onSubmit={this.onFormSubmit.bind(this)}>
            <section id="purpose">
     <div class="container">
         <div class="row">
             <div class="col-md-6">
                 <div class="purpose_heading">
                  <h2>{translate("Patient Intake Process")}</h2>
                 </div>
             </div>
             {this.state.stateRelationsOptions ? 
             <div class="col-md-6 text-right">
             <div class="purpose_select">
                 <h4>{translate("Enter the details for")}…</h4>
               
               <Dropdown
               //disabled={true}
                    placeholder='Select Family member'
                   // openOnFocus={false}
                   // selection={this.state.defaultValue}
                    options={this.state.stateRelationsOptions}
                    defaultValue={this.state.value}
                    onChange={this.onRelativeChange}
                    
                    
                />
                
             </div> 
            </div>
            : ""}
         </div>

         
             <div class="purpose_consult">
                <div class="row">
                 <div class="col-md-4">
                    <div class="stepwizard">
                        <div class="stepwizard-row setup-panel">
                            <div class="stepwizard-step">
                                <a href="#step-1" type="button" class="btn btn-default btn-circle">1</a>
                                <p class="p_dark">{translate("Purpose of consultation")}</p>
                            </div>
                            <div class="stepwizard-step">
                                <a href="#step-2" type="button" class="btn btn-default btn-circle light_circle" disabled="disabled">2</a>
                                <p class="p_light">{translate("Specify Symptoms")}</p>
                            </div>
                            <div class="stepwizard-step">
                                <a href="#step-3" type="button" class="btn btn-default btn-circle light_circle" disabled="disabled">3</a>
                                <p class="p_light">{translate("Provide Vital Informations")}</p>
                            </div>
                            <div class="stepwizard-step">
                                <a href="#step-4" type="button" class="btn btn-default btn-circle light_circle" disabled="disabled">4</a>
                                <p class="p_light">{translate("History of Past Illness")}</p>
                            </div>
                        </div>
                    </div>
                 </div>
                 <div class="col-md-8">
                     <div class="purpose_box">
                       
                       <h2>{translate("Purpose of consultation")}</h2>
                       <form>
                       <div class="form-group col-md-12 no_padding">
                       <FormattedMessage id="Type here eg. Fever">
                                                {
                                                   placeholder => <textarea  name="consultation_purpose" rows="4" class="form-control  log-textarea" placeholder={placeholder} value={this.state.fields["consultation_purpose"] || ""} onBlur={this.HandleConsulationPurposeChange.bind(this, "consultation_purpose")} onFormSubmit={this.HandleConsulationPurposeChange.bind(this, "consultation_purpose")} onChange={this.HandleConsulationPurposeChange.bind(this, "consultation_purpose")}/>
                                                }
                                             </FormattedMessage>
        
                          </div>
                          <span className="cRed">
                                                {this.state.errors["consultation_purpose"]}
                                             </span>
                                           
                                             <p>{transcript}</p>
                                             
                          
                      </form>
                
                           <div class="mic_icon" >
                           <img src="../images/patient/img/Patient Intake Process/Voicerecord.svg"/>
                            
                           </div>
                         
                           <div class="row">
                            <div class="col-md-6 col-sm-6 col-xs-6 text-left"> 
                            {/* <div class="back_btn">
                             <p><img src="../images/patient/img/Patient Intake Process/arrow_black.svg" />{translate("Back")}</p>
                            </div> */}
                            </div>
                            <div class="col-md-6 col-sm-6 col-xs-6 text-right" onCLick={this.onFormSubmit.bind(this)}>
                                <div class="next_btn">
                                    <button type="submit" className="btn btn-default Next_btn_profile">{translate('Save')} & {translate('Next')}</button>
                                </div>
                            </div>
                           </div>
                     </div>
                    
                 </div>
             </div>
         </div>
     </div>
 </section>
            </form>
            
            <PatientFooter/>
            </I18nPropvider>
            </main>
            
            
        )
    }
    
}