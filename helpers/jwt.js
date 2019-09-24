const jwt = require("jsonwebtoken");
const User = require("../models/User");

exports.checkIfUserOrNext = (req, res, next) => {
  const token =
    req.body.token ||
    req.query.token ||
    req.headers["x-access-token"] ||
    req.headers["authorization"];
  console.log(token)
  if (!token) return next()
  jwt.verify(token, process.env.SECRET, (err, decoded) => {
    if (err) return res.status(401).json({ message: "Token is invalid or has expired 👀" });
    User.findById(decoded.userId).then(user => {
      req.user = user
      next();
    })
  })
}

exports.generateToken = user => {
  return jwt.sign(
    {
      userId: user._id,
      email: user.email,
      role: user.role
    },
    process.env.SECRET,
    { expiresIn: "72 hours" }
  );
};

exports.verifyToken = (req, res, next) => {
  const token =
    req.body.token ||
    req.query.token ||
    req.headers["x-access-token"] ||
    req.headers["authorization"];
  if (!token) return res.status(401).json({ message: "Missing token" });
  jwt.verify(token, process.env.SECRET, (err, decoded) => {
    if (err)
      return res
        .status(401)
        .json({ message: "Token is invalid or has expired 👀" });
    User.findById(decoded.userId).then(user => {
      req.user = user;
      next();
    });
  });
};
