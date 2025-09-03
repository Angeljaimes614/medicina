-- =====================================================
-- CONSULTAS Y REPORTES DEL SISTEMA MEDICARE
-- =====================================================
-- Este archivo contiene todas las consultas SQL principales
-- utilizadas en el sistema de gestión médica MediCare

-- =====================================================
-- 1. CONSULTAS BÁSICAS DE PACIENTES
-- =====================================================

-- Obtener todos los pacientes ordenados por nombre
SELECT 
    id,
    nombre,
    edad,
    telefono,
    email,
    direccion,
    fecha_registro
FROM pacientes 
ORDER BY nombre ASC;

-- Buscar pacientes por nombre (búsqueda parcial)
SELECT 
    id,
    nombre,
    edad,
    telefono,
    email
FROM pacientes 
WHERE nombre LIKE CONCAT('%', ?, '%')
ORDER BY nombre ASC;

-- Obtener paciente específico por ID
SELECT 
    id,
    nombre,
    edad,
    telefono,
    email,
    direccion,
    fecha_registro
FROM pacientes 
WHERE id = ?;

-- Contar total de pacientes
SELECT COUNT(*) as total_pacientes FROM pacientes;

-- Pacientes registrados por mes
SELECT 
    DATE_FORMAT(fecha_registro, '%Y-%m') as mes,
    COUNT(*) as nuevos_pacientes
FROM pacientes 
GROUP BY DATE_FORMAT(fecha_registro, '%Y-%m')
ORDER BY mes DESC;

-- =====================================================
-- 2. CONSULTAS DE DOCTORES
-- =====================================================

-- Obtener todos los doctores
SELECT 
    id,
    nombre,
    especialidad,
    telefono,
    email,
    horario
FROM doctores 
ORDER BY nombre ASC;

-- Doctores por especialidad
SELECT 
    especialidad,
    COUNT(*) as cantidad_doctores,
    GROUP_CONCAT(nombre SEPARATOR ', ') as doctores
FROM doctores 
GROUP BY especialidad
ORDER BY cantidad_doctores DESC;

-- Buscar doctores por especialidad
SELECT 
    id,
    nombre,
    especialidad,
    telefono,
    email
FROM doctores 
WHERE especialidad LIKE CONCAT('%', ?, '%')
ORDER BY nombre ASC;

-- =====================================================
-- 3. CONSULTAS DE CITAS
-- =====================================================

-- Obtener todas las citas con información completa
SELECT 
    c.id,
    c.fecha,
    c.hora,
    c.motivo,
    c.estado,
    p.nombre as paciente_nombre,
    p.telefono as paciente_telefono,
    d.nombre as doctor_nombre,
    d.especialidad as doctor_especialidad
FROM citas c
INNER JOIN pacientes p ON c.paciente_id = p.id
INNER JOIN doctores d ON c.doctor_id = d.id
ORDER BY c.fecha DESC, c.hora ASC;

-- Citas por fecha específica
SELECT 
    c.id,
    c.hora,
    c.motivo,
    c.estado,
    p.nombre as paciente_nombre,
    p.telefono as paciente_telefono,
    d.nombre as doctor_nombre,
    d.especialidad as doctor_especialidad
FROM citas c
INNER JOIN pacientes p ON c.paciente_id = p.id
INNER JOIN doctores d ON c.doctor_id = d.id
WHERE c.fecha = ?
ORDER BY c.hora ASC;

-- Citas de hoy
SELECT 
    c.id,
    c.hora,
    c.motivo,
    c.estado,
    p.nombre as paciente_nombre,
    d.nombre as doctor_nombre,
    d.especialidad as doctor_especialidad
FROM citas c
INNER JOIN pacientes p ON c.paciente_id = p.id
INNER JOIN doctores d ON c.doctor_id = d.id
WHERE c.fecha = CURDATE()
ORDER BY c.hora ASC;

-- Citas por doctor
SELECT 
    c.id,
    c.fecha,
    c.hora,
    c.motivo,
    c.estado,
    p.nombre as paciente_nombre,
    p.telefono as paciente_telefono
FROM citas c
INNER JOIN pacientes p ON c.paciente_id = p.id
WHERE c.doctor_id = ?
ORDER BY c.fecha DESC, c.hora ASC;

-- Citas por paciente
SELECT 
    c.id,
    c.fecha,
    c.hora,
    c.motivo,
    c.estado,
    d.nombre as doctor_nombre,
    d.especialidad as doctor_especialidad
FROM citas c
INNER JOIN doctores d ON c.doctor_id = d.id
WHERE c.paciente_id = ?
ORDER BY c.fecha DESC, c.hora ASC;

-- Citas por estado
SELECT 
    estado,
    COUNT(*) as cantidad
