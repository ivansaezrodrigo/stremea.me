// se obtiene el formulario
const formulario = document.getElementById("formulario-recovering");
// se obtienen los campos
const password = document.getElementById("password");
const password2 = document.getElementById("password2");
const tokenRecu = document.getElementById("tokenRecu");

// se añade el evento submit al formulario
formulario.addEventListener("submit", (e) => {
  // se cancela el envio del formulario
  e.preventDefault();
  // se comprueba que los campos no esten vacios
  if (
    password.value === "" ||
    password2.value === "" ||
    tokenRecu.value === ""
  ) {
    // se muestra un mensaje de error
    Swal.fire({
      icon: "warning",
      title: "Oops...",
      text: "No puede haber campos vacios",
      confirmButtonText: "Aceptar",
    });
    // se comprueba que las contraseñas coincidan
  } else if (password.value !== password2.value) {
    // se muestra un mensaje de error
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: "Las contraseñas no coinciden",
      confirmButtonText: "Aceptar",
    });
    // se comprueba que las contraseñas tengan al menos 8 caracteres
  } else if (password.value.length < 8 || password2.value.length < 8) {
    // se muestra un mensaje de error
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: "La contraseña debe tener al menos 8 caracteres",
      confirmButtonText: "Aceptar",
    });
  }
  // si todo es correcto se envia el formulario con axios meiante un put a la ruta /password
  else {
    axios
      .post("/recovering", {
        password: password.value,
        password2: password2.value,
        tokenRecu: tokenRecu.value,
      })
      // si la respuesta es correcta se muestra un mensaje de confirmacion
      .then(function (response) {
        Swal.fire({
          icon: "success",
          title: "Contraseña cambiada correctamente",
          showConfirmButton: false,
        });

        // se redirige al usuario al perfil
        setTimeout(function () {
          window.location.href = "/user";
        }, 5000);
      })
      // si la respuesta es incorrecta se muestra un mensaje de error
      .catch(function (error) {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Parece que esta opción ya no está disponible",
          confirmButtonText: "Aceptar",
        });
        setTimeout(function () {
          window.location.href = "/";
        }, 5000);
      });
  }
});
