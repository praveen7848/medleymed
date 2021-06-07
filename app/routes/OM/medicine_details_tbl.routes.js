module.exports = (app) => {
  const MedicineDetails = require("../../controllers/OM/medicinedetails_tbl.controller");
  var router = require("express").Router();

  // ------------------------- Admin Based Apis -----------------------------------------------//

  //Retrieve all AuditTrails
  // router.get("/",  MedicineDetails.findAll);
  // Medicine search details
  router.post("/MedicineSearchDetails", MedicineDetails.MedicineSearchDetails);
  // Retrieve a single Assessment with id
  // router.get("/:id",  MedicineDetails.findOne);
  // Update a Assessment with id
  // router.put("/:id", MedicineDetails.update);
  // Delete a Assessment with id
  // router.delete("/:id",  MedicineDetails.delete);
  // Create a new Assessment
  // router.delete("/",  MedicineDetails.deleteAll);

  router.get("/patientLastOrderDetails/:patientId", MedicineDetails.patientLastOrderDetails);
  router.get("/getManufacturerDetails", MedicineDetails.getManufacturerDetails);
  router.get("/getFormDetails", MedicineDetails.getFormDetails);
  router.get("/getMostOrderedMedicines",MedicineDetails.getMostOrderedMedicines);
  router.post("/getSearchFromProductMaster",MedicineDetails.getSearchFromProductMaster);

  // ------------------------- Clinic Based Apis -----------------------------------------------//

  app.use("/api/OM/MedicineDetails", router);
};
