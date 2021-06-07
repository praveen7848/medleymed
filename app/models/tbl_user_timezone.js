var encryption = require("../helpers/Encryption");
module.exports = (sequelize, Sequelize) => {
  const tbl_user_timezones = sequelize.define(
    "tbl_user_timezones",
    {
      user_id: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      
      country: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      timezone: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      currency: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      status: {
        allowNull: false,
        type: Sequelize.STRING,
      },
    },
    {
      getterMethods: {
          country: function () { return encryption.decryptData(this.getDataValue("country")); },
          timezone: function () { return encryption.decryptData(this.getDataValue("timezone")); },
          currency: function () { return encryption.decryptData(this.getDataValue("currency")); },
          status: function () { return encryption.decryptData(this.getDataValue("status")); }
      },
      setterMethods: {
        country: function (value) { this.setDataValue("country", encryption.encryptData(value)); },
        timezone: function (value) { this.setDataValue("timezone", encryption.encryptData(value)); },
        currency: function (value) { this.setDataValue("currency", encryption.encryptData(value)); },
        status: function (value) { this.setDataValue("status", encryption.encryptData(value)); }       
      }, 
    }
  )
  return tbl_user_timezones;
};
