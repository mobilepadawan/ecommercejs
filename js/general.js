import ToastIt from './toastitv1.0-min.js'

export function formatearImporte(valor) {
    const opciones = {
        style: 'currency',
        currency: 'ARS',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }

    const formateador = new Intl.NumberFormat(undefined, opciones)
    const valorFormateado = formateador.format(valor)

    return valorFormateado
}

export function obtenerURLendpoint() {
    return localStorage.getItem('URLEndpoint') || 'Error'
}

export function guardarURLendpoint(url) {
    localStorage.setItem('URLEndpoint', url)
}

export function almacenarCarrito(carrito) {
    localStorage.setItem('carrito', JSON.stringify(carrito || [])) 
}

export function recuperarCarrito() {
    return JSON.parse(localStorage.getItem('carrito')) || []
}

export function validarURL(urlString) {
    try {
        new URL(urlString)
        return true
    } catch (e) {
        return false
    }
}

export function mostrarToast(estilo, mensaje) {
    ToastIt.now({
        close: true,
        style: estilo,
        timer: 3000,
        message: mensaje
    })
}
