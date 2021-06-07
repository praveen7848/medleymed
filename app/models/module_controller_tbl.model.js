var encryption = require("../helpers/Encryption");
module.exports = (sequelize, Sequelize) => {
  const tbl_module_controller = sequelize.define(
    "tbl_module_controllers",
    {
        user_type: {
        allowNull : false,
        type: Sequelize.STRING,
      },
      user_id : {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      page_access : {
        allowNull : false,
        type: Sequelize.STRING,
      },
    },
    {
      getterMethods: {
        user_type: function () { return encryption.decryptData(this.getDataValue("user_type")); }, 
		    page_access: function () { return encryption.decryptData(this.getDataValue("page_access")); }
      },
      setterMethods: {
        user_type: function (value) { this.setDataValue("user_type", encryption.encryptData(value)); },
        page_access: function (value) { this.setDataValue("page_access", encryption.encryptData(value)); }
      },
    }
  );

  return tbl_module_controller  ;
};
