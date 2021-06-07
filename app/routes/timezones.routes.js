module.exports = app => {
    const Timezones = require("../controllers/timezone.controller");
    const VerifyToken = require('../config/verifyToken');
    var router = require("express").Router();
  
    router.all('*',VerifyToken);
    // Retrieve all Master Modules
    router.get("/",  Timezones.findAll);
  
  
    app.use('/api/Timezones', router);
  };
  