import { recibirData, enviarData } from "/static/JS/shared_modules/apiFeedbackHandler.js";
// Variables de estado para controlar la visibilidad y los datos del formulario
let codigo = "";
let nombre = "";
let genero = "";
let director = "";
let duracion = "";
let trailer_url = "";
let clasificacion = "";
let sinopsis = "";
let imagen_url = "";
let imagenSeleccionada = null;
let imagenUrlTemp = null;
let mostrarDatosProducto = false;

document.getElementById("form-obtener-pelicula").addEventListener("submit", obtenerPelicula);
document.getElementById("form-guardar-cambios").addEventListener("submit", guardarCambios);
document.getElementById("nuevaImagen").addEventListener("change", seleccionarImagen);

// Se ejecuta cuando se envía el formulario de consulta. Realiza una solicitud GET a la API y obtiene los datos del producto correspondiente al código ingresado.
function obtenerPelicula(event) {
  event.preventDefault();
  codigo = document.getElementById("codigo").value;
  recibirData("pelicula/" + codigo, "GET", "Error al obtener la pelicula: " + codigo, "Pelicula obtenida correctamente")
    .then((data) => {
      nombre = data.nombre_pelicula;
      genero = data.genero_pelicula;
      director = data.director;
      duracion = data.duracion;
      clasificacion = data.clasificacion;
      trailer_url = data.trailer_url;
      sinopsis = data.sinopsis;
      imagen_url = data.imagen_url;
      mostrarDatosProducto = true; //Activa la vista del segundo formulario
      mostrarFormulario();
    })
    .catch(() => {
      console.error("TEST ERROR: PELICULA NO ENCONTRADA")
    })
}

// Muestra el formulario con los datos de la pelicula
function mostrarFormulario() {
  if (mostrarDatosProducto) {
    document.getElementById("nombre").value = nombre;
    document.getElementById("genero").value = genero;
    document.getElementById("director").value = director;
    document.getElementById("duracion").value = duracion;
    document.getElementById("clasificacion").value = clasificacion;
    document.getElementById("trailer").value = trailer_url;
    document.getElementById("sinopsis").value = sinopsis;

    const imagenActual = document.getElementById("imagen-actual");
    if (imagen_url && !imagenSeleccionada) {
      // Verifica si imagen_url no está vacía y no se ha seleccionado una imagen

      imagenActual.src = "/static/imagenes/" + imagen_url;
      //Al subir al servidor, deberá utilizarse la siguiente ruta. USUARIO debe ser reemplazado por el nombre de usuario de Pythonanywhere
      //https://www.pythonanywhere.com/user/Sinost/files/home/Sinost/mysite/static/imagenes/
      //imagenActual.src = 'https://www.pythonanywhere.com/user/USUARIO/files/home/USUARIO/mysite/static/imagenes/' + imagen_url;
      imagenActual.style.display = "block"; // Muestra la imagen actual
    } else {
      imagenActual.style.display = "none"; // Oculta la imagen si no hay URL
    }

    document.getElementById("datos-pelicula").style.display = "block";
  } else {
    document.getElementById("datos-pelicula").style.display = "none";
  }
}

// Se activa cuando el usuario selecciona una imagen para cargar.
function seleccionarImagen(event) {
  const file = event.target.files[0];
  imagenSeleccionada = file;
  imagenUrlTemp = URL.createObjectURL(file); // Crea una URL temporal para la vista previa

  const imagenVistaPrevia = document.getElementById("imagen-vista-previa");
  imagenVistaPrevia.src = imagenUrlTemp;
  imagenVistaPrevia.style.display = "block";
}

// Se usa para enviar los datos modificados del producto al servidor.
function guardarCambios(event) {
  event.preventDefault();

  const formData = new FormData();
  formData.append("codigo", codigo);
  formData.append("nombre", document.getElementById("nombre").value);
  formData.append("genero", document.getElementById("genero").value);
  formData.append("director", document.getElementById("director").value);
  formData.append("duracion", document.getElementById("duracion").value);
  formData.append("clasificacion", document.getElementById("clasificacion").value);
  formData.append("trailer", document.getElementById("trailer").value);
  formData.append("sinopsis", document.getElementById("sinopsis").value);

  // Si se ha seleccionado una imagen nueva, la añade al formData.
  if (imagenSeleccionada) {
    formData.append("imagen", imagenSeleccionada, imagenSeleccionada.name);
  }

  enviarData("pelicula/" + codigo, "PUT", formData, "Error al modificar pelicula", "Pelicula modificada correctamente")
    .then(() => {
      limpiarFormulario();
    });
}

// Restablece todas las variables relacionadas con el formulario a sus valores iniciales, lo que efectivamente "limpia" el formulario.
function limpiarFormulario() {
  document.getElementById("codigo").value = "";
  document.getElementById("nombre").value = "";
  document.getElementById("genero").value = "";
  document.getElementById("director").value = "";
  document.getElementById("duracion").value = "";
  document.getElementById("nuevaImagen").value = "";
  document.getElementById("trailer").value = "";
  document.getElementById("clasificacion").value = "";
  document.getElementById("sinopsis").value = "";
  
  const imagenActual = document.getElementById("imagen-actual");
  imagenActual.style.display = "none";

  const imagenVistaPrevia = document.getElementById("imagen-vista-previa");
  imagenVistaPrevia.style.display = "none";

  codigo = "";
  nombre = "";
  genero = "";
  director = "";
  duracion = "";
  trailer_url = "";
  clasificacion = "";
  sinopsis = "";
  imagen_url = "";
  imagenSeleccionada = null;
  imagenUrlTemp = null;
  mostrarDatosProducto = false;

  document.getElementById("datos-pelicula").style.display = "none";
}
