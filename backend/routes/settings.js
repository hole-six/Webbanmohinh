const express = require('express');
const router = express.Router();
const SiteSettings = require('../models/SiteSettings');
const { authMiddleware: auth } = require('../middleware/auth');

// GET /api/settings/:key
router.get('/:key', async (req, res) => {
    try {
        const setting = await SiteSettings.findOne({ key: req.params.key });
        res.json({ success: true, data: setting ? setting.value : null });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// PUT /api/settings/:key  (admin only)
router.put('/:key', auth, async (req, res) => {
    try {
        const setting = await SiteSettings.findOneAndUpdate(
            { key: req.params.key },
            { value: req.body.value },
            { upsert: true, new: true }
        );
        res.json({ success: true, data: setting.value });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

module.exports = router;
