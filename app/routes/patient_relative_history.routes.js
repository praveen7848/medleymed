module.exports = app => {
    const Patientrelativedata = require("../controllers/patient_relative_history.controller.js");
    var router = require("express").Router();
    const VerifyToken = require('../config/verifyToken'); 
    router.all('*',VerifyToken);
    // ------------------------- Admin Based Apis -----------------------------------------------//

    // Retrieve all Patient relative history
    router.get("/",  Patientrelativedata.findAll);
    // Create Patients relative history data
    router.post("/",  Patientrelativedata.create);
  
    // Retrieve a single Patient relative history with id
    router.get("/:id",  Patientrelativedata.findOne);
  
    // Update a Patient relative history with id
    router.put("/:id",  Patientrelativedata.update);
  
    // Delete a Patient relative history with id
    router.delete("/:id",  Patientrelativedata.delete);
  
    // ------------------------- Clinic Based Apis -----------------------------------------------//

    
    app.use('/api/Patientrelativehistory', router);
  };