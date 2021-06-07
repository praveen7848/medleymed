module.exports = app =>{
    const Patientaddress = require('../controllers/patient_address.contoller')
    var router = require('express').Router();
    const VerifyToken = require('../config/verifyToken');
     
	router.all('*',VerifyToken);

    // create new  patinet address
    router.post("/",  Patientaddress.create);

    // Retrieve all  patient addresses
    router.get("/",  Patientaddress.findAll);
   
    // Retrieve all  patient addressesbypatient
    router.get("/findalladdressbypatient/:id",  Patientaddress.findalladdressbypatient);

   // Retrieve a single patinet addres with id
    router.get("/:id", Patientaddress.findOne);
  
    // Update a patinet addres with id
    router.put("/:id", Patientaddress.update);

    // update default status of patient address
    router.put("/updateaddressdefault/:pid/:id", Patientaddress.updateaddressdefault);

    // Delete a patinet addres with id
    router.delete("/:id", Patientaddress.delete);
  
    app.use('/api/Patientaddress', router);
    }