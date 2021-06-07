var encryption = require("../helpers/Encryption");
module.exports = (sequelize, Sequelize) => {
  const healthos_medicine_data = sequelize.define(
    "healthos_medicine_data",
    {
      medicineid: {
        allowNull: false,
        type: Sequelize.STRING,
        primaryKey: true
      },
      medicinename	: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      manufacturer: {
        allowNull: true,
        type: Sequelize.STRING,
      },
      unit_price	: {
        allowNull: true,
        type: Sequelize.DECIMAL,
      },
      package_form: {
        allowNull: true,
        type: Sequelize.STRING,
      },
      drug_type	: {
        allowNull: true,
        type: Sequelize.STRING,
      },
      product_group_name: {
        allowNull: true,
        type: Sequelize.STRING,
      },
      standard_units	: {
        allowNull: true,
        type: Sequelize.INTEGER,
      },
      form: {
        allowNull: true,
        type: Sequelize.TEXT,
      },
      size: {
        allowNull: true,
        type: Sequelize.STRING,
      },
      per_unit: {
        allowNull: true,
        type: Sequelize.INTEGER,
      },
      mrp: {
        allowNull: true,
        type: Sequelize.DECIMAL,
      },
      'schedule-category': {
        allowNull: true,
        type: Sequelize.STRING,
      },
      'schedule-description': {
        allowNull: true,
        type: Sequelize.TEXT,
      },
      constituents_name: {
        allowNull: true,
        type: Sequelize.TEXT,
      },
      'constituents-strength': {
        allowNull: true,
        type: Sequelize.TEXT,
      },
      'interactions-food-show_alert': {
        allowNull: true,
        type: Sequelize.STRING,
      },
      'interactions-food-tag': {
        allowNull: true,
        type: Sequelize.STRING,
      },
      'interactions-food-color_codes': {
        allowNull: true,
        type: Sequelize.STRING,
      },
      'interactions-food-description': {
        allowNull: true,
        type: Sequelize.TEXT,
      },
      'interactions-food-label': {
        allowNull: true,
        type: Sequelize.STRING,
      },
      'interactions-lactation-show_alert': {
        allowNull: true,
        type: Sequelize.TEXT,
      },
      'interactions-lactation-tag': {
        allowNull: true,
        type: Sequelize.STRING,
      },
      'interactions-lactation-color_code': {
        allowNull: true,
        type: Sequelize.STRING,
      },
      'interactions-lactation-description': {
        allowNull: true,
        type: Sequelize.TEXT,
      },
      'interactions-lactation-label': {
        allowNull: true,
        type: Sequelize.STRING,
      },
      'interactions-alcohol-show_alert': {
        allowNull: true,
        type: Sequelize.TEXT,
      },
      'interactions-alcohol-tag': {
        allowNull: true,
        type: Sequelize.STRING,
      },
	  'interactions-alcohol-color_code': {
        allowNull: true,
        type: Sequelize.STRING,
      },
      'interactions-alcohol-description': {
        allowNull: true,
        type: Sequelize.TEXT,
      },
      'interactions-alcohol-description-label': {
        allowNull: true,
        type: Sequelize.STRING,
      },
      'interactions-pregnancy-label': {
        allowNull: true,
        type: Sequelize.TEXT,
      },
      'interactions-pregnancy-tag': {
        allowNull: true,
        type: Sequelize.STRING,
      },
      'interactions-pregnancy-color_code': {
        allowNull: true,
        type: Sequelize.STRING,
      },
      'interactions-pregnancy-description': {
        allowNull: true,
        type: Sequelize.TEXT,
      },
      'interactions-pregnancy-show_alert': {
        allowNull: true,
        type: Sequelize.STRING,
      },
      components : {
        allowNull: true,
        type: Sequelize.TEXT,
      }
    },
    {
      getterMethods: {},
      setterMethods: {},
    }
  );
  return healthos_medicine_data;
};
