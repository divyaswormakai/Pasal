const { DataTypes } = require('sequelize');

const distributorSchema = {
	distrib_id: {
		allowNull: false,
		autoIncrement: true,
		primaryKey: true,
		type: DataTypes.INTEGER,
	},
	distrib_name: {
		allowNull: false,
		unique: true,
		type: DataTypes.STRING,
	},
	contact: {
		allowNull: true,
		type: DataTypes.STRING,
	},
	address: {
		allowNull: true,
		type: DataTypes.STRING,
	},
};

const defineDistributor = (sequelize) => {
	const Distributor = sequelize.define('distributor', distributorSchema, {
		timestamps: false,
	});

	return Distributor;
};

module.exports = defineDistributor;
