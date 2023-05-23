// se obtiene el formulario
const formulario_recuperacion = document.getElementById(
  "formulario-recuperacion"
);

// se obtiene el campo email
const email = document.getElementById("email");

// se añade el evento submit al formulario
formulario_recuperacion.addEventListener("submit", (e) => {
  // se cancela el envio del formulario
  e.preventDefault();
  // se comprueba que los campos no esten vacios
  if (email.value === "") {
    // se muestra un mensaje de error
    Swal.fire({
      icon: "question",
      title: "Oops...",
      html: `No podemos recuperar tu cuenta <br>
          si no nos dices tu correo :)`,
      confirmButtonText: "Aceptar",
    });
  }
  // si todo es correcto se envia el formulario con axios
  else {
    // se crea un objeto con los datos del formulario
    const datos = {
      email: email.value,
    };
    // se envian los datos por axios
    axios
      .post("/recovery", datos)
      .then((res) => {
        // si todo es correcto se redirige a /recovered
        window.location.href = "/recovered";
      })
      .catch((err) => {
        // si hay un error se redirige igualmente
        window.location.href = "/recovered";
      });
  }
});
