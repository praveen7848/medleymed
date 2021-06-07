const db = require("../models");
const Op = db.Sequelize.Op;
const AuditTrail = db.audit_trails;
const ProductMaster = db.products_master_tbl;

exports.findAll = (req, res) => {

    ProductMaster.findAll({ 
     // attributes: ["id", "medicinename"],
      order: [["medicinename", "ASC"]], 
      group: ['medicinename',"manufacturer"]
    })
    .then((data) => {
      //res.send({ message: "Successfully  fetched All medications", data });
      res.status(200).send({
        status: 200,
        error: false,
        message: "Product Master fetched Successfully",
        data:data
      });
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error retrieving User with id=" + id,
      });
    });
};


exports.fetchAll = (req, res) => {

ProductMaster.findAll({ })
  .then((data) => {
   // res.send(data);
    res.status(200).send({
        status: 200,
        error: false,
        message: "Product Master fetched Successfully",
        data:data
      });
  })
  .catch((err) => {
    res.status(500).send({
      message: "Error retrieving User with id=" + id,
    });
  });
};

// Find a single Responders with an id
exports.findOne = (req, res) => {

  let maxLength = 100;
  const id = req.params.id;

  if(req.query.medicine) {
	const medicine = req.query.medicine;
	var condition = medicine ? { medicinename: { [Op.like]: `%${medicine}%` } } : null;
  }

  let count = (id - 1) * maxLength;
  ProductMaster.findAll({
	where: condition,
    offset: count,
    limit: maxLength,
    attributes: ["id", "medicineid", "medicinename"],
  })
    .then((data) => {
      //res.send(data);
      res.status(200).send({
        status: 200,
        error: false,
        message: "Product Master fetched Successfully",
        data:data
      });
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving Responders.",
      });
    });
};

//fetch single record
// Find a single Responders with an id
exports.findSinglerecord = (req, res) => {
  const id = req.params.id;

  ProductMaster.findAll({	where:{id:id}  })
    .then((data) => {
        res.status(200).send({
            status: 200,
            error: false,
            message: "Product Master fetched Successfully",
            data:data
          });
     // res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving Responders.",
      });
    });
};
// Create Controller
exports.create = (req, res) => {
  var user_type = "Admin"
  if (!req.body) {
    res.status(400).send({ "message": "Content cannot be empty" })
  }

  else {
    
    const HealthosMedicineval = {
        'medicineid': req.body.medicineid,
        'medicinename': req.body.medicinename,
        'strength': req.body.strength,
        'manufacturer': req.body.manufacturer,
        'size': req.body.size,
        'price_to_stockist': req.body.price_to_stockist,
        'max_retail_price': req.body.max_retail_price,
        'price_to_retail': req.body.price_to_retail,
        'goods_service_tax': req.body.goods_service_tax,
        'goods_price_to_retail': req.body.goods_price_to_retail,
        'composition': req.body.composition,
        'description': req.body.description,
        'attributes': req.body.attributes,
        'is_featured': req.body.is_featured,
        'is_deleted': req.body.is_deleted,
        'hsn_code': req.body.hsn_code,
        'is_validated': req.body.is_validated,
        'company_id': req.body.company_id,
        'product_class_id': req.body.product_class_id
        //'components': req.body.components
      }



      ProductMaster.create(HealthosMedicineval)
      .then((data) => {
         
        // const auditTrailVal = {
        //   'user_id': data.id,
        //   'trail_type': user_type.charAt(0).toUpperCase() + user_type.slice(1) + 'Product Master Modules',
        //   'trail_message': req.body.medicinename + ' ' + req.body.packing + ' is Product Master Modules as ' + user_type.charAt(0).toUpperCase() + user_type.slice(1),
        //   'status': 1
        // }
        // AuditTrail.create(auditTrailVal, (err, data) => { })
        //res.send(data);
        res.status(200).send({
            status: 200,
            error: false,
            message: "Product Master Created Successfully",
            data:data
          });
      })
      .catch((err) => {
        console.log(err)
        res.status(500).send({ error: `${err} while creating Product Master Modules` });
      });

  }
};

