import { fillSelectArray } from "../../shared_modules/utils.js";
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

let cinesDisponibles = [];

function cargarCinesDisponibles(){
  recibirData("cine", "GET", "Err", "EXito")
  .then((data)=>{
    for(let cine of data){
      cinesDisponibles.push(cine);
    }
    console.log("--"+cinesDisponibles)
    fillSelectCines()
  })
};

function fillSelectCines(){
  fillSelectArray(cinesDisponibles, "codigo_cine", "nombre_cine");
};

// Funcion para cargar los selects
function fillSelectPeliculas() {
  fillSelect("pelicula", "codigo_pelicula", "nombre_pelicula");
};


function encontrarCine(cineId){
  console.log(cineId)
  for(let cine of cinesDisponibles){
    console.log(cine.codigo)
    if(cine.codigo == cineId){
      let cant_salas = cine.cant_salas;
      console.log("cantidad de salas:", cant_salas)
      return cant_salas
    }
  }
};

function fillSalasSelect(salas){
  let selectSala = document.getElementById("sala");
  for(let sala = 1; sala <= salas; sala++){
    console.log("sala n° ", sala)
    let option = document.createElement("option");
    option.value = sala;
    option.text = sala;
    selectSala.appendChild(option);
  }
};

// Events
document.addEventListener("DOMContentLoaded", cargarCinesDisponibles)
document.addEventListener("DOMContentLoaded", fillSelectPeliculas)
document.getElementById("form-obtener-funcion").addEventListener("submit", obtenerFuncion);
document.getElementById("form-guardar-cambios").addEventListener("submit", guardarCambios);
document.getElementById("codigo_cine").addEventListener("change", () => {
  let selectCine = document.getElementById("codigo_cine").value;
  console.log(selectCine)
  let selectSala = document.getElementById("sala");
  selectSala.options.length = 0;
  let cant_salas = encontrarCine(selectCine);
  fillSalasSelect(cant_salas)
});


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
      let cant_salas = encontrarCine(codigo_cine)
      fillSalasSelect(cant_salas)
      mostrarFormulario()
      })
};



// Muestra el formulario con los datos de la pelicula
function mostrarFormulario() {
  if (mostrarDatos) {
    document.getElementById("codigo_pelicula").value = codigo_pelicula;
    document.getElementById("codigo_pelicula").text = funcion_pelicula;
    document.getElementById("horario").value = horario;
    document.getElementById("fecha").value = convertirFecha(fecha);
    document.getElementById("codigo_cine").value = codigo_cine;
    document.getElementById("codigo_cine").text = nombre_cine;
    console.log("Sala valor" + sala)
    document.getElementById("sala").value = sala;

    document.getElementById("datos-funcion").style.display = "block";
  } else {
    document.getElementById("datos-funcion").style.display = "none";
  }
};

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
};

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
};