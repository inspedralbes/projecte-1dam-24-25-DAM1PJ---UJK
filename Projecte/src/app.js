require('dotenv').config();
const express = require('express');
const path = require('path'); // Corregido, solo una asignación
const sequelize = require('./db');

// Modelos (común a ambos)
const Incidencia = require('./models/Incidencia');
const Actuacio = require('./models/Actuacio');
const Tecnic = require('./models/Tecnic');
const Departament = require('./models/Departament');
const Tipus = require('./models/Tipus');
const Usuari = require('./models/Usuari');

// Logger MongoDB (de F1)
const { logger, connectToMongoLogger, closeMongoLoggerConnection } = require('./logger');

// Rutas EJS
const incidenciesRoutesEJS = require('./routes/incidenciesEJS.routes');
const assignacionsRoutes = require('./routes/assignacionsEJS.routes'); // Importado en F1, conservado
const adminLogsRoutes = require('./routes/adminLogs.routes.js');   // De F1
const actuacionsRoutes = require('./routes/actuacions.routes');     // De F2

// Inicializar app
const app = express();

// Middlewares
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Middleware para capturar accesos y loguear (de F1)
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
            ip: ip,
            userAgent: userAgent,
            userId: req.user ? req.user.id : null,
            username: req.user ? (req.user.nom || req.user.username) : 'anonymous',
        };
        logger.info(`Acceso HTTP: ${req.method} ${req.originalUrl}`, logMetadata);
    });
    next();
});

// Configurar EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Rutes
app.use('/incidencies', incidenciesRoutesEJS);
app.use('/admin/logs', adminLogsRoutes);      // De F1
app.use('/actuacions', actuacionsRoutes);     // De F2
// Nota: assignacionsRoutes se importa pero no se usa con app.use(). Si es necesario, añadir:
// app.use('/assignacions', assignacionsRoutes);

// Ruta principal (login)
app.get('/', (req, res) => {
  res.render('login', { title: 'Iniciar Sessió', error: null });
});

// Ruta per a la gestió d'incidencies
app.get('/admin/gestionar-incidencies', /* esTecnicoOAdmin, (si tienes autenticación) */ async (req, res) => {
    try {
        const incidencies = await Incidencia.findAll({
            include: [ // Para mostrar el nombre del usuario y el tipo, no solo los IDs
                { model: Usuari, attributes: ['nom', 'id_usuari'] }, // Asumiendo que tu modelo Usuario es 'Usuari'
                { model: Tipus, attributes: ['nom', 'id_tipus'] }   // Asumiendo que tu modelo Tipo es 'Tipus'
            ],
            order: [['datetime_creada', 'DESC']] // Mostrar las más recientes primero
        });
        res.render('admin/gestionar-incidencies', {
            title: 'Gestionar Incidències',
            incidencies,
            user: req.user // Pasa el usuario a la vista si lo necesitas (ej, para el header)
        });
    } catch (error) {
        console.error("Error carregant la pàgina de gestió d'incidències:", error);
        // Podrías tener una vista de error genérica
        res.status(500).send("Error al carregar la pàgina de gestió d'incidències.");
    }
});

// Ruta para mostrar el formulario de registro
app.get('/register', (req, res) => {
  res.render('register', { title: 'Registrar-se', error: null });
});

// Ruta para mostrar el index
app.get('/index', (req, res) => {
  // Asegurarse de pasar 'user' a la vista si la lógica de la vista lo requiere
  // Por ejemplo, si el header o index.ejs depende de 'user':
  // const user = req.session.user; // Si usas sesiones y guardas el usuario ahí
  res.render('index', { title: 'Panel de Control', error: null /*, user */ });
});

// Ruta para procesar el login
app.post('/login', async (req, res) => {
  const { nom, password } = req.body;
  try {
    const usuari = await Usuari.findOne({ where: { nom } });
    if (!usuari || usuari.password !== password) { // Comparación directa de contraseña (considerar hashing en un futuro)
      logger.warn('Intento de login fallido (credenciales incorrectas) para usuario:', { nomIntento: nom });
      return res.render('login', { title: 'Iniciar Sessió', error: 'Credenciales incorrectas' });
    } else {
      // TODO: Establecer sesión de usuario aquí (ej. req.session.user = usuari;) si se usa express-session
      logger.info('Login exitoso para:', { username: usuari.nom, userId: usuari.id_usuari });
      return res.redirect('/index');
    }
  } catch (error) {
    logger.error('Error iniciando sesión:', { error: error.message, stack: error.stack });
    return res.render('login', { title: 'Iniciar Sessió', error: 'Hubo un error al procesar tu solicitud.' });
  }
});

function esTecnicoOAdmin(req, res, next) {

    if (req.user && (req.user.rol === 'Tècnic' || req.user.rol === 'Professor/a' || req.user.rol === 'administrador')) { // Ajusta los roles
        return next();
    }
    
    res.status(403).send('Accés Denegat. Es requereix rol de Tècnic o Administrador.');
}




// Port
const port = process.env.PORT || 3010;

