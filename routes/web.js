const router = require("express").Router();
const homeController = require("../app/http/controllers/homeController");
const cartController = require("../app/http/controllers/cartController");

router.get("/", async (req, res) => {
  const pizzas = await homeController();
  
  res.render("index", { title: "Home", pizzas: pizzas });
});

router.get("/login", (req, res) => {
  res.render("auth/login", { title: "Login" });
});

router.get("/register", (req, res) => {
  res.render("auth/register", { title: "Register" });
});

router.get("/cart", (req, res) => {
  res.render("customer/cart", { title: "Cart" });
});

router.post("/cart/update", (req, res) => {
  const cart = cartController(req);
  console.log(cart);


  res.json(cart)
})


module.exports = router;