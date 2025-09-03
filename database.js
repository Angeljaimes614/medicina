/**
 * Sistema de Base de Datos Simulada para MediCare
 * Simula una base de datos relacional en memoria con las siguientes tablas:
 * - pacientes: Información de los pacientes
 * - doctores: Información de los doctores
 * - citas: Citas médicas programadas
 * - historial_medico: Registros médicos de los pacientes
 */

// Base de datos simulada en memoria
const database = {
    pacientes: [],
    doctores: [],
    citas: [],
    historial_medico: [],
    
    // Contadores para IDs auto-incrementales
    counters: {
        pacientes: 1,
        doctores: 1,
        citas: 1,
        historial_medico: 1
    }
};

// Datos iniciales de doctores
const doctoresIniciales = [
    {
        id: 1,
        nombre: "Dr. Carlos Mendoza",
        especialidad: "Cardiología",
        telefono: "555-0101",
        email: "carlos.mendoza@medicare.com",
        horario: "Lunes a Viernes 8:00-16:00"
    },
    {
        id: 2,
        nombre: "Dra. Ana García",
        especialidad: "Pediatría",
        telefono: "555-0102",
        email: "ana.garcia@medicare.com",
        horario: "Lunes a Viernes 9:00-17:00"
    },
    {
        id: 3,
        nombre: "Dr. Luis Rodríguez",
        especialidad: "Medicina General",
        telefono: "555-0103",
        email: "luis.rodriguez@medicare.com",
        horario: "Lunes a Sábado 7:00-15:00"
    },
    {
        id: 4,
        nombre: "Dra. María López",
        especialidad: "Ginecología",
        telefono: "555-0104",
        email: "maria.lopez@medicare.com",
        horario: "Martes a Sábado 10:00-18:00"
    },
    {
        id: 5,
        nombre: "Dr. Roberto Silva",
        especialidad: "Traumatología",
        telefono: "555-0105",
        email: "roberto.silva@medicare.com",
        horario: "Lunes a Viernes 8:00-16:00"
    }
];

// Datos iniciales de pacientes
const pacientesIniciales = [
    {
        id: 1,
        nombre: "Juan Pérez",
        edad: 35,
        telefono: "555-1001",
        email: "juan.perez@email.com",
        direccion: "Calle 123 #45-67, Bogotá",
        fecha_registro: "2024-01-15"
    },
    {
        id: 2,
        nombre: "María González",
        edad: 28,
        telefono: "555-1002",
        email: "maria.gonzalez@email.com",
        direccion: "Carrera 89 #12-34, Medellín",
        fecha_registro: "2024-01-20"
    },
    {
        id: 3,
        nombre: "Carlos Ramírez",
        edad: 42,
        telefono: "555-1003",
        email: "carlos.ramirez@email.com",
        direccion: "Avenida 56 #78-90, Cali",
        fecha_registro: "2024-02-01"
    },
    {
        id: 4,
        nombre: "Ana Martínez",
        edad: 31,
        telefono: "555-1004",
        email: "ana.martinez@email.com",
        direccion: "Calle 45 #23-12, Barranquilla",
        fecha_registro: "2024-02-10"
    },
    {
        id: 5,
        nombre: "Pedro Sánchez",
        edad: 55,
        telefono: "555-1005",
        email: "pedro.sanchez@email.com",
        direccion: "Carrera 12 #34-56, Cartagena",
        fecha_registro: "2024-02-15"
    }
];

// Datos iniciales de citas
const citasIniciales = [
    {
        id: 1,
        paciente_id: 1,
        doctor_id: 3,
        fecha: "2024-03-15",
        hora: "09:00",
        motivo: "Consulta general de rutina",
        estado: "programada"
    },
    {
        id: 2,
        paciente_id: 2,
        doctor_id: 2,
        fecha: "2024-03-16",
        hora: "10:30",
        motivo: "Control pediátrico",
        estado: "programada"
    },
    {
        id: 3,
        paciente_id: 3,
        doctor_id: 1,
        fecha: "2024-03-14",
        hora: "14:00",
        motivo: "Dolor en el pecho",
        estado: "completada"
    },
    {
        id: 4,
        paciente_id: 4,
        doctor_id: 4,
        fecha: "2024-03-17",
        hora: "11:00",
        motivo: "Control ginecológico",
        estado: "programada"
    },
    {
        id: 5,
        paciente_id: 5,
        doctor_id: 5,
        fecha: "2024-03-13",
        hora: "15:30",
        motivo: "Dolor en la rodilla",
        estado: "completada"
    }
];

