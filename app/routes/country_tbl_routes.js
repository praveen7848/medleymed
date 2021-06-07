module.exports = (app) => {
  const Countries = require("../controllers/country_tbl_controller");
  var router = require("express").Router();
  const VerifyToken = require('../config/verifyToken'); 
  router.all('*', VerifyToken);
  // Retrieve all Master Modules
  router.get("/", Countries.findAll);
  // Retrieve all timezones
  router.get("/timezoneList", Countries.getCompleteTimezones);
  // Retrieve all States
  router.get("/states/:countryId", Countries.getStatesBasedCountry);
  // Retrieve all cities
  router.get("/cities/:stateId", Countries.getCitiesBasedState);
  // create new record
  router.post("/", Countries.create);
  // Retrieve a single Master Module with id
  router.get("/:id", Countries.findOne);

  // Update a Master Module with id
  router.put("/:id", Countries.update);
  // Delete a Master Module with id
  router.delete("/:id", Countries.delete);

  app.use("/api/Country", router);
};
