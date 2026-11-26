import { cargarDatosIniciales } from "./storage.js";
import { iniciarSesion, obtenerSesion } from "./auth.js";

const formulario = document.getElementById("formLogin");
const campoCorreo = document.getElementById("correo");
const campoContrasena = document.getElementById("contrasena");
const mensaje = document.getElementById("mensaje");

function mostrarError(texto) {
    mensaje.textContent = texto;
    mensaje.className = "mensaje error";
}

async function iniciar() {
    await cargarDatosIniciales();

    // Si ya hay una sesión abierta, no hace falta volver a iniciar sesión
    if (obtenerSesion()) {
        window.location.href = "usuarios.html";
        return;
    }

    formulario.addEventListener("submit", evento => {
        evento.preventDefault();

        const correo = campoCorreo.value;
        const contrasena = campoContrasena.value;

        if (correo.trim() === "" || contrasena === "") {
            mostrarError("Completa el correo y la contraseña.");
            return;
        }

        if (iniciarSesion(correo, contrasena)) {
            window.location.href = "usuarios.html";
        } else {
            mostrarError("Correo o contraseña incorrectos.");
            campoContrasena.value = "";
            campoContrasena.focus();
        }
    });
}

iniciar();
