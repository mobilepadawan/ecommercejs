export function retornarCardHTML(producto) {
    return `<div class="card">
                <div class="product-image">${producto.imagen}</div>
                <div class="product-name">${producto.nombre}</div>
                <div class="product-price">$ ${producto.precio}</div>
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
                <td id="price">$ ${producto?.precio || '0.00'}</td>
                <td id="delButton" 
                    data-codigo="${producto?.id || ''}" 
                    title="Clic para eliminar">⛔️</td>
            </tr>`
}
