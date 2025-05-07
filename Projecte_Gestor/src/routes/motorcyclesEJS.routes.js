const express = require('express');
const router = express.Router();
const Motorcycle = require('../models/Motorcycle');
const Category = require('../models/Category');
// Llistar motos (GET) 
router.get('/', async (req, res) => {
    try {
        const motorcycles = await Motorcycle.findAll({ include: Category });
        res.render('motorcycles/list', { motorcycles });
    }
    catch (error) {
        res.status(500).send('Error al recuperar motos');
    }
});

// Form per crear una moto (GET)
router.get('/new', async (req, res) => {
    try {
        const categories = await Category.findAll(); res.render('motorcycles/new', { categories });
    }
    catch (error) {
        res.status(500).send('Error al carregar el formulari');
    }
});

// Crear moto (POST)
router.post('/create', async (req, res) => {
    try {
        const { name, brand, cc, categoryId } = req.body;
        await Motorcycle.create({ name, brand, cc, categoryId });
        res.redirect('/motorcycles'); // Torna al llistat 
    }
    catch (error) { res.status(500).send('Error al crear la moto'); }
});

// Form per editar una moto (GET)
router.get('/:id/edit', async (req, res) => {
    try {
        const moto = await Motorcycle.findByPk(req.params.id);
        if (!moto) return res.status(404).send('Moto no trobada');

        const categories = await Category.findAll();
        res.render('motorcycles/edit', { moto, categories });
    } catch (error) {
        res.status(500).send('Error al carregar el formulari d’edició');
    }

});

// Actualitzar moto (POST)

router.post('/:id/update', async (req, res) => {
    try {
        const { name, brand, cc, categoryId } = req.body;
        const moto = await Motorcycle.findByPk(req.params.id);
        if (!moto) return res.status(404).send('Moto no trobada');
        moto.name = name;
        moto.brand = brand;
        moto.cc = cc;
        moto.categoryId = categoryId;
        await moto.save();

        res.redirect('/motorcycles');
    } catch (error) {
        res.status(500).send('Error al actualitzar la moto');
    }

});

// Eliminar moto (GET, per simplicitat)

router.get('/:id/delete', async (req, res) => {
    try {
        const moto = await Motorcycle.findByPk(req.params.id);
        if (!moto) return res.status(404).send('Moto no trobada');
        await moto.destroy(); res.redirect('/motorcycles');
    }
    catch (error) {
        res.status(500).send('Error al eliminar la moto');
    }
});

module.exports = router;

