const Sequelize = require("sequelize");
const db = require("../models");
const Users = db.users_tbl;
const Appointments = db.patient_appointment_tbl;
const consultNowDraft = db.consultnow_draft_tbl;
const Notifications = db.notifications_tbl;
const medicineDetail = db.medicine_type_detail;
const diagnostics = db.lab_radiology_test;
const AuditTrail = db.audit_trails;
const MedicineDetails = db.medicine_details;
const Op = Sequelize.Op;
const moment = require("moment");
const Patient = db.patient_tbl;
const Doctor = db.doctor_tbl;
const Clinic = db.clinic_tbl;
var encryption = require("../helpers/Encryption");
const problem_tbl = db.problem_tbl;
const userTbl = db.users_tbl;
const appointment_status_tbl = db.appointment_tbl_status;
const masterrealtionships = db.master_realtionships;
const Symptoms_tbl = db.symptoms_tbl;
const VitalInformation = db.vital_information_tbl;
const patient_past_history = db.patient_past_history;
const feedback_tbl = db.appointment_feedback_tbl;

const generateSlots = require("../helpers/Slots");
var dateTime = require("node-datetime");
const multer = require("multer");
var fs = require("fs");
var base64Img = require("base64-img");
var prescriptionPDF = require("html-pdf");
const axios = require("axios");
const express = require("express");

const nodemailer = require("nodemailer");
const patientEmail = require("../helpers/Email");

const textLocalHash = "89fa26bfa52c1d38cc162b2a38ba75bbca03abf6";
const textLocalAPIKey = "dHnQUu8BBeU-s8JtxOkL3bepg2O67qYsKAuoUD7VZp";
const textLocalUserName = "support@medleymed.com";
const textLocalSender = "MEDLEY";


const Doctoreducation = db.doctor_education;

// update Patient Appointment Status and Cancellation reason
exports.updateConsultationStatus = (req, res) => {
const appointmentid = req.params.appointmentid;
  if (req.body.data) 
  {
    req.body = req.body.data;
  }
  Appointments.update(req.body, {
    where: {
      appointment_confirm_id: appointmentid,
    },
  })
    .then((num) => {
      if (num == 1) {
       
        Patient.hasOne(Appointments, { foreignKey: "patient_id" });
        Appointments.belongsTo(Patient, { foreignKey: "patient_id" });
        Appointments.findAll({
          where: { appointment_confirm_id: appointmentid },
          include: [{ model: Patient, attributes: ["user_id","name"] }],
        }).then((patientData) => {
          if(patientData[0].patient_tbl.user_id)
          {
            let patientMessageBody = "";
            var userId = patientData[0].patient_tbl.user_id;
            userTbl.findOne({where:{id:userId}})
            .then(function(userData){
               var myDate = new Date(patientData[0].appointment_datetime);
              const dateTimeConvertion =
                moment(myDate).format("MM") +
                " " +
                moment(myDate).format("MMMM") +
                ", " +
                moment(myDate).format("YYYY") +
                " at " +
                moment(myDate).format("hh:mm a");
          patientMessageBody += '<meta http-equiv="Content-Type"  content="text/html charset=UTF-8" /><body>';
          patientMessageBody += "<p>Hello Mr. " + userData.name + ",</p>";
          patientMessageBody += '<p>Your appointment  is Cancelled  on '+dateTimeConvertion+'.</p>';
          patientMessageBody += '<p>Stay healthy, stay safe!!</p>';
          patientMessageBody += '<p>Thank you for choosing MedleyMed</p>';
          patientMessageBody += '</body>';
          var dd = userData.email; //"kavurusateesh@gmail.com";
        let EmailStatus = patientEmail.sendEmailPassword(dd,"MedleyMed 2.0 Notification: MedleyMed 2.0 Appointment Cancellation", patientMessageBody);
       })
   }

   });

        
        const auditTrailVal = {
          user_id: appointmentid,
          trail_type: "Patient",
          trail_message:
            "Cosultation Status Updated Sucessfully for the Appointment Id " +
            appointmentid,
          status: 1,
        };
        AuditTrail.create(auditTrailVal, (err, data) => {});
        res.status(200).send({
          status: 200,
          error: false,
          message: "Consultation Status updated Successfully",
        });
      } else {
        res.send({
          message: `Cannot update Consultation Status with id=${appointmentid}. Maybe Id was not found or req.body is empty!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error updating Audit Trail",
      });
    });
};
// Ends here

//Email Sending Functionality
exports.sendEmailToPatient = (req, res) => {
  let patientId = req.body.patientId;
  let doctorId = req.body.doctorId;
  let uniqId = req.body.uniqId;
  let appointmentDateTime = "2020-10-24 12:25:55";

  // ./public/uploads
  // console.log('Hai AVINASH');
  // console.log(__dirname );
  // console.log(__filename);
  // console.log(express.static(__dirname + '/public'));

  // console.log(encryption.decryptData("8qWa6VDLHA/9WPlmS0MtGA=="));
  // console.log(encryption.decryptData("MgL+NLM/wjghiCiUxDiYOw=="));
  // console.log(encryption.decryptData("KeU3IuSnSR1nqldAjplxBA=="));
  // console.log(encryption.decryptData("sYSke9Pq4wyo3d7rFNXfow=="));

  return;

  var myDate = new Date(appointmentDateTime);
  const dateTimeConvertion =
    moment(myDate).format("MM") +
    " " +
    moment(myDate).format("MMMM") +
    ", " +
    moment(myDate).format("YYYY") +
    " at " +
    moment(myDate).format("hh:mm a");

  let patientMessageBody = "";
  let doctorMessageBody = "";
  // let attachmentData= [{
  //   filename: 'dummy.pdf',
  //   path: 'C:/generic_app/public/uploads/patient/1.pdf',
  //   contentType: 'application/pdf'
  // }];
  let attachmentData = [];

  userTbl
    .findAll({
      where: {
        id: patientId,
      },
    })
    .then((patientData) => {
      userTbl.hasOne(Doctor, { foreignKey: "user_id" });
      Doctor.belongsTo(userTbl, { foreignKey: "user_id" });
      Doctor.findAll({
        where: { id: doctorId },
        include: [{ model: userTbl, attributes: ["name"] }],
      }).then((doctorData) => {
        //patientMessageBody +=
        //   '<meta http-equiv="Content-Type"  content="text/html charset=UTF-8" /><body>';
        patientMessageBody += "<p>Hello Mr. " + patientData[0].name + ",</p>";
        patientMessageBody +=
          "<p>Your appointment(" +
          patientData[0].name +
          ") is Cancelled with Dr." +
          doctorData[0].tbl_user.name +
          " on " +
          dateTimeConvertion +
          ".</p>";

        // patientMessageBody +=
        // "<p>Join this appointment from your computer/laptop : <a href='http://3.7.234.106:8100'>http://3.7.234.106:8100</a> </p>";
        patientMessageBody += "<p>Stay healthy, stay safe!!</p>";
        patientMessageBody += "<p>Thank you for choosing MedleyMed</p>";
        // patientMessageBody += "</body>";

        var email = patientEmail.sendEmail(
          "avinash.a@medleymed.com",
          "Appointment Cancellation",
          patientMessageBody,
          attachmentData
        );

        res.status(200).send({
          status: 200,
          error: false,
          message: "Doctor was fetched successfully.",
          patientData: patientData,
          doctorData: doctorData,
        });
      });
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving Patient.",
      });
    });

  // return;

  // patientMessageBody += '<meta http-equiv="Content-Type"  content="text/html charset=UTF-8" /><body>';
  // patientMessageBody += '<p>Hello Mr. AVINASH,</p>';
  // patientMessageBody += '<p>Your appointment(ASDF) is confirmed with Dr.WERT on '+dateTimeConvertion+'.</p>';
  // patientMessageBody += '<p>Join this appointment from your computer/laptop : http://3.7.234.106:8100 </p>';
  // patientMessageBody += '<p>Stay healthy, stay safe!!</p>';
  // patientMessageBody += '<p>Thank you for choosing MedleyMed</p>';
  // patientMessageBody += '</body>';

  //   let transporter = nodemailer.createTransport({
  //     host: 'smtp.gmail.com',
  //     port: 587,
  //     secure: false,
  //     requireTLS: true,
  //     auth: {
  //         user: 'medley1109@gmail.com',
  //         pass: 'Medley@123'
  //     }
  //     });

  //     let mailOptions = {
  //      from: 'medley1109@gmail.com',
  //      to: 'avinash.a@medleymed.com',
  //      subject: 'Check Mail',
  //      html: patientMessageBody
  //     };

  //     let info = transporter.sendMail(mailOptions, function(err, info) {
  //       if (err) {
  //         console.log(err)
  //       } else {
  //         console.log(info);
  //       }
  //   });

  // var email = patientEmail.sendEmail('avinash.a@medleymed.com','Appointment Cancellation',messageBody);
};
// Ends here

//upload Doctor Medical Prescription Starts
exports.uploadDoctorMedicinePrescription = (req, res) => {

  //console.log("-----------------------");

  //return;

  const FILE_PATH = "./public/uploads/patient/prescriptions";
  if (!req.body || !req.body.patient_id) {
    res.status(400).send({ message: "Patient cannot be empty" });
  }

  // console.log("Hai AVINASh");
  // console.log(req.body);
  // console.log(req.body.medicaldoc_pic);
  // return;

  if (req.body.medicaldoc_pic == undefined) {
    // res.status(200).send({
    //   status: 204,
    //   error: true,
    //   message:
    //     "Kindly attach the Doctor Medical Prescription Image to proceed..",
    // });

    let updateAppointmentColumn = {
      status: req.body.status,
    };

    let updateColumn = {
      appointment_status: req.body.status,
    };

    let whereObject = {
      where: {
        patient_id: req.body.patient_id,
        appointment_id: req.body.appointment_id,
      },
    };

    Appointments.update(updateAppointmentColumn, {
      where: {
        appointment_confirm_id: req.body.appointment_id,
      },
    })
      .then((num) => {
        if (num == 1) {
          problem_tbl
            .update(updateColumn, {
              where: {
                appointment_id: req.body.appointment_id,
              },
            })
            .then((num) => {
              if (num == 1) {
                VitalInformation.update(updateColumn, {
                  where: {
                    appointment_id: req.body.appointment_id,
                  },
                }).then((num) => {
                  if (num == 1) {
                    Symptoms_tbl.update(updateColumn, {
                      where: {
                        appointment_id: req.body.appointment_id,
                      },
                    }).then((num) => {
                      if (num == 1) {
                        patient_past_history
                          .update(updateColumn, {
                            where: {
                              appointment_id: req.body.appointment_id,
                            },
                            logging: console.log,
                          })
                          .then((num) => {
                            if (num == 1) {
                              res.status(200).send({
                                status: 200,
                                error: false,
                                message: "Appointment Completed Sucessfully",
                              });
                            }
                          });
                      }
                    });
                  }
                });
              }
            });
        }
      })
      .catch((err) => {
        res.status(500).send({
          message:
            err.message || "Some error occurred while Completing Appointment.",
        });
      });
  } 
  else {
    if (
      req.body.medicaldoc_pic != "" &&
      req.body.medicaldoc_pic !== undefined
    ) {
      base64Img.img(
        req.body.medicaldoc_pic,
        FILE_PATH,
        Date.now(),
        function (err, filepath) {
          const pathArr = filepath.split("/");
          const fileName = pathArr[pathArr.length - 1];

          // var filename = fileName.replace(/[^\d,]/g, "");
          // var newfile = filename + ".jpeg";

          // var pathext = filepath.split(".");
          // var oldfile = filename + "." + pathext[1];
          // var imageData = "/uploads/patient/prescriptions/" + filename + ".jpeg";
          var imageData = "/uploads/patient/prescriptions/" + fileName;

          // console.log(imageData + " imageData ");
          // return;

          if (imageData) {
            let updateAppointmentColumn = {
              status: req.body.status,
              prescription_id: imageData,
            };

            let updateColumn = {
              appointment_status: req.body.status,
            };

            let whereObject = {
              where: {
                patient_id: req.body.patient_id,
                appointment_id: req.body.appointment_id,
              },
            };

            Appointments.update(updateAppointmentColumn, {
              where: {
                appointment_confirm_id: req.body.appointment_id,
              },
            }).then((num) => {
              if (num == 1) {
                problem_tbl
                  .update(updateColumn, {
                    where: {
                      appointment_id: req.body.appointment_id,
                    },
                  })
                  .then((num) => {
                    if (num == 1) {
                      VitalInformation.update(updateColumn, {
                        where: {
                          appointment_id: req.body.appointment_id,
                        },
                      }).then((num) => {
                        if (num == 1) {
                          Symptoms_tbl.update(updateColumn, {
                            where: {
                              appointment_id: req.body.appointment_id,
                            },
                          }).then((num) => {
                            if (num == 1) {
                              patient_past_history
                                .update(updateColumn, {
                                  where: {
                                    appointment_id: req.body.appointment_id,
                                  },
                                  logging: console.log,
                                })
                                .then((num) => {
                                  if (num == 1) {
                                    //   updated final preint result


                                    let attachmentData = [];
                                    const filepath ="./public/uploads/patient/prescriptions/" + fileName;
                                    if (fs.existsSync(filepath)) {
                                      attachmentData = [
                                        {
                                          filename: fileName,
                                          path: filepath,
                                          contentType: "application/pdf",
                                        },
                                      ];
                    
                                      //console.log("---------", filepath);

                                      //return;


                                      let appointmentDateTime =   data[0].patient_appointment_tbls[0].appointment_datetime;
                    
                                      var myDate = new Date(appointmentDateTime);
                                      const dateTimeConvertion =
                                        moment(myDate).format("MM") +
                                        " " +
                                        moment(myDate).format("MMMM") +
                                        ", " +
                                        moment(myDate).format("YYYY") +
                                        " at " +
                                        moment(myDate).format("hh:mm a");
                    
                                      let patientMessageBody = "";
                                      let doctorMessageBody = "";
                                      let patientSMSMessageBody = "";
                    
                                      let patientEmailAddress = userTableData[0].email;
                                      patientMessageBody +=
                                        "<p>Hello " + surName + data[0].name + ",</p>";
                                      patientMessageBody +=
                                        "<p>Please find your prescription from  Dr." +
                                        docData[0].tbl_user.name +
                                        " on " +
                                        dateTimeConvertion +
                                        ".</p>";
                                      patientMessageBody += "<p>Stay healthy, stay safe!!</p>";
                                      patientMessageBody +=
                                        "<p>Thank you for choosing MedleyMed</p>";
                    
                                        dd = "nhrakesh@gmail.com"; //patientEmailAddress
                                        var email = patientEmail.sendEmail(
                                          dd,
                                          "Prescription Generated",
                                          patientMessageBody,
                                          attachmentData
                                        );
                    
                    
                                    }






                                    res.status(200).send({
                                      status: 200,
                                      error: false,
                                      message: "Prescription saved Sucessfully",
                                      imagePath: imageData,
                                    });
                                  }
                                });
                            }
                          });
                        }
                      });
                    }
                  });
              }
            });
          } else {
            res.status(200).send({
              status: 204,
              error: true,
              message: "Re attached the image once..",
            });
          }
        }
      );
    }
  }
};
// Ends here

// Retrieve patient Next appointment Details
exports.getPatientNextAppointmentDateTime = (req, res) => {
  let appointmentid = req.params.appointmentid;
  Appointments.findAll({
    where: {
      appointment_confirm_id: appointmentid,
    },
    attributes: [
      "id",
      "next_appointment_datetime",
      "patient_id",
      "doctor_id",
      "appointment_confirm_id",
    ],
  })
    .then((data) => {
      message = "";
      res.status(200).send({
        status: 200,
        error: false,
        message: "Doctor next appointment Details fetched successfully",
        data: data,
      });
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving Appointments.",
      });
    });
};
// get next appointment Details Ends here

// Update next appointment Details starts here
exports.createPatientNextAppointmentDateTime = (req, res) => {
  const appointmentId = req.params.appointmentid;
  if (req.body.data) {
    req.body = req.body.data;
  }
  Appointments.update(req.body, {
    where: {
      appointment_confirm_id: appointmentId,
    },
  })
    .then((num) => {
      if (num == 1) {
        res.status(200).send({
          status: 200,
          error: false,
          message: "Doctor Next appointment details updated Successfully",
        });
      } else {
        res.send({
          message: `Cannot update Appointments with id=${appointmentId}. Maybe Appointments was not found or req.body is empty!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error updating Audit Trail",
      });
    });
};
// next appointment Details Update Ends

// Retrieve patient Diagnosis Details
exports.getPatientFinalDiagnosis = (req, res) => {
  let appointmentid = req.params.appointmentid;
  Appointments.findAll({
    where: {
      appointment_confirm_id: appointmentid,
    },
    attributes: [
      "id",
      "final_diagnosis",
      "patient_id",
      "doctor_id",
      "appointment_confirm_id",
    ],
  })
    .then((data) => {
      message = "";
      res.status(200).send({
        status: 200,
        error: false,
        message: "Doctor final diagnosis Details fetched successfully",
        data: data,
      });
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving Appointments.",
      });
    });
};
// get Final Diagnosis Ends here

