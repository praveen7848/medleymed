module.exports = app => {
    const SlotTimings = require("../controllers/doctor_slot_timings.controller.js");
    const VerifyToken = require('../config/verifyToken');
  
    var router = require("express").Router();
    // router.all('*',VerifyToken);


    // Create a new Slot Default Timings
    router.post("/create",  SlotTimings.create);
  
    // Retrieve all AuditTrails
    // router.get("/",  AuditTrails.findAll);
  
    // Retrieve a single Assessment with id
    // router.get("/:id",  AuditTrails.findOne);
  
    // Update a Assessment with id
    // router.put("/:id", AuditTrails.update);
  
    // Delete a Assessment with id
    // router.delete("/:id",  AuditTrails.delete);
  
    // Create a new Assessment
    // router.delete("/",  AuditTrails.deleteAll);
  
    app.use('/api/defaultSlotTimings', router);
    
  };
  