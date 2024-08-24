export function guardarCarrito(carrito) {
    if (carrito.length > 0) {
        localStorage.setItem("miCarrito", JSON.stringify(carrito))
    }
}

export function recuperarCarrito() {
    if (localStorage.getItem("miCarrito")) {
        return JSON.parse(localStorage.getItem("miCarrito"))
    } else {
        return []
    }
}

export const carrito = recuperarCarrito()