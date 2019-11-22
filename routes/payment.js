let express = require("express");
let router = express.Router();
let controller = require("../controllers/payment");
//jwt
let { verifyToken } = require("../helpers/jwt");

function tryCatch(fn) {
  return function (req, res, next) {
    return fn(req, res).catch(e => next(e));
  };
}

router.post("/", verifyToken, controller.pay);
router.post("/bootcamp/online", verifyToken, controller.bootcamp);
router.post("/bootcamp/group", controller.group);

module.exports = router;
