const db = require("../models");
const AuditTrail = db.audit_trails;
const VitalInformation = db.vital_information_tbl;
const Vitals = db.vitals_tbl;

var encryption = require("../helpers/Encryption");
const Sequelize = require("sequelize");
const Op = Sequelize.Op;
const masterSubModuleClinicPage = db.master_sub_module_clinic_pages_tbl;
let masterSubModulePagesTbl = db.master_sub_module_pages_tbl;

exports.findAll = (req, res) => {
  VitalInformation.findAll({})
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error retrieving User with id=" + id,
      });
    });
};

// Find a single VitalInformation with an id
exports.findOne = (req, res) => {
  const id = req.params.id;
  VitalInformation.findAll({ where: { id: id } })
    .then((data) => {
      res.send({ message: "Vital Details were fetched Sucessfully", data });
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message ||
          "Some error occurred while retrieving VitalInformation.",
      });
    });
};

// Create Controller
exports.create = (req, res) => {
  var user_type = "Admin";

  if (Object.keys(req.body).length === 0) {
    res.status(400).send({ message: "Content cannot be empty" });
  } else {
    const VitalInformationval = {
      patient_id: req.body.patient_id,
      doctor_id: req.body.doctor_id,
      appointment_id: req.body.appointment_id,
      pulse_rate: req.body.pulse_rate,
      blood_pressure_systolic: req.body.blood_pressure_systolic,
      blood_pressure_diastolic: req.body.blood_pressure_diastolic,
      blood_sugar: req.body.blood_sugar,
      temperature: req.body.temperature,
      respiratory_rate: req.body.respiratory_rate,
      height: req.body.height,
      weight: req.body.weight,
      bmi: req.body.bmi,
      skip_weight: req.body.skip_weight,
      skip_height: req.body.skip_height,
      skip_respiratory_rate: req.body.skip_respiratory_rate,
      skip_temperature: req.body.skip_temperature,
      skip_blood_pressure: req.body.skip_blood_pressure,
      skip_pulse: req.body.skip_pulse,
      clinic_id: req.body.clinic_id,
    };
    let clinicId = req.body.clinic_id;
    // , appointment_status:0
    VitalInformation.count({
      where: {
        patient_id: req.body.patient_id,
        appointment_id: req.body.appointment_id,
      },
    }).then((count) => {
      // console.log(count)
      if (count > 0) {
        let id = req.body.patient_id;
        let updatevitals = {
          doctor_id: req.body.doctor_id,
          appointment_id: req.body.appointment_id,
          pulse_rate: req.body.pulse_rate,
          blood_pressure_systolic: req.body.blood_pressure_systolic,
          blood_sugar: req.body.blood_sugar,
          blood_pressure_diastolic: req.body.blood_pressure_diastolic,
          temperature: req.body.temperature,
          respiratory_rate: req.body.respiratory_rate,
          height: req.body.height,
          weight: req.body.weight,
          bmi: req.body.bmi,
          skip_weight: req.body.skip_weight,
          skip_height: req.body.skip_height,
          skip_respiratory_rate: req.body.skip_respiratory_rate,
          skip_temperature: req.body.skip_temperature,
          skip_blood_pressure: req.body.skip_blood_pressure,
          skip_pulse: req.body.skip_pulse,
          clinic_id: req.body.clinic_id,
          module_type: req.body.module_type,
        };
        VitalInformation.update(updatevitals, {
          where: {
            patient_id: id,
            appointment_id: req.body.appointment_id,
            // 'appointment_status':0
          },
        })
          .then((num) => {
            console.log(num);
            if (num == 1) {
              // const auditTrailVal = {
              //     'user_id': req.params.id,
              //     'trail_type': user_type.charAt(0).toUpperCase() + user_type.slice(1) + ' VitalInformation Modules',
              //     'trail_message': req.body.medicinename + ' ' + req.body.manufacturer + ' is VitalInformation Modules as ' + user_type.charAt(0).toUpperCase() + user_type.slice(1),
              //     'status': 1
              // }
              // AuditTrail.create(auditTrailVal, (err, data) => { })

              let data = { appointment_id: req.body.appointment_id };
              let displayText =
                "VitalInformation Module was updated successfully.";
              this.getPageSequence(res, data, displayText, clinicId);

              // res.send({
              //   status: 200,
              //   message: "VitalInformation Module was updated successfully.",
              //   data: { appointment_id: req.body.appointment_id },
              //   nextPage: { pageName: "Patientmedicalhistory" },
              //   previousPage: { pageName: "Patientsymptoms" },
              // });
            } else {
              res.send({
                message: `Cannot update VitalInformation with id=${id}. Maybe VitalInformation Module was not found or req.body is empty!`,
              });
            }
          })
          .catch((err) => {
            res.status(500).send({
              message: "Error updating VitalInformation with id=" + err,
            });
          });
      } else {
        VitalInformation.create(VitalInformationval)
          .then((data) => {
            // const auditTrailVal = {
            //     'user_id': req.body.patient_id,
            //     'trail_type': user_type.charAt(0).toUpperCase() + user_type.slice(1) + ' VitalInformationval Modules',
            //     // 'trail_message': req.body.appointment_id + ' ' + req.body.appointment_id + ' is VitalInformationval Modules as ' + user_type.charAt(0).toUpperCase() + user_type.slice(1),
            //     'status': 1
            // }
            // AuditTrail.create(auditTrailVal, (err, data) => { })

            // res.status(200).send({
            //   status: 200,
            //   message: "Vital Details were added Sucessfully",
            //   data: data,
            //   nextPage: { pageName: "Patientmedicalhistory" },
            //   previousPage: { pageName: "Patientsymptoms" },
            //   data: { appointment_id: req.body.appointment_id },
            //   //   error: false
            // });

            let displayText = "Vital Details were added Sucessfully.";
            this.getPageSequence(res, data, displayText, clinicId);
          })
          .catch((err) => {
            console.log(err);
            res.status(500).send({
              error: `${err} while creating VitalInformation Modules`,
            });
          });
      }
    });
  }
};

