const express = require("express");
const router = express.Router();
const MailItem = require("../models/MailItem");
const User = require('../models/User')
const { promisePaginator } = require("../helpers/paginator");

const {
	contactFormReceived,
	contactFormArango,
	contactFormHorizon,
	sellAndPromotion,
} = require("../helpers/mailer");

//5c6a4f9c79c3a60017bbeb65

router.post("/hibrid", (req, res) => {
	promisePaginator(req.body, User.find({_id:{$in:['5c6a4f9c79c3a60017bbeb65', '5d6361d2808c1c0017726001']}}) )
	.then(({items, ...result})=>{
		sellAndPromotion(items.map(item=>item.email))
		res.status(200).send(result);
	})
	
});

router.post("/horizonte/contacto", (req, res, next) => {
	if (req.body.token !== "noLine")
		return res.status(403).send({ message: "Forbiden" });
	contactFormHorizon(req.body);
	res.status(200).send({ message: "Sending" });
});

router.post("/arango/contacto", (req, res, next) => {
	if (req.body.token !== "cocinaDeRaices")
		return res.status(403).send({ message: "Forbiden" });
	contactFormArango(req.body);
	res.status(200).send({ message: "Sending" });
});

router.post("/contacto", (req, res, next) => {
	//console.log("body", req.body)
	contactFormReceived(req.body);
	res.status(200).send({ message: "sending" });
});

router.post("/maillist", async (req, res) => {
	let mItem = await MailItem.create(req.body);
	res.status(200).send({ message: "Mail added", mItem });
});

module.exports = router;
