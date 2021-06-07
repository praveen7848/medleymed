var encryption = require("../helpers/Encryption");
module.exports = (sequelize, Sequelize) => {
  const labtest_prefered_table = sequelize.define(
    "labtest_prefered_table",
    {
        clinic_id: {
        allowNull: true,
        type: Sequelize.INTEGER,
      },
      doctor_id	: {
        allowNull: true,
        type: Sequelize.INTEGER,
      },
      lab_test_id  	: {
        allowNull: true,
        type: Sequelize.INTEGER,
      },
      lab_test_name 	: {
        allowNull: true,
        type: Sequelize.STRING,
      },
      group  	: {
        allowNull: true,
        type: Sequelize.STRING,
      },
      status 	: {
        allowNull: true,
        type: Sequelize.INTEGER,
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
  return labtest_prefered_table;
};
