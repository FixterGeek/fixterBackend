let App = require("../models/App");
//let { generateToken } = require("../helpers/jwt");
const conekta = require('conekta')
let controller = {};



conekta.api_key = process.env.CONEKTA_KEY
conekta.api_version = '2.0.0';
conekta.locale = 'es'

controller.pay = (req,res) => {
  //conekta payment
	console.log(req.body)

  const {conektaTokenId, plazo, application} = req.body
  const user = req.user

	const chargeObj = {
		payment_method: {
			type: "card",
			token_id: conektaTokenId
		}
	};

  if(plazo !== "contado") chargeObj.monthly_installment = plazo;

  conekta.Order.create(
    {
      currency: "MXN",
      customer_info: {
        name: user.name,
        phone: user.phone,
        email: user.email
      },
      line_items: [
        {
          name: application.course,
          unit_price: course.cost*100,
          quantity: 1
        }
      ],      
      charges: [chargeObj]
    },
    function(err, order) {
      if (err) return res.send(err);
      console.log(order.toObject());
      return res.send(order.toObject());
    }
  );

  App.findByIdAndUpdate(application._id, {$set:{paid:true}}, {new:true})
    .then(application=>{
      return res.status(200).json(application)
    }).catch(e=>{
      return res.status(400).json(e)
    })
  
}



module.exports = controller;








