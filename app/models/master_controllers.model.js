var encryption = require("../helpers/Encryption");
module.exports = (sequelize, Sequelize) => {
  const tbl_master_controller = sequelize.define(
    "master_controllers",
    {
      super_module_id : {
        allowNull : false,
        type: Sequelize.STRING,
      },
      module_name : {
        allowNull : false,
        type: Sequelize.STRING,
      },
      module_unique_id : {
        allowNull : false,
        type: Sequelize.STRING,
      },
      module_required : {
        allowNull : false,
        type: Sequelize.INTEGER
      },
      module_sqequence : {
        allowNull : false,
        type: Sequelize.INTEGER
      },
      updated_by:{
        allowNull : false,
        type: Sequelize.STRING,
      },
      module_status:{
        allowNull : false,
        type: Sequelize.INTEGER,
      }
    },
    {
      getterMethods: { 
         module_unique_id: function () { return encryption.decryptData(this.getDataValue("module_unique_id")); },
         module_name: function () { return encryption.decryptData(this.getDataValue("module_name")); },
         super_module_id: function () { return encryption.decryptData(this.getDataValue("super_module_id")); },
         updated_by: function () { return encryption.decryptData(this.getDataValue("updated_by")); }
      },
      setterMethods: {
         module_unique_id: function (value) { this.setDataValue("module_unique_id", encryption.encryptData(value)); },
         module_name: function (value) { this.setDataValue("module_name", encryption.encryptData(value)); },
         super_module_id: function (value) { this.setDataValue("super_module_id", encryption.encryptData(value)); },
         updated_by: function (value) { this.setDataValue("updated_by", encryption.encryptData(value)); },
      },
    }
  );

  return tbl_master_controller  ;
};
