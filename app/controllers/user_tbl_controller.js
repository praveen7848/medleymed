const db = require("../models");
const Sequelize = require("sequelize");
const jwt = require("jsonwebtoken");
const passport = require("passport");
const multer = require("multer");
var fs = require("fs");
var base64Img = require("base64-img");
const Users = db.users_tbl;
const Pages = db.tbl_pages;
const Usertimezone = db.tbl_user_timezone;
const Patient = db.patient_tbl;
const Doctor = db.doctor_tbl;
const Category = db.category_tbl;
const Op = Sequelize.Op;
const AuditTrail = db.audit_trails;
const Retailer = db.retailer_registration_tbl;
const moment = require("moment");
require("../config/passport")(passport);
var dbConfig = require("../config/db.config");
var encryption = require("../helpers/Encryption");
const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

var base64Img = require("base64-img");
const nodemailer = require('nodemailer');
const SendEmail = require("../helpers/Email");
const patientEmail = require("../helpers/Email");
// Create a Language Name
exports.create = (req, res) => {
  // return
  if (!req.body) {
    res.status(400).send({ message: "Content cannot be empty" });
  } 
  else {
    var randomNumber = Math.floor(1000 + Math.random() * 9000);
    var dt = new Date();
    var newTime = dt.setMinutes(dt.getMinutes() + 10);
    // Create a User
    //console.log(req.body);
    // return;
    if(req.body.user_type =="doctor")
    {
      var password = req.body.password;
    }
    else{ var password = "Admin@123"; }
    const userVal = {
      mobile_number: req.body.mobile_number,
      email: req.body.email,
      username: req.body.email,
      name: req.body.name,
      password: password,  //"Admin@123",
      clinic_id: req.body.clinic_id,
      user_type: req.body.user_type, // Provider / Patient / Responder / Admin / Organization Admin
      selected_language: req.body.selected_language,
      is_fingerprint_required: req.body.is_fingerprint_required,
      otp: randomNumber,
      otp_expiry: newTime,
      device_registration_id: req.body.device_registration_id
        ? req.body.device_registration_id
        : "",
      mac_id: req.ip ? req.ip : "",
      status: 0,
    };
    //  console.log(userVal);
    const checkEmail = encryption.encryptData(req.body.email);
    const checkPhone = encryption.encryptData(req.body.mobile_number);
    Users.count({
      where: {
        [Op.or]: [{ email: checkEmail }, { mobile_number: checkPhone }],
      },
    }).then((count) => {
      if (count > 0) {
        res.status(200).send({
          status: 204,
          error: true,
          message: "Email or Mobile Number already assosiated with us...",
          data: "",
        });
      } else {
        Users.create(userVal)
          .then((data) => {
            // Create a Patient
            if (data.user_type == "patient") {
              //this.createnewpatient(data.id,req.body,res);
              // SEND MAIL
             // console.log(data.user_type);
              // return
              userTypeVal = {
                user_id: data.id,
                name: req.body.name,
                phone_number: req.body.mobile_number,
              };
             // console.log(userTypeVal);

              Patient.create(userTypeVal)
                .then((response) => {
                  // console.log(response);
                  // const msg = {
                  //   to: data.email,
                  //   from: "support@medleymed.com",
                  //   subject:
                  //     "MedleyMed Notification: Welcome to MedleyMed",
                  //   html:
                  //     "Dear " +
                  //     data.name +
                  //     ",<br /><br /> Thanks for registering with MedleyMed 2.0. Please verify your account using OTP - <strong>" +
                  //     randomNumber +
                  //     "</strong>.<br /><br />Note: The OTP will be expired in 10 minutes.<br /><br /> Regards,<br />Team MedleyMed 2.0",
                  // };
                  // sgMail.send(msg).then(
                  //   () => {},
                  //   (error) => {
                  //     console.error(error);
                  //     if (error.response) {
                  //       console.error(error.response.body);
                  //     }
                  //   }
                  // );
                  patientMessageBody =  "Dear " + data.name +",<br /><br /> Thanks for registering with MedleyMed. Please verify your account using OTP - <strong>" +
                    randomNumber + "</strong>.<br /><br />Note: The OTP will be expired in 10 minutes.<br /><br /> Regards,<br />Team MedleyMed";
                    var email = patientEmail.sendEmailPassword(
                      data.email,
                      "MedleyMed Notification: Welcome to MedleyMed",
                      patientMessageBody
                    );
                  // SEND MAIL
                  res.status(200).send({
                    status: 200,
                    error: false,
                    message: "User created successfully.",
                    data: {
                      id: data.id,
                      otp: randomNumber,
                      otp_expiry: newTime,
                    },
                  });
                  //  res.send(userTypeData);
                  // const auditTrailVal = {
                  //   'user_id' : data.id,
                  //   'trail_type' : req.body.user_type.charAt(0).toUpperCase() + req.body.user_type.slice(1)+' Registration',
                  //   'trail_message' : req.body.first_name+ ' '+ req.body.last_name + ' is registered as '+req.body.user_type.charAt(0).toUpperCase() + req.body.user_type.slice(1),
                  //   'status': 1
                  // }
                  //   AuditTrail.create(auditTrailVal,(err,data)=>{ })
                  // AUDIT TRAIL
                  //     res.send(userTypeData);
                })
                .catch((err) => {
                  console.log(err);
                  res.status(500).send({
                    message:
                      err.errors[0]["message"] ||
                      "Some error occurred while creating the patients",
                  });
                });

              //return
            } 
            else if (data.user_type == "doctor") {
              //  console.log(JSON.stringify(req.body.speciality));

              let profileDetails = "";
              if (req.body.profile_pic && req.body.profile_pic != "") {
                profileDetails = req.body.profile_pic;
                delete req.body["profile_pic"];
              }
            
              let signatureDetails = "";
              if (req.body.signature_pic && req.body.signature_pic != "") {
                signatureDetails = req.body.signature_pic;
                delete req.body["signature_pic"];
              }


              let doctor_create_data = {
                user_id: data.id,
                doctor_name:req.body.name,
                mobile_no:req.body.mobile_number,
                email:req.body.email,
                currency_name:req.body.currency_name,
                currency_symbol:req.body.currency_symbol,
                clinic_id: req.body.clinic_id,
                // speciality: req.body.speciality,
                gender: req.body.gender,
                dob: req.body.dob,
                address: req.body.address,
                city: req.body.city,
                state: req.body.state,
                zip_code: req.body.zip_code,
                lat_long: req.body.lat_long,
                education: req.body.education,
                experience: req.body.experience,
                registraion_no: req.body.registraion_no,
                practice: req.body.practice,
                area_of_expertise: req.body.area_of_expertise,
                fees: req.body.fees,
                commission: req.body.commission,

                languages: req.body.languages,
                languageids: req.body.languageids,

                slot_duration: req.body.slot_duration,
                break_duration: req.body.break_duration,
                status: req.body.status,

                selected_language_id: req.body.selected_language_id,
                selected_language_name: req.body.selected_language_name,

                speciality_id: req.body.speciality_id,
                speciality_name: req.body.speciality_name,

                is_available: req.body.is_available,
              };

              Doctor.create(doctor_create_data).then((response) => {
              const PROFILE_FILE_PATH = "public/uploads/doctor/profile_image";
              const SIGNATURE_FILE_PATH = "public/uploads/doctor/signatures";
           
              if (profileDetails != "") {
                  base64Img.img(profileDetails.base64, PROFILE_FILE_PATH, Date.now(), function (err, filepath) {
                   // console.log("----------", filepath)
                      const pathArr = filepath.split("/");
                      const fileName = pathArr[pathArr.length - 1];

                      const updatefinalName = filepath.replace(/\\/g, '/').split('/');
                      const updatefinalFileName = updatefinalName[4];

                      const profileImageData = "/uploads/doctor/profile_image/" + updatefinalFileName;

                      var options = {where: {id: response.id,},};
                      Doctor.update({profile_pic: profileImageData,},options).then((data) => { });

                    });
                  }
                  
                  if (signatureDetails != "") {
                    base64Img.img(signatureDetails.base64,SIGNATURE_FILE_PATH,Date.now(),function (err, filepath) {

                      const pathArr = filepath.split("/");
                      const fileName = pathArr[pathArr.length - 1];

                      const updatefinalName = filepath.replace(/\\/g, '/').split('/');
                      const updatefinalFileName = updatefinalName[4];

                      const profileImageData = "/uploads/doctor/signatures/" + updatefinalFileName;

                      var options = {where: {id: response.id,},};
                      Doctor.update({signature_pic: profileImageData,},options).then((data) => { });

                    });
                  }

                res.status(200).send({
                  status:200,
                  error:false,
                  message: "Doctor created successfully.",
                });

              });
            }
          })
          .catch((err) => {
            res.status(500).send({
              message:
                err.message || "Some error occurred while retrieving Users.",
            });
            console.log(err.message);
          });
      }
    });
  }
};

