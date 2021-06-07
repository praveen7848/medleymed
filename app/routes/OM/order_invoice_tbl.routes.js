module.exports = (app) => {
    const orderInvoice = require("../../controllers/OM/order_invoice_tbl.controller");
    var router = require("express").Router();
    // const VerifyToken = require("../config/verifyToken");
  
    // router.all("*", VerifyToken);
  
    // Insert new order invoice of retailer.
    router.post("/", orderInvoice.create);

    //Generate PDF Data for html response..
    router.get("/generatePDF/:retailerId/:orderId", orderInvoice.generateInvoicePDF);

    app.use("/api/OM/orderInvoice", router);
  };
  