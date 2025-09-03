/**
 * Aplicación Principal del Sistema de Gestión Médica MediCare
 * Contiene toda la lógica de la interfaz de usuario y manejo de eventos
 */

// Variables globales
let pacienteEditando = null;
let citaEditando = null;
let historialEditando = null;

// Inicialización de la aplicación
document.addEventListener('DOMContentLoaded', function() {
    inicializarApp();
});

function inicializarApp() {
    // Configurar navegación
    configurarNavegacion();
    
    // Cargar datos iniciales
    cargarDashboard();
    cargarPacientes();
    cargarCitas();
    cargarHistorial();
    cargarSelectores();
    
    // Configurar formularios
    configurarFormularios();
    
    // Configurar búsquedas
    configurarBusquedas();
    
    console.log('Aplicación MediCare inicializada correctamente');
}

// Configuración de navegación
function configurarNavegacion() {
    const navButtons = document.querySelectorAll('.nav-btn');
    const sections = document.querySelectorAll('.section');
    
    navButtons.forEach(button => {
        button.addEventListener('click', function() {
            const targetSection = this.getAttribute('data-section');
            
            // Remover clase active de todos los botones y secciones
            navButtons.forEach(btn => btn.classList.remove('active'));
            sections.forEach(section => section.classList.remove('active'));
            
            // Agregar clase active al botón y sección correspondiente
            this.classList.add('active');
            document.getElementById(targetSection).classList.add('active');
            
            // Actualizar datos según la sección
            switch(targetSection) {
                case 'dashboard':
                    cargarDashboard();
                    break;
                case 'pacientes':
                    cargarPacientes();
                    break;
                case 'citas':
                    cargarCitas();
                    break;
                case 'historial':
                    cargarHistorial();
                    break;
                case 'reportes':
                    // Los reportes se cargan bajo demanda
                    break;
            }
        });
    });
}

// Dashboard
function cargarDashboard() {
    const stats = Reportes.obtenerEstadisticas();
    
    document.getElementById('total-pacientes').textContent = stats.totalPacientes;
    document.getElementById('citas-hoy').textContent = stats.citasHoy;
    document.getElementById('total-doctores').textContent = stats.totalDoctores;
    document.getElementById('historiales').textContent = stats.totalHistoriales;
}

