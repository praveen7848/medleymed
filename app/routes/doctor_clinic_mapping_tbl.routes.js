module.exports = app =>{
    const Doctorclinicmapping = require('../controllers/doctor_clinic_mapping_tbl.controller')
    var router = require('express').Router();
     
   
    //Retrieve all Master Modules
    router.get("/",  Doctorclinicmapping.findAll);
    // create new record
    router.post("/",  Doctorclinicmapping.create);
   // Retrieve a single Master Module with id
    router.get("/:id", Doctorclinicmapping.findOne);

    // Update a Master Module with id
    router.put("/:id", Doctorclinicmapping.update);
    // Delete a Master Module with id
    router.delete("/:id", Doctorclinicmapping.delete);
  
    app.use('/api/Doctorclinicmapping',router);
    }