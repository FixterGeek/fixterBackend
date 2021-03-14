const Cupon = require("../models/Cupon");
let controller = {};


controller.getCupons = async (req, res) => {
	const cupons = await Cupon.find();
	res.status(200).json(cupons)
};

controller.validateCoupon = async (req, res) => {
	const {name} = req.params
	const coupon = await Cupon.findOne({name});
	if(!(coupon===null)) {
		const today = new Date()
		const dueDate = new Date(coupon.validUntil)
		if(today<dueDate) {
			return 	res.status(200).json({isValid:true, coupon})
		}else{
			return res.status(200).json({isValid:false, coupon})
		}
	}
	res.status(404).json({message:'Descuento no encontrado'})
};

controller.apply = async (req, res) => {
	let { cupon: name, courseId } = req.body
	let cupon = name ? await Cupon.findOne({ name }) : null;
	//no valid
	if (!cupon.valid) return res.status(406).json({ message: "Cupón no válido" })
	// sold out
	if (cupon.quantity < 1) return res.status(409).json({ message: "Cupón agotado" })
	// used

	//used = {
	//	[userId]:{
	//		[courseID]:true
	//}

	if (cupon.used[req.user._id]) return res.status(423).json({ message: "Cúpon usado" })
	//applying
	//marcar como usado sólo si pagan
	/*
	cupon.used = {
		...cupon.used,
		[req.user._id]: { [courseId]: true }
	}
	cupon.quantity--
	await cupon.save()
	**/

	return res.status(202).json(cupon)
}



controller.createCupon = async (req, res) => {
	const {user:{_id}} = req
	const cupon = await Cupon.create({...req.body, createdBy:_id});
	res.status(200).json(cupon);
};

controller.updateCupon = async (req, res) => {
	const cupon = await Cupon.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true });
	res.status(200).json(cupon);
};

controller.deleteCupon = async (req, res) => {
	const cupon = await Cupon.findByIdAndRemove(req.params.id);
	res.status(200).json(cupon);
};

module.exports = controller;
