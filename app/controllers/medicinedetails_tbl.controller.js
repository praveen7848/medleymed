const db = require("../models");
const MedicineDetails = db.medicine_details;
const Op = db.Sequelize.Op;

var encryption = require('../helpers/Encryption');

exports.create = (req,res)=>{
    if (!req.body) {
        res.status(200).send({"message":"Content cannot be empty"})
    } else if (!req.body.trail_type) {
        res.status(200).send({"message":"Medicine Details  cannot be empty"})
    } else {
        const MedicineDetailsVal = {
            'user_id' : req.body.user_id,
            'trail_type' : req.body.trail_type,
            'trail_message' : req.body.trail_message,
			      'status': 1
        }

        MedicineDetails.create(MedicineDetailsVal,(err,data)=>{
            if (err) {
				console.log(err);
                res.status(200).send({"error":`${err} while creating Medicine Details Trail`})
            }
        })
		res.status(200).send({
			"message": "Medicine Details  Created Successfully"
		});
    }
};

// Retrieve all Medicine Details from the Medicine Details.
exports.findAll = (req, res) => {
    
    let message = "";
  // console.log(req.body);
  // return;
  MedicineDetails.findAll({
    where: {  },
  })
    .then((data) => {
      let recordsCount = data.length;

      message = "Patient Medicine fetched successfully";
      if (recordsCount == 0) {
        message = "No records found";
      }
      res.status(200).send({
        status: 200,
        error: false,
        message: message,
        data: data,
      });
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving Appointments.",
      });
    });
};

// Find a single Medicine Details with an id
exports.findOne = (req, res) => {
  const id = req.params.id;

  MedicineDetails.findByPk(id)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(200).send({
        message: "Error retrieving Medicine Details  with id=" + id
      });
    });
};

// Update a Medicine Details Trail by the id in the req
exports.update = (req, res) => {
  const id = req.params.id;

  if(req.body.data) {
	  req.body = req.body.data;
  }

  MedicineDetails.update(req.body, {
    where: { id: id }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: "Medicine Details  was updated successfully."
        });
      } else {
        res.send({
          message: `Cannot update Medicine Details  with id=${id}. Maybe Medicine Details  was not found or req.body is empty!`
        });
      }
    })
    .catch(err => {
      res.status(200).send({
        message: "Error updating Medicine Details  with id=" + id
      });
    });
};

// Delete a Medicine Details Trail with the specified id in the req
exports.delete = (req, res) => {
  const id = req.params.id;

  MedicineDetails.destroy({
    where: { id: id }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: "Medicine Details  was deleted successfully!"
        });
      } else {
        res.send({
          message: `Cannot delete Medicine Details  with id=${id}. Maybe Medicine Details  was not found!`
        });
      }
    })
    .catch(err => {
      res.status(200).send({
        message: "Could not delete Medicine Details  with id=" + id
      });
    });
};

// Delete all Medicine Details from the database.
exports.deleteAll = (req, res) => {
    MedicineDetails.destroy({
    where: {},
    truncate: false
  })
    .then(nums => {
      res.send({ message: `${nums} Medicine Details were deleted successfully!` });
    })
    .catch(err => {
      res.status(200).send({
        message:
          err.message || "Some error occurred while removing all Medicine Details."
      });
    });
};


exports.MedicineSearchDetails = (req, res) => {

  console.log("--------------", req.body.searchname)

   // const medicinename = encryption.encryptData(req.params.name);
		var condition = req.body.searchname ? { medicinename: { [Op.like]: `%${req.body.searchname}%` } } : null;
    let message = "";
   console.log(condition);
  // return;
  MedicineDetails.findAll(
    { where: condition, attributes: { exclude: ["createdAt", "updatedAt"] } }
  )
    .then((data) => {
      let recordsCount = data.length;

      message = "Patient Medicine fetched successfully";
      if (recordsCount == 0) {
        message = "No records found";
      }
      res.status(200).send({
        status: 200,
        error: false,
        message: message,
        data: data,
      });
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving Appointments.",
      });
    });
};
