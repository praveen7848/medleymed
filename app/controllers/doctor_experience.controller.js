const db = require("../models");
const AuditTrail = db.audit_trails;
const Doctorexperince = db.doctor_experience_tbl;

exports.findAll = (req, res) => {
    Doctorexperince.findAll({})
    .then((data) => {
        res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error retrieving User with id=" + id,
      });
    });
};

// Find a single Doctorexperince with an id
exports.findOne = (req, res) => {
    const id = req.params.id;  
    Doctorexperince.findAll({ where: {id: id} })
      .then((data) => {
        res.send(data);
      })
      .catch((err) => {
        res.status(500).send({
          message:
            err.message || "Some error occurred while retrieving Doctorexperince.",
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
      Doctorexperince.create(req.body)
        .then((data) => {
                const auditTrailVal = {
                'user_id' : data.id,
                'trail_type' : user_type.charAt(0).toUpperCase() + user_type.slice(1)+' Doctorexperince Modules',
                'trail_message' : req.body.medicinename+ ' '+ req.body.manufacturer + ' is Doctorexperince Modules as '+user_type.charAt(0).toUpperCase() + user_type.slice(1),
                'status': 1
              }
          AuditTrail.create(auditTrailVal,(err, data)=>{ })
          res.send(data);
        })
        .catch((err) => {
          console.log(err)
         res.status(500).send({ error: `${err} while creating Doctorexperince Modules` });
        });
      
    }
};

// Update a Doctorexperince by the id in the request
exports.update = (req, res) => {
  const id = req.params.id;
  var user_type = "Admin";
  if (Object.keys(req.body).length === 0) {
    res.status(400).send({"message":"Content cannot be empty"})
  }

  Doctorexperince.update(req.body, {
    where: { id: id },
  })
  .then((num) => {
      if (num == 1) {
        const auditTrailVal = {
          'user_id' : req.params.id,
          'trail_type' : user_type.charAt(0).toUpperCase() + user_type.slice(1)+' Doctorexperince Modules',
          'trail_message' : req.body.medicinename+ ' '+ req.body.manufacturer + ' is Doctorexperince Modules as '+user_type.charAt(0).toUpperCase() + user_type.slice(1),
          'status': 1
        }
    AuditTrail.create(auditTrailVal,(err, data)=>{ })
        res.send({
          message: "Doctorexperince Module was updated successfully.",
        });
      } else {
        res.send({
          message: `Cannot update Doctorexperince with id=${id}. Maybe Doctorexperince Module was not found or req.body is empty!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error updating Doctorexperince with id=" + id,
      });
    });
};

// Delete a Doctorexperince with the specified id in the request
exports.delete = (req, res) => {
  const id = req.params.id;

  Doctorexperince.destroy({
    where: { id: id },
  })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: "Doctorexperince was deleted successfully!",
        });
      } else {
        res.send({
          message: `Cannot delete Doctorexperince with id=${id}. Maybe Doctorexperince was not found!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Could not delete Doctorexperince with id=" + id,
      });
    });
};

// Delete all Doctorexperince from the database.
exports.deleteAll = (req, res) => {
    Doctorexperince.destroy({
    where: {},
    truncate: false,
  })
    .then((nums) => {
      res.send({ message: `${nums} Doctorexperince were deleted successfully!` });
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while removing all Doctorexperince.",
      });
    });
};

  
