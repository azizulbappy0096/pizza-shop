// modules
import axios from "axios";
import Noty from "noty";

const tableMockup = (data) => {
  return data.map((order) => {
    return `
        <tr>
        <td class="border border-gray-300 py-2 px-3 break-words text-sm"> 
          <h4> #${order._id} </h4>  
          <ul class="text-sm">
              ${renderItems(order.items)}
          </ul>
        </td>
        <td class="border border-gray-300 py-2 px-3 break-words text-sm">
            <ul class="text-sm">
                <li> Name: ${order.customerId.username} </li>
                <li> Phone: ${order.phone} </li>
            </ul>
        </td>
        <td class="border border-gray-300 py-2 px-3 break-words text-sm">${
          order.address
        }</td>
        <td class="border border-gray-300 py-2 px-3 relative text-sm">
        <div class="inline-block relative w-max">
          <form id="adminForm">
              <input hidden name="orderId" value=${order._id} />
              <select id="adminFormSelect" name="orderStatus" class="block appearance-none w-full bg-white border border-gray-400 hover:border-gray-500 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline">
              <option ${
                order.status === "order_placed" ? "selected" : ""
              } value="order_placed"> Order Placed </option>
              <option ${
                order.status === "processing" ? "selected" : ""
              } value="processing" > Processing </option>
              <option ${
                order.status === "delivering" ? "selected" : ""
              } value="delivering" > Delivering </option>
              <option ${
                order.status === "completed" ? "selected" : ""
              } value="completed" > Completed </option> 
              </select>
                <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                  <svg class="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                </div>
            </form>
          </div>
        </td>
        <td class="border border-gray-300 py-2 px-3 break-words text-sm">$${order.totalPrice}</td>
        <td class="border border-gray-300 py-2 px-3 break-words text-sm">${order.paymentStatus ? "Paid" : "Cash on delivery"}</td>
        <td class="border border-gray-300 py-2 px-3 break-words text-sm">${new Date(
          order.createdAt
        ).toLocaleTimeString()}</td>
      </tr>
        `;
  });
};

const renderItems = (items) => {
  let mockup = "";
  for (let order of Object.values(items)) {
    mockup += `<li> ${order.item.name} - ${order.qty} Pcs </li>`;
  }
  return mockup;
};

const renderTable = (data) => {
  const adminTableBody = document.getElementById("adminTableBody");
  let mockup = tableMockup(data).join("");
  adminTableBody.innerHTML = mockup;

  const adminForms = document.querySelectorAll("#adminForm");
  const adminFormSelects = document.querySelectorAll("#adminFormSelect");

  adminForms.forEach((form, index) => {
    adminFormSelects[index].addEventListener("change", (e) => {
      e.preventDefault();
      let formData = new FormData(form);
      updateAdminOrder(formData);
    });
  });
};

export const getAdminOrders = (socket) => {
  axios
    .get("/admin/orders", {
      headers: {
        "x-requested-with": "XMLHttpRequest",
      },
    })
    .then((res) => {
      let allOrders = res.data;
      renderTable(allOrders);

      // socket
      socket.on("updateAdminOrders", (order) => {
        new Noty({
          type: "success",
          text: "Got a new order!",
          timeout: 1000,
          progressBar: false,
        }).show();
        allOrders.unshift(order);
        renderTable(allOrders);
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

const updateAdminOrder = (formData) => {
  axios
    .post("/admin/orders/update", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    })
    .then((res) => {
      new Noty({
        type: "success",
        text: "Order updated!",
        timeout: 1000,
        progressBar: false,
      }).show();
    })
    .catch((err) => {
      new Noty({
        type: "error",
        text: "Order didn't update, Something went wrong!!",
        timeout: 1000,
        progressBar: false,
      }).show();
    });
};
