const express = require('express');
const router = express.Router();
const Usuari = require('../models/Usuari');
const Tipus = require('../models/Tipus');  
const Incidencia = require('../models/Incidencia');

// Ruta para mostrar la lista de incidencias 
router.get('/', async (req, res) => {
  try {
    const incidencies = await Incidencia.findAll({
      include: [ 
        { model: Usuari, attributes: ['nom'] },
        { model: Tipus, attributes: ['nom'] }
      ]
    });

    res.render('incidencies/list', {
      title: 'Llista d\'incidències', 
      incidencies
    });
  } catch (error) {
    console.error('Error obteniendo las incidencias:', error); 
    res.render('incidencies/list', {
      title: 'Llista d\'incidències',
      error: 'Hi ha hagut un error carregant les incidències.' 
    });
  }
});

// Ruta para mostrar el formulario de nueva incidencia 
router.get('/new', async (req, res) => {
  try {
    const usuaris = await Usuari.findAll();    
    const tipusList = await Tipus.findAll(); 

    res.render('incidencies/new', {
      title: 'Afegir incidència', 
      usuaris,
      tipusList
    });
  } catch (error) {
    console.error('Error al cargar los usuarios o tipos:', error);
   
    
    res.render('incidencies/new', {
      title: 'Afegir incidència', 
      error: 'Hi ha hagut un error carregant les dades.' 
    });

    res.status(500).send('Error al carregar el formulari');
  }
});

// Ruta para procesar el formulario de creación de una nueva incidencia
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
    await Incidencia.create({ // La lógica de creación
      id_usuari,
      id_tipus,
      descripcio,
      datetime_creada,
      ubicacio,
      estat,
      prioritat
    });
    console.log('✅ Incidencia creada'); // Logging 
    res.redirect('/incidencies');
  } catch (error) {
    console.error('❌ Error creando incidencia:', error); // Logging 

    res.redirect('/incidencies/new'); // Redirección

  }
});

// Ruta para mostrar el formulario de edición de una incidencia
router.get('/:id/edit', async (req, res) => {
  try {
    const incidencia = await Incidencia.findByPk(req.params.id);
    if (!incidencia) return res.status(404).send('Incidència no trobada'); 

    const usuaris = await Usuari.findAll();    
    const tipusList = await Tipus.findAll(); 

    res.render('incidencies/edit', {
      title: 'Editar Incidència',
      incidencia,
      usuaris,
      tipusList
    });
  } catch (error) {
    console.error('Error carregant per editar:', error); 
    res.status(500).send('Error al carregar el formulari d’edició');
  }
});

// Ruta para procesar la actualización de una incidencia
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
    if (!incidencia) return res.status(404).send('Incidència no trobada');

    // Actualizar los datos usando el método update
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
    console.error('❌ Error actualitzant la incidència:', error); // Logging
    res.status(500).send('Error actualitzant la incidència'); // Mensaje
  }
});

// Eliminar incidència
router.get('/:id/delete', async (req, res) => {
  try {
    const incidencia = await Incidencia.findByPk(req.params.id);
    if (!incidencia) return res.status(404).send('Incidència no trobada');
    await incidencia.destroy();
    res.redirect('/incidencies');
  } catch (error) {
    
    res.status(500).send('Error al eliminar la incidència');
  }
});

module.exports = router;