// Gestión de Pacientes
function cargarPacientes() {
    const pacientes = PacientesDB.obtenerTodos();
    const tbody = document.querySelector('#tabla-pacientes tbody');
    
    tbody.innerHTML = '';
    
    pacientes.forEach(paciente => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${paciente.id}</td>
            <td>${paciente.nombre}</td>
            <td>${paciente.edad}</td>
            <td>${paciente.telefono}</td>
            <td>${paciente.email}</td>
            <td class="action-buttons">
                <button class="btn btn-secondary" onclick="editarPaciente(${paciente.id})">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn btn-danger" onclick="eliminarPaciente(${paciente.id})">
                    <i class="fas fa-trash"></i>
                </button>
                <button class="btn btn-success" onclick="verHistorialPaciente(${paciente.id})">
                    <i class="fas fa-file-medical"></i>
                </button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

function mostrarFormularioPaciente() {
    pacienteEditando = null;
    document.getElementById('form-paciente').reset();
    document.getElementById('paciente-id').value = '';
    document.getElementById('modal-paciente').style.display = 'block';
}

function editarPaciente(id) {
    const paciente = PacientesDB.obtenerPorId(id);
    if (paciente) {
        pacienteEditando = paciente;
        document.getElementById('paciente-id').value = paciente.id;
        document.getElementById('paciente-nombre').value = paciente.nombre;
        document.getElementById('paciente-edad').value = paciente.edad;
        document.getElementById('paciente-telefono').value = paciente.telefono;
        document.getElementById('paciente-email').value = paciente.email;
        document.getElementById('paciente-direccion').value = paciente.direccion;
        document.getElementById('modal-paciente').style.display = 'block';
    }
}

function eliminarPaciente(id) {
    if (confirm('¿Está seguro de que desea eliminar este paciente?')) {
        PacientesDB.eliminar(id);
        cargarPacientes();
        cargarDashboard();
        mostrarNotificacion('Paciente eliminado correctamente', 'success');
    }
}

function buscarPaciente() {
    const termino = document.getElementById('buscar-paciente').value;
    if (termino.trim() === '') {
        cargarPacientes();
        return;
    }
    
    const pacientesEncontrados = PacientesDB.buscarPorNombre(termino);
    const tbody = document.querySelector('#tabla-pacientes tbody');
    
    tbody.innerHTML = '';
    
    pacientesEncontrados.forEach(paciente => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${paciente.id}</td>
            <td>${paciente.nombre}</td>
            <td>${paciente.edad}</td>
            <td>${paciente.telefono}</td>
            <td>${paciente.email}</td>
            <td class="action-buttons">
                <button class="btn btn-secondary" onclick="editarPaciente(${paciente.id})">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn btn-danger" onclick="eliminarPaciente(${paciente.id})">
                    <i class="fas fa-trash"></i>
                </button>
                <button class="btn btn-success" onclick="verHistorialPaciente(${paciente.id})">
                    <i class="fas fa-file-medical"></i>
                </button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

function verHistorialPaciente(pacienteId) {
    // Cambiar a la sección de historial y filtrar por paciente
    document.querySelector('[data-section="historial"]').click();
    const historialPaciente = HistorialDB.obtenerPorPaciente(pacienteId);
    mostrarHistorialFiltrado(historialPaciente);
}

// Gestión de Citas
function cargarCitas() {
    const citas = CitasDB.obtenerTodos();
    const tbody = document.querySelector('#tabla-citas tbody');
    
    tbody.innerHTML = '';
    
    citas.forEach(cita => {
        const paciente = PacientesDB.obtenerPorId(cita.paciente_id);
        const doctor = DoctoresDB.obtenerPorId(cita.doctor_id);
        
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${cita.id}</td>
            <td>${paciente ? paciente.nombre : 'Paciente no encontrado'}</td>
            <td>${doctor ? doctor.nombre : 'Doctor no encontrado'}</td>
            <td>${Utils.formatearFecha(cita.fecha)}</td>
            <td>${cita.hora}</td>
            <td><span class="status-badge status-${cita.estado}">${cita.estado}</span></td>
            <td class="action-buttons">
                <button class="btn btn-secondary" onclick="editarCita(${cita.id})">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn btn-danger" onclick="eliminarCita(${cita.id})">
                    <i class="fas fa-trash"></i>
                </button>
                ${cita.estado === 'programada' ? 
                    `<button class="btn btn-success" onclick="completarCita(${cita.id})">
                        <i class="fas fa-check"></i>
                    </button>` : ''}
            </td>
        `;
        tbody.appendChild(row);
    });
}

function mostrarFormularioCita() {
    citaEditando = null;
    document.getElementById('form-cita').reset();
    document.getElementById('cita-id').value = '';
    document.getElementById('modal-cita').style.display = 'block';
}

function editarCita(id) {
    const cita = CitasDB.obtenerPorId(id);
    if (cita) {
        citaEditando = cita;
        document.getElementById('cita-id').value = cita.id;
        document.getElementById('cita-paciente').value = cita.paciente_id;
        document.getElementById('cita-doctor').value = cita.doctor_id;
        document.getElementById('cita-fecha').value = cita.fecha;
        document.getElementById('cita-hora').value = cita.hora;
        document.getElementById('cita-motivo').value = cita.motivo;
        document.getElementById('modal-cita').style.display = 'block';
    }
}

function eliminarCita(id) {
    if (confirm('¿Está seguro de que desea eliminar esta cita?')) {
        CitasDB.eliminar(id);
        cargarCitas();
        cargarDashboard();
        mostrarNotificacion('Cita eliminada correctamente', 'success');
    }
}

function completarCita(id) {
    CitasDB.actualizar(id, { estado: 'completada' });
    cargarCitas();
    mostrarNotificacion('Cita marcada como completada', 'success');
}

function filtrarCitas() {
    const fecha = document.getElementById('filtro-fecha').value;
    const doctorId = document.getElementById('filtro-doctor').value;
    
    let citasFiltradas = CitasDB.obtenerTodos();
    
    if (fecha) {
        citasFiltradas = citasFiltradas.filter(c => c.fecha === fecha);
    }
    
    if (doctorId) {
        citasFiltradas = citasFiltradas.filter(c => c.doctor_id === parseInt(doctorId));
    }
    
    mostrarCitasFiltradas(citasFiltradas);
}

function mostrarCitasFiltradas(citas) {
    const tbody = document.querySelector('#tabla-citas tbody');
    tbody.innerHTML = '';
    
    citas.forEach(cita => {
        const paciente = PacientesDB.obtenerPorId(cita.paciente_id);
        const doctor = DoctoresDB.obtenerPorId(cita.doctor_id);
        
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${cita.id}</td>
            <td>${paciente ? paciente.nombre : 'Paciente no encontrado'}</td>
            <td>${doctor ? doctor.nombre : 'Doctor no encontrado'}</td>
            <td>${Utils.formatearFecha(cita.fecha)}</td>
            <td>${cita.hora}</td>
            <td><span class="status-badge status-${cita.estado}">${cita.estado}</span></td>
            <td class="action-buttons">
                <button class="btn btn-secondary" onclick="editarCita(${cita.id})">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn btn-danger" onclick="eliminarCita(${cita.id})">
                    <i class="fas fa-trash"></i>
                </button>
                ${cita.estado === 'programada' ? 
                    `<button class="btn btn-success" onclick="completarCita(${cita.id})">
                        <i class="fas fa-check"></i>
                    </button>` : ''}
            </td>
        `;
        tbody.appendChild(row);
    });
}

// Gestión de Historial Médico
function cargarHistorial() {
    const historiales = HistorialDB.obtenerTodos();
    mostrarHistorialFiltrado(historiales);
}

function mostrarHistorialFiltrado(historiales) {
    const tbody = document.querySelector('#tabla-historial tbody');
    tbody.innerHTML = '';
    
    historiales.forEach(historial => {
        const paciente = PacientesDB.obtenerPorId(historial.paciente_id);
        const doctor = DoctoresDB.obtenerPorId(historial.doctor_id);
        
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${historial.id}</td>
            <td>${paciente ? paciente.nombre : 'Paciente no encontrado'}</td>
            <td>${doctor ? doctor.nombre : 'Doctor no encontrado'}</td>
            <td>${Utils.formatearFecha(historial.fecha)}</td>
            <td>${historial.diagnostico.substring(0, 50)}...</td>
            <td>${historial.tratamiento.substring(0, 50)}...</td>
            <td class="action-buttons">
                <button class="btn btn-secondary" onclick="editarHistorial(${historial.id})">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn btn-danger" onclick="eliminarHistorial(${historial.id})">
                    <i class="fas fa-trash"></i>
                </button>
                <button class="btn btn-success" onclick="verDetalleHistorial(${historial.id})">
                    <i class="fas fa-eye"></i>
                </button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

function mostrarFormularioHistorial() {
    historialEditando = null;
    document.getElementById('form-historial').reset();
    document.getElementById('historial-id').value = '';
    document.getElementById('historial-fecha').value = new Date().toISOString().split('T')[0];
    document.getElementById('modal-historial').style.display = 'block';
}

function editarHistorial(id) {
    const historial = HistorialDB.obtenerPorId(id);
    if (historial) {
        historialEditando = historial;
        document.getElementById('historial-id').value = historial.id;
        document.getElementById('historial-paciente').value = historial.paciente_id;
        document.getElementById('historial-doctor').value = historial.doctor_id;
        document.getElementById('historial-fecha').value = historial.fecha;
        document.getElementById('historial-diagnostico').value = historial.diagnostico;
        document.getElementById('historial-tratamiento').value = historial.tratamiento;
        document.getElementById('historial-observaciones').value = historial.observaciones || '';
        document.getElementById('modal-historial').style.display = 'block';
    }
}

function eliminarHistorial(id) {
    if (confirm('¿Está seguro de que desea eliminar este registro médico?')) {
        HistorialDB.eliminar(id);
        cargarHistorial();
        cargarDashboard();
        mostrarNotificacion('Registro médico eliminado correctamente', 'success');
    }
}

function verDetalleHistorial(id) {
    const historial = HistorialDB.obtenerPorId(id);
    const paciente = PacientesDB.obtenerPorId(historial.paciente_id);
    const doctor = DoctoresDB.obtenerPorId(historial.doctor_id);
    
    alert(`Detalle del Registro Médico\n\n` +
          `Paciente: ${paciente ? paciente.nombre : 'No encontrado'}\n` +
          `Doctor: ${doctor ? doctor.nombre : 'No encontrado'}\n` +
          `Fecha: ${Utils.formatearFecha(historial.fecha)}\n\n` +
          `Diagnóstico: ${historial.diagnostico}\n\n` +
          `Tratamiento: ${historial.tratamiento}\n\n` +
          `Observaciones: ${historial.observaciones || 'Ninguna'}`);
}

function buscarHistorial() {
    const termino = document.getElementById('buscar-historial').value;
    if (termino.trim() === '') {
        cargarHistorial();
        return;
    }
    
    const pacientesEncontrados = PacientesDB.buscarPorNombre(termino);
    let historialesEncontrados = [];
    
    pacientesEncontrados.forEach(paciente => {
        const historialPaciente = HistorialDB.obtenerPorPaciente(paciente.id);
        historialesEncontrados = historialesEncontrados.concat(historialPaciente);
    });
    
    // También buscar por diagnóstico
    const historialesPorDiagnostico = HistorialDB.buscarPorDiagnostico(termino);
    historialesEncontrados = historialesEncontrados.concat(historialesPorDiagnostico);
    
    // Eliminar duplicados
    historialesEncontrados = historialesEncontrados.filter((historial, index, self) => 
        index === self.findIndex(h => h.id === historial.id)
    );
    
    mostrarHistorialFiltrado(historialesEncontrados);
}

// Reportes
function generarReportePacientesPorDoctor() {
    const reporte = Reportes.pacientesPorDoctor();
    const contenedor = document.getElementById('reporte-pacientes-doctor');
    
    let html = '<h4>Reporte de Pacientes por Doctor</h4>';
    
    Object.entries(reporte).forEach(([doctorNombre, datos]) => {
        html += `
            <div class="reporte-item">
                <h5>${doctorNombre}</h5>
                <p><strong>Especialidad:</strong> ${datos.especialidad}</p>
                <p><strong>Total de Pacientes:</strong> ${datos.totalPacientes}</p>
                <p><strong>Total de Citas:</strong> ${datos.totalCitas}</p>
                <p><strong>Pacientes:</strong> ${datos.pacientes.join(', ')}</p>
            </div>
        `;
    });
    
    contenedor.innerHTML = html;
}

function generarReporteCitasPorFecha() {
    const fecha = document.getElementById('fecha-reporte-citas').value;
    if (!fecha) {
        alert('Por favor seleccione una fecha');
        return;
    }
    
    const reporte = Reportes.citasPorFecha(fecha);
    const contenedor = document.getElementById('reporte-citas-fecha');
    
    let html = `<h4>Reporte de Citas para ${Utils.formatearFecha(fecha)}</h4>`;
    
    if (reporte.length === 0) {
        html += '<p>No hay citas programadas para esta fecha.</p>';
    } else {
        html += '<table class="reporte-table">';
        html += '<thead><tr><th>Hora</th><th>Paciente</th><th>Doctor</th><th>Especialidad</th><th>Estado</th></tr></thead>';
        html += '<tbody>';
        
        reporte.forEach(cita => {
            html += `
                <tr>
                    <td>${cita.hora}</td>
                    <td>${cita.paciente_nombre}</td>
                    <td>${cita.doctor_nombre}</td>
                    <td>${cita.doctor_especialidad}</td>
                    <td><span class="status-badge status-${cita.estado}">${cita.estado}</span></td>
                </tr>
            `;
        });
        
        html += '</tbody></table>';
    }
    
    contenedor.innerHTML = html;
}

function generarAnalisisHistorial() {
    const analisis = Reportes.analisisHistorial();
    const contenedor = document.getElementById('analisis-historial');
    
    let html = '<h4>Análisis del Historial Médico</h4>';
    html += `<p><strong>Total de Registros:</strong> ${analisis.totalRegistros}</p>`;
    
    html += '<h5>Diagnósticos Más Comunes:</h5><ul>';
    analisis.diagnosticosMasComunes.forEach(([diagnostico, cantidad]) => {
        html += `<li>${diagnostico}: ${cantidad} casos</li>`;
    });
    html += '</ul>';
    
    html += '<h5>Tratamientos Más Comunes:</h5><ul>';
    analisis.tratamientosMasComunes.forEach(([tratamiento, cantidad]) => {
        html += `<li>${tratamiento}: ${cantidad} casos</li>`;
    });
    html += '</ul>';
    
    html += '<h5>Registros por Mes:</h5><ul>';
    Object.entries(analisis.registrosPorMes).forEach(([mes, cantidad]) => {
        html += `<li>${mes}: ${cantidad} registros</li>`;
    });
    html += '</ul>';
    
    contenedor.innerHTML = html;
}

// Configuración de formularios
function configurarFormularios() {
    // Formulario de pacientes
    document.getElementById('form-paciente').addEventListener('submit', function(e) {
        e.preventDefault();
        
        const datos = {
            nombre: document.getElementById('paciente-nombre').value,
            edad: parseInt(document.getElementById('paciente-edad').value),
            telefono: document.getElementById('paciente-telefono').value,
            email: document.getElementById('paciente-email').value,
            direccion: document.getElementById('paciente-direccion').value
        };
        
        // Validaciones
        if (!Utils.validarEmail(datos.email)) {
            mostrarNotificacion('Email inválido', 'error');
            return;
        }
        
        if (pacienteEditando) {
            PacientesDB.actualizar(pacienteEditando.id, datos);
            mostrarNotificacion('Paciente actualizado correctamente', 'success');
        } else {
            PacientesDB.crear(datos);
            mostrarNotificacion('Paciente creado correctamente', 'success');
        }
        
        cerrarModal('modal-paciente');
        cargarPacientes();
        cargarDashboard();
    });
    
    // Formulario de citas
    document.getElementById('form-cita').addEventListener('submit', function(e) {
        e.preventDefault();
        
        const datos = {
            paciente_id: parseInt(document.getElementById('cita-paciente').value),
            doctor_id: parseInt(document.getElementById('cita-doctor').value),
            fecha: document.getElementById('cita-fecha').value,
            hora: document.getElementById('cita-hora').value,
            motivo: document.getElementById('cita-motivo').value
        };
        
        // Validaciones
        if (!Utils.validarFecha(datos.fecha)) {
            mostrarNotificacion('Fecha inválida', 'error');
            return;
        }
        
        if (!Utils.validarHora(datos.hora)) {
            mostrarNotificacion('Hora inválida', 'error');
            return;
        }
        
        if (citaEditando) {
            CitasDB.actualizar(citaEditando.id, datos);
            mostrarNotificacion('Cita actualizada correctamente', 'success');
        } else {
            CitasDB.crear(datos);
            mostrarNotificacion('Cita creada correctamente', 'success');
        }
        
        cerrarModal('modal-cita');
        cargarCitas();
        cargarDashboard();
    });
    
    // Formulario de historial
    document.getElementById('form-historial').addEventListener('submit', function(e) {
        e.preventDefault();
        
        const datos = {
            paciente_id: parseInt(document.getElementById('historial-paciente').value),
            doctor_id: parseInt(document.getElementById('historial-doctor').value),
            fecha: document.getElementById('historial-fecha').value,
            diagnostico: document.getElementById('historial-diagnostico').value,
            tratamiento: document.getElementById('historial-tratamiento').value,
            observaciones: document.getElementById('historial-observaciones').value
        };
        
        // Validaciones
        if (!Utils.validarFecha(datos.fecha)) {
            mostrarNotificacion('Fecha inválida', 'error');
            return;
        }
        
        if (historialEditando) {
            HistorialDB.actualizar(historialEditando.id, datos);
            mostrarNotificacion('Registro médico actualizado correctamente', 'success');
        } else {
            HistorialDB.crear(datos);
            mostrarNotificacion('Registro médico creado correctamente', 'success');
        }
        
        cerrarModal('modal-historial');
        cargarHistorial();
        cargarDashboard();
    });
}

// Cargar selectores
function cargarSelectores() {
    // Cargar pacientes en selectores
    const pacientes = PacientesDB.obtenerTodos();
    const selectoresPacientes = document.querySelectorAll('#cita-paciente, #historial-paciente');
    
    selectoresPacientes.forEach(selector => {
        selector.innerHTML = '<option value="">Seleccionar paciente</option>';
        pacientes.forEach(paciente => {
            const option = document.createElement('option');
            option.value = paciente.id;
            option.textContent = paciente.nombre;
            selector.appendChild(option);
        });
    });
    
    // Cargar doctores en selectores
    const doctores = DoctoresDB.obtenerTodos();
    const selectoresDoctores = document.querySelectorAll('#cita-doctor, #historial-doctor, #filtro-doctor');
    
    selectoresDoctores.forEach(selector => {
        const placeholder = selector.id === 'filtro-doctor' ? 'Todos los doctores' : 'Seleccionar doctor';
        selector.innerHTML = `<option value="">${placeholder}</option>`;
        doctores.forEach(doctor => {
            const option = document.createElement('option');
            option.value = doctor.id;
            option.textContent = `${doctor.nombre} - ${doctor.especialidad}`;
            selector.appendChild(option);
        });
    });
}

// Configurar búsquedas
function configurarBusquedas() {
    // Búsqueda de pacientes en tiempo real
    document.getElementById('buscar-paciente').addEventListener('input', function() {
        clearTimeout(this.searchTimeout);
        this.searchTimeout = setTimeout(() => {
            buscarPaciente();
        }, 300);
    });
    
    // Búsqueda de historial en tiempo real
    document.getElementById('buscar-historial').addEventListener('input', function() {
        clearTimeout(this.searchTimeout);
        this.searchTimeout = setTimeout(() => {
            buscarHistorial();
        }, 300);
    });
}

// Funciones de utilidad para modales
function cerrarModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
}

// Cerrar modales al hacer clic fuera de ellos
window.addEventListener('click', function(event) {
    const modales = document.querySelectorAll('.modal');
    modales.forEach(modal => {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });
});

// Sistema de notificaciones
function mostrarNotificacion(mensaje, tipo = 'info') {
    // Crear elemento de notificación
    const notificacion = document.createElement('div');
    notificacion.className = `notificacion notificacion-${tipo}`;
    notificacion.innerHTML = `
        <i class="fas fa-${tipo === 'success' ? 'check-circle' : tipo === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
        <span>${mensaje}</span>
        <button onclick="this.parentElement.remove()">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    // Agregar estilos si no existen
    if (!document.querySelector('#notificacion-styles')) {
        const styles = document.createElement('style');
        styles.id = 'notificacion-styles';
        styles.textContent = `
            .notificacion {
                position: fixed;
                top: 20px;
                right: 20px;
                padding: 15px 20px;
                border-radius: 8px;
                color: white;
                display: flex;
                align-items: center;
                gap: 10px;
                z-index: 10000;
                animation: slideInRight 0.3s ease;
                max-width: 400px;
                box-shadow: 0 4px 12px rgba(0,0,0,0.2);
            }
            .notificacion-success { background-color: #27ae60; }
            .notificacion-error { background-color: #e74c3c; }
            .notificacion-info { background-color: #3498db; }
            .notificacion button {
                background: none;
                border: none;
                color: white;
                cursor: pointer;
                padding: 0;
                margin-left: auto;
            }
            @keyframes slideInRight {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
        `;
        document.head.appendChild(styles);
    }
    
    // Agregar al DOM
    document.body.appendChild(notificacion);
    
    // Remover automáticamente después de 5 segundos
    setTimeout(() => {
        if (notificacion.parentElement) {
            notificacion.remove();
        }
    }, 5000);
}

// Función para exportar datos (opcional)
function exportarDatos() {
    const datos = {
        pacientes: PacientesDB.obtenerTodos(),
        citas: CitasDB.obtenerTodos(),
        historial: HistorialDB.obtenerTodos(),
        estadisticas: Reportes.obtenerEstadisticas()
    };
    
    const dataStr = JSON.stringify(datos, null, 2);
    const dataBlob = new Blob([dataStr], {type: 'application/json'});
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `medicare-backup-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    
    URL.revokeObjectURL(url);
    mostrarNotificacion('Datos exportados correctamente', 'success');
}

// Función para imprimir reportes
function imprimirReporte(contenedorId) {
    const contenido = document.getElementById(contenedorId).innerHTML;
    const ventanaImpresion = window.open('', '_blank');
    
    ventanaImpresion.document.write(`
        <html>
            <head>
                <title>Reporte MediCare</title>
                <style>
                    body { font-family: Arial, sans-serif; margin: 20px; }
                    table { width: 100%; border-collapse: collapse; margin: 20px 0; }
                    th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
                    th { background-color: #f2f2f2; }
                    .reporte-item { margin: 20px 0; padding: 15px; border: 1px solid #ddd; }
                    h4, h5 { color: #333; }
                </style>
            </head>
            <body>
                <h1>Sistema MediCare - Reporte</h1>
                <p>Fecha de generación: ${new Date().toLocaleDateString('es-ES')}</p>
                ${contenido}
            </body>
        </html>
    `);
    
    ventanaImpresion.document.close();
    ventanaImpresion.print();
}

console.log('Sistema MediCare cargado correctamente');