var encryption = require("../../helpers/Encryption");
module.exports = (sequelize, Sequelize) => {
  const favorite_medicine_tbl = sequelize.define(
    "favorite_medicine_tbl",
    {
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
  return favorite_medicine_tbl;
};
