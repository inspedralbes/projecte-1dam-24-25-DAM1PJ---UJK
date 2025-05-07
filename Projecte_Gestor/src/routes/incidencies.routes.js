const express = require('express');
const router = express.Router();

const Incidencia = require('../models/Incidencia');

// CREATE
router.post('/', async (req, res) => {
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

        const incidencia = await Incidencia.create({
            id_usuari,
            id_tipus,
            descripcio,
            datetime_creada,
            ubicacio,
            estat,
            prioritat
        });

        res.status(201).json(incidencia);
    } catch (error) {
        res.status(500).json({ error: 'No s’ha pogut crear la incidència' });
    }
});

// READ: totes
router.get('/', async (req, res) => {
    try {
        const incidencies = await Incidencia.findAll();
        res.json(incidencies);
    } catch (error) {
        res.status(500).json({ error: 'Error al recuperar les incidències' });
    }
});

// READ: una sola
router.get('/:id', async (req, res) => {
    try {
        const incidencia = await Incidencia.findByPk(req.params.id);
        if (!incidencia) return res.status(404).json({ error: 'Incidència no trobada' });
        res.json(incidencia);
    } catch (error) {
        res.status(500).json({ error: 'Error al recuperar la incidència' });
    }
});

// UPDATE
router.put('/:id', async (req, res) => {
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
        if (!incidencia) return res.status(404).json({ error: 'Incidència no trobada' });

        incidencia.id_usuari = id_usuari;
        incidencia.id_tipus = id_tipus;
        incidencia.descripcio = descripcio;
        incidencia.datetime_creada = datetime_creada;
        incidencia.ubicacio = ubicacio;
        incidencia.estat = estat;
        incidencia.prioritat = prioritat;

        await incidencia.save();

        res.json(incidencia);
    } catch (error) {
        res.status(500).json({ error: 'Error al fer update de la incidència' });
    }
});

// DELETE
router.delete('/:id', async (req, res) => {
    try {
        const incidencia = await Incidencia.findByPk(req.params.id);
        if (!incidencia) return res.status(404).json({ error: 'Incidència no trobada' });

        await incidencia.destroy();
        res.json({ message: 'Incidència eliminada correctament' });
    } catch (error) {
        res.status(500).json({ error: 'Error al eliminar la incidència' });
    }
});

module.exports = router;
