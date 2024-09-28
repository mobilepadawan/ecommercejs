import { formatearImporte } from "./general.js"

export function retornarCardHTML(producto) {
    return `<div class="card">
                <div class="product-image">${producto.imagen}</div>
                <div class="product-name">${producto.nombre}</div>
                <div class="product-price">${formatearImporte(producto.precio)}</div>
                <div class="buy-button"><button id="buttonComprar" data-codigo="${producto.id}">COMPRAR</button></div>
            </div>`
}

export function retornarCardError() {
    return `<div class="card-error">
                <div class="error-title">
                    <h3>Se ha producido un error inesperado.</h3>
                    <div class="emoji-error">🔌</div>
                    <h4>Por favor, intenta acceder nuevamente en unos instantes.</h4>
                    <p>No estamos pudiendo cargar el listado de productos para tu compra.</p>
                    <div class="emoji-error">
                        <span>🥑</span>
                        <span>🍉</span>
                        <span>🍋‍🟩</span>
                        <span>🍏</span>
                    </div>
                </div>
            </div>`
}

export function retornarItemCategoria(categoria) {
    return `<span class="category">${categoria}</span>`
}

export function retornarFilaCheckout(producto) {
    return `<tr>
                <td id="pImagen">${producto?.imagen || ''}</td>
                <td id="nombre">${producto?.nombre || ''}</td>
                <td id="price">${formatearImporte(producto?.precio || 0.00)}</td>
                <td id="delButton" 
                    data-codigo="${producto?.id || ''}" 
                    title="Clic para eliminar">⛔️</td>
            </tr>`
}

export function retornarFilaProductosABM(producto) {
    return `<tr data-filaCodigo="${producto.id}">
                <td id="pImagen">${producto.imagen}</td>
                <td id="nombre">${producto.nombre}</td>
                <td id="price">${formatearImporte(producto.precio)}</td>
                <td id="categoria">${producto.categoria}</td>
                <td id="delButton" 
                    data-codigo="${producto.id}" 
                    title="Clic para eliminar">
                    ⛔️
                </td>
                <td id="editButton" 
                    data-codigo="${producto.id}" 
                    title="Clic para Modificar">
                    ✍️
                </td>
            </tr>`
}

export function retornarFooter(page1, page2) {
    return `<div class="footer">
                <h3>Copyright © 2023 - <span>${new Date().getFullYear()}</span> | Fernando Luna para ISTEA</h3>
                <div class="links">
                    <a href="${page1}.html">${page1.toUpperCase()}</a>
                    <a href="${page2}.html">${page2.toUpperCase()}</a>
                </div>
            </div>`
}