var encryption = require("../../helpers/Encryption");
module.exports = (sequelize, Sequelize) => {
  const shortage_book_tbl = sequelize.define(
    "shortage_book_tbl",
    {
      retailer_id: {
        allowNull: false,
        type: Sequelize.INTEGER,
      },
      quantity: {
        allowNull: true,
        type: Sequelize.INTEGER,
      },
      medicine_id: {
        allowNull: false,
        type: Sequelize.INTEGER,
      },
    },
    {
      getterMethods: {
       
      },
      setterMethods: {
        
      },
    }
  );
  return shortage_book_tbl;
};
