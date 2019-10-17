let express = require("express");
let router = express.Router();
let controller = require("../controllers/auth");
//middlewares
let passport = require("passport");
let { verifyToken } = require("../helpers/jwt");

function tryCatch(fn) {
  return function (req, res, next) {
    return fn(req, res).catch(e => next(e));
  };
}
// self action
router.get(
  '/self',
  verifyToken,
  tryCatch(controller.self)
)

router.patch('/self',
  verifyToken,
  tryCatch(controller.update)
)

router.patch('/homework',
  verifyToken,
  tryCatch(controller.updateHomework)
)

//login
router.post(
  "/login",
  passport.authenticate("local"),
  tryCatch(controller.login)
);
// recovery
router.post('/recovery',
  tryCatch(controller.recovery)
)
router.post('/change-password',
  verifyToken,
  tryCatch(controller.changePassword)
)

// sgnup
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
