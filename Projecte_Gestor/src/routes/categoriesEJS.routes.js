const express = require('express');
const router = express.Router();
const Category = require('../models/Category');

// Llistar categories
router.get('/', async (req, res) => {
  try {
    const categories = await Category.findAll();
    res.render('categories/list', { categories });
  } catch (error) {
    res.status(500).send('Error al recuperar categories');
  }
});

// Form nova categoria
router.get('/new', (req, res) => {
  res.render('categories/new');
});

// Crear categoria
router.post('/create', async (req, res) => {
  try {
    const { name } = req.body;
    await Category.create({ name });
    res.redirect('/categories');
  } catch (error) {
    res.status(500).send('Error al crear categoria');
  }
});

// Form edició categoria
router.get('/:id/edit', async (req, res) => {
  try {
    const category = await Category.findByPk(req.params.id);
    if (!category) return res.status(404).send('Categoria no trobada');
    res.render('categories/edit', { category });
  } catch (error) {
    res.status(500).send('Error al carregar formulari d’edició');
  }
});

// Actualitzar categoria
router.post('/:id/update', async (req, res) => {
  try {
    const { name } = req.body;
    const category = await Category.findByPk(req.params.id);
    if (!category) return res.status(404).send('Categoria no trobada');
    category.name = name;
    await category.save();
    res.redirect('/categories');
  } catch (error) {
    res.status(500).send('Error al actualitzar la categoria');
  }
});

// Eliminar categoria
router.get('/:id/delete', async (req, res) => {
  try {
    const category = await Category.findByPk(req.params.id);
    if (!category) return res.status(404).send('Categoria no trobada');
    await category.destroy();
    res.redirect('/categories');
  } catch (error) {
    res.status(500).send('Error al eliminar la categoria');
  }
});

module.exports = router;