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
const buttonEliminar = document.querySelector('button#btnEliminar')
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

function agregarEventoClickEditar() {
    const buttonsEditar = document.querySelectorAll('td#editButton')

    if (buttonsEditar.length > 0) {
        buttonsEditar.forEach((boton)=> {
            boton.addEventListener('click', ()=> {
                abmStatus = 'edit'
                buttonEliminar.style.display = 'none'
                buttonGuardar.style.display = 'block'            
                let producto = productos.find((prod)=> prod.id === boton.dataset.codigo)
                if (producto) {
                    inputId.value = producto.id
                    inputNombre.value = producto.nombre 
                    inputImagen.value = producto.imagen 
                    inputPrecio.value = parseFloat(producto.precio)
                    selectCategoria.value = producto?.categoria && producto.categoria
                    dialogABM.showModal()
                }
            })
        })
    }
}

function agregarEventoClickBorrar() {
    const buttonsBorrar = document.querySelectorAll('tbody tr td#delButton')

    buttonsBorrar.forEach((btn)=> {
        btn.addEventListener('click', ()=> {
            vaciarCamposABM()
            dialogABM.showModal()
            let prod = productos.find((prod)=> prod.id === btn.dataset.codigo)

            inputId.value = prod.id
            inputImagen.value = prod.imagen
            inputNombre.value = prod.nombre
            inputPrecio.value = prod.precio
            selectCategoria.value = prod?.categoria || selectCategoria[0].value
            buttonEliminar.style.display = 'block'
            buttonGuardar.style.display = 'none'
            abmStatus = 'delete'
            console.log(abmStatus)
            return 0
        } )
    })
}

buttonNuevo.addEventListener('click', ()=> {
    abmStatus = 'new'
    buttonEliminar.style.display = 'none'
    buttonGuardar.style.display = 'block'
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
                precio: parseFloat(inputPrecio.precio)
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
            .catch((error)=> alert(`⛔️ ${error.name}: ${error.message}`))
            obtenerProductos()
            break
        }
        case 'edit': {
            options.method = 'PUT'
            options.body = JSON.stringify(
            {
                nombre: inputNombre.value,
                imagen: inputImagen.value,
                precio: parseFloat(inputPrecio.value)
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
            })
            obtenerProductos()
            break
        }
        default: {
            alert('🔔 No se entendió la operación a realizar.')
        }
    }
    obtenerProductos()
})

buttonEliminar.addEventListener('click', ()=> {
    if (abmStatus === 'delete' && inputId.value !== '') {
        options.method = 'DELETE'
        options.body = ''
        let URLdelete = `${obtenerURLendpoint()}${'/'}${inputId.value}`
        fetch(URLdelete, options)
        .then((response)=> {
            if (response.status === 200) return response.json()
            else throw new Error('⛔️ Error en la eliminación del producto.')
        })
        .then((data)=> {
            mostrarToast('success', `${data.nombre} ha sido eliminado.`)
            document.querySelector(`table tbody tr[data-filaCodigo="${inputId.value}"]`).remove()
            vaciarCamposABM()
        } )
        .catch((error)=> {
            alert(`⛔️ ${error.name}: ${error.message}`)
        } )
        obtenerProductos()
    }
})