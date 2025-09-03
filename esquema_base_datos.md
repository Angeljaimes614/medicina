# Esquema de Base de Datos - Sistema MediCare

## Descripción General

El sistema MediCare utiliza una base de datos relacional diseñada para gestionar eficientemente la información médica de pacientes, doctores, citas y historiales médicos. La base de datos está optimizada para consultas rápidas y mantiene la integridad referencial entre todas las entidades.

## Tablas Principales

### 1. Tabla: pacientes

**Descripción:** Almacena la información personal y de contacto de todos los pacientes registrados en el sistema.

| Campo | Tipo | Restricciones | Descripción |
|-------|------|---------------|-------------|
| id | INTEGER | PRIMARY KEY, AUTO_INCREMENT | Identificador único del paciente |
| nombre | VARCHAR(100) | NOT NULL | Nombre completo del paciente |
| edad | INTEGER | NOT NULL, CHECK (edad > 0 AND edad < 150) | Edad del paciente |
| telefono | VARCHAR(20) | NOT NULL | Número de teléfono de contacto |
| email | VARCHAR(100) | NOT NULL, UNIQUE | Correo electrónico del paciente |
| direccion | TEXT | NOT NULL | Dirección completa del paciente |
| fecha_registro | DATE | NOT NULL, DEFAULT CURRENT_DATE | Fecha de registro en el sistema |

**Índices:**
- PRIMARY KEY (id)
- UNIQUE INDEX (email)
- INDEX (nombre) - Para búsquedas rápidas por nombre

### 2. Tabla: doctores

**Descripción:** Contiene la información de todos los doctores que brindan servicios en el sistema.

| Campo | Tipo | Restricciones | Descripción |
|-------|------|---------------|-------------|
| id | INTEGER | PRIMARY KEY, AUTO_INCREMENT | Identificador único del doctor |
| nombre | VARCHAR(100) | NOT NULL | Nombre completo del doctor |
| especialidad | VARCHAR(50) | NOT NULL | Especialidad médica del doctor |
| telefono | VARCHAR(20) | NOT NULL | Número de teléfono de contacto |
| email | VARCHAR(100) | NOT NULL, UNIQUE | Correo electrónico del doctor |
| horario | VARCHAR(100) | NOT NULL | Horario de atención del doctor |

**Índices:**
- PRIMARY KEY (id)
- UNIQUE INDEX (email)
- INDEX (especialidad) - Para filtrar por especialidad

### 3. Tabla: citas

**Descripción:** Registra todas las citas médicas programadas entre pacientes y doctores.

| Campo | Tipo | Restricciones | Descripción |
|-------|------|---------------|-------------|
| id | INTEGER | PRIMARY KEY, AUTO_INCREMENT | Identificador único de la cita |
| paciente_id | INTEGER | NOT NULL, FOREIGN KEY | Referencia al paciente |
| doctor_id | INTEGER | NOT NULL, FOREIGN KEY | Referencia al doctor |
| fecha | DATE | NOT NULL | Fecha de la cita |
| hora | TIME | NOT NULL | Hora de la cita |
| motivo | TEXT | NOT NULL | Motivo o razón de la cita |
| estado | ENUM | NOT NULL, DEFAULT 'programada' | Estado de la cita |

**Estados válidos para el campo 'estado':**
- 'programada': Cita agendada y confirmada
- 'completada': Cita realizada exitosamente
- 'cancelada': Cita cancelada por cualquier motivo
- 'en-proceso': Cita en curso

**Relaciones:**
- FOREIGN KEY (paciente_id) REFERENCES pacientes(id) ON DELETE CASCADE
- FOREIGN KEY (doctor_id) REFERENCES doctores(id) ON DELETE CASCADE

**Índices:**
- PRIMARY KEY (id)
- INDEX (paciente_id)
- INDEX (doctor_id)
- INDEX (fecha) - Para consultas por fecha
- UNIQUE INDEX (doctor_id, fecha, hora) - Evita citas duplicadas

### 4. Tabla: historial_medico

**Descripción:** Almacena los registros médicos detallados de cada consulta realizada.

| Campo | Tipo | Restricciones | Descripción |
|-------|------|---------------|-------------|
| id | INTEGER | PRIMARY KEY, AUTO_INCREMENT | Identificador único del registro |
| paciente_id | INTEGER | NOT NULL, FOREIGN KEY | Referencia al paciente |
| doctor_id | INTEGER | NOT NULL, FOREIGN KEY | Referencia al doctor |
| fecha | DATE | NOT NULL | Fecha del registro médico |
| diagnostico | TEXT | NOT NULL | Diagnóstico médico detallado |
| tratamiento | TEXT | NOT NULL | Tratamiento prescrito |
| observaciones | TEXT | NULL | Observaciones adicionales |

