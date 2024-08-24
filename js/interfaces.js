export const URLproductos = localStorage.getItem("URLEndpoint") || "defineTuUrl"

export function crearCardHTML(producto) {
    return `<div class="card"> 
                <div><h1>${producto.imagen}</h1></div>
                <div class="card-title"><p>${producto.nombre}</p></div>
                <div class="card-price"><p>$ ${producto.precio}</p></div>
                <button id="${producto.id}" class="button button-outline button-add" title="Pulsa para comprar">COMPRAR</button>
            </div>`
}

export function crearCardError() {
    return `<div class="card-error">
                <h2>⛔️</h2>
                <h3>No se han podido listar los productos</h3>
                <h4>Intenta nuevamente en unos instantes.</h4>
            </div>`
}

export function crearFilaCarritoHTML(producto) {
    return `<tr>
                <td class="producto-imagen">${producto.imagen}</td>
                <td>${producto.nombre}</td>
                <td>$ ${producto.precio}</td>
                <td id="${producto.id}" title="Quitar producto" class="btn-quitar">⛔️</td>
            </tr>`
}

export function armarFilaHTML(producto) {
    return `<tr>
                <td>${producto.id}</td>
                <td>${producto.imagen}</td>
                <td>${producto.nombre}</td>
                <td>$ ${producto.precio}</td>
                <td>${producto.categoria}</td>
                <td data-editar="${producto.id}" class="boton-edicion" title="Editar">✍️</td>
                <td data-eliminar="${producto.id}" class="boton-eliminar" title="Eliminar">⛔️</td>
            </tr>`
}