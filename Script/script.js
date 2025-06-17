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

    // Cek apakah ini perangkat mobile
    const isMobile = window.innerWidth <= 768;
    
    if (!isMobile) {
        // Hanya jalankan animasi otomatis di desktop
        track.style.transform = 'translateX(0)';
        track.style.animation = 'slideLeft 20s linear infinite';
    } else {
        // Untuk mobile, kita akan menggunakan touch events
        enableTouchSwipe(track);
    }
}

// Fungsi untuk mengaktifkan swipe pada mobile
function enableTouchSwipe(track) {
    let startX;
    let scrollLeft;
    let isDragging = false;
    const container = track.parentElement;
    
    // Touch events
    track.addEventListener('touchstart', (e) => {
        isDragging = true;
        startX = e.touches[0].pageX - track.offsetLeft;
        scrollLeft = track.scrollLeft;
        // Hentikan animasi jika sedang berjalan
        track.style.animation = 'none';
    });
    
    track.addEventListener('touchend', () => {
        isDragging = false;
    });
    
    track.addEventListener('touchmove', (e) => {
        if (!isDragging) return;
        e.preventDefault();
        const x = e.touches[0].pageX - track.offsetLeft;
        const walk = (x - startX) * 2; // Kecepatan scroll
        const currentTransform = getComputedStyle(track).getPropertyValue('transform');
        const matrix = new DOMMatrix(currentTransform);
        const currentX = matrix.m41;
        
        track.style.transform = `translateX(${currentX + walk}px)`;
        startX = x;
    });
    
    // Mouse events (untuk testing di desktop)
    track.addEventListener('mousedown', (e) => {
        isDragging = true;
        startX = e.pageX - track.offsetLeft;
        scrollLeft = track.scrollLeft;
        track.style.animation = 'none';
        track.style.cursor = 'grabbing';
    });
    
    track.addEventListener('mouseup', () => {
        isDragging = false;
        track.style.cursor = 'grab';
    });
    
    track.addEventListener('mouseleave', () => {
        isDragging = false;
        track.style.cursor = 'grab';
    });
    
    track.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        e.preventDefault();
        const x = e.pageX - track.offsetLeft;
        const walk = (x - startX) * 2;
        const currentTransform = getComputedStyle(track).getPropertyValue('transform');
        const matrix = new DOMMatrix(currentTransform);
        const currentX = matrix.m41;
        
        track.style.transform = `translateX(${currentX + walk}px)`;
        startX = x;
    });
}

// Tambahkan event listener untuk resize window
window.addEventListener('resize', () => {
    const track = document.querySelector('.carousel-track');
    if (!track) return;
    
    // Reset animasi
    track.style.animation = 'none';
    track.style.transform = 'translateX(0)';
    
    // Reinisialisasi carousel
    setTimeout(() => {
        const isMobile = window.innerWidth <= 768;
        if (!isMobile) {
            track.style.animation = 'slideLeft 20s linear infinite';
        } else {
            enableTouchSwipe(track);
        }
    }, 100);
});

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
    
    /* Tambahkan style untuk cursor pada carousel */
    .carousel-track {
        cursor: grab;
    }
