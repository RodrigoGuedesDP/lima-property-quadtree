/**
 * Clase que representa un límite rectangular para los nodos del Quadtree
 */
class Boundary {
    constructor(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }

    /**
     * Verifica si un punto está dentro del límite
     * @param {Object} point - Punto con coordenadas {x, y}
     * @returns {boolean} - Verdadero si el punto está dentro del límite
     */
    contains(point) {
        return (
            point.x >= this.x - this.width/2 &&
            point.x < this.x + this.width/2 &&
            point.y >= this.y - this.height/2 &&
            point.y < this.y + this.height/2
        );
    }

    /**
     * Verifica si este límite se intersecta con otro límite
     * @param {Boundary} range - Otro límite para verificar intersección
     * @returns {boolean} - Verdadero si los límites se intersectan
     */
    intersects(range) {
        return !(
            range.x - range.width/2 > this.x + this.width/2 ||
            range.x + range.width/2 < this.x - this.width/2 ||
            range.y - range.height/2 > this.y + this.height/2 ||
            range.y + range.height/2 < this.y - this.height/2
        );
    }
}

/**
 * Clase Quadtree para gestionar puntos en un espacio bidimensional
 */
class Quadtree {
    /**
     * Constructor de Quadtree
     * @param {Boundary} boundary - Límite del nodo
     * @param {number} capacity - Número máximo de puntos antes de subdividir
     * @param {number} maxDepth - Profundidad máxima del árbol
     * @param {number} depth - Profundidad actual del nodo (para uso interno)
     */
    constructor(boundary, capacity = 4, maxDepth = 10, depth = 0) {
        this.boundary = boundary;
        this.capacity = capacity;
        this.points = [];
        this.divided = false;
        this.maxDepth = maxDepth;
        this.depth = depth;
        
        // Referencias a los nodos hijos
        this.northeast = null;
        this.northwest = null;
        this.southeast = null;
        this.southwest = null;
    }

    /**
     * Subdivide el nodo actual en cuatro nodos hijos
     */
    subdivide() {
        const x = this.boundary.x;
        const y = this.boundary.y;
        const w = this.boundary.width / 2;
        const h = this.boundary.height / 2;
        const nextDepth = this.depth + 1;

        const ne = new Boundary(x + w/2, y - h/2, w, h);
        const nw = new Boundary(x - w/2, y - h/2, w, h);
        const se = new Boundary(x + w/2, y + h/2, w, h);
        const sw = new Boundary(x - w/2, y + h/2, w, h);

        this.northeast = new Quadtree(ne, this.capacity, this.maxDepth, nextDepth);
        this.northwest = new Quadtree(nw, this.capacity, this.maxDepth, nextDepth);
        this.southeast = new Quadtree(se, this.capacity, this.maxDepth, nextDepth);
        this.southwest = new Quadtree(sw, this.capacity, this.maxDepth, nextDepth);

        this.divided = true;

        // Redistribuir los puntos existentes a los nodos hijos
        for (let point of this.points) {
            this.northeast.insert(point) ||
            this.northwest.insert(point) ||
            this.southeast.insert(point) ||
            this.southwest.insert(point);
        }
        
        // Vaciar el arreglo de puntos del nodo padre
        this.points = [];
    }

    /**
     * Inserta un punto en el Quadtree
     * @param {Object} point - Punto a insertar (debe tener x, y)
     * @returns {boolean} - Verdadero si se insertó correctamente
     */
    insert(point) {
        // Verificar si el punto está dentro del límite del nodo
        if (!this.boundary.contains(point)) {
            return false;
        }

        // Si hay espacio y no hemos alcanzado la profundidad máxima, agregar el punto
        if (this.points.length < this.capacity && !this.divided && this.depth < this.maxDepth) {
            this.points.push(point);
            return true;
        }

        // Subdividir si aún no se ha dividido y no hemos alcanzado la profundidad máxima
        if (!this.divided && this.depth < this.maxDepth) {
            this.subdivide();
        }

        // Si ya está dividido, intentar insertar en los nodos hijos
        if (this.divided) {
            return (
                this.northeast.insert(point) ||
                this.northwest.insert(point) ||
                this.southeast.insert(point) ||
                this.southwest.insert(point)
            );
        }

        // Si hemos alcanzado la profundidad máxima, simplemente agregar el punto aquí
        this.points.push(point);
        return true;
    }

    /**
     * Consulta todos los puntos dentro de un rango
     * @param {Boundary} range - Límite para la búsqueda
     * @returns {Array} - Arreglo de puntos encontrados
     */
    query(range) {
        const foundPoints = [];

        // Verificar si el rango se intersecta con este nodo
        if (!this.boundary.intersects(range)) {
            return foundPoints;
        }

        // Verificar puntos en este nodo
        for (let point of this.points) {
            if (range.contains(point)) {
                foundPoints.push(point);
            }
        }

        // Si este nodo está dividido, consultar a los hijos
        if (this.divided) {
            foundPoints.push(...this.northeast.query(range));
            foundPoints.push(...this.northwest.query(range));
            foundPoints.push(...this.southeast.query(range));
            foundPoints.push(...this.southwest.query(range));
        }

        return foundPoints;
    }

