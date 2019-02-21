const Cupon = require("../models/Cupon");
let controller = {};


controller.getCupons = async (req, res) => {	
	cupons = await Cupon.find();
	res.status(200).json({cupons})
};

controller.getCupons = async (req, res) => {	
  const {cupon} = req.query
  if(cupon){    
    let elcupon = await Cupon.findOne({users:req.user._id});    
    if(elcupon)res.status(200).json(elcupon)
    else res.status(404).json({message:'Cupón no válido'})
  }else{
    cupons = await Cupon.find();
	  res.status(200).json({cupons})
  }
	
};

controller.createCupon = async (req, res) => {
	const cupon = await Cupon.create(req.body);
	res.status(200).json(cupon);
};

controller.updateCupon = async (req, res) => {
	const cupon = await Cupon.findByIdAndUpdate(req.params.id, {$set: req.body}, {new: true});
	res.status(200).json(cupon);
};

controller.deleteCupon = async (req, res) => {
	const cupon = await Cupon.findByIdAndRemove(req.params.id);
	res.status(200).json(cupon);
};

module.exports = controller;
