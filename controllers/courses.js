const Course = require("../models/Course");
let controller = {};


controller.getCourse = (req, res) => {};

controller.createCourse = async (req, res) => {
	const course = await Course.create(req.body);
	res.status(200).json(course);
};

controller.updateCourse = (req, res) => {};

controller.deleteCourse = (req, res) => {};

module.exports = controller;
