# Plataforma para exámenes – Acme School

Aplicación web hecha con HTML, CSS y JavaScript (sin frameworks) para que los estudiantes de la escuela Acme presenten exámenes en línea y para que administrativos y docentes los gestionen.

## Módulos

| Módulo | Acceso | Qué hace |
|---|---|---|
| Login | Público | Inicio de sesión con correo y contraseña |
| Gestión de usuarios | Privado | Crear, actualizar y eliminar usuarios |
| Gestión de exámenes | Privado | Crear, actualizar y eliminar exámenes y sus preguntas |
| Resolución de exámenes | Público | Elegir un examen, resolverlo con reloj y ver el resultado |

## Estructura del proyecto

```
Proyecto-javaScript/
├── components/        Web Components (header, tablas y pregunta)
├── css/styles.css     Colores y estilos generales
├── data/              JSON con los datos iniciales
├── docs/              Documento de requisitos
├── html/              Una página HTML por cada vista
├── js/                Un archivo JS por página + storage.js y auth.js
└── README.md
```

## Cómo ejecutarlo

1. Abrir la carpeta en Visual Studio Code.
2. Iniciar **Live Server** sobre `html/index.html` (es necesario porque los datos iniciales se cargan con `fetch`).
3. Usuario de prueba: `admin@acmeschool.com` / `Admin123`.
4. Los estudiantes entran directamente a `html/resolver-examenes.html`, sin iniciar sesión.

## Cómo está hecho

- **Persistencia:** `localStorage` con tres claves (`acme_usuarios`, `acme_examenes`, `acme_resultados`). La primera vez se llenan desde los archivos de `data/`. Todo el acceso pasa por `js/storage.js`.
- **Sesión:** `sessionStorage` (`js/auth.js`). Las páginas privadas llaman a `protegerPagina()` y, si no hay sesión, redirigen al login.
- **Web Components:** `<acme-header>`, `<tabla-usuarios>`, `<tabla-examenes>` y `<acme-pregunta>`. Los componentes avisan a la página con eventos personalizados (`editar-usuario`, `eliminar-examen`, `cerrar-sesion`, etc.).
- **Reloj del examen:** se calcula con la hora real (`Date.now()`), así que no se atrasa y no se reinicia si se recarga la página. Al llegar a 0 el examen se termina solo.
- **Reglas de datos:** identificación y correo únicos por usuario, código único por examen, mínimo 2 respuestas por pregunta y una sola respuesta correcta. Un examen sin preguntas no aparece a los estudiantes.
- **Accesibilidad y diseño:** etiquetas en todos los campos, foco visible, `role="timer"` en el reloj, diseño responsive, transiciones suaves y respeto a `prefers-reduced-motion`.

## Estructura de datos (JSON)

```json
{
  "id": "EX001",
  "codigo": "EX001",
  "titulo": "Examen de JavaScript",
  "tiempo": 30,
  "porcentajeAprobacion": 70,
  "descripcion": "Evaluación básica de JavaScript",
  "activo": true,
  "preguntas": [
    {
      "id": "P001",
      "descripcion": "¿Qué palabra se utiliza para declarar una variable?",
      "respuestas": [
        { "id": "R001", "descripcion": "let", "correcta": true },
        { "id": "R002", "descripcion": "print", "correcta": false }
      ]
    }
  ]
}
```

## Limitaciones conocidas

- Las contraseñas se guardan en texto plano en `localStorage` porque es un proyecto académico sin servidor. En un sistema real se guardarían cifradas en una base de datos.
- Los datos viven en el navegador: cada navegador tiene su propia copia.

## Autor

Andrés Felipe Lozano Ramirez – Unidades Tecnológicas de Santander
