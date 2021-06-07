var encryption = require("../helpers/Encryption");
const moment = require("moment");
module.exports = (sequelize, Sequelize) => {
  const tbl_users = sequelize.define(
    "tbl_users",
    {
      name: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      email: {
        unique: true,
        allowNull: true,
        type: Sequelize.STRING,
      },
      password: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      clinic_id	: {
        allowNull: true,
        type: Sequelize.INTEGER
      },
      user_type: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      mobile_number: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      device_registration_id: {
        allowNull: true,
        type: Sequelize.STRING,
      },
      mac_id: {
        allowNull: true,
        type: Sequelize.STRING,
      },
      otp :{
        allowNull:true,
        type: Sequelize.STRING(4)
      },
      otp_expiry: {
        allowNull:true,
        type: Sequelize.DATE
       
      },
      selected_language: {
        allowNull: true,
        type: Sequelize.STRING,
      },
      is_fingerprint_required: {
        allowNull: true,
        type: Sequelize.BOOLEAN,
      },
	  device_registration_id: {
		allowNull: true,
        type: Sequelize.STRING,
	  },
	  mac_id: {
		allowNull: true,
        type: Sequelize.STRING,
    },
    token: {
      allowNull: true,
      type: Sequelize.STRING,
    },
    token_exptime: {
      allowNull: true,
      type: Sequelize.STRING,
      },
      status: {
        allowNull: false,
        type: Sequelize.BOOLEAN,
      },
     
    },
    {
      getterMethods: {
		email: function () { return encryption.decryptData(this.getDataValue("email")); },
		mobile_number: function () { return encryption.decryptData(this.getDataValue("mobile_number")); },
		password: function () { return encryption.decryptData(this.getDataValue("password")); },
		user_type: function () { return encryption.decryptData(this.getDataValue("user_type")); },
		selected_language: function () { return encryption.decryptData(this.getDataValue("selected_language")); },
		otp: function () { return encryption.decryptData(this.getDataValue("otp")); },
        device_registration_id: function () { return encryption.decryptData(this.getDataValue("device_registration_id")); },
        mac_id: function () { return encryption.decryptData(this.getDataValue("mac_id")); }
      },
      setterMethods: {
        email: function (value) { this.setDataValue("email", encryption.encryptData(value)); },
        mobile_number: function (value) { this.setDataValue("mobile_number", encryption.encryptData(value)); },
        password: function (value) { this.setDataValue("password", encryption.encryptData(value)); },
        user_type: function (value) { this.setDataValue("user_type", encryption.encryptData(value)); },
        selected_language: function (value) { this.setDataValue("selected_language", encryption.encryptData(value)); },
        otp: function (value) { this.setDataValue("otp", encryption.encryptData(value)); },
        device_registration_id: function (value) { this.setDataValue("device_registration_id", encryption.encryptData(value)); },
        mac_id: function (value) { this.setDataValue("mac_id", encryption.encryptData(value)); }
      },
    }
  );

  return tbl_users;
};
