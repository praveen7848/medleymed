var encryption = require("../helpers/Encryption");
module.exports = (sequelize, Sequelize) => {
  const master_settings = sequelize.define(
    "master_settings",
    {
       type: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      type_value	: {
        allowNull: false,
        type: Sequelize.STRING,
      },
    },
    {
      getterMethods: { 
        type: function () { return encryption.decryptData(this.getDataValue("type")); }, 
        type_value: function () { return encryption.decryptData(this.getDataValue("type_value")); }, 
      },
      setterMethods: {
        type: function (value) { this.setDataValue("type", encryption.encryptData(value)); },
        type_value: function (value) { this.setDataValue("type_value", encryption.encryptData(value)); },
      },
    }
  );
  return master_settings;
};
