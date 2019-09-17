const express = require("express");
const router = express.Router();
const controller = require("../controllers/bootcamps");
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

router.get("/", tryCatch(controller.getBootcamps));

// router.post("/", tryCatch(controller.createCourse) );

// router.patch("/:id", tryCatch(controller.updateCourse) );

// router.delete("/:id", tryCatch(controller.deleteCourse) );

// weeks
router.post(
  '/:id/weeks',
  verifyToken,
  checkIfAdmin,
  tryCatch(controller.addWeek)
)

module.exports = router;
