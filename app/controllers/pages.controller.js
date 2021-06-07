const Sequelize = require('sequelize');
var encryption = require("../helpers/Encryption");
const db = require("../models");
const pages = db.pages_tbl;
const AuditTrail = db.audit_trails;
const Op = Sequelize.Op;

exports.create = (req, res) => {
    if (!req.body) {
        response.status(400).send({ "message": "Content cannot be empty" })
    } else {
        
        const pageValues = {
            "page_name": req.body.page_name,
            "description": req.body.description,
        }
        pages.count({
            where:
            {
                'page_name': encryption.encryptData(req.body.page_name),
            }
        }).then(rows => {
            if (rows === 0) {
                pages.create(pageValues).then((data) => {
                    const auditTrailVal = {
                        'user_id': data.id,
                        'trail_type': 'Admin',
                        'trail_message': "Page was created Successfully",
                        'status': 1
                    }
                    AuditTrail.create(auditTrailVal, (err, data) => { });
                    res.status(200).send({
                        status: 200,
                        error: false,
                        message: "Page Created Successfully",
                    });
                }).catch((err) => {
                    console.log(err)
                    res.status(500).send({ error: `${err} while creating Page` });
                });
            } else {
                res.status(200).send({
                    status: 204,
                    error: false,
                    message: "Page already exists !!",
                });
            }
        })
    }
};

// Retrieve all Patient Appointment from the Patient Appointment list.
exports.findAll = (req, res) => {
    let message = "";
    pages.findAll({
        attributes: {
            exclude: ['createdAt', 'updatedAt']
        }
    }).then((data) => {
        let recordsCount = data.length;
        message = "Pages fetched successfully";
        if(recordsCount == 0){
            message = "No records found";
        }
        res.status(200).send({
            status: 200,
            error: false,
            message: message,
            data: data
        });
    }).catch((err) => {
        res.status(500).send({
            message:
                err.message || "Some error occurred while retrieving Appointments.",
        });
    });
};

// Find a single Patient Appointment with an Name
exports.findOne = (req, res) => {
    const pageId = req.params.id;
    pages.findAll({
        where: {
            id: pageId
        },
        attributes: {
            exclude: ['createdAt','updatedAt']
        }
    }).then((data) => {
        res.send({
            status: 200,
            message: "Page Fetched Successfully",
            error: false,
            data: data,
        });
    }).catch((err) => {
        res.status(500).send({
            message:
                err.message || "Some error occurred while retrieving Pages.",
        });
    });
};

// Update a Patient Appointment by the id in the request
exports.update = (req, res) => {
    const pageId = req.params.id;
    if (req.body.data) {
        req.body = req.body.data;
    }
    pages.update(req.body, {
        where: {
            id: pageId
        },
    }).then(num => {
        if (num == 1) {
            res.status(200).send({
                status: 200,
                error: false,
                message: "Page updated Successfully",
            });
        } else {
            res.send({
                message: `Cannot update Page with id=${id}. Maybe Page was not found or req.body is empty!`
            });
        }
    }).catch(err => {
        res.status(500).send({
            message: "Error updating Audit Trail with id=" + id
        });
    });
};

// Delete a Patient Coupan with the specified id in the request
exports.delete = (req, res) => {
    const pageId = req.params.id;
    pages.destroy({
        where: { id: pageId }
    }).then(num => {
        if (num == 1) {
            res.send({
                status: 200,
                error: false,
                message: "Page Deleted Successfully",
            });
        } else {
            res.send({
                message: `Cannot delete Page with id=${id}. Maybe Page was not found!`
            });
        }
    }).catch(err => {
        res.status(500).send({
            message: "Could not delete Page with id=" + id
        });
    });
};
