import {recibirData, enviarData} from "/static/JS/shared_modules/apiFeedbackHandler.js";
import {fillSelect} from "/static/JS/shared_modules/utils.js";
// Funcion para formatear fecha
function convertirFecha(fecha) {
  const date = new Date(fecha);
  const año = date.getFullYear();
  const mes = String(date.getMonth() + 1).padStart(2, '0');
  const dia = String(date.getDate()).padStart(2, '0');
  return `${año}-${mes}-${dia}`;
}
// Variables de estado para controlar la visibilidad y los datos del formulario
let codigo = "";
let codigo_pelicula = "";
let funcion_pelicula = "";
let horario = "";
let fecha = "";
let nombre_cine = "";
let codigo_cine = "";
let sala = "";
let mostrarDatos = false;
// Funcion para cargar los selects
function cargarListasIniciales() {
  fillSelect("cine", "codigo_cine", "nombre_cine");
  fillSelect("pelicula", "codigo_pelicula", "nombre_pelicula")
}
document.addEventListener("DOMContentLoaded", cargarListasIniciales)
// Events
document.getElementById("form-obtener-funcion").addEventListener("submit", obtenerFuncion);
document.getElementById("form-guardar-cambios").addEventListener("submit", guardarCambios);

document.getElementById("codigo_cine").addEventListener("change", function() {
  let codigo_cine = document.getElementById("codigo_cine").value
  recibirData("cine/" + codigo_cine, "GET", "Error al obtener salas", "Exito al obtener salas")
  .then((data) => {
    let salas = data.cant_salas;
    fillSalasSelect(salas);
  })
})

function obtenerFuncion(event) {
  event.preventDefault();
  codigo = document.getElementById("codigo").value;
  recibirData("funcion/" + codigo, "GET", "Error al obtener funcion", "Exito al obtener funcion")
    .then((data) => {
      codigo_pelicula = data.codigo_pelicula;
      console.log(codigo_pelicula, "AQUI")
      funcion_pelicula = data.funcion_pelicula;
      horario = data.horario;
      fecha = data.fecha;
      codigo_cine = data.codigo_cine;
      nombre_cine = data.funcion_cine;
      console.log("CINE:", nombre_cine, "CODIGO", codigo_cine)
      sala = data.sala;
      console.log("Sala n°", sala)
      mostrarDatos = true; //Activa la vista del segundo formulario
      recibirData("cine/" + codigo_cine, "GET", "Error al obtener las salas", "Salas obtenidas correctamente")
      .then((data) => {
        let salas = data.cant_salas;
        fillSalasSelect(salas)
        mostrarFormulario()
      })
    });
}

function fillSalasSelect(salas){
  let select2 = document.getElementById("sala");
  select2.options.length = 0;
  for(let sala = 1; sala <= salas; sala++){
    console.log("sala n° ", sala)
    let option = document.createElement("option");
    option.value = sala;
    option.text = sala;
    select2.appendChild(option);
  }
    console.log(select2.innerHTML); // Check the options
}

// Muestra el formulario con los datos de la pelicula
function mostrarFormulario() {
  if (mostrarDatos) {
    document.getElementById("codigo_pelicula").value = codigo_pelicula;
    document.getElementById("codigo_pelicula").text = funcion_pelicula;
    document.getElementById("horario").value = horario;
    document.getElementById("fecha").value = convertirFecha(fecha);
    document.getElementById("codigo_cine").value = codigo_cine;
    document.getElementById("codigo_cine").text = nombre_cine;
    document.getElementById("sala").value = sala;

    document.getElementById("datos-funcion").style.display = "block";
  } else {
    document.getElementById("datos-funcion").style.display = "none";
  }
}

// Se usa para enviar los datos modificados del producto al servidor.
function guardarCambios(event) {
  event.preventDefault();

  const formData = new FormData();
  formData.append("codigo", codigo);
  formData.append("codigo_pelicula", document.getElementById("codigo_pelicula").value);
  formData.append("horario", document.getElementById("horario").value);
  formData.append("fecha", document.getElementById("fecha").value);
  formData.append("codigo_cine", document.getElementById("codigo_cine").value);
  formData.append("sala", document.getElementById("sala").value);

  enviarData("funcion/" + codigo, "PUT", formData, "Error al modificar funcion", "Funcion modificada")
    .then(() => {
      limpiarFormulario();
    })
    .catch((error) => {
      // Código para manejar errores
      console.error("Error al obtener las funciones:", error);
    });
}

// Restablece todas las variables relacionadas con el formulario a sus valores iniciales, lo que efectivamente "limpia" el formulario.
function limpiarFormulario() {
  document.getElementById("codigo").value = "";
  document.getElementById("codigo_pelicula").value = "";
  document.getElementById("horario").value = "";
  document.getElementById("fecha").value = "";
  document.getElementById("codigo_cine").value = "";
  document.getElementById("sala").value = "";

  codigo = "";
  codigo_pelicula = "";
  horario = "";
  fecha = "";
  codigo_cine = "";
  sala = "";
  mostrarDatos = false;

  document.getElementById("datos-funcion").style.display = "none";
}
