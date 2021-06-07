const Sequelize = require("sequelize");
const db = require("../../models");
const { NOW } = require("sequelize");
const delivery_address = db.delivery_address_tbl;
const Patient = db.patient_tbl;
const Op = Sequelize.Op;
const AuditTrail = db.audit_trails;
var encryption = require('../../helpers/Encryption');



// Create a Delivery address
exports.setDefaultAddress = (req, res) => {
  const patientId = req.params.patientId;
  const id = req.params.rowId;
  var user_type = "Admin";
  delivery_address
    .update({
      default_status : 0
    }, {
      where: { patient_id: patientId },
    })
    .then((num) => {
      delivery_address
      .update({
        default_status : 1
      }, {
        where: { id: id },
      })
      .then((num) => {
        const auditTrailVal = {
          user_id: id,
          trail_type: "Admin",
          trail_message: "Delivery addresses updated Successfully",
          status: 1,
        };
        AuditTrail.create(auditTrailVal, (err, data) => {});
        res.status(200).send({
          status: 200,
          error: false,
          message: "Default Delivery address set Sucessfully..",
        });
      })
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send({
        message: "Error updating Delivery address with id=" + id,
      });
    });
};
// Ends here



// Create a Delivery address
exports.create = (req, res) => {
  var user_type = "Admin";
  if (!req.body) {
    res.status(400).send({ message: "Content cannot be empty" });
  } else {
    console.log(req.body);

    var countCondition = {
      patient_id: req.body.patient_id,
      address_type: encryption.encryptData(req.body.address_type),
    };

    delivery_address
    .count({ where: countCondition })
    .then((count) => {
      if (count === 0) {
      delivery_address.create(req.body).then((data) => {
      const auditTrailVal = {
        user_id: req.body.patient_id,
        trail_type: "Admin",
        trail_message: "Delivery address created Successfully",
        status: 1,
      };
      AuditTrail.create(auditTrailVal, (err, data) => {});
      res.status(200).send({
        status: 200,
        error: false,
        message: "Delivery address Created Successfully",
      });
    });
  }else{
    res.status(200).send({
      status: 200,
      error: true,
      message: "Delivery address already added with address type...",
    });
  }
});
  }
};

// Retrieve all Delivery address
exports.findAll = (req, res) => {
  delivery_address
    .findAll({})
    .then((data) => {
      res.status(200).send({
        status: 200,
        error: false,
        message: "Delivery address Fetched Successfully",
        data: data,
      });
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message ||
          "Some error occurred while retrieving Delivery address List.",
      });
    });
};

// find all Delivery address by Delivery id
exports.findAllDeliveryAddress = (req, res) => {
  let patient_id = req.params.id;

  Patient.hasMany(delivery_address, { foreignKey: "patient_id" });
  delivery_address.belongsTo(Patient, { foreignKey: "patient_id" });

  delivery_address
    .findAll({
       where: { patient_id: patient_id },
       attributes: { exclude: ["createdAt", "updatedAt"] },
      include: [
        {
          model: Patient,
          required: false,
          attributes: ["name", "phone_number","id"],
        },
      ],
      })
    .then((data) => {
      const auditTrailVal = {
        user_id: patient_id,
        trail_type: "Admin",
        trail_message: "Patient Delivery addresses fetched Successfully",
        status: 1,
      };
      AuditTrail.create(auditTrailVal, (err, data) => {});
      res.status(200).send({
        status: 200,
        error: false,
        message: "Delivery address Fetched Successfully",
        data: data,
      });
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message ||
          "Some error occurred while retrieving Delivery address List.",
      });
    });
};

// Find a single Delivery address with an by id
exports.findOne = (req, res) => {
  const id = req.params.id;

  Patient.hasMany(delivery_address, { foreignKey: "patient_id" });
  delivery_address.belongsTo(Patient, { foreignKey: "patient_id" });

  delivery_address
    .findAll({
      where: {
        id: id,
      },
      attributes: { exclude: ["createdAt", "updatedAt"] },
      include: [
        {
          model: Patient,
          required: false,
          attributes: ["name", "phone_number","id"],
        },
      ],
    })
    .then((data) => {
      res.status(200).send({
        status: 200,
        error: false,
        message: "Delivery address Fetched Successfully",
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
exports.updateDeliveryAddress = (req, res) => {
  const id = req.params.id;
  var user_type = "Admin";
  delivery_address
    .update(req.body, {
      where: { id: id },
    })
    .then((num) => {
      if (num == 1) {
        const auditTrailVal = {
          user_id: id,
          trail_type: "Admin",
          trail_message: "Delivery addresses updated Successfully",
          status: 1,
        };
        AuditTrail.create(auditTrailVal, (err, data) => {});
        res.status(200).send({
          status: 200,
          error: false,
          message: "Delivery address Updated Successfully",
        });
      } else {
        res.send({
          message: `Cannot update Delivery address with id=${id}. Maybe Delivery address was not found or req.body is empty!`,
        });
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send({
        message: "Error updating Delivery address with id=" + id,
      });
    });
};

// Delete a Delivery address with the specified id in the request
exports.delete = (req, res) => {
  const id = req.params.id;
  var user_type = "Admin";
  delivery_address
    .destroy({
      where: { id: id },
    })
    .then((num) => {
      if (num == 1) {
        const auditTrailVal = {
          user_id: id,
          trail_type: "Admin",
          trail_message: "Patient Delivery address Deleted Successfully",
          status: 1,
        };
        AuditTrail.create(auditTrailVal, (err, data) => {});
        res.status(200).send({
          status: 200,
          error: false,
          message: "Delivery address Deleted Successfully",
        });
      } else {
        res.send({
          message: `Cannot delete Delivery address with id=${id}. Maybe Delivery address was not found!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Could not delete Delivery address with id=" + id,
      });
    });
};
