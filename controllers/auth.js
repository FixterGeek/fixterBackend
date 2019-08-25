let User = require("../models/User");
let { generateToken } = require("../helpers/jwt");
let { welcomeMail } = require("../helpers/mailer");
let controller = {};

controller.self = async (req, res) => {
	let { user } = req
	return res.status(200).send(user)
}

controller.login = async (req, res) => {
	//console.log(req.user);
	let token = generateToken(req.user);
	res.status(200).send({ user: req.user, token });
};

controller.signup = async (req, res) => {
	let exists = await User.findOne({ email: req.body.email });
	if (exists)
		return res
			.status(401)
			.json({ message: "Este email ya existe en el sistema" });
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
