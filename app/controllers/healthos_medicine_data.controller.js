const db = require("../models");
const Op = db.Sequelize.Op;
const AuditTrail = db.audit_trails;
const HealthosMedicine = db.tbl_healthos_medicine_data;
const ProductMaster = db.products_master_tbl;

exports.findAll = (req, res) => {

    HealthosMedicine.findAll({ attributes: ["id", "medicinename"] })
    .then((data) => {
      res.send({ message: "Successfully  fetched All medications", data });
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error retrieving User with id=" + id,
      });
    });
};


exports.fetchAll = (req, res) => {

  HealthosMedicine.findAll({ })
  .then((data) => {
    res.send(data);
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
  HealthosMedicine.findAll({
	where: condition,
    offset: count,
    limit: maxLength,
    attributes: ["id", "medicineid", "medicinename"],
  })
    .then((data) => {
      res.send(data);
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

  HealthosMedicine.findAll({	where:{id:id}  })
    .then((data) => {
      res.send(data);
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
      'manufacturer': req.body.manufacturer,
      'unit_price': req.body.unit_price,
      'package_form': req.body.package_form,
      'drug_type': req.body.drug_type,
      'product_group_name': req.body.product_group_name,
      'standard_units': req.body.standard_units,
      'form': req.body.form,
      'size': req.body.size,
      'per_unit': req.body.per_unit,
      'mrp': req.body.mrp,
      'schedule-category': req.body.schedule_category,
      'schedule-description': req.body.schedule_description,
      'constituents_name': req.body.constituents_name,
      'constituents-strength': req.body.constituents_strength,
      'interactions-food-show_alert': req.body.interactions_food_show_alert,
      'interactions-food-tag': req.body.interactions_food_tag,
      'interactions-food-color_codes': req.body.interactions_food_color_codes,
      'interactions-food-description': req.body.interactions_food_description,
      'interactions-food-label': req.body.interactions_food_label,
      'interactions-lactation-show_alert': req.body.interactions_lactation_show_alert,
      'interactions-lactation-tag': req.body.interactions_lactation_tag,
      'interactions-lactation-color_code': req.body.interactions_lactation_color_code,
      'interactions-lactation-description': req.body.interactions_lactation_description,
      'interactions-lactation-label': req.body.interactions_lactation_label,
      'interactions-alcohol-show_alert': req.body.interactions_alcohol_show_alert,
      'interactions-alcohol-tag': req.body.interactions_alcohol_tag,
      'interactions-alcohol-color_code': req.body.interactions_alcohol_color_code,
      'interactions-alcohol-description': req.body.interactions_alcohol_description,
      'interactions-alcohol-description-label': req.body.interactions_alcohol_description_label,
      'interactions-pregnancy-label': req.body.interactions_pregnancy_label,
      'interactions-pregnancy-tag': req.body.interactions_pregnancy_tag,
      'interactions-pregnancy-color_code': req.body.interactions_pregnancy_color_code,
      'interactions-pregnancy-description': req.body.interactions_pregnancy_description,
      'interactions-pregnancy-show_alert': req.body.interactions_pregnancy_show_alert,
      'components': req.body.components
    }
    HealthosMedicine.create(HealthosMedicineval)
      .then((data) => {
        const auditTrailVal = {
          'user_id': data.id,
          'trail_type': user_type.charAt(0).toUpperCase() + user_type.slice(1) + ' HealthosMedicineval Modules',
          'trail_message': req.body.medicinename + ' ' + req.body.manufacturer + ' is HealthosMedicineval Modules as ' + user_type.charAt(0).toUpperCase() + user_type.slice(1),
          'status': 1
        }
        AuditTrail.create(auditTrailVal, (err, data) => { })
        res.send(data);
      })
      .catch((err) => {
        console.log(err)
        res.status(500).send({ error: `${err} while creating Healthos Medicineval Modules` });
      });

  }
};

// Update a Responders by the id in the request
exports.update = (req, res) => {
  const id = req.params.id;
  var user_type = "Admin";
  console.log(req.body)
  const HealthosMedicineval = {
    'medicineid': req.body.medicineid,
    'medicinename': req.body.medicinename,
    'manufacturer': req.body.manufacturer,
    'unit_price': req.body.unit_price,
    'package_form': req.body.package_form,
    'drug_type': req.body.drug_type,
    'product_group_name': req.body.product_group_name,
    'standard_units': req.body.standard_units,
    'form': req.body.form,
    'size': req.body.size,
    'per_unit': req.body.per_unit,
    'mrp': req.body.mrp,
    'schedule-category': req.body.schedule_category,
    'schedule-description': req.body.schedule_description,
    'constituents_name': req.body.constituents_name,
    'constituents-strength': req.body.constituents_strength,
    'interactions-food-show_alert': req.body.interactions_food_show_alert,
    'interactions-food-tag': req.body.interactions_food_tag,
    'interactions-food-color_codes': req.body.interactions_food_color_codes,
    'interactions-food-description': req.body.interactions_food_description,
    'interactions-food-label': req.body.interactions_food_label,
    'interactions-lactation-show_alert': req.body.interactions_lactation_show_alert,
    'interactions-lactation-tag': req.body.interactions_lactation_tag,
    'interactions-lactation-color_code': req.body.interactions_lactation_color_code,
    'interactions-lactation-description': req.body.interactions_lactation_description,
    'interactions-lactation-label': req.body.interactions_lactation_label,
    'interactions-alcohol-show_alert': req.body.interactions_alcohol_show_alert,
    'interactions-alcohol-tag': req.body.interactions_alcohol_tag,
    'interactions-alcohol-color_code': req.body.interactions_alcohol_color_code,
    'interactions-alcohol-description': req.body.interactions_alcohol_description,
    'interactions-alcohol-description-label': req.body.interactions_alcohol_description_label,
    'interactions-pregnancy-label': req.body.interactions_pregnancy_label,
    'interactions-pregnancy-tag': req.body.interactions_pregnancy_tag,
    'interactions-pregnancy-color_code': req.body.interactions_pregnancy_color_code,
    'interactions-pregnancy-description': req.body.interactions_pregnancy_description,
    'interactions-pregnancy-show_alert': req.body.interactions_pregnancy_show_alert,
    'components': req.body.components
  }
  HealthosMedicine.update(HealthosMedicineval, {
    where: { id: id },
  })
    .then((num) => {
      if (num == 1) {
        const auditTrailVal = {
          'user_id': req.params.id,
          'trail_type': user_type.charAt(0).toUpperCase() + user_type.slice(1) + ' Healthos Medicineval Modules',
          'trail_message': req.body.medicinename + ' ' + req.body.manufacturer + ' is Healthos Medicineval Modules as ' + user_type.charAt(0).toUpperCase() + user_type.slice(1),
          'status': 1
        }
        AuditTrail.create(auditTrailVal, (err, data) => { })
        res.send({
          message: "Healthos Medicineval Module was updated successfully.",
        });
      } else {
        res.send({
          message: `Cannot update Responders with id=${id}. Maybe Healthos Medicineval Module was not found or req.body is empty!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error updating Responders with id=" + id,
      });
    });
};

// Delete a Responders with the specified id in the request
exports.delete = (req, res) => {
  const id = req.params.id;

  HealthosMedicine.destroy({
    where: { id: id },
  })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: "Responder was deleted successfully!",
        });
      } else {
        res.send({
          message: `Cannot delete Responder with id=${id}. Maybe Responder was not found!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Could not delete Responder with id=" + id,
      });
    });
};

// Delete all Responders from the database.
exports.deleteAll = (req, res) => {
  HealthosMedicine.destroy({
    where: {},
    truncate: false,
  })
    .then((nums) => {
      res.send({ message: `${nums} Responder were deleted successfully!` });
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while removing all Responder.",
      });
    });
};








// Find a Drug Allergies with Pagination.
exports.drugAllergiesfindOne = (req, res) => {

  let maxLength = 100;
  const id = req.params.id;

  let count = (id - 1) * maxLength;
  HealthosMedicine.findAll({
    offset: count,
    limit: maxLength,
    group: ["product_group_name"],
    order: [["product_group_name", "DESC"]],
    attributes: ["product_group_name", "Medicineid", "constituents_name", "id"], //object
  })
    .then((data) => {
      res.status(200).send({
        status: 200,
        error: false,
        count:data.length,
        message: "Drug allergies fetched Sucessfully",
        data: data,
      });
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving Responders.",
      });
    });
};


// Retrieve all Patients from the Patients.
exports.searchDrugAllergies = (req, res) => {

  const medicine = req.query.medicine;

  if(req.query.drugMedicine) {
    const drugMedicine = req.query.drugMedicine;
    var condition = drugMedicine ? { product_group_name: { [Op.like]: `%${drugMedicine}%` } } : null;
  }

  HealthosMedicine.findAll({
    where: condition,
      group: ["product_group_name"],
      order: [["product_group_name", "DESC"]],
      attributes: ["product_group_name", "Medicineid", "constituents_name", "id"], //object
    })
      .then((data) => {
        res.status(200).send({
          status: 200,
          error: false,
          count:data.length,
          message: "Drug allergies Search List fetched Sucessfully",
          data: data,
        });
      })
      .catch((err) => {
        res.status(500).send({
          message:
            err.message || "Some error occurred while retrieving Responders.",
        });
      });
};




