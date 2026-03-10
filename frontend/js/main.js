// Main JavaScript for Homepage

let categories = [];
let products = [];

// Export to window for use in index.html
window.categories = categories;
window.products = products;

// Load data from API
async function loadData() {
    try {
        // Load categories
        const categoriesData = await API.getAllCategories();
        if (categoriesData.success) {
            categories = categoriesData.data;
            window.categories = categories;

            // Call functions from index.html
            if (typeof loadTopCategories === 'function') loadTopCategories();
            if (typeof renderHeroGrid === 'function') renderHeroGrid();
            if (typeof buildCatNav === 'function') buildCatNav();
            if (typeof buildFooterCats === 'function') buildFooterCats();
        }

        // Load products
        const productsData = await API.getAllProducts({ limit: 12 });
        if (productsData.success) {
            products = productsData.data;
            window.products = products;

            // Call render functions from index.html
            if (typeof renderFeaturedProducts === 'function') renderFeaturedProducts();
            if (typeof renderSaleProducts === 'function') renderSaleProducts();
        }
    } catch (error) {
        console.error('Error loading data:', error);
    }
}

// Load top categories in announcement bar
function loadTopCategories() {
    const topCategoriesBar = document.getElementById('top-categories');
    if (!topCategoriesBar) return;

    const html = categories.map(cat =>
        `<a href="category.html?cat=${cat.slug}">${cat.name}</a>`
    ).join('<span class="sep">·</span>');

    topCategoriesBar.innerHTML = html;
}

// Export to window
window.loadTopCategories = loadTopCategories;

// Initialize app
window.initApp = async function () {
    await loadData();
};

// Auto-load on DOMContentLoaded if not called manually
document.addEventListener('DOMContentLoaded', function () {
    if (!window.appInitialized) {
        window.appInitialized = true;
        loadData();
    }
});
