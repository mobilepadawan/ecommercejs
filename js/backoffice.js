import { retornarFilaProductosABM, retornarFooter } from "./elements.js"
import { obtenerURLendpoint, mostrarToast, dom } from "./general.js"

let abmStatus = ''
const productos = []
const dialogABM = dom('dialog')
const inputId = dom('input#inputId')
const inputImagen = dom('input#inputImagen')
const inputNombre = dom('input#inputNombre')
const inputPrecio = dom('input#inputPrecio')
const selectCategoria = dom('select#selectCategoria')
const buttonNuevo = dom('button.btn-nuevo')
const buttonGuardar = dom('button#btnGuardar')
const buttonEliminar = dom('button#btnEliminar')
const tableBody = dom('table tbody#tableBody')
const footer = dom('footer')
const options = { method: '', headers: { 'Content-Type': 'application/json' }, body: '' }

function obtenerProductos() {
    const url = obtenerURLendpoint()
    productos.length = 0
    
    fetch(url)
    .then((response)=> {
        if (response.status === 200) return response.json()
        else throw new Error(`⛔️ No encontramos productos (${response.status})`)
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
        tableBody.innerHTML = ''
        productos.forEach((producto)=> filaProductos += retornarFilaProductosABM(producto) )
        if (filaProductos !== '') {
            tableBody.innerHTML = filaProductos
            agregarEventoClickEditar()
            agregarEventoClickBorrar()
        }
    }
}

obtenerProductos() // FUNCIÓN PRINCIPAL
footer.innerHTML = retornarFooter('index', 'setup')

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

    const datosFaltantes = (selectCategoria.value === 'Selecciona una opción...' 
                            || inputNombre.value.trim() === '' 
                            || inputImagen.value === '' 
                            || inputPrecio.value <= '0')

    if (datosFaltantes) {
        mostrarToast('alert', 'Complete todos los datos para continuar.')
        return
    }

    switch(abmStatus) {
        case 'new': {
            options.method = 'POST'
            options.body = JSON.stringify({
                nombre: inputNombre.value.trim(),
                imagen: inputImagen.value.trim(),
                precio: parseFloat((Number(inputPrecio.value)).toFixed(2)),
                categoria: selectCategoria.value
            })
            fetch(obtenerURLendpoint(), options)
            .then((response)=> {
                if (response.status === 201) return response.json()
                else throw new Error(`⛔️ Error en el alta de producto (${response.status})`)
            })
            .then((data)=> {
                inputId.value = data.id
                mostrarToast('success', 'Producto creado exitosamente.')
            })
            .then(()=> obtenerProductos())
            .catch((error)=> mostrarToast('error', `${error.message}`))
            break
        }
        case 'edit': {
            options.method = 'PUT'
            options.body = JSON.stringify(
            {
                nombre: inputNombre.value,
                imagen: inputImagen.value,
                precio: parseFloat(inputPrecio.value),
                categoria: selectCategoria.value
            })
            let URLput = `${obtenerURLendpoint()}${'/'}${inputId.value}`
            fetch(URLput, options)
            .then((response)=> {
                if (response.status === 200) return response.json()
                else throw new Error('⛔️ Error en el alta de producto.')
            })
            .then((data)=> {
                mostrarToast('success', `Producto modificado exitosamente.`)
            })
            .then(()=> obtenerProductos())
            .catch((error)=> mostrarToast('error', `${error.message}`) )
            break
        }
        default: mostrarToast('info', `No comprendimos la operación indicada.`)
    }
})

buttonEliminar.addEventListener('click', ()=> {
    if (abmStatus === 'delete' && inputId.value !== '') {
        options.method = 'DELETE'
        options.body = ''
        let URLdelete = `${obtenerURLendpoint()}${'/'}${inputId.value}`
        fetch(URLdelete, options)
        .then((response)=> {
            if (response.status === 200) return response.json()
            else throw new Error(`⛔️ Error al eliminar el producto (${response.status})`)
        })
        .then((data)=> {
            mostrarToast('success', `${data.nombre} ha sido eliminado.`)
            document.querySelector(`table tbody tr[data-filaCodigo="${inputId.value}"]`).remove()
            vaciarCamposABM()
        } )
        .catch((error)=> {
            mostrarToast('error', `${error.message}`)
        } )
        obtenerProductos()
    } else {
        mostrarToast('alert', `Falta el ID de producto a eliminar.`)
    }
})