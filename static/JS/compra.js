const URL = "http://127.0.0.1:5000/"

// Variables
let nombre = "";
let genero = "";
let director = "";
let duracion = "";
let trailer_url = "";
let clasificacion = "";
let sinopsis = "";
let imagen_url = "";


// Obtener peliculas de cartelera
fetch(URL + "pelicula")
  .then((response) => {
    if (response.ok) {
      return response.json();
    } else {
      throw new Error("Error al obtener las películas.(Select)");
    }
  })
  .then((data) => {
    let select = document.getElementById("selection-movie");
    for(let pelicula of data){
        let option = document.createElement("option");
        option.value = pelicula.codigo;
        option.text = pelicula.nombre
        select.appendChild(option);
        }
    })

  .catch(function (error) {
      // Código para manejar errores
      console.error("Error al obtener las películas:", error);
  })

// Obtener la informacion de la pelicula seleccionada
function obtenerInfo() {
  let idPelicula = document.getElementById("selection-movie").value;
  fetch(URL + "pelicula/" + idPelicula)
    .then((response) =>{
        if(response.ok){
            return response.json();
        } else{
            throw new Error("Error al obtener los datos de la pelicula.(Info)");
        }
    })
    .then((data) =>{
        nombre = data.nombre;
        genero = data.genero;
        duracion = data.duracion;
        director = data.director;
        clasificacion = data.clasificacion;
        imagen_url = data.imagen_url;
        sinopsis = data.sinopsis;
        mostrarInfo();
    })
    .catch((error) =>{
        console.error("Error al obtener las películas:", error);
    })
}


// Mostrar la informacion de la pelicula seleccionada
function mostrarInfo(){
    let info = document.getElementById("compraInfo");
    info.style.display = "grid";
    const img = document.getElementById("portadaImagen");
    img.src = "./static/imagenes/" + imagen_url;
    document.getElementById("tituloFilm").textContent = nombre;
    document.getElementById("infoGen").textContent = genero;
    document.getElementById("infoDur").textContent = duracion;
    document.getElementById("infoDir").textContent = director;
    document.getElementById("infoCla").textContent = clasificacion;
    document.getElementById("sinopFilm").textContent = sinopsis;
}

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
    }
  }
}
selectCine.addEventListener("change", verificarSelection);
selectFilm.addEventListener("change", verificarSelection);
selectHour.addEventListener("change", verificarSelection);