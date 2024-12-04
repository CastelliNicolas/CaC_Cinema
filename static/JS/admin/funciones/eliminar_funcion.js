import { recibirData, borrarData} from "/static/JS/shared_modules/apiFeedbackHandler.js";


// Obtiene el contenido del inventario
function obtenerFunciones() {
  recibirData("funcion", "GET", "Error al obtener las funciones", "Funciones obtenidas correctamente.")
    .then((data) => {
      const funcionesTable = document.getElementById("funciones-table").getElementsByTagName("tbody")[0];
      funcionesTable.innerHTML = ""; // Limpia la tabla antes de insertar nuevos datos
      data.forEach((funciones) => {
        const row = funcionesTable.insertRow();
        row.innerHTML = `
        <td class="elementos">${funciones.codigo}</td>
        <td class="elementos">${funciones.funcion_pelicula}</td>
        <td class="elementos">${funciones.fecha}</td>
        <td class="elementos">${funciones.horario}</td>
        <td class="elementos formulario"><button class="formulario-input volver" onclick="eliminarFuncion('${funciones.codigo}')">Eliminar</button></td>
        `;
      });
    });
};

// Se utiliza para eliminar una funcion.
window.eliminarFuncion = function(codigo) {
  borrarData("funcion/" + codigo, "DELETE", "Error al eliminar funcion", "Funcion eliminada exitosamente.")
  .then(() => {
    obtenerFunciones()
  });
};
// Cuando la página se carga, llama a obtenerFunciones para cargar la lista de funciones.
document.addEventListener("DOMContentLoaded", obtenerFunciones);