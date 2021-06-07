const db = require("../models");
const AuditTrail = db.audit_trails;
const Doctorconsultationprice = db.doctor_consultation_prices;


// exports.create = (request, response) => {
// Doctorconsultationprice.bulkCreate([
//     { starting_price:"1",end_price:"200"},
//   ]).then(() => {
//     // return Countries.findAll();
//   });
// };
  exports.findAll = (req, res) => {
    Doctorconsultationprice.findAll({})
    .then((data) => {
        res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error retrieving User with id=" + id,
      });
    });
};

// Find a single Doctorconsultationprice with an id
exports.findOne = (req, res) => {
    const id = req.params.id;  
    Doctorconsultationprice.findAll({ where: {id: id} })
      .then((data) => {
        res.send(data);
      })
      .catch((err) => {
        res.status(500).send({
          message:
            err.message || "Some error occurred while retrieving Doctorexperince.",
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
       const priceVal = {
        'starting_price' : req.body.starting_price, 
        'end_price' : req.body.end_price
        
    }
       
        Doctorconsultationprice.create(priceVal)
        .then((data) => {
                const auditTrailVal = {
                'user_id' : "1",
                'trail_type' : user_type,
                'trail_message' : 'Creating the Master Price table module:'+user_type.charAt(0).toUpperCase() + user_type.slice(1),//req.body.starting_price+ ' '+ req.body.end_price + ' is Doctorconsultationprice Modules as '+user_type.charAt(0).toUpperCase() + user_type.slice(1),
                'status': 1
              }
          AuditTrail.create(auditTrailVal,(err, data)=>{ })
          res.send(data);
        })
        .catch((err) => {
          console.log(err)
         res.status(500).send({ error: `${err} while creating Doctorexperince Modules` });
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

  Doctorconsultationprice.update(req.body, {
    where: { id: id },
  })
  .then((num) => {
      if (num == 1) {
        const auditTrailVal = {
          'user_id' : "1",
          'trail_type' : "Updatating Master Doctor consultation price Module:"+user_type,//.charAt(0).toUpperCase() + user_type.slice(1), //user_type.charAt(0).toUpperCase() + user_type.slice(1)+' Doctorexperince Modules',
          'trail_message' : 'Updatating Master Doctor consultation price Module:'+user_type,//req.body.medicinename+ ' '+ req.body.manufacturer + ' is Doctorexperince Modules as '+user_type.charAt(0).toUpperCase() + user_type.slice(1),
          'status': 1
        }
    AuditTrail.create(auditTrailVal,(err, data)=>{ })
        res.send({
          message: "Doctorexperince Module was updated successfully.",
        });
      } else {
        res.send({
          message: `Cannot update Doctorexperince with id=${id}. Maybe Doctorexperince Module was not found or req.body is empty!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error updating Doctorexperince with id=" + id,
      });
    });
};

// Delete a Doctorconsultationprice with the specified id in the request
exports.delete = (req, res) => {
  const id = req.params.id;

  Doctorconsultationprices.destroy({
    where: { id: id },
  })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: "Doctorexperince was deleted successfully!",
        });
      } else {
        res.send({
          message: `Cannot delete Doctorexperince with id=${id}. Maybe Doctorexperince was not found!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Could not delete Doctorexperince with id=" + id,
      });
    });
};

// Delete all Doctorconsultationprice from the database.
exports.deleteAll = (req, res) => {
    Doctorconsultationprice.destroy({
    where: {},
    truncate: false,
  })
    .then((nums) => {
      res.send({ message: `${nums} Doctorexperince were deleted successfully!` });
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while removing all Doctorexperince.",
      });
    });
};

  
