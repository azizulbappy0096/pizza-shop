// import modules //
const express = require("express");
const http = require("http")
require("dotenv").config();
const ejs = require("ejs");
const expressLayout = require("express-ejs-layouts");
const path = require("path");
const mongoose = require("mongoose");
const session = require("express-session");
const flash = require("express-flash")
const MongoDBStore = require("connect-mongo");
const passport = require("passport");
const Emitter = require("events")

// init
const app = express();
const PORT = process.env.PORT || 3000;
const server = http.createServer(app)
const io = require("socket.io")(server)
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

// passport config
require("./app/config/passport-local")(passport)
app.use(passport.initialize())
app.use(passport.session())

// set global
const eventEmitter = new Emitter()
app.set("eventEmitter", eventEmitter)

// middlewares
app.use(express.static("public"));
app.use(flash());
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use((req, res, next) => {
  res.locals.session = req.session
  res.locals.user = req.user
  next()
})

// layout setting
app.use(expressLayout);
app.set("views", path.join(__dirname, "/resources/pages"));
app.set("view engine", "ejs");

// --- web routes
const webRouter = require("./routes/web");
app.use("/", webRouter);
app.use((req, res) => {
  res.status(400).send("<h1>404, Page not found!!!</h1>")
})

// --- api routes
const apiRouter = require("./routes/api");
app.use("/api", apiRouter);

// listen
server.listen(PORT, () => {
  console.log("Listening on " + PORT);
});

// socket
io.on("connect", (socket) => {
  console.log("A user connected")
  socket.on("join", roomId => {
    socket.join(roomId)
  })

  socket.on("disconnect", reason => {
    console.log(reason)
    console.log("A user disconnect")
  })
})

eventEmitter.on("updateOrder", data => {
  io.to(`order_${data._id}`).emit("updateStatus", data)
})

eventEmitter.on("updateAdminOrders", data => {
  io.to("adminRoom").emit("updateAdminOrders", data)
})

