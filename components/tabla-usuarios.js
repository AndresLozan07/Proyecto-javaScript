
class TablaUsuarios extends HTMLElement {
    constructor() {
        super();

        this.attachShadow({ mode: "open" });
        this._usuarios = [];
    }

    connectedCallback() {
        this.mostrarTabla();
    }

    set usuarios(datos) {
        this._usuarios = datos;
        this.mostrarTabla();
    }

    get usuarios() {
        return this._usuarios;
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

                .mensaje {
                    padding: 15px;
                    background-color: #f3f4f6;
                    border-radius: 5px;
                }

                .contenedor {
                    overflow-x: auto;
                }
            </style>

            <div class="contenedor">
                <table>
                    <thead>
                        <tr>
                            <th>Identificación</th>
                            <th>Nombre</th>
                            <th>Correo</th>
                            <th>Teléfono</th>
                            <th>Cargo</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>

                    <tbody id="cuerpoTabla"></tbody>
                </table>
            </div>
        `;

        const cuerpo = this.shadowRoot.querySelector("#cuerpoTabla");

        if (this._usuarios.length === 0) {
            cuerpo.innerHTML = `
                <tr>
                    <td colspan="6">
                        No hay usuarios registrados.
                    </td>
                </tr>
            `;

            return;
        }

        this._usuarios.forEach(usuario => {
            const fila = document.createElement("tr");

            const identificacion = document.createElement("td");
            identificacion.textContent = usuario.identificacion;

            const nombre = document.createElement("td");
            nombre.textContent = usuario.nombre;

            const correo = document.createElement("td");
            correo.textContent = usuario.email;

            const telefono = document.createElement("td");
            telefono.textContent = usuario.telefono;

            const cargo = document.createElement("td");
            cargo.textContent = usuario.cargo;

            const acciones = document.createElement("td");

            const botonEditar = document.createElement("button");
            botonEditar.textContent = "Editar";
            botonEditar.className = "editar";
            botonEditar.type = "button";

            botonEditar.addEventListener("click", () => {
                this.dispatchEvent(
                    new CustomEvent("editar-usuario", {
                        detail: usuario.id,
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
                    new CustomEvent("eliminar-usuario", {
                        detail: usuario.id,
                        bubbles: true,
                        composed: true
                    })
                );
            });

            acciones.appendChild(botonEditar);
            acciones.appendChild(botonEliminar);

            fila.appendChild(identificacion);
            fila.appendChild(nombre);
            fila.appendChild(correo);
            fila.appendChild(telefono);
            fila.appendChild(cargo);
            fila.appendChild(acciones);

            cuerpo.appendChild(fila);
        });
    }
}

customElements.define("tabla-usuarios", TablaUsuarios);
