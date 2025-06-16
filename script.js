// Product Database
const products = [
    {
        id: 1,
        name: "Premium Aquarium Tank",
        price: 25500,
        image: "/1p.png",
        description: "60-gallon glass aquarium with LED lighting system"
    },
    {
        id: 2,
        name: "Tropical Fish Food",
        price: 19500,
        image: "/2p.png",
        description: "High-quality nutrition for tropical fish"
    },
    {
        id: 3,
        name: "Water Filter System",
        price: 9500,
        image: "/3p.png",
        description: "Advanced filtration for crystal clear water"
    },
    {
        id: 4,
        name: "LED Lighting Kit",
        price: 7500,
        image: "/4p.png",
        description: "Full spectrum LED lights for plant growth"
    },
    {
        id: 5,
        name: "Decorative Coral Set",
        price: 4500,
        image: "/5p.png",
        description: "Realistic artificial coral decorations"
    },
    {
        id: 6,
        name: "Water Testing Kit",
        price: 3500,
        image: "/6p.png",
        description: "Professional grade water testing kit"
    }
];

// Global Variables
let currentUser = null;
let cart = [];

// Initialize Website
document.addEventListener('DOMContentLoaded', () => {
    loadProducts();
    initializeAuth();
    initializeNavigation();
    setupEventListeners();
});

// Product Functions
function loadProducts() {
    const productGrid = document.getElementById('productGrid');
    productGrid.innerHTML = products.map(product => `
        <div class="product-card">
            <img src="${product.image}" alt="${product.name}" class="product-image">
            <div class="product-info">
                <h3>${product.name}</h3>
                <p>${product.description}</p>
                <p class="product-price">pkr${product.price.toFixed(2)}</p>
                <button onclick="addToCart(${product.id})" class="btn-primary">
                    Add to Cart
                </button>
            </div>
        </div>
    `).join('');
}

// Authentication Functions
function initializeAuth() {
    document.getElementById('loginForm')?.addEventListener('submit', handleLogin);
    document.getElementById('registerForm')?.addEventListener('submit', handleRegister);
    document.getElementById('showRegister')?.addEventListener('click', (e) => {
        e.preventDefault();
        showModal('registerModal');
    });
    document.getElementById('showLogin')?.addEventListener('click', (e) => {
        e.preventDefault();
        showModal('loginModal');
    });
}

function handleLogin(e) {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    const userType = document.getElementById('userType').value;

    currentUser = {
        email,
        userType,
        name: email.split('@')[0]
    };

    updateUIForLoggedInUser();
    closeAllModals();
    showNotification('Successfully logged in!', 'success');
}

function handleRegister(e) {
    e.preventDefault();
    const name = document.getElementById('regName').value;
    const email = document.getElementById('regEmail').value;
    const password = document.getElementById('regPassword').value;

    currentUser = {
        name,
        email,
        userType: 'customer'
    };

    updateUIForLoggedInUser();
    closeAllModals();
    showNotification('Account created successfully!', 'success');
}

function updateUIForLoggedInUser() {
    const loginBtn = document.getElementById('loginBtn');
    if (loginBtn) {
        loginBtn.innerHTML = `<i class="fas fa-user"></i> ${currentUser.name}`;
        loginBtn.onclick = logout;
    }
}

function logout() {
    currentUser = null;
    cart = [];
    updateCartCount();
    const loginBtn = document.getElementById('loginBtn');
    if (loginBtn) {
        loginBtn.innerHTML = `<i class="fas fa-user"></i> Login`;
        loginBtn.onclick = () => showModal('loginModal');
    }
    showNotification('Logged out successfully', 'success');
}

// Cart Functions
function initializeNavigation() {
    const menuBtn = document.querySelector('.menu-btn');
    const navMenu = document.querySelector('.nav-menu');
    const cartBtn = document.getElementById('cartBtn');
    const cartSidebar = document.getElementById('cartSidebar');
    const cartOverlay = document.getElementById('cartOverlay');
    const closeCart = document.querySelector('.close-cart');

    menuBtn?.addEventListener('click', () => {
        navMenu?.classList.toggle('active');
    });

    cartBtn?.addEventListener('click', openCart);
    closeCart?.addEventListener('click', closeCart);
    cartOverlay?.addEventListener('click', closeCart);

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeCart();
        }
    });
}

function addToCart(productId) {
    if (!currentUser) {
        showModal('loginModal');
        showNotification('Please login to add items to cart', 'error');
        return;
    }

    const product = products.find(p => p.id === productId);
    if (product) {
        cart.push(product);
        updateCartCount();
        showNotification(`${product.name} added to cart!`, 'success');
    }
}

