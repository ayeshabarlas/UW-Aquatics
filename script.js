// Product Database
const products = [
    {
        id: 1,
        name: "Premium Aquarium Tank",
        price: 299.99,
        image: "/1p.png",
        description: "60-gallon glass aquarium with LED lighting system"
    },
    {
        id: 2,
        name: "Tropical Fish Food",
        price: 19.99,
        image: "/2p.png",
        description: "High-quality nutrition for tropical fish"
    },
    {
        id: 3,
        name: "Water Filter System",
        price: 89.99,
        image: "/3p.png",
        description: "Advanced filtration for crystal clear water"
    },
    {
        id: 4,
        name: "LED Lighting Kit",
        price: 79.99,
        image: "/4p.png",
        description: "Full spectrum LED lights for plant growth"
    },
    {
        id: 5,
        name: "Decorative Coral Set",
        price: 49.99,
        image: "/5p.png",
        description: "Realistic artificial coral decorations"
    },
    {
        id: 6,
        name: "Water Testing Kit",
        price: 34.99,
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
    initializeCart();
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
                <p class="product-price">$${product.price.toFixed(2)}</p>
                <button onclick="addToCart(${product.id})" class="btn-primary">
                    Add to Cart
                </button>
            </div>
        </div>
    `).join('');
}

// Authentication Functions
function initializeAuth() {
    document.getElementById('loginForm').addEventListener('submit', handleLogin);
    document.getElementById('registerForm').addEventListener('submit', handleRegister);
    document.getElementById('showRegister').addEventListener('click', (e) => {
        e.preventDefault();
        showModal('registerModal');
    });
    document.getElementById('showLogin').addEventListener('click', (e) => {
        e.preventDefault();
        showModal('loginModal');
    });
}

function handleLogin(e) {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    const userType = document.getElementById('userType').value;

    // Simulate login (In real app, this would verify with backend)
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

    // Simulate registration (In real app, this would send to backend)
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
    loginBtn.innerHTML = `<i class="fas fa-user"></i> ${currentUser.name}`;
    loginBtn.onclick = logout;
}

function logout() {
    currentUser = null;
    cart = [];
    updateCartCount();
    const loginBtn = document.getElementById('loginBtn');
    loginBtn.innerHTML = `<i class="fas fa-user"></i> Login`;
    loginBtn.onclick = () => showModal('loginModal');
    showNotification('Logged out successfully', 'success');
}

// Cart Functions
function initializeCart() {
    document.getElementById('cartBtn').addEventListener('click', showCart);
    document.getElementById('checkoutBtn').addEventListener('click', proceedToCheckout);
    document.getElementById('checkoutForm').addEventListener('submit', handleCheckout);
}

function addToCart(productId) {
    if (!currentUser) {
        showModal('loginModal');
        showNotification('Please login to add items to cart', 'error');
        return;
    }

    const product = products.find(p => p.id === productId);
    cart.push(product);
    updateCartCount();
    showNotification(`${product.name} added to cart!`, 'success');
}

function updateCartCount() {
    document.getElementById('cartBtn').innerHTML = `
        <i class="fas fa-shopping-cart"></i> Cart (${cart.length})
    `;
}

function showCart() {
    const cartItems = document.getElementById('cartItems');
    
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
                <button onclick="removeFromCart(${item.id})" class="btn-remove">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `).join('');
    }

    updateCartTotal();
    showModal('cartModal');
}

function removeFromCart(productId) {
    const index = cart.findIndex(item => item.id === productId);
    if (index > -1) {
        const removedItem = cart[index];
        cart.splice(index, 1);
        showCart();
        updateCartCount();
        showNotification(`${removedItem.name} removed from cart`, 'success');
    }
}

function updateCartTotal() {
    const total = cart.reduce((sum, item) => sum + item.price, 0);
    document.getElementById('cartTotal').textContent = total.toFixed(2);
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
    
    closeAllModals();
    showModal('checkoutModal');
}

function handleCheckout(e) {
    e.preventDefault();
    const address = document.getElementById('shippingAddress').value;
    const paymentMethod = document.getElementById('paymentMethod').value;

    // Simulate order processing (In real app, this would send to backend)
    const order = {
        items: [...cart],
        address,
        paymentMethod,
        total: cart.reduce((sum, item) => sum + item.price, 0),
        date: new Date()
    };

    // Clear cart and show success
    cart = [];
    updateCartCount();
    closeAllModals();
    showNotification('Order placed successfully! Thank you for shopping with us.', 'success');
}

// Utility Functions
function showModal(modalId) {
    closeAllModals();
    document.getElementById(modalId).style.display = 'block';
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

    // Payment method change
    document.getElementById('paymentMethod').addEventListener('change', (e) => {
        document.getElementById('cardDetails').classList.toggle('hidden', e.target.value !== 'card');
    });
}

// Mobile Menu Toggle
document.querySelector('.mobile-menu').addEventListener('click', () => {
    document.querySelector('.nav-items').classList.toggle('show');
});