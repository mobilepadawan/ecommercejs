import { retornarFilaCheckout } from "./elements.js"
import { mostrarToast } from "./general.js"
import { recuperarCarrito, almacenarCarrito, formatearImporte } from "./general.js"

// VARIABLES
const carrito = recuperarCarrito()
const precioTotal = document.querySelector('table tfoot td#totalPrice')
const btnComprar = document.querySelector('button#btnBuy')
const btnRetornar = document.querySelector('button#btnReturn')
const tableBody = document.querySelector('table tbody#tableBody')

// LÓGICA
function cargarProductos() {
    if (carrito.length > 0) {
        let productos = ''
        carrito.forEach((producto)=> productos += retornarFilaCheckout(producto) )
        tableBody.innerHTML = productos || retornarFilaCheckout()
        crearEventoClicEliminarProducto()
        btnComprar.removeAttribute('disabled')
    } else {
        tableBody.innerHTML = retornarFilaCheckout()
    }
    mostrarTotalCarrito()
}

function mostrarTotalCarrito() {
    let totalCarrito = 0
    totalCarrito = carrito.length > 0 ? carrito.reduce((acc, prod)=> acc + parseFloat(prod.precio), 0)
                                      : 0

    precioTotal.textContent = `${formatearImporte(totalCarrito)}`
}

cargarProductos() // FUNCIÓN PRINCIPAL

// EVENTOS
function crearEventoClicEliminarProducto() {
    const buttonsEliminar = document.querySelectorAll('table tbody tr td#delButton')
    if (buttonsEliminar.length > 0) {
        buttonsEliminar.forEach((button)=> {
            button.addEventListener('click', ()=> {
                let codigo = button.dataset.codigo
                let indice = carrito.findIndex((prod)=> prod.id === codigo)
                carrito.splice(indice, 1)
                mostrarToast('alert', 'Producto quitado del carrito')
                almacenarCarrito(carrito)
                cargarProductos()
            })
        })        
    }
}

btnRetornar.addEventListener('click', ()=> location.href = 'index.html')

btnComprar.addEventListener('click', ()=> {
    alert('✅ Compra confirmada! Gracias por elegirnos.\n🏠 Enviaremos el pedido al domicilio declarado.\n\nLo esperamos pronto por aquí.')
    tableBody.innerHTML = retornarFilaCheckout()
    carrito.length = 0
    mostrarTotalCarrito()
    almacenarCarrito()
    btnComprar.setAttribute('disabled', 'true')
})