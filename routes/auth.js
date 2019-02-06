let express = require("express");
let router = express.Router();
let controller = require("../controllers/auth");

function tryCatch(fn) {
  return function(req, res, next) {
    return fn(req, res).catch(e => next(e));
  };
}

router.post("/signup", tryCatch(controller.signup));

module.exports = router;
