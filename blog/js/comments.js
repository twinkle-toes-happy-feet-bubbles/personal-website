// Comments functionality using Giscus
const CommentsApp = (() => {
    let commentsLoaded = false;
    let currentArticle = null;

    // DOM elements
    let commentsSection, giscusContainer, commentsLoading, commentsError, retryButton;

    // Get current theme based on HTML class
    const getCurrentTheme = () => {
        return document.documentElement.classList.contains('dark') ? 'dark_high_contrast' : 'light';
    };

    // Get Giscus configuration from global config
    const getGiscusConfig = () => {
        let config;
        if (typeof BlogConfig !== 'undefined' && BlogConfig.giscus) {
            config = { ...BlogConfig.giscus };
        } else {
            // Fallback configuration
            config = {
                repo: 'prajyothreddy/prajyothreddy.github.io',
                repoId: 'R_kgDOL8vQdA',
                category: 'General',
                categoryId: 'DIC_kwDOL8vQdM4CfGqJ',
                mapping: 'pathname',
                strict: '0',
                reactionsEnabled: '1',
                emitMetadata: '0',
                inputPosition: 'bottom',
                theme: 'dark_high_contrast',
                lang: 'en',
                loading: 'lazy'
            };
        }
        
        // Always use current theme
        config.theme = getCurrentTheme();
        return config;
    };

    // Initialize DOM elements
    const initDOMElements = () => {
        commentsSection = document.getElementById('comments-section');
        giscusContainer = document.getElementById('giscus-container');
        commentsLoading = document.getElementById('comments-loading');
        commentsError = document.getElementById('comments-error');
        retryButton = document.getElementById('retry-comments');
    };

    // Show/hide comment states
    const showCommentsLoading = () => {
        if (commentsLoading) commentsLoading.classList.remove('hidden');
        if (commentsError) commentsError.classList.add('hidden');
        if (giscusContainer) giscusContainer.style.display = 'none';
    };

    const showCommentsError = () => {
        if (commentsLoading) commentsLoading.classList.add('hidden');
        if (commentsError) commentsError.classList.remove('hidden');
        if (giscusContainer) giscusContainer.style.display = 'none';
    };

    const showComments = () => {
        if (commentsLoading) commentsLoading.classList.add('hidden');
        if (commentsError) commentsError.classList.add('hidden');
        if (giscusContainer) giscusContainer.style.display = 'block';
    };

    // Load Giscus script dynamically
    const loadGiscusScript = () => {
        return new Promise((resolve, reject) => {
            const config = getGiscusConfig();

            // Remove existing Giscus script if any
            const existingScript = document.querySelector('script[src*="giscus"]');
            if (existingScript) {
                existingScript.remove();
            }

            // Clear the container
            if (giscusContainer) {
                giscusContainer.innerHTML = '';
            }

            // Create new Giscus script
            const script = document.createElement('script');
            script.src = 'https://giscus.app/client.js';
            script.setAttribute('data-repo', config.repo);
            script.setAttribute('data-repo-id', config.repoId);
            script.setAttribute('data-category', config.category);
            script.setAttribute('data-category-id', config.categoryId);
            script.setAttribute('data-mapping', config.mapping);
            script.setAttribute('data-strict', config.strict);
            script.setAttribute('data-reactions-enabled', config.reactionsEnabled);
            script.setAttribute('data-emit-metadata', config.emitMetadata);
            script.setAttribute('data-input-position', config.inputPosition);
            script.setAttribute('data-theme', config.theme);
            script.setAttribute('data-lang', config.lang);
            script.setAttribute('data-loading', config.loading);
            script.crossOrigin = 'anonymous';
            script.async = true;

            // Handle script load events
            script.onload = () => {
                console.log('Giscus script loaded successfully');
                commentsLoaded = true;

                // Wait a bit for Giscus to initialize
                setTimeout(() => {
                    showComments();
                    resolve();
                }, 1000);
            };

            script.onerror = (error) => {
                console.error('Failed to load Giscus script:', error);
                showCommentsError();
                reject(error);
            };

            // Append script to container
            if (giscusContainer) {
                giscusContainer.appendChild(script);
            } else {
                reject(new Error('Giscus container not found'));
            }
        });
    };

    // Initialize comments for an article
    const initComments = async (article) => {
        if (!article || !giscusContainer) return;

        currentArticle = article;
        showCommentsLoading();

        try {
            await loadGiscusScript();
        } catch (error) {
            console.error('Failed to initialize comments:', error);
            showCommentsError();
        }
    };

    // Retry loading comments
    const retryComments = () => {
        if (currentArticle) {
            initComments(currentArticle);
        }
    };

    // Setup event handlers
    const setupEventHandlers = () => {
        if (retryButton) {
            retryButton.addEventListener('click', retryComments);
        }
    };

    // Check if comments should be shown for this article
    const shouldShowComments = (article) => {
        // Only show comments for published articles
        return article && article.published && article.allowComments !== false;
    };

    // Initialize the comments app
    const init = (article) => {
        console.log('Comments app initialized');
        initDOMElements();
        setupEventHandlers();

        if (shouldShowComments(article)) {
            initComments(article);
        } else {
            // Hide comments section if not needed
            if (commentsSection) {
                commentsSection.style.display = 'none';
            }
        }
    };

    // Update theme (for future theme switching support)
    const updateTheme = (theme) => {
        // Update config if available
        if (typeof BlogConfig !== 'undefined' && BlogConfig.giscus) {
            BlogConfig.giscus.theme = theme;
        }

        // If comments are already loaded, send theme update message
        if (commentsLoaded && giscusContainer) {
            const iframe = giscusContainer.querySelector('iframe');
            if (iframe) {
                iframe.contentWindow.postMessage(
                    { giscus: { setConfig: { theme } } },
                    'https://giscus.app'
                );
            }
        }
    };

    return {
        init,
        retryComments,
        updateTheme,
        shouldShowComments
    };
})();

// Make functions available globally
window.CommentsApp = {
    retry: () => CommentsApp.retryComments(),
    updateTheme: (theme) => CommentsApp.updateTheme(theme)
};