import { obtenerUsuarios } from "./storage.js";

const CLAVE_SESION = "acme_sesion";

// Revisa el correo y la contraseña. Si son correctos, guarda la sesión
function iniciarSesion(email, contrasena) {
    const usuarios = obtenerUsuarios();

    const usuario = usuarios.find(u =>
        u.email.toLowerCase() === email.trim().toLowerCase() &&
        u.contrasena === contrasena
    );

    if (!usuario) {
        return false;
    }

    // Solo guardamos lo necesario (nunca la contraseña)
    const sesion = {
        id: usuario.id,
        nombre: usuario.nombre,
        email: usuario.email,
        cargo: usuario.cargo
    };

    sessionStorage.setItem(CLAVE_SESION, JSON.stringify(sesion));

    return true;
}

// Devuelve el usuario que inició sesión (o null si no hay)
function obtenerSesion() {
    const datos = sessionStorage.getItem(CLAVE_SESION);

    return datos ? JSON.parse(datos) : null;
}

// Borra la sesión y vuelve al login
function cerrarSesion() {
    sessionStorage.removeItem(CLAVE_SESION);
    window.location.href = "index.html";
}

// Se llama al inicio de las páginas privadas.
// Si no hay sesión, manda al login y devuelve false.
function protegerPagina() {
    if (!obtenerSesion()) {
        window.location.href = "index.html";
        return false;
    }

    // El componente <acme-header> lanza este evento al pulsar "Cerrar sesión"
    document.addEventListener("cerrar-sesion", cerrarSesion);

    return true;
}

export { iniciarSesion, obtenerSesion, cerrarSesion, protegerPagina };
