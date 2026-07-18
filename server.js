require('dotenv').config();

const express = require('express');

const app = express();
const PORT = process.env.PORT || 3000;



// Temporary in-memory product data.
let products = [
    { id: 1, name: 'Laptop', price: 2500000, quantity: 5 },
    { id: 2, name: 'Mouse', price: 50000, quantity: 20 },
    { id: 3, name: 'Keyboard', price: 120000, quantity: 10 }
];



// GET one product by ID
app.get('/products/:id', (req, res) => {
    const productId = Number(req.params.id);
    const product = products.find((item) => item.id === productId);

    if (!product) {
        return res.status(404).json({ error: 'Product not found' });
    }

    res.status(200).json(product);
});

const cors = require('cors');
const morgan = require('morgan');

// App middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));



let nextId = 4; // simple auto-increment id for new products

//routes
app.get('/', (req, res) => {
  res.json({
    endpoints: {
      health: 'GET /health',
      listProducts: 'GET /products',
      createProduct: 'POST /products',
    },
  });
});

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', uptime: process.uptime() });
});

// GET /products - list all products currently in memory
app.get('/products', (req, res) => {
  res.status(200).json({ count: products.length, products });
});

// POST /products 
app.post('/products', (req, res) => {
  const { name, price, quantity, category } = req.body;

  // Basic validation
  if (!name || typeof name !== 'string') {
    return res.status(400).json({ error: 'Product "name" is required and must be a string.' });
  }
  if (price === undefined || typeof price !== 'number' || price < 0) {
    return res.status(400).json({ error: 'Product "price" is required and must be a non-negative number.' });
  }
  if (quantity === undefined || typeof quantity !== 'number' || quantity < 0) {
    return res.status(400).json({ error: 'Product "quantity" is required and must be a non-negative number.' });
  }

  const newProduct = {
    id: nextId++,
    name,
    price,
    quantity,
    category: category || 'Uncategorized',
    createdAt: new Date().toISOString(),
  };

  products.push(newProduct);

  res.status(201).json({ message: 'Product created successfully.', product: newProduct });
});

// PUT /products/:id - Update a product
app.put('/products/:id', (req, res) => {
  const productId = Number(req.params.id);
  const product = products.find(item => item.id === productId);

  if (!product) {
    return res.status(404).json({
      error: 'Product not found'
    });
  }

  const { name, price, quantity, category } = req.body;

  if (name !== undefined) product.name = name;
  if (price !== undefined) product.price = price;
  if (quantity !== undefined) product.quantity = quantity;
  if (category !== undefined) product.category = category;

  res.status(200).json({
    message: 'Product updated successfully',
    product
  });
});

// DELETE /products/:id - Delete a product
app.delete('/products/:id', (req, res) => {
  const productId = Number(req.params.id);

  const index = products.findIndex(item => item.id === productId);

  if (index === -1) {
    return res.status(404).json({
      error: 'Product not found'
    });
  }

  const deletedProduct = products.splice(index, 1);

  res.status(200).json({
    message: 'Product deleted successfully',
    product: deletedProduct[0]
  });
});
// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Not Found' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({ error: err.message || 'Internal Server Error' });
});

// Start server

module.exports = app;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