FROM citas 
GROUP BY estado
ORDER BY cantidad DESC;

-- Citas programadas para los próximos 7 días
SELECT 
    c.fecha,
    c.hora,
    p.nombre as paciente_nombre,
    d.nombre as doctor_nombre,
    c.motivo
FROM citas c
INNER JOIN pacientes p ON c.paciente_id = p.id
INNER JOIN doctores d ON c.doctor_id = d.id
WHERE c.fecha BETWEEN CURDATE() AND DATE_ADD(CURDATE(), INTERVAL 7 DAY)
AND c.estado = 'programada'
ORDER BY c.fecha ASC, c.hora ASC;

-- =====================================================
-- 4. CONSULTAS DE HISTORIAL MÉDICO
-- =====================================================

-- Historial completo de un paciente
SELECT 
    h.id,
    h.fecha,
    h.diagnostico,
    h.tratamiento,
    h.observaciones,
    d.nombre as doctor_nombre,
    d.especialidad as doctor_especialidad
FROM historial_medico h
INNER JOIN doctores d ON h.doctor_id = d.id
WHERE h.paciente_id = ?
ORDER BY h.fecha DESC;

-- Registros médicos por doctor
SELECT 
    h.id,
    h.fecha,
    h.diagnostico,
    h.tratamiento,
    p.nombre as paciente_nombre,
    p.edad as paciente_edad
FROM historial_medico h
INNER JOIN pacientes p ON h.paciente_id = p.id
WHERE h.doctor_id = ?
ORDER BY h.fecha DESC;

-- Buscar en historial por diagnóstico
SELECT 
    h.id,
    h.fecha,
    h.diagnostico,
    h.tratamiento,
    p.nombre as paciente_nombre,
    d.nombre as doctor_nombre
FROM historial_medico h
INNER JOIN pacientes p ON h.paciente_id = p.id
INNER JOIN doctores d ON h.doctor_id = d.id
WHERE h.diagnostico LIKE CONCAT('%', ?, '%')
ORDER BY h.fecha DESC;

-- Buscar en historial por tratamiento
SELECT 
    h.id,
    h.fecha,
    h.diagnostico,
    h.tratamiento,
    p.nombre as paciente_nombre,
    d.nombre as doctor_nombre
FROM historial_medico h
INNER JOIN pacientes p ON h.paciente_id = p.id
INNER JOIN doctores d ON h.doctor_id = d.id
WHERE h.tratamiento LIKE CONCAT('%', ?, '%')
ORDER BY h.fecha DESC;

-- =====================================================
-- 5. REPORTES ESTADÍSTICOS
-- =====================================================

-- Estadísticas generales del sistema
SELECT 
    (SELECT COUNT(*) FROM pacientes) as total_pacientes,
    (SELECT COUNT(*) FROM doctores) as total_doctores,
    (SELECT COUNT(*) FROM citas) as total_citas,
    (SELECT COUNT(*) FROM citas WHERE fecha = CURDATE()) as citas_hoy,
    (SELECT COUNT(*) FROM citas WHERE estado = 'programada') as citas_programadas,
    (SELECT COUNT(*) FROM citas WHERE estado = 'completada') as citas_completadas,
    (SELECT COUNT(*) FROM historial_medico) as total_historiales;

-- Reporte de pacientes por doctor
SELECT 
    d.id as doctor_id,
    d.nombre as doctor_nombre,
    d.especialidad,
    COUNT(DISTINCT c.paciente_id) as total_pacientes_unicos,
    COUNT(c.id) as total_citas,
    COUNT(h.id) as total_registros_medicos
FROM doctores d
LEFT JOIN citas c ON d.id = c.doctor_id
LEFT JOIN historial_medico h ON d.id = h.doctor_id
GROUP BY d.id, d.nombre, d.especialidad
ORDER BY total_pacientes_unicos DESC;

-- Reporte detallado de pacientes por doctor
SELECT 
    d.nombre as doctor_nombre,
    d.especialidad,
    p.nombre as paciente_nombre,
    p.edad as paciente_edad,
    COUNT(c.id) as total_citas,
    MAX(c.fecha) as ultima_cita,
    COUNT(h.id) as registros_medicos
FROM doctores d
INNER JOIN citas c ON d.id = c.doctor_id
INNER JOIN pacientes p ON c.paciente_id = p.id
LEFT JOIN historial_medico h ON p.id = h.paciente_id AND d.id = h.doctor_id
GROUP BY d.id, d.nombre, d.especialidad, p.id, p.nombre, p.edad
ORDER BY d.nombre, p.nombre;

