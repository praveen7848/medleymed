const db = require("../../models");

const cartTbl = db.cart_tbl;
const Retailer = db.retailer_registration_tbl;
const retailerStockTbl = db.retailer_stock_tbl;
const HealthosMedicine = db.tbl_healthos_medicine_data;
const ProductMaster = db.products_master_tbl;
const orderProcessing = db.order_processing_tbl;
const orderInvoice = db.order_invoice_tbl;
const orderStatus = db.order_status_tbl;
const orderTable = db.order_tbl;
const Patient = db.patient_tbl;
const deliveryAddress = db.delivery_address_tbl;
const Users = db.users_tbl;
const nodemailer = require("nodemailer");
const emailSend = require("../../helpers/Email");
const Op = db.Sequelize.Op;
const AuditTrail = db.audit_trails;
var encryption = require("../../helpers/Encryption");
const axios = require("axios");
const masterrealtionships = db.master_realtionships;
const cartPrescriptionsTbl = db.cart_prescription_tbl;

var base64Img = require("base64-img");
var fs = require("fs");

const textLocalHash = "89fa26bfa52c1d38cc162b2a38ba75bbca03abf6";
const textLocalAPIKey = "dHnQUu8BBeU-s8JtxOkL3bepg2O67qYsKAuoUD7VZp";
const textLocalUserName = "support@medleymed.com";
const textLocalSender = "MEDLEY";

const moment = require("moment");

// Create New Order Processing Details
exports.createNew = (req, res) => {
  var user_type = "Admin";
  if (!req.body) {
    res.status(400).send({ message: "Content cannot be empty" });
  } else {
    var orderCountCondition = {
      // patient_id: req.body.patient_id,
      // retailer_id: req.body.retailer_id,
      // order_status: 1,
      transaction_id: req.body.transaction_id,
    };
    var orderId = "1";

    orderTable.count({ where: orderCountCondition }).then((count) => {
      if (count === 0) {
        orderTable
          .findAll({
            limit: 1,
            where: {
              // your where conditions, or without them if you need ANY entry
            },
            order: [["createdAt", "DESC"]],
          })
          .then(function (resData) {
            if (resData.length === 0) {
              orderValue = parseInt(orderId);
            } else {
              orderValue = parseInt(orderId) + 1;
            }
            insertOrderRecord(orderId, req, res);
            // console.log(resData + " resData ");
            // console.log(resData.length + " resDataLength ");
          });
      } else {
        res.status(200).send({
          status: 200,
          error: false,
          message: "Order Process already..",
        });

        // orderTable
        //   .findAll({
        //     limit: 1,
        //     where: {
        //       // your where conditions, or without them if you need ANY entry
        //     },
        //     order: [["createdAt", "DESC"]],
        //   })
        //   .then(function (resData) {
        //     let orderId = parseInt(resData[0].id) + 1;
        //     insertOrderRecord(orderId, req, res);
        //   });
      }
    });
  }
};

// function getRetailerSlabDeliveryDate(retailerId) {
//   let deliveryDate = "";
//   Retailer.findAll({
//     limit: 1,
//     where: {
//       id: retailerId,
//     },
//     order: [["createdAt", "DESC"]],
//   }).then(function (retailerData) {
//     let minimumSlabDate = parseInt(retailerData[0].set_delivery_slab);
//     var new_date = moment(orderDate, "YYYY-MM-DD").add('days', 5);
//     console.log("new_date >> "+nowPlusOneDayStr);
//   });
// }

