const db = require("../../models");

const retailerProductTbl = db.retailer_products_tbl;
const retailerStockTbl = db.retailer_stock_tbl;
const HealthosMedicine = db.tbl_healthos_medicine_data;

const ProductMaster = db.products_master_tbl;
const shortageBookTbl = db.shortage_book_tbl;
const Retailer = db.retailer_registration_tbl;
const finalOrder = db.retailer_finalorder_tbl;

const Op = db.Sequelize.Op;
const AuditTrail = db.audit_trails;
var encryption = require("../../helpers/Encryption");
const moment = require("moment");

// Create a Product and Cart Details
exports.create = (req, res) => {
  var user_type = "Admin";
  if (!req.body) {
    res.status(400).send({ message: "Content cannot be empty" });
  } else {
    const productVal = {
      retailer_id: req.body.retailer_id,
      medicine_id: req.body.medicine_id,
    };

    retailerProductTbl.count({ where: productVal }).then((count) => {
      if (count === 0) {
        retailerProductTbl
          .create(productVal)
          .then((data) => {
            const stockVal = {
              retailer_id: req.body.retailer_id,
              product_id: data.id,
              medicine_id: req.body.medicine_id,
              batch: req.body.batch,
              expiry_date: req.body.expiry_date,
              quantity: req.body.quantity,
              mrp: req.body.mrp,
              commission: req.body.commission,
              discount: req.body.discount,
              vat: req.body.vat,
              CGST: req.body.CGST,
              SGST: req.body.SGST,
              IGST: req.body.IGST,
            };
            retailerStockTbl.create(stockVal).then((data) => {
              const auditTrailVal = {
                user_id: req.body.retailer_id,
                trail_type: "Admin",
                trail_message: "Retailer Product Details created Successfully",
                status: 1,
              };
              AuditTrail.create(auditTrailVal, (err, data) => {});
              res.status(200).send({
                status: 200,
                error: false,
                message: "Retailer Product Details Created Successfully",
              });
            });
          })
          .catch((err) => {
            console.log(err);
            res.status(500).send({
              message:
                err.message ||
                "Some error occurred while retrieving Retailer Product.",
            });
          });
      } else {
        retailerProductTbl
          .findAll({
            where: productVal,
            attributes: { exclude: ["createdAt", "updatedAt"] },
          })
          .then((resData) => {
            let productId = resData[0].id;

            const stockVal = {
              retailer_id: req.body.retailer_id,
              product_id: productId,
              medicine_id: req.body.medicine_id,
              batch: req.body.batch,
              expiry_date: req.body.expiry_date,
              quantity: req.body.quantity,
              mrp: req.body.mrp,
              commission: req.body.commission,
              discount: req.body.discount,
              vat: req.body.vat,
              CGST: req.body.CGST,
              SGST: req.body.SGST,
              IGST: req.body.IGST,
            };

            const stockCountValue = {
              retailer_id: req.body.retailer_id,
              product_id: productId,
              batch: req.body.batch,
            };

            retailerStockTbl.count({ where: stockCountValue }).then((count) => {
              if (count === 0) {
                retailerStockTbl.create(stockVal).then((data) => {
                  const auditTrailVal = {
                    user_id: req.body.retailer_id,
                    trail_type: "Admin",
                    trail_message:
                      "Retailer Product Details created Successfully",
                    status: 1,
                  };
                  AuditTrail.create(auditTrailVal, (err, data) => {});
                  res.status(200).send({
                    status: 200,
                    error: false,
                    message: "Retailer Product Details Created Successfully",
                  });
                });
              } else {
                res.status(200).send({
                  status: 200,
                  error: false,
                  message: "Batch Id already Exists..",
                });
              }
            });
          });
      }
    });
  }
};

// Create a Stock Details
exports.createStock = (req, res) => {
  var user_type = "Admin";
  if (!req.body) {
    res.status(400).send({ message: "Content cannot be empty" });
  } else {
    const stockCountValue = {
      retailer_id: req.body.retailer_id,
      product_id: req.body.product_id,
      medicine_id: req.body.medicine_id,
      batch: req.body.batch,
    };

    const stockVal = {
      retailer_id: req.body.retailer_id,
      product_id: req.body.product_id,
      medicine_id: req.body.medicine_id,
      batch: req.body.batch,
      expiry_date: req.body.expiry_date,
      quantity: req.body.quantity,
      mrp: req.body.mrp,
      commission: req.body.commission,
      discount: req.body.discount,
      vat: req.body.vat,
      CGST: req.body.CGST,
      SGST: req.body.SGST,
      IGST: req.body.IGST,
    };

    retailerStockTbl.count({ where: stockCountValue }).then((count) => {
      if (count === 0) {
        retailerStockTbl.create(stockVal).then((data) => {
          const auditTrailVal = {
            user_id: req.body.retailer_id,
            trail_type: "Admin",
            trail_message: "Retailer Stock Details created Successfully",
            status: 1,
          };
          AuditTrail.create(auditTrailVal, (err, data) => {});
          res.status(200).send({
            status: 200,
            error: false,
            message: "Retailer Stock Details Created Successfully",
          });
        });
      } else {
        res.status(200).send({
          status: 200,
          error: false,
          message: "Already added the same Medicine Batch to the Retailer...",
        });
      }
    });
  }
};

