import React, { Component } from 'react';
import { BrowserRouter, Switch, Route, Redirect } from "react-router-dom";
import Dashboard from './admin/dashboard';
import Sidebar from './admin/sidebar';
import Home from './patient/Homee'; 
import Sanar from './patient/SanarHomee'; 

//import Home from './patient/home';  
import Patientlogin from './patient/login';
import Patientprofile from './patient/Patientprofile';
import Patientdashboard from './patient/Patientdashboard';
import PatientHealthProfile from './patient/patientHealthProfile'; 
import Patientadd from './patient/Patientadd';
import Patientchecksettings from './patient/Patientchecksettings';
import Patientappointment from './patient/Patientappointment';
import Patientvideocall from './patient/Patientvideocall';
import Patientconsultationpurpose from './patient/patientConsultationPurpose';
import Patientsymptoms from './patient/patientSymptoms';
import PatientVitalInformation from './patient/PatientVitalInformation';
import PatientPastIllness from './patient/PatientPastIllness';
import PatientConfirmAppointment from './patient/PatientConfirmAppointment';
import AvailableDoctors from './patient/AvailableDoctors';
import patientOrders from './patient/Vieworders';
import PatientSavedMedicines from './patient/PatientSavedMedicines';
import patientAddresses from './patient/ManageAddress';
import PatientFooter from './patient/Patientfooter';


import OrderMedcineHome from './patient/SanarOrderMedicineHome';
import PatientSelectRetailer from './patient/PatientSelectRetailer';


import DoctorLogin from './doctor/Doctorlogin';
import DoctorForgotPassword from './doctor/DoctorForgotPassword';

import DoctorHeader from './doctor/DoctorHeader';
import DoctorDashboard from './doctor/Doctordashboard';
import DoctorProfile from './doctor/DoctorProfile';
import DoctorVideoConsultation from './doctor/DoctorVideoConsultation';
import DoctorConsultationHistory from './doctor/DoctorConsultationHistory';
import DoctorViewSlots from './doctor/DoctorViewSlots';
import DoctorTelemedicineAppointments from './doctor/DoctorTelemedicineAppointments';


import RetailerLogin from './retailer/Retailerlogin';
import RetailerDashboard from './retailer/Retailerdashboard';
import RetailerPendingOrders from './retailer/Retailerpendingorders';
import RetailerStock from './retailer/Retailerstock';
import RetailerUploadStock from './retailer/Retaileruploadstock';
import RetailertransactionHistory from './retailer/Retailertransactionhistory';
import Retailersettings from './retailer/Retailersettings';


import Header from './admin/Header'; 


//import Languagetranslate from './Languagetranslate';
//import Timezonespage from './Timezonespage';
import Vediorender from './Vediorender';


// import Createmastercontrollers from './admin/Createmastercontrollers';
// import Createmastermodules from './admin/Createmastermodules';
// import Viewmastecontrollers from './admin/Viewmastercontrollers';
// import Viewmastermodules from './admin/Viewmastermodules';


import Createspecializations from './admin/Createspecializations';
import Createspecialities from './admin/Createspecialities';

import UploadImages from './admin/UploadImages';
import Createlanguages from './admin/Createlanguages';
import Viewspecializations from './admin/Viewspecializations';
import ViewSpecialities from './admin/Viewspecialities';
import Viewlanguages from './admin/Viewlanguages';
import Createpurposeconsultation from './admin/Createpurposeconsultation';
import Createviewcouncils from './admin/Createviewcouncils';
import Createcountries from './admin/Createcountries';
import Viewcountriesdata from './admin/Viewcountriesdata';
import PatientRegistration from './admin/PatientRegistration';
import CreatePatient from './admin/CreatePatient';
import Createpatientrelativehistory from './admin/Createpatientrelativehistory';
import Patientrelativehistory from './admin/Patientrelativehistory';
import Assessments from "./admin/Assessments";
import CreateAssessment from "./admin/CreateAssessment";
import SetAssessmentScore from "./admin/SetAssessmentScore";
import SetAssessmentResponse from "./admin/SetAssessmentResponse";
import SetAssessmentQuestions from "./admin/SetAssessmentQuestions";
import Createsettings from './admin/Createsettings';
import Viewsettings from './admin/Viewsettings';
import Createviewrelationships from './admin/Createviewrelationships';
import Create_health_medicine_data from './admin/Create_health_medicine_data';
import Viewhealthmedicine from './admin/Viewhealthmedicine';
import Createtelemedicine_schedule_slots from './admin/Createtelemedicine_schedule_slots';
import CreateCategoryType from "./admin/CreateCategoryType";
import CategoryRegistration from "./admin/CategoryRegistration";
import Create_view_masterconfigurations from "./Create_view_masterconfigurations";
import Viewpurposeconsultation from './admin/Viewpurposeconsultation';
import Createpages from './admin/Createpages';
import ViewPages from './admin/Viewpages';
import Createcoupons from './admin/Createcoupons';
import ViewCoupons from './admin/Viewcoupons';
import Createfacilitator from './admin/Facilitator';
import Viewupdatevitals from './admin/Viewupdatevitals';
import Uploadcommonimages from "./admin/uploadcommonimages";

