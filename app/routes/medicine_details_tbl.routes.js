module.exports = (app) =>{
const MedicineDetails = require('../controllers/medicinedetails_tbl.controller')
var router = require('express').Router();
     
   
  // Retrieve all AuditTrails
  router.get("/",  MedicineDetails.findAll);

  // Medicine search details
  router.get("/MedicineSearchDetails",  MedicineDetails.MedicineSearchDetails);


  // Retrieve a single Assessment with id
  router.get("/:id",  MedicineDetails.findOne);

  // Update a Assessment with id
  router.put("/:id", MedicineDetails.update);

  // Delete a Assessment with id
  router.delete("/:id",  MedicineDetails.delete);

  // Create a new Assessment
  router.delete("/",  MedicineDetails.deleteAll);

    app.use('/api/MedicineDetails', router);
    }