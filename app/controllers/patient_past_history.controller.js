const Sequelize = require("sequelize");
const db = require("../models");
var base64Img = require("base64-img");
const patient_past_history = db.patient_past_history;
const Patient = db.patient_tbl;
const AuditTrail = db.audit_trails;
const Op = Sequelize.Op;
var encryption = require("../helpers/Encryption");
const multer = require("multer");
var fs = require("fs");

let masterSubModulePagesTbl = db.master_sub_module_pages_tbl;
const masterSubModuleClinicPage = db.master_sub_module_clinic_pages_tbl;

// var fs_extra = require('fs-extra');
// var request_extra = require('request');
// var base64ToImage = require("base64-to-image");

exports.create = (req, res) => {

  const FILE_PATH = "./public/uploads/patient/medicaldocument";
  if (!req.body || !req.body.patient_id) {
    res.status(400).send({ message: "Patient cannot be empty" });
  }
  // appointment_status:0 ,
  let clinicId = req.body.clinic_id;
  patient_past_history
    .count({
      where: {
        patient_id: req.body.patient_id,
        appointment_id: req.body.appointment_id,
      },
    })
    .then((recordcount) => {
      console.log(recordcount);

      if (recordcount > 0) {
        
        let updatehistoryData;
        if(req.body.medicaldoc_pic.length == 0 ){
          updatehistoryData = {
            past_history: req.body.past_history,
            patient_current_medication: req.body.patient_current_medication,
            patient_drug_allergies: req.body.patient_drug_allergies,
            patient_medical_document:[],
            clinic_id:req.body.clinic_id
          };
        }else{
          updatehistoryData = {
            past_history: req.body.past_history,
            patient_current_medication: req.body.patient_current_medication,
            patient_drug_allergies: req.body.patient_drug_allergies,
            clinic_id:req.body.clinic_id
          };
        }
        
        patient_past_history
          .update(updatehistoryData, {
            where: {
              patient_id: req.body.patient_id,
              appointment_id: req.body.appointment_id,
              // 'appointment_status':0
            },
          })
          .then((data) => {
            var updateImageUploadarr = [];
            for (var i = 0; i < req.body.medicaldoc_pic.length; i++) {
              updateObj = {};
              if (
                req.body.medicaldoc_pic[i].base64 != "" &&
                req.body.medicaldoc_pic[i].base64 !== undefined
              ) {
                base64Img.img(
                  req.body.medicaldoc_pic[i].base64,
                  FILE_PATH,
                  Date.now(),
                  function (err, filepath) {

                    const pathArr = filepath.split("/");
                    const fileName = pathArr[pathArr.length - 1];

                    const updatefinalName = filepath.replace(/\\/g, '/').split('/');
                    const updatefinalFileName = updatefinalName[4];

                    const imageData = "/uploads/patient/medicaldocument/" + updatefinalFileName;
                    // console.log(imageData);
                    // updateObj.imageData = imageData;
                    updateImageUploadarr.push(imageData);

                    // console.log(updateImageUploadarr);
                    // return;
                    
                    let update_id = data.id;
                    var options = {
                      where: {
                        patient_id: req.body.patient_id,
                        appointment_id: req.body.appointment_id,
                      },
                    };
                    //console.log("--- updateImageUploadarr  ---", updateImageUploadarr);
                    patient_past_history
                      .update(
                        {
                          patient_medical_document: updateImageUploadarr,
                        },
                        options
                      )
                      .then((data) => {

                        // res.send({
                        //    message: "Past history updated successfully.",
                        //    data: { appointment_id: req.body.appointment_id },
                        //    nextPage: { pageName: "availabledoctors" },
                        //    previousPage: { pageName: "Patientvitals" },
                        //  });

                        let displayText = "Past history updated successfully."
                        let result = {'appointment_id': req.body.appointment_id };
                        this.getPageSequence(res,result,displayText,clinicId);

                      });
                  }
                );
              }
            }

            // res.send({
            //   message: "Past history updated successfully.",
            //   data: { appointment_id: req.body.appointment_id },
            //   nextPage: { pageName: "availabledoctors" },
            //   previousPage: { pageName: "Patientvitals" },
            // });

              let displayText = "Past history updated successfully.";
              let response = {'appointment_id': req.body.appointment_id };
              this.getPageSequence(res,response,displayText,clinicId);


          });
      } else {

        let historyData;
        if(req.body.medicaldoc_pic.length == 0 ){
          historyData = {
            patient_id: req.body.patient_id,
            past_history: req.body.past_history,
            patient_current_medication: req.body.patient_current_medication,
            patient_drug_allergies: req.body.patient_drug_allergies,
            appointment_id: req.body.appointment_id,
            patient_medical_document:[],
            clinic_id:req.body.clinic_id
          };
        }else{
            historyData = {
            patient_id: req.body.patient_id,
            past_history: req.body.past_history,
            patient_current_medication: req.body.patient_current_medication,
            patient_drug_allergies: req.body.patient_drug_allergies,
            appointment_id: req.body.appointment_id,
            clinic_id:req.body.clinic_id
          };
        }


        patient_past_history.create(historyData).then((data) => {
          var imageuploadarr = [];
          for (var i = 0; i < req.body.medicaldoc_pic.length; i++) {
            obj = {};
            if (
              req.body.medicaldoc_pic[i].base64 != "" &&
              req.body.medicaldoc_pic[i].base64 !== undefined
            ) {
              base64Img.img(
                req.body.medicaldoc_pic[i].base64,
                FILE_PATH,
                Date.now(),
                function (err, filepath) {

                  const pathArr = filepath.split("/");
                  const fileName = i+pathArr[pathArr.length - 1];

                  const createfinalName = filepath.replace(/\\/g, '/').split('/');
                  const createfinalFileName = createfinalName[4];

                  // fs.renameSync("./public/uploads/patient/medicaldocument/"+oldfile, "./public/uploads/patient/medicaldocument/"+newfile);
                  var createMedicalImageData = "/uploads/patient/medicaldocument/" + createfinalFileName;

                  // obj.imageData = createMedicalImageData; 
                  imageuploadarr.push(createMedicalImageData);

                  let update_id = data.id;
                  var options = { where: { id: update_id } };
                  //console.log("--- imageuploadarr  ---", imageuploadarr);
                  patient_past_history
                    .update(
                      {
                        patient_medical_document: imageuploadarr,
                      },
                      options
                    )
                    .then((data) => {});
                }
              );
            }
          }


          // res.send({
          //   message: "past history created successfully.",
          //   data: { appointment_id: req.body.appointment_id },
          //   nextPage: { pageName: "availabledoctors" },
          //   previousPage: { pageName: "Patientvitals" },
          // });

            let displayText = "past history created successfully.";
            let result = {'appointment_id': req.body.appointment_id };
            this.getPageSequence(res,result,displayText,clinicId);


        });
        // Create Ends here
      }
    });
};

