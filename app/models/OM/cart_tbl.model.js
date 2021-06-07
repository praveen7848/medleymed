var encryption = require("../../helpers/Encryption");
module.exports = (sequelize, Sequelize) => {
  const cart_tbl = sequelize.define(
    "cart_tbl",
    {
      cart_id: {
        allowNull: false,
        type: Sequelize.INTEGER,
      },
      shop_id: {
        allowNull: true,
        type: Sequelize.INTEGER,
      },
      patient_id: {
        allowNull: true,
        type: Sequelize.INTEGER,
      },
      medicine_id: {
        allowNull: false,
        type: Sequelize.INTEGER,
      },
      quantity: {
        defaultValue: 1,
        type: Sequelize.INTEGER,
      },
      mrp: {
        type: Sequelize.STRING,
      },
      order_status:{
        allowNull: false,
        type: Sequelize.TINYINT(1),
        defaultValue: "0",
      }
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
  return cart_tbl;
};
