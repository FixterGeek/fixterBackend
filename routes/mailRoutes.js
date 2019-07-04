const express = require('express')
const router = express.Router()
const {contactFormReceived, contactFormArango} = require('../helpers/mailer')

router.post('/arango/contacto', (req,res,next)=>{
  if(req.body.token !== 'cocinaDeRaices') return
  contactFormArango(req.body)
  res.status(200).send({message: "Sending"})
})

router.post('/contacto', (req, res, next) => {
  //console.log("body", req.body)
  contactFormReceived(req.body)
  res.status(200).send({message:"sending"})
})
module.exports = router