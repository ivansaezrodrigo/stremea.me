// se obtienen los campos
const email = document.getElementById("email");
const password = document.getElementById("password");
const form = document.getElementById("formulario-login");

// se captura el evento submit del formulario
form.addEventListener("submit", (e) => {
  e.preventDefault();

  // Validación de campos vacíos
  if (email.value == "" || password.value == "") {
    Swal.fire({
      icon: "warning",
      title: "Atención",
      text: "Todos los campos son obligatorios.",
      confirmButtonText: "Aceptar",
    });
    // Validación de formato del password
  } else if (password.value.length < 8) {
    Swal.fire({
      icon: "warning",
      title: "Atención",
      text: "La contraseña debe tener al menos 8 caracteres.",
      confirmButtonText: "Aceptar",
    });
  } else {
    // Envío del formulario
    axios
      .post("/login", {
        email: email.value,
        password: password.value,
      })
      .then((response) => {
         // Si el usuario es correcto, se redirige a la página principal
        if (response.status == 200) {
          window.location.href = "/";
        } else {
          Swal.fire({
            icon: "error",
            title: "Atención",
            text: "Correo o contraseña incorrecta",
            confirmButtonText: "Aceptar",
          });
        }
      })
      .catch((error) => {
         // Si el usuario no es correcto, se muestra un mensaje de error
        Swal.fire({
          icon: "warning",
          title: "Atención",
          text: "Correo o contraseña incorrecta",
          confirmButtonText: "Aceptar",
        });
      });
  }
});
