module.exports = (app) => {
  const retailer_tbl = require("../controllers/retailer_registration_tbl.controller");
  const VerifyToken = require("../config/verifyToken");

  var router = require("express").Router();
  //router.all('*',VerifyToken);

  // Retrieve all Retailer
  router.get("/", retailer_tbl.findAll);

  // Create a new Retailer
  router.post("/", retailer_tbl.create);

  // Retrieve a single Retailer with id
  router.get("/:id", retailer_tbl.findOne);

  // Update a appointment with appointment id
  router.put("/:id", retailer_tbl.update);

  // Delete a appointment with appointment id
  router.delete("/:id", retailer_tbl.delete);

  // Update a appointment with appointment id
  router.put("/taxUpdate/:id", retailer_tbl.taxupdate);

  //orderDiscountSlabUpdate Update a appointment with appointment id
  router.put("/orderDiscountSlabUpdate/:id",retailer_tbl.orderDiscountSlabUpdate);

  //setdeliverycharges Update a appointment with appointment id
  router.put("/setDeliveryChargesUpdate/:id",retailer_tbl.setDeliveryChargesUpdate);

  //set delivery Date update based on retailer Id
  router.put("/SetOrderDeliveryDate/:retailerId",retailer_tbl.SetOrderDeliveryDate);

  app.use("/api/retailer", router);
};
