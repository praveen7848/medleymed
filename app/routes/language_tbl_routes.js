module.exports = app => {
  const Languages = require("../controllers/languages_tbl_controller");
  var router = require("express").Router();
  const VerifyToken = require('../config/verifyToken');
// ------------------------- Admin Apis -----------------------------------------------// 
 // Retrieve all Master Modules
 router.get("/",  Languages.findAll);

  router.all('*',VerifyToken);
  // create new record
  router.get("/findname", Languages.findAlllanguages)
  router.post("/",  Languages.create);
  router.post("/myImage/:id",  Languages.myImage);
 // Retrieve a single Master Module with id
  router.get("/:id", Languages.findOne);
  // Search Language By Name
   router.get("/languagesByName",  Languages.findOneByName);
  // Update a Master Module with id
  router.put("/:id", Languages.update);
  // Delete a Master Module with id
  router.delete("/:id", Languages.delete);


// ------------------------- Clinic Based Apis -----------------------------------------------//

  app.use('/api/Languages', router);
};
