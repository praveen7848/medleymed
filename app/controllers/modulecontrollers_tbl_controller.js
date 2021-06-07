
const db = require("../models");

const User = db.users_tbl;
const modulecontroller_tbl = db.module_controller_tbl;

exports.findAll = (req, res) => {
  // const id = req.params.id;
  // //User.hasOne(Doctor, {foreignKey: 'user_id'});
  // Doctor.belongsTo(User, { foreignKey: "user_id" });
  // includeVal = Doctor;

  modulecontroller_tbl.findAll({})
    .then((data) => {
   
     res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error retrieving User with id=" + id,
      });
    });
};