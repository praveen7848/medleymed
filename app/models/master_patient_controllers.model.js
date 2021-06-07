var encryption = require("../helpers/Encryption");
module.exports = (sequelize, Sequelize) => {
  const master_patient_controllers = sequelize.define(
    "master_patient_controllers",
    {
      patient_controller_name: {
        allowNull: true,
        type: Sequelize.STRING,
      },
      patient_controller_unique_id: {
        allowNull: true,
        type: Sequelize.STRING,
      },
      patient_controller_sequence: {
        allowNull: true,
        type: Sequelize.INTEGER,
      },
      required: {
        allowNull: true,
        type: Sequelize.BOOLEAN,
      },
      status: {
        allowNull: true,
        type: Sequelize.BOOLEAN,
      },
    },
    {
      getterMethods: { 
        patient_controller_name: function () { return encryption.decryptData(this.getDataValue("patient_controller_name")); }, 
        patient_controller_unique_id: function () { return encryption.decryptData(this.getDataValue("patient_controller_unique_id")); }, 
        patient_controller_sequence: function () { return encryption.decryptData(this.getDataValue("patient_controller_sequence")); }, 
      },
      setterMethods: {
       patient_controller_name: function (value) { this.setDataValue("patient_controller_name", encryption.encryptData(value)); },
       patient_controller_unique_id: function (value) { this.setDataValue("patient_controller_unique_id", encryption.encryptData(value)); },
       patient_controller_sequence: function (value) { this.setDataValue("patient_controller_sequence", encryption.encryptData(value)); },
      },
    }
  );
  return master_patient_controllers;
};