function insertOrderRecord(orderId, req, res) {
  // console.log(orderId + " orderId ");
  // console.log(parseInt(orderId) + " >>>> orderId");
  // console.log(parseInt(orderId) + 1 + " >>>> orderId 1");
  // console.log(req);
  // return;

  let orderData = req.body.order_details;
  let orderDataLength = orderData.length;

  const orderTblStatusVal = {
    retailer_id: req.body.retailer_id,
    patient_id: req.body.patient_id,
    patient_address_id: req.body.patient_address_id,
    relative_id: req.body.relative_id,
    cart_level_discount: req.body.cart_level_discount,
    delivery_charges: req.body.delivery_charges,
    net_amount: req.body.net_amount,
    payable_amount: req.body.payable_amount,
    coupan_name: req.body.coupan_name,
    coupan_value: req.body.coupan_value,
    delivery_agent: req.body.delivery_agent,
    // prescription: req.body.prescription,
    order_date: moment().format("YYYY-MM-DD HH:mm:ss"),
    // order_date: req.body.order_date,
    order_status: 1,
  };

  // let deliveryDate = getRetailerSlabDeliveryDate(req.body.retailer_id);
  // console.log(deliveryDate+" >>> deliveryDate ");
  // return;

  const orderTblVal = {
    retailer_id: req.body.retailer_id,
    patient_id: req.body.patient_id,
    patient_address_id: req.body.patient_address_id,
    relative_id: req.body.relative_id,
    cart_level_discount: req.body.cart_level_discount,
    delivery_charges: req.body.delivery_charges,
    net_amount: req.body.net_amount,
    payable_amount: req.body.payable_amount,
    coupan_name: req.body.coupan_name,
    coupan_value: req.body.coupan_value,
    prescription: req.body.prescription,
    transaction_id: req.body.transaction_id,
    delivery_agent: req.body.delivery_agent,
    // order_date: req.body.order_date,
    order_date: moment().format("YYYY-MM-DD HH:mm:ss"),
  };

  // console.log(orderTblVal);
  // return;
  // return;

  orderTable
    .count({
      where: orderTblStatusVal,
    })
    .then((rows) => {
      if (rows === 0) {
        // var prescriptionData = req.body;
        // console.log(prescriptionData.length+" Prescription Length ");
        // res.send(prescriptionData);
        // return;

        // console.log(orderTblVal);
        // return;
        var prescriptionss = req.body.prescription;
        orderTable
          .create(orderTblVal)
          .then((orderResponse) => {
            // var prescriptionData = req.body;
            // console.log(prescriptionData.length+" Prescription Length ");
            // res.send(prescriptionData);
            // return;

            orderData.forEach((arg) => {
              let orderId = orderResponse.id;
              insertCommonMethod(orderId, arg, req, res);
            });

            // // var prescriptionss = [{"name": "1.png", "type": "image/png", "size": "161 kB", "base64": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAASwAAAEsCAIAAAD2HxkiAAADl0lEQVR4nO3ZMYrDQBREwR7j+19Zip0JHLxAVWy0IHDyaJh/tmu7zu/ftvPon/Otb33757efAanvTv0T4N1ECDERQkyEEBMhxLyOQswSQkyEEBMhxEQIMRFCTIQQc6KAmCWEmAghJkKIiRBiIoSYCCHmRAExSwgxEUJMhBATIcRECDGvoxCzhBATIcRECDERQkyEEBMhxJwoIGYJISZCiIkQYiKEmAghJkKIOVFAzBJCTIQQEyHERAgxEULM6yjELCHERAgxEUJMhBATIcRECDEnCohZQoiJEGIihJgIISZCiIkQYk4UELOEEBMhxEQIMRFCTIQQ8zoKMUsIMRFCTIQQEyHERAgxEULMiQJilhBiIoSYCCEmQoiJEGIihJgTBcQsIcRECDERQkyEEBMhxLyOQswSQkyEEBMhxEQIMRFCTIQQc6KAmCWEmAghJkKIiRBiIoSYCCHmRAExSwgxEUJMhBATIcRECDGvoxCzhBATIcRECDERQkyEEBMhxJwoIGYJISZCiIkQYiKEmAghJkKIOVFAzBJCTIQQEyHERAgxEULM6yjELCHERAgxEUJMhBATIcRECDEnCohZQoiJEGIihJgIISZCiIkQYk4UELOEEBMhxEQIMRFCTIQQ8zoKMUsIMRFCTIQQEyHERAgxEULMiQJilhBiIoSYCCEmQoiJEGIihJgTBcQsIcRECDERQkyEEBMhxLyOQswSQkyEEBMhxEQIMRFCTIQQc6KAmCWEmAghJkKIiRBiIoSYCCHmRAExSwgxEUJMhBATIcRECDGvoxCzhBATIcRECDERQkyEEBMhxJwoIGYJISZCiIkQYiKEmAghJkKIOVFAzBJCTIQQEyHERAgxEULM6yjELCHERAgxEUJMhBATIcRECDEnCohZQoiJEGIihJgIISZCiIkQYk4UELOEEBMhxEQIMRFCTIQQ8zoKMUsIMRFCTIQQEyHERAgxEULMiQJilhBiIoSYCCEmQoiJEGIihJgTBcQsIcRECDERQkyEEBMhxLyOQswSQkyEEBMhxEQIMRFCTIQQc6KAmCWEmAghJkKIiRBiIoSYCCHmRAExSwgxEUJMhBATIcRECDGvoxCzhBATIcRECDERQkyEEBMhxJwoIGYJISZCiIkQYiKEmAghJkKIOVFAzBJCTIQQEyHERAgxEULM6yjELCHERAgxEUJMhBATIcRECDEnCohZQoiJEGIihJgIISZCiN0HtAVfIctU0QAAAABJRU5ErkJggg=="}];
            // // console.log("Prescription Length "+prescriptionss.length);

            // const FILE_PATH = "./public/uploads/patient/OM/prescriptions";
            // var updateImageUploadarr = [];
            // for (var i = 0; i < prescriptionss.length; i++) {
            //   updateObj = {};
            //   if (
            //     prescriptionss[i].base64 != "" &&
            //     prescriptionss[i].base64 !== undefined
            //   ) {
            //     base64Img.img(
            //       prescriptionss[i].base64,
            //       FILE_PATH,
            //       Date.now(),
            //       function (err, filepath) {

            //         const pathArr = filepath.split("/");
            //         const fileName = pathArr[pathArr.length - 1];

            //         const updatefinalName = filepath.replace(/\\/g, '/').split('/');
            //         console.log(updatefinalName);
            //         const updatefinalFileName = updatefinalName[5];

            //         const imageData = "/uploads/patient/OM/prescriptions/" + updatefinalFileName;
            //         updateImageUploadarr.push(imageData);
            //         console.log("--- updateImageUploadarr1234  ---", updateImageUploadarr);
            //         var options = {
            //           where: {
            //             id: orderId,
            //           },
            //         };

            //         orderTable
            //           .update(
            //             {
            //               prescription: updateImageUploadarr,
            //             },
            //             options
            //           )
            //           .then((data) => {
            //             console.log("--- updateImageUploadarr  ---", updateImageUploadarr);
            //           }).catch((err) => {
            //             console.log(err);
            //             res.status(500).send({
            //               error: `${err} while creating order Insert..`,
            //             });
            //           });
            //       }
            //     );
            //   }
            // }
          })
          .catch((err) => {
            // console.log(err);
            res.status(500).send({
              error: `${err} while creating Order Processing..`,
            });
          });
      } else {
        orderData.forEach((arg) => {
          insertCommonMethod(orderId, arg, req, res);
        });
      }
    });
}

