import React from "react";
import ReactDOM from 'react-dom';
import Constant from "./constants";
import Httpconfig from "./helpers/Httpconfig";
import $ from "jquery";

const VideoConference = (meetingid) => {
   // alert(meetingid);
  console.log("swetha"+Object.values(meetingid));

  //alert(meetingid);
  const meetingId=Object.values(meetingid);
  //alert(meetingId);
  
  const jitsiContainerId = "jitsi-container-id";
  const [jitsi, setJitsi] = React.useState({});

  const loadJitsiScript = () => {
    let resolveLoadJitsiScriptPromise = null;

    const loadJitsiScriptPromise = new Promise(resolve => {
      resolveLoadJitsiScriptPromise = resolve;
    });

    const script = document.createElement("script");
    script.src = "https://meet.jit.si/external_api.js";
    script.async = true;
    script.onload = () => resolveLoadJitsiScriptPromise(true);
    document.body.appendChild(script);

    return loadJitsiScriptPromise;
  };

  const sendNotifications =()=>{
    const data="";
    const other_params = {
      headers : { "content-type" : "application/json; charset=UTF-8" },
      body : data,
      method : "POST",
      mode : "cors"
  };
  
    fetch('https://jsonplaceholder.typicode.com/todos/1',other_params)
    .then(response => response.json())
    .then(json => console.log(json))
  

  };
  const sendNotificationsDoctorJoined=(meetingId,PatientId)=>{
    const data={
        "user_id":JSON.parse(PatientId),
        "type":"Call Started","title":"Telemedicine patient appointment confirmation",
        "message":"Doctor is Joined to the call waiting for you to join.",
        "appointment_id":JSON.parse(meetingId),
        "appointment_status":"2"
    };
    //alert(data);
    const other_params = {
      headers : { "content-type" : "application/json; charset=UTF-8" },
      body : data,
      method : "PUT",
      mode : "cors"
  };

  Httpconfig.httptokenput(Constant.siteurl + "api/PatientAppointment/callStartedNotificationStatus" ,{
    "user_id":JSON.parse(PatientId),
    "type":"Call Started","title":"Telemedicine patient appointment confirmation",
    "message":"Doctor is Joined to the call waiting for you to join.",
    "appointment_id":JSON.parse(meetingId),
    "appointment_status":JSON.parse(2),
}).then(
    (response) => {
      //console.log(response.data.data); 
    //alert(response);
    }
  );
//   var settings = {
//     "url": "http://3.7.234.106:8080/api/PatientAppointment/callStartedNotificationStatus",
//     "method": "PUT",
//     "timeout": 0,
//     "headers": {
//       "Content-Type": "application/json"
//     },
//     "data": JSON.stringify({"user_id":51,"type":"Call Started","title":"Telemedicine patient appointment confirmation","message":"Doctor is Joined to the call waiting for you to join.","appointment_id":47354,"appointment_status":2}),
//   };
  
//   $.ajax(settings).done(function (response) {
//     console.log(response);
//   });
  //alert(other_params);
  
//   $.ajax({
//     url: Constant.siteurl+'api/PatientAppointment/callStartedNotificationStatus',
//     type: 'PUT',
//     data: data,
//    // contentType: 'application/json',
//     mode : "cors",
//     success: function(data) {
//         alert(data);
//       alert('Load was performed.');
//     }
//   });
//   $.ajax({
//     type: 'PUT',
//     url: Constant.siteurl+'api/PatientAppointment/callStartedNotificationStatus',
//     contentType: 'application/json',
//     data: data, // access in body
//     mode : "cors",
// }).done(function (msg) {
//     alert(msg);
//     console.log('SUCCESS');
// }).fail(function (msg) {
//     console.log('FAIL');
// }).always(function (msg) {
//     console.log('ALWAYS');
// });


//     fetch(Constant.siteurl+'api/PatientAppointment/callStartedNotificationStatus',{
//         headers : { "content-type" : "application/json; charset=UTF-8" },
//         body : {
//             "user_id":JSON.parse(PatientId),
//             "type":"Call Started","title":"Telemedicine patient appointment confirmation",
//             "message":"Doctor is Joined to the call waiting for you to join.",
//             "appointment_id":JSON.parse(meetingId),
//             "appointment_status":"2",
//         },
//         method : "PUT",
//         mode : "cors",
//     })
//     .then(response => response.json())
//     .then(json => console.log(json))

  }

  const sendNotificationsDoctorEnded=(meetingId,PatientId)=>{
    const data={
        "user_id":JSON.parse(PatientId),
        "type":"Call Started","title":"Telemedicine patient appointment ended",
        "message":"Doctor ended the Video Consulation.",
        "appointment_id":JSON.parse(meetingId),
        "appointment_status":"2"
    };
    const other_params = {
      headers : { "content-type" : "application/json; charset=UTF-8" },
      body : data,
      method : "PUT",
      mode : "cors"
  };
  
    fetch(Constant.siteurl+'api/PatientAppointment/callEndNotificationStatus',other_params)
    .then(response => response.json())
    .then(json => console.log(json))

  }

  const initialiseJitsi = async () => {
    if (!window.JitsiMeetExternalAPI) {
      await loadJitsiScript();
    }
    //alert(meetingId);
    const options = {
    //roomName: 'Ravikiran',
    roomName:meetingId,
  //  roomName: Object.values(meetinid),
      width: "100%",
      height: 600,
      jwt:'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjb250ZXh0Ijp7InVzZXIiOnt9fSwiYXVkIjoiaml0c2ltZWV0LnR1dG9yb290LmNvbSIsImlzcyI6Ik1lZERvY01hc3RlckFwcElEIiwic3ViIjoiaml0c2ltZWV0LnR1dG9yb290LmNvbSIsInJvb20iOiIqIn0.zKkYnDh99CdxVcVIZqYpvnLgGFiQj_r38HI4WQyK7Po',
      parentNode:  document.getElementById(jitsiContainerId),
     
      configOverwrite:{ 
          requireDisplayName: true,
          backgroundColor: '#fff',
          displayJids:true, 
          enableClosePage: true, 
          disable1On1Mode: true, 
          enableUserRolesBasedOnToken: false,
          prejoinPageEnabled: true,
          disableInviteFunctions: true ,
          requireDisplayName: false,
          enableWelcomePage: true,
          enableDisplayNameInStats: true,
          enableEmailInStats: true,
          SHOW_PROMOTIONAL_CLOSE_PAGE:false,
          resolution: 480,  //1080,720,480,360,180
      constraints: {
          video: {
              aspectRatio: 16 / 9,
              height: {
                  ideal: 480,
                  max: 480,
                  min: 240
              },
              width: {
                  ideal: 480,
                  max: 480,
                  min: 480
              }
          } 
      },
     
      },
      interfaceConfigOverwrite : {
          DEFAULT_BACKGROUND: "#ADD8E6",
      HIDE_INVITE_MORE_HEADER:true,
      SHOW_PROMOTIONAL_CLOSE_PAGE: true,
      MAIN_TOOLBAR_BUTTONS: ['microphone', 'camera', 'desktop','fullscreen'], 
      TOOLBAR_BUTTONS:['microphone', 
      'camera', 
      'closedcaptions',
       
        'fullscreen',
          'fodeviceselection',
           'hangup',
            'profile', 
           // 'chat', 
            'settings', 
          'videoquality', 
          'filmstrip',
             'stats', 
          'tileview',
           'videobackgroundblur',
              'security'
          ]
      },
      onload: function () { 
         //  alert('Meeting is going to start');
       }
  };
 const domain='jitsimeet.tutoroot.com';
 const _jitsi = new window.JitsiMeetExternalAPI(domain,options);
 _jitsi.addEventListeners({
  readyToClose : function () {
      //alert('Participant is going to close');
  },
  participantJoined:function(data){
      console.log("pjoined"+data);
     // alert("Patient joined");
  },
  participantLeft:function(data){
      console.log("pleft"+data);
     // alert("Patient Left");

  },
  videoConferenceJoined :function(data){
       console.log("cjoined"+data);
       let PatientId = localStorage.getItem('DoctorSelectedPatientId');
     // alert(PatientId);
     // alert("Doctor Joined to Meeting");
       sendNotificationsDoctorJoined (meetingId,PatientId);       

   },
   videoConferenceLeft :function(data){
       console.log("cjoined"+data);
       _jitsi.executeCommand('hangup');
      // alert('Doctor left from the Meeting');
       let PatientId = localStorage.getItem('DoctorSelectedPatientId');
      sendNotifications ();   
      sendNotificationsDoctorEnded(meetingId,PatientId);    
      document.getElementById(jitsiContainerId).innerHTML='call ended thanks for using MedleyMed';
   }
});
    setJitsi(_jitsi);
  };

  React.useEffect(() => {
    initialiseJitsi();

    //return () => jitsi?.dispose?.(); 
  }, []);

  return <div id={jitsiContainerId} style={{ height: 720, width: "100%" }} allow={"camera;microphone"}/>;
};

export default VideoConference;
