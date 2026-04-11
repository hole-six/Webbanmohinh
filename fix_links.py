import os

files = [
    'frontend/pages/product-detail.html',
    'frontend/pages/index.html',
    'frontend/pages/cart.html',
]

for f in files:
    with open(f, 'r', encoding='utf-8') as fh:
        content = fh.read()
    new_content = content.replace('index-new.html', 'index.html')
    if new_content != content:
        with open(f, 'w', encoding='utf-8') as fh:
            fh.write(new_content)
        print(f'Fixed: {f}')
    else:
        print(f'No change: {f}')
