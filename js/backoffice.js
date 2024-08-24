import { URLproductos, armarFilaHTML } from './interfaces.js'

let ope = ""    // e = editar / n = nuevo
const productos = []

const dialogABM = document.querySelector("dialog#form")
const btnNuevo = document.querySelector("button#btnNuevo")
const btnGuardar = document.querySelector("button#btnGuardar")
const btnLimpiar = document.querySelector("button#btnLimpiar")

const inputId = document.querySelector("input#idProducto")
const inputImagen = document.querySelector("input#imagenProducto")
const inputNombre = document.querySelector("input#nombreProducto")
const inputPrecio = document.querySelector("input#precioProducto")
const selectCategoria = document.querySelector("select")

const tablaProductos = document.querySelector("table tbody")

function obtenerProductos() {
    fetch(URLproductos)
    .then((response)=> response.json())
    .then((data)=> {
        if (productos.length > 0) {
            productos.length = 0
        }
        productos.push(...data)
    })
    .then(()=> mostrarProductos(productos))

    .catch((error)=> console.error(error))
}

obtenerProductos()

function mostrarProductos(productos) {
    if (productos.length > 0) {
        tablaProductos.innerHTML = ""
        productos.forEach((producto)=> tablaProductos.innerHTML += armarFilaHTML(producto) )
        activarClickBotonesEditar()
        activarClickBotonesEliminar()
    }
}

function activarClickBotonesEditar() {
    const botonesEditar = document.querySelectorAll("td.boton-edicion")
    if (botonesEditar.length > 0) {
        botonesEditar.forEach((botonEditar)=> {
            botonEditar.addEventListener("click", ()=> {
                const prodSeleccionado = productos.find((prod)=> prod.id === botonEditar.dataset.editar )
                inputId.value = prodSeleccionado.id
                inputImagen.value = prodSeleccionado.imagen 
                inputNombre.value = prodSeleccionado.nombre 
                inputPrecio.value = prodSeleccionado.precio 
                selectCategoria.value = prodSeleccionado.categoria
                ope = "e"
                dialogABM.showModal()
            })
        })
    }
}       

function activarClickBotonesEliminar() {
    const botonesEliminar = document.querySelectorAll("td.boton-eliminar")
    if (botonesEliminar.length > 0) {
        botonesEliminar.forEach((botonEliminar)=> {
            botonEliminar.addEventListener("click", ()=> {
                let id = botonEliminar.dataset.eliminar.trim()

                const producto = productos.find((prod)=> prod.id === id)
                const confirmar = confirm(`¿Deseas realmente eliminar el producto: ${producto.nombre.toUpperCase()}?`)

                if (confirmar) {
                    fetch(`${URLproductos}/${id}`, retornarOpcionesfetch('DELETE'))
                    .then((response)=> {
                        if (response.status === 200) {
                            return response.json()
                        } else {
                            console.error("Error en la petición", response.status)
                        }
                    })
                    .then((data)=> {
                        console.warn("Producto eliminado:")
                        console.table(data)
                    })
                    .then(()=> obtenerProductos())
                }

            })
        })
    }
}

btnNuevo.addEventListener("click", ()=> {
    limpiarCampos()
    ope = "n"
    dialogABM.showModal()
})

function limpiarCampos() {
    inputId.value = ""
    inputImagen.value = ""
    inputNombre.value = ""
    inputPrecio.value = ""
    selectCategoria.value = "Seleccione una categoría..."
}

btnLimpiar.addEventListener("click", limpiarCampos)

btnGuardar.addEventListener("click", ()=> {
        const producto = {
            imagen: inputImagen.value,
            nombre: inputNombre.value,
            precio: parseFloat(inputPrecio.value),
            categoria: selectCategoria.value 
        }

    if (ope === "e") {      // modificando producto existente

        let id = inputId.value.trim()

        fetch(`${URLproductos}/${id}`, retornarOpcionesfetch('PUT', producto ))
        .then((response)=> {
            if (response.status === 200) {
                return response.json()
            } else {
                console.error("Error en la petición", response.status)
            }
        })
        .then(()=> obtenerProductos())
        ope = ""

    } else if (ope === "n") {   // dando de alta un nuevo producto
        fetch(URLproductos, retornarOpcionesfetch('POST', producto ))
        .then((response)=> {
            if (response.status === 201) {
                return response.json()
            } else {
                console.error("Error en la petición", response.status)
            }
        })
        .then((data)=> inputId.value = data.id)
        .then(()=> obtenerProductos())
    } else {
        console.warn("Seleccione un producto para modificar.")
    }

})

function retornarOpcionesfetch(metodo, cuerpo) {
    let opciones = ""
    let body = ""

    if (cuerpo) {
        body = cuerpo
    }

    if (metodo === "DELETE") {
        opciones = {
            method: `${metodo}`,
            headers: {'content-type':'application/json'}
        }
    } else {
        opciones = {
            method: `${metodo}`,
            headers: {'content-type':'application/json'},
            body: JSON.stringify(body)
        }
    }

    return opciones
}