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