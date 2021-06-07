const db = require("../../models");

const cartTbl = db.cart_tbl;
const cartPrescriptionsTbl = db.cart_prescription_tbl;
const favoriteMedicine = db.favorite_medicine_tbl;
const HealthosMedicine = db.tbl_healthos_medicine_data;
const wishlistMedicine = db.wishlist_medicine_tbl;
const ProductMaster = db.products_master_tbl;
const Op = db.Sequelize.Op;
const AuditTrail = db.audit_trails;
var encryption = require("../../helpers/Encryption");
var base64Img = require("base64-img");
var fs = require("fs");
// Delete Cart Prescription Images
exports.deleteCartPrescriptionImage = (req, res) => {
  const FILE_PATH = "./public/uploads/patient/cart_prescriptions";
  if (!req.body || !req.body.image_name) {
    res.status(400).send({ message: "Prescriptions cannot be empty" });
  }
  console.log(req.body);
  var options = {
    where: {
      cart_id: req.body.cart_id,
    },
  };
  cartPrescriptionsTbl
    .findAll({
      where: {
        cart_id: req.body.cart_id,
      },
      attributes: { exclude: ["createdAt", "updatedAt"] },
    })
    .then((resData) => {
      let responseLength = resData.length;
      if (responseLength > 0) {
        // console.log(resData.length+" Data Length ");
        // console.log(resData);
        let medical_document = resData[0].medical_document;
        let removeDocument = req.body.image_name;

        fs.unlink("./public/" + removeDocument, (err) => {
          if (err) {
            console.log("failed to delete local image:" + err);
          } else {
            let finalArray = medical_document.filter(
              (s) => s !== removeDocument
            );
            cartPrescriptionsTbl
              .update(
                {
                  medical_document: finalArray,
                },
                options
              )
              .then((data) => {
                res.status(200).send({
                  status: 200,
                  error: false,
                  message: "selected prescription Deleted Sucessfully..",
                });
              });
          }
        });
        // res.send({ data : resData, result : medical_document, final_array : finalArray });
      }
    });
};
// Ends here

// Update Cart Prescription Image
exports.updateCartPrescriptionImage = (req, res) => {
  const FILE_PATH = "./public/uploads/patient/cart_prescriptions";
  if (!req.body || !req.body.medicaldoc_pic) {
    res.status(400).send({ message: "Prescriptions cannot be empty" });
  }
  console.log(req.body);
  // return;

  let cartId = req.body.cart_id;
  var updateImageUploadarr = [];
  for (var i = 0; i < req.body.medicaldoc_pic.length; i++) {
    updateObj = {};
    if (
      req.body.medicaldoc_pic[i].base64 != "" &&
      req.body.medicaldoc_pic[i].base64 !== undefined
    ) {
      base64Img.img(
        req.body.medicaldoc_pic[i].base64,
        FILE_PATH,
        Date.now(),
        function (err, filepath) {
          const pathArr = filepath.split("/");
          const fileName = pathArr[pathArr.length - 1];

          const updatefinalName = filepath.replace(/\\/g, "/").split("/");
          const updatefinalFileName = updatefinalName[4];

          const imageData =
            "/uploads/patient/cart_prescriptions/" + updatefinalFileName;
          // console.log(imageData);
          // updateObj.imageData = imageData;
          updateImageUploadarr.push(imageData);

          var options = {
            where: {
              cart_id: cartId,
            },
          };
          //console.log("--- updateImageUploadarr  ---", updateImageUploadarr);
          var cartPrescriptionVal = {
            cart_id: cartId,
            patient_id: req.body.patient_id,
            medical_document: updateImageUploadarr,
          };

          cartPrescriptionsTbl.count(options).then((count) => {
            if (count === 0) {
              cartPrescriptionsTbl.create(cartPrescriptionVal).then((data) => {
                res.status(200).send({
                  status: 200,
                  error: false,
                  message: "Prescriptions added to Cart Id.",
                });
              });
            } else {
              cartPrescriptionsTbl
                .update(
                  {
                    medical_document: updateImageUploadarr,
                  },
                  options
                )
                .then((data) => {
                  res.status(200).send({
                    status: 200,
                    error: false,
                    message: "Prescriptions updated to Cart Id.",
                  });
                });
            }
          });
        }
      );
    }
  }
};
// Ends here