`;
document.head.appendChild(style);

// Initialize carousel when DOM is loaded
document.addEventListener('DOMContentLoaded', initCarousel);

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

// Sistem Rating dan Ulasan Produk
let reviews = {};

function initializeReviewSystem() {
    // Tambahkan tombol review ke setiap produk
    const productCards = document.querySelectorAll('.card');
    productCards.forEach(card => {
        const productName = card.querySelector('h3').textContent;
        const cardContent = card.querySelector('.card-content');
        
        const reviewButton = document.createElement('button');
        reviewButton.className = 'btn-review';
        reviewButton.textContent = 'Lihat Ulasan';
        reviewButton.onclick = function() { showReviewModal(productName); };
        
        cardContent.appendChild(reviewButton);
    });
    
    // Muat ulasan dari local storage
    loadReviewsFromLocalStorage();
}

function loadReviewsFromLocalStorage() {
    const savedReviews = localStorage.getItem('tokoLarisReviews');
    if (savedReviews) {
        reviews = JSON.parse(savedReviews);
    }
}

function saveReviewsToLocalStorage() {
    localStorage.setItem('tokoLarisReviews', JSON.stringify(reviews));
}

function showReviewModal(productName) {
    // Buat modal untuk ulasan
    const modal = document.createElement('div');
    modal.className = 'review-modal';
    
    // Dapatkan ulasan produk atau inisialisasi jika belum ada
    if (!reviews[productName]) {
        reviews[productName] = [];
    }
    
    // Hitung rating rata-rata
    let averageRating = 0;
    if (reviews[productName].length > 0) {
        const sum = reviews[productName].reduce((total, review) => total + review.rating, 0);
        averageRating = sum / reviews[productName].length;
    }
    
    // Buat konten modal
    const modalContent = `
        <div class="review-modal-content">
            <span class="close-modal">&times;</span>
            <h3>Ulasan untuk ${productName}</h3>
            <div class="average-rating">
                Rating: ${averageRating.toFixed(1)} / 5 (${reviews[productName].length} ulasan)
            </div>
            <div class="review-list">
                ${reviews[productName].map(review => `
                    <div class="review-item">
                        <div class="review-rating">${'★'.repeat(review.rating)}${'☆'.repeat(5-review.rating)}</div>
                        <div class="review-text">${review.text}</div>
                        <div class="review-author">${review.author}</div>
                    </div>
                `).join('') || '<p>Belum ada ulasan</p>'}
            </div>
            <div class="add-review-form">
                <h4>Tambahkan Ulasan</h4>
                <div class="rating-input">
                    <span>Rating: </span>
                    <div class="star-rating">
                        <span data-rating="1">☆</span>
                        <span data-rating="2">☆</span>
                        <span data-rating="3">☆</span>
                        <span data-rating="4">☆</span>
                        <span data-rating="5">☆</span>
                    </div>
                </div>
                <input type="text" id="reviewAuthor" placeholder="Nama Anda" />
                <textarea id="reviewText" placeholder="Tulis ulasan Anda"></textarea>
                <button id="submitReview">Kirim Ulasan</button>
            </div>
        </div>
    `;
    
    modal.innerHTML = modalContent;
    document.body.appendChild(modal);
    
    // Tambahkan event listener untuk menutup modal
    modal.querySelector('.close-modal').addEventListener('click', () => {
        modal.remove();
    });
    
    // Tambahkan event listener untuk rating bintang
    let selectedRating = 0;
    const stars = modal.querySelectorAll('.star-rating span');
    stars.forEach(star => {
        star.addEventListener('mouseover', function() {
            const rating = this.dataset.rating;
            highlightStars(stars, rating);
        });
        
        star.addEventListener('mouseout', function() {
            highlightStars(stars, selectedRating);
        });
        
        star.addEventListener('click', function() {
            selectedRating = this.dataset.rating;
            highlightStars(stars, selectedRating);
        });
    });
    
    // Tambahkan event listener untuk submit ulasan
    modal.querySelector('#submitReview').addEventListener('click', function() {
        const author = modal.querySelector('#reviewAuthor').value.trim() || 'Anonim';
        const text = modal.querySelector('#reviewText').value.trim();
        
        if (selectedRating === 0) {
            alert('Silakan pilih rating');
            return;
        }
        
        if (text === '') {
            alert('Silakan tulis ulasan Anda');
            return;
        }
        
        // Tambahkan ulasan baru
        reviews[productName].push({
            rating: parseInt(selectedRating),
            author,
            text,
            date: new Date().toISOString()
        });
        
        // Simpan ke local storage
        saveReviewsToLocalStorage();
        
        // Tutup dan buka kembali modal untuk refresh
        modal.remove();
        showReviewModal(productName);
    });
}

function highlightStars(stars, rating) {
    stars.forEach(star => {
        if (star.dataset.rating <= rating) {
            star.textContent = '★';
        } else {
            star.textContent = '☆';
        }
    });
}

// Tambahkan CSS untuk modal ulasan
const reviewStyles = document.createElement('style');
reviewStyles.textContent = `
    .btn-review {
        width: 100%;
        padding: 0.8rem;
        background: #f3f4f6;
        color: var(--text-color);
        border: none;
        border-radius: 8px;
        font-size: 1rem;
        cursor: pointer;
        transition: background-color 0.3s;
        margin-top: 0.5rem;
    }
    
    .btn-review:hover {
        background: #e5e7eb;
    }
    
    .review-modal {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.5);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 2000;
    }
    
    .review-modal-content {
        background: white;
        padding: 2rem;
        border-radius: 10px;
        width: 90%;
        max-width: 600px;
        max-height: 80vh;
        overflow-y: auto;
    }
    
    .close-modal {
        float: right;
        font-size: 1.5rem;
        cursor: pointer;
    }
    
    .review-list {
        margin: 1rem 0;
        max-height: 200px;
        overflow-y: auto;
    }
    
    .review-item {
        padding: 0.5rem;
        border-bottom: 1px solid #e5e7eb;
    }
    
    .review-rating {
        color: #f59e0b;
    }
    
    .add-review-form {
        margin-top: 1rem;
    }
    
    .star-rating {
        display: inline-block;
        font-size: 1.5rem;
        color: #f59e0b;
        cursor: pointer;
    }
    
    #reviewAuthor, #reviewText {
        width: 100%;
        padding: 0.5rem;
        margin: 0.5rem 0;
        border: 1px solid #e5e7eb;
        border-radius: 5px;
    }
    
    #reviewText {
        height: 100px;
        resize: vertical;
    }
    
    #submitReview {
        padding: 0.5rem 1rem;
        background: var(--primary-color);
        color: white;
        border: none;
        border-radius: 5px;
        cursor: pointer;
    }
