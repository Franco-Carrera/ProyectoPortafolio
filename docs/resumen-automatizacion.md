# Documentación del Proyecto de Automatización con Cypress

## Introducción

Este documento resume el proyecto de automatización de pruebas para una aplicación de gestión de objetivos. El propósito principal es validar las funcionalidades críticas de la aplicación, que fue generada inicialmente con asistencia de IA. La aplicación permite a los usuarios crear tableros, listas y objetivos (tarjetas), asignarles fechas de vencimiento, editarlos, marcarlos como completados, eliminarlos y reorganizarlos.

El objetivo de este proyecto de QA es asegurar la calidad y robustez de la aplicación mediante la implementación de un conjunto de pruebas automatizadas con Cypress.

## Descripción avanzada del proyecto

### Funcionamiento de la Aplicación

La aplicación es un gestor de tareas visual similar a Trello. A nivel de negocio, el flujo principal es:
1.  **Autenticación**: Los usuarios deben registrarse e iniciar sesión.
2.  **Gestión de Tableros**: Crear y gestionar tableros para agrupar proyectos o áreas de trabajo.
3.  **Gestión de Listas**: Dentro de cada tablero, se pueden crear listas para representar etapas de un flujo (ej. "Pendiente", "En Proceso", "Completado").
4.  **Gestión de Objetivos**: En cada lista, los usuarios pueden añadir "objetivos" o tareas, que incluyen título, descripción y fecha de vencimiento.
5.  **Interacción**: Los objetivos pueden ser editados, eliminados, marcados como completados, y movidos entre listas.

### Desafío Técnico y Estrategia de Pruebas

El principal desafío técnico fue la automatización de la funcionalidad de **arrastrar y soltar (drag and drop)**, implementada en el frontend con una librería como **React DnD**. Este tipo de interacción es compleja de simular en pruebas automatizadas. Para abordarlo, se desarrolló un comando personalizado (`cy.dragAndDrop`) que simula los eventos del navegador (`dragstart`, `dragover`, `drop`, `dragend`) para probar el movimiento de objetivos entre listas.

Se decidió implementar los siguientes tipos de pruebas:
-   **Pruebas Funcionales y E2E**: Para validar los flujos completos del usuario, desde el login hasta la gestión de objetivos.
-   **Pruebas de Regresión**: Para asegurar que las nuevas funcionalidades o correcciones no rompen el código existente.
-   **Smoke Tests**: Un subconjunto de pruebas críticas (como el login y la creación de un objetivo) que se ejecutan para verificar la estabilidad de las funcionalidades básicas.

Se utilizó el patrón de diseño **Page Object Model (POM)** para estructurar el código, separando los selectores de la lógica de las pruebas. Esto mejora la mantenibilidad y legibilidad del proyecto.

## Estructura del repositorio

El proyecto sigue una estructura estándar para proyectos de Cypress, organizada de la siguiente manera:

-   `cypress/e2e/`: Contiene los archivos de prueba (`.cy.js`). Están organizados en subcarpetas por funcionalidad (`Login`, `Cards`).
-   `cypress/fixtures/`: Almacena datos de prueba estáticos en formato JSON (`login.json`, `board.json`). Esto permite desacoplar los datos de la lógica de los tests.
-   `cypress/support/`:
    -   `commands.js`: Define comandos personalizados de Cypress, como `cy.initLogin()` para abstraer el proceso de login y preparación del tablero, y `cy.dragAndDrop()` para la funcionalidad de arrastrar y soltar.
    -   `pages/`: Contiene las clases del Page Object Model (`loginPage.js`, `homePage.js`, `boardPage.js`), que encapsulan los selectores y métodos para interactuar con las páginas de la aplicación.
-   `.github/workflows/`: Contiene el pipeline de CI/CD (`ci-cd.yml`) configurado con GitHub Actions.

El flujo de ramas se gestiona de la siguiente manera:
-   `main`: Rama principal con el código estable.
-   `feature/nombre-feature`: Ramas para el desarrollo de nuevas funcionalidades o pruebas. Las Pull Requests a `main` disparan la ejecución de los tests.

## Configuración básica de dependencias

El proyecto se basa en las siguientes tecnologías:
-   **Node.js**: Entorno de ejecución para JavaScript.
-   **Cypress**: Framework principal para la automatización de pruebas E2E.
-   **cypress-xpath**: Plugin para utilizar selectores XPath en Cypress cuando es necesario.

### Comandos importantes

