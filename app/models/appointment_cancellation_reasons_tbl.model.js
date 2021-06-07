var encryption = require("../helpers/Encryption");
module.exports = (sequelize, Sequelize) => {
  const appointment_cancellation_reasons_tbl = sequelize.define(
    "appointment_cancellation_reasons",
    {
        cancellation_reason: {
        allowNull: true,
        type: Sequelize.STRING,
      }
    },
    /*{
      getterMethods: { 
        name: function () { return encryption.decryptData(this.getDataValue("name")); }, 
        username: function () { return encryption.decryptData(this.getDataValue("username")); }, 
        password: function () { return encryption.decryptData(this.getDataValue("password")); }, 
        mobile_no: function () { return encryption.decryptData(this.getDataValue("mobile_no")); },
        email: function () { return encryption.decryptData(this.getDataValue("email")); }, 
      },
      username: {
        name: function (value) { this.setDataValue("name", encryption.encryptData(value)); },
        username: function (value) { this.setDataValue("username", encryption.encryptData(value)); },
        password: function (value) { this.setDataValue("password", encryption.encryptData(value)); },
        mobile_no: function (value) { this.setDataValue("mobile_no", encryption.encryptData(value)); },
        email: function (value) { this.setDataValue("email", encryption.encryptData(value)); },
      },
    
    } */
  );
  return appointment_cancellation_reasons_tbl;
};
