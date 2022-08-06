let name = ""
let darkmode = localStorage.getItem("darkmode") || "true";
let products = [
    { id: "french-fries", name: "Papas Fritas", price: 200, store: "McBurger" },
    { id: "asado", name: "Asado", price: 1200, store: "Parrilla 'El Rey Wilson' " },
    { id: "icecream", name: "Helado", price: 300, store: "Luccianos" },
    { id: "water", name: "Agua en un recital", price: 500, store: "Paisano" },
    { id: "sushi", name: "Sushi", price: 2200, store: "Izakaya" },
]
let productsaux = products;
let productName = ""

function welcomeTitle(name) {
    document.getElementById("title").innerText = `Bienvenido ${name} a este hermoso "carrito de compras" version alpha-0.01`
}
function darkModeToggler() {
    if (darkmode === "false"){
        darkmode = true;
        document.getElementById("indicator").classList.add("fa-moon")
        document.getElementById("indicator").classList.add("active")
        document.body.classList.add("dark")
    } else if (darkmode === "true"){
        darkmode = false;
        document.getElementById("indicator").classList.add("fa-sun")
    }
    if (!darkmode) {
        document.getElementById("indicator").classList.toggle("fa-sun")
        document.getElementById("indicator").classList.toggle("fa-moon")
        document.getElementById("indicator").classList.toggle("active")
        document.body.classList.toggle("dark")
        darkmode = true
        localStorage.setItem("darkmode", darkmode)
    } else {
        document.getElementById("indicator").classList.toggle("fa-moon")
        document.getElementById("indicator").classList.toggle("fa-sun")
        document.getElementById("indicator").classList.toggle("active")
        document.body.classList.toggle("dark")
        darkmode = false
        localStorage.setItem("darkmode", darkmode)
    }

}
function createProduct(){
    let newEle = document.createElement("div")
    newEle.classList.add("products")
    newEle.setAttribute("id", newEle.className)
    document.getElementById("container").appendChild(newEle)
}
function addProduct(products) {
    document.getElementById("products") ? document.getElementById("products").innerHTML = "" : createProduct();
    let i = 0
    for (let product of products) {
        let newProd = document.createElement("div")
        newProd.setAttribute("id", product.id)
        newProd.classList.add("card")
        newProd.innerHTML = `<img src="./resources/images/${product.id}.png" alt="${product.name}"><div class="store" id="${product.store}">${product.store}</div><div id="${product.name}" class="name">${product.name}</div><div class="price">$${product.price}</div><div id="card-btns"><button class="card-buy button">Comprar</button></div>`
        document.getElementById("products").appendChild(newProd)
        setTimeout(cardAdapter(), 500)
        document.getElementsByClassName("card-buy")[i].onclick = (event) => buyProduct(event)
        i++;
    }
}
function deleteProduct (name, products){
    for (let product of products){
        if (product.name === name){
            products.splice(products.map(function(p){return p.name}).indexOf(product.name), 1)
            addProduct(products)
        }
    }
    productName = ""
    document.getElementById("product-name").value = ""
    document.getElementById("search").innerHTML === '<i class="fa-solid fa-rotate-left"></i>' && (document.getElementById("search").innerHTML = '<i class="fa-solid fa-magnifying-glass"></i>')
    return products
}
function cardAdapter(){
    document.documentElement.style.setProperty("--card-pos", - (document.getElementsByClassName("card")[0].childNodes[0].offsetHeight/32) + "rem" )
    document.documentElement.style.setProperty("--card-margin", ((document.getElementsByClassName("card")[0].childNodes[0].offsetHeight/32) + 0.5) + "rem" )
    document.documentElement.style.setProperty("--card-height", ((document.getElementsByClassName("card")[0].offsetHeight/32)) + "rem" )
}

function searchProduct(name, products) {
    ((products.filter(product => product.name === name)).length > 0) ? addProduct(products.filter(product => product.name === name)) : document.getElementById("products").innerHTML = `No hay resultados con ${name}`;
    document.getElementById("search").innerHTML = '<i class="fa-solid fa-rotate-left"></i>'
}
function restoreSearch(products){
    addProduct(products)
    productName = ""
    document.getElementById("product-name").value = ""
    document.getElementById("search").innerHTML = '<i class="fa-solid fa-magnifying-glass"></i>'
}
function nameChecker(name) {
    while (name === null || name === "") {
        name = prompt("Ingresa tu nombre!")
    }
    return name
}
function cartPopUpHandler (){
    if (document.getElementById("popup-bg")){
        document.getElementById("popup-bg").classList.remove("active")
        setTimeout(() => document.body.removeChild(document.getElementById("popup-bg")), 500)
    }else{
        let newEle = document.createElement("div")
        newEle.classList.add("popup-bg")
        newEle.setAttribute("id", newEle.classList)
        document.body.appendChild(newEle)
        setTimeout(() => document.getElementById("popup-bg").classList.add("active")) 
    }
    
}
function buyProduct(event){
    console.log(event)
    event.target.remove() 
    
}

//CARGA
window.onload = () => darkModeToggler()
createProduct();
addProduct(productsaux)

welcomeTitle(name)


//EVENTOS
document.getElementById("product-name").oninput = () => productName = document.getElementById("product-name").value
document.getElementById("toggler").onclick = () => darkModeToggler()
document.getElementById("sc-btn").onclick = () => cartPopUpHandler()
new MutationObserver(() => document.getElementById("popup-bg") !== null && (document.getElementById("popup-bg").onclick = () => cartPopUpHandler())).observe(document.body, {childList: true}) //Soy un enfermo no habia razon para hacer esto, pero queria que sea dinámica la creacion del evento.
document.getElementById("search").onclick = () => document.getElementById("search").innerHTML === '<i class="fa-solid fa-magnifying-glass"></i>' ? searchProduct(productName, productsaux) : restoreSearch(productsaux)
document.getElementById("delete").onclick = () => productsaux = deleteProduct(productName, productsaux)
setTimeout(() => cardAdapter(), 15)
window.onresize = () => cardAdapter()
