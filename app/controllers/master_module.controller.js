const db = require("../models");
const MasterModules = db.tbl_master_modules;
const MasterController = db.tbl_master_controllers;
const AuditTrail = db.audit_trails;
//const Op = db.Sequelize.Op;
var encryption = require("../helpers/Encryption");

// Retrieve all Master Modules from the Master Modules.
exports.findAll = (req, res) => {

	MasterController.hasMany(MasterModules, { foreignKey: "master_module_id" });
	MasterModules.belongsTo(MasterController, { foreignKey: "master_module_id" });

	MasterModules.findAll({ include: [{ model: MasterController, attributes: ['module_name']} ] })
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving Master Modules.",
      });
    });
};

// Find a single Master Modules with an id
exports.findOne = (req, res) => {
   const id = req.params.id;

  MasterModules.findAll({ where: {id: id} })
  .then((data) => {
    res.send(data);
  })
  .catch((err) => {
    res.status(500).send({
      message:
        err.message || "Some error occurred while retrieving Master Modules.",
    });
  });
};

// Retrieve all Module Count
exports.getModuleCount = (req, res) => {
  MasterModules.findAll({})
    .then(function (data) {
	  var activeData = data.filter(function(o) { return o.status == 1 }).length
      res.send({ totalData: data.length, activeData: activeData });
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving " + user_type,
      });
    });
};

// Create Module
exports.create = (req,res)=>{

  var user_type = "Admin"
  if (!req.body) {
    res.status(400).send({"message":"Content cannot be empty"})
  }
  
   else {
    var digits = Math.floor(Math.random() * 9000000000) + 1000000000;
 
      const MasterModulesVal = {
          'master_module_id' : req.body.master_module_id,
          'name' : req.body.name,
          'sub_unique_id' : digits,//req.body.module_unique_id,
          'sequence' : req.body.sequence,
          'required' : req.body.required,
          'status': req.body.status
      }
      MasterModules.create(MasterModulesVal)
      .then((data) => {
              const auditTrailVal = {
              'user_id' : data.id,
              'trail_type' : user_type.charAt(0).toUpperCase() + user_type.slice(1)+' Master Modules',
              'trail_message' : req.body.name+ ' '+ req.body.required + ' is Master Modules as '+user_type.charAt(0).toUpperCase() + user_type.slice(1),
              'status': 1
            }
        AuditTrail.create(auditTrailVal,(err, data)=>{ })
        res.send(data);
      })
      .catch((err) => {
        console.log(err)
       res.status(500).send({ error: `${err} while creating Master Modules` });
      });
    
  }
};

// Update a Master Modules by the id in the request
exports.update = (req, res) => {
  const id = req.params.id;
  var user_type = "Admin";
  var digits = Math.floor(Math.random() * 9000000000) + 1000000000;
  const MasterModulesVal = {
    'master_module_id' : req.body.master_module_id,
    'name' : req.body.name,
    'sub_unique_id' : digits, //req.body.module_unique_id,
    'sequence' : req.body.sequence,
    'required' : req.body.required,
    'status': req.body.status
}
  MasterModules.update(MasterModulesVal, {
    where: { id: id },
  })
  .then((num) => {
      if (num == 1) {
        const auditTrailVal = {
          'user_id' : req.params.id,
          'trail_type' : user_type.charAt(0).toUpperCase() + user_type.slice(1)+' Master Modules',
          'trail_message' : req.body.name+ ' '+ req.body.required + ' is Master Modules as '+user_type.charAt(0).toUpperCase() + user_type.slice(1),
          'status': 1
        }
    AuditTrail.create(auditTrailVal,(err, data)=>{ })
        res.send({
          message: "Master Module was updated successfully.",
        });
      } else {
        res.send({
          message: `Cannot update Master Modules with id=${id}. Maybe Master Module was not found or req.body is empty!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error updating Master Modules with id=" + id,
      });
    });
};

// Delete a Master Modules with the specified id in the request
exports.delete = (req, res) => {
  const id = req.params.id;

  MasterModules.destroy({
    where: { id: id },
  })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: "Master Modules was deleted successfully!",
        });
      } else {
        res.send({
          message: `Cannot delete Master Modules with id=${id}. Maybe Master Modules was not found!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Could not delete Master Modules with id=" + id,
      });
    });
};