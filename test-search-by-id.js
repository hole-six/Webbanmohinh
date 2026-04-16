// Test script to check search by ID functionality
const API_BASE = 'http://localhost:5000/api';

async function testSearchByID() {
    console.log('🔍 Testing Search by ID...');
    
    try {
        // Test 1: Get all products first
        console.log('\n1. Getting all products...');
        const allResponse = await fetch(`${API_BASE}/products`);
        const allData = await allResponse.json();
        
        if (allData.success && allData.data.length > 0) {
            console.log(`✅ Found ${allData.data.length} total products`);
            
            // Show first few products with their IDs
            console.log('\nFirst 5 products:');
            allData.data.slice(0, 5).forEach((p, i) => {
                const shortId = p._id.slice(-6).toUpperCase();
                console.log(`${i+1}. ${p.name} - ID: ${shortId} (Full: ${p._id})`);
            });
            
            // Test 2: Search by full ID
            const firstProduct = allData.data[0];
            const fullId = firstProduct._id;
            
            console.log(`\n2. Testing search by full ID: "${fullId}"`);
            const fullIdResponse = await fetch(`${API_BASE}/products?search=${encodeURIComponent(fullId)}`);
            const fullIdData = await fullIdResponse.json();
            
            if (fullIdData.success) {
                console.log(`✅ Full ID search returned ${fullIdData.data.length} results`);
                fullIdData.data.forEach((p, i) => {
                    console.log(`${i+1}. ${p.name} - ID: ${p._id.slice(-6).toUpperCase()}`);
                });
            } else {
                console.log('❌ Full ID search failed:', fullIdData.message);
            }
            
            // Test 3: Search by short ID (last 6 characters)
            const shortId = firstProduct._id.slice(-6);
            console.log(`\n3. Testing search by short ID: "${shortId}"`);
            const shortIdResponse = await fetch(`${API_BASE}/products?search=${encodeURIComponent(shortId)}`);
            const shortIdData = await shortIdResponse.json();
            
            if (shortIdData.success) {
                console.log(`✅ Short ID search returned ${shortIdData.data.length} results`);
                shortIdData.data.forEach((p, i) => {
                    console.log(`${i+1}. ${p.name} - ID: ${p._id.slice(-6).toUpperCase()}`);
                });
            } else {
                console.log('❌ Short ID search failed:', shortIdData.message);
            }
            
            // Test 4: Search by uppercase short ID
            const upperShortId = shortId.toUpperCase();
            console.log(`\n4. Testing search by uppercase short ID: "${upperShortId}"`);
            const upperResponse = await fetch(`${API_BASE}/products?search=${encodeURIComponent(upperShortId)}`);
            const upperData = await upperResponse.json();
            
            if (upperData.success) {
                console.log(`✅ Uppercase ID search returned ${upperData.data.length} results`);
                upperData.data.forEach((p, i) => {
                    console.log(`${i+1}. ${p.name} - ID: ${p._id.slice(-6).toUpperCase()}`);
                });
            } else {
                console.log('❌ Uppercase ID search failed:', upperData.message);
            }
            
        } else {
            console.log('❌ Failed to get products:', allData.message);
        }
        
    } catch (error) {
        console.error('❌ Test failed:', error.message);
    }
}

// Run the test
testSearchByID();