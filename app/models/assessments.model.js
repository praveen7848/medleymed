var encryption = require('../helpers/Encryption');
module.exports = (sequelize, Sequelize) => {
    const assessments = sequelize.define("assessments", {
      assessment_type: {
        allowNull: false,
        type: Sequelize.STRING
      },
      assessment_category: {
        allowNull: true,
        type: Sequelize.STRING(1234)
      },
      assessment_detail: {
        allowNull: true,
        type: Sequelize.STRING(1234)
      },
      assessments: {
        allowNull: false,
        type: Sequelize.JSON
      },
      assessment_score_interpretation: {
        allowNull: false,
        type: Sequelize.JSON
      },
      assessment_response: {
        allowNull: false,
        type: Sequelize.JSON
      },
      assessment_credits: {
        allowNull: false,
        type: Sequelize.STRING(1234)
      },
      selection_type: {
        allowNull: false,
        type: Sequelize.STRING
      },
      status: {
        allowNull: false,
        type: Sequelize.BOOLEAN
      }
    }, 
    {
      getterMethods:{
        assessment_type: function(){ return encryption.decryptData(this.getDataValue('assessment_type')); },
        assessment_category: function(){ return encryption.decryptData(this.getDataValue('assessment_category')); },
        assessment_detail: function(){ return encryption.decryptData(this.getDataValue('assessment_detail')); },
        assessments: function(){ return JSON.parse(encryption.decryptData(this.getDataValue('assessments'))); },
        assessment_score_interpretation: function(){ return JSON.parse(encryption.decryptData(this.getDataValue('assessment_score_interpretation'))); },
        assessment_response: function(){ return JSON.parse(encryption.decryptData(this.getDataValue('assessment_response'))); },
        assessment_credits: function(){ return encryption.decryptData(this.getDataValue('assessment_credits')); }
      },
      setterMethods:{
        assessment_type: function(value){ this.setDataValue('assessment_type', encryption.encryptData(value)); },
        assessment_category: function(value){ this.setDataValue('assessment_category', encryption.encryptData(value)); },
        assessment_detail: function(value){ this.setDataValue('assessment_detail', encryption.encryptData(value)); },
        assessments: function(value){ this.setDataValue('assessments', encryption.encryptData(JSON.stringify(value))); },
        assessment_score_interpretation: function(value){ this.setDataValue('assessment_score_interpretation', encryption.encryptData(JSON.stringify(value))); },
        assessment_response: function(value){ this.setDataValue('assessment_response', encryption.encryptData(JSON.stringify(value))); },
        assessment_credits: function(value){ this.setDataValue('assessment_credits', encryption.encryptData(value)); }
	  }
    });

    return assessments;
  };
  