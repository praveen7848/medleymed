var encryption = require("../../helpers/Encryption");
module.exports = (sequelize, Sequelize) => {
  const retailer_finalorder_tbl = sequelize.define(
    "retailer_finalorder_tbl",
    {
      retailer_id: {
        allowNull: false,
        type: Sequelize.INTEGER,
      },
      medicine_id: {
        allowNull: false,
        type: Sequelize.INTEGER,
      },
      quantity: {
        allowNull: false,
        type: Sequelize.INTEGER,
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
  return retailer_finalorder_tbl;
};
