const Sequelize = require('sequelize');
const db = require("../models");
const Patient = db.patient_tbl;
const Users = db.users_tbl;
const AuditTrail = db.audit_trails;
const Op = Sequelize.Op;
const Relations = db.master_realtionships;
const multer = require("multer");
var fs = require("fs");
var encryption = require("../helpers/Encryption");
const { USER } = require('../config/db.config');
const { patient_relative_history } = require('../models');

const problem = db.problem_tbl;
const Symptom = db.symptoms_tbl;
const Vital = db.vital_information_tbl;
const pastHistory = db.patient_past_history
const MasterRealtionships = db.master_realtionships;

exports.findAllPatientsRecords = (req,res) => {
   Patient.findAll({ attributes: ['id', 'name']})
   .then((data) => {
     res.send(data);
   }).catch((err) => {
     res.status(500).send({
       message:
         err.message || "Some error occurred while retrieving Languages List.",
     });
   });
 }  


//retreive patient Medical Records
exports.getMedicalRecordDetail = (req, res) => {

   // let resultArray = [];
   // const appointmentId = req.body.appointment_id;
   // const patientId = req.body.patient_id;

   // Patient.hasMany(problem, { foreignKey: "patient_id" });
   // problem.belongsTo(Patient, { foreignKey: "patient_id" });

   // Patient.hasMany(Symptom, { foreignKey: "patient_id" });
   // Symptom.belongsTo(Patient, { foreignKey: "patient_id" });

   // Patient.hasMany(Vital, { foreignKey: "patient_id" });
   // Vital.belongsTo(Patient, { foreignKey: "patient_id" });

   // Patient.hasMany(pastHistory, { foreignKey: "patient_id" });
   // pastHistory.belongsTo(Patient, { foreignKey: "patient_id" });

   // Patient.findAll({
   //    where:
   //    {
   //       "id": patientId
   //    },
   //    include: [
   //       { model: problem, where: { "appointment_id": appointmentId },  attributes: { exclude: ["createdAt", "updatedAt","id"], },  },
   //       { model: Symptom, where: { "appointment_id": appointmentId },  attributes: { exclude: ["createdAt", "updatedAt","infermedica_suggestive_diagnosis","question","suggestive_api_data"], },  },
   //       { model: Vital, where: { "appointment_id": appointmentId },    attributes: { exclude: ["createdAt", "updatedAt"], },  },
   //       { model: pastHistory, where: { "appointment_id": appointmentId }, attributes: { exclude: ["createdAt", "updatedAt"], },  },
   //    ]
   // }).then((data) => {
   //    res.status(200).send({
   //       status: 200,
   //       error: false,
   //       message: "Patient Medical Details Fetched Sucessfully",
   //       data: data
   //    });
   // }).catch((err) => {
   //    res.status(500).send({
   //       message:
   //          err.message || "Some error occurred while retrieving Patient List.",
   //    });
   // });

   let resultArray = [];
   const appointmentId = req.body.appointment_id;
   const patientId = req.body.patient_id;
 
   Patient.hasMany(problem, { foreignKey: "patient_id" });
   problem.belongsTo(Patient, { foreignKey: "patient_id" });
 
   Patient.hasMany(Symptom, { foreignKey: "patient_id" });
   Symptom.belongsTo(Patient, { foreignKey: "patient_id" });
 
   Patient.hasMany(Vital, { foreignKey: "patient_id" });
   Vital.belongsTo(Patient, { foreignKey: "patient_id" });
 
   Patient.hasMany(pastHistory, { foreignKey: "patient_id" });
   pastHistory.belongsTo(Patient, { foreignKey: "patient_id" });

   MasterRealtionships.hasMany(Patient, { foreignKey: "relation" });
   Patient.belongsTo(MasterRealtionships, { foreignKey: "relation" });
 
   Patient.findAll({ where: { "id": patientId },
      include: [
         { model: problem, where: { "appointment_id": appointmentId }, required:false, attributes: { exclude: ["createdAt", "updatedAt", "id"], },  },
         { model: Symptom, where: { "appointment_id": appointmentId }, required:false, attributes: { exclude: ["createdAt", "updatedAt","infermedica_suggestive_diagnosis","question","suggestive_api_data"], },  },
         { model: Vital, where: { "appointment_id": appointmentId },  required:false,  attributes: { exclude: ["createdAt", "updatedAt"], },  },
         { model: pastHistory, where: { "appointment_id": appointmentId }, required:false, attributes: { exclude: ["createdAt", "updatedAt"], },  },
         { model: MasterRealtionships,  required:false, attributes: { exclude: ["createdAt", "updatedAt"], }, },
      ], 
   }).then((data) => {
 
         res.status(200).send({
            status: 200,
            error: false,
            message: "Patient Medical Details Fetched Sucessfully",
            data: data
         });
   })
};

