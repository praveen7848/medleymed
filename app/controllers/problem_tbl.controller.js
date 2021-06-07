const Sequelize = require("sequelize");
const db = require("../models");
const problem_tbl = db.problem_tbl;
const AuditTrail = db.audit_trails;
const Op = Sequelize.Op;
var encryption = require("../helpers/Encryption");
const Patient = db.patient_tbl;

let masterSubModulePagesTbl = db.master_sub_module_pages_tbl;
const masterSubModuleClinicPage = db.master_sub_module_clinic_pages_tbl;



function getPageSequence(res,data,displayText,clinicId){

  // Page Sequence Starts Here 
  let encryptedPageName = "dpk74veg1oJeVrWyE73SaA6GveKuD8QwuLPZeulZIrI=";
  let DecryptedPageName = "Patientconsultationpurpose";
  
  let pageOrderArray = [];
  
      masterSubModulePagesTbl.hasMany(masterSubModuleClinicPage, { foreignKey: "page_module_id" });
      masterSubModuleClinicPage.belongsTo(masterSubModulePagesTbl, { foreignKey: "page_module_id" });    
      
      masterSubModulePagesTbl.hasMany(masterSubModuleClinicPage, { foreignKey: "page_module_id" });
      masterSubModuleClinicPage.belongsTo(masterSubModulePagesTbl, { foreignKey: "page_module_id" });    

      masterSubModuleClinicPage
      .findAll({
        where:
        {
            status: 1,
            clinic_id: clinicId,
            master_module_id:1,
        },
        order: [
          ['page_module_sequence_id', 'ASC'],
          ['master_module_sequence_id', 'ASC'],
          ['sub_module_sequence_id', 'ASC'],
          ['page_module_sequence_id', 'ASC'],
        ],
        include: [
            {   model: masterSubModulePagesTbl ,where: { "status": 1 }, attributes: { exclude: ["createdAt", "updatedAt"], } },
          ],  
        attributes: {
            exclude: ['createdAt','updatedAt']
        },
    })
    .then((items) => {
  
      let definedPageSequenceLength = items.length;
      let firstArray = [];
  
        var arr = [];
       
        for (var i=0; i<items.length; i++){
          obj = {};
          obj['page_name'] = items[i].master_sub_module_pages_tbl.page_name,
          obj['web_reference_page_name'] = items[i].master_sub_module_pages_tbl.web_reference_page_name,
          obj['mobile_reference_page_name'] = items[i].master_sub_module_pages_tbl.mobile_reference_page_name,
          obj['sequenceIndex'] = i+1,
          arr.push(obj);
          // console.log(obj);
        }
      
      let prevArray = [];
      let nextArray = [];
      let previousPage = [];
  
      if(arr.length > 0){
  
        let previousPage = "";
        let nextPage = "";
        arr.forEach(function (arrayItem, index) {
          if (arrayItem.page_name === DecryptedPageName ) {
            let sequenceIndex = arrayItem.sequenceIndex;
            let getPreviousSequenceId = sequenceIndex - 1;
            let getNextSequenceId = sequenceIndex + 1;
              // if (getPreviousSequenceId) {
              previousPage = arr.filter(function (obj) {
                if (obj.sequenceIndex == getPreviousSequenceId) {
                  return obj;
                }
              })[0];
            // }
            // if (getNextSequenceId) {
              nextPage = arr.filter(function (obj) {
                if (obj.sequenceIndex == getNextSequenceId) {
                  return obj;
                }
              })[0];
            // }
            pageOrderArray.push(previousPage); 
            pageOrderArray.push(nextPage); 
          }
        });
        res.status(200).send({
          status: 200,
          error: false,
          data : data,
          message: displayText,
       // result: data,
       // resultLength: items.length,
          previouspage:previousPage,
          nextpage: nextPage
        });
      }else{
        res.status(500).send({
          status: 204,
          error : true,
          message: "Page Sequence not found..",
          data : [],
          resultLength: items.length,
          previouspage:"",
          nextpage:""
        });
      }
    }).catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving Vitals List.",
      });
    });
    // Page Sequence Ends here
  }

  



