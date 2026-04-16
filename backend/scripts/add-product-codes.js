const mongoose = require('mongoose');
const Product = require('../models/Product');

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/figurekorea', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

async function addProductCodes() {
    try {
        console.log('🔄 Starting to add product codes...');
        
        // Find all products without productCode
        const productsWithoutCode = await Product.find({ 
            $or: [
                { productCode: { $exists: false } },
                { productCode: null },
                { productCode: '' }
            ]
        }).sort({ createdAt: 1 }); // Sort by creation date, oldest first
        
        console.log(`📦 Found ${productsWithoutCode.length} products without product codes`);
        
        if (productsWithoutCode.length === 0) {
            console.log('✅ All products already have product codes!');
            return;
        }
        
        // Generate and assign product codes
        for (let i = 0; i < productsWithoutCode.length; i++) {
            const product = productsWithoutCode[i];
            const productCode = `SP${(i + 1).toString().padStart(3, '0')}`;
            
            await Product.findByIdAndUpdate(product._id, { 
                productCode: productCode 
            });
            
            console.log(`✅ Updated ${product.name} -> ${productCode}`);
        }
        
        console.log('🎉 Successfully added product codes to all products!');
        
        // Verify the update
        const totalProducts = await Product.countDocuments();
        const productsWithCodes = await Product.countDocuments({ 
            productCode: { $exists: true, $ne: null, $ne: '' }
        });
        
        console.log(`📊 Summary:`);
        console.log(`   Total products: ${totalProducts}`);
        console.log(`   Products with codes: ${productsWithCodes}`);
        console.log(`   Products without codes: ${totalProducts - productsWithCodes}`);
        
    } catch (error) {
        console.error('❌ Error adding product codes:', error);
    } finally {
        mongoose.connection.close();
        console.log('🔌 Database connection closed');
    }
}

// Run the script
addProductCodes();