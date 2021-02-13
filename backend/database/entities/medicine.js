const { DataTypes } = require('sequelize');
const getInvoice = require('./invoice');

const medicineSchema = {
	id: {
		allowNull: false,
		autoIncrement: true,
		type: DataTypes.INTEGER,
	},
	medicine_name: {
		type: DataTypes.STRING,
		primaryKey: true,
	},
	batch_code: {
		primaryKey: true,
		type: DataTypes.STRING,
	},
	quantity: {
		type: DataTypes.INTEGER,
		allowNull: false,
	},
	bonus: {
		type: DataTypes.INTEGER,
	},
	mrp: {
		type: DataTypes.FLOAT,
		allowNull: false,
	},
	cost: {
		type: DataTypes.FLOAT,
		allowNull: false,
	},
	mfd_date: {
		type: DataTypes.STRING,
	},
	exp_date: {
		type: DataTypes.STRING,
	},
	invoice_id: {
		primaryKey: true,
		type: DataTypes.INTEGER,
	},
};

const defineMedicine = (sequelize) => {
	const Medicine = sequelize.define('medicine', medicineSchema);
	const Invoice = getInvoice(sequelize);
	Medicine.belongsTo(Invoice, {
		foreignKey: '_fk',
		targetKey: 'invoice_id',
		onDelete: 'CASCADE',
	});
	return Medicine;
};

module.exports = defineMedicine;
