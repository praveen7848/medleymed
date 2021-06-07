module.exports = (app) => {
  const telemedicine = require("../controllers/telemedicine_schedule_tbl.controller");
  var router = require("express").Router();
  const VerifyToken = require('../config/verifyToken');
  router.all('*', VerifyToken);

  // get the Created Slots Doctor Names
  router.get("/getDoctorsSlotListDetails",telemedicine.getDoctorsSlotListDetails);
  // save Create Telemedicine Slots
  router.post("/createDoctorSlots", telemedicine.create);
  router.get("/fetchSingleSlot", telemedicine.findSingleSlot);

  // Fetch Doctor Slots - Single Slots
  router.get("/fetchDoctorSlots", telemedicine.fetchslots);
  // Fetch All Slots - Single / Multiple
  router.get("/getSlots", telemedicine.getSlots);
  router.post("/patientAppointmentSlots", telemedicine.findpatientslots);
  // Fetch Doctor Slo
  router.delete("/deleteAllScheduledSlots/:doctorId", telemedicine.deleteAll);
  //update appointment created Slots
  router.post("/updatePatientAppointmentSlots",telemedicine.updatePatientSigleAppointmentSlot);

  //Fetch Doctor Appointment Slots
  router.post("/fetchDoctorAppointmentSlots",telemedicine.fetchDoctorAppointmentSlots);

  //Doctor Appointment Activate and Deactivate Slots
  router.post("/doctorActivateDeactivateAppointmentSlots",telemedicine.doctorActivateDeactivateAppointmentSlots);

  // Doctor Appointment Date
  router.get("/:id", telemedicine.findOne);

  router.get("/getCalendarDates/:doctor_id", telemedicine.getCalendarDates);

  router.post("/getCreatedDoctorSlots", telemedicine.getCreatedDoctorSlots);

  app.use("/api/telemedicine", router);
};
