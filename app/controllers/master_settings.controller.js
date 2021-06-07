const Sequelize = require('sequelize');
const db = require("../models");
const settings_table = db.settings_tbl;
const Op = Sequelize.Op;
const AuditTrail = db.audit_trails;
// Retrieve all settings data
exports.findAll = (req, res) => { 
    settings_table.findAll({})
      .then((data) => {
        res.send(data);
      })
      .catch((err) => {
        res.status(500).send({
          message:
            err.message || "Some error occurred while retrieving settings List.",
        });
      });
  };

// Find a single settings with an Name
exports.findOneByName = (req, res) => {
    const name = req.body.name;  
    // var condition = name ? { name: { [Op.eq]: `${name}` } } : null;
    settings_table.findAll({ 
        where: {
            name: {
              [Op.like]: '%'+name+'%',
            }
          }
    })
      .then((data) => {
        res.send(data);
      })
      .catch((err) => {
        res.status(500).send({
          message:
            err.message || "Some error occurred while retrieving settings data.",
        });
      });
};

// Find a single record with an by id
exports.findOne = (req, res) => {
  const id = req.params.id;
  settings_table.findAll({ 
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
          err.message || "Some error occurred while retrieving settings data.",
      });
    });
};


// Create a settings Name
exports.create = (req,res)=>{
  var user_type ="Admin";
  if (!req.body) {
    res.status(400).send({"message":"Content cannot be empty"})
  } else if (!req.body.type) {
    res.status(400).send({"message":"settings type cannot be empty"})
  } else {
      const langVal = {
          'type' : req.body.type,
          'type_value' : req.body.type_value,
      }
      settings_table.create(langVal).then((data)=>{
        
          const auditTrailVal = {
              'user_id' : data.id,
              'trail_type' : user_type.charAt(0).toUpperCase() + user_type.slice(1)+'Settings Modules',
              'trail_message' : req.body.name+ ' '+ req.body.iso_name + ' is settings Modules as '+user_type.charAt(0).toUpperCase() + user_type.slice(1),
              'status': 1
            }
        AuditTrail.create(auditTrailVal,(err, data)=>{ });
          res.send(data);
      })
      .catch((err) => {
        console.log(err)
       res.status(500).send({ error: `${err} while creating Settings Modules` });
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
  settings_table.update(req.body, {
  where: { id: id }
})
  .then(num => {
    if (num == 1) {
      const auditTrailVal = {
        'user_id' : req.params.id,
        'trail_type' : user_type.charAt(0).toUpperCase() + user_type.slice(1)+'Setting Modules',
        'trail_message' : req.body.name+ ' '+ req.body.iso_name + ' is Setting Modules as '+user_type.charAt(0).toUpperCase() + user_type.slice(1),
        'status': 1
      }
  AuditTrail.create(auditTrailVal,(err, data)=>{ });
      res.send({
        message: "settings was updated successfully."
      });
    } else {
      res.send({
        message: `Cannot update settings with id=${id}. Maybe settings was not found or req.body is empty!`
      });
    }
  })
  .catch(err => {
    res.status(500).send({
      message: "Error updating settings with id=" + id
    });
  });
};


// Delete a settings with the specified id in the request
exports.delete = (req, res) => {
const id = req.params.id;
settings_table.destroy({
  where: { id: id }
})
  .then(num => {
    if (num == 1) {
      res.send({
        message: "Settings was deleted successfully!"
      });
    } else {
      res.send({
        message: `Cannot delete Settings with id=${id}. Maybe setting was not found!`
      });
    }
  })
  .catch(err => {
    res.status(500).send({
      message: "Could not delete settings with id=" + id
    });
  });
};

