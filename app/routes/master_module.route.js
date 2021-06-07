module.exports = app => {
  const Mastermodule = require("../controllers/master_module.controller");
  const VerifyToken = require('../config/verifyToken');

  var router = require("express").Router();

  //router.all('*',VerifyToken);

  // Retrieve all Master Modules
  router.get("/",  Mastermodule.findAll);

  // create new record
  router.post("/",  Mastermodule.create);

  // Retrieve Count Master Module with id
  router.get("/getModuleCount", Mastermodule.getModuleCount);

  // Retrieve a single Master Module with id
  router.get("/:id", Mastermodule.findOne);

  // Update a Master Module with id
  router.put("/:id", Mastermodule.update);

  // Delete a Master Module with id
  router.delete("/:id", Mastermodule.delete);

  app.use('/api/Mastermodule', router);
};
