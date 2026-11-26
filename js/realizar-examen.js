import {
    cargarDatosIniciales,
    obtenerExamenes,
    obtenerResultados,
    guardarResultados
} from "./storage.js";
import "../components/pregunta.js";

const CLAVE_ESTUDIANTE = "acme_estudiante";
const CLAVE_INICIO = "acme_inicio_examen";
const CLAVE_RESULTADO = "acme_ultimo_resultado";

const parametros = new URLSearchParams(window.location.search);
const examenId = parametros.get("examen");

const tituloExamen = document.getElementById("tituloExamen");
const totalPreguntas = document.getElementById("totalPreguntas");
const porcentajeAprobacion = document.getElementById("porcentajeAprobacion");
const nombreEstudiante = document.getElementById("nombreEstudiante");
const reloj = document.getElementById("reloj");
const formulario = document.getElementById("formExamen");
const contenedor = document.getElementById("preguntas");

let examen = null;
let estudiante = null;
let finalizado = false;
let temporizador = null;
let horaFin = 0;

// Aquí guardamos los elementos <acme-pregunta> para leer sus respuestas al final
const elementosPregunta = [];

// Convierte segundos a formato mm:ss
function formatearTiempo(segundos) {
    const minutos = Math.floor(segundos / 60);
    const resto = segundos % 60;

    return String(minutos).padStart(2, "0") + ":" + String(resto).padStart(2, "0");
}

function actualizarReloj() {
    // Se calcula con la hora real, así el reloj no se atrasa
    const restante = Math.max(0, Math.ceil((horaFin - Date.now()) / 1000));

    reloj.textContent = formatearTiempo(restante);

    // En el último minuto el reloj se pone en rojo
    reloj.classList.toggle("poco-tiempo", restante <= 60);

    if (restante === 0) {
        finalizarExamen();
    }
}

function iniciarReloj() {
    // Guardamos la hora de inicio para que recargar la página no reinicie el tiempo
    let inicio = Date.now();
    const guardado = JSON.parse(sessionStorage.getItem(CLAVE_INICIO));

    if (guardado && guardado.examenId === examen.id) {
        inicio = guardado.inicio;
    } else {
        sessionStorage.setItem(CLAVE_INICIO, JSON.stringify({ examenId: examen.id, inicio: inicio }));
    }

    horaFin = inicio + examen.tiempo * 60 * 1000;

    actualizarReloj();
    temporizador = setInterval(actualizarReloj, 500);
}

function mostrarPreguntas() {
    examen.preguntas.forEach((pregunta, indice) => {
        const elemento = document.createElement("acme-pregunta");

        elemento.pregunta = pregunta;
        elemento.numero = indice + 1;

        contenedor.appendChild(elemento);
        elementosPregunta.push(elemento);
    });
}

// Revisa las respuestas, guarda el resultado y pasa a la página final
function finalizarExamen() {
    if (finalizado) {
        return;
    }

    finalizado = true;
    clearInterval(temporizador);

    let correctas = 0;
    const respuestasDadas = [];

    examen.preguntas.forEach((pregunta, indice) => {
        const seleccionada = elementosPregunta[indice].respuestaSeleccionada;
        const correcta = pregunta.respuestas.find(r => r.correcta);

        respuestasDadas.push({ preguntaId: pregunta.id, respuestaId: seleccionada });

        if (correcta && seleccionada === correcta.id) {
            correctas++;
        }
    });

    const total = examen.preguntas.length;
    const porcentaje = Math.round((correctas / total) * 10000) / 100;

    const resultado = {
        id: "RES" + Date.now(),
        examenId: examen.id,
        examenTitulo: examen.titulo,
        identificacion: estudiante.identificacion,
        nombre: estudiante.nombre,
        totalPreguntas: total,
        correctas: correctas,
        porcentaje: porcentaje,
        porcentajeAprobacion: examen.porcentajeAprobacion,
        aprobado: porcentaje >= examen.porcentajeAprobacion,
        fecha: new Date().toISOString(),
        respuestas: respuestasDadas
    };

    const resultados = obtenerResultados();
    resultados.push(resultado);
    guardarResultados(resultados);

    sessionStorage.setItem(CLAVE_RESULTADO, resultado.id);

    // Se borran los datos del intento para que no se pueda volver atrás
    sessionStorage.removeItem(CLAVE_ESTUDIANTE);
    sessionStorage.removeItem(CLAVE_INICIO);

    window.location.href = "resultado-examen.html";
}

function terminarManual(evento) {
    evento.preventDefault();

    const sinResponder = elementosPregunta.filter(e => e.respuestaSeleccionada === null).length;

    if (sinResponder > 0) {
        const texto = "Tienes " + sinResponder + " pregunta(s) sin responder. ¿Quieres terminar el examen de todas formas?";

        if (!confirm(texto)) {
            return;
        }
    }

    finalizarExamen();
}

async function iniciar() {
    await cargarDatosIniciales();

    examen = obtenerExamenes().find(e => e.id === examenId);

    if (!examen) {
        window.location.href = "resolver-examenes.html";
        return;
    }

    estudiante = JSON.parse(sessionStorage.getItem(CLAVE_ESTUDIANTE));

    // Si no pasó por el formulario de datos, se le pide primero
    if (!estudiante || estudiante.examenId !== examen.id) {
        window.location.href = "datos-estudiante.html?examen=" + encodeURIComponent(examen.id);
        return;
    }

    tituloExamen.textContent = examen.titulo;
    totalPreguntas.textContent = examen.preguntas.length;
    porcentajeAprobacion.textContent = examen.porcentajeAprobacion + "%";
    nombreEstudiante.textContent = estudiante.nombre;

    mostrarPreguntas();
    iniciarReloj();

    formulario.addEventListener("submit", terminarManual);
}

iniciar();
