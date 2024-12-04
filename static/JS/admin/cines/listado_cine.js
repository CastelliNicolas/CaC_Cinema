import { recibirData } from "/static/JS/shared_modules/apiFeedbackHandler.js";
let msgExito = "Mostrando cines"
let msgError = "Error al mostrar los cines"


function obtenerCines(){
  // Realizamos la solicitud GET al servidor para obtener todos los peliculas.
  recibirData("cine", "GET", msgError, msgExito)
  //Esta función maneja los datos convertidos del JSON.
  .then((data) => {
    let tablaFunciones = document.getElementById("tablaCines"); //Selecciona el elemento del DOM donde se mostrarán los peliculas.
    // Iteramos sobre cada pelicula y agregamos filas a la tabla
    for (let funcion of data) {
      let fila = document.createElement("tr"); //Crea una nueva fila de tabla (<tr>) para cada pelicula.
      fila.innerHTML =
      '<td class="elementos">' +
      funcion.codigo +
      "</td>" +
      "<td>" +
      funcion.nombre_cine +
      "</td>" +
      "<td>" +
      funcion.direccion +
      "</td>" +
      "<td>" +
      funcion.cant_salas +
      "</td>";
      //Una vez que se crea la fila con el contenido del pelicula, se agrega a la tabla utilizando el método appendChild del elemento tablaPeliculas.
      tablaFunciones.appendChild(fila);
    }
  });
}

document.addEventListener("DOMContentLoaded", obtenerCines);