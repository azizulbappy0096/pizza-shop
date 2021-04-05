// modules
import axios from "axios"

const buildTable = (data) => {
    return data.map(order => {
        return `
        <tr>
        <td class="border border-gray-300 py-2 px-3 break-words"> 
          <h4> ${order._id} </h4>  
          <ul class="text-sm">
              ${renderItems(order.items)}
          </ul>
        </td>
        <td class="border border-gray-300 py-2 px-3 break-words">
            <ul class="text-sm">
                <li> Name: ${order.customerId.username} </li>
                <li> Phone: ${order.phone} </li>
            </ul>
        </td>
        <td class="border border-gray-300 py-2 px-3 break-words">${order.address}</td>
        <td class="border border-gray-300 py-2 px-3 break-words">
            <div class="inline-block relative w-4/5">
                <form action="">
                    <select class="block appearance-none w-full bg-white border border-gray-400 hover:border-gray-500 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline">
                        <option >Really long option that will likely overlap the chevron</option>
                        <option selected>Option 2</option>
                        <option>Option 3</option>
                      </select>
                      <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                        <svg class="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                      </div>
                </form>
              </div>
        </td>
        <td class="border border-gray-300 py-2 px-3 break-words">${new Date(order.createdAt).toLocaleTimeString()}</td>
      </tr>
        `
    })
}

const renderItems = (items) => {
    let mockup = ""
    for(let order of Object.values(items)) {
        mockup += `<li> ${order.item.name} - ${order.qty} Pcs </li>`
    }
    return mockup
}

export const getAdminOrders = () => {
 const adminTableBody = document.getElementById("adminTableBody")
 let mockup = ""

 axios.get("/admin/orders", {
     headers: {
         "x-requested-with": "XMLHttpRequest"
     }
 }).then(res => {
    console.log(res)
    mockup += buildTable(res.data).join("")
    adminTableBody.innerHTML = mockup
 }).catch(err => {
     console.log(err)
 })
}

