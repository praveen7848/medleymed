import React, { Component, useState } from "react";
import $ from "jquery";
import { ToastContainer } from "react-toastify";
import { Redirect } from "react-router-dom";
import toast from "../../helpers/toast";
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
import { reactLocalStorage } from "reactjs-localstorage";
//import Popup from 'reactjs-popup';
import Modal from "react-bootstrap/Modal";
import "bootstrap/dist/css/bootstrap.min.css";
// import {Animated} from "react-animated-css";
const moment = require("moment");

//const imgurl='http://3.7.234.106:8100/';
export default class Doctordashboard extends Component {
    constructor(props) {
      super(props);
      this.state = {
        fields: {},
        errors: {},
        files: [],
        doctor_id:"",
        doc_data:[],
        telemedInprogressAppointmentList:"",
        telemedAppointmentUpcomingList:"",
        response:[],
        modalvisible:"modal collapse-hide",
        

      
      };
      
      this.viewAllTelemedicineAppointment=this.viewAllTelemedicineAppointment.bind(this);
      this.joinAppointment=this.joinAppointment.bind(this);
      this.close=this.close.bind(this);
      this.modalShow=this.modalShow.bind(this);
      
    }
    viewAllTelemedicineAppointment=()=>{
      window.location.href = "./Doctortelemedicineappointments";
    }
    componentDidMount=()=>{
      var retrievedObject=localStorage.getItem('DocuserObj');
      let userData=JSON.parse(retrievedObject);
      //alert(userData.doctor_id);
      this.state.doctor_id=userData.doctor_id;
      //alert(this.state.doctor_id=userData.doctor_id);
      this.getTelemedicineOverview();
      this.getTelemedicineInprogessAppointmentList();
      this.getTelemedicineUpcomingAppointmentList();
     

      const interval = setInterval(() => {
        this.getTelemedicineOverview();
        this.getTelemedicineInprogessAppointmentList();
        this.getTelemedicineUpcomingAppointmentList();
        this.getTelemedicinePastAppointmentList();
       }, 10000);
    
    }
    getTelemedicineOverview=()=>{
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
          todayTelemedicineUpcomingCount:response.data.data.telemedicine[0].todayUpcomingCount,
          todayTelemedicineInprogressCount:response.data.data.telemedicine[0].todayInprogressCount,
          todayTelemedicineCompletedCount:response.data.data.telemedicine[0].todayCompletedCount, 
          todayTelemedicineCancelledCount:response.data.data.telemedicine[0].todayCancelledCount,   

          todayClinicPatientCount:response.data.data.clinic[0].todayPatientCount,
          todayClinicUpcomingCount:response.data.data.clinic[0].todayUpcomingCount,
          todayClinicInprogressCount:response.data.data.clinic[0].todayInprogressCount,
          todayClinicCompletedCount:response.data.data.clinic[0].todayCompletedCount, 
          todayClinicCancelledCount:response.data.data.clinic[0].todayCancelledCount,   
          todayTotalRevenue:response.data.data.revenue[0].todayTotalRevenue,

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
    getTelemedicineInprogessAppointmentList=()=>{
      let telemedAppointmentInprogressList="";
      var patientImage="";
      var today= moment(new Date());
      var todayDate=moment(today).format("YYYY-MM-DD");
      var post_data={
        doctorId:this.state.doctor_id,
        appointmentDate:todayDate,
        status:1
      }
      Httpconfig.httptokenpost(Constant.siteurl + "api/PatientAppointment/getTodayAppointmentDetails",
      post_data
      )
      .then((response) => {
      
  
        if(response.data.status=="200" && response.data.error==false){
         let inprogressAppointmentCount=Object.keys(response.data.data).length;
         if(inprogressAppointmentCount>0){
           telemedAppointmentInprogressList= response.data.data.map((appointmentdetails)=>{  
            if(appointmentdetails.patient_tbl.profile_pic!=null){
              
              patientImage = Constant.imgurl+appointmentdetails.patient_tbl.profile_pic;
            }else{
              if(appointmentdetails.patient_tbl.gender.toLowerCase()=='male'){
                patientImage="../images/patient/img/Profile/Male_patient.svg";
              }else{
                patientImage="../images/patient/img/Profile/Female_patient.svg";
              }
              
            }
            var mindiff=(moment().diff(appointmentdetails.appointment_datetime, 'minutes'));
             if(mindiff<5){
      return(
            <div class="doc_available">
            
              <div class="row">
                <div class="col-lg-9 col-md-9 col-sm-9 col-xs-9">
                  <div class="doc_details">
                    <img src={patientImage} />
                    <div class="doc_name">
                    <h4>{appointmentdetails.patient_tbl.name.charAt(0).toUpperCase() + appointmentdetails.patient_tbl.name.slice(1)}</h4>
                    <p>{appointmentdetails.patient_tbl.gender}, <span>{ moment(appointmentdetails.patient_tbl.dob, "YYYY//MM/DD").fromNow().split(" ")[0]} Years</span></p>
                  </div>
                 
                  </div>
                </div>
                <div class="col-lg-3 col-md-3 col-sm-3 col-xs-3">
                  <p class="doc_time">{ moment(appointmentdetails.appointment_datetime).format("LT")}</p>
                </div>
              </div>
              
              <div class="doc_app_time">
                <div class="row">
                  <div class="col-lg-5 col-md-5 no_padding" id={appointmentdetails.appointment_confirm_id+"-"+appointmentdetails.patient_id} onClick={this.modalShow}>
                    <p class="med_det" id={appointmentdetails.appointment_confirm_id+"-"+appointmentdetails.patient_id}> <img src="../images/doctor-img/medical-details.svg" /> Medical Details</p>
                  </div>
                  <div class="col-lg-7 col-md-7 no_padding" id={appointmentdetails.appointment_confirm_id+"-"+appointmentdetails.patient_id} onClick={this.joinAppointment.bind(this,appointmentdetails.appointment_confirm_id+"-"+appointmentdetails.patient_id)}>
                    <p class="join_now"> <img src="../images/doctor-img/joinNow-icon.svg" />  Join Now</p>
                  </div>
                </div>
             
               
              </div>
              {/* <div class="write_section">
                <div class="row">
                  <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                    <p>
          <img class="pres_img" src="../images/doctor-img/WritePrescription-icon.svg" /> Write Prescription</p>
                  </div>
                  <div class="col-lg-3 col-md-3 col-sm-3 col-xs-3" onClick={this.Modal}>
          <img class="cal_img" src="https://www.iconfinder.com/data/icons/basics-1/100/Call-512.png" />
                  </div>
                </div>
              </div> */}
           
              
            </div>
  )
}  
          
         })
        }else{
          
          telemedAppointmentInprogressList='';//'<div>No Inprogress Appointments</div>';
        }
        this.setState({
          telemedInprogressAppointmentList:telemedAppointmentInprogressList,
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

    getTelemedicineUpcomingAppointmentList=()=>{
      let telemedAppointmentUpcomingList="";
      var today= moment(new Date());
      var patientImage="";
      var todayDate=moment(today).format("YYYY-MM-DD");
      
      var post_data={
        
        doctorId:this.state.doctor_id,
        appointmentDate:todayDate,
        status:2
      }
      Httpconfig.httptokenpost(Constant.siteurl + "api/PatientAppointment/getTodayAppointmentDetails",
      post_data
      )
      .then((response) => {
      
  
        if(response.data.status=="200" && response.data.error==false){
         let upComingAppointmentCount=Object.keys(response.data.data).length;
         if(upComingAppointmentCount>0){
           telemedAppointmentUpcomingList= response.data.data.map((appointmentdetails)=>{  
            // alert(appointmentdetails.patient_tbl.name);
            if(appointmentdetails.patient_tbl.profile_pic!=null){
              
              patientImage = Constant.imgurl+appointmentdetails.patient_tbl.profile_pic;
            }else{
              if(appointmentdetails.patient_tbl.gender.toLowerCase()=='male'){
              patientImage="../images/patient/img/Profile/Male_patient.svg";
              }else{
                patientImage="../images/patient/img/Profile/Female_patient.svg"; 
              }
            }

            let DocName=appointmentdetails.patient_tbl.name.charAt(0).toUpperCase() + appointmentdetails.patient_tbl.name.slice(1);
            var mindiff=(moment().diff(appointmentdetails.appointment_datetime, 'minutes'));
            //alert(mindiff);
            if(mindiff<10) {
    return(


      <div class="upcoming_box">
        <div class="row">
          <div class="col-lg-9 col-md-9 col-sm-9 col-xs-9">
            <div class="doc_details">
            <img src={patientImage}/>
              {/* <img src="img/Profile/doctor.png" /> */}
              <div class="doc_name">
              <h4>{DocName}</h4>
              <p>{appointmentdetails.patient_tbl.gender} <span>{ moment(appointmentdetails.patient_tbl.dob, "YYYY//MM/DD").fromNow().split(" ")[0]} Years</span></p>
            </div>
           
            </div>
          </div>
          <div class="col-lg-3 col-md-3 col-sm-3 col-xs-3">
            <p class="doc_time">{ moment(appointmentdetails.appointment_datetime).format("LT")}</p>
          </div>
        </div>
        <div class="doc_app_time">
          <div class="row">
            <div class="col-lg-4 col-md-4 no_padding" id={appointmentdetails.appointment_confirm_id+"-"+appointmentdetails.patient_id} onClick={this.modalShow}>
              <p class="med_det" id={appointmentdetails.appointment_confirm_id+"-"+appointmentdetails.patient_id}>Medical Details</p>
            </div>
            {mindiff <0 ?
            <div class="col-lg-8 col-md-8 no_padding">
              <p class="join_now"> Appointment in <span>{ moment(appointmentdetails.appointment_datetime).fromNow()} </span> </p>
            </div>
            : 
            <div class="col-lg-7 col-md-7 no_padding" id={appointmentdetails.appointment_confirm_id+"-"+appointmentdetails.patient_id} onClick={this.joinAppointment.bind(this,appointmentdetails.appointment_confirm_id+"-"+appointmentdetails.patient_id)}>
                    <p class="join_now"> <img src="../images/doctor-img/joinNow-icon.svg" />  Join Now</p>
                  </div>
            }
          </div>
      </div>
      </div>
    
  )
}
          
})
           

  }
//   else{
          
//     telemedAppointmentUpcomingList='<div class="no_appoint">No Upcoming Appointments</div>';
//  }
 this.setState({
  telemedAppointmentUpcomingList:telemedAppointmentUpcomingList,
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

// get telemed past appointments
getTelemedicinePastAppointmentList=()=>{
let telemedAppointmentPastList="";
var today= moment(new Date());
var patientImage="";
var todayDate=moment(today).format("YYYY-MM-DD");
var post_data={
  doctorId:this.state.doctor_id,
  appointmentDate:todayDate,
  status:0
}
Httpconfig.httptokenpost(Constant.siteurl + "api/PatientAppointment/getTodayAppointmentDetails",
post_data
)
.then((response) => {


  if(response.data.status=="200" && response.data.error==false){
   let pastAppointmentCount=Object.keys(response.data.data).length;
   if(pastAppointmentCount>0){
     telemedAppointmentPastList= response.data.data.map((appointmentdetails)=>{  
      // alert(appointmentdetails.patient_tbl.name);
      if(appointmentdetails.patient_tbl.profile_pic!=null){
        
        patientImage = Constant.imgurl+appointmentdetails.patient_tbl.profile_pic;
      }else{
        if(appointmentdetails.patient_tbl.gender.toLowerCase()=='male'){
        patientImage="../images/patient/img/Profile/Male_patient.svg";
        }else{
          patientImage="../images/patient/img/Profile/Female_patient.svg";  
        }
      }
      var mindiff=(moment().diff(appointmentdetails.appointment_datetime, 'minutes'));
      if(mindiff>0 || appointmentdetails.status==4 || appointmentdetails.status==3 ) {
      

return(

<div class="clinic_box">
  <div class="row">
    <div class="col-lg-9 col-md-9 col-sm-9 col-xs-9">
      <div class="doc_details">
        <img src={patientImage} />
        <div class="doc_name">
          <h4>{appointmentdetails.patient_tbl.name.charAt(0).toUpperCase() +appointmentdetails.patient_tbl.name.slice(1)}</h4>
        <p>{appointmentdetails.patient_tbl.gender}, <span>{ moment(appointmentdetails.patient_tbl.dob, "YYYY//MM/DD").fromNow().split(" ")[0]} Years</span></p>
      </div>
     
      </div>
      
    </div>
    <div class="col-lg-3 col-md-3 col-sm-3 col-xs-3">
      <p class="doc_time">{ moment(appointmentdetails.appointment_datetime).format("LT")}</p>
    </div>
  </div>
  <div class="doc_app_time">
      <div class="row">
      <div class="col-lg-6 col-md-6" id={appointmentdetails.appointment_confirm_id+"-"+appointmentdetails.patient_id} onClick={this.modalShow}>
          <p class="med_det" >Medical Details</p>
        </div>
        <div class="col-lg-6 col-md-6" id={appointmentdetails.appointment_confirm_id} >
        {appointmentdetails.status==3 ? (
        <a href={Constant.imgurl+appointmentdetails.prescription_id} target="_blank">
          <p class="write_pre"> View Prescription  </p>
          </a>) : ""}
         {appointmentdetails.status==2 ? (<a id={appointmentdetails.appointment_confirm_id+"-"+appointmentdetails.patient_id} onClick={this.joinAppointment.bind(this,appointmentdetails.appointment_confirm_id+"-"+appointmentdetails.patient_id)}>
          <p class="write_pre"> Write Prescription</p>
        </a>) :""}
        {appointmentdetails.status==1 ? (<a id={appointmentdetails.appointment_confirm_id+"-"+appointmentdetails.patient_id} onClick={this.joinAppointment.bind(this,appointmentdetails.appointment_confirm_id+"-"+appointmentdetails.patient_id)}>
        <p class="write_pre"> Write Prescription</p>
      </a>) :""

        }
        {(appointmentdetails.status==4  )  ? (<a><p class="app_cancel"> Appointment Cancelled  </p> </a>): ("")}
          
        </div>
      </div>
  </div>
</div>

)
}
    
})

}
// else{
    
//   telemedAppointmentPastList='No Past Appointments';
// }
this.setState({
telemedAppointmentPastList:telemedAppointmentPastList,
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

    joinAppointment=(id)=>{
     // alert(id);
      let data=id.split("-");
      let appointmentId=data[0];
      let patientId=data[1];
      reactLocalStorage.setObject("DoctorSelectedConsultation",JSON.parse( appointmentId));
      reactLocalStorage.setObject("DoctorSelectedPatientId", JSON.parse(patientId));
      window.location.href = "./Doctorvideoconsultation";
    }
    close = () => {
      this.setState({
        modal:false,
        modalvisible: "modal collapse-hide",
      })
     
    }
    modalShow=(e)=>{
      let appointmentId="";
      let patientId="";
     let patientData=e.currentTarget.id;
     if(patientData!=""){
     let  patientDetails=patientData.split("-");
          appointmentId=patientDetails[0];
          patientId=patientDetails[1];
     }

     Httpconfig.httptokenpost(Constant.siteurl + "api/Patients/getMedicalDetails/",{"appointment_id":parseInt(appointmentId),"patient_id":parseInt(patientId)})
     .then((response) => {
    //   let drugAllergies="";
    //   let currentMedication="";
    //   let sympotms="";
    //   let patientMedicalDocument="";
    //      if(response.data.status=="200" && response.data.error==false){

    //       let pastLength=response.data.data[0].patient_past_histories[0]['patient_current_medication'].length;
    //       if(pastLength>0){
    //         for(var past=0;past<pastLength;past++){
              
    //           currentMedication=currentMedication+","+response.data.data[0].patient_past_histories[0]['patient_current_medication'][past]['medicinename'];

    //         }
    //       }
    //       //alert(currentMedication);
    //       let drugAllergiesLength=response.data.data[0].patient_past_histories[0]['patient_drug_allergies'].length;
    //       if(drugAllergiesLength>0){
    //         for(var past=0;past<drugAllergiesLength;past++){
              
    //           drugAllergies=drugAllergies+","+response.data.data[0].patient_past_histories[0]['patient_drug_allergies'][past]['category'];

    //         }
    //       }
    //       //alert(drugAllergies);
    //       let symptomsLength=response.data.data[0].symptoms_tbls[0]['symptoms'].length;
    //       if(symptomsLength>0){
    //         for(var past=0;past<symptomsLength;past++){
              
    //           sympotms=sympotms+","+response.data.data[0].symptoms_tbls[0]['symptoms'][past]['description'];

    //         }
    //       }


    //   //     var drugAllergies=Object.keys(response.data.data[0].patient_past_histories[0].patient_drug_allergies).length;
    //   //     // alert(drugAllergies);
    //   //      if(drugAllergies>2){
    //   //      const patientDrugAllergies= response.data.data[0].patient_past_histories[0].patient_drug_allergies.map((allergies)=>{   
    //   //          return ( allergies.name);   
              
    //   //      }); 
    //   //    }else{
    //   //     var patientDrugAllergies="";
    //   //    }
    //   //    var currentMedication=Object.keys(response.data.data[0].patient_past_histories[0].patient_current_medication).length;
    //   //    if(currentMedication>2){
    //   //      const patientCurrentMedication= response.data.data[0].patient_past_histories[0].patient_current_medication.map((medicines)=>{   
    //   //        return ( medicines.name);   
    //   //      });
    //   //    }else{
    //   //     var  patientCurrentMedication="";
    //   //    }
    //   //    var patientMedicalDocument="";
    //   // var symptoms=Object.keys(response.data.data[0].symptoms_tbls[0]).length;
      
    //   // if(symptoms>2){
    //   //   const symptoms_tbls= response.data.data[0].symptoms_tbls.map((symptoms)=>{   
    //   //     //alert("hi");
    //   //    // console.log(symptoms);
    //   //     return (
    //   //        symptoms);   
    //   //   });  
    //   // }else{
    //   //   var symptoms_tbls="";
    //   // }
    //     //alert(symptoms_tbls);
    //     let patientAge="";
    //   if(response.data.data[0].dob!=null){
    //     let dob=response.data.data[0].dob.split("T");
    //     let age=dob[0];
    //     let ageYears=moment().diff(age, 'years');
    //     let ageMonths=moment().diff(age, 'months');
    //     let ageDays=moment().diff(age, 'days');
    //     let patientAge="";
    //     if(ageYears>0){
    //         patientAge=ageYears+" Years";
    //     }
    //     if(ageMonths>0){
    //         patientAge=ageMonths +" Months";
    //     }
    //     if(ageDays){
    //         patientAge=ageDays+" Days";
    //     }
    //   }
    //    // alert(response.data.data[0].name);
    //         this.setState({
    //         "patientName":response.data.data[0].name.charAt(0).toUpperCase() + response.data.data[0].name.slice(1),
    //         gender:response.data.data[0].gender,
    //         dob:patientAge,
    //         profilePic:response.data.data[0].profile_pic,
    //         relation:"",
    //         chornicDiseases_list:response.data.data[0].chornic_diseases_list,
    //         relatedMedication:response.data.data[0].related_medication,
    //         pastHistoryName:response.data.data[0].patient_past_histories[0].past_history,
    //        // drugAllergies:patientDrugAllergies,
    //         symptoms:sympotms,
    //         temperature:response.data.data[0].vital_informations[0].temperature,
    //         bm:response.data.data[0].vital_informations[0].bmi,
    //         respiratory:response.data.data[0].vital_informations[0].respiratory_rate,
    //         pulse_rate:response.data.data[0].vital_informations[0].pulse_rate,
    //         bloodPressureSystolic:response.data.data[0].vital_informations[0].blood_pressure_systolic,
    //         bloodPressureDiastolic:response.data.data[0].vital_informations[0].blood_pressure_diastolic,
    //         height:response.data.data[0].vital_informations[0].height,
    //         weight:response.data.data[0].vital_informations[0].weight,
    //        // patientDrugAllergies:patientDrugAllergies,
    //         patientMedicalDocument:patientMedicalDocument,
    //       });
      
           
    //        // toast.warn("Hi Doctor, you status as changed to Unavailable", {
    //    }else{
    //        toast.warn("Sorry we cannot update the Availibility status at this moment", {
    //            position: "bottom-center",
    //          });
    //    }
    //  })
    //  .catch((error) => {
    //    toast.error(error);
    //  });
    //   this.setState({
    //     modal:true,
    //     modalvisible: "modal collapse-hide",
    //   })
    // }
    let patientCurrentMedication="";
let patientDrugAllergies="";
let symptoms_tbls="";
let patientMedicalDocument=[];
let imagedata=[];
let patientAge="";
let chornicDiseases_list="";
let relatedMedication="";
let drugAllergies="";
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
let patientName=response.data.data[0].name.charAt(0).toUpperCase() + response.data.data[0].name.slice(1);
let gender=response.data.data[0].gender;
let diagnostics="";
let consultationPurpose="";


if(Object.keys(response.data.data[0].patient_past_histories).length>0){
let pastLength=response.data.data[0].patient_past_histories[0]['patient_current_medication'].length;
if(pastLength>0){
  for(var past=0;past<pastLength;past++){
    
    patientCurrentMedication=patientCurrentMedication+","+response.data.data[0].patient_past_histories[0]['patient_current_medication'][past]['medicinename'];

  }
}
}
//alert(currentMedication);
if(Object.keys(response.data.data[0].patient_past_histories).length>0){
let drugAllergiesLength=response.data.data[0].patient_past_histories[0]['patient_drug_allergies'].length;
if(drugAllergiesLength>0){
  for(var past=0;past<drugAllergiesLength;past++){
    
    patientDrugAllergies=patientDrugAllergies+","+response.data.data[0].patient_past_histories[0]['patient_drug_allergies'][past]['medicinename'];

  }
}
}

if(Object.keys(response.data.data[0].drug_allergies).length>0){
  
let drugAllergiesLength=response.data.data[0].drug_allergies.length;
if(drugAllergiesLength>0){
  for(var past=0;past<drugAllergiesLength;past++){
    
    patientDrugAllergies=patientDrugAllergies+","+response.data.data[0].drug_allergies[past]['medicinename'];

  }
  
}
}



if(Object.keys(response.data.data[0].problem_tbls).length>0){
  consultationPurpose=response.data.data[0].problem_tbls[0]['problem'];
}

if(Object.keys(response.data.data[0].symptoms_tbls).length>0){
  diagnostics=response.data.data[0].symptoms_tbls[0].doctor_diagnosis;
let symptomsLength=response.data.data[0].symptoms_tbls[0]['symptoms'].length;
if(response.data.data[0].symptoms_tbls[0].add_more_symptoms!=null){
  symptoms_tbls=response.data.data[0].symptoms_tbls[0].add_more_symptoms;
  }
if(symptomsLength>0){
  for(var past=0;past<symptomsLength;past++){
    
    symptoms_tbls=symptoms_tbls+","+response.data.data[0].symptoms_tbls[0]['symptoms'][past]['description'];

  }
}
}

let documentsLength=response.data.data[0].patient_past_histories.length;
// alert(documentsLength);
if(documentsLength>0){ 
  for(var pastdoc=0;pastdoc<documentsLength;pastdoc++){
    for(let doc=0;doc<response.data.data[0].patient_past_histories[pastdoc]['patient_medical_document'].length;doc++) {            
      patientMedicalDocument[doc]=response.data.data[0].patient_past_histories[pastdoc]['patient_medical_document'][doc].replace("jpeg", "jpg");
//  alert(patientMedicalDocument);
    imagedata[doc]='<div class="med_upload_box"><img src='+Constant.imgurl+patientMedicalDocument[doc]+'><p>Health record '+(doc+1)+'</p></div>';
    }
  }
}


if(response.data.data[0].dob!=null){
    let dob=response.data.data[0].dob.split("T");
    let age=dob[0];
    let ageYears=moment().diff(age, 'years');
    let ageMonths=moment().diff(age, 'months');
    let ageDays=moment().diff(age, 'days');
    if(ageYears>0){
        patientAge=ageYears+" Years";
    }else if(ageMonths!=""){
        patientAge=ageMonths +" Months";
    }else if(ageDays!=""){
        patientAge=ageDays+" Days";
    }
    patientAge= moment(response.data.data[0].dob, "YYYY//MM/DD").fromNow().split(" ")[0]+" Years";
}

if(response.data.data[0].chornic_diseases_list!=null){
  chornicDiseases_list=response.data.data[0].chornic_diseases_list;
}
// alert(Object.keys(response.data.data[0].related_medication).length);
 if(response.data.data[0].related_medication!=null){
  if(Object.keys(response.data.data[0].related_medication).length>0){
    for(let medCount=0;medCount<Object.keys(response.data.data[0].related_medication).length;medCount++){
      relatedMedication=relatedMedication+","+response.data.data[0].related_medication[medCount]['medicinename'];
    }
  }
 }
  

if(Object.keys(response.data.data[0].vital_informations).length>0){
  bloodPressureSystolic=response.data.data[0].vital_informations[0].blood_pressure_systolic;
  bloodPressureDiastolic=response.data.data[0].vital_informations[0].blood_pressure_diastolic;

  if(response.data.data[0].vital_informations[0].height!=""){
  var realFeet = ((response.data.data[0].vital_informations[0].height*0.393700) / 12);
  var feet = Math.floor(realFeet);
  var inches = Math.round((realFeet - feet) * 12);
  feet= feet+ "'," + inches + '"';
  response.data.data[0].vital_informations[0].height=feet;
  
  }


  height=response.data.data[0].vital_informations[0].height;
  weight=response.data.data[0].vital_informations[0].weight;
  bmi=response.data.data[0].vital_informations[0].bmi;
  pulse_rate=response.data.data[0].vital_informations[0].pulse_rate;
  respiratory_rate=response.data.data[0].vital_informations[0].respiratory_rate;
  skip_blood_pressure= response.data.data[0].vital_informations[0].blood_sugar;
  temperature=response.data.data[0].vital_informations[0].temperature;

}
//alert(patientAge);
//alert(symptoms_tbls);
  this.setState({
    
    "patientName":patientName.charAt(0).toUpperCase() + patientName.slice(1),
    consultationPurpose:consultationPurpose,
    gender:gender,
    dob:patientAge,
    profilePic:response.data.data[0].profile_pic,
    relation:response.data.data[0].master_relationship.relation_name,
    chornicDiseases_list:chornicDiseases_list+response.data.data[0].patient_past_histories[0].past_history,
    relatedMedication:relatedMedication+patientCurrentMedication,
    drugAllergies:patientDrugAllergies,
    symptoms:symptoms_tbls,
    relationPatientId: response.data.data[0].relation_patient_id,
    appointmentId:appointmentId,//problem_tbls
    bloodPressureSystolic:bloodPressureSystolic,
    bloodPressureDiastolic:bloodPressureDiastolic,
    height:height,
    weight:weight,
    bmi:bmi,
    pulse_rate:pulse_rate,
    respiratory_rate:respiratory_rate,
    skip_blood_pressure: skip_blood_pressure,
    temperature:temperature,
    labTests:"",
    patientMedicalDocument:patientMedicalDocument,
    imagedata:imagedata,
    problem:response.data.data[0].problem_tbls[0].problem,
    doctorDiagnosis:diagnostics,
  });
  
})



  this.setState({
    modal:true,
    modalvisible: "modal collapse-show",
  })
  
  this.forceUpdate();

}

    render() {
   // const telemedAppointmentList=this.state.telemedAppointmentList.length;
      //console.log(this.state);
        return (
            <main id="main">
            <DoctorHeader onSelectLanguage={this.handleLanguage}/>
           
            
        <I18nPropvider locale={this.state.Language}>
        <applist />
    <section id="doctor_dashboard">
  <div class="container-fluid">
    <div class="row">
    <DoctorSideMenu onSelectLanguage={this.handleLanguage}/>
    
    {/* <Animated animationIn="shake" animationOut="flipOutX" animationInDuration={1000} animationOutDuration={1000} isVisible={this.state.modal}> */}
   {/*
    <Modal show={this.state.modal}>
      <Modal.Header>
      {/* <div class="modal-header">
          <button type="button" class="close" data-dismiss="modal">&times;</button>
          <h4 class="modal-title">{this.state.patientName}<span>Medical Details</span></h4>
          <p>{this.state.gender},{this.state.dob}</p>
        </div> 
        <div>
          <b>{this.state.patientName}</b>
          </div>
          <div>{this.state.gender},{this.state.dob}</div>
          <a href onClick={this.close}>Close</a>
          </Modal.Header>
      <Modal.Body>
        <div><span>Patient Id:</span><span>{this.state.patient_id}</span></div>
        <div><span>Prescription Id:</span><span></span></div>
        <div>
          <h4>Vital Information</h4>
          <div><span>Pulse Rate:</span><span>{this.state.pulse_rate ? this.state.pulse_rate :"--"}</span></div>
          <div><span>Blood Pressure:</span><span>{this.state.blood_pressure_diastolic ? this.state.blood_pressure_diastolic+"mmHG" : "--"}-{this.state.blood_pressure_systolic ? this.state.blood_pressure_systolic+"mmHG":"--"}</span></div>
          <div><span>Temperature:</span><span>{this.state.temperature ? this.state.temperature : "--"}</span></div>
          <div><span>Respiratory Rate:</span><span>{this.state.respiratory ? this.state.respiratory :"--"}</span></div>
          <div><span>Height:</span><span>{this.state.height ? this.state.height : "--"}</span></div>
          <div><span>BMI:</span><span>{this.state.bmi ? this.state.bmi : "--"}</span></div>
          <div><span>Weight:</span><span>{this.state.weight ? this.state.weight : "--"}</span></div>
        </div>
        <div> 
          <h5>Past Medical History</h5>
          <div><span>{this.state.pastHistoryName}</span></div>
        </div>
        <div> 
          <h3>Diagnosis</h3>
          <div><span>{this.state.pulse_rate}</span></div>
        </div>
        <div> 
          <h3>Lab Tests</h3>
          <div><span>Pulse Rate</span><span>{this.state.pulse_rate}</span></div>
        </div>
      </Modal.Body>
      
    </Modal>    */}
    
 <div id="upcominggModal" class={this.state.modalvisible} role="dialog">
    <div class="modal-dialog">
  
      
      <div class="modal-content">
        <div class="modal-header">
          <button type="button" class="close" data-dismiss="modal" onClick={this.close}>&times;</button>
          <h4 class="modal-title">{this.state.patientName}<span>Medical Details</span></h4>
          <p>{this.state.gender},{this.state.dob}</p>
        </div>

        <div class="modal-body">
          {/* <p class="sch_box">16 june 2020 , 02:30 PM</p> */}
          <div class="med_details">
            <p>Patient UHID: <span>{this.state.relationPatientId}</span></p>
            {/* <p>Prescription ID :{this.state.appointmentId}</p> */}
          </div>
          <div class="med_details">
            <h2>Puropose of Visit</h2>

            <p>{this.state.consultationPurpose}</p>
          </div>
          <div class="med_details">
            <h2>Vital Information</h2>
            <p>Pulse rate: <span>{this.state.pulse_rate ? this.state.pulse_rate :"--"}</span></p>
            <p>Blood Pressure : {this.state.bloodPressureDiastolic ? this.state.bloodPressureDiastolic+"mmHG" : "--"}-{this.state.bloodPressureSystolic ? this.state.bloodPressureSystolic+"mmHG":"--"}</p>
            <p>Blood Sugar : <span>{this.state.skip_blood_pressure ? this.state.skip_blood_pressure +"mg/dl": "--"}</span></p>
            <p>Temperature: <span>{this.state.temperature ? this.state.temperature+" F" : "--"}</span></p>
            <p>Respiratory : <span>{this.state.respiratory_rate ? this.state.respiratory_rate+"Breaths / minute" :"--"}</span></p>
            <p>Height: <span>{this.state.height ? this.state.height : "--"}</span></p>
            <p>Weight : <span>{this.state.weight ? this.state.weight +"Kg": "--"}</span></p>
            <p>BMI : <span>{this.state.bmi ? this.state.bmi+"Kg/M2" : "--"}</span></p>
           
            
          </div>
          <div class="med_details">
            <h2>Past Medical History</h2>
            <p>Chronic Diseases:{this.state.chornicDiseases_list ? this.state.chornicDiseases_list :"--"}</p>
            <p>Related medicines:{this.state.relatedMedication ? this.state.relatedMedication: "--"}</p>
            <p>Drug Allergies:{this.state.drugAllergies ? this.state.drugAllergies :"--"}</p>
            
          </div>
          <div class="med_details">
            <h2>Symptoms</h2>
            <p>{this.state.symptoms ? this.state.symptoms: "--"}</p>
          </div>
          {/* <div class="med_details">
            <h2>Diagnosis</h2>
            <p>{this.state.doctorDiagnosis ? this.state.doctorDiagnosis: "--"}</p>
          </div>
          <div class="med_details">
            <h2>Lab Test</h2>
            <p>{this.state.labTests ? this.state.labTests : "--"}</p>
          </div> */}
        </div>
      </div>
  
    </div>
  </div>


{/* </Animated> */}
<div class="col-lg-10 col-md-9">
<div class="overview_left">
  <div class="overview_section">
    <div class="row">
<div class="col-lg-6 col-md-12">
<div  class="telemed_overview">
  <h2>Telemedicine Overview</h2>
  <div class="container">
  <div class="row">
    <div class="col-lg-3 col-md-3 no_padding text-mid">
<div class="today_pat">
  <h3>Todays patient</h3>
  <p>{this.state.todayTelemedicinePatientCount ? this.state.todayTelemedicinePatientCount : "0" }</p>
</div>
    </div>
    <div class="col-lg-3 col-md-3 no_padding text-mid">
      <div class="ongoing_consult">
        <h3>Ongoing Consultation</h3>
        <p>{this.state.todayTelemedicineInprogressCount ? this.state.todayTelemedicineInprogressCount : "0" }</p>
      </div>
    </div>
    <div class="col-lg-3 col-md-3 no_padding text-mid">
      <div class="complete_consult">
        <h3>Completed Consultation</h3>
        <p>{this.state.todayTelemedicineCompletedCount ? this.state.todayTelemedicineCompletedCount : "0" }</p>
      </div>
    </div>
    <div class="col-lg-3 col-md-3 no_padding text-mid">
      <div class="pending_consult">
        <h3>Pending Consultation</h3>
        <p>{this.state.todayTelemedicineUpcomingCount ? this.state.todayTelemedicineUpcomingCount : "0" }</p>
      </div>
    </div>
  </div>
  </div>
</div>
</div>
{/* <div class="col-lg-4 col-md-12">
  <div  class="clinic_overview">
    <h2>Clinic overview</h2>
    <div class="container">
    <div class="row">
    
      <div class="col-lg-4 col-md-4 no_padding text-mid">
        <div class="ongoing_consult">
          <h3>Todays patient</h3>
          <p>{this.state.todayClinicPatientCoun ? this.state.todayClinicPatientCoun : "0" }</p>
        </div>
      </div>
      <div class="col-lg-4 col-md-4 no_padding text-mid">
        <div class="complete_consult">
          <h3>Completed Consultation</h3>
          <p>{this.state.todayClinicCompletedCount ? this.state.todayClinicCompletedCount : "0" }</p>
        </div>
      </div>
      <div class="col-lg-4 col-md-4 no_padding text-mid">
        <div class="pending_consult">
          <h3>Pending Consultation</h3>
          <p>{this.state.todayClinicInprogressCount ? this.state.todayClinicInprogressCount : "0" }</p>
        </div>
      </div>
    </div>
    </div>
  </div>
</div> */}
{/* <div class="col-lg-3 col-md-12">
<div class="revenue_overview">
  <h2>My Revenues</h2>
  <div class="container">
    <div class="row">
  
      <div class="col-lg-12 col-md-12 no_padding text-mid">
        <div class="revenue_telemed">
          <h3>Telemedicine</h3>
          <p>₹ {this.state.todayTotalRevenue ? this.state.todayTotalRevenue : "0" }</p>
        </div>
      </div>
      </div>
      </div>
</div>
</div> */}
</div>
    </div>

   <div class="doctor_content_section">
<div class="row">
<div class="col-lg-6 col-md-12">
<div class="telemed_head" >
  <h2 data-toggle="modal" data-target="#telemedModal">Telemedicine   <span onClick={this.viewAllTelemedicineAppointment}>View all</span></h2>
</div>

<div class="telemed_box"> 

{this.state.telemedInprogressAppointmentList? this.state.telemedInprogressAppointmentList : <div class="no_appoint">No Appointment </div>}






  <div class="upcoming_section">
    <h2 data-toggle="modal" data-target="#upcominggModal">Upcoming <span>{ moment().format(" dddd  Do MMMM, YYYY")}</span></h2>
    
  </div>
  {this.state.telemedAppointmentUpcomingList ? this.state.telemedAppointmentUpcomingList : <div class="no_appoint">No Appointment </div> }



{/* <div class="upcoming_box">
  <div class="row">
    <div class="col-lg-9 col-md-9 col-sm-9 col-xs-9">
      <div class="doc_details">
        <img src="img/Profile/doctor.png" />
        <div class="doc_name">
        <h4>Dr.Srikar</h4>
        <p>M, <span>25 years</span></p>
      </div>
     
      </div>
    </div>
    <div class="col-lg-3 col-md-3 col-sm-3 col-xs-3">
      <p class="doc_time">5:00 pm</p>
    </div>
  </div>
  <div class="doc_app_time">
    <div class="row">
      <div class="col-lg-4 col-md-4 no_padding">
        <p class="med_det">Medical Details</p>
      </div>
      <div class="col-lg-8 col-md-8 no_padding">
        <p class="join_now"> Appointment in <span>30 mins </span> </p>
      </div>
    </div>
</div>
</div> */}
{/* <div class="upcoming_box">
  <div class="row">
    <div class="col-lg-9 col-md-9 col-sm-9 col-xs-9">
      <div class="doc_details">
        <img src="img/Profile/doctor.png" />
        <div class="doc_name">
        <h4>Dr.Srikar</h4>
        <p>M, <span>25 years</span></p>
      </div>
     
      </div>
    </div>
    <div class="col-lg-3 col-md-3 col-sm-3 col-xs-3">
      <p class="doc_time">5:00 pm</p>
    </div>
  </div>  
  <div class="doc_app_time">
    <div class="row">
      <div class="col-lg-4 col-md-4 no_padding">
        <p class="med_det">Medical Details</p>
      </div>
      <div class="col-lg-8 col-md-8 no_padding">
        <p class="join_now"> Appointment in <span>30 mins </span> </p>
      </div>
    </div>
</div>
</div> */}
<a href="#">
<div class="view_all" onClick={this.viewAllTelemedicineAppointment}>
  <p>View all</p>
</div>
</a>
</div>

</div>
<div class="col-lg-6 col-md-12">
<div class="clinic_head">
    <h2>Past </h2>
  </div>
<div class="clinic_main">
  <div class="clinic_sec">
    <h2>Past <span>{moment().format(" dddd  Do MMMM, YYYY")}</span></h2>
  </div>
  {this.state.telemedAppointmentPastList ? this.state.telemedAppointmentPastList : <div class='no_appoint'>No Appointments</div>}
  
  </div>
  </div>
{/* <div class="col-lg-6 col-md-12">
  <div class="clinic_head">
    <h2>Clinic <span>View all</span></h2>
  </div>
  <div class="clinic_main">
   
       <div class="wrap-select">
         <div id="dd_clinic" class="wrapper-dropdown-3">
           <span>Select Clinic</span>
           <ul class="dropdown">
             <li><a href="#">
               <img class="drop_hosp_img" src="img/Doctors_List/View Profile/medicine.svg" />
               <div class="drop_hosp_list">
             <p> Vijaya Clinic</p>
             <h4>Madhapur, Hyderabad</h4>
             <h6>Timings : Sun 5pm to 7pm</h6>
            </div>
            </a></li>
            <li><a href="#">
              <img class="drop_hosp_img" src="img/Doctors_List/View Profile/medicine.svg" />
              <div class="drop_hosp_list">
            <p> Vijaya Clinic</p>
            <h4>Madhapur, Hyderabad</h4>
            <h6>Timings : Sun 5pm to 7pm</h6>
           </div>
           </a></li>
           <li><a href="#">
            <img class="drop_hosp_img" src="img/Doctors_List/View Profile/medicine.svg" />
            <div class="drop_hosp_list">
          <p> Vijaya Clinic</p>
          <h4>Madhapur, Hyderabad</h4>
          <h6>Timings : Sun 5pm to 7pm</h6>
         </div>
         </a></li>
         <li><a href="#">
          <img class="drop_hosp_img" src="img/Doctors_List/View Profile/medicine.svg" />
          <div class="drop_hosp_list">
        <p> Vijaya Clinic</p>
        <h4>Madhapur, Hyderabad</h4>
        <h6>Timings : Sun 5pm to 7pm</h6>
       </div>
       </a></li>
                        
           </ul>
        
      </div>
      </div>
  <div class="clinic_section">
    <h2>Upcoming <span>{moment().format(" dddd  Do MMMM, YYYY")}</span></h2>
    
  </div>
  <div class="no_appoint">No Upcoming Clinic Appointment </div>
  
   <div class="clinic_box">
    <div class="row">
      <div class="col-lg-9 col-md-9 col-sm-9 col-xs-9">
        <div class="doc_details">
          <img src="img/Profile/patient.png" />
          <div class="doc_name">
            <h4>Ms. Swathi</h4>
          <p>F, <span>24 years</span></p>
        </div>
       
        </div>
      </div>
      <div class="col-lg-3 col-md-3 col-sm-3 col-xs-3">
        <p class="doc_time">5:00 pm</p>
      </div>
    </div>
   
  </div> 
   <div class="clinic_box">
    <div class="row">
      <div class="col-lg-9 col-md-9 col-sm-9 col-xs-9">
        <div class="doc_details">
          <img src="img/Profile/patient.png" />
          <div class="doc_name">
            <h4>Ms. Swathi</h4>
            <p>F, <span>24 years</span></p>
        </div>
       
        </div>
      </div>
      <div class="col-lg-3 col-md-3 col-sm-3 col-xs-3">
        <p class="doc_time">5:00 pm</p>
      </div>
    </div>
   
  </div>
  <div class="clinic_box">
    <div class="row">
      <div class="col-lg-9 col-md-9 col-sm-9 col-xs-9">
        <div class="doc_details">
          <img src="img/Profile/patient.png" />
          <div class="doc_name">
            <h4>Ms. Swathi</h4>
            <p>F, <span>24 years</span></p>
        </div>
       
        </div>
      </div>
      <div class="col-lg-3 col-md-3 col-sm-3 col-xs-3">
        <p class="doc_time">5:00 pm</p>
      </div>
    </div>
   
  </div>
<div class="clinic_box">
  <div class="row">
    <div class="col-lg-9 col-md-9 col-sm-9 col-xs-9">
      <div class="doc_details">
        <img src="img/Profile/patient.png" />
        <div class="doc_name">
        <h4>Ms. Swathi</h4>
        <p>F, <span>24 years</span></p>
      </div>
     
      </div>
    </div>
    <div class="col-lg-3 col-md-3 col-sm-3 col-xs-3">
      <p class="doc_time">5:00 pm</p>
    </div>
  </div>
 
</div> 

 <a href="#">
<div class="view_all">
  <p>View all</p>
</div>
</a> 
</div>
</div> */}

   </div>


</div>
</div>

</div>
</div>
</div>
</section>

  {/* modal for telemedecine medical details   */}
  <div class="modal fade" id="telemedModal" role="dialog">
    <div class="modal-dialog modal-sm">
  
      <div class="modal-content">
        <div class="modal-header">
          <button type="button" class="close" data-dismiss="modal">&times;</button>
        </div>
        <div class="modal-body">
          <div class="ask_patient_section">
          <img src="../images/doctor-img/Medical information locked/Medical_information.svg" />
             <h5>Medical Information Locked</h5>
            <a href="#"><p>Ask Patient's Consent</p></a>
             <h6>Seek Permission for the detailed Information of the Patient</h6>
          </div>
        </div>
       
      </div>
      
    </div>
  </div>

   {/* modal for upcoming medical details  */}
  <div id="upcominggModal" class="modal collapse-hide" role="dialog">
    <div class="modal-dialog">
  
      
      <div class="modal-content">
        <div class="modal-header">
          <button type="button" class="close" data-dismiss="modal">&times;</button>
          <h4 class="modal-title">Nandini Singh<span>Medical Details</span></h4>
          <p>F, 26years</p>
        </div>
        <div class="modal-body">
          <p class="sch_box">16 june 2020 , 02:30 PM</p>
          <div class="med_details">
            <p>Patient UHID: <span>NR005</span></p>
            {/* <p>Prescription ID : 458HYN</p> */}
          </div>
          <div class="med_details">
            <h2>Apollo clinic</h2>
            <p>Madhapur, Hyderabad, Telangana</p>
          </div>
          <div class="med_details">
            <h2>Vital Information</h2>
            <p>Pulse rate: <span>75BPM</span></p>
            <p>Blood Pressure : 120mmHG- 58mmHG</p>
            <p>Temperature: <span>103F</span></p>
            <p>Respiratory : <span>22 Breaths per minute</span></p>
            <p>Height: <span>6 feet</span></p>
            <p>BMI : <span>32kg/ M2</span></p>
            <p>Weight : <span>75K</span></p>
          </div>
          <div class="med_details">
            <h2>Past Medical History</h2>
            <p>Patient suffered fever 2months back</p>
          </div>
          <div class="med_details">
            <h2>Diagnosis</h2>
            <p>Lorem Dolor sit amet fo tequa</p>
          </div>
          <div class="med_details">
            <h2>Lab Test</h2>
            <p>USG in Lower Abdomen</p>
          </div>
        </div>
      </div>
  
    </div>
  </div>
</I18nPropvider >
<PatientFooter/>
  </main>

        );
    }
}