const Sequelize = require("sequelize");
const db = require("../models");
const masterModule = db.master_modules_tbl;
const Op = Sequelize.Op;
const AuditTrail = db.audit_trails;
const base64Img = require("base64-img");

// Retrieve all modules
exports.retreiveSequenceId = (req, res) => {
    const masterModuleId = req.params.masterModuleId;
    masterModule.findAll({
        where: {
            id: masterModuleId
        },
        attributes: {
            exclude: ['createdAt','updatedAt']
        }
    }).then((data) => {
        res.send({
            status: 200,
            message: "Master module record Fetched Successfully",
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
//   Ends Here



// Retrieve all modules
exports.findAll = (req, res) => {
    masterModule
    .findAll({
        // where:
        // {
        //     status: 1,
        // },
        attributes: {
            exclude: ['createdAt','updatedAt']
        },
        order: [
            ['sequence_id', 'ASC'],
            ['module_name', 'ASC'],
        ],
    })
    .then((data) => {
      res.send({
        status: 200,
        error: false,
        message: "Default Master modules fetched  successfully!",
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

// Create a Master modules
exports.create = (req, res) => {
  var user_type = "Admin";
  if (!req.body) {
    res.status(400).send({ message: "Content cannot be empty" });
  } else if (!req.body.module_name) {
    res.status(400).send({ message: "module Name cannot be empty" });
  } else {

    let masterModuleImageDetails = "";
    if (req.body.image_path != "") {
        masterModuleImageDetails = req.body.image_path;
      delete req.body["image_path"];
    }

      let masterSequenceCountCondition = {
        sequence_id: req.body.sequence_id,
      };

      let masterSequenceandModuleCountCondition = {
        sequence_id: req.body.sequence_id,
        module_name: req.body.module_name,
      };
  
      masterModule.count({ where: masterSequenceCountCondition }).then((sequenceCount) => {
         if(sequenceCount > 0){
            res.send({
                status: 204,
                error: true,
                message: "Master Module already created with this Sequence ID..!",
            });
         }else{
            masterModule.count({ where: masterSequenceandModuleCountCondition }).then((moduleSequenceCount) => {
                if(sequenceCount > 0){
                    res.send({
                        status: 204,
                        error: true,
                        message: "Master Module and Sequence already created..!",
                    });
                }else{
                    masterModule
                    .create(req.body)
                    .then((data) => {
                      const auditTrailVal = {
                        user_id: data.id,
                        trail_type:
                          user_type.charAt(0).toUpperCase() +
                          user_type.slice(1) +
                          "module Module",
                        trail_message:
                          req.body.module_name +
                          " " +
                          req.body.module_name +
                          " is module Modules as " +
                          user_type.charAt(0).toUpperCase() +
                          user_type.slice(1),
                        status: 1,
                      };
                      AuditTrail.create(auditTrailVal, (err, data) => {});
              
                      if (masterModuleImageDetails != "") {
                          const MASTER_FILE_PATH = "./public/uploads/master_modules";
                          base64Img.img(
                              masterModuleImageDetails.base64,
                              MASTER_FILE_PATH,
                            Date.now(),
                            function (err, filepath) {
                              const pathArr = filepath.split("/");
                              const fileName = pathArr[pathArr.length - 1];
                              const updatefinalName = filepath.replace(/\\/g, "/").split("/");
                              const updatefinalFileName = updatefinalName[3];
                              const moduleImageData = "/uploads/master_modules/" + updatefinalFileName;
                              var options = { where: { id: data.id } };
                              masterModule.update(
                                { image_path: moduleImageData },
                                options
                              ).then((data) => {});
                            }
                          );
                        }
              
                      res.send({
                        status: 200,
                        error: false,
                        message: "Default Master modules Created  successfully!",
                      });
              
                    })
                    .catch((err) => {
                      console.log(err);
                      res.status(500).send({ error: `${err} while creating Vitals Modules` });
                    });
                }
            });
         }
      });
  }
};
// Ends here

// Find a single module with an Name
exports.findOne = (req, res) => {
    const masterModuleId = req.params.id;
    masterModule.findAll({
        where: {
            id: masterModuleId
        },
        attributes: {
            exclude: ['createdAt','updatedAt']
        }
    }).then((data) => {
        res.send({
            status: 200,
            message: "Master module record Fetched Successfully",
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
    const masterModuleId = req.params.id;
    if (req.body.data) {
        req.body = req.body.data;
    }

    let moduleImageDetails = "";

    if (req.body.image_path != "") {
      moduleImageDetails = req.body.image_path;
      delete req.body["image_path"];
    }

    if (req.body.image_path == "/") {
        delete req.body["image_path"];
    }

    let masterSequenceCountCondition = {
    sequence_id: req.body.sequence_id,
    };

    let masterSequenceandModuleCountCondition = {
    sequence_id: req.body.sequence_id,
    module_name: req.body.module_name,
    };

    masterModule.findAll({
        where: {
            id: masterModuleId
        },
        attributes: {
            exclude: ['createdAt','updatedAt']
        }
    }).then((data) => {

        let masterModuleSequenceId  = data[0].sequence_id;
        let bodyMasterModuleSequenceId = req.body.sequence_id
        
        if(masterModuleSequenceId == bodyMasterModuleSequenceId ){
            console.log("If");
            updateMasterModuleData(masterModuleId,req,res,moduleImageDetails);
        }else{
            console.log("Else ");
            masterModule.count({ where: masterSequenceCountCondition }).then((sequenceCount) => {
                if(sequenceCount > 0){
                   res.send({
                       status: 204,
                       error: true,
                       message: "Master Module already created with this Sequence ID..!",
                   });
                }else{
                   masterModule.count({ where: masterSequenceandModuleCountCondition }).then((moduleSequenceCount) => {
                       if(sequenceCount > 0){
                           res.send({
                               status: 204,
                               error: true,
                               message: "Master Module and Sequence already created..!",
                           });
                       }else{
                        updateMasterModuleData(masterModuleId,req,res,moduleImageDetails);
                    }
                });
             }
          });

        }
    });
};


function updateMasterModuleData(masterModuleId,req,res,moduleImageDetails) {
    // console.log(masterModuleId+" >>> masterModuleId ");
    // console.log("req");
    // console.log(req.body);
    masterModule.update(req.body, {
        where: {
            id: masterModuleId
        },
    }).then(num => {
        if (num == 1) {
        // console.log(req.body);
        // console.log(moduleImageDetails);
        // return;
        if (moduleImageDetails != undefined && moduleImageDetails != "/") {
            const MASTER_FILE_PATH = "./public/uploads/master_modules";
            base64Img.img(
                moduleImageDetails.base64,
                MASTER_FILE_PATH,
                Date.now(),
                function (err, filepath) {
                const pathArr = filepath.split("/");
                const fileName = pathArr[pathArr.length - 1];
                const updatefinalName = filepath.replace(/\\/g, "/").split("/");
                const updatefinalFileName = updatefinalName[3];
                const masterModuleImageData = "/uploads/master_modules/" + updatefinalFileName;
                var options = { where: { id: masterModuleId } };
                masterModule.update(
                    { image_path: masterModuleImageData },
                    options
                ).then((data) => {});
                }
            );
            }
            res.status(200).send({
                status: 200,
                error: false,
                message: "Master module updated Successfully",
            });
        } else {
            res.send({
                message: `Cannot update module with id=${masterModuleId}. Maybe modules was not found or req.body is empty!`
            });
        }
    }).catch(err => {
        console.log(err);
        res.status(500).send({
            message: "Error updating Audit Trail"
        });
    });
}

// Delete a module with the specified id in the request
exports.delete = (req, res) => {
    const masterModuleId = req.params.id;
    masterModule.destroy({
        where: { id: masterModuleId }
    }).then(num => {
        if (num == 1) {
            res.send({
                status: 200,
                error: false,
                message: "Master module Deleted Successfully",
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