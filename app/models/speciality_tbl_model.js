var encryption = require("../helpers/Encryption");
module.exports = (sequelize, Sequelize) => {
   const specialities_tbl = sequelize.define(
      "specialities_tbl",
      {
         category_id: {
            allowNull: true,
            type: Sequelize.INTEGER,
         },
         speciality_name: {
            allowNull: true,
            type: Sequelize.STRING,
         },
      },
      {
         getterMethods: {
            speciality_name: function () { return encryption.decryptData(this.getDataValue("speciality_name")); },
         },
         setterMethods: {
            speciality_name: function (value) { this.setDataValue("speciality_name", encryption.encryptData(value)); },
         },
      }
   );
   return specialities_tbl;
};
