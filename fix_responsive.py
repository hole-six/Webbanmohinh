with open('frontend/pages/index-new.html', 'r', encoding='utf-8') as f:
    content = f.read()

# Find and remove old header responsive blocks (768, 1024, 1200 media queries for header)
# We'll replace the section from "Mobile First" comment to "Extra small mobile" comment
# keeping only the category-related parts

old_start = '        /* Mobile First (default styles above are for mobile) */\n\n        /* Tablet and up */'
old_end = '        /* Extra small mobile (< 360px) */'

start_idx = content.find(old_start)
end_idx = content.find(old_end)

if start_idx == -1 or end_idx == -1:
    print('ERROR: markers not found')
    print('start:', start_idx, 'end:', end_idx)
else:
    new_block = '''        /* Mobile First (default styles above are for mobile) */

        /* Extra small mobile (< 360px) */'''
    content = content[:start_idx] + new_block + content[end_idx + len('        /* Extra small mobile (< 360px) */'):]
    with open('frontend/pages/index-new.html', 'w', encoding='utf-8') as f:
        f.write(content)
    print('Done! Removed old header responsive blocks')
    print('New length:', len(content))
