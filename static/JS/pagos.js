import { recibirData } from "./shared_modules/apiFeedbackHandler.js";

function convertirFecha(fecha) {
  const date = new Date(fecha);
  const año = date.getFullYear();
  const mes = String(date.getMonth() + 1).padStart(2, "0");
  const dia = String(date.getDate()).padStart(2, "0");
  return `${mes}-${dia}`;
}
// Acumuladores
let totalEntradas = 0;
let totalPagar = 0;

let btn1 = document.getElementById("button-1")
let btn2 = document.getElementById("button-2")
let btn3 = document.getElementById("button-3")
const botones = document.querySelectorAll('.tarjeta-entrada');
const btnSiguiente = document.getElementById("btn-siguiente")
const btnDeshacer = document.getElementById("btn-deshacer-entradas")

function obtenerFuncion(){
  const funcionId = sessionStorage.getItem("idFuncionSeleccionada");
  recibirData("funcion/" + funcionId, "GET", "Error al obtener la funcion", "Funcion obtenida")
  .then((data) => {
    document.getElementById("titulo-pelicula").textContent = data.funcion_pelicula
    document.getElementById("imagen-pelicula").src = `/static/imagenes/${data.funcion_pelicula_imagen}`;
    document.getElementById("nombre-cine").textContent = data.funcion_cine
    document.getElementById("direccion-cine").textContent = data.funcion_cine_direccion
    document.getElementById("funcion-sala").textContent = `Sala ${data.sala}`
    document.getElementById("funcion-fecha-horario").textContent = `${convertirFecha(data.fecha)} ${data.horario}`
  })
}



document.addEventListener("DOMContentLoaded", obtenerFuncion)






// Asociar eventos a cada botón
btn1.addEventListener('click', () => {
  totalEntradas += 1; // Sumar una entrada
  totalPagar += 5550; // Sumar precio correspondiente
  actualizarTotales();
});

btn2.addEventListener('click', () => {
  totalEntradas += 2; // Sumar dos entradas
  totalPagar += 9990; // Sumar precio correspondiente
  actualizarTotales();
});

btn3.addEventListener('click', () => {
  totalEntradas += 3; // Sumar tres entradas
  totalPagar += 15500; // Sumar precio correspondiente
  actualizarTotales();
});

btnDeshacer.addEventListener("click", () => {
  totalEntradas = 0;
  totalPagar = 0;
  actualizarTotales();
})


// Función para actualizar los totales en el DOM
function actualizarTotales() {
  document.getElementById('cantidad-entradas').textContent = totalEntradas;
  document.getElementById('total-pagar').textContent = `$${totalPagar}`;

  if(totalEntradas> 0){
    btnSiguiente.setAttribute("href", "/front/pagos_asientos.html")
  } else{
    btnSiguiente.removeAttribute("href")
  }

  if(totalEntradas >= 3){
    botones.forEach( btn => {
        btn.classList.add("disable")
        btn.setAttribute("disabled", "")
    })
  } else{
    botones.forEach(btn => {
      btn.classList.remove("disable")
      btn.removeAttribute("disabled")
    })
  }
}
