var encryption = require("../helpers/Encryption");
module.exports = (sequelize, Sequelize) => {
  const master_sub_module_pages_tbl = sequelize.define(
    "master_sub_module_pages_tbl",
    {
      master_module_id: {
        allowNull: false,
        type: Sequelize.INTEGER,
      },
      sub_module_id: {
        allowNull: true,
        type: Sequelize.INTEGER,
      },
      page_name: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      web_reference_page_name: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      mobile_reference_page_name: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      sequence_id: {
        allowNull: false,
        type: Sequelize.INTEGER,
      },
      status: {
        defaultValue:1,
        type: Sequelize.TINYINT(1),
      },
    },
    {
      getterMethods: {
        page_name: function () {
          return encryption.decryptData(this.getDataValue("page_name"));
        },
        web_reference_page_name: function () {
          return encryption.decryptData(this.getDataValue("web_reference_page_name"));
        },
        mobile_reference_page_name: function () {
          return encryption.decryptData(this.getDataValue("mobile_reference_page_name"));
        },
      },
      setterMethods: {
        page_name: function (value) {
          this.setDataValue("page_name", encryption.encryptData(value));
        },
        web_reference_page_name: function (value) {
          this.setDataValue("web_reference_page_name", encryption.encryptData(value));
        },
        mobile_reference_page_name: function (value) {
          this.setDataValue("mobile_reference_page_name", encryption.encryptData(value));
        },
      },
    }
  );
  return master_sub_module_pages_tbl;
};
