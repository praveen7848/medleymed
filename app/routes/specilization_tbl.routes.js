module.exports = app =>{
    const specilizationcontroller = require('../controllers/specilization_tbl.controller')
  	var router = require('express').Router();
	const VerifyToken = require('../config/verifyToken'); 
    router.all('*',VerifyToken);

 // ------------------------- Admin Based Apis -----------------------------------------------//

	// router.all('*',VerifyToken);
	// Retrieve all Mastercontrollers
	router.get("/",  specilizationcontroller.findAll);
	// Create a new Mastercontrollers
	router.post("/",  specilizationcontroller.create);
	// Retrieve Count Mastercontrollers with id
//	router.get("/getControllerCount", specilizationcontroller.getControllerCount);
	// Retrieve a single Mastercontrollers with id
	router.get("/:id", specilizationcontroller.findOne);
	// Update a Mastercontrollers with id
	router.put("/:id", specilizationcontroller.update);
	// Delete a Mastercontrollers with id
	router.delete("/:id", specilizationcontroller.delete);
	//router.delete("/",  specilizationcontroller.deleteAll);     
	//Calling Specilizations Service Initializing
	
 // ------------------------- Clinic Based Apis -----------------------------------------------//
 

    app.use('/api/Specilization', router);
    }