import Createretailers from './admin/Createretailers';
import ViewRetailers from './admin/Viewretailers';
import Viewcancellationreasons from './admin/Viewcancellationreasons';
import Creatcancellationreasons from './admin/Creatcancellationreasons';
PatientFooter




import ViewProductrequest from './admin/ViewProductrequest';

import Createclinic from './admin/Createclinic';
import ViewClinics from './admin/Viewclinics';


import Createdoctor from './admin/Createdoctor';
import ViewDoctors from './admin/Viewdoctors';
import Viewappointments from './admin/Viewappointments';


// View patient import 

import Viewpatients from './admin/Viewpatients';

import Createmasterroles from './admin/Createmasterroles';
import ViewMasterRoles from './admin/Viewmasterroles';


import Createmastermodule from './admin/Createmastermodule';
import ViewMasterModules from './admin/Viewmastermodules';
import Createmastersubmodule from './admin/Createmastersubmodule';
import ViewMasterSubModules from './admin/Viewmastersubmodules';
import Createmastersubpagemodule from './admin/Createmastersubpagemodule';
import ViewMasterSubPageModules from './admin/Viewmastersubpagemodules';
import Createmastersubclinicpagemodule from './admin/Createmastersubclinicpagemodule';
import ViewMasterSubClinicPageModules from './admin/Viewmastersubclinicpagemodules';

import Createdoctorslots from './admin/Createdoctorslots';
import Viewcategory from './admin/Viewcategory';
import CreateCategory from './admin/CreateCategory';
import uploadImages from "./admin/ImageUploads";

import ViewOrders from './admin/Vieworders';

import ViewRevenue from './admin/Viewrevenue';

import ViewDoctorSlots from './admin/Viewdoctorslots';
import AdminLogin from './admin/login';


// import Creatcancellationreasons from './admin/Creatcancellationreasons';
//import ViewCancellationReasons from './admin/Viewcancellationreasons';

export default class Approutes extends Component {

