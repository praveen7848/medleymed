module.exports = app => {
   const Doctor_rating = require('../controllers/doctor_rating.controller');
   const VerifyToken = require('../config/verifyToken');

   var router = require('express').Router();

   //router.all('*',VerifyToken);

   // Retrieve all Doctor rating
   router.get("/", Doctor_rating.findAll);

   // Create a new Doctor rating
   router.post("/create", Doctor_rating.create);

   // Retrieve a single Doctor rating with id
   router.get("/:id", Doctor_rating.findOne);

   // Update a Doctor rating with id
   router.put("/:id", Doctor_rating.update);

   // Delete a Doctor rating with id
   router.delete("/:id", Doctor_rating.delete);

   app.use('/api/Doctorrating', router);
}