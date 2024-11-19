// URL base de la API
const URL = "http://127.0.0.1:5000/"
//const URL = "https://sinost.pythonanywhere.com/";

// Realizamos la solicitud GET al servidor para obtener todas las películas.
fetch(URL + "pelicula")
  .then((response) => {
    if (response.ok) {
      return response.json();
    } else {
      throw new Error("Error al obtener las películas.");
    }
  })
  .then((data) => {
    let container = document.getElementById("peliculas-container");

    // Iteramos sobre cada película y generamos un elemento <figure> dinámicamente
    for (let pelicula of data) {
      let figure = document.createElement("figure");
      figure.className = "cartelera-figure";

      // El codigo siguiente se reemplaza a la hora de conectar con python anywhere
      //<img src=https://www.pythonanywhere.com/user/Sinost/files/home/Sinost/mysite/static/imagenes/${pelicula.imagen_url} />
      //<a href="https://codocinema.netlify.app/${pelicula.detalle}.html">
      figure.innerHTML = `
        <a href="http://127.0.0.1:5500/front/detalles.html?id=${pelicula.codigo}">
            <img src=/static/imagenes/${pelicula.imagen_url} />
            <figcaption>${pelicula.nombre}</figcaption>
        </a>`;
      // Añadimos la nueva figura al contenedor
      container.appendChild(figure);
    }
  })
  .catch(function (error) {
    // Código para manejar errores
    console.error("Error al obtener las películas:", error);

    // Obtener el elemento por su ID y mostrar el mensaje de error
    let mensajeErrorElemento = document.getElementById("mensajeError");

    if (mensajeErrorElemento) {
      mensajeErrorElemento.textContent = "No se pudieron cargar las películas.";
      mensajeErrorElemento.style.color = "red"; // Opcional: estilo para el mensaje de error
      mensajeErrorElemento.style.textAlign = "center"; // Opcional: estilo para el mensaje de error
    } else {
      console.error("Elemento con id 'mensajeError' no encontrado en el DOM.");
    }
  });
