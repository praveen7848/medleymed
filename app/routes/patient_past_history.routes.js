const { patient_relative_history } = require("../models/index.js");

module.exports = app => {
    const patient_history = require("../controllers/patient_past_history.controller.js");

    var router = require("express").Router();

    // Create Patient problem data
    router.post("/", patient_history.create);
    
    // fetch medicine and drug details
    router.get("/fetchmedicinedrugs/:id",patient_history.fetchmedicinedrugs)

    // fetch details
    router.get("/:id/:appointment_id/:clinicId",patient_history.findOne)
    //upload Patient Documents
   //router.post("/uploadMedicalImages", patient_history.Uploadpatientmedicaldocuments);

    app.use('/api/hpi', router);
};
