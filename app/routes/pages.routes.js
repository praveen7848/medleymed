module.exports = app => {
	const pages_tbl = require('../controllers/pages.controller');
	var router = require('express').Router();
	const VerifyToken = require('../config/verifyToken');
	router.all('*',VerifyToken);
// ------------------------- Admin Based Apis -----------------------------------------------//
	// Retrieve all page
	router.get("/", pages_tbl.findAll);
	// Create a new page
	router.post("/", pages_tbl.create);
	// Retrieve a single page with id
	router.get("/:id", pages_tbl.findOne);
	// Update a page with id
	router.put("/:id", pages_tbl.update);
	// Delete a page with id
	router.delete("/:id", pages_tbl.delete);
	// ------------------------- Clinic Based Apis -----------------------------------------------//	
	app.use('/api/pages', router);
}