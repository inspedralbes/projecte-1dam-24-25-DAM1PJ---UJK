const express = require('express');

const router = express.Router();

const Category = require('../models/Category');



// CREATE

router.post('/', async (req, res) => {

  try {

    const { name } = req.body;

    const category = await Category.create({ name });

    res.status(201).json(category);

  } catch (error) {

    res.status(500).json({ error: 'Error en crear la categoria' });

  }

});



// READ: totes

router.get('/', async (req, res) => {

  try {

    const categories = await Category.findAll();

    res.json(categories);

  } catch (error) {

    res.status(500).json({ error: 'Error al recuperar categories' });

  }

});



// READ: una sola

router.get('/:id', async (req, res) => {

  try {

    const category = await Category.findByPk(req.params.id);

    if (!category) return res.status(404).json({ error: 'Categoria no trobada' });

    res.json(category);

  } catch (error) {

    res.status(500).json({ error: 'Error al recuperar la categoria' });

  }

});



// UPDATE

router.put('/:id', async (req, res) => {

  try {

    const { name } = req.body;

    const category = await Category.findByPk(req.params.id);

    if (!category) return res.status(404).json({ error: 'Categoria no trobada' });

    category.name = name;

    await category.save();

    res.json(category);

  } catch (error) {

    res.status(500).json({ error: 'Error al fer update de la categoria' });

  }

});



// DELETE

router.delete('/:id', async (req, res) => {

  try {

    const category = await Category.findByPk(req.params.id);

    if (!category) return res.status(404).json({ error: 'Categoria no trobada' });

    await category.destroy();

    res.json({ message: 'Categoria eliminada correctament' });

  } catch (error) {

    res.status(500).json({ error: 'Error al eliminar la categoria' });

  }

});



module.exports = router;