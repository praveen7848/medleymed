var encryption = require("../helpers/Encryption");
module.exports = (sequelize, Sequelize) => {
  const doctor_refund_table = sequelize.define(
    "doctor_refund_table",
    {
        doctor_id: {
        allowNull: true,
        type: Sequelize.INTEGER,
      },
      is_active	: {
        allowNull: true,
        type: Sequelize.BOOLEAN,
      },
      patient_reschedule_time	: {
        allowNull: true,
        type: Sequelize.STRING,
      },
      patient_cancel_3hr	: {
        allowNull: true,
        type: Sequelize.STRING,
      },
      patient_cancel_3hr_12hr	: {
        allowNull: true,
        type: Sequelize.STRING,
      },
      patient_cancel_12hr_24hr	: {
        allowNull: true,
        type: Sequelize.INTEGER,
      },
      patient_cancel_consult_now	: {
        allowNull: true,
        type: Sequelize.DATE,
      },
      doctor_cancel_3hr	: {
        allowNull: true,
        type: Sequelize.INTEGER,
      },
      doctor_cancel_12hr	: {
        allowNull: true,
        type: Sequelize.STRING,
      },
      doctor_cancel_12hr_24hr	: {
        allowNull: true,
        type: Sequelize.STRING,
      }
      
    },
    // {
    //   getterMethods: { 
    //     starting_experience: function () { return encryption.decryptData(this.getDataValue("starting_experience")); }, 
    //     ending_experience: function () { return encryption.decryptData(this.getDataValue("ending_experience")); }, 
    //   },
    //   setterMethods: {
    //     starting_experience: function (value) { this.setDataValue("starting_experience", encryption.encryptData(value)); },
    //     ending_experience: function (value) { this.setDataValue("ending_experience", encryption.encryptData(value)); },
    //   },
    // }
  );
  return doctor_refund_table;
};
