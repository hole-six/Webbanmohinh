const express = require('express');
const router = express.Router();
const Brand = require('../models/Brand');
const { authMiddleware } = require('../middleware/auth');

// GET all brands
router.get('/', async (req, res) => {
    try {
        const brands = await Brand.find().sort({ id: 1 });
        res.json({ success: true, data: brands });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// GET single brand
router.get('/:id', async (req, res) => {
    try {
        const brand = await Brand.findOne({ id: parseInt(req.params.id) });
        if (!brand) {
            return res.status(404).json({ success: false, message: 'Brand not found' });
        }
        res.json({ success: true, data: brand });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// POST create brand (Admin only)
router.post('/', authMiddleware, async (req, res) => {
    try {
        const brand = new Brand(req.body);
        await brand.save();
        res.status(201).json({ success: true, data: brand });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
});

// PUT update brand (Admin only)
router.put('/:id', authMiddleware, async (req, res) => {
    try {
        const brand = await Brand.findOneAndUpdate(
            { id: parseInt(req.params.id) },
            req.body,
            { new: true, runValidators: true }
        );
        if (!brand) {
            return res.status(404).json({ success: false, message: 'Brand not found' });
        }
        res.json({ success: true, data: brand });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
});

// DELETE brand (Admin only)
router.delete('/:id', authMiddleware, async (req, res) => {
    try {
        const brand = await Brand.findOneAndDelete({ id: parseInt(req.params.id) });
        if (!brand) {
            return res.status(404).json({ success: false, message: 'Brand not found' });
        }
        res.json({ success: true, message: 'Brand deleted successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

module.exports = router;
