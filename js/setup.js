import ToastIt from "./toastitv1.0-min.js";

const inputUrl = document.querySelector("input#urlEndpoint")
const btnGuardar = document.querySelector("button#btnGuardar")
let params = ""

inputUrl.value = localStorage.getItem("URLEndpoint") || ""

btnGuardar.addEventListener("click", ()=> {
    if (inputUrl.value.trim() !== "") {
        localStorage.setItem("URLEndpoint", inputUrl.value.trim())
        params = {
            style: 'success',
            message: 'URL guardada correctamente.',
            timer: 3000,
            close: false
        }
    } else {
        params = {
            style: 'error',
            message: 'Ingresa una URL válida.',
            timer: 3500,
            close: false
        }
    }
    ToastIt.now(params)
})