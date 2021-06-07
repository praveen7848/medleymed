module.exports = (app) => {
  const masterRoles = require("../controllers/master_roles_tbl.controller");
  const VerifyToken = require("../config/verifyToken");

  var router = require("express").Router();
  //router.all('*',VerifyToken);

  // Retrieve all  Role
  router.get("/", masterRoles.findAll);

  // Create a new  Role
  router.post("/", masterRoles.create);

  // Retrieve a single  Role with id
   router.get("/:id", masterRoles.findOne);

  // Update a  appointment with appointment id
  router.put("/:id", masterRoles.update);

  // Delete a  appointment with appointment id
  router.delete("/:id", masterRoles.delete);
 

  app.use("/api/masterRoles", router);
};
