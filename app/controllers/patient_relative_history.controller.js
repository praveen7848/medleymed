const Sequelize = require('sequelize');
const db = require("../models");
const patient_relative_history = db.patient_relative_history;
const Patient = db.patient_tbl;
const Op = Sequelize.Op;
const AuditTrail = db.audit_trails;
// Retrieve all patient relative history
exports.findAll = (req, res) => { 
  Patient.hasOne(patient_relative_history, { foreignKey: "patient_id" });
  patient_relative_history.belongsTo(Patient, { foreignKey: "patient_id" });
    patient_relative_history.findAll({include: [Patient]})
      .then((data) => {
        res.send(data);
      })
      .catch((err) => {
        res.status(500).send({
          message:
            err.message || "Some error occurred while retrieving patient relative history List.",
        });
      });
  };

// Find a single patient relative history with an by id
exports.findOne = (req, res) => {
  const id = req.params.id;
  // var condition = name ? { name: { [Op.eq]: `${name}` } } : null;
  patient_relative_history.findAll({ 
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
          err.message || "Some error occurred while retrieving patient relative history.",
      });
    });
};


// Create a patient relative history 
exports.create = (req,res)=>{   
var user_type = "Admin"; 
  if (!req.body) {
    res.status(400).send({"message":"Content cannot be empty"})
  } else if (!req.body.relative_name) {
    res.status(400).send({"message":"relative Name cannot be empty"})
  } else {
      const langVal = {
          'patient_id' : req.body.patient_id, 
          'relative_name' : req.body.relative_name,
          'relative_gender' : req.body.relative_gender,
          'relation' : req.body.relation,
          'relative_diseases' : req.body.relative_diseases,
          'relative_chronic_diseases' : req.body.relative_chronic_diseases,
          'relative_lifestyle_of_food' : req.body.relative_lifestyle_of_food,
          'hereditary_diseases' : req.body.hereditary_diseases,
          'comments': req.body.comments,
          'relative_profile': req.body.relative_profile,
      }
      patient_relative_history.create(langVal).then((data)=>{ 
        const auditTrailVal = {
            'user_id' : data.id,
            'trail_type' : user_type.charAt(0).toUpperCase() + user_type.slice(1)+'patient relative history Modules',
            'trail_message' : req.body.shortname+ ' '+ req.body.name + ' is patient relative history Modules as '+user_type.charAt(0).toUpperCase() + user_type.slice(1),
            'status': 1
          }
      AuditTrail.create(auditTrailVal,(err, data)=>{ });
        res.send(data)});     
  }
};


// Update a Audit Trail by the id in the request
exports.update = (req, res) => {
  const id = req.params.id;
  var user_type = "Admin"; 
  patient_relative_history.update(req.body, {
  where: { id: id }
})
  .then(num => {
    if (num == 1) {
        const auditTrailVal = {
            'user_id' : req.params.id,
            'trail_type' : user_type.charAt(0).toUpperCase() + user_type.slice(1)+'patient relative history Modules',
            'trail_message' : req.body.shortname+ ' '+ req.body.name + ' is patient relative history Modules as '+user_type.charAt(0).toUpperCase() + user_type.slice(1),
            'status': 1
          }
      AuditTrail.create(auditTrailVal,(err, data)=>{ });
      res.send({
        message: "patient relative history was updated successfully."
      });
    } else {
      res.send({
        message: `Cannot update patient relative history with id=${id}. Maybe patient relative history was not found or req.body is empty!`
      });
    }
  })
  .catch(err => {
    res.status(500).send({
      message: "Error updating patient relative history with id=" + id
    });
  });
};


// Delete a patient relative history with the specified id in the request
exports.delete = (req, res) => {
const id = req.params.id;
var user_type = "Admin"; 
patient_relative_history.destroy({
  where: { id: id }
})
  .then(num => {
    if (num == 1) {
        const auditTrailVal = {
            'user_id' : req.params.id,
            'trail_type' : user_type.charAt(0).toUpperCase() + user_type.slice(1)+'patient relative history Modules',
            'trail_message' :  req.params.id+ ' '+ ' is patient relative history Modules as '+user_type.charAt(0).toUpperCase() + user_type.slice(1),
            'status': 1
          }
      AuditTrail.create(auditTrailVal,(err, data)=>{ }); 
      res.send({
        message: "patient relative data history was deleted successfully!"
      });
    } else {
      res.send({
        message: `Cannot delete patient relative history with id=${id}. Maybe patient relative history was not found!`
      });
    }
  })
  .catch(err => {
    res.status(500).send({
      message: "Could not delete patient relative history with id=" + id
    });
  });
};

