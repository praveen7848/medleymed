module.exports = app => {
    const masterrealtionships = require("../controllers/master_relationships.controller");
    const VerifyToken = require('../config/verifyToken');
    var router = require("express").Router();
    // Retrieve all Master Modules
    router.get("/",  masterrealtionships.findAll);
  
    // router.all('*',VerifyToken);
    // create new record
    router.post("/",  masterrealtionships.create);
   // Retrieve a single Master Module with id
    router.get("/:id", masterrealtionships.findOne);

    // Update a Master Module with id
    router.put("/:id", masterrealtionships.update);
    // Delete a Master Module with id
    router.delete("/:id", masterrealtionships.delete);
  
    app.use('/api/masterrealtionships', router);
  };
  