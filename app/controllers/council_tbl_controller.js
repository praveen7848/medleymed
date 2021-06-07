const Sequelize = require('sequelize');
const db = require("../models");
const Council = db.tbl_councill;
const Op = Sequelize.Op;
const AuditTrail = db.audit_trails;
// Retrieve all Council
exports.findAll = (req, res) => { 
    Council.findAll({})
      .then((data) => {
        res.send(data);
      })
      .catch((err) => {
        res.status(500).send({
          message:
            err.message || "Some error occurred while retrieving Council List.",
        });
      });
  };

// Find a single Council with an by id
exports.findOne = (req, res) => {
  const id = req.params.id;

  // var condition = name ? { name: { [Op.eq]: `${name}` } } : null;
  Council.findAll({ 
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
          err.message || "Some error occurred while retrieving Council.",
      });
    });
};


// Create a Language Name
exports.create = (req,res)=>{   
var user_type = "Admin"; 
  if (!req.body) {
    res.status(400).send({"message":"Content cannot be empty"})
  } else if (!req.body.council_name) {
    res.status(400).send({"message":"Council Name cannot be empty"})
  } else {
      const langVal = {
          'council_name' : req.body.council_name          
      }
      Council.create(langVal).then((data)=>{ 
        const auditTrailVal = {
            'user_id' : data.id,
            'trail_type' : user_type.charAt(0).toUpperCase() + user_type.slice(1)+'Council Modules',
            'trail_message' : req.body.council_name+ ' '+ req.body.council_name + ' is Council Modules as '+user_type.charAt(0).toUpperCase() + user_type.slice(1),
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
  if(req.body.data) {
      req.body = req.body.data;
  }
  Council.update(req.body, {
  where: { id: id }
})
  .then(num => {
    if (num == 1) {
        const auditTrailVal = {
            'user_id' : req.params.id,
            'trail_type' : user_type.charAt(0).toUpperCase() + user_type.slice(1)+'Council Modules',
            'trail_message' : req.body.council_name+ ' '+ req.body.council_name + ' is Council Modules as '+user_type.charAt(0).toUpperCase() + user_type.slice(1),
            'status': 1
          }
      AuditTrail.create(auditTrailVal,(err, data)=>{ });
      res.send({
        message: "Council was updated successfully."
      });
    } else {
      res.send({
        message: `Cannot update Council with id=${id}. Maybe Council was not found or req.body is empty!`
      });
    }
  })
  .catch(err => {
    res.status(500).send({
      message: "Error updating Council with id=" + id
    });
  });
};


// Delete a Council with the specified id in the request
exports.delete = (req, res) => {
const id = req.params.id;
Council.destroy({
  where: { id: id }
})
  .then(num => {
    if (num == 1) {
      res.send({
        message: "Council was deleted successfully!"
      });
    } else {
      res.send({
        message: `Cannot delete Council with id=${id}. Maybe Council was not found!`
      });
    }
  })
  .catch(err => {
    res.status(500).send({
      message: "Could not delete Council with id=" + id
    });
  });
};

