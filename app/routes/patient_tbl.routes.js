const { patient_relative_history } = require("../models/index.js");
module.exports = (app) => {
  const Patient = require("../controllers/patient_tbl.controller.js");
  var router = require("express").Router();
  const VerifyToken = require('../config/verifyToken');
  //router.all('*',VerifyToken);
  // Retrieve all Patients for web
  router.get("/findPatientName", VerifyToken, Patient.findAllPatientsRecords);

  // Retrieve all Patients
  router.get("/", VerifyToken, Patient.findAll);
  // Create Patients data and user data
  router.post("/", VerifyToken, Patient.create);

  // Retrieve a single Patient with id
  router.get("/:id", VerifyToken, Patient.findOne);

  // Retrieve a single Patient with id
  router.post("/checkphonenumber", VerifyToken, Patient.chcekpatientmobile);

  // Update a Patient with id
  router.put("/:id", VerifyToken, Patient.update);

  router.get("/findpatientrealtives/:id", VerifyToken, Patient.findpatientrealtives);

  router.put("/updatepatient/:id", VerifyToken, Patient.updatepatient);

  // Delete a Patient with id
  router.delete("/:id", VerifyToken, Patient.delete);

  // Retrieve a single Patient Medical Records with id
  router.post("/getMedicalDetails", VerifyToken, Patient.getMedicalRecordDetail);

  router.put("/Profileimage/:id", VerifyToken, Patient.Profileimage);

  router.put("/updatePatientProfile/:patientId", VerifyToken, Patient.updatePatientProfile);

  app.use("/api/Patients", router);
};