// Retrieve all Patients from the Patients.
exports.findAll = (req, res) => {
   const id = req.query.id;
   var condition = id ? { id: { [Op.eq]: `${id}` } } : null;

   Users.hasOne(Patient, { foreignKey: "user_id" });
   Patient.belongsTo(Users, { foreignKey: "user_id" });

   Patient.findAll({ where: condition, include: [Users] })
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

//finds list of all patient added relatives
exports.findpatientrealtives = (req, res) => {
   const id = req.params.id;
   // var condition = name ? { name: { [Op.eq]: `${name}` } } : null;
   var finalopt = [];
   Relations.hasOne(Patient, { foreignKey: "relation" });
   Patient.belongsTo(Relations, { foreignKey: "relation" });
   Patient.findAll({
      include: [Relations],
      where: {
         relation_patient_id: id,
      },
      // attributes: ["id", "relation_patient_id","name","gender","profile_pic"]
   })
      .then((resp) => {
         Relations.hasOne(Patient, { foreignKey: "relation" });
         Patient.belongsTo(Relations, { foreignKey: "relation" });
         Patient.findAll({
            include: [Relations],
            where: {
               id: id,
            },
            // attributes: ["id", "relation_patient_id","name","gender","profile_pic"]
          })
            .then((data) => {
               finalopt.push(data[0]);
              // finalopt.push(resp);
               var obj = {};
               for (let i = 0; i < resp.length; i++) {
                  finalopt.push(resp[i]);
                }

                var result = finalopt.reduce((unique, object) => {
                  if (!unique.some((obj) => obj.name === object.name && obj.id === object.id)) {
                    unique.push(object);
                  }
                  return unique;
                }, []);

              //console.log(resp.length)
              //res.send(result);
              res.status(200).send({
               status: 200,
               message: "Patient relatives Data fetched Sucessfully",
               data: result,
             });
         })
      })
      .catch((err) => {
         res.status(500).send({
            message:
               err.message || "Some error occurred while retrieving Patient.",
         });
      });
}
// Find a single Patient with an by id
exports.findOne = (req, res) => {
   const id = req.params.id;
   // var condition = name ? { name: { [Op.eq]: `${name}` } } : null;
   Patient.findAll({
      where: {
         id: id
      }
   })
      .then((data) => {
         res.status(200).send({
            status: 200,
            error:false,
            message: "Patient details fetched Sucessfully",
            data:data,
        });
      })
      .catch((err) => {
         res.status(500).send({
            message:
               err.message || "Some error occurred while retrieving Patient.",
         });
      });
};


// Create a Language Name
exports.create = (req, res) => {
   //var user_type = "Admin"; 
   if (!req.body) {
      res.status(400).send({ "message": "Content cannot be empty" })
   }
   // } else if (!req.body.shortname) {
   //   res.status(400).send({"message":"Patient Name cannot be empty"})
   // } 
   else {
      // Create a Userss
      const userVal = {
         mobile_number: req.body.phone,
         email: req.body.email_id,
         name: req.body.first_name,
         username: req.body.first_name,
         password: req.body.password_main,
         user_type: req.body.user_type, // Provider / Patient / Responder / Admin / Organization Admin
         status: req.body.status
      };

      Users.create(userVal)
         .then((data) => {

            if (data.user_type == "patient") {
               // Create a Patient
               this.createnewpatient(data.id, req.body, res)
               return
            }

         })

   }
};

exports.createnewpatient = (userid, body, res) => {

   userTypeVal = {
      user_id: userid,
      first_name: body.first_name,
      last_name: body.last_name,
      address: body.address,
      state: body.state,
      zip_code: body.zip_code,
      //lat_long: req.body.lat_long ? req.body.lat_long : "40.6616098,-74.209133",
      dob: body.dob,
      gender: body.gender,
      //profile_pic: req.body.profile_pic,
      marital_status: body.marital_status,
      occupation: body.occupation,
      adhaar_no: body.adhaar_no,
      arogya_sri_no: body.arogya_sri_no,
      status: 1

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
      })
      .catch((err) => {
         console.log(err)
         res.status(500).send({
            message:
               err.errors[0]["message"] ||
               "Some error occurred while creating the patients",
         });
      });

   //})
}

