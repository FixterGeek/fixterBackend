let App = require("../models/App");
//let { generateToken } = require("../helpers/jwt");
const conekta = require('conekta')
let controller = {};



conekta.api_key = process.env.ENV==='DEV'?process.env.CONEKTA_KEY_DEV:process.env.CONEKTA_KEY
conekta.api_version = '2.0.0';
conekta.locale = 'es'

controller.pay = (req,res) => {
  //conekta payment

  const {conektaToken, plazo, application} = req.body
  const user = req.user
  console.log(req.body)
	const chargeObj = {
		payment_method: {
			type: "card",
      token_id: conektaToken,      
    },    
    
	};
	if(plazo !== "contado") chargeObj.payment_method.monthly_installments = parseInt(plazo);

  conekta.Order.create(
    {
      currency: "MXN",
      customer_info: {
        name: application.name,
        phone: application.tel,
        email: application.email
      },      
      line_items: [
        {
          name: application.course,
          unit_price: application.cost*100,
          quantity: 1,          
        }
      ],
      charges: [chargeObj]
    },
    function(err, order) {
      if (err) return res.status(400).json(err);
			App.findByIdAndUpdate(application._id, {$set:{paid:true}}, {new:true})
				.then(application=>{
          console.log(order.toObject().charges)
					return res.status(200).json({application, order: order.toObject()})
				}).catch(e=>{
          console.log(e)
				return res.status(400).json(e)
			})
    }
  );

  
}



module.exports = controller;








