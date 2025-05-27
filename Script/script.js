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

// Navbar scroll effect
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

function removeItem(index) {
    total -= cart[index].price;
    cart.splice(index, 1);
    updateCart();
}

// Notification system
function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);
    
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 2000);
}

// Update cart icon with item count
function updateCartIcon() {
    const cartIcon = document.querySelector('.cart-icon');
    if (cart.length > 0) {
        cartIcon.setAttribute('data-count', cart.length);
        cartIcon.classList.add('has-items');
    } else {
        cartIcon.removeAttribute('data-count');
        cartIcon.classList.remove('has-items');
    }
}

// WhatsApp checkout
document.getElementById('checkoutBtn')?.addEventListener('click', function(e) {
    e.preventDefault();
    if (cart.length === 0) {
        showNotification('Keranjang masih kosong');
        return;
    }
    
    let message = "Saya ingin memesan:%0A";
    cart.forEach(item => {
        message += `- ${item.name}: Rp${item.price}%0A`;
    });
    message += `%0ATotal: Rp${total}`;
    
    window.open(`https://wa.me/+6281234567890?text=${message}`);
});


// Carousel functionality
function initCarousel() {
    const track = document.querySelector('.carousel-track');
    if (!track) return;

    // Clone the first few slides and append them to create seamless loop
    const slides = [...track.children];
    const slidesToClone = 3;
    
    for (let i = 0; i < slidesToClone; i++) {
        const clone = slides[i].cloneNode(true);
        track.appendChild(clone);
    }

    // Start the continuous animation
    track.style.transform = 'translateX(0)';
    track.style.animation = 'slideLeft 20s linear infinite';
}

// Add this to your CSS
const style = document.createElement('style');
style.textContent = `
    @keyframes slideLeft {
        0% {
            transform: translateX(0);
        }
        100% {
            transform: translateX(calc(-33.333% * 6));
        }
    }
`;
document.head.appendChild(style);

// Initialize carousel when DOM is loaded
document.addEventListener('DOMContentLoaded', initCarousel);
