// import modules //
const express = require("express");
require("dotenv").config();
const ejs = require("ejs");
const expressLayout = require("express-ejs-layouts");
const path = require("path");

// init
const app = express();
const PORT = process.env.PORT || 3000;

// middlewares
app.use(express.static("public"))

// layout setting
app.use(expressLayout);
app.set("views", path.join(__dirname, "/resources/pages"));
app.set("view engine", "ejs");

// routes
app.get("/", (req, res) => {
  res.render("index");
});

app.get("/cart", (req, res) => {
  res.render("customer/cart");
});



// listen
app.listen(PORT, () => {
  console.log("Listening on " + PORT);
});
