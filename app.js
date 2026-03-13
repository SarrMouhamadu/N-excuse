let cart = [], curProd = null, curSize = null, curPay = 'Wave', curGalleryIdx = 0, curQty = 1;
let promoCode = null, promoDiscount = 0;
const WA = '221773985255';

const PROMO_CODES = {
  'NOEXCUSE10': 10,
  'WELCOME15': 15,
};

/* ── DARK / LIGHT MODE ── */
function initTheme() {
  const saved = localStorage.getItem('ne-theme') || 'light';
  applyTheme(saved);
}

function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  const btn = document.getElementById('themeBtn');
  if (btn) btn.textContent = theme === 'dark' ? '☀️' : '🌙';
  localStorage.setItem('ne-theme', theme);
}

function toggleTheme() {
  const current = document.documentElement.getAttribute('data-theme') || 'light';
  applyTheme(current === 'dark' ? 'light' : 'dark');
}

initTheme();

let scrollObserver;
function initScrollObserver() {
  if (scrollObserver) return;
  scrollObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('reveal-active');
        scrollObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });
  
  document.querySelectorAll('.shop-title, .filters, .newsletter, .ft-section').forEach(el => {
    el.classList.add('reveal-hidden');
    scrollObserver.observe(el);
  });
}

function initImgTicker() {
  const ticker = document.getElementById('imgTickerInner');
  if (!ticker) return;
  // Prendre toutes les images des produits
  const imgs = PRODUCTS.map(p => `<img src="${p.img}" alt="${p.name}">`).join('');
  // Dupliquer plusieurs fois pour assurer un défilement continu sans coupure
  ticker.innerHTML = imgs + imgs + imgs + imgs;
}

initScrollObserver();
initImgTicker();
render(null);

function render(filter) {
  document.querySelectorAll('.filter-btn').forEach((b, i) => {
    const cats = [null, 'tshirt', 'bonnet','hoodie', 'accessoire'];
    b.classList.toggle('active', cats[i] === filter);
  });
  const list = filter ? PRODUCTS.filter(p => p.cat === filter) : PRODUCTS;
  document.getElementById('prodGrid').innerHTML = list.map((p, idx) => `
    <div class="prod-card reveal-hidden${p.soldOut ? ' soldout' : ''}" style="transition-delay: ${idx * 40}ms" ${!p.soldOut ? `onclick="openProduct(${p.id})"` : ''}>
      <div class="prod-img">
        <img src="${p.img}" alt="${p.name}">
        ${p.gallery && p.gallery.length > 1 ? '<div class="gallery-dot">+</div>' : ''}
        ${p.soldOut ? '<div class="sold-badge">SOLD OUT</div>' : ''}
      </div>
      <div class="prod-info">
        <div class="prod-name">${p.name}</div>
        <div class="prod-price">${p.price.toLocaleString('fr-FR')} CFA</div>
      </div>
    </div>`).join('');

  setTimeout(() => {
    if (scrollObserver) {
      document.querySelectorAll('.prod-card.reveal-hidden:not(.reveal-active)').forEach(el => scrollObserver.observe(el));
    }
  }, 10);
}

function doFilter(f) { render(f); document.getElementById('shopAnchor').scrollIntoView({behavior:'smooth'}); }
function scrollShop() { document.getElementById('shopAnchor').scrollIntoView({behavior:'smooth'}); }
function toggleMenu() { document.getElementById('sideNav').classList.toggle('open'); document.getElementById('navOverlay').classList.toggle('open'); }
function closeMenu() { document.getElementById('sideNav').classList.remove('open'); document.getElementById('navOverlay').classList.remove('open'); }

function openProduct(id) {
  curProd = PRODUCTS.find(p => p.id === id);
  if (!curProd) return;
  curSize = null; curGalleryIdx = 0; curQty = 1;
  renderSheet();
  document.getElementById('sheetOverlay').classList.add('open');
  document.getElementById('sizeSheet').classList.add('open');
}

