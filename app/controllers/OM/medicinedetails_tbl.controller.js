const db = require("../../models");
const MedicineDetails = db.medicine_details;
const Op = db.Sequelize.Op;

const HealthosMedicine = db.tbl_healthos_medicine_data;
const favoriteMedicineTbl = db.favorite_medicine_tbl;

const cartTbl = db.cart_tbl;
const Retailer = db.retailer_registration_tbl;
const retailerStockTbl = db.retailer_stock_tbl;
const orderProcessing = db.order_processing_tbl;
const orderStatus = db.order_status_tbl;
const orderTable = db.order_tbl;
const Users = db.users_tbl;
const Patient = db.patient_tbl;
const deliveryAddress = db.delivery_address_tbl;
const orderInvoice = db.order_invoice_tbl;
const ProductMaster = db.products_master_tbl;

var encryption = require("../../helpers/Encryption");

exports.MedicineSearchDetails = (req, res) => {
  const med_name = req.body.medicine_name;

  ProductMaster.hasMany(cartTbl, { foreignKey: "medicine_id" });
  cartTbl.belongsTo(ProductMaster, { foreignKey: "medicine_id" });

  ProductMaster.hasMany(favoriteMedicineTbl, { foreignKey: "medicine_id" });
  favoriteMedicineTbl.belongsTo(ProductMaster, { foreignKey: "medicine_id" });

  ProductMaster.findAll({
    where: {
      medicinename: {
        [Op.like]: med_name + "%",
      },
    },
    include: [
      {
        model: cartTbl,
        required: false,
      },
      {
        model: favoriteMedicineTbl,
        required: false,
      },
    ],
    order: [["Medicinename", "ASC"]],
    // attributes: ['form','Medicinename', 'Medicineid', 'constituents_name','manufacturer','unit_price','drug_type','mrp','id','status'], //object
  })
    .then((data) => {
      let recordsCount = data.length;
      let displayMessage = "No Matched Records Found...";
      if (recordsCount > 0) {
        displayMessage = "Matched Data fetched Sucessfully";
      }

      res.status(200).send({
        status: 200,
        error: false,
        count: data.length,
        message: displayMessage,
        result: data,
      });
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message ||
          "Some error occurred while retrieving Current Medication.",
      });
    });
};

