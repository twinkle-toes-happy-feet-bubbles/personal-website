// Mobile navigation functionality
const MobileNav = (() => {
    let mobileMenuToggle, mobileNavOverlay, mainNav;
    let isOpen = false;

    // Initialize DOM elements
    const initDOMElements = () => {
        mobileMenuToggle = document.getElementById('mobile-menu-toggle');
        mobileNavOverlay = document.getElementById('mobile-nav-overlay');
        mainNav = document.getElementById('main-nav');
    };

    // Toggle mobile navigation
    const toggleMobileNav = () => {
        isOpen = !isOpen;

        if (isOpen) {
            openMobileNav();
        } else {
            closeMobileNav();
        }
    };

    // Open mobile navigation
    const openMobileNav = () => {
        if (mainNav) mainNav.classList.add('mobile-open');
        if (mobileNavOverlay) mobileNavOverlay.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
        isOpen = true;
    };

    // Close mobile navigation
    const closeMobileNav = () => {
        if (mainNav) mainNav.classList.remove('mobile-open');
        if (mobileNavOverlay) mobileNavOverlay.classList.add('hidden');
        document.body.style.overflow = '';
        isOpen = false;
    };

    // Setup event handlers
    const setupEventHandlers = () => {
        // Toggle button
        if (mobileMenuToggle) {
            mobileMenuToggle.addEventListener('click', toggleMobileNav);
        }

        // Overlay click to close
        if (mobileNavOverlay) {
            mobileNavOverlay.addEventListener('click', closeMobileNav);
        }

        // Close on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && isOpen) {
                closeMobileNav();
            }
        });

        // Close when navigation item is clicked
        if (mainNav) {
            mainNav.addEventListener('click', (e) => {
                if (e.target.tagName === 'BUTTON' && isOpen) {
                    // Small delay to allow navigation to complete
                    setTimeout(closeMobileNav, 100);
                }
            });
        }

        // Close on window resize to desktop
        window.addEventListener('resize', () => {
            if (window.innerWidth >= 1024 && isOpen) {
                closeMobileNav();
            }
        });
    };

    // Initialize mobile navigation
    const init = () => {
        // Only initialize on mobile devices
        if (window.innerWidth < 1024) {
            console.log('Mobile navigation initialized');
            initDOMElements();
            setupEventHandlers();
        }
    };

    return {
        init,
        toggle: toggleMobileNav,
        open: openMobileNav,
        close: closeMobileNav
    };
})();

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', MobileNav.init);

// Make available globally
window.MobileNav = MobileNav;