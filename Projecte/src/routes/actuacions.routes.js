const express = require('express');
const router = express.Router();
const Tecnic = require('../models/Tecnic');
const Incidencia = require('../models/Incidencia');
const Actuacio = require('../models/Actuacio');

// Llistat d'actuacions
router.get('/', async (req, res) => {
  try {
    const actuacions = await Actuacio.findAll({
      include: [
        { model: Tecnic, as: 'tecnic', attributes: ['nom'] },
        { model: Incidencia, attributes: ['id_incidencia'] },
      ],
      order: [['data_actuacio', 'DESC']],
    });

    res.render('actuacions/list', {
      title: "Llista d'actuacions",
      actuacions,
    });
  } catch (err) {
    console.error('Error carregant actuacions:', err);
    res.status(500).send('Error carregant les actuacions');
  }
});

// Formulari per crear una nova actuació
router.get('/create', async (req, res) => {
  try {
    const tecnics = await Tecnic.findAll();
    const incidencies = await Incidencia.findAll();
    res.render('actuacions/new', {
      title: 'Nova actuació',
      tecnics,
      incidencies,
    });
  } catch (err) {
    console.error('Error carregant el formulari de nova actuació:', err);
    res.status(500).send('Error carregant el formulari');
  }
});

// Guardar la nova actuació
router.post('/create', async (req, res) => {
  try {
    const {
      id_tecnic,
      finalitza_actuacio,
      data_actuacio,
      descripcio,
      id_incidencia,
      temps_invertit // <-- nuevo campo
    } = req.body;

    await Actuacio.create({
      id_tecnic: parseInt(id_tecnic),
      id_incidencia: parseInt(id_incidencia),
      descripcio,
      data_actuacio: new Date(data_actuacio),
      finalitza_actuacio: finalitza_actuacio === 'true',
      temps_invertit: parseInt(temps_invertit), // <-- nuevo campo
    });

    res.redirect('/actuacions');
  } catch (err) {
    console.error('Error guardant actuació:', err);
    res.status(500).send("Error guardant l'actuació");
  }
});


// Formulari per editar una actuació
router.get('/:id/edit', async (req, res) => {
  try {
    const id = req.params.id;
    const actuacio = await Actuacio.findByPk(id);
    if (!actuacio) {
      return res.status(404).send('Actuació no trobada');
    }

    const tecnics = await Tecnic.findAll();
    const incidencies = await Incidencia.findAll();

    res.render('actuacions/edit', {
      title: 'Editar actuació',
      actuacio,
      tecnics,
      incidencies,
    });
  } catch (err) {
    console.error('Error carregant el formulari d\'edició:', err);
    res.status(500).send('Error carregant el formulari d\'edició');
  }
});

// Actualitzar actuació
router.post('/:id/edit', async (req, res) => {
  try {
    const id = req.params.id;
    const {
      id_tecnic,
      finalitza_actuacio,
      data_actuacio,
      descripcio,
      id_incidencia,
      temps_invertit // <-- nuevo campo
    } = req.body;

    const actuacio = await Actuacio.findByPk(id);
    if (!actuacio) {
      return res.status(404).send('Actuació no trobada');
    }

    await actuacio.update({
      id_tecnic: parseInt(id_tecnic),
      id_incidencia: parseInt(id_incidencia),
      descripcio,
      data_actuacio: new Date(data_actuacio),
      finalitza_actuacio: finalitza_actuacio === 'true',
      temps_invertit: parseInt(temps_invertit), // <-- nuevo campo
    });

    res.redirect('/actuacions');
  } catch (err) {
    console.error('Error actualitzant actuació:', err);
    res.status(500).send("Error actualitzant l'actuació");
  }
});


// Eliminar actuació
router.get('/:id/delete', async (req, res) => {
  try {
    const id = req.params.id;
    const actuacio = await Actuacio.findByPk(id);
    if (!actuacio) {
      return res.status(404).send('Actuació no trobada');
    }

    await actuacio.destroy();

    res.redirect('/actuacions');
  } catch (err) {
    console.error('Error eliminant actuació:', err);
    res.status(500).send('Error eliminant l\'actuació');
  }
});

module.exports = router;
