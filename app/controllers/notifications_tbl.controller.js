const Sequelize = require("sequelize");
var encryption = require("../helpers/Encryption");
const db = require("../models");
const Notifications = db.notifications_tbl;
const AuditTrail = db.audit_trails;
const Op = Sequelize.Op;

exports.create = (req, res) => {
  if (!req.body) {
    response.status(400).send({ message: "Content cannot be empty" });
  } else {
    const notificationValues = {
      user_id: req.body.user_id,
      type: req.body.type,
      title: req.body.title,
      message: req.body.message,
      appointment_id: req.body.appointment_id,
    };

    // console.log(notificationValues);
    // return;

    Notifications.create(notificationValues)
      .then((data) => {
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
          message: "Notification Created Successfully",
        });
      })
      .catch((err) => {
        console.log(err);
        res.status(500).send({ error: `${err} while creating Notification` });
      });
  }
};

// Retrieve all Patient Appointment from the Patient Appointment list.
exports.findAll = (req, res) => {
  const userId = req.params.userId;
  let message = "";
  Notifications.findAll({
    where: {
      user_id: userId,
    //  status:0, // unread
    },
    // attributes: {
    //   exclude: ["createdAt", "updatedAt"],
    // },
  })
    .then((data) => {
      let recordsCount = data.length;
      message = "Notifications fetched successfully";
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
// exports.findOne = (req, res) => {
//   const notificationId = req.params.id;
//   Notifications.findAll({
//     where: {
//       id: notificationId,
//     },
//     attributes: {
//       exclude: ["createdAt", "updatedAt"],
//     },
//   })
//     .then((data) => {
//       res.send({
//         status: 200,
//         message: "Notifications Fetched Successfully",
//         error: false,
//         data: data,
//       });
//     })
//     .catch((err) => {
//       res.status(500).send({
//         message:
//           err.message || "Some error occurred while retrieving Notifications.",
//       });
//     });
// };



// Update a Patient Appointment by the id in the request
exports.update = (req, res) => {
  const notificationId = req.params.id;
  if (req.body.data) {
    req.body = req.body.data;
  }
  Notifications.update(req.body, {
    where: {
      id: notificationId,
    },
  })
    .then((num) => {
      if (num == 1) {
        res.status(200).send({
          status: 200,
          error: false,
          message: "Notification updated Successfully",
        });
      } else {
        res.send({
          message: `Cannot update Notification with id=${id}. Maybe Notification was not found or req.body is empty!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error updating Audit Trail with id=" + id,
      });
    });
};

// Delete a Patient Coupan with the specified id in the request
exports.delete = (req, res) => {
  const notificationId = req.params.id;
  Notifications.destroy({
    where: { id: notificationId },
  })
    .then((num) => {
      if (num == 1) {
        res.send({
          status: 200,
          error: false,
          message: "Notification Deleted Successfully",
        });
      } else {
        res.send({
          message: `Cannot delete Notification with id=${id}. Maybe Notification was not found!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Could not delete Notification with id=" + id,
      });
    });
};