// Update a Responders by the id in the request
exports.update = (req, res) => {
  const id = req.params.id;
  var user_type = "Admin";
  
  const HealthosMedicineval = {
    'medicineid': req.body.medicineid,
    'medicinename': req.body.medicinename,
    'strength': req.body.strength,
    'manufacturer': req.body.manufacturer,
    'size': req.body.size,
    'price_to_stockist': req.body.price_to_stockist,
    'max_retail_price': req.body.max_retail_price,
    'price_to_retail': req.body.price_to_retail,
    'goods_service_tax': req.body.goods_service_tax,
    'goods_price_to_retail': req.body.goods_price_to_retail,
    'composition': req.body.composition,
    'description': req.body.description,
    'attributes': req.body.attributes,
    'is_featured': req.body.is_featured,
    'is_deleted': req.body.is_deleted,
    'hsn_code': req.body.hsn_code,
    'is_validated': req.body.is_validated,
    'company_id': req.body.company_id,
    'product_class_id': req.body.product_class_id
    //'components': req.body.components
  }
  ProductMaster.update(HealthosMedicineval, {
    where: { id: id },
  })
    .then((num) => {
      if (num == 1) {
        const auditTrailVal = {
          'user_id': req.params.id,
          'trail_type': user_type.charAt(0).toUpperCase() + user_type.slice(1) + ' Product Master Modules',
          'trail_message': req.body.medicinename + ' ' + req.body.size + ' is Product Master Modules as ' + user_type.charAt(0).toUpperCase() + user_type.slice(1),
          'status': 1
        }
        AuditTrail.create(auditTrailVal, (err, data) => { })
        res.send({
          message: "Product Master Module was updated successfully.",
        });
      } else {
        res.send({
          message: `Cannot update Product Master with id=${id}. Maybe Product Master Module was not found or req.body is empty!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error updating Product Master with id=" + id,
      });
    });
};

// Delete a Responders with the specified id in the request
exports.delete = (req, res) => {
  const id = req.params.id;

  ProductMaster.destroy({
    where: { id: id },
  })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: "Product Master was deleted successfully!",
        });
      } else {
        res.send({
          message: `Cannot delete Product Master with id=${id}. Maybe Product Master was not found!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Could not delete Product Master with id=" + id,
      });
    });
};

// Delete all Responders from the database.
exports.deleteAll = (req, res) => {
    ProductMaster.destroy({
    where: {},
    truncate: false,
  })
    .then((nums) => {
      res.send({ message: `${nums} Product Master were deleted successfully!` });
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while removing all Product Master.",
      });
    });
};








// Find a Drug Allergies with Pagination.
exports.drugAllergiesfindOne = (req, res) => {

  let maxLength = 100;
  const id = req.params.id;

  let count = (id - 1) * maxLength;
  ProductMaster.findAll({
    offset: count,
    limit: maxLength,
    group: ["medicinename"],
    order: [["medicinename", "DESC"]],
    attributes: ["size", "Medicineid", "medicinename","strength", "id"], //object
  })
    .then((data) => {
      res.status(200).send({
        status: 200,
        error: false,
        count:data.length,
        message: "Product Master fetched Sucessfully",
        data: data,
      });
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving Product Master.",
      });
    });
};


// Retrieve all Patients from the Patients.
exports.searchDrugAllergies = (req, res) => {

  const medicine = req.query.medicine;

  if(req.query.drugMedicine) {
    const drugMedicine = req.query.drugMedicine;
    var condition = drugMedicine ? { medicinename: { [Op.like]: `%${drugMedicine}%` } } : null;
  }

  ProductMaster.findAll({
    where: condition,
      group: ["medicinename"],
      order: [["medicinename", "DESC"]],
      attributes: ["size", "Medicineid", "medicinename","strength", "id"], //object
    })
      .then((data) => {
        res.status(200).send({
          status: 200,
          error: false,
          count:data.length,
          message: "Product Master Search List fetched Sucessfully",
          data: data,
        });
      })
      .catch((err) => {
        res.status(500).send({
          message:
            err.message || "Some error occurred while retrieving Product Master.",
        });
      });
};




