var encryption = require("../helpers/Encryption");
module.exports = (sequelize, Sequelize) => {
    const clinic_schedule_tbl = sequelize.define(
        "doctor_clinic_appointment_schedule_tbl",
        {
            doctor_id: {
                allowNull: false,
                type: Sequelize.INTEGER,
            },
            clinic_id: {
                allowNull: false,
                type: Sequelize.INTEGER,
            },
            doctor_name: {
                allowNull: false,
                type: Sequelize.STRING,
            },
            appointment_day: {
                allowNull: false,
                type: Sequelize.STRING,
            },
            appointment_date: {
                allowNull: false,
                type: Sequelize.DATE,
            },
            from_date: {
                allowNull: false,
                type: Sequelize.DATE,
            },
            to_date: {
                allowNull: false,
                type: Sequelize.DATE,
            },
            appointment_type: {
                allowNull: false,
                type: Sequelize.STRING,
            },
            is_repeat: {
                allowNull: false,
                type: Sequelize.TINYINT(1),
            },
            from_time: {
                allowNull: false,
                type: Sequelize.TIME,
            },
            to_time: {
                allowNull: false,
                type: Sequelize.TIME,
            },
            module_type: {
                allowNull: false,
                type: Sequelize.STRING,
            },
            consultation_duration: {
                allowNull: false,
                type: Sequelize.STRING,
            },
            break_time: {
                allowNull: false,
                type: Sequelize.STRING,
            },
            notification_duration: {
                allowNull: false,
                type: Sequelize.STRING,
            },
            status: {
                allowNull: false,
                type: Sequelize.STRING,
            },
            consultation_mode: {
                allowNull: false,
                type: Sequelize.STRING,
            },
            doctor_timezone: {
                allowNull: false,
                type: Sequelize.STRING,
            },
        },
    );
    return clinic_schedule_tbl;
};
