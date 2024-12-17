// Obtener los parámetros de la URL
const params = new URLSearchParams(window.location.search);
const codigo = params.get('id');
const URL = "http://127.0.0.1:5000/"
// `https://tu-backend-pythonanywhere.com/api/pelicula/${id}`

// Asegúrate de que el ID esté presente
if (codigo) {
    fetch(URL + "pelicula/" + codigo)
        .then(response => response.json())
        .then(data => {
            if (data.error) {
                document.getElementById("detalles").innerHTML = "Pelicula no encontrada";
            } else {
                const videoUrl = data.trailer_url; 
                const video_id = videoUrl.split('v=')[1].split('&')[0];
                const video_embed_url = `https://www.youtube.com/embed/${video_id}`;
                // Llenar los campos de la plantilla con los datos obtenidos
                document.getElementById("titulo-pestaña").textContent = `${data.nombre_pelicula} - CaC`
                document.getElementById("titulo_detalle").textContent = data.nombre_pelicula;
                document.getElementById("duracion_detalle").innerText = `Duracion: ${data.duracion} min`;
                document.getElementById("genero_detalle").innerText = `Genero: ${data.genero_pelicula}`;
                document.getElementById("director_detalle").innerText = `Director: ${data.director}`;
                document.getElementById("clasificacion_detalle").innerText = `Clasifcacion: ${data.clasificacion}`;
                document.getElementById("sinopsis_detalle").innerText = data.sinopsis;
                document.getElementById("imagen_detalle").src = `/static/imagenes/${data.imagen_url}`;
                document.getElementById("imagen_detalle").alt = `Imagen de ${data.nombre}`;
                document.getElementById("trailer_detalle").src = video_embed_url;
            }
        })
        .catch(error => {
            console.error('Error:', error);
            document.getElementById("detalles").innerHTML = "Error al cargar los detalles de la película.";
        });
} else {
    document.getElementById("detalles").innerHTML = "ID de película no proporcionado.";
}
