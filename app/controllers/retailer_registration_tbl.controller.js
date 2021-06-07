const Sequelize = require("sequelize");
var encryption = require("../helpers/Encryption");
const db = require("../models");
const Users = db.users_tbl;
const Retailer = db.retailer_registration_tbl;
const AuditTrail = db.audit_trails;
const Op = Sequelize.Op;

// Retailers Creation..
exports.create = (req, res) => {
  // return
  if (!req.body) {
    res.status(400).send({ message: "Content cannot be empty" });
  } else {
    console.log(req.body);
    // return;

    const userVal = {
      mobile_number: req.body.mobile_number,
      email: req.body.email,
      username: req.body.email,
      name: req.body.storename,
      password: req.body.password,
      user_type: "retailer",
      status: 0,
    };
    //  console.log(userVal);
    const checkEmail = encryption.encryptData(req.body.email);
    const checkPhone = encryption.encryptData(req.body.mobile_number);
    Users.count({
      where: {
        [Op.or]: [{ email: checkEmail }, { mobile_number: checkPhone }],
      },
    }).then((count) => {
      if (count > 0) {
        res.status(204).send({
          status: 204,
          error: true,
          message: "Email or Mobile Number already assosiated with us...",
          data: "",
        });
      } else {
        Users.create(userVal).then((data) => {
          const retailerValues = {
            user_id: data.id,
            storename: req.body.storename,
            mobile_number: req.body.mobile_number,
            email: req.body.email,
            password: req.body.password,
            registration_number: req.body.registration_number,
            registration_expirity: req.body.registration_expirity,
            address: req.body.address,
            latitude: req.body.latitude,
            longitude: req.body.longitude,

            bank_name: req.body.bank_name,
            account_number: req.body.account_number,
            account_holder_name: req.body.account_holder_name,
            ifsc_code: req.body.ifsc_code,
            upi_number: req.body.upi_number,
            gst_number: req.body.gst_number,
            pan_number: req.body.pan_number,
            commission: req.body.commission,
          };
          Retailer.create(retailerValues).then((data) => {
            const auditTrailVal = {
              user_id: data.id,
              trail_type: "Admin",
              trail_message: "Retailer was created Successfully",
              status: 1,
            };
            AuditTrail.create(auditTrailVal, (err, data) => {});
            res.status(200).send({
              status: 200,
              error: false,
              message: "Retailer Created Successfully",
            });
          });
        });
      }
    });
  }
};

// Retrieve all Retailer records.
exports.findAll = (req, res) => {
  let message = "";
  Retailer.findAll({
    attributes: {
      exclude: ["createdAt", "updatedAt"],
    },
  })
    .then((data) => {
      let recordsCount = data.length;
      message = "Retailer records fetched successfully";
      if (recordsCount == 0) {
        message = "No records found";
      }
      res.status(200).send({
        status: 200,
        error: false,
        message: message,
        data: data,
      });
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving Retailers.",
      });
    });
};

// Find a single Retailer
exports.findOne = (req, res) => {
  const retailerId = req.params.id;
  var condition = retailerId ? { id: { [Op.eq]: `${retailerId}` } } : null;

  Users.hasOne(Retailer, { foreignKey: "user_id" });
  Retailer.belongsTo(Users, { foreignKey: "user_id" });

  Retailer.findAll({
    where: condition,
    include: [Users],
    attributes: {
      exclude: ["createdAt", "updatedAt", "id"],
    },
  })
    .then((data) => {
      res.send({
        status: 200,
        message: "Retailer record Fetched Successfully",
        error: false,
        data: data,
      });
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving Retailers.",
      });
    });
};