function renderSheet() {
  const p = curProd;
  const gallery = p.gallery || [p.img];
  document.getElementById('sheetMainImg').src = gallery[curGalleryIdx];
  document.getElementById('sheetName').textContent = p.name;
  document.getElementById('sheetPrice').textContent = p.price.toLocaleString('fr-FR') + ' CFA';
  const thumbs = document.getElementById('sheetThumbs');
  if (gallery.length > 1) {
    thumbs.style.display = 'flex';
    thumbs.innerHTML = gallery.map((img, i) => `<div class="thumb-top ${i===curGalleryIdx?'active':''}" onclick="switchImg(${i})"><img src="${img}" alt=""></div>`).join('');
  } else { thumbs.style.display = 'none'; }
  document.getElementById('sizesGrid').innerHTML = p.sizes.map(s => `<button class="size-btn${curSize===s?' active':''}" onclick="selectSize(this,'${s}')">${s}</button>`).join('');
  document.getElementById('qtyVal').textContent = curQty;
  document.getElementById('btnAdd').disabled = !curSize;
}

function switchImg(idx) { curGalleryIdx = idx; renderSheet(); }
function closeSheet() { document.getElementById('sheetOverlay').classList.remove('open'); document.getElementById('sizeSheet').classList.remove('open'); }
function selectSize(btn, size) { curSize = size; document.querySelectorAll('.size-btn').forEach(b => b.classList.remove('active')); btn.classList.add('active'); document.getElementById('btnAdd').disabled = false; }

function changeQty(delta) {
  curQty = Math.max(1, curQty + delta);
  document.getElementById('qtyVal').textContent = curQty;
}

function addToCart() {
  if (!curProd || !curSize) return;
  const key = curProd.id + '-' + curSize;
  const ex = cart.find(i => i.key === key);
  if (ex) ex.qty += curQty; else cart.push({key, prod:curProd, size:curSize, qty:curQty});
  closeSheet(); syncCart(); showToast(curProd.name + ' ajouté ✓');
}

function openCart() { updateCartUI(); document.getElementById('cartPanel').classList.add('open'); document.getElementById('cartOverlay').classList.add('open'); }
function closeCart() { document.getElementById('cartPanel').classList.remove('open'); document.getElementById('cartOverlay').classList.remove('open'); }
function clearCart() { cart = []; promoCode = null; promoDiscount = 0; syncCart(); updateCartUI(); }
function removeItem(key) { cart = cart.filter(i => i.key !== key); syncCart(); updateCartUI(); }

function applyPromo() {
  const input = document.getElementById('promoInput').value.trim().toUpperCase();
  const discount = PROMO_CODES[input];
  if (discount) {
    promoCode = input; promoDiscount = discount;
    showToast('Code ' + input + ' appliqué — -' + discount + '% ✓');
  } else {
    promoCode = null; promoDiscount = 0;
    showToast('Code promo invalide');
  }
  syncCart(); updateCartUI();
}

function syncCart() {
  const count = cart.reduce((s,i) => s+i.qty, 0);
  const b = document.getElementById('cartBubble');
  b.textContent = count; b.classList.toggle('show', count > 0);
  
  b.classList.remove('pop');
  void b.offsetWidth;
  if(count > 0) b.classList.add('pop');
  setTimeout(() => b.classList.remove('pop'), 300);

  const subtotal = cart.reduce((s,i) => s+i.prod.price*i.qty, 0);
  const total = promoDiscount > 0 ? Math.round(subtotal * (1 - promoDiscount/100)) : subtotal;
  document.getElementById('cartTotal').textContent = total.toLocaleString('fr-FR') + ' CFA';
}