// create paitent
exports.createnewpatient = (userid, body, res) => {
  // console.log(body)
  userTypeVal = {
    user_id: userid,
    first_name: body.first_name,
    last_name: body.last_name,
    address: body.address,
    state: body.state,
    zip_code: body.zip_code,
    nationality: body.nationality,
    lat_long: body.lat_long ? body.lat_long : "40.6616098,-74.209133",
    dob: body.dob,
    gender: body.gender,
    //profile_pic: req.body.profile_pic,
    marital_status: body.marital_status,
    occupation: body.occupation,
    adhaar_no: body.adhaar_no,
    arogya_sri_no: body.arogya_sri_no,
    status: 1,
    related_medication: [],
    drug_allergies: [],
  };

  // let geoCoder = nodeGeocoder(geooptions);
  // let resp = geoCoder.geocode(body.address).then((response) => {
  //   if (response.length > 0) {
  //     resp_lat_long = response[0].latitude + "," + response[0].longitude;
  //     userTypeVal.lat_long = resp_lat_long;
  //   } else {
  //     userTypeVal.lat_long = "";
  //   }
  // console.log(userTypeVal)
  Patient.create(userTypeVal)
    .then((userTypeData) => {
      res.send(userTypeData);
      // const auditTrailVal = {
      //   'user_id' : data.id,
      //   'trail_type' : req.body.user_type.charAt(0).toUpperCase() + req.body.user_type.slice(1)+' Registration',
      //   'trail_message' : req.body.first_name+ ' '+ req.body.last_name + ' is registered as '+req.body.user_type.charAt(0).toUpperCase() + req.body.user_type.slice(1),
      //   'status': 1
      // }
      //   AuditTrail.create(auditTrailVal,(err,data)=>{ })
      // AUDIT TRAIL
      //     res.send(userTypeData);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send({
        message:
          err.errors[0]["message"] ||
          "Some error occurred while creating the patients",
      });
    });

  //})
};