// Create New Cart Details
exports.createNew = (req, res) => {
  var user_type = "Admin";
  if (!req.body) {
    res.status(400).send({ message: "Content cannot be empty" });
  } else {
    // console.log("You are good to go");
    var memberCountCondition = {
      patient_id: req.body.patient_id,
      // order_status: 0;
    };
    let cartId = "";
    cartTbl.count({ where: memberCountCondition }).then((count) => {
      if (count === 0) {
        console.log("No patient Rows found");
        var minm = 10000;
        var maxm = 99999;
        cartId = Math.floor(Math.random() * (maxm - minm + 1)) + minm;
        insertCartRecord(cartId, req, res);
      } else {
        cartTbl
          .findAll({
            where: {
              patient_id: req.body.patient_id,
            },
            attributes: { exclude: ["createdAt", "updatedAt", "id"] },
          })
          .then((resData) => {
            let cartId = resData[0].cart_id;
            insertCartRecord(cartId, req, res);
          });
      }
    });
  }
};

function insertCartRecord(cartId, req, res) {
  const cartVal = {
    cart_id: cartId,
    shop_id: req.body.shop_id,
    patient_id: req.body.patient_id,
    medicine_id: req.body.medicine_id,
    quantity: req.body.quantity,
    mrp: req.body.mrp,
  };

  var countCondition = {
    cart_id: cartId,
    patient_id: req.body.patient_id,
    medicine_id: req.body.medicine_id,
  };

  cartTbl
    .count({ where: countCondition })
    .then((count) => {
      if (count === 0) {
        cartTbl.create(cartVal).then((data) => {
          const auditTrailVal = {
            user_id: req.body.patient_id,
            trail_type: "Admin",
            trail_message: "Cart Details created Successfully",
            status: 1,
          };
          AuditTrail.create(auditTrailVal, (err, data) => {});

          let displayMessage = "Cart Details created Successfully..";
          let patient_id = req.body.patient_id;
          let result = [];
          totalAmountCalculation(
            cartId,
            patient_id,
            req,
            res,
            displayMessage,
            result
          );

          //  cartTbl
          //    .findAll({
          //      where: {
          //        cart_id: cartId,
          //      },
          //      attributes: { exclude: ["createdAt", "updatedAt", "id"] },
          //    })
          //    .then((resData) => {
          //      var total_amount = 0;
          //      var total_paid = 0;
          //      resData.forEach((arg) => {
          //        var quantity = 0;
          //        total_amount += arg.quantity * arg.mrp;
          //      });
          //      total_paid = total_amount;
          //      res.status(200).send({
          //        status: 200,
          //        error: false,
          //        message: "Cart Details Created Successfully",
          //        cart_id: cartId,
          //        total_mrp: total_amount,
          //        total_paid: total_paid,
          //        cart_items: resData.length,
          //      });
          //    });
        });
      } else {

        console.log("Iam Cart Else");

        // res.status(200).send({
        //   status: 200,
        //   error: false,
        //   message: "Medicine Already added to cart",
        //   cart_id: cartId,
        // });

        cartTbl
            .findAll({
              where: countCondition,
            })
            .then((data) => {
              let quantity = data[0].quantity;
              let reqQuantity = req.body.quantity;
              let quantitySum = parseInt(quantity) + parseInt(reqQuantity);
              let updateId = data[0].id;

              if (quantitySum < 50) {
                const updateData = {
                  patient_id: req.body.patient_id,
                  medicine_id: req.body.medicine_id,
                  mrp: req.body.mrp,
                  quantity: quantitySum,
                };
                cartTbl
                  .update(updateData, {
                    where: { id: updateId },
                  })
                  .then((num) => {
                    if (num == 1) {
                      const auditTrailVal = {
                        user_id: req.body.patient_id,
                        trail_type: "Admin",
                        trail_message: "Cart Updated Successfully",
                        status: 1,
                      };
                      AuditTrail.create(auditTrailVal, (err, data) => {});
                      // res.status(200).send({
                      //   status: 200,
                      //   error: false,
                      //   message: "Cart Updated Successfully",
                      // });

                      let displayMessage = "Cart Details Updated Successfully..";
                      let patient_id = req.body.patient_id;
                      let result = [];
                      totalAmountCalculation(
                        cartId,
                        patient_id,
                        req,
                        res,
                        displayMessage,
                        result
                      );
                    }
                  });
              } else {
                res.status(200).send({
                  status: 200,
                  error: false,
                  message: "Medicine Quantity exceed limit..",
                  currentQuantity: quantity,
                });
              }
            });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message ||
          "Some error occurred while retrieving VitalInformation.",
      });
    });
}
// Ends here

