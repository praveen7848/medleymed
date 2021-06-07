module.exports = app => {
  const MasterConfigurations = require("../controllers/master_configurations_controller");
  const VerifyToken = require('../config/verifyToken');
  var router = require("express").Router();
  router.get("/finddefaultsettings",MasterConfigurations.finddefaultsettings);
  router.get("/",  MasterConfigurations.findAll);
    router.all('*',VerifyToken);

	// Retrieve all Master Modules
	router.get("/",  MasterConfigurations.findAll);

	// create new record
	router.post("/",  MasterConfigurations.create);

	// Retrieve a single Master Module with id
	router.get("/:id", MasterConfigurations.findOne);

	// Default settings 
	router.get("/finddefaultsettings", MasterConfigurations.finddefaultsettings
	);

	// Update a Master Module with id
	router.put("/:id", MasterConfigurations.update);

	// Delete a Master Module with id
	router.delete("/:id", MasterConfigurations.delete);

	app.use('/api/MasterConfigurations', router);
};
