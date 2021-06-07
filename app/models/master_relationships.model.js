var encryption = require("../helpers/Encryption");
module.exports = (sequelize, Sequelize) => {
  const master_realtions = sequelize.define(
    "master_relationships",
    {
        relation_name: {
        allowNull: false,
        type: Sequelize.STRING,
      }
    },
    {
      getterMethods: { 
        relation_name: function () { return encryption.decryptData(this.getDataValue("relation_name")); }, 
      },
      setterMethods: {
        relation_name: function (value) { this.setDataValue("relation_name", encryption.encryptData(value)); },
      },
    }
  );
  return master_realtions;
};
