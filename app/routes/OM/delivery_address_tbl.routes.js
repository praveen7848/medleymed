module.exports = (app) => {
  const deliveryAddress = require("../../controllers/OM/delivery_address_tbl.controller");
  var router = require("express").Router();
   const VerifyToken = require("../../config/verifyToken");

   router.all("*", VerifyToken);

  // create new  delivery address
  router.post("/", deliveryAddress.create);

  // Retrieve all  delivery addresses
  router.get("/", deliveryAddress.findAll);

  // Retrieve all  delivery addresses
  router.get("/findAllDeliveryAddress/:id",  deliveryAddress.findAllDeliveryAddress);

  // Retrieve a single delivery addres with id
  router.get("/:id",  deliveryAddress.findOne);

  // Update a delivery addres with id
  router.put("/:id", deliveryAddress.updateDeliveryAddress);

  // Delete a delivery addres with id
  router.delete("/:id", deliveryAddress.delete);

  // Default delivery addres with id
  router.put("/:patientId/:rowId",  deliveryAddress.setDefaultAddress);

  app.use("/api/OM/deliveryAddress", router);
};
