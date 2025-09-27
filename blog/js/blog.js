// Main blog functionality
const BlogApp = (() => {
    let articles = [];
    let filteredArticles = [];
    let allTags = [];
    let activeTags = [];
    let searchQuery = '';

    // Pagination state
    let currentPage = 1;
    let articlesPerPage = 5;
    let totalPages = 1;

    // DOM elements - will be available after DOM loads
    let loadingState, errorState, articlesContainer, emptyState;
    let searchInput, tagFilters, clearFilters, resultsInfo;
    let paginationContainer, prevPageBtn, nextPageBtn, pageInfo, pageNumbers;

    // Initialize DOM elements
    const initDOMElements = () => {
        loadingState = document.getElementById('loading-state');
        errorState = document.getElementById('error-state');
        articlesContainer = document.getElementById('articles-container');
        emptyState = document.getElementById('empty-state');
        searchInput = document.getElementById('search-input');
        tagFilters = document.getElementById('tag-filters');
        clearFilters = document.getElementById('clear-filters');
        resultsInfo = document.getElementById('results-info');
        paginationContainer = document.getElementById('pagination-container');
        prevPageBtn = document.getElementById('prev-page');
        nextPageBtn = document.getElementById('next-page');
        pageInfo = document.getElementById('page-info');
        pageNumbers = document.getElementById('page-numbers');
    };

    // Show/hide states
    const showLoading = () => {
        loadingState?.classList.remove('hidden');
        errorState?.classList.add('hidden');
        articlesContainer?.classList.add('hidden');
        emptyState?.classList.add('hidden');
    };

    const showError = () => {
        loadingState?.classList.add('hidden');
        errorState?.classList.remove('hidden');
        articlesContainer?.classList.add('hidden');
        emptyState?.classList.add('hidden');
    };

    const showArticles = () => {
        loadingState?.classList.add('hidden');
        errorState?.classList.add('hidden');
        articlesContainer?.classList.remove('hidden');
        emptyState?.classList.add('hidden');
        paginationContainer?.classList.remove('hidden');
    };

    const showEmpty = () => {
        loadingState?.classList.add('hidden');
        errorState?.classList.add('hidden');
        articlesContainer?.classList.add('hidden');
        emptyState?.classList.remove('hidden');
        paginationContainer?.classList.add('hidden');
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

    // Create article card HTML
    const createArticleCard = (article) => {
        const tagsHtml = article.tags.map(tag =>
            `<span class="tag">${tag}</span>`
        ).join('');

        return `
      <div class="blog-card group grid lg:grid-cols-12 gap-8 py-8 border-b border-border/50 hover:border-border transition-colors duration-500" 
           onclick="navigateToArticle('${article.id}')">
        <div class="lg:col-span-3">
          <div class="text-sm text-muted-foreground font-sans">${formatDate(article.date)}</div>
          <div class="text-xs text-muted-foreground font-mono mt-1">${article.readTime} min read</div>
        </div>
        <div class="lg:col-span-6 space-y-3">
          <h3 class="text-2xl font-light text-foreground group-hover:text-muted-foreground transition-colors duration-500 font-sans">
            ${article.title}
          </h3>
          <p class="text-muted-foreground leading-relaxed font-sans">
            ${article.excerpt}
          </p>
          <div class="flex flex-wrap gap-1 mt-3">
            ${tagsHtml}
          </div>
        </div>
        <div class="lg:col-span-3 flex items-center justify-end">
          <span class="px-3 py-1 text-xs border border-border rounded-full font-mono group-hover:border-muted-foreground/50 transition-colors duration-500">
            Read More →
          </span>
        </div>
      </div>
    `;
    };

    // Navigate to individual article
    const navigateToArticle = (articleId) => {
        window.location.href = `article.html?id=${articleId}`;
    };

    // Extract all unique tags from articles
    const extractTags = () => {
        const tagSet = new Set();
        articles.forEach(article => {
            if (article.tags) {
                article.tags.forEach(tag => tagSet.add(tag));
            }
        });
        allTags = Array.from(tagSet).sort();
    };

    // Create tag filter buttons
    const renderTagFilters = () => {
        if (!tagFilters || allTags.length === 0) return;

        const tagButtons = allTags.map(tag => {
            const count = articles.filter(article =>
                article.tags && article.tags.includes(tag)
            ).length;

            return `
        <button 
          class="tag-filter" 
          data-tag="${tag}"
          onclick="BlogApp.toggleTag('${tag}')"
        >
          ${tag}
          <span class="count">(${count})</span>
        </button>
      `;
        }).join('');

        tagFilters.innerHTML = tagButtons;
    };

    // Filter articles based on search and tags
    const filterArticles = () => {
        let filtered = articles.slice(); // Start with all articles

        // Apply search filter
        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase();
            filtered = filtered.filter(article =>
                article.title.toLowerCase().includes(query) ||
                article.excerpt.toLowerCase().includes(query) ||
                (article.tags && article.tags.some(tag => tag.toLowerCase().includes(query)))
            );
        }

        // Apply tag filters
        if (activeTags.length > 0) {
            filtered = filtered.filter(article =>
                article.tags && activeTags.every(tag => article.tags.includes(tag))
            );
        }

        // Sort by date (newest first)
        filteredArticles = filtered.sort((a, b) => new Date(b.date) - new Date(a.date));

        // Reset to first page when filtering
        currentPage = 1;

        // Calculate pagination
        calculatePagination();

        updateResultsInfo();
        renderFilteredArticles();
        renderPagination();
    };

    // Calculate pagination values
    const calculatePagination = () => {
        totalPages = Math.ceil(filteredArticles.length / articlesPerPage);
        if (currentPage > totalPages) {
            currentPage = Math.max(1, totalPages);
        }
    };

    // Get articles for current page
    const getCurrentPageArticles = () => {
        const startIndex = (currentPage - 1) * articlesPerPage;
        const endIndex = startIndex + articlesPerPage;
        return filteredArticles.slice(startIndex, endIndex);
    };

    // Go to specific page
    const goToPage = (page) => {
        if (page < 1 || page > totalPages) return;

        currentPage = page;
        renderFilteredArticles();
        renderPagination();

        // Scroll to top of articles section
        if (articlesContainer) {
            articlesContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    };

    // Update results information
    const updateResultsInfo = () => {
        if (!resultsInfo) return;

        const totalPublished = articles.length;
        const filteredCount = filteredArticles.length;

        if (searchQuery.trim() || activeTags.length > 0) {
            resultsInfo.textContent = `Showing ${filteredCount} of ${totalPublished} articles`;
            resultsInfo.classList.remove('hidden');
        } else {
            resultsInfo.classList.add('hidden');
        }

        // Show/hide clear filters button
        if (clearFilters) {
            if (activeTags.length > 0) {
                clearFilters.classList.remove('hidden');
            } else {
                clearFilters.classList.add('hidden');
            }
        }
    };

    // Render pagination controls
    const renderPagination = () => {
        if (!paginationContainer || filteredArticles.length === 0) {
            paginationContainer?.classList.add('hidden');
            return;
        }

        // Show pagination only if there are multiple pages
        if (totalPages <= 1) {
            paginationContainer.classList.add('hidden');
            return;
        }

        paginationContainer.classList.remove('hidden');

        // Update previous/next buttons
        if (prevPageBtn) {
            if (currentPage <= 1) {
                prevPageBtn.classList.add('disabled');
            } else {
                prevPageBtn.classList.remove('disabled');
            }
        }

        if (nextPageBtn) {
            if (currentPage >= totalPages) {
                nextPageBtn.classList.add('disabled');
            } else {
                nextPageBtn.classList.remove('disabled');
            }
        }

        // Update page info
        if (pageInfo) {
            const startItem = (currentPage - 1) * articlesPerPage + 1;
            const endItem = Math.min(currentPage * articlesPerPage, filteredArticles.length);
            pageInfo.textContent = `${startItem}-${endItem} of ${filteredArticles.length}`;
        }

        // Render page numbers
        renderPageNumbers();
    };

    // Render page number buttons
    const renderPageNumbers = () => {
        if (!pageNumbers) return;

        const maxVisiblePages = 5;
        let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
        let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

        // Adjust start page if we're near the end
        if (endPage - startPage + 1 < maxVisiblePages) {
            startPage = Math.max(1, endPage - maxVisiblePages + 1);
        }

        let pagesHtml = '';

        // First page and ellipsis
        if (startPage > 1) {
            pagesHtml += `<button class="page-number" onclick="BlogApp.goToPage(1)">1</button>`;
            if (startPage > 2) {
                pagesHtml += `<span class="page-ellipsis">...</span>`;
            }
        }

        // Page numbers
        for (let i = startPage; i <= endPage; i++) {
            const activeClass = i === currentPage ? ' active' : '';
            pagesHtml += `<button class="page-number${activeClass}" onclick="BlogApp.goToPage(${i})">${i}</button>`;
        }

        // Last page and ellipsis
        if (endPage < totalPages) {
            if (endPage < totalPages - 1) {
                pagesHtml += `<span class="page-ellipsis">...</span>`;
            }
            pagesHtml += `<button class="page-number" onclick="BlogApp.goToPage(${totalPages})">${totalPages}</button>`;
        }

        pageNumbers.innerHTML = pagesHtml;
    };

    // Render filtered articles
    const renderFilteredArticles = () => {
        if (!articlesContainer) return;

        if (filteredArticles.length === 0) {
            if (searchQuery.trim() || activeTags.length > 0) {
                articlesContainer.innerHTML = `
          <div class="text-center py-16">
            <div class="text-muted-foreground font-sans">No articles match your search criteria.</div>
            <button onclick="BlogApp.clearAllFilters()" class="mt-4 px-4 py-2 text-sm border border-border rounded hover:bg-muted-foreground/10 transition-colors">
              Clear filters
            </button>
          </div>
        `;
                paginationContainer?.classList.add('hidden');
            } else {
                showEmpty();
            }
            return;
        }

        // Get articles for current page
        const pageArticles = getCurrentPageArticles();
        const articlesHtml = pageArticles.map(createArticleCard).join('');
        articlesContainer.innerHTML = articlesHtml;
        showArticles();
    };

    // Render articles (main function)
    const renderArticles = () => {
        if (!articlesContainer) return;

        if (articles.length === 0) {
            showEmpty();
            return;
        }

        // Extract tags and render filters
        extractTags();
        renderTagFilters();

        // Initial filter (no search, no tag filters)
        filterArticles();
    };

    // Load articles from data
    const loadArticles = () => {
        try {
            showLoading();

            console.log('Checking for articles data...', window.articlesData);

            // Use the articles data loaded from articles.js
            if (window.articlesData && window.articlesData.articles) {
                articles = window.articlesData.articles;
                console.log('Loaded articles:', articles.length);
                renderArticles();
            } else {
                console.error('Articles data not available. Window.articlesData:', window.articlesData);
                throw new Error('Articles data not found');
            }
        } catch (error) {
            console.error('Failed to load articles:', error);
            showError();
        }
    };

    // Retry loading articles
    const retry = () => {
        loadArticles();
    };

    // Event handlers
    const setupEventHandlers = () => {
        // Search input handler
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                searchQuery = e.target.value;
                filterArticles();
            });
        }

        // Clear filters handler
        if (clearFilters) {
            clearFilters.addEventListener('click', clearAllFilters);
        }
    };

    // Toggle tag filter
    const toggleTag = (tag) => {
        const index = activeTags.indexOf(tag);
        if (index > -1) {
            activeTags.splice(index, 1);
        } else {
            activeTags.push(tag);
        }

        // Update tag button states
        updateTagButtonStates();
        filterArticles();
    };

    // Update tag button visual states
    const updateTagButtonStates = () => {
        if (!tagFilters) return;

        const tagButtons = tagFilters.querySelectorAll('.tag-filter');
        tagButtons.forEach(button => {
            const tag = button.dataset.tag;
            if (activeTags.includes(tag)) {
                button.classList.add('active');
            } else {
                button.classList.remove('active');
            }
        });
    };

    // Clear all filters
    const clearAllFilters = () => {
        activeTags = [];
        searchQuery = '';
        currentPage = 1;
        if (searchInput) searchInput.value = '';
        updateTagButtonStates();
        filterArticles();
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

        // Optimize search input for mobile
        if (searchInput && window.innerWidth <= 768) {
            searchInput.addEventListener('focus', () => {
                // Prevent zoom on iOS
                searchInput.style.fontSize = '16px';
            });

            searchInput.addEventListener('blur', () => {
                searchInput.style.fontSize = '';
            });
        }
        
        // Disable smooth scrolling on mobile devices to improve performance
        if (window.innerWidth < 768) {
            // Override any CSS scroll-behavior for mobile
            const style = document.createElement('style');
            style.textContent = `
                html {
                    scroll-behavior: auto !important;
                }
            `;
            document.head.appendChild(style);
        }
    };

    // Initialize the blog app
    const init = () => {
        console.log('Blog app initialized');
        initDOMElements();
        setupEventHandlers();
        setupMobileOptimizations();

        // Wait a bit for articles.js to load, then try loading articles
        setTimeout(() => {
            loadArticles();
        }, 100);
    };

    // Make functions available globally
    window.navigateToArticle = navigateToArticle;
    window.BlogApp = {
        retry,
        toggleTag,
        clearAllFilters,
        goToPage,
        currentPage: () => currentPage,
        totalPages: () => totalPages
    };

    return {
        init,
        retry,
        loadArticles,
        toggleTag,
        clearAllFilters,
        goToPage
    };
})();

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', BlogApp.init);