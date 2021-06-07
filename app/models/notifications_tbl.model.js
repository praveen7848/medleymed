var encryption = require("../helpers/Encryption");
module.exports = (sequelize, Sequelize) => {
  const notifications_tbl = sequelize.define(
    "notifications_tbl",
    {
      user_id: {
        allowNull: false,
        type: Sequelize.INTEGER,
      },
      type: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      title: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      message: {
        allowNull: true,
        type: Sequelize.STRING,
      },
      // appointment_id: {
      //   allowNull: false,
      //   type: Sequelize.INTEGER,
      // },
      status: {
        allowNull: true,
        type: Sequelize.TINYINT(1),
        defaultValue: '0',
      },
    },
    {
      getterMethods: {
        type: function () { return encryption.decryptData(this.getDataValue("type")); },
        title: function () { return encryption.decryptData(this.getDataValue("title")); },
        message: function () { return encryption.decryptData(this.getDataValue("message")); },
      },
      setterMethods: {
        type: function (value) { this.setDataValue("type", encryption.encryptData(value)); },
        title: function (value) { this.setDataValue("title", encryption.encryptData(value)); },
        message: function (value) { this.setDataValue("message", encryption.encryptData(value)); },
      },
    }
  );
  return notifications_tbl;
};
