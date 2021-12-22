const express = require("express");
const { sendDisciplineChallenge } = require("../helpers/mailer");
const router = express.Router();

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
