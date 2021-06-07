var encryption = require("../helpers/Encryption");
module.exports = (sequelize, Sequelize) => {
  const master_configurations = sequelize.define(
    "master_configurations",
    {
      country: {
        allowNull: true,
        type: Sequelize.STRING,
      },
      language: {
        allowNull: true,
        type: Sequelize.STRING,
      },
      currency: {
        allowNull: true,
        type: Sequelize.STRING,
      },
      timezone: {
        allowNull: true,
        type: Sequelize.STRING,
      }
    },
    {
      getterMethods: { 
        country: function () { return encryption.decryptData(this.getDataValue("country")); }, 
        currency: function () { return encryption.decryptData(this.getDataValue("currency")); }, 
        timezone: function () { return encryption.decryptData(this.getDataValue("timezone")); }, 
      },
      setterMethods: {
       country: function (value) { this.setDataValue("country", encryption.encryptData(value)); },
       currency: function (value) { this.setDataValue("currency", encryption.encryptData(value)); },
       timezone: function (value) { this.setDataValue("timezone", encryption.encryptData(value)); },
      },
    }
  );
  return master_configurations;
};
