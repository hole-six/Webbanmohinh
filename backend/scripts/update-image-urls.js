const mongoose = require('mongoose');
require('dotenv').config();

const Product = require('../models/Product');
const Category = require('../models/Category');

const OLD_DOMAIN = 'mohinhcaocap.wavestore.id.vn';
const NEW_DOMAIN = 'figurekoreashop.com';

async function updateImageUrls() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Connected to MongoDB');

        // Update Products
        const products = await Product.find({});
        let productCount = 0;
        
        for (const product of products) {
            let updated = false;
            
            // Update images array
            if (product.images && product.images.length > 0) {
                product.images = product.images.map(img => {
                    // Remove any domain and keep only the path
                    if (img.includes('://')) {
                        // Extract path from full URL
                        const url = new URL(img);
                        updated = true;
                        return url.pathname; // Returns /uploads/...
                    }
                    // If already relative path, keep it
                    return img;
                });
            }
            
            if (updated) {
                await product.save();
                productCount++;
                console.log(`Updated product: ${product.name}`);
            }
        }

        // Update Categories
        const categories = await Category.find({});
        let categoryCount = 0;
        
        for (const category of categories) {
            let updated = false;
            
            if (category.image && category.image.includes('://')) {
                const url = new URL(category.image);
                category.image = url.pathname;
                updated = true;
            }
            
            if (updated) {
                await category.save();
                categoryCount++;
                console.log(`Updated category: ${category.name}`);
            }
        }

        console.log('\n✅ Update completed!');
        console.log(`📦 Products updated: ${productCount}`);
        console.log(`📁 Categories updated: ${categoryCount}`);
        console.log('\n💡 All URLs are now relative paths (e.g., /uploads/...)');
        console.log('   Frontend will automatically use current domain');
        
        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error);
        process.exit(1);
    }
}

updateImageUrls();