// appointment_status:0,
exports.findOne = (req, res) => {
  const id = req.params.id;
  const appointment_id = req.params.appointment_id;
  let requestType = req.params.request_type;
  const clinicId = req.params.clinicId;
  patient_past_history
    .findAll({
      where: { patient_id: id, appointment_id: appointment_id },
      attributes: [
        "past_history",
        "appointment_id",
        "patient_current_medication",
        "patient_drug_allergies",
        "patient_medical_document",
      ],
    })
    .then((data) => {

      // res.send({
      //   message: "Patient pasthistory data fetched Sucessfully",
      //   data,
      //   nextPage: { pageName: "availabledoctors" },
      //   previousPage: { pageName: "Patientvitals" },
      // });
      let displayText = "Patient pasthistory data fetched Sucessfully.";
      this.getPageSequence(res,data,displayText,clinicId);

    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message ||
          "Some error occurred while retrieving Patient pasthistory.",
      });
    });
};

exports.fetchmedicinedrugs = (req, res) => {
  var id = req.params.id;
  Patient.findAll({
    where: { id: id },
    attributes: [
      "chornic_diseases_list",
      "related_medication",
      "drug_allergies",
    ],
  })
    .then((data) => {
      res.send({
        message: "Patient Drug & Medicines data fetched Sucessfully",
        data,
      });
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message ||
          "Some error occurred while retrieving Patient Medicine & Drugs.",
      });
    });
};





