module.exports = (app) => {
    const masterSubModule = require("../controllers/master_sub_module_tbl.controller");
    var router = require("express").Router();
    const VerifyToken = require("../config/verifyToken"); 
    router.all('*',VerifyToken);

// ------------------------- Admin Based Apis -----------------------------------------------//  
    // Retrieve all  Role
    router.get("/", masterSubModule.findAll);
    // Retrieve Master Table Id Sequence Id
    router.get("/getSequenceId/:masterModuleId", masterSubModule.retreiveSequenceId);  
    // Create a new  Role
    router.post("/", masterSubModule.create);  
    // Retrieve a single  Role with id
     router.get("/:id", masterSubModule.findOne);  
    // Update a  appointment with appointment id
    router.put("/:id", masterSubModule.update);  
    // Delete a  appointment with appointment id
    router.delete("/:id", masterSubModule.delete);


// ------------------------- Clinic Based Apis -----------------------------------------------//
    
  
    app.use("/api/masterSubModule", router);
  };
  