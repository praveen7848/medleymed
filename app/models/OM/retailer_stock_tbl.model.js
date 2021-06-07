var encryption = require("../../helpers/Encryption");
module.exports = (sequelize, Sequelize) => {
  const retailer_stock_tbl = sequelize.define(
    "retailer_stock_tbl",
    {
      retailer_id: {
        allowNull: false,
        type: Sequelize.INTEGER,
      },
      product_id: {
        allowNull: false,
        type: Sequelize.INTEGER,
      },
      medicine_id: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      batch: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      expiry_date: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      quantity: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      mrp: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      commission: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      discount: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      vat: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      CGST: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      SGST: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      IGST: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      status: {
        allowNull: false,
        type: Sequelize.TINYINT(1),
        defaultValue: "1",
      },
    },
    {
      getterMethods: {
        // batch: function () {
        //   return encryption.decryptData(this.getDataValue("batch"));
        // },
      },
      setterMethods: {
        // batch: function (value) {
        //   this.setDataValue("batch", encryption.encryptData(value));
        // },
      },
    }
  );
  return retailer_stock_tbl;
};
