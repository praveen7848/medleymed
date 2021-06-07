const Sequelize = require("sequelize");
const db = require("../models");
const masterRole = db.master_roles_tbl;
const Op = Sequelize.Op;
const AuditTrail = db.audit_trails;

// Retrieve all Roles
exports.findAll = (req, res) => {
    masterRole
    .findAll({
        attributes: {
            exclude: ['createdAt','updatedAt']
        }
    })
    .then((data) => {
      res.send({
        status: 200,
        error: false,
        message: "Default Master roles fetched  successfully!",
        data: data,
      });
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving Vitals List.",
      });
    });
};
//   Ends Here

// Create a Master Roles
exports.create = (req, res) => {
  var user_type = "Admin";
  if (!req.body) {
    res.status(400).send({ message: "Content cannot be empty" });
  } else if (!req.body.role_name) {
    res.status(400).send({ message: "Role Name cannot be empty" });
  } else {
    masterRole
      .create(req.body)
      .then((data) => {
        const auditTrailVal = {
          user_id: data.id,
          trail_type:
            user_type.charAt(0).toUpperCase() +
            user_type.slice(1) +
            "Role Module",
          trail_message:
            req.body.role_name +
            " " +
            req.body.role_name +
            " is Role Modules as " +
            user_type.charAt(0).toUpperCase() +
            user_type.slice(1),
          status: 1,
        };
        AuditTrail.create(auditTrailVal, (err, data) => {});
        res.send({
          status: 200,
          error: false,
          message: "Default Master roles Created  successfully!",
        });
      })
      .catch((err) => {
        console.log(err);
        res.status(500).send({ error: `${err} while creating Vitals Modules` });
      });
  }
};
// Ends here

// Find a single Role with an Name
exports.findOne = (req, res) => {
    const masterRoleId = req.params.id;
    masterRole.findAll({
        where: {
            id: masterRoleId
        },
        attributes: {
            exclude: ['createdAt','updatedAt']
        }
    }).then((data) => {
        res.send({
            status: 200,
            message: "Master Role record Fetched Successfully",
            error: false,
            data: data,
        });
    }).catch((err) => {
        res.status(500).send({
            message:
                err.message || "Some error occurred while retrieving Appointments.",
        });
    });
};

// Update a Patient Appointment by the id in the request
exports.update = (req, res) => {
    const masterRoleId = req.params.id;
    if (req.body.data) {
        req.body = req.body.data;
    }
    masterRole.update(req.body, {
        where: {
            id: masterRoleId
        },
    }).then(num => {
        if (num == 1) {
            res.status(200).send({
                status: 200,
                error: false,
                message: "Master Role updated Successfully",
            });
        } else {
            res.send({
                message: `Cannot update role with id=${id}. Maybe roles was not found or req.body is empty!`
            });
        }
    }).catch(err => {
        res.status(500).send({
            message: "Error updating Audit Trail"
        });
    });
};

// Delete a Role with the specified id in the request
exports.delete = (req, res) => {
    const masterRoleId = req.params.id;
    masterRole.destroy({
        where: { id: masterRoleId }
    }).then(num => {
        if (num == 1) {
            res.send({
                status: 200,
                error: false,
                message: "Master Role Deleted Successfully",
            });
        } else {
            res.send({
                message: `Cannot delete Role with id=${id}. Maybe Role was not found!`
            });
        }
    }).catch(err => {
        res.status(500).send({
            message: "Could not delete Role with id=" + id
        });
    });
};