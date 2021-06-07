module.exports = app => {
  const MasterPatientControllers = require("../controllers/master_patient_controllers");
  const VerifyToken = require('../config/verifyToken');
  var router = require("express").Router();

	router.all('*',VerifyToken);

	// Retrieve all Master Modules
	router.get("/",  MasterPatientControllers.findAll);

	// create new record
	router.post("/",  MasterPatientControllers.create);

	// Retrieve a single Master Module with id
	router.get("/:id", MasterPatientControllers.findOne);

	// Update a Master Module with id
	router.put("/:id", MasterPatientControllers.update);

	// Delete a Master Module with id
	router.delete("/:id", MasterPatientControllers.delete);

	app.use('/api/MasterPatientControllers', router);
};
