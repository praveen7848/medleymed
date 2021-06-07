const db = require("../models");
const Doctor = db.doctor_registration;
const Patient = db.patient_tbl;
const Assessment = db.assessments;
const AssessmentReview = db.assessments_review;
const AuditTrail = db.audit_trails;
const Op = db.Sequelize.Op;
var encryption = require('../helpers/Encryption');
const { session } = require("passport");

exports.create = (request,response)=>{
    if (!request.body) {
        response.status(400).send({"message":"Content cannot be empty"})
    } else if (!request.body.patient_id || request.body.patient_id == null || request.body.patient_id === undefined) {
        response.status(400).send({"message":"Please select a patient"})
    } else if (!request.body.doctor_id || request.body.doctor_id == null || request.body.doctor_id === undefined) {
        response.status(400).send({"message":"Doctor id not found"})
    } else {
        const assessmentVal = {
            'doctor_id' : request.body.doctor_id,
            'patient_id' : request.body.patient_id,
            'assessment_id' : request.body.assessment_id,
			'status': 'Pending'
        }

	  var id = assessmentVal.assessment_id;
	  Assessment.findByPk(id)
		.then(assessmentData => {
			let assessmentsPreVal = assessmentData.assessments;
			for(let i=0;i<assessmentsPreVal.length;i++) {
				let assessment_answers = assessmentsPreVal[i].assessment_answers;
				assessmentsPreVal[i].attempted = false;
				assessmentsPreVal[i].result_answer = '';
				assessmentsPreVal[i].result_score = 0;
			}
			assessmentVal.assessment_type = assessmentData.assessment_type;
			assessmentVal.assessment_review = assessmentsPreVal;
			  response.status(200).send({
				message: "Your assessments have been sent."
			  });
			let pid = (request.body.patient_id.indexOf(',')) ? request.body.patient_id.split(',') : [ request.body.patient_id ];
			if(pid.length) {
				for(let j=0;j<pid.length;j++) {
					assessmentVal.patient_id = parseInt(pid[j]);
					AssessmentReview.create(assessmentVal, data =>{ 
           if(data){
            const auditTrailVal = {
              'user_id' : session.user_id,
              'trail_type' : "Create Assessment Review",
              'trail_message' : session.user_type.charAt(0).toUpperCase() + session.user_type.slice(1)+ 'has Create Assessment Review  with'+id,
              'status': 1
              }
              AuditTrail.create(auditTrailVal,(err,data)=>{ })    
    
        
           }

          })
				}
			}
		})
		.catch(err => {
		  response.status(500).send({
			message: "Error retrieving Assessment Review with id=" + id
		  });
		});
    }
};

// Retrieve all AssessmentReviews from the AssessmentReviews.
exports.findAll = (req, res) => {

  if(req.query.assessment_type) {
	const assessment_type = encryption.encryptData(req.query.assessment_type);
	var condition = assessment_type ? { assessment_type: { [Op.like]: `%${assessment_type}%` } } : null;
  }

  if(req.query.doctor_id) {
	const doctor_id = req.query.doctor_id;
	var condition = doctor_id ? { doctor_id: { [Op.eq]: `${doctor_id}` } } : null;
  }

  if(req.query.patient_id) {
	const patient_id = req.query.patient_id;
	var condition = patient_id ? { patient_id: { [Op.eq]: `${patient_id}` } } : null;
  }

  Assessment.hasMany(AssessmentReview, {foreignKey: 'assessment_id'});
  AssessmentReview.belongsTo(Assessment, {foreignKey: 'assessment_id'});

  Patient.hasMany(AssessmentReview, {foreignKey: 'patient_id'});
  AssessmentReview.belongsTo(Patient, {foreignKey: 'patient_id'});

  //Doctor.hasMany(AssessmentReview, {foreignKey: 'doctor_id'});
  //AssessmentReview.belongsTo(Doctor, {foreignKey: 'doctor_id'});

  AssessmentReview.findAll({ where: condition, order: [["createdAt", "DESC"]], include: [Assessment] })
    .then(data => {
		for(let i=0;i<data.length;i++) {
			let totalScore = 0;
			let finalScore = 0;
			for(let j=0;j<data[i].assessment_review.length;j++) {
				if(data[i].assessment_review[j].attempted) {
					finalScore += parseInt(data[i].assessment_review[j].result_score);
				}
				let localTotalScore = 0;
				for(let k=0;k<data[i].assessment_review[j].assessment_answers.length;k++) {
					var scoreVal = parseInt(data[i].assessment_review[j].assessment_answers[k].score);
					if(scoreVal > localTotalScore) { localTotalScore = scoreVal; }
				}
				totalScore += localTotalScore;
			}
			data[i].total_score = totalScore;
			data[i].final_score = finalScore;
		}

		if (req.query.sort_type == "" || req.query.sort_type == null || req.query.sort_type == undefined || req.query.sort_type == "By Title A-Z" || req.query.sort_type == "By Assessment Type") {
			data.sort((a, b) => a.assessment_type > b.assessment_type ? 1 : b.assessment_type > a.assessment_type ? -1 : 0 );
		}

		if (req.query.sort_type == "By Patient") {
			data.sort((a, b) => a.patient_tbl.first_name > b.patient_tbl.first_name ? 1 : b.patient_tbl.first_name > a.patient_tbl.first_name ? -1 : 0 );
		}

		if (req.query.sort_type == "By Date Sent") {
			data.sort((a, b) => new Date(a.createdAt) > new Date(b.createdAt) ? 1 : new Date(b.createdAt) > new Date(a.createdAt) ? -1 : 0 );
		}

		if (req.query.sort_type == "By Date Completed") {
			data.sort((a, b) => new Date(a.completed_date) > new Date(b.completed_date) ? 1 : new Date(b.completed_date) > new Date(a.completed_date) ? -1 : 0 );
		}

		res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving assessments."
      });
    });
};

