var encryption = require("../helpers/Encryption");
module.exports = (sequelize, Sequelize) => {
  const master_sub_module_clinic_pages_tbl = sequelize.define(
    "master_sub_module_clinic_pages_tbl",
    {
      clinic_id: {
        allowNull: false,
        type: Sequelize.INTEGER,
      },
      master_module_id: {
        allowNull: false,
        type: Sequelize.INTEGER,
      },
      master_module_sequence_id: {
        allowNull: false,
        type: Sequelize.INTEGER,
      },
      sub_module_id: {
        allowNull: true,
        type: Sequelize.INTEGER,
      },
      sub_module_sequence_id: {
        allowNull: true,
        type: Sequelize.INTEGER,
      },
      page_module_id: {
        allowNull: true,
        type: Sequelize.INTEGER,
      },
      page_module_sequence_id: {
        allowNull: true,
        type: Sequelize.INTEGER,
      },
      status: {
        defaultValue: 1,
        type: Sequelize.TINYINT(1),
      },
    },
    {
      getterMethods: {
        page_name: function () {
          return encryption.decryptData(this.getDataValue("page_name"));
        },
        reference_page: function () {
          return encryption.decryptData(this.getDataValue("reference_page"));
        },
      },
      setterMethods: {
        page_name: function (value) {
          this.setDataValue("page_name", encryption.encryptData(value));
        },
        reference_page: function (value) {
          this.setDataValue("reference_page", encryption.encryptData(value));
        },
      },
    }
  );
  return master_sub_module_clinic_pages_tbl;
};
