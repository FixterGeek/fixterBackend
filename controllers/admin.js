const Model = require("../models/User");
let controller = {};


controller.getUsers = (req, res) => {
  Model.find()
    .then(items => {
      return res.status(200).json(items)
    }).catch(error => {
      return res.status(400).json(error)
    })
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
