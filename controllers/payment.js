let App = require("../models/App");
let User = require('../models/User')
let Cupon = require("../models/Cupon")
let Student = require('../models/Student')
let Bootcamp = require('../models/Bootcamp')
let Order = require('../models/Order')
//let { generateToken } = require("../helpers/jwt");
const conekta = require('conekta')
let controller = {};



//conekta.api_key = process.env.ENV === 'production' ? process.env.CONEKTA_KEY : process.env.CONEKTA_KEY_DEV
conekta.api_key = process.env.CONEKTA_KEY
conekta.api_version = '2.0.0';
conekta.locale = 'es'

function useCupon(cupon, used) {
  if (!cupon) return console.log("sin cupon")
  cupon.used = { ...cupon.used, ...used }
  cupon.quantity--
  console.log("wat", cupon)
  return Cupon.findByIdAndUpdate(cupon._id, cupon, { new: true })
    .then(cu => console.log("edited?", cu))
}

controller.bootcamp = (req, res) => {
  const {
    tel,
    fullName,
    email,
    tokenId,
    bootcampId
  } = req.body
  const user = req.user
  const chargeObj = {
    payment_method: {
      type: "card",
      token_id: tokenId,
    }
  };
  //if (plazo !== "contado") chargeObj.payment_method.monthly_installments = parseInt(plazo);
  const conektaObject =
  {
    currency: "MXN",
    customer_info: {
      name: fullName,
      phone: tel,
      email: email,
    },
    line_items: [
      {
        name: "Bootcamp online",
        unit_price: 1000 * 100,
        quantity: 1,
      }
    ],
    charges: [chargeObj]
  }
  conekta.Order.create(
    conektaObject,
    function (err, order) {
      if (err) {
        console.log('conektaerror', err)
        return res.status(400).json(err);
      }
      //console.log('conekta order', order)
      // create order
      Order.create({
        products: [{ model: "Bootcamp", id: bootcampId }],
        conektaId: order._id,
        user: user._id,
        total: 1000,
        paid: true
      })
        .then(o => {
          // create student
          return Student.create({
            bootcamp: bootcampId,
            user: user._id,
            name: fullName,
            tel,
            email,
            paid: true,
            order: o._id
          })
        })
        .then(s => {
          // create enroll en user
          // create enroll en bootcamp
          return Promise.all([
            User.findByIdAndUpdate(user._id, { $push: { bootcamps: bootcampId } }, { new: true }).populate('bootcamps'),
            Bootcamp.findByIdAndUpdate(bootcampId, { $push: { students: s._id } }, { new: true })
          ])
        })
        .then(([u, b]) => {
          return res.status(200).json(u)
        })
        .catch(e => {
          console.log(e)
          return res.status(400).json(e)
        })

    }
  ); // conecta create

}

controller.pay = (req, res) => {
  //conekta payment

  const { conektaToken, plazo, application, cupon } = req.body
  let used = { [req.user._id]: true }
  const user = req.user



  App.findById(application._id)
    .then(elapp => {
      const chargeObj = {
        payment_method: {
          type: "card",
          token_id: conektaToken,
        },

      };

      //discounts
      let discount = 0
      elapp.cost = elapp.cost * 100
      if (plazo === 'contado' && !cupon) {
        discount = elapp.cost * .10
      } else if ((plazo === 'contado' || plazo !== 'contado') && cupon) {
        discount = elapp.cost * cupon.value / 100
      } else {
        discount = 0
      }

      if (plazo !== "contado") chargeObj.payment_method.monthly_installments = parseInt(plazo);
      const conektaObject =
      {
        currency: "MXN",
        customer_info: {
          name: elapp.name,
          phone: elapp.tel,
          email: elapp.email
        },
        line_items: [
          {
            name: elapp.course,
            unit_price: elapp.cost - discount,
            quantity: 1,
          }
        ],
        charges: [chargeObj]
      }
      conekta.Order.create(
        conektaObject,
        function (err, order) {
          if (err) {
            console.log('conektaerror', err)
            return res.status(400).json(err);
          }
          App.findByIdAndUpdate(elapp._id, { $set: { paid: true } }, { new: true })
            .then(application => {
              //console.log(order.toObject())
              //cancelamos el cupon
              useCupon(cupon, used)
              //
              return res.status(200).json({ application, order: order.toObject() })
            }).catch(e => {
              console.log(e)
              return res.status(400).json(e)
            })
        }
      );

    }).catch(e => res.status(400).json(e))



}



module.exports = controller;








