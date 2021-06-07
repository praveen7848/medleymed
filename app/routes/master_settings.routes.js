module.exports = app => {
    const Mastersettings = require("../controllers/master_settings.controller");
    const VerifyToken = require('../config/verifyToken');
  
    var router = require("express").Router();
  
   router.all('*',VerifyToken);
  
    // Retrieve all Master settings
    router.get("/",  Mastersettings.findAll);
  
    // create new record settings
    router.post("/",  Mastersettings.create);
  
    // Retrieve Count Master Module with id
  //  router.get("/getModuleCount", Mastersettings.getModuleCount);
  //find default settings
  
  
    // Retrieve a single Master settings with id
    router.get("/:id", Mastersettings.findOne);
  
    // Update a Master settings with id
    router.put("/:id", Mastersettings.update);
  
    // Delete a Master settings with id
    router.delete("/:id", Mastersettings.delete);
  
    app.use('/api/Mastersettings', router);
  };
  