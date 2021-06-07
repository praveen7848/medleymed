module.exports = app => {
    const Healthosmedicine = require('../controllers/drug_allergies.controller');
    const VerifyToken = require('../config/verifyToken');

    var router = require('express').Router();

    //router.all('*',VerifyToken);

    // Retrieve all Drug Allergies
    router.post("/", Healthosmedicine.findOne);

    app.use('/api/getDrugAllergies', router);
}