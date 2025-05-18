// Cart page logic
function getCart() {
  return JSON.parse(localStorage.getItem('cart') || '[]');
}
function setCart(cart) {
  localStorage.setItem('cart', JSON.stringify(cart));
}
function updateCartBadge() {
  const cart = getCart();
  let count = cart.reduce((sum, item) => sum + item.qty, 0);
  const badge = document.getElementById('cart-badge');
  if (badge) badge.textContent = count;
}
// Navbar tab switching
window.addEventListener('DOMContentLoaded', function() {
  const navLinks = document.querySelectorAll('.nav-links li');
  navLinks.forEach(link => {
    link.addEventListener('click', function() {
      navLinks.forEach(l => l.classList.remove('active'));
      this.classList.add('active');
    });
  });
  // Set Shop tab as active on cart page
  const shopTab = document.getElementById('nav-shop');
  if (shopTab) shopTab.classList.add('active');
});
function renderCart() {
  const cart = getCart();
  const tbody = document.querySelector('#cart-table tbody');
  tbody.innerHTML = '';
  if (cart.length === 0) {
    const row = document.createElement('tr');
    row.innerHTML = `<td colspan="5" style="text-align:center; padding: 48px 0; color:#5a2323; font-size:1.3rem; font-family:'Playfair Display',serif;">
      Your cart is empty<br><br>
      <a href="index.html" style="display:inline-block;padding:10px 32px;background:#5a2323;color:#fff;border-radius:4px;font-size:1.1rem;font-family:'Playfair Display',serif;text-decoration:none;margin-top:18px;">Go to Shop</a>
    </td>`;
    tbody.appendChild(row);
    document.getElementById('cart-subtotal').textContent = '0 KD';
    document.getElementById('cart-total').textContent = '0 KD';
    // Remove Proceed to Checkout button if cart is empty
    let checkoutBtn = document.getElementById('proceed-checkout-btn');
    if (checkoutBtn) checkoutBtn.remove();
    return;
  }
  let subtotal = 0;
  cart.forEach((item, idx) => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td><button class="cart-remove" data-idx="${idx}">&times;</button></td>
      <td><img src="${item.img}" alt="${item.name}"> ${item.name}</td>
      <td>KD ${item.price}</td>
      <td><div class="qty-controls-col" style="flex-direction: row; align-items: center; justify-content: center; gap: 10px;">
        <span class="cart-qty">${item.qty}</span>
        <div class="qty-arrows-group" style="display: flex; flex-direction: column; gap: 2px; margin-left: 6px;">
          <span class="qty-arrow qty-up" data-idx="${idx}" data-action="increment">&#9650;</span>
          <span class="qty-arrow qty-down" data-idx="${idx}" data-action="decrement">&#9660;</span>
        </div>
      </div></td>
      <td>${item.price * item.qty} KD</td>
    `;
    tbody.appendChild(row);
    subtotal += item.price * item.qty;
  });
  document.getElementById('cart-subtotal').textContent = subtotal + ' KD';
  document.getElementById('cart-total').textContent = subtotal + ' KD';
  // Add Proceed to Checkout button if not already present
  // Use the existing checkout button from cart.html
  let checkoutBtn = document.getElementById('cart-checkout-btn');
  if (checkoutBtn) {
    checkoutBtn.style.display = (cart.length === 0) ? 'none' : 'block';
    checkoutBtn.onclick = function() { window.location.href = "checkout.html"; };
  }
}
// Remove item and quantity arrows
window.addEventListener('click', function(e) {
  if (e.target.classList.contains('cart-remove')) {
    const idx = parseInt(e.target.getAttribute('data-idx'));
    let cart = getCart();
    cart.splice(idx, 1);
    setCart(cart);
    renderCart();
    updateCartBadge();
  }
  // Quantity increment/decrement (arrows)
  if (e.target.classList.contains('qty-arrow')) {
    const idx = parseInt(e.target.getAttribute('data-idx'));
    const action = e.target.getAttribute('data-action');
    let cart = getCart();
    if (action === 'increment') cart[idx].qty += 1;
    if (action === 'decrement' && cart[idx].qty > 1) cart[idx].qty -= 1;
    setCart(cart);
    renderCart();
    updateCartBadge();
  }
});
// Update Cart button
const updateBtn = document.getElementById('cart-update-btn');
if (updateBtn) {
  updateBtn.addEventListener('click', function() {
    renderCart();
    updateCartBadge();
  });
}
// On page load
renderCart();
updateCartBadge(); 