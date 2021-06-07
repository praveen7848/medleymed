//var encryption = require("../helpers/Encryption");
module.exports = (sequelize, Sequelize) => {
  const patient_appointment_tbl = sequelize.define("consultnow_draft_tbl", {
    patient_id: {
      allowNull: false,
      type: Sequelize.STRING,
    },
    master_patient_id: {
      allowNull: false,
      type: Sequelize.STRING,
    },
    patient_name: {
      allowNull: false,
      type: Sequelize.STRING,
    },
    patient_age: {
      allowNull: false,
      type: Sequelize.STRING,
    },
    doctor_id: {
      allowNull: false,
      type: Sequelize.STRING,
    },
    doctor_name: {
      allowNull: false,
      type: Sequelize.STRING,
    },
    clinic_id: {
      allowNull: true,
      type: Sequelize.STRING,
    },
    appointment_date: {
      allowNull: false,
      type: Sequelize.DATEONLY,
    },
    appointment_time: {
      allowNull: false,
      type: Sequelize.TIME,
    },
    appointment_id: {
      allowNull: true,
      type: Sequelize.STRING,
    },
    status: {
      allowNull: true,
      type: Sequelize.INTEGER,
      defaultValue: "0",
    },
  });
  return patient_appointment_tbl;
};
