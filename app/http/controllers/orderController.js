const OrderModel = require("../../models/order");

const orderController = {
  orders: async (req, res) => {
    const userId = req.user._id;

    try {
      const getOrders = await OrderModel.find({ customerId: userId }).sort({
        createdAt: "desc",
      });
      res.setHeader("Cache-Control", "no-store, max-age=0");
      res.render("customer/orders", { title: "Orders", orders: getOrders });
    } catch (err) {
      req.flash("error", "Couldn't fetch data");
      res.render("customer/orders", { title: "Orders" });
    }
  },
  postOrders: async (req, res) => {
    const { phone, address } = req.body;
    console.log(req.body);
    if (!phone.trim() || !address.trim()) {
      req.flash("error", "All field must be filled");
      return res.redirect("/cart");
    }

    try {
      const newOrder = new OrderModel({
        customerId: req.user._id,
        items: req.session.cart.items,
        totalPrice: Number(req.session.cart.totalPrice),
        totalQty: Number(req.session.cart.totalQty),
        phone,
        address,
      });

      const savedOrder = await newOrder.save();
      req.session.cart = null;
      req.flash("success", "Order placed successfully");
      res.redirect("/customer/orders");
    } catch (err) {
      req.flash("error", "Something went wrong!");
      res.redirect("/cart");
    }
  },
  singleOrder: async (req, res) => {
    try {
      const orderId = req.params.id;
      const getOrder = await OrderModel.findOne({ _id: orderId });
      res.render("customer/singleOrder", { title: "Order", order: getOrder });
    }catch(err) {
      req.flash("error", "Couldn't fetch data");
      res.render("customer/singleOrder", { title: "Order" });
    }
  },
};

module.exports = orderController;