`;
document.head.appendChild(reviewStyles);

// Implementasi Tema Gelap (Dark Mode)
function initializeDarkMode() {
    // Tambahkan tombol toggle dark mode di navbar
    const nav = document.querySelector('nav ul');
    const darkModeToggle = document.createElement('li');
    darkModeToggle.innerHTML = '<button id="darkModeToggle" aria-label="Toggle Dark Mode">🌙</button>';
    nav.appendChild(darkModeToggle);
    
    // Tambahkan CSS untuk dark mode
    const darkModeStyles = document.createElement('style');
    darkModeStyles.textContent = `
        :root {
            --primary-color: #2563eb;
            --secondary-color: #1e40af;
            --text-color: #1f2937;
            --light-bg: #f3f4f6;
            --card-bg: white;
            --body-bg: white;
        }
        
        body.dark-mode {
            --primary-color: #3b82f6;
            --secondary-color: #60a5fa;
            --text-color: #f3f4f6;
            --light-bg: #1f2937;
            --card-bg: #374151;
            --body-bg: #111827;
        }
        
        body.dark-mode {
            background-color: var(--body-bg);
            color: var(--text-color);
        }
        
        body.dark-mode .navbar {
            background-color: #111827;
            box-shadow: 0 2px 10px rgba(0,0,0,0.3);
        }
        
        body.dark-mode .card {
            background-color: var(--card-bg);
        }
        
        body.dark-mode nav a {
            color: var(--text-color);
        }
        
        #darkModeToggle {
            background: none;
            border: none;
            font-size: 1.2rem;
            cursor: pointer;
            padding: 0.5rem;
            border-radius: 50%;
            transition: background-color 0.3s;
        }
        
        #darkModeToggle:hover {
            background-color: rgba(0,0,0,0.1);
        }
        
        body.dark-mode #darkModeToggle {
            background-color: rgba(255,255,255,0.1);
        }
        
        body.dark-mode #darkModeToggle:hover {
            background-color: rgba(255,255,255,0.2);
        }
    `;
    document.head.appendChild(darkModeStyles);
    
    // Tambahkan event listener untuk toggle dark mode
    const darkModeButton = document.getElementById('darkModeToggle');
    darkModeButton.addEventListener('click', toggleDarkMode);
    
    // Periksa preferensi pengguna dari local storage
    const isDarkMode = localStorage.getItem('darkMode') === 'true';
    if (isDarkMode) {
        document.body.classList.add('dark-mode');
        darkModeButton.textContent = '☀️';
    }
}

function toggleDarkMode() {
    const darkModeButton = document.getElementById('darkModeToggle');
    const isDarkMode = document.body.classList.toggle('dark-mode');
    
    // Simpan preferensi ke local storage
    localStorage.setItem('darkMode', isDarkMode);
    
    // Ubah ikon tombol
    darkModeButton.textContent = isDarkMode ? '☀️' : '🌙';
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


// caorsel
