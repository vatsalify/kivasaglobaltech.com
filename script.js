/* ============================================
   KIVASA GLOBALTECH - MAIN JAVASCRIPT
   ============================================ */

document.addEventListener('DOMContentLoaded', function () {

    // ---- Navbar Scroll Effect ----
    var navbar = document.getElementById('navbar');
    function handleScroll() {
        if (!navbar) return;
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    }
    window.addEventListener('scroll', handleScroll);
    handleScroll();

    // ---- Product & Project Filters ----
    var filterButtons = document.querySelectorAll('.product-filters .filter-btn');
    filterButtons.forEach(function (btn) {
        btn.addEventListener('click', function () {
            filterButtons.forEach(function (b) {
                b.classList.remove('active');
            });
            btn.classList.add('active');
            filterProducts();
        });
    });

    // ---- Product Search ----
    var searchInput = document.getElementById('productSearch');
    if (searchInput) {
        searchInput.addEventListener('input', function () {
            filterProducts();
        });
    }

    function filterProducts() {
        var searchInput = document.getElementById('productSearch');
        var searchTerm = searchInput ? searchInput.value.toLowerCase().trim() : '';
        var activeFilter = document.querySelector('.product-filters .filter-btn.active');
        var categoryFilter = activeFilter ? activeFilter.getAttribute('data-filter') : 'all';
        var productCards = document.querySelectorAll('.products-grid .product-card');
        var noProducts = document.getElementById('noProducts');
        var visibleCount = 0;

        productCards.forEach(function (card) {
            var name = (card.getAttribute('data-name') || '').toLowerCase();
            var specs = (card.getAttribute('data-specs') || '').toLowerCase();
            var category = card.getAttribute('data-category') || '';

            var matchesCategory = categoryFilter === 'all' || category === categoryFilter;
            var matchesSearch = !searchTerm || name.indexOf(searchTerm) !== -1 || specs.indexOf(searchTerm) !== -1;

            if (matchesCategory && matchesSearch) {
                card.style.display = '';
                visibleCount++;
            } else {
                card.style.display = 'none';
            }
        });

        if (noProducts) {
            noProducts.style.display = visibleCount === 0 ? 'block' : 'none';
        }
    }

    // ---- Scroll Animations ----
    var animateElements = document.querySelectorAll('.service-card, .project-card, .product-card, .value-card, .mv-card, .why-feature, .stat-item');
    animateElements.forEach(function (el) {
        el.classList.add('animate-on-scroll');
    });

    if ('IntersectionObserver' in window) {
        var observer = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

        document.querySelectorAll('.animate-on-scroll').forEach(function (el) {
            observer.observe(el);
        });
    } else {
        document.querySelectorAll('.animate-on-scroll').forEach(function (el) {
            el.classList.add('visible');
        });
    }

    // ---- Random Clean Stock Background Images ----
    var stockImages = [
        'decorative-lighting-stock-image-1.png',
        'decorative-lighting-stock-image.png',
        'decorative-poles-stock-image.png',
        'facade-lighting-stock-image-2.png',
        'facade-lighting-stock-image.png',
        'home-lighting-stock-image-2.png',
        'home-lighting-stock-image.png',
        'hospitality-lighting-stock-image.png',
        'industrial-lighting-stock-image.png',
        'landscape-lighting-stock-image.png',
        'landscape-light-stock-image.png',
        'office-lighting-stock-image.png',
        'pendant-light-stock-image.png',
        'streetlight-stock-image.png',
        'table-lamps-decorative-stock-image.png',
        'wall-lamps-decorative-stock-image.png'
    ];

    function applyRandomBackground(el) {
        if (!el) return;
        var randomImage = stockImages[Math.floor(Math.random() * stockImages.length)];
        var imagePath = '/assets/images/' + randomImage;
        el.style.backgroundImage = "linear-gradient(rgba(15,23,42,0.55), rgba(15,23,42,0.55)), url('" + imagePath + "')";
        el.style.backgroundSize = 'cover';
        el.style.backgroundPosition = 'center center';
        el.style.backgroundRepeat = 'no-repeat';
    }

    var heroSection = document.querySelector('.hero-section');
    if (heroSection) applyRandomBackground(heroSection);

    var pageHeader = document.querySelector('.page-header');
    if (pageHeader && !pageHeader.classList.contains('no-bg-random')) {
        applyRandomBackground(pageHeader);
    }

    // ---- Smooth scroll for hash links ----
    document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
        anchor.addEventListener('click', function (e) {
            var targetId = this.getAttribute('href');
            if (targetId && targetId !== '#') {
                var target = document.querySelector(targetId);
                if (target) {
                    e.preventDefault();
                    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            }
        });
    });

    // ---- Analytics Click Tracking ----
    document.querySelectorAll('.download-btn').forEach(function (btn) {
        btn.addEventListener('click', function () {
            if (typeof gtag !== 'undefined') {
                gtag('event', 'catalogue_download', { event_category: 'engagement', file_name: 'jaquar-lighting-catalogue-2026.pdf' });
            }
        });
    });

    document.querySelectorAll('a[href^="tel:"]').forEach(function (link) {
        link.addEventListener('click', function () {
            if (typeof gtag !== 'undefined') {
                gtag('event', 'phone_click', { event_category: 'contact' });
            }
        });
    });
});

// ---- Product Modal Functionality (Global) ----
function openProductModal(button) {
    var card = button.closest('.product-card');
    if (!card) return;

    var modal = document.getElementById('productModal');
    if (!modal) return;

    var title = card.querySelector('.product-info h3') ? card.querySelector('.product-info h3').textContent : '';
    var desc = card.querySelector('.product-desc') ? card.querySelector('.product-desc').textContent : '';
    var badge = card.querySelector('.product-badge') ? card.querySelector('.product-badge').textContent : '';
    var specsTable = card.querySelector('.product-full-specs table');

    var titleEl = document.getElementById('modalTitle');
    var descEl = document.getElementById('modalDesc');
    var badgeEl = document.getElementById('modalCategory');
    var specsEl = document.getElementById('modalSpecs');

    if (titleEl) titleEl.textContent = title;
    if (descEl) descEl.textContent = desc;
    if (badgeEl) badgeEl.textContent = badge;

    if (specsEl) {
        if (specsTable) {
            specsEl.innerHTML = '<div class="table-responsive">' + specsTable.outerHTML + '</div>';
        } else {
            specsEl.innerHTML = '<p>Detailed datasheet available on request.</p>';
        }
    }

    // Show modal and update ARIA
    modal.style.display = 'flex';
    modal.classList.add('active');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';

    // Focus management: move focus to close button
    var closeBtn = modal.querySelector('.modal-close');
    if (closeBtn) closeBtn.focus();
}

function closeProductModal() {
    var modal = document.getElementById('productModal');
    if (!modal) return;
    modal.classList.remove('active');
    modal.style.display = 'none';
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
}

// Global modal close handlers
document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
        closeProductModal();
    }
});
