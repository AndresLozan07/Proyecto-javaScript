import { cargarDatosIniciales, obtenerExamenes, guardarExamenes } from "./storage.js";
import { protegerPagina } from "./auth.js";
import "../components/header.js";
import "../components/tabla-examenes.js";

// ----- Formulario del examen -----
const formExamen = document.getElementById("formExamen");
const tituloExamenForm = document.getElementById("tituloFormularioExamen");
const campoExamenId = document.getElementById("examenId");
const campoCodigo = document.getElementById("codigo");
const campoTitulo = document.getElementById("titulo");
const campoTiempo = document.getElementById("tiempo");
const campoPorcentaje = document.getElementById("porcentaje");
const campoDescripcion = document.getElementById("descripcion");
const botonGuardarExamen = document.getElementById("botonGuardarExamen");
const botonCancelarExamen = document.getElementById("botonCancelarExamen");

// ----- Formulario de preguntas -----
const seccionPreguntas = document.getElementById("seccionPreguntas");
const nombreExamenActual = document.getElementById("nombreExamenActual");
const formPregunta = document.getElementById("formPregunta");
const campoPreguntaId = document.getElementById("preguntaId");
const campoPregunta = document.getElementById("pregunta");
const camposRespuesta = [
    document.getElementById("respuesta1"),
    document.getElementById("respuesta2"),
    document.getElementById("respuesta3"),
    document.getElementById("respuesta4")
];
const botonGuardarPregunta = document.getElementById("botonGuardarPregunta");
const botonCancelarPregunta = document.getElementById("botonCancelarPregunta");
const listaPreguntas = document.getElementById("listaPreguntas");

const tabla = document.getElementById("tablaExamenes");
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
    tabla.examenes = obtenerExamenes();
}

// =====================  EXÁMENES  =====================

function limpiarFormularioExamen() {
    formExamen.reset();
    campoExamenId.value = "";
    tituloExamenForm.textContent = "Crear examen";
    botonGuardarExamen.textContent = "Guardar examen";
    botonCancelarExamen.hidden = true;

    // Sin examen seleccionado no se pueden agregar preguntas
    seccionPreguntas.hidden = true;
    limpiarFormularioPregunta();
}

function cargarExamenEnFormulario(id) {
    const examen = obtenerExamenes().find(e => e.id === id);

    if (!examen) {
        return;
    }

    campoExamenId.value = examen.id;
    campoCodigo.value = examen.codigo;
    campoTitulo.value = examen.titulo;
    campoTiempo.value = examen.tiempo;
    campoPorcentaje.value = examen.porcentajeAprobacion;
    campoDescripcion.value = examen.descripcion;

    tituloExamenForm.textContent = "Actualizar examen";
    botonGuardarExamen.textContent = "Actualizar examen";
    botonCancelarExamen.hidden = false;

    mostrarSeccionPreguntas(examen);

    formExamen.scrollIntoView({ behavior: "smooth" });
    campoCodigo.focus();
}

