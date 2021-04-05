// modules
import axios from "axios";
import Noty from "noty";

// admin modules
import { getAdminOrders } from "./admin/admin";

// hamburger menu
let isOn = false;
let hamMenu = document.getElementById("ham-menu");
let menuList = document.getElementById("ham-list");

hamMenu.onclick = () => {
  if (!isOn) {
    menuList.style = "display: block";
    isOn = true;
  } else {
    menuList.style = "display: none";
    isOn = false;
  }
};

// logout
let logout = document.getElementById("logout");
if (logout) {
  logout.addEventListener("click", (e) => {
    axios
      .post("/logout")
      .then((res) => {
        if (res.status === 200) {
          window.location.href = res.request.responseURL;
        }
      })
      .catch((err) => {
        console.log(err);
      });
  });
}

// add-to-cart
let buttons = document.querySelectorAll(".home__addToCart");
let cartCounter = document.querySelector(".cartCounter");

const updateCart = (pizza) => {
  axios
    .post("/cart/update", pizza)
    .then((res) => {
      cartCounter.textContent = res.data.totalQty;
      new Noty({
        type: "success",
        text: "Item added to cart!",
        timeout: 1000,
        progressBar: false,
      }).show();
    })
    .catch((err) => {
      new Noty({
        type: "error",
        text: "Something went wrong!!",
        timeout: 2000,
        progressBar: false,
      }).show();
      throw new Error(err);
    });
};

buttons.forEach((btn) => {
  btn.addEventListener("click", (e) => {
    const pizza = JSON.parse(btn.dataset.pizza);

    updateCart(pizza);
  });
});

// remove order placed message
const successMsg = document.getElementById("success-message")
if(successMsg) {
  setTimeout(() => {
    successMsg.remove()
  }, 2000)
}


// admin order page
const adminTableBody = document.getElementById("adminTableBody")
if(adminTableBody) {
  getAdminOrders()
}
