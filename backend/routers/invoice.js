const invoiceRouter = require('express').Router();
const { models } = require('../database');

// Get all invoices
invoiceRouter.get('/', async (req, res) => {
	try {
		let invoices = await models.invoice.findAll({
			include: [models.distributor],
		});
		res.send({ invoices, msg: 'Successfully fetch everything' });
	} catch (err) {
		res.status(400).send({ msg: err });
	}
});

// Get individual invoice
invoiceRouter.get('/:id', async (req, res) => {
	try {
		// get all data related to the invoice
		let invoice = await models.invoice.findOne({
			where: { invoice_id: req.params.id },
			include: [models.distributor],
		});
		if (!invoice) {
			throw 'Could not find data';
		}
		let medicines = await models.medicine.findAll({
			where: { invoice_id: req.params.id },
		});
		invoice.dataValues.medicines = medicines.map((item) => item.dataValues);

		res.send({ invoice, msg: 'Successfully fetch everything' });
	} catch (err) {
		console.log(err);
		res.status(400).send({ msg: err });
	}
});

// Delete the invoice and all the data related to the invoice
invoiceRouter.delete('/:id', async (req, res) => {
	try {
		await models.invoice.destroy({
			where: { invoice_id: req.params.id },
		});
		await models.medicine.destroy({
			where: {
				invoice_id: req.params.id,
			},
		});

		res.status(200).send({ msg: 'Deleted data successfully' });
	} catch (err) {
		res.status(400).send({ msg: err.messsage || 'Could not delete data' });
	}
});

// Seed data not needed
invoiceRouter.post('/seed', async (req, res) => {
	try {
		const body = req.body;
		if (!body) {
			throw { status: 404, msg: 'No data in seed file' };
		}
		const seedArr = body.map((elem) => {
			return {
				invoice_name: elem.name,
				date_of_invoice: elem.dateOfInvoice,
				distributor_id: elem.distribId,
			};
		});
		const bulkResult = await models.invoice.bulkCreate(seedArr, {
			returning: true,
		});
		res.status(200).send({ msg: 'Successfully seeded invoice data' });
	} catch (err) {
		res.status(400).send(err.msg || err.message);
	}
});

// update the invoice, name, date,etc and delete all data related to the invoice and create new ones to replace them.
invoiceRouter.put('/:id', async (req, res) => {
	try {
		const body = req.body;
		// Save the invoice first and get the invoice name
		const invoice = await models.invoice.update(
			{
				invoice_name: body.invoiceName,
				date_of_invoice: body.dateOfInvoice,
				distributor_id: body.distributor,
			},
			{ where: { invoice_id: req.params.id }, returning: true }
		);

		const invoiceId = req.params.id;

		await models.medicine.destroy({ where: { invoice_id: invoiceId } });

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

module.exports = invoiceRouter;
