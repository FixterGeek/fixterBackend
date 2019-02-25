let express = require("express");
let router = express.Router();
let controller = require("../controllers/applications");
//jwt
let { verifyToken } = require("../helpers/jwt");

function tryCatch(fn) {
	return function(req, res, next) {
		return fn(req, res).catch(e => next(e));
	};
}

router.get("/admin/all", verifyToken, tryCatch(controller.adminAll));

router.get("/self", verifyToken, tryCatch(controller.self));

router.post("/", verifyToken, tryCatch(controller.apply));

module.exports = router;
