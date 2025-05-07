require('dotenv').config();
const express = require('express');
const path = require('path');
const sequelize = require('./db');

const Incidencia = require('./models/Incidencia');

// Rutes API i EJS
const incidenciesRoutes = require('./routes/incidencies.routes');
const incidenciesRoutesEJS = require('./routes/incidenciesEJS.routes');

// Inicialitzar app
const app = express();

// Middlewares
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Motor de plantilles EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Rutes
app.use('/api/incidencies', incidenciesRoutes);
app.use('/incidencies', incidenciesRoutesEJS);

// Ruta principal
app.get('/', (req, res) => {
  res.render('index'); // Assegura't que existeix views/index.ejs
});

// Port
const port = process.env.PORT || 3000;

// Dades per defecte
const createDefaultData = async () => {
  try {
    await Incidencia.create({
      descripcio: 'Projector no funciona',
      ubicacio: 'Aula 203',
      datetime_creada: new Date(),
      estat: 'pendent',
      prioritat: 'alta',
    });

    console.log('Incidència per defecte creada!');
  } catch (error) {
    console.error('Error creant la incidència per defecte:', error);
  }
};

// Inici servidor
(async () => {
  try {
    await sequelize.sync({ force: true }); // ⚠️ Només per desenvolupament
    console.log('Base de dades sincronitzada.');
    await createDefaultData();
    app.listen(port, () => {
      console.log(`Servidor escoltant a http://localhost:${port}`);
    });
  } catch (error) {
    console.error("Error a l'inici:", error);
  }
})();
