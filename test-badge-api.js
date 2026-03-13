// Test script to verify badge filtering works
const API_URL = 'http://localhost:5001/api';

async function testBadgeAPI() {
    try {
        console.log('Testing badge filtering API...');
        
        // Test 1: Get all products with HOT, NEW, BEST SELLER badges
        console.log('\n1. Testing badge filter: HOT,NEW,BEST SELLER');
        const response1 = await fetch(`${API_URL}/products?badge=HOT,NEW,BEST SELLER`);
        const data1 = await response1.json();
        
        if (data1.success) {
            console.log(`✅ Found ${data1.data.length} products with badges`);
            data1.data.forEach(p => {
                console.log(`   - ${p.name} (Badge: ${p.badge})`);
            });
        } else {
            console.log('❌ API Error:', data1.message);
        }
        
        // Test 2: Get only HOT products
        console.log('\n2. Testing single badge filter: HOT');
        const response2 = await fetch(`${API_URL}/products?badge=HOT`);
        const data2 = await response2.json();
        
        if (data2.success) {
            console.log(`✅ Found ${data2.data.length} HOT products`);
            data2.data.forEach(p => {
                console.log(`   - ${p.name} (Badge: ${p.badge})`);
            });
        } else {
            console.log('❌ API Error:', data2.message);
        }
        
        // Test 3: Get all products to see badge distribution
        console.log('\n3. Badge distribution in all products:');
        const response3 = await fetch(`${API_URL}/products`);
        const data3 = await response3.json();
        
        if (data3.success) {
            const badgeCount = {};
            data3.data.forEach(p => {
                const badge = p.badge || 'No Badge';
                badgeCount[badge] = (badgeCount[badge] || 0) + 1;
            });
            
            console.log('Badge distribution:');
            Object.entries(badgeCount).forEach(([badge, count]) => {
                console.log(`   ${badge}: ${count} products`);
            });
        }
        
    } catch (error) {
        console.log('❌ Network Error:', error.message);
        console.log('Make sure backend server is running on port 5001');
    }
}

testBadgeAPI();