// Create a Cart Details
exports.createOld = (req, res) => {
  var user_type = "Admin";
  if (!req.body) {
    res.status(400).send({ message: "Content cannot be empty" });
  } else {
    let randomnumber = "";
    if (req.body.cart_id === "") {
      console.log("Cart Id Empty ");
      var minm = 10000;
      var maxm = 99999;
      randomnumber = Math.floor(Math.random() * (maxm - minm + 1)) + minm;
    } else {
      randomnumber = req.body.cart_id;
    }

    var countCondition = {
      patient_id: req.body.patient_id,
      medicine_id: req.body.medicine_id,
    };
    const cartVal = {
      cart_id: randomnumber,
      shop_id: req.body.shop_id,
      patient_id: req.body.patient_id,
      medicine_id: req.body.medicine_id,
      quantity: req.body.quantity,
      mrp: req.body.mrp,
    };

    cartTbl
      .count({ where: countCondition })
      .then((count) => {
        if (count === 0) {
          cartTbl.create(cartVal).then((data) => {
            const auditTrailVal = {
              user_id: req.body.patient_id,
              trail_type: "Admin",
              trail_message: "Cart Details created Successfully",
              status: 1,
            };
            AuditTrail.create(auditTrailVal, (err, data) => {});

            // let displayMessage = "Cart Details created Successfully..";
            // let patient_id = req.body.patient_id;
            // let result = [];
            // totalAmountCalculation(randomnumber,patient_id,req,res,displayMessage,result);

            cartTbl
              .findAll({
                where: {
                  cart_id: randomnumber,
                },
                attributes: { exclude: ["createdAt", "updatedAt", "id"] },
              })
              .then((resData) => {
                var total_amount = 0;
                var total_paid = 0;
                resData.forEach((arg) => {
                  var quantity = 0;
                  total_amount += arg.quantity * arg.mrp;
                });
                total_paid = total_amount;
                res.status(200).send({
                  status: 200,
                  error: false,
                  message: "Cart Details Created Successfully",
                  cart_id: randomnumber,
                  total_mrp: total_amount,
                  total_paid: total_paid,
                  cart_items: resData.length,
                });
              });
          });
        } else {
          res.status(200).send({
            status: 200,
            error: false,
            message: "Medicine Already added to cart",
            cart_id: randomnumber,
          });
        }
      })
      .catch((err) => {
        res.status(500).send({
          message:
            err.message ||
            "Some error occurred while retrieving VitalInformation.",
        });
      });
  }
};

