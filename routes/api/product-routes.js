const router = require('express').Router();
const { Product, Category, Tag, ProductTag } = require('../../models');

// The `/api/products` endpoint

// Find all products
router.get('/', async (req, res) => {
  try {
    const productData = await Product.findAll({
      include: [Category, Tag]
    })
    return res.status(200).json(productData);
  } catch (err) {
    return res.status(500).json(err);
  }
});

// Find a single product by its `id`
router.get('/:id', async (req, res) => {
  try {
    const productData = await Product.findByPk(req.params.id, {
      include: [Category, Tag]
    })
    return res.status(200).json(productData);
  } catch (err) {
    return res.status(500).json(err);
  }
});

// Create new product
router.post('/', async (req, res) => {
  try{
    const newProduct = {
      product_name: req.body.product_name,
      price: req.body.price,
      stock: req.body.stock,
      tagIds: req.body.tagIds
    }
    const madeProduct = await Product.create(newProduct)

    // If no tags, end here and send response
    if (!req.body.tagIds.length) {
      return res.status(200).json(madeProduct);
    }
    // If tags, pull tag array, create two way associations via ProductTag, and send product and array of those associations as response
    const productTagIdArr = req.body.tagIds.map((tag_id) => {
      return {
        product_id: madeProduct.id,
        tag_id,
      };
    });
    const productTagIds = await ProductTag.bulkCreate(productTagIdArr);
    const tagResults = [madeProduct, ...productTagIds]
    return res.status(200).json(tagResults)
  } catch (err) {
      console.log(err);
      return res.status(500).json(err);
    }
});

// Update product
router.put('/:id', async (req, res) => {
  try{
    const product = await Product.update(req.body, {
      where: {
        id: req.params.id,
      },
    })
    if (req.body.tagIds && req.body.tagIds.length) {
      const productTags = await ProductTag.findAll({
        where: { product_id: req.params.id }
      })
      // create filtered list of new tag_ids
      const productTagIds = productTags.map(({ tag_id }) => tag_id);
      const newProductTags = req.body.tagIds
      .filter((tag_id) => !productTagIds.includes(tag_id))
      .map((tag_id) => {
        return {
          product_id: req.params.id,
          tag_id,
        };
      });
      
      // figure out which ones to remove
      const productTagsToRemove = productTags
      .filter(({ tag_id }) => !req.body.tagIds.includes(tag_id))
      .map(({ id }) => id);
      // run both actions
      await ProductTag.destroy({ where: { id: productTagsToRemove } })
      await ProductTag.bulkCreate(newProductTags)
    }
    return res.json(product);
  } catch(err) {
      // console.log(err);
      res.status(500).json(err);
  }
});

// Delete one product by its `id` value
router.delete('/:id', async (req, res) => {
  try {
    await Product.destroy({ where: { id:req.params.id }})
    return res.status(200).json(`Deleted product at id ${req.params.id}`)
  } catch (err) {
    return res.status(500).json(err)
  }
});

module.exports = router;
