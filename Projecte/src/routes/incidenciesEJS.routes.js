const express = require('express');
const router = express.Router();
const Tipus = require('../models/Tipus');  
const Departament = require('../models/Departament');
const Incidencia = require('../models/Incidencia');

// Ruta para mostrar la lista de incidencias 
router.get('/', async (req, res) => {
  try {
    const incidencies = await Incidencia.findAll({
      include: [ 
        { model: Tipus, attributes: ['nom'] },
        { model: Departament, attributes: ['nom'] }
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
    const tipusList = await Tipus.findAll(); 
    const departaments = await Departament.findAll();

    res.render('incidencies/new', {
      title: 'Afegir incidència', 
      tipusList,
      departaments
    });
  } catch (error) {
    console.error('Error al cargar tipus o departaments:', error);
    res.render('incidencies/new', {
      title: 'Afegir incidència', 
      error: 'Hi ha hagut un error carregant les dades.' 
    });
  }
});

// Ruta para procesar el formulario de creación de una nueva incidencia
router.post('/create', async (req, res) => {
  const {
    id_tipus,
    id_departament,
    descripcio,
    datetime_creada,
    estat,
    prioritat
  } = req.body;

  try {
    await Incidencia.create({
      id_tipus,
      id_departament,
      descripcio,
      datetime_creada,
      estat,
      prioritat
    });
    console.log('✅ Incidencia creada');
    res.redirect('/incidencies');
  } catch (error) {
    console.error('❌ Error creando incidencia:', error);
    res.redirect('/incidencies/new');
  }
});

// Ruta para mostrar el formulario de edición de una incidencia
router.get('/:id/edit', async (req, res) => {
  try {
    const incidencia = await Incidencia.findByPk(req.params.id);
    if (!incidencia) return res.status(404).send('Incidència no trobada'); 

    const tipusList = await Tipus.findAll(); 
    const departaments = await Departament.findAll();

    res.render('incidencies/edit', {
      title: 'Editar Incidència',
      incidencia,
      tipusList,
      departaments
    });
  } catch (error) {
    console.error('Error carregant per editar:', error); 
    res.status(500).send('Error al carregar el formulari d’edició');
  }
});

// Ruta para procesar la actualización de una incidencia
router.post('/:id/update', async (req, res) => {
  const {
    id_tipus,
    id_departament,
    descripcio,
    datetime_creada,
    estat,
    prioritat
  } = req.body;

  try {
    const incidencia = await Incidencia.findByPk(req.params.id);
    if (!incidencia) return res.status(404).send('Incidència no trobada');

    await incidencia.update({
      id_tipus,
      id_departament,
      descripcio,
      datetime_creada,
      estat,
      prioritat
    });

    res.redirect('/incidencies');
  } catch (error) {
    console.error('❌ Error actualitzant la incidència:', error);
    res.status(500).send('Error actualitzant la incidència');
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
