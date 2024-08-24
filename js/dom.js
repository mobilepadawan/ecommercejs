import { crearCardHTML, crearCardError, 
         crearFilaCarritoHTML, URLproductos } from "./interfaces.js"
import { carrito, guardarCarrito, recuperarCarrito } from "./storage.js"
import ToastIt from "./toastitv1.0-min.js";

const divContenedor = document.querySelector("div#contenedor.container")
const dialogCarrito = document.querySelector("dialog#modal-background")
const tableBody = document.querySelector("tbody")
const tableFoot = document.querySelector("tfoot")

const btnVerCarrito = document.querySelector("img#carrito")
const btncerrarModalCarrito = document.querySelector("button#cerrarModalCarrito")
const btnconfirmarCarrito = document.querySelector("button#confirmarCarrito")
const btnFlechaArriba = document.querySelector("div#flechaArriba")
const inputSearch = document.querySelector("input[type=search]")

const productos = []

function obtenerProductos() {
    fetch(URLproductos)
        .then((response)=> response.json())
        .then((data)=> productos.push(...data) )
        .then(()=> mostrarProductos(productos) )
        .catch((error)=> {
            mostrarMensajeToast('alert', `Configura la URL del endpoint.`)
            divContenedor.innerHTML = crearCardError()
        } )
}
obtenerProductos()

function mostrarMensajeToast(estilo, mensaje) {
    ToastIt.now({
            close: false,
            style: estilo,
            timer: 2000,
            message: mensaje 
        })
}

function activarClickEliminar() {
    if (carrito.length > 0) {
        let botonesEliminar = document.querySelectorAll("td.btn-quitar")
        botonesEliminar.forEach((botonEliminar)=> {
            botonEliminar.addEventListener("click", ()=> {
                let indice = carrito.findIndex((producto)=> producto.id === botonEliminar.id)
                mostrarMensajeToast('alert', `${carrito[indice].nombre} se quitó del carrito`)
                carrito.splice(indice, 1)
                guardarCarrito(carrito)
                armarTablaCarrito()
            })
        })
    }
}

function activarClickEnBotones() {
    const botonesAgregar = document.querySelectorAll("button.button.button-outline.button-add")

    if (botonesAgregar.length > 0) {
        botonesAgregar.forEach((boton)=> {
            boton.addEventListener("click", ()=> {
                let productoElegido = productos.find((producto)=> producto.id === boton.id)
                carrito.push(productoElegido)
                mostrarMensajeToast('success', `${productoElegido.nombre} se agregó al carrito`)
                guardarCarrito(carrito)
            })
        })
    }
}

function crearFiltros() {
    const divFiltros = document.querySelector("div.filtros")
    divFiltros.innerHTML = ""

    let categorias = productos.map((prod)=> prod.categoria)
    const categoriasUnicas = [...new Set(categorias)]

    categoriasUnicas.forEach((categoria)=> {
        const spanCategoria = document.createElement("span")
        spanCategoria.textContent = categoria
        spanCategoria.addEventListener("click", ()=> {
            const filtroProductos = productos.filter((prod)=> prod.categoria === categoria)
            mostrarProductos(filtroProductos)
        })
        divFiltros.appendChild(spanCategoria)
    })
}

function mostrarProductos(array) {
    if (array.length > 0) {
        divContenedor.innerHTML = ""
        array.forEach((producto)=> divContenedor.innerHTML += crearCardHTML(producto))
        activarClickEnBotones()
        crearFiltros()
    } else {
        divContenedor.innerHTML = crearCardError()
        mostrarMensajeToast('error', `No se encontraron productos a listar`)
    }
}

function mostrarTotalCarritoHTML() {
    let total = carrito.reduce((acc, producto)=> acc + producto.precio, 0)
    document.querySelector("td#totalProductos").textContent = `$ ${total}`
}

// EVENTOS

function armarTablaCarrito() {
    tableBody.innerHTML = ""
    carrito.forEach((producto)=> tableBody.innerHTML +=  crearFilaCarritoHTML(producto))
    mostrarTotalCarritoHTML()
    activarClickEliminar()
}

btnVerCarrito.addEventListener("click", ()=> {
    if (carrito.length > 0) {
        armarTablaCarrito()
        dialogCarrito.showModal()
    } else {
        mostrarMensajeToast('warning', 'No hay productos para mostrar')
    }
} )

btnVerCarrito.addEventListener("mouseover", ()=> {
    if (carrito.length > 0) {
        btnVerCarrito.title = `Productos en carrito: ${carrito.length}`
    } else {
        btnVerCarrito.title = `Agrega un producto al carrito`
    }
})

inputSearch.addEventListener("search", ()=> {
    if (inputSearch.value.trim() !== "" ) {
        let parametro = inputSearch.value.trim().toLowerCase()
        let resultado = productos.filter((producto)=> producto.nombre.toLowerCase().includes(parametro) )
        if (resultado.length > 0) {
            mostrarProductos(resultado)
        }
    } else {
        mostrarProductos(productos)
    }
})

btnconfirmarCarrito.addEventListener("click", ()=> {
    alert("✅ Compra finalizada. Muchas gracias! Le enviaremos los productos a su domicilio.")
    localStorage.removeItem("miCarrito")
    carrito.length = 0
})

// CERRAR VENTANA <DIALOG>
btncerrarModalCarrito.addEventListener("click", ()=> dialogCarrito.close() )
document.addEventListener("keydown", (e)=> { if (dialogCarrito.open && e.key === "Escape") dialogCarrito.close() })

document.addEventListener("scroll", ()=> {
    if (window.scrollY > 0) {
        btnVerCarrito.classList.add("imagen-fija")
        btnFlechaArriba.classList.remove("ocultar")
    } else {
        btnVerCarrito.classList.remove("imagen-fija")
        btnFlechaArriba.classList.add("ocultar")
    }
})

btnFlechaArriba.addEventListener("click", ()=> window.scrollTo({ top: 0, behavior: 'smooth' }))