// Update a Final Diagnosis starts here
exports.createPatientFinalDiagnosis = (req, res) => {
  const appointmentId = req.params.appointmentid;
  if (req.body.data) {
    req.body = req.body.data;
  }
  Appointments.update(req.body, {
    where: {
      appointment_confirm_id: appointmentId,
    },
  })
    .then((num) => {
      if (num == 1) {
        res.status(200).send({
          status: 200,
          error: false,
          message: "Doctor final Diagnosis details updated Successfully",
        });
      } else {
        res.send({
          message: `Cannot update Appointments with id=${appointmentId}. Maybe Appointments was not found or req.body is empty!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error updating Audit Trail",
      });
    });
};
// Final Diagnosis Update Ends

// Retrieve all Patient Appointment from the Patient Appointment list.
exports.getDoctorAdvice = (req, res) => {
  let appointmentid = req.params.appointmentid;
  Appointments.findAll({
    where: {
      appointment_confirm_id: appointmentid,
    },
    attributes: [
      "id",
      "doctor_advice",
      "patient_id",
      "doctor_id",
      "appointment_confirm_id",
    ],
  })
    .then((data) => {
      message = "";
      res.status(200).send({
        status: 200,
        error: false,
        message: "Doctor Advice Details fetched successfully",
        data: data,
      });
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving Appointments.",
      });
    });
};

// Update a Patient Appointment by the id in the request
exports.createDoctorAdvice = (req, res) => {
  const appointmentId = req.params.appointmentid;
  if (req.body.data) {
    req.body = req.body.data;
  }
  Appointments.update(req.body, {
    where: {
      appointment_confirm_id: appointmentId,
    },
  })
    .then((num) => {
      if (num == 1) {
        res.status(200).send({
          status: 200,
          error: false,
          message: "Doctor advice updated Successfully",
        });
      } else {
        res.send({
          message: `Cannot update Appointments with id=${appointmentId}. Maybe Appointments was not found or req.body is empty!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error updating Audit Trail",
      });
    });
};

exports.getConsultNowPatientRequests = (req, res) => {
  const patientId = req.params.patientId;
  let message = "";
  const currentTime = moment().format("HH:mm:ss");
  const substrat1Minutes = moment().subtract(1, "minutes").format("HH:mm:ss");
  const currentDate = moment().format("YYYY-MM-DD");
  // console.log("currentTime "+currentTime+" currentDate "+currentDate+" substrat5Minutes "+substrat5Minutes);
  consultNowDraft
    .findAll({
      where: {
        master_patient_id: patientId,
        appointment_date: currentDate,
        appointment_time: {
          [Op.gte]: substrat1Minutes,
        },
      },
      //attributes: {
      // exclude: ["createdAt", "updatedAt", "status"],
      // },
    })
    .then((data) => {
      let recordsCount = data.length;
      message = "Appointment Requested list fetched successfully";
      if (recordsCount == 0) {
        message = "No records found";
      }
      res.status(200).send({
        status: 200,
        error: false,
        message: message,
        data: data,
      });
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving Appointments.",
      });
    });
};

exports.getConsultNowDoctorConfirmation = (req, res) => {
  const doctorId = req.params.doctorId;
  let message = "";
  consultNowDraft
    .findAll({
      where: {
        doctor_id: doctorId,
        status: 0,
      },
      // attributes: {
      //   exclude: ["createdAt", "updatedAt", "status"],
      // },
    })
    .then((data) => {
      let recordsCount = data.length;
      message = "Waiting appointment list fetched successfully";
      if (recordsCount == 0) {
        message = "No records found";
      }
      res.status(200).send({
        status: 200,
        error: false,
        message: message,
        data: data,
      });
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving Appointments.",
      });
    });
};

exports.updateConsultNowDoctorConfirmation = (req, res) => {
  if (!req.body) {
    res.status(400).send({ message: "Content cannot be empty" });
  } else {
    const appointmentId = req.params.appointmentId;
    let displayText = "";
    let nextPage = "";
    let previousPage = "";
    if (req.body.status == 1) {
      displayText = "Rejected";
    } else if (req.body.status == 2) {
      displayText = "Accepted";
      (nextPage = { pageName: "Patientconfirmappointment" }),
        (previousPage = { pageName: "Patientmedicalhistory" });
    }
    consultNowDraft
      .update(req.body, {
        where: {
          status: 0,
          appointment_id: appointmentId,
        },
      })
      .then((num) => {
        if (num == 1) {
          res.status(200).send({
            status: 200,
            error: false,
            message:
              "Doctor " + displayText + " the Consultation Successfully..",
            nextPage: nextPage,
            previousPage: previousPage,
          });
        } else {
          res.send({
            message: `Cannot update Consultation with id=${appointmentId}. Maybe Consultation was not found or req.body is empty!`,
          });
        }
      })
      .catch((err) => {
        res.status(500).send({
          message: "Error updating Audit Trail with id=" + appointmentId,
        });
      });
  }
};

// upcoming appointments for patients......
function autoRejectDraftAppointments() {
  consultNowDraft.findAll().then(function (appointdata) {
    appointdata.forEach((element) => {
      if (element.status === 0) {
        let appointmentTime = element.appointment_time;
        const currentTime = moment().format("HH:mm");
        const currentTime2Minutes = moment().add(4, "minutes").format("HH:mm");
        const appointmentTime2Minutes = moment(appointmentTime, "HH:mm")
          .add(2, "minutes")
          .format("HH:mm");
        // console.log(currentTime+" >>> "+currentTime2Minutes+" << ");
        // console.log(appointmentTime+" >>> "+appointmentTime2Minutes+" << ");
        if (appointmentTime2Minutes < currentTime) {
          var updateval = { status: 1 };
          let whereobject = { where: { status: 0 } };
          consultNowDraft.update(updateval, whereobject).then((result) => {
            // console.log(element.id+" Updated to 1");
          });
        }
      }
    });
  });
}
// Ends here

exports.ConsultNowDoctorConfirmation = (req, res) => {
  if (!req.body) {
    response.status(400).send({ message: "Content cannot be empty" });
  } else {
    let appointmentId = req.body.appointment_id;
    let reqTime = req.body.appointment_time;
    let reqDate = req.body.appointment_date;
    let patientId = req.body.patient_id;
    let doctorId = req.body.doctor_id;
    const appointmentTimeA2Minutes = moment(reqTime, "HH:mm")
      .add(2, "minutes")
      .format("HH:mm");
    const currentTime = moment().utcOffset("+05:30").format("HH:mm");
    const currentTimeA2Minutes = moment().add(2, "minutes").format("HH:mm");
    autoRejectDraftAppointments();
    console.log(
      currentTime + " >> currentTime >> " + appointmentTimeA2Minutes + " <<  "
    );
    // findAndCountAll
    delay(function () {
      consultNowDraft
        .findAndCountAll({
          where: {
            appointment_id: req.body.appointment_id,
            patient_id: req.body.patient_id,
            doctor_id: req.body.doctor_id,
            master_patient_id: req.body.master_patient_id,
            appointment_date: moment().format("YYYY-MM-DD"),

            // appointment_time: {
            //   [Op.between]: [reqTime, currentTimeA2Minutes],
            // },

            //  appointment_time: {
            //   [Op.lte]: currentTimeA2Minutes,
            // },

            [Op.or]: [
              {
                status: 0,
              },
              {
                status: 1,
              },
              {
                status: 2,
              },
            ],

            // status: {
            //   [Op.ne]: 2,
            // },
          },
          order: [["id", "DESC"]],
          limit: 1,
        })
        .then((data) => {
          // res.send({
          //   data : data
          // });
          // return;
          let rowsCount = data.count;
          if (rowsCount > 0) {
            let reqStatus = data.rows[0].status;
            if (reqStatus == 0 || reqStatus == 1 || reqStatus == 2) {
              let oldReqTime = data.rows[0].appointment_time;
              const oldAppointmentTimeA2Minutes = moment(oldReqTime, "HH:mm")
                .add(2, "minutes")
                .format("HH:mm");
              if (oldAppointmentTimeA2Minutes >= currentTime) {
                res.status(200).send({
                  status: 200,
                  error: false,
                  requestStatus: reqStatus,
                  message: "Your Appointment Request has been already sent.",
                });
              } else {
                consultNowDraft.create(req.body).then((data) => {
                  const auditTrailVal = {
                    user_id: data.id,
                    trail_type: "Admin",
                    trail_message:
                      "Consultnow Draft was created Successfully.Appointment Confirmation request sent to Doctor..",
                    status: 1,
                  };
                  AuditTrail.create(auditTrailVal, (err, data) => {});
                  res.status(200).send({
                    status: 200,
                    error: false,
                    message:
                      "Consultnow Draft was created Successfully.Appointment Confirmation request sent to Doctor..",
                    currentTime: currentTime,
                    added2Minutes: appointmentTimeA2Minutes,
                    requestStatus: 0,
                  });
                });
              }
            }
          } else {
            consultNowDraft.create(req.body).then((data) => {
              const auditTrailVal = {
                user_id: data.id,
                trail_type: "Admin",
                trail_message:
                  "Consultnow Draft was created Successfully.Appointment Confirmation request sent to Doctor..",
                status: 1,
              };
              AuditTrail.create(auditTrailVal, (err, data) => {});
              res.status(200).send({
                status: 200,
                error: false,
                message:
                  "Consultnow Draft was created Successfully.Appointment Confirmation request sent to Doctor..",
                currentTime: currentTime,
                added2Minutes: appointmentTimeA2Minutes,
                requestStatus: 0,
              });
            });
          }

          // res.status(200).send({
          //    count : data.count,
          //    result : data.rows,
          //    responseLength : response
          // });

          // if(count == 0){
          //   if(appointmentTimeA2Minutes >= reqTime && count == 0){

          // }
          // // }
          // else{
          //     consultNowDraft
          //     .findAll({
          //       where: {
          //         appointment_id: req.body.appointment_id,
          //         patient_id: req.body.patient_id,
          //         doctor_id: req.body.doctor_id,
          //         master_patient_id:req.body.master_patient_id,
          //       },
          //       raw: true,
          //       order: [["id", "DESC"]],
          //     })
          //     .then((data) => {
          //       res.status(200).send({
          //         status: 200,
          //         error: false,
          //         requestStatus: data[0].status,
          //         message:
          //           "Your Appointment Request has been already sent.",
          //       });
          //     });
          // }
        });
    }, 1000);

    // Return Start
    // if(appointmentTime2Minutes < currentTime){
    //   var updateval = { status: 1 };
    //   let whereobject = {
    //     where: {
    //     appointment_id : req.body.appointment_id,
    //     patient_id : req.body.patient_id,
    //     doctor_id : req.body.doctor_id,
    //     master_patient_id:req.body.master_patient_id,
    //     status: 0
    //   } };
    //   consultNowDraft.update(updateval, whereobject).then((result) => {
    //       consultNowDraft.create(req.body).then((data) => {
    //         const auditTrailVal = {
    //           user_id: data.id,
    //           trail_type: "Admin",
    //           trail_message:
    //             "Consultnow Draft was created Successfully.Appointment Confirmation request sent to Doctor..",
    //           status: 1,
    //         };
    //         AuditTrail.create(auditTrailVal, (err, data) => {});
    //         res.status(200).send({
    //           status: 200,
    //           error: false,
    //           message:
    //             "Consultnow Draft was created Successfully.Appointment Confirmation request sent to Doctor..",
    //         });
    //       });
    //   });
    // }

    // else{
    //     consultNowDraft
    //     .findAll({
    //       where: {
    //         appointment_id: req.body.appointment_id,
    //         patient_id: req.body.patient_id,
    //         doctor_id: req.body.doctor_id,
    //         master_patient_id:req.body.master_patient_id,
    //       },
    //       raw: true,
    //     })
    //     .then((data) => {
    //       res.status(200).send({
    //         status: 200,
    //         error: false,
    //         requestStatus: data[0].status,
    //         message:
    //           "Appointment Request sent already with that appointment Id..",
    //       });
    //     });
    // }
    // return;

    // consultNowDraft
    //   .count({
    //     where: {
    //       appointment_id : req.body.appointment_id,
    //       patient_id : req.body.patient_id,
    //       doctor_id : req.body.doctor_id,
    //       master_patient_id:req.body.master_patient_id,
    //     },
    //   })
    //   .then((count) => {
    //     if (count === 0) {
    // consultNowDraft.create(req.body).then((data) => {
    //   const auditTrailVal = {
    //     user_id: data.id,
    //     trail_type: "Admin",
    //     trail_message:
    //       "Consultnow Draft was created Successfully.Appointment Confirmation request sent to Doctor..",
    //     status: 1,
    //   };
    //   AuditTrail.create(auditTrailVal, (err, data) => {});
    //   res.status(200).send({
    //     status: 200,
    //     error: false,
    //     message:
    //       "Consultnow Draft was created Successfully.Appointment Confirmation request sent to Doctor..",
    //   });
    // });
    // } else {
    //   consultNowDraft
    //     .findAll({
    //       where: {
    //         appointment_id: req.body.appointment_id,
    //         patient_id: req.body.patient_id,
    //         doctor_id: req.body.doctor_id,
    //         master_patient_id:req.body.master_patient_id,
    //       },
    //       raw: true,
    //     })
    //     .then((data) => {
    //       res.status(200).send({
    //         status: 200,
    //         error: false,
    //         requestStatus: data[0].status,
    //         message:
    //           "Appointment Request sent already with that appointment Id..",
    //       });
    //     });
    // }

    //     });
  }
};

// Don't Disturb Starts here
var delay = (function () {
  var timer = 0;
  return function (callback, ms) {
    clearTimeout(timer);
    timer = setTimeout(callback, ms);
  };
})();
// Ends here

