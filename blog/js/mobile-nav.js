// Mobile navigation functionality
const MobileNav = (() => {
    let mobileMenuToggle, mobileNavOverlay, mainNav;
    let isOpen = false;
    const SAFE_MARGIN = 16;
    const MIN_PANEL_HEIGHT = 220;
    let viewportListenersBound = false;

    const isDesktop = () => window.innerWidth >= 1024;

    const getViewportMetrics = () => {
        const viewport = window.visualViewport;
        const top = viewport ? viewport.offsetTop : 0;
        const height = viewport ? viewport.height : window.innerHeight;
    const bottomInset = viewport ? Math.max(0, window.innerHeight - viewport.height - viewport.offsetTop) : 0;
    return { top, height, bottomInset };
    };

    const updateMobileNavLayout = () => {
        if (!isOpen || !mainNav) {
            return;
        }

        requestAnimationFrame(() => {
            if (!isOpen || !mainNav) {
                return;
            }

            const { height: viewportHeight, top: viewportTop, bottomInset } = getViewportMetrics();
            const usableHeight = Math.max(
                MIN_PANEL_HEIGHT,
                viewportHeight - (SAFE_MARGIN * 2) - bottomInset
            );
            const contentHeight = mainNav.scrollHeight;
            const targetHeight = Math.min(usableHeight, Math.max(MIN_PANEL_HEIGHT, contentHeight));

            mainNav.style.setProperty('--mobile-nav-max-height', `${Math.round(targetHeight)}px`);

            requestAnimationFrame(() => {
                if (!isOpen || !mainNav) {
                    return;
                }

                const rect = mainNav.getBoundingClientRect();
                const panelHeight = Math.max(MIN_PANEL_HEIGHT, Math.min(rect.height || targetHeight, targetHeight));
                const halfPanel = panelHeight / 2;

                const idealCenter = viewportTop + viewportHeight / 2;
                const minCenter = viewportTop + SAFE_MARGIN + halfPanel;
                const maxCenter = viewportTop + viewportHeight - SAFE_MARGIN - bottomInset - halfPanel;

                let clampedCenter = idealCenter;
                if (minCenter <= maxCenter) {
                    clampedCenter = Math.max(minCenter, Math.min(maxCenter, idealCenter));
                } else {
                    clampedCenter = minCenter;
                }

                mainNav.style.setProperty('--mobile-nav-top', `${Math.round(clampedCenter)}px`);
            });
        });
    };

    const bindViewportListeners = () => {
        if (viewportListenersBound || !window.visualViewport) {
            return;
        }

        window.visualViewport.addEventListener('resize', updateMobileNavLayout);
        window.visualViewport.addEventListener('scroll', updateMobileNavLayout);
        viewportListenersBound = true;
    };

    // Initialize DOM elements
    const initDOMElements = () => {
        mobileMenuToggle = document.getElementById('menuBtn');
        mobileNavOverlay = document.getElementById('mobile-nav-overlay');
        mainNav = document.getElementById('main-nav');

        // Log missing elements for debugging
        if (!mobileMenuToggle) console.warn('Mobile nav: menuBtn element not found');
        if (!mobileNavOverlay) console.warn('Mobile nav: mobile-nav-overlay element not found');
        if (!mainNav) console.warn('Mobile nav: main-nav element not found');
    };

    // Toggle mobile navigation
    const toggleMobileNav = () => {
        if (isDesktop()) {
            return;
        }

        if (isOpen) {
            closeMobileNav();
        } else {
            openMobileNav();
        }
    };

    // Open mobile navigation
    const openMobileNav = () => {
        if (isDesktop()) {
            return;
        }

        if (mainNav) {
            mainNav.classList.add('mobile-open');
            mainNav.scrollTop = 0;
            mainNav.focus({ preventScroll: true });
        }
        if (mobileNavOverlay) mobileNavOverlay.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
        document.body.classList.add('mobile-nav-open');
        if (mobileMenuToggle) {
            mobileMenuToggle.setAttribute('aria-expanded', 'true');
        }
        isOpen = true;
        updateMobileNavLayout();
        setTimeout(updateMobileNavLayout, 80);
        setTimeout(updateMobileNavLayout, 180);
    };

    // Close mobile navigation
    const closeMobileNav = () => {
        if (mainNav) {
            mainNav.classList.remove('mobile-open');
            mainNav.style.removeProperty('--mobile-nav-top');
            mainNav.style.removeProperty('--mobile-nav-max-height');
            mainNav.scrollTop = 0;
        }
        if (mobileNavOverlay) mobileNavOverlay.classList.add('hidden');
        document.body.style.overflow = '';
        document.body.classList.remove('mobile-nav-open');
        if (mobileMenuToggle) {
            mobileMenuToggle.setAttribute('aria-expanded', 'false');
            if (window.innerWidth < 1024) {
                mobileMenuToggle.focus({ preventScroll: true });
            }
        }
        isOpen = false;
    };

    // Setup event handlers
    const setupEventHandlers = () => {
        // Toggle button
        if (mobileMenuToggle) {
            mobileMenuToggle.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                toggleMobileNav();
            });
        } else {
            console.warn('Mobile nav: Cannot setup toggle - menuBtn not found');
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
                const navItem = e.target.closest('[data-nav-item]');
                if (navItem && isOpen) {
                    setTimeout(closeMobileNav, 120);
                }
            });
        }

        // Close on window resize to desktop
        window.addEventListener('resize', () => {
            if (isDesktop()) {
                if (isOpen) {
                    closeMobileNav();
                }
            } else if (isOpen) {
                updateMobileNavLayout();
            }
        });

        window.addEventListener('scroll', () => {
            if (!isDesktop() && isOpen) {
                updateMobileNavLayout();
            }
        }, { passive: true });

        bindViewportListeners();
    };

    // Initialize mobile navigation
    const init = () => {
    console.debug('Mobile navigation initializing...');
        initDOMElements();
        
        // Ensure mobile nav is closed on desktop
        if (isDesktop() && mainNav && mainNav.classList.contains('mobile-open')) {
            closeMobileNav();
        }
        
        // Retry if key elements not found
        if (!mobileMenuToggle) {
            console.debug('Mobile nav: Retrying initialization in 100ms');
            setTimeout(() => {
                initDOMElements();
                setupEventHandlers();
                // Check again after retry
                if (isDesktop() && mainNav && mainNav.classList.contains('mobile-open')) {
                    closeMobileNav();
                }
            }, 100);
        } else {
            setupEventHandlers();
        }
        
    console.debug('Mobile navigation initialized');
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

// Also run on window load to ensure everything is properly initialized
window.addEventListener('load', () => {
    // Force close mobile nav if on desktop
    const isDesktop = () => window.innerWidth >= 1024;
    const mainNav = document.getElementById('main-nav');
    
    if (isDesktop() && mainNav && mainNav.classList.contains('mobile-open')) {
        MobileNav.close();
    }
});

// Make available globally
window.MobileNav = MobileNav;