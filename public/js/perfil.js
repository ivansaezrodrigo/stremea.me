// al clicar en idImagenPerfilBtn se reasigna de forma aleatoria la imagen de perfil
document.getElementById("idImagenPerfilBtn").addEventListener("click", () => {
  let id = Math.floor(Math.random() * 10) + 1;
  // mientras el id no sea el mismo que el que ya tiene
  while (id == localStorage.getItem("idImagenPerfil")) {
    id = Math.floor(Math.random() * 10) + 1;
  }
  // se cambia en sesion storage el valor de la imagen de perfil
  localStorage.setItem("idImagenPerfil", id);

  // se cambian la imagenes de perfil
  document.querySelectorAll(".imagenPerfil").forEach((element) => {
    element.src = `img/avatars/${id}.jpg`;
  });
});

// Se obtiene el formulario
const form = document.getElementById("formPerfil");

// Se le asigna un evento al formulario
form.addEventListener("submit", (event) => {
  event.preventDefault();
  // se obtienen los datos del formulario
  const alias = document.getElementById("alias").value;
  const twitter = document.getElementById("twitter").value;
  const twitch = document.getElementById("twitch").value;
  const url = document.getElementById("url").value;
  const instagram = document.getElementById("instagram").value;
  const email = document.getElementById("email").value;
  const newsletter = document.getElementById("newsletter").checked;

  // se envían los datos al servidor
  axios
    .put("/user", {
      alias,
      twitter,
      twitch,
      url,
      instagram,
      email,
      newsletter,
    })
    .then((response) => {
      // Meter aqui un modal de que se ha actualizado correctamente
      console.log("Datos actualizados");
      Swal.fire({
        icon: "success",
        title: "Datos guardados satisfactoriamente.",
        showConfirmButton: false,
        timer: 2500,
      });
    })
    .catch((error) => {
      // se muestra un mensaje de error
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Ha ocurrido un error al actualizar los datos. Por favor, inténtalo de nuevo más tarde.",
        confirmButtonText: "Aceptar",
      });
    });
});
