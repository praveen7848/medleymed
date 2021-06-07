const db = require("../models");
const AuditTrail = db.audit_trails;
const Doctorrefund = db.tbl_doctor_refund;

exports.findAll = (req, res) => {
    Doctorrefund.findAll({})
    .then((data) => {
        res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error retrieving User with id=" + id,
      });
    });
};

// Find a single Doctorrefund with an id
exports.findOne = (req, res) => {
    const id = req.params.id;  
    Doctorrefund.findAll({ where: {id: id} })
      .then((data) => {
        res.send(data);
      })
      .catch((err) => {
        res.status(500).send({
          message:
            err.message || "Some error occurred while retrieving Doctorrefund.",
        });
      });
};

// Create Controller
exports.create = (req,res)=>{
    var user_type = "Admin"

    if (Object.keys(req.body).length === 0) {
      res.status(400).send({"message":"Content cannot be empty"})
    }
  
     else {
        Doctorrefund.create(req.body)
        .then((data) => {
                const auditTrailVal = {
                'user_id' : data.id,
                'trail_type' : user_type.charAt(0).toUpperCase() + user_type.slice(1)+' Doctorrefund Modules',
                'trail_message' : req.body.medicinename+ ' '+ req.body.manufacturer + ' is Doctorrefund Modules as '+user_type.charAt(0).toUpperCase() + user_type.slice(1),
                'status': 1
              }
          AuditTrail.create(auditTrailVal,(err, data)=>{ })
          res.send(data);
        })
        .catch((err) => {
          console.log(err)
         res.status(500).send({ error: `${err} while creating Doctorrefund Modules` });
        });
      
    }
};

// Update a Doctorrefund by the id in the request
exports.update = (req, res) => {
  const id = req.params.id;
  var user_type = "Admin";
  if (Object.keys(req.body).length === 0) {
    res.status(400).send({"message":"Content cannot be empty"})
  }

  Doctorrefund.update(req.body, {
    where: { id: id },
  })
  .then((num) => {
      if (num == 1) {
        const auditTrailVal = {
          'user_id' : req.params.id,
          'trail_type' : user_type.charAt(0).toUpperCase() + user_type.slice(1)+' Doctorrefund Modules',
          'trail_message' : req.body.medicinename+ ' '+ req.body.manufacturer + ' is Doctorrefund Modules as '+user_type.charAt(0).toUpperCase() + user_type.slice(1),
          'status': 1
        }
    AuditTrail.create(auditTrailVal,(err, data)=>{ })
        res.send({
          message: "Doctorrefund Module was updated successfully.",
        });
      } else {
        res.send({
          message: `Cannot update Doctorrefund with id=${id}. Maybe Doctorrefund Module was not found or req.body is empty!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error updating Doctorrefund with id=" + id,
      });
    });
};

// Delete a Doctorrefund with the specified id in the request
exports.delete = (req, res) => {
  const id = req.params.id;

  Doctorrefund.destroy({
    where: { id: id },
  })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: "Doctorrefund was deleted successfully!",
        });
      } else {
        res.send({
          message: `Cannot delete Doctorrefund with id=${id}. Maybe Doctorrefund was not found!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Could not delete Doctorrefund with id=" + id,
      });
    });
};

// Delete all Doctorrefund from the database.
exports.deleteAll = (req, res) => {
    Doctorrefund.destroy({
    where: {},
    truncate: false,
  })
    .then((nums) => {
      res.send({ message: `${nums} Doctorrefund were deleted successfully!` });
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while removing all Doctorrefund.",
      });
    });
};

  
