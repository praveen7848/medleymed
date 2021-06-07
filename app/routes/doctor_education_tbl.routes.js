module.exports = app =>{
    const doctoreducation = require('../controllers/doctor_education_tbl.controller')
    var router = require('express').Router();
     
   
    //Retrieve all Master Modules
    router.get("/",  doctoreducation.findAll);
    // create new record
    router.post("/",  doctoreducation.create);
   // Retrieve a single Master Module with id
    router.get("/:id", doctoreducation.findOne);

    // Update a Master Module with id
    router.put("/:id", doctoreducation.update);
    // Delete a Master Module with id
    router.delete("/:id", doctoreducation.delete);
  
    app.use('/api/doctoreducation',router);
    }