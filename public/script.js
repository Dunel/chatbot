function sendMessage() {
  var messageInput = document.getElementById("message-input");
  var chatContainer = document.querySelector(".chat-container");
  var messageText = messageInput.value;

  if (messageText !== "") {
    var messageElement = document.createElement("div");
    messageElement.classList.add("rounded-lg", "shadow-lg", "p-4", "mb-4");
    messageElement.innerHTML = `
      <p class="text-sm">${messageText}</p>
    `;
    chatContainer.appendChild(messageElement);

    messageInput.value = "";
    chatContainer.scrollTop = chatContainer.scrollHeight;
    if (messageText.toLowerCase().startsWith("repetir: ")) {
      var repeatMessage = messageText.substr(9); // Obtiene el texto a repetir después de "repetir: "
      reproducirTexto(repeatMessage);
    } else {
      buscarRespuesta(messageText);
    }
  }
}

function buscarRespuesta(palabraClave) {
  fetch("data.json")
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      var respuesta = null;
      for (var i = 0; i < data.data.length; i++) {
        var keyword = data.data[i].keyword;
        if (contienePalabraClave(keyword, palabraClave)) {
          respuesta = data.data[i].res;
          break;
        }
      }
      if (respuesta) {
        mostrarRespuesta(respuesta);
        reproducirTexto(respuesta);
      } else {
        // No hacer nada
      }
    })
    .catch(function (error) {
      console.log("Error al obtener los datos:", error);
    });
}

function contienePalabraClave(cadena, palabraClave) {
  var palabrasClaveArr = palabraClave.toLowerCase().split(" ");
  for (var i = 0; i < palabrasClaveArr.length; i++) {
    var expresionRegular = new RegExp(
      "\\b" + palabrasClaveArr[i] + "\\b",
      "gi"
    );
    if (expresionRegular.test(cadena)) {
      return true;
    }
  }
  return false;
}

function mostrarRespuesta(respuesta) {
  var chatContainer = document.querySelector(".chat-container");
  var respuestaContainer = document.getElementById("respuesta-container");
  var respuestaElement = document.createElement("div");
  respuestaElement.className = "bg-dark rounded-lg shadow-lg p-4 mb-4";
  respuestaElement.innerHTML = `
    <p class="text-sm">${respuesta}</p>
  `;
  chatContainer.appendChild(respuestaElement);

  chatContainer.scrollTop = chatContainer.scrollHeight;
}

var avatarImage = document.getElementById("avatar-image");
var reproduciendoImage = document.getElementById("reproduciendo-image");
var loadingImage = document.getElementById("loading-image");

var inputField = document.getElementById("message-input");
inputField.addEventListener("keydown", function (event) {
  if (event.keyCode === 13) {
    event.preventDefault();
    sendMessage();
  }
});

var synth = window.speechSynthesis;

function reproducirElemento(elemento) {
  toggleAvatarImage(avatarImage, false);
  toggleAvatarImage(reproduciendoImage, true);
  var texto = elemento.innerText;
  reproducirTexto(texto);
}

function reproducirTexto(texto) {
  detener();
  toggleAvatarImage(avatarImage, false);
  toggleAvatarImage(reproduciendoImage, true);
  var utterance1 = new SpeechSynthesisUtterance(texto);
  var voices = speechSynthesis.getVoices();

  for (i = 0; i < voices.length; i++) {
    console.log(voices[i].name + " | " + i);
  }
  utterance1.voice = speechSynthesis.getVoices()[261]; //podemos elegir la voz
  synth.speak(utterance1);

  utterance1.addEventListener("end", function (event) {
    toggleAvatarImage(reproduciendoImage, false);
    toggleAvatarImage(avatarImage, true);
  });
}

function toggleAvatarImage(image, show) {
  if (show) {
    image.classList.remove("d-none");
  } else {
    image.classList.add("d-none");
  }
}

function detener() {
  synth.cancel();
  toggleAvatarImage(reproduciendoImage, false);
  toggleAvatarImage(avatarImage, true);
}

// Llamar a la función reproducir al cargar la página
window.addEventListener("DOMContentLoaded", function () {
  // Obtener los botones correspondientes
  var textoPredef = document.getElementById("texto-predefinido");
  var textoPredef2 = document.getElementById("texto-predefinido2");

  reproducirElemento(textoPredef);
  //reproducirElemento(textoPredef2);

  // Obtener los datos del archivo JSON
  fetch("data.json")
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      generarOpciones(data.data);
    })
    .catch(function (error) {
      console.log("Error al obtener los datos:", error);
    });

  function generarOpciones(data) {
    var opcionesContainer = document.getElementById("opciones-container");
    var opcionesLista = document.getElementById("opciones-lista");

    opcionesLista.innerHTML = "";

    var filas = Math.ceil((data.length - 10) / 12); // numero de columnas 12
    var contador = 0;

    for (var i = 0; i < filas; i++) {
      var fila = document.createElement("div");
      fila.classList.add("fila-opciones");

      for (var j = 0; j < 12; j++) {
        var index = i * 12 + j;
        if (index >= data.length - 10) {
          break;
        }

        var opcion = data[index];

        var link = document.createElement("a");
        link.href = "#";
        link.innerText = opcion.name;
        link.classList.add("opcion-link");
        link.addEventListener("click", obtenerTexto.bind(null, opcion.res));

        fila.appendChild(link);
        contador++;
      }

      opcionesLista.appendChild(fila);
    }

    opcionesContainer.classList.remove("hidden");
  }

  function obtenerTexto(respuesta) {
    var chatContainer = document.querySelector(".chat-container");
    var respuestaContainer = document.getElementById("respuesta-container");
    respuestaContainer.innerHTML = ""; // Limpiar el contenido anterior
    // Reproducir el texto de la respuesta
    reproducirTexto(respuesta);

    var respuestaElement = document.createElement("div");
    respuestaElement.className = "respuesta";
    respuestaElement.innerHTML = `
        <p class="text-sm">${respuesta}</p>
    `;

    respuestaContainer.appendChild(respuestaElement);

    // Borrar las respuestas anteriores
    var opcionesLinks = document.getElementsByClassName("opcion-link");
    for (var i = 0; i < opcionesLinks.length; i++) {
      opcionesLinks[i].classList.remove("active");
    }

    // Agregar clase "active" al enlace seleccionado
    this.classList.add("active");
  }
});