-- Reporte de citas por rango de fechas
SELECT 
    DATE(c.fecha) as fecha,
    COUNT(*) as total_citas,
    COUNT(CASE WHEN c.estado = 'programada' THEN 1 END) as programadas,
    COUNT(CASE WHEN c.estado = 'completada' THEN 1 END) as completadas,
    COUNT(CASE WHEN c.estado = 'cancelada' THEN 1 END) as canceladas
FROM citas c
WHERE c.fecha BETWEEN ? AND ?
GROUP BY DATE(c.fecha)
ORDER BY fecha DESC;

-- Análisis de diagnósticos más comunes
SELECT 
    diagnostico,
    COUNT(*) as frecuencia,
    ROUND((COUNT(*) * 100.0 / (SELECT COUNT(*) FROM historial_medico)), 2) as porcentaje
FROM historial_medico
GROUP BY diagnostico
HAVING COUNT(*) > 1
ORDER BY frecuencia DESC
LIMIT 10;

-- Análisis de tratamientos más comunes
SELECT 
    tratamiento,
    COUNT(*) as frecuencia,
    ROUND((COUNT(*) * 100.0 / (SELECT COUNT(*) FROM historial_medico)), 2) as porcentaje
FROM historial_medico
GROUP BY tratamiento
HAVING COUNT(*) > 1
ORDER BY frecuencia DESC
LIMIT 10;

-- Registros médicos por mes
SELECT 
    DATE_FORMAT(fecha, '%Y-%m') as mes,
    COUNT(*) as total_registros,
    COUNT(DISTINCT paciente_id) as pacientes_atendidos,
    COUNT(DISTINCT doctor_id) as doctores_activos
FROM historial_medico
GROUP BY DATE_FORMAT(fecha, '%Y-%m')
ORDER BY mes DESC;

-- =====================================================
-- 6. CONSULTAS DE ANÁLISIS AVANZADO
-- =====================================================

-- Pacientes más frecuentes (con más citas)
SELECT 
    p.id,
    p.nombre,
    p.edad,
    COUNT(c.id) as total_citas,
    COUNT(h.id) as registros_medicos,
    MAX(c.fecha) as ultima_cita
FROM pacientes p
LEFT JOIN citas c ON p.id = c.paciente_id
LEFT JOIN historial_medico h ON p.id = h.paciente_id
GROUP BY p.id, p.nombre, p.edad
HAVING COUNT(c.id) > 0
ORDER BY total_citas DESC
LIMIT 10;

-- Doctores más activos
SELECT 
    d.id,
    d.nombre,
    d.especialidad,
    COUNT(DISTINCT c.paciente_id) as pacientes_unicos,
    COUNT(c.id) as total_citas,
    COUNT(h.id) as registros_creados,
    ROUND(AVG(DATEDIFF(CURDATE(), c.fecha)), 0) as dias_promedio_ultima_cita
FROM doctores d
LEFT JOIN citas c ON d.id = c.doctor_id
LEFT JOIN historial_medico h ON d.id = h.doctor_id
GROUP BY d.id, d.nombre, d.especialidad
ORDER BY total_citas DESC;

-- Análisis de carga de trabajo por doctor y día
SELECT 
    d.nombre as doctor_nombre,
    DAYNAME(c.fecha) as dia_semana,
    COUNT(*) as citas_programadas,
    GROUP_CONCAT(DISTINCT TIME_FORMAT(c.hora, '%H:%i') ORDER BY c.hora SEPARATOR ', ') as horarios
FROM citas c
INNER JOIN doctores d ON c.doctor_id = d.id
WHERE c.fecha >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)
GROUP BY d.id, d.nombre, DAYOFWEEK(c.fecha), DAYNAME(c.fecha)
ORDER BY d.nombre, DAYOFWEEK(c.fecha);

-- Pacientes sin citas recientes (más de 6 meses)
SELECT 
    p.id,
    p.nombre,
    p.telefono,
    p.email,
    MAX(c.fecha) as ultima_cita,
    DATEDIFF(CURDATE(), MAX(c.fecha)) as dias_sin_cita
FROM pacientes p
LEFT JOIN citas c ON p.id = c.paciente_id
GROUP BY p.id, p.nombre, p.telefono, p.email
HAVING MAX(c.fecha) IS NULL OR MAX(c.fecha) < DATE_SUB(CURDATE(), INTERVAL 6 MONTH)
ORDER BY dias_sin_cita DESC;

-- Análisis de eficiencia por especialidad
SELECT 
    d.especialidad,
    COUNT(DISTINCT d.id) as total_doctores,
    COUNT(c.id) as total_citas,
    COUNT(CASE WHEN c.estado = 'completada' THEN 1 END) as citas_completadas,
    ROUND((COUNT(CASE WHEN c.estado = 'completada' THEN 1 END) * 100.0 / COUNT(c.id)), 2) as porcentaje_completadas,
    COUNT(h.id) as registros_medicos,
    ROUND(AVG(DATEDIFF(h.fecha, c.fecha)), 1) as dias_promedio_registro
