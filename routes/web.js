const router = require("express").Router();
const homeController = require("../app/http/controllers/homeController");
const cartController = require("../app/http/controllers/cartController");
const authController = require("../app/http/controllers/authController");
const {guest, auth} = require("../app/http/middlewares/guest");

const orderController = require("../app/http/controllers/orderController");

router.get("/", async (req, res) => {
  const pizzas = await homeController();
  
  res.render("index", { title: "Home", pizzas: pizzas });
});


// auth
router.get("/login",guest, (req, res) => {
  res.render("auth/login", { title: "Login" });
});

router.post("/login", authController.login)

router.get("/register",guest, (req, res) => {
  res.render("auth/register", { title: "Register" });
});

router.post("/register", authController.register)
router.post("/logout", authController.logout)


// cart
router.get("/cart", (req, res) => {
  res.render("customer/cart", { title: "Cart" });
});

router.post("/cart/update", (req, res) => {
  const cart = cartController(req);
  res.json(cart)
})

// orders
router.get("/customer/orders", auth, orderController.orders)

router.post("/customer/orders", orderController.postOrders)

module.exports = router;