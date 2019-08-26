const express = require("express");
const router = express.Router();
const controller = require("../controllers/bootcamps");

function tryCatch(fn) {
  return function (req, res, next) {
    return fn(req, res).catch(e => next(e));
  };
}

router.get("/", tryCatch(controller.getBootcamps));

// router.post("/", tryCatch(controller.createCourse) );

// router.patch("/:id", tryCatch(controller.updateCourse) );

// router.delete("/:id", tryCatch(controller.deleteCourse) );

module.exports = router;