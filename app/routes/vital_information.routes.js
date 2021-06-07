module.exports = app =>{
    const VitalInformation = require('../controllers/vital_information.controller');
	var router = require('express').Router();
	const VerifyToken = require('../config/verifyToken');
	router.all('*',VerifyToken);
 // ------------------------- Admin Based Apis -----------------------------------------------//
	router.get("/getVitals/:id/:appointment_id/:clinicId", VitalInformation.getVitalDetails);
	// Create a new VitalInformation
	router.post("/",  VitalInformation.create);
	// Retrieve a single VitalInformation with id
	router.get("/:id", VitalInformation.findOne);
	// Update a VitalInformation with id
	router.put("/:id", VitalInformation.update);	
	// Update a VitalInformation with Patient Id and Appointment Id
	router.put("/:patientId/:appointmentId", VitalInformation.singleColumnUpdate);
	
	//router.get("/doctorReq/getVitals/:patientId/:requiretype",  VitalInformation.doctorReqgetVitalDetails);
 // ------------------------- Clinic Based Apis -----------------------------------------------// 
	app.use('/api/VitalInformation', router);
}