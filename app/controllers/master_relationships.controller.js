const Sequelize = require('sequelize');
const db = require("../models");
const masterrealtionships = db.master_realtionships;
const Op = Sequelize.Op;
const AuditTrail = db.audit_trails;
// Retrieve all masterrealtionships
exports.findAll = (req, res) => { 
    masterrealtionships.findAll({
      order: [
        ['relation_name', 'ASC'],
     ],
    })
      .then((data) => {
        //res.send({message:"Successfully  fetched All realtions",data});
        res.status(200).send({
             status: 200,
             error: false,
             message:"Successfully  fetched All realtions",
             data:data
          });
      })
      .catch((err) => {
        res.status(500).send({
          message:
            err.message || "Some error occurred while retrieving masterrealtionships List.",
        });
      });
  };

// Find a single masterrealtionships with an by id
exports.findOne = (req, res) => {
  const id = req.params.id;

  // var condition = name ? { name: { [Op.eq]: `${name}` } } : null;
  masterrealtionships.findAll({ 
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
          err.message || "Some error occurred while retrieving masterrealtionships.",
      });
    });
};


// Create a Language Name
exports.create = (req,res)=>{   
var user_type = "Admin"; 
  if (!req.body) {
    res.status(400).send({"message":"Content cannot be empty"})
  } else if (!req.body.relation_name) {
    res.status(400).send({"message":"Realtion Name cannot be empty"})
  } else {
      const langVal = {
          'relation_name' : req.body.relation_name          
      }
      masterrealtionships.create(langVal).then((data)=>{ 
        const auditTrailVal = {
            'user_id' : data.id,
            'trail_type' : user_type.charAt(0).toUpperCase() + user_type.slice(1)+'masterrealtionships Modules',
            'trail_message' : req.body.relation_name+ ' '+ req.body.relation_name + ' is masterrealtionships Modules as '+user_type.charAt(0).toUpperCase() + user_type.slice(1),
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
  masterrealtionships.update(req.body, {
  where: { id: id }
})
  .then(num => {
    if (num == 1) {
        const auditTrailVal = {
            'user_id' : req.params.id,
            'trail_type' : user_type.charAt(0).toUpperCase() + user_type.slice(1)+'Realtionship Modules',
            'trail_message' : req.body.realtion_name+ ' '+ req.body.realtion_name + ' is Realtionship Modules as '+user_type.charAt(0).toUpperCase() + user_type.slice(1),
            'status': 1
          }
      AuditTrail.create(auditTrailVal,(err, data)=>{ });
      res.send({
        message: "Realtion ship was updated successfully."
      });
    } else {
      res.send({
        message: `Cannot update Realtionship with id=${id}. Maybe Realtionship was not found or req.body is empty!`
      });
    }
  })
  .catch(err => {
    res.status(500).send({
      message: "Error updating masterrealtionships with id=" + id
    });
  });
};


// Delete a masterrealtionships with the specified id in the request
exports.delete = (req, res) => {
const id = req.params.id;
masterrealtionships.destroy({
  where: { id: id }
})
  .then(num => {
    if (num == 1) {
      res.send({
        message: "Masterrealtionship was deleted successfully!"
      });
    } else {
      res.send({
        message: `Cannot delete Masterrealtionship with id=${id}. Maybe Master realtionship was not found!`
      });
    }
  })
  .catch(err => {
    res.status(500).send({
      message: "Could not delete Masterrealtionship with id=" + id
    });
  });
};

