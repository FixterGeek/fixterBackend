const express = require("express");
const router = express.Router();
const controller = require("../controllers/bootcamps");
let { verifyToken, checkIfUserOrNext } = require("../helpers/jwt");

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
router.get("/:id", checkIfUserOrNext, tryCatch(controller.getSingleBootcamp));
router.get(
  "/:id/admin",
  verifyToken,
  checkIfAdmin,
  tryCatch(controller.getBootcampAdmin)
);


// router.patch("/:id", tryCatch(controller.updateCourse) );

// router.delete("/:id", tryCatch(controller.deleteCourse) );

// weeks
router.post(
  '/:id/weeks',
  verifyToken,
  checkIfAdmin,
  tryCatch(controller.addWeek)
)

router.get(
  "/weeks/:id",
  verifyToken,
  checkIfAdmin,
  tryCatch(controller.getWeek)
);
router.patch(
  "/weeks/:id",
  verifyToken,
  checkIfAdmin,
  tryCatch(controller.updateWeek)
);

//learnings
router.post(
  "/learnings",
  verifyToken,
  checkIfAdmin,
  tryCatch(controller.saveLearning)
);

router.patch(
  "/learnings/:id",
  verifyToken,
  checkIfAdmin,
  tryCatch(controller.saveLearning)
);

router.delete(
  "/learnings/:id",
  verifyToken,
  checkIfAdmin,
  tryCatch(controller.deleteLearning)
);


//homeworks
router.post(
  "/homeworks",
  verifyToken,
  checkIfAdmin,
  tryCatch(controller.saveHomework)
);

router.patch(
  "/homeworks/:id",
  verifyToken,
  checkIfAdmin,
  tryCatch(controller.saveHomework)
);

router.delete(
  "/homeworks/:id",
  verifyToken,
  checkIfAdmin,
  tryCatch(controller.deleteHomework)
);

// Exams
router.post(
  "/exams/:id/grade",  // id del bootcamp
  verifyToken,
  // checkIfAdmin,
  tryCatch(controller.gradeExam)
);
router.post(
  "/exams/:id",  // id del bootcamp
  verifyToken,
  checkIfAdmin,
  tryCatch(controller.saveExam)
);
router.get(
  "/exams/:id",
  // verifyToken,
  // checkIfAdmin,
  tryCatch(controller.getExam)
);

module.exports = router;
