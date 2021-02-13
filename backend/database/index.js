const { Sequelize } = require('sequelize');
const config = require('../config');

const sequelize = new Sequelize(
	config.DB_DATABASE,
	config.DB_USERNAME,
	config.DB_PASSWORD,
	{
		host: 'localhost',
		dialect: config.DB_CLIENT,
		port: config.DB_PORT,
	}
);

// sequelize.sync({ force: true });

const entityDefiners = [
	require('./entities/distributor'),
	require('./entities/invoice'),
	require('./entities/medicine'),
];

for (const entityDefiner of entityDefiners) {
	entityDefiner(sequelize);
}

module.exports = sequelize;
