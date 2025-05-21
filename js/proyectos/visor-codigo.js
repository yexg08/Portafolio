// Función para crear un modal y mostrar el código del proyecto
function mostrarCodigoProyecto(proyectoId) {
    // Obtener los datos del proyecto
    const proyecto = proyectosData[proyectoId];
    
    if (!proyecto) {
        console.error('Proyecto no encontrado');
        return;
    }
    
    // Crear el modal
    const modal = document.createElement('div');
    modal.classList.add('codigo-modal');
    
    // Estructura del modal
    modal.innerHTML = `
        <div class="codigo-modal-contenido">
            <div class="codigo-modal-header">
                <h2>${proyecto.nombre} - Código</h2>
                <button class="codigo-modal-cerrar">&times;</button>
            </div>
            <div class="codigo-modal-body">
                <div class="codigo-sidebar">
                    <h3>Archivos</h3>
                    <ul class="codigo-archivos-lista">
                        ${proyecto.archivos.map((archivo, index) => `
                            <li data-index="${index}" class="${index === 0 ? 'activo' : ''}">
                                <i class="fas ${obtenerIconoArchivo(archivo.nombre)}"></i>
                                ${archivo.nombre}
                            </li>
                        `).join('')}
                    </ul>
                    <div class="codigo-info">
                        <h3>Tecnologías</h3>
                        <div class="codigo-tecnologias">
                            ${proyecto.tecnologias.map(tech => `
                                <span class="tech-tag">${tech}</span>
                            `).join('')}
                        </div>
                        <p class="codigo-descripcion">${proyecto.descripcion}</p>
                    </div>
                </div>
                <div class="codigo-contenido">
                    <div class="codigo-header">
                        <span class="codigo-archivo-actual">${proyecto.archivos[0].nombre}</span>
                        <span class="codigo-archivo-path">${proyecto.archivos[0].path}</span>
                    </div>
                    <div class="codigo-visor">
                        <pre><code id="codigo-contenedor">Cargando...</code></pre>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // Añadir el modal al DOM
    document.body.appendChild(modal);
    
    // Evitar que el scroll del body funcione cuando el modal está abierto
    document.body.style.overflow = 'hidden';
    
    // Cargar el contenido del primer archivo
    cargarContenidoArchivo(proyecto.archivos[0].path);
    
    // Event Listeners
    const cerrarBtn = modal.querySelector('.codigo-modal-cerrar');
    cerrarBtn.addEventListener('click', () => {
        document.body.removeChild(modal);
        document.body.style.overflow = 'auto';
    });
    
    // Cerrar haciendo clic fuera del contenido
    modal.addEventListener('click', e => {
        if (e.target === modal) {
            document.body.removeChild(modal);
            document.body.style.overflow = 'auto';
        }
    });
    
    // Cambiar entre archivos
    const archivoItems = modal.querySelectorAll('.codigo-archivos-lista li');
    archivoItems.forEach(item => {
        item.addEventListener('click', () => {
            // Remover clase activa de todos los items
            archivoItems.forEach(i => i.classList.remove('activo'));
            
            // Añadir clase activa al item seleccionado
            item.classList.add('activo');
            
            // Obtener el índice del archivo
            const index = parseInt(item.dataset.index);
            const archivo = proyecto.archivos[index];
            
            // Actualizar la cabecera del visor de código
            modal.querySelector('.codigo-archivo-actual').textContent = archivo.nombre;
            modal.querySelector('.codigo-archivo-path').textContent = archivo.path;
            
            // Cargar el contenido del archivo
            cargarContenidoArchivo(archivo.path);
        });
    });
}

// Función para determinar el icono según la extensión del archivo
function obtenerIconoArchivo(nombreArchivo) {
    const extension = nombreArchivo.split('.').pop().toLowerCase();
    
    switch (extension) {
        case 'html':
            return 'fa-html5';
        case 'css':
            return 'fa-css3-alt';
        case 'js':
            return 'fa-js';
        default:
            return 'fa-file-code';
    }
}

// Función para cargar el contenido de un archivo
async function cargarContenidoArchivo(ruta) {
    const contenedor = document.getElementById('codigo-contenedor');
    
    try {
        const respuesta = await fetch(ruta);
        
        if (!respuesta.ok) {
            throw new Error(`Error al cargar el archivo: ${respuesta.status}`);
        }
        
        const texto = await respuesta.text();
        
        // Escapar el HTML para mostrarlo como texto plano
        contenedor.textContent = texto;
        
        // Aplicar resaltado de sintaxis si hay una librería disponible
        if (window.hljs) {
            hljs.highlightElement(contenedor);
        }
    } catch (error) {
        console.error('Error al cargar el archivo:', error);
        contenedor.textContent = `Error al cargar el archivo: ${error.message}`;
    }
} 