exports.attemptAnswer = (request,response)=>{
    if (!request.body) {
        response.status(400).send({"message":"Content cannot be empty"})
    } else {

		const assessmentVal = {
            'id' : request.body.assessment_review_id,
			'aqid': request.body.aqid,
			'result_answer': request.body.result_answer,
			'result_score': request.body.result_score
        }

		AssessmentReview.findByPk(assessmentVal.id)
		.then(assessmentData => {
			let assessmentsPreVal = assessmentData.assessment_review;
			assessmentsPreVal.find(v => v.aqid == assessmentVal.aqid).attempted = true;
			assessmentsPreVal.find(v => v.aqid == assessmentVal.aqid).result_score = assessmentVal.result_score;
			assessmentsPreVal.find(v => v.aqid == assessmentVal.aqid).result_answer = assessmentVal.result_answer;

			let assessmentAttemptData = {
				'assessment_review': assessmentsPreVal
			};

			  AssessmentReview.update(assessmentAttemptData, {
				where: { id: assessmentVal.id }
			  })
				.then(num => {
				  if (num == 1) {
					response.send({
					  message: "Assessment Review Question was updated successfully."
					});
				  } else {
					response.send({
					  message: `Cannot update AssessmentReview Question with id=${id}. Maybe AssessmentReview Question was not found or req.body is empty!`
					});
				  }
				})
				.catch(err => {
				  response.status(500).send({
					message: "Error updating Assessment Review Question with id=" + id
				  });
				});
		})
		.catch(err => {
		  response.status(500).send({
			message: "Error retrieving Assessment Review with id=" + id
		  });
		});
    }
};

// Retrieve all AssessmentReviews from the AssessmentReviews.
exports.groupDetails = (req, res) => {
  const assessment_type = encryption.encryptData(req.query.assessment_type);
  var condition = assessment_type ? { assessment_type: { [Op.like]: `%${assessment_type}%` } } : null;

  AssessmentReview.findAll({ where: condition, group: ['assessment_type'] })
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving assessments."
      });
    });
};

// Retrieve all AssessmentReview Count
exports.getAssessmentCount = (req, res) => {

  if(req.query.type == 'All') {
	const type = req.query.type;
	var condition = null;
  } else {
	const type = req.query.type;
	var condition = type ? { status: { [Op.eq]: `${type}` } } : null;
  }

  let incVal = {where: condition};

  AssessmentReview.count(incVal)
    .then(function(count) {
	res.send({data: count});
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving "+type
      });
    });
};

// Find a single AssessmentReviews with an id
exports.findOne = (req, res) => {
  const id = req.params.id;

  AssessmentReview.findByPk(id)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message: "Error retrieving Assessment Review with id=" + id
      });
    });
};

// Update a AssessmentReviews by the id in the request
exports.update = (req, res) => {
  const id = req.params.id;

  AssessmentReview.update(req.body, {
    where: { id: id }
  })
    .then(num => {
      if (num == 1) {
        /*const auditTrailVal = {
          'user_id' : session.user_id,
          'trail_type' : "Updated Assessment Review",
          'trail_message' : session.user_type.charAt(0).toUpperCase() + session.user_type.slice(1)+ 'has Updated Assessment Review  with'+id,
          'status': 1
          }
          AuditTrail.create(auditTrailVal,(err,data)=>{ })*/

        res.send({
          message: "Assessment Review was updated successfully."
        });
      } else {
        res.send({
          message: `Cannot update Assessment Review with id=${id}. Maybe AssessmentReviews was not found or req.body is empty!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Error updating Assessment Review with id=" + id
      });
    });
};

// Delete a AssessmentReviews with the specified id in the request
exports.delete = (req, res) => {
  const id = req.params.id;

  AssessmentReview.destroy({
    where: { id: id }
  })
    .then(num => {
      if (num == 1) {
        const auditTrailVal = {
          'user_id' : session.user_id,
          'trail_type' : "Delete Assessment Review",
          'trail_message' : session.user_type.charAt(0).toUpperCase() + session.user_type.slice(1)+ 'has Deleted Assessment Review  with'+id,
          'status': 1
          }
          AuditTrail.create(auditTrailVal,(err,data)=>{ })    

    
        res.send({
          message: "Assessment Review was deleted successfully!"
        });
      } else {
        res.send({
          message: `Cannot delete Assessment Review with id=${id}. Maybe AssessmentReview was not found!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Could not delete AssessmentReview with id=" + id
      });
    });
};

// Delete all AssessmentReviews from the database.
exports.deleteAll = (req, res) => {
  AssessmentReview.destroy({
    where: {},
    truncate: false
  })
    .then(nums => {
      const auditTrailVal = {
        'user_id' : session.user_id,
        'trail_type' : "Delete Assessment Review",
        'trail_message' : session.user_type.charAt(0).toUpperCase() + session.user_type.slice(1)+ 'has Deleted Assessment Review  with'+id,
        'status': 1
        }
        AuditTrail.create(auditTrailVal,(err,data)=>{ })    

  
      res.send({ message: `${nums} Assessment Review were deleted successfully!` });
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while removing all Assessment Review."
      });
    });
};