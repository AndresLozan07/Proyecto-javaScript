
class AcmePregunta extends HTMLElement {
    constructor() {
        super();

        this.attachShadow({ mode: "open" });
        this._pregunta = null;
        this._numero = 1;
    }

    connectedCallback() {
        this.mostrarPregunta();
    }

    set pregunta(datos) {
        this._pregunta = datos;
        this.mostrarPregunta();
    }

    get pregunta() {
        return this._pregunta;
    }

    set numero(valor) {
        this._numero = valor;
        this.mostrarPregunta();
    }

    get numero() {
        return this._numero;
    }

    mostrarPregunta() {
        if (!this._pregunta) {
            return;
        }

        this.shadowRoot.innerHTML = `
            <style>
                :host {
                    display: block;
                    margin-bottom: 20px;
                    font-family: Arial, sans-serif;
                }

                section {
                    border: 1px solid #d1d5db;
                    border-radius: 8px;
                    padding: 20px;
                    background-color: white;
                }

                h3 {
                    color: #1e3a8a;
                    margin-top: 0;
                }

                .respuesta {
                    display: block;
                    padding: 10px;
                    margin: 8px 0;
                    border: 1px solid #d1d5db;
                    border-radius: 5px;
                    cursor: pointer;
                }

                .respuesta:hover {
                    background-color: #eff6ff;
                }

                input {
                    margin-right: 8px;
                }
            </style>

            <section>
                <h3>Pregunta ${this._numero}</h3>

                <p id="descripcion"></p>

                <div id="respuestas"></div>
            </section>
        `;

        const descripcion = this.shadowRoot.querySelector("#descripcion");
        descripcion.textContent = this._pregunta.descripcion;

        const contenedor = this.shadowRoot.querySelector("#respuestas");

        this._pregunta.respuestas.forEach(respuesta => {
            const etiqueta = document.createElement("label");
            etiqueta.className = "respuesta";

            const radio = document.createElement("input");
            radio.type = "radio";
            radio.name = "pregunta_" + this._pregunta.id;
            radio.value = respuesta.id;

            const texto = document.createElement("span");
            texto.textContent = respuesta.descripcion;

            etiqueta.appendChild(radio);
            etiqueta.appendChild(texto);

            contenedor.appendChild(etiqueta);
        });
    }
}

customElements.define("acme-pregunta", AcmePregunta);

