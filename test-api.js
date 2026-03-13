// Test script to verify API returns all products without limit
const API_URL = 'http://localhost:5001/api';

async function testAPI() {
    try {
        console.log('Testing API without limit...');
        const response = await fetch(`${API_URL}/products`);
        const data = await response.json();
        
        if (data.success) {
            console.log(`✅ Success! Retrieved ${data.data.length} products`);
            console.log(`📊 Pagination info:`, data.pagination);
            
            if (data.pagination.limit === 0) {
                console.log('✅ No limit applied - all products returned');
            } else {
                console.log(`⚠️ Limit still applied: ${data.pagination.limit}`);
            }
        } else {
            console.log('❌ API Error:', data.message);
        }
    } catch (error) {
        console.log('❌ Network Error:', error.message);
        console.log('Make sure backend server is running on port 5001');
    }
}

testAPI();