// Retrieve all Users
exports.findAll = (req, res, next) => {
  const id = req.query.id;
  var condition = id ? { id: { [Op.eq]: `${id}` } } : null;

  if (req.query.user_type !== undefined) {
    var user_type = req.query.user_type;
    const user_type_val = encryption.encryptData(user_type);
    var condition = user_type
      ? { user_type: { [Op.eq]: `${user_type_val}` } }
      : null;
  }

  Users.hasOne(Patient, { foreignKey: "user_id" });
  Patient.belongsTo(Users, { foreignKey: "user_id" });

  var sortType = ["first_name", "ASC"];
  var incVal = { where: condition };

  if (user_type == "patient") {
    incVal = {
      where: condition,
      include: [{ model: Patient, order: [sortType] }],
    };
  }

  Users.findAll(incVal)
    .then((data) => {
        res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving Patient List.",
      });
    });
};

// Find a single users with an id
exports.findOne = (req, res) => {
  const id = req.params.id;

  Users.findByPk(id)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error retrieving User with id=" + id,
      });
    });
};

// Update a users by the id in the request
exports.update = (req, res) => {
  const id = req.params.id;

  Users.update(req.body, {
    where: { id: id },
  })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: "User updated successfully.",
        });
      } else {
        res.send({
          message: `Cannot update users with id=${id}. Maybe Users was not found or req.body is empty!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error updating Users with id=" + id,
      });
    });
};

// Update a users by the id in the request
exports.resendCode = (req, res) => {
  const id = req.params.id;
  var randomNumber = Math.floor(1000 + Math.random() * 9000);
  var dt = new Date();
  var newTime = dt.setMinutes(dt.getMinutes() + 10);
  let jsonObject = {
    otp: randomNumber,
    otp_expiry: newTime,
  };

  Users.update(jsonObject, {
    where: { id: id },
  })
    .then((num) => {
      if (num == 1) {
        // SEND MAIL
        const msg = {
          to: data.email,
          from: "support@medleymed.com",
          subject: "MedleyMed Notification: OTP Resent",
          html:
            "Dear User,<br /><br /> Please find the new OTP requested. Verify your account using OTP - <strong>" +
            randomNumber +
            "</strong>.<br /><br />Note: The OTP will be expired in 10 minutes.<br /><br /> Regards,<br />Team MedleyMed",
        };
        sgMail.send(msg).then(
          () => {},
          (error) => {
            console.error(error);
            if (error.response) {
              console.error(error.response.body);
            }
          }
        );
        // SEND MAIL
        res.send({
          message: "New OTP code sent",
          data: jsonObject,
        });
      } else {
        res.send({
          message: `Cannot update users with id=${id}. Maybe Users was not found or req.body is empty!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error updating Users with id=" + id,
      });
    });
};

