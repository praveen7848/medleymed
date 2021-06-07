var encryption = require("../helpers/Encryption");
module.exports = (sequelize, Sequelize) => {
  const tbl_languages = sequelize.define(
    "tbl_councils",
    {
        council_name: {
        allowNull: false,
        type: Sequelize.STRING,
      }
    },
    {
      getterMethods: { 
        
        council_name: function () { return encryption.decryptData(this.getDataValue("council_name")); }, 
      },
      setterMethods: {
     
       council_name: function (value) { this.setDataValue("council_name", encryption.encryptData(value)); },
      },
    }
  );
  return tbl_languages;
};
