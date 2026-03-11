const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    slug: {
        type: String,
        required: true,
        unique: true
    },
    price: {
        type: Number,
        required: true
    },
    oldPrice: {
        type: Number,
        default: null
    },
    categoryId: {
        type: Number,
        required: true
    },
    brandId: {
        type: Number,
        required: true
    },
    images: [{
        type: String
    }],
    badge: {
        type: String,
        enum: ['HOT', 'NEW', 'SALE', 'BEST SELLER', null],
        default: null
    },
    rating: {
        type: Number,
        default: 0,
        min: 0,
        max: 5
    },
    reviewCount: {
        type: Number,
        default: 0
    },
    stock: {
        type: Number,
        default: 0
    },
    featured: {
        type: Boolean,
        default: false
    },
    fastDelivery: {
        type: Boolean,
        default: false
    },
    description: {
        type: String,
        default: ''
    },
    specifications: {
        type: Map,
        of: String,
        default: {}
    },
    features: [{
        type: String
    }],
    tags: [{
        type: String
    }]
}, {
    timestamps: true
});

// Indexes
productSchema.index({ name: 'text', description: 'text' });
productSchema.index({ categoryId: 1 });
productSchema.index({ brandId: 1 });
productSchema.index({ featured: 1 });
productSchema.index({ fastDelivery: 1 });

module.exports = mongoose.model('Product', productSchema);
