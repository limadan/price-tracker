import express from 'express';
import { json } from 'body-parser';
import sequelize from './config/database';
import cors from 'cors';
import { Product, Store, ProductUrl, PriceHistory } from './models';

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(json());
app.use(cors());

// Product Routes
app.post('/api/products', async (req, res) => {
  try {
    const product = await Product.create(req.body);
    res.status(201).json(product);
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
});

app.get('/api/products', async (req, res) => {
  try {
    const products = await Product.findAll();
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

app.get('/api/products/:id', async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

app.put('/api/products/:id', async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    await product.update(req.body);
    res.json(product);
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
});

app.delete('/api/products/:id', async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    await product.destroy();
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

// Store Routes
app.post('/api/stores', async (req, res) => {
  try {
    const store = await Store.create(req.body);
    res.status(201).json(store);
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
});

app.get('/api/stores', async (req, res) => {
  try {
    const stores = await Store.findAll();
    res.json(stores);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

// ProductUrl Routes
app.post('/api/product-urls', async (req, res) => {
  try {
    const productUrl = await ProductUrl.create(req.body);
    res.status(201).json(productUrl);
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
});

app.get('/api/product-urls', async (req, res) => {
  try {
    const productUrls = await ProductUrl.findAll({
      include: [
        { model: Product, as: 'product' },
        { model: Store, as: 'store' },
        { model: PriceHistory, as: 'priceHistories' },
      ],
    });
    res.json(productUrls);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

// PriceHistory Routes
app.post('/api/price-history', async (req, res) => {
  try {
    const priceHistory = await PriceHistory.create(req.body);
    res.status(201).json(priceHistory);
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
});

app.get('/api/price-history', async (req, res) => {
  try {
    const priceHistories = await PriceHistory.findAll({
      include: [{ model: ProductUrl, as: 'productUrl' }],
    });
    res.json(priceHistories);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

// Initialize database and start server
sequelize.sync().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
});
