import { retornarFooter } from './elements.js'
import { mostrarToast, guardarURLendpoint, 
         obtenerURLendpoint, validarURL, 
         dom} from './general.js'

const buttonGuardar = dom('div.endpoint-setup button')
const inputURL = dom('input#inputURL')
const footer = dom('footer')

footer.innerHTML = retornarFooter('index', 'backoffice')
inputURL.value = obtenerURLendpoint() || ''

buttonGuardar.addEventListener('click', ()=> {
    const url = inputURL.value.trim()
    if (validarURL(url)) {
        guardarURLendpoint(url)
        mostrarToast('success', '✅ URL guardada con éxito.')
        return 
    }
    mostrarToast('error', '⛔️ Ingresa una URL válida.')
})