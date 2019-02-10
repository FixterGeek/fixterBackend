let App = require("../models/App");
//let { generateToken } = require("../helpers/jwt");
let controller = {};

controller.adminAll = async (req, res) => {
  let apps = await App.find();
  res.status(200).json(apps);
};

controller.apply = async (req, res) => {
  console.log("lol", req.body);
  let app = await App.create(req.body);
  res.status(200).send(app);
};

module.exports = controller;
