module.exports = (sequelize, Sequelize) => {
    const symptoms_icd_code = sequelize.define(
        "symptoms_icd_code",
        {
            description: {
                allowNull: false,
                type: Sequelize.STRING,
            },
            code: {
                allowNull: false,
                type: Sequelize.STRING,
            },
            infermedica_id: {
                allowNull: false,
                type: Sequelize.STRING,
            },
            body_part_name: {
                allowNull: false,
                type: Sequelize.INTEGER
            },
            body_part_id: {
                allowNull: true,
                type: Sequelize.INTEGER
            },
            sex: {
                allowNull: false,
                type: Sequelize.STRING,
            }
        },
    );
    return symptoms_icd_code;
};
