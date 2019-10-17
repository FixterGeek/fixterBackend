let User = require("../models/User");
let { generateToken } = require("../helpers/jwt");
let { welcomeMail, sendPasswordChanged } = require("../helpers/mailer");
let controller = {};

controller.changePassword = async (req, res) => {
	let { password } = req.body
	await req.user.setPassword(password)
	req.user.changePass = false
	await req.user.save()
	let user = await User.findById(req.user._id, { hash: 0, salt: 0 }).populate('bootcamps')
	return res.status(200).json(user)
}

controller.recovery = async (req, res) => {
	let symbols = ["@", "H", ")", "=", "¿", ".", "*", "¡"]
	let { email } = req.body
	let user = await User.findOne({ email })
	if (!user) return res.status(401).json({ message: "No existe una cuenta con este correo", email })
	let newPass = ''
	symbols.forEach(s => newPass = newPass + Math.floor(Math.random() * 100) + symbols[Math.floor(Math.random() * 7)])
	await user.setPassword(newPass)
	user.changePass = true
	await user.save()
	sendPasswordChanged(newPass, email, user.displayName)
	return res.status(200).json({ message: "Password provisional asignado" })
}

controller.update = async (req, res) => {
	let { user, body } = req
	let self = await User.findByIdAndUpdate(user._id, body, { new: true, projection: { hash: 0, salt: 0 } })
	return res.status(200).send(self)
}

controller.updateHomework = async (req, res) => {
	let { user, body } = req
	let self = await User.findById(user._id, { projection: { hash: 0, salt: 0 } })
	self.homeworks = [...self.homeworks.map(h => {
		if (h.id !== body.id) return h
		return body
	})]
	await self.save()
	return res.status(200).send(self)
}

controller.self = async (req, res) => {
	let { user } = req
	return res.status(200).send(user)
}

controller.login = async (req, res) => {
	//console.log(req.user);
	let token = generateToken(req.user);
	let user = await User.findById(req.user._id, { hash: 0, salt: 0 }).populate({
		path: "bootcamps",
		populate: {
			path: "weeks",
			populate: {
				path: 'learnings'
			}
		}
	}) // do some virtuals
	res.status(200).send({ user, token });
};

controller.signup = async (req, res) => {
	let exists = await User.findOne({ email: req.body.email });
	if (exists)
		return res
			.status(401)
			.json({ message: "Ya hay una cuenta relacionada a este email" });
	req.body.username = req.body.email
	let user = await User.register(req.body, req.body.password);
	//mail de bienvenida
	welcomeMail(user);
	let token = generateToken(user);
	res.send({ user, token });
};

controller.loginFacebookToken = async (req, res) => {
	//console.log(req.user);
	let token = generateToken(req.user);
	res.send({ user: req.user, token });
};

controller.loginGoogleToken = async (req, res) => {
	//console.log(req.user);
	let token = generateToken(req.user);
	res.send({ user: req.user, token });
};

module.exports = controller;
