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
       
        try {
            const updatedOrder = await OrderModel.findOneAndUpdate({ _id: orderId }, { status: orderStatus }, { runValidators: true, new: true, useFindAndModify: false });
            req.flash("success", "Order status updated")
            
           
            // emitter
            const eventEmitter = req.app.get("eventEmitter")
            eventEmitter.emit("updateOrder", updatedOrder)
            res.send(updatedOrder)
            
        }catch(err) {
            console.log(err)
            req.flash("error", "Something went wrong")
            res.send("error")
            
        }
    }
}

module.exports = adminController