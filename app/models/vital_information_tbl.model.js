var encryption = require("../helpers/Encryption");
module.exports = (sequelize, Sequelize) => {
  const vital_information = sequelize.define(
    "vital_information",
    {
      patient_id: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      doctor_id: {
        allowNull: true,
        type: Sequelize.STRING,
      },
      prescription_id: {
        allowNull: true,
        type: Sequelize.STRING,
      },
      pulse_rate: {
        allowNull: true,
        type: Sequelize.STRING,
      },
      skip_pulse: {
        allowNull: true,
        type: Sequelize.STRING,
      },
      blood_pressure_systolic: {
        allowNull: true,
        type: Sequelize.STRING,
      },
      blood_pressure_diastolic: {
        allowNull: true,
        type: Sequelize.STRING,
      },
      skip_blood_pressure: {
        allowNull: true,
        type: Sequelize.STRING,
      },
      temperature: {
        allowNull: true,
        type: Sequelize.STRING,
      },

      skip_temperature: {
        allowNull: true,
        type: Sequelize.STRING,
      },
      blood_sugar: {
        allowNull: true,
        type: Sequelize.STRING,
      },
      respiratory_rate: {
        allowNull: true,
        type: Sequelize.STRING,
      },
      skip_respiratory_rate: {
        allowNull: true,
        type: Sequelize.STRING,
      },
      height: {
        allowNull: true,
        type: Sequelize.STRING,
      },
      skip_height: {
        allowNull: true,
        type: Sequelize.STRING,
      },
      weight: {
        allowNull: true,
        type: Sequelize.STRING,
      },
      skip_weight: {
        allowNull: true,
        type: Sequelize.STRING,
      },
      bmi: {
        allowNull: true,
        type: Sequelize.STRING,
      },
      appointment_id: {
        type: Sequelize.INTEGER,
      },
      appointment_status: {
        allowNull: false,
        defaultValue: "0",
        type: Sequelize.TINYINT(1),
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
        prescription_id: function () {
          return encryption.decryptData(this.getDataValue("prescription_id"));
        },
        pulse_rate: function () {
          return encryption.decryptData(this.getDataValue("pulse_rate"));
        },
        blood_sugar: function () {
          return encryption.decryptData(this.getDataValue("blood_sugar"));
        },
        skip_pulse: function () {
          return encryption.decryptData(this.getDataValue("skip_pulse"));
        },
        blood_pressure_systolic: function () {
          return encryption.decryptData(
            this.getDataValue("blood_pressure_systolic")
          );
        },
        blood_pressure_diastolic: function () {
          return encryption.decryptData(
            this.getDataValue("blood_pressure_diastolic")
          );
        },
        skip_blood_pressure: function () {
          return encryption.decryptData(
            this.getDataValue("skip_blood_pressure")
          );
        },
        temperature: function () {
          return encryption.decryptData(this.getDataValue("temperature"));
        },
        skip_temperature: function () {
          return encryption.decryptData(this.getDataValue("skip_temperature"));
        },
        respiratory_rate: function () {
          return encryption.decryptData(this.getDataValue("respiratory_rate"));
        },
        skip_respiratory_rate: function () {
          return encryption.decryptData(
            this.getDataValue("skip_respiratory_rate")
          );
        },
        height: function () {
          return encryption.decryptData(this.getDataValue("height"));
        },
        skip_height: function () {
          return encryption.decryptData(this.getDataValue("skip_height"));
        },
        weight: function () {
          return encryption.decryptData(this.getDataValue("weight"));
        },
        skip_weight: function () {
          return encryption.decryptData(this.getDataValue("skip_weight"));
        },
        bmi: function () {
          return encryption.decryptData(this.getDataValue("bmi"));
        },
      },
      setterMethods: {
        prescription_id: function (value) {
          this.setDataValue("prescription_id", encryption.encryptData(value));
        },
        pulse_rate: function (value) {
          this.setDataValue("pulse_rate", encryption.encryptData(value));
        },
        skip_pulse: function (value) {
          this.setDataValue("skip_pulse", encryption.encryptData(value));
        },
        blood_pressure_systolic: function (value) {
          this.setDataValue(
            "blood_pressure_systolic",
            encryption.encryptData(value)
          );
        },
        blood_pressure_diastolic: function (value) {
          this.setDataValue(
            "blood_pressure_diastolic",
            encryption.encryptData(value)
          );
        },
        blood_sugar: function (value) {
          this.setDataValue("blood_sugar", encryption.encryptData(value));
        },
        skip_blood_pressure: function (value) {
          this.setDataValue(
            "skip_blood_pressure",
            encryption.encryptData(value)
          );
        },
        temperature: function (value) {
          this.setDataValue("temperature", encryption.encryptData(value));
        },
        skip_temperature: function (value) {
          this.setDataValue("skip_temperature", encryption.encryptData(value));
        },
        respiratory_rate: function (value) {
          this.setDataValue("respiratory_rate", encryption.encryptData(value));
        },
        skip_respiratory_rate: function (value) {
          this.setDataValue(
            "skip_respiratory_rate",
            encryption.encryptData(value)
          );
        },
        height: function (value) {
          this.setDataValue("height", encryption.encryptData(value));
        },
        skip_height: function (value) {
          this.setDataValue("skip_height", encryption.encryptData(value));
        },
        weight: function (value) {
          this.setDataValue("weight", encryption.encryptData(value));
        },
        skip_weight: function (value) {
          this.setDataValue("skip_weight", encryption.encryptData(value));
        },
        bmi: function (value) {
          this.setDataValue("bmi", encryption.encryptData(value));
        },
      },
    }
  );
  return vital_information;
};
