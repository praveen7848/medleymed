import React, { Component, useState } from 'react';
import $ from "jquery";
import { ToastContainer, toast } from 'react-toastify';
import  { Redirect } from 'react-router-dom'

import { Link } from "react-router-dom";
import Httpconfig from "../helpers/Httpconfig";
import { Carousel } from "react-responsive-carousel";
import Patnewcss from "../../public/css/patient/style-new.css";
import Constant from "../../constants";
import { FormattedMessage } from "react-intl"; // Backup Way to Convert
import { I18nPropvider, LOCALES } from '../../i18nProvider';
import translate from "../../i18nProvider/translate";
import PatientHeader from "../patient/Patientheader";
import PatientMenu from "../patient/Patientmenu";
import PatientSideMenu from "../patient/Patientsidemenu";
import PatientFooter from "../patient/Patientfooter";
import FileBase64 from "react-file-base64";
// import DatePicker from 'react-datepicker';
// import "react-datepicker/dist/react-datepicker.css";
import { Form } from "semantic-ui-react";

import { DateInput} from "semantic-ui-calendar-react";
import * as SecureLS from 'secure-ls';
const moment = require("moment");
const listdat=[];


var ls = new SecureLS({
    encodingType: 'aes',
    encryptionSecret:'medleymed'
});



export default class Patientprofile extends Component {
    
    constructor(props) {
        super(props);
       // let fields = this.state.fields;
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
            PatientGender:"",
        };
       
