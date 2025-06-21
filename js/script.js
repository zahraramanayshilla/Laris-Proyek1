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
let cart = JSON.parse(localStorage.getItem('cart')) || [];
let total = calculateTotal(cart);

function addToCart(name, price) {
    cart.push({ name, price });
    total += price;
    saveCart();
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
                    <span>Rp${item.price.toLocaleString()}</span>
                    <button onclick="removeItem(${index})" class="btn-remove">Hapus</button>
                </div>
            `;
            cartItems.appendChild(li);
        });
    }

    if (totalElement) totalElement.textContent = total.toLocaleString();
    if (totalItemsElement) totalItemsElement.textContent = cart.length;

    updateCartIcon();
}


function removeItem(index) {
    total -= cart[index].price;
    cart.splice(index, 1);
    saveCart();
    updateCart();
}

function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

function calculateTotal(cartData) {
    return cartData.reduce((acc, item) => acc + item.price, 0);
}

// Notification system
function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    document.body.appendChild(notification);

    // Show after a short delay to trigger transition
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);

    // Hide and remove
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            notification.remove();
        }, 300); // match transition duration
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

    window.open(`https://wa.me/+6281252012576?text=${message}`);
});

document.addEventListener('DOMContentLoaded', function () {
    updateCart();
});

function checkout() {
    alert("Terima kasih sudah belanja!");
    localStorage.removeItem('cart');
    cart = [];
    total = 0;
    updateCart();
}


// Sistem Filter dan Pencarian Produk
function initializeProductFilter() {
    // Tambahkan elemen HTML untuk filter di halaman produk
    const productSection = document.querySelector('.produk-page .container');
    if (!productSection) return;

    const filterHTML = `
        <div class="filter-container">
            <input type="text" id="searchProduct" placeholder="Cari produk..." class="search-input">
            <div class="filter-options">
                <button class="filter-btn active" data-filter="all">Semua</button>
                <button class="filter-btn" data-filter="keripik">Keripik</button>
                <button class="filter-btn" data-filter="goreng">Gorengan</button>
                <button class="filter-btn" data-filter="tradisional">Tradisional</button>
            </div>
        </div>
    `;

    // Sisipkan filter sebelum grid produk
    const gridElement = productSection.querySelector('.produk-grid');
    gridElement.insertAdjacentHTML('beforebegin', filterHTML);

    // Tambahkan event listener untuk pencarian
    const searchInput = document.getElementById('searchProduct');
    searchInput.addEventListener('input', filterProducts);

    // Tambahkan event listener untuk tombol filter
    const filterButtons = document.querySelectorAll('.filter-btn');
    filterButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            // Hapus kelas active dari semua tombol
            filterButtons.forEach(btn => btn.classList.remove('active'));
            // Tambahkan kelas active ke tombol yang diklik
            e.target.classList.add('active');
            filterProducts();
        });
    });

    // Tambahkan kategori ke setiap produk (dalam data atribut)
    const products = document.querySelectorAll('.card');
    products.forEach(product => {
        const productName = product.querySelector('h3').textContent.toLowerCase();
        if (productName.includes('keripik')) {
            product.dataset.category = 'keripik';
        } else if (productName.includes('goreng')) {
            product.dataset.category = 'goreng';
        } else if (productName.includes('wajit') || productName.includes('sale')) {
            product.dataset.category = 'tradisional';
        } else {
            product.dataset.category = 'lainnya';
        }
    });
}

function filterProducts() {
    const searchValue = document.getElementById('searchProduct').value.toLowerCase();
    const activeFilter = document.querySelector('.filter-btn.active').dataset.filter;

    const products = document.querySelectorAll('.card');
    products.forEach(product => {
        const productName = product.querySelector('h3').textContent.toLowerCase();
        const productCategory = product.dataset.category;

        const matchesSearch = productName.includes(searchValue);
        const matchesFilter = activeFilter === 'all' || productCategory === activeFilter;

        if (matchesSearch && matchesFilter) {
            product.style.display = 'block';
        } else {
            product.style.display = 'none';
        }
    });
}

// Panggil fungsi ini saat DOM sudah dimuat
document.addEventListener('DOMContentLoaded', function() {
    initializeProductFilter();
});

// Animasi Scroll dan Efek Parallax
function initializeScrollAnimations() {
    // Tambahkan efek parallax pada hero section
    const hero = document.querySelector('.hero');
    if (hero) {
        window.addEventListener('scroll', function() {
            const scrollPosition = window.scrollY;
            hero.style.backgroundPosition = `center ${scrollPosition * 0.5}px`;
        });
    }

    // Tambahkan animasi fade-in untuk elemen saat di-scroll
    const animateOnScroll = function() {
        const elements = document.querySelectorAll('.animate-on-scroll');

        elements.forEach(element => {
            const elementPosition = element.getBoundingClientRect().top;
            const windowHeight = window.innerHeight;

            if (elementPosition < windowHeight - 100) {
                element.classList.add('animated');
            }
        });
    };

    // Tambahkan kelas untuk elemen yang akan dianimasikan
    const sections = document.querySelectorAll('section:not(.hero)');
    sections.forEach(section => {
        section.classList.add('animate-on-scroll');
    });

    // Tambahkan CSS untuk animasi
    const animationStyles = document.createElement('style');
    animationStyles.textContent = `
        .animate-on-scroll {
            opacity: 0;
            transform: translateY(30px);
            transition: opacity 0.8s ease, transform 0.8s ease;
        }

        .animate-on-scroll.animated {
            opacity: 1;
            transform: translateY(0);
        }
    `;
    document.head.appendChild(animationStyles);

    // Panggil fungsi animasi saat scroll
    window.addEventListener('scroll', animateOnScroll);
    // Panggil sekali saat halaman dimuat
    animateOnScroll();
}

// Panggil fungsi ini saat DOM sudah dimuat
document.addEventListener('DOMContentLoaded', function() {
    initializeScrollAnimations();
});

// carousel

document.addEventListener('DOMContentLoaded', () => {
    const track = document.querySelector('.carousel-track');
    const btnLeft = document.querySelector('.btn-carousel.left');
    const btnRight = document.querySelector('.btn-carousel.right');

    if (!track || !btnLeft || !btnRight) return;

    const gap = parseFloat(getComputedStyle(track).gap) || 16;
    const card = track.querySelector('.card');
    const scrollStep = card.offsetWidth + gap;

    // Geser manual
    btnLeft.addEventListener('click', () => {
        track.scrollBy({ left: -scrollStep, behavior: 'smooth' });
    });

    btnRight.addEventListener('click', () => {
        track.scrollBy({ left: scrollStep, behavior: 'smooth' });
    });

    // Geser otomatis setiap 3 detik
    setInterval(() => {
        if (track.scrollLeft + track.clientWidth >= track.scrollWidth - scrollStep) {
            track.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
            track.scrollBy({ left: scrollStep, behavior: 'smooth' });
        }
    }, 3000);
});
  
  