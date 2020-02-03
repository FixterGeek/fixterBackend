const Bootcamp = require("../models/Bootcamp");
const User = require("../models/User");
const Week = require("../models/Week");
const Exam = require("../models/Exam");
const Learning = require("../models/Learning");
const Homework = require("../models/Homework");
const mongoose = require("mongoose")


let controller = {};


controller.getBootcamps = async (req, res) => { // asegurarse de que no enviamos las respuestas del examen ------------------------------
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
  bootcamps = await Bootcamp.find({ active: true }).populate('weeks').populate('exam'); // quitamos las learnings DEBES BORRAR EL EXAMEN PORQUE LLEVA RESPUESTAS
  res.status(200).json({ bootcamps })
};

controller.getBootcampAdmin = async (req, res) => {
  let { id } = req.params
  let bootcamp = await Bootcamp.findById(id)
  let weeks = await Week.find({ bootcamp: id })
  let exam = await Exam.find({ bootcamp: id })
  let b = await bootcamp.toObject()
  if (exam) b.exam = exam.toObject()
  b.weeks = weeks
  res.status(200).json(b)
}

controller.getSingleBootcamp = async (req, res) => {

  // get id and user
  let { id } = req.params
  let { user } = req
  let bootcamp = await Bootcamp.findById(id).populate('weeks')
  let learnings = await Learning.find({ week: bootcamp.weeks[0]._id }, { title: 1 }) // cuando no hay semanas falla
  bootcamp.weeks[0].learnings = learnings
  // if user
  if (user) {
    let enrolled = user.bootcamps.find(_id => _id.toString() === bootcamp._id.toString())
    if (!enrolled) {
      return res.status(200).json(bootcamp)
    }

    // hay que enviar solo las semanas activas... en base a la fecha

    let boot = await Bootcamp.findById(id).populate("weeks")
    //prework
    let learnings = await Learning.find({ week: bootcamp.weeks[0]._id })
    let homeworks = await Homework.find({ week: bootcamp.weeks[0]._id })
    boot.weeks[0].learnings = learnings
    boot.weeks[0].homeworks = homeworks
    // week1
    let learnings1 = await Learning.find({ week: bootcamp.weeks[1]._id })
    let homeworks1 = await Homework.find({ week: bootcamp.weeks[1]._id })
    boot.weeks[1].learnings = learnings1
    boot.weeks[1].homeworks = homeworks1

    // week2
    let learnings2 = await Learning.find({ week: bootcamp.weeks[2]._id })
    let homeworks2 = await Homework.find({ week: bootcamp.weeks[2]._id })
    boot.weeks[2].learnings = learnings2
    boot.weeks[2].homeworks = homeworks2
    // week3
    let learnings3 = await Learning.find({ week: bootcamp.weeks[3]._id })
    let homeworks3 = await Homework.find({ week: bootcamp.weeks[3]._id })
    boot.weeks[3].learnings = learnings3
    boot.weeks[3].homeworks = homeworks3
    // week4
    let learnings4 = await Learning.find({ week: bootcamp.weeks[4]._id })
    let homeworks4 = await Homework.find({ week: bootcamp.weeks[4]._id })
    boot.weeks[4].learnings = learnings4
    boot.weeks[4].homeworks = homeworks4

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
    let homework = await Homework.findByIdAndUpdate(id, body, { new: true })
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

// exams
controller.gradeExam = async (req, res) => {
  let { id } = req.params // del bootcamp
  let { body } = req // answers
  // verificamos intentos
  // let user = await User.findById(req.user._id)
  // if (req.user.exams && req.user.exams[id] > 2) return res.status(403).json({ message: "Ya haz respondido este examen" })
  let exist = await Exam.findOne({ bootcamp: id })
  if (!exist) return res.status(204).json({ message: "No hay examen asociado" })
  let exam = await exist.toObject()
  let { questions } = exam
  let total = questions.length
  let { answers } = body
  let grade = 0
  for (let [i, q] of questions.entries()) {
    if (q.correct == answers[i]) grade++
  }
  let result = { string: `${grade}/${total}`, grade, approved: ((grade * 10 / total) > 8) }
  // guardamos resultado
  if (!req.user.exams) req.user.exams = {}
  if (req.user.exams[id]) req.user.exams[id] = { attempts: req.user.exams[id].attempts + 1, ...result }
  else req.user.exams[id] = { attempts: 1, ...result }
  req.user.markModified('exams');
  await req.user.save()
  return res.status(200).json(result)
}

controller.saveExam = async (req, res) => {
  let { id } = req.params // id del bootcamp
  let { body } = req
  let exist = await Exam.findOne({ bootcamp: id })
  if (exist) {
    let exam = await Exam.findByIdAndUpdate(exist._id, body, { new: true })
    return res.status(200).json(exam)
  } else {
    let exam = await Exam.create(body)
    return res.status(200).json(exam)
  }
}

controller.getExam = async (req, res) => {
  let { user } = req // buscamos al usuario también para saber sus intentos
  let { id } = req.params
  if (req.query.bootcampId) {
    let exam = await Exam.findOne({ bootcamp: id })
    if (exam) {
      exam = await exam.toObject()
      exam.answers = exam.questions.map(q => {
        delete q.correct
        return q
      })
      // verify user
      console.log(user.exams)
      if (user.exams && user.exams[exam._id] && user.exams[exam._id].attempts > 1) {
        return res.status(401).json({ message: "Ya no puedes responder este examen", attempts: user.exams[exam._id].attempts })
      }
      return res.status(200).json(exam)
    }
  }
  let exam = await Exam.findById(id)
  if (exam) {
    exam = await exam.toObject()
    exam.answers = exam.questions.map(q => {
      delete q.correct
      return q
    })
  } else return res.status(204)

  res.status(200).json(exam)
}


module.exports = controller;
