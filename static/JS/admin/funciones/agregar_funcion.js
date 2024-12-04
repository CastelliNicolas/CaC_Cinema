import { recibirData, enviarData} from "/static/JS/shared_modules/apiFeedbackHandler.js"
import{fillSelect} from "/static/JS/shared_modules/utils.js"
//Cargar Selects de Cine y Peliculas
document.addEventListener("DOMContentLoaded", cargarOpciones);

function cargarOpciones(){
  fillSelect("cine", "codigo_cine", "nombre_cine")
  fillSelect("pelicula", "codigo_pelicula", "nombre_pelicula")
};
//Cargar select dinamico de Salas
document.getElementById("codigo_cine").addEventListener("change", function() {
  let selectCine = document.getElementById("codigo_cine");
  let selectSala = document.getElementById("sala");
  selectSala.removeAttribute("disabled")
  selectSala.options.length = 1;
  if(selectCine.value){
    recibirData("cine/" + selectCine.value, "GET", "Error al cargar cines", "Exito al cargar cines")
    .then((data) => {
      let cant_salas = data.cant_salas;
      console.log("cantidad de salas:", cant_salas)
      for(let sala = 1; sala <= cant_salas; sala++){
        console.log("sala n° ", sala)
        let option = document.createElement("option");
        option.value = sala;
        option.text = sala;
        selectSala.appendChild(option);
      }
    })
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
