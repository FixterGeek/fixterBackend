const nodemailer = require('nodemailer')
var hbs = require('nodemailer-express-handlebars');
var options = {
  viewEngine: {
    extname: '.hbs',
    layoutsDir: '../views/email/',
    defaultLayout: 'template',
    partialsDir: '../views/partials/'
  },
  viewPath: '../views/email/',
  extName: '.hbs'
};


const transport = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: '',
    pass: ''
  },
})

function contactMail(nombre, email, tel, msj) {
  transport.use('compile', hbs(options))
  transport.sendMail({
    bcc: email,
    subject: 'Fixter Info.',
    from: `${email}`,
    to: '`contacto@fixter.org`',
    template: 'contact',
    context: {
      nombre,
      email,
      tel,
      msj,
    }
  })
}

module.exports = { contactMail }