// Configuración de Firebase
const firebaseConfig = {
    apiKey: "AIzaSyBL2vCn-ED3-bZ17WwbjsdvSc7Bp6ryAGA",
    authDomain: "taskflow-demo.firebaseapp.com",
    projectId: "taskflow-demo",
    storageBucket: "taskflow-demo.appspot.com",
    messagingSenderId: "254157256564",
    appId: "1:254157256564:web:6f4b3b1e50ef0e8f32a4ce"
};

// Inicializar Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// Referencias a elementos del DOM
const modal = document.getElementById('task-modal');
const newTaskBtn = document.getElementById('new-task-btn');
const cancelTaskBtn = document.getElementById('cancel-task');
const saveTaskBtn = document.getElementById('save-task');
const closeBtn = document.querySelector('.close');
const taskForm = document.getElementById('task-form');

// Referencias a los contenedores de tareas
const pendingTasksContainer = document.getElementById('pending-tasks');
const inProgressTasksContainer = document.getElementById('in-progress-tasks');
const completedTasksContainer = document.getElementById('completed-tasks');

// Referencias a los contadores
const allCountEl = document.getElementById('all-count');
const pendingCountEl = document.getElementById('pending-count');
const inProgressCountEl = document.getElementById('in-progress-count');
const completedCountEl = document.getElementById('completed-count');
const pendingColCountEl = document.getElementById('pending-col-count');
const inProgressColCountEl = document.getElementById('in-progress-col-count');
const completedColCountEl = document.getElementById('completed-col-count');

// Estado de la aplicación
let tasks = [];
let editingTaskId = null;

// Event Listeners
newTaskBtn.addEventListener('click', openTaskModal);
closeBtn.addEventListener('click', closeTaskModal);
cancelTaskBtn.addEventListener('click', closeTaskModal);
taskForm.addEventListener('submit', saveTask);

// Mostrar u ocultar el modal
function openTaskModal(e) {
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
    
    // Si estamos editando una tarea, llenar el formulario
    if (e.currentTarget.dataset && e.currentTarget.dataset.taskId) {
        const taskId = e.currentTarget.dataset.taskId;
        editingTaskId = taskId;
        
        const task = tasks.find(t => t.id === taskId);
        if (task) {
            document.getElementById('task-title').value = task.title;
            document.getElementById('task-description').value = task.description || '';
            document.getElementById('task-due-date').value = task.dueDate || '';
            document.getElementById('task-priority').value = task.priority;
            document.getElementById('task-status').value = task.status;
            document.getElementById('modal-title').textContent = 'Editar Tarea';
        }
    } else {
        // Si estamos creando una nueva tarea, limpiar el formulario
        taskForm.reset();
        document.getElementById('modal-title').textContent = 'Nueva Tarea';
        editingTaskId = null;
    }
}

function closeTaskModal() {
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
    taskForm.reset();
    editingTaskId = null;
}

// Cuando se hace clic fuera del modal, cerrarlo
window.addEventListener('click', (e) => {
    if (e.target === modal) {
        closeTaskModal();
    }
});

// Guardar una tarea
async function saveTask(e) {
    e.preventDefault();
    
    const title = document.getElementById('task-title').value;
    const description = document.getElementById('task-description').value;
    const dueDate = document.getElementById('task-due-date').value;
    const priority = document.getElementById('task-priority').value;
    const status = document.getElementById('task-status').value;
    
    try {
        // Si estamos editando una tarea existente
        if (editingTaskId) {
            await db.collection('tasks').doc(editingTaskId).update({
                title,
                description,
                dueDate,
                priority,
                status,
                updatedAt: new Date()
            });
        } else {
            // Si estamos creando una nueva tarea
            await db.collection('tasks').add({
                title,
                description,
                dueDate,
                priority,
                status,
                createdAt: new Date(),
                updatedAt: new Date()
            });
        }
        
        closeTaskModal();
        loadTasks();
    } catch (error) {
        console.error('Error al guardar la tarea:', error);
        alert('Hubo un error al guardar la tarea. Por favor, inténtalo de nuevo.');
    }
}

// Cargar las tareas desde Firebase
async function loadTasks() {
    try {
        const snapshot = await db.collection('tasks').orderBy('createdAt', 'desc').get();
        
        tasks = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
        
        renderTasks();
        updateCounters();
    } catch (error) {
        console.error('Error al cargar las tareas:', error);
        
        // Usar datos de ejemplo si Firebase falla
        loadSampleTasks();
    }
}

