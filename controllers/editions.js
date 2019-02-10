const Edition = require("../models/Edition");
let controller = {};


controller.getEditions = async (req, res) => {
	let editions = [];
	let queryParams = Object.keys(req.query);
	// filtrando cursos por query params
	if( queryParams.length > 0 ){
		let query = {};
		//creado el query dinamicamente
		query["$or"] = queryParams.map(key => {
			return {[key]: req.query[key]}
		});
		editions = await Edition.find(query);
		return res.status(200).json({editions})
	}
	// si no hay query params mando todos
	editions = await Edition.find();
	res.status(200).json({editions})
};

controller.createEdition = async (req, res) => {
	const edition = await Edition.create(req.body);
	res.status(200).json(edition);
};

controller.updateEdition = async (req, res) => {
	const edition = Edition.findByIdAndUpdate(req.params.id, req.body, {new: true});
	res.status(200).json(edition);
};

controller.deleteEdition = async (req, res) => {
	const edition = Edition.findByIdAndRemove(req.params.id);
	res.status(200).json(edition);
};

module.exports = controller;