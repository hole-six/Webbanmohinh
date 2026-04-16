// Simple test to check if search is working at all
const API_BASE = 'http://localhost:5000/api';

async function testSimpleSearch() {
    console.log('🔍 Testing Simple Search...');
    
    try {
        // Test 1: Search by name
        console.log('\n1. Testing search by name "111111111111111"...');
        const nameResponse = await fetch(`${API_BASE}/products?search=111111111111111`);
        const nameData = await nameResponse.json();
        console.log('Name search result:', nameData);
        
        // Test 2: Search by partial name
        console.log('\n2. Testing search by partial name "Captain"...');
        const partialResponse = await fetch(`${API_BASE}/products?search=Captain`);
        const partialData = await partialResponse.json();
        console.log('Partial name search result:', partialData);
        
        // Test 3: Search by ID (should trigger ID search logic)
        console.log('\n3. Testing search by hex pattern "5e1e40"...');
        const idResponse = await fetch(`${API_BASE}/products?search=5e1e40`);
        const idData = await idResponse.json();
        console.log('ID search result:', idData);
        
    } catch (error) {
        console.error('❌ Test failed:', error.message);
    }
}

// Run the test
testSimpleSearch();