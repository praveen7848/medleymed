module.exports = (app) => {
    const masterSubModuleClinicPage = require("../controllers/master_sub_module_clinic_pages_tbl.controller");
    var router = require("express").Router();
    const VerifyToken = require("../config/verifyToken");  
    router.all('*',VerifyToken);  

    // ------------------------- Admin Based Apis -----------------------------------------------//
    // Retrieve all  Role
    router.get("/", masterSubModuleClinicPage.findAll);  
    // Create a new  Role
    router.post("/", masterSubModuleClinicPage.create);  
    // Retrieve a single  Role with id
     router.get("/:id", masterSubModuleClinicPage.findOne);  
    // Update a  appointment with appointment id
    router.put("/:id", masterSubModuleClinicPage.update);  
    // Delete a  appointment with appointment id
    router.delete("/:id", masterSubModuleClinicPage.delete);



// ------------------------- Clinic Based Apis -----------------------------------------------//  

    app.use("/api/masterSubModuleClinicPage", router);
  };
  