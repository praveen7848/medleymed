var encryption = require("../helpers/Encryption");
module.exports = (sequelize, Sequelize) => {
  const master_roles_tbl = sequelize.define(
    "master_roles_tbl",
    {
      role_name: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      status: {
        defaultValue:1,
        type: Sequelize.TINYINT(1),
      },
    },
    {
      getterMethods: {
         role_name: function () {
          return encryption.decryptData(this.getDataValue("role_name"));
        },
      },
      setterMethods: {
         role_name: function (value) {
          this.setDataValue("role_name", encryption.encryptData(value));
        },
      },
    }
  );
  return master_roles_tbl;
};