    /**
     * Elimina un punto del Quadtree
     * @param {Object} point - Punto a eliminar
     * @param {Function} compareFunc - Función para comparar puntos
     * @returns {boolean} - Verdadero si se eliminó correctamente
     */
    remove(point, compareFunc = (p1, p2) => p1.id === p2.id) {
        // Verificar si el punto está dentro del límite del nodo
        if (!this.boundary.contains(point)) {
            return false;
        }

        // Verificar si el punto está en este nodo
        for (let i = 0; i < this.points.length; i++) {
            if (compareFunc(this.points[i], point)) {
                this.points.splice(i, 1);
                return true;
            }
        }

        // Si este nodo está dividido, intentar eliminar de los hijos
        if (this.divided) {
            return (
                this.northeast.remove(point, compareFunc) ||
                this.northwest.remove(point, compareFunc) ||
                this.southeast.remove(point, compareFunc) ||
                this.southwest.remove(point, compareFunc)
            );
        }

        return false;
    }

    /**
     * Encuentra todos los puntos en el Quadtree
     * @returns {Array} - Todos los puntos en el Quadtree
     */
    getAllPoints() {
        let allPoints = [...this.points];

        if (this.divided) {
            allPoints = allPoints.concat(
                this.northeast.getAllPoints(),
                this.northwest.getAllPoints(),
                this.southeast.getAllPoints(),
                this.southwest.getAllPoints()
            );
        }

        return allPoints;
    }

    /**
     * Filtra puntos basados en una función de filtro
     * @param {Function} filterFunc - Función para filtrar puntos
     * @returns {Array} - Puntos que pasaron el filtro
     */
    filterPoints(filterFunc) {
        let filteredPoints = this.points.filter(filterFunc);

        if (this.divided) {
            filteredPoints = filteredPoints.concat(
                this.northeast.filterPoints(filterFunc),
                this.northwest.filterPoints(filterFunc),
                this.southeast.filterPoints(filterFunc),
                this.southwest.filterPoints(filterFunc)
            );
        }

        return filteredPoints;
    }
}

// Exportar las clases para su uso en otros archivos
window.Boundary = Boundary;
window.Quadtree = Quadtree;

// Ejemplo práctico para demostrar
puntos_demo = [
    {"x": -77.0323, "y": -12.0964, "nombre": "Torre Bicentenario"},
    {"x": -77.0412, "y": -12.1214, "nombre": "Residencial Parque del Mar"},
    {"x": -77.0359, "y": -12.0825, "nombre": "Torres Lince View"},
    {"x": -77.0223, "y": -12.1490, "nombre": "Barranco Arte Hub"},
    {"x": -77.0507, "y": -12.0914, "nombre": "Edificio Green Office"}
]

// Mostrar paso a paso:
quadtree = Quadtree(boundary=Boundary(-77.03, -12.10, 0.5, 0.5))
for punto in puntos_demo:
    print(f"Insertando: {punto['nombre']}")
    quadtree.insert(punto)
    # Aquí mostrarías el estado del árbol después de cada inserción 

// Ejemplo de búsqueda por área
area_busqueda = Boundary(
    x=-77.0323,  # Centro de San Isidro
    y=-12.0964,
    width=0.1,   # Aproximadamente 1km
    height=0.1
)

proyectos_encontrados = quadtree.query(area_busqueda)
print("Proyectos encontrados en el área:")
for proyecto in proyectos_encontrados:
    print(f"- {proyecto['nombre']}") 

// Ejemplo de eliminación
proyecto_a_eliminar = {
    "x": -77.0323,
    "y": -12.0964,
    "nombre": "Torre Bicentenario"
}

print(f"Eliminando: {proyecto_a_eliminar['nombre']}")
quadtree.remove(proyecto_a_eliminar) 

// Crear varios proyectos cercanos en Miraflores
proyectos_miraflores = [
    {"x": -77.0282, "y": -12.1176, "nombre": "Proyecto 1"},
    {"x": -77.0283, "y": -12.1177, "nombre": "Proyecto 2"},
    {"x": -77.0284, "y": -12.1178, "nombre": "Proyecto 3"},
    # ... más proyectos cercanos
] 

import time

def medir_tiempo(funcion, *args):
    inicio = time.time()
    resultado = funcion(*args)
    fin = time.time()
    return fin - inicio, resultado

# Comparar búsqueda en Quadtree vs búsqueda lineal
tiempo_quadtree, resultados_quadtree = medir_tiempo(
    quadtree.query, area_busqueda
)

tiempo_lineal, resultados_lineal = medir_tiempo(
    busqueda_lineal, todos_los_proyectos, area_busqueda
)

print(f"Tiempo Quadtree: {tiempo_quadtree:.4f} segundos")
print(f"Tiempo Búsqueda Lineal: {tiempo_lineal:.4f} segundos") 