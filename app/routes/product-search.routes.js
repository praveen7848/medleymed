module.exports = app => {
    const productSearchController = require('../controllers/product-search.controller')
    const VerifyToken = require('../config/verifyToken');

    var router = require('express').Router();

	// router.all('*', VerifyToken);

	// Retrieve all Mastercontrollers
	router.post("/", productSearchController.findAll);

    // Calling Specilizations Service Initializing
    app.use('/api/ProductSearch', router);
}