exports.doctorConsultationHistoryDetails = (req, res) => {
  if (!req.body) {
    response.status(400).send({ message: "Content cannot be empty" });
  } else {
    const doctorId = req.body.doctorId;
    // 1 - booked
    // 2 - inprogress
    // 3 - completed
    // 4 - canceled
    // 5 - draft
    const appointmentStartDate = req.body.fromDate;
    const appointmentEndDate = req.body.toDate;

    Patient.hasMany(Appointments, { foreignKey: "patient_id" });
    Appointments.belongsTo(Patient, { foreignKey: "patient_id" });
    Doctor.hasMany(Appointments, { foreignKey: "doctor_id" });
    Appointments.belongsTo(Doctor, { foreignKey: "doctor_id" });

    var ff = appointmentStartDate.split(" ");
    var ss = appointmentEndDate.split(" ");
    var str1 = "00-00-00";
    var str2 = "23-59-00";
    const newString1 = ff[0].concat(" ").concat(str1);
    const newString2 = ss[0].concat(" ").concat(str2);

    //  [Op.between]: [appointmentStartDate, appointmentEndDate],
    var condition = {
      appointment_datetime: {
        [Op.between]: [newString1, newString2],
      },
      doctor_id: doctorId,
      status: { [Op.notIn]: [1, 2, 5] },
    };

    Appointments.findAll({
      where: condition, // raw: false,
      order: [["id", "DESC"]],
      include: [{ model: Patient }, { model: Doctor }],
    }).then(function (records) {
      let count = records.length;
      if (count > 0) {
        res.status(200).send({
          status: 200,
          error: false,
          message: "Consultation History Details Fetched Sucessfully..",
          data: records,
        });
      } else {
        res.status(200).send({
          status: 200,
          error: false,
          message: "No Booked Appointments were found..",
          data: [],
        });
      }
    });
  }
};

exports.doctorAppointmentHistoryDetails = (req, res) => {
  if (!req.body) {
    response.status(400).send({ message: "Content cannot be empty" });
  } else {
    const doctorId = req.params.doctorId;
    // var condition = { doctor_id: doctorId };
    // 1 - booked
    // 2-inprogress
    // 3-completed
    // 4-canceled
    // 5-draft
    Patient.hasMany(Appointments, { foreignKey: "patient_id" });
    Appointments.belongsTo(Patient, { foreignKey: "patient_id" });

    Appointments.findAll({
      // where: condition,
      where: {
        status: { [Op.notIn]: [5] },
        doctor_id: doctorId,
      },
      include: [{ model: Patient }],
    }).then(function (records) {
      let count = records.length;
      if (count > 0) {
        res.status(200).send({
          status: 200,
          error: false,
          message: "Doctor Appointment History Details Fetched Sucessfully..",
          data: records,
        });
      } else {
        res.status(200).send({
          status: 200,
          error: false,
          message: "No Booked Appointments were found..",
          data: [],
        });
      }
    });
  }
};

exports.callStartedNotificationStatus = (req, res) => {
  if (!req.body) {
    response.status(400).send({ message: "Content cannot be empty" });
  } else {
    const notificationValues = {
      user_id: req.body.user_id,
      type: req.body.type,
      title: req.body.title,
      message: req.body.message,
    };
    const appointmentValues = {
      status: 2, //req.body.appointment_status,
    };
    let action = "Started";
    // if (req.body.appointment_status == 2) {
    //   action = "Started";
    // } else if (req.body.appointment_status == 3) {
    //   action = "Ended";
    // }
    Appointments.update(appointmentValues, {
      where: {
        appointment_confirm_id: req.body.appointment_id,
      },
    }).then((num) => {
      // console.log(num + " Num ");
      if (num == 1) {
        Notifications.create(notificationValues).then((data) => {
          const auditTrailVal = {
            user_id: data.id,
            trail_type: "Admin",
            trail_message: "Notification was created Successfully",
            status: 1,
          };
          AuditTrail.create(auditTrailVal, (err, data) => {});
          res.status(200).send({
            status: 200,
            error: false,
            message:
              "Call " +
              action +
              " Notification sent and Status updated Sucessfully",
          });
        });
      } else {
        res.send({
          message: `Cannot update Appointments with id=${req.body.appointment_id}. Maybe Appointments was not found or req.body is empty!`,
        });
      }
    });
  }
};

exports.diagnosticsfindOne = (req, res) => {
  let maxLength = 100;
  const id = req.params.id;
  let count = (id - 1) * maxLength;
  // offset: count,
  // limit: maxLength,
  diagnostics
    .findAll({
      
      attributes: ["id", "labtest_name"],
    })
    .then((data) => {
      res.status(200).send({
        status: 200,
        error: false,
        message: "Diagnostics Details Fetched Sucessfully..",
        data: data,
      });
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving Responders.",
      });
    });
};

exports.getRouteDetails = (req, res) => {
  if (!req.body) {
    response.status(400).send({ message: "Content cannot be empty" });
  } else {
    let frequency = [
      "Once Daily",
      "Twice Daily",
      "Thrice Daily",
      "Quarter Daily",
      "As directed by the Physician",
    ];
    let Dosage = ["Morning", "Day", "Night", "After Food", "Before Food"];
    medicineDetail
      .findAll({
        group: ["medicine_type_name"],
        where: {
          category: [
            "Tablet",
            "Capsules",
            "Lozenges",
            "Powders",
            "Granules",
            "Ointment/Gel/Creams/Lotions",
            "Syrups",
            "Patch",
            "Injections",
            "Suppositories",
            "Inhalers",
            "Ear drops",
            "Eye drops",
            "Ophthalmic ointment / Gel",
            "Nasal Drops",
          ],
          route_order: {
            [Sequelize.Op.not]: "0",
          },
          status: 1,
        },
        attributes: {
          exclude: ["createdAt", "updatedAt"],
          include: [Sequelize.fn("max", Sequelize.col("id")), "id"],
        },
      })
      .then(function (records) {
        let routeArray;
        routeArray = { route: records, frequency: frequency, dosage: Dosage };
        res.status(200).send({
          status: 200,
          error: false,
          length: records.length,
          message: "Routes Details Fetched Sucessfully..",
          data: routeArray,
        });
      });
  }
};

exports.PatientAppointmentDetails = (req, res) => {
  if (!req.body) {
    response.status(400).send({ message: "Content cannot be empty" });
  } else {
    const appointmentId = req.params.appointmentId;
    var condition = { appointment_confirm_id: appointmentId };

    Patient.hasMany(Appointments, { foreignKey: "patient_id" });
    Appointments.belongsTo(Patient, { foreignKey: "patient_id" });
    Doctor.hasMany(Appointments, { foreignKey: "doctor_id" });
    Appointments.belongsTo(Doctor, { foreignKey: "doctor_id" });
    Users.hasOne(Doctor, { foreignKey: "user_id" });
    Doctor.belongsTo(Users, { foreignKey: "user_id" });
    Appointments.findAll({
      where: condition,
      include: [
        { model: Patient },
        { model: Doctor, include: [{ model: Users, attributes: ["name"] }] },
      ],
      // raw: false,
      // include: [{ model: Patient }, { model: Doctor }],
    }).then(function (records) {
      //  console.log('Length '+records.length);
      let count = records.length;
      if (count > 0) {
        res.status(200).send({
          status: 200,
          error: false,
          message: "Appointment Details Fetched Sucessfully..",
          data: records,
        });
      } else {
        res.status(200).send({
          status: 200,
          error: false,
          message: "No Booked Appointments were found..",
          data: [],
        });
      }
    });
  }
};

exports.todayAppointmentDetails = (req, res) => {
  if (!req.body) {
    response.status(400).send({ message: "Content cannot be empty" });
  } else {
    //console.log("---------", req.body.doctorId+"----"+req.body.status)
    const doctorId = req.body.doctorId;
    const consultationStatus = req.body.status;
    const appointmentDate = req.body.appointmentDate;
    const todayDate = moment().format("YYYY-MM-DD");
    doctorappointstatuschecks(doctorId);
    Patient.hasMany(Appointments, { foreignKey: "patient_id" });
    Appointments.belongsTo(Patient, { foreignKey: "patient_id" });
    var condition;
    if (consultationStatus) {
      condition = {
        appointment_datetime: { [Op.like]: "%" + appointmentDate + "%" },
        doctor_id: doctorId,
        status: consultationStatus,
       
      };
    } else {
      condition = {
        appointment_datetime: { [Op.like]: "%" + appointmentDate + "%" },
        doctor_id: doctorId,
        status: { [Op.notIn]: [5] },
        
      };
    }

    Appointments.findAll({
      where: condition,
      // raw: true,
      include: [{ model: Patient }],
      attributes: { exclude: ["createdAt", "updatedAt"] },
      order: [["appointment_datetime", "ASC"]],
    }).then(function (records) {
      //  console.log('Length '+records.length);
      let count = records.length;
      if (count > 0) {
        res.status(200).send({
          status: 200,
          error: false,
          message: "Appointment Details Fetched Sucessfully..",
          data: records,
        });
      } else {
        res.status(200).send({
          status: 200,
          error: false,
          message: "No Booked Appointments were found..",
          data: [],
        });
      }
    });
  }
};


// --- New added by 02/04/2021
// upcoming appointments for patients......
function doctorappointstatuschecks(doctorid) {
  Appointments.findAll({ where: { doctor_id : doctorid } }).then(
    function (appointdata) {

      appointdata.forEach((element) => {
        Doctor.findOne({ where: { id: element.doctor_id } }).then(function (docdet) {
          if (docdet.slot_duration) {
            // console.log("-----", docdet.slot_duration);
            //var dt = dateTime.create();
           // console.log("---- slot duration for doctor ---", encryption.decryptData(docdet.slot_duration));
            //var currentdate = dt.format("Y-m-d H:M:S");
            var currentdate = moment().format("YYYY-MM-DD HH:mm:ss");
            var oldDateObj = new Date(element.appointment_datetime);
            var newDateObj = new Date();
            newDateObj.setTime(oldDateObj.getTime() + encryption.decryptData(docdet.slot_duration) * 60 * 1000);
            var start_date = moment(newDateObj, "YYYY-MM-DD HH:mm:ss");
            var end_date = moment(currentdate, "YYYY-MM-DD HH:mm:ss");
            //  console.log("---- appoint date ---", element.appointment_datetime);
            // console.log("---- start_date ---", start_date);
            // console.log("---- currentdate ---", currentdate); 
            var ltdate = moment(end_date).add(5, 'hours');   
            var fdate = moment(ltdate).add(30, 'minutes');               
            var duration = moment.duration(start_date.diff(fdate));
            var days = duration.asDays();
            var dateInUtc = new Date(Date.parse(currentdate+" UTC"));
            var dateInLocalTz =   new Date(dateInUtc.getTime() + dateInUtc.getTimezoneOffset()*60*1000)                                 //convertUtcToLocalTz(dateInUtc);
           // console.log("---- currentdate.toString(), ---",  moment(dateInLocalTz.toISOString()).format("YYYY-MM-DD HH:mm:ss"));
           //Appointments.update({ next_appointment_datetime : moment(dateInLocalTz.toISOString()).format("YYYY-MM-DD HH:mm:ss"), clinic_id : 10 }, { where : { id : 253 } })
            if (days < 0) {
              //  let updateval = { status: 4 };
              if (element.status === 1) {
                var updateval = { status: 4 };
              } else if (element.status === 2) {
                var updateval = { status: 3 };
              }
              let whereobject = { where: { id: element.id } };
              Appointments.update(updateval, whereobject).then((result) => {
                if (result == 1) {
                  //console.log(result+" result "+element.doctor_id+" Doctor Id "+element.patient_id+" Patient Id");
                  // if (element.status === 1) {
                  //let patientId = element.patient_id;
                  let doctorId = element.doctor_id;
                  let uniqId = element.appointment_confirm_id;
                  let appointmentDateTime = element.appointment_datetime;
                  var myDate = new Date(appointmentDateTime);
                  const dateTimeConvertion =
                    moment(myDate).format("MM") +
                    " " +
                    moment(myDate).format("MMMM") +
                    ", " +
                    moment(myDate).format("YYYY") +
                    " at " +
                    moment(myDate).format("hh:mm a");

                  let patientMessageBody = "";
                  let doctorMessageBody = "";

                  userTbl
                    .findAll({
                      where: {
                        id: doctorId,
                      },
                    })
                    .then((patientData) => {
                      // userTbl.hasOne(Doctor, { foreignKey: "user_id" });
                      // Doctor.belongsTo(userTbl, { foreignKey: "user_id" });
                      // Doctor.findAll({
                      //   where: { id: doctorId },
                      //   include: [{ model: userTbl, attributes: ["name"] }],
                      // }).then((doctorData) => {
                        // let patientEmailAddress = patientData[0].email;
                        // //patientMessageBody +=
                        // //   '<meta http-equiv="Content-Type"  content="text/html charset=UTF-8" /><body>';
                        // patientMessageBody +=
                        //   "<p>Hello Mr. " + patientData[0].name + ",</p>";
                        // patientMessageBody +=
                        //   "<p>Your appointment(" +
                        //   patientData[0].name +
                        //   ") is Cancelled with Dr." +
                        //   doctorData[0].tbl_user.name +
                        //   " on " +
                        //   dateTimeConvertion +
                        //   ".</p>";

                        // // patientMessageBody +=
                        // // "<p>Join this appointment from your computer/laptop : <a href='http://3.7.234.106:8100'>http://3.7.234.106:8100</a> </p>";
                        // patientMessageBody +=
                        //   "<p>Stay healthy, stay safe!!</p>";
                        // patientMessageBody +=
                        //   "<p>Thank you for choosing MedleyMed</p>";
                        // patientMessageBody += "</body>";

                        //patientEmailAddress
                        // var email = patientEmail.sendEmail(
                        //   patientEmailAddress,
                        //   "Appointment Auto Cancellation",
                        //   patientMessageBody
                        // );

                        // res.status(200).send({
                        //   status: 200,
                        //   error: false,
                        //   message: "Doctor was fetched successfully.",
                        //   patientData: patientData,
                        //   doctorData: doctorData,
                        // });
                      //});
                    })
                    .catch((err) => {
                      res.status(500).send({
                        message:
                          err.message ||
                          "Some error occurred while retrieving Patient.",
                      });
                    });
                  // }
                }
              });
            }
          }
        });
      });
    }
  );
}


// --- New code end





