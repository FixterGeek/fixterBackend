const express = require("express");
const router = express.Router();
const controller = require("../controllers/cupons");

function tryCatch(fn) {
	return function(req, res, next) {
		return fn(req, res).catch(e => next(e));
	};
}

router.get("/", tryCatch(controller.getCupons) );


router.post("/", tryCatch(controller.createCupon) );

router.patch("/:id", tryCatch(controller.updateCupon) );

router.delete("/:id", tryCatch(controller.deleteCupon) );

module.exports = router;
