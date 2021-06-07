import React ,{ Component} from 'react';
import { Link } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import toast from "../helpers/toast";
import Httpconfig from '../helpers/Httpconfig';
import Constant from "../../constants";
import VideoConference from "../../VideoConference"; 
import VideoComponent from '../VideoComponent';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import PatientHeader from "../patient/Patientheader";
import PatientFooter from "../patient/Patientfooter";
import { json } from 'body-parser';
//import { askForPermissioToReceiveNotifications } from '../../push-notification';
const appointmentId = JSON.parse(localStorage.getItem('PatientselectedAppointment'));
export default class Patientvideocall extends Component 
{
    
  componentWillMount=()=>{
    this.state.meetingId=appointmentId;//.replace(/"\\/g,'');
    //alert(this.state.meetingId);
    
    // this.setState({
    //   meetingId:appointmentId
    // })
  }
  componentDidMount ()
  {
    var retrievedObject = localStorage.getItem("userObj");
    if(retrievedObject=="" || retrievedObject==null ){
      toast.error("Please login to book an appointment", {
        //  position: "bottom-center",
        });
        const interval = setInterval(() => {
          //alert("in");
          window.location.href = "/Patientlogin";
     }, 1000); 
     
         
    }
      
    var appointmentId = localStorage.getItem('PatientselectedAppointment');
    const appointmentStatus = setInterval(() => {
      this.checkAppointmentStatus(appointmentId);
 }, 1000); 
   // appointmentId="95272";
    // this.setState({
    //   meetingId:appointmentId
    // })

    this.state.meetingId=JSON.parse(appointmentId);//.replace(/"/g,'');
    // Httpconfig.httptokenget(Constant.siteurl + "api/PatientAppointment/PatientAppointmentDetails/"+JSON.parse(appointmentId),)
    // .then((response) => {
    //   if(response.data.status=="200" && response.data.error==false){
    //       if(response.data.data[0].status==3){
    //         window.location.href = "/Patientdashboard";
    //       }
    //       if(response.data.data[0].status==4){
    //         window.location.href = "/Patientdashboard";
    //       }
    //     }})
      
    
    // .catch((error) => {
    //   toast.error(error);
    // });

  }
  constructor(props) {

    super(props);
   // appointmentId = localStorage.getItem('PatientselectedAppointment');
    this.state = {
      IsJitsiVideo: false,
     // meetingId : appointmentId.replace(/"/g,''),//'MedleyMed'
    };
  }
  
  
  handleLanguage=(langValue)=>{
       
    this.setState({Language: langValue});
}

checkAppointmentStatus=(appointmentId)=>{
  Httpconfig.httptokenget(Constant.siteurl + "api/PatientAppointment/PatientAppointmentDetails/"+JSON.parse(appointmentId),)
      .then((response) => {
        if(response.data.status=="200" && response.data.error==false){
            if(response.data.data[0].status==3){
              window.location.href = "/Patientdashboard";
            }
            if(response.data.data[0].status==4){
              window.location.href = "/Patientdashboard";
            }
        }
      })
      .catch((error) => {
        toast.error(error);
      });
}
  render(){ 
   // const meetingid = this.state.meetingId;
    const IsJitsiVideo=this.state.IsJitsiVideo;
    
    return(
     
      <main id="main">
       <PatientHeader onSelectLanguage={this.handleLanguage}/>
      <section id="main_dashboard">
      <div className="container" id="main_front">
      <div className="row">
      <div className="col-md-12">
      <div className="dash-section">
      <div className="section-header">
      <ol className="breadcrumb">
      <li className="active">
      {/* <Link to="/dashboard"> Dashboard</Link> &gt; */}
      {/* <a>Doctor Consultaion </a> */}
      </li>
      </ol>
      </div>
      </div>
      
      <section id="CMS_tab"> 
      <div className="CMS_content">
      <div className="container">
      <div className="row">
      <div className="tab-header">
      <h3></h3>
      </div>
      {/* <button onClick={askForPermissioToReceiveNotifications} > 
      Click here to receive notifications
    </button>*/}
    
      {!IsJitsiVideo ? (
        <div id="reg_form">
        
        {this.state.meetingId ?
        <VideoConference meetingid={this.state.meetingId}/>
        : ""}
        </div>
      ) : (
        <MuiThemeProvider>
        <div>
        
        <VideoComponent />
        </div>
        </MuiThemeProvider>
      )
    }
    </div>
    <ToastContainer />
    </div>
    </div>
    </section>
    </div>
    </div>
    </div>
    </section>
    <PatientFooter/>
    </main>
  )
}
}