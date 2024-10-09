const URL = "http://127.0.0.1:5000/";

document.getElementById("loginForm").addEventListener("submit", function(event){
    event.preventDefault();

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    fetch(URL + "login",
        {method : "POST",
        headers: {
        "Content-Type": "application/json"
        },
        body: JSON.stringify({email: email, password: password})
    })
    .then(function(response){
        if (response.ok){
            return response.json();
        } else{
            throw new Error("Error al iniciar sesion")
        }
    })
    .then(function (data) {
        // Aquí puedes manejar los datos JSON recibidos del servidor
        console.log("Success:", data);

        localStorage.setItem("userLoggedIn", true);
        //window.location.href = "index.html";
    })
    .catch(function (error) {
        // Código para manejar errores
        console.error("Error al iniciar sesion:", error);
    });
});