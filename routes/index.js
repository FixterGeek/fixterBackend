const express = require("express");
const { verifyToken } = require("../helpers/jwt");
const { sendDisciplineChallenge } = require("../helpers/mailer");
const router = express.Router();
const stripe = require('stripe')('sk_test_51K6dXmJ7Zwl77LqntfyjDm7s6ZFZYuiCB2G00swjcN8VzyYsZZfFiWOfYcMnveiixSaVtYsqdCPipWAonEMCaREy00rG91msfD');

const CLIENT_DOMAIN = 'https://localhost:3000/pricing';

/* GET home page */
router.get("/", (req, res, next) => {
  //res.render('index');
  res.json({
    developedBy: "FixterGeek",
    year: 2019,
    site: "www.fixter.org",
    bliss: "t(*_*t)"
  });
});

router.get('/create-checkout-session', verifyToken, async (req, res) => {
  const session = await stripe.checkout.sessions.create({
    customer_email: req.user ? req.user.email : '',
    line_items: [
      {
        // Provide the exact Price ID (for example, pr_1234) of the product you want to sell
        price: req.query.id,
        quantity: 1,
      },
    ],
    mode: 'subscription',
    success_url: `${CLIENT_DOMAIN}?success=true`,
    cancel_url: `${CLIENT_DOMAIN}?canceled=true`,
  });

  res.redirect(303, session.url);
})

// mail
router.get("/blissi", (req, res, next) => {
  //res.render('index');
  const emailsOne = [
    'lgabrich@hotmail.com',
    'pcromero2207@hotmail.com',
    'rockocb12@gmail.com',
    'magetzyestrada5@gmail.com',
    'marijotl_12@hotmail.com',
    'rflores@surveyup.com.mx',
    'tesah74@gmail.com',
    'hubencam0907@gmail.com',
    'covaale457@gmail.com',
    'rodrigopi51.49@gmail.com',
    'behec.dev@gmail.com',
    'alfonsoomaster@gmail.com',
    'carlamafc@gmail.com',
    'rahelish@hotmail.com',
    'yolanda.rochaa90@gmail.com',
    'michaelcastillo.pe@hotmail.com',
    'marcarrimor@gmail.com',
    'fixtergeek@gmail.com',
  ] // sent Dic 21th 2021
  const emailsTwo = [
    'blanca.aloma7@gmail.com',
    'yann.mhdz@gmail.com',
    'tesah74@gmail.com'
  ] // sent...
  const emailsThree = ['pcromero2207@hotmail.com']
  sendDisciplineChallenge([])
  res.json({
    developedBy: "FixterGeek",
    year: 2019,
    site: "www.fixter.org",
    bliss: "t(*_*t)",
    message: "Enviando correos"
  });
});

module.exports = router;
