import { fillSelectArray, fillArray, findElement, fillSalasSelect } from "../../shared_modules/utils.js";
import {enviarData} from "/static/JS/shared_modules/apiFeedbackHandler.js";
import{fillSelect} from "/static/JS/shared_modules/utils.js";
//Cargar Selects de Cine y Peliculas

let cinesDisponibles = [];

function loadSelects(){
  fillArray("cine")
    .then(cinesObtenidos => {
      cinesDisponibles = cinesObtenidos;
      console.log("Obtenido: ", cinesDisponibles)
      fillSelectCines(cinesDisponibles);
    })
    .catch(error => {
      console.error(error)
    })
  fillSelectPeliculas();
}

function fillSelectCines(cinesDisponibles){
  fillSelectArray(cinesDisponibles, "codigo_cine", "nombre_cine");
};

// Funcion para cargar los selects
function fillSelectPeliculas() {
  fillSelect("pelicula", "codigo_pelicula", "nombre_pelicula");
};

document.addEventListener("DOMContentLoaded", loadSelects);


//Cargar select dinamico de Salas
document.getElementById("codigo_cine").addEventListener("change", function() {
  let selectedCine = document.getElementById("codigo_cine").value;
  console.log(selectedCine)
  let selectSala = document.getElementById("sala");
  selectSala.removeAttribute("disabled");
  let cineEncontrado = findElement(cinesDisponibles, selectedCine);
  fillSalasSelect(cineEncontrado.cant_salas, 1);
});

// Capturamos el evento de envío del formulario
document.getElementById("formulario_funcion").addEventListener("submit", function (event) {
  event.preventDefault(); // Evitamos que se envie el form
  var formData = new FormData(this);
  enviarData("funcion", "POST", formData, "Error al enviar funcion", "Exito al enviar funcion")
  .finally(function () {
    document.getElementById("codigo_pelicula").value = "";
    document.getElementById("horario").value = "";
    document.getElementById("fecha").value = "";
    document.getElementById("codigo_cine").value = "";
    document.getElementById("sala").value = "";
    document.getElementById("sala").setAttribute("disabled", "");
  });
});