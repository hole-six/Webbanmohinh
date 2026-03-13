// Debug script to check Naruto category issue
const API_URL = 'https://figurekoreashop.com/api'; // Use production URL

async function debugNarutoCategory() {
    try {
        console.log('🔍 Debugging Naruto Category Issue...\n');
        
        // Step 1: Get all categories
        console.log('1. Getting all categories...');
        const categoriesResponse = await fetch(`${API_URL}/categories`);
        const categoriesData = await categoriesResponse.json();
        
        if (categoriesData.success) {
            console.log('✅ Categories loaded:');
            categoriesData.data.forEach(cat => {
                console.log(`   - ${cat.name} (ID: ${cat.id}, Slug: ${cat.slug})`);
            });
            
            // Find Naruto category
            const narutoCategory = categoriesData.data.find(c => 
                c.name.toLowerCase().includes('naruto') || c.slug.toLowerCase().includes('naruto')
            );
            
            if (narutoCategory) {
                console.log(`\n🎯 Found Naruto category: ${narutoCategory.name} (ID: ${narutoCategory.id})`);
                
                // Step 2: Get all products and check Naruto products
                console.log('\n2. Getting all products...');
                const allProductsResponse = await fetch(`${API_URL}/products`);
                const allProductsData = await allProductsResponse.json();
                
                if (allProductsData.success) {
                    console.log(`✅ Total products: ${allProductsData.data.length}`);
                    
                    // Find products with Naruto category ID
                    const narutoProducts = allProductsData.data.filter(p => p.categoryId === narutoCategory.id);
                    console.log(`🔍 Products with categoryId ${narutoCategory.id}: ${narutoProducts.length}`);
                    
                    if (narutoProducts.length > 0) {
                        console.log('Sample Naruto products:');
                        narutoProducts.slice(0, 3).forEach(p => {
                            console.log(`   - ${p.name} (ID: ${p._id}, CategoryId: ${p.categoryId})`);
                        });
                    }
                    
                    // Check if there are products with "naruto" in name but wrong categoryId
                    const narutoNameProducts = allProductsData.data.filter(p => 
                        p.name.toLowerCase().includes('naruto')
                    );
                    console.log(`\n🔍 Products with "naruto" in name: ${narutoNameProducts.length}`);
                    
                    if (narutoNameProducts.length > 0) {
                        console.log('Products with "naruto" in name:');
                        narutoNameProducts.slice(0, 5).forEach(p => {
                            console.log(`   - ${p.name} (CategoryId: ${p.categoryId})`);
                        });
                    }
                    
                    // Step 3: Test API filter
                    console.log(`\n3. Testing API filter for category ${narutoCategory.id}...`);
                    const filterResponse = await fetch(`${API_URL}/products?category=${narutoCategory.id}`);
                    const filterData = await filterResponse.json();
                    
                    if (filterData.success) {
                        console.log(`✅ API filter result: ${filterData.data.length} products`);
                        if (filterData.data.length > 0) {
                            console.log('Filtered products:');
                            filterData.data.slice(0, 3).forEach(p => {
                                console.log(`   - ${p.name} (CategoryId: ${p.categoryId})`);
                            });
                        }
                    } else {
                        console.log('❌ API filter failed:', filterData.message);
                    }
                }
            } else {
                console.log('❌ Naruto category not found!');
            }
        } else {
            console.log('❌ Failed to load categories:', categoriesData.message);
        }
        
        console.log('\n🔍 Debug completed!');
        
    } catch (error) {
        console.log('❌ Network Error:', error.message);
    }
}

debugNarutoCategory();