  constructor(props) {
    super(props)
    if (localStorage.getItem("validated")) {
      const status = localStorage.getItem("validated");
      if (status == null) {
        status = false;
      }
      this.state = {
        validated: status,
      };
    } else { 
      this.state = {
        validated: false,
      };
    }

  }
  render() {
    return (
      <BrowserRouter>
        {/* <Route path="/" exact strict render={() => (<PatientHeader /><Patientmenu /><Home /><PatientFooter /> )} /> */}
        <Route path="/" exact strict component={Home} />
        <Route path="/sanar" exact strict component={Sanar} />
        <Route path="/custom/:id" exact strict  component={Home} />
        
        <Route path="/Patientlogin" exact strict component={Patientlogin} />
        <Route path="/Patientprofile" exact strict component={Patientprofile} />
        <Route path="/Patientdashboard" exact strict component={Patientdashboard} />
        <Route path="/patienthealthprofile" exact strict component={PatientHealthProfile} />
        <Route path="/Patientadd" exact strict component={Patientadd} />
        <Route path="/Patientchecksettings" exact strict component={Patientchecksettings} />
        <Route path="/Patientappointment" exact strict component={Patientappointment} />
        <Route path="/Patientvideocall" exact strict component={Patientvideocall} />
        <Route path="/Patientconsultationpurpose" exact strict component={Patientconsultationpurpose} />
        <Route path="/Patientsymptoms" exact strict component={Patientsymptoms} />
        <Route path="/Patientvitals" exact strict component={PatientVitalInformation} />
        <Route path="/Patientmedicalhistory" exact strict component={PatientPastIllness} />
        <Route path="/Patientconfirmappointment" exact strict component={PatientConfirmAppointment} />
        <Route path="/availabledoctors" exact strict component={AvailableDoctors} />
        <Route path="/Patientsavedmedicines" exact strict component={PatientSavedMedicines} />
        <Route path="/myOrders" exact strict component={patientOrders} />
        <Route path="/manageAddress" exact strict component={patientAddresses} />

        <Route path="/ordermedicinehome" exact strict component={OrderMedcineHome} />
        <Route path="/selectretailer" exact strict component={PatientSelectRetailer} />
        

        <Route path="/doctor/login" exact strict component={DoctorLogin} />
        <Route path="/doctor/doctorforgotpassword" exact strict component={DoctorForgotPassword} />
        
        <Route path="/doctor/Doctorprofile" exact strict component={DoctorProfile} />
        <Route path="/doctor/doctordashboard" exact strict component={DoctorDashboard} />
        <Route path="/doctor/Doctorviewslots" exact strict component={DoctorViewSlots} />
        <Route path="/doctor/Doctortelemedicineappointments" exact strict component={DoctorTelemedicineAppointments} />
        <Route path="/doctor/Doctorvideoconsultation" exact strict component={DoctorVideoConsultation} />
        <Route path="/doctor/DoctorConsultationHistory" exact strict component={DoctorConsultationHistory} />

        <Route path="/retailer/login" exact strict component={RetailerLogin} />
        <Route path="/retailer/retailerdashboard" exact strict component={RetailerDashboard} />
        <Route path="/retailer/retailerpendingorders" exact strict component={RetailerPendingOrders} />
        <Route path="/retailer/Retailerstock" exact strict component={RetailerStock} />
        <Route path="/retailer/Retaileruploadstock" exact strict component={RetailerUploadStock} />
        <Route path="/retailer/Retailertransactionhistory" exact strict component={RetailertransactionHistory} />
        <Route path="/retailer/Retailersettings" exact strict component={Retailersettings} />
        
        
        


        <Route path="/admin" exact strict render={() => (this.state.validated = true ? (<div> <Header /><Sidebar /> <Dashboard /><PatientFooter /></div>) : (<Redirect to="/Login" />))} />
        {/* {this.state.validated === "true" ? <Sidebar /> : null} */}
        <Switch>
          {/* <Route path="/" exact strict render={() => (this.state.validated = true ? ( <Dashboard /> ) : ( <Redirect to="/Login" /> )) } /> */}
          {/* <Route path="/#" render={() => (this.state.validated = true ? ( <Dashboard /> ) : ( <Redirect to="/" /> )) } /> */}
          <Route path="/Login" exact strict render={() => (this.state.validated = true ? (<div><Header /><Sidebar /><Dashboard /><PatientFooter /></div>) : (<Redirect to="/" />))} />
          <Route path="/admin/Dashboard" exact strict render={(props) => (this.state.validated = true ? (<div> <Header /><Sidebar />  <Dashboard  {...props} /><PatientFooter /> </div>) : (<Redirect to="/" />))}  />
         


          {/* <Route path="/admin/CreateController" exact strict render={(props) => (this.state.validated = true ? (<div> <Header /><Sidebar />  <Createmastercontrollers  {...props} /> </div>) : (<Redirect to="/" />))}  />
          <Route path="/admin/CreateController/:handle" exact strict render={(props) => (this.state.validated = true ? (<div> <Header /><Sidebar />  <Createmastercontrollers  {...props} /> </div>) : (<Redirect to="/" />))}  />
          <Route path="/admin/CreateModule" exact strict render={(props) => (this.state.validated = true ? (<div> <Header /><Sidebar />  <Createmastermodules  {...props} /> </div>) : (<Redirect to="/" />))}  />
          <Route path="/admin/CreateModule/:handle" exact strict render={(props) => (this.state.validated = true ? (<div> <Header /><Sidebar />  <Createmastermodules  {...props} /> </div>) : (<Redirect to="/" />))}  />
          <Route path="/admin/Viewmastermodules" exact strict render={(props) => (this.state.validated = true ? (<div> <Header /><Sidebar />  <Viewmastermodules  {...props} /> </div>) : (<Redirect to="/" />))}  />
          <Route path="/admin/Viewmastercontrollers" exact strict render={(props) => (this.state.validated = true ? (<div> <Header /><Sidebar />  <Viewmastecontrollers {...props}/></div>) : (<Redirect to="/" />))} /> */}
          

          <Route path="/admin/login" exact strict component={AdminLogin} />
          <Route path="/VideoConsultation" exact strict component={Vediorender} />
          <Route path="/admin/Createspecializations" exact strict render={(props) => (this.state.validated = true ? (<div> <Header /><Sidebar />  <Createspecializations  {...props} /><PatientFooter /></div>) : (<Redirect to="/" />))}  />
          <Route path="/admin/Createspecializations/:handle" exact strict render={(props) => (this.state.validated = true ? (<div> <Header /><Sidebar />  <Createspecializations {...props} /><PatientFooter /></div>) : (<Redirect to="/" />))}  />
          <Route path="/admin/Viewspecializations" exact strict render={(props) => (this.state.validated = true ? (<div> <Header /><Sidebar />  <Viewspecializations  {...props} /><PatientFooter /></div>) : (<Redirect to="/" />))} />
          <Route path="/admin/Createspecialities" exact strict render={(props) => (this.state.validated = true ? (<div> <Header /><Sidebar />  <Createspecialities {...props}/><PatientFooter /></div>) : (<Redirect to="/" />))} />
          <Route path="/admin/Createspecialities/:handle" exact strict render={(props) => (this.state.validated = true ? (<div> <Header /><Sidebar />  <Createspecialities {...props}/><PatientFooter /></div>) : (<Redirect to="/" />))} />
          <Route path="/admin/Viewspecialities" exact strict render={(props) => (this.state.validated = true ? (<div> <Header /><Sidebar />  <ViewSpecialities {...props}/><PatientFooter /></div>) : (<Redirect to="/" />))} />
          
          <Route path="/admin/UploadImages/:handle" exact strict component={UploadImages} render={(props) => (this.state.validated = true ? (<div> <Header /><Sidebar />  <ViewSpecialities {...props}/><PatientFooter /></div>) : (<Redirect to="/" />))} />
          
          <Route path="/admin/Createlanguages" exact strict component={Createlanguages} render={(props) => (this.state.validated = true ? (<div> <Header /><Sidebar />  <ViewSpecialities {...props}/><PatientFooter /></div>) : (<Redirect to="/" />))} />
          <Route path="/admin/Createlanguages/:handle" exact strict component={Createlanguages} render={(props) => (this.state.validated = true ? (<div> <Header /><Sidebar />  <ViewSpecialities {...props}/><PatientFooter /></div>) : (<Redirect to="/" />))} />
          <Route path="/admin/Viewlanguages" exact strict component={Viewlanguages} render={(props) => (this.state.validated = true ? (<div> <Header /><Sidebar />  <ViewSpecialities {...props}/></div>) : (<Redirect to="/" />))} />
          <Route path="/admin/Createpurposeconsultation" exact strict render={(props) => (this.state.validated = true ? (<div> <Header /><Sidebar />  <Createpurposeconsultation  {...props} /><PatientFooter /> </div>) : (<Redirect to="/" />))}  />
          <Route path="/admin/Createpurposeconsultation/:handle" exact strict   render={(props) => (this.state.validated = true ? (<div> <Header /><Sidebar />  <Createpurposeconsultation  {...props} /><PatientFooter /> </div>) : (<Redirect to="/" />))}  />
         
          <Route path="/admin/CategoryType" exact strict render={(props) => (this.state.validated = true ? (<div> <Header /><Sidebar />  <CreateCategoryType  {...props} /><PatientFooter /> </div>) : (<Redirect to="/" />))}  />
         
          <Route path="/admin/CategoryType/:handle" exact strict render={(props) => (this.state.validated = true ? (<div> <Header /><Sidebar />  <CreateCategoryType  {...props} /><PatientFooter /> </div>) : (<Redirect to="/" />))} />
          <Route path="/admin/CategoryRegistration/:handle" exact strict component={CategoryRegistration} render={(props) => (this.state.validated = true ? (<div> <Header /><Sidebar />  <ViewSpecialities {...props}/><PatientFooter /></div>) : (<Redirect to="/" />))} />
          <Route path="/admin/CategoryRegistration/:handle/:editid" exact strict component={CategoryRegistration} render={(props) => (this.state.validated = true ? (<div> <Header /><Sidebar />  <ViewSpecialities {...props}/><PatientFooter /></div>) : (<Redirect to="/" />))} />
          <Route path="/admin/Createviewcouncils" exact strict render={(props) => (this.state.validated = true ? (<div> <Header /><Sidebar />  <Createviewcouncils {...props}/><PatientFooter /></div>) : (<Redirect to="/" />))} />
          <Route path="/admin/Createcountries" exact strict render={(props) => (this.state.validated = true ? (<div> <Header /><Sidebar />  <Createcountries {...props}/><PatientFooter /></div>) : (<Redirect to="/" />))} />
          <Route path="/admin/Createcountries/:handle" exact strict render={(props) => (this.state.validated = true ? (<div> <Header /><Sidebar />  <Createcountries {...props}/><PatientFooter /></div>) : (<Redirect to="/" />))} />
          <Route path="/admin/Viewcountries" exact strict render={(props) => (this.state.validated = true ? (<div> <Header /><Sidebar />  <Viewcountriesdata {...props}/><PatientFooter /></div>) : (<Redirect to="/" />))} />
          <Route path="/admin/PatientRegistration" exact strict render={(props) => (this.state.validated = true ? (<div> <Header /><Sidebar />  <PatientRegistration {...props}/><PatientFooter /></div>) : (<Redirect to="/" />))} />
          <Route path="/admin/CreatePatient" exact strict render={(props) => (this.state.validated = true ? (<div> <Header /><Sidebar />  <CreatePatient {...props}/><PatientFooter /></div>) : (<Redirect to="/" />))} />
          <Route path="/admin/CreatePatient/:handle" exact strict render={(props) => (this.state.validated = true ? (<div> <Header /><Sidebar />  <CreatePatient {...props}/><PatientFooter /></div>) : (<Redirect to="/" />))} />
          <Route path="/admin/Createpatientrelativehistory/:handle" exact strict render={(props) => (this.state.validated = true ? (<div> <Header /><Sidebar />  <Createpatientrelativehistory {...props}/><PatientFooter /></div>) : (<Redirect to="/" />))} />
          <Route path="/admin/Createpatientrelativehistory" exact strict render={(props) => (this.state.validated = true ? (<div> <Header /><Sidebar />  <Createpatientrelativehistory {...props}/><PatientFooter /></div>) : (<Redirect to="/" />))} />
          <Route path="/admin/Patientrelativehistory" exact strict render={(props) => (this.state.validated = true ? (<div> <Header /><Sidebar />  <Patientrelativehistory {...props}/><PatientFooter /></div>) : (<Redirect to="/" />))} />
          <Route path="/admin/Assessments" exact strict render={(props) => (this.state.validated = true ? (<div> <Header /><Sidebar />  <Assessments {...props}/><PatientFooter /></div>) : (<Redirect to="/" />))} />
          <Route path="/admin/CreateAssessment" exact strict render={(props) => (this.state.validated = true ? (<div> <Header /><Sidebar />  <CreateAssessment {...props}/><PatientFooter /></div>) : (<Redirect to="/" />))} />
          <Route path="/admin/CreateAssessment/:handle" exact strict render={(props) => (this.state.validated = true ? (<div> <Header /><Sidebar />  <CreateAssessment {...props}/><PatientFooter /></div>) : (<Redirect to="/" />))} />
          <Route path="/admin/SetAssessmentScore/:handle" exact strict render={(props) => (this.state.validated = true ? (<div> <Header /><Sidebar />  <SetAssessmentScore {...props}/><PatientFooter /></div>) : (<Redirect to="/" />))} />
          <Route path="/admin/SetAssessmentResponse/:handle" exact strict render={(props) => (this.state.validated = true ? (<div> <Header /><Sidebar />  <SetAssessmentResponse {...props}/><PatientFooter /></div>) : (<Redirect to="/" />))} />
          <Route path="/admin/SetAssessmentQuestions/:handle" exact strict render={(props) => (this.state.validated = true ? (<div> <Header /><Sidebar />  <SetAssessmentQuestions {...props}/><PatientFooter /></div>) : (<Redirect to="/" />))} />
          {/* Create Settings */}
          <Route path="/admin/Createsettings" exact strict render={(props) => (this.state.validated = true ? (<div> <Header /><Sidebar />  <Createsettings {...props}/><PatientFooter /></div>) : (<Redirect to="/" />))} />
          <Route path="/admin/Createsettings/:handle" exact strict render={(props) => (this.state.validated = true ? (<div> <Header /><Sidebar />  <Createsettings {...props}/><PatientFooter /></div>) : (<Redirect to="/" />))} />
          <Route path="/admin/Viewsettings" exact strict render={(props) => (this.state.validated = true ? (<div> <Header /><Sidebar />  <Viewsettings {...props}/><PatientFooter /></div>) : (<Redirect to="/" />))} />
          {/* Ends */} 
          <Route path="/admin/Createviewrelationships" exact strict render={(props) => (this.state.validated = true ? (<div> <Header /><Sidebar />  <Createviewrelationships {...props}/><PatientFooter /></div>) : (<Redirect to="/" />))} />
          <Route path="/admin/Createhealthmedicinedata" exact strict render={(props) => (this.state.validated = true ? (<div> <Header /><Sidebar />  <Create_health_medicine_data {...props}/><PatientFooter /></div>) : (<Redirect to="/" />))} />
          <Route path="/admin/Createhealthmedicinedata/:handle" exact strict render={(props) => (this.state.validated = true ? (<div> <Header /><Sidebar />  <Create_health_medicine_data {...props}/><PatientFooter /></div>) : (<Redirect to="/" />))} />
          <Route path="/admin/Viewhealthmedicine" exact strict render={(props) => (this.state.validated = true ? (<div> <Header /><Sidebar />  <Viewhealthmedicine {...props}/><PatientFooter /></div>) : (<Redirect to="/" />))} />
          <Route path="/admin/Createtelemedicinescheduleslots" exact strict render={(props) => (this.state.validated = true ? (<div> <Header /><Sidebar />  <Createtelemedicine_schedule_slots {...props}/><PatientFooter /></div>) : (<Redirect to="/" />))} />
          
          {/* <Route path="/admin/Updateviewmasterconfigurations" exact strict render={(props) => (this.state.validated = true ? (<div> <Header /><Sidebar />  <Create_view_masterconfigurations {...props}/></div>) : (<Redirect to="/" />))} /> */}
         
          <Route path="/admin/Viewupdatevitals" exact strict render={(props) => (this.state.validated = true ? (<div> <Header /><Sidebar />  <Viewupdatevitals {...props}/><PatientFooter /></div>) : (<Redirect to="/" />))} />
          {/* Terms and Conditions and Privacy Policies */}
          <Route path="/admin/Createpages" exact strict  render={(props) => (this.state.validated = true ? (<div> <Header /><Sidebar />  <Createpages  {...props} /><PatientFooter /> </div>) : (<Redirect to="/" />))}  />
          <Route path="/admin/Createpages/:handle" exact  render={(props) => (this.state.validated = true ? (<div> <Header /><Sidebar />  <Createpages  {...props} /><PatientFooter /> </div>) : (<Redirect to="/" />))}  />
          <Route path="/admin/Viewpages" exact strict  render={(props) => (this.state.validated = true ? (<div> <Header /><Sidebar />  <ViewPages  {...props} /><PatientFooter /> </div>) : (<Redirect to="/" />))}  />
          {/* Ends */}
          {/* Coupons Section  */}
          <Route path="/admin/Createcoupons" exact strict  render={(props) => (this.state.validated = true ? (<div> <Header /><Sidebar />  <Createcoupons  {...props} /><PatientFooter /> </div>) : (<Redirect to="/" />))}  />
          <Route path="/admin/Createcoupons/:handle" exact strict  render={(props) => (this.state.validated = true ? (<div> <Header /><Sidebar />  <Createcoupons  {...props} /> <PatientFooter /></div>) : (<Redirect to="/" />))}  />
          <Route path="/admin/Viewcoupons" exact strict render={(props) => (this.state.validated = true ? (<div> <Header /><Sidebar />  <ViewCoupons  {...props} /><PatientFooter /> </div>) : (<Redirect to="/" /> ))}  /> 
          {/* Ends  */}


          {/* Create Clinic Registration  */}
          <Route path="/admin/Createclinic" exact strict  render={(props) => (this.state.validated = true ? (<div> <Header /><Sidebar />  <Createclinic  {...props} /><PatientFooter /> </div>) : (<Redirect to="/" />))}  />
          <Route path="/admin/Createclinic/:handle" exact strict  render={(props) => (this.state.validated = true ? (<div> <Header /><Sidebar />  <Createclinic  {...props} /><PatientFooter /> </div>) : (<Redirect to="/" />))}  />
          <Route path="/admin/Viewclinics" exact strict render={(props) => (this.state.validated = true ? (<div> <Header /><Sidebar />  <ViewClinics  {...props} /><PatientFooter /> </div>) : (<Redirect to="/" /> ))}  /> 
          {/* Ends */}


          {/* Doctor Registration */}
          <Route path="/admin/Createdoctor" exact strict  render={(props) => (this.state.validated = true ? (<div> <Header /><Sidebar />  <Createdoctor  {...props} /><PatientFooter /> </div>) : (<Redirect to="/" />))}  />
          <Route path="/admin/Createdoctor/:handle" exact strict  render={(props) => (this.state.validated = true ? (<div> <Header /><Sidebar />  <Createdoctor  {...props} /> <PatientFooter /></div>) : (<Redirect to="/" />))}  />
          <Route path="/admin/Viewdoctors" exact strict render={(props) => (this.state.validated = true ? (<div> <Header /><Sidebar />  <ViewDoctors  {...props} /> <PatientFooter /></div>) : (<Redirect to="/" /> ))}  /> 
          {/* Ends here */}

          {/* Patient Registration */}
          {/* <Route path="/admin/Createdoctor" exact strict  render={(props) => (this.state.validated = true ? (<div> <Header /><Sidebar />  <Createdoctor  {...props} /><PatientFooter /> </div>) : (<Redirect to="/" />))}  />
          <Route path="/admin/Createdoctor/:handle" exact strict  render={(props) => (this.state.validated = true ? (<div> <Header /><Sidebar />  <Createdoctor  {...props} /> <PatientFooter /></div>) : (<Redirect to="/" />))}  /> */}
          <Route path="/admin/Viewpatients" exact strict render={(props) => (this.state.validated = true ? (<div> <Header /><Sidebar />  <Viewpatients  {...props} /> <PatientFooter /></div>) : (<Redirect to="/" /> ))}  /> 
          {/* Ends here */}

          {/* Master Roles Registration */}
          <Route path="/admin/Createmasterroles" exact strict  render={(props) => (this.state.validated = true ? (<div> <Header /><Sidebar />  <Createmasterroles  {...props} /> <PatientFooter /></div>) : (<Redirect to="/" />))}  />
          <Route path="/admin/Createmasterroles/:handle" exact strict  render={(props) => (this.state.validated = true ? (<div> <Header /><Sidebar />  <Createmasterroles  {...props} /><PatientFooter /> </div>) : (<Redirect to="/" />))}  />
          <Route path="/admin/Viewmasterroles" exact strict render={(props) => (this.state.validated = true ? (<div> <Header /><Sidebar />  <ViewMasterRoles  {...props} /> <PatientFooter /></div>) : (<Redirect to="/" /> ))}  /> 
          {/* Ends here */}


          {/* Master Modules Registration */}
          <Route path="/admin/Createmastermodule" exact strict  render={(props) => (this.state.validated = true ? (<div> <Header /><Sidebar />  <Createmastermodule  {...props} /> <PatientFooter /></div>) : (<Redirect to="/" />))}  />
          <Route path="/admin/Createmastermodule/:handle" exact strict  render={(props) => (this.state.validated = true ? (<div> <Header /><Sidebar />  <Createmastermodule  {...props} /> <PatientFooter /></div>) : (<Redirect to="/" />))}  />
          <Route path="/admin/Viewmastermodules" exact strict render={(props) => (this.state.validated = true ? (<div> <Header /><Sidebar />  <ViewMasterModules  {...props} /><PatientFooter /> </div>) : (<Redirect to="/" /> ))}  /> 
          {/* Ends here */}


          {/* Master Sub Modules Registration */}
          <Route path="/admin/Createmastersubmodule" exact strict  render={(props) => (this.state.validated = true ? (<div> <Header /><Sidebar />  <Createmastersubmodule  {...props} /> </div>) : (<Redirect to="/" />))}  />
          <Route path="/admin/Createmastersubmodule/:handle" exact strict  render={(props) => (this.state.validated = true ? (<div> <Header /><Sidebar />  <Createmastersubmodule  {...props} /> </div>) : (<Redirect to="/" />))}  />
          <Route path="/admin/Viewmastersubmodules" exact strict render={(props) => (this.state.validated = true ? (<div> <Header /><Sidebar />  <ViewMasterSubModules  {...props} /> </div>) : (<Redirect to="/" /> ))}  /> 
          {/* Ends here */}

          {/* Master Sub Module Pages Registration */}
          <Route path="/admin/Createmastersubpagemodule" exact strict  render={(props) => (this.state.validated = true ? (<div> <Header /><Sidebar />  <Createmastersubpagemodule  {...props} /><PatientFooter /> </div>) : (<Redirect to="/" />))}  />
          <Route path="/admin/Createmastersubpagemodule/:handle" exact strict  render={(props) => (this.state.validated = true ? (<div> <Header /><Sidebar />  <Createmastersubpagemodule  {...props} /><PatientFooter /> </div>) : (<Redirect to="/" />))}  />
          <Route path="/admin/Viewmastersubpagemodules" exact strict render={(props) => (this.state.validated = true ? (<div> <Header /><Sidebar />  <ViewMasterSubPageModules  {...props} /> <PatientFooter /></div>) : (<Redirect to="/" /> ))}  /> 
          {/* Ends here */}

           {/* Master Sub Clinic Module Pages Registration */}
           <Route path="/admin/Createmastersubclinicpagemodule" exact strict  render={(props) => (this.state.validated = true ? (<div> <Header /><Sidebar />  <Createmastersubclinicpagemodule  {...props} /><PatientFooter /> </div>) : (<Redirect to="/" />))}  />
          <Route path="/admin/Createmastersubclinicpagemodule/:handle" exact strict  render={(props) => (this.state.validated = true ? (<div> <Header /><Sidebar />  <Createmastersubclinicpagemodule  {...props} /><PatientFooter /> </div>) : (<Redirect to="/" />))}  />
           <Route path="/admin/Viewmastersubclinicpagemodules" exact strict render={(props) => (this.state.validated = true ? (<div> <Header /><Sidebar />  <ViewMasterSubClinicPageModules  {...props} /> <PatientFooter /></div>) : (<Redirect to="/" /> ))}  /> 
           {/* Ends here */}


          <Route path="/admin/Viewpurposeconsultation" exact strict render={(props) => (this.state.validated = true ? (<div> <Header /><Sidebar />  <Viewpurposeconsultation  {...props} /><PatientFooter /> </div>) : (<Redirect to="/" /> ))}  />
          <Route path="/admin/Facilitator" exact strict render={(props) => (this.state.validated = true ? (<div> <Header /><Sidebar />  <Createfacilitator {...props}/><PatientFooter /></div>) : (<Redirect to="/" />))} />
          <Route path="/admin/uploadcommonimages/:type/:handle" exact strict render={(props) => (this.state.validated = true ? (<div> <Header /><Sidebar />  <Uploadcommonimages  {...props} /><PatientFooter /> </div>) : (<Redirect to="/" /> ))}  />
       
        {/*  Category  wise displaying  */}
       
        <Route path="/admin/Viewcategory" exact strict render={(props) => (this.state.validated = true ? (<div> <Header /><Sidebar />  <Viewcategory  {...props} /><PatientFooter /></div>) : (<Redirect to="/" />))} />
        {/* <Route path="/admin/CreateCategory" exact strict render={(props) => (this.state.validated = true ? (<div> <Header /><Sidebar />  <CreateCategory {...props}/></div>) : (<Redirect to="/" />))} />
        <Route path="/admin/Createcategory/:handle" exact strict render={(props) => (this.state.validated = true ? (<div> <Header /><Sidebar />  <CreateCategory {...props}/></div>) : (<Redirect to="/" />))} />
          */}
          
        <Route path="/admin/ImageUploads/:type" exact strict component={uploadImages} render={(props) => (this.state.validated = true ? (<div> <Header /><Sidebar /> <uploadImages {...props} /><PatientFooter /></div>) : (<Redirect to="/" />))}/> 
        {/* <Route path="/admin/ImageUploads/:type/:handle" exact strict component={uploadImages} render={(props) => (this.state.validated = true ? (<div> <Header /><Sidebar /> <ImageUploads {...props} /> </div>): (<Redirect to="/" />))}/> */}
        <Route path="/admin/ImageUploads/:type/:handle" exact strict component={uploadImages} render={(props) => (this.state.validated = true ? (<div> <Header /><Sidebar /> <uploadImages {...props} /><PatientFooter /> </div>): (<Redirect to="/" />))}/>


        {/* Create Doctor Slots */}
        <Route path="/admin/Createdoctorslots" exact strict render={(props) => (this.state.validated = true ? (<div> <Header /><Sidebar />  <Createdoctorslots {...props}/><PatientFooter /></div>) : (<Redirect to="/" />))} />
        <Route path="/admin/Createdoctorslots/:handle" exact strict  render={(props) => (this.state.validated = true ? (<div> <Header /><Sidebar />  <Createdoctorslots  {...props} /><PatientFooter /> </div>) : (<Redirect to="/" />))}  />
        <Route path="/admin/Viewdoctorslots" exact strict render={(props) => (this.state.validated = true ? (<div> <Header /><Sidebar />  <ViewDoctorSlots  {...props} /><PatientFooter /> </div>) : (<Redirect to="/" /> ))}  /> 
        {/* Ends here */}

        {/* View Appointents List*/}
        <Route path="/admin/Viewappointments" exact strict render={(props) => (this.state.validated = true ? (<div> <Header /><Sidebar />  <Viewappointments  {...props} /><PatientFooter /> </div>) : (<Redirect to="/" /> ))}  /> 
        


        {/* Retailer Section  */}
        <Route path="/admin/Createretailers" exact strict  render={(props) => (this.state.validated = true ? (<div> <Header /><Sidebar />  <Createretailers  {...props} /><PatientFooter /> </div>) : (<Redirect to="/" />))}  />
        <Route path="/admin/Createretailers/:handle" exact strict  render={(props) => (this.state.validated = true ? (<div> <Header /><Sidebar />  <Createretailers  {...props} /><PatientFooter /> </div>) : (<Redirect to="/" />))}  />
        <Route path="/admin/Creatcancellationreasons" exact strict  render={(props) => (this.state.validated = true ? (<div> <Header /><Sidebar />  <Creatcancellationreasons  {...props} /><PatientFooter /> </div>) : (<Redirect to="/" />))}  />
        <Route path="/admin/Creatcancellationreasons/:handle" exact strict  render={(props) => (this.state.validated = true ? (<div> <Header /><Sidebar />  <Creatcancellationreasons  {...props} /><PatientFooter /> </div>) : (<Redirect to="/" />))}  />
        <Route path="/admin/Viewretailers" exact strict render={(props) => (this.state.validated = true ? (<div> <Header /><Sidebar />  <ViewRetailers  {...props} /> <PatientFooter /></div>) : (<Redirect to="/" /> ))}  /> 
        
        <Route path="/admin/ViewProductrequest" exact strict render={(props) => (this.state.validated = true ? (<div> <Header /><Sidebar />  <ViewProductrequest  {...props} /> <PatientFooter /></div>) : (<Redirect to="/" /> ))}  /> 
        <Route path="/admin/Viewcancellationreasons" exact strict render={(props) => (this.state.validated = true ? (<div> <Header /><Sidebar />  <Viewcancellationreasons  {...props} /><PatientFooter /> </div>) : (<Redirect to="/" /> ))}  /> 
        <Route path="/admin/Vieworders" exact strict render={(props) => (this.state.validated = true ? (<div> <Header /><Sidebar />  <ViewOrders  {...props} /><PatientFooter /> </div>) : (<Redirect to="/" /> ))}  /> 
        <Route path="/admin/Viewrevenue" exact strict render={(props) => (this.state.validated = true ? (<div> <Header /><Sidebar />  <ViewRevenue  {...props} /><PatientFooter /> </div>) : (<Redirect to="/" /> ))}  /> 
        
        
        {/* Ends  */}

      {/* Master Modules Registration */}
        {/* <Route path="/admin/Creatcancellationreasons" exact strict  render={(props) => (this.state.validated = true ? (<div> <Header /><Sidebar />  <Creatcancellationreasons  {...props} /> </div>) : (<Redirect to="/" />))}  />
        <Route path="/admin/Creatcancellationreasons/:handle" exact strict  render={(props) => (this.state.validated = true ? (<div> <Header /><Sidebar />  <Creatcancellationreasons  {...props} /> </div>) : (<Redirect to="/" />))}  />
        <Route path="/admin/Viewcancellationreasons" exact strict render={(props) => (this.state.validated = true ? (<div> <Header /><Sidebar />  <ViewCancellationReasons  {...props} /> </div>) : (<Redirect to="/" /> ))}  />  */}
        {/* Ends here */}
          

        </Switch>
      </Browse