// Update a Retailer on request
exports.update = (req, res) => {
  const retailerId = req.params.id;
  if (req.body.data) {
    req.body = req.body.data;
  }
  Retailer.update(req.body, {
    where: {
      id: retailerId,
    },
  })
    .then((num) => {
      if (num == 1) {
        Retailer.findAll({
          where: {
            id: retailerId,
          },
          attributes: {
            exclude: ["createdAt", "updatedAt", "id"],
          },
        }).then((data) => {
          let parentTableId = data[0].user_id;
          const userVal = {
            mobile_number: req.body.mobile_number,
            email: req.body.email,
            username: req.body.email,
            name: req.body.storename,
          };
          Users.update(userVal, {
            where: {
              id: parentTableId,
            },
          }).then((num) => {
            if (num == 1) {
              res.status(200).send({
                status: 200,
                error: false,
                message: "Retailer updated Successfully",
              });
            }
          });
        });
      } else {
        res.send({
          message: `Cannot update Retailer with id=${id}. Maybe Retailer was not found or req.body is empty!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error updating Audit Trail",
      });
    });
};

// Delete a Retailer
exports.delete = (req, res) => {
  const retailerId = req.params.id;

  Retailer.findAll({
    where: {
      id: retailerId,
    },
    attributes: {
      exclude: ["createdAt", "updatedAt", "id"],
    },
  })
    .then((data) => {
      let parentTableId = data[0].user_id;
      Users.destroy({
        where: {
          id: parentTableId,
        },
      }).then((num) => {
        if (num == 1) {
          Retailer.destroy({
            where: { id: retailerId },
          }).then((num) => {
            if (num == 1) {
              res.send({
                status: 200,
                error: false,
                message: "Retailer Deleted Successfully",
              });
            } else {
              res.send({
                message: `Cannot delete Retailer with id=${id}. Maybe Retailer was not found!`,
              });
            }
          });
        }
      });
    })
    .catch((err) => {
      res.status(500).send({
        message: "Could not delete Retailer with id=" + id,
      });
    });
};

// Tax Update a Retailer on request
exports.taxupdate = (req, res) => {
  const retailerId = req.params.id;
  if (req.body.data) {
    req.body = req.body.data;
  }
  Retailer.update(req.body, {
    where: {
      id: retailerId,
    },
  })
    .then((num) => {
      if (num == 1) {
        Retailer.findOne({
          where: {
            id: retailerId,
          },
          attributes: {
            exclude: ["createdAt", "updatedAt", "id"],
          },
        }).then((data) => {
          res.status(200).send({
            status: 200,
            error: false,
            message: "Retailer Tax updated Successfully",
            data: data,
          });
        });
      } else {
        res.send({
          message: `Cannot update Retailer with id=${id}. Maybe Retailer was not found or req.body is empty!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error updating Audit Trail",
      });
    });
};

// orderDiscountSlabUpdate Update a Retailer on request
exports.orderDiscountSlabUpdate = (req, res) => {
  const retailerId = req.params.id;
  if (req.body.data) {
    req.body = req.body.data;
  }
  Retailer.update(req.body, {
    where: {
      id: retailerId,
    },
  })
    .then((num) => {
      if (num == 1) {
        Retailer.findOne({
          where: {
            id: retailerId,
          },
          attributes: {
            exclude: ["createdAt", "updatedAt", "id"],
          },
        }).then((data) => {
          res.status(200).send({
            status: 200,
            error: false,
            message: "Retailer Tax updated Successfully",
            data: data,
          });
        });
      } else {
        res.send({
          message: `Cannot update Retailer with id=${id}. Maybe Retailer was not found or req.body is empty!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error updating Audit Trail",
      });
    });
};

// setDeliveryChargesUpdate Update a Retailer on request
exports.setDeliveryChargesUpdate = (req, res) => {
  const retailerId = req.params.id;
  if (req.body.data) {
    req.body = req.body.data;
  }
  Retailer.update(req.body, {
    where: {
      id: retailerId,
    },
  })
    .then((num) => {
      if (num == 1) {
        Retailer.findOne({
          where: {
            id: retailerId,
          },
          attributes: {
            exclude: ["createdAt", "updatedAt", "id"],
          },
        }).then((data) => {
          res.status(200).send({
            status: 200,
            error: false,
            message: "Retailer Tax updated Successfully",
            data: data,
          });
        });
      } else {
        res.send({
          message: `Cannot update Retailer with id=${id}. Maybe Retailer was not found or req.body is empty!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error updating Audit Trail",
      });
    });
};

// Update the Delivery Date
exports.SetOrderDeliveryDate = (req, res) => {
  const retailerId = req.params.retailerId;
  if (req.body.data) {
    req.body = req.body.data;
  }
  Retailer.update(req.body, {
    where: {
      id: retailerId,
    },
  })
    .then((num) => {
      if (num == 1) {
        Retailer.findOne({
          where: {
            id: retailerId,
          },
          attributes: {
            exclude: ["createdAt", "updatedAt"],
          },
        }).then((data) => {
          res.status(200).send({
            status: 200,
            error: false,
            message: "Retailer Delivery Days updated Successfully",
            data: data,
          });
        });
      } else {
        res.send({
          message: `Cannot update Retailer Delivery Date with id=${retailerId}. Maybe Retailer was not found or req.body is empty!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error updating Audit Trail",
      });
    });
};
