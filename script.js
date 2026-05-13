// ==========================================
// CONFIGURATION - À MODIFIER
// ==========================================
let CONFIG = {
  appsScriptUrl: ' ', // Remplacez par votre URL Apps Script
  shopName: 'Ma Boutique',
  shopSlogan: 'Mode & Style',
  shopLogo: '🛍️',
  heroSlogan: 'Les meilleures tendances à portée de main',
  adminPassword: 'admin123',
  deliveryPrice: 3000,
  googleSheetUrl: 'https://docs.google.com/spreadsheets/d/1rW5KyUG9ZgEgL6xNO91fMzLoBcZWp1JYmzjOSvEm1g0/edit?usp=sharing'
};

// Load config from localStorage
function loadConfig() {
  const saved = localStorage.getItem('shopConfig');
  if (saved) CONFIG = { ...CONFIG, ...JSON.parse(saved) };
  applyConfig();
}

function applyConfig() {
  document.getElementById('shopName').textContent = CONFIG.shopName;
  document.getElementById('shopSlogan').textContent = CONFIG.shopSlogan;
  document.getElementById('heroSlogan').textContent = CONFIG.heroSlogan;
  document.title = CONFIG.shopName;

  const logo = document.getElementById('logoDisplay');
  if (CONFIG.shopLogo && CONFIG.shopLogo.startsWith('http')) {
    logo.innerHTML = `<img src="${CONFIG.shopLogo}" style="width:100%;height:100%;object-fit:cover;border-radius:50%;" onerror="this.parentElement.textContent='🛍️'">`;
  } else {
    logo.textContent = CONFIG.shopLogo || '🛍️';
  }
}

