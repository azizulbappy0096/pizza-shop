
console.log("Hello world")

let isOn = false;
let hamMenu = document.getElementById("ham-menu");
let menuList = document.getElementById("ham-list");

hamMenu.onclick = () => {
    if(!isOn) {
        menuList.style = "display: block"
        isOn = true
    }else {
        menuList.style = "display: none"
        isOn = false
    }
}