exports.todayAppointmentDetailsCount = (req, res) => {
  if (!req.body) {
    response.status(400).send({ message: "Content cannot be empty" });
  } else {
    const doctorId = req.body.doctorId;
    const consultationDate = req.body.consultationDate;
    const todayDate = moment().format("YYYY-MM-DD");

    if (consultationDate >= todayDate) {
      let patientCount = 0;
      let revenueSum = 0;
      let appointmentModuleCount;
      let patientUpcomingAppointmentCount = 0;
      let patientInprogressAppointmentCount = 0;
      let patientCompletedAppointmentCount = 0;
      let patientCancelledAppointmentCount = 0;

      Appointments.count({
        where: {
          doctor_id: doctorId,
          // module_type: 'telemedicine-app',
          appointment_datetime: {
            [Op.like]: "%" + consultationDate + "%",
          },
          status: {
            [Op.ne]: 5,
          },
        },
      }).then((patCount) => {
        if (patCount > 0) {
          patientCount = patCount;
          Appointments.count({
            where: {
              doctor_id: doctorId,
              // module_type: 'telemedicine-app',
              appointment_datetime: {
                [Op.like]: "%" + consultationDate + "%",
              },
              status: "1",
            },
          }).then((upcomingCount) => {
            patientUpcomingAppointmentCount = upcomingCount;

            Appointments.count({
              where: {
                doctor_id: doctorId,
                // module_type: 'telemedicine-app',
                appointment_datetime: {
                  [Op.like]: "%" + consultationDate + "%",
                },
                status: "2",
              },
            }).then((inprogressCount) => {
              patientInprogressAppointmentCount = inprogressCount;
              Appointments.count({
                where: {
                  doctor_id: doctorId,
                  // module_type: 'telemedicine-app',
                  appointment_datetime: {
                    [Op.like]: "%" + consultationDate + "%",
                  },
                  status: "3",
                },
              }).then((completedCount) => {
                patientCompletedAppointmentCount = completedCount;
                Appointments.count({
                  where: {
                    doctor_id: doctorId,
                    // module_type: 'telemedicine-app',
                    appointment_datetime: {
                      [Op.like]: "%" + consultationDate + "%",
                    },
                    status: "4",
                  },
                }).then((cancelledCount) => {
                  patientCancelledAppointmentCount = cancelledCount;

                  Appointments.findAll({
                    raw: true,
                    attributes: [
                      [
                        Sequelize.fn("SUM", Sequelize.col("consultation_fee")),
                        "totalAmount",
                      ],
                    ],
                    where: {
                      appointment_datetime: {
                        [Op.like]: "%" + consultationDate + "%",
                      },
                      status: "3",
                    },
                  }).then((response) => {
                    revenueSum = response[0].totalAmount;

                    let telemedicineArray = [
                      {
                        todayPatientCount: patientCount,
                        todayUpcomingCount: patientUpcomingAppointmentCount,
                        todayInprogressCount: patientInprogressAppointmentCount,
                        todayCompletedCount: patientCompletedAppointmentCount,
                        todayCancelledCount: patientCancelledAppointmentCount,
                      },
                    ];

                    let clinicArray = [
                      {
                        todayPatientCount: 0,
                        todayUpcomingCount: 0,
                        todayInprogressCount: 0,
                        todayCompletedCount: 0,
                        todayCancelledCount: 0,
                      },
                    ];

                    let revenueArray = [
                      {
                        todayTotalRevenue: parseInt(revenueSum),
                      },
                    ];

                    appointmentModuleCount = {
                      telemedicine: telemedicineArray,
                      clinic: clinicArray,
                      revenue: revenueArray,
                    };

                    res.status(200).send({
                      status: 200,
                      error: false,
                      message: "Today Appointment Count fetched Sucessfully...",
                      data: appointmentModuleCount,
                    });
                  });
                });
              });
            });
          });
        } else {
          let telemedicineArray = [
            {
              todayPatientCount: 0,
              todayUpcomingCount: 0,
              todayInprogressCount: 0,
              todayCompletedCount: 0,
              todayCancelledCount: 0,
            },
          ];

          let clinicArray = [
            {
              todayPatientCount: 0,
              todayUpcomingCount: 0,
              todayInprogressCount: 0,
              todayCompletedCount: 0,
              todayCancelledCount: 0,
            },
          ];
          let revenueArray = [
            {
              todayTotalRevenue: 0,
            },
          ];
          appointmentModuleCount = {
            telemedicine: telemedicineArray,
            clinic: clinicArray,
            revenue: revenueArray,
          };
          res.status(200).send({
            status: 200,
            error: false,
            message: "No Booked Appointments were found..",
            data: appointmentModuleCount,
          });
        }
      });
    } else {
      res.status(200).send({
        status: 204,
        error: false,
        message: "Chooses from Date was Greater or Equal to Todat's Date",
      });
    }
  }
};

exports.create = (req, res) => {
  if (!req.body) {
    response.status(400).send({ message: "Content cannot be empty" });
  } else {
    // console.log(request.body);
    Patient.findOne({
      where: { id: req.body.patient_id },
    }).then((resp) => {
      if (resp.relation_patient_id != "0") {
        var patient_creator = resp.relation_patient_id;
      } else {
        var patient_creator = req.body.patient_id;
      }

      const appointmentValues = {
        patient_id: req.body.patient_id,
        doctor_id: req.body.doctor_id,
        appointment_datetime: req.body.appointment_datetime,
        status: req.body.status,
        login_person_id: patient_creator,
        appointment_confirm_id: req.body.appointment_id,
        transaction_id: req.body.transaction_id,
        consultation_fee: req.body.consultation_fee,
        clinic_id: req.body.clinic_id,
        module_type: req.body.module_type,
      };
      Appointments.count({
        where: {
          appointment_confirm_id: req.body.appointment_id,
          patient_id: req.body.patient_id,
          doctor_id: req.body.doctor_id,
        },
      }).then((count) => {
        if (count === 0) {
          Appointments.create(appointmentValues)
            .then((data) => {
              let updateval = {
                appointment_status: 1,
                doctor_id: req.body.doctor_id,
              };
              let whereobject = {
                where: {
                  patient_id: req.body.patient_id,
                  appointment_id: req.body.appointment_id,
                },
              };
              problem_tbl
                .update(updateval, whereobject)
                .then((result) => {
                  VitalInformation.update(updateval, whereobject)
                    .then((result1) => {
                      Symptoms_tbl.update(updateval, whereobject)
                        .then((result2) => {
                          patient_past_history
                            .update(updateval, whereobject)
                            .then((result3) => {
                              // res.send(
                              //   "Patient Appointment was created Successfully"
                              // );
                              let patientId = req.body.patient_id;
                              let doctorId = req.body.doctor_id;
                              let uniqId = req.body.appointment_id;
                              let appointmentDateTime =
                                req.body.appointment_datetime;

                              var myDate = new Date(appointmentDateTime);
                              const dateTimeConvertion =
                                moment(myDate).format("MM") +
                                " " +
                                moment(myDate).format("MMMM") +
                                ", " +
                                moment(myDate).format("YYYY") +
                                " at " +
                                moment(myDate).format("hh:mm a");

                              let patientEmailMessageBody = "";
                              let doctorEmailMessageBody = "";
                              let patientSMSMessageBody = "";
                              let attachmentPath = "";

                              Users.hasOne(Patient, { foreignKey: "user_id" });
                              Patient.belongsTo(Users, {
                                foreignKey: "user_id",
                              });
                              Patient.findAll({
                                where: { id: patientId },
                                include: [Users],
                              })
                                .then((patientData) => {
                                  userTbl.hasOne(Doctor, {
                                    foreignKey: "user_id",
                                  });
                                  Doctor.belongsTo(userTbl, {
                                    foreignKey: "user_id",
                                  });
                                  Doctor.findAll({
                                    where: { id: doctorId },
                                    include: [
                                      {
                                        model: userTbl,
                                        attributes: ["name", "email"],
                                      },
                                    ],
                                  }).then((doctorData) => {
                                    let patientEmailAddress =
                                      patientData[0].tbl_user.email;
                                    let doctorEmailAddress =
                                      doctorData[0].tbl_user.email;
                                    // patientMessageBody +=
                                    //   '<meta http-equiv="Content-Type"  content="text/html charset=UTF-8" /><body>';
                                    patientEmailMessageBody +=
                                      "<p>Hello Mr. " +
                                      patientData[0].name +
                                      ",</p>";
                                    patientEmailMessageBody +=
                                      "<p>Your appointment(" +
                                      patientData[0].name +
                                      ") is Confirmed with Dr." +
                                      doctorData[0].tbl_user.name +
                                      " on " +
                                      dateTimeConvertion +
                                      ".</p>";

                                    patientEmailMessageBody +=
                                      "<p>Join this appointment from your computer/laptop : <a href='https://www.uzima.co.za'>uzima.co.za</a> </p>";
                                    patientEmailMessageBody +=
                                      "<p>Stay healthy, stay safe!!</p>";
                                    patientEmailMessageBody +=
                                      "<p>Thank you for choosing MedleyMed</p>";
                                    // patientMessageBody += "</body>";

                                    doctorEmailMessageBody +=
                                      "<p>Your appointment is confirmed with patient (" +
                                      patientData[0].name +
                                      ") on " +
                                      dateTimeConvertion +
                                      ".</p>";
                                    doctorEmailMessageBody +=
                                      "<p>Thank you for choosing MedleyMed</p>";

                                    if (patientEmailAddress) {
                                      // patientEmailAddress
                                      let patientEmailStatus = patientEmail.sendEmail(
                                        patientEmailAddress,
                                        "Appointment Booking Confirmation",
                                        patientEmailMessageBody,
                                        attachmentPath
                                      );
                                    }

                                    if (doctorEmailAddress) {
                                      // doctorEmailAddress
                                      let doctorEmailStatus = patientEmail.sendEmail(
                                        doctorEmailAddress,
                                        "Appointment Booking Confirmation",
                                        doctorEmailMessageBody,
                                        attachmentPath
                                      );
                                    }

                                    patientSMSMessageBody +=
                                      "Hello Mr. " +
                                      patientData[0].name +
                                      "," +
                                      "\n\n";
                                    patientSMSMessageBody +=
                                      "Your appointment is Confirmed with Dr." +
                                      doctorData[0].tbl_user.name +
                                      " on " +
                                      dateTimeConvertion +
                                      "\n\n";
                                    patientSMSMessageBody +=
                                      "Join this appointment from your computer/laptop :https://www.uzima.co.za\n\n";
                                    patientSMSMessageBody +=
                                      "Stay healthy, stay safe!!" + "\n\n";
                                    patientSMSMessageBody +=
                                      "Thank you for choosing MedleyMed" + "\n";

                                    if (patientData[0].mobile_number) {
                                      var url =
                                        "https://api.textlocal.in/send/?apikey=" +
                                        textLocalAPIKey +
                                        "&numbers=" +
                                        patientData[0].mobile_number +
                                        "&sender=" +
                                        textLocalSender +
                                        "&message=" +
                                        patientSMSMessageBody;
                                      axios
                                        .get(url)
                                        .then(function (response) {})
                                        .catch(function (error) {
                                          // console.log(error);
                                        });
                                    }

                                    res.status(200).send({
                                      status: 200,
                                      error: false,
                                      message:
                                        "Patient Appointment was created Successfully.",
                                      patientData: patientData,
                                      doctorData: doctorData,
                                    });
                                  });
                                })
                                .catch((err) => {
                                  res.status(500).send({
                                    message:
                                      err.message ||
                                      "Some error occurred while retrieving Patient.",
                                  });
                                });
                            })
                            .catch((err) => {
                              res.status(500).send({
                                message: err.message || err,
                              });
                            });
                        })
                        .catch((err) => {
                          res.status(500).send({
                            message: err.message || err,
                          });
                        });
                    })
                    .catch((err) => {
                      res.status(500).send({
                        message: err.message || err,
                      });
                    });
                })
                .catch((err) => {
                  res.status(500).send({
                    message: err.message || err,
                  });
                });

              const auditTrailVal = {
                user_id: data.id,
                trail_type: "Patient",
                trail_message: "Patient Appointment was created Successfully",
                status: 1,
              };
              AuditTrail.create(auditTrailVal, (err, data) => {});
              // res.status(200).send({
              //   status: 200,
              //   error: false,
              //   message: "Patient Appointment Created Successfully",
              // });
            })
            .catch((err) => {
              // console.log(err);
              res
                .status(500)
                .send({ error: `${err} while creating appointment` });
            });
        } else {
          res.status(200).send({
            status: 204,
            error: false,
            message: "Appointment already exists !!",
          });
        }
      });
    });
  }
};

// upcoming appointments for patients......
function appointstatuschecks(patientid) {
  Appointments.findAll({ where: { login_person_id: patientid } }).then(
    function (appointdata) {

      appointdata.forEach((element) => {
        Doctor.findOne({ where: { id: element.doctor_id } }).then(function (
          docdet
        ) {
          if (docdet.slot_duration) {
            // console.log("-----", docdet.slot_duration);
            //var dt = dateTime.create();
           // console.log("---- slot duration for doctor ---", encryption.decryptData(docdet.slot_duration));
            //var currentdate = dt.format("Y-m-d H:M:S");
            var currentdate = moment().format("YYYY-MM-DD HH:mm:ss");
            var oldDateObj = new Date(element.appointment_datetime);
            var newDateObj = new Date();
            newDateObj.setTime(oldDateObj.getTime() + encryption.decryptData(docdet.slot_duration) * 60 * 1000);
            var start_date = moment(newDateObj, "YYYY-MM-DD HH:mm:ss");
            var end_date = moment(currentdate, "YYYY-MM-DD HH:mm:ss");
            //  console.log("---- appoint date ---", element.appointment_datetime);
            // console.log("---- start_date ---", start_date);
            // console.log("---- currentdate ---", currentdate);
            var ltdate = moment(end_date).add(5, 'hours');   
            var fdate = moment(ltdate).add(30, 'minutes');              
            var duration = moment.duration(start_date.diff(fdate));
            var days = duration.asDays();
            var dateInUtc = new Date(Date.parse(currentdate+" UTC"));
            var dateInLocalTz =   new Date(dateInUtc.getTime() + dateInUtc.getTimezoneOffset()*60*1000)                                 //convertUtcToLocalTz(dateInUtc);
           // console.log("---- currentdate.toString(), ---",  moment(dateInLocalTz.toISOString()).format("YYYY-MM-DD HH:mm:ss"));
           //Appointments.update({ next_appointment_datetime : moment(dateInLocalTz.toISOString()).format("YYYY-MM-DD HH:mm:ss"), clinic_id : 10 }, { where : { id : 253 } })
            if (days < 0) {
              //  let updateval = { status: 4 };
              if (element.status === 1) {
                var updateval = { status: 4 };
              } else if (element.status === 2) {
                var updateval = { status: 3 };
              }
              let whereobject = { where: { id: element.id } };
              Appointments.update(updateval, whereobject).then((result) => {
                if (result == 1) {
                  //console.log(result+" result "+element.doctor_id+" Doctor Id "+element.patient_id+" Patient Id");
                  // if (element.status === 1) {
                  let patientId = element.patient_id;
                  let doctorId = element.doctor_id;
                  let uniqId = element.appointment_confirm_id;
                  let appointmentDateTime = element.appointment_datetime;
                  var myDate = new Date(appointmentDateTime);
                  const dateTimeConvertion =
                    moment(myDate).format("MM") +
                    " " +
                    moment(myDate).format("MMMM") +
                    ", " +
                    moment(myDate).format("YYYY") +
                    " at " +
                    moment(myDate).format("hh:mm a");

                  let patientMessageBody = "";
                  let doctorMessageBody = "";

                  userTbl
                    .findAll({
                      where: {
                        id: patientId,
                      },
                    })
                    .then((patientData) => {
                      userTbl.hasOne(Doctor, { foreignKey: "user_id" });
                      Doctor.belongsTo(userTbl, { foreignKey: "user_id" });
                      Doctor.findAll({
                        where: { id: doctorId },
                        include: [{ model: userTbl, attributes: ["name"] }],
                      }).then((doctorData) => {
                        let patientEmailAddress = patientData[0].email;
                        //patientMessageBody +=
                        //   '<meta http-equiv="Content-Type"  content="text/html charset=UTF-8" /><body>';
                        patientMessageBody +=
                          "<p>Hello Mr. " + patientData[0].name + ",</p>";
                        patientMessageBody +=
                          "<p>Your appointment(" +
                          patientData[0].name +
                          ") is Cancelled with Dr." +
                          doctorData[0].tbl_user.name +
                          " on " +
                          dateTimeConvertion +
                          ".</p>";

                        // patientMessageBody +=
                        // "<p>Join this appointment from your computer/laptop : <a href='http://3.7.234.106:8100'>http://3.7.234.106:8100</a> </p>";
                        patientMessageBody +=
                          "<p>Stay healthy, stay safe!!</p>";
                        patientMessageBody +=
                          "<p>Thank you for choosing MedleyMed</p>";
                        // patientMessageBody += "</body>";

                        //patientEmailAddress
                        var email = patientEmail.sendEmail(
                          patientEmailAddress,
                          "Appointment Auto Cancellation",
                          patientMessageBody
                        );

                        // res.status(200).send({
                        //   status: 200,
                        //   error: false,
                        //   message: "Doctor was fetched successfully.",
                        //   patientData: patientData,
                        //   doctorData: doctorData,
                        // });
                      });
                    })
                    .catch((err) => {
                      res.status(500).send({
                        message:
                          err.message ||
                          "Some error occurred while retrieving Patient.",
                      });
                    });
                  // }
                }
              });
            }
          }
        });
      });
    }
  );
}


