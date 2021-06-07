module.exports = app =>{
    const Labtestprefered = require('../controllers/labtest_prefered_table_tbl.controller')
    var router = require('express').Router();
     
   
    //Retrieve all Master Modules
    router.get("/",  Labtestprefered.findAll);
    // create new record
    router.post("/",  Labtestprefered.create);
   // Retrieve a single Master Module with id
    router.get("/:id", Labtestprefered.findOne);

    // Update a Master Module with id
    router.put("/:id", Labtestprefered.update);
    // Delete a Master Module with id
    router.delete("/:id", Labtestprefered.delete);
  
    app.use('/api/Labtestprefered',router);
    } 