exports.patientLastOrderDetails = (req, res) => {
  const patientId = req.params.patientId;

  orderTable.hasMany(orderInvoice, { foreignKey: "order_id" });
  orderInvoice.belongsTo(orderTable, { foreignKey: "order_id" });

  ProductMaster.hasMany(orderInvoice, { foreignKey: "medicine_id" });
  orderInvoice.belongsTo(ProductMaster, { foreignKey: "medicine_id" });

  orderStatus.hasOne(orderTable, { foreignKey: "order_status" });
  orderTable.belongsTo(orderStatus, { foreignKey: "order_status" });

  Retailer.hasMany(orderTable, { foreignKey: "retailer_id" });
  orderTable.belongsTo(Retailer, { foreignKey: "retailer_id" });

  Patient.hasMany(orderTable, { foreignKey: "patient_id" });
  orderTable.belongsTo(Patient, { foreignKey: "patient_id" });

  Patient.hasMany(deliveryAddress, { foreignKey: "patient_id" });
  deliveryAddress.belongsTo(Patient, { foreignKey: "patient_id" });

  orderTable
    .findAll({
      where: {
        patient_id: patientId,
      },
      attributes: {
        exclude: ["createdAt", "updatedAt"],
      },
      order: [["id", "DESC"]],
      limit: 1,
      include: [
        {
          model: orderStatus,
          required: false,
          attributes: {
            exclude: ["createdAt", "updatedAt"],
          },
        },
        {
          model: orderInvoice,
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

// Get the Manufacturer Details
exports.getManufacturerDetails = (req, res) => {
  ProductMaster.findAll({
    where: {
      manufacturer: {
        [Op.ne]: "",
      },
    },
    order: [["manufacturer", "ASC"]],
    attributes: ["id", "medicineid", "manufacturer"],
    group: ["manufacturer"],
    // limit: 20,
  })
    .then((data) => {
      res.status(200).send({
        status: 200,
        error: false,
        message: "Product Manufacturer Details fetched Successfully",
        data: data,
      });
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error retrieving manfacturer with id",
      });
    });
};

// Get the Form Details
exports.getFormDetails = (req, res) => {
  ProductMaster.findAll({
    where: {
      form: {
        [Op.ne]: "",
      },
    },
    order: [["id", "ASC"]],
    attributes: ["id", "medicineid", "form"],
    group: ["form"],
  })
    .then((data) => {
      res.status(200).send({
        status: 200,
        error: false,
        message: "Product Form Details fetched Successfully",
        data: data,
      });
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error retrieving form with id",
      });
    });
};
// Ends here

// Get the Form Details
exports.getSearchFromProductMaster = (req, res) => {
  const manufacturerArr = [];
  const formArr = [];

  var options = {};

  if (req.body.manufacturer) {
    req.body.manufacturer.forEach((userVal, index) => {
      manufacturerArr.push(userVal);
    });
  }

  if (req.body.form) {
    req.body.form.forEach((userVal, index) => {
      formArr.push(userVal);
    });
  }

  if (manufacturerArr != "" && formArr != "") {
    var options = {
      manufacturer: { [Op.in]: manufacturerArr },
      form: { [Op.in]: formArr },
    };
  } else if (manufacturerArr != "") {
    var options = {
      manufacturer: { [Op.in]: manufacturerArr },
    };
  } else if (formArr != "") {
    var options = {
      form: { [Op.in]: formArr },
    };
  }

  // var price_sorting = req.body.sorting;
  // if(price_sorting === "low to high")
  // {
  //   var condition = { where:options, order: [['mrp', 'ASC']] }
  // }
  // else if(price_sorting === "high to low")
  // {
  //   var condition ={ where:options, order: [['mrp', 'DESC']] }
  // }  


  // console.log(req);
  // console.log(manufacturerArr);
  // console.log(options);
  // return;

  ProductMaster.findAll({
    where: options,
    attributes: ["id", "medicineid", "medicinename","manufacturer","size","mrp","price_to_stockist","price_to_retail","form","composition"],
  }).then((data) => {
      res.status(200).send({
        status: 200,
        error: false,
        message: "Product Details fetched Successfully",
        data: data,
      });
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error retrieving form with id",
      });
    });
};

// Fetch the Most Ordered Medicines Details
exports.getMostOrderedMedicines = (req, res) => {
  ProductMaster.hasMany(orderInvoice, { foreignKey: "medicine_id" });
  orderInvoice.belongsTo(ProductMaster, { foreignKey: "medicine_id" });

  orderInvoice
    .findAll({
      where: {},
      include: [
        {
          model: ProductMaster,
          required: false,
          attributes: { exclude: ["createdAt", "updatedAt"] },
          group: ["medicine_id"],
        },
      ],
      attributes: ["id", "quantity", "retailer_id", "medicine_id"],
      group: ["medicine_id"],
      limit: 12,
      order: [["quantity", "DESC"]],
    })
    .then((data) => {
      res.status(200).send({
        status: 200,
        error: false,
        message: "Most Ordered medicines fetched successfully..",
        data: data,
      });
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message ||
          "Some error occurred while retrieving Ordered Medication.",
      });
    });
};
// Ends here

// exports.create = (req,res)=>{
//     if (!req.body) {
//         res.status(200).send({"message":"Content cannot be empty"})
//     } else if (!req.body.trail_type) {
//         res.status(200).send({"message":"Medicine Details  cannot be empty"})
//     } else {
//         const MedicineDetailsVal = {
//             'user_id' : req.body.user_id,
//             'trail_type' : req.body.trail_type,
//             'trail_message' : req.body.trail_message,
// 			      'status': 1
//         }

