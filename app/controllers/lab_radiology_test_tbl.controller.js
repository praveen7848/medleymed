const db = require("../models");
const AuditTrail = db.audit_trails;
const Labradiologytest = db.lab_radiology_test;


// exports.create = (request, response) => {
// Doctorconsultationprice.bulkCreate([
//     { starting_price:"1",end_price:"200"},
//   ]).then(() => {
//     // return Countries.findAll();
//   });
// };
  exports.findAll = (req, res) => {
    Labradiologytest.findAll({})
    .then((data) => {
        res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error retrieving User with id=" + id,
      });
    });
};

// Find a single Labradiologytest with an id
exports.findOne = (req, res) => {
    const id = req.params.id;  
    Labradiologytest.findAll({ where: {id: id} })
      .then((data) => {
        res.send(data);
      })
      .catch((err) => {
        res.status(500).send({
          message:
            err.message || "Some error occurred while retrieving Labradiologytest.",
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
       "labtest_name":req.body.labtest_name
       
    }
       
    Labradiologytest.create(labtestVal)
        .then((data) => {
                const auditTrailVal = {
                'user_id' : "1",
                'trail_type' : user_type,
                'trail_message' : 'Creating the Labradiologytest module:'+user_type.charAt(0).toUpperCase() + user_type.slice(1),//req.body.starting_price+ ' '+ req.body.end_price + ' is Doctorconsultationprice Modules as '+user_type.charAt(0).toUpperCase() + user_type.slice(1),
                'status': 1
              }
          AuditTrail.create(auditTrailVal,(err, data)=>{ })
          res.send(data);
        })
        .catch((err) => {
          console.log(err)
         res.status(500).send({ error: `${err} while creating Labradiologytest Modules` });
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

  Labradiologytest.update(req.body, {
    where: { id: id },
  })
  .then((num) => {
      if (num == 1) {
        const auditTrailVal = {
          'user_id' : "1",
          'trail_type' : "Updatating Labradiologytest Module:"+user_type,//.charAt(0).toUpperCase() + user_type.slice(1), //user_type.charAt(0).toUpperCase() + user_type.slice(1)+' Doctorexperince Modules',
          'trail_message' : 'Updatating Labradiologytest Module:'+user_type,//req.body.medicinename+ ' '+ req.body.manufacturer + ' is Doctorexperince Modules as '+user_type.charAt(0).toUpperCase() + user_type.slice(1),
          'status': 1
        }
    AuditTrail.create(auditTrailVal,(err, data)=>{ })
        res.send({
          message: "Labtest Lab radiologytest was updated successfully.",
        });
      } else {
        res.send({
          message: `Cannot updateLab radiology test with id=${id}. Maybe Lab radiology test Module was not found or req.body is empty!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error updating Lab radiology test with id=" + id,
      });
    });
};

// Delete a Lab radiology test with the specified id in the request
exports.delete = (req, res) => {
  const id = req.params.id;

  Labradiologytest.destroy({
    where: { id: id },
  })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: "Lab radiology test was deleted successfully!",
        });
      } else {
        res.send({
          message: `Cannot delete Lab radiology test with id=${id}. Maybe Lab radiology test was not found!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Could not delete Lab radiology test with id=" + id,
      });
    });
};

// Delete all Labtest prefered from the database.
exports.deleteAll = (req, res) => {
    Labradiologytest.destroy({
    where: {},
    truncate: false,
  })
    .then((nums) => {
      res.send({ message: `${nums} Lab radiology test were deleted successfully!` });
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while removing all Lab radiology test.",
      });
    });
};

  