// paatient Profile
exports.updatePatientProfile = (req, res) => {
   const id = req.params.patientId;
   var patientcontent = {
     name: req.body.name,
     phone_number: req.body.phone_number,
     dob: req.body.dob,
     gender: req.body.gender,
     relation: req.body.relation,
     relation_patient_id: req.body.relation_patient_id,
   };
   Patient.update(patientcontent, {
     where: { id: id },
   })
     .then((num) => {
       if (num[0] === 1) {
         res.status(200).send({
           status: 200,
           error: false,
           message: "Patient Profile Updated Successfully...",
         });
       }
     })
     .catch((err) => {
       res.status(500).send({
         message: "Error updating Patient with id=" + id,
       });
     });
 };
 // Ends here
 

// update  patient
exports.updatepatient = (req, res) => {
   const id = req.params.id;

   if (req.body.page_type == "basicinfor") {
      var patientcontent = {
         name: req.body.name,
         phone_number: req.body.phone_number,
         dob: req.body.dob,
         gender: req.body.gender,
         relation: req.body.relation,
         relation_patient_id: req.body.relation_patient_id,
      }

      // console.log(patientcontent);
      // console.log(req.body.relation);
      // return;

      if (req.body.relation == "1") {
         Patient.update(patientcontent, {
            where: { id: id }
         })
            .then(num => {
               if (num[0] === 1) {
                  Patient.findAll({ where: { id: id }, attributes: ["name", "phone_number", "dob", "gender"] })
                     .then(data => {
                        res.send({ message: "Patient was updated successfully.", data });
                     })
                     .catch(err => {
                        res.status(500).send({
                           message: "Error retrieving Assessment Review with id=" + id
                        });
                     });

               } else {
                  res.send({
                     message: `Cannot update Patient with id=${id}. Maybe Patient was not found or req.body is empty!`
                  });
               }
            })
            .catch(err => {
               res.status(500).send({
                  message: "Error updating Patient with id=" + id
               });
            });
      } else {
         const userVal = {
            mobile_number: req.body.phone_number,
            email: '',
            username: '',
            name: req.body.name,
            password: "Admin@123",//req.body.password,
            user_type: 'relative', // Provider / Patient / Responder / Admin / Organization Admin
            selected_language: '1',
            is_fingerprint_required: '0',
            status: 0
         };
         Users.create(userVal)
            .then((data) => {
               patientcontent.user_id = data.id;
               Patient.create(patientcontent)
                  .then(data => {

                     res.send({ message: "Patient was created sccessfully.","memberDataId":data.id });
                     // Patient.findAll({ where: { id: data.id }, attributes: ["name", "phone_number", "dob", "gender"] })
                     //    .then(data => {
                     // res.send({ message: "Patient was created sccessfully.",data });
                     //    })
                  })
                  .catch(err => {
                     res.status(500).send({
                        message: "Error Creating Patient with id=" + err
                     });
                  });
            }).catch((err) => {
               res.status(500).send({
                  message:
                     err.message || "Some" + err + "createUsers.",
               });
               console.log(err.message)
            });
      }
   } else {

      Patient.update(req.body, {
         where: { id: id }
      })
         .then(num => {
            if (num[0] === 1) {
               Patient.findAll({ where: { user_id: id }, attributes: ["chornic_diseases_list", "related_medication", "drug_allergies"] })
                  .then(data => {
                     res.send({ message: "Patient was updated successfully.", data });
                  })

            } else {
               res.send({
                  message: `Cannot update Patient with id=${id}. Maybe Patient was not found or req.body is empty!`
               });
            }
         })
         .catch(err => {
            res.status(500).send({
               message: "Error updating Patient with id=" + err
            });
         });
   }

}

