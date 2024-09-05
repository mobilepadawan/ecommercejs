// IMPORTS
import { retornarCardHTML, retornarCardError, retornarItemCategoria, retornarFooter } from './elements.js'
import { obtenerURLendpoint, validarURL, almacenarCarrito, recuperarCarrito, mostrarToast, dom } from './general.js'

// DOM: enlaces y variables globales
const categorias = []
const productos = []
const carrito = recuperarCarrito()
const seccionCategorias = dom('article.categories')
const container = dom('div.card-container')
const footer = dom('footer')
const buttonCarrito = dom('div.shoping-cart')
const inputSearch = dom('input#inputSearch')
const arrowUp = dom('div.arrow-style')

// LÓGICA
footer.innerHTML = retornarFooter('backoffice', 'setup')

function obtenerProductos() {
    let URLproductos = obtenerURLendpoint()

    if (validarURL(URLproductos)) {
        fetch(URLproductos)
        .then((response)=> {
            if (response.status === 200) return response.json()
            else throw new Error('Error al obtener productos: (' + response.status + ')')
        })
        .then((data)=> productos.push(...data))
        .then(()=> recuperarCategorias(productos))
        .then(()=> mostrarCategorias(categorias))
        .then(()=> mostrarProductos(productos))
        .catch((err)=> {
            mostrarToast('error', `${err.message}`)
            container.innerHTML = retornarCardError()
        })
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
    if (Array.isArray(arrayCategorias) && arrayCategorias.length > 0) {
        let spanCategorias = ''
        arrayCategorias.forEach((categoria)=> spanCategorias += retornarItemCategoria(categoria))
        seccionCategorias.innerHTML += spanCategorias
    }
}

function recuperarCategorias(arrayProductos) {
    if (arrayProductos[0]?.categoria) {
        const categoriasUnicas = new Set(...[arrayProductos.map((producto)=> producto?.categoria)])
        categorias.push(...categoriasUnicas)
    }
}

// EVENTOS
buttonCarrito.addEventListener('mouseover', ()=> {
    carrito.length === 0 ? buttonCarrito.title = 'No tienes productos'
                         : buttonCarrito.title = `Productos en carrito: ${carrito.length}`
})

buttonCarrito.addEventListener('click', ()=> {
    carrito.length > 0 ? location.href = 'checkout.html'
                       : mostrarToast('alert', '🛒 Carrito sin productos.')
})

inputSearch.addEventListener('keydown', (e)=> {
    let nombreAbuscar = inputSearch.value.trim().toLowerCase()
    if (e.key === 'Enter' && nombreAbuscar !== '') {        
        let arrayResultado = productos.filter((producto)=> producto.nombre.toLowerCase().includes(nombreAbuscar))
        arrayResultado.length > 0 ? mostrarProductos(arrayResultado)
                                  : mostrarToast('alert', '🔎 No se encontraron resultados.')
        arrayResultado = null
    }
})

inputSearch.addEventListener('input', ()=> { // restaura productos al borrar la búsqueda
    inputSearch.value === '' && mostrarProductos(productos)
})

function agregarClicEnCategorias() {
    const listadoCategorias = document.querySelectorAll('span.category')
    if (listadoCategorias.length > 0) {
        listadoCategorias.forEach((categoria)=> {
            categoria.addEventListener('click', ()=> {
                let link = categoria.textContent
                if (link === 'Todos') {
                    mostrarProductos(productos)
                } else {
                    const productosFiltrados = productos.filter((producto)=> producto.categoria === link)
                    productosFiltrados.length > 0 && mostrarProductos(productosFiltrados)
                }
            })
        })
    }
}

function agregarClicEnBotones() {
    const botonesComprar = document.querySelectorAll('button#buttonComprar')
    
    if (botonesComprar.length > 0) {
        botonesComprar.forEach((button)=> {
            button.addEventListener('click', ()=> {
                let codigoProducto = button.dataset.codigo
                let prod = productos.find((producto)=> producto.id === codigoProducto)
                carrito.push(prod)
                almacenarCarrito(carrito)
                mostrarToast('success', `'${prod.nombre}' se agregó al carrito.`)    
            })
        })
    }
}

document.addEventListener('scroll', ()=> window.scrollY > 115 ? 
                                         arrowUp.classList.remove('hide-arrow') : 
                                         arrowUp.classList.add('hide-arrow') )

arrowUp.addEventListener('click', ()=> window.scrollTo({ top: 0, behavior: 'smooth' }) )

//FUNCIÓN PRINCIPAL
obtenerProductos()