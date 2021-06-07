const db = require("../models");
const AuditTrail = db.audit_trails;
const Doctorpreferred = db.doctor_preferred_tbl;

exports.findAll = (req, res) => {
   let whereCondition = null;
   if (req.query.doctor_id) {
      whereCondition = {
         doctor_id: req.query.doctor_id
      };
   }else if(req.query.patient_id){
      whereCondition = {
         patient_id: req.query.patient_id
      };
   }
   Doctorpreferred.findAll({
      where: whereCondition,
      attributes: {
         exclude: ['createdAt', 'updatedAt', 'status']
      },
   }).then((data) => {
      res.status(200).send({
         status: 200,
         error: false,
         message: "Doctor preferred fetched Successfully",
         data: data
      });
   }).catch((err) => {
      res.status(500).send({
         message: "Error retrieving User with id=" + id,
      });
   });
};

// Find a single Doctor preferred with an id
exports.findOne = (req, res) => {
   const id = req.params.id;
   Doctorpreferred.findAll({
      where: { id: id },
      attributes: {
         exclude: ['createdAt', 'updatedAt', 'status']
      }
   }).then((data) => {
      res.status(200).send({
         status: 200,
         error: false,
         message: "Doctor preferred fetched Successfully",
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
      Doctorpreferred.create(req.body).then((data) => {
         const auditTrailVal = {
            'user_id': data.id,
            'trail_type': user_type.charAt(0).toUpperCase() + user_type.slice(1) + ' Doctor preferred Modules',
            'trail_message': req.body.doctor_id + '  ' + req.body.patient_id + ' is Doctor preferred Modules as ' + user_type.charAt(0).toUpperCase() + user_type.slice(1),
            'status': 1
         }
         AuditTrail.create(auditTrailVal, (err, data) => { })
         res.status(200).send({
            status: 200,
            error: false,
            message: "Doctor preferred Created Successfully",
         });
      }).catch((err) => {
         console.log(err)
         res.status(500).send({ error: `${err} while creating Doctor preferred Modules` });
      });
   }
};

// Update a Doctor preferred by the id in the request
exports.update = (req, res) => {
   const id = req.params.id;
   var user_type = "Admin";
   if (!req.body) {
      res.status(400).send({ "message": "Content cannot be empty" })
   }
   Doctorpreferred.update(req.body, {
      where: { id: id },
   }).then((num) => {
      if (num == 1) {
         const auditTrailVal = {
            'user_id': req.params.id,
            'trail_type': user_type.charAt(0).toUpperCase() + user_type.slice(1) + ' Doctor preferred Modules',
            'trail_message': req.body.review + ' ' + req.body.patient_id + ' is Doctor preferred Modules as ' + user_type.charAt(0).toUpperCase() + user_type.slice(1),
            'status': 1
         }
         AuditTrail.create(auditTrailVal, (err, data) => { })
         res.status(200).send({
            status: 200,
            error: false,
            message: "Doctor preferred updated Successfully",
         });
      } else {
         res.send({
            message: `Cannot update Doctor preferred with id=${id}. Maybe Doctor preferred Module was not found or req.body is empty!`,
         });
      }
   }).catch((err) => {
      res.status(500).send({
         message: "Error updating Doctor preferred with id=" + id,
      });
   });
};

// Delete a Doctorrating with the specified id in the request
exports.delete = (req, res) => {
   const id = req.params.id;
   Doctorpreferred.destroy({
      where: { id: id },
   }).then((num) => {
      if (num == 1) {
         res.status(200).send({
            status: 200,
            error: false,
            message: "Doctor preferred deleted Successfully",
         });
      } else {
         res.send({
            message: `Cannot delete Doctor preferred with id=${id}. Maybe Doctor preferred was not found!`,
         });
      }
   }).catch((err) => {
      res.status(500).send({
         message: "Could not delete Doctor preferred with id=" + id,
      });
   });
};


