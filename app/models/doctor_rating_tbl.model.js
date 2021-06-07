var encryption = require("../helpers/Encryption");
module.exports = (sequelize, Sequelize) => {
   const doctor_rating = sequelize.define(
      "doctor_rating",
      {
         patient_id: {
            allowNull: true,
            type: Sequelize.INTEGER,
         },
         doctor_id: {
            allowNull: true,
            type: Sequelize.INTEGER,
         },
         rating: {
            allowNull: true,
            type: Sequelize.INTEGER(1),
         },
         review: {
            allowNull: true,
            type: Sequelize.STRING,
         },
         is_anonymous: {
            defaultValue: '0',
            type: Sequelize.INTEGER(1),
         },
         status: {
            defaultValue: '1',
            type: Sequelize.BOOLEAN,
         },
      },
      {
         getterMethods: {
            review: function () { return encryption.decryptData(this.getDataValue("review")); },
         },
         setterMethods: {
            review: function (value) { this.setDataValue("review", encryption.encryptData(value)); },
         },
      }
   );
   return doctor_rating;
};
