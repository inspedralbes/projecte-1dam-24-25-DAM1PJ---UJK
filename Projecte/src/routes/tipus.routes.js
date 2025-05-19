const express = require('express');
const router = express.Router();
const Tipus = require('../models/Tipus');

// Mostrar formulari per crear un nou tipus
router.get('/new', (req, res) => {
    res.render('tipus/new', { title: 'Crear Tipus' });
});

// Crear un nou tipus
router.post('/new', async (req, res) => {
    try {
        const { nom } = req.body;
        await Tipus.create({ nom });
        res.redirect('/tipus/list');
    } catch (error) {
        console.error('Error creant tipus:', error);
        res.status(500).send('Error creant tipus');
    }
});

// Llistar tots els tipus
router.get('/list', async (req, res) => {
    try {
        const tipus = await Tipus.findAll();
        res.render('tipus/list', { title: 'Llista de Tipus', tipus });
    } catch (error) {
        console.error('Error carregant tipus:', error);
        res.status(500).send('Error al carregar els tipus');
    }
});

module.exports = router;
