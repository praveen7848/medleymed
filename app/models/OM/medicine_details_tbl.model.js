var encryption = require("../../helpers/Encryption");

module.exports = (sequelize, Sequelize) => {
  const medicine_details = sequelize.define(
    "medicine_details",
    {
      user_subadmin_id: {
        allowNull: true,
        type: Sequelize.INTEGER,
      },
      patient_id: {
        allowNull: false,
        type: Sequelize.INTEGER,
      },
      doctor_id: {
        allowNull: false,
        type: Sequelize.INTEGER,
      },
      prescription_id: {
        allowNull: true,
        type: Sequelize.INTEGER,
      },
      medicine_id: {
        allowNull: true,
        type: Sequelize.INTEGER,
      },
      medicine_name: {
        allowNull: true,
        type: Sequelize.STRING,
      },
      medicine_type: {
        allowNull: true,
        type: Sequelize.STRING,
      },
      strength: {
        allowNull: true,
        type: Sequelize.STRING,
      },
      route: {
        allowNull: true,
        type: Sequelize.STRING,
      },
      frequency: {
        allowNull: true,
        type: Sequelize.STRING,
      },
      quantity: {
        allowNull: true,
        type: Sequelize.STRING,
      },
      duration: {
        allowNull: true,
        type: Sequelize.STRING,
      },
      refill: {
        allowNull: true,
        type: Sequelize.STRING,
      },
      patient_type: {
        allowNull: true,
        type: Sequelize.STRING,
      },
      created_datetime: {
        allowNull: true,
        type: Sequelize.DATE,
      },
      modified_datetime: {
        allowNull: true,
        type: Sequelize.DATE,
      },
      appointment_unique_id: {
        allowNull: true,
        type: Sequelize.STRING,
      },
      food: {
        allowNull: true,
        type: Sequelize.STRING,
      },
      shift_one: {
        allowNull: true,
        type: Sequelize.STRING,
      },
      shift_two: {
        allowNull: true,
        type: Sequelize.STRING,
      },
      shift_three: {
        allowNull: true,
        type: Sequelize.STRING,
      },
      clinic_id: {
        allowNull: true,
        type: Sequelize.INTEGER,
      },
      module_type: {
        allowNull: true,
        type: Sequelize.STRING,
      },
    },

    {
      getterMethods: {
        patient_type: function () {
          return encryption.decryptData(this.getDataValue("patient_type"));
        },
      },
      setterMethods: {
        patient_type: function (value) {
          this.setDataValue("patient_type", encryption.encryptData(value));
        },
      },
    }
  );
  return medicine_details;
};
