const Sequelize = require('sequelize');
const db = require("../models");
var Request = require("request");
const Symptoms_tbl = db.symptoms_tbl;
const AuditTrail = db.audit_trails;
const Op = Sequelize.Op;


let masterSubModulePagesTbl = db.master_sub_module_pages_tbl;
const masterSubModuleClinicPage = db.master_sub_module_clinic_pages_tbl;
var encryption = require("../helpers/Encryption");


// Retrieve patient lab test Details
exports.getPatientAppointmentLabTest = (req, res) => {
	let appointmentId = req.params.appointmentid;
	Symptoms_tbl.findAll({
	  where: {
		appointment_id: appointmentId,
	  },
	  attributes: ["id", "patient_lab_tests","patient_id","doctor_id","appointment_id"]
	}).then((data) => {
		message = "";
		res.status(200).send({
		  status: 200,
		  error: false,
		  message: "patient lab Details fetched successfully",
		  data: data,
		});
	  }).catch((err) => {
		res.status(500).send({
		  message:
			err.message || "Some error occurred while retrieving Appointments.",
		});
	  });
  };
  // get lab test Details Ends here
  


 
// Update patient lab tests starts here
exports.updatePatientAppointmentLabTest = (req, res) => {
	const appointmentId = req.params.appointmentid;
	if (req.body.data) {
	  req.body = req.body.data;
	}
	Symptoms_tbl.update(req.body, {
	  where: {
		appointment_id: appointmentId,
	  },
	}).then((num) => {
		if (num == 1) {
		  res.status(200).send({
			status: 200,
			error: false,
			message: "Patient Lab tests updated sucessfully..",
		  });
		} else {
		  res.send({
			message: `Cannot update Labtests with id=${appointmentId}. Maybe Labtests was not found or req.body is empty!`,
		  });
		}
	  }).catch((err) => {
		res.status(500).send({
		  message: "Error updating Audit Trail",
		});
	  });
  };
// Patient lab test details Update Ends
  





// Informedica a Symptoms API
// exports.getInformedicaDetails = (req, res, next) => {

//    var options = {
//       url: 'https://api.infermedica.com/v2/symptoms',
//       headers: {
//          'Content-Type': 'application/json',
//          'App-Id': '',
//          'App-Key': '',
//       },
//    };

//    Request.get(options, (error, response, body) => {
//       if (error) {
//          console.log(error);
//       }
//       res.status(200).send({
//          status: 200,
//          error: false,
//          message: "Informedica Symptoms Fetched Sucessfully ",
//          data: JSON.parse(body)
//       });

//    });
// };


