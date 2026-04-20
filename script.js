/* ============================================
   KIVASA GLOBALTECH - MAIN JAVASCRIPT
   ============================================ */

document.addEventListener('DOMContentLoaded', function () {

    // ---- Navbar Scroll Effect ----
    const navbar = document.getElementById('navbar');
    function handleScroll() {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    }
    window.addEventListener('scroll', handleScroll);
    handleScroll();

    // ---- Mobile Nav Toggle ----
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');

    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function () {
            navToggle.classList.toggle('active');
            navMenu.classList.toggle('active');
        });

        // Close on link click
        navMenu.querySelectorAll('.nav-link').forEach(function (link) {
            link.addEventListener('click', function () {
                navToggle.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });

        // Close on outside click
        document.addEventListener('click', function (e) {
            if (!navMenu.contains(e.target) && !navToggle.contains(e.target)) {
                navToggle.classList.remove('active');
                navMenu.classList.remove('active');
            }
        });
    }

    // ---- Project Filters ----
    const filterButtons = document.querySelectorAll('.filter-btn');
    filterButtons.forEach(function (btn) {
        btn.addEventListener('click', function () {
            const filterGroup = btn.closest('.project-filters, .product-filters');
            if (filterGroup) {
                filterGroup.querySelectorAll('.filter-btn').forEach(function (b) {
                    b.classList.remove('active');
                });
            }
            btn.classList.add('active');

            const filter = btn.getAttribute('data-filter');

            // Handle project cards
            var projectCards = document.querySelectorAll('.project-grid-card');
            projectCards.forEach(function (card) {
                if (filter === 'all' || card.getAttribute('data-category') === filter) {
                    card.style.display = '';
                } else {
                    card.style.display = 'none';
                }
            });

            // Handle product cards
            var productCards = document.querySelectorAll('.product-card');
            if (productCards.length > 0) {
                filterProducts();
            }
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
        var searchTerm = searchInput ? searchInput.value.toLowerCase() : '';
        var activeFilter = document.querySelector('.product-filters .filter-btn.active');
        var categoryFilter = activeFilter ? activeFilter.getAttribute('data-filter') : 'all';
        var productCards = document.querySelectorAll('.product-card');
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
    var animateElements = document.querySelectorAll('.service-card, .project-card, .product-card, .value-card, .mv-card, .why-feature');
    animateElements.forEach(function (el) {
        el.classList.add('animate-on-scroll');
    });

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

    // ---- Smooth scroll for hash links ----
    document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
        anchor.addEventListener('click', function (e) {
            var target = document.querySelector(this.getAttribute('href'));
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });
});

// ---- Product Modal ----
function openProductModal(button) {
    var card = button.closest('.product-card');
    if (!card) return;

    var modal = document.getElementById('productModal');
    var title = card.querySelector('.product-info h3').textContent;
    var desc = card.querySelector('.product-desc').textContent;
    var category = card.querySelector('.product-badge').textContent;
    var specsTable = card.querySelector('.product-full-specs table');

    document.getElementById('modalTitle').textContent = title;
    document.getElementById('modalDesc').textContent = desc;
    document.getElementById('modalCategory').textContent = category;

    var modalSpecs = document.getElementById('modalSpecs');
    if (specsTable) {
        modalSpecs.innerHTML = specsTable.outerHTML;
    }

    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeProductModal() {
    var modal = document.getElementById('productModal');
    modal.classList.remove('active');
    document.body.style.overflow = '';
}

// Close modal on Escape
document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
        closeProductModal();
    }
});

// ---- Contact Form Handler ----
function handleFormSubmit(e) {
    e.preventDefault();

    var form = document.getElementById('contactForm');
    var success = document.getElementById('formSuccess');

    // Basic validation
    var name = document.getElementById('name').value.trim();
    var phone = document.getElementById('phone').value.trim();
    var email = document.getElementById('email').value.trim();
    var requirement = document.getElementById('requirement').value.trim();

    if (!name || !phone || !email || !requirement) {
        return;
    }

    // Show success (placeholder - integrate with backend/email service)
    form.style.display = 'none';
    success.style.display = 'block';
}
