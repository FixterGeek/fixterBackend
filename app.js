require("dotenv").config();

const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const express = require("express");
const favicon = require("serve-favicon");
const hbs = require("hbs");
const mongoose = require("mongoose");
const logger = require("morgan");
const path = require("path");
const passport = require("passport");
require("./helpers/passport");
const cors = require('cors');
const session = require("express-session");
//var MongoStore = require("connect-mongostore")(express);

mongoose
  .connect(process.env.DB, { useNewUrlParser: true })
  .then(x => {
    console.log(
      `Connected to Mongo! Database name: "${x.connections[0].name}"`
    );
  })
  .catch(err => {
    console.error("Error connecting to mongo", err);
  });

const app_name = require("./package.json").name;
const debug = require("debug")(
  `${app_name}:${path.basename(__filename).split(".")[0]}`
);

const app = express();

// Middleware Setup
app.use(logger("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

//sessions
// app.use(
//   session({
//     secret: process.env.SECRET,
//     store: new MongoStore({
//       mongooseConnection: mongoose.connection,
//       ttl: 24 * 60 * 60
//     })
//   })
// );

// Express View engine setup

app.use(
  require("node-sass-middleware")({
    src: path.join(__dirname, "public"),
    dest: path.join(__dirname, "public"),
    sourceMap: true
  })
);

//passport
app.use(passport.initialize());
app.use(passport.session());

// CORS

app.use(cors({
	origin: ["http://localhost:3001", "https://fixter.camp"]
}));

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "hbs");
app.use(express.static(path.join(__dirname, "public")));
app.use(favicon(path.join(__dirname, "public", "images", "favicon.ico")));

// default value for title local
app.locals.title = "Express - Generated with IronGenerator";

const index = require("./routes/index");
const mailRoutes = require("./routes/mailRoutes");
let auth = require("./routes/auth");
const payments = require('./routes/payments');
const courses = require("./routes/courses");
const aplications = require("./routes/aplications");
const editions = require("./routes/editions");
app.use("/", auth);
app.use("/", index);
app.use("/mailing", mailRoutes);
app.use("/payments", payments);
app.use("/editions", editions);
app.use("/courses", courses);
app.use("/aplications", aplications);


module.exports = app;
