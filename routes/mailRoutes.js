const express = require('express')
const router = express.Router()
const { contactFormReceived, contactFormArango, contactFormHorizon } = require('../helpers/mailer')

router.post('/horizonte/contacto', (req, res, next) => {
  if (req.body.token !== 'noLine') return res.status(403).send({ message: "Forbiden" })
  contactFormHorizon(req.body)
  res.status(200).send({ message: "Sending" })
})

router.post('/arango/contacto', (req, res, next) => {
  if (req.body.token !== 'cocinaDeRaices') return res.status(403).send({ message: "Forbiden" })
  contactFormArango(req.body)
  res.status(200).send({ message: "Sending" })
})

router.post('/contacto', (req, res, next) => {
  //console.log("body", req.body)
  contactFormReceived(req.body)
  res.status(200).send({ message: "sending" })
})
module.exports = router