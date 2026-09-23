const express = require('express');
const { body, param } = require('express-validator');
const Product = require('../models/Product');
const authenticate = require('../middleware/auth');
const validate = require('../middleware/validate');

const router = express.Router();

router.post(
  '/',
  authenticate,
  [
    body('name').trim().notEmpty().withMessage('Product name is required'),
    body('price')
      .isFloat({ min: 0 })
      .withMessage('Price must be a number greater than or equal to 0'),
    body('stock')
      .isInt({ min: 0 })
      .withMessage('Stock must be an integer greater than or equal to 0'),
    body('description').optional().trim()
  ],
  validate,
  async (req, res) => {
    try {
      const { name, description, price, stock } = req.body;
      const product = new Product({
        name,
        description,
        price,
        stock
      });
      await product.save();
      return res.status(201).json(product);
    } catch (err) {
      return res.status(500).json({ message: 'Internal server error' });
    }
  }
);

router.get('/', async (req, res) => {
  try {
    const products = await Product.find().sort({ _id: -1 });
    return res.json(products);
  } catch (err) {
    return res.status(500).json({ message: 'Internal server error' });
  }
});

router.get(
  '/:id',
  [param('id').isMongoId().withMessage('Invalid product ID format')],
  validate,
  async (req, res) => {
    try {
      const product = await Product.findById(req.params.id);
      if (!product) {
        return res.status(404).json({ message: 'Product not found' });
      }
      return res.json(product);
    } catch (err) {
      return res.status(500).json({ message: 'Internal server error' });
    }
  }
);

router.put(
  '/:id',
  authenticate,
  [
    param('id').isMongoId().withMessage('Invalid product ID format'),
    body('name').trim().notEmpty().withMessage('Product name is required'),
    body('price')
      .isFloat({ min: 0 })
      .withMessage('Price must be a number greater than or equal to 0'),
    body('stock')
      .isInt({ min: 0 })
      .withMessage('Stock must be an integer greater than or equal to 0'),
    body('description').optional().trim()
  ],
  validate,
  async (req, res) => {
    try {
      const existingProduct = await Product.findById(req.params.id);
      if (!existingProduct) {
        return res.status(404).json({ message: 'Product not found' });
      }

      const { name, description, price, stock } = req.body;
      existingProduct.name = name;
      existingProduct.description = description;
      existingProduct.price = price;
      existingProduct.stock = stock;

      const updatedProduct = await existingProduct.save();
      return res.json(updatedProduct);
    } catch (err) {
      return res.status(500).json({ message: 'Internal server error' });
    }
  }
);

router.delete(
  '/:id',
  authenticate,
  [param('id').isMongoId().withMessage('Invalid product ID format')],
  validate,
  async (req, res) => {
    try {
      const existingProduct = await Product.findById(req.params.id);
      if (!existingProduct) {
        return res.status(404).json({ message: 'Product not found' });
      }

      await Product.findByIdAndDelete(req.params.id);
      return res.json({ message: 'Product deleted successfully' });
    } catch (err) {
      return res.status(500).json({ message: 'Internal server error' });
    }
  }
);

module.exports = router;
