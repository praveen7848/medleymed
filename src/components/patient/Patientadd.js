import React, { Component, useState } from 'react';
import $ from "jquery";
import { ToastContainer, toast } from 'react-toastify';
import { Link } from "react-router-dom";
import Httpconfig from "../helpers/Httpconfig";
// import { Carousel } from "react-responsive-carousel";
import styles from "react-responsive-carousel/lib/styles/carousel.min.css";
import Patnewcss from "../../public/css/patient/style-new.css";
import { reactLocalStorage } from 'reactjs-localstorage';
import Constant from "../../constants";
import { FormattedMessage } from "react-intl"; // Backup Way to Convert
import { I18nPropvider, LOCALES } from '../../i18nProvider';
import translate from "../../i18nProvider/translate";
import PatientHeader from "../patient/Patientheader";
import PatientMenu from "../patient/Patientmenu";
import PatientFooter from "../patient/Patientfooter";
// import DatePicker from 'react-datepicker';
import ReactDOM from 'react-dom';
import { DateInput} from "semantic-ui-calendar-react";
const moment = require("moment");

// import "react-datepicker/dist/react-datepicker.css";
const listdat=[];
export default class Patientadd extends Component {
    
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
        };
        
        this.onFormSubmit = this.onFormSubmit.bind(this);
        this.addfamily=this.addfamily.bind(this);
        this.Handlenamehange=this.Handlenamehange.bind(this);
        //  this.profileCheckSubmit=this.profileCheckSubmit.bind(this);
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
            if(!this.state.selectedPatientId){
                this.createPatient(event);
            }else{
                this.updatePatient(event);
            }
          //  alert("insfdsf");
        } else {
            toast.warn("Form has errors.");
        }
    }
    HandledobChange = (event,{ name, value }) => {
       // alert(value);
        let field="user_dob";
        let fields = this.state.fields;
        fields[field] =value; //event.target.value;

        this.setState({ fields });
    };
    handleMobileChange = (event) => {
        // alert(value);
         let field="user_mobilenumber";
         let fields = this.state.fields;
         fields[field] =event.target.value;
 
         this.setState({ fields });
         this.forceUpdate();
     };
    // HandledobChange = (event,{ name, value }) => {
    //     // alert(value);
         
    //      this.state.patientDob=value;
    //      this.forceUpdate();
    //   };
    HandlerelationChange= (field, event) => {
        let fields = this.state.fields;
        fields[field] = event.target.value;
        this.setState({ fields });
    };
    
    Handlenamehange = (event) => {
        //let field="user_name";
        this.state.fields['user_name']=event.target.value;
        // let fields = this.state.fields;
        // fields[field] = event.target.value;
        // this.setState({ fields });
        //alert(this.state.fields['user_name']);
    };
    
    Handlegenderchange= (field, event) => {
        let fields = this.state.fields;
        fields[field] = event.target.value;
        this.setState({ fields });
    };
    // To get detais after first render
    componentDidMount = () => {
        //let userData="";
        
        let userData=reactLocalStorage.getObject('userObj');
        if(userData){
        if(userData!=""){
            this.setState({
                name: userData.name,
                user_mobile:userData.mobile_number,
                email_id:userData.email,
                token:userData.accessToken,
                patient_id:userData.patient_id,
                profile_image:"", 
            }); 
        }
        this.getRelativesList();
        this.getPatientRelations(userData.patient_id);
        } else{
            window.location.href = "/";
        }
        
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

    getPatientRelations=(patientId)=>{
        let profileImage="";
    Httpconfig.httptokenget(Constant.siteurl + "api/Patients/findpatientrealtives/"+patientId)
       .then((response) => { 
          
          
        const relativesList= response.data.data.map((relationsList,num)=>{ 
            if(num<5){
            if(relationsList.profile_pic!=null){
                profileImage=Constant.imgurl+relationsList.profile_pic;
            }else{
                if(relationsList.gender.toLowerCase()=="male"){
                 profileImage="../images/patient/img/Profile/Male_patient.svg"; 
                }else{
                 profileImage="../images/patient/img/Profile/Female_patient.svg";   
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

    handleValidation() {
        let fields = this.state.fields;
        let errors = {};
        let formIsValid = true;
        var pattern = /^[a-zA-Z0-9_ ]{3,20}$/g;
        //var phoneno = /^\+?([0-9]{2})\)?[-. ]?([0-9]{4})[-. ]?([0-9]{4})$/;
        var phoneno =/^\d{10}$/;
        if (!fields["user_dob"]) {
            errors["user_dob"] = "";
            formIsValid = false;
            errors["user_dob"] = "Enter / Select Date of Birth";
        } 
        if (!fields["user_name"]) {
            formIsValid = false;
            errors["user_name"] = "Enter family member name";
         } else if (!/^[a-zA-Z0-9 ]{3,20}$/g.exec(fields["user_name"])) {
            formIsValid = false;
            errors["user_name"] = "Special characters not allowed";
         }
         if (!fields["user_mobilenumber"]) {
            errors["user_mobilenumber"] = "";
            formIsValid = false;
            errors["user_mobilenumber"] = "Phone number cannot be empty";
         }else if(!fields["user_mobilenumber"].match(phoneno)){
            formIsValid = false;
            errors["user_mobilenumber"] = "Phone number invalid";
            
         }else if (fields["user_mobilenumber"].length < 10) {
            formIsValid = false;
            errors["user_mobilenumber"] = "Phone number invalid";
         } else if(fields["user_mobilenumber"].length == 10){

            Httpconfig.httptokenpost(Constant.siteurl + "api/Patients/checkphonenumber/", {
                "mobile_no": this.state.fields["user_mobilenumber"], 
             })
             .then((response) => {
             //   alert(response.status);
             //   alert(response.data.error);
               if(response.data.status==404 && response.data.error==true) {
                  // alert("in1");
                errors["user_mobilenumber"] = "Phone number Already exists";
                formIsValid = false;
                this.forceUpdate();
              }
               //console.log(response);
             })
             .catch((error) => {
                 this.props.history.push("/patienthealthprofile");
                 console.log(error);
                 toast.error(error);
             });

         }
         if (!fields["user_relation"]) {
            errors["user_relation"] = "0";
            formIsValid = false;
            errors["user_relation"] = "Select the relationship";
         } 
         if (!fields["user_gender"]) {
            errors["user_gender"] = "0";
            formIsValid = false;
            errors["user_gender"] = "Select the gender";
         }
        this.setState({ errors: errors });
        return formIsValid;
        
    }

    createPatient = (event) => {
       //alert("create");
        event.preventDefault();
        var handle = this.props.match.params.handle;
        const { fields, errors } = this.state;
        var parts =this.state.fields["user_dob"].split('-');
        var mydate=parts[2]+"-"+parts[1]+"-"+ parts[0];
        let url_path="api/Patients/updatepatient/"+this.state.patient_id;
       
        var post_data={
            "name": this.state.fields["user_name"], 
            "phone_number": this.state.fields["user_mobilenumber"], 
            "dob": mydate+"T07:03:03.000Z", 
            "gender": this.state.fields["user_gender"], 
            "page_type": "basicinfor", 
            "user_type": "patient", 
            "relation": this.state.fields["user_relation"], 
            "relation_patient_id": this.state.patient_id ,
        }
    
        Httpconfig.httptokenput(Constant.siteurl + url_path, {
            "name": this.state.fields["user_name"], 
            "phone_number": this.state.fields["user_mobilenumber"], 
            "dob": mydate+"T07:03:03.000Z", 
            "gender": this.state.fields["user_gender"],
            "page_type": "basicinfor", 
            "user_type": "patient", 
            "relation": this.state.fields["user_relation"], 
            "relation_patient_id": this.state.patient_id,
            
            
        })
        .then((response) => {
            toast.success('👌'+response.data.message, {
                position: "bottom-center" 
             });
             //console.log(response);
             //return 
             //alert(response.data.memberDataId);
             
             localStorage.setItem('currentMemberId',response.data.memberDataId);
             //return;
            //this.props.history.push("/patienthealthprofile");
            // toast.success("Successfully Created Patient" + response);
             setTimeout(() => this.props.history.push("/patienthealthprofile"), 2000);
            //this.props.history.push('/SetDoNotDisturb/'+handle);
        })
        .catch((error) => {
            this.props.history.push("/patienthealthprofile");
            console.log(error);
            toast.error(error);
        });
    };


    updatePatient = (event) => {
       // alert("Update");
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
             localStorage.setItem('currentMemberId',this.state.selectedPatientId);
            setTimeout(() => this.props.history.push("/patienthealthprofile"), 2000);
            
        })
        .catch((error) => {
            this.props.history.push("/patienthealthprofile");
            console.log(error);
            toast.error(error);
        });
    };



    addfamily =() =>{      
        //this.props.history.push("/Patientadd");
        window.location.href = "/Patientadd";
    }
    handleLanguage=(langValue)=>{
       
        this.setState({Language: langValue});
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
            <ToastContainer />
            
            {/* <PatientMenu /> */}
            {/* <PatientMenu /> */}
            <form onSubmit={this.onFormSubmit.bind(this)}>
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
            aria-valuemin="0" aria-valuemax="100" style={{width:"40%"}}>
            40% 
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
            <div class="col-md-4 col-sm-4">
            <div class="medical_patient_box">
            <h2>{translate('Who is the Patient?')}</h2>
            <p class="add_mem_btn" onClick={this.addfamily}><img src="../images/patient/img/Profile/Addmember.svg" />{translate('Add family Member')}</p>
            
            <div class="row">
            {/* <div class="user_mem_btn">
            <div class="col-md-2">
            <img class="user_img" src="../images/patient/img/Profile/user_image.svg" />
            </div>
            <div class="col-md-8 no_padding">
            <p>sdfs(Me)</p> 
            </div>
            <div class="col-md-2">
            <img src="../images/patient/img/Profile/arrow.svg" /> 
            </div>
            </div> */}
            {this.state.relativesList ? this.state.relativesList :""}


           
            
        </div>
        </div>
        </div>
        <div class="col-md-8 col-sm-8">
        <div class="help_info_box">
        <h2>{translate('Help us with your information')}</h2>
        
        
        <div class="form-group medical_form col-md-8 no_padding">
        <FormattedMessage id="Enter family member name">
        {
            placeholder => <input type="text" name="user_name" autocomplete="off" class="form-control log-input" placeholder={placeholder}  onKeyUp={this.Handlenamehange} defaultValue={this.state.fields["user_name"]}/>//onChange={this.Handlenamehange.bind(this, "user_name")}/>
        }
        </FormattedMessage>
        <span className="cRed">
        {this.state.errors["user_name"]}
        </span>
        
        {/* <input type="text" class="form-control log-input" id="name" value="" placeholder="Enter name" /> */}
        </div>
        
        <div class="form-group medical_form col-md-8 no_padding">
        <FormattedMessage id="Enter mobile number">
        {
            placeholder => <input type="text" name="user_mobilenumber" maxlength="10" autocomplete="off" class="form-control log-input" placeholder={placeholder} defaultValue={this.state.fields["user_mobilenumber"] || ""} onKeyPress={this.handleMobileChange} onChange={this.handleMobileChange}/>
        }
        </FormattedMessage>
        <span className="cRed">
        {this.state.errors["user_mobilenumber"]}
        </span>
        {/* <input type="number" class="form-control log-input" id="number" autocomplete="off" value="" placeholder="Enter mobile number" /> */}
        </div>
        <div class="form-group medical_form col-md-8 no_padding">
        <div class="row">
        <div class="col-md-12">
        <div class="form-group">
        <div class="ui calendar" id="">
        <div class="ui  left icon  form-control log-input">
        
        {/* <input type="text" class="form-control log-input" value="" id="dob" placeholde="Date of Birth"/>    */}
        {/* <FormattedMessage id="Date of birth">
        {
            placeholder => <input type="text" name="user_dob" autocomplete="off" class="form-control log-input" placeholder={placeholder} value={this.state.fields["user_dob"] || ""} onFormSubmit={this.HandledobChange.bind(this, "user_dob")} onBlur={this.HandledobChange.bind(this, "user_dob")} onKeyPress="return false;" onChange={this.HandledobChange.bind(this, "user_dob")}/>
        }
        </FormattedMessage> */}
        
        <DateInput
        clearable
        
        autocomplete="off"
         class="form-control log-input1"
          name="date1"
          placeholder="Date of Birth"
          value={this.state.fields["user_dob"] ? this.state.fields["user_dob"] : ""}
          autoComplete="off"
          iconPosition="right" 
          onChange={this.HandledobChange}
          
        />
         <i class="fa fa-calendar cal_icon" aria-hidden="true" ></i>
        
        {/* <img class="dob_img" src="../images/patient/img/Profile/DOB.svg"/> */}
        
        
        </div>
        <span className="cRed">
        {this.state.errors["user_dob"]}
        </span>
        
        </div>
        </div>
        </div>
        {/* <div class="col-md-6 no_padding">
        <p class="sel_date"><img src="img/Medical details/i.e.svg" />
        You Can <span>Select</span> or <span>Write</span> The Date of Birth</p> 
        </div> */}
        
        </div>
        
        </div>
        
        <div class="form-group medical_form col-md-8 no_padding" >
        <select class="form-conntrol log-input" style={{width:"100%"}} name="user_relation" id="user_relation" value={this.state.fields["user_relation"] || ""} onChange={this.HandlerelationChange.bind(this, "user_relation")}>
        <option value="0">--select relationship --</option>   
        {/* <option value="1">Father</option>
        <option value="2">   Mother</option>
        <option value="3"> Son</option> 
        <option value="4">Daughter</option> */}
        <div dangerouslySetInnerHTML={{ __html:listdat }} />
        {/* {this.state.listdata} */}
        </select> 
       
        <span className="cRed">
        {this.state.errors["user_relation"]}
        </span>
        </div>
        <div class="form-group medical_form col-md-8 no_padding">
        <h2>{translate('Gender')}</h2>
        <div class="radio-inline">
        <label><input type="radio" name="optradio" value="male" id="male"  onClick={this.Handlegenderchange.bind(this, "user_gender")} />{translate('Male')}</label>
        </div>
        <div class="radio-inline">
        <label><input type="radio" name="optradio" value ="female" id="female" onClick={this.Handlegenderchange.bind(this, "user_gender")}/>{translate('Female')}</label>
        </div>
        <div class="radio-inline">
        <label><input type="radio" name="optradio" value="other" id="other" onClick={this.Handlegenderchange.bind(this, "user_gender")}/>{translate('Other')}</label>
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
        {/* <a href="medical-details-1.html"> <p>Save & Next</p></a> */}
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