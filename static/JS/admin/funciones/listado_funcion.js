import { recibirData } from "/static/JS/shared_modules/apiFeedbackHandler.js";

function obtenerFunciones(){
  recibirData("funcion", "GET", "Error al cargar funciones", "Exito al cargar funciones")
  //Esta función maneja los datos convertidos del JSON.
  .then((data) => {
    let tablaFunciones = document.getElementById("tablaFunciones"); //Selecciona el elemento del DOM donde se mostrarán los peliculas.
    // Iteramos sobre cada pelicula y agregamos filas a la tabla
    for (let funcion of data) {
      let fila = document.createElement("tr"); //Crea una nueva fila de tabla (<tr>) para cada pelicula.
      fila.innerHTML =
      '<td class="elementos">' +
      funcion.codigo +
      "</td>" +
      "<td>" +
      funcion.funcion_pelicula +
      "</td>" +
      "<td>" +
      funcion.horario +
      "</td>" +
      "<td>" +
      funcion.fecha +
      "</td>" +
      "<td>" +
      funcion.funcion_cine +
      "</td>" +
      "<td>" + 
      funcion.sala +
      "</td>";
      //Una vez que se crea la fila con el contenido del pelicula, se agrega a la tabla utilizando el método appendChild del elemento tablaPeliculas.
      tablaFunciones.appendChild(fila);
      }
    });
}

document.addEventListener("DOMContentLoaded", obtenerFunciones);