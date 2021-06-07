module.exports = app => {
    const Clinic = require("../controllers/clinic_tbl_controller.js");  
    var router = require("express").Router();
    const VerifyToken = require('../config/verifyToken');
    //router.all('*',VerifyToken);
    router.get("/clinicList", VerifyToken, Clinic.findAll);     
    // Search Clinic By Name
    // router.get("/clinicByName",  Clinic.findOne);
    // Create a new Clinic
    router.post("/", VerifyToken, Clinic.create);
    // Clinic Dashboard
    router.get("/dashboard/:clinicId",  Clinic.clinicDashboard);  
    // Retrieve all Clinic
   // router.get("/",  Clinic.findAll);  
    // Retrieve a single Clinic with id
    router.get("/:id", VerifyToken, Clinic.findOne);  
    // Update a Clinic with id
    router.put("/:id", VerifyToken, Clinic.update);  
    // Delete a Clinic with id
    router.delete("/:id", VerifyToken, Clinic.delete);  
    // Deleted all  Clinic
    router.delete("/", VerifyToken, Clinic.deleteAll);
   // Search Clinic By Name
    router.get("/getClinicLanguages/:id", VerifyToken, Clinic.findClinicid);
    app.use('/api/Clinic', router);   
  };
  