const router = require('express').Router();
const { Category, Product } = require('../../models');

// The `/api/categories` endpoint

// Find all categories
router.get('/', async (req, res) => {
  try {
    const catData = await Category.findAll({
      include: {
        model: Product
      }
    })
    return res.status(200).json(catData);
  } catch (err) {
    return res.status(500).json(err);
  }
});

// Find one category by its `id` value
router.get('/:id', async (req, res) => {
  try {
    const catData = await Category.findByPk(req.params.id, {
      include: {
        model: Product
      }
    })
    return res.status(200).json(catData);
  } catch (err) {
    return res.status(500).json(err);
  }
});

// Create a new category
router.post('/', async (req, res) => {
  try {
    const catData = await Category.create(req.body);
    return res.status(200).json(catData)
  } catch (err) {
    return res.status(500).json(err)
  }
});

// Update a category by its `id` value
router.put('/:id', async (req, res) => {
  try {
    await Category.update(req.body, {
      where: {
        id: req.params.id
      }
    });
    return res.status(200).json(`Updated category at id ${req.params.id}`);
  } catch (err) {
    return res.status(500).json(err)
  }
});

// Delete a category by its `id` value
router.delete('/:id', async (req, res) => {
  try {
    await Category.destroy({ where: { id: req.params.id}});
    return res.status(200).json(`Deleted Category at id ${req.params.id}`)
  } catch (err) {
    return res.status(500).json(err)
  }
});

module.exports = router;
