module.exports = (app) => {
  const Symptoms = require("../controllers/symptoms_tbl.controller");
  const VerifyToken = require("../config/verifyToken");
  var router = require("express").Router();
  router.all('*', VerifyToken);
  // Retrieve all PatientAppointment
  //  router.get("/getInformedicaSymptoms", Symptoms.getInformedicaDetails);

 // ------------------------- Admin Based Apis -----------------------------------------------//

  // GET a Patient appointment final Diagnosis
  router.get("/getPatientLabTest/:appointmentid",Symptoms.getPatientAppointmentLabTest);
  // save Symptoms
  router.post("/", Symptoms.create);
  // save Symptoms
  router.put("/:id", Symptoms.update);
  router.get("/:id/:appointment_id/:clinicId", Symptoms.findOne);
  // get Symptom by uniqId
  // router.get("/getSymptomsById", Symptoms.getDetails);
  // Create a Patient appointmentlab test Details
  router.put("/updatePatientLabTest/:appointmentid",Symptoms.updatePatientAppointmentLabTest);


 // ------------------------- Clinic Based Apis -----------------------------------------------//
 
 

  app.use("/api/Symptoms", router);
};
