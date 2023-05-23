// cogemos todos los inputs del formulario
const email = document.getElementById("email");
const password = document.getElementById("password");
const password2 = document.getElementById("password2");
const formulario = document.getElementById("formulario-registro");

// captuar el evento submit del formulario

formulario.addEventListener("submit", (e) => {
  e.preventDefault();
  // comprobar que los campos no estén vacíos
  if (email.value == "" || password.value == "" || password2.value == "") {
    Swal.fire({
      icon: "warning",
      title: "Atención",
      text: "Todos los campos son obligatorios.",
      confirmButtonText: "Aceptar",
    });
    // comprobar que las contraseñas sean iguales
  } else if (password.value != password2.value && password.value.length <= 8) {
    Swal.fire({
      icon: "warning",
      title: "Atención",
      text: "Las contraseñas han de ser iguales y tener como mínimo 8 caracteres.",
      confirmButtonText: "Aceptar",
    });
  } else {
    try {
      // enviar el formulario
      axios
        .post("/signup", {
          email: email.value,
          password: password.value,
          password2: password2.value,
        })
        .then((res) => {
          if (res.status == 200) {
            window.location.href = "/";
          } else {
            Swal.fire({
              icon: "error",
              title: "¡Error!",
              text: "No se ha podido registrar el usuario.",
            });
          }
        })
        .catch((error) => {
          console.log(error);
          Swal.fire({
            icon: "error",
            title: "Oops..!",
            text: "Asegurate de introducir un correo y contraseña válidos.",
          });
        });
    } catch (error) {
      console.log(error);
    }
  }
});
