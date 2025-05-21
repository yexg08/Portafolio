// Función para inicializar los enlaces a los proyectos
function inicializarEnlacesProyectos() {
    // Mapeo de proyectos según su orden en el HTML
    const proyectosOrden = [
        "task-manager",      // Proyecto 1: Aplicación de Gestión de Tareas
        "e-commerce",        // Proyecto 2: Plataforma E-commerce
        "analytics-dashboard" // Proyecto 3: Dashboard Analítico
    ];
    
    // Obtener todos los cards de proyectos
    const proyectoCards = document.querySelectorAll('.project-card');
    
    // Verificar que tenemos el mismo número de cards que proyectos
    if (proyectoCards.length !== proyectosOrden.length) {
        console.error('El número de tarjetas de proyectos no coincide con el número de proyectos definidos');
        return;
    }
    
    // Para cada card, configurar los enlaces de Demo y Código
    proyectoCards.forEach((card, index) => {
        const proyectoId = proyectosOrden[index];
        const proyecto = proyectosData[proyectoId];
        
        if (!proyecto) {
            console.error(`No se encontró la configuración para el proyecto ${proyectoId}`);
            return;
        }
        
        // Actualizar el título y descripción con los datos reales
        const titulo = card.querySelector('h3');
        const descripcion = card.querySelector('p');
        const techStack = card.querySelector('.tech-stack');
        
        if (titulo) titulo.textContent = proyecto.nombre;
        if (descripcion) descripcion.textContent = proyecto.descripcion;
        
        // Actualizar el tech stack con las tecnologías reales
        if (techStack) {
            techStack.innerHTML = '';
            proyecto.tecnologias.forEach(tech => {
                const span = document.createElement('span');
                span.textContent = tech;
                techStack.appendChild(span);
            });
        }
        
        // Obtener los botones
        const demoBtn = card.querySelector('.project-links a:first-child');
        const codigoBtn = card.querySelector('.project-links a:last-child');
        
        // Configurar el botón de Demo - usar ruta absoluta desde la raíz del sitio
        if (demoBtn) {
            // Convertir la ruta relativa a una ruta absoluta basada en la URL actual
            const rutaBase = window.location.origin + window.location.pathname.replace(/\/[^\/]*$/, '/');
            demoBtn.href = rutaBase + proyecto.demo;
            demoBtn.target = "_blank"; // Abrir en nueva pestaña
            
            // Añadir un evento onclick para asegurar que el enlace funcione
            demoBtn.onclick = function(e) {
                e.preventDefault(); // Prevenir comportamiento predeterminado
                window.open(this.href, '_blank'); // Abrir en nueva pestaña manualmente
            };
            
            console.log('Demo link configurado:', demoBtn.href);
        }
        
        // Configurar el botón de Código
        if (codigoBtn) {
            codigoBtn.href = "javascript:void(0)";
            codigoBtn.addEventListener('click', () => {
                mostrarCodigoProyecto(proyectoId);
            });
        }
    });
}

// Función para asegurarse de que inicializarEnlacesProyectos se ejecute correctamente
function cargarEnlaces() {
    console.log('Intentando cargar enlaces...');
    
    if (typeof proyectosData !== 'undefined' && typeof mostrarCodigoProyecto !== 'undefined') {
        console.log('Datos y funciones disponibles, inicializando enlaces...');
        inicializarEnlacesProyectos();
    } else {
        console.error('Falta cargar los archivos de datos de proyectos o el visor de código');
        console.log('Reintentando en 500ms...');
        // Reintento después de 500ms por si los scripts se están cargando asincrónicamente
        setTimeout(cargarEnlaces, 500);
    }
}

// Ejecutar cuando el DOM esté cargado
document.addEventListener('DOMContentLoaded', cargarEnlaces); 