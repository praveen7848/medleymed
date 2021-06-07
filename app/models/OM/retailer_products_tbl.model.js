var encryption = require("../../helpers/Encryption");
module.exports = (sequelize, Sequelize) => {
  const retailer_products_tbl = sequelize.define(
    "retailer_products_tbl",
    {
      retailer_id: {
        allowNull: false,
        type: Sequelize.INTEGER,
      },
      medicine_id: {
        allowNull: false,
        type: Sequelize.STRING,
        // primaryKey: true,
      },
      status: {
        allowNull: false,
        type: Sequelize.TINYINT(1),
        defaultValue: "1",
      },
    },
    {
      getterMethods: {
        // mmsku: function () {
        //   return encryption.decryptData(this.getDataValue("mmsku"));
        // },
      },
      setterMethods: {
        // mmsku: function (value) {
        //   this.setDataValue("mmsku", encryption.encryptData(value));
        // },
      },
    }
  );
  return retailer_products_tbl;
};