// Update a  Cart by the id in the request
exports.updateCartDetails = (req, res) => {
  const id = req.params.id;
  var user_type = "Admin";
  cartTbl
    .update(req.body, {
      where: { id: id },
    })
    .then((num) => {
      if (num == 1) {
        const auditTrailVal = {
          user_id: id,
          trail_type: "Admin",
          trail_message: "Cart Details updated Successfully",
          status: 1,
        };
        AuditTrail.create(auditTrailVal, (err, data) => {});

        let displayMessage = "Cart Details updated Successfully..";
        let patient_id = req.body.patient_id;
        let cartId = req.body.cart_id;
        let result = [];
        totalAmountCalculation(
          cartId,
          patient_id,
          req,
          res,
          displayMessage,
          result
        );
      } else {
        res.send({
          message: `Cannot update Cart with id=${id}. Maybe Cart was not found or req.body is empty!`,
        });
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send({
        message: "Error updating Cart with id=" + id,
      });
    });
};

// find all Cart Details Bt Cart Id
exports.findAllCartDetails = (req, res) => {
  let cartId = req.params.cartId;

  ProductMaster.hasMany(cartTbl, { foreignKey: "medicine_id" });
  cartTbl.belongsTo(ProductMaster, { foreignKey: "medicine_id" });

  cartTbl.hasOne(cartPrescriptionsTbl, { foreignKey: "cart_id" });
  cartPrescriptionsTbl.belongsTo(cartTbl, { foreignKey: "cart_id" });

  cartTbl
    .findAll({
      where: {
        cart_id: cartId,
      },
      attributes: { exclude: ["createdAt", "updatedAt"] },
      include: [
        {
          model: ProductMaster,
          required: false,
          // attributes: [
          //   "form",
          //   "Medicinename",
          //   "Medicineid",
          //   "constituents_name",
          //   "manufacturer",
          //   "unit_price",
          //   "drug_type",
          //   "mrp",
          //   "id",
          // ],
        },
        {
          model: cartPrescriptionsTbl,
          required: false,
          attributes: { exclude: ["createdAt", "updatedAt"] },
        },
      ],
    })
    .then((data) => {
      let cartCount = data.length;
      const auditTrailVal = {
        user_id: cartId,
        trail_type: "Admin",
        trail_message: "Cart Details fetched Successfully",
        status: 1,
      };
      AuditTrail.create(auditTrailVal, (err, data) => {});
      res.status(200).send({
        status: 200,
        error: false,
        message: "Cart Details fetched Successfully",
        cart_count: cartCount,
        data: data,
      });
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message ||
          "Some error occurred while retrieving Cart Details List.",
      });
    });
};

// calculation for MRP and Paid
function totalAmountCalculation(
  cartId,
  patient_id,
  req,
  res,
  displayMessage,
  result
) {
  cartTbl
    .findAll({
      where: {
        patient_id: patient_id,
      },
      attributes: { exclude: ["createdAt", "updatedAt", "id"] },
    })
    .then((resData) => {
      var total_amount = 0;
      var total_paid = 0;
      var shipping_amount = 0;
      resData.forEach((arg) => {
        var quantity = 0;
        total_amount += arg.quantity * arg.mrp;
      });
      total_paid = total_amount;
      res.status(200).send({
        status: 200,
        error: false,
        message: displayMessage,
        cart_id: cartId,
        total_mrp: total_amount,
        total_paid: total_paid,
        cart_items: resData.length,
        shipping_charges: shipping_amount,
        data: result,
      });
    });
}
// Ends here

// find all Cart Details Bt Cart PatientId
exports.findAllPatientCartDetails = (req, res) => {
  let patientId = req.params.patientId;
  // console.log(patientId+" >> patientId"); return;
  ProductMaster.hasMany(cartTbl, { foreignKey: "medicine_id" });
  cartTbl.belongsTo(ProductMaster, { foreignKey: "medicine_id" });

  cartTbl.hasOne(cartPrescriptionsTbl, { foreignKey: "cart_id" });
  cartPrescriptionsTbl.belongsTo(cartTbl, { foreignKey: "cart_id" });

  cartTbl
    .findAll({
      where: {
        patient_id: patientId,
      },
      attributes: { exclude: ["createdAt", "updatedAt"] },
      include: [
        {
          model: ProductMaster,
          required: false,
          // attributes: [
          //   "form",
          //   "Medicinename",
          //   "Medicineid",
          //   "constituents_name",
          //   "manufacturer",
          //   "unit_price",
          //   "drug_type",
          //   "mrp",
          //   "id",
          // ],
        },
        {
          model: cartPrescriptionsTbl,
          required: false,
          attributes: { exclude: ["createdAt", "updatedAt"] },
        },
      ],
    })
    .then((data) => {
      let cartCount = data.length;
      const auditTrailVal = {
        user_id: patientId,
        trail_type: "Admin",
        trail_message: "Cart Details fetched Successfully",
        status: 1,
      };
      AuditTrail.create(auditTrailVal, (err, data) => {});
      let displayMessage = "Cart Details fetched Successfully..";
      // let patient_id = req.params.patientId;
      let cartdetailsId = "";
      let result = data;
      if (cartCount > 0) {
        cartdetailsId = data[0].cart_id;
      }
      totalAmountCalculation(
        cartdetailsId,
        patientId,
        req,
        res,
        displayMessage,
        result
      );

      // res.status(200).send({
      //   status: 200,
      //   error: false,
      //   message: "Cart Details fetched Successfully",
      //   cart_count: cartCount,
      //   data: data,
      // });
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message ||
          "Some error occurred while retrieving Cart Details List.",
      });
    });
};