// ==========================================
// DEMO PRODUCTS DATA
// ==========================================
let products = [
  { id: 1, name: 'Robe Florale Été', category: 'Vêtements', price: 85000, promoPrice: 60000, isPromo: true, isBestseller: true, stock: 15, sold: 43, sizes: ['XS','S','M','L','XL'], img: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=400&h=400&fit=crop', desc: 'Belle robe florale légère, parfaite pour l\'été.' },
  { id: 2, name: 'Sneakers Urban', category: 'Chaussures', price: 120000, promoPrice: null, isPromo: false, isBestseller: true, stock: 8, sold: 67, sizes: ['38','39','40','41','42','43'], img: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop', desc: 'Sneakers confortables pour un look urbain.' },
  { id: 3, name: 'Chemise Lin Premium', category: 'Vêtements', price: 65000, promoPrice: 49000, isPromo: true, isBestseller: false, stock: 20, sold: 28, sizes: ['S','M','L','XL','XXL'], img: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=400&h=400&fit=crop', desc: 'Chemise en lin naturel, fraîche et élégante.' },
  { id: 4, name: 'Sac à Main Cuir', category: 'Accessoires', price: 175000, promoPrice: null, isPromo: false, isBestseller: true, stock: 5, sold: 32, sizes: ['Unique'], img: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=400&h=400&fit=crop', desc: 'Sac à main en cuir véritable, spacieux et élégant.' },
  { id: 5, name: 'Jean Slim Stretch', category: 'Vêtements', price: 95000, promoPrice: 75000, isPromo: true, isBestseller: false, stock: 25, sold: 55, sizes: ['34','36','38','40','42'], img: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=400&h=400&fit=crop', desc: 'Jean slim stretch confortable et tendance.' },
  { id: 6, name: 'Montre Élégante', category: 'Accessoires', price: 250000, promoPrice: null, isPromo: false, isBestseller: true, stock: 3, sold: 18, sizes: ['Unique'], img: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop', desc: 'Montre classique avec bracelet en cuir.' },
  { id: 7, name: 'T-shirt Graphique', category: 'Vêtements', price: 35000, promoPrice: 25000, isPromo: true, isBestseller: false, stock: 30, sold: 89, sizes: ['XS','S','M','L','XL','XXL'], img: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop', desc: 'T-shirt en coton avec design graphique unique.' },
  { id: 8, name: 'Sandales Bohème', category: 'Chaussures', price: 55000, promoPrice: null, isPromo: false, isBestseller: false, stock: 12, sold: 24, sizes: ['36','37','38','39','40'], img: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=400&h=400&fit=crop', desc: 'Sandales légères style bohème.' }
];

let cart = [];
let orders = [];
let currentFilter = '';
let currentSection = 'all';

// Load from localStorage
function loadData() {
  const savedProducts = localStorage.getItem('shopProducts');
  if (savedProducts) products = JSON.parse(savedProducts);
  const savedOrders = localStorage.getItem('shopOrders');
  if (savedOrders) orders = JSON.parse(savedOrders);
  const savedCart = localStorage.getItem('shopCart');
  if (savedCart) cart = JSON.parse(savedCart);
}

function saveData() {
  localStorage.setItem('shopProducts', JSON.stringify(products));
  localStorage.setItem('shopOrders', JSON.stringify(orders));
  localStorage.setItem('shopCart', JSON.stringify(cart));
}

// ==========================================
// RENDER PRODUCTS
// ==========================================
function renderProductCard(p) {
  const displayPrice = p.promoPrice || p.price;
  const hasPromo = p.promoPrice && p.promoPrice < p.price;
  const discount = hasPromo ? Math.round((1 - p.promoPrice / p.price) * 100) : 0;

  let badge = '';
  if (p.isPromo && hasPromo) badge = `<div class="promo-badge">-${discount}%</div>`;
  else if (p.isBestseller) badge = `<div class="bestseller-badge">⭐ Best</div>`;

  const sizesHtml = p.sizes && p.sizes.length > 0
    ? `<div class="product-sizes">${p.sizes.slice(0,4).map(s => `<span class="size-chip">${s}</span>`).join('')}${p.sizes.length > 4 ? `<span class="size-chip">+${p.sizes.length-4}</span>` : ''}</div>`
    : '';

  const imgHtml = p.img
    ? `<img src="${p.img}" alt="${p.name}" style="width:100%;height:100%;object-fit:cover;" onerror="this.style.display='none';this.parentElement.innerHTML+='🛍️'">`
    : '🛍️';

  return `
    <div class="product-card" onclick="openProductDetail(${p.id})">
      <div class="product-img">
        ${badge}
        ${imgHtml}
      </div>
      <div class="product-info">
        <div class="product-category">${p.category}</div>
        <div class="product-name">${p.name}</div>
        <div class="product-price-row">
          <span class="product-price">${formatPrice(displayPrice)}</span>
          ${hasPromo ? `<span class="product-price-old">${formatPrice(p.price)}</span>` : ''}
        </div>
        ${sizesHtml}
        <button class="btn-add-cart" onclick="event.stopPropagation(); quickAddToCart(${p.id})">
          🛒 Ajouter au panier
        </button>
      </div>
    </div>
  `;
}

function renderAllProducts() {
  const filtered = currentFilter ? products.filter(p => p.category === currentFilter) : products;

  const promos = filtered.filter(p => p.isPromo && p.promoPrice);
  const bestsellers = filtered.filter(p => p.isBestseller);

  document.getElementById('promoGrid').innerHTML = promos.length > 0
    ? promos.map(renderProductCard).join('')
    : '<div class="empty-state"><div class="icon">🏷️</div><h3>Aucune promotion</h3></div>';

  document.getElementById('bestsellerGrid').innerHTML = bestsellers.length > 0
    ? bestsellers.map(renderProductCard).join('')
    : '<div class="empty-state"><div class="icon">⭐</div><h3>Aucun bestseller</h3></div>';

  document.getElementById('allGrid').innerHTML = filtered.length > 0
    ? filtered.map(renderProductCard).join('')
    : '<div class="empty-state"><div class="icon">🛍️</div><h3>Aucun produit</h3></div>';
}

function showSection(section, btn) {
  currentSection = section;
  document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
  if (btn) btn.classList.add('active');

  document.getElementById('promoSection').style.display = (section === 'all' || section === 'promo') ? 'block' : 'none';
  document.getElementById('bestsellerSection').style.display = (section === 'all' || section === 'bestseller') ? 'block' : 'none';
  document.getElementById('allSection').style.display = (section === 'all' || section === 'new') ? 'block' : 'none';

  document.getElementById('searchSection').style.display = 'none';
  document.getElementById('productSection').style.display = 'block';
  document.getElementById('searchInput').value = '';

  renderAllProducts();
}

function filterCategory(cat, btn) {
  currentFilter = cat;
  document.querySelectorAll('.filter-chip').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  renderAllProducts();
}

function onSearch(query) {
  if (!query.trim()) {
    document.getElementById('searchSection').style.display = 'none';
    document.getElementById('productSection').style.display = 'block';
    return;
  }
  const q = query.toLowerCase();
  const results = products.filter(p =>
    p.name.toLowerCase().includes(q) ||
    p.category.toLowerCase().includes(q) ||
    (p.desc && p.desc.toLowerCase().includes(q))
  );

  document.getElementById('searchSection').style.display = 'block';
  document.getElementById('productSection').style.display = 'none';
  document.getElementById('searchTitle').textContent = `Résultats pour "${query}" (${results.length})`;
  document.getElementById('searchGrid').innerHTML = results.length > 0
    ? results.map(renderProductCard).join('')
    : `<div class="empty-state"><div class="icon">🔍</div><h3>Aucun résultat pour "${query}"</h3><p>Essayez un autre terme de recherche.</p></div>`;
}

// ==========================================
// PRODUCT DETAIL
// ==========================================
let selectedSize = '';
let currentProduct = null;

function openProductDetail(id) {
  currentProduct = products.find(p => p.id === id);
  if (!currentProduct) return;
  selectedSize = currentProduct.sizes && currentProduct.sizes.length === 1 ? currentProduct.sizes[0] : '';

  const p = currentProduct;
  const hasPromo = p.promoPrice && p.promoPrice < p.price;
  const discount = hasPromo ? Math.round((1 - p.promoPrice / p.price) * 100) : 0;

  document.getElementById('productModalTitle').textContent = p.name;
  document.getElementById('productModalBody').innerHTML = `
    <div class="product-detail-grid">
      <div class="product-detail-img">
        ${p.img ? `<img src="${p.img}" alt="${p.name}" onerror="this.style.display='none';this.parentElement.textContent='🛍️'">` : '🛍️'}
      </div>
      <div>
        <div class="product-category" style="margin-bottom:4px;">${p.category}</div>
        <h2 style="font-family:'Playfair Display',serif;font-size:1.4rem;margin-bottom:12px;">${p.name}</h2>
        <div class="product-price-row" style="margin-bottom:16px;">
          <span class="product-price" style="font-size:1.4rem;">${formatPrice(p.promoPrice || p.price)}</span>
          ${hasPromo ? `<span class="product-price-old">${formatPrice(p.price)}</span> <span class="promo-badge" style="position:static;">-${discount}%</span>` : ''}
        </div>
        ${p.desc ? `<p style="color:var(--gray);font-size:0.9rem;line-height:1.6;margin-bottom:16px;">${p.desc}</p>` : ''}
        ${p.sizes && p.sizes.length > 0 ? `
          <div style="margin-bottom:16px;">
            <div class="form-label">Choisir la taille :</div>
            <div class="size-selector" id="sizeSelector">
              ${p.sizes.map(s => `<button class="size-btn ${s === selectedSize ? 'selected' : ''}" onclick="selectSize('${s}', this)">${s}</button>`).join('')}
            </div>
          </div>
        ` : ''}
        <div style="display:flex;align-items:center;gap:8px;margin-bottom:16px;font-size:0.85rem;color:var(--gray);">
          <span class="stock-indicator ${p.stock > 10 ? 'in' : p.stock > 0 ? 'low' : 'out'}"></span>
          ${p.stock > 10 ? 'En stock' : p.stock > 0 ? `Plus que ${p.stock} en stock !` : 'Rupture de stock'}
        </div>
        <button class="btn-full" style="margin-top:0;" onclick="addToCartFromDetail()" ${p.stock === 0 ? 'disabled' : ''}>
          🛒 Ajouter au panier
        </button>
      </div>
    </div>
  `;

  openModal('productModal');
}

function selectSize(size, btn) {
  selectedSize = size;
  document.querySelectorAll('#sizeSelector .size-btn').forEach(b => b.classList.remove('selected'));
  btn.classList.add('selected');
}

function addToCartFromDetail() {
  if (!currentProduct) return;
  if (currentProduct.sizes && currentProduct.sizes.length > 1 && !selectedSize) {
    showToast('⚠️ Veuillez choisir une taille', 'error');
    return;
  }
  addToCart(currentProduct.id, selectedSize || 'Unique', 1);
  closeProductModal();
}

function quickAddToCart(id) {
  const p = products.find(x => x.id === id);
  if (!p) return;
  if (p.sizes && p.sizes.length > 1) {
    openProductDetail(id);
    return;
  }
  addToCart(id, p.sizes && p.sizes.length === 1 ? p.sizes[0] : 'Unique', 1);
}

function closeProductModal() { closeModal('productModal'); }

// ==========================================
// CART
// ==========================================
function addToCart(productId, size, qty = 1) {
  const p = products.find(x => x.id === productId);
  if (!p) return;

  const key = `${productId}-${size}`;
  const existing = cart.find(c => c.key === key);
  if (existing) {
    existing.qty += qty;
  } else {
    cart.push({ key, productId, size, qty, name: p.name, price: p.promoPrice || p.price, img: p.img });
  }
  updateCartBadge();
  saveData();
  showToast(`✅ "${p.name}" ajouté au panier`, 'success');
}

function updateCartBadge() {
  const total = cart.reduce((s, c) => s + c.qty, 0);
  document.getElementById('cartBadge').textContent = total;
}

function openCart() {
  renderCart();
  openModal('cartModal');
}

function closeCart() { closeModal('cartModal'); }

function renderCart() {
  const body = document.getElementById('cartBody');
  if (cart.length === 0) {
    body.innerHTML = `<div class="empty-state"><div class="icon">🛒</div><h3>Votre panier est vide</h3><p>Ajoutez des produits pour continuer.</p></div>`;
    return;
  }

  const subtotal = cart.reduce((s, c) => s + c.price * c.qty, 0);
  const delivery = CONFIG.deliveryPrice;
  const total = subtotal + delivery;

  body.innerHTML = `
    <div class="cart-items">
      ${cart.map(item => `
        <div class="cart-item">
          <div class="cart-item-img">
            ${item.img ? `<img src="${item.img}" alt="" onerror="this.style.display='none'">` : '🛍️'}
          </div>
          <div class="cart-item-info">
            <div class="cart-item-name">${item.name}</div>
            <div class="cart-item-size">Taille: ${item.size}</div>
            <div class="cart-item-controls">
              <button class="qty-btn" onclick="changeQty('${item.key}', -1)">−</button>
              <span class="qty-display">${item.qty}</span>
              <button class="qty-btn" onclick="changeQty('${item.key}', 1)">+</button>
            </div>
          </div>
          <div style="display:flex;flex-direction:column;align-items:flex-end;gap:8px;">
            <span class="cart-item-price">${formatPrice(item.price * item.qty)}</span>
            <button class="cart-remove" onclick="removeFromCart('${item.key}')">🗑️</button>
          </div>
        </div>
      `).join('')}
    </div>
    <div class="cart-summary">
      <div class="cart-summary-row"><span>Sous-total</span><span>${formatPrice(subtotal)}</span></div>
      <div class="cart-summary-row"><span>Livraison</span><span>${formatPrice(delivery)}</span></div>
      <div class="cart-summary-row total"><span>Total</span><span>${formatPrice(total)}</span></div>
    </div>
    <button class="btn-full" onclick="closeCart(); openCheckout()">✅ Commander maintenant</button>
    <button class="btn-secondary" onclick="closeCart()">Continuer mes achats</button>
  `;
}

function changeQty(key, delta) {
  const item = cart.find(c => c.key === key);
  if (!item) return;
  item.qty = Math.max(1, item.qty + delta);
  saveData();
  renderCart();
  updateCartBadge();
}

function removeFromCart(key) {
  cart = cart.filter(c => c.key !== key);
  saveData();
  renderCart();
  updateCartBadge();
}

// ==========================================
// CHECKOUT
// ==========================================
let checkoutStep = 1;
let checkoutData = {};

function openCheckout() {
  if (cart.length === 0) {
    showToast('⚠️ Votre panier est vide', 'error');
    return;
  }
  checkoutStep = 1;
  checkoutData = {};
  renderCheckout();
  openModal('checkoutModal');
}

function closeCheckout() { closeModal('checkoutModal'); }

function renderCheckout() {
  const body = document.getElementById('checkoutBody');
  const subtotal = cart.reduce((s, c) => s + c.price * c.qty, 0);
  const delivery = CONFIG.deliveryPrice;
  const total = subtotal + delivery;

  if (checkoutStep === 1) {
    body.innerHTML = `
      <div class="steps-indicator">
        <div class="step active">1. Coordonnées</div>
        <div class="step">2. Paiement</div>
        <div class="step">3. Confirmation</div>
      </div>
      <div class="section-divider">👤 Vos coordonnées</div>
      <div class="form-group">
        <label class="form-label">Nom complet *</label>
        <input type="text" class="form-input" id="c-name" placeholder="Ex: Jean Dupont" value="${checkoutData.name || ''}">
      </div>
      <div class="form-group">
        <label class="form-label">Numéro de téléphone *</label>
        <input type="tel" class="form-input" id="c-phone" placeholder="034 00 000 00" value="${checkoutData.phone || ''}">
      </div>
      <div class="form-group">
        <label class="form-label">Adresse de livraison *</label>
        <textarea class="form-textarea" id="c-address" placeholder="Quartier, rue, numéro...">${checkoutData.address || ''}</textarea>
      </div>
      <div class="section-divider">💳 Mode de paiement</div>
      <div class="payment-options">
        <div class="payment-option ${checkoutData.payMethod === 'orange' ? 'selected' : ''}" onclick="selectPayment('orange', this)">
          <div class="p-icon">🟠</div>
          <div class="p-name">Orange Money</div>
        </div>
        <div class="payment-option ${checkoutData.payMethod === 'mvola' ? 'selected' : ''}" onclick="selectPayment('mvola', this)">
          <div class="p-icon">🔴</div>
          <div class="p-name">MVola</div>
        </div>
        <div class="payment-option ${checkoutData.payMethod === 'espece' ? 'selected' : ''}" onclick="selectPayment('espece', this)">
          <div class="p-icon">💵</div>
          <div class="p-name">En espèce</div>
        </div>
      </div>
      <div class="alert info" style="margin-top:16px;">
        Total à payer: <strong>${formatPrice(total)}</strong> (dont ${formatPrice(delivery)} de livraison)
      </div>
      <button class="btn-full" onclick="nextCheckoutStep()">Suivant →</button>
    `;
  } else if (checkoutStep === 2) {
    const isCash = checkoutData.payMethod === 'espece';
    body.innerHTML = `
      <div class="steps-indicator">
        <div class="step done">✓ Coordonnées</div>
        <div class="step active">2. Paiement</div>
        <div class="step">3. Confirmation</div>
      </div>

      ${isCash ? `
        <div class="alert info">
          <strong>💵 Paiement en espèce sélectionné</strong><br>
          Votre commande sera envoyée directement au vendeur. Le paiement s'effectuera à la livraison.
        </div>
        <div class="section-divider">📦 Récapitulatif commande</div>
        ${cart.map(c => `<div class="flex-between" style="padding:8px 0;border-bottom:1px solid var(--border);font-size:0.9rem;">
          <span>${c.name} (${c.size}) ×${c.qty}</span>
          <strong>${formatPrice(c.price * c.qty)}</strong>
        </div>`).join('')}
        <div class="flex-between" style="padding:12px 0;font-weight:700;font-size:1.05rem;">
          <span>Total</span>
          <span style="color:var(--accent);">${formatPrice(total)}</span>
        </div>
      ` : `
        <div class="alert info">
          <strong>📱 Envoyez ${formatPrice(total)} via ${checkoutData.payMethod === 'orange' ? 'Orange Money' : 'MVola'}</strong><br>
          Numéro du vendeur: <strong>034 XX XXX XX</strong> — puis renseignez votre Trans ID ci-dessous.
        </div>
        <div class="payment-proof">
          <h4>🧾 Preuve de paiement</h4>
          <div class="form-group">
            <label class="form-label">Votre numéro ${checkoutData.payMethod === 'orange' ? 'Orange Money' : 'MVola'} *</label>
            <input type="tel" class="form-input" id="pay-phone" placeholder="034 XX XXX XX" value="${checkoutData.payPhone || ''}">
          </div>
          <div class="form-group" style="margin-bottom:0;">
            <label class="form-label">Transaction ID (Trans ID) *</label>
            <input type="text" class="form-input" id="pay-transid" placeholder="Ex: MMTI123456789" value="${checkoutData.transId || ''}">
            <small class="text-muted">Trouvez ce code dans votre SMS de confirmation de paiement</small>
          </div>
        </div>
        <div class="section-divider">📦 Récapitulatif</div>
        ${cart.map(c => `<div class="flex-between" style="padding:6px 0;font-size:0.88rem;border-bottom:1px solid var(--border);">
          <span>${c.name} (${c.size}) ×${c.qty}</span>
          <strong>${formatPrice(c.price * c.qty)}</strong>
        </div>`).join('')}
        <div class="flex-between" style="padding:10px 0;font-weight:700;font-size:1.05rem;">
          <span>Total</span>
          <span style="color:var(--accent);">${formatPrice(total)}</span>
        </div>
      `}
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-top:8px;">
        <button class="btn-secondary" style="margin:0;" onclick="checkoutStep=1;renderCheckout()">← Retour</button>
        <button class="btn-full" style="margin:0;" onclick="submitOrder()">✅ Confirmer</button>
      </div>
    `;
  } else if (checkoutStep === 3) {
    body.innerHTML = `
      <div class="steps-indicator">
        <div class="step done">✓ Coordonnées</div>
        <div class="step done">✓ Paiement</div>
        <div class="step active">✓ Confirmé!</div>
      </div>
      <div class="success-screen">
        <div class="checkmark">✓</div>
        <h3>Commande envoyée !</h3>
        <p>Merci <strong>${checkoutData.name}</strong> pour votre commande.<br>
        Le vendeur a reçu vos informations et vous contactera au <strong>${checkoutData.phone}</strong> très bientôt.</p>
        ${checkoutData.payMethod !== 'espece' ? `<p style="margin-top:12px;">Trans ID: <strong>${checkoutData.transId}</strong></p>` : ''}
      </div>
      <button class="btn-full" onclick="closeCheckout()">Retour à la boutique</button>
    `;
  }
}

function selectPayment(method, el) {
  checkoutData.payMethod = method;
  document.querySelectorAll('.payment-option').forEach(e => e.classList.remove('selected'));
  el.classList.add('selected');
}

function nextCheckoutStep() {
  const name = document.getElementById('c-name')?.value.trim();
  const phone = document.getElementById('c-phone')?.value.trim();
  const address = document.getElementById('c-address')?.value.trim();

  if (!name || !phone || !address) {
    showToast('⚠️ Veuillez remplir tous les champs obligatoires', 'error');
    return;
  }
  if (!checkoutData.payMethod) {
    showToast('⚠️ Veuillez choisir un mode de paiement', 'error');
    return;
  }

  checkoutData.name = name;
  checkoutData.phone = phone;
  checkoutData.address = address;
  checkoutStep = 2;
  renderCheckout();
}

async function submitOrder() {
  if (checkoutData.payMethod !== 'espece') {
    const payPhone = document.getElementById('pay-phone')?.value.trim();
    const transId = document.getElementById('pay-transid')?.value.trim();
    if (!payPhone || !transId) {
      showToast('⚠️ Veuillez renseigner le numéro et le Trans ID', 'error');
      return;
    }
    checkoutData.payPhone = payPhone;
    checkoutData.transId = transId;
  }

  const subtotal = cart.reduce((s, c) => s + c.price * c.qty, 0);
  const delivery = CONFIG.deliveryPrice;
  const total = subtotal + delivery;

  const order = {
    id: Date.now(),
    date: new Date().toLocaleDateString('fr-FR'),
    ...checkoutData,
    items: [...cart],
    subtotal,
    delivery,
    total
  };

  orders.push(order);

  // Update sold count
  cart.forEach(ci => {
    const p = products.find(x => x.id === ci.productId);
    if (p) {
      p.sold = (p.sold || 0) + ci.qty;
      p.stock = Math.max(0, (p.stock || 0) - ci.qty);
    }
  });

  cart = [];
  updateCartBadge();
  saveData();

  // Send to Google Sheets if configured
  if (CONFIG.appsScriptUrl && CONFIG.appsScriptUrl !== 'VOTRE_APPS_SCRIPT_URL') {
    try {
      await fetch(CONFIG.appsScriptUrl, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'addOrder', data: order })
      });
    } catch (e) { console.warn('Google Sheets sync failed:', e); }
  }

  checkoutStep = 3;
  renderCheckout();
}

// ==========================================
// ADMIN
// ==========================================
function openAdminLogin() { openModal('adminLoginModal'); }

function adminLogin() {
  const pass = document.getElementById('adminPass').value;
  if (pass === CONFIG.adminPassword) {
    closeModal('adminLoginModal');
    document.getElementById('adminPass').value = '';
    openAdminDashboard();
  } else {
    showToast('❌ Mot de passe incorrect', 'error');
  }
}

function openAdminDashboard() {
  renderAdminDashboard();
  document.getElementById('adminDashboard').classList.add('open');
}

function closeAdmin() {
  document.getElementById('adminDashboard').classList.remove('open');
}

function switchAdminTab(tab, btn) {
  document.querySelectorAll('.admin-tab').forEach(b => b.classList.remove('active'));
  document.querySelectorAll('.admin-panel').forEach(p => p.classList.remove('active'));
  btn.classList.add('active');
  document.getElementById(`panel-${tab}`).classList.add('active');

  if (tab === 'overview') renderOverview();
  if (tab === 'orders') renderOrders();
  if (tab === 'stock') renderStock();
  if (tab === 'settings') loadSettings();
}

function renderAdminDashboard() {
  renderOverview();
  renderOrders();
  renderStock();
  loadSettings();
}

function renderOverview() {
  const totalRevenue = orders.reduce((s, o) => s + o.total, 0);
  const totalOrders = orders.length;
  const totalProducts = products.length;
  const pendingOrders = orders.filter(o => o.payMethod === 'espece').length;

  document.getElementById('statsGrid').innerHTML = `
    <div class="stat-card">
      <div class="stat-label">Chiffre d'affaires</div>
      <div class="stat-value">${formatPrice(totalRevenue)}</div>
    </div>
    <div class="stat-card gold">
      <div class="stat-label">Commandes totales</div>
      <div class="stat-value">${totalOrders}</div>
    </div>
    <div class="stat-card green">
      <div class="stat-label">Produits</div>
      <div class="stat-value">${totalProducts}</div>
    </div>
    <div class="stat-card">
      <div class="stat-label">En espèce en attente</div>
      <div class="stat-value">${pendingOrders}</div>
    </div>
  `;

  const recent = [...orders].reverse().slice(0, 10);
  document.getElementById('recentOrdersBody').innerHTML = recent.length > 0
    ? recent.map(o => `
        <tr>
          <td>#${o.id.toString().slice(-5)}</td>
          <td>${o.name}</td>
          <td><strong>${formatPrice(o.total)}</strong></td>
          <td>${payLabel(o.payMethod)}</td>
          <td><span class="status-badge ${o.payMethod === 'espece' ? 'cash' : 'confirmed'}">${o.payMethod === 'espece' ? 'Espèce' : 'Mobile'}</span></td>
        </tr>
      `).join('')
    : '<tr><td colspan="5" style="text-align:center;color:var(--gray);padding:20px;">Aucune commande</td></tr>';
}

function renderOrders() {
  const all = [...orders].reverse();
  document.getElementById('allOrdersBody').innerHTML = all.length > 0
    ? all.map(o => `
        <tr>
          <td>#${o.id.toString().slice(-5)}</td>
          <td>${o.date}</td>
          <td><strong>${o.name}</strong></td>
          <td>${o.phone}</td>
          <td>${o.address}</td>
          <td>${payLabel(o.payMethod)}</td>
          <td>${o.transId || '—'}</td>
          <td><strong>${formatPrice(o.total)}</strong></td>
          <td>${o.items ? o.items.map(i => `${i.name}(${i.size})×${i.qty}`).join(', ') : '—'}</td>
        </tr>
      `).join('')
    : '<tr><td colspan="9" style="text-align:center;color:var(--gray);padding:20px;">Aucune commande enregistrée</td></tr>';
}

function renderStock() {
  document.getElementById('deliveryPrice').value = CONFIG.deliveryPrice;
  document.getElementById('stockTableBody').innerHTML = products.map(p => `
    <tr>
      <td><strong>${p.name}</strong></td>
      <td>${p.category}</td>
      <td>${formatPrice(p.promoPrice || p.price)}</td>
      <td>
        <input type="number" value="${p.stock}" min="0"
          onchange="updateStock(${p.id}, this.value)"
          style="width:70px;padding:4px 8px;border:1px solid var(--border);border-radius:6px;font-family:'DM Sans',sans-serif;">
      </td>
      <td>${p.sold || 0}</td>
      <td><span class="stock-indicator ${p.stock > 10 ? 'in' : p.stock > 0 ? 'low' : 'out'}"></span>${p.stock > 10 ? 'OK' : p.stock > 0 ? 'Bas' : 'Épuisé'}</td>
      <td>
        <button onclick="deleteProduct(${p.id})" style="background:var(--accent);color:white;border:none;border-radius:6px;padding:4px 10px;cursor:pointer;font-size:0.8rem;">Suppr.</button>
      </td>
    </tr>
  `).join('');
}

function updateStock(id, val) {
  const p = products.find(x => x.id === id);
  if (p) {
    p.stock = parseInt(val) || 0;
    saveData();
  }
}

function deleteProduct(id) {
  if (!confirm('Supprimer ce produit ?')) return;
  products = products.filter(p => p.id !== id);
  saveData();
  renderStock();
  renderAllProducts();
  showToast('Produit supprimé', 'success');
}

function saveDeliveryPrice() {
  const val = parseInt(document.getElementById('deliveryPrice').value) || 0;
  CONFIG.deliveryPrice = val;
  localStorage.setItem('shopConfig', JSON.stringify(CONFIG));
  showToast('Prix de livraison mis à jour : ' + formatPrice(val), 'success');
}

function addProduct() {
  const name = document.getElementById('p-name').value.trim();
  const price = parseFloat(document.getElementById('p-price').value);

  if (!name || !price) {
    showToast('⚠️ Nom et prix requis', 'error');
    return;
  }

  const promoVal = document.getElementById('p-promo').value;
  const sizesRaw = document.getElementById('p-sizes').value;

  const newProduct = {
    id: Date.now(),
    name,
    category: document.getElementById('p-category').value,
    price,
    promoPrice: promoVal ? parseFloat(promoVal) : null,
    isPromo: document.getElementById('p-promo-flag').checked,
    isBestseller: document.getElementById('p-bestseller').checked,
    stock: parseInt(document.getElementById('p-stock').value) || 10,
    sold: 0,
    sizes: sizesRaw ? sizesRaw.split(',').map(s => s.trim()).filter(Boolean) : [],
    img: document.getElementById('p-img').value.trim(),
    desc: document.getElementById('p-desc').value.trim()
  };

  products.push(newProduct);
  saveData();
  renderAllProducts();

  // Clear form
  ['p-name','p-price','p-promo','p-sizes','p-img','p-desc'].forEach(id => document.getElementById(id).value = '');
  document.getElementById('p-promo-flag').checked = false;
  document.getElementById('p-bestseller').checked = false;

  showToast(`✅ "${name}" ajouté avec succès!`, 'success');

  // Sync to Google Sheets
  syncProductToSheets(newProduct);
}

async function syncProductToSheets(product) {
  if (!CONFIG.appsScriptUrl || CONFIG.appsScriptUrl === 'VOTRE_APPS_SCRIPT_URL') return;
  try {
    await fetch(CONFIG.appsScriptUrl, {
      method: 'POST',
      mode: 'no-cors',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'addProduct', data: product })
    });
  } catch (e) { console.warn('Sheets sync failed'); }
}

function loadSettings() {
  document.getElementById('s-name').value = CONFIG.shopName;
  document.getElementById('s-slogan').value = CONFIG.shopSlogan;
  document.getElementById('s-logo').value = CONFIG.shopLogo;
  document.getElementById('s-hero').value = CONFIG.heroSlogan;
  document.getElementById('s-script').value = CONFIG.appsScriptUrl !== 'VOTRE_APPS_SCRIPT_URL' ? CONFIG.appsScriptUrl : '';
}

function saveSettings() {
  const newName = document.getElementById('s-name').value.trim();
  const newSlogan = document.getElementById('s-slogan').value.trim();
  const newLogo = document.getElementById('s-logo').value.trim();
  const newHero = document.getElementById('s-hero').value.trim();
  const newPass = document.getElementById('s-pass').value;
  const newScript = document.getElementById('s-script').value.trim();

  if (newName) CONFIG.shopName = newName;
  if (newSlogan) CONFIG.shopSlogan = newSlogan;
  if (newLogo) CONFIG.shopLogo = newLogo;
  if (newHero) CONFIG.heroSlogan = newHero;
  if (newPass) CONFIG.adminPassword = newPass;
  if (newScript) CONFIG.appsScriptUrl = newScript;

  localStorage.setItem('shopConfig', JSON.stringify(CONFIG));
  applyConfig();
  showToast('✅ Paramètres sauvegardés !', 'success');
}

function openGoogleSheet() {
  if (CONFIG.googleSheetUrl && CONFIG.googleSheetUrl !== 'VOTRE_GOOGLE_SHEET_URL') {
    window.open(CONFIG.googleSheetUrl, '_blank');
  } else {
    showToast('⚠️ URL Google Sheet non configurée dans les paramètres', 'error');
  }
}

// ==========================================
// UTILITIES
// ==========================================
function formatPrice(n) {
  return new Intl.NumberFormat('fr-MG', { minimumFractionDigits: 0 }).format(n) + ' Ar';
}

function payLabel(method) {
  return { orange: '🟠 Orange Money', mvola: '🔴 MVola', espece: '💵 Espèce' }[method] || method;
}

function openModal(id) {
  document.getElementById(id).classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeModal(id) {
  document.getElementById(id).classList.remove('open');
  document.body.style.overflow = '';
}

function showToast(msg, type = 'success') {
  const container = document.getElementById('toastContainer');
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.textContent = msg;
  container.appendChild(toast);
  setTimeout(() => { toast.style.opacity = '0'; toast.style.transform = 'translateX(100%)'; setTimeout(() => toast.remove(), 300); }, 3000);
}

function scrollTop() { window.scrollTo({ top: 0, behavior: 'smooth' }); }

// Close modals on overlay click
document.querySelectorAll('.modal-overlay').forEach(overlay => {
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) {
      overlay.classList.remove('open');
      document.body.style.overflow = '';
    }
  });
});

// ==========================================
// INIT
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
  loadConfig();
  loadData();
  updateCartBadge();
  renderAllProducts();
});
