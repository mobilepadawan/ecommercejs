// IMPORTS
import { retornarCardHTML, retornarCardError, retornarItemCategoria } from './elements.js'
import { obtenerURLendpoint, validarURL, almacenarCarrito, recuperarCarrito } from './general.js'

// DOM: enlaces y variables globales
const categorias = []
const productos = []
const carrito = recuperarCarrito()
const container = document.querySelector('div.card-container')
const seccionCategorias = document.querySelector('article.categories')
const buttonCarrito = document.querySelector('div.shoping-cart')
const inputSearch = document.querySelector('input#inputSearch')
const arrowUp = document.querySelector('div.arrow-style')

// LÒGICA
function obtenerProductos() {
    let URLproductos = obtenerURLendpoint()

    if (validarURL(URLproductos)) {
        fetch(URLproductos)
        .then((response)=> {
            if (response.status === 200) return response.json()
            else throw new Error('Error al obtener productos: ' + response.status)
        })
        .then((data)=> productos.push(...data))
        .then(()=> recuperarCategorias(productos))
        .then(()=> mostrarCategorias(categorias))
        .then(()=> mostrarProductos(productos))
        .catch((err)=> container.innerHTML = retornarCardError())
    }
}

function mostrarProductos(arrayProductos) {
    if (Array.isArray(arrayProductos) && arrayProductos.length > 0) {
        container.innerHTML = ''
        container.innerHTML = arrayProductos.map( (producto)=> retornarCardHTML(producto) ).join('')
        agregarClicEnCategorias()
        agregarClicEnBotones()
    } else {
        container.innerHTML = retornarCardError()
    }
    arrayProductos = null
}

function mostrarCategorias(arrayCategorias) {
    if (Array.isArray(arrayCategorias)) {
        let spanCategorias = ''
        arrayCategorias.forEach((categoria)=> spanCategorias += retornarItemCategoria(categoria))
        seccionCategorias.innerHTML += spanCategorias
    }
}

function recuperarCategorias(arrayProductos) {
    const categoriasUnicas = new Set(...[arrayProductos.map((producto)=> producto.categoria)])
    categorias.push(...categoriasUnicas)
}

// EVENTOS
buttonCarrito.addEventListener('mouseover', ()=> {
    carrito.length === 0 ? buttonCarrito.title = 'No tienes productos'
                         : buttonCarrito.title = `Productos en carrito: ${carrito.length}`
})

buttonCarrito.addEventListener('click', ()=> {
    carrito.length > 0 ? location.href = 'checkout.html'
                       : alert('No hay productos en el carrito para comprar.')
})

inputSearch.addEventListener('keydown', (e)=> {
    let nombreAbuscar = inputSearch.value.trim().toLowerCase()

    if (e.key === 'Enter' && nombreAbuscar !== '') {        
        let arrayResultado = productos.filter((producto)=> producto.nombre.toLowerCase().includes(nombreAbuscar))
        arrayResultado.length > 0 && mostrarProductos(arrayResultado)
        arrayResultado = null
    }
})

inputSearch.addEventListener('input', ()=> { // restaura productos al borrar la búsqueda
    inputSearch.value === '' && mostrarProductos(productos)
})

function agregarClicEnCategorias() {
    seccionCategorias.addEventListener('click', (e)=> {
        let link = e.target
        if (link.className === 'category') {
            if (link.textContent === 'Todos') {
                mostrarProductos(productos)
            } else {
                const productosFiltrados = productos.filter((producto)=> producto.categoria === link.textContent)
                productosFiltrados.length > 0 && mostrarProductos(productosFiltrados)
            }
        }
        link = null
        return 
    })
}

function agregarClicEnBotones() {
    container.addEventListener('click', (e)=> {
        let button = e.target
        if (button.id === 'buttonComprar') {
            let codigoProducto = button.dataset.codigo
            let productoSeleccionado = productos.find((producto)=> producto.id === codigoProducto)
            carrito.push(productoSeleccionado)
            almacenarCarrito(carrito)
        }
        button = null
        return 
    })
}

document.addEventListener('scroll', ()=> {
        window.scrollY > 115 ? arrowUp.classList.remove('hide-arrow')
                             : arrowUp.classList.add('hide-arrow')
})

arrowUp.addEventListener('click', ()=> {
    window.scrollTo({ top: 0, behavior: 'smooth' })
})

//FUNCIÓN PRINCIPAL
obtenerProductos()