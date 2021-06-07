module.exports = app => {
    const Supermodule = require("../controllers/supermodules_tbl.controller");
    //const VerifyToken = require('../config/verifyToken');
  
    var router = require("express").Router();
  
    //router.all('*',VerifyToken);
  
    // Retrieve all Master Modules
    router.get("/getSuperModulesList",  Supermodule.findAll);
  
    // create new record
    // router.post("/addSuperModules",  Supermodule.create);
    router.post("/",  Supermodule.create);
  
    // Retrieve Count Master Module with id
    router.get("/getModuleCount", Supermodule.getModuleCount);
  
    // Retrieve a single Master Module with id
    router.get("/clinicByName", Supermodule.findOne);
  
    // Update a Master Module with id
    router.put("/:id", Supermodule.update);
  
    // Delete a Master Module with id
    router.delete("/:id", Supermodule.delete);
  
    app.use('/api/Supermodule', router);
  };
  