// Delete a Cart Details with the specified id in the request
exports.delete = (req, res) => {
  const id = req.params.id;
  var user_type = "Admin";
  cartTbl
    .destroy({
      where: { id: id },
    })
    .then((num) => {
      if (num == 1) {
        const auditTrailVal = {
          user_id: id,
          trail_type: "Admin",
          trail_message: "Cart Detail Deleted Successfully",
          status: 1,
        };
        AuditTrail.create(auditTrailVal, (err, data) => {});
        res.status(200).send({
          status: 200,
          error: false,
          message: "Cart Detail Deleted Successfully",
        });
      } else {
        res.send({
          message: `Cannot delete Cart Detail with id=${id}. Maybe Cart Detail was not found!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Could not delete Cart Detail with id=" + id,
      });
    });
};

// ......................................  Favorite Starts Here .............................................

// Create a Favorite  Details
exports.createFavorite = (req, res) => {
  var user_type = "Admin";
  if (!req.body) {
    res.status(400).send({ message: "Content cannot be empty" });
  } else {
    var countCondition = {
      medicine_id: req.body.medicine_id,
      patient_id: req.body.patient_id,
    };

    const favoriteVal = {
      patient_id: req.body.patient_id,
      medicine_id: req.body.medicine_id,
    };

    favoriteMedicine
      .count({ where: countCondition })
      .then((count) => {
        if (count === 0) {
          favoriteMedicine.create(favoriteVal).then((data) => {
            const auditTrailVal = {
              user_id: req.body.patient_id,
              trail_type: "Admin",
              trail_message: "Favorite Details added Successfully",
              status: 1,
            };
            AuditTrail.create(auditTrailVal, (err, data) => {});
            res.status(200).send({
              status: 200,
              error: false,
              message: "Favorite Details added Successfully",
            });
          });
        } else {
          res.status(200).send({
            status: 200,
            error: false,
            message: "Medicine Already added to Favorite..",
            cart_id: "",
          });
        }
      })
      .catch((err) => {
        res.status(500).send({
          message:
            err.message ||
            "Some error occurred while retrieving VitalInformation.",
        });
      });
  }
};

// Update a  by the id in the request
exports.updateFavorite = (req, res) => {
  const id = req.params.id;
  var user_type = "Admin";
  favoriteMedicine
    .update(req.body, {
      where: { id: id },
    })
    .then((num) => {
      if (num == 1) {
        const auditTrailVal = {
          user_id: id,
          trail_type: "Admin",
          trail_message: "Favorite updated Successfully",
          status: 1,
        };
        AuditTrail.create(auditTrailVal, (err, data) => {});
        res.status(200).send({
          status: 200,
          error: false,
          message: "Favorite Updated Successfully",
        });
      } else {
        res.send({
          message: `Cannot update Favorite with id=${id}. Maybe Favorite was not found or req.body is empty!`,
        });
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send({
        message: "Error updating Favorite with id=" + id,
      });
    });
};

// Delete a Cart Details with the specified id in the request
exports.deleteFavorite = (req, res) => {
  const id = req.params.id;
  var user_type = "Admin";
  favoriteMedicine
    .destroy({
      where: { id: id },
    })
    .then((num) => {
      if (num == 1) {
        const auditTrailVal = {
          user_id: id,
          trail_type: "Admin",
          trail_message: "Favorite Detail Deleted Successfully",
          status: 1,
        };
        AuditTrail.create(auditTrailVal, (err, data) => {});
        res.status(200).send({
          status: 200,
          error: false,
          message: "Favorite Detail Deleted Successfully",
        });
      } else {
        res.send({
          message: `Cannot delete Favorite Detail with id=${id}. Maybe Favorite Detail was not found!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Could not delete Favorite Detail with id=" + id,
      });
    });
};

// find all Favorite Details by patient id
exports.findAllFavoriteDetails = (req, res) => {
  let patient_id = req.params.patientId;

  ProductMaster.hasMany(favoriteMedicine, { foreignKey: "medicine_id" });
  favoriteMedicine.belongsTo(ProductMaster, { foreignKey: "medicine_id" });
  favoriteMedicine
    .findAll({
      where: { patient_id: patient_id },
      attributes: { exclude: ["createdAt", "updatedAt"] },
      include: [
        {
          model: ProductMaster,
          required: false,
          // attributes: [
          //   "form",
          //   "Medicinename",
          //   "Medicineid",
          //   "constituents_name",
          //   "manufacturer",
          //   "unit_price",
          //   "drug_type",
          //   "mrp",
          //   "id",
          // ],
        },
      ],
    })
    .then((data) => {
      const auditTrailVal = {
        user_id: patient_id,
        trail_type: "Admin",
        trail_message: "Patient Favorite Details fetched Successfully",
        status: 1,
      };
      AuditTrail.create(auditTrailVal, (err, data) => {});
      res.status(200).send({
        status: 200,
        error: false,
        message: "Patient Favorite Details fetched Successfully",
        data: data,
      });
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message ||
          "Some error occurred while retrieving Favorite Details List.",
      });
    });
};

