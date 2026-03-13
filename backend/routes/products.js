const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const { authMiddleware } = require('../middleware/auth');

// GET all products
router.get('/', async (req, res) => {
    try {
        const { 
            category, 
            brand, 
            featured, 
            fastDelivery,
            search,
            minPrice,
            maxPrice,
            badge,  // Add badge filter
            sort = '-createdAt',
            page = 1,
            limit = req.query.limit || 0  // 0 means no limit
        } = req.query;

        const query = {};

        if (category) query.categoryId = parseInt(category);
        if (brand) query.brandId = parseInt(brand);
        if (featured) query.featured = featured === 'true';
        if (fastDelivery) query.fastDelivery = fastDelivery === 'true';
        if (search) query.$text = { $search: search };
        if (badge) {
            // Support multiple badges separated by comma
            const badges = badge.split(',').map(b => b.trim());
            query.badge = { $in: badges };
        }
        if (minPrice || maxPrice) {
            query.price = {};
            if (minPrice) query.price.$gte = parseInt(minPrice);
            if (maxPrice) query.price.$lte = parseInt(maxPrice);
        }

        let query_builder = Product.find(query).sort(sort);
        
        // Only apply limit and skip if limit is specified and > 0
        if (parseInt(limit) > 0) {
            query_builder = query_builder
                .limit(parseInt(limit))
                .skip((parseInt(page) - 1) * parseInt(limit));
        }
        
        const products = await query_builder;

        const total = await Product.countDocuments(query);

        res.json({
            success: true,
            data: products,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit) || 0,
                total,
                pages: parseInt(limit) > 0 ? Math.ceil(total / parseInt(limit)) : 1
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// GET single product
router.get('/:id', async (req, res) => {
    try {
        // Validate MongoDB ObjectId format
        if (!req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(400).json({ 
                success: false, 
                message: 'Invalid product ID format' 
            });
        }

        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ 
                success: false, 
                message: 'Product not found' 
            });
        }
        res.json({ success: true, data: product });
    } catch (error) {
        console.error('Error fetching product:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Error fetching product: ' + error.message 
        });
    }
});

// POST create product (Admin only)
router.post('/', authMiddleware, async (req, res) => {
    try {
        const product = new Product(req.body);
        await product.save();
        res.status(201).json({ success: true, data: product });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
});

// PUT update product (Admin only)
router.put('/:id', authMiddleware, async (req, res) => {
    try {
        const product = await Product.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );
        if (!product) {
            return res.status(404).json({ success: false, message: 'Product not found' });
        }
        res.json({ success: true, data: product });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
});

// DELETE product (Admin only)
router.delete('/:id', authMiddleware, async (req, res) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id);
        if (!product) {
            return res.status(404).json({ success: false, message: 'Product not found' });
        }
        res.json({ success: true, message: 'Product deleted successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

module.exports = router;
