// Test script to verify homepage priority sorting
console.log('Testing Homepage Priority Sorting...\n');

// Mock products data for testing
const testProducts = [
    { id: 1, name: 'Regular Product', badge: null, oldPrice: null, fastDelivery: false, createdAt: '2024-01-01' },
    { id: 2, name: 'HOT Product 1', badge: 'HOT', oldPrice: null, fastDelivery: false, createdAt: '2024-01-02' },
    { id: 3, name: 'Sale Product', badge: null, oldPrice: 200000, price: 150000, fastDelivery: false, createdAt: '2024-01-03' },
    { id: 4, name: 'NEW Product', badge: 'NEW', oldPrice: null, fastDelivery: false, createdAt: '2024-01-04' },
    { id: 5, name: 'Fast Delivery Product', badge: null, oldPrice: null, fastDelivery: true, createdAt: '2024-01-05' },
    { id: 6, name: 'HOT + Sale Product', badge: 'HOT', oldPrice: 300000, price: 250000, fastDelivery: false, createdAt: '2024-01-06' },
    { id: 7, name: 'BEST SELLER Product', badge: 'BEST SELLER', oldPrice: null, fastDelivery: false, createdAt: '2024-01-07' },
    { id: 8, name: 'HOT + Fast Delivery', badge: 'HOT', oldPrice: null, fastDelivery: true, createdAt: '2024-01-08' },
];

// Priority sorting function (same as in index.html)
function sortProductsByPriority(products) {
    return products.sort((a, b) => {
        // Highest priority: HOT tag
        const aIsHot = a.badge === 'HOT';
        const bIsHot = b.badge === 'HOT';
        
        if (aIsHot && !bIsHot) return -1;
        if (!aIsHot && bIsHot) return 1;
        
        // Second priority: Other badges (NEW, BEST SELLER)
        const aHasBadge = a.badge && ['NEW', 'BEST SELLER'].includes(a.badge);
        const bHasBadge = b.badge && ['NEW', 'BEST SELLER'].includes(b.badge);
        
        if (aHasBadge && !bHasBadge) return -1;
        if (!aHasBadge && bHasBadge) return 1;
        
        // Third priority: Sale products (have oldPrice)
        const aOnSale = a.oldPrice && a.oldPrice > a.price;
        const bOnSale = b.oldPrice && b.oldPrice > b.price;
        
        if (aOnSale && !bOnSale) return -1;
        if (!aOnSale && bOnSale) return 1;
        
        // Default: sort by creation date (newest first)
        return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
    });
}

console.log('Original order:');
testProducts.forEach((p, i) => {
    const features = [];
    if (p.badge) features.push(`Badge: ${p.badge}`);
    if (p.fastDelivery) features.push('Fast Delivery');
    if (p.oldPrice) features.push('On Sale');
    
    console.log(`${i + 1}. ${p.name} ${features.length ? `[${features.join(', ')}]` : ''}`);
});

console.log('\nAfter priority sorting:');
const sortedProducts = sortProductsByPriority([...testProducts]);

sortedProducts.forEach((p, i) => {
    const features = [];
    if (p.badge) features.push(`Badge: ${p.badge}`);
    if (p.fastDelivery) features.push('Fast Delivery');
    if (p.oldPrice) features.push('On Sale');
    
    console.log(`${i + 1}. ${p.name} ${features.length ? `[${features.join(', ')}]` : ''}`);
});

console.log('\nExpected order:');
console.log('1. HOT products first (HOT + Fast Delivery, HOT + Sale, HOT Product 1)');
console.log('2. Other badge products (BEST SELLER, NEW)');
console.log('3. Sale products');
console.log('4. Regular products (by creation date)');

// Test specific sections
console.log('\n--- Testing Sale Products Section ---');
const saleProducts = testProducts.filter(p => p.oldPrice);
const sortedSaleProducts = sortProductsByPriority([...saleProducts]);

console.log('Sale products after sorting:');
sortedSaleProducts.forEach((p, i) => {
    console.log(`${i + 1}. ${p.name} [${p.badge ? `Badge: ${p.badge}, ` : ''}On Sale]`);
});

console.log('\n--- Testing Fast Delivery Section ---');
const fastDeliveryProducts = testProducts.filter(p => p.fastDelivery);
const sortedFastProducts = sortProductsByPriority([...fastDeliveryProducts]);

console.log('Fast delivery products after sorting:');
sortedFastProducts.forEach((p, i) => {
    console.log(`${i + 1}. ${p.name} [${p.badge ? `Badge: ${p.badge}, ` : ''}Fast Delivery]`);
});

console.log('\n✅ Homepage priority sorting test completed!');