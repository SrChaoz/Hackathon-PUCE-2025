const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares globales
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Middleware de logging
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
    next();
});

// Importar rutas
const authRoutes = require('./routes/auth');
const songsRoutes = require('./routes/songs');

// Registrar rutas
app.use('/api/auth', authRoutes);
app.use('/api', songsRoutes);

// Ruta de prueba y health check
app.get('/', (req, res) => {
    res.json({ 
        success: true,
        message: 'Servidor backend funcionando correctamente',
        version: '1.0.0',
        timestamp: new Date().toISOString(),
        endpoints: {
            auth: '/api/auth',
            songs: '/api/songs'
        }
    });
});

app.get('/health', (req, res) => {
    res.json({ 
        success: true,
        status: 'healthy',
        timestamp: new Date().toISOString(),
        uptime: process.uptime()
    });
});

// Manejo de rutas no encontradas
app.use('*', (req, res) => {
    res.status(404).json({ 
        success: false,
        error: 'Endpoint no encontrado',
        message: `La ruta ${req.method} ${req.originalUrl} no existe`,
        timestamp: new Date().toISOString()
    });
});

// Manejo de errores global
app.use((err, req, res, next) => {
    console.error('Error no manejado:', err.stack);
    
    // No enviar stack trace en producción
    const isDevelopment = process.env.NODE_ENV === 'development';
    
    res.status(err.status || 500).json({ 
        success: false,
        error: 'Error interno del servidor',
        message: isDevelopment ? err.message : 'Algo salió mal en el servidor',
        timestamp: new Date().toISOString(),
        ...(isDevelopment && { stack: err.stack })
    });
});

// Iniciar servidor
const server = app.listen(PORT, () => {
    console.log(`🚀 Servidor ejecutándose en http://localhost:${PORT}`);
    console.log(`🌍 Entorno: ${process.env.NODE_ENV || 'development'}`);
    console.log(`📊 Endpoints disponibles:`);
    console.log(`   GET    / - Health check`);
    console.log(`   GET    /api/songs - Obtener canciones`);
    console.log(`   POST   /api/songs - Crear canción (autenticado)`);
    console.log(`   PUT    /api/songs/:id - Actualizar canción (autenticado)`);
    console.log(`   DELETE /api/songs/:id - Eliminar canción (autenticado)`);
    console.log(`   POST   /api/auth/login - Iniciar sesión`);
});

// Manejo graceful de cierre del servidor
process.on('SIGTERM', () => {
    console.log('SIGTERM recibido, cerrando servidor...');
    server.close(() => {
        console.log('Servidor cerrado correctamente');
        process.exit(0);
    });
});

process.on('SIGINT', () => {
    console.log('SIGINT recibido, cerrando servidor...');
    server.close(() => {
        console.log('Servidor cerrado correctamente');
        process.exit(0);
    });
});

module.exports = app;