function guardarExamen(evento) {
    evento.preventDefault();

    const examenes = obtenerExamenes();
    const idEnEdicion = campoExamenId.value;

    const codigo = campoCodigo.value.trim();
    const titulo = campoTitulo.value.trim();
    const tiempo = Number(campoTiempo.value);
    const porcentaje = Number(campoPorcentaje.value);
    const descripcion = campoDescripcion.value.trim();

    if (codigo === "" || titulo === "" || descripcion === "") {
        mostrarMensaje("Completa todos los campos del examen.", "error");
        return;
    }

    if (!Number.isInteger(tiempo) || tiempo < 1) {
        mostrarMensaje("El tiempo debe ser un número entero de minutos (mínimo 1).", "error");
        return;
    }

    if (porcentaje < 0 || porcentaje > 100) {
        mostrarMensaje("El porcentaje de aprobación debe estar entre 0 y 100.", "error");
        return;
    }

    const codigoRepetido = examenes.some(e =>
        e.id !== idEnEdicion && e.codigo.toLowerCase() === codigo.toLowerCase()
    );

    if (codigoRepetido) {
        mostrarMensaje("Ya existe un examen con ese código.", "error");
        return;
    }

    let examenGuardado;

    if (idEnEdicion === "") {
        examenGuardado = {
            id: "EX" + Date.now(),
            codigo: codigo,
            titulo: titulo,
            tiempo: tiempo,
            porcentajeAprobacion: porcentaje,
            descripcion: descripcion,
            activo: true,
            preguntas: []
        };

        examenes.push(examenGuardado);
        mostrarMensaje("Examen creado. Ahora puedes agregarle preguntas.", "exito");
    } else {
        // Al actualizar se conservan las preguntas que ya tenía
        examenGuardado = examenes.find(e => e.id === idEnEdicion);

        examenGuardado.codigo = codigo;
        examenGuardado.titulo = titulo;
        examenGuardado.tiempo = tiempo;
        examenGuardado.porcentajeAprobacion = porcentaje;
        examenGuardado.descripcion = descripcion;

        mostrarMensaje("Examen actualizado correctamente.", "exito");
    }

    guardarExamenes(examenes);
    mostrarTabla();

    // Dejamos el examen abierto para agregar o revisar sus preguntas
    cargarExamenEnFormulario(examenGuardado.id);
}

function eliminarExamen(id) {
    if (!confirm("¿Seguro que quieres eliminar este examen y todas sus preguntas?")) {
        return;
    }

    guardarExamenes(obtenerExamenes().filter(e => e.id !== id));

    if (campoExamenId.value === id) {
        limpiarFormularioExamen();
    }

    mostrarTabla();
    mostrarMensaje("Examen eliminado.", "exito");
}

// =====================  PREGUNTAS  =====================

function mostrarSeccionPreguntas(examen) {
    seccionPreguntas.hidden = false;
    nombreExamenActual.textContent = examen.codigo + " - " + examen.titulo;

    limpiarFormularioPregunta();
    mostrarPreguntas(examen);
}

function limpiarFormularioPregunta() {
    formPregunta.reset();
    campoPreguntaId.value = "";
    botonGuardarPregunta.textContent = "Guardar pregunta";
    botonCancelarPregunta.hidden = true;
}

function obtenerExamenActual() {
    return obtenerExamenes().find(e => e.id === campoExamenId.value);
}

// Dibuja la lista de preguntas del examen
function mostrarPreguntas(examen) {
    listaPreguntas.innerHTML = "";

    if (examen.preguntas.length === 0) {
        const vacio = document.createElement("p");
        vacio.className = "vacio";
        vacio.textContent = "Este examen todavía no tiene preguntas. No aparecerá para los estudiantes hasta que tenga al menos una.";
        listaPreguntas.appendChild(vacio);
        return;
    }

    examen.preguntas.forEach((pregunta, indice) => {
        const tarjeta = document.createElement("article");
        tarjeta.className = "pregunta-item";

        const enunciado = document.createElement("h4");
        enunciado.textContent = (indice + 1) + ". " + pregunta.descripcion;

        const lista = document.createElement("ul");

        pregunta.respuestas.forEach(respuesta => {
            const item = document.createElement("li");
            item.textContent = respuesta.descripcion;

            if (respuesta.correcta) {
                item.className = "correcta";
                item.textContent += " (correcta)";
            }

            lista.appendChild(item);
        });

        const botonEditar = document.createElement("button");
        botonEditar.type = "button";
        botonEditar.className = "boton boton-secundario";
        botonEditar.textContent = "Editar pregunta";
        botonEditar.addEventListener("click", () => cargarPreguntaEnFormulario(pregunta.id));

        const botonEliminar = document.createElement("button");
        botonEliminar.type = "button";
        botonEliminar.className = "boton boton-peligro";
        botonEliminar.textContent = "Eliminar pregunta";
        botonEliminar.addEventListener("click", () => eliminarPregunta(pregunta.id));

        tarjeta.appendChild(enunciado);
        tarjeta.appendChild(lista);
        tarjeta.appendChild(botonEditar);
        tarjeta.appendChild(botonEliminar);

        listaPreguntas.appendChild(tarjeta);
    });
}

