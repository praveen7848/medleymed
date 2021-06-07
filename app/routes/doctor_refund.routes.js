module.exports = app =>{
    const Doctor_refund = require('../controllers/doctor_refund.controller');
	const VerifyToken = require('../config/verifyToken');

    var router = require('express').Router();

	//router.all('*',VerifyToken);

	// Retrieve all Doctorrefund
	router.get("/",  Doctor_refund.findAll);

	// Create a new Doctorrefund
	router.post("/",  Doctor_refund.create);

	// Retrieve a single Doctorrefund with id
	router.get("/:id", Doctor_refund.findOne);

	// Update a Doctorrefund with id
	router.put("/:id", Doctor_refund.update);

	// Delete a Doctorrefund with id
	router.delete("/:id", Doctor_refund.delete);

	router.delete("/",  Doctor_refund.deleteAll);

	app.use('/api/Doctorrefund', router);
}