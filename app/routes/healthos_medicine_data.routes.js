module.exports = app =>{
    const Healthosmedicine = require('../controllers/healthos_medicine_data.controller');
	const VerifyToken = require('../config/verifyToken');

    var router = require('express').Router();

	//router.all('*',VerifyToken);

	// Drug Allergies with search
	router.get("/searchDrugAllergies",  Healthosmedicine.searchDrugAllergies);

	// Retrieve all Mastercontrollers
	router.get("/",  Healthosmedicine.findAll);

    router.get("/fetchAll",Healthosmedicine.fetchAll)
	// Create a new Mastercontrollers
	router.post("/",  Healthosmedicine.create);

	router.get("/fetchdata/:id",Healthosmedicine.findSinglerecord)
	// Retrieve a single Mastercontrollers with id
	router.get("/:id", Healthosmedicine.findOne);

	// Update a Mastercontrollers with id
	router.put("/:id", Healthosmedicine.update);

	// Delete a Mastercontrollers with id
	router.delete("/:id", Healthosmedicine.delete);

	router.delete("/",  Healthosmedicine.deleteAll);

	// Drug Allergies with pagination
	router.get("/drugAllergies/:id", Healthosmedicine.drugAllergiesfindOne);

	

	app.use('/api/Healthosmedicine', router);
}