let App = require("../models/App");
const Edition = require("../models/Edition");
//let { generateToken } = require("../helpers/jwt");
let { paymentMethods } = require("../helpers/mailer");
let controller = {};

controller.self = async (req, res) => {
	const { _id } = req.user;
	let apps = await App.find({ user: _id }).populate('course');
	res.status(200).json(apps);
};

controller.adminAll = async (req, res) => {
	let apps = await App.find().populate("course");
	res.status(200).json(apps);
};

controller.apply = async (req, res) => {
	//y que se hace con los datos de la aplicacion?
	const course = await Edition.findById(req.body.course);
	req.body.cost = course ? course.price : 12000;
	req.body.user = req.user._id;
	let exists = await App.findOne({
		user: req.user._id,
		course: req.body.course
	});
	if (exists) return res.json({ message: "Ya has aplicado" });
	let app = await App.create(req.body);
	paymentMethods(req.user, req.body.email);
	res.status(200).json(app);
};

module.exports = controller;
