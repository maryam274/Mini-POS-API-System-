const express = require('express');
const router = express.Router();
const Invoice = require('../models/Invoice');
const Product = require('../models/Product');


//  Create a new invoice
router.post('/', async (req, res) => {
    const { userId, type, items } = req.body;
    try {
        let total = 0;
        for (const item of items) {
            const product = await Product.findById(item.productId);
            if (!product) return res.status(400).json({ error: 'Product not found' });
            if (type === 'sale' && product.stock < item.quantity) {
                return res.status(400).json({ error: 'Not enough stock' });
            }
            item.price = product.price;
            total += item.price * item.quantity;
        }

        const invoice = new Invoice({ userId, type, items, total });
        await invoice.save();

        for (const item of items) {
            const product = await Product.findById(item.productId);
            if (type === 'sale') {
                product.stock -= item.quantity; // Reduce stock
            } else if (type === 'purchase') {
                product.stock += item.quantity; // Increase stock
            }
            await product.save();
        }
console.log(req.body);

        res.status(201).json(invoice);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

//  Get all invoices
router.get('/', async (req, res) => {
    try {
        const invoices = await Invoice.find().populate('userId').populate('items.productId');
        res.json(invoices);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

module.exports = router;
