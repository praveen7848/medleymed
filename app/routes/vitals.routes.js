module.exports = app => {
    const Vitals = require("../controllers/vitals.controller");
    var router = require("express").Router();
    const VerifyToken = require('../config/verifyToken');
  	router.all('*',VerifyToken);
  // ------------------------- Admin Based Apis -----------------------------------------------//
    router.get("/",  Vitals.findAll);
    // create new record
    router.post("/",  Vitals.create);
   // Retrieve a single Master Module with id
    router.get("/:id", Vitals.findOne);
    // Update a Master Module with id
    router.put("/:id", Vitals.update);
    // Delete a Master Module with id
    router.delete("/:id", Vitals.delete);
 // ------------------------- Clinic Based Apis -----------------------------------------------//  
    app.use('/api/Vitals', router);
  };
  