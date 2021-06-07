module.exports = app => {
    const specialities_tbl = require('../controllers/specialities_tbl.controller');
    var router = require('express').Router();
    const VerifyToken = require('../config/verifyToken'); 
    router.all('*', VerifyToken); 
 // ------------------------- Admin Based Apis -----------------------------------------------//     // Retrieve all Doctor speciality
    router.get("/", specialities_tbl.findAll); 
    // Create a new Doctor speciality
    router.post("/create", specialities_tbl.create); 
    // Retrieve a single Doctor speciality with id
    router.get("/:id", specialities_tbl.findOne); 
    // Update a Doctor speciality with id
    router.put("/:id", specialities_tbl.update); 
    // Delete a Doctor speciality with id
    router.delete("/:id", specialities_tbl.delete);
 // ------------------------- Clinic Based Apis -----------------------------------------------//  
 app.use('/api/specialities', router);
 }