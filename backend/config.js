require('dotenv').config();

const PORT = process.env.PORT;

const DB_CLIENT = process.env.CLIENT || 'postgres';
const DB_USERNAME = process.env.DB_USERNAME || 'pasal';
const DB_PASSWORD = process.env.PASSWORD || 'password';
const DB_DATABASE = process.env.DATABASE || 'pasal';
const DB_PORT = process.env.DB_PORT || '5432';

module.exports = {
	PORT,
	DB_CLIENT,
	DB_USERNAME,
	DB_PASSWORD,
	DB_DATABASE,
	DB_PORT,
};
