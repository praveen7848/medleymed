var encryption = require("../../helpers/Encryption");
module.exports = (sequelize, Sequelize) => {
  const products_master_tbl = sequelize.define(
    "products_master_tbl",
    {
    
      medicineid: {
        allowNull: false,
        type: Sequelize.STRING,
        //primaryKey: true
      },
      medicinename: {
        allowNull: true,
        type: Sequelize.STRING,
      },
      manufacturer: {
        allowNull: true,
        type: Sequelize.STRING,
      },
      strength: {
        allowNull: true,
        type: Sequelize.STRING,
      },
      size: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      price_to_stockist: {
        allowNull: true,
        type: Sequelize.STRING,
      },
      mrp: {
        allowNull: true,
        type: Sequelize.STRING,
      },
      price_to_retail: {
        allowNull: true,
        type: Sequelize.STRING,
      },
      goods_service_tax: {
        allowNull: true,
        type: Sequelize.STRING,
      },
      goods_price_to_retail: {
        allowNull: true,
        type: Sequelize.STRING,
      },
      composition: {
        allowNull: true,
        type: Sequelize.STRING,
      },
      form: {
        allowNull: true,
        type: Sequelize.STRING,
      },
      description: {
        allowNull: true,
        type: Sequelize.STRING,
      },
      attributes: {
        allowNull: true,
        type: Sequelize.STRING,
      },
      createdAt: {
        allowNull: true,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: true,
        type: Sequelize.DATE,
      },
      is_featured: {
        allowNull: true,
        type: Sequelize.TINYINT(1),
      },
      is_deleted: {
        allowNull: true,
        type: Sequelize.TINYINT(1),
      },
      hsn_code: {
        allowNull: true,
        type: Sequelize.STRING(25),
      },
      is_validated: {
        allowNull: true,
        type: Sequelize.STRING(25),
      },
      company_id: {
        allowNull: true,
        type: Sequelize.INTEGER,
      },
      product_class_id: {
        allowNull: true,
        type: Sequelize.INTEGER,
      },
    },
    { timestamps: false },
    {
      getterMethods: {
        // medicine_id: function () {
        //   return encryption.decryptData(this.getDataValue("medicine_id"));
        // },
      },
      setterMethods: {
        // medicine_id: function (value) {
        //   this.setDataValue("medicine_id", encryption.encryptData(value));
        // },
      },
    }
  );
  return products_master_tbl;
};