// Patient Health Profile Status Flag
exports.checkProfileStatus = (req, res) => {
  const patientId = req.params.patientTableId;
  Patient.findAll({ where: { id: patientId } })
    .then((data) => {
    
        var relationStatus = data[0].relation;
        var relationPatientId = data[0].relation_patient_id;
        var healthProfileStatus = 0;

        if(relationStatus && relationPatientId ){
            healthProfileStatus = 1;
        }

        // console.log(" relationStatus "+relationStatus);
        // console.log(" relationPatientId "+relationPatientId);
        // return;

        res.status(200).send({
            status: 200,
            message: "Health Profile Status Fetched Sucessfully",
            healthProfileStatus:healthProfileStatus,
            data: data,
          });
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message ||
          "Some error occurred while retrieving VitalInformation.",
      });
    });
};
// Ends here






// exports.create = (req, res) => {
//     if (!req.body) {
//         res.status(400).send({ "message": "Content cannot be empty" })
//     }
//     if (!req.body.patient_id) {
//         res.status(400).send({ "message": "Patient cannot be empty" })
//     }
//     var minm = 10000;
//     var maxm = 99999;
//     let randomnumber =  Math.floor(Math
//     .random() * (maxm - minm + 1)) + minm;

//     const userVal = {
//         patient_id: req.body.patient_id,
//         problem: req.body.problem,
//         appointment_id : randomnumber
//     };

//      var countCondition = {
//         patient_id: req.body.patient_id,
//         appointment_status: {
//             [Op.or]: [0, 1, 2]
//           }
//      };
//      var updateCondition = {
//         patient_id: req.body.patient_id,
//         appointment_id:req.body.appointmentId,
//      };
//      problem_tbl.count({ where: countCondition })
//         .then((count) => {

//            if(count > 0 ) {
//           //   console.log("update")
//              const updateval = {
//                 problem: req.body.problem,
//              }

//              problem_tbl.findOne({where : updateCondition})
//              .then(function(resd){
//                  console.log("-- res ----",resd);
//                         problem_tbl.update(updateval, {           // where:

//                 where : updateCondition,
//             }).then(result => {
//                 problem_tbl.findAll({ where:  {
//                     patient_id: req.body.patient_id,
//                     // 'appointment_status':0
//                      appointment_id:req.body.appointmentId,

//                 }  }).then((data) => {
//                     res.status(200).send({
//                             status: 200,
//                             message: "Patient Problem updated Sucessfully",
//                             data:{'appointment_id':data[0].appointment_id},
//                             nextPage: { 'pageName': 'Patientsymptoms' },
//                             previousPage: { 'pageName': 'patienthealthprofile' }
//                         });
//                      })
//             });
//              });

//            }
//         })

// }

