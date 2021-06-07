var encryption = require("../helpers/Encryption");
module.exports = (sequelize, Sequelize) => {
    const tbl_doctor_slot_timings = sequelize.define(
        "doctor_slot_timings_tbl",
        {
            slot_type: {
                allowNull: false,
                type: Sequelize.STRING,
            },
            from_time: {
                allowNull: false,
                type: Sequelize.STRING,
            },
            duration: {
                allowNull: false,
                type: Sequelize.STRING,
            },
            is_active: {
                allowNull: false,
                defaultValue:1,
                type: Sequelize.TINYINT(1),
            },
        },
    );
    return tbl_doctor_slot_timings;
};
