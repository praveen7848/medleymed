module.exports = (sequelize, Sequelize) => {
  const symptoms_tbl = sequelize.define("symptoms_tbl", {
    patient_id: {
      allowNull: false,
      type: Sequelize.STRING,
    },
    doctor_id: {
      allowNull: true,
      type: Sequelize.STRING,
    },
    symptoms: {
      allowNull: false,
      type: Sequelize.TEXT,
      get: function () {
        if (this.getDataValue("symptoms")) {
          return JSON.parse(this.getDataValue("symptoms"));
        }
      },
      set: function (value) {
        return this.setDataValue("symptoms", JSON.stringify(value));
      },
    },
    patient_lab_tests: {
      allowNull: true,
      type: Sequelize.TEXT,
      get: function () {
        if (this.getDataValue("patient_lab_tests")) {
          return JSON.parse(this.getDataValue("patient_lab_tests"));
        }
      },
      set: function (value) {
        return this.setDataValue("patient_lab_tests", JSON.stringify(value));
      },
    },
    add_more_symptoms: {
      allowNull: true,
      type: Sequelize.STRING,
    },
    suggestive_api_data: {
      allowNull: true,
      type: Sequelize.TEXT("long"),
    },
    question: {
      allowNull: true,
      type: Sequelize.TEXT("long"),
    },
    infermedica_suggestive_diagnosis: {
      allowNull: true,
      type: Sequelize.TEXT("long"),
    },
    doctor_diagnosis: {
      allowNull: true,
      type: Sequelize.TEXT,
    },
    doctor_advice: {
      allowNull: true,
      type: Sequelize.TEXT,
    },
    module_type: {
      allowNull: true,
      type: Sequelize.STRING,
    },
    clinic_id: {
      allowNull: true,
      type: Sequelize.INTEGER,
    },
    appointment_id: {
      type: Sequelize.INTEGER,
    },
    appointment_status: {
      allowNull: false,
      defaultValue: "0",
      type: Sequelize.TINYINT(1),
    },
  });
  return symptoms_tbl;
};