function cargarPreguntaEnFormulario(id) {
    const examen = obtenerExamenActual();
    const pregunta = examen.preguntas.find(p => p.id === id);

    campoPreguntaId.value = pregunta.id;
    campoPregunta.value = pregunta.descripcion;

    camposRespuesta.forEach((campo, indice) => {
        const respuesta = pregunta.respuestas[indice];

        campo.value = respuesta ? respuesta.descripcion : "";

        if (respuesta && respuesta.correcta) {
            document.querySelector('input[name="correcta"][value="' + (indice + 1) + '"]').checked = true;
        }
    });

    botonGuardarPregunta.textContent = "Actualizar pregunta";
    botonCancelarPregunta.hidden = false;

    formPregunta.scrollIntoView({ behavior: "smooth" });
    campoPregunta.focus();
}

function guardarPregunta(evento) {
    evento.preventDefault();

    const examenes = obtenerExamenes();
    const examen = examenes.find(e => e.id === campoExamenId.value);
    const idEnEdicion = campoPreguntaId.value;

    const descripcion = campoPregunta.value.trim();
    const marcada = document.querySelector('input[name="correcta"]:checked');

    if (descripcion === "") {
        mostrarMensaje("Escribe la descripción de la pregunta.", "error");
        return;
    }

    // Se toman solo las respuestas que tienen texto
    const respuestas = [];
    const idBase = "R" + Date.now();

    camposRespuesta.forEach((campo, indice) => {
        const texto = campo.value.trim();

        if (texto !== "") {
            respuestas.push({
                id: idBase + "-" + (indice + 1),
                descripcion: texto,
                // Solo la que está marcada con el radio puede ser correcta
                correcta: marcada !== null && Number(marcada.value) === indice + 1
            });
        }
    });

    if (respuestas.length < 2) {
        mostrarMensaje("La pregunta necesita al menos 2 respuestas.", "error");
        return;
    }

    if (!respuestas.some(r => r.correcta)) {
        mostrarMensaje("Marca cuál es la respuesta correcta (debe tener texto).", "error");
        return;
    }

    if (idEnEdicion === "") {
        examen.preguntas.push({
            id: "P" + Date.now(),
            descripcion: descripcion,
            respuestas: respuestas
        });
        mostrarMensaje("Pregunta agregada.", "exito");
    } else {
        const pregunta = examen.preguntas.find(p => p.id === idEnEdicion);

        pregunta.descripcion = descripcion;
        pregunta.respuestas = respuestas;
        mostrarMensaje("Pregunta actualizada.", "exito");
    }

    guardarExamenes(examenes);
    mostrarTabla();
    mostrarPreguntas(examen);
    limpiarFormularioPregunta();
}

function eliminarPregunta(id) {
    if (!confirm("¿Seguro que quieres eliminar esta pregunta?")) {
        return;
    }

    const examenes = obtenerExamenes();
    const examen = examenes.find(e => e.id === campoExamenId.value);

    examen.preguntas = examen.preguntas.filter(p => p.id !== id);

    guardarExamenes(examenes);
    mostrarTabla();
    mostrarPreguntas(examen);
    limpiarFormularioPregunta();
    mostrarMensaje("Pregunta eliminada.", "exito");
}

async function iniciar() {
    await cargarDatosIniciales();

    if (!protegerPagina()) {
        return;
    }

    mostrarTabla();

    formExamen.addEventListener("submit", guardarExamen);
    botonCancelarExamen.addEventListener("click", limpiarFormularioExamen);
    formPregunta.addEventListener("submit", guardarPregunta);
    botonCancelarPregunta.addEventListener("click", limpiarFormularioPregunta);

    // Eventos que lanza el componente <tabla-examenes>
    tabla.addEventListener("editar-examen", evento => cargarExamenEnFormulario(evento.detail));
    tabla.addEventListener("eliminar-examen", evento => eliminarExamen(evento.detail));
}

iniciar();
