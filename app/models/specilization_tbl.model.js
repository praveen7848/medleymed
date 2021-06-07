var encryption = require("../helpers/Encryption");
module.exports = (sequelize, Sequelize) => {
    const specializations = sequelize.define(
      "specialization",
      {
        name: {
          allowNull: false,
          type: Sequelize.STRING,
        },
        status	: {
          allowNull: false,
          type: Sequelize.STRING, 
        },
        
      },
      {
        getterMethods: {
            name: function () { return encryption.decryptData(this.getDataValue("name")); },
            status: function () { return encryption.decryptData(this.getDataValue("status")); },
        },
        setterMethods: {
          name: function (value) { this.setDataValue("name", encryption.encryptData(value)); },
          status: function (value) { this.setDataValue("status", encryption.encryptData(value)); },
        }, 
      }
    );
  
    return specializations;
  };
  