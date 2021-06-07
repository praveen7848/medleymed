const Sequelize = require('sequelize');
const db = require("../models");
const Time_zones = db.timezone_tbl;
const Op = Sequelize.Op;
const AuditTrail = db.audit_trails;
// Retrieve all Time_zones
exports.findAll = (req, res) => { 
    Time_zones.findAll({ attributes:['id','timezone']})
      .then((data) => {
        res.send(data);
      })
      .catch((err) => {
        res.status(500).send({
          message:
            err.message || "Some error occurred while retrieving Time_zones List.",
        });
      });
  };
