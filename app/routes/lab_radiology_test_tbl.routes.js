module.exports = app =>{
    const Labradiologytest = require('../controllers/lab_radiology_test_tbl.controller')
    var router = require('express').Router();
     
   
    //Retrieve all Master Modules
    router.get("/",  Labradiologytest.findAll);
    // create new record
    router.post("/",  Labradiologytest.create);
   // Retrieve a single Master Module with id
    router.get("/:id", Labradiologytest.findOne);

    // Update a Master Module with id
    router.put("/:id", Labradiologytest.update);
    // Delete a Master Module with id
    router.delete("/:id", Labradiologytest.delete);
  
    app.use('/api/Labradiologytest',router);
    } 