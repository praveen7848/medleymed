module.exports = (app) => {
  const productRequest = require("../../controllers/OM/product_request_tbl.controller");
  var router = require("express").Router();
  const VerifyToken = require("../../config/verifyToken");
  router.all("*", VerifyToken);
  // create new  delivery address
  router.post("/", productRequest.create);
  // Retrieve all  delivery addresses
  router.get("/", productRequest.findAll);
  // Retrieve a single delivery addres with id
  router.get("/:id", productRequest.findOne);
  // Update a delivery addres with id
  router.put("/:id", productRequest.updateProductRequest);
  router.put("/productReqStatusUpdate/:id", productRequest.productReqStatusUpdate);
  // Delete a delivery addres with id
  router.delete("/:id", productRequest.delete);

  app.use("/api/OM/productRequest", router);
};
