const Course = require("../models/Course");
let controller = {};


controller.getCourses = async (req, res) => {
	let courses = [];
	let queryParams = Object.keys(req.query);
	// filtrando cursos por query params
	if( queryParams.length > 0 ){
		let query = {};
		//creado el query dinamicamente
		query["$or"] = queryParams.map(key => {
			return {[key]: req.query[key]}
		});
		courses = await Course.find(query);
		return res.status(200).json({courses})
	}
	// si no hay query params mando todos
	courses = await Course.find();
	res.status(200).json({courses})
};

controller.createCourse = async (req, res) => {
	const course = await Course.create(req.body);
	res.status(200).json(course);
};

controller.updateCourse = async (req, res) => {
	const course = Course.findByIdAndUpdate(req.params.id, req.body, {new: true});
	res.status(200).json(course);
};

controller.deleteCourse = async (req, res) => {
	const course = Course.findByIdAndRemove(req.params.id);
	res.status(200).json(course);
};

module.exports = controller;