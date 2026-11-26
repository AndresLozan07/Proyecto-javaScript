
class TablaExamenes extends HTMLElement {
    constructor() {
        super();

        this.attachShadow({ mode: "open" });
        this._examenes = [];
    }

    connectedCallback() {
        this.mostrarTabla();
    }

    set examenes(datos) {
        this._examenes = datos;
        this.mostrarTabla();
    }

    get examenes() {
        return this._examenes;
    }

    mostrarTabla() {
        this.shadowRoot.innerHTML = `
            <style>
                :host {
                    display: block;
                    font-family: Arial, sans-serif;
                }

                table {
                    width: 100%;
                    border-collapse: collapse;
                    margin-top: 15px;
                }

                th, td {
                    border: 1px solid #d1d5db;
                    padding: 10px;
                    text-align: left;
                }

                th {
                    background-color: #1e3a8a;
                    color: white;
                }

                tr:nth-child(even) {
                    background-color: #f3f4f6;
                }

                button {
                    padding: 6px 10px;
                    margin: 3px;
                    border: none;
                    border-radius: 4px;
                    cursor: pointer;
                }

                .editar {
                    background-color: #2563eb;
                    color: white;
                }

                .eliminar {
                    background-color: #dc2626;
                    color: white;
                }

                .contenedor {
                    overflow-x: auto;
                }
            </style>

            <div class="contenedor">
                <table>
                    <thead>
                        <tr>
                            <th>Código</th>
                            <th>Título</th>
                            <th>Tiempo</th>
                            <th>Aprobación</th>
                            <th>Preguntas</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>

                    <tbody id="cuerpoTabla"></tbody>
                </table>
            </div>
        `;

        const cuerpo = this.shadowRoot.querySelector("#cuerpoTabla");

        if (this._examenes.length === 0) {
            cuerpo.innerHTML = `
                <tr>
                    <td colspan="6">
                        No hay exámenes registrados.
                    </td>
                </tr>
            `;

            return;
        }

        this._examenes.forEach(examen => {
            const fila = document.createElement("tr");

            const codigo = document.createElement("td");
            codigo.textContent = examen.codigo;

            const titulo = document.createElement("td");
            titulo.textContent = examen.titulo;

            const tiempo = document.createElement("td");
            tiempo.textContent = examen.tiempo + " minutos";

            const aprobacion = document.createElement("td");
            aprobacion.textContent = examen.porcentajeAprobacion + "%";

            const preguntas = document.createElement("td");
            preguntas.textContent = examen.preguntas.length;

            const acciones = document.createElement("td");

            const botonEditar = document.createElement("button");
            botonEditar.textContent = "Editar";
            botonEditar.className = "editar";
            botonEditar.type = "button";

            botonEditar.addEventListener("click", () => {
                this.dispatchEvent(
                    new CustomEvent("editar-examen", {
                        detail: examen.id,
                        bubbles: true,
                        composed: true
                    })
                );
            });

            const botonEliminar = document.createElement("button");
            botonEliminar.textContent = "Eliminar";
            botonEliminar.className = "eliminar";
            botonEliminar.type = "button";

            botonEliminar.addEventListener("click", () => {
                this.dispatchEvent(
                    new CustomEvent("eliminar-examen", {
                        detail: examen.id,
                        bubbles: true,
                        composed: true
                    })
                );
            });

            acciones.appendChild(botonEditar);
            acciones.appendChild(botonEliminar);

            fila.appendChild(codigo);
            fila.appendChild(titulo);
            fila.appendChild(tiempo);
            fila.appendChild(aprobacion);
            fila.appendChild(preguntas);
            fila.appendChild(acciones);

            cuerpo.appendChild(fila);
        });
    }
}

customElements.define("tabla-examenes", TablaExamenes);
