// Test direct API call to see what's happening
const API_BASE = 'http://localhost:5000/api';

async function testDirectAPI() {
    console.log('🔍 Testing Direct API Call...');
    
    try {
        // Test basic API connection
        console.log('\n1. Testing basic API connection...');
        const response = await fetch(`${API_BASE}/products?limit=1`);
        console.log('Response status:', response.status);
        console.log('Response headers:', Object.fromEntries(response.headers.entries()));
        
        const data = await response.json();
        console.log('Response data keys:', Object.keys(data));
        
        if (data.success && data.data.length > 0) {
            const product = data.data[0];
            console.log('First product ID:', product._id);
            console.log('First product name:', product.name);
            
            // Test search with this product's ID
            console.log('\n2. Testing search with first product ID...');
            const searchId = product._id.slice(-6);
            console.log('Searching for:', searchId);
            
            const searchResponse = await fetch(`${API_BASE}/products?search=${searchId}`);
            console.log('Search response status:', searchResponse.status);
            
            const searchData = await searchResponse.json();
            console.log('Search response:', searchData);
            
        } else {
            console.log('No products found or API error:', data);
        }
        
    } catch (error) {
        console.error('❌ API test failed:', error.message);
        console.error('Error details:', error);
    }
}

// Run the test
testDirectAPI();