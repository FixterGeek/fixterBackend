let nodemailer = require("nodemailer");
let hbs = require("hbs");
let fs = require("fs");

let transport = nodemailer.createTransport({
	service: "Gmail",
	auth: {
		user: process.env.NODEMAILER_USER,
		pass: process.env.NODEMAILER_PASS
	}
});

const accountCreated = hbs.compile(
	fs.readFileSync((__dirname, "./views/mail/bienvenida.hbs"), "utf8")
);
const applyDone = hbs.compile(
	fs.readFileSync((__dirname, "./views/mail/apply.hbs"), "utf8")
);

exports.welcomeMail = ({ email, displayName = "Geek!" }) => {
	transport
		.sendMail({
			subject: "👾🤖¡Bienvenido a FixterGeek!😎",
			bcc: email,
			html: accountCreated({ name: displayName })
		})
		.then(r => console.log(r))
		.catch(e => console.log(e));
};

exports.paymentMethods = ({ email, displayName = "Geek!" }, extraMail) => {
	transport
		.sendMail({
			subject: "👾🤖¡Solo falta un paso más!😎",
			bcc: [email, extraMail],
			html: applyDone({ name: displayName })
		})
		.then(r => console.log(r))
		.catch(e => console.log(e));
};
