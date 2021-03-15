let App = require("../models/App");
let User = require("../models/User");
let Cupon = require("../models/Cupon");
let Student = require("../models/Student");
let Bootcamp = require("../models/Bootcamp");
const Edition = require('../models/Edition')
let Order = require("../models/Order");
//let { generateToken } = require("../helpers/jwt");
const conekta = require("conekta");
let controller = {};
let { inscriptionMail } = require("../helpers/mailer");

//conekta.api_key = process.env.ENV === 'production' ? process.env.CONEKTA_KEY : process.env.CONEKTA_KEY_DEV
conekta.api_key = process.env.CONEKTA_KEY;
conekta.api_version = "2.0.0";
conekta.locale = "es";

function useCupon(cupon, used) {
	if (!cupon) return console.log("sin cupon");
	cupon.used = { ...cupon.used, ...used };
	cupon.quantity--;
	console.log("wat", cupon);
	return Cupon.findByIdAndUpdate(cupon._id, cupon, { new: true }).then((cu) =>
		console.log("edited?", cu)
	);
}

controller.whosmissing = async (req, res) => {
	let orders = await Order.find({ total: 250 }).populate("user", "email");
	let users = orders.map((o) => ({
		id: o.user._id,
		bootcamp: o.products[0]._id,
	}));
	res.json({ users });
};

controller.promo = (req, res) => {
	console.log("entró", req.body);
	const {
		tel,
		// fullName,
		// email,
		tokenId,
		bootcampId,
		bootcampName = "Bootcamp online preorden",
		// total
	} = req.body;
	const user = req.user;
	const chargeObj = {
		payment_method: {
			type: "card",
			token_id: tokenId,
		},
	};
	//if (plazo !== "contado") chargeObj.payment_method.monthly_installments = parseInt(plazo);
	const conektaObject = {
		currency: "MXN",
		customer_info: {
			// name: fullName,
			phone: tel,
			// email: email,
		},
		line_items: [
			{
				name: "Bootcamp online preorden",
				// unit_price: Number(total) * 100,
				unit_price: 1250 * 100,
				// quantity: total ? (Number(total) / 1000) : 1,
				quantity: 1,
			},
		],
		charges: [chargeObj],
	};
	conekta.Order.create(conektaObject, function (err, order) {
		if (err) {
			console.log("conektaerror", err);
			return res.status(400).json(err);
		}
		//console.log('conekta order', order)
		// create order
		Order.create({
			products: [{ model: bootcampName }], // rided off the id
			conektaId: order._id,
			user: user._id,
			preorder: true,
			// total: total ? Number(total) : 1000,
			total: Number(total),
			paid: true,
		})
			.then((o) => {
				// return User.findByIdAndUpdate(user._id, { $push: { bootcamps: bootcampId } }, { new: true }) // asignamos
				return User.findByIdAndUpdate(
					user._id,
					{ $push: { payments: bootcampId } },
					{ new: true }
				);
			})
			.then((u) => {
				return res.status(200).json({ message: "ok", user: u });
			})
			.catch((e) => {
				console.log(e);
				return res.status(400).json(e);
			});
	}); // conecta create
};

controller.group = (req, res) => {
	console.log("entró", req.body);
	const {
		tel,
		fullName,
		email,
		tokenId,
		// bootcampId
		total,
	} = req.body;
	const chargeObj = {
		payment_method: {
			type: "card",
			token_id: tokenId,
		},
	};
	//if (plazo !== "contado") chargeObj.payment_method.monthly_installments = parseInt(plazo);
	const conektaObject = {
		currency: "MXN",
		customer_info: {
			name: fullName,
			phone: tel,
			email: email,
		},
		line_items: [
			{
				name: "Bootcamp online",
				unit_price: 1000 * 100,
				quantity: total ? Number(total) / 1000 : 1,
			},
		],
		charges: [chargeObj],
	};
	conekta.Order.create(conektaObject, function (err, order) {
		if (err) {
			console.log("conektaerror", err);
			return res.status(400).json(err);
		}
		//console.log('conekta order', order)
		// create order
		Order.create({
			products: [{ model: "Bootcamp online" }], // rided off the id
			conektaId: order._id,
			// user: user._id,
			total: total ? Number(total) : 1000,
			paid: true,
		})
			.then((o) => {
				return res.status(200).json({ o, order });
			})
			.catch((e) => {
				console.log(e);
				return res.status(400).json(e);
			});
	}); // conecta create
};

//2021

