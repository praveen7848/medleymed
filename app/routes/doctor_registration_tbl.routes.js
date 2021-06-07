module.exports = app =>{
    const DoctorRegistration = require('../controllers/doctor_registration.controller');
	const VerifyToken = require('../config/verifyToken');

    var router = require('express').Router();

	//router.all('*',VerifyToken);

	// Retrieve all VitalInformation
	router.get("/",  DoctorRegistration.findAll);

	// Create a new VitalInformation
	router.post("/create",  DoctorRegistration.create);

	// Retrieve a single VitalInformation with id
	router.get("/:id", DoctorRegistration.findOne);

	// Update a VitalInformation with id
	router.put("/:id", DoctorRegistration.update);

	// Delete a VitalInformation with id
	router.delete("/:id", DoctorRegistration.delete);

	router.delete("/",  DoctorRegistration.deleteAll);

	app.use('/api/DoctorRegistration', router);
}