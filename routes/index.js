const express = require("express");
const { verifyToken } = require("../helpers/jwt");
const { sendDisciplineChallenge } = require("../helpers/mailer");
const { buffer } = require('micro')
const router = express.Router();
const stripe = require('stripe')('sk_test_51K6dXmJ7Zwl77LqntfyjDm7s6ZFZYuiCB2G00swjcN8VzyYsZZfFiWOfYcMnveiixSaVtYsqdCPipWAonEMCaREy00rG91msfD');

const CLIENT_DOMAIN = 'http://localhost:3000/pricing';
// const CLIENT_DOMAIN = 'https://fixter.camp/pricing';
// const SERVER_DOMAIN = 'https://fixtercamp.herokuapp.com'
const SERVER_DOMAIN = 'http://localhost:8000'

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

router.get('/create-checkout-session/yearly', verifyToken, async (req, res) => {
  const session = await stripe.checkout.sessions.create({
    customer_email: req.user ? req.user.email : '',
    line_items: [
      {
        price: req.query.id,
        quantity: 1,
      },
    ],
    subscription_data: {
      trial_period_days: 30,
    },
    mode: 'subscription',
    success_url: `${SERVER_DOMAIN}/subscription?success=true&session_id={CHECKOUT_SESSION_ID}&token=${req.query.token}`, // enrollamos al user aquí de una vez?
    cancel_url: `${CLIENT_DOMAIN}?canceled=true`,
  });
  console.log("session => ", session)
  res.redirect(303, session.url);
})

router.get('/create-checkout-session/monthly', verifyToken, async (req, res) => {
  const session = await stripe.checkout.sessions.create({
    customer_email: req.user ? req.user.email : '',
    line_items: [
      {
        price: req.query.id,
        quantity: 1,
      },
    ],
    mode: 'subscription',
    success_url: `${SERVER_DOMAIN}/subscription?success=true&session_id={CHECKOUT_SESSION_ID}&token=${req.query.token}`, // enrollamos al user aquí de una vez?
    cancel_url: `${CLIENT_DOMAIN}?canceled=true`,
  });

  res.redirect(303, session.url);
})

router.get('/subscription', verifyToken, async (req, res) => {
  if (!req.query.success) {
    res.redirect(303, `${CLIENT_DOMAIN}?canceled=true`)
  }
  const session = await stripe.checkout.sessions.retrieve(req.query.session_id);
  const customer = await stripe.customers.retrieve(session.customer, { expand: ['subscriptions'] });
  req.user.subscription = {
    customerId: customer.id,
    ...customer.subscriptions.data[0]
  }
  if (req.user.role !== 'ADMIN') { req.user.role = 'PLUS' }
  await req.user.save()
  res.redirect(303, `${CLIENT_DOMAIN}?success=true`);
})

router.get('/billing', verifyToken, async (req, res) => {
  const returnUrl = `${CLIENT_DOMAIN}?success=true`;
  const customerId = req.user.subscription.customerId;
  stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: returnUrl,
  }).then(portalSession => {
    res.redirect(303, portalSession.url);
  }).catch(() => {
    res.status(404)
  })
})

// Webhooks
const endpointSecret = process.env.STRIPE_ENDPOINT_SECRET
router.post('/webhook', async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;
  const reqBuffer = await buffer(req)
  try {
    event = stripe.webhooks.constructEvent(reqBuffer, sig, endpointSecret);
  } catch (err) {
    res.status(400).send(`Webhook Error: ${err.message}`);
    console.log(err)
    return;
  }
  // Handle the event
  switch (event.type) {
    case 'payment_intent.succeeded':
      const paymentIntent = event.data.object;
      console.log(event)
      // Then define and call a function to handle the event payment_intent.succeeded
      break;
    case 'subscription_schedule.updated':
      console.log("all event: ", event)
      console.log("uopdate: => ", event.data.object)
    // ... handle other event types
    default:
      console.log(`Unhandled event type ${event.type}`);
      console.log(`Todo: ${event}`);
      console.log(`Data: ${event.data.object}`);
  }

  // Return a 200 response to acknowledge receipt of the event
  response.send();
})

// mail
// router.get("/blissi", (req, res, next) => {
//   //res.render('index');
//   const emailsOne = [
//     'lgabrich@hotmail.com',
//     'pcromero2207@hotmail.com',
//     'rockocb12@gmail.com',
//     'magetzyestrada5@gmail.com',
//     'marijotl_12@hotmail.com',
//     'rflores@surveyup.com.mx',
//     'tesah74@gmail.com',
//     'hubencam0907@gmail.com',
//     'covaale457@gmail.com',
//     'rodrigopi51.49@gmail.com',
//     'behec.dev@gmail.com',
//     'alfonsoomaster@gmail.com',
//     'carlamafc@gmail.com',
//     'rahelish@hotmail.com',
//     'yolanda.rochaa90@gmail.com',
//     'michaelcastillo.pe@hotmail.com',
//     'marcarrimor@gmail.com',
//     'fixtergeek@gmail.com',
//   ] // sent Dic 21th 2021
//   const emailsTwo = [
//     'blanca.aloma7@gmail.com',
//     'yann.mhdz@gmail.com',
//     'tesah74@gmail.com'
//   ] // sent...
//   const emailsThree = ['pcromero2207@hotmail.com']
//   sendDisciplineChallenge([])
//   res.json({
//     developedBy: "FixterGeek",
//     year: 2019,
//     site: "www.fixter.org",
//     bliss: "t(*_*t)",
//     message: "Enviando correos"
//   });
// });

module.exports = router;
