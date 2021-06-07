const Sequelize = require("sequelize");
const db = require("../models");

const Countries = db.tbl_country;
const States = db.tbl_state;
const Cities = db.tbl_city;

const Op = Sequelize.Op;
const AuditTrail = db.audit_trails;
const moment = require("moment-timezone");



// Get the States Based on Country
exports.getStatesBasedCountry = (req, res) => {
  const countryId = req.params.countryId;
  States.findAll({
    where: {
      country_id: countryId,
    },
    attributes: {
      exclude: ["createdAt", "updatedAt"],
    },
  })
    .then((data) => {
      res.send({
        status: 200,
        error: false,
        message: "States Details fetched successfully.",
        data: data,
      });
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving Countries.",
      });
    });
};
// Ends here

// Get the Cities Based on States
exports.getCitiesBasedState = (req, res) => {
  const stateId = req.params.stateId;
  Cities.findAll({
    where: {
      state_id: stateId,
    },
    attributes: {
      exclude: ["createdAt", "updatedAt"],
    },
  })
    .then((data) => {
      res.send({
        status: 200,
        error: false,
        message: "Cities Details fetched successfully.",
        data: data,
      });
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving Countries.",
      });
    });
};
// Ends here

//Generate timeZones Details List
exports.getCompleteTimezones = (req, res) => {
  var timeZones = moment.tz.names();
  var offsetTimezone = [];

  for (var i in timeZones) {
    offsetTimezone.push({
      id: i,
      name: timeZones[i],
      timezone: "GMT" + moment.tz(timeZones[i]).format("Z"),
      value:
        "(" + "GMT" + moment.tz(timeZones[i]).format("Z") + ") " + timeZones[i],
    });
  }
  res.send({
    status: 200,
    error: false,
    message: "Timezone Details fetched successfully.",
    data: offsetTimezone.sort(),
  });
};
// Ends

// Retrieve all Countries
exports.findAll = (req, res) => {
  Countries.findAll({
    where: {
      currency_symbol: {
        [Op.ne]: "",
      },
    },
    attributes: {
      exclude: ["createdAt", "updatedAt"],
    },
  })
    .then((data) => {
      // res.send(data);
      res.send({
        status: 200,
        error: false,
        message: "Country Details fetched successfully.",
        data: data,
      });
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving Countries List.",
      });
    });
};

// Find a single Countries with an by id
exports.findOne = (req, res) => {
  const id = req.params.id;
  // var condition = name ? { name: { [Op.eq]: `${name}` } } : null;
  Countries.findAll({
    where: {
      id: id,
    },
  })
    .then((data) => {
      // res.send(data);
      res.send({
        status: 200,
        error: false,
        message: "Country Detail fetched successfully.",
        data: data,
      });
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving Countries.",
      });
    });
};

// Create a Language Name
exports.create = (req, res) => {
  var user_type = "Admin";
  if (!req.body) {
    res.status(400).send({ message: "Content cannot be empty" });
  } else if (!req.body.shortname) {
    res.status(400).send({ message: "Countries Name cannot be empty" });
  } else {
    const langVal = {
      shortname: req.body.shortname,
      name: req.body.name,
      isd_code: req.body.isd_code,
    };
    Countries.create(langVal).then((data) => {
      const auditTrailVal = {
        user_id: data.id,
        trail_type:
          user_type.charAt(0).toUpperCase() +
          user_type.slice(1) +
          "Countries Modules",
        trail_message:
          req.body.shortname +
          " " +
          req.body.name +
          " is Countries Modules as " +
          user_type.charAt(0).toUpperCase() +
          user_type.slice(1),
        status: 1,
      };
      AuditTrail.create(auditTrailVal, (err, data) => {});
      res.send(data);
    });
  }
};

// Update a Audit Trail by the id in the request
exports.update = (req, res) => {
  const id = req.params.id;
  var user_type = "Admin";
  Countries.update(req.body, {
    where: { id: id },
  })
    .then((num) => {
      if (num == 1) {
        const auditTrailVal = {
          user_id: req.params.id,
          trail_type:
            user_type.charAt(0).toUpperCase() +
            user_type.slice(1) +
            "Countries Modules",
          trail_message:
            req.body.shortname +
            " " +
            req.body.name +
            " is Countries Modules as " +
            user_type.charAt(0).toUpperCase() +
            user_type.slice(1),
          status: 1,
        };
        AuditTrail.create(auditTrailVal, (err, data) => {});
        res.send({
          message: "Countries was updated successfully.",
        });
      } else {
        res.send({
          message: `Cannot update Countries with id=${id}. Maybe Countries was not found or req.body is empty!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error updating Countries with id=" + id,
      });
    });
};

// Delete a Countries with the specified id in the request
exports.delete = (req, res) => {
  const id = req.params.id;
  var user_type = "Admin";
  Countries.destroy({
    where: { id: id },
  })
    .then((num) => {
      if (num == 1) {
        const auditTrailVal = {
          user_id: req.params.id,
          trail_type:
            user_type.charAt(0).toUpperCase() +
            user_type.slice(1) +
            "Countries Modules",
          trail_message:
            req.params.id +
            " " +
            " is Countries Modules as " +
            user_type.charAt(0).toUpperCase() +
            user_type.slice(1),
          status: 1,
        };
        AuditTrail.create(auditTrailVal, (err, data) => {});
        res.send({
          message: "Countries was deleted successfully!",
        });
      } else {
        res.send({
          message: `Cannot delete Countries with id=${id}. Maybe Countries was not found!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Could not delete Countries with id=" + id,
      });
    });
};
