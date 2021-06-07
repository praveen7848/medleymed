const db = require("../models");
const AuditTrail = db.audit_trails;
const Op = db.Sequelize.Op;
var encryption = require('../helpers/Encryption');

exports.create = (request,response)=>{
    if (!request.body) {
        response.status(400).send({"message":"Content cannot be empty"})
    } else if (!request.body.trail_type) {
        response.status(400).send({"message":"Audit Trail Type cannot be empty"})
    } else {
        const auditTrailVal = {
            'user_id' : request.body.user_id,
            'trail_type' : request.body.trail_type,
            'trail_message' : request.body.trail_message,
			'status': 1
        }

        AuditTrail.create(auditTrailVal,(err,data)=>{
            if (err) {
				console.log(err);
                response.status(500).send({"error":`${err} while creating Audit Trail`})
            }
        })
		response.status(200).send({
			"message": "Audit Trail Created Successfully"
		});
    }
};

// Retrieve all Audit Trails from the Audit Trails.
exports.findAll = (req, res) => {
  const trail_type = encryption.encryptData(req.query.trail_type);
  var condition = trail_type ? { trail_type: { [Op.eq]: `${trail_type}` } } : null;

  AuditTrail.findAll({ where: condition })
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving Audit Trails."
      });
    });
};

// Find a single Audit Trails with an id
exports.findOne = (req, res) => {
  const id = req.params.id;

  AuditTrail.findByPk(id)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message: "Error retrieving Audit Trail with id=" + id
      });
    });
};

// Update a Audit Trail by the id in the request
exports.update = (req, res) => {
  const id = req.params.id;

  if(req.body.data) {
	  req.body = req.body.data;
  }

  AuditTrail.update(req.body, {
    where: { id: id }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: "Audit Trail was updated successfully."
        });
      } else {
        res.send({
          message: `Cannot update Audit Trail with id=${id}. Maybe Audit Trail was not found or req.body is empty!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Error updating Audit Trail with id=" + id
      });
    });
};

// Delete a Audit Trail with the specified id in the request
exports.delete = (req, res) => {
  const id = req.params.id;

  AuditTrail.destroy({
    where: { id: id }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: "Audit Trail was deleted successfully!"
        });
      } else {
        res.send({
          message: `Cannot delete Audit Trail with id=${id}. Maybe Audit Trail was not found!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Could not delete Audit Trail with id=" + id
      });
    });
};

// Delete all Audit Trails from the database.
exports.deleteAll = (req, res) => {
  AuditTrail.destroy({
    where: {},
    truncate: false
  })
    .then(nums => {
      res.send({ message: `${nums} Audit Trails were deleted successfully!` });
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while removing all Audit Trails."
      });
    });
};