exports.getPageSequence = (res,data,displayText,clinicId) => {
  // Page Sequence Starts Here 
  let encryptedPageName = "95429McjpSAC0ENhYomL9JGfU1nR+Cd9nxW1ylXMVgQ=";
  let DecryptedPageName = "Patientmedicalhistory";
  
  let pageOrderArray = [];

  //  console.log(encryptedPageName+" <<< encryptedPageName >>> "+DecryptedPageName+" <<<< DecryptedPageName");

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
        // console.log("i Value "+i);
        // obj['id'] = items[i].id,
        // obj['clinic_id']= items[i].clinic_id,
        // obj['master_module_id']= items[i].master_module_id,
        // obj['master_module_sequence_id'] = items[i].master_module_sequence_id,
        // obj['sub_module_id'] = items[i].sub_module_id,
        // obj['sub_module_sequence_id'] = items[i].sub_module_sequence_id,
        // obj['page_module_id'] = items[i].page_module_id,
        // obj['page_module_sequence_id'] = items[i].page_module_sequence_id,
        // obj['status'] = items[i].status,
        obj['page_name'] = items[i].master_sub_module_pages_tbl.page_name,
        obj['web_reference_page_name'] = items[i].master_sub_module_pages_tbl.web_reference_page_name,
        obj['mobile_reference_page_name'] = items[i].master_sub_module_pages_tbl.mobile_reference_page_name,
        // obj['master_sub_module_pages_tbl_id'] = items[i].master_sub_module_pages_tbl.id,
        // obj['master_sub_module_pages_tbl_master_module_id'] = items[i].master_sub_module_pages_tbl.master_module_id,
        // obj['master_sub_module_pages_tbl_sub_module_id'] = items[i].master_sub_module_pages_tbl.sub_module_id,
        // obj['master_sub_module_pages_tbl_sequence_id'] = items[i].master_sub_module_pages_tbl.sequence_id,
        // obj['master_sub_module_pages_tbl_status'] = items[i].master_sub_module_pages_tbl.status,
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
      // console.log("Before For Each");
      arr.forEach(function (arrayItem, index) {
        // console.log(arrayItem.page_name+" >>> arrayItem.page_name ");
        // console.log(DecryptedPageName+" >>> DecryptedPageName ");
        if (arrayItem.page_name === DecryptedPageName ) {
          let sequenceIndex = arrayItem.sequenceIndex;
          let getPreviousSequenceId = sequenceIndex - 1;
          let getNextSequenceId = sequenceIndex + 1;
          // console.log("sequenceIndex " + arrayItem.sequenceIndex);
          // console.log("getPreviousSequenceId " + getPreviousSequenceId);
          // console.log("getNextSequenceId " + getNextSequenceId);
            // if (getPreviousSequenceId) {
            // console.log('Inside getPreviousSequenceId');
            previousPage = arr.filter(function (obj) {
              if (obj.sequenceIndex == getPreviousSequenceId) {
                return obj;
              }
            })[0];
          // }
          // if (getNextSequenceId) {
            // console.log('Inside getNextSequenceId');
            nextPage = arr.filter(function (obj) {
              if (obj.sequenceIndex == getNextSequenceId) {
                return obj;
              }
            })[0];
          // }
          pageOrderArray.push(previousPage); 
          pageOrderArray.push(nextPage); 
          // console.log(previousPage);
          // console.log(nextPage);
        }
      });
      res.status(200).send({
        status: 200,
        error : false,
        message: displayText,
        data : data,
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
        data: [],
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
  