controller.hibrid = async (req, res) => {
	const {
		coupon,
		phone,
		cardName,
		tokenId,
		bootcampId,
		monthly_installments,
	} = req.body;
	const user = req.user;
	let bootcamp = await Edition.findById(bootcampId);
	let payment_method = {
		type: "card",
		token_id: tokenId
	};
	if (monthly_installments > 2)
		payment_method.monthly_installments = monthly_installments;
	const chargeObj = {
		payment_method,
	};
	// if coupon
	let totalAmount = Number(bootcamp.price)
	if(coupon){
		const cou = await Cupon.findOne({name:coupon})
		if(cou && cou.amount){
			totalAmount = totalAmount - Number(cou.amount)
		} else if(cou && cou.value) {
			totalAmount = totalAmount - (totalAmount * Number(cou.value)/100)
		}
	}
	const conektaObject = {
		currency: "MXN",
		customer_info: {
			name: cardName,
			phone,
			email: user.email
		},
		line_items: [
			{
				name: bootcamp.title,
				unit_price: totalAmount * 100
				quantity: 1,
			},
		],
		charges: [chargeObj]
	};
	conekta.Order.create(conektaObject, function (err, order) {
		if (err) {
			console.log("conektaerror", err);
			return res.status(400).json(err);
		}
		Order.create({
			products: [{ model: "Bootcamp", id: bootcampId }],
			conektaId: order._id,
			user: user._id,
			total: bootcamp.price,
			paid: true,
		})
			.then((o) => {
				// send Email:
				inscriptionMail({
					email:user.email,
					displayName: cardName,
					bootcampTitle: bootcamp.title,
				});
				// create student
				return User.findOneAndUpdate(
					{_id:user._id,editions: { $ne: bootcampId }},
					{ $push: { editions: bootcampId } }
				)
			})
			.then(() => {
				return res.status(201).json(order)
			})
			.catch((e) => {
				console.log(e);
				return res.status(400).json(e);
			});
	}); // conecta create
};
// 2021 //

controller.bootcamp = async (req, res) => {
	const {
		tel,
		fullName,
		email,
		tokenId,
		bootcampId,
		monthly_installments,
	} = req.body;
	const user = req.user;
	let bootcamp = await Bootcamp.findById(bootcampId);
	let payment_method = {
		type: "card",
		token_id: tokenId,
	};
	if (monthly_installments > 2)
		payment_method.monthly_installments = monthly_installments;
	const chargeObj = {
		payment_method,
	};
	//if (plazo !== "contado") chargeObj.payment_method.monthly_installments = parseInt(plazo);
	const conektaObject = {
		currency: "MXN",
		customer_info: {
			name: fullName,
			phone: tel,
			email: email,
		},
		line_items: [
			{
				name: bootcamp.title,
				unit_price: Number(bootcamp.price) * 100,
				quantity: 1,
			},
		],
		charges: [chargeObj],
	};
	conekta.Order.create(conektaObject, function (err, order) {
		if (err) {
			console.log("conektaerror", err);
			return res.status(400).json(err);
		}
		//console.log('conekta order', order)
		// create order
		Order.create({
			products: [{ model: "Bootcamp", id: bootcampId }],
			conektaId: order._id,
			user: user._id,
			total: 1000,
			paid: true,
		})
			.then((o) => {
				// send Email:
				inscriptionMail({
					email,
					displayName: fullName,
					bootcampTitle: bootcamp.title,
				});
				// create student
				return Student.create({
					bootcamp: bootcampId,
					user: user._id,
					name: fullName,
					tel,
					email,
					paid: true,
					order: o._id,
				});
			})
			.then((s) => {
				// create enroll en user
				// create enroll en bootcamp
				return Bootcamp.findByIdAndUpdate(
					bootcampId,
					{ $push: { students: s._id } },
					{ new: true }
				);
			})
			.then((b) => {
				return User.findByIdAndUpdate(
					user._id,
					{ $push: { bootcamps: bootcampId } },
					{ new: true }
				).populate("bootcamps");
			})
			.then((u) => {
				return res.status(200).json(u);
			})
			.catch((e) => {
				console.log(e);
				return res.status(400).json(e);
			});
	}); // conecta create
};

controller.pay = (req, res) => {
	//conekta payment

	const { conektaToken, plazo, application, cupon } = req.body;
	let used = { [req.user._id]: true };
	const user = req.user;

	App.findById(application._id)
		.then((elapp) => {
			const chargeObj = {
				payment_method: {
					type: "card",
					token_id: conektaToken,
				},
			};

			//discounts
			let discount = 0;
			elapp.cost = elapp.cost * 100;
			if (plazo === "contado" && !cupon) {
				discount = elapp.cost * 0.1;
			} else if ((plazo === "contado" || plazo !== "contado") && cupon) {
				discount = (elapp.cost * cupon.value) / 100;
			} else {
				discount = 0;
			}

			if (plazo !== "contado")
				chargeObj.payment_method.monthly_installments = parseInt(plazo);
			const conektaObject = {
				currency: "MXN",
				customer_info: {
					name: elapp.name,
					phone: elapp.tel,
					email: elapp.email,
				},
				line_items: [
					{
						name: elapp.course,
						unit_price: elapp.cost - discount,
						quantity: 1,
					},
				],
				charges: [chargeObj],
			};
			conekta.Order.create(conektaObject, function (err, order) {
				if (err) {
					console.log("conektaerror", err);
					return res.status(400).json(err);
				}
				App.findByIdAndUpdate(
					elapp._id,
					{ $set: { paid: true } },
					{ new: true }
				)
					.then((application) => {
						//console.log(order.toObject())
						//cancelamos el cupon
						useCupon(cupon, used);
						//
						return res
							.status(200)
							.json({ application, order: order.toObject() });
					})
					.catch((e) => {
						console.log(e);
						return res.status(400).json(e);
					});
			});
		})
		.catch((e) => res.status(400).json(e));
};

module.exports = controller;
