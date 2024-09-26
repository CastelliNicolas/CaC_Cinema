const nav = document.querySelector("#nav");
const abrir = document.querySelector("#abrir");
const cerrar = document.querySelector("#cerrar");

abrir.addEventListener("click", () => {
  nav.classList.add("visible");
});

cerrar.addEventListener("click", () => {
  nav.classList.remove("visible");
});

<<<<<<< HEAD


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
=======
// Compra //
let selectCine = document.getElementById("selection-cine");
let selectFilm = document.getElementById("selection-peli");
let selectHour = document.getElementById("selection-horario");
let buttonBuy = document.getElementById("btn-comprar");
function verificarSelection() {
  if (selectCine.value && selectFilm.value && selectHour.value) {
    console.log("TRUE");
    buttonBuy.classList.remove("disable");
    buttonBuy.setAttribute("href", "sesion.html");
  }
}
selectCine.addEventListener("change", verificarSelection);
selectFilm.addEventListener("change", verificarSelection);
selectHour.addEventListener("change", verificarSelection);

function mostrarInfo() {
  let pelicula = document.getElementById("selection-peli").value;
  let info = document.getElementById("compraInfo");
  let portadaImg = document.getElementById("portadaImagen");
  let titulo = document.getElementById("tituloFilm");
  let infoGen = document.getElementById("infoGen");
  let infoDur = document.getElementById("infoDur");
  let infoDir = document.getElementById("infoDir");
  let infoAct = document.getElementById("infoAct");
  let infoSinop = document.getElementById("sinopFilm");
  switch (pelicula) {
    case "Film 1":
      titulo.textContent = "Forrest Gump";
      info.style.display = "grid";
      portadaImg.src = "/static/imagenes/forest.jpg";
      infoGen.textContent = "Comedia, Drama, Romántico";
      infoDur.textContent = "2h 20min";
      infoDir.textContent = "Robert Zemeckis";
      infoAct.textContent = "Tom Hanks, Gary Sinise, Robin Wright";
      infoSinop.textContent =
        "Al tener el coeficiente intelectual de un niño, Forrest Gump siempre ha sido considerado el “tonto” de clase. Bajo las faldas de su madre se siente protegido y junto a su amiga Jenny es feliz, aunque en su propio mundo. Un problema en su columna vertebral no le impide convertirse en un ágil corredor. Ya más mayor, Forrest luchará en la guerra de Vietnam y conocerá al mismísimo presidente de los Estados Unidos. Llegará a ser muy rico, pero para Forrest hay algo que no cambia: el amor de su vida es y será Jenny.";
      break;
    case "Film 2":
      info.style.display = "grid";
      portadaImg.src = "/static/imagenes/gladiador.jpg";
      titulo.textContent = "Gladiador";
      infoGen.textContent = "Acción, Aventura, Histórico";
      infoDur.textContent = "2h 35min";
      infoDir.textContent = "Ridley Scott";
      infoAct.textContent = "Russell Crowe, Joaquin Phoenix, Connie Nielsen";
      infoSinop.textContent =
        "En el año 180 el Imperio Romano controla todo el mundo conocido hasta la fecha. Máximo, interpretado por el ya conocido Russell Crowe, es un General romano muy importante para el Emperador Marco Aurelio, pues sólo él ha conseguido victoria tras victoria, destacando por su valentía, dedicación y lealtad al Imperio. Cómodo, el hijo de Marco Aurelio, está celoso del prestigio de Máximo y del amor que le profesa su padre, así que cuando asume el poder de manera inesperada, ordena el arresto y la ejecución del general. Máximo consigue escapar de sus opresores, pero no puede impedir que asesinen a su familia. Posteriormente, es capturado por un mercader de esclavos y se convierte en gladiador, preparándose para su venganza.";
      break;
    case "Film 3":
      info.style.display = "grid";
      titulo.textContent = "Rápido Y Furioso";
      portadaImg.src = "/static/imagenes/rapido.webp";
      infoGen.textContent = "Acción, Crimen";
      infoDur.textContent = "1h 47min";
      infoDir.textContent = "Rob Cohen";
      infoAct.textContent = "Paul Walker, Vin Diesel, Michelle Rodriguez";
      infoSinop.textContent =
        "La vida de Dominic Toretto (Vin Diesel) está marcada día y noche por la velocidad. Durante el día prepara y tunea coches de carreras de alta gama, mejora sus prestaciones y los embellece. Al caer la noche se organizan competiciones ilegales donde muchos candidatos se enfrentan sin contemplaciones bajo la intensa mirada de sus groupies. Dominic Toretto compite en ellas con su propio bólido a 280 kilómetros por hora, consiguiendo numerosas sumas de dinero gracias a sus victorias.\nSin embargo, existe una banda de delincuentes muy misteriosa que roba camiones en marcha desde vehículos deportivos. Este hecho hace que la policía infiltre a uno de sus hombres dentro de las carreras ilegales para investigar a posibles sospechosos. Brian (Paul Walker) es el encargado de infiltrarse en la banda de Toretto, la que figura junto a la de su rival Johnny Tran como principales sospechosos. Rápidamente se ganará la confianza de Toretto, pero todo se complicará cuando aparezca su hermana y se enamora de ella.";
      break;
  }
}
>>>>>>> parent of dbb0739 (Conectado de compra con api peliculas en cartelera)
