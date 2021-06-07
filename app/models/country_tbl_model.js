var encryption = require("../helpers/Encryption");
module.exports = (sequelize, Sequelize) => {
  const tbl_country = sequelize.define(
    "tbl_countries",
    {
      sortname: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      name	: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      // isd_code	: {
      //   allowNull: false,
      //   type: Sequelize.STRING,
      // },
      phonecode	: {
        allowNull: false,
        type: Sequelize.INTEGER,
      },
      code	: {
        allowNull: false,
        type: Sequelize.TINYINT(2),
      },
      dial_code	: {
        allowNull: false,
        type: Sequelize.STRING(10),
      },
      currency_name: {
        allowNull: true,
        type: Sequelize.STRING,
      },
      currency_symbol: {
        allowNull: true,
        type: Sequelize.STRING,
      },
      currency_code: {
        allowNull: true,
        type: Sequelize.STRING,
      },
    },
    { 
      getterMethods: {
        sortname: function () { return encryption.decryptData(this.getDataValue("sortname")); }, 
        name: function () { return encryption.decryptData(this.getDataValue("name")); }, 
        // isd_code: function () { return encryption.decryptData(this.getDataValue("isd_code")); }, 
      },
      setterMethods: {
        sortname: function (value) { this.setDataValue("sortname", encryption.encryptData(value)); },
        name: function (value) { this.setDataValue("name", encryption.encryptData(value)); },
        // isd_code: function (value) { this.setDataValue("isd_code", encryption.encryptData(value)); },
      },
  
    }
  );

  return tbl_country;
};