//  ................................................................  Favorites Ends ................................................

//  <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<  Wish List APi's >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>



  // Create a Wishlist  Details
  exports.createWishlist = (req, res) => {
    var user_type = "Admin";
    if (!req.body) {
      res.status(400).send({ message: "Content cannot be empty" });
    } else {
      let randomnumber = "";
      if (req.body.cart_id === "") {
        console.log("Cart Id Empty ");
        var minm = 10000;
        var maxm = 99999;
        randomnumber = Math.floor(Math.random() * (maxm - minm + 1)) + minm;
      } else {
        randomnumber = req.body.cart_id;
      }

      var countCondition = {
        medicine_id: req.body.medicine_id,
        patient_id: req.body.patient_id,
      };
      const wishlistVal = {
        cart_id: randomnumber,
        patient_id: req.body.patient_id,
        medicine_id: req.body.medicine_id,
        quantity: req.body.quantity,
      };
      console.log(req.body);
      wishlistMedicine.count({ where: countCondition }).then((count) => {
        if (count === 0) {
          wishlistMedicine.create(wishlistVal).then((data) => {
            cartTbl
              .destroy({
                where: countCondition,
              })
              .then((num) => {
                if (num == 1) {
                  //  Action Performed
                }
              });

            const auditTrailVal = {
              user_id: req.body.patient_id,
              trail_type: "Admin",
              trail_message: "Wishlist Details created Successfully",
              status: 1,
            };
            AuditTrail.create(auditTrailVal, (err, data) => {});
            res.status(200).send({
              status: 200,
              error: false,
              message: "Wishlist Details Created Successfully",
              cart_id: randomnumber,
            });
          });
        } else {

          // res.status(200).send({
          //   status: 200,
          //   error: false,
          //   message: "Medicine Already added to cart",
          //   cart_id: randomnumber,
          // });
          // return;

          wishlistMedicine
            .findAll({
              where: countCondition,
            })
            .then((data) => {
              let quantity = data[0].quantity;
              let reqQuantity = req.body.quantity;
              let quantitySum = parseInt(quantity) + parseInt(reqQuantity);
              let updateId = data[0].id;

              if (quantitySum < 50) {
                const updateData = {
                  patient_id: req.body.patient_id,
                  medicine_id: req.body.medicine_id,
                  quantity: quantitySum,
                };
                wishlistMedicine
                  .update(updateData, {
                    where: { id: updateId },
                  })
                  .then((num) => {
                    if (num == 1) {
                      const auditTrailVal = {
                        user_id: req.body.patient_id,
                        trail_type: "Admin",
                        trail_message: "Wishlist Updated Successfully",
                        status: 1,
                      };
                      AuditTrail.create(auditTrailVal, (err, data) => {});
                      res.status(200).send({
                        status: 200,
                        error: false,
                        message: "Wishlist Updated Successfully",
                      });
                    }
                  });
              } else {
                res.status(200).send({
                  status: 200,
                  error: false,
                  message: "Medicine Quantity exceed limit..",
                  currentQuantity: quantity,
                });
              }
            });
        }
      });
    }
  };
