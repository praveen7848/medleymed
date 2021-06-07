var encryption = require("../../helpers/Encryption");
module.exports = (sequelize, Sequelize) => {
  const order_cancellation_reasons_tbl = sequelize.define(
    "order_cancellation_reasons_tbl",
    {
      reason: {
        allowNull: false,
        type: Sequelize.STRING,
      },
    },
    {
      getterMethods: {
        reason: function () {
          return encryption.decryptData(this.getDataValue("reason"));
        },
      },
      setterMethods: {
        reason: function (value) {
          this.setDataValue("reason", encryption.encryptData(value));
        },
      },
    }
  );
  return order_cancellation_reasons_tbl;
};
