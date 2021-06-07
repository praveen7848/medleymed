const Sequelize = require("sequelize");
const db = require("../models");
const masterModule = db.master_modules_tbl;
const masterSubModule = db.master_sub_module_tbl;
const Op = Sequelize.Op;
const AuditTrail = db.audit_trails;
const base64Img = require("base64-img");

// Retrieve all modules
exports.retreiveSequenceId = (req, res) => {
    const masterSubModuleId = req.params.masterModuleId;
    masterSubModule.findAll({
        where: {
            id: masterSubModuleId
        },
        attributes: {
            exclude: ['createdAt','updatedAt']
        },
        order: [
            ['sequence_id', 'ASC'],
            ['sub_module_name', 'ASC'],
        ],
    }).then((data) => {
        res.send({
            status: 200,
            message: "Master Sub module record Fetched Successfully",
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




// Retrieve all sub modules
exports.findAll = (req, res) => {
    masterModule.hasOne(masterSubModule, { foreignKey: "master_module_id" });
    masterSubModule.belongsTo(masterModule, { foreignKey: "master_module_id" });
    masterSubModule
    .findAll({
        // where:
        // {
        //     status: 1,
        // },
        include: [{ model: masterModule, attributes: ["module_name"] }],
        attributes: {
            exclude: ['createdAt','updatedAt']
        },
        order: [
            ['sequence_id', 'ASC'],
          ],
    })
    .then((data) => {
      res.send({
        status: 200,
        error: false,
        message: "Default Master sub modules fetched  successfully!",
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

// Create a Master sub modules
exports.create = (req, res) => {
  var user_type = "Admin";
  if (!req.body) {
    res.status(400).send({ message: "Content cannot be empty" });
  } else if (!req.body.sub_module_name) {
    res.status(400).send({ message: "module Name cannot be empty" });
  } else {

    let masterModuleImageDetails = "";
    if (req.body.image_path != "") {
        masterModuleImageDetails = req.body.image_path;
      delete req.body["image_path"];
    }

    masterSubModule
      .create(req.body)
      .then((data) => {
        const auditTrailVal = {
          user_id: data.id,
          trail_type:
            user_type.charAt(0).toUpperCase() +
            user_type.slice(1) +
            "module Module",
          trail_message:
            req.body.sub_module_name +
            " " +
            req.body.sub_module_name +
            " is module sub modules as " +
            user_type.charAt(0).toUpperCase() +
            user_type.slice(1),
          status: 1,
        };
        AuditTrail.create(auditTrailVal, (err, data) => {});

        if (req.body.image_path != "") {
            const MASTER_FILE_PATH = "./public/uploads/sub_master_modules";
            base64Img.img(
                masterModuleImageDetails.base64,
                MASTER_FILE_PATH,
              Date.now(),
              function (err, filepath) {
                const pathArr = filepath.split("/");
                const fileName = pathArr[pathArr.length - 1];
                const updatefinalName = filepath.replace(/\\/g, "/").split("/");
                const updatefinalFileName = updatefinalName[3];
                const moduleImageData = "/uploads/sub_master_modules/" + updatefinalFileName;
                var options = { where: { id: data.id } };
                masterSubModule.update(
                  { image_path: moduleImageData },
                  options
                ).then((data) => {});
              }
            );
          }

        res.send({
          status: 200,
          error: false,
          message: "Default Master sub modules Created  successfully!",
        });
      })
      .catch((err) => {
        console.log(err);
        res.status(500).send({ error: `${err} while creating Vitals sub modules` });
      });
  }
};
// Ends here

// Find a single module with an Name
exports.findOne = (req, res) => {
    const masterSubModuleId = req.params.id;
    masterSubModule.findAll({
        where: {
            id: masterSubModuleId
        },
        attributes: {
            exclude: ['createdAt','updatedAt']
        }
    }).then((data) => {
        res.send({
            status: 200,
            message: "Master sub module record Fetched Successfully",
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
    const masterSubModuleId = req.params.id;
    if (req.body.data) {
        req.body = req.body.data;
    }

    // console.log(req.body);
    // return;

    let moduleImageDetails = "";
    if (req.body.image_path == "/") {
        delete req.body["image_path"];
    }
    
    if (req.body.image_path != "") {
      moduleImageDetails = req.body.image_path;
      delete req.body["image_path"];
    }

    let masterSequenceCountCondition = {
        sequence_id: req.body.sequence_id,
        };
    
        let masterSequenceandModuleCountCondition = {
        sequence_id: req.body.sequence_id,
        sub_module_name: req.body.sub_module_name,
        };
    
        masterSubModule.findAll({
            where: {
                id: masterSubModuleId
            },
            attributes: {
                exclude: ['createdAt','updatedAt']
            }
        }).then((data) => {
    
            let masterModuleSequenceId  = data[0].sequence_id;
            let bodyMasterModuleSequenceId = req.body.sequence_id
            
            if(masterModuleSequenceId == bodyMasterModuleSequenceId ){
                console.log("If");
                updateMasterSubModuleData(masterSubModuleId,req,res,moduleImageDetails);
            }else{
                console.log("Else ");
                masterSubModule.count({ where: masterSequenceCountCondition }).then((sequenceCount) => {
                    if(sequenceCount > 0){
                       res.send({
                           status: 204,
                           error: true,
                           message: "Master Module already created with this Sequence ID..!",
                       });
                    }else{
                        masterSubModule.count({ where: masterSequenceandModuleCountCondition }).then((moduleSequenceCount) => {
                           if(sequenceCount > 0){
                               res.send({
                                   status: 204,
                                   error: true,
                                   message: "Master Sub Module and Sequence already created..!",
                               });
                           }else{
                            updateMasterSubModuleData(masterSubModuleId,req,res,moduleImageDetails);
                        }
                    });
                 }
              });
    
            }
        });
};


function updateMasterSubModuleData(masterSubModuleId,req,res,moduleImageDetails) {
    // console.log(masterSubModuleId+" >>> masterSubModuleId ");
    // console.log("req");
    // console.log(req.body);
    masterSubModule.update(req.body, {
        where: {
            id: masterSubModuleId
        },
    }).then(num => {
        if (num[0] === 1) {
            console.log(req.body.image_path);
            if (moduleImageDetails != undefined && moduleImageDetails != "/") {
                const MASTER_FILE_PATH = "./public/uploads/sub_master_modules";
                base64Img.img(
                    moduleImageDetails.base64,
                    MASTER_FILE_PATH,
                    Date.now(),
                    function (err, filepath) {
                    const pathArr = filepath.split("/");
                    const fileName = pathArr[pathArr.length - 1];
                    const updatefinalName = filepath.replace(/\\/g, "/").split("/");
                    const updatefinalFileName = updatefinalName[3];
                    const masterModuleImageData = "/uploads/sub_master_modules/" + updatefinalFileName;
                    var options = { where: { id: masterSubModuleId } };
                    masterSubModule.update(
                        { image_path: masterModuleImageData },
                        options
                    ).then((data) => {});
                    }
                );
            }

            res.status(200).send({
                status: 200,
                error: false,
                message: "Master Sub module updated Successfully",
            });
        } else {
            res.send({
                message: `Cannot update module with id=${masterSubModuleId}. Maybe sub modules was not found or req.body is empty!`
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
    const masterSubModuleId = req.params.id;
    masterSubModule.destroy({
        where: { id: masterSubModuleId }
    }).then(num => {
        if (num == 1) {
            res.send({
                status: 200,
                error: false,
                message: "Master Sub module Deleted Successfully",
            });
        } else {
            res.send({
                message: `Cannot delete sub module with id=${id}. Maybe module was not found!`
            });
        }
    }).catch(err => {
        res.status(500).send({
            message: "Could not delete sub module with id=" + id
        });
    });
};