// se obtiene el formulario
const formulario = document.getElementById("formulario-password");
// se obtienen los campos
const password = document.getElementById("password");
const password2 = document.getElementById("password2");
const passwordOld = document.getElementById("passwordOld");

// se añade el evento submit al formulario
formulario.addEventListener("submit", (e) => {
  // se cancela el envio del formulario
  e.preventDefault();
  // se comprueba que los campos no esten vacios
  if (
    password.value === "" ||
    password2.value === "" ||
    passwordOld.value === ""
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
  }
  // si todo es correcto se envia el formulario con axios meiante un put a la ruta /password
  else {
    axios
      .put("/password", {
        password: password.value,
        password2: password2.value,
        passwordOld: passwordOld.value,
      })
      // si la respuesta es correcta se muestra un mensaje de confirmacion
      .then(function (response) {
        Swal.fire({
          icon: "success",
          title: "Contraseña cambiada correctamente",
          showConfirmButton: false,
          timer: 1500,
        });
        // se redirige a la pagina de inicio
        window.location.href = "/user";
      })
      // si la respuesta es incorrecta se muestra un mensaje de error
      .catch(function (error) {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Parece que esa no es tu contraseña actual",
          confirmButtonText: "Aceptar",
        });
      });
  }
});
