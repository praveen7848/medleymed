var encryption = require("../../helpers/Encryption");
module.exports = (sequelize, Sequelize) => {
  const order_status_tbl = sequelize.define(
    "order_status_tbl",
    {
      status: {
        allowNull: false,
        type: Sequelize.STRING,
      },
    },
    {
      getterMethods: {
        // medicine_id: function () {
        //   return encryption.decryptData(this.getDataValue("medicine_id"));
        // },
      },
      setterMethods: {
        // medicine_id: function (value) {
        //   this.setDataValue("medicine_id", encryption.encryptData(value));
        // },
      },
    }
  );
  return order_status_tbl;
};
