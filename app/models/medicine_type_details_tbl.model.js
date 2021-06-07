var encryption = require("../helpers/Encryption");
module.exports = (sequelize, Sequelize) => {
  const medicine_type_detail = sequelize.define(
    "medicine_type_detail",
    {
      category: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      medicine_type_name: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      category_id: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      status: {
        allowNull: true,
        type: Sequelize.TINYINT(1),
      },
      route_order: {
        allowNull: true,
        type: Sequelize.TINYINT(1),
      },
    },
    {
      getterMethods: {
      
      },
      setterMethods: {
       
      },
    }
  );
  return medicine_type_detail;
};
