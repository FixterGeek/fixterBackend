const Edition = require("../models/Edition");
const User = require("../models/User");
let controller = {};

controller.getSelfEditions = async (req,res) => {
	const {user} = req
	// lowercase
	const userWithEditions = await User.findById(user._id).populate({path:'editions', populate:'bootcamp'})
	return res.status(200).json(userWithEditions)
}

controller.getOneEdition = async (req,res) => {
	const {id} = req.params
	const edition = await Edition.findById(id).populate('bootcamp')
	return res.status(200).json(edition)
}

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
		editions = await Edition.find(query).populate('bootcamp');
		return res.status(200).json(editions)
	}
	// si no hay query params mando todos
	editions = await Edition.find({active:true}).populate('bootcamp');
	res.status(200).json(editions)
};

controller.createEdition = async (req, res) => {
	const edition = await Edition.create(req.body);
	res.status(200).json(edition);
};

controller.updateEdition = async (req, res) => {
	const edition = await Edition.findByIdAndUpdate(req.params.id, req.body, {new: true});
	res.status(200).json(edition);
};

controller.deleteEdition = async (req, res) => {
	const edition = await Edition.findByIdAndRemove(req.params.id);
	res.status(200).json(edition);
};

module.exports = controller;