// Find a single Patient Vitals with an by appointment
exports.getVitalDetails = (req, res) => {
  const patientId = req.params.id;
  const appointment_id = req.params.appointment_id;
  const clinicId = req.params.clinicId;
  console.log(patientId);
  // const appointmentId = req.body.appointment_id;
  // const moduleType = req.body.module_type;
  // 'appointment_status':0 ,

  VitalInformation.findAll({
    where: {
      patient_id: patientId,
      appointment_id: appointment_id,
      // module_type: moduleType
    },
  })
    .then((data) => {
      let response = "";
      let responseLength = data.length;
      if (responseLength > 0) {
        response = data;
      } else {
        response = [
          {
            prescription_id: null,
            pulse_rate: "0",
            blood_sugar: "0",
            skip_pulse: null,
            blood_pressure_systolic: "0",
            blood_pressure_diastolic: "0",
            skip_blood_pressure: null,
            temperature: "0",
            skip_temperature: null,
            respiratory_rate: "0",
            skip_respiratory_rate: null,
            height: "0",
            skip_height: null,
            weight: "0",
            skip_weight: null,
            bmi: "0",
            patient_id: patientId,
            doctor_id: null,
            appointment_id: appointment_id,
            appointment_status: 0,
            clinic_id: clinicId,
            module_type: null,
          },
        ];
      }

      let displayText = "Patient Vitals Details fetched Sucessfully.";
      this.getPageSequence(res, response, displayText, clinicId);

      // res.status(200).send({
      //   status: 200,
      //   //   error: false,
      //   message: "Patient Vitals Details fetched Sucessfully",
      //   result: response,
      //   nextPage: { pageName: "Patientmedicalhistory" },
      //   previousPage: { pageName: "Patientsymptoms" },
      // });

    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving Problem.",
      });
    });
};

