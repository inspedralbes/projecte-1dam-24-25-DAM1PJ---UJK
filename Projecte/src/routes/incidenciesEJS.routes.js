const express = require('express');
const router = express.Router();
const Usuari = require('../models/Usuari'); // De F2
const Tipus = require('../models/Tipus');   // De F2
const Incidencia = require('../models/Incidencia');

// Ruta para mostrar la lista de incidencias (Basado en F2)
router.get('/', async (req, res) => {
  try {
    const incidencies = await Incidencia.findAll({
      include: [ // Funcionalidad de F2 para mostrar nombres relacionados
        { model: Usuari, attributes: ['nom'] },
        { model: Tipus, attributes: ['nom'] }
      ]
    });

    res.render('incidencies/list', {
      title: 'Llista d\'incidències', // De F2
      incidencies
    });
  } catch (error) {
    console.error('Error obteniendo las incidencias:', error); // Logging de F2
    res.render('incidencies/list', {
      title: 'Llista d\'incidències', // De F2
      error: 'Hi ha hagut un error carregant les incidències.' // Manejo de error de F2
    });
  }
});

// Ruta para mostrar el formulario de nueva incidencia (Basado en F2)
router.get('/new', async (req, res) => {
  try {
    const usuaris = await Usuari.findAll();    // Funcionalidad de F2
    const tipusList = await Tipus.findAll(); // Funcionalidad de F2

    res.render('incidencies/new', {
      title: 'Afegir incidència', // De F2
      usuaris,
      tipusList
    });
  } catch (error) {
    console.error('Error al cargar los usuarios o tipos:', error); // Logging de F2
    // Podrías enviar un mensaje de error a la vista como en F2, o el send de F1.
    // Optamos por el manejo de F2 para consistencia:
    res.render('incidencies/new', {
      title: 'Afegir incidència', // De F2
      error: 'Hi ha hagut un error carregant les dades.' // Manejo de error de F2
    });
    // Alternativa si prefieres el manejo de F1 para este error específico:
    // res.status(500).send('Error al carregar el formulari');
  }
});

// Ruta para procesar el formulario de creación de una nueva incidencia (Basado en F2)
router.post('/create', async (req, res) => {
  const {
    id_usuari,
    id_tipus,
    descripcio,
    datetime_creada,
    ubicacio,
    estat,
    prioritat
  } = req.body;

  try {
    await Incidencia.create({ // La lógica de creación es idéntica en ambos
      id_usuari,
      id_tipus,
      descripcio,
      datetime_creada,
      ubicacio,
      estat,
      prioritat
    });
    console.log('✅ Incidencia creada'); // Logging de F2 (adaptado ligeramente)
    res.redirect('/incidencies');
  } catch (error) {
    console.error('❌ Error creando incidencia:', error); // Logging de F2
    // F2 redirige a /new. F1 da un error 500.
    // Mantendremos la redirección de F2 que es mejor UX.
    res.redirect('/incidencies/new'); // Redirección de F2
    // Alternativa si prefieres el manejo de F1 para este error:
    // res.status(500).send('Error al crear la incidència');
  }
});

// Ruta para mostrar el formulario de edición de una incidencia (Basado en F2)
router.get('/:id/edit', async (req, res) => {
  try {
    const incidencia = await Incidencia.findByPk(req.params.id);
    if (!incidencia) return res.status(404).send('Incidència no trobada'); // Común a ambos, buena práctica

    const usuaris = await Usuari.findAll();    // Funcionalidad de F2
    const tipusList = await Tipus.findAll(); // Funcionalidad de F2

    res.render('incidencies/edit', {
      // title: 'Editar Incidència', // Podrías añadir un title como en F2 si quieres
      incidencia,
      usuaris,
      tipusList
    });
  } catch (error) {
    console.error('Error carregant per editar:', error); // Logging de F2
    res.status(500).send('Error al carregar el formulari d’edició'); // Mensaje de F1, error de F2 similar
  }
});

// Ruta para procesar la actualización de una incidencia (Basado en F2)
router.post('/:id/update', async (req, res) => {
  const {
    id_usuari,
    id_tipus,
    descripcio,
    datetime_creada,
    ubicacio,
    estat,
    prioritat
  } = req.body;

  try {
    const incidencia = await Incidencia.findByPk(req.params.id);
    if (!incidencia) return res.status(404).send('Incidència no trobada'); // Común

    // Actualizar los datos usando el método update de F2
    await incidencia.update({
      id_usuari,
      id_tipus,
      descripcio,
      datetime_creada,
      ubicacio,
      estat,
      prioritat
    });

    res.redirect('/incidencies');
  } catch (error) {
    console.error('❌ Error actualitzant la incidència:', error); // Logging de F2
    res.status(500).send('Error actualitzant la incidència'); // Mensaje de F1, error de F2 similar
  }
});

// Eliminar incidència (Tomado de F1, ya que F2 no lo tiene)
router.get('/:id/delete', async (req, res) => {
  try {
    const incidencia = await Incidencia.findByPk(req.params.id);
    if (!incidencia) return res.status(404).send('Incidència no trobada');
    await incidencia.destroy();
    res.redirect('/incidencies');
  } catch (error) {
    // No había console.error en F1 para esta ruta, se podría añadir si se desea
    // console.error('Error al eliminar la incidència:', error);
    res.status(500).send('Error al eliminar la incidència');
  }
});

module.exports = router;