var encryption = require("../../helpers/Encryption");
module.exports = (sequelize, Sequelize) => {
  const cart_prescriptions_tbl = sequelize.define(
    "cart_prescriptions_tbl",
    {
      cart_id: {
        allowNull: false,
        type: Sequelize.INTEGER,
      },
      patient_id: {
        allowNull: false,
        type: Sequelize.INTEGER,
      },
      medical_document: {
        allowNull: true,
        // type: Sequelize.JSON,
        type: Sequelize.TEXT,
        get: function () {
          if(this.getDataValue("medical_document")){
          return JSON.parse(this.getDataValue("medical_document"));
          }
        },
        set: function (value) {
          return this.setDataValue(
            "medical_document",
            JSON.stringify(value)
          );
        },
      },
      order_id:{
        allowNull: true,
        type: Sequelize.INTEGER,
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
  return cart_prescriptions_tbl;
};
