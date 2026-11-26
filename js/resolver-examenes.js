import { cargarDatosIniciales, obtenerExamenes } from "./storage.js";

const contenedor = document.getElementById("listaExamenes");

function crearTarjeta(examen) {
    const tarjeta = document.createElement("article");
    tarjeta.className = "tarjeta";

    const titulo = document.createElement("h3");
    titulo.textContent = examen.titulo;

    const descripcion = document.createElement("p");
    descripcion.textContent = examen.descripcion;

    const tiempo = document.createElement("p");
    tiempo.textContent = "Tiempo: " + examen.tiempo + " minutos";

    const aprobacion = document.createElement("p");
    aprobacion.textContent = "Porcentaje de aprobación: " + examen.porcentajeAprobacion + "%";

    const preguntas = document.createElement("p");
    preguntas.textContent = "Preguntas: " + examen.preguntas.length;

    const enlace = document.createElement("a");
    enlace.className = "boton";
    enlace.textContent = "Presentar examen";
    enlace.href = "datos-estudiante.html?examen=" + encodeURIComponent(examen.id);

    tarjeta.appendChild(titulo);
    tarjeta.appendChild(descripcion);
    tarjeta.appendChild(tiempo);
    tarjeta.appendChild(aprobacion);
    tarjeta.appendChild(preguntas);
    tarjeta.appendChild(enlace);

    return tarjeta;
}

async function iniciar() {
    await cargarDatosIniciales();

    // Solo se muestran los exámenes activos que tengan al menos una pregunta
    const disponibles = obtenerExamenes().filter(e =>
        e.activo !== false && e.preguntas.length > 0
    );

    contenedor.innerHTML = "";

    if (disponibles.length === 0) {
        const vacio = document.createElement("p");
        vacio.className = "vacio";
        vacio.textContent = "Por ahora no hay exámenes disponibles.";
        contenedor.appendChild(vacio);
        return;
    }

    disponibles.forEach(examen => {
        contenedor.appendChild(crearTarjeta(examen));
    });
}

iniciar();
