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
import { reactLocalStorage } from "reactjs-localstorage";
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
  
      
      };
    }
componentDidMount=()=>{
    
    var retrievedObject=localStorage.getItem('DocuserObj');
        if(retrievedObject==null){
            window.location.href="./login";
        }
        let userData=JSON.parse(retrievedObject)
        
        this.setState({
            doctor_id: userData.doctor_id,
            date:moment().format('Do MMMM , YYYY')
        })
    Httpconfig.httptokenget(Constant.siteurl + "api/telemedicine/getCalendarDates/"+userData.doctor_id, )
    .then((response) => {
        
       
       const specificdates= response.data.data.map((dates) => 
        new Date(dates.calendardate)
        //subDays(moment(dates.calendardate).format())//.format('MMMM Do YYYY, h:mm:ss a')
        
       );
       console.log("rakesh:"+specificdates);//return false;
       this.setState({
           sdate:specificdates
       })
        
        console.log("error"+this.state.sdate);

      if(response.data.status=="200" && response.data.error==false){
          
          
          // toast.warn("Hi Doctor, you status as changed to Unavailable", {
          //     position: "bottom-center",
          //   });
      // toast.success(response.data.message, {
      //     position: "top-center",
      //   });
      }else{
          // toast.warn("Sorry we cannot update the Availibility status at this moment", {
          //     position: "bottom-center",
          //   });
      } 
    })
    .catch((error) => {
      toast.error(error);
    });

}
getUserSelectedDate = (value) => {
    let date = new Date(value);
    let selectedDate = date.getFullYear()+'-'+Number(date.getMonth() + 1)+'-'+date.getDate();
    //alert(date.getDate() + '/' + Number(date.getMonth() + 1) + '/' + date.getFullYear());
    //console.log("selectedDate "+selectedDate);
    this.fetchUserSelectedSlots(selectedDate);
    this.state.selectedDate=selectedDate;
    // this.setState({ start_date: selectedDate });
    // console.clear();
    // console.log(this.state.start_date);
  };
  fetchUserSelectedSlots(selectedDate) {
      
     let doctorId=this.state.doctor_id;
     Httpconfig.httptokenpost(
      Constant.siteurl + "api/telemedicine/patientAppointmentSlots",
      {
        doctor_id: doctorId,
        consultation_date: selectedDate,
        module_type: "telemedicine-app",
      }
    ).then((response) => {
      // alert(response);
      // let objLen=Object.keys(response.data.status).length;
      // alert(objLen);
      if (response.status == 200) {
       // console.clear();
       // console.log(response);
        let resultCount=Object.keys( response.data.result).length;
         // return false;
          if(resultCount>0){
        const morningSlots = response.data.result[0];
        const afternoonSlots = response.data.result[1];
        const eveningSlots = response.data.result[2];
        const nightSlots = response.data.result[3];

        this.setState({
          morningSlotsLabel: morningSlots.Label,
          morningSlots: morningSlots.time_slots,
          afternoonLabel: afternoonSlots.Label,
          afternoonSlots: afternoonSlots.time_slots,
          eveningSlotsLabel: eveningSlots.Label,
          eveningSlots: eveningSlots.time_slots,
          nightSlotsLabel: nightSlots.Label,
          nightSlots: nightSlots.time_slots,
        });
        this.forceUpdate();
        var i=0;
        var time=document.getElementsByClassName("timings");
         for (i = 0; i < time.length; i++) {
          time[i].addEventListener("click", function(event) {
          var selelcedT=this.innerHTML;
         // alert(selelcedT);
         // this.state.selectedtime=selelcedT;=
         let sTime=moment(selelcedT,["h:mm A"]).format('HH:mm:ss');
        // alert(sTime);
         let seldate=selectedDate+sTime;
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
          this.setState({
            morningSlotsLabel: "",
            morningSlots: "",
            afternoonLabel: "",
            afternoonSlots: "",
            eveningSlotsLabel: "",
            eveningSlots: "",
            nightSlotsLabel: "",
            nightSlots: "",
          });
        }
      }
    });
  } 
    render() {
        var currentDate = new Date();
        var numberOfDaysToAdd = 45; 
        var slotsAvailable=0;
        const daysHighlighted = new Array(numberOfDaysToAdd).fill(currentDate);
      
        const highlightWithRanges = [
            {
              "react-datepicker__day--highlighted": [
             subDays(new Date('2020-10-15'),0),
             subDays(new Date('2020-10-20'),0),
             subDays(new Date('2020-10-25'),0),
               
              ]
            },
            
          ];

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
      if(nightLength>0){
      mrng += '<div class="schedule_content">';
      for (var i = 0; i < nightLength; i++) {
        if(i==0){
          mrng += '<h2>Morning</h2>';
        }
        mrng += "<p class='timings'>" + morningArr[i] + "</p>";
      }
      mrng += "</div>";
    }
      slotsMorningArray=mrng;
      //slotsMorningArray.push(mrng);
      
    }else{
      morningArr="";
      slotsAvailable=slotsAvailable+1;
    }

    if (afternoonArr) {
      var noonLength = afternoonArr.length;
      var noon = "";
      if(noonLength>0){
      noon += '<div class="schedule_content">';
      for (var i = 0; i < noonLength; i++) {
        if(i==0){
          noon += '<h2>After noon</h2>';
        }
        noon += "<p class='timings'>" + afternoonArr[i] + "</p>";
      }
      noon += "</div>";
    }
      slotsNoonArray=noon;
      //slotsNoonArray.push(noon);
    }else{
      afternoonArr="";
      slotsAvailable=slotsAvailable+1;
    }

    if (eveningArr) {
      var evngLength = eveningArr.length;
      var evng = "";
      if(evngLength>0){
      evng += '<div class="schedule_content">';
      for (var i = 0; i < evngLength; i++) {
        if(i==0){
          evng += '<h2>Evening</h2>';
        }
        evng += "<p class='timings'>" +eveningArr[i] + "</p>";
      }
      evng += "</div>";
    }
      slotsEveningArray=evng;
     // slotsEveningArray.push(evng);
    }else{
      eveningArr="";
      slotsAvailable=slotsAvailable+1;
    }

    if (nightArr) {
      var nightLength = nightArr.length;
      var night = "";
      if(nightLength>0){
      night += '<div class="schedule_content">';
      for (var i = 0; i < nightLength; i++) {
        if(i==0){
          night += '<h2>Night</h2>';
        }
        night += "<p class='timings'>" + nightArr[i] + "</p>";
      }
      night += "</div>";
    }
      slotsNightArray=night;
      //slotsNightArray.push(night);
    }else{
      nightArr="";
      slotsAvailable=slotsAvailable+1;
    }
        //  console.log(highlightWithRanges);
        return (
            <main id="main">
            <DoctorHeader onSelectLanguage={this.handleLanguage}/>

        <I18nPropvider locale={this.state.Language}>
        <section id="doctor_dashboard">
  <div class="container-fluid">
  
    <div class="row">
     <DoctorSideMenu onSelectLanguage={this.handleLanguage}/> 
        <div class="col-lg-9 col-md-8">
        <div class="overview_left">
        <section id="create_slot">
     <div class="container no_padding">
     <div class="row">
        <div class="col-md-12">
          <div class="avail_head">
         <h2>Available Time Slot</h2>
        </div>
      </div>
        </div>
         <div class="row">
             <div class="col-lg-8 col-md-12">
             
    <div class="create_slot_cal">
   
   
         <DatePicker name="start_date" autoComplete="off" 
        className="dateInput" placeholderText="Start Date" 
        selected={this.state.start_date} 
        onChange={this.getUserSelectedDate} 
        dateFormat="d-MM-yyyy" 
        highlightDates={highlightWithRanges}
        
        inline
        calendarIcon 
        minDate={new Date()}
        maxDate={moment().add(5, "days")}
        />
    </div>
             </div>
             
             <div class="col-lg-4 col-md-12">
              <div class="diff_cal_img">
               <img src="../images/doctor-img/View slot/slot.svg" />
             </div> 
               
            </div>
         
         </div>
     </div>
 </section>
 <section id="slot_schedule">
<div class="container no_padding">
  <div class="row">
    <div class="col-md-12">
    <div class="schedule_box">
      <div class="schedule_head">
        <h2>{moment(this.state.selectedDate).format("Do ,MMM YYYY")}</h2>
        <p id="slotsData">{slotsAvailable>0 ? "No slots found" :""}</p>
      </div>
    
      <div class="row">
      
      {slotsMorningArray ?
      <div class="col-md-3" dangerouslySetInnerHTML={{ __html: slotsMorningArray }} /> :""}
      {slotsNoonArray ?
      <div class="col-md-3" dangerouslySetInnerHTML={{ __html: slotsNoonArray }} /> :""}
      {slotsEveningArray ?
      <div class="col-md-3" dangerouslySetInnerHTML={{ __html: slotsEveningArray }} /> :""}
      {slotsNightArray ?
      <div class="col-md-3" dangerouslySetInnerHTML={{ __html: slotsNightArray }} /> :""}
      
       
      </div>
     
      </div>
    </div>
  </div>
</div>
 </section>
 </div>
 </div>

 <section id="slot_bottom_modal">
<div class="modal bottom fade slot_modals" id="slotModasl" role="dialogs">
    <div class="modal-dialog modal-lgs">
    
      {/* <!-- Modal content--> */}
      <div class="modal-contentdd">
        <div class="modal-headerddd">
          <button type="button" class="close" data-dismiss="modal">&times;</button>
          <h4 class="modal-title">Sat, 1 July</h4>
        </div>
        <div class="modal-body">
       <div class="row">
       <div class="col-lg-6 col-md-6">
           <div class="time_slot">
               <h3>Afternoon time slot</h3>
           </div>
           <div class="row">
            <div class="col-lg-4 col-md-12">
             <div class="slot_check">
               <p>2 30 PM <input class="input_check" type="checkbox" /></p>
               
             </div>
            </div>
            <div class="col-lg-4 col-md-12">
             <div class="slot_check">
               <p>2 30 PM <input class="input_check" type="checkbox" /></p>
               
             </div>
            </div>
            <div class="col-lg-4 col-md-12">
             <div class="slot_check">
               <p>2 30 PM <input class="input_check" type="checkbox" /></p>
               
             </div>
            </div>
        </div>
        <div class="row">
            <div class="col-lg-4 col-md-12">
             <div class="slot_check">
               <p>2 30 PM <input class="input_check" type="checkbox" /></p>
               
             </div>
            </div>
            <div class="col-lg-4 col-md-12">
             <div class="slot_check">
               <p>2 30 PM <input class="input_check" type="checkbox" /></p>
               
             </div>
            </div>
            <div class="col-lg-4 col-md-12">
             <div class="slot_check">
               <p>2 30 PM <input class="input_check" type="checkbox" /></p>
               
             </div>
            </div>
        </div>
        <div class="row">
            <div class="col-lg-4 col-md-12">
             <div class="slot_check">
               <p>2 30 PM <input class="input_check" type="checkbox" /></p>
               
             </div>
            </div>
            <div class="col-lg-4 col-md-12">
             <div class="slot_check">
               <p>2 30 PM <input class="input_check" type="checkbox" /></p>
               
             </div>
            </div>
            <div class="col-lg-4 col-md-12">
             <div class="slot_check">
               <p>2 30 PM <input class="input_check" type="checkbox" /></p>
               
             </div>
            </div>
        </div>
        <div class="row">
            <div class="col-lg-4 col-md-12">
             <div class="slot_check">
               <p>2 30 PM <input class="input_check" type="checkbox" /></p>
               
             </div>
            </div>
            <div class="col-lg-4 col-md-12">
             <div class="slot_check">
               <p>2 30 PM <input class="input_check" type="checkbox" /></p>
               
             </div>
            </div>
            <div class="col-lg-4 col-md-12">
             <div class="slot_check">
               <p>2 30 PM <input class="input_check" type="checkbox" /></p>
               
             </div>
            </div>
        </div>
       </div>
       <div class="col-lg-6 col-md-6">
        <div class="time_slot">
            <h3>Night time slot</h3>
        </div>
        <div class="row">
            <div class="col-lg-4 col-md-12">
             <div class="slot_check">
               <p>2 30 PM <input class="input_check" type="checkbox" /></p>
               
             </div>
            </div>
            <div class="col-lg-4 col-md-12">
             <div class="slot_check">
               <p>2 30 PM <input class="input_check" type="checkbox" /></p>
               
             </div>
            </div>
            <div class="col-lg-4 col-md-12">
             <div class="slot_check">
               <p>2 30 PM <input class="input_check" type="checkbox" /></p>
               
             </div>
            </div>
        </div>
        <div class="row">
            <div class="col-lg-4 col-md-12">
             <div class="slot_check">
               <p>2 30 PM <input class="input_check" type="checkbox" /></p>
               
             </div>
            </div>
            <div class="col-lg-4 col-md-12">
             <div class="slot_check">
               <p>2 30 PM <input class="input_check" type="checkbox" /></p>
               
             </div>
            </div>
            <div class="col-lg-4 col-md-12">
             <div class="slot_check">
               <p>2 30 PM <input class="input_check" type="checkbox" /></p>
               
             </div>
            </div>
        </div>
     <div class="row">
        <div class="col-lg-4 col-md-12">
         <div class="slot_check">
           <p>2 30 PM <input class="input_check" type="checkbox" /></p>
           
         </div>
        </div>
        <div class="col-lg-4 col-md-12">
         <div class="slot_check">
           <p>2 30 PM <input class="input_check" type="checkbox" /></p>
           
         </div>
        </div>
        <div class="col-lg-4 col-md-12">
         <div class="slot_check">
           <p>2 30 PM <input class="input_check" type="checkbox" /></p>
           
         </div>
        </div>
    </div>
    <div class="row">
        <div class="col-lg-4 col-md-12">
         <div class="slot_check">
           <p>2 30 PM <input class="input_check" type="checkbox" /></p>
           
         </div>
        </div>
        <div class="col-lg-4 col-md-12">
         <div class="slot_check">
           <p>2 30 PM <input class="input_check" type="checkbox" /></p>
           
         </div>
        </div>
        <div class="col-lg-4 col-md-12">
         <div class="slot_check">
           <p>2 30 PM <input class="input_check" type="checkbox" /></p>
           
         </div>
        </div>
    </div>
    </div>
       </div>
        </div>
       
      </div>
      
    </div>
  </div>
</section>
{/* modal for Slot */}
<section id="slot_bottom_modal">
<div class="modal bottom fade slot_modal" id="slotModal" role="dialog">
    <div class="modal-dialog modal-lg">
    
      {/* <!-- Modal content--> */}
      <div class="modal-content">
        <div class="modal-header">
          <button type="button" class="close" data-dismiss="modal">&times;</button>
          <h4 class="modal-title">Sat, 1 July</h4>
        </div>
        <div class="modal-body">
       <div class="row">
       <div class="col-lg-6 col-md-6">
           <div class="time_slot">
               <h3>Afternoon time slot</h3>
           </div>
           <div class="row">
            <div class="col-lg-4 col-md-12">
             <div class="slot_check">
               <p>2 30 PM <input class="input_check" type="checkbox" /></p>
               
             </div>
            </div>
            <div class="col-lg-4 col-md-12">
             <div class="slot_check">
               <p>2 30 PM <input class="input_check" type="checkbox" /></p>
               
             </div>
            </div>
            <div class="col-lg-4 col-md-12">
             <div class="slot_check">
               <p>2 30 PM <input class="input_check" type="checkbox" /></p>
               
             </div>
            </div>
        </div>
        <div class="row">
            <div class="col-lg-4 col-md-12">
             <div class="slot_check">
               <p>2 30 PM <input class="input_check" type="checkbox" /></p>
               
             </div>
            </div>
            <div class="col-lg-4 col-md-12">
             <div class="slot_check">
               <p>2 30 PM <input class="input_check" type="checkbox" /></p>
               
             </div>
            </div>
            <div class="col-lg-4 col-md-12">
             <div class="slot_check">
               <p>2 30 PM <input class="input_check" type="checkbox" /></p>
               
             </div>
            </div>
        </div>
        <div class="row">
            <div class="col-lg-4 col-md-12">
             <div class="slot_check">
               <p>2 30 PM <input class="input_check" type="checkbox" /></p>
               
             </div>
            </div>
            <div class="col-lg-4 col-md-12">
             <div class="slot_check">
               <p>2 30 PM <input class="input_check" type="checkbox" /></p>
               
             </div>
            </div>
            <div class="col-lg-4 col-md-12">
             <div class="slot_check">
               <p>2 30 PM <input class="input_check" type="checkbox" /></p>
               
             </div>
            </div>
        </div>
        <div class="row">
            <div class="col-lg-4 col-md-12">
             <div class="slot_check">
               <p>2 30 PM <input class="input_check" type="checkbox" /></p>
               
             </div>
            </div>
            <div class="col-lg-4 col-md-12">
             <div class="slot_check">
               <p>2 30 PM <input class="input_check" type="checkbox" /></p>
               
             </div>
            </div>
            <div class="col-lg-4 col-md-12">
             <div class="slot_check">
               <p>2 30 PM <input class="input_check" type="checkbox" /></p>
               
             </div>
            </div>
        </div>
       </div>
       <div class="col-lg-6 col-md-6">
        <div class="time_slot">
            <h3>Night time slot</h3>
        </div>
        <div class="row">
            <div class="col-lg-4 col-md-12">
             <div class="slot_check">
               <p>2 30 PM <input class="input_check" type="checkbox" /></p>
               
             </div>
            </div>
            <div class="col-lg-4 col-md-12">
             <div class="slot_check">
               <p>2 30 PM <input class="input_check" type="checkbox" /></p>
               
             </div>
            </div>
            <div class="col-lg-4 col-md-12">
             <div class="slot_check">
               <p>2 30 PM <input class="input_check" type="checkbox" /></p>
               
             </div>
            </div>
        </div>
        <div class="row">
            <div class="col-lg-4 col-md-12">
             <div class="slot_check">
               <p>2 30 PM <input class="input_check" type="checkbox" /></p>
               
             </div>
            </div>
            <div class="col-lg-4 col-md-12">
             <div class="slot_check">
               <p>2 30 PM <input class="input_check" type="checkbox" /></p>
               
             </div>
            </div>
            <div class="col-lg-4 col-md-12">
             <div class="slot_check">
               <p>2 30 PM <input class="input_check" type="checkbox" /></p>
               
             </div>
            </div>
        </div>
     <div class="row">
        <div class="col-lg-4 col-md-12">
         <div class="slot_check">
           <p>2 30 PM <input class="input_check" type="checkbox" /></p>
           
         </div>
        </div>
        <div class="col-lg-4 col-md-12">
         <div class="slot_check">
           <p>2 30 PM <input class="input_check" type="checkbox" /></p>
           
         </div>
        </div>
        <div class="col-lg-4 col-md-12">
         <div class="slot_check">
           <p>2 30 PM <input class="input_check" type="checkbox" /></p>
           
         </div>
        </div>
    </div>
    <div class="row">
        <div class="col-lg-4 col-md-12">
         <div class="slot_check">
           <p>2 30 PM <input class="input_check" type="checkbox" /></p>
           
         </div>
        </div>
        <div class="col-lg-4 col-md-12">
         <div class="slot_check">
           <p>2 30 PM <input class="input_check" type="checkbox" /></p>
           
         </div>
        </div>
        <div class="col-lg-4 col-md-12">
         <div class="slot_check">
           <p>2 30 PM <input class="input_check" type="checkbox" /></p>
           
         </div>
        </div>
    </div>
    </div>
       </div>
        </div>
       
      </div>
      
    </div>
  </div>
</section>
</div>
</div>
</section>
</I18nPropvider >
<PatientFooter/>
  </main>

        );
    }
}