// Datos iniciales del historial médico
const historialInicial = [
    {
        id: 1,
        paciente_id: 1,
        doctor_id: 3,
        fecha: "2024-02-20",
        diagnostico: "Hipertensión arterial leve",
        tratamiento: "Dieta baja en sodio, ejercicio regular",
        observaciones: "Paciente colaborador, seguimiento en 3 meses"
    },
    {
        id: 2,
        paciente_id: 2,
        doctor_id: 2,
        fecha: "2024-02-25",
        diagnostico: "Desarrollo normal",
        tratamiento: "Continuar con vacunación según esquema",
        observaciones: "Niña sana, crecimiento adecuado"
    },
    {
        id: 3,
        paciente_id: 3,
        doctor_id: 1,
        fecha: "2024-03-14",
        diagnostico: "Angina de pecho estable",
        tratamiento: "Nitroglicerina sublingual, betabloqueadores",
        observaciones: "Requiere seguimiento cardiológico estrecho"
    },
    {
        id: 4,
        paciente_id: 5,
        doctor_id: 5,
        fecha: "2024-03-13",
        diagnostico: "Osteoartritis de rodilla",
        tratamiento: "Antiinflamatorios, fisioterapia",
        observaciones: "Mejoría con tratamiento conservador"
    }
];

// Funciones de inicialización
function inicializarBaseDatos() {
    // Cargar datos iniciales
    database.doctores = [...doctoresIniciales];
    database.pacientes = [...pacientesIniciales];
    database.citas = [...citasIniciales];
    database.historial_medico = [...historialInicial];
    
    // Actualizar contadores
    database.counters.doctores = Math.max(...database.doctores.map(d => d.id)) + 1;
    database.counters.pacientes = Math.max(...database.pacientes.map(p => p.id)) + 1;
    database.counters.citas = Math.max(...database.citas.map(c => c.id)) + 1;
    database.counters.historial_medico = Math.max(...database.historial_medico.map(h => h.id)) + 1;
    
    console.log('Base de datos inicializada correctamente');
}

// Funciones CRUD para Pacientes
const PacientesDB = {
    // Crear nuevo paciente
    crear(paciente) {
        const nuevoPaciente = {
            id: database.counters.pacientes++,
            ...paciente,
            fecha_registro: new Date().toISOString().split('T')[0]
        };
        database.pacientes.push(nuevoPaciente);
        return nuevoPaciente;
    },
    
    // Obtener todos los pacientes
    obtenerTodos() {
        return [...database.pacientes];
    },
    
    // Obtener paciente por ID
    obtenerPorId(id) {
        return database.pacientes.find(p => p.id === parseInt(id));
    },
    
    // Buscar pacientes por nombre
    buscarPorNombre(nombre) {
        return database.pacientes.filter(p => 
            p.nombre.toLowerCase().includes(nombre.toLowerCase())
        );
    },
    
    // Actualizar paciente
    actualizar(id, datosActualizados) {
        const index = database.pacientes.findIndex(p => p.id === parseInt(id));
        if (index !== -1) {
            database.pacientes[index] = { ...database.pacientes[index], ...datosActualizados };
            return database.pacientes[index];
        }
        return null;
    },
    
    // Eliminar paciente
    eliminar(id) {
        const index = database.pacientes.findIndex(p => p.id === parseInt(id));
        if (index !== -1) {
            return database.pacientes.splice(index, 1)[0];
        }
        return null;
    }
};

// Funciones CRUD para Doctores
const DoctoresDB = {
    // Obtener todos los doctores
    obtenerTodos() {
        return [...database.doctores];
    },
    
    // Obtener doctor por ID
    obtenerPorId(id) {
        return database.doctores.find(d => d.id === parseInt(id));
    },
    
    // Obtener doctores por especialidad
    obtenerPorEspecialidad(especialidad) {
        return database.doctores.filter(d => 
            d.especialidad.toLowerCase().includes(especialidad.toLowerCase())
        );
    }
};

