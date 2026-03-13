// Test script to verify category counting logic
const API_URL = 'http://localhost:5001/api';

async function testCategoryCounting() {
    try {
        console.log('Testing Category Counting Logic...\n');
        
        // Test 1: Get all products
        console.log('1. Getting all products...');
        const allProductsResponse = await fetch(`${API_URL}/products`);
        const allProductsData = await allProductsResponse.json();
        
        if (allProductsData.success) {
            console.log(`✅ Total products: ${allProductsData.data.length}`);
            
            // Count by category
            const categoryCount = {};
            allProductsData.data.forEach(p => {
                const catId = p.categoryId || 'No Category';
                categoryCount[catId] = (categoryCount[catId] || 0) + 1;
            });
            
            console.log('\nProducts by category (from all products):');
            Object.entries(categoryCount).forEach(([catId, count]) => {
                console.log(`   Category ${catId}: ${count} products`);
            });
        }
        
        // Test 2: Get categories
        console.log('\n2. Getting categories...');
        const categoriesResponse = await fetch(`${API_URL}/categories`);
        const categoriesData = await categoriesResponse.json();
        
        if (categoriesData.success) {
            console.log(`✅ Categories loaded: ${categoriesData.data.length}`);
            categoriesData.data.forEach(cat => {
                console.log(`   - ${cat.name} (ID: ${cat.id})`);
            });
        }
        
        // Test 3: Get products by specific category
        console.log('\n3. Testing category filtering...');
        if (categoriesData.success && categoriesData.data.length > 0) {
            const firstCategory = categoriesData.data[0];
            console.log(`Testing category: ${firstCategory.name} (ID: ${firstCategory.id})`);
            
            const categoryProductsResponse = await fetch(`${API_URL}/products?category=${firstCategory.id}`);
            const categoryProductsData = await categoryProductsResponse.json();
            
            if (categoryProductsData.success) {
                console.log(`✅ Products in ${firstCategory.name}: ${categoryProductsData.data.length}`);
                
                // Verify all products belong to this category
                const wrongCategory = categoryProductsData.data.filter(p => p.categoryId !== firstCategory.id);
                if (wrongCategory.length === 0) {
                    console.log('✅ All products belong to correct category');
                } else {
                    console.log(`❌ Found ${wrongCategory.length} products with wrong category`);
                }
            }
        }
        
        console.log('\n✅ Category counting test completed!');
        
    } catch (error) {
        console.log('❌ Network Error:', error.message);
        console.log('Make sure backend server is running on port 5001');
    }
}

testCategoryCounting();