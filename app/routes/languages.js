module.exports = app => {
  const Languages = require("../controllers/languages_tbl_controller");
  const VerifyToken = require('../config/verifyToken');
  var router = require("express").Router();

  // Retrieve all Master Modules
  router.get("/",  Languages.findAlllanguages);
  // create new record
  router.post("/",  Languages.create);
 // Retrieve a single Master Module with id
  router.get("/:id", Languages.findOne);
  // Retrieve a single Master Module with id
  router.get("/findOneByName/:id", Languages.findOneByName);
  // Update a Master Module with id
  router.put("/:id", Languages.update);
  // Delete a Master Module with id
  router.delete("/:id", Languages.delete);

  app.use('/api/Languages', router);
};
