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
  $('#checkout-form').on('submit', async function(e) {
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
    // Gather form data
    const name = $('#name').val();
    const lastname = $('#lastname').val();
    const country = $('#country').val();
    const address = $('#address').val();
    const phone = $('#phone').val();
    const email = $('#email').val();
    const payment = $('input[name="payment"]:checked').val();
    // Gather cart data
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    let total = 0;
    const products = cart.map(item => {
      total += item.price * item.qty;
      return { name: item.name, qty: item.qty, price: item.price };
    });
    // Prepare order object
    const order = {
      customer: name + ' ' + lastname,
      country,
      address,
      phone,
      email,
      payment,
      products,
      total
    };
    // Send to backend
    const BACKEND_URL = 'http://localhost:3000/api/checkout';
    try {
      const res = await fetch(BACKEND_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(order)
      });
      const data = await res.json();
      alert(data.message || 'Order placed successfully!');
      // Only clear cart and redirect on success
      if (res.ok) {
        localStorage.removeItem('cart');
        window.location.href = 'index.html';
      }
    } catch (err) {
      alert('Failed to place order. Please try again.');
    }
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