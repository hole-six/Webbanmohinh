// Final test for search functionality
const API_BASE = 'http://localhost:5000/api';

async function testFinalSearch() {
    console.log('🔍 Final Search Test...');
    
    try {
        // Test 1: Get a product to know its ID
        console.log('\n1. Getting first product...');
        const allResponse = await fetch(`${API_BASE}/products?limit=1`);
        const allData = await allResponse.json();
        
        if (allData.success && allData.data.length > 0) {
            const product = allData.data[0];
            const fullId = product._id;
            const shortId = fullId.slice(-6);
            
            console.log(`Product: ${product.name}`);
            console.log(`Full ID: ${fullId}`);
            console.log(`Short ID: ${shortId}`);
            
            // Test 2: Search by name (should work via API)
            console.log('\n2. Testing name search...');
            const nameSearch = product.name.split(' ')[0];
            const nameResponse = await fetch(`${API_BASE}/products?search=${encodeURIComponent(nameSearch)}`);
            const nameData = await nameResponse.json();
            console.log(`Name search "${nameSearch}": ${nameData.success ? nameData.data.length + ' results' : 'failed'}`);
            
            // Test 3: Search by ID (might not work via API, but frontend should handle locally)
            console.log('\n3. Testing ID search via API...');
            const idResponse = await fetch(`${API_BASE}/products?search=${shortId}`);
            const idData = await idResponse.json();
            console.log(`ID search "${shortId}": ${idData.success ? idData.data.length + ' results' : 'failed'}`);
            
        } else {
            console.log('❌ No products found');
        }
        
    } catch (error) {
        console.error('❌ Test failed:', error.message);
    }
}

testFinalSearch();