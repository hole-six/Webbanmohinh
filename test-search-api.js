// Test script to check the search API functionality
const API_BASE = 'http://localhost:5000/api';

async function testSearchAPI() {
    console.log('🔍 Testing Search API...');
    
    try {
        // Test 1: Get all products first
        console.log('\n1. Testing GET all products...');
        const allResponse = await fetch(`${API_BASE}/products`);
        const allData = await allResponse.json();
        
        if (allData.success) {
            console.log(`✅ Found ${allData.data.length} total products`);
            
            // Show first few products with their codes
            console.log('\nFirst 5 products:');
            allData.data.slice(0, 5).forEach((p, i) => {
                console.log(`${i+1}. ${p.name} - Code: ${p.productCode || 'N/A'} - ID: ${p._id}`);
            });
            
            // Test 2: Search by product code
            if (allData.data.length > 0) {
                const firstProduct = allData.data[0];
                const searchCode = firstProduct.productCode || firstProduct._id.slice(-6);
                
                console.log(`\n2. Testing search by code: "${searchCode}"`);
                const searchResponse = await fetch(`${API_BASE}/products?search=${encodeURIComponent(searchCode)}`);
                const searchData = await searchResponse.json();
                
                if (searchData.success) {
                    console.log(`✅ Search returned ${searchData.data.length} results`);
                    searchData.data.forEach((p, i) => {
                        console.log(`${i+1}. ${p.name} - Code: ${p.productCode || 'N/A'}`);
                    });
                } else {
                    console.log('❌ Search failed:', searchData.message);
                }
                
                // Test 3: Search by product name
                const searchName = firstProduct.name.split(' ')[0]; // First word of name
                console.log(`\n3. Testing search by name: "${searchName}"`);
                const nameSearchResponse = await fetch(`${API_BASE}/products?search=${encodeURIComponent(searchName)}`);
                const nameSearchData = await nameSearchResponse.json();
                
                if (nameSearchData.success) {
                    console.log(`✅ Name search returned ${nameSearchData.data.length} results`);
                    nameSearchData.data.slice(0, 3).forEach((p, i) => {
                        console.log(`${i+1}. ${p.name} - Code: ${p.productCode || 'N/A'}`);
                    });
                } else {
                    console.log('❌ Name search failed:', nameSearchData.message);
                }
            }
        } else {
            console.log('❌ Failed to get products:', allData.message);
        }
        
    } catch (error) {
        console.error('❌ Test failed:', error.message);
    }
}

// Run the test
testSearchAPI();