// Smooth scroll for navigation
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const element = document.querySelector(this.getAttribute('href'));
        let headerOffset = 180;
        
        // Special offset for product section
        if (this.getAttribute('href') === '#produk') {
            headerOffset = 300; // Adjusted offset for better product section visibility
        } else if (window.location.pathname.includes('tentang.html')) {
            headerOffset = 100;
        }
        
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
        });
    });
});

/ Navbar scroll effect
window.addEventListener('scroll', function() {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.classList.add('navbar-scrolled');
    } else {
        navbar.classList.remove('navbar-scrolled');
    }
});

// Product card animation on scroll
const observerOptions = {
    threshold: 0.2
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('card-visible');
        }
    });
}, observerOptions);

document.querySelectorAll('.card').forEach(card => {
    observer.observe(card);
});

// Mobile menu toggle
const menuToggle = document.getElementById('menuToggle');
const mainNav = document.getElementById('mainNav');

menuToggle.addEventListener('click', () => {
    mainNav.classList.toggle('active');
});

// Shopping cart functionality
let cart = [];
let total = 0;

function addToCart(name, price) {
    cart.push({ name, price });
    total += price;
    updateCart();
    showNotification(`${name} ditambahkan ke keranjang`);
}

function updateCart() {
    const cartItems = document.getElementById('cartItems');
    const totalElement = document.getElementById('totalHarga');
    const totalItemsElement = document.getElementById('totalItems');
    
    if (cartItems) {
        cartItems.innerHTML = '';
        cart.forEach((item, index) => {
            const li = document.createElement('li');
            li.innerHTML = `
                <div class="cart-item">
                    <span>${item.name}</span>
                    <span>Rp${item.price}</span>
                    <button onclick="removeItem(${index})" class="btn-remove">Hapus</button>
                </div>
            `;
            cartItems.appendChild(li);
        });
    }
    
    if (totalElement) totalElement.textContent = total;
    if (totalItemsElement) totalItemsElement.textContent = cart.length;
    
    // Update cart icon
    updateCartIcon();
}