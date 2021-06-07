const Sequelize = require("sequelize");
const db = require("../../models");

const cancellationReason = db.order_cancellation_reasons_tbl;
const orderTable = db.order_tbl;
const Op = Sequelize.Op;
const AuditTrail = db.audit_trails;
var encryption = require("../../helpers/Encryption");

// Create a Delivery address
exports.create = (req, res) => {
  var user_type = "Admin";
  if (!req.body) {
    res.status(400).send({ message: "Content cannot be empty" });
  } else {
    console.log(req.body);

    var countCondition = {
      reason: encryption.encryptData(req.body.reason),
    };

    cancellationReason.count({ where: countCondition }).then((count) => {
      if (count === 0) {
        cancellationReason.create(req.body).then((data) => {
          const auditTrailVal = {
            user_id: encryption.encryptData(req.body.reason),
            trail_type: "Admin",
            trail_message: "Cancellation reason created Successfully",
            status: 1,
          };
          AuditTrail.create(auditTrailVal, (err, data) => {});
          res.status(200).send({
            status: 200,
            error: false,
            message: "Cancellation reason Created Successfully",
          });
        });
      } else {
        res.status(200).send({
          status: 200,
          error: true,
          message: "Cancellation reason already added...",
        });
      }
    });
  }
};

// Retrieve all Delivery address
exports.findAll = (req, res) => {
  cancellationReason
    .findAll({
      attributes: {
        exclude: ["createdAt", "updatedAt"],
      },
      order: [["id", "DESC"]],
    })
    .then((data) => {
      res.status(200).send({
        status: 200,
        error: false,
        message: "Cancellation reasons Fetched Successfully",
        data: data,
      });
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message ||
          "Some error occurred while retrieving Cancellation reasons List.",
      });
    });
};



// Find a single Delivery address with an by id
exports.findOne = (req, res) => {
    const id = req.params.id;
  
    cancellationReason
      .findAll({
        where: {
          id: id,
        },
        attributes: { exclude: ["createdAt", "updatedAt"] },
      })
      .then((data) => {
        res.status(200).send({
          status: 200,
          error: false,
          message: "Cancellation reasons Fetched Successfully",
          data: data,
        });
      })
      .catch((err) => {
        res.status(500).send({
          message:
            err.message ||
            "Some error occurred while retrieving Delivery address.",
        });
      });
  };
  

  
// Update a  by the id in the request
exports.updatereason = (req, res) => {
    const id = req.params.id;
    var user_type = "Admin";
    cancellationReason
      .update(req.body, {
        where: { id: id },
      })
      .then((num) => {
        if (num == 1) {
          const auditTrailVal = {
            user_id: id,
            trail_type: "Admin",
            trail_message: "Cancellation reason updated Successfully",
            status: 1,
          };
          AuditTrail.create(auditTrailVal, (err, data) => {});
          res.status(200).send({
            status: 200,
            error: false,
            message: "Cancellation reason Updated Successfully",
          });
        } else {
          res.send({
            message: `Cannot update Cancellation reason with id=${id}. Maybe Cancellation reason was not found or req.body is empty!`,
          });
        }
      })
      .catch((err) => {
        console.log(err);
        res.status(500).send({
          message: "Error updating Cancellation reason with id=" + id,
        });
      });
  };




  
// Delete a Delivery address with the specified id in the request
exports.delete = (req, res) => {
    const id = req.params.id;
    var user_type = "Admin";
    cancellationReason
      .destroy({
        where: { id: id },
      })
      .then((num) => {
        if (num == 1) {
          const auditTrailVal = {
            user_id: id,
            trail_type: "Admin",
            trail_message: "Cancellation reason Deleted Successfully",
            status: 1,
          };
          AuditTrail.create(auditTrailVal, (err, data) => {});
          res.status(200).send({
            status: 200,
            error: false,
            message: "Cancellation reason Deleted Successfully",
          });
        } else {
          res.send({
            message: `Cannot delete Cancellation reason with id=${id}. Maybe Cancellation reason was not found!`,
          });
        }
      })
      .catch((err) => {
        res.status(500).send({
          message: "Could not delete Delivery address with id=" + id,
        });
      });
  };
  

  
// Update a order id by reason
exports.updateOrderReason = (req, res) => {
    const id = req.params.orderId;
    var user_type = "Admin";
    orderTable
      .update(req.body, {
        where: { id: id },
      })
      .then((num) => {
        if (num == 1) {
          const auditTrailVal = {
            user_id: id,
            trail_type: "Admin",
            trail_message: "Cancellation reason updated to Order Details Successfully",
            status: 1,
          };
          AuditTrail.create(auditTrailVal, (err, data) => {});
          res.status(200).send({
            status: 200,
            error: false,
            message: "Cancellation reason Updated Successfully",
          });
        } else {
          res.send({
            message: `Cannot update Cancellation reason with id=${id}. Maybe Cancellation reason was not found or req.body is empty!`,
          });
        }
      })
      .catch((err) => {
        console.log(err);
        res.status(500).send({
          message: "Error updating Cancellation reason with id=" + id,
        });
      });
  };

  