// Create a Symptoms  Name
exports.create = (req, res) => {
   var user_type = "Patient";

   if (Object.keys(req.body).length === 0) {
      res.status(400).send({ "message": "Content cannot be empty" })
   }
   else if (!req.body.patient_id) {
      res.status(400).send({ "message": "Patient cannot be empty" })
   }
   // else if (!req.body.member_id) {
   //     res.status(400).send({ "message": "Member cannot be empty" })
   // }
   else if (!req.body.symptoms) {
      res.status(400).send({ "message": "symptoms cannot be empty" })
   }
   else {

    // console.log(req.body);
    // return;

      // // Create a Symptoms
      const userSymptomVal = {
         patient_id: req.body.patient_id,
         symptoms: req.body.symptoms,
         appointment_id: req.body.appointment_id,
         add_more_symptoms: req.body.add_more_symptoms,
         clinic_id:req.body.clinic_id,
         module_type:req.body.module_type
      };

      let clinicId = req.body.clinic_id;

   // appointment_status: 0 , ,module_type: req.body.module_type, clinic_id: req.body.clinic_id
      Symptoms_tbl.count({ where: { patient_id: req.body.patient_id, appointment_id: req.body.appointment_id } })
         .then((count) => {
            // console.log(count+" Symptoms_tbl ")
            if (count > 0) {
               const updatesymptoms = {
                  symptoms: req.body.symptoms,
                  add_more_symptoms: req.body.add_more_symptoms
               };
               Symptoms_tbl.update(updatesymptoms, {
                  where:
                  {
                     'patient_id': req.body.patient_id,
                     'appointment_id': req.body.appointment_id,
                   // module_type:req.body.module_type
                   // 'appointment_status': 0
                  }
               }).then(result => {
                 
                        // res.status(200).send({
                        //    status: 200,
                        //    message: "Patient Symptoms updated Sucessfully",
                        //    data:{'appointment_id':req.body.appointment_id},
                        //    nextPage: { 'pageName': 'Patientvitals' } 
                        //    ,previousPage: { 'pageName': 'Patientconsultationpurpose' }
                        // }); 
                        
                        let displayText = "Patient Symptoms updated Sucessfully";
                        let data = {'appointment_id': req.body.appointment_id };
                        this.getPageSequence(res,data,displayText,clinicId);

               });
            } else {
               Symptoms_tbl.create(userSymptomVal).then((data) => {

                  let displayText = "Patient Symptoms added Sucessfully";
                  let result = {'appointment_id': data.appointment_id };
                  this.getPageSequence(res,result,displayText,clinicId);

                  // res.status(200).send({
                  //    status: 200,
                  //    message: "Patient Symptoms added Sucessfully",
                  //    data: data.appointment_id,
                  //    data: {'appointment_id':data.appointment_id},
                  //    nextPage: { 'pageName': 'Patientvitals' } 
                  //    ,previousPage: { 'pageName': 'Patientconsultationpurpose' }
                  //    //                     appointment_id: req.body.appointment_id,
                  //    //                        error: false
                  // });

                  // const auditTrailVal = {
                  //     'user_id': req.body.patient_id,
                  //     'trail_type': user_type.charAt(0).toUpperCase() + user_type.slice(1) + ' Symptom added.',
                  //     'trail_message': req.body.problem,
                  //     'status': 1
                  // }
                  // AuditTrail.create(auditTrailVal, (err, data) => { });
               });
            }
         })
   }


};

exports.findOne = (req, res) => {
   const id = req.params.id;
   const appointment_id = req.params.appointment_id;
   const clinic_id = req.params.clinicId;
   // appointment_status:0,
   Symptoms_tbl.findAll({ where: { patient_id: id, appointment_id:appointment_id } })
      .then((data) => {

        //  res.send({ message: "Symptoms data fetched Sucessfully", data, nextPage: { 'pageName': 'Patientvitals' } 
        //  ,previousPage: { 'pageName': 'Patientconsultationpurpose' }});

        let displayText = "Symptoms data fetched Sucessfully.";
        this.getPageSequence(res,data,displayText,clinic_id);

      })
      .catch((err) => {
         res.status(500).send({
            message:
               err.message || "Some error occurred while retrieving VitalInformation.",
         });
      });
}

exports.update = (req, res) => {
   let id = req.params.id;
   if (Object.keys(req.body).length === 0) {
      res.status(400).send({ "message": "Content cannot be empty" })
   }
   Symptoms_tbl.update(req.body, {
      where:
      {
         'patient_id': id,
         'appointment_status': 0
      }
   }).then(result => {
      res.status(200).send({
         status: 200,
         message: "Patient Symptoms updated Sucessfully"
      });
   });

}

// Find a single Patient Symptoms with an by appointment
exports.getDetails = (req, res) => {
   const patientId = req.params.id;
   //   const appointmentId = req.body.appointment_id;
   // const moduleType = req.body.module_type;
   Symptoms_tbl.findAll({
      where: {
         patient_id: id,
         appointment_id: 0,
      },
      attributes: ['patient_id', 'symptoms', 'module_type']
   })
      .then((data) => {
         res.status(200).send({
            status: 200,
            error: false,
            message: "Patient Symptom Details fetched Sucessfully",
            result: data

         });
      })
      .catch((err) => {
         res.status(500).send({
            message:
               err.message || "Some error occurred while retrieving Symptoms.",
         });
      });
};


exports.getPageSequence = (res,data,displayText,clinicId) => {
  // Page Sequence Starts Here 
  let encryptedPageName = "gTv1FczlPKEeJw2e2gcRbA==";
  let DecryptedPageName = "Patientsymptoms";
  
let pageOrderArray = [];
// console.log(encryptedPageName+" <<< encryptedPageName >>> "+DecryptedPageName+" <<<< DecryptedPageName");

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
    console.log("i Value "+i);
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
  console.log("Before For Each");
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
    message: displayText,
    error : false,
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
};
