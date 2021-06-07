var encryption = require("../helpers/Encryption");
module.exports = (sequelize, Sequelize) => {
  const tbl_state = sequelize.define(
    "tbl_state",
    {
      name: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      country_id: {
        allowNull: false,
        type: Sequelize.INTEGER,
      },
      m_id: {
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

  return tbl_state;
};
