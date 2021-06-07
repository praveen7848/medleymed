const db = require("../models");
const Sequelize = require('sequelize');
var encryption = require("../helpers/Encryption");

const purpose_consultation = db.purpose_consultation_tbl;
const Category = db.category_tbl;

const Op = Sequelize.Op;
const AuditTrail = db.audit_trails;



exports.getDataDetails = (req, res) => {
 // console.log("asdf ");
    purpose_consultation.findAll({
        order: [
            ['id', 'DESC'],
        ],
        attributes: {exclude: ['createdAt','updatedAt']}
    }).then((data) => {
        res.status(200).send({
            status: 200,
            error: false,
            data:data,
            message: "Purpose of Consultation details fetched Sucessfully "+data.length,
        });
    }).catch((err) => {
      res.status(500).send({
        message: "Error retrieving User with id=" + id,
      });
    });
};




// Find All Purpose of Consultation
exports.getDetails = (req, res) => {

    Category.hasMany(purpose_consultation, { foreignKey: "category_id" });
    purpose_consultation.belongsTo(Category, { foreignKey: "category_id" });

    purpose_consultation.findAll({
        include: [{ model: Category, attributes: ['id', 'category', 'category_type'] }],
        order: [
            ['id', 'ASC'],
        ],
    }).then((data) => {

        data = data.reduce(function (r, a) { r[a.category_tbl.category] = r[a.category_tbl.category] || []; r[a.category_tbl.category].push(a.consultation_name); return r; }, Object.create(null));
        
        res.status(200).send({
            error: false,
            data: data,
        });

    }).catch((err) => {
        res.status(500).send({
            message:
                err.message || "Some error occurred while retrieving Patient List.",
        });
    });
};

// Create a Purpose of Consultation
exports.create = (req, res) => {
    var user_type = "Admin";
    if (!req.body) {
        res.status(400).send({ "message": "Content cannot be empty" })
    }
    else {
        // console.log(req.body);
        const consultationName = {
            category_id: req.body.category_id,
            consultation_name: req.body.consultation_name,
        };

        purpose_consultation.count({
            where:
            {
                'category_id': req.body.category_id,
                'consultation_name': req.body.consultation_name,
            }
        }).then(count => {
            if (count === 0) {
                purpose_consultation.create(consultationName).then((data) => {

                    const auditTrailVal = {
                        'user_id': data.id,
                        'trail_type': user_type.charAt(0).toUpperCase() + user_type.slice(1) + ' Purpose consultation added.',
                        'trail_message': req.body.consultation_name,
                        'status': 1
                    }
                    AuditTrail.create(auditTrailVal, (err, data) => { });

                    res.status(200).send({
                        status: 200,
                        error: false,
                        message: "Purpose of Consultation Added Sucessfully",
                    });
                });
            } else {
                res.status(200).send({
                    status: 204,
                    error: false,
                    message: "Purpose of Consultation already exists !!",
                });
            }
        });
    }
};

// Update a Audit Trail by the id in the request
exports.update = (req, res) => {
    var user_type = "Admin";
    const categoryId = req.body.category_id;
    const consultationName = req.body.consultation_name;
    // console.log("consultationId " + consultationId);
    const purposeVal = {
        category_id: categoryId,
        consultation_name: consultationName,
    };
    purpose_consultation.update(purposeVal, {
        where:
        {
            'id': req.params.id,
        }
    }).then(result => {

        const auditTrailVal = {
            'user_id': req.params.id,
            'trail_type': user_type.charAt(0).toUpperCase() + user_type.slice(1) + 'pre consultation Modules',
            'trail_message': req.body.consultation_name + ' is Purpose Consultation  Modules as ' + user_type.charAt(0).toUpperCase() + user_type.slice(1),
            'status': 1
        }
        AuditTrail.create(auditTrailVal, (err, data) => { });

        res.status(200).send({
            status: 200,
            error: false,
            message: "Purpose of Consultation Updated Sucessfully",
        });
    });
};

// Delete a Consultation with the specified id in the request
exports.delete = (req, res) => {
    const id = req.params.id;
    purpose_consultation.destroy({
        where: { id: id }
    })
        .then(num => {
            if (num == 1) {
                res.status(200).send({
                    status: 200,
                    error: false,
                    message: "Purpose of Consultation Deleted Sucessfully",
                });
            } else {
                res.send({
                    status: 204,
                    error: false,
                    message: `Cannot delete Purpose Consultation with id=${id}. Maybe Purpose Consultation was not found!`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Could not delete Purpose Consultation with id=" + id
            });
        });
};
// Ends here



// Find a single Languages with an by id
exports.findOne = (req, res) => {
    const id = req.params.id;
    purpose_consultation.findAll({
        where: {
            id: id
        },
        attributes: {exclude: ['createdAt','updatedAt']}
    }).then((data) => {
        res.status(200).send({
            status: 200,
            error: false,
            message: "Purpose of Consultation data fetched Sucessfully",
            data: data
        });
    }).catch((err) => {
        res.status(500).send({
            message:
                err.message || "Some error occurred while retrieving Languages.",
        });
    });
};