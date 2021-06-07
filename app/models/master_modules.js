var encryption = require("../helpers/Encryption");
module.exports = (sequelize, Sequelize) => {
  const tbl_master_modules = sequelize.define(
    "master_modules",
    {
      master_module_id:{
        allowNull : false,
        type: Sequelize.STRING, 
      },
     name: {
        allowNull : false,
        type: Sequelize.STRING, 
      },
      sub_unique_id : {
        allowNull: false,
        type: Sequelize.STRING,
      },
      sqequence : {
        allowNull : false,
        type: Sequelize.INTEGER,
      },
      required : {
        allowNull : false,
        type: Sequelize.INTEGER,
      },
      status : {
        allowNull : false,
        type: Sequelize.BOOLEAN,
      }
     
    },
    {
      getterMethods: {
        sub_unique_id: function () { return encryption.decryptData(this.getDataValue("sub_unique_id")); }, 
        master_module_id: function () { return encryption.decryptData(this.getDataValue("master_module_id")); }, 
        name: function () { return encryption.decryptData(this.getDataValue("name")); }, 
      },
      setterMethods: {
        sub_unique_id: function (value) { this.setDataValue("sub_unique_id", encryption.encryptData(value)); },
        master_module_id: function (value) { this.setDataValue("master_module_id", encryption.encryptData(value)); },
        name: function (value) { this.setDataValue("name", encryption.encryptData(value)); },
      },
    }
  );
  return master_modules;
};
