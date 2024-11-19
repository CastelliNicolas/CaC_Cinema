import { recibirData, borrarData } from "../api.js";

let msgEx = "Cines obtenidos correctamente.";
let msgErr = "Error al obtener cines.";

document.addEventListener("DOMContentLoaded", cargarCines);

function cargarCines(){
    recibirData("cine", "GET", msgErr, msgEx)
    .then((data) => {
        const cinesTable = document.getElementById("cines-table").getElementsByTagName("tbody")[0];
        cinesTable.innerHTML = ""; // Limpia la tabla antes de insertar nuevos datos
        data.forEach((cines) => {
          const row = cinesTable.insertRow();
          row.innerHTML = `
                       <td class="elementos">${cines.codigo}</td>
                       <td class="elementos">${cines.nombre_cine}</td>
                       <td class="elementos">${cines.direccion}</td>
                       <td class="elementos">${cines.cant_salas}</td>
                       <td class="elementos formulario"><button class="formulario-input volver" onclick="eliminarCine('${cines.codigo}')">Eliminar</button></td>
                   `;
        });
    })
    .catch(error => {
        console.error("Error al cargar cines:", error);
    });
}

window.eliminarCine = function(codigo){
    console.log("Código a eliminar:", codigo);
    borrarData(`cine/${codigo}`, "DELETE", "Err", "SUCC")
    .then(() => {
        cargarCines()
    })
    .catch(error => {
        console.error("Error al eliminar cine:", error);
    })
}