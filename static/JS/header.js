let header = `<button id="abrir" class="abrir-menu"><i class="bi bi-list"></i></button>
<nav class="nav" id="nav">
  <button class="cerrar-menu" id="cerrar"><i class="bi bi-x"></i></button>
  <div class="navLogo">
    <a href="index.html"><img class="logo" src="/static/imagenes/LogoCine.jpeg" alt="logo cine" /></a>
    <h1>Codo Cinema</h1>
  </div>
  <ul class="nav-list">
    <li><a href="index.html">Inicio</a></li>
    <li><a href="cartelera.html">Cartelera</a></li>
    <li><a href="compra.html">Comprar Entrada</a></li>
    <li><a href="precio.html">Precios y Salas</a></li>
    <li><a href="nosotros.html">Nosotros</a></li>
    <li><a href="contacto.html">Contacto</a></li>
  </ul>
  <div class="navLogin">
    <a href="sesion.html" id="login-button"> <img class="login-icon" src="/static/imagenes/login.png" alt="logo inicio sesion" /> Iniciar Sesion</a>
    <a href="perfil.html" id="profile-button" class="profile-button" style="display:none;"><img class="profile-icon" src="/static/imagenes/user_icon.svg" alt="logo perfil" /> Perfil
    </a>
  </div>
</nav>`;

document.getElementById("idHeader").innerHTML = header;

// Login //
document.addEventListener("DOMContentLoaded", function() {
  // Verificar si el usuario está logueado
  const userLoggedIn = localStorage.getItem("userLoggedIn"); // Verificar si el usuario está logueado
  const loginButton = document.getElementById("login-button");
  const profileButton = document.getElementById("profile-button");

  if (userLoggedIn) {
      // Cambiar el botón de "Iniciar sesión" por "Perfil"
      loginButton.style.display = "none";
      profileButton.style.display = "flex";
  } else{
     // Si no está logueado, mostrar el botón de iniciar sesión
     //loginButton.style.display = "inline-block";
     profileButton.style.display = "none";
  }
});
