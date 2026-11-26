
const CLAVE_USUARIOS = "acme_usuarios";
const CLAVE_EXAMENES = "acme_examenes";
const CLAVE_RESULTADOS = "acme_resultados";

// Cargar los datos iniciales desde los archivos JSON
async function cargarDatosIniciales() {
    try {
        if (localStorage.getItem(CLAVE_USUARIOS) === null) {
            const respuesta = await fetch("../data/usuarios.json");
            const usuarios = await respuesta.json();

            localStorage.setItem(CLAVE_USUARIOS, JSON.stringify(usuarios));
        }

        if (localStorage.getItem(CLAVE_EXAMENES) === null) {
            const respuesta = await fetch("../data/examenes.json");
            const examenes = await respuesta.json();

            localStorage.setItem(CLAVE_EXAMENES, JSON.stringify(examenes));
        }

        if (localStorage.getItem(CLAVE_RESULTADOS) === null) {
            const respuesta = await fetch("../data/resultados.json");
            const resultados = await respuesta.json();

            localStorage.setItem(CLAVE_RESULTADOS, JSON.stringify(resultados));
        }

        console.log("Datos iniciales cargados correctamente");

    } catch (error) {
        console.error("Error al cargar los datos iniciales:", error);
        alert("No se pudieron cargar los datos. Verifica que estés usando Live Server.");
    }
}

// Obtener los usuarios guardados
function obtenerUsuarios() {
    const datos = localStorage.getItem(CLAVE_USUARIOS);

    return datos ? JSON.parse(datos) : [];
}

// Guardar los usuarios
function guardarUsuarios(usuarios) {
    localStorage.setItem(CLAVE_USUARIOS, JSON.stringify(usuarios));
}

// Obtener los exámenes guardados
function obtenerExamenes() {
    const datos = localStorage.getItem(CLAVE_EXAMENES);

    return datos ? JSON.parse(datos) : [];
}

// Guardar los exámenes
function guardarExamenes(examenes) {
    localStorage.setItem(CLAVE_EXAMENES, JSON.stringify(examenes));
}

// Obtener los resultados guardados
function obtenerResultados() {
    const datos = localStorage.getItem(CLAVE_RESULTADOS);

    return datos ? JSON.parse(datos) : [];
}

// Guardar los resultados
function guardarResultados(resultados) {
    localStorage.setItem(CLAVE_RESULTADOS, JSON.stringify(resultados));
}

// Permitir que otros archivos JavaScript utilicen estas funciones
export {
    cargarDatosIniciales,
    obtenerUsuarios,
    guardarUsuarios,
    obtenerExamenes,
    guardarExamenes,
    obtenerResultados,
    guardarResultados
};
