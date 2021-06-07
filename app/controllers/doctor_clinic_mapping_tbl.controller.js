const db = require("../models");
const AuditTrail = db.audit_trails;
const doctorclinicmapping = db.doctor_clinic_mapping;


// exports.create = (request, response) => {
// Doctorconsultationprice.bulkCreate([
//     { starting_price:"1",end_price:"200"},
//   ]).then(() => {
//     // return Countries.findAll();
//   });
// };
  exports.findAll = (req, res) => {
    doctorclinicmapping.findAll({})
    .then((data) => {
        res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error retrieving User with id=" + id,
      });
    });
};

// Find a single doctorclinicmapping with an id
exports.findOne = (req, res) => {
    const id = req.params.id;  
    doctorclinicmapping.findAll({ where: {id: id} })
      .then((data) => {
        res.send(data);
      })
      .catch((err) => {
        res.status(500).send({
          message:
            err.message || "Some error occurred while retrieving doctorclinicmapping.",
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
       //  console.log(req.body.start_price);return;
       const mapppingVal = {
       "login_person_id":req.body.login_person_id,
        "doctor_id":req.body.doctor_id,
        "clinic_id":req.body.clinic_id,
        "registartion_no":req.body.registartion_no,
        "status":req.body.status
        
    }
       
    doctorclinicmapping.create(mapppingVal)
        .then((data) => {
                const auditTrailVal = {
                'user_id' : "1",
                'trail_type' : user_type,
                'trail_message' : 'Creating the doctor clinic mapping module:'+user_type.charAt(0).toUpperCase() + user_type.slice(1),//req.body.starting_price+ ' '+ req.body.end_price + ' is Doctorconsultationprice Modules as '+user_type.charAt(0).toUpperCase() + user_type.slice(1),
                'status': 1
              }
          AuditTrail.create(auditTrailVal,(err, data)=>{ })
          res.send(data);
        })
        .catch((err) => {
          console.log(err)
         res.status(500).send({ error: `${err} while creating doctor clinic mapping Modules` });
        });
      
    }
};

// Update a Doctorconsultationprice by the id in the request
exports.update = (req, res) => {
  const id = req.params.id;
  var user_type = "Admin";
  if (Object.keys(req.body).length === 0) {
    res.status(400).send({"message":"Content cannot be empty"})
  }

  doctorclinicmapping.update(req.body, {
    where: { id: id },
  })
  .then((num) => {
      if (num == 1) {
        const auditTrailVal = {
          'user_id' : "1",
          'trail_type' : "Updatating doctor clinic mapping Module:"+user_type,//.charAt(0).toUpperCase() + user_type.slice(1), //user_type.charAt(0).toUpperCase() + user_type.slice(1)+' Doctorexperince Modules',
          'trail_message' : 'Updatating doctor clinic mapping Module:'+user_type,//req.body.medicinename+ ' '+ req.body.manufacturer + ' is Doctorexperince Modules as '+user_type.charAt(0).toUpperCase() + user_type.slice(1),
          'status': 1
        }
    AuditTrail.create(auditTrailVal,(err, data)=>{ })
        res.send({
          message: "doctor clinic mapping Module was updated successfully.",
        });
      } else {
        res.send({
          message: `Cannot update doctor clinic mapping with id=${id}. Maybe doctor clinic mapping Module was not found or req.body is empty!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error updating doctor clinic mapping with id=" + id,
      });
    });
};

// Delete a doctor clinic mapping with the specified id in the request
exports.delete = (req, res) => {
  const id = req.params.id;

  doctorclinicmapping.destroy({
    where: { id: id },
  })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: "doctor clinic mapping was deleted successfully!",
        });
      } else {
        res.send({
          message: `Cannot delete doctor clinic mapping with id=${id}. Maybe doctor clinic mapping was not found!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Could not delete doctor clinic mapping with id=" + id,
      });
    });
};

// Delete all doctor clinic mapping from the database.
exports.deleteAll = (req, res) => {
    doctorclinicmapping.destroy({
    where: {},
    truncate: false,
  })
    .then((nums) => {
      res.send({ message: `${nums} doctor clinic mapping were deleted successfully!` });
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while removing all doctor clinic mapping.",
      });
    });
};

  
