var encryption = require("../helpers/Encryption");
module.exports = (sequelize, Sequelize) => {
  const appointment_feedback_tbl = sequelize.define(
    "appointment_feedback_tbl",
    {
      doctor_id: {
        allowNull: false,
        type: Sequelize.INTEGER,
      },
      patient_id: {
        allowNull: false,
        type: Sequelize.INTEGER,
      },
      title: {
        allowNull: true,
        type: Sequelize.STRING,
      },
      feedback: {
        allowNull: true,
        type: Sequelize.STRING,
      },
      row_id: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      rating:{
        allowNull: false,
        type: Sequelize.INTEGER,
      }
    },
    {
      getterMethods: {
        title: function () {
          return encryption.decryptData(this.getDataValue("title"));
        },
        feedback: function () {
          return encryption.decryptData(this.getDataValue("feedback"));
        },
      },
      setterMethods: {
        title: function (value) {
          this.setDataValue("title", encryption.encryptData(value));
        },
        feedback: function (value) {
          this.setDataValue("feedback", encryption.encryptData(value));
        },
      },
    }
  );
  return appointment_feedback_tbl;
};
