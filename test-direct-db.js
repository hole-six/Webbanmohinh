// Test direct database connection and search
const mongoose = require('mongoose');

// Product schema (simplified)
const productSchema = new mongoose.Schema({
    name: String,
    description: String,
    price: Number,
    categoryId: Number,
    brandId: Number
}, { timestamps: true });

const Product = mongoose.model('Product', productSchema);

async function testDirectDB() {
    try {
        // Connect to MongoDB
        await mongoose.connect('mongodb+srv://admin:123123Aa@mohinhcaocap.s2liv1g.mongodb.net/mohinhcaocap?retryWrites=true&w=majority&appName=mohinhcaocap');
        console.log('✅ Connected to MongoDB');
        
        // Get first product
        const firstProduct = await Product.findOne({});
        if (!firstProduct) {
            console.log('❌ No products found');
            return;
        }
        
        console.log('First product:', {
            id: firstProduct._id.toString(),
            name: firstProduct.name,
            last6: firstProduct._id.toString().slice(-6)
        });
        
        // Test ID search logic
        const searchTerm = '5e1e40';
        console.log('\nTesting search for:', searchTerm);
        
        // Get all products and filter
        const allProducts = await Product.find({});
        console.log(`Total products: ${allProducts.length}`);
        
        const matches = allProducts.filter(product => {
            const idString = product._id.toString().toLowerCase();
            const searchLower = searchTerm.toLowerCase();
            return idString.includes(searchLower);
        });
        
        console.log(`Matches found: ${matches.length}`);
        matches.forEach(match => {
            console.log(`- ${match.name} (ID: ${match._id.toString()})`);
        });
        
    } catch (error) {
        console.error('❌ Error:', error.message);
    } finally {
        mongoose.connection.close();
    }
}

testDirectDB();