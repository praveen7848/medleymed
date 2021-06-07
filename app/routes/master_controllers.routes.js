module.exports = app =>{
    const Mastercontrollers = require('../controllers/master_controllers.controller');
	const VerifyToken = require('../config/verifyToken');

    var router = require('express').Router();

	router.all('*',VerifyToken);

	// Retrieve all Mastercontrollers
	router.get("/",  Mastercontrollers.findAll);

	// Create a new Mastercontrollers
	router.post("/",  Mastercontrollers.create);

	// Retrieve Count Mastercontrollers with id
	router.get("/getControllerCount", Mastercontrollers.getControllerCount);

    // Retrive count doctors,clinics and user based on userType
    router.get("/count/:userType", Mastercontrollers.getCount);

	// Retrieve a single Mastercontrollers with id
	router.get("/:id", Mastercontrollers.findOne);

	// Update a Mastercontrollers with id
	router.put("/:id", Mastercontrollers.update);

	// Delete a Mastercontrollers with id
	router.delete("/:id", Mastercontrollers.delete);

	router.delete("/",  Mastercontrollers.deleteAll);

	app.use('/api/Mastercontrollers', router);
}