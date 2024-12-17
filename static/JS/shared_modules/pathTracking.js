document.addEventListener("DOMContentLoaded", () => {
    console.log("YES")
    
    const currentPath = window.location.pathname;
    
    console.log("Current Path", currentPath)
    // Rutas donde se debe mantener `rutaPosteriorLogin`
    const allowedPaths = ["/front/sesion.html", "/front/registrarse.html", "/front/login.html"];
  
    // Si no estamos en las rutas permitidas, borrar la clave
    if (!allowedPaths.includes(currentPath)) {
      localStorage.removeItem("rutaPosteriorLogin");
      console.log("BORRADO RUTA POSTERIOR")
    }
  });
  