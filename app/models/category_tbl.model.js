var encryption = require('../helpers/Encryption');
module.exports = (sequelize, Sequelize) => {
    const category_tbl = sequelize.define("category_tbl", {
      category_type: {
        allowNull: false,
        type: Sequelize.STRING
      },
      clinic_id: {
        allowNull: true,
        type: Sequelize.INTEGER,
      },
      category: {
        allowNull: false,
        type: Sequelize.STRING
      },
      category_image: {
        allowNull: true,
        type: Sequelize.STRING
      },
      status: {
        allowNull: false,
        type: Sequelize.BOOLEAN
      }
    },
    {
      getterMethods:{
        category_type: function(){ return encryption.decryptData(this.getDataValue('category_type')); },
        category: function(){ return encryption.decryptData(this.getDataValue('category')); },
      },
      setterMethods:{
        category_type: function(value){ this.setDataValue('category_type', encryption.encryptData(value)); },
        category: function(value){ this.setDataValue('category', encryption.encryptData(value)); },
        
      }
    },
	{
		indexes: [
			{
				unique: true,
				fields: ['category', 'category_type']
			}
		]
	});

    return category_tbl;
  };