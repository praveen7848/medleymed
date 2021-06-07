const Sequelize = require("sequelize");
const db = require("../models");
const AuditTrail = db.audit_trails;

const Favouritedoctor = db.favourite_doctor;
const Doctor = db.doctor_tbl;
const Users = db.users_tbl;
const Doctoreducation = db.doctor_education;
const Patient = db.patient_tbl;
const Op = Sequelize.Op;
const Clinic = db.clinic_tbl;

// exports.create = (request, response) => {
// Doctorconsultationprice.bulkCreate([
//     { starting_price:"1",end_price:"200"},
//   ]).then(() => {
//     // return Countries.findAll();
//   });
// };

exports.findAll = (req, res) => {
  const patientId = req.params.patientId;

  Doctor.hasMany(Favouritedoctor, { foreignKey: "doctor_id" });
  Favouritedoctor.belongsTo(Doctor, { foreignKey: "doctor_id" });

  Doctor.hasMany(Doctoreducation, { foreignKey: "doctor_user_tbl_id" });
  Doctoreducation.belongsTo(Doctor, { foreignKey: "doctor_user_tbl_id" });

  Users.hasOne(Doctor, { foreignKey: "user_id" });
  Doctor.belongsTo(Users, { foreignKey: "user_id" });

  Clinic.hasOne(Doctor, { foreignKey: "clinic_id" });
  Doctor.belongsTo(Clinic, { foreignKey: "clinic_id" });

  Favouritedoctor.findAll({
    where: { patient_id: patientId },
    attributes: { exclude: ["createdAt", "updatedAt"] },
    include: [
      {
        model: Doctor,
        required: false,
        attributes: { exclude: ["createdAt", "updatedAt"] },
        include: [
          {
            model: Doctoreducation,
            required: false,
            attributes: {
              exclude: ["createdAt", "updatedAt"],
            },
          },
          {
            model: Users,
            required: false,
            attributes: {
              exclude: ["createdAt", "updatedAt"],
            },
          },
          {
            model: Clinic,
            required: false,
            attributes: {
              exclude: ["createdAt", "updatedAt"],
            },
          },
        ],
      },
    ],
  })
    .then((data) => {
      res.status(200).send({
        status: 200,
        error: false,
        message: "Patient Favorite Doctor's details Sucessfully..",
        data: data,
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send({
        message: "Error retrieving User with id=",
      });
    });
};

// Create Controller
exports.create = (req, res) => {
  var user_type = "Admin";
  if (!req.body) {
    res.status(400).send({ message: "Content cannot be empty" });
  } else {
    const favouriteVal = {
      doctor_id: req.body.doctor_id,
      patient_id: req.body.patient_id,
    };
    Favouritedoctor.count({
      where: {
        doctor_id: req.body.doctor_id,
        patient_id: req.body.patient_id,
      },
    }).then((rows) => {
      if (rows === 0) {
        Favouritedoctor.create(favouriteVal)
          .then((data) => {
            const auditTrailVal = {
              user_id: "1",
              trail_type: user_type,
              trail_message:
                "Creating the Favourite doctor module:" +
                user_type.charAt(0).toUpperCase() +
                user_type.slice(1), //req.body.starting_price+ ' '+ req.body.end_price + ' is Doctorconsultationprice Modules as '+user_type.charAt(0).toUpperCase() + user_type.slice(1),
              status: 1,
            };
            AuditTrail.create(auditTrailVal, (err, data) => {});
            res.status(200).send({
              status: 200,
              error: false,
              message: "Patient Favorite Doctor added Sucessfully..",
              // data: data,
            });
          })
          .catch((err) => {
            console.log(err);
            res.status(500).send({
              error: `${err} while creating Favorite doctor.`,
            });
          });
      } else {
        res.status(200).send({
          status: 204,
          error: false,
          message: "Doctor already added to favorites !!",
        });
      }
    });
  }
};

// Update a Favouritedoctor by the id in the request
exports.update = (req, res) => {
  const id = req.params.id;
  var user_type = "Admin";
  if (Object.keys(req.body).length === 0) {
    res.status(400).send({ message: "Content cannot be empty" });
  }

  Favouritedoctor.update(req.body, {
    where: { id: id },
  })
    .then((num) => {
      if (num == 1) {
        const auditTrailVal = {
          user_id: "1",
          trail_type: "Updatating Favourite doctor Module:" + user_type, //.charAt(0).toUpperCase() + user_type.slice(1), //user_type.charAt(0).toUpperCase() + user_type.slice(1)+' Doctorexperince Modules',
          trail_message: "Updatating Favourite doctor Module:" + user_type, //req.body.medicinename+ ' '+ req.body.manufacturer + ' is Doctorexperince Modules as '+user_type.charAt(0).toUpperCase() + user_type.slice(1),
          status: 1,
        };
        AuditTrail.create(auditTrailVal, (err, data) => {});
        res.send({
          message: "Favourite doctor Module was updated successfully.",
        });
      } else {
        res.send({
          message: `Cannot update Favourite doctor with id=${id}. Maybe Favourite doctor Module was not found or req.body is empty!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error updating Favourite doctor with id=" + id,
      });
    });
};

// Delete a Favourite doctor with the specified id in the request
exports.delete = (req, res) => {
  const id = req.params.id;

  Favouritedoctor.destroy({
    where: { id: id },
  })
    .then((num) => {
      if (num == 1) {
        // res.send({
        //   message: "Favourite doctor was deleted successfully!",
        // });
        res.status(200).send({
          status: 200,
          error: false,
          message: "Favourite doctor was deleted successfully..!",
        });
      } else {
        res.send({
          message: `Cannot delete Favourite doctor with id=${id}. Maybe Favourite doctor was not found!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Could not delete Favourite doctor with id=" + id,
      });
    });
};
