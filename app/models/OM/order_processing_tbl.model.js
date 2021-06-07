var encryption = require("../../helpers/Encryption");
module.exports = (sequelize, Sequelize) => {
  const order_processing_tbl = sequelize.define(
    "order_processing_tbl",
    {
      retailer_id: {
        allowNull: false,
        type: Sequelize.INTEGER,
      },
      patient_id: {
        allowNull: false,
        type: Sequelize.INTEGER,
      },
      medicine_id: {
        allowNull: true,
        type: Sequelize.INTEGER,
      },
      order_id: {
        allowNull: true,
        type: Sequelize.STRING,
      },
      expiry_date: {
        allowNull: true,
        type: Sequelize.STRING,
      },
      quantity: {
        allowNull: false,
        type: Sequelize.INTEGER,
      },
      amount: {
        allowNull: true,
        type: Sequelize.STRING,
      },
      order_date: {
        allowNull: true,
        type: Sequelize.STRING,
      },
      billed_items: {
        allowNull: true,
        type: Sequelize.INTEGER,
      },
      billed_amount: {
        allowNull: true,
        type: Sequelize.STRING,
      },
      discount: {
        allowNull: true,
        type: Sequelize.STRING,
      },
      batch: {
        allowNull: true,
        type: Sequelize.STRING,
      },
      vat: {
        allowNull: true,
        type: Sequelize.STRING,
      },
      CGST: {
        allowNull: true,
        type: Sequelize.STRING,
      },
      SGST: {
        allowNull: true,
        type: Sequelize.STRING,
      },
      IGST: {
        allowNull: true,
        type: Sequelize.STRING,
      },
    },
    {
      getterMethods: {
        // medicine_id: function () {
        //   return encryption.decryptData(this.getDataValue("medicine_id")); ----
        // },
      },
      setterMethods: {
        // medicine_id: function (value) {
        //   this.setDataValue("medicine_id", encryption.encryptData(value));
        // },
      },
    }
  );
  return order_processing_tbl;
};