function insertCommonMethod(orderId, arg, req, res) {

  // const stockTblVal = {
  //   retailer_id: arg.retailer_id,
  //   medicine_id: arg.medicine_id,
  // };
  // retailerStockTbl
  //   .findAll({
  //     // limit: 1,
  //     where: stockTblVal,
  //   })
  //   .then(function (resData) {
  //     if (resData.length > 0) {
  //        expiry_date: resData[0].expiry_date,
  //     }
  //   });

  const orderProcessVal = {
    retailer_id: arg.retailer_id,
    patient_id: arg.patient_id,
    medicine_id: arg.medicine_id,
    order_id: orderId,
    expiry_date: arg.expiry_date,
    quantity: arg.quantity,
    amount: arg.amount,
    // order_date: req.body.order_date,
    order_date: moment().format("YYYY-MM-DD HH:mm:ss"),
    batch: arg.batch,
    vat: arg.vat,
    CGST: arg.CGST,
    SGST: arg.SGST,
    IGST: arg.IGST,
  };

  // console.log(orderProcessVal);
  // return;

  orderProcessing.create(orderProcessVal).then((processdata) => {
   
    cartPrescriptionsTbl
   .update({
    order_id: orderId,
    order_status : 1
    }, {
    where: { patient_id: arg.patient_id,order_status : 0 },
    })
    .then((num) => { });

    cartTbl
      .destroy({
        where: { patient_id: arg.patient_id },
      })
      .then((num) => {
        // console.log(num+" >>> Clear Cart Number....");
        // return;
        if (num) {
          // const auditTrailVal = {
          //   user_id: arg.patient_id,
          //   trail_type: "Admin",
          //   trail_message: "Patient Cart Details Deleted Successfully",
          //   status: 1,
          // };
          // AuditTrail.create(auditTrailVal, (err, data) => {});
          // res.status(200).send({
          //   status: 200,
          //   error: false,
          //   message: "Patient Cart Details Deleted Successfully",
          // });
        } else {
          // res.send({
          //   message: `Cannot Clear Cart Detail with id=${patientId}. Maybe Cart Detail was not found!`,
          // });
        }
      })
      .catch((err) => {
        console.log(err);
        res.status(500).send({
          message: "Could not delete Cart Detail with id=" + arg.patient_id,
        });
      });
  });

  delay(function () {
    const auditTrailVal = {
      user_id: orderId,
      trail_type: "Admin",
      trail_message: "Order Process created Successfully",
      status: 1,
    };
    AuditTrail.create(auditTrailVal, (err, data) => {});
    res.status(200).send({
      status: 200,
      error: false,
      orderId: orderId,
      message: "Order Process created Successfully",
    });
  }, 100);
}
// Ends here

// Don't Disturb Starts here
var delay = (function () {
  var timer = 0;
  return function (callback, ms) {
    clearTimeout(timer);
    timer = setTimeout(callback, ms);
  };
})();
// Ends here

