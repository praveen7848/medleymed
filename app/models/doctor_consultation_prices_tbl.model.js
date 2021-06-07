var encryption = require("../helpers/Encryption");
module.exports = (sequelize, Sequelize) => {
    const doctor_consultation_prices_tbl = sequelize.define(
        "doctor_consultation_prices_tbl",
        {
            starting_price: {
                allowNull: false,
                type: Sequelize.INTEGER,
            },
            end_price	: {
                allowNull: true,
                type: Sequelize.STRING,
            },
           
        },
       
    );

   
    return doctor_consultation_prices_tbl;
};
