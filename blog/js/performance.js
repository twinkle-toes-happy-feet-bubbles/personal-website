// Performance optimizations for mobile and low-end devices
const PerformanceOptimizer = (() => {

    // Detect if device is likely low-end
    const isLowEndDevice = () => {
        // Check for various indicators of low-end devices
        const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
        const slowConnection = connection && (connection.effectiveType === 'slow-2g' || connection.effectiveType === '2g');
        const lowMemory = navigator.deviceMemory && navigator.deviceMemory < 4;
        const oldBrowser = !window.IntersectionObserver || !window.requestIdleCallback;

        return slowConnection || lowMemory || oldBrowser;
    };

    // Lazy load images
    const setupLazyLoading = () => {
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        if (img.dataset.src) {
                            img.src = img.dataset.src;
                            img.removeAttribute('data-src');
                            observer.unobserve(img);
                        }
                    }
                });
            });

            // Observe all images with data-src
            document.querySelectorAll('img[data-src]').forEach(img => {
                imageObserver.observe(img);
            });
        }
    };

    // Optimize animations for low-end devices
    const optimizeAnimations = () => {
        if (isLowEndDevice()) {
            // Reduce or disable animations
            const style = document.createElement('style');
            style.textContent = `
                *, *::before, *::after {
                    animation-duration: 0.01ms !important;
                    animation-iteration-count: 1 !important;
                    transition-duration: 0.01ms !important;
                }
                
                .blog-card {
                    animation: none !important;
                }
                
                .blog-card:hover {
                    transform: none !important;
                }
            `;
            document.head.appendChild(style);
        }
    };

    // Optimize scroll performance
    const optimizeScrolling = () => {
        let ticking = false;

        const updateScrollElements = () => {
            // Update reading progress if it exists
            const readingProgress = document.getElementById('reading-progress');
            if (readingProgress) {
                const scrollTop = window.pageYOffset;
                const docHeight = document.body.scrollHeight - window.innerHeight;
                const scrollPercent = (scrollTop / docHeight) * 100;
                readingProgress.style.width = Math.min(scrollPercent, 100) + '%';
            }

            ticking = false;
        };

        const requestScrollUpdate = () => {
            if (!ticking) {
                requestAnimationFrame(updateScrollElements);
                ticking = true;
            }
        };

        // Use passive listeners for better performance
        window.addEventListener('scroll', requestScrollUpdate, { passive: true });
    };

    // Preload critical resources
    const preloadCriticalResources = () => {
        // Preload fonts
        const fontPreload = document.createElement('link');
        fontPreload.rel = 'preload';
        fontPreload.href = './Prajyoth Reddy Mothi - Webpage_files/e4af272ccee01ff0-s.p.woff2';
        fontPreload.as = 'font';
        fontPreload.type = 'font/woff2';
        fontPreload.crossOrigin = 'anonymous';
        document.head.appendChild(fontPreload);

        // Preload critical CSS if not already loaded
        const criticalCSS = [
            './Prajyoth Reddy Mothi - Webpage_files/5b576904c612405e.css',
            './Prajyoth Reddy Mothi - Webpage_files/af5f735e1b8a2a31.css'
        ];

        criticalCSS.forEach(href => {
            if (!document.querySelector(`link[href="${href}"]`)) {
                const link = document.createElement('link');
                link.rel = 'preload';
                link.href = href;
                link.as = 'style';
                document.head.appendChild(link);
            }
        });
    };

    // Optimize for reduced motion preference
    const respectReducedMotion = () => {
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            const style = document.createElement('style');
            style.textContent = `
                *, *::before, *::after {
                    animation-duration: 0.01ms !important;
                    animation-iteration-count: 1 !important;
                    transition-duration: 0.01ms !important;
                    scroll-behavior: auto !important;
                }
            `;
            document.head.appendChild(style);
        }
    };

    // Memory management for long sessions
    const setupMemoryManagement = () => {
        // Clean up unused elements periodically
        const cleanup = () => {
            // Remove old article cards that are far from viewport
            const cards = document.querySelectorAll('.blog-card');
            const viewportHeight = window.innerHeight;
            const scrollTop = window.pageYOffset;

            cards.forEach((card, index) => {
                const rect = card.getBoundingClientRect();
                const distanceFromViewport = Math.abs(rect.top + scrollTop - scrollTop);

                // Keep elements within 3 viewport heights
                if (distanceFromViewport > viewportHeight * 3 && index > 10) {
                    // Mark for cleanup but don't remove immediately
                    card.dataset.cleanup = 'true';
                }
            });
        };

        // Run cleanup every 30 seconds
        setInterval(cleanup, 30000);
    };

    // Initialize all optimizations
    const init = () => {
        console.log('Performance optimizations initialized');

        // Run immediately
        respectReducedMotion();
        optimizeAnimations();
        preloadCriticalResources();

        // Run after DOM is ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                setupLazyLoading();
                optimizeScrolling();
                setupMemoryManagement();
            });
        } else {
            setupLazyLoading();
            optimizeScrolling();
            setupMemoryManagement();
        }
    };

    return {
        init,
        isLowEndDevice,
        optimizeAnimations,
        setupLazyLoading
    };
})();

// Initialize performance optimizations
PerformanceOptimizer.init();