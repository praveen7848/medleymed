const db = require("../models");
const AuditTrail = db.audit_trails;
const Doctoreducation = db.doctor_education;


// exports.create = (request, response) => {
// Doctorconsultationprice.bulkCreate([
//     { starting_price:"1",end_price:"200"},
//   ]).then(() => {
//     // return Countries.findAll();
//   });
// };
  exports.findAll = (req, res) => {
    Doctoreducation.findAll({})
    .then((data) => {
        res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error retrieving User with id=" + id,
      });
    });
};

// Find a single Doctoreducation with an id
exports.findOne = (req, res) => {
    const id = req.params.id;  
    Doctoreducation.findAll({ where: {id: id} })
      .then((data) => {
        res.send(data);
      })
      .catch((err) => {
        res.status(500).send({
          message:
            err.message || "Some error occurred while retrieving Doctoreducation.",
        });
      });
};

// Create Controller
exports.create = (req,res)=>{
    var user_type = "Admin"
    if(!req.body){
    //if (Object.keys(req.body).length === 0) {
      res.status(400).send({"message":"Content cannot be empty"})
    }
  
     else {
     
       const educationVal = {
        
            "doctor_user_tbl_id":req.body.doctor_user_tbl_id,
            "registration_no":req.body.registration_no,
            "course_name":req.body.course_name,
            "medical_college_name":req.body.medical_college_name,
            "university_name":req.body.university_name,
            "council_id":req.body.council_id,
            "year_of_completion":req.body.year_of_completion,
            "experience":req.body.experience,
            "document":req.body.document
            
        
    }
    Doctoreducation.create(educationVal)
        .then((data) => {
   // console.log(req.body.doctor_user_tbl_id);return;
            
                const auditTrailVal = {
                'user_id' : "1",
                'trail_type' : user_type,
                'trail_message' : 'Creating the Master Doctor education table module:'+user_type.charAt(0).toUpperCase() + user_type.slice(1),//req.body.starting_price+ ' '+ req.body.end_price + ' is Doctorconsultationprice Modules as '+user_type.charAt(0).toUpperCase() + user_type.slice(1),
                'status': 1
              }
          AuditTrail.create(auditTrailVal,(err, data)=>{ })
          res.send(data);
        })
        .catch((err) => {
          console.log(err)
         res.status(500).send({ error: `${err} while creating Doctoreducation Modules` });
        });
      
    }
};

// Update a Doctoreducation by the id in the request
exports.update = (req, res) => {
  const id = req.params.id;
  var user_type = "Admin";
  if (Object.keys(req.body).length === 0) {
    res.status(400).send({"message":"Content cannot be empty"})
  }

  Doctoreducation.update(req.body, {
    where: { id: id },
  })
  .then((num) => {
      if (num == 1) {
        const auditTrailVal = {
          'user_id' : "1",
          'trail_type' : "Updatating Master Doctoreducation  Module:"+user_type,//.charAt(0).toUpperCase() + user_type.slice(1), //user_type.charAt(0).toUpperCase() + user_type.slice(1)+' Doctorexperince Modules',
          'trail_message' : 'Updatating Master Doctoreducation Module:'+user_type,//req.body.medicinename+ ' '+ req.body.manufacturer + ' is Doctorexperince Modules as '+user_type.charAt(0).toUpperCase() + user_type.slice(1),
          'status': 1
        }
    AuditTrail.create(auditTrailVal,(err, data)=>{ })
        res.send({
          message: "Doctor education Module was updated successfully.",
        });
      } else {
        res.send({
          message: `Cannot update Doctor education with id=${id}. Maybe Doctoreducation Module was not found or req.body is empty!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error updating Doctoreducation with id=" + id,
      });
    });
};

// Delete a Doctor education with the specified id in the request
exports.delete = (req, res) => {
  const id = req.params.id;

  Doctoreducation.destroy({
    where: { id: id },
  })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: "Doctoreducation was deleted successfully!",
        });
      } else {
        res.send({
          message: `Cannot delete Doctoreducation with id=${id}. Maybe Doctoreducation was not found!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Could not delete Doctoreducation with id=" + id,
      });
    });
};

// Delete all Doctorconsultationprice from the database.
exports.deleteAll = (req, res) => {
    Doctoreducation.destroy({
    where: {},
    truncate: false,
  })
    .then((nums) => {
      res.send({ message: `${nums} Doctoreducation were deleted successfully!` });
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while removing all Doctoreducation.",
      });
    });
};

  
