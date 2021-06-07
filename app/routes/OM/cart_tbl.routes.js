module.exports = (app) => {
  const cartTbl = require("../../controllers/OM/cart_tbl.controller");
  var router = require("express").Router();

  // create new  Cart Details
  router.post("/", cartTbl.createNew);

  // create new  Cart Details
  // router.post("/new", cartTbl.createNew);

  // create new  delivery address
  router.put("/:id", cartTbl.updateCartDetails);

  // Retrieve all Cart Details based on Id
  router.get("/findAllCartDetails/:cartId", cartTbl.findAllCartDetails);

  // Retrieve all Cart Details based on PatientId
  router.get("/findAllPatientCartDetails/:patientId", cartTbl.findAllPatientCartDetails);

  // Delete a Cart Details with id
  router.delete("/:id", cartTbl.delete);

  // // Delete a patient cart Details based on patient Id
  // router.delete("/clearPatientCartDetails/:patientId", cartTbl.clearPatientCartDetails);

  // create new  Favorite for patient
  router.post("/favorite", cartTbl.createFavorite);

   // Update the Patient Favorite Details
   router.put("/updateFavorite/:id", cartTbl.updateFavorite);

  // Delete Favorite for patient
  router.delete("/favorite/:id", cartTbl.deleteFavorite);

  // Retrieve all favorite Details based on Id
  router.get("/findAllFavoriteDetails/:patientId", cartTbl.findAllFavoriteDetails);

  // create new  Wish List
  router.post("/wishlist", cartTbl.createWishlist);

  // Retrieve all Wishlist Details based on Patient Id
  router.get("/findAllWishlistDetails/:patientId", cartTbl.findAllWishlistDetails);
  
  // Update the Patient Wishlist Details
  router.put("/updateWishlist/:id", cartTbl.updateWishlist);

  // Delete Wishlist for patient
  router.delete("/wishlist/:id", cartTbl.deleteWishlist);

  // upload Cart Prescription image
  router.post("/prescriptionImage", cartTbl.updateCartPrescriptionImage);

  // delete Cart Prescription image
  router.post("/deletePrescriptionImage", cartTbl.deleteCartPrescriptionImage);

  app.use("/api/OM/Cart", router);
};
