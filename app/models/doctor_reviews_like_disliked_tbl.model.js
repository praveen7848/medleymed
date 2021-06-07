var encryption = require("../helpers/Encryption");
module.exports = (sequelize, Sequelize) => {
  const doctor_reviews_like_disliked_tbl = sequelize.define(
    "doctor_reviews_like_disliked_tbl",
    {
      login_person_id: {
        allowNull: true,
        type: Sequelize.INTEGER,
      },
      doctor_id	: {
        allowNull: true,
        type: Sequelize.INTEGER,
      },
      review_id	: {
        allowNull: true,
        type: Sequelize.INTEGER,
      },
      status	: {
        allowNull: true,
        type: Sequelize.BOOLEAN,
      }
    },
    // {
    //   getterMethods: { 
    //     starting_experience: function () { return encryption.decryptData(this.getDataValue("starting_experience")); }, 
    //     ending_experience: function () { return encryption.decryptData(this.getDataValue("ending_experience")); }, 
    //   },
    //   setterMethods: {
    //     starting_experience: function (value) { this.setDataValue("starting_experience", encryption.encryptData(value)); },
    //     ending_experience: function (value) { this.setDataValue("ending_experience", encryption.encryptData(value)); },
    //   },
    // }
  );
  return doctor_reviews_like_disliked_tbl;
};
