const express = require('express');
const router = express.Router();
const Incidencia = require('../models/Incidencia');

// Llistar incidències (GET)
router.get('/', async (req, res) => {
    try {
        const incidencies = await Incidencia.findAll();
        res.render('incidencies/list', { incidencies });
    } catch (error) {
        res.status(500).send('Error al recuperar incidències');
    }
});

// Formulari per crear una incidència (GET)
router.get('/new', async (req, res) => {
    try {
        // Aquí podrías carregar usuaris i tipus si fas relacions en el futur
        res.render('incidencies/new');
    } catch (error) {
        res.status(500).send('Error al carregar el formulari');
    }
});

// Crear incidència (POST)
router.post('/create', async (req, res) => {
    try {
        const {
            id_usuari,
            id_tipus,
            descripcio,
            datetime_creada,
            ubicacio,
            estat,
            prioritat
        } = req.body;

        await Incidencia.create({
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
        res.status(500).send('Error al crear la incidència');
    }
});

// Formulari per editar una incidència (GET)
router.get('/:id/edit', async (req, res) => {
    try {
        const incidencia = await Incidencia.findByPk(req.params.id);
        if (!incidencia) return res.status(404).send('Incidència no trobada');

        res.render('incidencies/edit', { incidencia });
    } catch (error) {
        res.status(500).send('Error al carregar el formulari d’edició');
    }
});

// Actualitzar incidència (POST)
router.post('/:id/update', async (req, res) => {
    try {
        const {
            id_usuari,
            id_tipus,
            descripcio,
            datetime_creada,
            ubicacio,
            estat,
            prioritat
        } = req.body;

        const incidencia = await Incidencia.findByPk(req.params.id);
        if (!incidencia) return res.status(404).send('Incidència no trobada');

        incidencia.id_usuari = id_usuari;
        incidencia.id_tipus = id_tipus;
        incidencia.descripcio = descripcio;
        incidencia.datetime_creada = datetime_creada;
        incidencia.ubicacio = ubicacio;
        incidencia.estat = estat;
        incidencia.prioritat = prioritat;

        await incidencia.save();

        res.redirect('/incidencies');
    } catch (error) {
        res.status(500).send('Error al actualitzar la incidència');
    }
});

// Eliminar incidència (GET, per simplicitat)
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
