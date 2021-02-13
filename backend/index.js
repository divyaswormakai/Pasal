const express = require('express');
const config = require('./config');
const path = require('path');
const sequelize = require('./database');
const cors = require('cors');

const medicineRouter = require('./routers/medicine');
const invoiceRouter = require('./routers/invoice');
const distributorRouter = require('./routers/distributor');

const app = express();

app.use('/static', express.static(path.join(__dirname, 'public')));
app.use(cors());
app.use(express.json());

async function connectDB() {
	try {
		await sequelize.authenticate();
		console.log('Database connection OK!');
	} catch (err) {
		console.log('Unable to connect to database.');
		console.log(err.message);
		process.exit(1);
	}
}

connectDB();

const port = config.PORT || 3001;

app.use('/api/medicine', medicineRouter);
app.use('/api/invoice', invoiceRouter);
app.use('/api/distributor', distributorRouter);

app.get('/', (_req, res) => {
	res.send('Hello world');
});

app.listen(port, () => {
	console.log(`Connected to PORT: ${port}`);
});

module.exports = app;
