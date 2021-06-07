var encryption = require('../helpers/Encryption');
module.exports = (sequelize, Sequelize) => {
    const assessments_review = sequelize.define("assessments_review", {
      assessment_type: {
        allowNull: false,
        type: Sequelize.STRING
      },
      doctor_id: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      patient_id: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      assessment_id: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      total_score: {
        allowNull: true,
        type: Sequelize.INTEGER
      },
      final_score: {
        allowNull: true,
        type: Sequelize.INTEGER
      },
      assessment_review: {
        allowNull: false,
        type: Sequelize.JSON
      },
      completed_date: {
        allowNull: true,
        type: Sequelize.DATE,
      },
      is_reviewed: {
        allowNull: true,
        type: Sequelize.BOOLEAN
      },
      status: {
        allowNull: false,
        type: Sequelize.STRING // Completed, Pending, To-Do
      }
    }, 
    {
      getterMethods:{
        assessment_type: function(){ return encryption.decryptData(this.getDataValue('assessment_type')); },
        final_score: function(){ return encryption.decryptData(this.getDataValue('final_score')); },
		assessment_review: function(){ return JSON.parse(encryption.decryptData(this.getDataValue('assessment_review'))); }
      },
      setterMethods:{
        assessment_type: function(value){ this.setDataValue('assessment_type', encryption.encryptData(value)); },
        final_score: function(value){ this.setDataValue('final_score', encryption.encryptData(value)); },
		assessment_review: function(value){ this.setDataValue('assessment_review', encryption.encryptData(JSON.stringify(value))); }
	  }
    });

    return assessments_review;
  };
  