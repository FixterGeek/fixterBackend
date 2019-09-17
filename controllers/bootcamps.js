const Bootcamp = require("../models/Bootcamp");
const Week = require("../models/Week");
const Learning = require("../models/Learning");


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
  res.status(200).json(b)
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

controller.getWeek = async (req, res) => {
  let { id } = req.params
  let week = await Week.findById(id).populate('bootcamp')
  let w = await week.toObject()
  let learnings = await Learning.find({ week: id })
  w.learnings = learnings
  res.status(200).json(w)
}

controller.updateWeek = async (req, res) => {
  let { id } = req.params
  let week = await Week.findByIdAndUpdate(id, req.body, { new: true }).populate('bootcamp')
  let w = await week.toObject()
  let learnings = await Learning.find({ week: id })
  w.learnings = learnings
  res.status(200).json(w)
}

//learnings
controller.saveLearning = async (req, res) => {
  let { id } = req.params
  let { body } = req
  if (!id) {
    let learning = await Learning.create(body)
    return res.status(201).json(learning)
  } else {
    let learning = await Learning.findByIdAndUpdate(id, body, { new: true })
    return res.status(200).json(learning)
  }
}

controller.deleteLearning = async (req, res) => {
  let { id } = req.params
  let learning = await Learning.findByIdAndDelete(id)
  //borramos el orden
  let week = await Week.findById(learning.week)
  let w = await week.toObject()
  let l = learning.toObject()
  w.itemsOrder.splice(indexOf(l._id), 1)
  await Week.findByIdAndUpdate(w._id, { itemsOrder: w.itemsOrder })
  //borramos el orden
  return res.status(204).json(learning)
}

module.exports = controller;
