const express = require("express");
const router = express.Router();
const controller = require("../controllers/cupons");
const { verifyToken } = require("../helpers/jwt");

function tryCatch(fn) {
	return function(req, res, next) {
		return fn(req, res).catch(e => next(e));
	};
}

router.get("/", verifyToken, tryCatch(controller.getCupons) );


router.post("/",verifyToken, tryCatch(controller.createCupon) );

router.patch("/:id",verifyToken, tryCatch(controller.updateCupon) );

router.delete("/:id",verifyToken, tryCatch(controller.deleteCupon) );

module.exports = router;
