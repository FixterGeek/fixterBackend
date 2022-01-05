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

//login
router.post(
  "/login",
  (req, res, next) => {
    const errors = {
      IncorrectPasswordError: { type: 'passwordError', message: 'Password incorrecto' },
      IncorrectUsernameError: { type: 'emailError', message: 'Email incorrecto' },
    }
    passport.authenticate('local', (err, user, info) => {
      console.log("La info: ", JSON.stringify(info))
      if (err) { return next(err) }
      if (!user) {
        return res.status(403).json(errors[info.name])
      }
      req.logIn(user, function (err) {
        if (err) { return next(err); }
        return next()
      })
    })(req, res, next)
  }, tryCatch(controller.login));

// recovery => check this one too, we need to send a template to receive new password
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
