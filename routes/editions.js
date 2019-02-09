const express = require("express");
const router = express.Router();
const controller = require("../controllers/editions");

function tryCatch(fn) {
	return function(req, res, next) {
		return fn(req, res).catch(e => next(e));
	};
}

router.get("/", tryCatch(controller.getEditions) );

router.post("/", tryCatch(controller.createEdition) );

router.patch("/:id", tryCatch(controller.updateEdition) );

router.delete("/:id", tryCatch(controller.deleteEdition) );

module.exports = router;
