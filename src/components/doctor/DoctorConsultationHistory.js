import React, { Component, useState } from "react";
import { addDays } from 'date-fns';
import subDays from "date-fns/subDays";
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

import "react-datepicker/dist/react-datepicker.css";
import DatePicker from "react-datepicker";
const moment = require("moment");




export default class Doctorviewslots extends Component {
    constructor(props) {
      super(props);
      this.state = {
        fields: {},
        errors: {},
        files: [],
        appointmentsList:"",
        appointmentsRevenueList:"",
        mypatients:"active",
        myrevenue:"",
  
      
      };
    }
componentDidMount=()=>{
    
    var retrievedObject=localStorage.getItem('DocuserObj');
        if(retrievedObject==null){
            window.location.href="./login";
        }
        let userData=JSON.parse(retrievedObject)
       
        this.state.doctor_id=userData.doctor_id;
        this.state.sdate=moment().add(-1,'days').format('YYYY-MM-DD');
        this.state.edate=moment().format('YYYY-MM-DD');
        let postData={
        "doctorId": userData.doctor_id,
        "fromDate": this.state.sdate,
        "toDate": this.state.edate
        }
        //alert(this.state.date);
       // alert(this.state.doctor_id);
    Httpconfig.httptokenpost(Constant.siteurl + "api/PatientAppointment/consultationHistory/",postData )
    .then((response) => {
        
      if(response.data.status==200 && response.data.error==false){
         // alert(response.data.data);
          this.setState({
              appointmentsList:response.data.data,
          })
          
      }else{
      } 
    })
    .catch((error) => {
      toast.error(error);
    });

}
getUserSelectedDate = (value) => {
    let date = new Date(value);
    let selectedDate = date.getFullYear()+'-'+Number(date.getMonth() + 1)+'-'+date.getDate();
   // alert(date.getDate() + '/' + Number(date.getMonth() + 1) + '/' + date.getFullYear());
    console.log("selectedDate "+selectedDate);
    // this.setState({ start_date: selectedDate });
    // console.clear();
    // console.log(this.state.start_date);
  };
  onDateChange=()=>{
   //   alert("ub");
     let startDate=$('#psdate').val();
       let endDate= $('#pedate').val();
     //   var startDate = moment("2010-10-20").format("YYYY-MM-DD");
      //  var endDate = moment("2010-10-22").format("YYYY-MM-DD");
       // let result=endDate.diff(startDate);
//       //let result=moment(startDate).isSameOrAfter(endDate, 'day');
// alert(result);

let postData={
    "doctorId": this.state.doctor_id,
    "fromDate": startDate,
    "toDate": endDate
    }
    //alert(this.state.date);
   // alert(this.state.doctor_id);
Httpconfig.httptokenpost(Constant.siteurl + "api/PatientAppointment/consultationHistory/",postData )
.then((response) => {
    
  if(response.data.status==200 && response.data.error==false){
   
      const groups = response.data.data.reduce((groups, game) => {
        const date = game.appointment_datetime.split(' ')[0];
        if (!groups[date]) {
          groups[date] = [];
        }
        groups[date].push(game);
        return groups;
      }, {});

      const groupArrays = Object.keys(groups).map((date) => {
        return {
          date,
          games: groups[date]
        };
      });
      let listdata="";
      let revenue="";
      let pcount="";
      let patientsList="";
      let profileImage="";
      let maleImage="../images/patient/img/Profile/Male_patient.svg";
      let femaleImage="../images/patient/img/Profile/Female_patient.svg";
      let patientName="";
      let appointmentStatus="";
      let Status="";
      let canceled=0;
      let patientAge="";
      let appointmentDate="";
      let gender="";
      let completed="";
      let appointments="";
      let totalAppointmentCount=0;
      
      for(let count=0;count<Object.keys(groupArrays).length;count++){
        patientsList=patientsList+'<div class="consult_det_head"><h1>'+moment(groupArrays[count]['date']).format('dddd')+" "+moment(groupArrays[count]['date']).format('Do MMM YYYY')+'</h1></div><div class="consult_hist_box"><div class="row">';

        for(let lcount=0;lcount<Object.keys(groupArrays[count]['games']).length;lcount++){
            totalAppointmentCount++;
        pcount=Object.keys(groupArrays[count]['games']).length;
        
        if(groupArrays[count]['games'][lcount]['patient_tbl']['profile_pic']==null){
            if(groupArrays[count]['games'][lcount]['patient_tbl']['gender'].toLowerCase()=='male'){
                profileImage= maleImage;
            }
            if(groupArrays[count]['games'][lcount]['patient_tbl']['gender'].toLowerCase()=='female'){
                profileImage= femaleImage;
                }
        }else{
            profileImage=Constant.imgurl+groupArrays[count]['games'][lcount]['patient_tbl']['profile_pic'];
        }
            patientName=groupArrays[count]['games'][lcount]['patient_tbl']['name'];
            gender=groupArrays[count]['games'][lcount]['patient_tbl']['gender'];
            appointmentDate=moment(groupArrays[count]['games'][lcount]['appointment_datetime']).format("h:mm A");
            appointmentStatus=groupArrays[count]['games'][lcount]['status'];
            if(appointmentStatus=='1')
            {
                Status="Booked";
            }
            if(appointmentStatus=='2')
            {
                Status="Upcoming";
            }
            if(appointmentStatus=='3')
            {
                Status="completed";
                completed=completed+1;
            }
            if(appointmentStatus=='4')
            {
                Status="cancelled";
                canceled=canceled+1;
            }
            if(appointmentStatus=='5')
            {
                Status="drafred";
            }
          if(groupArrays[count]['games'][lcount]['patient_tbl']['dob']!=null){
              let dob=groupArrays[count]['games'][lcount]['patient_tbl']['dob'].split("T");
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
          }
          patientsList= patientsList+'<div class="col-lg-4 col-md-12"> <div class="consult_btm"><div class="row"><div class="col-lg-8 col-md-8"> <div class="consult_section">  <img src="'+profileImage+'"/>  <div class="user_det"><h4>'+patientName+'</h4><p>'+gender+'|<span>'+patientAge+'</span></p></div></div></div> <div class="col-lg-4 col-md-4"><p class="det_time">'+appointmentDate+'</p><h5 class="det_complete">'+Status+'</h5></div></div>  </div>  </div>';
      }
   
     
      patientsList=patientsList+"</div></div>";
    }

$('.consult_hist_details').html(patientsList);
$('.total_complete >h2').html(totalAppointmentCount);
$('.total_cancel >h2').html(canceled);
    
  } 
})
.catch((error) => {
  toast.error(error);
});

  }

