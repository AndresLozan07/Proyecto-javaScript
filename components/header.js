
class AcmeHeader extends HTMLElement {
    constructor() {
        super();

        this.attachShadow({ mode: "open" });
    }

    connectedCallback() {
        this.mostrarHeader();
    }

    mostrarHeader() {
        this.shadowRoot.innerHTML = `
            <style>
                header {
                    background-color: #1e3a8a;
                    color: white;
                    padding: 20px;
                    font-family: Arial, sans-serif;
                }

                h1 {
                    margin: 0 0 15px;
                }

                nav {
                    display: flex;
                    flex-wrap: wrap;
                    gap: 15px;
                    align-items: center;
                }

                a {
                    color: white;
                    text-decoration: none;
                }

                a:hover {
                    text-decoration: underline;
                }

                button {
                    background-color: #dc2626;
                    color: white;
                    border: none;
                    padding: 8px 12px;
                    border-radius: 5px;
                    cursor: pointer;
                }

                button:hover {
                    background-color: #b91c1c;
                }
            </style>

            <header>
                <h1>Acme School</h1>

                <nav>
                    <a href="usuarios.html">Usuarios</a>
                    <a href="examenes.html">Exámenes</a>
                    <a href="resolver-examenes.html">Resolver exámenes</a>

                    <button id="cerrarSesion" type="button">
                        Cerrar sesión
                    </button>
                </nav>
            </header>
        `;

        const boton = this.shadowRoot.querySelector("#cerrarSesion");

        boton.addEventListener("click", () => {
            this.dispatchEvent(
                new CustomEvent("cerrar-sesion", {
                    bubbles: true,
                    composed: true
                })
            );
        });
    }
}

customElements.define("acme-header", AcmeHeader);
