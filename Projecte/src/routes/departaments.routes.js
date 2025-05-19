const express = require('express');
const router = express.Router();
const Departament = require('../models/Departament');

// Mostrar formulari per crear un nou departament
router.get('/new', (req, res) => {
    res.render('departament/new', { title: 'Crear Departament' });
});

// Crear un nou departament
router.post('/new', async (req, res) => {
    try {
        const { nom } = req.body;
        await Departament.create({ nom });
        res.redirect('/departament');
    } catch (error) {
        console.error('Error creant departament:', error);
        res.status(500).send('Error creant departament');
    }
});

// Llistar tots els departaments
router.get('/', async (req, res) => {
  try {
    const departaments = await Departament.findAll();
    res.render('departament/list', { title: 'Llista de Departaments', departaments });
  } catch (error) {
    res.status(500).send('Error al carregar els departaments');
  }
});
module.exports = router;
