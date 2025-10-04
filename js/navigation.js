// Fresh Navigation System
class Navigation {
    constructor() {
        this.sections = ['intro', 'education', 'experience', 'projects', 'skills', 'achievements', 'blog', 'connect'];
        this.currentSection = 'intro';
        this.isDesktop = window.innerWidth >= 1024;
        
        this.init();
    }
    
    init() {
        this.setupDesktopNav();
        this.setupMobileNav();
        this.setupScrollTracking();
        this.setupResizeListener();
    }
    
    setupDesktopNav() {
        const desktopNav = document.getElementById('main-nav');
        if (!desktopNav) return;
        
        // Add click handlers for desktop nav
        const navItems = desktopNav.querySelectorAll('.nav-item');
        navItems.forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                const section = item.getAttribute('data-section');
                this.scrollToSection(section);
            });
        });
    }
    
    setupMobileNav() {
        const menuBtn = document.getElementById('mobile-menu-btn');
        const overlay = document.getElementById('mobile-nav-overlay');
        const mobileNav = document.getElementById('mobile-nav');
        
        if (!menuBtn || !overlay || !mobileNav) return;
        
        // Mobile menu toggle
        menuBtn.addEventListener('click', () => {
            this.toggleMobileMenu();
        });
        
        // Close on overlay click
        overlay.addEventListener('click', () => {
            this.closeMobileMenu();
        });
        
        // Close on nav item click
        const mobileNavItems = mobileNav.querySelectorAll('.nav-item');
        mobileNavItems.forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                const section = item.getAttribute('data-section');
                this.scrollToSection(section);
                this.closeMobileMenu();
            });
        });
        
        // Close on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeMobileMenu();
            }
        });
    }
    
    setupScrollTracking() {
        // Use scroll-based detection which is more reliable
        let ticking = false;
        
        const updateActiveSection = () => {
            const scrollPos = window.scrollY + window.innerHeight / 3; // Look at upper third of viewport
            let activeSection = this.sections[0]; // Default to first section
            
            // Find which section we're currently in
            for (const sectionId of this.sections) {
                const section = document.getElementById(sectionId);
                if (section) {
                    const sectionTop = section.offsetTop;
                    const sectionBottom = sectionTop + section.offsetHeight;
                    
                    if (scrollPos >= sectionTop && scrollPos < sectionBottom) {
                        activeSection = sectionId;
                        break;
                    }
                }
            }
            
            this.setActiveSection(activeSection);
            ticking = false;
        };
        
        const onScroll = () => {
            if (!ticking) {
                requestAnimationFrame(updateActiveSection);
                ticking = true;
            }
        };
        
        // Initial check
        updateActiveSection();
        
        // Listen to scroll events
        window.addEventListener('scroll', onScroll, { passive: true });
    }
    
    setupResizeListener() {
        window.addEventListener('resize', () => {
            const wasDesktop = this.isDesktop;
            this.isDesktop = window.innerWidth >= 1024;
            
            // Close mobile menu when switching to desktop
            if (!wasDesktop && this.isDesktop) {
                this.closeMobileMenu();
            }
        });
    }
    
    scrollToSection(sectionId) {
        const section = document.getElementById(sectionId);
        if (section) {
            section.scrollIntoView({ 
                behavior: 'smooth',
                block: 'start'
            });
        }
    }
    
    setActiveSection(sectionId) {
        if (this.currentSection === sectionId) return;
        
        console.log('Switching active section from', this.currentSection, 'to', sectionId);
        this.currentSection = sectionId;
        
        // Update desktop nav
        const desktopNavItems = document.querySelectorAll('#main-nav .nav-item');
        desktopNavItems.forEach(item => {
            const itemSection = item.getAttribute('data-section');
            if (itemSection === sectionId) {
                item.classList.add('is-active');
            } else {
                item.classList.remove('is-active');
            }
        });
        
        // Update mobile nav
        const mobileNavItems = document.querySelectorAll('#mobile-nav .nav-item');
        mobileNavItems.forEach(item => {
            const itemSection = item.getAttribute('data-section');
            if (itemSection === sectionId) {
                item.classList.add('is-active');
            } else {
                item.classList.remove('is-active');
            }
        });
    }
    
    toggleMobileMenu() {
        const overlay = document.getElementById('mobile-nav-overlay');
        const mobileNav = document.getElementById('mobile-nav');
        
        if (overlay.classList.contains('active')) {
            this.closeMobileMenu();
        } else {
            this.openMobileMenu();
        }
    }
    
    openMobileMenu() {
        const overlay = document.getElementById('mobile-nav-overlay');
        const mobileNav = document.getElementById('mobile-nav');
        
        overlay.classList.add('active');
        mobileNav.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
    
    closeMobileMenu() {
        const overlay = document.getElementById('mobile-nav-overlay');
        const mobileNav = document.getElementById('mobile-nav');
        
        overlay.classList.remove('active');
        mobileNav.classList.remove('active');
        document.body.style.overflow = '';
    }
}

// Initialize navigation when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new Navigation();
});