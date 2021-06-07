var encryption = require("../helpers/Encryption");
//const { TEXT } = require("sequelize/types");
module.exports = (sequelize, Sequelize) => {
  const patient_tbl = sequelize.define(
    "patient_tbl",
    {
      user_id: {
        allowNull: true,
        type: Sequelize.INTEGER,
      },
      name: {
        allowNull: true,
        type: Sequelize.STRING,
      },
      phone_number: {
        allowNull: true,
        type: Sequelize.STRING,
      },
      last_name: {
        allowNull: true,
        type: Sequelize.STRING,
      },
      dob: {
        allowNull: true,
        type: Sequelize.DATE,
      },
      gender: {
        allowNull: true,
        type: Sequelize.STRING,
      },
      profile_pic: {
        allowNull: true,
        type: Sequelize.STRING,
        //type: Sequelize.BLOB,
      },

      area: {
        allowNull: true,
        type: Sequelize.STRING,
      },
      state: {
        allowNull: true,
        type: Sequelize.STRING,
      },
      zip_code: {
        allowNull: true,
        type: Sequelize.STRING,
      },
      lat_long: {
        allowNull: true,
        type: Sequelize.STRING,
      },
      marital_status: {
        allowNull: true,
        type: Sequelize.STRING,
      },
      nationality: {
        allowNull: true,
        type: Sequelize.STRING,
      },
      occupation: {
        allowNull: true,
        type: Sequelize.STRING,
      },
      adhaar_no: {
        allowNull: true,
        type: Sequelize.STRING,
      },
      relation: {
        allowNull: true,
        type: Sequelize.INTEGER,
      },
      relation_patient_id: {
        allowNull: true,
        type: Sequelize.INTEGER,
      },
      chornic_diseases_list: {
        allowNull: true,
        type: Sequelize.TEXT("long"),
      },

      // related_medication: {
      //   allowNull: true,
      //   type: Sequelize.TEXT('long'),
      // },
      // drug_allergies : {
      //   allowNull: true,
      //   type: Sequelize.TEXT('long'),
      // },
      related_medication: {
        allowNull: true,
        type: Sequelize.TEXT,
        get: function () {
          if (typeof this.getDataValue("related_medication") !== "undefined") {
            return JSON.parse(this.getDataValue("related_medication"));
          }
        },
        set: function (value) {
          if (this.setDataValue("related_medication", JSON.stringify(value))) {
            return this.setDataValue(
              "related_medication",
              JSON.stringify(value)
            );
          }
        },
        // defaultValue: [],
      },
      drug_allergies: {
        allowNull: true,
        type: Sequelize.TEXT,
        get: function () {
          if (typeof this.getDataValue("drug_allergies") !== "undefined") {
            return JSON.parse(this.getDataValue("drug_allergies"));
          }
        },
        set: function (value) {
          if (this.setDataValue("drug_allergies", JSON.stringify(value))) {
            return this.setDataValue("drug_allergies", JSON.stringify(value));
          }
        },
        // defaultValue: [],
      },
      arogya_sri_no: {
        allowNull: true,
        type: Sequelize.STRING,
      },
      status: {
        allowNull: true,
        type: Sequelize.BOOLEAN,
      },
    },
    {
      getterMethods: {
        name: function () {
          return encryption.decryptData(this.getDataValue("name"));
        },
        phone_number: function () {
          return encryption.decryptData(this.getDataValue("phone_number"));
        },
        last_name: function () {
          return encryption.decryptData(this.getDataValue("last_name"));
        },
        area: function () {
          return encryption.decryptData(this.getDataValue("area"));
        },
        state: function () {
          return encryption.decryptData(this.getDataValue("state"));
        },
        zip_code: function () {
          return encryption.decryptData(this.getDataValue("zip_code"));
        },
        gender: function () {
          return encryption.decryptData(this.getDataValue("gender"));
        },
        marital_status: function () {
          return encryption.decryptData(this.getDataValue("marital_status"));
        },
        nationality: function () {
          return encryption.decryptData(this.getDataValue("nationality"));
        },
        occupation: function () {
          return encryption.decryptData(this.getDataValue("occupation"));
        },
        adhaar_no: function () {
          return encryption.decryptData(this.getDataValue("adhaar_no"));
        },
        arogya_sri_no: function () {
          return encryption.decryptData(this.getDataValue("arogya_sri_no"));
        },
        //profile_pic: function(){ return encryption.decryptData(this.getDataValue('profile_pic')); },

        // related_medication: function () { return JSON.parse(this.getDataValue("related_medication")); },
        // drug_allergies: function () { return JSON.parse(this.getDataValue("drug_allergies")); },
      },
      setterMethods: {
        name: function (value) {
          this.setDataValue("name", encryption.encryptData(value));
        },
        phone_number: function (value) {
          this.setDataValue("phone_number", encryption.encryptData(value));
        },
        last_name: function (value) {
          this.setDataValue("last_name", encryption.encryptData(value));
        },
        gender: function (value) {
          this.setDataValue("gender", encryption.encryptData(value));
        },
        area: function (value) {
          this.setDataValue("area", encryption.encryptData(value));
        },

        state: function (value) {
          this.setDataValue("state", encryption.encryptData(value));
        },
        zip_code: function (value) {
          this.setDataValue("zip_code", encryption.encryptData(value));
        },
        marital_status: function (value) {
          this.setDataValue("marital_status", encryption.encryptData(value));
        },
        nationality: function (value) {
          this.setDataValue("nationality", encryption.encryptData(value));
        },
        occupation: function (value) {
          this.setDataValue("occupation", encryption.encryptData(value));
        },
        adhaar_no: function (value) {
          this.setDataValue("adhaar_no", encryption.encryptData(value));
        },
        arogya_sri_no: function (value) {
          this.setDataValue("arogya_sri_no", encryption.encryptData(value));
        },
        //profile_pic: function(value){ this.setDataValue('profile_pic', encryption.encryptData(value)); },

        // drug_allergies: function (value) {  this.setDataValue("drug_allergies", JSON.stringify(value)); },
        // related_medication: function (value) {  this.setDataValue("related_medication", JSON.stringify(value)); },
      },
    }
  );

  return patient_tbl;
};
