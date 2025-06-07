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