const db = require("../models");
const AuditTrail = db.audit_trails;
const MasterController = db.tbl_master_controllers;

exports.findAll = (req, res) => {
   MasterController.findAll({})
    .then((data) => {
        res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error retrieving User with id=" + id,
      });
    });
};

// Find a single Responders with an id
exports.findOne = (req, res) => {
    const id = req.params.id;  
    MasterController.findAll({ where: {id: id} })
      .then((data) => {
        res.send(data);
      })
      .catch((err) => {
        res.status(500).send({
          message:
            err.message || "Some error occurred while retrieving Responders.",
        });
      });
};

// To get all users,doctors and clinics count
exports.getCount = (req, res) => {
  console.log("userType ", req.params.userType);
  const userType = req.params.userType;
  var tableName = "";
  if (userType === "doctors") tableName = db.doctor_tbl;
  else if (userType === "clinics") tableName = db.clinic_tbl;
  else if (userType === "users") tableName = db.users_tbl;
  else if (userType === "patients") tableName = db.patient_tbl;
  console.log("tableName", tableName);
  tableName
    .findAll({})
    .then(function (data) {
      // var activeData = data.filter(function (o) {
      //   return o.is_available == 1;
      // }).length;
      // res.send({ totalData: data.length });

      res.send({
        status: 200,
        error: false,
        message: "Created Successfully",
        data:data.length
         });
         })
    
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving " + user_type,
      });
    });
};






// Retrieve all Controllers Count
exports.getControllerCount = (req, res) => {
  MasterController.findAll({})
    .then(function (data) {
	  var activeData = data.filter(function(o) { return o.module_status == 1 }).length
      res.send({ totalData: data.length, activeData: activeData });
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving " + user_type,
      });
    });
};

// Create Controller
exports.create = (req,res)=>{
    var user_type = "Admin"
    if (!req.body) {
      res.status(400).send({"message":"Content cannot be empty"})
    }
  
     else {
      var digits = Math.floor(Math.random() * 9000000000) + 1000000000;
  
        const MastercontrollerVal = {
            'super_module_id' : req.body.super_module_id,
            'module_name' : req.body.module_name,
            'module_unique_id' : digits,//req.body.module_unique_id,
            'master_patient_controller_id' : req.body.master_patient_controller_id,
            'module_required' : req.body.module_required,
            'module_sqequence' : req.body.module_sqequence,
            'module_status': req.body.module_status,
            'updated_by': "admin"
        }
        MasterController.create(MastercontrollerVal)
        .then((data) => {
                const auditTrailVal = {
                'user_id' : data.id,
                'trail_type' : user_type.charAt(0).toUpperCase() + user_type.slice(1)+' Master Modules',
                'trail_message' : req.body.module_name+ ' '+ req.body.module_required + ' is Master Modules as '+user_type.charAt(0).toUpperCase() + user_type.slice(1),
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

// Update a Responders by the id in the request
exports.update = (req, res) => {
  const id = req.params.id;
  var user_type = "Admin";
  var digits = Math.floor(Math.random() * 9000000000) + 1000000000;
  const MastercontrollerVal = {
    'super_module_id' : req.body.super_module_id,
    'module_name' : req.body.module_name,
    'module_unique_id' : digits,//req.body.module_unique_id,
    'master_patient_controller_id' : req.body.master_patient_controller_id,
    'module_required' : req.body.module_required,
    'module_sqequence' : req.body.module_sqequence,
    'module_status': req.body.module_status
  }
  MasterController.update(MastercontrollerVal, {
    where: { id: id },
  })
  .then((num) => {
      if (num == 1) {
        const auditTrailVal = {
          'user_id' : req.params.id,
          'trail_type' : user_type.charAt(0).toUpperCase() + user_type.slice(1)+' Master Modules',
          'trail_message' : req.body.module_name+ ' '+ req.body.module_required + ' is Master Modules as '+user_type.charAt(0).toUpperCase() + user_type.slice(1),
          'status': 1
        }
    AuditTrail.create(auditTrailVal,(err, data)=>{ })
        res.send({
          message: "Master Module was updated successfully.",
        });
      } else {
        res.send({
          message: `Cannot update Responders with id=${id}. Maybe Master Module was not found or req.body is empty!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error updating Responders with id=" + id,
      });
    });
};

// Delete a Responders with the specified id in the request
exports.delete = (req, res) => {
  const id = req.params.id;

  MasterController.destroy({
    where: { id: id },
  })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: "Responder was deleted successfully!",
        });
      } else {
        res.send({
          message: `Cannot delete Responder with id=${id}. Maybe Responder was not found!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Could not delete Responder with id=" + id,
      });
    });
};

// Delete all Responders from the database.
exports.deleteAll = (req, res) => {
  MasterController.destroy({
    where: {},
    truncate: false,
  })
    .then((nums) => {
      res.send({ message: `${nums} Responder were deleted successfully!` });
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while removing all Responder.",
      });
    });
};

  
