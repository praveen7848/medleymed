module.exports = app => {
    const purpose_consultation = require("../controllers/purpose_consultation_tbl.controller.js");
    var router = require("express").Router();
    const VerifyToken = require('../config/verifyToken'); 
    router.all('*',VerifyToken);
     // ------------------------- Admin Based Apis -----------------------------------------------//

    // Get Purpose of Consultation Data
    router.get("/", purpose_consultation.getDetails)

    // Create Purpose of Consultation data
    router.post("/create", purpose_consultation.create);

    // Update Purpose of Consultation data
    router.put("/:id", purpose_consultation.update);

    // Delete a Master Module with id
    router.delete("/:id", purpose_consultation.delete);

    // Get Purpose of Consultation Data for web
    router.get("/getConsultationDetails", purpose_consultation.getDataDetails);

     // Retrieve a single Master Module with id
    router.get("/:id", purpose_consultation.findOne);

 
 // ------------------------- Clinic Based Apis -----------------------------------------------//    

    app.use('/api/purpose_consultation', router);
};
