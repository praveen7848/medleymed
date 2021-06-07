const Sequelize = require('sequelize');
const db = require("../models");
const { NOW } = require('sequelize');
const Patient_address = db.patient_address;
const Op = Sequelize.Op;
const AuditTrail = db.audit_trails;

// Create a Patient address
exports.create = (req,res)=>{   
var user_type = "Admin"; 
  if (!req.body) {
    res.status(400).send({"message":"Content cannot be empty"})
  } else {
     console.log(req.body)
      Patient_address.create(req.body).then((data)=>{ 
        res.send({  message: "Patient address was created successfully.",data})});     
  }
};

// Retrieve all Patient address
exports.findAll = (req, res) => { 
    Patient_address.findAll({})
      .then((data) => {
        res.send(data);
      })
      .catch((err) => {
        res.status(500).send({
          message:
            err.message || "Some error occurred while retrieving Patient address List.",
        });
      });
  };

// find all address by patient id
exports.findalladdressbypatient = (req,res) => {
    let patient_id = req.params.id;
    Patient_address.findAll({where: {user_id : patient_id}})
    .then((data) => {
      res.send({  message: "Patient address list.",data});
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving Patient address List.",
      });
    });
}

// Find a single Patient address with an by id
exports.findOne = (req, res) => {
  const id = req.params.id;
  // var condition = name ? { name: { [Op.eq]: `${name}` } } : null;
  Patient_address.findAll({ 
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
          err.message || "Some error occurred while retrieving Patient address.",
      });
    });
};

exports.updateaddressdefault = (req,res) => {
    const id = req.params.id;
    const p_id = req.params.pid;
    Patient_address.update({"is_default":0}, {
      where: { patient_id: p_id }
      })
      .then(num => {
        if (num >= 1) {
          Patient_address.update(req.body, {
            where: { id: id }
            })
            .then(num => {
              if (num == 1) {
                res.send({
                  message: "Patient address made default."
                });
              } else {
                res.send({
                  message: `Cannot update Patient address default with id=${id}. Maybe Patient address was not found or req.body is empty!`
                });
              }
            })
            .catch(err => {
              res.status(500).send({
                message: "Error updating Patient address with id=" + id
              });
            });
        } else {
          res.send({
            message: `Cannot update Patient address default132 with id=${id}. Maybe Patient address was not found or req.body is empty!`
          });
        }
      })
      .catch(err => {
        res.status(500).send({
          message: "Error updating Patient address with id=" + id
        });
      });
   
}

// Update a  by the id in the request
exports.update = (req, res) => {
  const id = req.params.id;
  var user_type = "Admin"; 
  Patient_address.update(req.body, {
  where: { id: id }
})
  .then(num => {
    if (num == 1) {
      res.send({
        message: "Patient address was updated successfully."
      });
    } else {
      res.send({
        message: `Cannot update Patient address with id=${id}. Maybe Patient address was not found or req.body is empty!`
      });
    }
  })
  .catch(err => {
    res.status(500).send({
      message: "Error updating Patient address with id=" + id
    });
  });
};


// Delete a Patient address with the specified id in the request
exports.delete = (req, res) => {
const id = req.params.id;
var user_type = "Admin"; 
Patient_address.destroy({
  where: { id: id }
})
  .then(num => {
    if (num == 1) {
     
      res.send({
        message: "Patient address was deleted successfully!"
      });
    } else {
      res.send({
        message: `Cannot delete Patient address with id=${id}. Maybe Patient address was not found!`
      });
    }
  })
  .catch(err => {
    res.status(500).send({
      message: "Could not delete Patient address with id=" + id
    });
  });
};

