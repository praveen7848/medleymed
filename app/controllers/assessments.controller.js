const db = require("../models");
const Assessment = db.assessments;
const AuditTrail = db.audit_trails;
const Op = db.Sequelize.Op;
var encryption = require('../helpers/Encryption');
const { session } = require("passport");

exports.create = (request,response)=>{
    if (!request.body) {
        response.status(400).send({"message":"Content cannot be empty"})
    } else if (!request.body.assessment_type) {
        response.status(400).send({"message":"Assessment Type cannot be empty"})
    } else {
        const assessmentVal = {
            'assessment_type' : request.body.assessment_type,
            'assessment_category' : request.body.assessment_category,
            'assessments' : request.body.assessments,
            'assessment_score_interpretation' : request.body.assessment_score_interpretation,
            'assessment_response' : request.body.assessment_response,
            'assessment_credits' : request.body.assessment_credits,
            'selection_type' : request.body.selection_type,
			'status': 1
        }

        

              Assessment.create(assessmentVal)
              .then(data => {
                const auditTrailVal = {
                  'user_id' : session.user_id,
                  'trail_type' : "Create assessment",
                  'trail_message' : session.user_type+'has Created assessment with id'+data.id,
                  'status': 1
                }
                AuditTrail.create(auditTrailVal,(err,data)=>{
                    if(err){
                      console.log(err)
                    }else{
                      console.log("created")
                    }
                })
              
          response.status(200).send({
            "message": "Assessment Created Successfully"
          });
  
        })
        .catch(err => {
          res.status(500).send({
            message:
              err.message || "Some error occurred while retrieving assessments."
          });
        });
        
        
       
};
}
// Retrieve all Assessments from the Assessments.
exports.findAll = (req, res) => {
  const assessment_type = encryption.encryptData(req.query.assessment_type);
  var condition = assessment_type ? { assessment_type: { [Op.like]: `%${assessment_type}%` } } : null;

  Assessment.findAll({ where: condition })
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

// Retrieve all Assessments Grouping.
exports.groupDetails = (req, res) => {

  Assessment.findAll({ attributes: { exclude: ['assessments', 'assessment_score_interpretation'] } })
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

// Find a single Assessments with an id
exports.findOne = (req, res) => {
  const id = req.params.id;

  Assessment.findByPk(id)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message: "Error retrieving Assessment with id=" + id
      });
    });
};

// Retrieve all Assessment Count
exports.getAssessmentCount = (req, res) => {

  if(req.query.type == 'All') {
	const type = req.query.type;
	var condition = null;
  }

  let incVal = {where: condition};

  Assessment.count(incVal)
    .then(function(count) {
	res.send({data: count});
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving count"
      });
    });
};

// Update a Assessments by the id in the request
exports.update = (req, res) => {
  const id = req.params.id;

  if(req.body.data) {
	  req.body = req.body.data;
  }

  Assessment.update(req.body, {
    where: { id: id }
  })
    .then(num => {
      if (num == 1) {
        const auditTrailVal = {
          'user_id' : session.user_id,
          'trail_type' : "Update Assessments",
          'trail_message' : session.user_type.charAt(0).toUpperCase() + session.user_type.slice(1)+ 'has Updated Assessments with'+id,
          'status': 1
        }
        AuditTrail.create(auditTrailVal,(err,data)=>{ })
        res.send({
          message: "Assessments was updated successfully."
        });
      } else {
        res.send({
          message: `Cannot update Assessments with id=${id}. Maybe Assessments was not found or req.body is empty!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Error updating Assessments with id=" + id
      });
    });
};

// Delete a Assessments with the specified id in the request
exports.delete = (req, res) => {
  const id = req.params.id;

  Assessment.destroy({
    where: { id: id }
  })
    .then(num => {
      if (num == 1) {
        const auditTrailVal = {
          'user_id' : session.user_id,
          'trail_type' : "Delete Assessment",
          'trail_message' : session.user_type.charAt(0).toUpperCase() + session.user_type.slice(1)+ 'has Deleted Assessments with'+id,
          'status': 1
        }
        AuditTrail.create(auditTrailVal,(err,data)=>{ })
       
        res.send({
          message: "Assessment was deleted successfully!"
        });
      } else {
        res.send({
          message: `Cannot delete Assessment with id=${id}. Maybe Assessment was not found!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Could not delete Assessment with id=" + id
      });
    });
};

// Delete all Assessments from the database.
exports.deleteAll = (req, res) => {
  Assessment.destroy({
    where: {},
    truncate: false
  })
    .then(nums => {
      res.send({ message: `${nums} Assessment were deleted successfully!` });
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while removing all Assessment."
      });
    });
};