var encryption = require("../helpers/Encryption");
module.exports = (sequelize, Sequelize) => {
  const master_sub_module_tbl = sequelize.define(
    "master_sub_module_tbl",
    {
      master_module_id: {
        allowNull: false,
        type: Sequelize.INTEGER,
      },
      sub_module_name: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      image_path: {
        allowNull: true,
        type: Sequelize.STRING,
      },
      tag_line: {
        allowNull: true,
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
        sub_module_name: function () {
          return encryption.decryptData(this.getDataValue("sub_module_name"));
        },
        tag_line: function () {
          return encryption.decryptData(this.getDataValue("tag_line"));
        },
      },
      setterMethods: {
        sub_module_name: function (value) {
          this.setDataValue("sub_module_name", encryption.encryptData(value));
        },
        tag_line: function (value) {
          this.setDataValue("tag_line", encryption.encryptData(value));
        },
      },
    }
  );
  return master_sub_module_tbl;
};
