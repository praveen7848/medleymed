const Sequelize = require("sequelize");
var encryption = require("../helpers/Encryption");
const db = require("../models");
const masterModule = db.master_modules_tbl;
const masterSubModule = db.master_sub_module_tbl;
const masterSubModulePage = db.master_sub_module_pages_tbl;
const Op = Sequelize.Op;
const AuditTrail = db.audit_trails;


// Retrieve all modules
exports.retreiveSequenceId = (req, res) => {
    const masterPageModuleName = req.params.masterPageModuleName;
    masterSubModulePage.findAll({
        where: {
            page_name: encryption.encryptData(masterPageModuleName)
        },
        attributes: {
            exclude: ['createdAt','updatedAt']
        }
    }).then((data) => {
        res.send({
            status: 200,
            message: "Master Sub Page module record Fetched Successfully",
            error: false,
            data: data,
        });
    }).catch((err) => {
        res.status(500).send({
            message:
                err.message || "Some error occurred while retrieving Appointments.",
        });
    });
};
// Ends Here


// Retrieve all modules
exports.findAll = (req, res) => {

    masterModule.hasOne(masterSubModulePage, { foreignKey: "master_module_id" });
    masterSubModulePage.belongsTo(masterModule, { foreignKey: "master_module_id" });
    
    masterSubModule.hasOne(masterSubModulePage, { foreignKey: "sub_module_id" });
    masterSubModulePage.belongsTo(masterSubModule, { foreignKey: "sub_module_id" });
    masterSubModulePage
    .findAll({
        // where:
        // {
        //     status: 1,
        // },
        include: [{ model: masterModule, attributes: ["module_name"] }, { model: masterSubModule, attributes: ["sub_module_name"] }],

        attributes: {
            exclude: ['createdAt','updatedAt']
        },
        order: [
            ['sequence_id', 'ASC'],
            ['page_name', 'ASC'],
        ],
    })
    .then((data) => {
      res.send({
        status: 200,
        error: false,
        message: "Default Master modules page fetched  successfully!",
        data: data,
      });
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving Vitals List.",
      });
    });
};
//   Ends Here

// Create a Master modules page
exports.create = (req, res) => {
  var user_type = "Admin";
  if (!req.body) {
    res.status(400).send({ message: "Content cannot be empty" });
  } else if (!req.body.page_name) {
    res.status(400).send({ message: "Page Name cannot be empty" });
  } else {
    masterSubModulePage
      .create(req.body)
      .then((data) => {
        const auditTrailVal = {
          user_id: data.id,
          trail_type:
            user_type.charAt(0).toUpperCase() +
            user_type.slice(1) +
            "Sub Module Page",
          trail_message:
            req.body.module_name +
            " " +
            req.body.module_name +
            " is Sub Module page as " +
            user_type.charAt(0).toUpperCase() +
            user_type.slice(1),
          status: 1,
        };
        AuditTrail.create(auditTrailVal, (err, data) => {});
        res.send({
          status: 200,
          error: false,
          message: "Default sub modules page Created  successfully!",
        });
      })
      .catch((err) => {
        console.log(err);
        res.status(500).send({ error: `${err} while creating Vitals Modules` });
      });
  }
};
// Ends here

// Find a single module with an Name
exports.findOne = (req, res) => {
    const masterSubModulePageId = req.params.id;
    masterSubModulePage.findAll({
        where: {
            id: masterSubModulePageId
        },
        attributes: {
            exclude: ['createdAt','updatedAt']
        }
    }).then((data) => {
        res.send({
            status: 200,
            message: "Master sub module page record Fetched Successfully",
            error: false,
            data: data,
        });
    }).catch((err) => {
        res.status(500).send({
            message:
                err.message || "Some error occurred while retrieving Appointments.",
        });
    });
};

// Update a Patient Appointment by the id in the request
exports.update = (req, res) => {
    const masterSubModulePageId = req.params.id;
    if (req.body.data) {
        req.body = req.body.data;
    }
    masterSubModulePage.update(req.body, {
        where: {
            id: masterSubModulePageId
        },
    }).then(num => {
        if (num == 1) {
            res.status(200).send({
                status: 200,
                error: false,
                message: "Master sub module page updated Successfully",
            });
        } else {
            res.send({
                message: `Cannot update module with id=${id}. Maybe modules was not found or req.body is empty!`
            });
        }
    }).catch(err => {
        res.status(500).send({
            message: "Error updating Audit Trail"
        });
    });
};

// Delete a module with the specified id in the request
exports.delete = (req, res) => {
    const masterSubModulePageId = req.params.id;
    masterSubModulePage.destroy({
        where: { id: masterSubModulePageId }
    }).then(num => {
        if (num == 1) {
            res.send({
                status: 200,
                error: false,
                message: "Master sub module page Deleted Successfully",
            });
        } else {
            res.send({
                message: `Cannot delete module with id=${id}. Maybe module was not found!`
            });
        }
    }).catch(err => {
        res.status(500).send({
            message: "Could not delete module with id=" + id
        });
    });
};