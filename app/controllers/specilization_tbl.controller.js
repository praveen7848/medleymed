const db = require("../models");
const Sequelize = require('sequelize');
const Specialazation = db.specialazation;
const Op = Sequelize.Op;

exports.create = (req,response)=>{
    if (!req.body) {
        response.status(400).send({"message":"Content cannot be empty"})
    } else if (!req.body.name) {
        response.status(400).send({"message":"Specialization Type cannot be empty"})
    } else {
        const SpecilizatonsVals = {
            'name' : req.body.name,
            'status': req.body.status
        }

        Specialazation.create(SpecilizatonsVals,(err,data)=>{
            if (err) {
				console.log(err);
                response.status(500).send({"error":`${err} while creating Specialazation`})
            }
        })
		response.status(200).send({
			"message": "Specialazation Created Successfully"
		});
    }
};

// Retrieve all Specialization
exports.findAll = (req, res) => {
    Specialazation.findAll({})
    .then((data) => {
        res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error retrieving User with id=" + id,
      });
    });
};


// Update a Specialization by the id in the request
exports.update = (req, res) => {
  const id = req.params.id;

  Specialazation.update(req.body, {
    where: { id: id },
  })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: "Specialazation updated successfully.",
        });
      } else {
        res.send({
          message: `Cannot update Specialazation with id=${id}. Maybe Specialazation was not found or req.body is empty!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error updating Specialazation with id=" + id,
      });
    });
};
// Delete a Specialization with the specified id in the request
exports.delete = (req, res) => {
  const id = req.params.id;

  Specialazation.destroy({
    where: { id: id },
  })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: "Specialazation was deleted successfully!",
        });
      } else {
        res.send({
          message: `Cannot delete Specialazation with id=${id}. Maybe Specialazation was not found!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Could not delete Specialazation with id=" + id,
      });
    });
};
// Find a single Specialization with an Name
exports.findOne = (req, res) => {
  const id = req.params.id;  
  Specialazation.findAll({ where: {id: id} })
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving Responders.",
      });
    });
};


// delete all records
exports.deleteAll = (req, res) => {
  Specialazation.destroy({
    where: {},
    truncate: false,
  })
    .then((nums) => {
      res.send({ message: `${nums} Speclization were deleted successfully!` });
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while removing all Speclization.",
      });
    });
};

