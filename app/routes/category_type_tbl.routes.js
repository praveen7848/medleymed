module.exports = app => {
  const CategoryType = require("../controllers/category_type_tbl.controller.js");
  var router = require("express").Router();
  const VerifyToken = require('../config/verifyToken');
  router.all('*',VerifyToken);

// ------------------------- Admin Apis -----------------------------------------------// 
  // Create a new category type
  router.post("/",  CategoryType.create);

  // Retrieve all category type
  router.get("/",  CategoryType.findAll);

  // Retrieve a single category type with categoryId
  router.get("/:categoryId",  CategoryType.findOne);

  // Update a category type with categoryId
  router.put("/:id",  CategoryType.update);

  // Delete a category type with categoryId
  router.delete("/:id",  CategoryType.delete);


// ------------------------- Clinic Based Apis -----------------------------------------------//
  
  app.use('/api/CategoryType', router);
};