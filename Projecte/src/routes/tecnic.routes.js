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

// Mostrar formulari d'edició de tècnic
router.get('/:id/edit', async (req, res) => {
    try {
        const tecnic = await Tecnic.findByPk(req.params.id);
        if (!tecnic) return res.status(404).send('Tècnic no trobat');
        res.render('tecnic/edit', { title: 'Editar Tècnic', tecnic });
    } catch (error) {
        console.error('Error carregant tècnic:', error);
        res.status(500).send('Error carregant el formulari d’edició');
    }
});

// Actualitzar un tècnic
router.post('/:id/edit', async (req, res) => {
    try {
        const { nom } = req.body;
        await Tecnic.update({ nom }, { where: { id_tecnic: req.params.id } });
        res.redirect('/tecnic/list');
    } catch (error) {
        console.error('Error actualitzant tècnic:', error);
        res.status(500).send('Error actualitzant tècnic');
    }
});

router.post('/:id/delete', async (req, res) => {
    try {
        await Tecnic.destroy({ where: { id_tecnic: req.params.id } });
        res.redirect('/tecnic/list');
    } catch (error) {
        console.error('Error eliminant tècnic:', error);
        res.status(500).send('Error eliminant tècnic');
    }
});


module.exports = router;
