module.exports = app => {
    const Symptoms = require("../controllers/telemedicine_schedule_tbl.controller");
    const VerifyToken = require('../config/verifyToken');
    var router = require("express").Router();

    // router.all('*', VerifyToken);

    // save Symptoms
    // router.post("/saveSymptoms", Symptoms.create);

    // get Symptom by uniqId
    // router.get("/getSymptomsByUniqId", Symptoms.findOneById);

    app.use('/api/clinic', router);
};
