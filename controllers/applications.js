let App = require("../models/App");
//let { generateToken } = require("../helpers/jwt");
let controller = {};

controller.self = async (req,res)=>{
  const {_id} = req.user
  let apps = await App.find({user:_id})
  res.status(200).json(apps)
}

controller.adminAll = async (req, res) => {
  let apps = await App.find();
  res.status(200).json(apps);
};

controller.apply = async (req, res) => {
  // console.log("lol", req.body);
  req.body.user = req.user._id;
  let app = await App.create(req.body);
  res.status(200).send(app);
};

module.exports = controller;
