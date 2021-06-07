module.exports = app => {
	const coupan_tbl = require('../controllers/coupan.controller');
	var router = require('express').Router();
	const VerifyToken = require('../config/verifyToken');
	router.all('*',VerifyToken);
  // ------------------------- Admin Apis -----------------------------------------------//   
	// Retrieve all Patient Coupan
	router.get("/", coupan_tbl.findAll);

	// Create a new Patient Coupan
	router.post("/", coupan_tbl.create);

	// Retrieve a single Patient Coupan with id
	router.get("/:id", coupan_tbl.findOne);

	// Update a Patient appointment with appointment id
	router.put("/:id", coupan_tbl.update);

	// Delete a patient appointment with appointment id
	router.delete("/:id", coupan_tbl.delete);
	// Coupone Valid and Verfication
	router.get("/CoupanValid/:id", coupan_tbl.CoupanValid);

// ------------------------- Clinic Based Apis -----------------------------------------------//   

	app.use('/api/Coupon', router);
}