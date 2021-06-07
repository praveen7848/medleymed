module.exports = app => {
  const AssessmentReview = require("../controllers/assessments_review.controller.js");
  const VerifyToken = require('../config/verifyToken');

  var router = require("express").Router();

  router.all('*',VerifyToken);

  // Create a new category
  router.post("/",  AssessmentReview.create);

  // Retrieve all AssessmentReview
  router.get("/",  AssessmentReview.findAll);

  // Retrieve all AssessmentReview Counts
  router.get("/getAssessmentCount",  AssessmentReview.getAssessmentCount);

  // Retrieve a single Assessment with id
  router.get("/:id",  AssessmentReview.findOne);

  // Attempt an Answer
  router.post("/attemptAnswer",  AssessmentReview.attemptAnswer);

  // Update a Assessment with id
  router.put("/:id",  AssessmentReview.update);

  // Delete a Assessment with id
  router.delete("/:id",  AssessmentReview.delete);

  // Create a new Assessment
  router.delete("/",  AssessmentReview.deleteAll);

  app.use('/api/AssessmentReview', router);
};