//fetch Order Details based on retailer and date range and order status
exports.retailerOrders = (req, res) => {
  var retailerId = req.body.retailer_id;
  var orderStatus = req.body.status;

  var startDate = new Date().toISOString().slice(0, 10);
  var endDate = new Date().toISOString().slice(0, 10);
  if (req.body.start_date) {
    startDate = req.body.start_date;
  }
  if (req.body.end_date) {
    endDate = req.body.end_date;
  }
  // console.log(startDate + " >>> startDate");
  // console.log(endDate + " >>> endDate");
  // console.log(req.body);

  orderTable.hasMany(orderProcessing, { foreignKey: "order_id" });
  orderProcessing.belongsTo(orderTable, { foreignKey: "order_id" });

  // HealthosMedicine.hasMany(orderProcessing, { foreignKey: "medicine_id" });
  // orderProcessing.belongsTo(HealthosMedicine, { foreignKey: "medicine_id" });

  orderTable.hasMany(cartPrescriptionsTbl, { foreignKey: "order_id" });
  cartPrescriptionsTbl.belongsTo(orderTable, { foreignKey: "order_id" });

  ProductMaster.hasMany(orderProcessing, { foreignKey: "medicine_id" });
  orderProcessing.belongsTo(ProductMaster, { foreignKey: "medicine_id" });

  Patient.hasMany(orderTable, { foreignKey: "patient_id" });
  orderTable.belongsTo(Patient, { foreignKey: "patient_id" });

  var condition = "";

  if (req.body.start_date && req.body.end_date) {
    condition = {
      retailer_id: retailerId,
      order_date: {
        [Op.between]: [startDate, endDate],
      },
      order_status: orderStatus,
    };
  } 
  // else if (orderStatus == 1) {
  //   condition = {
  //     retailer_id: retailerId,
  //     [Op.or]: [
  //       {
  //         order_status: 1,
  //       },
  //       {
  //         order_status: 2,
  //       },
  //     ],
  //   };
  // }   
  else {
    condition = {
      retailer_id: retailerId,
      order_status: orderStatus,
    };
  }

  orderTable
    .findAll({
      where: condition,
      attributes: { exclude: ["createdAt", "updatedAt"] },
      order: [["id", "DESC"]],
      include: [
        {
          model: orderProcessing,
          required: true,
          attributes: { exclude: ["createdAt", "updatedAt"] },
          include: [
            {
              // model: HealthosMedicine,
              model: ProductMaster,
              required: false,
              // attributes: [
              //   "id",
              //   "medicineid",
              //   "medicinename",
              //   "manufacturer",
              //   "form",
              //   "unit_price",
              // ],
            },
          ],
        },
        {
          model: cartPrescriptionsTbl,
          required: false,
          attributes: { exclude: ["createdAt", "updatedAt"] },
        },
        {
          model: Patient,
          required: false,
          attributes: ["id", "name", "phone_number"],
        },
      ],
    })
    .then((data) => {
      if (data.length > 0) {
        orderProcessing
          .count({
            where: {
              retailer_id: retailerId,
              order_date: {
                [Op.between]: [startDate, endDate],
              },
            },
          })
          .then((recordsCount) => {
            res.status(200).send({
              status: 200,
              error: false,
              itemsCount: recordsCount,
              message: "order Details fetched Sucessfully...",
              data: data,
            });
          });
      } else {
        res.status(200).send({
          status: 200,
          error: false,
          itemsCount: 0,
          message: "order Details fetched Sucessfully...",
          data: data,
        });
      }
    });
};
// Ends here

//update the Retailer Order statuses...
exports.updateOrderStatus = (req, res) => {
  var rowId = req.params.orderId;
  var orderStatus = req.body.order_status;

  if (req.body.data) {
    req.body = req.body.data;
  }

  orderTable
    .update(req.body, {
      where: {
        id: rowId,
      },
    })
    .then((num) => {
      if (num == 1) {
        res.status(200).send({
          status: 200,
          error: false,
          message: "Order Status updated Successfully",
        });
      } else {
        res.send({
          message: `Cannot update order Status with id=${rowId}. Maybe order status was not found or req.body is empty!`,
        });
      }
    })
    .catch((err) => {
      // console.log(err);
      res.status(500).send({
        message: "Error updating Audit Trail with id=" + rowId,
      });
    });
};
// Ends here..

