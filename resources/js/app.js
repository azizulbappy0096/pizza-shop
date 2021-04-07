// modules
import axios from "axios";
import Noty from "noty";

// admin modules
import { getAdminOrders } from "./admin/admin";

// socket-client
import { io } from "socket.io-client"

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


// single order page
const fetchOrder = document.getElementById("getOrder")
const allStatus = document.querySelectorAll(".order_status")

const updateStatus = (order) => {
  const updatedTime = document.createElement("small")
  const currentStatus = order.status;
  let moveForward = true;
  allStatus.forEach(status => {
    if(moveForward) {
      if(status.dataset.status === currentStatus) {
        moveForward = false
        status.classList.add("status_current")

        // set previous status updated time
        const prevElem = status.previousElementSibling
        updatedTime.innerHTML = new Date(order.updatedAt).toLocaleTimeString()
        prevElem.classList.add("flex", "justify-between", "items-center")
        prevElem.appendChild(updatedTime)
      }else {
        status.classList.add("status_complete")
      }
    }
  })
}

if(fetchOrder) {
  let parseData = JSON.parse(fetchOrder.value)
  updateStatus(parseData)
}

// socket

const socket = io();

if(fetchOrder) {
  let parseData = JSON.parse(fetchOrder.value)
  socket.emit("join", `order_${parseData._id}`)
}