        this.onFormSubmit = this.onFormSubmit.bind(this);
        this.addfamily=this.addfamily.bind(this);
        this.getProfileDetails=this.getProfileDetails.bind(this);
        this.handleChange=this.handleChange.bind(this);
    }
    componentDidUpdate = () => {
        var lang = localStorage.getItem('Language_selected');
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
        
    }
    onFormSubmit(event) {
       // alert("om");
        event.preventDefault();
        const { handle } = this.props.match.params;
        if (this.handleValidation() && handle) {
           // this.updatePatient(event);
        } else if (this.handleValidation() && handle == undefined) {
          //this.createPatient(event);
         // alert("insfdsf");
         if(!this.state.selectedPatientId){
            // alert("in1");
            this.createPatient(event);
        }else{
           // alert("in2");
            this.updatePatient(event);
        }
        } else {
            toast.warn("Form has errors" , {
                position: "bottom-center"
            });
        }
    }
    HandledobChange = (event,{ name, value }) => {
        // alert(value);
        // let field="user_dob";
         //let fields = this.state.fields;
         //fields[field] =value; //event.target.value;
         this.state.fields['user_dob']=value;//event.target.value;
         //this.setState({ fields });

         this.forceUpdate();
         //alert(this.state.fields['user_dob']);
     };
     getProfileDetails=(patientId)=>{
         if(patientId!=""){
        let url_path="api/Patients/"+patientId;
        let patientDob="";
        Httpconfig.httptokenget(Constant.siteurl + url_path, {
        })
           .then((response) => {
            //    toast.success('👌 Thank you for updating profile details', {
            //     position: "bottom-center"
            // });
            // setTimeout(() => this.props.history.push("/patienthealthprofile"), 2000);
            let dob="";
            this.state.selectedPatientId=patientId;
            let patientDob="";
            if(response.data.status==200 && response.data.error==false){
            //    let patientName=response.data.data[0].name;
            //    let patientMobile=response.data.data[0].phone_number;
            //    let PatientGender=response.data.data[0].gender;
            //    let patientProfileImage=Constant.imgurl+response.data.data[0].profile_pic;
            //    //alert(response.data.data[0].dob);
            //    if(response.data.data[0].dob!=null){
            //    let prefixDate= response.data.data[0].dob.split("T");
            //   // alert(prefixDate[0]);
            //    patientDob=moment(prefixDate[0]).format('DD-MM-YYYY');
              
            //    }
               //alert(patientDob);

               response.data.data.map((relationsList,num)=>{ 
                   
                this.state.fields["user_name"]= relationsList.name;
                if(relationsList.gender!=null){
                    this.state.fields["user_gender"]=relationsList.gender;
                }
                if(relationsList.relation!=null){
                    this.state.fields["user_relation"]=relationsList.relation;
                    this.state.fields["user_relation_id"]=relationsList.relation;
                }else{
                    this.state.fields["user_relation"]="1";//relationsList.relation;
                    this.state.fields["user_relation_id"]="1";//relationsList.relation;
                }
                
                
                this.state.fields["user_mobilenumber"]=relationsList.phone_number;
                if(relationsList.profile_pic!=null){
                this.state.patientProfileImage=Constant.imgurl+relationsList.profile_pic;
                }
                if(relationsList.dob!=null){
                dob=relationsList.dob.split("T");
                this.state.fields["user_dob"]=moment(dob[0]).format("DD-MM-YYYY");
                }
                
               // alert(relationsList.gender);
               if(relationsList.gender!=null){
               $('.gender').attr("checked",false);
               $('#'+relationsList.gender.toLowerCase()).attr("checked",true);
               }
                
            })
            //alert(this.state.fields["user_name"]);
            this.forceUpdate();
               
          
              
            }
           })
           .catch((error) => {
           // this.props.history.push("/patienthealthprofile");
            //  console.log(error);
             toast.error(error);
           });
        }

     }

     // ge relatives details
     getRelationDetails=(id)=>{
        let dob="";
        this.state.selectedPatientId=id;
        Httpconfig.httptokenget(Constant.siteurl + "api/Patients/findpatientrealtives/"+id)
        .then((response) => { 

            if(id!=this.state.patient_id){
            response.data.data.map((relationsList,num)=>{ 
                this.state.fields["user_name"]= relationsList.name;
                this.state.fields["user_gender"]=relationsList.gender;
                this.state.fields["user_relation"]=relationsList.master_relationship.id;
                this.state.fields["user_relation_id"]=relationsList.master_relationship.id;
                this.state.fields["user_mobilenumber"]=relationsList.phone_number;
                dob=relationsList.dob.split("T");
                this.state.fields["user_dob"]=moment(dob[0]).format("DD-MM-YYYY");
                
                $('.gender').attr("checked",false);
                $('#'+relationsList.gender.toLowerCase()).attr("checked",true);
            })
           
        }else{
            response.data.data.map((relationsList,num)=>{ 
            if (relationsList.id == this.state.patient_id) {
                
                this.state.fields["user_name"]= relationsList.name;
                this.state.fields["user_gender"]=relationsList.gender;
                this.state.fields["user_relation"]=relationsList.master_relationship.id;
                this.state.fields["user_relation_id"]=relationsList.master_relationship.id;
                this.state.fields["user_mobilenumber"]=relationsList.phone_number;
                dob=relationsList.dob.split("T");
                this.state.fields["user_dob"]=moment(dob[0]).format("DD-MM-YYYY");
                $('.gender').attr("checked",false);
                
                $('#'+relationsList.gender.toLowerCase()).attr("checked",true);
                
                }
            })
        }
        this.forceUpdate();
         })
        .catch((error) => {
           toast.error(error);
        });

    }

    // patient relations
    getPatientRelations=(patientId)=>{
        let profileImage="";
    Httpconfig.httptokenget(Constant.siteurl + "api/Patients/findpatientrealtives/"+patientId)
       .then((response) => { 
          
          
        const relativesList= response.data.data.map((relationsList,num)=>{ 
            if(num<5){
            if(relationsList.profile_pic!=null){
                profileImage=Constant.imgurl+relationsList.profile_pic;
            }else{
                if(relationsList.gender.toLowerCase()=="female"){
                 profileImage="../images/patient/img/Profile/Female_patient.svg"; 
                }else{
                 profileImage="../images/patient/img/Profile/Male_patient.svg";   
                }
            }
   
           return(
            <div class="user_mem_btn" onClick={this.getRelationDetails.bind(this,relationsList.id)}>
            <div class="col-md-2"> 
            {profileImage ?
            <img class="user_img" src={profileImage} />
            :""
            }
            </div>
            <div class="col-md-8 no_padding">
            <p>{relationsList.name} ({relationsList.master_relationship.relation_name})</p>  
            </div> 
            <div class="col-md-2">
            <img src="../images/patient/img/Profile/arrow.svg" /> 
            </div>
            </div>
           )
        }
        })
          this.state.relativesList=relativesList;
          this.forceUpdate();
          
        })
       .catch((error) => {
          toast.error(error);
       });
    }
    
    
    // To get detais after first render
    componentDidMount = () => {
        ls.set('rakesh', {test: 'jamesbond'})
        
        //console.log(ls.get('rakesh'));
        //alert(ls.get('rakesh'));
        var retrievedObject=localStorage.getItem('userObj');
        let userData=JSON.parse(retrievedObject)
        if(retrievedObject!=null || retrievedObject!=null ){
         this.setState({
            token:userData.accessToken,
             patient_id:userData.patient_id,
             patientId:userData.patient_id,
            
          }); 
         // this.checkProfileStatus(userData.patient_id);
          this.getProfileDetails(userData.patient_id);
          this.getPatientRelations(userData.patient_id);
          this.getRelativesList();
          
        }else{
            
            window.location.href = "/";
          
        }
        
    }

     handleValidation() {
        let fields = this.state.fields;
        let errors = {};
        let formIsValid = true;
        var pattern = /^[a-zA-Z0-9]{3,20}$/g;
        
        if (this.state.patientDob=="") {
           errors["user_dob"] = "";
           formIsValid = false;
           errors["user_dob"] = "Enter / Select Date of Birth";
           
        } 
        this.setState({ errors: errors });
        return formIsValid;
  
     }
     createPatient = (event) => {
        event.preventDefault();
        var handle = this.props.match.params.handle;
        const { fields, errors } = this.state;

        var parts =this.state.patientDob.split('-');
        var mydate=parts[2]+"-"+parts[1]+"-"+ parts[0];
        var gender=($("input[type='radio']:checked").val());
        let url_path="api/Patients/updatepatient/"+this.state.patientId;
        Httpconfig.httptokenput(Constant.siteurl + url_path, {
            "name": this.state.fields["user_name"], 
            "phone_number": this.state.fields["user_mobilenumber"], 
            "dob": mydate+"T07:03:03.000Z", 
            "gender": this.state.fields["user_gender"], 
            "page_type": "basicinfor", 
            "user_type": "patient", 
            "relation": "1", 
            "relation_patient_id": this.state.patientId, 
  
        })
           .then((response) => {
               toast.success('👌 Thank you for updating profile details', {
                position: "bottom-center"
            });
            //alert(response.data[0].memberDataId);
            localStorage.setItem('currentMemberId',response.data[0].memberDataId);
             setTimeout(() => this.props.history.push("/patienthealthprofile"), 2000);
           })
           .catch((error) => {
            this.props.history.push("/patienthealthprofile");
              console.log(error);
             toast.error(error);
           });
     };


     updatePatient = (event) => {
       //  alert("Update");
         event.preventDefault();
         var handle = this.props.match.params.handle;
         const { fields, errors } = this.state;
         var parts =this.state.fields["user_dob"].split('-');
         var mydate=parts[2]+"-"+parts[1]+"-"+ parts[0];
         let url_path="api/Patients/updatepatient/"+this.state.selectedPatientId;
        
         var post_data={
             "name": this.state.fields["user_name"], 
             "phone_number": this.state.fields["user_mobilenumber"], 
             "dob": mydate+"T07:03:03.000Z", 
             "gender": this.state.fields["user_gender"], 
             "relation": this.state.fields["user_relation"], 
             "relation_patient_id": this.state.patient_id ,
         }
     
         Httpconfig.httptokenput(Constant.siteurl + url_path, {
             "name": this.state.fields["user_name"], 
             "phone_number": this.state.fields["user_mobilenumber"], 
             "dob": mydate+"T07:03:03.000Z", 
             "gender": this.state.fields["user_gender"],
             "relation": this.state.fields["user_relation"], 
             "relation_patient_id": this.state.patient_id,
             
             
         })
         .then((response) => {
             toast.success('👌'+response.data.message, {
                 position: "bottom-center" 
              });
            //  alert(response.data[0].memberDataId);
              localStorage.setItem('currentMemberId',this.state.selectedPatientId);
              setTimeout(() => this.props.history.push("/patienthealthprofile"), 2000);
             
         })
         .catch((error) => {
           //  this.props.history.push("/patienthealthprofile");
             console.log(error);
             toast.error(error);
         });
     };


    addfamily =() =>{      
        this.props.history.push("/Patientadd");
    }
     
    handleLanguage=(langValue)=>{
       
        this.setState({Language: langValue});
    }
    handleChange=(event)=>{
        
        this.setState({
            checked:event.currentTarget.value,
        })
    }
    getRelativesList=()=>{
        Httpconfig.httptokenget(Constant.siteurl + "api/masterrealtionships", )
           .then((response) => { 
             if(response.data.status=200){
                /// alert(response.data.data);
                this.state.relativesData=response.data.data;
               // let listdat=[];
                for(let list=0;list<response.data.data.length;list++){
                    listdat[list]= "<option value="+response.data.data[list]['id']+">"+response.data.data[list]['relation_name']+"</option>";
                }
                $('#user_relation').append(listdat);
               // alert(listdat);
                this.state.listdata=listdat;
        }
           })
           .catch((error) => {
              toast.error(error);
           });
    }
    HandlerelationChange= (field, event) => {
        let fields = this.state.fields;
        fields[field] = event.target.value;
        this.setState({ fields });
    };

    Handlegenderchange= (field, event) => {
        let fields = this.state.fields;
        fields[field] = event.target.value;
        this.setState({ fields });
    };
    Handlenamehange = (event) => {
        this.state.fields['user_name']=event.target.value;
        
    };

    handleMobileChange = (event) => {
        // alert(value);
         let field="user_mobilenumber";
         let fields = this.state.fields;
         fields[field] =event.target.value;
 
         this.setState({ fields });
         this.forceUpdate();
     };
     getFiles(files) {
        this.setState({ files: files });
        let patientId = this.state.patientId;
        let patientProfileImage = this.state.files[0].base64;
        this.state.patientProfileImage = patientProfileImage;
        this.forceUpdate();
       // alert(patientId);
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
          })
          .catch((error) => {
            this.props.history.push("/patienthealthprofile");
            console.log(error);
            toast.error(error);
          });
      }

      checkProfileStatus=(patientId)=>{
        Httpconfig.httptokenget(Constant.siteurl + "api/problem/checkIsProfileUpdated/"+patientId, )
        .then((responseData) => {
          if(responseData.data.status=="200"){
            let healthProfileStatus=responseData.data.healthProfileStatus;
            if(healthProfileStatus==1){
            setTimeout(
              () =>
             //   this.props.history.push("/patientConsultationPurpose", ),
              1000
            );
          }
          }
        })
        .catch((error) => {
          toast.error(error);
        });
      }
    
    render() {
        const { languages_data } = this.state;
        
        return (
            
            <main id="main">
            {/* ja-jp */}
            {/* en-us */}
            {/* de-de */}
            {/* fr-ca */}
            <PatientHeader onSelectLanguage={this.handleLanguage}/>
            <I18nPropvider locale={this.state.Language} >
            
            <form onSubmit={this.onFormSubmit.bind(this)}>
            <section id="medical_details">
            <div class="container">
            <div class="row">
            <div class="col-md-4">
            <PatientSideMenu />
            </div>

            <div class="col-md-8">
            <div class="medical_head">
            <h2>{translate('Please keep your health profile updated for better consultation experience')}</h2>
            <div class="row">
            <div class="col-md-6">
            <div class="progress">
            <div class="progress-bar progress-bar-success" role="progressbar" aria-valuenow="40"
            aria-valuemin="0" aria-valuemax="100" style={{width:"30%"}}>
            30% 
            </div>
            </div>
            </div>
            <div class="col-md-4">
            <p class="profile_complete">{translate('Profile Completed')}</p>
            </div>
            </div>
            
            
            </div>
            
            <div id="main_medical_box">
            
            <div class="row">
            <div class="col-md-5 col-sm-5">
            <div class="medical_patient_box">
            <h2>{translate('Who is the Patient?')}</h2>
          
            <p class="add_mem_btn" onClick={this.addfamily}><img src="../images/patient/img/Profile/Addmember.svg" />{translate('Add family Member')}</p>
            
            <div class="row">
           
            {this.state.relativesList ? this.state.relativesList :""}
            
            </div>
            </div>
            </div>
            <div class="col-md-7 col-sm-7">
            <div class="help_info_box">
            <h2>{translate('Help us with your information')}</h2>
            
            
            <div class="form-group medical_form col-md-10 no_padding">
            <FormattedMessage id="Enter family member name">
        {
            placeholder => <input type="text" name="user_name" autocomplete="off" class="form-control log-input" placeholder={placeholder}  onKeyUp={this.Handlenamehange} defaultValue={this.state.fields["user_name"]}/>//onChange={this.Handlenamehange.bind(this, "user_name")}/>
        }
        </FormattedMessage>
        <span className="cRed">
        {this.state.errors["user_name"]}
        </span>
            
            </div>
            
            <div class="form-group medical_form col-md-10 no_padding">
            <FormattedMessage id="Enter mobile number">
        {
            placeholder => <input type="text" name="user_mobilenumber" maxlength="10" autocomplete="off" class="form-control log-input" placeholder={placeholder} defaultValue={this.state.fields["user_mobilenumber"] || ""} onKeyPress={this.handleMobileChange} onChange={this.handleMobileChange}/>
        }
        </FormattedMessage>
        <span className="cRed">
        {this.state.errors["user_mobilenumber"]}
        </span>
            
            </div>
            <div class="form-group medical_form col-md-10 no_padding">
            <div class="row">
            <div class="col-md-8">
            <div class="form-group">
            <div class="ui calendar" id="">
            <div class="ui input left icon form-control log-input">
           
            
      
                                              <DateInput
        clearable
        
        autocomplete="off"
         class="form-control log-input1"
          name="date1"
          id="date1"
          placeholder="Date of Birth"
          value={this.state.fields["user_dob"] ? this.state.fields["user_dob"] : ""}
          autoComplete="off"
          iconPosition="right" 
          onChange={this.HandledobChange}
          maxDate={moment().format("DD-MM-YYYY")}
          
        />
         <i class="fa fa-calendar" aria-hidden="true" ></i>
            </div>
            <span className="cRed">
                                                {this.state.errors["user_dob"]}
                                             </span>
            
            </div>
            </div>
            </div>
            <div class="col-md-4 no_padding">
            <p class="sel_date">
            {/* <img src="img/Medical details/i.e.svg" /> */}
            {translate('You Can')} <span>{translate('Select')}</span> {translate('or')} <span>{translate('Write')}</span>{translate('The Date of Birth')}</p> 
            </div>
            </div>
            
            </div>
            
            <div class="form-group medical_form col-md-10 no_padding" >
            
        <select class="form-conntrol log-input" style={{width:"100%"}} name="user_relation" id="user_relation" value={this.state.fields["user_relation"] || ""} onChange={this.HandlerelationChange.bind(this, "user_relation")}>
        <option value="0">--select relationship --</option>   
        <div dangerouslySetInnerHTML={{ __html:listdat }} />
        
        </select> 
       
        <span className="cRed">
        {this.state.errors["user_relation"]}
        </span>
        </div>






            <div class="form-group medical_form col-md-10 no_padding">
            
            <h2>{translate('Gender')}</h2>
        <div class="radio-inline">
        <label><input type="radio" className="gender" name="optradio" value="male" id="male"  onClick={this.Handlegenderchange.bind(this, "user_gender")} />{translate('Male')}</label>
        </div>
        <div class="radio-inline">
        <label><input type="radio" className="gender" name="optradio" value ="female" id="female" onClick={this.Handlegenderchange.bind(this, "user_gender")}/>{translate('Female')}</label>
        </div>
        <div class="radio-inline">
        <label><input type="radio" className="gender" name="optradio" value="other" id="other" onClick={this.Handlegenderchange.bind(this, "user_gender")}/>{translate('Other')}</label>
        </div>
        <div>
        <span className="cRed">
        {this.state.errors["user_gender"]}
        </span>
        </div>
            </div>
            
            </div>
            </div>
            </div>
            </div>
            <div class="row">
            <div class="col-md-12 text-right">
            <div class="next_btn">
            <p>
            <button type="submit" className="btn btn-default Next_btn_profile">{translate('Save & Next')}</button>
            </p>
            
            </div>
            </div>
            </div>
            </div>
            </div>
            </div>
            </section>
            </form>
            <ToastContainer />
            <PatientFooter/>
            </I18nPropvider>
            </main>
            
            
        )
    }
    
}