const db = require("../models");
const AuditTrail = db.audit_trails;
const Appointmentcancellationreasons = db.appointment_cancellation_reasons;


// exports.create = (request, response) => {
// Doctorconsultationprice.bulkCreate([
//     { starting_price:"1",end_price:"200"},
//   ]).then(() => {
//     // return Countries.findAll();
//   });
// };
  exports.findAll = (req, res) => {
    Appointmentcancellationreasons.findAll({})
    .then((data) => {
        res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error retrieving User with id=" + id,
      });
    });
};

// Find a single Appointmentcancellationreasons with an id
exports.findOne = (req, res) => {
    const id = req.params.id;  
    Appointmentcancellationreasons.findAll({ where: {id: id} })
      .then((data) => {
        res.send(data);
      })
      .catch((err) => {
        res.status(500).send({
          message:
            err.message || "Some error occurred while retrieving Appointmentcancellationreasons.",
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
       const cancellationVal = {
       "cancellation_reason":req.body.cancellation_reason
       
    }
       
    Appointmentcancellationreasons.create(cancellationVal)
        .then((data) => {
                const auditTrailVal = {
                'user_id' : "1",
                'trail_type' : user_type,
                'trail_message' : 'Creating the Appointmentcancellationreasons module:'+user_type.charAt(0).toUpperCase() + user_type.slice(1),//req.body.starting_price+ ' '+ req.body.end_price + ' is Doctorconsultationprice Modules as '+user_type.charAt(0).toUpperCase() + user_type.slice(1),
                'status': 1
              }
          AuditTrail.create(auditTrailVal,(err, data)=>{ })
          res.send(data);
        })
        .catch((err) => {
          console.log(err)
         res.status(500).send({ error: `${err} while creating Appointmentcancellationreasons Modules` });
        });
      
    }
};

// Update a Labradiologytest by the id in the request
exports.update = (req, res) => {
  const id = req.params.id;
  var user_type = "Admin";
  if (Object.keys(req.body).length === 0) {
    res.status(400).send({"message":"Content cannot be empty"})
  }

  Appointmentcancellationreasons.update(req.body, {
    where: { id: id },
  })
  .then((num) => {
      if (num == 1) {
        const auditTrailVal = {
          'user_id' : "1",
          'trail_type' : "Updatating Appointmentcancellationreasons Module:"+user_type,//.charAt(0).toUpperCase() + user_type.slice(1), //user_type.charAt(0).toUpperCase() + user_type.slice(1)+' Doctorexperince Modules',
          'trail_message' : 'Updatating Appointmentcancellationreasons Module:'+user_type,//req.body.medicinename+ ' '+ req.body.manufacturer + ' is Doctorexperince Modules as '+user_type.charAt(0).toUpperCase() + user_type.slice(1),
          'status': 1
        }
    AuditTrail.create(auditTrailVal,(err, data)=>{ })
        res.send({
          message: "Appointmentcancellationreasons was updated successfully.",
        });
      } else {
        res.send({
          message: `Cannot update Appointmentcancellationreasons with id=${id}. Maybe Lab radiology test Module was not found or req.body is empty!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error updating Appointmentcancellationreasons with id=" + id,
      });
    });
};

// Delete a Lab radiology test with the specified id in the request
exports.delete = (req, res) => {
  const id = req.params.id;

  Appointmentcancellationreasons.destroy({
    where: { id: id },
  })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: "Appointmentcancellationreasons was deleted successfully!",
        });
      } else {
        res.send({
          message: `Cannot delete Appointmentcancellationreasons with id=${id}. Maybe Appointmentcancellationreasons was not found!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Could not delete Appointmentcancellationreasons with id=" + id,
      });
    });
};

// Delete all Labtest prefered from the database.
exports.deleteAll = (req, res) => {
    Appointmentcancellationreasons.destroy({
    where: {},
    truncate: false,
  })
    .then((nums) => {
      res.send({ message: `${nums} Appointmentcancellationreasons were deleted successfully!` });
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while removing all Appointmentcancellationreasons.",
      });
    });
};

  
