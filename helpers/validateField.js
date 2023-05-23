// Funciones que se usaron y crearon en primera instancia para validar los campos del formulario de registro y login. Se han sustituido por la funcionalidad que presenta joivalidator.

// Función para validar el email
function isValidEmail(email) {
  // expresión regular para validar el email
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  // Comprueba que la longitud del email sea menor o igual a 150 caratceres
  if (email.length > 150 && email.length < 0) {
    return false;
  }
  return regex.test(email); // Devuelve true si el email es válido, de lo contrario, devuelve false
}


// Función para validar el título
function isValidTitle(title) {
  // expresión regular para validar el título
  const titleRegex = /^[a-zA-Z0-9\s]+$/;
  if (title.length < 2 || title.length > 50) {
    // Comprueba que la longitud del título sea mayor o igual a 2 caracteres y menor o igual a 50 caracteres
    return false;
  }
  return titleRegex.test(title); // Devuelve true si el título es válido, de lo contrario, devuelve false
}

// Función para validar la descripción
function isValidDescription(description) {
  // expresión regular para validar la descripción
  const descriptionRegex = /^[a-zA-Z0-9\s]+$/;
  if (description.length < 10 || description.length > 500) {
    // Comprueba que la longitud de la descripción sea mayor o igual a 10 caracteres y menor o igual a 500 caracteres
    return false;
  }
  return descriptionRegex.test(description); // Devuelve true si la descripción es válida, de lo contrario, devuelve false
}

// Función para validar el mensaje del chat
function isValidChatMessage(message) {
  const chatRegex = /^[a-zA-Z0-9\s]+$/; // expresión regular para validar el mensaje del chat
  if (message.length < 1 || message.length > 500) {
    // Comprueba que la longitud del mensaje del chat sea mayor o igual a 1 caracter y menor o igual a 500 caracteres
    return false;
  }
  return chatRegex.test(message); // Devuelve true si el mensaje del chat es válido, de lo contrario, devuelve false
}

// Función para validar el código de nanoid
function isValidNanoid(nanoid) {
  const nanoidRegex = /^[a-zA-Z0-9_-]+$/; // expresión regular para validar el código de nanoid
  // Comprueba que la longitud del código de nanoid sea igual a 21 caracteres
  if (nanoid.length !== 21) {
    return false;
  }
  // Devuelve true si el código de nanoid es válido, de lo contrario, devuelve false
  return nanoidRegex.test(nanoid);
}

// Función para validar la contraseña
function isValidPassword(password) {
  // expresión regular para validar la contraseña Comprueba que la longitud de la contraseña sea mayor o igual a 6 caracteres y no haya inyección de código
  const passwordRegex = /^[a-zA-Z0-9!@#$%^&*]{6,}$/;
  if (password.length < 6) {
    // Comprueba que la longitud de la contraseña sea mayor o igual a 6 caracteres
    return false;
  }
  return passwordRegex.test(password); // Devuelve true si la contraseña es válida, de lo contrario, devuelve false
}

// Función para validar el nombre de usuario
function isValidUsername(username) {
  // expresión regular para validar el nombre de usuario
  const usernameRegex = /^[a-zA-Z0-9_-]+$/;
  if (username.length < 2 || username.length > 20) {
    // Comprueba que la longitud del nombre de usuario sea mayor o igual a 2 caracteres y menor o igual a 20 caracteres
    return false;
  }
  return usernameRegex.test(username); // Devuelve true si el nombre de usuario es válido, de lo contrario, devuelve false
}

// Función para validar la url
function isValidUrl(url) {
    // expresión regular para validar la url
    const urlRegex = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/;
    if (url.length < 2 || url.length > 255) {
        // Comprueba que la longitud de la url sea mayor o igual a 2 caracteres y menor o igual a 100 caracteres
        return false;
    }
    return urlRegex.test(url); // Devuelve true si la url es válida, de lo contrario, devuelve false
}

module.exports = {
  isValidEmail,
  isValidTitle,
  isValidDescription,
  isValidChatMessage,
  isValidNanoid,
  isValidPassword,
  isValidUsername,
    isValidUrl
};
