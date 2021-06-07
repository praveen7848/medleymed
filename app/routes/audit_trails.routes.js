module.exports = app => {
  const AuditTrails = require("../controllers/audit_trails.controller.js");
  const VerifyToken = require('../config/verifyToken');

  var router = require("express").Router();
  router.all('*',VerifyToken);
  // Create a new category
  router.post("/",  AuditTrails.create);

  // Retrieve all AuditTrails
  router.get("/",  AuditTrails.findAll);

  // Retrieve a single Assessment with id
  router.get("/:id",  AuditTrails.findOne);

  // Update a Assessment with id
  router.put("/:id", AuditTrails.update);

  // Delete a Assessment with id
  router.delete("/:id",  AuditTrails.delete);

  // Create a new Assessment
  router.delete("/",  AuditTrails.deleteAll);

  app.use('/api/AuditTrails', router);
};
