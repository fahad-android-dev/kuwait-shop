$(document).ready(function() {
  $('.menu').on('click', function() {
    $('.nav-links').slideToggle();
  });

  // Optional: Hide nav on resize if desktop
  $(window).resize(function() {
    if ($(window).width() > 700) {
      $('.nav-links').show();
    } else {
      $('.nav-links').hide();
    }
  });

  // Modern product data
  const products = [
    {
      id: 1,
      name: 'Dark Brown Extension',
      price: 30,
      oldPrice: 50,
      sale: 15, // percent
      rating: 5,
      img: 'https://i.imgur.com/4QfKuz1.png',
      stock: 5
    },
    {
      id: 2,
      name: 'Light Brown Extension',
      price: 30,
      oldPrice: 50,
      sale: 15,
      rating: 5,
      img: 'https://i.imgur.com/8zQbF5F.png',
      stock: 3
    },
    {
      id: 3,
      name: 'Dark Brown Extension',
      price: 30,
      oldPrice: 50,
      sale: 0,
      rating: 5,
      img: 'https://i.imgur.com/4QfKuz1.png',
      stock: 0 // out of stock
    },
    {
      id: 4,
      name: 'Golden Blonde Extension',
      price: 35,
      oldPrice: 45,
      sale: 10,
      rating: 4,
      img: 'https://i.imgur.com/8zQbF5F.png',
      stock: 2
    }
  ];
  let cart = [];

  // Render products with animation
  function renderProducts() {
    const $list = $('#products-list');
    $list.empty();
    products.forEach((p, i) => {
      let stars = '<span class="stars">' + '★'.repeat(p.rating) + '☆'.repeat(5 - p.rating) + '</span>';
      let badge = '';
      if (p.stock === 0) badge = '<span class="badge out">Out Of Stock</span>';
      else if (p.sale > 0) badge = `<span class="badge sale">-%${p.sale}</span>`;
      let priceRow = `<span class="old-price">KD ${p.oldPrice.toFixed(2)}</span> <span class="new-price">KD ${p.price.toFixed(2)}</span>`;
      let btn = `<button class="add-to-cart" data-id="${p.id}" ${p.stock === 0 ? 'disabled' : ''}>ADD TO CART</button>`;
      $list.append(`
        <div class="product" style="animation-delay:${i * 0.12}s">
          ${badge}
          <img src="${p.img}" alt="${p.name}">
          <div class="price-row">${priceRow}</div>
          ${stars}
          <h3>${p.name}</h3>
          <hr style="width:90%;margin:10px 0 8px 0;border:0;border-top:1px solid #d6c7b7;">
          ${btn}
        </div>
      `);
    });
  }

  // Navigation helpers
  function showSection(section) {
    $('.shop-section, .cart-section, .checkout-section, .order-success').hide();
    $(section).show();
    if(section === '#shop-section') {
      $('.hero').show();
    } else {
      $('.hero').hide();
    }
  }

  // Navbar tab switching
  $('.nav-links li').on('click', function() {
    $('.nav-links li').removeClass('active');
    $(this).addClass('active');
  });

  // Cart logic
  function getCart() {
    return JSON.parse(localStorage.getItem('cart') || '[]');
  }
  function setCart(cart) {
    localStorage.setItem('cart', JSON.stringify(cart));
  }
  function updateCartBadge() {
    const cart = getCart();
    let count = cart.reduce((sum, item) => sum + item.qty, 0);
    $('#cart-badge').text(count);
  }

  // Add to cart
  $('.add-to-cart-btn:not(:disabled)').on('click', function() {
    const card = $(this).closest('.product-card');
    const img = card.find('img').attr('src');
    const name = card.find('.product-title').text();
    const price = parseFloat(card.find('.new-price').text().replace('KD', '').trim());
    let cart = getCart();
    let found = cart.find(p => p.name === name && p.img === img);
    if (found) found.qty += 1;
    else cart.push({ name, img, price, qty: 1 });
    setCart(cart);
    updateCartBadge();
    // Show popup
    var $popup = $('#cart-popup');
    $popup.stop(true, true).fadeIn(200).text('Added to cart!');
    setTimeout(function() { $popup.fadeOut(400); }, 1200);
  });

  // Animate cart icon
  function animateCartIcon() {
    const $icon = $('#cart-icon');
    $icon.addClass('animated');
    setTimeout(() => $icon.removeClass('animated'), 500);
  }

  // Cart icon click: navigate to cart.html
  $('#cart-icon').on('click', function() {
    window.location.href = 'cart.html';
  });

  // Continue shopping
  $('.continue-shopping-btn').on('click', function() {
    showSection('#shop-section');
  });

  // Shop nav click
  $('.nav-shop').on('click', function() {
    showSection('#shop-section');
  });
  // Home nav click
  $('.nav-home').on('click', function() {
    showSection('#shop-section');
  });

  // Render cart
  function renderCart() {
    const $cartItems = $('.cart-items');
    $cartItems.empty();
    if(cart.length === 0) {
      $cartItems.html('<p>Your cart is empty.</p>');
      $('.cart-total').text('');
      $('.checkout-btn').hide();
      return;
    }
    let total = 0;
    cart.forEach(item => {
      total += item.price * item.qty;
      $cartItems.append(`
        <div class="cart-item" data-id="${item.id}">
          <div class="cart-item-details">
            <img src="${item.img}" alt="${item.name}">
            <span>${item.name}</span>
            <input type="number" class="cart-item-qty" min="1" value="${item.qty}">
            <span>KD ${item.price * item.qty}</span>
          </div>
          <button class="remove-item">Remove</button>
        </div>
      `);
    });
    $('.cart-total').text('Total: KD ' + total.toFixed(2));
    $('.checkout-btn').show();
  }

  // Update cart count on icon (optional, can add badge)
  function updateCartCount() {
    let count = cart.reduce((sum, item) => sum + item.qty, 0);
    $('#cart-icon').attr('title', `Cart (${count})`);
  }

  // Remove item
  $(document).on('click', '.remove-item', function() {
    const id = parseInt($(this).closest('.cart-item').attr('data-id'));
    cart = cart.filter(item => item.id !== id);
    renderCart();
    updateCartCount();
  });

  // Change quantity
  $(document).on('change', '.cart-item-qty', function() {
    const id = parseInt($(this).closest('.cart-item').attr('data-id'));
    let qty = parseInt($(this).val());
    if(qty < 1) qty = 1;
    const item = cart.find(i => i.id === id);
    if(item) item.qty = qty;
    renderCart();
    updateCartCount();
  });

  // Checkout button
  $('.checkout-btn').on('click', function() {
    showSection('#checkout-section');
  });

  // Back to cart from checkout
  $('.back-to-cart-btn').on('click', function() {
    showSection('#cart-section');
    renderCart();
  });

  // Place order
  $('#checkout-form').on('submit', function(e) {
    e.preventDefault();
    cart = [];
    updateCartCount();
    showSection('.order-success');
  });

  // Back to shop from order success
  $('.back-to-shop-btn').on('click', function() {
    showSection('#shop-section');
  });

  // Initial state
  renderProducts();
  showSection('#shop-section');
  updateCartCount();
  updateCartBadge();
}); 