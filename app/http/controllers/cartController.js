const cartController = (req) => {
   

  if (!req.session.cart) {
    req.session.cart = {
      items: {},
      totalQty: 0,
      totalPrice: 0,
    };
  }

  let cart = req.session.cart;

  if (!cart.items[(req.body._id)]) {
    cart.items[req.body._id] = {
      item: req.body,
      qty: 1,
    };
  } else {
    cart.items[req.body._id].qty += 1;
  }

  cart.totalQty += 1;
  cart.totalPrice = Number(cart.totalPrice) + Number(req.body.price);

  return cart
};

module.exports = cartController;