//get the Retailer Order process Dashboard Details...
exports.getOrderDashboardDetails = (req, res) => {
  const retailerId = req.params.retailerId;
  // console.log("Retailer Id >>> " + retailerId);

  let pendingOrder = 0;
  let shippedOrder = 0;
  let cancelledOrder = 0;
  let deliveredOrder = 0;
  let prescriptionReview = 0;
  let processingOrderData = 0;

  orderTable
    .findAll({
      where: {
        retailer_id: retailerId,
        order_status: 1,
      },
      attributes: {
        exclude: ["createdAt", "updatedAt"],
      },
    })
    .then((pendingdata) => {
      pendingOrder = pendingdata.length;
      orderTable
        .findAll({
          where: {
            retailer_id: retailerId,
            order_status: 4,
          },
          attributes: {
            exclude: ["createdAt", "updatedAt"],
          },
        })
        .then((shippeddata) => {
          shippedOrder = shippeddata.length;
          orderTable
            .findAll({
              where: {
                retailer_id: retailerId,
                order_status: 6,
              },
              attributes: {
                exclude: ["createdAt", "updatedAt"],
              },
            })
            .then((cancelleddata) => {
              cancelledOrder = cancelleddata.length;
              orderTable
                .findAll({
                  where: {
                    retailer_id: retailerId,
                    order_status: 5,
                  },
                  attributes: {
                    exclude: ["createdAt", "updatedAt"],
                  },
                })
                .then((deliverdata) => {
                  deliveredOrder = deliverdata.length;

                  orderTable
                    .findAll({
                      where: {
                        retailer_id: retailerId,
                        order_status: 2,
                      },
                      attributes: {
                        exclude: ["createdAt", "updatedAt"],
                      },
                    })
                    .then((previewData) => {
                      prescriptionReview = previewData.length;

                      orderTable
                    .findAll({
                      where: {
                        retailer_id: retailerId,
                        order_status: 3,
                      },
                      attributes: {
                        exclude: ["createdAt", "updatedAt"],
                      },
                    })
                    .then((processingData) => {
                      processingOrderData = processingData.length;


                      let retailerOrderArray = [
                        {
                          pendingOrder: pendingOrder,
                          shippedOrder: shippedOrder,
                          cancelledOrder: cancelledOrder,
                          deliveredOrder: deliveredOrder,
                          previewOrder: prescriptionReview,
                          processingOrder : processingOrderData
                        },
                      ];
                      res.status(200).send({
                        status: 200,
                        error: false,
                        message:
                          "Retailer Order dashboard Details Count Fetched successfully...",
                        data: retailerOrderArray,
                      });

                        });
                    });
                });
            });
        });
    });
};

//get the Retailer Order details
exports.getOrderDetails = (req, res) => {
  const retailerId = req.params.retailerId;
  const orderId = req.params.orderId;

  // console.log("Retailer Id >>> " + retailerId);
  // console.log("Order Id >>> " + orderId);

  orderTable.hasMany(orderProcessing, { foreignKey: "order_id" });
  orderProcessing.belongsTo(orderTable, { foreignKey: "order_id" });

  // HealthosMedicine.hasMany(orderProcessing, { foreignKey: "medicine_id" });
  // orderProcessing.belongsTo(HealthosMedicine, { foreignKey: "medicine_id" });

  ProductMaster.hasMany(orderProcessing, { foreignKey: "medicine_id" });
  orderProcessing.belongsTo(ProductMaster, { foreignKey: "medicine_id" });

  // HealthosMedicine.hasMany(orderProcessing, { foreignKey: "medicine_id" });
  // orderProcessing.belongsTo(HealthosMedicine, { foreignKey: "medicine_id" });

  Retailer.hasMany(orderTable, { foreignKey: "retailer_id" });
  orderTable.belongsTo(Retailer, { foreignKey: "retailer_id" });

  Patient.hasMany(orderTable, { foreignKey: "patient_id" });
  orderTable.belongsTo(Patient, { foreignKey: "patient_id" });

  Patient.hasMany(deliveryAddress, { foreignKey: "patient_id" });
  deliveryAddress.belongsTo(Patient, { foreignKey: "patient_id" });

  orderTable.hasMany(cartPrescriptionsTbl, { foreignKey: "order_id" });
  cartPrescriptionsTbl.belongsTo(orderTable, { foreignKey: "order_id" });

  orderTable
    .findAll({
      where: {
        retailer_id: retailerId,
        id: orderId,
      },
      attributes: {
        exclude: ["createdAt", "updatedAt"],
      },
      include: [
        {
          model: orderProcessing,
          required: false,
          attributes: {
            exclude: ["createdAt", "updatedAt"],
          },
          include: [
            {
              // model: HealthosMedicine,
              model: ProductMaster,
              required: false,
              order: [["medicinename", "ASC"]],
              // attributes: [
              //   "id",
              //   "medicineid",
              //   "medicinename",
              //   "manufacturer",
              //   "form",
              //   "unit_price",
              // ],
            },
          ],
        },
        {
          model: cartPrescriptionsTbl,
          required: false,
          attributes: { exclude: ["createdAt", "updatedAt"] },
        },
        {
          model: Patient,
          required: false,
          attributes: ["id", "name", "phone_number"],
          include: [
            {
              model: deliveryAddress,
              required: false,
              attributes: {
                exclude: ["createdAt", "updatedAt"],
              },
              where: {
                default_status: 1,
              },
            },
          ],
        },
        {
          model: Retailer,
          required: false,
          attributes: {
            exclude: ["createdAt", "updatedAt"],
          },
        },
      ],
    })
    .then((orderData) => {
      // var total_amount = 0;
      // orderData.forEach((arg) => {
      //   var quantity = 0;
      //   total_amount += parseInt(arg.amount);
      // });
      res.status(200).send({
        status: 200,
        error: false,
        items: orderData.length,
        message: "Retailer Orderdetails Fetched successfully...",
        data: orderData,
      });
    });
};

