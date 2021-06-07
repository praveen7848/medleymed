var encryption = require("../helpers/Encryption");
module.exports = (sequelize, Sequelize) => {
  const tbl_doctor_exp = sequelize.define(
    "doctor_experience_tbl",
    {
     starting_experience: {
        allowNull: true,
        type: Sequelize.INTEGER,
      },
      ending_experience	: {
        allowNull: true,
        type: Sequelize.INTEGER,
      },
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
  return tbl_doctor_exp;
};
