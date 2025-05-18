// checkout.js: Handles checkout page logic
$(document).ready(function() {
  // Populate order summary from cart
  function getCart() {
    return JSON.parse(localStorage.getItem('cart') || '[]');
  }
  function renderOrderSummary() {
    const cart = getCart();
    let subtotal = 0;
    let rows = '';
    cart.forEach(item => {
      const itemTotal = item.price * item.qty;
      subtotal += itemTotal;
      rows += `<tr><td>${item.name}<br><span style='font-size:1.1rem;color:#5a2323;'>&times;${item.qty}</span></td><td>${itemTotal} KD</td><td></td></tr>`;
    });
    if (rows === '') rows = `<tr><td colspan='3' style='text-align:center;color:#5a2323;'>Your cart is empty</td></tr>`;
    $('#order-summary-rows').html(rows);
    $('#order-total').text(subtotal + ' KD');
  }
  renderOrderSummary();

  // Form validation and order placement
  $('#checkout-form').on('submit', function(e) {
    e.preventDefault();
    // Simple validation (expand as needed)
    let valid = true;
    $(this).find('input[required], select[required]').each(function() {
      if (!$(this).val()) valid = false;
    });
    if (!valid) {
      alert('Please fill in all required fields.');
      return;
    }
    // Clear cart and show success (customize as needed)
    localStorage.removeItem('cart');
    window.location.href = 'order-success.html';
  });
});

// Navbar tab switching (match cart.html behavior)
window.addEventListener('DOMContentLoaded', function() {
  const navLinks = document.querySelectorAll('.nav-links li');
  navLinks.forEach(link => {
    link.addEventListener('click', function() {
      navLinks.forEach(l => l.classList.remove('active'));
      this.classList.add('active');
    });
  });
  // Set Shop tab as active on checkout page
  const shopTab = document.getElementById('nav-shop');
  if (shopTab) shopTab.classList.add('active');
}); 