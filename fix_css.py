with open('frontend/pages/index-new.html', 'r', encoding='utf-8') as f:
    content = f.read()

# Find the flash section CSS block start and end
start_marker = '        /* ═══════════════════════════════════════════════\n           5. FLASH SALE - Clean Design'
end_marker = '        /* ═══════════════════════════════════════════════\n           6. 3 BANNER SECTION'

start_idx = content.find(start_marker)
end_idx = content.find(end_marker)

if start_idx == -1:
    print('ERROR: start marker not found')
    # Try to find what's there
    idx = content.find('FLASH SALE')
    print(f'FLASH SALE found at: {idx}')
    print(repr(content[idx-50:idx+100]))
elif end_idx == -1:
    print('ERROR: end marker not found')
    idx = content.find('3 BANNER SECTION')
    print(f'3 BANNER found at: {idx}')
else:
    print(f'Found block from {start_idx} to {end_idx}')
    print('Current block:')
    print(repr(content[start_idx:start_idx+200]))
