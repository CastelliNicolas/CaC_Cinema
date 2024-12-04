const URL = "http://127.0.0.1:5000/";

document.getElementById("formulario_user").addEventListener("submit", function (event) {
    event.preventDefault(); // Evitamos que se envíe el formulario

    const formData = new FormData(this);

    fetch(URL + "usuario", {
        method: "POST",
        body: formData // Enviamos el FormData directamente
    })
    .then(function (response) {
        if (response.ok) {
            // Si la respuesta es exitosa, convierte los datos de la respuesta a formato JSON.
            return response.json();
        } else {
            // Si hubo un error, lanzar explícitamente una excepción
            // para ser "catcheada" más adelante
            throw new Error("Error al agregar el usuario.");
        }
    })
    .then(function (data) {
        // Aquí puedes manejar los datos JSON recibidos del servidor
        console.log("Success:", data);
    })
    .catch(function (error) {
        // Código para manejar errores
        console.error("Error al agregar el usuario:", error);
    });
});
