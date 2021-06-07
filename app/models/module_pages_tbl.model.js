var encryption = require("../helpers/Encryption");
module.exports = (sequelize, Sequelize) => {
  const tbl_module_pages = sequelize.define(
    "tbl_module_page",
    {
      module_name	: {
        
        allowNull: false,
        type: Sequelize.STRING,
      },
      page_name	: {
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
        module_name: function () { return encryption.decryptData(this.getDataValue("module_name")); },
        page_name: function () { return encryption.decryptData(this.getDataValue("page_name")); },
        status: function () { return encryption.decryptData(this.getDataValue("status")); },
      },
      setterMethods: {
        module_name: function (value) { this.setDataValue("module_name", encryption.encryptData(value)); },
        page_name: function (value) { this.setDataValue("page_name", encryption.encryptData(value)); },
        status: function (value) { this.setDataValue("status", encryption.encryptData(value)); }
      },
    }
  );

  return tbl_module_pages;
};
