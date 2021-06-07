module.exports = (app) => {
    const masterSubModulePage = require("../controllers/master_sub_module_pages_tbl.controller");
    var router = require("express").Router();
    const VerifyToken = require("../config/verifyToken"); 
    router.all('*',VerifyToken);

// ------------------------- Admin Based Apis -----------------------------------------------//

    // Retrieve Master Table Id Sequence Id
    router.get("/getSequenceId/:masterPageModuleName", masterSubModulePage.retreiveSequenceId);  
    // Retrieve all  Role
    router.get("/", masterSubModulePage.findAll);  
    // Create a new  Role
    router.post("/", masterSubModulePage.create);  
    // Retrieve a single  Role with id
     router.get("/:id", masterSubModulePage.findOne);  
    // Update a  appointment with appointment id
    router.put("/:id", masterSubModulePage.update);  
    // Delete a  appointment with appointment id
    router.delete("/:id", masterSubModulePage.delete);

// ------------------------- Clinic Based Apis -----------------------------------------------//    
     
    app.use("/api/masterSubModulePage", router);
  };
  