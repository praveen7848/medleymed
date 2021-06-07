const db = require("../models");
const Sequelize = require('sequelize');

const AuditTrail = db.audit_trails;
const Doctorrating = db.tbl_doctor_rating;

exports.findAll = (req, res) => {
   let whereCondition = "";
   let avg = 0;
   if (req.query.doctor_id) {
      whereCondition = {
         doctor_id: req.query.doctor_id,
      };
      exclude = "doctor_id";
   } else if (req.query.patient_id) {
      whereCondition = {
         patient_id: req.query.patient_id,
      };
   }
   Doctorrating.findAll({
      where: whereCondition,
      attributes: {
         exclude: ['createdAt', 'updatedAt', 'status']
      },
      // attributes: [[Sequelize.fn('avg', Sequelize.col('rating')),'rating']]
   }).then((data) => {
      if (req.query.doctor_id) {
         var sum = data.reduce((a, b) => +a + +b.rating, 0);
         avg = sum / data.length;
      }
      res.status(200).send({
         status: 200,
         ratingAvg: avg,
         error: false,
         message: "Doctor rating feedback fetched Successfully",
         data: data
      });
   }).catch((err) => {
      res.status(500).send({
         message: "Error retrieving User",
      });
   });
};

// Find a single Doctor rating with an id
exports.findOne = (req, res) => {
   const id = req.params.id;
   Doctorrating.findAll({
      where: { id: id },
      attributes: {
         exclude: ['createdAt', 'updatedAt', 'status']
      }
   }).then((data) => {
      res.status(200).send({
         status: 200,
         error: false,
         message: "Doctor rating feedback fetched Successfully",
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
      Doctorrating.create(req.body).then((data) => {
         const auditTrailVal = {
            'user_id': data.id,
            'trail_type': user_type.charAt(0).toUpperCase() + user_type.slice(1) + ' Doctor rating Modules',
            'trail_message': req.body.review + '  ' + req.body.patient_id + ' is Doctor rating Modules as ' + user_type.charAt(0).toUpperCase() + user_type.slice(1),
            'status': 1
         }
         AuditTrail.create(auditTrailVal, (err, data) => { })
         res.status(200).send({
            status: 200,
            error: false,
            message: "Doctor rating feedback Created Successfully",
         });
      }).catch((err) => {
         console.log(err)
         res.status(500).send({ error: `${err} while creating Doctor rating Modules` });
      });
   }
};

// Update a Doctorrating by the id in the request
exports.update = (req, res) => {
   const id = req.params.id;
   var user_type = "Admin";
   if (!req.body) {
      res.status(400).send({ "message": "Content cannot be empty" })
   }
   Doctorrating.update(req.body, {
      where: { id: id },
   }).then((num) => {
      if (num == 1) {
         const auditTrailVal = {
            'user_id': req.params.id,
            'trail_type': user_type.charAt(0).toUpperCase() + user_type.slice(1) + ' Doctor rating Modules',
            'trail_message': req.body.review + ' ' + req.body.patient_id + ' is Doctor rating Modules as ' + user_type.charAt(0).toUpperCase() + user_type.slice(1),
            'status': 1
         }
         AuditTrail.create(auditTrailVal, (err, data) => { })
         res.status(200).send({
            status: 200,
            error: false,
            message: "Doctor rating feedback updated Successfully",
         });
      } else {
         res.send({
            message: `Cannot update Doctor rating with id=${id}. Maybe Doctorrating Module was not found or req.body is empty!`,
         });
      }
   }).catch((err) => {
      res.status(500).send({
         message: "Error updating Doctor rating with id=" + id,
      });
   });
};

// Delete a Doctorrating with the specified id in the request
exports.delete = (req, res) => {
   const id = req.params.id;
   Doctorrating.destroy({
      where: { id: id },
   }).then((num) => {
      if (num == 1) {
         res.status(200).send({
            status: 200,
            error: false,
            message: "Doctor rating feedback deleted Successfully",
         });
      } else {
         res.send({
            message: `Cannot delete Doctor rating with id=${id}. Maybe Doctor rating was not found!`,
         });
      }
   }).catch((err) => {
      res.status(500).send({
         message: "Could not delete Doctor rating with id=" + id,
      });
   });
};


