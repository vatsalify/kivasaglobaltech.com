/* ============================================================
   KIVASA GLOBALTECH — SHARED NAV & FOOTER PARTIALS
   Single source of truth. Edit here; all pages update.
   ============================================================ */

(function () {
    'use strict';

    /* ---- Determine active page for nav highlighting ---- */
    var path = window.location.pathname.replace(/\/$/, '') || '/';
    var page = path.split('/').pop().replace('.html', '') || 'index';

    function isActive(href) {
        var linkPage = href.replace(/^\//, '').replace('.html', '') || 'index';
        return page === linkPage ? ' active' : '';
    }

    /* ---- NAV HTML ---- */
    var navHTML = [
        '<a href="#main-content" class="skip-to-content" id="skip-to-content">Skip to main content</a>',
        '<nav class="navbar" id="navbar" role="navigation" aria-label="Main navigation">',
        '  <div class="container nav-container">',
        '    <a href="/" class="nav-logo" aria-label="Kivasa Globaltech — Home">',
        '      <img src="/assets/logos/kivasa-logo.png" alt="Kivasa Globaltech Logo" width="160" height="55">',
        '    </a>',
        '    <button class="nav-toggle" id="navToggle" aria-label="Toggle navigation menu" aria-expanded="false" aria-controls="navMenu">',
        '      <span class="sr-only">Menu</span>',
        '      <span></span><span></span><span></span>',
        '    </button>',
        '    <ul class="nav-menu" id="navMenu" role="list">',
        '      <li><a href="/" class="nav-link' + isActive('index') + '">Home</a></li>',
        '      <li><a href="/about" class="nav-link' + isActive('about') + '">About</a></li>',
        '      <li><a href="/services" class="nav-link' + isActive('services') + '">Services</a></li>',
        '      <li><a href="/projects" class="nav-link' + isActive('projects') + '">Projects</a></li>',
        '      <li><a href="/products" class="nav-link' + isActive('products') + '">Products</a></li>',
        '      <li><a href="/contact" class="nav-link' + isActive('contact') + '">Contact</a></li>',
        '      <li><a href="/contact#quote-form" class="nav-link btn-cta-nav" aria-label="Get a Quote for Infrastructure Projects">Get a Quote</a></li>',
        '    </ul>',
        '  </div>',
        '</nav>'
    ].join('\n');

    /* ---- FOOTER HTML ---- */
    var footerHTML = [
        '<footer class="footer" role="contentinfo">',
        '  <div class="container">',
        '    <div class="footer-grid">',
        '      <div class="footer-about">',
        '        <img src="/assets/logos/kivasa-logo.png" alt="Kivasa Globaltech" class="footer-logo" width="160" height="55" loading="lazy">',
        '        <p>Lighting the Backbone of Infrastructure. Premium lighting and electrical solutions for Railways, Commercial, and Industrial sectors.</p>',
        '        <div class="footer-social">',
        '          <a href="https://www.linkedin.com/company/104309020/" target="_blank" rel="noopener noreferrer" aria-label="Kivasa Globaltech on LinkedIn"><i class="fab fa-linkedin-in" aria-hidden="true"></i></a>',
        '          <a href="https://www.instagram.com/thekivasaworld/" target="_blank" rel="noopener noreferrer" aria-label="Kivasa Globaltech on Instagram"><i class="fab fa-instagram" aria-hidden="true"></i></a>',
        '        </div>',
        '      </div>',
        '      <div class="footer-links">',
        '        <h4>Quick Links</h4>',
        '        <ul>',
        '          <li><a href="/">Home</a></li>',
        '          <li><a href="/about">About Us</a></li>',
        '          <li><a href="/services">Services</a></li>',
        '          <li><a href="/projects">Projects</a></li>',
        '          <li><a href="/products">Products</a></li>',
        '          <li><a href="/contact">Contact</a></li>',
        '          <li><a href="/privacy-policy">Privacy Policy</a></li>',
        '          <li><a href="/terms">Terms of Use</a></li>',
        '        </ul>',
        '      </div>',
        '      <div class="footer-links">',
        '        <h4>Services</h4>',
        '        <ul>',
        '          <li><a href="/services#lighting">Bulk Lighting Solutions</a></li>',
        '          <li><a href="/services#railway">Railway Projects</a></li>',
        '          <li><a href="/services#electrical">Electrical Utilities</a></li>',
        '          <li><a href="/services#sourcing">Global Sourcing</a></li>',
        '        </ul>',
        '      </div>',
        '      <div class="footer-contact">',
        '        <h4>Contact &amp; Company Info</h4>',
        '        <ul>',
        '          <li><i class="fas fa-envelope" aria-hidden="true"></i> <a href="mailto:light.kivasaglobaltech@gmail.com">light.kivasaglobaltech@gmail.com</a></li>',
        '          <li><i class="fas fa-phone" aria-hidden="true"></i> <a href="tel:+918200461631" onclick="if(typeof gtag!==\'undefined\')gtag(\'event\',\'phone_click\',{event_category:\'engagement\'})">+91 82004 61631</a></li>',
        '          <li><i class="fas fa-map-marker-alt" aria-hidden="true"></i> Vadodara, Gujarat, India</li>',
        '        </ul>',
        '        <div class="company-identity" style="margin-top:1rem;font-size:0.85rem;line-height:1.6;color:var(--color-gray-dark,#4b5563);border-top:1px solid rgba(0,0,0,0.08);padding-top:0.75rem;">',
        '          <p><strong>Registered Office:</strong> Vadodara, Gujarat, India <!-- TODO: USER_SUPPLY: Full registered office building/street address, Vadodara, Gujarat --></p>',
        '          <p><strong>CIN:</strong> <!-- TODO: USER_SUPPLY: Corporate Identification Number (CIN) --> Pending confirmation</p>',
        '          <p><strong>GSTIN:</strong> <!-- TODO: USER_SUPPLY: GST Identification Number (GSTIN) --> Pending confirmation</p>',
        '          <p><strong>Registrations:</strong> <!-- TODO: USER_SUPPLY: MSME / Udyam / ISO / Railway vendor registration details --> MSME / Railway Vendor Registered</p>',
        '        </div>',
        '      </div>',
        '    </div>',
        '    <div class="footer-bottom">',
        '      <p>&copy; <span class="footer-year">' + new Date().getFullYear() + '</span> Kivasa Globaltech Pvt Ltd. All rights reserved.</p>',
        '      <p class="footer-legal"><a href="/privacy-policy">Privacy Policy</a> &nbsp;|&nbsp; <a href="/terms">Terms of Use</a></p>',
        '    </div>',
        '  </div>',
        '</footer>',
        '',
        '<!-- Floating WhatsApp Button -->',
        '<a href="https://wa.me/918200461631" class="whatsapp-float" target="_blank" rel="noopener noreferrer"',
        '   aria-label="Chat with Kivasa Globaltech on WhatsApp" id="whatsapp-float-btn"',
        '   onclick="if(typeof gtag!==\'undefined\')gtag(\'event\',\'whatsapp_click\',{event_category:\'engagement\'})">',
        '  <i class="fab fa-whatsapp" aria-hidden="true"></i>',
        '</a>'
    ].join('\n');

    /* ---- Inject into page ---- */
    function inject() {
        var navEl = document.getElementById('site-nav-placeholder');
        if (navEl) navEl.outerHTML = navHTML;

        var footerEl = document.getElementById('site-footer-placeholder');
        if (footerEl) footerEl.outerHTML = footerHTML;

        /* Dynamic copyright year */
        document.querySelectorAll('.footer-year').forEach(function (el) {
            el.textContent = new Date().getFullYear();
        });

        /* Setup accessible navigation toggle and keyboard navigation */
        setupNavigation();
    }

    function setupNavigation() {
        var navToggle = document.getElementById('navToggle');
        var navMenu = document.getElementById('navMenu');
        if (!navToggle || !navMenu) return;

        function closeMenu() {
            navToggle.classList.remove('active');
            navMenu.classList.remove('active');
            navToggle.setAttribute('aria-expanded', 'false');
            navToggle.focus();
        }

        function openMenu() {
            navToggle.classList.add('active');
            navMenu.classList.add('active');
            navToggle.setAttribute('aria-expanded', 'true');
            // Focus first link in drawer
            var firstLink = navMenu.querySelector('a');
            if (firstLink) firstLink.focus();
        }

        navToggle.addEventListener('click', function (e) {
            e.stopPropagation();
            var isOpen = navToggle.classList.contains('active');
            if (isOpen) {
                closeMenu();
            } else {
                openMenu();
            }
        });

        // Close on nav link click
        navMenu.querySelectorAll('.nav-link').forEach(function (link) {
            link.addEventListener('click', function () {
                if (navToggle.classList.contains('active')) {
                    closeMenu();
                }
            });
        });

        // Close on Esc key
        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape' && navToggle.classList.contains('active')) {
                closeMenu();
            }
        });

        // Close on outside click
        document.addEventListener('click', function (e) {
            if (navToggle.classList.contains('active') && !navMenu.contains(e.target) && !navToggle.contains(e.target)) {
                closeMenu();
            }
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', inject);
    } else {
        inject();
    }
})();
