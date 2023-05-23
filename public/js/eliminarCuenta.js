const form = document.getElementById("formulario-delete");
form.addEventListener("submit", (event) => {
  event.preventDefault();
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
      axios
        .post("/sayonara", { aliasDelete })
        .then((response) => {
          Swal.fire({
            icon: "success",
            title: "Ha sido un placer!",
            text: "Usuario eliminado correctamente",
          });
          setTimeout(() => {
            window.location.href = "/";
          }, 3000);
        })

        .catch((error) => {
          console.log(error);
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
