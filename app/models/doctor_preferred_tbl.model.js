var encryption = require("../helpers/Encryption");
module.exports = (sequelize, Sequelize) => {
    const doctor_preferred = sequelize.define(
        "doctor_preferred",
        {
            patient_id: {
                allowNull: true,
                type: Sequelize.INTEGER,
            },
            doctor_id: {
                allowNull: true,
                type: Sequelize.INTEGER,
            },
            status: {
                defaultValue: '1',
                type: Sequelize.BOOLEAN,
            },
        },
        // {
        //   getterMethods: {

        //   },
        //   setterMethods: {

        //   },
        // }
    );
    return doctor_preferred;
};
