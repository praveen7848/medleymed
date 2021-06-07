module.exports = (sequelize, Sequelize) => {
  const patient_history = sequelize.define(
    "patient_past_history",
    {
      patient_id: {
        allowNull: false,
        type: Sequelize.INTEGER,
      },
      doctor_id: {
        allowNull: true,
        type: Sequelize.INTEGER,
      },
      past_history: {
        allowNull: true,
        type: Sequelize.STRING,
      },
      clinic_id: {
        allowNull: true,
        type: Sequelize.INTEGER,
},
      patient_current_medication: {
        allowNull: true,
        // type: Sequelize.JSON,
        type: Sequelize.TEXT,
        get: function () {
          if(this.getDataValue("patient_current_medication")){
          return JSON.parse(this.getDataValue("patient_current_medication"));
          }
        },
        set: function (value) {
          return this.setDataValue(
            "patient_current_medication",
            JSON.stringify(value)
          );
        },
      },
      patient_drug_allergies: {
        allowNull: true,
        // type: Sequelize.JSON,
        type: Sequelize.TEXT,
        get: function () {
          if(this.getDataValue("patient_drug_allergies")){
          return JSON.parse(this.getDataValue("patient_drug_allergies"));
          }
        },
        set: function (value) {
          return this.setDataValue(
            "patient_drug_allergies",
            JSON.stringify(value)
          );
        },
      },
      patient_medical_document: {
        allowNull: true,
        // type: Sequelize.JSON,
        type: Sequelize.TEXT,
        get: function () {
          if(this.getDataValue("patient_medical_document")){
          return JSON.parse(this.getDataValue("patient_medical_document"));
          }
        },
        set: function (value) {
          return this.setDataValue(
            "patient_medical_document",
            JSON.stringify(value)
          );
        },
      },
      appointment_id: {
        allowNull: true,
        type: Sequelize.INTEGER,
      },
      appointment_status: {
        allowNull: true,
        defaultValue: "0",
        type: Sequelize.TINYINT(1),
      },
    },
    {
      // getterMethods: {
      //     patient_drug_allergies: function () { return  JSON.parse(this.getDataValue("patient_drug_allergies")); },
      //     patient_medical_document: function(){ return JSON.parse(this.getDataValue('patient_medical_document')); },
      //     patient_current_medication: function () { return  JSON.parse(this.getDataValue("patient_current_medication")); },
      //   },
      //   setterMethods: {
      //     patient_drug_allergies: function (value) { this.setDataValue("patient_drug_allergies", JSON.stringify(value)); },
      //     patient_medical_document: function (value) { this.setDataValue("patient_medical_document", JSON.stringify(value)); },
      //     patient_current_medication: function (value) { this.setDataValue("patient_current_medication", JSON.stringify(value)); },
      //   },
    }
  );
  return patient_history;
};
