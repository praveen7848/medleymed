module.exports = app =>{
    const Favouritedoctor = require('../controllers/favourite_doctor_tbl.controller')
    var router = require('express').Router();
     
   
    //Retrieve all Master Modules
    router.get("/:patientId",  Favouritedoctor.findAll);
    // create new record
    router.post("/",  Favouritedoctor.create);
   // Retrieve a single Master Module with id
    // router.get("/:id", Favouritedoctor.findOne);

    // Update a Master Module with id
    // router.put("/:id", Favouritedoctor.update);
    // Delete a Master Module with id
    router.delete("/:id", Favouritedoctor.delete);
  
    app.use('/api/Favouritedoctor',router);
    }