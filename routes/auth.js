let express = require("express");
let router = express.Router();
let controller = require("../controllers/auth");
//middlewares
let passport = require("passport");

function tryCatch(fn) {
  return function(req, res, next) {
    return fn(req, res).catch(e => next(e));
  };
}

router.post(
  "/login",
  passport.authenticate("local"),
  tryCatch(controller.login)
);

router.post("/signup", tryCatch(controller.signup));
router.post(
  "/login/facebook/token",
  passport.authenticate("facebook-token"),
  tryCatch(controller.loginFacebookToken)
);

router.post(
  "/login/google/token",
  passport.authenticate("google-token"),
  tryCatch(controller.loginGoogleToken)
);

module.exports = router;
