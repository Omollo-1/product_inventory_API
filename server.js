require('dotenv').config();

const express = require('express');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Temporary in-memory product data.
let products = [
    { id: 1, name: 'Laptop', price: 2500000, quantity: 5 },
    { id: 2, name: 'Mouse', price: 50000, quantity: 20 },
    { id: 3, name: 'Keyboard', price: 120000, quantity: 10 }
];

// GET all products
app.get('/products', (req, res) => {
    res.status(200).json(products);
});

// GET one product by ID
app.get('/products/:id', (req, res) => {
    const productId = Number(req.params.id);
    const product = products.find((item) => item.id === productId);

    if (!product) {
        return res.status(404).json({ error: 'Product not found' });
    }

    res.status(200).json(product);
});

// UPDATE a product by ID
app.put('/products/:id', (req, res) => {
    const productId = Number(req.params.id);
    const productIndex = products.findIndex((item) => item.id === productId);

    if (productIndex === -1) {
        return res.status(404).json({ error: 'Product not found' });
    }

    const { name, price, quantity } = req.body;

    if (name === undefined || price === undefined || quantity === undefined) {
        return res.status(400).json({
            error: 'Name, price and quantity are required'
        });
    }

    if (
        typeof name !== 'string' ||
        name.trim() === '' ||
        typeof price !== 'number' ||
        price < 0 ||
        !Number.isInteger(quantity) ||
        quantity < 0
    ) {
        return res.status(400).json({ error: 'Invalid product data' });
    }

    const updatedProduct = {
        id: productId,
        name: name.trim(),
        price,
        quantity
    };

    products[productIndex] = updatedProduct;
    res.status(200).json(updatedProduct);
});

// DELETE a product by ID
app.delete('/products/:id', (req, res) => {
    const productId = Number(req.params.id);
    const productIndex = products.findIndex((item) => item.id === productId);

    if (productIndex === -1) {
        return res.status(404).json({ error: 'Product not found' });
    }

    const deletedProduct = products.splice(productIndex, 1)[0];
    res.status(200).json({
        message: 'Product deleted successfully',
        product: deletedProduct
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
