const express = require('express');
const router = express.Router();

// Simple order endpoint (since you're using Messenger/Facebook for orders)
// This is just for logging/tracking purposes

const orders = []; // In-memory storage (use MongoDB in production)

// POST create order
router.post('/', async (req, res) => {
    try {
        const { customerName, customerPhone, items, total, notes } = req.body;

        const order = {
            id: Date.now(),
            customerName,
            customerPhone,
            items,
            total,
            notes,
            status: 'pending',
            createdAt: new Date()
        };

        orders.push(order);

        res.status(201).json({
            success: true,
            message: 'Order received! We will contact you soon.',
            data: order
        });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
});

// GET all orders (Admin only)
router.get('/', async (req, res) => {
    try {
        res.json({
            success: true,
            data: orders.sort((a, b) => b.createdAt - a.createdAt)
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

module.exports = router;
