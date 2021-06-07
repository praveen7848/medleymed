module.exports = app => {
    const Council = require("../controllers/council_tbl_controller");    
    var router = require("express").Router();
    const VerifyToken = require('../config/verifyToken');
    router.all('*',VerifyToken);
  // ------------------------- Admin Apis -----------------------------------------------//    
    // Retrieve all Master Modules
    router.get("/",  Council.findAll);
    // create new record
    router.post("/",  Council.create);
   // Retrieve a single Master Module with id
    router.get("/:id", Council.findOne);

    // Update a Master Module with id
    router.put("/:id", Council.update);
    // Delete a Master Module with id
    router.delete("/:id", Council.delete);
  
    // ------------------------- Clinic Based Apis -----------------------------------------------//

    app.use('/api/Council', router);
  };
  