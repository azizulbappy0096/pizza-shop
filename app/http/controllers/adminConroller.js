const OrderModel = require("../../models/order");

const adminController = {
    adminOrders: async (req, res) => {
        try{
            const getOrders = await OrderModel.find({status: {"$ne": "completed"}}).populate("customerId").exec();
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
}

module.exports = adminController