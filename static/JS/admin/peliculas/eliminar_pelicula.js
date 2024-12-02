import { recibirData, borrarData } from "../apiFeedbackHandler.js";

// Obtiene el contenido del inventario
function obtenerPeliculas() {
  recibirData("pelicula", "GET", "Error al obtener peliculas", "Peliculas obtenidas exitosamente")
    // Asigna los datos de las peliculas obtenidas a la propiedad peliculas del estado.
    .then((data) => {
      const peliculasTable = document.getElementById("peliculas-table").getElementsByTagName("tbody")[0];
      peliculasTable.innerHTML = ""; // Limpia la tabla antes de insertar nuevos datos
      data.forEach((pelicula) => {
        const row = peliculasTable.insertRow();
        row.innerHTML = `
                     <td class="elementos">${pelicula.codigo}</td>
                     <td class="elementos">${pelicula.nombre_pelicula}</td>
                     <td class="elementos">${pelicula.genero_pelicula}</td>
                     <td class="elementos formulario"><button class="formulario-input volver" onclick="eliminarPelicula('${pelicula.codigo}')">Eliminar</button></td>
                 `;
      });
    })
    // Captura y maneja errores, mostrando una alerta en caso de error al obtener las peliculas.
    .catch((error) => {
      console.log("Error:", error);
    });
}

// Se utiliza para eliminar una pelicula.
window.eliminarPelicula = function(codigo) {
  // Se muestra un diálogo de confirmación. Si el usuario confirma, se realiza una solicitud DELETE al servidor a través de fetch(URL + 'productos/${codigo}', {method: 'DELETE' }).
  borrarData("pelicula/" + codigo, "DELETE", "Error al eliminar pelicula", "Pelicula eliminada correctamente")
}

// Cuando la página se carga, llama a obtenerPeliculas para cargar la lista de peliculas.
document.addEventListener("DOMContentLoaded", obtenerPeliculas);