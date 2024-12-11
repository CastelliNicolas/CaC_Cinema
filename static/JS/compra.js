import { recibirData } from "./shared_modules/apiFeedbackHandler.js";
import { fillSelectArray } from "./shared_modules/utils.js";
// Variables
const peliculasArray = []
const cinesDisponibles = []
let nombre = "";
let genero = "";
let director = "";
let duracion = "";
let trailer_url = "";
let clasificacion = "";
let sinopsis = "";
let imagen_url = "";

function obtenerPeliculas(){
  // Obtener peliculas de cartelera
  recibirData("pelicula", "GET", "Error al obtener peliculas (SELECT)", "Peliculas cargadas en (SELECT)")
    .then((data) => {
      for(let pelicula of data){
          peliculasArray.push(pelicula)
          console.log(pelicula)
        }
        fillSelectArray(peliculasArray, "selection-movie", "nombre_pelicula")
    })
    .catch(function (error) {
      // Código para manejar errores
      console.error("Error al obtener las películas:", error);
    });
}

function obtenerCines(){
  //Obtener cines disponibles
  recibirData("cine", "GET", "Error al obtener cines (SELECT)", "Cines cargados en (SELECT)")
  .then((data) => {
    for(let cine of data){
      cinesDisponibles.push(cine);
      console.log(cine)
    }
    fillSelectArray(cinesDisponibles, "selection-cine", "nombre_cine")
  })
}

function obtenerFunciones(){
  let select = document.getElementById("selection-horario")
  select.options.length = 1;
  recibirData("funcion", "GET", "Error al obtener funciones (SELECT)", "Funciones disponibles")
  .then((data) => {
    for(let funcion of data){
      if(funcion.funcion_pelicula == nombre){
        console.log("CARGAR SELECT FUNCIONES")
        let option = document.createElement("option")
        let [dia, mes, año] = funcion.fecha.split("/")
        option.value = funcion.codigo
        option.text = `${dia}/${mes} - ${funcion.horario}`
        select.appendChild(option);
      }
    }
  })
}

document.addEventListener("DOMContentLoaded", obtenerPeliculas)
document.addEventListener("DOMContentLoaded", obtenerCines)

// Obtener la informacion de la pelicula seleccionada
function obtenerInformacionPelicula() {
  let idPelicula = document.getElementById("selection-movie").value;
  for(let pelicula of peliculasArray){
    if(pelicula.codigo == idPelicula){
      console.log("CARGANDO PELICULA...")
      nombre = pelicula.nombre_pelicula;
      genero = pelicula.genero_pelicula;
      duracion = pelicula.duracion;
      director = pelicula.director;
      clasificacion = pelicula.clasificacion;
      imagen_url = pelicula.imagen_url;
      sinopsis = pelicula.sinopsis;
      mostrarInformacionPelicula()
    }
  };
}


// Mostrar la informacion de la pelicula seleccionada
function mostrarInformacionPelicula(){
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

document.getElementById("selection-movie").addEventListener("change", obtenerInformacionPelicula)
document.getElementById("selection-movie").addEventListener("change", obtenerFunciones)
// Verificacion de compra //
let selectCine = document.getElementById("selection-cine");
let selectFilm = document.getElementById("selection-movie");
let selectHour = document.getElementById("selection-horario");
let buttonBuy = document.getElementById("btn-comprar");
const userLoggedIn = localStorage.getItem("userLoggedIn");
function verificarSelection() {
  if (selectCine.value && selectFilm.value && selectHour.value) {
    console.log("TRUE");
    buttonBuy.classList.remove("disable");
    if(userLoggedIn){
      buttonBuy.setAttribute("href", "pago.html");
    } else{
      buttonBuy.setAttribute("href", "sesion.html");
      localStorage.setItem("rutaPosteriorLogin", "/pago.html");
    }
  }
}
selectCine.addEventListener("change", verificarSelection);
selectFilm.addEventListener("change", verificarSelection);
selectHour.addEventListener("change", verificarSelection);