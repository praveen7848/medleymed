var encryption = require("../helpers/Encryption");
module.exports = (sequelize, Sequelize) => {
    const telemedicine_schedule_child_tbl = sequelize.define(
        "doctor_appointment_slots_tbl",
        {
            schedule_table_id: {
                allowNull: false,
                type: Sequelize.INTEGER,
            },
            doctor_id: {
                allowNull: false,
                type: Sequelize.INTEGER,
            },
            from_date: {
                allowNull: false,
                type: Sequelize.STRING,
            },
            appointment_day: {
                allowNull: false,
                type: Sequelize.STRING,
            },
            slot_type: {
                allowNull: false,
                type: Sequelize.STRING,
            },
            slot_start_time: {
                allowNull: false,
                type: Sequelize.STRING,
            },
            slot_start_24hr_time: {
                allowNull: false,
                type: Sequelize.STRING,
            },
            slot_end_time: {
                allowNull: false,
                type: Sequelize.STRING,
            },
            slot_end_24hr_time: {
                allowNull: false,
                type: Sequelize.TIME,
            },
            is_active: {
                allowNull: false,
                type: Sequelize.TINYINT(1),
            },
            module_type: {
                allowNull: false,
                type: Sequelize.STRING,
            },
            break_time: {
                allowNull: false,
                type: Sequelize.STRING,
            },
            consultation_duration: {
                allowNull: false,
                type: Sequelize.STRING,
            },
            notification_duration: {
                allowNull: false,
                type: Sequelize.STRING,
            },
        },
    );
    return telemedicine_schedule_child_tbl;
};
