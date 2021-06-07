const Sequelize = require('sequelize');
const db = require("../models");
var encryption = require("../helpers/Encryption");
const Languages = db.tbl_languages;
const Time_zones = db.timezone_tbl;
const MasterConfigurations = db.master_configurations;
const Op = Sequelize.Op;
const AuditTrail = db.audit_trails;


// Retrieve all MasterConfigurations
exports.findAll = (req, res) => { 
    MasterConfigurations.findAll({})
      .then((data) => {
       // console.log(data);
        res.send(data);
      })
      .catch((err) => {
        res.status(500).send({
          message:
            err.message || "Some error occurred while retrieving Master Configurations List.",
        });
      });
  };

  // Retrieve all MasterConfigurations
exports.finddefaultsettings = (req, res) => { 
  var respobject = [];
  MasterConfigurations.findAll({})
  .then((resp) => {
    Time_zones.findAll({  where:{id: resp[0].timezone},attributes:['timezone']})
    .then((data) => {
    Languages.findAll({ where:{id: Array.from(resp[0].language.split(','),Number)},attributes: ["id","name",'iso_val','language_pic']  })
     .then((langresp) => {
      respobject.push({"Languages":langresp,"timeZone":data[0].timezone,"Country":encryption.decryptData(resp[0].country),"Currency":encryption.decryptData(resp[0].currency)})
            res.send(respobject);
          })
          .catch((err) => {
            res.status(500).send({
              message:
                err.message || "Some error occurred while retrieving Time_zones List.",
            });
          });
     })
     .catch((err) => {
       res.status(500).send({
         message:
           err.message || "Some error occurred while retrieving Languages List.",
       });
     });
//      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving Master Configurations List.",
      });
    });
};



// Find a single MasterConfigurations with an by id
exports.findOne = (req, res) => {
  const id = req.params.id;

  // var condition = name ? { name: { [Op.eq]: `${name}` } } : null;
  MasterConfigurations.findAll({ 
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
          err.message || "Some error occurred while retrieving Master Configurations.",
      });
    });
};


// Create a Master Configuration Name
exports.create = (req,res)=>{
  var user_type ="Admin";
  if (!req.body) {
    res.status(400).send({"message":"Content cannot be empty"})
  } else if (!req.body.name) {
    res.status(400).send({"message":"Master Configuration Name cannot be empty"})
  } else {
      // const langVal = {
      //     'name' : req.body.name,
      //     'iso_name' : req.body.iso_name,
      // }
      //
       MasterConfigurations.create(req.body).then((data)=>{
        
          const auditTrailVal = {
              'user_id' : data.id,
              'trail_type' : user_type.charAt(0).toUpperCase() + user_type.slice(1)+'Master Configuration Modules',
              'trail_message' : req.body.name+ ' '+ req.body.iso_name + ' is Master Configuration Modules as '+user_type.charAt(0).toUpperCase() + user_type.slice(1),
              'status': 1
            }
        AuditTrail.create(auditTrailVal,(err, data)=>{ });
          res.send(data);
      })
      .catch((err) => {
        console.log(err)
       res.status(500).send({ error: `${err} while creating Master Configuration Modules` });
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
MasterConfigurations.update(req.body, {
  where: { id: id }
})
  .then(num => {
    if (num == 1) {
      const auditTrailVal = {
        'user_id' : req.params.id,
        'trail_type' : user_type.charAt(0).toUpperCase() + user_type.slice(1)+'Master Configuration Modules',
        'trail_message' : req.body.name+ ' '+ req.body.iso_name + ' is Master Configuration Modules as '+user_type.charAt(0).toUpperCase() + user_type.slice(1),
        'status': 1
      }
  AuditTrail.create(auditTrailVal,(err, data)=>{ });
      res.send({
        message: "Master Configuration was updated successfully."
      });
    } else {
      res.send({
        message: `Cannot update Master Configuration with id=${id}. Maybe Master Configuration was not found or req.body is empty!`
      });
    }
  })
  .catch(err => {
    res.status(500).send({
      message: "Error updating Master Configuration with id=" + id
    });
  });
};


// Delete a Master Configuration with the specified id in the request
exports.delete = (req, res) => {
const id = req.params.id;
MasterConfigurations.destroy({
  where: { id: id }
})
  .then(num => {
    if (num == 1) {
      res.send({
        message: "Master Configuration was deleted successfully!"
      });
    } else {
      res.send({
        message: `Cannot delete Master Configuration with id=${id}. Maybe Master Configuration was not found!`
      });
    }
  })
  .catch(err => {
    res.status(500).send({
      message: "Could not delete Master Configuration with id=" + id
    });
  });
};

