const Sequelize = require("sequelize");
const db = require("../../models");
const { NOW } = require("sequelize");
const product_request = db.product_request_tbl;
const HealthosMedicine = db.tbl_healthos_medicine_data;
const ProductMaster = db.products_master_tbl;
const Op = Sequelize.Op;
const AuditTrail = db.audit_trails;
var encryption = require('../../helpers/Encryption');

// Create a Delivery address
exports.create = (req, res) => {
  var user_type = "Admin";
  if (!req.body) {
    res.status(400).send({ message: "Content cannot be empty" });
  } else {
    console.log(req.body);

    // delivery_address
    // .count({ where: countCondition })
    // .then((count) => {
    //   if (count === 0) {

product_request.create(req.body).then((data) => {
      const auditTrailVal = {
        user_id: req.body.patient_id,
        trail_type: "Admin",
        trail_message: "Product Request is created Successfully",
        status: 1,
      };
      //AuditTrail.create(auditTrailVal, (err, data) => {});
      res.status(200).send({
        status: 200,
        error: false,
        message: "Product Request is Created Successfully",
      });
    });

  // }else{
  //   res.status(200).send({
  //     status: 200,
  //     error: true,
  //     message: "Delivery address already added with address type...",
  //   });
  // }
//});
  }
};

// Retrieve all Delivery address
exports.findAll = (req, res) => {
  console.log("---- req.user---", req.user)
  product_request
    .findAll({ attributes:{ exclude:["createdAt", "updatedAt"] } })
    .then((data) => {
      res.status(200).send({
        status: 200,
        error: false,
        message: "Product Request  Fetched Successfully",
        data: data,
      });
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message ||
          "Some error occurred while retrieving Product Request List.",
      });
    });
};


// Find a single Delivery address with an by id
exports.findOne = (req, res) => {
  const id = req.params.id;
  product_request
    .findAll({
      where: {
        id: id,
      },
      attributes: { exclude: ["createdAt", "updatedAt"] },
   
    })
    .then((data) => {
      res.status(200).send({
        status: 200,
        error: false,
        message: "Product Request Fetched Successfully",
        data: data,
      });
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message ||
          "Some error occurred while retrieving Product Request.",
      });
    });
};

// Update a  by the id in the request
exports.updateProductRequest = (req, res) => {
  const id = req.params.id;
  var user_type = "Admin";
  product_request
    .update(req.body, {
      where: { id: id },
    })
    .then((num) => {
      if (num == 1) {
        const auditTrailVal = {
          user_id: id,
          trail_type: "Admin",
          trail_message: "Product Request updated Successfully",
          status: 1,
        };
        //AuditTrail.create(auditTrailVal, (err, data) => {});
        res.status(200).send({
          status: 200,
          error: false,
          message: "Product Request Updated Successfully",
        });
      } else {
        res.send({
          message: `Cannot update Product Request with id=${id}. Maybe Product Request was not found or req.body is empty!`,
        });
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send({
        message: "Error updating Product Request with id=" + id,
      });
    });
};


exports.productReqStatusUpdate = (req, res) => {
  const id = req.params.id;
  var user_type = "Admin";

  product_request
    .update(req.body, {
      where: { id: id },
    })
    .then((num) => {
      if (num == 1) {
        if(req.body.status === 1)
        {
        product_request
        .findAll({
          where: {
            id: id
          },
          attributes: { exclude: ["createdAt", "updatedAt"] },       
        }).then(function(reqdata){
          const medicinedata = {
            medicineid: reqdata[0].medicineid,
            medicinename: reqdata[0].medicine_name,
            size: reqdata[0].medicine_type,         
           // status: 1,
          };

          // const medicinedata = {
          //   'medicineid': reqdata[0].medicineid,
          //   'medicinename': reqdata[0].medicine_name,
          //   'manufacturer': "",
          //   'unit_price': "",
          //   'package_form': "",
          //   'drug_type': reqdata[0].medicine_type,
          //   'product_group_name': "",
          //   'standard_units': "",
          //   'form': "",
          //   'size': "",
          //   'per_unit': "",
          //   'mrp': "",
          //   'schedule-category': "",
          //   'schedule-description': "",
          //   'constituents_name': "",
          //   'constituents-strength': "",
          //   'interactions-food-show_alert': "",
          //   'interactions-food-tag': "",
          //   'interactions-food-color_codes': "",
          //   'interactions-food-description': "",
          //   'interactions-food-label': "",
          //   'interactions-lactation-show_alert': "",
          //   'interactions-lactation-tag': "",
          //   'interactions-lactation-color_code': "",
          //   'interactions-lactation-description': "",
          //   'interactions-lactation-label': "",
          //   'interactions-alcohol-show_alert': "",
          //   'interactions-alcohol-tag': "",
          //   'interactions-alcohol-color_code': "",
          //   'interactions-alcohol-description': "",
          //   'interactions-alcohol-description-label': "",
          //   'interactions-pregnancy-label': "",
          //   'interactions-pregnancy-tag': "",
          //   'interactions-pregnancy-color_code': "",
          //   'interactions-pregnancy-description': "",
          //   'interactions-pregnancy-show_alert': "",
          //   'components': ""
          // }
          ProductMaster.create(medicinedata, (err, data) => {});
        
         product_request.destroy({where: { id: id }});
        })
      }
        // const auditTrailVal = {
        //   user_id: id,
        //   trail_type: "Admin",
        //   trail_message: "Product Request Status updated Successfully",
        //   status: 1,
        // };
        //AuditTrail.create(auditTrailVal, (err, data) => {});
        res.status(200).send({
          status: 200,
          error: false,
          message: "Product Request Status Updated Successfully",
        });
      } else {
        res.send({
          message: `Cannot update Product Request with id=${id}. Maybe Product Request was not found or req.body is empty!`,
        });
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send({
        message: "Error updating Product Request with id=" + id,
      });
    });
};
// Delete a Delivery address with the specified id in the request
exports.delete = (req, res) => {
  const id = req.params.id;
  var user_type = "Admin";
  product_request
    .destroy({
      where: { id: id },
    })
    .then((num) => {
      if (num == 1) {
        const auditTrailVal = {
          user_id: id,
          trail_type: "Admin",
          trail_message: "Product Request Deleted Successfully",
          status: 1,
        };
      //  AuditTrail.create(auditTrailVal, (err, data) => {});
        res.status(200).send({
          status: 200,
          error: false,
          message: "Product Request Deleted Successfully",
        });
      } else {
        res.send({
          message: `Cannot delete Product Request with id=${id}. Maybe Product Request was not found!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Could not delete Product Request with id=" + id,
      });
    });
};
