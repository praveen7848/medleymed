const Sequelize = require('sequelize');
const db = require("../models");
const Vitals = db.vitals_tbl;
const Op = Sequelize.Op;
const AuditTrail = db.audit_trails;
// Retrieve all Languages
exports.findAll = (req, res) => { 
    Vitals.findAll({})
      .then((data) => {
        res.send({ message: "Default vitals fetched  successfully!",data});
      })
      .catch((err) => {
        res.status(500).send({
          message:
            err.message || "Some error occurred while retrieving Vitals List.",
        });
      });
  };




// Find a single Vitals with an by id
exports.findOne = (req, res) => {
  const id = req.params.id;

  // var condition = name ? { name: { [Op.eq]: `${name}` } } : null;
  Vitals.findAll({ 
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
          err.message || "Some error occurred while retrieving Vitals.",
      });
    });
};


// Create a Vitals
exports.create = (req,res)=>{
  var user_type ="Admin";
  if (!req.body) {
    res.status(400).send({"message":"Content cannot be empty"})
  } else if (!req.body.vital_name) {
    res.status(400).send({"message":"Vitals Name cannot be empty"})
  } else {
     
      Vitals.create(req.body).then((data)=>{
        
        //   const auditTrailVal = {
        //       'user_id' : data.id,
        //       'trail_type' : user_type.charAt(0).toUpperCase() + user_type.slice(1)+'Language Modules',
        //       'trail_message' : req.body.name+ ' '+ req.body.iso_name + ' is Language Modules as '+user_type.charAt(0).toUpperCase() + user_type.slice(1),
        //       'status': 1
        //     }
        // AuditTrail.create(auditTrailVal,(err, data)=>{ });
          res.send(data);
      })
      .catch((err) => {
        console.log(err)
       res.status(500).send({ error: `${err} while creating Vitals Modules` });
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
  Vitals.update(req.body, {
  where: { id: id }
})
  .then(num => {
    if (num == 1) {
//       const auditTrailVal = {
//         'user_id' : req.params.id,
//         'trail_type' : user_type.charAt(0).toUpperCase() + user_type.slice(1)+'Language Modules',
//         'trail_message' : req.body.name+ ' '+ req.body.iso_name + ' is Language Modules as '+user_type.charAt(0).toUpperCase() + user_type.slice(1),
//         'status': 1
//       }
//   AuditTrail.create(auditTrailVal,(err, data)=>{ });
      res.send({
        message: "Vitals was updated successfully."
      });
    } else {
      res.send({
        message: `Cannot update Vitals with id=${id}. Maybe Vitals was not found or req.body is empty!`
      });
    }
  })
  .catch(err => {
    res.status(500).send({
      message: "Error updating Language with id=" + id
    });
  });
};


// Delete a Vitals with the specified id in the request
exports.delete = (req, res) => {
const id = req.params.id;
Vitals.destroy({
  where: { id: id }
})
  .then(num => {
    if (num == 1) {
      res.send({
        message: "Vitals was deleted successfully!"
      });
    } else {
      res.send({
        message: `Cannot delete Vitals with id=${id}. Maybe Vitals was not found!`
      });
    }
  })
  .catch(err => {
    res.status(500).send({
      message: "Could not delete Vitals with id=" + id
    });
  });
};

