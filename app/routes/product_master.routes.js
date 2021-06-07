module.exports = app =>{
    const ProductMaster = require('../controllers/product_master.controller');
	var router = require('express').Router();
	const VerifyToken = require('../config/verifyToken');
	//router.all('*',VerifyToken);	
	// Drug Allergies with search
	router.get("/searchDrugAllergies", VerifyToken,  ProductMaster.searchDrugAllergies);
	// Retrieve all Mastercontrollers
	router.get("/", VerifyToken, ProductMaster.findAll);
    router.get("/fetchAll", VerifyToken,ProductMaster.fetchAll);
	// Create a new Mastercontrollers
	router.post("/",  ProductMaster.create);
	router.get("/fetchdata/:id", ProductMaster.findSinglerecord);
	// Retrieve a single Mastercontrollers with id
	router.get("/:id", VerifyToken,ProductMaster.findOne);
	// Update a Mastercontrollers with id
	router.put("/:id", VerifyToken,ProductMaster.update);
	// Delete a Mastercontrollers with id
	router.delete("/:id", VerifyToken,ProductMaster.delete);
	router.delete("/",  VerifyToken,ProductMaster.deleteAll);
	// Drug Allergies with pagination
	router.get("/drugAllergies/:id", VerifyToken, ProductMaster.drugAllergiesfindOne);

	app.use('/api/productMaster', router);
}