**Relaciones:**
- FOREIGN KEY (paciente_id) REFERENCES pacientes(id) ON DELETE CASCADE
- FOREIGN KEY (doctor_id) REFERENCES doctores(id) ON DELETE CASCADE

**Índices:**
- PRIMARY KEY (id)
- INDEX (paciente_id)
- INDEX (doctor_id)
- INDEX (fecha)
- FULLTEXT INDEX (diagnostico, tratamiento) - Para búsquedas de texto

## Relaciones entre Tablas

### Diagrama de Relaciones

```
pacientes (1) ----< (N) citas (N) >---- (1) doctores
    |                                        |
    |                                        |
    v                                        v
    (1)                                    (1)
    |                                        |
    ----< (N) historial_medico (N) >--------
```

### Descripción de Relaciones

1. **pacientes → citas (1:N)**
   - Un paciente puede tener múltiples citas
   - Una cita pertenece a un solo paciente

2. **doctores → citas (1:N)**
   - Un doctor puede atender múltiples citas
   - Una cita es atendida por un solo doctor

3. **pacientes → historial_medico (1:N)**
   - Un paciente puede tener múltiples registros médicos
   - Un registro médico pertenece a un solo paciente

4. **doctores → historial_medico (1:N)**
   - Un doctor puede crear múltiples registros médicos
   - Un registro médico es creado por un solo doctor

## Restricciones de Integridad

### Restricciones de Clave Primaria
- Cada tabla tiene una clave primaria auto-incremental
- Garantiza la unicidad de cada registro

### Restricciones de Clave Foránea
- Mantienen la integridad referencial
- Configuradas con CASCADE DELETE para eliminar registros dependientes

### Restricciones de Dominio
- Validación de edad (1-149 años)
- Validación de estados de cita
- Campos obligatorios (NOT NULL)
- Unicidad de emails

### Restricciones de Negocio
- No se pueden programar dos citas para el mismo doctor en la misma fecha y hora
- Los emails deben ser únicos en el sistema
- Las fechas no pueden ser anteriores a la fecha actual (implementado en la aplicación)

## Consultas Principales del Sistema

### 1. Consultas de Pacientes

```sql
-- Obtener todos los pacientes
SELECT * FROM pacientes ORDER BY nombre;

-- Buscar paciente por nombre
SELECT * FROM pacientes WHERE nombre LIKE '%término%';

-- Obtener paciente por ID
SELECT * FROM pacientes WHERE id = ?;
```

### 2. Consultas de Citas

```sql
-- Obtener citas por fecha
SELECT c.*, p.nombre as paciente_nombre, d.nombre as doctor_nombre
FROM citas c
JOIN pacientes p ON c.paciente_id = p.id
JOIN doctores d ON c.doctor_id = d.id
WHERE c.fecha = ?
ORDER BY c.hora;

-- Obtener citas de un doctor
SELECT c.*, p.nombre as paciente_nombre
FROM citas c
JOIN pacientes p ON c.paciente_id = p.id
WHERE c.doctor_id = ?
ORDER BY c.fecha, c.hora;

-- Obtener citas de hoy
SELECT c.*, p.nombre as paciente_nombre, d.nombre as doctor_nombre
FROM citas c
JOIN pacientes p ON c.paciente_id = p.id
JOIN doctores d ON c.doctor_id = d.id
WHERE c.fecha = CURRENT_DATE
ORDER BY c.hora;
```

### 3. Consultas de Historial Médico

```sql
-- Obtener historial de un paciente
SELECT h.*, d.nombre as doctor_nombre, d.especialidad
FROM historial_medico h
JOIN doctores d ON h.doctor_id = d.id
WHERE h.paciente_id = ?
ORDER BY h.fecha DESC;

-- Buscar en historial por diagnóstico
SELECT h.*, p.nombre as paciente_nombre, d.nombre as doctor_nombre
FROM historial_medico h
JOIN pacientes p ON h.paciente_id = p.id
JOIN doctores d ON h.doctor_id = d.id
WHERE h.diagnostico LIKE '%término%'
ORDER BY h.fecha DESC;
```

### 4. Consultas de Reportes

```sql
-- Reporte de pacientes por doctor
SELECT d.nombre as doctor, d.especialidad,
       COUNT(DISTINCT c.paciente_id) as total_pacientes,
       COUNT(c.id) as total_citas
FROM doctores d
LEFT JOIN citas c ON d.id = c.doctor_id
GROUP BY d.id, d.nombre, d.especialidad
ORDER BY total_pacientes DESC;

-- Estadísticas generales
SELECT 
    (SELECT COUNT(*) FROM pacientes) as total_pacientes,
    (SELECT COUNT(*) FROM doctores) as total_doctores,
    (SELECT COUNT(*) FROM citas WHERE fecha = CURRENT_DATE) as citas_hoy,
    (SELECT COUNT(*) FROM historial_medico) as total_historiales;

-- Diagnósticos más comunes
SELECT diagnostico, COUNT(*) as frecuencia
FROM historial_medico
GROUP BY diagnostico
ORDER BY frecuencia DESC
LIMIT 10;
```

