let name = ""
let darkmode = false;

function welcome(name){
    return name = `Bienvenido ${name}`
}
function darkModeToggler() {
    if (!darkmode){
        document.getElementById("title").style.color = "#F0FFFF"
        document.getElementById("results").style.background ="aquamarine"
        document.body.style.background = "#282828";
        document.getElementById("toggler").innerHTML = "Modo Claro"
        darkmode = true
    } else {
        document.getElementById("title").style.color = "black"
        document.getElementById("results").style.background ="white"
        document.body.style.background = "white";
        document.getElementById("toggler").innerHTML = "Modo Oscuro"
        darkmode = false
    }

}
function addResult(num, i){
    document.getElementById("results").innerHTML += `<div class="result-item">${num} x ${i} = ${num*i}</div>`
}
function multiplication(){
    document.getElementById("results").innerHTML = ""
    for (i = 1; i <= 10; i++){
        addResult((i), document.getElementById("num").value)
    }
}
function nameChecker (name){
    while (name === null || name === ""){
        name = prompt("Ingresa tu nombre!")
    }
    return name
}

name = nameChecker(name)

alert(welcome(name))

