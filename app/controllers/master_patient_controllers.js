const Sequelize = require('sequelize');
const db = require("../models");
const MasterPatientControllers = db.master_patient_controllers;
const Op = Sequelize.Op;
const AuditTrail = db.audit_trails;

// Retrieve all MasterPatientControllers
exports.findAll = (req, res) => { 
    MasterPatientControllers.findAll({})
      .then((data) => {
        res.send(data);
      })
      .catch((err) => {
        res.status(500).send({
          message:
            err.message || "Some error occurred while retrieving Master Patient Controllers List.",
        });
      });
  };

// Find a single MasterPatientControllers with an by id
exports.findOne = (req, res) => {
  const id = req.params.id;

  // var condition = name ? { name: { [Op.eq]: `${name}` } } : null;
  MasterPatientControllers.findAll({ 
      where: {
          id: id
        }
  })
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving Master Patient Controllers.",
      });
    });
};


// Create a Master Patient Controller Name
exports.create = (req,res)=>{
  var user_type ="Admin";
  if (!req.body) {
    res.status(400).send({"message":"Content cannot be empty"})
  } else if (!req.body.name) {
    res.status(400).send({"message":"Master Patient Controller Name cannot be empty"})
  } else {
      const langVal = {
          'name' : req.body.name,
          'iso_name' : req.body.iso_name,
      }
      MasterPatientControllers.create(langVal).then((data)=>{
        
          const auditTrailVal = {
              'user_id' : data.id,
              'trail_type' : user_type.charAt(0).toUpperCase() + user_type.slice(1)+'Master Patient Controller Modules',
              'trail_message' : req.body.name+ ' '+ req.body.iso_name + ' is Master Patient Controller Modules as '+user_type.charAt(0).toUpperCase() + user_type.slice(1),
              'status': 1
            }
        AuditTrail.create(auditTrailVal,(err, data)=>{ });
          res.send(data);
      })
      .catch((err) => {
        console.log(err)
       res.status(500).send({ error: `${err} while creating Master Patient Controller Modules` });
      });
  }
};


// Update a Audit Trail by the id in the request
exports.update = (req, res) => {
  var user_type= "Admin";
  const id = req.params.id;

  if(req.body.data) {
	  req.body = req.body.data;
  }
MasterPatientControllers.update(req.body, {
  where: { id: id }
})
  .then(num => {
    if (num == 1) {
      const auditTrailVal = {
        'user_id' : req.params.id,
        'trail_type' : user_type.charAt(0).toUpperCase() + user_type.slice(1)+'Master Patient Controller Modules',
        'trail_message' : req.body.name+ ' '+ req.body.iso_name + ' is Master Patient Controller Modules as '+user_type.charAt(0).toUpperCase() + user_type.slice(1),
        'status': 1
      }
  AuditTrail.create(auditTrailVal,(err, data)=>{ });
      res.send({
        message: "Master Patient Controller was updated successfully."
      });
    } else {
      res.send({
        message: `Cannot update Master Patient Controller with id=${id}. Maybe Master Patient Controller was not found or req.body is empty!`
      });
    }
  })
  .catch(err => {
    res.status(500).send({
      message: "Error updating Master Patient Controller with id=" + id
    });
  });
};


// Delete a Master Patient Controller with the specified id in the request
exports.delete = (req, res) => {
const id = req.params.id;
MasterPatientControllers.destroy({
  where: { id: id }
})
  .then(num => {
    if (num == 1) {
      res.send({
        message: "Master Patient Controller was deleted successfully!"
      });
    } else {
      res.send({
        message: `Cannot delete Master Patient Controller with id=${id}. Maybe Master Patient Controller was not found!`
      });
    }
  })
  .catch(err => {
    res.status(500).send({
      message: "Could not delete Master Patient Controller with id=" + id
    });
  });
};