//approve Order Details
// exports.approveOrderDetails = (req, res) => {
//   console.log("Hai");
//   console.log(req.body);

//   let orderDetails = req.body.order_details;
//   let orderDetailsLength = orderDetails.length;
//   console.log("orderDetailsLength " + orderDetailsLength);
//   if (orderDetailsLength > 0) {
//     orderDetails.forEach((arg) => {
//       const orderProcesscondition = {
//         order_id: req.body.order_id,
//         retailer_id: req.body.retailer_id,
//         medicine_id: arg.medicine_id,
//         batch: arg.batch,
//       };
//       const orderProcessdetails = {
//         billed_items: arg.billed_items,
//         billed_amount: arg.billed_amount,
//       };
//       const whereCondition = {
//         id: arg.id,
//         order_id: req.body.order_id,
//         retailer_id: req.body.retailer_id,
//         medicine_id: arg.medicine_id,
//         batch: arg.batch,
//       };
//       const orderTableCondition = {
//         order_status: 2,
//       };
//       orderProcessing
//         .update(orderProcessdetails, {
//           where: whereCondition,
//         })
//         .then((num) => {
//           if (num == 1) {
//             console.log("Iam updated child table...!");
//             orderTable
//               .update(orderTableCondition, {
//                 where: {
//                   id: req.body.order_id,
//                 },
//               })
//               .then((num) => {
//                 if (num == 1) {
//                   console.log("Iam updated parent table...!");
//                 }
//               });
//           } //Parent Closing
//         })
//         .catch((err) => {
//           console.log(err);
//           res.status(500).send({
//             message: "Error updating Order process id=" + id,
//           });
//         });
//     });
//   } else {
//     res.status(200).send({
//       status: 200,
//       error: false,
//       orderItems: orderDetailsLength,
//       message: "Order details not found...",
//       data: [],
//     });
//   }
// };

