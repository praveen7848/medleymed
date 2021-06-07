module.exports = app =>{
    const appointmentcancellationreasons = require('../controllers/appointment_cancellation_reasons_tbl.controller')
    var router = require('express').Router();
    const VerifyToken = require('../config/verifyToken');
    router.all('*',VerifyToken);
   // ------------------------- Admin Apis -----------------------------------------------//   
    //Retrieve all Master Modules
    router.get("/",  appointmentcancellationreasons.findAll);
    // create new record
    router.post("/",  appointmentcancellationreasons.create);
   // Retrieve a single Master Module with id
    router.get("/:id", appointmentcancellationreasons.findOne);
    // Update a Master Module with id
    router.put("/:id", appointmentcancellationreasons.update);
    // Delete a Master Module with id
    router.delete("/:id", appointmentcancellationreasons.delete);
// ------------------------- Clinic Based Apis -----------------------------------------------//
    app.use('/api/appointmentcancellationreasons',router);
    }