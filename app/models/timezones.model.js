var encryption = require("../helpers/Encryption");
module.exports = (sequelize, Sequelize) => {
  const timezones = sequelize.define(
    "timezones",
    {
      timezone: {
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
          timezone: function () { return encryption.decryptData(this.getDataValue("timezone")); },
          status: function () { return encryption.decryptData(this.getDataValue("status")); }
      },
      setterMethods: {
        timezone: function (value) { this.setDataValue("timezone", encryption.encryptData(value)); },
        status: function (value) { this.setDataValue("status", encryption.encryptData(value)); }       
      }, 
    }
  )
  return timezones;
};
