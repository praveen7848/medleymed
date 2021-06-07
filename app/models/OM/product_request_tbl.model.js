var encryption = require("../../helpers/Encryption");
module.exports = (sequelize, Sequelize) => {
  const product_request_tbl = sequelize.define(
    "product_request_tbl",
    {
      clinic_id: {
        allowNull: false,
        type: Sequelize.INTEGER,
      },
      medicineid: {
        allowNull: false,
        type: Sequelize.INTEGER,
      },
      medicine_name: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      medicine_main: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      medicine_type: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      uom: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      description: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      compositions: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      retailer: {
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
        // location: function () {
        //   return encryption.decryptData(this.getDataValue("location"));
        // },
        // address: function () {
        //   return encryption.decryptData(this.getDataValue("address"));
        // }
       
      },
      setterMethods: {
        // location: function (value) {
        //   this.setDataValue("location", encryption.encryptData(value));
        // },
        // address: function (value) {
        //   this.setDataValue("address", encryption.encryptData(value));
        // }
      },
    }
  );
  return product_request_tbl;
};
