const OrderModel = require("../../models/order");
const stripe = require("stripe")(process.env.STRIPE_SECRET);

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
    const { phone, address, paymentMethod, stripeToken } = req.body;
    const eventEmitter = req.app.get("eventEmitter");

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
        paymentMethod,
        phone,
        address,
      });

      const savedOrder = await newOrder.save();
      
      // emit remove event
      eventEmitter.on("removeOrder", async () => {
        await OrderModel.deleteOne({ _id: savedOrder._id });
      });

      if (paymentMethod === "card") {
        // stripe charge
        const charge = await stripe.charges.create({
          amount: savedOrder.totalPrice * 100,
          currency: "usd",
          source: stripeToken,
          description: `Order id: ${savedOrder._id}`,
        });

        if (charge.status === "succeeded") {
          savedOrder.paymentStatus = true;
          await savedOrder.save();

          // emitter
          eventEmitter.emit(
            "updateAdminOrders",
            await savedOrder.populate("customerId").execPopulate()
          );

          // clear cart
          req.session.cart = null;
          // send response
          res.status(201).json({
            message: "Order placed successfully with payment",
            orderId: savedOrder._id,
          });
        } else {
          // delete saved order from db
          eventEmitter.emit("removeOrder");
          // send response
          res.status(406).json({
            error: "Something went wrong, please try again!",
            deveError: charge.failure_message,
          });
        }
      } else {
        // emitter
        eventEmitter.emit(
          "updateAdminOrders",
          await savedOrder.populate("customerId").execPopulate()
        );
        // clear cart
        req.session.cart = null;
        // send response
        res.status(201).json({
          message: "Order placed successfully",
          orderId: savedOrder._id,
        });
      }
    } catch (err) {
      // delete saved order from db
      eventEmitter.emit("removeOrder");
      res.status(500).json({ error: "Something went wrong!" });
    }
  },

  singleOrder: async (req, res) => {
    try {
      const orderId = req.params.id;
      const getOrder = await OrderModel.findOne({ _id: orderId });
      res.render("customer/singleOrder", { title: "Order", order: getOrder });
    } catch (err) {
      req.flash("error", "Couldn't fetch data");
      res.render("customer/singleOrder", { title: "Order" });
    }
  },
};

module.exports = orderController;
