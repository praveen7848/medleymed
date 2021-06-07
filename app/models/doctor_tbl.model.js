var encryption = require("../helpers/Encryption");
//const { TEXT } = require("sequelize/types");
module.exports = (sequelize, Sequelize) => {
  const doctor_tbl = sequelize.define(
    "doctor_tbl",
    {
      user_id: {
        allowNull: true,
        type: Sequelize.INTEGER,
      },
      doctor_name: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      mobile_no: {
        unique: true,
        allowNull: false,
        type: Sequelize.STRING,
      },
      email: {
        unique: true,
        allowNull: false,
        type: Sequelize.STRING,
      },
      clinic_id: {
        allowNull: false,
        type: Sequelize.INTEGER,
      },
      speciality_id:{
        allowNull: false,
        type: Sequelize.INTEGER,
      },
      default_language_id:{
        allowNull: true,
        type: Sequelize.STRING,
      },
      default_language_name:{
        allowNull: true,
        type: Sequelize.STRING,
      },
      selected_language_id:{
        allowNull: false,
        type: Sequelize.STRING,
      },
      selected_language_name:{
        allowNull: false,
        type: Sequelize.STRING,
      },
      speciality_name:{
        allowNull: false,
        type: Sequelize.STRING,
      },
      gender: {
        allowNull: true,
        type: Sequelize.STRING,
      },
      dob: {
        allowNull: true,
        type: Sequelize.DATE,
      },
      profile_pic: {
        allowNull: true,
        type: Sequelize.STRING,
        //type: Sequelize.BLOB,
      },
      signature_pic: {
        allowNull: true,
        type: Sequelize.STRING,
        //type: Sequelize.BLOB,
      },
      address: {
        allowNull: true,
        type: Sequelize.STRING,
      },
      city: {
        allowNull: true,
        type: Sequelize.STRING,
      },
      state: {
        allowNull: true,
        type: Sequelize.STRING,
      },
      zip_code: {
        allowNull: true,
        type: Sequelize.STRING,
      },
      lat_long: {
        allowNull: true,
        type: Sequelize.STRING,
      },
      education: {
        allowNull: true,
        type: Sequelize.STRING,
      },
      experience: {
        allowNull: true,
        type: Sequelize.STRING,
      },
      registraion_no: {
        allowNull: true,
        type: Sequelize.STRING,
      },
      practice: {
        allowNull: true,
        type: Sequelize.TEXT,
      },
      area_of_expertise:{
        allowNull: true,
        type: Sequelize.STRING,
      },
      fees : {
        allowNull: true,
        type: Sequelize.STRING,
      },
      commission : {
        allowNull: true,
        type: Sequelize.STRING,
      },
      languageids: {
        allowNull: true,
        type: Sequelize.STRING
      },
      languages : {
        allowNull: true,
        type: Sequelize.STRING,
      },
      slot_duration: {
        allowNull: true,
        type: Sequelize.STRING
      },
      break_duration: {
        allowNull: true,
        type: Sequelize.STRING
      },
      currency_symbol: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      rating: {
        allowNull: true,
        type: Sequelize.STRING,
      },
      currency_name: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      is_available: {
        allowNull: true,
        defaultValue: '0',
        type: Sequelize.TINYINT(1),
      },
      status : {
        allowNull: true,
        defaultValue: '0',
        type: Sequelize.TINYINT(1),
      }
    },
    {
      getterMethods: {
        speciality: function () { return encryption.decryptData(this.getDataValue("speciality")); },
       // doctor_name: function () { return encryption.decryptData(this.getDataValue("doctor_name")); },
        mobile_no: function () { return encryption.decryptData(this.getDataValue("mobile_no")); },
        email: function () { return encryption.decryptData(this.getDataValue("email")); },
        
        address: function () { return encryption.decryptData(this.getDataValue("address")); },
        state: function () { return encryption.decryptData(this.getDataValue("state")); },
        zip_code: function () { return encryption.decryptData(this.getDataValue("zip_code")); },
        gender: function () { return encryption.decryptData(this.getDataValue("gender")); },
        education: function () { return encryption.decryptData(this.getDataValue("education")); },
        experience: function () { return encryption.decryptData(this.getDataValue("experience")); },
        registraion_no: function () { return encryption.decryptData(this.getDataValue("registraion_no")); },
        practice: function () { return encryption.decryptData(this.getDataValue("practice")); },
        area_of_expertise: function () { return encryption.decryptData(this.getDataValue("area_of_expertise")); },
        languages: function () { return encryption.decryptData(this.getDataValue("languages")); },
        slot_duration: function () { return encryption.decryptData(this.getDataValue("slot_duration")); },
        break_duration: function(){ return encryption.decryptData(this.getDataValue('break_duration')); },
        currency_name: function () { return encryption.decryptData(this.getDataValue("currency_name")); },
      },
      setterMethods: {
       speciality: function (value) { this.setDataValue("speciality", encryption.encryptData(value)); },
        gender: function (value) { this.setDataValue("gender", encryption.encryptData(value)); },
        address: function (value) { this.setDataValue("address", encryption.encryptData(value)); },
        state: function (value) { this.setDataValue("state", encryption.encryptData(value)); },
        zip_code: function (value) { this.setDataValue("zip_code", encryption.encryptData(value)); },
        education: function (value) { this.setDataValue("education", encryption.encryptData(value)); },
        experience: function (value) { this.setDataValue("experience", encryption.encryptData(value)); },
        registraion_no: function (value) { this.setDataValue("registraion_no", encryption.encryptData(value)); },
        practice: function (value) { this.setDataValue("practice", encryption.encryptData(value)); },
        area_of_expertise: function (value) { this.setDataValue("area_of_expertise", encryption.encryptData(value)); },
        languages: function (value) { this.setDataValue("languages", encryption.encryptData(value)); },
        slot_duration: function (value) { this.setDataValue("slot_duration", encryption.encryptData(value)); },
        break_duration: function(value){ this.setDataValue('break_duration', encryption.encryptData(value)); },
        //doctor_name: function (value) { this.setDataValue('doctor_name', encryption.encryptData(value)); },
        mobile_no: function (value) { this.setDataValue('mobile_no', encryption.encryptData(value)); },
        email: function (value) { this.setDataValue('email', encryption.encryptData(value)); },
        currency_name: function (value) { this.setDataValue('currency_name', encryption.encryptData(value)); },
      },
    }
  );

  return doctor_tbl;
};
