// logger.js
const { MongoClient } = require('mongodb');

// --- Configuración ---
// Usa variables de entorno para la URI, nombre de la BD y colección de logs
const MONGODB_URI = process.env.MONGODB_LOG_URI
const DB_NAME = process.env.LOG_DB_NAME
const COLLECTION_NAME = process.env.LOG_COLLECTION_NAME
// --- Fin Configuración ---

let db;
let client;

/**
 * Conecta a la base de datos MongoDB para logging.
 */
async function connectToMongoLogger() {
    if (db) {
        return db;
    }
    try {
        if (!client || !client.topology || !client.topology.isConnected()) {
            client = new MongoClient(MONGODB_URI); // No necesitas useNewUrlParser y useUnifiedTopology con drivers recientes
            await client.connect();
            console.log('Conectado a MongoDB para logging.');

            client.on('close', () => {
                console.warn('Conexión de MongoDB para logging cerrada. Intentando reconectar en el próximo log...');
                db = null;
            });
        }
        db = client.db(DB_NAME);
        return db;
    } catch (err) {
        console.error('Error al conectar con MongoDB para logging:', err.message);
        db = null;
        return null; // Indica que la conexión falló
    }
}

/**
 * Registra un mensaje de log en la colección de MongoDB.
 * @param {string} level Nivel del log (e.g., 'INFO', 'ERROR', 'WARN', 'DEBUG')
 * @param {string} message Mensaje del log.
 * @param {object} [metadata={}] Metadatos adicionales.
 */
async function log(level, message, metadata = {}) {
    try {
        const currentDb = await connectToMongoLogger();
        if (!currentDb) {
            // Fallback a consola si no se pudo conectar a MongoDB
            console.warn(`[Fallback Log - DB No Conectada] ${level.toUpperCase()}: ${message}`, metadata);
            return;
        }

        const logCollection = currentDb.collection(COLLECTION_NAME);
        const logEntry = {
            timestamp: new Date(),
            level: level.toUpperCase(),
            message,
            ...metadata,
        };

        await logCollection.insertOne(logEntry);
    } catch (err) {
        console.error('Error al guardar log en MongoDB:', err.message);
        // Fallback a consola si falla la inserción
        console.error(`[Fallback Log - Error DB Insert] ${level.toUpperCase()}: ${message}`, metadata);
    }
}

const logger = {
    info: (message, metadata) => log('INFO', message, metadata),
    warn: (message, metadata) => log('WARN', message, metadata),
    error: (message, errorOrMetadata, metadataOnlyIfError) => {
        let meta = {};
        if (errorOrMetadata instanceof Error) {
            meta.errorMessage = errorOrMetadata.message;
            meta.stack = errorOrMetadata.stack;
            if (metadataOnlyIfError && typeof metadataOnlyIfError === 'object') {
                meta = { ...meta, ...metadataOnlyIfError };
            }
        } else if (typeof errorOrMetadata === 'object') {
            meta = errorOrMetadata;
        }
        log('ERROR', message, meta);
    },
    debug: (message, metadata) => log('DEBUG', message, metadata),
};

/**
 * Cierra la conexión a MongoDB para logging.
 */
async function closeMongoLoggerConnection() {
    if (client) {
        try {
            await client.close();
            console.log('Conexión de MongoDB para logging cerrada.');
            client = null;
            db = null;
        } catch (err) {
            console.error('Error al cerrar la conexión de MongoDB para logging:', err.message);
        }
    }
}

module.exports = {
    logger,
    connectToMongoLogger,
    closeMongoLoggerConnection,
};