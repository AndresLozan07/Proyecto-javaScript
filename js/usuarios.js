import { cargarDatosIniciales, obtenerUsuarios, guardarUsuarios } from "./storage.js";
import { protegerPagina, obtenerSesion } from "./auth.js";
import "../components/header.js";
import "../components/tabla-usuarios.js";

const formulario = document.getElementById("formUsuario");
const titulo = document.getElementById("tituloFormulario");
const campoId = document.getElementById("usuarioId");
const campoIdentificacion = document.getElementById("identificacion");
const campoNombre = document.getElementById("nombre");
const campoCorreo = document.getElementById("correo");
const campoTelefono = document.getElementById("telefono");
const campoCargo = document.getElementById("cargo");
const campoContrasena = document.getElementById("contrasena");
const botonGuardar = document.getElementById("botonGuardar");
const botonCancelar = document.getElementById("botonCancelar");
const tabla = document.getElementById("tablaUsuarios");
const mensaje = document.getElementById("mensaje");

let temporizadorMensaje = null;

function mostrarMensaje(texto, tipo) {
    mensaje.textContent = texto;
    mensaje.className = "mensaje " + tipo;

    clearTimeout(temporizadorMensaje);
    temporizadorMensaje = setTimeout(() => {
        mensaje.textContent = "";
        mensaje.className = "mensaje";
    }, 4000);
}

function mostrarTabla() {
    tabla.usuarios = obtenerUsuarios();
}

// Deja el formulario listo para crear un usuario nuevo
function limpiarFormulario() {
    formulario.reset();
    campoId.value = "";
    titulo.textContent = "Registrar usuario";
    botonGuardar.textContent = "Guardar usuario";
    botonCancelar.hidden = true;
}

// Llena el formulario con los datos de un usuario para actualizarlo
function cargarUsuarioEnFormulario(id) {
    const usuario = obtenerUsuarios().find(u => u.id === id);

    if (!usuario) {
        return;
    }

    campoId.value = usuario.id;
    campoIdentificacion.value = usuario.identificacion;
    campoNombre.value = usuario.nombre;
    campoCorreo.value = usuario.email;
    campoTelefono.value = usuario.telefono;
    campoCargo.value = usuario.cargo;
    campoContrasena.value = usuario.contrasena;

    titulo.textContent = "Actualizar usuario";
    botonGuardar.textContent = "Actualizar usuario";
    botonCancelar.hidden = false;

    formulario.scrollIntoView({ behavior: "smooth" });
    campoIdentificacion.focus();
}

function guardarUsuario(evento) {
    evento.preventDefault();

    const usuarios = obtenerUsuarios();
    const idEnEdicion = campoId.value;

    const datos = {
        identificacion: campoIdentificacion.value.trim(),
        nombre: campoNombre.value.trim(),
        email: campoCorreo.value.trim(),
        telefono: campoTelefono.value.trim(),
        cargo: campoCargo.value,
        contrasena: campoContrasena.value
    };

    if (datos.identificacion === "" || datos.nombre === "" || datos.email === "" ||
        datos.telefono === "" || datos.cargo === "" || datos.contrasena === "") {
        mostrarMensaje("Todos los campos son obligatorios.", "error");
        return;
    }

    if (datos.contrasena.length < 6) {
        mostrarMensaje("La contraseña debe tener al menos 6 caracteres.", "error");
        return;
    }

    // No puede haber dos usuarios con la misma identificación o el mismo correo
    const repetido = usuarios.some(u =>
        u.id !== idEnEdicion &&
        (u.identificacion === datos.identificacion ||
         u.email.toLowerCase() === datos.email.toLowerCase())
    );

    if (repetido) {
        mostrarMensaje("Ya existe un usuario con esa identificación o ese correo.", "error");
        return;
    }

    if (idEnEdicion === "") {
        usuarios.push({ id: "USR" + Date.now(), ...datos });
        mostrarMensaje("Usuario creado correctamente.", "exito");
    } else {
        const posicion = usuarios.findIndex(u => u.id === idEnEdicion);
        usuarios[posicion] = { id: idEnEdicion, ...datos };
        mostrarMensaje("Usuario actualizado correctamente.", "exito");
    }

    guardarUsuarios(usuarios);
    mostrarTabla();
    limpiarFormulario();
}

function eliminarUsuario(id) {
    const sesion = obtenerSesion();
    const usuarios = obtenerUsuarios();

    if (id === sesion.id) {
        mostrarMensaje("No puedes eliminar el usuario con el que iniciaste sesión.", "error");
        return;
    }

    if (!confirm("¿Seguro que quieres eliminar este usuario?")) {
        return;
    }

    guardarUsuarios(usuarios.filter(u => u.id !== id));

    // Si estaba editando justo ese usuario, se limpia el formulario
    if (campoId.value === id) {
        limpiarFormulario();
    }

    mostrarTabla();
    mostrarMensaje("Usuario eliminado.", "exito");
}

async function iniciar() {
    await cargarDatosIniciales();

    if (!protegerPagina()) {
        return;
    }

    mostrarTabla();

    formulario.addEventListener("submit", guardarUsuario);
    botonCancelar.addEventListener("click", limpiarFormulario);

    // Eventos que lanza el componente <tabla-usuarios>
    tabla.addEventListener("editar-usuario", evento => cargarUsuarioEnFormulario(evento.detail));
    tabla.addEventListener("eliminar-usuario", evento => eliminarUsuario(evento.detail));
}

iniciar();
