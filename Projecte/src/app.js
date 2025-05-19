require('dotenv').config();
const express = require('express');
const path = require('path');
const sequelize = require('./db');

// Modelos
const Incidencia = require('./models/Incidencia');
const Actuacio = require('./models/Actuacio');
const Tecnic = require('./models/Tecnic');
const Departament = require('./models/Departament');
const Tipus = require('./models/Tipus');

// Logger MongoDB
const { logger, connectToMongoLogger, closeMongoLoggerConnection } = require('./logger');

// Rutas EJS
const incidenciesRoutesEJS = require('./routes/incidenciesEJS.routes');
const assignacionsRoutes = require('./routes/assignacionsEJS.routes');
const adminLogsRoutes = require('./routes/adminLogs.routes.js');
const actuacionsRoutes = require('./routes/actuacions.routes');
const departamentsRoutes = require('./routes/departaments.routes');
const tecnicsRoutes = require('./routes/tecnic.routes');
const tipusRoutes = require('./routes/tipus.routes');

// Inicializar app
const app = express();

// Middlewares
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Logger middleware
app.use((req, res, next) => {
    const start = Date.now();
    res.on('finish', () => {
        const duration = Date.now() - start;
        const userAgent = req.get('User-Agent') || 'N/A';
        const ip = req.ip || req.connection.remoteAddress;
        const logMetadata = {
            url: req.originalUrl,
            method: req.method,
            statusCode: res.statusCode,
            durationMs: duration,
            ip,
            userAgent,
            userId: null,
            username: 'anonymous',
        };
        logger.info(`Acceso HTTP: ${req.method} ${req.originalUrl}`, logMetadata);
    });
    next();
});

// Configurar EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Rutas
app.use('/incidencies', incidenciesRoutesEJS);
app.use('/admin/view_logs', adminLogsRoutes);
app.use('/actuacions', actuacionsRoutes);
app.use('/assignacions', assignacionsRoutes);
app.use('/departament', departamentsRoutes);
app.use('/tecnic', tecnicsRoutes);
app.use('/tipus', tipusRoutes);
app.use('/admin/logs', adminLogsRoutes);

// Página principal
app.get('/', (req, res) => res.redirect('/index'));

app.get('/index', (req, res) => {
    res.render('index', { title: 'Panel de Control', error: null });
});

// Panel admin
app.get('/admin/control-panel', (req, res) => {
    res.render('admin/control-panel', { title: 'Panell de Control Administrador', user: { rol: 'administrador' } });
});

// Formularios

app.get('/tipus/new', (req, res) => {
    res.render('tipus/new', { title: 'Crear Tipus' });
});


// POST formularios

app.post('/tipus/new', async (req, res) => {
    try {
        await Tipus.create({ nom: req.body.nom });
        res.redirect('/admin/control-panel');
    } catch (err) {
        res.status(500).send('Error creant tipus');
    }
});

// Gestionar incidències admin
app.get('/admin/gestionar-incidencies', async (req, res) => {
    try {
        const incidencies = await Incidencia.findAll({
            include: [{ model: Tipus, attributes: ['nom', 'id_tipus'] }],
            order: [['datetime_creada', 'DESC']]
        });
        res.render('admin/gestionar-incidencies', {
            title: 'Gestionar Incidències',
            incidencies
        });
    } catch (error) {
        console.error("Error carregant la pàgina de gestió d'incidències:", error);
        res.status(500).send("Error al carregar la pàgina de gestió d'incidències.");
    }
});

// Puerto
const port = process.env.PORT || 3010;

// Relaciones Sequelize
Departament.hasMany(Incidencia, { foreignKey: 'id_departament' });
Incidencia.belongsTo(Departament, { foreignKey: 'id_departament' });

Tipus.hasMany(Incidencia, { foreignKey: 'id_tipus' });
Incidencia.belongsTo(Tipus, { foreignKey: 'id_tipus' });

Tecnic.hasMany(Actuacio, { foreignKey: 'id_tecnic' });
Actuacio.belongsTo(Tecnic, { foreignKey: 'id_tecnic', as: 'tecnic' });

Incidencia.hasMany(Actuacio, { foreignKey: 'id_incidencia' });
Actuacio.belongsTo(Incidencia, { foreignKey: 'id_incidencia' });

// Crear datos por defecto
const createDefaultData = async () => {
    try {
        await sequelize.transaction(async (t) => {
            logger.info('Iniciando creación de datos por defecto...');

            const [departament] = await Departament.findOrCreate({
                where: { nom: 'Departament de Física' },
                defaults: { nom: 'Departament de Física' },
                transaction: t,
            });

            const [tipus] = await Tipus.findOrCreate({
                where: { nom: 'Software' },
                defaults: { nom: 'Software' },
                transaction: t,
            });

            const [tecnic1] = await Tecnic.findOrCreate({
                where: { nom: 'Juan' },
                defaults: { nom: 'Juan' },
                transaction: t,
            });

            const [tecnic2] = await Tecnic.findOrCreate({
                where: { nom: 'Torres' },
                defaults: { nom: 'Torres' },
                transaction: t,
            });

            const [incidencia] = await Incidencia.findOrCreate({
                where: { descripcio: 'Endoll fos.' },
                defaults: {
                    id_tipus: tipus.id_tipus,
                    descripcio: 'Endoll fos.',
                    datetime_creada: new Date(),
                    id_departament: departament.id_departament,
                    estat: 'En Procès',
                    prioritat: 'Analitzant',
                },
                transaction: t,
            });

            await Actuacio.findOrCreate({
                where: { descripcio: 'Revisió de l’endoll', id_incidencia: incidencia.id_incidencia },
                defaults: {
                    id_tecnic: tecnic1.id_tecnic,
                    finalitza_actuacio: true,
                    data_actuacio: new Date(),
                    descripcio: 'Revisió de l’endoll',
                    id_incidencia: incidencia.id_incidencia,
                    temps_invertit: 30
                },
                transaction: t,
            });

            logger.info('Dades per defecte creades/verificades correctament!');
        });
    } catch (error) {
        logger.error('Error creant/verificant dades per defecte', { error: error.message, stack: error.stack });
    }
};

// Iniciar servidor
(async () => {
    try {
        await connectToMongoLogger();
        logger.info('Logger conectado a MongoDB.');

        await sequelize.sync({ force: true });
        logger.info('Base de dades SQL sincronitzada.');

        await createDefaultData();

        app.listen(port, () => {
            logger.info(`Servidor escoltant al port ${port}`);
            console.log(`Servidor escoltant a http://localhost:${port}`);
        });
    } catch (error) {
        logger.error("Error crític durant l'inici de l'aplicació", { error: error.message, stack: error.stack });
        console.error("Error a l'inici:", error);
        await closeMongoLoggerConnection();
        process.exit(1);
    }
})();

// Cierre ordenado
async function gracefulShutdown(signal) {
    logger.warn(`Señal ${signal} recibida. Iniciando cierre ordenado...`);
    console.log(`\nCerrando la aplicación debido a ${signal}...`);
    try {
        await closeMongoLoggerConnection();
        if (sequelize) {
            await sequelize.close();
            logger.info('Conexión Sequelize cerrada.');
            console.log('Conexión Sequelize cerrada.');
        }
    } catch (err) {
        logger.error('Error durante el cierre ordenado', { error: err.message, stack: err.stack });
        console.error('Error durante el cierre:', err);
    } finally {
        logger.info('Aplicación cerrada.');
        console.log('Aplicación cerrada.');
        process.exit(0);
    }
}
process.on('SIGINT', () => gracefulShutdown('SIGINT'));
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
