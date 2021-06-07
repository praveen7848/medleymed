var encryption = require("../helpers/Encryption");
module.exports = (sequelize, Sequelize) => {
    const coupan_tbl = sequelize.define(
        "coupan",
        {
            coupon_name: {
                allowNull: false,
                type: Sequelize.STRING,
            },
            start_date: {
                allowNull: false,
                type: Sequelize.DATEONLY,
            },
            end_date: {
                allowNull: false,
                type: Sequelize.DATEONLY,
            },
            is_percentage: {
                allowNull: false,
                defaultValue: '1',
                type: Sequelize.BOOLEAN,
            },
            discount: {
                allowNull: false,
                type: Sequelize.STRING,
            },
            is_all: {
                allowNull: false,
                defaultValue: '1',
                type: Sequelize.BOOLEAN,
            },
            customers: {
                allowNull: true,
                type: Sequelize.STRING,
            },
            status: {
                allowNull: false,
                defaultValue: '1',
                type: Sequelize.BOOLEAN,
            },
        },
        {
            getterMethods: {
                coupon_name: function () { return encryption.decryptData(this.getDataValue("coupon_name")); },
            },
            setterMethods: {
                coupon_name: function (value) { this.setDataValue("coupon_name", encryption.encryptData(value)); },
            },
        },
    );
    return coupan_tbl;
};
