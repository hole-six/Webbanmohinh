const mongoose = require('mongoose');
require('dotenv').config();

const Product = require('../models/Product');
const Category = require('../models/Category');

const OLD_DOMAIN = 'https://mohinhcaocap.wavestore.id.vn';
const NEW_DOMAIN = 'https://figurekoreashop.com';

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
                    if (img.includes(OLD_DOMAIN)) {
                        updated = true;
                        return img.replace(OLD_DOMAIN, NEW_DOMAIN);
                    }
                    // If it's a relative path, make it absolute
                    if (img.startsWith('/uploads/')) {
                        updated = true;
                        return NEW_DOMAIN + img;
                    }
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
            
            if (category.image && category.image.includes(OLD_DOMAIN)) {
                category.image = category.image.replace(OLD_DOMAIN, NEW_DOMAIN);
                updated = true;
            }
            
            // If it's a relative path, make it absolute
            if (category.image && category.image.startsWith('/uploads/')) {
                category.image = NEW_DOMAIN + category.image;
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
        
        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error);
        process.exit(1);
    }
}

updateImageUrls();