  onDateChangeRevenue=()=>{
    //alert("ub");
   let startDate=$('#date1').val();
     let endDate= $('#date2').val();
    // alert(startDate);
    // alert(endDate);
   //   var startDate = moment("2010-10-20").format("YYYY-MM-DD");
    //  var endDate = moment("2010-10-22").format("YYYY-MM-DD");
     // let result=endDate.diff(startDate);
//       //let result=moment(startDate).isSameOrAfter(endDate, 'day');
// alert(result);

let postData={
  "doctorId": this.state.doctor_id,
  "fromDate": startDate,
  "toDate": endDate
  }
  //alert(this.state.date);
 // alert(this.state.doctor_id);
Httpconfig.httptokenpost(Constant.siteurl + "api/PatientAppointment/DoctorAppointmenthistorycount/",postData )
.then((response) => {
  
if(response.data.status==200 && response.data.error==false){
  // alert(response.data.data);
   //response.data.data


   const groups = response.data.data.data.reduce((groups, game) => {
    const date = game.appointment_datetime.split(' ')[0];
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(game);
    return groups;
  }, {});
  
  // Edit: to add it in the array format instead
  const groupArrays = Object.keys(groups).map((date) => {
    return {
      date,
      games: groups[date]
    };
  });
  let listdata="";
  let revenue="";
  let pcount="";
 
  for(let count=0;count<Object.keys(groupArrays).length;count++){
    for(let lcount=0;lcount<Object.keys(groupArrays[count]['games']).length;lcount++){
    revenue=Object.keys(groupArrays[count]['games']).length* (groupArrays[count]['games'][lcount]['consultation_fee']);
    pcount=Object.keys(groupArrays[count]['games']).length;
  }
  listdata=listdata+' <div class="col-5th"> <div class="revenue_details"><h2>'+ moment(groupArrays[count]['date']).format('dddd')+" "+moment(groupArrays[count]['date']).format('Do MMM YYYY')+'</h2><h5>'+pcount+' Patient X ₹ '+groupArrays[0]['games'][0]['consultation_fee']+'</h5><p>₹ '+revenue+'</p></div></div>';
  }
  
  this.setState({
      revenueLit:listdata
  })
    $('.bind').html(listdata);
    $('.revenue >h2').html(response.data.data['Total_ConsultationAmount']);
} 
})
.catch((error) => {
toast.error(error);
}); 

}
updateClass=(id)=>{
    
    if(id=='patient'){
        this.state.mypatients="active";
        this.state.myrevenue="";
    }
    if(id=='myrevenue'){
        this.state.myrevenue="active";
        this.state.mypatients="";
         
    }
    this.forceUpdate();

}
    render() {
      let list=[];
      let Status="";
      let patientAge="";
      let completed=0;
      let canceled=0;
      let imageUrl="";
      let maleImage="../images/patient/img/Profile/Male_patient.svg";
      let femaleImage="../images/patient/img/Profile/Female_patient.svg";
      const appointments=this.state.appointmentsList;
      const appointmentsRevenueList=this.state.appointmentsRevenueList;
      let appointmentsCount=appointments.length;
      let appointmentsRevenueCount=appointmentsRevenueList.length;
      if(appointmentsCount>0){
          for(let count=0;count<appointmentsCount;count++){
              
              if(appointments[count]['status']=='1')
              {
                  Status="Booked";
              }
              if(appointments[count]['status']=='2')
              {
                  Status="Upcoming";
              }
              if(appointments[count]['status']=='3')
              {
                  Status="Completed";
                  completed=completed+1;
              }
              if(appointments[count]['status']=='4')
              {
                  Status="Cancelled";
                  canceled=canceled+1;
              }
              if(appointments[count]['status']=='5')
              {
                  Status="Drafred";
              }
            if(appointments[count]['patient_tbl']['dob']!=null){
                let dob=appointments[count]['patient_tbl']['dob'].split("T");
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
            }
            if(appointments[count]['patient_tbl']['profile_pic']==null){
               // alert(appointments[count]['patient_tbl']['gender']);
                if(appointments[count]['patient_tbl']['gender'].toLowerCase()=='male'){
                    //alert(maleImage);
                    imageUrl=maleImage;
                }
                if(appointments[count]['patient_tbl']['gender'].toLowerCase()=='female'){
                    imageUrl=femaleImage;
                }
                
            }else{
                imageUrl=Constant.imgurl+appointments[count]['patient_tbl']['profile_pic'];
                //alert(imageUrl);
            }
            list.push(
                <div class="col-lg-4 col-md-12">
                        <div class="consult_btm">
                        <div class="row">
                            <div class="col-lg-8 col-md-8">
                                 <div class="consult_section">
                                    <img src={imageUrl}/>
                                    <div class="user_det">
                                        <h4>{appointments[count]['patient_tbl']['name'].charAt(0).toUpperCase() + appointments[count]['patient_tbl']['name'].slice(1)}</h4>
                                        <p>{appointments[count]['patient_tbl']['gender']}|<span>{patientAge}</span></p>
                                    </div>
                                </div> 
                            </div>
                           
                            <div class="col-lg-4 col-md-4">
                           <p class="det_time">{moment(appointments[count]['appointment_datetime']).format("h:mm A")}</p>
                              {Status.toLowerCase()=='cancelled' ? 
                              <h5 class="det_cancel">{Status}</h5>:
                              <h5 class="det_complete">{Status}</h5>}
                            </div>
                        </div>
                    </div>
                    </div>
            )


          }

      }
      if(appointmentsRevenueCount>0){
          
      }
        return (
            <main id="main">
            <DoctorHeader onSelectLanguage={this.handleLanguage}/>

        <I18nPropvider locale={this.state.Language}>
        <section id="doctor_dashboard">
  <div class="container-fluid">
    <div class="row">
        <DoctorSideMenu onSelectLanguage={this.handleLanguage}/>
        <div class="col-lg-10 col-md-9">
 <section id="consultation_history">
   
<div class="consult_head">
    <h1>Consultation History</h1>
</div>
<div class="consultation_bar">
    <div class="row">
   
<div class="col-lg-12">
    <div class="panel with-nav-tabs panel-default">
        <div class="panel-heading">
                <ul class="nav nav-tabs">
                    <li  class={this.state.mypatients}><a onClick={this.updateClass.bind(this,'patient')} href="#mypatients" data-toggle="tab">PATIENTS</a></li>
                   
                    <li class={this.state.myrevenue}><a  href="#myrevenue" data-toggle="tab" onClick={this.updateClass.bind(this,'myrevenue')}>MY REVENUE</a></li>
                </ul>
        </div>
        
    </div>
</div>
     
</div>
</div>

<div class="tab-content">
    <div class="tab-pane active" id="mypatients">
        <div class="consult_main_box">
            <div class="row">
                <div class="col-lg-6">
               <div class="consult_date_range">
                   <h5>Choose a from date/to date range to see the appointments</h5>
                   <div class="row consult_mid">
                       <div class="col-lg-4">
                        <form>
                        <input type="date" id="psdate" name="psdate" data-ng-model="date"  min="2018-01-01"
                         max={moment().format("DD-MM-YYYY")} onChange={this.onDateChange}/>
                         
                          </form>
                          
                       </div>
                       <div class="col-lg-1">
                           <div class="arrow_img">
                            <img src="../images/doctor-img/Consultation history/to.svg" />
                           </div>
                       </div>
                       <div class="col-lg-4">
                        <form>
                        <input type="date"  id="pedate" name="pedate" data-ng-model="date"  onChange={this.onDateChange}/>
                        
                          </form> 
                    </div>
                   </div>
               
               </div>
                </div>
              
                <div class="col-lg-6 complete_mid">
                    <div class="total_complete">
                        <h2>{completed}</h2>
                        <p>Total Complete <br/>appointment</p>
                    </div>
                    <div class="total_cancel">
                      <h2>{canceled}</h2>
                      <p>Total Cancelled <br/>appointment</p>
                  </div>
                  </div>
            </div>
        </div>
        <div class="consult_hist_details">
            <div class="consult_det_head">
        <h1>{moment().format('MMMM Do YYYY, h:mm:ss a')}</h1>
            </div>
            <div class="consult_hist_box">
                <div class="row">
                {list}
                </div>
                </div>
                </div>
            </div>
            
          
    <div class="tab-pane" id="myrevenue">
        <div class="consult_main_box">
            <div class="row">
                <div class="col-lg-6">
               <div class="consult_date_range">
                   <h5>Choose a from date/to date range to see the appointments</h5>
                   <div class="row consult_mid">
                       <div class="col-lg-4">
                        <form>
                            <input type="date" id="date1" name="date1" onChange={this.onDateChangeRevenue}/>
                          </form>
                       </div>
                       <div class="col-lg-1">
                           <div class="arrow_img">
                           <img src="../images/doctor-img/Consultation history/to.svg" />
                           </div>
                       </div>
                       <div class="col-lg-4">
                        <form>
                            <input type="date" id="date2" name="date2" onChange={this.onDateChangeRevenue} />
                          </form> 
                    </div>
                   </div>
               
               </div>
                </div>
              
                <div class="col-lg-6 complete_mid">
                    <div class="total_complete revenue">
                        <h2>0</h2>
                        <p>Total <br/>Revenues</p>
                    </div>
                   
                  </div>
            </div>
        </div>
      <div class="revenue_section">
          <div class="row bind ">
          </div>
      </div>
    </div>
</div>
 </section>
</div>
</div>
</div>
</section>
</I18nPropvider >

  </main>

        );
    }
}