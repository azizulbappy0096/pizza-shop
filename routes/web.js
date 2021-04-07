const router = require("express").Router();

// controllers
const homeController = require("../app/http/controllers/homeController");
const cartController = require("../app/http/controllers/cartController");
const authController = require("../app/http/controllers/authController");
const orderController = require("../app/http/controllers/orderController");
const adminController = require("../app/http/controllers/adminConroller");

// middlewares
const { guest, auth, admin } = require("../app/http/middlewares/guest");

// home
router.get("/", async (req, res) => {
  const pizzas = await homeController();

  res.render("index", { title: "Home", pizzas: pizzas });
});

// auth
router.get("/login", guest, (req, res) => {
  res.render("auth/login", { title: "Login" });
});

router.post("/login", authController.login);

router.get("/register", guest, (req, res) => {
  res.render("auth/register", { title: "Register" });
});

router.post("/register", authController.register);
router.post("/logout", authController.logout);

// cart
router.get("/cart", (req, res) => {
  res.render("customer/cart", { title: "Cart" });
});

router.post("/cart/update", (req, res) => {
  const cart = cartController(req);
  res.json(cart);
});

// customer orders
router.get("/customer/orders", auth, orderController.orders);
router.post("/customer/orders", orderController.postOrders);

// single order page
router.get("/customer/order/:id", auth, orderController.singleOrder)

// admin
router.get("/admin/orders", admin, adminController.adminOrders)
router.post("/admin/orders/update", admin, adminController.adminOrderStatus)

module.exports = router;