Para ejecutar el proyecto en otra máquina, solo se necesita:
1.  Clonar el repositorio.
2.  Instalar las dependencias con `npm install`.
3.  Configurar las variables de entorno si es necesario (ej. en un archivo `.env`).

Los comandos principales definidos en `package.json` son:
-   `npm run test`: Abre la interfaz de Cypress para ejecutar pruebas de forma interactiva (`npx cypress open`).
-   `npm run cypress`: Ejecuta las pruebas en modo headless (sin interfaz gráfica), útil para CI/CD.

## Casos de prueba implementados

Se cubrieron los siguientes escenarios de prueba principales:

**Módulo de Login:**
-   Login exitoso con credenciales válidas.
-   Validación de errores para campos vacíos, formato de email incorrecto y credenciales inválidas.
-   Pruebas de seguridad básicas (ej. intento de inyección SQL simple).

**Módulo de Objetivos (Cards):**
-   Crear un nuevo objetivo en una lista.
-   Editar la fecha de vencimiento y el estado de un objetivo.
-   Marcar un objetivo como "Completado" y verificar que el filtro de estado se actualiza.
-   Eliminar un objetivo y verificar que desaparece de la lista.
-   Mover un objetivo de una lista a otra mediante drag and drop.

## Reporte de hallazgos (bug encontrado)

Durante la implementación de las pruebas, se detectó un bug relacionado con la actualización del estado de un objetivo.

-   **Descripción del bug**: Al editar un objetivo y cambiar su estado a "En Proceso" a través del modal de edición, la interfaz no siempre refleja el cambio en los filtros de estado. El contador del filtro "En Proceso" no se incrementa, aunque al recargar la página el estado a veces se muestra correctamente.
-   **Detección**: Se identificó al escribir el `TC4: Validar editar un objetivo al modo 'En proceso' y ver coincidencia con su filtro de estado.`. La aserción `boardPage.findFilterInProcess().should("include", data.filter.currentCount)` fallaba de manera intermitente. El test fue marcado como `.skip` para no bloquear el pipeline mientras se reporta.
-   **Evidencia**:
    `[Captura de pantalla del bug o del reporte de Cypress mostrando el fallo]`
-   **Impacto en el usuario final**: Este bug afecta la consistencia de la interfaz y la fiabilidad de los filtros, lo que puede llevar al usuario a tener una percepción incorrecta del estado de sus tareas, disminuyendo la confianza en la aplicación.

## Integración con CI/CD

Se configuró un pipeline de Integración Continua y Despliegue Continuo (CI/CD) utilizando **GitHub Actions**. El flujo de trabajo se define en el archivo `.github/workflows/ci-cd.yml` y se activa en cada `pull_request` a la rama `main`.

El pipeline realiza los siguientes pasos:
1.  **Checkout**: Descarga el código de la rama.
2.  **Setup Node.js**: Configura el entorno de ejecución.
3.  **Install Dependencies**: Instala todas las dependencias del proyecto con `npm ci`.
4.  **Run Cypress Tests**: Ejecuta el conjunto de pruebas de Cypress en modo headless. El pipeline está configurado para ejecutar selectivamente los tests según la rama, o todos los tests por defecto.
5.  **Upload Artifacts**: Guarda los reportes generados por Cypress como artefactos para poder revisarlos posteriormente.

El principal beneficio es la **garantía de calidad continua**, ya que asegura que ningún cambio que rompa las funcionalidades existentes sea fusionado a la rama principal.

## Conclusiones y aprendizajes

-   **Mayor desafío**: El desafío más significativo fue la automatización de la funcionalidad de **drag and drop**. Requirió investigar y desarrollar un comando personalizado robusto que simulara de manera fiable la interacción del usuario.
-   **Aprendizajes clave**:
    -   La importancia de usar el **Page Object Model (POM)** para crear un framework de pruebas mantenible y escalable.
    -   El poder de los **comandos personalizados** en Cypress para abstraer lógica compleja y repetitiva, haciendo los tests más limpios y legibles.
    -   La necesidad de una buena estrategia para gestionar **datos de prueba**, utilizando `fixtures` para desacoplarlos de la lógica.
-   **Mejoras a futuro**:
    -   Integrar un reportero avanzado como **Mochawesome** o **Allure** para generar reportes de prueba más visuales e interactivos.
    -   Ampliar la cobertura de pruebas de regresión para incluir más casos de borde y variaciones en los datos de entrada.

