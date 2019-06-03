let App = require("../models/App");
let User = require('../models/User')
let Cupon = require("../models/Cupon")
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

controller.bootcamp = (req,res) => {
  const { conektaToken, plazo, country, phone } = req.body
  const user = req.user

  const chargeObj = {
    payment_method: {
      type: "card",
      token_id: conektaToken,
    },

  };

  if (plazo !== "contado") chargeObj.payment_method.monthly_installments = parseInt(plazo);
  const conektaObject =
  {
    currency: "MXN",
    customer_info: {
      name: user.username,
      phone,
      email: user.email,
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
      User.findByIdAndUpdate(user._id, { $set: { enrolled: true, country } }, { new: true })
        .then(u => {
          //console.log(order.toObject())
          //cancelamos el cupon
          //useCupon(cupon, used)
          //
          return res.status(200).json({ user:u, order: order.toObject() })
        }).catch(e => {
          console.log(e)
          return res.status(400).json(e)
        })
    }
  );

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








