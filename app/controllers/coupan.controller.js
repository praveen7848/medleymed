const Sequelize = require('sequelize');
var encryption = require("../helpers/Encryption");
const db = require("../models");
const Coupan = db.coupans_tbl;
const AuditTrail = db.audit_trails;
const Op = Sequelize.Op;

exports.create = (req, res) => {
    if (!req.body) {
        response.status(400).send({ "message": "Content cannot be empty" })
    } else {
        // console.log(req.body);
        // return;
        const coupanValues = {
            "coupon_name": req.body.coupon_name,
            "start_date": req.body.start_date,
            "end_date": req.body.end_date,
            "is_percentage": req.body.is_percentage,
            "discount": req.body.discount,
            "is_all": req.body.is_all,
            "customers": req.body.customers
        }
        Coupan.count({
            where:
            {
                'coupon_name': encryption.encryptData(req.body.coupon_name),
            }
        }).then(rows => {
            if (rows === 0) {
                Coupan.create(coupanValues).then((data) => {
                    const auditTrailVal = {
                        'user_id': data.id,
                        'trail_type': 'Admin',
                        'trail_message': "Coupan was created Successfully",
                        'status': 1
                    }
                    AuditTrail.create(auditTrailVal, (err, data) => { });
                    res.status(200).send({
                        status: 200,
                        error: false,
                        message: "Coupan Created Successfully",
                    });
                }).catch((err) => {
                    console.log(err)
                    res.status(500).send({ error: `${err} while creating Coupan` });
                });
            } else {
                res.status(200).send({
                    status: 204,
                    error: false,
                    message: "Coupan already exists !!",
                });
            }
        })
    }
};

// Retrieve all Patient Appointment from the Patient Appointment list.
exports.findAll = (req, res) => {
    let message = "";
    Coupan.findAll({
        attributes: {
            exclude: ['createdAt', 'updatedAt']
        }
    }).then((data) => {
        let recordsCount = data.length;
        message = "Coupans records fetched successfully";
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
    const coupanId = req.params.id;
    Coupan.findAll({
        where: {
            id: coupanId
        },
        attributes: {
            exclude: ['createdAt','updatedAt','id']
        }
    }).then((data) => {
        res.send({
            status: 200,
            message: "Appointments record Fetched Successfully",
            error: false,
            data: data,
        });
    }).catch((err) => {
        res.status(500).send({
            message:
                err.message || "Some error occurred while retrieving Appointments.",
        });
    });
};

// Update a Patient Appointment by the id in the request
exports.update = (req, res) => {
    const coupanId = req.params.id;
    if (req.body.data) {
        req.body = req.body.data;
    }
    Coupan.update(req.body, {
        where: {
            id: coupanId
        },
    }).then(num => {
        if (num == 1) {
            res.status(200).send({
                status: 200,
                error: false,
                message: "Coupan updated Successfully",
            });
        } else {
            res.send({
                message: `Cannot update Coupan with id=${id}. Maybe coupans was not found or req.body is empty!`
            });
        }
    }).catch(err => {
        res.status(500).send({
            message: "Error updating Audit Trail"
        });
    });
};

// Delete a Patient Coupan with the specified id in the request
exports.delete = (req, res) => {
    const coupanId = req.params.id;
    Coupan.destroy({
        where: { id: coupanId }
    }).then(num => {
        if (num == 1) {
            res.send({
                status: 200,
                error: false,
                message: "Coupan Deleted Successfully",
            });
        } else {
            res.send({
                message: `Cannot delete Coupans with id=${id}. Maybe Coupans was not found!`
            });
        }
    }).catch(err => {
        res.status(500).send({
            message: "Could not delete Coupans with id=" + id
        });
    });
};

// Find a single Patient Appointment with an Name
exports.CoupanValid = (req, res) => {
    const coupanId = req.params.id;
    Coupan.findAll({
        where: {
            id: coupanId
        },
        attributes: {
            exclude: ['createdAt','updatedAt','id']
        }
    }).then((data) => {
var date1 = new Date(data[0].start_date);
var date2 = new Date(data[0].end_date);
var cc = new Date();
var x = parseInt((cc - date1) / (1000 * 60 * 60 * 24)); //gives day difference 
var y = parseInt((date2 - cc) / (1000 * 60 * 60 * 24));

var obj={};
if ((x-1 >= 0) && y >= 0) 
  {
   
    obj.coupon_name=data[0].coupon_name;
    obj.is_percentage=data[0].is_percentage;
    obj.discount=data[0].discount;

    console.log(obj)
    msg=obj;
  }

  else{
      
    msg="Coupone is Expair"
  }

  res.send({
            status: 200,
            message: "Appointments record Fetched Successfully",
            error: false,
            data: msg,
        });
    }).catch((err) => {
        res.status(500).send({
            message:
                err.message || "Some error occurred while retrieving Appointments.",
        });
    });
};
