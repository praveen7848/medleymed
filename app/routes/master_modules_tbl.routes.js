module.exports = (app) => {
    const masterModules = require("../controllers/master_modules_tbl.controller");
    var router = require("express").Router();
    const VerifyToken = require("../config/verifyToken");  
    router.all('*',VerifyToken);

  // ------------------------- Admin Apis -----------------------------------------------//
    // Retrieve all  Role
    router.get("/", masterModules.findAll);

     // Retrieve Master Table Id Sequence Id
     router.get("/getSequenceId/:masterModuleId", masterModules.retreiveSequenceId);
  
    // Create a new  Role
    router.post("/", masterModules.create);
  
    // Retrieve a single  Role with id
     router.get("/:id", masterModules.findOne);
  
    // Update a  appointment with appointment id
    router.put("/:id", masterModules.update);
  
    // Delete a  appointment with appointment id
    router.delete("/:id", masterModules.delete);
   
  // ------------------------- Clinic Based Apis -----------------------------------------------//
  
    app.use("/api/masterModules", router);
  };
  