function convertUtcToLocalTz(dateInUtc) {
  //Convert to local timezone
  return new Date(dateInUtc.getTime() - dateInUtc.getTimezoneOffset()*60*1000);
}
// upcoming appointments for patients......
exports.upcomingappointments = (req, res) => {
  let patient_id = req.params.patient_id;

   Patient.findOne({
    where: { id: patient_id },
  })
    .then((resp) => {
      if (resp.relation_patient_id != "0") {
        // console.log(resp.relation_patient_id)
        var patient_creator = resp.relation_patient_id;
      } else {
        var patient_creator = patient_id;
      }

      appointstatuschecks(patient_creator);

      Patient.hasMany(Appointments, { foreignKey: "patient_id" });
      Appointments.belongsTo(Patient, { foreignKey: "patient_id" });
      Users.hasOne(Doctor, { foreignKey: "user_id" });
      Doctor.belongsTo(Users, { foreignKey: "user_id" });
      masterrealtionships.hasOne(Patient, { foreignKey: "relation" });
      Patient.belongsTo(masterrealtionships, { foreignKey: "relation" });
      appointment_status_tbl.hasMany(Appointments, { foreignKey: "status" });
      Appointments.belongsTo(appointment_status_tbl, { foreignKey: "status" });
      Doctor.hasMany(Appointments, { foreignKey: "doctor_id" });
      Appointments.belongsTo(Doctor, { foreignKey: "doctor_id" });
      Clinic.hasMany(Appointments, { foreignKey: "clinic_id" });
      Appointments.belongsTo(Clinic, { foreignKey: "clinic_id" });

      Appointments.hasMany(feedback_tbl, { foreignKey: "row_id" });
      feedback_tbl.belongsTo(Appointments, { foreignKey: "row_id" });

      Appointments.findAll({
        include: [
          { model: appointment_status_tbl, attributes: ["statustype"] },
          { model: feedback_tbl },
          {
            model: Patient,
            attributes: ["name", "gender", "dob", "profile_pic"],
            include: [
              { model: masterrealtionships, attributes: ["relation_name"] },
            ],
          },
          {
            model: Doctor,
            attributes: {
              exclude: ["createdAt", "updatedAt"],
            },
            include: [{ model: Users, attributes: ["id", "name"] }],
          },
          {
            model: Clinic,
            attributes: [
              "clinic_name",
              "clinic_logo",
              "latitude",
              "longitude",
              "address",
            ],
          },
        ],
        where: {
          login_person_id: patient_creator,
          status: {
            [Op.ne]: 5,
          },
        },
        //order: [["createdAt", "DESC"]],
        order: [["appointment_datetime", "ASC"]],
      }).then((response) => {
        res.send({
          status: 200,
          error: false,
          message: "Patient upcoming Appointments Fetched Successfully",
          data: response,
        });
      });
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || err,
      });
    });
};

// Retrieve all Patient Appointment from the Patient Appointment list.
exports.findAll = (req, res) => {
  const appointmentStatus = req.body.status;
  let message = "";
  // console.log(req.body);
  // return;
  Appointments.findAll({
    where: {
      status: appointmentStatus,
    },
    attributes: {
      exclude: ["createdAt", "updatedAt", "id"],
    },
  })
    .then((data) => {
      let recordsCount = data.length;
      message = "Appointments records fetched successfully";
      if (recordsCount == 0) {
        message = "No records found";
      }
      res.status(200).send({
        status: 200,
        error: false,
        message: message,
        data: data,
      });
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving Appointments.",
      });
    });
};

// Find a single Patient Appointment with an Name
exports.findOne = (req, res) => {
  const appointmentId = req.params.id;
  Appointments.findAll({
    where: {
      appointment_confirm_id: appointmentId,
    },
    attributes: {
      exclude: [
        "createdAt",
        "updatedAt",
        "appointment_cancel_reason",
        "prescription_id",
        "id",
      ],
    },
  })
    .then((data) => {
      res.send({
        status: 200,
        message: "Appointments record Fetched Successfully",
        error: false,
        data: data,
      });
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving Appointments.",
      });
    });
};

// Update a Patient Appointment by the id in the request
exports.update = (req, res) => {
  const appointmentId = req.params.id;
  if (req.body.data) {
    req.body = req.body.data;
  }
  Appointments.update(req.body, {
    where: {
      appointment_confirm_id: appointmentId,
    },
  })
    .then((num) => {
      if (num == 1) {
        res.status(200).send({
          status: 200,
          error: false,
          message: "Patient Appointment updated Successfully",
        });
      } else {
        res.send({
          message: `Cannot update Appointments with id=${id}. Maybe Appointments was not found or req.body is empty!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error updating Audit Trail with id=" + id,
      });
    });
};

// Delete a Patient Appointment with the specified id in the request
exports.delete = (req, res) => {
  const appointmentId = req.params.id;
  Appointments.destroy({
    where: { appointment_confirm_id: appointmentId },
  })
    .then((num) => {
      if (num == 1) {
        res.send({
          status: 200,
          error: false,
          message: "Appointment Deleted Successfully",
        });
      } else {
        res.send({
          message: `Cannot delete Appointments with id=${id}. Maybe Appointments was not found!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Could not delete Appointments with id=" + id,
      });
    });
};

exports.doctorappointments = (req, res) => {};

exports.PatientMedicinecreate = (req, res) => {
  if (!req.body) {
    response.status(400).send({ message: "Content cannot be empty" });
  } else {
    // console.log(request.body);
    var dt = dateTime.create();
    var currentdate = dt.format("Y-m-d H:M:S");
    const medicineValues = {
      patient_id: req.body.patient_id,
      doctor_id: req.body.doctor_id,
      medicine_name: req.body.medicinename,
      //route: req.body.route,
      frequency: req.body.frequency,
      //duration: req.body.dosage,
      //days: req.body.days,
      quantity: req.body.qty,
      refill: req.body.refill,
      medicine_id: req.body.medicineid,
      appointment_unique_id: req.body.appointmentid,
      route: req.body.routeid,
      food: req.body.food,
      shift_one: req.body.shift_one,
      shift_two: req.body.shift_two,
      shift_three: req.body.shift_three,
      created_datetime: currentdate,
      clinic_id: req.body.clinic_id,
      module_type: req.body.module_type,
    };
    MedicineDetails.create(medicineValues)
      .then((data) => {
        res.status(200).send({
          status: 200,
          error: false,
          message: "Patient Medicine Created Successfully",
          data: data,
        });
      })
      .catch((err) => {
        // console.log(err);
        res.status(500).send({ error: `${err} while creating appointment` });
      });
  }
};

exports.PatientMedicineList = (req, res) => {
  let message = "";
  // console.log(req.body);
  // return;
  MedicineDetails.findAll({
    where: { appointment_unique_id: req.params.appointid },
  })
    .then((data) => {
      let recordsCount = data.length;

      message = "Patient Medicine fetched successfully";
      if (recordsCount == 0) {
        message = "No records found";
      }
      res.status(200).send({
        status: 200,
        error: false,
        message: message,
        data: data,
      });
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving Appointments.",
      });
    });
};

exports.PatientMedicineEdit = (req, res) => {
  let message = "";
  // console.log(req.body);
  // return;

  MedicineDetails.findAll({ where: { id: req.params.id } })
    .then((data) => {
      let recordsCount = data.length;

      message = "Patient Medicine fetched successfully";
      if (recordsCount == 0) {
        message = "No records found";
      }
      res.status(200).send({
        status: 200,
        error: false,
        message: message,
        data: data,
      });
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving Appointments.",
      });
    });
};

exports.PatientMedicineUpdate = (req, res) => {
  const id = req.params.id;
  var user_type = "Admin";
  var dt = dateTime.create();
  var currentdate = dt.format("Y-m-d H:M:S");
  const medicineValues = {
    patient_id: req.body.patient_id,
    doctor_id: req.body.doctor_id,
    medicine_name: req.body.medicinename,
    //route: req.body.route,
    frequency: req.body.frequency,
    //duration: req.body.dosage,
    //days: req.body.days,
    quantity: req.body.qty,
    refill: req.body.refill,
    medicine_id: req.body.medicineid,
    appointment_unique_id: req.body.appointmentid,
    route: req.body.routeid,
    food: req.body.food,
    shift_one: req.body.shift_one,
    shift_two: req.body.shift_two,
    shift_three: req.body.shift_three,
    modified_datetime: currentdate,
    clinic_id: req.body.clinic_id,
  };
  MedicineDetails.update(medicineValues, {
    where: { id: id },
  })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: "Patient Medicine was updated successfully.",
        });
      } else {
        res.send({
          message: `Cannot update Patient Medicine with id=${id}. Maybe Patient Medicine was not found or req.body is empty!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error updating Patient Medicine with id=" + id,
      });
    });
};

exports.PatientMedicineDelete = (req, res) => {
  const id = req.params.id;
  MedicineDetails.destroy({
    where: { id: id },
  })
    .then((num) => {
      if (num == 1) {
        res.send({
          status: 200,
          error: false,
          message: "Patient Medicine Deleted Successfully",
        });
      } else {
        res.send({
          message: `Cannot delete Patient Medicine with id=${id}. Maybe Patient Medicine was not found!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Could not delete Patient Medicine with id=" + id,
      });
    });
};

