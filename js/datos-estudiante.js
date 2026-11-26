import { cargarDatosIniciales, obtenerExamenes } from "./storage.js";

const CLAVE_ESTUDIANTE = "acme_estudiante";

const parametros = new URLSearchParams(window.location.search);
const examenId = parametros.get("examen");

const formulario = document.getElementById("formEstudiante");
const nombreExamen = document.getElementById("nombreExamen");
const campoIdentificacion = document.getElementById("identificacion");
const campoNombre = document.getElementById("nombre");
const mensaje = document.getElementById("mensaje");

async function iniciar() {
    await cargarDatosIniciales();

    const examen = obtenerExamenes().find(e => e.id === examenId);

    // Si el examen no existe, se vuelve a la lista
    if (!examen) {
        window.location.href = "resolver-examenes.html";
        return;
    }

    nombreExamen.textContent = examen.titulo;

    formulario.addEventListener("submit", evento => {
        evento.preventDefault();

        const identificacion = campoIdentificacion.value.trim();
        const nombre = campoNombre.value.trim();

        if (identificacion === "" || nombre === "") {
            mensaje.textContent = "Completa tu identificación y tu nombre.";
            mensaje.className = "mensaje error";
            return;
        }

        // Guardamos los datos para usarlos en el examen y en el resultado
        const estudiante = {
            identificacion: identificacion,
            nombre: nombre,
            examenId: examen.id
        };

        sessionStorage.setItem(CLAVE_ESTUDIANTE, JSON.stringify(estudiante));

        window.location.href = "realizar-examen.html?examen=" + encodeURIComponent(examen.id);
    });
}

iniciar();
