let passport = require("passport");
let User = require("../models/User");
let FacebookTokenStrategy = require("passport-facebook-token");
let GoogleStrategy = require("passport-google-token").Strategy;
let { welcomeMail } = require("../helpers/mailer");

passport.use(
	new GoogleStrategy(
		{
			clientID: process.env.GOOGLE_CLIENT_ID,
			clientSecret: process.env.GOOGLE_CLIENT_SECRET
		},
		function(accessToken, refreshToken, profile, done) {
			//console.log("ora", profile);
			User.findOne({ googleId: profile.id })
				.then(user => {
					if (!user) {
						return User.create({
							username: profile.displayName,
							googleId: profile.id,
							displayName: profile.displayName,
							email: profile.emails.length > 0 ? profile.emails[0].value : null,
							photoURL: profile._json.picture
						});
					}
					return done(null, user);
				})
				.then(u => {
					//mail de bienvenida
					welcomeMail(u);
					done(null, u);
				})
				.catch(e => done(e));
		}
	)
);

passport.use(
	new FacebookTokenStrategy(
		{
			clientID: process.env.FACEBOOK_APP_ID,
			clientSecret: process.env.FACEBOOK_APP_SECRET
		},
		function(accessToken, refreshToken, profile, done) {
			console.log(profile);
			User.findOne({ facebookId: profile.id })
				.then(user => {
					//console.log("ora", user);
					if (!user) {
						return User.create({
							username: profile.displayName,
							facebookId: profile.id,
							displayName: profile.displayName,
							email: profile.emails.length > 0 ? profile.emails[0].value : null,
							photoURL:
								profile.photos.length > 0 ? profile.photos[0].value : null
						});
					}
					return done(null, user);
				})
				.then(u => {
					//mail de bienvenida
					welcomeMail(u);
					done(null, u);
				})
				.catch(e => done(e));
		}
	)
);

passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

module.export = passport;