//Update a VitalInformation by the id in the request
exports.singleColumnUpdate = (req, res) => {
  if (Object.keys(req.body).length === 0) {
    res.status(400).send({ message: "Content cannot be empty" });
  }

  let patientId = req.params.patientId;
  let appointmentId = req.params.appointmentId;

  VitalInformation.count({
    where: {
      patient_id: patientId,
      appointment_id: appointmentId,
    },
  }).then((count) => {
    console.log(count);
    if (count > 0) {
      VitalInformation.update(req.body, {
        where: {
          patient_id: patientId,
          appointment_id: appointmentId,
        },
      })
        .then((num) => {
          if (num == 1) {
            res.send({
              status: 200,
              error: false,
              message: "VitalInformation updated successfully.",
            });
          }
        })
        .catch((err) => {
          console.log(err);
          res.status(500).send({
            status: 500,
            error: true,
            errorMessage: err,
            message: "Error updating VitalInformation with id=" + appointmentId,
          });
        });
    } else {
      req.body["patient_id"] = patientId;
      req.body["appointment_id"] = appointmentId;
      VitalInformation.create(req.body).then((data) => {
        // let displayText = "VitalInformation updated successfully.";
        // this.getPageSequence(res,data,displayText);

        res.send({
          status: 200,
          error: false,
          message: "VitalInformation updated successfully.",
        });
      });
    }
  });
};
// Ends here

