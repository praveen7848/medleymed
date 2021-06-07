module.exports = app => {
	const notifications_tbl = require('../controllers/notifications_tbl.controller');
	const VerifyToken = require('../config/verifyToken');

    var router = require('express').Router();
	//router.all('*',VerifyToken);

	// Retrieve all page
	router.get("/:userId", notifications_tbl.findAll);

	// Create a new page
	router.post("/", notifications_tbl.create);

	// Retrieve a single page with id
	// router.get("/:id", notifications_tbl.findOne);

	// Update a page with id
	router.put("/:id", notifications_tbl.update);

	// Delete a page with id
	router.delete("/:id", notifications_tbl.delete);

	app.use('/api/notifications', router);
}