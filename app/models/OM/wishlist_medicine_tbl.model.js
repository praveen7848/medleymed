var encryption = require("../../helpers/Encryption");
module.exports = (sequelize, Sequelize) => {
  const wishlist_medicine_tbl = sequelize.define(
    "wishlist_medicine_tbl",
    {
      cart_id: {
        allowNull: false,
        type: Sequelize.INTEGER,
      },
      patient_id: {
        allowNull: true,
        type: Sequelize.INTEGER,
      },
      medicine_id: {
        allowNull: false,
        type: Sequelize.INTEGER,
      },
      quantity: {
        allowNull: false,
        type: Sequelize.STRING,
      },
    },
  );
  return wishlist_medicine_tbl;
};
