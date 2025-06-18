// Product Database
const products = [
    {
        id: 1,
        name: "Premium Aquarium Tank",
        price: 299.99,
        image: "1p.png",
        description: "60-gallon glass aquarium with LED lighting system"
    },
    {
        id: 2,
        name: "Tropical Fish Food",
        price: 19.99,
        image: "2p.png",
        description: "High-quality nutrition for tropical fish"
    },
    {
        id: 3,
        name: "Water Filter System",
        price: 89.99,
        image: "3p.png",
        description: "Advanced filtration for crystal clear water"
    },
    {
        id: 4,
        name: "LED Lighting Kit",
        price: 79.99,
        image: "4p.png",
        description: "Full spectrum LED lights for plant growth"
    },
    {
        id: 5,
        name: "Decorative Coral Set",
        price: 49.99,
        image: "5p.png",
        description: "Realistic artificial coral decorations"
    },
    {
        id: 6,
        name: "Water Testing Kit",
        price: 34.99,
        image: "6p.png",
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
    if (!productGrid) return;

    productGrid.innerHTML = products.map(product => `
        <div class="product-card">
            <img src="${product.image}" alt="${product.name}" class="product-image">
            <div class="product-info">
                <h3>${product.name}</h3>
                <p>${product.description}</p>
                <p class="product-price">$${product.price.toFixed(2)}</p>
                <button onclick="addToCart(${product.id})" class="btn-primary">
                    Add to Cart
                </button>
            </div>
        </div>
    `).join('');
}

// Navigation Functions
function initializeNavigation() {
    const menuBtn = document.getElementById('menuBtn');
    const navMenu = document.getElementById('navMenu');
    const cartBtn = document.getElementById('cartBtn');
    const cartSidebar = document.getElementById('cartSidebar');
    const cartOverlay = document.getElementById('cartOverlay');
    const closeCart = document.querySelector('.close-cart');

    // Menu Toggle
    menuBtn?.addEventListener('click', () => {
        navMenu?.classList.toggle('active');
    });

    // Cart Toggle
    cartBtn?.addEventListener('click', () => {
        cartSidebar?.classList.add('active');
        cartOverlay?.classList.add('active');
        document.body.style.overflow = 'hidden';
    });

    // Close Cart
    closeCart?.addEventListener('click', () => {
        cartSidebar?.classList.remove('active');
        cartOverlay?.classList.remove('active');
        document.body.style.overflow = '';
    });

    cartOverlay?.addEventListener('click', () => {
        cartSidebar?.classList.remove('active');
        cartOverlay?.classList.remove('active');
        document.body.style.overflow = '';
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!e.target.closest('#navMenu') && 
            !e.target.closest('#menuBtn') && 
            navMenu?.classList.contains('active')) {
            navMenu.classList.remove('active');
        }
    });
}

