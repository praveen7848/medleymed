const Sequelize = require("sequelize");
const db = require("../models");

let masterModules = db.master_modules_tbl;
let masterSubModuleTbl = db.master_sub_module_tbl;
let masterSubModulePagesTbl = db.master_sub_module_pages_tbl;
const masterSubModuleClinicPage = db.master_sub_module_clinic_pages_tbl;
let clinicTbl = db.clinic_tbl;

const Op = Sequelize.Op;
const AuditTrail = db.audit_trails;

// Retrieve all modules
exports.findAll = (req, res) => {
  masterModules.hasMany(masterSubModuleClinicPage, {
    foreignKey: "master_module_id",
  });
  masterSubModuleClinicPage.belongsTo(masterModules, {
    foreignKey: "master_module_id",
  });

  masterSubModuleTbl.hasMany(masterSubModuleClinicPage, {
    foreignKey: "sub_module_id",
  });
  masterSubModuleClinicPage.belongsTo(masterSubModuleTbl, {
    foreignKey: "sub_module_id",
  });

  masterSubModulePagesTbl.hasMany(masterSubModuleClinicPage, {
    foreignKey: "page_module_id",
  });
  masterSubModuleClinicPage.belongsTo(masterSubModulePagesTbl, {
    foreignKey: "page_module_id",
  });

  clinicTbl.hasMany(masterSubModuleClinicPage, { foreignKey: "clinic_id" });
  masterSubModuleClinicPage.belongsTo(clinicTbl, { foreignKey: "clinic_id" });

  masterSubModuleClinicPage
    .findAll({
      // where: {
      //   status: 1,
      // },
      include: [
        {
          model: masterModules,
         //  where: { status: 1 },
          required: false,
          attributes: { exclude: ["createdAt", "updatedAt"] },
        },
        {
          model: masterSubModuleTbl,
         //  where: { status: 1 },
          required: false,
          attributes: { exclude: ["createdAt", "updatedAt"] },
        },
        {
          model: masterSubModulePagesTbl,
         //  where: { status: 1 },
          required: false,
          attributes: { exclude: ["createdAt", "updatedAt"] },
        },
        {
          model: clinicTbl,
          required: false,
          attributes: { exclude: ["createdAt", "updatedAt"] },
        },
      ],
      attributes: {
        exclude: ["createdAt", "updatedAt"],
      },
      order: [
        ["master_module_sequence_id", "ASC"],
        ["sub_module_sequence_id", "ASC"],
        ["page_module_sequence_id", "ASC"],
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
  // elseif(!req.body.page_name){
  //     res.status(400).send({ message: "Page Name cannot be empty" });
  // }

  var user_type = "Admin";
  if (!req.body) {
    res.status(400).send({ message: "Content cannot be empty" });
  } else {

  // console.log(req.body);
  // return;

    let countCondition = {
      clinic_id: req.body.clinic_id,
      // page_module_id: req.body.page_module_id,
      // sub_module_id: req.body.sub_module_id,
      master_module_id: req.body.master_module_id,
    };

    masterSubModuleClinicPage.count({ where: countCondition }).then((count) => {
      if (count < 1) {
        masterSubModuleClinicPage
          .create(req.body)
          .then((data) => {
            const auditTrailVal = {
              user_id: data.id,
              trail_type:
                user_type.charAt(0).toUpperCase() +
                user_type.slice(1) +
                "sub module clinic page",
              trail_message:
                req.body.module_name +
                " " +
                req.body.module_name +
                " is sub module clinic page as " +
                user_type.charAt(0).toUpperCase() +
                user_type.slice(1),
              status: 1,
            };
            AuditTrail.create(auditTrailVal, (err, data) => {});
            res.send({
              status: 200,
              error: false,
              message: "Master sub Clinic Page module Created  successfully!",
            });
          })
          .catch((err) => {
            console.log(err);
            res
              .status(500)
              .send({ error: `${err} while creating Vitals Modules` });
          });
      } else {
        res.send({
          status: 204,
          error: true,
          message: "Master sub Clinic Page module Created already!",
        });
      }
    });
  }
};
// Ends here

// Find a single module with an Name
exports.findOne = (req, res) => {
  const masterSubModuleClinicPageId = req.params.id;
  masterSubModuleClinicPage
    .findAll({
      where: {
        id: masterSubModuleClinicPageId,
      },
      attributes: {
        exclude: ["createdAt", "updatedAt"],
      },
    })
    .then((data) => {
      res.send({
        status: 200,
        message: "Master sub module clinic page record Fetched Successfully",
        error: false,
        data: data,
      });
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving Appointments.",
      });
    });
};

// Update a Patient Appointment by the id in the request
exports.update = (req, res) => {
  const masterSubModuleClinicPageId = req.params.id;
  if (req.body.data) {
    req.body = req.body.data;
  }
  masterSubModuleClinicPage
    .update(req.body, {
      where: {
        id: masterSubModuleClinicPageId,
      },
    })
    .then((num) => {
      if (num == 1) {
        res.status(200).send({
          status: 200,
          error: false,
          message: "Master sub module clinic page updated Successfully",
        });
      } else {
        res.send({
          message: `Cannot update module with id=${id}. Maybe modules was not found or req.body is empty!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error updating Audit Trail",
      });
    });
};

// Delete a module with the specified id in the request
exports.delete = (req, res) => {
  const masterSubModuleClinicPageId = req.params.id;
  masterSubModuleClinicPage
    .destroy({
      where: { id: masterSubModuleClinicPageId },
    })
    .then((num) => {
      if (num == 1) {
        res.send({
          status: 200,
          error: false,
          message: "Master sub module clinic page Deleted Successfully",
        });
      } else {
        res.send({
          message: `Cannot delete module with id=${id}. Maybe module was not found!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Could not delete module with id=" + id,
      });
    });
};
