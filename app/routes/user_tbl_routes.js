module.exports = (app) => {
  const Users = require("../controllers/user_tbl_controller");
  var router = require("express").Router();
const VerifyToken = require('../config/verifyToken');

  // ------------------------- Admin Based Apis -----------------------------------------------//
  // Create a new User
  router.post("/", Users.create);
  // Login
  router.post("/login", Users.login);
  // Login Admin
  router.post("/loginAdmin", Users.loginAdmin);
  // Find All Users
  router.get("/",  Users.findAll);
  // Forget Password
  router.post("/forgetPassword", Users.forgetPassword);
  // Retrieve all Responders
 // router.get("/",  Users.findAll);
  // Retrieve a single Responder with id
  // Resend OTP Code
  router.get("/resendCode/:id", Users.resendCode);
  // Retrieve a single Responder with id
  //for testing
  router.get("/twillotoken", Users.twiliovideo);
  // Find a User
  router.get("/:id", Users.findOne);
  // Update a Responder with id
  router.put("/:id", Users.update);
  // Delete a Responder with id
  router.delete("/:id", Users.delete);
  // Delete all Users
  router.delete("/", Users.deleteAll);
  // Image Upload
  //	router.post('/uploadimages', Users.uploadImages);
  router.put("/uploadimages/:id", Users.uploadImages);
  // Image Upload Postman
  router.post("/postimageupload", Users.PostManuploadimage);
  // Language
  router.post("/language/:lantype", Users.language);
  // Token checked on user
  router.post("/checkToken", Users.checkToken);
  // ######################################## //
  //	router.all('*',VerifyToken);
  // ######################################## //
  // Retrieve a single Patient with id
  router.get("/Patient/:id", Users.PatientByIdfindOne);
  // Update a Patient with id
  router.put("/UpdatePatient/:id", Users.updatePatient);
  router.post("/checkOTP/:id", Users.checkOTP);
  router.put("/uploadAdminImages/:type/:id", Users.uploadAdminImages);
   // Resend OTP Code
   router.get("/resendOTP/:id", Users.resendOTP);
  router.get("/logout/:id", Users.logout);
  // ------------------------- Clinic Based Apis -----------------------------------------------//
  app.use("/api/Users", router);
};