//Update a VitalInformation by the id in the request
exports.update = (req, res) => {
  const id = req.params.id;
  var user_type = "Admin";
  if (Object.keys(req.body).length === 0) {
    res.status(400).send({ message: "Content cannot be empty" });
  }

  VitalInformation.update(req.body, {
    where: {
      patient_id: id,
      appointment_status: 0,
    },
  })
    .then((num) => {
      if (num == 1) {
        // const auditTrailVal = {
        //     'user_id': req.params.id,
        //     'trail_type': user_type.charAt(0).toUpperCase() + user_type.slice(1) + ' VitalInformation Modules',
        //     'trail_message': req.body.medicinename + ' ' + req.body.manufacturer + ' is VitalInformation Modules as ' + user_type.charAt(0).toUpperCase() + user_type.slice(1),
        //     'status': 1
        // }
        // AuditTrail.create(auditTrailVal, (err, data) => { })
        res.send({
          status: 200,
          message: "VitalInformation Module was updated successfully.",
        });
      } else {
        res.send({
          message: `Cannot update VitalInformation with id=${id}. Maybe VitalInformation Module was not found or req.body is empty!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error updating VitalInformation with id=" + id,
      });
    });
};

// Page Exports
exports.getPageSequence = (res, data, displayText, clinicId) => {
  // Page Sequence Starts Here
  let encryptedPageName = "NTqmnSrWm5LcJxcQN+E/1w==";
  let DecryptedPageName = "Patientvitals";
  // console.log("requestType "+requestType);

  let pageOrderArray = [];

  // console.log(
  //   encryptedPageName +
  //     " <<< encryptedPageName >>> " +
  //     DecryptedPageName +
  //     " <<<< DecryptedPageName"
  // );

  masterSubModulePagesTbl.hasMany(masterSubModuleClinicPage, {
    foreignKey: "page_module_id",
  });
  masterSubModuleClinicPage.belongsTo(masterSubModulePagesTbl, {
    foreignKey: "page_module_id",
  });

  masterSubModuleClinicPage
    .findAll({
      where: {
        status: 1,
        clinic_id: clinicId,
        master_module_id: 1,
      },
      order: [
        ["page_module_sequence_id", "ASC"],
        ["master_module_sequence_id", "ASC"],
        ["sub_module_sequence_id", "ASC"],
        ["page_module_sequence_id", "ASC"],
      ],
      include: [
        {
          model: masterSubModulePagesTbl,
          where: { status: 1 },
          attributes: { exclude: ["createdAt", "updatedAt"] },
        },
      ],
      attributes: {
        exclude: ["createdAt", "updatedAt"],
      },
    })
    .then((items) => {
      let definedPageSequenceLength = items.length;
      let firstArray = [];

      var arr = [];

      for (var i = 0; i < items.length; i++) {
        obj = {};
        console.log("i Value " + i);
        // obj['id'] = items[i].id,
        // obj['clinic_id']= items[i].clinic_id,
        // obj['master_module_id']= items[i].master_module_id,
        // obj['master_module_sequence_id'] = items[i].master_module_sequence_id,
        // obj['sub_module_id'] = items[i].sub_module_id,
        // obj['sub_module_sequence_id'] = items[i].sub_module_sequence_id,
        // obj['page_module_id'] = items[i].page_module_id,
        // obj['page_module_sequence_id'] = items[i].page_module_sequence_id,
        // obj['status'] = items[i].status,
        (obj["page_name"] = items[i].master_sub_module_pages_tbl.page_name),
          (obj["web_reference_page_name"] =
            items[i].master_sub_module_pages_tbl.web_reference_page_name),
          (obj["reference_page_name"] =
            items[i].master_sub_module_pages_tbl.mobile_reference_page_name),
          // obj['master_sub_module_pages_tbl_id'] = items[i].master_sub_module_pages_tbl.id,
          // obj['master_sub_module_pages_tbl_master_module_id'] = items[i].master_sub_module_pages_tbl.master_module_id,
          // obj['master_sub_module_pages_tbl_sub_module_id'] = items[i].master_sub_module_pages_tbl.sub_module_id,
          // obj['master_sub_module_pages_tbl_sequence_id'] = items[i].master_sub_module_pages_tbl.sequence_id,
          // obj['master_sub_module_pages_tbl_status'] = items[i].master_sub_module_pages_tbl.status,
          (obj["sequenceIndex"] = i + 1),
          arr.push(obj);
        // console.log(obj);
      }

      let prevArray = [];
      let nextArray = [];
      let previousPage = [];

      if (arr.length > 0) {
        let previousPage = "";
        let nextPage = "";
        console.log("Before For Each");
        arr.forEach(function (arrayItem, index) {
          console.log(arrayItem.page_name + " >>> arrayItem.page_name ");
          console.log(DecryptedPageName + " >>> DecryptedPageName ");
          if (arrayItem.page_name === DecryptedPageName) {
            let sequenceIndex = arrayItem.sequenceIndex;
            let getPreviousSequenceId = sequenceIndex - 1;
            let getNextSequenceId = sequenceIndex + 1;
            // console.log("sequenceIndex " + arrayItem.sequenceIndex);
            // console.log("getPreviousSequenceId " + getPreviousSequenceId);
            // console.log("getNextSequenceId " + getNextSequenceId);
            // if (getPreviousSequenceId) {
            // console.log("Inside getPreviousSequenceId");
            previousPage = arr.filter(function (obj) {
              if (obj.sequenceIndex == getPreviousSequenceId) {
                return obj;
              }
            })[0];
            // }
            // if (getNextSequenceId) {
            // console.log("Inside getNextSequenceId");
            nextPage = arr.filter(function (obj) {
              if (obj.sequenceIndex == getNextSequenceId) {
                return obj;
              }
            })[0];
            // }
            pageOrderArray.push(previousPage);
            pageOrderArray.push(nextPage);
            // console.log(previousPage);
            // console.log(nextPage);
          }
        });
        res.status(200).send({
          status: 200,
          message: displayText,
          error: false,
          data: data,
          // result: data,
          // resultLength: items.length,
          previouspage: previousPage,
          nextpage: nextPage,
        });
      } else {
        res.status(500).send({
          status: 204,
          error: true,
          message: "Page Sequence not found..",
          data: [],
          resultLength: items.length,
          previouspage: "",
          nextpage: "",
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving Vitals List.",
      });
    });

  // Page Sequence Ends here
};

// Delete a VitalInformation with the specified id in the request
// exports.delete = (req, res) => {
//     const id = req.params.id;

//     VitalInformation.destroy({
//         where: { id: id },
//     })
//         .then((num) => {
//             if (num == 1) {
//                 res.send({
//                     message: "VitalInformation was deleted successfully!",
//                 });
//             } else {
//                 res.send({
//                     message: `Cannot delete VitalInformation with id=${id}. Maybe VitalInformation was not found!`,
//                 });
//             }
//         })
//         .catch((err) => {
//             res.status(500).send({
//                 message: "Could not delete VitalInformation with id=" + id,
//             });
//         });
// };

// Delete all VitalInformation from the database.
// exports.deleteAll = (req, res) => {
//     VitalInformation.destroy({
//         where: {},
//         truncate: false,
//     })
//         .then((nums) => {
//             res.send({ message: `${nums} VitalInformation were deleted successfully!` });
//         })
//         .catch((err) => {
//             res.status(500).send({
//                 message:
//                     err.message || "Some error occurred while removing all VitalInformation.",
//             });
//         });
// };