## Optimización y Rendimiento

### Índices Recomendados

1. **Índices de búsqueda frecuente:**
   - pacientes.nombre (para búsquedas de pacientes)
   - citas.fecha (para consultas por fecha)
   - historial_medico.paciente_id (para historial por paciente)

2. **Índices compuestos:**
   - (doctor_id, fecha, hora) en citas (unicidad y consultas)
   - (paciente_id, fecha) en historial_medico (historial cronológico)

3. **Índices de texto completo:**
   - diagnostico y tratamiento en historial_medico (búsquedas de texto)

### Consideraciones de Rendimiento

1. **Particionamiento:** Para sistemas con gran volumen de datos, considerar particionamiento por fecha en las tablas citas e historial_medico.

2. **Archivado:** Implementar estrategias de archivado para registros antiguos.

3. **Caché:** Utilizar caché para consultas frecuentes como listas de doctores y estadísticas del dashboard.

## Seguridad y Privacidad

### Medidas de Seguridad

1. **Encriptación:** Los datos sensibles deben ser encriptados en la base de datos.

2. **Auditoría:** Implementar logs de auditoría para rastrear cambios en registros médicos.

3. **Acceso:** Controlar el acceso basado en roles (doctores, administradores, etc.).

4. **Backup:** Realizar respaldos regulares y automáticos de la base de datos.

### Cumplimiento Normativo

- Cumplimiento con regulaciones de privacidad médica
- Retención de datos según normativas locales
- Anonimización de datos para reportes estadísticos

## Scripts de Creación

### Script SQL para MySQL/MariaDB

```sql
-- Crear base de datos
CREATE DATABASE medicare_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE medicare_db;

-- Tabla pacientes
CREATE TABLE pacientes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    edad INT NOT NULL CHECK (edad > 0 AND edad < 150),
    telefono VARCHAR(20) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    direccion TEXT NOT NULL,
    fecha_registro DATE NOT NULL DEFAULT (CURRENT_DATE),
    INDEX idx_nombre (nombre),
    INDEX idx_email (email)
);

-- Tabla doctores
CREATE TABLE doctores (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    especialidad VARCHAR(50) NOT NULL,
    telefono VARCHAR(20) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    horario VARCHAR(100) NOT NULL,
    INDEX idx_especialidad (especialidad)
);

-- Tabla citas
CREATE TABLE citas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    paciente_id INT NOT NULL,
    doctor_id INT NOT NULL,
    fecha DATE NOT NULL,
    hora TIME NOT NULL,
    motivo TEXT NOT NULL,
    estado ENUM('programada', 'completada', 'cancelada', 'en-proceso') NOT NULL DEFAULT 'programada',
    FOREIGN KEY (paciente_id) REFERENCES pacientes(id) ON DELETE CASCADE,
    FOREIGN KEY (doctor_id) REFERENCES doctores(id) ON DELETE CASCADE,
    INDEX idx_paciente (paciente_id),
    INDEX idx_doctor (doctor_id),
    INDEX idx_fecha (fecha),
    UNIQUE KEY unique_cita (doctor_id, fecha, hora)
);

-- Tabla historial_medico
CREATE TABLE historial_medico (
    id INT AUTO_INCREMENT PRIMARY KEY,
    paciente_id INT NOT NULL,
    doctor_id INT NOT NULL,
    fecha DATE NOT NULL,
    diagnostico TEXT NOT NULL,
    tratamiento TEXT NOT NULL,
    observaciones TEXT,
    FOREIGN KEY (paciente_id) REFERENCES pacientes(id) ON DELETE CASCADE,
    FOREIGN KEY (doctor_id) REFERENCES doctores(id) ON DELETE CASCADE,
    INDEX idx_paciente (paciente_id),
    INDEX idx_doctor (doctor_id),
    INDEX idx_fecha (fecha),
    FULLTEXT KEY ft_diagnostico_tratamiento (diagnostico, tratamiento)
);
```

## Conclusión

Este esquema de base de datos proporciona una base sólida para el sistema MediCare, garantizando:

- **Integridad de datos** mediante restricciones y relaciones bien definidas
- **Rendimiento óptimo** con índices estratégicamente ubicados
- **Escalabilidad** para crecimiento futuro del sistema
- **Flexibilidad** para adaptarse a nuevos requerimientos
- **Seguridad** con medidas de protección de datos sensibles

La estructura relacional permite consultas eficientes y mantiene la consistencia de los datos médicos, cumpliendo con los estándares de calidad requeridos para un sistema de gestión médica profesional.