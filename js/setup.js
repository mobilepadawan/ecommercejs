import { retornarFooter } from './elements.js'
import { mostrarToast, validarURL, retornarConfiguracionEntorno, 
         dom, guardarConfiguracionEntorno } from './general.js'

const buttonGuardar = dom('div.endpoint-setup button')
const inputURL = dom('input#inputURL')
const inputTabTitle = dom('input#inputTabTitle')
const inputEcommerceTitle = dom('input#inputEcommerceTitle')
const inputSloganTitle = dom('input#inputSloganTitle')

const footer = dom('footer')
const setup = retornarConfiguracionEntorno()
footer.innerHTML = retornarFooter('index', 'backoffice')

function cargarCampos() {
    inputURL.value = setup.urlEndpoint || ''
    inputTabTitle.value = setup.tabTitle || ''
    inputEcommerceTitle.value = setup.ecommerceTitle || ''
    inputSloganTitle.value = setup.sloganTitle || ''    
}

function configurarEntorno() {
    if (setup !== null) {
        dom('h1').textContent = setup.ecommerceTitle
        dom('h2').textContent = setup.sloganTitle
        dom('title').textContent = setup.tabTitle + ' | Setup'
    }
}

// FUNCIONES PRINCIPALES
configurarEntorno()
cargarCampos()

buttonGuardar.addEventListener('click', ()=> {
    const url = inputURL.value.trim()
    if (validarURL(url)) {
        guardarConfiguracionEntorno()
        mostrarToast('success', '✅ Configuración guardada con éxito.')
        return 
    }
    mostrarToast('error', '⛔️ Ingresa una URL válida.')
})