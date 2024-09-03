const URL = "http://127.0.0.1:5000/"
//const URL = "https://sinost.pythonanywhere.com/";
//Al subir al servidor, deberá utilizarse la siguiente ruta. USUARIO debe ser reemplazado por el nombre de usuario de Pythonanywhere
//const URL = "https://USUARIO.pythonanywhere.com/"

// Capturamos el evento de envío del formulario
document.getElementById("formulario").addEventListener("submit", function (event) {
  event.preventDefault(); // Evitamos que se envie el form

  var formData = new FormData(this);

  // Realizamos la solicitud POST al servidor
  fetch(URL + "pelicula", {
    method: "POST",
    body: formData, // Aquí enviamos formData. Dado que formData puede contener archivos, no se utiliza JSON.
  })
    //Después de realizar la solicitud POST, se utiliza el método then() para manejar la respuesta del servidor.
    .then(function (response) {
      if (response.ok) {
        //Si la respuesta es exitosa, convierte los datos de la respuesta a formato JSON.
        return response.json();
      } else {
        // Si hubo un error, lanzar explícitamente una excepción
        // para ser "catcheada" más adelante
        throw new Error("Error al agregar la pelicula.");
      }
    })

    //Respuesta OK, muestra una alerta informando que la pelicula se agregó correctamente y limpia los campos del formulario para que puedan ser utilizados para un nuevo producto.
    .then(function (data) {
      let mensajeErrorElemento = document.getElementById("mensajeError");

      if (mensajeErrorElemento) {
        mensajeErrorElemento.textContent = "Pelicula agregada";
        mensajeErrorElemento.style.color = "red"; // Opcional: estilo para el mensaje de error
        mensajeErrorElemento.style.textAlign = "center"; // Opcional: estilo para el mensaje de error
      }
    })

    // En caso de error, mostramos una alerta con un mensaje de error.
    .catch(function (error) {
      // Código para manejar errores
      console.error("Error al obtener las películas:", error);

      // Obtener el elemento por su ID y mostrar el mensaje de error
      let mensajeErrorElemento = document.getElementById("mensajeError");

      if (mensajeErrorElemento) {
        mensajeErrorElemento.textContent = "No se pudo agregar la pelicula";
        mensajeErrorElemento.style.color = "red"; // Opcional: estilo para el mensaje de error
        mensajeErrorElemento.style.textAlign = "center"; // Opcional: estilo para el mensaje de error
      } else {
        console.error("Elemento con id 'mensajeError' no encontrado en el DOM.");
      }
    })

    // Limpiar el formulario en ambos casos (éxito o error)
    .finally(function () {
      document.getElementById("nombre").value = "";
      document.getElementById("genero").value = "";
      document.getElementById("director").value = "";
      document.getElementById("duracion").value = "";
      document.getElementById("imagen").value = "";
      document.getElementById("trailer").value = "";
      document.getElementById("clasificacion").value = "";
      document.getElementById("sinopsis").value = "";
    });
});
