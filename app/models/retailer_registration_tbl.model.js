var encryption = require("../helpers/Encryption");
module.exports = (sequelize, Sequelize) => {
  const retailer_registration_tbl = sequelize.define(
    "retailer_registration_tbl",
    {
      user_id: {
        allowNull: false,
        type: Sequelize.INTEGER,
      },
      storename: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      mobile_number: {
        unique: true,
        allowNull: false,
        type: Sequelize.STRING,
      },
      email: {
        unique: true,
        allowNull: false,
        type: Sequelize.STRING,
      },
      registration_number: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      registration_expirity: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      address: {
        allowNull: false,
        type: Sequelize.TEXT,
      },
      latitude: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      longitude: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      bank_name: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      account_number: {
        allowNull: false,
        type: Sequelize.INTEGER,
      },
      account_holder_name: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      ifsc_code: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      upi_number: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      gst_number: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      pan_number: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      vat_tax: {
        allowNull: true,
        type: Sequelize.STRING,
      },
      discount_type: {
        allowNull: true,
        type: Sequelize.STRING,
      },
      discount_slab: {
        allowNull: true,
        type: Sequelize.STRING,
      },
      set_delivery_type: {
        allowNull: true,
        type: Sequelize.STRING,
      },
      set_delivery_slab: {
        allowNull: true,
        type: Sequelize.STRING,
      },
      set_delivery_days: {
        allowNull: true,
        type: Sequelize.STRING,
      },
      currency: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      commission: {
        allowNull: true,
        type: Sequelize.STRING,
      },
      is_active: {
        allowNull: false,
        type: Sequelize.TINYINT(1),
        defaultValue: "1",
      },
    },
    {
      getterMethods: {
        storename: function () {
          return encryption.decryptData(this.getDataValue("storename"));
        },
        currency: function () {
          return encryption.decryptData(this.getDataValue("currency"));
        },
        mobile_number: function () {
          return encryption.decryptData(this.getDataValue("mobile_number"));
        },
        email: function () {
          return encryption.decryptData(this.getDataValue("email"));
        },
        password: function () {
          return encryption.decryptData(this.getDataValue("password"));
        },
        registration_number: function () {
          return encryption.decryptData(
            this.getDataValue("registration_number")
          );
        },
        address: function () {
          return encryption.decryptData(this.getDataValue("address"));
        },

        bank_name: function () {
          return encryption.decryptData(this.getDataValue("bank_name"));
        },
        account_number: function () {
          return encryption.decryptData(this.getDataValue("account_number"));
        },
        account_holder_name: function () {
          return encryption.decryptData(
            this.getDataValue("account_holder_name")
          );
        },
        ifsc_code: function () {
          return encryption.decryptData(this.getDataValue("ifsc_code"));
        },
        upi_number: function () {
          return encryption.decryptData(this.getDataValue("upi_number"));
        },
        gst_number: function () {
          return encryption.decryptData(this.getDataValue("gst_number"));
        },
        pan_number: function () {
          return encryption.decryptData(this.getDataValue("pan_number"));
        },


      },
      setterMethods: {
        storename: function (value) {
          this.setDataValue("storename", encryption.encryptData(value));
        },
        currency: function (value) {
          this.setDataValue("currency", encryption.encryptData(value));
        },
        mobile_number: function (value) {
          this.setDataValue("mobile_number", encryption.encryptData(value));
        },
        email: function (value) {
          this.setDataValue("email", encryption.encryptData(value));
        },
        password: function (value) {
          this.setDataValue("password", encryption.encryptData(value));
        },
        registration_number: function (value) {
          this.setDataValue(
            "registration_number",
            encryption.encryptData(value)
          );
        },
        address: function (value) {
          this.setDataValue("address", encryption.encryptData(value));
        },

        bank_name: function (value) {
          this.setDataValue("bank_name", encryption.encryptData(value));
        },
        account_number: function (value) {
          this.setDataValue("account_number", encryption.encryptData(value));
        },
        account_holder_name: function (value) {
          this.setDataValue(
            "account_holder_name",
            encryption.encryptData(value)
          );
        },
        ifsc_code: function (value) {
          this.setDataValue("ifsc_code", encryption.encryptData(value));
        },
        upi_number: function (value) {
          this.setDataValue("upi_number", encryption.encryptData(value));
        },
        gst_number: function (value) {
          this.setDataValue("gst_number", encryption.encryptData(value));
        },
        pan_number: function (value) {
          this.setDataValue("pan_number", encryption.encryptData(value));
        }
      
        

        
          }
    }
  );
  return retailer_registration_tbl;
};
