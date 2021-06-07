module.exports = app =>{
    const Doctorconsultationprices = require('../controllers/doctor_consultation_prices_tbl.controller')
    var router = require('express').Router();
     
   
    //Retrieve all Master Modules
    router.get("/",  Doctorconsultationprices.findAll);
    // create new record
    router.post("/",  Doctorconsultationprices.create);
   // Retrieve a single Master Module with id
    router.get("/:id", Doctorconsultationprices.findOne);

    // Update a Master Module with id
    router.put("/:id", Doctorconsultationprices.update);
    // Delete a Master Module with id
    router.delete("/:id", Doctorconsultationprices.delete);
  
    app.use('/api/Doctorconsultationprices',router);
    }