function updateCartUI() {
  const body = document.getElementById('cartBody');
  const footer = document.getElementById('cartFooter');
  if (!cart.length) {
    body.innerHTML = '<div class="cart-empty">Panier vide</div>';
    footer.style.display = 'none'; return;
  }
  footer.style.display = 'block';
  const subtotal = cart.reduce((s,i) => s+i.prod.price*i.qty, 0);
  const total = promoDiscount > 0 ? Math.round(subtotal * (1 - promoDiscount/100)) : subtotal;
  body.innerHTML = cart.map(i => `
    <div class="cart-item">
      <div class="cart-item-img"><img src="${i.prod.img}" alt=""></div>
      <div class="cart-item-info">
        <div class="cart-item-name">${i.prod.name}</div>
        <div class="cart-item-size">Taille: ${i.size} · Qté: ${i.qty}</div>
        <div class="cart-item-price">${(i.prod.price*i.qty).toLocaleString('fr-FR')} CFA</div>
      </div>
      <button class="cart-item-del" onclick="removeItem('${i.key}')">✕</button>
    </div>`).join('') + `
  <div class="promo-row">
    <input type="text" id="promoInput" placeholder="Code promo" class="promo-input">
    <button class="promo-btn" onclick="applyPromo()">OK</button>
  </div>
  ${promoDiscount > 0 ? `<div class="promo-applied">✓ ${promoCode} — -${promoDiscount}%</div>` : ''}
  <button class="btn-vider" onclick="clearCart()">🗑 VIDER LE PANIER</button>`;
  document.getElementById('cartTotal').textContent = total.toLocaleString('fr-FR') + ' CFA';
}

function openCheckout() {
  const subtotal = cart.reduce((s,i) => s+i.prod.price*i.qty, 0);
  const total = promoDiscount > 0 ? Math.round(subtotal * (1 - promoDiscount/100)) : subtotal;
  document.getElementById('orderItems').innerHTML = cart.map(i => `
    <div class="order-item">
      <div class="order-item-img"><img src="${i.prod.img}" alt=""></div>
      <div class="order-item-info">
        <div class="order-item-name">${i.prod.name}</div>
        <div class="order-item-size">${i.size} · x${i.qty}</div>
      </div>
      <div class="order-item-price">${(i.prod.price*i.qty).toLocaleString('fr-FR')} CFA</div>
    </div>`).join('');
  document.getElementById('orderTotal').textContent = total.toLocaleString('fr-FR') + ' CFA';
  document.getElementById('checkoutPage').classList.add('open');
}

function closeCheckout() { document.getElementById('checkoutPage').classList.remove('open'); }
function selPay(btn, pay) { curPay = pay; document.querySelectorAll('.pay-opt-img').forEach(b => b.classList.remove('active')); btn.classList.add('active'); }

function submitOrder() {
  const name = document.getElementById('fName').value.trim();
  const phone = document.getElementById('fPhone').value.trim();
  const region = document.getElementById('fRegion').value.trim();
  const address = document.getElementById('fAddress').value.trim();
  if (!name||!phone||!region||!address) { showToast('Remplissez tous les champs'); return; }
  const subtotal = cart.reduce((s,i) => s+i.prod.price*i.qty, 0);
  const total = promoDiscount > 0 ? Math.round(subtotal * (1 - promoDiscount/100)) : subtotal;
  const promoLine = promoCode ? `\nCode promo: ${promoCode} (-${promoDiscount}%)` : '';
  const msg = encodeURIComponent(
    'NOUVELLE COMMANDE - NO EXCUSE\n\n' +
    'Nom: ' + name + '\nTel: ' + phone + '\nAdresse: ' + address + '\nPaiement: ' + curPay + promoLine + '\n\n' +
    'PRODUITS:\n' + cart.map(i=>`- ${i.prod.name} (${i.size}) x${i.qty} = ${(i.prod.price*i.qty).toLocaleString('fr-FR')} CFA`).join('\n') +
    '\n\nTOTAL: ' + total.toLocaleString('fr-FR') + ' CFA'
  );
  window.open('https://wa.me/'+WA+'?text='+msg,'_blank');
  cart=[]; promoCode=null; promoDiscount=0; syncCart(); closeCheckout(); showToast('Commande envoyée ! ✓');
}

function showToast(msg) { const t=document.getElementById('toast'); t.textContent=msg; t.classList.add('show'); setTimeout(()=>t.classList.remove('show'),2500); }
