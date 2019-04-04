const express = require('express')
const router = express.Router()
const {contactFormReceived} = require('../helpers/mailer')

router.post('/contacto', (req, res, next) => {
  console.log("body", req.body)
  contactFormReceived(req.body)
  res.status(200).send({message:"sending"})
})
module.exports = router