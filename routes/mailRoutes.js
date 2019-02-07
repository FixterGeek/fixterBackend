const express = require('express')
const router = express.Router()
const { contactMail } = require('../helpers/nodemailer')

router.post('/contacto', (req, res, next) => {
  const { nombre, email, tel, msj } = req.body
  contactMail(nombre, email, tel, msj)
})

module.exports = router