// Ends here



// Update a  by the id in the request
exports.updateWishlist = (req, res) => {
  const id = req.params.id;
  var user_type = "Admin";
  wishlistMedicine
    .update(req.body, {
      where: { id: id },
    })
    .then((num) => {
      if (num == 1) {
        const auditTrailVal = {
          user_id: id,
          trail_type: "Admin",
          trail_message: "Wishlist updated Successfully",
          status: 1,
        };
        AuditTrail.create(auditTrailVal, (err, data) => {});
        res.status(200).send({
          status: 200,
          error: false,
          message: "Wishlist Updated Successfully",
        });
      } else {
        res.send({
          message: `Cannot update Wishlist with id=${id}. Maybe Wishlist was not found or req.body is empty!`,
        });
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send({
        message: "Error updating Wishlist with id=" + id,
      });
    });
};

// find all Favorite Details by patient id
exports.findAllWishlistDetails = (req, res) => {
  let patient_id = req.params.patientId;
  wishlistMedicine
    .findAll({
      where: { patient_id: patient_id },
      attributes: { exclude: ["createdAt", "updatedAt"] },
    })
    .then((data) => {
      const auditTrailVal = {
        user_id: patient_id,
        trail_type: "Admin",
        trail_message: "Patient Wishlist Details fetched Successfully",
        status: 1,
      };
      AuditTrail.create(auditTrailVal, (err, data) => {});
      res.status(200).send({
        status: 200,
        error: false,
        message: "Patient Wishlist Details fetched Successfully",
        data: data,
      });
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message ||
          "Some error occurred while retrieving Favorite Details List.",
      });
    });
};

// Delete a Cart Details with the specified id in the request
exports.deleteWishlist = (req, res) => {
  const id = req.params.id;
  var user_type = "Admin";
  wishlistMedicine
    .destroy({
      where: { id: id },
    })
    .then((num) => {
      if (num == 1) {
        const auditTrailVal = {
          user_id: id,
          trail_type: "Admin",
          trail_message: "Wishlist Detail Deleted Successfully",
          status: 1,
        };
        AuditTrail.create(auditTrailVal, (err, data) => {});
        res.status(200).send({
          status: 200,
          error: false,
          message: "Wishlist Detail Deleted Successfully",
        });
      } else {
        res.send({
          message: `Cannot delete Wishlist Detail with id=${id}. Maybe Wishlist Detail was not found!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Could not delete Wishlist Detail with id=" + id,
      });
    });
};

//  <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<  Ends here       >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

// Clear the cart details based on patient Id
// exports.clearPatientCartDetails = (req, res) => {
//   const patientId = req.params.patientId;
//   var user_type = "Admin";
//   cartTbl
//     .destroy({
//       where: { patient_id: patientId },
//     })
//     .then((num) => {
//       // console.log(num+" >>> Clear Cart Number....");
//       // return;
//       if (num) {
//         const auditTrailVal = {
//           user_id: patientId,
//           trail_type: "Admin",
//           trail_message: "Patient Cart Details Deleted Successfully",
//           status: 1,
//         };
//         AuditTrail.create(auditTrailVal, (err, data) => {});
//         res.status(200).send({
//           status: 200,
//           error: false,
//           message: "Patient Cart Details Deleted Successfully",
//         });
//       } else {
//         res.send({
//           message: `Cannot Clear Cart Detail with id=${patientId}. Maybe Cart Detail was not found!`,
//         });
//       }
//     })
//     .catch((err) => {
//       console.log(err);
//       res.status(500).send({
//         message: "Could not delete Cart Detail with id=" + patientId,
//       });
//     });
// };
// Ends here
