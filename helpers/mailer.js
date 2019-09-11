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

const contactForm = hbs.compile(
	fs.readFileSync((__dirname, "./views/mail/contactForm.hbs"), "utf8")
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

exports.contactFormReceived = ({ email, displayName = "Geek!", text, tel }, extraMail) => {
	transport
		.sendMail({
			subject: "👾🤖¡Gracias por contactarnos!😎",
			bcc: [email, extraMail],
			html: contactForm({ name: displayName })
		})
		.then(r => {
			console.log(r)
			return transport
				.sendMail({
					subject: "👾🤖¡Alguien nos ha contactado!😎",
					bcc: ["contacto@fixter.org", "brenda@fixter.org"],
					html: `
				<h2> Fecha: ${new Date()} </h2>
					<h2> Nombre: ${displayName} </h2>
					<h2> Teléfono: ${tel} </h2>
					<h2> Email: ${email} </h2>
					<h2> Mensaje: ${text} </h2>
					
				`
				})
		})
		.catch(e => console.log(e));
};

exports.contactFormArango = ({ email, name, budget, tel, numPeople, date }) => {
	transport
		.sendMail({
			subject: "👾🤖¡Tienes un nuevo mensaje!😎",
			bcc: ["eventos@arangorestaurante.com"],
			html: `<h3>¡Tienes un nuevo mensaje!</h3>
			<p> Nombre: ${name} </p>
			<p> Correo: ${email} </p>
			<p> Teléfono: ${tel}  </p>
			<p> Número de personas:  ${numPeople} </p>
			<p> Presupuesto por persona: ${budget} </p>
			<p> Fecha: ${date} </p>
			`
		})
		.then(r => {
			console.log(r)
			//return transport
			// .sendMail({
			// 	subject: "👾🤖¡Alguien nos ha contactado!😎",
			// 	bcc: ["contacto@fixter.org", "brenda@fixter.org"],
			// 	html: `
			// 	<h2> Fecha: ${new Date()} </h2>
			// 		<h2> Nombre: ${displayName} </h2>
			// 		<h2> Teléfono: ${tel} </h2>
			// 		<h2> Email: ${email} </h2>
			// 		<h2> Mensaje: ${text} </h2>

			// 	`
			// })
		})
		.catch(e => console.log(e));
};

exports.sendPasswordChanged = (password, email, name) => {
	return transport.sendMail({
		from: "fixtermailer@gmail.com",
		subject: "👾🤖 Recupera tu cuenta! ",
		bcc: [email],
		html: `
			<h2> Tu password provisional es: ${password} </h2>
			<p> Puedes usarlo para acceder a la plataforma, pero no olvides cambiarlo inmediatamente por uno nuevo. </p>
			<a href="https://www.fixter.camp/profile">Entra aquí</a>
			<p>Nos vemos ;)</p>
		`
	})
		.then(r => {
			console.log(r)
		})
		.catch(e => console.log(e));
}
