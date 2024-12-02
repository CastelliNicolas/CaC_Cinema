import { recibirData } from "../apiFeedbackHandler.js";

function obtenerPeliculas(){
  // Realizamos la solicitud GET al servidor para obtener todos los peliculas.
  recibirData("pelicula", "GET", "Error al obtener peliculas", "Peliculas obtenidas correctamente")
    //Esta función maneja los datos convertidos del JSON.
    .then(function (data) {
      let tablaPeliculas = document.getElementById("tablaPeliculas"); //Selecciona el elemento del DOM donde se mostrarán los peliculas.
      // Iteramos sobre cada pelicula y agregamos filas a la tabla
      for (let pelicula of data) {
        let fila = document.createElement("tr"); //Crea una nueva fila de tabla (<tr>) para cada pelicula.
        fila.innerHTML =
          '<td class="elementos">' +
          pelicula.codigo +
          "</td>" +
          "<td>" +
          pelicula.nombre_pelicula +
          "</td>" +
          "<td>" +
          pelicula.genero_pelicula +
          "</td>" +
          "<td>" +
          pelicula.director +
          "</td>" +
          "<td>" +
          pelicula.duracion +
          "</td>" +
          "<td><img src=/static/imagenes/" +
          //"<td><img src=https://www.pythonanywhere.com/user/Sinost/files/home/Sinost/mysite/static/imagenes/" +
          pelicula.imagen_url +
          ' alt="Imagen de la pelicula" style="width: 100px;"></td>' +
          "<td>" +
          pelicula.trailer_url +
          "</td>" +
          "<td>" +
          pelicula.clasificacion +
          "</td>";
        //Una vez que se crea la fila con el contenido del pelicula, se agrega a la tabla utilizando el método appendChild del elemento tablaPeliculas.
        tablaPeliculas.appendChild(fila);
      }
    });
}

document.addEventListener("DOMContentLoaded", obtenerPeliculas);
