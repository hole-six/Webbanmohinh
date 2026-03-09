const express = require('express');
const router = express.Router();
const Category = require('../models/Category');
const { authMiddleware } = require('../middleware/auth');

// GET all categories
router.get('/', async (req, res) => {
    try {
        const categories = await Category.find().sort({ id: 1 });
        res.json({ success: true, data: categories });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// GET single category
router.get('/:id', async (req, res) => {
    try {
        const category = await Category.findOne({ id: parseInt(req.params.id) });
        if (!category) {
            return res.status(404).json({ success: false, message: 'Category not found' });
        }
        res.json({ success: true, data: category });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// POST create category (Admin only)
router.post('/', authMiddleware, async (req, res) => {
    try {
        const category = new Category(req.body);
        await category.save();
        res.status(201).json({ success: true, data: category });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
});

// PUT update category (Admin only)
router.put('/:id', authMiddleware, async (req, res) => {
    try {
        const category = await Category.findOneAndUpdate(
            { id: parseInt(req.params.id) },
            req.body,
            { new: true, runValidators: true }
        );
        if (!category) {
            return res.status(404).json({ success: false, message: 'Category not found' });
        }
        res.json({ success: true, data: category });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
});

// DELETE category (Admin only)
router.delete('/:id', authMiddleware, async (req, res) => {
    try {
        const category = await Category.findOneAndDelete({ id: parseInt(req.params.id) });
        if (!category) {
            return res.status(404).json({ success: false, message: 'Category not found' });
        }
        res.json({ success: true, message: 'Category deleted successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

module.exports = router;
