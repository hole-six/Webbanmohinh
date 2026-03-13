// Test script to verify priority sorting logic
console.log('Testing Priority Sorting Logic...\n');

// Mock products data for testing
const testProducts = [
    { id: 1, name: 'Regular Product 1', price: 100000, badge: null, fastDelivery: false, oldPrice: null },
    { id: 2, name: 'HOT Product', price: 150000, badge: 'HOT', fastDelivery: false, oldPrice: null },
    { id: 3, name: 'Fast Delivery Product', price: 120000, badge: null, fastDelivery: true, oldPrice: null },
    { id: 4, name: 'Sale Product', price: 80000, badge: null, fastDelivery: false, oldPrice: 120000 },
    { id: 5, name: 'NEW Product', price: 200000, badge: 'NEW', fastDelivery: false, oldPrice: null },
    { id: 6, name: 'BEST SELLER Product', price: 180000, badge: 'BEST SELLER', fastDelivery: false, oldPrice: null },
    { id: 7, name: 'Triple Special', price: 250000, badge: 'HOT', fastDelivery: true, oldPrice: 300000 },
    { id: 8, name: 'Regular Product 2', price: 90000, badge: null, fastDelivery: false, oldPrice: null },
];

// Priority calculation function (same as in category.js)
function getPriority(product) {
    let priority = 0;
    
    // Highest priority: Products with badges (HOT, NEW, BEST SELLER)
    if (product.badge && ['HOT', 'NEW', 'BEST SELLER'].includes(product.badge)) {
        priority += 1000;
        // Extra priority for specific badges
        if (product.badge === 'HOT') priority += 100;
        if (product.badge === 'BEST SELLER') priority += 80;
        if (product.badge === 'NEW') priority += 60;
    }
    
    // High priority: Fast delivery products
    if (product.fastDelivery) {
        priority += 500;
    }
    
    // Medium priority: Products on sale (have oldPrice)
    if (product.oldPrice && product.oldPrice > product.price) {
        priority += 250;
    }
    
    return priority;
}

// Test sorting
console.log('Original order:');
testProducts.forEach((p, i) => {
    const priority = getPriority(p);
    console.log(`${i + 1}. ${p.name} (Priority: ${priority})`);
});

console.log('\nAfter priority sorting:');
const sortedProducts = [...testProducts].sort((a, b) => {
    const priorityDiff = getPriority(b) - getPriority(a);
    if (priorityDiff !== 0) return priorityDiff;
    return a.id - b.id; // Secondary sort by ID
});

sortedProducts.forEach((p, i) => {
    const priority = getPriority(p);
    const features = [];
    if (p.badge) features.push(`Badge: ${p.badge}`);
    if (p.fastDelivery) features.push('Fast Delivery');
    if (p.oldPrice) features.push('On Sale');
    
    console.log(`${i + 1}. ${p.name} (Priority: ${priority}) ${features.length ? `[${features.join(', ')}]` : ''}`);
});

console.log('\nExpected order:');
console.log('1. Triple Special (HOT + Fast Delivery + Sale) - Priority: 1850');
console.log('2. HOT Product (HOT badge) - Priority: 1100');
console.log('3. BEST SELLER Product (BEST SELLER badge) - Priority: 1080');
console.log('4. NEW Product (NEW badge) - Priority: 1060');
console.log('5. Fast Delivery Product (Fast delivery) - Priority: 500');
console.log('6. Sale Product (On sale) - Priority: 250');
console.log('7. Regular Product 1 (No special features) - Priority: 0');
console.log('8. Regular Product 2 (No special features) - Priority: 0');

console.log('\n✅ Priority sorting test completed!');