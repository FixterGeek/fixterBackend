const express = require("express");
const router = express.Router();
const controller = require("../controllers/admin");
let { verifyToken } = require("../helpers/jwt");

function tryCatch(fn) {
  return function (req, res, next) {
    return fn(req, res).catch(e => next(e));
  };
}

function checkIfAdmin(req, res, next) {
  if (req.user.role !== "ADMIN") return res.status(301).json({ message: "No tienes privilegios para ver esta información" })
  next()
}

router.get("/users",
  verifyToken,
  checkIfAdmin,
  controller.getUsers);

// router.get("/:id", controller.getAplication );

// router.post("/", tryCatch(controller.createAplication));

// router.patch("/:id", controller.updateAplication );

// router.delete("/:id", controller.deleteAplication );

module.exports = router;