// Cargar datos de ejemplo si Firebase no está disponible
function loadSampleTasks() {
    tasks = [
        {
            id: '1',
            title: 'Diseñar página principal',
            description: 'Crear diseño responsive para la página de inicio',
            dueDate: '2025-05-30',
            priority: 'high',
            status: 'pending',
            createdAt: new Date()
        },
        {
            id: '2',
            title: 'Implementar autenticación',
            description: 'Configurar sistema de login con Google y email',
            dueDate: '2025-06-05',
            priority: 'medium',
            status: 'in-progress',
            createdAt: new Date()
        },
        {
            id: '3',
            title: 'Optimizar imágenes',
            description: 'Comprimir y optimizar todas las imágenes del sitio',
            dueDate: '2025-05-25',
            priority: 'low',
            status: 'completed',
            createdAt: new Date()
        },
        {
            id: '4',
            title: 'Corrección de bugs en formulario',
            description: 'Solucionar problemas de validación en el formulario de contacto',
            dueDate: '2025-05-28',
            priority: 'high',
            status: 'in-progress',
            createdAt: new Date()
        },
        {
            id: '5',
            title: 'Reunión con cliente',
            description: 'Preparar presentación para la reunión de seguimiento',
            dueDate: '2025-05-27',
            priority: 'medium',
            status: 'pending',
            createdAt: new Date()
        }
    ];
    
    renderTasks();
    updateCounters();
}

// Renderizar las tareas en sus respectivas columnas
function renderTasks() {
    // Limpiar contenedores
    pendingTasksContainer.innerHTML = '';
    inProgressTasksContainer.innerHTML = '';
    completedTasksContainer.innerHTML = '';
    
    // Filtrar y renderizar tareas por estado
    tasks.forEach(task => {
        const taskEl = createTaskElement(task);
        
        // Añadir la tarea a su columna correspondiente
        if (task.status === 'pending') {
            pendingTasksContainer.appendChild(taskEl);
        } else if (task.status === 'in-progress') {
            inProgressTasksContainer.appendChild(taskEl);
        } else if (task.status === 'completed') {
            completedTasksContainer.appendChild(taskEl);
        }
    });
    
    // Configurar drag and drop
    setupDragAndDrop();
}

// Crear elemento HTML para una tarea
function createTaskElement(task) {
    const taskEl = document.createElement('div');
    taskEl.className = `task-card priority-${task.priority}`;
    taskEl.draggable = true;
    taskEl.dataset.taskId = task.id;
    
    // Formatear fecha si existe
    let dueDateFormatted = '';
    if (task.dueDate) {
        const date = new Date(task.dueDate);
        dueDateFormatted = date.toLocaleDateString('es-ES', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    }
    
    // Mapear prioridad a texto en español
    let priorityText = 'Media';
    if (task.priority === 'low') priorityText = 'Baja';
    if (task.priority === 'high') priorityText = 'Alta';
    
    taskEl.innerHTML = `
        <div class="task-card-header">
            <h4 class="task-card-title">${task.title}</h4>
            <p class="task-card-desc">${task.description || 'Sin descripción'}</p>
        </div>
        <div class="task-card-footer">
            ${task.dueDate ? `
                <div class="task-due-date">
                    <i class="far fa-calendar-alt"></i>
                    <span>${dueDateFormatted}</span>
                </div>
            ` : ''}
            <div class="task-priority ${task.priority}">${priorityText}</div>
        </div>
        <div class="task-card-actions">
            <button class="action-btn edit-btn" data-task-id="${task.id}">
                <i class="fas fa-edit"></i>
            </button>
            <button class="action-btn delete-btn" data-task-id="${task.id}">
                <i class="fas fa-trash"></i>
            </button>
        </div>
    `;
    
    // Añadir event listeners a los botones de acción
    const editBtn = taskEl.querySelector('.edit-btn');
    const deleteBtn = taskEl.querySelector('.delete-btn');
    
    editBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        openTaskModal(e);
    });
    
    deleteBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        if (confirm('¿Estás seguro de que quieres eliminar esta tarea?')) {
            deleteTask(task.id);
        }
    });
    
    return taskEl;
}

// Eliminar una tarea
async function deleteTask(taskId) {
    try {
        await db.collection('tasks').doc(taskId).delete();
        loadTasks();
    } catch (error) {
        console.error('Error al eliminar la tarea:', error);
        
        // Si Firebase falla, eliminar localmente
        tasks = tasks.filter(task => task.id !== taskId);
        renderTasks();
        updateCounters();
    }
}

