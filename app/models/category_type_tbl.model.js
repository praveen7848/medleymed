var encryption = require("../helpers/Encryption");
module.exports = (sequelize, Sequelize) => {
  const category_type_tbl = sequelize.define(
    "category_type_tbl",
    {
      category_type: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      status: {
        allowNull: false,
        type: Sequelize.BOOLEAN,
      },
    },
    {
      getterMethods: {
        category_type: function () {
          return encryption.decryptData(this.getDataValue("category_type"));
        },
      },
      setterMethods: {
        category_type: function (value) {
          this.setDataValue("category_type", encryption.encryptData(value));
        },
      },
    }
  );

  return category_type_tbl;
};