//Definim les relacions (idénticas en ambos)
Departament.hasMany(Usuari, { foreignKey: 'id_departament'});
Usuari.belongsTo(Departament, { foreignKey: 'id_departament'});
Usuari.hasMany(Incidencia, { foreignKey: 'id_usuari'});
Incidencia.belongsTo(Usuari, { foreignKey: 'id_usuari'});
Tipus.hasMany(Incidencia, { foreignKey: 'id_tipus'});
Incidencia.belongsTo(Tipus, { foreignKey: 'id_tipus'});
Tecnic.hasMany(Actuacio, { foreignKey: 'id_tecnic'});
Actuacio.belongsTo(Tecnic, { foreignKey: 'id_tecnic'});
Incidencia.hasMany(Actuacio, { foreignKey: 'id_incidencia'});
Actuacio.belongsTo(Incidencia, { foreignKey: 'id_incidencia'});
Usuari.hasMany(Actuacio, { foreignKey: 'id_usuari'});
Actuacio.belongsTo(Usuari, { foreignKey: 'id_usuari'});

// Crear datos por defecto (basado en F1, integrando de F2)
const createDefaultData = async () => {
    try {
        await sequelize.transaction(async (t) => {
            logger.info('Iniciando creación de datos por defecto...');

            const departament = await Departament.findOrCreate({
                where: { nom: 'Departament de Física' },
                defaults: { nom: 'Departament de Física' },
                transaction: t,
            });
            logger.info('Departament de prova creat/trobat', { data: departament[0].toJSON() });

            const tipus = await Tipus.findOrCreate({
                where: { nom: 'Software' },
                defaults: { nom: 'Software' },
                transaction: t,
            });
            logger.info('Tipus de prova creat/trobat', { data: tipus[0].toJSON() });

            const tecnic1 = await Tecnic.findOrCreate({
                where: { nom: 'Juan' },
                defaults: { nom: 'Juan' },
                transaction: t,
            });
            logger.info('Tècnic de prova (Juan) creat/trobat', { data: tecnic1[0].toJSON() });

            const tecnic2 = await Tecnic.findOrCreate({ // Añadido de F2
                where: { nom: 'Torres' },
                defaults: { nom: 'Torres' },
                transaction: t,
            });
            logger.info('Tècnic de prova (Torres) creat/trobat', { data: tecnic2[0].toJSON() });

            const usuari = await Usuari.findOrCreate({
                where: { nom: 'Marc', id_departament: departament[0].id_departament },
                defaults: {
                    nom: 'Marc',
                    rol: 'Professor/a',
                    password: '12345', // Añadido de F2 (Asegúrate que el modelo Usuari maneje esto)
                    id_departament: departament[0].id_departament,
                },
                transaction: t,
            });
            logger.info('Usuari de prova creat/trobat', { data: usuari[0].toJSON() });

            const incidencia = await Incidencia.findOrCreate({
                where: { descripcio: 'Endoll fos.', id_usuari: usuari[0].id_usuari },
                defaults: {
                    id_usuari: usuari[0].id_usuari,
                    id_tipus: tipus[0].id_tipus,
                    descripcio: 'Endoll fos.',
                    datetime_creada: new Date(),
                    ubicacio: 'Laboratori 3',
                    estat: 'Oberta',
                    prioritat: 'Mitjana',
                },
                transaction: t,
            });
            logger.info('Incidència de prova creada/trobada', { data: incidencia[0].toJSON() });

            const actuacio = await Actuacio.findOrCreate({
                where: { descripcio: 'Revisió de l’endoll', id_incidencia: incidencia[0].id_incidencia },
                defaults: {
                    id_tecnic: tecnic1[0].id_tecnic,
                    finalitza_actuacio: true, // De F2 (más explícito que 1)
                    data_actuacio: new Date(),
                    descripcio: 'Revisió de l’endoll',
                    id_incidencia: incidencia[0].id_incidencia,
                    id_usuari: usuari[0].id_usuari
                },
                transaction: t,
            });
            logger.info('Actuació de prova creada/trobada', { data: actuacio[0].toJSON() });

            logger.info('Dades per defecte creades/verificades correctament!');
        });
    } catch (error) {
        logger.error('Error creant/verificant dades per defecte', { error: error.message, stack: error.stack });
    }
};

// Iniciar servidor (de F1)
(async () => {
  try {
    await connectToMongoLogger();
    logger.info('Logger conectado a MongoDB.');

    await sequelize.sync({ force: true }); // OJO: force:true borra y recrea tablas
    logger.info('Base de dades SQL (Sequelize) sincronitzada.');

    await createDefaultData();

    app.listen(port, () => {
      logger.info(`Servidor Express iniciat i escoltant al port ${port}`);
      console.log(`Servidor escoltant a http://localhost:${port}`); // Para feedback rápido en consola
    });
  } catch (error) {
    logger.error("Error crític durant l'inici de l'aplicació", { error: error.message, stack: error.stack });
    console.error("Error a l'inici:", error);
    await closeMongoLoggerConnection();
    process.exit(1);
  }
})();

// Manejo Esencial de Cierre Ordenado para el Logger (de F1)
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
        logger.error('Error durante el cierre ordenado de conexiones', { error: err.message, stack: err.stack });
        console.error('Error durante el cierre:', err);
    } finally {
        logger.info('Aplicación cerrada.');
        console.log('Aplicación cerrada.');
        process.exit(0);
    }
}
process.on('SIGINT', () => gracefulShutdown('SIGINT'));
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));