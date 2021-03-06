const express = require("express");
const router = express.Router();
const controller = require("../controllers/aplications");

function tryCatch(fn) {
	return function(req, res, next) {
		return fn(req, res).catch(e => next(e));
	};
}

router.get("/", controller.getAplications );

router.get("/:id", controller.getAplication );

router.post("/", tryCatch(controller.createAplication));

router.patch("/:id", controller.updateAplication );

router.delete("/:id", controller.deleteAplication );

module.exports = router;
