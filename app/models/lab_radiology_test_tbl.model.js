var encryption = require("../helpers/Encryption");
module.exports = (sequelize, Sequelize) => {
  const lab_radiology_test = sequelize.define(
    "lab_radiology_test",
    {
        labtest_name: {
        allowNull: true,
        type: Sequelize.STRING,
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
  return lab_radiology_test;
};
