module.exports = (app) => {
  const Category = require("../controllers/category_tbl.controller.js");
  var router = require("express").Router();
  const VerifyToken = require("../config/verifyToken");

  router.get("/:clinicId", Category.clinicidAll);

  router.get("/Findall", Category.clinicidAll);

  router.all("*", VerifyToken);
  // ------------------------- Admin Apis -----------------------------------------------//
  // Create a new category
  router.post("/", Category.create);
  router.get("/", Category.findAll);
  // Retrieve a single category with categoryId
  router.get("/Findone/:Id", Category.findOnePrimary);
  router.delete("/:id", Category.delete);
  // ------------------------- Clinic Based Apis -----------------------------------------------//
  router.get("/:categoryId/:clinicId", Category.findOne);
  router.put("/:id/:clinicId", Category.update);
  router.post("/myImage/:id", Category.myImage);
  router.post("/myImage", Category.CreateCategory);
  app.use("/api/Category", router);
};
