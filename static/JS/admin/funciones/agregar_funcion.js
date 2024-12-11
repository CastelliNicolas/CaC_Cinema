import { fillSelectArray } from "../../shared_modules/utils.js";
import { recibirData, enviarData} from "/static/JS/shared_modules/apiFeedbackHandler.js"
import{fillSelect} from "/static/JS/shared_modules/utils.js"
//Cargar Selects de Cine y Peliculas

let cinesDisponibles = []

function obtenerCines(){
  recibirData("cine", "GET", "Err", "EXX")
  .then((data)=>{
    for(let cine of data){
      cinesDisponibles.push(cine);
    }
    cargarOpciones()
  })
}

document.addEventListener("DOMContentLoaded", obtenerCines);

function cargarOpciones(){
  fillSelect("pelicula", "codigo_pelicula", "nombre_pelicula")
  fillSelectArray(cinesDisponibles, "codigo_cine", "nombre_cine")
};
//Cargar select dinamico de Salas
document.getElementById("codigo_cine").addEventListener("change", function() {
  let selectCine = document.getElementById("codigo_cine").value;
  console.log(selectCine)
  let selectSala = document.getElementById("sala");
  selectSala.removeAttribute("disabled")
  selectSala.options.length = 1;
  for(let cine of cinesDisponibles){
    console.log(cine.codigo)
    if(cine.codigo == selectCine){
      let cant_salas = cine.cant_salas;
      console.log("cantidad de salas:", cant_salas)
      for(let sala = 1; sala <= cant_salas; sala++){
        console.log("sala n° ", sala)
        let option = document.createElement("option");
        option.value = sala;
        option.text = sala;
        selectSala.appendChild(option);
      }
    }
  }
})

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
