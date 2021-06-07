module.exports = app =>{
    const Doctors = require('../controllers/doctor_tbl.controller')
    var router = require('express').Router();
    const VerifyToken = require("../config/verifyToken");
   // ------------------------- Admin Apis -----------------------------------------------//  
   // Retrieve all  Doctors
    router.get("/getAllDoctors", VerifyToken, Doctors.findAll);
    router.get("/getAllDoctors/:id", VerifyToken, Doctors.findOne);    
    router.get("/DoctorProfiler/:id", VerifyToken, Doctors.DoctorProfiler);
    router.put("/Doctoravailable/:id", VerifyToken, Doctors.IsDoctoravailable);
    router.get("/DoctorIsavailablecheck/:id", VerifyToken, Doctors.DoctorIsavailablecheck);
    router.post("/getAllDoctoravailablefilter", Doctors.getAllDoctoravailablefilter);
    router.post("/searchParameters", VerifyToken, Doctors.searchDoctorParameters);   
    //router.post("/",  Doctors.create);
    router.post("/DoctorIsavailablefilters", VerifyToken, Doctors.DoctorIsavailablefilter);
    router.put("/uploadimage/:id", VerifyToken, Doctors.uploaddoctorimage);
    //upload doctor signature pic
    router.put("/uploaddoctorsignature/:id", VerifyToken, Doctors.uploaddoctorsignature);
    // Update a Doctors with id
    router.put("/:id", VerifyToken, Doctors.update);
    // Delete a Doctors with id
    router.delete("/:id", VerifyToken, Doctors.delete);
    // ------------------------- Clinic Based Apis -----------------------------------------------//
    router.get("/:clinicId",  Doctors.clinicidfindAll);
    //router.post("/DoctorIsavailablefilters/:clinicId", Doctors.DoctorIsavailablefilter);
    app.use('/api/Doctor', router);
    }