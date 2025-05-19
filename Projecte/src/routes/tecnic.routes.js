const express = require('express');
const router = express.Router();
const Tecnic = require('../models/Tecnic');

// Mostrar formulari per crear un nou tècnic
router.get('/new', (req, res) => {
    res.render('tecnic/new', { title: 'Crear Tècnic' });
});

// Crear un nou tècnic
router.post('/new', async (req, res) => {
    try {
        const { nom } = req.body;
        await Tecnic.create({ nom });
        res.redirect('/tecnic/list');
    } catch (error) {
        console.error('Error creant tècnic:', error);
        res.status(500).send('Error creant tècnic');
    }
});

// Llistar tots els tècnics
router.get('/list', async (req, res) => {
    try {
        const tecnics = await Tecnic.findAll();
        res.render('tecnic/list', { title: 'Llista de Tècnics', tecnics });
    } catch (error) {
        console.error('Error carregant tècnics:', error);
        res.status(500).send('Error al carregar els tècnics');
    }
});

module.exports = router;
