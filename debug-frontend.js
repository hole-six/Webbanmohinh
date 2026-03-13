// Debug script to check frontend JavaScript issues
// Run this in browser console on the category page

console.log('🔍 Frontend Debug Script');
console.log('========================\n');

// Check if category.js variables exist
console.log('1. Checking category.js variables:');
console.log('   currentCategory:', window.currentCategory || 'undefined');
console.log('   allProducts length:', window.allProducts?.length || 'undefined');
console.log('   filteredProducts length:', window.filteredProducts?.length || 'undefined');
console.log('   totalProductsCount length:', window.totalProductsCount?.length || 'undefined');

// Check DOM elements
console.log('\n2. Checking DOM elements:');
const grid = document.getElementById('products-list');
const resultTxt = document.getElementById('result-txt');
console.log('   products-list element:', grid ? 'exists' : 'missing');
console.log('   result-txt element:', resultTxt ? 'exists' : 'missing');
if (resultTxt) {
    console.log('   result-txt content:', resultTxt.innerHTML);
}

// Check for JavaScript errors
console.log('\n3. Checking for errors:');
window.addEventListener('error', function(e) {
    console.log('❌ JavaScript Error:', e.message, 'at', e.filename + ':' + e.lineno);
});

// Check API calls
console.log('\n4. Testing API call:');
const currentUrl = window.location.href;
const urlParams = new URLSearchParams(window.location.search);
const categorySlug = urlParams.get('cat');
console.log('   Current URL:', currentUrl);
console.log('   Category slug from URL:', categorySlug);

if (categorySlug) {
    // Test API call
    fetch('/api/products?category=3')
        .then(response => response.json())
        .then(data => {
            console.log('   API test result:', data.success ? `${data.data.length} products` : 'failed');
            if (data.success && data.data.length > 0) {
                console.log('   Sample product:', data.data[0].name);
            }
        })
        .catch(error => {
            console.log('   API test error:', error.message);
        });
}

// Check if functions exist
console.log('\n5. Checking functions:');
console.log('   displayProducts function:', typeof window.displayProducts || typeof displayProducts);
console.log('   renderCategoriesList function:', typeof window.renderCategoriesList || typeof renderCategoriesList);
console.log('   applyFilters function:', typeof window.applyFilters || typeof applyFilters);

// Manual test
console.log('\n6. Manual test - calling displayProducts:');
try {
    if (typeof displayProducts === 'function') {
        displayProducts();
        console.log('   ✅ displayProducts called successfully');
    } else {
        console.log('   ❌ displayProducts function not found');
    }
} catch (error) {
    console.log('   ❌ Error calling displayProducts:', error.message);
}

console.log('\n🔍 Debug completed! Check console for any errors above.');