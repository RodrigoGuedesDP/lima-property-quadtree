/**
 * Archivo principal de la aplicación que coordina la interacción con el usuario
 */

// Inicializar cuando el DOM esté completamente cargado
document.addEventListener('DOMContentLoaded', () => {
    // Crear una instancia del mapa
    const propertyMap = new PropertyMap();
    
    // Inicializar el mapa con los proyectos de ejemplo
    propertyMap.initialize('map', sampleProjects);
    
    // Configurar la búsqueda
    setupSearch(propertyMap);
    
    // Configurar los filtros
    setupFilters(propertyMap);
    
    // Configurar el formulario para agregar proyectos
    setupAddProjectForm(propertyMap);
});

/**
 * Configura la funcionalidad de búsqueda
 * @param {PropertyMap} propertyMap - Instancia del mapa de propiedades
 */
function setupSearch(propertyMap) {
    const searchInput = document.getElementById('search-input');
    const searchButton = document.getElementById('search-btn');
    
    // Buscar al hacer clic en el botón
    searchButton.addEventListener('click', () => {
        propertyMap.searchProjects(searchInput.value.trim());
    });
    
    // Buscar al presionar Enter
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            propertyMap.searchProjects(searchInput.value.trim());
        }
    });
}

/**
 * Configura los filtros
 * @param {PropertyMap} propertyMap - Instancia del mapa de propiedades
 */
function setupFilters(propertyMap) {
    const districtSelect = document.getElementById('filter-district');
    const typeSelect = document.getElementById('filter-type');
    const statusSelect = document.getElementById('filter-status');
    const applyFiltersButton = document.getElementById('apply-filters');
    
    applyFiltersButton.addEventListener('click', () => {
        const filters = {
            district: districtSelect.value,
            type: typeSelect.value,
            status: statusSelect.value
        };
        
        propertyMap.filterProjects(filters);
    });
}

/**
 * Configura el formulario para agregar proyectos
 * @param {PropertyMap} propertyMap - Instancia del mapa de propiedades
 */
function setupAddProjectForm(propertyMap) {
    const showAddFormButton = document.getElementById('show-add-form');
    const addProjectModal = document.getElementById('add-project-modal');
    const projectForm = document.getElementById('project-form');
    const closeButton = document.querySelector('.close');
    const cancelButton = document.getElementById('cancel-add');
    
    // Mostrar el modal al hacer clic en el botón
    showAddFormButton.addEventListener('click', () => {
        addProjectModal.classList.add('show');
    });
    
    // Cerrar el modal con el botón X
    closeButton.addEventListener('click', () => {
        addProjectModal.classList.remove('show');
    });
    
    // Cerrar el modal con el botón Cancelar
    cancelButton.addEventListener('click', () => {
        addProjectModal.classList.remove('show');
    });
    
    // Cerrar el modal al hacer clic fuera del contenido
    addProjectModal.addEventListener('click', (e) => {
        if (e.target === addProjectModal) {
            addProjectModal.classList.remove('show');
        }
    });
    
    // Manejar el envío del formulario
    projectForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Recopilar datos del formulario
        const newProject = {
            name: document.getElementById('project-name').value,
            district: document.getElementById('project-district').value,
            type: document.getElementById('project-type').value,
            status: document.getElementById('project-status').value,
            lat: parseFloat(document.getElementById('project-lat').value),
            lng: parseFloat(document.getElementById('project-lng').value),
            description: document.getElementById('project-description').value
        };
        
        // Agregar el proyecto
        propertyMap.addProject(newProject);
        
        // Cerrar el modal
        addProjectModal.classList.remove('show');
        
        // Limpiar el formulario
        projectForm.reset();
    });
    
    // Configurar un evento para permitir al usuario hacer clic en el mapa para seleccionar coordenadas
    setupMapCoordinateSelection(propertyMap);
}

/**
 * Configura la selección de coordenadas haciendo clic en el mapa
 * @param {PropertyMap} propertyMap - Instancia del mapa de propiedades
 */
function setupMapCoordinateSelection(propertyMap) {
    // Botón para activar la selección de coordenadas
    const locationPickerBtn = document.createElement('button');
    locationPickerBtn.textContent = 'Seleccionar ubicación en el mapa';
    locationPickerBtn.className = 'location-picker-btn';
    locationPickerBtn.style.marginTop = '10px';
    locationPickerBtn.style.padding = '8px';
    locationPickerBtn.style.backgroundColor = '#4c956c';
    locationPickerBtn.style.color = 'white';
    locationPickerBtn.style.border = 'none';
    locationPickerBtn.style.borderRadius = '4px';
    locationPickerBtn.style.cursor = 'pointer';
    
    // Insertar el botón después de los campos de coordenadas
    const lngField = document.getElementById('project-lng');
    lngField.parentNode.insertAdjacentElement('afterend', locationPickerBtn);
    
    let isPickingLocation = false;
    
    locationPickerBtn.addEventListener('click', (e) => {
        e.preventDefault();
        
        // Cerrar el modal temporalmente
        document.getElementById('add-project-modal').classList.remove('show');
        
        // Cambiar el estado
        isPickingLocation = true;
        
        // Cambiar el cursor del mapa
        document.getElementById('map').style.cursor = 'crosshair';
        
        // Mostrar un mensaje al usuario
        alert('Haz clic en el mapa para seleccionar la ubicación del proyecto.');
    });
    
    // Escuchar clics en el mapa
    propertyMap.map.on('click', (e) => {
        if (isPickingLocation) {
            // Obtener las coordenadas
            const lat = e.latlng.lat;
            const lng = e.latlng.lng;
            
            // Establecer las coordenadas en el formulario
            document.getElementById('project-lat').value = lat;
            document.getElementById('project-lng').value = lng;
            
            // Restaurar el cursor
            document.getElementById('map').style.cursor = '';
            
            // Cambiar el estado
            isPickingLocation = false;
            
            // Mostrar el modal nuevamente
            document.getElementById('add-project-modal').classList.add('show');
        }
    });
}

// Seleccionar coordenadas para ubicar nuevo proyecto
window.getPointFromMap = function() {
    alert('Haz clic en el mapa para seleccionar la ubicación del proyecto.');
    // La implementación completa está en setupMapCoordinateSelection
}; 