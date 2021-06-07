var encryption = require("../helpers/Encryption");
module.exports = (sequelize, Sequelize) => {
  const favourite_doctor_tbl = sequelize.define(
    "favourite_doctor_tbl",
    {
      patient_id: {
        allowNull: false,
        type: Sequelize.INTEGER,
      },
      doctor_id	: {
        allowNull: false,
        type: Sequelize.INTEGER,
      },
    },
  );
  return favourite_doctor_tbl;
};