// Create a Problem Name
exports.create = (req, res) => {
  var user_type = "Patient";

  if (!req.body) {
    res.status(400).send({ message: "Content cannot be empty" });
  } else if (!req.body.patient_id) {
    res.status(400).send({ message: "Patient cannot be empty" });
  }
  // else if (!req.body.request_type) {
  //   res.status(400).send({ message: "Request Type cannot be empty" });
  // }
  
  // else if (!req.body.member_id) {
  //     res.status(400).send({ "message": "Member cannot be empty" })
  // }
  // else if (!req.body.problem) {
  //     res.status(400).send({ "message": "Problem cannot be empty" })
  // }
  // else if (!req.body.doctor_id) {
  //     res.status(400).send({ "message": "Problem cannot be empty" })
  // }
  else {
    let clinic_id;
    // if (req.body.module_type === "clinic-app") {
    //     if (!req.body.clinic_id) {
    //         res.status(400).send({ "message": "Clinic Id cannot be empty" })
    //     }
    //     console.log('Clinic Id' + req.body.clinic_id);
    //     clinic_id = req.body.clinic_id;
    // } else {
    //     clinic_id = "";
    // }

    let clinicId = req.body.clinic_id;

    // Create a Problem
    var minm = clinicId+10000;
    var maxm = clinicId+99999;
    let randomnumber = Math.floor(Math.random() * (maxm - minm + 1)) + minm;

    const userVal = {
      patient_id: req.body.patient_id,
      // member_id: req.body.member_id,
      problem: req.body.problem,
      appointment_id: randomnumber,
      // doctor_id: req.body.doctor_id,
      //module_type: req.body.module_type,
       //clinic_id: clinic_id,
       clinic_id:req.body.clinic_id,
       module_type:req.body.module_type,
    };

    var countCondition = {
      patient_id: req.body.patient_id,
      appointment_status: {
        [Op.or]: [0, 1, 2],
      },
    };
    var updateCondition = {
      patient_id: req.body.patient_id,
      appointment_id: req.body.appointmentId,
    };
    // { patient_id: req.body.patient_id,appointment_status:0 }

    problem_tbl
      .count({ where: countCondition })
      .then((count) => {
        if (count > 0 && req.body.appointmentId != null) {
          //   console.log("update")
          const updateval = {
            problem: req.body.problem,
          };

          problem_tbl.findOne({ where: updateCondition }).then(function (data) {
            if (data) {
              problem_tbl
                .update(updateval, {
                  // where:
                  // {
                  //     'patient_id': req.body.patient_id,
                  //     'appointment_status':0
                  // }
                  where: updateCondition,
                })
                .then((result) => {
                  problem_tbl
                    .findAll({
                      where: {
                        patient_id: req.body.patient_id,
                        // 'appointment_status':0
                        appointment_id: req.body.appointmentId,
                      },
                    })
                    .then((data) => {

                      let result =  { appointment_id: data[0].appointment_id };
                      let displayText = "Patient Problem updated Sucessfully";
                      // console.log(res);
                      // console.log(result);
                      // console.log(displayText);
                      // console.log(clinicId);
                      // return;
                      getPageSequence(res,result,displayText,clinicId);

                      // res.status(200).send({
                      //   status: 200,
                      //   message: "Patient Problem updated Sucessfully",
                      //   data: { appointment_id: data[0].appointment_id },
                      //   nextPage: { pageName: "Patientsymptoms" },
                      //   previousPage: { pageName: "patienthealthprofile" },
                      // });

                    });
                });
            } else {
              res
                .status(400)
                .send({ message: "Appointment Id is not valid plz check it." });
            }
          });
        } else {
          problem_tbl.create(userVal).then((data) => {

            let result = { appointment_id: randomnumber };
            let displayText = "Patient Problem added Sucessfully.";
            getPageSequence(res,result,displayText,clinicId);

            // res.status(200).send({
            //   status: 200,
            //   message: "Patient Problem added Sucessfully",
            //   data: { appointment_id: randomnumber },
            //   nextPage: { pageName: "Patientsymptoms" },
            //   previousPage: { pageName: "patienthealthprofile" },
            // });


          });
        }
      })
      .catch((err) => {
        res.status(500).send({
          message:
            err.message ||
            "Some error occurred while retrieving VitalInformation.",
        });
      });
    //return
  }
};

exports.update = (req, res) => {
  const id = req.params.id;
  if (Object.keys(req.body).length === 0) {
    res.status(400).send({ message: "Content cannot be empty" });
  }

  //        let appointment_id = req.body.appointment_id;
  problem_tbl
    .update(req.body, {
      where: {
        pateint_id: id,
        appointment_id: 0,
      },
    })
    .then((result) => {
      res.status(200).send({
        status: 200,
        message: "Patient Problem updated Sucessfully",
      });
    });
};






// Find a single Patient Problem with an by appointment
exports.getProblemDetails = (req, res) => {
  const patientId = req.params.id;
  const appointment_id = req.params.appointment_id;
  // const requestType = req.params.request_type;
  const clinicId = req.params.clinicId;

  //    const appointmentId = req.body.appointment_id;
  //  const moduleType = req.body.module_type;

  problem_tbl
    .findAll({
      where: {
        patient_id: patientId,
        // 'appointment_status':0,
        appointment_id: appointment_id,
      },
      attributes: ["id", "patient_id", "problem", "appointment_id"],
    })
    .then((data) => {

       let displayText = "Patient Problem Details fetched Successfully.";
       getPageSequence(res,data,displayText,clinicId);
   
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving Problem.",
      });
    });
};

// Find a single problem data with an id
exports.findOne = (req, res) => {
  const id = req.params.id;
  problem_tbl
    .findAll({ where: { id: id } })
    .then((data) => {
      res.send({ message: "Probem data  fetched successfully.", data });
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message ||
          "Some error occurred while retrieving VitalInformation.",
      });
    });
};
