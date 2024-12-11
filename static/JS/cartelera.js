import { recibirData } from "./shared_modules/apiFeedbackHandler.js";

// Realizamos la solicitud GET al servidor para obtener todas las películas.
recibirData("pelicula", "GET", "Error al obtener peliculas", "Peliculas obtenidas")
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
            <figcaption>${pelicula.nombre_pelicula}</figcaption>
        </a>`;
      // Añadimos la nueva figura al contenedor
      container.appendChild(figure);
    }
});
