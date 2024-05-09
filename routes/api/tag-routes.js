const router = require('express').Router();
const { Tag, Product, ProductTag } = require('../../models');

// The `/api/tags` endpoint

// Find all tags
router.get('/', async (req, res) => {
  try {
    const tagData = await Tag.findAll({
      include: {
        model: Product,
        through: ProductTag
      }
    })
    return res.status(200).json(tagData);
  } catch (err) {
    return res.status(500).json(err);
  }
});

// Find a single tag by its `id`
router.get('/:id', async (req, res) => {
  try {
    const tagData = await Tag.findByPk(req.params.id, {
      include: {
        model: Product,
        through: ProductTag
      }
    })
    return res.status(200).json(tagData);
  } catch (err) {
    return res.status(500).json(err);
  }
});

// Create a new tag
router.post('/', async (req, res) => {
  try {
    const tagData = await Tag.create(req.body);
    return res.status(200).json(tagData)
  } catch (err) {
    return res.status(500).json(err)
  }
});

// Update a tag's name by its `id` value
router.put('/:id', async (req, res) => {
  try {
    const tagData = await Tag.update(req.body, {
      where: {
        id: req.params.id
      }
    });
    return res.status(200).json(tagData);
  } catch (err) {
    return res.status(500).json(err)
  }
});

// Delete a tag by its `id` value
router.delete('/:id', async (req, res) => {
  try{
    await Tag.destroy({ where: { id: req.params.id }})
    return res.status(200).json(`Deleted tag at id ${req.params.id}`)
  } catch (err) {
    return res.status(500).json(err)
  }
});

module.exports = router;