FROM doctores d
LEFT JOIN citas c ON d.id = c.doctor_id
LEFT JOIN historial_medico h ON d.id = h.doctor_id
GROUP BY d.especialidad
ORDER BY total_citas DESC;

-- =====================================================
-- 7. CONSULTAS DE VALIDACIÓN Y CONTROL
-- =====================================================

-- Verificar integridad referencial
SELECT 'Citas sin paciente' as problema, COUNT(*) as cantidad
FROM citas c
LEFT JOIN pacientes p ON c.paciente_id = p.id
WHERE p.id IS NULL

UNION ALL

SELECT 'Citas sin doctor' as problema, COUNT(*) as cantidad
FROM citas c
LEFT JOIN doctores d ON c.doctor_id = d.id
WHERE d.id IS NULL

UNION ALL

SELECT 'Historiales sin paciente' as problema, COUNT(*) as cantidad
FROM historial_medico h
LEFT JOIN pacientes p ON h.paciente_id = p.id
WHERE p.id IS NULL

UNION ALL

SELECT 'Historiales sin doctor' as problema, COUNT(*) as cantidad
FROM historial_medico h
LEFT JOIN doctores d ON h.doctor_id = d.id
WHERE d.id IS NULL;

-- Detectar posibles duplicados de pacientes
SELECT 
    email,
    COUNT(*) as cantidad,
    GROUP_CONCAT(CONCAT(id, ': ', nombre) SEPARATOR ' | ') as pacientes
FROM pacientes
GROUP BY email
HAVING COUNT(*) > 1;

-- Citas con conflictos de horario (mismo doctor, fecha y hora)
SELECT 
    doctor_id,
    fecha,
    hora,
    COUNT(*) as citas_conflicto,
    GROUP_CONCAT(id SEPARATOR ', ') as ids_citas
FROM citas
GROUP BY doctor_id, fecha, hora
HAVING COUNT(*) > 1;

-- =====================================================
-- 8. CONSULTAS PARA DASHBOARD Y MÉTRICAS
-- =====================================================

-- Métricas del dashboard principal
SELECT 
    'total_pacientes' as metrica,
    COUNT(*) as valor
FROM pacientes

UNION ALL

SELECT 
    'total_doctores' as metrica,
    COUNT(*) as valor
FROM doctores

UNION ALL

SELECT 
    'citas_hoy' as metrica,
    COUNT(*) as valor
FROM citas
WHERE fecha = CURDATE()

UNION ALL

SELECT 
    'total_historiales' as metrica,
    COUNT(*) as valor
FROM historial_medico

UNION ALL

SELECT 
    'citas_programadas' as metrica,
    COUNT(*) as valor
FROM citas
WHERE estado = 'programada' AND fecha >= CURDATE();

-- Tendencias mensuales para gráficos
SELECT 
    DATE_FORMAT(fecha, '%Y-%m') as mes,
    'citas' as tipo,
    COUNT(*) as cantidad
FROM citas
WHERE fecha >= DATE_SUB(CURDATE(), INTERVAL 12 MONTH)
GROUP BY DATE_FORMAT(fecha, '%Y-%m')

UNION ALL

SELECT 
    DATE_FORMAT(fecha, '%Y-%m') as mes,
    'historiales' as tipo,
    COUNT(*) as cantidad
FROM historial_medico
WHERE fecha >= DATE_SUB(CURDATE(), INTERVAL 12 MONTH)
GROUP BY DATE_FORMAT(fecha, '%Y-%m')

UNION ALL

SELECT 
    DATE_FORMAT(fecha_registro, '%Y-%m') as mes,
    'pacientes' as tipo,
    COUNT(*) as cantidad
FROM pacientes
WHERE fecha_registro >= DATE_SUB(CURDATE(), INTERVAL 12 MONTH)
GROUP BY DATE_FORMAT(fecha_registro, '%Y-%m')

ORDER BY mes DESC, tipo;

-- =====================================================
-- NOTAS DE IMPLEMENTACIÓN
-- =====================================================
/*
1. Todas las consultas utilizan parámetros preparados (?) para prevenir inyección SQL
2. Los índices recomendados en el esquema mejoran significativamente el rendimiento
3. Las consultas están optimizadas para el volumen esperado de datos
4. Se incluyen validaciones de integridad referencial
5. Los reportes están diseñados para ser eficientes y informativos
6. Las consultas de análisis proporcionan insights valiosos para la gestión médica
*/