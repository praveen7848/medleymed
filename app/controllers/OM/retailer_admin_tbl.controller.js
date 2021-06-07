const db = require("../../models");

const cartTbl = db.cart_tbl;
const Retailer = db.retailer_registration_tbl;
const retailerStockTbl = db.retailer_stock_tbl;
const HealthosMedicine = db.tbl_healthos_medicine_data;
const ProductMaster = db.products_master_tbl;
const orderProcessing = db.order_processing_tbl;
const orderInvoice = db.order_invoice_tbl;
const OrderStatus = db.order_status_tbl;
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

//get the Retailer Order process Dashboard Details...
exports.getAdminOrderDashboardCount = (req, res) => {
  const retailerId = req.body.retailer_id;
  const startDate = req.body.start_date;
  const endDate = req.body.end_date;

  let pendingOrder = 0;
  let shippedOrder = 0;
  let cancelledOrder = 0;
  let deliveredOrder = 0;
  let prescriptionReview = 0;

  if (req.body.retailerId) {
    var wherependingCondition = {
      order_status: 1,
      retailer_id: retailerId,
    };
    var whereCompleteCondition = {
      retailer_id: retailerId,
    };
    var wherePrescriptionReviewedCondition = {
      order_status: 2,
      retailer_id: retailerId,
    };
    var whereProcessingdCondition = {
      order_status: 3,
      retailer_id: retailerId,
    };
    var whereShippingCondition = {
      order_status: 4,
      retailer_id: retailerId,
    };
    var whereDeliveredCondition = {
      order_status: 5,
      retailer_id: retailerId,
    };
    var whereCancelledCondition = {
      order_status: 6,
      retailer_id: retailerId,
    };
  } else if (retailerId && startDate && endDate) {
    var wherependingCondition = {
      order_status: 1,
      retailer_id: retailerId,
      order_date: {
        [Op.between]: [startDate, endDate],
      },
    };
    var whereCompleteCondition = {
      retailer_id: retailerId,
      order_date: {
        [Op.between]: [startDate, endDate],
      },
    };
    var wherePrescriptionReviewedCondition = {
      order_status: 2,
      retailer_id: retailerId,
      order_date: {
        [Op.between]: [startDate, endDate],
      },
    };
    var whereProcessingdCondition = {
      order_status: 3,
      retailer_id: retailerId,
      order_date: {
        [Op.between]: [startDate, endDate],
      },
    };
    var whereShippingCondition = {
      order_status: 4,
      retailer_id: retailerId,
      order_date: {
        [Op.between]: [startDate, endDate],
      },
    };
    var whereDeliveredCondition = {
      order_status: 5,
      retailer_id: retailerId,
      order_date: {
        [Op.between]: [startDate, endDate],
      },
    };
    var whereCancelledCondition = {
      order_status: 6,
      retailer_id: retailerId,
      order_date: {
        [Op.between]: [startDate, endDate],
      },
    };
  } 
  else {
    var wherependingCondition = {
      order_status: 1,
    };
    var whereCompleteCondition = {};
    var wherePrescriptionReviewedCondition = {
      order_status: 2,
    };
    var whereProcessingdCondition = {
      order_status: 3,
    };
    var whereShippingCondition = {
      order_status: 4,
    };
    var whereDeliveredCondition = {
      order_status: 5,
    };
    var whereCancelledCondition = {
      order_status: 6,
    };
  }

 const pendingOrders = orderTable.findAll({
    where: wherependingCondition,
    attributes: {
      exclude: ["createdAt", "updatedAt"],
    },
  });

  const completeOrders = orderTable.findAll({
    where: whereCompleteCondition,
    attributes: {
      exclude: ["createdAt", "updatedAt"],
    },
  });

  const prescriptionReviewedOrders = orderTable.findAll({
    where: wherePrescriptionReviewedCondition,
    attributes: {
      exclude: ["createdAt", "updatedAt"],
    },
  });

  const processingOrders = orderTable.findAll({
    where: whereProcessingdCondition,
    attributes: {
      exclude: ["createdAt", "updatedAt"],
    },
  });

  const shippingOrders = orderTable.findAll({
    where: whereShippingCondition,
    attributes: {
      exclude: ["createdAt", "updatedAt"],
    },
  });

  const deliveredOrders = orderTable.findAll({
    where: whereDeliveredCondition,
    attributes: {
      exclude: ["createdAt", "updatedAt"],
    },
  });

  const cancelledOrders = orderTable.findAll({
    where: whereCancelledCondition,
    attributes: {
      exclude: ["createdAt", "updatedAt"],
    },
  });

  Promise.all([
    pendingOrders,
    completeOrders,
    prescriptionReviewedOrders,
    processingOrders,
    shippingOrders,
    deliveredOrders,
    cancelledOrders,
  ])
    .then((responses) => {
      let completeOrderArray = [
        {
          all: responses[1].length,
          pending: responses[0].length,
          reviewed: responses[2].length,
          processing: responses[3].length,
          shipping: responses[4].length,
          delivered: responses[5].length,
          cancelled: responses[6].length,
        },
      ];
      res.status(200).send({
        status: 200,
        error: false,
        message: "Order dashboard Details Count Fetched successfully...",
        data: completeOrderArray,
      });
    })
    .catch((err) => {
      console.log("**********ERROR RESULT****************");
      console.log(err);
    });
};
// Ends here

