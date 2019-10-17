const Bootcamp = require("../models/Bootcamp");
const User = require("../models/User");
const Week = require("../models/Week");
const Learning = require("../models/Learning");
const Homework = require("../models/Homework");
const mongoose = require("mongoose")


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
  bootcamps = await Bootcamp.find({ active: true }).populate('weeks'); // quitamos las learnings
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

controller.getSingleBootcamp = async (req, res) => {

  // get id and user
  let { id } = req.params
  let { user } = req
  let bootcamp = await Bootcamp.findById(id).populate('weeks')
  let learnings = await Learning.find({ week: bootcamp.weeks[0]._id }, { title: 1 })
  bootcamp.weeks[0].learnings = learnings
  // if user
  if (user) {
    let enrolled = user.bootcamps.find(_id => _id.toString() === bootcamp._id.toString())
    if (!enrolled) {
      return res.status(200).json(bootcamp)
    }
    let boot = await Bootcamp.findById(id).populate("weeks")
    let learnings = await Learning.find({ week: bootcamp.weeks[0]._id })
    let homeworks = await Learning.find({ week: bootcamp.weeks[0]._id })
    boot.weeks[0].learnings = learnings
    boot.weeks[0].homeworks = homeworks
    return res.status(200).json(boot)
  }
  return res.status(200).json(bootcamp)
  // let { id } = req.params
  // let bootcamp = await Bootcamp.findById(id).populate('weeks')
  // let learnings = await Learning.find({ week: bootcamp.weeks[0]._id }, { title: 1 })
  // bootcamp.weeks[0].learnings = learnings
  // res.status(200).json(bootcamp)
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
  let homeworks = await Homework.find({ week: id })
  w.learnings = learnings
  w.homeworks = homeworks
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
    // add order
    await Week.findByIdAndUpdate(learning.week, { $push: { itemsOrder: learning._id } })
    // add order
    return res.status(201).json(learning)
  } else {
    let learning = await Learning.findByIdAndUpdate(id, body, { new: true })
    return res.status(200).json(learning)
  }
}

controller.deleteLearning = async (req, res) => {
  let { id } = req.params
  let learning = await Learning.findByIdAndDelete(id)
  //borramos del orden
  let week = await Week.findById(learning.week)
  let order = week.itemsOrder.filter(i => i.toString() !== learning._id.toString())
  week.itemsOrder = [...order]
  await week.markModified('itemsOrder');
  await week.save()
  //borramos el orden
  return res.status(204).json(learning)
}

//homeworks
controller.saveHomework = async (req, res) => {
  let { id } = req.params
  let { body } = req
  if (!id) {
    let homework = await Homework.create(body)
    // add order
    // await Week.findByIdAndUpdate(homework.week, { $push: { itemsOrder: homework._id } })
    // add order
    return res.status(201).json(homework)
  } else {
    let homework = await Learning.findByIdAndUpdate(id, body, { new: true })
    return res.status(200).json(homework)
  }
}

controller.deleteHomework = async (req, res) => {
  let { id } = req.params
  let homework = await Homework.findByIdAndDelete(id)
  //borramos del orden
  //let week = await Week.findById(homework.week)
  //let order = week.itemsOrder.filter(i => i.toString() !== learning._id.toString())
  //week.itemsOrder = [...order]
  //await week.markModified('itemsOrder');
  //await week.save()
  //borramos el orden
  return res.status(204).json(homework)
}

module.exports = controller;
