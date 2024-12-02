import { recibirData, enviarData } from "../apiFeedbackHandler.js";

// Variables de estado para controlar la visibilidad y los datos del formulario
let mostrarDatos = false;
let codigo = "";
let nombre_cine = "";
let direccion = "";
let cant_salas = "";
let msgError = "Error al obtener el cine";
let msgExito = "Cine modificado correctamente";

document.getElementById("form-obtener-cine").addEventListener("submit", obtenerCine);
document.getElementById("form-guardar-cambios").addEventListener("submit", guardarCambios);

function obtenerCine(event){
    event.preventDefault();
    codigo = document.getElementById("codigo").value;
    recibirData("cine/" + codigo, "GET", msgError, msgExito)
    .then((data) => {
        nombre_cine = data.nombre_cine;
        direccion = data.direccion;
        cant_salas = data.cant_salas;
        mostrarDatos = true; 
        mostrarFormulario();
    })
    .catch(error =>{
        console.error("Error al cargar el cine:", error)
    });
}

function mostrarFormulario(){
    if(mostrarDatos){
        document.getElementById("nombre_cine").value = nombre_cine;
        document.getElementById("direccion").value = direccion;
        document.getElementById("cant_salas").value = cant_salas;
        document.getElementById("datos-cine").style.display = "block";
    } else {
        document.getElementById("datos-cine").style.display = "none";
    }
}

function guardarCambios(event){
    event.preventDefault();
    const formData = new FormData();
    formData.append("codigo", codigo);
    formData.append("nombre_cine", document.getElementById("nombre_cine").value);
    formData.append("direccion", document.getElementById("direccion").value);
    formData.append("cant_salas", document.getElementById("cant_salas").value);
    enviarData("cine/" + codigo, "PUT", formData, msgError, msgExito)
    .then((data) => {
        limpiarFormulario()
    })
    .catch(error => {
        console.error("Error al guardar cambios", error)
    });
}

function limpiarFormulario() {
    document.getElementById("codigo").value = "";
    document.getElementById("nombre_cine").value = "";
    document.getElementById("direccion").value = "";
    document.getElementById("cant_salas").value = "";
  
    codigo = "";
    mostrarDatos = false;
    nombre_cine = "";
    direccion = "";
    cant_salas = "";
  
    document.getElementById("datos-cine").style.display = "none";
  }
  