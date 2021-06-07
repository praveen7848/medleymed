var encryption = require("../helpers/Encryption");
module.exports = (sequelize, Sequelize) => {
  const tbl_languages = sequelize.define(
    "tbl_languages",
    {
      name: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      iso_name	: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      iso_val	: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      language_pic	: {
        allowNull: true,
        type: Sequelize.STRING,
      },
    },
    {
      getterMethods: { 
        iso_name: function () { return encryption.decryptData(this.getDataValue("iso_name")); }, 
        iso_val: function () { return encryption.decryptData(this.getDataValue("iso_val")); }, 
        name: function () { return encryption.decryptData(this.getDataValue("name")); }, 
      },
      setterMethods: {
       iso_name: function (value) { this.setDataValue("iso_name", encryption.encryptData(value)); },
       iso_val: function (value) { this.setDataValue("iso_val", encryption.encryptData(value)); },
       name: function (value) { this.setDataValue("name", encryption.encryptData(value)); },
      },
    }
  );
  return tbl_languages;
};
