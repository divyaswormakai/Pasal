const { DataTypes } = require('sequelize');
const getDistributor = require('./distributor');

const invoiceSchema = {
	invoice_id: {
		allowNull: false,
		autoIncrement: true,
		primaryKey: true,
		type: DataTypes.INTEGER,
	},
	invoice_name: {
		allowNull: false,
		unique: true,
		type: DataTypes.STRING,
	},
	date_of_invoice: {
		allowNull: false,
		type: DataTypes.STRING,
	},
};

const defineInvoice = (sequelize) => {
	const Invoice = sequelize.define('invoice', invoiceSchema, {
		timestamps: true,
	});
	const Distributor = getDistributor(sequelize);
	Invoice.belongsTo(Distributor, {
		foreignKey: 'distributor_id',
		onDelete: 'CASCADE',
	});

	return Invoice;
};

module.exports = defineInvoice;
