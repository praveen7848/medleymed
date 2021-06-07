var encryption = require("../helpers/Encryption");
module.exports = (sequelize, Sequelize) => {
  const admin_users_tbl = sequelize.define(
    "admin_users",
    {
        name: {
        allowNull: true,
        type: Sequelize.STRING,
      },
      username	: {
        allowNull: true,
        type: Sequelize.STRING,
      },
      password  	: {
        allowNull: true,
        type: Sequelize.STRING,
      },
      mobile_no 	: {
        allowNull: true,
        type: Sequelize.STRING,
      },
      email  	: {
        allowNull: true,
        type: Sequelize.STRING,
      },
      role_id 	: {
        allowNull: true,
        type: Sequelize.STRING,
      },
      status 	: {
        allowNull: true,
        type: Sequelize.INTEGER,
      },
      clinic_id 	: {
        allowNull: true,
        type: Sequelize.INTEGER,
      },
    },
    {
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
    
    }
  );
  return admin_users_tbl;
};
