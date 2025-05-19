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

// Formulari per editar un tipus existent
router.get('/:id/edit', async (req, res) => {
    try {
        const tipus = await Tipus.findByPk(req.params.id);
        if (!tipus) return res.status(404).send('Tipus no trobat');
        res.render('tipus/edit', { title: 'Editar Tipus', tipus });
    } catch (error) {
        console.error('Error carregant tipus per editar:', error);
        res.status(500).send('Error carregant tipus');
    }
});

// Actualitzar un tipus existent
router.post('/:id/edit', async (req, res) => {
    try {
        const { nom } = req.body;
        await Tipus.update({ nom }, { where: { id_tipus: req.params.id } });
        res.redirect('/tipus/list');
    } catch (error) {
        console.error('Error actualitzant tipus:', error);
        res.status(500).send('Error actualitzant tipus');
    }
});

// Eliminar un tipus
router.post('/:id/delete', async (req, res) => {
    try {
        await Tipus.destroy({ where: { id_tipus: req.params.id } });
        res.redirect('/tipus/list');
    } catch (error) {
        console.error('Error eliminant tipus:', error);
        res.status(500).send('Error eliminant tipus');
    }
});

module.exports = router;
