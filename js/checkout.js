import { retornarFilaCheckout } from "./elements.js"
import { mostrarToast } from "./general.js"
import { recuperarCarrito, almacenarCarrito } from "./general.js"

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
        tableBody.innerHTML = productos
        mostrarTotalCarrito()
        crearEventoClicEliminarProducto()
    } else {
        mostrarToast('alert', 'No hay productos para comprar.')
    }
}

function mostrarTotalCarrito() {
    if (carrito.length > 0) {
        let totalCarrito = carrito.reduce((acc, prod)=> acc + prod.precio, 0)
        precioTotal.textContent = `$ ${totalCarrito.toLocaleString('es-AR')}`
    }
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
                mostrarToast('alert', 'Producto eliminado del carrito')
                almacenarCarrito(carrito)
                cargarProductos()
            })
        })        
    }
}

btnRetornar.addEventListener('click', ()=> location.href = 'index.html')

btnComprar.addEventListener('click', ()=> {
    alert('✅ Compra confirmada! Gracias por elegirnos.\n🏠 Enviaremos el pedido al domicilio declarado.\n\nLo esperamos pronto por aquí.')

})