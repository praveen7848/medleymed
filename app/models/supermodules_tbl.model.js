module.exports = (sequelize, Sequelize) => {
    const supermodules_tbl = sequelize.define(
        "supermodules_tbl",
        {
            name: {
                allowNull: false,
                type: Sequelize.STRING,
            },
            display_name: {
                allowNull: false,
                type: Sequelize.STRING,
            },
            unique_id	: {
                allowNull: false,
                type: Sequelize.STRING, 
            },
            required	: {
                allowNull: false,
                type: Sequelize.BOOLEAN, 
            }, 
            sequence	: {
                allowNull: false, 
                type: Sequelize.INTEGER, 
            },
            image	: {
                allowNull: false,
                type: Sequelize.STRING, 
            },
            short_description	: {
                allowNull: false,
                type: Sequelize.STRING, 
            },
            description	: {
                allowNull: false,
                type: Sequelize.STRING, 
            },
            status	: {
                allowNull: false,
                type: Sequelize.BOOLEAN, 
            },
            updated_by	: {
                allowNull: false,
                type: Sequelize.STRING, 
            },
        },
        
    );
    
    return supermodules_tbl;
};
