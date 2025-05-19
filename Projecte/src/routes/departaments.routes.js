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

// Mostrar formulari per editar un departament
router.get('/:id/edit', async (req, res) => {
    try {
        const departament = await Departament.findByPk(req.params.id);
        if (!departament) return res.status(404).send('Departament no trobat');
        res.render('departament/edit', { title: 'Editar Departament', departament });
    } catch (error) {
        console.error('Error carregant departament:', error);
        res.status(500).send('Error carregant el formulari d’edició');
    }
});

// Actualitzar un departament
router.post('/:id/edit', async (req, res) => {
    try {
        const { nom } = req.body;
        await Departament.update({ nom }, { where: { id_departament: req.params.id } });
        res.redirect('/departament');
    } catch (error) {
        console.error('Error actualitzant departament:', error);
        res.status(500).send('Error actualitzant departament');
    }
});

// Eliminar un departament
router.post('/:id/delete', async (req, res) => {
    try {
        await Departament.destroy({ where: { id_departament: req.params.id } });
        res.redirect('/departament');
    } catch (error) {
        console.error('Error eliminant departament:', error);
        res.status(500).send('Error eliminant departament');
    }
});

module.exports = router;

