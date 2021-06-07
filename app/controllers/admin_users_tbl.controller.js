const db = require("../models");
const AuditTrail = db.audit_trails;
const Labtestprefered = db.labtest_prefered;


// exports.create = (request, response) => {
// Doctorconsultationprice.bulkCreate([
//     { starting_price:"1",end_price:"200"},
//   ]).then(() => {
//     // return Countries.findAll();
//   });
// };
  exports.findAll = (req, res) => {
    Labtestprefered.findAll({})
    .then((data) => {
        res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error retrieving User with id=" + id,
      });
    });
};

// Find a single Labtestprefered with an id
exports.findOne = (req, res) => {
    const id = req.params.id;  
    Labtestprefered.findAll({ where: {id: id} })
      .then((data) => {
        res.send(data);
      })
      .catch((err) => {
        res.status(500).send({
          message:
            err.message || "Some error occurred while retrieving Labtestprefered.",
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
       const labtestVal = {
       "clinic_id":req.body.clinic_id,
        "doctor_id":req.body.doctor_id,
        "lab_test_id":req.body.lab_test_id,
        "lab_test_name":req.body.lab_test_name,
        "group":req.body.group,
        "status":req.body.status
        
    }
       
    Labtestprefered.create(labtestVal)
        .then((data) => {
                const auditTrailVal = {
                'user_id' : "1",
                'trail_type' : user_type,
                'trail_message' : 'Creating the Labtest prefered module:'+user_type.charAt(0).toUpperCase() + user_type.slice(1),//req.body.starting_price+ ' '+ req.body.end_price + ' is Doctorconsultationprice Modules as '+user_type.charAt(0).toUpperCase() + user_type.slice(1),
                'status': 1
              }
          AuditTrail.create(auditTrailVal,(err, data)=>{ })
          res.send(data);
        })
        .catch((err) => {
          console.log(err)
         res.status(500).send({ error: `${err} while creating Labtest prefered Modules` });
        });
      
    }
};

// Update a Favouritedoctor by the id in the request
exports.update = (req, res) => {
  const id = req.params.id;
  var user_type = "Admin";
  if (Object.keys(req.body).length === 0) {
    res.status(400).send({"message":"Content cannot be empty"})
  }

  Labtestprefered.update(req.body, {
    where: { id: id },
  })
  .then((num) => {
      if (num == 1) {
        const auditTrailVal = {
          'user_id' : "1",
          'trail_type' : "Updatating Labtest prefered Module:"+user_type,//.charAt(0).toUpperCase() + user_type.slice(1), //user_type.charAt(0).toUpperCase() + user_type.slice(1)+' Doctorexperince Modules',
          'trail_message' : 'Updatating Labtest prefered Module:'+user_type,//req.body.medicinename+ ' '+ req.body.manufacturer + ' is Doctorexperince Modules as '+user_type.charAt(0).toUpperCase() + user_type.slice(1),
          'status': 1
        }
    AuditTrail.create(auditTrailVal,(err, data)=>{ })
        res.send({
          message: "Labtest prefered Module was updated successfully.",
        });
      } else {
        res.send({
          message: `Cannot update Labtest prefered with id=${id}. Maybe Labtest prefered Module was not found or req.body is empty!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error updating Labtest prefered with id=" + id,
      });
    });
};

// Delete a Labtest prefered with the specified id in the request
exports.delete = (req, res) => {
  const id = req.params.id;

  Labtestprefered.destroy({
    where: { id: id },
  })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: "Labtest prefered was deleted successfully!",
        });
      } else {
        res.send({
          message: `Cannot delete Labtest prefered with id=${id}. Maybe Labtest prefered was not found!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Could not delete Labtest prefered with id=" + id,
      });
    });
};

// Delete all Labtest prefered from the database.
exports.deleteAll = (req, res) => {
    Labtestprefered.destroy({
    where: {},
    truncate: false,
  })
    .then((nums) => {
      res.send({ message: `${nums} Labtest prefered were deleted successfully!` });
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while removing all Labtest prefered.",
      });
    });
};

  