//send the order status Email/SMS to patient
exports.updateOrderStatusInfo = (req, res) => {
  // console.log(req.body);
  let retailerId = req.body.retailer_id;
  let orderId = req.body.order_id;
  let patientId = req.body.patient_id;
  let patientMessageBody = "";
  let attachmentData = [];
  let medicineDetails = req.body.medicine_details;

  Retailer.hasMany(orderTable, { foreignKey: "retailer_id" });
  orderTable.belongsTo(Retailer, { foreignKey: "retailer_id" });

  orderTable
    .findAll({
      where: {
        retailer_id: retailerId,
        id: orderId,
        patient_id: patientId,
      },
      attributes: ["id", "retailer_id", "patient_id"],
      include: [
        {
          model: Retailer,
          required: false,
          attributes: ["id", "storename", "mobile_number", "email"],
        },
      ],
    })
    .then((orderData) => {
      // console.log("First Then.......");
      // return;
      if (orderData.length > 0) {
        Users.hasOne(Patient, { foreignKey: "user_id" });
        Patient.belongsTo(Users, { foreignKey: "user_id" });
        Patient.findAll({
          where: { id: patientId },
          attributes: ["id", "phone_number"],
          include: [
            {
              model: Users,
              required: false,
              attributes: ["id", "email", "mobile_number", "name"],
            },
          ],
        }).then((patientData) => {
          if (patientData.length > 0) {
            let patientEmail = patientData[0].tbl_user.email;
            let patientName = patientData[0].tbl_user.name;
            let patientPhone = patientData[0].tbl_user.mobile_number;
            let retailerStoreName =
              orderData[0].retailer_registration_tbl.storename;
            let retailerStoreMobile =
              orderData[0].retailer_registration_tbl.mobile_number;
            let retailerStoreEmail =
              orderData[0].retailer_registration_tbl.email;

            //  res.send({
            //   patientEmail: patientEmail,
            //   patientName: patientName,
            //   patientPhone: patientPhone,
            //   retailerStoreName: retailerStoreName,
            //   retailerStoreMobile: retailerStoreMobile,
            //   retailerStoreEmail: retailerStoreEmail,
            //   approvedMedicines:approvedMedicines
            //  });

            if (medicineDetails.length > 0) {
              orderTable
                .update(
                  { order_status: 2 },
                  {
                    where: { id: orderId },
                  }
                )
                .then((num) => {});

              let approvedMedicines = Array.prototype.map
                .call(medicineDetails, (s) => s.medicine_name)
                .toString();
              patientMessageBody += "<p>Hello Mr. " + patientName + ",</p>";
              patientMessageBody +=
                "<p>Retailer store " +
                retailerStoreName +
                " processed below medicines from your order,</p>";
              patientMessageBody += "<p>" + approvedMedicines + "</p>";
              patientMessageBody += "<p>Stay healthy, stay safe!!</p>";
              patientMessageBody += "<p>Thank you for choosing MedleyMed</p>";

              var email = emailSend.sendEmail(
                // "avinash.a@medleymed.com",
                patientEmail,
                "Retailer Order Process Update",
                patientMessageBody,
                attachmentData
              );

              if (patientPhone) {
                var url =
                  "https://api.textlocal.in/send/?apikey=" +
                  textLocalAPIKey +
                  "&numbers=" +
                  patientPhone +
                  "&sender=" +
                  textLocalSender +
                  "&message=" +
                  patientMessageBody;
                axios
                  .get(url)
                  .then(function (response) {})
                  .catch(function (error) {
                    // console.log(error);
                  });
              }

              res.status(200).send({
                status: 200,
                error: false,
                message: "Order Notification alert sent successfully..",
                mailBody: patientMessageBody,
              });
            } else {
              res.status(200).send({
                status: 200,
                error: false,
                message: "Medicine Length was ZERO..",
              });
            }
          } else {
            res.status(200).send({
              status: 200,
              error: false,
              message: "Patient details not found...",
              data: [],
            });
          }
        });
      } else {
        res.status(200).send({
          status: 200,
          error: false,
          message: "Retailer details not found...",
          data: [],
        });
      }
    })
    .catch((err) => {
      // console.log(err);
      res.status(500).send({
        message: "ERROR",
      });
    });
};
// Ends here
//fetch Order Details based on retailer and date range and order status
exports.retailerOrdersSearch = (req, res) => {
  var retailerId = req.body.retailer_id;
  var orderStatus = req.body.status;
  // var startDate = new Date().toISOString().slice(0, 10);
  // var endDate = new Date().toISOString().slice(0, 10);
  orderTable.hasMany(orderProcessing, { foreignKey: "order_id" });
  orderProcessing.belongsTo(orderTable, { foreignKey: "order_id" });
  ProductMaster.hasMany(orderProcessing, { foreignKey: "medicine_id" });
  orderProcessing.belongsTo(ProductMaster, { foreignKey: "medicine_id" });
  Patient.hasMany(orderTable, { foreignKey: "patient_id" });
  orderTable.belongsTo(Patient, { foreignKey: "patient_id" });

  orderTable.hasMany(cartPrescriptionsTbl, { foreignKey: "order_id" });
  cartPrescriptionsTbl.belongsTo(orderTable, { foreignKey: "order_id" });

  var condition = "";

  if (req.body.start_date && req.body.end_date) {
    if (orderStatus != 0) {
      condition = {
        retailer_id: retailerId,
        order_date: {
          [Op.between]: [req.body.start_date, req.body.end_date],
        },
        order_status: orderStatus,
      };
    } else {
      condition = {
        retailer_id: retailerId,
        order_date: {
          [Op.between]: [req.body.start_date, req.body.end_date],
        },
      };
    }
  } else {
    var endDate = new Date().toISOString().slice(0, 10);
    var date = new Date();
    var date = new Date(date.setDate(date.getDate() - 1));
    var startDate = date.toISOString().slice(0, 10);
    // condition = {
    //   retailer_id: retailerId,
    //   order_date: {
    //     [Op.between]: [startDate, endDate],
    //   },
    //   order_status: orderStatus,
    // };
    if (orderStatus != 0) {
      condition = {
        retailer_id: retailerId,
        order_status: orderStatus,
      };
    } else {
      condition = {
        retailer_id: retailerId,
      };
    }
  }
  orderTable
    .findAll({
      where: condition,
      attributes: { exclude: ["createdAt", "updatedAt"] },
      include: [
        {
          model: orderProcessing,
          required: true,
          attributes: { exclude: ["createdAt", "updatedAt"] },
          include: [
            {
              model: ProductMaster,
              required: false,
              // attributes: [
              //   "id",
              //   "medicineid",
              //   "medicinename",
              //   "manufacturer",
              //   //"form",
              //   "mrp",
              // ],
            },
          ],
        },
        {
          model: cartPrescriptionsTbl,
          required: false,
          attributes: { exclude: ["createdAt", "updatedAt"] },
        },
        {
          model: Patient,
          required: false,
          attributes: ["id", "name", "phone_number"],
        },
      ],
    })
    .then((data) => {
      var condition2 = "";
      if (req.body.start_date && req.body.end_date) {
        condition2 = {
          retailer_id: retailerId,
          order_date: {
            [Op.between]: [req.body.start_date, req.body.end_date],
          },
          // order_status: orderStatus,
        };
      } else {
        // condition2 = {
        //   retailer_id: retailerId,
        //   order_date: {
        //     [Op.between]: [startDate, endDate],
        //   },
        //   order_status: orderStatus,
        // };
        condition2 = {
          retailer_id: retailerId,
          // order_status: orderStatus,
        };
      }
      if (data.length > 0) {
        orderTable
          .findAll({
            where: condition2,
            // where: {
            //   retailer_id: retailerId,
            //   order_date: {
            //     [Op.between]: [startDate, endDate],
            //   },
            // },
          })
          .then((recordsCount) => {
            var total_sale_amount = 0;
            recordsCount.forEach((arg) => {
              total_sale_amount += parseInt(arg.payable_amount);
            });

            res.status(200).send({
              status: 200,
              error: false,
              TotalOnlineSale: total_sale_amount,
              message: "order Details fetched Sucessfully...",
              data: data,
            });
          });
      } else {
        res.status(200).send({
          status: 200,
          error: false,
          TotalOnlineSale: 0,
          message: "order Details fetched Sucessfully...",
          data: data,
        });
      }
    });
};

