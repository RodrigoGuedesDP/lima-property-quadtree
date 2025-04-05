# Lima Property Quadtree - Sistema GIS de Proyectos Inmobiliarios

Esta aplicación web permite visualizar y gestionar proyectos inmobiliarios en Lima, Perú, utilizando una estructura de datos Quadtree para optimizar las consultas espaciales.

## Características

- Visualización de proyectos inmobiliarios en un mapa interactivo
- Estructura de datos Quadtree para consultas espaciales eficientes
- Filtrado de proyectos por distrito, tipo y estado
- Búsqueda de proyectos por nombre
- Adición de nuevos proyectos al mapa
- Interfaz responsiva y moderna

## Tecnologías Utilizadas

- HTML5, CSS3 y JavaScript (ES6+)
- Leaflet.js para la visualización del mapa
- Estructura de datos Quadtree implementada en JavaScript puro
- FontAwesome para iconos
- Google Fonts para tipografía

## Estructura del Proyecto

```
lima-property-quadtree/
│
├── index.html              # Archivo HTML principal
├── css/
│   └── style.css           # Estilos CSS
├── js/
│   ├── app.js              # Lógica principal de la aplicación
│   ├── quadtree.js         # Implementación de la estructura Quadtree
│   ├── data.js             # Datos de ejemplo
│   └── map.js              # Lógica para gestionar el mapa
├── img/                    # Imágenes y marcadores
└── README.md               # Este archivo
```

## Cómo Usar

1. Clona este repositorio o descarga los archivos.
2. Abre el archivo `index.html` en tu navegador web.
3. Explora el mapa para ver los proyectos inmobiliarios.
4. Utiliza los filtros y la búsqueda para encontrar proyectos específicos.
5. Agrega nuevos proyectos haciendo clic en el botón "Nuevo Proyecto".

## Implementación del Quadtree

El Quadtree es una estructura de datos en forma de árbol que divide el espacio en cuadrantes recursivamente. En este proyecto, se utiliza para:

- Optimizar la búsqueda de proyectos en áreas específicas
- Mejorar el rendimiento al mostrar solo los proyectos visibles en el mapa
- Facilitar las consultas espaciales

La implementación incluye las siguientes operaciones:

- Inserción de nuevos proyectos
- Subdivisión de nodos cuando superan su capacidad
- Consulta de proyectos dentro de un área específica
- Eliminación de proyectos

## Contribuciones

Las contribuciones son bienvenidas. Si encuentras algún problema o tienes alguna sugerencia, por favor crea un issue o envía un pull request.

## Licencia

Este proyecto está licenciado bajo la licencia MIT. 