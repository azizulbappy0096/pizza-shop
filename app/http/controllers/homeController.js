const MenuModel = require("../../models/menu");

const homeController = async () => {
    try{
        const pizzas = await MenuModel.find({});
        
        return pizzas
    }catch(err) {
        throw new Error(err)
    }
}

module.exports = homeController;