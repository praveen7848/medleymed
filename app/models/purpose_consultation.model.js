var encryption = require("../helpers/Encryption");

module.exports = (sequelize, Sequelize) => {
    const purpose_consultation_tbl = sequelize.define(
        "purpose_consultation",
        {
            category_id: {
                allowNull: false,
                type: Sequelize.INTEGER,
            },
            consultation_name:{
                allowNull: false,
                type: Sequelize.STRING,
            }
        },
		{
			getterMethods: { 
				consultation_name: function () { return encryption.decryptData(this.getDataValue("consultation_name")); },
			},
			setterMethods: {
				consultation_name: function (value) { this.setDataValue("consultation_name", encryption.encryptData(value)); },
			},
		},
    );
    return purpose_consultation_tbl;
};
