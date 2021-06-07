var encryption = require("../helpers/Encryption");
module.exports = (sequelize, Sequelize) => {
  const patient_address = sequelize.define(
    "patient_address",
    {
      name: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      phonenumber: {
        allowNull: true,
        type: Sequelize.STRING,
      },
      patient_id: {
        allowNull: true,
        type: Sequelize.INTEGER,
      },
      address_name: {
        allowNull: true,
        type: Sequelize.STRING,
      },
      address: {
        allowNull: true,
        type: Sequelize.TEXT,
      },
      area: {
        allowNull: true,
        type: Sequelize.STRING,
      },
      city: {
        allowNull: true,
        type: Sequelize.STRING,
      },
      state: {
        allowNull: true,
        type: Sequelize.STRING,
      },
       pincode: {
        allowNull: true,
        type: Sequelize.STRING,
      },
      lat_long: {
        allowNull: true,
        type: Sequelize.STRING,
      },
      is_default: {
        allowNull: true,
        type: Sequelize.BOOLEAN,
        defaultValue:0
      },
    },
    {
      getterMethods: {
        name: function () { return encryption.decryptData(this.getDataValue("name")); },
        phonenumber: function () { return encryption.decryptData(this.getDataValue("phonenumber")); },
        address: function () { return encryption.decryptData(this.getDataValue("address")); },
        address_name: function () { return encryption.decryptData(this.getDataValue("address_name")); },
        area: function () { return encryption.decryptData(this.getDataValue("area")); },
        city: function () { return encryption.decryptData(this.getDataValue("city")); },
        state: function () { return encryption.decryptData(this.getDataValue("state")); },
        pincode: function () { return encryption.decryptData(this.getDataValue("pincode")); },
      },
      setterMethods: {
        name: function (value) { this.setDataValue("name", encryption.encryptData(value)); },
        phonenumber: function (value) { this.setDataValue("phonenumber", encryption.encryptData(value)); },
        address_name: function (value) { this.setDataValue("address_name", encryption.encryptData(value)); },
        address: function (value) { this.setDataValue("address", encryption.encryptData(value)); },
        area: function (value) { this.setDataValue("area", encryption.encryptData(value)); },
        city: function (value) { this.setDataValue("city", encryption.encryptData(value)); },
        state: function (value) { this.setDataValue("state", encryption.encryptData(value)); },
        pincode: function (value) { this.setDataValue("pincode", encryption.encryptData(value)); },
      },
    }
  );

  return patient_address;
};
