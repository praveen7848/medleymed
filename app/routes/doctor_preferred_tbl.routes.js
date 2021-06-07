module.exports = app => {
    const doctor_preferred = require('../controllers/doctor_preferred.controller');
    const VerifyToken = require('../config/verifyToken');
 
    var router = require('express').Router();
 
    //router.all('*',VerifyToken);
 
    // Retrieve all Doctor preferred
    router.get("/", doctor_preferred.findAll);
 
    // Create a new Doctor preferred
    router.post("/create", doctor_preferred.create);
 
    // Retrieve a single Doctor preferred with id
    router.get("/:id", doctor_preferred.findOne);
 
    // Update a Doctor preferred with id
    router.put("/:id", doctor_preferred.update);
 
    // Delete a Doctor preferred with id
    router.delete("/:id", doctor_preferred.delete);
 
    app.use('/api/doctorPreferred', router);
 }