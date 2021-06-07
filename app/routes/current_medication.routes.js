module.exports = app => {
    const Healthosmedicine = require('../controllers/current_medication.controller');
    const VerifyToken = require('../config/verifyToken');

    var router = require('express').Router();

    //router.all('*',VerifyToken);

    // Retrieve all Current Medication
    router.get("/", Healthosmedicine.findOne);

    app.use('/api/getCurrentMedication', router);
}