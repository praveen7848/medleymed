var encryption = require("../helpers/Encryption");
module.exports = (sequelize, Sequelize) => {
  const doctor_clinic_mapping_tbl = sequelize.define(
    "doctor_clinic_mapping_tbl",
    {
        login_person_id: {
        allowNull: true,
        type: Sequelize.STRING,
      },
      doctor_id	: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      clinic_id	: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      registartion_no	: {
        allowNull: true,
        type: Sequelize.STRING,
      },
      status	: {
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
  return doctor_clinic_mapping_tbl;
};
