// Blog configuration
const BlogConfig = {
    // Giscus Comments Configuration
    // To set up Giscus for your repository:
    // 1. Go to https://giscus.app/
    // 2. Enter your repository details
    // 3. Configure your preferences
    // 4. Copy the generated configuration here
    giscus: {
        repo: 'prajyothreddy/prajyothreddy.github.io', // Your GitHub repository (username/repo-name)
        repoId: 'R_kgDOL8vQdA', // Your repository ID (get from giscus.app)
        category: 'General', // Discussion category name
        categoryId: 'DIC_kwDOL8vQdM4CfGqJ', // Discussion category ID (get from giscus.app)
        mapping: 'pathname', // How to map pages to discussions
        strict: '0', // Use strict title matching
        reactionsEnabled: '1', // Enable reactions
        emitMetadata: '0', // Emit discussion metadata
        inputPosition: 'bottom', // Comment input position
        theme: 'dark', // Theme (dark/light/auto)
        lang: 'en', // Language
        loading: 'lazy' // Loading behavior
    },

    // Blog Settings
    blog: {
        articlesPerPage: 5, // Number of articles per page
        enableComments: true, // Global comments toggle
        enableSearch: true, // Enable search functionality
        enableTagFiltering: true // Enable tag filtering
    },

    // Site Information
    site: {
        title: 'Prajyoth Reddy Mothi - Blog',
        description: 'Thoughts on technology, AI, web development, and building cool stuff.',
        author: 'Prajyoth Reddy Mothi',
        url: 'https://prajyothreddy.github.io'
    }
};