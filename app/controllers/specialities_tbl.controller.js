const db = require("../models");
const AuditTrail = db.audit_trails;
const speciality = db.specialities_tbl;

exports.findAll = (req, res) => {
    speciality.findAll({
      order: [
         ['id', 'DESC'],
     ],
      attributes: {
         exclude: ['createdAt', 'updatedAt', 'status']
      }
   }).then((data) => {
      res.status(200).send({
         status: 200,
         error: false,
         message: "Doctor speciality fetched Successfully",
         data: data
      });
   }).catch((err) => {
      res.status(500).send({
         message: "Error retrieving User with id=" + id,
      });
   });
};

// Find a single Doctor speciality with an id
exports.findOne = (req, res) => {
   const id = req.params.id;
   speciality.findAll({
      where: { id: id },
      attributes: {
         exclude: ['createdAt', 'updatedAt', 'status']
      }
   }).then((data) => {
      res.status(200).send({
         status: 200,
         error: false,
         message: "Doctor speciality fetched Successfully",
         data: data,
      });
   }).catch((err) => {
      res.status(500).send({
         message:
            err.message || "Some error occurred while retrieving Doctorrating.",
      });
   });
};

// Create Controller
exports.create = (req, res) => {
   var user_type = "Admin";
   if (!req.body) {
      res.status(400).send({ "message": "Content cannot be empty" })
   }
   else {
    speciality.create(req.body).then((data) => {
         const auditTrailVal = {
            'user_id': data.id,
            'trail_type': user_type.charAt(0).toUpperCase() + user_type.slice(1) + ' Doctor speciality Modules',
            'trail_message': req.body.category_id + '  ' + req.body.speciality_name + ' is Doctor speciality Modules as ' + user_type.charAt(0).toUpperCase() + user_type.slice(1),
            'status': 1
         }
         AuditTrail.create(auditTrailVal, (err, data) => { })
         res.status(200).send({
            status: 200,
            error: false,
            message: "Doctor speciality Created Successfully",
         });
      }).catch((err) => {
         console.log(err)
         res.status(500).send({ error: `${err} while creating Doctor speciality Modules` });
      });
   }
};

// Update a Doctor speciality by the id in the request
exports.update = (req, res) => {
   const id = req.params.id;
   var user_type = "Admin";
   if (!req.body) {
      res.status(400).send({ "message": "Content cannot be empty" })
   }
   speciality.update(req.body, {
      where: { id: id },
   }).then((num) => {
      if (num == 1) {
         const auditTrailVal = {
            'user_id': req.params.id,
            'trail_type': user_type.charAt(0).toUpperCase() + user_type.slice(1) + ' Doctor speciality Modules',
            'trail_message': req.body.category_id + ' ' + req.body.speciality_name + ' is Doctor speciality Modules as ' + user_type.charAt(0).toUpperCase() + user_type.slice(1),
            'status': 1
         }
         AuditTrail.create(auditTrailVal, (err, data) => { })
         res.status(200).send({
            status: 200,
            error: false,
            message: "Doctor speciality updated Successfully",
         });
      } else {
         res.send({
            message: `Cannot update Doctor speciality with id=${id}. Maybe Doctor speciality Module was not found or req.body is empty!`,
         });
      }
   }).catch((err) => {
      res.status(500).send({
         message: "Error updating Doctor speciality with id=" + id,
      });
   });
};

// Delete a Doctor speciality with the specified id in the request
exports.delete = (req, res) => {
   const id = req.params.id;
   speciality.destroy({
      where: { id: id },
   }).then((num) => {
      if (num == 1) {
         res.status(200).send({
            status: 200,
            error: false,
            message: "Doctor speciality deleted Successfully",
         });
      } else {
         res.send({
            message: `Cannot delete Doctor speciality with id=${id}. Maybe Doctor speciality was not found!`,
         });
      }
   }).catch((err) => {
      res.status(500).send({
         message: "Could not delete Doctor speciality with id=" + id,
      });
   });
};


