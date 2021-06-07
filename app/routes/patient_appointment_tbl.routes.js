module.exports = app => {
const PatientAppointment = require('../controllers/patient_appointment_tbl.controller');
var router = require('express').Router();
const VerifyToken = require('../config/verifyToken');
//router.all('*',VerifyToken);

// ------------------------- Admin Based Apis -----------------------------------------------//	

// Fetch Patient Appointment Feedback API
router.get("/getAppointmentFeedback",PatientAppointment.getAppointmentFeedback);

router.get("/PatientPrescriptiongen/:appointid/:patientid", PatientAppointment.PatientPrescriptiongen);
// Retrieve all PatientAppointment
router.get("/", PatientAppointment.findAll);
// Call Started Notification and status update
router.put("/callStartedNotificationStatus", PatientAppointment.callStartedNotificationStatus);
// Call End Notification and status update
router.put("/callEndNotificationStatus", PatientAppointment.callStartedNotificationStatus);
// Retrieve all Today Appointment Details Count 
router.post("/getTodayAppointmentCount", VerifyToken, PatientAppointment.todayAppointmentDetailsCount);
// Retrieve all Today Appointment Details 
router.post("/getTodayAppointmentDetails", VerifyToken, PatientAppointment.todayAppointmentDetails);
// Retrieve all route Details 
router.get("/getRouteDetails", PatientAppointment.getRouteDetails);
// retreive All Appointment Details
router.get("/appointmentHistory/:doctorId", PatientAppointment.doctorAppointmentHistoryDetails);
// Doctor Consultation History Details
router.post("/consultationHistory", PatientAppointment.doctorConsultationHistoryDetails);
// Consult Now Doctor Consultation Appointment Conformation..
router.post("/ConsultNowDoctorConfirmation", VerifyToken, PatientAppointment.ConsultNowDoctorConfirmation);
// Update Consult Now Doctor Consultation Appointment Conformation..
router.put("/ConsultNowDoctorConfirmation/:appointmentId", VerifyToken, PatientAppointment.updateConsultNowDoctorConfirmation);
// Get Consult Now Doctor Consultation Appointment Conformation..
router.get("/getConsultNowAppointments/:doctorId", VerifyToken, PatientAppointment.getConsultNowDoctorConfirmation);
// Doctor Appointment Details Date wise
// router.post("/getDatewiseAppointmentDetails", PatientAppointment.doctorDatewiseAppointmentDetails);
router.get("/PatientAppointmentDetails/:appointmentId", PatientAppointment.PatientAppointmentDetails);
router.post("/PatientMedicinecreate", PatientAppointment.PatientMedicinecreate);
router.get("/PatientMedicineList/:appointid", PatientAppointment.PatientMedicineList);
router.get("/PatientMedicineEdit/:id", PatientAppointment.PatientMedicineEdit);
router.put("/PatientMedicineUpdate/:id", PatientAppointment.PatientMedicineUpdate);
router.put("/PatientDiagnostics/:appointid/:patientid", PatientAppointment.PatientDiagnostics);
router.put("/PrescriptionUpload/:appointmentid", PatientAppointment.prescriptionUpload);
router.delete("/PatientMedicine/:id", PatientAppointment.PatientMedicineDelete);
router.post("/DoctorAppointmenthistorycount", PatientAppointment.DoctorAppointmenthistorycount);
// Create a new Patient appointment
router.post("/", PatientAppointment.create);
// Retrieve a single Diagnosis with id
router.get("/diagnostics/:id", PatientAppointment.diagnosticsfindOne);
// Retrieve a single Patient appointment with appointment id
router.get("/:id", PatientAppointment.findOne);
// Update a Patient appointment with appointment id
router.put("/:id", PatientAppointment.update);
// Delete a patient appointment with appointment id
router.delete("/:id", PatientAppointment.delete);
// Upcoming appointments
router.get("/displayupcomingappointments/:patient_id", VerifyToken, PatientAppointment.upcomingappointments)
// Get Consult Now Doctor Consultation Appointment Conformation..
router.get("/getPatientConsultNowAppointments/:patientId", VerifyToken, PatientAppointment.getConsultNowPatientRequests);
// Create a Patient appointment doctor advice
router.put("/doctorAdvice/:appointmentid", PatientAppointment.createDoctorAdvice);
// Get a Patient appointment doctor advice
router.get("/doctorAdvice/:appointmentid", PatientAppointment.getDoctorAdvice);
// Create a Patient appointment final Diagnosis
router.put("/finalDiagnosis/:appointmentid", PatientAppointment.createPatientFinalDiagnosis);
// GET a Patient appointment final Diagnosis
router.get("/finalDiagnosis/:appointmentid", PatientAppointment.getPatientFinalDiagnosis);
// Create a Patient appointment Next appointment Details
router.put("/nextAppointmentDateTime/:appointmentid", PatientAppointment.createPatientNextAppointmentDateTime);
// GET a Patient appointment final Diagnosis
router.get("/nextAppointmentDateTime/:appointmentid", PatientAppointment.getPatientNextAppointmentDateTime);
router.post("/uploadDoctorPrescription", PatientAppointment.uploadDoctorMedicinePrescription);
router.post("/sendEmailToPatient", PatientAppointment.sendEmailToPatient);
router.get("/getPatientVitalinforStatus/:appointmentid", PatientAppointment.getPatientVitalinforStatus);
router.put("/updatePatientVitalinforStatus/:appointmentid", PatientAppointment.updatePatientVitalinforStatus);

router.put("/updateDoctorConsentRequest/:appointmentid", PatientAppointment.updateDoctorConsentRequest);

router.get("/avinash/cc", PatientAppointment.avinash);


// ------------------------- Clinic Based Apis -----------------------------------------------//

// update appointment Status and Cancellation Reason
router.put("/updateConsultationStatus/:appointmentid", VerifyToken, PatientAppointment.updateConsultationStatus);



// Create Patient Appointment Feedback API
router.post("/createAppointmentFeedback", VerifyToken, PatientAppointment.createAppointmentFeedback);

router.post("/getAdminPatientAppointDetails",  PatientAppointment.getAdminPatientAppointDetails);

app.use('/api/PatientAppointment', router);
}