# Sistema de Gestión Médica MediCare

## 🏥 Descripción

MediCare es un sistema web completo para la gestión de consultorios médicos, clínicas y centros de salud. Permite administrar pacientes, doctores, citas médicas e historiales clínicos de manera eficiente y organizada.

## ✨ Características Principales

- 📋 **Gestión de Pacientes**: Registro, edición y búsqueda de pacientes
- 👨‍⚕️ **Administración de Doctores**: Control de especialistas y horarios
- 📅 **Programación de Citas**: Sistema completo de agendamiento médico
- 📊 **Historial Médico**: Registro y seguimiento de consultas
- 📈 **Reportes y Análisis**: Estadísticas y reportes detallados
- 💾 **Exportación de Datos**: Múltiples formatos de exportación
- 📱 **Diseño Responsive**: Compatible con dispositivos móviles

## 🚀 Inicio Rápido

### Opción 1: Ejecución Directa
1. Descarga todos los archivos del proyecto
2. Abre `index.html` en tu navegador web
3. ¡El sistema está listo para usar!

### Opción 2: Servidor Local
```bash
# Con Python 3
python -m http.server 8000

# Con Node.js
npx http-server

# Con PHP
php -S localhost:8000
```

Luego accede a: `http://localhost:8000`

## 📁 Estructura del Proyecto

```
proyecto2/
├── index.html                    # Página principal
├── styles.css                    # Estilos CSS
├── app.js                       # Lógica de la aplicación
├── database.js                  # Simulación de base de datos
├── esquema_base_datos.md        # Documentación del esquema
├── consultas_reportes.sql       # Consultas SQL de referencia
├── DOCUMENTACION_PROYECTO.md    # Documentación completa
└── README.md                    # Este archivo
```

## 🛠️ Tecnologías Utilizadas

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Estilos**: CSS Grid, Flexbox, Responsive Design
- **Almacenamiento**: LocalStorage del navegador
- **Compatibilidad**: Navegadores modernos

## 📖 Funcionalidades

### Dashboard
- Estadísticas en tiempo real
- Citas del día
- Accesos rápidos
- Indicadores visuales

### Gestión de Pacientes
- ➕ Agregar nuevos pacientes
- ✏️ Editar información existente
- 🗑️ Eliminar pacientes
- 🔍 Búsqueda avanzada
- 📋 Lista completa con paginación

### Gestión de Citas
- 📅 Programar nuevas citas
- ✏️ Modificar citas existentes
- ❌ Cancelar citas
- 🔍 Búsqueda por múltiples criterios
- 📊 Vista de calendario

### Historial Médico
- 📝 Crear registros médicos
- 👁️ Ver historial completo
- ✏️ Editar registros
- 🔍 Búsqueda en historial
- 🖨️ Exportar historiales

### Reportes
- 👥 Pacientes por doctor
- 📅 Citas por fecha
- 📊 Análisis estadístico
- 📤 Exportación en múltiples formatos
- 📈 Gráficos y visualizaciones

## 🎯 Casos de Uso

### Para Consultorios Médicos
- Gestión diaria de pacientes y citas
- Control de historiales médicos
- Reportes de actividad

### Para Clínicas
- Administración de múltiples doctores
- Coordinación de especialidades
- Análisis de rendimiento

### Para Centros de Salud
- Gestión masiva de pacientes
- Reportes estadísticos
- Control de recursos médicos

## 📊 Datos de Ejemplo

El sistema incluye datos precargados para demostración:
- 10 pacientes de ejemplo
- 5 doctores con diferentes especialidades
- 15 citas programadas
- 12 registros de historial médico

## 🔧 Personalización

### Colores y Tema
Modifica las variables CSS en `styles.css`:
```css
:root {
    --primary-color: #2c5aa0;
    --secondary-color: #34495e;
    --accent-color: #3498db;
    /* ... más variables */
}
```

### Configuración
Ajusta parámetros en `app.js`:
```javascript
const CONFIG = {
    itemsPerPage: 10,
    dateFormat: 'DD/MM/YYYY',
    timeFormat: '24h'
};
```

## 🐛 Resolución de Problemas

### La página no carga
1. Verifica que todos los archivos estén presentes
2. Abre la consola del navegador (F12) para ver errores
3. Asegúrate de que JavaScript esté habilitado

### Los datos no se guardan
1. Verifica que LocalStorage esté habilitado
2. Comprueba el espacio disponible en el navegador
3. Revisa las validaciones de formulario

### Reportes no se generan
1. Verifica que existan datos para el reporte
2. Comprueba los filtros aplicados
3. Revisa la consola para errores JavaScript

## 📚 Documentación Adicional

- **Documentación Completa**: Ver `DOCUMENTACION_PROYECTO.md`
- **Esquema de Base de Datos**: Ver `esquema_base_datos.md`
- **Consultas SQL**: Ver `consultas_reportes.sql`

## 🔒 Consideraciones de Seguridad

⚠️ **Importante**: Esta es una versión de demostración que utiliza almacenamiento local. Para uso en producción, considera:

- Implementar autenticación de usuarios
- Usar HTTPS para todas las comunicaciones
- Integrar con una base de datos real
- Implementar controles de acceso
- Realizar backups regulares

## 🚀 Próximas Mejoras

- [ ] Integración con base de datos real
- [ ] Sistema de autenticación
- [ ] Notificaciones por email
- [ ] Aplicación móvil
- [ ] Integración con sistemas de facturación
- [ ] API REST para integraciones

## 📄 Licencia

Este proyecto está disponible para uso educativo y comercial.

## 👥 Contribuciones

Las contribuciones son bienvenidas. Por favor:
1. Fork el proyecto
2. Crea una rama para tu feature
3. Commit tus cambios
4. Push a la rama
5. Abre un Pull Request

## 📞 Soporte

Para soporte técnico:
- Revisa la documentación completa
- Consulta los comentarios en el código
- Verifica los datos de ejemplo incluidos

---

**Versión**: 1.0  
**Última actualización**: Enero 2024  

---

¡Gracias por usar el Sistema de Gestión Médica MediCare! 🏥✨


Enlace desplegado: https://68b89b123e8963352683fe9d--medicina1.netlify.app/