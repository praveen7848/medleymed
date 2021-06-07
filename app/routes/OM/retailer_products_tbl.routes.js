module.exports = (app) => {
  const retailerProductTbl = require("../../controllers/OM/retailer_product_tbl.controller");
  var router = require("express").Router();
  const VerifyToken = require("../../config/verifyToken");
  router.all("*", VerifyToken);

  //order ALL Shortage Book
  router.post("/shortageBook/orderAll/retailer", retailerProductTbl.orderAllRetailerShortageBookItems);

  // Delete All Shortage book and Final order Records based on retailer id
  router.delete("/deleteAllShortageBookFinalOrder/:retailerId", retailerProductTbl.deleteAllShortageBookFinalOrder);

  //Get Stock Details
  router.get("/stock/:rowId", retailerProductTbl.getStock);

  // create new  Product Stock
  router.post("/", retailerProductTbl.create);

  // create new  Stock of Product
  router.post("/stock", retailerProductTbl.createStock);

  //Update Stock Details
  router.put("/stock/:id", retailerProductTbl.updateStock);

  // Delete medicine Id Product in all tables
  router.delete("/:retailerId/:medicineId/:rowId", retailerProductTbl.deleteProductStock);

  // Retrieve all MMSKU Details
  router.get("/:medicineId", retailerProductTbl.findAllDetails);

  // Retrieve all Products Details
  router.get("/", retailerProductTbl.retailerProductDetails);

  // Retrieve all Products Details Based on Retailer
  router.get("/retailer/:retailerId", retailerProductTbl.retailerWiseProductDetails);

  // Retrieve all Products with minimum
  router.get("/retailer/lowStock/:retailerId", retailerProductTbl.retailerWiseLowStockDetails);

  // Retrieve all expiry Products
  router.get("/retailer/expiryStock/:retailerId", retailerProductTbl.retailerWiseExpiryStockDetails);

  // Retrieve all Empty Products
  router.get("/retailer/emptyStock/:retailerId", retailerProductTbl.retailerWiseEmptyStockDetails);

  // Retrieve all Products Search Details Based on Retailer
  router.post("/search", retailerProductTbl.retailerStockSearchDetails);

  // Retailer Master Table Medicine Search with Keyword
  router.get("/medicine/:search_medicine", retailerProductTbl.medicineSearchDetails);


  // Retailer Product and Stock table with Excel Data..
  router.post("/uploadProductStockExcelData", retailerProductTbl.uploadProductStockExcelData);


  // .............. Shortage Book ...............................

  // create new Shortage Stock
  router.post("/retailer/shortageBook", retailerProductTbl.createShortageBook);

  // Update Shortage Stock
  router.put("/retailer/shortageBook/:rowId", retailerProductTbl.updateShortageBook);

  // Get Shortage Stock
  router.get("/retailer/shortageBook/:rowId", retailerProductTbl.getShortageBook);

  // Get Retailer Shortage Stock
  router.get("/shortageBook/retailer/:retailerId", retailerProductTbl.getRetailerShortageBook);

  // Delete Retailer Shortage Stock
  router.delete("/retailer/shortageBook/:retailerId/:medicineId", retailerProductTbl.deleteShortageBookFinalorderRow);

  // Delete All Retailer Shortage Stock
  router.delete("/shortageBook/retailer/:retailerId", retailerProductTbl.deleteAllRetailerShortageBook);

  // .............. Ends ........................................


  // ...............Final Ordedr ..................

  // create new Final Order
  router.post("/retailer/finalorder", retailerProductTbl.createFinalOrder);

  // Get Retailer Final Order
  router.get("/retailer/finalorder/:retailerId", retailerProductTbl.getRetailerFinalOrder);

  // Ends .........................................
  

  // Get Retailer Dashboard Count
  router.get("/dashboardStockDetails/:retailerId", retailerProductTbl.getRetailerDashboardDetails);

  // Get the medicine Batch Details
  router.get("/getBatchDetails/:retailerId/:medicineId", retailerProductTbl.getMedicineBatchDetails);

  app.use("/api/OM/retailerProduct", router);
};
