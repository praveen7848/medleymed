const db = require("../models");
const Category = db.category_tbl;
const CategoryType = db.category_type_tbl;
const AuditTrail = db.audit_trails;
const Op = db.Sequelize.Op;
const { session } = require("passport");

var encryption = require("../helpers/Encryption");

exports.create = (request, response) => {
  // console.log(request.body);
  if (!request.body) {
    response.status(400).send({ message: "Content cannot be empty" });
  } else if (!request.body.category_type) {
    response.status(400).send({ message: "Category Type cannot be empty" });
  } else {
    const categoryTypeVal = {
      category_type: request.body.category_type,
      status: 1,
    };
   
    CategoryType.create(categoryTypeVal, (err, data) => {
      if (err) {
        response.status(500).send({ error: `${err} while creating category` });
      } else {
            const auditTrailVal = {
              'user_id' : session.user_id,
              'trail_type' : "Create Category",
              'trail_message' : session.user_type+'has Created category with id'+data.id,
              'status': 1
            }
             AuditTrail.create(auditTrailVal,(err,data)=>{
                if (err){
                  console.log(err);
                  response.status(500).send({"error":`${err} while creating category`})
              }
            })
        response.send(data);
      }
    });
  }
};

// Retrieve all Category Types from the Category Type.
exports.findAll = (request, response) => {
  const categoryTypeVal = encryption.encryptData(request.query.category_type);
  var condition = categoryTypeVal
    ? { category_type: { [Op.like]: `%${categoryTypeVal}%` } }
    : null;

  CategoryType.findAll({ where: condition })
    .then((data) => {
      data.sort(function (a, b) {
        var textA = a.category_type.toUpperCase();
        var textB = b.category_type.toUpperCase();
        return textA < textB ? -1 : textA > textB ? 1 : 0;
      });
      response.send(data);
    })
    .catch((err) => {
      response.status(500).send({
        message:
          err.message || "Some error occurred while retrieving category types.",
      });
    });
};

// Find a single Doctors with an id
exports.findOne = (req, res) => {
  const id = req.params.categoryId;

  CategoryType.findByPk(id)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error retrieving Category Type with id=" + id,
      });
    });
};

// Update a Category Type
exports.update = (req, res) => {
  const id = req.params.id;

  CategoryType.update(req.body, {
    where: { id: id },
  })
    .then((num) => {
      if (num == 1) {
        const auditTrailVal = {
          'user_id' : session.user_id,
          'trail_type' : "Update Category Type",
          'trail_message' : session.user_type.charAt(0).toUpperCase() + session.user_type.slice(1)+ 'has Updated Category Type with'+id,
          'status': 1
        }
        AuditTrail.create(auditTrailVal,(err,data)=>{ })
        res.send({
          message: "Category Type was updated successfully.",
        });
      } else {
        res.send({
          message: `Cannot update Category with id=${id}. Maybe Category was not found or req.body is empty!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error updating Category Type with id=" + id,
      });
    });
};

// Delete a Category Type with the specified id in the request
exports.delete = (req, res) => {
  const id = req.params.id;

  CategoryType.destroy({
    where: { id: id },
  })
    .then((num) => {
      if (num == 1) {
        const auditTrailVal = {
          'user_id' : session.user_id,
          'trail_type' : "Delete Category Type",
          'trail_message' : session.user_type.charAt(0).toUpperCase() + session.user_type.slice(1)+ 'has Deleted Category Type with'+id,
          'status': 1
        }
        AuditTrail.create(auditTrailVal,(err,data)=>{ })
        res.send({
          message: "Category Type was deleted successfully!",
        });
      } else {
        res.send({
          message: `Cannot delete Category with id=${id}. Maybe Category was not found!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Could not delete Category Type with id=" + id,
      });
    });
};
