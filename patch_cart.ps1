$file = "main.js"
$lines = Get-Content $file -Encoding UTF8

# Lines are 0-indexed in the array; 1478..1545 => indices 1477..1544
$before = $lines[0..1476]
$after  = $lines[1545..($lines.Length - 1)]

$newBlock = @'
    // --- TOAST NOTIFICATION HELPER ---
    function showToast(message, type, iconClass) {
        type = type || 'success';
        var icons = { success: 'fa-circle-check', error: 'fa-circle-xmark', info: 'fa-circle-info', wish: 'fa-heart' };
        var container = document.getElementById('toast-container');
        if (!container) return;
        var toast = document.createElement('div');
        toast.className = 'toast toast-' + type;
        toast.innerHTML = '<i class="fa-solid ' + (iconClass || icons[type] || icons.success) + ' toast-icon"></i><span>' + message + '</span>';
        container.appendChild(toast);
        setTimeout(function() { toast.classList.add('toast-out'); setTimeout(function() { toast.remove(); }, 350); }, 3000);
    }

    // --- CART UTILITIES ---
    function getCart() { return JSON.parse(localStorage.getItem('checkit_cart') || '[]'); }
    function saveCart(cart) { localStorage.setItem('checkit_cart', JSON.stringify(cart)); }

    function updateCartUI() {
        var cart = getCart();
        var badge = document.querySelector('.cart-count');
        if (badge) {
            badge.innerText = cart.length;
            badge.style.display = cart.length > 0 ? 'flex' : 'none';
        }
    }

    function renderCartPanel() {
        var cart = getCart();
        var body   = document.getElementById('cart-panel-body');
        var footer = document.getElementById('cart-panel-footer');
        if (!body || !footer) return;
        if (cart.length === 0) {
            body.innerHTML = '<div class="cart-panel-empty"><i class="fa-solid fa-bag-shopping"></i><p>장바구니가 비어있습니다.<br>서비스를 선택해 추가해 보세요.</p></div>';
            footer.innerHTML = '';
            return;
        }
        var html = '';
        cart.forEach(function(item, idx) {
            var price = (item.price + (item.unlimitedChanges ? 30 : 0)) * item.qty;
            html += '<div class="cart-item-card">' +
                '<button class="cart-item-remove" onclick="removeCartItem(' + idx + ')"><i class="fa-solid fa-trash-can"></i> 삭제</button>' +
                '<div class="cart-item-name">' + item.name + '</div>' +
                '<div class="cart-item-meta"><span><i class="fa-solid fa-user"></i> \u00d7' + item.qty + '\uba85</span>' +
                (item.unlimitedChanges ? '<span><i class="fa-solid fa-infinity"></i> \ubb34\uc81c\ud55c \ubcc0\uacbd</span>' : '') + '</div>' +
                '<div class="cart-item-price">$' + price.toFixed(2) + '</div></div>';
        });
        body.innerHTML = html;
        var total = cart.reduce(function(s, i) { return s + (i.price + (i.unlimitedChanges ? 30 : 0)) * i.qty; }, 0);
        footer.innerHTML = '<div class="cart-total-row"><span class="cart-total-label">\ud569\uacc4</span><span class="cart-total-value">$' + total.toFixed(2) + '</span></div>' +
            '<button class="btn-checkout-panel" onclick="document.getElementById(\'payment\').scrollIntoView({behavior:\'smooth\'}); closeCartPanel();">' +
            '<i class="fa-solid fa-lock"></i> \uacb0\uc81c\ud558\ub7ec \uac00\uae30</button>' +
            '<button class="btn-clear-cart" onclick="clearCart()">\uc7a5\ubc14\uad6c\ub2c8 \ube44\uc6b0\uae30</button>';
    }

    window.removeCartItem = function(idx) {
        var cart = getCart(); cart.splice(idx, 1); saveCart(cart);
        updateCartUI(); renderCartPanel();
        showToast('\ud56d\ubaa9\uc774 \uc0ad\uc81c\ub418\uc5c8\uc2b5\ub2c8\ub2e4.', 'error', 'fa-trash-can');
    };
    window.clearCart = function() {
        saveCart([]); updateCartUI(); renderCartPanel();
        showToast('\uc7a5\ubc14\uad6c\ub2c8\ub97c \ube44\uc6c0\uc2b5\ub2c8\ub2e4.', 'info');
    };
    function openCartPanel() {
        var p = document.getElementById('cart-panel'); if (p) p.classList.add('open');
        var o = document.getElementById('cart-overlay'); if (o) o.classList.add('open');
        renderCartPanel();
    }
    function closeCartPanel() {
        var p = document.getElementById('cart-panel'); if (p) p.classList.remove('open');
        var o = document.getElementById('cart-overlay'); if (o) o.classList.remove('open');
    }
    window.closeCartPanel = closeCartPanel;
    var cpClose = document.getElementById('cart-panel-close');
    if (cpClose) cpClose.addEventListener('click', closeCartPanel);
    var coOverlay = document.getElementById('cart-overlay');
    if (coOverlay) coOverlay.addEventListener('click', closeCartPanel);

    // --- ADD TO CART ---
    var addToCartBtn = document.getElementById('add-to-cart-btn');
    var wishlistBtn  = document.getElementById('wishlist-btn');
    var cartCountBadge = document.querySelector('.cart-count');

    if (addToCartBtn) {
        addToCartBtn.addEventListener('click', function() {
            var item = {
                id: 'total-safe-global-plan', name: 'Total-Safe Global Plan', price: 300,
                qty: parseInt((qtyInput ? qtyInput.value : 1) || 1),
                unlimitedChanges: optInCheckbox ? optInCheckbox.checked : false,
                timestamp: Date.now()
            };
            var cart = getCart(); cart.push(item); saveCart(cart);
            updateCartUI();
            showToast('\uc7a5\ubc14\uad6c\ub2c8\uc5d0 \ub2f4\uc558\uc2b5\ub2c8\ub2e4! \ud83d\udecd\ufe0f', 'success');
        });
    }

    // --- WISHLIST ---
    function getWishlist() { return JSON.parse(localStorage.getItem('checkit_wishlist') || '[]'); }
    function saveWishlist(w) { localStorage.setItem('checkit_wishlist', JSON.stringify(w)); }
    function syncWishlistIcon() {
        if (!wishlistBtn) return;
        var inWishlist = getWishlist().indexOf('total-safe-global-plan') > -1;
        var icon = wishlistBtn.querySelector('i');
        if (!icon) return;
        if (inWishlist) { icon.classList.remove('fa-regular'); icon.classList.add('fa-solid'); icon.style.color = '#e74c3c'; }
        else { icon.classList.remove('fa-solid'); icon.classList.add('fa-regular'); icon.style.color = ''; }
    }
    if (wishlistBtn) {
        syncWishlistIcon();
        wishlistBtn.addEventListener('click', function() {
            var wl = getWishlist(); var id = 'total-safe-global-plan'; var idx = wl.indexOf(id);
            if (idx > -1) { wl.splice(idx, 1); saveWishlist(wl); syncWishlistIcon(); showToast('\uc704\uc2dc\ub9ac\uc2a4\ud2b8\uc5d0\uc11c \uc81c\uac70\ub418\uc5c8\uc2b5\ub2c8\ub2e4.', 'wish', 'fa-heart-crack'); }
            else { wl.push(id); saveWishlist(wl); syncWishlistIcon(); showToast('\uc704\uc2dc\ub9ac\uc2a4\ud2b8\uc5d0 \ucd94\uac00\ub418\uc5c8\uc2b5\ub2c8\ub2e4! \u2764\ufe0f', 'wish', 'fa-heart'); }
        });
    }

    // --- HEADER ICON HANDLERS ---
    var cartNav = document.getElementById('cart-nav');
    var wishlistNav = document.getElementById('wishlist-nav');
    if (cartNav) { cartNav.addEventListener('click', function(e) { e.preventDefault(); openCartPanel(); }); }
    if (wishlistNav) {
        wishlistNav.addEventListener('click', function() {
            var wl = getWishlist();
            if (wl.length === 0) showToast('\uc704\uc2dc\ub9ac\uc2a4\ud2b8\uac00 \ube44\uc5b4\uc788\uc2b5\ub2c8\ub2e4.', 'info');
            else { showToast('\uc704\uc2dc\ub9ac\uc2a4\ud2b8 ' + wl.length + '\uac1c \ud56d\ubaa9 \uc800\uc7a5\ub428 \u2764\ufe0f', 'wish', 'fa-heart'); setTimeout(function() { var p = document.getElementById('payment'); if (p) p.scrollIntoView({ behavior: 'smooth' }); }, 500); }
        });
    }

    // Contact Form Toggle
'@

$combined = $before + $newBlock.Split("`n") + $after
$combined | Set-Content $file -Encoding UTF8

Write-Host "Done. Lines replaced."
