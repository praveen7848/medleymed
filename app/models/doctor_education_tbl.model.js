var encryption = require("../helpers/Encryption");
module.exports = (sequelize, Sequelize) => {
  const doctor_education_tbl = sequelize.define(
    "doctor_education_tbl",
    {
    doctor_user_tbl_id: {
        allowNull: true,
        type: Sequelize.INTEGER,
      },
      registration_no	: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      course_name	: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      medical_college_name	: {
        allowNull: true,
        type: Sequelize.STRING,
      },
      university_name	: {
        allowNull: true,
        type: Sequelize.STRING,
      },
      council_id	: {
        allowNull: true,
        type: Sequelize.INTEGER,
      },
      year_of_completion	: {
        allowNull: true,
        type: Sequelize.DATE,
      },
      experience	: {
        allowNull: true,
        type: Sequelize.INTEGER,
      },
      document	: {
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
  return doctor_education_tbl;
};
