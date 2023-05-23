// Se obtiene el formulario
const form = document.getElementById("formulario-delete");

// Se le asigna un evento al formulario
form.addEventListener("submit", (event) => {
  event.preventDefault();

    // se obtiene el alias
  const aliasDelete = document.getElementById("aliasDelete").value;

  // se revisa que el campo no esté vacío
  if (aliasDelete == "") {
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: "Por favor, rellene todos los campos.",
      confirmButtonText: "Aceptar",
    });
    return;
  } else {
    // se revisa que el alias introducido sea el mismo que el del usuario
    if (aliasDelete != "<%= user.alias %>") {
      Swal.fire({
        icon: "error",
        title: "Alias erróneo",
        text: 'El alias introducido no coincide con el de tu usuario. Puedes encontrar tu alias en la parte superior de la página entre comillado o en tu perfil (el japonés "<%= user.alias %>").',
        confirmButtonText: "Aceptar",
      });
      return;
    } else {
        // se envían los datos al servidor
      axios
        .post("/sayonara", { aliasDelete })
        .then((response) => {
          Swal.fire({
            icon: "success",
            title: "Ha sido un placer!",
            text: "Usuario eliminado correctamente",
          });
          // se redirige a la página principal
          setTimeout(() => {
            window.location.href = "/";
          }, 3000);
        })

        .catch((error) => {
          // se muestra un mensaje de error
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Ha ocurrido un error al borrar los datos.",
            confirmButtonText: "Aceptar",
          });
        });
    }
  }
});
