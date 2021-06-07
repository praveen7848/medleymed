var encryption = require("../helpers/Encryption");
module.exports = (sequelize, Sequelize) => {
  const documents_tbl = sequelize.define(
    "documents_tbl",
    {
        patient_id: {
        allowNull: true,
        type: Sequelize.INTEGER,
      },
      doctor_id	: {
        allowNull: true,
        type: Sequelize.INTEGER,
      },
      prescription_id  	: {
        allowNull: true,
        type: Sequelize.STRING,
      },
      upload_type 	: {
        allowNull: true,
        type: Sequelize.STRING,
      },
      attachment_type  	: {
        allowNull: true,
        type: Sequelize.STRING,
      },
      document_url  	: {
        allowNull: true,
        type: Sequelize.STRING,
      },
      registration_type  	: {
        allowNull: true,
        type: Sequelize.STRING,
      },
      original_document_name   	: {
        allowNull: true,
        type: Sequelize.STRING,
      },
      appointment_unique_id    	: {
        allowNull: true,
        type: Sequelize.STRING,
      },
      transaction_id    	: {
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
  return documents_tbl;
};
