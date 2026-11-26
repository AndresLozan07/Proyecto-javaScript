import { cargarDatosIniciales, obtenerResultados } from "./storage.js";

const CLAVE_RESULTADO = "acme_ultimo_resultado";

const nombreEstudiante = document.getElementById("nombreEstudiante");
const idEstudiante = document.getElementById("idEstudiante");
const tituloExamen = document.getElementById("tituloExamen");
const correctas = document.getElementById("correctas");
const porcentaje = document.getElementById("porcentaje");
const necesario = document.getElementById("necesario");
const mensajeResultado = document.getElementById("mensajeResultado");

async function iniciar() {
    await cargarDatosIniciales();

    const id = sessionStorage.getItem(CLAVE_RESULTADO);
    const resultado = obtenerResultados().find(r => r.id === id);

    // Si alguien entra directo a esta página, no hay resultado que mostrar
    if (!resultado) {
        window.location.href = "resolver-examenes.html";
        return;
    }

    nombreEstudiante.textContent = resultado.nombre;
    idEstudiante.textContent = resultado.identificacion;
    tituloExamen.textContent = resultado.examenTitulo;
    correctas.textContent = resultado.correctas + " de " + resultado.totalPreguntas;
    porcentaje.textContent = resultado.porcentaje + "%";
    necesario.textContent = resultado.porcentajeAprobacion + "%";

    if (resultado.aprobado) {
        mensajeResultado.textContent = "¡Felicidades, aprobaste el examen!";
        mensajeResultado.className = "resultado aprobado";
    } else {
        mensajeResultado.textContent = "No aprobaste el examen. ¡Sigue practicando!";
        mensajeResultado.className = "resultado reprobado";
    }
}

iniciar();
