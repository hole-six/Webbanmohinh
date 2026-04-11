with open('frontend/pages/index-new.html', 'r', encoding='utf-8') as f:
    lines = f.readlines()

# Fix flash section HTML (lines 1338-1347, 0-indexed)
# Line 1340: flash-title
# Line 1342: flash-sub  
# Line 1344-1346: flash-viewall div

# Replace flash-title line (1340)
lines[1340] = '            <div class="flash-title">\n                <svg width="14" height="14" viewBox="0 0 24 24" fill="#ffc700"><path d="M7 2v11h3v9l7-12h-4l4-8z"/></svg>\n                HÀNG CÓ SẴN\n            </div>\n            <a href="category.html?fastDelivery=true" class="flash-viewall-link">Xem tất cả ›</a>\n'

# Remove flash-sub line (1342) - replace with empty
lines[1342] = ''

# Remove flash-viewall div (lines 1344-1346)
lines[1344] = ''
lines[1345] = ''
lines[1346] = ''

# Fix bestseller section HTML
# Line 1355: bestseller-title
# Line 1357: bestseller-sub
# Line 1359-1361: bestseller-viewall div

lines[1355] = '            <div class="bestseller-title">\n                <svg width="14" height="14" viewBox="0 0 24 24" fill="#ffc700"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>\n                SẢN PHẨM BÁN CHẠY\n            </div>\n            <a href="category.html?isBestSeller=true" class="flash-viewall-link">Xem tất cả ›</a>\n'

lines[1357] = ''
lines[1359] = ''
lines[1360] = ''
lines[1361] = ''

with open('frontend/pages/index-new.html', 'w', encoding='utf-8') as f:
    f.writelines(lines)

print('Done! HTML sections updated.')
