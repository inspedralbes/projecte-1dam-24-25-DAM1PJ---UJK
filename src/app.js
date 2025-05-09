require('dotenv').config();
const express = require('express');
const path = require('path');
const sequelize = require('./db');
const Incidencia = require('./models/Incidencia');

// Rutes EJS
const incidenciesRoutesEJS = require('./routes/incidenciesEJS.routes');

const assignacionsRoutes = require('./routes/assignacionsEJS.routes');


// Inicialitzar app
const app = express();

// Middlewares
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Configurar EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Rutes
app.use('/incidencies', incidenciesRoutesEJS);

// Ruta principal
app.get('/', (req, res) => {
  res.render('index');
});

// Port
const port = process.env.PORT || 3000;

// Crear incidència per defecte
const createDefaultData = async () => {
  try {
    await Incidencia.create({
      id_usuari: 1,
      id_tipus: 1,
      descripcio: 'Exemple d’incidència inicial.',
      datetime_creada: new Date(),
      ubicacio: 'Laboratori 3',
      estat: 'Oberta',
      prioritat: 'Mitjana',
    });

    console.log('Incidència de prova creada correctament!');
  } catch (error) {
    console.error('Error creant incidència de prova:', error);
  }
};

// Iniciar servidor
(async () => {
  try {
    await sequelize.sync({ force: true });
    console.log('Base de dades sincronitzada.');

    await createDefaultData();

    app.listen(port, () => {
      console.log(`Servidor escoltant a http://localhost:${port}`);
    });
  } catch (error) {
    console.error("Error a l'inici:", error);
  }
})();
