module.exports = app => {
  const Assessments = require("../controllers/assessments.controller.js");
  const VerifyToken = require('../config/verifyToken');

  var router = require("express").Router();
  router.all('*',VerifyToken);
  // Create a new category
  router.post("/",  Assessments.create);

  // Retrieve all Assessments
  router.get("/",  Assessments.findAll);

  // Retrieve all Details by Group
  router.get("/groupDetails",  Assessments.groupDetails);

  // Retrieve a single Assessment with id
  router.get("/getAssessmentCount",  Assessments.getAssessmentCount);

  // Retrieve a single Assessment with id
  router.get("/:id",  Assessments.findOne);

  // Update a Assessment with id
  router.put("/:id", Assessments.update);

  // Delete a Assessment with id
  router.delete("/:id",  Assessments.delete);

  // Create a new Assessment
  router.delete("/",  Assessments.deleteAll);

  app.use('/api/Assessments', router);
};