// Auth Functions
function initializeAuth() {
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    const loginBtn = document.getElementById('loginBtn');

    loginForm?.addEventListener('submit', handleLogin);
    registerForm?.addEventListener('submit', handleRegister);

    document.getElementById('showRegister')?.addEventListener('click', (e) => {
        e.preventDefault();
        showModal('registerModal');
    });

    document.getElementById('showLogin')?.addEventListener('click', (e) => {
        e.preventDefault();
        showModal('loginModal');
    });

    loginBtn?.addEventListener('click', (e) => {
        e.preventDefault();
        if (!currentUser) {
            showModal('loginModal');
        }
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
        updateCartItems();
    }
}

function updateCartCount() {
    const cartCount = document.querySelector('.cart-count');
    if (cartCount) {
        cartCount.textContent = cart.length;
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
        showNotification('Item removed from cart', 'success');
    }
}

function updateCartTotal() {
    const total = cart.reduce((sum, item) => sum + item.price, 0);
    const cartTotal = document.getElementById('cartTotal');
    if (cartTotal) {
        cartTotal.textContent = total.toFixed(2);
    }
}

// Utility Functions
function showModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        closeAllModals();
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

// Event Listeners
function setupEventListeners() {
    // Close modals when clicking outside
    window.addEventListener('click', (e) => {
        if (e.target.classList.contains('modal')) {
            closeAllModals();
        }
    });

    // Close buttons
    document.querySelectorAll('.close').forEach(btn => {
        btn.addEventListener('click', closeAllModals);
    });

    // Checkout button
    document.getElementById('checkoutBtn')?.addEventListener('click', proceedToCheckout);

    // Payment method change
    document.getElementById('paymentMethod')?.addEventListener('change', (e) => {
        const cardDetails = document.getElementById('cardDetails');
        if (cardDetails) {
            cardDetails.classList.toggle('hidden', e.target.value !== 'card');
        }
    });

    // Checkout form
    document.getElementById('checkoutForm')?.addEventListener('submit', handleCheckout);
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
    
    showModal('checkoutModal');
}

function handleCheckout(e) {
    e.preventDefault();
    cart = [];
    updateCartCount();
    updateCartItems();
    closeAllModals();
    showNotification('Order placed successfully!', 'success');
}
// Cart Functions
function addToCart(productId) {
    console.log("Adding to cart:", productId); // Debug log

    if (!currentUser) {
        showModal('loginModal');
        showNotification('Please login to add items to cart', 'error');
        return;
    }

    const product = products.find(p => p.id === productId);
    if (product) {
        cart.push(product);
        updateCartCount();
        updateCartItems();
        showNotification(`${product.name} added to cart!`, 'success');
        
        // Optional: Open cart sidebar when item is added
        const cartSidebar = document.getElementById('cartSidebar');
        const cartOverlay = document.getElementById('cartOverlay');
        if (cartSidebar && cartOverlay) {
            cartSidebar.classList.add('active');
            cartOverlay.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
    }
}

// Update loadProducts function
function loadProducts() {
    const productGrid = document.getElementById('productGrid');
    if (!productGrid) return;

    productGrid.innerHTML = products.map(product => `
        <div class="product-card">
            <img src="${product.image}" alt="${product.name}" class="product-image">
            <div class="product-info">
                <h3>${product.name}</h3>
                <p>${product.description}</p>
                <p class="product-price">$${product.price.toFixed(2)}</p>
                <button class="btn-primary add-to-cart-btn" data-product-id="${product.id}">
                    <i class="fas fa-shopping-cart"></i> Add to Cart
                </button>
            </div>
        </div>
    `).join('');

    // Add click event listeners to all Add to Cart buttons
    const addToCartButtons = document.querySelectorAll('.add-to-cart-btn');
    addToCartButtons.forEach(button => {
        button.addEventListener('click', function() {
            const productId = parseInt(this.getAttribute('data-product-id'));
            addToCart(productId);
        });
    });
}

function updateCartCount() {
    const cartCount = document.querySelector('.cart-count');
    if (cartCount) {
        cartCount.textContent = cart.length;
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
                <button class="remove-btn" data-product-id="${item.id}">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `).join('');

        // Add event listeners to remove buttons
        const removeButtons = cartItems.querySelectorAll('.remove-btn');
        removeButtons.forEach(button => {
            button.addEventListener('click', function() {
                const productId = parseInt(this.getAttribute('data-product-id'));
                removeFromCart(productId);
            });
        });
    }
    updateCartTotal();
}

// Initialize cart functionality
function initializeCart() {
    const cartBtn = document.getElementById('cartBtn');
    const cartSidebar = document.getElementById('cartSidebar');
    const cartOverlay = document.getElementById('cartOverlay');
    const closeCart = document.querySelector('.close-cart');

    cartBtn?.addEventListener('click', () => {
        cartSidebar?.classList.add('active');
        cartOverlay?.classList.add('active');
        document.body.style.overflow = 'hidden';
    });

    closeCart?.addEventListener('click', () => {
        cartSidebar?.classList.remove('active');
        cartOverlay?.classList.remove('active');
        document.body.style.overflow = '';
    });

    cartOverlay?.addEventListener('click', () => {
        cartSidebar?.classList.remove('active');
        cartOverlay?.classList.remove('active');
        document.body.style.overflow = '';
    });
}

// Update initialization
document.addEventListener('DOMContentLoaded', () => {
    loadProducts();
    initializeAuth();
    initializeCart(); // Add this line
    initializeNavigation();
    setupEventListeners();
});
// Simple Toggle Functionality
document.addEventListener('DOMContentLoaded', () => {
    const menuBtn = document.getElementById('menuBtn');
    const navMenu = document.getElementById('navMenu');
    
    menuBtn.addEventListener('click', () => {
        navMenu.classList.toggle('show');
        
        // Change menu icon
        const menuIcon = menuBtn.querySelector('i');
        if (menuIcon.classList.contains('fa-bars')) {
            menuIcon.classList.remove('fa-bars');
            menuIcon.classList.add('fa-times');
        } else {
            menuIcon.classList.remove('fa-times');
            menuIcon.classList.add('fa-bars');
        }
    });
});
