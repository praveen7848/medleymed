var encryption = require("../../helpers/Encryption");
module.exports = (sequelize, Sequelize) => {
  const order_tbl = sequelize.define(
    "order_tbl",
    {
      retailer_id: {
        allowNull: false,
        type: Sequelize.INTEGER,
      },
      patient_id: {
        allowNull: false,
        type: Sequelize.INTEGER,
      },
      patient_address_id: {
        allowNull: false,
        type: Sequelize.INTEGER,
      },
      relative_id: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      cart_level_discount: {
        allowNull: true,
        type: Sequelize.STRING,
        defaultValue: "0",
      },
      delivery_charges: {
        allowNull: true,
        type: Sequelize.STRING,
        defaultValue: "0",
      },
      net_amount: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      payable_amount: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      coupan_name: {
        allowNull: true,
        type: Sequelize.STRING,
      },
      coupan_value: {
        allowNull: true,
        type: Sequelize.STRING,
      },
      prescription: {
        allowNull: true,
        type: Sequelize.STRING,
      },
      order_date: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      invoice:{
        allowNull: true,
        type: Sequelize.STRING,
      },
      invoice_date:{
        allowNull: true,
        type: Sequelize.STRING,
      },
      order_status: {
        allowNull: false,
        type: Sequelize.TINYINT(1),
        defaultValue: "1",
      },
      delivery_agent:{
        allowNull: true,
        type: Sequelize.STRING,
      },
      delivery_date:{
        allowNull: true,
        type: Sequelize.STRING,
      },
      cancelled_reason: {
        allowNull: true,
        type: Sequelize.TINYINT(1),
        defaultValue: "0",
      },
      refund_status:{
        allowNull: true,
        type: Sequelize.TINYINT(1),
      },
      transaction_id:{
        allowNull: true,
        type: Sequelize.STRING,
      },
      payment_mode:{
        allowNull: true,
        type: Sequelize.STRING,
      },
      total_taxable_amount:{
        allowNull: true,
        type: Sequelize.STRING,
      },
      total_taxes:{
        allowNull: true,
        type: Sequelize.STRING,
      },
      sub_total:{
        allowNull: true,
        type: Sequelize.STRING,
      },
      discount:{
        allowNull: true,
        type: Sequelize.STRING,
      },
      total_paid:{
        allowNull: true,
        type: Sequelize.STRING,
      },
    },
    {
      getterMethods: {
        // medicine_id: function () {
        //   return encryption.decryptData(this.getDataValue("medicine_id")); -----
        // },
      },
      setterMethods: {
        // medicine_id: function (value) {
        //   this.setDataValue("medicine_id", encryption.encryptData(value));
        // },
      },
    }
  );
  return order_tbl;
};
