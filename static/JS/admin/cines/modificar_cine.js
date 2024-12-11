import { recibirData, enviarData, mostrarMensaje } from "/static/JS/shared_modules/apiFeedbackHandler.js";

// Variables de estado para controlar la visibilidad y los datos del formulario
let mostrarDatos = false;
let codigo = "";
let nombre_cine = "";
let direccion = "";
let cant_salas = "";
let msgError = "Error al obtener el cine";
let msgExito = "Cine modificado correctamente";
let listaCines = [];


function obtenerCines(){
    recibirData("cine", "GET", msgError, "Cines obtenidos correctamente")
    .then((data) => {
        for(let cine of data){
            listaCines.push(cine);
        }
    });
}


function buscarCine(event){
    event.preventDefault()
    codigo = document.getElementById("codigo").value
    for(let cineBuscado of listaCines){
        if(codigo == cineBuscado.codigo){
            nombre_cine = cineBuscado.nombre_cine;
            direccion = cineBuscado.direccion;
            cant_salas = cineBuscado.cant_salas;
            mostrarDatos = true; 
            console.log("Cine encontrado")
           break
        } else {
            mostrarDatos = false;
        }
    }
    console.log(mostrarDatos)
    mostrarFormulario();
}

function mostrarFormulario(){
   if(mostrarDatos){
       document.getElementById("nombre_cine").value = nombre_cine;
       document.getElementById("direccion").value = direccion;
       document.getElementById("cant_salas").value = cant_salas;
       document.getElementById("datos-cine").style.display = "block";
    } else {
        document.getElementById("datos-cine").style.display = "none";
        mostrarMensaje("Cine no encontrado", "red")
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
    .then(() => {
        limpiarFormulario();
    })
    .catch(error => {
        console.error("Error al guardar cambios", error);
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
            
            
document.addEventListener("DOMContentLoaded", obtenerCines);
document.getElementById("form-obtener-cine").addEventListener("submit", buscarCine);
document.getElementById("form-guardar-cambios").addEventListener("submit", guardarCambios);
            