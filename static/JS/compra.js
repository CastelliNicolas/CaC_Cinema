import { recibirData } from "./shared_modules/apiFeedbackHandler.js";
import {
  fillSelectArray,
  fillArray,
  findElement,
} from "./shared_modules/utils.js";
// Variables
let peliculasDisponibles = [];
let cinesDisponibles = [];
let nombre = "";
let genero = "";
let director = "";
let duracion = "";
let trailer_url = "";
let clasificacion = "";
let sinopsis = "";
let imagen_url = "";

let selectCine = document.getElementById("selection-cine");
let selectFilm = document.getElementById("selection-movie");
let selectHour = document.getElementById("selection-horario");
let buttonBuy = document.getElementById("btn-comprar");

function obtenerPeliculas() {
  // Obtener peliculas de cartelera
  fillArray("pelicula")
    .then((peliculasObtenidas) => {
      console.log(peliculasObtenidas);
      peliculasDisponibles = peliculasObtenidas;
      fillSelectArray(
        peliculasDisponibles,
        "selection-movie",
        "nombre_pelicula"
      );
    })
    .catch(function (error) {
      // Código para manejar errores
      console.error(error);
    });
}

function obtenerCines() {
  //Obtener cines disponibles
  fillArray("cine")
    .then((cinesObtenidos) => {
      cinesDisponibles = cinesObtenidos;
      fillSelectArray(cinesDisponibles, "selection-cine", "nombre_cine");
    })
    .catch(function (error) {
      // Código para manejar errores
      console.error(error);
    });
}

function loadSelectsPeliculaCine() {
  obtenerPeliculas();
  obtenerCines();
}

function obtenerFunciones() {
  selectHour.options.length = 1;
  recibirData(
    "funcion",
    "GET",
    "Error al obtener funciones (SELECT)",
    "Funciones disponibles"
  ).then((data) => {
    for (let funcion of data) {
      if (funcion.funcion_pelicula == nombre) {
        console.log("CARGAR SELECT FUNCIONES");
        let option = document.createElement("option");
        let [dia, mes, año] = funcion.fecha.split("/");
        option.value = funcion.codigo;
        option.text = `${dia}/${mes} - ${funcion.horario}`;
        selectHour.appendChild(option);
      }
    }
  });
}

function obtenerInformacionPelicula() {
  let idPelicula = document.getElementById("selection-movie").value;
  let peliculaEncontrada = findElement(peliculasDisponibles, idPelicula);
  console.log("CARGANDO PELICULA...");
  nombre = peliculaEncontrada.nombre_pelicula;
  genero = peliculaEncontrada.genero_pelicula;
  duracion = peliculaEncontrada.duracion;
  director = peliculaEncontrada.director;
  clasificacion = peliculaEncontrada.clasificacion;
  imagen_url = peliculaEncontrada.imagen_url;
  sinopsis = peliculaEncontrada.sinopsis;
  mostrarInformacionPelicula();
}

// Mostrar la informacion de la pelicula seleccionada
function mostrarInformacionPelicula() {
  let info = document.getElementById("compraInfo");
  info.style.display = "grid";
  const img = document.getElementById("portadaImagen");
  img.src = "/static/imagenes/" + imagen_url;
  document.getElementById("tituloFilm").textContent = nombre;
  document.getElementById("infoGen").textContent = genero;
  document.getElementById("infoDur").textContent = duracion;
  document.getElementById("infoDir").textContent = director;
  document.getElementById("infoCla").textContent = clasificacion;
  document.getElementById("sinopFilm").textContent = sinopsis;
}

document.addEventListener("DOMContentLoaded", loadSelectsPeliculaCine);
document
  .getElementById("selection-movie")
  .addEventListener("change", obtenerInformacionPelicula);
document
  .getElementById("selection-movie")
  .addEventListener("change", obtenerFunciones);

// Verificacion de compra //
const userLoggedIn = localStorage.getItem("userLoggedIn");
function verificarSelection() {
  if (selectCine.value && selectFilm.value) {
    selectHour.removeAttribute("disabled");
  }
  if (selectCine.value && selectFilm.value && selectHour.value) {
    console.log("TRUE");
    buttonBuy.classList.remove("disable");
    if (userLoggedIn) {
      buttonBuy.setAttribute("href", "pago.html");
    } else {
      buttonBuy.setAttribute("href", "sesion.html");
      localStorage.setItem("rutaPosteriorLogin", "/pago.html");
    }
  }
}
selectCine.addEventListener("change", verificarSelection);
selectFilm.addEventListener("change", verificarSelection);
selectHour.addEventListener("change", verificarSelection);