// Actualizar los contadores de tareas
function updateCounters() {
    const pendingTasks = tasks.filter(task => task.status === 'pending');
    const inProgressTasks = tasks.filter(task => task.status === 'in-progress');
    const completedTasks = tasks.filter(task => task.status === 'completed');
    
    allCountEl.textContent = tasks.length;
    pendingCountEl.textContent = pendingTasks.length;
    inProgressCountEl.textContent = inProgressTasks.length;
    completedCountEl.textContent = completedTasks.length;
    
    pendingColCountEl.textContent = pendingTasks.length;
    inProgressColCountEl.textContent = inProgressTasks.length;
    completedColCountEl.textContent = completedTasks.length;
}

// Configurar drag and drop
function setupDragAndDrop() {
    const taskCards = document.querySelectorAll('.task-card');
    const taskLists = document.querySelectorAll('.task-list');
    
    taskCards.forEach(card => {
        card.addEventListener('dragstart', () => {
            card.classList.add('dragging');
        });
        
        card.addEventListener('dragend', () => {
            card.classList.remove('dragging');
            
            // Obtener la nueva columna/estado
            const newStatus = card.parentElement.id.split('-')[0];
            updateTaskStatus(card.dataset.taskId, newStatus);
        });
    });
    
    taskLists.forEach(list => {
        list.addEventListener('dragover', e => {
            e.preventDefault();
            list.classList.add('drag-over');
            
            const draggingCard = document.querySelector('.dragging');
            if (draggingCard) {
                const afterElement = getDragAfterElement(list, e.clientY);
                if (afterElement) {
                    list.insertBefore(draggingCard, afterElement);
                } else {
                    list.appendChild(draggingCard);
                }
            }
        });
        
        list.addEventListener('dragleave', () => {
            list.classList.remove('drag-over');
        });
        
        list.addEventListener('drop', () => {
            list.classList.remove('drag-over');
        });
    });
}

// Calcular después de qué elemento debemos insertar un elemento arrastrado
function getDragAfterElement(container, y) {
    const draggableElements = [...container.querySelectorAll('.task-card:not(.dragging)')];
    
    return draggableElements.reduce((closest, child) => {
        const box = child.getBoundingClientRect();
        const offset = y - box.top - box.height / 2;
        
        if (offset < 0 && offset > closest.offset) {
            return { offset, element: child };
        } else {
            return closest;
        }
    }, { offset: Number.NEGATIVE_INFINITY }).element;
}

// Actualizar el estado de una tarea cuando se arrastra a otra columna
async function updateTaskStatus(taskId, newStatus) {
    try {
        await db.collection('tasks').doc(taskId).update({
            status: newStatus,
            updatedAt: new Date()
        });
        loadTasks();
    } catch (error) {
        console.error('Error al actualizar el estado de la tarea:', error);
        
        // Si Firebase falla, actualizar localmente
        tasks = tasks.map(task => {
            if (task.id === taskId) {
                return { ...task, status: newStatus };
            }
            return task;
        });
        
        updateCounters();
    }
}

// Filtrar tareas
const filterItems = document.querySelectorAll('.filter-item');
filterItems.forEach(item => {
    item.addEventListener('click', () => {
        const filter = item.dataset.filter;
        
        // Filtrar las tareas
        if (filter === 'all') {
            renderTasks();
        } else {
            const filteredTasks = tasks.filter(task => task.status === filter);
            
            // Limpiar contenedores
            pendingTasksContainer.innerHTML = '';
            inProgressTasksContainer.innerHTML = '';
            completedTasksContainer.innerHTML = '';
            
            // Mostrar solo las tareas filtradas
            filteredTasks.forEach(task => {
                const taskEl = createTaskElement(task);
                
                if (task.status === 'pending') {
                    pendingTasksContainer.appendChild(taskEl);
                } else if (task.status === 'in-progress') {
                    inProgressTasksContainer.appendChild(taskEl);
                } else if (task.status === 'completed') {
                    completedTasksContainer.appendChild(taskEl);
                }
            });
            
            setupDragAndDrop();
        }
        
        // Actualizar UI de filtros
        filterItems.forEach(fi => fi.classList.remove('active'));
        item.classList.add('active');
    });
});

// Cargar las tareas al iniciar
window.addEventListener('DOMContentLoaded', () => {
    loadTasks();
}); 