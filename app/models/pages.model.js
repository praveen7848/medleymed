var encryption = require("../helpers/Encryption");
module.exports = (sequelize, Sequelize) => {
    const pages_tbl = sequelize.define(
        "pages",
        {
            page_name: {
                allowNull: false,
                type: Sequelize.STRING,
            },
            description: {
                allowNull: false,
                type: Sequelize.TEXT('long'),
            },
        },
        {
            getterMethods: {
                page_name: function () { return encryption.decryptData(this.getDataValue("page_name")); },
                description: function () { return encryption.decryptData(this.getDataValue("description")); },
            },
            setterMethods: {
                page_name: function (value) { this.setDataValue("page_name", encryption.encryptData(value)); },
                description: function (value) { this.setDataValue("description", encryption.encryptData(value)); },
            },
        },
    );
    return pages_tbl;
};
