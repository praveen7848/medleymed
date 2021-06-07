var encryption = require("../helpers/Encryption");
module.exports = (sequelize, Sequelize) => {
  const audit_trails = sequelize.define(
    "audit_trails",
    {
      user_id: {
        allowNull: false,
        type: Sequelize.INTEGER,
      },
      trail_type: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      trail_message: {
        allowNull: false,
        type: Sequelize.STRING(1500),
      },
      status: {
        allowNull: false,
        type: Sequelize.BOOLEAN,
      }
    },
    {
      getterMethods: {
        trail_type: function () { return encryption.decryptData(this.getDataValue("trail_type")); },
        trail_message: function () { return encryption.decryptData(this.getDataValue("trail_message")); }
      },
      setterMethods: {
        trail_type: function (value) { this.setDataValue("trail_type", encryption.encryptData(value)); },
        trail_message: function (value) { this.setDataValue("trail_message", encryption.encryptData(value)); }
      },
    }
  );

  return audit_trails;
};
