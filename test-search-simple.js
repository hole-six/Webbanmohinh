// Simple test script to check product search
const mongoose = require('mongoose');
const Product = require('./backend/models/Product');

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/figurekorea', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

async function testSearch() {
    try {
        console.log('🔍 Testing product search...');
        
        // First, let's see what products we have
        const allProducts = await Product.find({}).limit(5);
        console.log('\n📦 Sample products:');
        allProducts.forEach(p => {
            console.log(`  - ${p.name} (ID: ${p._id}, Code: ${p.productCode || 'N/A'})`);
        });
        
        // Test search by name
        console.log('\n🔍 Testing search by name "Captain"...');
        const nameResults = await Product.find({
            name: { $regex: 'Captain', $options: 'i' }
        });
        console.log(`Found ${nameResults.length} products by name`);
        
        // Test search by ID
        if (allProducts.length > 0) {
            const testId = allProducts[0]._id.toString().slice(-6);
            console.log(`\n🔍 Testing search by ID "${testId}"...`);
            const idResults = await Product.find({
                _id: new RegExp(testId, 'i')
            });
            console.log(`Found ${idResults.length} products by ID`);
        }
        
        // Test $or search (like our API)
        console.log('\n🔍 Testing $or search for "5E1E40"...');
        const searchTerm = '5E1E40';
        const orResults = await Product.find({
            $or: [
                { productCode: { $regex: searchTerm, $options: 'i' } },
                { name: { $regex: searchTerm, $options: 'i' } },
                { description: { $regex: searchTerm, $options: 'i' } },
                { _id: new RegExp(searchTerm.replace(/^SP/i, ''), 'i') }
            ]
        });
        console.log(`Found ${orResults.length} products with $or search`);
        orResults.forEach(p => {
            console.log(`  - ${p.name} (ID: ${p._id})`);
        });
        
    } catch (error) {
        console.error('❌ Error:', error);
    } finally {
        mongoose.connection.close();
    }
}

testSearch();