// Funciones CRUD para Citas
const CitasDB = {
    // Crear nueva cita
    crear(cita) {
        const nuevaCita = {
            id: database.counters.citas++,
            ...cita,
            estado: cita.estado || 'programada'
        };
        database.citas.push(nuevaCita);
        return nuevaCita;
    },
    
    // Obtener todas las citas
    obtenerTodos() {
        return [...database.citas];
    },
    
    // Obtener cita por ID
    obtenerPorId(id) {
        return database.citas.find(c => c.id === parseInt(id));
    },
    
    // Obtener citas por fecha
    obtenerPorFecha(fecha) {
        return database.citas.filter(c => c.fecha === fecha);
    },
    
    // Obtener citas por doctor
    obtenerPorDoctor(doctorId) {
        return database.citas.filter(c => c.doctor_id === parseInt(doctorId));
    },
    
    // Obtener citas por paciente
    obtenerPorPaciente(pacienteId) {
        return database.citas.filter(c => c.paciente_id === parseInt(pacienteId));
    },
    
    // Obtener citas de hoy
    obtenerHoy() {
        const hoy = new Date().toISOString().split('T')[0];
        return database.citas.filter(c => c.fecha === hoy);
    },
    
    // Actualizar cita
    actualizar(id, datosActualizados) {
        const index = database.citas.findIndex(c => c.id === parseInt(id));
        if (index !== -1) {
            database.citas[index] = { ...database.citas[index], ...datosActualizados };
            return database.citas[index];
        }
        return null;
    },
    
    // Eliminar cita
    eliminar(id) {
        const index = database.citas.findIndex(c => c.id === parseInt(id));
        if (index !== -1) {
            return database.citas.splice(index, 1)[0];
        }
        return null;
    }
};

// Funciones CRUD para Historial Médico
const HistorialDB = {
    // Crear nuevo registro médico
    crear(historial) {
        const nuevoHistorial = {
            id: database.counters.historial_medico++,
            ...historial,
            fecha: historial.fecha || new Date().toISOString().split('T')[0]
        };
        database.historial_medico.push(nuevoHistorial);
        return nuevoHistorial;
    },
    
    // Obtener todos los registros
    obtenerTodos() {
        return [...database.historial_medico];
    },
    
    // Obtener registro por ID
    obtenerPorId(id) {
        return database.historial_medico.find(h => h.id === parseInt(id));
    },
    
    // Obtener historial por paciente
    obtenerPorPaciente(pacienteId) {
        return database.historial_medico
            .filter(h => h.paciente_id === parseInt(pacienteId))
            .sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
    },
    
    // Obtener historial por doctor
    obtenerPorDoctor(doctorId) {
        return database.historial_medico.filter(h => h.doctor_id === parseInt(doctorId));
    },
    
    // Buscar en historial por diagnóstico
    buscarPorDiagnostico(termino) {
        return database.historial_medico.filter(h => 
            h.diagnostico.toLowerCase().includes(termino.toLowerCase())
        );
    },
    
    // Actualizar registro
    actualizar(id, datosActualizados) {
        const index = database.historial_medico.findIndex(h => h.id === parseInt(id));
        if (index !== -1) {
            database.historial_medico[index] = { ...database.historial_medico[index], ...datosActualizados };
            return database.historial_medico[index];
        }
        return null;
    },
    
    // Eliminar registro
    eliminar(id) {
        const index = database.historial_medico.findIndex(h => h.id === parseInt(id));
        if (index !== -1) {
            return database.historial_medico.splice(index, 1)[0];
        }
        return null;
    }
};