// Update a Audit Trail by the id in the request
exports.update = (req, res) => {
   const id = req.params.id;
   var user_type = "Patient";
   Patient.update(req.body, {
      where: { id: id }
   })
      .then(num => {

         if (num[0] === 1) {
            const auditTrailVal = {
               'user_id': req.params.id,
               'trail_type': user_type.charAt(0).toUpperCase() + user_type.slice(1) + 'Patient Modules',
               'trail_message': req.body.first_name + ' ' + req.body.last_name + ' is Patient Modules as ' + user_type.charAt(0).toUpperCase() + user_type.slice(1),
               'status': 1
            }
            AuditTrail.create(auditTrailVal, (err, data) => { });
            res.send({
               message: "Patient was updated successfully."
            });
         } else {
            res.send({
               message: `Cannot update Patient with id=${id}. Maybe Patient was not found or req.body is empty!`
            });
         }
      })
      .catch(err => {
         res.status(500).send({
            message: "Error updating Patient with id=" + id
         });
      });
};


// Delete a Patient with the specified id in the request
exports.delete = (req, res) => {
   const id = req.params.id;
   var user_type = "Patient";
   Patient.destroy({
      where: { id: id }
   })
      .then(num => {
         if (num == 1) {
            const auditTrailVal = {
               'user_id': req.params.id,
               'trail_type': user_type.charAt(0).toUpperCase() + user_type.slice(1) + 'Patient Modules',
               'trail_message': req.params.id + ' ' + ' is Patient Modules as ' + user_type.charAt(0).toUpperCase() + user_type.slice(1),
               'status': 1
            }
            AuditTrail.create(auditTrailVal, (err, data) => { });
            res.send({
               message: "Patient was deleted successfully!"
            });
         } else {
            res.send({
               message: `Cannot delete Patient with id=${id}. Maybe Patient was not found!`
            });
         }
      })
      .catch(err => {
         res.status(500).send({
            message: "Could not delete Patient with id=" + id
         });
      });
};


// check mobile number exists
exports.chcekpatientmobile  = (req,res) => {
   let mobile_number = req.body.mobile_no;

   if(!mobile_number){
      //res.status(400).send({"message":"Mobile number cannot be empty"})
      res.status(200).send({
         status: 400,
         error: true,
         message: "Mobile number cannot be empty",
       });
   }
   
   Patient.count({
      where:
      {
          'phone_number': encryption.encryptData(mobile_number),
          'relation_patient_id':0
      }
  }).then(rows => {
        if(rows > 0){
         //   res.status(404).send({ status: 404,"message":"Mobile number already exists"})    
         res.status(200).send({
            status: 404,
            error: true,
            message: "Mobile number already exists",
          });
      } else {
         res.status(200).send({
            status: 200,
            error: false,
            message: "Mobile number",
          });
         //  res.status(200).send({status: 200,"message":"Mobile number"})
      }
          
   })
}

exports.Profileimage = (req, res) => {
   const id = req.params.id;
   const FILE_PATH = "./public/uploads/patient";
   const upload = multer({
     dest: `${FILE_PATH}/`,
     limits: {
       fileSize: 10 * 1024 * 1024,
     },
     // limits: { fileSize: 1000000 },
   }).single("myImage");
 
   upload(req, res, (err) => {
     if (err) {
       return res.end("Error uploading file." + err);
     }
     if (req.file != undefined) {
       var imageData = "/uploads/patient/" + req.file.filename + ".jpeg"; //fs.readFileSync(req.file.path);
       if (
         req.file.mimetype == "image/jpg" ||
         req.file.mimetype == "image/png" ||
         req.file.mimetype == "image/jpeg" ||
         req.file.mimetype == "image/gif"
       ) {
         var newfile = req.file.filename + ".jpeg";
       }
       var oldfile = req.file.filename;
       fs.renameSync("./public/uploads/patient/" + oldfile, "./public/uploads/patient/" + newfile);
     } else {
       imageData = "";
     }
     var imgobjData = { profile_pic: imageData };
   
     var options = { where: { id: id } };
     Patient
       .update(imgobjData, options)
       .then((data) => {
         if (data[0] === 1) {

            res.send({
               message: "Patient Profile image updated successfully."
            });
         }
         // res.send({
         //   message: "Patient image updated successfully.",
         //   data,
         // });
       })
       .catch((err) => {
         res.status(500).send({
           message:
             err.message || "Some error occurred while retrieving Patient List.",
         });
       });
     // 	/*Now do where ever you want to do*/
   });
 };
 
