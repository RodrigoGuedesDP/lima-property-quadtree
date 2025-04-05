/**
 * Gestión del mapa y visualización de proyectos inmobiliarios usando Leaflet
 */

// Configuraciones iniciales del mapa
const mapConfig = {
    center: [-12.10, -77.03], // Centro aproximado de Lima
    zoom: 13,
    minZoom: 11,
    maxZoom: 18
};

// Clase para gestionar el mapa
class PropertyMap {
    constructor() {
        this.map = null;
        this.markers = {};
        this.quadtree = null;
        this.visibleProjects = [];
        this.selectedProject = null;
        this.categoryColors = {
            'residencial': '#4c956c',  // Verde
            'comercial': '#2b2d42',    // Negro azulado
            'mixto': '#ffc857'         // Amarillo
        };
        this.statusIcons = {
            'planos': 'img/marker-blueprint.png',
            'construccion': 'img/marker-construction.png',
            'finalizado': 'img/marker-completed.png'
        };
        
        // Iconos por defecto para cada estado
        this.defaultIcon = L.icon({
            iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
            iconSize: [25, 41],
            iconAnchor: [12, 41],
            popupAnchor: [1, -34]
        });
        
        this.highlightedIcon = L.icon({
            iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
            iconSize: [30, 45],
            iconAnchor: [15, 45],
            popupAnchor: [1, -34]
        });
    }

    /**
     * Inicializa el mapa y los datos de proyectos
     * @param {string} mapElementId - ID del elemento HTML donde se mostrará el mapa
     * @param {Array} projects - Arreglo de proyectos inmobiliarios
     */
    initialize(mapElementId, projects) {
        // Inicializar el mapa
        this.map = L.map(mapElementId, {
            center: mapConfig.center,
            zoom: mapConfig.zoom,
            minZoom: mapConfig.minZoom,
            maxZoom: mapConfig.maxZoom
        });

        // Agregar el mapa base (tiles)
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(this.map);

        // Configurar coordenadas para el quadtree (convertir latitud/longitud a coordenadas x,y para el quadtree)
        const points = projects.map(project => ({
            ...project,
            x: project.lng,
            y: project.lat
        }));

        // Encontrar los límites para el quadtree
        const bounds = this.calculateBounds(points);
        
        // Crear el quadtree
        const boundary = new Boundary(
            (bounds.maxX + bounds.minX) / 2,
            (bounds.maxY + bounds.minY) / 2,
            (bounds.maxX - bounds.minX) * 1.1, // Agregar un margen del 10%
            (bounds.maxY - bounds.minY) * 1.1
        );
        
        this.quadtree = new Quadtree(boundary, 4, 10);
        
        // Insertar todos los puntos en el quadtree
        points.forEach(point => {
            this.quadtree.insert(point);
        });
        
        // Mostrar todos los proyectos inicialmente
        this.visibleProjects = projects;
        this.showProjects(projects);
        
        // Configurar el evento para actualizar los proyectos visibles cuando el mapa se mueve
        this.map.on('moveend', () => {
            this.updateVisibleProjects();
        });
    }
    
    /**
     * Calcula los límites para el conjunto de puntos
     * @param {Array} points - Arreglo de puntos con coordenadas x,y
     * @returns {Object} - Objeto con los límites minX, maxX, minY, maxY
     */
    calculateBounds(points) {
        let minX = Infinity;
        let maxX = -Infinity;
        let minY = Infinity;
        let maxY = -Infinity;
        
        points.forEach(point => {
            minX = Math.min(minX, point.x);
            maxX = Math.max(maxX, point.x);
            minY = Math.min(minY, point.y);
            maxY = Math.max(maxY, point.y);
        });
        
        return { minX, maxX, minY, maxY };
    }
    
    /**
     * Actualiza los proyectos visibles basado en los límites del mapa
     */
    updateVisibleProjects() {
        const bounds = this.map.getBounds();
        const range = new Boundary(
            (bounds.getEast() + bounds.getWest()) / 2,
            (bounds.getNorth() + bounds.getSouth()) / 2,
            bounds.getEast() - bounds.getWest(),
            bounds.getNorth() - bounds.getSouth()
        );
        
        this.visibleProjects = this.quadtree.query(range);
        this.showProjects(this.visibleProjects);
        
        // Actualizar la lista de proyectos en la interfaz
        this.updateProjectList();
    }
    
    /**
     * Muestra los proyectos en el mapa
     * @param {Array} projects - Arreglo de proyectos a mostrar
     */
    showProjects(projects) {
        // Limpiar marcadores existentes
        for (const id in this.markers) {
            this.map.removeLayer(this.markers[id]);
        }
        this.markers = {};
        
        // Crear nuevos marcadores
        projects.forEach(project => {
            const marker = L.marker([project.lat, project.lng], {
                title: project.name
            }).addTo(this.map);
            
            marker.on('click', () => {
                this.selectProject(project);
            });
            
            this.markers[project.id] = marker;
        });
    }
    
    /**
     * Selecciona un proyecto y muestra sus detalles
     * @param {Object} project - Proyecto seleccionado
     */
    selectProject(project) {
        // Desseleccionar el proyecto anterior
        if (this.selectedProject) {
            const prevMarker = this.markers[this.selectedProject.id];
            if (prevMarker) {
                prevMarker.setIcon(this.defaultIcon);
            }
        }
        
        this.selectedProject = project;
        
        // Resaltar el marcador del proyecto seleccionado
        const marker = this.markers[project.id];
        if (marker) {
            marker.setIcon(this.highlightedIcon);
            this.map.panTo([project.lat, project.lng]);
        }
        
        // Mostrar la información del proyecto
        this.showProjectInfo(project);
        
        // Destacar el proyecto en la lista
        this.highlightProjectInList(project.id);
    }
    
