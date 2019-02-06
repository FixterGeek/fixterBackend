let User = require("../models/User");
let { generateToken } = require("../helpers/jwt");
let controller = {};

controller.signup = async (req, res) => {
  let user = await User.register(req.body, req.body.password);
  let token = generateToken(user);
  res.send({ user, token });
};

module.exports = controller;
