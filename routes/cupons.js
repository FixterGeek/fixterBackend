const express = require("express");
const router = express.Router();
const controller = require("../controllers/cupons");
const { verifyToken } = require("../helpers/jwt");

function tryCatch(fn) {
	return function (req, res, next) {
		return fn(req, res).catch(e => next(e));
	};
}

function checkIfAdmin(req, res, next) {
	if (req.user.role !== "ADMIN") return res.status(301).json({ message: "No tienes authorización" })
	next()
}

router.post("/apply", verifyToken, tryCatch(controller.apply));

router.patch("/:id", verifyToken, checkIfAdmin, tryCatch(controller.updateCupon));

router.delete("/:id", verifyToken, checkIfAdmin, tryCatch(controller.deleteCupon));

router.post("/", verifyToken, checkIfAdmin, tryCatch(controller.createCupon));

router.get("/", verifyToken, checkIfAdmin, tryCatch(controller.getCupons));




module.exports = router;
