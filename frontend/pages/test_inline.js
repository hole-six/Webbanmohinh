
        // ── State ──
        let activeCatId = null, priceMin = 0, priceMax = Infinity;
        let sortMode = '', viewMode = 'grid', page = 1;
        const PER = 9;
        let filtered = [];
        let wished = new Set();

        // ── Init ──
        document.addEventListener('DOMContentLoaded', async () => {
            console.log('🔄 Loading category page...');
            
            await window.initApp();
            
            console.log('📁 Categories loaded:', categories);
            console.log('📦 Products loaded:', products);
            
            const p = new URLSearchParams(location.search);
            const slug = p.get('cat');
            
            console.log('🔍 Category slug:', slug);
            
            if (slug) {
                const c = categories.find(x => x.slug === slug);
                if (c) {
                    activeCatId = c.id;
                    console.log('✅ Active category ID:', activeCatId);
                }
            }
            
            loadCart(); 
            updateCartUI();
            buildSidebar();
            buildFooterCats();
            updateBanner();
            applyFilters();
            
            console.log('✅ Category page loaded');
        });

        // ── Sidebar ──
        function buildSidebar() {
            document.getElementById('cnt-all').textContent = products.length;
            const el = document.getElementById('cat-items');
            el.innerHTML = categories.map(c => {
                const n = products.filter(p => p.categoryId === c.id).length;
                return `<div class="cat-row" id="cr-${c.id}" onclick="selectCategory(${c.id})">
      <span class="cat-n">${c.name}</span>
      <span class="cat-c">${n}</span>
    </div>`;
            }).join('');
            syncCatUI();
        }

        function buildFooterCats() {
            const footerCats = document.getElementById('footer-cats');
            if (footerCats && categories && categories.length > 0) {
                footerCats.innerHTML = categories.map(c => `<li><a href="category.html?cat=${c.slug}">${c.name}</a></li>`).join('');
            }
        }

        function selectCategory(id) {
            activeCatId = id; page = 1;
            syncCatUI(); updateBanner(); applyFilters(); closeSidebar();
        }

        function syncCatUI() {
            document.querySelectorAll('.cat-row').forEach(el => el.classList.remove('active'));
            if (!activeCatId) {
                document.getElementById('cat-all')?.classList.add('active');
            } else {
                document.getElementById('cr-' + activeCatId)?.classList.add('active');
            }
        }

        // Convert Google Drive link to direct image link
        function convertGoogleDriveLink(url) {
            if (!url) return '';
            
            // Check if it's a Google Drive link
            const driveMatch = url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
            if (driveMatch) {
                const fileId = driveMatch[1];
                // Convert to direct image link
                return `https://drive.google.com/thumbnail?id=${fileId}&sz=w1000`;
            }
            
            // If already a direct link or other URL, return as is
            return url;
        }

        function updateBanner() {
            const img = document.getElementById('banner-img');
            const h2 = document.getElementById('banner-title');
            const par = document.getElementById('banner-desc');
            const bc = document.getElementById('bc-cur');
            const ttl = document.getElementById('page-title');
            if (!activeCatId) {
                img.src = 'https://images.unsplash.com/photo-1531525645387-7f14be1bdbbd?w=1400&h=300&fit=crop';
                h2.textContent = 'Tất cả sản phẩm';
                par.textContent = 'Khám phá bộ sưu tập mô hình cao cấp chính hãng';
                bc.textContent = 'Tất cả sản phẩm';
                ttl.textContent = 'Danh Mục Sản Phẩm — Figure Korea Shop';
            } else {
                const c = categories.find(x => x.id === activeCatId);
                if (c) {
                    img.src = convertGoogleDriveLink(c.image) || 'https://images.unsplash.com/photo-1531525645387-7f14be1bdbbd?w=1400&h=300&fit=crop';
                    h2.textContent = c.name;
                    par.textContent = c.description;
                    bc.textContent = c.name;
                    ttl.textContent = c.name + ' — Figure Korea Shop';
                }
            }
        }

        // ── Price ──
        function setPrice(mn, mx, btn) {
            priceMin = mn; priceMax = mx; page = 1;
            document.getElementById('price-min').value = mn > 0 ? mn : '';
            document.getElementById('price-max').value = mx < 999999999 ? mx : '';
            document.querySelectorAll('.price-opt').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            applyFilters();
        }

        // ── Filters ──
        function applyFilters() {
            const kw = (document.getElementById('search-inp')?.value || '').toLowerCase().trim();
            sortMode = document.getElementById('sort-sel').value;
            const mnv = parseFloat(document.getElementById('price-min').value);
            const mxv = parseFloat(document.getElementById('price-max').value);
            if (!isNaN(mnv)) priceMin = mnv;
            if (!isNaN(mxv)) priceMax = mxv;

            let list = [...products];
            if (activeCatId) list = list.filter(p => p.categoryId === activeCatId);
            list = list.filter(p => p.price >= (priceMin || 0) && p.price <= (priceMax || Infinity));
            if (kw) list = list.filter(p =>
                p.name.toLowerCase().includes(kw) || (p.description || '').toLowerCase().includes(kw));

            switch (sortMode) {
                case 'price-asc': list.sort((a, b) => a.price - b.price); break;
                case 'price-desc': list.sort((a, b) => b.price - a.price); break;
                case 'rating': list.sort((a, b) => (b.rating || 0) - (a.rating || 0)); break;
                case 'name': list.sort((a, b) => a.name.localeCompare(b.name, 'vi')); break;
                case 'disc': list.sort((a, b) => {
                    const da = a.oldPrice ? (a.oldPrice - a.price) / a.oldPrice : 0;
                    const db = b.oldPrice ? (b.oldPrice - b.price) / b.oldPrice : 0;
                    return db - da;
                }); break;
            }

            filtered = list;
            renderActiveFilters();
            renderGrid();
            renderPagination();
            document.getElementById('result-txt').innerHTML =
                `Hiển thị <strong>${list.length}</strong> sản phẩm`;
        }

        // ── Active filter tags ──
        function renderActiveFilters() {
            const wrap = document.getElementById('active-filters');
            const tags = [];
            if (activeCatId) {
                const c = categories.find(x => x.id === activeCatId);
                if (c) tags.push({ label: c.name, rm: () => { activeCatId = null; syncCatUI(); updateBanner(); applyFilters(); } });
            }
            const kw = document.getElementById('search-inp')?.value;
            if (kw) tags.push({ label: '"' + kw + '"', rm: () => { document.getElementById('search-inp').value = ''; applyFilters(); } });
            if (priceMin > 0 || priceMax < Infinity) {
                tags.push({
                    label: formatPrice(priceMin || 0) + ' – ' + (priceMax < 999999999 ? formatPrice(priceMax) : '∞'),
                    rm: () => { priceMin = 0; priceMax = Infinity; document.getElementById('price-min').value = ''; document.getElementById('price-max').value = ''; document.querySelectorAll('.price-opt').forEach(b => b.classList.remove('active')); applyFilters(); }
                });
            }
            if (!tags.length) { wrap.innerHTML = ''; return; }
            window._rms = tags.map(t => t.rm);
            wrap.innerHTML = tags.map((t, i) =>
                `<div class="ftag">${t.label} <span class="fx" onclick="_rms[${i}]()">×</span></div>`
            ).join('') + `<button class="clear-btn" onclick="clearAll()">Xóa bộ lọc</button>`;
        }

        function clearAll() {
            activeCatId = null; priceMin = 0; priceMax = Infinity; page = 1;
            document.getElementById('search-inp').value = '';
            document.getElementById('price-min').value = '';
            document.getElementById('price-max').value = '';
            document.querySelectorAll('.price-opt').forEach(b => b.classList.remove('active'));
            syncCatUI(); updateBanner(); applyFilters();
        }

        // ── Render grid ──
        function renderGrid() {
            const grid = document.getElementById('prod-grid');
            const start = (page - 1) * PER;
            const slice = filtered.slice(start, start + PER);

            if (!slice.length) {
                grid.innerHTML = `<div class="empty">
      <h3>Không tìm thấy sản phẩm</h3>
      <p>Thử thay đổi bộ lọc hoặc tìm kiếm khác</p>
      <button onclick="clearAll()">Xóa bộ lọc</button>
    </div>`; return;
            }
            grid.innerHTML = slice.map(renderCard).join('');
        }

        function renderCard(p) {
            const img = p.images?.[0] || p.image || '';
            const brand = brands.find(b => b.id === p.brandId);
            const disc = p.oldPrice ? getDiscountPercent(p.price, p.oldPrice) : 0;
            const low = p.stock > 0 && p.stock <= 5;
            const isW = wished.has(p.id);

            let badgeHTML = '';
            if (p.badge) {
                const cls = p.badge === 'HOT' ? 'hot' : p.badge === 'NEW' ? 'new' : p.badge === 'BEST SELLER' ? 'best' : 'sale';
                badgeHTML = `<div class="pbadge ${cls}">${p.badge}</div>`;
            } else if (disc > 0) {
                badgeHTML = `<div class="pbadge sale">-${disc}%</div>`;
            }

            const ratingHTML = p.rating ? `
    <div class="pcard-rating">
      <span class="stars">${'★'.repeat(Math.round(p.rating))}${'☆'.repeat(5 - Math.round(p.rating))}</span>
      <span class="rc">(${p.reviewCount || 0})</span>
    </div>` : '';

            return `<div class="pcard">
    ${badgeHTML}
    <button class="pwish${isW ? ' on' : ''}" onclick="toggleWish(${p.id},this)" title="Yêu thích">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="${isW ? '#8b1a1a' : 'none'}" stroke="${isW ? '#8b1a1a' : '#48484a'}" stroke-width="1.8">
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
      </svg>
    </button>
    <div class="pcard-img">
      <img src="${img}" alt="${p.name}" loading="lazy">
     
    </div>
    <div class="pcard-body">
      <div class="pcard-brand">${brand?.name || ''}</div>
      <div class="pcard-name">${p.name}</div>
      ${ratingHTML}
      ${low ? `<div class="stock-warn">Chỉ còn ${p.stock} sản phẩm</div>` : ''}
      <div class="pcard-price">
        <span class="price-now">${formatPrice(p.price)}</span>
        ${p.oldPrice ? `<span class="price-was">${formatPrice(p.oldPrice)}</span><span class="price-off">-${disc}%</span>` : ''}
      </div>
      <button class="btn-add" onclick="location.href='product-detail.html?id=${p.id}'">Mua ngay</button>
    </div>
  </div>`;
        }

        // ── Pagination ──
        function renderPagination() {
            const total = Math.ceil(filtered.length / PER);
            const el = document.getElementById('pagination');
            if (total <= 1) { el.innerHTML = ''; return; }
            let h = `<button class="pg" onclick="goPage(${page - 1})" ${page === 1 ? 'disabled' : ''}>‹</button>`;
            for (let i = 1; i <= total; i++) {
                if (i === 1 || i === total || Math.abs(i - page) <= 1) {
                    h += `<button class="pg${i === page ? ' active' : ''}" onclick="goPage(${i})">${i}</button>`;
                } else if (Math.abs(i - page) === 2) {
                    h += `<span style="padding:0 4px;color:var(--muted);font-size:13px">…</span>`;
                }
            }
            h += `<button class="pg" onclick="goPage(${page + 1})" ${page === total ? 'disabled' : ''}>›</button>`;
            el.innerHTML = h;
        }

        function goPage(n) {
            const total = Math.ceil(filtered.length / PER);
            if (n < 1 || n > total) return;
            page = n;
            renderGrid(); renderPagination();
            document.querySelector('.main-col').scrollIntoView({ behavior: 'smooth' });
        }

        // ── View toggle ──
        function setView(m) {
            viewMode = m;
            document.getElementById('prod-grid').classList.toggle('list', m === 'list');
            document.getElementById('vg').classList.toggle('active', m === 'grid');
            document.getElementById('vl').classList.toggle('active', m === 'list');
            renderGrid();
        }

        // ── Wishlist ──
        function toggleWish(id, btn) {
            if (wished.has(id)) {
                wished.delete(id); btn.classList.remove('on');
                btn.querySelector('svg').setAttribute('fill', 'none');
                btn.querySelector('svg').setAttribute('stroke', '#48484a');
                showToast('Đã xóa khỏi danh sách yêu thích');
            } else {
                wished.add(id); btn.classList.add('on');
                btn.querySelector('svg').setAttribute('fill', '#8b1a1a');
                btn.querySelector('svg').setAttribute('stroke', '#8b1a1a');
                showToast('Đã thêm vào danh sách yêu thích');
            }
        }

        // ── Cart ──
        function addCart(id) {
            loadCart(); addToCart(id, 1); updateCartUI();
            showToast('Sản phẩm đã được thêm vào giỏ hàng');
        }
        function updateCartUI() {
            document.getElementById('cart-cnt').textContent = getCartCount();
        }

        // ── Sidebar mobile ──
        function toggleSidebar() {
            const s = document.getElementById('sidebar'), ov = document.getElementById('sb-ov');
            s.classList.toggle('open');
            ov.style.display = s.classList.contains('open') ? 'block' : 'none';
        }
        function closeSidebar() {
            document.getElementById('sidebar').classList.remove('open');
            document.getElementById('sb-ov').style.display = 'none';
        }

        // ── Toast ──
        function showToast(msg) {
            const t = document.getElementById('toast');
            t.textContent = msg; t.classList.add('show');
            clearTimeout(t._t); t._t = setTimeout(() => t.classList.remove('show'), 2800);
        }
    