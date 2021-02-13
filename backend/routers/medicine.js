const medicineRouter = require('express').Router();
const { models } = require('../database');
const sequelize = require('../database');

// Get Medicine data
medicineRouter.get('/', async (req, res) => {
	try {
		let medicineList = await sequelize.query(
			'select * from "medicines" as m1 inner join "invoices" as m2 on m1."invoice_id" = m2."invoice_id" inner join "distributors" as m3 on m2."distributor_id" = m3."distrib_id";'
		);

		res.send({
			medicineList: medicineList[0],
			msg: 'Successfully fetch everything',
		});
	} catch (err) {
		console.log(err);
		res.status(400).send({ msg: err.msg || 'Could not find data' });
	}
});

// Get Individual Medicine data by id
medicineRouter.get('/:id', async (req, res) => {
	try {
		let medicineList = await sequelize.query(
			'select * from "medicines" as m1 inner join "invoices" as m2 on m1."invoice_id" = m2."invoice_id" inner join "distributors" as m3 on m2."distributor_id" = m3."distrib_id" where m1."id"=' +
				req.params.id
		);
		res.send({
			medicineList: medicineList[0],
			msg: 'Successfully fetch everything',
		});
	} catch (err) {
		console.log(err);
		res.status(400).send({ msg: err.msg || 'Could not find data' });
	}
});

// Get All data from the medicine name
medicineRouter.get('/name/:name', async (req, res) => {
	try {
		let medicineList = await sequelize.query(
			'select * from "medicines" as m1 inner join "invoices" as m2 on m1."invoice_id" = m2."invoice_id" inner join "distributors" as m3 on m2."distributor_id" = m3."distrib_id" where m1."medicine_name"=\'' +
				req.params.name +
				"'"
		);
		res.send({
			medicineList: medicineList[0],
			msg: 'Successfully fetch everything',
		});
	} catch (err) {
		res.status(400).send({
			msg: err.msg || 'Could not get data for the name',
		});
	}
});

// Add list of medicines, creates invoice here
medicineRouter.post('/add', async (req, res) => {
	try {
		const body = req.body;
		// Save the invoice first and get the invoice name
		const invoice = await models.invoice.create({
			invoice_name: body.invoiceName,
			date_of_invoice: body.dateOfInvoice,
			distributor_id: body.distributor,
		});

		const invoiceId = invoice.getDataValue('invoice_id');
		console.log('ASDFASDFASDF', invoiceId);
		//get medicine body, check if the name already exists and such
		const medicineArr = body.medicines.map((medicine) => {
			return {
				medicine_name: medicine.name,
				batch_code: medicine.batch,
				quantity: medicine.quantity,
				bonus: medicine.bonus,
				mrp: medicine.mrp,
				cost: medicine.cost,
				mfd_date: medicine.mfd_date,
				exp_date: medicine.exp_date,
				invoice_id: invoiceId,
				_fk: invoiceId,
			};
		});

		console.log(medicineArr);

		const postedMedicines = await models.medicine.bulkCreate(medicineArr, {
			returning: true,
		});

		res.status(200).send({
			postedMedicines,
			msg: 'Added data successfuly',
		});
	} catch (error) {
		res.status(400).send({
			msg: error.message || error.msg || 'Could not upload data',
		});
	}
});

// Delete the medicine
medicineRouter.delete('/:id', async (req, res) => {
	try {
		await models.medicine.destroy({ where: { id: req.params.id } });
		res.status(200).send({ msg: 'Successfully delete the data' });
	} catch (error) {
		res.status(400).send({
			msg: error.message || error.msg || 'Could not upload data',
		});
	}
});

module.exports = medicineRouter;