//get the Retailer Order process Dashboard Details...
exports.getAdminOrderDashboardDetails = (req, res) => {
  const retailerId = req.body.retailer_id;
  const startDate = req.body.start_date;
  const endDate = req.body.end_date;
  const orderStatus = req.body.order_status;
  const orderSearchId = req.body.order_search_id;
  const pageId = req.body.page_number ? req.body.page_number : 1 ;

  let maxLength = 20;
  let count = (pageId - 1) * maxLength;

  var condition = {};
  if(retailerId == "" && startDate == "" && endDate == "" && orderStatus == "" && orderSearchId == "") {
    condition = { };
  }
  else if(retailerId != "" && startDate == "" && endDate == "" && orderStatus == "" && orderSearchId == "") {
      condition = {
        retailer_id: retailerId,
      };
    }
    else if (retailerId != "" && startDate == "" && endDate == "" && orderStatus != "" && orderSearchId == "") {
      condition = {
        retailer_id: retailerId,
        order_status: orderStatus,
        
      };
    }  
    else if (retailerId != "" && startDate != "" && endDate != "" && orderStatus == "" && orderSearchId == "") {
      condition = {
        retailer_id: retailerId,
        order_date: {
          [Op.between]: [startDate, endDate],
        },
      };
    }
    else if (retailerId != "" && startDate != "" && endDate != "" && orderStatus != "" && orderSearchId == "") {
      condition = {
        retailer_id: retailerId,
        order_date: {
          [Op.between]: [startDate, endDate],
        },
        order_status: orderStatus,
      };
    }
    else if (retailerId != "" && startDate != "" && endDate != "" && orderStatus != "" && orderSearchId != "") {
      condition = {
        retailer_id: retailerId,
        order_date: {
          [Op.between]: [startDate, endDate],
        },
        order_status: orderStatus,
        id : orderSearchId,
      };
    }
    else if (retailerId == "" && startDate == "" && endDate == "" && orderStatus != "" && orderSearchId != "") {
      condition = {
        order_status: orderStatus,
        id : orderSearchId,
      };
    }
    else if (retailerId == "" && startDate == "" && endDate == "" && orderStatus == "" && orderSearchId != "") {
      condition = {
        id : orderSearchId,
      };
    }


    else if (retailerId == "" && startDate != "" && endDate != "" && orderStatus != "" && orderSearchId == "") {
      condition = {
        order_status: orderStatus,
        order_date: {
          [Op.between]: [startDate, endDate]
        },

      };
    }

    else if (retailerId == "" && startDate == "" && endDate == "" && orderStatus != "" && orderSearchId == "") {
      condition = {
        order_status: orderStatus,
      };
    }


  orderTable.hasMany(orderProcessing, { foreignKey: "order_id" });
  orderProcessing.belongsTo(orderTable, { foreignKey: "order_id" });

  orderTable.hasMany(cartPrescriptionsTbl, { foreignKey: "order_id" });
  cartPrescriptionsTbl.belongsTo(orderTable, { foreignKey: "order_id" });

  ProductMaster.hasMany(orderProcessing, { foreignKey: "medicine_id" });
  orderProcessing.belongsTo(ProductMaster, { foreignKey: "medicine_id" });

  Patient.hasMany(orderTable, { foreignKey: "patient_id" });
  orderTable.belongsTo(Patient, { foreignKey: "patient_id" });

  Retailer.hasMany(orderTable, { foreignKey: "retailer_id" });
  orderTable.belongsTo(Retailer, { foreignKey: "retailer_id" });

  OrderStatus.hasOne(orderTable, { foreignKey: "order_status" });
  orderTable.belongsTo(OrderStatus, { foreignKey: "order_status" });


  orderTable
    .findAll({
      where: condition,
      offset: count,
      limit: maxLength,
      attributes: { exclude: ["createdAt", "updatedAt"] },
      // order: [["id", "DESC"]],
      include: [
        {
          model: orderProcessing,
          required: true,
          attributes: { exclude: ["createdAt", "updatedAt"] },
          include: [
            {
              model: ProductMaster,
              required: false,
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
        {
          model: Retailer,
          required: false,
          attributes: {
            exclude: ["createdAt", "updatedAt"],
          },
        },
        {
          model: OrderStatus,
          required: false,
          attributes: {
            exclude: ["createdAt", "updatedAt"],
          },
        },
      ],
    })
    .then((data) => {
      // Amount Calculation Starts
      var total_orders_amount = 0;
      var totalAmountorder = [];
      var commission = 0.00;
      var percentageCommission = "";
      if(data.length > 0){
        data.forEach((arg) => {
          if(arg.total_paid != null && arg.total_paid !=""){
            totalAmountorder.push(arg.total_paid.replace(',',''));
            // total_orders_amount += parseFloat(arg.total_paid);
          }
          if(arg.retailer_registration_tbl){
            if(arg.retailer_registration_tbl.commission!= null){
              percentageCommission = arg.retailer_registration_tbl.commission / 100 ;
            }
          }
        });
        
total_orders_amount = totalAmountorder.reduce((a, b) => a + b, 0);
total_orders_amount = totalAmountorder.map(Number);         
if(total_orders_amount.length > 0)
{
  total_orders_amount = total_orders_amount.reduce(function(previousValue, currentValue, index, array) {
  return previousValue + currentValue;
});
}
if(total_orders_amount > 0 && percentageCommission > 0){
           commission = total_orders_amount * percentageCommission;
}
}
// Ends here
if(Array.isArray(total_orders_amount) === true){
        total_orders_amount = 0;
}
// console.log(total_orders_amount);
// console.log(Array.isArray(total_orders_amount));
// return;
res.status(200).send({
        status: 200,
        error: false,
        itemsCount: data.length,
        total_orders : total_orders_amount.toFixed(2),
        total_commission : commission.toFixed(2),
        totalAmountorder:totalAmountorder,
        message: "order Details fetched Sucessfully...",
        data: data,
      });
      
    });
};
// Ends here


//get the Retailer Order details
exports.getAdminOrderDetail = (req, res) => {
  const orderId = req.params.orderId;

  orderTable.hasMany(orderProcessing, { foreignKey: "order_id" });
  orderProcessing.belongsTo(orderTable, { foreignKey: "order_id" });

  ProductMaster.hasMany(orderProcessing, { foreignKey: "medicine_id" });
  orderProcessing.belongsTo(ProductMaster, { foreignKey: "medicine_id" });

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
              model: ProductMaster,
              required: false,
              order: [["medicinename", "ASC"]],
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
      res.status(200).send({
        status: 200,
        error: false,
        items: orderData.length,
        message: "Admin Orderdetails Fetched successfully...",
        data: orderData,
      });
    });
};
