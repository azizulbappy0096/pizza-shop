const OrderModel = require("../../models/order");

const adminController = {
    adminOrders: async (req, res) => {
        try{
            const getOrders = await OrderModel.find({status: {"$ne": "completed"}}).sort({"createdAt": "desc"}).populate("customerId").exec();
            if(req.xhr) {
                return res.json(getOrders)
            }
            return res.render("admin/orders", { title: "Admin" })
        }catch(err) {
            req.flash("error", "Something went wrong")
            console.log(err)
            return res.redirect("/")
        }
    },
    adminOrderStatus: async (req, res) => {
        const orderStatus = req.body.orderStatus
        const orderId = req.body.orderId
        console.log(req.body)
        try {
            const updatedOrder = await OrderModel.updateOne({ _id: orderId }, { status: orderStatus }, { runValidators: true });
            req.flash("success", "Order status updated")

            // emitter
            const eventEmitter = req.app.get("eventEmitter")
            eventEmitter.emit("on", { done: "done" })
            res.redirect("/admin/orders")
        }catch(err) {
            console.log(err)
            req.flash("error", "Something went wrong")
            res.redirect("/admin/orders")
        }
    }
}

module.exports = adminController