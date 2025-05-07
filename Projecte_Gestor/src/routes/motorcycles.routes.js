const express = require('express');

const router = express.Router();

const Motorcycle = require('../models/Motorcycle');

const Category = require('../models/Category');



// CREATE

router.post('/', async (req, res) => {

    try {

        const { name, brand, cc, categoryId } = req.body;

        const moto = await Motorcycle.create({ name, brand, cc, categoryId });

        res.status(201).json(moto);

    } catch (error) {

        res.status(500).json({ error: 'No s’ha pogut crear la moto' });

    }

});



// READ: totes 

router.get('/', async (req, res) => {

    try {

        const motos = await Motorcycle.findAll({ include: Category });

        res.json(motos);

    }

    catch (error) {

        res.status(500).json({ error: 'Error al recuperar les motos' });

    }

});



// READ: una sola

router.get('/:id', async (req, res) => {

    try {

        const moto = await Motorcycle.findByPk(req.params.id, { include: Category });

        if (!moto) return res.status(404).json({ error: 'Moto no trobada' });

        res.json(moto);

    }

    catch (error) {

        res.status(500).json({ error: 'Error al recuperar la moto' });

    }

});



// UPDATE

router.put('/:id', async (req, res) => {

    try {

        const { name, brand, cc, categoryId } = req.body;

        const moto = await Motorcycle.findByPk(req.params.id);

        

        if (!moto) return res.status(404).json({ error: 'Moto no trobada' });

        

        moto.name = name;

        moto.brand = brand;

        moto.cc = cc;

        moto.categoryId = categoryId;

        await moto.save();



        res.json(moto);

    } catch (error) {

        res.status(500).json({ error: 'Error al fer update de la moto' });

    }

});



// DELETE



router.delete('/:id', async (req, res) => {

    try {

        const moto = await Motorcycle.findByPk(req.params.id);

        if (!moto) return res.status(404).json({ error: 'Moto no trobada' });

        await moto.destroy(); res.json({ message: 'Moto eliminada correctament' });

    }

    catch (error) {

        res.status(500).json({ error: 'Error al eliminar la moto' });

    }

});



module.exports = router;