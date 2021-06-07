module.exports = (app) => {
  const problem = require("../controllers/problem_tbl.controller.js");
  var router = require("express").Router();
  const VerifyToken = require('../config/verifyToken');
  router.all('*',VerifyToken);
// ------------------------- Admin Based Apis -----------------------------------------------//
  // Create Patient problem data
  router.post("/", problem.create);

  // Create Patient problem data
  router.put("/:id", problem.update);

  router.get("/:id", problem.findOne);

  router.get("/checkIsProfileUpdated/:patientTableId", problem.checkProfileStatus);

 // ------------------------- Clinic Based Apis -----------------------------------------------// 
  // Get Patient problem data
  router.get("/getPatientProblem/:id/:appointment_id/:clinicId",  problem.getProblemDetails);
  
  app.use("/api/problem", router);
};
