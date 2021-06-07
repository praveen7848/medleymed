var encryption = require("../helpers/Encryption");
module.exports = (sequelize, Sequelize) => {
  const tbl_realtivehistory_controller = sequelize.define(
    "patient_relative_history",
    {
        patient_id : {
            allowNull:false,
            type: Sequelize.INTEGER,
        },
        relative_name :{
            allowNull:false,
            type: Sequelize.STRING,
        },
        relative_gender :{
            allowNull:false,
            type: Sequelize.STRING,
        },
        relation: {
            allowNull:false,
            type: Sequelize.STRING,
        },
        relative_diseases : {
            allowNull:true,
            type: Sequelize.STRING,
        },
        relative_chronic_diseases : {
            allowNull:true,
            type: Sequelize.STRING,
        },
        relative_lifestyle_of_food: {
            allowNull:true,
            type: Sequelize.STRING,
        },
        hereditary_diseases:{
            allowNull:true,
            type: Sequelize.STRING,
        },
        comments:{
            allowNull:true,
            type: Sequelize.STRING,    
        },
        relative_profile:{
            allowNull:true,
            type: Sequelize.STRING,    
        }
    },
    { 
        getterMethods: {
            relative_name: function () { return encryption.decryptData(this.getDataValue("relative_name")); }, 
            relative_gender: function () { return encryption.decryptData(this.getDataValue("relative_gender")); }, 
            relation: function () { return encryption.decryptData(this.getDataValue("relation")); },
            relative_diseases: function () { return encryption.decryptData(this.getDataValue("relative_diseases")); }, 
            relative_chronic_diseases: function () { return encryption.decryptData(this.getDataValue("relative_chronic_diseases")); },
            relative_lifestyle_of_food: function () { return encryption.decryptData(this.getDataValue("relative_lifestyle_of_food")); }, 
            hereditary_diseases: function () { return encryption.decryptData(this.getDataValue("hereditary_diseases")); },
            comments: function () { return encryption.decryptData(this.getDataValue("comments")); },
            relative_profile: function () { return encryption.decryptData(this.getDataValue("relative_profile")); }
            
        },
        setterMethods: {
            relative_name: function (value) { this.setDataValue("relative_name", encryption.encryptData(value)); },
            relative_gender: function (value) { this.setDataValue("relative_gender", encryption.encryptData(value)); },
            relation: function (value) { this.setDataValue("relation", encryption.encryptData(value)); },
            relative_diseases: function (value) { this.setDataValue("relative_diseases", encryption.encryptData(value)); },
            relative_chronic_diseases: function (value) { this.setDataValue("relative_chronic_diseases", encryption.encryptData(value)); },
            relative_lifestyle_of_food: function (value) { this.setDataValue("relative_lifestyle_of_food", encryption.encryptData(value)); },
            hereditary_diseases: function (value) { this.setDataValue("hereditary_diseases", encryption.encryptData(value)); },
            comments: function (value) { this.setDataValue("comments", encryption.encryptData(value)); },
            relative_profile: function (value) { this.setDataValue("relative_profile", encryption.encryptData(value)); }
        },
    }
  )
  return tbl_realtivehistory_controller;
}