const express = require('express');
const router = express.Router();
const Tecnic = require('../models/Tecnic');
const Incidencia = require('../models/Incidencia');
const Actuacio = require('../models/Actuacio');

// Llistat d'actuacions
router.get('/', async (req, res) => {
  try {
    const actuacions = await Actuacio.findAll({
      include: {
        model: Tecnic,
        attributes: ['nom'],
      },
      order: [['data_actuacio', 'DESC']],
    });

    res.render('actuacions/list', { actuacions });
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
    res.render('actuacions/new', { tecnics, incidencies });
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
    } = req.body;

    await Actuacio.create({
      id_tecnic: parseInt(id_tecnic),
      id_incidencia: parseInt(id_incidencia),
      descripcio,
      data_actuacio: new Date(data_actuacio),
      finalitza_actuacio: finalitza_actuacio === 'true',
      id_usuari: 1, // Opcional: si tens un usuari fix o de sessió. Substitueix per req.session.userId si tens auth.
    });

    res.redirect('/actuacions');
  } catch (err) {
    console.error('Error guardant actuació:', err);
    res.status(500).send("Error guardant l'actuació");
  }
});

module.exports = router;
