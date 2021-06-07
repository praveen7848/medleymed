const Sequelize = require("sequelize");
const db = require("../models");
const AuditTrail = db.audit_trails;
const HealthosMedicine = db.tbl_healthos_medicine_data;
const ProductMaster = db.products_master_tbl;

const Op = Sequelize.Op;

exports.findOne = (req, res) => {
  const med_name = req.body.med_name;
  // console.log(med_name + " med_name");
  HealthosMedicine.findAll({
    where: {
      // "product_group_name": med_name + "%"
      // product_group_name: {
      //   [Op.like]: med_name + "%",
      // },
      medicinename: {
        [Op.like]: med_name + '%',
        },
    },
    group: ["medicinename"],
    order: [["medicinename", "DESC"]],
   // attributes: ["product_group_name", "Medicineid", "constituents_name", "id"], //object
  })
    .then((data) => {
      res.status(200).send({
        status: 200,
        error: false,
        message: "Drug allergies fetched Sucessfully",
        result: data,
      });
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving Drug Allergies.",
      });
    });
};
