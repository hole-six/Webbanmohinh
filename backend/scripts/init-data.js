const mongoose = require('mongoose');
require('dotenv').config();

const Product = require('../models/Product');
const Category = require('../models/Category');
const Brand = require('../models/Brand');
const Admin = require('../models/Admin');

// Sample data
const categories = [
    { id: 1, name: 'Transformers', slug: 'transformers', icon: '🤖', image: 'https://images.unsplash.com/photo-1589254065878-42c9da997008?w=800', description: 'Mô hình Transformers chính hãng' },
    { id: 2, name: 'Marvel', slug: 'marvel', icon: '🦸', image: 'https://images.unsplash.com/photo-1635863138275-d9b33299680b?w=800', description: 'Siêu anh hùng Marvel' },
    { id: 3, name: 'DC Comics', slug: 'dc-comics', icon: '🦇', image: 'https://images.unsplash.com/photo-1612036782180-6f0b6cd846fe?w=800', description: 'Các nhân vật DC Comics' },
    { id: 4, name: 'Gundam', slug: 'gundam', icon: '🚀', image: 'https://images.unsplash.com/photo-1589254066213-a0c9dc853511?w=800', description: 'Mô hình Gundam Nhật Bản' },
    { id: 5, name: 'Star Wars', slug: 'star-wars', icon: '⚔️', image: 'https://images.unsplash.com/photo-1601814933824-fd0b574dd592?w=800', description: 'Thế giới Star Wars' },
    { id: 6, name: 'Anime', slug: 'anime', icon: '🎌', image: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=800', description: 'Nhân vật Anime' }
];

const brands = [
    { id: 1, name: 'Threezero', slug: 'threezero', logo: '' },
    { id: 2, name: 'Hot Toys', slug: 'hot-toys', logo: '' },
    { id: 3, name: 'Bandai', slug: 'bandai', logo: '' },
    { id: 4, name: 'Yolopark', slug: 'yolopark', logo: '' },
    { id: 5, name: 'Blokees', slug: 'blokees', logo: '' }
];

const products = [
    {
        name: 'Threezero DLX Optimus Prime - Transformers Rise of the Beasts',
        slug: 'threezero-dlx-optimus-prime',
        price: 5200000,
        oldPrice: 5800000,
        categoryId: 1,
        brandId: 1,
        images: [
            'https://images.unsplash.com/photo-1589254065878-42c9da997008?w=800',
            'https://images.unsplash.com/photo-1589254066213-a0c9dc853511?w=800',
            'https://images.unsplash.com/photo-1589254066213-a0c9dc853511?w=800',
            'https://images.unsplash.com/photo-1589254065878-42c9da997008?w=800'
        ],
        badge: 'HOT',
        rating: 4.8,
        reviewCount: 124,
        stock: 15,
        featured: true,
        description: 'Mô hình Optimus Prime cao cấp từ Threezero với khớp cử động linh hoạt và chi tiết tỉ mỉ.',
        specifications: {
            height: '30cm',
            material: 'ABS, PVC, Die-cast',
            scale: '1/12',
            articulation: '50+ points'
        },
        features: ['Khớp cử động linh hoạt', 'Phụ kiện đầy đủ', 'Chất liệu cao cấp', 'Sơn phủ hoàn thiện'],
        tags: ['transformers', 'optimus-prime', 'threezero', 'dlx']
    },
    {
        name: 'Hot Toys Iron Man Mark 85 - Avengers Endgame',
        slug: 'hot-toys-iron-man-mark-85',
        price: 12500000,
        oldPrice: null,
        categoryId: 2,
        brandId: 2,
        images: [
            'https://images.unsplash.com/photo-1635863138275-d9b33299680b?w=800',
            'https://images.unsplash.com/photo-1635863138275-d9b33299680b?w=800',
            'https://images.unsplash.com/photo-1635863138275-d9b33299680b?w=800',
            'https://images.unsplash.com/photo-1635863138275-d9b33299680b?w=800'
        ],
        badge: 'NEW',
        rating: 4.9,
        reviewCount: 256,
        stock: 8,
        featured: true,
        description: 'Mô hình Iron Man Mark 85 từ Hot Toys - phiên bản cuối cùng trong Avengers Endgame.',
        specifications: {
            height: '32cm',
            material: 'Die-cast metal, ABS',
            scale: '1/6',
            articulation: '30+ points'
        },
        features: ['LED lights', 'Interchangeable hands', 'Die-cast parts', 'Movie accurate'],
        tags: ['marvel', 'iron-man', 'hot-toys', 'avengers']
    }
];

async function initDatabase() {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Connected to MongoDB');

        // Clear existing data
        await Product.deleteMany({});
        await Category.deleteMany({});
        await Brand.deleteMany({});
        console.log('🗑️  Cleared existing data');

        // Insert categories
        await Category.insertMany(categories);
        console.log('✅ Categories inserted');

        // Insert brands
        await Brand.insertMany(brands);
        console.log('✅ Brands inserted');

        // Insert products
        await Product.insertMany(products);
        console.log('✅ Products inserted');

        // Create admin if not exists
        const adminExists = await Admin.findOne({ email: process.env.ADMIN_EMAIL });
        if (!adminExists) {
            const admin = new Admin({
                email: process.env.ADMIN_EMAIL,
                password: process.env.ADMIN_PASSWORD,
                name: 'Admin'
            });
            await admin.save();
            console.log('✅ Admin created');
            console.log(`   Email: ${process.env.ADMIN_EMAIL}`);
            console.log(`   Password: ${process.env.ADMIN_PASSWORD}`);
        } else {
            console.log('⚠️  Admin already exists');
        }

        console.log('\n🎉 Database initialized successfully!');
        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error);
        process.exit(1);
    }
}

initDatabase();
