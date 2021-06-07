module.exports = app =>{
    const Doctor_exp = require('../controllers/doctor_experience.controller');
	const VerifyToken = require('../config/verifyToken');

    var router = require('express').Router();

	//router.all('*',VerifyToken);

	// Retrieve all Doctorexperience
	router.get("/",  Doctor_exp.findAll);

	// Create a new Doctorexperience
	router.post("/",  Doctor_exp.create);

	// Retrieve a single Doctorexperience with id
	router.get("/:id", Doctor_exp.findOne);

	// Update a Doctorexperience with id
	router.put("/:id", Doctor_exp.update);

	// Delete a Doctorexperience with id
	router.delete("/:id", Doctor_exp.delete);

	router.delete("/",  Doctor_exp.deleteAll);

	app.use('/api/Doctorexperience', router);
}