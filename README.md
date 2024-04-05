# DashboardKanban

- Repo: https://github.com/Artikunazo/dashboard-kanban
- Live: https://dashboard-kanban-xzog.vercel.app/

## Instalacion

Para ejecutar el proyecto en local, es necesario ejecutar el comando `npm i`
desde una terminal: Powershell (Windows) o Terminal (Mac o Linux) dentro de la
carpeta del proyecto. Esto instalará todas los modulos agregados en
`package.json`. Estos modulos sn necesarios para que el dashboard funcione
correctamente.

## Ejecucion

Una vez que los modulos hayan finalizado su instalación, procede a usar el
comando `ng serve` para ejecutar el proyecto de forma local.

## General

la persistencia de la información es fundamental para proporcionar una
experiencia de usuario coherente y eficiente. Por ello, utilizamos
`localStorage`, una característica de almacenamiento web, para guardar de manera
segura los datos relacionados con las tareas y el tema seleccionado por el
usuario. Los detalles específicos que se almacenan son:

- `Las Tareas`: Cada tarea que el usuario crea o modifica se guarda en
  `localStorage`. Esto incluye toda la información asociada a la tarea, como el
  título, descripción, subtareas y estado.
- `Tema Seleccionado`: La preferencia de diseño o tema elegido por el usuario
  también se mantiene en `localStorage`. Esto asegura que la apariencia
  personalizada del sitio se conserve entre sesiones de navegación.

El uso de `localStorage` permite que estos datos se mantengan incluso después de
cerrar el navegador, garantizando que el usuario retome su trabajo desde donde
lo dejó sin perder ningún progreso. Es una herramienta valiosa para mejorar la
usabilidad del sistema, ya que elimina la necesidad de reintroducir información
y mantiene la personalización del usuario intacta.

## Componentes

### Toolbar

La barra superior de la página es el `toolbar`, en este componente se utilizan 3
componentes interiores para su construcción: `cutom-button`, `h2` y otro
`custom-button`.

- El primer `custom-buttom` empezando por el lado izquiero: es el botón que
  dispara la acción de mostrar/ el sidebar. Contiene el logo de menu tipo
  hamburguesa. Inputs:

  - `(clickEvent)="openNav.emit()"`: para disparar el evento de mostrar/ocultar
    el sidebar al componente app.component
  - `iconName="menu"`: para obtener el icono de menu tipo hamburguesa

- La etiqueta <h2> muestra el titulo del dashboard que se está mostrando.
- El segudno `custom-buttom` empezando por el lado izquiero: ejecuta la acción
  de mostrar en un modal el formulario para crear una nueva tarea

### Sidebar

Este componente está construido en 2 partes:

- La parte superior: está la lista de los "boards" que se han creado. Para este
  caso no se ha agregado funcionalidad
- Se muestra el componente `theme-switcher` que modifica el tema de toda la
  aplicación, cambiando la apariencia entre el tema `claro (light)` y el tema
  `oscuro (dark)`

### Tema switcher

Este componente está hecho con dos `mat-icon` para mostrar los iconos de sol y
luna, haciendo referencia a los temas `claro (light)` y `oscuro (dark)`
respectivamente. Además contiene una directiva personalizada para mostrar entre
tres tamaños especificados para los iconos: `small`, `medium` y `big`. Estos
tamaños agregan una clase de CSS al elemento HTML para cambiar el tamaño.

También podemos encontrar el componente `mat-slide-toggle` para poder cambiar
entre los temas `claro (light)` y `oscuro (dark)`. Este componente se utiliza la
directiva de `[formControl]` para poder administrar mejor los cambios que se
hagan desde la interfaz de usuario.

### Board

La interfaz del sistema está diseñada para facilitar la organización y el
seguimiento de las tareas mediante un esquema de columnas. Se estructura en tres
columnas principales que representan diferentes etapas del flujo de trabajo:

- `ToDo`: Esta columna contiene las tareas que están pendientes de iniciar. Aquí
  se listan todas las actividades programadas que aún no han comenzado.
- `Doing`: En esta sección se colocan las tareas que actualmente están en
  proceso. Refleja el trabajo activo y permite un seguimiento en tiempo real del
  avance. -`Done`: Finalmente, las tareas completadas se mueven a esta columna,
  indicando que se han finalizado satisfactoriamente.

Además, el sistema incorpora una funcionalidad de
`drag and drop (arrastrar y soltar)`, proporcionada por la utilería
`CDK de Angular`. Esto permite una interacción intuitiva y eficiente, donde se
pueden reasignar las tareas entre las columnas simplemente arrastrándolas con el
puntero del ratón. Esta característica agiliza la gestión de tareas y mejora la
experiencia del usuario al permitir cambios rápidos y directos en la
organización del flujo de trabajo.

### Formulario nueva tarea

Para añadir una nueva tarea en el sistema, se debe utilizar un cuadro de diálogo
modal específicamente diseñado para este fin. Este formulario interactivo se
divide en cuatro secciones esenciales, que son:

- `Title`: Aquí se debe ingresar el nombre o título de la tarea, proporcionando
  una identificación clara y concisa de la actividad a realizar.
- `Description`: Esta sección permite detallar la tarea, ofreciendo un espacio
  para explicar con mayor profundidad el objetivo y los requisitos necesarios
  para su cumplimiento.
- `Subtasks`: En caso de que la tarea principal se componga de varias
  actividades menores, esta área permite desglosarlas y registrarlas
  individualmente, facilitando así su seguimiento y gestión. Estas subtareas son
  de tipo ISubtask definido en el archivo tasks_model.ts
- `Status`: Finalmente, se debe especificar el estado actual de la tarea, lo que
  ayuda a monitorear su progreso y a identificar rápidamente las tareas
  completadas, en curso o pendientes.

Es importante destacar que cada uno de estos campos es de carácter obligatorio,
lo que asegura que se proporcione toda la información necesaria para una gestión
eficaz de las tareas dentro del sistema.

### Detalles de tarea

Esta interfaz es similar al formulario de crear nueva tarea. Sin embargo, aquí
no es posible realizar alguna edición sobre la informacióm establecida. Dejándo
el campo de estatus y subtareas como úncas opciones de edición.

En el apartado de status, al momeno seleccionar algún otro tipo de estatos éste
será actualizado en la información almacenada en el `local storage`.

#---------------------------------

Run first: `npm i`

This project was generated with
[Angular CLI](https://github.com/angular/angular-cli) version 17.3.2.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The
application will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can
also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the
`dist/` directory.

## Running unit tests

Run `ng test` to execute the unit tests via
[Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To
use this command, you need to first add a package that implements end-to-end
testing capabilities.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the
[Angular CLI Overview and Command Reference](https://angular.io/cli) page.