//         MedicineDetails.create(MedicineDetailsVal,(err,data)=>{
//             if (err) {
// 				console.log(err);
//                 res.status(200).send({"error":`${err} while creating Medicine Details Trail`})
//             }
//         })
// 		res.status(200).send({
// 			"message": "Medicine Details  Created Successfully"
// 		});
//     }
// };

// // Retrieve all Medicine Details from the Medicine Details.
// exports.findAll = (req, res) => {

//     let message = "";
//   // console.log(req.body);
//   // return;
//   MedicineDetails.findAll({
//     where: {  },
//   })
//     .then((data) => {
//       let recordsCount = data.length;

//       message = "Patient Medicine fetched successfully";
//       if (recordsCount == 0) {
//         message = "No records found";
//       }
//       res.status(200).send({
//         status: 200,
//         error: false,
//         message: message,
//         data: data,
//       });
//     })
//     .catch((err) => {
//       res.status(500).send({
//         message:
//           err.message || "Some error occurred while retrieving Appointments.",
//       });
//     });
// };

// // Find a single Medicine Details with an id
// exports.findOne = (req, res) => {
//   const id = req.params.id;

//   MedicineDetails.findByPk(id)
//     .then(data => {
//       res.send(data);
//     })
//     .catch(err => {
//       res.status(200).send({
//         message: "Error retrieving Medicine Details  with id=" + id
//       });
//     });
// };

// // Update a Medicine Details Trail by the id in the req
// exports.update = (req, res) => {
//   const id = req.params.id;

//   if(req.body.data) {
// 	  req.body = req.body.data;
//   }

//   MedicineDetails.update(req.body, {
//     where: { id: id }
//   })
//     .then(num => {
//       if (num == 1) {
//         res.send({
//           message: "Medicine Details  was updated successfully."
//         });
//       } else {
//         res.send({
//           message: `Cannot update Medicine Details  with id=${id}. Maybe Medicine Details  was not found or req.body is empty!`
//         });
//       }
//     })
//     .catch(err => {
//       res.status(200).send({
//         message: "Error updating Medicine Details  with id=" + id
//       });
//     });
// };

// // Delete a Medicine Details Trail with the specified id in the req
// exports.delete = (req, res) => {
//   const id = req.params.id;

//   MedicineDetails.destroy({
//     where: { id: id }
//   })
//     .then(num => {
//       if (num == 1) {
//         res.send({
//           message: "Medicine Details  was deleted successfully!"
//         });
//       } else {
//         res.send({
//           message: `Cannot delete Medicine Details  with id=${id}. Maybe Medicine Details  was not found!`
//         });
//       }
//     })
//     .catch(err => {
//       res.status(200).send({
//         message: "Could not delete Medicine Details  with id=" + id
//       });
//     });
// };

// // Delete all Medicine Details from the database.
// exports.deleteAll = (req, res) => {
//     MedicineDetails.destroy({
//     where: {},
//     truncate: false
//   })
//     .then(nums => {
//       res.send({ message: `${nums} Medicine Details were deleted successfully!` });
//     })
//     .catch(err => {
//       res.status(200).send({
//         message:
//           err.message || "Some error occurred while removing all Medicine Details."
//       });
//     });
// };

// exports.MedicineSearchDetails = (req, res) => {

//    // const medicinename = encryption.encryptData(req.params.name);
// 		var condition = req.body.searchname ? { medicine_name: { [Op.like]: `%${req.body.searchname}%` } } : null;
//     let message = "";

//   // return;
//   MedicineDetails.findAll(
//     { where: condition, attributes: { exclude: ["createdAt", "updatedAt"] } }
//   )
//     .then((data) => {
//       let recordsCount = data.length;

//       message = "Patient Medicine fetched successfully";
//       if (recordsCount == 0) {
//         message = "No records found";
//       }
//       res.status(200).send({
//         status: 200,
//         error: false,
//         message: message,
//         count:recordsCount,
//         data: data,
//       });
//     })
//     .catch((err) => {
//       res.status(500).send({
//         message:
//           err.message || "Some error occurred while retrieving Appointments.",
//       });
//     });
// };
