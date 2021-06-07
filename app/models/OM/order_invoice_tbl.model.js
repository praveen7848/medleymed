var encryption = require("../../helpers/Encryption");
module.exports = (sequelize, Sequelize) => {
  const order_invoice_tbl = sequelize.define(
    "order_invoice_tbl",
    {
      invoice_no: {
        allowNull: true,
        type: Sequelize.INTEGER,
      },
      retailer_id:{
        allowNull: false,
        type: Sequelize.INTEGER,
      },
      order_id: {
        allowNull: false,
        type: Sequelize.INTEGER,
      },
      patient_id: {
        allowNull: false,
        type: Sequelize.INTEGER,
      },
      order_date: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      invoice_date: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      medicine_id: {
        allowNull: false,
        type: Sequelize.INTEGER,
      },
      batch: {
        allowNull: true,
        type: Sequelize.STRING,
      },
      expiry: {
        allowNull: true,
        type: Sequelize.STRING,
      },
      mrp: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      quantity: {
        allowNull: false,
        type: Sequelize.INTEGER,
      },
      taxable_rate: {
        type: Sequelize.STRING,
      },
      vat: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      vat_amount: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      discount: {
        allowNull: true,
        type: Sequelize.STRING,
      },
      amount: {
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
  return order_invoice_tbl;
};
