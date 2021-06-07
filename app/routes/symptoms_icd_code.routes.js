module.exports = (app) => {
  const Symptoms = require("../controllers/symptoms_icd_code.controller");
  const VerifyToken = require("../config/verifyToken");
  var router = require("express").Router();

  // router.all('*', VerifyToken);

  // Retrieve all Master Modules
  router.get("/", Symptoms.findAll);

  // Search Symptoms By Body Part
  router.post("/getSymptomsICDListBodyPart", Symptoms.byBodyPart);

  // Search Symptoms By Name
  router.post("/getSymptomsICDList", Symptoms.getByName);

  //Body part Names
  router.get("/getBodypartList", Symptoms.getBodyPartName);

  app.use("/api/Symptoms", router);
};
