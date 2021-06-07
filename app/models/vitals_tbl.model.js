var encryption = require('../helpers/Encryption');
module.exports = (sequelize, Sequelize) => {
    const vitals_tbl = sequelize.define("vitals", {
        vital_name: {
        allowNull: false,
        type: Sequelize.STRING
      },
      default: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      min: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      mid:{
        allowNull: false,
        type: Sequelize.INTEGER
      },
      max: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      dangerous_up: {
        allowNull: false,
        type: Sequelize.INTEGER,
        defaultValue: '0',
      },
      dangerous_down: {
        allowNull: false,
        type: Sequelize.INTEGER,
        defaultValue: '0',
      },
      status: {
        allowNull: false,
        type: Sequelize.INTEGER,
        defaultValue: '0',
      },
    },
);

    return vitals_tbl;
  };