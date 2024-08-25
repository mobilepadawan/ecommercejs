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