let name = ""
let darkmode = false;
let products = [
    { name: "Papas Fritas", price: 200, store: "McBurger" },
    { name: "Asado", price: 1200, store: "Parrilla 'El Rey Wilson' " },
    { name: "Helado", price: 300, store: "Luccianos" },
    { name: "Agua en un recital", price: 500, store: "Paisano" },
    { name: "Sushi", price: 2200, store: "Izakaya" },
]
let productsaux = products;
let productName = ""

function welcomeTitle(name) {
    document.getElementById("title").innerText = `Bienvenido ${name} a este hermoso "carrito de compras" version alpha-0.01`
}
function darkModeToggler() {
    if (!darkmode) {
        document.getElementById("title").style.color = "#F0FFFF"
        document.getElementById("description").style.color = "#F0FFFF"
        document.getElementById("products").style.background = "aquamarine"
        document.body.style.background = "#282828";
        document.getElementById("toggler").innerHTML = "Modo Claro"
        darkmode = true
    } else {
        document.getElementById("title").style.color = "black"
        document.getElementById("description").style.color = "black"
        document.getElementById("products").style.background = "white"
        document.body.style.background = "white";
        document.getElementById("toggler").innerHTML = "Modo Oscuro"
        darkmode = false
    }

}
function addProduct(products) {
    document.getElementById("products").innerHTML = ""
    let i = 0
    for (let product of products) {
        document.getElementById("products").innerHTML += `<div class="product${i}"><div class="name">Producto: ${product.name}</div><div class="price"> Precio: $${product.price}</div><div class="store">Tienda: ${product.store}</div></div>`
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
    return products
}

function searchProduct(name, products) {
        if ((products.filter(product => product.name === name)).length > 0){
            addProduct(products.filter(product => product.name === name))
        }else{
            document.getElementById("products").innerHTML = `No hay resultados con ${name}`
        }
        document.getElementById("search").innerText = "Restablecer"

}
function restoreSearch(products){
    addProduct(products)
    productName = ""
    document.getElementById("product-name").value = ""
    document.getElementById("search").innerText = "Buscar"
}
function nameChecker(name) {
    while (name === null || name === "") {
        name = prompt("Ingresa tu nombre!")
    }
    return name
}
addProduct(productsaux)
document.getElementById("product-name").oninput = () => productName = document.getElementById("product-name").value
welcomeTitle(nameChecker(name))
document.getElementById("toggler").onclick = () => darkModeToggler()
document.getElementById("search").onclick = () => { console.log("me clickeaste")
    if (document.getElementById("search").innerText === "Buscar") {
        searchProduct(productName, productsaux)
    } else {
        restoreSearch(productsaux)
    }
}
document.getElementById("delete").onclick = () => productsaux = deleteProduct(productName, productsaux)