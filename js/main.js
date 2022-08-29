let products = []
let searchRes = []
let darkmode = localStorage.getItem("darkmode") || "false";
let cart = JSON.parse(localStorage.getItem("shopping-cart")) || [];
const loadPage = async () => {
    const res = await fetch("./js/products.json");
    const data = await res.json()
    products = data
    searchRes = products
    document.getElementById("title").innerText = `Bienvenido a este hermoso "carrito de compras" version 1.0`;
}

function darkModeToggler() {
    if (darkmode === "false") {
        darkmode = true;
        document.getElementById("indicator").classList.add("fa-moon");
        document.getElementById("indicator").classList.add("active");
        document.body.classList.add("dark");
        document.getElementById("toggler").setAttribute("title", "Modo claro")
    } else if (darkmode === "true") {
        darkmode = false;
        document.getElementById("indicator").classList.add("fa-sun");
        document.getElementById("toggler").setAttribute("title", "Modo oscuro")
    }
    if (!darkmode) {
        document.getElementById("indicator").classList.toggle("fa-sun");
        document.getElementById("indicator").classList.toggle("fa-moon");
        document.getElementById("indicator").classList.toggle("active");
        document.body.classList.toggle("dark");
        darkmode = true;
        localStorage.setItem("darkmode", darkmode);
        document.getElementById("toggler").setAttribute("title", "Modo claro")
    } else {
        document.getElementById("indicator").classList.toggle("fa-moon");
        document.getElementById("indicator").classList.toggle("fa-sun");
        document.getElementById("indicator").classList.toggle("active");
        document.body.classList.toggle("dark");
        darkmode = false;
        localStorage.setItem("darkmode", darkmode);
        document.getElementById("toggler").setAttribute("title", "Modo oscuro")
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
function buyCart(event) {
    localStorage.removeItem("shopping-cart")
    cartPopUpHandler(event)
    cart = []
    document.getElementById("sc-btn").setAttribute("cart-items-count", 0)
    document.getElementById("sc-btn").classList.toggle("hide-count")
    Swal.fire({
        icon: 'success',
        title: 'Gracias por tu compra!',
        showConfirmButton: true,
        confirmButtonText: 'Nos Vemos!',
        timer: 2500,
        background: "#282828",
        color: "#f0ffff",
    })
}
function deleteCart(event) {
    let qty = 0;
    let price = 0;
    let name = ""
    let auxcart = [];
    let pe = event.currentTarget.parentElement.parentElement;
    for (i = 0; i < pe.childNodes.length; i++) {
        if (pe.childNodes[i].classList.contains("name")) {
            name = pe.childNodes[i].innerText
            auxcart = cart.filter((item) => item.name !== pe.childNodes[i].innerText)
        } else if (pe.childNodes[i].classList.contains("quantity")) {
            qty = parseInt(pe.childNodes[i].innerText)
        } else if (pe.childNodes[i].classList.contains("price")) {
            price = parseInt(pe.childNodes[i].innerText.replace("$", ""))
        }
    }
    Swal.fire({
        title: `Seguro que querés eliminar ${qty} ${name} del carrito?`,
        showDenyButton: true,
        confirmButtonText: 'Si',
        denyButtonText: `No, me equivoque`,
        background: "#282828",
        color: "#f0ffff",
    }).then((res) => {
        if (res.isConfirmed) {
            cart = auxcart;
            localStorage.setItem("shopping-cart", JSON.stringify(cart));
            pe.classList.add("hidden")
            setTimeout(() => pe.remove(), 500);
            document.getElementById("sc-btn").setAttribute("cart-items-count", parseInt(document.getElementById("sc-btn").getAttribute("cart-items-count")) - qty);
            document.getElementById("cart-total").innerText = "Total: $" + (parseInt(document.getElementById("cart-total").innerText.replace("Total: $", "")) - (price * qty));
            if (document.getElementById("sc-btn").getAttribute("cart-items-count") == 0) {
                document.getElementById("sc-btn").classList.toggle("hide-count");
                document.getElementById("cart-buy").disabled = true;
            }
        }
    })

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
    let container = document.createElement("div")
    let button = document.createElement("button")
    let elem = document.createElement("tbody");
    let totalRow = document.createElement("tr");
    container.classList.add("cart-container")
    elem.classList.add("cart-list")
    elem.innerHTML = `<tr><th>Producto</th><th>Precio</th><th>Cantidad</th></tr>`
    cart.forEach((prod) => {
        let item = document.createElement("tr");
        item.classList.add("cart-item")
        item.innerHTML = `<td class="name">${prod.name}</td><td class="price">$ ${prod.price}</td><td class="quantity">${prod.qty}</td><td><button class="cart-del"><i class="fa-solid fa-trash-can"></i></button></td>`;
        elem.appendChild(item);
        total += (prod.price * prod.qty)
    })
    totalRow.classList.add("cart-total-buy")
    totalRow.innerHTML = `<td id="cart-total">Total: $${total}</td><td><button id="cart-buy"><i class="fa-solid fa-basket-shopping"></i></button></td>`
    button.setAttribute("id", "close-cart")
    button.innerHTML = `<i class="fa-solid fa-xmark"></i>`
    elem.appendChild(totalRow)
    container.appendChild(elem)
    container.appendChild(button)
    return container;
}
function cartPopUpHandler(event) {
    if (event.id || event.currentTarget.id === "sc-btn" || event.target.id === "popup-bg" || event.currentTarget.id === "cart-buy" || event.currentTarget.id === "close-cart") {
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
            document.getElementById("close-cart").onclick = event => cartPopUpHandler(event)
            for (i = 0; i < document.getElementsByClassName("cart-del").length; i++) {
                document.getElementsByClassName("cart-del")[i].onclick = (event) => deleteCart(event)
            }
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
    if (products.length > 0) {
        products.map(product => {
            let newProd = document.createElement("div");
            newProd.setAttribute("id", product.id);
            newProd.classList.add("card");
            newProd.innerHTML = `<img src="./resources/images/${product.id}.png" alt="${product.name}"><div class="store" id="${product.store}">${product.store}</div><div id="${product.name}" class="name">${product.name}</div><div class="price">$${product.price}</div><div id="card-btns"><button class="card-buy button">Comprar</button></div>`;
            document.getElementById("products").appendChild(newProd);
            document.getElementsByClassName("card-buy")[i].onclick = (event) => buyProduct(event);
            i++
        })
    } else {
        document.getElementById("products").innerHTML = `No hay resultados`;
    }

    setTimeout(() => cardAdapter(), 100)
}
function searchProduct(event, products) {
    let arg = event.target.value.toLowerCase()
    if (arg !== "") {
        searchRes = products.filter((product) => { return product.name.toLowerCase().includes(arg) || product.store.toLowerCase().includes(arg) })
        addProduct(searchRes)
        document.getElementById("search").innerHTML = '<i class="fa-solid fa-rotate-left"></i>';
    } else {
        loadPage()
        .then(() => {
            addProduct(products)
            document.getElementById("search").innerHTML = '<i class="fa-solid fa-magnifying-glass"></i>'
        })
    }
}
function sortProduct(products, criteria) {

    const sortingMethods = {
        "sort-price": () => {
            addProduct(products.sort((pa, pb) => {
                return pa.price - pb.price
            }))
            document.getElementById(criteria).innerHTML = `<i class="fa-solid fa-arrow-down-9-1"></i>`
            document.getElementById(criteria).setAttribute("id", "sort-price-inv")
            document.getElementById("search").innerHTML = '<i class="fa-solid fa-rotate-left"></i>';
        },
        "sort-price-inv": () => {
            addProduct(products.sort((pa, pb) => {
                return pb.price - pa.price
            }))
            document.getElementById(criteria).innerHTML = `<i class="fa-solid fa-arrow-down-1-9"></i>`
            document.getElementById(criteria).setAttribute("id", "sort-price")
            document.getElementById("search").innerHTML = '<i class="fa-solid fa-rotate-left"></i>';
        },
        "sort-name": () => {
            addProduct(products.sort((pa, pb) => {
                return pa.name.localeCompare(pb.name)
            }))
            document.getElementById(criteria).innerHTML = `<i class="fa-solid fa-arrow-down-z-a"></i>`
            document.getElementById(criteria).setAttribute("id", "sort-name-inv")
            document.getElementById("search").innerHTML = '<i class="fa-solid fa-rotate-left"></i>';
        },
        "sort-name-inv": () => {
            addProduct(products.sort((pa, pb) => {
                return pb.name.localeCompare(pa.name)
            }))
            document.getElementById(criteria).innerHTML = `<i class="fa-solid fa-arrow-down-a-z"></i>`
            document.getElementById(criteria).setAttribute("id", "sort-name")
            document.getElementById("search").innerHTML = '<i class="fa-solid fa-rotate-left"></i>';
        }
    }
    sortingMethods[criteria]()

}
function restoreSearch() {
    loadPage()
    .then(() => {
        addProduct(products)
    });
    document.getElementById("product-name").value = "";
    document.getElementById("search").innerHTML = '<i class="fa-solid fa-magnifying-glass"></i>';
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
    document.getElementById("sc-btn").setAttribute("cart-items-count", parseInt(document.getElementById("sc-btn").getAttribute("cart-items-count")) + qty)
    document.getElementById("sc-btn").classList.contains("hide-count") && document.getElementById("sc-btn").classList.toggle("hide-count")
    addToCart({ name, price, qty })
    Toastify({
        text: "El producto ha sido agregado al carrito.",
        duration: 2000,
        gravity: "top",
        position: "right",
        stopOnFocus: true,
        style: {
            fontSize: "1.1rem",
            background: "aquamarine",
            color: "#282828",
            borderRadius: ".5rem",
        },
        onClick: () => {
            cartPopUpHandler(document.getElementById("sc-btn"));
            document.getElementById("popup-bg").onclick = (event) => cartPopUpHandler(event);
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
window.onload = () => {
    loadPage()
        .then(() => {

            darkModeToggler();
            createProduct();
            if (cart.length > 0) {
                cart.forEach((item) => {
                    document.getElementById("sc-btn").setAttribute("cart-items-count", parseInt(document.getElementById("sc-btn").getAttribute("cart-items-count")) + item.qty)
                })
            } else {
                document.getElementById("sc-btn").classList.toggle("hide-count")
            }
            addProduct(products)
        })
};

//EVENTOS
document.getElementById("product-name").oninput = event => searchProduct(event, products)
document.getElementById("toggler").onclick = () => darkModeToggler();
document.getElementById("sc-btn").onclick = event => {
    if (cart.length === 0) {
        Toastify({
            text: "No hay productos todavia, comprá algo!",
            duration: 2000,
            gravity: "top",
            position: "right",
            stopOnFocus: true,
            style: {
                fontSize: "1.1rem",
                background: "aquamarine",
                color: "#282828",
                borderRadius: ".5rem",
            },
        }).showToast()
    } else {
        cartPopUpHandler(event);
        document.getElementById("popup-bg").onclick = event => cartPopUpHandler(event);
    }

}
document.getElementById("search").onclick = () => document.getElementById("search").innerHTML === `<i class="fa-solid fa-rotate-left"></i>` && restoreSearch();
document.getElementById("sort-price").onclick = event => sortProduct(searchRes, event.currentTarget.id)
document.getElementById("sort-name").onclick = event => sortProduct(searchRes, event.currentTarget.id)
window.onresize = () => cardAdapter();