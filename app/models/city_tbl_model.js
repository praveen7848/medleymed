var encryption = require("../helpers/Encryption");
module.exports = (sequelize, Sequelize) => {
  const tbl_city = sequelize.define(
    "tbl_city",
    {
      name: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      state_id: {
        allowNull: false,
        type: Sequelize.INTEGER,
      },
    },
    {
      getterMethods: {
        name: function () {
          return encryption.decryptData(this.getDataValue("name"));
        },
      },
      setterMethods: {
        name: function (value) {
          this.setDataValue("name", encryption.encryptData(value));
        },
      },
    }
  );
  return tbl_city;
};
