const Sequelize = require('sequelize');
const db = require("../models");
const AuditTrail = db.audit_trails;
const HealthosMedicine = db.tbl_healthos_medicine_data;
const ProductMaster = db.products_master_tbl;
const Op = Sequelize.Op;


exports.findOne = (req, res) => {
    const med_name = req.body.med_name;
    // console.log(med_name + " med_name");
    ProductMaster.findAll({
        where: {
            // "product_group_name": med_name + "%"
            // product_group_name: {
            //     [Op.like]: med_name + '%',
            // }
            Medicinename: {
                [Op.like]: med_name + '%',
            },
        },
        order: [
            ['Medicinename', 'ASC']
        ],
       // attributes: ['Medicinename', 'Medicineid', 'constituents_name', 'id'], //object
    })
        .then((data) => {
            res.status(200).send({
                status: 200,
                message: "Current Medication fetched Sucessfully",
                result: data,
                error: "false"
            });
        })
        .catch((err) => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while retrieving Current Medication.",
            });
        });
};