function updateCartCount() {
    const cartCount = document.querySelector('.cart-count');
    if (cartCount) {
        cartCount.textContent = cart.length;
    }
}

function openCart() {
    const cartSidebar = document.getElementById('cartSidebar');
    const cartOverlay = document.getElementById('cartOverlay');
    
    if (cartSidebar && cartOverlay) {
        updateCartItems();
        cartSidebar.classList.add('active');
        cartOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

function closeCart() {
    const cartSidebar = document.getElementById('cartSidebar');
    const cartOverlay = document.getElementById('cartOverlay');
    
    if (cartSidebar && cartOverlay) {
        cartSidebar.classList.remove('active');
        cartOverlay.classList.remove('active');
        document.body.style.overflow = '';
    }
}

function updateCartItems() {
    const cartItems = document.getElementById('cartItems');
    
    if (!cartItems) return;

    if (cart.length === 0) {
        cartItems.innerHTML = '<p class="empty-cart">Your cart is empty</p>';
    } else {
        cartItems.innerHTML = cart.map(item => `
            <div class="cart-item">
                <img src="${item.image}" alt="${item.name}">
                <div class="cart-item-details">
                    <h4>${item.name}</h4>
                    <p>$${item.price.toFixed(2)}</p>
                </div>
                <button onclick="removeFromCart(${item.id})" class="remove-btn">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `).join('');
    }
    updateCartTotal();
}

function removeFromCart(productId) {
    const index = cart.findIndex(item => item.id === productId);
    if (index > -1) {
        cart.splice(index, 1);
        updateCartItems();
        updateCartCount();
        if (cart.length === 0) {
            setTimeout(closeCart, 500);
        }
    }
}

function updateCartTotal() {
    const total = cart.reduce((sum, item) => sum + item.price, 0);
    const cartTotal = document.getElementById('cartTotal');
    if (cartTotal) {
        cartTotal.textContent = total.toFixed(2);
    }
}

// Checkout Functions
function proceedToCheckout() {
    if (!currentUser) {
        showModal('loginModal');
        return;
    }
    if (cart.length === 0) {
        showNotification('Your cart is empty!', 'error');
        return;
    }
    
    closeCart();
    showModal('checkoutModal');
}

function handleCheckout(e) {
    e.preventDefault();
    const address = document.getElementById('shippingAddress').value;
    const paymentMethod = document.getElementById('paymentMethod').value;

    const order = {
        items: [...cart],
        address,
        paymentMethod,
        total: cart.reduce((sum, item) => sum + item.price, 0),
        date: new Date()
    };

    cart = [];
    updateCartCount();
    closeAllModals();
    showNotification('Order placed successfully! Thank you for shopping with us.', 'success');
}

// Utility Functions
function showModal(modalId) {
    closeAllModals();
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'block';
    }
}

function closeAllModals() {
    document.querySelectorAll('.modal').forEach(modal => {
        modal.style.display = 'none';
    });
}

function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

function setupEventListeners() {
    window.addEventListener('click', (e) => {
        if (e.target.classList.contains('modal')) {
            closeAllModals();
        }
    });

    document.querySelectorAll('.close').forEach(btn => {
        btn.addEventListener('click', closeAllModals);
    });

    document.getElementById('paymentMethod')?.addEventListener('change', (e) => {
        const cardDetails = document.getElementById('cardDetails');
        if (cardDetails) {
            cardDetails.classList.toggle('hidden', e.target.value !== 'card');
        }
    });
}
// Mobile Menu and Cart Toggle
function initializeMobileMenu() {
    const menuBtn = document.getElementById('menuBtn');
    const navMenu = document.getElementById('navMenu');
    const cartBtn = document.getElementById('cartBtn');
    const cartSidebar = document.getElementById('cartSidebar');
    const cartOverlay = document.getElementById('cartOverlay');
    const closeCart = document.querySelector('.close-cart');

    // Toggle Menu
    menuBtn?.addEventListener('click', () => {
        navMenu.classList.toggle('active');
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!e.target.closest('#navMenu') && 
            !e.target.closest('#menuBtn') && 
            navMenu.classList.contains('active')) {
            navMenu.classList.remove('active');
        }
    });

    // Cart Toggle
    cartBtn?.addEventListener('click', () => {
        cartSidebar.classList.add('active');
        cartOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    });

    // Close Cart
    closeCart?.addEventListener('click', () => {
        cartSidebar.classList.remove('active');
        cartOverlay.classList.remove('active');
        document.body.style.overflow = '';
    });

    cartOverlay?.addEventListener('click', () => {
        cartSidebar.classList.remove('active');
        cartOverlay.classList.remove('active');
        document.body.style.overflow = '';
    });
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    initializeMobileMenu();
    // ... other initializations
});
