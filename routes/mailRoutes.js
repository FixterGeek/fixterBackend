const express = require('express')
const router = express.Router()
const MailItem = require('../models/MailItem')
const User = require('../models/User')
const { promisePaginator } = require('../helpers/paginator')

const {
  contactFormReceived,
  contactFormSpike,
  contactFormHorizon,
  sellAndPromotion,
  sendLaunchBootcamp,
  contactFormSpikeUSA,
} = require('../helpers/mailer')

//5c6a4f9c79c3a60017bbeb65

router.post('/hibrid', (req, res) => {
  // const emails = [
  //   'ands.monris@gmail.com',
  //   'luna.vazquezv@gmail.com',
  //   'mauricio_cano@outlook.es',
  //   'javaz_15@hotmail.com',
  //   'ands.monris@gmail.com',
  //   'bremin11.20.93@gmail.com',
  //   'varaty7@gmail.com',
  //   'astridgutierrezm@gmail.com',
  //   'bernardinoveronica@gmail.com',
  //   'akjassoj@outlook.com',
  //   'carlamafc@gmail.com',
  //   'adrianagrisss@gmail.com',
  //   's.e.jugr@gmail.com',
  //   'zayrajero@gmail.com',
  // 'pepediaz2099@hotmail.com',
  // ]
  const emails = ['pepediaz2099@hotmail.com']
  // sendLaunchBootcamp(emails)
  return res.status(200).send('ok')
})

// router.post('/hibrid', (req, res) => {
//   promisePaginator(
//     req.body,
//     User.find({
//       _id: { $in: ['5c6a4f9c79c3a60017bbeb65', '5d6361d2808c1c0017726001'] },
//     }),
//     User,
//   ).then(({ items, ...result }) => {
//     // sellAndPromotion(items.map((item) => item.email))
//     console.log(
//       'items: ',
//       items.map((i) => i.email),
//     )
//     res.status(200).send(result)
//   })
// })

router.post('/horizonte/contacto', (req, res, next) => {
  if (req.body.token !== 'noLine')
    return res.status(403).send({ message: 'Forbiden' })
  contactFormHorizon(req.body)
  res.status(200).send({ message: 'Sending' })
})

router.post('/spike/contacto', (req, res, next) => {
  if (req.body.token !== 'hyruleHolanda') { return res.status(403).send({ message: 'Forbiden' }) }
  contactFormSpike(req.body)
  res.status(200).send({ message: 'Sending' })
})

router.post('/spike/us/contacto', (req, res, next) => {
  if (req.body.token !== 'hyruleUSA') { return res.status(403).send({ message: 'Forbiden' }) }
  contactFormSpikeUSA(req.body)
  res.status(200).send({ message: 'Sending' })
})

router.post('/contacto', (req, res, next) => {
  //console.log("body", req.body)
  contactFormReceived(req.body)
  res.status(200).send({ message: 'sending' })
})

router.post('/maillist', async (req, res) => {
  let mItem = await MailItem.create(req.body)
  res.status(200).send({ message: 'Mail added', mItem })
})

module.exports = router
