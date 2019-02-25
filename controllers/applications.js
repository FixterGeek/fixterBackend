let App = require("../models/App");
const Course = require("../models/Course");
//let { generateToken } = require("../helpers/jwt");
let { paymentMethods } = require("../helpers/mailer");
let controller = {};

controller.self = async (req, res) => {
	const { _id } = req.user;
	let apps = await App.find({ user: _id });
	res.status(200).json(apps);
};

controller.adminAll = async (req, res) => {
	let apps = await App.find().populate("course");
	res.status(200).json(apps);
};

controller.apply = async (req, res) => {
	const course = await Course.findById(req.body.course);
	req.body.cost = course ? course.price : 12000;
	req.body.user = req.user._id;
	let exists = await App.findOne({
		user: req.user._id,
		course: req.body.course
	});
	if (exists) return res.json({ message: "Ya has aplicado" });
	let app = await App.create(req.body);
	paymentMethods(req.user);
	res.status(200).json(app);
};

module.exports = controller;
