const express = require("express");
const router = express.Router();
const controller = require("../controllers/aplications");

function tryCatch(fn) {
	return function(req, res, next) {
		return fn(req, res).catch(e => next(e));
	};
}

router.get("/", tryCatch(controller.getAplications) );

router.get("/:id", tryCatch(controller.getAplication) );

router.post("/", tryCatch(controller.createAplication) );

router.patch("/:id", tryCatch(controller.updateAplication) );

router.delete("/:id", tryCatch(controller.deleteAplication) );

module.exports = router;
