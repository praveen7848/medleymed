// const { TrunkInstance } = require("twilio/lib/rest/trunking/v1/trunk");
var encryption = require("../helpers/Encryption");
module.exports = (sequelize, Sequelize) => {
  const clinic_tbl = sequelize.define(
    "clinic_tbl",
    {
      user_tbl_id: {
        allowNull: true,
        type: Sequelize.INTEGER,
      },
      corporate_clinic_id: {
        allowNull: true,
        type: Sequelize.STRING,
      },
      clinic_name: {
        unique: false,
        allowNull: false,
        type: Sequelize.STRING,
      },
      address: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      pincode: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      timezone_name: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      // timezone_value: {
      //   allowNull: false,
      //   type: Sequelize.STRING,
      // },
      selected_language_id: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      selected_language_name: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      speciality_id:{
        allowNull: false,
        type: Sequelize.INTEGER,
      },
      // speciality_name:{
      //   allowNull: false,
      //   type: Sequelize.STRING,
      // },
      no_of_doctors: {
        allowNull: true,
        type: Sequelize.STRING,
      },
      no_of_nurses: {
        allowNull: true,
        type: Sequelize.STRING,
      },
      mobile_no1: {
        allowNull: true,
        type: Sequelize.STRING,
      },
      mobile_no2: {
        allowNull: true,
        type: Sequelize.STRING,
      },
      mobile_no3: {
        allowNull: true,
        type: Sequelize.STRING,
      },
      mobile_no4: {
        allowNull: true,
        type: Sequelize.STRING,
      },
      mobile_no5: {
        allowNull: true,
        type: Sequelize.STRING,
      },
      email1: {
        allowNull: true,
        type: Sequelize.STRING,
      },
      email2: {
        allowNull: true,
        type: Sequelize.STRING,
      },
      email3: {
        allowNull: true,
        type: Sequelize.STRING,
      },
      email4: {
        allowNull: true,
        type: Sequelize.STRING,
      },
      email5: {
        allowNull: true,
        type: Sequelize.STRING,
      },
      // clinic_speciality: {
      //   allowNull: false,
      //   type: Sequelize.STRING,
      // },
      clinic_logo: {
        allowNull: true,
        type: Sequelize.STRING,
      },
      username: {
        allowNull: true,
        type: Sequelize.STRING,
      },
      password: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      clinic_phone_no: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      clinic_registration_no: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      kyc_detail_id: {
        allowNull: true,
        type: Sequelize.STRING,
      },
      email_id: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      clinic_website: {
        allowNull: true,
        type: Sequelize.STRING,
      },
      opened_at: {
        allowNull: true,
        type: Sequelize.STRING,
      },
      closed_at: {
        allowNull: true,
        type: Sequelize.STRING,
      },
      clinic_type: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      status: {
        allowNull: true,
        type: Sequelize.STRING,
      },
      // role: {
      //     allowNull: true,
      //     type: Sequelize.STRING,
      // },
      latitude: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      longitude: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      kyc_status: {
        allowNull: true,
        type: Sequelize.STRING,
      },
      // lat: {
      //     allowNull: false,
      //     type: Sequelize.STRING,
      // },
      // lng: {
      //     allowNull: false,
      //     type: Sequelize.STRING,
      // },
    },
    {
      getterMethods: {
        clinic_name: function () {
          return encryption.decryptData(this.getDataValue("clinic_name"));
        },
        timezone_name: function () {
          return encryption.decryptData(this.getDataValue("timezone_name"));
        },
        selected_language_name: function () {
          return encryption.decryptData(
            this.getDataValue("selected_language_name")
          );
        },
        address: function () {
          return encryption.decryptData(this.getDataValue("address"));
        },
        pincode: function () {
          return encryption.decryptData(this.getDataValue("pincode"));
        },
        lng: function () {
          return encryption.decryptData(this.getDataValue("lng"));
        },
        lat: function () {
          return encryption.decryptData(this.getDataValue("lat"));
        },
        kyc_status: function () {
          return encryption.decryptData(this.getDataValue("kyc_status"));
        },
        // role: function () { return encryption.decryptData(this.getDataValue("role")); },
        status: function () {
          return encryption.decryptData(this.getDataValue("status"));
        },
        clinic_type: function () {
          return encryption.decryptData(this.getDataValue("clinic_type"));
        },
        closed_at: function () {
          return encryption.decryptData(this.getDataValue("closed_at"));
        },
        opened_at: function () {
          return encryption.decryptData(this.getDataValue("opened_at"));
        },
        clinic_website: function () {
          return encryption.decryptData(this.getDataValue("clinic_website"));
        },
        clinic_speciality: function () {
          return encryption.decryptData(this.getDataValue("clinic_speciality"));
        },
        // clinic_logo: function () { return encryption.decryptData(this.getDataValue("clinic_logo")); },
        mobile_no1: function () {
          return encryption.decryptData(this.getDataValue("mobile_no1"));
        },
        mobile_no2: function () {
          return encryption.decryptData(this.getDataValue("mobile_no2"));
        },
        mobile_no3: function () {
          return encryption.decryptData(this.getDataValue("mobile_no3"));
        },
        mobile_no4: function () {
          return encryption.decryptData(this.getDataValue("mobile_no4"));
        },
        mobile_no5: function () {
          return encryption.decryptData(this.getDataValue("mobile_no5"));
        },
        email1: function () {
          return encryption.decryptData(this.getDataValue("email1"));
        },
        email2: function () {
          return encryption.decryptData(this.getDataValue("email2"));
        },
        email3: function () {
          return encryption.decryptData(this.getDataValue("email3"));
        },
        email4: function () {
          return encryption.decryptData(this.getDataValue("email4"));
        },
        email5: function () {
          return encryption.decryptData(this.getDataValue("email5"));
        },
        // username: function () { return encryption.decryptData(this.getDataValue("username")); },
        password: function () {
          return encryption.decryptData(this.getDataValue("password"));
        },
        clinic_phone_no: function () {
          return encryption.decryptData(this.getDataValue("clinic_phone_no"));
        },
        clinic_registration_no: function () {
          return encryption.decryptData(
            this.getDataValue("clinic_registration_no")
          );
        },
        email_id: function () {
          return encryption.decryptData(this.getDataValue("email_id"));
        },
        latitude: function () {
          return encryption.decryptData(this.getDataValue("latitude"));
        },
        longitude: function () {
          return encryption.decryptData(this.getDataValue("longitude"));
        },
      },
      setterMethods: {
        clinic_name: function (value) {
          this.setDataValue("clinic_name", encryption.encryptData(value));
        },
        selected_language_name: function (value) {
          this.setDataValue(
            "selected_language_name",
            encryption.encryptData(value)
          );
        },
        timezone_name: function (value) {
          this.setDataValue("timezone_name", encryption.encryptData(value));
        },
        address: function (value) {
          this.setDataValue("address", encryption.encryptData(value));
        },
        pincode: function (value) {
          this.setDataValue("pincode", encryption.encryptData(value));
        },
        mobile_no1: function (value) {
          this.setDataValue("mobile_no1", encryption.encryptData(value));
        },
        mobile_no2: function (value) {
          this.setDataValue("mobile_no2", encryption.encryptData(value));
        },
        mobile_no3: function (value) {
          this.setDataValue("mobile_no3", encryption.encryptData(value));
        },
        mobile_no4: function (value) {
          this.setDataValue("mobile_no4", encryption.encryptData(value));
        },
        mobile_no5: function (value) {
          this.setDataValue("mobile_no5", encryption.encryptData(value));
        },
        lng: function (value) {
          this.setDataValue("lng", encryption.encryptData(value));
        },
        lat: function (value) {
          this.setDataValue("lat", encryption.encryptData(value));
        },
        kyc_status: function (value) {
          this.setDataValue("kyc_status", encryption.encryptData(value));
        },
        // role: function (value) { this.setDataValue("role", encryption.encryptData(value)); },
        status: function (value) {
          this.setDataValue("status", encryption.encryptData(value));
        },
        clinic_type: function (value) {
          this.setDataValue("clinic_type", encryption.encryptData(value));
        },
        closed_at: function (value) {
          this.setDataValue("closed_at", encryption.encryptData(value));
        },
        opened_at: function (value) {
          this.setDataValue("opened_at", encryption.encryptData(value));
        },
        clinic_website: function (value) {
          this.setDataValue("clinic_website", encryption.encryptData(value));
        },
        clinic_speciality: function (value) {
          this.setDataValue("clinic_speciality", encryption.encryptData(value));
        },
        // clinic_logo: function (value) { this.setDataValue("clinic_logo", encryption.encryptData(value)); },
        email1: function (value) {
          this.setDataValue("email1", encryption.encryptData(value));
        },
        email2: function (value) {
          this.setDataValue("email2", encryption.encryptData(value));
        },
        email3: function (value) {
          this.setDataValue("email3", encryption.encryptData(value));
        },
        email4: function (value) {
          this.setDataValue("email4", encryption.encryptData(value));
        },
        email5: function (value) {
          this.setDataValue("email5", encryption.encryptData(value));
        },
        // username: function (value) { this.setDataValue("username", encryption.encryptData(value)); },
        password: function (value) {
          this.setDataValue("password", encryption.encryptData(value));
        },
        clinic_phone_no: function (value) {
          this.setDataValue("clinic_phone_no", encryption.encryptData(value));
        },
        clinic_registration_no: function (value) {
          this.setDataValue(
            "clinic_registration_no",
            encryption.encryptData(value)
          );
        },
        email_id: function (value) {
          this.setDataValue("email_id", encryption.encryptData(value));
        },
        latitude: function (value) {
          this.setDataValue("latitude", encryption.encryptData(value));
        },
        longitude: function (value) {
          this.setDataValue("longitude", encryption.encryptData(value));
        },
      },
    }
  );

  return clinic_tbl;
};