// Delete a users with the specified id in the request
exports.delete = (req, res) => {
  const id = req.params.id;

  Users.destroy({
    where: { id: id },
  })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: "User was deleted successfully!",
        });
      } else {
        res.send({
          message: `Cannot delete User with id=${id}. Maybe User was not found!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Could not delete User with id=" + id,
      });
    });
};
// Delete all Userss from the database.
exports.deleteAll = (req, res) => {
  Users.destroy({
    where: {},
    truncate: false,
  })
    .then((nums) => {
      res.send({ message: `${nums} User were deleted successfully!` });
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while removing all User.",
      });
    });
};

// Login Controller
exports.login = (req, res) => {
  const email = encryption.encryptData(req.body.email);
  const mobile_no = encryption.encryptData(req.body.phone);
  const user_type = encryption.encryptData(req.body.role);
  //  console.log("--------email-----", email);
  //  console.log("---------- mobileno --------", mobile_no);
  //  return;
  var incVal = {};
  if (req.body.email === undefined && req.body.phone === undefined) {
    res.status(200).send({
      message: "Please provide login credentials",
      data: "",
    });
    return;
  }

  if (
    (req.body.email !== undefined && req.body.email == "") ||
    (req.body.phone !== undefined && req.body.phone == "")
  ) {
    res.status(200).send({
      message: "Login credentials cannot be empty",
      data: "",
    });
    return;
  }

if(req.body.role == "doctor" || req.body.role == "admin"  || req.body.role == "retailer")
{
  if (req.body.email !== undefined) {
    const password = encryption.encryptData(req.body.password);
    incVal = { where: { email: email, password : password, user_type : user_type } };
  }

  if (req.body.phone !== undefined) {
    const password = encryption.encryptData(req.body.password);
    incVal = { where: { mobile_number: mobile_no, password : password, user_type: user_type } };
  }
}
else
{
  if (req.body.email !== undefined) {
    incVal = { where: { email: email, user_type: user_type } };
  }
  if (req.body.phone !== undefined) {
    incVal = { where: { mobile_number: mobile_no, user_type: user_type } };
  }
}
  Users.findOne(incVal)
    .then((data) => {
      //console.log(data);
      var randomNumber = Math.floor(1000 + Math.random() * 9000);
      var dt = new Date();
      var newTime = dt.setMinutes( Date.now() /1000 + (60*60));

      // console.log("----- randomNumber ----", randomNumber);
      // console.log("----- newTime ----", newTime);
      // console.log("----- newTime +  randomNumber----", newTime+2000);
      
      var condition = null;
      var userobj = {};
      userobj.userID = data.id;
      userobj.email = data.email;
      userobj.name = data.name;
      userobj.mobile_number = data.mobile_number;
      // userobj.iat = newTime;
      //console.log("---- new time ----", newTime);
       userobj.exp = newTime;
      var token = jwt.sign(userobj, dbConfig.SECRET);

      userobj.selected_language = data.selected_language;
      // ----------- Token is generated ---------------- //
      userobj.accessToken = token;
      userobj.otp = randomNumber;
      userobj.clinic_id = data.clinic_id;
      userobj.otp_expiry = newTime;
      
     // console.log(data.id);
      if (data.user_type == "doctor") {
        userTypeController = Doctor;
        condition = {
          where: { user_id: data.id },
          raw: true,
          attributes: ["id"],
        };
      }
      if (data.user_type == "patient") {
        userTypeController = Patient;
       // console.log(data.user_type, data.id);
        condition = {
          where: { user_id: data.id },
          raw: true,
          attributes: ["id"],
        };
      }
      if (data.user_type == "retailer") {
        userTypeController = Retailer;
        condition = {
          where: { user_id: data.id },
          raw: true,
          attributes: ["id","currency"],
        };
      }
      if (data.user_type == "admin") {
        userTypeController = Users;
        condition = {
          where: { id: data.id },
          raw: true,
          attributes: ["id"],
        };
      }
      var currentdate = new Date();      
      var tokenexp = moment(currentdate).format("YYYY-MM-DD");
      var tokenexptime = moment(currentdate).format("hh:mm:ss");

      const tokenexpdate = moment(tokenexp, "YYYY-MM-DD").add(1,'days').format("YYYY-MM-DD");   
      
      let jsonObject = {
        otp: randomNumber,
        otp_expiry: newTime,
        token:token,
        token_exptime:tokenexpdate +" "+tokenexptime 
      };

      Users.update(jsonObject, {
        where: { id: data.id },
      }).then((num) => {
        if (num == 1) {
          // NO ACTION
        }
      });
     
      userTypeController.findAll(condition).then((response) => {
       // console.log(response[0]);
        if (data.user_type == "doctor") {
          userobj.doctor_id = response[0].id;
        }
        if (data.user_type == "patient") {
          userobj.patient_id = response[0].id;
        }
        if (data.user_type == "retailer") {
          userobj.retailer_id = response[0].id;
          userobj.currency = encryption.decryptData(response[0].currency);
        }
        loginOutput = {
          notification: {
            message: "Login successful !!",
            code: "200",
            type: "Success",
          },
          data: { userobj },
          nextPage: { pageName: "dashboard" },
        };
        // SEND MAIL
        // (msg = {
        //   to: data.email,
        //   from: "vivek.bajpai@medleymed.com",
        //   subject:
        //     "MedleyMed 2.0 Notification: MedleyMed 2.0 Login - OTP Verification",
        //   html:
        //     "Dear " +
        //     data.name +
        //     ",<br /><br /> Your login attempt has been recorded. Please verify your account using OTP - <strong>" +
        //     randomNumber +
        //     "</strong>.<br /><br />Note: The OTP will be expired in 10 minutes.<br /><br /> Regards,<br />Team MedleyMed 2.0",
        // }),
          // sgMail.send(msg).then(
          //   () => {},
          //   (error) => {
          //     console.error(error);
          //     if (error.response) {
          //       console.error(error.response.body);
          //     }
          //   }
          // ),

          // Send Mail BY sateesh    
          messageBody =  "Dear " + data.name +",<br /><br /> Your login attempt has been recorded. Please verify your account using OTP - <strong>" +  randomNumber +"</strong>.<br /><br />Note: The OTP will be expired in 10 minutes.<br /><br /> Regards,<br />Team MedleyMed";
        //   let transporter = nodemailer.createTransport({
        //     host: "smtp.gmail.com",
        //     port: 587,
        //     secure: false,
        //     requireTLS: true,
        //     auth: {
        //       user: "medley11109@gmail.com",
        //       pass: "Medley@123",
        //     },
        //   });
         
        //  let mailOptions = {
        //     from: "medley11109@gmail.com",
        //     to: data.email,            //"kavurusateesh@gmail.com",
        //     subject: "MedleyMed 2.0 Notification: MedleyMed 2.0 Login - OTP Verification",
        //     html: messageBody            
        //   };

          // let info = transporter.sendMail(mailOptions, function (err, info) {
          //   if (err) {
          //     console.log(err);
          //   } 
          //   // else {
          //   //   console.log(info);
          //   // }
          // });

          let EmailStatus = SendEmail.sendEmailPassword(data.email,"MedleyMed Notification: MedleyMed Login - OTP Verification", messageBody);
        

          // SEND MAIL
         
        // res.locals = { userobj };
       
          res.status(200).send({ loginOutput });
        
      });
    })
    .catch((err) => {
     // console.log(err);
      res.status(200).send({
        //message: err.message || "Invalid credentials !!",
        status: 204,
        error: true,
        message: "Invalid credentials !!",
        data: "",
      });
    });
};


// Login Controller
exports.loginAdmin = (req, res) => {

  const loginVal = {
    email: encryption.encryptData(req.body.email),
    password: encryption.encryptData(req.body.password),
    user_type: encryption.encryptData(req.body.role),
  };
  passport.authenticate("local", function (err, user, info) {
    if (err) {
      loginOutput = {
        notification: {
          message: info,
          code: "404",
          type: "Failure",
          is_auth: false,
          hint: "User record not found",
        },
        data: {},
      };
      // return next(err);
      res.send(loginOutput);
    }

    req.logIn(user, function (err) {
     // console.log(user);
      if (err) {
        loginOutput = {
          notification: {
            message: info,
            code: "404",
            type: "Failure",
            is_auth: false,
            hint: "User record not found",
          },
          data: {},
        };
        // return next(err);
        res.send(loginOutput);
      } else {
        var randonmNumber = Math.floor(1000 + Math.random() * 9000);
        var dt = new Date();
        var newTime = dt.setMinutes(dt.getMinutes() + 10);

        var userobj = {};
        userobj.email = user.email;
        userobj.userID = user.id;
        var token = jwt.sign(userobj, dbConfig.SECRET);
        userobj.accessToken = token;

        loginOutput = {
          notification: {
            message: info,
            code: "200",
            type: "Success",
            is_auth: false,
            hint: "User recordsss  found",
          },
          data: { userobj },
        };

        res.status(200).send({
          message: "User logged in successfully.",
          data: loginOutput,
        });
      }
    });
  })(req, res);
};

// exports.uploadImages = (req, res) => {
//   const multer = require("multer");
//   const FILE_PATH = "./public/uploads/";
//   const upload = multer({
//   dest: `${FILE_PATH}/`,
//   limits: {
//     fileSize: 10 * 1024 * 1024
// },
//  // limits: { fileSize: 1000000 },
//  }).single("myImage");

//  upload(req, res, (err) => {

//   return res.send({"mes":"success"});
//  });
// }

exports.uploadImages = (req, res) => {
  if (req.body.profile_pic != "" && req.body.profile_pic !== undefined) {
    const FILE_PATH = "./public/uploads/patient";
    var id = req.params.id;
    base64Img.img(req.body.profile_pic, FILE_PATH, Date.now(), function (
      err,
      filepath
    ) {
      const pathArr = filepath.split("/");
      const fileName = pathArr[pathArr.length - 1];
      var filename = fileName.replace(/[^\d,]/g, "");
      var newfile = filename + ".jpeg";
      var pathext = filepath.split(".");

      var oldfile = filename + "." + pathext[1];

      fs.renameSync(
        "./public/uploads/patient/" + oldfile,
        "./public/uploads/patient/" + newfile
      );
      var imageData = "/uploads/patient/" + filename + ".jpeg";

      var imgobjData = { profile_pic: imageData };
      userTypeController = Patient;
      var options = { where: { id: id } };
      userTypeController.update(imgobjData, options).then((data) => {
        Patient.findOne({
          where: { id: id },
          raw: true,
          attributes: ["profile_pic"],
        }).then((data) => {
          res.send({
            message: "Patient image updated successfully.",
            data: data,
            nextPage: { pageName: "purpose-of-consultation" },
          });
        });
      });
    });
  }

  // const id = req.params.id;
  // const FILE_PATH = "./public/uploads/patients";
  // const upload = multer({
  //   dest: `${FILE_PATH}/`,
  //   limits: {
  //     fileSize: 10 * 1024 * 1024
  // },
  //  // limits: { fileSize: 1000000 },
  //  }).single("myImage");

  // upload(req, res, (err) => {
  //   if(err) {
  //     return res.end("Error uploading file."+err);
  //   }
  //   if (req.file != undefined) {
  // 	var imageData =  "/uploads/patients/"+req.file.filename+'.jpeg';               //fs.readFileSync(req.file.path);
  // 	if (req.file.mimetype == "image/jpg" || req.file.mimetype == "image/png" || req.file.mimetype == "image/jpeg" || req.file.mimetype == "image/gif") {
  // 		var newfile = req.file.filename+'.jpeg';
  // 	}
  //   var oldfile = req.file.filename;
  //   fs.renameSync("./public/uploads/patients/"+oldfile, "./public/uploads/patients/"+newfile);
  //   } else {
  //     imageData = "";
  //   }

  //     var imgobjData = { profile_pic: imageData };
  //     userTypeController = Patient;
  //     var options = { where: { id: id } };
  //     userTypeController.update(imgobjData, options).then((data) => {

  //       Patient.findOne({where: { id: id },raw:true,attributes:["profile_pic"]})
  //       .then((data) => {
  //        res.send({
  //         message: "Patient image updated successfully.",
  // 	  data: data,
  // 	  nextPage: { 'pageName': 'purpose-of-consultation' }
  //       });
  //     })
  //   }).catch((err) => {
  //     res.status(500).send({
  //       message:
  //         err.message || "Some error occurred while retrieving Patient List.",
  //     });
  //    })
  //   // 	/*Now do where ever you want to do*/
  // });
};

exports.PostManuploadimage = (req, res) => {
  base64Img.img(req.body.base64, "./public/images", Date.now(), function (
    err,
    filepath
  ) {
    const pathArr = filepath.split("/");

    const fileName = pathArr[pathArr.length - 1];

    //console.log(pathArr + "------" + fileName);
  });
};
exports.language = (req, res) => {
  const pages = {
    module_id: req.body.module_id,
    page_name: req.body.page_name,
    status: req.body.status,
    language: req.params.lantype,
    descripts: req.body.descripts,

    //   address: req.body.address,
    //   state: req.body.state,
    //   zip_code: req.body.zip_code,
    //   office_no: req.body.office_no,
    //   facility_type: req.body.facility_type,
  };

  Pages.create(pages)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({ error: `${err} while creating facility` });
    });
};
exports.twiliovideo = (req, res) => {
  var AccessToken = require("twilio").jwt.AccessToken;
  var VideoGrant = AccessToken.VideoGrant;
  var randomName = require("../routes/randomname");
  //var identity = faker.name.findName();
  var identity = req.query.identity || randomName();

  // Create an access token which we will sign and return to the client,
  // containing the grant we just created
  var token = new AccessToken(
    "ACc09065db9fbe3afea65803169afcc1b5",
    "SK5699c6116f4bd03e6b0d7956dba2e15a",
    "OXzDzjRvJm2g4Sz74jIMcr0lMY6A6X2q"
  );
  token.identity = identity;
  const grant = new VideoGrant();
  // Grant token access to the Video API features
  token.addGrant(grant);

  // Serialize the token to a JWT string and include it in a JSON response
  res.send({
    identity: identity,
    token: token.toJwt(),
  });
};

// Forget Password
exports.forgetPassword_bk = (req, res) => {
  // Create a Doctor
  const loginVal = {
    email: encryption.encryptData(req.body.email),
  };

  Users.findAll({ where: loginVal })
    .then((userData) => {
      if (userData.length) {
        // SEND MAIL
        const msg = {
          to: req.body.email,
          from: "support@medleymed.com",
          subject: "MedleyMed Notification: Password reset mail",
          html:
            "Dear User,<br /><br /> Please reset the password using OTP - <strong>5555</strong><br /><br /> Regards,<br />Team MedleyMed",
        };
        sgMail.send(msg).then(
          () => {},
          (error) => {
            console.error(error);
            if (error.response) {
              console.error(error.response.body);
            }
          }
        );
        // SEND MAIL

        loginOutput = {
          notification: {
            message: "Success",
            code: "200",
            type: "Success",
            is_auth: true,
            hint: "Response Sent",
          },
          data: {
            email: userData[0].email,
            userID: userData[0].id,
            otp: "5555",
          },
        };
        res.send(loginOutput);
      } else {
        loginOutput = {
          notification: {
            message: "Failure",
            code: "404",
            type: "Failure",
            is_auth: false,
            hint: "User record not found",
          },
          data: {},
        };
        res.send(loginOutput);
      }
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message ||
          "Some error occurred while retrieving user information.",
      });
    });
};

exports.PatientByIdfindOne = (req, res) => {
  const id = req.params.id;
  Users.hasOne(Patient, { foreignKey: "user_id" });
  Patient.belongsTo(Users, { foreignKey: "user_id" });
  includeVal = Patient;
  Users.findAll({ where: { id: req.params.id }, include: [includeVal] })
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error retrieving User with id=" + id,
      });
    });
};

// Update a users and Patient data by the id in the request
exports.updatePatient = (req, res) => {
  const id = req.params.id;
  var userData = {
    //email: req.body.data.email_id,
    //mobile_no: req.body.data.phone,
    password: req.body.data.password_main,
  };
  var patientData = {
    first_name: req.body.data.first_name,
    last_name: req.body.data.last_name,
    address: req.body.data.address,
    state: req.body.data.state,
    zip_code: req.body.data.zip_code,
    gender: req.body.data.gender,
    dob: req.body.data.dob,
    profile_pic: req.body.data.profile_pic,
    adhaar_no: req.body.data.adhaar_no,
    arogya_sri_no: req.body.data.arogya_sri_no,
    marital_status: req.body.data.marital_status,
    nationality: req.body.data.nationality,
    occupation: req.body.data.occupation,
  };

  // let geoCoder = nodeGeocoder(geooptions);
  // let resp = geoCoder.geocode(req.body.data.address).then((response) => {

  //   if (response.length > 0) {
  //     resp_lat_long = response[0].latitude + "," + response[0].longitude;
  //     patientData.lat_long = resp_lat_long;
  //   } else {
  //     patientData.lat_long = "";
  //   }

  Users.update(userData, {
    where: { id: id },
  })
    .then((num) => {
      if (num == 1) {
        Patient.update(patientData, {
          where: { user_id: id },
        });
        // AUDIT TRAIL
        const auditTrailVal = {
          user_id: id,
          trail_type: "User Update",
          trail_message: "User with id = " + id + " is updated",
          status: 1,
        };
        AuditTrail.create(auditTrailVal, (err, data) => {});
        // AUDIT TRAIL
        res.send({
          message: "User updated successfully.",
        });
      } else {
        res.send({
          message: `Cannot update users with id=${id}. Maybe Users was not found or req.body is empty!`,
        });
      }
    })
    .catch((err) => {
      res.stats(500).send({
        message: "Error updating Users with id=" + err,
      });
    });
  //  })
};

exports.checkOTP = (req, res) => {
  let user_id = req.params.id;
  let otp = req.body.otp;
  Users.findAll({
    where: { id: user_id, otp: otp },
    attributes: ["otp_expiry"],
  }).then((userDataresp) => {
    var dt = new Date();
    if (userDataresp.length > 0) {
      var dt1 = userDataresp[0].otp_expiry;
      if (dt1.getTime() > dt.getTime()) {
        Users.update({ otp_verified: 1 }, { where: { id: user_id } });
        res.send({ message: "OTP Verified" });
      } else {
        res.send({ message: "OTP Expired" });
      }
    } else {
      res.status(200).send({ message: "OTP Mismatch" });
    }
  });
};

exports.uploadAdminImages = (req, res) => {
  const id = req.params.id;
  const type = req.params.type;
  const FILE_PATH = "./public/uploads/" + type;

  const upload = multer({
    dest: `${FILE_PATH}/`,
    limits: {
      fileSize: 10 * 1024 * 1024,
    },
    // limits: { fileSize: 1000000 },
  }).single("myImage");

  upload(req, res, (err) => {
    if (req.file != undefined) {
      var imageData = "/uploads/" + type + "/" + req.file.filename + ".jpeg"; //fs.readFileSync(req.file.path);
      if (
        req.file.mimetype == "image/jpg" ||
        req.file.mimetype == "image/png" ||
        req.file.mimetype == "image/jpeg" ||
        req.file.mimetype == "image/gif"
      ) {
        var newfile = req.file.filename + ".jpeg";
      }
      var oldfile = req.file.filename;
      fs.renameSync(
        "./public/uploads/" + type + "/" + oldfile,
        "./public/uploads/" + type + "/" + newfile
      );
    } else {
      imageData = "";
    }
    if (req.params.type == "problemimages") {
      var imgobjData = { category_image: imageData };
      userTypeController = Category;
      var options = { where: { id: id } };
      //console.log(id);
    }

    userTypeController.update(imgobjData, options).then((data) => {
      //users_image.create(data)
      // const auditTrailVal = {
      //   'user_id' : (session.user_id) ? session.user_id : 0,
      //   'trail_type' : req.params.type+" Image Update",
      //   'trail_message' : ((session.user_name) ? session.user_name : 'Someone') +' has updated ' + req.params.type + ' image with '+session.user_name+' id = '+data.id,
      //   'status': 1
      // }
      // AuditTrail.create(auditTrailVal,(err,data)=>{
      //      if(err){
      //        console.log(err)
      //      }else{
      //        console.log("created")
      //      }
      //  })

      return res.send(200).end();
    });
    // 	/*Now do where ever you want to do*/
  });
};

exports.logout = (req, res)=>{
		req.sessionID = "";
    let jsonObject = { token:"" };
    Users.update(jsonObject, {
      where: { id: req.params.id },
    }).then((num) => {
      if (num == 1) {
        // NO ACTION
        //res.redirect("/login");
        res.status(200).send({
          status: 200,
          error: false,         
          message: "User is Successfully Logout",
         
        });

      }
    });
  
	  
}

exports.checkToken = (req, res) => { //, attributes: ["otp_expiry"],
  let user_id = req.body.userid;
  let token = req.body.token;
  Users.findAll({
    where: { id: user_id, token: token }
  }).then((userDataresp) => {
     if (userDataresp.length > 0) {
      res.send({status:200,error:false,message:"Token Verified Sucessfully" });     
    } else {
      res.status(200).send({status:200,error:true,message:"Invalid Token"});
    }
  });
};

// Forget Password
exports.forgetPassword = (req, res) => {
  // Create a Doctor
  const loginVal = {
    email: encryption.encryptData(req.body.email),
    user_type : encryption.encryptData(req.body.role)
  };

  Users.findAll({ where: loginVal })
    .then((userData) => {
      if (userData.length) {
             
        var result           = [];
        var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        var charactersLength = characters.length;
        for ( var i = 0; i < 5; i++ ) {
          result.push(characters.charAt(Math.floor(Math.random() *  charactersLength)));
       }
       var randomNumber= result.join('');

       let jsonObject = {
          password: randomNumber,
          
        };
        // var userData = {
        //   //email: req.body.data.email_id,
        //   //mobile_no: req.body.data.phone,
        //   password: req.body.data.password_main,
        // };
       // console.log("________", encryption.encryptData(dd));
        //return;
        Users.update(jsonObject, {
          where: { id: userData[0].id },
        }).then((num) => {
          if (num == 1) {
            // NO ACTION
        // SEND MAIL
        var ptm= req.body.email;
        const msg = "Dear "+userData[0].name+ ",<br /><br /> Your Password is reset, Please use this Password  - <strong> "+randomNumber+" </strong><br /><br /> Regards,<br />Team MedleyMed";
        let EmailStatus = SendEmail.sendEmailPassword(ptm,"MedleyMed Notification: Password reset mail", msg);
        // SEND MAIL

          }
          loginOutput = {
            notification: {
              message: "Success",
              code: "200",
              type: "Success",
              is_auth: true,
              hint: "Response Sent",
            },
            data: {
              email: userData[0].email,
              userID: userData[0].id,
              password: randomNumber,
            },
          };
          res.send(loginOutput);
        })
        .catch((err) => {
          res.status(500).send({
            message:
              err.message ||
              "Some error occurred while  user password is not updated.",
          });
        });
        

       
      } else {
        loginOutput = {
          notification: {
            message: "Failure",
            code: "404",
            type: "Failure",
            is_auth: false,
            hint: "User record not found",
          },
          data: {},
        };
        res.send(loginOutput);
      }
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message ||
          "Some error occurred while retrieving user information.",
      });
    });
};

// Update a users by the id in the request
exports.resendOTP = (req, res) => {
  const id = req.params.id;
  var randomNumber = Math.floor(1000 + Math.random() * 9000);
  var dt = new Date();
  var newTime = dt.setMinutes(dt.getMinutes() + 10);
  let jsonObject = {
    otp: randomNumber,
    otp_expiry: newTime,
  };

  Users.update(jsonObject, {
    where: { id: id },
  })
    .then((num) => {
      if (num == 1) {
        // SEND MAIL
        Users.findOne({where:{id:id}}).then(function(userData){
        const email = userData.email;
        const msg = "Dear " +userData.name +",<br /><br /> Please find the new OTP requested. Verify your account using OTP - <strong>" + randomNumber +"</strong><br /> Regards,<br />Team MedleyMed" ;
        let EmailStatus = SendEmail.sendEmailPassword(email,"MedleyMed  Notification: OTP Resent", msg);
        })      
        // SEND MAIL
        res.send({
          message: "New OTP code sent",
          data: jsonObject,
        });
      } else {
        res.send({
          message: `Cannot update users with id=${id}. Maybe Users was not found or req.body is empty!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error updating Users with id=" + id,
      });
    });
};