// Funciones de consultas y reportes
const Reportes = {
    // Obtener estadísticas generales
    obtenerEstadisticas() {
        const hoy = new Date().toISOString().split('T')[0];
        return {
            totalPacientes: database.pacientes.length,
            totalDoctores: database.doctores.length,
            citasHoy: database.citas.filter(c => c.fecha === hoy).length,
            totalHistoriales: database.historial_medico.length,
            citasProgramadas: database.citas.filter(c => c.estado === 'programada').length,
            citasCompletadas: database.citas.filter(c => c.estado === 'completada').length
        };
    },
    
    // Reporte de pacientes por doctor
    pacientesPorDoctor() {
        const reporte = {};
        database.doctores.forEach(doctor => {
            const citasDoctor = database.citas.filter(c => c.doctor_id === doctor.id);
            const pacientesUnicos = [...new Set(citasDoctor.map(c => c.paciente_id))];
            reporte[doctor.nombre] = {
                especialidad: doctor.especialidad,
                totalPacientes: pacientesUnicos.length,
                totalCitas: citasDoctor.length,
                pacientes: pacientesUnicos.map(pid => {
                    const paciente = database.pacientes.find(p => p.id === pid);
                    return paciente ? paciente.nombre : 'Paciente no encontrado';
                })
            };
        });
        return reporte;
    },
    
    // Reporte de citas por fecha
    citasPorFecha(fecha) {
        const citasFecha = database.citas.filter(c => c.fecha === fecha);
        return citasFecha.map(cita => {
            const paciente = database.pacientes.find(p => p.id === cita.paciente_id);
            const doctor = database.doctores.find(d => d.id === cita.doctor_id);
            return {
                ...cita,
                paciente_nombre: paciente ? paciente.nombre : 'Paciente no encontrado',
                doctor_nombre: doctor ? doctor.nombre : 'Doctor no encontrado',
                doctor_especialidad: doctor ? doctor.especialidad : 'N/A'
            };
        }).sort((a, b) => a.hora.localeCompare(b.hora));
    },
    
    // Análisis del historial médico
    analisisHistorial() {
        const diagnosticos = {};
        const tratamientos = {};
        
        database.historial_medico.forEach(registro => {
            // Contar diagnósticos
            if (diagnosticos[registro.diagnostico]) {
                diagnosticos[registro.diagnostico]++;
            } else {
                diagnosticos[registro.diagnostico] = 1;
            }
            
            // Contar tratamientos
            if (tratamientos[registro.tratamiento]) {
                tratamientos[registro.tratamiento]++;
            } else {
                tratamientos[registro.tratamiento] = 1;
            }
        });
        
        return {
            totalRegistros: database.historial_medico.length,
            diagnosticosMasComunes: Object.entries(diagnosticos)
                .sort(([,a], [,b]) => b - a)
                .slice(0, 5),
            tratamientosMasComunes: Object.entries(tratamientos)
                .sort(([,a], [,b]) => b - a)
                .slice(0, 5),
            registrosPorMes: this.registrosPorMes()
        };
    },
    
    // Registros por mes
    registrosPorMes() {
        const registrosPorMes = {};
        database.historial_medico.forEach(registro => {
            const mes = registro.fecha.substring(0, 7); // YYYY-MM
            if (registrosPorMes[mes]) {
                registrosPorMes[mes]++;
            } else {
                registrosPorMes[mes] = 1;
            }
        });
        return registrosPorMes;
    }
};

// Funciones de utilidad
const Utils = {
    // Validar formato de fecha
    validarFecha(fecha) {
        const regex = /^\d{4}-\d{2}-\d{2}$/;
        return regex.test(fecha) && !isNaN(Date.parse(fecha));
    },
    
    // Validar formato de hora
    validarHora(hora) {
        const regex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;
        return regex.test(hora);
    },
    
    // Validar email
    validarEmail(email) {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    },
    
    // Formatear fecha para mostrar
    formatearFecha(fecha) {
        const opciones = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(fecha).toLocaleDateString('es-ES', opciones);
    },
    
    // Formatear hora para mostrar
    formatearHora(hora) {
        return hora;
    },
    
    // Generar ID único
    generarId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }
};

// Inicializar la base de datos al cargar el script
inicializarBaseDatos();

// Exportar para uso en otros archivos
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        database,
        PacientesDB,
        DoctoresDB,
        CitasDB,
        HistorialDB,
        Reportes,
        Utils
    };
}