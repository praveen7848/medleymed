//var encryption = require("../helpers/Encryption");
module.exports = (sequelize, Sequelize) => {
  const patient_appointment_tbl = sequelize.define("patient_appointment_tbl", {
    patient_id: {
      allowNull: false,
      type: Sequelize.STRING,
    },
    doctor_id: {
      allowNull: false,
      type: Sequelize.STRING,
    },
    appointment_datetime: {
      allowNull: false,
      type: Sequelize.STRING,
    },
    next_appointment_datetime: {
      allowNull: true,
      type: Sequelize.STRING,
    },
    doctor_advice: {
      allowNull: true,
      type: Sequelize.STRING,
    },
    prescription_id: {
      allowNull: true,
      type: Sequelize.STRING,
    },
    login_person_id: {
      allowNull: true,
      type: Sequelize.INTEGER,
    },
    appointment_cancel_reason: {
      allowNull: true,
      type: Sequelize.STRING,
    },
    appointment_confirm_id: {
      allowNull: true,
      type: Sequelize.STRING,
    },
    medicine_desc: {
      allowNull: true,
      type: Sequelize.STRING,
    },
    diseases_desc: {
      allowNull: true,
      type: Sequelize.STRING,
    },
    final_diagnosis: {
      allowNull: true,
      type: Sequelize.STRING,
    },
    consultation_fee: {
      allowNull: false,
      type: Sequelize.INTEGER,
    },
    transaction_id: {
      allowNull: true,
      type: Sequelize.STRING,
    },
    amount: {
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
    patient_consent: {
      allowNull: true,
      type: Sequelize.INTEGER,
    },
    doctorconsentrequest: {
      allowNull: true,
      type: Sequelize.INTEGER,
    },
    status: {
      allowNull: true,
      type: Sequelize.INTEGER,
    },
  });
  return patient_appointment_tbl;
};
