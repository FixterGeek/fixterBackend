const Bootcamp = require("../models/Bootcamp");
const Week = require("../models/Week");

let controller = {};


controller.getBootcamps = async (req, res) => {
  //let bootcamps = [];
  let queryParams = Object.keys(req.query);
  // filtrando cursos activos por query params
  if (queryParams.length > 0) {
    let query = { active: true };
    //creado el query dinamicamente
    query["$or"] = queryParams.map(key => {
      return { [key]: req.query[key] }
    });
    bootcamps = await Bootcamp.find(query);
    return res.status(200).json({ bootcamps })
  }
  // si no hay query params mando todos los activos
  bootcamps = await Bootcamp.find({ active: true }); // quitamos los modulos ? o los recursos? o en el detalle
  res.status(200).json({ bootcamps })
};

controller.getBootcampAdmin = async (req, res) => {
  let { id } = req.params
  let bootcamp = await Bootcamp.findById(id)
  let weeks = await Week.find({ bootcamp: id })
  let b = await bootcamp.toObject()
  b.weeks = weeks
  res.statsu(200).json(b)
}

// controller.createCourse = async (req, res) => {
// 	const course = await Course.create(req.body);
// 	res.status(200).json(course);
// };

// controller.updateCourse = async (req, res) => {
// 	const course = await Course.findByIdAndUpdate(req.params.id, {$set: req.body}, {new: true});
// 	res.status(200).json(course);
// };

// controller.deleteCourse = async (req, res) => {
// 	const course = await Course.findByIdAndRemove(req.params.id);
// 	res.status(200).json(course);
// };

// weeks
controller.addWeek = async (req, res) => {
  let bootcampId = req.params.id
  let week = await Week.create(req.body)
  let weeks = await Week.find({ bootcamp: bootcampId })
  let bootcamp = await Bootcamp.findById(bootcampId)
  let b = await bootcamp.toObject()
  b.weeks = weeks
  res.status(201).json(b)
}

module.exports = controller;
