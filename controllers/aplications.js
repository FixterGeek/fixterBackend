const Aplication = require("../models/Aplication");
let controller = {};


controller.getAplications = (req, res) => {
  Aplication.find()
    .then(aplications=>{
      return res.status(200).json(aplications)
    }).catch(error=>{
      return res.status(400).json(error)
    })
};

controller.getAplication = (req, res) => {
  const {id} = req.params
  Aplication.findById()
    .then(aplications=>{
      return res.status(200).json(aplications)
    }).catch(error=>{
      return res.status(400).json(error)
    })
};

controller.createAplication = (req, res) => {
  Aplication.create(req.body)
    .then(aplications=>{
      return res.status(201).json(aplications)
    }).catch(error=>{
      return res.status(400).json(error)
    })
};

controller.updateAplication = (req, res) => {
  const {id} = req.params
  Aplication.findByIdAndUpdate(id,{$set:req.body}, {new:true})
    .then(aplications=>{
      return res.status(201).json(aplications)
    }).catch(error=>{
      return res.status(400).json(error)
    })
};

controller.deleteAplication = (req, res) => {
  const {id} = req.params
  Aplication.findByIdAndRemove(id)
    .then(aplications=>{
      return res.status(201).json(aplications)
    }).catch(error=>{
      return res.status(400).json(error)
    })
};

module.exports = controller;