//get the Patient Order details
exports.getPatientOrderDetails = (req, res) => {
  const patientId = req.params.patientId;

  // console.log(encryption.decryptData('JsVg0dqZzuO3nq2JMl/lrg=='));
  // console.log("Order Id >>> " + orderId);
  // return;
  //cartPrescriptionsTbl
  orderTable.hasMany(orderProcessing, { foreignKey: "order_id" });
  // orderInvoice.belongsTo(orderTable, { foreignKey: "order_id" });
  orderProcessing.belongsTo(orderTable, { foreignKey: "order_id" });

  ProductMaster.hasMany(orderProcessing, { foreignKey: "medicine_id" });
  // orderInvoice.belongsTo(ProductMaster, { foreignKey: "medicine_id" });
  orderProcessing.belongsTo(ProductMaster, { foreignKey: "medicine_id" });

  orderStatus.hasOne(orderTable, { foreignKey: "order_status" });
  orderTable.belongsTo(orderStatus, { foreignKey: "order_status" });

  orderTable.hasOne(cartPrescriptionsTbl, { foreignKey: "order_id" });
  cartPrescriptionsTbl.belongsTo(orderTable, { foreignKey: "order_id" });

  Retailer.hasMany(orderTable, { foreignKey: "retailer_id" });
  orderTable.belongsTo(Retailer, { foreignKey: "retailer_id" });

  Patient.hasMany(orderTable, { foreignKey: "patient_id" });
  orderTable.belongsTo(Patient, { foreignKey: "patient_id" });

  Patient.hasMany(deliveryAddress, { foreignKey: "patient_id" });
  deliveryAddress.belongsTo(Patient, { foreignKey: "patient_id" });

  masterrealtionships.hasOne(Patient, { foreignKey: "relation" });
  Patient.belongsTo(masterrealtionships, { foreignKey: "relation" });

  orderTable
    .findAll({
      where: {
        patient_id: patientId,
      },
      attributes: {
        exclude: ["createdAt", "updatedAt"],
      },
      order: [["id", "DESC"]],
      include: [
        {
          model: orderStatus,
          required: false,
          attributes: {
            exclude: ["createdAt", "updatedAt"],
          },
        },
        {
          model: cartPrescriptionsTbl,
          required: false,
          attributes: {
            exclude: ["createdAt", "updatedAt"],
          },
        },
        {
          // model: orderInvoice,
          model: orderProcessing,
          required: false,
          attributes: {
            exclude: ["createdAt", "updatedAt"],
          },
          include: [
            {
              model: ProductMaster,
              required: false,
            },
          ],
        },
        {
          model: Patient,
          required: false,
          attributes: ["id", "name", "phone_number"],
          include: [
            {
              model: deliveryAddress,
              required: false,
              attributes: {
                exclude: ["createdAt", "updatedAt"],
              },
            },
            { model: masterrealtionships, attributes: ["relation_name"] },
          ],
        },
        {
          model: Retailer,
          required: false,
          attributes: {
            exclude: ["createdAt", "updatedAt"],
          },
        },
      ],
    })
    .then((orderData) => {
      res.status(200).send({
        status: 200,
        error: false,
        message: "Patient Orderdetails Fetched successfully...",
        data: orderData,
      });
    });
};
// Ends here

//get the Patient Order details
exports.lastOrderDetails = (req, res) => {
  ProductMaster.hasMany(orderInvoice, { foreignKey: "medicine_id" });
  orderInvoice.belongsTo(ProductMaster, { foreignKey: "medicine_id" });

  orderInvoice
    .findAll({
      // where: {
      //   patient_id: patientId,
      // },
      // attributes: {
      //   exclude: ["createdAt", "updatedAt"],
      // },
      attributes: ["id"],
      order: [["id", "DESC"]],
      limit: 6,
      include: [
        {
          model: ProductMaster,
          required: false,
          attributes: {
            exclude: ["createdAt", "updatedAt"],
          },
        },
      ],
    })
    .then((orderData) => {
      res.status(200).send({
        status: 200,
        error: false,
        message: "Last Orderdetails Fetched successfully...",
        data: orderData,
      });
    });
};