exports.PatientDiagnostics = (req, res) => {
  var appointmentid = req.params.appointid;
  var patientid = req.params.patientid;
  const appointmentValues = {
    medicine_desc: req.body.diagnostics,
  };

  Appointments.update(appointmentValues, {
    where: { appointment_confirm_id: appointmentid, patient_id: patientid },
  })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: "Patient Diagnostics was updated successfully.",
        });
      } else {
        res.send({
          message: `Cannot update Patient Diagnostics with id=${appointmentid}. Maybe Patient Diagnostics was not found or req.body is empty!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error updating Patient Diagnostics with id=" + appointmentid,
      });
    });
};

exports.prescriptionUpload = (req, res) => {
  const FILE_PATH = "./public/uploads/patient/Prescriptiondocuments";
  const upload = multer({
    dest: `${FILE_PATH}/`,
    limits: {
      fileSize: 10 * 1024 * 1024,
    },
  }).single("myImage");
  upload(req, res, (err) => {
    if (req.file != undefined) {
      var imageData =
        "/uploads/patient/Prescriptiondocuments/" + req.file.filename + ".jpeg"; //fs.readFileSync(req.file.path);
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
        "./public/uploads/patient/Prescriptiondocuments/" + oldfile,
        "./public/uploads/patient/Prescriptiondocuments/" + newfile
      );
      var imgobjData = { diseases_desc: imageData };

      Appointments.update(imgobjData, {
        where: { appointment_confirm_id: req.params.appointmentid },
      }).then((data) => {
        //users_image.create(data)
        // const auditTrailVal = {
        //   'user_id' : id,
        //   'trail_type' : user_type.charAt(0).toUpperCase() + user_type.slice(1)+'Language Modules',
        //   'trail_message' : newfile+ ' '+  ' is Language Image is'+user_type.charAt(0).toUpperCase() + user_type.slice(1),
        //   'status': 1
        // }
        // AuditTrail.create(auditTrailVal,(err,data)=>{
        //      if(err){
        //        console.log(err)
        //      }else{
        //        console.log("created")
        //      }
        //  })

        // res.send(200).end();
        return res.send({
          message: "Patient Prescription Uploaded successfully.",
        });
      });
    } else {
      return res.status(500).send({
        message: "Some error occurred while Image is Empty.",
      });
    }
  });
};

exports.PatientPrescriptiongen = (req, res) => {
  let resultArray = [];

  const appointmentId = req.params.appointid;
  const patientId = req.params.patientid;

  Patient.hasMany(problem_tbl, { foreignKey: "patient_id" });
  problem_tbl.belongsTo(Patient, { foreignKey: "patient_id" });

  Patient.hasMany(Symptoms_tbl, { foreignKey: "patient_id" });
  Symptoms_tbl.belongsTo(Patient, { foreignKey: "patient_id" });

  Patient.hasMany(VitalInformation, { foreignKey: "patient_id" });
  VitalInformation.belongsTo(Patient, { foreignKey: "patient_id" });

  Patient.hasMany(patient_past_history, { foreignKey: "patient_id" });
  patient_past_history.belongsTo(Patient, { foreignKey: "patient_id" });

  Patient.hasMany(MedicineDetails, { foreignKey: "patient_id" });
  MedicineDetails.belongsTo(Patient, { foreignKey: "patient_id" });

  Patient.hasMany(Appointments, { foreignKey: "patient_id" });
  Appointments.belongsTo(Patient, { foreignKey: "patient_id" });

  Patient.findAll({
    where: {
      id: patientId,
    },
    include: [
      {
        model: problem_tbl,
        required: false,
        where: { appointment_id: appointmentId },
        attributes: { exclude: ["createdAt", "updatedAt", "id"] },
      },
      {
        model: Symptoms_tbl,
        where: { appointment_id: appointmentId },
        required: false,
        attributes: {
          exclude: [
            "createdAt",
            "updatedAt",
            "infermedica_suggestive_diagnosis",
            "question",
            "suggestive_api_data",
          ],
        },
      },
      {
        model: VitalInformation,
        where: { appointment_id: appointmentId },
        required: false,
        attributes: { exclude: ["createdAt", "updatedAt"] },
      },
      {
        model: patient_past_history,
        required: false,
        where: { appointment_id: appointmentId },
        attributes: { exclude: ["createdAt", "updatedAt"] },
      },
      {
        model: MedicineDetails,
        required: false,
        where: { appointment_unique_id: appointmentId },
        attributes: { exclude: ["createdAt", "updatedAt"] },
      },
      { 
        model: Appointments,
        required: false,
        where: { appointment_confirm_id: appointmentId },
        attributes: { exclude: ["createdAt", "updatedAt"] },
      },
    ],
  })
    .then((data) => {
      const problemTableLength = data[0].problem_tbls.length;
      const SymptomsTableLength = data[0].symptoms_tbls.length;
      const vitalsTableLength = data[0].vital_informations.length;
      const medicalHistoryTableLength = data[0].patient_past_histories.length;
      const appointmentTableLength = data[0].patient_appointment_tbls.length;
      const medicineTableLength = data[0].medicine_details.length;

      // console.log("problemTableLength >>" + problemTableLength);
      // console.log("SymptomsTableLength >>" + SymptomsTableLength);
      // console.log("vitalsTableLength >>" + vitalsTableLength);
      // console.log("medicalHistoryTableLength >>" + medicalHistoryTableLength);
      // console.log("appointmentTableLength >>" + appointmentTableLength);
      // console.log("medicineTableLength >>" + medicineTableLength);

      let count = data.length;
      if (count > 0) {
        if (appointmentTableLength > 0) {
          let doctorId = data[0].patient_appointment_tbls[0].doctor_id;
          Users.hasOne(Doctor, { foreignKey: "user_id" });
          Doctor.belongsTo(Users, { foreignKey: "user_id" });
          Doctor.findAll({
            where: {
              id: doctorId,
            },
            include: [
              {
                model: Users,
                attributes: ["id", "name","mobile_number"],
                order: [["name", "desc"]],
              },
            ],
            order: [[{ model: Users }, "name", "ASC"]],
            attributes: {
              exclude: ["createdAt", "updatedAt"],
            },
          }).then((docData) => {
            //console.log(docData);
            let patientAge = "N/A";
            let dob1 = moment(data[0].dob).format("YYYY-MM-DD");
            let ageYears = moment().diff(dob1, "years");
            let ageMonths = moment().diff(dob1, "months");
            let ageDays = moment().diff(dob1, "days");
            if (ageYears > 0) {
              patientAge = ageYears + " Years";
            } else if (ageMonths != "") {
              patientAge = ageMonths + " Months";
            } else if (ageDays != "") {
              patientAge = ageDays + " Days";
            }

            let surName = "Mr. ";
            if (data[0].gender == "Female") {
              surName = "Ms. ";
            }
            let labTests = "N/A";
            if (
              SymptomsTableLength > 0 &&
              data[0].symptoms_tbls[0].patient_lab_tests
            ) {
              let patientLabTests = data[0].symptoms_tbls[0].patient_lab_tests;
              let patientLabTestLength = patientLabTests.length;
              // console.log(patientLabTests);
              // console.log(patientLabTestLength + " patientLabTestLength ");

              if (patientLabTestLength > 0) {
                labTests = patientLabTests
                  .map(function (e) {
                    return e.labtest_name;
                  })
                  .join(", ");
              }
            }

            let medicineDetails = "N/A";

            {
              /* <tr style='background: #EAEAEA 0% 0% no-repeat padding-box;opacity: 1;'>
              <td style='padding: 10px;vertical-align: top;font-size: 15px;font-family: sans-serif;'>1. Dolo Tablet 650</td>
              <td style='padding: 10px;vertical-align: top;font-size: 15px;font-family: sans-serif;text-align: center;'>1</td>
              <td style='padding: 10px;vertical-align: top;font-size: 15px;font-family: sans-serif;text-align: center;'>
              <p style='vertical-align: top;font-size: 15px;font-family: sans-serif;text-align: center;margin:0px'>0</p>
              <h5 style='vertical-align: top;font-size: 10px;font-family: sans-serif;text-align: center;margin:8px 0px'>After Food</h5>
              </td>
              <td style='padding: 10px;vertical-align: top;font-size: 15px;font-family: sans-serif;text-align: center;'>1</td>
              <td style='padding: 10px;vertical-align: top;font-size: 15px;font-family: sans-serif;'>Daily 2 Months</td>
              </tr> */
            }

            let problem = "N/A";
            if (problemTableLength > 0) {
              problem = data[0].problem_tbls[0].problem;
            }

            let pulseRate = "N/A";
            let blood_pressure_systolic = "N/A";
            let blood_pressure_diastolic = "N/A";
            let blood_sugar = "N/A";
            let temperature = "N/A";
            let respiratory_rate = "N/A";
            let height = "N/A";
            let bmi = "N/A";
            let weight = "N/A";

            if (vitalsTableLength > 0) {
              pulseRate = data[0].vital_informations[0].pulse_rate + " BPM";
              blood_pressure_systolic =
                data[0].vital_informations[0].blood_pressure_systolic +
                " mmhg-";
              blood_pressure_diastolic =
                data[0].vital_informations[0].blood_pressure_diastolic +
                " mmhg";
              blood_sugar= data[0].vital_informations[0].blood_sugar +" ml";
              temperature = data[0].vital_informations[0].temperature + " F";
              respiratory_rate =
                data[0].vital_informations[0].respiratory_rate + " BPM";
              height = data[0].vital_informations[0].height + " ft";
              bmi = data[0].vital_informations[0].bmi + " Kg/m2";
              weight = data[0].vital_informations[0].weight + " Kg";
            }

            // console.log(temperature + " >> temperature");

            // return;

            // let pdfgeneratehtml =
            //   "<div class='modal-content'><div class='modal-header'><div class='row'><div class='col-md-6 no_padding'><div class='patient_content'><h4>" +
            //   surName + data[0].name +  "</h4><p>" +
            //   data[0].gender +  ", " + patientAge +
            //   "</p><p>Patient UHID: <span>" +
            //   data[0].id +
            //   "</span></p></div></div><div class='col-md-6 no_padding'><div class='doc_content text-right'><h6>" +
            //   moment().format("DD-MM-YY") +
            //   "|" +
            //   moment().format("hh:mm A") +
            //   "</h6><h2>Dr. " +
            //   docData[0].tbl_user.name +
            //   "</h2>";
            // pdfgeneratehtml +=
            //   "<p>" +
            //   docData[0].education +
            //   "</p><h6>" +
            //   docData[0].speciality +
            //   "</h6><h6> N/A </h6>";
            // //  pdfgeneratehtml +=
            // //   "<p> Doctor Education </p><h6> Doctor Speciality </h6><h6> N/A </h6>";
            // pdfgeneratehtml += "</div></div></div></div>";
            // pdfgeneratehtml +=
            //   "<div class='modal-body'><div class='vital_info'><div class='vital_head'><h2>vital information</h2></div><div class='vital_table'><table class='table table-bordered'><tbody><tr><td>Pulse Rate: <span>" +
            //   pulseRate +
            //   " </span></td><td>Blood Pressure: <span>" +
            //   blood_pressure_systolic +
            //   "  " +
            //   blood_pressure_diastolic +
            //   " </span></td><td>Blood Glucose: <span>ml</span></td>";
            // pdfgeneratehtml +=
            //   "</tr><tr><td>Temperature: <span>" +
            //   temperature +
            //   "</span></td><td>Respiratory Rate:<span>" +
            //   respiratory_rate +
            //   "</span></td><td></td></tr><tr><td>Height: <span>" +
            //   height +
            //   " </span></td><td>BMI :<span>" +
            //   bmi +
            //   " </span></td><td>Weight: <span>" +
            //   weight +
            //   "</span></td></tr></tbody></table></div>";
            // pdfgeneratehtml +=
            //   "<div class='prev_det'><h2>Past Medical History</h2><p>" +
            //   problem +
            //   "</p></div><div class='prev_det'><h2>Diagnosis</h2><p>" +
            //   data[0].patient_appointment_tbls[0].final_diagnosis +
            //   "</p></div><div class='prev_det'>";
            // pdfgeneratehtml += "<h2>Lab Test</h2>";
            // pdfgeneratehtml += "<p>" + labTests + "</p>";
            // pdfgeneratehtml += "</div><div class='prev_det'><h2>Medicines</h2>";
            // pdfgeneratehtml += "<div class='table-responsive'>";
            // pdfgeneratehtml +=
            //   "<table class='table '><thead ><tr><th>Drug Name</th><th scope='col'  colspan='3'>Dosage</th><th scope='col' >Time and Duration</th></tr><tr><th scope='col'></th><th scope='col'>M</th> <th scope='col' >D</th><th scope='col'>N</th><th scope='col' ></th></tr></thead>";
            // pdfgeneratehtml += "<tbody>";
            // pdfgeneratehtml += rowData;
            // // pdfgeneratehtml +=
            // //   "<tr> <td>Medicine Name</td> <td>Dosage M </td> <td>Dosage D </td> <td>Dosage N </td>  <td>Time and Duration</td>  </tr>";
            // pdfgeneratehtml += "</tbody>";
            // pdfgeneratehtml += "</table>";
            // pdfgeneratehtml += "</div></div>";
            // // pdfgeneratehtml += "<div class='prev_sign'>";
            // // // <img src='http://3.7.234.106:8100/logo192.png' width ='100px' height='100px'/>"
            // // pdfgeneratehtml +=
            // //   "<div class='prev_sign'><img width ='50px' height='50px' src='https://www.pinclipart.com/picdir/middle/195-1958407_png-file-svg-drugs-icon-png-clipart.png' />";
            // // pdfgeneratehtml += "<p>Signature</p></div>";
            // // pdfgeneratehtml += "</div>";
            // pdfgeneratehtml += "</div></div>";

            let diagnosisDetails = "N/A";
            let followUpDate="N/A";
            let doctorAdvice="N/A";
            if (data[0].patient_appointment_tbls[0].final_diagnosis != null) {
              diagnosisDetails =
                data[0].patient_appointment_tbls[0].final_diagnosis;
            }
            if (data[0].patient_appointment_tbls[0].next_appointment_datetime != null) {
              followUpDate =
                data[0].patient_appointment_tbls[0].next_appointment_datetime;
            }
            if (data[0].patient_appointment_tbls[0].doctor_advice != null) {
              doctorAdvice =
                data[0].patient_appointment_tbls[0].doctor_advice;
            }
            if(docData[0].speciality)
            {
              if(docData[0].speciality!=null){
             var speciality = docData[0].speciality;
              }else{
                var speciality ="";
              }
            }
            else
            {
             var speciality = ""//docData[0].speciality;
            }
            
            // console.log("diagnosisDetails "+data[0].patient_appointment_tbls[0].final_diagnosis);

            let pdfgeneratehtml =
              "<div style='margin: 10px 20px;display: block;'><div style='margin: 5px 0px;display: inline-block;width: 100%;'>";
            pdfgeneratehtml +=
              "<div style='width:50%;float:left;'><h4 style='letter-spacing: 0px;color: #000000;font-size:13px;margin:2px 0px;opacity: 1;font-family: sans-serif;'>" +
              surName +
              data[0].name +
              "</h4>";
            pdfgeneratehtml +=
              "<p style='letter-spacing: 0px;color: #000000;font-size:11px;margin:2px 0px;opacity: 1;font-family: sans-serif;'>" +
              patientAge +
              " years , " +
              data[0].gender +
              "</p>";
            pdfgeneratehtml +=
              "<p style='letter-spacing: 0px;color: #000000;font-size:11px;margin:2px 0px;opacity: 1;font-family: sans-serif;'>Patient UHID: <span>" +
              data[0].id +
              "</span></p>";
            pdfgeneratehtml +=
              "</div><div style='float: right;width:50%;text-align:right;'><p style='letter-spacing: 0px;color: #000000;font-size:11px;margin:2px 0px;opacity: 1;font-family: sans-serif;'>" +
              moment().format("DD-MM-YY") +
              " | " +
              moment().format("hh:mm A") +
              "</p>";
            pdfgeneratehtml +=
              "<h4 style='letter-spacing: 0px;color: #000000;font-size:13px;margin:2px 0px;opacity: 1;font-family: sans-serif;'>Dr. " +
              docData[0].tbl_user.name +
              "</h4>";
            pdfgeneratehtml +=
              "<p style='letter-spacing: 0px;color: #000000;font-size:11px;margin:2px 0px;opacity: 1;font-family: sans-serif;'>" +
              docData[0].education +
              "</p>";
            pdfgeneratehtml +=
              "<p style='letter-spacing: 0px;color: #000000;font-size:11px;margin:2px 0px;opacity: 1;font-family: sans-serif;'>" +
               speciality +
              "</span></p>";
            pdfgeneratehtml +=
              "<p style='letter-spacing: 0px;color: #000000;font-size:11px;margin:2px 0px;opacity: 1;font-family: sans-serif;'>M: "+ docData[0].tbl_user.mobile_number+"</p>";
            pdfgeneratehtml += "</div></div>";
            pdfgeneratehtml +=
              "<div class='hr' style='border: 1px solid #464646;opacity: 1;width:100%;'></div>";
            pdfgeneratehtml += "<div style='width:100%;'>";
            pdfgeneratehtml +=
              "<h4 style='letter-spacing: 0px;color: #000000;font-size:13px;margin:5px 0px;opacity: 1;font-family: sans-serif;'>Vitals Information</h4>";
            pdfgeneratehtml +=
              "<table class='table table-bordered' style='border: 1px solid #dee2e6;width: 100%;font-family: sans-serif; margin-bottom: 1rem;background-color: transparent;border-collapse: collapse;'>";
            pdfgeneratehtml += "<tbody>";
            pdfgeneratehtml += "<tr>";
            pdfgeneratehtml +=
              "<td style='padding:6px 10px;font-weight: 500;vertical-align: top;font-size:  11px;border: 1px solid #8D8D8D;font-family: sans-serif;'>Pulse Rate: <span>" +
              pulseRate +
              "</span></td>";
            pdfgeneratehtml +=
              "<td style='padding:6px 10px;font-weight: 500;vertical-align: top;font-size: 11px;border: 1px solid #8D8D8D;font-family: sans-serif;'>Blood Pressure: <span>" +
              blood_pressure_systolic +
              " - " +
              blood_pressure_diastolic +
              "</span></td>";
            pdfgeneratehtml +=
              "<td style='padding:6px 10px;font-weight: 500;vertical-align: top;font-size:  11px;border: 1px solid #8D8D8D;font-family: sans-serif;'>Blood Sugar: <span>"+blood_sugar+"</span></td>";
            pdfgeneratehtml += "</tr>";
            pdfgeneratehtml += "<tr>";
            pdfgeneratehtml +=
              "<td style='padding:6px 10px;font-weight: 500;vertical-align: top;font-size: 11px;border: 1px solid #8D8D8D;font-family: sans-serif;'>Temperature: <span>" +
              temperature +
              "</span></td>";
            pdfgeneratehtml +=
              "<td style='padding:6px 10px;font-weight: 500;vertical-align: top;font-size:  11px;border:1px solid #8D8D8D;font-family: sans-serif;'>Respiratory Rate:<span>" +
              respiratory_rate +
              "</span></td>";
            pdfgeneratehtml += "<td  style='padding:6px 10px;font-weight: 500;vertical-align: top;font-size:  11px;border:1px solid #8D8D8D;font-family: sans-serif;'></td>";
            pdfgeneratehtml += "</tr>";
            pdfgeneratehtml += "<tr>";
            pdfgeneratehtml +=
              "<td style='padding:6px 10px;font-weight: 500;vertical-align: top;font-size:  11px;border: 1px solid #8D8D8D;font-family: sans-serif;'>Height: <span>" +
              height +
              "</span></td>";
            pdfgeneratehtml +=
              "<td style='padding:6px 10px;font-weight: 500;vertical-align: top;font-size: 11px;border: 1px solid #8D8D8D;font-family: sans-serif;'>Weight: <span>" +
              weight + 
              "</span></td>";
              pdfgeneratehtml +=
              "<td style='padding:6px 10px;font-weight: 500;vertical-align: top;font-size: 11px;border: 1px solid #8D8D8D;font-family: sans-serif;'>BMI :<span>" +
              bmi +
              "</span></td>";
            pdfgeneratehtml += "</tr>";
            pdfgeneratehtml += "</tbody>";
            pdfgeneratehtml += "</div>";
            pdfgeneratehtml += "</table>";
            pdfgeneratehtml += "</div>";
            pdfgeneratehtml += "<div style='margin:12px 0px;'>";
            pdfgeneratehtml +=
              "<h4 style='letter-spacing: 0px;color: #000000;font-size:11px;margin:5px 0px;opacity: 1;font-family: sans-serif;'>Purpose of consultation</h4>";
            pdfgeneratehtml +=
              "<p style='margin:2px 0px;font-weight: 500;vertical-align: top;font-size: 11px;font-family: sans-serif;'>" +
              problem +
              "</p>";
            pdfgeneratehtml += "</div>";
            pdfgeneratehtml += "<div style='margin:12px 0px;'>";
            pdfgeneratehtml +=
              "<h4 style='letter-spacing: 0px;color: #000000;font-size:11px;margin:5px 0px;opacity: 1;font-family: sans-serif;'>Diagnosis</h4>";
            pdfgeneratehtml +=
              "<p style='margin:2px 0px;font-weight: 500;vertical-align: top;font-size: 11px;font-family: sans-serif;'>" +
              diagnosisDetails +
              "</p>";
            pdfgeneratehtml += "</div>";
            pdfgeneratehtml += "<div style='margin:12px 0px;'>";
            pdfgeneratehtml +=
              "<h4 style='letter-spacing: 0px;color: #000000;font-size:11px;margin:5px 0px;opacity: 1;font-family: sans-serif;'>Diagnosis Test</h4>";
            pdfgeneratehtml +=
              " <p style='margin:2px 0px;font-weight: 500;vertical-align: top;font-size: 11px;font-family: sans-serif;'>" +
              labTests +
              "</p>";
            pdfgeneratehtml += " </div>";
            pdfgeneratehtml += " <div style='margin:12px 0px;'>";
            pdfgeneratehtml +=
              " <h4 style='letter-spacing: 0px;color: #000000;font-size:11px;margin:5px 0px;opacity: 1;font-family: sans-serif;'>Medicines</h4>";
            pdfgeneratehtml +=
              "<div class='table-responsive' style='display: block;width: 100%;overflow-x: auto;'>";
            pdfgeneratehtml +=
              " <table class='table ' style='width: 100%;margin-bottom: 1rem;border-collapse: collapse;background-color: transparent;'>";
            pdfgeneratehtml +=
              " <thead style='background: #5D5D5D 0% 0% no-repeat padding-box;opacity: 1;'>";
            pdfgeneratehtml += " <tr>";
            pdfgeneratehtml +=
              "<th style='vertical-align: bottom;border-bottom: none;padding: 6px 10px;color: #fff;border: none;font-size: 11px;font-family: sans-serif;text-align: left;' scope='col'>Drug Name</th>";
            pdfgeneratehtml +=
              " <th style='vertical-align: bottom;border-bottom: none;padding: 6px 10px;color: #fff;border: none;font-size: 11px;font-family: sans-serif;text-align: center;' scope='col'  colspan='3'>Dosage</th>";
            pdfgeneratehtml +=
              " <th style='vertical-align: bottom;border-bottom: none;padding: 6px 10px;color: #fff;border: none;font-size: 11px;font-family: sans-serif;text-align: left;' scope='col' >Time and Duration</th>";
            pdfgeneratehtml += " </tr>";
            pdfgeneratehtml += "<tr>";
            pdfgeneratehtml += "<th scope='col'></th>";
            pdfgeneratehtml +=
              "<th style='vertical-align: bottom;border-bottom: none;padding: 6px 10px;color: #fff;border: none;font-size: 11px;font-family: sans-serif;text-align: center;' scope='col'>M</th>";
            pdfgeneratehtml +=
              "<th style='vertical-align: bottom;border-bottom: none;padding: 6px 10px;color: #fff;border: none;font-size: 11px;font-family: sans-serif;text-align: center;' scope='col' >D</th>";
            pdfgeneratehtml +=
              "<th style='vertical-align: bottom;border-bottom: none;padding: 6px 10px;color: #fff;border: none;font-size: 11px;font-family: sans-serif;text-align: center;' scope='col'>N</th>";
            pdfgeneratehtml += "<th scope='col' ></th>";
            pdfgeneratehtml += "</tr>";
            pdfgeneratehtml += "</thead>";
            pdfgeneratehtml += "<tbody>";

            // pdfgeneratehtml += "<tr style='background: #EAEAEA 0% 0% no-repeat padding-box;opacity: 1;'>";
            // pdfgeneratehtml += " <td style='padding: 10px;vertical-align: top;font-size: 12px;font-family: sans-serif;'>1. Dolo Tablet 650</td>";
            // pdfgeneratehtml += " <td style='padding: 10px;vertical-align: top;font-size: 12px;font-family: sans-serif;text-align: center;'>1</td>";
            // pdfgeneratehtml += " <td style='padding: 10px;vertical-align: top;font-size: 12px;font-family: sans-serif;text-align: center;'>";
            // pdfgeneratehtml += "  <p style='vertical-align: top;font-size: 12px;font-family: sans-serif;text-align: center;margin:0px'>0</p>";
            // pdfgeneratehtml += " <h5 style='vertical-align: top;font-size: 10px;font-family: sans-serif;text-align: center;margin:8px 0px'>After Food</h5>";
            // pdfgeneratehtml += "</td>";
            // pdfgeneratehtml += "<td style='padding: 10px;vertical-align: top;font-size: 12px;font-family: sans-serif;text-align: center;'>1</td>";
            // pdfgeneratehtml += " <td style='padding: 10px;vertical-align: top;font-size: 12px;font-family: sans-serif;'>Daily 2 Months</td>";
            // pdfgeneratehtml += " </tr>";

            let rowData = "";

            if (medicineTableLength > 0) {
              let patientMedicineDetails = data[0].medicine_details;
              let patientMedicineDetailsLength = patientMedicineDetails.length;
              let M="0";
              let D="0";
              let N="0";
              if (patientMedicineDetailsLength > 0) {
                for (var i = 0; i < patientMedicineDetails.length; i++) {
                  
                  if(patientMedicineDetails[i].shift_one!=""){
                    M="1";
                  }
                  if(patientMedicineDetails[i].shift_two!=""){
                    D="1";
                  }
                  if(patientMedicineDetails[i].shift_three!=""){
                    N="1";
                  }
                  rowData +=
                    "<tr style='background: #EAEAEA 0% 0% no-repeat padding-box;opacity: 1;'>";
                  if (patientMedicineDetails[i].medicine_name) {
                    rowData +=
                      "<td style='padding:6px 10px;vertical-align: top;font-size: 11px;font-family: sans-serif;'>" +
                      
                      
                      " " +
                      patientMedicineDetails[i].medicine_name +
                      "</td>";
                  } 
                  else {
                    rowData += "<td>N/A</td>";
                  }
                  if (patientMedicineDetails[i].food) {
                    rowData +=
                      "<td  style='padding:6px 10px;vertical-align: top;font-size: 11px;font-family: sans-serif;text-align: center;'> <p style='vertical-align: top;font-size: 11px;font-family: sans-serif;text-align: center;margin:0px'>"+M+"</p>";
                    rowData +=
                      "<h5 style='vertical-align: top;font-size: 8px;font-family: sans-serif;text-align: center;margin:5px 0px;color:#000;font-weight:300;'>" +
                      patientMedicineDetails[i].food +
                      "</h5></td>";
                  } else {
                    rowData += "<td>N/A</td>";
                  }
                  if (patientMedicineDetails[i].food) {
                    rowData +=
                      "<td  style='padding:6px 10px;vertical-align: top;font-size: 11px;font-family: sans-serif;text-align: center;'> <p style='vertical-align: top;font-size: 11px;font-family: sans-serif;text-align: center;margin:0px'>"+D+"</p>";
                    rowData +=
                      "<h5 style='vertical-align: top;font-size: 8px;font-family: sans-serif;text-align: center;margin:5px 0px;color:#000;font-weight:300;'>" +
                      patientMedicineDetails[i].food +
                      "</h5></td>";
                  } else {
                    rowData += "<td>N/A</td>";
                  }
                  if (patientMedicineDetails[i].food) {
                    rowData +=
                      "<td  style='padding:6px 10px;vertical-align: top;font-size: 11px;font-family: sans-serif;text-align: center;'> <p style='vertical-align: top;font-size: 11px;font-family: sans-serif;text-align: center;margin:0px'>"+N+"</p>";
                    rowData +=
                      "<h5 style='vertical-align: top;font-size: 8px;font-family: sans-serif;text-align: center;margin:5px 0px;color:#000;font-weight:300;'>" +
                      patientMedicineDetails[i].food +
                      "</h5></td>";
                  } else {
                    rowData += "<td>N/A</td>";
                  }
                  rowData +=
                    "<td style='padding:6px 10px;vertical-align: top;font-size: 11px;font-family: sans-serif;'>" +
                    patientMedicineDetails[i].frequency +
                    "</td>";
                  rowData += "</tr>";
                }
              } else {
                rowData +=
                  "<tr style='background: #EAEAEA 0% 0% no-repeat padding-box;opacity: 1;font-size: 8px;font-family: sans-serif;text-align: center;margin:5px 0px;color:#000;font-weight:300;'>No Medicines Found</tr>";
              }
            } else {
              rowData +=
                "<tr style='background: #EAEAEA 0% 0% no-repeat padding-box;opacity: 1;font-size: 8px;font-family: sans-serif;text-align: center;margin:5px 0px;color:#000;font-weight:300;'>No Medicines Found</tr>";
            }

            pdfgeneratehtml += rowData;
            pdfgeneratehtml += "</tbody>";
            pdfgeneratehtml += "</table>";
            pdfgeneratehtml += "<div style='margin:12px 0px;'>";
            pdfgeneratehtml +=
              "<h4 style='letter-spacing: 0px;color: #000000;font-size:11px;margin:5px 0px;opacity: 1;font-family: sans-serif;'>Follow Up</h4>";
            pdfgeneratehtml +=
              "<p style='margin:2px 0px;font-weight: 500;vertical-align: top;font-size: 11px;font-family: sans-serif;'>" +
              followUpDate +
              "</p>";
            pdfgeneratehtml += "</div>";
            pdfgeneratehtml += "<div style='margin:12px 0px;'>";
            pdfgeneratehtml +=
              "<h4 style='letter-spacing: 0px;color: #000000;font-size:11px;margin:5px 0px;opacity: 1;font-family: sans-serif;'>Advice</h4>";
            pdfgeneratehtml +=
              "<p style='margin:2px 0px;font-weight: 500;vertical-align: top;font-size: 11px;font-family: sans-serif;'>" +
              doctorAdvice +
              "</p>";
            pdfgeneratehtml += "</div>";
            pdfgeneratehtml +=

               "<div style='width: 100%;text-align: right;margin-left: -15px;'' class='img'><div class='prev_sign'><img width ='50px' height='50px'  src='https://www.uzima.co.za'"+docData[0].signature_pic+" />";
            pdfgeneratehtml += "<p style='letter-spacing: 0px;color: #000000;font-size:11px;margin:5px 0px;opacity: 1;font-family: sans-serif;'>Signature</p></div>";
            pdfgeneratehtml += "</div>";
            pdfgeneratehtml += "</div></div>";
            pdfgeneratehtml +=
              "<div class='hr' style='border: 2px solid #464646;opacity: 1;width:100%;margin:10% 0px 5% 0px;'></div>";
            pdfgeneratehtml += "</div>";
            // console.log("pdfgeneratehtml " + pdfgeneratehtml);
            // res.status(200).send({
            //   status: 200,
            //   error: false,
            //   pdfgeneratehtml: pdfgeneratehtml,
            //   data : data,
            //   message: "PDF Generated Successfully..",
            //   pdfURL: pdfPath,
            // });
            // return;

            var options = {
              format: "Letter",
              zoomFactor: "0.75",
              border: {
                top: "0.75in", // default is 0, units: mm, cm, in, px
                right: "0.75in",
                bottom: "0.75in",
                left: "0.75in",
              },
            };

            let pdfName = appointmentId + ".pdf";
            // console.log("appointmentId " + pdfName);

            // Working Code Starts
            prescriptionPDF
              .create(pdfgeneratehtml, options)
              .toFile(
                "./public/uploads/patient/prescriptions/" + pdfName,
                function (err, result) {
                  // if (err) return console.log(err);
                  //if(pdfName){
                  // console.log("Hai AVINASH PDF Generated " + pdfName);
                  //}
                }
              );
            // Ends here

            let pdfPath = "";
            if (pdfName) {
              // console.log("pdfName " + pdfName);
              pdfPath = "/uploads/patient/prescriptions/" + pdfName;
              // console.log("pdfPath " + pdfPath);




              // mail functionality new changes by sateesh//
              let attachmentData = [];
              const filepath ="./public/uploads/patient/prescriptions/" + pdfName;
              
              //if (fs.existsSync(filepath)) {
                if (filepath) {
                //console.log("filepath3281"+filepath);
                attachmentData = [
                  {
                    filename: pdfName,
                    path: filepath,
                    contentType: "application/pdf",
                  },
                ];

              Users.hasOne(Patient, { foreignKey: "user_id" });
              Patient.belongsTo(Users, { foreignKey: "user_id" });
              Users.findAll({
                where: { id: data[0].user_id },
              }).then((userTableData) => {
               
                
                let appointmentDateTime =
                  data[0].patient_appointment_tbls[0].appointment_datetime;

                var myDate = new Date(appointmentDateTime);
                const dateTimeConvertion =
                  moment(myDate).format("MM") +
                  " " +
                  moment(myDate).format("MMMM") +
                  ", " +
                  moment(myDate).format("YYYY") +
                  " at " +
                  moment(myDate).format("hh:mm a");
                 // console.log("3309"+dateTimeConvertion);
                let patientMessageBody = "";
                let patientEmailAddress = userTableData[0].email;
                patientMessageBody +=
                  "<p>Hello " + surName + data[0].name + ",</p>";
                patientMessageBody +=
                  "<p>Please find your prescription from  Dr." +
                  docData[0].tbl_user.name +
                  " on " +
                  dateTimeConvertion +
                  ".</p>";
                patientMessageBody += "<p>Stay healthy, stay safe!!</p>";
                patientMessageBody +=
                  "<p>Thank you for choosing MedleyMed</p>";

                 // dd = "nhrakesh@gmail.com"; //patientEmailAddress
                 //console.log("3325"+patientMessageBody);
                 dd=patientEmailAddress;
                  var email = patientEmail.sendEmail(
                    dd,
                    "Prescription Generated",
                    patientMessageBody,
                    attachmentData
                  ).catch(function(error){
                   // console.log("Emailerror"+error);
                  });
                  });

              }
              // end of mail functionality
              let updateAppointmentColumn = {
                status: "3",
                // prescription_id: "./public/uploads/patient/prescriptions/" + pdfName
                prescription_id: pdfPath,
              };

              let updateColumn = {
                appointment_status: "3",
              };

              let whereObject = {
                where: {
                  // patient_id: req.body.patient_id,
                  appointment_id: req.body.appointment_id,
                },
              };

              // console.log("problemTableLength >>" + problemTableLength);
              // console.log("SymptomsTableLength >>" + SymptomsTableLength);
              // console.log("vitalsTableLength >>" + vitalsTableLength);
              // console.log(
              //   "medicalHistoryTableLength >>" + medicalHistoryTableLength
              // );
              // console.log("appointmentTableLength >>" + appointmentTableLength);
              // console.log("medicineTableLength >>" + medicineTableLength);

              if (appointmentTableLength > 0) {
                Appointments.update(updateAppointmentColumn, {
                  where: {
                    appointment_confirm_id: appointmentId,
                  },
                }).then((num) => {
                  if (num == 1) {
                  }
                });
              }

              if (problemTableLength > 0) {
                problem_tbl
                  .update(updateColumn, {
                    where: {
                      appointment_id: appointmentId,
                    },
                  })
                  .then((num) => {
                    if (num == 1) {
                    }
                  });
              }

              if (SymptomsTableLength > 0) {
                Symptoms_tbl.update(updateColumn, {
                  where: {
                    appointment_id: appointmentId,
                  },
                }).then((num) => {
                  if (num == 1) {
                  }
                });
              }

              if (vitalsTableLength > 0) {
                VitalInformation.update(updateColumn, {
                  where: {
                    appointment_id: appointmentId,
                  },
                }).then((num) => {
                  if (num == 1) {
                  }
                });
              }

              if (medicalHistoryTableLength > 0) {
                patient_past_history
                  .update(updateColumn, {
                    where: {
                      appointment_id: appointmentId,
                    },
                    logging: console.log,
                  })
                  .then((num) => {
                    if (num == 1) {
                    }
                  });
              }

             // return;
              //let DoctorId = data[0].patient_appointment_tbls[0].doctor_id;

              

                /// ----------//

                res.status(200).send({
                  status: 200,
                  error: false,
                  message: "Prescription generated successfully..",
                  pdfURL: pdfPath,
                  // generatedHtml: pdfgeneratehtml,
                  // userDetails : userData,
                  // data: data
                });
              //});
            } else {
              res.status(200).send({
                status: 204,
                error: true,
                message: "ERROR Occurred Try again..",
                pdfURL: pdfPath,
              });
            } // if PDF Exists Ends here
          });
        } else {
          res.status(200).send({
            status: 200,
            error: false,
            message: "No appointments were found..",
            data: [],
          });
        }
      } else {
        res.status(200).send({
          status: 200,
          error: false,
          message: "No appointments were found..",
          data: [],
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving Patient List.",
      });
    });
};

exports.DoctorAppointmenthistorycount = (req, res) => {
  let message = "";
  const appointmentStartDate = req.body.fromDate;
  const appointmentEndDate = req.body.toDate;
  if (appointmentEndDate) {
    var ff = appointmentStartDate.split(" ");
    var ss = appointmentEndDate.split(" ");
    var str1 = "00-00-00";
    var str2 = "23-59-00";
    const newString1 = ff[0].concat(" ").concat(str1);
    const newString2 = ss[0].concat(" ").concat(str2);
    var condition = {
      // doctor_id: req.params.doctorid,
      doctor_id: req.body.doctorId,
      appointment_datetime: {
        //  [Op.between]: [appointmentStartDate, appointmentEndDate],
        [Op.between]: [newString1, newString2],
      },
    };
  } else {
    var fromdate = appointmentStartDate.split(" ");
    var condition = {
      // doctor_id: req.params.doctorid,
      doctor_id: req.body.doctorId,
      appointment_datetime: {
        [Op.like]: "%" + fromdate[0] + "%",
      },
    };
  }

  //Appointments.findAll({where:{appointment_confirm_id :  req.params.appointmentid}})
  Appointments.findAll({ where: condition })
    .then((data) => {
      let recordsCount = data.length;
      obj = {};
      var sum = 0;
      for (var i = 0; i < recordsCount; i++) {
        sum += data[i].consultation_fee;
      }
      obj.Total_ConsultationAmount = sum;
      obj.data = data;
      message = "Doctor Appointments fetched successfully";
      if (recordsCount == 0) {
        message = "No records found";
      }
      res.status(200).send({
        status: 200,
        error: false,
        message: message,
        data: obj,
      });
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving Appointments.",
      });
    });
};

exports.avinash = (req, res) => {
  // Users.hasOne(Doctor, { foreignKey: "user_id" });
  // Doctor.belongsTo(Users, { foreignKey: "user_id" });
  //include:[Users],attributes:["id","speciality","education","fees","experience","profile_pic","signature_pic"]
  var MasterModule = db.master_modules_tbl;
  var MastersubModule = db.master_sub_module_tbl;
  var MastersubModulePages = db.master_sub_module_pages_tbl;
  var MastersubModuleClinicPage = db.master_sub_module_clinic_pages_tbl;

  MasterModule.hasMany(MastersubModule, { foreignKey: "master_module_id" });
  MastersubModule.belongsTo(MasterModule, { foreignKey: "master_module_id" });
  MasterModule.hasMany(MastersubModulePages, {
    foreignKey: "master_module_id",
  });
  MastersubModulePages.belongsTo(MasterModule, {
    foreignKey: "master_module_id",
  });
  MasterModule.hasMany(MastersubModuleClinicPage, {
    foreignKey: "master_module_id",
  });
  MastersubModuleClinicPage.belongsTo(MasterModule, {
    foreignKey: "master_module_id",
  });
  // Users.hasOne(Doctor, { foreignKey: "user_id" });
  // Doctor.belongsTo(Users, { foreignKey: "user_id" });

  MasterModule.findAll({
    where: {},
    include: [
      { model: MastersubModule, where: { status: 1 } },
      { model: MastersubModulePages },
      { model: MastersubModuleClinicPage, where: { clinic_id: 1 } },
    ],
  })
    .then((data) => {
      if (data.length > 0) {
        var doctordetails = data;
      } else {
        var doctordetails = "No Records found.";
      }
      res.status(200).send({
        status: 200,
        error: false,
        message: "Doctor was fetched successfully.",
        data: doctordetails,
      });
      //res.send({ "message": "Doctor was fetched successfully.", data});
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving Doctor List.",
      });
    });
};

exports.getPatientVitalinforStatus = (req, res) => {
  const appointmentid = req.params.appointmentid;
  //var condition = {where:{patient_id:patientId}};

  //const Doctor = db.doctor_tbl;
  Patient.hasMany(Appointments, { foreignKey: "patient_id" });
  Appointments.belongsTo(Patient, { foreignKey: "patient_id" });
  Doctor.hasMany(Appointments, { foreignKey: "doctor_id" });
  Appointments.belongsTo(Doctor, { foreignKey: "doctor_id" });
  Appointments.findAll({
    where: {
      appointment_confirm_id: appointmentid,
    },
    attributes: ["id", "patient_id", "doctor_id", "patient_consent"],
    include: [
      { model: Patient, attributes: ["name"] },
      { model: Doctor, attributes: ["doctor_name"] },
    ],
  })
    .then((data) => {
      //res.send(data);
      res.status(200).send({
        status: 200,
        error: false,
        message:
          "Patient Vital information Status Details Fetched Sucessfully.",
        data: data,
      });
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message ||
          "Some error occurred while retrieving VitalInformation.",
      });
    });
};

exports.updatePatientVitalinforStatus = (req, res) => {
  const appointmentId = req.params.appointmentid;
  if (req.body.data) {
    req.body = req.body.data;
  }

  Appointments.update(req.body, {
    where: {
      appointment_confirm_id: appointmentId,
    },
  }).then((num) => {
    if (num == 1) {
      res.status(200).send({
        status: 200,
        error: false,
        message: "Patient Vital information Status updated Successfully",
      });
    } else {
      res.send({
        message: `Cannot update Appointments with id=${appointmentId}. Maybe Appointments was not found or req.body is empty!`,
      });
    }
  });
};

exports.updateDoctorConsentRequest = (req, res) => {
  const appointmentId = req.params.appointmentid;
  if (req.body.data) {
    req.body = req.body.data;
  }

  Appointments.update(req.body, {
    where: {
      appointment_confirm_id: appointmentId,
    },
  }).then((num) => {
    if (num == 1) {
      res.status(200).send({
        status: 200,
        error: false,
        message: "Doctor Consent Request Status updated Successfully",
      });
    } else {
      res.send({
        message: `Cannot update Appointments with id=${appointmentId}. Maybe Appointments was not found or req.body is empty!`,
      });
    }
  });
};

// Create Patient Appointment Feedback
exports.createAppointmentFeedback = (req, res) => {

  feedback_tbl.count({
    where:
    {
      "doctor_id": req.body.doctor_id,
      "patient_id": req.body.patient_id,
      "row_id": req.body.row_id,
    }
}).then(rows => {
    if (rows === 0) {

  feedback_tbl
    .create(req.body)
    .then((data) => {
      feedback_tbl
        .findAll({
          where: {
            doctor_id: req.body.doctor_id,
          },
          attributes: [
            [Sequelize.fn("AVG", Sequelize.col("rating")), "rating"],
          ],
        })
        .then((response) => {
          let ratingVal = {
            rating: parseFloat(response[0].rating).toFixed(1),
          };
          Doctor.update(ratingVal, {
            where: { id: req.body.doctor_id },
          }).then((num) => {
            if (num == 1) {
              const auditTrailVal = {
                user_id: req.body.doctor_id,
                trail_type: "Admin",
                trail_message: "Doctor Rating updated Successfully",
                status: 1,
              };
              AuditTrail.create(auditTrailVal, (err, data) => {});
              res.status(200).send({
                status: 200,
                error: false,
                message: "Appointment feedback  Created Successfully",
                // before: response[0].rating,
                // after : parseFloat(response[0].rating).toFixed(1),
              });
            }
          });
        })
        .catch((err) => {
          res.status(500).send({
            message: err.message || err,
          });
        });
    });
  } else {
    res.status(200).send({
        status: 204,
        error: false,
        message: "Feedback Already Created !!",
    });
  }
})
};

// Get patient Appointment Feedback API
exports.getAppointmentFeedback = (req, res) => {
  Patient.hasMany(feedback_tbl, { foreignKey: "patient_id" });
  feedback_tbl.belongsTo(Patient, { foreignKey: "patient_id" });
  Users.hasOne(Doctor, { foreignKey: "user_id" });
  Doctor.belongsTo(Users, { foreignKey: "user_id" });
  masterrealtionships.hasOne(Patient, { foreignKey: "relation" });
  Patient.belongsTo(masterrealtionships, { foreignKey: "relation" });
  Doctor.hasMany(feedback_tbl, { foreignKey: "doctor_id" });
  feedback_tbl.belongsTo(Doctor, { foreignKey: "doctor_id" });
  feedback_tbl
    .findAll({
      include: [
        {
          model: Patient,
          attributes: ["name", "gender", "dob", "profile_pic"],
          include: [
            { model: masterrealtionships, attributes: ["relation_name"] },
          ],
        },
        {
          model: Doctor,
          attributes: {
            exclude: ["createdAt", "updatedAt"],
          },
          include: [
            { model: Users, attributes: ["id", "email", "mobile_number"] },
          ],
        },
      ],
      order: [["id", "DESC"]],
      attributes: {
        exclude: ["createdAt", "updatedAt"],
      },
    })
    .then((response) => {
      res.send({
        status: 200,
        error: false,
        message: "Patient Feedback Details Fetched Successfully",
        data: response,
      });
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || err,
      });
    });
};
// Ends here


//get the Retailer Order process Dashboard Details...
exports.getAdminPatientAppointDetails = (req, res) => {
  const appointmentid = req.body.appointmentid;
  const appointmentStatus = req.body.appointmentStatus;
  const startDate = req.body.start_date;
  const endDate = req.body.end_date;
  const doctorid = req.body.doctorid;

  const pageId = req.body.page_number ? req.body.page_number : 1 ;

  let maxLength = 20;
  let count = (pageId - 1) * maxLength;

  var condition = {};
  if(appointmentid == "" && startDate == "" && endDate == "" && doctorid == "" && appointmentStatus=="") {
    condition = { };
  }
  else if (appointmentid == "" && startDate != "" && endDate != "" && doctorid == "" && appointmentStatus=="") {
    condition = {
     // retailer_id: retailerId,
      appointment_datetime: {
        [Op.between]: [startDate, endDate],
      },
    };
  }
  else if (appointmentid != "" && startDate != "" && endDate != "" && doctorid == "" && appointmentStatus=="") {
    condition = {
     id: appointmentid,
      appointment_datetime: {
        [Op.between]: [startDate, endDate],
      },
    };
  }
  
  else if (appointmentid == "" && startDate == "" && endDate == "" && doctorid != "" && appointmentStatus=="") {
    condition = {
    doctor_id: doctorid,
      };
  }
  else if (appointmentid != "" && startDate == "" && endDate == "" && doctorid == "" && appointmentStatus=="") {
    condition = {
      id: appointmentid
      };
  }
  else if (appointmentid != "" && startDate == "" && endDate == "" && doctorid != "" && appointmentStatus=="") {
    condition = {
      id: appointmentid,
      doctor_id: doctorid,
      };
  }
  else if (appointmentid == "" && startDate == "" && endDate == "" && doctorid == "" && appointmentStatus!="") {
    condition = {
  
     status:appointmentStatus,
      
    };
  }
  else if (appointmentid == "" && startDate != "" && endDate != "" && doctorid == "" && appointmentStatus!="") {
    condition = {
      status:appointmentStatus,
      appointment_datetime: {
        [Op.between]: [startDate, endDate],
      },
    };
  }
  else if (appointmentid != "" && startDate != "" && endDate != "" && doctorid == "" && appointmentStatus!="") {
    condition = {
      id: appointmentid,
      status:appointmentStatus,
      appointment_datetime: {
        [Op.between]: [startDate, endDate],
      },
    };
  }
  else if (appointmentid == "" && startDate != "" && endDate != "" && doctorid != "" && appointmentStatus!="") {
    condition = {
      doctor_id: doctorid,
      status:appointmentStatus,
      appointment_datetime: {
        [Op.between]: [startDate, endDate],
      },
    };
  }

  else if (appointmentid != "" && startDate != "" && endDate != "" && doctorid != "" && appointmentStatus!="") {
    condition = {
     id: appointmentid,
     doctor_id: doctorid,
     status:appointmentStatus,
      appointment_datetime: {
        [Op.between]: [startDate, endDate],
      },
    };
  }
 
    Patient.hasMany(Appointments, { foreignKey: "patient_id" });
    Appointments.belongsTo(Patient, { foreignKey: "patient_id" });
    Doctor.hasMany(Appointments, { foreignKey: "doctor_id" });
    Appointments.belongsTo(Doctor, { foreignKey: "doctor_id" });
    Users.hasOne(Doctor, { foreignKey: "user_id" });
    Doctor.belongsTo(Users, { foreignKey: "user_id" });
 
    Appointments.findAll({
      where: condition,
      offset: count,
      limit: maxLength,
      include: [
        { model: Patient, attributes: ["id", "name","phone_number"] },
        { model: Doctor, include: [{ model: Users, attributes: ["id", "name","email", "mobile_number"] }],  attributes:  ["fees","commission","experience","email", "mobile_no", "doctor_name", "id"] },
      ],
      attributes: {
                  exclude: ["createdAt", "updatedAt"],
                },
      // raw: false,
      // include: [{ model: Patient }, { model: Doctor }],
    }).then((data) => {
      // Amount Calculation Starts
      var total_appointment_amount = 0;
      var totalAmountorder = [];
      var commission = 0.00;
      var finalArray = [];
      if(data.length > 0){
        data.forEach((arg) => {
        if(arg.consultation_fee != null && arg.consultation_fee !=""){
           // totalAmountorder.push(arg.consultation_fee.replace(',',''));
           total_appointment_amount += arg.consultation_fee;
          }
          else{
            total_appointment_amount =0.00;
          }
          if(arg.doctor_tbl){
            //console.log("-------- -- 3615 --------", arg.doctor_tbl.commission)
            if(arg.doctor_tbl.commission!= null && arg.doctor_tbl.commission!= ""){
              totCommissionAmount = arg.consultation_fee * arg.doctor_tbl.commission / 100 ;
              totPaidAmount =arg.consultation_fee - totCommissionAmount;
            }
            else{
              totCommissionAmount = 0.00;
              totPaidAmount = arg.consultation_fee;
            }
          }

          var obj = {
            id:arg.id,
            patient_id:arg.patient_id,
            doctor_id:arg.doctor_id,
            appointment_datetime:arg.appointment_datetime,
            next_appointment_datetime:arg.next_appointment_datetime,
            doctor_advice:arg.doctor_advice,
            prescription_id:arg.prescription_id,
            login_person_id:arg.login_person_id,
            appointment_cancel_reason:arg.appointment_cancel_reason,
            appointment_confirm_id:arg.appointment_confirm_id,
            medicine_desc:arg.medicine_desc,
            diseases_desc:arg.diseases_desc,
            consultation_fee:arg.consultation_fee,
            transaction_id:arg.transaction_id,
            amount:arg.amount,
            appointment_cancel_reason:arg.clinic_id,
            appointment_confirm_id:arg.appointment_confirm_id,
            clinic_id:arg.clinic_id,
            status:arg.status,

            patient_tbl:arg.patient_tbl,
            doctor_tbl:arg.doctor_tbl,
            tbl_user:arg.tbl_user,
            TotCommissionAmount:totCommissionAmount,
            TotPaidAmount :totPaidAmount

          }
          finalArray.push(obj);
      
        });

 }

res.status(200).send({
        status: 200,
        error: false,
        itemsCount: data.length,
        total_appointment_amount : total_appointment_amount,
        message: "Doctor Revenue Details fetched Sucessfully...",
        data: finalArray,
      });
      
    });
};