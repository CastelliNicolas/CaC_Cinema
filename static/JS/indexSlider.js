// Inicializa el índice de la diapositiva
let currentSlide = 1;
const totalSlides = 3; // Cambia este valor si tienes más diapositivas
// Función para cambiar la diapositiva
function changeSlide() {
  // Incrementa el índice de la diapositiva
  currentSlide = (currentSlide % totalSlides) + 1;
  
  // Marca el input correspondiente a la diapositiva
  document.getElementById('slide-' + currentSlide).checked = true;
}
// Cambia la diapositiva automáticamente cada 3 segundos
setInterval(changeSlide, 10000); // Cambia el valor (3000) para ajustar el tiempo (3 segundos)
