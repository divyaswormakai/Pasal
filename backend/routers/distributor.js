const distributorRouter = require('express').Router();
const { models, model } = require('../database');

// Get list of distributors
distributorRouter.get('/', async (req, res) => {
	try {
		let distributors = await models.distributor.findAll();
		res.status(200).send({
			distributors,
			msg: 'Successfully fetch everything',
		});
	} catch (err) {
		console.log(error);
	}
});

// Add new distributor
distributorRouter.post('/', async (req, res) => {
	try {
		const body = req.body;
		const distributor = await models.distributor.create({
			distrib_name: body.name,
			contact: body.contact,
			address: body.address,
		});
		if (!distributor) {
			throw 'Could not find the required distributor';
		}
		res.status(200).send({ msg: 'Successfull added data', distributor });
	} catch (err) {
		res.status(400).send({ msg: err });
	}
});

// Get individual Distributor
distributorRouter.get('/:id', async (req, res) => {
	try {
		let distributor = await models.distributor.findOne({
			where: { distrib_id: req.params.id },
		});
		if (!distributor) {
			throw 'Could not find data';
		}
		res.send({ distributor, msg: 'Successfully fetch everything' });
	} catch (err) {
		console.log(err);
		res.status(400).send({ msg: err });
	}
});

// Delete Distributor data
distributorRouter.delete('/:id', async (req, res) => {
	try {
		await models.distributor.destroy({
			where: { distrib_id: req.params.id },
		});

		res.status(200).send('Deleted distributor successfully');
	} catch (err) {
		res.status(400).send({ msg: err });
	}
});

// Edit Distributor data
distributorRouter.put('/:id', async (req, res) => {
	try {
		const body = req.body;
		const distributor = await models.distributor.update(
			{
				distrib_name: body.name,
				contact: body.contact,
				address: body.address,
			},
			{ where: { distrib_id: req.params.id }, returning: true }
		);
		if (!distributor) {
			throw 'Could not find the required distributor';
		}
		console.log(distributor);
		res.status(200).send({
			distributor: distributor[1][0],
			msg: 'Successfull updated data',
		});
	} catch (err) {
		res.status(400).send({ msg: err });
	}
});

// Seed data for testing
distributorRouter.post('/seed', async (req, res) => {
	try {
		const body = req.body;
		if (!body) {
			throw { status: 400, msg: 'The request has empty payload' };
		}
		const seedArr = body.map((elem) => {
			return {
				distrib_name: elem.name,
				contact: elem.contact,
				address: elem.address,
			};
		});

		const bulkResult = await models.distributor.bulkCreate(seedArr, {
			returning: true,
		});
		console.log(bulkResult);
		res.status(200).send({ msg: 'Successfully seeded invoice data' });
	} catch (err) {
		res.status(400).send({ msg: err.msg || err.message });
	}
});

module.exports = distributorRouter;
