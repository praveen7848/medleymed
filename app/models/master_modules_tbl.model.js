var encryption = require("../helpers/Encryption");
module.exports = (sequelize, Sequelize) => {
  const master_modules_tbl = sequelize.define(
    "master_modules_tbl",
    {
      module_name: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      image_path: {
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
        module_name: function () {
          return encryption.decryptData(this.getDataValue("module_name"));
        },
      },
      setterMethods: {
        module_name: function (value) {
          this.setDataValue("module_name", encryption.encryptData(value));
        },
      },
    }
  );
  return master_modules_tbl;
};
