import { mostrarToast, guardarURLendpoint, 
         obtenerURLendpoint, validarURL } from './general.js';

const buttonGuardar = document.querySelector('div.endpoint-setup button')
const inputURL = document.querySelector('input#inputURL')

inputURL.value = obtenerURLendpoint() || ''

buttonGuardar.addEventListener('click', ()=> {
    const url = inputURL.value.trim()
    if (validarURL(url)) {
        guardarURLendpoint(url)
        mostrarToast('success', 'URL guardada con éxito.')
        return 
    }
    mostrarToast('error', 'Ingresa una URL válida.')
})