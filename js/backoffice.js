import { retornarFilaProductosABM } from "./elements.js"
import { obtenerURLendpoint, mostrarToast } from "./general.js"

let abmStatus = ''
const productos = []
const dialogABM = document.querySelector('dialog')
const inputId = document.querySelector('input#inputId')
const inputImagen = document.querySelector('input#inputImagen')
const inputNombre = document.querySelector('input#inputNombre')
const inputPrecio = document.querySelector('input#inputPrecio')
const selectCategoria = document.querySelector('select#selectCategoria')
const buttonNuevo = document.querySelector('button.btn-nuevo')
const buttonGuardar = document.querySelector('button#btnGuardar')
const tableBody = document.querySelector('table tbody#tableBody')
const options = { method: '', headers: { 'Content-Type': 'application/json' }, body: '' }

function obtenerProductos() {
    const url = obtenerURLendpoint()
    productos.length = 0

    fetch(url)
    .then((response)=> {
        if (response.status === 200) return response.json()
        else throw new Error('⛔️ No se puede acceder a los productos.')
    })
    .then((data)=> productos.push(...data))
    .then(()=> cargarProductos())
    .then(()=> agregarEventoClickEditar())
    .then(()=> agregarEventoClickBorrar())
    .catch((error)=> mostrarToast('error', error.message))
}

function cargarProductos() {
    if (productos.length > 0) {
        let filaProductos = ''
        productos.forEach((producto)=> filaProductos += retornarFilaProductosABM(producto) )
        if (filaProductos !== '') {
            tableBody.innerHTML = filaProductos
            agregarEventoClickEditar()
            agregarEventoClickBorrar()
        }
    }
}

obtenerProductos() // FUNCIÓN PRINCIPAL

// EVENTOS
function vaciarCamposABM() {
    inputId.value = ''
    inputImagen.value = ''
    inputNombre.value = ''
    inputPrecio.value = ''
    selectCategoria.value = selectCategoria[0].value 
}

async function borrarProducto(prod) {
    if (prod) {
        abmStatus = 'delete'
        options.method = 'DELETE'
        options.body = ''
        let URLdel = `${obtenerURLendpoint()}${'/'}${prod.id}`
        const response = await fetch(URLdel, options)
        if (response.ok) {
            const data = await response.json()
            mostrarToast('success', `${data.nombre} ha sido eliminado.`)
            document.querySelector(`table tbody tr[data-filaCodigo="${prod.id}"]`).remove()
        } else {

            alert(`⛔️ ${error.name}: ${error.message}`)
        }
    }
}

function agregarEventoClickEditar() {
    const buttonsEditar = document.querySelectorAll('td#editButton')

    if (buttonsEditar.length > 0) {
        buttonsEditar.forEach((boton)=> {
            boton.addEventListener('click', ()=> {
                abmStatus = 'edit'
                let producto = productos.find((prod)=> prod.id === boton.dataset.codigo)
                if (producto) {
                    inputId.value = producto.id
                    inputNombre.value = producto.nombre 
                    inputImagen.value = producto.imagen 
                    inputPrecio.value = producto.precio 
                    selectCategoria.value = producto?.categoria && producto.categoria
                    dialogABM.showModal()
                }
            })
        })
    }
}

async function agregarEventoClickBorrar() {
    const buttonsBorrar = document.querySelectorAll('tbody tr td')

    buttonsBorrar.forEach((btn)=> {
        btn.addEventListener('click', ()=> {
            let prod = productos.find((prod)=> prod.id === btn.dataset.codigo)
            let mensaje = '¿Deseas eliminar el producto `' + prod.nombre + '`? \n\nEsta operación no podrá deshacerse.'
            const respuesta = confirm(mensaje) 
            if (respuesta) {
                borrarProducto(prod)
                return 0
            }
        } )
    })
}

buttonNuevo.addEventListener('click', ()=> {
    abmStatus = 'new'
    vaciarCamposABM()
    dialogABM.showModal()
})
buttonNuevo.addEventListener('keydown', (e)=> e.key === 'Esc' && dialogABM.close() )

buttonGuardar.addEventListener('click', ()=> {
    switch(abmStatus) {
        case 'new': {
            options.method = 'POST'
            options.body = JSON.stringify({
                nombre: inputNombre.value.trim(),
                imagen: inputImagen.value.trim(),
                precio: inputPrecio.value
            })
            fetch(obtenerURLendpoint(), options)
            .then((response)=> {
                if (response.status === 201) return response.json()
                else throw new Error('⛔️ Error en el alta de producto.')
            })
            .then((data)=> {
                inputId.value = data.id
                mostrarToast('success', 'Producto creado exitosamente.')
            })
            .catch((error)=> alert(`⛔️ ${error.name}: ${error.message}`) )
            break
        }
        case 'edit': {
            options.method = 'PUT'
            options.body = JSON.stringify(
            {
                nombre: inputNombre.value,
                imagen: inputImagen.value,
                precio: inputPrecio.value
            })
            let URLput = `${obtenerURLendpoint()}${'/'}${inputId.value}`
            fetch(URLput, options)
            .then((response)=> {
                if (response.status === 200) return response.json()
                else throw new Error('⛔️ Error en el alta de producto.')
            })
            .then((data)=> {
                mostrarToast('success', `Producto modificado exitosamente.`)
            } )
            .catch((error)=> {
                alert(`⛔️ ${error.name}: ${error.message}`)
            } )
            break
        }
        default: {
            alert('🔔 No se entendió la operación a realizar.')
        }
    }
    obtenerProductos()
})