module.exports = (app) => {
  const orderProcessTbl = require("../../controllers/OM/order_processing_tbl.controller");
  const retailerAdmin = require("../../controllers/OM/retailer_admin_tbl.controller");
  var router = require("express").Router();
   //- verify token validate ---   
  const VerifyToken = require('../../config/verifyToken');
  router.all('*', VerifyToken);  
  // create new  Cart Details
  router.post("/",  orderProcessTbl.createNew);
  // Retrieve all Order Details based on Retailer
  router.post("/retailerOrders",  orderProcessTbl.retailerOrders);
   // Retrieve all Order Details based on Retailer
   router.post("/retailerOrdersSearch", orderProcessTbl.retailerOrdersSearch);
  // Update the Patient Favorite Details
  router.put("/retailerOrderStatus/:orderId",  orderProcessTbl.updateOrderStatus);
  // Retrieve all retailer order process details based on retailer id
  router.get("/getOrderDashboardDetails/:retailerId",orderProcessTbl.getOrderDashboardDetails);
  // Retrieve all retailer order details
  router.get("/getOrderDetails/:retailerId/:orderId", orderProcessTbl.getOrderDetails);
  // Approve Order Details from retailer
  // router.post("/approveOrder",orderProcessTbl.approveOrderDetails);
  // status update email/sms to patient/user
  router.post("/updateOrderStatus",orderProcessTbl.updateOrderStatusInfo);
  // Retrieve all Patient order details
  router.get("/getPatientOrderDetails/:patientId",orderProcessTbl.getPatientOrderDetails);  
  // Retreive all last ordered Items
  router.get("/lastOrderDetails",orderProcessTbl.lastOrderDetails);
// ******************** Retailer Admin *****************/
// Retrieve all retailer order process details based on retailer id
router.post("/getAdminOrderDashboardCount",retailerAdmin.getAdminOrderDashboardCount);
  // Retrieve all admin order Details
  router.post("/getAdminOrderDashboardDetails",retailerAdmin.getAdminOrderDashboardDetails);
  // Retrieve Order Related Complete Detail
  router.get("/getAdminOrderDetail/:orderId",retailerAdmin.getAdminOrderDetail);
// ******************** Ends here      *****************/

  
  app.use("/api/OM/orderProcess", router);
};