// find all Medicine Details
exports.getStock = (req, res) => {
  let rowId = req.params.rowId;

  ProductMaster.hasMany(retailerStockTbl, { foreignKey: "medicine_id" });
  retailerStockTbl.belongsTo(ProductMaster, { foreignKey: "medicine_id" });

  retailerStockTbl
    .findAll({
      where: {
        id: rowId,
      },
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
          //   "form",
          //   "unit_price",
          // ],
        },
      ],
    })
    .then((data) => {
      let cartCount = data.length;
      const auditTrailVal = {
        user_id: req.params.rowId,
        trail_type: "Admin",
        trail_message: "Stock Details fetched Successfully",
        status: 1,
      };
      AuditTrail.create(auditTrailVal, (err, data) => {});
      res.status(200).send({
        status: 200,
        error: false,
        message: "Stock Details fetched Successfully",
        data: data,
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send({
        message:
          err.message ||
          "Some error occurred while retrieving Stock Details List.",
      });
    });
};

// update Stock Details
exports.updateStock = (req, res) => {
  const id = req.params.id;
  var user_type = "Admin";
  retailerStockTbl
    .update(req.body, {
      where: { id: id },
    })
    .then((num) => {
      if (num == 1) {
        const auditTrailVal = {
          user_id: id,
          trail_type: "Admin",
          trail_message: "Stock Details updated Successfully",
          status: 1,
        };
        AuditTrail.create(auditTrailVal, (err, data) => {});
        res.status(200).send({
          status: 200,
          error: false,
          message: "Stock Details Updated Successfully",
        });
      } else {
        res.send({
          message: `Cannot update Stock Details with id=${id}. Maybe Stock Details was not found or req.body is empty!`,
        });
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send({
        message: "Error updating Stock Details with id=" + id,
      });
    });
};

// Delete a Product Details Based on ID
exports.deleteProductStock = (req, res) => {
  const retailerId = req.params.retailerId;
  const medicineId = req.params.medicineId;
  const rowId = req.params.rowId;
  var user_type = "Admin";
  console.log(retailerId+" retailerId "+medicineId+" medicineId "+rowId+" rowId ");
  // return;
  // retailerProductTbl
  //   .destroy({
  //     where: {
  //       id: rowId,
  //       retailer_id: retailerId,
  //     },
  //   })
  //   .then((num) => {
  //     if (num == 1) {
        // retailerStockTbl
        //   .destroy({
        //     where: {
        //       id: rowId,
        //       retailer_id: retailerId,
        //     },
        //   })
        //   .then((num) => {
        //     if (num == 1) {
        //       const auditTrailVal = {
        //         user_id: retailerId,
        //         trail_type: "Admin",
        //         trail_message: "Product Stock Detail Deleted Successfully",
        //         status: 1,
        //       };
        //       AuditTrail.create(auditTrailVal, (err, data) => {});
        //       res.status(200).send({
        //         status: 200,
        //         error: false,
        //         message: "Product Stock Detail Deleted Successfully",
        //       });
        //     }
        //   });
      // } else {
      //   res.send({
      //     message: `Cannot delete stock Detail with id=${retailerId}. Maybe stock Detail was not found!`,
      //   });
      // }
    // })
    // .catch((err) => {
    //   console.log(err);
    //   res.status(500).send({
    //     message: "Could not delete stock Detail with id=" + retailerId,
    //   });
    // });
    let countCondition = {
      retailer_id: retailerId,
      medicine_id: medicineId,
    };
    retailerStockTbl
      .destroy({
        where: {
          id: rowId,
          retailer_id: retailerId,
        },
      })
      .then((num) => {
        if (num == 1) {
          retailerStockTbl.count({ where: countCondition }).then((count) => {
            if (count === 0) {
              retailerProductTbl
                .destroy({
                  where: countCondition,
                })
                .then((num) => {
                  if (num == 1) {
                    //  Action Performed
                  }
                });
            }
          });
          const auditTrailVal = {
            user_id: retailerId,
            trail_type: "Admin",
            trail_message: "Product Stock Detail Deleted Successfully",
            status: 1,
          };
          AuditTrail.create(auditTrailVal, (err, data) => {});
          res.status(200).send({
            status: 200,
            error: false,
            message: "Product Stock Detail Deleted Successfully",
          });
        }
      });
};

// find all Medicine Details
exports.findAllDetails = (req, res) => {
  let medicineId = req.params.medicineId;

  retailerProductTbl.hasMany(retailerStockTbl, { foreignKey: "product_id" });
  retailerStockTbl.belongsTo(retailerProductTbl, { foreignKey: "product_id" });

  ProductMaster.hasMany(retailerProductTbl, { foreignKey: "medicine_id" });
  retailerProductTbl.belongsTo(ProductMaster, { foreignKey: "medicine_id" });

  retailerProductTbl
    .findAll({
      where: {
        medicine_id: medicineId,
      },
      attributes: { exclude: ["createdAt", "updatedAt"] },
      include: [
        {
          model: retailerStockTbl,
          required: false,
          attributes: { exclude: ["createdAt", "updatedAt"] },
        },
        {
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
    })
    .then((data) => {
      let cartCount = data.length;
      const auditTrailVal = {
        user_id: req.params.medicineId,
        trail_type: "Admin",
        trail_message: "Stock Details fetched Successfully",
        status: 1,
      };
      AuditTrail.create(auditTrailVal, (err, data) => {});
      res.status(200).send({
        status: 200,
        error: false,
        message: "Stock Details fetched Successfully",
        data: data,
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send({
        message:
          err.message ||
          "Some error occurred while retrieving Stock Details List.",
      });
    });
};

// find all Retailer Product Detaile
exports.retailerProductDetails = (req, res) => {
  retailerProductTbl.hasMany(retailerStockTbl, { foreignKey: "product_id" });
  retailerStockTbl.belongsTo(retailerProductTbl, { foreignKey: "product_id" });

  ProductMaster.hasMany(retailerProductTbl, { foreignKey: "medicine_id" });
  retailerProductTbl.belongsTo(ProductMaster, { foreignKey: "medicine_id" });

  retailerProductTbl
    .findAll({
      attributes: { exclude: ["createdAt", "updatedAt", "id"] },
      include: [
        {
          model: retailerStockTbl,
          required: false,
          attributes: { exclude: ["createdAt", "updatedAt"] },
        },
        {
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
    })
    .then((data) => {
      let cartCount = data.length;
      res.status(200).send({
        status: 200,
        error: false,
        message: "All Stock Details fetched Successfully",
        data: data,
      });
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message ||
          "Some error occurred while retrieving Stock Details List.",
      });
    });
};

// find all Retailer Product Detaile
exports.retailerWiseProductDetails = (req, res) => {
  let retailerId = req.params.retailerId;

  retailerProductTbl.hasMany(retailerStockTbl, { foreignKey: "product_id" });
  retailerStockTbl.belongsTo(retailerProductTbl, { foreignKey: "product_id" });

  ProductMaster.hasMany(retailerProductTbl, { foreignKey: "medicine_id" });
  retailerProductTbl.belongsTo(ProductMaster, { foreignKey: "medicine_id" });

  retailerProductTbl
    .findAll({
      where: {
        retailer_id: retailerId,
      },
      attributes: { exclude: ["createdAt", "updatedAt"] },
      include: [
        {
          model: retailerStockTbl,
          required: false,
          attributes: { exclude: ["createdAt", "updatedAt"] },
        },
        {
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
    })
    .then((data) => {
      let cartCount = data.length;
      const auditTrailVal = {
        user_id: req.params.retailerId,
        trail_type: "Admin",
        trail_message: "Retailer Stock Details fetched Successfully",
        status: 1,
      };
      AuditTrail.create(auditTrailVal, (err, data) => {});
      res.status(200).send({
        status: 200,
        error: false,
        message: "Retailer Stock Details fetched Successfully",
        data: data,
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send({
        message:
          err.message ||
          "Some error occurred while retrieving Retailer Stock Details List.",
      });
    });
};

// find all Retailer Product Detaile
exports.medicineSearchDetails = (req, res) => {
  let searchMedicine = req.params.search_medicine;
  ProductMaster.findAll({
    where: {
      medicinename: {
        [Op.like]: "%" + searchMedicine + "%",
      },
    },
    order: [["medicinename", "ASC"]],
    // attributes: [
    //   "medicinename",
    //   "Medicineid",
    //   "constituents_name",
    //   "id",
    //   "size",
    //   "form",
    //   "manufacturer",
    // ], //object
    limit: 20,
  })
    .then((resData) => {
      let result = [];
      resData.forEach((arg) => {
        let obj = {};
        obj.id = arg.id;
        obj.medicineName =
          arg.medicinename + " | " + arg.size + " | " + arg.manufacturer;
        result.push(obj);
      });
      res.status(200).send({
        status: 200,
        error: false,
        message: "Search Medicine fetched Sucessfully",
        data: result,
      });
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message ||
          "Some error occurred while retrieving Search Medication.",
      });
    });
};

// find all Retailer Wise low stock Details
exports.retailerWiseLowStockDetails = (req, res) => {
  let retailerId = req.params.retailerId;

  retailerProductTbl.hasMany(retailerStockTbl, { foreignKey: "product_id" });
  retailerStockTbl.belongsTo(retailerProductTbl, { foreignKey: "product_id" });

  ProductMaster.hasMany(retailerProductTbl, { foreignKey: "medicine_id" });
  retailerProductTbl.belongsTo(ProductMaster, { foreignKey: "medicine_id" });
  
  let countCondition = {
    retailer_id: retailerId,
    quantity: {
      [Op.lt]: 5,
    },
  };

  retailerProductTbl
    .findAll({
      where:{
        retailer_id: retailerId,
      },
      attributes: { exclude: ["createdAt", "updatedAt", "id"] },
      include: [
        {
          model: retailerStockTbl,
          required: true,
          attributes: { exclude: ["createdAt", "updatedAt"] },
          where: countCondition,
        },
        {
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
    })
    .then((data) => {
      let cartCount = data.length;
      const auditTrailVal = {
        user_id: req.params.retailerId,
        trail_type: "Admin",
        trail_message: "Retailer Low Stock Details fetched Successfully",
        status: 1,
      };
      AuditTrail.create(auditTrailVal, (err, data) => {});
      retailerStockTbl
      .count({ where: countCondition })
      .then((stock_count) => {
        res.status(200).send({
          status: 200,
          error: false,
          count: stock_count,
          message: "Retailer Low Stock Details fetched Successfully",
          data: data,
        });
      });
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message ||
          "Some error occurred while retrieving Retailer Stock Details List.",
      });
    });
};

// find all Retailer Wise Expiry stock Details
exports.retailerWiseExpiryStockDetails = (req, res) => {
  let retailerId = req.params.retailerId;

  retailerProductTbl.hasMany(retailerStockTbl, { foreignKey: "product_id" });
  retailerStockTbl.belongsTo(retailerProductTbl, { foreignKey: "product_id" });

  ProductMaster.hasMany(retailerProductTbl, { foreignKey: "medicine_id" });
  retailerProductTbl.belongsTo(ProductMaster, { foreignKey: "medicine_id" });

  let expiryCountCondition = {
    retailer_id: retailerId,
    expiry_date: {
      [Op.lt]: moment().format("YYYY-MM-DD"),
    },
  };

  retailerProductTbl
    .findAll({
      where:{
        retailer_id: retailerId,
      },
      attributes: { exclude: ["createdAt", "updatedAt", "id"] },
      include: [
        {
          model: retailerStockTbl,
          required: true,
          attributes: { exclude: ["createdAt", "updatedAt"] },
          where: expiryCountCondition,
        },
        {
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
    })
    .then((data) => {
      let cartCount = data.length;
      const auditTrailVal = {
        user_id: req.params.retailerId,
        trail_type: "Admin",
        trail_message: "Retailer Expiry Stock Details fetched Successfully",
        status: 1,
      };
      AuditTrail.create(auditTrailVal, (err, data) => {});

      retailerStockTbl
      .count({ where: expiryCountCondition })
      .then((expiry_count) => {
        res.status(200).send({
          status: 200,
          error: false,
          count: expiry_count,
          message: "Retailer Expiry Stock Details fetched Successfully",
          data: data,
        });
      });
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message ||
          "Some error occurred while retrieving Retailer Expiry Stock Details List.",
      });
    });
};

// find all Retailer Wise Stock Search Details
exports.retailerStockSearchDetails = (req, res) => {
  let retailerId = req.body.retailerId;
  let medicineName = req.body.medicineName;
  let searchType = req.body.search_type;

var master_where_options = {};
var stock_where = {};
if (searchType === "medicine_search") {
  master_where_options = {
    medicinename: {
      [Op.like]: "%" + medicineName + "%",
    },
  };
} else if (searchType === "low_stock") {
  master_where_options = {
    medicinename: {
      [Op.like]: "%" + medicineName + "%",
    },
  };
  stock_where = {
    retailer_id: retailerId,
    quantity: {
      [Op.lt]: 5,
    },

  };
} else if (searchType === "expiry_stock") {
  master_where_options = {
    medicinename: {
      [Op.like]: "%" + medicineName + "%",
    },
  };
  stock_where = {
    retailer_id: retailerId,
    expiry_date: {
      [Op.lt]: moment().format("YYYY-MM-DD"),
    },
  };
} else if (searchType === "empty_stock") {
  master_where_options = {
    medicinename: {
      [Op.like]: "%" + medicineName + "%",
    },
  };
  stock_where = {
    retailer_id: retailerId,
    [Op.or]: [
      {
        expiry_date: {
          [Op.lt]: moment().format("YYYY-MM-DD"),
        },
      },
      {
        quantity: {
          [Op.eq]: 0,
        },
      },
    ],
  };
}
  console.log("===Medicine======", medicineName);

  ProductMaster.hasMany(retailerStockTbl, { foreignKey: "medicine_id" });
  retailerStockTbl.belongsTo(ProductMaster, { foreignKey: "medicine_id" });

  ProductMaster.hasMany(retailerProductTbl, { foreignKey: "medicine_id" });
  retailerProductTbl.belongsTo(ProductMaster, { foreignKey: "medicine_id" });

  ProductMaster.findAll({
    where: master_where_options,
    include: [
      {
        model: retailerProductTbl,
        required: true,
        attributes: { exclude: ["createdAt", "updatedAt"] },
        where: {
          retailer_id: retailerId,
        },
      },
      {
        model: retailerStockTbl,
        where: stock_where,
        required: true,
        attributes: { exclude: ["createdAt", "updatedAt"] },
      },
    ],
  }).then((data) => {
    res.status(200).send({
      status: 200,
      error: false,
      message: "Retailer Stock search Details fetched Successfully",
      data: data,
    });
  });



  // ProductMaster.hasMany(retailerStockTbl, { foreignKey: "medicine_id" });
  // retailerStockTbl.belongsTo(ProductMaster, { foreignKey: "medicine_id" });

  // ProductMaster.hasMany(retailerProductTbl, { foreignKey: "medicine_id" });
  // retailerProductTbl.belongsTo(ProductMaster, { foreignKey: "medicine_id" });

  // ProductMaster.findAll({
  //   where: {
  //     retailer_id: retailerId,
  //     medicinename: {
  //       [Op.like]: "%" + medicineName + "%",
  //     },
  //   },
  //   // attributes: [
  //   //   "id",
  //   //   "medicineid",
  //   //   "name",
  //   //   "manufacturer",
  //   //   "form",
  //   //   "unit_price",
  //   // ],
  //   include: [
  //     {
  //       model: retailerProductTbl,
  //       required: true,
  //       attributes: { exclude: ["createdAt", "updatedAt"] },
  //       where: {
  //         retailer_id: retailerId,
  //       },
  //     },
  //     {
  //       model: retailerStockTbl,
  //       where: {
  //         retailer_id: retailerId,
  //       },
  //       required: true,
  //       attributes: { exclude: ["createdAt", "updatedAt"] },
  //     },
  //   ],
  // }).then((data) => {
  //   res.status(200).send({
  //     status: 200,
  //     error: false,
  //     message: "Retailer Stock search Details fetched Successfully",
  //     data: data,
  //   });
  // });
 
};



// find all Retailer Wise Empty stock Details
exports.retailerWiseEmptyStockDetails = (req, res) => {
  let retailerId = req.params.retailerId;

  retailerProductTbl.hasMany(retailerStockTbl, { foreignKey: "product_id" });
  retailerStockTbl.belongsTo(retailerProductTbl, { foreignKey: "product_id" });

  ProductMaster.hasMany(retailerProductTbl, { foreignKey: "medicine_id" });
  retailerProductTbl.belongsTo(ProductMaster, { foreignKey: "medicine_id" });
  
  let emptyCountCondition = {
    retailer_id: retailerId,
    [Op.or]: [
      {
        expiry_date: {
          [Op.lt]: moment().format("YYYY-MM-DD"),
        },
      },
      {
        quantity: {
          [Op.eq]: 0,
        },
      },
    ],
  };

  retailerProductTbl
    .findAll({
      where:{
        retailer_id: retailerId,
      },
      attributes: { exclude: ["createdAt", "updatedAt", "id"] },
      include: [
        {
          model: retailerStockTbl,
          required: true,
          attributes: { exclude: ["createdAt", "updatedAt"] },
          where: emptyCountCondition,
        },
        {
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
    })
    .then((data) => {
      retailerStockTbl
        .count({
          where: emptyCountCondition,
        })
        .then((emptyCount) => {
          const auditTrailVal = {
            user_id: req.params.retailerId,
            trail_type: "Admin",
            trail_message: "Retailer Empty Stock Details fetched Successfully",
            status: 1,
          };
          AuditTrail.create(auditTrailVal, (err, data) => {});
          res.status(200).send({
            status: 200,
            error: false,
            count: emptyCount,
            message: "Retailer Empty Stock Details fetched Successfully",
            data: data,
          });
        });
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message ||
          "Some error occurred while retrieving Retailer Empty Stock Details List.",
      });
    });
};
// Ends

// Insert All retailer Product and Stock Insert Data
exports.uploadProductStockExcelData = (req, res) => {
  let excelData = req.body.excelData;
  let excelDataLength = excelData.length;
  console.log("excelDataLength " + excelDataLength);
  if (excelDataLength > 0) {
    excelData.forEach((arg) => {
      const productVal = {
        retailer_id: arg.retailer_id,
        medicine_id: arg.medicine_id,
      };

      retailerProductTbl.count({ where: productVal }).then((count) => {
        if (count === 0) {
          retailerProductTbl
            .create(productVal)
            .then((data) => {
              const stockVal = {
                retailer_id: arg.retailer_id,
                product_id: data.id,
                medicine_id: arg.medicine_id,
                batch: arg.batch,
                expiry_date: arg.expiry_date,
                quantity: arg.quantity,
                mrp: arg.mrp,
                commission: arg.commission,
                discount: arg.discount,
                vat: arg.vat,
                CGST: arg.CGST,
                SGST: arg.SGST,
                IGST: arg.IGST,
              };
              retailerStockTbl.create(stockVal).then((data) => {
                const auditTrailVal = {
                  user_id: arg.retailer_id,
                  trail_type: "Admin",
                  trail_message:
                    "Retailer Product Details created Successfully",
                  status: 1,
                };
                AuditTrail.create(auditTrailVal, (err, data) => {});
                res.status(200).send({
                  status: 200,
                  error: false,
                  message: "Retailer Product Details Created Successfully",
                });
              });
            })
            .catch((err) => {
              console.log(err);
              res.status(500).send({
                message:
                  err.message ||
                  "Some error occurred while retrieving Retailer Product.",
              });
            });
        } else {
          retailerProductTbl
            .findAll({
              where: productVal,
              attributes: { exclude: ["createdAt", "updatedAt"] },
            })
            .then((resData) => {
              let productId = resData[0].id;

              const stockVal = {
                retailer_id: arg.retailer_id,
                product_id: productId,
                medicine_id: arg.medicine_id,
                batch: arg.batch,
                expiry_date: arg.expiry_date,
                quantity: arg.quantity,
                mrp: arg.mrp,
                commission: arg.commission,
                discount: arg.discount,
                vat: arg.vat,
                CGST: arg.CGST,
                SGST: arg.SGST,
                IGST: arg.IGST,
              };

              const stockCountValue = {
                retailer_id: arg.retailer_id,
                product_id: productId,
                batch: arg.batch,
              };

              retailerStockTbl
                .count({ where: stockCountValue })
                .then((count) => {
                  if (count === 0) {
                    retailerStockTbl.create(stockVal).then((data) => {
                      const auditTrailVal = {
                        user_id: arg.retailer_id,
                        trail_type: "Admin",
                        trail_message:
                          "Retailer Product Details created Successfully",
                        status: 1,
                      };
                      AuditTrail.create(auditTrailVal, (err, data) => {});
                      res.status(200).send({
                        status: 200,
                        error: false,
                        message:
                          "Retailer Product Details Created Successfully",
                      });
                    });
                  } else {
                    res.status(200).send({
                      status: 200,
                      error: false,
                      message: "Batch Id already Exists..",
                    });
                  }
                });
            });
        }
      });
    });
  }
};

//<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< Shortage Book Table  >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

exports.createShortageBook = (req, res) => {
  if (!req.body) {
    response.status(400).send({ message: "Content cannot be empty" });
  } else {
    const pageValues = {
      retailer_id: req.body.retailer_id,
      medicine_id: req.body.medicine_id,
      quantity: req.body.quantity,
    };
    shortageBookTbl
      .count({
        where: {
          retailer_id: req.body.retailer_id,
          medicine_id: req.body.medicine_id,
        },
      })
      .then((rows) => {
        if (rows === 0) {
          shortageBookTbl
            .create(pageValues)
            .then((data) => {
              const auditTrailVal = {
                user_id: data.id,
                trail_type: "Admin",
                trail_message: "Shortage Book was created Successfully",
                status: 1,
              };
              AuditTrail.create(auditTrailVal, (err, data) => {});
              res.status(200).send({
                status: 200,
                error: false,
                message: "Shortage Book was created Successfully",
              });
            })
            .catch((err) => {
              console.log(err);
              res
                .status(500)
                .send({ error: `${err} while creating Shortage Book` });
            });
        } else {
          res.status(200).send({
            status: 204,
            error: false,
            message: "Shortage Book already exists !!",
          });
        }
      });
  }
};

// Update a Shortage Book by the id in the request
exports.updateShortageBook = (req, res) => {
  const rowId = req.params.rowId;

  if (req.body.data) {
    req.body = req.body.data;
  }
  shortageBookTbl
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
          message: "Shortage Book updated Successfully",
        });
      } else {
        res.send({
          message: `Cannot update Shortage Book with id=${rowId}. Maybe Shortage Book was not found or req.body is empty!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error updating Audit Trail with id=" + rowId,
      });
    });
};

// Find a single Patient Appointment with an Name
exports.getShortageBook = (req, res) => {
  const rowId = req.params.rowId;

  Retailer.hasMany(shortageBookTbl, { foreignKey: "retailer_id" });
  shortageBookTbl.belongsTo(Retailer, { foreignKey: "retailer_id" });

  ProductMaster.hasMany(shortageBookTbl, { foreignKey: "medicine_id" });
  shortageBookTbl.belongsTo(ProductMaster, { foreignKey: "medicine_id" });

  shortageBookTbl
    .findAll({
      where: {
        id: rowId,
      },
      attributes: {
        exclude: ["createdAt", "updatedAt"],
      },
      include: [
        {
          model: Retailer,
          required: true,
          attributes: { exclude: ["createdAt", "updatedAt"] },
        },
        {
          model: ProductMaster,
          required: true,
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
    })
    .then((data) => {
      res.send({
        status: 200,
        message: "Shortage Book Details Fetched Successfully",
        error: false,
        data: data,
      });
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving Shortage Book.",
      });
    });
};

// Find a Retailer Shortage Book
exports.getRetailerShortageBook = (req, res) => {
  const retailerId = req.params.retailerId;
  // shortageBookTbl,Retailer

  Retailer.hasMany(shortageBookTbl, { foreignKey: "retailer_id" });
  shortageBookTbl.belongsTo(Retailer, { foreignKey: "retailer_id" });

  ProductMaster.hasMany(shortageBookTbl, { foreignKey: "medicine_id" });
  shortageBookTbl.belongsTo(ProductMaster, { foreignKey: "medicine_id" });

  shortageBookTbl
    .findAll({
      where: {
        retailer_id: retailerId,
      },
      attributes: {
        exclude: ["createdAt", "updatedAt"],
      },
      include: [
        {
          model: Retailer,
          required: true,
          attributes: { exclude: ["createdAt", "updatedAt"] },
        },
        {
          model: ProductMaster,
          required: true,
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
    })
    .then((data) => {
      res.send({
        status: 200,
        message: "Retailer Shortage Book Details Fetched Successfully",
        error: false,
        data: data,
      });
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving Shortage Book.",
      });
    });
};

// Delete a Patient Coupan with the specified id in the request
exports.deleteShortageBookFinalorderRow = (req, res) => {
  const retailerId = req.params.retailerId;
  const medicineId = req.params.medicineId;

  shortageBookTbl
    .count({ where: { retailer_id: retailerId, medicine_id: medicineId } })
    .then((shortageBookCount) => {
      if (shortageBookCount > 0) {
        shortageBookTbl
          .destroy({
            where: { retailer_id: retailerId, medicine_id: medicineId },
          })
          .then((num) => {
            if (num == 1) {
              // Success response
            }
          });
      } else {
        console.log("Single shortageBookCount >> " + shortageBookCount);
      }
    });

  finalOrder
    .count({ where: { retailer_id: retailerId, medicine_id: medicineId } })
    .then((finalOrderCount) => {
      if (finalOrderCount > 0) {
        finalOrder
          .destroy({
            where: { retailer_id: retailerId, medicine_id: medicineId },
          })
          .then((num) => {
            if (num == 1) {
              // Success response
            }
          });
      } else {
        console.log("Single finalOrderCount >> " + finalOrderCount);
      }
    });

  res.send({
    status: 200,
    error: false,
    message: "Retailer Shortage Book and Final order row Deleted Successfully",
  });
};

// Delete All retailer shortage book
exports.deleteAllRetailerShortageBook = (req, res) => {
  const retailerId = req.params.retailerId;
  shortageBookTbl
    .destroy({
      where: { retailer_id: retailerId },
    })
    .then((num) => {
      if (num == 1) {
        res.send({
          status: 200,
          error: false,
          message: "Retailer Shortage Book Deleted Successfully",
        });
      } else {
        res.send({
          message: `Cannot delete Shortage Book with id=${retailerId}. Maybe Shortage Book was not found!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Could not delete Shortage Book with id=" + retailerId,
      });
    });
};

// ..................................................    Ends here .................................................

//........................................... Final Order ...........................................
exports.createFinalOrder = (req, res) => {
  if (!req.body) {
    response.status(400).send({ message: "Content cannot be empty" });
  } else {
    let finalorderData = req.body.finalorder;
    let finalorderDataLength = finalorderData.length;
    console.log("orderDataLength " + finalorderDataLength);

    // finalOrder
    // .bulkCreate(finalorderData)
    // .then((data) => {
    //   const auditTrailVal = {
    //     user_id: data.id,
    //     trail_type: "Admin",
    //     trail_message: "Retailer Final order created Successfully",
    //     status: 1,
    //   };
    //   AuditTrail.create(auditTrailVal, (err, data) => {});
    //   res.status(200).send({
    //     status: 200,
    //     error: false,
    //     message: "Retailer Final order Created Successfully",
    //   });
    // });

    if (finalorderDataLength > 0) {
      finalorderData.forEach((arg) => {
        const productVal = {
          retailer_id: arg.retailer_id,
          medicine_id: arg.medicine_id,
          quantity: arg.quantity,
        };

        finalOrder
          .count({
            where: productVal,
          })
          .then((rows) => {
            if (rows === 0) {
              finalOrder
                .create(productVal)
                .then((data) => {
                  const auditTrailVal = {
                    user_id: data.id,
                    trail_type: "Admin",
                    trail_message: "Retailer Final order created Successfully",
                    status: 1,
                  };
                  AuditTrail.create(auditTrailVal, (err, data) => {});
                  res.status(200).send({
                    status: 200,
                    error: false,
                    message: "Retailer Final order Created Successfully",
                  });
                })
                .catch((err) => {
                  console.log(err);
                  res.status(500).send({
                    error: `${err} while creating Retailer Final order`,
                  });
                });
            } else {
              res.status(200).send({
                status: 200,
                error: true,
                message: "Order Item Exists/Inserted..",
              });
            }
          });
      });
    }
  }
};

// Get Retailer Final order Detailer
exports.getRetailerFinalOrder = (req, res) => {
  const retailerId = req.params.retailerId;
  // shortageBookTbl,Retailer

  Retailer.hasMany(finalOrder, { foreignKey: "retailer_id" });
  finalOrder.belongsTo(Retailer, { foreignKey: "retailer_id" });

  ProductMaster.hasMany(finalOrder, { foreignKey: "medicine_id" });
  finalOrder.belongsTo(ProductMaster, { foreignKey: "medicine_id" });

  finalOrder
    .findAll({
      where: {
        retailer_id: retailerId,
      },
      attributes: {
        exclude: ["createdAt", "updatedAt"],
      },
      include: [
        {
          model: Retailer,
          required: true,
          attributes: { exclude: ["createdAt", "updatedAt"] },
        },
        {
          model: ProductMaster,
          required: true,
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
    })
    .then((data) => {
      res.send({
        status: 200,
        message: "Retailer Shortage Book Details Fetched Successfully",
        error: false,
        data: data,
      });
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving Shortage Book.",
      });
    });
};
// .......................................... Ends ...................................................

// Get Retailer Final order Detailer
exports.getRetailerDashboardDetails = (req, res) => {
  const retailerId = req.params.retailerId;
  console.log("Retailer Id >>> " + retailerId);

  let totalAvailiableStock = 0;
  let runningLow = 0;
  let outOfStock = 0;
  let expiredStock = 0;
  let orderBookedStock = 0;

  retailerStockTbl
    .findAll({
      where: {
        retailer_id: retailerId,
      },
      attributes: {
        exclude: ["createdAt", "updatedAt"],
      },
    })
    .then((data) => {
      totalAvailiableStock = data.length;
      retailerStockTbl
        .findAll({
          where: {
            retailer_id: retailerId,
            quantity: {
              [Op.lt]: 5,
            },
          },
          attributes: {
            exclude: ["createdAt", "updatedAt"],
          },
        })
        .then((lowStock) => {
          runningLow = lowStock.length;
          retailerStockTbl
            .findAll({
              where: {
                retailer_id: retailerId,
                [Op.or]: [
                  // {
                  //   expiry_date: {
                  //     [Op.lt]: moment().format("YYYY-MM-DD"),
                  //   },
                  // },
                  {
                    quantity: {
                      [Op.eq]: 0,
                    },
                  },
                ],
              },
              attributes: {
                exclude: ["createdAt", "updatedAt"],
              },
            })
            .then((noStock) => {
              outOfStock = noStock.length;
              retailerStockTbl
                .findAll({
                  where: {
                    retailer_id: retailerId,
                    expiry_date: {
                      [Op.lt]: moment().format("YYYY-MM-DD"),
                    },
                  },
                  attributes: {
                    exclude: ["createdAt", "updatedAt"],
                  },
                })
                .then((deadStock) => {
                  expiredStock = deadStock.length;
                  finalOrder
                    .findAll({
                      where: {
                        retailer_id: retailerId,
                      },
                    })
                    .then((bookedOrder) => {
                      orderBookedStock = bookedOrder.length;

                      let retailerStockArray = [
                        {
                          availiableStock: totalAvailiableStock,
                          runningLow: runningLow,
                          outOfStock: outOfStock,
                          expiredStock: expiredStock,
                          orderBookedStock: orderBookedStock,
                        },
                      ];

                      res.status(200).send({
                        status: 200,
                        error: false,
                        message:
                          "Retailer Complete Stock Details Count Fetched successfully...",
                        data: retailerStockArray,
                      });
                    });
                });
            });
        });
    });
};

// Delete All retailer shortage book and final order records
exports.deleteAllShortageBookFinalOrder = (req, res) => {
  const retailerId = req.params.retailerId;

  shortageBookTbl
    .count({ where: { retailer_id: retailerId } })
    .then((shortageBookCount) => {
      if (shortageBookCount > 0) {
        shortageBookTbl
          .destroy({
            where: { retailer_id: retailerId },
          })
          .then((num) => {
            if (num == 1) {
              // Success response
            }
          });
      } else {
        console.log("shortageBookCount >> " + shortageBookCount);
      }
    });

  finalOrder
    .count({ where: { retailer_id: retailerId } })
    .then((finalOrderCount) => {
      if (finalOrderCount > 0) {
        finalOrder
          .destroy({
            where: { retailer_id: retailerId },
          })
          .then((num) => {
            if (num == 1) {
              // Success response
            }
          });
      } else {
        console.log("finalOrderCount >> " + finalOrderCount);
      }
    });

  res.send({
    status: 200,
    error: false,
    message: "Retailer Shortage Book and Final order Deleted Successfully",
  });
};

// Order All Shortage Book of Retailer Items
exports.orderAllRetailerShortageBookItems = (req, res) => {
  const retailerId = req.body.retailer_id;
  // console.log("OrderAll Retailer Id "+retailerId);
  // return;
  let finalOrderData = [];
  let shortageBookId = [];
  shortageBookTbl
    .findAll({
      where: {
        retailer_id: retailerId,
      },
      attributes: {
        exclude: ["createdAt", "updatedAt"],
      },
    })
    .then((data) => {
      let responseLength = data.length;
      if (responseLength > 0) {
        data.forEach((arg) => {
          let obj = {};
          obj.id = "";
          obj.retailer_id = arg.retailer_id;
          obj.medicine_id = arg.medicine_id;
          obj.quantity = arg.quantity;
          finalOrderData.push(obj);
          shortageBookId.push(arg.id + ",");
        });

        if (finalOrderData.length > 0) {
          finalOrder.bulkCreate(finalOrderData).then((data) => {
            const auditTrailVal = {
              user_id: retailerId,
              trail_type: "Admin",
              trail_message: "Retailer Final order created Successfully",
              status: 1,
            };
            AuditTrail.create(auditTrailVal, (err, data) => {});
            shortageBookTbl.destroy({ where: { id: shortageBookId } });
            res.status(200).send({
              status: 200,
              error: false,
              message: "Retailer Final order Created Successfully",
            });
          });
        } else {
          res.status(200).send({
            status: 200,
            error: false,
            message: "Data not retreived properly..!",
          });
        }
      } else {
        res.status(200).send({
          status: 200,
          error: false,
          message: "Shortage Data not Found..!",
        });
      }
    });
};


// Get all Medicine Batch Details
exports.getMedicineBatchDetails = (req, res) => {
  const retailerId = req.params.retailerId;
  const medicineId = req.params.medicineId;
  console.log("Retailer Id >>"+retailerId+" <<< medicineId "+medicineId);

  ProductMaster.hasMany(retailerStockTbl, { foreignKey: "medicine_id" });
  retailerStockTbl.belongsTo(ProductMaster, { foreignKey: "medicine_id" });

  ProductMaster.hasMany(retailerProductTbl, { foreignKey: "medicine_id" });
  retailerProductTbl.belongsTo(ProductMaster, { foreignKey: "medicine_id" });

  ProductMaster.findAll({
    where: {
      id: medicineId,
    },
    // attributes: [
    //   "id",
    //   "medicineid",
    //   "medicinename",
    //   "manufacturer",
    //   "form",
    //   "unit_price",
    // ],
    include: [
      {
        model: retailerStockTbl,
        where: {
          retailer_id: retailerId,
          medicine_id: medicineId,
          [Op.and]: [
            {
              expiry_date: {
                [Op.gt]: moment().format("YYYY-MM-DD"),
              },
            },
            {
              quantity: {
                [Op.ne]: 0,
              },
            },
          ],
        },
        required: false,
        attributes: { exclude: ["createdAt", "updatedAt"] },
      },
    ],
  }).then((response) => {
      res.status(200).send({
        status: 200,
        error: false,
        message: "Medicine Batch details fetched sucessfully..!",
        data : response,
      });
  });
};
