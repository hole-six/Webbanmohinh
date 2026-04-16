// Test the debug endpoint
const API_BASE = 'http://localhost:5000/api';

async function testDebugEndpoint() {
    try {
        console.log('🔍 Testing debug endpoint...');
        
        const response = await fetch(`${API_BASE}/products/test-search/5e1e40`);
        const data = await response.json();
        
        console.log('Debug response:', JSON.stringify(data, null, 2));
        
    } catch (error) {
        console.error('❌ Test failed:', error.message);
    }
}

testDebugEndpoint();