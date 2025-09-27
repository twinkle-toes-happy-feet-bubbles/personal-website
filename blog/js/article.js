// Individual article functionality
const ArticleApp = (() => {
    let currentArticle = null;

    // DOM elements
    let loadingState, errorState, articleContainer;
    let articleTitle, articleDescription, ogTitle, ogDescription;
    let articleHeading, articleExcerpt, articleDate, articleReadTime, articleAuthor;
    let articleTags, articleBody, readingProgress;

    // Initialize DOM elements
    const initDOMElements = () => {
        loadingState = document.getElementById('loading-state');
        errorState = document.getElementById('error-state');
        articleContainer = document.getElementById('article-container');

        // Meta elements
        articleTitle = document.getElementById('article-title');
        articleDescription = document.getElementById('article-description');
        ogTitle = document.getElementById('og-title');
        ogDescription = document.getElementById('og-description');

        // Content elements
        articleHeading = document.getElementById('article-heading');
        articleExcerpt = document.getElementById('article-excerpt');
        articleDate = document.getElementById('article-date');
        articleReadTime = document.getElementById('article-read-time');
        articleAuthor = document.getElementById('article-author');
        articleTags = document.getElementById('article-tags');
        articleBody = document.getElementById('article-body');
        readingProgress = document.getElementById('reading-progress');
    };

    // Show/hide states
    const showLoading = () => {
        loadingState?.classList.remove('hidden');
        errorState?.classList.add('hidden');
        articleContainer?.classList.add('hidden');
    };

    const showError = () => {
        loadingState?.classList.add('hidden');
        errorState?.classList.remove('hidden');
        articleContainer?.classList.add('hidden');
    };

    const showArticle = () => {
        loadingState?.classList.add('hidden');
        errorState?.classList.add('hidden');
        articleContainer?.classList.remove('hidden');
    };

    // Get article ID from URL parameters
    const getArticleId = () => {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get('id');
    };

    // Format date for display
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    // Parse markdown using the MarkdownParser module
    const parseMarkdown = (content) => {
        if (typeof MarkdownParser !== 'undefined' && MarkdownParser.parseMarkdown) {
            return MarkdownParser.parseMarkdown(content);
        }

        // Fallback to basic implementation if MarkdownParser is not available
        return content
            .replace(/^### (.*$)/gim, '<h3>$1</h3>')
            .replace(/^## (.*$)/gim, '<h2>$1</h2>')
            .replace(/^# (.*$)/gim, '<h1>$1</h1>')
            .replace(/\*\*\*(.*?)\*\*\*/g, '<strong><em>$1</em></strong>')
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\*(.*?)\*/g, '<em>$1</em>')
            .replace(/```(\w+)?\n([\s\S]*?)```/g, '<pre><code>$2</code></pre>')
            .replace(/`([^`]+)`/g, '<code>$1</code>')
            .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>')
            .replace(/\n\n/g, '</p><p>')
            .replace(/\n/g, '<br>')
            .replace(/^(?!<[h|p|u|o|l|b|d])(.+)/gm, '<p>$1</p>')
            .replace(/^\- (.+)/gm, '<li>$1</li>')
            .replace(/(<li>.*<\/li>)/s, '<ul>$1</ul>')
            .replace(/<p><\/p>/g, '')
            .replace(/<p>(<h[1-6]>)/g, '$1')
            .replace(/(<\/h[1-6]>)<\/p>/g, '$1');
    };

    // Update page meta tags
    const updateMetaTags = (article) => {
        const title = `${article.title} - Prajyoth Reddy`;
        const fullUrl = window.location.href;

        // Update document title
        if (articleTitle) articleTitle.textContent = title;

        // Update meta description
        if (articleDescription) articleDescription.setAttribute('content', article.description);

        // Update Open Graph tags
        if (ogTitle) ogTitle.setAttribute('content', article.title);
        if (ogDescription) ogDescription.setAttribute('content', article.description);
        if (document.getElementById('og-url')) {
            document.getElementById('og-url').setAttribute('content', fullUrl);
        }

        // Update Twitter Card tags
        if (document.getElementById('twitter-title')) {
            document.getElementById('twitter-title').setAttribute('content', article.title);
        }
        if (document.getElementById('twitter-description')) {
            document.getElementById('twitter-description').setAttribute('content', article.description);
        }

        // Update canonical URL
        const canonicalLink = document.querySelector('link[rel="canonical"]');
        if (canonicalLink) {
            canonicalLink.setAttribute('href', fullUrl);
        }
        
        // Update structured data (JSON-LD)
        updateStructuredData(article, fullUrl);
    };
    
    // Update the structured data for the article
    const updateStructuredData = (article, url) => {
        const structuredData = {
            "@context": "https://schema.org",
            "@type": "Article",
            "mainEntityOfPage": {
                "@type": "WebPage",
                "@id": url
            },
            "headline": article.title,
            "description": article.description,
            "datePublished": article.date,
            "dateModified": article.metadata?.updated || article.date,
            "author": {
                "@type": "Person",
                "name": "Prajyoth Reddy M",
                "url": "https://prajyoth.pages.dev/"
            },
            "publisher": {
                "@type": "Person",
                "name": "Prajyoth Reddy M",
                "url": "https://prajyoth.pages.dev/",
                "logo": {
                    "@type": "ImageObject",
                    "url": "https://prajyoth.pages.dev/prajyothprofilepic.png"
                }
            },
            "image": "https://prajyoth.pages.dev/prajyothprofilepic.png",
            "articleBody": article.content ? article.content.substring(0, 200) + '...' : article.description,
            "keywords": article.tags ? article.tags.join(', ') : ''
        };
        
        const scriptElement = document.getElementById('article-structured-data');
        if (scriptElement) {
            scriptElement.textContent = JSON.stringify(structuredData);
        } else {
            // Create the structured data script if it doesn't exist
            const script = document.createElement('script');
            script.type = 'application/ld+json';
            script.id = 'article-structured-data';
            script.textContent = JSON.stringify(structuredData);
            document.head.appendChild(script);
        }
    };

    // Render article content
    const renderArticle = (article) => {
        if (!article) return;

        // Update meta tags FIRST, before updating other content
        updateMetaTags(article);

        // Update content
        if (articleHeading) articleHeading.textContent = article.title;
        if (articleExcerpt) articleExcerpt.textContent = article.description;
        if (articleDate) articleDate.textContent = formatDate(article.date);
        if (articleReadTime) articleReadTime.textContent = `${article.readTime} min read`;
        if (articleAuthor) articleAuthor.textContent = article.author;

        // Render tags
        if (articleTags && article.tags) {
            const tagsHtml = article.tags.map(tag =>
                `<span class="tag">${tag}</span>`
            ).join('');
            articleTags.innerHTML = tagsHtml;
        }

        // Render article content
        if (articleBody && article.content) {
            const htmlContent = parseMarkdown(article.content);
            articleBody.innerHTML = htmlContent;

            // Trigger syntax highlighting after content is rendered
            if (typeof MarkdownParser !== 'undefined' && MarkdownParser.highlightCode) {
                MarkdownParser.highlightCode();
            }
        }

        showArticle();

        // Initialize reading progress after content is rendered
        initReadingProgress();

        // Initialize comments system
        if (typeof CommentsApp !== 'undefined') {
            CommentsApp.init(article);
        }
    };

    // Initialize reading progress indicator
    const initReadingProgress = () => {
        if (!readingProgress || !articleBody) return;

        // Don't initialize reading progress on mobile devices to avoid scroll jank
        if (window.innerWidth < 768) {
            readingProgress.style.display = 'none';
            return;
        }

        const updateProgress = () => {
            const scrollTop = window.pageYOffset;
            const docHeight = document.body.scrollHeight - window.innerHeight;
            const scrollPercent = (scrollTop / docHeight) * 100;

            readingProgress.style.width = Math.min(scrollPercent, 100) + '%';
        };

        window.addEventListener('scroll', updateProgress);
        updateProgress(); // Initial call
    };

    // Load individual article
    const loadArticle = async (articleId) => {
        if (!articleId) {
            showError();
            return;
        }

        try {
            showLoading();

            const response = await fetch(`blog/data/posts/${articleId}.json`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const article = await response.json();

            // Check if article is published
            if (!article.published) {
                throw new Error('Article not published');
            }

            currentArticle = article;
            renderArticle(article);

        } catch (error) {
            console.error('Failed to load article:', error);
            showError();
        }
    };

    // Retry loading article
    const retry = () => {
        const articleId = getArticleId();
        loadArticle(articleId);
    };

    // Mobile-specific optimizations
    const setupMobileOptimizations = () => {
        // Improve touch scrolling on mobile
        if ('ontouchstart' in window) {
            document.body.style.webkitOverflowScrolling = 'touch';
        }

        // Handle mobile viewport height issues
        const setVH = () => {
            const vh = window.innerHeight * 0.01;
            document.documentElement.style.setProperty('--vh', `${vh}px`);
        };

        setVH();
        window.addEventListener('resize', setVH);
        window.addEventListener('orientationchange', () => {
            setTimeout(setVH, 100);
        });

        // Optimize code block scrolling on mobile
        const optimizeCodeBlocks = () => {
            const codeBlocks = document.querySelectorAll('pre code');
            codeBlocks.forEach(block => {
                const pre = block.parentElement;
                if (pre && window.innerWidth <= 768) {
                    pre.style.webkitOverflowScrolling = 'touch';

                    // Add touch scroll indicators
                    pre.addEventListener('scroll', () => {
                        const isScrollable = pre.scrollWidth > pre.clientWidth;
                        const isAtStart = pre.scrollLeft === 0;
                        const isAtEnd = pre.scrollLeft >= pre.scrollWidth - pre.clientWidth - 1;

                        if (isScrollable) {
                            pre.style.boxShadow = `
                                ${isAtStart ? '' : 'inset 10px 0 10px -10px rgba(0,0,0,0.3)'},
                                ${isAtEnd ? '' : 'inset -10px 0 10px -10px rgba(0,0,0,0.3)'}
                            `.replace(/,\s*,/g, ',').replace(/^,|,$/g, '');
                        }
                    });
                }
            });
        };

        // Run after content is loaded
        setTimeout(optimizeCodeBlocks, 500);
    };

    // Initialize the article app
    const init = () => {
        console.log('Article app initialized');
        initDOMElements();
        setupMobileOptimizations();

        const articleId = getArticleId();
        if (!articleId) {
            showError();
            return;
        }

        loadArticle(articleId);
    };

    // Make retry function available globally
    window.ArticleApp = { retry };

    return {
        init,
        retry,
        loadArticle
    };
})();

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', ArticleApp.init);