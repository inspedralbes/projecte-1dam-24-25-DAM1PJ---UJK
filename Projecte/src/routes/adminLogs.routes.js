// routes/adminLogs.routes.js
const express = require('express');
const router = express.Router();
const { connectToMongoLogger } = require('../logger'); // Para acceder a la DB
const { MongoClient } = require('mongodb'); // Necesario si logger.js no expone 'db' directamente

// Middleware de autenticación/autorización (¡MUY IMPORTANTE!)
// Deberías tener un middleware que verifique si el usuario es administrador
// Aquí un placeholder, DEBES IMPLEMENTARLO CORRECTAMENTE
const isAdmin = (req, res, next) => {
    if (req.user && req.user.rol === 'Tecnico') { // Ajusta 'administrador' a tu rol
        return next();
    }
    // req.flash('error', 'Acceso no autorizado.'); // Si usas connect-flash
    // res.redirect('/'); // O a una página de login/error
    res.status(403).send('Acceso denegado. Debes ser administrador.');
};

router.use(isAdmin); // Aplicar a todas las rutas de este archivo

// Ruta para mostrar los logs
router.get('/', async (req, res) => {
    try {
        const db = await connectToMongoLogger(); // Obtiene la instancia de la BD del logger
        if (!db) {
            // return res.status(500).send('No se pudo conectar a la base de datos de logs.');
            return res.render('admin/view_logs', {
                title: 'Logs de Acceso',
                logs: [],
                error: 'No se pudo conectar a la base de datos de logs.',
                currentPage: 1,
                totalPages: 0,
                searchTerm: ''
            });
        }

        const logCollection = db.collection(process.env.LOG_COLLECTION_NAME || 'access_logs');

        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20; // Logs por página
        const skip = (page - 1) * limit;
        let searchTerm = req.query.search || '';
        let query = {};

        if (searchTerm) {
            const regex = new RegExp(searchTerm, 'i'); // Búsqueda case-insensitive
            query = {
                $or: [
                    { url: regex },
                    { message: regex },
                    { username: regex },
                    { ip: regex },
                    { userAgent: regex }
                ]
            };
        }

        const totalLogs = await logCollection.countDocuments(query);
        const totalPages = Math.ceil(totalLogs / limit);

        const logs = await logCollection.find(query)
            .sort({ timestamp: -1 }) // Los más recientes primero
            .skip(skip)
            .limit(limit)
            .toArray();

        res.render('admin/view_logs', { // Necesitarás crear esta vista EJS
            title: 'Logs de Acceso',
            logs: logs,
            currentPage: page,
            totalPages: totalPages,
            limit: limit,
            searchTerm: searchTerm,
            error: null
        });
    } catch (error) {
        console.error("Error al obtener logs:", error);
        // logger.error("Error al obtener logs para el panel de admin", error); // Loguear el error mismo
        res.status(500).render('admin/view_logs', {
            title: 'Logs de Acceso',
            logs: [],
            error: 'Error al cargar los logs.',
            currentPage: 1,
            totalPages: 0,
            searchTerm: ''
        });
    }
});

// Ruta para mostrar estadísticas de logs
router.get('/stats', async (req, res) => {
    try {
        const db = await connectToMongoLogger();
        if (!db) {
            return res.status(500).send('No se pudo conectar a la base de datos de logs para estadísticas.');
        }
        const logCollection = db.collection(process.env.LOG_COLLECTION_NAME || 'access_logs');

        // 1. Logs por nivel
        const logsByLevel = await logCollection.aggregate([
            { $group: { _id: "$level", count: { $sum: 1 } } },
            { $sort: { count: -1 } }
        ]).toArray();

        // 2. Páginas más visitadas (Top 10)
        const topPages = await logCollection.aggregate([
            { $match: { method: "GET" } }, // Solo considerar GETs para "páginas"
            { $group: { _id: "$url", count: { $sum: 1 } } },
            { $sort: { count: -1 } },
            { $limit: 10 }
        ]).toArray();

        // 3. Actividad por día (últimos 30 días)
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        const activityByDay = await logCollection.aggregate([
            { $match: { timestamp: { $gte: thirtyDaysAgo } } },
            {
                $group: {
                    _id: { $dateToString: { format: "%Y-%m-%d", date: "$timestamp" } },
                    count: { $sum: 1 }
                }
            },
            { $sort: { _id: 1 } } // Ordenar por fecha
        ]).toArray();
        
        // 4. Logs por Usuario (Top 10)
        const logsByUsers = await logCollection.aggregate([
            { $match: { username: { $ne: "anonymous", $ne: null } } }, // Excluir anónimos
            { $group: { _id: "$username", count: { $sum: 1 } } },
            { $sort: { count: -1 } },
            { $limit: 10 }
        ]).toArray();


        res.render('admin/log_stats', {
            title: 'Estadísticas de Logs',
            logsByLevel,
            topPages,
            activityByDay,
            logsByUsers,
            error: null
        });

    } catch (error) {
        console.error("Error al obtener estadísticas de logs:", error);
        // logger.error("Error al obtener estadísticas de logs", error);
        res.status(500).render('admin/log_stats', {
            title: 'Estadísticas de Logs',
            error: 'Error al cargar las estadísticas.',
            logsByLevel: [], topPages: [], activityByDay: [], logsByUsers: []
        });
    }
});

module.exports = router; // Asegúrate que esto esté al final del archivo

module.exports = router;