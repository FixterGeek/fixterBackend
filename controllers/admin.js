const User = require("../models/User");
let controller = {};


controller.getUsers = async (req, res) => {
  let items = await User.find().populate('bootcamps')
  return res.status(200).json(items)
};

controller.editUser = async (req, res) => {
  let { id } = req.params
  let { body } = req
  let user = await User.findByIdAndUpdate(id, body, { new: true })
  return res.status(200).json(user)
};

// controller.getAplication = (req, res) => {
//   const {id} = req.params
//   Aplication.findById()
//     .then(aplications=>{
//       return res.status(200).json(aplications)
//     }).catch(error=>{
//       return res.status(400).json(error)
//     })
// };

// controller.createAplication = async (req, res) => {
// 	const course = await Course.findById(req.body.course);
// 	req.body.cost = course.price;
//   Aplication.create(req.body)
//     .then(aplications=>{
//       return res.status(201).json(aplications)
//     }).catch(error=>{
//       return res.status(400).json(error)
//     })
// };

// controller.updateAplication = (req, res) => {
//   const {id} = req.params
//   Aplication.findByIdAndUpdate(id,{$set:req.body}, {new:true})
//     .then(aplications=>{
//       return res.status(201).json(aplications)
//     }).catch(error=>{
//       return res.status(400).json(error)
//     })
// };

// controller.deleteAplication = (req, res) => {
//   const {id} = req.params
//   Aplication.findByIdAndRemove(id)
//     .then(aplications=>{
//       return res.status(201).json(aplications)
//     }).catch(error=>{
//       return res.status(400).json(error)
//     })
// };

module.exports = controller;