    /**
     * Muestra la información detallada del proyecto
     * @param {Object} project - Proyecto a mostrar
     */
    showProjectInfo(project) {
        const projectDetailsElement = document.getElementById('project-details');
        const projectInfoPanel = document.getElementById('project-info');
        
        // Traducir el estado y tipo de proyecto para mostrar
        const statusText = {
            'construccion': 'En Construcción',
            'finalizado': 'Finalizado',
            'planos': 'En Planos'
        };
        
        const typeText = {
            'residencial': 'Residencial',
            'comercial': 'Comercial',
            'mixto': 'Uso Mixto'
        };
        
        // Crear contenido HTML
        projectDetailsElement.innerHTML = `
            <h2>${project.name}</h2>
            <span class="project-status status-${project.status}">${statusText[project.status]}</span>
            <p><strong>Tipo:</strong> ${typeText[project.type]}</p>
            <p><strong>Distrito:</strong> ${project.district.charAt(0).toUpperCase() + project.district.slice(1)}</p>
            <p><strong>Descripción:</strong> ${project.description}</p>
            <p><strong>Coordenadas:</strong> ${project.lat.toFixed(6)}, ${project.lng.toFixed(6)}</p>
        `;
        
        // Mostrar el panel
        projectInfoPanel.classList.add('show');
        
        // Configurar el botón para cerrar el panel
        document.querySelector('.close-info').addEventListener('click', () => {
            projectInfoPanel.classList.remove('show');
        });
    }
    
    /**
     * Resalta un proyecto en la lista de proyectos
     * @param {number} projectId - ID del proyecto a resaltar
     */
    highlightProjectInList(projectId) {
        const projectItems = document.querySelectorAll('#projects li');
        projectItems.forEach(item => {
            item.classList.remove('selected');
            if (parseInt(item.dataset.id) === projectId) {
                item.classList.add('selected');
                item.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            }
        });
    }
    
    /**
     * Actualiza la lista de proyectos en la interfaz
     */
    updateProjectList() {
        const projectsListElement = document.getElementById('projects');
        projectsListElement.innerHTML = '';
        
        this.visibleProjects.forEach(project => {
            const li = document.createElement('li');
            li.textContent = project.name;
            li.dataset.id = project.id;
            li.addEventListener('click', () => {
                this.selectProject(project);
            });
            
            projectsListElement.appendChild(li);
        });
    }
    
    /**
     * Filtra los proyectos según los criterios seleccionados
     * @param {Object} filters - Criterios de filtrado
     */
    filterProjects(filters) {
        const filteredProjects = this.quadtree.filterPoints(project => {
            let matchesDistrict = true;
            let matchesType = true;
            let matchesStatus = true;
            
            if (filters.district) {
                matchesDistrict = project.district === filters.district;
            }
            
            if (filters.type) {
                matchesType = project.type === filters.type;
            }
            
            if (filters.status) {
                matchesStatus = project.status === filters.status;
            }
            
            return matchesDistrict && matchesType && matchesStatus;
        });
        
        this.visibleProjects = filteredProjects;
        this.showProjects(filteredProjects);
        this.updateProjectList();
    }
    
    /**
     * Busca proyectos por nombre
     * @param {string} query - Texto de búsqueda
     */
    searchProjects(query) {
        if (!query) {
            this.updateVisibleProjects();
            return;
        }
        
        const queryLower = query.toLowerCase();
        const filteredProjects = this.quadtree.filterPoints(project => {
            return project.name.toLowerCase().includes(queryLower);
        });
        
        this.visibleProjects = filteredProjects;
        this.showProjects(filteredProjects);
        this.updateProjectList();
    }
    
    /**
     * Agrega un nuevo proyecto al mapa y al quadtree
     * @param {Object} project - Nuevo proyecto a agregar
     */
    addProject(project) {
        // Asignar un ID único
        project.id = Date.now();
        
        // Agregar coordenadas x,y para el quadtree
        project.x = project.lng;
        project.y = project.lat;
        
        // Insertar en el quadtree
        this.quadtree.insert(project);
        
        // Actualizar la visualización
        this.visibleProjects.push(project);
        this.showProjects(this.visibleProjects);
        this.updateProjectList();
        
        // Seleccionar el nuevo proyecto
        this.selectProject(project);
    }
    
    /**
     * Elimina un proyecto del mapa y del quadtree
     * @param {number} projectId - ID del proyecto a eliminar
     */
    removeProject(projectId) {
        // Encontrar el proyecto
        const projectToRemove = this.visibleProjects.find(p => p.id === projectId);
        
        if (projectToRemove) {
            // Eliminar del quadtree
            this.quadtree.remove(projectToRemove);
            
            // Eliminar el marcador del mapa
            if (this.markers[projectId]) {
                this.map.removeLayer(this.markers[projectId]);
                delete this.markers[projectId];
            }
            
            // Actualizar la lista de proyectos visibles
            this.visibleProjects = this.visibleProjects.filter(p => p.id !== projectId);
            this.updateProjectList();
            
            // Cerrar el panel de información si es el proyecto seleccionado
            if (this.selectedProject && this.selectedProject.id === projectId) {
                document.getElementById('project-info').classList.remove('show');
                this.selectedProject = null;
            }
        }
    }
}

// Exportar la clase para su uso en otros archivos
window.PropertyMap = PropertyMap; 