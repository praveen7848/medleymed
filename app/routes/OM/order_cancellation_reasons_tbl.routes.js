module.exports = (app) => {
  const reason = require("../../controllers/OM/order_cancellation_reasons_tbl.controller");
  var router = require("express").Router();
  const VerifyToken = require("../../config/verifyToken");
  router.all("*", VerifyToken);
  // Update a cancellation reason with orderId
  router.post("/orderDetails/:orderId", reason.updateOrderReason);
  // create new  cancellation reason
  router.post("/", reason.create);
  // Retrieve all  cancellation reasones
  router.get("/", reason.findAll);
  // Retrieve a single cancellation reason with id
  router.get("/:id", reason.findOne);
  // Update a cancellation reason with id
  router.put("/:id", reason.updatereason);
  // Delete a cancellation reason with id
  router.delete("/:id", reason.delete)
  app.use("/api/OM/cancellationReason", router);
};
