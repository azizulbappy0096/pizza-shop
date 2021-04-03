// import modules //
const express = require("express");
require("dotenv").config();
const ejs = require("ejs");
const expressLayout = require("express-ejs-layouts");
const path = require("path");
const mongoose = require("mongoose");
const session = require("express-session");
const flash = require("express-flash")
const MongoDBStore = require("connect-mongo");

// init
const app = express();
const PORT = process.env.PORT || 3000;
mongoose.connect(
  process.env.MONGOOSE__URL,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: true,
    useCreateIndex: true,
  },
  () => {
    console.log("DB connected");
  }
);

// session store
const mongoStore = MongoDBStore.create({
  mongoUrl: process.env.MONGOOSE__URL,
  collectionName: "sessions"
})

// session config
app.use(session({
  secret: process.env.COOKIE__SECRET,
  resave: false,
  store: mongoStore,
  saveUninitialized: true,
  cookie: { maxAge: 1000 * 60 * 60 * 24 }
}))

// middlewares
app.use(express.static("public"));
app.use(flash());
app.use(express.json())
app.use((req, res, next) => {
  
  res.locals.session = req.session
  next()
})

// layout setting
app.use(expressLayout);
app.set("views", path.join(__dirname, "/resources/pages"));
app.set("view engine", "ejs");

// --- web routes
const webRouter = require("./routes/web");
app.use("/", webRouter);

// --- api routes
const apiRouter = require("./routes/api");
app.use("/api", apiRouter);

// listen
app.listen(PORT, () => {
  console.log("Listening on " + PORT);
});
