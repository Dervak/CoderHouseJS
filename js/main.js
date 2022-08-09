let name = "";
let darkmode = localStorage.getItem("darkmode") || "true";
const products = [
    { id: "french-fries", name: "Papas Fritas", price: 200, store: "McBurger" },
    {
        id: "asado",
        name: "Asado",
        price: 1200,
        store: "Parrilla 'El Rey Wilson' ",
    },
    { id: "icecream", name: "Helado", price: 300, store: "Luccianos" },
    { id: "water", name: "Agua en un recital", price: 500, store: "Paisano" },
    { id: "sushi", name: "Sushi", price: 2200, store: "Izakaya" },
    { id: "crepes", name: "Crêpes", price: 1500, store: "Crêperie" }
];
let cart = JSON.parse(localStorage.getItem("shopping-cart")) || [];
let productsaux = products;
let productName = "";

function welcomeTitle(name) {
    document.getElementById(
        "title"
    ).innerText = `Bienvenido ${name} a este hermoso "carrito de compras" version alpha-0.01`;
}
function darkModeToggler() {
    if (darkmode === "false") {
        darkmode = true;
        document.getElementById("indicator").classList.add("fa-moon");
        document.getElementById("indicator").classList.add("active");
        document.body.classList.add("dark");
    } else if (darkmode === "true") {
        darkmode = false;
        document.getElementById("indicator").classList.add("fa-sun");
    }
    if (!darkmode) {
        document.getElementById("indicator").classList.toggle("fa-sun");
        document.getElementById("indicator").classList.toggle("fa-moon");
        document.getElementById("indicator").classList.toggle("active");
        document.body.classList.toggle("dark");
        darkmode = true;
        localStorage.setItem("darkmode", darkmode);
    } else {
        document.getElementById("indicator").classList.toggle("fa-moon");
        document.getElementById("indicator").classList.toggle("fa-sun");
        document.getElementById("indicator").classList.toggle("active");
        document.body.classList.toggle("dark");
        darkmode = false;
        localStorage.setItem("darkmode", darkmode);
    }
}
function cardAdapter() {
    let pos = 0;
    let height = 0;
    let width = 0;
    for (i = 0; i < document.getElementsByClassName("card").length; i++) {
        document.getElementsByClassName("card")[i].childNodes[0].offsetHeight > pos && (pos = document.getElementsByClassName("card")[i].childNodes[0].offsetHeight);
        document.getElementsByClassName("card")[i].offsetHeight > height && (height = document.getElementsByClassName("card")[i].offsetHeight)
        document.getElementsByClassName("card")[i].offsetWidth > width && (width = document.getElementsByClassName("card")[i].offsetWidth)
    }
    document.documentElement.style.setProperty(
        "--card-pos",
        -(
            pos /
            32
        ) + "rem"
    );
    document.documentElement.style.setProperty(
        "--card-margin",
        pos /
        32 +
        0.5 +
        "rem"
    );
    document.documentElement.style.setProperty(
        "--card-height",
        height / 16 + "rem"
    );
    document.documentElement.style.setProperty(
        "--card-width",
        width / 16 + "rem"
    );
}
function nameChecker(name) {
    while (name === null || name === "") {
        name = prompt("Ingresa tu nombre!");
    }
    return name;
}
function buyCart(event) {
    localStorage.removeItem("shopping-cart")
    event.stopPropagation()
    cartPopUpHandler()
    cart = []
}
function deleteCart(event) {
    for (i = 0; i < event.currentTarget.parentElement.parentElement.childNodes.length; i++) {
        event.currentTarget.parentElement.parentElement.childNodes[i].classList.contains("name") && (cart = cart.filter((item) => item.name !== event.currentTarget.parentElement.parentElement.childNodes[i].innerText))
    }
    localStorage.setItem("shopping-cart", JSON.stringify(cart))
    event.currentTarget.parentElement.parentElement.remove()
    event.stopPropagation()
}
function addToCart(prod) {
    let exist = false;
    if (cart.length > 0) {
        for (i = 0; i < cart.length; i++) {
            if (cart[i].name === prod.name) {
                cart[i].qty += prod.qty
                exist = true;
            }
        }
        !exist && cart.push(prod)
    } else {
        cart.push(prod)
    }

    localStorage.setItem("shopping-cart", JSON.stringify(cart))
}
function createCart() {
    let total = 0;
    let elem = document.createElement("tbody");
    let totalRow = document.createElement("tr");
    elem.classList.add("cart-list")
    elem.innerHTML = `<tr><th>Producto</th><th>Precio</th><th>Cantidad</th></tr>`
    cart.forEach((prod) => {
        let item = document.createElement("tr");
        item.classList.add("cart-item")
        item.innerHTML = `<td class="name">${prod.name}</td><td>$ ${prod.price}</td><td>${prod.qty}</td><td><button class="cart-del"><i class="fa-solid fa-trash-can"></i></button></td>`;
        elem.appendChild(item);
        total += (prod.price * prod.qty)
    })
    totalRow.classList.add("cart-total")
    totalRow.innerHTML = `<td>Total: $${total}</td><td><button id="cart-buy"><i class="fa-solid fa-basket-shopping"></i></button></td>`
    elem.appendChild(totalRow)
    return elem;
}
function cartPopUpHandler() {
    if (document.getElementById("popup-bg")) {
        document.getElementById("popup-bg").classList.remove("active");
        setTimeout(
            () => document.getElementById("popup-bg").remove(),
            500
        );
    } else {
        let newEle = document.createElement("div");
        newEle.classList.add("popup-bg");
        newEle.setAttribute("id", newEle.classList);
        document.body.appendChild(newEle);
        setTimeout(() => {
            document.getElementById("popup-bg").classList.add("active")
        }
        );
        newEle.appendChild(createCart())
        document.getElementById("cart-buy").onclick = (event) => buyCart(event)
        for (i = 0; i < document.getElementsByClassName("cart-del").length; i++) {
            document.getElementsByClassName("cart-del")[i].onclick = (event) => deleteCart(event)
        }
    }
}
function createProduct() {
    let newEle = document.createElement("div");
    newEle.classList.add("products");
    newEle.setAttribute("id", newEle.className);
    document.getElementById("container").appendChild(newEle);
}
function addProduct(products) {
    document.getElementById("products")
        ? (document.getElementById("products").innerHTML = "")
        : createProduct();
    let i = 0;
    for (let product of products) {
        let newProd = document.createElement("div");
        newProd.setAttribute("id", product.id);
        newProd.classList.add("card");
        newProd.innerHTML = `<img src="./resources/images/${product.id}.png" alt="${product.name}"><div class="store" id="${product.store}">${product.store}</div><div id="${product.name}" class="name">${product.name}</div><div class="price">$${product.price}</div><div id="card-btns"><button class="card-buy button">Comprar</button></div>`;
        document.getElementById("products").appendChild(newProd);
        document.getElementsByClassName("card-buy")[i].onclick = (event) =>
            buyProduct(event);
        i++;
    }
    setTimeout(() => cardAdapter(), 50)
}
function deleteProduct(name, products) {
    for (let product of products) {
        if (product.name === name) {
            products.splice(
                products
                    .map((p) => {
                        return p.name;
                    })
                    .indexOf(product.name),
                1
            );
            addProduct(products);
        }
    }
    productName = "";
    document.getElementById("product-name").value = "";
    document.getElementById("search").innerHTML ===
        '<i class="fa-solid fa-rotate-left"></i>' &&
        (document.getElementById("search").innerHTML =
            '<i class="fa-solid fa-magnifying-glass"></i>');
    return products;
}
function searchProduct(name, products) {
    products.filter((product) => product.name === name).length > 0
        ? addProduct(products.filter((product) => product.name === name))
        : (document.getElementById(
            "products"
        ).innerHTML = `No hay resultados con ${name}`);
    document.getElementById("search").innerHTML =
        '<i class="fa-solid fa-rotate-left"></i>';
}
function restoreSearch(products) {
    addProduct(products);
    productName = "";
    document.getElementById("product-name").value = "";
    document.getElementById("search").innerHTML =
        '<i class="fa-solid fa-magnifying-glass"></i>';
}
function buyHandler(event) {
    event.currentTarget.innerHTML === `<i class="fa-solid fa-minus"></i>` ? event.currentTarget.parentElement.childNodes[1].value > 0 && (event.currentTarget.parentElement.childNodes[1].value = parseInt(event.currentTarget.parentElement.childNodes[1].value) - 1) : event.currentTarget.parentElement.childNodes[1].value < 99 && (event.currentTarget.parentElement.childNodes[1].value = parseInt(event.currentTarget.parentElement.childNodes[1].value) + 1)
}
function confirmBuy(event) {
    let name = "";
    let price = 0;
    let qty = 0;
    event.target.classList.toggle("active")
    event.target.parentElement.childNodes[0].classList.add("hidden")
    setTimeout(() => {
        event.target.parentElement.childNodes[0].remove()
    }, 500)
    for (i = 0; i < event.target.parentElement.parentElement.childNodes.length; i++) {
        event.target.parentElement.parentElement.childNodes[i].classList.contains("name") && (name = event.target.parentElement.parentElement.childNodes[i].innerHTML)
        event.target.parentElement.parentElement.childNodes[i].classList.contains("price") && (price = parseInt(event.target.parentElement.parentElement.childNodes[i].innerHTML.replace("$", "")))
    }
    for (i = 0; i < event.target.parentElement.childNodes.length; i++) {
        if (event.target.parentElement.childNodes[i].classList.contains("card-qty")) {
            for (j = 0; j < event.target.parentElement.childNodes[i].childNodes.length; j++) {
                event.target.parentElement.childNodes[i].childNodes[j].classList.contains("card-in") && (qty = parseInt(event.target.parentElement.childNodes[i].childNodes[j].value))
            }
        }
    }
    addToCart({ name, price, qty })
    Toastify({
        text: "El producto ha sido agregado al carrito.",
        duration: 2000,
        gravity: "top",
        position: "right",
        stopOnFocus: true,
        style: {
            background: "aquamarine",
            color: "#282828",
        },
    }).showToast()
    event.target.onclick = (event) => buyProduct(event)
}
function buyProduct(event) {
    event.target.classList.toggle("active")
    elem = document.createElement("div")
    elem.classList.add("card-qty")
    elem.innerHTML = `<button class="card-buy plus-minus"><i class="fa-solid fa-minus"></i></button><input value="1" min="0" class="card-in" type="number"><button class="card-buy plus-minus"><i class="fa-solid fa-plus"></i></button>`
    event.target.parentElement.insertBefore(elem, event.target.parentElement.childNodes[0])
    for (i = 0; i < document.getElementsByClassName("plus-minus").length; i++) {
        document.getElementsByClassName("plus-minus")[i].onclick = (event) => buyHandler(event)
    }
    event.target.onclick = (event) => confirmBuy(event)
}

//CARGA
window.onload = () => darkModeToggler();
createProduct();
addProduct(productsaux);

welcomeTitle(name);

//EVENTOS
document.getElementById("product-name").oninput = () =>
    (productName = document.getElementById("product-name").value);
document.getElementById("toggler").onclick = () => darkModeToggler();
document.getElementById("sc-btn").onclick = () => {
    cart.length === 0 ?
        Toastify({
            text: "No hay productos todavia, comprá algo!",
            duration: 2000,
            gravity: "top",
            position: "right",
            stopOnFocus: true,
            style: {
                background: "aquamarine",
                color: "#282828",
            },
        }).showToast() : cartPopUpHandler();
    document.getElementById("popup-bg").onclick = () => cartPopUpHandler()
}
document.getElementById("search").onclick = () =>
    document.getElementById("search").innerHTML ===
        '<i class="fa-solid fa-magnifying-glass"></i>'
        ? searchProduct(productName, productsaux)
        : restoreSearch(productsaux);
document.getElementById("delete").onclick = () =>
    (productsaux = deleteProduct(productName, productsaux));
window.onresize = () => cardAdapter();