//var encryption = require("../helpers/Encryption");
module.exports = (sequelize, Sequelize) => {
    const appointment_tbl_status = sequelize.define(
       "appointment_status",
       {
        status_id: {
            allowNull: true,
            type: Sequelize.INTEGER,
         },
        statustype: {
            allowNull: true,
            type: Sequelize.STRING,
         },
       }
     
    )
    return appointment_tbl_status;    
}