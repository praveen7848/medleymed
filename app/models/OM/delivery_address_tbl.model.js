var encryption = require("../../helpers/Encryption");
module.exports = (sequelize, Sequelize) => {
  const delivery_address_tbl = sequelize.define(
    "delivery_address_tbl",
    {
      name:{
        allowNull: false,
        type: Sequelize.STRING,
      },
      patient_id: {
        allowNull: false,
        type: Sequelize.INTEGER,
      },
      mobile_no: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      location: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      address: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      landmark: {
        allowNull: true,
        type: Sequelize.STRING,
      },
      latitude: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      longitude: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      address_type: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      default_status: {
        allowNull: false,
        type: Sequelize.TINYINT(1),
        defaultValue: "0",
      },
      status: {
        allowNull: false,
        type: Sequelize.TINYINT(1),
        defaultValue: "1",
      },
    },
    {
      getterMethods: {
        name: function () {
          return encryption.decryptData(this.getDataValue("name"));
        },
        location: function () {
          return encryption.decryptData(this.getDataValue("location"));
        },
        address: function () {
          return encryption.decryptData(this.getDataValue("address"));
        },
        landmark: function () {
          return encryption.decryptData(this.getDataValue("landmark"));
        },
        latitude: function () {
          return encryption.decryptData(this.getDataValue("latitude"));
        },
        longitude: function () {
          return encryption.decryptData(this.getDataValue("longitude"));
        },
        address_type: function () {
          return encryption.decryptData(this.getDataValue("address_type"));
        },
      },
      setterMethods: {
        name: function (value) {
          this.setDataValue("name", encryption.encryptData(value));
        },
        location: function (value) {
          this.setDataValue("location", encryption.encryptData(value));
        },
        address: function (value) {
          this.setDataValue("address", encryption.encryptData(value));
        },
        landmark: function (value) {
          this.setDataValue("landmark", encryption.encryptData(value));
        },
        latitude: function (value) {
          this.setDataValue("latitude", encryption.encryptData(value));
        },
        longitude: function (value) {
          this.setDataValue("longitude", encryption.encryptData(value));
        },
        address_type: function (value) {
          this.setDataValue("address_type", encryption.encryptData(value));
        },
      },
    }
  );
  return delivery_address_tbl;
};
